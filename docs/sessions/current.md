# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

---

## Sessie 209: W2 browserverificatie — kwaliteitsronde bewezen in de browser (05 aug 2026)

**Mission:** De drie terminalwijzigingen uit de Sessie-208-kwaliteitsronde (skip-certificaat DEELNAME vs VOLTOOIING, helpsysteem-escalatie bij correct command + verkeerd argument, bestaande localStorage-voortgang overleeft de leerpad-wijziging) waren nooit in een live browser getest. Schrijf en draai Playwright-tests die bewijzen dat ze werken.

**Branch:** `claude/ultraplan-opvolging-eyzgd4` (zelfde commit `61aa87b` als `claude/quality-assurance-content-strategy-x5rsbd`).

### Regressiecheck

Volledige Chromium-suite gedraaid tegen een lokale no-store server (`scripts/nostore-server.py` poort 8899): **237 passed / 7 failed / 5 skipped**. Alle 7 failures zijn pre-existing/omgevingsspecifiek:
- 5× `tutorial-gestures.spec.js` — iPhone 13 device-emulatie-artefact (geen echte touch in headless Chromium)
- 1× `responsive-ascii-boxes.spec.js` — live resize reflow timing
- 1× `tutorial-mobile.spec.js` — briefing render timing

Geen regressies van de kwaliteitsronde-wijzigingen.

### NEW `tests/e2e/w2-verification.spec.js` (6 tests)

**(a) Skip-certificaat onderscheid (2 tests):**
- `7x skip geeft DEELNAME-certificaat, niet VOLTOOIING`: start `tutorial fundamentals`, skip alle 7 stappen, assert `MISSIE DOORLOPEN` (niet VOLTOOID), `tutorial cert` → `CERTIFICAAT VAN DEELNAME` + `0/7`.
- `mix van solve + skip geeft correct aantal in certificaat`: los pwd+ls echt op, skip 5 stappen → `CERTIFICAAT VAN DEELNAME` + `2/7`.

**Code-pad bewezen:** `tutorial-manager.js:251-282` (skip incrementeert `currentStep` maar NIET `stepsSolved`) → `certificate.js:56` (`fullySolved = stats.stepsCompleted >= stats.totalSteps`) → `certificate.js:70` (VOLTOOIING vs DEELNAME label).

**(b) Helpsysteem-escalatie (2 tests):**
- `na 3x nmap zonder args verschijnt man-page-tip`: `nmap` 3× → `man nmap`-tip verschijnt.
- `escalatie vuurt NIET tijdens een actieve tutorial`: start tutorial, `nmap` 3× → tip verschijnt NIET (tutorial heeft eigen hint-ladder).

**Code-pad bewezen:** `terminal.js:392-397` (roept `helpSystem.recordUsageError()` aan als `_hasErrorOutput(output)` true is EN niet in tutorial/challenge) → `help-system.js:41-48` (tip bij elke 3e fout).

**(c) localStorage backward-compat (2 tests):**
- `pre-change voortgang (zonder stepsSolvedByScenario) werkt nog`: seed oud formaat (`completedScenarios: ['recon']`, geen `stepsSolvedByScenario`), leerpad toont recon als voltooid, certificaat zegt VOLTOOIING (fallback: `getSolvedSteps()` retourneert `scenario.steps.length`).
- `bestaande onboarding-voortgang overleeft reload`: voer pwd/ls/whoami uit, reload, leerpad toont ze als geprobeerd.

**Code-pad bewezen:** `tutorial-manager.js:87-93` (`getSolvedSteps()` valt terug op `scenario.steps.length` voor data zonder `stepsSolvedByScenario`).

### Metrics

- **Bundle:** src=696 KB, styles=398 KB, blog=442 KB, assets=1731 KB (ongewijzigd — alleen tests toegevoegd)
- **Playwright:** 30 spec files, ~243 tests per browser-project
- **Geen runtime-codewijzigingen** — alleen verificatie van bestaande functionaliteit

### Learnings

- **Chromium-binary-pad in CI:** Playwright verwacht een specifiek pad (`chromium_headless_shell-1234/…`), maar de pre-installed binary staat op `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Fix via `CHROMIUM_PATH` env var (de config leest `process.env.CHROMIUM_PATH`).
- **Accepteer pre-existing failures als baseline:** 7/249 failures die óók op productie reproduceren zijn geen regressie. Documenteer ze als baseline i.p.v. ze te repareren in een verificatiesessie.

---

## Sessie 208: Advertenties eruit, kwaliteit aantoonbaar, blog meetbaar (03 aug 2026)

**Mission:** Heisenberg stelde vier vragen tegelijk: haal AdSense weg als het niets oplevert; moeten we meer op de gidsen focussen als die wél verkopen; hoe kan hij de kwaliteit van de inhoud garanderen terwijl hij zelf geen securityexpert is en alles met AI heeft gebouwd; en hoe haalt hij meer uit de blog. Hij koos "alles in één keer", vóór hij woensdagochtend de launch verder oppakt.

**Beslissingen vooraf (via vragen):** 1-5 Gumroad-verkopen → betalingsbereidheid is aangetoond, dus géén vierde gids maar de funnel naar de drie bestaande verbeteren. Docenten zijn géén doelgroep — die suggestie kwam uit mijn eigen `docs/seo-launch-checklist.md:57`, één rij in een lijst van acht backlink-doelen, geen doelgroepbesluit. Voor de expertreview werft hij een gratis vrijwilliger.

### W1 — AdSense volledig verwijderd

**Grond:** €0 gemeten opbrengst tegen 251,7 KB third-party en 73% van alle blokkeertijd (`docs/perf-third-party-audit.md`). Het eigen monetisatie-onderzoek concludeerde in maart 2026 al: "AdSense optimaliseren maakt het niet de moeite waard om er tijd aan te besteden" (`docs/archive/monetization-plan-v2.md:181`). Auto-ads stond dashboard-geverifieerd uit, dus verwijderen was mechanisch zonder verborgen omzetrisico.

**Uitgevoerd:** 44 advertentieblokken uit 20 bestanden (scriptmatig, met blok-detectie op `<div>`-diepte), 27 `google-adsense-account`-meta's, `data-adsense` van 19 pagina's, de `loadAdSenseAfterConsentDefaults`-IIFE + de drie `ad_*`-consentdefaults, `loadAdSense()` en de ad-tak in `acceptConsent()`, de restore in `init-analytics.js`, 63 regels CSS, 5 ad-domeinen uit de CSP (`frame-src` → `'none'` want alleen ad-iframes gebruikten het), `ads.txt` + het `_headers`-blok, en de `["AdSense"]`-regel uit de keyword-gate van `validate-docs.sh` (die laatste bewust als sluitstuk, anders faalt de pre-commit hook halverwege).

**Consent-banner 3 → 2 knoppen, zonder migratie.** Het opgeslagen JSON-formaat blijft `{necessary, analytics, …}`; we schrijven alleen `advertising` niet meer. Daardoor houdt élke bestaande bezoeker zijn keuze en ziet de banner niet opnieuw. Live geverifieerd in vier scenario's: vers (2 knoppen, 0 ad-requests, 0 GA vóór toestemming, `{"necessary":true,"analytics":true}` erná), oude `advertising:true` (geen banner, GA laadt), legacy-string `"true"` (geen banner, GA laadt), geweigerd (geen banner, geen GA). Nul CSP-fouten.

**Rood-op-mutant.** Een nulmeting achteraf bewijst niets. Daarom `git archive HEAD` naar `/tmp/pre-change` + een tweede no-store server op poort 8898: dezelfde meting gaf **2 advertentieverzoeken + 3 `<ins>` + 3 `.ad-container` vóór, en 0/0/0 ná**.

**Bijvangst:** `commands/index.html` was de enige pagina met een **inline** Consent Mode-script. De CSP heeft geen `'unsafe-inline'` in `script-src`, dus dat script draaide daar nooit — die pagina had structureel geen consent-defaults. Nu op het externe `consent-default.js` gezet, zoals de andere 19.

**Legal:** privacy §5.3 en de cookie-tabelrijen vervallen; cookies §2.3 herschreven naar "die plaatsen we niet" met de DPA-alinea omgezet van AdSense naar Analytics. Geknipt zou de documenten inconsistent hebben gelaten — er blijven analytics-cookies.

**Meting:** module-cascade op `/terminal.html` lokaal 579 → 301 ms (mediaan van 3). De echte winst (251,7 KB) is alleen op productie te meten; uitgaand verkeer is hier geblokkeerd. `MODULE_CASCADE`-budget van 3000 → 2500 ms met een expliciete TODO om ná de deploy verder aan te scherpen.

### W2 — Kwaliteit aantoonbaar maken

**Het kernprobleem:** alles wat automatisch bewaakt werd was *structureel*. Geen enkele check keek of een bewering wáár is. 41 man pages, 56 definities, alle tutorial-uitleg: nooit gecontroleerd.

- **NEW `scripts/build-review-package.mjs`** → `docs/review/expert-review-pakket.md`. Destilleert uit de bron 172 controleerbare beweringen (29 commands, gelabeld `output` vs `handleiding`, met regelnummer) + 56 definities, elk met ☐ klopt / ☐ klopt niet / ☐ te vaag. Uit de bron genereren betekent: geen achtste plek die kan driften, en een tweede ronde kost één commando. Claim-detectie op getallen-met-eenheid, CVE's, poorten, wetsartikelen en `[TIP]`/`[!]`, mét een code-filter zodat er geen JavaScript in de vragenlijst belandt.
- **NEW Check 6d** in `validate-docs.sh`: badges per zeldzaamheid, `alle N challenges`-tekst, en scenario-registratie. Ving meteen een echte fout: de `achievements`-man-page claimde **4** RARE badges tegen **5** in `badge-definitions.js` (drie andere plekken noemden 20, 21 en 22). De eerste versie van de scenario-assertie faalde óók — terecht: scenario's worden geïmporteerd in `core/terminal.js`, niet in `tutorial-manager.js`.
- **NEW `#verantwoording`** op `over-ons.html`: hoe het gemaakt is (één developer + AI, geen securitycredentials), wat wél gecontroleerd is, wat nog niet, en waar je fouten meldt. In een eigen `.verantwoording-card` mét light-theme-override — de eerste versie was grijs op wit in light mode (Sessie 44-valkuil).
- **Certificaat-tegenstrijdigheid opgelost:** een downloadbaar "CERTIFICAAT VAN MEESTERSCHAP" naast een FAQ die zegt dat er geen certificaat is. Eén gedeelde `CERT_DISCLAIMER` in `certificate-templates.js`, gebruikt door beide generatoren, inclusief de mobiele variant, gewordwrapt omdat de box tot 30 tekens smal kan worden. Geverifieerd op 1280/900/700/500/375px: randbreedtes uniform, disclaimer overal aanwezig.
- **Zichtbare controledatum op 14 posts** met de échte datum: 14 jun 2026 voor de 13 posts uit de feitencontrole van Sessie 164, 3 aug voor de metasploit-post (daarna geschreven, nu nagelopen: MS17-010/WannaCry 2017, CVE-2019-0708, CVE-2021-44228, CVE-2014-6271 en de patch-vóór-WannaCry-tijdlijn kloppen). Gate in `validate-blogs.sh` zodat de volgende post het niet vergeet.
- **NEW `.github/workflows/validate.yml`** — de gates draaiden uitsluitend als lokale pre-commit hook; `--no-verify`, een andere machine of de webinterface omzeilde ze volledig.

### W3 — Gidsen-funnel

De blog stuurde 14 links naar Gumroad; er kwam er **één** terug. Elke gids-kaart linkt nu 3 thematisch passende blogposts ("Gratis achtergrond bij deze gids"), wat tegelijk interne linkwaarde geeft aan de onderlinkte posts.

### W4 — Blog

- **`data-terminal-cta` op alle 14 posts.** Blog→Gumroad en blog→lead-magnet waren volledig getrackt; blog→terminal — de belangrijkste conversie van de site — vuurde géén enkel event. `cta-tracking.js:52` handelde de tak al af; alleen de markup ontbrak. Geverifieerd door het event op te vangen: `terminal_cta_click {location: "blog_<slug>"}`. De wireshark-post bleek zelfs helemaal geen terminal-CTA in de tekst te hebben; die is toegevoegd.
- **14 RSS-titels gesynchroniseerd** — alle veertien stonden nog in Engelse Title Case sinds de sitebrede omzetting (`65c5f18`), omdat de feed-titel geen van de zeven lockstep-locaties was. Bron is de `<title>`, niet de `<h1>`: bij `wat-is-ethisch-hacken` is de `<h1>` bewust korter en syncen op `<h1>` had de SEO-titel ingekort. **NEW check 9c.**
- **Hubvolgorde hersteld** — `blog/index.html` brak vanaf kaart 5 (december 2025 boven januari 2026). **NEW check 9d.**
- **4 interne links** → wireshark 2→3, metasploit 2→4, linux-bestandssysteem 2→3 inkomend. `welkom` blijft op 2; links naar een welkomstpost forceren zou onnatuurlijk zijn.

### Verificatie

Volledige Chromium-suite **238 passed / 5 skipped / 0 failed** tegen een lokale no-store server. Beide validators groen (`--deep`, 9 checks). Alle vier nieuwe checks (6d, 9c, 9d, blog-fact-checked) rood-op-mutant bewezen vóór vertrouwen. Negen pagina's gecontroleerd op 1280/375px: geen horizontale scroll, nul advertentierestanten, geen console-fouten behalve geblokkeerde Brevo-requests (sandbox-egress).

### Wat bewust NIET is gedaan

Geen vierde gids (bottleneck is verkeer, niet aanbod). Geen docenten-pagina of curriculum-mapping (doelgroep-uitbreiding die PRD §3 uitsluit). Geen Ko-fi verwijderd (0 KB, kost niets). Geen `aggregateRating` (geen echte reviews). De feitencontrole van de 41 man pages en 56 definities zélf loopt door — het reviewpakket maakt die stap klein, maar alleen een mens met vakkennis kan hem zetten.

### Openstaand

- `MODULE_CASCADE`-budget ná de deploy tegen productie meten en verder aanscherpen.
- Heisenberg: site uit AdSense verwijderen, Gumroad/GA4 aflezen, reviewer werven met `docs/review/expert-review-pakket.md`.

---

## Sessie 207: Audit oude follow-up-lijstjes → gesnoeid op bezoekerswaarde (02 aug 2026)

**Mission:** Heisenberg plakte drie oude "optionele follow-up"-lijstjes uit eerdere sessies (leerpad-features, blog/SEO-verbeteringen, een border-refactor) met de vraag wat ervan gedaan is. Halverwege scherpte hij de opdracht aan: *"het waren ooit ideeën, dat betekent niet dat het uitgevoerd moet worden — alleen waarde toevoegende zaken voor de bezoeker, de rest kan de prullenbak in"*, later aangevuld met *"als iets deels klaar is en het is aan te bevelen het af te ronden, mag dat ook mee"*.

**Audit-uitkomst (11 items):** 4 al klaar, 4 verworpen, 3 uitgevoerd — plus 2 items die níét op de lijst stonden maar uit de audit zelf kwamen.

**Al klaar:** Google Search Console (DNS-geverifieerd Sessie 160, sitemap 26 URL's + `robots.txt:35`, indexatie-analyses S160/169/172) · RSS-feed (`/feed.xml`, níét `/blog/feed.xml`; 14/14 items; bewaakt door `validate-docs.sh:475-524`) · related-posts ("Verder lezen", 14/14 posts, 4 kaarten = 56 links) · analytics (GA4 + Consent Mode v2, 943 regels/8 bestanden).

**Verworpen met reden** (vastgelegd als TASKS.md-item #52 zodat ze niet opnieuw opduiken): dashboard-leerpad-% (derde weergave van dezelfde data) · phase-badges (viering bestaat al, `next` wordt ná élk geleerd command aangeboden) · leerpad-certificaat (overbelofte over een browser-simulator) · social sharing (tone-conflict) · SSG (PRD §13, validators lossen duplicatie al op) · blog-engagement-events (GA4 doet dit standaard) · RSS-link in root-heads (winst ≈ 0) · two-tier borders (polish op polish).

**Work done:**
- **W4 — latente border-token-bug (uit de audit).** `.landing-nav-wrapper` (`landing.css:78`) en `.landing-footer` (`main.css:1025`) gebruikten `var(--color-border)` — het *content*-token met **90 call-sites** — voor de dark frame. Werkte alleen doordat `--color-border` in dark mode toevallig dezelfde `#30363d` is als `--color-border-dark-frame`; light mode werd gered door twee overrides. **Rood-op-mutant vóór de fix:** `--color-border` tijdelijk op rood → navbar/footer werden `rgb(255,0,0)` in dark mode (light bleef goed). Ná de fix: `rgb(48,54,61)`, koppeling door. 8/8 metingen identiek op index.html én terminal.html = visuele no-op. Twee redundante overrides geschrapt. **Geen `?v=`-bump** — identieke uitkomst, dus cache busten voor niets.
- **W4-bijvangst — style-guide bleek volledig gedrift.** De `.category-btn`-sectie refereerde **5 niet-bestaande variabelen** (`--color-border-focus`, `--category-filter-height`, `--category-btn-padding`, `--category-btn-radius`, `--radius-full`) én elke state-waarde klopte niet. Verbatim herschreven uit `blog.css:115-137`. "Focus Management" wees naar per-component regels die niet bestaan → vervangen door de echte globale `:focus-visible`-regel uit `animations.css`. Light-theme borderclaim `#d0d0d0` → `#e0e0e0` (`#d0d0d0` is `--color-border-input`, 1 call-site). `css-variable-migration-guide.md` is een gedateerd migratielog → historie niet gecorrigeerd, wel een statusnotitie dat de `--featured-*`-familie inmiddels weg is.
- **W1 — FASE 4 had als enige fase geen vieringsmoment.** Fases 1-3 hebben elk een "FASE X VOLTOOID!"-box; FASE 4 (Security Tools) niet. Vijfde transitie toegevoegd in `next.js` + branch in `detectTransition()`; `phase4Commands` bestond al op regel 25. Copy bewust in de lengteband van de bestaande transities gebracht na een eerste versie die te lang was (skills 44-57 tekens vs bestaande 21-37, bridge 146 vs ~50). Gemeten: desktop 15 regels **allemaal exact 104 tekens**, mobiel borderless, tweede aanroep herhaalt niet.
- **W3 — tutorial-certificaat downloadbaar.** Challenge-certificaten hadden bekijken + download + kopiëren; tutorial-certificaten alleen kopiëren. `downloadCertificate()` toegevoegd op het Blob-patroon uit `certificate-generator.js:159`; de ASCII-conversie zat gedupliceerd en is nu een gedeelde `toPlainText()`. Subcommand `tutorial cert download` + man-page + usage. Gemeten via onderschepte Blob: `hacksimulator-tutorial-recon.txt`, `text/plain`, 2204 tekens, **nul niet-ASCII-tekens**.
- **W2 — og:image per blogpost.** Alle 15 blog-bestanden deelden `assets/og-image.png?v=2`. NEW `scripts/build-blog-og-images.mjs` (resvg, gemodelleerd op `build-product-covers.mjs`) genereert 14 kaarten. **Bron = de post zelf**: titel uit `<h1>`, categorie uit `og:article:section` — bewust géén hardcoded POSTS-array, want de titel leeft al op 7 plekken en een 8e kopie zou gaan driften. Exact **1200×630, niet @2x**: elke post draagt al `og:image:width/height` 1200/630, en een @2x-render zou die tags laten liegen. 14/14 nageteld met `file`, 42 tags vervangen, alle refs bestaan, 548 KB.

**Verificatie:** `validate-blogs.sh` 15/15 · `validate-docs.sh --deep` exit 0 · Playwright volledige suite tegen een lokale **no-store** server.

**Learnings:**
- **"De infrastructuur staat er al" is geen reden om een feature te bouwen.** Mijn eerste ronde markeerde 4 items als "gedeeltelijk — laatste schakel ontbreekt", wat klinkt als afmaken. Maar `getPhaseStats().percentage` (`leerpad.js:25`) is dode code, en de bezoeker ziet zijn fase-voortgang al op twee plekken. Een derde weergave is ruis, geen waarde. Dode code is geen opdracht.
- **Eén grep draaide een oordeel om.** Ik dacht dat fase-viering "pull-based" was en dus gemist werd. Toen bleek `next` ná élk nieuw geleerd command te worden aangeboden (`onboarding.js:311`, `:451-460`, `:196-197`, `:360`, `renderer.js:374`) — de viering is één geprómpte toets weg. Zonder die check had ik 4 overbodige badges gebouwd.
- **Een gevonden defect hoort in het plan, niet in een voetnoot.** Ik parkeerde de border-bug als "meenemen of laten liggen — beide verdedigbaar". Heisenberg: *"Vergeet niet de bug mee te nemen die je gevonden had."* Dat "beide verdedigbaar" is dezelfde hedge als een option-tree: het schuift een technisch oordeel terug naar de user. Nul zichtbare impact ≠ geen bug; beoordeel op toekomstig risico (hier 90 call-sites op het gedeelde token).
- **Bij een no-op-fix is de mutant het hele bewijs.** "Screenshots vóór/ná identiek" is óók waar als je niets doet. De rood-op-mutant-stap (mutant dark: rood → `rgb(48,54,61)`) is het enige dat aantoont dát de koppeling is doorgeknipt.
- **De submodule-cache-val sloeg toe in mijn eigen testharnas.** `import('/src/commands/system/tutorial.js?cb=…')` faalde met "does not provide an export named 'downloadCertificate'" — de `?cb=` bust alleen de entry, niet het relatief geïmporteerde `certificate.js`. Vierde sessie op rij (202/205/206/207). Opgelost met een echte no-store server (`scratchpad/nostore-server.py`) in plaats van steeds slimmere cache-busters.
- **De ingebouwde versheids-assert ving een valse meting.** Mijn eerste W4-na-meting las de CSSOM-regel uit (`var(--color-border)`) en zag dat de light-override er nog stond — bewijs dat de browser oude CSS serveerde. Zonder die assert had ik "no-op bevestigd" gerapporteerd terwijl er niets geladen was.
- **Scope-uitbreiding hoort onderbouwd, niet stiekem.** De style-guide-sectie herschrijven ging verder dan "twee phantom-variabelen fixen". Maar alleen die twee cellen corrigeren in een tabel waarvan élke waarde fout is, levert een half-ware tabel op die er *geverifieerd* uitziet — erger dan beide alternatieven. Gefixt wat ik tegen de CSS kon verifiëren, en de bredere drift gemeld i.p.v. een 8000-regelige audit te starten.
- **Eerlijk blijven over het plafond van een win.** De og:images zijn de enige externe-impact-win, maar Google gebruikt og:image níét in zoekresultaten — de winst zit in gedeelde links, en vooral in het feit dat het nu een script is dat elke volgende post gratis bedient. Dat zo benoemd i.p.v. het als SEO-winst te verkopen.
- **Pre-existente drift gevonden en benoemd.** TASKS.md stond op Versie 5.79, CLAUDE.md op 5.80 — Sessie 206 bumpte alleen CLAUDE.md. Dat glipte langs de pre-commit-hook omdat Check 7 (cross-doc Versie) alleen in `--deep` draait. Ontbrekende 5.80-regel alsnog in de TASKS.md-ketting gezet met die uitleg.

**Next steps:** geen open eind. De verworpen items staan met reden in TASKS.md-item #52; als er ooit een nieuw argument is, is dat de plek om het tegen af te zetten.

---

## Sessie 206: Nieuwsbrief-mails mobiel — code-chip-overlap + witte tekst op groen (01 aug 2026)

**Mission:** Heisenberg stuurde drie Gmail-screenshots (Android, dark mode) van de juli-nieuwsbrief met twee defecten: tekst op de lime balk/knoppen wit i.p.v. donker, en het inline code-blokje (`5f4dcc3b...cf99`) dat door de regels erboven/eronder heen sneed. Analyseren en fixen. Werk viel volledig in `docs/newsletter/` — geen runtime-impact.

**Work done:**
- **Diagnose issue 2 (hard gemeten):** `nieuwsbrief-juli-2026.html` gebruikte één klasse `.code-bg` voor twee dingen — het blok-codevenster (`<td>`, regel 114) én de inline chips (`<code>`, regels 105/135). De mobiele regel `.code-bg { font-size:12px; padding:12px 14px }` was voor het blok bedoeld maar raakte ook de chips. Verticale padding vergroot bij een inline element de regelhoogte niet, alleen het gekleurde vlak. Playwright @375px, vóór de fix: chip **38px hoog in een 24px regelbox** (15px × line-height 1.6) = 7px lek per zijde, **17px overlap** met de buurregels. Ná: 17px, overlap 0. Desktop @700px ongewijzigd (22px in 24px).
- **Fix:** gesplitst naar `.code-block` (td) en `.code-inline` (code) — exact het patroon dat `welkomstmail.html` al hanteerde (`:27,41,50,60`); juli en april waren daarop achtergebleven. Beide klassen toegevoegd in alle drie de kleurblokken (`prefers-color-scheme`, `u + .body`, `[data-ogsc]`) + gesplitste mobiele regels (`.code-inline` → `13px / 1px 4px`).
- **Diagnose issue 1 (mitigatie, niet te bewijzen vanaf hier):** de Gmail-app past ná de CSS zijn eigen kleurcorrectie toe en lift tekst die hij als bijna-zwart-op-donker leest naar wit. `!important` stopt dat niet; de `@media (prefers-color-scheme: dark)`-blokken zijn in die app sowieso dood (Gmail ondersteunt die media query niet — alleen de inline styles tellen). De groene achtergrond stond op de `<td>`/`<a>`, de donkere kleur op een kale `<span>` eronder: zo'n los fragment heeft geen eigen achtergrond en wordt "gerepareerd".
- **Fix:** `background-color:#9fef00` staat nu sámen met `color:#0d1117` op hetzelfde element — 5 spans in juli (3 header + 2 knoppen), plus dezelfde koppeling in de `.header-text`/`.btn-text` klasseregels van alle drie de kleurblokken. Visueel identiek in andere clients (groen-op-groen valt samen met de ouder). Ook toegepast op beide welkomstmails en april.
- **Bijvangst tijdens het opruimen:** beide welkomstmails droegen nog MailerLite-syntax `{$unsubscribe}` en `{$url}` terwijl de stack sinds Sessie 165 op Brevo draait. Brevo vervangt die niet → letterlijke href = dode link. Gecontroleerd tegen de Brevo-docs (niet uit het hoofd): correcte vorm is `{{ unsubscribe }}` en `{{ mirror }}`, mét spaties binnen de accolades. Vervangen in beide bestanden. Heisenberg bevestigde met een screenshot dat `{$unsubscribe}` inderdaad letterlijk in het Brevo HTML-blok stond (automation 2, regel 184).
- **`nieuwsbrief-april-2026.html`:** wél de klassesplitsing + bg/color-koppeling, **niet** de Brevo-syntax — die mail is verstuurd vóór de migratie, dus `{$unsubscribe}` was daar correct. Historie gladstrijken maakt een archief onbetrouwbaar.
- **`maandelijks-template.md` (regressieketen gesloten):** het template wees voor het CSS-blok naar `nieuwsbrief-april-2026.html` — precies het bestand met de bug, waardoor juli hem erfde. Pointer naar juli. Verder: MailerLite → Brevo (titel, platform, lijst `hacksimulator-main`, Import-HTML-waarschuwing), Brevo-variabelen met de waarschuwing dat de oude vorm niet vervangen wordt, uitleg `.code-block` vs `.code-inline`, uitleg waarom bg+color op één element staan, footer-conventie, en checklistregels (uitschrijflink échte klik, één footer, test-mail op telefoon in dark mode).
- **Door Heisenberg zelf uitgevoerd in Brevo:** beide welkomst-automations uniform gemaakt (uitschrijf- en mirror-link in het HTML-blok, los Brevo-footerblok verwijderd) en getest; de dubbele `{EMAIL}` op de Brevo-uitschrijfpagina opgelost. Conventie + status vastgelegd in het template.

**Commits:** `8045b29` (fix, 4 HTML-bestanden), `14ea6b6` (template-documentatie). Beide gepusht naar `main`.

**Learnings:**
- **De rood-op-mutant-volgorde betaalde zich direct uit.** Eerst gemeten op de ónveranderde file (38px / 17px overlap), pas daarna gefixt. Zonder die baseline had ik "overlap 0" gerapporteerd zonder te weten of de meting overlap überhaupt kán detecteren.
- **De Sessie 205-cachval sloeg meteen weer toe.** Mijn eerste na-meting gaf identiek 38px omdat de browser de oude HTML uit cache serveerde — `td.code-block` bestond niet eens in die DOM, en juist dát ontbrekende element verraadde het. Met `?cb=` was het meteen groen. Het patroon herhaalt zich nu drie sessies op rij (202, 205, 206): verifieer nooit tegen een warme browser.
- **Een gemeten afwijking is niet automatisch een bug.** April's tweede chip mat 41px in een 24px regel — dat leek de oude bug. `getClientRects()` toonde 2 fragmenten van elk 17px: de chip wrapt over twee regels en `getBoundingClientRect()` geeft de union-box. Overlap 0. Gecheckt in plaats van "voor de zekerheid" gefixt.
- **Documentatie opruimen legde een levende bug bloot.** De MailerLite-syntax in de welkomstmails leek een documentatie-nit, maar die mails worden nog dagelijks automatisch verstuurd. De "kleine opruimactie" was de hoogste-waarde-vondst van de sessie — vergelijkbaar met Sessie 202, waar de gedeelde util achter de gemelde bug de echte schade droeg.
- **Mijn eerste advies over de juli-mirror was fout.** Ik zei "verzonden campagne → Import HTML", maar Brevo vergrendelt verzonden campagnes: alleen links, alleen ≤24 uur, en uitschrijf-/variabele-links zelfs daarbuiten. Opgezocht in plaats van doorgeredeneerd, en de stap geschrapt in plaats van hem te laten staan.
- **Eerlijk zijn over wat niet te bewijzen viel.** Issue 2 was hard te meten; issue 1 niet — Gmail's dark mode draait op zijn telefoon. Dat als mitigatie benoemd, met de escalatieroute (donkere balk met groene tekst) expliciet als plan B, in plaats van "gefixt" te claimen.
- **De nieuwe checklistregel bewees zichzelf binnen het uur.** "Uitschrijflink écht aanklikken" leidde direct tot de vondst van de dubbele `{EMAIL}` op de Brevo-uitschrijfpagina — een fout die je nooit ziet als je alleen controleert of de link er staat.

**Next steps:**
- Augustus-editie: kopieer `nieuwsbrief-juli-2026.html` (niet april) en test op de telefoon in dark mode. Twee open vragen: houdt de bg+color-koppeling stand in de Gmail-app, en gaat het `<style>`-blok mee bij import (een HTML-blok in een drag-and-drop-ontwerp draagt geen `<head>`; zonder dat blok doen `.code-inline`/`.code-block` niets). Staat als taak in TASKS.md §Volgende Acties.
- Overweging voor later: de Brevo-uitschrijfpagina is Engels terwijl site en mails Nederlands zijn.

**Metrics delta:** geen. Uitsluitend `docs/newsletter/` — bundle, testcount, architectuur en scope ongewijzigd.

---

## Sessie 205: Box-reflow bij venster-resize + structurele submodule-cache-fix (01 aug 2026)

**Mission:** Heisenberg checkte de Sessie 204-fix live en zag de metasploit SECURITY WARNING-box alsnog breken bij het verkleinen van het venster (screenshot 31 jul 20:18). Daarmee verwierp hij expliciet de 204-beslissing "bestaande output reflowt niet bij resize = by design (echte terminals doen dat ook niet)". Opdracht: bestaande box-output moet netjes mee-wrappen.

**Work done:**
- **NEW `src/ui/box-reflow.js`** (~186 regels): debounced (250ms) resize-handler die box-blokken in de DOM detecteert en herbouwt op de actuele `getResponsiveBoxWidth()`.
  - Parser = state machine per container: blok start op `╭`/`┏` (enige 2 corner-sets in de codebase), eindigt op `╰`/`┗`, tussenregels moeten `│`/`┃`/`├` zijn; alles anders verwerpt het blok. Verweesde blokken (top weggetrimd door `_trimOutput`' 500-regel-cap) vallen er vanzelf doorheen. Children-snapshot vóór mutatie (clones worden ingevoegd).
  - **Shrink-only in chars** (`top.textContent.length > width`): idempotent, en de badge-notificatie met z'n `Math.min(width, 50)`-clamp krijgt vanzelf de juiste behandeling zonder dat de clamp gereconstrueerd hoeft te worden. Rij-count kan alleen groeien → geen verwijder-logica.
  - **Géén `isMobileView()`-guard** (bewust verworpen in het plan): een half-gesnapt desktopvenster is 683/720px en valt ónder de 768-drempel — precies het gemelde scenario zou dan kapot blijven. De aanwezigheid van box-blokken ís de guard (mobiel rendert borderless sinds Sessie 82 → parser vindt niets → no-op).
  - **Géén typewriter-guard** (YAGNI): welcome-output bevat geen box-glyphs en box-renders zijn atomair binnen één task.
  - Indent-bewust wordWrappen: `wordWrap` doet `split(' ')` en eet daarmee leidende spaties (óók op part 0), dus indent apart bewaren en elke part her-prefixen — zoals alle producers zelf ook doen.
  - Completion-wrappers (`.terminal-completion-*`) als eigen containers itereren; de wrapper-elementen nooit vervangen (`_revealCelebration` houdt er referenties + animatie-state op).
  - Scroll-pin doorlopend bijgehouden via passieve scroll-listener + `resizing`-vlag; herstel met `scrollTo({behavior:'instant'})` omdat `animations.css` `scroll-behavior:smooth` op `#terminal-output` zet.
- **`renderer.formatText()`**: publieke alias voor `_formatText` zodat herbouwde regels dezelfde marker-spans (`→`/`[✓]`) krijgen.
- **Structurele vondst tijdens live-verificatie (commit 2):** `_headers` zette `/styles/*.css` + `/src/**/*.js` op `max-age=604800`. Binnen die 7 dagen is de response 'fresh', dus `must-revalidate` grijpt niet — en alleen entry-points (`main.js`, `main.css`) dragen een `?v=`. De ~99 relatief geïmporteerde modules bleven dus uit browsercache komen: verse `main.js` + oude `renderer.js` gaf `TypeError: renderer.formatText is not a function`. **Gemeten bewijs dat dit óók Sessie 204 raakte:** de gecachete `box-utils.js` gaf 41 chars, de serverversie 62 — de 204-fixes hadden terugkerende bezoekers nooit bereikt. → `max-age=3600` (herstelt de strategie die `architecture-patterns.md` al documenteerde) + defensieve `renderer._formatText`-fallback in `setLine()`.
- **`architecture-patterns.md`** (commit 3): de val expliciet vastgelegd incl. verificatie-eis (no-store server of `import('…?cb=')`, nooit een warme browser).
- Cache-bump `main.js?v=205-box-reflow` (terminal.html regel 136 + 472).
- **Test**: NEW `Live resize reflow`-describe in `responsive-ascii-boxes.spec.js` — render @1240 (metasploit/next/man nmap/help) → live naar 900/700/**640** (sub-768 = regressietest voor de verworpen mobiel-guard) → 0 wraps + `boxLineCount > 0` + **scroll blijft gepind** + `pageerror`-capture; daarna terug naar 1240 (groei-pad, vers command vol breed). Stale comment over "reflowt bewust niet" herschreven.

**Commits:** `017d872` (feature), `875399d` (cache-fix + fallback), `b02d193` (rules). Alle drie gepusht + live geverifieerd.

**Learnings:**
- **Opnieuw in de Sessie 202-modulecache-val gelopen — nu met de oorzaak erbij.** Drie pin-metingen lang diagnosticeerde ik een niet-bestaand probleem (ik concludeerde zelfs "scroll-event vuurt vóór resize-event") omdat de browser een oude `box-reflow.js` serveerde terwijl het bestand op schijf klopte. Pas een no-store server bracht de waarheid boven. De onderliggende reden is nu bekend én gefixt: `?v=` op het entry-point bust de submodules niet.
- **Dat leidde bijna tot permanente over-engineering.** Ik had een layout-heuristiek toegevoegd (scroll-events mét gewijzigde scrollHeight/clientHeight negeren). Gericht uittesten liet zien dat de simpele `resizing`-vlag al volstond — in Chromium, Firefox én WebKit. Geschrapt; de aanname staat nu als assertie in de e2e-test i.p.v. als defensieve code. Simpelste versie die werkt + test die de aanname bewaakt.
- **Meet vóór je een bug-oorzaak toeschrijft.** Op de vraag "hebben we niet iets dubbel opgelost?" kon ik hard antwoorden omdat ik het screenshot-scenario mét de oude productiecode reproduceerde (69 boxregels, 69 wraps) en met de nieuwe (0 wraps). De 204-fixes gaan over verse render, deze over reflow — disjuncte problemen. Bijkomend inzicht: de 204-fix maakte het symptoom zichtbaarder, want de oude Inter-mismeting maakte boxen ~35% te smal = toevallige speling tegen wrapping.
- **"Live geverifieerd" van Sessie 204 was maar half waar**: het font klopte (CSS-entry mét `?v=`), maar de JS-modules waren stale en zijn niet gecontroleerd. Verificatie moet het hele afhankelijkheidsoppervlak dekken, niet alleen het artefact dat je toevallig gewijzigd hebt.
- **Een "by design"-beoordeling is een productkeuze, geen technische.** Sessie 204 verklaarde niet-reflowen tot echte-terminal-gedrag; technisch verdedigbaar, maar voor een leeromgeving in een browser weegt leesbaarheid bij venstermanipulatie zwaarder. Zulke keuzes horen bij Heisenberg, niet in mijn sessielog.

**Next steps:** Heisenberg moet éénmalig hard refreshen (Ctrl+Shift+R) om zijn gecachete modules te verversen; daarna landen deploys binnen een uur. Geen open code-items.

**Metrics delta:** src/ 677→685 KB (+8 KB: box-reflow.js + formatText-alias), styles/blog/assets ongewijzigd. Specs 29 (gelijk), tests +1 (249). Chromium-suite 243 passed / 5 skipped / 1 flaky (autocomplete-filesystem, ongerelateerd).

---

## Sessie 204: Box-omlijning brak op tussenbreedtes — root-cause fix (31 jul 2026)

**Mission:** Heisenberg meldde (2 foto-screenshots, herhaald aangekaart issue) dat de box-omlijning in de terminal nog steeds breekt op bepaalde schermen — de "VOLGENDE STAP"-box van `next` met wrappende randen en content door de rechterrand. Opdracht: perfecte analyse + fix-advies; plan goedgekeurd en uitgevoerd.

**Work done:**
- **Root cause 0 (dominant, nieuw ontdekt):** de inline base64-embed van 'JetBrains Mono Box' (box-glyphs U+2500-257F) in `styles/main.css:18` was **corrupt sinds Sessie 83** — exact 2 tekens afwijkend van het valide `styles/fonts/jetbrains-mono-box-subset.woff2` (b64-posities 154 en 6350), brotli-decompressie faalde, `FontFace.status === 'error'` (live op productie bevestigd vóór de fix). Alle box-glyphs renderden via OS-fallback-fonts met per-OS/per-glyph afwijkende advances (`━` ≠ `─` ≠ `M`); een borderregel is één ononderbroken glyph-run zonder breekpunten → wrapt als eerste, per machine anders. Verklaart retroactief het Sessie 81/82 Android-uitlijnprobleem (waarvoor `boxText()` mobiel borderless werd). Fix: herembed via `base64 -w0` van de disk-subset (600/1000-advance voor alle 128 glyphs — identiek aan JetBrains Mono latin).
- **Contract-unificatie** `src/utils/asciiBox.js`: rendertte `width + 2` tekens totaal terwijl `getResponsiveBoxWidth()` een totale breedte teruggeeft en alle handgerolde boxen (`next.js`, `dashboard.js`, …) `inner = width - 2` doen → de 5 SECURITY WARNING-boxen + `man`-boxHeader waren 2 chars te breed (veiligheidsmarge opgegeten). Nu totaal == `width` in `createBox` + `createLightBox`; `help.js:180` handmatige `width - 2`-compensatie verwijderd.
- **Meting op het juiste element** `src/utils/box-utils.js`: mat `#terminal-container` — dat erft **Inter** (`--font-body`, proportioneel!) terwijl de tekst in `#terminal-output` rendert (`--font-terminal`, mono), en de 12px webkit-scrollbar zat niet in de berekening. De Inter-M-mismeting *onderschatte* de capaciteit ~35% en redde brede desktops toevallig — maar instabiel per font-laadmoment. Nu: meet `#terminal-output` (juiste font + `clientWidth` excl. eigen scrollbar), `charWidth = max(measureText('M'), '─', '━')` (canvas respecteert unicode-range → meet de echte subset-advance; de max had déze hele bug gevangen).
- **`scrollbar-gutter: stable`** op `#terminal-output` (`styles/terminal.css`): clientWidth gelijk vóór/ná verschijnen van de scrollbar.
- **Test-gat gedicht** `tests/e2e/responsive-ascii-boxes.spec.js`: de `scrollWidth <= clientWidth`-assertie kon door `overflow-x:hidden` + `pre-wrap` nooit falen (structureel vals-groen) en `document.fonts.check()` geeft true óók bij status 'error' (gemeten — zo bleef de corrupte font 120 sessies onzichtbaar). Nu: wrap-detector per `.terminal-line` op **element-hoogte > 1.5× line-height** + max-right-check, NEW describe "Tussenliggende breedtes" @ 800/900/1024/1100 (terminal eerst vullen → scrollbar zichtbaar → commands vers renderen), font-assert via `fonts.load` + `status === 'loaded'`. Verouderde 32/40/48/56-char header-comment + ongebruikte `expectedWidth`-velden opgeruimd.
- `?v=` bump: `main.css` 153→154 + `terminal.css` 117→118 over alle HTML-refs; `.claude/skills/verify-terminal/SKILL.md` bijgewerkt (width-contract + hoogte-gebaseerde wrap-detector).

**Commits:** `418d0da` (35 files) — gepusht + Netlify-deploy live geverifieerd. **Committed context zelfde dag, andere conversatie (niet dit werk):** `69c7eb2` flakiness + bundle-limiet 1000→1050, `cb00326` tracker.js dubbele-init-guard.

**Learnings:**
- Twee corrupte tekens in een 6936-char base64-string = hele woff2 onbruikbaar (brotli is niet fout-tolerant), maar `@font-face` faalt stíl naar een visueel bijna-identieke fallback. Elke test die "renderen de box-tekens?" vroeg zag ze gewoon — alleen metrisch nét verkeerd. Verifieer font-embeds tegen het bronbestand (byte-diff) en assert `fonts.load`+status, nooit `fonts.check`.
- Een accidentele mismeting kan een structurele bug maskeren: de Inter-M-onderschatting hield desktops toevallig binnen de marge. Fix-volgorde was daarom bindend: font → contract → meting; "correct" meten zonder de eerdere fixes had de boxen juist óp de rand gezet.
- Wrap-detectie: rect-`top`-vergelijking én `rects.length` zijn beide vals-positief bij inline spans — `marker-arrow` heeft `vertical-align: .2em` (3.6px @ 18px) waardoor rects op één visuele regel verschillende tops hebben (gemeten: 11 vals-positieven). Element-hoogte > 1.5× line-height is immuun (echte wrap verdubbelt de hoogte). Rood-op-mutant bewezen (kunstmatig 30-chars-te-brede regel gevangen).
- Resize-scenario gereproduceerd = vrijwel zeker de screenshots: output gerenderd @ 1440px wrapt 68/68 na versmalling naar 800px; vers command daarna: 0/12 wraps. Bewust geaccepteerd (echte terminals reflowen ook niet) — test-consequentie: na viewport-resize altijd het command opnieuw uitvoeren, nooit oude output meten.
- Sessienummer-ambiguïteit: een eerdere zelfde-dag-conversatie labelde haar werk al "Sessie 204" in TASKS.md maar rondde `/summary` nooit af (geen current.md-entry, counter bleef 203). Beslist: deze sessie = 204, eerder werk als committed context gelogd (Sessie 200-protocol: niet claimen).

**Next steps:** geen open items uit deze sessie. Bestaande open Heisenberg-acties (Postmaster re-check, GEO-checklist §5) ongewijzigd.

**Metrics delta:** src/ 675→677 KB (+2 KB contract/meting-comments), styles/ 396 KB gelijk (font-b64 zelfde lengte, +25 bytes gutter), spec-files 28→29 (was al 29 door zelfde-dag-context), tests +4 (tussenbreedte-describe). Chromium-suite 242 passed / 5 skipped / 1 flaky (tutorial-gestures, ongerelateerd).

---

## Sessie 203: GEO/AEO — vindbaarheid in AI-zoekmachines (31 jul 2026)

**Mission:** Heisenberg: "Ik wil hoog in de AI zoekresultaten komen met dit project. Analyseer hoe ik dit moet doen en zorg dat dit gebeurt." Doel: HackSimulator.nl citeerbaar maken voor ChatGPT, Perplexity, Google AI Overviews en Claude (GEO/AEO).

**Analyse (Explore-agent + webresearch juli 2026):** Klassieke SEO-basis sterk (canonicals, OG/Twitter-pariteit, BreadcrumbList, Article+Person op alle 14 posts, git-accurate sitemap), maar nul GEO-voorziening: geen llms.txt, geen AI-crawler-beleid, DefinedTermSet dekte 5 van 56 woordenlijst-termen, geen HowTo/WebApplication-schema. Onderzoek: llms.txt ~10% adoptie (nog onderscheidend, laag risico); AI Overviews citeert ~97% uit organische top-20 (bestaande SEO = fundament); ChatGPT-retrieval draait op Bing; Perplexity weegt freshness ~40% en leunt op Reddit; Claude citeert gestructureerde pagina's ~30% vaker.

**Work done (commit `202c8eb`, 9 bestanden, gepusht + live geverifieerd):**
- **NEW `llms.txt`** (llmstxt.org-spec): H1 + blockquote-missie + NL-alinea + korte EN-note, secties Kernpagina's/Blog (14 posts met 1-regel-beschrijving uit echte meta-descriptions)/Over. Alle 20 URL's tegen het filesystem geverifieerd. Netlify serveert root-`.txt` as-is.
- **`robots.txt`**: expliciete AI-crawler-stanza (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, CCBot, meta-externalagent, Applebot-Extended) als gedeelde multi-UA-groep. Cruciaal: een specifieke UA-stanza overschrijft de wildcard vólledig (RFC 9309) → de 4 Disallows (/node_modules/ /tests/ /playwright-report/ /docs/) herhaald in de AI-groep.
- **`index.html` FAQPage JSON-LD**: de 8 FAQ-vragen stonden al zichtbaar op de homepage (regel 541+) zónder schema — goedkoopste grote win van de hele analyse. Antwoorden verbatim uit de zichtbare `<p>`'s, alleen HTML-tags gestript.
- **`woordenlijst.html` DefinedTermSet 5→56**: scriptmatig gegenereerd (scratchpad-Python parseert `glossary-term`-blokken: `<dt>`-naam + `<dd>`-beschrijving, links/tags gestript) i.p.v. 56 objecten met de hand — geen typo's, herhaalbaar bij term-wijzigingen.
- **`scripts/validate-docs.sh` DefinedTerm-lockstep-check** (naast bestaande `term_count` regel 370): `"@type": "DefinedTerm"`-count moet exact gelijk zijn aan zichtbare `<dt>`-count. Rood-op-mutant bewezen (55≠56 faalt), groen op echt bestand.
- **`terminal.html` WebApplication-schema**: EducationalApplication, browser-based, gratis (price 0 EUR), isAccessibleForFree.
- **HowTo-schema op 2 posts**: wireshark (5-staps "Aan de slag"-`<ol>`) + metasploit (7-staps exploit-workflow-`<ol>`), steps verbatim. nmap/hashcat/sql-injection bewust géén HowTo: hun lijsten zijn alternatieven/uitleg, geen stappen — fake-HowTo schaadt.
- **`docs/seo-launch-checklist.md` NEW §5 GEO/AEO**: in-repo-status + platform-citatiegedrag + Heisenberg-acties (Bing Webmaster, herindexering GSC/Bing 4 pagina's, freshness-cadans, externe vermeldingen nuchter, ~1 mnd controle: AI-engines zelf vragen of HackSimulator geciteerd wordt).

**Bewust geschrapt (proportionaliteit):** llms-full.txt (drift-gevoelig, marginale waarde bij 14 posts); aparte veelgestelde-vragen.html (nav/footer JS-injected met noscript-fallbacks in ~24 files — index-schema levert hetzelfde AEO-voordeel voor ~1/20e van de kosten, evt. fase 2); answer-first-herschrijvingen (steekproef: posts openen al met directe definities na "Wat is X?"-koppen).

**Learnings:**
- De goedkoopste GEO-win zat in bestaande zichtbare content zonder schema (homepage-FAQ) — audit eerst wat er ál staat vóór je nieuwe content plant. De Plan-agent-vondst "8 zichtbare FAQ's zonder FAQPage" herframede de hele scope (aparte FAQ-pagina → overbodig).
- Schema-bij-zichtbare-content hoort verbatim + lockstep-bewaakt: FAQ-antwoorden letterlijk gekopieerd, DefinedTerm scriptmatig uit de markup gegenereerd, en de count-check in validate-docs.sh maakt drift onmogelijk. Zelfde discipline als de blog-titel-7-locaties-lockstep.
- robots.txt-valkuil: een specifieke User-agent-groep erft níéts van de wildcard — wie alleen `Allow: /` in een AI-stanza zet, opent per ongeluk /docs/ voor die crawlers. Multi-UA-groep (12 agents, 1 regelset) is compact én RFC 9309-correct.
- On-page GEO maakt je *citeerbaar*, niet *gekozen* — dat doen autoriteit en externe vermeldingen (Perplexity: Reddit ~47% van topcitaties). De eerlijke verwachting staat zo in checklist-§5; de zwaarste hefboom is een Heisenberg-actie, geen code.
- Deploy-verificatie hoort bij "zorg dat dit gebeurt": eerste curl gaf 404 (Netlify nog bezig), achtergrond-recheck na 90s bewees llms.txt 200 + nieuwe robots.txt live.

**Metrics delta:** blog 447→456 KB (+9: 2× HowTo-blok), src/styles ongewijzigd; geen nieuwe pagina's/tests; validate-docs.sh +1 deep-check (DefinedTerm-lockstep); bundle-marker geüpdatet naar Sessie 203-meting.

**Next steps:** Heisenberg-acties in `docs/seo-launch-checklist.md` §5 (Bing Webmaster, herindexering, externe vermeldingen, controle na ~1 mnd). Evt. fase 2: dedicated FAQ-pagina als hub.

---

## Sessie 202: Mobiele kolom-uitlijning + box-truncatie in terminal-output (28 jul 2026)

**Mission:** Gebruiker (screenshot terminal, 375px): het `reset`-tutorial-exit-menu ("[→] Wat wil je doen?" met commando + beschrijving) brak lelijk af — de twee kolommen vielen onder elkaar zodat elke beschrijving als een los menu-item las. Verzoek: "analyseer hoe en waar dit voorkomt site wide. ik wil dit perfect hebben." Scope-keuze Heisenberg: **alle live output** (reset-menu + security-tool-uitvoer); **man-pages buiten scope** (referentie achter expliciet `man`, traditioneel breed).

**Root cause:** `#terminal-output` gebruikt `white-space: pre-wrap` (`styles/terminal.css`). Regels breder dan de viewport (~30 tekens op mobiel; `getResponsiveBoxWidth()` klemt op min. 30) breken af op hun interne spaties → elke fixed-width twee-koloms-tabel (`kolom1` + opvul-spaties + `kolom2`) klapt in elkaar. De bestaande `data-indent` hanging-indent (`renderer.js` → `mobile.css`) redt alléén *continuatie*-regels, niet een twee-koloms-layout. De codebase had het juiste patroon al: commando's die `box-utils.js` gebruiken vertakken op `isMobileView()` en renderen gestapeld (`next.js` `buildMobileBox`/`buildDesktopBox`, `tutorial.js`, `dashboard.js`, `leaderboard.js` `renderListMobile`). De kapotte output omzeilde die helpers met hardcoded opvul-spaties.

**Work done (commit `fe27a17`, 4 bestanden, gepusht naar `main`):**
- **`reset.js`** (de screenshot): twee-koloms-menu → gestapeld (commando op eigen regel, beschrijving 2 spaties dieper eronder, lege regel tussen groepen). Bewust géén per-regel `→`-marker: `    → tutorial start exploitation` = 33 tekens en overschreed de ~30-char mobiele breedte; zonder arrow = 31 en het commando overleeft (of wrapt netjes met hanging-indent). Leest goed op mobiel én desktop → geen `isMobileView()`-vertakking nodig.
- **`nikto.js`**: "Ontbrekende headers"-tabel gestapeld (`header` + ingesprongen `→ beschrijving`); "Forces HTTPS"→"Dwingt HTTPS af" (de-Dunglish, rest van de tabel was al NL). **+ 2 echte bugs**: `+ Start Time: …}+ Server:` en `…seconds)+ 1 host(s)` plakten twee output-regels aaneen zónder `\n`.
- **`hashcat.js`**: 2 lange kolom-0-regels met `←`-glosse (`[*] Detecting hash type… ← …`, `Speed.#1…: X MH/s ← …`) → glosse op eigen ingesprongen regel; de basis-statusregels passen nu.
- **`asciiBox.js`** (de échte reikwijdte-vondst): box-`wrap()` in beide varianten (zwaar + licht) **woord-wrapt** te brede regels via de bestaande `wordWrap()` i.p.v. af te kappen met `...`. De 5 SECURITY WARNING-boxen (`boxText(warningContent, 'SECURITY WARNING')` in metasploit/nikto/sqlmap/hydra/hashcat) kápten waarschuwings-/gebruikstekst af op mobiel — niet alleen hydra's `(SSH brute force)`. Cruciaal: alléén regels die de breedte *overschrijden* worden geherwrapt; passende regels blijven verbatim → desktop-rendering + bewuste inspringing ongewijzigd. Sluit de in TASKS #47 Fase 1c gevlagde "mobiele legal-box-truncatie".
- **Box-titel-guard**: `label.slice(0, width)` als de titel breder is dan de box → geen `RangeError` meer bij `horizontal.repeat(negatief)`. Latent (onbereikbaar in prod: beide titel-callers `man.js`/`help.js` vertakken op `isMobileView()` naar platte tekst; op desktop is de box breed), maar een crash ≫ cosmetisch, dus goedkope guard.
- **Bewust ongemoeid**: `metasploit.js:69-71` + `hydra.js:161-162` `label ← glosse`-regels beginnen al met ≥3 spaties → hanging-indent grijpt al aan (degraderen acceptabel). Authentieke nikto-scan-regels (`+ label: value`) blijven voor 80/20-realisme.

**Learnings:**
- De screenshot was één symptoom van een klasse: fixed-width kolommen vs `pre-wrap`. De hoogste-waarde-vondst (box-truncatie die *waarschuwingstekst* wegkapt) zat níét in de gemelde output maar in de gedeelde `asciiBox`-util die de gemelde security-tools voeden — breed kijken loonde.
- **Verificatie-techniek voor een cache-geblokkeerde module:** er is geen build-stap en `asciiBox.js` wordt relatief geïmporteerd zónder `?v=`, dus de browser serveerde de gecachte oude versie (in-app render toonde nog `...`). Oplossing: `import('/src/utils/asciiBox.js?cb=' + Date.now())` in `browser_evaluate` → draait de échte `boxText()`/`wordWrap()` op het bestand-op-schijf. Bewees: geen ellipsis, alle regels exact `width+2` (randen uitgelijnd), content behouden, desktop verbatim, titel-guard crasht niet. (Sessie 200-techniek: meet het codepad direct, niet via de UI-heuristiek.)
- **Beslissing als expert i.p.v. optiemenu:** systemische renderer-reflow-heuristiek verworpen (ASCII-art/code-blokken/authentieke tool-output hebben óók multi-spaties die je niet mag herschikken; Sessie 196: "bevries de state aan de bron, filter niet de output") → gerichte per-output-fixes. De box-titel-crash wél gefixt ondanks onbereikbaarheid, want de kosten-baten (2 regels vs crash-footgun) is duidelijk.

**Verificatie:** Playwright echte `fill`+`Enter` op 375px + desktop 1280px; `overflowCount: 0` over de hele output, geen horizontale page-scroll; reset-menu + nikto + hashcat schoon; desktop geen regressie; `git diff` collateral-scan: 4 bestanden, alleen bedoelde output-strings, geen man-pages/logica. Screenshots `.playwright-mcp/reset-menu-{mobile,desktop}-fixed.png`.

**Deploy-noot:** live na het gebruikelijke ~1u Netlify-cachevenster (sub-modules relatief geïmporteerd zonder `?v=`; een `?v=`-bump op `main.js` bust ze niet). Direct live = Netlify "Clear cache and deploy site".

**Next steps:** geen open items uit deze sessie. (Optioneel toekomstig: een `?v=`-strategie voor sub-modules zodat sub-module-fixes niet ~1u op de cache wachten — pre-existing deploy-karakteristiek, geen bug.)

**Metrics delta:** 4 bestanden, +51/-22 regels; geen test-count-wijziging (28 spec files / 213 test-defs); bundle-KB-delta verwaarloosbaar (tekst-in-template-literals).

---

## Follow-up (27 jul 2026): Tutorial continuation-inspringing 6→4 spaties

**Mission:** Gebruiker (screenshot terminal, fundamentals-tutorial): "de inspringing die je ziet — is die bewust?" De vervolgregels van `[~]`/`[!]`-feedback sprongen 6 spaties in, 2 tekens voorbij de 4-brede marker.

**Diagnose:** Bewust (hand-authored hanging indent), maar dubbel functioneel én net niet strak: (1) visueel hangend onder de tip; (2) **load-bearing** — de renderer (`src/ui/renderer.js:513` `isContinuationLine`) kleurt vervolgregels met `≥3` leidende spaties door met de kleur van de marker-regel (`lastSemanticType`). 6 spaties lijnde echter niet uit onder de marker-tekst (kolom 4), maar 2 tekens ernaast.

**Fix (commit `6423f0c`, gepusht):** Uniform 6→4 spaties over alle 5 scenario-bestanden (64 continuations), zodat elke vervolgregel — doorgelopen zin, opsomming, genummerde lijst, codeblok — exact uitlijnt onder de marker-tekst. 4 blijft ruim boven de `≥3`-drempel, dus kleur-inheritance intact.

**Verificatie:** scope vooraf bewezen (geen `[TIP]`-6-brede ouders; alle 64 exact 6 spaties) → één transform i.p.v. 64 oordelen; 64 inserts/64 deletes + `git diff -w` leeg (puur whitespace); idempotent (2e pass = 0); `node --check` alle 5 modules OK; kleur-drempel geverifieerd met exacte renderer-logica; `mobile.css` leest `data-indent` generiek (`calc(...*1ch)`) → mobiele hanging indent volgt automatisch.

**Learning:** de ondergrens (4, boven de `≥3`-drempel) was net zo belangrijk als de bovengrens (uitlijnen op de 4-brede marker) — naar 2 spaties zou alle 64 continuations stilletjes hun dim-kleur hebben gekost. De inspringing is een renderer-signaal, geen kosmetiek.

**Scope-noot:** lichte log-entry op verzoek — geen sessie-teller-ophoging (blijft 201), geen CLAUDE.md-rotatie, geen TASKS.md-wijziging. Git-historie (`6423f0c`) is zelf-documenterend.

---

## Sessie 201: Koppen sitebreed naar Nederlands zinskapitaal i.p.v. Engelse Title Case (26 jul 2026)

**Mission:** Gebruiker (screenshot van `blog/metasploit-beginnersgids.html`): "sommige woorden in de titel beginnen met hoofdletters, andere niet — kan je dit analyseren en perfectioneren?" Diagnose: de site gebruikte Engelse Title Case (elk inhoudswoord een hoofdletter), én inconsistent toegepast ("Payloads: Wat Gebeurt er Na de Exploit?" — "er" klein). Correct voor het Nederlands = zinskapitaal (alleen 1e woord + eigennamen). Scope-keuze Heisenberg: hele site + zuiver zinskapitaal (ook Engelse vaktermen klein tenzij eigennaam).

**Aanpak:** 2 Explore-audits (blogs + niet-blogs) telden ~340 Title-Case-koppen. Omdat de omzetting oordeelsgevoelig is (eigennamen-whitelist per kop) maar mechanisch van omvang, koos ik voor één zorgvuldig Python-script (`sentence_case.py`, scratchpad) + grondige dry-run-review per bestand, i.p.v. ~340 handmatige edits. Het script raakt alleen kop-contexten: `<title>`, og/twitter:title, JSON-LD `headline`/breadcrumb-`name`, `<h1-4>` (incl. genest `<a>`/`<abbr>`), zichtbare breadcrumb `<li aria-current>`.

**Work done (commit `65c5f18`, 27 bestanden, 518/518 gebalanceerde regel-vervangingen):**
- **15 blogs** incl. `blog/index.html`-kaarten (in lockstep met elke artikeltitel).
- **8 hoofdpagina's:** index, terminal, gidsen, over-ons, woordenlijst, contact, 404, commands/index.
- **3 juridische pagina's:** cookies, privacy, terms (~102 koppen).
- **1 JS-modalkop:** `src/ui/legal.js:56` "Juridische Kennisgeving" → "Juridische kennisgeving" (handmatig).
- **+typofix:** `terms.html:301` "Scheibaarheid" → "Scheidbaarheid" (severability-clausule; bevestigd door de paragraaftekst).
- **Titel-cluster (7 plekken per blog-artikel):** `<title>`, og:title, twitter:title, JSON-LD `headline`, BreadcrumbList `name` (pos 3), `<h1>`, en de kaart in `blog/index.html` — allen synchroon zodat gestructureerde data niet van de zichtbare kop divergeert.

**Transformatie-regels (in het script gecodeerd):** eerste woord + eigennamen hoofdletter; na `:` klein (NL-conventie); na `?`/`!`/`.`-met-spatie = nieuwe zin (hoofdletter); afkortingen ("vs."/"art.") starten géén valse zin; sectienummers met punt ("2.1"/"1.") kapitaliseren het volgende woord, kardinale getallen ("5 essentiële") niet; hyphen-bewust (IT-kennis, in-band); `<code>`-inhoud letterlijk (nmap-vlag `-sV`). Whitelist behoudt: merken (Metasploit/Nmap/Wireshark/OWASP **Top 10**), nationaliteitsadjectieven (Nederlandse/Engelse — NL houdt hoofdletter), landen (Nederland), camelCase-API's (localStorage/sessionStorage), acroniemen (TCP/WAF/GDPR/SMS/SQL/CTF), juridische afk. (Sr, III), toets-notatie (Ctrl+C). Post-fixes voor meerwoord-productnamen (Pentest Playbook, Starter Kit, Google Analytics/AdSense, Plausible Analytics). Bewust overgeslagen (skip): OWASP-categorieën A01–A10, certificeringsnamen (CEH/OSCP/eJPT-expansies), CompTIA/PenTest+, en enkelvoudige lowercase-command-koppen (`<h2>nmap</h2>` op de commands-pagina).

**Learnings:**
- **Script > handwerk voor bulk-transform-met-whitelist — mits masking.** Twee bugs doken pas op de niet-blog-pagina's op: (1) `woordenlijst.html` heeft letterlijk `<h3>` in een CSS-comment ("de categorie-`<h3>` erachter") → de `<h[1-4]>`-regex liep zonder sluit-tag door tot de échte `</h1>` en verminkte het hele style-blok + de JSON-LD; (2) `commands/index.html` heeft command-namen als koppen (`<h2>nmap</h2>`). Fix: `<style>`/`<script>` maskeren vóór de heading-regex draait (JSON-LD apart met string-patronen verwerken), plus enkel-lowercase-woord-koppen skippen. Blogs misten dit omdat ze geen inline-`<style>` hadden — de gevaarlijkste bug verstopt zich in de bestandsklasse die je het laatst test.
- **Iteratieve dry-run-review is de kern van de methode.** Elke batch onthulde randgevallen die een blinde `sed` zou hebben gemist: "Nederland"→"nederland" (landennaam), "IT-kennis"→"it-kennis" (acroniem-in-compound), "vs."→valse-zin-grens, "-sV"→"-sv" (code-inhoud), "5 Essentiële" (getal-first), "localStorage"→"localstorage". Elk gefixt vóór het schrijven.
- **Idempotentie als verificatie.** Tweede pass over alle 26 bestanden = 0 wijzigingen → bewijst consistentie én dat niets is gemist. Aangevuld met `git diff` collateral-scan (leeg), browser-render van de gemelde pagina, en de pre-commit blog-JSON-LD/tag-balans-hook (groen).
- **518 inserts / 518 deletes = puur tekst-casing, 0 structuur** — een sterke integriteitsindicator bij een grote diff.

**Bewuste keuzes (aan Heisenberg gemeld):** "Filesystem commands" e.d. (welkom-blog + commands-pagina) óók kleingeschreven — consistenter met zuiver zinskapitaal dan de "niet aanraken"-noot uit mijn plan. "Probeer het Metasploit command" kreeg merk-hoofdletter (was lowercase command); aangeboden om terug te draaien indien gewenst.

**Commit (gepusht naar `main`):** `65c5f18` (style(koppen): sitebreed Nederlands zinskapitaal i.p.v. Engelse Title Case).

**Metrics delta:** ~0 KB net (tekst-casing, geen byte-significante wijziging; blog-KB-marker binnen tolerantie, validate-docs Check 6 groen) | 28 spec files / 213 tests ongewijzigd (geen test-wijziging; geen runtime-gedrag geraakt) | 1 commit. NEW memory `feedback_dutch_sentence_case_headings`.

**Next steps (open, Heisenberg):** ongewijzigd t.o.v. Sessie 199-200 — `docs/launch-checklist.md` afwerken → launch wo 29 juli; ná launch item #45 (value-prop/retentie) op echte funnel-data; item #46 GA4-launch-dag-handelingen. Optioneel: "Probeer het Metasploit command" terug naar lowercase indien gewenst.

---

## Sessie 200: Command-output-audit (item #47) afgerond — Fase 3 triviale correctheid-nits (26 jul 2026)

**Mission:** Gebruiker: "voer Fase 3 uit: drie triviale correctheid-nits, in één commit naar main." Fase 3 is het laatste blok van item #47 (command-output-audit), dat eerder op 26 jul in losse werkblokken liep. Deze conversatie deed uitsluitend Fase 3 + de /summary.

**Context — waar Fase 3 op sluit:** item #47 kwam voort uit de metasploit-command-cleanup (`f56d886`) en werd uitgerold in 3 fases (roadmap `ebc86c8`): Fase 1 = security-cluster sqlmap/hydra/hashcat/nikto (`f65c93d`), Fase 2 = meta-funnel next/shortcuts/onboarding/help (`0a256ad`), Fase 3 = deze triviale nits. Fase 1+2 landden eerder dezelfde dag (aparte context); dit logboek beschrijft ze als committed context, niet als eigen werk.

**Work done (Fase 3, commit `e31075b`):**
- `src/commands/filesystem/cp.js:47` — `[TIP] De bronbestand bestaat niet.` → `Het bronbestand` (onzijdig; sloot interne inconsistentie met `mv.js:61` dat het al goed deed).
- `src/commands/system/certificates.js` — `kopieren` → `kopiëren` (ontbrekend trema), `replace_all`. Een `grep -rn "kopieren" src/` vooraf bewees exact 2 voorkomens, beide in dit bestand (`:95` manPage, `:158` execute-output) → file-scoped `replace_all` kon niet over-reachen.
- `src/commands/network/nmap.js` — onvertaald "attack surface" → "aanvalsoppervlak" op 2 user-facing regels (`:160` scan-TIP, `:234` manPage), onzijdig "minimaal" (niet "minimale"), de term die de manPage op `:220` zelf al als glosse gebruikt.
- **Bewust NIET aangeraakt:** `nmap.js:53` (code-comment, niet user-facing) + `:162`/`:235` ("meer ingangen voor aanvallers" hoort bij het veel-poorten/slecht-geval, ander register).

**Verificatie:** `node --check` op de 3 bestanden (schoon). Browser-driving via directe ES-module-import op een lokale http-server i.p.v. de typewriter/consent-UI: `cp.execute(['bestaat-niet.txt','x'], {}, {vfs})` met een stub-`vfs.copy` die "No such file" gooit (bevestigt cp:47-TIP), `nmap.execute(['secure-server.local'], {}, {})` → de single-443-tak (bevestigt de :160-TIP met "minimaal aanvalsoppervlak"), + `nmap.manPage`/`certs.manPage`-regex (bevestigt :234 en :95 incl. correcte `ë`-UTF-8). `certificates.js:158` is challenge-gated → code-inspectie volstond (dezelfde `replace_all` dekte het, grep = 0 residu). Diff = exact 5 regels in/uit, geen collateral.

**Commit (gepusht naar `main`):** `e31075b` (fix(output): drie correctheid-nits, item #47 Fase 3).

**Learnings:**
- **Directe module-import als testinstrument omzeilt de UI-ceremonie.** De command-modules exporteren een object met `execute`/`manPage`; via `import()` in de browser + stubs (vfs) of een passende target (`secure-*` → 443-only) exercise je het échte codepad zonder de typewriter, consent-modal of FocusTrap te doorlopen. Precies het soort meting waar de sessie-learnings herhaaldelijk voor pleiten (meet het gedrag, niet de scherm-heuristiek).
- **`replace_all` is veilig juist omdat de grep vooraf de reikwijdte bewees.** Exact 2 treffers, beide in één bestand — zonder die grep zou een file-scoped replace-all een gok zijn.
- **Faithful attribution in het sessielog.** Deze conversatie deed alleen Fase 3; Fase 1+2 + metasploit-cleanup staan als committed context, niet als geclaimd werk. De git-historie + commit-messages leggen hun detail al vast (protocol: her-leid niet wat de repo al registreert).

**Metrics delta:** src/ 673→671 KB (afronding; Fase 3 = ~0 KB net, 5 char-regels) | styles/blog/assets ongewijzigd (394/447/1030 KB) | 28 spec files / 213 tests ongewijzigd (geen test-wijziging) | 1 commit. Item #47 nu volledig ✅.

**Next steps (open, Heisenberg):** ongewijzigd t.o.v. Sessie 199 — `docs/launch-checklist.md` afwerken → launch wo 29 juli; ná launch item #45 (value-prop/retentie) op echte funnel-data; item #46 GA4-launch-dag-handelingen.

---

## Sessie 199: Marketing-launch uitvoeren — verse launch-week-post + launch-beslissing (22-26 jul 2026)

**Mission:** Gebruiker: "ik wil de marketing launch uitvoeren; zeg me precies wat te doen en of ik nu kan launchen of dat er eerst iets moet gebeuren." Diagnose: technisch launch-ready, alles voorbereid (Sessie 161-198: funnel-events live, GA4 grotendeels geconfigureerd, aankondigings-kit + visuals her-geverifieerd, copy plak-klaar). Enige echte bouw-blocker = de verse launch-week-blogpost die het runbook aanbeveelt.

**Besluit (Heisenberg, via AskUserQuestion):** demand-validatie (item #44, 5-10 testsessies) **bewust overslaan → direct launchen**, mét de verse blogpost. Launch-datum: te kort dag voor vandaag (post + prep eerst) → **doel wo 29 juli 2026** (woensdag = beste HN/Reddit-dag, kit §5).

**Datum-verificatie-correctie:** in het eerste plan noemde ik "wo 23 jul (morgen)" terwijl 22 jul zélf al woensdag was — Heisenberg corrigeerde. Weekdag met `date -d` geverifieerd. Geheugen `feedback_verify_calendar_dates` toegevoegd.

**Deel A — gebouwd (code/content, live op main):**
- **NEW `blog/metasploit-beginnersgids.html`** (~2100 woorden, 10 min, categorie Tools) — verse launch-week-post = freshness-hefboom (runbook Fase 2; vorige nieuwste was 26 mei). Beginnersgids: wat is een exploit-framework, de 4 bouwstenen (exploits/payloads/auxiliary/encoders) + post-exploitation, de 7-staps exploit-workflow (recon→lateral movement), payloads (reverse/bind shell + meterpreter), beroemde exploits (EternalBlue/WannaCry + BlueKeep/Log4Shell/Shellshock, tabel), het patch-leermoment (WannaCry-patch was maanden beschikbaar), verdediging, juridische grens (art. 138ab Sr, gemirrord van bestaande posts — géén eigen strafmaat-getal geclaimd). Gemodelleerd op `nmap-beginnersgids.html`: JSON-LD Article (Organization-auteur) + BreadcrumbList, breadcrumbs, blauw blog-palet (geen groen), consent-model-CTA's, lead-magnet + Gumroad + practice-CTA. Feiten alleen uit `metasploit.js` + de geverifieerde-feitenlijst in `launch-announcement-kit.md` §1. `datePublished` 22 jul = echte deploy-dag (geen future-dating op 29 jul → slecht voor SEO + botst met datum-discipline).
- **Ingehaakt:** blog-index (nieuwste boven), `feed.xml` (RSS-item newest-first + `lastBuildDate` → 22 jul; Check 9b RSS-count = blog/*.html minus index), `sitemap.xml` (entry, lastmod >= datePublished; Check 9a), homepage-bloglinks-lijst.
- **Cornerstone-touch (runbook Fase 2, echte content-verbetering rechtvaardigt datum-bump):** natuurlijke interne links naar de nieuwe gids vanaf `cybersecurity-tools.html` (had al een Metasploit-sectie) + `nmap-beginnersgids.html` (recon→exploitation = pedagogisch logische volgende stap). Beide: `article:modified_time` toegevoegd + JSON-LD `dateModified` + sitemap `lastmod` eerlijk naar 22 jul; homepage-lastmod mee (blog-link toegevoegd).
- **NEW `docs/launch-checklist.md`** — één blijvende, vindbare stap-voor-stap to-do (Blok 1 deze week / Blok 2 D-1 28 jul / Blok 3 launch-dag 29 jul / D+14) met vinkvakjes + verwijzingen naar announcement-kit/success-metrics/runbook. Reden: de volledige stappenlijst stond alleen in het ephemere plan-bestand + verspreid over docs; Heisenberg vroeg expliciet "hoe vind ik de stappen terug?".
- **Admin/besluit gelogd in TASKS.md:** #44 → BEWUST OVERGESLAGEN (poort niet weggeredeneerd, als afwijking genoteerd; launch-data vervangt validatiesignaal), #45 (value-prop/retentie) draait nu op echte launch-data i.p.v. validatie-sessies, launch-uitvoering-item gedateerd (29 jul, D-1/dag/D+14) + wijst als eerste naar de checklist.

**Verificatie:** validate-blogs 15/15, validate-docs `--deep` 9/9 (na sync van blog-count 12/12→13/13 + bundle-marker blog 415→447 KB), feed.xml + sitemap.xml well-formed XML (python parse), render-en-meet lokaal (dark/light/375px): 0 horizontale overflow (scrollWidth 360≤375), navbar/footer/consent-banner correct geïnjecteerd, breadcrumb aanwezig, alle 7 interne links resolven 200. Screenshots dark-mobiel + light-desktop.

**Commits (gepusht naar `main`):** `f6894b1` (blogpost + wiring + cornerstone-links), `4245ec9` (blog-count + bundle-marker sync), `7f65d94` (launch-beslissing #44/#45), `d45631d` (launch-checklist.md) + deze /summary doc-sync.

**Learnings:**
- **Filesystem-ground-truth-validatie dwingt afgeleide administratie mee te bewegen.** Een blogpost toevoegen trekt automatisch 3 checks uit sync: Check 6b (blog-count in TASKS-tabel), Check 9b (RSS-item-count == blog/*.html minus index), Check 9a (sitemap lastmod >= datePublished) + Check 5 (bundle blog KB ±5%). Drift-bestendig ontwerp = nieuwe content valt nooit stil buiten beeld, maar je moet de tabel/feed/sitemap/marker expliciet bijwerken. Ken die koppeling vóór je een post toevoegt.
- **datePublished = echte deploy-dag, niet de launch-dag.** Een post nu (22 jul) live zetten met datum 29 jul = future-dating → Google wantrouwt het + botst met "nooit datums faken". 22 jul is eerlijk én op de launch (29 jul) veruit de verste post = precies de freshness die het runbook wil.
- **Juridische claims mirroren, niet zelf verzinnen.** `metasploit.js` noemt "6 jaar" (warning) én "Federal Computer Fraud Act, 10 jaar" (US, manPage) — beide ongeschikt voor NL-copy. De 8 bestaande blogposts citeren art. 138ab Sr zónder strafmaat-getal; die framing gemirrord ([[feedback_verify_claims_against_artifact]]).
- **Cornerstone-touch: doe de niet-datumgevoelige waarde nu, laat de rest voor launch-dag.** De echte SEO-winst (interne links naar de nieuwe post vanaf posts die 'm natuurlijk noemen) kan meteen; de bredere Fase-2 date-align blijft Heisenberg's launch-dag-taak. Twee posten getoucht met eerlijke 22-jul-datums i.p.v. de hele cornerstone-set nu forceren (proportionele inspanning, [[feedback_proportional_effort_hobby]]).
- **Stappen die de gebruiker moet uitvoeren horen in een blijvend repo-bestand, niet alleen in het plan-bestand.** Het plan in `~/.claude/plans/` is sessie-scoped en kan opschonen; `docs/launch-checklist.md` is de duurzame single-source.

**Metrics delta:** blog/ 415→447 KB (+32, nieuwe post) | blogposts 12→13 | RSS-items 13→14 | src/styles/assets ongewijzigd (673/394/1030 KB) | 28 spec files / 213 tests ongewijzigd (geen code-wijziging, alleen content/docs) | 5 commits.

**Next steps (open, Heisenberg):** `docs/launch-checklist.md` afwerken → launch wo 29 juli. Ná launch: item #45 (value-prop/retentie) beslissen op de echte funnel-data. Item #46 open GA4-launch-dag-handelingen (annotatie).

---

## Sessie 198: Launch-readiness — 3 workstreams (08 jul 2026)

**Mission:** Gebruiker: "wat is iets fundamenteels dat we nog moeten doen voor de (uitgestelde) marketing-launch? Wees brutaal eerlijk." Analyse → gebruiker koos "alles aanpakken" (goedgekeurd plan, 3 workstreams).

**Brutaal-eerlijke analyse (de kern):** het product is technisch launch-ready (live, SEO, legal/consent, monetization, funnel-events instrumented) maar strategisch **on**gevalideerd — gebouwd/getest door maker + AI, **nul extern signaal**, geen vooraf-gedefinieerd succescriterium, go-to-market onuitgevoerd. Het fundamentele gat is geen feature maar extern bewijs dat de launch landt + een meetbaar succescriterium. Extra eerlijke randvoorwaarden: NL-taalplafond (grootste megafoons zijn Engels) + zwakke retentie-haak.

**WS1 — Launch meetklaar (code live):**
- **Funnel-audit** (`events.js`/`tracker.js`/`consent.js`): `trackEvent` is consent-gated → `window.gtag('event',...)` → dataLayer (GA4-ID `G-7F792VS6CE`). Call-site-grep: de meeste events waren al bedraad (tutorial-lifecycle, challenge/badge, signups, product-CTA, command_executed). **2 launch-kritische gaten:** (a) geen tracking op de primaire homepage→terminal-CTA's (de #1 conversie onmeetbaar); (b) geen activation-signaal. `onboardingEvent`/`feedbackSubmitted`-wrappers bleken dood (feedback.js roept `tracker.trackEvent` direct aan — geen functioneel gat).
- **Gebouwd:** NEW `terminalCtaClick`/`terminalActivated` in `events.js`; `data-terminal-cta="<locatie>"` op de 6 homepage-CTA's (hero/mid/final + 3 leerpad-deeplinks) + branch in `cta-tracking.js` (reuse delegated-click; cta-tracking laadt transitief via `init-components.js`); activation-hook in `terminal.js` naast `commandExecuted`, once-per-tab-sessie via `sessionStorage['hacksim_activated']`. Bewust géén nav-link (zat in `<noscript>` → kan met JS-vereiste analytics nooit vuren → dode attr verwijderd) + geen gedeelde geïnjecteerde navbar.
- **Verificatie:** browser-self-test (`scratchpad/ws1-funnel-selftest.mjs`) met consent pre-set via `addInitScript` (JSON `{analytics:true}` = zelfde key voor consent.js én tracker.js), funnel gedreven, dataLayer-`event`-tuples opgevangen (de shim werkt óók al is het externe GA4-script egress-geblokkeerd). **Alle funnel-events vuren, 0 ontbrekend**, incl. de 6 CTA-locaties; activation exact 1× + 0× na reload (guard survives reload); 0 code-console-errors (alleen `ERR_TUNNEL` van het geblokkeerde GA4-script). 56 e2e groen (command-coverage/gamification/tutorial — kern-flow intact).
- NEW `docs/launch-success-metrics.md`: funnel→event-mapping, streefgetallen als expliciete hypotheses (north-star = activation-rate), dag-1-minimum, GA4-config (key-events + funnel-exploration + custom dimensions + DebugView-check), read-order launch-dag.
- Cache-bump `main.js v=201→202-funnel` (terminal) + `init-components.js v=3→4` (24 marketing-pagina's).

**WS2 — Demand-validatie (doc):** NEW `docs/demand-validation-protocol.md` — uitvoerbaar cold-start-protocol: 5 taken (5-sec-positioneringstest → CTA-keuze → activation → missie → deel/terugkeer-intentie) met drop-off-checkpoints, 5 na-vragen, resultaten-template, recruiting voor NL-beginners (mijd HN/netsec — dat publiek vertekent het signaal). Uitvoering (werven + sessies) = Heisenberg.

**WS3 — Value-prop + retentie (doc):** NEW `docs/value-prop-and-retention.md` — brutaal-eerlijke hero-audit (correct maar niet magnetisch: beschrijft WAT i.p.v. uitkomst, feature-lijst-subtitle, geen proof boven de vouw, generieke CTA) + 3 kandidaat-hero's (uitkomst / frictie-nul / doelgroep-spiegel) om te toetsen in de WS2-5-sec-test + retentie-opties gerangschikt (terugkeer-pull > e-mail > streak > content-cadans). **Bewust niet live gezet** — wacht op WS2-validatie.

**Commits (alle ff-gemerged naar main `efdf958..23bbb1a`, gedeployed):** `4728c54` (WS1 funnel-code), `2b95854` (WS1+WS2 docs), `23bbb1a` (WS3 doc).

**Stop-hook signing-noot:** commits tonen als "Unverified" — gediagnosticeerd: **niet** door e-mail (auteur+committer al `noreply@anthropic.com` op álle sessie-commits) maar door ontbrekende SSH-handtekening. `commit.gpgsign=true` + key-pad `/home/claude/.ssh/commit_signing_key.pub` bestaat maar is **0 bytes** (geen private key) + ik draai als `root` zonder toegang tot de `claude`-user-keys → niet ondertekenbaar in deze omgeving. Bewust niet geforceerd: amend/rebase voegt geen handtekening toe (geen key) én zou gedeployde main-historie herschrijven voor niets.

**Learnings:**
- **Het fundamentele launch-gat is zelden een feature — het is extern bewijs + een meetbaar succescriterium.** 197 sessies polish + M8-analytics op 2% is een tell: energie ging naar product, niet naar validatie/distributie. De brutaal-eerlijke diagnose (over-gepolijst, ongevalideerd) was waardevoller dan welke feature ook.
- **Bouw WS3 (copy/retentie) niet vóór de validatie** — op eigen smaak de hero herschrijven = exact de onbewezen-aanname-fout die de analyse aankaartte. De 3 varianten leveren + laten toetsen is de integere vorm; "alles aanpakken" betekent de haakjes klaarleggen, niet blind bouwen.
- **Funnel-events bewijs je zónder productie-GA4** — de gtag-shim pusht naar `window.dataLayer` ook al faalt het externe script (egress); consent pre-setten via `addInitScript` + dataLayer-`event`-tuples lezen = volledige funnel-verificatie in de sandbox.
- **Activation hoort once-per-sessie, niet per command/page-load** — `sessionStorage`-guard (survives reload) voorkomt dubbeltelling; module-boolean zou per reload her-vuren.
- **"Unverified" ≠ verkeerde auteur** — check `%G?` + de signing-key vóór je history herschrijft; een lege 0-byte key betekent dat geen enkele amend/rebase het oplost, dus niet forceren op gedeployde main.

**Next steps:** WS2-sessies draaien (Heisenberg) → voedt WS3-keuze; GA4-goals configureren vóór launch; ná validatie hero-variant + retentie-v1 bouwen. TASKS.md items 43 (✅) / 44 / 45.

**Metrics delta:** src 671→673 KB (funnel-code). Spec-bestanden 28 (ongewijzigd — WS1 geverifieerd via scratchpad-self-test, geen e2e-spec toegevoegd). 3 NEW docs in `docs/`. validate-docs exit 0.

---

## Sessie 197: Laatste volledige simulator-bug-test + 2 fixes (07 jul 2026)

**Mission:** Gebruiker: "ik wil de functies en flow in de simulator 1 laatste keer testen op bugs." Scope (via AskUserQuestion): **alléén de terminal-simulator** (`terminal.html`); beleid: **bevestigde bugs direct fixen** met regressietest, één eindrapport.

**Aanpak:** 8 systematische browser-driving-passes met een eigen Playwright-harness (`scratchpad/driver.mjs`) tegen de lokale werkkopie (verse poort 8237, `BASE_URL`). Echte `fill`+`press('Enter')`, nooit synthetische `dispatchEvent` (Sessie 196-les). Chromium via de voorgeïnstalleerde binary `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` + `--no-sandbox` (Playwright 1.56 wilde build 1228 downloaden → override-config in de repo-root, niet gecommit).

**Dekking (alles schoon tenzij vermeld):**
- **1A Commands:** alle 41 commands (happy + error-paden) + 41 man-pages renderen + typo-fuzzy-suggestie + unknown-command-handling + nul console-errors.
- **1B Security-consent:** alle 5 tools — bare call toont warning zonder tool-output, args zetten consent + draaien, consent gedeeld over tools, `reset consent` re-armt, metasploit's no-arg-variant (typ-opnieuw = accept) werkt.
- **1C Tutorials:** alle 5 scenario's (fundamentals/recon/privesc/webvuln/exploitation) end-to-end voltooid + exit→resume op juiste stap + reload-mid-missie behoudt voortgang + herstart-na-voltooiing + cert-uitgifte + completion-CTA.
- **1D Challenges:** easy/medium/hard end-to-end, order-gevoelige (sql-sleuth/attack-chain) locken niet bij verkeerde volgorde, reload-mid-challenge resumet en voltooit, status/list render, tutorial⇄challenge mutual exclusion.
- **1E Gamification:** leerpad-vinkjes, hasError-guard (gefaalde traceroute vinkt níét af — Sessie 195-fix intact), EXPERT-unlock ≥4-van-6, dashboard/achievements/certificates/leaderboard/next/shortcuts render, next-funnel state-aware.
- **1F Core/input:** VFS-mutaties (touch/mkdir/cp/mv) overleven reload, `reset` herstelt VFS + bewaart history, ↑↓-history-navigatie, Tab command- én fs-pad-autocomplete, Ctrl+R reverse-search, Ctrl+L, Ctrl+C. **Modal-protection/focus-trap expliciet geverifieerd degelijk.**
- **1G Welcome-state:** vers → "Typ 'next'"-CTA; hervatte tutorial/challenge → suppress + neutrale placeholder + resume-notice.
- **1H Mobile 375px:** quick-command-bar tap (na typewriter-enable), mission-hiding ls/nmap-knoppen, completion in beeld — **en de bug.**

**Bug gevonden + gefixt — `3d7df13` mobiele 10px horizontale overflow:** `#terminal-container` erfde `width:100%` uit `styles/terminal.css` maar kreeg in de `@media (max-width:768px)`-regel van `styles/mobile.css` `margin:10px` → met `box-sizing:border-box` werd de rechterrand 385px op een 375-viewport. `body overflow-x:hidden` clipte het (geen zichtbare scrollbar, `window.scrollX` blijft 0) maar de terminal stond 10px uit het midden en de rechter 10px content werd afgekapt; de navbar (100% van de te brede body) rekte mee naar 385. Pre-existing (Sessie 189 noteerde de "10px offset" zonder de oorzaak te fixen). **Fix:** `width:auto` op de mobiele regel → blok past binnen de 10px-marges. Render-en-meet 375px: 0 doc-overflow over leerpad/help/man/achievements/challenge/shortcuts, container symmetrisch (left 10 / right 365), navbar 375. Desktop 1280 ongewijzigd, 0 console-errors. Cache-bump `mobile.css v=115→116` (24 HTML-refs). responsive-ascii-boxes + tutorial-mobile + gamification-mobile 53 groen.

**Robuustheidsfix (na brutaal-eerlijk advies, gebruiker koos "alleen #1") — `9bd487b` persistence-flush:** `progress-store.js` + `persistence.js` flushten hun 500ms-debounce alleen op `beforeunload` — op mobiel (iOS Safari) vuurt dat vaak niet bij app-switch/scherm-lock. `completeChallenge()` schrijft via de debounce, dus een challenge voltooien + tab backgrounden binnen 500ms verloor de voltooiing (de gebruiker moet 'm opnieuw doen). **Fix:** naast `beforeunload` nu ook `pagehide` + `visibilitychange(hidden)` → `flush()` in beide stores (idempotent, geen dubbel-schrijf-risico). Bewezen: challenge voltooid + `<500ms` `visibilitychange(hidden)` → voltooiing staat in localStorage (stond er vlak ervoor, binnen het venster, aantoonbaar níét); idem VFS-mutatie. NEW `persistence-flush.spec.js` (2 tests). Cache-bump `main.js v=199→200-persist-flush`. vfs-versioning + gamification suites groen (23 passed).

**Backlog vastgelegd — `d936e7d` TASKS.md item 42:** 10 spec-bestanden hardcoden productie-URL's i.p.v. `baseURL` (feedback, autocomplete-filesystem, css-variable-test, debug-console, debug-storage, feedback-onboarding-headers, modal-colors-simple, modal-headers, performance, responsive-breakpoints) → ~44 tests valideren nooit de werkkopie. Bewust uitgesteld: testinfra-schuld, geen gebruiker-bug, per-bestand-oordeel nodig (performance/debug wijzen mogelijk bewust naar prod). Hoogste-waarde-move = productie-smoketests van werkkopie-tests splitsen (apart project óf `test.skip`) i.p.v. blind URL-swappen.

**Commits:** `3d7df13` (mobiele overflow), `9bd487b` (persistence-flush), `d936e7d` (backlog-noot), + `/summary`-doc-sync. Alle op branch `claude/test-simulator-bugs-9rhzt4`.

**Learnings:**
- **~6 vals-positieven onderzocht + verworpen vóór ik iets een bug noemde** — heuristiek-matches op body-tekst (man-page bevat "command not found" als voorbeeld; tool-output bevat "waarschuwing"), progress-store 500ms-debounce vs een localStorage-lees op 350ms (leek dataverlies, was timing), scrollback-accumulatie in `innerText` (een eerdere `leerpad`-render bleef in beeld en matchte "Vergrendeld"/afgevinkte commands), en de by-design typewriter-tap-guard (`if (input.disabled) return`). Elke "bug" eerst tegen het codepad houden (Sessie 194-les).
- **Wantrouw je meetinstrument, niet alleen de code** — het eerste "modal-protection kapot"-signaal kwam doordat Playwright's `fill()` de focus voorbij de FocusTrap forceert (onbereikbaar voor een echte gebruiker); een echt-gebruikerspad (typen zonder force-focus) bewees dat de terminal onbereikbaar is met de legal-modal actief. Zelfde klasse als Sessie 185/190/196.
- **De duurzame mobiele fix zit in de breedte, niet in het scroll-anker** — Sessie 189 noteerde de 10px offset als symptoom; de oorzaak was `width:100%` + `margin:10px` samen. `width:auto` centreert én elimineert de overflow in één regel. Meet met `getBoundingClientRect` + `window.scrollX` of het gebruiker-zichtbaar is voordat je 't een bug noemt.
- **Persistence-flush op alleen `beforeunload` is een mobiele data-loss-klasse** — `pagehide` + `visibilitychange(hidden)` is het standaardpatroon; de fix is 3 regels per store, idempotent, en dicht een niet-zelfherstellende voltooiings-verlies (anders dan de bewust-geaccepteerde multi-tab-kwestie). Bewijs het venster (lees localStorage binnen 500ms = leeg) én de fix (na de event = gevuld).
- **Scope bewust smal houden bij een "laatste check"** — niet uitbreiden naar entry-points/hele-site (deep-link al spec-gedekt, blog/consent net ~15 sessies geaudit); een brede oppervlakkige sweep verwatert een scherpe, begrepen eindstaat. De prod-hardcoded-specs als backlog vastleggen i.p.v. half-blind omzetten vanuit een egress-geblokkeerde omgeving.

**Metrics delta:** src 670→671 KB (2 listeners + width:auto, netto ~0). Spec-bestanden 27→28 (+`persistence-flush.spec.js`), +2 tests. Geen bundle-budget-impact. validate-docs exit 0.

**Next steps:** backlog item 42 (prod-hardcoded specs). Geen open simulator-bugs.

---

## Sessie 196: CTA-consistentie-audit — "typ next" vs directe opdracht (06 jul 2026)

**Mission:** Gebruiker: "sommige tutorials zeggen dat je 'next' moet typen, andere geven direct een opdracht — bewust of bug? Ik wil de perfecte gebruikerservaring." Audit van de volledige begeleidingslaag + fixronde op alles wat niet klopte.

**Auditverdict (2 Explore + 1 Plan-agent): bewust design, geen bug.**
- Alle 40 tutorial-stappen (5 scenario's) schrijven een concreet commando voor en advancen *uitsluitend* op correct commando (`validate()` → true); er bestaat géén info-stap-type dat op 'next' advanced. `next` mid-tutorial herhaalt alleen de huidige stap (next.js:575-583) en staat in terminal.js' uitsluitlijst — kan een stap nooit afvinken.
- "Typ 'next'" leeft uitsluitend in de vrije-verkenning-funnel: onboarding-nudges, welcome-CTA, voltooiingsschermen, fase-transitieboxen. De ervaren "inconsistentie" is het contrast tussen twee bewust gescheiden modi.
- De Sessie 190/193-guards tegen kruisbesmetting (`tutorialActiveAtStart`, suppress-paden terminal.js:323-413) staan er aantoonbaar en dekken alle paden.

**Wél gevonden en gefixt — 4 commits:**
1. **`9532b0b` NL-copy-sweep:** ~31 Engelse "Type"-restanten → Typ. Grootste cluster: 24 hint-strings in álle 5 scenario's (`'Type het commando...'` + `'Type: <cmd>'`) — de Sessie-193 ~90-string-sweep matchte dat patroon niet. Verder: onboarding Ctrl+R-tip, reset.js, help-system.js, shortcuts.js-manpage (`Type Ctrl+R`→`Druk Ctrl+R`: toetsdruk ≠ typen), terminal.html edu-steps (2×) + search-placeholder `🔍 Type to search...`→`Zoek een command...` (NL + no-emoji-regel). Quote-unificatie double→single (onboarding/help/help-system).
2. **`914677d` marker-unificatie:** dezelfde CTA-string "Typ 'next' voor je volgende stap" verscheen met 3 markers — `[→]` (onboarding basis), kale `→` (progressive hints), `[?]` (leerpad-box + mobiel, dashboard) → overal `[→]` = primaire actie-CTA. Instructie-bullets (`→ Typ 'nm' en druk Tab`) blijven bewust kale lijst-pijlen. renderer.js-fallback-welcome punt weg. Renderer kleurt →/[?]/[→] alle drie info → visueel no-op.
3. **`43eeb58` `[?] TIP:` → `[TIP]`** (82 hits, 27 bestanden): dubbel-marker naast de canonieke Sessie-194-vorm. Vooraf geverifieerd: `_stripTips` matcht beide (dual-match blijft als vangnet, comment toegevoegd), beide vormen renderen info/cyaan, geen e2e-contract op `[?] TIP`, mobiel 3 chars korter. Geen multi-line-indent-gevallen.
4. **`7fce8c5` twee gedragsbugs (D1+D2):**
   - **D1 — welcome niet challenge-aware:** `ctaMode` (terminal.js `_renderWelcomeSequence`) keek alleen naar tutorialManager; een op boot hervatte challenge kreeg `[→] Typ 'next' voor je volgende stap` én +100ms `[✓] Challenge hervat ... typ 'challenge status'` = twee concurrerende instructies; placeholder bleef ook op de next-nudge staan. Fix: suppress + placeholder-flip óók op `challengeManager.isActive()` (veilig: `resume()` draait in `init()` vóór de welcome-render).
   - **D2 — missies verbruikten one-time-tips:** `onboarding.recordCommand()` draaide vol mee tijdens missies (commandCount++, `_getProgressiveHint()` consumeert flags) terwijl terminal.js de geretourneerde hint nulde. Omdat de drempels `===`-exact zijn (1/3/5/7/...) én de flags one-time, verdwenen de Tab-/Ctrl+R-tips permanent voor wie z'n eerste commands in een missie deed. Fix: `recordCommand(cmd, { deferHints })` — bij missie wél `commandsTried` (leerpad-vinkjes, Sessie 195!) + save, géén count/hints; de nulling-guard in terminal.js vervalt. Bewust géén `===`→`>=`: copy-mismatch ("Eerste opdracht voltooid!" bij count 8) + cascade van opgespaarde hints.

**Tests:** bug-J-reload-test uitgebreid (geen "Typ 'next'" in welcome + neutrale placeholder bij hervatte challenge) + NIEUW challenge-completion-CTA exact 1× / oude nudge 0× (spiegel van fundamentals.spec:114-119) + NIEUW deferHints-assert (commandCount 0 + flags falsy + commandsTried wél gevuld via localStorage-read). 27 specs / 238 tests.

**Verificatie:** volledige chromium-suite **0 failures** (230 passed, 3 bekende flaky-op-retry: 2× tab-autocomplete + 1× long-press-gesture, 5 skipped; verse poort 8199 + BASE_URL). Na-greps: `\bType\b` alleen vakjargon/comments, `[?] TIP` alleen vangnet, kale `→ Typ 'next'` 0. Render-en-meet: leerpad-box 38 regels × exact 1148px na markerswap; 375px geen overflow, `[TIP]`/`[→]` info-kleur; D1 live (challenge-resume: 1 instructie + neutrale placeholder, screenshot `.playwright-mcp/d1-challenge-resume-welcome.png`). validate-docs exit 0. Cache-bump `v=199-cta-audit`.

**Learnings:**
- **Stel eerst vast of de gemelde "inconsistentie" design is** — de architectuur (command-stappen vs next-funnel) was correct; alleen de verpakking (copy/markers) en twee randgevallen waren drift. Een "fix" op de architectuur had het bewuste twee-modi-ontwerp gesloopt.
- **Een string-sweep is pas af na een patroon-brede na-grep, niet na de gemelde plekken** — Sessie 193 verving ~90 `Type '`-strings maar miste `'Type het commando'` en `'Type: <cmd>'` (geen quote na Type). `grep -rn "\bType\b"` + handmatige jargon-triage ving alles.
- **"Onderdrukken" ná een mutatie ≠ uitstellen** — de hint nullen liet de state-mutatie (count++, flags) gewoon doorgaan; bij exacte drempels + one-time-flags is dat permanent verlies. Bevries de state aan de bron (deferHints), filter niet de output.
- **Symmetrie-check tutorial⇄challenge** — elke plek die tutorial-state leest hoort challenge-state ook te lezen; ctaMode was de zoveelste asymmetrie in deze klasse (vgl. traceroute/hasError Sessie 195). De filesystem-/simulator-hints waren wél al symmetrisch geguard, de progressive-hints niet — asymmetrie binnen één bestand.
- **Meet een marker-swap in een padEnd-box** — `[?]`→`[→]` is beide 1 UTF-16-unit dus padEnd klopt, maar glyph-breedte kan per font verschillen; `getBoundingClientRect` op alle 38 boxregels (uniek: 1148px) bewees het objectief.
- **Synthetische KeyboardEvents vuren de command-handler niet** — render-en-meet via `dispatchEvent(new KeyboardEvent(...))` deed niets (en de eerdere "gevonden" CTA bleek de welcome-regel); echte `fill`+`press('Enter')` wel. Wantrouw je meetinstrument (vgl. Sessie 185/190).
- **Bewust NIET (met reden):** next.js ASCII `[->]`/`<-` (padEnd-uitlijning + `next-funnel.spec` grept `/\[->\] Typ/` als contract); kale `→`-lijst-bullets (opsommingsteken ≠ CTA — promotie verwatert de hiërarchie); EN-vakjargon in tool-output (`hash type`, `Database type` — 80/20); usage-syntax-vormen (`[?] Gebruik: challenge start <id>` = andere klasse dan actie-CTA); `===`→`>=`-drempelconversie (zie D2).

**Next steps:** geen open bugs uit deze audit. Bekend maar geen blocker: 3 pre-existing flaky e2e-tests (autocomplete ×2, gesture — timing, groen op retry; kandidaat voor een test-hardening-sessie); Brevo mobiele-PDF-404 blijft handmatig Heisenberg-punt (Sessie 174).

**Metrics delta:** bundle ongewijzigd (string-level edits, src 670 / styles 394 / blog 415 / assets 1031 KB); tests 236→238 (+2), specs 27; cache `v=198`→`v=199-cta-audit`.

---

## Sessie 195: Leerpad-consistentie + brede spook-command-nasweep (05-06 jul 2026)

**Mission:** Gebruiker meldde "leerpad toont niet alle commands — ik gebruikte whois maar zie 'm niet". Follow-up na de fix: "wat missen we nog?". Twee delen: (1) de leerpad-bug oplossen, (2) systematisch dezelfde bug-klasse door de hele codebase auditen.

**Deel 1 — leerpad-fix (`c9ffc65`):**
- **Diagnose:** het `leerpad`-commando rendert een hardcoded 22-command-subset (`leerpad.js`), maar de tracking (`onboarding.getCommandsTried()`) registreert *elk* correct-gebruikt commando. `whois` (dat `tutorial recon` letterlijk leert!) kreeg dus nergens een vinkje. Scherpste inconsistentie: de GEVORDERD-tier bridge't naar `tutorial recon` (leert ping/nmap/whois/traceroute) terwijl FASE 3 ping/nmap/ifconfig/netstat toonde. De faselijsten stonden op **5 plekken** gedupliceerd en al gedivergeerd.
- **Fix:** NEW `src/core/learning-path.js` = single source of truth (`phases`/`tiers`/`PHASE3_UNLOCK_THRESHOLD`/`phaseCommandNames()`; pure datamodule zonder imports → geen cyclus). 6 consumenten omgezet: leerpad.js, next.js (+tips/voorbeelden), dashboard.js, help.js, dynamic-content.js, onboarding.js network-gate. Fase 2 +find/grep (8), Fase 3 +whois/traceroute (6, in recon-tutorial-volgorde → finisher ziet 4 aaneengesloten vinkjes).
- **EXPERT-unlock backwards-compat:** fase 3 groeide 4→6; "alles geprobeerd" zou bestaande unlockers her-vergrendelen → drempel `≥4 van 6` (`PHASE3_UNLOCK_THRESHOLD=4`). Oude 4/4-users houden unlock; recon-finisher (4 commands) unlockt direct. dynamic-content README-fasedetectie idem drempels (voorkomt fase-terugval bij bestaande users).
- Homepage-GEVORDERD-chips + leerpad-manpage (noemde 3 van 8 fase-2-commands) gecorrigeerd. Cache-bump `v=197-leerpad`. Tests: whois/traceroute/find/grep-dekking + EXPERT-unlock-assert; `responsive-ascii-boxes.spec.js` van hardcoded productie-URL → `baseURL` (testte nooit de werkkopie — Sessie-194-valkuil).

**Deel 2+3 — brede audit (`af2bd78` code, `6afd3d6` content/docs):** 3 parallelle Explore-audits (content-oppervlakken / in-app-data / docs) → 20 inconsistenties, dezelfde klasse.
- **Functioneel (code):** (a) terminal.js `_shouldTrackCommand` miste traceroute's `Failed to resolve` in de `hasError`-markers → een gefaalde traceroute werd als succes getrackt en vinkte Fase 3 af (nieuwe regressietest). (b) `SIMULATOR_COMMANDS` stond 2× gedupliceerd (help.js + onboarding.js) en miste `hint`+`shortcuts` → `hint` (zelf-verklaard `[HACKSIM]`) kreeg geen `*` in help; één named-export-bron gemaakt, shortcuts.js-manpage kreeg de `[HACKSIM]`-noot. (c) badge `network-novice` hardcodede de fase-3-lijst → `phaseCommandNames(2)`.
- **Content:** terminal.html "Populaire Commands" prees **wireshark** aan (bestaat niet) → traceroute; commands/index.html toonde 39/41 (`shortcuts`+`welcome` ontbraken volledig, incl. JSON-LD `numberOfItems` + stats-balk) → 41; blog-spoken `ps`/`top`/`uname`/`curl` (3× dode `#cmd-curl`-anchor)/`chmod` eerlijk gemaakt; hashcat-flag-voorbeeld gekaderd als "echte hashcat"; kale-command-CTA's (sqlmap/nikto) conform het consent-model (kaal = warning, dus doelwit toegevoegd).
- **Docs:** prd Bijlage A "30 commands"→41 (+HackSimulator-groep); style-guide stale `[X]`=completed → `[✓]` (botste met eigen marker-tabel + renderer + memory-regel) + echte functienamen; commands-list tutorial/leerpad-voorbeelden; help-system "30 commands"→41; 6 manpages markeerden externe tools (rename/burp/mtr/john/wpscan) als "(niet in simulator)".

**Commits:** `c9ffc65` (leerpad, eerdere sessie-turn) + `af2bd78` (code/tests) + `6afd3d6` (content/docs). Cache-bumps `v=197-leerpad` + `v=198-consistency`.

**Learnings:**
- **"Data gedupliceerd in N views" is de echte bug — niet het ontbrekende item.** De fix is niet "voeg whois op 5 plekken toe" maar de duplicatie elimineren (learning-path.js). Zodra één plek wijzigt (recon-tutorial kreeg whois) divergeert de rest geruisloos: geen error, alleen een gebruiker die z'n vinkje mist.
- **Verifieer een audit-suggestie vóór je 'm toepast.** De audit wilde feed.xml OWASP "2021"→"2025"; verificatie toonde dat 2021 de officieel uitgebrachte editie is (2025 nog concept) en dat de blog-meta bewust 2021 zegt → suggestie was fout. Blind toepassen had een feitfout geïntroduceerd. Zelfde discipline als [[feedback_verify_before_launch_critical]].
- **Een tracking-guard die de meeste commands correct afhandelt kan één command anders behandelen dan z'n buren.** whois/ping's foutstrings zaten in `hasError`, traceroute's niet — precies het asymmetrie-patroon dat de leerpad-bug zelf ook was.
- **"hop voor hop" is geen Nederlands** (vak-idioom letterlijk vertaald) → "stap voor stap" (user-correctie; [[feedback_nl_copy_dejargon]] uitgebreid).
- **Bewust NIET (met reden):** help-system categorie-lijsten registry-derived maken (nu correct, refactor te breed); `hostname`/`uptime` in gamification-performance.spec (dekt bewust het command-not-found-pad); E2E-dekking voor metasploit/welcome (genoteerd, geen blocker).

**Next steps:** geen open technische items uit deze audit. Kandidaat-vervolg: help-system categorie-lijsten alsnog uit de registry afleiden als er ooit een derde consument bijkomt.

**Metrics delta:** src 666→670 KB (+4: learning-path.js). Tests 232→236 / 27 spec files (+4 in bestaande specs, geen nieuwe spec). Cache `v=198-consistency`.

---

## Sessie 202 — learnings (geroteerd uit CLAUDE.md, Sessie 208)

**Sessie 202:** Mobiele kolom-uitlijning + box-truncatie in terminal-output (28 jul 2026)
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

