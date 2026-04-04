# Van Nul naar CTF: 12-Weken Leerplan

**Een gestructureerd pad van complete beginner naar je eerste Capture The Flag**

---

## Over dit leerplan

Er zijn duizenden cybersecurity-resources online. YouTube-video's, cursussen, blogs, tools, certificeringen — het is overweldigend. De meeste beginners verdrinken niet in gebrek aan informatie, maar in een overvloed ervan.

Dit leerplan lost dat probleem op. Je krijgt **precies één ding per week** om te doen, in de juiste volgorde, met duidelijke doelen. Na 12 weken kun je deelnemen aan je eerste CTF-competitie en een bewuste keuze maken over je volgende stap.

### Wat je nodig hebt om te beginnen

- Een computer met internetverbinding (Windows, Mac of Linux)
- Een webbrowser (Chrome, Firefox of Edge)
- 5-8 uur per week beschikbaar
- Geen voorkennis — we beginnen echt bij nul

### Hoe dit leerplan werkt

Elke week heeft:
- **Doel:** Wat je aan het einde van de week kunt
- **Activiteiten:** Wat je concreet doet
- **Zelftest:** Vragen om te checken of je klaar bent voor de volgende week
- **Tijdsindicatie:** Hoeveel uur je ongeveer kwijt bent

> **Tip:** Dit is geen race. Als een week twee weken duurt, is dat prima. Het gaat om begrip, niet om snelheid.

---

## Fase 1: Fundering (Week 1-4)

### Week 1: De Terminal Leren Kennen
**Doel:** Je bent comfortabel met het typen van commands in een terminal.
**Tijd:** 4-5 uur

**Activiteiten:**
1. Start HackSimulator.nl en doorloop **Fase 1: Terminal Basics**
   - Oefen: `help`, `ls`, `cd`, `pwd`, `cat`, `whoami`, `history`
   - Begrijp: een terminal is een tekstgebaseerde interface waarmee je direct met een computer communiceert — sneller en krachtiger dan klikken
2. Doorloop **Fase 2: File Manipulation**
   - Oefen: `mkdir`, `touch`, `rm`, `cp`, `mv`, `echo`
   - Begrijp: bestanden en mappen zijn de basis van elk computersysteem
3. Typ `leerpad` in HackSimulator om je voortgang te zien

**Zelftest:**
- [ ] Kun je met `cd` en `ls` door mappen navigeren zonder te twijfelen?
- [ ] Kun je een bestand aanmaken, kopiëren en verwijderen?
- [ ] Weet je het verschil tussen een absoluut pad (`/home/user`) en een relatief pad (`../documents`)?

---

### Week 2: Netwerken — De Basis
**Doel:** Je begrijpt hoe computers met elkaar communiceren.
**Tijd:** 5-6 uur

**Activiteiten:**
1. Doorloop **Fase 3: Reconnaissance** in HackSimulator
   - Oefen: `ping`, `nmap`, `ifconfig`, `netstat`, `whois`, `traceroute`
2. Lees de blogpost "Terminal Commands voor Beginners" op HackSimulator.nl/blog
3. Begrippen die je deze week moet kennen:

| Begrip | Wat het is | Voorbeeld |
|--------|-----------|-----------|
| **IP-adres** | Het "huisadres" van een computer op een netwerk | 192.168.1.100 |
| **Poort** | Een "deur" naar een specifieke service op een computer | Poort 80 = webserver |
| **Protocol** | De "taal" die computers gebruiken om te communiceren | HTTP, SSH, FTP |
| **DNS** | Het "telefoonboek" van het internet: vertaalt namen naar IP-adressen | google.nl → 142.250.74.99 |
| **Firewall** | Een digitale poortwachter die verkeer filtert | Blokkeert ongewenste verbindingen |

**Zelftest:**
- [ ] Kun je uitleggen wat een IP-adres is aan een vriend die niks van computers weet?
- [ ] Weet je wat het verschil is tussen poort 80 (HTTP) en poort 443 (HTTPS)?
- [ ] Begrijp je waarom `ping` de eerste stap is bij het testen van een verbinding?

---

### Week 3: Hoe Websites Werken
**Doel:** Je begrijpt de technologie achter websites en waar kwetsbaarheden ontstaan.
**Tijd:** 5-6 uur

**Activiteiten:**
1. Leer de basis van HTTP:
   - Wat is een HTTP request? (GET, POST)
   - Wat zijn HTTP status codes? (200 = OK, 404 = niet gevonden, 500 = serverfout)
   - Wat zijn headers? (metadata over het verzoek)
2. Open de Developer Tools in je browser (F12) en bekijk:
   - Het **Network** tabblad — zie alle requests die je browser maakt
   - Het **Elements** tabblad — de HTML-code van de pagina
   - Het **Console** tabblad — JavaScript errors en output
3. Lees de blogpost "SQL Injection Uitgelegd" op HackSimulator.nl/blog
4. Begrippen van deze week:

| Begrip | Wat het is | Waarom relevant voor security |
|--------|-----------|-------------------------------|
| **HTML** | De structuur van een webpagina | XSS-aanvallen injecteren kwaadaardige HTML |
| **JavaScript** | De programmeertaal van de browser | Kan gebruikt worden voor XSS en data-extractie |
| **SQL** | De taal waarmee databases bevraagd worden | SQL injection = meest voorkomende web-aanval |
| **Cookie** | Klein bestandje dat je browser opslaat | Session hijacking als cookie gestolen wordt |
| **HTTPS** | Versleutelde versie van HTTP | Zonder HTTPS kan verkeer afgeluisterd worden |

**Zelftest:**
- [ ] Kun je in de Developer Tools zien welke requests je browser maakt naar een website?
- [ ] Begrijp je waarom `' OR '1'='1` gevaarlijk is als invoer in een formulier?
- [ ] Weet je het verschil tussen client-side (browser) en server-side (server) code?

---

### Week 4: De Wet & Ethiek
**Doel:** Je weet precies wat wel en niet mag in Nederland.
**Tijd:** 3-4 uur

**Activiteiten:**
1. Lees de **Juridische Gids van HackSimulator** (apart verkrijgbaar op hacksimulator.nl) of de gratis blogpost "Wat is Ethisch Hacken?"
2. Maak jezelf vertrouwd met:
   - **Art. 138ab Sr** — computervredebreuk (max. 2-4 jaar cel)
   - **Coordinated Vulnerability Disclosure** — hoe je een lek meldt zonder gearresteerd te worden
   - **De drie voorwaarden** van het OM: maatschappelijk belang, proportionaliteit, subsidiariteit
3. Bekijk het CVD-beleid van het NCSC: ncsc.nl/contact/kwetsbaarheid-melden
4. Zoek 3 Nederlandse organisaties die een bug bounty of responsible disclosure beleid hebben

**Waarom een hele week voor ethiek?**

Omdat dit het verschil is tussen een carrière in cybersecurity en een strafblad. Elke professionele ethical hacker die je ooit ontmoet zal zeggen: "Begin met de regels, niet met de tools." Als je de wet niet kent, kun je per ongeluk strafbare feiten plegen — zelfs met goede intenties.

**Zelftest:**
- [ ] Kun je in je eigen woorden uitleggen wanneer hacken wél en wanneer het niet mag?
- [ ] Weet je wat je moet doen als je per ongeluk een kwetsbaarheid vindt?
- [ ] Ken je het verschil tussen een pentest (met contract) en "even kijken of dat slot wel goed zit"?

---

## Fase 2: Hands-On Oefenen (Week 5-8)

### Week 5: TryHackMe — Eerste Stappen
**Doel:** Je werkt voor het eerst in een echte (virtuele) hack-omgeving.
**Tijd:** 6-8 uur

**Activiteiten:**
1. Maak een gratis account aan op **tryhackme.com**
2. Start het **"Cyber Security 101"** learning path
   - Dit pad bevat 54 rooms verdeeld over 13 modules
   - Begin met de eerste modules over Linux en networking fundamentals
3. Doe minimaal de eerste 3-4 rooms deze week

**Wat is TryHackMe?**
Een platform met virtuele machines die je kunt hacken — legaal. Je krijgt een doelwit-systeem in je browser en stap-voor-stap instructies. Het is als HackSimulator, maar dan met echte (virtuele) systemen in plaats van een simulatie.

**Tip:** TryHackMe heeft een gratis tier. Je hebt geen betaald abonnement nodig voor de eerste weken. Sommige rooms zijn premium-only, maar er zijn genoeg gratis rooms om mee te beginnen.

**Zelftest:**
- [ ] Heb je minimaal 3 TryHackMe rooms afgerond?
- [ ] Kun je verbinding maken met een TryHackMe machine (via browser of VPN)?
- [ ] Voel je je comfortabel met het lezen van Engelse instructies? (Tip: gebruik DeepL als vertaalhulp)

---

### Week 6: Nmap & Scanning in de Praktijk
**Doel:** Je kunt een netwerk systematisch in kaart brengen.
**Tijd:** 6-8 uur

**Activiteiten:**
1. Ga verder met TryHackMe — focus op de networking en scanning rooms
2. Oefen nmap op TryHackMe-machines:
   - Basis scan: `nmap [IP]`
   - Service detection: `nmap -sV [IP]`
   - OS detection: `nmap -O [IP]`
   - Alle poorten: `nmap -p- [IP]`
3. Oefen de output interpreteren — gebruik de beslisboom uit het Pentest Playbook:
   - Poort 22 open? → SSH, mogelijk brute force vector
   - Poort 80/443 open? → Webapplicatie, ga door met web scanning
   - Database poort open? → Rode vlag!

**Verschil met HackSimulator:**
In HackSimulator leer je WAT nmap doet. Op TryHackMe gebruik je nmap op echte systemen en zie je echte output — inclusief onverwachte resultaten die je zelf moet interpreteren.

**Zelftest:**
- [ ] Kun je een nmap scan uitvoeren en de output interpreteren?
- [ ] Weet je het verschil tussen een SYN scan (-sS) en een connect scan (-sT)?
- [ ] Kun je op basis van open poorten bepalen welke stap je vervolgens neemt?

---

### Week 7: Web Security Basics
**Doel:** Je kunt veelvoorkomende web-kwetsbaarheden herkennen en testen.
**Tijd:** 6-8 uur

**Activiteiten:**
1. TryHackMe: doe rooms over web security (OWASP Top 10, Burp Suite basics)
2. Oefen met de OWASP Top 10 (2025 editie):
   - **A01: Broken Access Control** — kun je pagina's bereiken waar je niet bij zou moeten?
   - **A05: Injection** — kun je SQL of OS commands injecteren via invoervelden?
   - **A07: Authentication Failures** — zwakke wachtwoorden, ontbrekende 2FA
3. Installeer **Burp Suite Community Edition** (gratis) en leer:
   - HTTP requests onderscheppen
   - Parameters wijzigen
   - Responses analyseren

**OWASP Top 10:2025 — De 10 Grootste Web-Risico's:**

| # | Risico | In het kort |
|---|--------|------------|
| A01 | Broken Access Control | Je kunt bij data/functies die niet voor jou bedoeld zijn |
| A02 | Security Misconfiguration | Verkeerde instellingen (default wachtwoorden, debug aan) |
| A03 | Software Supply Chain Failures | Kwetsbare of gecompromitteerde dependencies |
| A04 | Cryptographic Failures | Slechte of ontbrekende versleuteling |
| A05 | Injection | Kwaadaardige input (SQL, OS commands) wordt uitgevoerd |
| A06 | Insecure Design | Het ontwerp zelf is onveilig, niet alleen de implementatie |
| A07 | Authentication Failures | Zwakke login-beveiliging |
| A08 | Software or Data Integrity Failures | Ongecontroleerde updates of data-manipulatie |
| A09 | Security Logging and Alerting Failures | Aanvallen worden niet gedetecteerd |
| A10 | Mishandling of Exceptional Conditions | Onverwachte situaties worden slecht afgehandeld |

**Zelftest:**
- [ ] Kun je uitleggen wat SQL injection is en hoe je het voorkomt?
- [ ] Heb je Burp Suite geïnstalleerd en een HTTP request onderschept?
- [ ] Ken je minimaal 5 van de OWASP Top 10 uit je hoofd?

---

### Week 8: Linux & Privilege Escalation
**Doel:** Je kunt je weg vinden op een Linux-systeem en begrijpt hoe rechten werken.
**Tijd:** 6-8 uur

**Activiteiten:**
1. TryHackMe: doe de Linux-gerelateerde rooms in Cyber Security 101
2. Oefen privilege escalation concepten:
   - Bekijk `/etc/passwd` en `/etc/shadow` — begrijp het verschil
   - Zoek SUID-bestanden: `find / -perm -4000 2>/dev/null`
   - Bekijk cron jobs: `cat /etc/crontab`
   - Check sudo-rechten: `sudo -l`
3. Doorloop de **Privilege Escalation tutorial** in HackSimulator voor de theorie

**Wat is Privilege Escalation?**
Je hebt toegang als gewone gebruiker, maar je wilt root/admin worden. Dit is een kernvaardigheid bij pentesting — bijna elke CTF-machine vereist het.

**Veelvoorkomende privilege escalation vectoren:**

| Vector | Wat het is | Hoe je het vindt |
|--------|-----------|-----------------|
| **SUID-bestanden** | Programma's die als root draaien | `find / -perm -4000` |
| **Cron jobs** | Taken die automatisch (als root) draaien | `cat /etc/crontab` |
| **Sudo-rechten** | Commands die je als root mag uitvoeren | `sudo -l` |
| **Wachtwoorden in bestanden** | Credentials in config files of history | `grep -r "password" /home/` |
| **Kernel exploits** | Kwetsbaarheden in de Linux kernel zelf | `uname -a` → zoek CVE |

**Zelftest:**
- [ ] Kun je het verschil uitleggen tussen een gewone gebruiker en root?
- [ ] Weet je minimaal 3 manieren om privilege escalation te proberen?
- [ ] Kun je een SUID-bestand vinden en uitleggen waarom het een risico kan zijn?

---

## Fase 3: CTF-Voorbereiding (Week 9-12)

### Week 9: Je Eerste CTF-Uitdagingen
**Doel:** Je lost je eerste Capture The Flag puzzels op.
**Tijd:** 6-8 uur

**Activiteiten:**
1. Maak een account aan op **picoctf.org** (gratis, door Carnegie Mellon University)
2. Start met de **picoGym** — permanente oefenproblemen uit vorige competities
3. Begin met de makkelijkste categorie en werk omhoog:
   - **General Skills** — basis terminal en encoding
   - **Web Exploitation** — eenvoudige web-kwetsbaarheden
   - **Cryptography** — basis versleuteling kraken
   - **Forensics** — verborgen data vinden in bestanden
   - **Reverse Engineering** — begrijpen hoe programma's werken

**Wat is een CTF?**
Een Capture The Flag competitie is een hackwedstrijd. Je krijgt uitdagingen en moet een verborgen tekst (de "flag") vinden — bijvoorbeeld `picoCTF{dit_is_de_vlag}`. Het is legaal, educatief, en verslavend.

**Tips voor je eerste CTF:**
- Begin ALTIJD met de challenges met de minste punten (= makkelijkst)
- Google is je vriend — zoeken naar technieken is geen valsspelen, het is leren
- Maak aantekeningen van elke challenge die je oplost — je bouwt een persoonlijke kennisbank
- Vast? Sla over en probeer een andere challenge. Kom later terug.

**Zelftest:**
- [ ] Heb je minimaal 5 picoCTF challenges opgelost?
- [ ] Kun je een base64-gecodeerde string decoderen?
- [ ] Heb je een flag gevonden door een webpagina's broncode te bekijken?

---

### Week 10: HackTheBox — Echte Machines
**Doel:** Je hackt je eerste "echte" machine van begin tot eind.
**Tijd:** 8-10 uur

**Activiteiten:**
1. Maak een gratis account aan op **hackthebox.com**
2. Start met **Starting Point** — begeleide machines voor beginners
   - Tier 0: Basis connectiviteit en tools
   - Tier 1: Eerste exploitation-technieken
   - Tier 2: Meer geavanceerde scenario's
3. Gebruik de pentest-methodologie uit het Pentest Playbook:
   - Reconnaissance → Scanning → Exploitation → Post-Exploitation
4. Als je vastloopt: zoek een "walkthrough" of "writeup" van de machine (beschikbaar voor retired machines)

**HackTheBox vs. TryHackMe:**

| | TryHackMe | HackTheBox |
|---|-----------|------------|
| **Stijl** | Geleid, stap-voor-stap instructies | Zelfstandig, weinig hints |
| **Niveau** | Beginner → Intermediate | Intermediate → Advanced |
| **Gratis** | Veel gratis rooms | Starting Point + enkele actieve machines gratis |
| **Beste voor** | Concepten leren | Vaardigheden testen |

**Zelftest:**
- [ ] Heb je minimaal 1 Starting Point machine volledig gehackt (user + root flag)?
- [ ] Heb je de pentest-methodologie (recon → scan → exploit → post-exploit) toegepast?
- [ ] Kun je je aanpak uitleggen aan iemand anders?

---

### Week 11: Verdieping & Zwakke Punten
**Doel:** Je identificeert je zwakke punten en werkt eraan.
**Tijd:** 6-8 uur

**Activiteiten:**
1. Reflecteer: welke CTF-categorieën waren het moeilijkst?
   - Web moeilijk? → Extra TryHackMe web rooms doen
   - Linux moeilijk? → Extra Linux privilege escalation oefenen
   - Crypto moeilijk? → picoCTF crypto challenges herhalen
2. Doe nog 2-3 HackTheBox Starting Point machines
3. Probeer één "Easy" HackTheBox machine (buiten Starting Point)

**Veelvoorkomende zwakke punten bij beginners:**

| Probleem | Oorzaak | Oplossing |
|----------|---------|-----------|
| "Ik weet niet waar ik moet beginnen" | Geen methodologie | Gebruik altijd het 6-fasen model (Fase 0-5) |
| "Nmap output zegt me niks" | Poorten/services niet herkend | Print de poorten-referentie uit het Playbook |
| "Ik vind de kwetsbaarheid niet" | Te snel opgeven of verkeerd zoeken | Doorloop ELKE open poort en service systematisch |
| "Ik kom binnen maar kan geen root krijgen" | Privilege escalation niet geleerd | Focus op linPEAS tool + SUID + sudo -l |
| "Ik vergeet wat ik heb geleerd" | Geen aantekeningen | Start een persoonlijk notitieboek (digitaal of fysiek) |

**Zelftest:**
- [ ] Kun je benoemen wat je grootste zwakte is en hoe je eraan werkt?
- [ ] Heb je minimaal 3 HackTheBox machines afgerond (inclusief Starting Point)?
- [ ] Durf je een "Easy" machine aan te pakken zonder walkthrough?

---

### Week 12: Je Eerste Echte CTF
**Doel:** Je doet mee aan een live CTF-competitie.
**Tijd:** 4-10 uur (afhankelijk van het event)

**Activiteiten:**
1. Zoek een aankomend CTF-event op **ctftime.org** (de internationale CTF-kalender)
   - Filter op: "beginner-friendly" of "entry level"
   - picoCTF (jaarlijks, maart) is ideaal als eerste competitie
2. Doe mee! Je doel is **niet** om te winnen. Je doel is:
   - Minimaal 1 challenge oplossen
   - De ervaring opdoen van een live competitie
   - Leren van de writeups die na afloop worden gepubliceerd
3. Schrijf na afloop op wat je hebt geleerd en wat je de volgende keer anders zou doen

**Wat je kunt verwachten bij je eerste CTF:**
- Je lost waarschijnlijk 1-5 challenges op (van de 20-50). Dat is normaal en goed.
- Je voelt je overweldigd. Dat is normaal.
- Je leert meer in één CTF dan in een week studeren. Dat is het punt.
- Na afloop publiceren teams hun oplossingen ("writeups"). Lees ze allemaal. Dat is waar je het meeste leert.

**Zelftest:**
- [ ] Heb je meegedaan aan een CTF-event (of een vergelijkbare challenge)?
- [ ] Heb je minimaal 1 flag gevonden?
- [ ] Heb je na afloop writeups gelezen van challenges die je niet had opgelost?

---

## Hoe Nu Verder? — Na De 12 Weken

Gefeliciteerd — je hebt een fundering gelegd die de meeste beginners nooit bereiken. Nu heb je drie opties:

### Optie A: Meer Oefenen (Gratis)
- Ga verder met TryHackMe paden (SOC Level 1, Jr Penetration Tester)
- Doe mee aan maandelijkse CTF's via ctftime.org
- Hack meer HackTheBox machines (werk naar "Medium" moeilijkheid)

### Optie B: Certificering Halen (Betaald)
Een certificering bewijst aan werkgevers dat je vaardigheden hebt. Dit is de route als je cybersecurity als carrière overweegt.

**Welke certificering past bij jou?**

```
Ben je een complete beginner?
  │
  ├─ JA → CompTIA Security+
  │        De meest erkende instap-certificering.
  │        Breed: netwerk, crypto, compliance, risk.
  │        Erkend door Nederlandse en internationale werkgevers.
  │        Kosten: ~$425 (examen) + studiemateriaal
  │        Moeilijkheid: ★★★☆☆
  │
  └─ NEE, ik wil specifiek pentester worden
       │
       ├─ Budget beperkt? → eJPT (INE Security)
       │   Instap-certificering specifiek voor pentesting.
       │   100% praktisch examen (geen multiple choice).
       │   Kosten: ~$249 (examen + 3 maanden training)
       │   Moeilijkheid: ★★☆☆☆
       │
       ├─ Serieus budget? → OSCP (OffSec)
       │   DE gouden standaard voor pentesters.
       │   24-uur praktijkexamen: hack 3+ machines.
       │   Zwaar maar zeer gerespecteerd.
       │   Kosten: ~$1.749 (cursus + lab + 1 examenkans)
       │   Moeilijkheid: ★★★★★
       │
       └─ Werkgever betaalt? → CEH (EC-Council)
           Breed erkend, vooral in corporate/overheid.
           Meer theoretisch dan OSCP.
           Kosten: ~$2.200+ (training verplicht + examen)
           Moeilijkheid: ★★★☆☆
```

> **Let op:** Certificeringsprijzen veranderen regelmatig. Check altijd de actuele prijs op de website van de aanbieder voordat je koopt. Bovenstaande prijzen zijn indicatief per april 2026.

### Optie C: Community Zoeken
- **Hack.lu** — Europese hacking conferentie
- **Tweakers.net** — Nederlands techforum met security-subforum
- **Nederlandse CTF-teams** — zoek op ctftime.org naar teams uit Nederland
- **Meetups** — zoek "cybersecurity" of "ethical hacking" op meetup.com voor je regio

---

## Weekoverzicht (Tear-out)

| Week | Focus | Platform | Uren |
|------|-------|----------|------|
| 1 | Terminal basics | HackSimulator | 4-5 |
| 2 | Netwerken | HackSimulator + blog | 5-6 |
| 3 | Hoe websites werken | Browser DevTools + blog | 5-6 |
| 4 | Wet & ethiek | Juridische Gids + NCSC | 3-4 |
| 5 | TryHackMe start | TryHackMe (gratis) | 6-8 |
| 6 | Nmap & scanning | TryHackMe | 6-8 |
| 7 | Web security | TryHackMe + Burp Suite | 6-8 |
| 8 | Linux & privilege escalation | TryHackMe + HackSimulator | 6-8 |
| 9 | Eerste CTF-challenges | picoCTF (gratis) | 6-8 |
| 10 | Echte machines hacken | HackTheBox (gratis) | 8-10 |
| 11 | Zwakke punten versterken | Mix van platforms | 6-8 |
| 12 | Eerste live CTF | ctftime.org event | 4-10 |
| **Totaal** | | | **~70-90 uur** |

---

## Veelgestelde Vragen

**"Moet ik kunnen programmeren?"**
Niet om te beginnen. Basiskennis van Python is handig vanaf week 7-8, maar geen vereiste. Als je wilt leren: TryHackMe heeft Python-rooms in het Cyber Security 101 pad.

**"Heb ik Kali Linux nodig?"**
Niet voor de eerste 4 weken. Vanaf week 5 (TryHackMe) kun je hun browser-based "Pwnbox" gebruiken. Kali Linux installeren op een VM is een goed project voor na week 12.

**"Kan ik dit met een Chromebook?"**
Ja, tot en met week 4. Vanaf week 5 heb je een browser nodig die TryHackMe's Pwnbox ondersteunt (dat werkt op Chrome). Voor HackTheBox heb je mogelijk een VPN nodig, wat op een Chromebook lastiger is.

**"Is 12 weken genoeg om professioneel ethical hacker te worden?"**
Nee. 12 weken is genoeg om een solide basis te leggen en te bepalen of dit iets voor je is. Een professionele ethical hacker heeft typisch 1-2 jaar ervaring + minimaal één certificering.

**"Wat als ik een week oversla?"**
Pak hem de week erna op. Dit leerplan is geen deadline — het is een routekaart. Als je 16 of 20 weken nodig hebt, is het resultaat hetzelfde.

---

## Bronnen per Week

### Gratis platforms
- **HackSimulator.nl** — Browser-based terminal simulator (Nederlands)
- **TryHackMe** — tryhackme.com (gratis tier beschikbaar)
- **picoCTF** — picoctf.org (volledig gratis, door Carnegie Mellon University)
- **HackTheBox** — hackthebox.com (Starting Point gratis)
- **CTFtime** — ctftime.org (CTF-kalender)
- **OverTheWire: Bandit** — overthewire.org/wargames/bandit (gratis Linux-oefeningen)

### Gratis leermateriaal
- **OWASP Top 10:2025** — owasp.org/Top10/2025 (web-kwetsbaarheden referentie)
- **CyberChef** — gchq.github.io/CyberChef (data encoding/decoding tool)
- **GTFOBins** — gtfobins.org (Linux privilege escalation referentie)
- **HackTricks** — hacktricks.wiki (uitgebreide pentest kennisbank)

### Certificeringen
- **CompTIA Security+** — comptia.org (instap, breed erkend, ~$425)
- **eJPT** — ine.com/security/certifications/ejpt-certification (pentesting instap, ~$249)
- **OSCP** — offsec.com/courses/pen-200 (gouden standaard pentesting, ~$1.749)
- **CEH** — eccouncil.org (corporate erkend, ~$2.200+)

---

## Verificatiestatus

Alle feiten in dit leerplan zijn geverifieerd per april 2026:
- ✅ TryHackMe Cyber Security 101 — 54 rooms, 13 modules bevestigd
- ✅ HackTheBox Starting Point — gratis, Tier 0/1/2 structuur klopt
- ✅ OverTheWire Bandit — beschikbaar op overthewire.org
- ✅ GTFOBins — nu op gtfobins.org (URL bijgewerkt)
- ✅ HackTricks — nu op hacktricks.wiki (URL bijgewerkt)
- ✅ Certificeringsprijzen kloppen (Security+ $425, eJPT $249, OSCP $1.749, CEH $2.200+)
- ✅ Hack.lu — conferentie vindt nog jaarlijks plaats (2026 editie aangekondigd, oktober 2026)
- ✅ picoCTF — jaarlijks in maart, door Carnegie Mellon University

---

*Dit leerplan is geschreven voor HackSimulator.nl — de gratis browser-based terminal simulator voor ethical hacking.*
*Laatst bijgewerkt: april 2026*
*Versie: 1.0*
