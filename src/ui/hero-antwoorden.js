/**
 * hero-antwoorden.js — wat de hero-terminal terugzegt (Sessie 214, gedeeld sinds Sessie 238)
 *
 * Stond eerst twee keer: een hand-geschreven lijst in landing-demo.js en de responsemap in
 * hero-repl.js. Twee lijsten die hetzelfde beweren, lopen uit elkaar; de hand-geschreven
 * versie toonde in Sessie 214 bestanden die niet in de VFS bestonden. Nu is er één bron,
 * en de auto-demo toont per constructie wat een bezoeker ook zelf krijgt.
 *
 * Elke regel is `[tekst, glos]` of alleen `tekst`. De tekst is de uitvoer zoals de echte
 * engine hem geeft (verwijzing per command). De glos is het Nederlands dat de engine
 * achter een `←` zet, hier typografisch ernaast gezet in plaats van erachter geplakt.
 * Regels die al Nederlands zijn ([TIP], help-omschrijvingen, bestandsinhoud) krijgen er
 * geen: een vertaling van een vertaling is ruis.
 *
 * `smal` volgt isMobileView() van de engine (utils/box-utils.js:101-107): onder 768px
 * blijft een regel binnen 40 tekens. De nmap-tabel is in het origineel 60-77 tekens.
 */

import { findClosestCommand } from '../utils/fuzzy.js';

export const CTA_LABEL = 'Start de simulator';   // sitebreed label; letterlijk citeren
export const DEMO_COMMANDS = ['help', 'ls', 'cat', 'nmap', 'whoami', 'pwd'];

const GLOS_ONBEKEND = 'dit command kent de demo niet';

const RESPONSES = {
  // src/commands/system/whoami.js:11-13 + core/terminal.js:45
  whoami: {
    breed: [['hacker', 'jouw gebruikersnaam hier'], '[TIP] Je bent `hacker`, geen root — dat scheelt ongelukken.'],
    smal: [['hacker', 'jouw gebruikersnaam hier'], '[TIP] Je bent `hacker`, geen root.']
  },
  // src/commands/filesystem/pwd.js:12-22 + filesystem/structure.js:211-213
  pwd: {
    breed: [['/home/hacker', 'de map waar je nu staat'], '[TIP] ~ is de korte schrijfwijze voor /home/hacker.'],
    smal: [['/home/hacker', 'de map waar je nu staat'], '[TIP] ~ is korter voor /home/hacker.']
  },
  // src/commands/filesystem/ls.js:11-28 — dirs eerst, dan files, gescheiden door 2 spaties
  ls: {
    breed: [
      ['documents/  notes.txt  README.txt', 'een map en twee tekstbestanden'],
      '[TIP] Lees een bestand met: cat notes.txt'
    ],
    smal: [
      ['documents/  notes.txt  README.txt', 'een map en twee tekstbestanden'],
      '[TIP] Lees er een: cat notes.txt'
    ]
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

function kies(paar, smal) {
  return (smal ? paar.smal : paar.breed).slice();
}

// src/commands/filesystem/cat.js:48-50, :66, :70
function catRespons(args, smal) {
  if (args.length === 0) {
    return [
      ['cat: missing file operand', 'cat wil weten welk bestand'],
      smal ? '[TIP] Gebruik: cat notes.txt' : "[TIP] Gebruik 'cat <bestand>'. Bijvoorbeeld: cat notes.txt"
    ];
  }
  const pad = args[0].replace(/^\.\//, '');
  if (DIRECTORIES.includes(pad)) {
    return [[`cat: ${pad}: Is a directory`, 'dat is een map, geen bestand'], '[TIP] cat werkt op bestanden, ls op mappen.'];
  }
  const inhoud = Object.hasOwn(BESTANDEN, pad) ? BESTANDEN[pad] : null;
  if (inhoud) {
    return inhoud.concat([
      smal ? '[~] Ingekort — zie de simulator.' : '[~] Ingekort. De volledige simulator toont het hele bestand.'
    ]);
  }
  return [
    [`cat: ${pad}: No such file or directory`, 'dat bestand bestaat hier niet'],
    smal ? "[TIP] Typ 'ls' om te zien wat er is." : "[TIP] Gebruik 'ls' om te zien welke bestanden er zijn."
  ];
}

// src/commands/network/nmap.js:32-39 (router-profiel), :93, :112-167
function nmapRespons(args, smal) {
  if (args.length === 0) {
    return [['nmap: missing target operand', 'nmap wil weten wat het moet scannen'], '[TIP] Gebruik: nmap 192.168.1.1'];
  }
  if (args[0] !== '192.168.1.1') {
    return [
      `nmap: ${args[0]} valt buiten deze demo`,
      smal ? '[TIP] Probeer: nmap 192.168.1.1' : '[TIP] Probeer nmap 192.168.1.1 — de simulator scant het hele oefennetwerk.'
    ];
  }
  return smal
    ? [
        ['Nmap scan: 192.168.1.1', 'je router wordt gescand'],
        '',
        ['PORT     STATE  SERVICE', 'poort, toestand, dienst'],
        ['53/tcp   OPEN   DNS', 'naamserver'],
        ['80/tcp   OPEN   HTTP', 'onversleuteld'],
        ['443/tcp  OPEN   HTTPS', 'versleuteld'],
        '',
        ['3 open, 997 closed', 'de rest is dicht'],
        '[TIP] Open poorten zijn ingangen.'
      ]
    : [
        ['Starting Nmap scan on 192.168.1.1...', 'de scan begint'],
        ['Nmap scan report for 192.168.1.1', 'dit apparaat is je router'],
        '',
        ['PORT      STATE   SERVICE   VERSION', 'poort, toestand, dienst, software'],
        ['53/tcp    OPEN    DNS       dnsmasq', 'naamserver: zet namen om in adressen'],
        ['80/tcp    OPEN    HTTP      router admin', 'onversleuteld: het beheerscherm'],
        ['443/tcp   OPEN    HTTPS     router admin', 'versleuteld: hetzelfde scherm'],
        '',
        ['Port summary: 3 open, 997 closed, 0 filtered', 'de andere 997 zijn dicht'],
        '[TIP] Open poorten zijn ingangen. Een pentester checkt elke service.'
      ];
}

// Tier 1 van het echte helpsysteem (src/help/help-system.js:78-83).
function onbekend(naam, smal) {
  const suggestie = findClosestCommand(naam, DEMO_COMMANDS);
  if (suggestie) {
    return [[`Command not found: ${naam}`, GLOS_ONBEKEND], `[TIP] Bedoelde je '${suggestie}'?`];
  }
  return [
    [`Command not found: ${naam}`, GLOS_ONBEKEND],
    smal ? "[TIP] Deze demo kent er 6 — typ 'help'." : "[TIP] Deze demo kent 6 commands — typ 'help' voor de lijst.",
    smal ? `[→] Klik op "${CTA_LABEL}".` : `[→] Klik op "${CTA_LABEL}" voor de echte terminal.`
  ];
}

/**
 * Het antwoord op één invoerregel, als lijst `[tekst, glos]`-paren.
 * Losse strings worden hier genormaliseerd, zodat de aanroeper één vorm ziet.
 */
export function respons(invoer, smal = window.innerWidth < 768) {
  const delen = invoer.trim().split(/\s+/);
  const naam = delen[0].toLowerCase();
  const args = delen.slice(1);

  let regels;
  if (naam === 'cat') regels = catRespons(args, smal);
  else if (naam === 'nmap') regels = nmapRespons(args, smal);
  // Object.hasOwn en niet `RESPONSES[naam]`: de invoer komt van de bezoeker, en
  // `constructor`, `toString` en `__proto__` zijn allemaal truthy op een object-literal.
  else if (Object.hasOwn(RESPONSES, naam)) regels = kies(RESPONSES[naam], smal);
  // Het origineel terugmelden, niet de kleingemaakte vorm: wie `toString` typt hoort
  // `toString` terug te krijgen, niet `tostring`.
  else regels = onbekend(delen[0], smal);

  return regels.map((r) => (Array.isArray(r) ? r : [r, null]));
}
