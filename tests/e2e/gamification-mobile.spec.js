// Gamification Mobile E2E Tests - HackSimulator.nl
// Created: 2026-03-07
// Purpose: Test gamification commands on mobile viewport (375x667 iPhone SE)

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
// MOBILE GAMIFICATION TESTS (6)
// ========================================
test.describe('Gamification Mobile', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });
  });

  // ----------------------------------------
  // 1. dashboard on mobile shows all sections
  // ----------------------------------------
  test('dashboard on mobile shows all sections', async ({ page }) => {
    await typeCommand(page, 'dashboard');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('DASHBOARD', { timeout: 5000 });
    await expect(output).toContainText('PLAYER STATS', { timeout: 2000 });
    await expect(output).toContainText('CHALLENGES', { timeout: 2000 });
    await expect(output).toContainText('BADGES', { timeout: 2000 });
  });

  // ----------------------------------------
  // 2. challenge list on mobile shows challenges
  // ----------------------------------------
  test('challenge list on mobile shows challenges and difficulty', async ({ page }) => {
    await typeCommand(page, 'challenge');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('CHALLENGES', { timeout: 5000 });
    await expect(output).toContainText('EASY', { timeout: 2000 });
    await expect(output).toContainText('network-scout', { timeout: 2000 });
  });

  // ----------------------------------------
  // 3. achievements on mobile shows rarity tiers
  // ----------------------------------------
  test('achievements on mobile shows badge rarity tiers', async ({ page }) => {
    await typeCommand(page, 'achievements');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('ACHIEVEMENTS', { timeout: 5000 });
    await expect(output).toContainText('COMMON', { timeout: 2000 });
    await expect(output).toContainText('UNCOMMON', { timeout: 2000 });
    await expect(output).toContainText('RARE', { timeout: 2000 });
  });

  // ----------------------------------------
  // 4. leaderboard on mobile shows ranking
  // ----------------------------------------
  test('leaderboard on mobile shows ranking with Jij', async ({ page }) => {
    await typeCommand(page, 'leaderboard');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('LEADERBOARD', { timeout: 5000 });
    await expect(output).toContainText('Jij', { timeout: 2000 });
  });

  // ----------------------------------------
  // 5. certificate display on mobile
  // ----------------------------------------
  test('certificate on mobile shows earned certificate', async ({ page }) => {
    // Inject completed challenge + certificate
    await page.evaluate(() => {
      var data = JSON.parse(localStorage.getItem('hacksim_gamification') || '{}');
      data.completedChallenges = ['identity-check'];
      data.totalPoints = 5;
      data.certificates = {};
      data.certificates['identity-check'] = {
        earnedAt: new Date().toISOString(),
        attempts: 2
      };
      localStorage.setItem('hacksim_gamification', JSON.stringify(data));
    });
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });

    await typeCommand(page, 'certificates identity-check');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('CERTIFICAAT', { timeout: 5000 });
    await expect(output).toContainText('Identity Check', { timeout: 2000 });
  });

  // ----------------------------------------
  // 6. challenge completion on mobile (full flow)
  // ----------------------------------------
  test('identity-check challenge completes on mobile', async ({ page }) => {
    await typeCommand(page, 'challenge start identity-check');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 5000 });

    await typeCommand(page, 'whoami');
    await typeCommand(page, 'ifconfig');

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('VOLTOOID', { timeout: 5000 });
  });

});
