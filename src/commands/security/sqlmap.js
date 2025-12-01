/**
 * sqlmap - SQL injection detection and exploitation tool
 * Simulated command for the HackSimulator terminal
 * Educational tool demonstrating SQL injection concepts
 */

import { boxText } from '../../utils/asciiBox.js';

export default {
  name: 'sqlmap',
  category: 'security',
  description: 'SQL injection testing tool',
  usage: 'sqlmap <url>',

  async execute(args, flags, context) {
    // Check if user has given consent for security tools
    const hasConsent = localStorage.getItem('security_tools_consent') === 'true';

    // Show warning on first use (no consent + no args)
    if (!hasConsent && args.length === 0) {
      const warningContent = `SQLMAP - Automatic SQL Injection Tool

JURIDISCHE WAARSCHUWING:
SQL injection testing zonder toestemming is ILLEGAAL.
Ongeautoriseerde toegang tot databases = strafbaar feit.

  Straf: Tot 6 jaar + civiele aansprakelijkheid

EDUCATIEF GEBRUIK:
Deze simulator demonstreert SQL injection concepten veilig.
Alle aanvallen zijn gesimuleerd.

GEBRUIK:
  sqlmap http://site.com/product?id=1
  sqlmap http://demo-app.local/login
  sqlmap http://test-site.com/search?q=test`;

      const warningBox = boxText(warningContent, 'SECURITY WARNING', 60);

      return `${warningBox}

[ ? ] OM DOOR TE GAAN:

    Type 'sqlmap <url>' om te accepteren en door te gaan

    Voorbeeld: sqlmap http://site.com/product?id=1

[ ? ] Je consent wordt opgeslagen. Type 'reset consent' om opnieuw
      de waarschuwing te zien.`;
    }

    // User provided args but hasn't given consent yet - grant consent and proceed
    if (!hasConsent && args.length > 0) {
      localStorage.setItem('security_tools_consent', 'true');
    }

    // Check if URL argument is provided
    if (args.length === 0) {
      return `sqlmap: missing URL argument

[ ? ] GEBRUIK:
   sqlmap <url>

   Voorbeelden:
   • sqlmap http://site.com/product?id=1
   • sqlmap http://demo-app.local/login
   • sqlmap http://test-site.com/search?q=test

[ ? ] Type 'man sqlmap' voor meer informatie.`;
    }

    const url = args[0];

    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `sqlmap: invalid URL format

[ ? ] TIP: URL moet beginnen met http:// of https://
        Bijvoorbeeld: sqlmap http://site.com/page?id=1`;
    }

    // Check for known vulnerable URL patterns
    const isVulnerable = url.includes('?id=') ||
                         url.includes('/product') ||
                         url.includes('/login') ||
                         url.includes('/search');

    if (!isVulnerable) {
      return `        ___
       __H__
 ___ ___[']_____ ___ ___  {1.7.2}
|_ -| . [,]     | .'| . |
|___|_  ["]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[*] starting @ ${new Date().toLocaleTimeString('nl-NL')}

[12:00:01] [INFO] testing connection to the target URL
[12:00:02] [INFO] testing if the target URL is stable
[12:00:03] [INFO] target URL appears to be stable
[12:00:04] [INFO] testing if GET parameter 'id' is injectable
[12:00:05] [INFO] testing 'AND boolean-based blind'
[12:00:06] [INFO] testing 'OR boolean-based blind'
[12:00:08] [WARNING] GET parameter does not appear to be injectable
[12:00:09] [CRITICAL] all tested parameters do not appear to be injectable

[*] ending @ ${new Date().toLocaleTimeString('nl-NL')}

[ ✓ ] GOED NIEUWS: Deze URL lijkt niet kwetsbaar voor SQL injection!

[ ? ] TIP: Probeer een URL met query parameters:
   • http://vulnerable-site.com/product?id=1
   • http://demo-app.local/search?q=test`;
    }

    // Simulate SQL injection detection
    let output = `        ___
       __H__
 ___ ___["]_____ ___ ___  {1.7.2}
|_ -| . [']     | .'| . |
|___|_  [(]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[*] starting @ ${new Date().toLocaleTimeString('nl-NL')}

[12:00:01] [INFO] testing connection to target URL
[12:00:02] [INFO] checking if the target is protected by WAF/IPS  ← Firewall check
[12:00:03] [INFO] testing if the target URL is stable
[12:00:04] [INFO] target URL is stable
[12:00:05] [INFO] testing if GET parameter 'id' is injectable
[12:00:06] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[12:00:07] [INFO] testing 'MySQL >= 5.0 AND error-based'
[12:00:08] [WARNING] reflective value(s) found  ← Parameter wordt terug getoond
[12:00:09] [INFO] GET parameter 'id' appears to be 'MySQL >= 5.0 AND error-based' injectable

[ ✓ ] **VULNERABLE!**

[12:00:10] [INFO] GET parameter 'id' is injectable
[12:00:11] [INFO] backend DBMS: MySQL 5.7.32
[12:00:12] [INFO] fetching database names...

available databases [3]:  ← Database structuur geëxtraheerd
[*] information_schema
[*] shop_db
[*] users_db

[ ? ] LEERMOMENT: Hoe werkt SQL Injection?

**Normale query:**
   SELECT * FROM products WHERE id = 1;

**Geïnjecteerde query:**
   SELECT * FROM products WHERE id = 1' OR '1'='1  ← Altijd waar!

Gevolg: Alle producten worden getoond (niet alleen id=1)

**Erger voorbeeld (data extraction):**
   ' UNION SELECT username, password FROM users --
   → Haalt gebruikersnamen en wachtwoorden op!

[ > ] WAT EEN AANVALLER KAN DOEN:
   • Database structuur ophalen (tables, columns)
   • Data lezen (credentials, persoonlijke info)
   • Data wijzigen/verwijderen (DELETE, UPDATE)
   • Admins accounts maken
   • OS commands uitvoeren (met xp_cmdshell op SQL Server)
   • Volledige server compromise

[***]  BESCHERMING (voor developers):
   [ ✓ ] Prepared statements / parameterized queries (ALTIJD!)
   [ ✓ ] Input validation (whitelist approach)
   [ ✓ ] Escape special characters (last resort)
   [ ✓ ] Least privilege (database user heeft minimale rechten)
   [ ✓ ] WAF (Web Application Firewall)
   [ ✓ ] Error handling (geen database errors tonen aan user)

[*] ending @ ${new Date().toLocaleTimeString('nl-NL')}`;

    return output;
  },

  manPage: `
NAAM
    sqlmap - Automatic SQL injection and database takeover tool

SYNOPSIS
    sqlmap <URL>

BESCHRIJVING
    SQLMap is een open source penetration testing tool die SQL injection
    kwetsbaarheden automatisch detecteert en exploiteert. Deze simulator
    demonstreert het concept educatief.

ARGUMENTEN
    URL
        Target URL met GET parameter (bijv. ?id=1)

VOORBEELDEN
    sqlmap http://site.com/product?id=1
        Test 'id' parameter voor SQL injection

EDUCATIEVE CONTEXT
    [>>>] Wat is SQL Injection?
       Aanvaller injecteert malicious SQL code via user input.

       **Kwetsbare code (PHP):**
          $id = $_GET['id'];
          $query = "SELECT * FROM products WHERE id = $id";
          [ X ] User input direct in query = GEVAARLIJK!

       **Veilige code:**
          $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
          $stmt->execute([$id]);
          [ ✓ ] Prepared statement = SQL en data gescheiden

    [ → ] Injection types:
       • **Error-based**: Database errors lezen voor info
       • **Boolean-based blind**: True/False responses
       • **Time-based blind**: Query delays (SLEEP) detecteren
       • **Union-based**: UNION SELECT voor data extraction
       • **Stacked queries**: Multiple queries (; DELETE...)

    [ ? ] Detection process:
       SQLMap test automatisch:
       1. Single quote (') → Breekt de query?
       2. Boolean payloads → OR 1=1, AND 1=2
       3. Error payloads → Trigger database errors
       4. Time delays → SLEEP(5), WAITFOR DELAY
       5. Union payloads → UNION SELECT NULL

REAL-WORLD EXAMPLES
    [ * ] Beroemde SQL injection attacks:

       **TalkTalk (2015):**
          • 157,000 klanten data gestolen
          • £400,000 boete van ICO
          • £77 miljoen kosten (reputatie damage)

       **Heartland Payment Systems (2008):**
          • 130 miljoen credit card nummers
          • $140 miljoen in settlements
          • SQL injection in payment processing

       **Sony Pictures (2011):**
          • 77 miljoen accounts gecompromitteerd
          • Wachtwoorden in plaintext opgeslagen
          • Multiple SQL injection points

    [ ? ] Gemeenschappelijk patroon: Oude, ongepatched systemen

EXPLOITATION CAPABILITIES
    [ > ] Wat SQLMap kan doen (als kwetsbaarheid gevonden):

    **Information gathering:**
       • Database type en versie
       • Current user en privileges
       • Alle databases
       • Alle tables en columns

    **Data extraction:**
       • Dump entire database
       • Specific tables (users, credentials)
       • Search for specific data

    **Database takeover:**
       • Create admin users
       • Read/write files (LOAD_FILE, INTO OUTFILE)
       • Execute OS commands (xp_cmdshell, sys_exec)

    **Advanced:**
       • SQL shell (interactive SQL)
       • OS shell (full server access)
       • Privilege escalation
       • Pivoting naar andere systemen

BESCHERMING ALS DEVELOPER
[###] Defense in depth:

    **Laag 1 • Code (KRITIEK):**
       [ ✓ ] Prepared statements (ALTIJD!)

       PHP:
          $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
          $stmt->execute([$id]);

       Node.js:
          db.query("SELECT * FROM users WHERE id = ?", [id]);

       Python:
          cursor.execute("SELECT * FROM users WHERE id = %s", (id,))

       [ X ] NOOIT string concatenation:
          "SELECT * FROM users WHERE id = " + id

    **Laag 2 • Input validation:**
       [ ✓ ] Whitelist approach (alleen expected input)
       [ ✓ ] Type checking (integer voor id)
       [ ✓ ] Length limits
       [ ✓ ] Regex validation

    **Laag 3 • Database:**
       [ ✓ ] Least privilege (app user heeft ALLEEN nodige rechten)
       [ ✓ ] Geen xp_cmdshell/file access voor app user
       [ ✓ ] Separate credentials per application

    **Laag 4 • Application:**
       [ ✓ ] Error handling (geen SQL errors naar user)
       [ ✓ ] Logging (detect injection attempts)
       [ ✓ ] Rate limiting (voorkom automated scanning)

    **Laag 5 • Network:**
       [ ✓ ] WAF (Web Application Firewall)
       [ ✓ ] IDS/IPS (Intrusion Detection/Prevention)
       [ ✓ ] Database niet publiek toegankelijk

SCANNING & TESTING
    [ ? ] Test je eigen applicatie:

    **Manual testing:**
       1. Voeg single quote toe: product?id=1'
          → Krijg je SQL error? = KWETSBAAR
       2. Test OR 1=1: product?id=1' OR '1'='1
          → Zie je alle data? = KWETSBAAR
       3. Test time delay: product?id=1' AND SLEEP(5)--
          → 5 seconden delay? = KWETSBAAR

    **Automated (met toestemming!):**
       • SQLMap voor comprehensive testing
       • Burp Suite (commercial)
       • OWASP ZAP (gratis)

COMMON MISTAKES
    [ X ] **"Ik escape special characters"**
       → Niet genoeg! Prepared statements zijn VEREIST
       → Escaping kan bypassed worden

    [ X ] **"Ik valideer input"**
       → Validatie is extra laag, niet vervanging
       → Combineer met prepared statements

    [ X ] **"Database heeft geen gevoelige data"**
       → SQLi kan leiden tot OS compromise
       → Lateral movement naar andere systems

    [ X ] **"Mijn applicatie is te klein voor aanval"**
       → Automated scanners vinden ALLES
       → Bots scannen continu het internet

JURIDISCHE CONTEXT
    [ ! ]  Computer Fraud & Abuse Act / Computercriminaliteit wet:

    **Illegaal:**
       [ X ] SQL injection op sites zonder toestemming
       [ X ] Data extraction zonder autorisatie
       [ X ] System compromise
       [ X ] Selling stolen data

    **Legaal (met expliciete toestemming):**
       [ ✓ ] Penetration testing (schriftelijk contract)
       [ ✓ ] Bug bounty programs
       [ ✓ ] Eigen applicaties testen
       [ ✓ ] Geautoriseerde security research

    Straf: Tot 6 jaar gevangenis + boetes + civiele claims

GERELATEERDE COMMANDO'S
    nmap, nikto, metasploit, burp, hydra
`.trim()
};
