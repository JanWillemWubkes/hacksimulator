/**
 * metasploit - Penetration testing framework
 * Simulated command for the HackSimulator terminal
 * Educational tool demonstrating exploitation framework concepts
 */

import { boxText } from '../../utils/asciiBox.js';

export default {
  name: 'metasploit',
  category: 'security',
  description: 'Penetration testing framework',
  usage: 'metasploit',

  async execute(args, flags, context) {
    // Check if user has given consent for security tools
    const hasConsent = localStorage.getItem('security_tools_consent') === 'true';

    // Security warning box
    const warningContent = `METASPLOIT FRAMEWORK - Penetration Testing Platform

JURIDISCHE WAARSCHUWING:
Metasploit is ALLEEN LEGAAL met expliciete schriftelijke
toestemming. Ongeautoriseerd gebruik = strafbaar feit.

  Straf: Tot 6 jaar gevangenisstraf

WAT IS METASPLOIT?
Het meest gebruikte penetration testing framework ter wereld.
Bevat 2300+ exploits voor bekende kwetsbaarheden.

EDUCATIEF GEBRUIK:
Deze simulator demonstreert exploitation framework concepten
op een veilige manier.`;

    const warningBox = boxText(warningContent, 'SECURITY WARNING');

    // Show warning on first use - next invocation is the accept action
    if (!hasConsent) {
      try {
        localStorage.setItem('security_tools_consent', 'true');
      } catch (e) { /* private mode / quota — consent niet-persistent, tool draait toch */ }

      return `${warningBox}

[?] OM DOOR TE GAAN:

    Typ 'metasploit' opnieuw om te accepteren en door te gaan

[?] Je consent wordt opgeslagen. Typ 'reset consent' om opnieuw
      de waarschuwing te zien.`;
    }

    // Metasploit simulation - lean, beginner-friendly framework intro.
    // Geen herhaalde warningBox (consent-flow toonde 'm al), geen %%%%-ASCII-art.
    // Alleen canonieke markers zodat de renderer consistent kleurt (zie src/ui/renderer.js).
    const output = `[!] metasploit is een offensive tool — gebruik het ALLEEN op
    systemen waar je schriftelijk toestemming voor hebt.

metasploit v6.3.4-dev
2344 exploits - 1377 payloads - 423 post-modules

[?] WAT IS METASPLOIT?

Het meest gebruikte inbraak-testframework ter wereld: een
gereedschapskist vol kant-en-klare exploits (aanvalscode)
voor bekende kwetsbaarheden.

   exploit   ← code die een gat in software uitbuit
   payload   ← wat er draait NA een geslaagde exploit
   post      ← acties NA toegang (screenshots, wachtwoorden)

[?] ZO WERKT EEN AANVAL — STAP VOOR STAP

**Stap 1 — Kies een exploit**
   msf6 > use exploit/windows/smb/ms17_010_eternalblue
   ← EternalBlue: het gat achter de WannaCry-gijzelsoftware (2017)

**Stap 2 — Wijs het doel aan**
   msf6 > set RHOSTS 192.168.1.100
   ← RHOSTS = het IP-adres van het doelsysteem

**Stap 3 — Voer de exploit uit**
   msf6 > exploit
   [*] Verbinden met 192.168.1.100 via poort 445 (SMB)...
   [+] Doel is KWETSBAAR voor MS17-010!
   ← het gat is bevestigd — hier stopt de simulatie

[!] SIMULATIE GESTOPT — dit is een veilig, nagemaakt voorbeeld.
    In een echte (toegestane) pentest zou hierna volledige
    toegang tot het systeem volgen. Dat doen we hier bewust niet.

[?] DE BELANGRIJKSTE LES

De meeste exploits in Metasploit zijn voor OUDE gaten waar
allang een update voor bestaat. Organisaties worden gehackt
omdat ze niet updaten — niet door geheime 0-days.

   WannaCry (2017): de update was al MAANDEN beschikbaar.
   De slachtoffers hadden simpelweg niet geupdatet.

[TIP] Zo bescherm je je: update systemen op tijd, zet ongebruikte
      diensten uit (SMB, RDP) en gebruik een firewall.

[→] Meer weten? Typ 'man metasploit' voor exploits, payloads,
    verdediging en legale oefenomgevingen.`.trim();

    return output;
  },

  manPage: `
NAAM
    metasploit - The Metasploit Framework penetration testing platform

SYNOPSIS
    metasploit

BESCHRIJVING
    Metasploit Framework is 's werelds meest gebruikte penetration testing
    platform. Het bevat duizenden exploits, payloads en modules voor het
    testen van system security. Deze simulator geeft een educatieve intro.

VOORBEELDEN
    metasploit
        Start framework demonstratie

EDUCATIEVE CONTEXT
    [→] Wat is een exploit framework?
       Een verzameling tools en exploits voor het systematisch testen
       van systeem beveiliging. Metasploit automatiseert het exploit proces.

    [?] Framework componenten:
       • **Exploits**: Code die kwetsbaarheden uitbuit (2300+)
       • **Payloads**: Code die na exploit draait (shell, meterpreter)
       • **Auxiliary**: Scanners, fuzzers, denial of service
       • **Encoders**: Obfuscate payloads (antivirus evasion)
       • **Post-exploitation**: Keyloggers, screenshot, webcam, etc.

    [~] Exploit workflow:
       1. Reconnaissance (nmap, vulnerability scanning)
       2. Vulnerability identification (matching exploits)
       3. Exploit selection (search metasploit database)
       4. Payload configuration (reverse shell, bind shell)
       5. Exploitation (run exploit)
       6. Post-exploitation (privilege escalation, persistence)
       7. Lateral movement (compromise more systems)

FAMOUS EXPLOITS
    [*] EternalBlue (MS17-010):
       • NSA exploit, leaked door Shadow Brokers (2017)
       • Exploits Windows SMB vulnerability
       • Gebruikt door WannaCry en NotPetya ransomware
       • Infecteerde 200,000+ computers wereldwijd
       • Patch beschikbaar VOOR WannaCry (maar niet toegepast!)

    [*] BlueKeep (CVE-2019-0708):
       • Windows RDP (Remote Desktop) kwetsbaarheid
       • Pre-authentication (geen credentials nodig!)
       • Wormable (kan zich automatisch verspreiden)
       • 1 miljoen+ kwetsbare systemen gevonden

    [*] Log4Shell (CVE-2021-44228):
       • Java Log4j vulnerability
       • CVSS score 10.0 (maximum)
       • Miljoenen applicaties kwetsbaar
       • Remote Code Execution via log entry
       • Metasploit module beschikbaar binnen 24 uur

PAYLOAD TYPES
    [→] Reverse Shell:
       • Victim verbindt NAAR aanvaller
       • Bypasses firewall (outbound meestal open)
       • Meest gebruikte payload type

    [→] Bind Shell:
       • Aanvaller verbindt NAAR victim
       • Victim moet port open hebben
       • Makkelijker te blokkeren

    [→] Meterpreter:
       • Advanced payload (Metasploit specifiek)
       • Resides in memory (geen disk writes)
       • Post-exploitation modules (screenshots, keylogging)
       • Process migration
       • Encrypted communication

REAL-WORLD USE CASES
    [✓] Authorized penetration testing:
       • Red team operations (simulate attackers)
       • Vulnerability assessment
       • Security audits
       • Compliance testing (PCI-DSS, HIPAA)

    [✓] Security research:
       • CVE development (responsible disclosure)
       • Exploit proof-of-concepts
       • Security training/certifications (OSCP, CEH)

    [✓] Incident response:
       • Forensics (understand how breach happened)
       • Remediation testing (verify patches work)

    [X] Illegal uses:
       • Unauthorized access
       • Data theft
       • Ransomware deployment
       • Botnet creation
       • Corporate espionage

    In Nederland strafbaar als computervredebreuk (art. 138ab Sr).

DEFENSE STRATEGIES
[###] Patch Management (KRITIEK!):
        - Automated patch deployment (WSUS, SCCM)
        - Vulnerability scanning (Nessus, OpenVAS)
        - Patch within 30 days (critical vulns: 7 days)
        - Virtual patching (IPS rules als patch niet mogelijk)

[###] Attack Surface Reduction:
        - Disable unnecessary services (SMB, RDP, Telnet)
        - Firewall rules (default deny)
        - Network segmentation (VLANs, DMZs)
        - Least privilege (users niet admin)

[###] Detection & Response:
        - IDS/IPS (Snort, Suricata)
        - EDR (Endpoint Detection & Response)
        - SIEM (Security Information & Event Management)
        - Network monitoring (anomaly detection)

[###] Hardening:
        - Disable SMBv1 (EternalBlue vector)
        - Strong authentication (no default creds)
        - Application whitelisting
        - DEP/ASLR enabled (exploit mitigation)

LEARNING RESOURCES
    [ = ] Hands-on practice (LEGAL):
       • Metasploitable (intentionally vulnerable VM)
       • HackTheBox (online pentesting labs)
       • TryHackMe (guided learning paths)
       • VulnHub (downloadable vulnerable VMs)
       • DVWA (Damn Vulnerable Web Application)

    [^] Certifications:
       • OSCP (Offensive Security Certified Professional)
       • CEH (Certified Ethical Hacker)
       • GPEN (GIAC Penetration Tester)

    [ = ] Books:
       • "Metasploit: The Penetration Tester's Guide"
       • "The Hacker Playbook" series
       • "Penetration Testing" by Georgia Weidman

WHY ATTACKERS WIN
    [?] Defender's dilemma:
       • Defender moet ALLES beveiligen
       • Attacker hoeft MAAR ÉÉN kwetsbaarheid te vinden
       • Exploits worden geautomatiseerd (Metasploit)
       • Patches worden vertraagd ("if it ain't broke...")

    Statistieken:
       • 60% van breaches gebruikt bekende vulns met patches
       • Gemiddelde tijd tot patch: 100+ dagen
       • Gemiddelde tijd voor exploit: 15 dagen na disclosure
       • Window of vulnerability: 85 dagen

    Conclusie: Patch sneller dan aanvallers exploiteren!

GERELATEERDE COMMANDO'S
    nmap, hydra, sqlmap, nikto, hashcat

[TIP] Wil je weten wat legaal is en wat niet?
      Download de Juridische Gids op hacksimulator.nl/gidsen
`.trim()
};
