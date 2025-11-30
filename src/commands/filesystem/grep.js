/**
 * grep - Search file contents for patterns
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'grep',
  category: 'filesystem',
  description: 'Search for patterns in files',
  usage: 'grep <pattern> <file>',

  async execute(args, flags, context) {
    const { vfs } = context;

    // Require pattern and file arguments
    if (args.length < 2) {
      return `grep: ${args.length === 0 ? 'missing pattern' : 'missing file operand'}\n\n[ ? ] TIP: Gebruik 'grep <patroon> <bestand>' om in een bestand te zoeken. Bijvoorbeeld: grep "root" /etc/passwd`;
    }

    const pattern = args[0].toLowerCase();
    const filePath = args[1];

    try {
      // Read file content
      const content = vfs.readFile(filePath);

      // Search for pattern in each line
      const lines = content.split('\n');
      const matches = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(pattern)) {
          // Show line number and content (educational)
          matches.push(`${i + 1}: ${lines[i]}`);
        }
      }

      if (matches.length === 0) {
        return `grep: no matches found for '${args[0]}' in ${filePath}\n\n[ ? ] TIP: grep zoekt case-insensitive naar tekst in bestanden.`;
      }

      // Format output
      const output = matches.join('\n');
      const tip = matches.length > 1
        ? `\n\n[ ? ] ${matches.length} regels gevonden met '${args[0]}'. Het getal toont de regelnummer.`
        : `\n\n[ ? ] 1 regel gevonden. Het getal toont de regelnummer.`;

      return output + tip;

    } catch (error) {
      // Educational error messages
      if (error.message.includes('No such file')) {
        return `grep: ${filePath}: No such file or directory\n\n[ ? ] TIP: Gebruik 'find' om bestanden te zoeken, of 'ls' om te zien wat er in de directory staat.`;
      }

      if (error.message.includes('Is a directory')) {
        return `grep: ${filePath}: Is a directory\n\n[ ? ] TIP: grep werkt op bestanden, niet directories. Probeer: ls ${filePath}`;
      }

      if (error.message.includes('Permission denied')) {
        return `grep: ${filePath}: Permission denied\n\n[ ! ] BEVEILIGING: Dit bestand is beveiligd. Probeer een ander bestand zoals /etc/passwd.`;
      }

      return `grep: ${error.message}`;
    }
  },

  manPage: `
NAAM
    grep - search for patterns in file contents

SYNOPSIS
    grep <PATTERN> <FILE>

BESCHRIJVING
    Zoek naar een tekst patroon in de inhoud van een bestand. Alle regels
    die het patroon bevatten worden getoond met regelnummer.

ARGUMENTEN
    PATTERN
        De zoektekst (case-insensitive in deze simulator)

    FILE
        Het bestand waarin gezocht moet worden (verplicht)

VOORBEELDEN
    grep "root" /etc/passwd
        Zoek naar regels met "root" in het passwd bestand

    grep "hacker" /etc/passwd
        Zoek je eigen gebruiker

    grep "ssh" /var/log/auth.log
        Zoek SSH gerelateerde log entries

    grep "failed" /var/log/auth.log
        Zoek mislukte login pogingen

EDUCATIEVE TIPS
    [ ? ] grep is essentieel voor log analyse en reconnaissance:
       • Zoek gebruikersnamen in /etc/passwd
       • Analyseer security events in logs
       • Vind configuratie opties in config files

    [ ? ] Pentesting use cases:
       • grep "password" <file>  → Zoek credentials in files
       • grep "admin" /etc/passwd → Zoek admin accounts
       • grep "failed" auth.log   → Brute force detectie
       • grep "error" syslog      → System vulnerabilities

    [ → ] Interessante patronen om te zoeken:
       • "root"     → Root/admin gerelateerd
       • "password" → Mogelijk credentials
       • "failed"   → Failed login attempts
       • "ssh"      → Remote access
       • "error"    → System errors

    [ + ] In real Linux:
       Real 'grep' ondersteunt:
       • grep -i      → Case-insensitive (standaard in simulator)
       • grep -n      → Toon regelnummers (standaard in simulator)
       • grep -r      → Recursief door directories
       • grep -E      → Extended regex patterns
       • grep -v      → Inverse match (regels ZONDER patroon)

    [ ↻ ] Workflow voorbeeld:
       1. find passwd           → Vind passwd bestanden
       2. cat /etc/passwd       → Bekijk inhoud
       3. grep "root" /etc/passwd → Filter specifieke entries

VERSCHIL MET FIND
    - grep → Zoekt in BESTANDSINHOUD (tekst in het bestand)
    - find → Zoekt in BESTANDSNAMEN (naam van het bestand)

GERELATEERDE COMMANDO'S
    find, cat, ls, awk, sed (awk/sed niet beschikbaar in simulator)
`.trim()
};
