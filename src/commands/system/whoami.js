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
  },

  manPage: `
NAAM
    whoami - toon huidige gebruikersnaam

SYNOPSIS
    whoami

BESCHRIJVING
    Toont de naam van de gebruiker waarmee je bent ingelogd.
    In deze simulator ben je altijd ingelogd als 'hacker'.

VOORBEELDEN
    whoami
        Output: hacker

GEBRUIK
    Gebruik dit om te verifiëren met welke user account je werkt.
    Belangrijk voor permission checks en security context.

GERELATEERDE COMMANDO'S
    id (user info - niet in simulator)
`.trim()
};
