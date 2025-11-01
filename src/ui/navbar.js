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
   * Initialize theme from localStorage or system preference
   */
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    applyTheme(isDark);
  }

  /**
   * Apply theme to document
   * Updates data-theme attribute which CSS uses to animate sun/moon SVG
   */
  function applyTheme(isDark) {
    const root = document.documentElement;
    if (isDark) {
      // Dark theme: Set data-theme attribute for CSS animations
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      // Light theme: Remove data-theme attribute (default state)
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
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
   * Toggle dropdown on mobile
   */
  function toggleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isMobileView()) {
      // Mobile: toggle active class
      navbarDropdown.classList.toggle('active');
    }
  }

  /**
   * Close all dropdowns
   */
  function closeDropdowns() {
    if (navbarDropdown) {
      navbarDropdown.classList.remove('active');
    }
  }

  // ==================== Link Actions ====================

  /**
   * Handle Tutorial link
   */
  function handleTutorial(e) {
    e.preventDefault();
    closeMenu();
    closeDropdowns();

    // Show onboarding modal (existing functionality in main.js)
    const onboardingModal = document.getElementById('onboarding-modal');
    if (onboardingModal) {
      onboardingModal.classList.add('active');
      onboardingModal.setAttribute('aria-hidden', 'false');
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
   */
  function handleBlog(e) {
    e.preventDefault();
    closeMenu();
    closeDropdowns();

    // Blog is future feature - show placeholder
    console.log('[Navbar] Blog link clicked - feature coming soon');
    // TODO: Implement blog modal or page
  }

  /**
   * Handle Search action
   */
  function handleSearch(e) {
    e.preventDefault();
    closeMenu();

    // Show terminal with help hint
    const inputElement = document.getElementById('terminal-input');
    if (inputElement) {
      inputElement.focus();
      inputElement.value = 'help';
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

          <p style="margin-top: var(--spacing-lg);"><strong>⚠️ Belangrijk:</strong> Deze simulator is uitsluitend voor educatieve doeleinden. Gebruik deze kennis alleen legaal en ethisch.</p>

          <button class="btn-primary" style="margin-top: var(--spacing-lg); width: 100%;">Sluiten</button>
        </div>
      `;

      document.body.appendChild(modal);

      // Event listeners for modal
      const closeBtn = modal.querySelector('.modal-close');
      const primaryBtn = modal.querySelector('.btn-primary');

      const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      };

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (primaryBtn) primaryBtn.addEventListener('click', closeModal);

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

  // Theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleTheme();
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

  // Dropdown trigger click (mobile only)
  if (dropdownTrigger) {
    dropdownTrigger.addEventListener('click', toggleDropdown);
  }

  // Desktop dropdown hover (show on hover)
  if (navbarDropdown && !isMobileView()) {
    navbarDropdown.addEventListener('mouseenter', () => {
      if (!isMobileView()) {
        navbarDropdown.classList.add('active');
      }
    });

    navbarDropdown.addEventListener('mouseleave', () => {
      if (!isMobileView()) {
        navbarDropdown.classList.remove('active');
      }
    });
  }

  // Link action handlers
  const tutorialLink = document.querySelector('a[href="#tutorial"]');
  const commandsLink = document.querySelector('a[href="#commands"]');
  const overLink = document.querySelector('a[href="#over"]');
  const blogLink = document.querySelector('a[href="#blog"]');
  const searchLink = document.querySelector('a[href="#search"]');

  if (tutorialLink) tutorialLink.addEventListener('click', handleTutorial);
  if (commandsLink) commandsLink.addEventListener('click', handleCommands);
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
