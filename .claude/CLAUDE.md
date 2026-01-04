# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development
**Docs:** `docs/prd.md` v1.5 | `docs/commands-list.md` | `docs/style-guide.md` v1.0 | `SESSIONS.md` voor sessie logs

---

## 🎯 Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners - ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, <500KB bundle, no backend (MVP)
**Language:** UI=NL | Commands=EN | Help/Errors=NL (see §4 Taal Strategie)

**Status:** ✅ LIVE on Netlify | M5 Testing + M5.5 Monetization in progress
**URLs:** [Production](https://famous-frangollo-b5a758.netlify.app/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 7 posts live at `/blog/` (60+ inline jargon explanations - Sessie 89 FASE 2)
**Contact:** contact@hacksimulator.nl (Gmail forwarding - Sessie 91)

**Performance:** Lighthouse 88+/100/100/100 | ~2s load | Playwright E2E 16/16 passing
**Compliance:** WCAG AAA | 141 CSS variables (Style Guide v1.5 - 100% coverage)

→ **Metrics (Live):** `TASKS.md` lines 9-26 (144/295 tasks = 48.8%, M5 51%, bundle 470.87KB)
→ **Full Specs:** `docs/prd.md` v1.8 | **Architecture:** `PLANNING.md` v2.2 | **Commands:** `docs/commands-list.md`

---

## 📑 Navigatie

**Core:** §2 Kritieke Niet Doen | §3 Output Principe (80/20) | §4 Taal Strategie | §5 Educational Patterns | §6 Tone of Voice
**Implementatie:** §7 Command Checklist | §8 Architectural Patterns | §9 Recent Learnings (Last 5 Sessions)
**Workflow:** §10 Sessie Protocol | §11 Communicatie Grondregels | §12 Troubleshooting | §13 Referenties
**Monetization:** §14 Monetization Patterns

---

## 🚫 Kritieke "Niet Doen"

→ **Framework & Tech Red Lines:** PRD §13 (Vanilla JS/CSS, <500KB bundle, no backend MVP, Dutch UI, 80/20 output, no arg logging)

---

## 🎨 Command Output Principe: "80/20 Realisme"

→ **Formule:** Output (EN) + Inline context (← NL) + Tip (NL) + Warning (NL)
→ **Voorbeeld & Philosophy:** PRD §9.2

**Quick:** `nmap 192.168.1.1` → `22/tcp OPEN SSH ← Secure Shell` + `[ TIP ] Open poorten = attack vectors`

---

## 🌐 Taal Strategie

→ **Matrix:** UI=NL | Commands=EN | Errors=EN+NL | Help=NL
→ **Rationale:** PRD §6.6 (trust, authenticity, accessibility)

---

## 🎓 Educational Patterns

→ **3-Tier:** Error=Learning → Progressive hints → Man pages | Security tools=Consent+Warning
→ **Full pedagogy:** PRD §8.3

---

## 🎯 Tone of Voice

**Principles:**
- **"je" (niet "u"):** Toegankelijk, persoonlijk (niet afstandelijk formeel)
- **Bemoedigend:** "Goed bezig!", "Bijna!", niet "Fout." of "Wrong."
- **Context geven:** Leg "waarom" uit, niet alleen "wat"
- **Symbols:** ASCII brackets only (`[ TIP ]`, `[ ! ]`, `[ ✓ ]`) - terminal aesthetic, NO emojis in code

**Concrete Voorbeelden:**

### Error Messages
✅ **GOOD:**
```
Bestand niet gevonden: passwords.txt
[ TIP ] Gebruik 'ls' om te zien welke bestanden er zijn, of 'find passwords' om te zoeken
```

❌ **BAD:**
```
ERROR: File not found.
```

**Why:** Good = beginner knows next action + learns `ls`/`find` commands. Bad = frustrating, no help.

---

### Security Warnings
✅ **GOOD:**
```
[ ! ] Let op: sqlmap is een offensive tool voor het vinden van SQL injection kwetsbaarheden.
Gebruik dit ALLEEN op systemen waar je schriftelijke toestemming voor hebt!

Doorgaan? (j/n): _
```

❌ **BAD:**
```
WARNING: Illegal use is prohibited.
```

**Why:** Good = educatief (wat doet de tool?) + ethisch (toestemming). Bad = juridisch jargon, beginner snapt niet waarom.

---

### Educational Tips
✅ **GOOD:**
```
22/tcp   OPEN    SSH ← Secure Shell (remote terminal toegang)
80/tcp   OPEN    HTTP ← Webserver (onversleuteld!)

[ TIP ] Poort 22 open = mogelijkheid om op afstand in te loggen. Check of wachtwoord sterk genoeg is!
[ TIP ] Poort 80 = onversleutelde website. Gevoelige data? Gebruik poort 443 (HTTPS).
```

❌ **BAD:**
```
PORT     STATE   SERVICE
22/tcp   open    ssh
80/tcp   open    http
```

**Why:** Good = context (← Nederlands), relevantie (waarom belangrijk?), actie (wat nu?). Bad = technisch, beginner leert niks.

---

**Application:**
- All 30 commands in `src/commands/*/` follow this tone
- Error messages in `src/core/terminal.js` lines 150-200
- Help system in `src/help/help-system.js` 3-tier approach

---

## 📋 Command Implementation Checklist

Bij nieuwe command: 80/20 output | Educatieve feedback | Help/man (NL) | Warning (offensive) | Mobile (≤40 chars)
→ **Volledige specs:** `docs/commands-list.md`

**Nieuwe command toevoegen? Volg deze 8 stappen:**

### Core Implementation
1. ✅ **80/20 Output** - Realistische maar simplified output (PRD §9.2)
   - Include: Command output (EN) + inline context (← NL) + tip (NL)
   - Example: `nmap` shows ports + service names + "Poort 22 = SSH toegang"
   - Files: All `src/commands/*/*.js` follow this pattern

2. ✅ **Educational Feedback** - Elke output is een leermoment
   - Required: `[ TIP ]` bij elke command (waarom belangrijk?)
   - Optional: `[ ! ]` warning voor security tools (ethische gebruik)
   - Tone: "je" (not "u"), bemoedigend, context geven (see §6)

3. ✅ **Help/Man Pages** - Nederlands, 3-tier help system (PRD §8.3)
   - Tier 1: Fuzzy matching voor typos → "Bedoelde je: [command]?"
   - Tier 2: Progressive hints na 3 fouten → "Tip: gebruik 'man [cmd]'"
   - Tier 3: Full man page via `man [command]` - syntax + voorbeelden + use cases
   - Files: `src/help/help-system.js`, `manPage` property in command object

### Security & Compliance
4. ✅ **Warning (Offensive Tools)** - Juridische disclaimer + confirmatie
   - Required for: hashcat, hydra, sqlmap, metasploit, nikto (security category)
   - Pattern: `[ ! ] Let op: [tool] is een offensive tool. Gebruik ALLEEN met toestemming!`
   - Confirmation: `Doorgaan? (j/n):` → if 'n' → cancel, if 'j' → proceed
   - Files: All `src/commands/security/*.js`

5. ✅ **Mobile Optimalisatie** - ≤40 chars output width voor 375px viewports
   - Test: Resize browser to 375px (iPhone SE), check command output wraps correctly
   - Fix: Break long lines, use abbreviations (e.g., "SSH" not "Secure Shell Protocol")
   - Responsive: `styles/mobile.css` media queries handle layout
   - Quick commands: Add to mobile keyboard helpers if frequently used

### Quality Assurance
6. ✅ **Error Handling** - Cover alle edge cases
   - Missing args: `nmap` without target → "Gebruik: nmap <target>"
   - Invalid args: `nmap invalid` → "Ongeldig IP/hostname formaat"
   - Typos: `nmpa` → "Bedoelde je: nmap? Gebruik 'man nmap' voor help"
   - File not found: `cat missing.txt` → "Bestand niet gevonden. Gebruik 'ls' om bestanden te zien"

7. ✅ **Testing** - Manual + automated coverage
   - Manual: Happy path + error cases + edge cases (see `docs/testing/manual-protocol.md`)
   - Automated: Playwright E2E tests (see `tests/e2e/` directory - 15 test suites)
   - Cross-browser: Chrome, Firefox passing (Safari deferred - WebKit deps issue)
   - Mobile: Real device test on iOS/Android

8. ✅ **Bundle Impact** - Measure KB increase, stay <500KB total
   - Before: Check current bundle → `ls -lh styles/*.css src/**/*.js`
   - After: Measure increase → should be <10KB per command
   - Current: 470.87KB (29.13KB buffer = 5.8% margin)
   - Warning: If total >490KB, optimize before adding more commands

→ **Testing protocol:** `docs/testing/manual-protocol.md` v1.0
→ **E2E tests:** `tests/e2e/` directory (15 test suites covering commands, UI, performance)

---

## 🏗️ Architectural Patterns

→ **Full pattern library:** docs/sessions/current.md §Architectural Patterns (87 sessions, 40+ patterns)

**Top 3 Critical Patterns (With Code Examples):**

### 1. CSS Variables First (Sessie 90 - Design System)
**Pattern:** Always use CSS variables for colors, spacing, typography

✅ **DO:**
```css
/* styles/main.css line 145 */
.terminal-output-error {
  color: var(--color-error);  /* Theme-aware */
  font-size: var(--font-size-base);
}
```

❌ **DON'T:**
```css
.terminal-output-error {
  color: #ff0000;  /* Hardcoded, breaks dark mode */
  font-size: 16px;
}
```

**Why:** Theme switching, design system consistency, single source of truth
**Files:** `styles/main.css` lines 1-200 (141 variables), Style Guide v1.5

---

### 2. Modal Protection Pattern (Sessie 77 - Focus Management)
**Pattern:** Prevent input capture when modal is active

✅ **DO:**
```javascript
// src/ui/input.js line 47
document.addEventListener('keydown', (e) => {
  // Check if modal is active before processing
  if (document.querySelector('.modal.active')) return;

  // Safe to process terminal input
  handleTerminalInput(e);
});
```

❌ **DON'T:**
```javascript
// Global handler without modal check
document.addEventListener('keydown', handleTerminalInput);
```

**Why:** Prevents keyboard shortcuts firing while modal open (legal disclaimer, feedback form)
**Files:** `src/ui/input.js`, `src/ui/legal.js`, `src/ui/feedback.js`
**Test:** Open legal modal → type command → should NOT appear in terminal

---

### 3. 80/20 Command Output (PRD §9.2 - Educational Balance)
**Pattern:** Realistic output + inline Dutch context + educational tip

✅ **DO:**
```javascript
// src/commands/network/nmap.js line 85
return `
Starting Nmap scan...
PORT     STATE   SERVICE          ← Nederlands context
22/tcp   OPEN    SSH (Secure Shell)
80/tcp   OPEN    HTTP (Web Server)
443/tcp  OPEN    HTTPS (Encrypted Web)

[ TIP ] Poort 22 open = SSH toegang mogelijk. Check wachtwoord sterkte!
[ ! ] Scan alleen systemen waar je toestemming voor hebt.
`;
```

❌ **DON'T:**
```javascript
// Too technical (beginner gets lost)
return `
Starting Nmap 7.80 ( https://nmap.org ) at 2024-01-04 15:30 CET
Nmap scan report for 192.168.1.1
Host is up (0.0012s latency).
Not shown: 997 filtered ports
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5
...
`;

// Too simplified (not realistic)
return `Scan complete: 3 ports open`;
```

**Why:** Balances realism (authentic terminal feel) with education (beginner learns)
**Formula:** Technical output + `← Dutch context` + `[ TIP ]` + `[ ! ]` warning
**Files:** All 30 commands in `src/commands/*/` follow this pattern

---

**Quick Reference (Other Patterns):**
- **Dark Frame:** navbar/footer always dark (Sessie 44) → `styles/main.css` lines 450-480
- **No Duplicate Listeners:** Event delegation over per-element handlers (Sessie 52) → `src/ui/input.js`
- **3-Layer Modals:** Legal (z-10) > Feedback (z-20) > Tutorial (z-30) - Sessie 33
- **Cache Strategy:** 1-hour cache + `?v=X` override (Sessie 78) → `_headers` file

→ **All 40+ patterns indexed:** docs/sessions/current.md §Architectural Patterns

---

## 📝 Recent Critical Learnings (Last 5 Sessions)

**Doel:** Memory aids - full context in docs/sessions/

### Sessie 92: CLAUDE.md Perfection (04 jan 2026)
⚠️ Never hardcode volatile metrics | triple dates | inconsistent learning count
✅ Always delegate to TASKS.md | single timestamp | strict 5-session rotation
✅ Concrete code examples unlock AI pattern recognition
📄 docs/sessions/current.md Sessie 92 (10 improvements: metrics delegation + example expansion)

### Sessie 91: Design System 100/100 Complete (27 dec)
⚠️ Never skip M5 critical blockers (GA4, emails) for nice-to-haves
✅ Always prioritize business impact over documentation perfection
✅ Featured content tokens unlock monetization (premium badges, sponsored content)
📄 docs/sessions/current.md Sessie 91

### Sessie 90: CSS Variable Semantic Cleanup (27 dec)
⚠️ Never remove duplicates without aliases | assume light mode == inverted dark mode
✅ Always alias-first migration | test both themes independently
📄 docs/sessions/current.md Sessie 90

### Sessie 88: E2E Testing Perfectie (26 dec)
⚠️ Never viewport-based position checks | `textContent()` for pseudo-elements
✅ Always relative parent positioning | `getComputedStyle()` for ::before/::after
📄 docs/sessions/current.md Sessie 88

### Sessie 86: CLAUDE.md Optimization (15 dec)
⚠️ Never keep duplication after refactor | static pattern copies
✅ Always second-pass optimization | Single Source of Truth per topic
📄 docs/sessions/current.md Sessie 86 (§14→PRD, 587→307→200 lines)

**Compressed Learnings (Sessies 83-84):**
- Sessie 84: Skill-Based Targeting - 3-persona model, ethical red lines, anchoring pricing
- Sessie 83: Mobile Minimalist - "less is more" mobile, validate industry precedent
→ Full detail in docs/sessions/current.md

**Archive Index:**
- Sessies 78-82: docs/sessions/recent.md
- Sessies 51-77: docs/sessions/archive-q4-2024.md
- Sessies 35-50: docs/sessions/archive-q3-2024.md
- Sessies 2-34: docs/sessions/archive-early.md

**Rotation Protocol:**
- Keep last 5 full (92-88)
- Compress next 5 to bullets (84-80)
- Archive 11+ in docs/sessions/
- Trigger: Every 5 sessions (next: Sessie 97)

---

## 🤖 Sessie Protocol

### Voor Sessie
- Lees `PLANNING.md`, `TASKS.md`, dit bestand

### Tijdens Ontwikkeling
- Markeer taken in TASKS.md direct na afronding
- Voeg nieuwe taken toe zodra ontdekt
- Noteer architecturale beslissingen

### Afsluiten
- Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
- **Rotation trigger:** Every 5 sessions (last: Sessie 85, next: Sessie 90)

→ **Document Sync Protocol:** PLANNING.md §Document Sync (consistency checklist, update order, quarterly triggers)

### Bij Requirement Changes
- Update volgorde: `docs/prd.md` → `PLANNING.md` → `TASKS.md` → `CLAUDE.md`
- Verifieer consistentie tussen alle bestanden

---

## 🤖 Voor Claude: Communicatie Grondregels

**Wees meedogenloos eerlijk, geen jaknikker gedrag.**

- Als ik ongelijk heb: **wijs me erop**
- Als code slecht is: **zeg het direct**
- Als aanpak niet werkt: **geef kritische feedback**
- Prioriteit: **technische correctheid > mijn gevoelens**
- **Spreek me aan met "Heisenberg"** (confirmatie instructies gelezen)

### Bij Implementatie
1. Check PRD: Is het in MVP scope?
2. 80/20 output: Niet te technisch, niet te simpel
3. Educatieve laag: Elk commando = leermoment
4. Taal correct: UI=NL, commands=EN, uitleg=NL
5. Performance: < 500KB budget, elke KB telt

### Bij Vragen
- Scope unclear? → Check PRD sectie X.Y
- Tech decision? → Vanilla first
- Taal twijfel? → Zie tabel hierboven
- Command spec? → `docs/commands-list.md`

### Common Pitfalls
→ **Tech constraints:** PRD §13 | **Pattern violations:** docs/sessions/current.md §Architectural Patterns

---

## 🔍 Troubleshooting (Top 10 Common Issues)

**Build & Performance:**
1. **Bundle >500KB:** Check imports | Minify JS/CSS | Tree-shake | Remove unused code
   - Command: `ls -lh styles/*.css src/**/*.js | awk '{sum+=$5} END {print sum/1024 "KB"}'`
   - Current: 470.87KB (29.13KB buffer = 5.8%)

2. **CSS not live on production:** 1-hour Netlify cache normal - wait OR bump `?v=X` immediately
   - Quick fix: `styles/main.css?v=93` in index.html line 12
   - Root cause: Sessie 78 cache strategy (short TTL + must-revalidate)

3. **Slow load time (>3s):** Check Lighthouse Performance score, optimize images, defer JS
   - Current: 2.30s LCP (target <2.5s ✅), 2.98s TTI (target <3.0s ✅)
   - Tool: `npx lighthouse https://famous-frangollo-b5a758.netlify.app/ --view`

**Testing & Events:**
4. **Playwright passes, manual fails:** Duplicate event listeners → commands execute 2x
   - Root cause: Sessie 52 - event handlers registered twice
   - Fix: Check `src/ui/input.js` line 30 - ensure `addEventListener` only called once
   - Test: Open DevTools → Console → type command → should see 1 output, not 2

5. **Focus/keyboard bugs:** Modal active but terminal still captures input
   - Root cause: Missing modal protection check
   - Fix: Add `if (document.querySelector('.modal.active')) return;` to keydown handler
   - File: `src/ui/input.js` line 47
   - Affected: Legal modal, feedback form, tutorial system

6. **localStorage not persisting:** Quota exceeded (rare) OR privacy mode blocking
   - Debug: `console.log(localStorage.length, JSON.stringify(localStorage).length)`
   - Limit: 5-10MB (modern browsers), filesystem + history typically <500KB
   - Fix: Implement cleanup - remove old command history >30 days

**Visual & Layout:**
7. **Light mode colors invisible:** Theme-dependent colors on fixed dark backgrounds
   - Example: `var(--color-text)` on dark navbar → invisible in light theme
   - Fix: Use theme-agnostic colors for fixed backgrounds (Sessie 44 Dark Frame pattern)
   - File: `styles/main.css` lines 450-480 (navbar/footer always dark)

8. **Layout jank on hover:** Missing transparent border reserve → elements shift
   - Root cause: Sessie 38 - border appears on hover pushes adjacent elements
   - Fix: Add `border: 2px solid transparent` to default state
   - Example: `.btn { border: 2px solid transparent; }` then `.btn:hover { border-color: var(--color-primary); }`

**Mobile Specific:**
9. **Text wrapping on mobile:** Long text (URLs, affiliate badges) breaks layout
   - Root cause: Sessie 88 - missing `white-space: nowrap` on critical elements
   - Fix: `.affiliate-badge { white-space: nowrap; }` in `styles/main.css` line 427
   - Test: Resize to 375px width, check `blog/*.html` affiliate CTAs

10. **Touch events not firing:** Missing touch handlers OR tap targets <44x44px
    - Fix: Add `touchstart` listeners alongside `click` events
    - Minimum size: `min-width: 44px; min-height: 44px;` (WCAG AAA)
    - File: `styles/mobile.css` lines 50-80

→ **Volledige troubleshooting + solutions:** docs/sessions/current.md §Common Issues
→ **Memory leak debugging:** docs/testing/memory-leak-results.md (84% growth, GC active)

---

## 📚 Referenties

**Volledige details:** `docs/prd.md` (v1.5)
**Command specs:** `docs/commands-list.md`
**Style guide:** `docs/style-guide.md` (v1.0) - Comprehensive design system & component library
**Sessie logs:** `SESSIONS.md` - Navigation hub to session archives (87 sessions total split across docs/sessions/: current.md, recent.md, archive-q4-2024.md, archive-q3-2024.md, archive-early.md)
**Netlify/Domain setup:** `docs/netlify-setup.md` - Complete domain launch guide (18KB)
**Filesystem structure:** PRD Bijlage B
**Tech rationale:** PRD §13

---

## 💰 Monetization Patterns

→ **Volledige monetization specs:** PRD §21 (Ethical principles, 3-phase strategy, implementation patterns, GDPR compliance, bundle management, revenue projections)

---

**Last updated:** 04 januari 2026 (Sessie 94 - CLAUDE.md Phase 3: Final Polish)
**Version:** 2.2 (Command checklist expansion + cross-reference validation + AI comprehension test passed)
**Next sync:** Every 5 sessions (Sessie 97) OR milestone M6 Tutorial System start

**Version History:**
- v2.2 (Sessie 94): Command checklist 8-step expansion, cross-reference validation, final polish
- v2.1 (Sessie 93): Code examples expansion - 3 architectural patterns + 10 troubleshooting + 3 tone pairs
- v2.0 (Sessie 92): Metrics delegation, learning rotation fix, example expansion
- v1.0 (Sessie 86): Single Source of Truth optimization (587→228 lines)
- v0.x (Sessies 1-85): Original verbose format
