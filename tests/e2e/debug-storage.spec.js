// Debug test to investigate localStorage/VFS issues
// Created: 2025-12-18
// Purpose: Understand why VFS isn't saving to localStorage

import { test, expect } from './fixtures.js';

test.describe('Debug - localStorage & VFS', () => {

  test('Debug: Check localStorage after file creation', async ({ page }) => {
    // Go to site
    await page.goto('https://hacksimulator.nl/terminal.html');

    // Accept legal modal
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });
    await page.click('#legal-accept-btn');
    await expect(legalModal).toBeHidden();

    console.log('\n🔍 DEBUG: Legal modal dismissed');

    // Wait for terminal to be ready
    await page.waitForTimeout(1000);

    // Check if terminal input is visible and enabled
    const input = page.locator('#terminal-input');
    const isVisible = await input.isVisible();
    const isEnabled = await input.isEnabled();

    console.log(`🔍 DEBUG: Terminal input visible: ${isVisible}, enabled: ${isEnabled}`);

    // Try to create a single file
    console.log('🔍 DEBUG: Attempting to create file...');
    await input.fill('touch debug_test.txt');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Check terminal output
    const output = await page.locator('#terminal-output').textContent();
    console.log(`🔍 DEBUG: Terminal output:\n${output.slice(-200)}`);

    // Check what's in localStorage
    const storageDebug = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const data = {};

      for (const key of keys) {
        const value = localStorage.getItem(key);
        data[key] = {
          exists: true,
          size: value ? value.length : 0,
          preview: value ? value.slice(0, 100) + '...' : 'null'
        };
      }

      return { keys, data };
    });

    console.log('\n🔍 DEBUG: localStorage contents:');
    console.log(`  Keys found: ${storageDebug.keys.join(', ')}`);

    for (const [key, info] of Object.entries(storageDebug.data)) {
      console.log(`  ${key}: ${info.size} bytes`);
      console.log(`    Preview: ${info.preview}`);
    }

    // Specifically check hacksim_filesystem
    const vfsData = await page.evaluate(() => {
      return localStorage.getItem('hacksim_filesystem');
    });

    if (vfsData) {
      console.log(`\n✅ VFS data found: ${vfsData.length} bytes`);
      console.log(`   First 200 chars: ${vfsData.slice(0, 200)}`);
    } else {
      console.log('\n❌ VFS data NOT found in localStorage');
    }

    // Try creating more files
    console.log('\n🔍 DEBUG: Creating 5 more files...');
    for (let i = 1; i <= 5; i++) {
      await input.fill(`touch test_${i}.txt`);
      await input.press('Enter');
      await page.waitForTimeout(100);
    }

    // Check VFS size again
    const vfsDataAfter = await page.evaluate(() => {
      const data = localStorage.getItem('hacksim_filesystem');
      return data ? data.length : 0;
    });

    console.log(`🔍 DEBUG: VFS size after 5 more files: ${vfsDataAfter} bytes`);

    // List files to see if they exist in VFS
    await input.fill('ls');
    await input.press('Enter');
    await page.waitForTimeout(500);

    const finalOutput = await page.locator('#terminal-output').textContent();
    console.log(`🔍 DEBUG: Files in directory:\n${finalOutput.slice(-300)}`);
  });

  test('Debug: Check autosave setting', async ({ page }) => {
    await page.goto('https://hacksimulator.nl/terminal.html');

    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });
    await page.click('#legal-accept-btn');
    await expect(legalModal).toBeHidden();

    await page.waitForTimeout(1000);

    // Check if autosave is enabled in the persistence module
    const autosaveStatus = await page.evaluate(() => {
      // Try to access window globals to check persistence
      if (window.HackSimulator && window.HackSimulator.debug) {
        return 'HackSimulator debug available';
      }
      return 'HackSimulator not available';
    });

    console.log(`🔍 DEBUG: HackSimulator status: ${autosaveStatus}`);
  });

});
