// Certificate System E2E Tests - HackSimulator.nl
// Created: 2026-02-27
// Purpose: Test certificates command, empty state, challenge cert redirect

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
// CERTIFICATE SYSTEM TESTS
// ========================================
test.describe('Certificate System', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('HACKSIMULATOR', { timeout: 10000 });
  });

  // ----------------------------------------
  // 1. certificates — empty state
  // ----------------------------------------
  test('certificates without earned certs shows empty state', async ({ page }) => {
    await typeCommand(page, 'certificates');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('nog geen certificaten', { timeout: 5000 });
    await expect(output).toContainText('challenge', { timeout: 2000 });
  });

  // ----------------------------------------
  // 2. certificates <invalid-id> — error message
  // ----------------------------------------
  test('certificates with invalid id shows error', async ({ page }) => {
    await typeCommand(page, 'certificates nonexistent');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Onbekende challenge', { timeout: 5000 });
  });

  // ----------------------------------------
  // 3. certificates <valid-id> — not yet completed
  // ----------------------------------------
  test('certificates with uncompleted challenge shows hint', async ({ page }) => {
    await typeCommand(page, 'certificates network-scout');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('nog niet voltooid', { timeout: 5000 });
    await expect(output).toContainText('challenge start', { timeout: 2000 });
  });

  // ----------------------------------------
  // 4. challenge cert — redirect
  // ----------------------------------------
  test('challenge cert redirects to certificates command', async ({ page }) => {
    await typeCommand(page, 'challenge cert');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('certificates', { timeout: 5000 });
  });

  // ----------------------------------------
  // 5. man certificates — shows man page
  // ----------------------------------------
  test('man certificates shows manual page', async ({ page }) => {
    await typeCommand(page, 'man certificates');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('CERTIFICAAT NIVEAUS', { timeout: 5000 });
    await expect(output).toContainText('BESCHRIJVING', { timeout: 2000 });
  });

  // ----------------------------------------
  // 6. certificates with earned cert — full flow
  // ----------------------------------------
  test('certificates shows earned cert after challenge completion', async ({ page }) => {
    // Inject a completed challenge + certificate into localStorage
    await page.evaluate(() => {
      var data = JSON.parse(localStorage.getItem('hacksim_gamification') || '{}');
      data.completedChallenges = data.completedChallenges || [];
      if (data.completedChallenges.indexOf('network-scout') === -1) {
        data.completedChallenges.push('network-scout');
      }
      data.totalPoints = (data.totalPoints || 0) + 5;
      data.certificates = data.certificates || {};
      data.certificates['network-scout'] = {
        earnedAt: new Date().toISOString(),
        attempts: 4
      };
      localStorage.setItem('hacksim_gamification', JSON.stringify(data));
    });
    // Reload to pick up injected data
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('HACKSIMULATOR', { timeout: 10000 });

    // List should show the certificate
    await typeCommand(page, 'certificates');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Network Scout', { timeout: 5000 });
    await expect(output).toContainText('EASY', { timeout: 2000 });

    // View full certificate
    await typeCommand(page, 'certificates network-scout');
    await expect(output).toContainText('CERTIFICAAT VAN VOLTOOIING', { timeout: 5000 });
    await expect(output).toContainText('Hacker Apprentice', { timeout: 2000 });
    await expect(output).toContainText('netwerk verkenning', { timeout: 2000 });
  });

});
