/**
 * Easy Challenges — 5 beginner-friendly hack challenges.
 *
 * Each challenge validates against a command log:
 * the user must execute specific commands (in any order)
 * to complete the challenge.
 */

var easyChallenges = [
  {
    id: 'network-scout',
    title: 'Network Scout',
    description: 'Verken een netwerk als een echte pentester. Ping het doelwit en scan vervolgens op open poorten.',
    difficulty: 'easy',
    points: 5,
    requirements: [
      { command: 'ping', minCount: 1, description: 'Ping een doelwit' },
      { command: 'nmap', minCount: 1, description: 'Scan poorten met nmap' }
    ],
    validate: function(log) {
      var hasPing = false;
      var hasNmap = false;
      log.forEach(function(entry) {
        if (entry.command === 'ping' && entry.args.length > 0) hasPing = true;
        if (entry.command === 'nmap' && entry.args.length > 0) hasNmap = true;
      });
      return hasPing && hasNmap;
    },
    tips: [
      'Gebruik \'ping <ip-adres>\' om te checken of een host online is.',
      'Na de ping, gebruik \'nmap <ip-adres>\' om open poorten te ontdekken.',
      'Probeer: ping 192.168.1.1 en daarna nmap 192.168.1.1'
    ]
  },
  {
    id: 'file-explorer',
    title: 'File Explorer',
    description: 'Verken het bestandssysteem als een hacker. Bekijk de mapinhoud en lees een verdacht bestand.',
    difficulty: 'easy',
    points: 5,
    requirements: [
      { command: 'ls', minCount: 1, description: 'Bekijk bestanden met ls' },
      { command: 'cat', minCount: 1, description: 'Lees een bestand met cat' }
    ],
    validate: function(log) {
      var hasLs = false;
      var hasCat = false;
      log.forEach(function(entry) {
        if (entry.command === 'ls') hasLs = true;
        if (entry.command === 'cat' && entry.args.length > 0) hasCat = true;
      });
      return hasLs && hasCat;
    },
    tips: [
      'Type \'ls\' om te zien welke bestanden er zijn.',
      'Gebruik \'cat <bestandsnaam>\' om de inhoud van een bestand te lezen.',
      'Probeer: ls en dan cat passwords.txt'
    ]
  },
  {
    id: 'identity-check',
    title: 'Identity Check',
    description: 'Verzamel informatie over het systeem en het netwerk. Wie ben je en wat is je IP-configuratie?',
    difficulty: 'easy',
    points: 5,
    requirements: [
      { command: 'whoami', minCount: 1, description: 'Check je gebruikersnaam' },
      { command: 'ifconfig', minCount: 1, description: 'Bekijk netwerkinterfaces' }
    ],
    validate: function(log) {
      var hasWhoami = false;
      var hasIfconfig = false;
      log.forEach(function(entry) {
        if (entry.command === 'whoami') hasWhoami = true;
        if (entry.command === 'ifconfig') hasIfconfig = true;
      });
      return hasWhoami && hasIfconfig;
    },
    tips: [
      'Type \'whoami\' om te zien als welke gebruiker je bent ingelogd.',
      'Gebruik \'ifconfig\' om je IP-adres en netwerkinterfaces te zien.',
      'Probeer: whoami en daarna ifconfig'
    ]
  },
  {
    id: 'domain-intel',
    title: 'Domain Intelligence',
    description: 'Doe OSINT op een domein. Zoek uit wie de eigenaar is en trace de route naar de server.',
    difficulty: 'easy',
    points: 10,
    requirements: [
      { command: 'whois', minCount: 1, description: 'Zoek domein informatie op' },
      { command: 'traceroute', minCount: 1, description: 'Trace de route naar het doelwit' }
    ],
    validate: function(log) {
      var hasWhois = false;
      var hasTraceroute = false;
      log.forEach(function(entry) {
        if (entry.command === 'whois' && entry.args.length > 0) hasWhois = true;
        if (entry.command === 'traceroute' && entry.args.length > 0) hasTraceroute = true;
      });
      return hasWhois && hasTraceroute;
    },
    tips: [
      'Gebruik \'whois <domein>\' om registratie-informatie op te zoeken.',
      'Gebruik \'traceroute <domein>\' om de route naar de server te volgen.',
      'Probeer: whois example.com en daarna traceroute example.com'
    ]
  },
  {
    id: 'log-hunter',
    title: 'Log Hunter',
    description: 'Zoek door het systeem naar aanwijzingen. Vind bestanden en doorzoek ze op verdachte patronen.',
    difficulty: 'easy',
    points: 10,
    requirements: [
      { command: 'find', minCount: 1, description: 'Zoek bestanden met find' },
      { command: 'grep', minCount: 1, description: 'Doorzoek inhoud met grep' }
    ],
    validate: function(log) {
      var hasFind = false;
      var hasGrep = false;
      log.forEach(function(entry) {
        if (entry.command === 'find' && entry.args.length > 0) hasFind = true;
        if (entry.command === 'grep' && entry.args.length > 0) hasGrep = true;
      });
      return hasFind && hasGrep;
    },
    tips: [
      'Gebruik \'find <zoekterm>\' om bestanden te vinden op het systeem.',
      'Gebruik \'grep <patroon> <bestand>\' om binnen bestanden te zoeken.',
      'Probeer: find log en daarna grep error auth.log'
    ]
  }
];

export default easyChallenges;
