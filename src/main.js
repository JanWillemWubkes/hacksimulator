/**
 * HackSimulator.nl - Main Entry Point
 * Browser-based terminal simulator for ethical hacking education
 */

import terminal from './core/terminal.js';
import legalManager from './ui/legal.js';
import onboardingManager from './ui/onboarding.js';
import feedbackManager from './ui/feedback.js';
import { initNavbar } from './ui/navbar.js';
import analyticsTracker from './analytics/tracker.js';
import analyticsEvents from './analytics/events.js';
import consentManager from './analytics/consent.js';

// Import system commands
import clearCmd from './commands/system/clear.js';
import echoCmd from './commands/system/echo.js';
import whoamiCmd from './commands/system/whoami.js';
import dateCmd from './commands/system/date.js';
import historyCmd from './commands/system/history.js';
import helpCmd from './commands/system/help.js';
import manCmd from './commands/system/man.js';

// Import filesystem commands
import lsCmd from './commands/filesystem/ls.js';
import cdCmd from './commands/filesystem/cd.js';
import pwdCmd from './commands/filesystem/pwd.js';
import catCmd from './commands/filesystem/cat.js';
import mkdirCmd from './commands/filesystem/mkdir.js';
import touchCmd from './commands/filesystem/touch.js';
import rmCmd from './commands/filesystem/rm.js';
import cpCmd from './commands/filesystem/cp.js';
import mvCmd from './commands/filesystem/mv.js';
import findCmd from './commands/filesystem/find.js';
import grepCmd from './commands/filesystem/grep.js';

// Import special commands
import resetCmd from './commands/special/reset.js';

// Import network commands
import pingCmd from './commands/network/ping.js';
import nmapCmd from './commands/network/nmap.js';
import ifconfigCmd from './commands/network/ifconfig.js';
import netstatCmd from './commands/network/netstat.js';
import whoisCmd from './commands/network/whois.js';
import tracerouteCmd from './commands/network/traceroute.js';

// Import security commands
import hashcatCmd from './commands/security/hashcat.js';
import hydraCmd from './commands/security/hydra.js';
import sqlmapCmd from './commands/security/sqlmap.js';
import metasploitCmd from './commands/security/metasploit.js';
import niktoCmd from './commands/security/nikto.js';

/**
 * Register all commands
 */
function registerCommands() {
  const registry = terminal.getRegistry();

  // System commands (7)
  registry.register('clear', clearCmd);
  registry.register('echo', echoCmd);
  registry.register('whoami', whoamiCmd);
  registry.register('date', dateCmd);
  registry.register('history', historyCmd);
  registry.register('help', helpCmd);
  registry.register('man', manCmd);

  // Filesystem commands (11)
  registry.register('ls', lsCmd);
  registry.register('cd', cdCmd);
  registry.register('pwd', pwdCmd);
  registry.register('cat', catCmd);
  registry.register('mkdir', mkdirCmd);
  registry.register('touch', touchCmd);
  registry.register('rm', rmCmd);
  registry.register('cp', cpCmd);
  registry.register('mv', mvCmd);
  registry.register('find', findCmd);
  registry.register('grep', grepCmd);

  // Special commands (1)
  registry.register('reset', resetCmd);

  // Network commands (6)
  registry.register('ping', pingCmd);
  registry.register('nmap', nmapCmd);
  registry.register('ifconfig', ifconfigCmd);
  registry.register('netstat', netstatCmd);
  registry.register('whois', whoisCmd);
  registry.register('traceroute', tracerouteCmd);

  // Security commands (5)
  registry.register('hashcat', hashcatCmd);
  registry.register('hydra', hydraCmd);
  registry.register('sqlmap', sqlmapCmd);
  registry.register('metasploit', metasploitCmd);
  registry.register('nikto', niktoCmd);

  console.log('Commands registered:', registry.list());
  console.log('Total commands:', registry.getStats().total);
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
 * Initialize navigation (modals and links)
 */
function initializeNavigation() {
  // Home link (smooth scroll to top + focus terminal)
  const homeLink = document.querySelector('a[href="#home"]');
  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Focus terminal input
      document.getElementById('terminal-input')?.focus();
    });
  }

  // Tutorial link → trigger onboarding modal
  const tutorialLink = document.querySelector('a[href="#tutorial"]');
  if (tutorialLink) {
    tutorialLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Show onboarding modal (existing functionality)
      const onboardingModal = document.getElementById('onboarding-modal');
      if (onboardingModal) {
        onboardingModal.classList.add('active');
        onboardingModal.setAttribute('aria-hidden', 'false');
      }
    });
  }

  // Commands link → show help command in terminal
  const commandsLink = document.querySelector('a[href="#commands"]');
  if (commandsLink) {
    commandsLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Execute help command to show command list
      const inputElement = document.getElementById('terminal-input');
      if (inputElement && terminal) {
        inputElement.value = 'help';
        // Trigger Enter key event
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          bubbles: true
        });
        inputElement.dispatchEvent(enterEvent);
        // Focus terminal input
        inputElement.focus();
      }
    });
  }

  // Over link → show About modal (dynamic content)
  const overLink = document.querySelector('a[href="#over"]');
  if (overLink) {
    overLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAboutModal();
    });
  }

  // Search link → show command search (optional MVP feature)
  const searchLink = document.querySelector('a[href="#search"]');
  if (searchLink) {
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Simple implementation: show help command with filter hint
      const inputElement = document.getElementById('terminal-input');
      if (inputElement && terminal) {
        inputElement.value = 'help';
        inputElement.focus();
        // Show hint about using grep to search
        setTimeout(() => {
          terminal.render(
            '💡 TIP: Gebruik "help | grep [keyword]" om commands te zoeken',
            'info'
          );
        }, 100);
      }
    });
  }
}

/**
 * Show About modal with project information
 */
function showAboutModal() {
  // Check if modal already exists
  let modal = document.getElementById('about-modal');

  if (!modal) {
    // Create modal dynamically
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

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const primaryBtn = modal.querySelector('.btn-primary');

    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (primaryBtn) {
      primaryBtn.addEventListener('click', closeModal);
    }

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Show modal
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
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

    // Initialize navigation menu
    initializeNavigation();

    // Initialize navbar (mobile hamburger menu)
    // Defer to requestAnimationFrame to ensure CSS is parsed before viewport checks
    window.requestAnimationFrame(() => {
      initNavbar();
    });

    // Initialize feedback system
    feedbackManager.init();

    // Check and show legal modal if needed (must accept before using)
    legalManager.checkAndShowModal();

    // Note: Onboarding is handled by terminal.init() - no separate call needed

    // Initialize analytics (will only track if user consents)
    analyticsTracker.init('ga4');

    // Show cookie consent banner (after a delay)
    consentManager.checkAndShowBanner();

    // Track session start (only if consent given)
    analyticsEvents.incrementVisitCount();
    analyticsEvents.sessionStart();

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
  },
  feedback: {
    getAll: () => feedbackManager.getAllFeedback(),
    getStats: () => feedbackManager.getStats(),
    export: () => feedbackManager.exportFeedback(),
    clear: () => feedbackManager.clearAllFeedback()
  }
};
