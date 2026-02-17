// Blog Theme Toggle Test Suite - HackSimulator.nl
// Created: 2025-12-23
// Purpose: Test blog theme toggle CSP-compliant external module
// Tests: Theme toggle, persistence, main app sync, reading progress

import { test, expect } from './fixtures.js';

// Helper: Clear storage for fresh test
async function clearStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

// Blog pages have 2 theme toggles (navbar + mobile menu) — use .first() to avoid strict mode
function themeToggle(page) {
  return page.locator('.theme-toggle').first();
}

function toggleOption(page, theme) {
  return page.locator(`.toggle-option[data-theme="${theme}"]`).first();
}

test.describe('Blog Theme Toggle (CSP-Compliant)', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    // Navigate first (localStorage requires a page origin), then clear storage
    await page.goto('/blog/index.html');
    await clearStorage(page);
    await page.reload();
  });

  test('Blog theme toggle works and persists', async ({ page }) => {
    await page.goto('/blog/index.html');

    // Default should be dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(toggleOption(page, 'dark')).toHaveClass(/active/);

    // Toggle to light
    await themeToggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(toggleOption(page, 'light')).toHaveClass(/active/);
    await expect(toggleOption(page, 'dark')).not.toHaveClass(/active/);

    // Refresh - theme should persist
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(toggleOption(page, 'light')).toHaveClass(/active/);

    // Toggle back to dark
    await themeToggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(toggleOption(page, 'dark')).toHaveClass(/active/);
  });

  test('Blog theme syncs with main app', async ({ page }) => {
    // Set theme on main app (need to accept legal modal first)
    await page.goto('/terminal.html');

    const legalModal = page.locator('#legal-modal');
    if (await legalModal.isVisible()) {
      await page.click('#legal-accept-btn');
      await expect(legalModal).toBeHidden();
    }

    // Set light theme on main app
    await themeToggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Visit blog - should inherit light theme from localStorage
    await page.goto('/blog/index.html');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(toggleOption(page, 'light')).toHaveClass(/active/);

    // Set dark theme on blog
    await themeToggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Go back to main app - should inherit dark theme
    await page.goto('/terminal.html');
    await page.waitForTimeout(500);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('Reading progress bar works on article pages', async ({ page }) => {
    await page.goto('/blog/welkom.html');
    await page.waitForTimeout(500); // Wait for JS to initialize

    const progressBar = page.locator('.reading-progress');
    // Progress bar may be thin (2-3px) — check it exists in DOM rather than visibility
    await expect(progressBar).toBeAttached();

    // Initially at top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
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
    const finalWidth = await progressBar.evaluate(el => parseFloat(el.style.width));
    expect(finalWidth).toBeGreaterThan(90);
  });

  test('Theme toggle works on all blog pages', async ({ page }) => {
    const blogPages = [
      '/blog/index.html',
      '/blog/welkom.html',
      '/blog/wat-is-ethisch-hacken.html',
      '/blog/terminal-basics.html',
      '/blog/nmap-beginnersgids.html',
      '/blog/cybersecurity-tools.html',
      '/blog/ethisch-hacker-worden.html'
    ];

    for (const pagePath of blogPages) {
      await page.goto(pagePath);
      await clearStorage(page);
      await page.reload();

      // Default dark theme
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark', { timeout: 3000 });

      // Toggle to light
      await themeToggle(page).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

      // Verify UI updated
      await expect(toggleOption(page, 'light')).toHaveClass(/active/);
    }
  });

  test('No CSP errors in console', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/blog/index.html');
    await page.waitForTimeout(1000);

    const cspErrors = consoleErrors.filter(err =>
      (err.includes('Content Security Policy') ||
       err.includes('Refused to execute inline script')) &&
      // Exclude third-party AdSense/Google CSP errors (not our code)
      !err.includes('googlesyndication') &&
      !err.includes('gstatic.com') &&
      !err.includes('adtrafficquality') &&
      !err.includes('doubleclick')
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

    await page.goto('/blog/index.html');
    await page.waitForTimeout(1000);

    expect(networkErrors).toHaveLength(0);

    // Verify theme toggle works
    await themeToggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

});
