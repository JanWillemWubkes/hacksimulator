/**
 * Markerhaken schilderen daadwerkelijk, en de pijl staat op de haaklijn (Sessie 233)
 *
 * Aanleiding: het her-capturen van de launch-visuals liet zien dat de terminal `[→]`
 * in Chromium rendeert als ` →]` — de openingshaak schilderde niet. De DOM klopte
 * (U+005B stond er gewoon), dus `textContent` had dit nooit gezien.
 *
 * Oorzaakketen, van onder naar boven:
 *   1. `styles/fonts/jetbrainsmono-latin.woff2` miste U+2192 `→`, U+2190 `←` en U+2713 `✓`.
 *   2. Die vielen daarom terug op een systeemfont met een andere baseline — te laag.
 *   3. `renderer.js` compenseerde dat met `<span class="marker-arrow">` + `top:-.2em`.
 *   4. Die span knipte de regel in tekst-runs en liet `[` over als run van ÉÉN teken
 *      vóór een elementgrens. Chromium schildert die niet (firefox/webkit wel).
 *
 * Nulmeting vóór de fix, chromium, alle drie op x=60 in hetzelfde beeld:
 *
 *     [✓]   inkt 185      rendert
 *     [TIP] inkt 255      rendert
 *     [→]   inkt 9 en 13  ACHTERGROND  <-- het defect
 *
 * Sessie 233 repareerde de oorzaak in het brondocument: de drie codepoints zijn aan de
 * subset toegevoegd (232 i.p.v. 229; 0 advance-width-verschillen over de 229 gedeelde,
 * dus geen layout-verschuiving; bestand werd zelfs 1.160 bytes kleiner). Daarmee kon de
 * span wég. Gemeten ná de fix, pijl t.o.v. haak: chromium +0,5px, firefox 0,0px,
 * webkit +0,5px — beter dan de opgetilde span (−0,5px) en ver beter dan de span
 * weghalen zónder de font-fix (+3,5px, zichtbaar doorzakkend).
 *
 * Waarom pixels en niet de DOM: zie `.claude/rules/meten-en-guards.md` §21. `textContent`
 * gaf hier keurig `[→]` terug terwijl er ` →]` op het scherm stond.
 *
 * MUTANTEN (elk faalt op een ANDERE assertie):
 *   M1  `renderer.js`: `.replace(/→/g, '<span class="marker-arrow">→</span>')` terugzetten
 *       -> "haak schildert" rood, ALLEEN op chromium (bewijst dat die tak motorspecifiek werkt)
 *   M2  `main.css`: U+2713 en U+2190-2193 weer inperken tot U+2191, U+2193
 *       -> "pijl op de haaklijn" rood op alle drie (fallback-glyph zakt terug)
 *   M3  markertekst hernoemen zodat de selector niets vindt
 *       -> "populatie" rood; die vuurt vóór de rest, zodat de diagnose leesbaar blijft
 */

import { test, expect } from './fixtures.js';

const CELBREEDTE = 10.8;   // JetBrains Mono @18px, gemeten Sessie 222
const DREMPEL = 70;        // inkt vs. achtergrond (achtergrond meet ~13)
const MAX_SCHEEF = 1.5;    // px speling tussen pijl- en haakmidden

async function bereidTerminalVoor(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('hacksim_legal_accepted', 'true');
      localStorage.setItem('hacksim_first_visit', 'false');
      localStorage.setItem('hacksim_analytics_consent',
        JSON.stringify({ necessary: true, analytics: false, advertising: false }));
    } catch (e) { /* private mode */ }
  });
  await page.goto('/terminal.html', { waitUntil: 'domcontentloaded' });
  const input = page.locator('#terminal-input');
  await expect(input).toBeVisible({ timeout: 20000 });
  await page.waitForTimeout(1500);
  // Bevries alles wat de layout beweegt (rules §18) — anders racet de screenshot.
  await page.addStyleTag({ content:
    '*,*::before,*::after{transition:none !important;animation:none !important;scroll-behavior:auto !important}' });
  await input.focus();
  // `help` is de trigger-conditie uit de nulmeting: vóór dit commando bestaat er
  // nog geen [→]-regel, dus zonder deze stap meet je een lege populatie.
  await input.fill('help');
  await input.press('Enter');
  await page.waitForTimeout(1600);
  return input;
}

/** Alle zichtbare regels die met een marker beginnen, met hun rect. */
function leesMarkerRegels(page) {
  return page.evaluate(() => {
    const uit = [];
    for (const el of document.querySelectorAll('.terminal-line')) {
      const tekst = el.textContent || '';
      const m = tekst.match(/^(\[(?:→|TIP|✓|!|\?)\])/);
      if (!m) continue;
      const bb = el.getBoundingClientRect();
      if (bb.y < 0 || bb.y + bb.height > 720) continue;
      uit.push({ marker: m[1], x: bb.x, y: bb.y, hoogte: bb.height, tekst: tekst.slice(0, 40) });
    }
    // De screenshot staat in DEVICE-pixels, getBoundingClientRect in CSS-pixels. Op
    // webkit (Desktop Safari) is dat een factor 2, en dan wijst elke cel-x naar de
    // verkeerde helft van het beeld — gemeten: alle vier de markers "zonder inkt",
    // óók [?] en [✓] die aantoonbaar renderen. Meesturen i.p.v. aannemen.
    return { dpr: window.devicePixelRatio || 1, regels: uit };
  });
}

/**
 * Verticale inktband van tekencel `n` op een regel, gemeten op de screenshot.
 * Geeft null terug als er in die cel geen enkele pixel boven DREMPEL uitkomt.
 */
function inktband(png, regel, n, dpr) {
  const x1 = Math.round((regel.x + n * CELBREEDTE) * dpr);
  const x2 = Math.round((regel.x + (n + 1) * CELBREEDTE) * dpr);
  const ys = [];
  for (let x = x1; x < x2; x++) {
    for (let y = Math.floor(regel.y * dpr) - 4; y < Math.ceil((regel.y + regel.hoogte) * dpr) + 4; y++) {
      if (x < 0 || y < 0 || x >= png.width || y >= png.height) continue;
      const i = (png.width * y + x) << 2;
      if (Math.max(png.data[i], png.data[i + 1], png.data[i + 2]) > DREMPEL) ys.push(y);
    }
  }
  if (!ys.length) return null;
  const min = Math.min(...ys), max = Math.max(...ys);
  // terug naar CSS-pixels, zodat de scheefstand-drempel motoronafhankelijk is
  return { min, max, midden: (min + max) / 2 / dpr };
}

test.describe('Markerhaken schilderen (Sessie 233)', () => {

  test('elke markerregel toont zijn openingshaak, en [→] staat op de haaklijn', async ({ page }) => {
    await bereidTerminalVoor(page);

    // Meet rects, screenshot, meet opnieuw: verschuift er iets, dan wijst mijn
    // inktmeting naar de verkeerde pixels en is de uitkomst waardeloos.
    const { dpr, regels: voor } = await leesMarkerRegels(page);
    const buffer = await page.screenshot({ type: 'png' });
    const { regels: na } = await leesMarkerRegels(page);
    expect(JSON.stringify(na), 'layout bewoog tussen rect-meting en screenshot').toBe(JSON.stringify(voor));

    // POPULATIE — faalt óók bij nul treffers. Exit 0 op een lege sweep is
    // ononderscheidbaar van een geslaagde meting (rules §20).
    expect(voor.length, 'geen enkele markerregel in beeld — selector of scenario stuk').toBeGreaterThan(0);
    const soorten = new Set(voor.map((r) => r.marker));
    expect(soorten.has('[→]'), `[→]-regel ontbreekt; wel gevonden: ${[...soorten].join(' ')}`).toBe(true);

    const { PNG } = await import('pngjs');
    const png = PNG.sync.read(buffer);

    // HAAK SCHILDERT — de eigenlijke #77-assertie, voor élke markersoort.
    const zonderInkt = [];
    for (const regel of voor) {
      if (!inktband(png, regel, 0, dpr)) zonderInkt.push(`${regel.marker} in "${regel.tekst}"`);
    }
    expect(zonderInkt, 'openingshaak schildert niet (zie #77)').toEqual([]);

    // PIJL OP DE HAAKLIJN — vangt een terugval naar het systeemfont, ook als de
    // haak zelf gewoon zou blijven schilderen (bv. in firefox/webkit).
    const scheef = [];
    for (const regel of voor.filter((r) => r.marker === '[→]')) {
      const haak = inktband(png, regel, 0, dpr);
      const pijl = inktband(png, regel, 1, dpr);
      expect(pijl, `geen pijl-inkt in "${regel.tekst}"`).not.toBeNull();
      const delta = Math.abs(pijl.midden - haak.midden);
      if (delta > MAX_SCHEEF) scheef.push(`${regel.tekst}: ${delta.toFixed(1)}px`);
    }
    expect(scheef, `pijl wijkt meer dan ${MAX_SCHEEF}px van de haaklijn af`).toEqual([]);
  });

  test('de subset levert de drie markerglyphs zelf, zonder correctie-span', async ({ page }) => {
    await bereidTerminalVoor(page);

    // Structurele tegenhanger: de span die #77 veroorzaakte mag niet terugkomen.
    // Zelfbewakend: eerst bewijzen dat er überhaupt pijlregels zijn.
    const telling = await page.evaluate(() => ({
      pijlRegels: [...document.querySelectorAll('.terminal-line')]
        .filter((el) => (el.textContent || '').includes('→')).length,
      markerArrowSpans: document.querySelectorAll('.marker-arrow').length,
    }));
    expect(telling.pijlRegels, 'geen enkele regel met een pijl — scenario stuk').toBeGreaterThan(0);
    expect(telling.markerArrowSpans,
      '.marker-arrow is terug; die span veroorzaakte #77 (lees de kop van deze spec)').toBe(0);
  });
});
