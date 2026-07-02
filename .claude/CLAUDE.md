# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 191)
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

### Sessie 191: UX-fix voltooiingsscherm — één heldere "wat nu?"-CTA (02 jul 2026)
⚠️ **Never:**
- `[→] Type 'next' voor je volgende stap` op een voltooiingsblok laten staan — bij een afgeronde missie bestaat er geen "volgende stap" (de stappen zijn klaar) en `next` is de globale begeleidings-funnel, geen stap-advancer. Erger: "stap" botst met de "Stap 1/4" van de volgende missie die er direct onder verschijnt. Een mislabel dat op het emotionele hoogtepunt verwart.
- Drie concurrerende "doe dit nu"-CTA's op één voltooiingsscherm dumpen — na Fundamentals stonden `tutorial recon` (box) + `tutorial` (menu) + `next` naast elkaar. `next` is juist gebouwd als de énkele context-aware router; een box die een specifiek commando voorschrijft dupliceert wat `next` toch al zegt.
- De klacht letterlijk op één plek fixen zonder te grep'en waar-nog — de mislabel zat op **4 completion-renderers** (tutorial+challenge, desktop+mobile), niet alleen de tutorial op de screenshot. Omgekeerd: de tientallen `onboarding.js`/`leerpad.js`-hits van dezelfde string NIET meeslepen — dáár is `next` mid-flow wél de eerstvolgende stap; geen mislabel.
- De outlier fixen vóór je alle peers hebt gelezen — pas na het lezen van álle 5 scenario-`completionMessage`s bleek dat alleen `fundamentals.js` een commando hardcodeert; de andere 4 sluiten al schoon af. De fix is "breng de outlier in lijn", niet "herschrijf alles".

✅ **Always:**
- Route elke voltooiing via één primaire CTA (`next`, correct verwoord: "ik wijs je naar je volgende missie/uitdaging") + het bladermenu als duidelijk secundaire "Of typ..."-regel. Eén heldere volgende actie op het beloningsmoment, geen keuzeverlamming.
- Bij "wat is het beste, brutaal eerlijk": beslis als expert met onderbouwing + "wat ik bewust NIET doe" (scroll-sequencing ongemoeid, geen auto-advance, peers ongemoeid), geen keuzemenu (`feedback_expert_ux_analysis`).
- Engelse imperatief in NL-UI is een bug: `Type`→`Typ` (`feedback_nl_copy_dejargon`), consistent met `renderObjective`/`next.js`.
- Een string-wijziging kan een regressietest sterker maken: omdat de nieuwe CTA een ándere string is dan de gesuppresste onboarding-nudge, splitste de Sessie-190 count-1-assertie naar "nieuwe CTA 1× ÉN oude string 0×" — strengere dubbele-prompt-garantie. Volledig: `docs/sessions/current.md` Sessie 191.

### Sessie 190: Bugfix tutorial/challenge-completion — laatste output zichtbaar + één "next" (01 jul 2026)
⚠️ **Never:**
- De klacht "ik zie de output niet" lezen als "output ontbreekt" — hij was er wél, maar wérd weggescrold. `renderCompletionBlock` pint de viewport op de bodem van een blok hoger dan de viewport, en `_revealCelebration` her-scrolt nóg 2× op timer (800/1500ms). Opacity:0-zones nemen al layout-hoogte in → `scrollHeight` is toch al maximaal. Diagnose = scroll-timing, geen render-gat.
- Een `isActive()`-guard lezen ná een mutatie in dezelfde tick — `handleCommand()` zet de tutorial op IDLE, waarna de onboarding-guards `isActive()` als `false` lazen en de "Type 'next'"-nudge lekte náást de completion-follow-up. Leg de staat vast vóór de mutatie.
- Een groene/rode Playwright-run vertrouwen zonder te weten wát hij draaide — warme HTTP-cache serveerde oude modules (tell: `scrollTop == scrollHeight−clientHeight` + `nextCount:2`), en een run waarin de deep-link-auto-start nog niet actief was liet commando's als gewone commando's lopen. Schone origin/poort + deterministische start + per-stap-polling.
- Een meet-artefact voor een bug aanzien — `find(/Correct/i)` pakte de "Correct!" van stáp 1 (ver weggescrold) → leek "niet zichtbaar" terwijl de echte asserts groen waren. Wantrouw je meetinstrument, niet alleen de code.

✅ **Always:**
- Scroll-anker op de betekenisvolle regel, niet blind naar de bodem — verleg naar de laatste commando-echo (`_scrollLineToTop` via `getBoundingClientRect`-delta, binnen het output-element) zodat leesvolgorde commando → output → `[✓] Correct!` → celebratie ontstaat; de gebruiker ziet direct het resultaat van zijn laatste actie.
- Zoek waar een bug nóg meer speelt vóór je fixt — tutorial én challenge delen `renderCompletionBlock`, dus één scroll-fix dekt beide; de dubbele-next was tutorial-only (challenge wordt ná de guards afgehandeld). Eén fix, juiste dekking.
- Opacity-reveal wijzigt geen layout → geen her-scroll nodig; schrap de overbodige timer-`_scrollToBottom`-calls i.p.v. ertegen te vechten. Minder code, stabieler anker.
- Anti-gold-plating in tests: leg alleen de deterministische kern vast (exact 1× "next" via `toHaveCount(1)`), niet de brosse scroll-positie (die handmatig via Playwright bevestigd). De fragiele welcome/celebratie-sequencing niet herschrijven — enkel anker + overbodige her-scrolls aanraken. Volledig: `docs/sessions/current.md` Sessie 190.

### Sessie 189: Fase A — leerpad deep-link → in-app tutorial-landing (30 jun 2026)
⚠️ **Never:**
- Een E2E/Playwright-run vertrouwen zonder te weten waartégen hij draait — `playwright.config.js` heeft `baseURL` op **productie** (`https://hacksimulator.nl`) met `webServer` uitgecommentarieerd; zonder `BASE_URL` test je de live site (géén werkkopie-code). De happy-path faalde, de no-op-tests "slaagden" toevallig. Lokale verificatie = eigen statische server + `BASE_URL=http://127.0.0.1:<port>`.
- Een tweede `tutorialEvent('started')` vuren vanuit de deep-link — `start()` (tutorial-manager.js) vuurt 'm al zónder source → dubbeltelling. Thread de source *vooraf* via een one-shot veld dat `start()` leest+wist (`setNextStartSource`), geen tweede event.
- Een overflow/meting aan je wijziging toeschrijven zonder baseline — de 10px op 375px wás er al op een kale `/terminal.html` zonder deep-link (`#terminal-container` left 10/width 360 op docW 360 = page-shell). Meet de feature-loze staat vóór je iets "fixt" (anti-gold-plating: niet repareren wat buiten scope valt).
- De fragiele welcome-boot herschrijven om de briefing "held" te maken — typewriter + legal + first-visit-flag zijn zorgvuldig gesequencet; conditioneel snijden = hoog risico, marginale winst. Scroll-to-bottom + input-focus maakt de briefing al de held (welcome scrollt boven de vouw).

✅ **Always:**
- Auto-start een UI-getriggerd commando via het registry-pad (`terminal.execute('tutorial <id>')`, Sessie-156-precedent) — dat wint op drie assen: command-echo/transparantie, history-trail én een eerlijke `markFirstVisitComplete()` (die flipt op de eerste `execute()`, niet in de welcome-render). Een directe `start()` mist alle drie.
- Deep-link gesequencet timen zodat de briefing nooit in dode input of midden in de typewriter valt: eerste bezoek → wacht op `typewriter-done` + 250ms (ruimt resume/badge-timeouts op); terugkerend → direct.
- Resume-vs-deeplink non-destructief: deep-link (verse klik) wint van stale auto-resume, maar `exit()` slaat progress op vóór de nieuwe start, en deep-link == reeds-actieve missie herstart níét (geen reset naar stap 0).
- Validatie tegen de single source of truth (`tutorialManager.getScenario(id)`), niet een hardcoded id-lijst; onbekend → stille no-op + URL ongemoeid. URL bij een valide id direct strippen via `history.replaceState` zodat refresh niet herstart. Volledig: `docs/sessions/current.md` Sessie 189.

### Sessie 188: Eén coherente leerpad-ladder — progressie-oppervlakken uniform (30 jun 2026)
⚠️ **Never:**
- Alleen de letterlijke vraag beantwoorden als het echte probleem systemisch is — "komt tutorial overeen met leerpad?" verborg drie difficulty-vocabulaires (Beginner/Gevorderd/Expert vs Fase 1-4 vs EASY/MEDIUM/HARD) over vier oppervlakken zonder onderlinge koppeling. Expert-analyse = herkader naar het systeem.
- Systemen samenvoegen om "consistent" te zijn — leerpad (oefen-checklist) / tutorial (begeleide missie) / challenge (zelftest) hebben elk een functie; mergen = verlies. De fix is gedeelde taal + koppeling, niet minder systemen.
- Aannemen dat één difficulty-label-fix het hele oppervlak dekt — de labels zaten verspreid over **6 bestanden** (challenge-renderer/challenge/dashboard/next/certificate-generator/certificates); cert-lijst + cert-generator waren aparte codepaden die de eerste fix miste. Eén gedeelde helper + de hele keten najagen.
- Een "pre-existing" groene test vertrouwen zonder de aanname te checken — de badge-count `21`-test slaagde in de volle suite via geleakte unlock-state ("21/22") maar faalde geïsoleerd; de echte telling is 22. Count-asserties horen ground-truth te volgen, niet geleakte state.

✅ **Always:**
- Bij "wat is het beste voor UX, wees eerlijk": grondige analyse + besluit + "wat ik bewust NIET doe" (anti-gold-plating), geen keuzemenu ([[feedback_expert_ux_analysis]]).
- Eén canonieke ladder (3 niveaus) waar alles op uitlijnt, met per niveau de lus lees→missie→oefen→test; outliers (leerpad 4-fasen, challenge Engels) convergeren naar de heersende vocabulaire, fase-namen behouden (informatiever) door ze te gróéperen i.p.v. te vervangen.
- De twee belangrijkste leertools expliciet aan elkaar koppelen — `leerpad` (oefenen) toont nu per niveau `[→] Begeleide missie: tutorial <id>` zodat oefenen ↔ begeleide missie als twee views op hetzelfde niveau leesbaar zijn.
- Engelse difficulty-labels in een NL-UI zijn een bug, geen smaak ([[feedback_nl_copy_dejargon]]): EASY/MEDIUM/HARD → Makkelijk/Gemiddeld/Moeilijk via één `difficultyLabel()`; interne keys (easy/medium/hard) ongemoeid voor sortering/opslag. Volledig: `docs/sessions/current.md` Sessie 188.

### Sessie 187: Fase B uitgevoerd — tutorials op orde (badge == bestemming) (30 jun 2026)
⚠️ **Never:**
- De gespecde "verborgen taak" blind uitvoeren — Stap 0 vermoedde een `Expert`-badge in `tutorial-renderer.js`; exploratie toonde dat difficulty overal platte tekst is (renderer/lijst/certificaat), géén difficulty-gestuurde CSS in de terminal → een badge bouwen = cargo-cult. De échte doorwerking zat een laag dieper (funnel). De spec wijst de richting, niet altijd de plek.
- Een stage toevoegen aan een high-water-mark-funnel zónder álle index-koppelingen mee te hernummeren — `next.js` codeert de indices op 3 plekken: `stageBuilders[]`, `hasAnyProgress`-switch, én de makkelijk te missen `buildSkippedHint`-drempels (`>0/1/3`). Die laatste vergeten = stille "nog X commando's over"-bug die geen test vangt.
- `fundamentals` aan `tutorialOrder` (de overige-missies-catch-all ná fase 3) prependen — zou een gevorderde gebruiker die fundamentals oversloeg later achterwaarts "doe fundamentals" tonen. Een eigen stage-0 + high-water dekt het correct.
- Een `du`-meting in NL-locale vertrouwen: `du -sb | awk '{print $1/1024}'` printte "640,823 KB" (komma = decimaal) → leek 640 MB, was 640.8 KB. `du -sh` (956K) was de sanity-check.

✅ **Always:**
- Bij spec-vs-engine-conflict de keuze surfacen i.p.v. stil afwijken — de engine valideert per commando, de spec wou "~5 gegroepeerd"; 7-single dwingt elke badge-belofte-skill af maar wijkt af → AskUserQuestion met previews, niet eenzijdig kiezen of klakkeloos volgen.
- Validators asymmetrisch per commando-type: kijk-commando's (pwd/ls/cat) toetsen op *afwezigheid* van error-patronen, maak/wis-commando's (mkdir/touch/rm) op *aanwezigheid* van de succes-marker (`aangemaakt`/`verwijderd`) → één check vangt alle faal-redenen (geen arg, bestaat al, geen rechten).
- Tutorial-stappen tegen de echte VFS (`structure.js`) coheren: `cd documents` → `cat scan-results.txt` bestaat dáár → mkdir/touch/rm in die schrijfbare map. De tutorial blokkeert commando's niet, dus ze muteren de echte context — stappen moeten op de werkelijke cwd-staat kloppen.
- "Geen badge nodig" als geverifieerde NIET-wijziging vastleggen, met de meting als bewijs (difficulty-tekst gemeten dark `#c9d1d9`/light `#0a0a0a`, 0 elementen buiten 375px). Volledig: `docs/sessions/current.md` Sessie 187.

### Sessie 186: Stap 0 ontwerpbeslissing — leerpad-niveaus → tutorial-scenario's (doc-only) (29 jun 2026)
⚠️ **Never:**
- Een scenario in een tier plaatsen op basis van zijn commando-syntaxis i.p.v. de geleerde skill — privesc gebruikt alleen `cat`/`ls` (beginner-commando's) maar leert log-/credential-analyse op een gehackt systeem → GEVORDERD. Tik-gemak ≠ tier (zelfde reden webvuln EXPERT is ondanks point-and-shoot sqlmap).
- De badge-*chips* lezen als een letterlijke scenario-inhoudsopgave — ze zijn overal illustratief (recon is het GEVORDERD-doel maar leert géén van zijn netcat/wireshark/hashcat-chips). Wie fundamentals aan alle 9 BEGINNER-chips bindt, hanteert een striktere standaard voor BEGINNER dan voor GEVORDERD/EXPERT.
- Een EXPERT-tool één tier lager parkeren omdat het scenario "intermediate voelt" — sqlmap in een GEVORDERD-webvuln zou de promise/payoff-leugen (badge belooft "SQL injection testing") naar binnen verplaatsen. Precies wat de hele taak uitroeit.

✅ **Always:**
- Toets tier-toewijzing aan de badge-*beschrijvingszin*, niet de chips — BEGINNER-zin ("navigeren, lezen, aanmaken, verwijderen") noemt whoami/history niet → fundamentals = navigatie+bestandsbeheer (ls/cd/pwd/cat/mkdir/touch/rm), niet alle 9 chips.
- Lees de échte scenario-inhoud (stappen + commando's) vóór een her-tiering, niet de historisch gegroeide `difficulty`-labels — die zijn juist de mismatch die je repareert.
- Zoek in een ontwerpstap de verborgen vervolgtaak: de her-tiering introduceert een derde label-waarde (`Expert`) die de codebase nog niet kent → Fase B moet `tutorial-renderer.js` checken op een ontbrekende badge-variant. Dát maakt "Stap 0 vóór B vóór A" dwingend i.p.v. ceremonieel.
- Bij "wat raad jij aan, brutaal eerlijk" i.p.v. een keuze: beslis als expert met onderbouwing, kaats niet terug (memory `feedback_expert_decisions`). Volledig: `docs/sessions/current.md` Sessie 186.

**Rotation:** Top-6 huidig: 186-187-188-189-190-191 (Sessie 185 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie Sessie 190 UITGEVOERD:** current.md staart Sessie 175-179 geknipt naar `archive-s175-s179.md` (5 entries, byte-geverifieerd, 182 regels); current.md houdt nu het rolling window 180-190 (11 entries; volgende bulk-rotatie Sessie 195 → archiveer oudste ~5). SESSIONS.md-index gesynct. Historie 81-174 → `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

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
**Sessie counter:** 191

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

**Last updated:** 02 jul 2026 (Sessie 191 — UX-fix voltooiingsscherm: mislabel "Type 'next' voor je volgende stap" + drievoudige CTA weg. Eén primaire `next`-CTA + secundaire browse-regel op 4 completion-renderers (tutorial+challenge, desktop+mobile); `fundamentals.js`-box stopt met hardcoded `tutorial recon`. Cache-bump `main.js?v=191-completion-cta`. 65 e2e chromium groen. Volledig: `docs/sessions/current.md`)
**Version:** 5.65 (Sessie 191 — completion-CTA-copy: één `next`-router i.p.v. mislabel + triple-CTA, in tutorial-/challenge-renderer.js + fundamentals.js; volledige historie: `docs/sessions/current.md` + TASKS.md)

