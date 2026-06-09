// Tutorial Gesture E2E Tests - HackSimulator.nl
// Created: 2026-06-09 (Sessie 156)
// Purpose: Test M6 long-press hint gesture on mobile touch-enabled context
// Covers: long-press triggers hint, short tap no-op, scroll-cancel,
//         no-tutorial no-op, modal-active no-op

import { test as base, expect } from './fixtures.js';
import { devices } from '@playwright/test';

// Re-extend with iPhone 13 device emulation (hasTouch + isMobile + 390x844 viewport)
const test = base.extend({});
test.use({ ...devices['iPhone 13'] });

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
    // Already dismissed
  }
}

async function typeCommand(page, command) {
  const input = page.locator('#terminal-input');
  await input.fill(command);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
}

/**
 * Dispatch a synthetic touch event on #terminal-output.
 *
 * Workaround: Chromium blocks `new Touch()` and `new TouchEvent()` constructors
 * (even with hasTouch:true). We dispatch a generic Event with the touch-type
 * string and attach touches/changedTouches as defined properties. The gesture
 * handler matches by event.type and reads e.touches[0].clientX as plain props.
 */
async function dispatchTouch(page, eventType, x, y) {
  await page.evaluate(({ eventType, x, y }) => {
    const target = document.getElementById('terminal-output');
    if (!target) return;
    const touchObj = {
      identifier: 0,
      target,
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y,
      screenX: x,
      screenY: y
    };
    const isEnd = eventType === 'touchend' || eventType === 'touchcancel';
    const event = new Event(eventType, { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'touches', { value: isEnd ? [] : [touchObj] });
    Object.defineProperty(event, 'targetTouches', { value: isEnd ? [] : [touchObj] });
    Object.defineProperty(event, 'changedTouches', { value: [touchObj] });
    target.dispatchEvent(event);
  }, { eventType, x, y });
}

// ========================================
// TUTORIAL GESTURE TESTS (5)
// ========================================
test.describe('Tutorial Gestures (long-press hint)', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });
  });

  test('long-press triggers hint during active recon tutorial', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 5000 });

    await dispatchTouch(page, 'touchstart', 200, 300);
    await page.waitForTimeout(650); // > LONG_PRESS_MS (500)
    await dispatchTouch(page, 'touchend', 200, 300);

    await expect(page.locator('#terminal-output')).toContainText('[?] Hint', { timeout: 3000 });
  });

  test('short tap (<500ms) does NOT trigger hint', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 5000 });

    await dispatchTouch(page, 'touchstart', 200, 300);
    await page.waitForTimeout(200); // < LONG_PRESS_MS
    await dispatchTouch(page, 'touchend', 200, 300);
    await page.waitForTimeout(700); // wait past timer to confirm no fire

    const output = await page.locator('#terminal-output').textContent();
    expect(output).not.toContain('[?] Hint');
  });

  test('long-press with movement >10px cancels (scroll-gesture)', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 5000 });

    await dispatchTouch(page, 'touchstart', 200, 300);
    await page.waitForTimeout(100);
    // Simulate scroll movement (50px down — over MOVE_TOLERANCE_PX=10)
    await dispatchTouch(page, 'touchmove', 200, 360);
    await page.waitForTimeout(600); // past long-press threshold
    await dispatchTouch(page, 'touchend', 200, 360);

    const output = await page.locator('#terminal-output').textContent();
    expect(output).not.toContain('[?] Hint');
  });

  test('long-press when NO tutorial active is no-op', async ({ page }) => {
    // No tutorial start command — gesture should be silent
    await dispatchTouch(page, 'touchstart', 200, 300);
    await page.waitForTimeout(650);
    await dispatchTouch(page, 'touchend', 200, 300);

    const output = await page.locator('#terminal-output').textContent();
    expect(output).not.toContain('[?] Hint');
    expect(output).not.toContain('Geen actieve tutorial');
  });

  test('long-press while modal is active is no-op (Sessie 77 modal-protection)', async ({ page }) => {
    await typeCommand(page, 'tutorial recon');
    await expect(page.locator('#terminal-output')).toContainText('MISSION BRIEFING', { timeout: 5000 });

    // Inject a fake .modal.active to simulate modal state without opening real modal
    await page.evaluate(() => {
      const fake = document.createElement('div');
      fake.className = 'modal active';
      fake.id = 'test-fake-modal';
      fake.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
      document.body.appendChild(fake);
    });

    // Capture output BEFORE gesture to compare delta
    const before = await page.locator('#terminal-output').textContent();

    await dispatchTouch(page, 'touchstart', 200, 300);
    await page.waitForTimeout(650);
    await dispatchTouch(page, 'touchend', 200, 300);

    const after = await page.locator('#terminal-output').textContent();

    // Remove fake modal for cleanup
    await page.evaluate(() => {
      const fake = document.getElementById('test-fake-modal');
      if (fake) fake.remove();
    });

    // Output should NOT have grown with hint text
    expect(after).toBe(before);
  });
});
