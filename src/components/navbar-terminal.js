/**
 * Terminal-specific Navbar Handlers - HackSimulator.nl
 *
 * This module contains functionality that ONLY applies to terminal.html:
 * - Help menu actions (inject commands into terminal)
 * - About modal
 * - Search integration
 * - Blog navigation
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
// ABOUT MODAL
// ============================================

/**
 * Show the About modal
 * Creates the modal dynamically if it doesn't exist
 */
function showAboutModal() {
  let modal = document.getElementById('about-modal');

  // Create modal if it doesn't exist
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'about-modal';
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'about-title');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Sluiten">&times;</button>
        <div class="modal-body">
          <h2 id="about-title">Over HackSimulator.nl</h2>
          <p><strong>HackSimulator.nl</strong> is een veilige browser-based terminal simulator voor het leren van ethisch hacken en cybersecurity.</p>

          <h3 style="color: var(--color-ui-primary); margin-top: var(--spacing-lg); margin-bottom: var(--spacing-md); font-size: 1.2rem;">Doel</h3>
          <p>We bieden een toegankelijke en veilige leeromgeving voor beginners (15-25 jaar) om cybersecurity skills te ontwikkelen zonder risico op schade aan echte systemen.</p>

          <h3 style="color: var(--color-ui-primary); margin-top: var(--spacing-lg); margin-bottom: var(--spacing-md); font-size: 1.2rem;">Features</h3>
          <ul>
            <li>30+ authentieke terminal commands</li>
            <li>Realistische command output met educatieve context</li>
            <li>Virtual filesystem voor veilig experimenteren</li>
            <li>Nederlands interface voor Nederlandse markt</li>
            <li>100% browser-based - geen installatie nodig</li>
          </ul>

          <h3 style="color: var(--color-ui-primary); margin-top: var(--spacing-lg); margin-bottom: var(--spacing-md); font-size: 1.2rem;">Open Source</h3>
          <p>Dit project is open source en beschikbaar op <a href="https://github.com/JanWillemWubkes/hacksimulator" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>

          <p style="margin-top: var(--spacing-lg);"><strong>[ ! ] Belangrijk:</strong> Deze simulator is uitsluitend voor educatieve doeleinden. Gebruik deze kennis alleen legaal en ethisch.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary">Sluiten</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Set up close handlers
    const closeBtn = modal.querySelector('.modal-close');
    const closeSecondaryBtn = modal.querySelector('.btn-secondary');

    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeSecondaryBtn) closeSecondaryBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Show the modal
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

/**
 * Initialize About modal trigger
 */
function initAboutModal() {
  const aboutLink = document.querySelector('a[href="#over"]');
  if (aboutLink) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenus();
      showAboutModal();
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
// BLOG NAVIGATION
// ============================================

/**
 * Initialize blog link navigation
 */
function initBlogNavigation() {
  const blogLink = document.querySelector('a[href="#blog"]');
  if (blogLink) {
    blogLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenus();
      window.location.href = '/blog/index.html';
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
  initAboutModal();
  initSearchIntegration();
  initBlogNavigation();
}

// Export individual functions for testing/flexibility
export {
  initHelpMenuActions,
  initAboutModal,
  initSearchIntegration,
  initBlogNavigation,
  executeTerminalCommand,
  closeMenus
};
