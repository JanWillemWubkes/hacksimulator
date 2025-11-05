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

    // Initialize input handler
    input.init(inputElement, (command) => this.execute(command));

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

      // Record command execution for onboarding hints
      onboarding.markFirstVisitComplete();
      const hint = onboarding.recordCommand();
      if (hint) {
        renderer.renderInfo(hint);
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
}

// Export as singleton
export default new Terminal();
