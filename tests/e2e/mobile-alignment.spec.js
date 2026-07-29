/**
 * Mobile Alignment Regression Tests
 *
 * Bewaakt de sitebrede invariant uit Sessie 82: op mobiel (<768px) rendert GEEN
 * command-output box-drawing-tekens (U+2500–257F). Box-drawing-glyphs hebben op
 * mobiel een andere advance-breedte dan de latin-tekst, waardoor randen niet
 * uitlijnen met de body en over de containerbreedte breken (de bug uit de
 * metasploit SECURITY WARNING-box). De fix rendert op mobiel borderless; deze
 * spec faalt zodra een command (of een toekomstige wijziging) die invariant breekt.
 *
 * Aanpak: geen typewriter/consent-omweg — we draaien het echte codepad direct via
 * de al-geïnitialiseerde singletons (registry + terminal.context + renderer), zoals
 * de verify-terminal-skill. Dekt execute([]) + man-page van elk geregistreerd command.
 */

import { test, expect } from './fixtures.js';

// Box Drawing block U+2500–257F (licht + heavy randen/hoeken/verticalen).
const BOX_DRAWING = /[─-╿]/;

test.describe('Mobile alignment — geen box-drawing in command-output (375px)', () => {
  test('execute([]) + man van elk command bevat geen box-drawing op mobiel', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/terminal.html');
    await page.waitForLoadState('networkidle');

    const result = await page.evaluate(async () => {
      const BOX = /[─-╿]/;
      const reg = (await import('/src/core/registry.js')).default;
      const term = (await import('/src/core/terminal.js')).default;

      const names = reg.list();
      const offenders = [];
      for (const name of names) {
        // Consent vóór elke iteratie wissen zodat security-tools hun waarschuwings-BOX
        // renderen (de boxText()-tak — precies het regressie-risico), niet de post-consent
        // tekst-output. Een security-command zet de flag zelf weer, dus per iteratie wissen.
        try { localStorage.removeItem('security_tools_consent'); } catch (e) { /* private mode */ }
        const out = await reg.execute(name, [], {}, term.context);
        if (typeof out === 'string' && BOX.test(out)) offenders.push(name);

        const handler = reg.get(name);
        if (handler && handler.manPage) {
          const man = await reg.execute('man', [name], {}, term.context);
          if (typeof man === 'string' && BOX.test(man)) offenders.push('man ' + name);
        }
      }
      return { count: names.length, offenders };
    });

    // Guard tegen vals-groen: als de registry (nog) leeg is, is 0 offenders betekenisloos.
    expect(result.count, 'registry niet geladen — spec zou vals-groen zijn').toBeGreaterThan(30);
    expect(
      result.offenders,
      `box-drawing lekt op mobiel in: ${result.offenders.join(', ')}`
    ).toEqual([]);
  });

  test('boxText() rendert borderless (geen box-drawing) op mobiel', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/terminal.html');
    await page.waitForLoadState('networkidle');

    const hasBox = await page.evaluate(async () => {
      const { boxText } = await import('/src/utils/asciiBox.js');
      const out = boxText('Regel een\nRegel twee', 'SECURITY WARNING');
      return /[─-╿]/.test(out);
    });
    expect(hasBox, 'boxText() mag op mobiel geen box-drawing produceren').toBe(false);
  });
});

test.describe('Mobile alignment — wrappende regels hangen (geen kolom-0 raggedness)', () => {
  test('marker- en licht-ingesprongen regels hangen bij wrap op mobiel', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/terminal.html');
    await page.waitForLoadState('networkidle');

    const result = await page.evaluate(async () => {
      const reg = (await import('/src/core/registry.js')).default;
      const term = (await import('/src/core/terminal.js')).default;
      const renderer = (await import('/src/ui/renderer.js')).default;
      const outEl = document.getElementById('terminal-output');
      renderer.init(outEl);

      // Alleen de hang-indent-KLASSE bewaken: marker-regels (evt. na leidende **) en
      // regels met 1-2 leidende spaties. Die horen bij wrap onder hun tekst te hangen
      // (padding-left > 0). Diep-ingesprongen desktop-tabellen in man-bodies (>=3 spaties,
      // bv. de man-next STAGES-tabel op kolom 34) vallen bewust buiten deze scope.
      const MARKER = /^( {0,2})(?:\*\*)?(\[[^\]]{1,4}\]|→)\s/;
      const shouldHang = (raw) => {
        if (MARKER.test(raw)) return true;
        const lead = raw.match(/^( *)/)[1].length;
        return lead >= 1 && lead <= 2 && raw.trim().length > 0;
      };

      const offenders = [];
      const names = reg.list();
      for (const name of names) {
        try { localStorage.removeItem('security_tools_consent'); } catch (e) { /* private mode */ }
        for (const [label, args] of [[name, []], ['man ' + name, ['man', name].slice(1)]]) {
          const isMan = label.startsWith('man ');
          const handler = reg.get(name);
          if (isMan && (!handler || !handler.manPage)) continue;
          const out = isMan
            ? await reg.execute('man', [name], {}, term.context)
            : await reg.execute(name, [], {}, term.context);
          if (typeof out !== 'string') continue;

          outEl.innerHTML = '';
          renderer.renderOutput(out, 'normal');
          const lineH = parseFloat(getComputedStyle(outEl).lineHeight) || 20;
          for (const el of outEl.querySelectorAll('.terminal-line')) {
            const raw = el.textContent || '';
            if (!shouldHang(raw)) continue;
            const wraps = el.offsetHeight > lineH * 1.4;
            if (!wraps) continue;
            const pl = parseFloat(getComputedStyle(el).paddingLeft) || 0;
            if (pl < 1) offenders.push(label + ': ' + JSON.stringify(raw.trim().slice(0, 40)));
          }
        }
      }
      return { count: names.length, offenders };
    });

    expect(result.count, 'registry niet geladen — spec zou vals-groen zijn').toBeGreaterThan(30);
    expect(
      result.offenders,
      `wrappende marker/ingesprongen regels zonder hang-indent:\n${result.offenders.join('\n')}`
    ).toEqual([]);
  });
});

test.describe('Desktop regressie — ASCII-box blijft intact (1280px)', () => {
  test('boxText() rendert nog steeds een box-drawing rand op desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/terminal.html');
    await page.waitForLoadState('networkidle');

    const info = await page.evaluate(async () => {
      const { boxText } = await import('/src/utils/asciiBox.js');
      const out = boxText('Regel een\nRegel twee', 'SECURITY WARNING');
      const rows = out.split('\n');
      const boxRows = rows.filter(r => /[─-╿]/.test(r));
      const uniqueLens = [...new Set(boxRows.map(r => r.length))];
      return { hasBox: boxRows.length > 0, uniqueLenCount: uniqueLens.length };
    });
    expect(info.hasBox, 'desktop moet de ASCII-box behouden').toBe(true);
    // Alle box-regels (rand + body) even lang → uitgelijnd kader.
    expect(info.uniqueLenCount, 'desktop box-regels moeten even lang zijn').toBe(1);
  });
});
