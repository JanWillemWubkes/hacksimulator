// Debug test to check console errors and persistence.save() calls
import { test, expect } from '@playwright/test';

test.describe('Debug - Console & Persistence', () => {

  test('Check console logs and errors', async ({ page }) => {
    const consoleMessages = [];
    const errors = [];

    // Capture console messages
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push({ type: msg.type(), text });
      console.log(`[Browser ${msg.type()}] ${text}`);
    });

    // Capture page errors
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log(`[Browser ERROR] ${error.message}`);
    });

    await page.goto('https://famous-frangollo-b5a758.netlify.app/');

    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeVisible({ timeout: 5000 });
    await page.click('#legal-accept-btn');
    await expect(legalModal).toBeHidden();

    await page.waitForTimeout(1000);

    console.log('\n🔍 Creating files and watching for [VFS] save logs...\n');

    const input = page.locator('#terminal-input');

    for (let i = 1; i <= 3; i++) {
      await input.fill(`touch file_${i}.txt`);
      await input.press('Enter');
      await page.waitForTimeout(200);
    }

    // Wait for any delayed save operations
    await page.waitForTimeout(1000);

    console.log('\n📊 Console Summary:');
    console.log(`  Total messages: ${consoleMessages.length}`);
    console.log(`  Errors: ${errors.length}`);

    // Check for VFS save messages
    const vfsSaveMessages = consoleMessages.filter(m => m.text.includes('[VFS]'));
    console.log(`  VFS-related logs: ${vfsSaveMessages.length}`);

    if (vfsSaveMessages.length > 0) {
      console.log('\n  VFS logs:');
      vfsSaveMessages.forEach(m => console.log(`    ${m.text}`));
    } else {
      console.log('\n  ⚠️  NO VFS save logs found!');
    }

    // Check for errors
    if (errors.length > 0) {
      console.log('\n  ❌ Page errors:');
      errors.forEach(e => console.log(`    ${e}`));
    }

    // Try to manually trigger save via console
    console.log('\n🔍 Attempting manual persistence check...');

    const manualCheck = await page.evaluate(() => {
      try {
        // Check if persistence module is accessible
        if (window.HackSimulator && window.HackSimulator.debug) {
          return {
            hasDebug: true,
            message: 'HackSimulator.debug exists'
          };
        }
        return {
          hasDebug: false,
          message: 'HackSimulator.debug not found'
        };
      } catch (e) {
        return {
          hasDebug: false,
          error: e.message
        };
      }
    });

    console.log(`  Manual check result: ${JSON.stringify(manualCheck, null, 2)}`);
  });

});
