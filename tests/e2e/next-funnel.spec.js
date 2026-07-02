// Next Funnel E2E Tests - HackSimulator.nl
// Created: 2026-07-02 (Sessie 193 — funnel-suggesties letterlijk uitvoerbaar + tracking valideert)
// Purpose: Guard against two related bugs:
//   1. `next` suggereerde commando's met bestanden die niet (overal) bestaan
//      (cp notes.txt backup.txt / mv old.txt new.txt) — elke suggestie moet
//      letterlijk uitvoerbaar zijn vanuit de cwd waar de funnel de gebruiker
//      achterlaat (~/documents na fundamentals).
//   2. Gefaalde cp/mv werden tóch afgevinkt in commandsTried (leerpad-vinkje
//      + milestone-teller) via het ongevalideerde fallback-pad in
//      _shouldTrackCommand (terminal.js).

import { test, expect } from './fixtures.js';

const ERROR_PATTERNS = [
  /cannot stat/i,
  /No such file or directory/i,
  /missing .*operand/i,
  /Not a directory/i
];

// --- Helpers (mirror fundamentals.spec.js) ---

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

async function getOutputText(page) {
  return page.locator('#terminal-output').innerText();
}

async function getOnboardingState(page) {
  return page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('hacksim_onboarding') || '{}');
    } catch {
      return {};
    }
  });
}

test.describe('Next funnel — tracking valideert succes', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
  });

  test('gefaalde cp wordt NIET afgevinkt, geslaagde cp wel', async ({ page }) => {
    await typeCommand(page, 'cp bestaat-niet.txt x.txt');
    await expect(page.locator('#terminal-output')).toContainText('cannot stat', { timeout: 5000 });

    let state = await getOnboardingState(page);
    expect(state.commandsTried || []).not.toContain('cp');

    await typeCommand(page, 'cp ~/notes.txt ~/kopie.txt');
    await expect(page.locator('#terminal-output')).toContainText('gekopieerd', { timeout: 5000 });

    state = await getOnboardingState(page);
    expect(state.commandsTried).toContain('cp');
  });

  test('gefaalde mv wordt NIET afgevinkt, geslaagde mv wel', async ({ page }) => {
    await typeCommand(page, 'mv bestaat-niet.txt x.txt');
    await expect(page.locator('#terminal-output')).toContainText('cannot stat', { timeout: 5000 });

    let state = await getOnboardingState(page);
    expect(state.commandsTried || []).not.toContain('mv');

    // Chain zoals de funnel: eerst een kopie maken, dan hernoemen
    await typeCommand(page, 'cp ~/notes.txt ~/kopie.txt');
    await typeCommand(page, 'mv ~/kopie.txt ~/archief.txt');
    await expect(page.locator('#terminal-output')).toContainText('verplaatst', { timeout: 5000 });

    state = await getOnboardingState(page);
    expect(state.commandsTried).toContain('mv');
  });
});

test.describe('Next funnel — elke suggestie is letterlijk uitvoerbaar', () => {

  test('Fase 2 suggesties slagen vanuit ~/documents (post-fundamentals staat)', async ({ page, context }) => {
    test.setTimeout(60000);
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);

    // Seed: de staat van een gebruiker die net fundamentals afrondde.
    // Fundamentals dekt pwd/ls/cd/cat/mkdir/touch/rm en laat cwd in
    // ~/documents achter → funnel staat op Fase 2 bij 'cp' (het bug-scenario).
    await page.evaluate(() => {
      localStorage.setItem('hacksim_tutorial_progress', JSON.stringify({
        activeScenario: null,
        currentStep: 0,
        completedScenarios: ['fundamentals'],
        attempts: {}
      }));
      localStorage.setItem('hacksim_onboarding', JSON.stringify({
        firstVisit: false,
        commandCount: 9,
        commandsTried: ['pwd', 'ls', 'cd', 'cat', 'mkdir', 'touch', 'rm']
      }));
    });
    await page.reload();
    await acceptLegalModal(page);

    // Het probleem-cwd waar fundamentals de gebruiker achterlaat
    await typeCommand(page, 'cd ~/documents');

    const executed = [];
    for (let i = 0; i < 8; i++) {
      const beforeNext = (await getOutputText(page)).length;
      await typeCommand(page, 'next');
      const newNextOutput = (await getOutputText(page)).slice(beforeNext);

      // Fase-transitie (bijv. "FASE 2 VOLTOOID!") viert eerst en vraagt om
      // nogmaals 'next' — geen suggestie in deze iteratie, loop door
      if (newNextOutput.includes('VOLTOOID!')) continue;

      const matches = [...newNextOutput.matchAll(/\[->\] Type '([^']+)'/g)];
      expect(matches.length, `'next' toonde geen suggestie (iteratie ${i})`).toBeGreaterThan(0);
      const suggestion = matches[matches.length - 1][1];

      // Funnel wijst naar een missie/challenge → Fase 2 is afgerond
      if (suggestion.startsWith('tutorial') || suggestion.startsWith('challenge')) break;

      const beforeCmd = (await getOutputText(page)).length;
      await typeCommand(page, suggestion);
      const cmdOutput = (await getOutputText(page)).slice(beforeCmd);
      for (const pattern of ERROR_PATTERNS) {
        expect(cmdOutput, `Suggestie '${suggestion}' faalde bij letterlijk uitvoeren`).not.toMatch(pattern);
      }
      executed.push(suggestion);
    }

    // Verwachte keten: cp → mv → echo, daarna wijst de funnel naar de recon-missie
    expect(executed).toEqual([
      "cp ~/notes.txt ~/kopie.txt",
      "mv ~/kopie.txt ~/archief.txt",
      'echo "hello world"'
    ]);
  });
});
