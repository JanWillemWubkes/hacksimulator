/**
 * Learning Path — single source of truth voor de leerpad-fases.
 *
 * Eén canonieke definitie van de 4 fases + 3 niveaus (tiers). Alle consumenten
 * (leerpad, next, dashboard, help, dynamic-content, onboarding) importeren
 * deze data i.p.v. eigen kopieën — voorheen waren de lijsten op 5 plekken
 * gedupliceerd en gedivergeerd (whois/traceroute ontbraken terwijl de
 * recon-tutorial ze wél leert).
 *
 * Pure datamodule: GEEN imports, zodat elke consument (incl. onboarding.js)
 * dit veilig kan importeren zonder circulaire dependencies.
 */

export const phases = [
  {
    phase: "FASE 1: TERMINAL BASICS",
    commands: [
      { name: "help", description: "Commands ontdekken" },
      { name: "ls", description: "Bestanden bekijken" },
      { name: "cd", description: "Navigeren" },
      { name: "pwd", description: "Huidige locatie" },
      { name: "cat", description: "Bestanden lezen" },
      { name: "whoami", description: "Je identiteit" },
      { name: "history", description: "Command geschiedenis" }
    ]
  },
  {
    phase: "FASE 2: FILE MANIPULATION",
    commands: [
      { name: "mkdir", description: "Directory aanmaken" },
      { name: "touch", description: "Bestand aanmaken" },
      { name: "rm", description: "Bestanden verwijderen" },
      { name: "cp", description: "Bestanden kopiëren" },
      { name: "mv", description: "Bestanden verplaatsen" },
      { name: "echo", description: "Tekst weergeven" },
      { name: "find", description: "Bestanden zoeken" },
      { name: "grep", description: "Zoeken in bestanden" }
    ]
  },
  {
    // Volgorde = tutorial-recon-volgorde (ping, nmap, whois, traceroute):
    // wie de missie afrondt ziet 4 aaneengesloten vinkjes.
    phase: "FASE 3: RECONNAISSANCE",
    commands: [
      { name: "ping", description: "Test verbinding" },
      { name: "nmap", description: "Scan netwerk poorten" },
      { name: "whois", description: "Domein-info opzoeken" },
      { name: "traceroute", description: "Route naar doelwit" },
      { name: "ifconfig", description: "Network interfaces" },
      { name: "netstat", description: "Actieve verbindingen" }
    ]
  },
  {
    phase: "FASE 4: SECURITY TOOLS",
    commands: [
      { name: "hashcat", description: "Crack wachtwoorden" },
      { name: "hydra", description: "Brute-force login" },
      { name: "sqlmap", description: "SQL injection scanner" },
      { name: "metasploit", description: "Exploit framework" },
      { name: "nikto", description: "Web scanner" }
    ]
  }
];

// Eén canonieke ladder (Beginner/Gevorderd/Expert) — dezelfde taal als de homepage
// en het tutorial-systeem. De 4 fases worden gegroepeerd onder de 3 niveaus, elk met
// een brug naar de bijbehorende begeleide missie (oefenen ↔ tutorial = twee views).
export const tiers = [
  { name: "BEGINNER",  phases: [phases[0], phases[1]], tutorial: "fundamentals" },
  { name: "GEVORDERD", phases: [phases[2]],            tutorial: "recon" },
  { name: "EXPERT",    phases: [phases[3]],            tutorial: "exploitation" }
];

// EXPERT ontgrendelt bij ≥4 geprobeerde Fase-3-commands (niet "alle 6"):
// backwards-compatibel met gebruikers die unlockten toen Fase 3 nog 4 commands
// telde, én de recon-tutorial (ping/nmap/whois/traceroute = 4) ontgrendelt direct.
export const PHASE3_UNLOCK_THRESHOLD = 4;

/** Commandonamen van fase i (0-based) als platte array. */
export function phaseCommandNames(i) {
  return phases[i].commands.map(function(c) { return c.name; });
}
