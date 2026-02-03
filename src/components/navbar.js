/**
 * Navbar Component - HackSimulator.nl
 *
 * Twee varianten:
 * - 'marketing': Full navbar voor landing, over-ons, contact, blog index
 * - 'app': Minimal navbar voor terminal pagina
 * - 'blog': Minimal navbar voor blog posts (terug links)
 *
 * @module components/navbar
 */

// ============================================
// NAVBAR HTML TEMPLATES
// ============================================

/**
 * Marketing navbar - full featured met hamburger menu en CTA
 * Gebruikt op: index.html, over-ons.html, contact.html
 */
function getMarketingNavbar() {
  return `
  <div class="landing-nav-wrapper">
    <nav class="landing-nav" role="navigation" aria-label="Main navigation">
      <a href="/" class="nav-brand">
        <svg class="brand-icon" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="6" fill="#9fef00"/>
          <path d="M8 22 L16 16 L8 10" stroke="#0d1117" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M18 22 L26 22" stroke="#0d1117" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span>HackSimulator<span class="brand-accent">.nl</span></span>
      </a>

      <div class="nav-right">
        <!-- Mobile Menu Toggle -->
        <button type="button" class="mobile-menu-toggle" aria-label="Open navigatiemenu" aria-expanded="false">
          <svg class="hamburger-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Theme Toggle -->
        <button type="button" class="theme-toggle" aria-label="Toggle tussen dark en light mode">
          <span class="toggle-option active" data-theme="dark">
            <span class="toggle-indicator">█</span> DARK
          </span>
          <span class="toggle-option" data-theme="light">
            <span class="toggle-indicator">█</span> LIGHT
          </span>
        </button>

        <!-- Primary CTA -->
        <a href="/terminal.html" class="btn-cta btn-cta-nav">Start Simulator</a>
      </div>
    </nav>
  </div>

  <!-- Mobile Menu Overlay -->
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
    <nav class="mobile-menu-nav" aria-label="Mobile navigation">
      <a href="/terminal.html" class="btn-cta btn-cta-hero mobile-menu-cta">Start Simulator</a>
    </nav>
  </div>`;
}

/**
 * App navbar - minimal met help dropdown voor terminal
 * Gebruikt op: terminal.html
 */
function getAppNavbar() {
  return `
  <nav id="navbar" role="navigation" aria-label="Main navigation">
    <div class="navbar-content">
      <!-- Brand/Logo -->
      <a href="/" class="nav-brand" aria-label="HackSimulator.nl home">
        <svg class="brand-icon" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="6" fill="#9fef00"/>
          <path d="M8 22 L16 16 L8 10" stroke="#0d1117" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M18 22 L26 22" stroke="#0d1117" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span>HackSimulator<span class="brand-accent">.nl</span></span>
      </a>

      <!-- Mobile Hamburger Toggle -->
      <button class="navbar-toggle" aria-label="Menu openen" aria-expanded="false" aria-controls="navbar-menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Navigation Links & Actions -->
      <div id="navbar-menu" class="navbar-menu">
        <ul class="navbar-links">
          <!-- Help Dropdown -->
          <li class="navbar-dropdown">
            <a href="#" class="dropdown-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="help-dropdown-menu" aria-label="Help menu">Help</a>
            <ul class="dropdown-menu" id="help-dropdown-menu" role="menu" aria-hidden="true">
              <li><a href="#leerpad">Leerpad</a></li>
              <li><a href="#commands">Commands</a></li>
              <li><a href="#shortcuts">Shortcuts</a></li>
            </ul>
          </li>
          <!-- Over Link -->
          <li><a href="#over">Over</a></li>
          <!-- Blog Link -->
          <li><a href="#blog">Blog</a></li>
        </ul>

        <div class="navbar-actions">
          <!-- Search -->
          <a href="#search" class="navbar-action" aria-label="Zoek commands">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </a>
          <!-- GitHub -->
          <a href="https://github.com/JanWillemWubkes/hacksimulator" target="_blank" rel="noopener noreferrer" class="navbar-action" aria-label="GitHub repository">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <!-- Theme Toggle -->
          <button class="theme-toggle" aria-label="Toggle tussen dark en light mode" title="Toggle tussen dark en light mode">
            <span class="toggle-option" data-theme="dark">
              <span class="toggle-indicator">█</span> DARK
            </span>
            <span class="toggle-option" data-theme="light">
              <span class="toggle-indicator">█</span> LIGHT
            </span>
          </button>
        </div>
      </div>
    </div>
  </nav>`;
}

/**
 * Blog navbar - minimal met terug links + hamburger menu (Sessie 97 uniformity)
 * Gebruikt op: blog/*.html
 * @param {Object} options - Configuratie opties
 * @param {string} options.backTo - 'simulator' of 'blog'
 * @param {string} options.basePath - Relatief pad naar root (bijv. '../')
 */
function getBlogNavbar(options = {}) {
  const basePath = options.basePath || '../';
  const showBlogLink = options.backTo !== 'blog';

  return `
  <nav class="blog-nav" aria-label="Hoofdnavigatie">
    <div class="blog-nav-inner">
      <a href="${basePath}" class="nav-brand">
        <svg class="brand-icon" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="6" fill="#9fef00"/>
          <path d="M8 22 L16 16 L8 10" stroke="#0d1117" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M18 22 L26 22" stroke="#0d1117" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span>HackSimulator<span class="brand-accent">.nl</span></span>
      </a>

      <!-- Mobile Menu Toggle (hidden on desktop) -->
      <button type="button" class="blog-mobile-toggle" aria-label="Open navigatiemenu" aria-expanded="false">
        <svg class="hamburger-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="blog-nav-links">
        <a href="${basePath}terminal.html">Simulator</a>
        ${showBlogLink ? `<a href="${basePath}blog/">Blog</a>` : ''}
      </div>
      <div class="blog-nav-actions">
        <a href="https://github.com/JanWillemWubkes/hacksimulator" target="_blank" rel="noopener noreferrer" class="navbar-action" aria-label="GitHub repository">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <button class="theme-toggle" aria-label="Toggle tussen dark en light mode" title="Toggle tussen dark en light mode">
          <span class="toggle-option" data-theme="dark">
            <span class="toggle-indicator">█</span> DARK
          </span>
          <span class="toggle-option" data-theme="light">
            <span class="toggle-indicator">█</span> LIGHT
          </span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Blog Mobile Menu Overlay -->
  <div class="blog-mobile-menu" id="blog-mobile-menu" aria-hidden="true">
    <nav class="blog-mobile-nav" aria-label="Mobile navigation">
      <a href="${basePath}terminal.html" class="blog-mobile-link">Simulator</a>
      ${showBlogLink ? `<a href="${basePath}blog/" class="blog-mobile-link">Blog</a>` : ''}
      <a href="https://github.com/JanWillemWubkes/hacksimulator" target="_blank" rel="noopener noreferrer" class="blog-mobile-link">GitHub</a>
    </nav>
  </div>`;
}

// ============================================
// INITIALIZATION FUNCTIONS
// ============================================

/**
 * Initialize theme toggle functionality
 * Reads from localStorage and syncs UI state
 */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  // Get saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleUI(savedTheme);

  // Handle click
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleUI(newTheme);
  });
}

/**
 * Update theme toggle button UI to reflect current theme
 * @param {string} theme - 'dark' or 'light'
 */
function updateThemeToggleUI(theme) {
  const options = document.querySelectorAll('.theme-toggle .toggle-option');
  options.forEach(option => {
    const isActive = option.getAttribute('data-theme') === theme;
    option.classList.toggle('active', isActive);
  });
}

/**
 * Initialize mobile menu (hamburger) for marketing navbar
 */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isExpanded);
    menu.setAttribute('aria-hidden', isExpanded);
    menu.classList.toggle('active', !isExpanded);
    document.body.classList.toggle('mobile-menu-open', !isExpanded);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('active');
      document.body.classList.remove('mobile-menu-open');
    }
  });

  // Close when clicking outside
  menu.addEventListener('click', (e) => {
    if (e.target === menu) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('active');
      document.body.classList.remove('mobile-menu-open');
    }
  });
}

/**
 * Initialize mobile menu (hamburger) for blog navbar (Sessie 97 uniformity)
 */
function initBlogMobileMenu() {
  const toggle = document.querySelector('.blog-mobile-toggle');
  const menu = document.getElementById('blog-mobile-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isExpanded);
    menu.setAttribute('aria-hidden', isExpanded);
    menu.classList.toggle('open', !isExpanded);
    document.body.classList.toggle('menu-open', !isExpanded);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });

  // Close when clicking outside (on overlay)
  menu.addEventListener('click', (e) => {
    if (e.target === menu) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });

  // Close when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}

/**
 * Initialize help dropdown for app navbar
 */
function initHelpDropdown() {
  const dropdown = document.querySelector('.navbar-dropdown');
  if (!dropdown) return;

  const trigger = dropdown.querySelector('.dropdown-trigger');
  const menu = dropdown.querySelector('.dropdown-menu');

  if (!trigger || !menu) return;

  // Toggle on click
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', !isExpanded);
    menu.setAttribute('aria-hidden', isExpanded);
    dropdown.classList.toggle('active', !isExpanded);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('active')) {
      trigger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      dropdown.classList.remove('active');
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && dropdown.classList.contains('active')) {
      trigger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      dropdown.classList.remove('active');
    }
  });
}

/**
 * Initialize terminal navbar toggle (hamburger for mobile)
 */
function initNavbarToggle() {
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.getElementById('navbar-menu');
  const dropdown = document.querySelector('.navbar-dropdown');

  if (!toggle || !menu) return;

  // Helper to close mobile menu
  const closeMenu = () => {
    toggle.classList.remove('active');
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menu openen');
  };

  // Helper to close dropdown
  const closeDropdown = () => {
    if (dropdown) {
      dropdown.classList.remove('active');
      const trigger = dropdown.querySelector('.dropdown-trigger');
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (dropdownMenu) dropdownMenu.setAttribute('aria-hidden', 'true');
    }
  };

  // Toggle menu on click
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = menu.classList.contains('active');
    toggle.classList.toggle('active', !isExpanded);
    menu.classList.toggle('active', !isExpanded);
    toggle.setAttribute('aria-expanded', !isExpanded);
    toggle.setAttribute('aria-label', isExpanded ? 'Menu openen' : 'Menu sluiten');
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    const navbar = document.getElementById('navbar');
    if (menu.classList.contains('active') && navbar && !navbar.contains(e.target)) {
      closeMenu();
      closeDropdown();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (menu.classList.contains('active')) {
        closeMenu();
        toggle.focus();
      }
      closeDropdown();
    }
  });

  // Close when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.getComputedStyle(toggle).display === 'none') {
      closeMenu();
      closeDropdown();
    }
  });
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

/**
 * Inject navbar into placeholder element
 *
 * @param {string} variant - 'marketing', 'app', or 'blog'
 * @param {Object} options - Additional options for specific variants
 * @param {string} options.basePath - Base path for relative URLs (blog variant)
 * @param {string} options.backTo - Where back link points to (blog variant)
 *
 * @example
 * // Marketing pages (landing, over-ons, contact)
 * injectNavbar('marketing');
 *
 * // Terminal page
 * injectNavbar('app');
 *
 * // Blog index
 * injectNavbar('blog', { basePath: './', backTo: 'blog' });
 *
 * // Blog post
 * injectNavbar('blog', { basePath: '../', backTo: 'simulator' });
 */
export function injectNavbar(variant = 'marketing', options = {}) {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) {
    console.warn('[navbar.js] No #navbar-placeholder element found');
    return;
  }

  // Get appropriate HTML
  let html;
  switch (variant) {
    case 'app':
      html = getAppNavbar();
      break;
    case 'blog':
      html = getBlogNavbar(options);
      break;
    case 'marketing':
    default:
      html = getMarketingNavbar();
  }

  // Inject HTML
  placeholder.outerHTML = html;

  // Initialize appropriate functionality
  // NOTE: Terminal-specific handlers (Help menu actions, About modal, etc.)
  // are handled separately by navbar-terminal.js (called from main.js)
  switch (variant) {
    case 'app':
      // Initialize universal navbar functionality
      // Terminal-specific actions are handled by navbar-terminal.js
      initThemeToggle();
      initHelpDropdown();
      initNavbarToggle();
      break;
    case 'marketing':
      initThemeToggle();
      initMobileMenu();
      break;
    case 'blog':
      initThemeToggle();
      initBlogMobileMenu();
      break;
  }
}

// Also export individual functions for flexibility
export { initThemeToggle, initMobileMenu, initHelpDropdown };
