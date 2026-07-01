# Sessie-archief 175-179 — HackSimulator.nl

**Range-archief** (geroteerd uit `current.md`, Sessie 190). Nieuwste-eerst.
Conventie: `docs/sessions/README.md`.

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

