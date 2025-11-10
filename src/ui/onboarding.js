/**
 * Onboarding System
 * First Time User Experience (FTUE) logic
 * Progressive hints and encouragement
 */

class Onboarding {
  constructor() {
    this.isFirstVisit = true;
    this.commandCount = 0;
    this.hasShownEncouragement = false;
    this.hasShownTabHint = false;
    this.hasShownTutorialSuggestion = false;
    this.hasShownCtrlRHint = false;
    this.hasShownCtrlLHint = false;

    // localStorage keys
    this.STORAGE_KEY_FIRST_VISIT = 'hacksim_first_visit';
    this.STORAGE_KEY_COMMAND_COUNT = 'hacksim_command_count';
    this.STORAGE_KEY_ONBOARDING_STATE = 'hacksim_onboarding_state';
    this.STORAGE_KEY_COMMANDS_TRIED = 'hacksim_commands_tried';
  }

  /**
   * Initialize onboarding system
   * Load state from localStorage
   */
  init() {
    try {
      // Check if this is first visit
      const firstVisitFlag = localStorage.getItem(this.STORAGE_KEY_FIRST_VISIT);
      this.isFirstVisit = firstVisitFlag === null;

      // Load command count
      const savedCount = localStorage.getItem(this.STORAGE_KEY_COMMAND_COUNT);
      this.commandCount = savedCount ? parseInt(savedCount, 10) : 0;

      // Load onboarding state
      const savedState = localStorage.getItem(this.STORAGE_KEY_ONBOARDING_STATE);
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          this.hasShownEncouragement = state.hasShownEncouragement || false;
          this.hasShownTabHint = state.hasShownTabHint || false;
          this.hasShownTutorialSuggestion = state.hasShownTutorialSuggestion || false;
          this.hasShownCtrlRHint = state.hasShownCtrlRHint || false;
          this.hasShownCtrlLHint = state.hasShownCtrlLHint || false;
        } catch (e) {
          console.warn('Failed to parse onboarding state:', e);
        }
      }

      console.log('Onboarding initialized:', {
        isFirstVisit: this.isFirstVisit,
        commandCount: this.commandCount
      });
    } catch (e) {
      console.error('Failed to initialize onboarding:', e);
      // Set safe defaults
      this.isFirstVisit = true;
      this.commandCount = 0;
    }
  }

  /**
   * Check if this is a first-time visitor
   * @returns {boolean}
   */
  isFirstTimeVisitor() {
    return this.isFirstVisit;
  }

  /**
   * Get welcome message for first-time visitors
   * @returns {string}
   */
  getWelcomeMessage() {
    if (!this.isFirstVisit) {
      // Returning visitor - short welcome
      return this._getReturningVisitorWelcome();
    }

    // First-time visitor - full welcome
    return this._getFirstTimeWelcome();
  }

  /**
   * First-time visitor welcome - Mission-driven "Hacker Mentor" tone
   * Emphasizes identity, action, and ethical purpose
   * @private
   */
  _getFirstTimeWelcome() {
    return `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  [***] HACKSIMULATOR.NL - ETHICAL HACKING  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

[ ✓ ] Toegang verleend

Je bent ingelogd op een gesimuleerd netwerk.
Je missie: leer de tools die ethical hackers
gebruiken om systemen te beveiligen - volledig
veilig en legaal.

[ ! ] Real hackers beginnen met de basics:

→ FASE 1: Terminal basics     ('ls', 'cd', 'pwd')
→ FASE 2: File manipulation   ('mkdir', 'touch', 'rm')
→ FASE 3: Network scanning    ('ping', 'nmap')
→ FASE 4: Security tools      ('hashcat', 'hydra')

→ Type 'help' om te beginnen
→ Type 'leerpad' om voortgang te volgen
`.trim();
  }

  /**
   * Returning visitor welcome - Ultra-brief with identity reinforcement
   * Acknowledges user as "hacker" to strengthen engagement
   * @private
   */
  _getReturningVisitorWelcome() {
    return `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  [***] Welkom terug in het lab, hacker     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

[ ✓ ] Systeem gereed → Type 'help' voor nieuwe opdrachten
`.trim();
  }

  /**
   * Mark that user has completed first visit
   * Call this after first command is executed
   */
  markFirstVisitComplete() {
    if (this.isFirstVisit) {
      try {
        localStorage.setItem(this.STORAGE_KEY_FIRST_VISIT, 'false');
        this.isFirstVisit = false;
      } catch (e) {
        console.warn('Could not save first visit state:', e);
      }
    }
  }

  /**
   * Record that a command was executed
   * Returns a hint message if appropriate
   * @param {string} commandName - Name of the command that was executed
   * @returns {string|null} Hint message or null
   */
  recordCommand(commandName = null) {
    this.commandCount++;

    try {
      localStorage.setItem(this.STORAGE_KEY_COMMAND_COUNT, this.commandCount.toString());
    } catch (e) {
      console.warn('Could not save command count:', e);
    }

    // Track individual command for leerpad
    if (commandName) {
      this._trackCommand(commandName);
    }

    // Save state
    this._saveState();

    // Return progressive hints
    return this._getProgressiveHint();
  }

  /**
   * Track individual command execution for leerpad progress
   * @private
   * @param {string} commandName
   */
  _trackCommand(commandName) {
    try {
      // Get existing commands
      const stored = localStorage.getItem(this.STORAGE_KEY_COMMANDS_TRIED);
      const commands = stored ? stored.split(',').filter(cmd => cmd.trim()) : [];

      // Add new command if not already tracked
      if (!commands.includes(commandName)) {
        commands.push(commandName);
        localStorage.setItem(this.STORAGE_KEY_COMMANDS_TRIED, commands.join(','));
      }
    } catch (e) {
      console.warn('Could not track command:', e);
    }
  }

  /**
   * Get progressive hints based on command count
   * Uses terminal-native ASCII brackets, hacker terminology, and mission framing
   * @private
   * @returns {string|null}
   */
  _getProgressiveHint() {
    // After 1st command: Exploration encouragement
    if (this.commandCount === 1 && !this.hasShownEncouragement) {
      this.hasShownEncouragement = true;
      this._saveState();
      return '\n[ ✓ ] Eerste opdracht voltooid!\n\nOntdek je omgeving:\n→ \'ls\'   - Bekijk bestanden in deze map\n→ \'help\' - Zie alle beschikbare hacking tools';
    }

    // After 3 commands: Tab completion discovery
    if (this.commandCount === 3 && !this.hasShownTabHint) {
      this.hasShownTabHint = true;
      this._saveState();
      return '\n[ ✓ ] Pro tip: Gebruik Tab om commands snel in te typen\n\nProbeer het nu:\n→ Type "nm" en druk Tab      - Vult aan naar "nmap"\n→ Type "l" en druk Tab 2x    - Cyclet door ls, ln, ...';
    }

    // After 5 commands: Introduce reconnaissance (professional workflow)
    if (this.commandCount === 5 && !this.hasShownTutorialSuggestion) {
      this.hasShownTutorialSuggestion = true;
      this._saveState();
      return '\n[ ✓ ] 5 opdrachten voltooid - je bent onderweg!\n\nKlaar voor reconnaissance? Ethical hackers beginnen altijd\nmet informatie verzamelen:\n→ \'nmap 192.168.1.1\' - Scan een netwerk\n→ \'man nmap\'         - Leer hoe het werkt';
    }

    // After 7 commands: Ctrl+R history search
    if (this.commandCount === 7 && !this.hasShownCtrlRHint) {
      this.hasShownCtrlRHint = true;
      this._saveState();
      return '\n[ ✓ ] Pro tip: Gebruik Ctrl+R om door je geschiedenis te zoeken\n\nProbeer het nu:\n→ Druk Ctrl+R en type "ls"     - Vind vorige ls commands\n→ Druk Ctrl+R opnieuw          - Cycle door matches\n→ Enter om te accepteren       - Esc om te annuleren\n\nType \'shortcuts\' voor alle keyboard shortcuts.';
    }

    // After 10 commands: Security tools with enhanced legal warning
    if (this.commandCount === 10) {
      return '\n[ ! ] 10 opdrachten - tijd voor krachtigere tools\n\n[ ! ] LET OP: De volgende tools zijn ALLEEN voor educatief gebruik.\n      In de echte wereld zijn ze illegaal zonder expliciete toestemming.\n\nKlaar? Type \'help security\' voor geavanceerde tools.';
    }

    // After 12 commands: Ctrl+L clear screen
    if (this.commandCount === 12 && !this.hasShownCtrlLHint) {
      this.hasShownCtrlLHint = true;
      this._saveState();
      return '\n[ ✓ ] Is je terminal vol? Gebruik Ctrl+L om te leegmaken\n\n(Net als echte Linux terminals - geen rommelige output meer!)';
    }

    return null;
  }

  /**
   * Save onboarding state to localStorage
   * @private
   */
  _saveState() {
    try {
      const state = {
        hasShownEncouragement: this.hasShownEncouragement,
        hasShownTabHint: this.hasShownTabHint,
        hasShownTutorialSuggestion: this.hasShownTutorialSuggestion,
        hasShownCtrlRHint: this.hasShownCtrlRHint,
        hasShownCtrlLHint: this.hasShownCtrlLHint
      };
      localStorage.setItem(this.STORAGE_KEY_ONBOARDING_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save onboarding state:', e);
    }
  }

  /**
   * Get hint for persistent display (rechts onderin)
   * Disappears after 5 commands
   * @returns {string|null}
   */
  getPersistentHint() {
    if (this.commandCount >= 5) {
      return null; // Hide after 5 commands
    }

    return 'Type "help" voor commands';
  }

  /**
   * Reset onboarding (for testing or user request)
   */
  reset() {
    try {
      localStorage.removeItem(this.STORAGE_KEY_FIRST_VISIT);
      localStorage.removeItem(this.STORAGE_KEY_COMMAND_COUNT);
      localStorage.removeItem(this.STORAGE_KEY_ONBOARDING_STATE);
      localStorage.removeItem(this.STORAGE_KEY_COMMANDS_TRIED);
    } catch (e) {
      console.warn('Could not reset onboarding state:', e);
    }

    this.isFirstVisit = true;
    this.commandCount = 0;
    this.hasShownEncouragement = false;
    this.hasShownTabHint = false;
    this.hasShownTutorialSuggestion = false;
    this.hasShownCtrlRHint = false;
    this.hasShownCtrlLHint = false;

    console.log('Onboarding reset');
  }

  /**
   * Get onboarding statistics (for debugging)
   * @returns {Object}
   */
  getStats() {
    return {
      isFirstVisit: this.isFirstVisit,
      commandCount: this.commandCount,
      hasShownEncouragement: this.hasShownEncouragement,
      hasShownTabHint: this.hasShownTabHint,
      hasShownTutorialSuggestion: this.hasShownTutorialSuggestion,
      hasShownCtrlRHint: this.hasShownCtrlRHint,
      hasShownCtrlLHint: this.hasShownCtrlLHint
    };
  }
}

// Export as singleton
export default new Onboarding();
