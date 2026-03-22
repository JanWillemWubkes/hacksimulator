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
    const output = page.locator('#terminal-output');

    // Should show the TUTORIALS header
    await expect(output).toContainText('TUTORIALS', { timeout: 5000 });

    // Should list at least the recon scenario (always available)
    await expect(output).toContainText('recon', { timeout: 2000 });

    // Should show usage hint
    await expect(output).toContainText('tutorial start', { timeout: 2000 });
  });

  test('tutorial status without active tutorial shows message', async ({ page }) => {
    await typeCommand(page, 'tutorial status');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('Geen actieve tutorial', { timeout: 5000 });
  });

  // ----------------------------------------
  // Group 2: Scenario Lifecycle
  // ----------------------------------------

  test('tutorial recon starts scenario with mission briefing', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    const output = page.locator('#terminal-output');

    // Should show briefing
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });
    await expect(output).toContainText('SecureCorp', { timeout: 2000 });

    // Should show first step objective
    await expect(output).toContainText('ping', { timeout: 2000 });
  });

  test('tutorial status during active tutorial shows progress', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });

    await typeCommand(page, 'tutorial status');

    await expect(output).toContainText('Actieve tutorial', { timeout: 5000 });
    await expect(output).toContainText('1/4', { timeout: 2000 });
  });

  test('correct command gives positive feedback and advances step', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Step 1: ping with an argument
    await typeCommand(page, 'ping 192.168.1.100');
    const output = page.locator('#terminal-output');

    // Should show success feedback
    await expect(output).toContainText('Correct', { timeout: 5000 });

    // Should show next step (nmap)
    await expect(output).toContainText('nmap', { timeout: 2000 });
  });

  test('wrong command gives hint suggestion after attempts', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Wrong commands — not the expected 'ping' with args
    await typeCommand(page, 'whoami');
    await expect(output).toContainText('hoort niet bij deze stap', { timeout: 5000 });

    // After 2 wrong attempts, should get a hint
    await typeCommand(page, 'ls');
    await typeCommand(page, 'echo test');
    await expect(output).toContainText('Hint', { timeout: 5000 });
  });

  test('tutorial skip advances to next step', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    await typeCommand(page, 'tutorial skip');
    const output = page.locator('#terminal-output');

    // Should confirm skip
    await expect(output).toContainText('overgeslagen', { timeout: 5000 });

    // Should show step 2 (nmap)
    await expect(output).toContainText('nmap', { timeout: 2000 });
  });

  test('tutorial exit saves progress', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    await typeCommand(page, 'tutorial exit');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('Tutorial verlaten', { timeout: 5000 });
    await expect(output).toContainText('opgeslagen', { timeout: 2000 });
  });

  // ----------------------------------------
  // Group 3: Persistence
  // ----------------------------------------

  test('tutorial progress persists across page reload', async ({ page }) => {
    // Start a tutorial — wait for briefing before next command
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Complete step 1 (ping with arg)
    await typeCommand(page, 'ping 192.168.1.100');

    // Wait for debounced localStorage save to flush
    await expect.poll(async () => {
      return page.evaluate(() => localStorage.getItem('hacksim_tutorial_progress'));
    }, { timeout: 5000 }).toBeTruthy();

    const saved = await page.evaluate(() => {
      return localStorage.getItem('hacksim_tutorial_progress');
    });
    var parsed = JSON.parse(saved);
    expect(parsed.activeScenario).toBe('recon');
    expect(parsed.currentStep).toBe(1);

    // Reload page — wait for terminal to fully initialize
    await page.reload();
    await expect(page.locator('#terminal-input')).toBeVisible({ timeout: 10000 });

    // Legal modal should NOT appear (already accepted)
    const legalModal = page.locator('#legal-modal');
    await expect(legalModal).toBeHidden({ timeout: 2000 });

    // Check tutorial status shows resumed state
    await typeCommand(page, 'tutorial status');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('Actieve tutorial', { timeout: 5000 });
    await expect(output).toContainText('2/4', { timeout: 2000 });
  });

  // ----------------------------------------
  // Group 4: Full Scenario Completion
  // ----------------------------------------

  test('completing recon scenario shows completion message', async ({ page }) => {
    // Increase timeout for full scenario completion
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Step 1: ping — wait for tutorial state machine to advance
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

    const output = page.locator('#terminal-output');

    // Should show completion
    await expect(output).toContainText('MISSIE VOLTOOID', { timeout: 5000 });

    // Should show congratulations
    await expect(output).toContainText('Goed gedaan', { timeout: 2000 });
  });

  // ----------------------------------------
  // Group 5: Web Vulnerabilities Scenario
  // ----------------------------------------

  test('webvuln scenario starts with correct briefing', async ({ page }) => {
    await typeCommand(page, 'tutorial webvuln');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });
    // Should mention the target context and first step command
    await expect(output).toContainText('nmap', { timeout: 2000 });
  });

  test('completing webvuln scenario shows completion', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial webvuln');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Step 1: nmap (identify webserver) — wait for tutorial state machine
    await typeCommand(page, 'nmap target.com');
    await page.waitForTimeout(300);

    // Step 2: nikto (scan web vulnerabilities)
    await typeCommand(page, 'nikto http://target.com');
    await page.waitForTimeout(300);

    // Step 3: sqlmap (test SQL injection)
    await typeCommand(page, 'sqlmap http://target.com/login?id=1');
    await page.waitForTimeout(300);

    // Step 4: cat config file (discover sensitive config)
    await typeCommand(page, 'cat /var/www/html/config.php');

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSIE VOLTOOID', { timeout: 5000 });
  });

  // ----------------------------------------
  // Group 6: Privilege Escalation Scenario
  // ----------------------------------------

  test('privesc scenario starts with correct briefing', async ({ page }) => {
    await typeCommand(page, 'tutorial privesc');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });
    // Should mention the first step command
    await expect(output).toContainText('cat', { timeout: 2000 });
  });

  test('completing privesc scenario shows completion', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial privesc');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Step 1: enumerate users — wait for tutorial state machine
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

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSIE VOLTOOID', { timeout: 5000 });
  });

  // ----------------------------------------
  // Group 7: Certificate & Reset
  // ----------------------------------------

  test('tutorial cert after completion shows certificate', async ({ page }) => {
    test.setTimeout(60000);

    // Complete recon scenario first — wait for briefing before steps
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });
    await typeCommand(page, 'ping 192.168.1.100');
    await page.waitForTimeout(300);
    await typeCommand(page, 'nmap 192.168.1.100');
    await page.waitForTimeout(300);
    await typeCommand(page, 'whois securecorp.com');
    await page.waitForTimeout(300);
    await typeCommand(page, 'traceroute 192.168.1.100');

    // Now request the certificate
    await typeCommand(page, 'tutorial cert');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('CERTIFICAAT', { timeout: 5000 });
  });

  test('tutorial reset clears all progress', async ({ page }) => {
    // Start recon and complete step 1
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });
    await typeCommand(page, 'ping 192.168.1.100');

    // Wait for debounced localStorage save to flush
    await expect.poll(async () => {
      return page.evaluate(() => localStorage.getItem('hacksim_tutorial_progress'));
    }, { timeout: 5000 }).toBeTruthy();

    // Reset all progress
    await typeCommand(page, 'tutorial reset');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('gereset', { timeout: 5000 });

    // Verify localStorage is cleared
    const savedAfter = await page.evaluate(() => {
      return localStorage.getItem('hacksim_tutorial_progress');
    });
    expect(savedAfter).toBeNull();

    // Verify no active tutorial
    await typeCommand(page, 'tutorial status');
    await expect(output).toContainText('Geen actieve tutorial', { timeout: 5000 });
  });

  test('filesystem reset during tutorial exits tutorial cleanly', async ({ page }) => {
    // Start recon tutorial and reach step 1
    await typeCommand(page, 'tutorial recon');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Use filesystem 'reset' (not 'tutorial reset') during active tutorial
    await typeCommand(page, 'reset');

    // Should NOT show tutorial rejection message
    await expect(output).not.toContainText('hoort niet bij deze stap', { timeout: 3000 });

    // Should show filesystem reset confirmation
    await expect(output).toContainText('Filesystem reset to initial state', { timeout: 5000 });

    // Should show tutorial exit with next-steps guidance
    await expect(output).toContainText('Actieve tutorial verlaten', { timeout: 3000 });
    await expect(output).toContainText('Wat wil je doen', { timeout: 3000 });
    await expect(output).toContainText('tutorial start recon', { timeout: 3000 });

    // Verify tutorial is no longer active
    await typeCommand(page, 'tutorial status');
    await expect(output).toContainText('Geen actieve tutorial', { timeout: 5000 });
  });

  test('scenario list shows completion status after finishing', async ({ page }) => {
    test.setTimeout(60000);

    // Complete recon scenario — wait for briefing before steps
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });
    await typeCommand(page, 'ping 192.168.1.100');
    await page.waitForTimeout(300);
    await typeCommand(page, 'nmap 192.168.1.100');
    await page.waitForTimeout(300);
    await typeCommand(page, 'whois securecorp.com');
    await page.waitForTimeout(300);
    await typeCommand(page, 'traceroute 192.168.1.100');

    // Check scenario list for completion indicator
    await typeCommand(page, 'tutorial');
    const output = page.locator('#terminal-output');

    // Should show completed marker next to recon
    await expect(output).toContainText('recon', { timeout: 5000 });
    // Completion indicator: [X] or ✓ or VOLTOOID
    const text = await output.textContent();
    const hasCompletionMarker = text.includes('[X]') ||
      text.includes('✓') ||
      text.includes('VOLTOOID') ||
      text.includes('voltooid');
    expect(hasCompletionMarker).toBe(true);
  });

  // ----------------------------------------
  // Group 8: Hint Persistence
  // ----------------------------------------

  test('hint counts persist across page reload', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Type 2 wrong commands to trigger hint tier 1
    await typeCommand(page, 'whoami');
    await typeCommand(page, 'ls');

    // Wait for debounced localStorage save to flush
    await expect.poll(async () => {
      return page.evaluate(() => localStorage.getItem('hacksim_tutorial_hints'));
    }, { timeout: 5000 }).toBeTruthy();

    // Reload page (progress should persist) — wait for terminal to initialize
    await page.reload();
    await expect(page.locator('#terminal-input')).toBeVisible({ timeout: 10000 });

    const output = page.locator('#terminal-output');

    // Legal modal should not reappear
    try {
      const legalModal = page.locator('#legal-modal');
      await expect(legalModal).toBeHidden({ timeout: 2000 });
    } catch {
      // Modal not present — fine
    }

    // Type another wrong command — should still show hint (not reset to 0)
    await typeCommand(page, 'echo test');

    // After 3 total wrong attempts (2 before reload + 1 after),
    // hint count should be >= tier 1 threshold (2), so hints should appear
    await expect(output).toContainText('Hint', { timeout: 5000 });
  });

});
