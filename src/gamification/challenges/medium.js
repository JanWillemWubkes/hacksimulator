/**
 * Medium Challenges — 5 intermediate hack challenges (15-25 pts).
 *
 * Builds on easy challenges with multi-step workflows,
 * ordering validation, and unique target tracking.
 */

var mediumChallenges = [
  {
    id: 'port-scanner-pro',
    title: 'Port Scanner Pro',
    description: 'Scan meerdere doelwitten om een netwerk in kaart te brengen. Een echte pentester scant nooit maar een enkel IP.',
    difficulty: 'medium',
    points: 15,
    requirements: [
      { command: 'nmap', minCount: 3, description: 'Scan 3 unieke doelwitten met nmap' },
      { command: 'netstat', minCount: 1, description: 'Bekijk actieve verbindingen met netstat' }
    ],
    validate: function(log) {
      var nmapTargets = {};
      var hasNetstat = false;
      log.forEach(function(entry) {
        if (entry.command === 'nmap' && entry.args.length > 0) {
          nmapTargets[entry.args[0]] = true;
        }
        if (entry.command === 'netstat') hasNetstat = true;
      });
      return Object.keys(nmapTargets).length >= 3 && hasNetstat;
    },
    tips: [
      'Scan minstens 3 verschillende IP-adressen of domeinen met nmap.',
      'Gebruik \'netstat\' om te zien welke verbindingen er actief zijn op je eigen systeem.',
      'Probeer: nmap 192.168.1.1, nmap 10.0.0.1, nmap 172.16.0.1, en daarna netstat'
    ]
  },
  {
    id: 'web-recon',
    title: 'Web Reconnaissance',
    description: 'Voer een complete web reconnaissance uit. Combineer OSINT, netwerk-analyse en vulnerability scanning.',
    difficulty: 'medium',
    points: 20,
    requirements: [
      { command: 'whois', minCount: 1, description: 'Zoek domein informatie op' },
      { command: 'traceroute', minCount: 1, description: 'Trace de route naar het doelwit' },
      { command: 'nmap', minCount: 1, description: 'Scan poorten van het doelwit' },
      { command: 'nikto', minCount: 1, description: 'Scan op web kwetsbaarheden' }
    ],
    validate: function(log) {
      var hasWhois = false;
      var hasTraceroute = false;
      var hasNmap = false;
      var hasNikto = false;
      log.forEach(function(entry) {
        if (entry.command === 'whois' && entry.args.length > 0) hasWhois = true;
        if (entry.command === 'traceroute' && entry.args.length > 0) hasTraceroute = true;
        if (entry.command === 'nmap' && entry.args.length > 0) hasNmap = true;
        if (entry.command === 'nikto' && entry.args.length > 0) hasNikto = true;
      });
      return hasWhois && hasTraceroute && hasNmap && hasNikto;
    },
    tips: [
      'Begin met OSINT: \'whois\' en \'traceroute\' geven je basisinformatie over het doelwit.',
      'Gebruik daarna \'nmap\' voor poortscanning en \'nikto\' voor web vulnerability scanning.',
      'Probeer: whois example.com, traceroute example.com, nmap example.com, nikto example.com'
    ]
  },
  {
    id: 'sql-sleuth',
    title: 'SQL Sleuth',
    description: 'Vind en exploiteer een SQL injection kwetsbaarheid. Scan eerst, dan pas aanvallen — methodologie is alles!',
    difficulty: 'medium',
    points: 20,
    requirements: [
      { command: 'nikto', minCount: 1, description: 'Scan op kwetsbaarheden met nikto' },
      { command: 'sqlmap', minCount: 1, description: 'Exploiteer SQL injection met sqlmap' }
    ],
    validate: function(log) {
      // "Scan vóór aanval": zoek de eerste nikto-scan, en accepteer een sqlmap die
      // DAARNA komt. Geen first-occurrence-lock: een verkeerd-volgorde poging
      // (sqlmap vóór nikto) vergrendelt de challenge niet — nog een scan+aanval
      // herstelt het.
      var firstNikto = -1;
      for (var i = 0; i < log.length; i++) {
        if (log[i].command === 'nikto' && log[i].args.length > 0) { firstNikto = i; break; }
      }
      if (firstNikto === -1) return false;
      for (var j = firstNikto + 1; j < log.length; j++) {
        if (log[j].command === 'sqlmap' && log[j].args.length > 0) return true;
      }
      return false;
    },
    tips: [
      'Je moet eerst scannen voordat je aanvalt. Gebruik \'nikto\' om kwetsbaarheden te vinden.',
      'Pas NA de nikto scan gebruik je \'sqlmap\' om een SQL injection te exploiteren. Volgorde is belangrijk!',
      'Probeer: nikto example.com en daarna sqlmap example.com (in die volgorde!)'
    ]
  },
  {
    id: 'password-cracker',
    title: 'Password Cracker',
    description: 'Vind wachtwoordbestanden op het systeem en kraak de hashes. De typische credential hunting workflow.',
    difficulty: 'medium',
    points: 25,
    requirements: [
      { command: 'find', minCount: 1, description: 'Zoek naar wachtwoordbestanden' },
      { command: 'cat', minCount: 1, description: 'Lees de gevonden bestanden' },
      { command: 'hashcat', minCount: 1, description: 'Kraak de wachtwoord hashes' }
    ],
    validate: function(log) {
      var hasFind = false;
      var hasCat = false;
      var hasHashcat = false;
      log.forEach(function(entry) {
        if (entry.command === 'find' && entry.args.length > 0) hasFind = true;
        if (entry.command === 'cat' && entry.args.length > 0) hasCat = true;
        if (entry.command === 'hashcat' && entry.args.length > 0) hasHashcat = true;
      });
      return hasFind && hasCat && hasHashcat;
    },
    tips: [
      'Gebruik \'find\' om bestanden te zoeken die wachtwoorden of hashes bevatten.',
      'Lees gevonden bestanden met \'cat\' en gebruik dan \'hashcat\' om hashes te kraken.',
      'Probeer: find password, cat shadow.txt, hashcat -m 0 hash.txt'
    ]
  },
  {
    id: 'system-navigator',
    title: 'System Navigator',
    description: 'Navigeer door het bestandssysteem als een pro. Wissel van map, bekijk inhoud en lees bestanden.',
    difficulty: 'medium',
    points: 15,
    requirements: [
      { command: 'cd', minCount: 3, description: 'Navigeer naar 3 verschillende mappen' },
      { command: 'ls', minCount: 2, description: 'Bekijk mapinhoud 2 keer' },
      { command: 'pwd', minCount: 1, description: 'Check je huidige locatie' },
      { command: 'cat', minCount: 1, description: 'Lees een bestand' }
    ],
    validate: function(log) {
      var cdCount = 0;
      var lsCount = 0;
      var hasPwd = false;
      var hasCat = false;
      log.forEach(function(entry) {
        if (entry.command === 'cd' && entry.args.length > 0) cdCount++;
        if (entry.command === 'ls') lsCount++;
        if (entry.command === 'pwd') hasPwd = true;
        if (entry.command === 'cat' && entry.args.length > 0) hasCat = true;
      });
      return cdCount >= 3 && lsCount >= 2 && hasPwd && hasCat;
    },
    tips: [
      'Gebruik \'cd <map>\' om naar een andere map te gaan en \'ls\' om de inhoud te bekijken.',
      'Met \'pwd\' zie je waar je bent. Navigeer naar minstens 3 mappen en lees een bestand met \'cat\'.',
      'Probeer: cd /var, ls, cd log, ls, pwd, cat auth.log, cd /home'
    ]
  }
];

export default mediumChallenges;
