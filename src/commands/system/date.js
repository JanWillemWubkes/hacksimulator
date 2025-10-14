/**
 * date - Display current date and time
 */

export default {
  name: 'date',
  description: 'Toon huidige datum en tijd',
  category: 'system',
  usage: 'date',

  execute(args, flags, context) {
    const now = new Date();

    // Format like Unix date command (locale-aware)
    // Example: Mon Oct 14 2025 20:45:30 GMT+0200 (Central European Summer Time)
    return now.toString();
  }
};
