/**
 * touch - Create empty files or update timestamps
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'touch',
  category: 'filesystem',
  description: 'Create an empty file',
  usage: 'touch <file>',

  async execute(args, flags, context) {
    const { vfs } = context;

    // Require file argument
    if (args.length === 0) {
      return `touch: missing file operand\n\n[ ? ] TIP: Gebruik 'touch <bestand>' om een leeg bestand aan te maken. Bijvoorbeeld: touch test.txt`;
    }

    const path = args[0];

    try {
      vfs.createFile(path, '');
      return ''; // touch produces no output on success

    } catch (error) {
      // Educational error messages
      if (error.message.includes('No such directory')) {
        return `touch: cannot touch '${path}': No such file or directory\n\n[ ? ] TIP: De parent directory moet bestaan. Gebruik 'ls' om te zien welke directories er zijn.`;
      }

      if (error.message.includes('Is a directory')) {
        return `touch: cannot touch '${path}': Is a directory\n\n[ ? ] TIP: touch werkt alleen op bestanden. Een directory met deze naam bestaat al.`;
      }

      if (error.message.includes('Not a directory')) {
        return `touch: cannot touch '${path}': Not a directory\n\n[ ? ] TIP: Een component in het pad is een bestand, geen directory.`;
      }

      return `touch: ${error.message}`;
    }
  },

  manPage: `
NAAM
    touch - create empty files or update timestamps

SYNOPSIS
    touch <FILE>

BESCHRIJVING
    Maak een nieuw leeg bestand aan. In echte Linux update touch ook de
    timestamp van bestaande bestanden, maar in deze simulator wordt alleen
    het aanmaken van nieuwe bestanden ondersteund.

ARGUMENTEN
    FILE
        Naam van het bestand om aan te maken (verplicht)

VOORBEELDEN
    touch test.txt
        Maak een leeg bestand genaamd test.txt

    touch notes.txt
        Maak een leeg notitiebestand

    touch /tmp/tempfile
        Maak een bestand in de /tmp directory

    touch script.sh
        Maak een leeg script bestand (kan later gevuld worden)

EDUCATIEVE TIPS
    [DOC] touch is handig om snel lege bestanden aan te maken

    [ ? ] Workflow voorbeeld:
       1. touch payload.txt    → Maak bestand aan
       2. (bewerk met editor)  → In real Linux: nano/vim
       3. cat payload.txt      → Bekijk inhoud

    [ + ]️ Use cases in pentesting:
       • touch wordlist.txt  → Maak wordlist voor brute force
       • touch exploits.sh   → Maak script bestand
       • touch notes.txt     → Documenteer je findings

    [ ~ ] In echte Linux:
       touch wordt vaak gebruikt om timestamps te updaten zonder inhoud
       te wijzigen. Handig om build tools te triggeren of modification
       times te manipuleren.

    [ ! ] Permissies:
       Je kunt alleen bestanden aanmaken in directories waar je
       schrijfrechten hebt (zoals je home directory en /tmp).

GERELATEERDE COMMANDO'S
    mkdir, cat, rm, ls
`.trim()
};
