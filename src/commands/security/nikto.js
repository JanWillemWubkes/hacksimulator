/**
 * nikto - Web server vulnerability scanner
 * Simulated command for the HackSimulator terminal
 * Educational tool demonstrating web vulnerability scanning
 */

export default {
  name: 'nikto',
  category: 'security',
  description: 'Web server vulnerability scanner',
  usage: 'nikto <url>',

  async execute(args, flags, context) {
    // Show warning on first use
    if (args.length === 0) {
      return `⚠️  NIKTO - Web Server Scanner

⚠️  JURIDISCHE WAARSCHUWING:
    Scannen van websites zonder toestemming is ILLEGAAL.
    Dit wordt gezien als unauthorized access attempt.

    Straf: Computercriminaliteit wet + mogelijke civiele claims.

🎯 EDUCATIEF GEBRUIK:
    Deze simulator demonstreert web vulnerability scanning veilig.

💡 GEBRUIK:
    nikto <url>

    Voorbeelden:
    • nikto http://testsite.local
    • nikto http://vulnerable-app.com
    • nikto http://demo.example.org

❓ DOORGAAN? [j/n]`;
    }

    const url = args[0];

    // Validate URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `nikto: invalid URL format

💡 TIP: URL moet http:// of https:// bevatten
        Bijvoorbeeld: nikto http://example.com`;
    }

    // Simulate nikto scan
    const hostname = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    const output = `- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          192.168.1.100
+ Target Hostname:    ${hostname}
+ Target Port:        80
+ Start Time:         ${new Date().toLocaleString('nl-NL')}
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)  ← Server fingerprinting
+ The anti-clickjacking X-Frame-Options header is not present  ← Security header missing
+ The X-Content-Type-Options header is not set  ← Security header missing
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ Apache/2.4.41 appears to be outdated (current is at least 2.4.54)  ← Oude versie
+ /admin/: Directory indexing enabled  ← Sensitive directory exposed
+ /backup/: Backup directory found  ← Mogelijk gevoelige bestanden
+ /config.php.bak: Configuration backup file found  ← Config backup (credentials?)
+ /phpinfo.php: PHP info page present  ← Info disclosure
+ /test.php: Test file found  ← Development file in productie
+ /.git/: Git repository found  ← Source code exposure!
+ /server-status: Apache server-status enabled  ← Server info disclosure

🔓 GEVONDEN KWETSBAARHEDEN: 11

⚠️  KRITIEKE BEVINDINGEN:

1. **Git Repository Exposed (/.git/)**
   Severity: HIGH
   Impact: Volledige source code kan gedownload worden
   → Mogelijk credentials in code
   → Mogelijke andere kwetsbaarheden in code

2. **Directory Indexing Enabled (/admin/)**
   Severity: MEDIUM
   Impact: Aanvaller kan alle bestanden in directory zien
   → Gevoelige admin bestanden mogelijk toegankelijk

3. **Config Backup File (/config.php.bak)**
   Severity: HIGH
   Impact: Backup files bevatten vaak database credentials
   → Direct database toegang mogelijk

4. **Outdated Apache Version**
   Severity: MEDIUM
   Impact: Bekende kwetsbaarheden in oude versies
   → Mogelijk exploiteerbaar met Metasploit

5. **Security Headers Missing**
   Severity: LOW
   Impact: Verhoogd risico op XSS, clickjacking
   → Makkelijkere client-side attacks

+ 11 vulnerabilities found
+ End Time: ${new Date().toLocaleString('nl-NL')} (scan took 32 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested

💡 LEERMOMENT: Web Security Headers

**Ontbrekende headers:**
   X-Frame-Options         → Voorkomt clickjacking
   X-Content-Type-Options  → Voorkomt MIME type sniffing
   Content-Security-Policy → Voorkomt XSS attacks
   Strict-Transport-Security → Forces HTTPS

🛡️  REMEDIATIE STAPPEN:

1. **Verwijder development files:**
   rm /var/www/html/phpinfo.php
   rm /var/www/html/test.php

2. **Block .git directory:**
   <Directory ".git">
       Require all denied
   </Directory>

3. **Disable directory indexing:**
   Options -Indexes

4. **Update Apache:**
   apt update && apt upgrade apache2

5. **Add security headers (Apache):**
   Header always set X-Frame-Options "DENY"
   Header always set X-Content-Type-Options "nosniff"
   Header always set Content-Security-Policy "default-src 'self'"

6. **Remove backup files:**
   find . -name "*.bak" -delete

⚠️  PRIORITEIT: Fix HIGH severity issues eerst!`;

    return output;
  },

  manPage: `
NAAM
    nikto - Web server vulnerability scanner

SYNOPSIS
    nikto <URL>

BESCHRIJVING
    Nikto is een open source web server scanner die 6700+ potentieel
    gevaarlijke files/programs test, oude versies detecteert en
    server configuratie problemen vindt.

ARGUMENTEN
    URL
        Target website (http:// of https://)

VOORBEELDEN
    nikto http://example.com
        Scan website voor kwetsbaarheden

EDUCATIEVE CONTEXT
    🔍 Wat scant Nikto?
       • Oude software versies (Apache, nginx, IIS)
       • Gevaarlijke files (phpinfo, test files, backups)
       • Server misconfiguratie (directory indexing)
       • Security headers (of gebrek daaraan)
       • Default files (admin panels, install scripts)
       • Bekende kwetsbaarheden (via database)

    🎯 Vulnerability types:
       • **Info disclosure**: phpinfo.php, .git/, server-status
       • **Outdated software**: Oude Apache/PHP met bekende CVEs
       • **Misconfigurations**: Directory indexing, backup files
       • **Missing security headers**: CSP, HSTS, X-Frame-Options
       • **Default installs**: Admin panels op default locations

COMMON FINDINGS
    📁 Development Files in Production:
       • phpinfo.php → PHP configuration details
       • test.php → Mogelijk SQL injection test code
       • debug.php → Error messages, stack traces
       → IMPACT: Information disclosure, mogelijk RCE

    🗂️  Backup Files:
       • config.php.bak → Database credentials
       • .env.backup → API keys, secrets
       • database.sql → Volledige database dump
       → IMPACT: Direct toegang tot credentials/data

    📂 Version Control Exposed:
       • .git/ → Volledige source code + history
       • .svn/ → Subversion repository
       • .DS_Store → Mac OS metadata (directory listing)
       → IMPACT: Source code theft, hardcoded secrets

    🔓 Directory Indexing:
       • /uploads/ → User uploaded files zichtbaar
       • /admin/ → Admin panel files
       • /backup/ → Backup files
       → IMPACT: Sensitive data exposure

SECURITY HEADERS
    🛡️  Essentiële headers:

    **X-Frame-Options:**
       Voorkomt clickjacking (iframe embedding)
       Value: DENY of SAMEORIGIN

    **Content-Security-Policy (CSP):**
       Voorkomt XSS attacks
       Value: default-src 'self'; script-src 'self'

    **Strict-Transport-Security (HSTS):**
       Forceert HTTPS
       Value: max-age=31536000; includeSubDomains

    **X-Content-Type-Options:**
       Voorkomt MIME sniffing
       Value: nosniff

    **Referrer-Policy:**
       Controleert hoeveel referrer info verstuurd wordt
       Value: strict-origin-when-cross-origin

REAL-WORLD EXAMPLES
    📰 Git Repository Exposure:
       • Uber (2016): .git/ exposed in web root
       • Source code downloaded door security researcher
       • AWS credentials gevonden in code
       • $3 miljoen data breach resultaat

    📰 phpinfo() Exposure:
       • Talloze sites laten phpinfo.php online staan
       • Toont: File paths, extensions, environment vars
       • Helpt aanvaller met reconnaissance
       • Vaak eerste stap in attack chain

REMEDIATION
    🔧 Quick fixes:

    **1. Remove dangerous files:**
       find /var/www -name "phpinfo.php" -delete
       find /var/www -name "test.php" -delete
       find /var/www -name "*.bak" -delete

    **2. Block version control:**
       # Apache
       <DirectoryMatch "^\\.git">
           Require all denied
       </DirectoryMatch>

       # Nginx
       location ~ /\\.git {
           deny all;
       }

    **3. Disable directory indexing:**
       # Apache
       Options -Indexes

       # Nginx
       autoindex off;

    **4. Add security headers (Apache):**
       Header set X-Frame-Options "DENY"
       Header set X-Content-Type-Options "nosniff"
       Header set Content-Security-Policy "default-src 'self'"
       Header set Strict-Transport-Security "max-age=31536000"

    **5. Update software:**
       apt update && apt upgrade  # Debian/Ubuntu
       yum update                 # CentOS/RHEL

AUTOMATED SCANNING
    🤖 CI/CD Integration:
       Nikto kan geautomatiseerd draaien in CI/CD pipeline:

       # GitLab CI
       nikto-scan:
         script:
           - nikto -h https://staging.example.com -o report.html

       → Catch vulnerabilities VOOR production deploy

DEFENSE IN DEPTH
    🛡️  Layered security:

    **Layer 1 - Server hardening:**
       ✅ Remove default files/folders
       ✅ Disable directory indexing
       ✅ Update software regelmatig
       ✅ Minimal installed packages

    **Layer 2 - Web Application Firewall:**
       ✅ ModSecurity (Apache/Nginx)
       ✅ Cloudflare WAF
       ✅ AWS WAF
       → Block common attack patterns

    **Layer 3 - Security headers:**
       ✅ CSP, HSTS, X-Frame-Options
       ✅ Check: securityheaders.com

    **Layer 4 - Monitoring:**
       ✅ Log analysis (fail2ban)
       ✅ SIEM integration
       ✅ Anomaly detection

LIMITATIONS
    ⚠️  Wat Nikto NIET doet:
       • Geen exploit execution (alleen detectie)
       • Geen SQL injection testing (gebruik sqlmap)
       • Geen XSS testing (gebruik Burp/ZAP)
       • Geen authenticated scanning (alleen public)

    Nikto is RECON tool, niet exploit tool.

LEGAL USE
    ✅ Authorized testing:
       • Eigen websites
       • Penetration testing contract
       • Bug bounty programs (within scope)
       • Security audits

    ❌ Unauthorized scanning:
       • Random websites scannen
       • Concurrenten scannen
       • Zonder expliciete toestemming

    Straf: Computer Fraud Act violations, civiele claims

GERELATEERDE COMMANDO'S
    nmap (port scanning), sqlmap (SQL injection), wpscan (WordPress)
`.trim()
};
