// Leerpad Deep-Link E2E Tests - HackSimulator.nl
// Created: 2026-06-30 (Sessie 189 — Fase A)
// Purpose: ?tutorial=<id> deep-link auto-start vanaf de homepage-leerpad-knoppen.
//   Een geldige deep-link landt direct in de MISSION BRIEFING van de juiste missie,
//   met de input klaar; de URL wordt gestript; een onbekende id is een stille no-op.

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
    await expect(legalModal).toBeVisible({ timeout: 3000 });
    await page.click('#legal-accept-btn');
    await expect(legalModal).toBeHidden();
  } catch {
    // Modal al weg of niet aanwezig — doorgaan.
  }
}

// Laad de terminal als first-time visitor met een schone storage, op de
// gegeven (deep-link) URL, en accepteer de legal modal.
async function bootDeepLink(page, context, url) {
  await context.clearCookies();
  await page.goto('/terminal.html');
  await clearStorage(page);
  await page.goto(url);
  await acceptLegalModal(page);
}

// De drie homepage-niveaus → tutorial-id + verwachte briefing-tekst.
const LEVELS = [
  {
    niveau: 'Beginner',
    id: 'fundamentals',
    marker: 'Eerste dag als pentester',
  },
  {
    niveau: 'Gevorderd',
    id: 'recon',
    marker: 'SecureCorp',
  },
  {
    niveau: 'Expert',
    id: 'exploitation',
    marker: 'Server Compromise',
  },
];

test.describe('Leerpad deep-link auto-start', () => {

  for (const level of LEVELS) {
    test(`?tutorial=${level.id} landt in de MISSION BRIEFING (Niveau: ${level.niveau})`, async ({ page, context }) => {
      await bootDeepLink(page, context, `/terminal.html?tutorial=${level.id}`);

      const output = page.locator('#terminal-output');

      // Briefing verschijnt automatisch (na typewriter + sequencer-delay).
      await expect(output).toContainText('MISSION BRIEFING', { timeout: 15000 });
      await expect(output).toContainText(`Niveau: ${level.niveau}`, { timeout: 3000 });
      await expect(output).toContainText(level.marker, { timeout: 3000 });

      // De objective van stap 1 hoort er ook te staan (briefing + eerste stap).
      await expect(output).toContainText('Stap 1/', { timeout: 3000 });

      // Input is klaar voor gebruik (geen dode input).
      const input = page.locator('#terminal-input');
      await expect(input).toBeEnabled();
      await expect(input).toBeFocused();

      // URL is opgeschoond → refresh herstart niet.
      expect(new URL(page.url()).search).toBe('');
    });
  }

  test('onbekende ?tutorial= is een stille no-op (geen briefing, URL ongemoeid)', async ({ page, context }) => {
    await bootDeepLink(page, context, '/terminal.html?tutorial=bestaatniet');

    const output = page.locator('#terminal-output');

    // Welcome rendert normaal; geen auto-briefing.
    await page.waitForTimeout(4000); // ruim na waar de typewriter+sequencer zou vuren
    await expect(output).not.toContainText('MISSION BRIEFING');

    // Ongeldige id → URL blijft staan (no-op is onzichtbaar, geen strip).
    expect(new URL(page.url()).searchParams.get('tutorial')).toBe('bestaatniet');
  });

  test('gewone /terminal.html start geen tutorial', async ({ page, context }) => {
    await bootDeepLink(page, context, '/terminal.html');

    const output = page.locator('#terminal-output');

    await page.waitForTimeout(4000);
    await expect(output).not.toContainText('MISSION BRIEFING');
  });
});
