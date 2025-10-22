# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development
**Docs:** `docs/prd.md` v1.1 | `docs/commands-list.md` | `SESSIONS.md` voor sessie logs

---

## 🎯 Quick Reference

**Wat:** Veilige terminal simulator voor Nederlandse beginners (15-25 jaar)
**Stack:** Vanilla JS/CSS, client-side, localStorage, < 500KB bundle
**Scope:** 30 commands (System, Filesystem, Network, Security)
**Status:** M0-M5 Complete (100%) ✅ PRODUCTION READY - Beta Testing Phase
**Live URL:** https://famous-frangollo-b5a758.netlify.app/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator
**Taal:** UI=NL, commands=EN, uitleg=NL
**Analytics:** GA4 (MVP) → Plausible (bij 10k+ visitors)
**Tests:** 16/16 passing (Chromium 8/8, Firefox 8/8) ✅
**Bundle:** 312 KB / 500 KB (37.5% buffer) ✅

---

## 🚫 Kritieke "Niet Doen"

1. **GEEN frameworks** (React/Vue) - Vanilla JS only
2. **GEEN Tailwind** - Vanilla CSS (bundle size!)
3. **GEEN backend** voor MVP - localStorage only
4. **GEEN Engelse UI** - Nederlands target markt
5. **GEEN realistische output** - 80/20 regel (simpel maar authentiek)
6. **GEEN command args loggen** - privacy risk

---

## 🎨 Command Output Principe: "80/20 Realisme"

**Formule:**
- **Output:** Engels (authentiek) met inline `←` Nederlandse context
- **Tip:** Nederlands (💡 educatief)
- **Warning:** Nederlands (⚠️ bij offensive tools)

**Voorbeeld:**
```bash
$ nmap 192.168.1.1
Scanning for open ports...
PORT    STATE   SERVICE
22/tcp  OPEN    SSH       ← Secure Shell (externe toegang)
80/tcp  OPEN    HTTP      ← Webserver

💡 TIP: Open poorten zijn aanvalsvectoren.
```

**Niet te technisch** (50+ lines realistische output), **niet te simpel** ("Port 22: open").

---

## 🌐 Taal Strategie

| Component | Taal | Reden |
|-----------|------|-------|
| UI teksten | 🇳🇱 NL | Target markt vertrouwen |
| Commands | 🇬🇧 EN | Authentiek |
| Errors | 🇬🇧+🇳🇱 | Error EN + NL uitleg |
| Help/man | 🇳🇱 NL | Leermateriaal toegankelijk |

---

## 🎓 Educational Patterns

### Error = Leermoment
```bash
$ cat /etc/shadow
Permission denied: /etc/shadow

🔒 BEVEILIGING: Dit bestand bevat password hashes.
🎯 Probeer: cat /etc/passwd (wel leesbaar)
```

### Security Tool = Waarschuwing
```bash
$ hydra target.com
⚠️ WAARSCHUWING: Brute force is illegaal zonder toestemming.
Simulatie voortzetten? [j/n]
```

### 3-Tier Help
1. Instant: Fuzzy match → "Bedoelde je: nmap?"
2. Progressive: Na 2e fout → Hint met voorbeeld
3. Full: `man [cmd]` → Complete uitleg (NL)

---

## 🎯 Tone of Voice: "Friendly Expert"

**DO:** "je" (niet "u"), bemoedigend, context geven
**DON'T:** Neerbuigend, te formeel, aannames
**Emoji:** Max 1 per bericht (💡🔒⚠️✅❌🎯)

---

## 📋 Command Implementation Checklist

Bij nieuwe command:
- [ ] 80/20 output (simplified maar authentiek)
- [ ] Educatieve feedback in errors
- [ ] Help + man page (NL)
- [ ] Warning bij offensive tools
- [ ] Mobile-friendly (max 40 chars breed)

---

## ✅ MVP Release Criteria

**Quick Check:**
- [x] 30+ commands werkend (zie TASKS.md M0-M4 ✅)
- [x] 3-tier help system (fuzzy + progressive + man pages) ✅
- [x] Filesystem + reset functionaliteit ✅
- [x] < 3s load (4G) - **~2.0s LCP** ✅
- [x] < 500KB bundle - **312 KB (37.5% buffer)** ✅
- [x] Cross-browser tested (Chromium + Firefox) - **16/16 tests passing** ✅
- [ ] Mobile responsive (iOS, Android real devices) - **Manual testing pending**
- [x] Legal docs (Privacy, ToS, Cookies) ✅
- [x] Cookie consent (NL) ✅
- [x] Live deployment (Netlify + GitHub) ✅
- [x] Lighthouse audit (88/100/100/100) ✅
- [x] Security audit (input sanitization, localStorage protection) ✅
- [x] Accessibility audit (WCAG AAA color contrast 15.3:1) ✅

**Performance:** Bundle 312KB, Load ~2s, Lighthouse 88/100/100/100 (Perf/A11y/BP/SEO)
**Testing:** Playwright E2E (8 tests × 2 browsers = 16/16 passing)
**Volledige criteria:** Zie M5-AUDIT-REPORT.md (comprehensive 11-section audit)

---

## 📝 Key Learnings (Recent Sessions)

**Doel:** Anti-patterns en best practices uit recente sessies voor context carry-over

### Foundation Learnings (Sessies 2-4) - COMPRESSED
⚠️ **CSS/Layout:** Never use `transparent` in dark themes (invisible), `position: fixed` on footer (blocks input), custom cursors without JS sync (buggy), `position: absolute` without coordinates
✅ **CSS/Layout:** Hardcode colors for debugging, native browser features first, flexbox layouts (`min-height: 100vh`), remove unused code completely (bundle size!)

⚠️ **Documentation:** Never let instruction files grow >250 lines, remove context without impact analysis, keep verbose logs in instruction files
✅ **Documentation:** Two-tier docs (compact + detailed logs in SESSIONS.md), "Never/Always" format (5-7 bullets max), rotation strategy at 5+ sessions

📄 **Detailed logs:** `SESSIONS.md` Sessies 2-4 (CSS debugging, cursor implementation, documentation strategy)

### Foundation Implementation (Sessies 5-6) - COMPRESSED
⚠️ **localStorage/State:** Never assume localStorage valid (validate type), never initialize after loading (timing), never use 35+ script tags (ES6 modules)
⚠️ **ES6 Modules:** Never use `this._method()` in object literal exports (context issue), never let flags consume next token (-r broken)

✅ **localStorage/State:** Validate with `Array.isArray()`, init defaults before load, single entry point (main.js), graceful degradation
✅ **ES6 Modules:** Standalone functions for helpers, single-letter flags = boolean only, test real patterns (rm -r, ls -la)

📄 **Detailed logs:** `SESSIONS.md` Sessies 5-6 (M0-M2 Complete: localStorage, ES6 modules, parser, 18 commands)

### ES6 Module Import Debugging (Sessie 7)
⚠️ **Never:**
- Assume ES6 module imports fail loudly (they fail silently on wrong paths)
- Use `import vfs from './src/core/vfs.js'` (VFS is in filesystem/ not core/)
- Forget to verify import paths when buttons don't work in test pages
- Skip checking browser Network tab for 404s on module imports

✅ **Always:**
- Verify import paths match actual file structure (VFS → filesystem/, not core/)
- Check browser console Network tab when ES6 modules don't load
- Use `window.functionName = function()` for onclick handlers in ES6 modules
- Test man page integration: man command must check `handler.manPage` exists
- Remember module structure: core/ (terminal, parser), filesystem/ (vfs), utils/ (fuzzy), help/ (help-system)

📄 **Detailed logs:** `SESSIONS.md` Sessie 7 (M3 complete: 11 commands + help system + testing)

### Onboarding & Legal Implementation (Sessie 8)
⚠️ **Never:**
- Create legal docs without complete disclosure (contact info, data retention, user rights)
- Use English for legal docs aimed at Dutch market (AVG compliance requires native language)
- Implement analytics without two-tier consent strategy (functional vs tracking)
- Forget localStorage persistence for onboarding state (poor UX on reload)

✅ **Always:**
- Progressive hints at strategic moments (1st, 5th, 10th command) - prevents information overload
- Singleton pattern for UI managers (onboarding, modals) - shared state consistency
- Prioritize launch-blocking tasks first (legal docs before mobile optimization)
- Placeholder approach for incomplete info ([email@domain - TO BE ADDED]) - transparent and trackable
- Privacy by design: Never log command arguments (privacy risk per PRD §6.6)

📄 **Detailed logs:** `SESSIONS.md` Sessie 8 (M4 Phases 1-2: Onboarding + Legal docs, 8100+ words AVG compliant)

### M4 Complete - Analytics & Mobile (Sessie 9)
⚠️ **Never:**
- Log command arguments in analytics (PRD §6.6 privacy violation)
- Show cookie consent banner immediately (annoying - use 2 sec delay)
- Forget IP anonymization in GA4 (AVG compliance required)
- Hard-code analytics IDs in code (use placeholders for MVP)
- Implement mobile gestures without testing on real devices

✅ **Always:**
- Build analytics abstraction layer (GA4 → Plausible migration path)
- Two-tier timing: Legal modal (immediate) → Cookie banner (2 sec delay)
- Privacy-first: Check consent BEFORE tracking, graceful degradation
- Mobile CSS in single file (mobile.css) - all breakpoints + fixes together
- Touch targets 44x44px minimum (Apple HIG + Android Material guidelines)
- Prevent iOS zoom: font-size: 16px on inputs (not 14px!)

📄 **Detailed logs:** `SESSIONS.md` Sessie 9 (M4 complete: Analytics, Mobile, Styling - 91.6% MVP done)

### Scope Decisiveness & MVP Clarity (Sessie 10)
⚠️ **Never:**
- Assume documented features are implemented without codebase verification
- Let PRD requirements diverge from actual implementation status
- Keep ambiguous "deferred" items without explicit Post-MVP classification
- Describe features in PRD without clear MVP vs. Fase 2 distinction

✅ **Always:**
- Verify implementation status via codebase inspection (Glob/Grep/Read)
- Explicitly mark Post-MVP features with ~~strikethrough~~ **[POST-MVP]** in PRD
- Create dedicated "Post-MVP Features" section in TASKS.md for transparency
- Update all documents when scope decisions are made (PRD → TASKS → CLAUDE)
- Be decisive: Feature is either MVP (implement now) or Post-MVP (explicit defer)

📊 **Consistency Protocol:**
1. PRD status must match TASKS.md completion percentage
2. Release Criteria checkboxes must reflect actual implementation
3. Features described in PRD examples must exist in code OR be marked Post-MVP
4. Mobile features (gestures, quick commands) need real device testing before MVP

**Scope Decisions Made:**
- Autocomplete (FR1.4) → Post-MVP (only TODO comment exists)
- Exit intent (FR7.2) → Post-MVP (floating button sufficient for MVP)
- Mobile gestures → Post-MVP (requires real device testing)
- Quick Commands UI → Post-MVP (CSS only, no JS/HTML)
- Continue command → Post-MVP (localStorage auto-restore sufficient)

📄 **Detailed logs:** `SESSIONS.md` Sessie 10 (Consistency audit: PRD v1.2, scope clarification, Post-MVP section)

### Module Integration & Error Debugging (Sessie 11)
⚠️ **Never:**
- Call methods without verifying they exist in target module
- Rely solely on alert() modals for error messages (use DevTools Console)
- Execute DOM manipulation during ES6 module load without ready check
- Call localStorage without try-catch protection (can be disabled)

✅ **Always:**
- Check browser DevTools Console for exact error + stack trace
- Trace initialization flow to avoid duplicate calls (main.js → terminal.init() → onboarding.init())
- Verify method exists in exports before calling (read source code)
- Wrap ALL localStorage operations in try-catch with safe fallback defaults
- Check `document.readyState` before DOM manipulation in module scope

📄 **Detailed logs:** `SESSIONS.md` Sessie 11 (Critical bug fix: non-existent method call, localStorage/DOM error handling)

### Documentation Lifecycle & Launch Prep (Sessie 12)
⚠️ **Never:**
- Let rotation policy go unenforced (compress when >5 sessions in Key Learnings)
- Create implementation checklists without linking to milestone tasks (orphaned files)
- Focus only on process tasks, forgetting configuration tasks (placeholders, IDs)
- Let Quick Reference status info drift from actual project status

✅ **Always:**
- Execute rotation proactively at 7+ sessions (before file bloat, not after)
- Multi-level planning: TASKS.md (milestones) + detailed checklists (implementation)
- Explicit "Configuration" sections for launch-blocking items (GA4 IDs, emails, etc.)
- Cross-document consistency verification at session end (status, percentages, dates)
- Convert compact criteria into actionable checkboxes (clarity over brevity)

📄 **Detailed logs:** `SESSIONS.md` Sessie 12 (Documentation review, rotation strategy, PRE-LAUNCH-CHECKLIST.md, M5 critical tasks)

### GitHub + Netlify Deployment (Sessie 13)
⚠️ **Never:**
- Setup infrastructure (GA4, email) during development - wait until 24-48u before launch
- Assume users know publish directory settings - explain WHY (`.` for vanilla, `dist/` for frameworks)
- Accept Lighthouse scores at face value - check for browser extension warnings
- Count test files in production bundle measurements

✅ **Always:**
- Separate functional testing (now) from infrastructure setup (pre-launch timing)
- Use GitHub CLI for efficiency (`gh repo create --push` = one command)
- Test Lighthouse in Incognito mode (extensions artificially lower scores)
- Prioritize Core Web Vitals (FCP, LCP, CLS) over composite Performance score
- Accept trade-offs: 88/100 Lighthouse Performance acceptable for zero-build architecture

📄 **Detailed logs:** `SESSIONS.md` Sessie 13 (GitHub integration, Netlify deployment, Lighthouse 88/100/100/100, Live: famous-frangollo-b5a758.netlify.app)

### Documentation Debt & Public Repo Readiness (Sessie 14)
⚠️ **Never:**
- Assume README exists = README is current (outdated status damages credibility)
- Use vague browser support ("latest 2 versions") in public docs - specify minimum versions
- Let version history accumulate duplicates without periodic cleanup
- Ignore cross-document date consistency (explicit audit required)

✅ **Always:**
- Public docs require: live demo link, performance metrics, explicit browser support (with rationale)
- Browser minimum versions = architecture decisions (vanilla → ES6 modules → Chrome 61+, Firefox 60+, Safari 11+)
- Explicit "NOT supported" (IE11) prevents user confusion, saves support time
- Enforce CLAUDE.md rotation proactively at 5+ sessions (72% size reduction without info loss)
- Placeholder transparency ([TBD - will be added]) > omission

📄 **Detailed logs:** `SESSIONS.md` Sessie 14 (README modernization, PRD browser matrix, version history cleanup, rotation)

### Visual Redesign & UX Decisions (Sessie 15)
⚠️ **Never:**
- Change brand colors without UX rationale (user attachment to groen terminal!)
- Use <14px font on any interface (accessibility fail - footer was 12px)
- Build full multi-page site when placeholders sufficient (scope creep prevention)
- Add decorative elements without asking for details (colored vs outline window controls)
- Use single color for entire interface (no visual hierarchy)

✅ **Always:**
- Provide expert UX advice: "Mix strategy" (groen terminal + oranje UI) beats complete redesign
- Typography accessibility: 16px minimum body text (+33% footer upgrade critical)
- Scope clarification prevents overbuilding: "Coming Soon" modals vs full Blog/Tutorial pages (saved 5-10 dagen)
- Functional color separation: Oranje = navigation, Groen = terminal content (cognitive load reduction)
- CSS variables for new design system: `--color-ui-primary`, `--shadow-terminal` (scalability)
- Null check event listeners: `if (link && modal) { ... }` (defensive programming)

📄 **Detailed logs:** `SESSIONS.md` Sessie 15 (Terminal window aesthetic, navbar, oranje UI theme, +11KB bundle, footer 12→16px)

### Automated Testing & Quality Audits (Sessie 16)
⚠️ **Never:**
- Assume test failures are code bugs without investigating test expectations first (7/8 failures = outdated assertions)
- Use duplicate IDs in HTML even if one is "dormant" (browser strict mode fails immediately - P0-001 bug)
- Write test assertions without verifying actual implementation (localStorage key: `command_history` vs `hacksim_history`)
- Match selectors globally when duplicates exist (footer + cookie banner → strict mode violation)
- Skip automated testing before manual QA (found P0 bug blocking all manual tests)

✅ **Always:**
- Fix P0 bugs first, then assertion issues (duplicate ID fixed 3/8 tests immediately, then 8/8)
- Scope selectors to parent containers: `footer.locator()` vs `page.locator()` (prevents duplicate matches)
- Test against live production URL, not localhost (catches deployment-specific issues like P0-001)
- Create comprehensive audit reports for stakeholder confidence (M5-AUDIT-REPORT.md: 370 lines, 11 sections)
- Document test coverage explicitly: 8 tests × 2 browsers = 16 validations (Chromium 8/8, Firefox 8/8)
- Use case-insensitive regex for text matching: `/TEXT/i` (handles case changes in refactors)

**Test-First Debugging:** Automated tests found P0 bug 10× faster than manual testing - 8 bugs fixed in one session via systematic test debugging

📄 **Detailed logs:** `SESSIONS.md` Sessie 16 (M5 complete: 16/16 tests passing, 312KB bundle, 6 quality audits ✅, production-ready)

---

## 🤖 Sessie Protocol

### Voor Elke Sessie
- Lees `PLANNING.md`, `TASKS.md`, dit bestand
- Check updates sinds laatste sessie
- **Bij M5 Testing:** Check `PRE-LAUNCH-CHECKLIST.md` voor launch-blocking items

### Tijdens Ontwikkeling
- Markeer taken in TASKS.md **direct** na afronding
- Voeg nieuwe taken toe zodra ontdekt
- Noteer architecturale beslissingen hier

### Voor Afsluiten
- Use `/summary` command → Updates both `SESSIONS.md` (detailed) + `CLAUDE.md` (key learnings)
- Markeer inconsistenties
- Rotate: Bij 5+ sessies in Key Learnings → compress oldest

### Bij Requirement Changes
- Update volgorde: `docs/prd.md` → `PLANNING.md` → `TASKS.md` → `CLAUDE.md`
- Verifieer consistentie tussen alle bestanden
- Vraag bevestiging bij conflicten

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
❌ Frameworks/Tailwind suggeren → Vanilla only
❌ Te realistische output → 80/20 regel
❌ Engelse UI → Nederlands target markt
❌ Feature creep → Focus MVP checklist

---

## 📚 Referenties

**Volledige details:** `docs/prd.md` (v1.4)
**Command specs:** `docs/commands-list.md`
**Sessie logs:** `SESSIONS.md`
**Filesystem structure:** PRD Bijlage B
**Tech rationale:** PRD §13

---

**Last updated:** 22 oktober 2025
**Version:** 5.0 (Sessie 16: M5 Testing Complete - 16/16 tests passing, 6 quality audits ✅, production-ready)
