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

    const warningBox = boxText(warningContent, 'SECURITY WARNING', 60);

    // Metasploit simulation - interactive framework intro
    const output = `${warningBox}


                                   ____________
 [%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%| $a,        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%]
 [%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%| $S\`?a,     |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%]
 [%%%%%%%%%%%%%%%%%%%%__%%%%%%%%%%|       \`?a, |%%%%%%%%__%%%%%%%%%__%%__ %%%%]
 [_ %%%%%%%%%%%%%%%%%%| |%%%%%%%%%|            |%%%%%%| |%%%%%%%%%%| |  | %%%%]
 [%%\\_%%%%%%%%%%%%%%%%%%_/________\\_________/%%%%%__/_/%%%%% ___/%%_/   %%%%]
 [%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%| |%%%%%%   /%%%%%%%%%%]
 [\`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%____|__%%_____/%%%%%%%%%%%]
   \`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

       =[ metasploit v6.3.4-dev                          ]
+ -- --=[ 2344 exploits - 1234 auxiliary - 423 post       ]
+ -- --=[ 1377 payloads - 46 encoders - 11 nops          ]
+ -- --=[ 9 evasion                                       ]

[ ? ] EDUCATIEVE DEMONSTRATIE:

msf6 > use exploit/windows/smb/ms17_010_eternalblue  ← WannaCry exploit
msf6 exploit(ms17_010_eternalblue) > show options

Module options (exploit/windows/smb/ms17_010_eternalblue):

   Name           Current Setting  Required  Description
   ----           ---------------  --------  -----------
   RHOSTS                          yes       Target IP(s)
   RPORT          445              yes       SMB port
   SMBPass                         no        SMB password
   SMBUser                         no        SMB username

msf6 exploit(ms17_010_eternalblue) > set RHOSTS 192.168.1.100
RHOSTS => 192.168.1.100

msf6 exploit(ms17_010_eternalblue) > exploit

[*] Started reverse TCP handler on 192.168.1.50:4444
[*] 192.168.1.100:445 - Connecting to target for exploitation
[*] 192.168.1.100:445 - Target OS: Windows 7 Professional 7601 SP1
[+] 192.168.1.100:445 - Host is vulnerable to MS17-010!  ← Kwetsbaarheid gevonden

[ ! ]  SIMULATIE GESTOPT - Dit is een educatief voorbeeld.

In een echte (geautoriseerde) pentest zou dit:
   1. De kwetsbaarheid exploiteren
   2. Een reverse shell openen
   3. Volledige system toegang geven
   4. Mogelijk privilege escalation

[ > ] METASPLOIT CAPABILITIES:
   • 2300+ exploits (kwetsbaarheden uitbuiten)
   • 1300+ payloads (code die na exploit draait)
   • Auxiliary modules (scanners, fuzzers)
   • Post-exploitation (na toegang: keyloggers, screenshots, etc.)
   • Evasion (antivirus bypass)
   • Encoders (payload obfuscation)

[ = ] FAMOUS EXPLOITS IN METASPLOIT:
   • EternalBlue (MS17-010) - WannaCry ransomware gebruikt dit
   • BlueKeep (CVE-2019-0708) - Windows RDP kwetsbaarheid
   • Log4Shell (CVE-2021-44228) - Java logging kwetsbaarheid
   • Shellshock (CVE-2014-6271) - Bash command injection

[***]  BESCHERMING:
   [ ✓ ] Patch management (update systemen REGELMATIG!)
   [ ✓ ] Vulnerability scanning (detect voor exploit)
   [ ✓ ] Network segmentation (beperk lateral movement)
   [ ✓ ] IDS/IPS (detecteer exploit attempts)
   [ ✓ ] Firewall rules (minimaal attack surface)
   [ ✓ ] Disable unnecessary services (SMB, RDP als niet nodig)

[ ? ] LEERMOMENT:
    De meeste exploits in Metasploit zijn voor OUDE kwetsbaarheden
    met publieke patches. Organisaties worden gehackt omdat ze
    NIET updaten, niet door 0-days.

    WannaCry (2017): Patch was beschikbaar MAANDEN voor aanval.
    Slachtoffers hadden gewoon niet gepatched.

[ ! ]  ETHISCH GEBRUIK:
    [ ✓ ] Eigen lab (VMs, virtuele netwerken)
    [ ✓ ] Penetration testing contract (schriftelijk!)
    [ ✓ ] Bug bounty programs (authorized scope)
    [ ✓ ] CTF competitions (Capture The Flag)
    [ ✓ ] Security training/certificeringen

    [ X ] Ongeautoriseerde systemen scannen/exploiteren
    [ X ] Stolen credentials gebruiken
    [ X ] Malware development voor kwaadaardig gebruik

msf6 > exit

[*] Metasploit simulation ended
`.trim();

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
    [ → ] Wat is een exploit framework?
       Een verzameling tools en exploits voor het systematisch testen
       van systeem beveiliging. Metasploit automatiseert het exploit proces.

    [ ? ] Framework componenten:
       • **Exploits**: Code die kwetsbaarheden uitbuit (2300+)
       • **Payloads**: Code die na exploit draait (shell, meterpreter)
       • **Auxiliary**: Scanners, fuzzers, denial of service
       • **Encoders**: Obfuscate payloads (antivirus evasion)
       • **Post-exploitation**: Keyloggers, screenshot, webcam, etc.

    [ ~ ] Exploit workflow:
       1. Reconnaissance (nmap, vulnerability scanning)
       2. Vulnerability identification (matching exploits)
       3. Exploit selection (search metasploit database)
       4. Payload configuration (reverse shell, bind shell)
       5. Exploitation (run exploit)
       6. Post-exploitation (privilege escalation, persistence)
       7. Lateral movement (compromise more systems)

FAMOUS EXPLOITS
    [ * ] EternalBlue (MS17-010):
       • NSA exploit, leaked door Shadow Brokers (2017)
       • Exploits Windows SMB vulnerability
       • Gebruikt door WannaCry en NotPetya ransomware
       • Infecteerde 200,000+ computers wereldwijd
       • Patch beschikbaar VOOR WannaCry (maar niet toegepast!)

    [ * ] BlueKeep (CVE-2019-0708):
       • Windows RDP (Remote Desktop) kwetsbaarheid
       • Pre-authentication (geen credentials nodig!)
       • Wormable (kan zich automatisch verspreiden)
       • 1 miljoen+ kwetsbare systemen gevonden

    [ * ] Log4Shell (CVE-2021-44228):
       • Java Log4j vulnerability
       • CVSS score 10.0 (maximum)
       • Miljoenen applicaties kwetsbaar
       • Remote Code Execution via log entry
       • Metasploit module beschikbaar binnen 24 uur

PAYLOAD TYPES
    [ → ] Reverse Shell:
       • Victim verbindt NAAR aanvaller
       • Bypasses firewall (outbound meestal open)
       • Meest gebruikte payload type

    [ → ] Bind Shell:
       • Aanvaller verbindt NAAR victim
       • Victim moet port open hebben
       • Makkelijker te blokkeren

    [ → ] Meterpreter:
       • Advanced payload (Metasploit specifiek)
       • Resides in memory (geen disk writes)
       • Post-exploitation modules (screenshots, keylogging)
       • Process migration
       • Encrypted communication

REAL-WORLD USE CASES
    [ ✓ ] Authorized penetration testing:
       • Red team operations (simulate attackers)
       • Vulnerability assessment
       • Security audits
       • Compliance testing (PCI-DSS, HIPAA)

    [ ✓ ] Security research:
       • CVE development (responsible disclosure)
       • Exploit proof-of-concepts
       • Security training/certifications (OSCP, CEH)

    [ ✓ ] Incident response:
       • Forensics (understand how breach happened)
       • Remediation testing (verify patches work)

    [ X ] Illegal uses:
       • Unauthorized access
       • Data theft
       • Ransomware deployment
       • Botnet creation
       • Corporate espionage

    Straf: Tot 10 jaar gevangenis (Federal Computer Fraud Act)

DEFENSE STRATEGIES
    [***]  Patch Management (KRITIEK!):
       [ ✓ ] Automated patch deployment (WSUS, SCCM)
       [ ✓ ] Vulnerability scanning (Nessus, OpenVAS)
       [ ✓ ] Patch within 30 days (critical vulns: 7 days)
       [ ✓ ] Virtual patching (IPS rules als patch niet mogelijk)

    [***]  Attack Surface Reduction:
       [ ✓ ] Disable unnecessary services (SMB, RDP, Telnet)
       [ ✓ ] Firewall rules (default deny)
       [ ✓ ] Network segmentation (VLANs, DMZs)
       [ ✓ ] Least privilege (users niet admin)

    [***]  Detection & Response:
       [ ✓ ] IDS/IPS (Snort, Suricata)
       [ ✓ ] EDR (Endpoint Detection & Response)
       [ ✓ ] SIEM (Security Information & Event Management)
       [ ✓ ] Network monitoring (anomaly detection)

    [***]  Hardening:
       [ ✓ ] Disable SMBv1 (EternalBlue vector)
       [ ✓ ] Strong authentication (no default creds)
       [ ✓ ] Application whitelisting
       [ ✓ ] DEP/ASLR enabled (exploit mitigation)

LEARNING RESOURCES
    [ = ] Hands-on practice (LEGAL):
       • Metasploitable (intentionally vulnerable VM)
       • HackTheBox (online pentesting labs)
       • TryHackMe (guided learning paths)
       • VulnHub (downloadable vulnerable VMs)
       • DVWA (Damn Vulnerable Web Application)

    [ ^ ] Certifications:
       • OSCP (Offensive Security Certified Professional)
       • CEH (Certified Ethical Hacker)
       • GPEN (GIAC Penetration Tester)

    [ = ] Books:
       • "Metasploit: The Penetration Tester's Guide"
       • "The Hacker Playbook" series
       • "Penetration Testing" by Georgia Weidman

WHY ATTACKERS WIN
    [ ? ] Defender's dilemma:
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
`.trim()
};
