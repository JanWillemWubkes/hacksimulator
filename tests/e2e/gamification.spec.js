// Gamification Cross-System E2E Tests - HackSimulator.nl
// Created: 2026-03-07
// Purpose: Test challenge flow, badge unlocks, achievements, and leaderboard

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
// CHALLENGE SYSTEM TESTS (8)
// ========================================
test.describe('Challenge System', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });
  });

  // ----------------------------------------
  // 1. challenge list shows all difficulties
  // ----------------------------------------
  test('challenge list shows all difficulties and challenge IDs', async ({ page }) => {
    await typeCommand(page, 'challenge');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('CHALLENGES', { timeout: 5000 });
    await expect(output).toContainText('EASY', { timeout: 2000 });
    await expect(output).toContainText('MEDIUM', { timeout: 2000 });
    await expect(output).toContainText('HARD', { timeout: 2000 });
    await expect(output).toContainText('network-scout', { timeout: 2000 });
    await expect(output).toContainText('identity-check', { timeout: 2000 });
  });

  // ----------------------------------------
  // 2. challenge start shows MISSION BRIEFING
  // ----------------------------------------
  test('challenge start identity-check shows mission briefing', async ({ page }) => {
    const input = page.locator('#terminal-input');
    await input.fill('challenge start identity-check');
    await page.keyboard.press('Enter');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });
    await expect(output).toContainText('Identity Check', { timeout: 2000 });
    await expect(output).toContainText('EASY', { timeout: 2000 });
    // Briefing shows requirement descriptions, not command names
    await expect(output).toContainText('Check je gebruikersnaam', { timeout: 2000 });
    await expect(output).toContainText('Bekijk netwerkinterfaces', { timeout: 2000 });
  });

  // ----------------------------------------
  // 3. End-to-end: identity-check completion
  // ----------------------------------------
  test('identity-check challenge completes after whoami + ifconfig', async ({ page }) => {
    await typeCommand(page, 'challenge start identity-check');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 5000 });

    // Execute required commands
    await typeCommand(page, 'whoami');
    await typeCommand(page, 'ifconfig');

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('VOLTOOID', { timeout: 5000 });
    await expect(output).toContainText('5', { timeout: 2000 }); // points
  });

  // ----------------------------------------
  // 4. challenge status during active challenge
  // ----------------------------------------
  test('challenge status shows progress during active challenge', async ({ page }) => {
    const input = page.locator('#terminal-input');
    await input.fill('challenge start identity-check');
    await page.keyboard.press('Enter');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Execute one of two required commands
    await typeCommand(page, 'whoami');
    await typeCommand(page, 'challenge status');

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Identity Check', { timeout: 5000 });
    // Status shows requirement descriptions with [X]/[ ] markers
    await expect(output).toContainText('Check je gebruikersnaam', { timeout: 2000 });
    await expect(output).toContainText('Bekijk netwerkinterfaces', { timeout: 2000 });
  });

  // ----------------------------------------
  // 5. challenge hint before 3 attempts
  // ----------------------------------------
  test('challenge hint before 3 attempts says probeer nog even', async ({ page }) => {
    await typeCommand(page, 'challenge start identity-check');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 5000 });

    // Only 0 attempts so far (start doesn't count)
    await typeCommand(page, 'challenge hint');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Probeer nog even', { timeout: 5000 });
  });

  // ----------------------------------------
  // 6. challenge hint after 3+ attempts shows hint
  // ----------------------------------------
  test('challenge hint after 3 wrong commands shows actual hint', async ({ page }) => {
    const input = page.locator('#terminal-input');
    await input.fill('challenge start identity-check');
    await page.keyboard.press('Enter');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Execute 4 non-target commands to ensure >= HINT_TIER_1 (3) attempts
    // Using filesystem commands that reliably trigger handleCommand
    await typeCommand(page, 'ls');
    await typeCommand(page, 'pwd');
    await typeCommand(page, 'date');
    await typeCommand(page, 'hostname');

    await typeCommand(page, 'challenge hint');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Hint', { timeout: 5000 });
    await expect(output).toContainText('whoami', { timeout: 2000 });
  });

  // ----------------------------------------
  // 7. challenge exit stops active challenge
  // ----------------------------------------
  test('challenge exit stops active challenge', async ({ page }) => {
    await typeCommand(page, 'challenge start identity-check');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 5000 });

    await typeCommand(page, 'challenge exit');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('verlaten', { timeout: 5000 });
    await expect(output).toContainText('Identity Check', { timeout: 2000 });
  });

  // ----------------------------------------
  // 8. already completed challenge shows message
  // ----------------------------------------
  test('starting already completed challenge shows al voltooid', async ({ page }) => {
    // Inject completed challenge
    await page.evaluate(() => {
      var data = JSON.parse(localStorage.getItem('hacksim_gamification') || '{}');
      data.completedChallenges = data.completedChallenges || [];
      data.completedChallenges.push('identity-check');
      data.totalPoints = (data.totalPoints || 0) + 5;
      localStorage.setItem('hacksim_gamification', JSON.stringify(data));
    });
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });

    await typeCommand(page, 'challenge start identity-check');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('al voltooid', { timeout: 5000 });
  });

});

// ========================================
// BADGE SYSTEM TESTS (4)
// ========================================
test.describe('Badge System', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });
  });

  // ----------------------------------------
  // 9. first command during challenge triggers First Steps badge
  // ----------------------------------------
  test('first command during challenge triggers First Steps badge', async ({ page }) => {
    // Badge requires totalCommands >= 1, which is only tracked during challenges
    await typeCommand(page, 'challenge start identity-check');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // First recorded command triggers the badge
    await typeCommand(page, 'ls');

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('BADGE UNLOCKED', { timeout: 5000 });
    await expect(output).toContainText('First Steps', { timeout: 2000 });
  });

  // ----------------------------------------
  // 10. achievements shows all rarity tiers
  // ----------------------------------------
  test('achievements shows all rarity tiers and badge count', async ({ page }) => {
    await typeCommand(page, 'achievements');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('ACHIEVEMENTS', { timeout: 5000 });
    await expect(output).toContainText('COMMON', { timeout: 2000 });
    await expect(output).toContainText('UNCOMMON', { timeout: 2000 });
    await expect(output).toContainText('RARE', { timeout: 2000 });
    await expect(output).toContainText('EPIC', { timeout: 2000 });
    await expect(output).toContainText('LEGENDARY', { timeout: 2000 });
    await expect(output).toContainText('21', { timeout: 2000 }); // total badge count
  });

  // ----------------------------------------
  // 11. achievements unlocked with injected badges
  // ----------------------------------------
  test('achievements unlocked shows earned badges', async ({ page }) => {
    // Use addInitScript to inject data BEFORE modules initialize on reload
    // This avoids the race condition where beforeunload flushes empty _cache
    await page.addInitScript(() => {
      var data = {
        totalPoints: 0,
        completedChallenges: [],
        totalCommands: 5,
        commandCounts: { whoami: 1, ping: 1, cat: 1, ls: 1, nmap: 1 },
        challengeLog: [],
        badges: ['first-command', 'network-novice', 'file-reader'],
        certificates: {},
        streak: 0,
        lastActiveDate: null
      };
      localStorage.setItem('hacksim_gamification', JSON.stringify(data));
    });
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });

    await typeCommand(page, 'achievements unlocked');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('First Steps', { timeout: 5000 });
    await expect(output).toContainText('Network Novice', { timeout: 2000 });
    await expect(output).toContainText('File Reader', { timeout: 2000 });
  });

  // ----------------------------------------
  // 12. achievements rarity rare filters correctly
  // ----------------------------------------
  test('achievements rarity rare filters on rarity', async ({ page }) => {
    await typeCommand(page, 'achievements rarity rare');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('RARE', { timeout: 5000 });
    // Locked badges show as "???" — verify the rare icon [#] and section header
    await expect(output).toContainText('[#]', { timeout: 2000 });
    await expect(output).toContainText('???', { timeout: 2000 });
  });

});

// ========================================
// LEADERBOARD TESTS (2)
// ========================================
test.describe('Leaderboard', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });
  });

  // ----------------------------------------
  // 13. leaderboard shows ranked list with Jij
  // ----------------------------------------
  test('leaderboard shows ranked list with Jij and simulated names', async ({ page }) => {
    await typeCommand(page, 'leaderboard');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('LEADERBOARD', { timeout: 5000 });
    await expect(output).toContainText('Jij', { timeout: 2000 });
    await expect(output).toContainText('Sh4d0wR00t', { timeout: 2000 });
    await expect(output).toContainText('ScriptKiddieMax', { timeout: 2000 });
  });

  // ----------------------------------------
  // 14. leaderboard me shows personal ranking
  // ----------------------------------------
  test('leaderboard me with injected points shows personal ranking', async ({ page }) => {
    // Inject points to get a mid-rank position
    await page.evaluate(() => {
      var data = JSON.parse(localStorage.getItem('hacksim_gamification') || '{}');
      data.totalPoints = 150;
      data.totalCommands = 30;
      localStorage.setItem('hacksim_gamification', JSON.stringify(data));
    });
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });

    await typeCommand(page, 'leaderboard me');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('RANKING', { timeout: 5000 });
    await expect(output).toContainText('150', { timeout: 2000 });
  });

});
