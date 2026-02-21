/**
 * Privilege Escalation Scenario — "Linux Server Analyse"
 *
 * Teaches post-exploitation analysis: user enumeration, log analysis,
 * and credential discovery on a compromised Linux system.
 * 4 steps: cat /etc/passwd → ls /var/log → cat auth.log → cat .bash_history
 *
 * Validators are lenient to keep the experience forgiving for beginners.
 */

var privescScenario = {
  id: 'privesc',
  title: 'Privilege Escalation: Linux Server Analyse',
  description: 'Leer een gecompromitteerd Linux systeem analyseren en credentials vinden.',
  difficulty: 'Beginner',

  briefing:
    'Je hebt toegang gekregen tot een Linux server als gewone gebruiker. ' +
    'Het security team vermoedt dat het systeem eerder is aangevallen. ' +
    'Jouw opdracht: onderzoek het systeem, analyseer wie er toegang heeft, ' +
    'bekijk de logs voor verdachte activiteit, en zoek naar gelekte ' +
    'credentials die een aanvaller zou kunnen misbruiken.',

  completionMessage:
    'Je hebt de server analyse succesvol afgerond! Je weet nu hoe je ' +
    'gebruikers enumereert via /etc/passwd, logs analyseert voor brute ' +
    'force aanvallen, en hoe onzorgvuldig opgeslagen credentials in ' +
    'command history een groot beveiligingsrisico vormen. Dit zijn ' +
    'fundamentele vaardigheden voor zowel pentesters als systeembeheerders.',

  steps: [
    {
      title: 'Enumereer systeem gebruikers',
      objective: 'Bekijk /etc/passwd om te zien welke gebruikers op het systeem staan.',
      command: 'cat',
      validate: function(cmd, args) {
        if (cmd !== 'cat') return false;
        var joined = args.join(' ').toLowerCase();
        return joined.indexOf('passwd') !== -1;
      },
      feedback:
        '[?] /etc/passwd is leesbaar voor alle gebruikers en bevat:\n' +
        '      gebruikersnaam:wachtwoord:UID:GID:info:homedir:shell\n' +
        '[?] Let op de shell kolom: /bin/bash = kan inloggen,\n' +
        '      /usr/sbin/nologin = service account (kan niet inloggen).\n' +
        '[?] De echte wachtwoord hashes staan in /etc/shadow (alleen root).\n' +
        '[?] Gebruikers met UID 0 hebben root privileges — check of er\n' +
        '      onverwachte accounts zijn met UID 0!',
      hints: [
        'Gebruik cat om het bestand /etc/passwd te bekijken.',
        'Het passwd bestand staat in de /etc/ directory.',
        'Type: cat /etc/passwd'
      ]
    },
    {
      title: 'Verken de log bestanden',
      objective: 'Gebruik ls om de inhoud van /var/log te bekijken en beschikbare logs te vinden.',
      command: 'ls',
      validate: function(cmd, args) {
        if (cmd !== 'ls') return false;
        var joined = args.join(' ').toLowerCase();
        return joined.indexOf('log') !== -1 || joined.indexOf('var') !== -1;
      },
      feedback:
        '[?] /var/log/ bevat alle systeem logbestanden op Linux.\n' +
        '[?] Belangrijke logs voor security analyse:\n' +
        '      auth.log  — authenticatie pogingen (SSH, sudo, login)\n' +
        '      syslog    — algemene systeem events en kernel berichten\n' +
        '      kern.log  — kernel berichten (firewall, hardware)\n' +
        '[?] Log analyse is essentieel bij incident response: het vertelt\n' +
        '      je wie, wat, wanneer, en vanaf waar.',
      hints: [
        'Gebruik ls om de inhoud van een directory te bekijken.',
        'De log bestanden staan in /var/log/ — gebruik ls /var/log',
        'Type: ls /var/log'
      ]
    },
    {
      title: 'Analyseer login pogingen',
      objective: 'Bekijk auth.log voor verdachte login activiteit: cat /var/log/auth.log',
      command: 'cat',
      validate: function(cmd, args) {
        if (cmd !== 'cat') return false;
        var joined = args.join(' ').toLowerCase();
        return joined.indexOf('auth') !== -1 || joined.indexOf('syslog') !== -1;
      },
      feedback:
        '[?] In de auth.log zie je 3 mislukte root login pogingen vanaf\n' +
        '      IP 10.0.0.99 — dit is een typisch brute force patroon!\n' +
        '[?] Red flags in auth.log:\n' +
        '      - Meerdere "Failed password" van hetzelfde IP\n' +
        '      - Login pogingen op root account (moet uitgeschakeld zijn)\n' +
        '      - Onbekende IP-adressen in je netwerk\n' +
        '[?] Tegenmaatregelen: fail2ban (auto-ban na X pogingen),\n' +
        '      SSH key auth (wachtwoorden uitschakelen), port knocking.',
      hints: [
        'Gebruik cat om een log bestand in /var/log/ te lezen.',
        'Het authenticatie log heet auth.log in de /var/log/ directory.',
        'Type: cat /var/log/auth.log'
      ]
    },
    {
      title: 'Vind gelekte credentials',
      objective: 'Bekijk de command history voor gelekte wachtwoorden: cat ~/.bash_history',
      command: 'cat',
      validate: function(cmd, args) {
        if (cmd !== 'cat') return false;
        var joined = args.join(' ').toLowerCase();
        return joined.indexOf('history') !== -1 || joined.indexOf('bash_history') !== -1;
      },
      feedback:
        '[?] In de bash_history vind je: mysql -u root -pSecretPass123!\n' +
        '      Dit is een GROOT beveiligingsrisico!\n' +
        '[?] Waarom is dit gevaarlijk?\n' +
        '      - Wachtwoorden in plain text in command history\n' +
        '      - Iedereen met leestoegang ziet deze credentials\n' +
        '      - Hetzelfde wachtwoord wordt vaak hergebruikt\n' +
        '[?] Bescherming:\n' +
        '      - Gebruik environment variables voor wachtwoorden\n' +
        '      - Configureer HISTIGNORE voor gevoelige commands\n' +
        '      - Gebruik een password manager\n' +
        '      - Roteer credentials regelmatig',
      hints: [
        'De command history van een gebruiker staat in een verborgen bestand.',
        'Het bestand heet .bash_history in de home directory (~/).',
        'Type: cat ~/.bash_history'
      ]
    }
  ]
};

export default privescScenario;
