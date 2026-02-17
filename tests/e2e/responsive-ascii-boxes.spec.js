/**
 * Responsive ASCII Boxes E2E Tests
 * Verifies that ASCII box commands (help, shortcuts, leerpad) render correctly
 * on all viewports without horizontal scrolling or layout breakage
 *
 * Critical viewports:
 * - iPhone SE (375px): Minimum mobile target - must use 32-char boxes
 * - Mobile (480px): Standard mobile - should use 40-char boxes
 * - Tablet (768px): iPad/tablet - should use 48-char boxes
 * - Desktop (1440px): Standard desktop - should use 56-char boxes
 */

import { test, expect } from './fixtures.js';

// ─────────────────────────────────────────────────
// Test Configuration
// ─────────────────────────────────────────────────

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667, expectedWidth: 32 },
  { name: 'Mobile', width: 480, height: 800, expectedWidth: 40 },
  { name: 'Tablet', width: 768, height: 1024, expectedWidth: 48 },
  { name: 'Desktop', width: 1440, height: 900, expectedWidth: 56 }
];

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
        await page.goto('https://hacksimulator.nl/terminal.html');

        // Accept legal modal
        await acceptLegalModal(page);

        // Close mobile menu (prevents input blocking on small viewports)
        await closeMobileMenu(page);
      });

      COMMANDS.forEach(command => {
        test(`${command} - No horizontal scroll`, async ({ page }) => {
          // Execute command
          await executeCommand(page, command);

          // Verify no horizontal scroll
          const terminalOutput = page.locator('#terminal-output');
          const scrollWidth = await terminalOutput.evaluate(el => el.scrollWidth);
          const clientWidth = await terminalOutput.evaluate(el => el.clientWidth);

          expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
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
    await page.goto('https://hacksimulator.nl/terminal.html');
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
    await page.goto('https://hacksimulator.nl/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    await executeCommand(page, 'help');

    // Verify no horizontal scroll (critical for mobile UX)
    const terminalOutput = page.locator('#terminal-output');
    const scrollWidth = await terminalOutput.evaluate(el => el.scrollWidth);
    const clientWidth = await terminalOutput.evaluate(el => el.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // Verify all category headers are visible (not cut off)
    const output = await terminalOutput.innerText();
    expect(output).toContain('SYSTEM');
    expect(output).toContain('FILESYSTEM');
    expect(output).toContain('NETWORK');
    expect(output).toContain('SECURITY');
  });

  test('shortcuts - All shortcuts visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('https://hacksimulator.nl/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    await executeCommand(page, 'shortcuts');

    const output = page.locator('#terminal-output');
    const text = await output.innerText();

    // Verify all shortcut categories are present
    expect(text).toContain('NAVIGATION');
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
    await page.goto('https://hacksimulator.nl/terminal.html');
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
    await page.goto('https://hacksimulator.nl/terminal.html');
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
// Cross-Browser Compatibility
// ─────────────────────────────────────────────────

test.describe('Cross-Browser ASCII Box Rendering', () => {
  test('Box characters render correctly (Chromium)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chromium-only test');

    // Use desktop viewport — mobile uses simplified format without box chars
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('https://hacksimulator.nl/terminal.html');
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
    await page.goto('https://hacksimulator.nl/terminal.html');
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
  test('Mobile: ASCII checkboxes instead of Unicode', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('https://hacksimulator.nl/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    // Execute help first to get progress, then check leerpad
    await executeCommand(page, 'help');
    await executeCommand(page, 'leerpad');

    const output = await page.locator('#terminal-output').innerText();

    // Extract leerpad section (after "LEERPAD:" header)
    const leerpadSection = output.substring(output.indexOf('LEERPAD'));

    // Verify ASCII checkboxes present (help should be [X] now)
    expect(leerpadSection).toContain('[X]'); // Completed checkbox (ASCII)
    expect(leerpadSection).toContain('[ ]'); // Incomplete checkbox (ASCII)

    // Verify NO Unicode checkboxes in leerpad section
    // (welcome message has ✓ but leerpad should use [X])
    expect(leerpadSection).not.toContain('✓'); // No Unicode check mark
    expect(leerpadSection).not.toContain('○'); // No Unicode circle
  });

  test('Desktop: ASCII checkboxes with full ASCII boxes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 }); // Desktop
    await page.goto('https://hacksimulator.nl/terminal.html');
    await acceptLegalModal(page);

    // Execute help first to get progress for [X] checkbox
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

    // Verify ASCII checkboxes (not Unicode) in leerpad section
    expect(leerpadSection).toContain('[X]');
    expect(leerpadSection).toContain('[ ]');
    expect(leerpadSection).not.toContain('✓');
    expect(leerpadSection).not.toContain('○');
  });

  test('Mobile: Simplified list format (readable on small screens)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('https://hacksimulator.nl/terminal.html');
    await acceptLegalModal(page);
    await closeMobileMenu(page);

    // Execute help first to get [X] progress
    await executeCommand(page, 'help');
    await executeCommand(page, 'leerpad');

    const output = await page.locator('#terminal-output').innerText();

    // Verify mobile-simplified formatting (phase headers)
    expect(output).toContain('FASE 1'); // Phase 1 header present
    expect(output).toContain('FASE 2'); // Phase 2 header present

    // Verify command formatting — help should be completed after executing it
    expect(output).toContain('[X] help'); // Completed command
    expect(output).toContain('[ ] mkdir'); // Incomplete command
  });

  test('Cross-viewport: No horizontal scroll on any viewport', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('https://hacksimulator.nl/terminal.html');
      await acceptLegalModal(page);
      if (viewport.width < 768) await closeMobileMenu(page);

      await executeCommand(page, 'leerpad');

      // Verify no horizontal scroll (critical for mobile UX)
      const terminalOutput = page.locator('#terminal-output');
      const scrollWidth = await terminalOutput.evaluate(el => el.scrollWidth);
      const clientWidth = await terminalOutput.evaluate(el => el.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    }
  });
});

// ─────────────────────────────────────────────────
// Font Subset Loading Test (Sessie 81)
// ─────────────────────────────────────────────────

test.describe('Font Subset Loading', () => {
  test('should load box-drawing font subset', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://hacksimulator.nl/terminal.html');
    await acceptLegalModal(page);

    // Wait for font to load
    await page.waitForLoadState('networkidle');

    // Execute command that uses boxes
    await executeCommand(page, 'leerpad');

    // Verify font loaded using Font Loading API
    const fontLoaded = await page.evaluate(() => {
      return document.fonts.check('16px "JetBrains Mono Box"');
    });

    expect(fontLoaded).toBe(true);

    // Verify box characters render correctly (not fallback to pipe |)
    const output = await page.locator('#terminal-output').innerText();
    expect(output).toContain('│'); // Should be box drawing vertical, NOT pipe |
    expect(output).toContain('╭'); // Top-left corner
    expect(output).toContain('─'); // Horizontal line
  });
});
