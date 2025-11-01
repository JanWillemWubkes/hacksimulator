/**
 * Modal Headers Visual Regression Test
 * Tests that modal headers use white color (#ffffff) instead of neon green
 */

const { test, expect } = require('@playwright/test');

test.describe('Modal Headers Styling', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure onboarding modal shows
    await page.goto('http://localhost:8123');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Onboarding modal header should be white', async ({ page }) => {
    // Wait for onboarding modal to appear
    await page.waitForSelector('#onboarding-modal.active', { timeout: 5000 });

    // Get computed style of modal header
    const headerColor = await page.$eval('#onboarding-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // RGB value for white (#ffffff) is rgb(255, 255, 255)
    expect(headerColor).toBe('rgb(255, 255, 255)');

    // Take screenshot for visual verification
    await page.screenshot({ path: 'tests/screenshots/onboarding-modal-header.png' });

    console.log('✓ Onboarding modal header color:', headerColor);
  });

  test('Feedback modal header should be white', async ({ page }) => {
    // Accept onboarding first
    await page.waitForSelector('#onboarding-modal.active', { timeout: 5000 });
    await page.click('#onboarding-accept');

    // Open feedback modal
    await page.click('#feedback-button');
    await page.waitForSelector('#feedback-modal.active', { timeout: 2000 });

    // Get computed style of modal header
    const headerColor = await page.$eval('#feedback-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // RGB value for white (#ffffff) is rgb(255, 255, 255)
    expect(headerColor).toBe('rgb(255, 255, 255)');

    // Take screenshot for visual verification
    await page.screenshot({ path: 'tests/screenshots/feedback-modal-header.png' });

    console.log('✓ Feedback modal header color:', headerColor);
  });

  test('Modal headers should NOT be neon green', async ({ page }) => {
    // Wait for onboarding modal
    await page.waitForSelector('#onboarding-modal.active', { timeout: 5000 });

    // Get computed style of modal header
    const headerColor = await page.$eval('#onboarding-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // Neon green (#00ff88) is rgb(0, 255, 136)
    // Make sure header is NOT neon green
    expect(headerColor).not.toBe('rgb(0, 255, 136)');

    console.log('✓ Modal header is not neon green');
  });
});
