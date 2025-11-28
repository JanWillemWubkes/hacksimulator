/**
 * hydra - Network logon cracker / brute force tool
 * Simulated command for the HackSimulator terminal
 * Educational tool demonstrating brute force attack concepts
 */

import { boxText } from '../../utils/asciiBox.js';

/**
 * Simulated vulnerable services with weak credentials
 */
const VULNERABLE_SERVICES = {
  'ssh://192.168.1.100': {
    service: 'SSH',
    port: 22,
    credentials: [
      { user: 'admin', pass: 'admin' },
      { user: 'root', pass: '123456' },
      { user: 'user', pass: 'password' }
    ],
    attempts: 47
  },
  'ftp://192.168.1.50': {
    service: 'FTP',
    port: 21,
    credentials: [
      { user: 'anonymous', pass: 'guest' },
      { user: 'admin', pass: 'admin123' }
    ],
    attempts: 23
  },
  'http://target.local/admin': {
    service: 'HTTP-POST',
    port: 80,
    credentials: [
      { user: 'admin', pass: 'admin' }
    ],
    attempts: 15
  }
};

export default {
  name: 'hydra',
  category: 'security',
  description: 'Network logon brute force tool',
  usage: 'hydra <target>',

  async execute(args, flags, context) {
    // Check if user has given consent for security tools
    const hasConsent = localStorage.getItem('security_tools_consent') === 'true';

    // Show warning on first use (no consent + no args)
    if (!hasConsent && args.length === 0) {
      const warningContent = `HYDRA - Network Logon Brute Force Tool

JURIDISCHE WAARSCHUWING:
Brute force aanvallen zonder toestemming zijn ILLEGAAL.
Dit is een strafbaar feit onder de Computercriminaliteit wet.

  Straf: Tot 6 jaar gevangenisstraf

EDUCATIEF GEBRUIK:
Deze simulator demonstreert brute force concepten veilig.
Alle "aanvallen" zijn gesimuleerd.

GEBRUIK:
  hydra ssh://192.168.1.100     (SSH brute force)
  hydra ftp://192.168.1.50      (FTP brute force)
  hydra http://target.local/admin  (HTTP brute force)`;

      const warningBox = boxText(warningContent, 'SECURITY WARNING', 60);

      return `${warningBox}

[ ? ] OM DOOR TE GAAN:

    Type 'hydra <target>' om te accepteren en door te gaan

    Voorbeeld: hydra ssh://192.168.1.100

[ ? ] Je consent wordt opgeslagen. Type 'reset consent' om opnieuw
      de waarschuwing te zien.`;
    }

    // User provided args but hasn't given consent yet - grant consent and proceed
    if (!hasConsent && args.length > 0) {
      localStorage.setItem('security_tools_consent', 'true');
    }

    // Check if target argument is provided
    if (args.length === 0) {
      return `hydra: missing target argument

[ ? ] GEBRUIK:
   hydra <target>

   Voorbeelden:
   • hydra ssh://192.168.1.100
   • hydra ftp://192.168.1.50
   • hydra http://target.local/admin

[ ? ] Type 'man hydra' voor meer informatie.`;
    }

    const target = args[0];

    // Check for confirmation (simulated - in real terminal this would be interactive)
    if (!target.startsWith('ssh://') && !target.startsWith('ftp://') && !target.startsWith('http://')) {
      return `hydra: invalid target format

[ ? ] TIP: Target moet protocol bevatten. Gebruik:
   • ssh://192.168.1.100
   • ftp://192.168.1.50
   • http://target.local/admin`;
    }

    const serviceInfo = VULNERABLE_SERVICES[target];

    if (!serviceInfo) {
      return `Hydra v9.5 starting...

[INFO] Resolving target: ${target}
[ERROR] Target not found in demo database

[ ? ] TIP: Deze simulator heeft beperkte demo targets:
   • ssh://192.168.1.100 (SSH server met zwakke credentials)
   • ftp://192.168.1.50 (FTP server)
   • http://target.local/admin (Web admin panel)

[ ! ]  In echte scenario's:
    • Hydra ondersteunt 50+ protocols
    • Custom wordlists met miljoenen passwords
    • Multi-threaded (snelheid)
    • Vaak geblokkeerd door rate limiting of firewalls`;
    }

    // Simulate brute force attack
    const { service, port, credentials, attempts } = serviceInfo;
    const foundCred = credentials[0];  // Simulate finding first weak credential

    let output = `Hydra v9.5 (c) 2023 by van Hauser/THC - Use with authorization only!

Hydra (https://github.com/vanhauser-thc/thc-hydra)
Starting at ${new Date().toLocaleTimeString('nl-NL')}

[INFO] Resolving ${target}... done
[DATA] attacking ${service} on port ${port}  ← Service identificatie
[STATUS] Loading wordlist... common_passwords.txt
[STATUS] ${attempts} login attempts to test

Brute forcing credentials...

[ATTEMPT] [${service}] host: ${target} login: root password: toor
[ATTEMPT] [${service}] host: ${target} login: root password: password
[ATTEMPT] [${service}] host: ${target} login: admin password: 12345
${'.'.repeat(40)}
[ATTEMPT] [${service}] host: ${target} login: ${foundCred.user} password: ${foundCred.pass}

[${port}][${service}] host: ${target}
   login: ${foundCred.user}     ← Username gevonden!
   password: ${foundCred.pass}  ← Password gekraakt!

[STATUS] attack finished for ${target}

1 of 1 target successfully completed, 1 valid password found

[ ? ] WAAROM WERKTE DIT?

1. **Zwakke credentials**: "${foundCred.user}:${foundCred.pass}" is voorspelbaar
2. **Geen rate limiting**: Server blokkeert niet na failed attempts
3. **Geen account lockout**: Account blijft beschikbaar na 100+ fouten
4. **Default credentials**: Veel devices komen met admin:admin
5. **Snelheid**: Hydra probeert 16 passwords per seconde (of meer)

[***]  BESCHERMING:
   [ ✓ ] Sterke, unieke wachtwoorden (min 16 karakters)
   [ ✓ ] Rate limiting (max 3 pogingen per 5 minuten)
   [ ✓ ] Account lockout (na 5 foute pogingen)
   [ ✓ ] 2FA/MFA (brute force wordt nutteloos)
   [ ✓ ] Fail2ban (auto-block na x pogingen)
   [ ✓ ] Verander default credentials ALTIJD!`;

    return output;
  },

  manPage: `
NAAM
    hydra - Network logon brute force tool

SYNOPSIS
    hydra <TARGET>

BESCHRIJVING
    THC-Hydra is een network logon cracker die brute force aanvallen
    uitvoert op diverse protocols. Deze simulator demonstreert het
    concept op een veilige, educatieve manier.

ARGUMENTEN
    TARGET
        Target in format: protocol://host[:port]
        Voorbeelden: ssh://192.168.1.100, ftp://target.com

VOORBEELDEN
    hydra ssh://192.168.1.100
        Brute force SSH login (demo)

    hydra ftp://192.168.1.50
        Brute force FTP login (demo)

EDUCATIEVE CONTEXT
    [ → ] Wat is brute force?
       Systematisch alle mogelijke passwords proberen tot je de juiste vindt.

       Voorbeeld flow:
       1. Try: admin:password → FAIL
       2. Try: admin:123456 → FAIL
       3. Try: admin:admin → SUCCESS!

    [ ~ ] Waarom werkt dit (soms)?
       • Mensen gebruiken zwakke passwords (admin, password, 123456)
       • Default credentials niet veranderd (IoT devices!)
       • Geen bescherming tegen automated attacks
       • Services zijn snel (honderden pogingen per seconde mogelijk)

    [###]  Waarom werkt dit NIET (als goed beveiligd)?
       • Rate limiting: Max 3 pogingen per 5 min
       • Account lockout: Account geblokkeerd na 5 fouten
       • 2FA/MFA: Wachtwoord alleen is niet genoeg
       • CAPTCHA: Voorkomt geautomatiseerde aanvallen
       • IP blocking: Fail2ban blokkeert IP na x pogingen
       • Strong passwords: 16+ chars = miljarden jaren om te kraken

SUPPORTED PROTOCOLS (in echte Hydra)
    [ ~ ] 50+ protocols, waaronder:
       • SSH, FTP, Telnet
       • HTTP(S) - forms, basic auth, digest auth
       • SMB, RDP (Windows remote desktop)
       • MySQL, PostgreSQL, MongoDB
       • IMAP, POP3, SMTP (email)
       • VNC, LDAP, Redis
       • En nog veel meer...

ATTACK MODES
    [ = ] Wordlist attack:
       hydra -L users.txt -P passwords.txt ssh://target
       → Probeer elke user/pass combinatie uit lijsten

    [###] Brute force:
       hydra -l admin -x 4:6:a ssh://target
       → Genereer alle combinaties (4-6 chars, letters only)

    [ > ] Single credential:
       hydra -l admin -p admin123 ssh://target
       → Test specifieke credentials (verification)

REAL-WORLD USE CASES
    [ ✓ ] Legitiem gebruik:
       • Penetration testing (met contract)
       • Password strength audit (eigen systemen)
       • Forensische analyse (met warrant)
       • Security research (ethisch)

    [ X ] Illegaal gebruik:
       • Unauthorized access proberen
       • Credential stuffing attacks
       • Botnet spreiding
       • Account takeovers

    Straf: Tot 6 jaar gevangenisstraf + hoge boetes

FAMOUS EXAMPLES
    [ * ] IoT Botnet Attacks:
       • Mirai botnet (2016): Infecteerde 600,000+ IoT devices
         → Gebruikte lijst van 60 default credentials
         → Massive DDoS attacks (1 Tbps)
         → Target: Dyn DNS provider (half internet down)

       Devices met default credentials:
       • IP cameras: admin:admin
       • Routers: admin:password
       • DVRs: admin:12345

    [ ? ] Leermoment: Miljoenen IoT devices NOOIT credentials veranderen!

BESCHERMING ALS SYSTEEMBEHEERDER
[###] Defense in depth:

    Laag 1 - Credentials:
       [ ✓ ] Verplicht sterke passwords (min 16 chars)
       [ ✓ ] Geen default credentials (force change on first login)
       [ ✓ ] Password complexity requirements

    Laag 2 - Rate limiting:
       [ ✓ ] Max 3-5 pogingen per 5 minuten
       [ ✓ ] Exponential backoff (1s, 2s, 4s, 8s...)
       [ ✓ ] CAPTCHA na 3 fouten

    Laag 3 - Account security:
       [ ✓ ] Account lockout na 5 foute pogingen
       [ ✓ ] Email notificatie bij failed logins
       [ ✓ ] 2FA/MFA verplicht (voor admin accounts)

    Laag 4 - Network security:
       [ ✓ ] Fail2ban (auto-block IP na x pogingen)
       [ ✓ ] Firewall rules (whitelist IPs voor SSH)
       [ ✓ ] VPN required voor remote access
       [ ✓ ] Port knocking (verberg services)

    Laag 5 - Monitoring:
       [ ✓ ] Log alle login pogingen
       [ ✓ ] Alerts bij brute force patterns
       [ ✓ ] SIEM integration (Security Information and Event Management)

BESCHERMING ALS GEBRUIKER
[###] Best practices:
       [ ✓ ] Password manager (unieke passwords per service)
       [ ✓ ] 16+ karakter passwords met speciale tekens
       [ ✓ ] 2FA ALTIJD inschakelen (authenticator app)
       [ ✓ ] Geen password reuse (credential stuffing preventie)
       [ ✓ ] Verander default credentials onmiddellijk

    [ X ] NOOIT doen:
       [ X ] password, admin, 123456, qwerty
       [ X ] Zelfde wachtwoord op meerdere sites
       [ X ] Wachtwoorden delen of opschrijven

TECHNICAL DETAILS
    [ ~ ]  Hoe Hydra werkt:
       1. Connect naar service (SSH/FTP/HTTP/etc)
       2. Try credentials from wordlist
       3. Parse response (success/fail)
       4. Repeat with next credential
       5. Multi-threaded (16 connections parallel)

    [ ~ ] Speed:
       • SSH: ~16 attempts/sec (handshake overhead)
       • HTTP: ~100 attempts/sec (sneller protocol)
       • FTP: ~50 attempts/sec
       • Snelheid hangt af van:
         - Network latency
         - Server response time
         - Rate limiting

COUNTERMEASURES DETECTION
    [ ? ] Herken brute force aanvallen:
       • Vele failed logins in korte tijd
       • Van zelfde IP adres
       • Verschillende usernames/passwords
       • Predictable patterns (alphabetical wordlist)

    Voorbeeld log:
       2025-10-15 12:00:01 Failed password for admin from 1.2.3.4
       2025-10-15 12:00:02 Failed password for root from 1.2.3.4
       2025-10-15 12:00:03 Failed password for user from 1.2.3.4
       → ALERT: Possible brute force from 1.2.3.4

GERELATEERDE COMMANDO'S
    hashcat, metasploit, nmap, john (the ripper)
`.trim()
};
