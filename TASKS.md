# TASKS.md - HackSimulator.nl

**Laatst bijgewerkt:** 13 oktober 2025
**Status:** MVP Development
**Sprint:** Pre-Development

---

## 📊 Voortgang Overzicht

**Totaal:** 15 / 143 taken voltooid (10.5%)

| Mijlpaal | Status | Taken | Percentage |
|----------|--------|-------|------------|
| M0: Project Setup | ✅ Voltooid | 15/15 | 100% |
| M1: Foundation | 🟡 In uitvoering | 4/20 | 20% |
| M2: Filesystem Commands | ⚪ Niet gestart | 0/25 | 0% |
| M3: Network & Security | ⚪ Niet gestart | 0/28 | 0% |
| M4: UX & Polish | ⚪ Niet gestart | 0/22 | 0% |
| M5: Testing & Launch | ⚪ Niet gestart | 0/33 | 0% |

---

## 🎯 Huidige Focus

**Actieve Mijlpaal:** M1 - Foundation
**Volgende Stappen:**
1. Terminal Engine implementeren (core/)
2. UI Components bouwen (ui/)
3. 7 System Commands implementeren

---

## 📋 Mijlpalen & Taken

### M0: Project Setup (Week 0) ✅ VOLTOOID
**Doel:** Development environment klaar voor eerste code
**Tijdsinschatting:** 1-2 dagen
**Status Update:** ✅ Volledig voltooid (Sessie 5 - 14 oktober 2025)

#### Repository & Git
- [x] Git repository geïnitialiseerd (main branch)
- [x] .gitignore geconfigureerd (node_modules, .DS_Store, .env)
- [x] Initiële commits met framework bestanden
- [ ] GitHub remote repository (skipped per user request)
- [x] Branch strategie: main only (MVP simplicity)

#### Project Structuur
- [x] Root folders (src/, styles/, docs/, assets/, tests/)
- [x] src/ subfolders (core/, commands/system/, ui/, utils/, filesystem/, help/, analytics/)
- [x] index.html skeleton (voltooid Sessie 2)
- [x] Alle commands/ subfolders (system, filesystem, network, security, special)

#### Development Environment
- [x] Code editor (VS Code / Cursor)
- [x] Live Server beschikbaar
- [x] ESLint configuratie (.eslintrc.json) - ES6, browser env
- [x] Prettier configuratie (.prettierrc) - single quotes, 2 spaces
- [x] Browser DevTools gereed

#### Documentatie
- [x] PRD v1.1 (reeds voltooid)
- [x] CLAUDE.md v3.1 (two-tier docs)
- [x] PLANNING.md v1.1 (architectuur compleet)
- [x] TASKS.md (dit bestand)
- [x] SESSIONS.md (sessie logs)

---

### M1: Foundation (Week 1-2)
**Doel:** Core terminal engine + basis commands werkend
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M0 voltooid

#### HTML & CSS Foundation
- [x] index.html structuur (semantic HTML5) - ✅ Voltooid (Sessie 2)
- [x] main.css met CSS Variables - ✅ Voltooid (Sessie 2-3)
- [x] terminal.css (terminal styling) - ✅ Voltooid (Sessie 2-3)
- [x] Responsive meta tags - ✅ Voltooid (Sessie 2)
- [ ] Favicon toevoegen (optioneel)

#### Terminal Engine (Core)
- [ ] `src/main.js` - Entry point en initialisatie
- [ ] `src/core/terminal.js` - Terminal engine class
- [ ] `src/core/parser.js` - Command parser (args, flags)
- [ ] `src/core/registry.js` - Command registry pattern
- [ ] `src/core/history.js` - Command history manager
- [ ] Arrow key navigation (↑↓ voor history)

#### UI Components
- [ ] `src/ui/renderer.js` - Output rendering
- [ ] `src/ui/input.js` - Keyboard event handling
- [ ] Input focus management
- [ ] Output scrolling automatisch naar beneden
- [ ] Cursor blink animation (CSS)

#### Virtual Filesystem (Basis)
- [ ] `src/filesystem/vfs.js` - VFS core class
- [ ] `src/filesystem/structure.js` - Initial filesystem data
- [ ] Current working directory (cwd) tracking
- [ ] Path resolution (absolute/relative)

#### System Commands (7 commands)
- [ ] `clear` - Clear screen
- [ ] `help` - Lijst van beschikbare commands
- [ ] `man [cmd]` - Manual pages (basis structuur)
- [ ] `history` - Toon command history
- [ ] `echo [text]` - Print tekst
- [ ] `date` - Huidige datum/tijd
- [ ] `whoami` - Toon gebruikersnaam

#### Testing & Validation
- [ ] Test alle 7 system commands
- [ ] Test command parser (args, flags, quotes)
- [ ] Test history navigatie
- [ ] Cross-browser test (Chrome, Firefox)
- [ ] Mobile responsive test (basis)

---

### M2: Filesystem Commands (Week 3-4)
**Doel:** Volledig functioneel virtual filesystem
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M1 voltooid

#### Filesystem Persistence
- [ ] `src/filesystem/persistence.js` - localStorage sync
- [ ] Save state bij elke filesystem wijziging
- [ ] Load state bij page load
- [ ] Reset functionaliteit (restore original)
- [ ] Error handling (localStorage vol/disabled)

#### Basis Navigatie Commands (4)
- [ ] `ls` - List files/directories
- [ ] `ls -l` - Detailed listing
- [ ] `ls -a` - Show hidden files (.ssh, etc.)
- [ ] `cd [path]` - Change directory
- [ ] `cd ..` - Parent directory
- [ ] `cd ~` - Home directory
- [ ] `pwd` - Print working directory

#### File Reading Commands (2)
- [ ] `cat [file]` - Show file contents
- [ ] `cat` error handling (file not found, is directory)
- [ ] Permission system (basis - /etc/shadow restricted)

#### File Manipulation Commands (5)
- [ ] `mkdir [dir]` - Create directory
- [ ] `touch [file]` - Create empty file
- [ ] `rm [file]` - Remove file
- [ ] `rm -r [dir]` - Remove directory recursively
- [ ] `cp [src] [dst]` - Copy file
- [ ] `mv [src] [dst]` - Move/rename file

#### Search Commands (2)
- [ ] `find [pattern]` - Find files by name
- [ ] `grep [pattern]` - Search in file contents
- [ ] `grep` met educatieve output (laat zien welke regel)

#### Special Commands
- [ ] `reset` - Restore filesystem to original state
- [ ] `continue` - Restore saved session (welkom bericht)

#### Testing & Validation
- [ ] Test alle filesystem operations
- [ ] Test persistence (save & load)
- [ ] Test reset functionaliteit
- [ ] Test edge cases (lange bestandsnamen, special chars)
- [ ] Test permissions system
- [ ] Cross-browser localStorage test
- [ ] Mobile test (40 char output width)

---

### M3: Network & Security Commands (Week 5-6)
**Doel:** Educational security tools werkend
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M2 voltooid

#### Network Commands (6)
- [ ] `ping [host]` - Test connectivity (gesimuleerd)
- [ ] `nmap [host]` - Port scanner (80/20 output)
- [ ] `nmap` met educatieve tips
- [ ] `ifconfig` - Network configuration
- [ ] `netstat` - Network statistics
- [ ] `whois [domain]` - Domain information
- [ ] `traceroute [host]` - Network path tracing

#### Security Tools (5)
- [ ] `hashcat [hash]` - Password hash cracking (gesimuleerd)
- [ ] `hydra [target]` - Brute force simulation
- [ ] `sqlmap [url]` - SQL injection demonstratie
- [ ] `metasploit` - Framework intro (gesimuleerd)
- [ ] `nikto [target]` - Web vulnerability scanner

#### Educational Layer
- [ ] Beveiligingstips bij alle security tools
- [ ] Juridische warnings (offensive tools)
- [ ] "Doorgaan? [j/n]" confirmatie bij offensive tools
- [ ] Inline uitleg (← pijltjes) bij output
- [ ] Realistische maar simplified output (80/20)

#### Help System (3-Tier)
- [ ] `src/help/help-system.js` - 3-tier logic
- [ ] Tier 1: Fuzzy matching voor typos
- [ ] Tier 2: Progressive hints na herhaalde fouten
- [ ] Tier 3: Man pages (volledig)
- [ ] `src/help/man-pages.js` - Nederlandse man pages (alle 30 commands)
- [ ] `src/help/tips.js` - Educatieve tips database

#### Fuzzy Matching
- [ ] `src/utils/fuzzy.js` - Levenshtein distance
- [ ] "Bedoelde je: [suggestion]?" bij typos
- [ ] Top 3 suggestions bij onduidelijke input

#### Testing & Validation
- [ ] Test alle network commands
- [ ] Test alle security tools
- [ ] Test educatieve output (tips aanwezig)
- [ ] Test juridische warnings (tonen correct)
- [ ] Test fuzzy matching (common typos)
- [ ] Test help system (alle 3 tiers)
- [ ] Test man pages (alle 30 commands compleet)
- [ ] Cross-browser test
- [ ] Mobile test (output leesbaarheid)

---

### M4: UX & Polish (Week 7-8)
**Doel:** Onboarding, mobile, legal, analytics
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M3 voltooid

#### Onboarding Flow
- [ ] `src/ui/onboarding.js` - FTUE logic
- [ ] Welkomstbericht bij eerste bezoek (3 regels)
- [ ] "Type 'help' om te beginnen" hint
- [ ] Na 1e command: "Goed bezig!" encouragement
- [ ] Na 3-5 commands: Tutorial suggestie
- [ ] Persistent hint (rechts onderin, verdwijnt na 5 commands)
- [ ] localStorage: first_visit flag
- [ ] Terugkerende bezoeker: direct naar terminal

#### Mobile Optimalisaties
- [ ] `src/ui/mobile.js` - Touch & gesture handling
- [ ] Mobile CSS breakpoints (< 768px)
- [ ] Quick Commands buttons (tap to insert)
- [ ] Virtual keyboard helpers ([-, /, ., |, ~])
- [ ] Swipe up: command history
- [ ] Long press: paste
- [ ] Responsive output (40 chars max mobile)
- [ ] Touch-friendly tap targets (44x44px)

#### Legal & Compliance
- [ ] `assets/legal/privacy.html` - Privacy Policy (Nederlands)
- [ ] `assets/legal/terms.html` - Gebruiksvoorwaarden
- [ ] `assets/legal/cookies.html` - Cookie Policy
- [ ] Juridische disclaimer modal (eerste bezoek)
- [ ] "Ik begrijp het - Verder" button
- [ ] Footer met links (Privacy, Terms, Contact)
- [ ] localStorage: legal_accepted flag

#### Analytics Setup
- [ ] `src/analytics/tracker.js` - Abstraction layer
- [ ] `src/analytics/events.js` - Event definitions
- [ ] `src/analytics/consent.js` - Cookie consent banner
- [ ] Google Analytics 4 integratie
- [ ] IP anonymization enabled
- [ ] Event tracking: command_executed
- [ ] Event tracking: session_start/end
- [ ] Event tracking: error_occurred
- [ ] Cookie consent banner (AVG compliant)
- [ ] Consent opslaan in localStorage

#### Feedback Mechanisme
- [ ] Floating feedback button (rechts onderin)
- [ ] Feedback modal (5-star + optioneel comment)
- [ ] Exit intent detection (na 2+ min sessie)
- [ ] Exit survey (snelle rating)
- [ ] Command-level feedback (👍👎 na security tools)
- [ ] Feedback opslaan (voor nu: console.log, later: API)

#### Styling Polish
- [ ] Animations polish (cursor blink, transitions)
- [ ] Error messages styling (rood)
- [ ] Warnings styling (geel)
- [ ] Success messages styling (groen)
- [ ] Focus states (keyboard accessibility)
- [ ] Loading states (bij "scanning..." etc.)

---

### M5: Testing & Launch (Week 9-10)
**Doel:** Production-ready en live deployment
**Tijdsinschatting:** 10-14 dagen
**Dependencies:** M4 voltooid

#### Beta Testing Voorbereiding
- [ ] Beta testing checklist opstellen
- [ ] 5 beta testers werven (2 beginners, 2 students, 1 dev)
- [ ] Feedback formulier maken (Google Forms)
- [ ] Test scenarios document maken
- [ ] Screen recording instructies (optioneel)

#### Beta Testing Uitvoering
- [ ] Beta test week 1: Beginners (observeren onboarding)
- [ ] Beta test week 1: Studenten (feature testing)
- [ ] Beta test week 1: Developer (technical review)
- [ ] Feedback verzamelen en analyseren
- [ ] Prioriteren van issues (critical vs. nice-to-have)

#### Bug Fixes & Improvements
- [ ] Critical bugs fixen (P0 - blokkerende issues)
- [ ] High priority bugs fixen (P1 - major issues)
- [ ] Medium priority improvements (P2 - polish)
- [ ] Accessibility fixes (keyboard navigation)
- [ ] Performance optimalisaties indien nodig

#### Cross-Browser Testing
- [ ] Chrome Windows (latest)
- [ ] Chrome macOS (latest)
- [ ] Firefox Windows (latest)
- [ ] Safari macOS (latest)
- [ ] Edge Windows (latest)
- [ ] Mobile Safari iOS 16+ (real device)
- [ ] Chrome Mobile Android 12+ (real device)

#### Performance Testing
- [ ] Lighthouse audit (target: >90 score)
- [ ] Bundle size check (<500KB hard limit)
- [ ] Load time test 4G (target: <3 sec)
- [ ] Time to Interactive (target: <3 sec)
- [ ] Memory leaks check (long session test)
- [ ] localStorage quota test (edge case)

#### Accessibility Testing
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Focus indicators zichtbaar
- [ ] Screen reader test (basis - known limitations)
- [ ] Color contrast check (4.5:1 ratio)
- [ ] Font scaling test (200% zoom)
- [ ] ARIA labels waar nodig

#### Security Review
- [ ] Content Security Policy (CSP) headers
- [ ] Input sanitization review (XSS preventie)
- [ ] localStorage security check (geen gevoelige data)
- [ ] Analytics privacy check (geen PII)
- [ ] External links: rel="noopener noreferrer"
- [ ] HTTPS only (deployment)

#### Content Review
- [ ] Alle UI teksten Nederlands (compliance check)
- [ ] Alle man pages compleet (30 commands)
- [ ] Educatieve tips bij security tools (aanwezig)
- [ ] Juridische warnings correct (offensive tools)
- [ ] Privacy Policy compleet (AVG)
- [ ] Gebruiksvoorwaarden compleet
- [ ] Cookie Policy compleet
- [ ] Disclaimer prominent (homepage + modal)

#### Production Build
- [ ] Environment variabelen (production config)
- [ ] JavaScript minificatie (Terser) - optioneel
- [ ] CSS minificatie (cssnano) - optioneel
- [ ] Gzip compressie test
- [ ] Source maps genereren (debugging)
- [ ] Final bundle size check (<500KB)

#### Deployment Setup
- [ ] Netlify account aanmaken
- [ ] Repository koppelen aan Netlify
- [ ] Custom domain configureren (hacksimulator.nl)
- [ ] HTTPS certificaat (auto via Netlify)
- [ ] Build settings configureren
- [ ] Environment variables instellen (production)

#### Pre-Launch Checklist
- [ ] Alle 30 commands werkend (manual test)
- [ ] 3-tier help system functioneel
- [ ] Onboarding flow compleet
- [ ] Mobile responsive (getest op devices)
- [ ] Legal documenten live (Privacy, Terms, Cookies)
- [ ] Analytics tracking werkend (test event)
- [ ] Cookie consent banner werkend
- [ ] Feedback mechanisme werkend
- [ ] Cross-browser getest (5+ browsers)
- [ ] Performance targets gehaald (<3sec, <500KB)

#### Launch
- [ ] Final deployment naar productie
- [ ] DNS configuratie (hacksimulator.nl)
- [ ] Smoke test op productie URL
- [ ] Analytics test (real events)
- [ ] Error monitoring actief (console.log check)
- [ ] Backup van localStorage structure (JSON export)

#### Post-Launch (Week 1)
- [ ] Daily monitoring (analytics + errors)
- [ ] Bug reports triagen
- [ ] User feedback verzamelen
- [ ] Performance metrics checken (load times)
- [ ] Success criteria evalueren (zie PRD §14)
- [ ] Hot fixes indien nodig (priority bugs)

---

## 🎯 Volgende Acties

**Nu direct te doen:**
1. [ ] GitHub repository aanmaken
2. [ ] Project structuur folders aanmaken
3. [ ] index.html skeleton opzetten
4. [ ] Live Server starten en "Hello World" testen

**Deze week:**
- M0 voltooien (Project Setup)
- Starten met M1 (Foundation)

**Deze sprint (Week 1-2):**
- M1 voltooien (Terminal Engine + 7 system commands)

---

## 📝 Notities & Beslissingen

### Architecturale Beslissingen
- **Command Pattern:** Elke command is een module met execute() functie
- **Registry Pattern:** Commands registreren in centrale registry
- **VFS in-memory:** Filesystem state in JavaScript object, sync naar localStorage

### Open Vragen
- [ ] Hosting: Netlify vs. Vercel? → **Beslissing: Netlify (zie PLANNING.md)**
- [ ] Analytics: GA4 genoeg of direct Plausible? → **Beslissing: GA4 voor MVP**
- [ ] Minification: Handmatig of build script? → **Beslissing: Optioneel, handmatig**

### Risico's & Mitigaties
- **Risico:** Bundle size >500KB → **Mitigatie:** Regelmatige size checks
- **Risico:** localStorage disabled → **Mitigatie:** Graceful degradation (session-only)
- **Risico:** Mobile te complex → **Mitigatie:** Early mobile testing (M2)

---

## 🔄 Update Instructies

**Hoe deze file gebruiken:**
1. **Voor elke sessie:** Lees welke mijlpaal actief is
2. **Tijdens development:** Check taken af zodra voltooid ([ ] → [x])
3. **Na voltooien taak:** Update voortgang percentage handmatig
4. **Nieuwe taken:** Voeg toe onder relevante mijlpaal
5. **Scope wijziging:** Update eerst PRD, dan PLANNING, dan TASKS

**Taak statussen:**
- [ ] Niet gestart
- [x] Voltooid
- [~] In uitvoering (optioneel, voor langlopende taken)
- [-] Geblokkeerd (vermeld reden in notities)

**Update volgorde bij requirements change:**
```
docs/prd.md → PLANNING.md → TASKS.md → CLAUDE.md
```

---

## 📚 Referenties

**Framework Documenten:**
- `docs/prd.md` - Product Requirements v1.1
- `PLANNING.md` - Architectuur & Tech Stack
- `CLAUDE.md` - AI Assistant Context

**Command Specs:**
- `docs/commands-list.md` - Alle 30 commands gespecificeerd

---

**Laatst bijgewerkt:** 14 oktober 2025
**Versie:** 1.2 (M0 ✅ voltooid, M1 in uitvoering)
**Totaal Taken:** 143
**Voltooide Taken:** 15 (M0: 15/15, M1: 4/20)
**Voortgang:** 10.5%

---

**🚀 Let's build HackSimulator.nl!**
