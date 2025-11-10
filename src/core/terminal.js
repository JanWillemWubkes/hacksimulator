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

    // Render welcome message (personalized via onboarding)
    renderer.renderWelcome(onboarding);

    this.isInitialized = true;
    console.log('Terminal initialized', {
      firstVisit: onboarding.isFirstTimeVisitor()
    });
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

      // Render output
      if (output) {
        renderer.renderOutput(output);
      }

      // Validate and record command execution for learning path tracking
      onboarding.markFirstVisitComplete();

      // Only track command if it was used correctly (validation logic)
      if (this._shouldTrackCommand(parsed.command, parsed.args, output)) {
        const hint = onboarding.recordCommand(parsed.command);
        if (hint) {
          renderer.renderInfo(hint);
        }
      }

      // Track command execution (analytics - NO ARGUMENTS!)
      analyticsEvents.commandExecuted(parsed.command, true);

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
      'help', 'ls', 'pwd', 'whoami', 'history',
      'ifconfig', 'netstat', 'date', 'leerpad', 'shortcuts', 'clear'
    ];

    // Commands that require at least 1 argument
    const REQUIRES_ARGS = {
      'ping': 1,      // ping <host>
      'nmap': 1,      // nmap <target>
      'cat': 1,       // cat <file>
      'cd': 1,        // cd <directory>
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

      // Args provided - check if output indicates syntax error
      const hasSyntaxError =
        output && (
          output.includes('Usage:') ||
          output.startsWith('Error:')
        );

      // Track if no syntax error (even if command failed for other reasons)
      return !hasSyntaxError;
    }

    // Unknown command - conservative: track if has args
    return args.length > 0;
  }
}

// Export as singleton
export default new Terminal();
