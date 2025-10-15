/**
 * pwd - Print working directory
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'pwd',
  category: 'filesystem',
  description: 'Print current working directory',
  usage: 'pwd',

  async execute(args, flags, context) {
    const { vfs } = context;

    try {
      const cwd = vfs.getCwd();
      return cwd;

    } catch (error) {
      return `pwd: ${error.message}`;
    }
  },

  manPage: `
NAAM
    pwd - print working directory

SYNOPSIS
    pwd

BESCHRIJVING
    Print het absolute pad van de huidige working directory.

VOORBEELDEN
    pwd
        Toon waar je momenteel bent

    cd /etc && pwd
        Ga naar /etc en toon de locatie

EDUCATIEVE TIPS
    🧭 pwd staat voor "Print Working Directory" - het toont altijd het
       volledige (absolute) pad vanaf de root (/)

    💡 Handig om te gebruiken na 'cd' om te verifiëren waar je bent

    🏠 Je begint altijd in /home/hacker (je home directory)

    📂 Gebruik pwd in combinatie met andere commands:
       - 'pwd' om te zien waar je bent
       - 'ls' om te zien wat er in deze directory staat
       - 'cd ..' om een directory omhoog te gaan

GERELATEERDE COMMANDO'S
    cd, ls
`.trim()
};
