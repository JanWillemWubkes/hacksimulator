// E2E-guard: de gedeelde FAQ is met het toetsenbord te lezen (Sessie 244)
//
// De audit van sessie 244 vond vier fouten in één gedeeld component (`main.css` .faq-*,
// `src/ui/faq.js`), op elke pagina die het laadt:
//   1. `.faq-item { overflow: hidden }` knipte de focusring van de vraag weg: 0 veranderde
//      pixels bij focus op index en terminal (de ring staat 2px buiten de knop).
//   2. Een dicht antwoord was alleen `max-height: 0`: de links erin bleven Tab-stops, dus
//      de focus landde op iets onzichtbaars (index FAQ 1, 4, 8).
//   3. Open had een plafond van 300px: FAQ 1 van index verloor 22px tekst op 320px breed en
//      85px bij de tekstafstand van WCAG 1.4.12.
//   4. `faq.js` riep na elke klik `blur()`: na Enter stond de focus op <body>, en WebKit
//      begon de volgende Tab bovenaan de pagina.
//
// De populatie is de hele site (`PAGINAS`), niet een lijst van de drie pagina's die nu een
// FAQ hebben: een nieuwe FAQ-pagina valt er vanzelf onder.

import { test, expect } from './fixtures.js';
import { PAGINAS } from './helpers/paginas.js';

const BEVRIES = '*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}';
// WCAG 1.4.12: de gebruiker moet dit kunnen instellen zonder dat er inhoud wegvalt.
const TEKSTAFSTAND = '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}';

// Een 2px-ring rond een knop van ~200px breed verandert ruim 800 pixels; 100 is de ondergrens
// waaronder het geen zichtbare ring meer is maar ruis van anti-aliasing.
const MIN_RINGPIXELS = 100;

async function voorbereid(page) {
  await page.addInitScript(() => {
    localStorage.setItem('hacksim_analytics_consent', 'false');
    localStorage.setItem('hacksim_onboarding_seen', 'true');
    localStorage.setItem('hacksim_legal_accepted', 'true');
    localStorage.setItem('hacksim_legal_accepted_date', new Date().toISOString());
  });
}

/** Aantal pixels dat tussen twee screenshots merkbaar verschilt, geteld in de pagina. */
async function verschilPixels(page, a, b) {
  return page.evaluate(async ([a64, b64]) => {
    const lees = async (s) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + s;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, c.width, c.height).data;
    };
    const [A, B] = [await lees(a64), await lees(b64)];
    if (A.length !== B.length) return -1;
    let n = 0;
    for (let i = 0; i < A.length; i += 4) {
      if (Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) > 60) n++;
    }
    return n;
  }, [a.toString('base64'), b.toString('base64')]);
}

test.describe('De FAQ met het toetsenbord', () => {
  test.describe.configure({ timeout: 240_000 });

  test('op elke pagina met een FAQ: ring, focus, tabvolgorde en geen afgekapt antwoord', async ({ page }) => {
    await voorbereid(page);
    const metFaq = [];
    const fouten = [];
    let knoppen = 0;

    for (const pad of PAGINAS) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(pad, { waitUntil: 'load' });
      const n = await page.locator('.faq-question').count();
      if (n === 0) continue;
      metFaq.push(pad);
      knoppen += n;
      await page.addStyleTag({ content: BEVRIES });

      // 1. De ring is zichtbaar, in pixels, op elke vraag.
      for (let i = 0; i < n; i++) {
        const vraag = page.locator('.faq-question').nth(i);
        await vraag.scrollIntoViewIfNeeded();
        await page.keyboard.press('Shift'); // toetsenbordmodus, zodat :focus-visible geldt
        await vraag.focus();
        const doos = await vraag.boundingBox();
        const clip = {
          x: Math.max(0, doos.x - 8), y: Math.max(0, doos.y - 8),
          width: Math.min(doos.width + 16, 1440 - Math.max(0, doos.x - 8)), height: doos.height + 16,
        };
        const met = await page.screenshot({ clip });
        await page.evaluate(() => document.activeElement.blur());
        const zonder = await page.screenshot({ clip });
        const ring = await verschilPixels(page, met, zonder);
        if (ring < MIN_RINGPIXELS) fouten.push(`${pad} vraag ${i + 1}: focusring ${ring} px zichtbaar (min ${MIN_RINGPIXELS})`);
      }

      // 2. Na Enter houdt de vraag de focus, en hij opent en sluit.
      const eerste = page.locator('.faq-question').first();
      await eerste.focus();
      await page.keyboard.press('Enter');
      const naOpen = await page.evaluate(() => ({
        opKnop: document.activeElement === document.querySelector('.faq-question'),
        open: document.querySelector('.faq-question').getAttribute('aria-expanded'),
      }));
      if (!naOpen.opKnop) fouten.push(`${pad}: na Enter staat de focus niet meer op de vraag`);
      if (naOpen.open !== 'true') fouten.push(`${pad}: Enter opende de vraag niet (aria-expanded=${naOpen.open})`);
      await page.keyboard.press('Enter');

      // 3. Alles dicht: Tab van de eerste tot de laatste vraag raakt nooit iets in een dicht antwoord.
      await eerste.focus();
      for (let i = 0; i < n * 4 && i < 60; i++) {
        await page.keyboard.press('Tab');
        const waar = await page.evaluate(() => {
          const e = document.activeElement;
          const antwoord = e.closest('.faq-answer');
          return {
            inDicht: !!antwoord && !antwoord.closest('.faq-item').classList.contains('open'),
            tekst: (e.textContent || '').trim().slice(0, 40),
            laatste: e === [...document.querySelectorAll('.faq-question')].pop(),
          };
        });
        if (waar.inDicht) fouten.push(`${pad}: Tab landt op "${waar.tekst}" in een dicht antwoord`);
        if (waar.laatste) break;
      }

      // 4. Geen open antwoord wordt afgekapt: op 320px, en bij de tekstafstand van WCAG 1.4.12.
      for (const [naam, css] of [['320px', null], ['tekstafstand 375px', TEKSTAFSTAND]]) {
        await page.setViewportSize({ width: naam === '320px' ? 320 : 375, height: 800 });
        if (css) await page.addStyleTag({ content: css });
        const afgekapt = await page.evaluate(() =>
          [...document.querySelectorAll('.faq-item')].map((item, i) => {
            item.classList.add('open');
            const a = item.querySelector('.faq-answer');
            const tekort = a.scrollHeight - a.clientHeight;
            item.classList.remove('open');
            return tekort > 1 ? `vraag ${i + 1} mist ${tekort}px` : null;
          }).filter(Boolean));
        afgekapt.forEach((f) => fouten.push(`${pad} ${naam}: ${f}`));
      }
    }

    // Zelfbewaking: een lege populatie is altijd groen.
    expect(metFaq, 'index.html hoort een FAQ te hebben; zo niet, dan meet deze guard de verkeerde selector')
      .toContain('/index.html');
    expect(metFaq.length, `FAQ-pagina's gevonden: ${metFaq.join(', ')}`).toBeGreaterThanOrEqual(3);
    expect(knoppen, 'te weinig FAQ-vragen gemeten').toBeGreaterThanOrEqual(17);
    expect(fouten).toEqual([]);
  });
});
