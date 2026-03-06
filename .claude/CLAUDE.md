# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 10 posts live at `/blog/` (60+ inline jargon explanations)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E 145 tests across 27 suites (17 files, 3 browsers) | WCAG AAA | 165 CSS variables
**Bundle:** ~983 KB productieve code → ~809 KB na Netlify minificatie | Terminal Core: ~340 KB (binnen 400 KB budget)

→ **Live metrics:** `TASKS.md` regels 9-26 (meest recente tellingen)
→ **Architecture:** `PLANNING.md` v2.4 | **Commands:** `docs/commands-list.md` (38 commands)

---

## Kritieke "Niet Doen"

→ **Framework & Tech Red Lines:** PRD §13 (Vanilla JS/CSS, <500KB bundle, no backend MVP, Dutch UI, 80/20 output, no arg logging)

---

## Command Output Principe: "80/20 Realisme"

→ **Formule:** Output (EN) + Inline context (← NL) + Tip (NL) + Warning (NL)
→ **Voorbeeld & Philosophy:** PRD §9.2

**Quick:** `nmap 192.168.1.1` → `22/tcp OPEN SSH ← Secure Shell` + `[TIP] Open poorten = attack vectors`

---

## Taal Strategie

→ **Matrix:** UI=NL | Commands=EN | Errors=EN+NL | Help=NL
→ **Rationale:** PRD §6.6 (trust, authenticity, accessibility)

---

## Educational Patterns

→ **3-Tier:** Error=Learning → Progressive hints → Man pages | Security tools=Consent+Warning
→ **Full pedagogy:** PRD §8.3

---

## Tone of Voice

**Principles:**
- **"je" (niet "u"):** Toegankelijk, persoonlijk (niet afstandelijk formeel)
- **Bemoedigend:** "Goed bezig!", "Bijna!", niet "Fout." of "Wrong."
- **Context geven:** Leg "waarom" uit, niet alleen "wat"
- **Symbols:** ASCII brackets only (`[TIP]`, `[!]`, `[✓]`) — terminal aesthetic, NO emojis in code

→ **Voorbeelden (good/bad pairs):** `.claude/rules/tone-and-output.md`

---

## Command Implementation Checklist

Bij nieuwe command: 80/20 output | Educatieve feedback | Help/man (NL) | Warning (offensive) | Mobile (≤40 chars)

→ **Volledige 8-stappen checklist:** `.claude/rules/command-checklist.md`
→ **Command specs:** `docs/commands-list.md`

---

## Architectural Patterns

→ **Top patterns met code:** `.claude/rules/architecture-patterns.md`
→ **All 40+ patterns indexed:** docs/sessions/current.md

---

## Recent Critical Learnings

### Sessie 110: M9 Refactor — VFS Persistence & localStorage Optimization (6 maart 2026)
⚠️ **Never:**
- Orphan modules laten liggen — `persistence.js` bestond maar werd nergens geïmporteerd, VFS persisteerde niet
- Meerdere localStorage keys voor één concern — onboarding had 4 losse keys, 3-4 writes per command
- Debounce zonder `beforeunload` flush — data gaat verloren als gebruiker tab sluit tijdens debounce window

✅ **Always:**
- Observer pattern voor persistence: VFS roept `_notifyChange()` aan, persistence luistert met debounce — loose coupling
- Legacy migration bij key consolidatie: lees oude keys → migreer → verwijder — bestaande users verliezen geen data
- `beforeunload` event handler voor elke debounced save — vangt edge case van snelle tab-close

### Sessie 109: Unified Link Hover System (4 maart 2026)
⚠️ **Never:**
- Opt-out CSS selectors (`:not()` chains) voor animaties — fragiel, elke nieuwe context vereist uitbreiding
- `opacity` als hover indicator — verlaagt contrast, lijkt op disabled state, slechte accessibility
- Eén hover kleur voor alle contexten — blauw past bij blog content, maar breekt brand coherentie op landing pages

✅ **Always:**
- Opt-in selectors voor `::after` animated underlines — alleen targeted links krijgen het effect
- `currentColor` voor `::after` underline background — volgt automatisch de link kleur
- Kleurstrategie per context: blauw = content (blogs), groen = brand (landing, CTA, FAQ, cards)

### Sessie 108: Uniforme Marketing Footer (2 maart 2026)
⚠️ **Never:**
- Component CSS in page-specifieke stylesheet als component op alle pagina's verschijnt — terminal.html laadt landing.css niet
- CSS variables uit andere stylesheets gebruiken zonder fallback — `var(--landing-max-width)` bestaat niet in main.css scope
- Meerdere footer template functies per variant — één functie met options object is flexibeler en minder onderhoud

✅ **Always:**
- Universele component CSS in universeel geladen stylesheet (`main.css`) — voorkomt layout breaks op pagina's die page-specifieke CSS niet laden
- CSS variable fallbacks bij cross-stylesheet gebruik: `var(--layout-padding-x, 32px)`
- Conditionele rendering via options object (`showFeedback`, `showDonate`) — één template, meerdere configuraties

### Sessie 106: M7 Gamification — Full Stack (28 feb 2026)
⚠️ **Never:**
- Gamification hooks op één plek — badge checks moeten in terminal.js (na command) EN in challenge flow (na completion)
- Meerdere localStorage keys voor gerelateerde state — consolideer naar één key (`hacksim_gamification`) voor atomair lezen/schrijven

✅ **Always:**
- Cross-cutting concerns (badge unlock) op meerdere hooks: terminal command execution + challenge completion
- Certificate download via Blob API + clipboard fallback (mobile compatibiliteit)

### Sessie 104: M6 Tutorial Afronding & E2E Tests (22 feb 2026)
⚠️ **Never:**
- `acceptLegalModal` hardcoded als verplicht — legal modal is soms al dismissed (parallel workers, cached localStorage)
- Playwright `html` reporter zonder `open: 'never'` — hangt oneindig in non-interactieve shells

✅ **Always:**
- Graceful modal helpers met try/catch fallback — voorkomt false failures bij race conditions

**Rotation:** Keep last 5 full. Archive: docs/sessions/ (current.md, recent.md, archive-*.md)

---

## Sessie Protocol

**Voor Sessie:** Lees `PLANNING.md`, `TASKS.md`, dit bestand
**Tijdens:** Markeer taken in TASKS.md direct | Noteer architecturale beslissingen
**Afsluiten:** Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
**Rotation trigger:** Every 5 sessions (last: Sessie 108, next: Sessie 113)
**Sessie counter:** 110
**Bij Requirement Changes:** `docs/prd.md` → `PLANNING.md` → `TASKS.md` → `CLAUDE.md`

→ **Document Sync Protocol:** PLANNING.md §Document Sync

---

## Communicatie Grondregels

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
5. Performance: Terminal Core <400KB, site totaal <1000KB

→ **Tech constraints:** PRD §13 | **Pattern violations:** docs/sessions/current.md

---

## Troubleshooting

→ **Top 9 issues met diagnose + fixes:** `.claude/rules/troubleshooting.md`
→ **Memory leak debugging:** docs/testing/memory-leak-results.md

---

## Referenties

- **PRD:** `docs/prd.md` v1.8
- **Commands:** `docs/commands-list.md` (38 commands)
- **Style Guide:** `docs/style-guide.md` v1.5
- **Sessie logs:** `SESSIONS.md` → docs/sessions/ (~109 sessies)
- **Netlify/Domain:** `docs/netlify-setup.md`
- **Rules:** `.claude/rules/` (tone-and-output, architecture-patterns, troubleshooting, command-checklist)
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 6 maart 2026 (Sessie 110 — M9 Refactor Sprint)
**Version:** 4.0 (Sessie 110: VFS persistence fix, localStorage optimization, doc sync)
