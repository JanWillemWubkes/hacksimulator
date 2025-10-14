/**
 * HackSimulator.nl - Main Entry Point
 * Browser-based terminal simulator for ethical hacking education
 */

import terminal from './core/terminal.js';

// Import system commands
import clearCmd from './commands/system/clear.js';
import echoCmd from './commands/system/echo.js';
import whoamiCmd from './commands/system/whoami.js';
import dateCmd from './commands/system/date.js';
import historyCmd from './commands/system/history.js';
import helpCmd from './commands/system/help.js';
import manCmd from './commands/system/man.js';

/**
 * Register all commands
 */
function registerCommands() {
  const registry = terminal.getRegistry();

  // System commands
  registry.register('clear', clearCmd);
  registry.register('echo', echoCmd);
  registry.register('whoami', whoamiCmd);
  registry.register('date', dateCmd);
  registry.register('history', historyCmd);
  registry.register('help', helpCmd);
  registry.register('man', manCmd);

  console.log('Commands registered:', registry.list());
}

/**
 * Initialize the application
 */
function init() {
  console.log('Initializing HackSimulator.nl...');

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

/**
 * Initialize terminal and commands
 */
function initialize() {
  try {
    // Get DOM elements
    const outputElement = document.getElementById('terminal-output');
    const inputElement = document.getElementById('terminal-input');

    if (!outputElement || !inputElement) {
      throw new Error('Terminal elements not found in DOM');
    }

    // Register all commands
    registerCommands();

    // Initialize terminal
    terminal.init({
      outputElement,
      inputElement
    });

    console.log('HackSimulator.nl initialized successfully');
    console.log('Type "help" to get started');

  } catch (error) {
    console.error('Failed to initialize HackSimulator:', error);
    alert('Failed to initialize terminal. Please refresh the page.');
  }
}

// Start the application
init();

// Export for debugging (browser console access)
window.HackSimulator = {
  terminal,
  version: '0.1.0-mvp',
  debug: {
    getRegistry: () => terminal.getRegistry(),
    getHistory: () => terminal.getHistory(),
    clear: () => terminal.clear()
  }
};
