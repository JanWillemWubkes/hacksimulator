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
**Blog:** 10 posts live at `/blog/` (105+ inline jargon explanations)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E 161 tests across 30 suites (21 files, 3 browsers) | WCAG AAA | 182 CSS variables
**Bundle:** ~848 KB productieve code → ~809 KB na Netlify minificatie | Terminal Core: ~340 KB (binnen 400 KB budget)
**Monetization:** AdSense (10 units) + Ko-fi donaties + MailerLite newsletter (welkomstmail live) | Eigen consent banner (Consent Mode v2)

→ **Live metrics:** `TASKS.md` regels 9-26 (meest recente tellingen)
→ **Architecture:** `PLANNING.md` v2.9 | **Commands:** `docs/commands-list.md` (41 commands)

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

### Sessie 122: MailerLite Newsletter Setup & Mailchimp Migration (28 maart 2026)
⚠️ **Never:**
- MailerLite drag & drop editor via Playwright — gebruik Custom HTML + ACE editor JS API (`ace.edit().setValue()`)
- Third-party form widgets embedden als je bestaande styling wilt behouden — gebruik fetch() naar hun API endpoint
- MailerLite JSONP endpoint als directe form POST — retourneert JSON, geen redirect

✅ **Always:**
- Domain authenticeren (SPF/DKIM) vóór sender email configuratie — MailerLite blokkeert unauthenticated domains
- CORS preflight testen (`curl -X OPTIONS`) vóór client-side fetch integratie
- `application/x-www-form-urlencoded` voor MailerLite form submissions — niet JSON

### Sessie 119: 3-Zone Celebration Redesign & Stat Cards (24-25 maart 2026)
⚠️ **Never:**
- Gebruikers terugsturen in learning funnel — check `maxPhaseReached` bij phase detection
- Monolithische completion blocks gebruiken — splits in visueel gescheiden zones voor scanability

✅ **Always:**
- Sequential reveal voor multi-zone content — 800ms stagger voelt natuurlijk en geeft focus
- `maxPhaseReached` bijhouden naast `currentPhase` — voorkomt regressie na advanced progress

### Sessie 118: Ko-fi Optimization, Celebration UX & Tutorial Polish (22-23 maart 2026)
⚠️ **Never:**
- Celebration UX tonen zonder auto-copy — gebruikers verwachten dat certificaat al gekopieerd is

✅ **Always:**
- Ko-fi touchpoints op natuurlijke completion moments (challenges, certificaten) — hogere conversie
- Input validatie op security commands (nmap, traceroute) — voorkom verwarrende output bij ongeldige targets

### Sessie 117: Tutorial Hardening & M5.5 Monetization Pivot (18-20 maart 2026)
⚠️ **Never:**
- Third-party CMP (Cookiebot) gebruiken als eigen consent banner volstaat — overhead, blocking issues
- AdSense plaatsen zonder Consent Mode v2 update calls — ads laden niet correct

✅ **Always:**
- `wrong-args` vs `false` onderscheiden in tutorial validators — specifiekere feedback voor gebruikers
- Explicit width op ad containers — voorkomt invisible ads door collapsed containers
- CSP `frame-src` + `connect-src` updaten bij externe ad/analytics integraties

### Sessie 121: Doc Sync & Session Catch-Up (27 maart 2026)
⚠️ **Never:**
- Aannemen dat docs actueel zijn na meerdere werkdagen zonder sync — metrics driften snel (M5.5 was "geannuleerd" terwijl het volledig live was)
- Metrics overnemen uit vorige docs — altijd verifiëren vanuit broncode (grep CSS vars, count commands in registry)

✅ **Always:**
- `git log --format="%h %ai %s" --since=<datum>` voor sessiegrenzen — commits per datum onthullen logische sessiegroepen
- Milestone status-pivot (cancelled → active) altijd tegelijk in CLAUDE.md + TASKS.md + PLANNING.md bijwerken

**Rotation:** Keep last 5 full. Archive: docs/sessions/ (current.md, recent.md, archive-*.md)

---

## Sessie Protocol

**Voor Sessie:** Lees `PLANNING.md`, `TASKS.md`, dit bestand
**Tijdens:** Markeer taken in TASKS.md direct | Noteer architecturale beslissingen
**Afsluiten:** Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
**Rotation trigger:** Every 5 sessions (last: Sessie 120, next: Sessie 125)
**Sessie counter:** 122
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
- **Commands:** `docs/commands-list.md` (41 commands)
- **Style Guide:** `docs/style-guide.md` v1.5
- **Sessie logs:** `SESSIONS.md` → docs/sessions/ (~122 sessies)
- **Netlify/Domain:** `docs/netlify-setup.md`
- **Rules:** `.claude/rules/` (tone-and-output, architecture-patterns, troubleshooting, command-checklist)
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 28 maart 2026 (Sessie 122 — MailerLite Newsletter Setup & Mailchimp Migration)
**Version:** 4.7 (Sessie 122: MailerLite migration, welkomstmail automation, form AJAX, monetization docs)
