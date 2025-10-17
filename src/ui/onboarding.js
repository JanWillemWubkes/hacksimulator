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
    this.hasShownTutorialSuggestion = false;

    // localStorage keys
    this.STORAGE_KEY_FIRST_VISIT = 'hacksim_first_visit';
    this.STORAGE_KEY_COMMAND_COUNT = 'hacksim_command_count';
    this.STORAGE_KEY_ONBOARDING_STATE = 'hacksim_onboarding_state';
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
          this.hasShownTutorialSuggestion = state.hasShownTutorialSuggestion || false;
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
   * First-time visitor welcome (3 lines + empty line + hint = 5 lines)
   * @private
   */
  _getFirstTimeWelcome() {
    return `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                ┃
┃       🛡️  HACKSIMULATOR.NL - MVP BETA          ┃
┃                                                ┃
┃   Leer ethisch hacken in een veilige terminal ┃
┃                                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Welkom! Dit is een gesimuleerde terminal waarin je veilig kunt
oefenen met hacking tools en Linux commands.

💡 TIP: Type 'help' om alle beschikbare commands te zien
💡 TIP: Type 'man <command>' voor gedetailleerde uitleg
`.trim();
  }

  /**
   * Returning visitor welcome (kort en to-the-point)
   * @private
   */
  _getReturningVisitorWelcome() {
    return `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       🛡️  HACKSIMULATOR.NL - Welkom terug!     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

💡 TIP: Type 'help' om te beginnen
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
   * @returns {string|null} Hint message or null
   */
  recordCommand() {
    this.commandCount++;

    try {
      localStorage.setItem(this.STORAGE_KEY_COMMAND_COUNT, this.commandCount.toString());
    } catch (e) {
      console.warn('Could not save command count:', e);
    }

    // Save state
    this._saveState();

    // Return progressive hints
    return this._getProgressiveHint();
  }

  /**
   * Get progressive hints based on command count
   * @private
   * @returns {string|null}
   */
  _getProgressiveHint() {
    // After 1st command: Encouragement
    if (this.commandCount === 1 && !this.hasShownEncouragement) {
      this.hasShownEncouragement = true;
      this._saveState();
      return '\n✅ Goed bezig! Je eerste command is uitgevoerd.\n💡 TIP: Probeer \'ls\' om bestanden te zien, of \'help\' voor alle commands.';
    }

    // After 5 commands: Tutorial suggestion
    if (this.commandCount === 5 && !this.hasShownTutorialSuggestion) {
      this.hasShownTutorialSuggestion = true;
      this._saveState();
      return '\n🎯 Je bent goed op weg! Je hebt al 5 commands geprobeerd.\n💡 TIP: Probeer \'nmap 192.168.1.1\' voor een port scan, of \'man nmap\' voor uitleg.';
    }

    // After 10 commands: Security tools suggestion
    if (this.commandCount === 10) {
      return '\n🔒 Klaar voor security tools? Probeer \'help security\' voor een lijst.\n⚠️  Let op: Deze tools zijn alleen voor educatief gebruik!';
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
        hasShownTutorialSuggestion: this.hasShownTutorialSuggestion
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
    } catch (e) {
      console.warn('Could not reset onboarding state:', e);
    }

    this.isFirstVisit = true;
    this.commandCount = 0;
    this.hasShownEncouragement = false;
    this.hasShownTutorialSuggestion = false;

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
      hasShownTutorialSuggestion: this.hasShownTutorialSuggestion
    };
  }
}

// Export as singleton
export default new Onboarding();
