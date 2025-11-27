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
    const option = args[0];

    // Show help if requested
    if (option === '--help' || option === 'help') {
      return `RESET - Reset filesystem of instellingen

GEBRUIK:
  reset              Reset filesystem naar beginwaarde
  reset consent      Reset security tools consent
  reset --help       Toon deze help

OPTIES:
  (geen args)        Reset virtual filesystem (standaard gedrag)
  consent            Verwijder opgeslagen security tools consent
  --help             Toon help informatie`;
    }

    // Handle consent reset
    if (option === 'consent') {
      // Check if consent exists
      const hasConsent = localStorage.getItem('security_tools_consent') === 'true';

      if (!hasConsent) {
        return `[ ! ] Geen security tools consent gevonden

Je hebt nog geen consent gegeven voor offensive security tools.
Type 'hydra', 'sqlmap', of 'nikto' om de waarschuwing te zien.`;
      }

      // Remove consent
      localStorage.removeItem('security_tools_consent');

      return `[ ✓ ] Security tools consent gereset

De waarschuwing verschijnt opnieuw bij gebruik van:
  • hydra   - Network logon brute force tool
  • sqlmap  - SQL injection testing tool
  • nikto   - Web server vulnerability scanner

[ ? ] Type een van deze commands om de educatieve waarschuwing
      opnieuw te lezen.`;
    }

    // Handle unknown option
    if (option && option !== '--help' && option !== 'help') {
      return `[ ! ] Onbekende optie: ${option}

GEBRUIK:
  reset              Reset filesystem
  reset consent      Reset security tools consent
  reset --help       Toon help

Type 'reset --help' voor meer informatie.`;
    }

    // Default behavior: Reset filesystem (no args or explicit filesystem arg)
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
      return `Filesystem reset to initial state.\n\n[ ✓ ] Alle aangemaakte bestanden en directories zijn verwijderd.\n[ ✓ ] Je bent terug in /home/hacker.\n[ ✓ ] Alle originele bestanden zijn hersteld.\n\n[ ? ] Je command history is bewaard. Gebruik ↑↓ om vorige commands te bekijken.`;

    } catch (error) {
      return `reset: ${error.message}`;
    }
  },

  manPage: `
NAAM
    reset - reset filesystem or settings to initial state

SYNOPSIS
    reset [optie]

BESCHRIJVING
    Reset het virtual filesystem of instellingen naar de oorspronkelijke
    staat. Zonder argumenten wordt het filesystem gereset. Met argumenten
    kunnen specifieke instellingen worden gereset.

OPTIES
    (geen argumenten)
        Reset het virtual filesystem naar de oorspronkelijke staat

    consent
        Reset security tools consent. De waarschuwing voor offensive
        security tools (hydra, sqlmap, nikto) zal opnieuw verschijnen

    --help
        Toon help informatie

VOORBEELDEN
    reset
        Reset filesystem naar beginwaarde

    reset consent
        Reset security tools consent

    reset --help
        Toon help informatie

EDUCATIEVE TIPS
    [ ↻ ] reset is je "veiligheidsnet":
       - Per ongeluk belangrijke bestanden verwijderd? → reset
       - Filesystem is rommelig geworden? → reset
       - Wil je opnieuw beginnen? → reset
       - Waarschuwing opnieuw lezen? → reset consent

    [DSK] Wat wordt gereset (reset zonder args):
       [ ✓ ] Alle bestanden naar originele inhoud
       [ ✓ ] Alle directories naar originele structuur
       [ ✓ ] Current working directory naar /home/hacker
       [ ✓ ] Verwijderde bestanden worden hersteld
       [ ✓ ] Nieuwe bestanden worden verwijderd

    [ ? ] Wat blijft behouden:
       [ ✓ ] Command history (je kunt nog steeds ↑↓ gebruiken)
       [ ✓ ] Security tools consent (gebruik 'reset consent' om te wissen)
       [ ✓ ] Je kennis en ervaring! [ : )]

    [ → ] Use cases:
       - Je hebt per ongeluk 'rm -r' gebruikt op verkeerde directory
       - Je wilt een oefening opnieuw doen
       - Het filesystem is te rommelig geworden
       - Je wilt experimenteren zonder consequenties
       - Iemand anders gebruikt je computer (reset consent)
       - Je wilt de security waarschuwing opnieuw lezen (reset consent)

    [ ~ ] reset consent - Security Tools:
       Offensive security tools (hydra, sqlmap, nikto) tonen bij eerste
       gebruik een uitgebreide juridische waarschuwing. Na het lezen wordt
       je consent opgeslagen zodat je niet elke keer de warning ziet.

       Gebruik 'reset consent' om:
       • De educatieve waarschuwing opnieuw te lezen
       • Je beveiligingsbewustzijn te verfrissen
       • Anderen die je computer gebruiken de warning te laten zien

    [ ! ] WAARSCHUWING:
       reset is PERMANENT. Alle aanpassingen sinds de laatste reset
       worden verwijderd. Er is geen "undo" voor reset zelf.

    [ + ]️ In real Linux:
       Er is GEEN reset commando. Verwijderde bestanden zijn weg (tenzij
       je backups hebt). Dit maakt reset een unieke feature van deze
       simulator - gebruik het om veilig te experimenteren!

    [ ? ] Pro tip:
       Als je complexe wijzigingen maakt en deze wilt bewaren voor later,
       maak dan eerst een backup met 'cp' naar /tmp/ voordat je reset gebruikt.

GERELATEERDE COMMANDO'S
    clear, history (history -c om alleen history te wissen)
`.trim()
};
