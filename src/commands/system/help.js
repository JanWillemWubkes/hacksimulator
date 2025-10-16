/**
 * help - Display available commands
 */

export default {
  name: 'help',
  description: 'Toon beschikbare commands',
  category: 'system',
  usage: 'help [category]',

  execute(args, flags, context) {
    const registry = context.terminal.getRegistry();

    // If category specified, show commands in that category
    if (args.length > 0) {
      const category = args[0].toLowerCase();
      const commands = registry.getByCategory(category);

      if (commands.length === 0) {
        return `Geen commands gevonden in categorie '${category}'.\n\n💡 TIP: Type 'help' voor alle categorieën.`;
      }

      let output = `Commands in categorie '${category}':\n\n`;
      commands.forEach(cmd => {
        output += `  ${cmd.name.padEnd(15)} ${cmd.description}\n`;
      });

      return output;
    }

    // Show all commands grouped by category
    const categories = registry.getCategories();
    let output = 'Beschikbare commands:\n\n';

    categories.forEach(category => {
      const commands = registry.getByCategory(category);

      if (commands.length > 0) {
        output += `${category.toUpperCase()}:\n`;
        commands.forEach(cmd => {
          output += `  ${cmd.name.padEnd(15)} ${cmd.description}\n`;
        });
        output += '\n';
      }
    });

    output += '💡 TIP: Type \'man [command]\' voor gedetailleerde informatie.\n';
    output += '💡 TIP: Gebruik ↑↓ pijltjestoetsen voor command geschiedenis.';

    return output;
  },

  manPage: `
NAAM
    help - toon beschikbare commands

SYNOPSIS
    help [CATEGORY]

BESCHRIJVING
    Toont een overzicht van alle beschikbare commands, gegroepeerd per
    categorie. Optioneel kun je een specifieke categorie opvragen.

ARGUMENTEN
    CATEGORY (optioneel)
        Categorienaam: system, filesystem, network, security, special

VOORBEELDEN
    help
        Toon alle commands

    help filesystem
        Toon alleen filesystem commands

CATEGORIEËN
    • system       → Basis terminal commands
    • filesystem   → Bestanden en directories
    • network      → Netwerk analyse tools
    • security     → Security testing tools
    • special      → Speciale commands (reset)

GERELATEERDE COMMANDO'S
    man <command> (gedetailleerde help voor specifiek command)
`.trim()
};
