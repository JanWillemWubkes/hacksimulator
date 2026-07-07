# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 198)
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

### Sessie 198: Launch-readiness — funnel-meetbaarheid + demand-validatie + value-prop (08 jul 2026)
⚠️ **Never:**
- Het fundamentele launch-gat als een feature lezen — na 197 sessies polish (+ M8-analytics op 2%) was de eerlijke diagnose: technisch launch-ready, strategisch ongevalideerd (nul extern signaal, geen succescriterium). Meer bouwen was niet het antwoord; extern bewijs + een meetbaar doel wel.
- Value-prop/retentie live gokken vóór validatie — de hero herschrijven op eigen smaak is exact de onbewezen-aanname-fout die je aankaart. Lever de varianten + laat toetsen (WS2 5-sec-test); "alles aanpakken" = de haakjes klaarleggen, niet blind bouwen.
- "Unverified" commits automatisch als verkeerde-auteur lezen — hier was auteur+committer al `noreply@anthropic.com`; de oorzaak was de ontbrekende SSH-handtekening met een lege 0-byte signing-key (draai als root, geen `claude`-key-toegang). Amend/rebase voegt geen handtekening toe en herschrijft gedeployde main-historie voor niets → niet forceren. Check `%G?` + de key vóór je iets herschrijft.
- Een event-wrapper "dood" noemen zonder het call-pad te checken — `feedbackSubmitted` in events.js wordt nooit aangeroepen, maar feedback.js roept `tracker.trackEvent('feedback_submitted')` direct aan → wél bedraad, geen gat. Verifieer de directe-call-route.

✅ **Always:**
- Funnel-events bewijs je zónder productie-GA4 — de gtag-shim pusht naar `window.dataLayer` ook al is het externe GA4-script egress-geblokkeerd; consent pre-setten via Playwright `addInitScript` (JSON `{analytics:true}`, zelfde key voor consent.js én tracker.js) + dataLayer-`event`-tuples lezen = volledige funnel-verificatie in de sandbox.
- Meet de conversie waar je 'm mist — de #1 launch-metric (homepage→terminal-doorklik) was onmeetbaar want de "start terminal"-CTA's hadden geen event; `data-terminal-cta="<locatie>"` + reuse van het bestaande delegated-click-patroon in cta-tracking.js meet 'm nu per plek. Activation (eerste command) once-per-sessie via `sessionStorage`-guard (survives reload; module-boolean her-vuurt per reload).
- Leg vooraf vast wat succes is — `docs/launch-success-metrics.md` koppelt elke funnel-stap aan z'n event + streefgetallen als expliciete hypotheses (north-star = activation-rate) + de GA4-config; zonder dat is de launch een oninterpreteerbare spike.
- Splits "wat ik bouw" van "wat inherent van de gebruiker is" — testers werven/sessies draaien, GA4-goals configureren en de finale copy/retentie-keuze zijn van Heisenberg; ik lever de code + protocollen + varianten die dat uitvoerbaar maken. Volledig: `docs/sessions/current.md` Sessie 198.

### Sessie 197: Laatste volledige simulator-bug-test + 2 fixes (07 jul 2026)
⚠️ **Never:**
- Iets een bug noemen vóór je het tegen het codepad houdt — ~6 "vondsten" waren vals: heuristiek-matches op body-tekst (man-page mét "command not found" als voorbeeld; tool-output mét "waarschuwing"), een localStorage-lees op 350ms terwijl de progress-store 500ms-debouncet (leek dataverlies, was timing), scrollback-accumulatie in `innerText` (een eerdere `leerpad`-render bleef in beeld en matchte "Vergrendeld"/afgevinkte commands), en de by-design typewriter-tap-guard.
- Je meetinstrument vertrouwen — Playwright's `fill()` forceert focus voorbij de FocusTrap, waardoor een commando "uitvoerde" met de legal-modal actief; het echt-gebruikerspad (typen zónder force-focus) bewees dat de terminal onbereikbaar is. Modal-protection was degelijk; de bug zat in mijn meting (vgl. Sessie 185/190/196).
- Een mobiele overflow als scroll-/anker-probleem lezen — de 10px-offset (Sessie 189 als symptoom genoteerd) kwam uit `width:100%` + `margin:10px` sámen op `#terminal-container`; `body overflow-x:hidden` verbergt het (geen scrollbar, `window.scrollX`=0) maar clipt wél de rechter 10px content. Meet met `getBoundingClientRect` + `window.scrollX` of het gebruiker-zichtbaar is.
- Een "laatste check" breed maken — scope niet uitbreiden naar entry-points/hele-site (deep-link al spec-gedekt, blog/consent net ~15 sessies geaudit); een oppervlakkige brede sweep verwatert een scherpe, begrepen eindstaat.

✅ **Always:**
- De duurzame mobiele fix zit in de breedte, niet in het anker — `width:auto` op de mobiele `#terminal-container` centreert symmetrisch (10px beide zijden) én elimineert de overflow in één regel; navbar (100% van de body) volgt vanzelf. Gemeten 375px 0 overflow, desktop ongewijzigd.
- Persistence-flush hoort óók op `pagehide` + `visibilitychange(hidden)`, niet alleen `beforeunload` — dat laatste vuurt op mobiel vaak niet bij app-switch/scherm-lock, en `completeChallenge` schrijft via de 500ms-debounce → een net-voltooide challenge kan verloren (niet-zelfherstellend, anders dan multi-tab). 3 idempotente regels per store. Bewijs het venster (lees <500ms = leeg) én de fix (na de event = gevuld).
- Backlog vastleggen i.p.v. half-blind fixen — de 10 prod-hardcoded specs (→ `BASE_URL`) niet omzetten vanuit een egress-geblokkeerde omgeving waar je ze niet tegen prod kunt verifiëren; performance/debug wijzen mogelijk bewust naar prod. Hoogste-waarde-move = smoketests van werkkopie-tests splitsen. Vastgelegd als TASKS.md item 42.
- Systematisch het hele oppervlak driven met échte input — 8 passes (41 commands + man-pages, security-consent 5 tools, 5 tutorials + challenges end-to-end, gamification, core-input, welcome-state, mobile) vonden precies 1 echte bug; de brede dekking draagt de "0 open bugs"-conclusie. Volledig: `docs/sessions/current.md` Sessie 197.

### Sessie 196: CTA-consistentie-audit — "typ next" vs directe opdracht (06 jul 2026)
⚠️ **Never:**
- Een gemelde "inconsistentie" fixen vóór je hebt vastgesteld of het design is — tutorial-stappen (command-only, advance op `validate()`) en de vrije-verkenning-funnel ("Typ 'next'") zijn bewust gescheiden modi; de echte drift zat in de verpakking (copy/markers) en twee randgevallen, niet in de architectuur. Een architectuur-"fix" had het twee-modi-ontwerp gesloopt.
- Een string-sweep als af beschouwen omdat een vorige sessie 'm deed — de Sessie-193 `Type '`-sweep miste 24 hint-strings in álle 5 scenario's (`'Type het commando'`/`'Type: <cmd>'` — geen quote na Type). Pas af na een patroon-brede na-grep (`\bType\b`) + jargon-triage, niet na de gemelde plekken.
- Een hint "onderdrukken" door de output te nullen terwijl de state-mutatie doorloopt — `recordCommand` passeerde de exacte `===`-drempels en consumeerde one-time-flags mid-missie; de genulde Tab-/Ctrl+R-tips verdwenen daardoor permanent. Bevries de state aan de bron (`{deferHints}`), filter niet de output.
- Synthetische `dispatchEvent(new KeyboardEvent(...))` vertrouwen voor render-en-meet — de command-handler vuurde niet en de "gevonden" CTA bleek een welcome-regel; echte `fill`+`press('Enter')` wel. Wantrouw je meetinstrument (vgl. Sessie 185/190).

✅ **Always:**
- Symmetrie-check tutorial⇄challenge op elke state-lezende plek — `ctaMode` keek alleen naar tutorialManager, dus een hervatte challenge kreeg twéé concurrerende boot-instructies (welcome-next-CTA + challenge-resume). Zelfde asymmetrie-klasse als Sessie 195's `hasError`; hier zelfs binnen één bestand (filesystem-hints wél geguard, progressive-hints niet).
- Eén CTA-string = één marker — "Typ 'next' voor je volgende stap" had er 3 ([→]/kale →/[?]); de renderer kleurt ze toevallig gelijk, dus niemand zág de drift. Unificeer op de hiërarchie ([→]=actie) en laat lijst-bullets bewust kaal.
- Een marker-swap in een padEnd-box meten, niet aannemen — `[?]`→`[→]` is 1 UTF-16-unit maar glyph-breedte verschilt per font; `getBoundingClientRect` op alle 38 boxregels (uniek: 1148px) bewees uitlijning objectief.
- Mechanische sweeps vooraf de-risken: test-contract-grep (next-funnel.spec grept `/\[->\] Typ/` → next.js-boxen NIET aanraken), consumenten-check (`_stripTips` matcht beide TIP-vormen → dual-match als vangnet laten staan), colon-loze varianten. Bewust-NIET vastleggen: ASCII `[->]`, kale bullets, EN-vakjargon, `===`→`>=`. Volledig: `docs/sessions/current.md` Sessie 196.

### Sessie 195: Leerpad-consistentie + brede spook-command-nasweep (05-06 jul 2026)
⚠️ **Never:**
- Een ontbrekend item op N plekken bijplakken terwijl de echte bug de duplicatie is — het leerpad miste `whois` omdat de faselijst op 5 plekken hardcoded stond en al gedivergeerd was van de recon-tutorial die whois wél leert. Fix = één bron (`src/core/learning-path.js`, `phaseCommandNames()`), niet 5 kopieën bijwerken. Zodra één plek wijzigt divergeert de rest geruisloos (geen error, alleen een gebruiker die z'n vinkje mist).
- Een audit-suggestie blind toepassen — de audit wilde feed.xml OWASP "2021"→"2025"; verificatie toonde 2021 = de officieel uitgebrachte editie (2025 nog concept) + blog-meta zegt bewust 2021 → suggestie fout, toepassen had een feitfout geïntroduceerd. Verifieer vóór je wijzigt ([[feedback_verify_before_launch_critical]]).
- Een tracking-guard vertrouwen die niet symmetrisch is — `_shouldTrackCommand`'s `hasError`-markers dekten whois/ping's foutstrings maar niet traceroute's `Failed to resolve` → een gefaalde traceroute vinkte Fase 3 af. Zelfde asymmetrie-klasse als de leerpad-bug zelf.
- Vak-idioom letterlijk vertalen als NL-copy — "hop voor hop" (traceroute-jargon) is geen Nederlands; "stap voor stap" wel (user-correctie). Check bij elke NL-frase: zou een niet-techneut dit zo zeggen? ([[feedback_nl_copy_dejargon]]).

✅ **Always:**
- Bij een groei van een gedeelde lijst: check backwards-compat van afgeleide drempels — Fase 3 groeide 4→6, dus "alles geprobeerd" zou bestaande EXPERT-unlockers her-vergrendelen. Drempel `≥4 van 6` (`PHASE3_UNLOCK_THRESHOLD`) houdt oude 4/4-users unlocked én laat recon-finishers direct door. dynamic-content README-fasedetectie kreeg dezelfde drempel-behandeling.
- Content-oppervlakken tegen de echte command-lijst auditen, niet alleen de code — terminal.html prees `wireshark` aan (bestaat niet), commands/index.html toonde 39/41 (shortcuts+welcome ontbraken incl. JSON-LD), blogs beloofden ps/top/uname/curl/chmod-oefening. Spook-commands leven vooral in marketing/SEO-copy die niemand tegen de registry checkt.
- Simulator-only markers uit één bron — `SIMULATOR_COMMANDS` stond 2× gedupliceerd (help.js + onboarding.js) en miste `hint`/`shortcuts`; named-export in onboarding.js + import in help.js. Een command dat zelf `[HACKSIM]` roept maar geen `*` krijgt in `help` is een tell.
- Bewust-NIET met reden vastleggen — help-system categorie-lijsten registry-derived maken (nu correct, refactor te breed) + `hostname`/`uptime` in de stress-test (dekt command-not-found-pad). Volledig: `docs/sessions/current.md` Sessie 195.

### Sessie 194: Uitgestelde punten — VFS-signature, analytics-guard, [TIP]-marker (05 jul 2026)
⚠️ **Never:**
- Een gemelde bug fixen zonder het codepad te verifiëren — de "dubbele challenge-analytics" bestond niet (`start()` weigert voltooide challenges, `resume()` ruimt ze op → replay onmogelijk); alleen de tutorial-kant had de bug. Eén read voorkwam een overbodige guard + test.
- Een handmatige versie-constante kiezen waar een runtime content-hash kan — `INITIAL_FS_SIGNATURE` = djb2 over `JSON.stringify(initialFilesystem)` elimineert de "vergeten te bumpen"-faalklasse volledig. Werkt alléén omdat fase-content bij *lezen* wordt geïnjecteerd (dynamic-content.js), niet in de boom gebakken — anders reset elke boot.
- Een gedocumenteerde duplicatie negeren bij het patchen — de renderer-marker-mapping staat op TWEE plekken (renderOutput + `_renderLinesInto`; de style-guide waarschuwt er zelf voor) en de eerste patch miste de tweede. Lees de eigen docs vóór je de "ene" plek fixt.
- Versievelden toevoegen zonder migratielogica-consument — de 4 JSON-state-keys hebben `||default`-tolerantie; een versie die niemand leest is dood gewicht (YAGNI tot een veld echt hernoemt).

✅ **Always:**
- Een docs-conflict expliciet beslechten i.p.v. omzeilen — style-guide ("gebruik [?]") vs CLAUDE.md/tone-and-output ([TIP] = canoniek) bestond omdat Sessie 193 renderer-*realiteit* documenteerde i.p.v. het ontwerpideaal. De branch-fix (2 regels) maakt de canonieke docs waar; een sweep had 37 strings + security-warnings geraakt.
- Bij een verworpen stale save: key opruimen + eenmalige gebruikersnotice — anders "reset" het elke boot opnieuw en lijken verdwenen eigen bestanden een bug (`persistence.wasReset` → `[~]`-melding via het bestaande deferred-resume-patroon).
- Document-and-accept is een expliciete deliverable met rationale — multi-tab (dagdeel reconcile vs zeldzaam+zelfherstellend), hint-tier-reset (onzichtbaar), virtual-keyboard (needs device), voortgangsmap (single-slot volstaat) staan nu in troubleshooting.md/current.md; een bewust niet-gebouwde fix zonder vastgelegde reden wordt elke sessie opnieuw overwogen.
- Specs die productie-URL's hardcoden (debug-storage, performance) bewijzen niets voor werkkopie-code — check het `goto`-doelwit vóór je een groene run meetelt. Volledig: `docs/sessions/current.md` Sessie 194.

### Sessie 193: Volledige tutorial-flow-audit — begeleiding + state + omgeving (03-05 jul 2026)
⚠️ **Never:**
- Een viewport-/timing-klacht als een render-gat lezen — bug A/B ("Typ 'next'" naast "gebruik pwd"; stale hervat-tekst boven nieuwe briefing) kwamen niet uit ontbrekende code maar uit dat de deep-link-id pas ná de welcome-render bekend was. De fix zit in *wanneer* je de staat kent (id vóór `terminal.init`), niet in nieuwe UI.
- Eén opslag-slot 3 toestanden laten coderen met te weinig velden — `activeScenario` alleen kon "gepauzeerd" niet van "nooit gestart" onderscheiden; `exit()` wiste daardoor de voortgang terwijl de melding "opgeslagen ... om te hervatten" beloofde. Een `active`-boolean lost het op (oude saves = actief = backwards-compatibel), geen tweede slot/migratie.
- `resume()` laten early-returnen vóór het laden van `completedScenarios` — voltooide missies + `tutorial cert` raakten na één reload permanent kwijt (eerstvolgende `_save()` schreef `[]` naar disk). Laad afgeleide staat die je altijd nodig hebt vóór de guard.
- first-occurrence-index-vergelijking gebruiken voor volgorde-eisen — sql-sleuth/attack-chain werden permanent onwinbaar bij één verkeerde-volgorde-poging. Monotone first-index = lock; gebruik "geordende subsequence ergens in de log".
- Een byte-`sed` vertrouwen voor een string-sweep met quotes — `s/Type '/` miste `Type \'next\'` (backslash-byte ertussen). Een regex die `\\?['"]` toestaat ving alle ~90; verifieer met een na-grep.

✅ **Always:**
- Bij output-vs-verhaal-conflict het verhaal naar de wereld buigen als de wereld pedagogisch juist is — `/etc/shadow` "Permission denied" is correct + consistent met cat.js' eigen "restricted!"-tip; de tutorial-tekst werd eerlijk (permission-denied = leermoment) i.p.v. een globale VFS-mutatie die "shadow leesbaar" zou lekken.
- De duurzame omgevings-fix is een fixture, niet een validator-patch — één `setup(vfs)`-hook per scenario (bij verse start, NIET resume) normaliseert cwd + ruimt run-artefacten op + herstelt gewiste read-targets getrouw uit `initialFilesystem`, en neutraliseert zo F+G+M ineens. Validators per stap najagen = dweilen.
- Bij "maak de héle flow perfect": twee lagen auditen — begeleiding (CTA/state/markers) én omgeving (VFS/persistentie/sessies/mobile). De zwaarste bugs (permanent verlies, gegarandeerde herhaalrun-strand) zaten in de omgevingslaag, niet in de gemelde symptomen.
- Marker-hiërarchie is bewust maar moet gedocumenteerd + consistent: `[~]` dim = staande uitnodiging, `[?]` blauw = hint-inhoud. Trek outliers gelijk ([[feedback_nl_copy_dejargon]] geldt ook voor markers) en leg de renderer-waarheid vast (`[TIP]` heeft géén branch → is NIET cyaan). Volledig: `docs/sessions/current.md` Sessie 193.

**Rotation:** Top-6 huidig: 193-194-195-196-197-198 (Sessie 192 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie Sessie 195 UITGEVOERD:** current.md staart Sessie 180-184 geknipt naar `archive-s180-s184.md` (5 entries, byte-geverifieerd); current.md houdt nu het rolling window 185-195 (11 entries; volgende bulk-rotatie Sessie 200 → archiveer oudste ~5). SESSIONS.md-index gesynct. Historie 81-179 → `archive-s175-s179.md` + `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

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
**Sessie counter:** 198

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

**Last updated:** 08 jul 2026 (Sessie 198 — Launch-readiness, 3 workstreams. WS1 (code live): funnel-audit + 2 launch-events (`terminal_cta_click` + `terminal_activated`), self-test 0 missing, NEW `launch-success-metrics.md`. WS2/WS3: NEW `demand-validation-protocol.md` + `value-prop-and-retention.md` (bewust niet live). Cache `main.js v=202`. Volledig: `docs/sessions/current.md`)
**Version:** 5.72 (Sessie 198 — Launch-readiness 3 workstreams (funnel-code + 3 launch-docs) in 3 commits; volledige historie: `docs/sessions/current.md` + TASKS.md)

