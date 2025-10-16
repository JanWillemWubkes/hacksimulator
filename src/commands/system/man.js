/**
 * man - Display manual page for a command
 */

export default {
  name: 'man',
  description: 'Toon handleiding voor een command',
  category: 'system',
  usage: 'man [command]',

  execute(args, flags, context) {
    if (args.length === 0) {
      return 'Gebruik: man [command]\n\n💡 TIP: Type \'help\' voor een lijst van beschikbare commands.';
    }

    const commandName = args[0].toLowerCase();
    const registry = context.terminal.getRegistry();

    // Check if command exists
    if (!registry.has(commandName)) {
      return `Geen manual entry gevonden voor '${commandName}'.\n\n💡 TIP: Type 'help' voor een lijst van beschikbare commands.`;
    }

    const handler = registry.get(commandName);

    // Check if command has a manPage property
    if (handler.manPage) {
      return '\n' + handler.manPage + '\n';
    }

    // Fallback: Build basic manual page if no manPage property exists
    let output = `\nNAME\n  ${commandName} - ${handler.description}\n\n`;
    output += `SYNOPSIS\n  ${handler.usage}\n\n`;
    output += `DESCRIPTION\n  ${handler.description}\n\n`;

    if (handler.category) {
      output += `CATEGORY\n  ${handler.category}\n`;
    }

    return output;
  },

  manPage: `
NAAM
    man - toon manual page van command

SYNOPSIS
    man <COMMAND>

BESCHRIJVING
    Toont de gedetailleerde manual page (handleiding) van een command.
    Elke command heeft een uitgebreide man page met voorbeelden, gebruik,
    en educatieve tips.

ARGUMENTEN
    COMMAND
        Naam van het command waarvoor je de manual wilt zien

VOORBEELDEN
    man ls
        Toon manual van 'ls' command

    man nmap
        Toon manual van 'nmap' port scanner

GEBRUIK
    Als je niet weet hoe een command werkt, gebruik dan 'man <command>'
    voor volledige documentatie. Man pages bevatten:
    • Synopsis (gebruik)
    • Beschrijving
    • Argumenten en flags
    • Voorbeelden
    • Educatieve tips
    • Security context (voor security tools)

GERELATEERDE COMMANDO'S
    help (overzicht van alle commands)
`.trim()
};
