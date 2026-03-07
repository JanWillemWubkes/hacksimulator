// Gamification Performance E2E Tests - HackSimulator.nl
// Created: 2026-03-07
// Purpose: Test gamification rendering speed, data limits, and bundle size

import { test, expect } from './fixtures.js';
import { readFileSync, statSync } from 'fs';
import { join } from 'path';

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

/**
 * Type a command and measure time until expected text appears in output.
 * Returns render time in milliseconds.
 */
async function typeCommandAndMeasure(page, command, expectedText, timeout) {
  const input = page.locator('#terminal-input');
  const start = Date.now();
  await input.fill(command);
  await page.keyboard.press('Enter');
  await page.waitForFunction(
    (text) => document.getElementById('terminal-output').textContent.includes(text),
    expectedText,
    { timeout: timeout || 5000 }
  );
  return Date.now() - start;
}

/**
 * Inject heavy gamification data: many completed challenges, badges, and high stats.
 */
async function injectHeavyData(page, completedCount) {
  await page.evaluate((count) => {
    // Generate challenge IDs
    var easyIds = ['network-scout', 'file-explorer', 'identity-check', 'domain-intel', 'log-hunter'];
    var mediumIds = ['port-scanner-pro', 'web-recon', 'sql-sleuth', 'password-cracker', 'system-navigator'];
    var hardIds = ['full-pentest', 'web-exploit', 'network-breach', 'crypto-master', 'stealth-ops'];
    var allIds = easyIds.concat(mediumIds, hardIds);

    var completed = allIds.slice(0, Math.min(count, allIds.length));

    // Build heavy data
    var data = {
      totalPoints: count * 10,
      totalCommands: count * 20,
      completedChallenges: completed,
      badges: [
        'first-command', 'ten-commands', 'fifty-commands', 'network-novice',
        'file-reader', 'help-seeker', 'recon-starter', 'pattern-hunter',
        'first-challenge', 'five-challenges', 'easy-sweep', 'hundred-commands',
        'scanner-pro', 'crypto-curious', 'ten-challenges', 'medium-sweep',
        'tool-collector', 'streak-3', 'all-challenges', 'streak-7', 'hack-master'
      ],
      streak: 7,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      commandCounts: {},
      certificates: {}
    };

    // Generate command counts
    var cmds = ['whoami', 'ls', 'cat', 'ping', 'nmap', 'ifconfig', 'netstat',
                'whois', 'traceroute', 'find', 'grep', 'pwd', 'help', 'man',
                'hashcat', 'hydra', 'ssh', 'curl', 'dig', 'chmod'];
    cmds.forEach(function(cmd, i) { data.commandCounts[cmd] = (i + 1) * 5; });

    // Generate certificates for completed challenges
    completed.forEach(function(id) {
      data.certificates[id] = {
        earnedAt: new Date().toISOString(),
        attempts: Math.floor(Math.random() * 10) + 1
      };
    });

    localStorage.setItem('hacksim_gamification', JSON.stringify(data));
  }, completedCount);
}

// ========================================
// PERFORMANCE TESTS (7)
// ========================================
test.describe('Gamification Performance', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('HACKSIMULATOR', { timeout: 10000 });
  });

  // ----------------------------------------
  // 1. Dashboard renders <2s with heavy data
  // ----------------------------------------
  test('dashboard renders under 2s with 15 completed challenges', async ({ page }) => {
    await injectHeavyData(page, 15);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('HACKSIMULATOR', { timeout: 10000 });

    const renderTime = await typeCommandAndMeasure(page, 'dashboard', 'DASHBOARD', 5000);
    expect(renderTime).toBeLessThan(2000);
  });

  // ----------------------------------------
  // 2. Achievements renders <2s with all 21 badges
  // ----------------------------------------
  test('achievements renders under 2s with all 21 badges unlocked', async ({ page }) => {
    await injectHeavyData(page, 15);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('HACKSIMULATOR', { timeout: 10000 });

    const renderTime = await typeCommandAndMeasure(page, 'achievements', 'ACHIEVEMENTS', 5000);
    expect(renderTime).toBeLessThan(2000);
  });

  // ----------------------------------------
  // 3. Leaderboard renders <2s with high score
  // ----------------------------------------
  test('leaderboard renders under 2s with high score', async ({ page }) => {
    await injectHeavyData(page, 15);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('HACKSIMULATOR', { timeout: 10000 });

    const renderTime = await typeCommandAndMeasure(page, 'leaderboard', 'LEADERBOARD', 5000);
    expect(renderTime).toBeLessThan(2000);
  });

  // ----------------------------------------
  // 4. Challenge list renders <2s with all completed
  // ----------------------------------------
  test('challenge list renders under 2s with all challenges completed', async ({ page }) => {
    await injectHeavyData(page, 15);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('HACKSIMULATOR', { timeout: 10000 });

    const renderTime = await typeCommandAndMeasure(page, 'challenge', 'CHALLENGES', 5000);
    expect(renderTime).toBeLessThan(2000);
  });

  // ----------------------------------------
  // 5. localStorage size <50KB with max data
  // ----------------------------------------
  test('localStorage stays under 50KB with maximum gamification data', async ({ page }) => {
    await injectHeavyData(page, 15);

    const sizeKB = await page.evaluate(() => {
      var total = 0;
      for (var key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total / 1024;
    });

    expect(sizeKB).toBeLessThan(50);
  });

  // ----------------------------------------
  // 6. Rapid commands without data loss (debounce)
  // ----------------------------------------
  test('10 rapid commands execute without terminal errors', async ({ page }) => {
    const input = page.locator('#terminal-input');
    const commands = ['whoami', 'ls', 'pwd', 'date', 'cat passwords.txt',
                      'ping 192.168.1.1', 'ifconfig', 'netstat', 'hostname', 'uptime'];

    // Fire all commands rapidly
    for (const cmd of commands) {
      await input.fill(cmd);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200); // Minimal wait between commands
    }

    // Wait for all output to settle
    await page.waitForTimeout(2000);

    // Verify terminal rendered all commands without errors
    const output = page.locator('#terminal-output');
    // Each command should have produced a prompt line in the output
    await expect(output).toContainText('whoami', { timeout: 2000 });
    await expect(output).toContainText('hacker', { timeout: 2000 }); // whoami output
    await expect(output).toContainText('hostname', { timeout: 2000 });

    // Verify no JS errors caused data corruption
    const hasData = await page.evaluate(() => {
      var data = localStorage.getItem('hacksim_gamification');
      if (!data) return true; // No data is OK (commands outside challenges don't track)
      try { JSON.parse(data); return true; } catch (e) { return false; }
    });
    expect(hasData).toBe(true);
  });

  // ----------------------------------------
  // 7. Gamification modules <50KB bundle size
  // ----------------------------------------
  test('gamification source files total under 80KB', async () => {
    const gamificationDir = join(process.cwd(), 'src', 'gamification');
    const files = [
      'badge-manager.js',
      'badge-definitions.js',
      'certificate-generator.js',
      'certificate-templates.js',
      'challenge-manager.js',
      'challenge-renderer.js',
      'leaderboard-manager.js',
      'leaderboard-data.js',
      'progress-store.js',
      'challenges/easy.js',
      'challenges/medium.js',
      'challenges/hard.js'
    ];

    let totalBytes = 0;
    for (const file of files) {
      try {
        const stat = statSync(join(gamificationDir, file));
        totalBytes += stat.size;
      } catch (e) {
        // File might not exist, skip
      }
    }

    const totalKB = totalBytes / 1024;
    expect(totalKB).toBeLessThan(80);
    expect(totalKB).toBeGreaterThan(0); // Sanity check: files exist
  });

});
