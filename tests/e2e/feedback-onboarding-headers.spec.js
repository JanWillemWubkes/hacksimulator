/**
 * Test Feedback & Onboarding Modal Headers
 * Simplified test to verify modal header colors
 */

const { test, expect } = require('@playwright/test');

test.describe('Feedback & Onboarding Modal Headers', () => {
  test('Feedback modal header should be white (via localStorage manipulation)', async ({ page }) => {
    // Go to page
    await page.goto('http://localhost:8124');

    // Set localStorage to bypass legal modal
    await page.evaluate(() => {
      localStorage.setItem('hacksim_legal_accepted', 'true');
      localStorage.setItem('hacksim_first_visit', 'false');
    });

    // Reload to apply localStorage
    await page.reload({ waitUntil: 'networkidle' });

    // Wait a bit for page to stabilize
    await page.waitForTimeout(1000);

    // Click feedback button
    await page.click('#feedback-button');

    // Wait for feedback modal
    await page.waitForSelector('#feedback-modal.active', { timeout: 3000 });

    // Get header color
    const headerColor = await page.$eval('#feedback-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/feedback-modal-white-header-verified.png',
      fullPage: false
    });

    console.log('✓ Feedback modal header color:', headerColor);

    // Should be white
    expect(headerColor).toBe('rgb(255, 255, 255)');
  });

  test('Onboarding modal header should be white', async ({ page }) => {
    // Go to page
    await page.goto('http://localhost:8124');

    // Clear localStorage to trigger onboarding
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Reload
    await page.reload({ waitUntil: 'networkidle' });

    // Accept legal modal first
    await page.waitForSelector('#legal-modal-backdrop', { timeout: 5000 });
    await page.click('#legal-accept-btn');

    // Wait for onboarding modal to appear
    await page.waitForSelector('#onboarding-modal.active', { timeout: 3000 });

    // Get header color
    const headerColor = await page.$eval('#onboarding-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/onboarding-modal-white-header-verified.png',
      fullPage: false
    });

    console.log('✓ Onboarding modal header color:', headerColor);

    // Should be white
    expect(headerColor).toBe('rgb(255, 255, 255)');
  });
});
