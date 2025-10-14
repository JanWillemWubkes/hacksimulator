/**
 * clear - Clear terminal screen
 */

export default {
  name: 'clear',
  description: 'Wis het terminal scherm',
  category: 'system',
  usage: 'clear',

  execute(args, flags, context) {
    // Clear the terminal
    context.terminal.clear();

    // Return empty string (no output needed)
    return '';
  }
};
