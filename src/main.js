/**
 * HackSimulator.nl - Main Entry Point
 * Browser-based terminal simulator for ethical hacking education
 */

import terminal from './core/terminal.js';
import legalManager from './ui/legal.js';
import onboardingManager from './ui/onboarding.js';
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
  }
};
