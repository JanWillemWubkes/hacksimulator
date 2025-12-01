/**
 * mkdir - Make directories
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'mkdir',
  category: 'filesystem',
  description: 'Create a new directory',
  usage: 'mkdir <directory>',

  async execute(args, flags, context) {
    const { vfs } = context;

    // Require directory argument
    if (args.length === 0) {
      return `mkdir: missing operand\n\n[ ? ] TIP: Gebruik 'mkdir <naam>' om een directory aan te maken. Bijvoorbeeld: mkdir testdir`;
    }

    const path = args[0];

    try {
      vfs.createDirectory(path);
      return ''; // mkdir produces no output on success

    } catch (error) {
      // Educational error messages
      if (error.message.includes('No such directory')) {
        return `mkdir: cannot create directory '${path}': No such file or directory\n\n[ ? ] TIP: De parent directory moet bestaan. Probeer eerst 'cd' naar de juiste locatie.`;
      }

      if (error.message.includes('File exists')) {
        return `mkdir: cannot create directory '${path}': File exists\n\n[ ? ] TIP: Een bestand of directory met deze naam bestaat al. Gebruik 'ls' om te zien wat er is.`;
      }

      if (error.message.includes('Not a directory')) {
        return `mkdir: cannot create directory '${path}': Not a directory\n\n[ ? ] TIP: De parent in het pad is een bestand, geen directory.`;
      }

      return `mkdir: ${error.message}`;
    }
  },

  manPage: `
NAAM
    mkdir - make directories

SYNOPSIS
    mkdir <DIRECTORY>

BESCHRIJVING
    Maak een nieuwe directory aan. De parent directory moet al bestaan.

ARGUMENTEN
    DIRECTORY
        Naam van de nieuwe directory (verplicht)

VOORBEELDEN
    mkdir testdir
        Maak een directory genaamd 'testdir' in de huidige directory

    mkdir /tmp/mydata
        Maak een directory in /tmp

    mkdir ~/projects
        Maak een directory in je home folder

EDUCATIEVE TIPS
    [DIR] Directories organiseren je filesystem en groeperen gerelateerde bestanden

    [ + ]️ Standaard gedrag:
       • Parent directory moet bestaan
       • Naam mag geen / bevatten (behalve in absoluut pad)
       • Directory wordt aangemaakt in huidige directory (tenzij absoluut pad)

    [ ? ] Veelvoorkomende use cases:
       • mkdir logs      → Voor het opslaan van logbestanden
       • mkdir backups   → Voor het bewaren van backups
       • mkdir scripts   → Voor het organiseren van scripts

    [ ! ] Permissies:
       In echte systemen kun je directories alleen aanmaken waar je
       schrijfrechten hebt. In deze simulator kun je schrijven in je home
       directory en /tmp.

GERELATEERDE COMMANDO'S
    touch, ls, cd, rm
`.trim()
};
