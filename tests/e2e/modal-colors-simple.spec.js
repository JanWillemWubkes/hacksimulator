/**
 * Simple Modal Color Test
 * Directly tests feedback modal header color
 */

const { test, expect } = require('@playwright/test');

test.describe('Modal Header Colors - Simple Test', () => {
  test('Feedback modal header should be white (#ffffff)', async ({ page, browser }) => {
    // Create a new context with no cache
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
    });

    const newPage = await context.newPage();

    // Navigate to page
    await newPage.goto('http://localhost:8123', { waitUntil: 'networkidle' });

    // Wait for page to load completely
    await newPage.waitForTimeout(2000);

    // Click feedback button directly
    await newPage.click('#feedback-button');

    // Wait for feedback modal to be visible
    await newPage.waitForSelector('#feedback-modal.active', { timeout: 3000 });

    // Get computed color of modal header
    const headerColor = await newPage.$eval('#feedback-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // Take screenshot
    await newPage.screenshot({
      path: 'tests/screenshots/feedback-modal-white-header.png',
      fullPage: false
    });

    console.log('✓ Feedback modal header color:', headerColor);

    // White is rgb(255, 255, 255)
    expect(headerColor).toBe('rgb(255, 255, 255)');

    // Also verify it's NOT neon green
    expect(headerColor).not.toBe('rgb(0, 255, 136)'); // #00ff88

    await context.close();
  });
});
