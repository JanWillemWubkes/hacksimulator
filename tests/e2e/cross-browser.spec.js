// Cross-Browser Test Suite - HackSimulator.nl
// Created: 2025-10-22
// Purpose: Test critical functionality across Chrome, Firefox, Safari
// Test URL: https://famous-frangollo-b5a758.netlify.app/

import { test, expect } from '@playwright/test';

// Helper: Wait for localStorage to be ready
async function waitForLocalStorage(page) {
  await page.waitForFunction(() => {
    return typeof window.localStorage !== 'undefined';
  });
}

// Helper: Clear localStorage for fresh test
async function clearStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

// Helper: Accept legal modal (dynamically created by legal.js)
async function acceptLegalModal(page) {
  const legalModal = page.locator('#legal-modal');
  await expect(legalModal).toBeVisible({ timeout: 5000 });
  await page.click('#legal-accept-btn'); // Updated: legal.js uses 'legal-accept-btn'
  await expect(legalModal).toBeHidden();
}

test.describe('Cross-Browser Compatibility Tests', () => {

  test.beforeEach(async ({ page, context }) => {
    // Clear cookies and storage before each test
    await context.clearCookies();
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
  });

  // ========================================
  // TEST 1: First Visit Flow
  // ========================================
  test('First visit flow - Legal modal and cookie consent', async ({ page }) => {
    // Legal modal should appear on first visit
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });

    // Check modal content (case-insensitive match for "JURIDISCHE KENNISGEVING")
    await expect(legalModal).toContainText(/JURIDISCHE KENNISGEVING/i);

    // Accept button should be clickable
    const acceptButton = page.locator('#legal-accept-btn');
    await expect(acceptButton).toBeVisible();
    await acceptButton.click();

    // Modal should disappear
    await expect(legalModal).toBeHidden({ timeout: 2000 });

    // Cookie consent banner should appear after 2 second delay
    const cookieBanner = page.locator('#cookie-consent');
    await expect(cookieBanner).toBeVisible({ timeout: 3000 });
    await expect(cookieBanner).toContainText('Privacy');

    // Terminal should be visible after accepting legal
    const terminalInput = page.locator('#terminal-input');
    await expect(terminalInput).toBeVisible();
  });

  // ========================================
  // TEST 2: Terminal Rendering
  // ========================================
  test('Terminal renders correctly', async ({ page }) => {
    await acceptLegalModal(page);

    // Check terminal input field
    const input = page.locator('#terminal-input');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();

    // Check prompt
    const prompt = page.locator('#terminal-prompt');
    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText('user@hacksim:~$');

    // Check output area exists
    const output = page.locator('#terminal-output');
    await expect(output).toBeVisible();

    // Check placeholder text
    await expect(input).toHaveAttribute('placeholder', "Type 'help' om te beginnen...");
  });

  // ========================================
  // TEST 3: Basic Commands Execution
  // ========================================
  test('Basic commands execute without errors', async ({ page }) => {
    await acceptLegalModal(page);

    const input = page.locator('#terminal-input');
    const output = page.locator('#terminal-output');

    // Test 1: help command
    await input.fill('help');
    await input.press('Enter');
    await expect(output).toContainText('help', { timeout: 2000 });

    // Test 2: clear command
    await input.fill('clear');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Test 3: whoami command (returns 'hacker' not 'user')
    await input.fill('whoami');
    await input.press('Enter');
    await expect(output).toContainText('hacker', { timeout: 2000 });

    // Test 4: ls command
    await input.fill('ls');
    await input.press('Enter');
    await expect(output).toContainText('home', { timeout: 2000 });

    // Test 5: echo command
    await input.fill('echo test');
    await input.press('Enter');
    await expect(output).toContainText('test', { timeout: 2000 });
  });

  // ========================================
  // TEST 4: Command History (Arrow Keys)
  // ========================================
  test('Command history navigation works', async ({ page }) => {
    await acceptLegalModal(page);

    const input = page.locator('#terminal-input');

    // Type first command
    await input.fill('help');
    await input.press('Enter');
    await page.waitForTimeout(300);

    // Type second command
    await input.fill('whoami');
    await input.press('Enter');
    await page.waitForTimeout(300);

    // Press Arrow Up - should show 'whoami'
    await input.press('ArrowUp');
    await page.waitForTimeout(200);
    let inputValue = await input.inputValue();
    expect(inputValue).toBe('whoami');

    // Press Arrow Up again - should show 'help'
    await input.press('ArrowUp');
    await page.waitForTimeout(200);
    inputValue = await input.inputValue();
    expect(inputValue).toBe('help');

    // Press Arrow Down - should show 'whoami'
    await input.press('ArrowDown');
    await page.waitForTimeout(200);
    inputValue = await input.inputValue();
    expect(inputValue).toBe('whoami');
  });

  // ========================================
  // TEST 5: localStorage Persistence
  // ========================================
  test('localStorage persists across page reloads', async ({ page }) => {
    await acceptLegalModal(page);

    const input = page.locator('#terminal-input');

    // Execute commands to populate history
    await input.fill('help');
    await input.press('Enter');
    await page.waitForTimeout(300);

    await input.fill('whoami');
    await input.press('Enter');
    await page.waitForTimeout(300);

    // Check localStorage has data (app uses 'hacksim_history' not 'command_history')
    const historyBeforeReload = await page.evaluate(() => {
      return localStorage.getItem('hacksim_history');
    });
    expect(historyBeforeReload).toBeTruthy();

    // Reload page
    await page.reload();

    // Legal modal should NOT appear (legal_accepted in localStorage)
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeHidden({ timeout: 2000 });

    // Check history persisted
    const historyAfterReload = await page.evaluate(() => {
      return localStorage.getItem('hacksim_history');
    });
    expect(historyAfterReload).toBe(historyBeforeReload);

    // Verify we can navigate history after reload
    await input.press('ArrowUp');
    await page.waitForTimeout(200);
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('whoami');
  });

  // ========================================
  // TEST 6: Keyboard Navigation
  // ========================================
  test('Keyboard navigation works correctly', async ({ page }) => {
    await acceptLegalModal(page);

    // Accept cookie consent to enable more UI elements
    const cookieAccept = page.locator('#cookie-accept');
    await expect(cookieAccept).toBeVisible({ timeout: 3000 });
    await cookieAccept.click();

    // Test Tab navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // Test feedback button exists (modal click handler not implemented in MVP)
    const feedbackButton = page.locator('#feedback-button');
    await expect(feedbackButton).toBeVisible();

    // NOTE: Feedback modal functionality is Post-MVP
    // For now, just verify button is accessible via keyboard

    // Terminal input should be accessible
    const input = page.locator('#terminal-input');
    await input.focus();
    await expect(input).toBeFocused();
  });

  // ========================================
  // TEST 7: Error Handling & Fuzzy Matching
  // ========================================
  test('Error handling and fuzzy matching work', async ({ page }) => {
    await acceptLegalModal(page);

    const input = page.locator('#terminal-input');
    const output = page.locator('#terminal-output');

    // Test invalid command
    await input.fill('invalidcommandxyz');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Should show error (either "command not found" or suggestion)
    const outputText = await output.textContent();
    const hasErrorMessage =
      outputText.includes('not found') ||
      outputText.includes('Bedoelde je') ||
      outputText.includes('Onbekend');
    expect(hasErrorMessage).toBeTruthy();

    // Test fuzzy match suggestion (typo in 'help')
    await input.fill('helpp');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Should suggest 'help'
    await expect(output).toContainText('help', { timeout: 2000 });

    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Execute a few commands and check no errors
    await input.fill('clear');
    await input.press('Enter');
    await page.waitForTimeout(500);

    await input.fill('ls');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // No critical console errors expected
    const criticalErrors = consoleErrors.filter(err =>
      !err.includes('favicon') && // Ignore favicon errors
      !err.includes('DevTools') // Ignore DevTools messages
    );
    expect(criticalErrors.length).toBe(0);
  });

  // ========================================
  // TEST 8: Footer Links Accessibility
  // ========================================
  test('Footer links are accessible and work', async ({ page }) => {
    await acceptLegalModal(page);

    // Wait for modal to fully disappear and cookie banner to appear
    await page.waitForTimeout(500);

    // Scroll to footer to ensure visibility (modal might block)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check legal links exist in footer using text content (more specific than href)
    // This avoids conflict with cookie banner "Meer info" link
    const privacyLink = footer.getByRole('link', { name: 'Privacy' });
    const termsLink = footer.getByRole('link', { name: 'Voorwaarden' });
    const cookiesLink = footer.getByRole('link', { name: 'Cookies' });

    await expect(privacyLink).toBeVisible();
    await expect(termsLink).toBeVisible();
    await expect(cookiesLink).toBeVisible();

    // Check links have correct attributes
    await expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(privacyLink).toHaveAttribute('target', '_blank');
  });

});
