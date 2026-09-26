// E2E: het accentbudget en de typografische begroting van de landingspagina (Sessie 236)
//
// Achtergrond. Het ontwerpvoorstel (docs/design/voorstel-landingspagina.md) stelde als
// meetlat: "neon-elementen in het eerste scherm: van 23 naar hoogstens 3, geteld met
// hetzelfde script". Dat script bestond niet — niet in scripts/, niet in git, nergens.
// Het getal 23 was daarmee niet reproduceerbaar en de lat niet toetsbaar. CLAUDE.md:
// een onopgeloste conditie hoort als assertie in een test, niet als notitie in een doc.
// Dit bestand ís die assertie.
//
// Nulmeting vóór de wijziging (dual-agent critique, 1440x900, scrollpositie 0):
//   21 vaste neon-dragers in het eerste scherm, 23-26 inclusief de typende demo.
//   Ná deze sessie: 1 buiten het terminalvenster (de primaire actie), 9-10 erbinnen.
//
// Het onderscheid binnen/buiten is niet cosmetisch. Binnen het venster IS kleur
// betekenis — prompt, tip, fout — en daar verandert niets aan. Buiten het venster
// betekent kleur "hier kun je klikken", en daar hoort er hoogstens één per scherm te
// staan: de primaire actie. Een teller die dat onderscheid niet maakt, meet de verkeerde
// populatie en zou de inhoud van de simulator als designfout rapporteren.
//
// Draai bij voorkeur lokaal (zie fixtures.js):
//   python3 scripts/nostore-server.py 8901 "$(pwd)" &
//   BASE_URL=http://localhost:8901 npx playwright test hero-accent-budget

import { test, expect } from './fixtures.js';
import { PAGINAS } from './helpers/paginas.js';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const WORTEL = process.cwd();

// Sessie 238: het accent is rood geworden (de wereld van Total Design). Lime bestaat nog,
// maar alleen binnen de donkere modules, als betekeniskleur van de terminal zelf.
const NEON_BRON = '(159,\\s*239,\\s*0|#9fef00)';
const ROOD_BRON = '(204,\\s*10,\\s*30|#cc0a1e)';
const DESKTOP = { width: 1440, height: 900 };

/** Bevriest alles wat beweegt en onthult de scroll-reveals.
 *  Zonder dit meet je door een niet-gevuurde `.animate-on-scroll` heen, die op
 *  `opacity: 0; filter: blur(4px)` staat — de meetfout die in de detector-analyse van
 *  Sessie 235 twaalf spook-contrastbevindingen opleverde. */
async function bevries(page) {
  await page.addStyleTag({
    content: `*,*::before,*::after{transition:none!important;animation:none!important}
              .animate-on-scroll{opacity:1!important;transform:none!important;filter:none!important}`,
  });
  await page.waitForTimeout(400);
}

/** Telt zichtbare dragers van het neon-accent in het eerste scherm, gesplitst naar
 *  binnen/buiten het terminalvenster.
 *
 *  Telt alleen eigenschappen die daadwerkelijk verf op het scherm zetten:
 *  `color` uitsluitend als het element een eigen tekstnode heeft (anders telt overerving
 *  mee), randen alleen bij een breedte > 0 en een stijl ≠ none. `outline-color` en
 *  `caret-color` blijven eruit: die erven van `color` en blazen de telling op zonder dat
 *  er een pixel kleurt. Visueel verborgen elementen (sr-only via clip-path) tellen niet. */
async function telAccent(page, kleur = NEON_BRON) {
  return page.evaluate((bron) => {
    const NEON = new RegExp(bron, 'i');
    const buiten = [];
    const binnen = [];
    const gezien = new Set();
    const naam = (e) =>
      e.tagName.toLowerCase() + '.' + ((e.getAttribute('class') || '').trim().split(/\s+/)[0] || '');

    document.querySelectorAll('body *').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (!(b.width > 1 && b.height > 1 && b.bottom > 0 && b.top < window.innerHeight)) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return;
      if (cs.clipPath && cs.clipPath !== 'none') return;

      const props = [];
      const eigenTekst = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (eigenTekst && NEON.test(cs.color)) props.push('color');
      if (NEON.test(cs.backgroundColor)) props.push('background');
      if (NEON.test(cs.backgroundImage)) props.push('background-image');
      for (const zijde of ['Top', 'Right', 'Bottom', 'Left']) {
        if (
          parseFloat(cs[`border${zijde}Width`]) > 0 &&
          cs[`border${zijde}Style`] !== 'none' &&
          NEON.test(cs[`border${zijde}Color`])
        ) {
          props.push('border');
          break;
        }
      }
      if (NEON.test(cs.fill)) props.push('fill');
      if (NEON.test(cs.stroke)) props.push('stroke');
      if (NEON.test(cs.boxShadow)) props.push('box-shadow');
      // Pseudo-elementen tellen mee: een rood vierkantje in ::before is net zo goed een
      // drager. Tot sessie 2b keek deze teller er niet naar, en de "volgende"-chip droeg
      // daar ongezien rood naast de primaire actie.
      for (const pseudo of ['::before', '::after']) {
        const ps = getComputedStyle(el, pseudo);
        if (ps.content === 'none' || ps.display === 'none') continue;
        if (NEON.test(ps.backgroundColor) || NEON.test(ps.color) || NEON.test(ps.boxShadow) ||
            ['Top', 'Right', 'Bottom', 'Left'].some((z) => parseFloat(ps[`border${z}Width`]) > 0 &&
              ps[`border${z}Style`] !== 'none' && NEON.test(ps[`border${z}Color`]))) {
          props.push(pseudo);
        }
      }
      if (!props.length) return;

      // SVG-vormkinderen rollen op naar hun <svg>: vier rects in één icoon zijn één drager.
      let doel = el;
      const svg = el.closest('svg');
      if (svg && el !== svg) doel = svg;

      const sleutel = `${naam(doel)}|${(doel.textContent || '').trim().slice(0, 16)}`;
      if (gezien.has(sleutel)) return;
      gezien.add(sleutel);
      // De glossen, de kolomkop en de uitnodiging staan in de DOM ín .hero-terminal (ze
      // delen de rij met hun terminalregel), maar liggen op papier: daar geldt het budget.
      // Tot sessie 241 telde een rode glos als "binnen" en ontsnapte hij aan de teller.
      const inModule = doel.closest('.hero-terminal, .af-transcript, .af-specimen-cmds')
        && !doel.closest('.reg-glos, .af-glos-kop, .af-hint');
      (inModule ? binnen : buiten).push(`${sleutel} [${props.join(',')}]`);
    });
    return { buiten, binnen };
  }, kleur);
}

/** Loopt de pagina scherm voor scherm af en telt per positie. */
async function perScherm(page, kleur) {
  const { hoogte, vp } = await page.evaluate(() => ({
    hoogte: document.documentElement.scrollHeight, vp: window.innerHeight,
  }));
  const uit = [];
  for (let y = 0; y < hoogte; y += vp) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(80);
    uit.push({ y, ...(await telAccent(page, kleur)) });
  }
  return uit;
}

// Sessie 238. Tot hier gold de regel "één accentdrager per scherm" alleen voor het eerste
// scherm; de andere acht droegen er 2 tot 12 (DESIGN.md, One Carrier Rule). Het direction
// contract zei: sweep de rest of schrap de regel, laat hem niet half staan. Hij geldt nu
// op elke schermhoogte van de pagina.
test.describe('Het signaal: rood betekent "jij bent aan zet"', () => {
  test('op elke schermhoogte draagt hoogstens één element rood, en dat is een primaire actie', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/index.html');
    await bevries(page);

    const schermen = await perScherm(page, ROOD_BRON);

    // Zelfbewakend: bovenaan staat de hero-actie, dus daar móét één drager zijn. Nul zou
    // betekenen dat de teller het rood niet meer herkent (andere waarde, ander pad).
    expect(schermen[0].buiten.length, `bovenaan: ${JSON.stringify(schermen[0].buiten)}`).toBe(1);
    expect(schermen.length, 'de pagina is maar één scherm — de sweep bewijst niets').toBeGreaterThan(4);

    const teVeel = schermen.filter((s) => s.buiten.length > 1);
    expect(teVeel.map((s) => `y=${s.y}: ${s.buiten.join(' | ')}`), 'meer dan één rode drager op één scherm').toEqual([]);

    const geenActie = schermen.flatMap((s) => s.buiten.filter((d) => !d.startsWith('a.btn-cta')));
    expect(geenActie, 'rood op iets anders dan een primaire actie').toEqual([]);
  });

  test('lime komt buiten de terminalmodules nergens meer voor', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/index.html');
    await bevries(page);

    const schermen = await perScherm(page, NEON_BRON);
    // Zelfbewakend: binnen de module is lime de prompt en de tip. Zonder die dragers heeft
    // de meting het venster niet gezien.
    expect(schermen[0].binnen.length, 'binnen de module hoort lime te staan (prompt, tip)').toBeGreaterThan(0);
    const buiten = schermen.flatMap((s) => s.buiten.map((d) => `y=${s.y}: ${d}`));
    expect(buiten, 'lime buiten de modules: de oude wereld sluipt terug').toEqual([]);
  });

  test('de teller is niet blind: drie mutanten vuren elk via een ander eigenschapspad', async ({ page }) => {
    // Een check die nooit kán falen is niet te onderscheiden van een kapotte check.
    // De mutanten raken bewust drie verschillende takken van telAccent — color, border
    // en fill — plus één negatieve controle die ónder de vouw staat en juist NIET mag
    // vuren. Die laatste bewijst dat het viewportfilter werkt, en dus dat "0 gevonden"
    // iets anders betekent dan "niet gekeken".
    await page.setViewportSize(DESKTOP);
    await page.goto('/index.html');
    await bevries(page);
    await page.evaluate(() => window.scrollTo(0, 0));

    const basis = (await telAccent(page, ROOD_BRON)).buiten.length;

    const mutanten = [
      ['color', '.af-hero-sub { color: #cc0a1e !important; }', true],
      ['border', '.af-hint { border: 2px solid #cc0a1e !important; }', true],
      ['fill', '.nav-brand .brand-icon rect { fill: #cc0a1e !important; }', true],
      ['onder de vouw', '.af-omslag h2 { color: #cc0a1e !important; }', false],
    ];

    for (const [tak, css, moetVuren] of mutanten) {
      const handle = await page.addStyleTag({ content: css });
      await page.waitForTimeout(250);
      const na = (await telAccent(page, ROOD_BRON)).buiten.length;
      await page.evaluate((el) => el.remove(), handle);
      await page.waitForTimeout(150);

      if (moetVuren) {
        expect(na, `mutant op tak "${tak}" had de teller moeten laten stijgen`).toBe(basis + 1);
      } else {
        expect(na, `mutant "${tak}" staat buiten beeld en mag de teller niet raken`).toBe(basis);
      }
    }
  });
});

test.describe('Typografische begroting', () => {
  // Deze twee lezen de schijf en niet de pagina, dus één motor volstaat.
  test.skip(({ browserName }) => browserName !== 'chromium', 'bestandssysteemcheck, motor-onafhankelijk');

  test('het fontbudget blijft onder de meting van vóór de wissel', async () => {
    const map = join(WORTEL, 'styles', 'fonts');
    const bestanden = readdirSync(map).filter((f) => f.endsWith('.woff2'));

    // Zelfbewakende tak: een lege map zou anders als "ruim binnen budget" lezen.
    expect(bestanden.length, 'geen woff2 gevonden — de meting heeft niet gedraaid').toBeGreaterThan(0);

    const totaal = bestanden.reduce((som, f) => som + statSync(join(map, f)).size, 0);
    const LAT = 106016; // 103,5 KB: de gemeten situatie met Inter + Space Grotesk + JetBrains
    expect(totaal, `fonts: ${bestanden.join(', ')} = ${(totaal / 1024).toFixed(1)} KB`).toBeLessThanOrEqual(LAT);
  });

  test('elke font-preload wijst naar een bestand dat bestaat', async () => {
    // Een preload naar een verwijderd bestand kost een 404 per paginaweergave en is
    // onzichtbaar in de UI. Bij de fontwissel van Sessie 236 stonden er 52 preloads over
    // 26 pagina's naar twee bestanden die verdwenen.
    const patroon = /rel="preload"[^>]*href="([^"]+\.woff2)"/g;
    const gecontroleerd = [];
    const stuk = [];

    for (const pad of PAGINAS) {
      const bestand = join(WORTEL, pad.replace(/^\//, ''));
      if (!existsSync(bestand)) continue;
      const html = readFileSync(bestand, 'utf8');
      for (const m of html.matchAll(patroon)) {
        const doel = join(WORTEL, m[1].replace(/^\//, '').split('?')[0]);
        gecontroleerd.push(`${pad} -> ${m[1]}`);
        if (!existsSync(doel)) stuk.push(`${pad} -> ${m[1]}`);
      }
    }

    expect(gecontroleerd.length, 'nul preloads gevonden — de meting heeft niet gedraaid').toBeGreaterThan(0);
    expect(stuk, `dode font-preloads (van ${gecontroleerd.length} gecontroleerd)`).toEqual([]);
  });
});
