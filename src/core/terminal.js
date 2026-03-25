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
import helpSystem from '../help/help-system.js';
import fuzzy from '../utils/fuzzy.js';
import onboarding from '../ui/onboarding.js';
import analyticsEvents from '../analytics/events.js';
import tutorialManager from '../tutorial/tutorial-manager.js';
import tutorialRenderer from '../tutorial/tutorial-renderer.js';
import reconScenario from '../tutorial/scenarios/recon.js';
import webvulnScenario from '../tutorial/scenarios/webvuln.js';
import privescScenario from '../tutorial/scenarios/privesc.js';
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
    tutorialManager.register(reconScenario);
    tutorialManager.register(webvulnScenario);
    tutorialManager.register(privescScenario);
    tutorialManager.resume();

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

    // Update streak on session start
    progressStore.updateStreak();

    // Initialize badge system
    badgeManager.init();

    // Render welcome sequence (deferred if legal modal is shown first)
    if (!options.deferWelcome) {
      this._renderWelcomeSequence();
    }

    this.isInitialized = true;
  }

  /**
   * Public method to trigger the welcome sequence (used after legal modal)
   */
  renderWelcome() {
    this._renderWelcomeSequence();
  }

  /**
   * Render welcome message, tutorial resume, and session badge notifications
   * @private
   */
  _renderWelcomeSequence() {
    var sessionBadges = badgeManager.checkUnlocks('session');
    const stats = progressStore.getStats();

    // Disable input during typewriter effect (first visit only)
    if (onboarding.isFirstTimeVisitor()) {
      input.disable();
      document.addEventListener('typewriter-done', () => {
        input.enable();
      }, { once: true });
    }

    renderer.renderWelcome(onboarding, stats);

    // Show tutorial resume message if applicable
    const resumeMsg = tutorialManager.getResumeMessage();
    if (resumeMsg) {
      setTimeout(() => renderer.renderInfo(resumeMsg), 100);
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
          !['tutorial', 'help', 'man', 'clear', 'history', 'leerpad', 'shortcuts', 'next', 'hint', 'reset'].includes(parsed.command);

      if (isTutorialRelevant) {
        const stepBefore = tutorialManager.currentStep;
        const stateBefore = tutorialManager.getState();
        tutorialFeedback = tutorialManager.handleCommand(parsed.command, parsed.args, parsed.flags, this.context, output);
        tutorialWasCorrect = (tutorialManager.currentStep !== stepBefore
            || tutorialManager.getState() !== stateBefore);
      }

      // Strip [?] TIP: lines during tutorials (hint system handles guidance)
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

      // Update placeholder after first command (stop nudging 'next')
      if (onboarding.commandCount >= 1) {
        var termInput = document.getElementById('terminal-input');
        if (termInput) termInput.placeholder = 'Typ een command...';
      }

      // Only track command if it was used correctly (validation logic)
      let onboardingHint = null;
      if (this._shouldTrackCommand(parsed.command, parsed.args, output)) {
        onboardingHint = onboarding.recordCommand(parsed.command);
        // Suppress "Type 'next'" hints during active tutorials/challenges
        if (onboardingHint && (tutorialManager.isActive() || challengeManager.isActive())) {
          onboardingHint = null;
        }
        if (onboardingHint) {
          renderer.renderInfo(onboardingHint);
        }
      }

      // Show "no news is good news" filesystem hint (one-time)
      const filesystemHint = onboarding.getFilesystemHint(parsed.command);
      if (filesystemHint) {
        renderer.renderInfo(filesystemHint);
      }

      // Beginner follow-up tip (only outside tutorials/challenges)
      // Skip if recordCommand already showed a hint (prevents duplicate "Type 'next'" messages)
      if (!onboardingHint && !tutorialManager.isActive() && !challengeManager.isActive()) {
        const followUp = onboarding.getFollowUpTip(parsed.command);
        if (followUp) renderer.renderInfo(followUp);
      }

      // One-time simulator command hint
      const simulatorHint = onboarding.getSimulatorCommandHint(parsed.command);
      if (simulatorHint) renderer.renderInfo(simulatorHint);

      // Tutorial system: handled above (pre-validation for correct output order)

      // Challenge system: check command against active challenge
      if (challengeManager.isActive() &&
          !['challenge', 'help', 'man', 'clear', 'history', 'shortcuts'].includes(parsed.command)) {
        const challengeFeedback = challengeManager.handleCommand(parsed.command, parsed.args, parsed.flags, this.context);
        if (challengeFeedback) {
          if (typeof challengeFeedback === 'object' && challengeFeedback.isCompletion) {
            renderer.renderCompletionBlock(challengeFeedback.output, challengeFeedback.title, challengeFeedback.completion);
          } else {
            renderer.renderInfo(challengeFeedback);
          }
        }
      }

      // Track command execution (analytics - NO ARGUMENTS!)
      analyticsEvents.commandExecuted(parsed.command, true);

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

    // Subtiele hint voor beginners na clear (niet tijdens tutorial/challenge)
    if (!tutorialManager.isActive() && !challengeManager.isActive()) {
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
   * Strip [?] TIP: lines from command output during active tutorials.
   * The tutorial hint system handles guidance, so command-level TIPs are redundant.
   * @private
   * @param {string} output - Command output
   * @returns {string} Output without TIP lines
   */
  _stripTips(output) {
    if (!output) return output;
    return output.split('\n')
        .filter(function(line) { return !line.trim().startsWith('[?] TIP:'); })
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

    // If command requires args, validate
    if (REQUIRES_ARGS[commandName]) {
      const requiredArgs = REQUIRES_ARGS[commandName];

      // Not enough args provided - don't track
      if (args.length < requiredArgs) {
        return false;
      }

      // Args provided - check if output indicates an error
      const hasError =
        output && (
          output.includes('Usage:') ||
          output.startsWith('Error:') ||
          output.includes('Name or service not known') ||
          output.includes('No whois data found') ||
          output.includes('No such file or directory') ||
          output.includes('invalid URL format') ||
          output.includes('missing host operand') ||
          output.includes('missing target operand') ||
          output.includes('missing URL argument') ||
          output.includes('missing destination operand') ||
          output.includes('missing domain operand')
        );

      // Track only if command executed successfully
      return !hasError;
    }

    // Unknown command - conservative: track if has args
    return args.length > 0;
  }
}

// Export as singleton
export default new Terminal();
