/**
 * cat - Concatenate and print files
 * Simulated command for the HackSimulator terminal
 */

import { getPathCompletions } from '../../utils/filesystem-completion.js';

/**
 * Get educational tip based on which file is restricted
 */
function getPermissionTip(path) {
  if (path.includes('shadow')) {
    return `[ ! ] BEVEILIGING: /etc/shadow bevat password hashes en is alleen toegankelijk voor root.\n\n[ ? ] TIP: Probeer 'cat /etc/passwd' - dit bestand is wel leesbaar en toont gebruikers.`;
  }

  if (path.includes('root')) {
    return `[ ! ] BEVEILIGING: De /root directory is alleen toegankelijk voor de root gebruiker.\n\n[ ? ] TIP: Als normale gebruiker heb je toegang tot je eigen home directory (/home/hacker).`;
  }

  return `[ ! ] BEVEILIGING: Dit bestand is beveiligd en niet toegankelijk.\n\n[ ? ] TIP: In echte systemen zijn permissies cruciaal voor beveiliging.`;
}

export default {
  name: 'cat',
  category: 'filesystem',
  description: 'Display file contents',
  usage: 'cat <file>',

  /**
   * Autocomplete provider for cat command
   * Suggests files only (not directories)
   * @param {Array<string>} args - Current arguments being typed
   * @returns {Array<string>} - Array of file path completions
   */
  completionProvider(args) {
    // Get partial path (last argument being typed, or empty string if no args)
    const partial = args.length > 0 ? args[args.length - 1] : '';

    // Get files only (cat reads files, not directories)
    return getPathCompletions(partial, { type: 'file' });
  },

  async execute(args, flags, context) {
    const { vfs } = context;

    // Require file argument
    if (args.length === 0) {
      return `cat: missing file operand\n\n[ ? ] TIP: Gebruik 'cat <bestand>' om een bestand te lezen. Bijvoorbeeld: cat README.txt`;
    }

    const path = args[0];

    try {
      const content = vfs.readFile(path);
      return content;

    } catch (error) {
      // Educational error messages based on error type
      if (error.message.includes('No such file')) {
        return `cat: ${path}: No such file or directory\n\n[ ? ] TIP: Gebruik 'ls' om te zien welke bestanden beschikbaar zijn.`;
      }

      if (error.message.includes('Is a directory')) {
        return `cat: ${path}: Is a directory\n\n[ ? ] TIP: cat werkt alleen op bestanden. Gebruik 'ls ${path}' om de inhoud van een directory te zien.`;
      }

      if (error.message.includes('Permission denied')) {
        const educationalTips = getPermissionTip(path);
        return `cat: ${path}: Permission denied\n\n${educationalTips}`;
      }

      return `cat: ${error.message}`;
    }
  },

  manPage: `
NAAM
    cat - concatenate and print files

SYNOPSIS
    cat <FILE>

BESCHRIJVING
    Lees en toon de inhoud van een bestand. In echte Linux kan cat meerdere
    bestanden combineren, maar in deze simulator werkt het met één bestand
    per keer.

ARGUMENTEN
    FILE
        Het bestand dat je wilt lezen (verplicht)

VOORBEELDEN
    cat README.txt
        Toon de inhoud van README.txt

    cat /etc/passwd
        Bekijk de lijst van gebruikers op het systeem

    cat /etc/hosts
        Bekijk de hosts file (DNS configuratie)

    cat notes.txt
        Lees je persoonlijke notities

EDUCATIEVE TIPS
    [ = ] cat is één van de meest gebruikte commands voor het lezen van files

    [ ? ] Interessante bestanden om te verkennen:
       • /etc/passwd    → Gebruikerslijst (veilig om te lezen)
       • /etc/shadow    → Password hashes (restricted!)
       • /etc/hosts     → DNS configuratie
       • /var/log/*.log → System logs
       • ~/README.txt   → Welkomstinformatie

    [ ! ] Permissies:
       Sommige bestanden (zoals /etc/shadow) zijn beveiligd. Dit is een
       belangrijke security feature - password hashes mogen niet voor
       iedereen leesbaar zijn!

    [ ? ] In real pentesting:
       • cat /etc/passwd geeft gebruikersnamen (niet wachtwoorden!)
       • Password hashes staan in /etc/shadow (alleen root toegang)
       • Logs in /var/log/ kunnen gevoelige informatie bevatten

VEELGEMAAKTE FOUTEN
    [ X ] cat /etc (Is a directory)
       → Gebruik 'ls /etc' om directories te bekijken

    [ X ] cat bestand.txt (No such file)
       → Check met 'ls' of het bestand bestaat
       → Check met 'pwd' of je in de juiste directory bent

GERELATEERDE COMMANDO'S
    ls, grep, find, head, tail (head en tail niet geïmplementeerd in simulator)
`.trim()
};
