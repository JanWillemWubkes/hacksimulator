/**
 * Terminal Engine
 * Core terminal system that coordinates all components
 * Manages command execution flow
 */

import parser from './parser.js';
import registry from './registry.js';
import history from './history.js';
import renderer from '../ui/renderer.js';
import input from '../ui/input.js';
import vfs from '../filesystem/vfs.js';
import persistence from '../filesystem/persistence.js';
import helpSystem from '../help/help-system.js';
import fuzzy from '../utils/fuzzy.js';
import onboarding from '../ui/onboarding.js';
import analyticsEvents from '../analytics/events.js';
import tutorialManager from '../tutorial/tutorial-manager.js';
import tutorialRenderer from '../tutorial/tutorial-renderer.js';
import fundamentalsScenario from '../tutorial/scenarios/fundamentals.js';
import reconScenario from '../tutorial/scenarios/recon.js';
import webvulnScenario from '../tutorial/scenarios/webvuln.js';
import privescScenario from '../tutorial/scenarios/privesc.js';
import exploitationScenario from '../tutorial/scenarios/exploitation.js';
import challengeManager from '../gamification/challenge-manager.js';
import challengeRenderer from '../gamification/challenge-renderer.js';
import progressStore from '../gamification/progress-store.js';
import badgeManager from '../gamification/badge-manager.js';
import easyChallenges from '../gamification/challenges/easy.js';
import mediumChallenges from '../gamification/challenges/medium.js';
import hardChallenges from '../gamification/challenges/hard.js';

class Terminal {
  constructor() {
    this.isInitialized = false;
    this.isExecuting = false;
    this.searchPromptElement = null; // DOM element for search prompt
    this.context = {
      terminal: this,
      vfs: vfs,
      historyManager: history,
      onboarding: onboarding,
      tutorialManager: tutorialManager,
      cwd: '~',
      user: 'hacker',
      hostname: 'hacksim'
    };
  }

  /**
   * Initialize the terminal
   * @param {Object} options - Initialization options
   * @param {HTMLElement} options.outputElement - Terminal output container
   * @param {HTMLInputElement} options.inputElement - Terminal input field
   */
  init(options) {
    if (this.isInitialized) {
      console.warn('Terminal already initialized');
      return;
    }

    const { outputElement, inputElement } = options;

    if (!outputElement || !inputElement) {
      throw new Error('Output and input elements are required');
    }

    // Initialize renderer
    renderer.init(outputElement);

    // Set initial prompt with VFS current directory
    renderer.updatePrompt(vfs.getCwd());

    // Initialize input handler (pass terminal instance for keyboard shortcuts)
    input.init(inputElement, (command) => this.execute(command), this);

    // Create and setup search prompt element
    this._setupSearchPrompt(inputElement);

    // Initialize onboarding system
    onboarding.init();

    // Initialize tutorial system
    tutorialManager.setRenderer(tutorialRenderer);
    tutorialManager.register(fundamentalsScenario);
    tutorialManager.register(reconScenario);
    tutorialManager.register(webvulnScenario);
    tutorialManager.register(privescScenario);
    tutorialManager.register(exploitationScenario);
    tutorialManager.resume();

    // Deep-link: valideer de rauwe ?tutorial=-id nu de scenario's geregistreerd zijn.
    // Ongeldig/afwezig → null (stille no-op). De welcome-render hieronder leest dit
    // zodat een pending missie-start de "Typ 'next'"-CTA niet laat concurreren.
    this._deepLinkId = (options.deepLinkId && tutorialManager.getScenario(options.deepLinkId))
      ? options.deepLinkId
      : null;

    // Initialize challenge system
    challengeManager.setRenderer(challengeRenderer);
    easyChallenges.forEach(function(challenge) {
      challengeManager.register(challenge);
    });
    mediumChallenges.forEach(function(challenge) {
      challengeManager.register(challenge);
    });
    hardChallenges.forEach(function(challenge) {
      challengeManager.register(challenge);
    });
    challengeManager.resume();

    // Update streak on session start
    progressStore.updateStreak();

    // Initialize badge system
    badgeManager.init();

    // Render welcome sequence (deferred if legal modal is shown first)
    if (!options.deferWelcome) {
      this._renderWelcomeSequence();
    }

    // Body-class direct in sync brengen (bv. resumed tutorial op boot).
    this._updateMissionClass();

    this.isInitialized = true;
  }

  /**
   * Public method to trigger the welcome sequence (used after legal modal)
   */
  renderWelcome() {
    this._renderWelcomeSequence();
  }

  /**
   * Geldig deep-link-scenario-id dat bij boot uit ?tutorial= is gehaald (of null).
   * main.js gebruikt dit voor URL-opschoning + het plannen van de auto-start.
   * @returns {string|null}
   */
  getPendingDeepLink() {
    return this._deepLinkId || null;
  }

  /**
   * Sync body.mission-active met de tutorial/challenge-staat (CSS-gedreven UI,
   * o.a. het verbergen van ls/nmap-snelknoppen op mobiel tijdens een missie).
   * @private
   */
  _updateMissionClass() {
    try {
      var active = tutorialManager.isActive() || challengeManager.isActive();
      document.body.classList.toggle('mission-active', active);
    } catch (e) { /* body nog niet klaar — genegeerd */ }
  }

  /**
   * Render welcome message, tutorial resume, and session badge notifications
   * @private
   */
  _renderWelcomeSequence() {
    var sessionBadges = badgeManager.checkUnlocks('session');
    const stats = progressStore.getStats();

    // Coördineer welcome-CTA met de missie-staat zodat er nooit twee "wat nu?"-
    // instructies concurreren (deep-link-briefing, hervatte stap óf hervatte
    // challenge vs. "Typ 'next'"). challengeManager.resume() draait in init()
    // vóór deze render, dus isActive() is hier betrouwbaar.
    const status = tutorialManager.isActive() ? tutorialManager.getStatus() : null;
    const challengeActive = challengeManager.isActive();
    const deepLinkSwitches = !!(this._deepLinkId && (!status || status.scenarioId !== this._deepLinkId));
    const ctaMode = deepLinkSwitches ? 'deeplink' : ((status || challengeActive) ? 'suppress' : 'default');

    // Disable input during typewriter effect (first visit only)
    if (onboarding.isFirstTimeVisitor()) {
      input.disable();
      document.addEventListener('typewriter-done', () => {
        input.enable();
      }, { once: true });
    }

    renderer.renderWelcome(onboarding, stats, ctaMode);

    // Bij een actieve missie (tutorial of challenge) op boot past de neutrale
    // placeholder beter dan "Typ 'next'".
    if (status || challengeActive) {
      var termInput = document.getElementById('terminal-input');
      if (termInput) termInput.placeholder = 'Typ een command...';
    }

    // Eenmalige melding wanneer een stale save (oudere structure.js-versie) bij
    // load is verworpen — anders lijken verdwenen eigen bestanden een bug.
    if (persistence.consumeResetNotice()) {
      setTimeout(() => renderer.renderInfo(
        '[~] De oefenomgeving is bijgewerkt — je bestandssysteem is vernieuwd naar de nieuwste versie.'
      ), 100);
    }

    // Show tutorial resume message if applicable — maar niet als een deep-link zo meteen
    // naar een ándere missie wisselt (dan zou de stale hervat-tekst boven de nieuwe briefing blijven staan).
    const resumeMsg = deepLinkSwitches ? null : tutorialManager.getResumeMessage();
    if (resumeMsg) {
      setTimeout(() => renderer.renderInfo(resumeMsg), 100);
    } else {
      // Anders: toon een eventuele challenge-hervat-melding (tutorial/challenge sluiten
      // elkaar uit, dus hooguit één van beide is actief).
      const challengeResume = challengeManager.getResumeMessage();
      if (challengeResume) {
        setTimeout(() => renderer.renderInfo(challengeResume), 100);
      }
    }

    // Defer session badge notifications to after welcome message
    if (sessionBadges.length > 0) {
      setTimeout(() => {
        sessionBadges.forEach(function(badge) {
          renderer.renderInfo(badgeManager.renderNotification(badge));
        });
      }, 200);
    }
  }

  /**
   * Setup search prompt element
   * @private
   */
  _setupSearchPrompt(inputElement) {
    // Create search prompt element
    this.searchPromptElement = document.createElement('div');
    this.searchPromptElement.id = 'search-prompt';
    this.searchPromptElement.className = 'search-prompt';
    this.searchPromptElement.style.display = 'none'; // Hidden by default

    // Insert before input element (within the input wrapper)
    const wrapper = inputElement.parentElement;
    wrapper.insertBefore(this.searchPromptElement, inputElement);

    // Register search prompt callback
    input.setSearchPromptCallback((promptText) => {
      this._updateSearchPrompt(promptText);
    });
  }

  /**
   * Update search prompt display
   * @private
   */
  _updateSearchPrompt(promptText) {
    if (!this.searchPromptElement) {
      return;
    }

    if (promptText === null) {
      // Hide search prompt
      this.searchPromptElement.style.display = 'none';
      this.searchPromptElement.textContent = '';
    } else {
      // Show search prompt with text
      this.searchPromptElement.style.display = 'block';
      this.searchPromptElement.textContent = promptText;
    }
  }

  /**
   * Execute a command
   * @param {string} commandString - Raw command string
   */
  async execute(commandString) {
    // Don't execute if already executing
    if (this.isExecuting) {
      return;
    }

    // Echo the command
    renderer.renderInput(commandString);

    // Parse command
    const parsed = parser.parse(commandString);

    // Empty command - just show new prompt
    if (!parsed.command) {
      return;
    }

    // Add to history
    history.add(commandString);

    // Validate command name
    if (!parser.isValidCommand(parsed.command)) {
      renderer.renderError(`Invalid command: ${parsed.command}`);
      return;
    }

    // Check if command exists
    if (!registry.has(parsed.command)) {
      // Record error for progressive hints
      helpSystem.recordError(parsed.command);

      // Find similar command using fuzzy matching
      const similar = fuzzy.findClosestCommand(parsed.command, registry.list());

      // Get progressive help message (3-tier system)
      const helpMsg = helpSystem.getHelp(parsed.command, similar);

      // Render error and tip separately for correct color rendering
      renderer.renderError(`Command not found: ${parsed.command}`);
      renderer.renderInfo(helpMsg);  // Tip as INFO (cyaan) instead of ERROR (rood)

      // Track command not found error
      analyticsEvents.errorOccurred('command_not_found', parsed.command);

      return;
    }

    // Execute command
    try {
      this.isExecuting = true;
      input.disable();

      const output = await registry.execute(
        parsed.command,
        parsed.args,
        parsed.flags,
        this.context
      );

      // Tutorial-aware rendering: validate BEFORE rendering so rejection appears first
      let tutorialFeedback = null;
      let tutorialWasCorrect = false;
      const isTutorialRelevant = tutorialManager.isActive() &&
          !['tutorial', 'challenge', 'help', 'man', 'clear', 'history', 'leerpad', 'shortcuts', 'next', 'hint', 'reset'].includes(parsed.command);
      // Capture BEFORE handleCommand() runs: completing the final step flips the
      // tutorial to IDLE in this same tick, so a post-mutation isActive() check
      // would go stale and leak a duplicate onboarding "Typ 'next'" hint.
      const tutorialActiveAtStart = tutorialManager.isActive();

      if (isTutorialRelevant) {
        const stepBefore = tutorialManager.currentStep;
        const stateBefore = tutorialManager.getState();
        tutorialFeedback = tutorialManager.handleCommand(parsed.command, parsed.args, parsed.flags, this.context, output);
        tutorialWasCorrect = (tutorialManager.currentStep !== stepBefore
            || tutorialManager.getState() !== stateBefore);
      }

      // Strip [TIP] lines during tutorials (hint system handles guidance)
      const displayOutput = isTutorialRelevant ? this._stripTips(output) : output;

      // Universal order: command output first, then tutorial feedback
      // (applies to both correct and wrong commands)
      if (displayOutput) {
        if (typeof displayOutput === 'object' && displayOutput.isCompletion) {
          renderer.renderCompletionBlock(displayOutput.output, displayOutput.title, displayOutput.completion);
        } else {
          renderer.renderOutput(displayOutput);
        }
      }
      if (tutorialFeedback) {
        if (typeof tutorialFeedback === 'object' && tutorialFeedback.isCompletion) {
          renderer.renderCompletionBlock(tutorialFeedback.output, tutorialFeedback.title, tutorialFeedback.completion);
        } else {
          renderer.renderInfo(tutorialFeedback);
        }
      }

      // Validate and record command execution for learning path tracking
      onboarding.markFirstVisitComplete();

      // Hide scroll hint after first command (user is engaged)
      var scrollHint = document.querySelector('.scroll-hint');
      if (scrollHint) scrollHint.classList.add('hidden');

      // Update placeholder after first command (stop nudging 'next').
      // Ook direct flippen zodra een tutorial/challenge actief is: de auto-gestarte
      // 'tutorial <id>' draait vóór recordCommand, dus commandCount is dan nog 0.
      if (tutorialActiveAtStart || challengeManager.isActive() || onboarding.commandCount >= 1) {
        var termInput = document.getElementById('terminal-input');
        if (termInput) termInput.placeholder = 'Typ een command...';
      }

      // Only track command if it was used correctly (validation logic)
      let onboardingHint = null;
      if (this._shouldTrackCommand(parsed.command, parsed.args, output)) {
        // Tijdens een missie: wél leerpad-vinkjes, geen nudges — deferHints laat
        // de count-drempels en one-time-flags (Tab-/Ctrl+R-tip) ongemoeid zodat
        // die tips ná de missie alsnog vuren. Pre-mutation tutorial-state, zodat
        // een net-voltooide tutorial (nu IDLE) z'n slot-command ook onderdrukt.
        const deferHints = tutorialActiveAtStart || challengeManager.isActive();
        onboardingHint = onboarding.recordCommand(parsed.command, { deferHints });
        if (onboardingHint) {
          renderer.renderInfo(onboardingHint);
        }
      }

      // Show "no news is good news" filesystem hint (one-time).
      // Onderdruk tijdens een actieve tutorial/challenge: de one-time-flag blijft dan
      // ongeconsumeerd, dus de hint vuurt alsnog bij het eerste gebruik búiten een missie.
      if (!tutorialActiveAtStart && !challengeManager.isActive()) {
        const filesystemHint = onboarding.getFilesystemHint(parsed.command);
        if (filesystemHint) {
          renderer.renderInfo(filesystemHint);
        }
      }

      // Beginner follow-up tip (only outside tutorials/challenges)
      // Skip if recordCommand already showed a hint (prevents duplicate "Typ 'next'" messages)
      if (!onboardingHint && !tutorialActiveAtStart && !challengeManager.isActive()) {
        const followUp = onboarding.getFollowUpTip(parsed.command);
        if (followUp) renderer.renderInfo(followUp);
      }

      // One-time simulator command hint — niet mid-missie (zou als losse educatieve
      // regel direct onder de briefing/stap-instructie landen). Flag blijft bewaard.
      if (!tutorialActiveAtStart && !challengeManager.isActive()) {
        const simulatorHint = onboarding.getSimulatorCommandHint(parsed.command);
        if (simulatorHint) renderer.renderInfo(simulatorHint);
      }

      // Tutorial system: handled above (pre-validation for correct output order)

      // Challenge system: check command against active challenge
      if (challengeManager.isActive() &&
          !['challenge', 'tutorial', 'next', 'help', 'man', 'clear', 'history', 'shortcuts'].includes(parsed.command)) {
        const challengeFeedback = challengeManager.handleCommand(parsed.command, parsed.args, parsed.flags, this.context);
        if (challengeFeedback) {
          if (typeof challengeFeedback === 'object' && challengeFeedback.isCompletion) {
            renderer.renderCompletionBlock(challengeFeedback.output, challengeFeedback.title, challengeFeedback.completion);
          } else {
            renderer.renderInfo(challengeFeedback);
          }
        }
      }

      // Houd de body-class in sync met de missie-staat (mobiele snelknoppen ls/nmap
      // worden dan via CSS verborgen tijdens een tutorial/challenge).
      this._updateMissionClass();

      // Track command execution (analytics - NO ARGUMENTS!)
      analyticsEvents.commandExecuted(parsed.command, true);

      // Activation: de eerste succesvolle command in deze sessie (once-per-tab-sessie
      // via sessionStorage zodat een reload het niet opnieuw telt). Drijft de
      // launch-activation-rate (reikte terminal → deed iets).
      try {
        if (!sessionStorage.getItem('hacksim_activated')) {
          sessionStorage.setItem('hacksim_activated', '1');
          analyticsEvents.terminalActivated(parsed.command);
        }
      } catch (e) { /* private mode: activation niet-persistent, geen breuk */ }

      // Check for command-triggered badges
      var newBadges = badgeManager.checkUnlocks('command');
      newBadges.forEach(function(badge) {
        renderer.renderInfo(badgeManager.renderNotification(badge));
      });

    } catch (error) {
      console.error('Command execution error:', error);
      renderer.renderError(`Error executing command: ${error.message}`);

      // Track error
      analyticsEvents.errorOccurred('execution_error', parsed.command);
    } finally {
      this.isExecuting = false;
      input.enable();
    }
  }

  /**
   * Get help system instance
   * @returns {Object} Help system
   */
  getHelpSystem() {
    return helpSystem;
  }

  /**
   * Clear terminal output
   */
  clear() {
    renderer.clear();

    // Na clear: heroriënteer i.p.v. de gebruiker met een leeg scherm achterlaten.
    if (tutorialManager.isActive()) {
      const objective = tutorialManager.renderCurrentStep();
      if (objective) renderer.renderInfo(objective);
    } else if (challengeManager.isActive()) {
      renderer.renderInfo("[~] Challenge actief — typ 'challenge status' voor je voortgang.");
    } else {
      // Subtiele hint voor beginners na clear (alleen buiten een missie)
      const hint = onboarding.getPostClearHint();
      if (hint) {
        renderer.renderOutput(hint, 'info');
      }
    }
  }

  /**
   * Update current working directory
   * @param {string} newCwd - New working directory
   */
  setCwd(newCwd) {
    this.context.cwd = newCwd;
    renderer.updatePrompt(newCwd);
  }

  /**
   * Get current working directory
   * @returns {string}
   */
  getCwd() {
    return this.context.cwd;
  }

  /**
   * Get terminal context (for commands)
   * @returns {Object}
   */
  getContext() {
    return this.context;
  }

  /**
   * Get command registry (for dynamic registration)
   * @returns {Object}
   */
  getRegistry() {
    return registry;
  }

  /**
   * Get command history (for history command)
   * @returns {Object}
   */
  getHistory() {
    return history;
  }

  /**
   * Get renderer (for direct rendering)
   * @returns {Object}
   */
  getRenderer() {
    return renderer;
  }

  /**
   * Get output element (for keyboard scroll shortcuts)
   * @returns {HTMLElement|null}
   */
  getOutputElement() {
    return renderer.outputElement;
  }

  /**
   * Strip [TIP] lines from command output during active tutorials.
   * The tutorial hint system handles guidance, so command-level TIPs are redundant.
   * @private
   * @param {string} output - Command output
   * @returns {string} Output without TIP lines
   */
  _stripTips(output) {
    if (!output) return output;
    // Tijdens een tutorial handelt het hint-systeem de begeleiding af; losse
    // tip-regels zouden de stap-instructie overschreeuwen. [TIP] is canoniek;
    // de '[?] TIP:'-match blijft als vangnet tegen regressies naar de oude vorm.
    return output.split('\n')
        .filter(function(line) {
          var t = line.trim();
          return !t.startsWith('[?] TIP:') && !t.startsWith('[TIP]');
        })
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\n+$/, '');
  }

  /**
   * Validate if command should be tracked for leerpad progress
   * Only tracks commands that are used correctly (with required arguments)
   * @private
   * @param {string} commandName - Command name
   * @param {Array<string>} args - Command arguments
   * @param {string} output - Command output
   * @returns {boolean} True if command should be tracked
   */
  _shouldTrackCommand(commandName, args, output) {
    // Commands that work without any arguments
    const NO_ARGS_NEEDED = [
      'help', 'ls', 'cd', 'pwd', 'whoami', 'history',
      'ifconfig', 'netstat', 'date', 'leerpad', 'shortcuts', 'tutorial',
      'challenge', 'achievements'
    ];

    // Commands that require at least 1 argument
    const REQUIRES_ARGS = {
      'ping': 1,      // ping <host>
      'nmap': 1,      // nmap <target>
      'cat': 1,       // cat <file>
      'mkdir': 1,     // mkdir <directory>
      'touch': 1,     // touch <file>
      'rm': 1,        // rm <file>
      'cp': 2,        // cp <source> <destination>
      'mv': 2,        // mv <source> <destination>
      'hashcat': 1,   // hashcat <hash>
      'hydra': 1,     // hydra <target>
      'sqlmap': 1,    // sqlmap <url>
      'metasploit': 1,// metasploit <target>
      'nikto': 1      // nikto <target>
    };

    // Always track if no args needed
    if (NO_ARGS_NEEDED.includes(commandName)) {
      return true;
    }

    // Output error markers — a command that failed should not count as tried
    const hasError =
      output && (
        output.includes('Usage:') ||
        output.startsWith('Error:') ||
        output.includes('Name or service not known') ||
        output.includes('Failed to resolve') ||
        output.includes('No whois data found') ||
        output.includes('No such file or directory') ||
        output.includes('cannot stat') ||
        output.includes('Not a directory') ||
        output.includes('invalid URL format') ||
        output.includes('missing host operand') ||
        output.includes('missing target operand') ||
        output.includes('missing URL argument') ||
        output.includes('missing destination operand') ||
        output.includes('missing domain operand')
      );

    // If command requires args, validate
    if (REQUIRES_ARGS[commandName]) {
      const requiredArgs = REQUIRES_ARGS[commandName];

      // Not enough args provided - don't track
      if (args.length < requiredArgs) {
        return false;
      }

      // Track only if command executed successfully
      return !hasError;
    }

    // Unknown command - conservative: track if has args and no error output
    return args.length > 0 && !hasError;
  }
}

// Export as singleton
export default new Terminal();
