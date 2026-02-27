/**
 * Hard Challenges — 5 advanced hack challenges (30-50 pts).
 *
 * Multi-step workflows covering full pentest methodology,
 * post-exploitation, and incident response.
 */

var hardChallenges = [
  {
    id: 'full-recon',
    title: 'Full Reconnaissance',
    description: 'Voer een complete reconnaissance uit met alle beschikbare tools. Laat geen steen ongedraaid!',
    difficulty: 'hard',
    points: 30,
    requirements: [
      { command: 'whois', minCount: 1, description: 'Zoek domein informatie op' },
      { command: 'ping', minCount: 1, description: 'Test of het doelwit online is' },
      { command: 'traceroute', minCount: 1, description: 'Trace de route naar het doelwit' },
      { command: 'nmap', minCount: 2, description: 'Scan 2 unieke doelwitten met nmap' },
      { command: 'netstat', minCount: 1, description: 'Bekijk actieve verbindingen' },
      { command: 'ifconfig', minCount: 1, description: 'Bekijk je eigen netwerkconfig' }
    ],
    validate: function(log) {
      var hasWhois = false;
      var hasPing = false;
      var hasTraceroute = false;
      var nmapTargets = {};
      var hasNetstat = false;
      var hasIfconfig = false;
      log.forEach(function(entry) {
        if (entry.command === 'whois' && entry.args.length > 0) hasWhois = true;
        if (entry.command === 'ping' && entry.args.length > 0) hasPing = true;
        if (entry.command === 'traceroute' && entry.args.length > 0) hasTraceroute = true;
        if (entry.command === 'nmap' && entry.args.length > 0) {
          nmapTargets[entry.args[0]] = true;
        }
        if (entry.command === 'netstat') hasNetstat = true;
        if (entry.command === 'ifconfig') hasIfconfig = true;
      });
      return hasWhois && hasPing && hasTraceroute &&
        Object.keys(nmapTargets).length >= 2 && hasNetstat && hasIfconfig;
    },
    tips: [
      'Begin met passieve recon: \'whois\' en \'ping\' om het doelwit te identificeren.',
      'Gebruik daarna \'traceroute\', \'nmap\' (op 2 verschillende doelwitten!), \'netstat\' en \'ifconfig\'.',
      'Probeer: whois example.com, ping example.com, traceroute example.com, nmap 192.168.1.1, nmap 10.0.0.1, netstat, ifconfig'
    ]
  },
  {
    id: 'privesc-path',
    title: 'Privilege Escalation Path',
    description: 'Je hebt initieel toegang. Verken het systeem, vind gevoelige bestanden en zoek naar escalatie-mogelijkheden.',
    difficulty: 'hard',
    points: 40,
    requirements: [
      { command: 'whoami', minCount: 1, description: 'Check je huidige privileges' },
      { command: 'ls', minCount: 2, description: 'Verken mappen' },
      { command: 'find', minCount: 1, description: 'Zoek naar gevoelige bestanden' },
      { command: 'cat', minCount: 2, description: 'Lees configuratiebestanden' },
      { command: 'grep', minCount: 1, description: 'Zoek naar wachtwoorden of keys' },
      { command: 'cd', minCount: 2, description: 'Navigeer door het systeem' }
    ],
    validate: function(log) {
      var hasWhoami = false;
      var lsCount = 0;
      var hasFind = false;
      var catCount = 0;
      var hasGrep = false;
      var cdCount = 0;
      log.forEach(function(entry) {
        if (entry.command === 'whoami') hasWhoami = true;
        if (entry.command === 'ls') lsCount++;
        if (entry.command === 'find' && entry.args.length > 0) hasFind = true;
        if (entry.command === 'cat' && entry.args.length > 0) catCount++;
        if (entry.command === 'grep' && entry.args.length > 0) hasGrep = true;
        if (entry.command === 'cd' && entry.args.length > 0) cdCount++;
      });
      return hasWhoami && lsCount >= 2 && hasFind && catCount >= 2 && hasGrep && cdCount >= 2;
    },
    tips: [
      'Begin met \'whoami\' om je rechten te checken. Verken daarna met \'ls\' en \'cd\'.',
      'Gebruik \'find\' om gevoelige bestanden te zoeken en \'cat\' + \'grep\' om credentials te vinden.',
      'Probeer: whoami, ls, cd /etc, ls, cat passwd, find config, cat shadow.txt, grep password config.txt, cd /home'
    ]
  },
  {
    id: 'multi-tool-master',
    title: 'Multi-Tool Master',
    description: 'Bewijs dat je een breed arsenaal beheerst. Gebruik minstens 12 verschillende commands in een sessie.',
    difficulty: 'hard',
    points: 35,
    requirements: [
      { command: 'diverse', minCount: 12, description: 'Gebruik 12 unieke commands' }
    ],
    validate: function(log) {
      var uniqueCommands = {};
      log.forEach(function(entry) {
        uniqueCommands[entry.command] = true;
      });
      return Object.keys(uniqueCommands).length >= 12;
    },
    tips: [
      'Je moet 12 verschillende commands gebruiken. Denk aan alle categorieen: netwerk, bestanden, security.',
      'Netwerk: ping, nmap, traceroute, whois, netstat, ifconfig. Bestanden: ls, cat, cd, find, grep, pwd.',
      'Security: nikto, sqlmap, hashcat, hydra. Systeem: whoami, date, echo, clear. Mix en match!'
    ]
  },
  {
    id: 'attack-chain',
    title: 'Attack Chain',
    description: 'Voer de volledige pentest kill chain uit: van reconnaissance tot exploitation. Volgorde is cruciaal!',
    difficulty: 'hard',
    points: 50,
    requirements: [
      { command: 'whois', minCount: 1, description: 'Fase 1: OSINT op het doelwit' },
      { command: 'nmap', minCount: 1, description: 'Fase 2: Poort scanning' },
      { command: 'nikto', minCount: 1, description: 'Fase 3: Vulnerability scanning' },
      { command: 'sqlmap', minCount: 1, description: 'Fase 4: Exploitation' },
      { command: 'find', minCount: 1, description: 'Fase 5: Post-exploitation zoeken' },
      { command: 'cat', minCount: 1, description: 'Fase 6: Data exfiltratie' },
      { command: 'hashcat', minCount: 1, description: 'Fase 7: Credential cracking' }
    ],
    validate: function(log) {
      var whoisTime = -1;
      var nmapTime = -1;
      var niktoTime = -1;
      var sqlmapTime = -1;
      var hasFind = false;
      var hasCat = false;
      var hasHashcat = false;
      log.forEach(function(entry, index) {
        if (entry.command === 'whois' && entry.args.length > 0 && whoisTime === -1) {
          whoisTime = index;
        }
        if (entry.command === 'nmap' && entry.args.length > 0 && nmapTime === -1) {
          nmapTime = index;
        }
        if (entry.command === 'nikto' && entry.args.length > 0 && niktoTime === -1) {
          niktoTime = index;
        }
        if (entry.command === 'sqlmap' && entry.args.length > 0 && sqlmapTime === -1) {
          sqlmapTime = index;
        }
        if (entry.command === 'find' && entry.args.length > 0) hasFind = true;
        if (entry.command === 'cat' && entry.args.length > 0) hasCat = true;
        if (entry.command === 'hashcat' && entry.args.length > 0) hasHashcat = true;
      });
      var orderedPhases = whoisTime >= 0 && nmapTime >= 0 && niktoTime >= 0 && sqlmapTime >= 0 &&
        whoisTime < nmapTime && nmapTime < niktoTime && niktoTime < sqlmapTime;
      return orderedPhases && hasFind && hasCat && hasHashcat;
    },
    tips: [
      'De eerste 4 stappen moeten in volgorde: whois, nmap, nikto, sqlmap. Daarna find, cat en hashcat.',
      'Dit is de pentest kill chain: Recon (whois) -> Scanning (nmap) -> Vulnerability (nikto) -> Exploit (sqlmap).',
      'Probeer: whois example.com, nmap example.com, nikto example.com, sqlmap example.com, find password, cat shadow.txt, hashcat -m 0 hash.txt'
    ]
  },
  {
    id: 'forensic-investigator',
    title: 'Forensic Investigator',
    description: 'Onderzoek een gehackt systeem. Verzamel bewijsmateriaal, analyseer logs en reconstrueer wat er is gebeurd.',
    difficulty: 'hard',
    points: 30,
    requirements: [
      { command: 'ls', minCount: 2, description: 'Inventariseer bestanden' },
      { command: 'cat', minCount: 3, description: 'Lees logbestanden en configs' },
      { command: 'grep', minCount: 2, description: 'Zoek naar verdachte patronen' },
      { command: 'find', minCount: 2, description: 'Zoek naar verborgen bestanden' },
      { command: 'whoami', minCount: 1, description: 'Identificeer het compromised account' },
      { command: 'date', minCount: 1, description: 'Noteer het tijdstip van onderzoek' }
    ],
    validate: function(log) {
      var lsCount = 0;
      var catCount = 0;
      var grepCount = 0;
      var findCount = 0;
      var hasWhoami = false;
      var hasDate = false;
      log.forEach(function(entry) {
        if (entry.command === 'ls') lsCount++;
        if (entry.command === 'cat' && entry.args.length > 0) catCount++;
        if (entry.command === 'grep' && entry.args.length > 0) grepCount++;
        if (entry.command === 'find' && entry.args.length > 0) findCount++;
        if (entry.command === 'whoami') hasWhoami = true;
        if (entry.command === 'date') hasDate = true;
      });
      return lsCount >= 2 && catCount >= 3 && grepCount >= 2 && findCount >= 2 && hasWhoami && hasDate;
    },
    tips: [
      'Begin met \'whoami\' en \'date\' om je onderzoek te documenteren. Gebruik \'ls\' om mappen te inventariseren.',
      'Lees logbestanden met \'cat\' en zoek naar verdachte patronen met \'grep\'. Gebruik \'find\' voor verborgen bestanden.',
      'Probeer: whoami, date, ls, ls /var/log, cat auth.log, cat syslog, cat access.log, grep error auth.log, grep root syslog, find hidden, find config'
    ]
  }
];

export default hardChallenges;
