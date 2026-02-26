// Command Coverage E2E Tests - HackSimulator.nl
// Created: 2026-02-23
// Purpose: Cover commands without dedicated E2E tests
// Commands tested: pwd, date, man, history, find, grep, ifconfig, netstat

import { test, expect } from './fixtures.js';

// --- Helpers ---

async function clearStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

async function acceptLegalModal(page) {
  // After clearStorage + reload, legal modal always appears
  const legalModal = page.locator('#legal-modal');
  await expect(legalModal).toBeVisible({ timeout: 10000 });
  await page.locator('#legal-accept-btn').click();
  await expect(legalModal).toBeHidden({ timeout: 5000 });
}

async function typeCommand(page, command) {
  const input = page.locator('#terminal-input');
  await input.fill(command);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
}

// ========================================
// COMMAND COVERAGE TESTS
// ========================================
test.describe('Command Coverage - Untested Commands', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    // Wait for terminal to fully initialize (welcome banner renders)
    await expect(page.locator('#terminal-output')).toContainText('HACKSIMULATOR', { timeout: 10000 });
  });

  // ----------------------------------------
  // 1. pwd - Print Working Directory
  // ----------------------------------------
  test('pwd returns current working directory', async ({ page }) => {
    await typeCommand(page, 'pwd');
    await expect(page.locator('#terminal-output')).toContainText('/home/hacker', { timeout: 5000 });
  });

  test('pwd reflects directory change after cd', async ({ page }) => {
    await typeCommand(page, 'cd /etc');
    await typeCommand(page, 'pwd');
    // Prompt should show /etc after cd, and pwd outputs /etc
    await expect(page.locator('#terminal-output')).toContainText('/etc', { timeout: 5000 });
  });

  // ----------------------------------------
  // 2. date - Display Date/Time
  // ----------------------------------------
  test('date returns current date string', async ({ page }) => {
    await typeCommand(page, 'date');
    // JavaScript Date.toString() always contains GMT
    await expect(page.locator('#terminal-output')).toContainText('GMT', { timeout: 5000 });
  });

  // ----------------------------------------
  // 3. man - Manual Pages
  // ----------------------------------------
  test('man without args shows usage hint', async ({ page }) => {
    await typeCommand(page, 'man');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('man [command]', { timeout: 5000 });
    await expect(output).toContainText('TIP', { timeout: 2000 });
  });

  test('man nmap shows manual page with content', async ({ page }) => {
    await typeCommand(page, 'man nmap');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('NMAP', { timeout: 5000 });
    await expect(output).toContainText('BESCHRIJVING', { timeout: 2000 });
  });

  test('man nonexistent shows helpful error', async ({ page }) => {
    await typeCommand(page, 'man fakecmd');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Geen manual entry', { timeout: 5000 });
  });

  // ----------------------------------------
  // 4. history - Command History
  // ----------------------------------------
  test('history shows previously executed commands', async ({ page }) => {
    await typeCommand(page, 'whoami');
    await typeCommand(page, 'pwd');
    await typeCommand(page, 'history');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('whoami', { timeout: 5000 });
  });

  // ----------------------------------------
  // 5. find - Search Files by Name
  // ----------------------------------------
  test('find passwd locates password file', async ({ page }) => {
    await typeCommand(page, 'find passwd');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('/etc/passwd', { timeout: 5000 });
  });

  test('find without args shows usage error', async ({ page }) => {
    await typeCommand(page, 'find');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('missing', { timeout: 5000 });
  });

  // ----------------------------------------
  // 6. grep - Search File Contents
  // ----------------------------------------
  test('grep root /etc/passwd finds root user', async ({ page }) => {
    await typeCommand(page, 'grep root /etc/passwd');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('root', { timeout: 5000 });
  });

  test('grep without enough args shows usage error', async ({ page }) => {
    await typeCommand(page, 'grep');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('missing', { timeout: 5000 });
  });

  // ----------------------------------------
  // 7. ifconfig - Network Configuration
  // ----------------------------------------
  test('ifconfig shows network interfaces', async ({ page }) => {
    await typeCommand(page, 'ifconfig');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('eth0', { timeout: 5000 });
    await expect(output).toContainText('127.0.0.1', { timeout: 2000 });
  });

  // ----------------------------------------
  // 8. netstat - Network Statistics
  // ----------------------------------------
  test('netstat shows network connections', async ({ page }) => {
    await typeCommand(page, 'netstat');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Active Internet connections', { timeout: 5000 });
    await expect(output).toContainText('LISTEN', { timeout: 2000 });
  });

});
