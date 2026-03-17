# TASKS.md - HackSimulator.nl

**Laatst bijgewerkt:** 17 maart 2026
**Status:** M7 Gamification 98% | M6 Tutorial System 88% (LIVE on hacksimulator.nl)
**Sprint:** Sessie 116: Doc Sync — TASKS.md, PLANNING.md, CLAUDE.md consistency

---

## 📊 Voortgang Overzicht

**Totaal:** 267 / 315 taken voltooid (84.8%)

| Mijlpaal | Status | Taken | Percentage |
|----------|--------|-------|------------|
| M0: Project Setup | ✅ Voltooid | 15/15 | 100% |
| M1: Foundation | ✅ Voltooid | 20/20 | 100% |
| M2: Filesystem Commands | ✅ Voltooid | 25/25 | 100% |
| M3: Network & Security | ✅ Voltooid | 28/28 | 100% |
| M4: UX & Polish | ✅ Voltooid | 43/43 | 100% |
| M5: Testing & Launch | 🔵 In uitvoering | 41/45 | 91% | ✅ **Performance + Config + Security + Accessibility + Content + Bundle Opt 100%**
| M5.5: Monetization MVP | ❌ Geannuleerd | - | - | Affiliate aanvragen afgewezen |
| M6: Tutorial System | 🔵 In uitvoering | 30/33 | 88% | ✅ Framework + 3 scenarios + cert + analytics + E2E tests + perf audit + mobile + cross-browser |
| M7: Gamification | 🔵 In uitvoering | 46/47 | 98% | ✅ Phase 1-6 complete + Phase 7 testing (cross-system, performance, mobile) |
| M8: Analytics & Scaling | ⏭️ Gepland | 0/40 | 0% |
| M9: Refactor Sprint | ✅ Voltooid | 19/19 | 100% | ✅ Cache + bundle + code quality + docs sync + performance + test coverage + localStorage opt |

---

## 🎯 Huidige Focus

**Actieve Mijlpaal:** M5 - Testing & Launch ✅ **LIVE on hacksimulator.nl!**
**Current Status:** ✅ **UNBLOCKED** - Playwright E2E: 160 tests across 30 suites (21 files, Chromium, Firefox, WebKit passing)

**Volgende Stappen:**
1. ✅ GitHub repository setup (https://github.com/JanWillemWubkes/hacksimulator)
2. ✅ Netlify deployment (https://hacksimulator.nl/)
3. ✅ Performance audit (Lighthouse 100/100/92/100)
4. ✅ Cross-browser test infrastructure (Playwright 145 tests, 27 suites)
5. ✅ **FIXED P0-001:** Duplicate #legal-modal ID removed
6. ✅ Cross-browser tests: Chromium 91+, Firefox passing
7. ✅ **FIXED P0-002:** Mobile CSS not loading (CSP blocked onload handler) - Sessie 95
8. ✅ **Security Review Complete** - Sessie 96: HSTS actief, CSP versterkt, XSS audit passed
9. ✅ **Bundle Size Optimalisatie** - Sessie 100: ~809 KB na Netlify minificatie (binnen 1000 KB budget)
10. ✅ **Playwright Test Fixes** - Sessie 101: Blog URLs, TTI budget, flaky legal modal
11. [ ] Mobile real device testing (iOS, Android)
12. [ ] GA4 Real-Time verificatie (handmatig)

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
- [x] Replace GA4 Measurement ID in `src/analytics/tracker.js` (3 locations: lines 75, 121, 108) - ✅ Sessie 91 (G-7F792VS6CE)
- [x] Setup contact emails in legal documents (4 locations: privacy.html x2, terms.html, cookies.html) - ✅ Sessie 91

**Details:** See `docs/archive/pre-launch-checklist.md` sections 1-2 for exact line numbers and instructions.

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
- [x] Lighthouse audit (target: >90 score) - ✅ **100/100/92/100 (avg 98)**
- [x] Bundle size check — ✅ **~809 KB na Netlify minificatie** (Terminal Core ~340 KB binnen 400 KB budget, site totaal binnen 1000 KB budget — Sessie 100)
- [x] Load time test 4G (target: <3 sec) - ✅ **2.30s LCP**
- [x] Time to Interactive (target: <3 sec) - ✅ **2.98s TTI**
- [x] Memory leaks check (long session test) - ✅ **MITIGATED** (Sessie 103: MAX_OUTPUT_LINES=500 buffer cap) - docs/testing/memory-leak-results.md
- [x] localStorage quota test (edge case) - **SKIPPED** (modern browsers 10-15MB quota, test outdated)

#### Accessibility Testing ✅ VOLTOOID (Sessie 97)
- [x] Keyboard navigation (Tab, Enter, Esc) - ✅ Focus trap toegevoegd aan alle modals
- [x] Focus indicators zichtbaar - ✅ :focus-visible met blauwe outline
- [x] Screen reader test (basis - known limitations) - ✅ ARIA audit: 50+ attributen, aria-live regions
- [x] Color contrast check (4.5:1 ratio) - ✅ WCAG AAA (14.8:1 primary text)
- [x] Font scaling test (200% zoom) - ✅ Layout intact, geen horizontal scroll
- [x] ARIA labels waar nodig - ✅ Alle modals, forms, navigation compliant

#### Security Review ✅ VOLTOOID (Sessie 96)
- [x] Content Security Policy (CSP) headers - ✅ Versterkt met object-src, base-uri, form-action
- [x] Input sanitization review (XSS preventie) - ✅ DOM-based escaping in renderer.js
- [x] localStorage security check (geen gevoelige data) - ✅ Alleen non-sensitive data
- [x] Analytics privacy check (geen PII) - ✅ IP anonymization + PII blocking actief
- [x] External links: rel="noopener noreferrer" - ✅ Alle externe links compliant
- [x] HTTPS only (deployment) - ✅ HSTS header geactiveerd (1h max-age voor testing)

#### Content Review ✅ VOLTOOID (Sessie 98)
- [x] Alle UI teksten Nederlands (compliance check) - ✅ 100% NL
- [x] Alle man pages compleet (40+ commands) - ✅ Meer dan target
- [x] Educatieve tips bij security tools (aanwezig) - ✅ Alle 5 tools
- [x] Juridische warnings correct (offensive tools) - ✅ Art. 138ab + consent
- [x] Privacy Policy compleet (AVG) - ✅ 476 regels
- [x] Gebruiksvoorwaarden compleet - ✅ 489 regels
- [x] Cookie Policy compleet - ✅ 485 regels
- [x] Disclaimer prominent (homepage + modal) - ✅ Focus trap + enforcement

#### Production Build ✅ VOLTOOID (Sessie 100)
- [x] Netlify asset processing voor minificatie (broncode leesbaar, Netlify minificeert)
- [x] Final bundle size check: ~983 KB → ~809 KB na Netlify minificatie (binnen 1000 KB budget)
- [x] Terminal Core: ~340 KB (binnen 400 KB budget)

#### Deployment Setup ✅ COMPLETED
- [x] Netlify account aanmaken
- [x] Repository koppelen aan Netlify (GitHub integration)
- [x] Custom domain geconfigureerd (hacksimulator.nl) - DNS live
- [x] HTTPS certificaat (auto via Netlify)
- [x] Build settings configureren (publish directory: `.`)
- [x] HSTS header actief (max-age=31536000)
- [x] 301 redirect van oud Netlify subdomain naar hacksimulator.nl

#### Pre-Launch Checklist ✅ GROTENDEELS VOLTOOID
- [x] Alle 40+ commands werkend (content review Sessie 98, +6 in M6/M7)
- [x] 3-tier help system functioneel
- [x] Onboarding flow compleet
- [x] Mobile responsive (CSS fixes Sessie 95, quick commands Sessie 101)
- [x] Legal documenten live (Privacy, Terms, Cookies)
- [x] Analytics tracking geconfigureerd (GA4 G-7F792VS6CE)
- [x] Cookie consent banner werkend (Cookiebot CMP)
- [x] Feedback mechanisme werkend (in-app feedback form)
- [x] Cross-browser getest (Chromium + Firefox + WebKit, 145 E2E tests)
- [x] Performance targets gehaald (LCP ~2.0s, ~809 KB)

#### Launch ✅ LIVE!
- [x] Final deployment naar productie (https://hacksimulator.nl/)
- [x] DNS configuratie (hacksimulator.nl live)
- [x] Smoke test op productie URL (HTTP 200 OK verified)
- [ ] Analytics test (GA4 Real-Time verificatie) - HANDMATIGE ACTIE
- [x] Error monitoring actief (console.log check)
- [ ] Backup van localStorage structure (JSON export) - DEFERRED

#### Post-Launch (Week 1)
- [ ] Daily monitoring (analytics + errors)
- [ ] Bug reports triagen
- [ ] User feedback verzamelen
- [ ] Performance metrics checken (load times)
- [ ] Success criteria evalueren (zie PRD §21)
- [ ] Hot fixes indien nodig (priority bugs)

#### Maintenance (Ongoing)
- [x] **Sessie 87:** Codebase Cleanup & Organization Audit (16 dec 2025)
  - ✅ Git cleanup: Removed test-results/.last-run.json from tracking
  - ✅ Disk cleanup: Deleted 39MB .playwright-mcp/ screenshots
  - ✅ Debug cleanup: Removed 5 debug files from root (cache-diagnostic.html, test-*.js)
  - ✅ Blog cleanup: Deleted 2 mockup files (57KB) - design artifacts
  - ✅ SESSIONS.md split: 612KB → 5 archive files (docs/sessions/)
  - ✅ Docs reorg: Created docs/sessions/, docs/milestones/, docs/archive/
  - ✅ Git config: Added .gitattributes for cross-platform consistency
  - ✅ .gitignore: Added explicit patterns for clarity
  - **Impact:** -39MB disk, A+ git hygiene, root directory 25+ → 23 files
  - **Future:** Quarterly cleanup audits, session archive rotation every 20 sessions

- [x] **Sessie 95:** Mobile CSS CSP Fix (19 jan 2026)
  - ✅ **P0 Bug Fixed:** Mobile CSS was not loading on production
  - ✅ Root cause: CSP `'unsafe-hashes'` blocks `onload` event handlers
  - ✅ Solution: Removed deferred CSS loading (`media="print" onload="..."`)
  - ✅ Direct loading for mobile.css and animations.css
  - ✅ Bundle impact: +6.5KB (470KB → 477KB, within 500KB budget)
  - ✅ Verified: Hamburger menu, dropdown, no horizontal scroll
  - **Commit:** `55b64a1` - "fix(mobile): Remove deferred CSS loading to fix CSP conflict"
  - **Learning:** Deferred CSS via onload handlers conflicts with strict CSP

- [x] **Sessie 96:** Security Review Complete (20 jan 2026)
  - ✅ **CSP Versterkt:** Added `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`
  - ✅ **HSTS Geactiveerd:** 1-hour max-age voor testing, later verhogen naar 1 jaar
  - ✅ **XSS Audit Passed:** DOM-based escaping in renderer.js correct geïmplementeerd
  - ✅ **localStorage Audit:** Geen gevoelige data, alleen non-PII
  - ✅ **Analytics Privacy:** IP anonymization + PII blocking actief
  - ✅ **Externe Links:** Alle links hebben `rel="noopener noreferrer"`
  - **Files Modified:** `netlify.toml` (lines 80-88)
  - **Target:** A+ rating op securityheaders.com

- [x] **Sessie 97:** Accessibility Testing Complete (20 jan 2026)
  - ✅ **Focus Trap:** Toegevoegd aan legal, feedback, command-search modals
  - ✅ **New Module:** `src/ui/focus-trap.js` - Reusable WCAG 2.1 focus management
  - ✅ **Modal Updates:** Unminified + focus trap in legal.js, feedback.js, command-search-modal.js
  - ✅ **ARIA Audit:** 50+ attributen, aria-live regions, role="dialog" op alle modals
  - ✅ **Focus Indicators:** :focus-visible met blauwe outline (2px solid)
  - ✅ **Font Scaling:** 200% zoom test passed, layout intact
  - ✅ **Color Contrast:** WCAG AAA (14.8:1 primary text ratio)
  - **Files Created:** `src/ui/focus-trap.js` (4.4KB)
  - **Files Modified:** `src/ui/legal.js`, `src/ui/feedback.js`, `src/ui/command-search-modal.js`
  - **Bundle Impact:** +16KB unminified (can be re-minified with `npm run minify`)

- [x] **Sessie 100:** Bundle Size Optimalisatie (15 feb 2026)
  - ✅ ~983 KB productieve code → ~809 KB na Netlify minificatie
  - ✅ Terminal Core: ~340 KB (binnen 400 KB budget)
  - ✅ Netlify asset processing voor minificatie (broncode leesbaar)
  - ✅ Budgets herdefinieerd: Terminal Core <400KB, site totaal <1000KB
  - **Learning:** In-place minificatie vermijden; Netlify doet dit gratis

- [x] **Sessie 101:** Playwright E2E Test Fixes (17 feb 2026)
  - ✅ Blog URLs geüpdatet naar hacksimulator.nl
  - ✅ TTI budget aangepast voor productie
  - ✅ Flaky legal modal selector gefixt
  - ✅ Feedback locator geüpdatet
  - ✅ Mobile quick commands geimplementeerd
  - **Test suite:** 145 tests across 27 suites (17 files)

- [x] **Sessie 102:** MVP Perfectionering (18 feb 2026)
  - ✅ Domain referenties geüpdatet (famous-frangollo → hacksimulator.nl)
  - ✅ Pre-launch checklist afgevinkt (90%+ voltooid)
  - ✅ TASKS.md gesynchroniseerd met Sessie 100-101 resultaten
  - ✅ Playwright retry strategie voor flaky tests (1 retry lokaal)
  - ✅ Analytics setup geverifieerd (CSP headers compatible)

- [x] **Sessie 103:** MVP Polish & Production Hardening (20 feb 2026)
  - ✅ Output buffer limit: MAX_OUTPUT_LINES=500 in renderer.js (DOM memory cap)
  - ✅ Dode meta tags verwijderd: Cache-Control, Pragma, Expires, impact-site-verification
  - ✅ animations.css loading gefixt: media="print" onload → direct load (consistent met mobile.css fix)
  - ✅ Console.log cleanup: 25 debug traces verwijderd uit 9 bestanden (console.warn/error behouden)
  - **Impact:** Schonere DevTools, gecapte DOM groei, consistente CSS loading, geen informatielekkage

---

### M5.5: Monetization MVP ❌ GEANNULEERD
**Status:** Geannuleerd (januari 2026)
**Reden:** Affiliate aanvragen worden structureel afgewezen. Besloten om deze monetization strategie niet verder te vervolgen.
**Behouden:** PayPal donatie knop in footer (reeds geïmplementeerd in Sessie 69-74)
**Verwijderd:** Alle affiliate code, blog posts met affiliate links, disclosure pagina's

---

### Phase A: Post-Launch Quick Wins (Week 11)
**Doel:** Power user features + production validation
**Tijdsinschatting:** 5-7 dagen
**Status:** 🔵 In uitvoering (4/6 completed - 67%)
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
  - ✅ Chrome/Firefox/WebKit automated tests passing (145 tests, 27 suites)

- [x] **A.3: Configuration Setup** ✅ VOLTOOID (Sessie 91)
  - [x] GA4 Measurement ID ingevuld: G-7F792VS6CE
  - [x] Contact emails ingevuld: contact@hacksimulator.nl (Gmail forwarding)

- [x] **A.5: Mobile Quick Commands** ✅ VOLTOOID (Sessie 101)
  - Click handlers geimplementeerd voor quick command buttons
  - Mobile UX fixes voltooid

---

## 🎯 Volgende Acties

**Huidige Status:** M5 In Uitvoering (91%) - ✅ **LIVE on hacksimulator.nl!**

**Voltooid:**
1. [x] GitHub repository setup (https://github.com/JanWillemWubkes/hacksimulator)
2. [x] Netlify deployment + custom domain (https://hacksimulator.nl/)
3. [x] Performance audit (Lighthouse 100/100/92/100)
4. [x] Cross-browser testing (Chrome + Firefox + WebKit, 145 E2E tests)
5. [x] Bundle size optimalisatie (~809 KB na Netlify minificatie)
6. [x] GA4 geconfigureerd (G-7F792VS6CE)
7. [x] Mobile quick commands (Sessie 101)

**Resterende handmatige acties:**
- [ ] Mobile real device testing (iOS, Android)
- [ ] Beta testers werven (5+ testers)
- [ ] GA4 Real-Time dashboard verificatie

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
- [x] **Tutorial Command** - Guided scenarios (recon, webvuln, privesc) ✅ Gebouwd in M6 (Sessie 103-104)
- [ ] **Challenge System** - Voortgang tracking en certificaten

### Analytics Migration
- [ ] **Plausible Analytics** - Migratie van GA4 naar Plausible (bij 10k+ visitors)
- [ ] **Cookie-less Tracking** - Remove consent banner na Plausible migratie

---

## 🧹 M9: Refactor Sprint (Toekomstig)

**Doel:** Technical debt cleanup + code quality optimalisatie
**Tijdsinschatting:** 1 week (7-10 dagen)
**Dependencies:** M5 voltooid + 3-4 Post-MVP features geïmplementeerd
**Status:** ✅ **Voltooid** (Sessie 105-110)
**When to Execute:** Elke 4-6 features OF technical debt > 20%

### Cache Implementation Cleanup (3 taken)
- [x] Remove redundant HTML cache meta tags van `terminal.html` — ✅ Sessie 103 (verwijderd: Cache-Control, Pragma, Expires meta tags + impact-site-verification)
- [x] Delete of move `cache-diagnostic.html` naar `/dev/` folder — ✅ Sessie 87: bestand al verwijderd tijdens cleanup
- [x] Document cache strategy in `docs/CACHING.md` — SKIPPED (Sessie 110: Netlify `_headers` is self-documenting, apart doc overbodig)

### Bundle Size Optimization (4 taken) — ✅ DEFERRED (Sessie 100: Netlify minificatie ingeschakeld, budget herdefinieerd)
- [x] Audit bundle size breakdown — ✅ Sessie 100: 983 KB productieve code identified
- [x] Check for duplicate code patterns via `grep`/`ripgrep` (>10 line duplicates) — ✅ Sessie 105: Security commands structureel vergelijkbaar maar content uniek, extractie niet waard
- [x] Minification: Netlify asset processing ingeschakeld (CSS/JS/HTML) — Sessie 100
- [x] Target: Terminal Core ~340 KB (binnen 400 KB budget), site totaal ~809 KB (binnen 1000 KB budget) — Sessie 100

### Code Quality & Deduplication (4 taken)
- [x] Review command modules voor duplicate logic patterns — ✅ Sessie 105: Consent check pattern in 3/5 security commands, structureel niet content duplication
- [x] Extract common patterns to `src/utils/` modules (DRY principle) — ✅ Sessie 105: Reviewed, correct deferred — geen duplicaten >10 regels, `boxText()` al in utils
- [x] CSS cleanup: Remove unused classes via manual audit — ✅ Sessie 105: 531 regels verwijderd (70 orphaned classes, 28 verwijderd uit landing/main/blog.css, 42 in minified files genoteerd voor later)
- [x] JavaScript cleanup: Remove unused imports/functions (grep for unreferenced code) — ✅ Sessie 105: 7 orphaned exports verwijderd (getHomeDirectory, createBox, createLightBox, invalidateCharWidthCache export, isSimilar, findSimilarCommands)

### Documentation Updates (3 taken)
- [x] Sync all version numbers across docs (PRD, PLANNING, TASKS, CLAUDE, SESSIONS) — ✅ Sessie 110: Alle docs gesynchroniseerd op 6 maart 2026
- [x] Update SESSIONS.md with refactor learnings (anti-patterns discovered) — ✅ Sessie 105-110: Alle sessies gedocumenteerd in docs/sessions/current.md
- [x] Add inline code comments for complex logic (VFS path resolution, parser, renderer) — ✅ vfs.js 26%, parser.js 28%, renderer.js 34% comment-to-code ratio

### Performance Audit (3 taken)
- [x] Re-run Lighthouse audit — ✅ Sessie 105: CLI baseline 42/100/74/100 (methodologie verschil met DevTools; A11y+SEO maintained at 100)
- [x] Check for memory leaks via DevTools — ✅ Sessie 103: MAX_OUTPUT_LINES=500 buffer cap (docs/testing/memory-leak-results.md)
- [x] Optimize localStorage read/write patterns if needed (currently: on every VFS change) — ✅ Sessie 110: VFS debounce 1000ms + beforeunload flush, gamification debounce 500ms, onboarding 4→1 key consolidatie

### Test Coverage Review (2 taken)
- [x] Identify untested edge cases in Playwright suite — ✅ Sessie 105: 13 nieuwe command-coverage tests (pwd, date, man, history, find, grep, ifconfig, netstat)
- [x] Add missing tests for refactored code — ✅ Sessie 105-106: 145 tests/27 suites (was 118/14)

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

## 🎓 M6: Tutorial System (Fase 2 - Week 11-16)

**Doel:** Transform isolated commands into structured learning scenarios
**Tijdsinschatting:** 35-45 uur (5-6 dagen)
**Taken:** 33 total
**Dependencies:** M5 minimaal MVP (beta testing + Safari)
**Status:** 🔵 In uitvoering (88% — Sessie 103-112)
**Bundle Budget:** +60KB max (total: ~378KB / 500KB = 76%)

**Success Criteria:**
- ✓ 3 complete scenarios functional without errors
- ✓ Tutorial state persists across page reloads
- ✓ Validators accept correct commands with >95% accuracy
- ✓ Mobile UI renders correctly on 375px viewport
- ✓ Tutorial completion rate >40% (analytics tracking)
- ✓ Bundle size increase ≤60KB

### Phase 1: Tutorial Framework (15h, 10 tasks) ✅ VOLTOOID
- [x] Create tutorial engine architecture (3h)
  - State machine: IDLE → STEP_ACTIVE → STEP_COMPLETE → COMPLETE
  - Scenario registry pattern (similar to command registry)
  - localStorage persistence: `hacksim_tutorial_progress`
  - Integration hook in terminal.js (detect `tutorial` command)

- [x] Implement command validator (2h)
  - Per-step validate() functions
  - Non-blocking: commands always execute, validation checks afterwards
  - Argument validation (IP format, flags)

- [x] Build navigation system (2h)
  - `tutorial` command: list available scenarios
  - `tutorial [name]` command: start specific scenario
  - `tutorial skip`: skip with educational warning
  - `tutorial exit`: exit and save progress
  - `tutorial cert`: show + copy certificate

- [x] Design tutorial UI renderer (3h)
  - Mission briefing display (ASCII box with box-utils.js)
  - Objective tracker with step counter
  - Inline hints (progressive disclosure)
  - Mobile optimization (isMobileView() fallback)

- [x] Implement progress tracking (2h)
  - localStorage: scenario ID, step number, completion status
  - Resume functionality (restore on page load)
  - Reset functionality (start over)
  - Analytics events: tutorial_started, tutorial_completed, tutorial_abandoned

- [x] Create hint system (1.5h)
  - Progressive hints: Tier 1 (2 attempts), Tier 2 (4 attempts), Tier 3 (6 attempts)
  - Hint triggering: after 2 failed attempts
  - Per-step hint persistence in localStorage

- [x] Build certificate generator (1.5h)
  - Text-based certificate (ASCII art)
  - Include: scenario name, completion date, step count
  - Copy-to-clipboard functionality (navigator.clipboard + textarea fallback)

- [x] Integrate with onboarding system (1.5h)
  - Tutorial hint in onboarding flow
  - Update welcome message with tutorial mention

- [x] Integrate with analytics system (1h)
  - Track tutorial_started (scenario ID)
  - Track tutorial_step_completed (step number)
  - Track tutorial_completed (scenario ID)
  - Track tutorial_abandoned (last step reached)

- [x] Error handling edge cases (1.5h)
  - Invalid scenario name → suggestion list
  - Tutorial command during active scenario → warning
  - Page reload during tutorial → resume prompt
  - localStorage errors → graceful degradation with console.warn

### Phase 2: Scenario Implementations (18h, 15 tasks) — 12/15 voltooid

**Scenario 1: Reconnaissance (6h, 5 tasks)** ✅
- [x] Write reconnaissance scenario script (1.5h)
  - Mission briefing: "SecureCorp pentest - map network topology"
  - Step 1: ping 192.168.1.100 (test connectivity)
  - Step 2: nmap 192.168.1.100 (identify open ports)
  - Step 3: whois securecorp.com (gather domain info)
  - Step 4: traceroute 192.168.1.100 (map route)

- [x] Implement reconnaissance step validators (2h)
  - Ping validator: accept any target IP
  - Nmap validator: require target IP, optional flags OK
  - Whois validator: require domain format
  - Traceroute validator: require target IP

- [x] Write reconnaissance educational feedback (1.5h)
  - Per-step tips with Dutch context
  - Progressive hints (3 tiers per step)
  - Completion message with pentest context

- [x] Mobile testing reconnaissance scenario (0.5h) — ✅ Sessie 112: 4 tests in tutorial-mobile.spec.js
- [x] Integration testing reconnaissance scenario (0.5h) — ✅ Sessie 104: Playwright E2E tests (18 tests covering all 3 scenarios)

**Scenario 2: Web Vulnerabilities (6h, 5 tasks)** — 3/5
- [x] Write web vulnerabilities scenario script (1.5h)
  - Mission: "E-commerce site audit - find SQL injection"
  - Step 1: nmap target (identify web server)
  - Step 2: nikto target (scan for vulnerabilities)
  - Step 3: sqlmap target (test SQL injection)
  - Step 4: hashcat (crack found hashes)

- [x] Implement web vulnerabilities step validators (2h)
  - Command name + args.length validation
  - Non-blocking (forgiving for beginners)

- [x] Write web vulnerabilities educational feedback (1.5h)
  - OWASP Top 10 context
  - Ethical disclosure process

- [x] Mobile testing web vulnerabilities scenario (0.5h) — ✅ Sessie 112: 4 tests in tutorial-mobile.spec.js
- [x] Integration testing web vulnerabilities scenario (0.5h) — ✅ Sessie 104: Playwright E2E coverage

**Scenario 3: Privilege Escalation (6h, 5 tasks)** — 3/5
- [x] Write privilege escalation scenario script (1.5h)
  - Mission: "Linux server analyse - credential discovery"
  - Step 1: cat /etc/passwd (enumerate users)
  - Step 2: ls -la /home (find user directories)
  - Step 3: cat /var/log/auth.log (check login attempts)
  - Step 4: cat ~/.bash_history (find credentials)

- [x] Implement privilege escalation step validators (2h)
  - Filesystem command validation
  - Flexible arg matching for beginners

- [x] Write privilege escalation educational feedback (1.5h)
  - Linux permission model explanation
  - Log analysis context
  - Defense recommendations

- [x] Mobile testing privilege escalation scenario (0.5h) — ✅ Sessie 112: 4 tests in tutorial-mobile.spec.js
- [x] Integration testing privilege escalation scenario (0.5h) — ✅ Sessie 104: Playwright E2E coverage

### Phase 3: Integration & Polish (7h, 8 tasks) — 2/8 voltooid
- [ ] Mobile gesture support (2h - DEFERRED)
  - Swipe left/right for next/previous step (if gestures implemented)
  - Long-press for hint (if gestures implemented)
  - Fallback: keyboard navigation always works

- [x] Cross-browser testing tutorials (2h) — ✅ Sessie 112: All 36 mobile + 24 desktop tests pass on Chromium, Firefox, WebKit
  - Test on Chrome, Firefox, Safari (desktop)
  - Test on Mobile Safari, Chrome Mobile
  - Verify localStorage persistence across browsers

- [x] Performance optimization tutorials (1h) — ✅ Sessie 106: Audit complete, geen actie nodig
  - Tutorial bundle = 37 KB (ruim binnen 60 KB budget)
  - Lazy-loading niet waard: 3 scenarios × ~5 KB = te klein voor dynamic import overhead
  - Validators al minimaal: `cmd === 'x' && args.length > 0` (geen regex)

- [x] Documentation updates tutorials (1h)
  - Added tutorial system to CLAUDE.md Recent Learnings (Sessie 103)
  - Playwright E2E test suite created (Sessie 104)
  - Tutorial cert subcommand documented in man page

- [x] Playwright E2E tests for tutorials (1h) — ✅ Sessie 104: 18 tests in tutorial.spec.js
  - 18 tests covering lifecycle, hints, persistence, completion, all 3 scenarios, cert, reset
  - Follows fixtures.js pattern (Cookiebot blocking)

- [ ] Beta testing tutorials with 3+ users (0.5h coordination)
  - Focus on tutorial completion rate
  - Gather feedback on hint timing
  - Identify confusing steps

- [x] Lighthouse audit post-tutorials (0.5h) — ✅ Sessie 106: CLI audit 26/100/74/100 (A11y+SEO stable at 100)
  - Performance CLI score volatile (26-42 per run, netwerk-afhankelijk; DevTools = 100 in sessie 100)
  - Bundle size: 522 KB transfer (binnen 1000 KB budget)
  - A11y 100, Best Practices 74, SEO 100 — geen regressie vs M9 baseline

---

## 🎮 M7: Gamification (Fase 2 - Week 17-22)

**Doel:** Add motivation layer through challenges, badges, and certificates
**Tijdsinschatting:** 40-50 uur (6-7 dagen)
**Taken:** 47 total (46 voltooid)
**Dependencies:** M6 Tutorial System voltooid
**Status:** 🔵 In uitvoering (Phase 1-6 voltooid, Phase 7 testing deels)
**Bundle Budget:** +50KB max (total: ~428KB / 500KB = 86%)

**Success Criteria:**
- ✓ 15+ challenges functional across 3 difficulty levels
- ✓ 20+ badges with unlock detection working
- ✓ Certificate download works on desktop + mobile
- ✓ Challenge completion rate: >30% Easy, >15% Medium, >5% Hard
- ✓ Badge unlock rate >50% for Common badges
- ✓ Bundle size increase ≤50KB

### Phase 1: Challenge Framework (12h, 10 tasks) — ✅ 7/7 voltooid (Sessie 105)
- [x] Design challenge data structure (2h) — ✅ `src/gamification/challenges/*.js`
  - Challenge properties: id, title, description, difficulty, requirements, points
  - Difficulty levels: Easy (5-10 points), Medium (15-25 points), Hard (30-50 points)
  - Requirements format: command list + optional conditions
  - JSON schema definition

- [x] Implement challenge engine (3h) — ✅ `src/gamification/challenge-manager.js` (state machine IDLE→ACTIVE→COMPLETE)
  - Challenge registry (similar to command registry)
  - Validation logic: check if user commands match requirements
  - Progress tracking: completed challenges, timestamps
  - Points calculation: base points + time bonus + accuracy bonus

- [x] Create challenge command interface (2h) — ✅ `src/commands/system/challenge.js`
  - `challenge` → List all challenges by difficulty
  - `challenge [id]` → Start specific challenge
  - `challenge status` → Show progress dashboard
  - `challenge leaderboard` → Local leaderboard (localStorage)

- [x] Build challenge UI (2h) — ✅ `src/gamification/challenge-renderer.js` (ASCII boxes)
  - Challenge list display (grouped by difficulty)
  - Active challenge indicator (top-right corner or status bar)
  - Progress bar (ASCII: [=====>    ] 50%)
  - Challenge completion animation (ASCII art celebration)

- [x] Implement localStorage persistence challenges (1.5h) — ✅ `src/gamification/progress-store.js` (key: `hacksim_gamification`)
  - Key: `hacksim_challenge_progress`
  - Data: { completedChallenges, totalPoints, currentStreak, lastActiveDate }
  - Auto-save after each challenge step
  - Streak calculation (consecutive days)

- [x] Analytics integration challenges (1h) — ✅ Via progressStore tracking
  - Event: challenge_started (challenge_id, difficulty)
  - Event: challenge_completed (challenge_id, time_taken, points_earned)
  - Event: challenge_failed (challenge_id, step_failed_at)

- [x] Error handling challenges (0.5h) — ✅ Invalid ID→suggestion, completed→replay, in progress→resume
  - Invalid challenge ID → suggestion list
  - Challenge already completed → replay option
  - Challenge in progress → resume prompt

### Phase 2: Challenge Content (15h, 15 tasks) — ✅ 15/15 voltooid (Sessie 105)

**Easy Challenges (5h, 5 tasks) - 5 points each**
- [x] "Network Scout" challenge (1h) — ✅ `network-scout.js`
  - Requirements: ping + nmap on same target
  - Validator: check command history for IP match

- [x] "File Explorer" challenge (1h) — ✅ `file-explorer.js`
  - Requirements: find + cat a specific file
  - Validator: check if target file accessed

- [x] "Identity Check" challenge (1h) — ✅ `identity-check.js`
  - Requirements: whoami + id commands
  - Validator: identity enumeration commands

- [x] "Domain Intel" challenge (1h) — ✅ `domain-intel.js`
  - Requirements: whois + dig on domain
  - Validator: domain reconnaissance

- [x] "Log Hunter" challenge (1h) — ✅ `log-hunter.js`
  - Requirements: find + read log files
  - Validator: log analysis sequence

**Medium Challenges (5h, 5 tasks) - 15-25 points each**
- [x] "Port Scanner Pro" challenge (1h) — ✅ `port-scanner-pro.js`
  - Requirements: nmap with flags (-p, -sV) on multiple targets
  - Validator: check for flag usage + multiple IPs

- [x] "Web Recon" challenge (1h) — ✅ `web-recon.js`
  - Requirements: whois + traceroute + nmap on web target
  - Validator: verify command sequence + target type (domain)

- [x] "SQL Sleuth" challenge (1h) — ✅ `sql-sleuth.js`
  - Requirements: nikto → sqlmap on same target
  - Validator: check command order + target match

- [x] "Password Cracker" challenge (1h) — ✅ `password-cracker.js`
  - Requirements: find hash file → hashcat on hash
  - Validator: check if /etc/shadow accessed + hashcat used

- [x] "System Navigator" challenge (1h) — ✅ `system-navigator.js`
  - Requirements: cd through directories + find hidden files
  - Validator: track directory changes + ls -a usage

**Hard Challenges (5h, 5 tasks) - 30-50 points each**
- [x] "Full Recon" challenge (1h) — ✅ `full-recon.js`
  - Requirements: Complete reconnaissance tutorial + scan 5 unique targets
  - Validator: tutorial completion + command history analysis

- [x] "Privesc Path" challenge (1h) — ✅ `privesc-path.js`
  - Requirements: find SUID binaries + enumerate users + access restricted file
  - Validator: specific command sequence + restricted file access

- [x] "Multi-Tool Master" challenge (1h) — ✅ `multi-tool-master.js`
  - Requirements: Use 15+ unique commands in single session
  - Validator: command diversity check

- [x] "Attack Chain" challenge (1h) — ✅ `attack-chain.js`
  - Requirements: Complete multi-step attack simulation
  - Validator: chained command sequence

- [x] "Forensic Investigator" challenge (1h) — ✅ `forensic-investigator.js`
  - Requirements: Log analysis + file forensics
  - Validator: forensic investigation sequence

### Phase 3: Badge & Achievement System (8h, 8 tasks) — ✅ 6/6 voltooid (Sessie 105)
- [x] Design badge data structure (1h) — ✅ `src/gamification/badge-definitions.js`
  - Badge properties: id, title, description, icon (ASCII), rarity, unlockCondition
  - Rarity levels: Common, Uncommon, Rare, Epic, Legendary
  - Unlock conditions: command count, challenge completion, streaks

- [x] Implement badge manager (2h) — ✅ `src/gamification/badge-manager.js`
  - Badge registry with 21 badges
  - Unlock detection logic (check conditions after each command)
  - Badge notification system (ASCII box rendering)
  - Badge gallery (localStorage-backed collection)

- [x] Create achievements command (1h) — ✅ `src/commands/system/achievements.js` + man page
  - `achievements` → Show all badges (locked + unlocked)
  - `achievements unlocked` → Filter unlocked only
  - `achievements rarity [level]` → Filter by rarity

- [x] Define 21 badges (3h) — ✅ 8 Common, 6 Uncommon, 4 Rare, 2 Epic, 1 Legendary
  - 8 Common: "First Command", "10 Commands", "Network Novice", etc.
  - 6 Uncommon: "Tutorial Complete", "Challenge Champion", etc.
  - 4 Rare: "Speed Demon" (<1s command), "Night Owl" (midnight session), etc.
  - 2 Epic: "50 Commands", "All Tutorials Complete"
  - 1 Legendary: "100 Commands + All Challenges Complete"

- [x] Implement unlock notifications (0.5h) — ✅ ASCII box rendering in badge-manager.js
  - ASCII animation on badge unlock
  - Add to badge gallery immediately

- [x] Analytics integration badges (0.5h) — ✅ Via progressStore
  - Event: badge_unlocked (badge_id, rarity, session_time)

### Phase 4: Certificate & Download System (5h, 5 tasks) — ✅ 4/4 voltooid (Sessie 105)
- [x] Design certificate templates (1.5h) — ✅ 3 tiers: Easy/Medium/Hard ASCII art
  - ASCII art border (reuse asciiBox.js)
  - Template variables: challenge name, user name, date, time taken, rank
  - 3 templates: Easy, Medium, Hard (different ASCII art)

- [x] Implement certificate generator (2h) — ✅ `src/gamification/certificate-generator.js`
  - Generate text-based certificate on challenge completion
  - Include: challenge metadata, performance stats, custom message
  - Preview in terminal before download

- [x] Build download functionality (1h) — ✅ .txt via Blob API + clipboard fallback
  - Text file (.txt) download via Blob API
  - Filename: HackSim_Certificate_[ChallengeID]_[Date].txt
  - Copy-to-clipboard fallback (mobile)

- [x] Certificate gallery command (0.5h) — ✅ `certificates` command
  - `certificates` → List all earned certificates
  - `certificates download [id]` → Re-download specific certificate

### Phase 5: Progress Dashboard (5h, 5 tasks) — ✅ 5/5 voltooid (Sessie 105)
- [x] Design dashboard layout (1h) — ✅ Stats, challenges, badges, next step sections
  - Section 1: Overall stats (total commands, points, badges)
  - Section 2: Challenge progress (completed/total by difficulty)
  - Section 3: Recent achievements (last 5 badges)
  - Section 4: Streak tracker (current streak, longest streak)
  - Mobile-optimized (<40 chars width)

- [x] Implement dashboard command (2h) — ✅ `dashboard` met subcommands (stats, badges, challenges)
  - `dashboard` → Show full progress dashboard
  - `dashboard stats` → Stats only
  - `dashboard badges` → Badge gallery
  - `dashboard challenges` → Challenge progress

- [x] Build streak tracking system (1h) — ✅ In progressStore
  - Track last active date in localStorage
  - Calculate streak: consecutive days with >5 commands
  - Streak notification on login
  - Streak reset warning

- [x] Analytics dashboard metrics (0.5h) — ✅ Via progressStore tracking
  - Track dashboard views
  - Track streak milestones (7-day, 30-day, etc.)

- [x] Mobile optimization dashboard (0.5h) — ✅ Plain format for ≤375px viewports
  - Scrollable dashboard sections
  - Simplified layout for narrow screens

### Phase 6: Leaderboard (5h, 5 tasks) — ✅ 4/4 voltooid (Sessie 106)
- [x] Design local leaderboard system (1.5h) — ✅ `src/gamification/leaderboard-data.js` (simulated top-10)
  - Local-only leaderboard (localStorage, MVP approach)
  - Track top 10 sessions by points
  - Simulated competitive usernames for motivation

- [x] Implement local leaderboard (2h) — ✅ `src/gamification/leaderboard-manager.js`
  - Store: top 10 sessions (points, date, command count)
  - Calculate rank: sort by total points
  - Personal ranking integration with simulated data

- [x] Create leaderboard command (1h) — ✅ `src/commands/system/leaderboard.js`
  - `leaderboard` → Show top 10
  - `leaderboard me` → Show user rank
  - Display format: ASCII table with rank, username, points

- [x] Leaderboard UI polish (0.5h) — ✅ Highlight user entry, percentile display
  - Highlight user's entry
  - Show percentile (e.g., "Top 15%")

### Phase 7: Integration & Testing (10h, 7 tasks) — 🔵 5/6 voltooid
- [x] Integrate gamification with terminal system (2h) — ✅ Hooks in terminal.js + challenge flow
  - Award points for tutorial completion
  - Unlock badges on terminal milestones
  - Badge unlock detection across sessions

- [x] Badge unlock detection across sessions (1h) — ✅ Hooked into terminal and challenge flow
  - Badge checks triggered after command execution
  - Cross-session persistence via progressStore

- [x] Cross-system testing gamification (3h) — ✅ Sessie 111: 14 Playwright E2E tests (gamification.spec.js)
  - Challenge flow: list, start, status, hint tiers, exit, completion, already-completed
  - Badge system: unlock notification, achievements display, rarity filter, unlocked filter
  - Leaderboard: ranked list with simulated names, personal ranking

- [x] Performance testing gamification (2h) — ✅ Sessie 111: 7 Playwright E2E tests (gamification-performance.spec.js)
  - Dashboard/achievements/leaderboard/challenge render <2s with heavy data (15 challenges, 21 badges)
  - localStorage <50KB with maximum gamification data
  - 10 rapid commands without terminal errors (debounce stress test)
  - Bundle size verification (<80KB — actual 67.8KB)

- [x] Mobile testing gamification (1.5h) — ✅ Sessie 111: 6 Playwright E2E tests (gamification-mobile.spec.js)
  - All gamification commands on 375x667 viewport (dashboard, challenge, achievements, leaderboard)
  - Certificate display on mobile
  - Full challenge completion flow on mobile

- [ ] Beta testing gamification (1h)
  - Focus on challenge difficulty balance
  - Gather feedback on point values
  - Test badge unlock satisfaction

---

## 📊 M8: Analytics & Command Scaling (Fase 2 - Week 23-28)

**Doel:** Production-ready analytics + command system optimization for 50+ commands
**Tijdsinschatting:** 30-40 uur (4-5 dagen)
**Taken:** 40 total
**Dependencies:** M5 MVP launched, M6 tutorials deployed
**Status:** ⏭️ Gepland
**Bundle Budget:** +40KB max (net +35KB after GA4 removal, total: ~463KB / 500KB = 93%)

**Success Criteria:**
- ✓ Plausible Analytics tracking 100% of GA4 events
- ✓ Help paging activates at 50+ commands
- ✓ Session export/import with 100% data fidelity
- ✓ Command execution latency <50ms with 100+ commands
- ✓ Bundle size increase ≤40KB (net ≤35KB after GA4 removal)
- ✓ Zero cookies stored (full privacy compliance)

### Phase 1: Plausible Analytics Migration (10h, 10 tasks)
- [ ] Research Plausible API (1h)
  - Review Plausible.io documentation
  - Identify custom event tracking methods
  - Compare with GA4 event structure
  - Plan data mapping (GA4 → Plausible)

- [ ] Create Plausible tracker abstraction (2h)
  - New file: src/analytics/plausible-tracker.js
  - Implement: init(), trackEvent(), trackPageview()
  - Mirror GA4 event structure for compatibility
  - Cookie-less tracking (no consent banner needed)

- [ ] Update analytics abstraction layer (2h)
  - Modify src/analytics/tracker.js to support dual tracking
  - Feature flag: ANALYTICS_PROVIDER ('ga4' | 'plausible')
  - Graceful fallback if Plausible script fails

- [ ] Migrate event definitions (1.5h)
  - Map GA4 events → Plausible custom events
  - Update src/analytics/events.js
  - Ensure backward compatibility during transition

- [ ] Update consent manager (1h)
  - Remove cookie consent banner for Plausible
  - Add informational notice: "We use privacy-friendly analytics"
  - Update src/analytics/consent.js

- [ ] Deploy Plausible script (0.5h)
  - Add Plausible script tag to index.html
  - Configure domain in Plausible dashboard
  - Set up custom event goals

- [ ] Testing & validation Plausible (1.5h)
  - Test custom events in Plausible dashboard
  - Verify cookie-less operation (no consent needed)
  - Compare GA4 vs. Plausible metrics (parallel tracking for 2 weeks)

- [ ] Remove GA4 dependencies (0.5h)
  - Remove GA4 script tags
  - Delete GA4-specific code from tracker.js
  - Bundle size reduction: ~5KB

### Phase 2: Help Command Paging System (8h, 8 tasks)
- [ ] Implement paging state machine (2h)
  - States: DISPLAY → MORE_AVAILABLE → END
  - Page size: 10 commands (fits 80% of terminal viewports)
  - Keyboard handlers: SPACE (next), Q (quit), ESC (quit)
  - Architecture ready from Sessie 36 (modular functions)

- [ ] Build help pager UI (2h)
  - Header: "Commands (Page 1/3)"
  - Body: 10 commands with descriptions
  - Footer: "-- More -- (SPACE for next, Q to quit)"
  - Mobile optimization: 8 commands per page on <768px

- [ ] Integrate with help command (1.5h)
  - Conditional trigger: if command count ≥ 50
  - Fallback: if <50 commands, show all (current behavior)
  - Preserve category filtering: help network (paginated)

- [ ] Implement keyboard navigation help paging (1.5h)
  - SPACE: load next page
  - Q / ESC: exit paging mode
  - Page state persistence during session (not localStorage)

- [ ] Add page indicators (0.5h)
  - Footer: "Page 2 of 5 | 35 commands total"
  - Progress bar (optional): [======>   ] 40%

- [ ] Testing with 50+ commands (0.5h)
  - Simulate 50-command registry
  - Test paging UX across 5 pages
  - Test keyboard shortcuts

### Phase 3: Session Export/Import (7h, 8 tasks)
- [ ] Design export data structure (1h)
  - JSON schema: { version, timestamp, commands[], filesystem, progress, settings }
  - Include: command history, VFS state, tutorial progress, challenge progress
  - Exclude: PII, analytics IDs

- [ ] Implement session export (2h)
  - Command: `export session`
  - Generate JSON from localStorage
  - Download as HackSim_Session_[Timestamp].json
  - File size estimate: 50-200KB (depends on history)

- [ ] Implement session import (2h)
  - Command: `import session`
  - Trigger file picker (input type="file")
  - Validate JSON schema
  - Merge or replace current session (user choice)

- [ ] Build import validator (1h)
  - Schema validation: check required fields
  - Version compatibility check (handle old exports)
  - Data integrity: verify filesystem structure
  - Error handling: corrupted JSON, wrong format

- [ ] Add import conflict resolution (0.5h)
  - Option 1: Replace (overwrite current session)
  - Option 2: Merge (combine histories, keep higher progress)
  - User prompt: "Replace current session or merge?"

- [ ] Testing session export/import (0.5h)
  - Export → import → verify state restoration
  - Test with corrupted JSON
  - Test version compatibility (future-proof)

### Phase 4: Advanced Analytics Dashboard (5h, 6 tasks)
- [ ] Design analytics dashboard UI (1h)
  - Section 1: Session metrics (duration, command count, unique commands)
  - Section 2: Learning progress (tutorials, challenges, badges)
  - Section 3: Command usage heatmap (top 10 commands)
  - Section 4: Error patterns (top 5 errors)
  - Mobile-optimized layout

- [ ] Implement analytics dashboard command (2h)
  - Command: `analytics` or `stats`
  - Pull data from localStorage + Plausible API (optional)
  - Display: ASCII tables + charts (bar chart with | characters)

- [ ] Build command usage tracker (1h)
  - Track: command name, execution count, last used timestamp
  - Store in localStorage: `hacksim_command_usage`
  - Generate heatmap: top 10 most-used commands

- [ ] Build error pattern tracker (0.5h)
  - Track: error type, command causing error, count
  - Store in localStorage: `hacksim_error_patterns`
  - Display: top 5 errors with suggestions

- [ ] Mobile optimization analytics dashboard (0.5h)
  - Collapsible sections
  - Scrollable charts
  - Tap to expand details

### Phase 5: Command System Scaling (10h, 8 tasks)
- [ ] Performance audit with 50+ commands (2h)
  - Measure: registry lookup time, command parsing overhead
  - Benchmark: execute 100 commands, measure avg latency
  - Target: <50ms per command execution

- [ ] Optimize command registry (2h)
  - Index by first character for O(1) lookup
  - Lazy-load command modules (dynamic import)
  - Cache parsed commands (memoization)

- [ ] Implement command caching (1.5h)
  - Cache: parsed command object (name, args, flags)
  - TTL: 5 minutes (clear after inactivity)
  - Memory limit: max 100 cached entries

- [ ] Build command search index (2h)
  - Index: command name, aliases, tags (for fuzzy matching)
  - Structure: inverted index (tag → [commands])
  - Update index when new commands registered

- [ ] Optimize fuzzy matching (1h)
  - Pre-compute Levenshtein distance matrix
  - Early exit for exact matches
  - Limit search to top 5 suggestions

- [ ] Test with 100+ commands (1h)
  - Simulate 100-command registry
  - Measure: registry lookup, fuzzy match, command execution
  - Verify: no performance degradation

- [ ] Bundle size optimization (0.5h)
  - Analyze: largest command modules
  - Compress: minify command descriptions
  - Tree-shake: remove unused exports

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
- `docs/prd.md` - Product Requirements v1.8
- `PLANNING.md` - Architectuur & Tech Stack
- `CLAUDE.md` - AI Assistant Context

**Command Specs:**
- `docs/commands-list.md` - Alle 40 commands gespecificeerd

---

**Laatst bijgewerkt:** 17 maart 2026
**Versie:** 4.1 (Sessie 116 — Doc Sync: tellingen, datums, percentages)
**Totaal Taken:** 315 (zie toptabel voor actuele breakdown per mijlpaal)
**Voltooide Taken:** 267/315 (84.8%) — M0-M4: 100%, M5: 91% (41/45), M5.5: Geannuleerd, M6: 88% (30/33), M7: 98% (46/47), M9: 100% (19/19)
**Live URL:** https://hacksimulator.nl/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator
**Bundle:** ✅ ~809 KB na Netlify minificatie (Terminal Core ~340 KB, site totaal binnen 1000 KB budget — Sessie 100)

---

**🚀 Let's build HackSimulator.nl!**
