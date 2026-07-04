/**
 * HackSimulator.nl - Main Entry Point
 * Browser-based terminal simulator for ethical hacking education
 */

import terminal from './core/terminal.js';
import tutorialManager from './tutorial/tutorial-manager.js';
import renderer from './ui/renderer.js';
import input from './ui/input.js';
import legalManager from './ui/legal.js';
import onboardingManager from './ui/onboarding.js';
import feedbackManager from './ui/feedback.js';
import tutorialGestures from './ui/tutorial-gestures.js';
import persistence from './filesystem/persistence.js';
import { initTerminalNavbar } from './components/navbar-terminal.js';
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
import shortcutsCmd from './commands/system/shortcuts.js';
import leerpadCmd from './commands/system/leerpad.js';
import tutorialCmd from './commands/system/tutorial.js';
import challengeCmd from './commands/system/challenge.js';
import achievementsCmd from './commands/system/achievements.js';
import certificatesCmd from './commands/system/certificates.js';
import dashboardCmd from './commands/system/dashboard.js';
import leaderboardCmd from './commands/system/leaderboard.js';
import nextCmd from './commands/system/next.js';
import hintCmd from './commands/system/hint.js';
import welcomeCmd from './commands/system/welcome.js';

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

  // System commands (14)
  registry.register('clear', clearCmd);
  registry.register('echo', echoCmd);
  registry.register('whoami', whoamiCmd);
  registry.register('date', dateCmd);
  registry.register('history', historyCmd);
  registry.register('help', helpCmd);
  registry.register('man', manCmd);
  registry.register('shortcuts', shortcutsCmd);
  registry.register('leerpad', leerpadCmd);
  registry.register('tutorial', tutorialCmd);
  registry.register('challenge', challengeCmd);
  registry.register('achievements', achievementsCmd);
  registry.register('certificates', certificatesCmd);
  registry.register('dashboard', dashboardCmd);
  registry.register('leaderboard', leaderboardCmd);
  registry.register('next', nextCmd);
  registry.register('hint', hintCmd);
  registry.register('welcome', welcomeCmd);

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

  // Commands registered
}

/**
 * Deep-link: lees de rauwe ?tutorial=<id>-param (nog niet gevalideerd).
 * Validatie tegen de geregistreerde scenario's gebeurt in terminal.init() —
 * die draait vóór de welcome-render, zodat de CTA de pending missie kent.
 * @returns {string} lege string als er geen param is
 */
function getRawDeepLinkParam() {
  try {
    return (new URLSearchParams(window.location.search).get('tutorial') || '')
      .toLowerCase()
      .trim();
  } catch (e) {
    return '';
  }
}

/**
 * Zet de cursor klaar en scroll de briefing in beeld zodat die de held is.
 * @private
 */
function _focusBriefing() {
  // Na de execute-microtask plannen zodat de briefing eerst gerenderd is.
  Promise.resolve().then(() => {
    const outputElement = terminal.getOutputElement && terminal.getOutputElement();
    if (outputElement) {
      outputElement.scrollTop = outputElement.scrollHeight;
    }
    input.focus();
  });
}

/**
 * Voer de deep-link-tutorial uit. Resume-vs-deeplink:
 *  - geen actieve tutorial → start de target
 *  - actief == target → niet herstarten (zou progress resetten); enkel focus/scroll
 *  - actief != target → expliciete klik wint: exit() (slaat progress op) + start target
 * @param {string} id
 */
function autoStartDeepLink(id) {
  if (tutorialManager.isActive()) {
    const active = tutorialManager.getStatus();
    if (active && active.scenarioId === id) {
      // Zelfde tutorial al hervat — voortzetten, niet herstarten.
      _focusBriefing();
      return;
    }
    // Andere tutorial actief — verse intentie wint. Toon één transparante regel zodat
    // de gebruiker ziet dat de vorige missie stopt/opslaat vóór de nieuwe briefing.
    renderer.renderInfo('[~] Vorige missie opgeslagen: ' + active.scenarioTitle +
      ' (stap ' + (active.currentStep + 1) + '/' + active.totalSteps + ')');
    tutorialManager.exit();
  }

  tutorialManager.setNextStartSource('homepage-leerpad');
  terminal.execute('tutorial ' + id);
  _focusBriefing();
}

/**
 * Plan de auto-start zó dat de briefing nooit in dode input of midden in de
 * typewriter valt: eerste bezoek wacht op 'typewriter-done', terugkerend vuurt direct.
 * In beide gevallen +250ms zodat de resume(100ms)/badge(200ms)-timeouts eerst landen.
 * @param {string} id
 */
function scheduleDeepLink(id) {
  const fire = () => setTimeout(() => autoStartDeepLink(id), 250);
  if (onboardingManager.isFirstTimeVisitor()) {
    document.addEventListener('typewriter-done', fire, { once: true });
  } else {
    fire();
  }
}

/**
 * Initialize the application
 */
function init() {
  // Initialize HackSimulator.nl

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

/**
 * Initialize navigation - DEPRECATED: navbar.js now handles all link navigation
 * Kept as stub for backwards compatibility
 */
function initializeNavigation() {
  // Navigation is now handled by initNavbar() in navbar.js
  // This function is kept for backwards compatibility
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

    // Initialize filesystem persistence (load saved VFS state before terminal starts)
    persistence.init();

    // Check if legal modal needs to be shown (defer welcome animation)
    const needsLegal = !legalManager.hasAcceptedLegal();

    // Deep-link: rauwe ?tutorial=-param vóór init lezen en meegeven, zodat de welcome-
    // render (die ín init draait) de pending missie kent en de "Type 'next'"-CTA aanpast.
    const rawDeepLink = getRawDeepLinkParam();

    // Initialize terminal (defer welcome if legal modal will be shown)
    terminal.init({
      outputElement,
      inputElement,
      deferWelcome: needsLegal,
      deepLinkId: rawDeepLink
    });

    // Initialize tutorial gesture handler (long-press hint, mobile only-relevant)
    tutorialGestures.init(terminal);

    // Initialize navigation menu
    initializeNavigation();

    // Initialize navbar (mobile hamburger menu)
    try {
      initTerminalNavbar();
    } catch (e) {
      console.error('[Main] initTerminalNavbar() failed:', e);
    }

    // Initialize command search modal
    if (window.CommandSearchModal) {
      window.commandSearchModal = new window.CommandSearchModal(terminal.getRegistry());
      window.commandSearchModal.init();
    }

    // Initialize feedback system
    feedbackManager.init();

    // Deep-link: ?tutorial=<id> → auto-start de bijbehorende begeleide missie.
    // terminal.init() heeft de rauwe id al gevalideerd tegen de scenario's; een
    // ongeldige waarde geeft null → stille no-op (URL blijft ongemoeid).
    // Bij een geldige id de URL opschonen zodat een refresh niet herstart.
    const deepLinkId = terminal.getPendingDeepLink();
    if (deepLinkId) {
      history.replaceState({}, '', '/terminal.html');
    }

    // If legal modal needed: show it and trigger welcome after acceptance
    if (needsLegal) {
      document.addEventListener('legal-accepted', () => {
        terminal.renderWelcome();
        if (deepLinkId) scheduleDeepLink(deepLinkId);
      }, { once: true });
    } else if (deepLinkId) {
      // Welcome is al synchroon gerenderd in terminal.init() → plan de auto-start.
      scheduleDeepLink(deepLinkId);
    }

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

  } catch (error) {
    console.error('Failed to initialize HackSimulator:', error);
    const errorBanner = document.createElement('div');
    errorBanner.setAttribute('role', 'alert');
    errorBanner.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:16px;background:#da3633;color:#fff;font-family:monospace;text-align:center;z-index:9999';
    errorBanner.textContent = 'Terminal kon niet worden geladen. Vernieuw de pagina om het opnieuw te proberen.';
    document.body.prepend(errorBanner);
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
    clear: () => terminal.clear(),
    persistence: persistence
  },
  feedback: {
    getAll: () => feedbackManager.getAllFeedback(),
    getStats: () => feedbackManager.getStats(),
    export: () => feedbackManager.exportFeedback(),
    clear: () => feedbackManager.clearAllFeedback()
  }
};
