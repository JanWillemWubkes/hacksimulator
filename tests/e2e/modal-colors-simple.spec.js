/**
 * Simple Modal Color Test
 * Directly tests feedback modal header color
 */

import { test, expect } from './fixtures.js';

test.describe('Modal Header Colors - Simple Test', () => {
  test('Feedback modal header should be white (#ffffff)', async ({ page }) => {
    await page.goto('https://hacksimulator.nl/terminal.html', { waitUntil: 'networkidle' });

    // Set localStorage to bypass legal modal
    await page.evaluate(() => {
      localStorage.setItem('hacksim_legal_accepted', 'true');
      localStorage.setItem('hacksim_first_visit', 'false');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Click feedback link in footer
    await page.click('a[href="#feedback"]');

    // Wait for feedback modal to be visible
    await page.waitForSelector('#feedback-modal.active', { timeout: 3000 });

    // Get computed color of modal header
    const headerColor = await page.$eval('#feedback-modal h2', (el) => {
      return window.getComputedStyle(el).color;
    });

    // White is rgb(255, 255, 255)
    expect(headerColor).toBe('rgb(255, 255, 255)');

    // Also verify it's NOT neon green
    expect(headerColor).not.toBe('rgb(0, 255, 136)'); // #00ff88
  });
});
