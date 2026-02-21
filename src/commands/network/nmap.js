/**
 * nmap - Network port scanner
 * Simulated command for the HackSimulator terminal
 */

/**
 * Get simulated port scan results for known hosts
 */
function getPortScanResults(target) {
  const scanProfiles = {
    // Web servers (common ports open)
    'webserver': {
      openPorts: [
        { port: 22, service: 'SSH', info: 'OpenSSH 8.2' },
        { port: 80, service: 'HTTP', info: 'nginx 1.18.0' },
        { port: 443, service: 'HTTPS', info: 'nginx 1.18.0' }
      ],
      closedCount: 997
    },

    // Database server
    'database': {
      openPorts: [
        { port: 22, service: 'SSH', info: 'OpenSSH 8.2' },
        { port: 3306, service: 'MySQL', info: 'MySQL 8.0.25' },
        { port: 5432, service: 'PostgreSQL', info: 'PostgreSQL 13.3' }
      ],
      closedCount: 997
    },

    // Local router
    'router': {
      openPorts: [
        { port: 53, service: 'DNS', info: 'dnsmasq' },
        { port: 80, service: 'HTTP', info: 'router admin' },
        { port: 443, service: 'HTTPS', info: 'router admin' }
      ],
      closedCount: 997
    },

    // Localhost (development machine)
    'localhost': {
      openPorts: [
        { port: 22, service: 'SSH', info: 'OpenSSH 8.2' },
        { port: 80, service: 'HTTP', info: 'Apache 2.4.46' },
        { port: 3000, service: 'HTTP', info: 'Node.js dev server' },
        { port: 5432, service: 'PostgreSQL', info: 'PostgreSQL 13' },
        { port: 8080, service: 'HTTP-PROXY', info: 'development' }
      ],
      closedCount: 995
    },

    // Hardened server (minimal attack surface)
    'hardened': {
      openPorts: [
        { port: 443, service: 'HTTPS', info: 'nginx 1.20.0' }
      ],
      closedCount: 999,
      filtered: [22, 80]  // Firewall blocks these
    }
  };

  // Determine profile based on target
  if (target === 'localhost' || target === '127.0.0.1') {
    return scanProfiles.localhost;
  }
  if (target.includes('192.168.1.1')) {
    return scanProfiles.router;
  }
  if (target.includes('192.168.1')) {
    return scanProfiles.webserver;
  }
  if (target.includes('database') || target.includes('db')) {
    return scanProfiles.database;
  }
  if (target.includes('secure') || target.includes('hardened')) {
    return scanProfiles.hardened;
  }

  // Default: webserver profile
  return scanProfiles.webserver;
}

export default {
  name: 'nmap',
  category: 'network',
  description: 'Network port scanner',
  usage: 'nmap <target>',

  async execute(args, flags, context) {
    // Require target argument
    if (args.length === 0) {
      return `nmap: missing target operand\n\n[?] TIP: Gebruik 'nmap <target>' om poorten te scannen. Bijvoorbeeld: nmap 192.168.1.100`;
    }

    const target = args[0];
    const scanResults = getPortScanResults(target);

    // Build output (80/20 realistic nmap style)
    let output = `Starting Nmap scan on ${target}...\n`;
    output += `Nmap scan report for ${target}\n`;

    // Show filtered ports if any
    if (scanResults.filtered && scanResults.filtered.length > 0) {
      output += `\nFiltered ports (firewall):\n`;
      scanResults.filtered.forEach(port => {
        output += `${port}/tcp  FILTERED\n`;
      });
    }

    // Show open ports with educational annotations
    output += `\nPORT      STATE   SERVICE        VERSION\n`;
    scanResults.openPorts.forEach(({ port, service, info }) => {
      const portStr = `${port}/tcp`.padEnd(10);
      const stateStr = 'OPEN'.padEnd(8);
      const serviceStr = service.padEnd(15);

      // Add educational inline explanations for important ports
      let annotation = '';
      if (port === 22) {
        annotation = '  ← SSH: Secure remote access';
      } else if (port === 80) {
        annotation = '  ← HTTP: Webserver (unencrypted)';
      } else if (port === 443) {
        annotation = '  ← HTTPS: Secure webserver';
      } else if (port === 3306) {
        annotation = '  ← MySQL: Database server';
      } else if (port === 5432) {
        annotation = '  ← PostgreSQL: Database';
      } else if (port === 53) {
        annotation = '  ← DNS: Name resolution';
      }

      output += `${portStr}${stateStr}${serviceStr}${info}${annotation}\n`;
    });

    // Summary
    const totalPorts = 1000;
    const openCount = scanResults.openPorts.length;
    const filteredCount = scanResults.filtered ? scanResults.filtered.length : 0;
    const closedCount = totalPorts - openCount - filteredCount;

    output += `\nNmap done: 1 IP address (1 host up) scanned\n`;
    output += `Port summary: ${openCount} open, ${closedCount} closed, ${filteredCount} filtered`;

    // Educational tips based on scan results
    if (openCount === 1 && scanResults.openPorts[0].port === 443) {
      output += `\n\n[?] TIP: Deze server is goed beveiligd! Alleen HTTPS open = minimale attack surface.`;
    } else if (openCount >= 5) {
      output += `\n\n[?] TIP: Veel open poorten = meer aanvalsvectoren. Elke service kan kwetsbaarheden hebben.`;
    } else if (scanResults.openPorts.some(p => p.port === 22)) {
      output += `\n\n[?] TIP: SSH (22) open = je kunt inloggen proberen. Probeer 'hydra' voor brute force (demo).`;
    } else {
      output += `\n\n[?] TIP: Open poorten zijn entry points. Pentester checkt elke service op kwetsbaarheden.`;
    }

    // Security warning for databases
    if (scanResults.openPorts.some(p => p.port === 3306 || p.port === 5432)) {
      output += `\n\n[!]  SECURITY: Database poort open naar buiten = risico! Zou restricted moeten zijn.`;
    }

    return output;
  },

  manPage: `
NAAM
    nmap - Network port scanner

SYNOPSIS
    nmap <TARGET>

BESCHRIJVING
    Nmap ("Network Mapper") is de industrie-standaard tool voor network
    discovery en security auditing. Deze simulator toont een vereenvoudigde
    versie die de top 1000 meest voorkomende poorten scant.

ARGUMENTEN
    TARGET
        IP adres of hostname om te scannen
        Voorbeelden: 192.168.1.100, localhost, database.local

VOORBEELDEN
    nmap 192.168.1.100
        Scan een machine op je lokale netwerk

    nmap localhost
        Scan je eigen machine (development ports)

    nmap 192.168.1.1
        Scan je router

UITLEG OUTPUT
    • PORT       → Poortnummer en protocol (meestal TCP)
    • STATE      → OPEN (bereikbaar), CLOSED (niet open), FILTERED (firewall)
    • SERVICE    → Welke service draait typisch op deze poort
    • VERSION    → Versie van de software (service detection)

EDUCATIEVE TIPS
    [→] Waarom port scanning?
       • Host discovery: Welke machines zijn online?
       • Service discovery: Welke services draaien er?
       • Vulnerability assessment: Oude versies = kwetsbaarheden
       • Attack surface mapping: Hoe groot is het aanvalsoppervlak?

    [ > ] Veelvoorkomende poorten:
       • 22   → SSH (remote terminal access)
       • 80   → HTTP (webserver, unencrypted)
       • 443  → HTTPS (webserver, encrypted)
       • 21   → FTP (file transfer, oude protocol)
       • 23   → Telnet (remote access, ZEER onveilig)
       • 25   → SMTP (email server)
       • 3306 → MySQL (database)
       • 5432 → PostgreSQL (database)
       • 8080 → HTTP alternate (development servers)

    [###]  Security interpretatie:
       • Weinig open poorten (1-3) = Goed! Minimale attack surface
       • Veel open poorten (>10) = Slecht! Meer aanvalsvectoren
       • Database poorten open = RISICO! Zouden restricted moeten zijn
       • Filtered poorten = Firewall aanwezig (goed teken)

    [!]  Ethische waarschuwing:
       Port scanning zonder toestemming is in veel landen ILLEGAAL.
       Dit wordt gezien als voorbereiding op een aanval.
       • Eigen netwerk scannen? → OK
       • Netwerk van je werk (met toestemming)? → OK
       • Willekeurige servers op internet? → ILLEGAAL!

    [?] Pentesting workflow:
       1. nmap voor port discovery
       2. Service versies identificeren
       3. Zoeken naar known vulnerabilities (CVE database)
       4. Testen met exploits (metasploit, custom scripts)

    [?] Geavanceerde scans (niet in simulator):
       • -sV  → Service version detection
       • -A   → Aggressive scan (OS detection, traceroute)
       • -p-  → Scan ALLE 65535 poorten (traag!)
       • -sS  → SYN scan (stealth, geen volledige TCP handshake)
       • -O   → OS fingerprinting

PRAKTISCH GEBRUIK
    [#] Thuis netwerk:
       nmap 192.168.1.0/24  → Scan hele thuisnetwerk (alle 254 IPs)

    [CPU] Development:
       nmap localhost → Check welke dev servers draaien

    [!] Security audit:
       • Scan je eigen server vanaf buiten
       • Check of alleen essentiële poorten open zijn
       • Database poorten (3306, 5432) NOOIT naar internet!

VEELGEMAAKTE FOUTEN
    [X] nmap (zonder target)
       → Je moet een target opgeven

    [X] nmap google.com (zonder toestemming)
       → ILLEGAAL! Scan alleen je eigen systemen

    [X] Te veel vertrouwen op firewall
       → "Filtered" betekent niet "veilig" - service kan alsnog kwetsbaar zijn

[###] SECURITY BEST PRACTICES
    [✓] Minimaliseer open poorten (alleen wat noodzakelijk is)
    [✓] Database poorten ALLEEN toegankelijk voor app servers
    [✓] SSH op non-standard port (security through obscurity - beperkt effectief)
    [✓] Firewall rules: whitelist approach (allow only what's needed)
    [✓] Regelmatig scannen van je eigen infrastructure

GERELATEERDE COMMANDO'S
    ping, netstat, traceroute, nikto (web vulnerability scanner)
`.trim()
};
