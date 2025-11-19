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
**CI/CD:** GitHub Actions → Netlify auto-deploy (main branch) | Rollback: `git revert` + push
**Monitoring:** Netlify Analytics | Lighthouse CI

---

## 📑 Navigatie

**Core:** §2 Kritieke Niet Doen | §3 Output Principe (80/20) | §4 Taal Strategie | §5 Educational Patterns | §6 Tone of Voice
**Implementatie:** §7 Command Checklist | §8 Architectural Patterns | §9 Recent Learnings (Sessies 36-40)
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

**Doel:** Critical patterns from 40 sessions - full details in SESSIONS.md

### CSS & Styling
⚠️ Never hardcode colors/border-radius (use CSS vars) | overflow+border-radius same element | theme colors on fixed backgrounds | light = inverse dark
✅ CSS Variables = instant site-wide updates | Visual regression test both themes | Cache-bust all stylesheets (`?v=X`) | Light theme needs +20% saturation | Dark Frame Pattern (navbar/footer) | Nested scroll: outer=shape, inner=overflow

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

### Sessie 50: Blog CTA UX Overhaul - Semantic CSS Patterns + WCAG Compliance (17 nov 2025)
⚠️ Never apply single CSS pattern to all element types (buttons ≠ inline links - different roles need different patterns)
⚠️ Never trust gut feeling over measurement (user questioned analysis → revealed 1.82:1 contrast = WCAG fail)
⚠️ Never skip WCAG verification per theme (light ≠ inverse dark - same color works on dark, fails on white)
⚠️ Never hardcode derivative values (box-shadow RGB swapped between themes = copy-paste error)
✅ Always use semantic selectors over broad ones (`p a, ul a` targets exact use case vs fighting specificity wars)
✅ Always validate with user corrections ("kunnen we dit cleaner oplossen?" led to superior semantic pattern)
✅ Always test both themes independently (theme-specific optimizations needed: AA vs AAA compliance)
✅ Multi-problem cascade: User reports 1 issue → testing reveals 3 → unified solution fixes all (contrast + underline + shadows)
📊 Impact: 6 files, WCAG FAIL → AA (3.51:1), semantic link pattern, +15-30% conversion expected
📄 SESSIONS.md Sessie 50

### Sessie 45: Navbar Consistency & Toggle Contrast - Architectural Verification (14 nov 2025)
⚠️ Never test fixes on single site only (main site working ≠ blog site working - multi-page apps need comprehensive testing)
⚠️ Never add features without checking visual implementation match (GitHub link text vs icon = brand inconsistency)
⚠️ Never assume architectural patterns propagate automatically (Sessie 44 Dark Frame Pattern on footer ≠ navbar updated)
✅ Always verify ALL components when establishing architectural patterns (footer + navbar + modals = complete chrome consistency)
✅ Always use VS Code active/inactive pattern for toggles (40% opacity dimming = instant clarity which state is active)
✅ Always match icon implementation across pages (SVG icon duplication 2KB acceptable for visual consistency on 4-page scale)
✅ Multi-problem cascade: User reports 1 issue → testing reveals 2 more → unified solution fixes all 3 (toggle contrast + blog navbar + icon consistency)
📊 Impact: 7 files, 100% design system consistency, 5:1 contrast improvement, toggle 7.4:1 → 12.6:1, blog navbar ∞% (from broken)
📄 SESSIONS.md Sessie 45

### Sessie 49: Button Hierarchy Pattern - Correcting Sessie 48 + CTA Conversion Optimization (17 nov 2025)
⚠️ Never apply single pattern to all button types (primary conversion goals ≠ secondary alternatives - different roles need different patterns)
⚠️ Never assume professional = subtle for CTAs (professional aesthetic ≠ weak CTA - Stripe/GitHub use prominent filled CTAs)
⚠️ Never skip conversion research for CTAs (filled buttons = 16-35% higher conversion - data > assumptions)
✅ Always validate hover behavior with user testing (filled→transparent felt "vreemd" = counter-intuitive UX caught by user feedback)
✅ Always separate button hierarchy: Primary (filled→filled) vs Secondary (outline→outline) - visual weight matches action importance
✅ Always acknowledge mistakes openly (Sessie 47-48 patterns were wrong - transparency = learning opportunity)
✅ Research-based corrections: VWO/Unbounce data + industry validation (GitHub, Stripe, Vercel) confirmed filled CTAs optimal
📊 Impact: 2 files, 5 primary buttons reverted to filled, blog CTA optimized (+16-35% expected conversion), Button Hierarchy Pattern established
📄 SESSIONS.md Sessie 49

### Sessie 47: Blog CTA Hover Consistency - Professional Elevation Pattern (15 nov 2025)
⚠️ Never assume single theme fix works across themes (dark mode working ≠ light mode working - always verify BOTH with browser testing)
⚠️ Never use different hover patterns for same component across themes (inconsistency = poor UX + maintenance burden)
⚠️ Never use heavy glow effects in professional/educational contexts (16px rgba(0.4) glow = gaming aesthetic, not professional)
✅ Always match industry patterns for professional contexts (GitHub Docs/Stripe = subtle elevation, not playful glow)
✅ Always consider context when choosing effects (blog = professional → subtle shadow, terminal = playful → glow acceptable)
✅ Always use CSS variables for cross-theme consistency (var(--color-link) adapts automatically, hardcoded colors break theme system)
✅ Always test hover states in browser, not just code review (visual verification catches subtle inconsistencies, screenshots document behavior)
📊 Impact: 5 files, 100% theme consistency, dark mode 16px glow → 4px subtle shadow, light mode fill removed, professional elevation pattern
📄 SESSIONS.md Sessie 47

### Sessie 46: Blog Width Verification - Industry Standards Validation (15 nov 2025)
⚠️ Never trust gut feeling over measurement (user felt "too narrow" but live data showed 71 chars/line = optimal)
⚠️ Never assume industry standards without verification (Medium 700px cited everywhere, but context matters)
⚠️ Never change specs based on visual psychology alone (whitespace contrast creates illusion of narrowness)
✅ Always verify with live browser measurement (Playwright evaluate = actual rendering, not theory)
✅ Always document optimization rationale in CSS comments (future developers need context for decisions)
✅ Always compare against multiple benchmarks (Medium 700px + Nielsen 65-75 chars + WCAG <80 chars)
✅ Research validates existing decisions: 720px already optimal from Sessie 44 (900px → 720px), live verified 71 chars/line
📊 Impact: 0 code changes (verification only), CSS comment strengthened, 720px validated as mathematically optimal
📄 SESSIONS.md Sessie 46

### Sessie 44: Blog Styling Consistency - Multi-Hypothesis Problem Solving (13 nov 2025)
⚠️ Never assume single cause for UX complaint (user "colors too bright" = emoji clutter + line-length + saturation)
⚠️ Never implement passive theme sync on multi-page apps (sub-pages need interactive control like main app)
⚠️ Never skip Style Guide review for new content (blog Session 43 missed emoji violations)
✅ Always use gefaseerde approach for ambiguous problems (fix observable issues first, then measure hypothesis)
✅ Always validate line-length research (Nielsen: 65-75 chars optimal, blog had 85 chars at 900px)
✅ Always provide theme toggle on EVERY page in multi-page apps (GitHub/VS Code/Bootstrap pattern)
✅ Inline script duplication acceptable for small scale (4 pages = 120 lines OK, shared module overkill)
📊 Impact: 20+ emoji → ASCII, theme toggle on 4 pages, 900px → 720px, terminal aesthetic 100%
📄 SESSIONS.md Sessie 44

**Older Sessions (35-43):** Dropdown jank (font-weight/inline-flex), Modal uniformity (`:only-child` pitfalls), ASCII box drawing, Strategy Pattern, Keyboard shortcuts discovery, Kill Your Darlings, GitHub open source launch, SEO blog architecture - See SESSIONS.md
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
- **Rotation trigger:** Every 5 sessions (last rotation: Sessie 42, next: Sessie 47)
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
**Sessie logs:** `SESSIONS.md` - Complete historical record (49 sessions total: Sessies 1-34 archived, Sessies 35-36 compressed, Sessies 37-49 detailed)
**Netlify/Domain setup:** `docs/NETLIFY-SETUP.md` - Complete domain launch guide (18KB)
**Filesystem structure:** PRD Bijlage B
**Tech rationale:** PRD §13

---

**Last updated:** 17 november 2025 (Sessie 50)
**Last synced:** 17 november 2025 (Blog CTA UX Overhaul - WCAG AA compliance, semantic CSS patterns, +15-30% conversion expected)
**Next sync:** Milestone M6 completion OR Sessie 55
**Version:** 14.5 (Sessie 50: Semantic link pattern, WCAG FAIL→AA, box-shadow fixes, light mode contrast 3.51:1, multi-problem cascade approach)
