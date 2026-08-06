// W2 Verification Tests — Sessie 209
// Bewijst de drie ongeteste terminal-wijzigingen uit de kwaliteitsronde:
//   (a) tutorial skip ×7 = DEELNAME, niet VOLTOOIING
//   (b) helpsysteem escaleert bij correct command + verkeerd argument
//   (c) bestaande localStorage-voortgang overleeft de leerpad-wijziging

import { test, expect } from './fixtures.js';

// --- Helpers (zelfde patroon als tutorial.spec.js) ---

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
    // Modal already dismissed or not present
  }
}

async function typeCommand(page, command) {
  const input = page.locator('#terminal-input');
  await input.fill(command);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
}

// ========================================
// (a) SKIP-CERTIFICAAT: DEELNAME vs VOLTOOIING
// ========================================
test.describe('W2a: Skip-certificaat onderscheid', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim', { timeout: 10000 });
  });

  test('7x skip geeft DEELNAME-certificaat, niet VOLTOOIING', async ({ page }) => {
    test.setTimeout(90000);
    const output = page.locator('#terminal-output');

    // Start fundamentals (7 stappen)
    await typeCommand(page, 'tutorial fundamentals');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Skip alle 7 stappen
    for (var i = 0; i < 7; i++) {
      await typeCommand(page, 'tutorial skip');
      await page.waitForTimeout(300);
    }

    // Completion box: moet DOORLOPEN zeggen, niet VOLTOOID
    await expect(output).toContainText('MISSIE DOORLOPEN', { timeout: 5000 });

    // Certificaat opvragen
    await typeCommand(page, 'tutorial cert');

    // Moet DEELNAME zeggen
    await expect(output).toContainText('CERTIFICAAT VAN DEELNAME', { timeout: 5000 });

    // Moet NIET VOLTOOIING zeggen (na de DEELNAME-tekst)
    const lastOutputText = await output.innerText();
    const certStart = lastOutputText.lastIndexOf('CERTIFICAAT VAN');
    const certSection = lastOutputText.substring(certStart);
    expect(certSection).not.toContain('VOLTOOIING');

    // Stappen: 0/7 voltooid
    await expect(output).toContainText('0/7', { timeout: 2000 });
  });

  test('mix van solve + skip geeft correct aantal in certificaat', async ({ page }) => {
    test.setTimeout(90000);
    const output = page.locator('#terminal-output');

    // Start fundamentals
    await typeCommand(page, 'tutorial fundamentals');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // Stap 1: los echt op (pwd)
    await typeCommand(page, 'pwd');
    await page.waitForTimeout(300);

    // Stap 2: los echt op (ls)
    await typeCommand(page, 'ls');
    await page.waitForTimeout(300);

    // Stap 3-7: skip (5 stappen)
    for (var i = 0; i < 5; i++) {
      await typeCommand(page, 'tutorial skip');
      await page.waitForTimeout(300);
    }

    // Completion box: DOORLOPEN (niet alle stappen opgelost)
    await expect(output).toContainText('MISSIE DOORLOPEN', { timeout: 5000 });

    // Certificaat
    await typeCommand(page, 'tutorial cert');
    await expect(output).toContainText('CERTIFICAAT VAN DEELNAME', { timeout: 5000 });

    // 2/7 voltooid (2 echt opgelost, 5 geskipt)
    await expect(output).toContainText('2/7', { timeout: 2000 });
  });
});

// ========================================
// (b) HELPSYSTEEM-ESCALATIE
// ========================================
test.describe('W2b: Helpsysteem-escalatie bij correct command + verkeerd argument', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim', { timeout: 10000 });
  });

  test('na 3x nmap zonder args verschijnt man-page-tip', async ({ page }) => {
    const output = page.locator('#terminal-output');

    // nmap zonder args: geeft "Usage:" output → _hasErrorOutput() = true
    await typeCommand(page, 'nmap');
    await typeCommand(page, 'nmap');

    // 3e keer: escalatie zou moeten vuren
    await typeCommand(page, 'nmap');

    // De tip: "Dit lukt nog niet. Typ 'man nmap' ..."
    await expect(output).toContainText("man nmap", { timeout: 3000 });
  });

  test('escalatie vuurt NIET tijdens een actieve tutorial', async ({ page }) => {
    const output = page.locator('#terminal-output');

    // Start een tutorial
    await typeCommand(page, 'tutorial recon');
    await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 });

    // 3x nmap zonder args tijdens tutorial
    await typeCommand(page, 'nmap');
    await typeCommand(page, 'nmap');
    await typeCommand(page, 'nmap');

    // Tip mag NIET verschijnen (tutorial heeft eigen hint-ladder)
    const text = await output.innerText();
    const afterBriefing = text.substring(text.lastIndexOf('MISSION BRIEFING'));
    expect(afterBriefing).not.toContain('Dit lukt nog niet');
  });
});

// ========================================
// (c) LOCALSTORAGE-VOORTGANG OVERLEEFT LEERPAD-WIJZIGING
// ========================================
test.describe('W2c: Bestaande voortgang overleeft leerpad-wijziging', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim', { timeout: 10000 });
  });

  test('pre-change voortgang (zonder stepsSolvedByScenario) werkt nog', async ({ page }) => {
    // Seed met oud formaat: completedScenarios bevat 'recon', maar GEEN
    // stepsSolvedByScenario-veld (dat bestond nog niet vóór de wijziging)
    await page.evaluate(() => {
      localStorage.setItem('hacksim_tutorial_progress', JSON.stringify({
        activeScenario: null,
        currentStep: 0,
        stepsSolved: 0,
        completedScenarios: ['recon'],
        hintCounts: {}
      }));
    });
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim', { timeout: 10000 });

    const output = page.locator('#terminal-output');

    // Leerpad moet recon nog als voltooid tonen
    await typeCommand(page, 'leerpad');
    await expect(output).toContainText('tutorial recon', { timeout: 5000 });

    // Certificaat moet VOLTOOIING zijn (fallback: alle stappen voltooid)
    await typeCommand(page, 'tutorial cert');
    await expect(output).toContainText('CERTIFICAAT VAN VOLTOOIING', { timeout: 5000 });
  });

  test('bestaande onboarding-voortgang overleeft reload', async ({ page }) => {
    // Voer een paar commands uit zodat onboarding-progress ontstaat
    await typeCommand(page, 'pwd');
    await typeCommand(page, 'ls');
    await typeCommand(page, 'whoami');

    // Wacht op debounced save
    await expect.poll(async () => {
      return page.evaluate(() => localStorage.getItem('hacksim_onboarding'));
    }, { timeout: 5000 }).toBeTruthy();

    // Reload
    await page.reload();
    await acceptLegalModal(page);
    await expect(page.locator('#terminal-output')).toContainText('hacksim', { timeout: 10000 });

    const output = page.locator('#terminal-output');

    // Leerpad moet de drie commands als afgevinkt tonen
    await typeCommand(page, 'leerpad');

    // Controleer dat pwd, ls, whoami als geprobeerd staan (vinkjes)
    const leerpadText = await output.innerText();
    const leerpadSection = leerpadText.substring(leerpadText.lastIndexOf('LEERPAD'));
    expect(leerpadSection).toContain('pwd');
    expect(leerpadSection).toContain('ls');
  });
});
