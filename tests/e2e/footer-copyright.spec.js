// E2E Tests voor de uitlijning van de copyright-regel in de footer (Sessie 221)
//
// `.footer-bottom` klapt op ≤768px naar `flex-direction: column` met `align-items: center`.
// Dat centreert de DOOS van de <p>, niet de tekst erin. Zolang de regel op één lijn past
// valt dat samen: de doos krijgt zijn shrink-to-fit-breedte (341px) en staat netjes in het
// midden. Zodra de tekst afbreekt is max-content > beschikbare breedte, wordt de doos exact
// zo breed als de container, en staat de tekst op `text-align: start` — dus links.
//
// Gemeten vóór de fix (over-ons.html, afwijking t.o.v. het midden van .footer-bottom):
//
//   360px : regel 1 −36,5px   regel 2 −115,0px     (2 regels)
//   375px : regel 1 −44,0px   regel 2 −122,5px     (2 regels)
//   390px : regel 1     0px                        (1 regel — hier was niets mis)
//
// Dat 390px al goed was, is de reden dat dit lang onzichtbaar bleef: de meeste telefoons
// zitten daarboven. De bug leeft uitsluitend in de band waarin de regel afbreekt.
//
// De assertie meet daarom de REGELBOXEN van de tekst (Range.getClientRects), niet de <p>.
// De doos meten is precies de meetfout die de bug verborg: die is in het foute geval
// volledig containerbreed en dus "perfect gecentreerd", terwijl de glyphs links staan.

import { test, expect } from './fixtures.js';

const PAGINA = '/over-ons.html';

// Subpixel-marge. De echte bug is 36–122px, dus dit verzwakt de test niet — het vangt
// alleen afrondingsverschillen tussen Chromium, Firefox en WebKit op.
const SUBPIXEL = 1.5;

/**
 * Meet per TEKSTREGEL hoe scheef hij in `.footer-bottom` staat.
 * scheef < 0 = te ver naar links, > 0 = te ver naar rechts, 0 = gecentreerd.
 */
async function meetRegels(page) {
  return page.evaluate(() => {
    const bottom = document.querySelector('.footer-bottom');
    const p = bottom && bottom.querySelector('p');
    if (!p) return { fout: 'geen .footer-bottom p gevonden' };

    const c = bottom.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(p);

    const regels = [...range.getClientRects()].map((b) => ({
      links: +b.left.toFixed(1),
      breedte: +b.width.toFixed(1),
      // Afstand tot links minus afstand tot rechts, gehalveerd → 0 is exact het midden.
      scheef: +(((b.left - c.left) - (c.right - b.right)) / 2).toFixed(1),
      vanafLinks: +(b.left - c.left).toFixed(1),
    }));

    return { regels, richting: getComputedStyle(bottom).flexDirection };
  });
}

test.describe('Footer-copyright — gecentreerd in kolom-modus', () => {

  // 360 en 375 zijn de maten waar de regel afbreekt (iPhone SE, oudere Android).
  for (const breedte of [360, 375]) {
    test(`@${breedte}px staat elke regel van de copyright gecentreerd`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 812 });
      await page.goto(PAGINA);
      await page.evaluate(() => document.fonts.ready);

      const meting = await meetRegels(page);
      expect(meting.fout, meting.fout).toBeUndefined();
      expect(meting.richting, `@${breedte}px hoort .footer-bottom een kolom te zijn`).toBe('column');

      // Guard tegen vals-groen: één regel is triviaal gecentreerd door `align-items: center`.
      // Deze test bewaakt juist het AFGEBROKEN geval. Breekt de copy hier niet meer af, dan
      // is de premisse verlopen en moet er een smallere viewport gekozen worden — dat hoort
      // een faler te zijn, geen stille pass.
      expect(
        meting.regels.length,
        `@${breedte}px breekt de copyright niet meer af (${meting.regels.length} regel). ` +
          `Deze spec test het wrappende geval — kies een smallere viewport. ` +
          `Meting: ${JSON.stringify(meting.regels)}`
      ).toBeGreaterThanOrEqual(2);

      meting.regels.forEach((r, i) => {
        expect(
          Math.abs(r.scheef),
          `@${breedte}px staat regel ${i + 1} ${r.scheef}px uit het midden ` +
            `(links uitgelijnd i.p.v. gecentreerd). Meting: ${JSON.stringify(meting.regels)}`
        ).toBeLessThan(SUBPIXEL);
      });
    });
  }

  // Boven de afbreekgrens hoorde het al goed te gaan; dat mag de fix niet stukmaken.
  test('@390px (past op één regel) blijft gecentreerd', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAGINA);
    await page.evaluate(() => document.fonts.ready);

    const meting = await meetRegels(page);
    expect(meting.fout, meting.fout).toBeUndefined();
    for (const [i, r] of meting.regels.entries()) {
      expect(
        Math.abs(r.scheef),
        `@390px staat regel ${i + 1} ${r.scheef}px uit het midden. ` +
          `Meting: ${JSON.stringify(meting.regels)}`
      ).toBeLessThan(SUBPIXEL);
    }
  });

  // Tegenhanger: de rij-layout ≥769px zet copyright links en socials rechts
  // (`justify-content: space-between`). Deze tests bewaken die GEOMETRIE.
  //
  // Wat ze NIET bewaken — gemeten, niet aangenomen: `text-align: center` op de basisregel
  // zetten i.p.v. in het mobiele blok laat alle 15 tests groen. Dat is geen gat in de test
  // maar een eigenschap van de layout: in rij-modus is de <p> een flex-item op zijn
  // shrink-to-fit-breedte (gemeten 378px = exact zijn max-content), dus de regel vult de
  // doos volledig en `text-align` heeft niets te verdelen. Die mutant is onzichtbaar voor
  // de bezoeker, en een test die hem toch zou vangen zou een implementatiedetail asserteren.
  // De mutant die deze tests wél laat vuren is `justify-content: center` op .footer-bottom:
  // 6 rood (769 + 1280 × 3 motoren, @769px 28,5px van links) / 9 groen.
  for (const breedte of [769, 1280]) {
    test(`@${breedte}px blijft de copyright links staan (rij-layout)`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto(PAGINA);
      await page.evaluate(() => document.fonts.ready);

      const meting = await meetRegels(page);
      expect(meting.fout, meting.fout).toBeUndefined();
      expect(meting.richting, `@${breedte}px hoort .footer-bottom een rij te zijn`).toBe('row');
      expect(
        meting.regels[0].vanafLinks,
        `@${breedte}px begint de copyright ${meting.regels[0].vanafLinks}px van links — ` +
          `in rij-layout hoort hij tegen de linkerrand. Meting: ${JSON.stringify(meting.regels)}`
      ).toBeLessThan(SUBPIXEL);
    });
  }
});
