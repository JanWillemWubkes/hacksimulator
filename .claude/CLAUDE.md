# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 183)
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

### Sessie 183: Lead-magnet conversie/UX + dark-mode zichtbaarheid + copy-feitencontrole (28 jun 2026)
⚠️ **Never:**
- Een main-site-treatment (groene accent) klakkeloos op de blog plakken — de blog heeft een eigen palet (blauw, géén groen); "consistent maken" werd juist inconsistent. Cargo-cult: vorm kopiëren ≠ context checken. Geheugen `feedback_blog_palette_no_green`.
- Lead-magnet/cross-sell-copy "kloppend" maken tegen de oude tekst i.p.v. het echte artefact — 3× bleek een mooie zin feitelijk onjuist (Fase 0 = voorbereiding ≠ reconnaissance, géén nmap-cheatsheet, "command-templates" bestaat niet) tot ik de sample- + 19-pagina-PDF zelf las.
- Een element "heeft border + schaduw → ok" concluderen zónder te checken of die schaduw zíchtbaar is — `--shadow-elevation-1` is zwart-op-#0d1117 = onzichtbaar in dark; de kaarten leunden de facto op alleen een hairline.
- Een gedeelde klasse (`.sample-hero-content`) flex→grid herschrijven zonder te grep'en wie 'm nog meer gebruikt — `sample-download` deelt 'm (tekst+cover) en was gesloopt; scope op een `--lead`-modifier.

✅ **Always:**
- Elevatie in dark mode = lichter oppervlak (`--color-bg-modal` #161b22), niet schaduw — schaduwen werken niet op bijna-zwarte bg. "light gefixt, dark vergeten" is systemisch: grep `[data-theme=light]` met elevated bg vs dark-basis = pagina.
- Belofte-inversie vermijden: copy zet de écht directe actie voorop (instant on-page download), niet het gevoelsmatig-directe-maar-gepoorte pad (inbox/dubbel-opt-in).
- Als dezelfde copy zich blijft verzetten tegen correctheid (wachtmail→wachten→formulier), ligt het een laag dieper — hier een onware premisse (gratis sample = obstakel terwijl Gumroad óók e-mail vraagt); laat frictie-framing los, leid met waarde.
- De-jargon via de NL-gloss uit de eigen woordenlijst ("verkenning" voor reconnaissance) → site-brede consistentie gratis. Niet elke "dark == pagina" is een bug: modals (dim-overlay) + terminal/input zijn intentioneel. Volledig: `docs/sessions/current.md` Sessie 183.

### Sessie 182: Live zoekfilter + design-uitlijning woordenlijst ↔ commands (27 jun 2026)
⚠️ **Never:**
- Verwachten dat een flex-item met `margin: 0 auto` + `overflow-x:auto` klemt — de auto-marge schakelt `align-items: stretch` uit, dus het kind sized op z'n inhoud i.p.v. de container en `overflow-x` grijpt niet → pagina-overflow (gemeten: een nav van 484px duwde de 375px-viewport naar 496px). De regel werd pas giftig ná het herparenten in een flex-kolom. Reset met `margin:0; min-width:0`.
- Een gedeelde `max-width` lezen als "even breed" — `max-width` op een padding-loos element vs op een gepadde `.page-section` geeft 32px verschillende content-randen zodra de viewport > max-width. CSS lezen ("beide 1400") is niet genoeg; reken het box-model per rand uit.
- Vorm-consistentie najagen zonder de intentie te checken (cargo-cult) — de gecentreerde commands-intro klakkeloos op de woordenlijst plakken zou botsen met de links-uitgelijnde glossary-kop. Beide zijn scanbare naslag → links wint; kies per element de behandeling die past bij wat de pagina's gemeen hebben.
- Een "kapotte" feature aan de code toeschrijven vóór je de test zelf wantrouwt — de scroll-spy las "Netwerk" bij Security door `scroll-behavior: smooth` (IO las tussenposities van de animatie), niet door een bug. Instant-scroll bewees correct gedrag.

✅ **Always:**
- Een flex-item dat moet scrollen krijgt `margin:0; min-width:0` zodat `overflow-x:auto` aangrijpt i.p.v. de pagina te verbreden.
- Een sticky-balk-inner hetzelfde box-model geven als de content eronder (`.page-section`: `max-width` + `margin:0 auto` + zelfde padding-tokens, 32px desktop / 16px mobiel) → randen vallen op élke breedte samen; full-bleed achtergrond/blur/border blijven op de buitenkant.
- Herbruikbare UI-logica = kern-module + dunne per-pagina wrappers (config-selectors + label-noun) → de tweede consument wordt een mechanische kopie, geen duplicatie. Hier: `term-filter.js` ← `glossary-filter.js` / `commands-filter.js`.
- Meet de échte staat, niet een test-artefact: instant-scroll i.p.v. `scrollIntoView()` (smooth) om de IntersectionObserver-staat zuiver te triggeren. Render-en-meet op no-store server, dark+light+mobiel+breed (>max-width), `getBoundingClientRect`-delta == 0. Volledig: `docs/sessions/current.md` Sessie 182.

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

**Rotation:** Top-6 huidig: 178-179-180-181-182-183 (Sessie 176 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie Sessie 180 UITGEVOERD:** current.md staart Sessie 165-169 geknipt naar `archive-s165-s169.md` (5 entries, byte-geverifieerd); current.md houdt nu het rolling window 170-183 (14 entries; volgende bulk-rotatie Sessie 185 → archiveer oudste ~5). SESSIONS.md-index gesynct. Historie 81-164 → `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

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
**Sessie counter:** 183

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

**Last updated:** 28 jun 2026 (Sessie 183 — lead-magnet conversie/UX: signup-kaart zichtbaar (oppervlak-contrast #161b22 + elevatie + label + mobiele grid-reorder); dark-surface-audit (homepage-band + blog-kaarten gelift, blog-palet groen→neutraal); copy-feitencontrole tegen sample- + 19p-PDF (belofte-inversie, mislabels, cross-sell-claims). 8 commits. Volledig: `docs/sessions/current.md`)
**Version:** 5.57 (Sessie 183 — lead-magnet conversie/UX + dark-mode zichtbaarheid + copy-feitencontrole; volledige historie: `docs/sessions/current.md` + TASKS.md)

