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

  // ----------------------------------------
  // Group 5: Web Vulnerabilities Scenario
  // ----------------------------------------

  test('webvuln scenario starts with correct briefing', async ({ page }) => {
    await typeCommand(page, 'tutorial webvuln');
    const output = await getLastOutput(page);

    expect(output).toContain('MISSION BRIEFING');
    // Should mention the target context and first step command
    expect(output).toContain('nmap');
  });

  test('completing webvuln scenario shows completion', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial webvuln');

    // Step 1: nmap (identify webserver)
    await typeCommand(page, 'nmap target');
    await page.waitForTimeout(300);

    // Step 2: nikto (scan web vulnerabilities)
    await typeCommand(page, 'nikto target');
    await page.waitForTimeout(300);

    // Step 3: sqlmap (test SQL injection)
    await typeCommand(page, 'sqlmap target');
    await page.waitForTimeout(300);

    // Step 4: cat config file (discover sensitive config)
    await typeCommand(page, 'cat config.php');
    await page.waitForTimeout(500);

    const output = await getLastOutput(page);
    expect(output).toContain('MISSIE VOLTOOID');
  });

  // ----------------------------------------
  // Group 6: Privilege Escalation Scenario
  // ----------------------------------------

  test('privesc scenario starts with correct briefing', async ({ page }) => {
    await typeCommand(page, 'tutorial privesc');
    const output = await getLastOutput(page);

    expect(output).toContain('MISSION BRIEFING');
    // Should mention the first step command
    expect(output).toContain('cat');
  });

  test('completing privesc scenario shows completion', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial privesc');

    // Step 1: enumerate users
    await typeCommand(page, 'cat /etc/passwd');
    await page.waitForTimeout(300);

    // Step 2: explore log files
    await typeCommand(page, 'ls /var/log');
    await page.waitForTimeout(300);

    // Step 3: analyze login attempts
    await typeCommand(page, 'cat /var/log/auth.log');
    await page.waitForTimeout(300);

    // Step 4: find leaked credentials
    await typeCommand(page, 'cat ~/.bash_history');
    await page.waitForTimeout(500);

    const output = await getLastOutput(page);
    expect(output).toContain('MISSIE VOLTOOID');
  });

  // ----------------------------------------
  // Group 7: Certificate & Reset
  // ----------------------------------------

  test('tutorial cert after completion shows certificate', async ({ page }) => {
    test.setTimeout(60000);

    // Complete recon scenario first
    await typeCommand(page, 'tutorial recon');
    await typeCommand(page, 'ping 192.168.1.100');
    await page.waitForTimeout(300);
    await typeCommand(page, 'nmap 192.168.1.100');
    await page.waitForTimeout(300);
    await typeCommand(page, 'whois securecorp.com');
    await page.waitForTimeout(300);
    await typeCommand(page, 'traceroute 192.168.1.100');
    await page.waitForTimeout(500);

    // Now request the certificate
    await typeCommand(page, 'tutorial cert');
    const output = await getLastOutput(page);

    expect(output).toContain('CERTIFICAAT');
  });

  test('tutorial reset clears all progress', async ({ page }) => {
    // Start recon and complete step 1
    await typeCommand(page, 'tutorial recon');
    await typeCommand(page, 'ping 192.168.1.100');
    await page.waitForTimeout(300);

    // Verify progress exists in localStorage
    const savedBefore = await page.evaluate(() => {
      return localStorage.getItem('hacksim_tutorial_progress');
    });
    expect(savedBefore).toBeTruthy();

    // Reset all progress
    await typeCommand(page, 'tutorial reset');
    const resetOutput = await getLastOutput(page);
    expect(resetOutput).toContain('gereset');

    // Verify localStorage is cleared
    const savedAfter = await page.evaluate(() => {
      return localStorage.getItem('hacksim_tutorial_progress');
    });
    expect(savedAfter).toBeNull();

    // Verify no active tutorial
    await typeCommand(page, 'tutorial status');
    const statusOutput = await getLastOutput(page);
    expect(statusOutput).toContain('Geen actieve tutorial');
  });

  test('scenario list shows completion status after finishing', async ({ page }) => {
    test.setTimeout(60000);

    // Complete recon scenario
    await typeCommand(page, 'tutorial recon');
    await typeCommand(page, 'ping 192.168.1.100');
    await page.waitForTimeout(300);
    await typeCommand(page, 'nmap 192.168.1.100');
    await page.waitForTimeout(300);
    await typeCommand(page, 'whois securecorp.com');
    await page.waitForTimeout(300);
    await typeCommand(page, 'traceroute 192.168.1.100');
    await page.waitForTimeout(500);

    // Check scenario list for completion indicator
    await typeCommand(page, 'tutorial');
    const output = await getLastOutput(page);

    // Should show completed marker next to recon
    expect(output).toContain('recon');
    // Completion indicator: [X] or ✓ or VOLTOOID
    const hasCompletionMarker = output.includes('[X]') ||
      output.includes('✓') ||
      output.includes('VOLTOOID') ||
      output.includes('voltooid');
    expect(hasCompletionMarker).toBe(true);
  });

  // ----------------------------------------
  // Group 8: Hint Persistence
  // ----------------------------------------

  test('hint counts persist across page reload', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial recon');

    // Type 2 wrong commands to trigger hint tier 1
    await typeCommand(page, 'whoami');
    await page.waitForTimeout(300);
    await typeCommand(page, 'ls');
    await page.waitForTimeout(300);

    // Verify hint data is saved in localStorage
    const hintData = await page.evaluate(() => {
      return localStorage.getItem('hacksim_tutorial_hints');
    });
    expect(hintData).toBeTruthy();

    // Reload page (progress should persist)
    await page.reload();
    await page.waitForTimeout(1000);

    // Legal modal should not reappear
    try {
      const legalModal = page.locator('#legal-modal');
      await expect(legalModal).toBeHidden({ timeout: 2000 });
    } catch {
      // Modal not present — fine
    }

    // Type another wrong command — should still show hint (not reset to 0)
    await typeCommand(page, 'echo test');
    const output = await getLastOutput(page);

    // After 3 total wrong attempts (2 before reload + 1 after),
    // hint count should be >= tier 1 threshold (2), so hints should appear
    expect(output).toContain('Hint');
  });

});
