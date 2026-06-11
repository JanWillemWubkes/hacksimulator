# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 160)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 10 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E ~167 tests / 22 spec files (Chromium, Firefox, WebKit) | WCAG AAA | 182+27 CSS variables (main.css + landing.css)
**Bundle:** Runtime <400 KB (strikt, terminal.html) + SEO/content-pijler budgetloos (blog + assets). Site-totaal en exacte KB-breakdown wisselen per sessie — zie TASKS.md §Huidige Focus voor ground truth.
**Monetization stack:** AdSense + Ko-fi + Brevo newsletter (double opt-in + welkomstmail + deliverability getuned) + Gumroad v1.0 (3 guides + bundel) + Lead magnet (Sample Pentest). Eigen consent banner met Consent Mode v2. **Per-stack actuele status:** TASKS.md §M5.5 sectie-body.

→ **Live metrics (bundle, tests, sessie-counter):** `TASKS.md` §Huidige Focus + Voortgang Overzicht — single source of truth
→ **Architecture & document-ownership:** `PLANNING.md` v3.0 §Document Ownership | **Commands:** `docs/commands-list.md` (41 commands)

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

### Sessie 160: Public-launch SEO-metadata prep + drift-guard Check 9 + GSC Domain-launch (11 jun 2026)
⚠️ **Never:**
- `dateModified`/`lastmod` bulk-bumpen naar launch-datum zonder echte content-touch — Google straft kunstmatig-verversen af + wantrouwt `lastmod` dat overal identiek "vandaag" is. Elke datum = waar feit.
- Sitemap `lastmod` < `datePublished` laten staan — logisch onmogelijk ("gewijzigd vóór gepubliceerd"), schaadt metadata-vertrouwen. Check 9a vangt dit nu mechanisch.
- Een guard in een script vertrouwen zonder te verifiëren dat de hook-`files:`-filter de trigger-bestanden dekt — Check 9 zat in validate-docs.sh maar hook triggerde alleen op core-docs → guard vuurde niet bij sitemap/feed/blog-commits.

✅ **Always:**
- Disciplined-hybrid datum-strategie bij late publieke launch — historische `datePublished` behouden (autoriteitsverhaal), `dateModified` alleen bij echte verbetering. Beste voor geloofwaardigheid + SEO tegelijk; herdateren-naar-launch afgewezen.
- GSC = feitelijke launch-hefboom (niet de datums): Domain-property (volledige sitemap-URL vereist!) + indexering-aanvraag top-5 + backlinks ontsluiten de diepe content die Google anders ondiep crawlt.
- Drift-guard detectie-logica zelf-testen op synthetische drift (vangt-het-de-bug?) vóór vertrouwen — defense-in-depth-persistence-pattern Sessie 140 → 160 schaalt over SEO-metadata. Filesystem-ground-truth (Check 9b: RSS-count == `ls blog/*.html` minus index) → nieuwe posts tellen automatisch mee. Volledige scope: `docs/sessions/current.md` Sessie 160 entry.

### Sessie 159: `#23.2` M0-M4 permanent-SKIP closure — documentation-of-intent (12e uitkomst-categorie), ~30 min minimal scope (10 jun 2026)
⚠️ **Never:**
- Pivot-rationalisatie zonder Explore-onderzoek van pivot-target — dual van sunk-cost-rationalisatie. Voor elk pivot-besluit, Explore agent verify target-readiness pre-data.
- Plan-assumption over docs-structuur zonder pre-data verificatie — generaliseert Sessie 153 #5 + Sessie 156 #6 naar self-authored plans. Grep-verifieer locatie/structuur vóór Edit-batch.
- Tooling-overspecialisatie-fear-of-missing-out — minimal-closure scope (~30 min) ipv aut-pivot naar product-werk dat niet-ready is. Trust scope-context, niet macro-trend-bias.

✅ **Always:**
- Documentation-of-intent als 12e uitkomst-categorie naast Frame A/B/C/D + distribution-analysis + 3-burst compression + feature-completion + infra-investment + infra-investment-extension. Discipline-laag identiek: pre-data scope + AskUserQuestion + defense-in-depth + validate-docs gate.
- Semantic-difference herkenning vs drift — onderscheid semantic-equivalence-check (gelijke meaning, verschillende getallen) van semantic-difference-check (verschillende meanings, gelijke getallen). Voor frozen milestones detection-value = 0.
- Defense-in-depth-persistence-pattern (Sessie 140 → 159) schaalt over documentation-of-intent. **14-sessie streak:** 7 falsificatie + 1 KEEP + 2 methodological-evolution-output + 3 feature-completion + 1 documentation-of-intent. Volledige scope-details: `docs/sessions/current.md` Sessie 159 entry.

### Sessie 158: `#23.1` validate-docs `--deep` Check 6 extension naar M5/M5.5/M9 + NEW Blog sub-check 6b — 4 doc-drifts caught via Phase C zelf-test (10 jun 2026)
⚠️ **Never:**
- `git checkout -- file` als revert-mechanisme voor drift-injection — git checkout reset ALLE uncommitted changes + invalidates Edit-tool Read-state. Gebruik tool-level revert (Edit → Edit terug). Generaliseert Sessie 153 #5 + Sessie 156 #6 naar drift-injection-context.
- `sed -i 's|pattern|replacement|'` met `|` delimiter in markdown-tabel context — tabel-cells gebruiken `|` als separator → sed parse-conflict. Gebruik Edit-tool of andere delimiter (`#`, `@`, `_`).
- Awk-range header-format-mismatch zonder fallback — h3-plain-text vs h2-emoji mengen breekt range silent. Documenteer per-range anchor-pattern in script-comment + verifieer expected count post-impl.

✅ **Always:**
- Awk-range met canonical `[x]`/`[ ]` regex schaalt zonder telfouten — voor sections >15 checkboxes nooit handmatige telling. Generaliseert Sessie 154 #2 "verifieer pre-data" naar self-authored plans.
- Real-time drift-catch via Phase C zelf-test = direct forcing-function value-demonstration (Sessie 157 patroon repeats) — Phase C verwachtingstabel matched 100% met werkelijke output.
- 2-op-rij infra-investment ritme bewijst sub-categorie repeatable — Frame-verdict-schema N/A MAAR discipline-laag identiek (pre-data scope + AskUserQuestion + defense-in-depth + drift-injection + final zelf-test). Volledige scope-details: `docs/sessions/current.md` Sessie 158 entry.

**Rotation:** Top-6 huidig: 158-159-160 (bulk-rotation Sessie 160: pre-158 historie reeds in `docs/sessions/current.md`). Volgende bulk-rotation Sessie 165. Pre-Sessie 158 historie + bulk-rotation administration → `docs/sessions/current.md`.

---

## Sessie Protocol

**Voor Sessie:** Lees `.claude/CLAUDE.md` (this file) + check sprint-regel + Volgende Stappen in `TASKS.md`
**Tijdens:** Markeer taken in `TASKS.md` direct | Architecturale beslissingen alleen in `PLANNING.md` bij echte arch-change
**Afsluiten:** Use `/summary` command → 6-step flow (zie hieronder)

### `/summary` flow — single source of truth = `TASKS.md`

1. **Ground truth meting** (~30 sec, read-only)
   - `du -sb src/ styles/ blog/ assets/` → bundle metrics
   - `find tests/e2e -name "*.spec.js" | wc -l` → test file count
   - `git log --oneline -1` → laatste commit voor sprint-regel

2. **Update `TASKS.md`** (primary execution-tracker)
   - Header: `Laatst bijgewerkt` datum + `Sprint` regel met huidige sessie
   - Footer: datum + version
   - Milestone-tabel: percentage update bij task completion
   - Bundle/test metrics: ground-truth getallen uit stap 1

3. **Update `docs/sessions/current.md`**
   - Volledige sessie-entry (mission, work done, learnings, next steps)
   - Rotation: bij Sessie %5 → archiveer pre-N-6 entries naar `archive-*.md`

4. **Update `.claude/CLAUDE.md`** (AI-context, lean — dit bestand)
   - "Recent Critical Learnings": prepend nieuwe sessie, behoud top 6, ouderen → `current.md`
   - "Sessie counter" regel
   - **`**Last updated:**` regel:** VERVANG volledig (1 regel: datum + Sessie N + 1-zin scope-aanduiding + verwijzing naar `current.md`). **NIET appenden** — historie zit al in `current.md`. Hard limit: ≤500 bytes.
   - **`**Version:**` regel:** VERVANG volledig (1 regel: versienummer + verwijzing naar `current.md`). **NIET appenden**. Hard limit: ≤500 bytes.
   - Live metrics in Quick Reference: **niet** updaten — verwijs naar TASKS.md
   - Forcing-function: `scripts/validate-docs.sh` Check 8 verifieert beide single-line constraints automatisch (#23.3)

5. **Update `PLANNING.md`** ALLEEN bij architectuur-wijziging
   - Nieuwe tech-stack-keuze, design-system-change, security-strategie-shift
   - GEEN milestone-percentage-updates (woont in TASKS.md)

6. **Update `docs/prd.md`** ALLEEN bij scope-wijziging
   - Nieuwe requirements, success criteria change
   - GEEN tactical execution updates

7. **Validatie** (forcing function)
   - `bash scripts/validate-docs.sh` → exit 0 vereist
   - Pre-commit hook draait dit automatisch
   - Checks: sessie-counter alignment, datum-consistency binnen doc, PRD-version-match across docs

**Rotation trigger:** Every 5 sessions, archive sessies N-10..N-6 from CLAUDE.md learnings (last bulk: Sessie 145 archived 135-139, Sessie 146 1-in-1-out archived Sessie 140 → current.md, next bulk: Sessie 150)
**Sessie counter:** 160

→ **Document Ownership map:** `PLANNING.md §Document Ownership`

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

### Playwright Screenshot Conventie
- **ALTIJD** expliciete `filename` meegeven aan `browser_take_screenshot`
- Prefix met `.playwright-mcp/` — die dir staat in `.gitignore`, dus screenshots blijven automatisch buiten git
- Voorbeeld: `filename: ".playwright-mcp/legal-light-h1.png"`
- **NOOIT** screenshots zonder filename of in repo root — de `/*.png` regel in `.gitignore` is een vangnet, geen excuus

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

**Last updated:** 11 jun 2026 (Sessie 160 — public-launch SEO-prep: sitemap/feed drift-fix + validate-docs Check 9 + GSC Domain-launch + runbook. Volledige sessie-narratief: `docs/sessions/current.md`)
**Version:** 5.34 (volledige version-historie + per-sessie scope-notes: `docs/sessions/current.md`)

