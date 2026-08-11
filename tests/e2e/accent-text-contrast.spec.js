// E2E Tests voor accent-TEKST-contrast (Sessie 221)
//
// Aanleiding: `--color-cta-primary` droeg twee onverenigbare rollen. Als CTA-ACHTERGROND
// (met witte tekst erop) werkt het merkgroen prima; als TEKSTKLEUR faalde het in light mode
// overal. Gemeten over 12 pagina's, light mode, tegen de effectieve achtergrond:
//
//   VOOR:   232 accent-tekstelementen | 101 onder AA | 232 onder AAA
//   NA:     232 accent-tekstelementen |   0 onder AA |  90 onder AAA
//
// De 90 die onder AAA blijven zijn ALLEMAAL large text (18,9-64px): koppen, stat-getallen,
// prijzen, de hero-onderstreping. Die dragen nog `--color-cta-primary` en halen AA (lat 3,0)
// wel. Dat is een bewuste, gemeten grens — geen vergeten rest. Zie de tweede test.
//
// Twee meetvallen die hier hard nodig zijn:
//
//  1. Na het omzetten van `data-theme` moet je WACHTEN. Diverse regels dragen
//     `transition: color 0.15s` (o.a. main.css `.faq-answer a`). Meteen uitlezen levert een
//     kleur MIDDEN in de fade: gemeten rgb(144,230,8) en rgb(159,239,0) waar het token
//     #16a34a moest zijn. Dat produceerde een valse 1,42:1. Diagnostisch signaal: komt een
//     gemeten kleur met GEEN enkel token overeen, dan meet je een tussenframe.
//
//  2. Contrast hoort tegen de EFFECTIEVE achtergrond, niet tegen --color-bg. Een
//     `.section-band` is rgb(236,238,240) en de pagina rgb(248,248,248); dat scheelt hier
//     0,27 en dat is precies het verschil tussen de genoteerde 3,10 en de echte 2,83.
//     Zie architecture-patterns.md §10.

import { test, expect } from './fixtures.js';

const PAGINAS = [
  '/index.html', '/over-ons.html', '/gidsen.html', '/contact.html', '/woordenlijst.html',
  '/404.html', '/sample-pentest.html', '/sample-juridisch.html', '/sample-download.html',
  '/commands/index.html', '/blog/index.html', '/terminal.html',
];

/**
 * Meet elk element dat ZELF tekst rendert in een van de twee accentkleuren, tegen de
 * gecomposite ancestor-achtergrond. Retourneert ook of het element de nieuwe
 * --color-accent-text draagt of nog de oude --color-cta-primary, zodat beide asserties
 * los van elkaar kunnen oordelen.
 */
async function meetAccentTekst(page, thema) {
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), thema);
  await page.waitForTimeout(400); // color-transities laten uitklinken - zie kop van dit bestand

  return page.evaluate(() => {
    const parse = (c) => {
      const h = c.trim().match(/^#([0-9a-f]{6})$/i);
      if (h) {
        const n = parseInt(h[1], 16);
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
      }
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
    const gelijk = (a, b) => a && b && a.r === b.r && a.g === b.g && a.b === b.b;
    // Rendert dit element ZELF tekst? Een container die de kleur alleen doorgeeft aan
    // kinderen telt niet mee - anders wordt elke voorouder dubbel geteld.
    const eigenTekst = (el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);

    // Lees de tokens uit :root, zodat deze test blijft kloppen als de waarden wijzigen.
    const root = getComputedStyle(document.documentElement);
    const ACCENT = parse(root.getPropertyValue('--color-accent-text'));
    const CTA = parse(root.getPropertyValue('--color-cta-primary'));
    // Ook de Dark-Frame-token meescannen. Die verandert NOOIT mee met het thema, dus in
    // light mode is hij lime op wat eronder staat - en lime op wit meet 1,42:1. Zonder
    // deze derde kleur is dat een gat dat geen enkele assertie hier zou zien.
    const FRAME = parse(root.getPropertyValue('--color-cta-dark-frame'));

    const uit = [];
    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      const kleur = parse(cs.color);
      const isAccent = gelijk(kleur, ACCENT);
      const isCta = gelijk(kleur, CTA);
      const isFrame = gelijk(kleur, FRAME);
      if (!isAccent && !isCta && !isFrame) continue;
      if (!eigenTekst(el)) continue;
      // Alleen wat daadwerkelijk gerenderd wordt. Een `display: none` element heeft geen
      // achtergrondstapel, dus effBg() valt terug op de paginakleur en levert een contrast
      // dat nergens op slaat: de mobiele CTA-balk mat zo 1,33:1 (lime op rgb(248,248,248))
      // op een 1280px-viewport waar hij niet eens bestaat. Op zijn eigen breedte staat hij
      // op een donkere balk. `visibility: hidden` houdt wel rects en blijft dus meetellen.
      if (el.getClientRects().length === 0) continue;

      const px = parseFloat(cs.fontSize);
      const groot = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700);
      const bg = effBg(el);
      let sel = el.tagName.toLowerCase();
      if (el.id) sel += '#' + el.id;
      else if (el.className && typeof el.className === 'string')
        sel += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');

      uit.push({
        sel,
        tekst: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
        kleur: cs.color,
        bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`,
        fontSize: cs.fontSize,
        groot,
        isAccent,
        isCta,
        AA: groot ? 3 : 4.5,
        AAA: groot ? 4.5 : 7,
        contrast: ratio(kleur, bg),
      });
    }
    return uit;
  });
}

const beschrijf = (r) =>
  `${r.sel} "${r.tekst}" — ${r.contrast}:1 (${r.kleur} op ${r.bg}, ` +
  `${r.fontSize}${r.groot ? ' LARGE' : ''})`;

test.describe('Accent-tekst — contrast tegen de effectieve achtergrond', () => {

  for (const pad of PAGINAS) {
    test(`${pad} — geen accent-tekst onder AA, in beide thema's`, async ({ page }) => {
      await page.goto(pad);
      await page.evaluate(() => document.fonts.ready);

      for (const thema of ['light', 'dark']) {
        const rijen = await meetAccentTekst(page, thema);
        const onderAA = rijen.filter((r) => r.contrast < r.AA);
        expect(
          onderAA.map(beschrijf),
          `${pad} (${thema}): ${onderAA.length} van ${rijen.length} accent-tekstelementen ` +
            `haalt WCAG AA niet. Meet tegen de EFFECTIEVE achtergrond, niet tegen --color-bg.`
        ).toEqual([]);
      }
    });

    test(`${pad} — --color-accent-text haalt overal AAA`, async ({ page }) => {
      await page.goto(pad);
      await page.evaluate(() => document.fonts.ready);

      for (const thema of ['light', 'dark']) {
        const rijen = (await meetAccentTekst(page, thema)).filter((r) => r.isAccent);
        const onderAAA = rijen.filter((r) => r.contrast < r.AAA);
        expect(
          onderAAA.map(beschrijf),
          `${pad} (${thema}): --color-accent-text is er juist om AAA te halen. ` +
            `Zakt hij eronder, dan is de tokenwaarde te licht voor deze ondergrond.`
        ).toEqual([]);
      }
    });
  }

  // De grens tussen "opgelost" en "bewust gelaten" is een MEETBARE eigenschap, geen notitie:
  // alles wat nog --color-cta-primary als tekst draagt en onder AAA zit, hoort large text te
  // zijn. Zodra iemand die token op normale tekst zet, valt deze test - ook als het element
  // toevallig AA haalt. Dat is precies het gat waar de 101 falers in zaten.
  //
  // Per pagina, niet als een lus over alle twaalf in een test. De eerste versie deed 12
  // navigaties achter elkaar en werd daardoor flaky zodra er een tweede worker naast draaide
  // (groen in isolatie, rood in de volle run) - een test die onder belasting iets anders
  // meet dan in rust is geen guard.
  for (const pad of PAGINAS) {
    test(`${pad} — resterende CTA-groene tekst onder AAA is uitsluitend large text`, async ({ page }) => {
      await page.goto(pad);
      await page.evaluate(() => document.fonts.ready);

      const rijen = await meetAccentTekst(page, 'light');
      // Expliciet op isCta filteren, niet op !isAccent: sinds de Dark-Frame-token
      // meegescand wordt zou !isAccent die er ook in trekken, en dan zou de foutmelding
      // naar de verkeerde token wijzen.
      const overtreders = rijen
        .filter((r) => r.isCta && r.contrast < r.AAA && !r.groot)
        .map(beschrijf);

      expect(
        overtreders,
        `${pad}: normale tekst in --color-cta-primary hoort --color-accent-text te gebruiken. ` +
          'De CTA-token is bedoeld als ACHTERGROND (met --color-cta-text erop), niet als tekst.'
      ).toEqual([]);
    });
  }
});
