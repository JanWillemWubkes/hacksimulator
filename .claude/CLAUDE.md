# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 164)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 12 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125; +2 posts Sessie 160)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E ~197 tests / 23 spec files (Chromium, Firefox, WebKit) | WCAG AAA | 182+27 CSS variables (main.css + landing.css)
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

### Sessie 164: Blog feitencontrole — bronverificatie ontkracht 6/7 agent-vals-alarmen + OWASP 2025-kader (14 jun 2026)
⚠️ **Never:**
- Audit-agent-"verdachte feiten" als fout aannemen — 6 van 7 (Heartland/Yahoo/TalkTalk/Metasploit/backdoor/Twitter) waren vals alarm; eigen WebSearch-verificatie redde correcte feiten van een onterechte "fix". De énige echte fout (Sony PSN als SQLi) kwam pas via verificatie boven, niet uit een agent-rapport.
- Een tijdgevoelige claim ("2021 = meest recente OWASP Top 10") onverifieerd laten staan — de 2025-editie was al definitief (7 jan 2026). Verouderd-maar-eerlijk-gelabeld ≠ fout, maar de claim "meest recente" wás fout.
- Onbronbare ronde statistieken laten staan ("70% vaker", "45-60%", "80% begint met social engineering") — herformuleren/ankeren aan een documenteerbare bron of kwalitatief maken (memory `feedback_tone_no_hype`).

✅ **Always:**
- Eigen bronverificatie boven agent-gezag — reachability/bron-check scheidt echte fouten van plausibele ruis (Sessie 160/163-discipline, nu op educatieve/marketing-content).
- Liever een feit weglaten dan onzeker claimen — SSRF-fusiebestemming in OWASP 2025 niet met zekerheid uit de bron → weggelaten i.p.v. gegokt.
- Juridische claims tegen de wettekst checken — art. 138ab: kale computervredebreuk max 2 jaar (lid 1); 4 jaar (lid 2) pas bij gegevens overnemen/aftappen of binnendringen via openbaar telecomnet, niet "voorbedachte rade".
- Grote docs (TASKS.md/current.md >25k tokens) overschrijden de Read/Edit-tool-limiet → doc-sync via geverifieerd Python-script met occurrence-asserts. Volledig: `docs/sessions/current.md` Sessie 164.

### Sessie 163: nmap-profiel bug-report fix + bug-klasse-audit + cat.js-hardening (14 jun 2026)
⚠️ **Never:**
- Branch-selectie op gebruiker-input via ruime `target.includes('192.168.1.1')` — substring matcht supersets (`192.168.1.100` bevat `192.168.1.1`) → verkeerd profiel (router DNS 53 i.p.v. webserver SSH 22). Exacte/segment-match voor specifieke hosts; reserveer `.includes()` voor bewuste categorie-heuristiek.
- Een output↔uitleg-mismatch fixen door de uitleg-tekst aan te passen — de bron-output was fout, de didactische tekst klopte al. Fix de bron, niet de uitleg (omgekeerde Sessie 161/162 "doc-claim vs bron-tool").
- Audit-agent-"bugs" als waar aannemen — 2/2 kandidaten (`ping.js`/`cat.js`) waren vals alarm; de kwetsbare tak was onbereikbaar (whitelist-afgeschermd). Verifieer reachability tegen werkende code (generaliseert Sessie 160-les).

✅ **Always:**
- Reachability als criterium dat echte bugs van valse alarmen scheidt — alleen nmap was raakbaar met geldige, gedocumenteerde input (`192.168.1.100` = tutorial-doelwit + man-page-voorbeeld). Statische `.includes()`-scan vindt alle drie; reachability isoleert de echte.
- Hardenen waar de input-ruimte open is, niet waar 'ie gesloten/bewust ruim is — `cat.js` (groeiende VFS) ankeren op `resolvedPath`; `ping.js` (gesloten whitelist) + nmap-heuristiek (feature-contract) met rust. Voorkomt over-engineering (Sessie 159 minimal-scope).
- `?v=`-cache-busting is architectonisch begrensd tot entry-bestanden bij een ES-module-graaf — imports zonder versie-token + 1-week `/src/**/*.js`-cache laten diepe modules stale. Pre-launch onschadelijk, post-launch echte gap → esbuild content-hash als NEW M9-item. Volledig: `docs/sessions/current.md` Sessie 163.

### Sessie 162: Pre-launch visueel materiaal — kit §4 GIF + screenshots via reproduceerbaar capture-script (14 jun 2026)
⚠️ **Never:**
- Een doc-claim als waarheid overnemen in een launch-asset zonder de tool te draaien — de kit beloofde een `[!]`-waarschuwing bij `nmap 192.168.1.1`, maar dat doelwit = router-profiel met alleen een `[?] TIP` (`[!]` hoort bij database-doelwit / offensieve tools). De visual legde de overdrijving bloot. Bron = `src/commands/*`, niet een andere doc.
- Aannemen dat een gebundelde tool volledig is — Playwright's `ffmpeg-1011` is een gestripte build (geen gif-muxer/palettegen, alleen VP8/webm). Verifieer feature-support (`-muxers`/`-filters`) vóór je erop bouwt.
- Rekenen op ongecommit werk dat een parallelle-terminal git-operatie overleeft — een `git stash -u` + pull elders wisselde de working tree; het werk leek weg.

✅ **Always:**
- Verifieer doc-claims tegen de bron-tool/code vóór ze in een extern-zichtbaar artefact belanden (generaliseert Sessie 161 "natelbaar = betrapbaar" naar marketing-visuals).
- Pure-JS fallback (gifenc+pngjs) bij ontbrekende/gestripte system-tooling — geen sudo/wachtwoord, reproduceerbaar; frame-per-teken geeft volledige tempo/loop-controle. GIF-grootte schaalt met frame-aantal, niet duur → langere hold = lange-delay enkele frame.
- localStorage-state (legal/onboarding/consent) vooraf via Playwright `addInitScript` wegzetten voor een schone capture-take — keys eerst in de bron verifiëren.
- Recovery-route bij "verdwenen" werk: `git reflog` + `git stash list` vóór paniek; gegenereerde marketing-assets in gitignored map + het reproduceerbare script committen. Volledig: `docs/sessions/current.md` Sessie 162.

### Sessie 161: Launch-aankondigings-kit — Fase 4 groundwork voor publieke launch 18 jun 2026 (11 jun 2026)
⚠️ **Never:**
- Marketingclaim overnemen uit bestaande site-tekst zonder bron-check — de homepage-leerpad noemt `netcat`/`wireshark` die níét als commando bestaan; copy-paste had de overdrijving doorgegeven. Bron = `src/commands/*` + commands-list.md, niet andere marketing.
- "Certificaat" als credential claimen (FAQ zegt expliciet: geen erkend diploma) of een exact command-getal noemen i.p.v. "40+" — natelbaar = betrapbaar.
- Kanaal-self-promo-regels uit geheugen invullen — Reddit/Tweakers/HN-regels variëren + veranderen; verkeerde gok = ban/mod-removal op launch-dag. WebSearch-verifiëren; waar niet indexeerbaar: "check sidebar op het moment zelf" documenteren.

✅ **Always:**
- Geverifieerde-feitenlijst als single-source-of-truth bovenin een multi-variant copy-document — voorkomt drift tussen varianten (zelfde defense-in-depth-logica als validate-docs Check 8/9).
- Nuchtere/eerlijke toon als default voor marketing-copy (memory `feedback_tone_no_hype`) — niet alleen user-voorkeur maar mechanisch belonend: HN straft marketing-taal af, Reddit/EHGN draaien op value-first.
- AskUserQuestion bij positionerings-/toon-/doelgroep-keuzes (strategisch/product = Heisenberg-territorium) vóór copy schrijven — die 3 keuzes stuurden álle output.
- `[invullen]`-placeholders voor persoonlijke details i.p.v. namens de user een mooier-dan-waar verhaal schrijven — houdt de eerlijkheid bij de eigenaar. Volledige scope: `docs/sessions/current.md` Sessie 161 entry.

### Sessie 160: Public-launch SEO-metadata prep + drift-guard Check 9 + GSC Domain-launch (11 jun 2026)
⚠️ **Never:**
- `dateModified`/`lastmod` bulk-bumpen naar launch-datum zonder echte content-touch — Google straft kunstmatig-verversen af + wantrouwt `lastmod` dat overal identiek "vandaag" is. Elke datum = waar feit.
- Sitemap `lastmod` < `datePublished` laten staan — logisch onmogelijk ("gewijzigd vóór gepubliceerd"), schaadt metadata-vertrouwen. Check 9a vangt dit nu mechanisch.
- Een guard in een script vertrouwen zonder te verifiëren dat de hook-`files:`-filter de trigger-bestanden dekt — Check 9 zat in validate-docs.sh maar hook triggerde alleen op core-docs → guard vuurde niet bij sitemap/feed/blog-commits.

✅ **Always:**
- Disciplined-hybrid datum-strategie bij late publieke launch — historische `datePublished` behouden (autoriteitsverhaal), `dateModified` alleen bij echte verbetering. Beste voor geloofwaardigheid + SEO tegelijk; herdateren-naar-launch afgewezen.
- GSC = feitelijke launch-hefboom (niet de datums): Domain-property (volledige sitemap-URL vereist!) + indexering-aanvraag top-5 + backlinks ontsluiten de diepe content die Google anders ondiep crawlt.
- Drift-guard detectie-logica zelf-testen op synthetische drift (vangt-het-de-bug?) vóór vertrouwen — defense-in-depth-persistence-pattern Sessie 140 → 160 schaalt over SEO-metadata. Filesystem-ground-truth (Check 9b: RSS-count == `ls blog/*.html` minus index) → nieuwe posts tellen automatisch mee. Volledige scope: `docs/sessions/current.md` Sessie 160 entry.
### Sessie 160 (cloud-spoor, gemerged 14 jun): SEO launch-perfectie + pre-launch consistency sweep (12 jun 2026)
⚠️ **Never:**
- Audit-agent-bevindingen fixen zonder eigen verificatie — 2 van 5 "kritieke" Explore-bevindingen waren vals alarm (DB_PASS TODO = bewuste gesimuleerde content; hydra/sqlmap/nikto localStorage-consent = by-design). Verifieer tegen werkende code + design-intent vóór fix.
- Handmatige `grep -c 'test('` als test-count ground-truth — gaf 167/173/181; `npx playwright test --list --project=chromium` (197 tests/23 files) is canoniek.
- Cache-bump beperken tot root + blog — Sessie 150 main.css v=150 bump miste `assets/legal/*.html` (10 sessies stale CSS). Bij elke `?v=` bump: grep over ALLE directories.

✅ **Always:**
- Consent-patroon-consistentie over alle security tools — hashcat/metasploit geharmoniseerd naar hydra/sqlmap/nikto `security_tools_consent` localStorage-patroon (`reset consent` werkt mee).
- Parallelle Explore-audits (docs + site-content + code-vs-spec) + vals-alarm-verificatie + AskUserQuestion scope-keuzes = launch-readiness-audit. SEO-helft: canonicals + FAQPage + BreadcrumbList + E-E-A-T + 2 blogposts (10→12).
- Defense-in-depth over alle 9 fixes + SEO-batch; beide live & geverifieerd. Volledige scope: `docs/sessions/current.md` Sessie 160 (cloud-spoor) entries.


**Rotation:** Top-6 huidig: 160-161-162-163-164 (Sessie 159 → `docs/sessions/current.md` via 1-in-1-out; bulk-rotation Sessie 160: pre-158 historie reeds gearchiveerd). Volgende bulk-rotation Sessie 165. Pre-Sessie 160 historie + bulk-rotation administration → `docs/sessions/current.md`.

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
**Sessie counter:** 164

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

**Last updated:** 14 jun 2026 (Sessie 164 — blog feitencontrole 13 posts: eigen bronverificatie ontkrachtte 6/7 agent-'verdachte' feiten als vals alarm; 1 echte fout Sony PSN→Pictures SQLi; OWASP verouderingsfout + 'Wat is nieuw in 2025'-kader; art.138ab 4-jaar-trigger-fix; precisie-nuances + natrekbare bronblokken (HTTP-200). Volledig: `docs/sessions/current.md`)
**Version:** 5.38 (volledige version-historie + per-sessie scope-notes: `docs/sessions/current.md`)

