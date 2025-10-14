/**
 * whoami - Display current username
 */

export default {
  name: 'whoami',
  description: 'Toon huidige gebruikersnaam',
  category: 'system',
  usage: 'whoami',

  execute(args, flags, context) {
    return context.user || 'hacker';
  }
};
