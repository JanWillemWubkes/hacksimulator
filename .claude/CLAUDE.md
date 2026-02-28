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

### Sessie 106: M7 Gamification — Full Stack (28 feb 2026)
⚠️ **Never:**
- Gamification hooks op één plek — badge checks moeten in terminal.js (na command) EN in challenge flow (na completion)
- Meerdere localStorage keys voor gerelateerde state — consolideer naar één key (`hacksim_gamification`) voor atomair lezen/schrijven
- TASKS.md sync vergeten na implementatie — commit `2b0ebfe` miste Phase 6 leaderboard status

✅ **Always:**
- Cross-cutting concerns (badge unlock) op meerdere hooks: terminal command execution + challenge completion
- Simulated leaderboard data voor motivatie zonder backend — realistische usernames + scores
- Certificate download via Blob API + clipboard fallback (mobile compatibiliteit)
- Dashboard met subcommands (stats, badges, challenges) — vermijd monolithische output

### Sessie 104: M6 Tutorial Afronding & E2E Tests (22 feb 2026)
⚠️ **Never:**
- Exported functions zonder caller — grep `export` + grep functienaam om orphans te detecteren
- `acceptLegalModal` hardcoded als verplicht — legal modal is soms al dismissed (parallel workers, cached localStorage)
- Playwright `html` reporter zonder `open: 'never'` — hangt oneindig in non-interactieve shells (Claude Code, CI)

✅ **Always:**
- Graceful modal helpers met try/catch fallback — voorkomt false failures bij race conditions
- `['html', { open: 'never' }]` in Playwright reporter config — bekijk achteraf via `npx playwright show-report`

### Sessie 103: M6 Tutorial System (20 feb 2026)
⚠️ **Never:**
- State machine zonder expliciete state enum — gebruik altijd een `STATES` object
- Command validatie blokkeren — altijd eerst laten uitvoeren, dan checken

✅ **Always:**
- Non-blocking tutorial overlay — UX blijft responsief, commands werken altijd
- Progressive hints (3 tiers: 2/4/6 pogingen) — beginners zelf laten proberen
- Losgekoppelde scenarios via registry pattern — makkelijk uitbreidbaar

### Sessie 102: MVP Polish & Production Hardening (20 feb 2026)
⚠️ **Never:**
- `console.log` in productie — altijd opruimen voor deploy
- `media="print" onload` pattern voor CSS — fragiel, gebruik directe load

✅ **Always:**
- Output buffer cap (MAX_OUTPUT_LINES) — voorkom unbounded DOM growth
- Centraliseer analytics init — één bestand, niet per pagina

**Rotation:** Keep last 4 full. Archive: docs/sessions/ (current.md, recent.md, archive-*.md)

---

## Sessie Protocol

**Voor Sessie:** Lees `PLANNING.md`, `TASKS.md`, dit bestand
**Tijdens:** Markeer taken in TASKS.md direct | Noteer architecturale beslissingen
**Afsluiten:** Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
**Rotation trigger:** Every 5 sessions (last: Sessie 103, next: Sessie 108)
**Sessie counter:** 107
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
- **Sessie logs:** `SESSIONS.md` → docs/sessions/ (~106 sessies)
- **Netlify/Domain:** `docs/netlify-setup.md`
- **Rules:** `.claude/rules/` (tone-and-output, architecture-patterns, troubleshooting, command-checklist)
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 28 februari 2026 (Sessie 106 — M7 Gamification: Challenges, Badges, Certificates, Dashboard, Leaderboard)
**Version:** 3.7 (Sessie 107: Document sync — 38 commands, 145 tests, metrics aligned)
