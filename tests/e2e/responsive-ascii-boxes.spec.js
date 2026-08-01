/**
 * Responsive ASCII Boxes E2E Tests
 * Verifies that ASCII box commands (help, shortcuts, leerpad) render correctly
 * on all viewports without box borders wrapping or layout breakage.
 *
 * Box widths are pixel-measured at runtime (getResponsiveBoxWidth), not fixed
 * per breakpoint. The critical detector is measureBoxLineWraps(): #terminal-output
 * has overflow-x:hidden + pre-wrap, so an over-wide box line WRAPS (broken border)
 * but never scrolls — scrollWidth <= clientWidth can therefore never fail and is
 * useless as an assertion for this bug class.
 */

import { test, expect } from './fixtures.js';

// ─────────────────────────────────────────────────
// Test Configuration
// ─────────────────────────────────────────────────

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Mobile', width: 480, height: 800 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1440, height: 900 }
];

// Tussenliggende breedtes: niet-gemaximaliseerd venster / kleinere laptops.
// Historisch de blinde vlek waar box-randen wrapten (issue screenshots 31 jul).
const INTERMEDIATE_WIDTHS = [800, 900, 1024, 1100];

const COMMANDS = ['help', 'shortcuts', 'leerpad'];

// ─────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────

/**
 * Accept legal modal (required for first-time visitors)
 * Modal intercepts pointer events and blocks all interactions
 */
async function acceptLegalModal(page) {
  try {
    // Accept Legal modal first (blocks everything)
    const legalButton = page.getByRole('button', { name: /Ik begrijp het.*Verder/i });
    await legalButton.click({ force: true, timeout: 2000 });
    await page.waitForTimeout(500); // Wait for modal close animation

    // Then accept Cookie consent modal
    const cookieButton = page.getByRole('button', { name: /Accepteren/i });
    await cookieButton.click({ force: true, timeout: 2000 });
    await page.waitForTimeout(300); // Wait for cookie banner to disappear
  } catch (e) {
    // Modals may not appear if already accepted (cookies), ignore error
  }
}

/**
 * Close mobile menu if open (required for mobile viewports)
 * Mobile menu overlay blocks command input on small screens
 */
async function closeMobileMenu(page) {
  try {
    // Check if menu overlay is visible
    const menu = page.locator('#navbar-menu');
    const isMenuVisible = await menu.isVisible({ timeout: 500 });

    if (isMenuVisible) {
      // Click the navbar toggle button to close menu
      const toggleButton = page.locator('.navbar-toggle');
      await toggleButton.click({ force: true });
      await page.waitForTimeout(400); // Wait for menu close animation
    }
  } catch (e) {
    // Menu may not exist or already closed, ignore error
  }
}

/**
 * Execute a command in the terminal
 */
async function executeCommand(page, command) {
  const input = page.locator('#terminal-input');
  await input.fill(command);
  await input.press('Enter');
  await page.waitForTimeout(500); // Wait for command output rendering
}

/**
 * Meet per .terminal-line of box-regels visueel wrappen of buiten de output
 * steken. Alleen regels met box-drawing-glyphs (U+2500-257F) worden beoordeeld:
 * die mogen nooit wrappen; gewone prozaregels mogen dat wel (pre-wrap).
 *
 * Detector: element-hoogte > 1.5× line-height = gewrapt (een echte wrap
 * verdubbelt de hoogte). NB: rect-top-vergelijking of rects.length zijn GEEN
 * betrouwbare indicatoren — inline spans (marker-arrow heeft vertical-align:
 * 3.6px) verschuiven rects op dezelfde visuele regel (gemeten vals-positief).
 */
async function measureBoxLineWraps(page) {
  return page.evaluate(() => {
    const BOX_RE = /[─-╿]/;
    const output = document.getElementById('terminal-output');
    const outRect = output.getBoundingClientRect();
    const clientWidth = output.clientWidth;
    const wrapped = [];
    let boxLineCount = 0;
    for (const el of output.querySelectorAll('.terminal-line')) {
      const text = el.textContent || '';
      if (!BOX_RE.test(text)) continue;
      boxLineCount++;
      const elRect = el.getBoundingClientRect();
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 27;
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = Array.from(range.getClientRects()).filter(r => r.width > 0);
      const maxRight = rects.length ? Math.max(...rects.map(r => r.right)) : 0;
      if (elRect.height > lineHeight * 1.5 || maxRight - outRect.left > clientWidth + 1) {
        wrapped.push(text.slice(0, 60));
      }
    }
    return { boxLineCount, wrapped };
  });
}

// ─────────────────────────────────────────────────
// Test Suites
// ─────────────────────────────────────────────────

test.describe('Responsive ASCII Box Layout', () => {
  VIEWPORTS.forEach(viewport => {
    test.describe(`${viewport.name} (${viewport.width}px)`, () => {
      test.beforeEach(async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Navigate to production site
        await page.goto('/terminal.html');

        // Accept legal modal
        await acceptLegalModal(page);

        // Close mobile menu (prevents input blocking on small viewports)
        await closeMobileMenu(page);
      });

      COMMANDS.forEach(command => {
        test(`${command} - Box-regels wrappen niet`, async ({ page }) => {
          // Execute command
          await executeCommand(page, command);

          // Geen enkele box-regel mag visueel wrappen of buiten de output steken
          const { wrapped } = await measureBoxLineWraps(page);
          expect(wrapped).toEqual([]);
        });

        test(`${command} - Box alignment verification`, async ({ page }) => {
          // Execute command
          await executeCommand(page, command);

          // Take screenshot for visual regression
          await page.screenshot({
            path: `test-results/${command}-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
            fullPage: false
          });

          // Verify output rendered
          const output = page.locator('#terminal-output');
          const text = await output.innerText();

          // Desktop uses box characters; mobile uses simplified format
          if (viewport.width >= 1024) {
            expect(text).toContain('╭'); // Top left
            expect(text).toContain('╮'); // Top right
            expect(text).toContain('╰'); // Bottom left
            expect(text).toContain('╯'); // Bottom right
          } else {
            // Mobile/tablet: verify command output rendered (simplified format)
            expect(text.length).toBeGreaterThan(50);
          }
        });
      });
    });
  });

  // ─────────────────────────────────────────────────
  // Mobile-Specific Tests
  // ─────────────────────────────────────────────────

  test('leerpad - Long descriptions truncate properly (iPhone SE)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    await executeCommand(page, 'leerpad');

    const output = page.locator('#terminal-output');
    const text = await output.innerText();

    // Mobile may use simplified format (no box chars) or box format
    // Either way, verify content rendered and no excessive line length
    expect(text.length).toBeGreaterThan(50);

    // Verify no line is unreasonably long (prevents horizontal scroll)
    const lines = text.split('\n');
    lines.forEach(line => {
      expect(line.length).toBeLessThanOrEqual(80);
    });
  });

  test('help - Category boxes fit on small mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    await executeCommand(page, 'help');

    // Geen box-regel mag wrappen (critical for mobile UX)
    const { wrapped } = await measureBoxLineWraps(page);
    expect(wrapped).toEqual([]);

    // Verify visible category headers (progressive help shows starter categories for new users)
    const terminalOutput = page.locator('#terminal-output');
    const output = await terminalOutput.innerText();
    expect(output).toContain('SYSTEM');
    expect(output).toContain('FILESYSTEM');
    expect(output).toContain('SPECIAL');
    // NETWORK and SECURITY are hidden for new users (progressive disclosure)
    // They become visible after completing earlier phases
    expect(output).toContain('Meer commands');
  });

  test('shortcuts - All shortcuts visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    await executeCommand(page, 'shortcuts');

    const output = page.locator('#terminal-output');
    const text = await output.innerText();

    // Verify all shortcut categories are present
    expect(text).toContain('NAVIGATIE');
    expect(text).toContain('ZOEKEN');
    expect(text).toContain('TERMINAL');

    // Verify key shortcuts are visible
    expect(text).toContain('↑ / ↓');
    expect(text).toContain('Tab');
    expect(text).toContain('Ctrl+R');
    expect(text).toContain('Ctrl+L');
  });

  // ─────────────────────────────────────────────────
  // Desktop Regression Tests
  // ─────────────────────────────────────────────────

  test('leerpad - Desktop experience unchanged (56 chars)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 }); // Desktop
    await page.goto('/terminal.html');
    await acceptLegalModal(page);

    await executeCommand(page, 'leerpad');

    const output = page.locator('#terminal-output');
    const text = await output.innerText();

    // Verify full descriptions are NOT truncated on desktop
    expect(text).toContain('Commands ontdekken'); // FASE 1: help
    expect(text).toContain('Bestanden bekijken'); // FASE 1: ls
    expect(text).toContain('Directory aanmaken'); // FASE 2: mkdir
    expect(text).toContain('Scan netwerk poorten'); // FASE 3: nmap

    // Verify box characters present on desktop
    expect(text).toContain('╭');
    expect(text).toContain('│');
    expect(text).toContain('╯');
  });

  test('help - Desktop shows full command descriptions', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 }); // Desktop
    await page.goto('/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    await executeCommand(page, 'help');

    const output = page.locator('#terminal-output');
    const text = await output.innerText();

    // Verify no "..." truncation indicators (desktop has full space)
    const boxContent = text.split('TIP:')[0]; // Exclude TIP box at bottom
    const truncationCount = (boxContent.match(/\.\.\./g) || []).length;

    // Allow minimal truncation (0-2 instances) for very long descriptions
    expect(truncationCount).toBeLessThanOrEqual(2);
  });
});

// ─────────────────────────────────────────────────
// Tussenliggende breedtes (niet-gemaximaliseerd venster)
// ─────────────────────────────────────────────────

test.describe('Tussenliggende breedtes - box-randen wrappen niet', () => {
  for (const width of INTERMEDIATE_WIDTHS) {
    test(`boxen passen @ ${width}px (met zichtbare scrollbar)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.goto('/terminal.html');
      await acceptLegalModal(page);
      await closeMobileMenu(page);

      // Vul de terminal zodat de verticale scrollbar er staat vóór de te
      // meten boxen renderen (scrollbar-gutter:stable houdt clientWidth
      // gelijk, maar zo dekt de test het echte worst-case-scenario).
      await executeCommand(page, 'help');
      await executeCommand(page, 'shortcuts');

      // Boxen renderen ná de vulling zodat de scrollbar er al staat. (Bestaande
      // output wordt sinds Sessie 205 bovendien shrink-only ge-reflowd bij een
      // live resize — zie de 'Live resize reflow'-describe hieronder.)
      await executeCommand(page, 'next');      // handgerolde box + ←-glosses
      await executeCommand(page, 'man nmap');  // boxHeader met heavy glyphs (━)
      await executeCommand(page, 'help');      // lightBox (─)

      const { boxLineCount, wrapped } = await measureBoxLineWraps(page);
      expect(boxLineCount).toBeGreaterThan(0); // detector mag niet vacuüm slagen
      expect(wrapped).toEqual([]);
    });
  }
});

// ─────────────────────────────────────────────────
// Live resize reflow (Sessie 205)
// ─────────────────────────────────────────────────

test.describe('Live resize reflow', () => {
  test('bestaande boxen reflowen mee bij venster-versmalling', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (e) => pageErrors.push(String(e)));
    page.on('console', (msg) => {
      if (msg.type() === 'error') pageErrors.push(msg.text());
    });

    await page.setViewportSize({ width: 1240, height: 900 });
    await page.goto('/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    // Render de drie box-varianten op volle breedte (~106 chars @ 1240)
    await executeCommand(page, 'metasploit'); // heavy SECURITY WARNING (┏━┓)
    await executeCommand(page, 'next');       // handgerolde box + dividers (╭├┤╯)
    await executeCommand(page, 'man nmap');   // boxHeader (top+bottom, 0 content)
    await executeCommand(page, 'help');       // lightBox + categorie-tabellen

    // Expliciet onderaan beginnen (de auto-scroll doet dit al, maar de
    // pin-assertie hieronder moet niet van timing afhangen).
    await page.evaluate(() => {
      const o = document.getElementById('terminal-output');
      o.scrollTo({ top: o.scrollHeight, behavior: 'instant' });
    });
    await page.waitForTimeout(300);

    // Het Heisenberg-scenario: venster live versmallen — óók onder de
    // 768px-grens (640): een half-gesnapt desktopvenster valt daar onder,
    // dus reflow mag daar niet op een mobiel-guard stranden.
    for (const width of [900, 700, 640]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(700); // reflow-debounce (250ms) + marge

      const { boxLineCount, wrapped } = await measureBoxLineWraps(page);
      expect(boxLineCount, `boxLineCount @ ${width}px`).toBeGreaterThan(0);
      expect(wrapped, `gewrapte boxregels @ ${width}px`).toEqual([]);

      // De gebruiker stond onderaan en moet daar blijven: de reflow maakt de
      // content hoger, dus zonder re-pin springt zijn kijkpositie weg. Bewaakt
      // tevens de aanname dat scroll-events tijdens een resize genegeerd worden
      // (browser-eigen correcties) — volgorde scroll/resize verschilt per engine.
      const gepind = await page.evaluate(() => {
        const o = document.getElementById('terminal-output');
        return o.scrollTop + o.clientHeight >= o.scrollHeight - 40;
      });
      expect(gepind, `scroll blijft onderaan gepind @ ${width}px`).toBe(true);
    }

    // Groei-pad: terug naar breed — geen errors; oude boxen blijven smal
    // maar intact (shrink-only), een vers command rendert wél op volle breedte.
    await page.setViewportSize({ width: 1240, height: 900 });
    await page.waitForTimeout(700);
    const afterGrow = await measureBoxLineWraps(page);
    expect(afterGrow.wrapped).toEqual([]);

    await executeCommand(page, 'help');
    const fresh = await measureBoxLineWraps(page);
    expect(fresh.wrapped).toEqual([]);

    expect(pageErrors, 'geen page/console-errors tijdens reflow').toEqual([]);
  });
});

// ─────────────────────────────────────────────────
// Cross-Browser Compatibility
// ─────────────────────────────────────────────────

test.describe('Cross-Browser ASCII Box Rendering', () => {
  test('Box characters render correctly (Chromium)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chromium-only test');

    // Use desktop viewport — mobile uses simplified format without box chars
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/terminal.html');
    await acceptLegalModal(page);

    await executeCommand(page, 'leerpad');

    const output = await page.locator('#terminal-output').innerText();

    // Verify all box drawing characters render (not replaced with ? or boxes)
    expect(output).toContain('╭');
    expect(output).toContain('╮');
    expect(output).toContain('╰');
    expect(output).toContain('╯');
    expect(output).toContain('─');
    expect(output).toContain('│');
  });

  test('Box characters render correctly (Firefox)', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-only test');

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    await executeCommand(page, 'leerpad');

    const output = await page.locator('#terminal-output').innerText();

    // Firefox has identical Unicode support for box drawing chars
    expect(output).toContain('╭');
    expect(output).toContain('╮');
    expect(output).toContain('╰');
    expect(output).toContain('╯');
  });
});

// ─────────────────────────────────────────────────
// Hybrid Mobile/Desktop UI Tests (Sessie 82)
// ─────────────────────────────────────────────────

test.describe('Mobile/Desktop Hybrid UI (ASCII Checkbox Fix)', () => {
  test('Mobile: completed = [✓] (green), incomplete = [ ] (white)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    // Execute help first to get progress, then check leerpad
    await executeCommand(page, 'help');
    await executeCommand(page, 'leerpad');

    const output = await page.locator('#terminal-output').innerText();

    // Extract leerpad section (after "LEERPAD:" header)
    const leerpadSection = output.substring(output.indexOf('LEERPAD'));

    // Mobile uses [✓] for completed (renderer maps to success/green) and [ ] for incomplete.
    // The old [X] marker collided with the error marker (renderer.js) → showed red. See Sessie 82
    // for the original ASCII-only decision; the green check mark is the deliberate replacement.
    expect(leerpadSection).toContain('[✓]'); // Completed checkbox (help should be done now)
    expect(leerpadSection).toContain('[ ]'); // Incomplete checkbox
    expect(leerpadSection).not.toContain('[X]'); // No error-colliding marker
    expect(leerpadSection).not.toContain('○'); // No Unicode circle
  });

  test('Desktop: ASCII checkboxes with full ASCII boxes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 }); // Desktop
    await page.goto('/terminal.html');
    await acceptLegalModal(page);

    // Execute help first to get progress for [✓] checkbox
    await executeCommand(page, 'help');
    await executeCommand(page, 'leerpad');

    const output = await page.locator('#terminal-output').innerText();

    // Find leerpad section start (line with ╭ before LEERPAD)
    const leerpadIdx = output.indexOf('LEERPAD');
    const sectionStart = output.lastIndexOf('╭', leerpadIdx);
    const leerpadSection = output.substring(sectionStart >= 0 ? sectionStart : leerpadIdx);

    // Verify box drawing characters present (desktop preserves terminal aesthetic)
    expect(leerpadSection).toContain('╭');
    expect(leerpadSection).toContain('│');
    expect(leerpadSection).toContain('─');
    expect(leerpadSection).toContain('╯');

    // Completed checkbox uses [✓] (consistent with mobile + man-page); inside the box it
    // renders white (shielded), so no red. The old [X] collided with the renderer error marker.
    expect(leerpadSection).toContain('[✓]');
    expect(leerpadSection).toContain('[ ]');
    expect(leerpadSection).not.toContain('[X]'); // No error-colliding marker
    expect(leerpadSection).not.toContain('○');   // No Unicode circle
  });

  test('Mobile: Simplified list format (readable on small screens)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    // Execute help first to get [✓] progress
    await executeCommand(page, 'help');
    await executeCommand(page, 'leerpad');

    const output = await page.locator('#terminal-output').innerText();

    // Verify mobile-simplified formatting (phase headers)
    expect(output).toContain('FASE 1'); // Phase 1 header present
    expect(output).toContain('FASE 2'); // Phase 2 header present

    // Verify command formatting — help should be completed after executing it
    expect(output).toContain('[✓] help'); // Completed command (green)
    expect(output).toContain('[ ] mkdir'); // Incomplete command (white)
  });

  test('Cross-viewport: No horizontal scroll on any viewport', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/terminal.html');
      await acceptLegalModal(page);
      if (viewport.width < 768) await closeMobileMenu(page);

      await executeCommand(page, 'leerpad');

      // Geen box-regel mag wrappen (critical for mobile UX)
      const { wrapped } = await measureBoxLineWraps(page);
      expect(wrapped).toEqual([]);
    }
  });
});

// ─────────────────────────────────────────────────
// Font Subset Loading Test (Sessie 81)
// ─────────────────────────────────────────────────

test.describe('Font Subset Loading', () => {
  test('should load box-drawing font subset', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/terminal.html');
    await acceptLegalModal(page);

    // Wait for font to load
    await page.waitForLoadState('networkidle');

    // Execute command that uses boxes
    await executeCommand(page, 'leerpad');

    // Verify font loaded using Font Loading API.
    // NB: fonts.check() geeft true óók als de FontFace status 'error' heeft
    // (gemeten — zo bleef de corrupte inline embed 120 sessies onzichtbaar);
    // fonts.load() + status-check faalt wél echt bij een kapotte font.
    const fontStatus = await page.evaluate(async () => {
      try {
        const faces = await document.fonts.load('16px "JetBrains Mono Box"', '─');
        return { count: faces.length, statuses: faces.map(f => f.status) };
      } catch (e) {
        return { count: 0, statuses: ['load-rejected: ' + e.message] };
      }
    });

    expect(fontStatus.count).toBeGreaterThan(0);
    expect(fontStatus.statuses).toEqual(['loaded']);

    // Verify box characters render correctly (not fallback to pipe |)
    const output = await page.locator('#terminal-output').innerText();
    expect(output).toContain('│'); // Should be box drawing vertical, NOT pipe |
    expect(output).toContain('╭'); // Top-left corner
    expect(output).toContain('─'); // Horizontal line
  });
});
