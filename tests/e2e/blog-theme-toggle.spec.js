// Blog Theme Toggle Test Suite - HackSimulator.nl
// Created: 2025-12-23
// Purpose: Test blog theme toggle CSP-compliant external module
// Tests: Theme toggle, persistence, main app sync, reading progress

import { test, expect } from '@playwright/test';

// Helper: Clear storage for fresh test
async function clearStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

test.describe('Blog Theme Toggle (CSP-Compliant)', () => {

  test.beforeEach(async ({ page, context }) => {
    // Clear cookies and storage before each test
    await context.clearCookies();
    await clearStorage(page);
  });

  test('Blog theme toggle works and persists', async ({ page }) => {
    // Visit blog index
    await page.goto('/blog/index.html');

    // Default should be dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('.toggle-option[data-theme="dark"]')).toHaveClass(/active/);

    // Toggle to light
    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('.toggle-option[data-theme="light"]')).toHaveClass(/active/);
    await expect(page.locator('.toggle-option[data-theme="dark"]')).not.toHaveClass(/active/);

    // Refresh - theme should persist
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('.toggle-option[data-theme="light"]')).toHaveClass(/active/);

    // Toggle back to dark
    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('.toggle-option[data-theme="dark"]')).toHaveClass(/active/);
  });

  test('Blog theme syncs with main app', async ({ page }) => {
    // Set theme on main app (need to accept legal modal first)
    await page.goto('/');

    // Accept legal modal
    const legalModal = page.locator('#legal-modal');
    if (await legalModal.isVisible()) {
      await page.click('#legal-accept-btn');
      await expect(legalModal).toBeHidden();
    }

    // Set light theme on main app
    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Visit blog - should inherit light theme from localStorage
    await page.goto('/blog/index.html');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('.toggle-option[data-theme="light"]')).toHaveClass(/active/);

    // Set dark theme on blog
    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Go back to main app - should inherit dark theme
    await page.goto('/');
    // Wait for legal modal if it appears (shouldn't since we accepted it)
    await page.waitForTimeout(500);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('Reading progress bar works on article pages', async ({ page }) => {
    // Visit an article page (welkom has reading progress bar)
    await page.goto('/blog/welkom.html');

    // Check if progress bar exists
    const progressBar = page.locator('.reading-progress');
    await expect(progressBar).toBeVisible();

    // Initially at top - progress bar should have minimal width
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200); // Wait for scroll event

    const initialWidth = await progressBar.evaluate(el => parseFloat(el.style.width) || 0);
    expect(initialWidth).toBeLessThan(10);

    // Scroll to middle
    await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      window.scrollTo(0, (scrollHeight - windowHeight) / 2);
    });
    await page.waitForTimeout(200);

    const midWidth = await progressBar.evaluate(el => parseFloat(el.style.width));
    expect(midWidth).toBeGreaterThan(30);
    expect(midWidth).toBeLessThan(70);

    // Scroll to bottom
    await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      window.scrollTo(0, scrollHeight - windowHeight);
    });
    await page.waitForTimeout(200);

    // Progress bar should be near 100%
    const finalWidth = await progressBar.evaluate(el => parseFloat(el.style.width));
    expect(finalWidth).toBeGreaterThan(90);
  });

  test('Theme toggle works on all blog pages', async ({ page }) => {
    const blogPages = [
      '/blog/index.html',
      '/blog/welkom.html',
      '/blog/wat-is-ethisch-hacken.html',
      '/blog/terminal-basics.html',
      '/blog/career-switch-gids.html',
      '/blog/beste-online-cursussen-ethical-hacking.html',
      '/blog/top-5-hacking-boeken.html'
    ];

    for (const pagePath of blogPages) {
      // Clear storage for fresh test
      await clearStorage(page);

      // Visit page
      await page.goto(pagePath);

      // Default dark theme
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

      // Toggle to light
      await page.click('.theme-toggle');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

      // Verify UI updated
      await expect(page.locator('.toggle-option[data-theme="light"]')).toHaveClass(/active/);
    }
  });

  test('No CSP errors in console', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Visit blog page
    await page.goto('/blog/index.html');

    // Wait for page to fully load
    await page.waitForTimeout(1000);

    // Check for CSP-related errors
    const cspErrors = consoleErrors.filter(err =>
      err.includes('Content Security Policy') ||
      err.includes('Refused to execute inline script')
    );

    expect(cspErrors).toHaveLength(0);
  });

  test('blog-theme.js loads successfully', async ({ page }) => {
    const networkErrors = [];

    page.on('response', response => {
      if (response.status() >= 400 && response.url().includes('blog-theme.js')) {
        networkErrors.push(`${response.status()} - ${response.url()}`);
      }
    });

    // Visit blog page
    await page.goto('/blog/index.html');

    // Wait for module to load
    await page.waitForTimeout(1000);

    // Should have no 404 or errors on blog-theme.js
    expect(networkErrors).toHaveLength(0);

    // Verify theme toggle works (means module loaded successfully)
    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

});
