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

**Performance:** Playwright E2E 172 tests across 30 suites (20 files, 3 browsers) | WCAG AAA | 165 CSS variables
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

### Sessie 113: Refactor tutorial.spec.js — Flaky Test Elimination (7 maart 2026)
⚠️ **Never:**
- `textContent()` snapshots voor test assertions — één momentopname, geen retry, flaky bij async rendering
- Sequentiële commands sturen zonder gate assertion — `typeCommand()` 500ms wait is niet genoeg voor tutorial state machine onder load

✅ **Always:**
- `toContainText()` locator assertions met expliciete timeouts — auto-retry pollt DOM tot tekst verschijnt
- Gate waits na tutorial start: `await expect(output).toContainText('MISSION BRIEFING', { timeout: 10000 })` vóór volgende command
- `expect.poll()` voor debounced localStorage checks — fixed waits zijn onbetrouwbaar bij variabele debounce windows

### Sessie 112: M6 Tutorial Mobile & Cross-Browser Testing (7 maart 2026)
⚠️ **Never:**
- `textContent()` snapshot voor assertions — als render niet klaar is, krijg je welcome banner i.p.v. command output
- Desktop test patterns kopiëren naar mobile zonder timing aanpassing — mobile viewports triggeren layout recalculations, gebruik 800ms i.p.v. 500ms

✅ **Always:**
- `toContainText()` locator assertions (auto-retry) i.p.v. `textContent()` + `toContain()` — Playwright retry voorkomt flaky tests
- `test.use({ viewport: { width: 375, height: 667 } })` declaratief op file-niveau — cleaner dan `setViewportSize()` in beforeEach
- Try/catch op legal modal in mobile tests — modal state hangt af van localStorage die per-test varieert

### Sessie 111: M7 Phase 7 — Gamification E2E Testing (7 maart 2026)
⚠️ **Never:**
- Assert op command namen in challenge briefings — briefings tonen requirement *descriptions* (NL), niet command names
- `progressStore.recordCommand()` verwachten buiten challenges — wordt ALLEEN aangeroepen tijdens actieve challenges via `challengeManager.handleCommand()`
- `page.evaluate()` voor localStorage injectie vóór `page.reload()` — `beforeunload` handler flusht lege `_cache`, overschrijft injected data

✅ **Always:**
- `page.addInitScript()` voor test data injectie — zet localStorage VÓÓR module-initialisatie, voorkomt beforeunload race condition
- Badge tests binnen challenge context — start eerst een challenge, dan commands uitvoeren voor badge triggers
- Locked badges tonen als `???` — assert op icons (`[#]`, `[*]`) en `???`, niet op badge namen

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

**Rotation:** Keep last 5 full. Archive: docs/sessions/ (current.md, recent.md, archive-*.md)

---

## Sessie Protocol

**Voor Sessie:** Lees `PLANNING.md`, `TASKS.md`, dit bestand
**Tijdens:** Markeer taken in TASKS.md direct | Noteer architecturale beslissingen
**Afsluiten:** Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
**Rotation trigger:** Every 5 sessions (last: Sessie 113, next: Sessie 118)
**Sessie counter:** 113
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

**Last updated:** 7 maart 2026 (Sessie 113 — Refactor tutorial.spec.js flaky test elimination)
**Version:** 4.3 (Sessie 113: tutorial.spec.js refactor, textContent→toContainText, 0 hard failures cross-browser)
