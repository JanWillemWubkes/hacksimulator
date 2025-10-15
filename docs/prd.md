# Product Requirements Document - HackSimulator.nl
**Versie:** 1.1
**Status:** M0+M1 Completed (Development in Progress)
**Laatst bijgewerkt:** 15 oktober 2025

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
- Heeft gehoord over ethisch hacken en cybersecurity
- Wil verkennen zonder verplichting of risico
- Heeft begeleiding en duidelijke uitleg nodig
- Overweegt mogelijk een cybersecurity carrière

### Secundair: "De Student"
- Studeert IT of Informatica
- Heeft praktische ervaring nodig met security concepten
- Wil oefenen voor certificeringen
- Heeft educatieve content nodig naast tools

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
- **FR1.4:** Systeem moet command autocomplete ondersteunen met Tab-toets
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
- **FR7.2:** Systeem moet exit intent survey tonen na meaningvolle sessie (2+ min)
- **FR7.3:** Systeem moet command-level feedback mogelijk maken (thumbs up/down)
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

**Gesture Support:**
- Swipe up: command history
- Swipe down: hide keyboard
- Long press: paste
- Double tap: select command

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
| Browser | Versies | Percentage | Priority |
|---------|---------|------------|----------|
| Chrome | Laatste 2 | ~65% | Hoog |
| Firefox | Laatste 2 | ~10% | Hoog |
| Safari | Laatste 2 | ~15% | Hoog |
| Edge | Laatste 2 | ~5% | Middel |
| Mobile | iOS 14+, Android 10+ | ~5% | Middel |

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
Type 'continue' om je sessie te hervatten
Type 'reset' om opnieuw te beginnen

$ reset
Systeem hersteld naar oorspronkelijke staat.
```

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

**Functionele Criteria:**
- [ ] 30+ werkende commando's zonder errors (zie commands-list.md)
- [ ] Compleet help/man systeem voor alle commando's
- [ ] 3-tier error handling geïmplementeerd
- [ ] Bestandssysteem volledig functioneel met reset
- [ ] Command history en autocomplete werken
- [ ] Onboarding flow geïmplementeerd (welkomst + hints)

**Technische Criteria:**
- [ ] Mobiel responsive (getest op 3+ devices: iOS, Android, tablet)
- [ ] Load tijd < 3 seconden op 4G (gemeten)
- [ ] Time to Interactive < 3 seconden
- [ ] Geen kritieke bugs (0 console errors in productie)
- [ ] Browser compatibility getest (Chrome, Firefox, Safari, Edge)
- [ ] localStorage functionaliteit getest
- [ ] Bundle size < 500KB

**Content & Legal Criteria:**
- [ ] Juridische disclaimers prominent aanwezig (multi-layer)
- [ ] Privacy beleid gepubliceerd (AVG compliant)
- [ ] Gebruiksvoorwaarden gepubliceerd
- [ ] Cookie policy geïmplementeerd
- [ ] Alle UI teksten in Nederlands
- [ ] Educatieve tips bij alle security tools

**Analytics & Feedback Criteria:**
- [ ] Analytics geïmplementeerd (GA4 met IP anonymization)
- [ ] Cookie consent banner actief
- [ ] Feedback mechanisme actief (floating button + exit intent)
- [ ] Event tracking voor alle commands
- [ ] Error logging geïmplementeerd

**Kwaliteitsborging:**
- [ ] Getest door minimaal 5 beta testers
- [ ] Feedback van beta testers verwerkt
- [ ] Accessibility basis getest (toetsenbord navigatie)
- [ ] Performance profiling gedaan
- [ ] Security review (XSS, CSP)

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
- Affiliate partnerships (cybersecurity cursussen)

### Lange Termijn (Jaar 2+)
- API voor onderwijsinstellingen
- Multi-user competities
- Live hacking events
- Meertalige ondersteuning (Engels)
- Mobile app (native)
- Premium features (freemium model)
- Corporate training modules

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
- **v1.1** (Okt 2025) - Uitgebreide update met:
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

**Document Status:** Definitief - Goedgekeurd voor Ontwikkeling

**Laatste review:** 15 oktober 2025
**Development Status:** M0 (Project Setup) + M1 (Foundation) completed - M2 (Filesystem Commands) in progress

---

**Volgende stappen:**
1. Development team review van technische haalbaarheid
2. Creëer technical specification document (implementatie details)
3. Sprint planning voor MVP ontwikkeling
4. Beta tester recruitment voorbereiden
5. Legal review van disclaimer & privacy teksten
