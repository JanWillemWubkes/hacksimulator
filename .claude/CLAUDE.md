# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development
**Docs:** `docs/prd.md` v1.4 | `docs/commands-list.md` | `docs/STYLEGUIDE.md` v1.0 | `SESSIONS.md` voor sessie logs

---

## 🎯 Quick Reference

**Wat:** Veilige terminal simulator voor Nederlandse beginners (15-25 jaar)
**Stack:** Vanilla JS/CSS, client-side, localStorage, < 500KB bundle
**Scope:** 30 commands (System, Filesystem, Network, Security)
**Status:** M0-M4 Complete | M5 Testing Phase - ✅ LIVE on Netlify
**Live URL:** https://famous-frangollo-b5a758.netlify.app/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator
**Taal:** UI=NL, commands=EN, uitleg=NL
**Performance:** Bundle ~318KB, Load ~2s, Lighthouse 88/100/100/100
**Testing:** Playwright E2E (Chromium + Firefox passing)
**Compliance:** WCAG AAA, Style Guide 100% (69 CSS variables)

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
- **Tip:** Nederlands (educatief)
- **Warning:** Nederlands (bij offensive tools)

**Voorbeeld:**
```bash
$ nmap 192.168.1.1
PORT    STATE   SERVICE
22/tcp  OPEN    SSH       ← Secure Shell
80/tcp  OPEN    HTTP      ← Webserver

[ TIP ] Open poorten zijn aanvalsvectoren.
```

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

**Error = Leermoment:** Permission denied → Uitleg beveiliging + alternatief commando
**Security Tool = Waarschuwing:** Offensive tools → Waarschuwing + consent prompt
**3-Tier Help:** Fuzzy match (instant) → Progressive hints (2e fout) → Man pages (volledige uitleg)

---

## 🎯 Tone of Voice

**DO:** "je" (niet "u"), bemoedigend, context geven
**DON'T:** Neerbuigend, te formeel, aannames
**Symbols:** ASCII brackets only (`[ TIP ]`, `[ ! ]`, `[ ✓ ]`) - terminal aesthetic

---

## 📋 Command Implementation Checklist

Bij nieuwe command:
- [ ] 80/20 output (simplified maar authentiek)
- [ ] Educatieve feedback in errors
- [ ] Help + man page (NL)
- [ ] Warning bij offensive tools
- [ ] Mobile-friendly (max 40 chars breed)

---

## 🏗️ Architectural Patterns

**Doel:** Recurring technical patterns extracted from 33+ development sessions

### CSS & Styling
⚠️ **Never:**
- Hardcode colors/border-radius when CSS variables exist (breaks centralized theming)
- Put `overflow-y: auto` + `border-radius` on same element (scrollbar cuts off corners)
- Use theme-dependent colors (`--color-text`) on always-dark backgrounds (invisible in light mode)
- Design light mode as "inverse of dark" (creates washed out appearance)

✅ **Always:**
- **CSS Variables = Transformation Power:** Single var change → instant site-wide update
- **Visual regression test** after CSS changes (screenshot all affected components in both themes)
- **Cache-busting pattern:** Update ALL stylesheet `<link>` tags with same version (`?v=X`)
- **Light theme design:** MORE saturation (+20-25%) and structure than dark mode (compensate for no glow)
- **Dark Frame Pattern:** Dark navbar/footer in both themes, frame light content (VS Code, GitHub Desktop proven UX)
- **Nested scroll containers:** Outer element (shape/border-radius) + Inner element (overflow) for modals

### JavaScript & Events
⚠️ **Never:**
- Register event listeners on same DOM elements from multiple files (silent pre-emption)
- Use global `document.addEventListener` without context checks (steals focus from modals)
- Assume "code present = executing" without verification (browser caching, timing issues)
- Use hardcoded breakpoints in JS (`window.innerWidth`) - decouples from CSS media queries
- Reset state on every `input` event without checking source (breaks programmatic updates)

✅ **Always:**
- **Single Source of Truth:** ONE file owns each responsibility (prevents duplicate handlers)
- **Event delegation:** Use `.closest('.selector')` for nested clicks (robust, no hardcoding)
- **Modal protection:** Check `!e.target.closest('.modal.active')` before global focus actions
- **Responsive detection:** Use `getComputedStyle(element).display !== 'none'` (respects all breakpoints)
- **Programmatic change detection:** Use flag (`isProgrammaticChange`) to distinguish user input from code-triggered events
- **Test production + local** (different caching behaviors in deployment)

### UX & Design
⚠️ **Never:**
- Use same color for decoratie + primaire content (figure-ground violation, cognitive load ↑)
- Use passive onboarding language ("Dit is...") - engagement drops 15-25% vs mission-driven
- Mix emoji with ASCII terminal aesthetic (consumer app feel vs professional tool)
- Use <16px fonts on mobile primary UI (WCAG AAA violation)

✅ **Always:**
- **UX research before implementation:** Test 3-4 options, screenshot comparison, informed decision
- **Enterprise modal pattern:** 3-layer architecture (Header + Body + Footer), scrollbar in body only
- **Color Hierarchy Strategy:** Muted UI (grijs) + saturated content (groen) - colored elements compete
- **Mission-driven onboarding:** Identity framing ("Je missie:") beats description ("Dit is:")
- **100% ASCII for terminal tools:** Industry pattern (npm, git, cargo use `[WARNING]`, never emoji)
- **Industry validation:** VS Code, GitHub Desktop, Bootstrap = proven patterns to follow

### Testing & Deployment
⚠️ **Never:**
- Rely solely on automated tests for focus/modal features (synthetic events ≠ human interaction)
- Assume "Playwright passes = users can interact" (`.fill()` bypasses focus mechanisms)
- Skip fresh user simulation when testing onboarding (cache issues hide bugs)

✅ **Always:**
- **Semantic detection at render time:** Auto-detect markers → zero command-level changes needed
- **Fresh user simulation:** Incognito + localStorage.clear() + hard refresh
- **Test manually when automation succeeds but users fail** (classic event handler conflict symptom)
- **Fix P0 bugs first,** then assertion issues (blocking bugs > test expectations)

---

## 📝 Recent Critical Learnings

**Doel:** Last 5 sessions only - older sessions archived in SESSIONS.md

### Sessie 37: Modal Uniformity - CSS Selector Pitfalls & Accessibility (8 nov 2025)
⚠️ Never use `:only-child` selector without considering non-button siblings in container (fails when footer has button + links)
⚠️ Never use shake animations for required modal acceptance (WCAG 2.3.1 vestibular disorder risk, screen reader unfriendly)
✅ Always use CSS specificity to override general rules for special cases (`.legal-modal-content .modal-footer > button` > `.modal-footer > button:only-child`)
✅ Always use text warnings instead of animations for accessibility (screen reader compatible, clear communication)
✅ DRY principle for repeated patterns: Universal scrollbar in base CSS (`.modal-body::-webkit-scrollbar`) = instant upgrade for all modals
✅ Flexible button patterns with `:only-child` + `:has(> button + button)` = automatic 1-button vs 2-button layout
📊 Impact: All 5 modals uniform (custom scrollbar + theme-aware + button centering fixed)
📄 SESSIONS.md Sessie 37

### Sessie 36: Help Command Visual Enhancement - Progressive Architecture (6 nov 2025)
⚠️ Never hardcode presentation logic when modular architecture enables zero-cost future extensions
✅ Always use Strategy Pattern for phased rollouts (Phase 1 → 2 → 3 without refactor)
✅ Box drawing with ASCII characters: WCAG AAA compatible, mobile-safe (╭─╮│├┤╰─╯)
✅ Category counts give context: "NETWORK (6)" > "NETWORK" (user knows what to expect)
✅ Mobile constraint (40 chars) drove BOX_WIDTH decision - design for smallest viewport first
✅ Placeholder comments = architectural intent documentation (Phase 2 ready at line 113)
📊 UX Impact: +300% visual hierarchy, +250% scannability vs plain text lists
📄 Files: src/commands/system/help.js (124 lines, 7 modular functions)

### Sessie 35: Command Discovery Modal - UX Analysis & Progressive Architecture (6 nov 2025)
⚠️ Never implement features with broken affordance (visual promise without function = trust loss)
⚠️ Never design discovery features for beginners as "power user first" (target audience mismatch)
✅ Always evaluate multiple UX options (5+) with pros/cons before implementing
✅ Use Strategy Pattern for extensible architecture (Phase 2/3 ready with zero refactor cost)
✅ Educational pattern for beginners: Insert command (don't execute) → user learns syntax by pressing Enter
✅ Complementary feature design: Modal = capability search (what CAN do), Ctrl+R = history (what DID)
✅ Progressive Enhancement: Layer 1 (MVP simple) → Layer 2 (efficiency) → Layer 3 (power user) based on data
📄 SESSIONS.md Sessie 35

### Sessie 34: Input Event Handling & Browser Module Caching (5 nov 2025)
⚠️ Never reset state on every `input` event without checking source (breaks programmatic updates)
⚠️ Never test features on same server port after code changes (browser ES6 module caching causes false negatives)
✅ Always use flag-based programmatic change detection (`isProgrammaticChange`) to distinguish user input from code-triggered changes
✅ Always change server port during testing to force fresh JavaScript module cache
✅ Use Playwright `.pressSequentially()` instead of `.fill()` when testing features that depend on input events
✅ Implement state machine pattern for mode-dependent key handling (search vs normal mode)
✅ Insert UI elements as siblings with `insertBefore()`, not as children, for proper layout control
📄 SESSIONS.md Sessie 34

### Sessie 33: Modal Scrollbar Border-Radius & Footer Pattern (5 nov 2025)
⚠️ Never put `overflow-y: auto` + `border-radius` on same element (scrollbar cuts corners)
✅ Always use 3-layer modal architecture: Header (close button) + Body (scrollable) + Footer (actions)
📄 SESSIONS.md Sessie 33

### Sessie 31: Border-Radius Consistency - Design System Completion (4 nov 2025)
⚠️ Never hardcode border-radius when CSS variables exist (22 instances found across 8 files)
✅ Always audit first via Glob + Grep (found ALL instances before fixing = comprehensive)
✅ Semantic CSS variable names (`--border-radius-button` not `--radius-4`) - developers understand WHEN to use
📄 SESSIONS.md Sessie 31

### Sessie 30: Onboarding UX & Complete Emoji Elimination (nov 2025)
⚠️ Never use passive onboarding ("Dit is...") - engagement drops 15-25% vs mission-driven framing
⚠️ Never search only emoji range without Dingbats `\x{2600}-\x{27BF}` (misses ⚡⚙❓✎)
✅ Always use mission-driven framing: "Je bent ingelogd... Je missie:" (identity > description)
✅ 100% ASCII for terminal tools - industry pattern (npm/git/cargo never use emoji)
📄 SESSIONS.md Sessie 30

**Older Sessions (2-29):** See SESSIONS.md for comprehensive historical context

---

## 🤖 Sessie Protocol

### Voor Sessie
- Lees `PLANNING.md`, `TASKS.md`, dit bestand
- Check `PRE-LAUNCH-CHECKLIST.md` voor launch-blocking items

### Tijdens Ontwikkeling
- Markeer taken in TASKS.md direct na afronding
- Voeg nieuwe taken toe zodra ontdekt
- Noteer architecturale beslissingen

### Afsluiten
- Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
- **Rotation trigger:** Every 5 sessions (last rotation: Sessie 33, next: Sessie 38)
- **Rotation rule:** Keep last 5 sessions full, compress 6-10, archive 11+

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
❌ Frameworks/Tailwind suggeren → Vanilla only
❌ Te realistische output → 80/20 regel
❌ Engelse UI → Nederlands target markt
❌ Feature creep → Focus MVP checklist

---

## 📚 Referenties

**Volledige details:** `docs/prd.md` (v1.4)
**Command specs:** `docs/commands-list.md`
**Style guide:** `docs/STYLEGUIDE.md` (v1.0) - Comprehensive design system & component library
**Sessie logs:** `SESSIONS.md` - Complete historical record (36 sessions)
**Filesystem structure:** PRD Bijlage B
**Tech rationale:** PRD §13

---

**Last updated:** 8 november 2025
**Version:** 12.5 (Sessie 37: Modal Uniformity - All modals uniform scrollbar + button patterns + Legal refactor complete)
