/**
 * Direct CSS Variable Test
 * Tests that CSS variables are correctly defined and applied
 */

import { test, expect } from './fixtures.js';

test.describe('CSS Variable Test - Modal Header Color', () => {
  test('CSS variable --color-modal-header should be defined as white', async ({ page }) => {
    await page.goto('https://hacksimulator.nl/terminal.html', { waitUntil: 'networkidle' });

    // Get CSS variable value from :root
    const cssVarValue = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-modal-header').trim();
    });

    // Should be white (#ffffff)
    expect(cssVarValue).toBe('#ffffff');
  });

  test('Legal modal header should use white color', async ({ page }) => {
    await page.goto('https://hacksimulator.nl/terminal.html', { waitUntil: 'networkidle' });

    // Wait for legal modal (dynamically created by legal.js)
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });

    // Get computed color of modal header
    const headerColor = await page.$eval('#legal-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // White is rgb(255, 255, 255)
    expect(headerColor).toBe('rgb(255, 255, 255)');
  });

  test('Feedback modal header should use white color', async ({ page }) => {
    await page.goto('https://hacksimulator.nl/terminal.html', { waitUntil: 'networkidle' });

    // Accept legal modal first
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });
    await page.click('#legal-accept-btn');
    await expect(legalModal).toBeHidden();

    // Click feedback link in footer
    await page.click('a[href="#feedback"]');

    // Wait for feedback modal
    await page.waitForSelector('#feedback-modal.active', { timeout: 3000 });

    // Get computed color
    const headerColor = await page.$eval('#feedback-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // White is rgb(255, 255, 255)
    expect(headerColor).toBe('rgb(255, 255, 255)');
  });
});
