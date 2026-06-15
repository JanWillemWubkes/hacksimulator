# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 168)
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

### Sessie 168: Blog-tabel-uitlijning fix (Filter ↔ beschrijving) (15 jun 2026)
⚠️ **Never:**
- Aannemen dat een nette HTML-`<table>` vanzelf uitlijnt — zonder eigen CSS valt 'ie terug op browser-default `vertical-align: baseline`; bij een afgebroken (multi-line) cel lijnt de buurcel uit op de baseline van de laatste regel → rijen uit sync. `styles/blog.css` had nul tabel-regels (latente bug, pas zichtbaar toen een filter-cel afbrak).
- Een uitlijn-fix "verifiëren" op het oog via screenshot — meet het: `getBoundingClientRect().top` cel-1 vs cel-2 per rij (`filterTop == descTop`) is binair pass/fail, ook over dark/light/375px.

✅ **Always:**
- Fix op cascade-niveau wanneer de oorzaak een *ontbrekende* regel is, niet een verkeerde override — één scoped `.blog-post-content table/th/td`-blok repareerde alle 4 blog-tabellen (wireshark/nmap/hashcat/wachtwoord-beveiliging) tegelijk i.p.v. symptoom-per-pagina.
- `vertical-align: top` op `th,td` als kern-fix tegen baseline-drift bij wrappende cellen; `border-collapse: collapse` + rij-randen voor leesbaarheid.
- Bewezen patroon hergebruiken (`legal.css` tabel-styling) maar met de doel-context z'n eigen CSS-variabelen (`--spacing-*`/`--color-*`) → thema-aware "gratis", conform architecture-patterns.md §1. Volledig: `docs/sessions/current.md` Sessie 168.

### Sessie 167: Doc-drift fix M9 — esbuild post-launch-blok uit milestone-sectie (15 jun 2026)
⚠️ **Never:**
- Een sectie↔tabel-drift "fixen" door de tabelcijfers te herschrijven — de echte fix is fysieke *verplaatsing* over een h2-grens. Check 6's awk-range is h2-emoji-anchored (`/^## 🧹 M9:/,/^## 🎓 M6:/`), dus een h3-subsectie erft de milestone-checkbox-telling van z'n omhullende h2; 5 `[ ]` binnen M9 → 19/24 i.p.v. 19/19.
- Topisch verwante toekomst-scope onder een afgeronde milestone-h3 parkeren — esbuild (Sessie 162, post-launch, raakt PRD §13 red line) zat onder M9 (bundle/cache-sprint, ✅ Voltooid Sessie 110). Verwantschap ≠ sprint-lidmaatschap; het heropende M9 vals in `--deep`.
- Vertrouwen dat de pre-commit-gate (fast-mode) sectie-drift vangt — fast-mode telt geen sectie-checkboxes; alleen `--deep` doet dat. Een drift die fast passeert maar `--deep` faalt, kwam binnen via checkbox-telling (het gat dat Sessie 158 #23.1 dichtte).

✅ **Always:**
- Bij een (a)/(b)-scope-beslissing over milestone-toewijzing: bron-onderbouwing eerst (Status, `Total Tasks`-footer, sub-sectie-som, "geen pre-launch werk"-labels, tag-sessie) en de keuze met aanbeveling via AskUserQuestion vóór de edit — milestone-membership is scope-territorium (Heisenberg).
- Blok-verplaatsing in grote docs (>25k tokens) via Python met occurrence-asserts: h3-uniciteit, behoud `[ ]`-count in blok, ná-move M9-range 0 `[ ]`/19 `[x]`, h3 buiten range, totaal-`[ ]` ongewijzigd. Asserts bewaken semantiek, niet witruimte.
- Cosmetische witregel-controle ná een geautomatiseerde markdown-move — een cut neemt de sectie-scheider mee (ontbrekende leegregel), een paste verdubbelt er een; occurrence-asserts zien dat niet.
- `--deep` exit 0 als harde gate ná de fix (M9 `OK 19/19` + `OK 100%`). Volledig: `docs/sessions/current.md` Sessie 167.

### Sessie 166: Pre-launch security-audit + CSP-hardening (14 jun 2026)
⚠️ **Never:**
- CSP `script-src` `'unsafe-inline'` wegwerken via hashes op een host die HTML minificeert — Netlify `build.processing.html minify` verandert de bytes → SHA-256 breekt. Externaliseer inline scripts naar `/src/*.js` (bestaand `init-theme.js`-patroon); nonce/Edge-Function schendt "no backend".
- Een geëxternaliseerd consent-default-blok los/async laden naast een async AdSense-tag — race: AdSense kan vóór de `denied`-defaults draaien (ads zonder toestemming). Injecteer AdSense ná de defaults vanuit consent-default.js; verifieer in `dataLayer`.
- Een agent-bevinding of een "rode" E2E-test als waar/jouw-schuld aannemen zonder bron- resp. schone-baseline-verificatie — privacy-agent claimde vals "geen unsafe-inline in script-src"; 2/3 testfailures faalden óók zonder de diff (pre-existing), 1 was flaky (`git stash` + rerun scheidt regressie van ruis).

✅ **Always:**
- Launch-kritische CSP browser-verifiëren onder de échte header (lokale server die `netlify.toml`-CSP injecteert) — een gewone static server stuurt geen CSP, dus violations blijven onzichtbaar; zo kwamen 2 pre-existing gaten boven (frame-src/img-src `adtrafficquality` = geblokkeerde AdSense fraud-beacons, F6).
- `gtag` als globale binding houden bij externalisatie — consent.js/init-analytics.js roepen 'm als kale identifier; een IIFE-wrapper breekt de consent-update stil.
- Veilige fixes eerst, de risicovolle (CSP) als laatste met volledige verificatie als gate (nul console-violations per pagina-archetype + E2E-baseline-vergelijking).
- Bij her-verzoek tot veiligheidscheck vóór launch een eerder advies durven herroepen als verificatie risico toont — correctheid boven consistentie ([[feedback_verify_before_launch_critical]]). Volledig: `docs/sessions/current.md` Sessie 166.

### Sessie 165: Kwaliteits-/feitencontrole betaalde Gumroad-producten (14 jun 2026)
⚠️ **Never:**
- Een verdacht feit in een betaald product "fixen" vóór eigen bronverificatie — élk verdacht juridisch punt + de OWASP-2025-volgorde bleek vals alarm; "20 april 2016" léék fout maar is de officiële ingangsdatum (maxius.nl), eJPT→INE was correcter dan de zoek-snippet ("OffSec"). Blind volgen had correcte content kapot-gefixt (generaliseert Sessie 164 naar betaalde producten).
- Verkoopcopy-cijfers (pagina's/getallen) baseren op de draft of een schatting — de listings beloofden "~75 pagina's", de gebouwde PDF's leveren 47 (playbook 84% over). Tel tegen het artefact dat de koper krijgt (`pdfinfo`). Natelbaar = betrapbaar.
- Een onverifieerbare specifieke claim laten staan of gokken — geen ECLI verzonnen voor de Gelderland-zaak (niet te bevestigen → geverifieerde news-URL); zaak-2-"2014" zonder bron → tot rechtsprincipe genericeerd.

✅ **Always:**
- Eigen WebSearch/WebFetch-bronverificatie als scheidslijn echte fout vs. vals alarm — bevestigde 3 echte issues (pagina-claims, Krol-feitfout 'gemeenteraadslid'/'geanonimiseerde', stale MailerLite) tussen een grote meerderheid correcte feiten.
- Belofte-vs-inhoud als eerste verdachte bij "met zorg gecontroleerde" content — de feiten waren sterk; de zwakte zat in de marketing-cijfers. Nieuwe memory `feedback_verify_claims_against_artifact`.
- Fix in de canonieke bron (`.typ`) + artefact herbouwen + output verifiëren (`pdftotext`/`pdfinfo`) — een fix is pas klaar als de PDF die de koper downloadt klopt; rebuild-only timestamp-ruis terugdraaien houdt de diff eerlijk.
- Eerlijk deferren boven blind protocol — current.md bulk-rotatie 155-159 gedefererd wegens dubbelzinnige archief-bestemming (niet door validate-docs gedekt); risico > baat vóór commit. Volledig: `docs/sessions/current.md` Sessie 165.

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

**Rotation:** Top-6 huidig: 163-164-165-166-167-168 (Sessie 162 → `docs/sessions/current.md` via 1-in-1-out). Bulk-rotatie 155-159 GEDEFERD — archief-bestemmingsconventie dubbelzinnig (recent.md t/m 149 oplopend; archive-q* 2024), bevestigen vóór uitvoeren. Volgende bulk-rotation Sessie 170. Pre-Sessie 162 historie → `docs/sessions/current.md`.

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
   - **`**Last updated:** 14 jun 2026 (Sessie 165 — kwaliteits-/feitencontrole betaalde Gumroad-producten: pagina-claims → echte PDF-telling (13/19/15/47), Krol-zaak feitfout + ECLI-bronnen, helderheids-glosses CVE/CVSS/ICMP + OWASP-2025-namen exact, MailerLite→Brevo; meeste agent-'verdachte' feiten vals alarm; PDF's herbouwd. Volledig: `docs/sessions/current.md`)
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
**Sessie counter:** 168

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

**Last updated:** 15 jun 2026 (Sessie 168 — blog-tabel-uitlijning fix: scoped `.blog-post-content table/th/td`-blok in `styles/blog.css` met `vertical-align: top` als kern-fix (browser-default `baseline` trok rijen uit sync bij afgebroken code-cellen) + `border-collapse`/padding/rij-randen, thema-aware via blog-CSS-variabelen. Repareert alle 4 blog-tabellen; browser-geverifieerd `filterTop == descTop` in dark/light/375px. Commit `4368bb4`. Volledig: `docs/sessions/current.md`)
**Version:** 5.42 (volledige version-historie + per-sessie scope-notes: `docs/sessions/current.md`)

