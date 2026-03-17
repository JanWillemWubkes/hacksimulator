/**
 * Dynamic Content Module
 * Provides phase-dependent file content that grows with the user's learning progress.
 * Files like README.txt and notes.txt show content appropriate to the user's current phase.
 */

import onboarding from '../ui/onboarding.js';

// Phase command sets (same as next.js)
var phase1Commands = ['ls', 'cat', 'pwd', 'cd', 'whoami', 'history', 'help'];
var phase2Commands = ['mkdir', 'touch', 'rm'];
var phase3Commands = ['ping', 'nmap', 'ifconfig', 'netstat'];

/**
 * Detect current learning phase (1-4) based on commands tried
 */
function detectPhase() {
  var tried = new Set(onboarding.getCommandsTried());

  var phase1Done = phase1Commands.every(function(cmd) { return tried.has(cmd); });
  if (!phase1Done) return 1;

  var phase2Done = phase2Commands.every(function(cmd) { return tried.has(cmd); });
  if (!phase2Done) return 2;

  var phase3Done = phase3Commands.every(function(cmd) { return tried.has(cmd); });
  if (!phase3Done) return 3;

  return 4;
}

// --- README.txt content per phase (additive model) ---

var readmePhase1 = `Welkom bij HackSimulator.nl!
Dit is een veilige omgeving om ethisch hacken te leren.
Alle activiteiten zijn gesimuleerd en beinvloeden geen echte systemen.

BEGINNEN:
- Type 'help' voor een lijst van beschikbare commands
- Type 'man [command]' voor gedetailleerde informatie
- Gebruik pijltjestoetsen voor command geschiedenis

HANDIGE COMMANDS:
[?] ls         - Bekijk welke bestanden er zijn
[?] cd         - Ga naar een andere map
[?] cat        - Lees de inhoud van een bestand
[?] pwd        - Waar ben ik nu?
[?] whoami     - Met welk account ben ik ingelogd?

[->] Type 'next' om te zien wat je volgende stap is.

DISCLAIMER:
Gebruik deze kennis alleen legaal en ethisch.
Ongeautoriseerde toegang tot systemen is illegaal.

Veel plezier met leren!`;

var readmePhase2 = `

BESTANDSBEHEER:
Nu je bestanden kunt lezen, leer je ze ook aanmaken
en verwijderen.
[?] mkdir      - Maak een nieuwe map aan
[?] touch      - Maak een nieuw bestand aan
[?] rm         - Verwijder een bestand

[TIP] Maak een eigen map aan met 'mkdir projecten'
om je werk te organiseren.`;

var readmePhase3 = `

NETWERK & SYSTEEM:
[!] Bestanden in /etc bevatten systeem configuratie
[?] Logs in /var/log/ tonen systeemactiviteit
[?] Type 'cat /etc/hosts' om de netwerk config
    te bekijken

RECONNAISSANCE TIPS:
[!] Reconnaissance = informatie verzamelen VOORDAT
    je een systeem test
[?] Begin altijd met passieve scans (ping, nmap)
    voordat je actief test`;

var readmePhase4 = `

GEAVANCEERDE SECURITY:
[?] SSH keys staan vaak in ~/.ssh/ - check of er
    onbeveiligde keys zijn
[?] Password hashes in /etc/shadow zijn alleen
    leesbaar voor root
[?] Web config bestanden (config.php) bevatten
    soms database wachtwoorden

[!] Gebruik security tools ALLEEN met expliciete
    toestemming!`;

// --- notes.txt content per phase ---

var notesContent = [
  // Phase 1
  `Mijn aantekeningen:
1. Leer eerst de basis terminal commands
2. Gebruik 'man [command]' als je niet weet hoe
   iets werkt
3. Verken het bestandssysteem met ls en cd
4. Documenteer alles wat je leert!

TODO:
- Alle basis commands uitproberen
- De bestanden in /home/hacker verkennen`,

  // Phase 2
  `Mijn aantekeningen:
1. Terminal basics onder de knie
2. Nu bestanden leren beheren (mkdir, touch, rm)
3. Organiseer je werk in mappen
4. Documenteer alles wat je vindt!

TODO:
- Een eigen projectmap aanmaken
- Notities bijhouden van wat je leert
- Kijk eens in /etc voor systeembestanden`,

  // Phase 3
  `Mijn security aantekeningen:
1. Altijd eerst reconnaissance doen (ping, nmap)
2. Zoek naar open poorten en services
3. Check /etc/hosts voor netwerk configuratie
4. Bekijk /var/log/ voor verdachte activiteit
5. Documenteer alles wat je vindt

TODO:
- Leer network scanning technieken
- Analyseer de logs in /var/log/
- Begrijp wat open poorten betekenen`,

  // Phase 4
  `Mijn security aantekeningen:
1. Altijd eerst reconnaissance doen (nmap, whois)
2. Zoek naar open poorten en services
3. Check voor bekende vulnerabilities
4. Documenteer alles wat je vindt
5. Test alleen op systemen waar je toestemming
   voor hebt!

TODO:
- Leer meer over SQL injection
- Oefen met Metasploit basics
- Begrijp hoe password hashes werken`
];

/**
 * Build README.txt content for current phase (additive model)
 */
function getReadmeContent(phase) {
  var content = readmePhase1;
  if (phase >= 2) content += readmePhase2;
  if (phase >= 3) content += readmePhase3;
  if (phase >= 4) content += readmePhase4;
  return content;
}

/**
 * Build notes.txt content for current phase
 */
function getNotesContent(phase) {
  return notesContent[phase - 1];
}

// Registry of dynamic file paths
var dynamicFiles = {
  '/home/hacker/README.txt': getReadmeContent,
  '/home/hacker/notes.txt': getNotesContent
};

/**
 * Get dynamic content for a resolved file path.
 * Returns phase-appropriate content string, or null if not a dynamic file.
 * @param {string} resolvedPath - Absolute resolved path
 * @returns {string|null}
 */
export function getDynamicContent(resolvedPath) {
  var contentFn = dynamicFiles[resolvedPath];
  if (!contentFn) return null;

  var phase = detectPhase();
  return contentFn(phase);
}
