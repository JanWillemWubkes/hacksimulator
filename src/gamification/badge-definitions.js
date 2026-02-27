/**
 * Badge Definitions — Pure data file.
 *
 * Each badge has:
 *   id, title, description, icon, rarity, trigger, check(stats) => boolean
 *
 * Trigger types:
 *   'command'   — checked after every command execution
 *   'challenge' — checked after challenge completion
 *   'session'   — checked once at terminal init
 *
 * Rarity tiers: common(8), uncommon(6), rare(4), epic(2), legendary(1)
 */

var badges = [
  // --- COMMON (8) ---
  {
    id: 'first-command',
    title: 'First Steps',
    description: 'Voer je allereerste commando uit',
    icon: '[*]',
    rarity: 'common',
    trigger: 'command',
    check: function(stats) { return stats.totalCommands >= 1; }
  },
  {
    id: 'ten-commands',
    title: 'Getting Started',
    description: 'Voer 10 commando\'s uit',
    icon: '[*]',
    rarity: 'common',
    trigger: 'command',
    check: function(stats) { return stats.totalCommands >= 10; }
  },
  {
    id: 'fifty-commands',
    title: 'Keyboard Warrior',
    description: 'Voer 50 commando\'s uit',
    icon: '[*]',
    rarity: 'common',
    trigger: 'command',
    check: function(stats) { return stats.totalCommands >= 50; }
  },
  {
    id: 'network-novice',
    title: 'Network Novice',
    description: 'Gebruik een network commando (ping, nmap, etc.)',
    icon: '[*]',
    rarity: 'common',
    trigger: 'command',
    check: function(stats) {
      var netCmds = ['ping', 'nmap', 'ifconfig', 'netstat', 'whois', 'traceroute'];
      for (var i = 0; i < netCmds.length; i++) {
        if (stats.commandCounts[netCmds[i]]) return true;
      }
      return false;
    }
  },
  {
    id: 'file-reader',
    title: 'File Reader',
    description: 'Gebruik cat om een bestand te lezen',
    icon: '[*]',
    rarity: 'common',
    trigger: 'command',
    check: function(stats) { return (stats.commandCounts.cat || 0) >= 1; }
  },
  {
    id: 'help-seeker',
    title: 'Help Seeker',
    description: 'Gebruik help of man om documentatie te raadplegen',
    icon: '[*]',
    rarity: 'common',
    trigger: 'command',
    check: function(stats) {
      return (stats.commandCounts.help || 0) >= 1 ||
             (stats.commandCounts.man || 0) >= 1;
    }
  },
  {
    id: 'recon-starter',
    title: 'Recon Starter',
    description: 'Voer een nmap scan uit',
    icon: '[*]',
    rarity: 'common',
    trigger: 'command',
    check: function(stats) { return (stats.commandCounts.nmap || 0) >= 1; }
  },
  {
    id: 'pattern-hunter',
    title: 'Pattern Hunter',
    description: 'Gebruik grep om patronen te zoeken',
    icon: '[*]',
    rarity: 'common',
    trigger: 'command',
    check: function(stats) { return (stats.commandCounts.grep || 0) >= 1; }
  },

  // --- UNCOMMON (6) ---
  {
    id: 'first-challenge',
    title: 'Challenge Accepted',
    description: 'Voltooi je eerste challenge',
    icon: '[+]',
    rarity: 'uncommon',
    trigger: 'challenge',
    check: function(stats) { return stats.completedChallenges.length >= 1; }
  },
  {
    id: 'five-challenges',
    title: 'Rising Star',
    description: 'Voltooi 5 challenges',
    icon: '[+]',
    rarity: 'uncommon',
    trigger: 'challenge',
    check: function(stats) { return stats.completedChallenges.length >= 5; }
  },
  {
    id: 'easy-sweep',
    title: 'Easy Sweep',
    description: 'Voltooi alle easy challenges',
    icon: '[+]',
    rarity: 'uncommon',
    trigger: 'challenge',
    check: function(stats) {
      var easyIds = ['network-scout', 'file-explorer', 'identity-check',
                     'domain-intel', 'log-hunter'];
      for (var i = 0; i < easyIds.length; i++) {
        if (stats.completedChallenges.indexOf(easyIds[i]) === -1) return false;
      }
      return true;
    }
  },
  {
    id: 'hundred-commands',
    title: 'Centurion',
    description: 'Voer 100 commando\'s uit',
    icon: '[+]',
    rarity: 'uncommon',
    trigger: 'command',
    check: function(stats) { return stats.totalCommands >= 100; }
  },
  {
    id: 'scanner-pro',
    title: 'Scanner Pro',
    description: 'Gebruik nmap 10 keer',
    icon: '[+]',
    rarity: 'uncommon',
    trigger: 'command',
    check: function(stats) { return (stats.commandCounts.nmap || 0) >= 10; }
  },
  {
    id: 'crypto-curious',
    title: 'Crypto Curious',
    description: 'Gebruik hashcat om een hash te kraken',
    icon: '[+]',
    rarity: 'uncommon',
    trigger: 'command',
    check: function(stats) { return (stats.commandCounts.hashcat || 0) >= 1; }
  },

  // --- RARE (4) ---
  {
    id: 'ten-challenges',
    title: 'Veteran',
    description: 'Voltooi 10 challenges',
    icon: '[#]',
    rarity: 'rare',
    trigger: 'challenge',
    check: function(stats) { return stats.completedChallenges.length >= 10; }
  },
  {
    id: 'medium-sweep',
    title: 'Medium Sweep',
    description: 'Voltooi alle medium challenges',
    icon: '[#]',
    rarity: 'rare',
    trigger: 'challenge',
    check: function(stats) {
      var mediumIds = ['port-scanner-pro', 'web-recon', 'sql-sleuth',
                       'password-cracker', 'system-navigator'];
      for (var i = 0; i < mediumIds.length; i++) {
        if (stats.completedChallenges.indexOf(mediumIds[i]) === -1) return false;
      }
      return true;
    }
  },
  {
    id: 'tool-collector',
    title: 'Tool Collector',
    description: 'Gebruik minstens 15 verschillende commando\'s',
    icon: '[#]',
    rarity: 'rare',
    trigger: 'command',
    check: function(stats) {
      var count = 0;
      for (var cmd in stats.commandCounts) {
        if (Object.prototype.hasOwnProperty.call(stats.commandCounts, cmd)) {
          count++;
        }
      }
      return count >= 15;
    }
  },
  {
    id: 'streak-3',
    title: 'Dedicated',
    description: 'Haal een streak van 3 opeenvolgende dagen',
    icon: '[#]',
    rarity: 'rare',
    trigger: 'session',
    check: function(stats) { return stats.streak >= 3; }
  },

  // --- EPIC (2) ---
  {
    id: 'all-challenges',
    title: 'Completionist',
    description: 'Voltooi alle 15 challenges',
    icon: '[!]',
    rarity: 'epic',
    trigger: 'challenge',
    check: function(stats) { return stats.completedChallenges.length >= 15; }
  },
  {
    id: 'streak-7',
    title: 'Unstoppable',
    description: 'Haal een streak van 7 opeenvolgende dagen',
    icon: '[!]',
    rarity: 'epic',
    trigger: 'session',
    check: function(stats) { return stats.streak >= 7; }
  },

  // --- LEGENDARY (1) ---
  {
    id: 'hack-master',
    title: 'Hack Master',
    description: 'Voltooi alle 15 challenges en voer 100+ commando\'s uit',
    icon: '[S]',
    rarity: 'legendary',
    trigger: 'challenge',
    check: function(stats) {
      return stats.completedChallenges.length >= 15 && stats.totalCommands >= 100;
    }
  }
];

export default badges;
