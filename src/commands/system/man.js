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

    // Build manual page (basic version - full man pages in M3)
    let output = `\nNAME\n  ${commandName} - ${handler.description}\n\n`;
    output += `SYNOPSIS\n  ${handler.usage}\n\n`;

    // TODO: Full man pages in M3 (help system milestone)
    // For now, just show description
    output += `DESCRIPTION\n  ${handler.description}\n\n`;

    if (handler.category) {
      output += `CATEGORY\n  ${handler.category}\n`;
    }

    return output;
  }
};
