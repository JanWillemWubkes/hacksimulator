# Product Requirements Document - HackSimulator.nl
**Versie:** 1.6
**Status:** M0-M4 Completed, M5 In Progress - ✅ **LIVE on Netlify!**
**Laatst bijgewerkt:** 15 december 2025
**Live URL:** https://famous-frangollo-b5a758.netlify.app/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator

---

## 1. Productvisie

HackSimulator.nl biedt een veilige, browser-gebaseerde omgeving waar beginners de fundamenten van ethisch hacken kunnen leren door hands-on te oefenen met echte commando's.

---

## 2. Probleemstelling

**Huidige Situatie:**
- Het leren van ethisch hacken vereist installatie van complexe tools of dure cloud labs
- Beginners riskeren schade aan hun systemen of het per ongeluk uitvoeren van illegale acties
- Bestaande platforms zijn ofwel te geavanceerd of te gamified

**Oplossing:**
Een web-gebaseerde terminal simulator die een realistische maar veilige omgeving biedt voor het leren van cybersecurity basics, zonder installatie of registratie.

---

## 3. Gebruikersprofielen

### Primair: "De Nieuwsgierige Beginner"

**Skill Level:** Geen tot minimale technische achtergrond in cybersecurity
**Primaire Filter:** Passie voor cybersecurity + bereidheid om te leren

**Gemeenschappelijke Kenmerken:**
- Heeft gehoord over ethisch hacken en cybersecurity
- Wil verkennen zonder verplichting of risico
- Heeft begeleiding en duidelijke uitleg nodig
- Overweegt mogelijk een cybersecurity carrière
- Zoekt hands-on praktijkervaring

**Demografische Segmenten:**

**1. Studenten (16-25 jaar)**
- **Context:** IT/Informatica studie of carrièreoriëntatie
- **Motivatie:** Praktische ervaring voor CV, voorbereiding op certificeringen (CEH, OSCP)
- **Budget:** Beperkt - zoekt gratis/low-cost resources
- **Commitment:** Middel tot hoog (studie-gerelateerd)
- **Tech savvyness:** Basis terminal kennis (of leert snel)

**2. Career Switchers (25-45 jaar)**
- **Context:** Werken momenteel in IT-support, sysadmin, development, of gerelateerde velden
- **Motivatie:** Willen transitie maken naar cybersecurity maar onzeker of het bij hen past
- **Budget:** Hoger disposable income - bereid te investeren na validatie interesse
- **Commitment:** Laag initieel (exploreren), hoog na validatie (cursussen, certificeringen)
- **Tech savvyness:** Solide IT fundamentals, weinig specifieke security kennis

**3. Enthousiastelingen / Hobbyisten (Alle leeftijden)**
- **Context:** Nieuwsgierig door media (Mr. Robot, nieuws over hacks), tech hobbyisten
- **Motivatie:** Pure interesse, geen carrière ambities - "willen snappen hoe het werkt"
- **Budget:** Variabel - sommigen investeren in hobbies, anderen zoeken gratis opties
- **Commitment:** Variabel - sommigen diep in één topic, anderen casual explorers
- **Tech savvyness:** Zeer variabel (van beginner tot gevorderd)

### Secundair: "De Gevorderde Leerling"

**Skill Level:** Basale Linux/terminal kennis, enige cybersecurity exposure
**Primaire Filter:** Zoekt praktijkoefening voor certificeringen of skill maintenance

**Kenmerken:**
- Heeft basale command-line ervaring
- Wil oefenen voor certificeringen (CEH, OSCP, Security+)
- Zoekt platform voor muscle memory training (commands, flags, syntax)
- Gebruikt HackSimulator als supplement bij betaalde cursussen (TryHackMe, HackTheBox)
- Apprecieert realistische maar gesimuleerde omgeving (geen VM setup overhead)

---

## 4. Gebruikersverhalen

### Must Have (MVP)
- Als gebruiker wil ik commando's typen in een terminal zodat ik kan leren hoe hackers werken
- Als gebruiker wil ik help documentatie zien zodat ik begrijp wat elk commando doet
- Als gebruiker wil ik door een bestandssysteem navigeren zodat ik kan oefenen met het vinden van gevoelige informatie
- Als gebruiker wil ik netwerk scan commando's uitvoeren zodat ik reconnaissance begrijp
- Als gebruiker wil ik duidelijke feedback bij fouten zodat ik correct kan leren
- Als gebruiker wil ik zachte begeleiding krijgen bij mijn eerste bezoek zodat ik weet hoe te beginnen
- Als gebruiker wil ik educatieve tips zien bij security tools zodat ik context begrijp

### Should Have (Fase 2)
- Als gebruiker wil ik guided tutorials volgen zodat ik gestructureerd kan leren
- Als gebruiker wil ik mijn voortgang bijhouden zodat ik gemotiveerd blijf
- Als gebruiker wil ik uitdagingen voltooien zodat ik mijn vaardigheden kan testen
- Als gebruiker wil ik scenario's doorlopen zodat ik realistische situaties oefen

### Could Have (Toekomst)
- Als gebruiker wil ik certificaten verdienen zodat ik mijn prestaties kan tonen
- Als gebruiker wil ik met anderen concurreren zodat ik mijn vaardigheden kan meten
- Als gebruiker wil ik aangepaste scenario's maken zodat ik specifieke vaardigheden kan oefenen

---

## 5. Functionele Requirements

### 5.1 Terminal Interface
- **FR1.1:** Systeem moet een command-line interface bieden die tekstinvoer accepteert
- **FR1.2:** Systeem moet command output in real-time weergeven
- **FR1.3:** Systeem moet commandogeschiedenis bijhouden toegankelijk via pijltjestoetsen
- **FR1.4:** ~~Systeem moet command autocomplete ondersteunen met Tab-toets~~ **[POST-MVP]**
- **FR1.5:** Systeem moet scherm kunnen leegmaken
- **FR1.6:** Systeem moet mobiel-vriendelijke touch interface bieden

### 5.2 Commando Uitvoering
- **FR2.1:** Systeem moet Linux-achtige commando's herkennen en uitvoeren
- **FR2.2:** Systeem moet foutmeldingen geven voor ongeldige commando's
- **FR2.3:** Systeem moet commando argumenten en vlaggen ondersteunen
- **FR2.4:** Systeem moet realistische maar vereenvoudigde output simuleren (80/20 regel)
- **FR2.5:** Systeem moet fuzzy matching ondersteunen voor veelvoorkomende typefouten

### 5.3 Bestandssysteem
- **FR3.1:** Systeem moet een Unix-achtige mappenstructuur simuleren
- **FR3.2:** Systeem moet navigatie tussen mappen toestaan
- **FR3.3:** Systeem moet bestandsinhoud kunnen tonen
- **FR3.4:** Systeem moet bestanden verbergen/tonen op basis van permissies
- **FR3.5:** Systeem moet wijzigingen binnen sessie behouden (session-persistent)
- **FR3.6:** Systeem moet `reset` command aanbieden om naar originele staat terug te keren

### 5.4 Educatieve Functies
- **FR4.1:** Systeem moet help bieden voor elk commando
- **FR4.2:** Systeem moet gedetailleerde manual pagina's aanbieden
- **FR4.3:** Systeem moet fouten uitleggen in educatieve context (3-tier help systeem)
- **FR4.4:** Systeem moet beveiligingsimplicaties van acties benadrukken
- **FR4.5:** Systeem moet progressive hints geven na herhaalde fouten
- **FR4.6:** Systeem moet inline uitleg tonen bij command output (pijltjes met context)

### 5.5 Hacking Simulaties
- **FR5.1:** Systeem moet netwerk scanning simuleren (nmap, ping, etc.)
- **FR5.2:** Systeem moet wachtwoord kraken simuleren (hashcat, hydra)
- **FR5.3:** Systeem moet SQL injectie concepten demonstreren (sqlmap)
- **FR5.4:** Systeem moet resultaten in educatief formaat tonen met waarschuwingen
- **FR5.5:** Systeem moet bij elke security tool juridische context geven

### 5.6 Onboarding & Begeleiding
- **FR6.1:** Systeem moet welkomstbericht tonen bij eerste bezoek
- **FR6.2:** Systeem moet suggesties geven voor eerste commando's
- **FR6.3:** Systeem moet optionele tutorial aanbieden na 3-5 commando's
- **FR6.4:** Systeem moet terugkerende bezoekers herkennen en direct naar terminal leiden
- **FR6.5:** Systeem moet persistent maar onopvallende help hints tonen

### 5.7 Feedback & Analytics
- **FR7.1:** Systeem moet floating feedback button bieden (altijd beschikbaar)
- **FR7.2:** ~~Systeem moet exit intent survey tonen na meaningvolle sessie (2+ min)~~ **[POST-MVP]**
- **FR7.3:** ~~Systeem moet command-level feedback mogelijk maken (thumbs up/down)~~ **[POST-MVP]**
- **FR7.4:** Systeem moet anonymous usage analytics verzamelen (privacy-first)
- **FR7.5:** Systeem moet GDPR-compliant cookie consent implementeren

---

## 6. Niet-Functionele Requirements

### 6.1 Prestaties
- Pagina laadtijd < 3 seconden op 4G verbinding
- Time to Interactive < 3 seconden
- Commando responstijd < 100ms
- Totale bundle size < 500KB (inclusief dependencies)
- Soepel scrollen zonder lag

### 6.2 Bruikbaarheid
- Geen registratie vereist
- Intuïtief voor gebruikers bekend met terminals
- Behulpzaam voor complete beginners
- Mobiel responsive met adaptive touch interface
- Duidelijke error messages met actionable next steps

### 6.3 Beveiliging & Privacy
- Alle commando's draaien alleen client-side
- Geen echte systeemtoegang
- Geen externe netwerkverbindingen (behalve analytics)
- Veilig voor gebruik in educatieve omgevingen
- Content Security Policy geïmplementeerd
- Input sanitization tegen XSS

**Privacy & Analytics:**
- **MVP Fase:** Google Analytics 4 met IP anonymization
- **M5.5 Monetization:** Google AdSense met explicit user consent (GDPR Article 6(1)(a))
  - Cookies for ad personalization
  - IP address anonymized
  - Data processors: Google LLC
  - User consent required via cookie banner (extended with "Advertising Cookies" toggle)
- **Post-MVP:** Migratie naar Plausible Analytics (privacy-first, cookie-less)
- Geen persoonlijk identificeerbare informatie opslaan
- Command arguments NIET loggen (privacy)
- Data retention: maximaal 14 maanden
- Volledige GDPR/AVG compliance

**Gemeten Metrics:**
- Session duration
- Commands per session
- Command frequency distribution
- Bounce rate
- Traffic sources
- Device types
- Error patterns (anonymous)

**NIET gemeten:**
- IP adressen (geanonimiseerd)
- Persoonlijke data
- Command arguments
- Keystrokes

### 6.4 Compatibiliteit
- Chrome/Edge: laatste 2 versies
- Firefox: laatste 2 versies
- Safari: laatste 2 versies
- Mobile browsers: iOS 14+, Android 10+
- Functioneert zonder plugins of extensies
- JavaScript ES6+ support vereist

### 6.5 Toegankelijkheid (WCAG 2.1 Level AA)
- Volledige toetsenbord navigatie ondersteuning
- ARIA labels op interactieve elementen
- Kleurcontrast minimaal 4.5:1 voor alle tekst
- Zichtbare focus indicators
- Font scaling support tot 200% zoom
- Alt text voor command output blocks
- Schermlezer compatibiliteit (met bekende terminal beperkingen)

### 6.6 Taal & Lokalisatie
- **Primaire taal:** Nederlands (voor Nederlandse markt)
- **Command syntax:** Engels (realistisch, komt overeen met echte tools)
- **UI teksten:** Volledig Nederlands
- **Error messages:** Engels error + Nederlandse uitleg
- **Educational tips:** Volledig Nederlands
- **Legal disclaimers:** Nederlands (GDPR/AVG verplichting)
- **Toekomst:** Engels als secundaire taal optie voor gevorderden

---

## 7. Beperkingen

- **Technisch:** Moet volledig in browser draaien (geen backend voor MVP)
- **Juridisch:** Moet duidelijk aangeven dat alle activiteiten gesimuleerd zijn
- **Ethisch:** Moet ethisch gebruik van kennis benadrukken
- **Taal:** Nederlandse UI met Engelse command syntax
- **Performance:** Moet werken op middelmatige apparaten (niet alleen high-end)
- **Budget:** MVP met minimale kosten (gratis tools waar mogelijk)

---

## 8. Onboarding & Gebruikerservaring

### 8.1 First Time User Experience (FTUE)

**Stap 1: Welkomstbericht (3 regels)**
```
Welkom bij HackSimulator.nl
Leer ethisch hacken in een veilige omgeving

💡 Type 'help' om te beginnen
```

**Stap 2: Na eerste commando**
```
Goed bezig! Blijf experimenteren...
```

**Stap 3: Na 3-5 commando's**
```
Je bent goed op weg!
Type 'tutorial' voor gestructureerd leren, of blijf vrij exploreren.
```

**Stap 4: Persistent help (onopvallend)**
- Klein hint icoontje rechts onderin
- "Stuck? Type 'help'" (verdwijnt na 5 commando's)

**Terugkerende Bezoekers:**
- Geen intro
- Direct naar terminal
- Optie om laatste sessie te herstellen of fresh start

### 8.2 Progressive Disclosure Principe
- Niet alles tegelijk tonen
- Info komt op het juiste moment
- Gebruiker bepaalt eigen tempo
- Tutorial is optioneel, niet verplicht

### 8.3 Content Tone of Voice: "Friendly Expert"

**Karakteristieken:**
- Professioneel maar toegankelijk
- Enthousiast maar niet kinderachtig
- Technisch accuraat maar niet arrogant
- Bemoedigend maar niet neerbuigend

**Emoji gebruik (beperkt):**
- 💡 Tips/learning moments
- ⚠️ Warnings
- ✅ Success
- ❌ Errors
- 🔒 Security notes
- 🎯 Objectives (in tutorials)

Max 1 emoji per bericht.

**Voorbeelden:**

✅ **Goed:**
```
$ nmap 192.168.1.1
Scanning for open ports...

PORT    STATE   SERVICE
22/tcp  OPEN    SSH       ← Secure Shell (externe toegang)
80/tcp  OPEN    HTTP      ← Webserver

Scan voltooid. 2 open poorten gevonden.

💡 BEVEILIGINGSTIP: Poort 22 (SSH) met zwakke
   wachtwoorden is een veelvoorkomend aanvalspunt.
```

❌ **Te technisch:**
```
Initiating SYN Stealth Scan at 14:30
TCP port state determination via SYN packets...
```

❌ **Te casual:**
```
Whoa dude! Let's hack some ports! 🎉
```

---

## 9. Error Handling & Help Systeem

### 9.1 Three-Tier Help System

**Tier 1: Instant Inline Help (bij fout)**
```
$ nmpa 192.168.1.1
Command not found: nmpa

Bedoelde je: nmap?
💡 Type 'help' voor alle commando's
```

**Tier 2: Progressive Hints (na herhaalde fout)**
```
$ nmap
Error: Target ontbreekt

🎓 HINT: nmap heeft een IP-adres of domein nodig.
Probeer: nmap 192.168.1.1

Meer hulp nodig? Type: man nmap
```

**Tier 3: Full Explanation (manual pages)**
```
$ man nmap
NAAM
    nmap - Network Mapper (poort scanner)

GEBRUIK
    nmap [target]
    nmap [options] [target]

VOORBEELDEN
    nmap 192.168.1.1          Scan een host
    nmap 192.168.1.0/24       Scan een netwerk

BEVEILIGINGSCONTEXT
    Nmap is een reconnaissance tool...
    [uitgebreide educatieve uitleg]
```

### 9.2 Error Handling Voorbeelden

**Permission Denied (educatief moment):**
```
$ cat /etc/shadow
Permission denied: /etc/shadow

🔒 BEVEILIGING: Dit bestand bevat password hashes.
   Op echte systemen kan alleen root dit lezen.

🎯 PROBEER IN PLAATS DAARVAN: cat /etc/passwd
   (wereldleesbaar gebruikersinformatie)
```

**Syntax Error (met suggestie):**
```
$ cd
Error: Geen directory opgegeven

Gebruik: cd [directory]
Bijvoorbeeld: cd /home/user
```

### 9.3 Anti-frustration Regels
- Max 3 hints per sessie voor dezelfde fout
- Na 3 dezelfde fouten: "Hulp nodig? Type 'tutorial'"
- Fuzzy matching voor veelvoorkomende typefouten
- Altijd een "volgende stap" suggestie geven

---

## 10. Juridische Disclaimers & Compliance

### 10.1 Multi-Layer Disclaimer Approach

**Layer 1: Prominent op Homepage**
```
⚠️ EDUCATIEF DOEL ALLEEN
   Alle activiteiten zijn gesimuleerd.
   Gebruik kennis verantwoordelijk.
```

**Layer 2: Modal bij Eerste Gebruik**
```
┌─────────────────────────────────────────┐
│ ⚖️  JURIDISCHE KENNISGEVING              │
│                                          │
│ Deze simulator is UITSLUITEND voor      │
│ educatieve doeleinden. Ongeautoriseerd  │
│ hacken is ILLEGAAL in Nederland.        │
│                                          │
│ Vraag altijd toestemming voordat je     │
│ systemen test.                           │
│                                          │
│ Door verder te gaan, ga je akkoord deze │
│ kennis ethisch en legaal te gebruiken.  │
│                                          │
│ [Ik begrijp het - Verder]               │
└─────────────────────────────────────────┘
```

**Layer 3: Persistent Footer**
```
Educatieve tool | Gebruiksvoorwaarden | Misbruik melden
```

**Layer 4: Bij Security Tools**
```
$ hydra target.com
⚠️ WAARSCHUWING: Brute force aanvallen zijn illegaal
   zonder expliciete toestemming.

   In deze simulator: VEILIG ✓
   In de echte wereld: TOESTEMMING VEREIST

Simulatie voortzetten? [j/n]
```

### 10.2 Wettelijke Basis
- **Artikel 138ab Wetboek van Strafrecht:** Computervredebreuk
- **Disclaimer:** Platform faciliteert leren, geen misbruik
- **Good faith:** Duidelijke educatieve intentie

### 10.3 Vereiste Juridische Documenten
- Privacy Policy (AVG compliant)
- Gebruiksvoorwaarden (Terms of Service)
- Cookie Policy
- Educatieve Disclaimer
- Contact voor misbruik melden

---

## 11. Mobiele Optimalisatie

### 11.1 Adaptive Touch Interface

**Desktop: Traditionele Terminal**
- Volledige toetsenbord input
- 80 karakters breed
- Standaard terminal ervaring

**Tablet: Hybrid**
- On-screen keyboard met helpers
- 60 karakters breed
- Touch-friendly buttons voor vaak gebruikte commands

**Mobile: Enhanced Terminal**
```
┌─────────────────────────────────────────┐
│ $ ls -la_                                │
│                                          │
│ Quick Commands ▼                         │
│ 📁 ls  📂 cd  📄 cat  🔍 nmap  ❓ help  │
│                                          │
│ 💡 Swipe up voor command history         │
└─────────────────────────────────────────┘
```

### 11.2 Mobile-Specific Features

**Virtual Keyboard Helper Bar:**
```
[ - ] [ / ] [ . ] [ | ] [ ~ ] [ ctrl ]
```

**Gesture Support:** **[POST-MVP - Requires Real Device Testing]**
- ~~Swipe up: command history~~
- ~~Swipe down: hide keyboard~~
- ~~Long press: paste~~
- ~~Double tap: select command~~

**Smart Autocomplete:**
- Tap suggesties om in te vullen
- Pre-filled templates voor complexe commands

**Responsive Output:**
- Desktop: 80 chars
- Tablet: 60 chars
- Mobile: 40 chars (met horizontal scroll)

### 11.3 Mobile Guidance
```
$ help mobile

📱 MOBIELE TIPS:
• Gebruik Quick Commands voor snellere invoer
• Swipe omhoog voor command geschiedenis
• Lang indrukken om te plakken
• Gebruik voorgestelde commando's

Moeite? Probeer de desktop versie voor volledige ervaring.
```

---

## 12. Scenario's & Tutorials (Fase Implementatie)

### 12.1 MVP (Fase 1): Losse Commands met Context

Elke security tool krijgt:
- Realistische output
- Educatieve warning/tip
- Inline uitleg (← pijltjes)

**Voorbeeld:**
```
$ nmap 192.168.1.1
Scanning for open ports...

PORT    STATE   SERVICE
22/tcp  OPEN    SSH       ← Secure Shell (externe toegang)
80/tcp  OPEN    HTTP      ← Webserver
443/tcp OPEN    HTTPS     ← Versleutelde webserver

Scan voltooid. 3 open poorten gevonden.

💡 BEVEILIGINGSTIP: Open poorten zijn aanvalsvectoren.
   Controleer altijd welke services draaien.
```

### 12.2 Fase 2: Guided Scenarios

Nieuw `tutorial` command:
```
$ tutorial
Beschikbare tutorials:
1. recon     - Basis reconnaissance
2. webvuln   - Web kwetsbaarheden vinden
3. privesc   - Privilege escalation

$ tutorial recon

=== MISSIE: Reconnaissance ===
Je bent ingehuurd om het netwerk van SecureCorp te testen.

🎯 DOELSTELLING: Vind alle open poorten op 192.168.1.100

→ Begin met: nmap 192.168.1.100

[Gebruiker voert command uit]

✅ Goed gedaan! Je hebt 3 open poorten gevonden.
   Volgende stap: Identificeer de services...
```

### 12.3 Scenario Structuur (Toekomst)
- Verhaallijn met context
- Duidelijke objectives
- Progressive difficulty
- Educatieve momenten tussen stappen
- Completion certificaat

---

## 13. Technische Randvoorwaarden

### 13.1 Architectuur Eisen
- **Deployment:** Statische site (geen server/backend voor MVP)
- **Technologie:** Modern JavaScript (ES6+)
- **Styling:** Vanilla CSS met CSS Variables (geen Tailwind)
- **Dependencies:** Maximaal 2 externe libraries
- **Build:** Optioneel voor minification (moet werken zonder compile step)

### 13.2 Styling Rationale

**Waarom Vanilla CSS (geen Tailwind):**
- Terminal UI is simpel (minimale CSS nodig)
- Bundle size kritisch (Tailwind = 20-50KB, Vanilla = 5-10KB)
- Geen complexe layouts nodig
- Begrijpelijker voor beginners die code bekijken (educatief project)
- Geen build step vereist
- Custom terminal styling toch nodig (animations, cursors)

**CSS Variables voor Theming:**
```css
:root {
  --color-bg: #000000;
  --color-text: #00ff00;
  --color-error: #ff0000;
  --color-hint: #ffff00;
  --font-terminal: 'Courier New', monospace;
}
```

### 13.3 Prestatie Eisen
- Totale bundle size: < 500KB
- Time to Interactive: < 3 seconden
- Geen blocking scripts
- Lazy loading waar mogelijk

### 13.4 Data Storage
- **Client-side:** localStorage (max 5MB)
  - Session state
  - Filesystem wijzigingen
  - Command history
  - User preferences (geen PII)
- **Server-side:** N/A voor MVP

### 13.5 Browser Support Matrix

**Minimum Versies (ES6 Module Support vereist):**

| Browser | Minimum Versie | Market Share | Priority | Status |
|---------|----------------|--------------|----------|--------|
| Chrome | 61+ (sept 2017) | ~65% | Hoog | ✅ Supported |
| Firefox | 60+ (mei 2018) | ~10% | Hoog | ✅ Supported |
| Safari | 11+ (sept 2017) | ~15% | Hoog | ✅ Supported |
| Edge | 16+ / Chromium 79+ | ~5% | Middel | ✅ Supported |
| Mobile Safari | iOS 11+ | ~3% | Middel | ✅ Supported |
| Chrome Mobile | 61+ (Android 5+) | ~2% | Middel | ✅ Supported |
| **Internet Explorer 11** | - | <1% | - | ❌ **Not Supported** |
| **Opera Mini** | - | <2% | Laag | ⚠️ Limited Support |

**Waarom deze minimum versies:**
- **ES6 Modules:** Native `import/export` syntax (geen bundler nodig)
- **CSS Variables:** Theming systeem (`--color-bg`, etc.)
- **Flexbox:** Layout engine
- **localStorage:** State persistence met try-catch protectie

**IE11 niet ondersteund omdat:**
- Geen ES6 module support (zou Webpack/Babel vereisen)
- Geen CSS custom properties support
- Beperkte flexbox implementatie
- Market share <1% in 2025

### 13.6 Bestandssysteem Behavior

**Session-Persistent met Reset:**
- Wijzigingen blijven tijdens sessie
- localStorage slaat laatste state op
- Bij terugkomst: optie om te herstellen of reset
- `reset` command: terug naar origineel

**Voorbeeld:**
```
Sessie 1:
$ rm /home/user/passwords.txt
$ ls
notes.txt                    # Bestand is weg

[Later, zelfde sessie]
$ ls
notes.txt                    # Nog steeds weg

[Browser sluiten, volgende dag]

=== Welkom terug! ===
Je laatste sessie is automatisch hersteld via localStorage.

$ reset
Systeem hersteld naar oorspronkelijke staat.
```

**Note:** `continue` command is niet geïmplementeerd - localStorage restore gebeurt automatisch bij page load.

---

## 14. Succesmetingen

### Fase 1: MVP Validatie (Maand 1)
**Doel:** Technische validatie en basis engagement

| Metric | Target | Meetmethode |
|--------|--------|-------------|
| Werkende sessies | > 95% | Geen JavaScript errors |
| Eerste interactie | > 50% voert minstens 1 command uit | Event tracking |
| Bounce rate | < 80% | Analytics |
| Help command gebruik | > 20% | Command logging |
| Kwalitatieve feedback | 10+ bruikbare responses | Feedback form |
| Mobiele sessies | > 10% | Device tracking |
| Gemiddelde laadtijd | < 3 sec | Performance monitoring |

**Kwalitatieve Metrics:**
- User comprehension: "Begreep je wat je leerde?" (survey)
- Immersion score: "Voelde het realistisch?" (1-5)
- Recommendation: "Zou je dit aanbevelen?" (NPS)

### Fase 2: Early Adoption (Maand 2-3)
**Doel:** Product-market fit validatie

| Metric | Target | Meetmethode |
|--------|--------|-------------|
| Gemiddelde sessieduur | > 2 minuten | Analytics |
| Commands per sessie | > 5 | Event tracking |
| Command variatie | > 3 verschillende commands | Custom metrics |
| Return visitors | > 10% binnen 7 dagen | Cohort analyse |
| Tutorial start rate | > 25% | Event tracking |
| Error recovery rate | > 70% herstelt na fout | Custom metric |

### Fase 3: Groei (Maand 4-6)
**Doel:** Optimalisatie en schaling

| Metric | Target | Meetmethode |
|--------|--------|-------------|
| Gemiddelde sessieduur | > 3 minuten | Trending omhoog |
| Commands per sessie | > 10 | Trending omhoog |
| Return visitors | > 15% | localStorage tracking |
| Positieve feedback | > 3.5/5 sterren | Feedback widget |
| Organisch zoekverkeer | > 30% van totaal | Search Console |
| Tutorial completion | > 40% voltooit tutorial | Event tracking |

### Fase 4: Volwassenheid (Maand 7-12)
**Doel:** Duurzame groei en monetization

| Metric | Target | Meetmethode |
|--------|--------|-------------|
| Gemiddelde sessieduur | > 4 minuten | Stabiel of groeiend |
| Return visitors | > 20% | Loyaliteit metric |
| Affiliate CTR | > 2% | Indien geïmplementeerd |
| Email conversie | > 5% | Indien nieuwsbrief actief |
| Referral traffic | Meetbare groei | Van educatieve sites |

### Kritieke Prestatie Indicatoren (KPIs)

**Primaire KPI:** Week-over-week verbetering in sessieduur
**Secundaire KPI:** Aantal unieke commands gebruikt per gebruiker
**Tertiaire KPI:** Return visitor percentage
**Kwalitatief KPI:** User comprehension score (survey)

### Rode Vlaggen (Pivot Signalen)
- **Week 2:** Sessieduur < 30 seconden → Grote UX problemen
- **Week 4:** < 5% return rate → Value proposition probleem
- **Maand 2:** Geen groei in gebruik → Marketing of product probleem
- **Maand 3:** < 3 commands gemiddeld → Content of onboarding probleem
- **Maand 3:** Error rate > 50% → Commands te complex of help onvoldoende
- **Maand 4:** Mobiele bounce rate > 90% → Mobiele ervaring faalt

---

## 15. Buiten Scope (MVP)

### Niet in MVP
- Gebruikersaccounts en authenticatie
- Voortgang opslaan tussen sessies (behalve via localStorage)
- Multi-gebruiker interacties
- Echte netwerkverbindingen
- Werkelijke systeem kwetsbaarheden
- Certificeringssysteem
- Betalingsverwerking
- Backend/database
- Real-time multiplayer
- Social features (delen, comments)

### Wel in MVP (ter verduidelijking)
- Session-based state (localStorage)
- Anonymous analytics
- Feedback mechanisme
- Basis onboarding
- 30+ werkende commands
- Help/man systeem
- Educatieve tips
- Juridische disclaimers
- **Monetization (M5.5):** Donations (PayPal/Ko-fi), AdSense (footer/blog), Affiliate links (no backend required)

---

## 16. Afhankelijkheden

### Technische Afhankelijkheden
- Moderne webbrowser met ES6+ support
- JavaScript ingeschakeld
- localStorage beschikbaar (5MB)
- Stabiele internetverbinding voor initiële lading
- Desktop of tablet aanbevolen (mobiel ondersteund)

### Content Afhankelijkheden
- Command implementaties (30+)
- Help/man teksten voor elk command
- Educatieve tips (security context)
- Juridische teksten (reviewed)
- Privacy policy & Terms of Service

### Externe Services
- Analytics platform (GA4 → Plausible)
- Hosting (statische site hosting)
- Domain naam (hacksimulator.nl)

---

## 17. Risico's en Mitigaties

| Risico | Impact | Waarschijnlijkheid | Mitigatie |
|--------|--------|-------------------|-----------|
| Gebruikers proberen echt te hacken | Hoog | Laag | Multi-layer disclaimers, educatieve focus, juridische teksten |
| Te complex voor beginners | Hoog | Middel | Uitgebreid helpsysteem, onboarding, progressive hints |
| Te simpel voor doelgroep | Middel | Laag | Geplande uitbreiding fase 2, geavanceerde modi toekomst |
| Slechte mobiele ervaring | Middel | Middel | Adaptive touch interface, quick commands, mobile testing |
| Privacy concerns met analytics | Middel | Laag | Privacy-first approach, migratie naar Plausible, transparante policy |
| Command implementatie bugs | Hoog | Middel | Uitgebreide testing, beta testers, error logging |
| Bounce rate te hoog | Hoog | Middel | Onboarding optimalisatie, session recordings, A/B testing |
| SEO competitive landscape | Middel | Hoog | Nederlandse niche focus, kwaliteit content, backlink strategy |
| Juridische aansprakelijkheid | Hoog | Laag | Sterke disclaimers, educatieve intentie, legal review |
| Browser compatibiliteit | Middel | Laag | Cross-browser testing, progressive enhancement, polyfills |

---

## 18. Release Criteria

### MVP Klaar voor Lancering Wanneer:

**✅ Functionele Criteria (Geïmplementeerd - M0-M4 Complete):**
- [x] 30+ werkende commando's zonder errors (zie commands-list.md)
- [x] Compleet help/man systeem voor alle commando's
- [x] 3-tier error handling geïmplementeerd
- [x] Bestandssysteem volledig functioneel met reset
- [x] Command history werkt (autocomplete deferred to Post-MVP)
- [x] Onboarding flow geïmplementeerd (welkomst + hints)

**✅ Content & Legal Criteria (Geïmplementeerd - M4 Complete):**
- [x] Juridische disclaimers prominent aanwezig (multi-layer)
- [x] Privacy beleid gepubliceerd (AVG compliant)
- [x] Gebruiksvoorwaarden gepubliceerd
- [x] Cookie policy geïmplementeerd
- [x] Alle UI teksten in Nederlands
- [x] Educatieve tips bij alle security tools

**✅ Analytics & Feedback Criteria (Geïmplementeerd - M4 Complete):**
- [x] Analytics geïmplementeerd (GA4 met IP anonymization)
- [x] Cookie consent banner actief
- [x] Feedback mechanisme actief (floating button - UI only, logic post-MVP)
- [x] Event tracking voor alle commands
- [x] Error logging geïmplementeerd

**🔵 Technische Validatie Criteria (M5 Testing - In Progress):**
- [ ] Mobiel responsive (getest op 3+ devices: iOS, Android, tablet) - TO TEST
- [x] Load tijd < 3 seconden op 4G (gemeten: ~2.0s LCP)
- [x] Time to Interactive < 3 seconden (Lighthouse verified)
- [x] Geen kritieke bugs (0 console errors in productie)
- [ ] Browser compatibility getest (Chrome, Firefox, Safari, Edge) - TO TEST
- [x] localStorage functionaliteit getest
- [x] Bundle size < 500KB (299 KB = 40% margin)

**🔵 Kwaliteitsborging (M5 Testing - In Progress):**
- [ ] Getest door minimaal 5 beta testers - TO DO
- [ ] Feedback van beta testers verwerkt - TO DO
- [ ] Accessibility basis getest (toetsenbord navigatie) - TO TEST
- [x] Performance profiling gedaan (Lighthouse 88/100/100/100)
- [ ] Security review (XSS, CSP) - TO REVIEW

**✅ Deployment Criteria (COMPLETED):**
- [x] GitHub repository live (https://github.com/JanWillemWubkes/hacksimulator)
- [x] Netlify deployment actief (https://famous-frangollo-b5a758.netlify.app/)
- [x] HTTPS certificaat actief
- [x] Site bereikbaar en functioneel (HTTP 200 OK verified)

### Post-Launch Success Criteria (Week 1)

**Kwantitatief:**
- [ ] > 50 unieke bezoekers
- [ ] > 50% voert minstens 1 command uit
- [ ] < 5% JavaScript error rate
- [ ] Gemiddeld > 3 commands per sessie
- [ ] < 80% bounce rate

**Kwalitatief:**
- [ ] Minimaal 5 bruikbare feedback responses
- [ ] Geen kritieke bug reports
- [ ] Positieve sentiment in feedback (>60%)

### Exit Criteria per Fase

**Wanneer stoppen met MVP en naar Fase 2:**
- 3 maanden live
- Minimaal 500 unieke gebruikers
- Sessieduur > 2 minuten gemiddeld
- Return rate > 10%
- Duidelijke user feedback over gewenste features
- Budget beschikbaar voor fase 2

**Pivot Overwegen Als:**
- Na 2 maanden < 100 gebruikers (marketing probleem)
- Bounce rate blijft > 85% (fundamenteel UX probleem)
- Sessieduur blijft < 1 minuut (value proposition probleem)
- Negatieve feedback dominant (concept probleem)

---

## 19. Content Creatie Proces

### 19.1 Help Text Format (per command)

Elke command implementatie heeft:

1. **Synopsis:** Eén regel wat het doet
2. **Gebruik:** Syntax + parameters
3. **Voorbeelden:** 2-3 concrete voorbeelden
4. **Beveiligingsnotitie:** Waarom relevant voor hacking
5. **Gerelateerd:** Links naar gerelateerde commands

**Template:**
```
NAAM
    [command] - [korte beschrijving]

GEBRUIK
    [command] [opties] [argumenten]

VOORBEELDEN
    [command] [voorbeeld1]          [uitleg]
    [command] [voorbeeld2]          [uitleg]

BEVEILIGINGSCONTEXT
    [Waarom dit command belangrijk is voor ethisch hacken]
    [Reële use cases]
    [Waarschuwingen]

GERELATEERD
    [related-command1], [related-command2]
```

### 19.2 Command Implementatie Checklist

Voor elke nieuwe command:
- [ ] Realistische output format
- [ ] Error handling (verkeerde args, permissions)
- [ ] Educatieve tip geïmplementeerd
- [ ] Mobile-friendly output (max 40 chars voor mobiel)
- [ ] Help tekst geschreven
- [ ] Man page geschreven
- [ ] Getest op 3 devices
- [ ] Security context uitgelegd
- [ ] Code review gedaan

### 19.3 Tone of Voice Guidelines

**DO:**
- Gebruik "je" (niet "u")
- Wees bemoedigend ("Goed bezig!", "Nice!")
- Leg technische termen uit
- Geef context waarom iets belangrijk is
- Gebruik actieve taal

**DON'T:**
- Neerbuigend zijn ("Dat had je moeten weten")
- Teveel jargon zonder uitleg
- Aannames maken over kennis
- Gebruiker beschuldigen bij fouten
- Te formeel ("U dient...")

### 19.4 Content Ownership

**Wie doet wat:**
- **Commands implementatie:** Development team
- **Help/man teksten:** Development team (first draft)
- **Educational tips:** Security expert review
- **Juridische teksten:** Legal counsel review
- **Privacy policy:** Legal + compliance review
- **Marketing copy:** Marketing (post-MVP)
- **Tutorial scenarios:** Content writer (fase 2)

---

## 20. Toekomstige Overwegingen (Post-MVP)

### Fase 2 (Maand 4-6)
- Guided tutorial scenarios
- Voortgang tracking systeem
- Uitdagingen/challenges
- Verbeterde analytics (migratie Plausible)
- Command output history
- Session export functie

### Fase 3 (Maand 7-12)
- Certificeringssysteem
- Geavanceerde moeilijkheidsgraden
- Custom scenario's upload
- Community features (delen van scores)
- Integratie met leerplatforms
- **Freemium model** (premium subscriptions, enterprise licensing) - **CONDITIONAL** (requires backend build)

### Lange Termijn (Jaar 2+)
- API voor onderwijsinstellingen
- Multi-user competities
- Live hacking events
- Meertalige ondersteuning (Engels)
- Mobile app (native)
- Premium features (freemium model)
- Corporate training modules

---

## 21. Monetization Strategy

### Overzicht

HackSimulator.nl hanteert een gefaseerde monetisatie strategie die de educatieve missie voorop stelt. We beginnen met passive revenue streams (Phase 1) en schaalen naar freemium model (Phase 3) op basis van bewezen marktvalidatie.

**Kernprincipes:**
- Educational mission first (revenue NEVER compromises learning)
- Privacy-first (GDPR/AVG compliance mandatory)
- Youth-friendly (no aggressive monetization tactics)
- Data-driven (validate Phase 1 before investing in backend)
- Transparency (all affiliate links disclosed)

---

### Phase 1: Passive Revenue (MVP, Maand 1-3)

**Target:** €80-300/month
**Implementation:** M5.5 Monetization MVP (15-17 uur)
**Dependencies:** M5 Testing & Launch complete

**Components:**

1. **Google AdSense** (€50-150/month)
   - Footer banner (728x90 desktop, 320x50 mobile)
   - Blog sidebar (300x250)
   - NEVER in terminal output
   - Requires GDPR consent (extend existing cookie banner)
   - Bundle impact: +15-20KB

2. **Affiliate Marketing** (€20-100/month)
   - Bol.com Partner Program (7% commission) - Hacking books
   - Udemy Affiliate (10% commission) - Security courses
   - TryHackMe Affiliate (15% recurring) - Premium subscriptions
   - Skillshare Affiliate (40% first payment) - Educational platform
   - Amazon Associates (3-5%) - Hardware (Raspberry Pi, WiFi adapters)
   - All links disclosed with `rel="sponsored"` + visual banner
   - Bundle impact: +2KB

3. **Donations** (€10-50/month)
   - PayPal.me link in footer
   - Optional: Ko-fi account (€3 default donation)
   - Zero bundle impact (external link)
   - No GDPR requirements (external processor)

**Privacy Commitment:** All monetization respects GDPR/AVG. AdSense requires explicit user consent via existing cookie consent banner (extended with "Advertising Cookies" toggle).

**Success Criteria:**
- AdSense CTR >1%
- Affiliate clicks >10/month
- Donations: 1-3/month
- Bundle size increase ≤20KB (total <340KB)

---

### Phase 2: Content Monetization (Maand 4-6, post-M6)

**Target:** €280-1300/month (cumulative with Phase 1)
**Implementation:** Post-M6 Tutorial System
**Dependencies:** M6 complete, Phase 1 validated

**Components:**

1. **Sponsored Tutorials** (€200-500 per sponsor)
   - Partner with cybersecurity companies (NordVPN, Kaspersky, Hack The Box)
   - Example: "Intro to VPN Security" sponsored by NordVPN
   - Sponsor logo on tutorial header (with disclosure)
   - Target: 1-2 sponsors

2. **Premium Affiliate Content** (€50-150/month)
   - In-depth guides (1000+ words each)
   - "Complete Learning Path: Van Beginner tot Ethical Hacker"
   - Affiliate links on tutorial completion pages
   - Target: 5-10 conversions/month

3. **Donation Optimization** (incremental increase)
   - Post-tutorial prompt: "Vond je dit nuttig? Support ons!"
   - A/B test messaging
   - Target: >3% conversion rate

**Success Criteria:**
- Sponsorships: 1-2 secured
- Affiliate conversions: 5-10 sales/month
- Tutorial → donation rate >3%

---

### Phase 3: Freemium Model (Maand 7-12, post-M7) - **CONDITIONAL**

**Target:** €630-3100/month (cumulative with Phase 1+2)
**Implementation:** M8 or new M10 milestone (60-80 uur backend build)
**Trigger:** If Phase 1 revenue >€200/month after 3 months

**Components:**

1. **Premium Subscription** (€5/month or €50/year)
   - **Free Tier:**
     - 30 commands (current MVP)
     - 3 tutorials (basic scenarios)
     - Text certificates (ASCII art)
     - Ads present
   - **Premium Tier:**
     - 60+ commands (advanced security tools)
     - All tutorials (10+ scenarios)
     - PDF certificates (professional)
     - Ad-free experience
     - Priority support (<24h email response)
   - Target: 5-10% conversion rate

2. **Enterprise Licensing** (€500-2000/year for schools)
   - Bulk licensing (50+ students)
   - Teacher dashboard (progress tracking)
   - Custom branding
   - Dedicated support
   - Target: 1-2 schools

**Backend Infrastructure:**
- Node.js + Express.js API
- PostgreSQL database (or Supabase managed)
- JWT authentication
- Stripe (international) or Mollie (Dutch focus) payment gateway
- Hosting: Railway/Fly.io (~€10/month) or Netlify Functions (serverless)

**Success Criteria:**
- Freemium conversion >5%
- Monthly Recurring Revenue (MRR) >€500
- Enterprise: 1-2 schools signed (€1000-2000/year)
- Churn rate <10%

---

### Revenue Projections

**Conservative Scenario:**
- Month 1: €80
- Month 3: €150
- Month 6: €300 (Phase 2)
- Month 12: €630 (Phase 3)

**Optimistic Scenario:**
- Month 1: €150
- Month 3: €300
- Month 6: €1000 (Phase 2)
- Month 12: €2000 (Phase 3)

**Break-Even Timeline:**
- At €300/month net profit: 50 months
- At €1000/month net profit: 15 months
- At €2000/month net profit: 7 months

*Development cost: MVP (280h) + Phase 1 (17h) = 297h × €50/hour = €14,850*

---

### Decision Points & Risk Mitigation

**Decision Point (Month 3):**
- **If revenue >€200/month:** Proceed to Phase 3 backend build (60-80 hours investment)
- **If revenue €100-200/month:** Implement Phase 2 sponsorships, defer Phase 3
- **If revenue <€100/month:** PAUSE monetization, focus on traffic growth (SEO, content marketing)

**Risk Mitigation:**
1. **AdSense Rejection:** Emphasize "EDUCATIONAL SIMULATOR" in application, reference legal disclaimers. Fallback: Media.net, Ezoic.
2. **Low Conversion:** Diversify revenue streams (ads + affiliates + donations). Target audience has limited purchasing power.
3. **Educational Integrity:** Strict 80/20 rule (80% value, 20% monetization). NEVER paywall basic commands.
4. **Backend Cost Overruns:** Use serverless (Netlify Functions) for MVP backend (€0-10/month). Upgrade only when MRR >€500/month.

---

### Ethical Guidelines

**Red Lines (NEVER):**
- Ads in terminal output
- Paywall basic commands (30 MVP commands must stay free)
- Dark patterns (guilt-tripping, manipulative upselling)
- Gambling mechanics (loot boxes)
- Data selling

**Always:**
- Disclose affiliate links (`rel="sponsored"` + visual banner)
- Obtain explicit consent for AdSense (GDPR/AVG)
- Keep free tier valuable (not crippled)
- Prioritize educational mission over revenue

---

### Implementation Dependencies

**Phase 1 (M5.5):**
- No backend required
- Extend existing cookie consent banner
- Update legal docs (cookies.html, privacy.html, terms.html)
- Create affiliate-disclosure.html
- Add donation button to footer
- Implement ad placements

**Phase 2 (post-M6):**
- Tutorial system complete
- Blog infrastructure for sponsored content
- Sponsor outreach (business development)

**Phase 3 (post-M7/M8):**
- Backend infrastructure (40-60 hours)
- Authentication system (JWT)
- Payment gateway (Stripe/Mollie)
- Database (PostgreSQL)
- Feature gating logic

---

## Bijlage A: Commando Categorieën

### Essentiële Commando Groepen voor MVP:

**1. Systeem Commando's (Basis navigatie en help)**
- clear, help, man, history, echo, date, whoami

**2. Bestandssysteem Commando's**
- ls, cd, pwd, cat, mkdir, touch, rm, cp, mv, find, grep

**3. Netwerk Commando's**
- ping, nmap, ifconfig, netstat, whois, traceroute

**4. Security Tools**
- hashcat, hydra, sqlmap, metasploit, nikto

**Totaal MVP: 30 commands**

*Voor gedetailleerde command specificaties, zie: commands-list.md*

---

## Bijlage B: Virtual Filesystem Structure

```
/
├── home/user/
│   ├── documents/
│   │   ├── passwords.txt    # Bevat nep wachtwoorden
│   │   └── notes.txt        # Bevat hints
│   ├── downloads/
│   │   └── backup.zip       # Simulatie bestand
│   └── .ssh/                # Verborgen directory
│       └── id_rsa           # Nep SSH key (educatief)
├── etc/
│   ├── passwd               # Gebruikersinformatie
│   ├── shadow               # Password hashes (restricted)
│   └── hosts                # Network hosts
├── var/
│   └── log/
│       ├── auth.log         # Login pogingen
│       └── syslog           # Systeem logs
└── tmp/                     # Tijdelijke bestanden
```

---

## Verantwoordelijkheden

### Product Owner
- Goedkeuring van requirements
- Prioritering van features
- Acceptatie criteria validatie
- Budget allocatie
- Stakeholder communicatie

### Development Team
- Technische implementatie
- Command ontwikkeling
- Testing en kwaliteitsborging
- Performance optimalisatie
- Bug fixes

### Content Team
- Help/man teksten (first draft: dev, review: content)
- Educational tips
- Tutorial scenarios (fase 2)
- Marketing copy (post-MVP)

### Legal/Compliance
- Review juridische teksten
- Privacy policy
- Gebruiksvoorwaarden
- AVG/GDPR compliance
- Disclaimer goedkeuring

### Stakeholders
- Feedback op gebruikerservaring
- Validatie educatieve waarde
- Compliance met ethische richtlijnen
- Beta testing

---

## Goedkeuring

Dit document is goedgekeurd voor de ontwikkeling van HackSimulator.nl MVP.

**Versie Historie:**
- **v1.0** (Dec 2024) - Initiële versie voor MVP ontwikkeling
- **v1.1** (14 Okt 2025) - Uitgebreide update met:
  - Onboarding & FTUE strategie
  - Error handling & help systeem (3-tier)
  - Mobiele optimalisatie details
  - Privacy-first analytics approach
  - Juridische disclaimers (multi-layer)
  - Technische randvoorwaarden (CSS, architectuur)
  - Content creatie proces
  - Accessibility enhancements
  - Scenario's implementatie strategie
  - Uitgebreide succesmetingen (kwalitatief + kwantitatief)
  - Tone of voice guidelines
  - Nederlandse taal focus
  - Bestandssysteem behavior
- **v1.2** (17 Okt 2025) - Scope clarification & Post-MVP features:
  - Autocomplete, gestures, continue → Post-MVP
  - MVP vs. Fase 2 features explicit distinction
  - Documentation consistency updates
- **v1.3** (18 Okt 2025) - Deployment updates:
  - Live URL toegevoegd (Netlify)
  - GitHub repository link
  - M0-M4 completion status (100%)
- **v1.4** (19 Okt 2025) - Browser support specification:
  - Minimum browser versions gedocumenteerd (Chrome 61+, Firefox 60+, Safari 11+, Edge 16+)
  - IE11 explicitly marked as not supported
  - Technical rationale for minimum versions (ES6 modules, CSS variables)
- **v1.5** (2 Dec 2025) - Monetization Strategy:
  - New Section 21: Comprehensive monetization strategy (Phase 1-3)
  - M5.5 Monetization MVP milestone (15 tasks, 15-17h)
  - AdSense, Affiliate marketing, Donations (€80-300/month target)
  - Updated §6.3 with AdSense privacy/GDPR requirements
  - Updated §15 to include monetization in MVP scope
  - Updated §20 to clarify freemium as Phase 3 (conditional)
  - Revenue projections, break-even analysis, ethical guidelines
- **v1.6** (15 Dec 2025) - Document Sync & Scope Clarification (Sessie 85):
  - Corrected development status: 143/295 tasks (48.5% totaal scope)
  - Clarified MVP vs Post-MVP breakdown (153 vs 142 tasks)
  - Synced update datums across all documentation
  - Updated M5.5 progress: 2/15 tasks (13%)

**Document Status:** Definitief - ✅ **LIVE on Netlify!**

**Laatste review:** 15 december 2025
**Development Status:** 143/295 tasks completed (48.5% totaal scope)
**MVP Progress:** 141/153 tasks (92.3%) - M0-M4 (100%), M5 (10/37 - 27%), M5.5 (2/15 - 13%)
**Post-MVP:** M6-M9 (0/142 tasks) - Planned for Phase 2-3

---

**Volgende stappen:**
1. Development team review van technische haalbaarheid
2. Creëer technical specification document (implementatie details)
3. Sprint planning voor MVP ontwikkeling
4. Beta tester recruitment voorbereiden
5. Legal review van disclaimer & privacy teksten
