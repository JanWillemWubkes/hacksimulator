#!/usr/bin/env node
/**
 * build-review-package.mjs — genereert het expert-reviewpakket.
 *
 * WAAROM DIT BESTAAT
 * HackSimulator is gebouwd door een maker zonder security-achtergrond, samen met AI.
 * Alles wat de site automatisch bewaakt is *structureel* (tellingen, schema, tags);
 * niets controleert of een bewering wáár is. De enige echte kwaliteitsgarantie is een
 * mens met vakkennis die de inhoud naleest.
 *
 * Een vrijwilliger leest geen 7.600 regels JavaScript. Dit script destilleert daarom
 * uitsluitend de CONTROLEERBARE BEWERINGEN uit de bron — met bestand en regelnummer —
 * en zet ze in één markdown-bestand met aankruisvakjes.
 *
 * Genereren uit de bron (niet overtikken) betekent: geen extra plek die kan driften,
 * en een tweede reviewronde kost één commando.
 *
 * Gebruik:
 *   node scripts/build-review-package.mjs                 → docs/review/expert-review-pakket.md
 *   node scripts/build-review-package.mjs --out <pad>
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const outArg = process.argv.indexOf('--out');
const OUT = outArg > -1 ? process.argv[outArg + 1] : join(ROOT, 'docs/review/expert-review-pakket.md');

// ---------------------------------------------------------------------------
// Welke regels zijn een "controleerbare bewering"?
// ---------------------------------------------------------------------------
// Bewust breed maar niet alles: we willen feitelijke uitspraken (getallen,
// eenheden, CVE's, poorten, protocollen, juridische verwijzingen) en de
// educatieve laag ([TIP]/[!]), niet de opmaak of de voorbeeld-syntax.
const CLAIM_PATTERNS = [
  /\b\d+([.,]\d+)?\s*(miljard|miljoen|duizend|procent|%|jaar|jaren|maanden|dagen|uur|seconden?|sec|ms|bits?|bytes?|KB|MB|GB|karakters?)\b/i,
  /\bCVE-\d{4}-\d+\b/,
  /\bCVSS\b/i,
  /\b(?:poort|port)\s+\d+\b/i,
  /\b\d+\/tcp\b|\b\d+\/udp\b/i,
  /\bhashes?\/sec\b|\bH\/s\b/i,
  /\bper\s+(seconde|minuut|uur|dag|maand|jaar)\b/i,
  /\b\d+\+?\s*(?:pogingen|passwords|wachtwoorden|hashes|gebruikers|accounts|hosts|systemen|bedrijven|records|combinaties)\b/i,
  /\bart(?:ikel)?\.?\s*\d+[a-z]*\s*Sr\b/i,
  /\bOWASP\b|\bNIST\b|\bRFC\s*\d+\b|\bNCSC\b/i,
  /\[TIP\]|\[!\]/,
  /\b(?:illegaal|legaal|strafbaar|verboden|toegestaan|wettelijk)\b/i,
  /\b(?:altijd|nooit|alle|geen enkele)\b.*\b(?:veilig|onveilig|kwetsbaar)\b/i,
];

// Regels die er wel feitelijk uitzien maar het niet zijn.
const SKIP_PATTERNS = [
  /^\s*[-=─━│┌┐└┘├┤]+\s*$/,       // scheidingslijnen
  /^\s*\$\s/,                       // shell-prompts in voorbeelden
  /^\s*\d+\.\s*$/,                  // kale nummering
];

// Code-herkenning: we willen tekst die de gebruiker ziet, geen JavaScript.
// Deze tokens komen in gebruikerstekst praktisch nooit voor, in code altijd.
const CODE_PATTERNS = [
  /=>|\bfunction\b|\bconst \b|\blet \b|\bvar \b|\breturn\b|\bimport\b|\bexport\b/,
  /^\s*(\/\/|\/\*|\*)/,             // commentaar
  /^\s*[\w$]+\s*[:=]\s*[[{(]/,      // object/array-toewijzing
  /\.(push|map|filter|join|replace|includes|forEach|split)\s*\(/,
  /\$\{[^}]*\}/,                    // template-interpolatie: waarde is dynamisch
];

function isCode(line) {
  return CODE_PATTERNS.some(p => p.test(line));
}

function isClaim(line) {
  const t = line.trim();
  if (t.length < 12) return false;
  if (SKIP_PATTERNS.some(p => p.test(line))) return false;
  if (isCode(line)) return false;
  return CLAIM_PATTERNS.some(p => p.test(line));
}

// ---------------------------------------------------------------------------
// Bron 1 — man pages van de commands
// ---------------------------------------------------------------------------
function collectManPages() {
  const base = join(ROOT, 'src/commands');
  const out = [];
  for (const cat of readdirSync(base)) {
    const dir = join(base, cat);
    for (const f of readdirSync(dir).filter(x => x.endsWith('.js'))) {
      const path = join(dir, f);
      const lines = readFileSync(path, 'utf8').split('\n');

      // Waar begint de man page? Alles ervóór is runtime-output (wat de leerling
      // ziet bij het uitvoeren), alles erna de handleiding. Beide zijn zichtbaar,
      // dus beide horen in de review — maar de herkomst is nuttig voor de reviewer.
      const manStart = lines.findIndex(l => /manPage:\s*`/.test(l));

      const claims = [];
      lines.forEach((line, i) => {
        if (!isClaim(line)) return;
        claims.push({
          line: i + 1,
          // Sluitende backtick/quote van het omhullende literal hoort niet bij de tekst.
          text: line.trim().replace(/[`'"]\s*[,;]?\s*$/, '').trim(),
          where: manStart !== -1 && i >= manStart ? 'handleiding' : 'output',
        });
      });
      if (claims.length) {
        out.push({ file: relative(ROOT, path), category: cat, command: f.replace('.js', ''), claims });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Bron 2 — woordenlijst-definities
// ---------------------------------------------------------------------------
function collectGlossary() {
  const path = join(ROOT, 'woordenlijst.html');
  const lines = readFileSync(path, 'utf8').split('\n');
  const terms = [];
  let pending = null;
  lines.forEach((line, idx) => {
    const dt = line.match(/<dt[^>]*>(.*?)<\/dt>/);
    if (dt) { pending = { term: strip(dt[1]), line: idx + 1 }; return; }
    const dd = line.match(/<dd[^>]*>(.*?)<\/dd>/);
    if (dd && pending) {
      terms.push({ ...pending, definition: strip(dd[1]) });
      pending = null;
    }
  });
  return { file: relative(ROOT, path), terms };
}

function strip(html) {
  return html
    .replace(/<a\b[^>]*>.*?<\/a>/g, '')     // "lees meer"-links dragen geen inhoud
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Rapport
// ---------------------------------------------------------------------------
function build() {
  const manPages = collectManPages();
  const glossary = collectGlossary();
  const today = new Date().toISOString().slice(0, 10);

  const totalClaims = manPages.reduce((n, m) => n + m.claims.length, 0);
  const order = { security: 0, network: 1, filesystem: 2, system: 3, special: 4 };
  manPages.sort((a, b) => (order[a.category] ?? 9) - (order[b.category] ?? 9) || a.command.localeCompare(b.command));

  let md = `# Expert-review: kloppen deze beweringen?

**Gegenereerd op:** ${today} · **Bron:** \`scripts/build-review-package.mjs\` (opnieuw te genereren met één commando)

---

## Waar je naar kijkt

[HackSimulator.nl](https://hacksimulator.nl/) is een gratis Nederlandstalige oefenterminal waarin
beginners ethisch hacken leren. Alle output is gesimuleerd; er wordt nooit een echt systeem geraakt.

**Het eerlijke verhaal:** ik ben zelf geen securityprofessional. Ik heb dit project samen met AI
gebouwd. De techniek is getest, maar of de *inhoud* klopt kan ik niet zelf beoordelen — en dat is
precies wat leerlingen wél van me aannemen. Daarom deze vraag.

**Wat ik van je vraag:** loop de lijst hieronder door en kruis per regel aan. Je hoeft niets te
herschrijven; "klopt niet" met een half zinnetje is genoeg. Sla gerust over wat buiten je vakgebied
valt — een deels ingevulde lijst is oneindig veel waardevoller dan geen lijst.

**Ik zoek fouten, geen complimenten.** Liever één keer streng dan tien beleefde lezers.

**Twee soorten inhoud, in volgorde van belang:**

1. **${totalClaims} beweringen uit de commando's** — de dichtste concentratie technische claims in
   het product. Security-tools staan bovenaan. Elke regel is gelabeld: \`output\` = wat de leerling
   ziet als het commando draait, \`handleiding\` = wat \`man <command>\` toont.
2. **${glossary.terms.length} begripsdefinities** uit de openbare woordenlijst — de pagina die het
   vaakst als naslag wordt gelinkt.

---

## Deel 1 — Beweringen uit de handleidingen

`;

  const CATS = {
    security: 'Security-tools — hoogste prioriteit',
    network: 'Netwerk-commando\'s',
    filesystem: 'Bestandssysteem-commando\'s',
    system: 'Systeem- en leerpad-commando\'s',
    special: 'Overig',
  };
  let lastCat = null;
  for (const m of manPages) {
    if (m.category !== lastCat) {
      md += `\n### ${CATS[m.category] ?? m.category}\n`;
      lastCat = m.category;
    }
    md += `\n#### \`${m.command}\` — <sub>${m.file}</sub>\n\n`;
    for (const c of m.claims) {
      md += `- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>${c.where} r${c.line}</sub> ${c.text.replace(/\|/g, '\\|')}\n`;
    }
  }

  md += `\n---\n\n## Deel 2 — Begripsdefinities (\`${glossary.file}\`)\n\n`;
  for (const t of glossary.terms) {
    md += `- [ ] klopt · [ ] klopt niet · [ ] te vaag — **${t.term}** (r${t.line}): ${t.definition.replace(/\|/g, '\\|')}\n`;
  }

  md += `
---

## Wat er met je antwoorden gebeurt

- Elke "klopt niet" wordt gecorrigeerd en krijgt een bronvermelding in de tekst.
- Als je akkoord gaat, komt je naam (of alleen je functie, zoals je wilt) met de reviewdatum op
  \`/over-ons.html\` te staan onder "Verantwoording". Liever anoniem? Ook prima — zeg het gewoon.
- Dit bestand is opnieuw te genereren, dus een tweede ronde over alleen de wijzigingen kan zonder
  dat je alles opnieuw hoeft te lezen.

**Contact:** contact@hacksimulator.nl
`;

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, md, 'utf8');

  console.log(`Reviewpakket geschreven: ${relative(ROOT, OUT)}`);
  console.log(`  ${manPages.length} commands · ${totalClaims} beweringen · ${glossary.terms.length} definities`);
  const perCat = {};
  for (const m of manPages) perCat[m.category] = (perCat[m.category] || 0) + m.claims.length;
  for (const [k, v] of Object.entries(perCat)) console.log(`  ${k.padEnd(12)} ${v} beweringen`);
}

build();
