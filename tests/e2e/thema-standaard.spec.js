// E2E: de themastandaard per pagina (Sessie 238)
//
// De landingspagina is ontworpen als licht papier (het raster van Total Design); de
// simulator als terminal. Zonder opgeslagen keuze kiest init-theme.js daarom wat de pagina
// op <html data-theme-default> zet, en anders donker. Een expliciete keuze via de
// schakelaar staat in localStorage en wint overal.
//
// Twee defecten die deze spec afdekt, allebei gevonden bij de bouw:
//   1. navbar.js zette het thema na de injectie opnieuw op `localStorage || 'dark'` —
//      de landingspagina sprong daarmee na ~100ms terug naar donker. Daarom meten we ná
//      de navbar (die de schakelaar synchroniseert), niet direct na de paint.
//   2. init-theme.js stond onderaan de body: de pagina schilderde eerst in de
//      standaardkleuren en sprong dan om.

import { test, expect } from './fixtures.js';

/** Het thema zoals de pagina het draagt, ná de navbar-injectie. */
async function themaNaInjectie(page, pad) {
  await page.goto(pad);
  await page.waitForSelector('.theme-toggle');
  return page.evaluate(() => ({
    thema: document.documentElement.getAttribute('data-theme'),
    actief: [...document.querySelectorAll('.theme-toggle .toggle-option.active')].map((o) => o.dataset.theme),
  }));
}

test.describe('Themastandaard per pagina', () => {
  test('zonder keuze: de landingspagina is licht, de simulator donker', async ({ page }) => {
    const index = await themaNaInjectie(page, '/index.html');
    expect(index.thema, 'index.html zonder opgeslagen keuze').toBe('light');
    // Zelfbewakend: de schakelaar moet het ook zeggen, anders klopt de indicator niet
    // met wat de bezoeker ziet (en is er misschien geen schakelaar gemeten).
    expect(index.actief.length, 'geen schakelaar gevonden').toBeGreaterThan(0);
    expect(new Set(index.actief)).toEqual(new Set(['light']));

    const terminal = await themaNaInjectie(page, '/terminal.html');
    expect(terminal.thema, 'terminal.html zonder opgeslagen keuze').toBe('dark');
  });

  test('een opgeslagen keuze wint op de landingspagina', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    const index = await themaNaInjectie(page, '/index.html');
    expect(index.thema).toBe('dark');
    expect(new Set(index.actief)).toEqual(new Set(['dark']));
  });

  test('het thema staat er vóór de eerste paint', async ({ page }) => {
    // Het script moet in de <head> staan en synchroon draaien. Gelezen uit de bron
    // die de browser krijgt, want een verschuiving naar onderen geeft geen JS-fout.
    const html = await (await page.request.get('/index.html')).text();
    const kop = html.slice(0, html.indexOf('</head>'));
    expect(kop, 'init-theme.js hoort in de <head>').toContain('src="/src/init-theme.js"');
    expect(kop).not.toMatch(/init-theme\.js"[^>]*(defer|async|type="module")/);
  });
});
