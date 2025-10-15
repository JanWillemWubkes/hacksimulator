/**
 * cd - Change directory
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'cd',
  category: 'filesystem',
  description: 'Change the current directory',
  usage: 'cd [directory]',

  async execute(args, flags, context) {
    const { vfs, terminal } = context;

    // No argument = go to home directory
    if (args.length === 0) {
      try {
        vfs.setCwd('~');
        // Update terminal prompt with new directory
        if (terminal) {
          const renderer = terminal.getRenderer();
          renderer.updatePrompt(vfs.getCwd());
        }
        return ''; // cd produces no output on success
      } catch (error) {
        return `cd: ${error.message}`;
      }
    }

    const path = args[0];

    try {
      vfs.setCwd(path);
      // Update terminal prompt with new directory
      if (terminal) {
        const renderer = terminal.getRenderer();
        renderer.updatePrompt(vfs.getCwd());
      }
      return ''; // cd produces no output on success

    } catch (error) {
      // Educational error messages
      if (error.message.includes('No such directory')) {
        return `cd: ${path}: No such file or directory\n\n💡 TIP: Gebruik 'ls' om te zien welke directories beschikbaar zijn, of 'pwd' om te zien waar je bent.`;
      }

      if (error.message.includes('Not a directory')) {
        return `cd: ${path}: Not a directory\n\n💡 TIP: Je kunt alleen naar directories navigeren, niet naar bestanden.`;
      }

      if (error.message.includes('Permission denied')) {
        return `cd: ${path}: Permission denied\n\n🔒 BEVEILIGING: Sommige directories zijn beveiligd en niet toegankelijk.`;
      }

      return `cd: ${error.message}`;
    }
  },

  manPage: `
NAAM
    cd - change directory

SYNOPSIS
    cd [DIRECTORY]

BESCHRIJVING
    Verander de huidige working directory naar DIRECTORY. Als geen directory
    wordt opgegeven, ga je naar je home directory.

ARGUMENTEN
    DIRECTORY
        De directory waar je naartoe wilt navigeren. Kan absoluut (/etc/log)
        of relatief (../home) zijn.

    Speciale notaties:
        ~       Home directory (/home/hacker)
        .       Huidige directory
        ..      Parent directory (één niveau omhoog)
        /       Root directory
        -       Vorige directory (niet geïmplementeerd in simulator)

VOORBEELDEN
    cd
        Ga naar je home directory

    cd /etc
        Ga naar de /etc directory

    cd ..
        Ga één directory omhoog

    cd ~/notes
        Ga naar de notes directory in je home folder

    cd /var/log
        Ga naar de log directory

EDUCATIEVE TIPS
    🧭 Path types:
       - Absoluut pad: begint met / (bijv. /etc/passwd)
       - Relatief pad: relatief aan huidige locatie (bijv. ../home)

    🏠 Shortcuts:
       - ~ is altijd je home directory (/home/hacker)
       - .. brengt je één niveau omhoog
       - . is de huidige directory (handig bij commands zoals 'cp file .')

    💡 Combineer met 'pwd' om te zien waar je bent na een cd commando

GERELATEERDE COMMANDO'S
    pwd, ls, find
`.trim()
};
