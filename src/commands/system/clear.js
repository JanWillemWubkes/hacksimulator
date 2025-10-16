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
  },

  manPage: `
NAAM
    clear - wis het terminal scherm

SYNOPSIS
    clear

BESCHRIJVING
    Verwijdert alle tekst van het terminal scherm en geeft je een
    schone lei om mee te werken.

VOORBEELDEN
    clear
        Wis het scherm

GEBRUIK
    Gebruik dit command wanneer je terminal vol staat met tekst en je
    een overzichtelijk scherm wilt.

GERELATEERDE COMMANDO'S
    history -c (wis command history)
`.trim()
};

