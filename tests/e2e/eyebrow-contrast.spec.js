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

// Alle pagina's met een .eyebrow-badge. index.html heeft er twee: de hero-badge (met de
// radial glow van .hero::after erachter) en die op de lead-magnet-kaart.
const PAGINAS_MET_BADGE = [
  '/index.html',            // .hero-eyebrow + .lead-magnet-card
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
 * Meet elke .eyebrow-badge op de pagina tegen zijn EFFECTIEVE achtergrond: de stapel
 * ancestor-achtergronden gecomposite tot de eerste ondoorzichtige laag.
 *
 * `getComputedStyle(el).backgroundColor` geeft hier `rgba(22,163,74,0.08)` — geen kleur
 * waar je tegen kunt meten. Wie dan naar de paginakleur grijpt meet de laag ONDER de verf
 * in plaats van de verf zelf; precies hoe de 3,10:1 in de rules-file ontstond.
 */
async function meetBadges(page, thema) {
  return page.evaluate((thema) => {
    document.documentElement.setAttribute('data-theme', thema);

    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(',').map(Number);
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };
    const over = (f, b) => ({
      r: f.r * f.a + b.r * (1 - f.a),
      g: f.g * f.a + b.g * (1 - f.a),
      b: f.b * f.a + b.b * (1 - f.a),
      a: 1,
    });
    const lin = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const L = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    const ratio = (a, b) => {
      const x = L(a) + 0.05;
      const y = L(b) + 0.05;
      return Math.round((100 * Math.max(x, y)) / Math.min(x, y)) / 100;
    };
    const effBg = (el) => {
      const stapel = [];
      for (let n = el; n; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c && c.a > 0) stapel.push(c);
        if (c && c.a === 1) break;
      }
      let acc = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = stapel.length - 1; i >= 0; i--) acc = over(stapel[i], acc);
      return acc;
    };

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
      await page.evaluate(() => document.fonts.ready);

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

  // Desktop heeft een andere font-size (13,5px i.p.v. 10,4px) en op index.html een andere
  // achtergrondstapel, want .hero::after legt daar een radial gradient onder de badge.
  test('/index.html — beide badges halen AAA op desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/index.html');
    await page.evaluate(() => document.fonts.ready);

    for (const thema of ['light', 'dark']) {
      const badges = await meetBadges(page, thema);
      expect(badges.length, `index.html (${thema}) hoort twee badges te hebben`).toBe(2);
      for (const b of badges) {
        expect(
          b.contrast,
          `index.html desktop (${thema}) "${b.tekst}": ${b.contrast}:1 — ${b.kleur} op ${b.achtergrond}`
        ).toBeGreaterThanOrEqual(AAA_NORMALE_TEKST);
      }
    }
  });
});
