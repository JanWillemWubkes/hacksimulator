# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 181)
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

### Sessie 181: Content-getallen drift-bestendig — floors i.p.v. exacte tellingen + floor-assertie (26 jun 2026)
⚠️ **Never:**
- Een exact getal hardcoden voor content die groeit (blogposts, commands) in bezoeker-copy — `gidsen.html` "10 Blog posts" was al fout (13 zichtbaar) en "41 Commands" drift bij elke nieuwe command. Exacte getallen verouderen bij élke wijziging; open floors (`40+`/`50+`/`105+`) blijven waar bij groei.
- Een drift-"fix" doorvoeren op de oppervlakkige inventaris zonder tegen de canonieke definitie te toetsen — de subagent vlagde CLAUDE.md "12 posts" als fout ("zou 13") én JSON-LD `numberOfItems:39` als bug; beide waren correct (validate-docs telt canoniek 12 excl. index+welkom; 39 == de zichtbare itemlijst, "40+" = totaal). Blind "fixen" had juist drift/inconsistentie geïntroduceerd.
- Een grep-elk-cijfer-exact-validator bouwen — dat geeft vals alarm bij élke gezonde content-toevoeging = het onderhoudsprobleem terug in een andere vorm.

✅ **Always:**
- Drift-gevoelige bezoeker-tellingen als open floor (`12+`) schrijven, nooit exact; een floor bumpt alleen bij een marketing-drempel (≈ nooit), niet bij elke post.
- Floor-asserties als forcing function: `geclaimd ≤ ground-truth` (filesystem/source-telling, niet hardcoded) — klaagt nóóit bij groei, faalt alleen bij overclaim. Negatief getest (99+ → exit 1). Geïmplementeerd als validate-docs `--deep` Check 6c.
- Onderscheid drift-klassen: groeiende content-counts (floor + assertie) vs. vaste artefacten (PDF-pagina's/badges/skill-levels — laag risico, met rust) vs. live metrics (tests/bundle → al naar TASKS.md gedelegeerd). Niet alles is hetzelfde probleem.
- Brede blogtabellen → opt-in `.blog-table--stacked` (rij = gelabelde kaart via `data-label`+`::before` op mobiel), NIET horizontale `overflow-x:auto`-scroll (verstopt de waardevolste kolom). Volledig: `docs/sessions/current.md` Sessie 181.

### Sessie 180: Blog-auteurschap → merk (Organization); persoonsnaam alleen op over-ons (25 jun 2026)
⚠️ **Never:**
- Je juridische naam als schema-`author` (Person + `sameAs`) op elke geïndexeerde blogpost zetten tenzij persoonlijk merk een *expliciet* doel is — dat is het SEO-versterkte, permanente, "eerste-wat-iemand-vindt"-oppervlak; productpromotie vereist het niet. De naam hoort op 1 about-pagina, niet als broadcast over 13 posts.
- Uitvoeren op een premisse die de gebruiker niet bevestigd heeft — de eerste richting (naam *versterken* met byline-link/jobTitle/sameAs) was coherent met "bekendheid onder eigen naam", maar het echte doel was productpromotie; toen viel de rechtvaardiging weg. Verifieer het doel vóór je bouwt (en durf binnen één sessie terug te draaien).
- "Volledig anoniem" als veiligheid verkopen zonder dreigingsmodel — schijnveiligheid zolang de GitHub-repo-URL de naam draagt + de eigenaar zelf onder eigen naam promoot. De-identificeer het oppervlak dat telt (13× schema-auteur), niet het onschuldige (about-pagina).

✅ **Always:**
- Merk-auteurschap = JSON-LD `author` → `Organization` (== publisher) + `article:author` meta → merk + zichtbare byline weg; de `:not(:last-child):after`-pipe-separators herschikken vanzelf → geen CSS/cache-bump nodig (inline HTML/JSON-LD).
- Scripted sweep met literal block-match + per-bestand `count==1`-assert + eind-assertie + echte JSON-LD-parser (`json.loads`) — geen blinde global replace.
- Behoud één eerlijk menselijk gezicht (about-pagina met naam + LinkedIn + founder-schema) als vertrouwensanker voor een site die producten verkoopt — E-E-A-T ≠ juridische naam, maar een consistente aanspreekbare entiteit helpt.
- Privacy-edits checken tegen juridische identificatie: `privacy.html` noemde de naam al niet ("beheerd door een individuele ontwikkelaar") → geen GDPR-conflict, niet aanraken. Volledig: `docs/sessions/current.md` Sessie 180.

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

**Rotation:** Top-6 huidig: 176-177-178-179-180-181 (Sessie 175 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie Sessie 180 UITGEVOERD:** current.md staart Sessie 165-169 geknipt naar `archive-s165-s169.md` (5 entries, byte-geverifieerd); current.md houdt nu het rolling window 170-181 (12 entries; volgende bulk-rotatie Sessie 185 → archiveer oudste ~5). SESSIONS.md-index gesynct. Historie 81-164 → `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

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
**Sessie counter:** 181

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

**Last updated:** 26 jun 2026 (Sessie 181 — content-getallen drift-bestendig: gidsen-stats "10"/"41" → floors "12+"/"40+" + PLANNING "10 posts"→12 + validate-docs `--deep` Check 6c floor-assertie; CLAUDE "12 posts" + JSON-LD 39 bewust ongemoeid (canoniek correct). Incl. blog-table-stacked + over-ons-copy. Volledig: `docs/sessions/current.md`)
**Version:** 5.55 (Sessie 181 — content-tellingen drift-bestendig (floors + floor-assertie); volledige historie: `docs/sessions/current.md` + TASKS.md)

