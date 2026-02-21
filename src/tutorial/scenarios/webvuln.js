/**
 * Web Vulnerabilities Scenario — "E-commerce Site Audit"
 *
 * Teaches web application security testing: scanning, vulnerability
 * detection, and credential discovery.
 * 4 steps: nmap → nikto → sqlmap → cat config.php
 *
 * Validators are lenient (command name + at least one arg) to keep
 * the experience forgiving for beginners.
 */

var webvulnScenario = {
  id: 'webvuln',
  title: 'Web Vulnerabilities: E-commerce Audit',
  description: 'Leer web applicatie kwetsbaarheden vinden met scanning tools.',
  difficulty: 'Beginner',

  briefing:
    'Een e-commerce bedrijf heeft je gevraagd hun webshop te testen ' +
    'op beveiligingsproblemen. Klanten klagen over verdachte activiteit ' +
    'en het bedrijf vermoedt dat hun website kwetsbaar is. Jouw opdracht: ' +
    'scan de website, vind kwetsbaarheden, en documenteer je bevindingen.',

  completionMessage:
    'Je hebt de web vulnerability assessment succesvol afgerond! ' +
    'Je weet nu hoe je een website scant met nmap en nikto, SQL injection ' +
    'test met sqlmap, en hoe je gevoelige configuratiebestanden vindt. ' +
    'In de praktijk zou je nu een rapport schrijven voor de opdrachtgever ' +
    'met je bevindingen en aanbevelingen.',

  steps: [
    {
      title: 'Identificeer de webserver',
      objective: 'Gebruik nmap om de open poorten van target.com te scannen en de webserver te identificeren.',
      command: 'nmap',
      validate: function(cmd, args) {
        return cmd === 'nmap' && args.length > 0;
      },
      feedback:
        '[?] Nmap onthult welke services draaien op het doelwit.\n' +
        '[?] Poort 80 (HTTP) en 443 (HTTPS) zijn typisch voor webservers.\n' +
        '[?] De service versie (bijv. nginx 1.18) helpt bij het zoeken\n' +
        '      naar bekende kwetsbaarheden (CVEs) voor die versie.',
      hints: [
        'Gebruik nmap met de domeinnaam of het IP-adres als argument.',
        'Probeer: nmap target.com (of nmap <IP-adres>)',
        'Type: nmap target.com'
      ]
    },
    {
      title: 'Scan op web kwetsbaarheden',
      objective: 'Gebruik nikto om de website http://target.com te scannen op bekende kwetsbaarheden.',
      command: 'nikto',
      validate: function(cmd, args) {
        return cmd === 'nikto' && args.length > 0;
      },
      feedback:
        '[?] Nikto is een web vulnerability scanner die checkt op duizenden\n' +
        '      bekende kwetsbaarheden en misconfiguraties.\n' +
        '[?] OWASP Top 10: De meest voorkomende web kwetsbaarheden zijn:\n' +
        '      1. Broken Access Control  2. Cryptographic Failures\n' +
        '      3. Injection (SQL, XSS)   4. Insecure Design\n' +
        '[?] Nikto vond exposed directories (/admin/, /.git/) — dit zijn\n' +
        '      informatielekken die aanvallers kunnen uitbuiten.',
      hints: [
        'Gebruik nikto met een URL als argument (begin met http://).',
        'Probeer: nikto http://target.com',
        'Type: nikto http://target.com'
      ]
    },
    {
      title: 'Test op SQL injection',
      objective: 'Gebruik sqlmap om de login pagina te testen: sqlmap http://target.com/login?id=1',
      command: 'sqlmap',
      validate: function(cmd, args) {
        return cmd === 'sqlmap' && args.length > 0;
      },
      feedback:
        '[?] SQL injection is een van de gevaarlijkste web kwetsbaarheden.\n' +
        '[?] Een aanvaller kan via een onbeveiligd invoerveld SQL queries\n' +
        '      injecteren en zo de hele database uitlezen of aanpassen.\n' +
        '[?] Bescherming: gebruik altijd prepared statements / parameterized\n' +
        '      queries in plaats van string concatenation voor SQL.\n' +
        '[?] De URL bevat ?id=1 — dit soort parameters zijn vaak kwetsbaar\n' +
        '      omdat ze direct in database queries worden gebruikt.',
      hints: [
        'Gebruik sqlmap met een URL die een parameter bevat (bijv. ?id=1).',
        'De URL moet beginnen met http:// en een query parameter bevatten.',
        'Type: sqlmap http://target.com/login?id=1'
      ]
    },
    {
      title: 'Ontdek gevoelige configuratie',
      objective: 'Bekijk het configuratiebestand: cat /var/www/html/config.php',
      command: 'cat',
      validate: function(cmd, args) {
        if (cmd !== 'cat') return false;
        var joined = args.join(' ').toLowerCase();
        return joined.indexOf('config') !== -1;
      },
      feedback:
        '[?] Configuratiebestanden bevatten vaak gevoelige informatie:\n' +
        '      database wachtwoorden, API keys, en andere credentials.\n' +
        '[?] Dit is een veelvoorkomende fout: credentials in plain text\n' +
        '      in broncode opslaan in plaats van environment variables.\n' +
        '[?] Best practices voor configuratie:\n' +
        '      - Gebruik environment variables voor secrets\n' +
        '      - Voeg config bestanden toe aan .gitignore\n' +
        '      - Roteer credentials regelmatig\n' +
        '      - Gebruik een secrets manager (bijv. HashiCorp Vault)',
      hints: [
        'Gebruik cat om een configuratiebestand te bekijken in /var/www/html/.',
        'Probeer: cat /var/www/html/config.php',
        'Type: cat /var/www/html/config.php'
      ]
    }
  ]
};

export default webvulnScenario;
