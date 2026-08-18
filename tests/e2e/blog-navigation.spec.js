// E2E: blognavigatie en -toegankelijkheid (Sessie 226)
//
// Drie invarianten die alleen GERENDERD meetbaar zijn en daarom niet in validate-blogs.sh
// kunnen wonen (dat script ziet alleen statische HTML):
//
//  1. Tapdoelen op het categoriefilter. Gemeten vóór deze sessie: 7/7 knoppen 26,8px hoog
//     op 375px, terwijl WCAG AAA (2.5.5) 44x44 eist. De oorzaak was niet de padding maar
//     `display`: op een inline <a> doet min-height niets. Precies daarom meet deze test de
//     gerenderde box en niet de CSS-declaratie.
//
//  2. Contrast van gedempte tekst, in BEIDE thema's. `--color-text-dim` was #8b949e en gaf
//     6,15:1 op de pagina en 5,62:1 op een kaart — allebei onder de AAA-lat van 7,0 die dit
//     project voert. Eén thema testen laat zulke fouten door (zie architecture-patterns §9/§10).
//
//  3. De inhoudsopgave. Deeplink moet ónder de fixed navbar landen (scroll-padding-top) en
//     de actieve sectie moet de sectie zijn waar je staat.
//
// MEETVAL (kostte mij deze sessie een vals resultaat): lees NOOIT getComputedStyle in dezelfde
// tick als een themawissel. `.related-card` draagt `transition: 0.15s`; ik mat de STARTwaarde
// van een lopende animatie en concludeerde twee ernstige light-mode-defecten (2,90 en 1,78)
// die niet bestonden — na settelen 9,17 en 9,74. Vandaar de wachttijd in meetContrast().

import { test, expect } from './fixtures.js';

const POST = '/blog/nmap-beginnersgids.html';
const AAA_NORMAAL = 7.0;
const AAA_GROOT = 4.5;

/** Contrast tegen de EFFECTIEVE (gecomposite) achtergrond — architecture-patterns.md §10. */
async function meetContrast(page, thema, selectors) {
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), thema);
  await page.waitForTimeout(500); // transities laten uitklinken — zie kop van dit bestand

  return page.evaluate((sels) => {
    const parse = (c) => (c.match(/[\d.]+/g) || []).map(Number);
    const effBg = (el) => {
      let n = el;
      const lagen = [];
      while (n && n !== document.documentElement) {
        const b = parse(getComputedStyle(n).backgroundColor);
        if (b.length >= 3 && (b[3] === undefined || b[3] > 0)) {
          lagen.push(b);
          if (b[3] === undefined || b[3] === 1) break;
        }
        n = n.parentElement;
      }
      const basis = parse(getComputedStyle(document.documentElement).backgroundColor);
      const laatste = lagen[lagen.length - 1];
      let acc = lagen.length && (laatste[3] === undefined || laatste[3] === 1)
        ? lagen.pop().slice(0, 3)
        : (basis.length >= 3 ? basis.slice(0, 3) : [255, 255, 255]);
      for (let i = lagen.length - 1; i >= 0; i--) {
        const l = lagen[i];
        const a = l[3] === undefined ? 1 : l[3];
        acc = [0, 1, 2].map((k) => l[k] * a + acc[k] * (1 - a));
      }
      return acc;
    };
    const lum = ([r, g, b]) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const uit = [];
    for (const sel of sels) {
      for (const el of document.querySelectorAll(sel)) {
        const cs = getComputedStyle(el);
        if (!el.textContent.trim() || el.getBoundingClientRect().width === 0) continue;
        const px = parseFloat(cs.fontSize);
        const groot = px >= 24 || (px >= 18.66 && (parseInt(cs.fontWeight, 10) || 400) >= 700);
        const a = lum(parse(cs.color).slice(0, 3));
        const b = lum(effBg(el));
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        uit.push({ sel, px, groot, ratio: Math.round(ratio * 100) / 100 });
      }
    }
    return uit;
  }, selectors);
}

test.describe('Blogindex: categoriefilter', () => {
  test('elke filterknop is een tapdoel van minstens 44x44 (@375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/blog/');

    const knoppen = await page.$$eval('.category-btn', (els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return { tekst: e.textContent.trim(), w: r.width, h: r.height };
      })
    );

    // Zelfbewakende tak: nul knoppen betekent dat de selector verouderd is, niet dat alles
    // in orde is. Zonder deze assertie zou de test stil groen blijven en niets meten.
    expect(knoppen.length, 'geen .category-btn gevonden — selector verouderd?').toBeGreaterThan(0);

    const teKlein = knoppen.filter((k) => k.w < 44 || k.h < 44);
    expect(teKlein, `te kleine tapdoelen: ${JSON.stringify(teKlein)}`).toEqual([]);
  });

  test('de actieve categorie is programmatisch kenbaar, niet alleen visueel', async ({ page }) => {
    await page.goto('/blog/#tools');
    await page.waitForTimeout(200);

    const actief = await page.$$eval('.category-btn[aria-current]', (els) =>
      els.map((e) => e.textContent.trim())
    );
    expect(actief).toEqual(['Tools']);

    const zichtbaar = await page.$$eval('.blog-post-card', (els) =>
      els.filter((e) => getComputedStyle(e).display !== 'none').length
    );
    const teller = await page.textContent('.blog-filter-count');
    expect(teller).toBe(`${zichtbaar} van 15 artikelen`);
  });

  test('het eerste artikel staat binnen het eerste scherm (@375x812)', async ({ page }) => {
    // Het nieuwsbriefblok stond tussen filter en grid en duwde de eerste kaart naar y=1125,
    // 313px voorbij een vol scherm. Een blogindex waar geen enkel artikel zichtbaar is,
    // toont de bezoeker niet waar de blog over gaat.
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/blog/');
    const top = await page.$eval('.blog-post-card', (e) => e.getBoundingClientRect().top);
    expect(top).toBeLessThan(812);
  });
});

test.describe('Blogpost: inhoudsopgave', () => {
  test('bouwt zich uit de sectiekoppen, zonder CTA-koppen mee te nemen', async ({ page }) => {
    await page.goto(POST);
    await page.waitForSelector('.blog-toc');

    const items = await page.$$eval('.blog-toc ol li a', (els) =>
      els.map((e) => ({ href: e.getAttribute('href'), tekst: e.textContent.trim() }))
    );
    expect(items.length).toBeGreaterThanOrEqual(3);

    // Elke TOC-link moet naar een bestaande sectiekop wijzen die géén callout/CTA is.
    const geldig = await page.evaluate((hrefs) => {
      const uitsluiten = '.blog-cta, .blog-tip, .blog-warning, .blog-info, .blog-support-banner';
      return hrefs.map((h) => {
        const el = document.getElementById(h.slice(1));
        return { h, bestaat: !!el, isSectie: !!el && el.tagName === 'H2' && !el.closest(uitsluiten) };
      });
    }, items.map((i) => i.href));

    expect(geldig.filter((g) => !g.bestaat), 'TOC verwijst naar niet-bestaande id').toEqual([]);
    expect(geldig.filter((g) => !g.isSectie), 'CTA/callout-kop in de TOC').toEqual([]);
  });

  test('een deeplink landt onder de vaste navbar, niet erachter', async ({ page }) => {
    await page.goto(`${POST}#scan-resultaten-interpreteren`);
    await page.waitForTimeout(700);

    const { top, navHoogte } = await page.evaluate(() => ({
      top: document.getElementById('scan-resultaten-interpreteren').getBoundingClientRect().top,
      navHoogte: parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
      ),
    }));
    expect(top).toBeGreaterThanOrEqual(navHoogte);
  });

  test('de actieve sectie volgt de scrollpositie', async ({ page }) => {
    await page.goto(POST);
    await page.waitForSelector('.blog-toc');

    const ids = await page.$$eval('.blog-toc ol li a', (els) =>
      els.map((e) => e.getAttribute('href').slice(1))
    );
    for (const id of [ids[1], ids[Math.floor(ids.length / 2)], ids[ids.length - 1]]) {
      await page.evaluate((i) => document.getElementById(i).scrollIntoView(), id);
      await page.waitForTimeout(700); // scroll-behavior: smooth laten uitlopen
      const gemarkeerd = await page.$eval('.blog-toc ol li a[aria-current="true"]', (e) =>
        e.getAttribute('href').slice(1)
      );
      expect(gemarkeerd, `bij sectie ${id}`).toBe(id);
    }
  });
});

test.describe('Blog: gedempte tekst haalt AAA in beide thema\'s', () => {
  const SELECTORS = [
    '.breadcrumb a', '.blog-ai-notice', '.blog-post-meta time',
    '.related-meta', '.related-card p', '.related-category', '.blog-toc ol li a',
  ];

  for (const thema of ['dark', 'light']) {
    test(`contrast >= AAA (${thema})`, async ({ page }) => {
      await page.goto(POST);
      await page.waitForSelector('.blog-toc');
      const metingen = await meetContrast(page, thema, SELECTORS);

      expect(metingen.length, 'niets gemeten — selectors verouderd?').toBeGreaterThan(0);
      const onvoldoende = metingen.filter((m) => m.ratio < (m.groot ? AAA_GROOT : AAA_NORMAAL));
      expect(onvoldoende, `onder AAA in ${thema}: ${JSON.stringify(onvoldoende)}`).toEqual([]);
    });
  }
});
