// Dashboard E2E Tests - HackSimulator.nl
// Created: 2026-02-27
// Purpose: Test dashboard command, subcommands, and unknown subcommand handling

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

// ========================================
// DASHBOARD TESTS
// ========================================
test.describe('Dashboard Command', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('HACKSIMULATOR', { timeout: 10000 });
  });

  // ----------------------------------------
  // 1. dashboard — full overview
  // ----------------------------------------
  test('dashboard shows full overview with header', async ({ page }) => {
    await typeCommand(page, 'dashboard');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('DASHBOARD', { timeout: 5000 });
    await expect(output).toContainText('PLAYER STATS', { timeout: 2000 });
    await expect(output).toContainText('CHALLENGES', { timeout: 2000 });
    await expect(output).toContainText('BADGES', { timeout: 2000 });
    await expect(output).toContainText('VOLGENDE STAP', { timeout: 2000 });
  });

  // ----------------------------------------
  // 2. dashboard — stats section shows points and commands
  // ----------------------------------------
  test('dashboard stats section shows points and commands', async ({ page }) => {
    await typeCommand(page, 'dashboard');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Punten:', { timeout: 5000 });
    await expect(output).toContainText('Commando\'s:', { timeout: 2000 });
    await expect(output).toContainText('Streak:', { timeout: 2000 });
  });

  // ----------------------------------------
  // 3. dashboard stats — subcommand
  // ----------------------------------------
  test('dashboard stats subcommand works', async ({ page }) => {
    await typeCommand(page, 'dashboard stats');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('PLAYER STATS', { timeout: 5000 });
    await expect(output).toContainText('Punten:', { timeout: 2000 });
  });

  // ----------------------------------------
  // 4. dashboard badges — subcommand
  // ----------------------------------------
  test('dashboard badges subcommand works', async ({ page }) => {
    await typeCommand(page, 'dashboard badges');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('BADGE OVERZICHT', { timeout: 5000 });
    await expect(output).toContainText('Unlocked:', { timeout: 2000 });
  });

  // ----------------------------------------
  // 5. dashboard challenges — subcommand
  // ----------------------------------------
  test('dashboard challenges subcommand works', async ({ page }) => {
    await typeCommand(page, 'dashboard challenges');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('CHALLENGE VOORTGANG', { timeout: 5000 });
    await expect(output).toContainText('EASY', { timeout: 2000 });
    await expect(output).toContainText('MEDIUM', { timeout: 2000 });
    await expect(output).toContainText('HARD', { timeout: 2000 });
  });

  // ----------------------------------------
  // 6. dashboard <unknown> — error message
  // ----------------------------------------
  test('dashboard with unknown subcommand shows usage hint', async ({ page }) => {
    await typeCommand(page, 'dashboard foobar');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Onbekend subcommando', { timeout: 5000 });
    await expect(output).toContainText('dashboard', { timeout: 2000 });
  });

  // ----------------------------------------
  // 7. man dashboard — shows man page
  // ----------------------------------------
  test('man dashboard shows manual page', async ({ page }) => {
    await typeCommand(page, 'man dashboard');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('BESCHRIJVING', { timeout: 5000 });
    await expect(output).toContainText('VOORBEELDEN', { timeout: 2000 });
    await expect(output).toContainText('GERELATEERDE', { timeout: 2000 });
  });

  // ----------------------------------------
  // 8. dashboard with gamification data — shows progress
  // ----------------------------------------
  test('dashboard reflects injected gamification data', async ({ page }) => {
    // Inject gamification data
    await page.evaluate(() => {
      var data = JSON.parse(localStorage.getItem('hacksim_gamification') || '{}');
      data.totalPoints = 25;
      data.totalCommands = 42;
      data.completedChallenges = ['network-scout', 'file-finder'];
      data.badges = ['first-command', 'scanner'];
      data.streak = 3;
      data.lastActiveDate = new Date().toISOString().slice(0, 10);
      localStorage.setItem('hacksim_gamification', JSON.stringify(data));
    });
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('HACKSIMULATOR', { timeout: 10000 });

    await typeCommand(page, 'dashboard');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('25', { timeout: 5000 });
    await expect(output).toContainText('42', { timeout: 2000 });
    await expect(output).toContainText('3 dagen', { timeout: 2000 });
  });

});
