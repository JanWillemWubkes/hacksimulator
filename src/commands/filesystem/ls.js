/**
 * ls - List directory contents
 * Simulated command for the HackSimulator terminal
 */

/**
 * Format simple directory listing (default)
 */
function formatSimpleListing(entries) {
  const dirEntries = entries.filter(e => e.type === 'directory');
  const fileEntries = entries.filter(e => e.type === 'file');

  const parts = [];

  // Directories first (with color indicator)
  if (dirEntries.length > 0) {
    parts.push(dirEntries.map(e => e.name + '/').join('  '));
  }

  // Then files
  if (fileEntries.length > 0) {
    parts.push(fileEntries.map(e => e.name).join('  '));
  }

  return parts.join('  ');
}

/**
 * Format long directory listing (-l flag)
 */
function formatLongListing(entries) {
  const lines = [];

  // Header (educational)
  lines.push('total ' + entries.length);

  for (const entry of entries) {
    const type = entry.type === 'directory' ? 'd' : '-';
    const perms = entry.permissions === 'restricted' ? 'r--------' : 'rw-r--r--';
    const size = entry.type === 'file' ? '1024' : '4096';
    const date = 'Oct 14 12:00';
    const name = entry.type === 'directory' ? entry.name + '/' : entry.name;

    // Format: type+permissions  size  date  name
    lines.push(`${type}${perms}  ${size.padStart(6)}  ${date}  ${name}`);
  }

  // Add educational tip
  lines.push('');
  lines.push('💡 TIP: De eerste kolom toont type (d=directory, -=file) en permissies.');

  return lines.join('\n');
}

export default {
  name: 'ls',
  category: 'filesystem',
  description: 'List directory contents',
  usage: 'ls [options] [directory]',

  async execute(args, flags, context) {
    const { vfs } = context;

    // Determine path (default to current directory)
    const path = args[0] || vfs.getCwd();

    // Check flags
    const showHidden = flags.a || flags.all || false;
    const longFormat = flags.l || false;
    const combined = flags.la || flags.al || false;

    try {
      // Get directory listing
      const entries = vfs.listDirectory(path, showHidden || combined);

      if (entries.length === 0) {
        return ''; // Empty directory
      }

      // Long format (-l flag)
      if (longFormat || combined) {
        return formatLongListing(entries);
      }

      // Simple format (default)
      return formatSimpleListing(entries);

    } catch (error) {
      // Educational error messages
      if (error.message.includes('No such directory')) {
        return `ls: cannot access '${args[0]}': No such file or directory\n\n💡 TIP: Gebruik 'pwd' om te zien waar je bent, en 'cd' om van directory te veranderen.`;
      }

      if (error.message.includes('Not a directory')) {
        return `ls: ${args[0]}: Not a directory\n\n💡 TIP: ls werkt alleen op directories. Gebruik 'cat ${args[0]}' om een bestand te lezen.`;
      }

      return `ls: ${error.message}`;
    }
  },

  manPage: `
NAAM
    ls - list directory contents

SYNOPSIS
    ls [OPTIONS] [DIRECTORY]

BESCHRIJVING
    List informatie over bestanden en directories. Standaard wordt de huidige
    directory getoond.

OPTIES
    -a, --all
        Toon ook verborgen bestanden (bestanden die beginnen met .)

    -l
        Gebruik een lang formaat met extra details (permissions, size, date)

VOORBEELDEN
    ls
        Toon bestanden in de huidige directory

    ls /etc
        Toon bestanden in de /etc directory

    ls -a
        Toon alle bestanden, inclusief verborgen bestanden

    ls -l
        Toon gedetailleerde informatie over bestanden

    ls -la ~
        Toon alle bestanden in je home directory met details

EDUCATIEVE TIPS
    🔍 Verborgen bestanden beginnen met een punt (.) en worden vaak gebruikt
       voor configuratie (bijv. .ssh/, .bashrc)

    📁 Directories worden gemarkeerd met een / aan het einde

    🔒 De permissies kolom toont wie het bestand kan lezen/schrijven/uitvoeren

GERELATEERDE COMMANDO'S
    cd, pwd, cat, find
`.trim()
};
