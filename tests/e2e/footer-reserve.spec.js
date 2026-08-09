// E2E Tests voor de reserve onder de mobiele CTA-balk (Sessie 217)
//
// `body.landing-page` droeg een `padding-bottom: 76px` als ruimte voor `.mobile-cta-bar`.
// Die padding wordt geverfd met de BODY-achtergrond, en dat is in light mode `#f8f8f8`
// tegen een footer van `#1a1a1a` — 16,39:1, dus een onmiskenbare witte strook onder de
// donkere footer. Gemeten op 390x844:
//
//   negen landingspagina's zónder balk : 76px strook
//   index.html (mét balk)              : 11px strook (reserve 76 − balkhoogte 65)
//
// In dark mode is diezelfde strook 1,04:1 en dus onzichtbaar. Het is een light-only
// defect, maar het raakt alle tien de pagina's — de oorspronkelijke notitie noemde er
// negen en miste index.html.
//
// De fix zet de reserve op de FOOTER (die is donker in beide thema's) i.p.v. op de body,
// gescoped met `:has(.mobile-cta-bar)` zodat balkloze pagina's hem helemaal niet krijgen.
//
// De assertie hieronder is GEOMETRISCH en niet kleur-gebaseerd. Dat is bewust: de vraag
// "ligt er paginakleur onder de footer" is thema-onafhankelijk te stellen als "is er
// ruimte onder de footer die niet door de balk wordt afgedekt", en die vorm blijft
// kloppen als iemand later aan de themakleuren draait.

import { test, expect } from './fixtures.js';

// Alle pagina's met <body class="landing-page">. Alleen index.html draagt .mobile-cta-bar.
const LANDINGSPAGINAS = [
  '/index.html',
  '/over-ons.html',
  '/gidsen.html',
  '/contact.html',
  '/woordenlijst.html',
  '/commands/index.html',
  '/404.html',
  '/sample-pentest.html',
  '/sample-juridisch.html',
  '/sample-download.html',
];

/**
 * Meet op maximale scrollpositie hoeveel ruimte er onder de footer overblijft die
 * NIET door een zichtbare CTA-balk wordt afgedekt.
 *
 * Twee dingen die hier misgaan als je ze niet expliciet doet:
 *  - `window.scrollTo(0, y)` ANIMEERT, want `html { scroll-behavior: smooth }` staat in
 *    animations.css. Zonder `behavior: 'instant'` meet je de vorige positie.
 *  - de IntersectionObserver die `data-state` zet heeft na 2 rAF nog niet gevuurd. Zonder
 *    settle lees je de staat van de vórige scrollpositie — precies de fout die deze meting
 *    tijdens Sessie 217 eerst zelf maakte (hij las `verborgen` van y=0 af).
 */
async function meetStrook(page) {
  return page.evaluate(async () => {
    const de = document.documentElement;
    window.scrollTo({ top: de.scrollHeight, behavior: 'instant' });
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 300));

    const footer = document.querySelector('.landing-footer');
    if (!footer) return { fout: 'geen .landing-footer gevonden' };

    const fr = footer.getBoundingClientRect();
    const gat = window.innerHeight - fr.bottom;
    const balk = document.querySelector('.mobile-cta-bar');
    const zichtbaar = balk && getComputedStyle(balk).visibility === 'visible';

    // De balk is `position: fixed; bottom: 0`, dus hij dekt alles onder zijn eigen top af.
    // Bewust NIET afgerond: documenthoogtes zijn fractioneel (gemeten body 1308,5px op
    // /404.html) terwijl `scrollHeight` naar boven afrondt, dus scrollen naar de bodem
    // schiet tot 1px door. Dat residu is een afrondingsartefact van de layout en geen
    // strook; afronden maakte er `Math.round(0.5) === 1` van en dus een valse faler.
    const onbedekt = zichtbaar
      ? Math.max(0, balk.getBoundingClientRect().top - fr.bottom)
      : Math.max(0, gat);

    return {
      onbedekt,
      gat,
      balk: balk ? balk.dataset.state || 'geen-state' : 'afwezig',
      balkZichtbaar: !!zichtbaar,
      bodyPad: getComputedStyle(document.body).paddingBottom,
      footerPad: getComputedStyle(footer).paddingBottom,
    };
  });
}

// Alles onder 1 CSS-pixel is subpixel-afronding (zie meetStrook). Een echte regressie is
// 76px (reserve op de body) of 11px (reserve 76 − balkhoogte 65) en komt daar niet bij in
// de buurt, dus deze grens verzwakt de test niet.
const SUBPIXEL = 1;

test.describe('Footer-reserve — geen paginakleur onder de footer', () => {

  for (const pad of LANDINGSPAGINAS) {
    test(`${pad} @375px sluit onderaan af op de footer`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(pad);
      await page.evaluate(() => document.fonts.ready);

      const meting = await meetStrook(page);
      expect(meting.fout, `${pad}: ${meting.fout}`).toBeUndefined();
      expect(
        meting.onbedekt,
        `${pad}: ${meting.onbedekt}px onder de footer wordt door niets afgedekt en toont ` +
          `dus de paginakleur (in light mode een witte strook onder een donkere footer). ` +
          `Meting: ${JSON.stringify(meting)}`
      ).toBeLessThan(SUBPIXEL);
    });
  }

  // De balk bestaat in de hele inklapband 0–1279px, niet alleen op telefoonmaten.
  // Hier hoort de reserve dus óók te kloppen, en boven 1280px verdwijnt de balk zodat
  // er helemaal geen reserve meer nodig is.
  for (const breedte of [768, 1000, 1280]) {
    test(`/index.html @${breedte}px sluit onderaan af op de footer`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 812 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);

      const meting = await meetStrook(page);
      expect(
        meting.onbedekt,
        `index.html @${breedte}px: ${meting.onbedekt}px onbedekt onder de footer. ` +
          `Meting: ${JSON.stringify(meting)}`
      ).toBeLessThan(SUBPIXEL);
    });
  }

  // De reden dat de reserve op de body stond, was dat hij ONVOORWAARDELIJK moest zijn:
  // beweegt hij mee met `data-state`, dan verandert de documenthoogte bij elke toggle →
  // scrollsprong → de balk beoordeelt opnieuw → terugkoppellus onder de duim van de
  // bezoeker. `:has()` op de aanwezigheid van het element is statisch, maar dat is een
  // bewering tot je hem meet.
  test('de reserve beweegt niet mee met data-state (geen terugkoppellus)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html');
    await page.waitForFunction(() => document.querySelector('.mobile-cta-bar[data-state]'));

    const hoogtes = await page.evaluate(() => {
      const balk = document.querySelector('.mobile-cta-bar');
      const de = document.documentElement;
      const uit = [];
      for (const staat of ['zichtbaar', 'verborgen', 'zichtbaar', 'verborgen']) {
        balk.dataset.state = staat;
        de.getBoundingClientRect(); // forceer layout
        uit.push({ staat, hoogte: de.scrollHeight });
      }
      return uit;
    });

    const uniek = [...new Set(hoogtes.map((h) => h.hoogte))];
    expect(
      uniek,
      `documenthoogte verandert bij het omklappen van de balk: ${JSON.stringify(hoogtes)}`
    ).toHaveLength(1);
  });
});
