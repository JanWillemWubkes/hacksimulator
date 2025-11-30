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
**Compliance:** WCAG AAA, Style Guide 100% (141 CSS variables)
**CI/CD:** GitHub Actions → Netlify auto-deploy (main branch) | Rollback: `git revert` + push
**Monitoring:** Netlify Analytics | Lighthouse CI

---

## 📑 Navigatie

**Core:** §2 Kritieke Niet Doen | §3 Output Principe (80/20) | §4 Taal Strategie | §5 Educational Patterns | §6 Tone of Voice
**Implementatie:** §7 Command Checklist | §8 Architectural Patterns | §9 Recent Learnings (Sessies 52-56)
**Workflow:** §10 Sessie Protocol | §11 Communicatie Grondregels | §12 Troubleshooting | §13 Referenties

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

Bij nieuwe command: 80/20 output | Educatieve feedback | Help/man (NL) | Warning (offensive) | Mobile (≤40 chars)
→ **Volledige specs:** `docs/commands-list.md`

---

## 🏗️ Architectural Patterns

**Doel:** Critical patterns from 57 sessions - full details in SESSIONS.md

### Dark Frame Pattern (Architectural Foundation)
**Definitie:** Navbar en footer blijven ALTIJD donker, ongeacht theme. Content area is theme-adaptive.
**Waarom:** Visuele stabiliteit - neon accenten werken alleen op donkere achtergronden, lichte chrome zou "gaming aesthetic" breken.
**Hover States:** Witte/neutrale shadows, GEEN groene glows op dark frame elementen.
**Voorbeeld:** `--color-text-primary` op navbar ≠ content area (navbar = fixed white, content = theme-dependent)

### CSS & Styling
⚠️ Never hardcode colors/border-radius (use CSS vars) | overflow+border-radius same element | theme colors on fixed backgrounds | light = inverse dark
✅ CSS Variables = instant site-wide updates | Visual regression test both themes | Cache-bust all stylesheets (`?v=X`) | Light theme needs +20% saturation | Nested scroll: outer=shape, inner=overflow

### JavaScript & Events
⚠️ Never duplicate listeners same element | global listeners without context check | assume code executes | hardcoded breakpoints | reset state every input
✅ Single Source of Truth (one file = one responsibility) | Event delegation (`.closest()`) | Modal protection (`!e.target.closest('.modal.active')`) | Responsive detection (`getComputedStyle`) | Programmatic flag (`isProgrammaticChange`) | Test production + local

### UX & Design
⚠️ Never same color for decoration + content | passive language ("Dit is") | emoji in terminal | <16px mobile fonts
✅ UX research first (3-4 options + screenshots) | 3-layer modals (Header/Body/Footer) | Muted UI + saturated content | Mission-driven ("Je missie:") | 100% ASCII brackets | Industry validation (VS Code, GitHub, Bootstrap)

### Testing & Deployment
⚠️ Never rely only on automated tests (synthetic ≠ human) | assume Playwright = user reality | skip fresh user testing
✅ Semantic detection at render | Fresh simulation (incognito + clear + refresh) | Manual test on automation success | Fix P0 bugs before assertions

→ **Volledige patterns met voorbeelden:** SESSIONS.md §Architectural Patterns

---

## 📝 Recent Critical Learnings

**Doel:** Last 5 sessions only - older sessions archived in SESSIONS.md

### Sessie 66: Semantic Continuation - Multi-Line Message Color Inheritance (30 nov 2025)
⚠️ Never assume ES6 module cache works like script tags (module imports don't inherit query params from entry point)
⚠️ Never process multi-line semantics without state tracking (per-line responsibility conflicts with multi-line context)
⚠️ Never use arbitrary thresholds without codebase analysis (6+ spaces validated against 339 instances)
✅ Always clear browser cache via CDP for module testing (Playwright `clearBrowserCache()` is gold)
✅ Always use conservative thresholds for pattern detection (6+ spaces prevents false positives with 2-4 space lists)
✅ Always bridge architecture gaps with minimal state (single variable `lastSemanticType` fixes 339 instances)
📊 Impact: 2 files, site-wide fix (339 instances across 34 files), +215 bytes, <0.1ms overhead
📄 SESSIONS.md Sessie 66

### Sessie 59: Mobile Optimization - P0+P1 Fixes (25 nov 2025)
⚠️ Never use `vh` units on mobile without `dvh` fallback (iOS Safari doesn't recalculate when browser chrome changes)
⚠️ Never pursue mobile-first refactor for inherently desktop-first use cases (terminal apps = desktop primary)
⚠️ Never keep dead CSS in production (half-implemented features waste bundle budget)
✅ Always test modals on smallest target device first (iPhone SE = lowest common denominator)
✅ Always use architectural decision matrix for scope (6-8hr refactor vs 1.5hr targeted fixes = same result)
✅ Always add iOS safe area insets for notch devices (20% of iOS users affected)
✅ Always dismiss mobile keyboard after command (blur + scroll = better UX)
📊 Impact: 4 files, P0 bug fix (legal modal scroll), -2.1KB bundle, iOS support added
📄 SESSIONS.md Sessie 59

### Sessie 58: Hybrid Color Scheme - HTB Neon Prompt + WCAG AA Fix (24 nov 2025)
⚠️ Never promise one aesthetic in docs while delivering another (brand confusion between STYLEGUIDE.md and actual CSS)
⚠️ Never skip contrast ratio verification in light mode (light mode prompt was 2.7:1 - WCAG FAIL)
⚠️ Never use identical colors for different message types (prompt = success prevents clear feedback)
✅ Always create visual mockups for subjective design decisions (7 options → data-driven choice)
✅ Always test WCAG contrast for BOTH themes independently (dark pass ≠ light pass)
✅ Always ensure prompt ≠ success colors for clear command/result distinction
📊 Impact: 3 files, P0 accessibility fix (2.7:1 → 4.8:1), Hybrid scheme (HTB neon + GitHub base)
📄 SESSIONS.md Sessie 58

### Sessie 56: Dropdown Submenu Selector Fix - Direct Child Combinator (22 nov 2025)
⚠️ Never use descendant selectors for nested components (`.dropdown a` targets ALL links including submenus)
⚠️ Never assume CSS specificity wars are the solution (adding more classes = complexity debt)
✅ Always use direct child combinator (`>`) for nested structures (`.dropdown > a` targets only immediate children)
✅ Always test dropdown components with submenus before declaring done
📊 Impact: 1 file, selector precision fix, submenu links no longer inherit parent hover styles
📄 SESSIONS.md Sessie 56

### Sessie 55: Navbar Underline Spacing - Tight to Text (21 nov 2025)
⚠️ Never add excessive spacing between text and underline (12px gap = disconnected visual hierarchy)
⚠️ Never assume underline offset is purely aesthetic (GitHub/VS Code use 2-4px for intentional tight coupling)
✅ Always follow industry patterns for navigation underlines (tight spacing = element belongs together)
✅ Always test underline positioning across all nav items (different text lengths need consistent offset)
📊 Impact: 1 file, underline-offset reduced, GitHub/VS Code pattern compliance
📄 SESSIONS.md Sessie 55

**Older Sessions (54-51):** Theme Toggle Hover (Dark Frame compliance), Navbar Hover (animated underline), Global Link Hover (opacity → color), Dual-theme button color overhaul, Blog CTA UX Overhaul - See SESSIONS.md
**Older Sessions (35-43):** Dropdown jank (font-weight/inline-flex), Modal uniformity (`:only-child` pitfalls), ASCII box drawing, Strategy Pattern - See SESSIONS.md
**Older Sessions (2-34):** See SESSIONS.md for comprehensive historical context

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
- **Rotation trigger:** Every 5 sessions (last rotation: Sessie 66, next: Sessie 71)
- **Rotation rule:** Keep last 5 sessions full, compress 6-10, archive 11+

### Bij Requirement Changes
- Update volgorde: `docs/prd.md` → `PLANNING.md` → `TASKS.md` → `CLAUDE.md`
- Verifieer consistentie tussen alle bestanden

### Document Sync Protocol (Consistency Maintenance)
**Trigger:** Na elke milestone completion OF elke 10 sessies
**Single Source of Truth:** TASKS.md voor alle metrics

**Sync Checklist:**
- [ ] Task counts (totaal, voltooid, percentage)
- [ ] Milestone voortgang (M5, M6, etc.)
- [ ] Bundle size (production measurement)
- [ ] "Last updated" datums (alle docs zelfde datum)
- [ ] Performance metrics (Lighthouse, load time)

**Update volgorde:**
```
TASKS.md → CLAUDE.md → PLANNING.md → PRD.md → STYLEGUIDE.md
```

**Quarterly Full-Sync:** Elke 3 maanden of bij major milestone (M5→M6, MVP→Phase 2)

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

## 🔍 Troubleshooting

**Build groter dan 500KB:** Check imports | Minification aan | Tree-shaking werkend | Ongebruikte code verwijderd
**Playwright passes maar manual fails:** Event handler conflict (zie §8 JS Patterns: duplicate listeners)
**CSS niet live op production:** Cache-busting vergeten - update ALL `<link>` tags met `?v=X` (zie §8 CSS Patterns)
**Focus/keyboard bugs:** Modal protection missing - check `!e.target.closest('.modal.active')` (zie §8 JS Patterns)
**Light mode colors invisible:** Theme-dependent colors op fixed dark backgrounds (zie §8 CSS Patterns)
**Layout jank on hover:** Missing transparent border reserve (zie Sessie 38: Dropdown Perfectie)

→ **Volledige troubleshooting + solutions:** SESSIONS.md §Common Issues

---

## 📚 Referenties

**Volledige details:** `docs/prd.md` (v1.4)
**Command specs:** `docs/commands-list.md`
**Style guide:** `docs/STYLEGUIDE.md` (v1.0) - Comprehensive design system & component library
**Sessie logs:** `SESSIONS.md` - Complete historical record (59 sessions total: Sessies 1-34 archived, Sessies 35-43 compressed, Sessies 44-59 detailed)
**Netlify/Domain setup:** `docs/NETLIFY-SETUP.md` - Complete domain launch guide (18KB)
**Filesystem structure:** PRD Bijlage B
**Tech rationale:** PRD §13

---

**Last updated:** 30 november 2025 (Sessie 66 - Semantic Continuation Fix)
**Last synced:** 22 november 2025 (Full documentation sync complete, all metrics verified)
**Next sync:** Milestone M6 completion OR Sessie 67
**Version:** 15.0 (Sessie 66: Semantic Continuation - Multi-line message color inheritance fix, +215 bytes, 339 instances fixed across 34 files, Recent Learnings rotation)
