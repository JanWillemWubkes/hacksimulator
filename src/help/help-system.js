/**
 * 3-Tier Help System
 * Progressive help based on user behavior
 */

class HelpSystem {
  constructor() {
    // Track user errors for progressive hints
    this.errorCount = {};
    this.lastError = {};
    this.sessionStart = Date.now();
  }

  /**
   * Record an error for progressive hints
   * @param {string} command - The command that failed
   */
  recordError(command) {
    if (!this.errorCount[command]) {
      this.errorCount[command] = 0;
    }
    this.errorCount[command]++;
    this.lastError[command] = Date.now();
  }

  /**
   * Get help message based on error frequency (3-tier system)
   * @param {string} command - The command that failed
   * @param {string} suggestion - Similar command suggestion (Tier 1)
   * @returns {string} Help message
   */
  getHelp(command, suggestion = null) {
    const errorFreq = this.errorCount[command] || 0;

    // Tier 1: First error - Simple suggestion
    if (errorFreq === 0 || errorFreq === 1) {
      return this._getTier1Help(command, suggestion);
    }

    // Tier 2: Repeated errors (2-3 times) - Progressive hint with example
    if (errorFreq === 2 || errorFreq === 3) {
      return this._getTier2Help(command, suggestion);
    }

    // Tier 3: Persistent errors (4+) - Full man page reference
    return this._getTier3Help(command);
  }

  /**
   * Tier 1: Simple suggestion
   * @private
   */
  _getTier1Help(command, suggestion) {
    if (suggestion) {
      return `💡 TIP: Bedoelde je misschien '${suggestion}'?`;
    }
    return `💡 TIP: Type 'help' voor een lijst van beschikbare commands.`;
  }

  /**
   * Tier 2: Progressive hint with example
   * @private
   */
  _getTier2Help(command, suggestion) {
    let help = '';

    if (suggestion) {
      help += `💡 Je hebt dit een paar keer geprobeerd. Bedoelde je: '${suggestion}'?\n\n`;
      help += `Voorbeeld: ${suggestion} `;

      // Add example based on suggestion
      const examples = {
        'ls': '← Toon bestanden',
        'cd': '/etc ← Ga naar directory',
        'cat': 'README.txt ← Lees bestand',
        'ping': '8.8.8.8 ← Test verbinding',
        'nmap': '192.168.1.1 ← Scan poorten',
        'help': '← Alle commands',
        'man': 'ls ← Manual van command'
      };

      help += examples[suggestion] || '← Probeer dit command';
    } else {
      help += `💡 Command '${command}' bestaat niet.\n\n`;
      help += `Probeer:\n`;
      help += `• 'help' - Alle beschikbare commands\n`;
      help += `• 'man <command>' - Help voor specifiek command\n`;
      help += `• Tab toets - Autocomplete (binnenkort beschikbaar)`;
    }

    return help;
  }

  /**
   * Tier 3: Full man page reference
   * @private
   */
  _getTier3Help(command) {
    return `⚠️  Command '${command}' bestaat niet en je hebt dit meerdere keren geprobeerd.

📚 VOLLEDIGE HULP:

1. Type 'help' voor complete lijst van 30 commands
2. Type 'man <command>' voor gedetailleerde uitleg van elk command

Bijvoorbeeld:
   man ls      → Uitleg over bestanden tonen
   man cd      → Uitleg over directory wisselen
   man nmap    → Uitleg over port scanning

💡 VEELGEBRUIKTE COMMANDS:
   • ls            → Toon bestanden in huidige directory
   • cd <dir>      → Ga naar andere directory
   • cat <file>    → Lees bestand
   • ping <host>   → Test netwerk verbinding
   • help          → Alle commands met korte beschrijving

📖 Zie ook: Type gewoon 'help' om te starten!`;
  }

  /**
   * Get contextual help based on command category
   * @param {string} category - Command category (system, filesystem, network, security)
   * @returns {string} Category-specific help
   */
  getCategoryHelp(category) {
    const categoryHelp = {
      system: `📟 SYSTEM COMMANDS:
   clear, help, man, history, echo, date, whoami

   Basis commands om de terminal te gebruiken.
   Start met: help`,

      filesystem: `📁 FILESYSTEM COMMANDS:
   ls, cd, pwd, cat, mkdir, touch, rm, cp, mv, find, grep

   Commands om bestanden en directories te beheren.
   Start met: ls (toon bestanden)`,

      network: `🌐 NETWORK COMMANDS:
   ping, nmap, ifconfig, netstat, whois, traceroute

   Commands voor netwerk analyse en troubleshooting.
   Start met: ping 8.8.8.8 (test internet)`,

      security: `🔐 SECURITY COMMANDS:
   hashcat, hydra, sqlmap, metasploit, nikto

   ⚠️  Offensive tools - alleen educatief gebruik!
   Let op: Juridische warnings zijn van toepassing.`
    };

    return categoryHelp[category] || 'Type "help" voor alle commands.';
  }

  /**
   * Get quick start guide
   * @returns {string} Quick start guide
   */
  getQuickStart() {
    return `🚀 QUICK START GUIDE:

1. Verken het systeem:
   ls          → Bekijk bestanden
   pwd         → Waar ben je?
   whoami      → Wie ben je?

2. Navigeer rond:
   cd /etc     → Ga naar /etc directory
   cat passwd  → Lees passwd bestand
   cd ~        → Terug naar home

3. Test het netwerk:
   ping 8.8.8.8        → Test internet
   nmap 192.168.1.100  → Scan poorten

4. Krijg hulp:
   help        → Alle commands
   man ls      → Uitleg over 'ls'

Type 'help' om te beginnen!`;
  }

  /**
   * Reset error tracking (for new session)
   */
  reset() {
    this.errorCount = {};
    this.lastError = {};
    this.sessionStart = Date.now();
  }

  /**
   * Get session statistics
   * @returns {Object} Session stats
   */
  getStats() {
    const totalErrors = Object.values(this.errorCount).reduce((a, b) => a + b, 0);
    const sessionDuration = Math.floor((Date.now() - this.sessionStart) / 1000);

    return {
      totalErrors,
      uniqueErrors: Object.keys(this.errorCount).length,
      sessionDuration,
      mostFrequentError: this._getMostFrequentError()
    };
  }

  /**
   * Get most frequently failed command
   * @private
   */
  _getMostFrequentError() {
    let maxCount = 0;
    let maxCommand = null;

    for (const [cmd, count] of Object.entries(this.errorCount)) {
      if (count > maxCount) {
        maxCount = count;
        maxCommand = cmd;
      }
    }

    return maxCommand;
  }
}

// Export as singleton
export default new HelpSystem();
