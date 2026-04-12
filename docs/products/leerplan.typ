// Van Nul naar CTF: 12-Weken Leerplan — HackSimulator.nl
// Compileer: typst compile leerplan.typ
#import "template.typ": *

#show: hacksimulator-doc.with(
  title: "Van Nul naar CTF",
  subtitle: "12-Weken Leerplan voor Ethisch Hacken — Een gestructureerd pad van complete beginner naar je eerste Capture The Flag",
  version: "1.0",
  date: "april 2026",
)

// ─────────────────────────────────────────────

= Over dit leerplan

Er zijn duizenden cybersecurity-resources online. YouTube-video's, cursussen, blogs, tools, certificeringen --- het is overweldigend. De meeste beginners verdrinken niet in gebrek aan informatie, maar in een overvloed ervan.

Dit leerplan lost dat probleem op. Je krijgt *precies één ding per week* om te doen, in de juiste volgorde, met duidelijke doelen. Na 12 weken kun je deelnemen aan je eerste CTF-competitie en een bewuste keuze maken over je volgende stap.

== Wat je nodig hebt om te beginnen

- Een computer met internetverbinding (Windows, Mac of Linux)
- Een webbrowser (Chrome, Firefox of Edge)
- 5-8 uur per week beschikbaar
- Geen voorkennis --- we beginnen echt bij nul

== Hoe dit leerplan werkt

Elke week heeft:
- *Doel:* Wat je aan het einde van de week kunt
- *Activiteiten:* Wat je concreet doet
- *Zelftest:* Vragen om te checken of je klaar bent voor de volgende week
- *Tijdsindicatie:* Hoeveel uur je ongeveer kwijt bent

#tip[Dit is geen race. Als een week twee weken duurt, is dat prima. Het gaat om begrip, niet om snelheid.]

// ─────────────────────────────────────────────

= Fase 1: Fundering (Week 1-4)

== Week 1: De Terminal Leren Kennen

*Doel:* Je bent comfortabel met het typen van commands in een terminal.\
*Tijd:* 4-5 uur

*Activiteiten:*
+ Start HackSimulator.nl en doorloop *Fase 1: Terminal Basics*
  - Oefen: `help`, `ls`, `cd`, `pwd`, `cat`, `whoami`, `history`
  - Begrijp: een terminal is een tekstgebaseerde interface waarmee je direct met een computer communiceert --- sneller en krachtiger dan klikken
+ Doorloop *Fase 2: File Manipulation*
  - Oefen: `mkdir`, `touch`, `rm`, `cp`, `mv`, `echo`
  - Begrijp: bestanden en mappen zijn de basis van elk computersysteem
+ Typ `leerpad` in HackSimulator om je voortgang te zien

*Zelftest:*
- [ ] Kun je met `cd` en `ls` door mappen navigeren zonder te twijfelen?
- [ ] Kun je een bestand aanmaken, kopiëren en verwijderen?
- [ ] Weet je het verschil tussen een absoluut pad (`/home/user`) en een relatief pad (`../documents`)?

// ─────────────────────────────────────────────

== Week 2: Netwerken — De Basis

*Doel:* Je begrijpt hoe computers met elkaar communiceren.\
*Tijd:* 5-6 uur

*Activiteiten:*
+ Doorloop *Fase 3: Reconnaissance* in HackSimulator
  - Oefen: `ping`, `nmap`, `ifconfig`, `netstat`, `whois`, `traceroute`
+ Lees de blogpost "Terminal Commands voor Beginners" op HackSimulator.nl/blog
+ Begrippen die je deze week moet kennen:

#table(
  columns: (auto, 2fr, 1fr),
  [*Begrip*], [*Wat het is*], [*Voorbeeld*],
  [IP-adres], [Het "huisadres" van een computer op een netwerk], [`192.168.1.100`],
  [Poort], [Een "deur" naar een specifieke service op een computer], [Poort 80 = webserver],
  [Protocol], [De "taal" die computers gebruiken om te communiceren], [HTTP, SSH, FTP],
  [DNS], [Het "telefoonboek" van het internet: vertaalt namen naar IP-adressen], [google.nl → 142.250.74.99],
  [Firewall], [Een digitale poortwachter die verkeer filtert], [Blokkeert ongewenste verbindingen],
)

*Zelftest:*
- [ ] Kun je uitleggen wat een IP-adres is aan een vriend die niks van computers weet?
- [ ] Weet je wat het verschil is tussen poort 80 (HTTP) en poort 443 (HTTPS)?
- [ ] Begrijp je waarom `ping` de eerste stap is bij het testen van een verbinding?

// ─────────────────────────────────────────────

== Week 3: Hoe Websites Werken

*Doel:* Je begrijpt de technologie achter websites en waar kwetsbaarheden ontstaan.\
*Tijd:* 5-6 uur

*Activiteiten:*
+ Leer de basis van HTTP:
  - Wat is een HTTP request? (GET, POST)
  - Wat zijn HTTP status codes? (200 = OK, 404 = niet gevonden, 500 = serverfout)
  - Wat zijn headers? (metadata over het verzoek)
+ Open de Developer Tools in je browser (F12) en bekijk:
  - Het *Network* tabblad --- zie alle requests die je browser maakt
  - Het *Elements* tabblad --- de HTML-code van de pagina
  - Het *Console* tabblad --- JavaScript errors en output
+ Lees de blogpost "SQL Injection Uitgelegd" op HackSimulator.nl/blog

#table(
  columns: (auto, 2fr, 2fr),
  [*Begrip*], [*Wat het is*], [*Waarom relevant voor security*],
  [HTML], [De structuur van een webpagina], [XSS-aanvallen injecteren kwaadaardige HTML],
  [JavaScript], [De programmeertaal van de browser], [Kan gebruikt worden voor XSS en data-extractie],
  [SQL], [De taal waarmee databases bevraagd worden], [SQL injection = meest voorkomende web-aanval],
  [Cookie], [Klein bestandje dat je browser opslaat], [Session hijacking als cookie gestolen wordt],
  [HTTPS], [Versleutelde versie van HTTP], [Zonder HTTPS kan verkeer afgeluisterd worden],
)

*Zelftest:*
- [ ] Kun je in de Developer Tools zien welke requests je browser maakt naar een website?
- [ ] Begrijp je waarom `' OR '1'='1` gevaarlijk is als invoer in een formulier?
- [ ] Weet je het verschil tussen client-side (browser) en server-side (server) code?

// ─────────────────────────────────────────────

== Week 4: De Wet & Ethiek

*Doel:* Je weet precies wat wel en niet mag in Nederland.\
*Tijd:* 3-4 uur

*Activiteiten:*
+ Lees de *Juridische Gids van HackSimulator* (apart verkrijgbaar) of de gratis blogpost "Wat is Ethisch Hacken?"
+ Maak jezelf vertrouwd met:
  - *Art. 138ab Sr* --- computervredebreuk (max. 2-4 jaar cel)
  - *Coordinated Vulnerability Disclosure* --- hoe je een lek meldt zonder gearresteerd te worden
  - *De drie voorwaarden* van het OM: maatschappelijk belang, proportionaliteit, subsidiariteit
+ Bekijk het CVD-beleid van het NCSC: ncsc.nl/contact/kwetsbaarheid-melden
+ Zoek 3 Nederlandse organisaties die een bug bounty of responsible disclosure beleid hebben

#warning[Een hele week voor ethiek? Ja. Omdat dit het verschil is tussen een carrière in cybersecurity en een strafblad. Elke professionele ethische hacker zal zeggen: "Begin met de regels, niet met de tools."]

*Zelftest:*
- [ ] Kun je in je eigen woorden uitleggen wanneer hacken wél en wanneer het niet mag?
- [ ] Weet je wat je moet doen als je per ongeluk een kwetsbaarheid vindt?
- [ ] Ken je het verschil tussen een pentest (met contract) en "even kijken of dat slot wel goed zit"?

// ─────────────────────────────────────────────

= Fase 2: Hands-On Oefenen (Week 5-8)

== Week 5: TryHackMe — Eerste Stappen

*Doel:* Je werkt voor het eerst in een echte (virtuele) hack-omgeving.\
*Tijd:* 6-8 uur

*Activiteiten:*
+ Maak een gratis account aan op *tryhackme.com*
+ Start het *"Cyber Security 101"* learning path
  - Dit pad bevat 54 rooms verdeeld over 13 modules
  - Begin met de eerste modules over Linux en networking fundamentals
+ Doe minimaal de eerste 3-4 rooms deze week

*Wat is TryHackMe?*\
Een platform met virtuele machines die je kunt hacken --- legaal. Je krijgt een doelwit-systeem in je browser en stap-voor-stap instructies. Het is als HackSimulator, maar dan met echte (virtuele) systemen in plaats van een simulatie.

#tip[TryHackMe heeft een gratis tier. Je hebt geen betaald abonnement nodig voor de eerste weken.]

*Zelftest:*
- [ ] Heb je minimaal 3 TryHackMe rooms afgerond?
- [ ] Kun je verbinding maken met een TryHackMe machine (via browser of VPN)?
- [ ] Voel je je comfortabel met het lezen van Engelse instructies?

// ─────────────────────────────────────────────

== Week 6: Nmap & Scanning in de Praktijk

*Doel:* Je kunt een netwerk systematisch in kaart brengen.\
*Tijd:* 6-8 uur

*Activiteiten:*
+ Ga verder met TryHackMe --- focus op de networking en scanning rooms
+ Oefen nmap op TryHackMe-machines:
  - Basis scan: `nmap [IP]`
  - Service detection: `nmap -sV [IP]`
  - OS detection: `nmap -O [IP]`
  - Alle poorten: `nmap -p- [IP]`
+ Oefen de output interpreteren --- gebruik de beslisboom uit het Pentest Playbook

*Verschil met HackSimulator:*\
In HackSimulator leer je WAT nmap doet. Op TryHackMe gebruik je nmap op echte systemen en zie je echte output --- inclusief onverwachte resultaten die je zelf moet interpreteren.

*Zelftest:*
- [ ] Kun je een nmap scan uitvoeren en de output interpreteren?
- [ ] Weet je het verschil tussen een SYN scan (-sS) en een connect scan (-sT)?
- [ ] Kun je op basis van open poorten bepalen welke stap je vervolgens neemt?

// ─────────────────────────────────────────────

== Week 7: Web Security Basics

*Doel:* Je kunt veelvoorkomende web-kwetsbaarheden herkennen en testen.\
*Tijd:* 6-8 uur

*Activiteiten:*
+ TryHackMe: doe rooms over web security (OWASP Top 10, Burp Suite basics)
+ Oefen met de OWASP Top 10 (2025 editie):
  - *A01: Broken Access Control* --- kun je pagina's bereiken waar je niet bij zou moeten?
  - *A05: Injection* --- kun je SQL of OS commands injecteren via invoervelden?
  - *A07: Authentication Failures* --- zwakke wachtwoorden, ontbrekende 2FA
+ Installeer *Burp Suite Community Edition* (gratis)

#table(
  columns: (auto, 1fr, 2fr),
  [*\#*], [*Risico*], [*In het kort*],
  [A01], [Broken Access Control], [Je kunt bij data/functies die niet voor jou bedoeld zijn],
  [A02], [Security Misconfiguration], [Verkeerde instellingen (default wachtwoorden, debug aan)],
  [A03], [Software Supply Chain Failures], [Kwetsbare of gecompromitteerde dependencies],
  [A04], [Cryptographic Failures], [Slechte of ontbrekende versleuteling],
  [A05], [Injection], [Kwaadaardige input wordt uitgevoerd],
  [A06], [Insecure Design], [Het ontwerp zelf is onveilig],
  [A07], [Authentication Failures], [Zwakke login-beveiliging],
  [A08], [Software/Data Integrity Failures], [Ongecontroleerde updates of data-manipulatie],
  [A09], [Security Logging Failures], [Aanvallen worden niet gedetecteerd],
  [A10], [Exceptional Conditions], [Onverwachte situaties worden slecht afgehandeld],
)

*Zelftest:*
- [ ] Kun je uitleggen wat SQL injection is en hoe je het voorkomt?
- [ ] Heb je Burp Suite geïnstalleerd en een HTTP request onderschept?
- [ ] Ken je minimaal 5 van de OWASP Top 10 uit je hoofd?

// ─────────────────────────────────────────────

== Week 8: Linux & Privilege Escalation

*Doel:* Je kunt je weg vinden op een Linux-systeem en begrijpt hoe rechten werken.\
*Tijd:* 6-8 uur

*Activiteiten:*
+ TryHackMe: doe de Linux-gerelateerde rooms in Cyber Security 101
+ Oefen privilege escalation concepten:
  - Bekijk `/etc/passwd` en `/etc/shadow` --- begrijp het verschil
  - Zoek SUID-bestanden: `find / -perm -4000 2>/dev/null`
  - Bekijk cron jobs: `cat /etc/crontab`
  - Check sudo-rechten: `sudo -l`
+ Doorloop de *Privilege Escalation tutorial* in HackSimulator voor de theorie

#table(
  columns: (1fr, 1.5fr, 1.5fr),
  [*Vector*], [*Wat het is*], [*Hoe je het vindt*],
  [SUID-bestanden], [Programma's die als root draaien], [`find / -perm -4000`],
  [Cron jobs], [Taken die automatisch (als root) draaien], [`cat /etc/crontab`],
  [Sudo-rechten], [Commands die je als root mag uitvoeren], [`sudo -l`],
  [Wachtwoorden in bestanden], [Credentials in config files of history], [`grep -r "password" /home/`],
  [Kernel exploits], [Kwetsbaarheden in de Linux kernel], [`uname -a` → zoek CVE],
)

*Zelftest:*
- [ ] Kun je het verschil uitleggen tussen een gewone gebruiker en root?
- [ ] Weet je minimaal 3 manieren om privilege escalation te proberen?
- [ ] Kun je een SUID-bestand vinden en uitleggen waarom het een risico kan zijn?

// ─────────────────────────────────────────────

= Fase 3: CTF-Voorbereiding (Week 9-12)

== Week 9: Je Eerste CTF-Uitdagingen

*Doel:* Je lost je eerste Capture The Flag puzzels op.\
*Tijd:* 6-8 uur

*Activiteiten:*
+ Maak een account aan op *picoctf.org* (gratis, door Carnegie Mellon University)
+ Start met de *picoGym* --- permanente oefenproblemen uit vorige competities
+ Begin met de makkelijkste categorie en werk omhoog:
  - *General Skills* --- basis terminal en encoding
  - *Web Exploitation* --- eenvoudige web-kwetsbaarheden
  - *Cryptography* --- basis versleuteling kraken
  - *Forensics* --- verborgen data vinden in bestanden
  - *Reverse Engineering* --- begrijpen hoe programma's werken

#tip[Begin ALTIJD met de challenges met de minste punten (= makkelijkst). Google is je vriend --- zoeken naar technieken is geen valsspelen, het is leren.]

*Zelftest:*
- [ ] Heb je minimaal 5 picoCTF challenges opgelost?
- [ ] Kun je een base64-gecodeerde string decoderen?
- [ ] Heb je een flag gevonden door een webpagina's broncode te bekijken?

// ─────────────────────────────────────────────

== Week 10: HackTheBox — Echte Machines

*Doel:* Je hackt je eerste "echte" machine van begin tot eind.\
*Tijd:* 8-10 uur

*Activiteiten:*
+ Maak een gratis account aan op *hackthebox.com*
+ Start met *Starting Point* --- begeleide machines voor beginners
  - Tier 0: Basis connectiviteit en tools
  - Tier 1: Eerste exploitation-technieken
  - Tier 2: Meer geavanceerde scenario's
+ Gebruik de pentest-methodologie uit het Pentest Playbook

#table(
  columns: (auto, 1fr, 1fr),
  [], [*TryHackMe*], [*HackTheBox*],
  [Stijl], [Geleid, stap-voor-stap], [Zelfstandig, weinig hints],
  [Niveau], [Beginner → Intermediate], [Intermediate → Advanced],
  [Gratis], [Veel gratis rooms], [Starting Point gratis],
  [Beste voor], [Concepten leren], [Vaardigheden testen],
)

*Zelftest:*
- [ ] Heb je minimaal 1 Starting Point machine volledig gehackt (user + root flag)?
- [ ] Heb je de pentest-methodologie (recon → scan → exploit → post-exploit) toegepast?
- [ ] Kun je je aanpak uitleggen aan iemand anders?

// ─────────────────────────────────────────────

== Week 11: Verdieping & Zwakke Punten

*Doel:* Je identificeert je zwakke punten en werkt eraan.\
*Tijd:* 6-8 uur

*Activiteiten:*
+ Reflecteer: welke CTF-categorieën waren het moeilijkst?
+ Doe nog 2-3 HackTheBox Starting Point machines
+ Probeer één "Easy" HackTheBox machine (buiten Starting Point)

#table(
  columns: (1fr, 1.5fr, 1.5fr),
  [*Probleem*], [*Oorzaak*], [*Oplossing*],
  ["Ik weet niet waar ik moet beginnen"], [Geen methodologie], [Gebruik altijd het 6-fasen model],
  ["Nmap output zegt me niks"], [Poorten/services niet herkend], [Print de poorten-referentie uit het Playbook],
  ["Ik vind de kwetsbaarheid niet"], [Te snel opgeven], [Doorloop ELKE open poort systematisch],
  ["Ik kom binnen maar kan geen root krijgen"], [Privilege escalation niet geleerd], [Focus op linPEAS + SUID + sudo -l],
  ["Ik vergeet wat ik heb geleerd"], [Geen aantekeningen], [Start een persoonlijk notitieboek],
)

*Zelftest:*
- [ ] Kun je benoemen wat je grootste zwakte is en hoe je eraan werkt?
- [ ] Heb je minimaal 3 HackTheBox machines afgerond?
- [ ] Durf je een "Easy" machine aan te pakken zonder walkthrough?

// ─────────────────────────────────────────────

== Week 12: Je Eerste Echte CTF

*Doel:* Je doet mee aan een live CTF-competitie.\
*Tijd:* 4-10 uur (afhankelijk van het event)

*Activiteiten:*
+ Zoek een aankomend CTF-event op *ctftime.org* (de internationale CTF-kalender)
  - Filter op: "beginner-friendly" of "entry level"
  - picoCTF (jaarlijks, maart) is ideaal als eerste competitie
+ Doe mee! Je doel is *niet* om te winnen. Je doel is:
  - Minimaal 1 challenge oplossen
  - De ervaring opdoen van een live competitie
  - Leren van de writeups die na afloop worden gepubliceerd
+ Schrijf na afloop op wat je hebt geleerd

#tip[Je lost waarschijnlijk 1-5 challenges op (van de 20-50). Dat is normaal en goed. Na afloop publiceren teams hun oplossingen ("writeups"). Lees ze allemaal --- dat is waar je het meeste leert.]

*Zelftest:*
- [ ] Heb je meegedaan aan een CTF-event (of een vergelijkbare challenge)?
- [ ] Heb je minimaal 1 flag gevonden?
- [ ] Heb je na afloop writeups gelezen van challenges die je niet had opgelost?

// ─────────────────────────────────────────────

= Hoe Nu Verder? — Na De 12 Weken

Gefeliciteerd --- je hebt een fundering gelegd die de meeste beginners nooit bereiken. Nu heb je drie opties:

== Optie A: Meer Oefenen (Gratis)
- Ga verder met TryHackMe paden (SOC Level 1, Jr Penetration Tester)
- Doe mee aan maandelijkse CTF's via ctftime.org
- Hack meer HackTheBox machines (werk naar "Medium" moeilijkheid)

== Optie B: Certificering Halen (Betaald)

Een certificering bewijst aan werkgevers dat je vaardigheden hebt.

#table(
  columns: (1fr, auto, auto, 2fr),
  [*Certificering*], [*Kosten*], [*Niveau*], [*Kenmerken*],
  [CompTIA Security+], [\~\$425], [Instap], [Breed erkend, netwerk + crypto + compliance],
  [eJPT (INE Security)], [\~\$249], [Instap], [100% praktisch examen, specifiek pentesting],
  [OSCP (OffSec)], [\~\$1.749], [Gevorderd], [Gouden standaard, 24-uur praktijkexamen],
  [CEH (EC-Council)], [\~\$2.200+], [Gevorderd], [Corporate erkend, meer theoretisch],
)

#letop[Certificeringsprijzen veranderen regelmatig. Check altijd de actuele prijs op de website van de aanbieder.]

== Optie C: Community Zoeken
- *Hack.lu* --- Europese hacking conferentie
- *Tweakers.net* --- Nederlands techforum met security-subforum
- *Nederlandse CTF-teams* --- zoek op ctftime.org naar teams uit Nederland
- *Meetups* --- zoek "cybersecurity" of "ethisch hacken" op meetup.com

// ─────────────────────────────────────────────

= Weekoverzicht (Tear-out)

#table(
  columns: (auto, 1.5fr, 1.5fr, auto),
  [*Week*], [*Focus*], [*Platform*], [*Uren*],
  [1], [Terminal basics], [HackSimulator], [4-5],
  [2], [Netwerken], [HackSimulator + blog], [5-6],
  [3], [Hoe websites werken], [Browser DevTools + blog], [5-6],
  [4], [Wet & ethiek], [Juridische Gids + NCSC], [3-4],
  [5], [TryHackMe start], [TryHackMe (gratis)], [6-8],
  [6], [Nmap & scanning], [TryHackMe], [6-8],
  [7], [Web security], [TryHackMe + Burp Suite], [6-8],
  [8], [Linux & privilege escalation], [TryHackMe + HackSimulator], [6-8],
  [9], [Eerste CTF-challenges], [picoCTF (gratis)], [6-8],
  [10], [Echte machines hacken], [HackTheBox (gratis)], [8-10],
  [11], [Zwakke punten versterken], [Mix van platforms], [6-8],
  [12], [Eerste live CTF], [ctftime.org event], [4-10],
  [*Totaal*], [], [], [*\~70-90*],
)

// ─────────────────────────────────────────────

= Veelgestelde Vragen

*"Moet ik kunnen programmeren?"*\
Niet om te beginnen. Basiskennis van Python is handig vanaf week 7-8, maar geen vereiste.

*"Heb ik Kali Linux nodig?"*\
Niet voor de eerste 4 weken. Vanaf week 5 kun je TryHackMe's browser-based "Pwnbox" gebruiken.

*"Kan ik dit met een Chromebook?"*\
Ja, tot en met week 4. Vanaf week 5 heb je een browser nodig die TryHackMe's Pwnbox ondersteunt.

*"Is 12 weken genoeg om professioneel ethisch hacker te worden?"*\
Nee. 12 weken is genoeg om een solide basis te leggen en te bepalen of dit iets voor je is. Een professionele ethische hacker heeft typisch 1-2 jaar ervaring + minimaal één certificering.

*"Wat als ik een week oversla?"*\
Pak hem de week erna op. Dit leerplan is geen deadline --- het is een routekaart.

// ─────────────────────────────────────────────

= Bronnen per Week

== Week 1--4: Fundering
- *HackSimulator.nl* --- hacksimulator.nl (terminal basics, netwerken, reconnaissance)
- *HackSimulator Blog* --- hacksimulator.nl/blog (Terminal Commands, SQL Injection, Wat is Ethisch Hacken)
- *Juridische Gids* --- apart verkrijgbaar (week 4: wet & ethiek)
- *NCSC* --- ncsc.nl/contact/kwetsbaarheid-melden (CVD-beleid bekijken)

== Week 5--8: Hands-on oefenen
- *TryHackMe* --- tryhackme.com (gratis tier beschikbaar, vanaf week 5)
- *OWASP Top 10:2025* --- owasp.org/Top10/2025 (week 7: web-kwetsbaarheden)
- *GTFOBins* --- gtfobins.org (week 8: Linux privilege escalation referentie)
- *OverTheWire: Bandit* --- overthewire.org/wargames/bandit (extra Linux-oefeningen)

== Week 9--12: CTF-voorbereiding
- *picoCTF* --- picoctf.org (week 9: volledig gratis, door Carnegie Mellon University)
- *HackTheBox* --- hackthebox.com (week 10: Starting Point gratis)
- *CTFtime* --- ctftime.org (week 12: CTF-kalender voor je eerste competitie)

== Naslagwerk (alle weken)
- *CyberChef* --- gchq.github.io/CyberChef (data encoding/decoding tool)
- *HackTricks* --- hacktricks.wiki (uitgebreide pentest kennisbank)

== Certificeringen (na de 12 weken)
- *CompTIA Security+* --- comptia.org (\~\$425, instap)
- *eJPT* --- ine.com (\~\$249, instap, 100% praktisch)
- *OSCP* --- offsec.com (\~\$1.749, gevorderd)
- *CEH* --- eccouncil.org (\~\$2.200+, gevorderd)

#v(1fr)

#align(center)[
  #line(length: 60%, stroke: 0.5pt + luma(200))
  #v(6pt)
  #text(size: 9pt, fill: luma(140))[
    _Dit leerplan is geschreven voor HackSimulator.nl --- de gratis browser-based terminal simulator voor ethisch hacken._\
    _Versie 1.0 · Met zorg samengesteld en gecontroleerd · april 2026_
  ]
]
