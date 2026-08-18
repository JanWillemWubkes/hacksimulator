import { test, expect } from './fixtures.js';

/**
 * E2E Smoke Test: Tab Autocomplete for Filesystem Commands
 * Tests autocomplete functionality across all filesystem commands
 *
 * Scope: Validates type filtering (directories vs files vs both)
 * Commands tested: cd, ls, cat, rm, mkdir, cp, mv
 */

test.describe('Tab Autocomplete - Filesystem Commands', () => {
  test.beforeEach(async ({ page }) => {
    // TASKS #64 (opgelost Sessie 227): deze spec was de enige terminal-spec ZONDER
    // legal-modal-afhandeling, en dat maakte hem flaky onder worker-load.
    //
    // Gemeten met --repeat-each=12 --workers=4 (36 runs, 4 rood). De discriminator is
    // de FOCUS op het moment van Tab, niet of de modal open staat:
    //
    //   actiefVoor=terminal-input   -> actiefNa=terminal-input   OK    (31x)
    //   actiefVoor=legal-accept-btn -> actiefNa=A                FAAL   (3x)
    //   actiefVoor=terminal-input   -> actiefNa=A                FAAL   (1x)
    //
    // `input.fill()` zet de waarde ook zonder focus, dus die stap slaagt altijd. Daarna
    // grijpt de legal-modal de focus (asynchroon, ná de eerste paint) en gaat Tab naar
    // zijn focus-trap in plaats van naar de terminal — de waarde blijft dan ongewijzigd.
    // Onder load valt dat moment vaak ná de fill; in isolatie ervóór, en daarom
    // reproduceerde Sessie 220 het daar 0/10.
    //
    // Consent vóór de navigatie zetten neemt de race wég in plaats van hem te overleven:
    // de modal verschijnt niet, dus er is geen focus-dief. Dat is ook zuiverder — deze
    // spec gaat over autocomplete, niet over de modal.
    await page.addInitScript(() => {
      try {
        localStorage.setItem('hacksim_legal_accepted', 'true');
      } catch (e) {
        /* private mode: dan valt de test terug op het oude, flaky gedrag */
      }
    });

    // Navigate to the application
    await page.goto('/terminal.html');

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

  // NEW TESTS - Phase 2: Other filesystem commands

  test('should autocomplete ls with both files AND directories', async ({ page }) => {
    const input = page.locator('#terminal-input');

    // ls should suggest files (unlike cd which only suggests directories)
    await input.fill('ls ~/R');
    await page.keyboard.press('Tab');

    // Should complete to README.txt (file)
    await expect(input).toHaveValue('ls ~/README.txt');
  });

  test('should autocomplete cat with files only (not directories)', async ({ page }) => {
    const input = page.locator('#terminal-input');

    // cat reads files, so should complete to passwd file
    await input.fill('cat /etc/pa');
    await page.keyboard.press('Tab');

    await expect(input).toHaveValue('cat /etc/passwd');
  });

  test('should autocomplete cat with notes.txt file', async ({ page }) => {
    const input = page.locator('#terminal-input');

    await input.fill('cat ~/no');
    await page.keyboard.press('Tab');

    await expect(input).toHaveValue('cat ~/notes.txt');
  });

  test('should autocomplete rm with both files and directories', async ({ page }) => {
    const input = page.locator('#terminal-input');

    // rm can remove files
    await input.fill('rm ~/R');
    await page.keyboard.press('Tab');

    await expect(input).toHaveValue('rm ~/README.txt');
  });

  test('should autocomplete mkdir with directory context', async ({ page }) => {
    const input = page.locator('#terminal-input');

    // mkdir creates dirs, so autocompletes parent directory context
    await input.fill('mkdir /home/ha');
    await page.keyboard.press('Tab');

    await expect(input).toHaveValue('mkdir /home/hacker/');
  });

  test('should autocomplete cp with both files and directories', async ({ page }) => {
    const input = page.locator('#terminal-input');

    // cp copies files
    await input.fill('cp ~/R');
    await page.keyboard.press('Tab');

    await expect(input).toHaveValue('cp ~/README.txt');
  });

  test('should autocomplete mv with both files and directories', async ({ page }) => {
    const input = page.locator('#terminal-input');

    // mv moves files
    await input.fill('mv ~/no');
    await page.keyboard.press('Tab');

    await expect(input).toHaveValue('mv ~/notes.txt');
  });
});
