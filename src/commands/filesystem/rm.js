/**
 * rm - Remove files and directories
 * Simulated command for the HackSimulator terminal
 */

/**
 * Check if path is critical system directory
 */
function isCriticalPath(path) {
  const critical = ['/', '/etc', '/var', '/home', '/root', '/bin', '/usr'];
  const normalized = path.startsWith('/') ? path : path;
  return critical.includes(normalized);
}

export default {
  name: 'rm',
  category: 'filesystem',
  description: 'Remove files or directories',
  usage: 'rm [options] <file>',

  async execute(args, flags, context) {
    const { vfs } = context;

    // Require file argument
    if (args.length === 0) {
      return `rm: missing operand\n\n💡 TIP: Gebruik 'rm <bestand>' om een bestand te verwijderen. Gebruik 'rm -r <directory>' voor directories.`;
    }

    const path = args[0];
    const recursive = flags.r || flags.R || flags.recursive || false;

    // Safety check: prevent deleting critical system directories
    if (isCriticalPath(path)) {
      return `rm: cannot remove '${path}': Critical system directory\n\n⚠️ WAARSCHUWING: Dit is een kritieke system directory. In een echte omgeving zou dit je systeem onbruikbaar maken!\n\n💡 TIP: Gebruik 'reset' om het filesystem te resetten naar de beginwaarde.`;
    }

    try {
      vfs.delete(path, recursive);
      return ''; // rm produces no output on success

    } catch (error) {
      // Educational error messages
      if (error.message.includes('No such file or directory')) {
        return `rm: cannot remove '${path}': No such file or directory\n\n💡 TIP: Gebruik 'ls' om te zien welke bestanden beschikbaar zijn.`;
      }

      if (error.message.includes('Directory not empty')) {
        return `rm: cannot remove '${path}': Directory not empty\n\n💡 TIP: Gebruik 'rm -r ${path}' om een directory inclusief inhoud te verwijderen.\n\n⚠️ Let op: rm -r verwijdert recursief alles in de directory!`;
      }

      if (error.message.includes('Cannot delete root')) {
        return `rm: cannot remove '/': Cannot delete root directory\n\n⚠️ WAARSCHUWING: Je probeert het hele filesystem te verwijderen!\n\n💡 TIP: Dit is een safety feature. Gebruik 'reset' als je opnieuw wilt beginnen.`;
      }

      return `rm: ${error.message}`;
    }
  },

  manPage: `
NAAM
    rm - remove files or directories

SYNOPSIS
    rm [OPTIONS] <FILE>

BESCHRIJVING
    Verwijder bestanden of directories. Let op: verwijderde bestanden kunnen
    niet worden hersteld (behalve met 'reset' voor het hele filesystem).

OPTIES
    -r, -R, --recursive
        Verwijder directories en hun inhoud recursief

ARGUMENTEN
    FILE
        Bestand of directory om te verwijderen (verplicht)

VOORBEELDEN
    rm test.txt
        Verwijder een bestand

    rm -r testdir
        Verwijder een directory en alle inhoud

    rm /tmp/oldfile
        Verwijder een bestand met absoluut pad

EDUCATIEVE TIPS
    ⚠️ GEVAARLIJK COMMANDO!
       rm verwijdert permanent. In echte systemen is er geen "Recycle Bin"
       of "Prullenbak". Eenmaal weg = weg.

    🔒 Safety features in deze simulator:
       - Kritieke system directories kunnen niet verwijderd worden
       - Root directory (/) is beveiligd
       - Gebruik 'reset' om alles terug te zetten

    💡 Best practices:
       - Gebruik 'ls' VOOR 'rm' om te verifiëren wat je gaat verwijderen
       - Bij directories: eerst 'ls <dir>' om te zien wat erin zit
       - Wees extra voorzichtig met -r (recursief)

    ⚠️ In real pentesting:
       - rm -rf kan gebruikt worden om sporen uit te wissen (anti-forensics)
       - Logs verwijderen is vaak een red flag voor defenders
       - NOOIT op productie systemen gebruiken zonder backup!

    🎓 Famous disasters:
       "rm -rf /" is berucht omdat het het hele systeem verwijdert.
       Moderne Linux versies hebben safety checks, maar wees voorzichtig!

VEELGEMAAKTE FOUTEN
    ❌ rm directory (zonder -r)
       → Gebruik 'rm -r directory' voor directories

    ❌ rm -rf / (proberen alles te verwijderen)
       → Geblokkeerd in deze simulator als safety feature

GERELATEERDE COMMANDO'S
    ls, mkdir, touch, reset
`.trim()
};
