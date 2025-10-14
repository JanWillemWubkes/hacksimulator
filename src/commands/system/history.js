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
  }
};
