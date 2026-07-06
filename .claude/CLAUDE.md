# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 195)
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

### Sessie 192: Tutorial-voltooiing past in beeld — next-step CTA altijd zichtbaar (02 jul 2026)
⚠️ **Never:**
- Een "fix" accepteren die een klacht *verplaatst* i.p.v. oplost — Sessie 190 (output verborgen) en Sessie 192 (CTA verborgen) zijn dezelfde bug van twee kanten: een completion-blok van ~43 regels/~1300px in een ~830px viewport (1,6×), waarvan je maar één uiteinde kunt tonen. Een top-anker fixt de ene kant en breekt de andere; de wip blijft.
- Een groot inline-artefact laten staan dat de enige actie-instructie onder de vouw duwt — de 20-regelige `CERTIFICAAT`-box zat tússen de `MISSIE VOLTOOID`-box en de next-step CTA; voor een beginner is de CTA het belangrijkste, niet een ASCII-trofee die hij toch al op het klembord heeft.
- Op "ziet er goed uit" vertrouwen voor een viewport-klacht — alleen `getBoundingClientRect` op de échte schermmaat (1920×1080: `echoInView`/`ctaInView`) bewijst dat beide uiteinden nu passen. Een DOM-aanwezigheids-assert (`toHaveCount(1)`) zegt niets over zichtbaarheid.

✅ **Always:**
- Bij een blok groter dan de viewport: maak het blok kleiner dan de viewport i.p.v. eindeloos aan het scroll-anker te sleutelen — dán vervalt de trade-off en zijn beide eisen (output-zichtbaar én CTA-zichtbaar) met één `_scrollToBottom` te vervullen. De duurzame fix zit in de hoogte, niet in de anker-keuze.
- Redundantie eerst verifiëren, dán schrappen — de inline-cert kon weg omdat dezelfde inhoud al op het klembord stond én via `tutorial cert` opvraagbaar was (post-completion IDLE-pad in `tutorial.js` eerst gecheckt). Feature behouden, alleen de dubbele/schadelijke weergave weg (anti-gold-plating).
- Meet in regels/pixels om de wig te vinden — command→CTA in lijnen tellen (~43) tegen viewport (~830px) wees direct de ~20-regelige cert aan als de oorzaak; scherm-echte meting bevestigde de fix objectief.
- Scope tot waar het speelt — challenges hebben géén inline cert (`challenge-renderer.js` levert geen `certificate`-veld; blok past al), dus tutorial-only fixen. Volledig: `docs/sessions/current.md` Sessie 192.

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

**Rotation:** Top-6 huidig: 190-191-192-193-194-195 (Sessie 189 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie Sessie 195 UITGEVOERD:** current.md staart Sessie 180-184 geknipt naar `archive-s180-s184.md` (5 entries, byte-geverifieerd); current.md houdt nu het rolling window 185-195 (11 entries; volgende bulk-rotatie Sessie 200 → archiveer oudste ~5). SESSIONS.md-index gesynct. Historie 81-179 → `archive-s175-s179.md` + `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

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
**Sessie counter:** 195

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

**Last updated:** 06 jul 2026 (Sessie 195 — leerpad-consistentie + brede spook-command-nasweep: NEW learning-path.js single-source (whois/traceroute/find/grep zichtbaar, 6 consumenten), EXPERT-unlock ≥4-van-6 backwards-compat, traceroute-tracking-bug, SIMULATOR_COMMANDS één bron (+hint/shortcuts), wireshark→traceroute + commands-pagina 39→41 + blog-spoken eerlijk, 20 audit-fixes. Cache `v=197`+`v=198`. Volledig: `docs/sessions/current.md`)
**Version:** 5.69 (Sessie 195 — leerpad-fix + 20-punts consistentie-audit in 3 commits; volledige historie: `docs/sessions/current.md` + TASKS.md)

