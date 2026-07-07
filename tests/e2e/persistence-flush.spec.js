// Persistence Flush-on-Hidden E2E Tests - HackSimulator.nl
// Created: 2026-07-07 (Sessie 197)
// Purpose: progress-store en persistence flushen hun 500ms-debounce niet alleen op
//   beforeunload (onbetrouwbaar op mobiel) maar ook op pagehide + visibilitychange
//   (hidden). Zo gaat een net-voltooide challenge / verse VFS-mutatie niet verloren
//   als de gebruiker de tab backgroundt of z'n telefoon loc't binnen het venster.

import { test, expect } from './fixtures.js';

// --- Helpers ---

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

async function typeCommand(page, command, wait = 350) {
  const input = page.locator('#terminal-input');
  await expect(input).toBeEnabled({ timeout: 15000 });
  await input.fill(command);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(wait);
}

async function bootClean(page, context) {
  await context.clearCookies();
  await page.goto('/terminal.html');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload();
  await acceptLegalModal(page);
  await expect(page.locator('#terminal-input')).toBeVisible({ timeout: 10000 });
}

// Simuleer een app-switch / scherm-lock op mobiel: visibilityState -> hidden + event.
async function goHidden(page) {
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(50);
}

async function completedChallenges(page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem('hacksim_gamification');
    return raw ? (JSON.parse(raw).completedChallenges || []) : [];
  });
}

test.describe('Persistence flush-on-hidden', () => {

  test('challenge-voltooiing overleeft visibilitychange(hidden) binnen debounce-venster', async ({ page, context }) => {
    await bootClean(page, context);

    await typeCommand(page, 'challenge start network-scout');
    await typeCommand(page, 'ping 192.168.1.1');
    await typeCommand(page, 'nmap 192.168.1.1', 100); // completes; ~100ms < 500ms debounce

    // Binnen het venster is de voltooiing nog niet naar disk (debounce loopt nog).
    const before = await completedChallenges(page);
    expect(before).not.toContain('network-scout');

    // App-switch/scherm-lock → flush.
    await goHidden(page);

    const after = await completedChallenges(page);
    expect(after).toContain('network-scout');
  });

  test('VFS-mutatie overleeft visibilitychange(hidden) binnen debounce-venster', async ({ page, context }) => {
    await bootClean(page, context);

    await typeCommand(page, 'touch flush-regressie.txt', 100);
    await goHidden(page);

    const persisted = await page.evaluate(() => {
      const raw = localStorage.getItem('hacksim_filesystem');
      return raw ? /flush-regressie\.txt/.test(raw) : false;
    });
    expect(persisted).toBe(true);
  });
});
