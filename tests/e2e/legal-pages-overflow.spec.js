/**
 * Horizontale overflow op de drie legal-pagina's (Sessie 224)
 *
 * Sessie 223 mat 22px horizontale overflow op /assets/legal/terms.html @375px en bevestigde
 * via A/B tegen `git archive HEAD` dat hij pre-existing was. De oorzaak bleef staan als
 * "niet vastgesteld — vermoedelijk een pseudo-element of scroll-regio", omdat geen enkel
 * element met zijn BORDER-BOX buiten beeld viel. Dat klopte ook: de <h1> is 280px breed en
 * blijft netjes binnen de viewport; het is zijn INHOUD die 377px meet. Twee verschillende
 * getallen op hetzelfde element, en de scan keek naar het verkeerde.
 *
 * De echte bevinding was het dekkingsgat: privacy.html, terms.html en cookies.html kwamen in
 * géén enkele assertie voor, in geen enkele spec. Daarom bleef dit ongezien. Deze spec sluit dat.
 *
 * Oorzaak: deze drie pagina's laden mobile.css NIET (alleen main.css + legal.css), dus
 * `--font-size-base` blijft 18px op ≤768px en de h1 houdt de UA-default 2em = 36px tot 320px
 * toe. "Gebruiksvoorwaarden" (19 tekens, geen breekpunt) meet dan 377px in een contentbox van
 * 280px. Privacy en cookies ontsnappen omdat hun koppen uit twee woorden bestaan.
 *
 * Nulmeting op terms.html, chromium (firefox/webkit consequent +1px, subpixel):
 *
 *   breedte   A: doc scroll/client  overflow   B: kop scroll/client  over
 *      320          397/320             77           377/280          97
 *      360          397/360             37           377/320          57
 *      375          397/375             22           377/335          42
 *      390          397/390              7           377/350          27
 *      414          414/414              0           377/374           3   <- A groen, B rood
 *
 * Documentbreedte is constant 397 = 20px linkerpadding + 377px kopinhoud. Daarom zijn er TWEE
 * asserties: A mist het defect vanaf 414px, terwijl de kop daar nog steeds buiten zijn eigen
 * box valt. B is de invariant die de fix werkelijk garandeert en die meeschaalt naar elke
 * toekomstige kop.
 *
 * Mutanten (Sessie 224 gemeten, beide reproduceren de nulmeting):
 *   A) `overflow-wrap: break-word` weghalen uit styles/legal.css
 *      -> terms.html: A rood @320 (77) en @375 (22); B rood @320, @375 én @414.
 *         privacy/cookies blijven groen. B faalt op een bredere verzameling dan A.
 *   B) `min-width: 700px` naast `max-width: 800px` op body.legal-page
 *      -> A rood op ALLE DRIE de pagina's; B overal groen (koppen passen prima in 700px).
 *         Bewijst dat A niet overbodig is naast B, én dat privacy/cookies werkelijk gemeten
 *         worden — die zijn vóór en ná de fix groen, dus zonder deze mutant is hun dekking
 *         niet gefalsifieerd.
 */
import { test, expect } from './fixtures.js';

const PAGINAS = [
  '/assets/legal/privacy.html',
  '/assets/legal/terms.html',
  '/assets/legal/cookies.html',
];

// 320 is de smalste maat die dit project bedient en werd nooit getest — daar is het defect
// 3,5x groter dan op 375. 375 is de gemelde maat. 414 stond op exact 0 overflow, dus elke
// verbreding wordt daar meteen rood.
const BREEDTES = [320, 375, 414];

// Firefox en WebKit meten consequent 1px meer dan chromium op dezelfde tekst.
const SUBPIXEL = 1;

const METING = async (thema) => {
  document.documentElement.setAttribute('data-theme', thema);

  // Space Grotesk wordt pas aangevraagd zodra er een kop gerenderd wordt; `fonts.ready` alleen
  // resolvet dan te vroeg en je meet fallback-metrics (Sessie 222).
  const eerste = document.querySelector('h1');
  if (eerste) {
    const cs = getComputedStyle(eerste);
    try {
      await document.fonts.load(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`);
    } catch (_) { /* fallback-font: geen probleem, dan is er niets te laden */ }
  }
  await document.fonts.ready;
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const de = document.documentElement;

  // Een kind van een scroll-container houdt zijn onafgekapte rect. legal.css maakt <table>
  // op ≤768px `display:block; overflow-x:auto`, dus TBODY/TR/TH melden daar rechterranden
  // tot 656px zonder dat de pagina iets doet. Ongefilterd vult dat de hele diagnoselijst en
  // duwt het de echte dader eruit.
  const inScrollContainer = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX;
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return true;
    }
    return false;
  };

  const buiten = [];
  const inhoud = [];
  document.querySelectorAll('body *').forEach((el) => {
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) return;
    const cs = getComputedStyle(el);
    if (['auto', 'scroll', 'hidden'].includes(cs.overflowX)) return;
    if (inScrollContainer(el)) return;

    const naam = `${el.tagName}${el.className ? '.' + String(el.className).split(' ')[0] : ''}`;
    if (b.right > de.clientWidth + 0.5) buiten.push(`${naam} right ${Math.round(b.right)}`);

    // clientWidth is per definitie 0 op inline-elementen, dus scrollWidth > clientWidth is
    // daar altijd waar. Firefox meldt zo elke <strong> als "158>0"; chromium en webkit niet.
    if (cs.display !== 'inline' && el.scrollWidth > el.clientWidth + 1) {
      inhoud.push(`${naam} ${el.scrollWidth}>${el.clientWidth}`);
    }
  });

  const koppen = [...document.querySelectorAll('h1, h2, h3')].map((el) => ({
    tag: el.tagName,
    tekst: (el.textContent || '').trim().slice(0, 40),
    client: el.clientWidth,
    scroll: el.scrollWidth,
  }));

  return {
    docOverflow: de.scrollWidth - de.clientWidth,
    docScroll: de.scrollWidth,
    docClient: de.clientWidth,
    koppen,
    buiten: buiten.slice(0, 5),
    inhoud: inhoud.slice(0, 5),
  };
};

test.describe("Legal-pagina's — geen horizontale overflow op telefoonmaten", () => {

  for (const pad of PAGINAS) {
    for (const breedte of BREEDTES) {
      test(`${pad} @${breedte}px past binnen de viewport (dark + light)`, async ({ page }) => {
        await page.setViewportSize({ width: breedte, height: 800 });
        const respons = await page.goto(pad);

        // Zelfbewaking: een 404 of een lege pagina heeft nul overflow en zou deze test
        // groen laten staan zonder iets te meten.
        expect(respons?.status(), `${pad} gaf HTTP ${respons?.status()}`).toBe(200);

        for (const thema of ['dark', 'light']) {
          const meting = await page.evaluate(METING, thema);
          const context = `${pad} @${breedte}px (${thema})`;

          const kop = meting.koppen.find((k) => k.tag === 'H1');
          expect(kop, `${context}: geen <h1> gevonden — meet deze test nog wel iets?`).toBeTruthy();
          expect(kop.tekst.length, `${context}: de <h1> is leeg`).toBeGreaterThan(0);
          expect(kop.client, `${context}: de <h1> heeft breedte 0`).toBeGreaterThan(0);

          // A — de pagina zelf schuift of clipt niet zijwaarts.
          expect(
            meting.docOverflow,
            `${context}: ${meting.docOverflow}px horizontale overflow ` +
              `(scrollWidth ${meting.docScroll} / clientWidth ${meting.docClient}). ` +
              `Buiten beeld: ${meting.buiten.length ? meting.buiten.join(', ') : '(niets)'}. ` +
              `Inhoud buiten eigen box: ${meting.inhoud.length ? meting.inhoud.join(', ') : '(niets)'}`
          ).toBeLessThanOrEqual(0);

          // B — geen koptekst valt buiten zijn eigen box. Strenger dan A, en met opzet: @414px
          // is A groen (397 < 414) terwijl de kop zijn box nog 3px overschrijdt.
          const teBreed = meting.koppen
            .filter((k) => k.scroll > k.client + SUBPIXEL)
            .map((k) => `${k.tag} "${k.tekst}" ${k.scroll}>${k.client}`);
          expect(
            teBreed,
            `${context}: koptekst valt buiten de eigen box. Staat overflow-wrap:break-word ` +
              `nog op body.legal-page h1/h2/h3 in styles/legal.css?`
          ).toEqual([]);
        }
      });
    }
  }
});
