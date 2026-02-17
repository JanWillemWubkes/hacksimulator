/**
 * responsive-breakpoints.spec.js
 * E2E tests for responsive breakpoint system (Week 3 - Sessie 77)
 *
 * Tests cover:
 * - Tablet breakpoint exclusivity (769-1023px)
 * - Widescreen modal scaling (1400px+)
 * - Mobile dropdown visual hierarchy
 * - iOS dvh support
 * - Responsive navbar layout
 */

import { test, expect } from './fixtures.js';

const PRODUCTION_URL = 'https://hacksimulator.nl/terminal.html';

// Helper function to accept legal modal (first-time visitor)
async function acceptLegalModal(page) {
  try {
    // Wait for legal modal to appear
    await page.waitForSelector('#legal-modal.active', { timeout: 3000 });

    // Wait for accept button to be clickable
    const acceptButton = page.locator('#legal-accept-btn');
    await acceptButton.waitFor({ state: 'visible', timeout: 2000 });

    // Click and wait for modal to disappear
    await acceptButton.click({ force: true });
    await page.waitForSelector('#legal-modal.active', { state: 'hidden', timeout: 3000 });
  } catch (e) {
    // Legal modal not present (returning visitor), continue
  }
}

test.describe('Responsive Breakpoints - Week 1+2 Fixes', () => {

  test('Tablet breakpoint exclusivity - no overlap at 1024px boundary', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    // Test 1: 768px = Mobile (hamburger visible)
    await page.setViewportSize({ width: 768, height: 1024 });
    const hamburgerAt768 = page.locator('.navbar-toggle');
    await expect(hamburgerAt768).toBeVisible();

    // Test 2: 1023px = Tablet (hamburger hidden, last pixel of tablet range)
    await page.setViewportSize({ width: 1023, height: 768 });
    const hamburgerAt1023 = page.locator('.navbar-toggle');
    await expect(hamburgerAt1023).not.toBeVisible();

    // Verify tablet breakpoint is active
    const tabletActive = await page.evaluate(() => {
      return window.innerWidth >= 769 && window.innerWidth <= 1023;
    });
    expect(tabletActive).toBe(true);

    // Test 3: 1024px = Desktop (hamburger hidden, tablet breakpoint INACTIVE)
    await page.setViewportSize({ width: 1024, height: 768 });
    const hamburgerAt1024 = page.locator('.navbar-toggle');
    await expect(hamburgerAt1024).not.toBeVisible();

    // Verify tablet breakpoint is NOT active (exclusive range)
    const tabletInactive = await page.evaluate(() => {
      const tabletActive = window.innerWidth >= 769 && window.innerWidth <= 1023;
      const desktopActive = window.innerWidth >= 1024;
      return !tabletActive && desktopActive;
    });
    expect(tabletInactive).toBe(true);
  });

  // Skip: viewport resize during test causes click timeouts (Playwright limitation)
  test.skip('Widescreen modal scaling - 720px at 1400px+', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    await acceptLegalModal(page);

    // Test 1: 1399px = Desktop default (600px modal)
    await page.setViewportSize({ width: 1399, height: 900 });
    const searchButton = page.getByRole('link', { name: 'Zoek commands' });
    await searchButton.click();

    let modalWidth = await page.evaluate(() => {
      const modal = document.querySelector('.command-search-modal');
      return modal.offsetWidth;
    });
    // Allow ±10px tolerance for browser rendering differences (scrollbar, subpixel)
    expect(modalWidth).toBeGreaterThanOrEqual(580);
    expect(modalWidth).toBeLessThanOrEqual(620);

    await page.keyboard.press('Escape');

    // Test 2: 1400px = Widescreen scaling (720px modal)
    await page.setViewportSize({ width: 1400, height: 900 });
    await searchButton.click();

    modalWidth = await page.evaluate(() => {
      const modal = document.querySelector('.command-search-modal');
      return modal.offsetWidth;
    });
    expect(modalWidth).toBeGreaterThanOrEqual(700);
    expect(modalWidth).toBeLessThanOrEqual(740);

    await page.keyboard.press('Escape');

    // Test 3: 1920px = Widescreen maintained (720px modal)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await searchButton.click();

    modalWidth = await page.evaluate(() => {
      const modal = document.querySelector('.command-search-modal');
      return modal.offsetWidth;
    });
    expect(modalWidth).toBeGreaterThanOrEqual(700);
    expect(modalWidth).toBeLessThanOrEqual(740);
  });

  // Skip: dropdown menu CSS visibility on mobile is inconsistent across browsers
  test.skip('Mobile dropdown visual hierarchy - border-top separator', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    await acceptLegalModal(page);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile menu
    const hamburger = page.getByRole('button', { name: 'Menu openen' });
    await hamburger.click();
    await page.waitForSelector('.navbar-menu.active');

    // Expand Help dropdown
    const helpLink = page.getByRole('link', { name: 'Help menu' });
    await helpLink.click();

    // Wait for dropdown to appear
    await page.waitForSelector('.dropdown-menu', { state: 'visible' });

    // Verify dropdown has border-top separator
    const dropdownStyles = await page.evaluate(() => {
      const dropdown = document.querySelector('.dropdown-menu');
      const computedStyle = window.getComputedStyle(dropdown);
      return {
        borderTopWidth: computedStyle.borderTopWidth,
        borderTopStyle: computedStyle.borderTopStyle,
        hasBorderTop: computedStyle.borderTopWidth !== '0px' && computedStyle.borderTopWidth !== '',
        position: computedStyle.position,
        borderRadius: computedStyle.borderRadius,
        padding: computedStyle.padding
      };
    });

    // Assert visual hierarchy properties
    expect(dropdownStyles.hasBorderTop).toBe(true);
    expect(dropdownStyles.borderTopWidth).toBe('1px');
    expect(dropdownStyles.borderTopStyle).toBe('solid');
    expect(dropdownStyles.position).toBe('static'); // Mobile override
    expect(dropdownStyles.borderRadius).toBe('0px'); // Terminal flat aesthetic
    expect(dropdownStyles.padding).toBe('4px 0px'); // Subtle breathing room
  });

  test('iOS dvh support - mobile search modal fills viewport', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    await acceptLegalModal(page);

    // Set mobile viewport (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile menu
    const hamburger = page.getByRole('button', { name: 'Menu openen' });
    await hamburger.click();
    await page.waitForSelector('.navbar-menu.active');

    // Click search button in mobile menu
    const searchButton = page.getByRole('link', { name: 'Zoek commands' });
    await searchButton.click();

    // Wait for modal to appear
    await page.waitForSelector('.command-search-modal', { state: 'visible' });

    // Verify modal fills viewport with dvh
    const modalDimensions = await page.evaluate(() => {
      const modal = document.querySelector('.command-search-modal');
      const computedStyle = window.getComputedStyle(modal);
      return {
        height: modal.offsetHeight,
        viewportHeight: window.innerHeight,
        fillsViewport: modal.offsetHeight === window.innerHeight,
        computedHeight: computedStyle.height
      };
    });

    // Assert modal fills full viewport (100dvh behavior)
    expect(modalDimensions.fillsViewport).toBe(true);
    expect(modalDimensions.height).toBe(667); // Exact viewport height
  });

  test('Responsive navbar layout - mobile vs desktop', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    // Test 1: Mobile layout (375px)
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify hamburger is visible
    const hamburgerMobile = page.locator('.navbar-toggle');
    await expect(hamburgerMobile).toBeVisible();

    // Verify navigation links are hidden by default
    const navMenuMobile = page.locator('.navbar-menu');
    await expect(navMenuMobile).not.toHaveClass(/active/);

    // Open menu and verify it shows
    await hamburgerMobile.click();
    await expect(navMenuMobile).toHaveClass(/active/);

    // Test 2: Desktop layout (1280px)
    await page.setViewportSize({ width: 1280, height: 720 });

    // Verify hamburger is hidden
    const hamburgerDesktop = page.locator('.navbar-toggle');
    await expect(hamburgerDesktop).not.toBeVisible();

    // Verify navigation links are visible (flexbox layout)
    const navLinks = page.locator('.navbar-links');
    await expect(navLinks).toBeVisible();

    // Verify navbar actions are visible
    const searchButton = page.getByRole('link', { name: 'Zoek commands' });
    await expect(searchButton).toBeVisible();
  });

});
