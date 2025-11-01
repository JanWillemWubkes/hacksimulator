/**
 * Direct CSS Variable Test
 * Tests that CSS variables are correctly defined and applied
 */

const { test, expect } = require('@playwright/test');

test.describe('CSS Variable Test - Modal Header Color', () => {
  test('CSS variable --color-modal-header should be defined as white', async ({ page }) => {
    // Navigate to page (new port to avoid cache)
    await page.goto('http://localhost:8124', { waitUntil: 'networkidle' });

    // Get CSS variable value from :root
    const cssVarValue = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-modal-header').trim();
    });

    console.log('✓ CSS variable --color-modal-header:', cssVarValue);

    // Should be white (#ffffff)
    expect(cssVarValue).toBe('#ffffff');
  });

  test('Legal modal header should use white color', async ({ page }) => {
    // Navigate to page
    await page.goto('http://localhost:8124', { waitUntil: 'networkidle' });

    // Wait for legal modal to appear
    await page.waitForSelector('#legal-modal-backdrop', { timeout: 5000 });

    // Get computed color of modal header
    const headerColor = await page.$eval('#legal-modal-backdrop h2', (el) => {
      const color = window.getComputedStyle(el).color;
      console.log('Modal header color:', color);
      return color;
    });

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/legal-modal-white-header.png',
      fullPage: false
    });

    console.log('✓ Legal modal header color:', headerColor);

    // White is rgb(255, 255, 255)
    expect(headerColor).toBe('rgb(255, 255, 255)');
  });

  test('Feedback modal header should use white color', async ({ page }) => {
    // Navigate to page
    await page.goto('http://localhost:8124', { waitUntil: 'networkidle' });

    // Accept legal modal first
    await page.waitForSelector('#legal-modal-backdrop', { timeout: 5000 });
    await page.click('button:has-text("IK BEGRIJP HET - VERDER")');

    // Wait a bit for modal to close
    await page.waitForTimeout(1000);

    // Click feedback button
    await page.click('#feedback-button');

    // Wait for feedback modal
    await page.waitForSelector('#feedback-modal.active', { timeout: 3000 });

    // Get computed color
    const headerColor = await page.$eval('#feedback-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/feedback-modal-white-header.png',
      fullPage: false
    });

    console.log('✓ Feedback modal header color:', headerColor);

    // White is rgb(255, 255, 255)
    expect(headerColor).toBe('rgb(255, 255, 255)');
  });
});
