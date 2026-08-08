// E2E Tests voor de interactieve hero-terminal op de homepage (Sessie 214)
//
// Achtergrond: de hero toonde een terminalvenster met prompt en knipperende cursor —
// de sterkste interactie-uitnodiging op de pagina — dat niets deed. `#typing-target`
// was een <span>, `.hero-terminal` had nul tabbare elementen. Voor een product waarvan
// de belofte "typ commands, veilig" is, mocht de bezoeker het product pas ervaren ná
// een klik plus een paginalading.
//
// Nulmeting vóór de wijziging (commit 0f2a306, 375×812):
//   0 tabbare elementen in .hero-terminal · #typing-target = SPAN · 0 chips
//   auto-demo toonde `whoami` -> "user" (engine: "hacker") en `ls` -> passwords.txt,
//   notes.md (bestaan geen van beide in de VFS)
//
// Bugs die deze suite afdekt — twee bestonden al, drie zijn tijdens de bouw gevonden:
//   A) landing-demo.js `stop()` zet alleen een boolean; de lopende await-keten loopt
//      door. Op visibilitychange startte startAnimation() een tweede lus in dezelfde DOM.
//   B) diezelfde handler herstartte de auto-demo óók nádat de bezoeker had getypt.
//   C) Firefox focust een veld dat bij mousedown nog `readonly` was niet vanzelf —
//      gemeten: document.activeElement bleef BODY, dus toetsaanslagen verdwenen.
//   D) `RESPONSES[naam]` is truthy voor élke prototype-sleutel; `constructor` of
//      `toString` typen liet de REPL stuklopen op undefined.slice().
//   E) de afrondboodschap telde op `gedaan.size` i.p.v. op de suggestieset, dus zes
//      willekeurige woorden triggerden hem — en daarna elk volgend command opnieuw.
//
// Alle asserties hieronder zijn geschreven vóór de fix en waren toen rood; C, D en E
// zijn bovendien met een mutant geverifieerd (oude code terug → test weer rood).

import { test, expect } from './fixtures.js';

const MOBIEL = { width: 375, height: 812 };
const DESKTOP = { width: 1280, height: 800 };

// De zes commands die de demo kent, met een fragment dat alléén in de échte
// engine-uitvoer voorkomt. Bewust géén tekst die de oude hand-geschreven demo ook had.
const DEMO_COMMANDS = [
  { cmd: 'whoami', bevat: 'hacker' },
  { cmd: 'pwd', bevat: '/home/hacker' },
  { cmd: 'ls', bevat: 'documents/' },
  { cmd: 'cat notes.txt', bevat: 'Mijn aantekeningen:' },
  { cmd: 'nmap 192.168.1.1', bevat: '443/tcp' },
  { cmd: 'help', bevat: '40+' }
];

// Het sitebrede CTA-label. Elke verwijzing in de demo-uitvoer moet dit letterlijk
// citeren, anders wordt `homepage-conversion.spec.js` ("geciteerde CTA-verwijzingen
// noemen een knop die bestaat") rood op een tekst die wij hier toevoegen.
const CTA_LABEL = 'Start de simulator';

/** Neemt de hero over en wacht tot de auto-demo daadwerkelijk is gestopt. */
async function neemOver(page) {
  await page.locator('#typing-target').click();
  await expect(page.locator('.terminal-body')).toHaveClass(/is-live/);
}

/** Typt een command en wacht tot de echoregel in de output staat. */
async function typ(page, command) {
  const input = page.locator('#typing-target');
  await input.fill(command);
  await input.press('Enter');
  await expect(page.locator('#hero-demo')).toContainText(`$ ${command}`);
}

/** Alle zichtbare outputregels als platte tekst. */
async function outputRegels(page) {
  return page.$$eval('#hero-demo .terminal-line', (els) =>
    els.map((e) => e.textContent.replace(/ /g, ' ').trimEnd())
  );
}

test.describe('Hero-terminal — bedienbaar', () => {
  test.use({ viewport: DESKTOP });

  test('de hero-terminal is echt bedienbaar', async ({ page }) => {
    await page.goto('/index.html');

    const veld = page.locator('#typing-target');
    // Was een <span>: geen tagnaam-assertie maar de eigenschap die de bezoeker merkt —
    // je kunt erin typen.
    await expect(veld).toHaveJSProperty('tagName', 'INPUT');

    // readonly tot de bezoeker hem aanraakt: dat houdt het mobiele toetsenbord dicht
    // tijdens de auto-demo en voorkomt dat typen met de typemachine vecht.
    expect(await veld.evaluate((el) => el.readOnly)).toBe(true);

    await neemOver(page);
    expect(await veld.evaluate((el) => el.readOnly)).toBe(false);
    await expect(veld).toBeFocused();

    await typ(page, 'whoami');
    await expect(page.locator('#hero-demo')).toContainText('hacker');
  });

  test('typen stopt de auto-demo, ook na een tabwissel', async ({ page }) => {
    await page.goto('/index.html');
    await neemOver(page);
    await typ(page, 'pwd');

    const naEigenCommand = (await outputRegels(page)).join('\n');

    // Bug A+B: `stop()` brak de lopende await-keten niet af en de
    // visibilitychange-handler herstartte de lus over de bezoeker heen. Twee lussen
    // in dezelfde DOM = de sessie van de bezoeker wordt weggeschreven.
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));

    // Ruim langer dan CONFIG.loopDelay (3000ms) + commandPause (1500ms): als de
    // auto-demo ook maar één keer aanslaat, is dat hier zichtbaar.
    await page.waitForTimeout(5000);

    const naWachten = (await outputRegels(page)).join('\n');
    expect(naWachten, 'de auto-demo schreef over de sessie van de bezoeker heen').toBe(
      naEigenCommand
    );
  });

  test('elk van de zes commands geeft de uitvoer van de echte engine', async ({ page }) => {
    await page.goto('/index.html');
    await neemOver(page);

    const ontbreekt = [];
    for (const { cmd, bevat } of DEMO_COMMANDS) {
      await typ(page, cmd);
      const tekst = (await outputRegels(page)).join('\n');
      if (!tekst.includes(bevat)) ontbreekt.push(`${cmd} -> mist "${bevat}"`);
    }
    expect(ontbreekt, ontbreekt.join(' | ')).toEqual([]);
  });

  test('een onbekend command wijst naar de volledige simulator', async ({ page }) => {
    await page.goto('/index.html');
    await neemOver(page);

    // Tier-1-gedrag van het echte helpsysteem (help-system.js:78-83): tikfout binnen
    // levenshtein-afstand 2 krijgt een suggestie.
    await typ(page, 'nmpa');
    let tekst = (await outputRegels(page)).join('\n');
    expect(tekst).toContain('Command not found: nmpa');
    expect(tekst).toContain("'nmap'");

    // Buiten de demo: eerlijk zijn over de grens én de weg wijzen. Het citaat moet
    // letterlijk het bestaande knoplabel zijn.
    await typ(page, 'sqlmap');
    tekst = (await outputRegels(page)).join('\n');
    expect(tekst).toContain('Command not found: sqlmap');
    expect(tekst).toContain(`"${CTA_LABEL}"`);

    // De knop met dat label moet ook echt op de pagina staan (de lockstep die
    // homepage-conversion.spec.js bewaakt, hier lokaal herbevestigd).
    const labels = await page.$$eval('a, button', (els) =>
      els.map((e) => e.textContent.trim().replace(/\s+/g, ' '))
    );
    expect(labels).toContain(CTA_LABEL);
  });

  test('invoer die op Object.prototype lijkt blokkeert de demo niet', async ({ page }) => {
    const fouten = [];
    page.on('pageerror', (e) => fouten.push(e.message));

    await page.goto('/index.html');
    await neemOver(page);

    // `RESPONSES[naam]` is truthy voor élke prototype-sleutel, dus deze woorden liepen
    // stuk op `undefined.slice()` en blokkeerden de hele REPL — één getypt woord en de
    // bezoeker kon niets meer.
    for (const gluiperd of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
      await typ(page, gluiperd);
      const tekst = (await outputRegels(page)).join('\n');
      expect(tekst, `${gluiperd} gaf geen nette foutmelding`).toContain(
        `Command not found: ${gluiperd}`
      );
    }

    // En de terminal doet het daarna gewoon nog.
    await typ(page, 'whoami');
    await expect(page.locator('#hero-demo')).toContainText('hacker');
    expect(fouten, `JS-fouten: ${fouten.join(' | ')}`).toEqual([]);
  });

  test('de afrondboodschap komt na alle zes, en precies één keer', async ({ page }) => {
    await page.goto('/index.html');
    await neemOver(page);

    const telAfronding = async () =>
      (await outputRegels(page)).filter((r) => r.includes('voor 40+ commands')).length;

    // Zes willekeurige woorden mogen hem NIET triggeren: `gedaan` verzamelt élke invoer,
    // dus tellen op grootte i.p.v. op de suggestieset was hier de fout.
    for (const onzin of ['aap', 'noot', 'mies', 'wim', 'zus', 'jet']) await typ(page, onzin);
    expect(await telAfronding(), 'afronding kwam zonder dat de zes gedaan zijn').toBe(0);

    for (const s of ['ls', 'cat notes.txt', 'nmap 192.168.1.1', 'whoami', 'pwd', 'help']) {
      await typ(page, s);
    }
    expect(await telAfronding()).toBe(1);

    // En niet opnieuw bij elk volgend command — herhaalde CTA is ruis.
    await typ(page, 'pwd');
    await typ(page, 'ls');
    expect(await telAfronding(), 'afronding herhaalt zich').toBe(1);
  });

  test('de auto-demo toont wat de echte engine ook toont', async ({ page }) => {
    // Momentopnames van #hero-demo deugen hier niet: trimOldLines() knipt de oudste
    // regels weg (maxVisibleLines 8), dus een `innerText()` ná de lus mist juist de
    // regels die je wilt controleren. Eerste versie van deze test was daardoor groen
    // op de ONgewijzigde pagina — hij vond "hacker" in de promptregel
    // "hacker@hacksim:~$ help" en concludeerde dat `whoami` klopte. Daarom een
    // observer die álles opvangt wat de lus ooit heeft geschreven.
    await page.addInitScript(() => {
      window.__demoRegels = [];
      const start = () => {
        const doel = document.getElementById('hero-demo');
        if (!doel) return;
        new MutationObserver((muts) => {
          for (const m of muts) {
            for (const n of m.addedNodes) {
              if (n.textContent) window.__demoRegels.push(n.textContent);
            }
          }
        }).observe(doel, { childList: true });
      };
      document.addEventListener('DOMContentLoaded', start);
    });
    await page.goto('/index.html');

    // Eén volledige lus is 4 commands × (typen + output + 1500ms pauze) ≈ 20s.
    await page.waitForFunction(
      () => window.__demoRegels.some((r) => r.includes('$ whoami')),
      null,
      { timeout: 30000 }
    );
    await page.waitForTimeout(1500);
    const alles = await page.evaluate(() => window.__demoRegels.join('\n'));

    // `passwords.txt` en `notes.md` bestaan niet in de VFS (structure.js:7-206);
    // `ls` geeft daar `documents/  notes.txt  README.txt`.
    expect(alles, 'hero toont bestanden die niet in de simulator bestaan').not.toContain(
      'passwords.txt'
    );
    expect(alles).not.toContain('notes.md');
    expect(alles, '`ls` toont niet wat de echte VFS toont').toContain('documents/');

    // `whoami` geeft `hacker` (terminal.js:45), niet `user`. De promptregel bevat óók
    // "hacker", dus meten op de regel ná de echo — anders is de assertie blind.
    const naWhoami = alles.slice(alles.indexOf('$ whoami') + 8).split('\n')[1] || '';
    expect(naWhoami.trim(), 'whoami geeft niet de gebruiker van de echte engine').toBe(
      'hacker'
    );
  });

  test('hero_demo_command stuurt alleen de commandonaam, nooit argumenten', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('hacksim_analytics_consent', 'true'));
    await page.goto('/index.html');
    await page.evaluate(() => {
      window.__gtagCalls = [];
      window.gtag = (...args) => window.__gtagCalls.push(args);
    });

    await neemOver(page);
    await typ(page, 'cat /etc/shadow');

    const calls = await page.evaluate(() => JSON.stringify(window.__gtagCalls));
    expect(calls, 'geen hero_demo_command-event verstuurd').toContain('hero_demo_command');
    expect(calls).toContain('hero_demo_started');
    // PRD §13: nooit argumenten loggen.
    expect(calls, 'argument gelekt naar analytics').not.toContain('/etc/shadow');
    expect(calls).not.toContain('shadow');
  });
});

test.describe('Hero-terminal — mobiel', () => {
  test.use({ viewport: MOBIEL });

  test('@375px past elke authored outputregel binnen 40 tekens', async ({ page }) => {
    await page.goto('/index.html');
    await neemOver(page);

    // `cat` valt hier bewust buiten: dat toont letterlijke bestandsinhoud uit de VFS.
    // Die inkorten zou het bestand vervalsen — een regel van 47 tekens hoort daar te
    // wrappen, precies zoals een echte terminal doet. De geometrische test hieronder
    // dekt dat geval wél af.
    const teBreed = [];
    for (const { cmd } of DEMO_COMMANDS.filter((c) => !c.cmd.startsWith('cat'))) {
      await typ(page, cmd);
      for (const regel of await outputRegels(page)) {
        if (regel.length > 40) teBreed.push(`${cmd}: ${regel.length} — "${regel}"`);
      }
    }
    expect(teBreed, teBreed.join('\n')).toEqual([]);
  });

  test('@375px loopt geen enkele outputregel buiten de terminal', async ({ page }) => {
    await page.goto('/index.html');
    await neemOver(page);
    for (const { cmd } of DEMO_COMMANDS) await typ(page, cmd);

    // Geometrisch meten naast de tekentelling: de ene maat is structureel blind voor
    // de andere. `pre-wrap` laat lange bestandsinhoud wrappen (geen overflow), terwijl
    // een te lange authored regel juist wél telt.
    const overflow = await page.evaluate(() => {
      const body = document.querySelector('.terminal-body');
      const max = body.clientWidth;
      return [...body.querySelectorAll('.terminal-line')]
        .filter((el) => el.getBoundingClientRect().width > max + 1)
        .map((el) => `${Math.round(el.getBoundingClientRect().width)}px > ${max}px: ${el.textContent.slice(0, 30)}`);
    });
    expect(overflow, overflow.join(' | ')).toEqual([]);

    const paginaOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(paginaOverflow, 'horizontale overflow op de pagina').toBeLessThanOrEqual(0);
  });

  test('chips draaien het command en zijn groot genoeg om te tikken', async ({ page }) => {
    await page.goto('/index.html');

    const chips = page.locator('.hero-chip');
    await expect(chips).toHaveCount(6);

    // WCAG AAA-tikdoel; ook de conditie van homepage-conversion.spec.js:238.
    const teKlein = await page.$$eval('.hero-chip', (els) =>
      els
        .map((e) => ({ t: e.textContent.trim(), h: Math.round(e.getBoundingClientRect().height) }))
        .filter((c) => c.h < 44)
        .map((c) => `${c.t}: ${c.h}px`)
    );
    expect(teKlein, teKlein.join(' | ')).toEqual([]);

    // Een chip tikken neemt over én draait het command — zonder toetsenbord.
    await chips.filter({ hasText: 'whoami' }).click();
    await expect(page.locator('.terminal-body')).toHaveClass(/is-live/);
    await expect(page.locator('#hero-demo')).toContainText('$ whoami');
    await expect(page.locator('#hero-demo')).toContainText('hacker');

    // De begeleiding: gebruikte suggestie afgevinkt, de volgende gemarkeerd.
    const staat = await page.$$eval('.hero-chip', (els) =>
      els.map((e) => ({
        cmd: e.dataset.command,
        next: e.classList.contains('is-next'),
        done: e.classList.contains('is-done')
      }))
    );
    expect(staat.find((c) => c.cmd === 'whoami').done, 'gebruikte chip niet afgevinkt').toBe(true);
    expect(staat.filter((c) => c.next).length, 'niet precies één volgende suggestie').toBe(1);
  });

  test('eerdere uitvoer blijft terugscrollbaar', async ({ page }) => {
    await page.goto('/index.html');
    await neemOver(page);
    await typ(page, 'nmap 192.168.1.1');
    await typ(page, 'help');

    // De reden dat .terminal-body.is-live op `display: block` staat en niet op het
    // oorspronkelijke flex-end: die combinatie clipt in Chrome en Firefox de bovenkant
    // van de inhoud onbereikbaar weg. Deze test is de meting die dat afdekt.
    const scroll = await page.evaluate(() => {
      const b = document.querySelector('.terminal-body');
      const onder = b.scrollTop;
      b.scrollTop = 0;
      const eersteZichtbaar = [...b.querySelectorAll('.terminal-line')].find((el) => {
        const r = el.getBoundingClientRect();
        const bb = b.getBoundingClientRect();
        return r.top >= bb.top - 1 && r.bottom <= bb.bottom + 1;
      });
      return {
        scrollbaar: b.scrollHeight > b.clientHeight,
        gepindOpBodem: onder > 0,
        bovensteRegel: eersteZichtbaar ? eersteZichtbaar.textContent : null
      };
    });

    expect(scroll.scrollbaar, 'output past in één scherm — test bewijst niets').toBe(true);
    expect(scroll.gepindOpBodem, 'scroll stond niet op de nieuwste regel').toBe(true);
    expect(scroll.bovensteRegel, 'bovenkant van de output is onbereikbaar geclipt').toContain(
      'Demo-terminal'
    );
  });
});

test.describe('Hero-terminal zonder JavaScript', () => {
  test.use({ viewport: MOBIEL, javaScriptEnabled: false });

  test('de hero blijft heel en liegt niet', async ({ page }) => {
    await page.goto('/index.html');

    // NIET met toBeVisible() meten: die negeert opacity (zie homepage-conversion.spec.js:251).
    const staat = await page.evaluate(() => {
      const veld = document.getElementById('typing-target');
      const body = document.querySelector('.terminal-body');
      return {
        veldBestaat: !!veld,
        veldReadonly: veld ? veld.readOnly : null,
        bodyOpacity: getComputedStyle(body).opacity,
        heeftTekst: body.innerText.trim().length > 0
      };
    });

    expect(staat.veldBestaat).toBe(true);
    // Zonder JS kan er niets uitgevoerd worden — een bewerkbaar veld zou dat liegen.
    expect(staat.veldReadonly).toBe(true);
    expect(staat.bodyOpacity).toBe('1');
    expect(staat.heeftTekst, 'lege terminal zonder JS').toBe(true);
  });
});
