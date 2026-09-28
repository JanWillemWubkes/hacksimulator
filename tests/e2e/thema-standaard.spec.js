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

// ==================== Tokens horen op de wortel (Sessie 243) ====================
//
// `[data-theme="light"] { --tokens }` bedoelde "het document is licht", maar matchte óók
// de optie `<span class="toggle-option" data-theme="light">` van de schakelaar. Dat span
// kreeg zo alle lichte sitetokens op zichzelf en negeerde elke override van een voorouder:
// op de landingspagina een actieve pil in #c9d1d9 (GitHub-grijs) in plaats van de inversie
// inkt/papier, en in donker een inactief label in #a1a8b0 in plaats van --af-inkt-2.
// Twee blokken (main.css, landing.css) staan nu op :root. De klasse is breder dan die twee:
// élke regel met custom properties die een ander element dan <html> met data-theme raakt.

import { PAGINAS } from './helpers/paginas.js';

const ZONDER_SCHAKELAAR = new Set(['/assets/legal/privacy.html', '/assets/legal/terms.html', '/assets/legal/cookies.html']);

test.describe('Thematokens horen op de wortel', () => {
  test('geen regel met tokens raakt een schakelaaroptie, op geen enkele pagina', async ({ page }) => {
    test.setTimeout(120_000);
    const fouten = [];
    let paginasMetOpties = 0;
    let regelsMetTokens = 0;
    for (const pad of PAGINAS) {
      await page.goto(pad);
      if (!ZONDER_SCHAKELAAR.has(pad)) await page.waitForSelector('.theme-toggle', { state: 'attached' });
      const m = await page.evaluate(() => {
        const doelen = [...document.querySelectorAll('[data-theme]')].filter((e) => e !== document.documentElement);
        const regels = [];
        const loop = (lijst) => {
          for (const r of lijst) {
            if (r.cssRules && !r.selectorText) { loop(r.cssRules); continue; }   // @media, @supports
            if (!r.selectorText || !r.style) continue;
            if (![...r.style].some((p) => p.startsWith('--'))) continue;
            regels.push(r.selectorText);
          }
        };
        for (const s of document.styleSheets) { try { loop(s.cssRules); } catch { /* andere origin */ } }
        const raak = [];
        for (const sel of regels) for (const d of doelen) { try { if (d.matches(sel)) raak.push(`${sel} -> ${d.className}[${d.dataset.theme}]`); } catch { /* onbekende selector */ } }
        return { opties: doelen.length, regels: regels.length, raak: [...new Set(raak)] };
      });
      if (ZONDER_SCHAKELAAR.has(pad)) { expect(m.opties, `${pad} heeft opeens elementen met data-theme`).toBe(0); continue; }
      if (m.opties >= 2) paginasMetOpties++;
      regelsMetTokens = Math.max(regelsMetTokens, m.regels);
      for (const r of m.raak) fouten.push(`${pad}: ${r}`);
    }
    // Zelfbewakend: de schakelaar is gevonden en er zijn tokenregels gelezen.
    expect(paginasMetOpties, 'te weinig pagina\'s met schakelaaropties gemeten').toBeGreaterThanOrEqual(20);
    expect(regelsMetTokens, 'geen tokenregels gelezen — de meting heeft niet gedraaid').toBeGreaterThan(5);
    expect(fouten, 'tokenregel raakt een schakelaaroptie').toEqual([]);
  });

  for (const thema of ['light', 'dark']) {
    test(`landingspagina ${thema}: de actieve optie is de inversie, de inactieve gedempt, de footer inkt`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/index.html');
      await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
      const schakelaar = page.locator('.theme-toggle:visible').first();
      if (thema === 'dark') await schakelaar.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', thema);

      const m = await page.evaluate(() => {
        const kleur = (v) => { const e = document.createElement('i'); e.style.color = v; document.body.appendChild(e); const c = getComputedStyle(e).color; e.remove(); return c; };
        const body = getComputedStyle(document.body);
        const token = (n) => kleur(body.getPropertyValue(n).trim());
        const t = [...document.querySelectorAll('.theme-toggle')].find((e) => e.getClientRects().length);
        const actief = t.querySelector('.toggle-option.active');
        const inactief = t.querySelector('.toggle-option:not(.active)');
        return {
          inkt: token('--af-inkt'), papier: token('--af-papier'), inkt2: token('--af-inkt-2'),
          actiefBg: getComputedStyle(actief).backgroundColor, actiefKleur: getComputedStyle(actief).color,
          inactiefKleur: getComputedStyle(inactief).color,
          footer: getComputedStyle(document.querySelector('footer')).backgroundColor,
        };
      });
      expect(m.inkt, 'token --af-inkt niet gelezen').toMatch(/^rgb/);
      expect([m.actiefBg, m.actiefKleur], 'actieve optie is niet de inversie inkt/papier').toEqual([m.inkt, m.papier]);
      expect(m.inactiefKleur, 'inactieve optie niet in --af-inkt-2').toBe(m.inkt2);
      // Licht: de footer is inkt (#111). Donker: zwart, zodat hij zijn gemeten tekstkleuren houdt.
      expect(m.footer, 'footer heeft niet de achtergrond van het affiche').toBe(thema === 'light' ? m.inkt : 'rgb(0, 0, 0)');
    });
  }
});
