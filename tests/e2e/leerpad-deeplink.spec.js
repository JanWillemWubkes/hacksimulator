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

// --- Fase 1: coherentie tussen welcome-CTA, resume en deep-link (Sessie 193+) ---

async function typeCommand(page, command) {
  const input = page.locator('#terminal-input');
  await input.fill(command);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
}

test.describe('Deep-link / welcome-coherentie', () => {

  test('first-visit deep-link: geen concurrerende "next"-CTA, geen simulator-hint-leak, neutrale placeholder', async ({ page, context }) => {
    await bootDeepLink(page, context, '/terminal.html?tutorial=fundamentals');

    const output = page.locator('#terminal-output');

    // Briefing komt op; de welcome-CTA is vervangen door de gedempte "geladen"-regel.
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 15000 });
    await expect(output).toContainText('Je missie wordt geladen', { timeout: 3000 });

    // Geen tweede "wat nu?"-instructie: de "Typ 'next'"-welcome-CTA hoort weg te zijn.
    await expect(output).not.toContainText("Typ 'next' om te beginnen");
    // De simulator-command-hint mag niet onder de briefing lekken.
    await expect(output).not.toContainText('is een HackSimulator command');

    // Na de auto-start staat de placeholder op de neutrale variant, niet meer op "next".
    const input = page.locator('#terminal-input');
    await expect(input).toHaveAttribute('placeholder', 'Typ een command...');
  });

  test('deep-link naar ándere missie: geen stale hervat-tekst, wel transparante wissel', async ({ page, context }) => {
    // Start recon en zet één stap → recon staat op stap 2/4 in opslag.
    await bootDeepLink(page, context, '/terminal.html?tutorial=recon');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 15000 });
    await typeCommand(page, 'ping 192.168.1.100');
    await expect(output).toContainText('Stap 2/4', { timeout: 3000 });

    // Nu deep-linken naar fundamentals (terugkerende bezoeker met opgeslagen recon-voortgang).
    await page.goto('/terminal.html?tutorial=fundamentals');
    await acceptLegalModal(page);

    await expect(output).toContainText('MISSION BRIEFING', { timeout: 15000 });
    // De stale recon-hervat-melding mag NIET boven de nieuwe briefing staan.
    await expect(output).not.toContainText('Tutorial hervat');
    // Wel een transparante "vorige missie opgeslagen"-regel.
    await expect(output).toContainText('Vorige missie opgeslagen', { timeout: 3000 });
    // En de fundamentals-briefing zelf.
    await expect(output).toContainText('Eerste dag als pentester', { timeout: 3000 });
  });

  test('deep-link naar zélfde actieve missie: hervat zonder herstart (bug C)', async ({ page, context }) => {
    await bootDeepLink(page, context, '/terminal.html?tutorial=fundamentals');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 15000 });
    await typeCommand(page, 'pwd');
    await expect(output).toContainText('Stap 2/7', { timeout: 3000 });

    // Deep-link opnieuw naar fundamentals — mag NIET herstarten naar stap 0.
    await page.goto('/terminal.html?tutorial=fundamentals');
    await acceptLegalModal(page);

    // Hervat-melding op stap 2/7, geen nieuwe briefing.
    await expect(output).toContainText('Tutorial hervat', { timeout: 15000 });
    await expect(output).toContainText('stap 2/7', { timeout: 3000 });
    await expect(output).not.toContainText('MISSION BRIEFING');

    // Bewijs dat de voortgang niet gereset is: opslag houdt currentStep === 1 (stap 2/7).
    const savedStep = await page.evaluate(() => {
      const raw = localStorage.getItem('hacksim_tutorial_progress');
      return raw ? JSON.parse(raw).currentStep : null;
    });
    expect(savedStep).toBe(1);
  });
});
