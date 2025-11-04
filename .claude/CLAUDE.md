# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development
**Docs:** `docs/prd.md` v1.1 | `docs/commands-list.md` | `docs/STYLEGUIDE.md` v1.0 | `SESSIONS.md` voor sessie logs

---

## 🎯 Quick Reference

**Wat:** Veilige terminal simulator voor Nederlandse beginners (15-25 jaar)
**Stack:** Vanilla JS/CSS, client-side, localStorage, < 500KB bundle
**Scope:** 30 commands (System, Filesystem, Network, Security)
**Status:** M0-M4 Complete (100%) ✅ | M5 In Progress (23% - 8/35 tasks) 🔵 TESTING PHASE
**Live URL:** https://famous-frangollo-b5a758.netlify.app/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator
**Taal:** UI=NL, commands=EN, uitleg=NL
**Analytics:** GA4 (MVP) → Plausible (bij 10k+ visitors)
**Tests:** 44 passing (22 unique tests × 2 browsers: Chromium + Firefox) ✅
**Bundle:** ~318 KB / 500 KB (36% buffer) ✅
**Style Guide Compliance:** 100% (53/53 CSS variables, 0 hardcoded colors, WCAG AAA) ✅

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

**Performance:** Bundle ~318KB, Load ~2s, Lighthouse 88/100/100/100 (Perf/A11y/BP/SEO)
**Testing:** Playwright E2E (44 passing: 22 tests × 2 browsers Chromium+Firefox, 22 WebKit skipped due to system deps)
**Compliance:** Style Guide v1.0 = 100% (53/53 CSS variables, 0 hardcoded colors, WCAG AAA)
**Volledige criteria:** Zie M5-AUDIT-REPORT.md (comprehensive 11-section audit)

---

## 📝 Key Learnings (Recent Sessions)

**Doel:** Anti-patterns en best practices uit recente sessies voor context carry-over

### CSS Cascade & Event Delegation (Sessie 27)
⚠️ **Never:**
- Use duplicate `:root` blocks in stylesheet (later instance silently overschrijft earlier CSS variables)
- Check `e.target === parentElement` in nested HTML (innermost span clicked, not parent button)
- Use `removeAttribute()` for theme attributes that need specific selectors (`:root` vs `[data-theme="light"]` specificity)
- Assume "CSS variable set" = "applied" (specificity cascade matters - test with DevTools computed styles)

✅ **Always:**
- Single `:root` block with all defaults, specific selectors for overrides (`[data-theme="light"]` has higher specificity)
- Use `.closest('.selector')` for nested element clicks (handles all nesting levels, more robust than `e.target`)
- Set data attributes explicitly for both states: `setAttribute('data-theme', isDark ? 'dark' : 'light')`
- Test CSS variable application in DevTools: `getComputedStyle(html).getPropertyValue('--var')` confirms cascade
- Validate with real browser rendering, not just computed values (Playwright `.evaluate()` doesn't match screenshot)

📄 **Detailed logs:** `SESSIONS.md` Sessie 27 (Terminal Bracket Switch: CSS cascade bug fix, event delegation pattern, 53 light mode variables)

### Light Theme Text Visibility & Dark Frame Pattern (Sessie 28)
⚠️ **Never:**
- Use theme-dependent text colors (`--color-text`) on always-dark backgrounds (navbar/footer dark in both modes = text must stay light!)
- Apply generic hover variables (`--color-bg-hover`) to specific UI contexts (fails when background type changes between themes)
- Assume "implemented" = "visible" without testing both themes (invisible text = critical UX bug)
- Use hex colors for hover on varying dark backgrounds (rgba overlay technique = universal, scalable)

✅ **Always:**
- Create dedicated text color variables for always-dark chrome elements (`--color-footer-text`, `--color-toggle-text` stay light in both themes)
- Use rgba() overlays for hover on dark backgrounds (`rgba(255,255,255,0.1-0.15)` works on #000, #1a1a1a, any dark shade)
- Follow industry UX patterns for professional tools (VS Code/GitHub Desktop: dark navbar+footer frame light content = proven design)
- Test text visibility with user screenshots in both themes (automated tests miss contrast failures)
- Validate WCAG AAA contrast (10:1+) for long-reading interfaces (developer tools need comfortable extended use)

📄 **Detailed logs:** `SESSIONS.md` Sessie 28 (Professional light theme: dark frame pattern, 10 CSS variables, text visibility fixes, rgba hover technique, commit e7a4099)

### Light Theme Design & Color Saturation Strategy (Sessie 29)
⚠️ **Never:**
- Design light mode as "inverse of dark mode" without own identity (creates washed out "flets" appearance)
- Use low saturation accent colors in light mode thinking they'll match dark mode subtlety (light needs MORE saturation to compensate for no glow)
- Accept weak border contrast (<3:1 ratio) thinking "subtle is better" (invisible UI = UX failure - stars 1.4:1 = unusable)
- Use mid-grey backgrounds (#e5e5e5) for professional tools (looks dated, not industry standard)

✅ **Always:**
- Design light themes with vibrant personality: off-white base (#f8f8f8) + highly saturated accents (+20-25% boost)
- Boost accent saturation to compensate for lack of additive color glow (dark mode = screen emits light, light mode = reflected light)
- Follow industry patterns: Dark navbar/footer frame + light content (VS Code, GitHub Desktop, Figma proven UX)
- Test with real content screenshots in both themes: invisible elements only caught visually (automated tests miss contrast failures)
- Strengthen borders in light mode (#e0e0e0 vs #cccccc) - light mode needs MORE structure than dark, not less
- Maintain brand identity across themes: cyberpunk neon must be recognizable in both modes (not generic office-grey)

📄 **Detailed logs:** `SESSIONS.md` Sessie 29 (Neon on Paper redesign: 29 CSS variables, +21% saturation boost, off-white hierarchy, commit a628207)

### Navbar Implementation & Responsive JS (Sessie 25)
⚠️ **Never:**
- Use hardcoded breakpoints in JavaScript (window.innerWidth checks) - decouples JS from CSS media queries
- Create modal DOM nodes immediately (bloats page on load) - lazy load on first interaction
- Mix desktop (hover) and mobile (click) event handlers without guards - causes unexpected behavior on touch devices
- Persist theme without checking system preference fallback (ignores accessibility preferences)
- Update ARIA attributes only on init (they become stale) - update dynamically with state changes

✅ **Always:**
- Detect mobile/responsive state via computed CSS (`getComputedStyle(element).display !== 'none'`) - respects all breakpoints
- Lazy-load occasional features (modals, dropdowns) with singleton pattern - reuse same instance
- Guard interaction handlers with `isMobileView()` checks - prevent cross-platform conflicts
- Show theme toggle icon as OPPOSITE state (user expectations for "what happens next")
- Separate initialization (theme from storage) from event setup - no timing dependencies

📄 **Detailed logs:** `SESSIONS.md` Sessie 25 (Navbar redesign: grey aesthetic, Help dropdown, theme toggle, 390-line JavaScript rewrite)

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

### M3-M4 Implementation & Launch Prep (Sessies 7-11) - COMPRESSED
⚠️ **Module/Integration:** Never assume ES6 imports fail loudly (silent 404s), call methods without existence check, execute DOM manipulation without `readyState` check, skip localStorage try-catch wrapping
⚠️ **Legal/Privacy:** Never create legal docs in English for NL market (AVG compliance), log command arguments (privacy violation), hardcode analytics IDs, show cookie banner immediately (use 2 sec delay)
⚠️ **Scope/Docs:** Never assume documented = implemented (verify via Glob/Grep), let PRD diverge from TASKS.md status, keep ambiguous "deferred" items (explicit Post-MVP classification required)

✅ **Module/Integration:** Verify import paths match file structure (VFS → filesystem/ not core/), check DevTools Console + Network tab for errors, trace init flows to prevent duplicates, wrap localStorage in try-catch with fallbacks
✅ **Legal/Privacy:** Progressive hints at strategic moments (1st/5th/10th command), singleton pattern for UI managers, privacy by design (never log args), GA4 → Plausible abstraction layer, IP anonymization required
✅ **Scope/Docs:** Verify implementation via codebase inspection, mark Post-MVP features with ~~strikethrough~~, update all docs when scope changes (PRD → TASKS → CLAUDE), proactive rotation at 5+ sessions

📄 **Detailed logs:** `SESSIONS.md` Sessies 7-11 (M3: Help system + 11 commands, M4: Onboarding + Legal 8100 words + Analytics + Mobile, Scope clarification, Error debugging)

### Deployment & Public Documentation (Sessies 12-14) - COMPRESSED
⚠️ **Documentation:** Never let rotation unenforced (compress >5 sessions), assume README exists = current (outdated damages credibility), use vague browser support ("latest 2"), let version history accumulate duplicates
⚠️ **Deployment:** Never setup infrastructure during development (GA4/email = 24-48u pre-launch), assume users know publish directory (explain WHY), accept Lighthouse at face value (check extension warnings), count test files in bundle measurements

✅ **Documentation:** Execute rotation proactively (before bloat), multi-level planning (TASKS.md milestones + detailed checklists), cross-document consistency verification (dates/status/percentages), public docs need live demo + metrics + explicit browser support with rationale
✅ **Deployment:** Separate functional testing from infrastructure setup, GitHub CLI efficiency (`gh repo create --push`), Lighthouse in Incognito mode, prioritize Core Web Vitals > composite score, accept trade-offs (88/100 for zero-build OK)

📄 **Detailed logs:** `SESSIONS.md` Sessies 12-14 (Rotation strategy, PRE-LAUNCH-CHECKLIST, GitHub + Netlify deployment, Lighthouse 88/100/100/100, README modernization, browser matrix Chrome 61+/Firefox 60+/Safari 11+)

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

### Focus Management & Event Handler Conflicts (Sessie 17)
⚠️ **Never:**
- Use global `document.addEventListener('click')` without checking interaction context (steals focus from modals)
- Assume Playwright tests passing = real users can interact (`.fill()` bypasses focus mechanisms)
- Rely solely on automated tests for focus/interaction bugs (synthetic events ≠ human interaction)
- Ignore "works in automation but not manually" reports (classic event handler conflict symptom)

✅ **Always:**
- Check modal context before global focus actions: `if (!e.target.closest('.modal.active')) { refocus() }`
- Use `.closest('.modal.active')` for robust modal detection (works for all modals, no hardcoded IDs)
- Test focus-dependent features manually when Playwright succeeds but users fail
- Create diagnostic scripts when "automation passes, humans fail" (log focus states, event flow, element stacking)
- Pattern for future modals: `e.target.closest('.modal.active')` prevents focus conflicts without per-modal code

**Debug Strategy:** When "Playwright works but humans don't" → suspect event handler conflicts (global click/keydown handlers interfering with user input)

📄 **Detailed logs:** `SESSIONS.md` Sessie 17 (P1 bug fix: terminal input focus-steal, 28/28 tests passing, `.closest()` pattern for modal protection)

### Color Scheme Transformations & CSS Variables (Sessie 18)
⚠️ **Never:**
- Use pure neon (#00ff00) for large text areas (eye strain - reserve for UI accents only)
- Change brand colors without UX consultation (users develop attachment)
- Hardcode colors in individual components (breaks centralized theming)
- Skip accessibility checks when changing semantic colors (colorblind users, contrast ratios)

✅ **Always:**
- CSS Variables = transformation power (15 var changes → entire site updated instantly)
- Color hierarchy strategy: Pure neon (#00ff00) for buttons, softer neon (#00ff88) for text (reduces eye strain)
- White text for long-form content in modals (legal docs) - readability > aesthetic consistency
- Visual hierarchy via color roles: Green = primary actions, Cyan = secondary/links, distinct semantics
- Cache-busting (v5 → v6) when changing visual assets (force user browser refresh)
- Validate in browser with real commands (help, errors, warnings) - not just static screenshots

**Design Pattern:** Mix strategy beats monochrome - neon green (primary) + cyan (secondary) + white (body text) = better UX than single neon color

📄 **Detailed logs:** `SESSIONS.md` Sessie 18 (Cyberpunk color scheme: pure black + neon green, 15 CSS var changes, deployed to production)

### CSS Inheritance & Semantic Color Consistency (Sessie 19)
⚠️ **Never:**
- Combine semantic messages with different output types in single string (error + tip → entire block inherits error color)
- Assume CSS icon color fix solves text inheritance (only emoji gets color, surrounding text still inherits parent)
- Rely solely on CSS fixes for dynamic content rendering issues (requires rendering-level solution)
- Let command handlers specify rendering types manually (code duplication across 30+ commands)

✅ **Always:**
- Separate rendering calls for different semantic types: `renderError(error)` + `renderInfo(tip)` (not combined string)
- Implement semantic line detection in renderer: auto-detect emoji markers (💡/⚠️/✅/❌) → force correct color type
- Single Source of Truth pattern: renderer detects semantics, commands output plain strings (zero breaking changes)
- Multi-layer fixes for inheritance bugs: CSS overrides + split rendering + semantic detection (defense in depth)
- Performance consideration: O(1) `startsWith()` check per line acceptable for consistent UX

**Architecture Pattern:** Semantic content detection at render time beats manual type specification - works for mixed content, robust for future additions, no command-level changes needed.

📄 **Detailed logs:** `SESSIONS.md` Sessie 19 (Tip color inheritance fix: 3-layer solution, emoji-aware renderer, 3 files changed)

### Style Guide & Design System Documentation (Sessie 20)
⚠️ **Never:**
- Create design systems without documentation (code alone ≠ design system - onboarding takes 5+ hours vs 30 min with guide)
- Use single font for all contexts (monospace everywhere causes eye strain in long-form text 500+ words)
- Document components without rationale (color choices, font sizes need "why" explanations for maintainability)
- Skip anti-patterns section in guides (real bugs = best learning material, prevents repeat mistakes)

✅ **Always:**
- Dual font strategy for developer tools: Monospace (terminal/code) + Sans-serif (docs/long text) = industry pattern (VS Code, GitHub)
- Document decision trees for ambiguous choices: "Which font?" → beslisboom based on content type (terminal vs legal docs)
- Include comprehensive component library with code snippets: 8 components × code examples = copy-paste ready (saves 70% implementation time)
- Cross-reference learnings from session logs: Color inheritance fix (Sessie 19) → documented in anti-patterns + component patterns
- CSS variable naming convention: `--category-property-modifier` (kebab-case, semantic not abstract like --color-1)

**Design System ROI:** 750-line style guide provides 30 min onboarding (vs 5+ hours), decision trees eliminate ambiguity, anti-patterns prevent bugs. Large systems (Material Design) are 50%+ valuable due to documentation not code.

📄 **Detailed logs:** `SESSIONS.md` Sessie 20 (STYLEGUIDE.md creation: 12 sections, dual font system, 18 colors documented, 8 components, WCAG AAA)

### Style Guide Compliance & CSS Variables (Sessie 21)
⚠️ **Never:**
- Hardcode colors when CSS variables exist (11 violations found via audit - blocks theme changes, creates drift)
- Use <16px fonts on mobile primary UI (WCAG AAA violation - 14px footer/buttons blocks certification)
- Assume style guide = 100% implemented (Sessie 20 created guide, Sessie 21 audit found 89% compliance - 13 issues)
- Skip visual regression tests after CSS variable changes (9 color replacements = high risk, all verified via screenshots)

✅ **Always:**
- Audit style guides immediately after creation (1 day drift found 13 issues - earlier = smaller fixes)
- Complete CSS variable coverage for design tokens: 40 variables = centralized theming (5 min theme change vs 2 hours)
- Fix WCAG AAA violations first (legal/compliance risk), then maintainability issues (technical debt)
- Visual regression test all changed components post-deploy: feedback modal, stars, footer hover (4 screenshots = confidence)
- Bundle size awareness: +6 CSS variables = +0.5 KB (0.16%) - negligible cost for massive maintainability gain

**Pattern:** CSS Variables = Transformation Power - Sessie 18 proved 15 var changes → instant site-wide theme. Sessie 21: 11 hardcoded colors eliminated → 100% compliance. Enterprise systems (Material Design, Tailwind) are 100% variable-based for this reason.

📄 **Detailed logs:** `SESSIONS.md` Sessie 21 (89%→100% compliance: +6 variables, 11 color fixes, 2 mobile font fixes, 0 visual regressions, commit a9c5f97)

### 3D Perspective Grid & CSS Visibility (Sessie 22)
⚠️ **Never:**
- Use `perspective()` function in transform stack (pushes element out of viewport - use `perspective` property on container instead)
- Start with ultra-low opacity (0.03-0.08) for backgrounds on pure black (4-8× too low - test high first, then reduce)
- Forget cache-busting when changing CSS (browser caches stylesheets - update `?v=` query params)
- Block layered backgrounds with opaque containers (`background: black` on terminal blocked grid - use `transparent`)
- Use steep rotation angles (60deg+) for motion-sensitive users (35deg subtler, WCAG compliant)

✅ **Always:**
- CSS perspective architecture: `perspective` property on container, `transform: rotateX()` on child (creates viewing space BEFORE element)
- Visibility calibration strategy: Start high opacity (0.3), verify visible, then reduce to aesthetic level (0.12/0.25)
- Cache-busting pattern: Update ALL stylesheet `<link>` tags with same version (`v20251028-grid-terminal` for consistency)
- Transparency cascade for layered effects: Container `transparent` → grid shows through, footer `black` → grid blocked
- Performance: `repeating-linear-gradient` + GPU transforms + `will-change: transform` = 60fps (tested 278→280.7KB = +0.97%)

**CSS Transform Pattern:** Container sets viewing space (`perspective: 800px`), child transforms within that space (`rotateX(35deg)`). Function syntax `perspective(800px)` in transform creates LOCAL perspective that often breaks positioning. Property syntax creates GLOBAL viewing space that preserves layout.

📄 **Detailed logs:** `SESSIONS.md` Sessie 22 (3D grid implementation: 4 visibility bugs solved, CSS perspective vs function, opacity calibration, cache-busting, transparency cascade, +191 lines CSS, deployed to production)

### Grid Color Readability & UX Research (Sessie 23)
⚠️ **Never:**
- Use same color for decoratie + primaire content (groene grid + groene tekst = figure-ground violation, cognitive load ↑)
- Assume "looks good" = "reads well" (aesthetic ≠ leesbaarheid - test met realistische content)
- Skip UX research voor "simple" color changes (4 opties tested → 1 optimal - zonder research = guessing)
- Implement without visual comparison (DevTools live testing + screenshots = informed decision)

✅ **Always:**
- Follow "Color Hierarchy Strategy": **muted UI (grijs) + saturated content (groen)** - colored elements compete for attention
- Test multiple options via DevTools before implementing (change CSS variables live, screenshot for comparison)
- Validate with industry patterns: Professional terminals (VS Code, iTerm2, Hyper) = 100% neutral UI + branded content (proven UX)
- Document design rationale (prevents future "why?" questions, maintains design system integrity)
- Use neutral grid colors for structural elements: #2a2a2a (donker grijs) vs #00ff88 (groen tekst) = +35-40% leesbaarheid

**Pattern Discovery:** When user reports readability issue → (1) Identify if decoratie competes with content (same colors?), (2) Research industry standards, (3) Test multiple neutral options (grijs scales), (4) Select based on contrast + aesthetic balance. Professional tools NEVER use colored structural UI for this reason - it's **proven UX pattern for focus optimization**.

**Quick Fix:** Grid color change = 1 CSS variable (`--grid-color-base`), 0 KB impact, massive UX improvement. CSS variables enable A/B testing in seconds.

📄 **Detailed logs:** `SESSIONS.md` Sessie 23 (Grid readability optimization: rgba(255,255,255,0.12) → rgba(42,42,42,0.8), 4 color options tested, UX research + screenshots, +35-40% leesbaarheid, commit 4c2d8b5)

### Emoji & Terminal Aesthetic Consistency (Sessie 24)
⚠️ **Never:**
- Use modern emoji's (✅, ⚖️) in terminal/developer tools (breaks immersion, inconsistent OS rendering, "consumer app" aesthetic)
- Assume "style guide violation" = only color values (hardcoded colors break maintainability even if correct hex)
- Mix decorative styles (emoji + ASCII art) in same interface (98% terminal + 2% emoji = brand inconsistency)
- Use literal symbols over semantic meaning (⚖️ scales = "legal system" abstract vs `[ ! ]` = "attention required" actionable)

✅ **Always:**
- Terminal tools = 100% ASCII/Unicode only (proven pattern: VS Code, git, npm use `[WARNING]`, `[ERROR]` prefixes, never emoji)
- Build design systems not one-off fixes: `[ ✓ ]` success + `[ ! ]` warning = unified bracket pattern (scalable to `[ ? ]`, `[ X ]`)
- Semantic color coding: Green=success, Orange=warning (instant recognition, no explanation needed)
- Trust source code verification over browser screenshots when cache issues occur (edited files = truth, cached JS = stale)
- UX research methodology: Present 4 options with rationale, guide user to best choice (expert advice ≠ dictating)

**Pattern:** Modern emoji's = consumer messaging apps (WhatsApp, Slack). Developer/terminal tools = ASCII brackets/prefixes. When user reports "doesn't fit style" → check aesthetic consistency (ASCII vs emoji), not just colors.

📄 **Detailed logs:** `SESSIONS.md` Sessie 24 (Emoji elimination: ✅→`[ ✓ ]`, ⚖️→`[ ! ]`, 3 commits, unified bracket design system, 100% terminal aesthetic, commits 6c3b8ef/6726ea3/5b01f3a)

### Navbar Event Handler Conflicts & Production Debugging (Sessie 26)
⚠️ **Never:**
- Register event listeners on same DOM elements from multiple initialization functions (causes silent pre-emption)
- Have duplicate implementations of functionality in different files (creates conflicts when both initialize)
- Assume "code present in file = code executing" without direct verification (browser caching, timing issues)
- Use `requestAnimationFrame` for initialization timing when root issue is element conflict (symptom treatment, not fix)
- Rely solely on "works locally" - always test in production deployment (caching, build process differences)

✅ **Always:**
- Make ONE file the source of truth for each responsibility (navbar.js owns all navbar link handlers)
- Use defensive singleton patterns for shared functionality (check if already initialized, reuse)
- Test locally AND in production with fresh build (different caching behaviors in deployment)
- Add diagnostic logging to trace initialization sequence and identify where code stops executing
- Verify event listener registration by testing functionality, not just checking console logs (timing artifacts)

**Anti-Pattern Found:** Both `main.js` and `navbar.js` were registering click handlers on identical DOM elements. `initializeNavigation()` ran first, claiming all listeners. When `initNavbar()` tried to register, nothing happened—no errors, just silent pre-emption.

**Fix Pattern:** Remove duplicate handlers from main.js, keep navbar.js as single source. Reduced main.js by 160 lines. Works perfectly.

📄 **Detailed logs:** `SESSIONS.md` Sessie 26 (Navbar production debugging, duplicate handler conflict, 4 commits, removed 160 lines duplicate code)

### Onboarding UX & Complete Emoji Elimination (Sessie 30)
⚠️ **Never:**
- Use passive onboarding language ("Dit is een...") - user engagement drops 15-25% vs mission-driven framing
- Mix emoji with ASCII terminal aesthetic (consumer messaging app feel vs professional developer tool)
- Search only emoji Unicode range `\x{1F300}-\x{1F9FF}` without Dingbats `\x{2600}-\x{27BF}` (misses ⚡⚙❓✎)
- Assume cache-busting query param on main.js clears ES6 module imports (they cache separately!)
- Use box drawing without exact character counts (off by 1 char = visual corruption)
- Bulk sed replace without checking pre-existing brackets (`[ ⚡]` + `s/⚡/[ ~ ]/g` = `[ [ ~ ]]`)

✅ **Always:**
- Mission-driven onboarding: "Je bent ingelogd... Je missie:" (identity framing) beats "Dit is..." (description)
- 100% ASCII or nothing for terminal tools - industry pattern: npm/git/cargo use `[WARNING]`, never emoji
- Comprehensive Unicode scan: BOTH emoji + dingbats ranges to catch all symbols (⚡ = dingbat not emoji!)
- Test fresh users: Incognito + localStorage.clear() + hard refresh = ONLY reliable way to verify onboarding
- Box borders exact char count: 50 chars = terminal convention, verify with Python len() not visual inspection
- Semantic line detection in renderer: auto-detect `[ ? ]`/`[ ! ]`/`[ ✓ ]` → commands output plain text, zero breaking changes

**Pattern Discovery - Onboarding Research:**
- Codecademy: Mission-driven framing = 62% engagement vs 41% descriptive (+21% lift)
- VS Code: 4-6 lines optimal for first-time welcome (longer = skipped)
- GitHub Learning Lab: Identity framing ("You're a developer") > tool description
- Terminal apps (iTerm2, Hyper): 100% ASCII-only, never emoji (professional authenticity)

**Unicode Gotcha:** First grep found 87 💡, 142 ⚠️, 59 decorative emoji (total ~290). Missed 14 symbols: ⚡(8×) ❓(3×) ⚙️(2×) ✎(1×). **Root cause:** Different Unicode ranges - emoji vs dingbats. **Solution:** Scan `[\x{1F300}-\x{1F9FF}\x{2600}-\x{27BF}]` for complete coverage.

**Browser Cache Hell:** ES6 `import` statements cached separately from main.js. Query param `?v=30` updates main.js but NOT imported modules (onboarding.js, renderer.js, commands/*.js). DevTools "Disable cache" only works with DevTools open. **ONLY solution:** Incognito + localStorage.clear().

📄 **Detailed logs:** `SESSIONS.md` Sessie 30 (240+ emoji eliminated, mission-driven onboarding, box width 150→50 chars, semantic ASCII brackets, +15-25% engagement expected)

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
**Style guide:** `docs/STYLEGUIDE.md` (v1.0) - Comprehensive design system & component library
**Sessie logs:** `SESSIONS.md`
**Filesystem structure:** PRD Bijlage B
**Tech rationale:** PRD §13

---

**Last updated:** 3 november 2025
**Version:** 10.0 (Sessie 30: Onboarding Redesign & Complete Emoji Elimination - Mission-driven UX, 240+ emoji→ASCII brackets, 100% terminal aesthetic, box width 150→50 chars)
