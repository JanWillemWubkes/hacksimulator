// Tutorial System E2E Tests - HackSimulator.nl
// Created: 2026-02-21
// Purpose: Test M6 tutorial system: scenarios, hints, persistence, completion

import { test, expect } from './fixtures.js';

// --- Helpers ---

async function clearStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

async function acceptLegalModal(page) {
  const legalModal = page.locator('#legal-modal');
  // Legal modal may not appear if legal_accepted is already in localStorage
  const isVisible = await legalModal.isVisible().catch(() => false);
  if (isVisible) {
    await page.click('#legal-accept-btn');
    await expect(legalModal).toBeHidden();
  } else {
    // Wait briefly — modal may render async
    try {
      await expect(legalModal).toBeVisible({ timeout: 3000 });
      await page.click('#legal-accept-btn');
      await expect(legalModal).toBeHidden();
    } catch {
      // Modal already dismissed or not present — continue
    }
  }
}

async function typeCommand(page, command) {
  const input = page.locator('#terminal-input');
  await input.fill(command);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
}

async function getLastOutput(page) {
  return page.locator('#terminal-output').textContent();
}

// ========================================
// TUTORIAL SYSTEM TESTS
// ========================================
test.describe('Tutorial System', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
  });

  // ----------------------------------------
  // Group 1: Tutorial Command Basics
  // ----------------------------------------

  test('tutorial command shows scenario list', async ({ page }) => {
    await typeCommand(page, 'tutorial');
    const output = await getLastOutput(page);

    // Should show the TUTORIALS header
    expect(output).toContain('TUTORIALS');

    // Should list at least the recon scenario (always available)
    expect(output).toContain('recon');

    // Should show usage hint
    expect(output).toContain('tutorial start');
  });

  test('tutorial status without active tutorial shows message', async ({ page }) => {
    await typeCommand(page, 'tutorial status');
    const output = await getLastOutput(page);

    expect(output).toContain('Geen actieve tutorial');
  });

  // ----------------------------------------
  // Group 2: Scenario Lifecycle
  // ----------------------------------------

  test('tutorial recon starts scenario with mission briefing', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    const output = await getLastOutput(page);

    // Should show briefing
    expect(output).toContain('MISSION BRIEFING');
    expect(output).toContain('SecureCorp');

    // Should show first step objective
    expect(output).toContain('ping');
  });

  test('tutorial status during active tutorial shows progress', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    await typeCommand(page, 'tutorial status');
    const output = await getLastOutput(page);

    expect(output).toContain('Actieve tutorial');
    expect(output).toContain('1/4');
  });

  test('correct command gives positive feedback and advances step', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');

    // Step 1: ping with an argument
    await typeCommand(page, 'ping 192.168.1.100');
    const output = await getLastOutput(page);

    // Should show success feedback
    expect(output).toContain('Correct');

    // Should show next step (nmap)
    expect(output).toContain('nmap');
  });

  test('wrong command gives hint suggestion after attempts', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');

    // Wrong commands — not the expected 'ping' with args
    await typeCommand(page, 'whoami');
    const output1 = await getLastOutput(page);
    expect(output1).toContain('niet het juiste commando');

    // After 2 wrong attempts, should get a hint
    await typeCommand(page, 'ls');
    await typeCommand(page, 'echo test');
    const output2 = await getLastOutput(page);
    expect(output2).toContain('Hint');
  });

  test('tutorial skip advances to next step', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    await typeCommand(page, 'tutorial skip');
    const output = await getLastOutput(page);

    // Should confirm skip
    expect(output).toContain('overgeslagen');

    // Should show step 2 (nmap)
    expect(output).toContain('nmap');
  });

  test('tutorial exit saves progress', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    await typeCommand(page, 'tutorial exit');
    const output = await getLastOutput(page);

    expect(output).toContain('Tutorial verlaten');
    expect(output).toContain('opgeslagen');
  });

  // ----------------------------------------
  // Group 3: Persistence
  // ----------------------------------------

  test('tutorial progress persists across page reload', async ({ page }) => {
    // Start a tutorial
    await typeCommand(page, 'tutorial recon');

    // Complete step 1 (ping with arg)
    await typeCommand(page, 'ping 192.168.1.100');
    await page.waitForTimeout(300);

    // Check localStorage has tutorial progress
    const saved = await page.evaluate(() => {
      return localStorage.getItem('hacksim_tutorial_progress');
    });
    expect(saved).toBeTruthy();

    var parsed = JSON.parse(saved);
    expect(parsed.activeScenario).toBe('recon');
    expect(parsed.currentStep).toBe(1);

    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);

    // Legal modal should NOT appear (already accepted)
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeHidden({ timeout: 2000 });

    // Check tutorial status shows resumed state
    await typeCommand(page, 'tutorial status');
    const output = await getLastOutput(page);

    expect(output).toContain('Actieve tutorial');
    expect(output).toContain('2/4');
  });

  // ----------------------------------------
  // Group 4: Full Scenario Completion
  // ----------------------------------------

  test('completing recon scenario shows completion message', async ({ page }) => {
    // Increase timeout for full scenario completion
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial recon');

    // Step 1: ping
    await typeCommand(page, 'ping 192.168.1.100');
    await page.waitForTimeout(300);

    // Step 2: nmap
    await typeCommand(page, 'nmap 192.168.1.100');
    await page.waitForTimeout(300);

    // Step 3: whois
    await typeCommand(page, 'whois securecorp.com');
    await page.waitForTimeout(300);

    // Step 4: traceroute
    await typeCommand(page, 'traceroute 192.168.1.100');
    await page.waitForTimeout(500);

    const output = await getLastOutput(page);

    // Should show completion
    expect(output).toContain('MISSIE VOLTOOID');

    // Should show congratulations
    expect(output).toContain('Goed gedaan');
  });

});
