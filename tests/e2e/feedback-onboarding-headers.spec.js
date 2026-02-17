/**
 * Test Feedback & Onboarding Modal Headers
 * Simplified test to verify modal header colors
 */

import { test, expect } from './fixtures.js';

test.describe('Feedback & Onboarding Modal Headers', () => {
  test('Feedback modal header should be white (via localStorage manipulation)', async ({ page }) => {
    await page.goto('https://hacksimulator.nl/terminal.html');

    // Set localStorage to bypass legal modal
    await page.evaluate(() => {
      localStorage.setItem('hacksim_legal_accepted', 'true');
      localStorage.setItem('hacksim_first_visit', 'false');
    });

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Click feedback link in footer
    await page.click('a[href="#feedback"]');

    // Wait for feedback modal
    await page.waitForSelector('#feedback-modal.active', { timeout: 3000 });

    // Get header color
    const headerColor = await page.$eval('#feedback-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // Should be white
    expect(headerColor).toBe('rgb(255, 255, 255)');
  });

  test('Legal modal header should be white', async ({ page }) => {
    await page.goto('https://hacksimulator.nl/terminal.html');

    // Clear localStorage to trigger fresh visit flow
    await page.evaluate(() => {
      localStorage.clear();
    });

    await page.reload({ waitUntil: 'networkidle' });

    // Legal modal should appear (dynamically created by legal.js)
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });

    // Get header color
    const headerColor = await page.$eval('#legal-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // Should be white
    expect(headerColor).toBe('rgb(255, 255, 255)');
  });
});
