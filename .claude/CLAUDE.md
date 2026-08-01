# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 205)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 14 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125; +2 posts Sessie 160)
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

### Sessie 205: Box-reflow bij venster-resize + submodule-cache-val (01 aug 2026)
⚠️ **Never:**
- Een submodule-fix verifiëren tegen een warme browser — `?v=` zit alléén op de entry-points (`main.js`/`main.css`); de ~99 relatief geïmporteerde modules dragen er géén, dus een entry-bump bust ze niet en `must-revalidate` grijpt pas ná `max-age`. Dit kostte 3 valse diagnoses (fix stond op schijf, browser draaide oud) én verklaarde waarom de Sessie 204-fixes terugkerende bezoekers nooit bereikten (gemeten: gecachete `box-utils` 41 chars vs server 62). Verifieer met een **no-store server** of `import('…?cb='+Date.now())`.
- Een `isMobileView()`-guard gebruiken om "desktop-only" gedrag af te bakenen — een half-gesnapt desktopvenster is 683/720px en valt ónder de 768-drempel, precies het gemelde scenario. Laat de datavorm de guard zijn (hier: de aanwezigheid van box-blokken; mobiel rendert borderless → parser vindt niets → no-op).
- Defensieve heuristiek toevoegen zonder te bewijzen dát je 'm nodig hebt — mijn layout-wijziging-detectie bleek bij gericht uittesten overbodig (de `resizing`-vlag volstond in Chromium/Firefox/WebKit) en is geschrapt. Simpelste versie die werkt + een test die de aanname bewaakt ≫ permanente defensieve code.
- `wordWrap()` op inhoud met inspringing loslaten — `split(' ')` eet leidende spaties, óók op part 0. Indent apart bewaren en elke part her-prefixen, zoals alle box-producers zelf al doen.

✅ **Always:**
- Reproduceer het gemelde scenario mét de oude code vóór je claimt dat je het oploste — het screenshot-scenario gaf 69 boxregels / 69 wraps op productie, en 0 wraps met de reflow. Daarmee was hard te beantwoorden dat dit géén dubbel werk was: Sessie 204 gaat over verse render, dit over reflow van bestaande output (disjunct). Bijvangst: de 204-fix maakte het symptoom zichtbaarder, want de oude Inter-mismeting maakte boxen ~35% te smal = toevallige speling.
- "Live geverifieerd" moet het hele afhankelijkheidsoppervlak dekken, niet alleen het gewijzigde artefact — Sessie 204 checkte het font (CSS-entry mét `?v=` = vers) maar niet de JS-modules (stale). Halve verificatie leest als volledige.
- Bij DOM-mutatie naast lopende animaties: muteer alleen child-regels, nooit de wrapper (`_revealCelebration` houdt referenties + opacity-state op `.terminal-completion-*`), en herstel scroll met `behavior:'instant'` — `animations.css` zet `scroll-behavior:smooth` op `#terminal-output`, wat elke `scrollTop`-toewijzing in een animatie van honderden ms verandert (vertroebelt ook je metingen).
- Een "by design"-verklaring is een productkeuze, geen technische — Sessie 204 verklaarde niet-reflowen tot echte-terminal-gedrag; verdedigbaar, maar in een browser-leeromgeving weegt leesbaarheid bij venstermanipulatie zwaarder. Zulke keuzes horen bij Heisenberg ([[feedback_expert_decisions]] geldt voor techniek, niet voor scope).

### Sessie 204: Box-omlijning brak op tussenbreedtes — corrupte box-font + meetfouten (31 jul 2026)
⚠️ **Never:**
- `document.fonts.check()` als bewijs dat een font laadt — geeft true óók bij `FontFace.status === 'error'` (gemeten); zo bleef de corrupte inline 'JetBrains Mono Box'-embed **120 sessies** (sinds Sessie 83) onzichtbaar terwijl alle box-glyphs via OS-fallbacks met afwijkende advances renderden. Assert `fonts.load(...)` + `status === 'loaded'`.
- `scrollWidth <= clientWidth` als overflow-assert op `#terminal-output` — `overflow-x:hidden` + `pre-wrap` laat te brede regels wrappen, nooit scrollen → de check kan structureel niet falen (vals-groen op precies deze bug-klasse).
- Rect-`top`-vergelijking of `rects.length` als visuele wrap-detector — inline spans (`marker-arrow` heeft `vertical-align:.2em` = 3.6px) verschuiven rects op één visuele regel → 11 gemeten vals-positieven. Element-hoogte > 1.5× line-height is immuun (echte wrap verdubbelt de hoogte); rood-op-mutant bewezen.
- Een meting "correct maken" vóór de bovenliggende bugs gefixt zijn — de Inter-op-container-mismeting *onderschatte* de kolomcapaciteit ~35% en redde brede desktops toevallig; eerst correct meten had de boxen juist óp de rand gezet. Fix-volgorde was bindend: font → breedte-contract → meting.

✅ **Always:**
- Font-embeds byte-diffen tegen het bronbestand — 2 corrupte b64-chars in 6936 maakten de hele woff2 onbruikbaar (brotli is niet fout-tolerant), maar `@font-face` faalt stíl naar een visueel bijna-identieke fallback; alleen de metriek verraadt het. Borderregels (één ononderbroken glyph-run zonder breekpunten) wrappen dan als eerste, per machine anders.
- Meet op het element waar de tekst écht rendert — `#terminal-container` erft `--font-body` (Inter); `#terminal-output` heeft `--font-terminal` én `clientWidth` exclusief de eigen scrollbar. Plus `charWidth = max(measureText('M'), '─', '━')`: canvas respecteert `@font-face` unicode-range, dus dit meet de echte subset-advance — die max had deze hele bug gevangen.
- Oude output die na venster-resize breekt = by-design (echte terminals reflowen ook niet; gereproduceerd: 68/68 wraps oud, 0/12 vers) — test-consequentie: na viewport-resize het command opnieuw uitvoeren, nooit oude output meten.
- Sessienummer-ambiguïteit (eerdere zelfde-dag-context labelde "Sessie 204" in TASKS.md maar rondde `/summary` nooit af): nummer overnemen + dat werk als committed context loggen, niet claimen (Sessie 200-protocol) en niet hernummeren.

### Sessie 203: GEO/AEO — vindbaarheid in AI-zoekmachines (31 jul 2026)
⚠️ **Never:**
- Nieuwe content plannen vóór je audit wat er ál zichtbaar staat zonder schema — de homepage had 8 zichtbare FAQ-vragen zónder FAQPage JSON-LD; die vondst maakte de geplande aparte FAQ-pagina overbodig (nav/footer JS-injected + noscript in ~24 files = 20× de kosten voor hetzelfde AEO-voordeel).
- Een AI-crawler-stanza in robots.txt met alléén `Allow: /` — een specifieke User-agent-groep erft níéts van de wildcard (RFC 9309), dus zonder herhaalde Disallows open je per ongeluk /docs/ voor die crawlers. Multi-UA-groep (12 agents, 1 gedeelde regelset) is compact én correct.
- HowTo-schema op niet-stapsgewijze content forceren — nmap/hashcat/sql-injection-lijsten zijn alternatieven/uitleg, geen stappen; alleen wireshark (5-staps) en metasploit (7-staps) hebben échte `<ol>`-workflows. Fake-HowTo schaadt de geloofwaardigheid van álle schema op de site.
- 56 JSON-LD-objecten met de hand overtikken — scriptmatig genereren uit de zichtbare markup (glossary-term-blokken parsen) = geen typo's + herhaalbaar bij term-wijzigingen ([[feedback_proportional_effort_hobby]]: script > handwerk zodra mechanisch-van-omvang).

✅ **Always:**
- Schema-bij-zichtbare-content verbatim + lockstep-bewaakt — FAQ-antwoorden letterlijk uit de zichtbare `<p>`'s (alleen tags gestript), en de nieuwe DefinedTerm-count-check in `validate-docs.sh --deep` (JSON-LD == zichtbare `<dt>`-count, rood-op-mutant bewezen vóór vertrouwen). Zelfde discipline als de blog-titel-7-locaties-lockstep.
- Eerlijk zijn over wat on-page GEO wél/niet doet — het maakt je *citeerbaar*, niet *gekozen*: AI Overviews citeert ~97% uit de organische top-20, Perplexity leunt op Reddit (~47%), ChatGPT-retrieval draait op Bing. De zwaarste hefboom (externe vermeldingen, Bing Webmaster) is een Heisenberg-actie en staat zo in checklist-§5, niet weggemoffeld achter de code-wins.
- "Zorg dat dit gebeurt" eindigt bij live-verificatie, niet bij de push — eerste curl gaf 404 (Netlify nog bezig); achtergrond-recheck na 90s bewees llms.txt 200 + nieuwe robots.txt op productie.
- llms.txt-URL's tegen het filesystem verifiëren vóór commit — elke link in het LLM-overzicht moet naar een bestaand bestand wijzen; 20/20 gecheckt met één grep-loop.

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

**Rotation:** Top-6 huidig: 200-201-202-203-204-205 (Sessie 199 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie Sessie 205 UITGEVOERD:** current.md staart Sessie 190-194 geknipt naar `archive-s190-s194.md` (5 entries); current.md houdt nu het rolling window 195-205 (11 entries; volgende bulk-rotatie Sessie 210 → archiveer oudste ~5). SESSIONS.md-index gesynct. Historie 81-184 → `archive-s180-s184.md` + `archive-s175-s179.md` + `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

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
**Sessie counter:** 205

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
- **Agents:** `nl-content-reviewer` (read-only NL-copy/tone/kop-review) | `seo-auditor` (read-only technische SEO: meta/og↔twitter-pariteit, JSON-LD↔H1-lockstep, interne-links/orphans, sitemap-hygiëne) | **Hook:** `.claude/settings.json` (PostToolUse → `validate-blogs.sh` op blog-edits)
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 01 aug 2026 (Sessie 205 — Box-reflow bij venster-resize (NEW `src/ui/box-reflow.js`, shrink-only, geen mobiel-guard) + structurele submodule-cache-fix: `_headers` 7 dagen → 1 uur want `?v=` bust alleen entry-points, waardoor de Sessie 204-fixes terugkerende bezoekers nooit bereikten. 3 commits `017d872`/`875399d`/`b02d193`, gepusht + live geverifieerd. Volledig: `docs/sessions/current.md`)
**Version:** 5.79 (Sessie 205 — box-reflow bij resize + submodule-cache-val gefixt (`max-age=3600` + `_formatText`-fallback + rules-notitie); 276 boxregels @640px = 0 wraps, suite 243 passed, reflow-test groen op 3 engines; volledige historie: `docs/sessions/current.md` + TASKS.md)

