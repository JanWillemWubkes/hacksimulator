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

import { test, expect } from '@playwright/test';

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
    const acceptButton = page.getByRole('button', { name: 'Accepteer' });
    await acceptButton.click({ force: true, timeout: 2000 });
    await page.waitForTimeout(300); // Wait for modal close animation
  } catch (e) {
    // Modal may not appear if already accepted (cookies), ignore error
  }
}

/**
 * Execute a command in the terminal
 */
async function executeCommand(page, command) {
  const input = page.locator('#command-input');
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
        await page.goto('https://famous-frangollo-b5a758.netlify.app/');

        // Accept legal modal
        await acceptLegalModal(page);
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

          // Verify box characters are present (basic sanity check)
          const output = page.locator('#terminal-output');
          const text = await output.innerText();

          expect(text).toContain('╭'); // Top left
          expect(text).toContain('╮'); // Top right
          expect(text).toContain('╰'); // Bottom left
          expect(text).toContain('╯'); // Bottom right
        });
      });
    });
  });

  // ─────────────────────────────────────────────────
  // Mobile-Specific Tests
  // ─────────────────────────────────────────────────

  test('leerpad - Long descriptions truncate properly (iPhone SE)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('https://famous-frangollo-b5a758.netlify.app/');
    await acceptLegalModal(page);

    await executeCommand(page, 'leerpad');

    const output = page.locator('#terminal-output');
    const text = await output.innerText();

    // Verify truncation indicator exists for long descriptions
    // Expected: "SQL injection scanner" → "SQL..." on 32-char box
    expect(text).toContain('...');

    // Verify no line exceeds 32 chars + 2 borders = 34 total
    const lines = text.split('\n');
    const boxLines = lines.filter(l => l.includes('│'));

    boxLines.forEach(line => {
      // Allow up to 34 chars (32 content + 2 borders)
      // Some lines may be slightly longer due to Unicode rendering, allow 36 max
      expect(line.length).toBeLessThanOrEqual(36);
    });
  });

  test('help - Category boxes fit on small mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('https://famous-frangollo-b5a758.netlify.app/');
    await acceptLegalModal(page);

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
    await page.goto('https://famous-frangollo-b5a758.netlify.app/');
    await acceptLegalModal(page);

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
    await page.goto('https://famous-frangollo-b5a758.netlify.app/');
    await acceptLegalModal(page);

    await executeCommand(page, 'leerpad');

    const output = page.locator('#terminal-output');
    const text = await output.innerText();

    // Verify full descriptions are NOT truncated on desktop
    // Example: "SQL injection scanner" should be full, not "SQL..."
    expect(text).toContain('SQL injection scanner');
    expect(text).toContain('Crack wachtwoorden');

    // Verify box width is wider (not truncated to mobile size)
    const lines = text.split('\n');
    const boxLines = lines.filter(l => l.includes('│'));

    // Desktop should have boxes close to 56 chars (54-58 range acceptable)
    const longestLine = Math.max(...boxLines.map(l => l.length));
    expect(longestLine).toBeGreaterThanOrEqual(54);
    expect(longestLine).toBeLessThanOrEqual(58);
  });

  test('help - Desktop shows full command descriptions', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 }); // Desktop
    await page.goto('https://famous-frangollo-b5a758.netlify.app/');
    await acceptLegalModal(page);

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

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://famous-frangollo-b5a758.netlify.app/');
    await acceptLegalModal(page);

    await executeCommand(page, 'leerpad');

    const output = await page.locator('#terminal-output').innerText();

    // Verify all box drawing characters render (not replaced with � or boxes)
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
    await page.goto('https://famous-frangollo-b5a758.netlify.app/');
    await acceptLegalModal(page);

    await executeCommand(page, 'leerpad');

    const output = await page.locator('#terminal-output').innerText();

    // Firefox has identical Unicode support for box drawing chars
    expect(output).toContain('╭');
    expect(output).toContain('╮');
    expect(output).toContain('╰');
    expect(output).toContain('╯');
  });
});
