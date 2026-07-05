// VFS Schema-Versioning E2E Tests - HackSimulator.nl
// Created: 2026-07-05 (Sessie 194)
// Purpose: hacksim_filesystem draagt een content-signature (base) van de initiële
//   boom. Een save van vóór een structure.js-wijziging wordt bij load verworpen
//   (verse boom + eenmalige notice) zodat deploys terugkerende bezoekers bereiken.
//   Een save mét matchende signature blijft gewoon werken (user-files overleven).

import { test, expect } from './fixtures.js';

const RESET_NOTICE = 'De oefenomgeving is bijgewerkt';

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
  await expect(input).toBeEnabled({ timeout: 15000 }); // first visit: wacht op typewriter
  await input.fill(command);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
}

async function bootClean(page, context) {
  await context.clearCookies();
  await page.goto('/terminal.html');
  await clearStorage(page);
  await page.reload();
  await acceptLegalModal(page);
  await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });
}

test.describe('VFS schema-versioning', () => {

  test('save met matchende signature: user-file overleeft reload, geen notice', async ({ page, context }) => {
    await bootClean(page, context);

    // Maak een eigen bestand en laat de debounced save (1000ms) landen.
    await typeCommand(page, 'touch mijn-eigen-bestand.txt');
    await page.waitForTimeout(1500);

    // De save draagt de signature.
    const saved = await page.evaluate(() => {
      const raw = localStorage.getItem('hacksim_filesystem');
      return raw ? JSON.parse(raw) : null;
    });
    expect(saved).not.toBeNull();
    expect(typeof saved.base).toBe('string');
    expect(saved.base.length).toBeGreaterThan(0);

    // Reload: save wordt geaccepteerd → user-file terug, géén reset-notice.
    await page.reload();
    await acceptLegalModal(page);
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('hacksim.lab', { timeout: 10000 });
    await page.waitForTimeout(1000); // ruim na het 100ms-notice-venster
    await expect(output).not.toContainText(RESET_NOTICE);

    await typeCommand(page, 'ls');
    await expect(output).toContainText('mijn-eigen-bestand.txt', { timeout: 3000 });
  });

  test('stale save (zonder signature) wordt verworpen: verse boom + eenmalige notice', async ({ page, context }) => {
    await bootClean(page, context);

    // Flip de first-visit-flag zonder VFS-mutatie (geen pending save die de seed
    // bij reload zou overschrijven).
    await typeCommand(page, 'whoami');

    // Seed een pre-versioning save: geen base-veld, afwijkende wereld
    // (alleen een marker-bestand; README.txt/notes.txt ontbreken).
    await page.evaluate(() => {
      localStorage.setItem('hacksim_filesystem', JSON.stringify({
        fs: {
          '/': {
            type: 'directory',
            children: {
              home: {
                type: 'directory',
                children: {
                  hacker: {
                    type: 'directory',
                    children: {
                      'stale-marker.txt': { type: 'file', content: 'oude wereld' }
                    }
                  }
                }
              }
            }
          }
        },
        cwd: '/home/hacker'
      }));
    });

    await page.reload();
    await acceptLegalModal(page);
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('hacksim.lab', { timeout: 10000 });

    // Notice legt de vernieuwing uit.
    await expect(output).toContainText(RESET_NOTICE, { timeout: 5000 });

    // De stale key is opgeruimd (reset herhaalt niet elke boot).
    const staleKey = await page.evaluate(() => localStorage.getItem('hacksim_filesystem'));
    expect(staleKey).toBeNull();

    // De wereld is vers: initiële bestanden terug, marker weg.
    await typeCommand(page, 'ls');
    await expect(output).toContainText('README.txt', { timeout: 3000 });
    await expect(output).toContainText('notes.txt', { timeout: 3000 });
    await expect(output).not.toContainText('stale-marker.txt');
  });

  test('verse bezoeker zonder save: geen notice (geen save ≠ stale save)', async ({ page, context }) => {
    await bootClean(page, context);

    const output = page.locator('#terminal-output');
    await page.waitForTimeout(1000);
    await expect(output).not.toContainText(RESET_NOTICE);
  });
});
