// E2E-guard: de pagina zakt niet weg bij het laden, en reduced motion scrolt niet (Sessie 244)
//
// Gemeten in de audit van sessie 244:
//   - navbar.js vervangt #navbar-placeholder door een sticky navbar van 60px. Zonder reserve
//     zakte <main> daarna 60px: CLS 0,021-0,042 op 1440 en 0,070-0,078 op 375, op elke pagina
//     die landing.css laadt. Nu reserveert landing.css de hoogte.
//   - sample-download had een cover zonder width/height: nog eens 0,067 op 375.
//   - `html { scroll-behavior: smooth }` (landing.css) gold ook onder reduced motion: een
//     ankersprong scrolde ~350 ms over 2000px, gelijk aan zonder die voorkeur.
//
// De populatie is de hele site (`PAGINAS`), niet de pagina's waar het nu misging.

import { test, expect } from './fixtures.js';
import { PAGINAS } from './helpers/paginas.js';

const MAX_CLS = 0.01;

async function voorbereid(page) {
  await page.addInitScript(() => {
    localStorage.setItem('hacksim_analytics_consent', 'false');
    localStorage.setItem('hacksim_onboarding_seen', 'true');
    localStorage.setItem('hacksim_legal_accepted', 'true');
    localStorage.setItem('hacksim_legal_accepted_date', new Date().toISOString());
    window.__verschuiving = 0;
    window.__meterWerkt = PerformanceObserver.supportedEntryTypes.includes('layout-shift');
    if (window.__meterWerkt) {
      new PerformanceObserver((lijst) => {
        for (const e of lijst.getEntries()) if (!e.hadRecentInput) window.__verschuiving += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    }
  });
}

test.describe('Laden zonder verschuiving', () => {
  test.describe.configure({ timeout: 240_000 });
  // Firefox en WebKit kennen het entrytype `layout-shift` niet; er valt daar niets te meten.
  test.skip(({ browserName }) => browserName !== 'chromium', 'layout-shift bestaat alleen in Chromium');

  for (const breedte of [1440, 375]) {
    test(`geen pagina verschuift bij het laden @${breedte}px`, async ({ page }) => {
      await voorbereid(page);
      await page.setViewportSize({ width: breedte, height: 800 });
      const fouten = [];
      let metNavbar = 0;

      for (const pad of PAGINAS) {
        await page.goto(pad, { waitUntil: 'networkidle' });
        await page.waitForTimeout(600);
        const m = await page.evaluate(() => ({
          meter: window.__meterWerkt,
          cls: window.__verschuiving,
          navbar: !!document.querySelector('.landing-nav-wrapper, nav.navbar, #navbar'),
        }));
        expect(m.meter, 'layout-shift wordt niet ondersteund: deze meting meet niets').toBe(true);
        if (m.navbar) metNavbar++;
        if (m.cls > MAX_CLS) fouten.push(`${pad}: CLS ${m.cls.toFixed(4)}`);
      }

      // Zelfbewaking 1: de meter ziet een echte verschuiving. Een meter die altijd 0 geeft is
      // niet te onderscheiden van een pagina die nooit verschuift.
      const controle = await page.evaluate(async () => {
        const voor = window.__verschuiving;
        const blok = document.createElement('div');
        blok.style.height = '200px';
        document.body.prepend(blok);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        await new Promise((r) => setTimeout(r, 100));
        return window.__verschuiving - voor;
      });
      expect(controle, 'positieve controle: een ingevoegd blok van 200px moet als verschuiving tellen')
        .toBeGreaterThan(0);
      // Zelfbewaking 2: er zijn echt pagina's met een navbar gemeten.
      expect(metNavbar, 'te weinig pagina\'s met een navbar gemeten').toBeGreaterThanOrEqual(20);
      expect(fouten).toEqual([]);
    });
  }
});

test.describe('Reduced motion', () => {
  // `test.use({ reducedMotion })` kwam niet aan (gemeten: terminal.html bleef `smooth`, terwijl
  // animations.css daar onder reduce `auto` afdwingt). emulateMedia wel.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('geen pagina scrolt zacht onder reduced motion', async ({ page }) => {
    await voorbereid(page);
    const zacht = [];
    // Tak: de emulatie is echt actief; anders meet deze test het standaardgedrag.
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    for (const pad of PAGINAS) {
      await page.goto(pad, { waitUntil: 'load' });
      const gedrag = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
      if (gedrag !== 'auto') zacht.push(`${pad}: scroll-behavior ${gedrag}`);
    }
    expect(zacht).toEqual([]);
  });

  test('een ankersprong op de homepage staat direct op zijn doel', async ({ page }) => {
    await voorbereid(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html', { waitUntil: 'networkidle' });
    await page.locator('.landing-nav-wrapper .navbar-toggle').click();
    await page.locator('a[href*="#leerpad"]:visible').first().click();
    const eerste = await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r(window.scrollY))));
    await page.waitForTimeout(400);
    const eind = await page.evaluate(() => window.scrollY);
    // Tak: de sprong ging echt ergens heen; anders is "direct op zijn doel" 0 = 0.
    expect(eind, 'het anker #leerpad ligt lager dan de bovenkant').toBeGreaterThan(500);
    expect(eerste, `na één frame op ${eerste}, eindpunt ${eind}`).toBe(eind);
  });
});
