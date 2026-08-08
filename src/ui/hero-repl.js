/**
 * hero-repl.js — interactieve hero-terminal op de homepage (Sessie 214)
 *
 * De hero toonde een terminalvenster met prompt en knipperende cursor dat niets deed.
 * Voor een product waarvan de belofte "typ commands, veilig" is, mocht de bezoeker het
 * product pas ervaren ná een klik plus een paginalading. Nu typt hij meteen.
 *
 * Bewuste grenzen:
 * - GEEN import van de echte engine. Terminal Core zit al ~37% boven het 400 KB-budget
 *   (TASKS.md); dit is een eigen responsemap van een paar KB. `findClosestCommand` uit
 *   src/utils/fuzzy.js is de enige gedeelde code — die bestond al.
 * - Het blijft een demo. Zes commands, dat staat er ook, en elke doodlopende weg wijst
 *   naar de volledige simulator.
 * - Alle uitvoer is afgeleid uit de échte bron (zie de verwijzingen per command), niet
 *   verzonnen. De vorige hand-geschreven demo toonde bestanden die niet bestonden.
 */

import { findClosestCommand } from '../utils/fuzzy.js';
import events from '../analytics/events.js';

const outputEl = document.getElementById('hero-demo');
const inputEl = document.getElementById('typing-target');
const bodyEl = document.querySelector('.hero-terminal .terminal-body');
const chipsEl = document.getElementById('hero-chips');
const kolomEl = document.querySelector('.hero-terminal-col');

// Op elke andere pagina bestaan deze elementen niet — stil stoppen.
if (outputEl && inputEl && bodyEl) {
  initHeroRepl();
}

function initHeroRepl() {
  const PROMPT = 'hacker@hacksim:~$';
  const MAX_REGELS = 120;          // begrenst het geheugen bij lang doorspelen
  const MAX_INVOER = 60;           // langere invoer is geen command maar geplakte tekst

  // De begeleidingsvolgorde: van "wat staat hier" naar "wat kan ik ermee".
  const SUGGESTIES = ['ls', 'cat notes.txt', 'nmap 192.168.1.1', 'whoami', 'pwd', 'help'];

  const DEMO_COMMANDS = ['help', 'ls', 'cat', 'nmap', 'whoami', 'pwd'];
  const CTA_LABEL = 'Start de simulator';   // sitebreed label; letterlijk citeren

  let overgenomen = false;
  let afgerond = false;
  const gedaan = new Set();

  // ==================== Responsemap ====================
  // `smal` wordt gekozen onder 768px en blijft binnen 40 tekens, precies zoals de engine
  // dat doet via isMobileView() (utils/box-utils.js:101-107). De nmap-tabel is in het
  // origineel 60-77 tekens breed en past anders niet op een telefoon.
  const RESPONSES = {
    // src/commands/system/whoami.js:11-13 + core/terminal.js:45
    whoami: {
      breed: ['hacker', '[TIP] Je bent `hacker`, geen root — dat scheelt ongelukken.'],
      smal: ['hacker', '[TIP] Je bent `hacker`, geen root.']
    },
    // src/commands/filesystem/pwd.js:12-22 + filesystem/structure.js:211-213
    pwd: {
      breed: ['/home/hacker', '[TIP] ~ is de korte schrijfwijze voor /home/hacker.'],
      smal: ['/home/hacker', '[TIP] ~ is korter voor /home/hacker.']
    },
    // src/commands/filesystem/ls.js:11-28 — dirs eerst, dan files, gescheiden door 2 spaties
    ls: {
      breed: [
        'documents/  notes.txt  README.txt',
        '[TIP] Lees een bestand met: cat notes.txt'
      ],
      smal: ['documents/  notes.txt  README.txt', '[TIP] Lees er een: cat notes.txt']
    },
    help: {
      breed: [
        'Deze demo kent 6 commands:',
        '  ls      Toon bestanden',
        '  cat     Lees een bestand',
        '  pwd     Waar ben ik nu?',
        '  whoami  Wie ben ik?',
        '  nmap    Scan poorten',
        '[TIP] De volledige simulator kent 40+ commands en een leerpad.'
      ],
      smal: [
        'Deze demo kent 6 commands:',
        '  ls      Toon bestanden',
        '  cat     Lees een bestand',
        '  pwd     Waar ben ik nu?',
        '  whoami  Wie ben ik?',
        '  nmap    Scan poorten',
        '[TIP] De simulator kent er 40+.'
      ]
    }
  };

  // Echte bestandsinhoud uit de VFS (filesystem/structure.js:19-54), ingekort met een
  // zichtbare markering. Verkorten zonder dat te zeggen zou het bestand vervalsen.
  const BESTANDEN = {
    'notes.txt': [
      'Mijn aantekeningen:',
      '1. Leer eerst de basis terminal commands',
      "2. Gebruik 'man [command]' als je niet weet hoe",
      '   iets werkt',
      '3. Verken het bestandssysteem met ls en cd'
    ],
    'README.txt': [
      'Welkom bij HackSimulator.nl!',
      'Dit is een veilige omgeving om ethisch',
      'hacken te leren. Alle activiteiten zijn',
      'gesimuleerd en raken geen echte systemen.'
    ]
  };

  const DIRECTORIES = ['documents', 'documents/'];

  /**
   * Analytics mag de demo nooit breken. Twee redenen om dit te omhullen:
   *  1. `events.js` is deze sessie uitgebreid, maar relatief geïmporteerde submodules
   *     dragen geen `?v=` — een terugkerende bezoeker kan tot `max-age` (3600s) een
   *     oude events.js uit cache krijgen zonder deze methodes (zie het cache-patroon in
   *     .claude/rules/architecture-patterns.md);
   *  2. de tracker praat met gtag, en dat is code van derden.
   */
  function meld(naam, arg) {
    try {
      if (typeof events[naam] === 'function') events[naam](arg);
    } catch (e) {
      /* stil: een meetfout is geen reden om de bezoeker zijn terminal af te pakken */
    }
  }

  function isSmal() {
    return window.innerWidth < 768;
  }

  function kies(paar) {
    return (isSmal() ? paar.smal : paar.breed).slice();
  }

  // ==================== Command-afhandeling ====================
  function respons(invoer) {
    const delen = invoer.trim().split(/\s+/);
    const naam = delen[0].toLowerCase();
    const args = delen.slice(1);

    if (naam === 'cat') return catRespons(args);
    if (naam === 'nmap') return nmapRespons(args);
    // Object.hasOwn en niet `RESPONSES[naam]`: de invoer komt van de bezoeker, en
    // `constructor`, `toString` en `__proto__` zijn allemaal truthy op een object-literal.
    // `kies()` liep daar stuk op `undefined.slice()` — de hele REPL blokkeerde op één
    // getypt woord.
    if (Object.hasOwn(RESPONSES, naam)) return kies(RESPONSES[naam]);
    // Het origineel terugmelden, niet de kleingemaakte vorm: wie `toString` typt hoort
    // `toString` terug te krijgen, niet `tostring`.
    return onbekend(delen[0]);
  }

  // src/commands/filesystem/cat.js:48-50, :66, :70
  function catRespons(args) {
    if (args.length === 0) {
      return [
        'cat: missing file operand',
        isSmal()
          ? '[TIP] Gebruik: cat notes.txt'
          : "[TIP] Gebruik 'cat <bestand>'. Bijvoorbeeld: cat notes.txt"
      ];
    }
    const pad = args[0].replace(/^\.\//, '');
    if (DIRECTORIES.includes(pad)) {
      return [`cat: ${pad}: Is a directory`, "[TIP] cat werkt op bestanden, ls op mappen."];
    }
    const inhoud = Object.hasOwn(BESTANDEN, pad) ? BESTANDEN[pad] : null;
    if (inhoud) {
      return inhoud.concat([
        isSmal()
          ? '[~] Ingekort — zie de simulator.'
          : '[~] Ingekort. De volledige simulator toont het hele bestand.'
      ]);
    }
    return [
      `cat: ${pad}: No such file or directory`,
      isSmal()
        ? "[TIP] Typ 'ls' om te zien wat er is."
        : "[TIP] Gebruik 'ls' om te zien welke bestanden er zijn."
    ];
  }

  // src/commands/network/nmap.js:32-39 (router-profiel), :93, :112-167
  function nmapRespons(args) {
    if (args.length === 0) {
      return [
        'nmap: missing target operand',
        '[TIP] Gebruik: nmap 192.168.1.1'
      ];
    }
    if (args[0] !== '192.168.1.1') {
      return [
        `nmap: ${args[0]} valt buiten deze demo`,
        isSmal()
          ? '[TIP] Probeer: nmap 192.168.1.1'
          : '[TIP] Probeer nmap 192.168.1.1 — de simulator scant het hele oefennetwerk.'
      ];
    }
    return isSmal()
      ? [
          'Nmap scan: 192.168.1.1',
          '',
          'PORT     STATE  SERVICE',
          '53/tcp   OPEN   DNS    ← naamserver',
          '80/tcp   OPEN   HTTP   ← onversleuteld',
          '443/tcp  OPEN   HTTPS  ← versleuteld',
          '',
          '3 open, 997 closed',
          '[TIP] Open poorten zijn ingangen.'
        ]
      : [
          'Starting Nmap scan on 192.168.1.1...',
          'Nmap scan report for 192.168.1.1',
          '',
          'PORT      STATE   SERVICE   VERSION',
          '53/tcp    OPEN    DNS       dnsmasq  ← naamserver',
          '80/tcp    OPEN    HTTP      router admin  ← onversleuteld',
          '443/tcp   OPEN    HTTPS     router admin  ← versleuteld',
          '',
          'Port summary: 3 open, 997 closed, 0 filtered',
          '[TIP] Open poorten zijn ingangen. Een pentester checkt elke service.'
        ];
  }

  // Tier 1 van het echte helpsysteem (src/help/help-system.js:78-83).
  function onbekend(naam) {
    const suggestie = findClosestCommand(naam, DEMO_COMMANDS);
    if (suggestie) {
      return [`Command not found: ${naam}`, `[TIP] Bedoelde je '${suggestie}'?`];
    }
    return [
      `Command not found: ${naam}`,
      isSmal()
        ? "[TIP] Deze demo kent er 6 — typ 'help'."
        : "[TIP] Deze demo kent 6 commands — typ 'help' voor de lijst.",
      isSmal() ? `[→] Klik op "${CTA_LABEL}".` : `[→] Klik op "${CTA_LABEL}" voor de echte terminal.`
    ];
  }

  // ==================== Rendering ====================
  /**
   * Kleurt een regel op zijn marker, net als de echte renderer (ui/renderer.js:95-121)
   * maar met het kleinere hero-palet. Bewust géén klasse op de .terminal-line zelf:
   * de hero-CSS gebruikt descendant-selectors (`.terminal-line .tip`), dus een klasse
   * op de regel matcht niets — dat kostte de eerste versie zijn kleuren.
   */
  function markerKlasse(tekst) {
    const t = tekst.trim();
    if (t.startsWith('[TIP]') || t.startsWith('[→]')) return 'tip';
    if (t.startsWith('[~]')) return 'dim';
    if (t.startsWith('[!]')) return 'warn';
    if (/^(Command not found:|cat:|nmap:)/.test(t)) return 'err';
    return null;
  }

  // Altijd textContent: de invoer komt van de bezoeker en mag nooit als HTML landen.
  function schrijf(tekst, soort) {
    const regel = document.createElement('div');
    regel.className = soort === 'prompt' ? 'terminal-line prompt' : 'terminal-line output';

    const klasse = soort === 'prompt' ? null : markerKlasse(tekst);
    if (klasse) {
      const span = document.createElement('span');
      span.className = klasse;
      span.textContent = tekst;
      regel.appendChild(span);
    } else {
      regel.textContent = tekst;
    }

    outputEl.appendChild(regel);
    return regel;
  }

  function trim() {
    while (outputEl.children.length > MAX_REGELS) outputEl.firstChild.remove();
  }

  function pinScroll() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  // ==================== Overname ====================
  function neemOver() {
    if (overgenomen) return;
    overgenomen = true;

    if (window.landingDemo && window.landingDemo.handOff) window.landingDemo.handOff();

    outputEl.innerHTML = '';
    bodyEl.classList.add('is-live');
    outputEl.setAttribute('aria-live', 'polite');
    inputEl.readOnly = false;
    inputEl.value = '';
    inputEl.placeholder = 'typ een command…';

    // De uitnodiging boven het venster is opgebruikt zodra hij is aangenomen.
    if (kolomEl) kolomEl.classList.add('is-taken');

    // De auto-demo zette een inline breedte per aanslag (zie landing-demo.js setTyped).
    // Inline verslaat de stylesheet, dus zonder dit blijft het veld één teken breed en
    // kan de bezoeker zijn eigen command niet zien.
    inputEl.style.width = '';

    // Expliciet focussen: Firefox focust het veld niet vanzelf, omdat het op het moment
    // van de mousedown nog `readonly` was (gemeten: document.activeElement bleef BODY).
    // Zonder deze regel klikt een Firefox-bezoeker de terminal aan, ziet hem live gaan,
    // en verdwijnen zijn toetsaanslagen in het niets.
    inputEl.focus();

    schrijf('Demo-terminal — 6 commands werken hier.', 'output');
    schrijf(
      isSmal() ? '[→] Typ of tik een command.' : '[→] Typ een command, of tik een suggestie.',
      'output'
    );
    pinScroll();
    markeerVolgende();

    meld('heroDemoStarted');
  }

  function markeerVolgende() {
    if (!chipsEl) return;
    const volgende = SUGGESTIES.find((s) => !gedaan.has(s));
    chipsEl.querySelectorAll('.hero-chip').forEach((chip) => {
      const cmd = chip.dataset.command;
      chip.classList.toggle('is-next', cmd === volgende);
      chip.classList.toggle('is-done', gedaan.has(cmd));
    });
  }

  function voerUit(invoer) {
    const command = invoer.trim().slice(0, MAX_INVOER);
    if (!command) return;

    schrijf(`${PROMPT} ${command}`, 'prompt');
    for (const regel of respons(command)) {
      schrijf(regel, 'output');
    }

    gedaan.add(command);

    // Alleen op `every()` en niet op `gedaan.size`: `gedaan` verzamelt élke invoer, dus
    // zes willekeurige woorden zouden anders de afrondboodschap triggeren. En één keer,
    // niet bij elk volgend command — een herhaalde CTA is ruis, geen aansporing.
    if (!afgerond && SUGGESTIES.every((s) => gedaan.has(s))) {
      afgerond = true;
      schrijf('', 'output');
      schrijf(
        isSmal()
          ? `[→] Klik op "${CTA_LABEL}" voor 40+ commands.`
          : `[→] Je hebt de basis te pakken. Klik op "${CTA_LABEL}" voor 40+ commands en het leerpad.`,
        'output'
      );
    }

    trim();
    pinScroll();
    markeerVolgende();

    // Alléén de commandonaam, nooit argumenten (PRD §13). De guard in
    // analytics/tracker.js:146 is het vangnet, niet de eerste verdediging.
    meld('heroDemoCommand', command.split(/\s+/)[0].toLowerCase());
  }

  // ==================== Events ====================
  // Geen autofocus: dat zou op mobiel het toetsenbord openen bij paginalading.
  ['pointerdown', 'focus', 'keydown'].forEach((type) => {
    inputEl.addEventListener(type, neemOver);
  });

  // De hele promptregel is het tikdoel, niet alleen het veld. In rust is dat veld sinds
  // Sessie 215 nog maar één teken breed (zodat de cursor bij de tekst staat), en een
  // tikdoel van 10px is er geen — WebKit miste hem zelfs in de testrun. Zo werkt het ook
  // in een echte terminal: klikken in het venster zet je op de prompt.
  const promptRegel = document.querySelector('.hero-terminal .terminal-input-line');
  if (promptRegel) {
    promptRegel.addEventListener('pointerdown', (e) => {
      if (e.target === inputEl) return;   // het veld regelt zichzelf al
      e.preventDefault();                 // anders verliest het veld de focus weer
      neemOver();
      inputEl.focus();
    });
  }

  inputEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const waarde = inputEl.value;
    inputEl.value = '';
    voerUit(waarde);
  });

  if (chipsEl) {
    chipsEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.hero-chip');
      if (!chip) return;
      neemOver();
      inputEl.focus();
      voerUit(chip.dataset.command);
    });
  }

  markeerVolgende();
}
