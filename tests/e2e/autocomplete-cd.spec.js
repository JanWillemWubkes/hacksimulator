import { test, expect } from '@playwright/test';

/**
 * E2E Smoke Test: Tab Autocomplete for cd Command
 * Tests basic directory autocomplete functionality
 *
 * Scope: Smoke test only - validates core autocomplete works
 * Not exhaustive - manual testing covers edge cases
 */

test.describe('Tab Autocomplete - cd Command', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:8000');

    // Wait for terminal to be ready
    await page.waitForSelector('#terminal-input');
  });

  test('should autocomplete absolute path /et to /etc/', async ({ page }) => {
    // Get terminal input
    const input = page.locator('#terminal-input');

    // Type partial path
    await input.fill('cd /et');

    // Press Tab to trigger autocomplete
    await page.keyboard.press('Tab');

    // Verify autocomplete worked
    await expect(input).toHaveValue('cd /etc/');
  });

  test('should autocomplete subdirectory /home/ha to /home/hacker/', async ({ page }) => {
    const input = page.locator('#terminal-input');

    await input.fill('cd /home/ha');
    await page.keyboard.press('Tab');

    await expect(input).toHaveValue('cd /home/hacker/');
  });

  test('should cycle through multiple matches when pressing Tab multiple times', async ({ page }) => {
    const input = page.locator('#terminal-input');

    // Type root path
    await input.fill('cd /');

    // First Tab - should show first directory (/etc)
    await page.keyboard.press('Tab');
    const firstValue = await input.inputValue();

    // Second Tab - should cycle to next directory (/home)
    await page.keyboard.press('Tab');
    const secondValue = await input.inputValue();

    // Verify cycling happened (values should be different)
    expect(firstValue).not.toBe('cd /');
    expect(secondValue).not.toBe(firstValue);
    expect(secondValue).toMatch(/^cd \//); // Should still start with "cd /"
  });

  test('should not autocomplete when no matches exist', async ({ page }) => {
    const input = page.locator('#terminal-input');

    // Type non-existent path
    await input.fill('cd /nonexistent');
    await page.keyboard.press('Tab');

    // Value should remain unchanged
    await expect(input).toHaveValue('cd /nonexistent');
  });

  test('should not suggest files (only directories) for cd command', async ({ page }) => {
    const input = page.locator('#terminal-input');

    // Type path that would match files (README.txt in /home/hacker)
    // But cd should only suggest directories
    await input.fill('cd ~/R');
    await page.keyboard.press('Tab');

    // Value should remain unchanged (no autocomplete to README.txt file)
    await expect(input).toHaveValue('cd ~/R');
  });
});
