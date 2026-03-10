/**
 * Onboarding System
 * First Time User Experience (FTUE) logic
 * Progressive hints and encouragement
 *
 * Consolidates all onboarding state into a single localStorage key:
 * `hacksim_onboarding` (previously 4 separate keys)
 */

const STORAGE_KEY = 'hacksim_onboarding';

// Legacy keys (for migration)
const LEGACY_KEYS = [
  'hacksim_first_visit',
  'hacksim_command_count',
  'hacksim_onboarding_state',
  'hacksim_commands_tried'
];

class Onboarding {
  constructor() {
    this.isFirstVisit = true;
    this.commandCount = 0;
    this.commandsTried = [];
    this.hasShownEncouragement = false;
    this.hasShownTabHint = false;
    this.hasShownTutorialSuggestion = false;
    this.hasShownCtrlRHint = false;
    this.hasShownCtrlLHint = false;
    this.hasShownNoOutputHint = false;

    // Filesystem commands that produce no output on success (Unix convention)
    this.FILESYSTEM_COMMANDS = ['cd', 'cp', 'mkdir', 'mv', 'rm', 'touch'];
  }

  /**
   * Initialize onboarding system
   * Load state from localStorage (with legacy migration)
   */
  init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        // New consolidated format
        this._loadFromData(JSON.parse(saved));
      } else {
        // Try legacy migration
        this._migrateFromLegacy();
      }
    } catch (e) {
      console.error('Failed to initialize onboarding:', e);
      this.isFirstVisit = true;
      this.commandCount = 0;
    }
  }

  /**
   * Load state from consolidated data object
   * @private
   */
  _loadFromData(data) {
    this.isFirstVisit = data.firstVisit !== false; // default true
    this.commandCount = data.commandCount || 0;
    this.commandsTried = data.commandsTried || [];
    this.hasShownEncouragement = data.hasShownEncouragement || false;
    this.hasShownTabHint = data.hasShownTabHint || false;
    this.hasShownTutorialSuggestion = data.hasShownTutorialSuggestion || false;
    this.hasShownCtrlRHint = data.hasShownCtrlRHint || false;
    this.hasShownCtrlLHint = data.hasShownCtrlLHint || false;
    this.hasShownNoOutputHint = data.hasShownNoOutputHint || false;
  }

  /**
   * Migrate from legacy 4-key format to consolidated format
   * @private
   */
  _migrateFromLegacy() {
    try {
      // Read legacy keys
      const firstVisitFlag = localStorage.getItem('hacksim_first_visit');
      const savedCount = localStorage.getItem('hacksim_command_count');
      const savedState = localStorage.getItem('hacksim_onboarding_state');
      const savedCommands = localStorage.getItem('hacksim_commands_tried');

      // If no legacy data exists either, this is truly a first visit
      if (!firstVisitFlag && !savedCount && !savedState && !savedCommands) {
        this.isFirstVisit = true;
        this.commandCount = 0;
        return;
      }

      // Migrate values
      this.isFirstVisit = firstVisitFlag === null;
      this.commandCount = savedCount ? parseInt(savedCount, 10) : 0;

      if (savedCommands) {
        this.commandsTried = savedCommands.split(',').filter(cmd => cmd.trim());
      }

      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          this.hasShownEncouragement = state.hasShownEncouragement || false;
          this.hasShownTabHint = state.hasShownTabHint || false;
          this.hasShownTutorialSuggestion = state.hasShownTutorialSuggestion || false;
          this.hasShownCtrlRHint = state.hasShownCtrlRHint || false;
          this.hasShownCtrlLHint = state.hasShownCtrlLHint || false;
          this.hasShownNoOutputHint = state.hasShownNoOutputHint || false;
        } catch (e) {
          console.warn('Failed to parse legacy onboarding state:', e);
        }
      }

      // Save in new format and remove legacy keys
      this._save();
      this._removeLegacyKeys();
    } catch (e) {
      console.warn('Legacy migration failed:', e);
    }
  }

  /**
   * Remove legacy localStorage keys after migration
   * @private
   */
  _removeLegacyKeys() {
    for (const key of LEGACY_KEYS) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Ignore
      }
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
   * Get welcome message based on visitor status
   * @param {Object|null} stats - Progress stats from progressStore
   * @returns {string}
   */
  getWelcomeMessage(stats = null) {
    if (!this.isFirstVisit) {
      return this._getReturningVisitorWelcome(stats);
    }
    return this._getFirstTimeWelcome();
  }

  /**
   * First-time visitor welcome (rendered with typewriter effect)
   * @private
   */
  _getFirstTimeWelcome() {
    return `Connecting to hacksim.lab... OK
Authorized access only. All activity is logged.

Welkom, hacker. Sessie gestart.

  Je bent ingelogd op een gesimuleerd netwerk.
  Je missie: leer ethical hacking tools — veilig en legaal.

  [!] Begin met de basics:

  → FASE 1: Terminal basics     ('ls', 'cd', 'pwd')
  → FASE 2: File manipulation   ('mkdir', 'touch', 'rm')
  → FASE 3: Network scanning    ('ping', 'nmap')
  → FASE 4: Security tools      ('hashcat', 'hydra')

  [→] Type 'help' om te beginnen
  [→] Type 'leerpad' om voortgang te volgen`;
  }

  /**
   * Returning visitor welcome (rendered instantly)
   * @private
   * @param {Object|null} stats - Progress stats from progressStore
   */
  _getReturningVisitorWelcome(stats) {
    const greeting = this._getTimeGreeting();
    const commandCount = this.commandsTried.length;

    let statsLine = '';
    if (stats && (stats.completedChallenges.length > 0 || stats.badges.length > 0 || commandCount > 0)) {
      const parts = [];
      if (commandCount > 0) parts.push(`${commandCount} commands geleerd`);
      if (stats.completedChallenges.length > 0) parts.push(`${stats.completedChallenges.length} missies voltooid`);
      if (stats.badges.length > 0) parts.push(`${stats.badges.length} badges`);
      statsLine = `\n  [✓] ${parts.join(' | ')}`;
    }

    return `Connecting to hacksim.lab... OK

${greeting}, hacker.
${statsLine}
  [→] Type 'help' voor commandolijst
  [→] Type 'tutorial recon' voor je volgende missie`;
  }

  /**
   * Get time-based greeting in Dutch
   * @private
   * @returns {string}
   */
  _getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Goedemorgen';
    if (hour < 18) return 'Goedemiddag';
    return 'Goedenavond';
  }

  /**
   * Mark that user has completed first visit
   */
  markFirstVisitComplete() {
    if (this.isFirstVisit) {
      this.isFirstVisit = false;
      this._save();
    }
  }

  /**
   * Record that a command was executed
   * Returns a hint message if appropriate
   * @param {string} commandName - Name of the command
   * @returns {string|null} Hint message or null
   */
  recordCommand(commandName = null) {
    this.commandCount++;

    // Track individual command for leerpad
    if (commandName && !this.commandsTried.includes(commandName)) {
      this.commandsTried.push(commandName);
    }

    // Get hint before saving (hint may update state)
    const hint = this._getProgressiveHint();

    // Single save for everything
    this._save();

    return hint;
  }

  /**
   * Get list of commands the user has tried
   * @returns {string[]}
   */
  getCommandsTried() {
    return this.commandsTried;
  }

  /**
   * Get progressive hints based on command count
   * @private
   * @returns {string|null}
   */
  _getProgressiveHint() {
    if (this.commandCount === 1 && !this.hasShownEncouragement) {
      this.hasShownEncouragement = true;
      return '\n[✓] Eerste opdracht voltooid!\n\nOntdek je omgeving:\n→ \'ls\'   - Bekijk bestanden in deze map\n→ \'help\' - Zie alle beschikbare hacking tools';
    }

    if (this.commandCount === 3 && !this.hasShownTabHint) {
      this.hasShownTabHint = true;
      return '\n[✓] Pro tip: Gebruik Tab om commands snel in te typen\n\nProbeer het nu:\n→ Type "nm" en druk Tab      - Vult aan naar "nmap"\n→ Type "l" en druk Tab 2x    - Cyclet door ls, ln, ...';
    }

    if (this.commandCount === 5 && !this.hasShownTutorialSuggestion) {
      this.hasShownTutorialSuggestion = true;
      return '\n[✓] 5 opdrachten voltooid - je bent onderweg!\n\nKlaar voor je eerste missie? Probeer de begeleide tutorial:\n→ \'tutorial recon\'   - Start de Reconnaissance missie\n→ \'tutorial\'         - Bekijk alle beschikbare scenario\'s';
    }

    if (this.commandCount === 7 && !this.hasShownCtrlRHint) {
      this.hasShownCtrlRHint = true;
      return '\n[✓] Pro tip: Gebruik Ctrl+R om door je geschiedenis te zoeken\n\nProbeer het nu:\n→ Druk Ctrl+R en type "ls"     - Vind vorige ls commands\n→ Druk Ctrl+R opnieuw          - Cycle door matches\n→ Enter om te accepteren       - Esc om te annuleren\n\nType \'shortcuts\' voor alle keyboard shortcuts.';
    }

    if (this.commandCount === 10) {
      return '\n[!] 10 opdrachten - tijd voor krachtigere tools\n\n[!] LET OP: De volgende tools zijn ALLEEN voor educatief gebruik.\n      In de echte wereld zijn ze illegaal zonder expliciete toestemming.\n\nKlaar? Type \'help security\' voor geavanceerde tools.';
    }

    if (this.commandCount === 12 && !this.hasShownCtrlLHint) {
      this.hasShownCtrlLHint = true;
      return '\n[✓] Is je terminal vol? Gebruik Ctrl+L om te leegmaken\n\n(Net als echte Linux terminals - geen rommelige output meer!)';
    }

    return null;
  }

  /**
   * Save all onboarding state to localStorage (single write)
   * @private
   */
  _save() {
    try {
      const data = {
        firstVisit: this.isFirstVisit,
        commandCount: this.commandCount,
        commandsTried: this.commandsTried,
        hasShownEncouragement: this.hasShownEncouragement,
        hasShownTabHint: this.hasShownTabHint,
        hasShownTutorialSuggestion: this.hasShownTutorialSuggestion,
        hasShownCtrlRHint: this.hasShownCtrlRHint,
        hasShownCtrlLHint: this.hasShownCtrlLHint,
        hasShownNoOutputHint: this.hasShownNoOutputHint
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save onboarding state:', e);
    }
  }

  /**
   * Get one-time "no news is good news" hint for filesystem commands
   * @param {string} commandName
   * @returns {string|null}
   */
  getFilesystemHint(commandName) {
    if (this.hasShownNoOutputHint) return null;
    if (!this.FILESYSTEM_COMMANDS.includes(commandName)) return null;

    this.hasShownNoOutputHint = true;
    this._save();

    return '\n[?] Wist je dat? In echte Linux tonen commands zoals cd, cp en rm geen output bij succes.\n    Dit heet "no news is good news". Deze simulator toont bevestigingen zodat je leert wat er gebeurt.';
  }

  /**
   * Get hint for persistent display
   * @returns {string|null}
   */
  getPersistentHint() {
    if (this.commandCount >= 5) {
      return null;
    }
    return 'Type "help" voor commands';
  }

  /**
   * Reset onboarding
   */
  reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Also clean up any remaining legacy keys
      this._removeLegacyKeys();
    } catch (e) {
      console.warn('Could not reset onboarding state:', e);
    }

    this.isFirstVisit = true;
    this.commandCount = 0;
    this.commandsTried = [];
    this.hasShownEncouragement = false;
    this.hasShownTabHint = false;
    this.hasShownTutorialSuggestion = false;
    this.hasShownCtrlRHint = false;
    this.hasShownCtrlLHint = false;
    this.hasShownNoOutputHint = false;
  }

  /**
   * Get onboarding statistics (for debugging)
   * @returns {Object}
   */
  getStats() {
    return {
      isFirstVisit: this.isFirstVisit,
      commandCount: this.commandCount,
      commandsTried: this.commandsTried,
      hasShownEncouragement: this.hasShownEncouragement,
      hasShownTabHint: this.hasShownTabHint,
      hasShownTutorialSuggestion: this.hasShownTutorialSuggestion,
      hasShownCtrlRHint: this.hasShownCtrlRHint,
      hasShownCtrlLHint: this.hasShownCtrlLHint,
      hasShownNoOutputHint: this.hasShownNoOutputHint
    };
  }
}

// Export as singleton
export default new Onboarding();
