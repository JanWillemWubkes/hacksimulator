/**
 * find - Search for files and directories
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'find',
  category: 'filesystem',
  description: 'Search for files by name',
  usage: 'find <pattern>',

  async execute(args, flags, context) {
    const { vfs } = context;

    // Require pattern argument
    if (args.length === 0) {
      return `find: missing search pattern\n\n💡 TIP: Gebruik 'find <patroon>' om bestanden te zoeken. Bijvoorbeeld: find passwd`;
    }

    const pattern = args[0].toLowerCase();

    try {
      // Search entire filesystem starting from root
      const results = this._searchFilesystem(vfs.fs['/'], '/', pattern);

      if (results.length === 0) {
        return `find: no files matching '${args[0]}' found\n\n💡 TIP: De zoekterm is case-insensitive en zoekt in bestandsnamen.`;
      }

      // Format results
      const output = results.join('\n');
      const tip = results.length > 5
        ? `\n\n💡 ${results.length} resultaten gevonden. Gebruik 'cat <pad>' om een bestand te lezen.`
        : `\n\n💡 Gebruik 'cat <pad>' om de inhoud te bekijken.`;

      return output + tip;

    } catch (error) {
      return `find: ${error.message}`;
    }
  },

  /**
   * Recursively search filesystem for matching files
   * @private
   */
  _searchFilesystem(node, currentPath, pattern) {
    const results = [];

    if (!node || node.type !== 'directory' || !node.children) {
      return results;
    }

    for (const [name, child] of Object.entries(node.children)) {
      const fullPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;

      // Check if name matches pattern
      if (name.toLowerCase().includes(pattern)) {
        results.push(fullPath);
      }

      // Recursively search subdirectories
      if (child.type === 'directory') {
        const subResults = this._searchFilesystem(child, fullPath, pattern);
        results.push(...subResults);
      }
    }

    return results;
  },

  manPage: `
NAAM
    find - search for files and directories

SYNOPSIS
    find <PATTERN>

BESCHRIJVING
    Zoek recursief naar bestanden en directories waarvan de naam het opgegeven
    patroon bevat. De zoekopdracht is case-insensitive en doorzoekt het hele
    filesystem vanaf de root directory.

ARGUMENTEN
    PATTERN
        Zoekpatroon (wordt gezocht in bestandsnamen, case-insensitive)

VOORBEELDEN
    find passwd
        Zoek alle bestanden met 'passwd' in de naam

    find log
        Zoek alle log-gerelateerde bestanden

    find .ssh
        Zoek SSH configuratie bestanden/directories

    find txt
        Zoek alle .txt bestanden

EDUCATIEVE TIPS
    🔍 find is een krachtige tool voor reconnaissance:
       - Ontdek de structuur van een systeem
       - Vind interessante configuratie bestanden
       - Zoek credentials, keys, of gevoelige data

    💡 Handige zoekopdrachten in pentesting:
       - find ssh       → SSH keys en configuratie
       - find passwd    → User database bestanden
       - find log       → System logs
       - find config    → Configuratiebestanden
       - find shadow    → Password hash files
       - find key       → Encryption keys

    🎯 In real Linux:
       Real 'find' is veel krachtiger:
       - find / -name "*.conf"     → Zoek met wildcards
       - find /home -type f        → Alleen files, geen directories
       - find / -user root         → Bestanden van specifieke user
       - find / -perm 777          → Bestanden met specifieke permissies

    🏗️ Pentesting workflow:
       1. find passwd     → Vind user databases
       2. cat <result>    → Bekijk inhoud
       3. grep <pattern>  → Zoek specifieke strings in inhoud

    ⚠️ In deze simulator:
       - Simpele substring matching (geen regex of wildcards)
       - Case-insensitive zoeken
       - Altijd vanaf root directory (/)

VERSCHIL MET GREP
    - find → Zoekt in BESTANDSNAMEN
    - grep → Zoekt in BESTANDSINHOUD

GERELATEERDE COMMANDO'S
    grep, ls, cat, locate (locate niet beschikbaar in simulator)
`.trim()
};
