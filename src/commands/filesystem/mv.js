/**
 * mv - Move (rename) files and directories
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'mv',
  category: 'filesystem',
  description: 'Move or rename files/directories',
  usage: 'mv <source> <destination>',

  async execute(args, flags, context) {
    const { vfs } = context;

    // Require two arguments
    if (args.length < 2) {
      return `mv: missing ${args.length === 0 ? 'file operand' : 'destination file operand'}\n\n💡 TIP: Gebruik 'mv <bron> <doel>' om een bestand te verplaatsen of hernoemen. Bijvoorbeeld: mv old.txt new.txt`;
    }

    const source = args[0];
    const destination = args[1];

    // Safety check: prevent moving critical system directories
    if (this._isCriticalPath(source)) {
      return `mv: cannot move '${source}': Critical system directory\n\n⚠️ WAARSCHUWING: Kritieke system directories kunnen niet verplaatst worden.`;
    }

    try {
      vfs.move(source, destination);
      return ''; // mv produces no output on success

    } catch (error) {
      // Educational error messages
      if (error.message.includes('No such file or directory')) {
        if (error.message.includes(source)) {
          return `mv: cannot stat '${source}': No such file or directory\n\n💡 TIP: Het bronbestand bestaat niet. Gebruik 'ls' om te zien welke bestanden beschikbaar zijn.`;
        } else {
          return `mv: cannot move to '${destination}': No such file or directory\n\n💡 TIP: De doeldirectory bestaat niet. Maak deze eerst aan met 'mkdir'.`;
        }
      }

      if (error.message.includes('Not a directory')) {
        return `mv: cannot move to '${destination}': Not a directory\n\n💡 TIP: Een component in het doelpad is een bestand, geen directory.`;
      }

      return `mv: ${error.message}`;
    }
  },

  /**
   * Check if path is critical system directory
   * @private
   */
  _isCriticalPath(path) {
    const critical = ['/', '/etc', '/var', '/home', '/root', '/bin', '/usr'];
    const normalized = path.startsWith('/') ? path : path;
    return critical.includes(normalized);
  },

  manPage: `
NAAM
    mv - move (rename) files

SYNOPSIS
    mv <SOURCE> <DESTINATION>

BESCHRIJVING
    Verplaats of hernoem een bestand of directory. Het originele bestand
    wordt verwijderd na het verplaatsen.

ARGUMENTEN
    SOURCE
        Het te verplaatsen bestand of directory (verplicht)

    DESTINATION
        De nieuwe locatie of naam (verplicht)

VOORBEELDEN
    mv old.txt new.txt
        Hernoem old.txt naar new.txt (in huidige directory)

    mv file.txt /tmp/
        Verplaats file.txt naar /tmp directory

    mv notes.txt ~/backup/notes.txt
        Verplaats naar home directory met nieuwe naam

    mv mydir /tmp/mydir
        Verplaats een hele directory

EDUCATIEVE TIPS
    🔄 mv heeft twee hoofdfuncties:
       1. Hernoemen (source en dest in zelfde directory)
       2. Verplaatsen (source en dest in verschillende directories)

    💡 Use cases:
       - Bestanden hernoemen (betere namen)
       - Bestanden verplaatsen naar andere directories
       - Directories reorganiseren

    🏗️ In pentesting:
       - mv evidence.txt .hidden.txt  → Bestand "verbergen" met .prefix
       - Logs verplaatsen tijdens cleanup
       - Payload scripts hernoemen om minder verdacht te zijn

    🔒 Safety features:
       - Kritieke system directories kunnen niet verplaatst worden
       - Root directory kan niet verplaatst worden

    🔄 Verschil met cp:
       - mv → Origineel verdwijnt (verplaatsen)
       - cp → Origineel blijft (kopiëren)

    ⚠️ Let op:
       - Na mv bestaat het origineel NIET meer
       - Als destination al bestaat, wordt deze overschreven
       - mv werkt op zowel files als directories

    💾 In real Linux:
       - mv -i voor interactieve bevestiging bij overschrijven
       - mv kan niet tussen verschillende filesystems (dan wordt automatisch copy+delete)

GERELATEERDE COMMANDO'S
    cp, rm, ls, rename
`.trim()
};
