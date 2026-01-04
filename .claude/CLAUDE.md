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

**DO:** "je" (niet "u"), bemoedigend, context geven
**DON'T:** Neerbuigend, te formeel, aannames
**Symbols:** ASCII brackets only (`[ TIP ]`, `[ ! ]`, `[ ✓ ]`) - terminal aesthetic

---

## 📋 Command Implementation Checklist

Bij nieuwe command: 80/20 output | Educatieve feedback | Help/man (NL) | Warning (offensive) | Mobile (≤40 chars)
→ **Volledige specs:** `docs/commands-list.md`

---

## 🏗️ Architectural Patterns

→ **Live library:** docs/sessions/current.md §Architectural Patterns (indexed by Sessie)

**Quick Reference:**
- **Dark Frame:** navbar/footer dark always (Sessie 44)
- **CSS:** use vars, test themes, cache-bust (Sessies 32, 59, 78)
- **JS:** no duplicate listeners, event delegation, modal protection (Sessies 52, 77)
- **UX:** 3-layer modals, muted UI, semantic detection (Sessies 33, 59, 77)
- **Testing:** manual+automated, fresh sim, CDP cache (Sessies 59, 77)

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

## 🔍 Troubleshooting

**Build groter dan 500KB:** Check imports | Minification aan | Tree-shaking werkend | Ongebruikte code verwijderd
**Playwright passes maar manual fails:** Event handler conflict (zie §8 JS Patterns: duplicate listeners)
**CSS niet live op production:** Normaal bij 1-uur cache - wacht max 60 min OF bump `?v=X` voor directe update (zie Sessie 78)
**Focus/keyboard bugs:** Modal protection missing - check `!e.target.closest('.modal.active')` (zie §8 JS Patterns)
**Light mode colors invisible:** Theme-dependent colors op fixed dark backgrounds (zie §8 CSS Patterns)
**Layout jank on hover:** Missing transparent border reserve (zie Sessie 38: Dropdown Perfectie)

→ **Volledige troubleshooting + solutions:** docs/sessions/current.md §Common Issues

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

**Last updated:** 04 januari 2026 (Sessie 92 - CLAUDE.md Perfection: Phase 1 Critical Fixes)
**Version:** 2.0 (Major refactor: metrics delegation + strict 5-session learnings + concrete examples)
**Next sync:** Every 5 sessions (Sessie 97) OR milestone M6 Tutorial System start

**Version History:**
- v2.0 (Sessie 92): Metrics delegation, learning rotation fix, example expansion
- v1.0 (Sessie 86): Single Source of Truth optimization (587→228 lines)
- v0.x (Sessies 1-85): Original verbose format
