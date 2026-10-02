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

  // Finish review s247: de auto-demo liep een lus (nmap, ls, whoami, pwd), en 12 van elke
  // 15,2s stonden 53/80/443 gevuld zonder hun regels en glossen. De registratie hoort in
  // rust heel te zijn: het nmap-frame is de ruststand en blijft dat. Wat de demo toont komt
  // uit dezelfde bron als wat een bezoeker typt ("elk van de zes commands" hieronder).
  // Sessie 249-250: het netwerkdiagram is uit de hero (proef V3). De ruststand toont nu de
  // drie open poorten als regels in de terminal, elk met zijn glos.
  test('de ruststand is het nmap-frame, met elke open poort als regel met zijn glos', async ({ page }) => {
    await page.addInitScript(() => {
      // Vanaf de eerste byte: modules draaien vóór DOMContentLoaded, dus een observer die
      // daar pas start mist de laadreeks (eerste versie: lege populatie, de tak ving het).
      window.__demoPrompts = [];
      new MutationObserver((muts) => {
        for (const m of muts) for (const n of m.addedNodes) {
          // Niet tijdens het parsen: dan voegt de parser de statische no-JS-rijen (ls, whoami)
          // in, die de demo daarna vervangt. Modules draaien pas na het parsen.
          if (document.readyState !== 'loading' && n.classList && n.classList.contains('reg--prompt') && n.closest('#hero-demo')) {
            window.__demoPrompts.push(n.textContent.trim());
          }
        }
      }).observe(document, { childList: true, subtree: true });
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/index.html');
    // Ruim langer dan de oude lus (3,2s per command): kwam er een tweede command, dan nu.
    await page.waitForTimeout(8000);
    const m = await page.evaluate(() => {
      const body = document.getElementById('hero-demo').getBoundingClientRect();
      const zichtbaar = [...document.querySelectorAll('#hero-demo .reg')].filter((r) => {
        const b = r.getBoundingClientRect(); return b.top >= body.top - 1 && b.bottom <= body.bottom + 1;
      });
      const regelVan = (p) => zichtbaar.find((r) => r.querySelector('.terminal-line').textContent.trimStart().startsWith(`${p}/tcp`));
      const poorten = ['53', '80', '443'];
      return { prompts: window.__demoPrompts, diagram: document.querySelectorAll('.af-net, .af-poort').length,
        zonderRegel: poorten.filter((p) => !regelVan(p) || !regelVan(p).querySelector('.reg-glos').textContent.trim()) };
    });
    // Zelfbewakend: de observer zag de laadreeks; leeg betekent "niet gemeten".
    expect(m.prompts.length, 'de observer zag geen enkel command').toBeGreaterThan(0);
    expect([...new Set(m.prompts)], 'de auto-demo toont meer dan het nmap-frame').toEqual(['hacker@hacksim:~$ nmap 192.168.1.1']);
    expect(m.zonderRegel, 'een open poort staat in rust niet als regel met glos in beeld').toEqual([]);
    expect(m.diagram, 'het netwerkdiagram staat weer in de hero (sessie 249: eruit)').toBe(0);
  });

  // Sessie 249-250: wat bij overname in rust gaat, is de terminal zelf (het diagram is uit de
  // hero). De demo schrijft niet over de sessie van de bezoeker heen.
  test('overname: de terminal van de bezoeker begint leeg, en de demo komt niet terug', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/index.html');
    const voor = await page.evaluate(() => document.querySelectorAll('#hero-demo .reg').length);
    expect(voor, 'vóór de overname staat het nmap-frame er niet: dan toetst dit niets').toBeGreaterThan(6);
    await neemOver(page);
    // De bezoeker krijgt een eigen welkomstregel; wat weg moet, is de uitvoer van de demo.
    const demo = () => page.evaluate(() => [...document.querySelectorAll('#hero-demo .terminal-line')]
      .filter((l) => /nmap|\/tcp/.test(l.textContent)).length);
    expect(await demo(), 'de uitvoer van de demo blijft staan in de terminal van de bezoeker').toBe(0);
    expect(await page.evaluate(() => window.landingDemo.isHandedOff()), 'de auto-demo weet niet dat hij is overgenomen').toBe(true);
    await page.waitForTimeout(1500);
    expect(await demo(), 'de demo schrijft na de overname toch weer').toBe(0);
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

  // Sessie 250: gemeten passen er op 375 39 tekens (319px binnen de cel, Chromium rondt de
  // letter af op 8px), niet 40; een regel van precies 40 brak dus al om. De lat is 39.
  test('@375px past elke authored outputregel binnen 39 tekens', async ({ page }) => {
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
        if (regel.length > 39) teBreed.push(`${cmd}: ${regel.length} — "${regel}"`);
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
    expect(scroll.gepindOpBodem, 'scroll stond nog bovenaan: het nieuwste command is niet in beeld gebracht').toBe(true);
    expect(scroll.bovensteRegel, 'bovenkant van de output is onbereikbaar geclipt').toContain(
      'Demo-terminal'
    );
  });
});

// Sessie 240: de scroll pinde op de bodem, dus bij nmap (374px uitvoer in een venster van
// 205px) stonden de promptregel en "Nmap scan report" 107px boven de rand. Je zag poorten
// zonder het command dat je net tikte. Mutant pinScroll() terug -> de eerste assertie.
test.describe('Hero-terminal — het getikte command staat in beeld', () => {
  for (const vp of [DESKTOP, MOBIEL]) {
    test(`@${vp.width}px: bovenaan na een lange uitvoer, en een korte blijft op de bodem`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/index.html');
      await neemOver(page);

      const staat = () => page.evaluate(() => {
        const b = document.getElementById('hero-demo');
        // De paddingbox, binnen de rand van 8px (sessie 250): daar knipt het venster af.
        const r = b.getBoundingClientRect();
        const bb = { top: r.top + b.clientTop, bottom: r.top + b.clientTop + b.clientHeight };
        const prompt = [...b.querySelectorAll('.terminal-line.prompt')].pop().getBoundingClientRect();
        const laatste = [...b.querySelectorAll('.terminal-line')].pop().getBoundingClientRect();
        return {
          promptVanRand: prompt.top - bb.top,
          promptBinnen: prompt.top >= bb.top - 1 && prompt.bottom <= bb.bottom + 1,
          laatsteBinnen: laatste.bottom <= bb.bottom + 1,
          teLang: b.scrollHeight - b.clientHeight
        };
      });

      await typ(page, 'nmap 192.168.1.1');
      const lang = await staat();
      // Zelfbewakend: past de uitvoer, dan staat alles in beeld en bewijst dit niets.
      expect(lang.teLang, 'nmap past in het venster — de test bewijst niets').toBeGreaterThan(40);
      expect(lang.promptBinnen, `promptregel ${lang.promptVanRand.toFixed(0)}px van de bovenrand`).toBe(true);
      expect(Math.abs(lang.promptVanRand), 'command staat niet strak bovenaan').toBeLessThanOrEqual(1);

      await typ(page, 'pwd');
      const kort = await staat();
      expect(kort.promptBinnen, 'kort command niet in beeld').toBe(true);
      expect(kort.laatsteBinnen, 'laatste regel van een korte uitvoer valt buiten beeld').toBe(true);
    });
  }
});

// Sessie 243 (adapt). Twee gemeten fouten bij een chip-tik, op elke breedte:
//  1. Wie voorbij de terminaltop scrolde om de chips te zien, kreeg zijn promptregel tot
//     181px boven de rand of onder de navbar: je tikte en zag niets gebeuren.
//  2. De tik focuste het invoerveld. Stond dat boven de rand, dan trok de browser de pagina
//     er 391-611px naartoe; op touch opende elke tik het toetsenbord; en Tab ging vanaf het
//     veld terug naar chip 01 in plaats van naar de volgende.
// Beweging bevroren (reduced motion + geen transities): de scroll is dan direct, en een
// meting midden in een smooth scroll las in de inventaris een sprong die er niet was.
const BEVRIES = 'html{scroll-behavior:auto!important}*,*::before,*::after{transition:none!important;animation:none!important}';

test.describe('Hero-terminal — een chip-tik op elke scrollpositie', () => {
  // Landscape (past: false): tussen navbar en balk is er 242-330px, de terminal alleen al
  // is 300px. Daar gaat de uitvoer voor en mag de chip onder de rand schuiven; een
  // zichtbare balk mag hem nooit half afdekken.
  const MATEN = [
    { ...MOBIEL, past: true }, { width: 390, height: 844, past: true },
    { width: 1024, height: 768, past: true }, { ...DESKTOP, past: true },
    { width: 844, height: 390, past: false }, { width: 667, height: 375, past: false },
  ];
  for (const vp of MATEN) {
    test(`@${vp.width}x${vp.height}: de uitvoer komt in beeld, alleen met het tekort, en de chip ${vp.past ? 'blijft zichtbaar' : 'valt nooit half onder de balk'}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      // Een terugkerende bezoeker: zonder keuze verschijnt de cookiebanner na een korte
      // vertraging onderaan en ligt hij in landscape over de chips. Dan hing de uitkomst af
      // van welke engine de banner het eerst toonde (gemeten sessie 243, firefox 667x375).
      await page.addInitScript(() => {
        try {
          localStorage.setItem('hacksim_analytics_consent',
            JSON.stringify({ necessary: true, analytics: false, advertising: false }));
        } catch (e) { /* private mode */ }
      });
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/index.html');
      await page.addStyleTag({ content: BEVRIES });

      const eind = await page.evaluate(() => {
        const c = document.getElementById('hero-chips').getBoundingClientRect();
        return Math.round(c.bottom + scrollY);
      });

      let tikbaar = 0;
      let nodig = 0;
      const fouten = [];
      for (let y = 0; y <= eind; y += 20) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        // Twee frames: de balk beslist in een IntersectionObserver-callback, en Firefox deed
        // zijn hit-test anders nog op de layout van vóór de scroll.
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        // De onderste chip die helemaal tikbaar is: onder de navbar, boven een zichtbare balk,
        // en op het tikpunt ligt echt de chip (geen balk, banner of ander vlak eroverheen).
        const doel = await page.evaluate(() => {
          const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 0;
          const balk = document.querySelector('.mobile-cta-bar');
          const br = balk && balk.getBoundingClientRect();
          const rand = br && br.height && balk.dataset.state === 'zichtbaar' ? br.top : innerHeight;
          const chips = [...document.querySelectorAll('.hero-chip')].filter((c) => {
            const r = c.getBoundingClientRect();
            return r.top >= nav && r.bottom <= rand;
          });
          const c = chips.filter((k) => {
            const r = k.getBoundingClientRect();
            return k.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
          }).pop();
          if (!c) return null;
          const r = c.getBoundingClientRect();
          const body = document.getElementById('hero-demo').getBoundingClientRect();
          return { cmd: c.dataset.command, x: r.x + r.width / 2, y: r.y + r.height / 2,
                   s: scrollY, tekort: Math.max(0, nav + 8 - body.top) };
        });
        if (!doel) continue;
        tikbaar++;
        if (doel.tekort > 1) nodig++;
        await page.mouse.click(doel.x, doel.y);
        // De balk beslist in een IntersectionObserver-callback, een frame later.
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        const meetNa = (cmd) => page.evaluate((cmd) => {
          const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 0;
          const balk = document.querySelector('.mobile-cta-bar');
          const br = balk && balk.getBoundingClientRect();
          const rand = br && br.height && balk.dataset.state === 'zichtbaar' ? br.top : innerHeight;
          const prompt = [...document.querySelectorAll('#hero-demo .terminal-line.prompt')].pop().getBoundingClientRect();
          const chip = document.querySelector(`.hero-chip[data-command="${cmd}"]`).getBoundingClientRect();
          return { s: scrollY, nav, rand, vh: innerHeight, balk: rand < innerHeight,
                   pt: prompt.top, pb: prompt.bottom, ct: chip.top, cb: chip.bottom };
        }, cmd);
        let na = await meetNa(doel.cmd);
        const tag = `y=${y} ${doel.cmd}`;
        const promptFout = (m) => m.pt < m.nav - 1 || m.pb > m.rand + 1;
        const chipFout = (m) => vp.past
          ? m.ct < m.nav - 1 || m.cb > m.rand + 1
          : m.balk && m.ct < m.vh && m.cb > m.rand + 1;
        // Onder belasting heeft de IntersectionObserver van de balk in WebKit soms meer dan
        // twee frames nodig, en beide checks lezen de balkrand. Een balk die één frame staat
        // is niet tikbaar: tel alleen wat blijft staan nadat hij beslist heeft. De scroll is
        // direct (reduced motion) en verandert in die 250ms niet.
        if (promptFout(na) || chipFout(na)) { await page.waitForTimeout(250); na = await meetNa(doel.cmd); }
        if (promptFout(na)) fouten.push(`${tag}: promptregel op ${na.pt.toFixed(0)} (navbar ${na.nav}, rand ${na.rand.toFixed(0)})`);
        if (chipFout(na)) fouten.push(`${tag}: chip op ${na.ct.toFixed(0)}-${na.cb.toFixed(0)} buiten beeld of onder de balk`);
        const verschoven = doel.s - na.s;
        if (Math.abs(verschoven - doel.tekort) > 1) fouten.push(`${tag}: pagina ${verschoven.toFixed(0)}px verschoven (${doel.s} -> ${na.s}), tekort was ${doel.tekort.toFixed(0)}`);
      }

      // Zelfbewakend: genoeg posities, en minstens één waar de uitvoer echt buiten beeld stond.
      expect(tikbaar, 'te weinig tikbare posities — de sweep heeft niet gedraaid').toBeGreaterThanOrEqual(12);
      expect(nodig, 'geen enkele positie had een tekort — de sweep bewijst het meescrollen niet').toBeGreaterThan(0);
      expect(fouten.filter((f) => f.includes('promptregel')), 'uitvoer buiten beeld na de tik').toEqual([]);
      expect(fouten.filter((f) => f.includes('chip op')), 'getikte chip uit beeld').toEqual([]);
      expect(fouten.filter((f) => f.includes('verschoven')), 'de pagina bewoog meer of minder dan het tekort').toEqual([]);
    });
  }
});

test.describe('Hero-terminal — focus en naam van een chip', () => {
  test.use({ viewport: DESKTOP });

  test('een getikte chip houdt de focus, Tab gaat naar de volgende, en de ring is zichtbaar', async ({ page }) => {
    await page.goto('/index.html');
    await page.addStyleTag({ content: BEVRIES });
    const veld = page.locator('#typing-target');

    // Aanwijzer: het veld krijgt de focus niet (geen toetsenbord op touch, geen sprong).
    await page.locator('.hero-chip[data-command="whoami"]').click();
    await expect(page.locator('#hero-demo')).toContainText('$ whoami');
    await expect(veld, 'een chip-tik gaf de focus aan het invoerveld').not.toBeFocused();

    // Toetsenbord: Enter op 01 houdt de focus daar, Tab gaat naar 02.
    const ls = page.locator('.hero-chip[data-command="ls"]');
    await ls.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#hero-demo')).toContainText('$ ls');
    await expect(ls, 'Enter op een chip verplaatste de focus').toBeFocused();
    await page.keyboard.press('Tab');
    const cat = page.locator('.hero-chip[data-command="cat notes.txt"]');
    await expect(cat, 'Tab na een chip ging niet naar de volgende chip').toBeFocused();

    // De ring in pixels: hetzelfde vlak met en zonder focus moet verschillen.
    const vak = await cat.boundingBox();
    const clip = { x: vak.x - 4, y: vak.y - 4, width: vak.width + 8, height: vak.height + 8 };
    const met = await page.screenshot({ clip });
    await cat.evaluate((el) => el.blur());
    const zonder = await page.screenshot({ clip });
    expect(Buffer.compare(met, zonder), 'focus op een chip is niet te zien').not.toBe(0);
  });

  test('de toestand van een chip staat in zijn naam', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('.hero-chip[data-command="whoami"]').click();
    await expect(page.locator('#hero-demo')).toContainText('$ whoami');
    // Sessie 249: de herkomst staat niet meer op de chip, dus ook niet meer in de naam.
    await expect(page.getByRole('button', { name: 'whoami, gedaan', exact: true })).toHaveCount(1);
    await expect(page.getByRole('button', { name: /, volgende suggestie$/ })).toHaveCount(1);
    // Label-in-name: elke chipnaam begint met zijn zichtbare command.
    const namen = await page.$$eval('.hero-chip', (els) =>
      els.filter((e) => !e.getAttribute('aria-label')?.startsWith(e.dataset.command)).map((e) => e.dataset.command));
    expect(namen, 'chipnaam begint niet met de zichtbare tekst').toEqual([]);
  });
});

// Sessie 243 (adapt), inventaris per 16px: tussen 768 en 928 brak de terminalkop over twee
// regels (een losse "~"), tussen 768 en 864 staken "3306" en "8080" buiten hun sleuf, en
// onder 430 brak "nmap 192.168.1.1" en de herkomst per chip verschillend (rijen 86/68).
// De oplossingen voor mobiel (titel weg, poorten 2x6) gelden nu tot 1023; de chips zetten
// onder 768 hun index boven het command. Gemeten op elke 8px, niet op een lijst maten.
// Onder 352 is een halve chip 120px en vraagt "bestanden · beginner" 151: daar breekt het
// nog. Dat staat als assertie in twee richtingen, zodat een oplossing zich meldt.
const ONDERGRENS_EEN_REGEL = 352;

// Sessie 249-250: de poorten verlieten de hero met het diagram; hun labeltoets ging mee.
test.describe('Hero op elke breedte: kop en chips op één regel', () => {
  test('van 320 tot 1440, per 8px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto('/index.html');
    await page.evaluate(() => document.fonts.ready);
    const fouten = [];
    let gemeten = 0;
    let onderGrensBreekt = 0;
    for (let w = 320; w <= 1440; w += 8) {
      await page.setViewportSize({ width: w, height: 900 });
      // Opnieuw laden op de grens: WebKit houdt de rijhoogte van het gebroken command (85)
      // vast als het venster van onder 352 over de grens groeit, tot een herlading. Wie op
      // een breedte laadt krijgt 68 (gemeten sessie 243). Dit meet layout per breedte, niet
      // dat rotatiegedrag; het staat in het contract.
      if (w === ONDERGRENS_EEN_REGEL) { await page.reload(); await page.evaluate(() => document.fonts.ready); }
      const r = await page.evaluate(() => {
        const regels = (e) => {
          const g = document.createRange(); g.selectNodeContents(e);
          return new Set([...g.getClientRects()].map((x) => Math.round(x.top))).size;
        };
        const kop = [...document.querySelectorAll('.af-term-kop span')].filter((s) => s.getClientRects().length);
        const chips = [...document.querySelectorAll('.hero-chip')];
        // Afstand van de tekst tot de binnenkant van de chiprand (2px rand).
        const lucht = Math.min(...chips.flatMap((c) => ['.af-chip-cmd'].map((s) => {
          const g = document.createRange(); g.selectNodeContents(c.querySelector(s));
          return c.getBoundingClientRect().right - 2 - g.getBoundingClientRect().right;
        })));
        return {
          lucht,
          kop: kop.length, kopBreekt: kop.filter((s) => regels(s) > 1).map((s) => s.textContent.trim()),
          chips: chips.length,
          chipBreekt: chips.filter((c) => regels(c.querySelector('.af-chip-cmd')) > 1).map((c) => c.dataset.command),
          hoogtes: [...new Set(chips.map((c) => Math.round(c.getBoundingClientRect().height)))],
        };
      });
      gemeten++;
      if (r.kop < 1 || r.chips !== 6) fouten.push(`${w}: populatie kop ${r.kop}, chips ${r.chips}`);
      // Op elke breedte, ook onder de grens: tekst loopt nooit over de rand van zijn chip.
      if (r.lucht < 0) fouten.push(`${w}: chiptekst ${(-r.lucht).toFixed(0)}px over de rand`);
      if (w >= ONDERGRENS_EEN_REGEL && r.lucht < 6) fouten.push(`${w}: chiptekst ${r.lucht.toFixed(1)}px van de rand, minder dan 6`);
      const breekt = r.kopBreekt.length || r.chipBreekt.length || r.hoogtes.length > 1;
      if (w < ONDERGRENS_EEN_REGEL) { if (breekt) onderGrensBreekt++; continue; }
      if (r.kopBreekt.length) fouten.push(`${w}: terminalkop breekt: ${r.kopBreekt.join(' | ')}`);
      if (r.chipBreekt.length) fouten.push(`${w}: chip breekt: ${r.chipBreekt.join(' | ')}`);
      if (r.hoogtes.length > 1) fouten.push(`${w}: chips ongelijk hoog: ${r.hoogtes.join('/')}`);
    }
    expect(gemeten, 'de sweep heeft niet gedraaid').toBeGreaterThanOrEqual(140);
    expect(fouten.filter((f) => f.includes('populatie')), 'kop of chips niet gevonden').toEqual([]);
    expect(fouten.filter((f) => f.includes('terminalkop')), 'terminalkop op meer dan één regel').toEqual([]);
    expect(fouten.filter((f) => f.includes('chiptekst')), 'chiptekst over of te dicht op de rand').toEqual([]);
    expect(fouten.filter((f) => f.includes('chip breekt') || f.includes('ongelijk hoog')), 'chip op meer dan één regel of ongelijk hoog').toEqual([]);
    // Twee richtingen: breekt het onder de grens niet meer, verlaag dan ONDERGRENS_EEN_REGEL.
    expect(onderGrensBreekt, `onder ${ONDERGRENS_EEN_REGEL}px breekt niets meer — verlaag de grens`).toBeGreaterThan(0);
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

const SIGNAAL_ROOD = 'rgb(204, 10, 30)';

test.describe('Hero-terminal — uitlijning naast de tekst', () => {
  test.use({ viewport: DESKTOP });

  // Het magische getal uit Sessie 215 (`margin-top: 3rem` op het venster) blijft bewaakt:
  // de module hoort op het raster te staan, niet op een handmatige verschuiving.
  test('geen handmatige marge op het terminalvenster', async ({ page }) => {
    await page.goto('/index.html');
    const marginTop = await page.evaluate(
      () => getComputedStyle(document.querySelector('.hero-terminal')).marginTop
    );
    expect(marginTop, 'handmatige marge terug op .hero-terminal').toBe('0px');
  });
});

test.describe('Hero-terminal — focustoestand', () => {
  test.use({ viewport: DESKTOP });

  // Sessie 238: de module ging bij focus rood aan met twee zijstrepen van 4px. Sessie 246
  // (finish review): dat waren 308 veranderde pixels tegen ~3300 die WCAG 2.4.13 vraagt,
  // en een zijstreep waar elk ander element een ring heeft. Nu draagt de invoerregel de
  // ring van de pagina. Beide thema's, want een [data-theme]-regel en een focusregel van
  // gelijke specificiteit vechten op bronvolgorde (css-layout §9). De pixels bewaakt
  // homepage-conversion.spec.js "Finish review (sessie 246)".
  for (const thema of ['dark', 'light']) {
    test(`de invoerregel krijgt de rode ring bij focus (${thema})`, async ({ page }) => {
      await page.goto('/index.html');
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), thema);

      const lees = () => page.evaluate(() => {
        const regel = getComputedStyle(document.querySelector('.hero-terminal .terminal-input-line'));
        return {
          ring: `${regel.outlineStyle} ${regel.outlineWidth} ${regel.outlineColor}`,
          kop: getComputedStyle(document.querySelector('.af-term-kop')).boxShadow,
          invoer: regel.boxShadow,
        };
      });
      const rust = await lees();
      await page.locator('#typing-target').click();
      const focus = await lees();

      expect(rust.ring, 'de ring staat er al vóór de focus').not.toContain(SIGNAAL_ROOD);
      expect(focus.ring, 'invoerregel zonder rode ring bij focus').toBe(`solid 2px ${SIGNAAL_ROOD}`);
      // Geen zijstreep meer, in geen van beide toestanden.
      expect([rust.kop, rust.invoer, focus.kop, focus.invoer].filter((b) => b.includes('204, 10, 30')), 'rode zijstreep op kop of invoerregel').toEqual([]);
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
  // dekte bij scrollpositie 0 af wat daar toevallig lag. Gemeten over zes telefoonmaten in
  // Sessie 215, met consent gezet zodat dit de balk meet en niet de cookiebanner — en tegen
  // `git archive HEAD` op een tweede server, zodat "pre-existing" een meting was en geen
  // aanname. Oud en nieuw gaven toen een byte-identieke uitkomst:
  //
  //   375×812 · 412×915 · 768×1024 → geen chip bedekt
  //   360×800 · 390×844            → `whoami`, `pwd`, `help` bedekt door de balk
  //
  // Die tweede regel stond hier als BASELINE vastgelegd in plaats van als notitie, precies
  // zodat hij zou terugmelden wanneer de balk gefixt werd. Dat moment is Sessie 216: de balk
  // stapt nu opzij zodra het midden van een primaire CTA vrij in beeld ligt, en bij
  // scrollpositie 0 is dat op élke gemeten maat de hero-CTA. Alle drie de lijsten staan
  // daarom op `[]` — de test is van "de bedekking groeit niet" een regressiewacht geworden
  // op "er wordt niets bedekt". 360×800 is erbij gezet; die maat stond in het commentaar
  // maar niet in de map, dus de conditie werd daar niet bewaakt.
  //
  // Deze test bewaakt dus twee dingen: dat de hint de chips niet verder omlaag duwt, en dat
  // geen enkele chip door de balk (of iets anders) wordt afgedekt.
  const BASELINE_BEDEKT = {
    '360x800': [],
    '375x812': [],
    '390x844': []
  };

  for (const [maat, baseline] of Object.entries(BASELINE_BEDEKT)) {
    const [width, height] = maat.split('x').map(Number);

    test(`@${maat} dekt niets de suggestiechips af`, async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem(
          'hacksim_analytics_consent',
          JSON.stringify({ necessary: true, analytics: true })
        );
      });
      await page.setViewportSize({ width, height });
      await page.goto('/index.html');

      // De balk beslist pas zodra landing-demo.js heeft gedraaid; `data-state` bewijst dat.
      // Zonder deze wacht meet je de CSS-default (zichtbaar) en is de test groen om de
      // verkeerde reden — of rood op een pagina die niets mankeert.
      await page.waitForFunction(() => document.querySelector('.mobile-cta-bar[data-state]'));

      const meting = await page.evaluate(() => {
        const bar = document.querySelector('.mobile-cta-bar');
        // Exact het criterium uit landing-demo.js `middenVrij()`: het midden van een
        // CTA is aantikbaar als het onder de sticky navbar en boven de balkrand ligt.
        // Overgetikt zou dit een tweede waarheid worden die kan driften, dus beide
        // grenzen komen uit dezelfde bronnen als de implementatie.
        const navHoogte = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
        ) || 0;
        const balkRand = bar && bar.getBoundingClientRect().height
          ? bar.getBoundingClientRect().top
          : window.innerHeight;
        const middenVrij = [...document.querySelectorAll('a.btn-cta[href="/terminal.html"]')]
          .filter((a) => !bar || !bar.contains(a))
          .some((a) => {
            const r = a.getBoundingClientRect();
            if (!r.height) return false;
            const mid = r.top + r.height / 2;
            return mid >= navHoogte && mid <= balkRand;
          });
        return {
          middenVrij,
          hintZichtbaar:
            getComputedStyle(document.querySelector('.hero-terminal-hint')).display !== 'none',
          barState: bar ? bar.dataset.state : null,
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

      // Deze assertie stond tot Sessie 236 op `false`: de hint kostte 30px en duwde de
      // tweede chiprij op 375×812 van midden-736 naar midden-764, terwijl de balk vanaf
      // y=747 vastzat — een tik op `whoami` navigeerde dan wég. Sinds de hero herschikt
      // is staat de terminal bovenaan de pagina in plaats van als tweede kolom, en
      // landen de chips honderden pixels hoger dan die balk. De aanleiding is dus weg,
      // en de hint is de enige zin die zegt dat het venster leeft — juist op het
      // apparaat waar tikken goedkoper is dan typen. De conditie die de verberging
      // rechtvaardigde staat hieronder nog steeds, en bewaakt de omkering.
      expect(meting.hintZichtbaar, 'de hint hoort op mobiel zichtbaar te zijn').toBe(true);

      // Tot Sessie 236 stond hier `toBe('verborgen')`: in de tweekoloms-hero stond de
      // hero-CTA op elke gemeten maat bij scrollpositie 0 in beeld, dus hoorde de balk
      // weg te zijn. In de herschikte hero is dat niet meer universeel waar — gemeten
      // met de CTA-midden op y=809: op 390x844, 412x915 en 768x1024 ligt dat midden vrij
      // in beeld en blijft de balk weg, op 360x800 en 375x812 niet en verschijnt hij.
      //
      // Dát is precies het contract van de balk, dus de assertie moet het contract
      // toetsen en niet de uitkomst van één layout: er is altijd een primaire actie
      // bereikbaar, hetzij de hero-CTA, hetzij de balk. Een balk die aan staat terwijl
      // de CTA ruim in beeld ligt is nog steeds fout, en een balk die uit blijft terwijl
      // de CTA weg is ook.
      // landing-demo.js belooft in zijn eigen commentaar één conditie zonder gat en
      // zonder overlap: "balk verborgen ⟺ CTA-midden aantikbaar". Dat is de invariant,
      // en die toetsen we in beide richtingen. Gemeten @375x812 in de herschikte hero:
      // CTA-midden op y=809, balkrand op y=747 — dus níét vrij, dus balk zichtbaar.
      // Dat is de balk die zijn werk doet, niet een regressie.
      // Sinds sessie 241 blijft de balk óók weg zolang hij een chip zou afdekken. Op
      // scrollpositie 0 staat op geen van deze maten een chip in de balkzone (gemeten),
      // dus hier geldt de oorspronkelijke invariant nog letterlijk; het chipvenster zelf
      // bewaakt "geen enkele chip valt onder de mobiele CTA-balk" hieronder.
      expect(meting.barState, meting.middenVrij
        ? 'CTA-midden is aantikbaar, dus de balk hoort weg te zijn'
        : 'CTA-midden is niet aantikbaar, dus de balk hoort er te staan')
        .toBe(meting.middenVrij ? 'verborgen' : 'zichtbaar');

      const bedekt = meting.chips.filter((c) => c.meetbaar && !c.raakbaar);
      const nieuw = bedekt
        .filter((c) => !baseline.includes(c.cmd))
        .map((c) => `${c.cmd} (midden ${c.midden}, balk vanaf ${meting.barTop}) → ${c.door}`);

      expect(nieuw, `bedekte chips: ${nieuw.join(' | ')}`).toEqual([]);
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

  // Finish review s250: het rode blok stond 2ch rechts van waar je eerste letter komt (gap
  // van 1ch plus het rustveld van 1ch ervoor). De toets hierboven liet 24px toe en zag het niet.
  for (const breedte of [1440, 375]) {
    test(`@${breedte}px staat het rode blok precies waar je eerste letter komt`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => {
        const c = document.querySelector('.af-term .cursor').getBoundingClientRect();
        const i = document.getElementById('typing-target').getBoundingClientRect();
        return { cursor: c.left, invoer: i.left, breedte: c.width, zichtbaar: getComputedStyle(document.querySelector('.af-term .cursor')).display !== 'none' };
      });
      expect(m.zichtbaar && m.breedte > 4, 'het blok staat niet in beeld: dan meet dit niets').toBe(true);
      expect(Math.abs(m.cursor - m.invoer), `blok ${(m.cursor - m.invoer).toFixed(1)}px naast het invoerpunt`).toBeLessThanOrEqual(1);
    });
  }

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

// ===========================================================================
// De herschikte hero (Sessie 236, omgedraaid in sessie 2b)
//
// Sessie 236 zette de terminal boven de kop: in de tweekoloms-hero vertelde de kop links
// wat rechts al te zien was. In het affiche bleek het omgekeerde het probleem. Gemeten
// op 1440x900: zeven lagen van gelijk gewicht en het enige grote typografische moment
// (de kop, 761-888) plus de rode actie tegen de onderrand; op 375px stond de kop op
// y=947. Geen instappunt. De kop staat nu bovenaan als het beeld van het affiche, met de
// actie ernaast; de terminal is het bewijs eronder. De reden van Sessie 236 (twee
// kolommen van gelijk gewicht) bestaat niet meer: kop en terminal staan onder elkaar.
// ===========================================================================

test.describe('Hero-volgorde en mobiele bereikbaarheid', () => {
  test.describe.configure({ timeout: 120_000 });

  test('de kop staat vóór de terminal, in de DOM én op het scherm', async ({ page }) => {
    // Geen `order:`-truc: die laat de focusvolgorde achter bij de layout. Beide
    // assertierichtingen staan hier, zodat een herintroductie op één van de twee rood
    // wordt. De actie hoort bij de kop: ook zij staat boven de terminal.
    for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
      await page.setViewportSize(viewport);
      await page.goto('/index.html');

      const m = await page.evaluate(() => {
        const term = document.querySelector('.hero-terminal-col');
        const tekst = document.querySelector('.hero-text');
        const cta = document.querySelector('#hero a.btn-cta');
        return {
          domVolgorde: tekst.compareDocumentPosition(term) & Node.DOCUMENT_POSITION_FOLLOWING ? 'tekst-eerst' : 'terminal-eerst',
          terminalTop: Math.round(term.getBoundingClientRect().top),
          tekstTop: Math.round(tekst.getBoundingClientRect().top),
          ctaBodem: Math.round(cta.getBoundingClientRect().bottom),
        };
      });

      expect(m.domVolgorde, `@${viewport.width}px: DOM-volgorde`).toBe('tekst-eerst');
      expect(m.tekstTop, `@${viewport.width}px: kop (${m.tekstTop}) hoort boven de terminal (${m.terminalTop}) te staan`)
        .toBeLessThan(m.terminalTop);
      expect(m.ctaBodem, `@${viewport.width}px: de actie (bodem ${m.ctaBodem}) hoort boven de terminal (${m.terminalTop}) te staan`)
        .toBeLessThanOrEqual(m.terminalTop);
    }
  });

  test('geen enkele chip valt onder de mobiele CTA-balk, op geen enkele scrollpositie', async ({ page }) => {
    // Dit wás de reden om .hero-terminal-hint op mobiel te verbergen: de hint kostte
    // 30px en duwde de tweede chiprij onder de vaste balk op y=747, waardoor `nmap`,
    // `whoami` en `pwd` onaantikbaar werden en een tik daar wégnavigeerde. In de
    // herschikte hero staat de terminal bovenaan en is die aanleiding verdwenen, dus de
    // hint is terug. De conditie blijft: zij hoort hier, niet in een CSS-commentaar.
    //
    // Sessie 241: tot hier meet deze test op vijf posities (0, 300, 600, 900, 1400), en
    // "op geen enkele scrollpositie" gold nooit. Per 10px gemeten dekte de balk in de
    // layout van sessie 240 chips af op 22 posities (drie engines, twee maten), steeds in
    // het venster waarin de hero-CTA net onder de navbar schoof. De vijf punten misten
    // ze; een krappere hero verschoof het venster naar precies y=300. Nu een sweep, en
    // landing-demo.js houdt de balk weg zolang hij een chip zou afdekken.
    for (const viewport of [{ width: 375, height: 812 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto('/index.html');
      await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });

      let balkGezien = 0;
      for (let y = 0; y <= 1400; y += 10) {
        await page.evaluate((sy) => window.scrollTo(0, sy), y);
        await page.waitForTimeout(80);

        const m = await page.evaluate(() => {
          const bar = document.querySelector('.mobile-cta-bar');
          const cs = bar && getComputedStyle(bar);
          const bb = bar && bar.getBoundingClientRect();
          const balkZichtbaar = !!(bar && cs.visibility !== 'hidden' && cs.display !== 'none'
            && bb.height > 0 && bb.top < window.innerHeight);
          const afgedekt = [];
          if (balkZichtbaar) {
            document.querySelectorAll('.hero-chip').forEach((c) => {
              const r = c.getBoundingClientRect();
              const inBeeld = r.bottom > 0 && r.top < window.innerHeight;
              if (inBeeld && r.bottom > bb.top && r.top < bb.bottom) afgedekt.push(c.textContent.trim());
            });
          }
          const cta = document.querySelector('[data-terminal-cta="hero"]').getBoundingClientRect();
          return {
            balkZichtbaar,
            afgedekt,
            ctaInBeeld: cta.bottom > 0 && cta.top < window.innerHeight,
            aantalChips: document.querySelectorAll('.hero-chip').length,
          };
        });

        // Zelfbewakende tak: zonder chips kan niets afgedekt zijn, en zou de test
        // groen staan zonder iets te hebben gemeten.
        expect(m.aantalChips, 'geen chips gevonden — de meting heeft niet gedraaid').toBeGreaterThan(0);
        expect(m.afgedekt, `@${viewport.width}px scroll ${y}: chip(s) onder de CTA-balk`).toEqual([]);
        expect(m.balkZichtbaar || m.ctaInBeeld,
          `@${viewport.width}px scroll ${y}: geen enkele primaire actie bereikbaar`).toBe(true);
        if (m.balkZichtbaar) balkGezien++;
      }
      // Zelfbewakend: een balk die nooit verschijnt dekt ook nooit iets af.
      expect(balkGezien, `@${viewport.width}px: de balk verscheen op geen enkele positie`).toBeGreaterThan(0);
    }
  });
});

// ===========================================================================
// De registratie (Sessie 238)
//
// Het direction contract: de Nederlandse uitleg staat per outputregel exact ernaast, op
// dezelfde rasterrij. hero-registratie.js garandeert dat door constructie (regel en glos
// zitten in één rij-element); deze meting is het bewijs in gerenderde pixels. Een
// basislijn meet je niet met getComputedStyle: een inline-block van nul hoog op de eerste
// positie van een cel zit met zijn onderrand precies op die basislijn.
// ===========================================================================

const METEN_REGISTRATIE = () => {
  const basislijn = (cel) => {
    const m = document.createElement('span');
    m.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0';
    cel.insertBefore(m, cel.firstChild);
    const y = m.getBoundingClientRect().bottom;
    m.remove();
    return y;
  };
  const body = document.querySelector('#hero-demo').getBoundingClientRect();
  return [...document.querySelectorAll('#hero-demo .reg')]
    .filter((r) => r.querySelector('.reg-glos').textContent.trim())
    .map((r) => {
      const regel = r.querySelector('.terminal-line');
      const glos = r.querySelector('.reg-glos');
      const rg = regel.getBoundingClientRect();
      const gg = glos.getBoundingClientRect();
      return {
        tekst: regel.textContent.trim().slice(0, 24),
        basisDelta: Math.abs(basislijn(regel) - basislijn(glos)),
        rasterDelta: Math.abs(gg.left - (body.left + body.width * 7 / 12)),
        glosOnder: gg.top - rg.bottom,
        glosLinks: gg.left - rg.left,
      };
    });
};

test.describe('De registratie: regel en glos op dezelfde rasterrij', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const thema of ['light', 'dark']) {
    test(`@1440px ${thema}: elke glos staat op de basislijn van zijn regel`, async ({ page }) => {
      await page.goto('/index.html');
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), thema);
      await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });

      const rijen = await page.evaluate(METEN_REGISTRATIE);
      // Zelfbewakend: het nmap-frame draagt vijf of meer glossen. Nul rijen is geen groen.
      expect(rijen.length, 'geen rijen met glos — de meting heeft niet gedraaid').toBeGreaterThanOrEqual(4);

      const scheef = rijen.filter((r) => r.basisDelta > 1).map((r) => `${r.tekst}: ${r.basisDelta.toFixed(1)}px`);
      expect(scheef, 'glos niet op de basislijn van zijn regel').toEqual([]);
      const vanRaster = rijen.filter((r) => r.rasterDelta > 1).map((r) => `${r.tekst}: ${r.rasterDelta.toFixed(1)}px`);
      expect(vanRaster, 'glos begint niet op de rasterlijn na zeven kolommen').toEqual([]);

      // Het instrument ziet een verschuiving: een glos die 4px zakt moet vuren.
      await page.addStyleTag({ content: '.reg-glos{transform:translateY(4px)}' });
      const na = await page.evaluate(METEN_REGISTRATIE);
      expect(na.every((r) => r.basisDelta >= 3), 'de meting ziet een verschoven glos niet').toBe(true);
    });
  }

  // Sessie 240: `7fr 5fr` verdeelde de ruimte BINNEN de scrollbalk. Een klassieke balk
  // (10px, Linux/Windows) schoof de naad 5,8px van .af-term-kop af, precies bij nmap. De
  // testbrowsers draaien met overlaybalken, dus padding-right simuleert hem: die krimpt de
  // contentbox op dezelfde manier. Mutant `7fr 5fr` terug -> 5,8px, deze assertie.
  test('@1440px de naad blijft op de rasterlijn als het lichaam smaller wordt', async ({ page }) => {
    await page.goto('/index.html');
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
    await neemOver(page);
    await typ(page, 'nmap 192.168.1.1');

    const meet = () => page.evaluate(() => ({
      cel: document.querySelector('#hero-demo .reg .terminal-line').getBoundingClientRect().right,
      kop: document.querySelector('.af-term-kop').getBoundingClientRect().right,
      rij: document.querySelector('#hero-demo .reg').getBoundingClientRect().width
    }));
    const voor = await meet();
    await page.evaluate(() => { document.getElementById('hero-demo').style.paddingRight = '10px'; });
    const na = await meet();

    // Zelfbewakend: zonder krimp bewijst gelijke naden niets.
    expect(voor.rij - na.rij, 'de gesimuleerde scrollbalk kromp het lichaam niet').toBeGreaterThanOrEqual(9);
    expect(Math.abs(na.cel - na.kop), `naad ${na.cel.toFixed(1)} tegen kop ${na.kop.toFixed(1)}`).toBeLessThanOrEqual(0.5);
  });

  test('@390px staat de glos onder zijn regel, in dezelfde rij', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/index.html');
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });

    const rijen = await page.evaluate(METEN_REGISTRATIE);
    expect(rijen.length, 'geen rijen met glos — de meting heeft niet gedraaid').toBeGreaterThanOrEqual(4);
    const fout = rijen.filter((r) => r.glosOnder < -1 || r.glosOnder > 2).map((r) => `${r.tekst}: ${r.glosOnder}px`);
    expect(fout, 'glos staat niet direct onder zijn regel').toEqual([]);
  });
});

// ==================== Sessie 249-250: de hero zonder diagram ====================
// Proef V3 (sessie 249) haalde het netwerkdiagram uit de hero: te veel lagen. Wat het diagram
// bewaakte, verhuist naar wat er nu staat: de terminal, zijn glos en zijn toetsenrij. De oude
// blokken "Het diagram antwoordt", "De vouw" (poorten) en "De scan" zijn hierdoor vervangen.

// Sessie 250 (eigenaar): "cat en help tonen geen tekst bij 'in gewoon Nederlands'". Regels die
// al Nederlands zijn kregen bewust geen vertaling, en dan stond de kolom helemaal leeg. Nu
// heeft elke reeks minstens één glos: wat er gebeurt, of waar de naam vandaan komt.
test.describe('Elke reeks heeft Nederlands ernaast', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('elk command, ook help, cat en een fout, krijgt minstens één glos', async ({ page }) => {
    await page.goto('/index.html');
    await neemOver(page);
    const invoer = [...DEMO_COMMANDS.map((d) => d.cmd), 'cat README.txt', 'nmap 10.0.0.1', 'lss'];
    const zonder = [];
    let gemeten = 0;
    for (const cmd of invoer) {
      await typ(page, cmd);
      const n = await page.evaluate(() => {
        const rijen = [...document.querySelectorAll('#hero-demo .reg')];
        const laatstePrompt = rijen.map((r) => r.classList.contains('reg--prompt')).lastIndexOf(true);
        return rijen.slice(laatstePrompt + 1).filter((r) => r.querySelector('.reg-glos').textContent.trim()).length;
      });
      gemeten++;
      if (n < 1) zonder.push(cmd);
    }
    expect(gemeten, 'niet elke invoer is gemeten').toBe(invoer.length);
    expect(zonder, 'een reeks zonder Nederlands ernaast: de kolom staat leeg').toEqual([]);
  });

  test('help legt bij elk command uit waar zijn naam vandaan komt', async ({ page }) => {
    await page.goto('/index.html');
    await neemOver(page);
    await typ(page, 'help');
    const rijen = await page.evaluate(() => [...document.querySelectorAll('#hero-demo .reg')]
      .map((r) => [r.querySelector('.terminal-line').textContent.trim(), r.querySelector('.reg-glos').textContent.trim()])
      .filter(([t]) => /^(ls|cat|pwd|whoami|nmap)\s/.test(t)));
    // Zelfbewakend: de vijf commandregels van help zijn gevonden.
    expect(rijen.length, 'de commandregels van help niet gevonden').toBe(5);
    expect(rijen.filter(([, g]) => !g).map(([t]) => t), 'een command in help zonder glos').toEqual([]);
  });
});

// De vouw (sessie 241, herzien 250). Tot sessie 249 bewaakte dit de poorten van het diagram
// boven de vouw. Nu: de terminal met zijn invoerregel en de hele toetsenrij, op 1440x900 en
// 1280x800 (gemeten na de lucht van sessie 250: chips onder op 821 en 793). Op 1024 de hele
// terminal met zijn uitnodiging. De terminal houdt zijn zeven regels: zonder die tak haal je
// de vouw door hem in te korten.
test.describe('De vouw: terminal en toetsenrij in beeld', () => {
  async function meet(page, viewport) {
    await page.addInitScript(() => {
      localStorage.setItem('hacksim_analytics_consent', JSON.stringify({ necessary: true, analytics: false }));
    });
    await page.setViewportSize(viewport);
    await page.goto('/index.html');
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
    await page.evaluate(() => document.fonts.ready);
    return page.evaluate(() => {
      const r = (s) => document.querySelector(s).getBoundingClientRect();
      const body = document.querySelector('.af-term .terminal-body');
      return {
        vh: window.innerHeight,
        rij: parseFloat(getComputedStyle(body).lineHeight),
        bodyHoogte: body.getBoundingClientRect().height,
        venster: body.clientHeight,
        invoer: r('.af-term .terminal-input-line'),
        chips: r('#hero-chips'),
        hint: r('.af-hint'),
        glosKop: r('.af-glos-kop'),
        termKop: r('.af-term-kop')
      };
    });
  }

  for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 800 }]) {
    test(`@${viewport.width}x${viewport.height} staan invoerregel en toetsenrij boven de vouw`, async ({ page }) => {
      const m = await meet(page, viewport);
      expect(m.chips.height, 'toetsenrij zonder hoogte').toBeGreaterThan(40);
      expect(m.venster, `het venster is geen 7 regels van ${m.rij}px meer`).toBe(7 * m.rij);
      expect(m.bodyHoogte, 'de rand boven en onder is geen 8px meer').toBe(7 * m.rij + 16);
      expect(m.invoer.bottom, `invoerregel eindigt op ${Math.round(m.invoer.bottom)}`).toBeLessThanOrEqual(m.vh);
      expect(m.chips.bottom, `toetsenrij eindigt op ${Math.round(m.chips.bottom)}, de vouw ligt op ${m.vh}`).toBeLessThanOrEqual(m.vh);
    });
  }

  test('@1024x768 staat de hele terminal met zijn uitnodiging boven de vouw', async ({ page }) => {
    const m = await meet(page, { width: 1024, height: 768 });
    expect(m.invoer.height, 'invoerregel zonder hoogte').toBeGreaterThan(0);
    expect(m.invoer.bottom, `invoerregel eindigt op ${Math.round(m.invoer.bottom)}`).toBeLessThanOrEqual(m.vh);
    expect(m.hint.bottom, `uitnodiging eindigt op ${Math.round(m.hint.bottom)}`).toBeLessThanOrEqual(m.vh);
  });

  // De kolomkop en de uitnodiging kregen hun ruimte terug door op de rij van hun
  // terminaltegenhanger te gaan staan; zakt een van beide terug naar een eigen rij, dan
  // is de vouw weer een regel kwijt.
  test('@1280 staan kolomkop en uitnodiging op de rij van terminalkop en invoerregel', async ({ page }) => {
    const m = await meet(page, { width: 1280, height: 800 });
    const midden = (b) => b.top + b.height / 2;
    expect(m.glosKop.left, 'kolomkop staat niet rechts van de module').toBeGreaterThanOrEqual(m.termKop.right - 1);
    expect(Math.abs(midden(m.glosKop) - midden(m.termKop)), 'kolomkop niet op de rij van de terminalkop')
      .toBeLessThanOrEqual(2);
    expect(m.hint.left, 'uitnodiging staat niet rechts van de module').toBeGreaterThanOrEqual(m.invoer.right - 1);
    expect(Math.abs(midden(m.hint) - midden(m.invoer)), 'uitnodiging niet op de rij van de invoerregel')
      .toBeLessThanOrEqual(2);
  });
});

// Sessie 250: na help stond de [TIP] half afgesneden onderaan, na cat een halve oude regel
// bovenaan. Drie oorzaken, alle drie gerepareerd: rijen van 28 (de glos zakte 1px voor de
// basislijn), een venster van 7,6 regels (padding scrolde mee), en toonCommand zette de
// prompt op de rand. Nu valt de rand van het venster altijd tussen twee regels.
// Finish review s250: na `cat notes.txt` brak item 1 zacht terug naar kolom 0, terwijl item 2
// zijn eigen harde vervolgregel van drie spaties heeft (zo staat het in het bestand). Een zachte
// omslag springt nu evenveel in. Op 320 breekt item 1 in elke engine.
test.describe('Een zachte omslag springt in zoals het bestand zelf', () => {
  test('@320px staat de omslag van item 1 op de lijn van "iets werkt"', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/index.html');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.hero-chip[data-command="cat notes.txt"]').click();
    await expect(page.locator('#hero-demo')).toContainText('iets werkt');
    const m = await page.evaluate(() => {
      const regels = [...document.querySelectorAll('#hero-demo .terminal-line')];
      const hard = regels.find((l) => l.textContent.startsWith('   iets werkt'));
      const g = document.createRange(); g.setStart(hard.firstChild, 3); g.setEnd(hard.firstChild, 4);
      const lijn = g.getBoundingClientRect().left;
      // Alleen tekstknopen: een range over een regel met een <span> (de [~]- of [TIP]-regel)
      // geeft ook de box van het element, met een iets andere top, en die telde als rij.
      const vervolg = regels.flatMap((l) => {
        const w = document.createTreeWalker(l, NodeFilter.SHOW_TEXT); const rs = [];
        for (let n = w.nextNode(); n; n = w.nextNode()) { const r = document.createRange(); r.selectNodeContents(n); rs.push(...r.getClientRects()); }
        const rij = new Map();
        rs.forEach((x) => { const k = Math.round(x.top / 4); if (!rij.has(k) || x.left < rij.get(k).left) rij.set(k, { left: x.left, tekst: l.textContent.slice(0, 20) }); });
        return [...rij.values()].slice(1);
      });
      return { lijn, vervolg };
    });
    expect(m.vervolg.length, 'geen enkele regel brak: dan toetst dit niets').toBeGreaterThan(0);
    const scheef = m.vervolg.filter((x) => Math.abs(x.left - m.lijn) > 1.5).map((x) => `${(x.left - m.lijn).toFixed(1)} in "${x.tekst}"`);
    expect(scheef, 'een zachte omslag staat niet op de lijn van de harde vervolgregel').toEqual([]);
  });
});

test.describe('Het venster staat op hele regels', () => {
  for (const vp of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
    test(`@${vp.width}px: na elke chip staat geen regel half in beeld`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);
      const fouten = [];
      let geschoven = 0;
      let rijenGeteld = 0;
      for (const { cmd } of DEMO_COMMANDS) {
        await page.locator(`.hero-chip[data-command="${cmd}"]`).click();
        await expect(page.locator('#hero-demo')).toContainText(`$ ${cmd}`);
        const r = await page.evaluate(() => {
          const body = document.getElementById('hero-demo');
          const b = body.getBoundingClientRect();
          const cs = getComputedStyle(body);
          const rij = parseFloat(cs.lineHeight);
          // Het venster is de paddingbox: binnen de rand, daar knipt overflow af.
          const boven = b.top + parseFloat(cs.borderTopWidth);
          const onder = b.bottom - parseFloat(cs.borderBottomWidth);
          const rijen = [...body.children].map((x) => x.getBoundingClientRect())
            .filter((x) => x.bottom > boven + 0.5 && x.top < onder - 0.5);
          // Een rij kan meer regels hoog zijn (onder 768 staat de glos onder zijn regel); de
          // rand mag dan tussen regel en glos vallen. Wat niet mag: een rij die niet op een
          // hele regel vanaf de rand begint, want dan snijdt de rand door tekst.
          const opRegel = (x) => { const v = (x.top - boven) / rij; return Math.abs(v - Math.round(v)) < 0.02; };
          return {
            scrollTop: body.scrollTop, n: rijen.length,
            vensterRegels: (onder - boven) / rij,
            half: rijen.filter((x) => !opRegel(x)).map((x) => `${(x.top - boven).toFixed(1)}..${(x.bottom - boven).toFixed(1)}`),
            scheef: rijen.filter((x) => Math.abs(x.height / rij - Math.round(x.height / rij)) > 0.02).map((x) => x.height.toFixed(1)),
          };
        });
        if (r.scrollTop > 0) geschoven++;
        // Ook de onderrand: een venster van 7,6 regels toont onderaan altijd een strook.
        if (Math.abs(r.vensterRegels - Math.round(r.vensterRegels)) > 0.02) fouten.push(`${cmd}: venster is ${r.vensterRegels.toFixed(2)} regels`);
        rijenGeteld += r.n;
        if (r.half.length) fouten.push(`${cmd}: half in beeld ${r.half.join(', ')}`);
        if (r.scheef.length) fouten.push(`${cmd}: rij geen veelvoud van de regel: ${r.scheef.join(', ')}`);
      }
      // Zelfbewakend: er is gemeten, en het venster is ook echt geschoven (anders toetst de
      // rand niets: een korte uitvoer klemt gewoon op de bodem).
      expect(rijenGeteld, 'geen rijen in het venster gemeten').toBeGreaterThan(DEMO_COMMANDS.length);
      expect(geschoven, 'het venster schoof bij geen enkel command').toBeGreaterThan(0);
      expect(fouten).toEqual([]);
    });
  }
});

// De reeks (sessie 247, zonder diagram sinds 249). Het memorabele moment speelt zonder klik:
// bij laden rolt het nmap-frame regel voor regel uit, één keer. De rijen staan meteen in de
// DOM; het beeld wacht (clip-path per regel). Gelezen via animationstart, want het moment ís
// de timing.
test.describe('De reeks: het moment speelt bij laden', () => {
  const voorbereid = (page) => page.addInitScript(() => {
    localStorage.setItem('hacksim_analytics_consent', JSON.stringify({ necessary: true, analytics: false }));
    window.__rol = [];
    document.addEventListener('animationstart', (e) => {
      if (/^af-/.test(e.animationName)) window.__rol.push(e.animationName);
    });
  });
  const leesLog = (page) => page.evaluate(() => window.__rol.splice(0));

  test('@1440x900 rolt het nmap-frame bij laden uit, en niet nog eens', async ({ page }) => {
    await voorbereid(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/index.html');
    await page.waitForTimeout(1500);
    const bijLaden = await leesLog(page);
    // De regels in het venster: zeven, de prompt valt erboven.
    expect(bijLaden.filter((n) => n === 'af-rol').length, 'bij laden rolt de reeks niet uit').toBeGreaterThanOrEqual(6);
    expect(bijLaden.filter((n) => n !== 'af-rol'), 'een tweede beweging naast de registratie').toEqual([]);
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1200);
    expect(await leesLog(page), 'de reeks speelt opnieuw bij terugscrollen: dat was de replay van het diagram').toEqual([]);
  });

  test('elke regel rolt 90ms na de vorige, in de volgorde van de uitvoer', async ({ page }) => {
    await voorbereid(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/index.html');
    await neemOver(page);
    await typ(page, 'nmap 192.168.1.1');
    const ms = await page.evaluate(() => [...document.querySelectorAll('#hero-demo .reg.is-rol:not(.reg--prompt)')]
      .map((r) => parseFloat(r.style.getPropertyValue('--reg-vertraging'))));
    expect(ms.length, 'geen rollende regels: de reeks heeft niet gespeeld').toBeGreaterThan(3);
    expect(ms, 'de regels rollen niet om de 90ms').toEqual(ms.map((_, i) => i * 90));
  });

  test('reduced motion: de eindstand meteen, bij laden en bij zelf typen', async ({ page }) => {
    await voorbereid(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/index.html');
    const staat = () => page.evaluate(() => ({
      reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
      rol: document.querySelectorAll('.reg.is-rol').length,
      regels: document.querySelectorAll('#hero-demo .reg').length,
    }));
    const m = await staat();
    expect(m.reduce, 'reduced motion kwam niet aan; de test meet het standaardgedrag').toBe(true);
    expect(m.regels, 'het nmap-frame staat er niet').toBeGreaterThan(6);
    expect(m.rol, 'bij laden onder reduced motion: toch een reeks').toBe(0);

    // Het tweede pad: de auto-demo roept lichtOp onder reduce niet eens aan, dus alleen het
    // getypte command toetst de eigen weigering van lichtOp.
    await neemOver(page);
    await typ(page, 'nmap 192.168.1.1');
    const t = await staat();
    expect(t.rol, 'zelf typen onder reduced motion: de uitvoer rolt toch uit').toBe(0);
    await page.waitForTimeout(300);
    expect(await leesLog(page), 'er startten animaties onder reduced motion').toEqual([]);
  });
});
