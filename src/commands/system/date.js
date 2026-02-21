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
  },

  manPage: `
NAAM
    date - toon huidige datum en tijd

SYNOPSIS
    date

BESCHRIJVING
    Toont de huidige systeemdatum en -tijd in volledig formaat.

VOORBEELDEN
    date
        Output: Mon Oct 15 2025 18:45:30 GMT+0200

GEBRUIK
    Gebruik dit om de huidige tijd te checken of om timestamps
    te genereren voor logs.

GERELATEERDE COMMANDO'S
    history (toont timestamps van commands)
`.trim()
};
