/**
 * Direct CSS Variable Test
 * Tests that CSS variables are correctly defined and applied
 */

import { test, expect } from './fixtures.js';

test.describe('CSS Variable Test - Modal Header Color', () => {
  test('CSS variable --color-modal-header should be defined and non-empty', async ({ page }) => {
    await page.goto('https://hacksimulator.nl/terminal.html', { waitUntil: 'networkidle' });

    // Get CSS variable value - should be defined regardless of theme
    const cssVarValue = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-modal-header').trim();
    });

    // Should be a valid color value (either #ffffff for dark or #0a0a0a for light)
    expect(cssVarValue).toBeTruthy();
    expect(['#ffffff', '#0a0a0a']).toContain(cssVarValue);
  });

  test('Legal modal header should use --color-modal-header value', async ({ page }) => {
    await page.goto('https://hacksimulator.nl/terminal.html', { waitUntil: 'networkidle' });

    // Wait for legal modal (dynamically created by legal.js)
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });

    // Get the expected color from the CSS variable
    const expectedColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-modal-header').trim();
    });

    // Get computed color of modal header
    const headerColor = await page.$eval('#legal-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // Header color should match the CSS variable (theme-aware)
    // #ffffff → rgb(255, 255, 255), #0a0a0a → rgb(10, 10, 10)
    if (expectedColor === '#ffffff') {
      expect(headerColor).toBe('rgb(255, 255, 255)');
    } else {
      expect(headerColor).toBe('rgb(10, 10, 10)');
    }
  });

  test('Feedback modal header should use --color-modal-header value', async ({ page }) => {
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

    // Get the expected color from the CSS variable
    const expectedColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-modal-header').trim();
    });

    // Get computed color
    const headerColor = await page.$eval('#feedback-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // Header color should match the CSS variable (theme-aware)
    if (expectedColor === '#ffffff') {
      expect(headerColor).toBe('rgb(255, 255, 255)');
    } else {
      expect(headerColor).toBe('rgb(10, 10, 10)');
    }
  });
});
