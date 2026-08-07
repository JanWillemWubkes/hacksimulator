// E2E Tests voor de gidsen-grid lay-out (Sessie 213)
//
// Drie gemelde klachten, drie oorzaken, drie asserties:
//   1. "de 4e gids staat alleen onderaan"  -> .feature-cards was een harde 3-koloms grid
//   2. "cta's lijnen niet uit"             -> .gids-card p { flex:1 } matchte OOK
//                                             p.gids-sample-link, dus twee flex-items
//                                             deelden de rek en margin-top:auto werd no-op
//   3. tablet was nog erger                -> .feature-card:nth-child(3) { grid-column:1/-1 }
//                                             is bedoeld voor 3-kaart-grids en vuurde op 4
//
// De fix van (3) zit in gedeelde CSS (landing.css), dus index.html en de twee
// sample-pagina's worden hier expliciet bewaakt: die MOETEN ongewijzigd blijven.

import { test, expect } from './fixtures.js';

const DESKTOP = { width: 1440, height: 900 };
const TABLET = { width: 1000, height: 900 };
const MOBIEL = { width: 375, height: 800 };

/** Meet per gids-kaart waar de CTA staat t.o.v. de onderkant van zijn eigen kaart. */
async function meetKaarten(page) {
  return page.evaluate(() => {
    const cards = [...document.querySelectorAll('.gids-card')];
    return cards.map((c) => {
      const kaart = c.getBoundingClientRect();
      const cta = c.querySelector('.btn-cta').getBoundingClientRect();
      return {
        breedte: Math.round(kaart.width),
        y: Math.round(kaart.y + window.scrollY),
        // Rij-onafhankelijke invariant: alle kaarten in de grid zijn even hoog en
        // .gids-related is overal even groot, dus deze afstand hoort identiek te zijn
        // ongeacht welke kaart een sample-chip draagt.
        ctaTotBodem: Math.round(kaart.bottom - cta.bottom)
      };
    });
  });
}

test.describe('Gidsen — grid lay-out', () => {

  test('alle vier de CTA-knoppen staan op dezelfde hoogte in hun kaart', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/gidsen.html');

    const kaarten = await meetKaarten(page);
    expect(kaarten).toHaveLength(4);

    const afstanden = kaarten.map((k) => k.ctaTotBodem);
    const uniek = [...new Set(afstanden)];
    expect(
      uniek,
      `CTA-afstand tot kaartbodem verschilt per kaart: ${JSON.stringify(afstanden)}`
    ).toHaveLength(1);
  });

  test('geen weeskaart: vier gelijke breedtes in twee rijen (desktop + tablet)', async ({ page }) => {
    for (const viewport of [DESKTOP, TABLET]) {
      await page.setViewportSize(viewport);
      await page.goto('/gidsen.html');

      const kaarten = await meetKaarten(page);
      const breedtes = [...new Set(kaarten.map((k) => k.breedte))];
      const rijen = [...new Set(kaarten.map((k) => k.y))];

      expect(
        breedtes,
        `@${viewport.width}px ongelijke kaartbreedtes: ${JSON.stringify(kaarten.map((k) => k.breedte))}`
      ).toHaveLength(1);
      expect(
        rijen.length,
        `@${viewport.width}px verwacht 2 rijen van 2, kreeg ${rijen.length} rijen`
      ).toBe(2);
    }
  });

  test('mobiel: één kolom, geen horizontale overflow', async ({ page }) => {
    await page.setViewportSize(MOBIEL);
    await page.goto('/gidsen.html');

    const meting = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      rijen: [...new Set([...document.querySelectorAll('.gids-card')]
        .map((c) => Math.round(c.getBoundingClientRect().y + window.scrollY)))].length
    }));

    // De 2-koloms-regel hoort in @media (min-width:769px) te staan. Zonder die
    // begrenzing wint pages.css van de mobiele 1fr-regel (zelfde specificiteit,
    // later geladen) en ontstaat er overflow.
    expect(meting.overflow, 'horizontale overflow op 375px').toBeLessThanOrEqual(0);
    expect(meting.rijen, 'op mobiel hoort elke kaart zijn eigen rij te hebben').toBe(4);
  });

});

test.describe('Gidsen — gratis sample per kaart', () => {

  test('beide sample-chips zijn zichtbaar en groot genoeg om aan te tikken', async ({ page }) => {
    await page.setViewportSize(MOBIEL);
    await page.goto('/gidsen.html');

    const chips = page.locator('.gids-card .gids-sample-link');
    await expect(chips).toHaveCount(2);

    // WCAG AAA tap target: 44x44px minimum
    const hoogtes = await chips.evaluateAll((els) =>
      els.map((e) => Math.round(e.getBoundingClientRect().height))
    );
    for (const h of hoogtes) {
      expect(h, `sample-chip is ${h}px hoog, minimum is 44px`).toBeGreaterThanOrEqual(44);
    }
  });

  test('chip-kleuren komen uit variabelen (klopt in light én dark)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);

    for (const thema of ['dark', 'light']) {
      await page.goto('/gidsen.html');
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), thema);

      const kleuren = await page.locator('.gids-sample-link').first().evaluate((el) => {
        const s = getComputedStyle(el);
        return { kleur: s.color, achtergrond: s.backgroundColor, rand: s.borderTopColor };
      });

      // Blauw (#0969da / #79c0ff) is het blog-palet; een main-site productkaart
      // hoort het groene accent te gebruiken.
      expect(kleuren.kleur, `${thema}: chip-tekst is blauw i.p.v. groen`).not.toMatch(/9, 105, 218|121, 192, 255/);
      // Niet transparant = de achtergrond komt echt uit een gedefinieerde variabele
      expect(kleuren.achtergrond, `${thema}: chip heeft geen achtergrond`).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

});

test.describe('Gidsen-fix raakt gedeelde CSS — regressiewacht', () => {

  // landing.css :nth-child(3) kreeg :last-child erbij. Grids met precies 3 kaarten
  // moeten hun gecentreerde onderkaart op tablet HOUDEN.
  test('index.html houdt zijn gecentreerde 3e kaart op tablet', async ({ page }) => {
    await page.setViewportSize(TABLET);
    await page.goto('/');

    const derde = await page.locator('.feature-cards .feature-card').nth(2).evaluate((el) => {
      const s = getComputedStyle(el);
      return { gridColumn: s.gridColumn, maxWidth: s.maxWidth };
    });

    expect(derde.gridColumn).toBe('1 / -1');
    expect(derde.maxWidth).toBe('500px');
  });

  test('sample-pagina\'s houden hun 3-koloms kaartrij op desktop', async ({ page }) => {
    await page.setViewportSize(DESKTOP);

    for (const pad of ['/sample-pentest.html', '/sample-juridisch.html']) {
      await page.goto(pad);
      const kolommen = await page.locator('.feature-cards').evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length
      );
      expect(kolommen, `${pad} hoort 3 kolommen te houden`).toBe(3);
    }
  });

  // Zelfde grondoorzaak, andere pagina: over-ons heeft ook 4 kaarten in dit grid.
  test('over-ons.html: geen kaart die door zijn eigen kolomspoor breekt', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 900 });
    await page.goto('/over-ons.html');

    const meting = await page.evaluate(() => {
      const grid = document.querySelector('.features-4col');
      const gr = grid.getBoundingClientRect();
      const kaarten = [...grid.children].map((c) => c.getBoundingClientRect());
      return {
        breedtes: kaarten.map((r) => Math.round(r.width)),
        // Steekt een kaart buiten zijn eigen grid uit? Dát was het defect: kaart 3
        // kreeg max-width 500px in een kolomspoor van 136px.
        buitenGrid: kaarten.filter((r) => r.right > gr.right + 1 || r.left < gr.left - 1).length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    });

    const uniek = [...new Set(meting.breedtes)];
    expect(uniek, `ongelijke kaartbreedtes: ${JSON.stringify(meting.breedtes)}`).toHaveLength(1);
    expect(meting.buitenGrid, 'kaart steekt buiten het grid uit').toBe(0);
    // Kan sinds de nav-inklapband (zie navbar-collapse.spec.js) weer hard geassert
    // worden: vóór Sessie 213 gaf de navbar hier 341px overflow.
    expect(meting.overflow, 'horizontale overflow op 820px').toBeLessThanOrEqual(0);
  });

});
