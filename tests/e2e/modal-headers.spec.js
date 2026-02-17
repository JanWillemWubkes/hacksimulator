/**
 * Modal Headers Visual Regression Test
 * Tests that modal headers use white color (#ffffff) instead of neon green
 */

import { test, expect } from './fixtures.js';

test.describe('Modal Headers Styling', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh visit flow
    await page.goto('https://hacksimulator.nl/terminal.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Legal modal header should be white', async ({ page }) => {
    // Legal modal should appear on fresh visit
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });

    // Get computed style of modal header
    const headerColor = await page.$eval('#legal-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // RGB value for white (#ffffff) is rgb(255, 255, 255)
    expect(headerColor).toBe('rgb(255, 255, 255)');
  });

  test('Feedback modal header should be white', async ({ page }) => {
    // Accept legal modal first
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });
    await page.click('#legal-accept-btn');
    await expect(legalModal).toBeHidden();

    // Accept onboarding if it appears
    try {
      const onboarding = page.locator('#onboarding-modal.active');
      await onboarding.waitFor({ timeout: 2000 });
      await page.click('#onboarding-accept');
      await page.waitForTimeout(500);
    } catch (e) {
      // Onboarding may not appear
    }

    // Open feedback modal via footer link
    await page.click('a[href="#feedback"]');
    await page.waitForSelector('#feedback-modal.active', { timeout: 2000 });

    // Get computed style of modal header
    const headerColor = await page.$eval('#feedback-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // RGB value for white (#ffffff) is rgb(255, 255, 255)
    expect(headerColor).toBe('rgb(255, 255, 255)');
  });

  test('Modal headers should NOT be neon green', async ({ page }) => {
    // Accept legal modal
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });

    // Get legal modal header color
    const legalHeaderColor = await page.$eval('#legal-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // Neon green (#00ff88) is rgb(0, 255, 136) — make sure it's NOT that
    expect(legalHeaderColor).not.toBe('rgb(0, 255, 136)');
  });
});
