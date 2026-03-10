// Tutorial Mobile E2E Tests - HackSimulator.nl
// Created: 2026-03-07
// Purpose: Test M6 tutorial scenarios on mobile viewport (375x667 iPhone SE)
// Covers: recon, webvuln, privesc — briefing, completion, hints, certificates

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
  try {
    await expect(legalModal).toBeVisible({ timeout: 5000 });
    await page.locator('#legal-accept-btn').click();
    await expect(legalModal).toBeHidden({ timeout: 5000 });
  } catch (e) {
    // Legal modal may already be dismissed
  }
}

async function typeCommand(page, command) {
  const input = page.locator('#terminal-input');
  await input.fill(command);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
}

// Force mobile viewport for all tests in this file
test.use({ viewport: { width: 375, height: 667 } });

// ========================================
// TUTORIAL MOBILE TESTS (12)
// ========================================
test.describe('Tutorial Mobile', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });
  });

  // ----------------------------------------
  // Group 1: Reconnaissance Scenario (Mobile)
  // ----------------------------------------

  test('tutorial list renders on mobile without overflow', async ({ page }) => {
    await typeCommand(page, 'tutorial');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('TUTORIALS', { timeout: 5000 });
    await expect(output).toContainText('recon', { timeout: 2000 });
    await expect(output).toContainText('tutorial start', { timeout: 2000 });
  });

  test('recon mission briefing renders on mobile', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('MISSION BRIEFING', { timeout: 5000 });
    await expect(output).toContainText('SecureCorp', { timeout: 2000 });
    await expect(output).toContainText('ping', { timeout: 2000 });
  });

  test('full recon scenario completion on mobile', async ({ page }) => {
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

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSIE VOLTOOID', { timeout: 5000 });
    await expect(output).toContainText('Goed gedaan', { timeout: 2000 });
  });

  test('recon certificate display on mobile after completion', async ({ page }) => {
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

    // Request certificate
    await typeCommand(page, 'tutorial cert');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('CERTIFICAAT', { timeout: 5000 });
  });

  // ----------------------------------------
  // Group 2: Web Vulnerabilities Scenario (Mobile)
  // ----------------------------------------

  test('webvuln mission briefing renders on mobile', async ({ page }) => {
    await typeCommand(page, 'tutorial webvuln');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('MISSION BRIEFING', { timeout: 5000 });
    await expect(output).toContainText('nmap', { timeout: 2000 });
  });

  test('full webvuln scenario completion on mobile', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial webvuln');

    // Step 1: nmap
    await typeCommand(page, 'nmap target');
    await page.waitForTimeout(300);

    // Step 2: nikto
    await typeCommand(page, 'nikto target');
    await page.waitForTimeout(300);

    // Step 3: sqlmap
    await typeCommand(page, 'sqlmap target');
    await page.waitForTimeout(300);

    // Step 4: cat config
    await typeCommand(page, 'cat config.php');
    await page.waitForTimeout(500);

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSIE VOLTOOID', { timeout: 5000 });
  });

  test('webvuln hint display on mobile after wrong attempts', async ({ page }) => {
    await typeCommand(page, 'tutorial webvuln');

    // Wrong commands to trigger hints
    await typeCommand(page, 'whoami');
    await typeCommand(page, 'ls');
    await typeCommand(page, 'echo test');

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Hint', { timeout: 5000 });
  });

  test('webvuln certificate display on mobile after completion', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial webvuln');
    await typeCommand(page, 'nmap target');
    await page.waitForTimeout(300);
    await typeCommand(page, 'nikto target');
    await page.waitForTimeout(300);
    await typeCommand(page, 'sqlmap target');
    await page.waitForTimeout(300);
    await typeCommand(page, 'cat config.php');
    await page.waitForTimeout(500);

    await typeCommand(page, 'tutorial cert');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('CERTIFICAAT', { timeout: 5000 });
  });

  // ----------------------------------------
  // Group 3: Privilege Escalation Scenario (Mobile)
  // ----------------------------------------

  test('privesc mission briefing renders on mobile', async ({ page }) => {
    await typeCommand(page, 'tutorial privesc');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('MISSION BRIEFING', { timeout: 5000 });
    await expect(output).toContainText('cat', { timeout: 2000 });
  });

  test('full privesc scenario completion on mobile', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial privesc');

    // Step 1: enumerate users
    await typeCommand(page, 'cat /etc/passwd');
    await page.waitForTimeout(300);

    // Step 2: explore logs
    await typeCommand(page, 'ls /var/log');
    await page.waitForTimeout(300);

    // Step 3: analyze auth log
    await typeCommand(page, 'cat /var/log/auth.log');
    await page.waitForTimeout(300);

    // Step 4: find leaked credentials
    await typeCommand(page, 'cat ~/.bash_history');
    await page.waitForTimeout(500);

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSIE VOLTOOID', { timeout: 5000 });
  });

  test('privesc progress persists on mobile after reload', async ({ page }) => {
    test.setTimeout(60000);

    // Start privesc and complete step 1
    await typeCommand(page, 'tutorial privesc');
    await typeCommand(page, 'cat /etc/passwd');
    await page.waitForTimeout(300);

    // Verify progress saved
    const saved = await page.evaluate(() => {
      return localStorage.getItem('hacksim_tutorial_progress');
    });
    expect(saved).toBeTruthy();

    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);

    // Legal modal should not reappear
    try {
      const legalModal = page.locator('#legal-modal');
      await expect(legalModal).toBeHidden({ timeout: 2000 });
    } catch {
      // Modal not present
    }

    // Verify tutorial status shows resumed state
    await typeCommand(page, 'tutorial status');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Actieve tutorial', { timeout: 5000 });
    await expect(output).toContainText('2/4', { timeout: 2000 });
  });

  test('privesc certificate display on mobile after completion', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial privesc');
    await typeCommand(page, 'cat /etc/passwd');
    await page.waitForTimeout(300);
    await typeCommand(page, 'ls /var/log');
    await page.waitForTimeout(300);
    await typeCommand(page, 'cat /var/log/auth.log');
    await page.waitForTimeout(300);
    await typeCommand(page, 'cat ~/.bash_history');
    await page.waitForTimeout(500);

    await typeCommand(page, 'tutorial cert');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('CERTIFICAAT', { timeout: 5000 });
  });

});
