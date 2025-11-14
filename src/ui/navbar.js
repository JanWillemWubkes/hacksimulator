/**
 * navbar.js - HackSimulator.nl
 * Navigation bar functionality (mobile hamburger menu, dropdown menus, theme toggle)
 */

/**
 * Initialize navbar functionality
 * - Hamburger menu toggle (mobile)
 * - Dropdown menu toggle (Help dropdown)
 * - Theme toggle with localStorage persistence
 * - Click outside to close menu/dropdowns
 * - Update ARIA attributes for accessibility
 */
export function initNavbar() {
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');
  const navbar = document.querySelector('#navbar');
  const themeToggle = document.querySelector('.theme-toggle');
  const dropdownTrigger = document.querySelector('.navbar-dropdown > a');
  const navbarDropdown = document.querySelector('.navbar-dropdown');

  // Guard: Exit if essential elements don't exist
  if (!toggle || !menu || !navbar) {
    console.error('[Navbar] FATAL: Required elements not found', {
      'navbar (#navbar)': !!navbar,
      'toggle (.navbar-toggle)': !!toggle,
      'menu (.navbar-menu)': !!menu,
      'theme (.theme-toggle)': !!themeToggle,
      'dropdown (.navbar-dropdown)': !!navbarDropdown,
      'dropdownTrigger (.navbar-dropdown > a)': !!dropdownTrigger
    });
    return;
  }

  // Diagnostic logging for production debugging
  console.log('[Navbar] Elements found, initializing...', {
    'isMobileView': getComputedStyle(toggle).display !== 'none',
    'viewport': `${window.innerWidth}x${window.innerHeight}`
  });

  // ==================== Theme Toggle ====================

  /**
   * Initialize theme from localStorage (default: dark mode)
   * Always defaults to dark mode to maintain cyberpunk terminal aesthetic
   */
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Always default to dark mode (brand identity) - user can switch to light if preferred
    const isDark = savedTheme ? savedTheme === 'dark' : true;

    applyTheme(isDark);
  }

  /**
   * Apply theme to document
   * Updates data-theme attribute which CSS uses to apply light/dark mode variables
   * Also updates toggle label active states for visual feedback (VS Code pattern)
   */
  function applyTheme(isDark) {
    const root = document.documentElement;
    const darkOption = document.querySelector('.toggle-option[data-theme="dark"]');
    const lightOption = document.querySelector('.toggle-option[data-theme="light"]');

    if (isDark) {
      // Dark theme: Set data-theme attribute to trigger dark mode CSS variables
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');

      // Update toggle labels: dark=active (bright), light=inactive (dimmed)
      if (darkOption) darkOption.classList.add('active');
      if (lightOption) lightOption.classList.remove('active');
    } else {
      // Light theme: Set data-theme attribute to trigger light mode CSS variables
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');

      // Update toggle labels: light=active (bright), dark=inactive (dimmed)
      if (lightOption) lightOption.classList.add('active');
      if (darkOption) darkOption.classList.remove('active');
    }
  }

  /**
   * Toggle between dark and light theme
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    applyTheme(!isDark);
  }

  // ==================== Menu Toggle ====================

  /**
   * Toggle mobile menu open/closed
   */
  function toggleMenu() {
    const isActive = menu.classList.contains('active');

    // Toggle active state
    toggle.classList.toggle('active');
    menu.classList.toggle('active');

    // Update ARIA attribute for screen readers
    toggle.setAttribute('aria-expanded', !isActive);

    // Update aria-label text
    toggle.setAttribute(
      'aria-label',
      isActive ? 'Menu openen' : 'Menu sluiten'
    );
  }

  /**
   * Close mobile menu
   */
  function closeMenu() {
    toggle.classList.remove('active');
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menu openen');
  }

  /**
   * Detect if we're on mobile (hamburger menu is visible)
   */
  function isMobileView() {
    return window.getComputedStyle(toggle).display !== 'none';
  }

  // ==================== Dropdown Menu ====================

  /**
   * Toggle dropdown (unified desktop + mobile)
   * Accordion pattern: only one dropdown can be open at a time
   * WCAG AAA: Updates ARIA states for screen reader announcements
   */
  function toggleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();

    // Toggle active class (works for desktop + mobile)
    navbarDropdown.classList.toggle('active');

    // Update ARIA attributes based on NEW state (after toggle) for accessibility
    const isNowActive = navbarDropdown.classList.contains('active');
    const trigger = navbarDropdown.querySelector('.dropdown-trigger');
    const menu = navbarDropdown.querySelector('.dropdown-menu');

    if (trigger) {
      trigger.setAttribute('aria-expanded', isNowActive ? 'true' : 'false');
    }
    if (menu) {
      menu.setAttribute('aria-hidden', isNowActive ? 'false' : 'true');
    }
  }

  /**
   * Close all dropdowns
   * WCAG AAA: Resets ARIA states when closing
   */
  function closeDropdowns() {
    if (navbarDropdown) {
      navbarDropdown.classList.remove('active');

      // Reset ARIA states for accessibility
      const trigger = navbarDropdown.querySelector('.dropdown-trigger');
      const menu = navbarDropdown.querySelector('.dropdown-menu');

      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
      if (menu) {
        menu.setAttribute('aria-hidden', 'true');
      }
    }
  }

  // ==================== Link Actions ====================

  /**
   * Handle Leerpad link
   */
  function handleLeerpad(e) {
    e.preventDefault();
    closeMenu();
    closeDropdowns();

    // Focus terminal and insert leerpad command
    const inputElement = document.getElementById('terminal-input');
    if (inputElement) {
      inputElement.value = 'leerpad';
      inputElement.focus();

      // Trigger Enter key event to execute command
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        bubbles: true
      });
      inputElement.dispatchEvent(enterEvent);
    }
  }

  /**
   * Handle Commands link
   */
  function handleCommands(e) {
    e.preventDefault();
    closeMenu();
    closeDropdowns();

    // Focus terminal and insert help command
    const inputElement = document.getElementById('terminal-input');
    if (inputElement) {
      inputElement.value = 'help';
      inputElement.focus();

      // Trigger Enter key event to execute command
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        bubbles: true
      });
      inputElement.dispatchEvent(enterEvent);
    }
  }

  /**
   * Handle Shortcuts link
   */
  function handleShortcuts(e) {
    e.preventDefault();
    closeMenu();
    closeDropdowns();

    // Focus terminal and insert shortcuts command
    const inputElement = document.getElementById('terminal-input');
    if (inputElement) {
      inputElement.value = 'shortcuts';
      inputElement.focus();

      // Trigger Enter key event to execute command
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        bubbles: true
      });
      inputElement.dispatchEvent(enterEvent);
    }
  }

  /**
   * Handle About/Over link
   */
  function handleAbout(e) {
    e.preventDefault();
    closeMenu();
    closeDropdowns();

    showAboutModal();
  }

  /**
   * Handle Blog link
   * Navigates to blog section (separate page, not SPA)
   */
  function handleBlog(e) {
    e.preventDefault();
    closeMenu();
    closeDropdowns();

    // Navigate to blog homepage
    console.log('[Navbar] Navigating to blog...');
    window.location.href = '/blog/index.html';
  }

  /**
   * Handle Search action
   */
  function handleSearch(e) {
    e.preventDefault();
    closeMenu();

    // Open command search modal
    if (window.commandSearchModal) {
      window.commandSearchModal.open();
    } else {
      // Fallback if modal not initialized
      const inputElement = document.getElementById('terminal-input');
      if (inputElement) {
        inputElement.focus();
        inputElement.value = 'help';
      }
    }
  }

  /**
   * Handle GitHub action
   */
  function handleGitHub(e) {
    // Allow default link behavior
    closeMenu();
  }

  /**
   * Show About modal
   */
  function showAboutModal() {
    let modal = document.getElementById('about-modal');

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

      // Event listeners for modal
      const closeBtn = modal.querySelector('.modal-close');
      const secondaryBtn = modal.querySelector('.btn-secondary');

      const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      };

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (secondaryBtn) secondaryBtn.addEventListener('click', closeModal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeModal();
        }
      });
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  // ==================== Event Listeners ====================

  // Initialize theme on load
  initializeTheme();

  // Theme toggle button - with event delegation for inner spans
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      // Handle clicks on the button or any element inside it
      const toggleOption = e.target.closest('.toggle-option') || e.target.closest('.toggle-indicator');
      if (toggleOption || e.target === themeToggle) {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      }
    });
  }

  // Hamburger toggle click
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking outside navbar
  document.addEventListener('click', (e) => {
    // Only close if menu is active and click is outside navbar
    if (menu.classList.contains('active') && !navbar.contains(e.target)) {
      closeMenu();
      closeDropdowns();
    }
  });

  // Dropdown trigger click (unified desktop + mobile)
  if (dropdownTrigger) {
    dropdownTrigger.addEventListener('click', toggleDropdown);
  }

  // Link action handlers
  const leerpadLink = document.querySelector('a[href="#leerpad"]');
  const commandsLink = document.querySelector('a[href="#commands"]');
  const shortcutsLink = document.querySelector('a[href="#shortcuts"]');
  const overLink = document.querySelector('a[href="#over"]');
  const blogLink = document.querySelector('a[href="#blog"]');
  const searchLink = document.querySelector('a[href="#search"]');

  if (leerpadLink) leerpadLink.addEventListener('click', handleLeerpad);
  if (commandsLink) commandsLink.addEventListener('click', handleCommands);
  if (shortcutsLink) shortcutsLink.addEventListener('click', handleShortcuts);
  if (overLink) overLink.addEventListener('click', handleAbout);
  if (blogLink) blogLink.addEventListener('click', handleBlog);
  if (searchLink) searchLink.addEventListener('click', handleSearch);

  // Close menu when clicking any navigation link
  const navLinks = menu.querySelectorAll('a:not(.dropdown-trigger)');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        closeMenu();
        closeDropdowns();
      }, 100);
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (menu.classList.contains('active')) {
        closeMenu();
        toggle.focus();
      }
      closeDropdowns();
    }
  });

  // Handle window resize - adjust for mobile/desktop changes
  window.addEventListener('resize', () => {
    if (!isMobileView()) {
      // If we're on desktop now, make sure mobile menu is closed
      closeMenu();
      closeDropdowns();
    }
  });

  console.log('[Navbar] Initialized successfully');
}
