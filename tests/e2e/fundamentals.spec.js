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

    // Regression (Sessie 190/191): on the tutorial's final command the onboarding
    // "Type 'next'" nudge must NOT leak next to the completion follow-up. The
    // completion CTA (Sessie 191 copy) appears exactly once, and the old onboarding
    // nudge string must be absent entirely — proving no duplicate "next" prompt.
    await expect(
      output.locator('.terminal-line', { hasText: "Typ 'next' en ik wijs je naar je volgende missie" })
    ).toHaveCount(1);
    await expect(
      output.locator('.terminal-line', { hasText: "voor je volgende stap" })
    ).toHaveCount(0);

    // Sessie 192: the ~20-line certificate is NOT auto-rendered in the completion
    // block (it buried the next-step CTA below the fold). It stays on the clipboard
    // and is viewable on demand. The follow-up points there instead.
    await expect(output).not.toContainText('CERTIFICAAT VAN VOLTOOIING');
    await expect(
      output.locator('.terminal-line', { hasText: "typ 'tutorial cert' om het te bekijken" })
    ).toHaveCount(1);

    // ...and 'tutorial cert' still shows the full certificate on demand.
    await typeCommand(page, 'tutorial cert');
    await expect(output).toContainText('CERTIFICAAT VAN VOLTOOIING', { timeout: 5000 });
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

  // ----------------------------------------
  // Group 4: Eén ladder — leerpad tiers + missie-bruggen + challenge NL
  // ----------------------------------------

  test('leerpad groups phases under the 3 tiers and bridges to the missions', async ({ page }) => {
    await typeCommand(page, 'leerpad');
    const output = page.locator('#terminal-output');

    // Dezelfde 3-niveau-taal als homepage + tutorial
    await expect(output).toContainText('BEGINNER', { timeout: 5000 });
    await expect(output).toContainText('GEVORDERD', { timeout: 2000 });
    await expect(output).toContainText('EXPERT', { timeout: 2000 });
    // Fase-namen behouden (informatiever dan kale tiers)
    await expect(output).toContainText('FASE 1: TERMINAL BASICS', { timeout: 2000 });
    // Brug van oefenen (leerpad) naar de begeleide missie (tutorial)
    await expect(output).toContainText('Begeleide missie: tutorial fundamentals', { timeout: 2000 });
    await expect(output).toContainText('Begeleide missie: tutorial recon', { timeout: 2000 });
  });

  test('challenge difficulty labels are Dutch (UI=NL), not English', async ({ page }) => {
    await typeCommand(page, 'challenge');
    const output = page.locator('#terminal-output');

    await expect(output).toContainText('CHALLENGES', { timeout: 5000 });
    await expect(output).toContainText('MAKKELIJK', { timeout: 2000 });
    await expect(output).toContainText('GEMIDDELD', { timeout: 2000 });
    await expect(output).toContainText('MOEILIJK', { timeout: 2000 });
  });

  test('homepage leerpad chips contain no fictional commands', async ({ page }) => {
    await page.goto('/index.html');
    const section = page.locator('#leerpad');
    await expect(section).toBeVisible({ timeout: 5000 });
    const chips = (await section.locator('.leerpad-cmd-line').allInnerTexts()).join(' ');
    // netcat/wireshark bestaan niet als commando in de simulator
    expect(chips).not.toMatch(/netcat|wireshark/i);
    // echte commando's op de juiste tier
    expect(chips).toContain('netstat');
    expect(chips).toContain('nikto');
  });

  // ----------------------------------------
  // Group: omgevings-robuustheid (Sessie 193+ — bugs F/G, scenario setup())
  // ----------------------------------------

  async function runAllSevenSteps(page) {
    await typeCommand(page, 'pwd');
    await typeCommand(page, 'ls');
    await typeCommand(page, 'cd documents');
    await typeCommand(page, 'cat scan-results.txt');
    await typeCommand(page, 'mkdir bevindingen');
    await typeCommand(page, 'touch notes.txt');
    await typeCommand(page, 'rm notes.txt');
  }

  test('herhaalrun strandt niet: mkdir bevindingen slaagt opnieuw na een vorige run (bug F)', async ({ page }) => {
    test.setTimeout(60000);
    const output = page.locator('#terminal-output');

    // Run 1: volledig doorlopen — laat documents/bevindingen in de VFS achter.
    await typeCommand(page, 'tutorial fundamentals');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });
    await runAllSevenSteps(page);
    await expect(output).toContainText('MISSIE VOLTOOID', { timeout: 5000 });

    // Wis alleen de tutorial-state (VFS blijft, incl. bevindingen).
    await typeCommand(page, 'tutorial reset');

    // Run 2: setup() moet bevindingen opruimen zodat mkdir opnieuw "aangemaakt" geeft.
    await typeCommand(page, 'tutorial fundamentals');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });
    await runAllSevenSteps(page);
    await expect(output).toContainText('MISSIE VOLTOOID', { timeout: 5000 });
    // Nooit de "File exists"-strand op de mkdir-stap.
    await expect(output).not.toContainText('File exists');
  });

  test('cwd-drift breekt fundamentals niet: setup() normaliseert naar home (bug G)', async ({ page }) => {
    const output = page.locator('#terminal-output');

    // Drift: verplaats de cwd wég van home vóór de missie start.
    await typeCommand(page, 'cd /var/log');

    await typeCommand(page, 'tutorial fundamentals');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // De relatief-pad-stappen (cd documents / cat) moeten nu gewoon slagen.
    await typeCommand(page, 'pwd');
    await typeCommand(page, 'ls');
    await typeCommand(page, 'cd documents');
    await typeCommand(page, 'cat scan-results.txt');
    // Bereikt stap 5 zonder strand op stap 3/4.
    await expect(output).toContainText('Stap 5/7', { timeout: 5000 });
  });
});
