/**
 * Reconnaissance Scenario — "SecureCorp Pentest"
 *
 * Teaches the first phase of ethical hacking: information gathering.
 * 4 steps: ping → nmap → whois → traceroute
 *
 * Validators check command name only (not strict on args) to keep
 * the experience forgiving for beginners.
 */

var reconScenario = {
  id: 'recon',
  title: 'Reconnaissance: SecureCorp Pentest',
  description: 'Leer de basis van reconnaissance - de eerste stap van elke pentest.',
  difficulty: 'Beginner',

  briefing:
    'Je bent ingehuurd als ethical hacker om het netwerk van ' +
    'SecureCorp te testen. Je eerste opdracht: breng het netwerk ' +
    'in kaart zonder alarm te slaan. Begin met de basis ' +
    'reconnaissance technieken die elke pentester gebruikt.',

  completionMessage:
    'Je hebt de reconnaissance fase succesvol afgerond! ' +
    'Je weet nu hoe je een doelwit verkent met ping, nmap, ' +
    'whois en traceroute. In een echte pentest zou je nu ' +
    'kwetsbaarheden gaan analyseren op basis van deze informatie.',

  steps: [
    {
      title: 'Test connectiviteit',
      objective: 'Gebruik ping om te controleren of het doelwit (192.168.1.100) bereikbaar is.',
      command: 'ping',
      validate: function(cmd, args) {
        return cmd === 'ping' && args.length > 0;
      },
      feedback:
        '[?] Ping stuurt ICMP Echo Request pakketjes naar het doelwit.\n' +
        '[?] Als je antwoord krijgt, weet je dat het systeem online is.\n' +
        '[?] Dit is altijd stap 1: controleer of je doelwit bereikbaar is\n' +
        '      voordat je verder gaat met scanning.',
      hints: [
        'Gebruik het ping commando met een IP-adres als argument.',
        'Probeer: ping <IP-adres> (bijv. ping 192.168.1.100)',
        'Type: ping 192.168.1.100'
      ]
    },
    {
      title: 'Scan open poorten',
      objective: 'Gebruik nmap om de open poorten van 192.168.1.100 te ontdekken.',
      command: 'nmap',
      validate: function(cmd, args) {
        return cmd === 'nmap' && args.length > 0;
      },
      feedback:
        '[?] Nmap is DE standaard port scanner voor pentesters.\n' +
        '[?] Open poorten onthullen welke services draaien op het systeem.\n' +
        '[?] Elke open poort is een potentiele ingang. SSH (22), HTTP (80)\n' +
        '      en HTTPS (443) zijn de meest voorkomende.',
      hints: [
        'Gebruik nmap gevolgd door het IP-adres van het doelwit.',
        'Probeer: nmap <IP-adres> om poorten te scannen.',
        'Type: nmap 192.168.1.100'
      ]
    },
    {
      title: 'Verzamel domein informatie',
      objective: 'Gebruik whois om informatie over securecorp.com op te zoeken.',
      command: 'whois',
      validate: function(cmd, args) {
        return cmd === 'whois' && args.length > 0;
      },
      feedback:
        '[?] WHOIS geeft publieke registratie-informatie over domeinen.\n' +
        '[?] Je vindt hier contactgegevens, nameservers en registratiedatums.\n' +
        '[?] Deze info helpt bij het begrijpen van de organisatiestructuur\n' +
        '      en kan social engineering aanvalsvectoren onthullen.',
      hints: [
        'Gebruik whois met een domeinnaam als argument.',
        'Probeer: whois <domeinnaam> (bijv. whois securecorp.com)',
        'Type: whois securecorp.com'
      ]
    },
    {
      title: 'Breng de route in kaart',
      objective: 'Gebruik traceroute om het netwerkpad naar 192.168.1.100 te volgen.',
      command: 'traceroute',
      validate: function(cmd, args) {
        return cmd === 'traceroute' && args.length > 0;
      },
      feedback:
        '[?] Traceroute toont elke hop (router) tussen jou en het doelwit.\n' +
        '[?] Dit onthult de netwerkinfrastructuur en mogelijke firewalls.\n' +
        '[?] Hops met hoge latency of timeouts (*) kunnen wijzen op\n' +
        '      beveiligingsmaatregelen zoals packet filtering.',
      hints: [
        'Gebruik traceroute gevolgd door een IP-adres.',
        'Probeer: traceroute <IP-adres> om de route te volgen.',
        'Type: traceroute 192.168.1.100'
      ]
    }
  ]
};

export default reconScenario;
