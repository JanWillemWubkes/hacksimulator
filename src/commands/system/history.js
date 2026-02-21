/**
 * history - Display command history
 */

export default {
  name: 'history',
  description: 'Toon command geschiedenis',
  category: 'system',
  usage: 'history [-c]',

  execute(args, flags, context) {
    const historyManager = context.terminal.getHistory();

    // Clear history flag
    if (flags.c) {
      historyManager.clear();
      return 'Command history gewist.';
    }

    // Get all history
    const entries = historyManager.getAll();

    if (entries.length === 0) {
      return 'Geen command geschiedenis beschikbaar.';
    }

    // Format like bash history (numbered)
    return entries
      .map((cmd, index) => `  ${index + 1}  ${cmd}`)
      .join('\n');
  },

  manPage: `
NAAM
    history - toon command geschiedenis

SYNOPSIS
    history [-c]

BESCHRIJVING
    Toont een genummerde lijst van alle commands die je in deze sessie
    hebt uitgevoerd. Command history wordt opgeslagen in localStorage
    en blijft beschikbaar tussen sessies.

FLAGS
    -c      Wis alle command geschiedenis

VOORBEELDEN
    history
        Toon alle uitgevoerde commands

    history -c
        Wis de geschiedenis

GEBRUIK
    • Gebruik ↑↓ pijltjestoetsen om door history te navigeren
    • History wordt automatisch opgeslagen (max 100 items)
    • Gebruik history -c om opnieuw te beginnen

GERELATEERDE COMMANDO'S
    clear (wis scherm, maar niet history)
`.trim()
};
