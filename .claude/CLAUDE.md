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

**Performance:** Playwright E2E 131 tests across 15 suites | WCAG AAA | 165 CSS variables
**Bundle:** ~983 KB productieve code → ~809 KB na Netlify minificatie | Terminal Core: ~340 KB (binnen 400 KB budget)

→ **Live metrics:** `TASKS.md` regels 9-26 (meest recente tellingen)
→ **Architecture:** `PLANNING.md` v2.3 | **Commands:** `docs/commands-list.md` (32 commands)

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

### Sessie 104: M6 Tutorial Afronding & E2E Tests (22 feb 2026)
⚠️ **Never:**
- Exported functions zonder caller — grep `export` + grep functienaam om orphans te detecteren
- `acceptLegalModal` hardcoded als verplicht — legal modal is soms al dismissed (parallel workers, cached localStorage)
- E2E assertions op features die nog niet gedeployed zijn — tests draaien tegen live URL
- Playwright `html` reporter zonder `open: 'never'` — hangt oneindig in non-interactieve shells (Claude Code, CI)

✅ **Always:**
- Graceful modal helpers met try/catch fallback — voorkomt false failures bij race conditions
- Test assertions matchen met wat live staat, niet met lokale code
- `tutorial cert` als subcommando voor clipboard — fire-and-forget pattern (async API + sync fallback)
- `['html', { open: 'never' }]` in Playwright reporter config — bekijk achteraf via `npx playwright show-report`

### Sessie 103: M6 Tutorial System (20 feb 2026)
⚠️ **Never:**
- State machine zonder expliciete state enum — gebruik altijd een `STATES` object
- Command validatie blokkeren — altijd eerst laten uitvoeren, dan checken
- Strikte arg validatie in tutorials — beginners typen niet altijd perfecte args

✅ **Always:**
- Non-blocking tutorial overlay — UX blijft responsief, commands werken altijd
- Progressive hints (3 tiers: 2/4/6 pogingen) — beginners zelf laten proberen
- localStorage persistence voor tutorial voortgang
- Losgekoppelde scenarios via registry pattern — makkelijk uitbreidbaar

### Sessie 102: MVP Polish & Production Hardening (20 feb 2026)
⚠️ **Never:**
- `console.log` in productie — altijd opruimen voor deploy
- Hardcoded color values in Playwright tests — theme-aware assertions gebruiken
- `media="print" onload` pattern voor CSS — fragiel, gebruik directe load

✅ **Always:**
- Output buffer cap (MAX_OUTPUT_LINES) — voorkom unbounded DOM growth
- OG tags + favicons consistent op alle pagina's
- Centraliseer analytics init — één bestand, niet per pagina
- Theme-aware test assertions

### Sessie 101: Playwright E2E Test Fixes (17 feb 2026)
⚠️ **Never:**
- Tests draaien zonder third-party CMP blocking (Cookiebot overlay blokkeert ALLE interacties)
- Hardcoded selectors voor dynamische modals (`#legal-modal-backdrop` → verdwenen na refactor)

✅ **Always:**
- Shared test fixture met `page.route()` blocking voor third-party scripts
- `.first()` bij selectors die meerdere elementen matchen

### Sessie 100: Bundle Size Optimalisatie (15 feb 2026)
✅ Netlify asset processing voor minificatie | Budgets per scope: Terminal Core (<400KB) vs. site totaal (<1000KB)

**Rotation:** Keep last 4 full. Archive: docs/sessions/ (current.md, recent.md, archive-*.md)

---

## Sessie Protocol

**Voor Sessie:** Lees `PLANNING.md`, `TASKS.md`, dit bestand
**Tijdens:** Markeer taken in TASKS.md direct | Noteer architecturale beslissingen
**Afsluiten:** Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
**Rotation trigger:** Every 5 sessions (last: Sessie 103, next: Sessie 108)
**Sessie counter:** 105
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
- **Commands:** `docs/commands-list.md` (32 commands)
- **Style Guide:** `docs/style-guide.md` v1.5
- **Sessie logs:** `SESSIONS.md` → docs/sessions/ (~104 sessies)
- **Netlify/Domain:** `docs/netlify-setup.md`
- **Rules:** `.claude/rules/` (tone-and-output, architecture-patterns, troubleshooting, command-checklist)
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 22 februari 2026 (Sessie 105 — Tutorial E2E Uitbreiding & Playwright Fix)
**Version:** 3.5 (Sessie 105: 8 nieuwe E2E tests, Playwright reporter hang fix)
