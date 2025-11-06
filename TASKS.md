# TASKS.md - HackSimulator.nl

**Laatst bijgewerkt:** 6 november 2025
**Status:** M5 Testing & Launch Phase (LIVE on Netlify) - ✅ **Cross-Browser Tests PASSING!**
**Sprint:** Help Command Visual Enhancement Complete - Phase 2/3 Planned

---

## 📊 Voortgang Overzicht

**Totaal:** 141 / 166 taken voltooid (84.9%)

| Mijlpaal | Status | Taken | Percentage |
|----------|--------|-------|------------|
| M0: Project Setup | ✅ Voltooid | 15/15 | 100% |
| M1: Foundation | ✅ Voltooid | 20/20 | 100% |
| M2: Filesystem Commands | ✅ Voltooid | 25/25 | 100% |
| M3: Network & Security | ✅ Voltooid | 28/28 | 100% |
| M4: UX & Polish | ✅ Voltooid | 43/43 | 100% |
| M5: Testing & Launch | 🔵 In uitvoering | 10/37 | 27% |
| M9: Refactor Sprint | ⏭️ Gepland | 0/19 | 0% |

---

## 🎯 Huidige Focus

**Actieve Mijlpaal:** M5 - Testing & Launch ✅ **LIVE on Netlify!**
**Current Status:** ✅ **UNBLOCKED** - All automated cross-browser tests passing (16/16)

**Volgende Stappen:**
1. ✅ GitHub repository setup (https://github.com/JanWillemWubkes/hacksimulator)
2. ✅ Netlify deployment (https://famous-frangollo-b5a758.netlify.app/)
3. ✅ Performance audit (Lighthouse 88/100/100/100)
4. ✅ Cross-browser test infrastructure (Playwright setup complete)
5. ✅ **FIXED P0-001:** Duplicate #legal-modal ID removed
6. ✅ Cross-browser tests: Chromium 8/8, Firefox 8/8 (16/16 passing)
7. [ ] Mobile real device testing (iOS, Android)

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

### M1: Foundation (Week 1-2) ✅ VOLTOOID
**Doel:** Core terminal engine + basis commands werkend
**Tijdsinschatting:** 10-12 dagen
**Status Update:** ✅ Volledig voltooid (Sessie 5 - 14 oktober 2025)
**Dependencies:** M0 voltooid

#### HTML & CSS Foundation
- [x] index.html structuur (semantic HTML5) - ✅ Voltooid (Sessie 2)
- [x] main.css met CSS Variables - ✅ Voltooid (Sessie 2-3)
- [x] terminal.css (terminal styling) - ✅ Voltooid (Sessie 2-3)
- [x] Responsive meta tags - ✅ Voltooid (Sessie 2)
- [ ] Favicon toevoegen (optioneel, skipped)

#### Terminal Engine (Core)
- [x] `src/main.js` - Entry point en initialisatie (ES6 modules)
- [x] `src/core/terminal.js` - Terminal engine met fuzzy matching
- [x] `src/core/parser.js` - Command parser (args, flags, quotes)
- [x] `src/core/registry.js` - Command registry pattern
- [x] `src/core/history.js` - Command history met localStorage
- [x] Arrow key navigation (↑↓ voor history)

#### UI Components
- [x] `src/ui/renderer.js` - Output rendering met XSS protectie
- [x] `src/ui/input.js` - Keyboard event handling
- [x] Input focus management (auto-focus, click refocus)
- [x] Output scrolling automatisch naar beneden
- [x] Native browser cursor (geen custom CSS cursor)

#### Virtual Filesystem (Basis)
- [x] `src/filesystem/vfs.js` - Full VFS met POSIX-like paths
- [x] `src/filesystem/structure.js` - Complete filesystem tree
- [x] `src/filesystem/persistence.js` - localStorage sync
- [x] Current working directory (cwd) tracking
- [x] Path resolution (absolute/relative/~/../.)
- [x] Permission system (restricted files)

#### System Commands (7 commands)
- [x] `clear` - Clear screen
- [x] `help` - Lijst van beschikbare commands (grouped by category)
- [x] `man [cmd]` - Manual pages (basic version)
- [x] `history` - Toon command history (with -c to clear)
- [x] `echo [text]` - Print tekst
- [x] `date` - Huidige datum/tijd
- [x] `whoami` - Toon gebruikersnaam

#### Testing & Validation
- [x] Test alle 7 system commands - ✅ Werkend (browser test)
- [x] Test command parser (args, flags, quotes) - ✅ Werkend
- [x] Test history navigatie (↑↓) - ✅ Werkend
- [ ] Cross-browser test (Chrome, Firefox) - ⏭️ Defer to M5
- [ ] Mobile responsive test (basis) - ⏭️ Defer to M4

---

### M2: Filesystem Commands (Week 3-4) ✅ VOLTOOID
**Doel:** Volledig functioneel virtual filesystem
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M1 voltooid
**Status Update:** ✅ Volledig voltooid (Sessie 6 - 15 oktober 2025)

#### Filesystem Persistence
- [x] `src/filesystem/persistence.js` - localStorage sync
- [x] Save state bij elke filesystem wijziging
- [x] Load state bij page load
- [x] Reset functionaliteit (restore original)
- [x] Error handling (localStorage vol/disabled)

#### Basis Navigatie Commands (4)
- [x] `ls` - List files/directories
- [x] `ls -l` - Detailed listing
- [x] `ls -a` - Show hidden files (.ssh, etc.)
- [x] `cd [path]` - Change directory
- [x] `cd ..` - Parent directory
- [x] `cd ~` - Home directory
- [x] `pwd` - Print working directory

#### File Reading Commands (2)
- [x] `cat [file]` - Show file contents
- [x] `cat` error handling (file not found, is directory)
- [x] Permission system (basis - /etc/shadow restricted)

#### File Manipulation Commands (5)
- [x] `mkdir [dir]` - Create directory
- [x] `touch [file]` - Create empty file
- [x] `rm [file]` - Remove file
- [x] `rm -r [dir]` - Remove directory recursively
- [x] `cp [src] [dst]` - Copy file
- [x] `mv [src] [dst]` - Move/rename file

#### Search Commands (2)
- [x] `find [pattern]` - Find files by name
- [x] `grep [pattern]` - Search in file contents
- [x] `grep` met educatieve output (laat zien welke regel)

#### Special Commands
- [x] `reset` - Restore filesystem to original state
- ~~[ ] `continue` - Restore saved session~~ **→ Post-MVP** (localStorage restore gebeurt automatisch)

#### Testing & Validation
- [x] Test alle filesystem operations
- [x] Test persistence (save & load)
- [x] Test reset functionaliteit
- [x] Test edge cases (lange bestandsnamen, special chars)
- [x] Test permissions system
- [ ] Cross-browser localStorage test - Deferred to M5
- [ ] Mobile test (40 char output width) - Deferred to M4

---

### M3: Network & Security Commands (Week 5-6) ✅ VOLTOOID
**Doel:** Educational security tools werkend
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M2 voltooid
**Status Update:** ✅ Volledig voltooid (Sessie 8 - 16 oktober 2025)

#### Network Commands (6) ✅ VOLTOOID
- [x] `ping [host]` - Test connectivity (gesimuleerd)
- [x] `nmap [host]` - Port scanner (80/20 output)
- [x] `nmap` met educatieve tips
- [x] `ifconfig` - Network configuration
- [x] `netstat` - Network statistics
- [x] `whois [domain]` - Domain information
- [x] `traceroute [host]` - Network path tracing

#### Security Tools (5) ✅ VOLTOOID
- [x] `hashcat [hash]` - Password hash cracking (gesimuleerd)
- [x] `hydra [target]` - Brute force simulation
- [x] `sqlmap [url]` - SQL injection demonstratie
- [x] `metasploit` - Framework intro (gesimuleerd)
- [x] `nikto [target]` - Web vulnerability scanner

#### Educational Layer ✅ VOLTOOID
- [x] Beveiligingstips bij alle security tools
- [x] Juridische warnings (offensive tools)
- [x] "Doorgaan? [j/n]" confirmatie bij offensive tools (simulatie)
- [x] Inline uitleg (← pijltjes) bij output
- [x] Realistische maar simplified output (80/20)

#### Help System (3-Tier) ✅ VOLTOOID
- [x] `src/help/help-system.js` - 3-tier logic
- [x] Tier 1: Fuzzy matching voor typos
- [x] Tier 2: Progressive hints na herhaalde fouten
- [x] Tier 3: Man pages (volledig)
- [x] Man pages in alle 30 commands geïmplementeerd (via manPage property)
- [x] Help system geïntegreerd in terminal.js

#### Fuzzy Matching ✅ VOLTOOID
- [x] `src/utils/fuzzy.js` - Levenshtein distance
- [x] "Bedoelde je: [suggestion]?" bij typos
- [x] findClosestCommand() voor suggesties
- [x] Geïntegreerd met terminal error handling

#### Testing & Validation ✅ VOLTOOID
- [x] Test alle network commands (via test-network-commands.html)
- [x] Test alle security tools (via test-all-commands.html)
- [x] Test educatieve output (tips aanwezig)
- [x] Test juridische warnings (tonen correct)
- [x] Test fuzzy matching (10 common typos in test suite)
- [x] Test help system (alle 3 tiers via test-help-system.html)
- [x] Test man pages (alle 30 commands via test suite)
- [ ] Cross-browser test - Deferred to M5
- [ ] Mobile test (output leesbaarheid) - Deferred to M4

---

### M4: UX & Polish (Week 7-8) ✅ VOLTOOID
**Doel:** Onboarding, mobile, legal, analytics
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M3 voltooid
**Status Update:** ✅ Volledig voltooid (Sessie 9 - 16 oktober 2025)

#### Onboarding Flow ✅ VOLTOOID (7/8)
- [x] `src/ui/onboarding.js` - FTUE logic
- [x] Welkomstbericht bij eerste bezoek (3 regels tekst + lege regel + hint = 5 regels totaal)
- [x] "Type 'help' om te beginnen" hint (onderdeel van welkomstbericht)
- [x] Na 1e command: "Goed bezig!" encouragement
- [x] Na 3-5 commands: Tutorial suggestie (na 5e en 10e command)
- [ ] Persistent hint (rechts onderin, verdwijnt na 5 commands) - Future enhancement
- [x] localStorage: first_visit flag
- [x] Terugkerende bezoeker: direct naar terminal

#### Mobile Optimalisaties ✅ VOLTOOID (8/8)
- [x] Mobile CSS breakpoints (< 768px) - styles/mobile.css compleet
- [x] Responsive output (40 chars max mobile) - CSS media queries
- [x] Touch-friendly tap targets (44x44px) - button min-height/width
- [x] Mobile keyboard helpers structure - CSS classes klaar
- [x] Quick Commands structure - CSS classes klaar
- [x] Prevent iOS zoom on focus (font-size: 16px)
- [x] Prevent pull-to-refresh (overscroll-behavior)
- [x] Smooth scrolling (-webkit-overflow-scrolling)

#### Legal & Compliance ✅ VOLTOOID (7/7)
- [x] `assets/legal/privacy.html` - Privacy Policy (Nederlands, AVG compliant - 3500+ words)
- [x] `assets/legal/terms.html` - Gebruiksvoorwaarden (ethisch hacken focus - 2800+ words)
- [x] `assets/legal/cookies.html` - Cookie Policy (localStorage + Analytics - 1800+ words)
- [x] `src/ui/legal.js` - Legal manager (singleton pattern)
- [x] Juridische disclaimer modal (eerste bezoek) - geïmplementeerd
- [x] "Ik begrijp het - Verder" button - met shake animation
- [x] Footer met links (Privacy, Terms, Contact) - index.html + CSS
- [x] localStorage: legal_accepted flag - met timestamp

#### Analytics Setup ✅ VOLTOOID (10/10)
- [x] `src/analytics/tracker.js` - Abstraction layer (GA4 + Plausible ready)
- [x] `src/analytics/events.js` - Event definitions (8 event types)
- [x] `src/analytics/consent.js` - Cookie consent manager
- [x] Google Analytics 4 integratie - met placeholder ID
- [x] IP anonymization enabled - anonymize_ip: true
- [x] Event tracking: command_executed - in terminal.js
- [x] Event tracking: session_start/end - in main.js
- [x] Event tracking: error_occurred - in terminal.js
- [x] Cookie consent banner (AVG compliant) - in index.html
- [x] Consent opslaan in localStorage - met timestamp

#### Feedback Mechanisme ✅ VOLTOOID (4/4 - MVP Scope)
- [x] Floating feedback button (rechts onderin) - HTML + CSS
- [x] Feedback modal (5-star + optioneel comment) - HTML + CSS
- [x] Rating stars styling - CSS met hover states
- [x] Modal structure compleet - HTML klaar

**Deferred to Post-MVP:**
- [ ] Exit intent detection (na 2+ min sessie) - Fase 2
- [ ] Feedback opslaan logic - Fase 2 (console.log ready)

#### Styling Polish ✅ VOLTOOID (6/6)
- [x] Animations polish (transitions) - var(--transition-fast/normal)
- [x] Error messages styling (rood) - terminal-output-error class
- [x] Warnings styling (geel) - terminal-output-warning class
- [x] Success messages styling (groen) - terminal-output-success class
- [x] Focus states (keyboard accessibility) - outline 2px solid
- [x] Loading states (spinner) - CSS @keyframes spin

---

### M5: Testing & Launch (Week 9-10)
**Doel:** Production-ready en live deployment
**Tijdsinschatting:** 10-14 dagen
**Dependencies:** M4 voltooid
**Status:** 🔵 In uitvoering (8/35 tasks) - ✅ **LIVE on Netlify!**

#### Configuration Placeholders (CRITICAL - Launch Blockers)
- [ ] Replace GA4 Measurement ID in `src/analytics/tracker.js` (3 locations: lines 75, 121, 108) - **TO DO before launch**
- [ ] Setup contact emails in legal documents (4 locations: privacy.html x2, terms.html, cookies.html) - **TO DO before launch**

**Details:** See `PRE-LAUNCH-CHECKLIST.md` sections 1-2 for exact line numbers and instructions.

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
- [x] Chrome Windows (latest) - ✅ PASSED (Chromium 8/8 tests passing)
- [x] Chrome macOS (latest) - ✅ COVERED (Chromium tests cross-platform)
- [x] Firefox Windows (latest) - ✅ PASSED (Firefox 8/8 tests passing)
- [ ] Safari macOS (latest) - ⚠️ DEFERRED (WebKit blocked by system deps: libevent, libavif)
- [x] Edge Windows (latest) - ✅ COVERED (Chromium tests = Edge basis)
- [ ] Mobile Safari iOS 16+ (real device) - ⏭️ PENDING (manual testing phase)
- [ ] Chrome Mobile Android 12+ (real device) - ⏭️ PENDING (manual testing phase)

**✅ P0-001 FIXED:** Duplicate HTML ID `#legal-modal` removed (Sessie 16)
**✅ AUTOMATED TESTING:** 16/16 tests passing (Chromium 8/8, Firefox 8/8)
**📊 Test Coverage:** 8 comprehensive E2E tests per browser covering all critical user flows (onboarding, commands, history, storage, navigation)

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

#### Deployment Setup ✅ COMPLETED
- [x] Netlify account aanmaken
- [x] Repository koppelen aan Netlify (GitHub integration)
- [ ] Custom domain configureren (hacksimulator.nl) - Using Netlify subdomain for now
- [x] HTTPS certificaat (auto via Netlify)
- [x] Build settings configureren (publish directory: `.`)
- [ ] Environment variables instellen (production) - Using placeholders for MVP

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

#### Launch ✅ LIVE!
- [x] Final deployment naar productie (https://famous-frangollo-b5a758.netlify.app/)
- [ ] DNS configuratie (hacksimulator.nl) - Deferred: Using Netlify subdomain for MVP
- [x] Smoke test op productie URL (HTTP 200 OK verified)
- [ ] Analytics test (real events) - TO TEST with placeholder IDs
- [x] Error monitoring actief (console.log check)
- [ ] Backup van localStorage structure (JSON export) - TO DO

#### Post-Launch (Week 1)
- [ ] Daily monitoring (analytics + errors)
- [ ] Bug reports triagen
- [ ] User feedback verzamelen
- [ ] Performance metrics checken (load times)
- [ ] Success criteria evalueren (zie PRD §14)
- [ ] Hot fixes indien nodig (priority bugs)

---

### Phase A: Post-Launch Quick Wins (Week 11)
**Doel:** Power user features + production validation
**Tijdsinschatting:** 5-7 dagen
**Status:** 🔵 In uitvoering (2/6 completed - 33%)
**Dependencies:** M5 Launch voltooid

#### Tab & History Features ✅ COMPLETED
- [x] **A.4: Tab Autocomplete** (command names + multi-match cycling)
  - Single match: Tab completes immediately
  - Multiple matches: Tab cycles through options
  - Command-only for MVP (path completion = Phase 2)
  - Implemented: `src/ui/autocomplete.js`

- [x] **A.6: Ctrl+R History Search** (bash-style reverse search)
  - Real-time filtering with match counter [1/3]
  - Ctrl+R: Start search / cycle matches
  - Enter: Accept | Esc: Cancel
  - Cyan search prompt above input (bash aesthetic)
  - Implemented: `src/ui/history-search.js`, `src/core/terminal.js`

#### Production Readiness (TODO)
- [ ] **A.1: Beta Testing Setup**
  - Recruit 5+ beta testers (2 beginners, 2 students, 1 dev)
  - Create feedback formulier (Google Forms)
  - Test scenarios document
  - Screen recording instructions (optional)

- [ ] **A.2: Cross-Browser Testing**
  - [ ] Safari macOS (latest) - WebKit blocked by system deps
  - [ ] Mobile Safari iOS 16+ (real device)
  - [ ] Chrome Mobile Android 12+ (real device)
  - ✅ Chrome/Firefox automated tests passing (16/16)

- [ ] **A.3: Configuration Setup** (CRITICAL - Launch Blockers)
  - [ ] Replace GA4 Measurement ID in tracker.js (3 locations)
  - [ ] Setup contact emails in legal docs (4 locations)
  - See `PRE-LAUNCH-CHECKLIST.md` for exact line numbers

- [ ] **A.5: Mobile Quick Commands** (deferred until mobile UX/design fixes)
  - Implement click handlers for quick command buttons
  - CSS structure already in place (styles/mobile.css)
  - Deferred per user request: fix mobile UX issues first

---

## 🎯 Volgende Acties

**Huidige Status:** M5 In Uitvoering (95.9%) - ✅ **LIVE on Netlify!**

**Nu direct te doen:**
1. [x] GitHub repository setup (https://github.com/JanWillemWubkes/hacksimulator)
2. [x] Netlify deployment (https://famous-frangollo-b5a758.netlify.app/)
3. [x] Performance audit (Lighthouse 88/100/100/100)
4. [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
5. [ ] Mobile real device testing (iOS, Android)

**Deze week:**
- Start M5: Testing & Launch
- Beta tester recruitment
- Cross-browser testing

---

## 🔮 Post-MVP Features (Fase 2+)

Deze features zijn **buiten MVP scope** en worden in Fase 2 geïmplementeerd:

### UX Enhancements
- [x] **Tab Autocomplete** - ✅ COMPLETED (Phase A.4 - Week 11)
- [x] **Ctrl+R History Search** - ✅ COMPLETED (Phase A.6 - Week 11)
- [ ] **Help Command Educational Context** - Add category descriptions to help output
  - Write 5 Nederlands category descriptions voor elke categorie
  - Educational tone: "Deze tools helpen je netwerken te scannen..."
  - Uncomment placeholder in `src/commands/system/help.js` (line 113)
  - Estimated time: 30 min
  - Ready to implement: Architecture done in Sessie 36
- [ ] **Quick Commands UI** - Moved to Phase A.5 (deferred until mobile UX fixes)
- [ ] **Mobile Gestures** - Swipe/long-press navigatie (needs real device testing)
- [ ] **Persistent Help Hint** - Rechts onderin, verdwijnt na 5 commands

### Feedback & Analytics
- [ ] **Exit Intent Detection** - Survey na 2+ min sessie (FR7.2 deferred)
- [ ] **Feedback Save Logic** - Backend/email integratie voor feedback
- [ ] **Command-Level Feedback** - Thumbs up/down per command (FR7.3 deferred)

### Commands & Features
- [ ] **Continue Command** - Expliciete sessie restore (localStorage doet dit al automatisch)
- [ ] **Tutorial Command** - Guided scenarios (recon, webvuln, privesc)
- [ ] **Challenge System** - Voortgang tracking en certificaten

### Analytics Migration
- [ ] **Plausible Analytics** - Migratie van GA4 naar Plausible (bij 10k+ visitors)
- [ ] **Cookie-less Tracking** - Remove consent banner na Plausible migratie

---

## 🧹 M9: Refactor Sprint (Toekomstig)

**Doel:** Technical debt cleanup + code quality optimalisatie
**Tijdsinschatting:** 1 week (7-10 dagen)
**Dependencies:** M5 voltooid + 3-4 Post-MVP features geïmplementeerd
**Status:** ⏭️ **Gepland** (trigger: na Milestone 6-8 voltooid)
**When to Execute:** Elke 4-6 features OF technical debt > 20%

### Cache Implementation Cleanup (3 taken)
- [ ] Remove redundant HTML cache meta tags van `index.html` (lines 12-14)
- [ ] Delete of move `cache-diagnostic.html` naar `/dev/` folder (development tool in production)
- [ ] Document cache strategy in `docs/CACHING.md` (_headers file + versioning rationale)

### Bundle Size Optimization (4 taken)
- [ ] Audit bundle size breakdown (identify largest files via `ls -lh`)
- [ ] Check for duplicate code patterns via `grep`/`ripgrep` (>10 line duplicates)
- [ ] Consider minification: Terser for JS, cssnano for CSS (optional per PRD)
- [ ] Target: Maintain <400KB bundle (current: ~318KB = 36% buffer remaining)

### Code Quality & Deduplication (4 taken)
- [ ] Review command modules voor duplicate logic patterns
- [ ] Extract common patterns to `src/utils/` modules (DRY principle)
- [ ] CSS cleanup: Remove unused classes via manual audit (no build tools per PRD)
- [ ] JavaScript cleanup: Remove unused imports/functions (grep for unreferenced code)

### Documentation Updates (3 taken)
- [ ] Sync all version numbers across docs (PRD, PLANNING, TASKS, CLAUDE, SESSIONS)
- [ ] Update SESSIONS.md with refactor learnings (anti-patterns discovered)
- [ ] Add inline code comments for complex logic (VFS path resolution, parser, renderer)

### Performance Audit (3 taken)
- [ ] Re-run Lighthouse audit (baseline: 88/100/100/100 - maintain or improve)
- [ ] Check for memory leaks via DevTools (long session test: 30+ commands)
- [ ] Optimize localStorage read/write patterns if needed (currently: on every VFS change)

### Test Coverage Review (2 taken)
- [ ] Identify untested edge cases in Playwright suite (current: 16/16, target baseline: 22/22 after M9 expansion)
- [ ] Add missing tests for refactored code (maintain 100% critical flow coverage)

**Total Tasks:** 19
**Estimated Time:** 7-10 dagen
**Success Criteria:**
- Bundle size ≤ 400KB (20% margin maintained)
- Lighthouse score ≥ 88/100/100/100 (no regression)
- Zero code duplication >10 lines (grep check)
- All docs synchronized (dates, versions, percentages)
- Playwright tests: 100% passing (22/22 minimum)

**Triggers for Execution:**
1. **Time-Based:** After implementing 3-4 Post-MVP features (Milestone 6-8)
2. **Debt-Based:** Bundle size >400KB OR test failures >5% OR code duplication >15%
3. **Pain-Based:** Developer friction signals (fear, brittleness, confusion)

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

**Laatst bijgewerkt:** 6 november 2025
**Versie:** 2.6 (Help Command Visual Enhancement - Phase 1 complete, Phase 2/3 planned)
**Totaal Taken:** 167 (M0-M5: 147, M9 Refactor: 19, Fase 2: 1 new)
**Voltooide Taken:** 141 (M0: 15/15, M1: 20/20, M2: 25/25, M3: 28/28, M4: 43/43, M5: 10/37, M9: 0/19 pending)
**Voortgang:** 84.4% (141/167) - Phase A: 2/6 tasks completed
**Live URL:** https://famous-frangollo-b5a758.netlify.app/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator

---

**🚀 Let's build HackSimulator.nl!**
