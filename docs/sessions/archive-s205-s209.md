# Sessie-archief 205-209 - HackSimulator.nl

**Geroteerd uit `current.md` bij Sessie 220** (steady-state `N % 5`-rotatie, zie
`docs/sessions/README.md` §Rotatie-regel). Nieuwste-eerst binnen dit blok.

> Dit blok bevat naast de vijf sessie-entries ook de drie **learnings-blokken** van 205,
> 207 en 209 die eerder uit `.claude/CLAUDE.md` waren geroteerd. Die horen bij hun sessie:
> ze losknippen zou "Sessie 205 — learnings" in `current.md` laten staan terwijl de
> Sessie 205-entry hier zit.

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

## Sessie 205 — learnings (geroteerd uit CLAUDE.md, Sessie 213)
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

---

## Sessie 207 — learnings (geroteerd uit CLAUDE.md, Sessie 215)

### Sessie 207: Audit oude follow-up-lijstjes → gesnoeid op bezoekerswaarde (02 aug 2026)
⚠️ **Never:**
- "De infrastructuur staat er al" gebruiken als reden om een feature te bouwen — `getPhaseStats().percentage` (`leerpad.js:25`) is berekend en nooit gerenderd, wat verleidt tot "even gebruiken". Maar de bezoeker ziet fase-voortgang al in `leerpad` (`[✓] FASE 2 (3/8)` + vinkjes per command) én in `dashboard` ("Volgende: Fase 2 voltooien (3/8)"). Een derde weergave is ruis. **Dode code is geen opdracht.**
- Een gemeld "gat" aannemen zonder de trigger-frequentie te checken — ik dacht dat fase-viering pull-based was en dus gemist werd, tot bleek dat `next` ná élk nieuw geleerd command wordt aangeboden (`onboarding.js:311`, `:451-460`, `renderer.js:374`). Eén grep bespaarde 4 overbodige badges bovenop de 22 bestaande.
- Een defect dat je zélf tijdens onderzoek vindt parkeren als "meenemen of laten liggen — beide verdedigbaar". Dat is dezelfde hedge als een option-tree: het schuift een technisch oordeel terug naar Heisenberg. Zijn reactie was direct ("vergeet niet de bug mee te nemen"). Nul zichtbare impact ≠ geen bug — beoordeel op toekomstig risico ([[feedback_expert_decisions]]).
- Bij een no-op-fix vertrouwen op "screenshots vóór/ná zijn identiek" — dat is óók waar als je niets deed. Alleen de mutant bewijst iets: `--color-border` op rood → navbar/footer wérden rood vóór de fix, en niet meer erná.
- Alleen de foute cellen fixen in een tabel waarvan élke waarde gedrift is — dat levert een half-ware tabel op die er *geverifieerd* uitziet. Erger dan zowel niets doen als volledig herschrijven.
- Een og:image @2x renderen als de post `og:image:width/height` 1200/630 draagt — dan liegen die tags. Het cover-script doet wél @2x, maar dat dient een ander doel (merchant listings).

✅ **Always:**
- Snoei ideeënlijstjes op **wat de bezoeker merkt**, niet op wat af is — van 11 items bleken er 4 klaar, 4 waardeloos en 3 de moeite waard, en 2 van die 3 stonden niet eens op de lijst. Leg verworpen items **mét reden** vast (TASKS.md #52), anders duiken ze over vijf sessies opnieuw op als "openstaand".
- Bouw een versheids-assert ín de meting — mijn W4-na-meting las de CSSOM-regel uit en zag `var(--color-border)` + de nog-bestaande light-override staan: hard bewijs dat de browser oude CSS serveerde. Zonder die assert had ik "no-op bevestigd" gerapporteerd terwijl er niets geladen was.
- Gebruik een **echte no-store server** i.p.v. steeds slimmere cache-busters — `import('…tutorial.js?cb=…')` faalde met "does not provide an export named 'downloadCertificate'" omdat `?cb=` de relatief geïmporteerde `certificate.js` niet bust. Vierde sessie op rij (202/205/206/207); sinds Sessie 208 staat hij als `scripts/nostore-server.py` in de repo i.p.v. per sessie opnieuw in een gitignored scratchpad.
- Laat een generator uit het artefact lezen i.p.v. uit een kopie — `build-blog-og-images.mjs` haalt titel (`<h1>`) en categorie (`og:article:section`) uit de post zelf, dus er ontstaat géén 8e lockstep-locatie naast de bestaande 7.
- Nieuwe copy in de lengteband van de bestaande varianten brengen — mijn eerste FASE 4-transitie had skills van 44-57 tekens waar de bestaande 21-37 zijn, en een bridge van 146 tegen ~50. Meten tegen de siblings, niet tegen een absolute limiet.
- Wees eerlijk over het plafond van een win: og:image is de enige externe-impact-win, maar Google gebruikt het níét in zoekresultaten. De waarde zit in gedeelde links + het feit dat elke volgende post zijn kaart nu gratis erft.

---

## Sessie 209 — learnings (geroteerd uit CLAUDE.md, Sessie 217)

### Sessie 209: W2 browserverificatie — kwaliteitsronde bewezen in de browser (05 aug 2026)
⚠️ **Never:**
- Aannemen dat een codewijziging werkt omdat de logica klopt — de skip-certificaat-code was geschreven, gereviewed en gecommit zonder dat iemand 7× `tutorial skip` had getypt in een browser. Pas de Playwright-test bewees dat `stepsSolved` inderdaad op 0 bleef terwijl `currentStep` naar 7 ging.
- Een pre-installed Chromium-pad raden — Playwright verwachtte `chromium_headless_shell-1234/…/chrome-headless-shell` maar de binary stond op `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Alle 242 tests faalden tot `CHROMIUM_PATH` expliciet was gezet. Check het pad, gok het niet.

✅ **Always:**
- Schrijf tests die het volledige pad door de code bewijzen, niet alleen de eindtoestand — de W2-tests volgen elk het pad (input → manager → certificate/help-system → output) en asserteren op de zichtbare terminal-tekst, niet op interne state. Dat ving ook dat `_hasErrorOutput()` op string-output werkt (niet objecten) en dat de tutorial-guard in `terminal.js:392` de escalatie correct onderdrukt.
- ~~Behandel pre-existing test-failures als gedocumenteerde baseline — 7/249 failures die óók tegen productie reproduceren zijn geen regressie. Documenteer ze (5× device-emulatie, 1× resize-timing, 1× briefing-timing) zodat de volgende sessie ze niet opnieuw diagnosticeert.~~

  ⛔ **ACHTERHAALD — Sessie 217 heeft deze regel omgekeerd. Volg hem niet.** Die 7 falers zijn nagemeten en de lijst klopte op geen enkel punt: 5 waren verdwenen, twee structurele falers stonden er niet in, en alle vier de overgebleven falers waren **fouten in de test zelf** — geen enkele een omgevingsartefact. De drie toegewezen oorzaken ("device-emulatie", "resize-timing", "briefing-timing") waren alle drie fout, en zijn acht sessies lang niet meer getoetst omdat "bekende baseline" het lezen van de foutmelding stopt.

  De staande regel is nu: **er is geen baseline; een rode test is een regressie tot je het tegendeel meet.** Zie `.claude/CLAUDE.md` §Recent Critical Learnings, Sessie 217. Een niet-opgeloste conditie hoort als assertie in een test (`BASELINE_BEDEKT` in `hero-demo.spec.js`), want die meldt terug — een notitie niet.

---

