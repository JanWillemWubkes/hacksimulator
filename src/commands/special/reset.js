/**
 * reset - Reset filesystem to initial state
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'reset',
  category: 'special',
  description: 'Reset filesystem to initial state',
  usage: 'reset',

  async execute(args, flags, context) {
    const { vfs, terminal } = context;

    try {
      // Reset the virtual filesystem
      vfs.reset();

      // Update terminal prompt to home directory
      if (terminal) {
        const renderer = terminal.getRenderer();
        renderer.updatePrompt(vfs.getCwd());
      }

      // Clear command history (optional - user might want to keep it)
      // Commented out to preserve learning history
      // if (context.historyManager) {
      //   context.historyManager.clear();
      // }

      // Clear terminal output (visual reset)
      if (terminal && typeof terminal.clear === 'function') {
        terminal.clear();
      }

      // Show confirmation message
      return `Filesystem reset to initial state.\n\n✅ Alle aangemaakte bestanden en directories zijn verwijderd.\n✅ Je bent terug in /home/hacker.\n✅ Alle originele bestanden zijn hersteld.\n\n💡 TIP: Je command history is bewaard. Gebruik ↑↓ om vorige commands te bekijken.`;

    } catch (error) {
      return `reset: ${error.message}`;
    }
  },

  manPage: `
NAAM
    reset - reset filesystem to initial state

SYNOPSIS
    reset

BESCHRIJVING
    Reset het virtual filesystem naar de oorspronkelijke staat. Alle
    aanpassingen (nieuwe bestanden, verwijderde bestanden, gekopieerde
    bestanden) worden ongedaan gemaakt.

OPTIES
    Geen opties beschikbaar

VOORBEELDEN
    reset
        Reset alles naar beginwaarde

EDUCATIEVE TIPS
    🔄 reset is je "veiligheidsnet":
       - Per ongeluk belangrijke bestanden verwijderd? → reset
       - Filesystem is rommelig geworden? → reset
       - Wil je opnieuw beginnen? → reset

    💾 Wat wordt gereset:
       ✅ Alle bestanden naar originele inhoud
       ✅ Alle directories naar originele structuur
       ✅ Current working directory naar /home/hacker
       ✅ Verwijderde bestanden worden hersteld
       ✅ Nieuwe bestanden worden verwijderd

    💡 Wat blijft behouden:
       ✅ Command history (je kunt nog steeds ↑↓ gebruiken)
       ✅ Je kennis en ervaring! 😊

    🎯 Use cases:
       - Je hebt per ongeluk 'rm -r' gebruikt op verkeerde directory
       - Je wilt een oefening opnieuw doen
       - Het filesystem is te rommelig geworden
       - Je wilt experimenteren zonder consequenties

    ⚠️ WAARSCHUWING:
       reset is PERMANENT. Alle aanpassingen sinds de laatste reset
       worden verwijderd. Er is geen "undo" voor reset zelf.

    🏗️ In real Linux:
       Er is GEEN reset commando. Verwijderde bestanden zijn weg (tenzij
       je backups hebt). Dit maakt reset een unieke feature van deze
       simulator - gebruik het om veilig te experimenteren!

    💡 Pro tip:
       Als je complexe wijzigingen maakt en deze wilt bewaren voor later,
       maak dan eerst een backup met 'cp' naar /tmp/ voordat je reset gebruikt.

GERELATEERDE COMMANDO'S
    clear, history (history -c om alleen history te wissen)
`.trim()
};
