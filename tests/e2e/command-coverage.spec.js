// Command Coverage E2E Tests - HackSimulator.nl
// Created: 2026-02-23
// Purpose: Cover commands without dedicated E2E tests
// Commands tested: pwd, date, man, history, find, grep, ifconfig, netstat

import { test, expect } from './fixtures.js';

// --- Helpers ---

async function clearStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

async function acceptLegalModal(page) {
  // After clearStorage + reload, legal modal always appears
  const legalModal = page.locator('#legal-modal');
  await expect(legalModal).toBeVisible({ timeout: 10000 });
  await page.locator('#legal-accept-btn').click();
  await expect(legalModal).toBeHidden({ timeout: 5000 });
}

async function typeCommand(page, command) {
  const input = page.locator('#terminal-input');
  await input.fill(command);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
}

// ========================================
// COMMAND COVERAGE TESTS
// ========================================
test.describe('Command Coverage - Untested Commands', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/terminal.html');
    await clearStorage(page);
    await page.reload();
    await acceptLegalModal(page);
    // Wait for terminal to fully initialize (welcome banner renders)
    await expect(page.locator('#terminal-output')).toContainText('hacksim.lab', { timeout: 10000 });
  });

  // ----------------------------------------
  // 1. pwd - Print Working Directory
  // ----------------------------------------
  test('pwd returns current working directory', async ({ page }) => {
    await typeCommand(page, 'pwd');
    await expect(page.locator('#terminal-output')).toContainText('/home/hacker', { timeout: 5000 });
  });

  test('pwd reflects directory change after cd', async ({ page }) => {
    await typeCommand(page, 'cd /etc');
    await typeCommand(page, 'pwd');
    // Prompt should show /etc after cd, and pwd outputs /etc
    await expect(page.locator('#terminal-output')).toContainText('/etc', { timeout: 5000 });
  });

  // ----------------------------------------
  // 2. date - Display Date/Time
  // ----------------------------------------
  test('date returns current date string', async ({ page }) => {
    await typeCommand(page, 'date');
    // JavaScript Date.toString() always contains GMT
    await expect(page.locator('#terminal-output')).toContainText('GMT', { timeout: 5000 });
  });

  // ----------------------------------------
  // 3. man - Manual Pages
  // ----------------------------------------
  test('man without args shows usage hint', async ({ page }) => {
    await typeCommand(page, 'man');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('man [command]', { timeout: 5000 });
    await expect(output).toContainText('TIP', { timeout: 2000 });
  });

  test('man nmap shows manual page with content', async ({ page }) => {
    await typeCommand(page, 'man nmap');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('NMAP', { timeout: 5000 });
    await expect(output).toContainText('BESCHRIJVING', { timeout: 2000 });
  });

  test('man nonexistent shows helpful error', async ({ page }) => {
    await typeCommand(page, 'man fakecmd');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Geen manual entry', { timeout: 5000 });
  });

  // ----------------------------------------
  // 4. history - Command History
  // ----------------------------------------
  test('history shows previously executed commands', async ({ page }) => {
    await typeCommand(page, 'whoami');
    await typeCommand(page, 'pwd');
    await typeCommand(page, 'history');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('whoami', { timeout: 5000 });
  });

  // ----------------------------------------
  // 5. find - Search Files by Name
  // ----------------------------------------
  test('find passwd locates password file', async ({ page }) => {
    await typeCommand(page, 'find passwd');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('/etc/passwd', { timeout: 5000 });
  });

  test('find without args shows usage error', async ({ page }) => {
    await typeCommand(page, 'find');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('missing', { timeout: 5000 });
  });

  // ----------------------------------------
  // 6. grep - Search File Contents
  // ----------------------------------------
  test('grep root /etc/passwd finds root user', async ({ page }) => {
    await typeCommand(page, 'grep root /etc/passwd');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('root', { timeout: 5000 });
  });

  test('grep without enough args shows usage error', async ({ page }) => {
    await typeCommand(page, 'grep');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('missing', { timeout: 5000 });
  });

  // ----------------------------------------
  // 7. ifconfig - Network Configuration
  // ----------------------------------------
  test('ifconfig shows network interfaces', async ({ page }) => {
    await typeCommand(page, 'ifconfig');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('eth0', { timeout: 5000 });
    await expect(output).toContainText('127.0.0.1', { timeout: 2000 });
  });

  // ----------------------------------------
  // 8. netstat - Network Statistics
  // ----------------------------------------
  test('netstat shows network connections', async ({ page }) => {
    await typeCommand(page, 'netstat');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Active Internet connections', { timeout: 5000 });
    await expect(output).toContainText('LISTEN', { timeout: 2000 });
  });

  // ----------------------------------------
  // 9. Consistentie-regressies (Sessie 195)
  // ----------------------------------------

  // Een gefaalde traceroute mag Fase 3 NIET afvinken. De tracking-guard
  // (_shouldTrackCommand) moet 'Failed to resolve' als fout herkennen.
  test('gefaalde traceroute wordt NIET afgevinkt in commandsTried', async ({ page }) => {
    await typeCommand(page, 'traceroute onzinhost123');
    const state = await page.evaluate(() => {
      try { return JSON.parse(localStorage.getItem('hacksim_onboarding') || '{}'); }
      catch { return {}; }
    });
    expect(state.commandsTried || []).not.toContain('traceroute');

    // Geslaagde traceroute wordt wél afgevinkt (controle dat de guard niet te streng is)
    await typeCommand(page, 'traceroute google.com');
    const state2 = await page.evaluate(() => {
      try { return JSON.parse(localStorage.getItem('hacksim_onboarding') || '{}'); }
      catch { return {}; }
    });
    expect(state2.commandsTried).toContain('traceroute');
  });

  // ----------------------------------------
  // 10. touch liegt niet over bestaande bestanden (Sessie 222)
  // ----------------------------------------

  // vfs.createFile() gaf undefined terug of het bestand nu nieuw was of niet, dus
  // touch meldde onvoorwaardelijk "aangemaakt". Op een bestaand bestand is dat een
  // verkeerde les: touch werkt daar alleen de tijdstempel bij.
  test('touch meldt bijwerken i.p.v. aanmaken bij een bestaand bestand', async ({ page }) => {
    await typeCommand(page, 'touch scan-log.txt');
    await expect(page.locator('#terminal-output')).toContainText("Bestand 'scan-log.txt' aangemaakt", { timeout: 5000 });

    // notes.txt zit in de initiële VFS (structure.js) en bestaat dus altijd al
    await typeCommand(page, 'touch notes.txt');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText("Tijdstempel van 'notes.txt' bijgewerkt", { timeout: 5000 });
    await expect(output).not.toContainText("Bestand 'notes.txt' aangemaakt");
  });

  // ----------------------------------------
  // 11. Geërfde Object-namen zijn geen bestanden (Sessie 222)
  // ----------------------------------------

  // vfs.js:146 deed `children[part]` op een object-literal, dus constructor/
  // toString/__proto__ waren truthy en werden als node behandeld. Gevolg: cat zei
  // "Is a directory", cd zei "Not a directory" — over hetzelfde niet-bestaande pad.
  test('cat/cd/ls geven consistent "No such file" op geërfde Object-namen', async ({ page }) => {
    const output = page.locator('#terminal-output');
    for (const cmd of ['cat constructor', 'cd constructor', 'ls toString']) {
      await typeCommand(page, cmd);
    }
    // Alle drie horen dezelfde reden te noemen; "Is a directory" impliceert bestaan.
    await expect(output).not.toContainText('Is a directory', { timeout: 5000 });
    await expect(output).not.toContainText('Not a directory');
    const text = await output.innerText();
    expect((text.match(/No such file or directory/g) || []).length).toBeGreaterThanOrEqual(3);
  });

  // rm doorliep getNode() met succes en meldde "[✓] verwijderd" terwijl de delete
  // een no-op was op een geërfde property.
  test('rm meldt geen succes voor een geërfde Object-naam', async ({ page }) => {
    await typeCommand(page, 'rm constructor');
    const output = page.locator('#terminal-output');
    await expect(output).toContainText('No such file or directory', { timeout: 5000 });
    await expect(output).not.toContainText("'constructor' verwijderd");
  });

  // __proto__ als bestandsnaam moet gewoon werken (zoals op Linux), niet het
  // prototype van de children-node vervangen. Vóór de fix meldde cp "[✓] gekopieerd"
  // terwijl het bestand nergens verscheen.
  test('__proto__ werkt als gewone bestandsnaam en breekt de VFS niet', async ({ page }) => {
    const output = page.locator('#terminal-output');
    await typeCommand(page, 'mkdir __proto__');
    // Niet op de losse tekst '__proto__' asserteren: de foutmelding van de oude
    // code ("cannot create directory '__proto__'") bevat die óók, waardoor deze
    // test groen bleef op een kapotte VFS. De succesmelding is het bewijs.
    await expect(output).toContainText("Directory '__proto__' aangemaakt", { timeout: 5000 });
    await expect(output).not.toContainText('cannot create directory');

    await typeCommand(page, 'ls');

    // De VFS blijft bruikbaar: een gewone kopie erna werkt nog steeds
    await typeCommand(page, 'cp notes.txt kopie.txt');
    await typeCommand(page, 'ls');
    await expect(output).toContainText('kopie.txt', { timeout: 5000 });

    const prototypeIntact = await page.evaluate(() => {
      const home = window.vfs && window.vfs.getNode('/home/hacker');
      if (!home) return null; // vfs niet globaal — dan zegt de ls-assertie het al
      return Object.getPrototypeOf(home.children) === Object.prototype;
    });
    if (prototypeIntact !== null) expect(prototypeIntact).toBe(true);
  });

  // hint is een simulator-only command → moet met '*' gemarkeerd worden in help.
  test("help markeert simulator-only commands (hint) met *", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await typeCommand(page, 'help');
    const text = await page.locator('#terminal-output').innerText();
    // De renderer zet '*' direct vóór de commandonaam voor simulator-commands
    expect(text).toMatch(/\*\s*hint/);
  });

});
