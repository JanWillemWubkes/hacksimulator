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
async function telAccent(page) {
  return page.evaluate(() => {
    const NEON = /(159,\s*239,\s*0|#9fef00)/i;
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
      if (!props.length) return;

      // SVG-vormkinderen rollen op naar hun <svg>: vier rects in één icoon zijn één drager.
      let doel = el;
      const svg = el.closest('svg');
      if (svg && el !== svg) doel = svg;

      const sleutel = `${naam(doel)}|${(doel.textContent || '').trim().slice(0, 16)}`;
      if (gezien.has(sleutel)) return;
      gezien.add(sleutel);
      (doel.closest('.hero-terminal') ? binnen : buiten).push(`${sleutel} [${props.join(',')}]`);
    });
    return { buiten, binnen };
  });
}

test.describe('Accentbudget in het eerste scherm', () => {
  test('buiten het terminalvenster draagt hoogstens de primaire actie het accent', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/index.html');
    await bevries(page);
    await page.evaluate(() => window.scrollTo(0, 0));

    // De hero-demo typt regels in en uit; drie samples geven het stabiele deel.
    const samples = [];
    for (let i = 0; i < 3; i += 1) {
      samples.push(await telAccent(page));
      await page.waitForTimeout(900);
    }

    const buitenAltijd = samples[0].buiten.filter((d) => samples.every((s) => s.buiten.includes(d)));
    const buitenMax = Math.max(...samples.map((s) => s.buiten.length));

    // Positief bewijs dat er iets gemeten is: een lege populatie ziet er anders identiek
    // uit als een geslaagde meting. Binnen het venster hóórt het accent te staan.
    expect(
      Math.min(...samples.map((s) => s.binnen.length)),
      'binnen het venster hoort het accent te staan (prompt, tip, chips) — nul betekent dat de meting niet gedraaid heeft',
    ).toBeGreaterThan(3);

    expect(buitenMax, `neon buiten het venster: ${JSON.stringify(buitenAltijd)}`).toBeLessThanOrEqual(1);
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

    const basis = (await telAccent(page)).buiten.length;

    const mutanten = [
      ['color', '.hero h1 { color: #9fef00 !important; }', true],
      ['border', '.hero-subtitle { border: 2px solid #9fef00 !important; }', true],
      ['fill', '.nav-brand .brand-icon rect { fill: #9fef00 !important; }', true],
      ['onder de vouw', '.trust-badge { color: #9fef00 !important; }', false],
    ];

    for (const [tak, css, moetVuren] of mutanten) {
      const handle = await page.addStyleTag({ content: css });
      await page.waitForTimeout(250);
      const na = (await telAccent(page)).buiten.length;
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
