// E2E Tests voor het contrast van .eyebrow-badge (Sessie 217)
//
// architecture-patterns.md §10 noteerde deze badge als "3,10:1, voldoet nog niet".
// Die meting was tegen de PAGINA-achtergrond genomen, en dat is de verkeerde referentie:
// de badge heeft een eigen `background: var(--eyebrow-bg)`. Dat is een rgba, dus de tekst
// ligt op de compositie van badge-achtergrond over paginakleur.
//
// Hermeten tegen de effectieve achtergrond (Sessie 217, Chromium 390x844):
//
//   light            #16a34a op rgb(230,241,234)   2,85:1   ← onder AA (4,5), niet 3,10
//   light op hero    #16a34a op rgb(228,240,232)   2,74:1   ← de radial glow is laag drie
//   dark             #9fef00 op rgb(20,28,22)     12,26:1   ← ruim boven AAA
//
// De genoteerde waarde was dus niet alleen fout, hij was te GUNSTIG: de badge zakte van
// "onder AAA" naar "onder AA". Opgelost met een `--eyebrow-text`-token dat in light naar
// `--color-text` wijst (17,12:1) en in dark het merkgroen houdt.
//
// De notitie noemde ook 14,4px; gemeten is het 13,5px (desktop) en 10,4px (≤768px, waar
// `--font-size-base` naar 16px zakt én de badge zelf naar 0.65rem). Beide zijn normale
// tekst, dus de lat is 4,5 (AA) / 7 (AAA) — er is geen large-text-uitzondering.
//
// Beide thema's worden gemeten. Dat is niet symbolisch: de mutant voor deze test (kleur
// terug naar `--color-cta-primary`) is LICHT ROOD en DARK GROEN. Eén thema testen had de
// bug doorgelaten — dezelfde les als §9.

import { test, expect } from './fixtures.js';
import { installeerContrastMeter } from './helpers/contrast.js';

// Alle pagina's met een .eyebrow-badge. index.html heeft er twee: de hero-badge (met de
// radial glow van .hero::after erachter) en die op de lead-magnet-kaart.
// Sessie 236: /index.html stond hier met twee badges (.hero-eyebrow + .lead-magnet-card)
// en heeft er nu nul. Beide zijn verwijderd omdat de craft floor een kicker boven een kop
// als harde ban voert: de kop draagt zijn eigen gewicht. De feiten die de badges droegen
// staan in de omliggende copy. De pagina hoort daarom NIET meer in deze lijst — en dat is
// geen verzwakking: de tegenassertie hieronder bewaakt dat er op elke pagina die er wél
// in staat ook echt een badge gevonden wordt.
const PAGINAS_MET_BADGE = [
  '/over-ons.html',         // .page-hero
  '/gidsen.html',           // .page-hero
  '/contact.html',          // .page-hero
  '/woordenlijst.html',     // .page-hero
  '/commands/index.html',   // .page-hero
  '/sample-pentest.html',   // .sample-hero-text
  '/sample-juridisch.html', // .sample-hero-text
  '/sample-download.html',  // .sample-hero-text
];

const AAA_NORMALE_TEKST = 7;

/**
 * Meet elke .eyebrow-badge op de pagina tegen zijn EFFECTIEVE achtergrond.
 *
 * `parse`/`effBg`/`ratio` komen sinds Sessie 227 uit `helpers/contrast.js` — ze stonden
 * toen hier en in twee andere contrastspecs in losse kopieën, die identiek moesten blijven
 * om vergelijkbare cijfers te geven. De verantwoording van de meetmethode staat daar.
 */
async function meetBadges(page, thema) {
  await installeerContrastMeter(page);
  return page.evaluate((thema) => {
    document.documentElement.setAttribute('data-theme', thema);
    const { parse, ratio, effBg } = window.__contrast;

    return [...document.querySelectorAll('.eyebrow-badge')].map((el) => {
      const cs = getComputedStyle(el);
      const bg = effBg(el);
      return {
        tekst: (el.textContent || '').trim().slice(0, 40),
        kleur: cs.color,
        achtergrond: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`,
        fontSize: cs.fontSize,
        contrast: ratio(parse(cs.color), bg),
      };
    });
  }, thema);
}

test.describe('Eyebrow-badge — WCAG AAA tegen zijn eigen achtergrond', () => {

  for (const pad of PAGINAS_MET_BADGE) {
    test(`${pad} — badge haalt AAA in beide thema's`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(pad);
      await page.evaluate(() => document.fonts.ready.then(() => true));

      for (const thema of ['light', 'dark']) {
        const badges = await meetBadges(page, thema);
        expect(badges.length, `${pad} (${thema}): geen .eyebrow-badge gevonden`).toBeGreaterThan(0);

        for (const b of badges) {
          expect(
            b.contrast,
            `${pad} (${thema}) "${b.tekst}": ${b.contrast}:1 — ${b.kleur} op ${b.achtergrond} ` +
              `bij ${b.fontSize}. Normale tekst vereist ${AAA_NORMALE_TEKST}:1 (AAA). ` +
              `Let op: meet tegen de EFFECTIEVE achtergrond van het element, niet tegen de pagina.`
          ).toBeGreaterThanOrEqual(AAA_NORMALE_TEKST);
        }
      }
    });
  }

  // Desktop heeft een andere font-size dan mobiel (13,5 tegen 11,5px sinds Sessie 236,
  // toen de mobiele 0.65rem = 10,4px onder de 11px-ondergrens bleek te zitten).
  //
  // Deze test stond op /index.html, dat toen twee badges droeg en er nu nul heeft. Hij is
  // verplaatst naar /gidsen.html i.p.v. geschrapt: de desktopmaat is een eigen conditie en
  // die hoort bewaakt te blijven, ongeacht op welke pagina de badge staat.
  test('/gidsen.html — de badge haalt AAA op desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/gidsen.html');
    await page.evaluate(() => document.fonts.ready.then(() => true));

    for (const thema of ['light', 'dark']) {
      const badges = await meetBadges(page, thema);
      expect(badges.length, `gidsen.html (${thema}): geen .eyebrow-badge gevonden`).toBeGreaterThan(0);
      for (const b of badges) {
        expect(
          b.contrast,
          `gidsen.html desktop (${thema}) "${b.tekst}": ${b.contrast}:1 — ${b.kleur} op ${b.achtergrond}`
        ).toBeGreaterThanOrEqual(AAA_NORMALE_TEKST);
      }
    }
  });
});
