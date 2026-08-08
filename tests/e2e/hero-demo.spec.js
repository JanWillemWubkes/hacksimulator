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

// ============================================================================
// Sessie 215 — vormgeving van het venster: uitlijning, focustoestand, uitnodiging
//
// Nulmeting vóór deze wijziging (productie, 1830×1000):
//   tekstkolom 140→568 · terminal 194→662 — 54px te laag begonnen én 94px onder de
//   tekstkolom uit. Oorzaak: `margin-top: 3rem`, een handmatige centrering uit de tijd
//   dat het venster 313px hoog was; Sessie 214 hing er 152px demobalk onder.
//   Focusrand: `outline: 2px solid var(--color-info)` — systeemblauw om een zwarte
//   terminal, en `:focus-within` vuurt óók bij een muisklik.
//   Cursor: `_` stond 317px van de linkerrand van het veld terwijl de tekst 155px
//   breed was — `flex: 1` op het <input> at de hele regel.
// ============================================================================

const PROMPT_GROEN = 'rgb(159, 239, 0)';

test.describe('Hero-terminal — uitlijning naast de tekst', () => {
  test.use({ viewport: DESKTOP });

  test('de twee kolommen delen hun optische midden', async ({ page }) => {
    await page.goto('/index.html');

    const m = await page.evaluate(() => {
      const mid = (sel) => {
        const b = document.querySelector(sel).getBoundingClientRect();
        return (b.top + b.bottom) / 2;
      };
      return {
        verschil: Math.abs(mid('.hero-text') - mid('.hero-terminal-col')),
        marginTop: getComputedStyle(document.querySelector('.hero-terminal')).marginTop,
        alignItems: getComputedStyle(document.querySelector('.hero-content')).alignItems
      };
    });

    // De invariant, niet de getallen: de kolommen mogen van hoogte veranderen (een
    // extra chiprij, langere copy) zonder dat iemand een marge hoeft bij te stellen.
    expect(m.verschil, 'kolommen staan niet op hetzelfde optische midden').toBeLessThanOrEqual(2);
    // Het magische getal mag niet terugkeren: dát was de bug.
    expect(m.marginTop, 'handmatige marge terug op .hero-terminal').toBe('0px');
    expect(m.alignItems).toBe('center');
  });

  test('@375px staat de kop bóven de terminal', async ({ page }) => {
    await page.setViewportSize(MOBIEL);
    await page.goto('/index.html');

    // De wrapper uit Sessie 215 is het directe kind van de kolom-flexbox. Zonder een
    // eigen `order: 2` erft hij de default 0 en landt hij vóór .hero-text (order: 1) —
    // gemeten toen dat gebeurde: terminal op y=76, kop op y=593.
    const y = await page.evaluate(() => ({
      tekst: document.querySelector('.hero-text').getBoundingClientRect().top,
      kolom: document.querySelector('.hero-terminal-col').getBoundingClientRect().top
    }));
    expect(y.tekst, 'de terminal staat boven de headline').toBeLessThan(y.kolom);
  });
});

test.describe('Hero-terminal — focustoestand', () => {
  test.use({ viewport: DESKTOP });

  // Beide thema's, want de focusregel en `[data-theme="light"] .hero-terminal` zetten
  // allebei box-shadow en zijn even specifiek (0,2,0). Bij gelijkspel wint bronvolgorde:
  // staat de focusregel vóór het light-blok, dan verdwijnt de gloed alleen in light mode.
  for (const thema of ['dark', 'light']) {
    test(`het venster gaat groen aan bij focus (${thema})`, async ({ page }) => {
      await page.goto('/index.html');
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), thema);

      await page.locator('#typing-target').click();

      const stijl = await page.evaluate(() => {
        const cs = getComputedStyle(document.querySelector('.hero-terminal'));
        return {
          outlineColor: cs.outlineColor,
          borderColor: cs.borderColor,
          boxShadow: cs.boxShadow,
          dot: getComputedStyle(document.querySelector('.hero-terminal .dot.green')).boxShadow
        };
      });

      expect(stijl.borderColor, 'rand niet in het promptgroen').toBe(PROMPT_GROEN);
      expect(stijl.boxShadow, 'geen groene gloed om het venster').toContain('159, 239, 0');
      expect(stijl.dot, 'het groene vensterbolletje licht niet op').not.toBe('none');
      // De outline blijft bestaan (vangnet voor forced-colors) maar mag niets tekenen:
      // een zichtbare blauwe systeemrand is precies wat hier weg moest.
      expect(stijl.outlineColor).toBe('rgba(0, 0, 0, 0)');
    });
  }
});

test.describe('Hero-terminal — de uitnodiging om te typen', () => {
  test.use({ viewport: DESKTOP });

  test('de hint staat er in rust en verdwijnt ná overname, zonder sprong', async ({ page }) => {
    await page.goto('/index.html');

    const hint = page.locator('.hero-terminal-hint');
    await expect(hint).toBeVisible();
    expect((await hint.textContent()).trim().length, 'lege hint').toBeGreaterThan(10);

    const voor = await page.evaluate(
      () => document.querySelector('.hero-terminal-col').getBoundingClientRect().height
    );

    await neemOver(page);

    const na = await page.evaluate(() => ({
      hoogte: document.querySelector('.hero-terminal-col').getBoundingClientRect().height,
      zichtbaar: getComputedStyle(document.querySelector('.hero-terminal-hint')).visibility
    }));

    expect(na.zichtbaar, 'hint blijft staan nadat hij is aangenomen').toBe('hidden');
    // `visibility` en niet `display: none`: anders krimpt de kolom en verspringt het
    // venster onder de muis van wie er net op klikte (gemeten: 29px / ~15px sprong).
    expect(na.hoogte, 'de kolom krimpt — het venster verspringt bij de klik').toBe(voor);
  });

  // 769 is de smalste breedte waarop de twee kolommen naast elkaar staan; daar is de
  // terminalkolom nog maar 314px (gemeten) en wrapt de hint naar twee regels. Dat is
  // cosmetisch en pre-existing krap — wat wél moet gelden is: de hint staat er, blijft
  // binnen zijn kolom en veroorzaakt geen horizontale overflow.
  for (const breedte of [769, 1280]) {
    test(`@${breedte}px staat de hint binnen zijn kolom`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 800 });
      await page.goto('/index.html');

      const m = await page.evaluate(() => {
        const el = document.querySelector('.hero-terminal-hint');
        const kolom = document.querySelector('.hero-terminal-col').getBoundingClientRect();
        return {
          zichtbaar: getComputedStyle(el).display !== 'none',
          regels: Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)),
          buitenKolom: Math.round(el.getBoundingClientRect().right - kolom.right),
          paginaOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });

      expect(m.zichtbaar, 'de hint valt weg op een desktopbreedte').toBe(true);
      expect(m.buitenKolom, 'de hint steekt buiten zijn kolom').toBeLessThanOrEqual(0);
      expect(m.paginaOverflow, 'horizontale overflow op de pagina').toBeLessThanOrEqual(0);
      // Op de gangbare breedte hoort hij op één regel; op 769 mag hij breken.
      if (breedte >= 1280) expect(m.regels, 'de hint wrapt op desktop').toBe(1);
      else expect(m.regels).toBeLessThanOrEqual(2);
    });
  }

  // `.mobile-cta-bar` staat `position: fixed` onderaan (alleen op index.html, ≤1279px) en
  // dekt bij scrollpositie 0 af wat daar toevallig ligt. Gemeten over zes telefoonmaten,
  // met consent gezet zodat dit de balk meet en niet de cookiebanner — en telkens tegen
  // `git archive HEAD` op een tweede server, zodat "pre-existing" een meting is en geen
  // aanname. Oud en nieuw gaven een byte-identieke uitkomst:
  //
  //   375×812 · 412×915 · 768×1024 → geen chip bedekt
  //   360×800 · 390×844            → `whoami`, `pwd`, `help` bedekt door de balk
  //
  // Die tweede regel is een pre-existing conditie sinds de chips bestaan (Sessie 214),
  // niet iets van deze wijziging. Bewust niet opgelost: de balk is bij scrollpositie 0
  // aantoonbaar overbodig (de hero-CTA staat op élke gemeten maat in beeld), dus de
  // principiële fix is hem daar verbergen — en dat maakt een conversie-kritische
  // eigenschap tijdsafhankelijk én breekt de synchrone scroll-guard in
  // homepage-conversion.spec.js. Dat is een eigen afweging, geen bijvangst.
  //
  // Deze test bewaakt dus twee dingen: dat de hint de chips niet verder omlaag duwt, en
  // dat de bedekking niet groeit voorbij de vastgelegde baseline.
  const BASELINE_BEDEKT = {
    '375x812': [],
    '390x844': ['whoami', 'pwd', 'help']
  };

  for (const [maat, baseline] of Object.entries(BASELINE_BEDEKT)) {
    const [width, height] = maat.split('x').map(Number);

    test(`@${maat} blijft de chipbedekking op de vastgelegde baseline`, async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem(
          'hacksim_analytics_consent',
          JSON.stringify({ necessary: true, analytics: true })
        );
      });
      await page.setViewportSize({ width, height });
      await page.goto('/index.html');

      const meting = await page.evaluate(() => {
        const bar = document.querySelector('.mobile-cta-bar');
        return {
          hintZichtbaar:
            getComputedStyle(document.querySelector('.hero-terminal-hint')).display !== 'none',
          barTop: bar ? Math.round(bar.getBoundingClientRect().top) : null,
          chips: [...document.querySelectorAll('.hero-chip')].map((c) => {
            const b = c.getBoundingClientRect();
            const midY = b.top + b.height / 2;
            const raak = document.elementFromPoint(b.left + b.width / 2, midY);
            return {
              cmd: c.dataset.command,
              midden: Math.round(midY),
              // Alleen meetbaar als het midden ín beeld ligt; daaronder zegt
              // elementFromPoint niets (het geeft null) en is er niets om te bedekken.
              meetbaar: midY > 0 && midY < window.innerHeight,
              raakbaar: raak === c || c.contains(raak),
              door: raak ? `${raak.tagName}.${raak.className}` : 'buiten viewport'
            };
          })
        };
      });

      // De hint kost 30px; die duwden de tweede rij op 375×812 van midden-736 naar
      // midden-764 terwijl de balk vanaf y=747 vastzit — dan navigeert een tik op
      // `whoami` wég in plaats van het command te draaien.
      expect(meting.hintZichtbaar, 'de hint staat op mobiel en duwt de chips omlaag').toBe(false);

      const bedekt = meting.chips.filter((c) => c.meetbaar && !c.raakbaar);
      const nieuw = bedekt
        .filter((c) => !baseline.includes(c.cmd))
        .map((c) => `${c.cmd} (midden ${c.midden}, balk vanaf ${meting.barTop}) → ${c.door}`);

      expect(nieuw, `nieuw bedekt t.o.v. baseline: ${nieuw.join(' | ')}`).toEqual([]);
    });
  }
});

test.describe('Hero-terminal — de cursor staat bij de tekst', () => {
  test.use({ viewport: DESKTOP });

  test('de knipperende cursor volgt de auto-demo in plaats van de rechterrand', async ({ page }) => {
    await page.goto('/index.html');

    // Eén synchrone meting: waarde, breedte en cursorpositie worden in dezelfde tick
    // gelezen, dus er zit geen aanslag van de auto-demo tussen. Werkt ook als het veld
    // net leeg is (dan hoort de cursor pal achter de prompt te staan) — de oude code
    // gaf in béíde gevallen ~317px.
    const m = await page.evaluate(() => {
      const input = document.getElementById('typing-target');
      const cursor = document.querySelector('.terminal-input-line .cursor');
      const cs = getComputedStyle(input);
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const tekstEind = input.getBoundingClientRect().left + ctx.measureText(input.value).width;
      return {
        waarde: input.value,
        flexGrow: cs.flexGrow,
        gat: cursor.getBoundingClientRect().left - tekstEind
      };
    });

    // Eén teken marge (~10px bij 0.9rem JetBrains Mono) plus subpixelruis.
    expect(m.flexGrow, 'het veld groeit weer over de hele regel in rust').toBe('0');
    expect(m.gat, `cursor staat ${Math.round(m.gat)}px van "${m.waarde}"`).toBeLessThan(24);
    expect(m.gat, 'cursor staat vóór de tekst').toBeGreaterThan(-2);
  });

  test('de hele promptregel neemt over, niet alleen het veld van één teken', async ({ page }) => {
    await page.goto('/index.html');

    // Regressie die de cursor-fix zelf introduceerde: in rust is #typing-target nog maar
    // ~10px breed. Wie rechts naast de prompt klikt — de hele lege rechterhelft van de
    // regel — raakte het veld daarmee niet meer. WebKit miste het in de testrun zelfs
    // met een gerichte klik.
    const doel = await page.evaluate(() => {
      const regel = document.querySelector('.terminal-input-line').getBoundingClientRect();
      return { x: regel.right - 24, y: regel.top + regel.height / 2 };
    });
    await page.mouse.click(doel.x, doel.y);

    await expect(page.locator('.terminal-body')).toHaveClass(/is-live/);
    await expect(page.locator('#typing-target')).toBeFocused();

    // En de bezoeker kan er meteen in typen.
    await page.keyboard.type('whoami');
    await page.keyboard.press('Enter');
    await expect(page.locator('#hero-demo')).toContainText('hacker');
  });

  test('bij overname krijgt het veld de hele regel terug', async ({ page }) => {
    await page.goto('/index.html');
    await neemOver(page);

    const m = await page.evaluate(() => {
      const input = document.getElementById('typing-target');
      return {
        flexGrow: getComputedStyle(input).flexGrow,
        inlineBreedte: input.style.width,
        breedte: input.getBoundingClientRect().width
      };
    });

    // De auto-demo zette een inline breedte per aanslag; inline verslaat de stylesheet,
    // dus zonder de wisser in neemOver() blijft het veld één teken breed en ziet de
    // bezoeker zijn eigen command niet.
    expect(m.inlineBreedte, 'inline breedte van de auto-demo niet gewist').toBe('');
    expect(m.flexGrow).toBe('1');
    expect(m.breedte, 'veld is te smal om in te typen').toBeGreaterThan(100);
  });
});
