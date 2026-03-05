/**
 * Terminal-specific Navbar Handlers - HackSimulator.nl
 *
 * This module contains functionality that ONLY applies to terminal.html:
 * - Help menu actions (inject commands into terminal)
 * - Search integration
 *
 * Universal navbar functionality (theme toggle, hamburger, dropdown toggle)
 * is handled by navbar.js
 *
 * @module components/navbar-terminal
 */

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Close mobile menu and dropdown
 * Used before executing actions to clean up UI state
 */
function closeMenus() {
  // Close mobile menu
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.getElementById('navbar-menu');
  if (toggle && menu) {
    toggle.classList.remove('active');
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menu openen');
  }

  // Remove body scroll lock (consistent with navbar.js closeMenu())
  document.body.classList.remove('mobile-menu-open');

  // Close dropdown
  const dropdown = document.querySelector('.navbar-dropdown');
  if (dropdown) {
    dropdown.classList.remove('active');
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (dropdownMenu) dropdownMenu.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Inject command into terminal input and execute it
 * @param {string} command - The command to execute
 */
function executeTerminalCommand(command) {
  const input = document.getElementById('terminal-input');
  if (!input) {
    console.warn('[navbar-terminal] Terminal input not found');
    return;
  }

  input.value = command;
  input.focus({ preventScroll: true });

  // Dispatch Enter keydown event to execute command
  const enterEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    bubbles: true
  });
  input.dispatchEvent(enterEvent);
}

// ============================================
// HELP MENU ACTIONS
// ============================================

/**
 * Initialize Help menu dropdown actions
 * These inject commands into the terminal when clicked
 */
function initHelpMenuActions() {
  // Leerpad link -> execute 'leerpad' command
  const leerpadLink = document.querySelector('a[href="#leerpad"]');
  if (leerpadLink) {
    leerpadLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenus();
      executeTerminalCommand('leerpad');
    });
  }

  // Commands link -> execute 'help' command
  const commandsLink = document.querySelector('a[href="#commands"]');
  if (commandsLink) {
    commandsLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenus();
      executeTerminalCommand('help');
    });
  }

  // Shortcuts link -> execute 'shortcuts' command
  const shortcutsLink = document.querySelector('a[href="#shortcuts"]');
  if (shortcutsLink) {
    shortcutsLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenus();
      executeTerminalCommand('shortcuts');
    });
  }
}

// ============================================
// SEARCH INTEGRATION
// ============================================

/**
 * Initialize search icon click handler
 * Opens the command search modal
 */
function initSearchIntegration() {
  const searchLink = document.querySelector('a[href="#search"]');
  if (searchLink) {
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenus();

      // Open command search modal if available
      if (window.commandSearchModal) {
        window.commandSearchModal.open();
      } else {
        // Fallback: focus terminal and show help
        const input = document.getElementById('terminal-input');
        if (input) {
          input.focus({ preventScroll: true });
          input.value = 'help';
        }
      }
    });
  }
}

// ============================================
// MAIN EXPORT
// ============================================

/**
 * Initialize all terminal-specific navbar handlers
 * Call this after the navbar HTML is in the DOM
 */
export function initTerminalNavbar() {
  initHelpMenuActions();
  initSearchIntegration();
}

// Export individual functions for testing/flexibility
export {
  initHelpMenuActions,
  initSearchIntegration,
  executeTerminalCommand,
  closeMenus
};
