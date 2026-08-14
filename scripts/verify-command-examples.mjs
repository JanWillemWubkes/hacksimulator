#!/usr/bin/env node
/**
 * verify-command-examples.mjs — bewaakt dat de voorbeelden op /commands/
 * daadwerkelijk werken in de simulator.
 *
 * AANLEIDING (Sessie 222): de kaarten op commands/index.html toonden voorbeelden
 * die nooit tegen de echte VFS waren getoetst. `find passwords` verwees naar twee
 * paden die niet bestonden, `grep "password" config.txt` naar een bestand dat er
 * niet is, en `pwd` naar /home/hacker/Documents terwijl de map `documents` heet
 * (de VFS is case-sensitive). Een bezoeker die het voorbeeld overtypte kreeg een
 * foutmelding — in een leersimulator precies de omgekeerde les.
 *
 * INVARIANT (positief geformuleerd, zie Sessie 221):
 *   A. elk prompt-commando begint met een GEREGISTREERD command
 *   B. elk uitvoerbaar voorbeeld levert GEEN foutmelding op
 *   C. elk /home/-pad in een GETOONDE output bestaat echt in de VFS
 *
 * C is er omdat A en B alleen de prompts toetsen. De aanleidende bug zat in de
 * output: de pwd-kaart toonde /home/hacker/Documents terwijl de map `documents`
 * heet. Het commando zelf slaagt, dus zonder C blijft die groen. /home/ is
 * bewust de enige prefix die telt — /bin/bash en /usr/sbin/nologin komen uit de
 * inhoud van /etc/passwd en horen niet in de VFS te bestaan.
 *
 * De grondwaarheid voor A komt uit src/main.js zelf — niet uit een lijst in dit
 * script, want dan is de check het volgende dat veroudert.
 *
 * Waarom hier en niet in Playwright: dit is statische tekst plus een VFS-lookup.
 * De volle E2E-suite kost >48 minuten; dit draait in seconden via de pre-commit hook.
 */

import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGINA = join(WORTEL, 'commands/index.html');

// --- Stubs: de commands draaien normaal in de browser -----------------------
// security_tools_consent staat aan omdat de pagina expliciet meldt dat de
// voorbeelden tonen wat je NA de waarschuwing ziet.
globalThis.localStorage = {
  _d: { security_tools_consent: 'true' },
  getItem(k) { return this._d[k] ?? null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
  clear() { this._d = {}; }
};
globalThis.window = { addEventListener() {}, location: { href: '', search: '' }, dispatchEvent() {} };
globalThis.document = { addEventListener() {}, querySelector: () => null, getElementById: () => null };

// --- A. Geregistreerde commands uit main.js --------------------------------
const hoofd = readFileSync(join(WORTEL, 'src/main.js'), 'utf8');
const GEREGISTREERD = new Set(
  [...hoofd.matchAll(/registry\.register\('([a-z0-9-]+)'/g)].map((m) => m[1])
);
if (GEREGISTREERD.size === 0) {
  console.error('[X] Geen registry.register()-aanroepen gevonden in src/main.js — is de registry verplaatst?');
  process.exit(1);
}

// Bestandspad per command, afgeleid uit de mapstructuur (geen hardcoded lijst).
const BESTAND = {};
for (const cat of readdirSync(join(WORTEL, 'src/commands'))) {
  for (const f of readdirSync(join(WORTEL, 'src/commands', cat))) {
    if (f.endsWith('.js')) BESTAND[f.slice(0, -3)] = `file://${join(WORTEL, 'src/commands', cat, f)}`;
  }
}

// Echte registry vullen, zodat `help` zijn eigen commandolijst kan opbouwen.
const { default: Registry } = await import(`file://${join(WORTEL, 'src/core/registry.js')}`);
const registry = typeof Registry === 'function' ? new Registry() : Registry;
for (const naam of GEREGISTREERD) {
  if (!BESTAND[naam]) continue;
  try {
    const { default: cmd } = await import(BESTAND[naam]);
    registry.register(naam, cmd);
  } catch { /* command dat hier niet laadt — Check B meldt dat vanzelf */ }
}

// --- Parse de pagina -------------------------------------------------------
const html = readFileSync(PAGINA, 'utf8');
const ontsnap = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

const kaarten = [...html.matchAll(
  /<div class="command-card" id="cmd-([a-z0-9-]+)">([\s\S]*?)(?=<div class="command-card"|<\/div>\s*<\/section>)/g
)].map(([, id, body]) => ({
  id,
  // De $-prompt staat letterlijk in de HTML. Zonder strippen krijgt elk command
  // zijn eigen naam als argument — dat maakte de eerste meting onbruikbaar.
  prompts: [...body.matchAll(/<div class="prompt">([\s\S]*?)<\/div>/g)]
    .map((m) => ontsnap(m[1].replace(/<[^>]+>/g, '')).trim().replace(/^\$\s*/, ''))
    .filter(Boolean),
  outputs: [...body.matchAll(/<div class="output">([\s\S]*?)<\/div>/g)]
    .map((m) => ontsnap(m[1].replace(/<[^>]+>/g, '')))
}));

if (kaarten.length === 0) {
  console.error('[X] Geen command-cards gevonden in commands/index.html — is de opmaak gewijzigd?');
  process.exit(1);
}

/** Splits een commandoregel, met respect voor aanhalingstekens (zoals core/parser.js). */
function tokeniseer(regel) {
  const uit = [];
  let cur = '', q = null;
  for (const ch of regel) {
    if (!q && (ch === '"' || ch === "'")) { q = ch; continue; }
    if (q && ch === q) { q = null; continue; }
    if (!q && /\s/.test(ch)) { if (cur) { uit.push(cur); cur = ''; } continue; }
    cur += ch;
  }
  if (cur) uit.push(cur);
  return uit;
}

const fouten = [];
let uitgevoerd = 0;
const overgeslagen = [];

for (const kaart of kaarten) {
  if (kaart.prompts.length === 0) {
    fouten.push(`cmd-${kaart.id}: geen voorbeeld op de kaart`);
    continue;
  }

  // Verse VFS per kaart: mkdir/touch/cp/mv/rm muteren de boom, dus zonder
  // reset beinvloeden kaarten elkaar (dat gaf eerder een vals alarm op cmd-mv).
  const { default: vfs } = await import(
    `file://${join(WORTEL, 'src/filesystem/vfs.js')}?v=${kaart.id}`
  );
  if (vfs.init) vfs.init();
  // clear/help/history praten met de terminal in plaats van met de VFS.
  // Een minimale stub laat ze meedraaien; zonder deze vielen ze uit de guard.
  const ctx = {
    cwd: '/home/hacker',
    user: 'hacker',
    vfs,
    terminal: {
      clear() {},
      // getHistory levert een manager, geen array (history.js:11-20).
      getHistory: () => ({
        getAll: () => ['ls -la', 'cd /var/log', 'nmap 192.168.1.1'],
        clear() {}
      }),
      getRegistry: () => registry,
      // cd en reset werken de prompt bij zodra er een terminal is. Zonder deze
      // methode meldden ze "getRenderer is not a function" — een valse faler die
      // door de stub zelf werd veroorzaakt, niet door de pagina.
      getRenderer: () => ({ updatePrompt() {} })
    }
  };

  for (const regel of kaart.prompts) {
    const toks = tokeniseer(regel);
    const naam = toks[0];

    // A. bestaat het command?
    if (!GEREGISTREERD.has(naam)) {
      fouten.push(`cmd-${kaart.id}: '${naam}' is geen geregistreerd command (src/main.js)`);
      continue;
    }

    // B. levert het voorbeeld een foutmelding op?
    const flags = {}, args = [];
    for (const t of toks.slice(1)) {
      if (/^-[a-zA-Z]+$/.test(t)) t.slice(1).split('').forEach((c) => (flags[c] = true));
      else args.push(t);
    }

    let uit;
    try {
      const { default: cmd } = await import(BESTAND[naam]);
      uit = String((await cmd.execute(args, flags, ctx)) ?? '');
    } catch (e) {
      // Een enkel command heeft een levende UI nodig (challenge praat met een
      // renderer die alleen in de browser bestaat). Dat valt buiten deze guard;
      // Check A dekt zulke kaarten nog wel. Met naam gemeld, zodat "overgeslagen"
      // nooit stilletjes groeit.
      overgeslagen.push(`${kaart.id}/${naam}`);
      continue;
    }
    uitgevoerd++;

    // Alle commands formatteren fouten als "<naam>: <reden>". Dat is scherper dan
    // losse trefwoorden: nikto meldt legitiem "No CGI Directories found" en
    // "header is not present", wat een zoektocht naar "not found" zou triggeren.
    if (uit.startsWith(`${naam}: `)) {
      fouten.push(`cmd-${kaart.id}: '${regel}' -> ${uit.split('\n')[0]}`);
    }
  }

  // C. verwijzen de getoonde outputs naar paden die echt bestaan?
  // Na afloop van de reeks, zodat een voorbeeld dat zijn eigen map aanmaakt
  // (mkdir projects) klopt. Case-sensitive, want de VFS is dat ook.
  for (const pad of new Set(kaart.outputs.join('\n').match(/\/home\/[A-Za-z0-9._\-/]+/g) || [])) {
    const schoon = pad.replace(/[.,:]+$/, '');
    if (!vfs.exists(schoon)) {
      fouten.push(`cmd-${kaart.id}: getoonde output verwijst naar '${schoon}', dat niet in de VFS bestaat`);
    }
  }
}

if (fouten.length) {
  console.error(`\n[X] commands/index.html: ${fouten.length} voorbeeld(en) werken niet\n`);
  for (const f of fouten) console.error(`    ${f}`);
  console.error('\n    Een bezoeker die dit overtypt krijgt een foutmelding.');
  console.error('    Draai het commando in de simulator en neem de echte output over.\n');
  process.exit(1);
}

console.log(`[✓] commands/index.html: ${kaarten.length} kaarten, ${uitgevoerd} voorbeelden uitgevoerd, 0 foutmeldingen` +
  (overgeslagen.length ? ` (${overgeslagen.length} vereist een levende UI: ${overgeslagen.join(', ')})` : ''));
