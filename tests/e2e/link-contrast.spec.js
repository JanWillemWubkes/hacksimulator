// E2E Tests voor het contrast van de LINK-tokens (Sessie 227)
//
// TASKS #71: `--color-link` was #0969da en mat 5,19:1 op wit — AA gehaald, AAA (7,0) niet.
// De aanleiding kwam uit een blogsessie, maar het token is sitebreed.
//
// ── Wat de meting liet zien dat de redenering niet zag ───────────────────────────────────
//
// 1. Dit is geen "linkkleur"-taak. `blog.css` mapt in light mode óók koppen, post-titels,
//    kaarttitels, <strong>, inline <code>, CTA-koppen en de support-banner op dit token.
//    De blast radius is de hele light-mode blog, niet alleen de links.
//
// 2. De achtergrondenset is breder dan pagina + kaart. Gemeten over 16 pagina's:
//    #fff, #fefefe, #f8f8f8, #f5f5f5 (inline code), #f1f1f1, #e8f0f9 en #f2f9ff (badges).
//    Een tabel met alleen --color-bg en --color-bg-hover erin wees de verkeerde kandidaat
//    aan: #ebebeb en #eceef0 komen onder links HELEMAAL NIET voor.
//
// 3. Gekozen: #0a4d94 (light), slechtste 7,29:1. Die tint stond al in de codebase — het is
//    de uitzondering die Sessie 226 voor `.related-category` doormat. Door hem tot het token
//    zelf te maken kon die override wég (architecture-patterns §14). Hover werd #044289.
//    In dark ging `--color-link-hover` van #58a6ff naar #8ecbff: de oude waarde was DONKERDER
//    dan de link zelf en haalde 6,85 op de blogkaart.
//
// Eindstand van de sweep: light 302 elementen / 0 onder AA / 0 onder AAA / laagste 7,29;
// dark 130 / 0 / 0 / laagste 7,34.
//
// ── Waarom hier geen `waitForTimeout` alleen ────────────────────────────────────────────
// De helper bevriest transities én animaties vóór het meten. Met alleen wachten mat dezelfde
// pagina de ene run 7,88 en de andere 1,70 (de badge over de DONKERE kaartkleur), en wisselde
// zelfs het aantal gemeten elementen (106 vs 110). Zie helpers/contrast.js.

import { test, expect } from './fixtures.js';
import { installeerContrastMeter, zetThema } from './helpers/contrast.js';

// De 12 uit accent-text-contrast.spec.js, plus drie die daar ontbreken en hier zwaar wegen:
// een echte blogPOST (waar het token de koppen en de inline code kleurt) en de drie
// legal-pagina's, die tot Sessie 224 helemaal geen E2E-dekking hadden.
const PAGINAS = [
  '/index.html', '/over-ons.html', '/gidsen.html', '/contact.html', '/woordenlijst.html',
  '/404.html', '/sample-pentest.html', '/sample-juridisch.html', '/sample-download.html',
  '/commands/index.html', '/blog/index.html', '/terminal.html',
  '/blog/nmap-beginnersgids.html',
  '/assets/legal/privacy.html', '/assets/legal/terms.html', '/assets/legal/cookies.html',
];

/**
 * Meet elk element dat ZELF tekst rendert in een van de twee link-tokens, tegen de
 * gecomposite ancestor-achtergrond. Retourneert daarnaast de verzameling effectieve
 * achtergronden die onder links voorkomt — die voedt de token-matrix hieronder.
 */
async function meetLinkTekst(page, thema) {
  await zetThema(page, thema);
  await installeerContrastMeter(page);

  return page.evaluate(() => {
    const { parse, ratio, effBg, eigenTekst, isGroot, gelijk, omschrijf } = window.__contrast;

    // Uit :root lezen, zodat deze test blijft kloppen als de waarden wijzigen.
    const root = getComputedStyle(document.documentElement);
    const TOKENS = {
      '--color-link': parse(root.getPropertyValue('--color-link')),
      '--color-link-hover': parse(root.getPropertyValue('--color-link-hover')),
    };

    const rijen = [];
    const achtergronden = new Set();

    // Ondergrens: de paginakleur zelf. Vier pagina's (contact, de drie sample-pagina's)
    // dragen in light GEEN enkel element met een link-token — hun links staan op
    // --color-accent-text of op knopstijlen, en de navbar is Dark Frame met een eigen
    // token. Zonder deze regel zou de token-matrix daar nul achtergronden hebben en dus
    // niets toetsen. De paginakleur is de achtergrond waar een link zou landen als er
    // een kwam, dus dat is de juiste ondergrens.
    {
      const body = effBg(document.body);
      achtergronden.add(`rgb(${Math.round(body.r)},${Math.round(body.g)},${Math.round(body.b)})`);
    }

    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      const kleur = parse(cs.color);
      const token = Object.keys(TOKENS).find((t) => gelijk(kleur, TOKENS[t]));
      if (!token) continue;
      if (!eigenTekst(el)) continue;
      // Alleen wat daadwerkelijk gerenderd wordt. Een `display: none` element heeft geen
      // achtergrondstapel, dus effBg() valt terug op de paginakleur en levert een contrast
      // dat nergens op slaat. `visibility: hidden` houdt wel rects en telt dus mee.
      if (el.getClientRects().length === 0) continue;

      const bg = effBg(el);
      const groot = isGroot(cs);
      const bgTekst = `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`;
      achtergronden.add(bgTekst);

      rijen.push({
        token,
        sel: omschrijf(el),
        tekst: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
        kleur: cs.color,
        bg: bgTekst,
        fontSize: cs.fontSize,
        groot,
        AA: groot ? 3 : 4.5,
        AAA: groot ? 4.5 : 7,
        contrast: ratio(kleur, bg),
      });
    }

    // Token-matrix: beide tokens tegen élke achtergrond waar op deze pagina een link landt.
    const tokenOvertreders = [];
    for (const naam of Object.keys(TOKENS)) {
      const waarde = root.getPropertyValue(naam).trim();
      for (const bg of achtergronden) {
        const c = ratio(TOKENS[naam], parse(bg));
        if (c < 7) tokenOvertreders.push(`${naam} (${waarde}) op ${bg}: ${c}:1 — lat 7,0`);
      }
    }

    return {
      rijen,
      achtergronden: [...achtergronden],
      tokens: Object.fromEntries(Object.entries(TOKENS).map(([k, v]) => [k, v ? `rgb(${v.r},${v.g},${v.b})` : null])),
      tokenOvertreders,
    };
  });
}

const beschrijf = (r) =>
  `${r.sel} "${r.tekst}" — ${r.contrast}:1 (${r.kleur} op ${r.bg}, ` +
  `${r.fontSize}${r.groot ? ' LARGE' : ''}) [${r.token}]`;

test.describe('Link-tokens — WCAG AAA tegen de effectieve achtergrond', () => {

  // Per pagina, niet als één lus over alle zestien. De accent-spec noteert waarom: 16
  // navigaties in één test werd flaky zodra er een tweede worker naast draaide.
  for (const pad of PAGINAS) {
    test(`${pad} — linktekst haalt AAA in beide thema's`, async ({ page }) => {
      await page.goto(pad);
      await page.evaluate(() => document.fonts.ready);

      for (const thema of ['light', 'dark']) {
        const { rijen, achtergronden, tokens, tokenOvertreders } = await meetLinkTekst(page, thema);

        // Zelfbewakende tak. Meet ik überhaupt iets? Niet "heeft deze pagina links" — vier
        // pagina's hebben in light legitiem nul link-gekleurde elementen — maar: parseren de
        // tokens, en is er een achtergrond om tegen te toetsen? Zonder deze tak zet een
        // hernoemd token (of een pagina die main.css niet laadt) de hele test stil op groen.
        expect(
          { tokensGeldig: Object.values(tokens).every(Boolean), achtergronden: achtergronden.length },
          `${pad} (${thema}): de meter kon niets meten. Parseert --color-link nog, en laadt ` +
            `deze pagina main.css? (tokens: ${JSON.stringify(tokens)})`
        ).toEqual({ tokensGeldig: true, achtergronden: expect.any(Number) });
        expect(achtergronden.length, `${pad} (${thema}): nul achtergronden`).toBeGreaterThan(0);

        // 1. Rusttoestand, per element.
        const onderAAA = rijen.filter((r) => r.contrast < r.AAA);
        expect(
          onderAAA.map(beschrijf),
          `${pad} (${thema}): ${onderAAA.length} van ${rijen.length} link-tekstelementen ` +
            `haalt WCAG AAA niet. Meet tegen de EFFECTIEVE achtergrond, niet tegen --color-bg: ` +
            `de set onder links omvat o.a. #f5f5f5 (inline code) en de badge-composities.`
        ).toEqual([]);

        // 2. Token-matrix. De element-sweep ziet alleen de RUSTtoestand, dus
        //    `--color-link-hover` komt er nauwelijks in voor — terwijl juist die token in
        //    dark op 6,85 stond. Beide tokens worden daarom getoetst tegen élke achtergrond
        //    waar op deze pagina een link landt. Dat dekt de hover zonder hem te simuleren:
        //    een muis-hover per element over 16 pagina's maakt de suite onwerkbaar.
        //    Lat 7,0 (normale tekst), bewust streng — een hover kan op elk element landen,
        //    ook het kleinste, dus de large-text-uitzondering geldt hier niet.
        expect(
          tokenOvertreders,
          `${pad} (${thema}): een link-token haalt geen AAA op een achtergrond waar op deze ` +
            `pagina werkelijk links staan. Dit vangt de HOVER-toestand.`
        ).toEqual([]);
      }
    });
  }

});
