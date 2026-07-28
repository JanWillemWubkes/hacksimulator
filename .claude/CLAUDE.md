# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 202)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 12 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125; +2 posts Sessie 160)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E ~240 tests / 28 spec files (Chromium, Firefox, WebKit) | WCAG AAA | 182+27 CSS variables (main.css + landing.css)
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

### Sessie 202: Mobiele kolom-uitlijning + box-truncatie in terminal-output (28 jul 2026)
⚠️ **Never:**
- Een gemelde layout-bug fixen zonder de gedeelde util erachter te checken — de reset-menu-collapse was één symptoom; de hoogste-waarde-bug (`asciiBox.wrap()` kápte *waarschuwingstekst* af met `...` in álle 5 SECURITY WARNING-boxen op mobiel) zat in de util die de gemelde commands voeden, niet in de gemelde output. Grep de callers (`boxText`/`lightBoxText`) vóór je concludeert dat het één command is.
- Een fix in de draaiende app verifiëren als de module relatief-geïmporteerd is zónder `?v=` — geen build-stap + `asciiBox.js` zonder cache-bust → de browser serveerde de oude versie (in-app render toonde nog `...`). `import('/src/…?cb='+Date.now())` in `browser_evaluate` raakt het bestand-op-schijf en draait het échte codepad (Sessie 200-techniek).
- Elke regel in een box blind woord-wrappen — `wordWrap` collapse't leidende + uitlijn-spaties, wat desktop-inspringing sloopt. Alléén regels die de breedte *overschrijden* herwrappen; passende regels verbatim → geen desktop-regressie.
- Een twee-koloms-menu "redden" met alleen hanging-indent — `data-indent` lijnt continuatie uit, maar de beschrijving blijft als sibling-item lezen (precies de screenshot). Echte fix = stapelen met diepere indent + blank-line-groepering.

✅ **Always:**
- Onderscheid "echt kapot" van "degradeert acceptabel" — reset-menu (twee zware kolommen) = kapot; `label ← glosse` met ≥3 leidende spaties wordt al door de hanging-indent gered → ongemoeid (`metasploit`/`hydra`). Proportioneel, geen sweep-om-de-sweep ([[feedback_proportional_effort_hobby]]).
- Een crash-footgun fixen óók als 'ie onbereikbaar is, mits goedkoop — box-titel-`RangeError` (`horizontal.repeat(negatief)` bij titel > boxbreedte) is prod-onbereikbaar (man/help vertakken op `isMobileView()` → desktop-only), maar 1 regel `label.slice(0, width)` zet crash → graceful. Crash ≫ cosmetisch.
- Beslis als expert i.p.v. optiemenu bij techniek — systemische renderer-reflow-heuristiek verworpen (ASCII-art/code-blokken/authentieke tool-output hebben óók multi-spaties die je niet mag herschikken; Sessie 196: bevries aan de bron, filter niet de output) → gerichte per-output-fixes. Scope-omvang wél aan Heisenberg gevraagd (dat is een product-keuze) ([[feedback_expert_decisions]]).
- Meet mobiel objectief — Playwright 375px: `overflowCount` via `scrollWidth>clientWidth`, page-scroll via `scrollX`/`bodyScrollW`, box-randuitlijning via `[...new Set(rows.map(r=>r.length))]` (alle regels exact `width+2`). Niet op het oog.

### Sessie 201: Koppen sitebreed naar Nederlands zinskapitaal i.p.v. Engelse Title Case (26 jul 2026)
⚠️ **Never:**
- Een heading-regex over de hele file laten lopen zonder `<style>`/`<script>` te maskeren — `woordenlijst.html` heeft letterlijk `<h3>` in een CSS-comment ("de categorie-`<h3>` erachter"); zonder sluit-tag liep `<h[1-4]>.*?</h[1-4]>` door tot de échte `</h1>` en verminkte het style-blok + de JSON-LD. Maskeer literal-blokken eerst; verwerk JSON-LD (`headline`/`name`) met eigen string-patronen. De gevaarlijkste bug zit in de bestandsklasse die je het laatst test (blogs hadden geen inline-`<style>`, dus dit dook pas op de hoofdpagina's op).
- Een bulk-tekst-transform blind toepassen zonder per-batch dry-run-review — elke batch onthulde een randgeval dat een `sed` had gesloopt: "Nederland"→"nederland" (landennaam mist in whitelist), "IT-kennis"→"it-kennis" (acroniem-in-compound → hyphen-bewust casen), "vs."→valse zin-grens (afkorting-punt), "-sV"→"-sv" (nmap-vlag in `<code>` → code-inhoud letterlijk laten), "5 Essentiële" (getal-first mag volgend woord niet kapitaliseren). Dry-run print + eigen ogen vóór het schrijven.
- Command-namen als kop kapitaliseren — op `commands/index.html` zijn de koppen de command-namen zelf (`<h2>nmap</h2>`); die tik je letterlijk, dus klein houden. Skip enkel-lowercase-woord-koppen; whitelist commands (pwd/ls/…) als lowercase + nooit-forceren zodat ze ook aan het regelbegin klein blijven.
- Een titelwijziging in de zichtbare `<h1>` doen zonder de afgeleide cluster — per blog-artikel leeft de titel op 7 plekken (`<title>`, og, twitter, JSON-LD `headline`, breadcrumb `name`, `<h1>`, blog-index-kaart); alleen de `<h1>` fixen laat de gestructureerde data divergeren. Beweeg ze in lockstep (zelfde bronstring → zelfde output).

✅ **Always:**
- Nederlands zinskapitaal in koppen: 1e woord + eigennamen hoofdletter, de rest klein — óók Engelse vaktermen ("brute force"/"social engineering") tenzij echte eigennaam ([[feedback_dutch_sentence_case_headings]]). Behoud: merken (Metasploit/Nmap/OWASP Top 10), nationaliteitsadjectieven (Nederlandse/Engelse), camelCase-API's (localStorage), acroniemen, officiële namen (OWASP-categorieën, certificeringen). Na `:` klein; na `?`/`!`/`.`-met-spatie nieuwe zin; sectienummer "2.1" kapitaliseert het volgende woord, kardinaal "5 tools" niet.
- Idempotentie als verificatie van een bulk-transform — tweede pass = 0 wijzigingen bewijst consistentie én dat niets is gemist. Aangevuld met `git diff` collateral-scan (leeg = alleen koppen geraakt), browser-render van de gemelde pagina, en de pre-commit blog-JSON-LD/tag-balans-hook.
- 518 inserts / 518 deletes bij een grote diff = een sterke tell dat het puur tekst-casing is, 0 structuur — precies wat een hoofdletter-pass hoort te produceren.
- Script > handwerk zodra een taak mechanisch-van-omvang maar oordeelsgevoelig is (~340 koppen, whitelist per kop) — één zorgvuldig script + één centrale diff-review verslaat 340 losse edits, dwingt consistentie af (Nederlandse/Engelse behouden hun hoofdletter terwijl "brute force" klein wordt) en geeft één controlepunt. Mits de review grondig is ([[feedback_proportional_effort_hobby]]).

### Sessie 200: Command-output-audit (item #47) afgerond — Fase 3 triviale correctheid-nits (26 jul 2026)
⚠️ **Never:**
- Een string-fix via de volle UI verifiëren als een directe module-import het codepad exact raakt — de typewriter, consent-modal en FocusTrap staan tussen jou en de `execute()`-output. `import()` van de command-module in de browser + een stub (`vfs.copy` die "No such file" gooit) of een passende target (`nmap` op `secure-*` → de 443-only-tak) draait de échte tak zonder ceremonie. Meet het gedrag, niet de scherm-heuristiek ([[reference_renderer_marker_collision]]).
- Een `replace_all` afvuren zonder de reikwijdte vooraf te bewijzen — een `grep -rn "kopieren" src/` toonde exact 2 treffers, beide in `certificates.js`, dus file-scoped replace-all kon niet over-reachen. Zonder die grep is het een gok.
- Werk claimen dat een andere context deed — Fase 1+2 + de metasploit-cleanup landden in eerdere same-day commits (`f65c93d`/`0a256ad`/`f56d886`); deze conversatie deed alleen Fase 3. In het sessielog staan de andere fases als committed context, niet als geclaimd werk (protocol: her-leid niet wat de git-historie al vastlegt).

✅ **Always:**
- Onvertaalde vakterm uniformeren op de glosse die de eigen manPage al gebruikt — `nmap:220` glosst "attack surface mapping" al met "aanvalsoppervlak"; de 2 losse "attack surface"-regels trekken daarheen (onzijdig "minimaal", niet "minimale"). Het slecht-geval ("meer ingangen voor aanvallers", `:162`/`:235`) blijft z'n eigen register houden — niet mee-uniformeren.
- Een interne inconsistentie tussen sibling-commands sluiten, niet één kant willekeurig kiezen — `cp.js` "De bronbestand" week af van `mv.js` "Het bronbestand" (onzijdig correct); de bestaande correcte kant is de norm.
- De diff tegen de intentie houden — `git diff` toonde exact 5 regels in/uit, precies de 4 doelen, met de bewust-ontziene code-comment (`:53`) en slecht-geval-regels ongemoeid; geen collateral.

### Sessie 199: Marketing-launch uitvoeren — verse launch-week-post + launch-beslissing (22-26 jul 2026)
⚠️ **Never:**
- Een blogpost toevoegen zonder de afgeleide administratie mee te bewegen — filesystem-ground-truth-validatie trekt automatisch 4 checks uit sync: blog-count in de TASKS-tabel (6b), RSS-item-count == `blog/*.html` minus index (9b), sitemap `lastmod >= datePublished` (9a) en bundle blog KB ±5% (5). Drift-bestendig = nieuwe content valt nooit stil buiten beeld, maar je moet tabel/feed/sitemap/marker expliciet bijwerken.
- Een verse post future-daten op de launch-dag — live zetten op 22 jul met `datePublished` 29 jul = Google wantrouwt future-dated artikelen + botst met de "nooit datums faken"-discipline. De echte deploy-dag (22 jul) is eerlijk én op de launch (29 jul) veruit de verste post = precies de freshness die het runbook wil.
- Een juridische strafmaat zelf verzinnen — `metasploit.js` noemt "6 jaar" (warning) + "Federal Computer Fraud Act, 10 jaar" (US, manPage), beide ongeschikt voor NL-blogcopy. De 8 bestaande posts citeren art. 138ab Sr zónder getal; die framing mirroren ([[feedback_verify_claims_against_artifact]]).
- Een weekdag/datum uit het hoofd claimen — ik noemde "wo 23 jul (morgen)" terwijl 22 jul zélf woensdag was. Altijd `date -d YYYY-MM-DD +%A` vóór een planning ([[feedback_verify_calendar_dates]]).

✅ **Always:**
- De niet-datumgevoelige cornerstone-waarde nu doen, de rest voor launch-dag — interne links naar de nieuwe post vanaf posts die 'm natuurlijk noemen (cybersecurity-tools had al een Metasploit-sectie; nmap = recon→exploitation) geeft meteen SEO-winst; de bredere Fase-2 date-align blijft Heisenberg's launch-dag-taak. Twee posten getoucht met eerlijke datums i.p.v. de hele set forceren ([[feedback_proportional_effort_hobby]]).
- Een gepoorte beslissing als afwijking loggen, niet wegredeneren — demand-validatie (#44) bewust overgeslagen op Heisenberg's keuze; in TASKS.md gemarkeerd als expliciete afwijking (launch-data vervangt het validatiesignaal) i.p.v. de poort stil te laten vallen ([[feedback_preserve_plan_gates]]).
- Stappen die de gebruiker moet uitvoeren horen in een blijvend repo-bestand — het plan in `~/.claude/plans/` is sessie-scoped en kan opschonen; NEW `docs/launch-checklist.md` is de duurzame single-source (Heisenberg vroeg letterlijk "hoe vind ik de stappen terug?").
- Een nieuwe blogpost modelleren op een bestaande (nmap) — erft automatisch alle conventies (JSON-LD Organization-auteur, breadcrumbs + BreadcrumbList, consent-model-CTA's, blauw palet, div-balans) → validate-blogs 15/15 in één keer. Volledig: `docs/sessions/current.md` Sessie 199.

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

**Rotation:** Top-6 huidig: 197-198-199-200-201-202 (Sessie 196 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie Sessie 200 UITGEVOERD:** current.md staart Sessie 185-189 geknipt naar `archive-s185-s189.md` (5 entries, 179 regels); current.md houdt nu het rolling window 190-200 (11 entries; volgende bulk-rotatie Sessie 205 → archiveer oudste ~5). SESSIONS.md-index gesynct. Historie 81-184 → `archive-s180-s184.md` + `archive-s175-s179.md` + `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

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
**Sessie counter:** 202

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
- **Skills:** `.claude/skills/` — `blog-post` (blog toevoegen + admin-lockstep + script-gate), `verify-terminal` (real-codepath-import + 375px-meting), `new-command` (8-staps checklist-flow + test-gate)
- **Agent:** `nl-content-reviewer` (read-only NL-copy/tone/kop-review) | **Hook:** `.claude/settings.json` (PostToolUse → `validate-blogs.sh` op blog-edits)
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 28 jul 2026 (Sessie 202 — Mobiele kolom-uitlijning + box-truncatie in terminal-output (commit `fe27a17`, gepusht): reset-menu + nikto-headers gestapeld (+2 `\n`-plak-bugs), hashcat ←-glosse op eigen regel, `asciiBox.wrap()` woord-wrapt i.p.v. afkappen (5 SECURITY WARNING-boxen kápten tekst af op mobiel), box-titel-RangeError afgevangen. Man-pages buiten scope. Volledig: `docs/sessions/current.md`)
**Version:** 5.76 (Sessie 202 — Mobiele kolom-uitlijning + box-truncatie: reset-menu/nikto-headers gestapeld (+2 `\n`-bugs), hashcat-glosse eigen regel, `asciiBox.wrap()` wrapt i.p.v. afkappen (5 warning-boxen), box-titel-crash-guard; 1 commit `fe27a17` gepusht; volledige historie: `docs/sessions/current.md` + TASKS.md)

