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
- *Tijdsindicatie:* Hoeveel uur je ongeveer kwijt bent
- *Zelftest:* twee delen --- zie hieronder

== De zelftest: waarom hij anders werkt dan je gewend bent

De meeste cursussen sluiten een hoofdstuk af met "begrijp je dit?". Daar kun je "ja" op antwoorden
zonder het te begrijpen, en dat doet vrijwel iedereen --- niet uit oneerlijkheid, maar omdat
*herkennen* precies hetzelfde voelt als *weten*. Pas als je iets moet uitleggen zonder de tekst
erbij, merk je het verschil.

Daarom bestaat de zelftest hier uit twee delen:

/ Gedaan?: Vinkjes voor dingen die je feitelijk hebt gedaan --- drie rooms afgerond, Burp
  geïnstalleerd. Daar is niets aan te interpreteren.
/ Begrepen?: Open vragen met een echt antwoord. Je schrijft je antwoord *eerst op*, en kijkt
  daarna pas in de antwoordsleutel achterin. Die volgorde is het hele punt: lees je het antwoord
  eerst, dan test je niets meer.

Het gaat om de kern, niet om de formulering. Heb je hetzelfde bedoeld in andere woorden, dan is het
goed. Haal je de drempel niet, dan is dat geen falen maar informatie: die week is nog niet klaar.

#tip[Dit is geen race. Als een week twee weken duurt, is dat prima. Het gaat om begrip, niet om snelheid. Een week overdoen kost je een paar uur; een gat in je fundering kost je later een maand.]

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

_Gedaan? Vink af:_
- [ ] Kun je met `cd` en `ls` door mappen navigeren zonder te twijfelen?
- [ ] Kun je een bestand aanmaken, kopiëren en verwijderen?

_Begrepen? Beantwoord uit je hoofd en schrijf het op. Kijk pas daarna in de antwoordsleutel achterin._
+ Je staat in `/home/hacker/documents`. Met welk commando ga je één map omhoog, en met welk commando ga je in één keer naar de root van het systeem?
+ Je geeft `cat etc/passwd` en krijgt een foutmelding, terwijl `cat /etc/passwd` wél werkt. Waarom?
+ `rm notes.txt` zegt "No such file or directory". Noem twee commando's waarmee je uitzoekt wat er wél staat.

#tip[Minstens 2 van de 3 in de kern goed? Door naar de volgende week. Minder? Herhaal deze week --- dat kost je nu een paar uur en anders straks een maand.]

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

_Gedaan? Vink af:_
- [ ] Kun je uitleggen wat een IP-adres is aan een vriend die niks van computers weet?

_Begrepen? Beantwoord uit je hoofd en schrijf het op. Kijk pas daarna in de antwoordsleutel achterin._
+ Een server antwoordt niet op `ping`, maar de website laadt gewoon. Geef één verklaring.
+ Welke poortnummers horen bij HTTP en HTTPS, en wat betekent dat verschil voor iemand die het netwerkverkeer meeleest?
+ Wat is het verschil tussen een adres als `192.168.1.10` en een publiek IP-adres?

#tip[Minstens 2 van de 3 in de kern goed? Door naar de volgende week. Minder? Herhaal deze week --- dat kost je nu een paar uur en anders straks een maand.]

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
  [SQL], [De taal waarmee databases bevraagd worden], [SQL injection = een van de bekendste web-aanvallen],
  [Cookie], [Klein bestandje dat je browser opslaat], [Session hijacking als cookie gestolen wordt],
  [HTTPS], [Versleutelde versie van HTTP], [Zonder HTTPS kan verkeer afgeluisterd worden],
)

*Zelftest:*

_Gedaan? Vink af:_
- [ ] Kun je in de Developer Tools zien welke requests je browser maakt naar een website?

_Begrepen? Beantwoord uit je hoofd en schrijf het op. Kijk pas daarna in de antwoordsleutel achterin._
+ Je ziet in het Network-tabblad een response met statuscode 302. Wat betekent die code?
+ Waarom is `' OR '1'='1` gevaarlijk als invoer in een inlogformulier? Leg uit wat er met de database-query gebeurt.
+ Een formulier controleert met JavaScript of je wachtwoord lang genoeg is. Waarom is dat géén beveiliging?

#tip[Minstens 2 van de 3 in de kern goed? Door naar de volgende week. Minder? Herhaal deze week --- dat kost je nu een paar uur en anders straks een maand.]

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

_Begrepen? Beantwoord uit je hoofd en schrijf het op. Kijk pas daarna in de antwoordsleutel achterin._
+ Noem de drie voorwaarden die het Openbaar Ministerie hanteert om hacken niet-wederrechtelijk te noemen.
+ Je vindt per ongeluk een open database met klantgegevens. Noem drie dingen die je vanaf dat moment níét meer mag doen.
+ Een klant zegt door de telefoon: "ga je gang, test onze server maar". Waarom is dat onvoldoende?

#tip[Minstens 2 van de 3 in de kern goed? Door naar de volgende week. Minder? Herhaal deze week --- dat kost je nu een paar uur en anders straks een maand.]

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

_Gedaan? Vink af:_
- [ ] Heb je minimaal 3 TryHackMe rooms afgerond?
- [ ] Kun je verbinding maken met een TryHackMe machine (via browser of VPN)?

_Begrepen? Beantwoord uit je hoofd en schrijf het op. Kijk pas daarna in de antwoordsleutel achterin._
+ Waarom werk je op TryHackMe via een VPN of een browser-VM, in plaats van rechtstreeks vanaf je eigen laptop?
+ Je krijgt een doel-IP toegewezen dat begint met `10.10.`. Wat zegt dat over waar die machine staat?

#tip[Minstens 2 van de 2 in de kern goed? Door naar de volgende week. Minder? Herhaal deze week --- dat kost je nu een paar uur en anders straks een maand.]

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

_Begrepen? Beantwoord uit je hoofd en schrijf het op. Kijk pas daarna in de antwoordsleutel achterin._
+ Wat is het verschil tussen een SYN-scan (`-sS`) en een connect-scan (`-sT`)?
+ Nmap meldt een poort als `filtered` in plaats van `closed`. Wat is het verschil?
+ Je vindt poort 22 open op een doelwit van een klant. Welke vervolgstap mag je pas zetten als die expliciet in de opdracht staat?

#tip[Minstens 2 van de 3 in de kern goed? Door naar de volgende week. Minder? Herhaal deze week --- dat kost je nu een paar uur en anders straks een maand.]

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
  [A08], [Software or Data Integrity Failures], [Ongecontroleerde updates of data-manipulatie],
  [A09], [Security Logging and Alerting Failures], [Aanvallen worden niet gedetecteerd of gemeld],
  [A10], [Mishandling of Exceptional Conditions], [Onverwachte situaties worden slecht afgehandeld],
)

*Zelftest:*

_Gedaan? Vink af:_
- [ ] Heb je Burp Suite geïnstalleerd en een HTTP request onderschept?

_Begrepen? Beantwoord uit je hoofd en schrijf het op. Kijk pas daarna in de antwoordsleutel achterin._
+ Wat doet de proxy van Burp Suite precies, technisch gezien?
+ Noem vijf categorieën uit de OWASP Top 10.
+ Wat is het verschil tussen reflected en stored XSS, en waarom is de tweede meestal ernstiger?

#tip[Minstens 2 van de 3 in de kern goed? Door naar de volgende week. Minder? Herhaal deze week --- dat kost je nu een paar uur en anders straks een maand.]

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

_Begrepen? Beantwoord uit je hoofd en schrijf het op. Kijk pas daarna in de antwoordsleutel achterin._
+ Wat is een SUID-bestand, en waarom kan het een risico zijn?
+ Noem drie manieren waarop privilege escalation op Linux kan werken.
+ Waarom is `/etc/shadow` voor een aanvaller interessanter dan `/etc/passwd`?

#tip[Minstens 2 van de 3 in de kern goed? Door naar de volgende week. Minder? Herhaal deze week --- dat kost je nu een paar uur en anders straks een maand.]

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

_Gedaan? Vink af:_
- [ ] Heb je minimaal 5 picoCTF challenges opgelost?

_Begrepen? Beantwoord uit je hoofd en schrijf het op. Kijk pas daarna in de antwoordsleutel achterin._
+ Decodeer `aGFja2Vy`. Om welke codering gaat het, en wat staat er?
+ Noem drie plekken in een webpagina waar een flag kan staan zonder dat een bezoeker hem ziet.

#tip[Minstens 2 van de 2 in de kern goed? Door naar de volgende week. Minder? Herhaal deze week --- dat kost je nu een paar uur en anders straks een maand.]

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

_Gedaan? Vink af:_
- [ ] Heb je minimaal 1 Starting Point machine volledig gehackt (user + root flag)?
- [ ] Heb je minimaal 3 HackTheBox machines afgerond?

_Begrepen? Beantwoord uit je hoofd en schrijf het op. Kijk pas daarna in de antwoordsleutel achterin._
+ Wat is het verschil tussen de user-flag en de root-flag op een HackTheBox-machine?
+ De methodologie is recon → scan → exploit → post-exploit. Waarom is die laatste fase een aparte stap, en niet gewoon het einde van de exploit?

#tip[Minstens 2 van de 2 in de kern goed? Door naar de volgende week. Minder? Herhaal deze week --- dat kost je nu een paar uur en anders straks een maand.]

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

_Reflectie --- hier is geen antwoordsleutel voor. Het punt is dat je het opschrijft._
+ Schrijf op: welk onderdeel gaat je het slechtst af, en welke concrete oefening ga je deze week doen om daaraan te werken? (Geen goed of fout — maar schrijf het echt op.)
+ Pak een challenge die je eerder oploste. Kun je nu, zonder notities, uitleggen wáárom je oplossing werkte?

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

_Gedaan? Vink af:_
- [ ] Heb je meegedaan aan een CTF-event (of een vergelijkbare challenge)?
- [ ] Heb je minimaal 1 flag gevonden?
- [ ] Heb je na afloop writeups gelezen van challenges die je niet had opgelost?

_Reflectie --- hier is geen antwoordsleutel voor. Het punt is dat je het opschrijft._
+ Kies één challenge die je niet opgelost kreeg. Wat was de stap die je miste — en had je die met meer tijd gevonden, of ontbrak er kennis? (Geen goed of fout, maar wees eerlijk: dit bepaalt wat je hierna leert.)

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

= Antwoordsleutel

Kijk hier pas ná het opschrijven van je eigen antwoord. Dat voelt omslachtig, maar het is precies
waarom deze sleutel bestaat: als je eerst het antwoord leest, herkén je het --- en herkennen voelt
hetzelfde als weten, terwijl het dat niet is.

Het gaat om de *kern*, niet om de formulering. Heb je hetzelfde bedoeld met andere woorden, dan is
het goed.

== Week 1 --- De terminal

+ `cd ..` gaat één map omhoog (naar `/home/hacker`); `cd /` gaat naar de root van het systeem. Ook goed: `cd /home/hacker` --- dat is hetzelfde punt via een absoluut pad.
+ `/etc/passwd` is een *absoluut* pad: het begint bij de root en wijst altijd naar dezelfde plek. `etc/passwd` is *relatief*: het zoekt een map `etc` in je huidige map. Die bestaat daar niet, dus je krijgt een fout.
+ `ls` toont wat er in je huidige map staat, `pwd` toont waar je bent. Ook goed: `find` om verderop te zoeken. De kern: bij "bestaat niet" ga je eerst kíjken, niet raden.

== Week 2 --- Netwerken

+ `ping` gebruikt ICMP, en veel firewalls blokkeren dat terwijl ze poort 80 en 443 gewoon openlaten. Geen antwoord op ping betekent dus níét dat de server offline is.
+ HTTP is poort 80, HTTPS is poort 443. Verkeer over 80 is onversleuteld en dus leesbaar voor wie op het netwerk meekijkt; 443 is versleuteld met TLS, waardoor een meelezer alleen ziet met wélke server je praat, niet wat er over en weer gaat.
+ `192.168.1.10` is een privé-adres: het is alleen binnen een lokaal netwerk routeerbaar en bestaat duizenden keren tegelijk op de wereld. Een publiek IP is uniek op internet en van buitenaf bereikbaar.

== Week 3 --- Hoe websites werken

+ 302 is een *redirect*: de server zegt "wat je zoekt staat ergens anders" en geeft in de `Location`-header de nieuwe URL. Je browser volgt die automatisch, waardoor je in het Network-tabblad vaak twee requests achter elkaar ziet.
+ De invoer wordt in de SQL-query geplakt. De voorwaarde wordt dan iets als `WHERE naam = '' OR '1'='1'`. Omdat `'1'='1'` altijd waar is, is de hele voorwaarde altijd waar en geeft de query een rij terug --- zonder dat je het wachtwoord kent. De oorzaak is dat invoer als *code* wordt behandeld in plaats van als *data*; prepared statements lossen dat op.
+ Alles wat in de browser draait, draait op de computer van de gebruiker --- en die kan het uitzetten, aanpassen of het request rechtstreeks versturen. Client-side validatie is een gebruiksgemak-functie. De echte controle hoort op de server, want dat is de enige plek die de aanvaller niet beheert.

== Week 4 --- Wet en ethiek

+ Zwaarwegend maatschappelijk belang, proportionaliteit en subsidiariteit. Let op: ook als je aan alle drie voldoet is dat géén garantie op immuniteit --- het OM kan alsnog vervolgen.
+ Niet verder doorzoeken dan nodig om het probleem aan te tonen; geen gegevens kopiëren of downloaden; niets wijzigen in het systeem; niet publiceren voordat het is opgelost. Juist dat "even verder kijken of het echt zo erg is" is wat mensen hun zaak kost.
+ Mondelinge toestemming is geen bewijs. Toestemming hoort schriftelijk, vooraf en concreet afgebakend te zijn: wélke systemen, in welke periode, met welke technieken. Zonder die afbakening is "ga je gang" juridisch waardeloos zodra er iets misgaat.

== Week 5 --- TryHackMe

+ Je scheidt de oefenomgeving van je eigen netwerk en je eigen bestanden. Een VPN of browser-VM zorgt dat je alleen bij de machines kunt die daarvoor bedoeld zijn --- en dat een kwetsbare oefenmachine niet bij jóuw spullen kan.
+ `10.x.x.x` is een privé-bereik: die machine staat in het interne lab-netwerk waar je via de VPN aan hangt, niet ergens op het open internet.

== Week 6 --- Nmap en scanning

+ Een SYN-scan (`-sS`) stuurt een SYN, wacht op het antwoord en maakt de handshake bewust níét af. Dat is sneller en valt minder op in logs, maar vraagt verhoogde rechten. Een connect-scan (`-sT`) laat het besturingssysteem een volledige verbinding opzetten: werkt zonder extra rechten, maar is trager en komt vaker in de logs terecht.
+ `closed` betekent dat de host actief antwoordde dat er niets luistert (een RST). `filtered` betekent dat er géén bruikbaar antwoord kwam --- meestal omdat een firewall het pakket laat vallen. Bij `closed` weet je iets over de host; bij `filtered` weet je vooral iets over wat ertussen zit.
+ Inloggen of het wachtwoord brute-forcen. Een open poort vinden mag binnen de scope; er daadwerkelijk op proberen binnen te komen is een aparte handeling die expliciet in de opdracht moet staan.

== Week 7 --- Web security

+ Burp zet zichzelf als tussenstation tussen je browser en de server. Je browser stuurt zijn requests naar Burp, Burp houdt ze vast zodat jij ze kunt bekijken en aanpassen, en stuurt ze dan pas door. Voor HTTPS gebruikt Burp een eigen certificaat, dat je daarom in je browser moet vertrouwen.
+ Vijf uit de OWASP Top 10 (2021): Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable and Outdated Components, Identification and Authentication Failures, Software and Data Integrity Failures, Security Logging and Monitoring Failures, Server-Side Request Forgery.
+ Bij *reflected* XSS zit de kwaadaardige code in het request en komt hij in het antwoord terug --- het slachtoffer moet dus een geprepareerde link openen. Bij *stored* XSS staat de code opgeslagen op de server (in een reactie, profiel of bericht) en krijgt iedere bezoeker hem geserveerd. Stored is daarom meestal ernstiger: er is geen link nodig en het bereik is veel groter.

== Week 8 --- Linux en privilege escalation

+ Een SUID-bestand draait met de rechten van de *eigenaar* in plaats van die van de gebruiker die het start. Staat SUID op een programma van root, dan draait dat programma als root --- ook als jij een gewone gebruiker bent. Zit er een fout in dat programma, of kun je het misbruiken om een shell te openen, dan heb je rootrechten.
+ Bijvoorbeeld: misbruik van SUID-binaries; te ruime `sudo`-rechten; een cron-job die een script draait waar jij in mag schrijven; een verouderde kernel met een bekende exploit; wachtwoorden of sleutels die in leesbare bestanden of in de history staan.
+ `/etc/passwd` bevat accountinformatie en is voor iedereen leesbaar, maar de wachtwoord-hashes staan er al lang niet meer in. Die staan in `/etc/shadow`, dat alleen root mag lezen. Kun je `/etc/shadow` lezen, dan heb je materiaal om offline te kraken --- en dan ben je meestal al root.

== Week 9 --- CTF-challenges

+ Base64. `aGFja2Vy` decodeert naar `hacker`. Herkenningspunt: alleen letters, cijfers, `+` en `/`, vaak met `=` als opvulling aan het eind, en de lengte is een veelvoud van vier.
+ Bijvoorbeeld: in een HTML-comment; in de broncode van een JavaScript-bestand; in een verborgen formulierveld; in een HTTP-response-header; in `robots.txt` of een ander bestand dat niet vanaf de pagina gelinkt is.

== Week 10 --- HackTheBox

+ De user-flag krijg je zodra je als gewone gebruiker binnen bent --- meestal via een kwetsbare dienst. De root-flag vraagt een extra stap: privilege escalation van die gebruiker naar root. Twee flags betekent dus twee verschillende soorten werk.
+ Post-exploitation beantwoordt de vraag waar het een opdrachtgever écht om gaat: wat kan een aanvaller hierna bereiken? Toegang houden, verder het netwerk in bewegen, bij welke data komen. Zonder die fase lever je "ik kwam binnen" op; mét die fase lever je een inschatting van de werkelijke schade --- en dat is wat een rapport waard maakt.

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
