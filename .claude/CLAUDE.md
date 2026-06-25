# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 179)
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

### Sessie 179: Klantgerichte copy-perfectionering — footer/hero/"authentiek"-sweep (25 jun 2026)
⚠️ **Never:**
- Toegankelijkheid framen met een demografisch label ("voor absolute beginners", "studenten en overstappers") — dat zet een *plafond* i.p.v. een vloer: het sluit de enthousiasteling/hobbyist uit en leest als "alleen voor newbies". De footer was zelfs smaller dan de hero. Frame de *instap* ("van je eerste command tot..."), niet het publiek.
- Een geruststelling schrijven die fysiek onwaar is — "los van je eigen computer en het echte internet" klopt niet (de simulator draait op de machine van de gebruiker, via internet). De veiligheid zit in de *gesimuleerde uitvoering*, niet in isolatie. Verifieer copy tegen de werkelijkheid, niet tegen wat lekker klinkt (product-kwaliteitsregel).
- Een woord blind repo-breed vervangen — "authentiek" droeg twee claims ("authentieke *commands*" afgekeurd vs "authentieke *ervaring*" legitiem); een sed-replace had de legitieme variant gesloopt (zelfde homonym-valkuil als de Sessie-177 `[X]`-marker).

✅ **Always:**
- Bij een copy-fix die elders kan voorkomen: eerst grep-inventariseren + per-treffer op betekenis categoriseren, dán vervangen — sluit af met een eind-assertie (0 user-facing treffers; alleen de bewust-behouden variant blijft).
- H1/`<title>`/OG met rust laten bij subtitle-werk — die dragen de SEO-alignment; perfectioneer de subtitle eromheen.
- Cache-bump alleen waar gerenderde output verandert: een dynamisch geïnjecteerde footer (JS) heeft 2 cache-lagen nodig (de import in `init-components.js` + de `<script>`-tag in 24 pagina's); HTML-only tekstedits géén bump.
- Render-en-meet als bewijs ook voor "triviale" tekst: no-store server + DOM-check (meta-content + zichtbare elementen) in dark/light/mobiel. Geheugen `feedback_audience_floor_not_ceiling`. Volledig: `docs/sessions/current.md` Sessie 179.

### Sessie 178: Homepage lead-magnet — sectie-reorder + glow-fix + copy-perfectionering (24 jun 2026)
⚠️ **Never:**
- Een sectie verplaatsen zonder rand-afhankelijke effecten na te lopen — de `.final-cta`-glow zat verankerd op `at 50% 100%` (onderrand) om in de aangrenzende band over te lopen; de lead-magnet ertussen schuiven liet hem hard afgekapt "uit het niets" zweven. Gradients/borders op sectiegrenzen kunnen stil breken bij elke DOM-herschikking.
- Lead-magnet/sample-copy "mooier" maken op gevoel — de oude subtekst noemde echte features ("beslisboom") maar in onverklaard jargon (Fase 0 / reconnaissance) dat een nieuwe bezoeker niet kan plaatsen. Verifieer copy tegen de échte PDF-inhoud, niet tegen de oude tekst (product-kwaliteitsregel).
- Een "Direct beginnen?"-kop op een email-gated PDF terwijl de écht directe actie (terminal, geen account) eronder staat — belofte-inversie t.o.v. werkelijke frictie, leest als bait-and-switch en botst met de nuchtere/eerlijke toon.

✅ **Always:**
- Bij een staart-herschikking: primaire conversie krijgt het climax-moment (terminal-CTA direct na de FAQ-payoff "Hoe begin ik?"), secundaire email-asks (PDF + nieuwsbrief) clusteren in de tail.
- Rand-afhankelijke effecten chirurgisch scopen met `:has(+ .lead-magnet)` → alleen de gebroken homepage-case raken, de 4 andere `final-cta`-pagina's (over-ons/woordenlijst/commands/contact) met rust laten.
- HTML-only tekstwijzigingen hebben géén `?v=`-cache-bump nodig (anders dan CSS/JS); een CSS-comment-only edit evenmin (geen render-effect). Bump alleen waar gerenderde output verandert, en dan minimaal (alleen `index.html` voor een homepage-only regel).
- Copy de-jargonen door termen te vertalen naar concrete stappen (toestemming, scope, doelwit verkennen) + het "waarom" (de stap die beginners overslaan), feitelijk gedekt door de sample. Volledig: `docs/sessions/current.md` Sessie 178.

### Sessie 177: Terminal voltooid-markers [X]→[✓] — systemische rode-checkbox-botsing op mobiel (22 jun 2026)
⚠️ **Never:**
- Een content-token gebruiken dat toevallig een renderer-marker is — `[X]` als "afgevinkt"-vinkje botst met de error-marker (`renderer.js:101`: regel die na trim met `[X]` begint → rood). Op mobiel zichtbaar rood + doorlek naar ingesprongen regels (≥3 spaties = continuation-line erft de kleur erboven); desktop verbergt het via het `│`-kader. Gebruik `[✓]` (success/groen) voor voltooid, nooit `[X]`.
- Een globale `[X]→[✓]`-replace draaien zonder inventaris — `[X]` heeft 3 betekenissen: voltooid-checkbox (de bug), échte fout ("Onbekende challenge/scenario"), én "NOOIT doen"-lijsten in security/netwerk-man-pages. Bij die laatste twee is rood juist; blind vervangen had de waarschuwing omgekeerd ("`[✓] password`").
- "Het is rood" claimen zonder de voltooide staat te triggeren — de eerste mobiele probe toonde 0 rood omdat niets afgevinkt was; pas ná `challenge status` met 1 met-requirement werd het rood gemeten. Trigger de staat die de bug toont, meet niet de lege staat.

✅ **Always:**
- Renderkleur verifiëren via class + `getComputedStyle().color` op een no-store server (Python `http.server` cachet ES-modules → vals-negatief). Gemeten: `[✓]`=`#3fb950`(dark)/`#008844`(light), `[ ]`=normal/wit, fouten nog `error`/rood, regels ónder een groene regel wit (doorlek weg).
- `[✓]` is 3 chars = 1 monospace-cel → desktop-box-uitlijning blijft pixel-exact (`allSame` len 69 + screenshot bevestigd); daarom het symbool overal gelijktrekken i.p.v. mobiel/desktop splitten.
- Eén renderer-conventie = systemische bug: dezelfde `[X]`-checkbox zat in 6 voortgangsweergaven (leerpad/challenge/achievements/tutorial/next). Repo-brede `grep "'\[X\]'"` + categoriseren vóór je "klaar" claimt.
- In een legenda (uitleg, geen status) de glyph **achteraan** zetten (`Voltooid   [✓]`) → geen marker-match aan regelbegin → neutraal wit, geen doorgeërfde kleur. Volledig: `docs/sessions/current.md` Sessie 177.

### Sessie 176: Mobiele audit + 5 fixes — tabel-overflow, CSP/consent-gap, emoji, tap-targets, scroll-hint (21 jun 2026)
⚠️ **Never:**
- Een tap-target-"fix" bouwen op een ongemeten aanname — ik claimde de blog-filterknoppen ~20px (mobiel) en bumpte ze; meting ná implementatie toonde 27px/42px = al ≥24px AA → onnodig, en mijn `inline-flex` voegde een display-neveneffect toe. Teruggedraaid. "Meten wint van oogwerk" geldt óók over je eigen premisse: meet vóór je fixt. → geheugen-lijn met `feedback_verify_claims_against_artifact`.
- Een CSP-console-error als cosmetisch afdoen — de geblokkeerde inline-`<script>` op blogpagina's bleek de Consent Mode v2 defaults: `gtag` undefined, `dataLayer` leeg, AdSense laadde zónder `denied`-defaults = echte GDPR-gap op de hoogste-organische-traffic-pagina's. Meet de runtime (dataLayer/gtag-type) vóór je "onschuldig" concludeert.
- Aannemen dat een eerdere migratie compleet was — de Sessie-166 inline-script-externalisatie miste de hele `blog/`-map (11 pagina's om, 14 vergeten). Een repo-brede grep (`consent-default.js` vs inline `gtag`) legde de split bloot; vertrouw niet op "dit is overal gedaan".
- Een mobiele scroll-defect "op het oog" diagnosticeren — de scroll-hint leek "achter de balk", maar `--z-terminal:1` < hint `z-index:2` betekent dat hij technisch erbóven ligt; de echte oorzaak was een collisie met de naar 2 rijen (gemeten 109px) wrappende quick-command-balk. Meten wijst de zone aan, niet de z-index-intuïtie.
✅ **Always:**
- Render-en-meet op een `no-store`-server: `scrollWidth` vs `innerWidth` + `getBoundingClientRect`-hoogtes op 375px vóór/ná, dark+light, plus desktop-regressie. Brede tabellen (blog+legal) afgekapt/pagina-overflow → tabel zelf scroll-container (`display:block; overflow-x:auto`) in `@media≤768px` (patroon van `.blog-post-content pre`).
- Niet-in-repo-vergelijkbare claims bewijzen met productie-vs-lokaal runtime-diff: blog vóór (`gtag:undefined`, dataLayer leeg) vs homepage (`gtag:function`, default aanwezig) → fix = extern `consent-default.js` (zet defaults én injecteert AdSense daarná, race-veilig). Lokaal ná: 0 CSP-fouten over 7 pagina's.
- Cache-blast-radius sturen de fix-locatie: scroll-hint-regel in `terminal-education.css` (1 consumer = `terminal.html`) i.p.v. site-brede `mobile.css` → 1 cache-bump i.p.v. ~25. En per-bestand committen wanneer cache-bumps verweven zijn met content (hunk-splitting/`git add -p` niet beschikbaar) — zelfde eindtree, leesbare history.
- Bulk-tekstvervanging afdekken met een eind-assertie: het emoji-script faalde hard op een niet-geïnventariseerde 🎓 (0-emoji-over-check, pijlen/✓✗ uitgezonderd). Contextregels: decoratieve markers weg, `<td>`-emoji weg met behoud Ja/Nee, lijst-`✅/❌` → `[✓]`/`[✗]`. Volledig: `docs/sessions/current.md` Sessie 176.

### Sessie 175: Layout-fixes sample-pentest — chevron/success-state/card-uitlijning (21 jun 2026)
⚠️ **Never:**
- `!important` voorstellen om externe CSS (Brevo `sib-styles.css`) te overschrijven zonder te checken of die regel zélf `!important` gebruikt — curl onthulde `.sib-form-message-panel` (0,1,0) zónder `!important`, dus onze scopes (0,2,0 / 1,1,0) wonnen puur op specificiteit. Heisenberg vroeg terecht om de schonere route. → geheugen `feedback_avoid_important_css`.
- Een layout-misalignment op het oog diagnosticeren — ik zag "card-titel 3 staat lager", maar meting (`getBoundingClientRect`) toonde: titels zijn top-uitgelijnd (`top:861`), de échte afwijking zat in de *body* (900 vs 923) door een 1-regelige titel. Meten wijst de oorzaak aan, het oog niet.
- Een gedeelde module wijzigen zonder de blast-radius te scheiden — `brevo-submit.js` draait op homepage én sample; de form-hide hield ik generiek (verbetering overal), de titel/intro-verberging sample-specifiek (`.newsletter-submitted` + opt-in class). Beide pagina's apart geverifieerd.
- Een CSS/JS-fix "verifiëren" op een Python `http.server` — die stuurt geen cache-headers → de browser draaide de oude gecachete ES-module (vals-negatief, Sessie-171-valkuil). Pas met een `Cache-Control: no-store`-server + verse E2E-browser bleek de fix te werken.

✅ **Always:**
- Externe-CSS-override = specificiteit boven `!important`: reken de specificiteit expliciet uit (`#id` of extra class) en haal desnoods de echte stylesheet op om te bevestigen dat het volstaat. `2lh` voor "reserveer 2 tekstregels" (geen line-height-giswerk; Baseline 2023).
- Scope CSS-fixes dubbel waar gepast: een opt-in modifier-class (`.feature-cards--equal-title` raakt index/gidsen/over-ons niet) + een `@media (min-width:1025px)`-gate (geen witruimte zodra cards niet in één rij staan). Ongescopet had "alles uitgelijnd" 3 pagina's + mobiel ongevraagd geraakt.
- Success-state = formulier vervángen, niet aanvullen: bij succes het form verbergen i.p.v. het paneel erbovenop tonen (anders dubbele kaarthoogte + verweesde CTA). De bevestiging wordt de hele kaart.
- Render-en-meet als bewijs: `getBoundingClientRect` vóór én na (body's 900→923, allemaal gelijk), plus screenshots in dark+light+mobiel + de E2E-test met Brevo-mock (geen echt contact) in een verse browser als definitieve proof. Volledig: `docs/sessions/current.md` Sessie 175.

### Sessie 174: Mobiele PDF-download fix — sample-pentest lead magnet (19 jun 2026)
⚠️ **Never:**
- Een codebase-comment als oorzaak-diagnose vertrouwen — `_headers` zei "force download want webviews kunnen PDF niet inline", maar de échte bug was een Brevo click-tracking-prefetch-404 (aparte laag). Lees de sessie-historie (Sessie 134 had dit al exact gediagnosticeerd) vóór je een oorzaak aanneemt.
- Een `_headers`/repo-tweak presenteren als "de fix" voor de 404 — die ontstaat op Brevo's server (`r.sendibm1.com/?i=<token>`, eenmalig token door Gmail-mobiel-prefetch geconsumeerd) vóór het request ons bereikt → niet in-repo fixbaar. Doen alsof = misleidend.
- `Content-Disposition: attachment` forceren voor "mobiele webviews" — omgekeerd: iOS WKWebview (Gmail/Outlook-app) rendert een PDF wél inline maar kan een geforceerde download vaak níet afhandelen → foutmelding. attachment brak precies de webviews die inline aankonden.
- De Brevo success-span gebruiken voor een persistente CTA, of "we hebben 'm gemaild" claimen onder double opt-in — `brevo-submit.js` overschrijft de span met `json.message`, en de PDF-mail komt pas ná bevestiging (de gebruiker vroeg hier terecht op door).

✅ **Always:**
- Bij een niet-in-repo-fixbare laag: bouw een betrouwbaar pad dat het kapotte mechanisme omzeilt (same-origin download-knop in `#success-message` + noindex `sample-download.html`) i.p.v. doen alsof je het repareert. Eerlijk scheiden: site-fix = gegarandeerd, Brevo-404-fix = best-effort.
- Ungate wat toch al publiek is — de PDF-URL is een raadbaar statisch bestand, dus de email-"gate" bood nooit echte bescherming; on-site ungated leveren wint voor de bezoeker. Maar nieuwsbrief-consent apart double-opt-in houden beschermt de deliverability-investering (Sessies 134-136).
- CSP-bewust toevoegen zonder cache-bump-sweep: inline-style mét CSS-variabele (`style-src 'unsafe-inline'` toegestaan) i.p.v. `landing.css` editen + `?v=` op alle pagina's bumpen; nieuwe tracking via een delegated `data-*`-branch in `cta-tracking.js` (geen inline JS).
- Playwright-versie pinnen op de provisioned browser-build (`@playwright/test@1.56.0` ↔ `chromium-1194`, `--no-save`) + lokale statische server + `BASE_URL=localhost` om tegen niet-gedeployde wijzigingen te testen (config wijst standaard naar productie). Volledig: `docs/sessions/current.md` Sessie 174.

**Rotation:** Top-6 huidig: 174-175-176-177-178-179 (Sessie 173 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Eenmalige catch-up UITGEVOERD (na Sessie 176):** current.md Sessie 81-164 geknipt naar `archive-s081-s120.md` (31 entries) + `archive-s121-s164.md` (47 entries); current.md houdt nu het rolling window 165-178 (14 entries; volgende bulk-rotatie Sessie 180 → archiveer 170-174). SESSIONS.md-index gecorrigeerd; backlog opgeheven → standaard `N%5`-rotatie draait schoon. Historie 81-164 → de range-archieven; pre-Sessie 81 → legacy `archive-*`.

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
**Sessie counter:** 179

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

**Last updated:** 25 jun 2026 (Sessie 179 — klantgerichte copy: footer-tagline "absolute beginners" → traject-framing, hero-subtitle herschreven (demografisch label + onware veiligheidsclaim → "veilige simulatie ... zonder echte gevolgen"; H1 ongewijzigd), "authentieke commands" → "commands uit de praktijk" op 9 user-facing plekken. Volledig: `docs/sessions/current.md`)
**Version:** 5.53 (Sessie 179 — klantgerichte copy-perfectionering: footer-tagline + hero-subtitle + "authentiek"-sweep; volledige historie: `docs/sessions/current.md` + TASKS.md)

