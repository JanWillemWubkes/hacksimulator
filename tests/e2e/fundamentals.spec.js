// Fundamentals Tutorial + Re-tiering E2E Tests - HackSimulator.nl
// Created: 2026-06-30 (Sessie 187 — Fase B: badge == bestemming)
// Purpose: Verify the NEW fundamentals scenario (BEGINNER deep-link target),
//          the 4 re-tiered difficulty labels, and the next.js funnel ordering.

import { test, expect } from './fixtures.js';

// --- Helpers (mirror tutorial.spec.js) ---

async function clearStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

async function acceptLegalModal(page) {
  const legalModal = page.locator('#legal-modal');
  const isVisible = await legalModal.isVisible().catch(() => false);
  if (isVisible) {
    await page.click('#legal-accept-btn');
    await expect(legalModal).toBeHidden();
  } else {
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

test.describe('Fundamentals Tutorial + Re-tiering', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
  });

  // ----------------------------------------
  // Group 1: Fundamentals scenario lifecycle
  // ----------------------------------------

  test('fundamentals scenario starts with briefing at Beginner level', async ({ page }) => {
    await typeCommand(page, 'tutorial fundamentals');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });
    // Beginner level + 7 steps
    await expect(output).toContainText('Niveau: Beginner', { timeout: 2000 });
    await expect(output).toContainText('Stappen: 7', { timeout: 2000 });
    // First step objective mentions pwd
    await expect(output).toContainText('pwd', { timeout: 2000 });
  });

  test('first correct command (pwd) advances to ls step', async ({ page }) => {
    await typeCommand(page, 'tutorial fundamentals');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    await typeCommand(page, 'pwd');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('Correct', { timeout: 5000 });
    // Next step objective mentions ls
    await expect(output).toContainText('ls', { timeout: 2000 });
  });

  test('completing all 7 fundamentals steps shows completion', async ({ page }) => {
    test.setTimeout(60000);

    await typeCommand(page, 'tutorial fundamentals');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Step 1: pwd (orientation)
    await typeCommand(page, 'pwd');
    await page.waitForTimeout(300);
    // Step 2: ls (look around)
    await typeCommand(page, 'ls');
    await page.waitForTimeout(300);
    // Step 3: cd documents (navigate)
    await typeCommand(page, 'cd documents');
    await page.waitForTimeout(300);
    // Step 4: cat scan-results.txt (read — file lives in documents/)
    await typeCommand(page, 'cat scan-results.txt');
    await page.waitForTimeout(300);
    // Step 5: mkdir (create a directory)
    await typeCommand(page, 'mkdir bevindingen');
    await page.waitForTimeout(300);
    // Step 6: touch (create a file)
    await typeCommand(page, 'touch notes.txt');
    await page.waitForTimeout(300);
    // Step 7: rm (clean up)
    await typeCommand(page, 'rm notes.txt');

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSIE VOLTOOID', { timeout: 5000 });
    await expect(output).toContainText('Goed gedaan', { timeout: 2000 });
  });

  test('wrong argument gives differentiated (not "wrong command") feedback', async ({ page }) => {
    await typeCommand(page, 'tutorial fundamentals');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Advance past pwd/ls to the cd step
    await typeCommand(page, 'pwd');
    await page.waitForTimeout(300);
    await typeCommand(page, 'ls');
    await page.waitForTimeout(300);

    // cd to the wrong directory → correct command, wrong argument
    await typeCommand(page, 'cd /etc');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Goed commando', { timeout: 5000 });
  });

  // ----------------------------------------
  // Group 2: Re-tiering (badge == bestemming)
  // ----------------------------------------

  test('tutorial list lists fundamentals first at Beginner', async ({ page }) => {
    await typeCommand(page, 'tutorial');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('TUTORIALS', { timeout: 5000 });
    await expect(output).toContainText('fundamentals', { timeout: 2000 });
    await expect(output).toContainText('Niveau: Beginner', { timeout: 2000 });
  });

  test('re-tiered labels: Gevorderd and Expert appear in the scenario list', async ({ page }) => {
    await typeCommand(page, 'tutorial');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('TUTORIALS', { timeout: 5000 });
    // recon/privesc are now Gevorderd; webvuln/exploitation are now Expert.
    // Before Fase B there was no "Expert" anywhere → this guards the re-tiering.
    await expect(output).toContainText('Niveau: Gevorderd', { timeout: 2000 });
    await expect(output).toContainText('Niveau: Expert', { timeout: 2000 });
  });

  // ----------------------------------------
  // Group 3: Funnel ordering (next.js)
  // ----------------------------------------

  test('next suggests the fundamentals mission for a brand-new user', async ({ page }) => {
    await typeCommand(page, 'next');
    const output = page.locator('#terminal-output');

    // Funnel stage 0 = fundamentals tutorial (before the phase-1 command grind)
    await expect(output).toContainText('tutorial fundamentals', { timeout: 5000 });
  });
});
