# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

---

## Sessie 181: Content-getallen drift-bestendig + blog-table-stacked + over-ons-copy (26 jun 2026)

**Mission:** Bezoeker-zichtbare harde getallen die met de content meegroeien (aantal blogs/commands) drift-bestendig maken; plus twee voorafgaande UX/copy-fixes uit dezelfde sessie-cyclus vastleggen.

**Work done:**
- **Drift-fix (commit `ea379a2`, 3 files, +43/-4):**
  - `gidsen.html` stat-grid: `10` Blog posts → `12+`, `41` Commands → `40+` (open floors i.p.v. exacte tellingen; sluit aan op de bestaande `105+`/`50+`/`40+`-conventie elders op de site). Pure HTML-tekst → geen cache-bump.
  - `PLANNING.md`: twee stale `10 posts` → `12` (canonieke telling = `blog/*.html` minus index+welkom == TASKS.md-SSOT 12/12 + validate-docs Check 6b).
  - `scripts/validate-docs.sh`: NEW `--deep` Check 6c — floor-asserties `geclaimd ≤ ground-truth` voor gidsen Blog posts (vs filesystem `blog_count`), gidsen Commands (vs `grep -c '\.register(' src/main.js` = 41) en woordenlijst Termen (vs `<dt>`-count = 56). Robuust: nooit vals alarm bij groei; negatief getest (99+ → exit 1).
  - **Bewust ongemoeid (geverifieerd correct):** CLAUDE.md "12 posts" (canoniek) en JSON-LD `numberOfItems:39` (== 39 zichtbare command-rijen; "40+" = totaal 41). De inventaris-subagent vlagde beide als bug — beide vals-positief.
- **Blog-table-stacked (commits `3530e07` + `a9006e3`):** de 4 brede blog-datatabellen (nmap/hashcat/wachtwoord/wireshark) van Sessie-176 `overflow-x:auto`-scroll → opt-in `.blog-table--stacked` (rij = gelabelde kaart via `data-label`+`::before` op `@media≤768px`; thead clip-verborgen, `role="table"`+`scope="col"` voor a11y). `blog.css?v=116→117` op 14 blogpagina's. Conventie vastgelegd in `.claude/rules/architecture-patterns.md`.
- **Over-ons-copy (commit `83c130d`):** hero-subtitle "Daarom bouwen we" → "Daarom is HackSimulator.nl een..." (doorlopende "bezig"-tijd ondermijnde een live product); sample-CTA-kop "Wil je zien wat ik bouw?" → "Zo bereid je je eerste pentest voor" (kop↔payload-mismatch weg); meta "bouwen" → "bestaat". Inline HTML, geen cache-bump. "bouwde ik" (voltooid founder-verhaal) bewust behouden.

**Commits:** `83c130d` (over-ons copy) · `3530e07` (blog-table stacked) · `a9006e3` (rule-doc) · `ea379a2` (drift-fix). Alle op `main`, gepusht.

**Learnings:**
- **Floors verouderen netjes, exacte getallen niet.** Het echte probleem was niet "te veel getallen" — de site gebruikte al grotendeels floors. Drift zat in de paar plekken met exacte tellingen voor groeiende content. Een floor is waar zolang `geclaimd ≤ werkelijk`; bij groei (content alleen toegevoegd) blijft hij waar.
- **Verifieer drift-claims tegen de canonieke definitie, niet tegen een oppervlakkige telling.** De inventaris-subagent gaf 2 vals-positieven (CLAUDE "12"→"13", JSON-LD 39→41); beide "fixes" hadden drift/inconsistentie geïntroduceerd. Canonieke telbron = `validate-docs.sh` Check 6b + TASKS.md-SSOT (12).
- **Floor-assertie maakt de forcing function triviaal én robuust.** `geclaimd ≤ ground-truth` geeft nooit vals alarm bij groei — alleen bij overclaim. De alternatief-valkuil (exact-match-validator over elk cijfer) zou het onderhoudsprobleem terugbrengen.
- **Render-en-meet ook voor 2-teken-tekstedits:** mobiel 360px gemeten — `12+/40+/22/105+`, geen overflow, niets afgekapt; screenshot bevestigd. `+`-suffix-rendering was al bewezen door de bestaande `105+`.

**Metrics delta:** drift-commit +43/-4 (3 files), bundle-impact ≈ 0; blog-table +43 regels `blog.css`. E2E ongewijzigd (23 spec files / 197 tests via `--list`; geen tests toegevoegd of geraakt).

**Next steps:** Geen open items uit deze sessie. Buiten scope gehouden (eerlijk benoemd): test-/CSS-var-/bundle-getallen in docs (live metrics → TASKS.md-flow); vaste artefacten (PDF-pagina's/badges/skill-levels, laag drift-risico).

---

## Sessie 180: Blog-auteurschap → merk (Organization); persoonsnaam alleen op over-ons (25 jun 2026)

**Mission:** Strategische vraag van Heisenberg — is het verstandig dat zijn volledige juridische naam als auteur op alle 13 blogposts staat? Analyse als expert, dan uitvoeren.

**Eerlijke add-then-remove (binnen één sessie):**
- **Eerste richting (op verkeerde premisse):** op basis van "ik wil bekendheid onder mijn eigen naam via LinkedIn" → naam *versterkt* in de working tree: byline klikbaar naar /over-ons (`rel="author"`), JSON-LD `author.Person` + `jobTitle` + `sameAs` LinkedIn op 13 posts, over-ons-founder idem, LinkedIn-knop-URL gecorrigeerd (`janwillemwubkes` → `jwwubkes`). Nog niet gecommit.
- **Premisse-correctie:** Heisenberg verhelderde dat het delen op LinkedIn dient om het **product** te promoten, niet voor persoonlijke bekendheid. Daarmee valt de rechtvaardiging voor de naam-broadcast weg.
- **Tweede richting (definitief):** blog-helft van de versterking teruggedraaid in de working tree → **merk-auteurschap**; persoonsnaam alleen nog op over-ons (die versterking + URL-fix blijven — juist gewenst op de about-pagina). Alleen het netto-resultaat is gecommit in `80f0297` (blogs gede-personaliseerd, over-ons versterkt).

**Work done:**
- **13 `blog/*.html`** (scripted sweep, literal block-match + per-bestand `count==1`-assert): `article:author` meta → `HackSimulator.nl`; JSON-LD `author` Person → `{"@type":"Organization","name":"HackSimulator.nl","url":"https://hacksimulator.nl/"}` (== publisher); zichtbare byline-regel **verwijderd** (`datum · leestijd · categorie` blijft, `:after`-pipe-separators herschikken vanzelf, geen CSS nodig).
- **`over-ons.html`** ongewijzigd in de reversal — behoudt naam, bio, LinkedIn-knop (`/in/jwwubkes/`) + founder-`Person` (`jobTitle`+`sameAs`). Bewust de enige plek voor de identiteit.
- **Niet aangeraakt:** `privacy.html` ("beheerd door een individuele ontwikkelaar" — noemt de naam al niet, dus geen GDPR-conflict); GitHub-URL's (structureel repo-eigenaarschap); README/docs (dev-only); `meta name=author` (al merk).

**Verificatie:** eind-asserties (0× naam/LinkedIn in blogs, 13× Organization-author + merk-`article:author`, 0 bylines); JSON-LD parse-validatie (echte parser, 14 bestanden, 0 ongeldig); no-store-server + Playwright render-en-meet (meta-bar zonder byline, pipes correct, dark/light/mobiel 375px, over-ons naam + werkende LinkedIn-knop intact); pre-commit hooks (incl. blog-JSON-LD + SEO-metadata-sync) groen.

**Commit:** `80f0297` (14 files: 13 blogs gede-personaliseerd + over-ons versterking/URL-fix).

**Learnings:**
- **Auteurschaps-oppervlak ≠ promotie-doel.** Las je juridische naam niet als schema-auteur op elke geïndexeerde pagina tenzij persoonlijk merk een *expliciet* doel is. De 13-posts-broadcast is het SEO-versterkte, permanente, "eerste-wat-iemand-vindt"-oppervlak; de about-pagina (1 verwachte pagina) is dat niet.
- **Beslis op het juiste doel.** De eerste richting was coherent met de verkeerde premisse; toen het echte doel (productpromotie) bovenkwam, viel de rechtvaardiging weg. Premisse verifiëren > snel uitvoeren.
- **Anonimiteit vereist een dreigingsmodel, geen onderbuik.** Volledig gezichtsloos gaan is schijnveiligheid zolang de GitHub-repo-URL de naam draagt + de eigenaar zelf onder eigen naam promoot. Brand-byline + één eerlijke about-pagina = de juiste balans voor een site die producten verkoopt (vertrouwensanker).
- **E-E-A-T ≠ juridische naam.** Organisatie-auteurschap is Google-conform voor een product/tool-site; author==publisher is gangbaar.
- **Scripted sweep met literal block-match + `count==1`-guard** > blinde global replace; sluit af met eind-assertie + echte JSON-LD-parser.

**Next steps:** geen open items. Optioneel toekomstig: als Heisenberg ooit volledige anonimiteit wil om een specifieke dreiging → GitHub-repo hernoemen/transfer (breekt links/stars/history; aparte ingreep).

**Metrics delta:** geen runtime-bundle-impact (inline HTML/JSON-LD-edits in blog/ + over-ons; geen CSS/JS, geen cache-bump). Blog-content-pijler blijft 13 posts.

---

## Sessie 179: Klantgerichte copy-perfectionering — footer-tagline + hero-subtitle + "authentiek"-sweep (25 jun 2026)

**Mission:** Heisenberg vond de footer-regel "voor absolute beginners" te kort door de bocht (de site is óók voor enthousiastelingen). Analyse → herschrijven; in vervolgvragen uitgebreid naar de hero-subtitle en daarna een repo-brede consistentie-sweep van het afgekeurde woord "authentieke commands".

**Work done:**
- **Footer-tagline** (`src/components/footer.js`): "perfect voor absolute beginners" → "van je eerste command tot security tools". Cache-bump `init-components.js?v=2`→`v=3` + `footer.js?v=2`→`v=3`-import, gepropageerd naar 24 HTML-pagina's (footer wordt via `injectFooter()` dynamisch geïnjecteerd → twee cache-lagen). Commit `0b67fec` (21 files).
- **Hero-subtitle** (`index.html`): "Voor Nederlandse studenten en overstappers die cybersecurity willen leren zonder hun PC te riskeren. 40+ authentieke commands, direct in je browser." → "Oefen ethisch hacken met 40+ commands uit de praktijk en Nederlandse uitleg — in een veilige simulatie waar je alles kunt uitproberen zonder echte gevolgen." H1 bewust ongewijzigd (SEO-alignment met `<title>`/OG).
- **"authentieke commands" → "commands uit de praktijk"** op alle 9 user-facing plekken: og/twitter-meta (`index.html` + `terminal.html`), feature-card-h3 + stat-label (`index.html`), 3 blogposts (`blog/index.html`, `blog/ethisch-hacker-worden.html`, `blog/welkom.html`). Hero + authentiek samen in commit `8a81de8` (5 content-files). Beide commits gepusht naar `main`.
- Geen cache-bump op de content-edits (HTML-only tekst); footer-edit wél (gerenderde JS-output).

**Bewust ongemoeid:** `blog/welkom.html:180` "Authentieke ervaring" (andere betekenis — beleving voelt echt, verdedigbaar) · `terminal.html:293` "studenten, overstappers en iedereen die nieuwsgierig is" (al inclusief, geen plafond) · interne docs (PLANNING/README/style-guide/sessions/prd) historisch/niet-user-facing.

**Learnings:**
- **Toegankelijkheid = vloer, geen plafond.** Demografische labels ("absolute beginners", "studenten en overstappers") bakenen het publiek af en sluiten enthousiastelingen uit. Frame de *instap* ("van je eerste command tot...") i.p.v. het *publiek* — sluit niemand uit en is feitelijk waar (ls/cd → security tools). De footer was zelfs smaller dan de hero, dus verbreden vergrootte de consistentie.
- **Een geruststelling moet letterlijk waar zijn.** Eerste concept-veiligheidsclaim "los van je eigen computer en het echte internet" was onwaar — de simulator draait op de machine van de gebruiker via internet. De échte veiligheid zit in de *gesimuleerde uitvoering* (echte command-syntax, nagebootste resultaten) → "zonder echte gevolgen". Verifieer copy tegen de fysieke werkelijkheid, niet tegen wat lekker klinkt (product-kwaliteitsregel).
- **Homonym-valkuil bij replace.** "authentiek" droeg twee claims: "authentieke *commands*" (afgekeurd) vs "authentieke *ervaring*/voelt authentiek" (legitiem 80/20-principe). Eerst inventariseren + per-treffer op betekenis categoriseren, dán pas vervangen — een blinde sweep had de legitieme variant gesloopt (zelfde discipline als de Sessie-177 `[X]`-marker-bug).
- **Word-craft:** "echte commands" zou met "zonder echte gevolgen" twee keer "echt" opleveren → "commands uit de praktijk" lost de dubbeling op én is eerlijker dan "authentiek".

**Next steps:** geen open items. Eventueel later: `<meta name="description">`-regel (`index.html:6`) zegt nog "voor beginners" — buiten scope gehouden (SEO-relevant, niet de afgekeurde tekst).

**Metrics delta:** verwaarloosbaar (HTML/JS-tekstedits, ~37 regels over 26 bestanden). Geen test-wijzigingen. Geheugen `feedback_audience_floor_not_ceiling` toegevoegd.

---

## Sessie 178: Homepage lead-magnet — UX-reorder + glow-fix + copy-perfectionering (24 jun 2026)

**Mission:** Heisenberg zag onderaan de homepage twee vragen pal na elkaar — "Direct beginnen?" (lead-magnet, download een PDF) en "Klaar om te beginnen?" (finale CTA, start de terminal) — en vond dat verwarrend. Analyse → reorder + reframe; in vervolgvragen uitgebreid naar een glow-regressie en daarna naar copy-perfectionering.

**Probleem (diagnose):**
- **Woord-botsing:** twee bijna identieke "beginnen?"-vragen achter elkaar met verschillende antwoorden (PDF downloaden vs. terminal openen).
- **Belofte-inversie:** "Direct beginnen?" hing aan het traagste, meest-gated pad (formulier → email → double opt-in → PDF), terwijl het écht directe pad (terminal, geen account) er net onder stond = leest als bait-and-switch.
- **Conversie-prioriteit omgekeerd:** secundaire email-ask (PDF) vóór de primaire terminal-CTA; nieuwsbrief (derde email-ask) erna.

**Work done (3 commits):**
- **Fix 1 — reorder (`index.html`):** lead-magnet-strip verplaatst van vóór naar ná de finale-CTA-sectie. Nieuwe staart: FAQ ("Hoe begin ik?") → finale CTA ("Klaar om te beginnen?" → Start de Terminal) → lead-magnet (PDF) → nieuwsbrief. Terminal-CTA krijgt het climax-moment direct na de FAQ-payoff; PDF + nieuwsbrief clusteren als secundaire email-staart. Tracking-attributen (`data-lead-magnet`/`data-cta-location`) intact (attribuut-gebaseerd, positie-onafhankelijk).
- **Fix 2 — glow (`styles/landing.css`):** de `final-cta`-glow zat verankerd op `at 50% 100%` (onderrand) en leunde op de aangrenzende band om in over te lopen (nieuwsbrief op homepage, footer op de 4 andere final-cta-pagina's). Na de reorder volgde een transparante lead-magnet-sectie → de glow werd hard afgekapt en zweefde "uit het niets". Fix: homepage-gescopete override `.final-cta:has(+ .lead-magnet)` → zelfstandige ambient-halo (`radial-gradient(ellipse 42% 58% at 50% 44%, var(--final-cta-glow) 0%, transparent 72%)`) die naar alle randen uitvaagt. De 4 andere pagina's matchen `:has` niet → houden de naad-uplight. `landing.css?v=121`→`122` op **alleen** `index.html` (de regel rendert nergens anders).
- **Fix 3 — copy (3 teasers):** titel "Pak de gratis Pentest Playbook-sample" (stroef + dubbelt de badge) → **"Zo begint een echte pentest"** (hook). Subtekst "Krijg de Fase 0 reconnaissance-checklist + beslisboom Fase 0 → 1" (jargon) → gewone taal: "hoe je een pentest voorbereidt — toestemming, scope en de juridische check — en je doelwit verkent vóór de eerste aanval. Precies de stap die beginners overslaan." Zelfde de-jargon op `over-ons.html` + `gidsen.html` (pagina-specifieke kopjes "Wil je zien wat ik bouw?"/"Nog niet overtuigd?" behouden). `index.html` `.phase-flow`/`.arrow-glyph`-span vervalt.

**Copy-verificatie tegen artefact (product-kwaliteitsregel):** twee Explore-agenten — één voor de site-brede copy-inventaris (~55 plaatsen; teaser-groep = homepage + over-ons + gidsen; `sample-pentest.html`-hero al goed; ~10 blog-vermeldingen bewust contextueel), één voor de echte PDF-inhoud (`pdfinfo`/`pdftotext`): sample = 9 pag., Fase 0 (toestemmingsdocument, scope, juridische check) + Fase 1 reconnaissance (whois/dig/OSINT + licht actief). Géén scanning/exploitation/rapportage (= betaald 19-pagina Playbook). Copy claimt dus niets buiten de sample.

**Niet aangeraakt:** `sample-pentest.html` (hero al goed), blog-inline-vermeldingen (contextueel), meta/SEO-tags, nieuwsbrief-mail.

**Verificatie (render-en-meet, no-store server tegen ES-module-cache-vals-negatief):**
- Reorder: DOM-volgorde FAQ→finale CTA→lead-magnet→nieuwsbrief bevestigd; dark+light+mobiel 375px, geen horizontale overflow (scrollWidth 360 ≤ 375); lead-magnet→nieuwsbrief-spacing gebalanceerd (Wijziging-3 CSS niet nodig).
- Glow: ambient-halo grondt netjes in dark+light+mobiel, geen harde rand; `:has(+ .lead-magnet)` matcht alleen homepage (bevestigd via `el.matches()`).
- Copy: titel/subtekst exact, "vóór" (`&oacute;&oacute;r`) rendert correct, geen "Fase 0 → 1"/`arrow-glyph`-resten, badge + knop intact; over-ons + gidsen nieuwe paragraaf onder behouden kop.

**Commits:** `26b6f52` (reorder + titel-reframe, 2 files), `91aab72` (glow-fix `final-cta` + `?v=122`, 2 files), `deab754` (copy de-jargon 3 teasers, 3 files). Alle gepusht naar `main`.

**Learnings:**
- **Sectie-reorder kan een naad-afhankelijk visueel effect stil breken.** De glow leek standalone maar was ontworpen om in de band eronder over te lopen (`at 50% 100%`, hard-clipped). Bij elke DOM-herschikking: gradients/borders op sectiegrenzen nalopen.
- **Verankerde gradients zijn reorder-veilig, naad-uplights niet.** De fix maakt de glow zelfstandig (centered halo, uitvaag vóór alle randen) i.p.v. afhankelijk van de buur.
- **Scoping > herontwerp.** `:has(+ .lead-magnet)` raakte exact de ene gebroken case en liet 4 gezonde pagina's met rust — geen body-class of JS-detectie nodig.
- **`?v=`-bumps zijn voor gedragswijziging, niet voor bestandswijziging.** HTML-only tekstedits en een CSS-comment-only edit hebben geen render-effect → geen bump; de glow-regel (homepage-only) bumpte alleen index.html.
- **Copy verifiëren tegen het artefact, niet tegen de oude tekst.** De oude subtekst noemde echte features maar in jargon; de PDF-inhoud leverde de eerlijke, begrijpelijke verkoopargumenten (toestemming/scope/juridische check) die "Fase 0" verborg.

**Next steps:** geen open punten uit deze sessie. (Bestaande backlog ongewijzigd — zie TASKS.md.)

**Metrics delta:** geen test-toevoeging (197 tests / 23 specs ongewijzigd; copy/layout-werk). Bundle ground-truth Sessie 178: src 625 KB / styles 385 KB (+1 KB `final-cta`-glow override) / blog 413 KB / assets 1031 KB. HTML-copy-edits vallen buiten de gemeten dirs.

---

## Sessie 177: Terminal voltooid-markers `[X]`→`[✓]` — systemische rode-checkbox-botsing op mobiel (22 jun 2026)

**Mission:** Heisenberg zag in de terminal dat `leerpad` op mobiel sommige commands rood toonde en andere wit, terwijl op laptop alles wit is — "net alsof er iets fout is". Analyse → fix → in vervolgvragen uitgebreid naar de man-page en daarna naar de hele gamification/voortgang-stack.

**Oorzaak (twee samenwerkende mechanismen in `src/ui/renderer.js`):**
- **Marker-botsing** (`renderer.js:101`): elke regel die na trim met `[X]` begint wordt als `error` geclassificeerd → rood. `leerpad` (en bijna elke voortgangsweergave) gebruikte `[X]` als "afgevinkt"-vinkje → voltooide items rood.
- **Kleur-doorlek** (`renderer.js:497-506`): een regel met ≥3 spaties inspringing zónder eigen marker is een *continuation line* en erft de kleur van de regel erboven. Mobiele rijen sprongen 4 spaties in → het rood van een voltooid item lekte door naar de niet-voltooide `[ ]`-regels eronder.
- **Waarom alleen mobiel:** desktop tekent een ASCII-kader; elke regel begint met `│` (geen marker, 0 inspringing) → alles wit. Het kader schermt de inhoud toevallig af.

**Work done:**
- **Leerpad (`leerpad.js`):** mobiel `[X]`→`[✓]` (success/groen) op fase-kop + command-rij; command-inspringing 4→2 spaties zodat niet-voltooide regels onder de continuation-drempel vallen (geen doorlek). Desktop-box ook `[X]`→`[✓]` voor symbool-consistentie (in het kader → blijft wit; `[✓]` is 3 chars = uitlijning pixel-exact). Man-page-legenda herschreven met de glyph **achteraan** (`Voltooid   [✓]`) i.p.v. vooraan → geen marker-match → neutraal wit (geen rood, geen doorgeërfd groen op de "niet voltooid"-regel).
- **Gamification/voortgang (na scope-akkoord "alles, zoals leerpad"):** `[X]`→`[✓]` voor voltooid/unlocked in `challenge-renderer.js` (lijst + renderProgress), `badge-manager.js` (box + mobiel), `tutorial.js` (box + mobiel), `challenge.js` (status-tekst), `next.js` (transitie + completion `[X] … afgerond/voltooid!` — gebruikte z'n sub-regels al met `[✓]`, was intern inconsistent).
- **Tests:** `responsive-ascii-boxes.spec.js` leerpad mobiel+desktop → `[✓]` verwacht, `[X]` verboden. Overige specs (`tutorial.spec.js` accepteert al `[X]` OF `✓`; `gamification.spec.js` toetst geen marker) onaangeroerd.
- **Geheugen:** `reference_renderer_marker_collision.md` toegevoegd (+ MEMORY.md-pointer).

**Cruciaal onderscheid (uit volledige `[X]`-inventaris vóór edits):** drie categorieën, niet twee.
- **A. Voltooid-checkbox** (de bug → `[✓]`): de 6 oppervlakken hierboven.
- **B. Échte foutmelding** (rood correct, niet aangeraakt): `[X] Onbekende challenge` (challenge-manager:112), `[X] Onbekend scenario` (tutorial.js:180), certificates:133/143.
- **C. "NOOIT doen"-lijsten in security/netwerk-man-pages** (rood correct, niet aangeraakt): hydra/sqlmap/nmap/hashcat/cat/rm/ping/netstat/whois/ifconfig/traceroute/metasploit/nikto — `[X] password, admin, 123456` enz. Hier is rood een rood kruis = "niet doen"; een blinde `[X]→[✓]` had de waarschuwing **omgekeerd** ("`[✓] password`"). Daarom eerst inventariseren, niet globaal vervangen.

**Verificatie (render-en-meet, no-store Node-server tegen ES-module-cache-vals-negatief):**
- Leerpad mobiel **dark** (`[✓]`=`#3fb950` groen) + **light** (`#008844`), niet-voltooid `terminal-output-normal`, `anyRed:0`, regels ónder een groene regel wit (doorlek weg).
- Leerpad desktop 1440px: box `allSame`-uitgelijnd (len 69), voltooide rij wit (afgeschermd), `[X]` weg, 0 rood — `[✓]` rendert als 1 monospace-cel (screenshot bevestigd).
- `challenge status` na 1 afgevinkt doel: `[✓] Check je gebruikersnaam` = `success` (groen — was eerder gemeten `error`/rood), `[ ]` = wit.
- `achievements` met unlocked badge: `[✓] First Steps` groen, locked badges wit.
- Regressie: `tutorial start <bestaat-niet>` → `[X] Onbekend scenario` = `error`/rood (categorie B intact). Desktop achievements- + tutorial-box: `allSame`, len 69, 0 rood.

**Commits:** `af91ff8` — "fix(terminal): voltooid-markers [X]->[✓] — verhelp rode checkboxes op mobiel" (7 files: leerpad/challenge/next/tutorial/badge-manager/challenge-renderer + responsive-ascii-boxes.spec.js). Gepusht naar `main`.

**Learnings:**
- De renderer kleurt puur op het **eerste teken** van een regel; content-tokens die toevallig markers zijn (`[X]`) botsen. Eén conventie, zes vindplaatsen — de bug was systemisch, niet leerpad-specifiek.
- **Meten vóór claimen:** de eerste mobiele probe toonde 0 rood omdat niets voltooid was; pas ná het triggeren van een afgevinkt item (`challenge status` met 1 met-requirement) werd het rood zichtbaar/gemeten. Aanname "het is rood" ≠ bewijs.
- **Inventariseer vóór bulk-replace:** de categorie-C "NOOIT doen"-`[X]` lijken identiek maar dragen de tegenovergestelde betekenis. Een sed-brede replace was hier destructief geweest.
- `[✓]` is 3 chars en 1 monospace-cel → desktop-box-uitlijning blijft pixel-exact; geen reden om desktop op `[X]` te houden (symbool nu overal gelijk).
- **Geen CI:** `.github/workflows` bestaat niet en Netlify draait alleen een echo-build; de Playwright-suite test bewust de **live productie**-site en draait enkel handmatig → de browser-verificatie hier (no-store, computed-style) is het eigenlijke bewijs; de suite valideert pas ná deploy.

**Next steps (open):** categorie C (man-page "NOOIT doen"-`[X]`) staat bewust nog op rood — desgewenst later naar `[✗]` voor projectconventie-consistentie (geen functioneel defect). Na Netlify-deploy: `npx playwright test responsive-ascii-boxes.spec.js` tegen productie als regressie-vangnet.

**Metrics delta:** geen test- of bundle-impact van betekenis — alleen asserties gewijzigd (geen specs toegevoegd; blijft 23 files / 197 tests per browser-project) en enkele `[✓]`-tekens in src JS (sub-KB). Ground-truth `du -sb`: src ~624 KB / styles ~384 KB / blog ~413 KB / assets ~1030 KB.

---

## Sessie 176: Mobiele audit + 5 fixes — tabel-overflow, CSP/consent-gap, emoji-cleanup, tap-targets, scroll-hint (21 jun 2026)

**Mission:** Heisenberg vroeg een audit of de mobiele weergaves ongewenste afwijkingen vertonen (hoofdpubliek laptop/pc, mobiel secundair). Gemeten op 375px-viewport (`getBoundingClientRect`/`scrollWidth`, niet op het oog) tegen productie. Eindoordeel: mobiel grotendeels gezond; 1 echt layout-defect + enkele kleinere punten. Daarna in vervolgvragen uitgebreid naar CSP-onderzoek, emoji-cleanup, tap-targets en de scroll-hint.

**Fix 1 — brede tabellen afgekapt/pagina-overflow (blog + legal):**
- Eén grondoorzaak: `.blog-post-content table` (`blog.css:478`) en `body.legal-page table` (`legal.css:73`) hadden `width:100%` + default `table-layout:auto` zónder scroll-container → bij 4 koloms tekst groeit de tabel buiten de viewport (tot 574px @375px). Blog maskeerde dit met `.blog-container overflow-x:hidden` → kolom afgekapt; legal had die net-niet → hele pagina scrollde horizontaal (`scrollWidth` 594).
- Fix: in de bestaande `@media (max-width:768px)`-blokken de tabel zelf een scroll-container maken (`display:block; overflow-x:auto; -webkit-overflow-scrolling:touch; max-width:100%`) — zelfde patroon als `.blog-post-content pre`. Geverifieerd: pagina-overflow weg (594→360), tabel scrollt binnen eigen box, afgekapte kolom weer leesbaar (dark+light). Desktop ongemoeid (`display:table` op ≥769px).

**Fix 2 — CSP blokkeerde Consent Mode v2 defaults op alle 14 blogpagina's (GDPR-gap):**
- Het inline consent-default `<script>` werd door de CSP (`script-src 'self'`, geen unsafe-inline) geblokkeerd → `gtag` undefined, `dataLayer` leeg, maar de losse `adsbygoogle.js` (CSP-toegestaan) laadde **wel** → AdSense laadde zonder de `denied`-defaults. De 11 niet-blog-pagina's gebruikten al het geëxternaliseerde `consent-default.js` (Sessie 166); de `blog/`-map was bij die migratie gemist.
- Runtime-bewijs: productie-blog vóór = `gtag:undefined`, `dataLayer.length:0`, `consentDefault:false`, AdSense in DOM; homepage = `gtag:function`, default met alle `denied`+`wait_for_update:500`. `init-analytics.js` vangt het niet op (zet alleen een consent-*update*, en alleen als `gtag` bestaat).
- Fix: inline-block + losse adsbygoogle-tag vervangen door `<script src="/src/analytics/consent-default.js" data-cookieconsent="ignore" data-adsense="ca-pub-6345664385525701">` (dat zet defaults én injecteert AdSense daarná — race-veilig). Python-vervangscript met regex + dry-run + per-bestand assertie (exact 1 match). Geverifieerd: 0 CSP-fouten over 7 pagina's, gtag=function, default aanwezig.

**Fix 3 — emoji-cleanup 3 legal-pagina's:**
- Legal gebruikte ~18-22 emoji's elk (rest van de site emoji-vrij; brand-regel = ASCII brackets only). Heisenberg koos: alles weg, ✅/❌ → tekst.
- Script met contextregels: decoratieve sectie-markers (📌🔒📢🔮🚫⚠️⚖️🎓) verwijderd; ✅/❌ in `<td>` → emoji weg, Ja/Nee behouden; ✅/❌ in lijst-items → `[✓]`/`[✗]`; trailing emoji in `<h3>` weg; functionele pijlen (→←↑↓) behouden. Eind-assertie ving 🎓 (niet pre-geïnventariseerd) → toegevoegd. 0 emoji over op alle 3, dark+light geverifieerd.

**Fix 4 — contact-form tap-targets 38→44px:**
- `.form-group input/textarea/select` (`pages.css:325`) was ~38px (alleen padding) → `min-height:44px` (WCAG 2.5.5 AAA). Homepage-newsletter had al `height:44px`. Cache-bump `pages.css?v=133` — normaliseerde meteen bestaande drift (2 bestanden op `v=114`, 6 op `v=132`).
- **Teruggedraaid (meedogenloos-eerlijk):** de blog-filterknoppen-fix. Heisenberg koos "filterknoppen naar AA-24px", maar ná implementatie tonen metingen dat ze al 27px (mobiel) / 42px (desktop) zijn — ruim boven het 24px AA-minimum. Mijn `inline-flex` had bovendien geen effect op de hoogte (al display:block). Fix repareerde niets → teruggedraaid. Premisse ("~20px") was een ongemeten aanname; "meten wint van oogwerk" beet terug.

**Fix 5 — terminal scroll-hint collisie:**
- `.scroll-hint` ("Scroll voor meer info", `position:fixed; bottom:4.5rem; z-index:2`, buiten `<main>`) botste op mobiel met de `.mobile-quick-commands`-balk, die naar 2 rijen wrapt (gemeten 109px) en dezelfde onderste zone bezet. Op desktop bestaat de balk niet (`display:none`) → daar correct.
- Fix: `@media (max-width:768px){ .scroll-hint{ display:none } }` in `terminal-education.css` (waar de hint woont; dat bestand wordt alleen door `terminal.html` geladen → kleinste cache-blast-radius). Cache-bump `terminal-education.css?v=115`. Geen JS-wijziging (IntersectionObserver in `faq.js`/`terminal.js` draait foutloos door). Geverifieerd: mobiel `display:none`/balk zichtbaar, desktop `display:flex`/bottom 81px.

**Commits:** `c41e317` (fix mobile: tabel + scroll-hint) + `5dae5ca` (fix blog: consent extern, 14 posts) + `f4c70be` (style legal: emoji's → ASCII) + `ea1c5ea` (fix a11y: form-inputs 44px + pages.css-normalisatie). 30 bestanden, +134/−284. Cache-bumps `blog.css?v=116`/`legal.css?v=3` reizen mee in de consent- resp. emoji-commit (per-bestand gegroepeerd want hunk-splitting niet mogelijk in deze omgeving).

**Learnings:**
- **Meten wint van oogwerk — ook over je eigen aannames:** de filterknoppen-"fix" was gebaseerd op een ongemeten "~20px"-aanname; meting toonde ze al AA-conform → teruggedraaid. Implementeer-dan-meet ontmaskerde het.
- **Console-error ≠ cosmetisch:** de CSP-melding leek een losse console-regel maar bleek een echte GDPR/Consent-Mode-gap op de hoogste-organische-traffic-pagina's. Runtime-meten (dataLayer + gtag-type) op productie vóór én lokaal ná = sluitend bewijs.
- **Voltooi migraties volledig:** de Sessie-166 inline-script-externalisatie miste `blog/`; een repo-brede grep (consent-default.js vs inline gtag) legde de 11-vs-14-split bloot.
- **Cache-blast-radius bepaalt de fix-locatie:** scroll-hint-regel in `terminal-education.css` (1 consumer) i.p.v. `mobile.css` (site-breed) → één cache-bump i.p.v. ~25.
- **Per-bestand committen wanneer hunks verweven zijn:** cache-bumps zaten in dezelfde HTML's als content-changes; `git add -p` is interactief (niet beschikbaar) → per-bestand groeperen geeft dezelfde eindtree met leesbare history.
- **Scope-validatie via assertie:** het emoji-script faalde hard op 🎓 (niet geïnventariseerd) — de eind-assertie (0 emoji over, excl. pijlen/✓✗) was het vangnet.

**Next steps:** Brevo click-tracking-404 op mobiele PDF-download blijft best-effort (Sessie 174). De catch-up-archivering current.md Sessie 81-164 → range-archieven (gedeferd Sessie 175) blijft openstaan.

**Metrics delta:** styles/ 378→384 KB (+6, tabel/a11y-CSS), blog/ 417→412 KB (−5, inline-consent-scripts verwijderd uit 14 posts), src/ 623 KB onveranderd, assets/ 1031 KB onveranderd. Geen test-count-wijziging (23 spec files). `validate-docs.sh` exit 0.

---

## Sessie 175: Layout-fixes sample-pentest.html — chevron, success-state, card-uitlijning (21 jun 2026)

**Mission:** Heisenberg meldde meerdere layout-problemen op `sample-pentest.html` en wilde ze 1-voor-1 aanpakken. Drie problemen opgelost, elk gecommit, daarna gepusht.

**Probleem 1 — chevron `Fase 0 → 1` te laag (2 plekken):**
- `.arrow-glyph` gebruikte `position: relative; top: 1px` (duwde de pijl omláág). Vervangen door `vertical-align: 0.2em` — schaalt met font-grootte, werkt op zowel hero-`<li>` als card-`<h3>`. Identiek aan de eerdere homepage-fix `.phase-arrow`.
- Homepage `.phase-arrow` geconsolideerd naar dezelfde canonieke `.arrow-glyph` (DRY): `.phase-arrow`-regel verwijderd uit `landing.css`, `index.html:669` class omgezet. `.phase-flow` (nowrap-wrapper, homepage-specifiek) behouden — apart concern.

**Probleem 2 — success-state brak de layout:**
- Oorzaak: `brevo-submit.js` toonde bij succes het paneel maar verborg het formulier níet → kaart droeg dubbele content (titel+intro+succes-box+download-knop+invoerveld+verweesde CTA+privacy) → explodeerde in hoogte; de achtergebleven "Stuur mijn sample"-knop oogde verweesd. De harde rand kwam uit Brevo's externe `sib-styles.css`.
- `brevo-submit.js`: bij succes `form.style.display='none'` + `.newsletter-submitted` op de `.homepage-newsletter`-kaart (generiek, werkt homepage + sample). Bevestiging vervángt nu het formulier.
- `main.css`: paneel-styling (padding, box-shadow none) + success/error-tint (groen/rood via `color-mix`) + icoonkleur. **0× nieuwe `!important`** — Brevo's `.sib-form-message-panel` (0,1,0) heeft zelf geen `!important`, dus onze scopes `.homepage-newsletter .sib-form-message-panel` (0,2,0) en `#success-message` (1,1,0) winnen op specificiteit. (Eerste plan gebruikte `!important`; Heisenberg vroeg om een schonere oplossing → curl van Brevo's CSS bevestigde dat specificiteit volstaat.)
- `landing.css`: sample-kaart verbergt stale titel+intro bij succes; download-knop full-width; btn-cta-tekstkleur hersteld (Brevo's `.sib-form-container a` (0,1,1) kleurde 'm blauw+underline → onze `.sample-success-download .btn-cta` (0,2,0) wint).
- `lead-magnet.spec.js`: success-test uitgebreid met `#sib-form` hidden + `#sample-form` heeft `.newsletter-submitted`.

**Probleem 3 — card-body's niet uitgelijnd (3-koloms rij):**
- Meting: titels top-uitgelijnd (alle `top:861`) maar card 3 ("Beslisboom Fase 0 → 1") heeft 1-regelige titel → body begon 23px hoger (900 vs 923) dan card 1+2 (2-regelig).
- Fix: opt-in `.feature-cards--equal-title` op de `.feature-cards`-div (raakt index/gidsen/over-ons niet, die delen `.feature-card`) + `@media (min-width:1025px) { .feature-cards--equal-title .feature-card h3 { min-height: 2lh } }`. `2lh` = exact 2 tekstregels (geen line-height-giswerk). Gegate op de 3-koloms-breakpoint → geen witruimte zodra de cards stacken (≤1024px = 2-kolom met card 3 full-width, ≤768px = 1-kolom).
- Na fix gemeten: alle drie body's `top:923`, h3-hoogtes 54px gelijk. Bij 1000px (2-kolom): min-height niet actief (27/32px natuurlijk) = correct gescoped.

**Commits:** `6f5e27a` (probleem 1+2) + `0a64369` (probleem 3). Gepusht naar `main` (`33f239f..0a64369`, incl. eerder lokaal-only `57a8379`). Cache-bumps: `main.css` v150→151, `landing.css` v118→119→120→121 (cumulatief).

**Verificatie:** Playwright met fetch/route-mock voor Brevo (geen echt contact) + no-cache server (Python `http.server` cachte de oude ES-module → Sessie-171-valkuil; opgelost met `Cache-Control: no-store`-server). E2E `lead-magnet.spec.js` 10/10 groen in verse browser (echte module). Render-en-meet + screenshots: sample success, homepage success (dark), error-state (rood, form blijft voor retry), light-theme success, card-uitlijning. `validate-docs.sh` exit 0 (pre-commit hooks groen bij beide commits).

**Learnings:** zie `.claude/CLAUDE.md` Sessie 175. Kern: meten vóór concluderen (chevron-richting; card-body i.p.v. titel); specificiteit boven `!important` (geheugen `feedback_avoid_important_css`); gedeelde-JS blast-radius bewust scheiden (generieke form-hide + sample-specifieke cosmetiek).

**Next steps / deferred:**
- **Rotation/catch-up niet uitgevoerd:** Sessie 175 was in CLAUDE.md gemarkeerd als eenmalige current.md-archivering (Sessie 81-164 → range-archieven) + standaard `N%5` rotatie (archiveer 165-169). Bewust gedeferd — grote, risicovolle operatie, niet gevraagd deze sessie. Aparte sessie waard.
- Brevo-404 best-effort vervolgwerk (uit Sessie 174) blijft open.

---

## Sessie 174: Mobiele PDF-download fix — sample-pentest lead magnet (19 jun 2026)

**Mission:** Heisenberg meldde dat de pentest-sample PDF-download op mobiel een foutmelding geeft — een al langer bekende, eerder geparkeerde bug. Doel: de beste fix voor de bezoeker, ongeacht moeite, inclusief het echt aanpakken van de Brevo-kant.

**Diagnose (cold-start research, plan-mode):**
- De PDF wordt niet direct vanaf de site gedownload. Flow: email op `sample-pentest.html` → double opt-in → welkomstmail met "Download Sample (PDF) ↓"-knop → `/assets/samples/pentest-playbook-sample.pdf`.
- Grep + sessie-logs onthulden de echte root cause, al gedocumenteerd in **Sessie 134** (`current.md` regels 3416-3504): Brevo wrapt de PDF-link in een click-tracking-redirect `r.sendibm1.com/?u=…&i=<token>`; het token is **eenmalig consumeerbaar**; Gmail-mobiel's security-prefetch consumeert het token vóór de gebruiker klikt → bij de echte klik **404** (~5-10% mobiele klikken). Unsubscribe/mirror-links werken wél (idempotente endpoints) — daarom faalt alleen de PDF-link.
- **Kernpunt:** de 404 ontstaat op Brevo's server vóór het request hacksimulator.nl bereikt → **geen repo-wijziging kan die redirect repareren**. Sessie 134 probeerde per-link/globale tracking-toggle (niet in Free/Starter-tier) + Button-block-split (404 bleef) → geparkeerd als "tier-limitatie".
- Apart ontdekt: `_headers` forceerde `Content-Disposition: attachment` op `/assets/samples/*` met comment "mobile webviews kunnen PDF niet inline" — **omgekeerd mentaal model**: iOS WKWebviews (Gmail/Outlook-app) kunnen een geforceerde download juist níet afhandelen, maar renderen een PDF inline wél.

**Strategie:** een betrouwbaar same-origin downloadpad bouwen dat Brevo's tracking volledig omzeilt (gegarandeerd, in onze hand), én de Brevo-kant zo goed mogelijk aanpakken (best-effort, tier-/support-afhankelijk → vervolgwerk Heisenberg).

**Work done:**
- `_headers`: `/assets/samples/*` `Content-Disposition: attachment` → `inline; filename="pentest-playbook-sample.pdf"` + comment gecorrigeerd.
- `sample-pentest.html`: download-CTA als **apart element** binnen `#success-message` (niet de tekst-span, want `brevo-submit.js` overschrijft die met Brevo's `json.message`). Directe same-origin `href="/assets/samples/pentest-playbook-sample.pdf"` met `download` + `target="_blank"` + `data-lead-download="pentest"`. Inline-style met CSS-variabele (consistent met bestaande inline-styles; CSP staat `style-src 'unsafe-inline'` toe → géén landing.css cache-bump-sweep nodig). Success-copy gecorrigeerd: noemt directe download + bevestigen-voor-nieuwsbrief, claimt niet onterecht 'al gemaild' (met double opt-in komt de PDF-mail pas ná bevestiging; wat direct verstuurd wordt is de bevestigingsmail).
- NEW `sample-download.html`: verzorgde `noindex` download/bedankt-pagina (clone landing-structuur, hergebruik navbar/footer-injectie + `landing.css`/`pages.css`). Same-origin download-knop + cover-thumbnail (`assets/products/eerste-pentest-playbook.png`) + cross-sell Gumroad `wmvpx` + terminal-CTA. **Niet** in `sitemap.xml`. Bestemming voor de welkomstmail-knop (één centrale downloadplek, twee ingangen).
- `src/analytics/events.js`: `leadMagnetDownload(sampleId, location)` helper (consistent met `leadMagnetSignup`).
- `src/ui/cta-tracking.js`: derde branch `[data-lead-download]` → `leadMagnetDownload` (CSP-safe, geen inline JS).
- `tests/e2e/lead-magnet.spec.js`: +4 tests (download-CTA zichtbaar + correcte href na mocked success; `sample-download.html` rendert + cross-sell + noindex; sitemap-exclusie; `lead_magnet_download`-event).

**Verificatie:** lokaal `@playwright/test@1.56.0` gepind (`--no-save`; matchte de provisioned `chromium-1194` — 1.55.0 wilde build 1187, ^1.56.1 wilde 1228) + statische server (`python3 -m http.server`) + `BASE_URL=localhost` → **10/10 lead-magnet E2E groen op chromium**. WebKit-download egress-geblokkeerd (`cdn.playwright.dev` 403) → iOS = handmatige real-device-check. Visueel geverifieerd (desktop + mobiel screenshot van `sample-download.html`). `validate-docs.sh` exit 0.

**Product-beslissing — double opt-in blijft AAN:** door de on-site instant download zijn "PDF krijgen" (nu meteen op de site) en "nieuwsbrief activeren" (nog steeds via double opt-in bevestiging) **losgekoppeld**. Niet overschakelen naar single opt-in (zou de deliverability-investering Sessies 134-136 — SPF/DKIM/DMARC, mail-tester 8.3+, Postmaster — ondermijnen via onbevestigde/typefout-adressen). De on-site download dekt het bezoekersprobleem al; double opt-in kost daardoor niets meer.

**Commits:** `8f2ce68` (fix: same-origin downloadpad + `_headers` + `sample-download.html` + events/tracking/tests) + `fb397ca` (success-copy aligned op behoud double opt-in). Branch `claude/focused-tesla-0grpev` → gemerged naar `main` (deze sessie).

**Learnings:**
- **De "foutmelding" was niet wat de codebase-comment suggereerde.** `_headers` zei "force download want webviews kunnen niet inline"; de échte bug is een Brevo-tracking-prefetch-404 — een aparte laag. Twee gestapelde issues niet verwarren: lees de sessie-historie (Sessie 134 had dit al exact gediagnosticeerd) vóór je een oorzaak aanneemt.
- **Sommige bugs zijn niet in-repo fixbaar.** De 404 zit op Brevo's infra (`r.sendibm1.com`) vóór het request ons bereikt. Eerlijk zijn dat een `_headers`-tweak dit NIET oplost (zou misleidend zijn); de juiste fix = een betrouwbaar pad bouwen dat het kapotte mechanisme omzeilt, niet doen alsof je het kapotte ding repareert.
- **`Content-Disposition: attachment` is omgekeerd voor iOS in-app webviews** — WKWebView rendert een 90 KB PDF wél inline maar kan een geforceerde download vaak níet afhandelen (vereist host-app download-delegate). Forceren brak precies de webviews die inline aankonden. `inline` = universeel veiliger + maakt embedding mogelijk.
- **Brevo overschrijft de success-span met `json.message`** → een persistente download-CTA moet een apart element in het panel zijn, niet de span. En de copy moet kloppen onder double opt-in (PDF-mail komt pas ná bevestiging — niet "al gemaild" claimen; de gebruiker vroeg hier terecht op door).
- **De PDF-URL is sowieso publiek/raadbaar** → de email-"gate" bood nooit echte bescherming; on-site ungated leveren kost geen security en wint enorm voor de bezoeker. Maar nieuwsbrief-consent apart double-opt-in houden beschermt de deliverability-investering.
- **Playwright-versie ↔ browser-build pinnen** — provisioned `chromium-1194` vereiste `@playwright/test@1.56.0`; `--no-save` zodat `package.json` (^1.56.1) ongemoeid bleef. Egress: npm-registry open, browser-CDN (`cdn.playwright.dev`) geblokkeerd (consistent met Sessie 172).

**Next steps (Heisenberg, Brevo-dashboard — best-effort, los van deze deploy):**
- Houd "Double confirmation email" AAN. Wijzig de Brevo Success message naar: "Gelukt! Je sample staat hieronder klaar. We hebben je ook een mail gestuurd — bevestig daarin je inschrijving voor onze maandelijkse tips." Mailknop-URL → `/sample-download.html`.
- Brevo-404 zelf: (1) her-check op een click-tracking-toggle (UI/tiers >1 jaar gewijzigd sinds Sessie 134); (2) geen toggle → support-ticket (tekst in `.claude/plans/lead-magnet-followup.md` regels 112-148); (3) tier-gated → kies bijlage (PDF in de mail, gratis/definitief), accepteer de minor-404 (site dekt het hoofdpad), of tier-upgrade. Custom tracking-subdomein lost dit waarschijnlijk NIET op (zelfde tokenmechanisme).
- iOS real-device-check van de download (WebKit lokaal niet testbaar).

**Metrics delta:** +1 pagina (`sample-download.html`, noindex, niet in sitemap). src/ ~622→623 KB (events.js + cta-tracking.js, +~0,6 KB). lead-magnet.spec.js +4 tests. Geen Terminal Core-runtime-impact (sample-pages buiten budget).

---

## Sessie 173: Launch-prep marketing-launch wo 24 juni — kit/visuals/homepage + datum-discipline-correctie (18 jun 2026)

**Mission:** Heisenberg wil aanstaande week de marketing-launch doen. De site is technisch al live; doel was bepalen wat de volgende stap is en de launch-prep volledig doen zodat de launch-dag pure handmatige uitvoering is. Launchdatum verschoven van het verlopen do 18 juni naar **wo 24 juni** (di/wo = sterkste HN/Reddit-dagen; Heisenberg heeft ma-do enige — geen hele dag — beschikbaarheid).

**Work done:**
- **Plan-mode verkenning:** ontdekt dat er al een compleet launch-pakket lag (Sessie 160-161): `docs/public-launch-runbook.md` (4 fasen) + `docs/launch-announcement-kit.md` (copy + kanalen + §5 uur-schema) + `docs/seo-launch-checklist.md` + `scripts/capture-launch-visuals.mjs`. Kernconclusie: project is niet meer te *bouwen* maar uit te *voeren*; kit stond alleen hardcoded op het verlopen do 18 juni.
- **WS1 — kit herplanned (`docs/launch-announcement-kit.md`):** do 18 juni → wo 24 juni (header §1, §5-titel, datums). Avond-ervoor → di 23 juni + GA4 Real-Time-verificatie toegevoegd aan de checklist. §5-tijdschema herontworpen voor beperkte beschikbaarheid: niet 09:00-20:00 uitgesmeerd maar geclusterd in een bewaakbaar blok (default 13:00-18:00 CET) met de reactie-gevoelige kanalen (EHGN/Reddit/Show HN ~15:00) vooraan en eigen netwerk (LinkedIn/X) aan de rand.
- **WS2 — launch-visuals geregenereerd:** `node scripts/capture-launch-visuals.mjs` → verse GIF (27 frames, 1000×640) + desktop (1280×720) + mobiel (375×812@2x) in `.playwright-mcp/launch/` (gitignored). Chromium bleek lokaal aanwezig (`ms-playwright/chromium-1194`) — de Sessie-172-egressblok gold alleen voor een *verse* `playwright install`. Render-en-meet: desktop + mobiel visueel geïnspecteerd (Read image) → nieuw **H-monogram**-logo, nmap-routerprofiel (53/80/443) met NL-context + TIP, geen banner. Oude artefacten (12 jun) toonden nog het `>_`-logo.
- **WS3 — homepage cornerstone-linking (`index.html`):** ontdekt dat de homepage-blogsectie ("Lees meer op onze blog") slechts 8 van 13 posts linkte; de sterkste/nieuwste ontbraken (Sessie 169 koos bewust de 5 vastzittende posts als crawl-nudge). 5 cornerstones toegevoegd (nmap, Wireshark, Hashcat, OWASP-hub, "Ethisch hacker worden") → homepage linkt nu alle 13 = complete interne linking vanaf hoogste-autoriteit-pagina + crawl-route. Platte lijst = nul layout-risico. Sitemap homepage `lastmod` 2026-06-15 → 2026-06-18 (echte edit-datum).
- **Datum-discipline-correctie (kern-learning, zie hieronder):** in eerste instantie `dateModified` + `article:modified_time` + sitemap-`lastmod` op 3 cornerstones (nmap/owasp/wireshark) naar 2026-06-24 gebumpt — maar **zonder** echte content-touch. Heisenberg vroeg terecht door ("waarom 24 juni / kan dat niet vandaag / wat hebben we eigenlijk gemodified?"). Inspectie toonde: interne links al compleet, sibling-cross-links bestaan al (nmap↔wireshark, owasp↔sql-injection), OWASP-post dekt de 2025-editie al (Sessie 165). Géén echte verbetering te maken → bump = fake-freshness die runbook Fase 2 (twee-staps-poort: échte touch ontgrendelt pas de datum-bump) + Sessie-169-anti-cargo-cult schendt. **Volledig teruggedraaid** (3 posts netto 0 wijziging in git). Heisenberg wees er daarna op dat het plan dit wél voorschrijft — klopt: maar de poort gate't op een échte touch, en die was er niet (discipline-clausule "niet aangeraakt → ongemoeid"). Eerlijke freshness-hefboom = verse launch-week-post (runbook "aanbevolen"), later samen te schrijven.
- **Geheugen:** `feedback_preserve_plan_gates.md` toegevoegd (+ MEMORY.md-index) — bij gepoorte plan/runbook-stappen: voorwaarde checken vóór de gated actie, poort als conditie coderen, afwijking melden i.p.v. wegredeneren.

**Commits:** `d50b981` (feat(home): homepage linkt alle 13 blogposts + sitemap lastmod) + `4dd17b5` (docs(launch): herplan aankondigings-kit naar wo 24 juni). Visuals gitignored (niet gecommit). Op `main`, deploy-ready.

**Learnings:**
- **Plan-poorten preserveren (2× geflipt dit gesprek: bump→revert→bevestig revert).** Een planstap "doe X eerst, dan pas Y" is een *voorwaarde*, geen volgorde-suggestie. Ik parafraseerde 'm in mijn eigen WS3 naar "X + Y" naast elkaar en deed daarna Y zonder X. De gated actie (datum) hoort downstream van z'n geverifieerde oorzaak (echte inhoudswijziging). → memory `feedback_preserve_plan_gates`.
- **`dateModified` = de dag van een echte touch+deploy** — nooit een toekomstige of "launch-week"-datum zonder bijbehorende wijziging (Google klemt toekomstige datums + wantrouwt niet-onderbouwde freshness). De eerlijke crawl-route is: homepage echt wijzigen (truthful lastmod) → Google hercrawlt homepage → ontdekt nieuwe cornerstone-links → crawlt die.
- **WS3 versmald op grond van inspectie, niet aanname** — "strengthen internal links" was al gedaan (CLAUDE.md + grep bevestigden); forceren = cargo-cult (Sessie 169). De echte winst zat in de homepage (linkte de cornerstones niet), niet in de al-complete posts.
- **Visuals = van productie** → tonen automatisch de live staat (nieuw logo); regenereren was nodig juist door de logo-swap (Sessie 171). "Wie host het bestand bepaalt de update-route."
- **Maandag afgewezen voor launch** (zwakke HN/Reddit-dag); responstijd in de eerste uren na elke post is de echte succesfactor, niet een hele dag aanwezig zijn → schema geclusterd in bewaakbaar blok.

**Next steps:**
- Verse launch-week blogpost schrijven (samen) — kandidaten: Metasploit, Hydra, `grep`/`find`-tutorial.
- Handmatig 23-24 juni: GSC sitemap-resubmit + indexering, Bing import, Rich Results/FB/X validators, GA4 Real-Time-verificatie + annotatie, posten per kit §5.
- Heisenberg deployt de komende dagen (vóór 24 juni); deze commits liften mee.

**Metrics delta:** bundle ground-truth Sessie 173: src 622 / styles 378 / blog 417 / assets 1031 KB (VALIDATE-BUNDLE marker ge-refreshed). Geen runtime/JS/CSS-wijziging (root `index.html` + `sitemap.xml` vallen buiten de gemeten dirs). Tests 23 spec files ongewijzigd. validate-docs fast + `--deep` exit 0.

---

## Sessie 172: GSC "Verkopersvermeldingen" merchant-listing fix + per-gids covers (17 jun 2026)

**Mission:** Google Search Console meldde 4 problemen onder "Gestructureerde gegevens voor Verkopersvermeldingen" (merchant listings) op `hacksimulator.nl` — 1 kritiek (ontbrekend veld `image`) + 3 niet-kritiek (`hasMerchantReturnPolicy` in offers, geen algemene ID zoals gtin/merk, `shippingDetails` in offers). Doel: de Product-markup valide maken zónder misleidende data.

**Work done:**
- **Bron gelokaliseerd:** de enige `Product`-markup zat in `gidsen.html` (JSON-LD `CollectionPage` → `ItemList` met 3 Gumroad-gidsen). De `offers` hadden alleen `price`/`priceCurrency`/`availability`.
- **4 velden per product eerlijk ingevuld (digitaal download-product):**
  - `image` (kritiek): aanvankelijk gedeelde `og-image.png`, daarna vervangen door eigen cover per gids (zie hieronder).
  - `brand`: `{"@type":"Brand","name":"HackSimulator.nl"}` — eigen producten, lost de "algemene ID"-suggestie op (een eigen PDF heeft geen gtin; `brand` is de juiste identifier).
  - `hasMerchantReturnPolicy`: `MerchantReturnPolicy` met `applicableCountry: NL` + `returnPolicyCategory: MerchantReturnNotPermitted` — accuraat: bij directe digitale download vervalt het herroepingsrecht (art. 6:230p BW).
  - `shippingDetails`: `OfferShippingDetails`, `shippingRate` €0, `deliveryTime` handling+transit 0 dagen — instant download, géén verzendkosten. **NIET** "gratis product": `price` blijft `5.00`; verzendkosten ≠ prijs (gebruiker vroeg hierop door — terecht, maar correct).
  - Tevens `offers.url` toegevoegd (Gumroad-link per product).
- **Verbeterpunt (gebruiker vroeg dit expliciet mee te nemen): losse cover-image per gids.** Geen per-product covers aanwezig (alleen `og-image.png` + brand-logo's). NEW `scripts/build-product-covers.mjs` rendert 3 covers (1200×630 @2x) → `assets/products/{ethisch-hacken-wet,eerste-pentest-playbook,ctf-leerplan}.png`. On-brand: H-monogram (groen-op-donker), wordmark met groene `.nl`, eyebrow-chip, witte titel (2 regels), neon-balk, mono-footer "PDF-gids · Nederlands · vanaf €5" + groene cursor. Merkkleuren uit `assets/brand/README.md`.
- **Correctie na review (gebruiker): "pay what you want" zonder minimum is misleidend.** De gidsen hebben een vloer (€5 per gids, €10 bundel; Gumroad name-your-price-met-minimum). Cover-footer gewijzigd "pay what you want" → "vanaf €5" (3 covers her-gerenderd). Tevens 2 kale plekken in `gidsen.html` (hero-subtitle + bundel `gids-price-sub`) uitgelijnd op het al-accurate patroon van de prijskaartjes ("vanaf €X (pay what you want)").
- **Rasterizer-pivot:** Playwright/chromium (Sessie 171-patroon) faalde — `npx playwright install chromium` gaf 403 "Host not in allowlist: cdn.playwright.dev" (egress-policy). Overgestapt op `@resvg/resvg-js` (prebuilt Rust SVG→PNG, geen browser-download). Layout handmatig in SVG (resvg auto-wrapt geen tekst); systeemfonts Liberation Sans (titel/wordmark) + DejaVu Sans Mono (eyebrow/footer). `@resvg/resvg-js` → `devDependencies` (build-only, naast gifenc/pngjs).
- **Render-en-meet:** alle 3 covers visueel geverifieerd (Read image) — langste titel + langste eyebrow passen binnen het frame.
- **`image`-velden gekoppeld** aan de eigen covers; beide JSON-LD-blokken (CollectionPage + BreadcrumbList) parsen valide via Python `json.loads`.
- **Follow-up (gebruiker vroeg ernaar): bundel als 4e Product toegevoegd.** De bundel (`emzjvj`, "HackSimulator Starter Kit", €10) zat nog niet in de markup terwijl het de primaire CTA is. Toegevoegd als `position: 4` met dezelfde eerlijke velden + eigen cover `assets/products/bundel-starter-kit.png` (eigen footer "3 PDF-gidsen · ~47 pagina's · vanaf €10"; ~47 = officiële Gumroad-telling 13+19+15, een bestaande "~75"-fout in de pagina-tekst tegelijk gecorrigeerd op 3 plekken).
- **Site-brede paginatelling-correctie (gebruiker ving het door).** De per-gids badges op `gidsen.html` zeiden 15/35/25 (=75) en `sample-pentest.html` zei "volledige ~35 pagina's" — in tegenspraak met de officiële PDF-telling (Sessie 165 verifieerde 13/19/15/9 + `gumroad-listings.md`): Wet 13 / Pentest 19 / Leerplan 15 (=47). Bron-conflict niet gegokt → via AskUserQuestion bevestigd: 13/19/15 klopt. Gecorrigeerd: 3 badges (`gidsen.html` 15→13, 35→19, 25→15) + sample-pagina full-count (~35→~19). Sample-gratis "9 pagina's" is een los, consistent getal (blijft). De PDF's zelf waren niet te tellen (3 betaalde = gitignored build-output, `typst` ontbreekt + egress blokkeert install). Schema nu 4 producten, allen valide.
- **Gumroad-brontekst pricing-alignment (advies-vraag gebruiker).** `gumroad-listings.md` adviseerde nog €0-minimum PWYW (oude lead-magnet-strategie) — botst met de bevestigde €5/€10 minima + de live site. Advies gegeven + doorgevoerd: €5/€10 is juist want de gratis Sample Pentest vervult de lead-magnet-rol al (schone funnel-scheiding). Doc bijgewerkt (prijstabel, aanbeveling, setup-stap, suggested price, test-stappen, checklist) met de strategie-shift als historische noot. Gumroad-dashboard zelf (live minima) = handmatige check voor gebruiker.

**Commits:**
- `d67d3af` — `fix(seo): los GSC merchant-listing velden op in gidsen.html Product schema`
- `672c32e` — `feat(seo): losse cover-images per gids voor Product-markup`
- `21567d0` — `fix(seo): cover-footer 'pay what you want' -> 'vanaf €5' (minimum klopt)`
- `00efe59` — `fix(copy): kale 'pay what you want' op gidsen.html krijgt minimum erbij`
- `02ffb1e` — `docs(sessions): Sessie 172 /summary`
- `8580969` — `feat(seo): bundel als 4e Product in gidsen.html merchant-listing markup`
- `5908185` — `fix(copy): paginatelling ~75 -> ~47`
- `4403375` — `fix(copy): paginatelling site-wide consistent op echte PDF-telling 13/19/15`
- `d85e442` — `docs(gumroad): pricing-brontekst naar €5/€10 minimum (was stale €0-PWYW)`

**Learnings:**
- **Merchant-listing-velden voor een digitaal product zijn eerlijk in te vullen — geen cargo-cult nodig.** `MerchantReturnNotPermitted` (NL, herroepingsrecht vervalt bij download) en `shippingDetails` €0/0-dagen (instant download) zijn feitelijk juist; géén verzonnen gtin (een eigen PDF heeft er geen — `brand` is de correcte identifier). Dit volgt de Sessie-169-lijn "geen cargo-cult-SEO".
- **`shippingRate: 0` ≠ "gratis product".** Schema scheidt `price` (5.00, blijft staan) van verzendkosten (0). De gebruiker vroeg hier scherp op door; de markup zegt "€5, €0 verzendkosten", niet "gratis". Belangrijk om dit expliciet te kunnen uitleggen.
- **"Pay what you want" zonder genoemd minimum is misleidend wanneer er een vloer is.** Gumroad PWYW heeft een minimumprijs (€5/gids, €10/bundel); kale PWYW suggereert €0. Altijd de vloer noemen ("vanaf €5 (pay what you want)"). De gebruiker ving dit in mijn cover-footer; het stond ook in 2 hero-plekken. Lijn nieuwe copy uit op het al-accurate prijskaartje-patroon i.p.v. een eigen kale variant introduceren.
- **Een feitelijke claim (paginatelling) overnemen uit ongeverifieerde naburige copy plant een fout voort.** Ik nam "~75 pagina's" over uit bestaande pagina-tekst; die "75" was zelf de som van foute badges (15/35/25). Bij een numerieke claim die op meerdere plekken staat: zoek de canonieke bron (hier `gumroad-listings.md` + de Sessie-165 PDF-telling 13/19/15) en sweep site-breed, niet één plek. Bij bronconflict zónder lokaal verifieerbare ground-truth (PDF's niet te tellen): vraag de gebruiker i.p.v. te gokken (AskUserQuestion bevestigde 13/19/15).
- **Achterhaalde strategie in een planning-doc wordt een toekomstige fout-injectie.** `gumroad-listings.md` adviseerde nog €0-minimum (oude lead-magnet-strategie) terwijl de realiteit €5/€10 is — copy-paste daarvan naar Gumroad zou de prijzen breken. Houd planning-docs in lijn met de live realiteit en bewaar de "waarom-gewijzigd" als korte noot i.p.v. de stale instructie.
- **Egress-policy breekt de bestaande rasterizer-route — ken een browserloos alternatief.** `cdn.playwright.dev` staat niet in de allowlist → chromium niet te downloaden. `@resvg/resvg-js` (prebuilt native, via npm-registry die wél bereikbaar is) rasteriseert SVG→PNG zonder browser. Trade-off: resvg auto-wrapt geen tekst → handmatige regel-layout in de SVG.
- **`package-lock.json` is gitignored in deze repo** → een build-dependency toevoegen vergt een handmatige `devDependencies`-entry in `package.json` voor reproduceerbaarheid (de lockfile draagt 'm niet mee).
- **De kritieke `image`-fix telt pas na deploy + GSC re-crawl** → handmatige actie "Validatie van fix valideren" in GSC.

**Next steps:**
- Handmatig (Heisenberg): na Netlify-deploy in GSC bij de melding "Validatie van fix valideren" klikken.
- Optioneel later: de bundel (`emzjvj`) heeft nog géén Product-markup (alleen de 3 losse gidsen). Bewust buiten scope — GSC flagde alleen de bestaande 3.

**Metrics delta:** `assets/` +~255 KB (3 covers ~85 KB elk; SEO/content-pijler, budgetloos — buiten Terminal Core <400 KB). `gidsen.html` +~2,9 KB JSON-LD. Terminal Core runtime onveranderd (geen `src/`/`styles/`-wijziging). E2E specs 23 / 172 tests (ground-truth, ongewijzigd).

---

## Sessie 171: Logo-herontwerp H-monogram + asset-keten + brand-kit (16 jun 2026)

**Mission:** Gebruiker vroeg het bestaande logo te "vernieuwen/verbeteren/perfectioneren". Het oude logo was een generieke terminal-prompt `>_` (HTB-groene tegel) — technisch netjes maar het meest voorkomende dev-tool-symbool, nul onderscheidend vermogen. Doel: een uniek, ownable, op alle web-formaten goed werkend logo ontwerpen en volledig doorvoeren.

**Work done:**
- **Ontwerp-proces (render-en-meet via Playwright):** 3 richtingen → gekozen H-monogram → 4 verfijningen → V2 "H op een command-line-balk" gewonnen. Twee kandidaten afgeschoten ná browser-render (chevron-crossbar las als "skip/next-track"-mediaknop; losse cursor-block las als een punt → afkorting). Elk concept gerenderd op 512/64/32/**16px** + licht/donker/mono om de favicon-bottleneck te toetsen. Geen rasterizer geïnstalleerd (`rsvg`/`inkscape`/`cairosvg` ontbraken) → SVG→browser-canvas→PNG.
- **Nieuw logo:** H-monogram (de letter H opgebouwd uit terminal-primitieven, staand op een `_`-balk). Eén silhouet, twee betekenissen (naam + terminal). 4 rechthoeken → robuust op 16px.
- **Favicon-keten vervangen + alle inline-kopieën:** `favicon.svg` (bron 32-grid) + `navbar.js` (2×) + `footer.js` (inverted glyph zónder tegel, `viewBox 6 6 20 20`, neon-groen op het donkere frame) + `docs/products/logo.svg` (PDF-cover). PNG's pixel-exact gerenderd: `favicon-96` (afgeronde tegel), `apple-touch` (vol-vlak), `web-app-manifest-192/512` (**vol-vlak maskable** — was incorrect afgeronde transparante tegel), `favicon.ico` (16/32/48 PNG-payloads, met Python struct).
- **Brand-kit NEW `assets/brand/`:** `logo.svg` (tegel) + `logo-on-dark.svg` + `logo-mono-black/white.svg` + PNG-exports 256/512/1024 + `README.md` (gebruik per context + merkkleuren `#9fef00`/`#0d1117`/`#c9d1d9`). Alle 6 varianten visueel geverifieerd op hun bedoelde achtergrond.
- **Social-kaart `assets/og-image.png`:** getrouw herbouwd (terminal-mockup nmap-output) mét het nieuwe H-glyph + subtiele groene glow; browser-render exact 1200×630 (matcht og:image:width/height).
- **og:image cache-bust:** `?v=2` op og:image + twitter:image — **60 referenties over 25 pagina's** (`assets/og-image.png"` → `?v=2"`). Reden: `/assets/* immutable 1jr` + social-scraper-cache; zonder URL-wijziging blijft de oude kaart hangen.
- **Gumroad-PDF's herbouwd (typst 0.13.1):** 3 betaald + sample; logo op cover geverifieerd via PDF-pagina 1. Geserveerde lead-magnet `assets/samples/pentest-playbook-sample.pdf` bijgewerkt (md5 bevestigd).
- **Build-DRY:** `build-pdfs.sh` kopieert het logo nu uit canonieke `assets/brand/logo.svg`; `docs/products/logo.svg` gitignored + `git rm --cached` (build-managed). End-to-end getest: logo.svg verwijderd → build regenereerde 'm (md5 identiek) → 4 PDF's compileerden.

**Commits:** deze sessie — `feat(brand): nieuw H-monogram logo door volledige asset-keten + brand-kit + og-kaart + PDF-rebuild + og:image cache-bust + build-DRY` (hash in git log). 3 betaalde PDF's = handmatige Gumroad-upload (buiten repo).

**Learnings:**
- **Render-en-meet is onmisbaar bij ontwerp:** twee kandidaten leken in het hoofd prima maar faalden zichtbaar pas in de browser (verkeerde associatie: skip-knop / afkorting-punt). Een logo bestaat op het netvlies, niet in je hoofd.
- **Cache maskeert verse code → vals-negatief:** de eerste navbar-verificatie toonde nog `>_` doordat de Python-testserver geen `Cache-Control` stuurt en de browser de oude ES-module cachete; de live DOM uitlezen + no-cache server op verse origin bewees dat de edit klopte. (= troubleshooting #2 in de praktijk.)
- **Cache-bust is per-asset, niet alles-of-niets:** alleen waar `immutable` + gelijkblijvende-URL samenvallen (og:image) is `?v=2` nodig; favicons (root, revalideren) niet; JS-imports niet (≤7-dagen cosmetisch verlies, ES-module-query is invasief + botst "vanilla, no build").
- **"Wie host het bestand" bepaalt de update-route:** site-assets (favicon, og-image, sample) verversen via deploy; Gumroad-PDF's zijn een extern eilandje met eigen kopie → handmatige re-upload. De sample staat byte-identiek in `docs/products/` (build-output, gitignored) én `assets/samples/` (geserveerd, getrackt) = de gedocumenteerde bron→build→publiceer-flow, geen bug.
- **Maskable PWA-iconen horen vol-vlak:** `purpose:"maskable"` betekent dat de OS zelf maskt; transparante hoeken geven artefacten. Glyph binnen de safe-zone, achtergrond tot de rand.
- **DRY via build-stap > 3e getrackte kopie:** het logo zat op 3 plekken in git; door `build-pdfs.sh` het uit de canonieke bron te laten kopiëren (en `docs/products/logo.svg` te gitignoren) is er nog 1 bron + 1 favicon, consistent met de PDF-artifact-flow.

**Next steps:**
- **Handmatig (Heisenberg):** 3 betaalde PDF's opnieuw uploaden naar Gumroad (`juridische-gids.pdf`, `pentest-playbook.pdf`, `leerplan.pdf`).
- Na deploy optioneel social-preview re-scrape forceren (Facebook Sharing Debugger / LinkedIn Post Inspector) als oude kaarten blijven hangen.

**Metrics delta:** `assets/` ~695 KB (gegroeid door `assets/brand/` PNG-exports + herbouwde og-image). Runtime-bundle `src/` gedrag ongewijzigd (navbar/footer SVG-swap, verwaarloosbare grootte-delta). Tests onveranderd: 23 spec-files / 172 test-cases. Geen css/js/_headers/netlify-gedragswijziging.

---

## Sessie 170: Structuuranalyse projectopbouw + veilige repo-opruiming (16 jun 2026)

**Mission:** Gebruiker vroeg de bestands-/mapstructuur te analyseren ("is dit goed of kunnen we verbeteren?") met als harde randvoorwaarde dat de functionaliteit volledig intact blijft. Beoordelen, en alleen veilige verbeteringen doorvoeren.

**Work done:**
- **Plan-mode verkenning (read-only):** structuur in kaart gebracht — top-level dirs + groottes, file-type-distributie (609 files excl. git/node_modules), git-tracked overzicht, `src/`-tree per subdir, grootste JS-files, orphan-heuristiek, JS-laad-mechanisme (entry points), `docs/`-tree, alle HTML-pagina's, cruft-hunt.
- **Verdict: structureel goed georganiseerd.** Geverifieerd: schone domein-indeling `src/` (`commands/{filesystem,network,security,system,special}`, `core`, `ui`, `filesystem`, `gamification`, `tutorial`, `utils`, `analytics`); **nul echte weesmodules** (`blog-theme.js` léék orphan vanuit `src/` maar wordt door alle 10 blogpagina's geladen); geen getrackte backups/cruft; artifact-dirs (`test-results/`, `playwright-report/`, `.playwright-mcp/`) correct gitignored; docs goed beheerd (afgeronde plannen al in `archive/`, levende docs gelinkt vanuit trackers).
- **"By-design", niet aangeraakt:** 9 root-HTML's (= schone Netlify-URLs; verplaatsen breekt prod-URLs+SEO+links), `commands/index.html` (route-pagina `/commands/`, geen code-duplicaat), twee script-laad-conventies (`type="module"` vs. globale `defer` — globals op `window`, uniformeren hoog risico), `assets/legal/*.html` (geserveerde URLs), `SESSIONS.md`+`docs/sessions/` (bewust roterend logsysteem).
- **Veilige acties (commit `480a227`, 7 files, nul js/css/html/_headers/netlify-wijziging):**
  - `docs/products/*.pdf` (5 bestanden, ~632 KB) uit git via `.gitignore`-regel `docs/products/*.pdf` + `git rm --cached` — reproduceerbare build-output uit `.typ` (via `build-pdfs.sh`). Bestanden blijven op schijf; `.typ`-bronnen + geserveerde lead-magnet `assets/samples/pentest-playbook-sample.pdf` (gelinkt vanuit welkomstmail) blijven getrackt.
  - Provenance-header in `docs/products/build-pdfs.sh` (bron→build→publiceer-flow expliciet).
  - NEW `docs/architecture-review.md` (~1 pagina): verdict + by-design-overzicht + product-PDF artifact-flow + "bewust niet gedaan".
- **Cache-bust-analyse (read-only, niet uitgevoerd):** 9 inconsistente `?v=X`-schema's over 23 HTML-bestanden; normaliseren raakt live browsercaching (`max-age=604800`), fout = lokaal onzichtbaar + treft terugkerende bezoekers tot 7 dagen; echte automatisering vereist build-stap (botst "vanilla, no build"). Apart te behandelen indien gewenst.

**Commits:** `480a227` (chore(repo): untrack herbouwbare product-PDF's + structuurreview) + `2034a30` (/summary doc-sync) + `279bddb` (docs(sessions): session-log rotatie-conventie vastgelegd — deblokkeert bulk-rotatie; vervolgvraag binnen dezelfde sessie).

**Learnings:**
- **De PDF-"duplicaat" was geen bug maar een gedocumenteerde bron→publiceer-pijplijn** (`.typ` → `docs/products/*.pdf` build → kopie naar `assets/samples/`). `cmp` bevestigde byte-identiek. De juiste fix is build-output untracken, niet één van de twee verwijderen.
- **"Opruimen onder de vlag grondig" durven weigeren:** de in plan-mode goedgekeurde doc-verplaatsing (afgeronde plan-docs → `archive/`) tijdens uitvoering laten vallen toen bleek dat de inbound refs historische log-narratie zijn in `current.md` (een door `validate-docs.sh` bewaakt bestand) en één doc nog "pending" was. Cosmetische winst (1 map dieper) < kosten (gated historisch log editen). Generaliseert de Sessie-169-learning naar de eigen workflow.
- **Orphan-heuristiek moet álle consumers scannen:** eerste sweep miste `blog/`-HTML → vals "orphan"-alarm op `blog-theme.js`. Verifieer vóór je "verwijderbaar" claimt — exact het patroon dat een echte breuk had veroorzaakt.
- **Plan-mode AskUserQuestion bij scope-keuze + risico-asymmetrie:** scope (veilig vs. rapport vs. diepere refactor) is gebruikers-territorium; cache-bust-risico expliciet uitgelegd vóór de keuze i.p.v. mechanisch uitvoeren.

**Next steps:**
- Optioneel: cache-bust `?v=X` normaliseren (apart, mét E2E-verificatie) — niet gebundeld in opruiming.
- Session-log-conventie vastgelegd in NEW `docs/sessions/README.md` (range-naamgeving `archive-sNNN-sMMM.md`; legacy `archive-q*` bevroren want fout gelabeld met 2025-content). SESSIONS.md-index gecorrigeerd (stale "88-160" → "81-170"). **Sessie 175 = eenmalige catch-up** van de backlog (Sessie 81-164 → range-archieven). Deferral-blokkade (ontbrekende bestemming) opgelost.

**Metrics delta:** Bundle runtime onveranderd (geen `src/`/`styles/`-wijziging); test-suite onveranderd (197 tests / 23 spec files); git-tree −632 KB binaries (PDF's untracked). validate-docs fast + `--deep` exit 0.
