/**
 * cp - Copy files and directories
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'cp',
  category: 'filesystem',
  description: 'Copy files or directories',
  usage: 'cp <source> <destination>',

  async execute(args, flags, context) {
    const { vfs } = context;

    // Require two arguments
    if (args.length < 2) {
      return `cp: missing ${args.length === 0 ? 'file operand' : 'destination file operand'}\n\n[ ? ] TIP: Gebruik 'cp <bron> <doel>' om een bestand te kopiëren. Bijvoorbeeld: cp file.txt backup.txt`;
    }

    const source = args[0];
    const destination = args[1];

    try {
      vfs.copy(source, destination);
      return ''; // cp produces no output on success

    } catch (error) {
      // Educational error messages
      if (error.message.includes('No such file or directory')) {
        if (error.message.includes(source)) {
          return `cp: cannot stat '${source}': No such file or directory\n\n[ ? ] TIP: De bronbestand bestaat niet. Gebruik 'ls' om te zien welke bestanden beschikbaar zijn.`;
        } else {
          return `cp: cannot create '${destination}': No such file or directory\n\n[ ? ] TIP: De doeldirectory bestaat niet. Maak deze eerst aan met 'mkdir'.`;
        }
      }

      if (error.message.includes('Not a directory')) {
        return `cp: cannot create '${destination}': Not a directory\n\n[ ? ] TIP: Een component in het doelpad is een bestand, geen directory.`;
      }

      return `cp: ${error.message}`;
    }
  },

  manPage: `
NAAM
    cp - copy files and directories

SYNOPSIS
    cp <SOURCE> <DESTINATION>

BESCHRIJVING
    Kopieer een bestand of directory van SOURCE naar DESTINATION. Het
    originele bestand blijft bestaan.

ARGUMENTEN
    SOURCE
        Het te kopiëren bestand of directory (verplicht)

    DESTINATION
        De doellocatie (verplicht)

VOORBEELDEN
    cp file.txt backup.txt
        Kopieer file.txt naar backup.txt (in huidige directory)

    cp notes.txt /tmp/notes_backup.txt
        Kopieer naar een andere directory met nieuwe naam

    cp README.txt ~/documents/README.txt
        Kopieer naar home directory subdirectory

EDUCATIEVE TIPS
    [CPY] cp maakt een exacte kopie - het origineel blijft bestaan

    [ ? ] Use cases:
       • Backups maken voor je experimenten iets probeert
       • Bestanden dupliceren om aan te passen
       • Data naar andere locaties kopiëren

    [ + ]️ In pentesting:
       • cp /etc/passwd /tmp/passwd → Kopie maken om lokaal te analyseren
       • Backup maken voor je configuraties aanpast
       • Exfiltratie simuleren (data naar tijdelijke locatie)

    [ ↻ ] Verschil met mv:
       • cp → Origineel blijft bestaan (kopie)
       • mv → Origineel wordt verplaatst (geen kopie)

    [ ! ] Let op:
       Als de destination al bestaat, wordt deze overschreven zonder
       waarschuwing in deze simulator!

    [DSK] In real Linux:
       • cp -r voor recursief kopiëren van directories
       • cp -i voor interactieve bevestiging bij overschrijven
       • cp -p behoudt timestamps en permissies

GERELATEERDE COMMANDO'S
    mv, rm, ls, cat
`.trim()
};
