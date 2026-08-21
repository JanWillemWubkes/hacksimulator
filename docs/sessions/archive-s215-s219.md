# Sessie-archief 215-219 - HackSimulator.nl

**Geroteerd uit `current.md` bij Sessie 230** (steady-state `N % 5`-rotatie, zie
`docs/sessions/README.md` §Rotatie-regel). Nieuwste-eerst binnen dit blok.

> Dit blok bevat naast de vijf sessie-entries ook de vijf **learnings-blokken** van 215 t/m
> 219 die eerder uit `.claude/CLAUDE.md` waren geroteerd. Die horen bij hun sessie: ze
> losknippen zou "Sessie 215 — learnings" in `current.md` laten staan terwijl entry 215
> hier zit (de val die bij Sessie 220 werd vastgesteld).

---

## Sessie 219: Onder "in cijfers" was de homepage één blok — en de band die als voorbeeld gold, maakte in light mode nul verschil (09 aug 2026)

**Mission:** Heisenberg constateerde dat de secties tot en met "HackSimulator in cijfers" visueel onderscheidend zijn en alles daaronder als één blok leest, en vroeg om een UX/UI-analyse als expert. Tweede vraag: nu er ook een Sample Juridisch is, is het verstandig die naast de Sample Pentest op de homepage te zetten?

**Commits:** `e7cc0c4` (gepusht)

### De klacht was meetbaar, en erger op mobiel

Methode: groepeer opeenvolgende secties op *effectieve* achtergrond en meet de langste reeks zonder wissel.

| | @1440 | @375 |
|---|---:|---:|
| Langste reeks **boven** cijfers | 1023px (1,6 scherm) | 1329px (1,6 scherm) |
| Langste reeks **onder** cijfers | **2390px (2,66)** | **3078px (3,79)** |
| Ná deze sessie | **949px (1,05)** | **913px (1,12)** |

De reeks bestond uit `how-it-works` + `leerpad` + `blog-links` + `faq`. Op mobiel telt mee dat `.landing-section` onder 768px van 96px naar 32px padding zakt: de scheiding tussen twee secties is daar 64px witruimte in plaats van 192px — mínder ruimte én geen kleurwissel.

Wat de bovenhelft in werkelijkheid structuur geeft is niet subtiliteit maar de **groene solution-sectie** (Δ ~200). De twee banden daar zijn Δ2 en Δ0; de haarlijnen doen bijna al het werk. Dat is relevant voor de diagnose: er ontbrak onder de vouw niet alleen een kleurwissel, maar élke vorm van interpunctie.

### Twee bugs die alleen uit een meting komen

**1. De light-mode cijfers-band had nul kleurverschil met de pagina.**

`[data-theme="light"] .results-section` was `rgba(248, 248, 248, 0.8)` over een `#f8f8f8` pagina. Dat composit naar **exact `rgb(248,248,248)`** — verschil `[0,0,0]`. De comment erboven zei *"Zeer subtiel off-white"*: de bedoeling klopte, de rekensom maakte hem nul. De band die als goed voorbeeld gold bestond in light mode alleen uit twee haarlijnen. Dit is dezelfde familie als Sessie 215 en 217 — de derde keer dat een rgba-over-ondergrond niet is uitgerekend.

**2. "Banden lichter maken" is op deze site structureel fout.**

Mijn eerste prototype gebruikte `#161b22` (de nieuwsbriefkleur). De kaarten zijn `rgba(22, 27, 34, α)` — tinten van precies dat `#161b22`. Een kaart op zo'n band composit naar de bándkleur:

```
kaart-Δ = 0.3 × |kaartkleur − bandkleur|   →   0 zodra de band naar #161b22 kruipt
```

Ik zag het niet in de cijfers (band Δ11: prima) maar op de screenshot: kaarten met alleen nog een randje. Een kaart heeft hier geen eigen kleur, alleen een verhouding tot wat erachter staat.

### De regel die eruit volgde

> **Pagina = oppervlak. Band = verdieping. Kaart = verhoging.**

In beide thema's gaat de band *onder* `--color-bg`, zodat de kaart de lichtste laag blijft. Dat is de enige richting die niet botst met de kaart-tinten, en in light mode is het precies de Stripe/Linear-elevatie die de comment op `landing.css:2232` al nastreefde.

| | band vs. pagina | kaart vs. band |
|---|---:|---:|
| dark, vóór | 2 | 3 |
| dark, ná (`#080b0f`) | **8** | **6** |
| light, vóór | **0** | 7 |
| light, ná (`#eceef0`) | **12** | **19** |

Beter op beide assen. Eén nieuwe band volstond (`.leerpad-section`): plaatsing telt, niet aantal — `how-it-works` moet oppervlak blijven omdat het op de cijfers-band volgt, dus leerpad is de eerste mogelijke beat en knipt de reeks doormidden.

### Implementatie

- **`--color-bg-alt`** in beide thema's (`main.css`).
- **`.section-band`** (verf: achtergrond + twee haarlijnen) en **`.landing-section.section-band`** (full-bleed) staan bewust los: `.trust-bar` en `.homepage-newsletter` zijn al volle breedte en hebben alleen de verf nodig.
- De **`padding-inline: max(…)`** vervangt een inner wrapper die `.leerpad-section` niet heeft (h2, subtitle en `.leerpad-cards` zijn directe kinderen, dus kaal `max-width: 100%` zou de kaarten meetrekken). Geverifieerd byte-identiek aan een gewone begrensde sectie: `[45, 1381]` @1440 naast `.how-it-works-steps`, `[20, 340]` @360 naast `.faq-grid`.
- **`--band-gutter`** is geen luxe: het mobiele `padding`-shorthand staat in een media query, die géén specificiteit toevoegt (0,1,0) en dus verliest van de modifier (0,2,0). Zonder de custom property bleef de desktop-gutter op mobiel staan.
- Netto **vier regels verwijderd, twee toegevoegd**. `.results-grid` ligt nu op dezelfde content-rail als de rest (was `[32,1393]`, nu `[45,1381]`).
- **`?v=219` op main.css én landing.css.** `.section-band` leest `--color-bg-alt`; een oude cached `main.css` laat die var ongedefinieerd, waarna `background` terugvalt op transparent en álle banden verdwijnen.

### Twee cascade-verliezen die alleen `getComputedStyle` verraadt

Na de eerste implementatie waren twee van de vier banden Δ0. Beide declaraties zien er los prima uit:

- `.leerpad-section { background: transparent }` — **gelijke** specificiteit aan `.section-band`, maar ~480 regels later in hetzelfde bestand. Bronvolgorde besliste.
- `[data-theme="light"] .homepage-newsletter { background-color: var(--color-bg-modal) }` — herhaalde letterlijk zijn eigen basisregel (`--color-bg-modal` is zelf al thema-afhankelijk), maar deed dat op (0,2,0) en versloeg daarmee de band. Pure redundantie die toevallig zwaarder woog.

De sample-pagina's houden hun verf via `.sample-hero-form.homepage-newsletter` (0,2,0) en zijn byte-identiek geverifieerd: `#161b22` dark / `#ffffff` light, eigen randen, geen band-klasse.

### Bewijs

- **26/26 groen** over chromium/firefox/webkit voor het nieuwe blok. De `max()`-met-custom-property is apart op firefox+webkit gecontroleerd — dat was het enige echte cross-engine-risico in de diff.
- De **eerste testrun gaf 5 rood** omdat `playwright.config.js:32` standaard tegen *productie* draait (`BASE_URL || 'https://hacksimulator.nl'`). Geen bug maar een gratis nulmeting: productie is de oude code en reproduceerde exact de cijfers van vóór de wijziging.
- **Mutant "band == pagina"** → ritme-assertie rood met **2392px (2,66)** en **3070px (3,78)**: cijfer voor cijfer de oorspronkelijke meting.
- **Mutant "band == `#161b22`"** → alleen de kaart-Δ-assertie rood, ritme blijft groen. Dat bewijst dat die assertie niet overbodig is: zij ving mijn eigen eerste ontwerpfout. Light bleef groen omdat de mutant alleen het dark-token raakte — één thema testen had de bug doorgelaten (zelfde les als Sessie 215/217).

**Zwakte in mijn eigen assertie, gevonden door de mutant.** Ik ankerde de ritmemeting eerst op "de reeks die `results-section` bevat". Verliest die sectie haar band, dan slokt die reeks de hele pagina op en meet de assertie stilzwijgend een staartje — hij ging groen op een pagina die kapot was. Nu knip ik op DOM-positie, wat niet kan dissolven.

### De tweede vraag: juridische sample op de homepage — nee

Beantwoord zonder werk, met de meting erbij:

- De homepage eindigt **al met drie opeenvolgende asks** (final-cta → lead-magnet → nieuwsbrief). Een vierde verzwakt ze alle vier, en twee samples naast elkaar dwingen een keuze op het moment dat je nul wrijving wilt.
- De north-star van deze pagina is *activation*, niet e-mail (`docs/launch-success-metrics.md:39`); lead magnets zijn trechterstap 6.
- De asymmetrie is echt maar niet homepage-vormig: **17 inkomende links naar de pentest-sample tegen 1 naar de juridische** (alleen de chip op `gidsen.html:444`). De natuurlijke plek zijn de drie juridisch-getinte blogposts (`wat-is-ethisch-hacken`, `ethisch-hacker-worden`, `social-engineering`) die `gidsen.html:457-459` zélf al als juridische achtergrond labelt maar die alle drie naar de *pentest*-sample linken.
- **Zwaarst:** `docs/newsletter/brevo-setup-sample-juridisch.md:9-10` zegt dat stap 2+3 (template + automation) niet af zijn, terwijl `sample-juridisch.html:132` belooft *"We mailen 'm ook zodra je je inschrijving bevestigt"*. Meer verkeer daarheen schaalt een niet-nagekomen belofte.
- Er staat bovendien een poort op dit werk: `.claude/plans/lead-magnet-followup.md:13-15` hervat lead-magnet-werk pas bij ≥5 Brevo-contacten óf ≥50 GA4-pageviews/maand op `/sample-pentest.html`.

**Los gat, vastgelegd niet opgelost:** `index.html` bevat **nul** links naar `/gidsen.html` — de enige pagina die beide samples symmetrisch behandelt is vanaf de drukste pagina alleen via de navbar bereikbaar.

### De rode test was niet van mij (gemeten, niet beweerd)

De 12-spec-run over drie motoren gaf **413 passed / 1 failed / 15 skipped**. De faler: `performance.spec.js:480` (VFS-groei) op firefox. Twee servers ernaast gezet (`d0ba157` op 8898, `e7cc0c4` op 8899), 5× per kant serieel: **5/5 groen op beide**, identiek. En CSS kan onmogelijk beïnvloeden hoeveel bytes `touch` naar localStorage schrijft. Hij viel alleen tijdens een run waar ik zelf twee extra Playwright-runs naast had gezet — dezelfde belasting-naast-de-meting als Sessie 218.

**Maar de overlever verklaren leverde iets ergers op:** die test asserteert serieel helemaal niets. De `avgGrowth === 0`-guard op regel 530 (bedoeld tegen 0/0 = NaN) zet "er is niks gemeten" om in "geslaagd" — **10 van de 10 seriële runs namen die tak**, met `hacksim_filesystem` onaangeroerd terwijl `persistence.js:13` diezelfde sleutel gebruikt. Hij wordt pas een echte assertie onder load, en is dán variantie-gevoelig. Vastgelegd als openstaande diagnose (TASKS.md #62), niet als baseline.

### De console-fout die ik bijna als bug rapporteerde

Tijdens dat onderzoek gaf `terminal.html` op mijn lokale server: *"The requested module '../gamification/certificate-templates.js' does not provide an export named 'CERT_DISCLAIMER'"*. Oude code: 0 fouten. Productie: 0 fouten. JS byte-identiek (`diff -rq` leeg), werkmap schoon, en de export staat gewoon op regel 21.

De verklaring stond in onze eigen regels. Warme fetch: **1603 bytes zonder** de export. Cache-bustende fetch: **2157 bytes mét**. Mijn MCP-debugbrowser hield een `certificate-templates.js` van vóór commit `feea49e` (Sessie 208, toen het bestand 1611 bytes was) vast — exact de val die `.claude/rules/architecture-patterns.md` §Cache Strategy beschrijft: *"Verifieer een submodule-fix altijd tegen een no-store server of via `import('…?cb='+Date.now())`, nooit tegen een warme browser."* De server stuurde keurig `no-store` en 40/40 curl-opvragingen gaven 2166 bytes; het was puur de browser.

### Metrics

| | Vóór | Ná |
|---|---:|---:|
| Langste oppervlak-reeks onder cijfers @1440 | 2390px | 949px |
| Idem @375 | 3078px | 913px |
| Band vs. pagina (dark / light) | 2 / **0** | 8 / 12 |
| Kaart vs. band (dark / light) | 3 / 7 | 6 / 19 |
| `test()`-declaraties | 288 | 290 |
| Bundel (limiet 1120 KB) | 1091,02 KB | **1093,90 KB** (marge 2,3%) |

⚠️ **+2,88 KB terwijl de diff nétto CSS-regels verwijdert.** Het commentaar dat beide bugs vastlegt is langer dan de code die het vervangt. Bewuste keuze — die twee rekensommen zijn precies wat een volgende sessie anders opnieuw moet ontdekken — maar de marge is nu 2,3% en de volgende wijziging tikt het alarm aan. Dan is de vraag niet "hoe knip ik bytes" en zeker niet weer een bump: 1000 → 1050 → 1100 → 1120 is drie bumps in 15 sessies.

### Volgende stappen

- `performance.spec.js:480` diagnosticeren (TASKS.md #62) — waarom persisteert `touch` in de testcontext niets?
- Overwegen om `index.html` één contextuele link naar `/gidsen.html` te geven (wayfinding, geen extra ask).
- De juridische Brevo-automation afmaken óf de belofte op `sample-juridisch.html:132` verzachten, vóór er meer verkeer heen gaat.

---

## Sessie 218: De strook onder de terminal was AdSense-vulling die AdSense vijf maanden overleefde (09 aug 2026)

**Mission:** Heisenberg vroeg of alles onder de terminal-simulator nog nodig was, nu er geen advertenties meer zijn — met de opdracht grondig te analyseren, vragen te stellen en de keuze te beargumenteren. Verwijderen, laten staan of iets anders eronder zetten waren alle drie open.

**Commits:** `9b44314` (gepusht)

### De herkomst besliste de vraag

Dit was geen smaakkwestie zodra de git-historie erbij lag:

| Commit | Datum | Titel |
|---|---|---|
| `f748c38` | 1 mrt 2026 | *"enrich noscript fallbacks for SEO and **AdSense crawlability**"* — voegde de 131 regels + de stylesheet toe, met cache-buster `?v=108-adsense-content` |
| `1cc04ff` | 4 mrt 2026 | *"full-viewport terminal + scroll hint **for AdSense content**"* — bericht: *"Education content stays below the fold, fully crawlable by AdSense"* |
| `feea49e` | Sessie 208 | *"Feat: advertenties eruit"* — 44 advertentieblokken uit 20 bestanden, €0 opbrengst tegen 251,7 KB third-party |

De aanleiding stond zelfs expliciet in `.claude/plans/monetization-C-content-seo.md:96`: *"Thin content penalty: <1000 woorden = Google ignores"*. Die drempel was van een advertentienetwerk dat sinds Sessie 208 niet meer bestaat. De strook is daarna nooit heroverwogen — en, zo bleek, ook nooit gemeten.

**Let op:** de 100vh-terminal komt uit dezelfde commit. Ook die vorm is dus AdSense-erfgoed. Bewust níét teruggedraaid: voor een app-oppervlak is een groot terminalvenster gewoon goed, en dat is een aparte vraag.

### Nulmeting op productie (1280×800)

| | Vóór | Ná |
|---|---:|---:|
| Hoogte strook | 2424px | **1784px** (−26%) |
| Aandeel van de pagina | 65% | 58% |
| Pagina totaal | 4,67 schermen | 3,87 |
| Links | **3** | 12 |
| `<h1>` op de pagina | **0** | 1 |
| Woorden | 396 | 284 |

De drie links zaten allemaal in het láátste blok, na vier schermen scrollen. De zes command-kaarten noemden `nmap`, `hashcat` en `sqlmap` bij naam en waren geen link. Het was een doodlopende weg met een uitgang op de achterdeur.

### "Alle drie de rollen" was het probleem, niet het antwoord

Heisenberg dacht dat de pagina app-oppervlak, doorstroom én SEO-landingspagina tegelijk was. Dat is precies waarom de strook was wat hij was: hij probeerde drie dingen en deed ze alle drie slecht. Tegenbewijs per rol:

- **Onboarding:** staat vier schermen ónder de plek waar onboarding nodig is, terwijl de terminal het zélf zegt op het juiste moment — `src/ui/onboarding.js:196` print `[→] Typ 'next' om te beginnen`, de placeholder zegt hetzelfde, en `next.js`/`leerpad.js` bestaan als commands. Erger: `.scroll-hint` staat onder 768px op `display: none` (bewuste keuze Sessie 176 wegens botsing met `#mobile-quick-commands`), dus mobiel weet niet eens dat er iets onder staat.
- **Doorstroom:** 2424px met drie links, geen daarvan naar `/commands/` terwijl er een blok "Populaire commands" stond.
- **SEO:** de enige echte rol — maar de pagina had nul `<h1>`, en de tekst was geschreven om een advertentiedrempel te halen, niet om een zoeker te beantwoorden.

**Rangschikking i.p.v. gelijkwaardigheid.** De gedocumenteerde north-star van deze pagina is *activation-rate* — `docs/launch-success-metrics.md:44`: "typte de bezoeker een command", niet "las hij iets". Alle site-brede CTA's wijzen hiernaartoe, en alle monetisatie (Brevo, Ko-fi, lead magnets) staat op `index.html`; `terminal.html` heeft in eigen markup nul CTA's. Dus: app-oppervlak eerst, SEO een echte maar secundaire bijrol, en "onboarding onder de vouw" is geen rol maar een bug.

### Wat er is gebeurd, per blok

| Blok | Beslissing | Grond |
|---|---|---|
| Intro | `<h2>` → **`<h1>`**, ingekort naar 38 woorden | De pagina had er nul; deze alinea neemt bovendien de grootste beginnersangst weg ("je kunt onmogelijk per ongeluk echte systemen aanvallen") |
| Populaire commands | Kaarten → links naar `/commands/#cmd-X` + CTA | Dubbelde `/commands/` en bevatte nul links. De ankervorm was al site-brede conventie (12× `#cmd-nmap` vanuit blogposts) |
| Zo begin je | **Geschrapt** | De terminal zegt het zelf, op het juiste moment |
| Veelgestelde vragen | Ongemoeid | Dichtste inhoud per pixel (160 woorden / 372px); schema-gebonden |
| Lees meer op onze blog | → "Verder lezen", 2 kolommen, +woordenlijst +gidsen | Enige werkende uitgang; 450px voor 25 woorden was de dunste inhoud van de strook → 315px |

"Bekijk alle **40+** commands", niet "41": `scripts/validate-docs.sh:432` handhaaft een site-brede `N+`-vloer, en het plan had hier per ongeluk een exact getal in staan.

### Drie pre-existing bugs die bovenkwamen

1. **Alle drie de bloglabels waren verlopen.** `"Wat is Ethisch Hacken? - Alles wat je moet weten"` tegen een `<h1>` die *"Wat is ethisch hacken?"* luidt; `"Terminal Basics voor Beginners"` tegen *"Terminal commands voor beginners"*; `"Nmap Beginnersgids - Netwerk Scanning Uitgelegd"` tegen *"Netwerk scanning met Nmap: beginnersgids"*. Alle drie bovendien in Engelse Title Case. De homepage heeft hier een test voor (`homepage-conversion.spec.js:311`), terminal.html niet — dus dreven ze stil weg.
2. **Zonder JavaScript stond de hele strook op `opacity: 0`.** `.edu-command-card`, `.terminal-edu-faq .faq-item` en `.terminal-edu-blog-links a` starten verborgen en worden alleen zichtbaar als de IntersectionObserver `.visible` toevoegt. `index.html:62-66` heeft daar een `<noscript><style>`-vangnet voor; terminal.html heeft het nooit gekregen. Dat maakte élke link erin waardeloos zonder JS — en ik stond op het punt er negen bij te zetten.
3. **`WebPage.name`, `<title>` en de zichtbare kop waren drie verschillende strings.** `WebPage.name` is nu woordelijk gelijk aan de nieuwe `<h1>`.

### Eén bug van mezelf, gevonden door te meten

De nieuwe CTA "Bekijk alle 40+ commands" mat als kale tekstlink **193×22px** op 375px — onder de 44px WCAG AAA-tikdoelgrens. Nu 217×46 via `display: inline-block` + verticale padding, met de onderstreping op `text-decoration` in plaats van `border-bottom` (een border zou met de padding meeschuiven en 11px onder de tekst landen). Assertie toegevoegd, mutant-bewezen.

### Instrumentatie: het cijfer dat vijf maanden ontbrak

Er bestond site-breed **geen enkel scroll-event** (`grep scroll_depth|scrollDepth` in `src/**/*.js` = niets). NEW `edu_section_reached` vuurt zodra de strook in beeld komt, één keer per paginaweergave. Gedeeld door de `page_view` op `/terminal.html` geeft dat de doorscroll-rate.

Bewust een **eigen module** (`src/ui/edu-visibility-tracking.js`) en geen uitbreiding van `src/ui/faq.js`: die is een klassieke IIFE onder `<script defer>` en kan `events.js` dus niet importeren, én wordt ook door `index.html` en `contact.html` geladen — hem tot module maken verandert de uitvoeringssemantiek op twee pagina's die hier niets mee te maken hebben. De analytics-aanroep is omhuld met `typeof … === 'function'` tegen de submodule-cache-mismatch uit Sessie 214.

### Eigen meetfout, hardop gecorrigeerd

Mijn contrastmeting gaf eerst onzin (1,42:1). Oorzaak: **`getComputedStyle` geeft een live object terug.** Ik zette het thema terug naar dark vóórdat het resultaatobject werd opgebouwd, dus `cs.color` las de dark-kleur — tegen een achtergrond die ik wél als momentopname had geparsed. Met echte momentopnames:

```
.edu-command-card code, light, 19,8px/700 (telt als GROTE tekst → lat 3 / 4,5)
  vóór: #16a34a op #ffffff        3,30:1   ← haalde AA wél, AAA niet
  ná:   --color-text op #ffffff  19,80:1
dark:   #9fef00 op rgb(30,35,42) 11,19:1  (ongewijzigd)
```

Twee dingen die ik bijna fout in een codecommentaar had gezet: de waarde is **3,30**, niet de 3,10 uit `architecture-patterns.md` §10 (die is tegen `--color-bg` gemeten, een laag lager — de kaart is `#ffffff`), en het is **grote tekst**, dus "onder AA" was alarmerender dan waar. De fix blijft juist (dit project voert AAA), maar de reden in het commentaar moest de gemeten reden worden.

### Verificatie

- **8 nieuwe asserties × 3 motoren groen** (`tests/e2e/terminal-seo.spec.js`) — de eerste asserties ooit op de content ónder de terminal. Vóór deze sessie gaf grep op `terminal-education|edu-command-card|scroll-hint|faq-terminal` in `tests/` **nul** hits; precies daarom konden de drie bugs hierboven stil ontstaan.
- **Zeven mutanten geplant, zeven rood**, na herstel weer groen. De ene overlever is nagelopen in plaats van weggeredeneerd: "elke link wijst naar een bestaande pagina" bleef terecht groen bij een kapot `#cmd-nmapx`, want die test stript de hash — het ankerbewijs is de taak van de test die wél rood ging.
- **Gerichte suite over drie motoren: 145 passed / 2 failed.** Beide falers zijn dezelfde `responsive-breakpoints.spec.js:209` (navbar) op firefox+webkit — en **géén regressie**: serieel gemeten tegen `git archive HEAD` op een tweede poort **32/32 groen**, 8× per motor per kant, met tijden die op 0,1s gelijk zijn (50,6 vs 50,7s / 35,4 vs 35,5s). Het is contentie: die test wacht 10s op een JS-geïnjecteerde navbar en haalt dat niet met drie browsers tegelijk.
- **Mijn eerste A/B was zelf besmet** — die draaide terwijl de achtergrondrun nog liep en gaf 4 rood / 1 rood, wat er als een regressie uitzag. De tijden verraadden het (1,0m vs 32s voor hetzelfde werk). Opnieuw gemeten zonder belasting.
- `bash scripts/validate-docs.sh` → exit 0. CSP gecontroleerd in `netlify.toml` (`style-src 'unsafe-inline'` staat toe wat de `<noscript><style>` nodig heeft — het lokale testserver-pad zou dat níét hebben laten zien).
- Beide thema's visueel gecontroleerd, en 360/375px op horizontale overflow (nul) plus tikdoelen (nul onder 44px).

### Metrics delta

| | Vóór | Ná |
|---|---:|---:|
| Spec-bestanden | 36 | **37** |
| `test()`-declaraties | 280 | **288** |
| Sitetotaal (drift-alarm) | 1087,05 KB | **1091,02 KB** / 1120 |
| terminal.html | 24.186 B | 24.262 B |
| terminal-education.css | 8.264 B | 9.718 B |

**Dit levert geen bytes op — het kost er ~3,3 KB.** De winst is hoogte, links en meetbaarheid. Dat hoort ook zo gelezen te worden: "content weghalen" klinkt als een besparing en is het hier niet, omdat de vervanging uitleg, een noscript-vangnet en een trackingmodule draagt. Terminal Core wordt niet geraakt door de CSS (die staat alleen op `terminal.html`), en `performance.spec.js:136` telt sowieso `index.html`, niet `terminal.html`.

### Next steps

1. **Search Console-data voor `/terminal.html`** (TASKS.md #59). Bepaalt of de strook verder mag krimpen of juist een echte landingstekst verdient. De gekozen snitten hangen er niet van af — wat weg is ging weg wegens dubbeling en doodlopendheid, en juist de twee blokken mét zoekwaarde staan er nog.
2. **`responsive-breakpoints.spec.js:209` bestand maken tegen parallelle runs** (TASKS.md #60). Bewust niet stilzwijgend verruimd in deze sessie.
3. **De mobiele blinde vlek** (`.scroll-hint` `display: none` <768px) pas aanpakken als `edu_section_reached` heeft gemeten hoeveel mensen er sowieso komen.
4. **Niet gedaan, bewust:** de FAQ ontdubbelen tegen `index.html` (twee van de vier vragen overlappen in intentie met de acht daar) — aparte SEO-afweging met eigen schema-risico. En: reken de FAQPage níét als rich-result-opbrengst; Google beperkte FAQ rich results in aug 2023 tot gezaghebbende overheids- en gezondheidssites. Dat staat nu ook in `docs/seo-launch-checklist.md`.

---

## Sessie 217: Vier pre-existing punten opgeruimd — en drie van de vier vastgelegde metingen klopten niet (09 aug 2026)

**Mission:** Vier dingen stonden in de repo als "gemeten, gedocumenteerd, nooit gefixt" — één sinds Sessie 189. Heisenberg vroeg ze af te handelen, met de expliciete opdracht om te zeggen wanneer een vastgelegde meting níét klopt in plaats van hem over te nemen. Bij twee punten was "dit is geen bug" een geldige uitkomst, mits gemeten.

**Commits:** *(zie TASKS.md §Sprint)*

### De uitkomst in één tabel

| Punt | De notitie zei | De meting zegt |
|---|---|---|
| (a) 76px reserve | 9 pagina's, zichtbaarheid onbekend | **Bug** — 16,39:1 seam in light; index.html doet mee met 11px → **10 pagina's** |
| (b) Badge-contrast | 3,10:1 bij 14,4px, "voldoet nog niet" | **Bug, en de notitie was te gúnstig** — 2,85:1 (2,74 op de hero) bij 13,5/10,4px; light-only |
| (c) Terminal-overflow | open sinds Sessie 189 | **Geen bug** — al gefixt op 07 jul door commit `3d7df13` |
| (d) Budget 1100 KB | 1,4% marge | Bevestigd; fixes kosten ~2 KB, dus het was puur een beleidsvraag |

Heisenberg wantrouwde de metingen van (a) en (b). Bij (b) klopte dat wantrouwen in de diagnose maar niet in de richting: de badge haalt AAA niet, hij haalt zelfs **AA** niet. De "geen bug"-uitkomst kwam bij (c) vandaan.

### (a) De reserve was zichtbaar, en op één pagina meer dan genoteerd

`body.landing-page { padding-bottom: 76px }` wordt geverfd met de **body**-achtergrond. In light is dat `#f8f8f8` tegen een footer van `#1a1a1a` — 16,39:1, een onmiskenbare witte strook onder de donkere footer. In dark 1,04:1 en dus onzichtbaar; het is een light-only defect. Screenshot van `/over-ons.html` @390x844 bevestigt het visueel.

Nieuw t.o.v. de notitie: **index.html heeft hem ook.** De reserve is 76px en de balk 65px — die 11px slack is precies wat er op maximale scroll overblijft. Dus 76px op negen pagina's plus 11px op de tiende.

**Zelfcorrectie tijdens het meten.** Mijn eerste aflezing gaf `balkState: verborgen` op maximale scroll, wat de strook veel groter zou maken. Dat was een stale read: na 2 rAF had de IntersectionObserver-callback nog niet gevuurd, dus ik las de staat van `y=0` af. Met 300ms settle staat de balk daar `zichtbaar`. Die settle staat nu in de test.

**Fix: de reserve verhuist naar de footer** in plaats van te verdwijnen. De footer is donker in beide thema's, dus de ruimte wordt donker geverfd; met `:has(.mobile-cta-bar)` krijgen balkloze pagina's hem helemaal niet. Dat lost beide gevallen met één regel op.

De reden dat de reserve op de body stond, was dat hij **onvoorwaardelijk** moest zijn: beweegt hij mee met `data-state`, dan verandert de documenthoogte bij elke toggle → scrollsprong → herbeoordeling → terugkoppellus. `:has()` op de *aanwezigheid* van het element is statisch, maar dat is een bewering tot je hem meet — gemeten documenthoogte **9481 / 9481 / 9481** over `zichtbaar → verborgen → zichtbaar`. Staat nu als eigen test.

Specificiteit (0,3,1) verslaat `.landing-footer` (0,1,0) uit mobile.css ongeacht laadvolgorde, dus geen `!important`. Bijvangst: `env(safe-area-inset-bottom)` werd dubbel geteld (body-padding + footer-padding) en nu één keer.

### (b) De contrastmeting was tegen de verkeerde achtergrond — en te gunstig

`.eyebrow-badge` heeft een **eigen** `background: var(--eyebrow-bg)`, en dat is een rgba. De tekst ligt dus op de compositie van badge-achtergrond over paginakleur:

```
light            #16a34a op rgb(230,241,234)    2,85:1   ← de echte waarde: onder AA
light op de hero (radial glow = laag drie)      2,74:1
dark             #9fef00 op rgb(20,28,22)      12,26:1   ← ruim boven AAA
vs paginabg      #16a34a op #f8f8f8             3,10:1   ← reproduceert de notitie exact
```

Dat de 3,10:1 exact reproduceert tegen `--color-bg` is het bewijs voor de diagnose. De valstrik: `getComputedStyle(el).backgroundColor` geeft `rgba(22,163,74,0.08)` — geen kleur waar je tegen kúnt meten — en wie dan naar de paginakleur grijpt, meet de laag ónder de verf.

Ook de genoteerde font-size klopte niet: 14,4px zou `0.8rem × 18px` zijn. Gemeten is het **13,5px** (desktop) en **10,4px** onder 768px, waar `--font-size-base` naar 16px zakt én de badge zelf naar `0.65rem`. Beide zijn normale tekst, dus er was geen large-text-uitzondering om op te leunen.

**Fix:** `--eyebrow-text`-token naast de bestaande `--eyebrow-bg`/`--eyebrow-border` — merkgroen in dark (12,26:1), `--color-text` in light (17,12:1). Eén token, tien badges op negen pagina's erven mee. Rand en tint blijven groen, dus de badge blijft herkenbaar.

`#14532d` (green-900, 7,87:1) was het alternatief dat het merkgroen behoudt; afgewezen op marge — 12% boven AAA zakt eronder zodra iemand de alpha van `--eyebrow-bg` aanraakt, en dit project heeft net laten zien hoe stilzwijgend zo'n getal rot.

### (c) Al gefixt op 7 juli; de notitie was een maand stale

Verse meting op `/terminal.html` @375px (`clientWidth` 360 door een 15px scrollbar): container left 10 / **width 340** / right 350 → **overflow 0**. Idem over 320/360/375/390/414/768 in dark én light.

`git log` op `styles/mobile.css` wijst de fix aan: commit **`3d7df13` (2026-07-07)**, titel letterlijk *"fix(mobile): terminal-container 10px horizontale overflow op ≤768px"*, die `width: auto` toevoegde. De melding is van 30 juni; de fix kwam een week later en het item bleef daarna nog vijf sessies open staan.

De schijnbare tegenstrijdigheid in de notitie ("375px" in de titel, `docW 360` in de meting) is dezelfde meting vóór en ná aftrek van de scrollbar.

**Waarom het zo lang bleef staan:** er was site-breed geen enkele horizontale-overflow-assertie op `/terminal.html`. Een notitie meldt niet terug dat hij niet meer klopt. Dat gat is nu gedicht.

### (d) Budget: expliciet besloten, niet als bijvangst

Gemeten vóór de fixes: 1084,92 KB / 1100 KB — 15,08 KB vrij (1,37%). De fixes kosten samen ~2 KB (punt (c) kost nul bronbytes), dus ze pasten. De vraag was beleid, en die is expliciet beantwoord: **1120 KB**, 32,95 KB vrij (2,94%) — hetzelfde ~3%-argument als Sessie 214, die bij 1069,20 KB naar 1100 ging.

Bij de bump staat nu een waarschuwing: dit is de **derde bump in 14 sessies**. Nog een keer zonder discussie maakt er een ratel van in plaats van een grens.

Bijvangst: de testnaam luidde `Bundle size < 1000KB` terwijl de limiet al twee keer was opgehoogd — precies dezelfde staleness als de notities die deze sessie opruimde. De naam interpoleert nu de constante.

### Tests — alle drie tweezijdig bewezen

| Mutant | Uitkomst |
|---|---|
| Reserve terug op de body | **12 rood / 2 groen** — en die 2 zijn groen om principiële redenen |
| Badge-kleur terug naar `--color-cta-primary` | **10 rood, allemaal in light**, allemaal exact 2,85:1 |
| `width: auto` weg uit mobile.css | **6 rood**, elk met `MAIN#terminal-container` benoemd |

De twee overlevers van mutant 1 zijn nagelopen in plaats van weggeredeneerd: `@1280px` valt buiten de `≤1279px`-band waar de reserve leeft, en de terugkoppellus-test bewaakt een andere eigenschap (de oude code was óók onvoorwaardelijk). Beide horen groen te zijn.

Mutant 3 gaf op 360px letterlijk `container left 10 / width 360 / right 370 bij clientWidth 360, overflow 10` — **cijfer voor cijfer de notitie uit Sessie 189**. Dat is meteen het bewijs dat de assertie die er had moeten staan de bug wél had gezien.

Mutant 2 is licht rood en donker groen: één thema testen had de bug doorgelaten. Zelfde les als §9 van de rules.

**Eén valse faler onderweg, en waarom hij vals was.** `/404.html` gaf 1px onbedekte ruimte. Doorgemeten: de documenthoogte is fractioneel (body 1308,5px) terwijl `scrollHeight` naar boven afrondt, dus scrollen naar de bodem schiet tot 1px door. `Math.round(0.5)` maakte daar 1 van. De assertie meet nu exact en eist `< 1`; een echte regressie is 76 of 11 en komt daar niet bij in de buurt.

### Verificatie

Volle suite tegen `nostore-server.py`: chromium **343✓/2✘**, firefox **341✓/2✘**. WebKit is na 85✓/0✘ afgekapt — zijn resterende wachtrij betrof vrijwel geheel `/terminal.html`, en dat bestand is ongewijzigd én laadt noch `landing.css` noch een van de tien aangepaste HTML-bestanden. In plaats daarvan gericht gedraaid wat de diff wél raakt: **88✓/0✘ op webkit** over `footer-reserve`, `homepage-conversion`, `hero-demo`, `gidsen-layout`, `navbar-collapse` en `lead-magnet`.

De twee falers per motor zijn `tutorial-mobile.spec.js:65` (chromium + firefox) en `responsive-ascii-boxes.spec.js:427` (firefox) — precies de bekende lijst. Geïsoleerd tegen `git archive HEAD` op poort 8898 gaven oud en nieuw **byte-identiek 101✓/3✘, met dezelfde testnummers 43/89/96**. Daarmee is "pre-existing" een meting.

**Twee rapportagefouten van mezelf, beide gecorrigeerd:**

1. Ik meldde twee `gamification`-falers als "onverklaard". Ze waren **flaky onder belasting**: de chromium-retries slaagden (`✓ 133`, `✓ 134`) en op firefox slaagden ze meteen. Ik telde `✘`-regels in plaats van uitkomsten — een `✘` is een mislukte póging, niet per se een mislukte test. De eindregel (`N failed` / `N flaky`) is de waarheid.
2. Mijn eerste `sed`-vervanging van de `**Last updated:**`-regel in CLAUDE.md raakte het **sjabloonvoorbeeld** in de `/summary`-sectie in plaats van de echte footer, omdat dat voorbeeld eerder in het bestand staat en het patroon niet aan regelbegin was verankerd. Teruggezet en beide regels gecontroleerd.

### Metrics

- **Bundel:** 1087,05 KB / **1120** KB — 32,95 KB vrij (2,94%)
- **Spec-bestanden:** 34 → **36** (`footer-reserve.spec.js`, `eyebrow-contrast.spec.js` nieuw)
- **Nieuwe asserties:** 3 testgroepen, elk met mutant bewezen
- **Aangeraakte bestanden:** `styles/landing.css`, 10× HTML (`?v=144`), `tests/e2e/performance.spec.js`, `tests/e2e/responsive-breakpoints.spec.js`, `.claude/rules/architecture-patterns.md`, `TASKS.md`

### Learnings

Uitgewerkt met code in `.claude/rules/css-layout.md` §9 (themavarianten en focusregels vechten
op bronvolgorde) en §10 (kleur volgt de effectieve achtergrond, niet het merk).

> Deze verwijzing stond tot Sessie 229 op `.claude/CLAUDE.md` §Recent Critical Learnings — maar
> dat blok rouleerde per sessie, dus de pointer wees al sinds Sessie 222 naar niets. Learnings
> horen bij een bestemming die ze houdt.

### De baseline per motor — er is er geen meer

De optionele vijfde taak alsnog gedaan. Uitkomst: **de vastgelegde baseline klopte op geen enkel punt, en na afloop is hij leeg.**

| Vastgelegd (Sessie 209 / startprompt) | Gemeten in Sessie 217 |
|---|---|
| 5× `tutorial-gestures` — "geen echte touch in headless" | **5× groen** op chromium én firefox. Verdwenen. |
| 1× `tutorial-mobile:65` — "briefing render timing" | Faalt in **alle drie** de motoren, maar niet door timing |
| 1× `responsive-ascii-boxes` — "live resize timing" | Faalt op firefox, maar niet door timing |
| `responsive-breakpoints:194` — firefox + webkit | Groen op chromium/firefox, **flaky op webkit** (3/12) |
| `autocomplete-filesystem:88` — firefox flaky | Groen |
| *(niet vastgelegd)* | `feedback:207` + `:233` — **structureel rood op webkit** |

**Geen van de falers was een omgevingsartefact.** De opdracht noemde "deze test meet iets dat headless niet kán" als geldige uitkomst; die categorie kwam niet één keer voor. Alle vier waren fouten in de test zelf:

1. **`tutorial-mobile:65`** verwachtte het woord `ping` in de briefing. Commit `c031d9d` (03 aug, "Terminal eerlijk maken") herschreef juist alle vier de objectives om het commando **niet** te verklappen — `'Gebruik ping om te controleren of ...'` werd `'Controleer of het doelwit 192.168.1.100 überhaupt bereikbaar is.'`. Twee dagen later noemde Sessie 209 de faler "briefing render timing". De assertie bewaakt nu de pedagogische invariant zelf: de briefing toont de opdracht en verklapt het commando niet. Mutant = de productwijziging terugdraaien → rood.
2. **`responsive-ascii-boxes:427`** zette viewport 375px en verwachtte box-tekens, terwijl zijn eigen Chromium-zuster drie regels hoger schrijft dat mobiel bewust zonder box-tekens rendert. Gemeten met `leerpad`: **0/6 op 375px, 6/6 op 1440px, in beide motoren**. Nu dezelfde desktop-viewport als die zuster. Mutant = viewport terug naar 375 → rood.
3. **`feedback:207` + `:233`** wachtten met een vaste `waitForTimeout(2500)` op een modal die zichzelf pas ná een eigen `setTimeout` van 2000ms sluit, herstelt én opnieuw koppelt (`src/ui/feedback.js:277`) — **500ms marge voor drie stappen**. Hield stand op chromium/firefox, liep op webkit in de testtimeout van 30s (gemeten 32-36s). Vervangen door een conditie-wacht; **0/2 → 8/8 groen**.
4. **`responsive-breakpoints:194`** deed `goto` op 1280px en resizede daarna naar 375px, terwijl `mobile.css` in terminal.html achter `media="screen and (max-width: 768px)"` hangt en dus pas ná die resize hoeft te laden — plus de navbar wordt geïnjecteerd, dus `.navbar-toggle` bestond soms nog niet. Viewport nu vóór de navigatie. **3/12 → 8/8 groen.**

**Meetfout van mezelf, hardop gecorrigeerd.** Ik mat `responsive-breakpoints:194` als "nieuw 0/6 rood, oud 3/6 groen" en noemde dat een mogelijke regressie van mij. Dat kon niet: ik had `/tmp/pre-change` ná de commit aangemaakt, dus poort 8898 serveerde mijn eigen commit. `md5sum` over `terminal.html`, `terminal.css`, `mobile.css`, `main.css` en `main.js` gaf **identiek** — er wás geen codeverschil om aan toe te schrijven. Een oud/nieuw-vergelijking is alleen bewijs als de twee kanten aantoonbaar verschillen.

### Volgende stappen

- De optionele vijfde taak is alsnog gedaan (zie de sectie hierboven). **Er is geen baseline van bekende falers meer** — alle vier bleken fouten in de test zelf en zijn gerepareerd, geen enkele was een omgevingsartefact. Voeg er dus ook geen nieuwe notitie toe: gaat er iets rood, dan is dat vanaf nu een echt signaal.
- De volle driemotorensuite is deze sessie niet in één keer uitgedraaid. Chromium en firefox wel (343✓ resp. 341✓), webkit apart (350 tests). Bij een volgende volledige run hoort de uitkomst **nul** falers te zijn; is dat niet zo, behandel het als regressie en niet als "bekend".

---

## Sessie 216: De CTA-balk verscheen waar hij niets toevoegde — en de guard die dat bewaakte, scrollde nooit (09 aug 2026)

**Mission:** Sessie 215 legde vast dat `.mobile-cta-bar` bij scrollpositie 0 overbodig is én chips afdekt, maar loste het niet op: de fix zou de conversiegarantie tijdsafhankelijk maken en de synchrone scroll-guard in `homepage-conversion.spec.js` breken. Heisenberg vroeg om dat alsnog uit te zoeken, te beslissen tussen IntersectionObserver en `position: sticky`, en te bouwen — met de guard minstens zo streng als hij was.

**Commits:** `2c1068e` (achterstallige Sessie 215-summary) · `00433e4` (balkgedrag) · `570d44c` (guard) — alle gepusht naar `origin/main`

### De beslissing: IO, en waarom sticky afvalt

`position: sticky; bottom: 0` lost de **plaats** van het probleem op, niet het mechanisme. Vier bezwaren, aflopend in gewicht:

1. Een sticky balk overlapt content nog steeds zodra hij plakt — hij doet het alleen niet meer op scrollpositie 0. Het dubbele-CTA-probleem blijft ook: hij plakt zodra zijn natuurlijke positie (net onder de hero) de onderrand raakt, en de hero-CTA staat op dat moment nog bovenin beeld.
2. Hij kost **65px echte flow-ruimte** — een gat pal na de hero.
3. Hij vraagt een DOM-herstructurering (sticky-bottom werkt alleen binnen een container die de rest van de pagina omspant), waarmee een monetisatie-element door de markup verhuist en `data-terminal-cta="sticky_mobile"` van betekenis verandert.
4. Zijn enige voordeel is "werkt in de synchrone test". Dat is winst voor de *test*, niet voor de bezoeker — en die herschrijving bleek geen kost maar een correctie.

### De echte keuze was de grens, niet het mechanisme

Drie kandidaat-regels, waarvan er maar één beide eisen **per constructie** waarmaakt:

| regel | "altijd een tikbare CTA" | "nooit twee identieke" |
|---|---|---|
| verbergen zodra de CTA het scherm raakt | breekt — een strookje van 1px is geen tikdoel | ok |
| verbergen pas bij volledig zichtbaar | ok | breekt — ~24px scrollvenster (halve knophoogte) waarin balk én CTA-midden aantikbaar zijn |
| **verbergen zodra het midden vrij is** | **ok** | **ok** |

Bij de derde geldt *balk verborgen ⟺ CTA-midden boven de balkrand ⟺ CTA-midden aantikbaar*. Verbergen en aantikbaarheid zijn dezelfde conditie, dus er is geen venster waarin beide zichtbaar zijn en geen positie zonder tikdoel. Bewezen met een sweep van **884-893 posities à 10px** per engine: nul gaten, nul dubbels, en in alle drie de engines hetzelfde wisselpatroon (5 wissels rond de hero-, mid- en final-CTA).

### Implementatie

- **`src/ui/landing-demo.js`** — `initCtaBar()` (~40 regels). IO is het "er is iets veranderd"-signaal; `middenVrij()` is de regel. Doelen: `a.btn-cta[href="/terminal.html"]` buiten de balk = hero/mid/final, precies de drie die het label "Start de simulator" delen. Bewust **niet** de leerpad-deeplinks en cijfertegels: die dragen een ander label, dus daar is geen duplicaat en blijft de balk nuttig als drager van het canonieke label. `navHoogte` uit `--navbar-height`; de balkrand leest de balk uit zichzelf (neemt `env(safe-area-inset-bottom)` mee, kan niet driften). Eén synchrone beoordeling bij init tegen een flits van één frame, plus een `resize`-listener.
- **`styles/landing.css`** — `.mobile-cta-bar[data-state="verborgen"] { visibility: hidden; opacity: 0 }` (0,2,0 verslaat 0,1,0 in hetzelfde blok). `visibility` en niet `display`, want de box moet meetbaar blijven voor de JS-regel; `opacity: 0` alléén zou een onzichtbaar tikdoel opleveren. `padding-bottom: 76px` blijft **onvoorwaardelijk**: conditioneel verandert de documenthoogte per toggle → scrollsprong → herbeoordeling → terugkoppellus.
- **`index.html`** — `?v=` gebumpt op `landing.css` (142→143) en `landing-demo.js` (1→2); commentaarblok bijgewerkt (het zei nog "zichtbaar t/m 768px", wat al niet meer klopte).

### Vier metingen die de fix schragen

1. **Zes maten, scroll 0:** hero-CTA-midden op y=306..361, balkrand vanaf y=602 (375×667) tot y=959 (768×1024) → `midVrij` op álle zes. De regel vuurt overal.
2. **Pagina-bodem:** balk staat op alle zes maten aan en dekt de volle 76px reserve — geen lichte strook onder de donkere footer.
3. **Toestelrotatie:** portret → landschap → scroll → terug; staat correct in alle vier, terwijl de `rootMargin` van de observer nog met portretwaarden liep. Dat is precies wat de "IO is alleen de trigger"-keuze moest opleveren.
4. **Zonder JS / reduced motion:** `data-state` niet gezet, balk `visible` opacity 1 (gedrag van vóór deze sessie); reduced motion → `transitionDuration: 0s`, mechanisme werkt.

### De guard was op drie punten blind

1. **Hij scrollde niet.** `html { scroll-behavior: smooth }` staat in `animations.css`, dus `window.scrollTo(0, y)` ánimeert. De oude lus zette dat 13× in één synchrone `page.evaluate`-tick; de animatie kreeg nooit een frame en `scrollY` bleef op **2px** steken. Die test asserteerde dertien keer dezelfde ongescrollde pagina — een zwaardere blinde vlek dan "IO vuurt niet in een synchrone lus", want ook de oude meting was al blind.
2. **Hij mat bounding boxes.** Een `visibility: hidden` balk heeft nog steeds een box van 65px.
3. **Hij was synchroon**, waardoor een IO er per definitie nooit kon vuren.

**"Even streng" is een meting geworden.** Op één mutant (balk onvoorwaardelijk `visibility: hidden`) is de oude guard **3× groen** en de nieuwe **3× rood**, met zes benoemde posities. Zelfde raster van 0,9 viewport, dus dezelfde posities als zijn voorganger; het predicaat is strikt sterker.

### Bug die ik zelf introduceerde en zelf ving

`.btn-cta` draagt `transition: all` en erft `visibility` van de balk — met `all` loopt die overerving als transitie mee. Gemeten: na het omklappen meldt de balk `hidden` terwijl de knop nog `visible` is (onzichtbaar tikdoel dat wél reageert), en andersom een zichtbare balk waar een tik niets doet. Na 400ms lopen ze weer gelijk. Twee spiegelbeeldige gaten van ~150ms die alleen bestaan ná een toestandswissel, dus geen meting "in rust" ziet ze. Mijn plan claimde letterlijk dat beide richtingen "naar de veilige kant falen" — dat was precies verkeerd om. Fix: `transition-property: opacity` op de knop in de balk.

### Tests

- `hero-demo.spec.js` — `BASELINE_BEDEKT` naar `[]` op alle drie de maten; **360×800 toegevoegd** (stond in het commentaar, niet in de map, dus die conditie werd daar niet bewaakt). Test hernoemd van "blijft op de vastgelegde baseline" naar "dekt niets de suggestiechips af", plus een directe assertie op `data-state === 'verborgen'`. Die test is in Sessie 215 bewust als tikkende baseline neergezet en heeft nu teruggemeld.
- `homepage-conversion.spec.js` — guard async + hit-testing, twee helpers (`scrollposities`, `meetOpPositie`), plus NEW "de knop klapt mee met zijn balk, zonder na te lopen".

**Mutanten (elk nieuw assertie-paar bewezen):**

| assertie | mutant | uitkomst |
|---|---|---|
| guard strenger dan oud | balk altijd `visibility: hidden` | oud **3× groen**, nieuw **3× rood** |
| geen chip bedekt | `[data-state="verborgen"]` verbergt niets | rood op 360×800 + 390×844, **375×812 blijft groen** (exact de Sessie 215-meting) |
| geen dubbel label | idem | rood op y=0, 4386, 7310 — de drie CTA-zones |
| balk uit op scroll 0 | beslissing vastgezet op `'zichtbaar'` | 6/6 rood |
| knop loopt niet na | `transition-property` eruit | rood met `balk hidden, knop visible` |

Tegen de oude code (`git archive HEAD`, poort 8898) faalt de chip-test op de `waitForFunction` — dat bewijst "mechanisme afwezig", niet "de bedekkingsassertie ziet de bug". Daarom de CSS-mutant erbij, die de assertie zélf laat vuren.

### Vastgelegd, niet opgelost

**9 pagina's dragen `body.landing-page` (dus 76px reserve) zonder balk:** `over-ons`, `gidsen`, `contact`, `woordenlijst`, `commands/index`, `404`, `sample-pentest`, `sample-juridisch`, `sample-download`. Gemeten byte-identiek tegen `git archive HEAD` → pre-existing sinds Sessie 214, niet van deze wijziging. Zie TASKS.md #57.

**De hero-hint blijft uit op mobiel.** De reden om hem te verbergen (de balk dekte de chips af) valt weg, maar dezelfde notitie in `landing.css` zegt dat de hint een *desktop*-probleem oplost: met een muis lijkt het venster een plaatje, terwijl op een telefoon al zes knoppen onder de prompt staan. Bewust buiten scope; de assertie die het bewaakt blijft staan.

### Metrics

- **Bundle:** 1078,05 → **1084,92 KB** van 1100 (marge 21,95 → 15,08 KB, 2,0% → 1,4%). Mijn schatting was ~2 KB; het werd +6,87 KB, vrijwel volledig commentaar. Ground truth `du -sb`: src 720 KB · styles 428 KB · blog 474 KB · assets 1737 KB.
- **Playwright:** 34 spec files, 273 → **274** `test()`-declaraties.
- **Volledige suite** tegen no-store server: chromium 313✓/1✘ · firefox 310✓/3✘+1 flaky · webkit **309✓/2✘**. Alle falers draaien op `/terminal.html` (dat geen van de drie gewijzigde bestanden laadt) en reproduceren byte-identiek tegen `git archive HEAD`.
- **Let op:** de eerste volledige run kapte af op mijn eigen `--global-timeout` van 2900s met "78 did not run" — dat leest in de samenvatting bijna als groen. WebKit apart uitgedraaid om die 78 alsnog een uitspraak te geven.

### Learnings

Uitgewerkt met code in `.claude/rules/css-layout.md` §11 (`transition: all` + geërfde
`visibility` = een knop die achterloopt) en `.claude/rules/js-runtime.md` §12
(IntersectionObserver als trigger, één predicaat als regel).

> Zelfde correctie als bij Sessie 215 hierboven: de oude pointer naar CLAUDE.md
> §Recent Critical Learnings was door de rotatie leeg komen te staan.

### Volgende stappen

TASKS.md #57 — vier vastgelegde pre-existing punten, met startprompt in `/home/willem/.claude/plans/startprompt-pre-existing-bugs.md`. Twee daarvan dragen een meting die ik wantrouw (`.eyebrow-badge` 3,10:1 is tegen de páginaachtergrond gemeten terwijl het element een eigen achtergrond heeft; het terminal-overflow-item noemt 375px in de titel en `docW 360` in de meting). Bij beide is "dit is geen bug" een geldige uitkomst, mits gemeten.

---

## Sessie 215: Hero-terminal — uitlijning, focusrand en een cursor 317px van zijn eigen tekst (08 aug 2026)

**Mission:** Heisenberg leverde een screenshot met drie klachten over de hero-terminal uit Sessie 214: hij lijnt niet uit met de tekst ernaast, hij krijgt een blauwe standaardrand zodra je erin kunt typen, en niets nodigt uit om hem te gebruiken ("iets als 'try me' met een pijl"). Expliciet gevraagd: grondig analyseren en met advies komen.

**Commit:** `f567ebc` (gepusht naar `origin/main`)

---

### Analyse — alle drie gemeten op productie, niet beredeneerd

Metingen op `https://hacksimulator.nl/` bij 1830×1000 en 375×812, dark én light.

**(1) Uitlijning — een verrot magisch getal.** `.hero-terminal` droeg `margin-top: 3rem`. Bij de 18px root-font van dit project is dat 54px, niet 48. Dat getal was een handmatige optische centrering uit de tijd dat het venster 313px hoog was (header 37 + body 235 + invoerregel 41): het liep toen 194→507 en paste daarmee binnen de tekstkolom 140→568, met 54px lucht boven en 61px onder. Sessie 214 hing er `.hero-demo-bar` onder — **+152px gemeten** — waarmee het venster 468px werd en 194→662 liep: **94px ónder de tekstkolom uit**, terwijl de bovenkant nog steeds 54px te laag begon. Optische middens 74px uit elkaar. Klassieke magic-number-rot: een getal dat een *verhouding* codeerde, en de verhouding veranderde.

Horizontaal was er niets mis — rechterrand terminal 1576 = rechterrand navbar-CTA 1576 = contentrand. Dat is meteen gecheckt zodat het niet later als "ook nog" terugkwam.

**(2) De blauwe rand is van ons, niet van de browser.** `animations.css` heeft een sitebrede `:focus-visible { outline: 2px solid var(--color-info) }` en `landing.css:636` spiegelde dat met `.hero-terminal:focus-within`. `--color-info` = `#79c0ff` (dark) / `#0969da` (light). Twee losse problemen: systeemchroom om een zwarte hackerterminal, én `:focus-within` vuurt óók bij een muisklik — de terminal was daarmee het enige element op de site dat ná een klik een rand hield.

**De voor de hand liggende fix bestaat niet.** Ik wilde `:has(:focus-visible)` gebruiken zodat de rand alleen bij Tab verschijnt. Gemeten: `input.matches(':focus-visible')` is `true` ná een muisklik. Dat is spec-gedrag — tekstvelden tonen altijd focus-indicatie. `:focus-within` en `:has(:focus-visible)` zijn hier dus identiek; keyboard-only kán niet. De rand verschijnt hoe dan ook bij een klik, dus het antwoord is hem er *bedoeld* uit laten zien in plaats van hem te verbergen.

**(3) De affordance bestond al, de zin ontbrak.** Er staan zes tikbare chips onder het venster. Wat miste was copy die zegt dát het ding leeft: de enige regel in de buurt was `.hero-demo-uitleg` ("Proefversie met zes commands…") — een **disclaimer in dim grijs, helemaal onderaan**, dus het laatste wat je leest én geframed als beperking.

**(4) Defect gevonden tijdens het meten, niet gevraagd.** De knipperende `_` stond **317px van de linkerrand van het veld terwijl de tekst 155px breed was** — 162px leegte tussen de tekst en zijn eigen cursor. Sessie 214 maakte van `#typing-target` een `<span>` een `<input>` met `flex: 1`; die eet de hele regel en duwt de decoratieve cursor naar de rechterrand. Het leest als een renderfout, uitgerekend op het element dat "dit is een levende prompt" moet zeggen.

---

### Wat er is gebouwd

**A. Uitlijning** (`styles/landing.css`)
- `margin-top: 3rem` weg; nieuw blok `@media (min-width: 769px) { .hero-content { align-items: center } }`.
- **`align-self: center` op de terminal is een no-op** — geprototypeerd en gemeten: 140→608, ongewijzigd. De terminal (468px) is inmiddels zélf het hoogste flex-item en bepaalt dus de cross-size van de flexregel; het kórtere item (de tekst, 428px) moet bewegen, dus de regel hoort op de container.
- Eigen band i.p.v. de basisregel aanpassen: onder 769px klapt `.hero-content` naar `flex-direction: column` en stuurt `align-items` daar de *horizontale* as. Wederzijds uitsluitende ranges (architecture-patterns §4).
- Resultaat: middens 0,5px uit elkaar, en zelfonderhoudend bij elke volgende hoogtewijziging.

**B. Focustoestand** (`styles/landing.css`, ná het light-theme-blok)
- Rand + 1px ring + halo in `--terminal-demo-prompt`, plus een oplichtend groen vensterbolletje. `#9fef00` op `#000` = ~17:1, ruim boven de 3:1 van WCAG 2.2 SC 2.4.11.
- `outline: 2px solid transparent` blijft staan: forced-colors/High Contrast negeert box-shadows maar kleurt een transparante outline wél in.
- **Plaatsing is de crux.** `[data-theme="light"] .hero-terminal` (regel ~2185) zet óók `box-shadow` en is even specifiek (0,2,0). Bij gelijkspel wint bronvolgorde, dus de focusregel moest ná dat blok. Een pointer-comment staat op de oude plek zodat de volgende lezer hem vindt.

**C. Uitnodiging** (`index.html` + `styles/landing.css` + `src/ui/hero-repl.js`)
- NEW `.hero-terminal-col`-wrapper: `.hero-content` telt precies twee kolommen, dus een sibling van `.hero-terminal` zou een derde kolom worden.
- `↓ Deze terminal werkt echt — typ maar` erboven. Copy benoemt de aanname die de bezoeker maakt (*dit is een screenshot*), is waar, en wordt drie regels lager begrensd door de bestaande disclaimer. Uitnodiging, geen instructie.
- Verdwijnt bij overname (`is-taken` op de wrapper in `neemOver()`) via **`visibility`, niet `display`** — anders krimpt de kolom 29px en verspringt het venster ~15px onder de muis van wie er net op klikte. Anders dan `opacity: 0` haalt `visibility` de regel wél uit de toegankelijkheidsboom.
- Woorden in `--color-text`, alleen de pijl in `--color-cta-primary` (decoratief, `aria-hidden`): het CTA-groen meet **3,10:1** op de lichte paginaachtergrond bij 14,4px — onder AA, laat staan de AAA die dit project voert.

**D. Cursor** (`styles/landing.css` + `src/ui/landing-demo.js` + `src/ui/hero-repl.js`)
- In rust `flex: 0 0 auto` + `width: (len+1)ch`, per aanslag gezet in `setTyped()`. `ch` is exact: `--font-terminal` resolvet naar JetBrains Mono. Gat cursor↔tekst **162px → 18px**, precies één teken.
- Bij overname krijgt het veld de regel terug; `neemOver()` wist de inline breedte, want inline verslaat de stylesheet.

**E. Cache-correctheid** (`index.html`)
- `?v=1` op `landing-demo.js` (had er geen) en `hero-repl.js` `?v=1 → ?v=2`, `landing.css` 141 → 142. `/src/**/*.js` staat op `max-age=3600`: zonder dit krijgt een terugkerende bezoeker tot een uur nieuwe CSS naast oude JS, en typt de auto-demo in een veld van één teken breed.

---

### Twee regressies die ik zelf introduceerde en zelf ving

**1. Het tikdoel kromp van 309px naar 10px.** Het veld naar `1ch` krimpen maakte het klikdoel piepklein. WebKit miste hem zelfs met een gerichte `.click()` in de testrun. Erger dan testflakiness: wie rechts naast de prompt klikt — de hele lege rechterhelft van de regel — activeerde de terminal niet meer. Opgelost door de héle promptregel te laten overnemen (`pointerdown` op `.terminal-input-line`, met `preventDefault` zodat het veld de focus houdt) plus `cursor: text`. Dat is bovendien hoe een echte terminal werkt.

**2. De mobiele hint duwde drie chips onder de vaste CTA-balk.** De hint kost 30px. Op 375×812 verplaatste dat de tweede chiprij van midden-736 naar midden-764, terwijl `.mobile-cta-bar` vanaf y=747 vastzit: `nmap`, `whoami` en `pwd` werden onaantikbaar en een tik daar navigeerde wég van de pagina. Opgelost door de hint onder 769px te verbergen — een gemeten afweging, geen bezuiniging: de hint lost een *desktop*-probleem op (met een muis lijkt het venster een plaatje), terwijl er op een telefoon al zes knoppen onder de prompt staan.

Beide gevonden door een testfalen serieus te nemen in plaats van als flake af te doen (zie learnings).

---

### Vastgelegd, niet opgelost: `.mobile-cta-bar` dekt chips af

Heisenberg vroeg expliciet of er nog iets met de "pre-existing help chip bug" moest gebeuren. Gemeten over zes telefoonmaten met consent gezet (zodat dit de balk meet en niet de cookiebanner), telkens tegen `git archive HEAD` op een tweede poort:

| viewport | bedekt bij scrollpositie 0 | oud vs nieuw |
|---|---|---|
| 375×667 | chipmiddens buiten beeld (niets te bedekken) | identiek |
| 375×812 · 412×915 · 768×1024 | geen | identiek |
| 360×800 · 390×844 | `whoami`, `pwd`, `help` | identiek |

**Correctie op mijn eigen eerste rapportage:** ik meldde dit als "alleen `help`, op één maat". Het zijn drie chips op twee gangbare maten. Oud en nieuw zijn byte-identiek, dus deze wijziging veroorzaakt het niet — maar mijn beschrijving was te gunstig.

**Waarom niet nu gefixt.** De fix zit niet bij de chips maar bij de balk, en daar zit de klem. De balk is bij scrollpositie 0 aantoonbaar overbodig: de hero-CTA staat op élke gemeten maat al in beeld — op 390×844 zie je zelfs twee identieke groene "Start de simulator"-knoppen tegelijk. Maar hem daar verbergen vraagt een IntersectionObserver, en `homepage-conversion.spec.js:153` scrollt synchroon in één `page.evaluate` waar observer-callbacks nooit vuren: die guard zou de balk op élke scrollpositie als verborgen zien en rood worden terwijl er niets mis is. Je ruilt dan een grotendeels cosmetisch probleem in voor een tijdsafhankelijke conversiegarantie plus een herschreven conversietest. Het CSS-alternatief (`position: sticky; bottom: 0` in de flow ná de hero) heeft geen JS en geen timing, maar kost 65px echte flow-ruimte en verhuist een monetisatie-element in de DOM. Beide zijn een eigen afweging, geen bijvangst van een polijstsessie.

Verzachtend: de balk is 92% dekkend met blur, dus je ziet geen label dat je vervolgens misklikt — je ziet de balk. Rij 1 (`ls`, `cat notes.txt`, `nmap`) staat volledig in beeld en is precies het begeleide pad (`is-next` begint op `ls`).

Vastgelegd als **TASKS.md #56** en als `BASELINE_BEDEKT` per viewport in `hero-demo.spec.js` — die test wordt rood zodra de bedekking groeit, en zijn lijsten horen `[]` te worden zodra de balk gefixt is.

---

### Verificatie

- **105/105 groen** over Chromium + Firefox + WebKit (`hero-demo` + `homepage-conversion`), geen flakes. Gemeten tegen `scripts/nostore-server.py`.
- **9 nieuwe `test()`-declaraties** (12 tests door drie `for…of`-blokken), **elk met de mutant rood bewezen**: magische marge terug · `order` van de wrapper halen · focusregel vóór het light-blok (→ light rood, dark groen) · `flex: 1` terug op het veld · `display: none` i.p.v. `visibility` · promptregel-handler weg · hint tóch op mobiel.
- **Firefox-chiptest die ik brak:** 2/8 rood op nieuw, 0/12 op oud (tweede server) → oorzaak gevonden → 8/8 groen.
- `html-validate` identiek vóór/ná: 7 pre-existing meldingen, alleen regelnummers verschoven.
- `validate-docs.sh` exit 0.

**Metrics delta:** bundel 1069,20 → **1078,05 KB** (limiet 1100, marge 20,95 KB = 2,0%, was 2,9%). Specs 34 (ongewijzigd), `test()`-declaraties 264 → **273**. Groei +8,8 KB, waarvan `landing.css` +6,3 KB — grotendeels commentaar; de prosa is één keer uitgedund met behoud van elke meting en valkuil.

---

### Learnings

- **Het hoogste flex-item bepaalt de regel.** `align-self: center` op de terminal deed niets omdat híj het hoogste item is. Zonder `getComputedStyle`/geometrie had ik dit fout gehad — dezelfde klasse fout als de `flex-grow` die niemand had gezet (Sessie 213).
- **Twee thema's testen was hier geen netheid maar noodzaak.** De mutant bewees het: focusregel vóór het light-blok → **light rood, dark groen**. Eén thema testen had de bug laten passeren.
- **Een testfalen is een hypothese, geen ruis — maar ook geen bewijs.** De WebKit-flake wees op het 10px-tikdoel; de Firefox-flake bleek een echte regressie (2/8 vs 0/12 tegen de oude code). Omgekeerd waren twee kleine steekproeven met tegengestelde uitkomst (2/4 rood, dan 0/3 rood) géén conclusie — pas 8× per kant gaf een uitspraak.
- **Meet de vraag die telt, niet de vraag die makkelijk is.** Bij de chipbedekking was "ligt er iets overheen" niet genoeg; de vraag was "ziet de bezoeker een label dat hij vervolgens misklikt". Een screenshot beantwoordde dat (dekkende balk, geen leesbaar label) en veranderde het advies.
- **Eerste meting was fout op één maat.** Mijn `inBeeld`-check gebruikte de bounding box i.p.v. het midden, waardoor 375×667 "drie bedekte chips" gaf terwijl die middens gewoon buiten beeld lagen. Gecorrigeerd vóór het advies — `elementFromPoint` geeft `null` buiten de viewport, en dat is geen bedekking.
- **Wees expliciet als je eigen eerdere rapportage te gunstig was.** "Alleen `help`, op één maat" werd na doormeten "drie chips, op twee gangbare maten".

**Next steps:** TASKS.md #56 (`.mobile-cta-bar` koppelen aan "geen andere CTA in beeld") — startprompt is aan Heisenberg geleverd.

---

## Sessie 215 — learnings (geroteerd uit CLAUDE.md, Sessie 221)

⚠️ **Never:**
- Een verhouding coderen als een getal. `margin-top: 3rem` op `.hero-terminal` was een handmatige optische centrering voor een venster van 313px; Sessie 214 hing er 152px demobalk onder en het stak **94px onder de tekstkolom uit** terwijl de bovenkant nog 54px te laag begon. Zo'n getal rot stilzwijgend — er is geen commit die de bug introduceert. Zet de verhouding als regel neer (`align-items: center`), dan corrigeert hij zichzelf.
- `align-self` gebruiken om "dit item centreren" te bedoelen. Het **hoogste** flex-item bepaalt de cross-size van de regel, en dat wás de terminal (468 vs 428) — `align-self: center` mat 140→608, exact ongewijzigd. Het kórtere item moet bewegen, dus de regel hoort op de container.
- Denken dat je een focusring keyboard-only kunt maken op een tekstveld. Gemeten: `input.matches(':focus-visible')` is `true` ná een muisklik (spec — tekstvelden tonen altijd focus). `:focus-within` en `:has(:focus-visible)` zijn daar identiek. De rand verschijnt hoe dan ook bij een klik; maak hem dus *bedoeld*, verberg hem niet.
- Een focus-`box-shadow` vóór een `[data-theme="light"]`-override zetten die óók `box-shadow` zet. Gelijke specificiteit (0,2,0) → bronvolgorde beslist, en de gloed verdwijnt dán alleen in light mode. De mutant liet precies dat zien: **light rood, dark groen** — één thema testen had de bug laten passeren.
- Groen tekstgroen op de lichte paginaachtergrond. `--color-cta-primary` meet daar **3,10:1** bij 14,4px: onder AA, laat staan de AAA die dit project voert. Op het zwart van de terminal is hetzelfde groen ~17:1. Kleur volgt de achtergrond waarop hij staat, niet het merk. ⚠️ **Vervolg (Sessie 221, `c8cd46b`):** dit token droeg twee rollen — als CTA-achtergrond werkt het, als tekst faalde het op 101 van de 232 accent-tekstelementen. Opgelost met een apart `--color-accent-text`.
- Een element krimpen zonder na te gaan wat je daarmee als tikdoel weggooit. Het veld naar `1ch` brengen zette de cursor goed en maakte het klikdoel **309px → 10px**; wie naast de prompt klikte activeerde de terminal niet meer. WebKit miste hem zelfs met een gerichte `.click()`.
- Een `display: none` gebruiken voor "verberg dit na gebruik" binnen een gecentreerde kolom. De kolom krimpt 29px en het venster verspringt ~15px onder de muis van wie er net op klikte. `visibility: hidden` houdt de ruimte én haalt hem uit de toegankelijkheidsboom.

✅ **Always:**
- Behandel een testfalen als hypothese, en beslis met een steekproef die groot genoeg is. Twee kleine runs met tegengestelde uitkomst (2/4 rood, daarna 0/3 rood) zijn géén conclusie; 8× per kant gaf pas een uitspraak — en die was hard: **2/8 rood op nieuw, 0/8 op oud**. Daarna pas de oorzaak zoeken.
- Vergelijk tegen de oude code op een tweede poort (`git archive HEAD` + `nostore-server.py`) vóór je "pre-existing" zegt. Bij de chipbedekking gaf dat over zes telefoonmaten een **byte-identieke** uitkomst — daarmee is "niet van mij" een meting en geen aanname.
- Meet de vraag die telt, niet de vraag die makkelijk is. `elementFromPoint` zei "bedekt", maar de vraag was of de bezoeker een léésbaar label ziet dat hij vervolgens misklikt. Eén screenshot (dekkende balk, geen label zichtbaar) veranderde het advies van "fixen" naar "vastleggen".
- Controleer je eigen meetdefinitie voordat je erop adviseert. Mijn `inBeeld`-check gebruikte de bounding box i.p.v. het midden, waardoor 375×667 drie "bedekte" chips gaf terwijl die middens buiten beeld lagen — `elementFromPoint` geeft daar `null`, en dat is geen bedekking.
- Corrigeer je eigen eerdere rapportage als doormeten hem te gunstig maakt. "Alleen `help`, op één maat" werd "drie chips, op twee gangbare maten".
- Geef een entry-point een `?v=` zodra je hem wijzigt. `landing-demo.js` had er geen terwijl `/src/**/*.js` op `max-age=3600` staat: een terugkerende bezoeker kreeg tot een uur nieuwe CSS naast oude JS — hier: de auto-demo typend in een veld van één teken breed.
- Leg een niet-opgeloste conditie vast als **baseline in een test**, niet als notitie. `BASELINE_BEDEKT` per viewport wordt rood zodra de bedekking groeit, en zijn lijsten horen `[]` te worden zodra de balk gefixt is — een notitie meldt niets terug.

---

## Sessie 216 — learnings (geroteerd uit CLAUDE.md, Sessie 222)

> Oorspronkelijke kop: *De CTA-balk verscheen waar hij niets toevoegde — en de guard die dat bewaakte, scrollde nooit*

### Sessie 216: De CTA-balk verscheen waar hij niets toevoegde — en de guard die dat bewaakte, scrollde nooit (09 aug 2026)
⚠️ **Never:**
- `window.scrollTo(0, y)` in een synchrone lus zetten om scrollposities te meten. `html { scroll-behavior: smooth }` staat in `animations.css`, dus die aanroep **animeert**: 13× in één `page.evaluate`-tick liet `scrollY` op **2px** steken. De conversie-guard asserteerde daardoor dertien keer dezelfde ongescrollde pagina — een zwaardere blinde vlek dan het probleem waarvoor hij herschreven werd. `behavior: 'instant'` plus een await per stap.
- `entry.isIntersecting` lezen als "voldoet aan mijn threshold". Die is `true` zodra het doel de root ráákt, ongeacht de threshold — bij het passeren van 0.5 vuurt de callback en levert `isIntersecting: true` met ratio 0.4. Wie daarop beslist, beslist op iets anders dan hij denkt.
- Een bounding box als bewijs van zichtbaarheid nemen. Een `visibility: hidden` balk houdt zijn box van 65px, dus de oude assertie kon een verborgen CTA niet van een aantikbare onderscheiden. Hit-testing (`elementFromPoint`) op het midden is de meting die telt.
- `transition: all` laten staan op een element dat zijn `visibility` **erft** van een ouder die je toggelt. De overerving loopt dan als transitie mee: gemeten liep de knop ~150ms achter op zijn balk — een onzichtbaar tikdoel dat nog reageert, en andersom een zichtbare balk waar een tik niets doet. Beide gaten bestaan alleen ná een toestandswissel, dus geen meting "in rust" ziet ze.
- Aannemen dat een toestandswissel "naar de veilige kant faalt". Mijn plan claimde dat letterlijk voor beide richtingen en het was precies verkeerd om. Zo'n claim is een hypothese tot je hem in het overgangsvenster meet, niet erna.
- Een `--global-timeout` kiezen die krapper is dan de suite. De volle run over drie motoren duurt >48 min; hij kapte af met **"78 did not run"** onder een regel "859 passed" — dat leest bijna als groen.
- Een grens tussen twee concurrerende invarianten op gevoel kiezen. "Verberg zodra hij het scherm raakt" breekt de tikbaarheid (een strookje van 1px is geen tikdoel); "pas bij volledig zichtbaar" opent ~24px scroll waarin er twee identieke CTA's staan. Alleen "midden vrij" maakt béíde waar.

✅ **Always:**
- Los een "mechanisme A of B"-vraag op door eerst de **regel** op te schrijven; het mechanisme volgt er dan uit. `sticky` versus IO leek de keuze, maar de echte keuze was waar de balk opzij hoort te stappen — en zodra die grens er stond (*balk verborgen ⟺ CTA-midden aantikbaar*), was IO simpelweg de goedkoopste manier om hem te draaien.
- Gebruik een observer als **trigger** en één geometrisch predicaat als **regel**. Dat vermijdt de `isIntersecting`-val, houdt de regel op één plek, en blijft correct als de `rootMargin` veroudert — bij toestelrotatie klopte de staat in alle vier de gemeten toestanden terwijl de observer nog met portretmarges liep.
- Bewijs "strenger dan de oude versie" met een mutant waarop de **oude groen** is en de **nieuwe rood**. Balk altijd `visibility: hidden` → oude guard 3× groen, nieuwe 3× rood met zes benoemde posities. Zonder die tweezijdige uitkomst is "strenger" een bewering.
- Kies de mutant die de **assertie zelf** laat vuren, niet de setup. Tegen `git archive HEAD` faalde de chip-test op zijn `waitForFunction` — dat bewijst "mechanisme afwezig", niet "de bedekkingsassertie ziet de bug". De CSS-mutant liet hem wél vuren, en gaf exact `375x812 groen / 360x800 + 390x844 rood`: dezelfde verdeling als de oorspronkelijke meting.
- Meet een invariant op een resolutie die je test niet haalt. De guard stapt 0,9 viewport; een sweep van **884-893 posities à 10px** in drie engines liet zien dat er nul gaten en nul dubbels zijn — dat kán een grofmazige test niet aantonen.
- Beantwoord "is deze faler van mij?" met het **codepad** als dat kan, niet met een steekproef. Alle falers draaiden op `/terminal.html`, dat geen van de drie gewijzigde bestanden laadt — dat is sterker en goedkoper dan 8× per kant draaien.
- Corrigeer je eigen meetfout hardop. `grep -c "[webkit]"` gaf 0 terwijl er 237 WebKit-tests groen stonden: de haken zijn een karakterklasse, dus ik zocht naar één teken uit `webkit`. Ik had daarop "WebKit moet nog beginnen" gemeld.

---

## Sessie 217 — learnings (geroteerd uit CLAUDE.md, Sessie 223)

⚠️ **Never:**
- Contrast meten tegen de **paginakleur** terwijl het element een eigen achtergrond heeft. `getComputedStyle(el).backgroundColor` gaf `rgba(22,163,74,0.08)` — geen kleur waar je tegen kúnt meten — en de notitie greep daarom naar `--color-bg`. Dat mat de laag ónder de verf: 3,10:1 genoteerd, **2,85:1** echt (2,74 op de hero, waar een radial glow laag drie is). De fout was niet alleen fout maar **te gunstig** — de badge zakte van "onder AAA" naar onder **AA**. Composite de ancestor-keten tot de eerste laag met `alpha === 1`.
- Een open item laten staan zonder test die kan melden dat hij is opgelost. De terminal-overflow van Sessie 189 was op **07 jul** gefixt door commit `3d7df13`, wiens titel de bug letterlijk noemt — en stond vijf sessies later nog open, omdat er site-breed geen horizontale-overflow-assertie op `/terminal.html` bestond. Een notitie meldt niets terug; ook niet dat hij achterhaald is.
- Een IO-gestuurde `data-state` aflezen na 2 rAF. De callback heeft dan nog niet gevuurd, dus je leest de staat van de **vorige** scrollpositie. Mijn eerste meting rapporteerde daardoor `verborgen` op maximale scroll (de staat van y=0) en overdreef de bug. 300ms settle geeft de echte waarde. Zelfde faalklasse als de smooth-scroll-val van Sessie 216: het zichtbare gedrag is asynchroon, de meting synchroon.
- `Math.round()` op een geometrieverschil dat uit fractionele layout komt. Documenthoogtes zijn fractioneel (body 1308,5px) terwijl `scrollHeight` naar boven afrondt, dus scrollen naar de bodem schiet tot 1px door — `Math.round(0.5)` maakte daar een valse faler van op `/404.html`. Meet exact en zet de drempel op wat zichtbaar is.
- Een testnaam een grens laten noemen die elders als constante staat. `Bundle size < 1000KB` stond er nog terwijl de limiet al 1050 en toen 1100 was — dezelfde staleness als de notities die deze sessie opruimde. Interpoleer de constante in de naam.
- Een budgetgrens ophogen zonder te tellen hoe vaak dat al gebeurde. 1000 → 1050 → 1100 → 1120 is **drie bumps in 14 sessies**; zonder die telling erbij is de volgende bump vanzelfsprekend en is het geen grens meer.

✅ **Always:**
- Meet vóór je plant wanneer de opdracht "deze meting klopt misschien niet" zegt. Drie van de vier vastgelegde metingen bleken onjuist, en twee daarvan veranderden het plan: (a) raakte 10 pagina's i.p.v. 9, (c) was helemaal geen bug meer. Was ik met de notities gaan bouwen, dan had ik een gefixte bug "gefixt" en een strook op index.html laten staan.
- Zeg het hardop als een vermoeden in de **omgekeerde richting** uitkomt. Heisenberg verwachtte dat de badge het bij goed meten wél zou halen; hij haalt zelfs AA niet. De diagnose klopte, de conclusie niet — dat onderscheid is de helft van het antwoord.
- Los "verkeerd geverfde ruimte" op door de ruimte te **verplaatsen**, niet weg te halen. De reserve moest blijven bestaan (weghalen = balk dekt content af) én onvoorwaardelijk blijven (conditioneel = documenthoogte wisselt per toggle → terugkoppellus). In de dónkere footer zetten maakt beide waar en verft hem meteen goed; `:has()` op elementaanwezigheid is statisch, gemeten als 9481/9481/9481 over drie toggles.
- Loop de **overlevers** van een mutant na, niet alleen de falers. 12 rood / 2 groen zegt niets tot je weet waaróm die 2 groen zijn: `@1280px` valt buiten de `≤1279px`-band en de terugkoppellus-test bewaakt een andere eigenschap. Beide horen groen te zijn — anders had ik een blinde assertie gehad.
- Kies de mutant die de oorspronkelijke meting **reproduceert**. `width: auto` weghalen gaf letterlijk `left 10 / width 360 / right 370 bij clientWidth 360` — cijfer voor cijfer de notitie uit Sessie 189. Daarmee is in één stap bewezen dat de bug echt was, dat hij weg is, en dat de nieuwe assertie hem zou zien.
- Gebruik `grep -F` bij het tellen van `[chromium]`-achtige labels. De haken zijn anders een karakterklasse — de meetfout die Sessie 216 zichzelf moest corrigeren.


> De **staande regel** die bij deze sessie hoort ("er is GEEN baseline van bekende testfalers meer")
> is bewust **in CLAUDE.md gebleven**: die is nog steeds van kracht en is geen historisch
> leerpunt maar een lopende afspraak. Roteren zou een actieve regel uit de context halen.

---

## Sessie 218 — learnings (geroteerd uit CLAUDE.md, Sessie 224)

> Oorspronkelijke kop: *De strook onder de terminal was AdSense-vulling die AdSense vijf maanden overleefde* (09 aug 2026)

⚠️ **Never:**
- Een contentblok beoordelen zonder eerst te vragen **waarom het er staat**. `git log` gaf het antwoord in één regel: commit `1cc04ff` heet *"full-viewport terminal + scroll hint for AdSense content"* en `f748c38` droeg `?v=108-adsense-content`. Advertenties gingen eruit in Sessie 208; het blok bleef, met zijn aanleiding dood. Zonder die herkomst was dit een smaakdiscussie geweest — mét was het een feit. Let op wat er méér uit die commit komt: ook de 100vh-terminal is AdSense-erfgoed.
- `getComputedStyle` gebruiken alsof het een momentopname is. Het is een **live** object: ik zette het thema terug naar dark vóór het opbouwen van mijn resultaat, dus `cs.color` gaf de dark-kleur tegen een light-achtergrond die ik wél had geparsed — 1,42:1 onzin. Lees de waarden als string op het moment dat je ze meet.
- De contrastwaarde uit een notitie overnemen als het element een **eigen** achtergrond heeft. §10 noemt 3,10:1 tegen `--color-bg`; de kaart is `#ffffff`, dus de echte waarde is **3,30:1**. En controleer of het grote tekst is: 19,8px/700 telt als large (lat 3 / 4,5), dus "onder AA" was alarmerender dan waar — het haalde AA wél en AAA niet.
- Een exact aantal in copy zetten voor een groeiende inventaris. Mijn plan zei "Bekijk alle 41 commands" terwijl de site overal "40+" voert en `validate-docs.sh:432` daar een vloer op handhaaft.
- Links toevoegen aan een blok dat zonder JS op `opacity: 0` staat. De reveal-observer voegt `.visible` nooit toe, dus élke link erin is waardeloos. `index.html:62-66` had het `<noscript><style>`-vangnet al; terminal.html niet — en ik stond op het punt er negen bij te zetten.
- Een A/B-meting vertrouwen die naast andere belasting draait. Mijn eerste vergelijking gaf 4 rood tegen 1 rood en zag eruit als een regressie; de tijden verraadden het (1,0m vs 32s voor hetzelfde werk) omdat de achtergrondrun nog liep. Serieel opnieuw: 32/32 groen aan beide kanten.

✅ **Always:**
- Rangschik de rollen van een pagina in plaats van ze op te tellen. "App-oppervlak én doorstroom én SEO" wás de reden dat het blok alle drie slecht deed. De gedocumenteerde north-star besliste: `docs/launch-success-metrics.md:44` meet *activation* ("typte hij een command"), niet lezen — dus app eerst, SEO secundair, en "onboarding onder de vouw" is geen rol maar een bug.
- Schrap inhoud die het product zélf al levert op een beter moment. "Zo begin je" dubbelde `onboarding.js:196`, de input-placeholder en de commands `next`/`leerpad` — vier schermen lager, en op mobiel onvindbaar omdat `.scroll-hint` daar `display: none` is.
- Meet een tikdoel op de maat waar het uitmaakt. Mijn nieuwe CTA zag er prima uit en mat **193×22px** op 375px: onder de 44px-grens. Een kale tekstlink is bijna nooit een geldig tikdoel; `display: inline-block` + verticale padding, en zet de onderstreping op `text-decoration` want een `border-bottom` schuift met de padding mee.
- Loop de **overlever** van een mutantenreeks na. Zeven mutanten gaven zeven rood; de test die groen bleef bij een kapot `#cmd-nmapx` doet dat terecht — hij stript de hash, en het ankerbewijs is de taak van de test die wél viel.
- Zeg het hardop als een opruiming netto **bytes kost**. Dit was −26% hoogte en 4× zoveel links, maar **+3,3 KB**: de vervanging draagt uitleg, een noscript-vangnet en een trackingmodule. "Content weghalen" leest anders vanzelf als besparing.
- Voeg de meting toe vóór je het volgende oordeel velt. Er bestond site-breed **geen enkel** scroll-event; `edu_section_reached` gedeeld door de `page_view` geeft nu de doorscroll-rate. Tot dat cijfer er is, is elke uitspraak over die strook een gevoel.


---

## Sessie 219 — learnings (geroteerd uit CLAUDE.md, Sessie 225)

**Onderwerp:** Onder "in cijfers" was de homepage één blok — en de band die als voorbeeld gold, maakte in light mode nul verschil (09 aug 2026)
⚠️ **Never:**
- Een `rgba()` over een ondergrond zetten zonder het product uit te rekenen. `rgba(248,248,248,0.8)` over een `#f8f8f8` pagina composit naar **exact `rgb(248,248,248)`** — de cijfers-band die als goed voorbeeld gold, bestond in light mode alleen uit twee haarlijnen. De comment erboven zei "zeer subtiel off-white": de bedoeling klopte, de rekensom maakte hem nul. **Derde keer in vijf sessies** (215, 217, nu) dat een alpha-over-ondergrond niet is uitgerekend — dit is geen incident maar een patroon.
- Een kaart behandelen alsof hij een kleur heeft. `rgba(22,27,34,α)` is een **verhouding tot wat erachter staat**, niet een waarde: het verschil is `0.3 × |kaart − band|`, dus nul zodra de band naar `#161b22` kruipt. Daardoor is "banden lichter maken" op deze site structureel fout. Ik zag het niet in de cijfers (band Δ11 = prima) maar op de screenshot.
- Een assertie ankeren op iets dat zelf kan verdwijnen. Ik mat "de langste reeks ná de reeks die `results-section` bevat" — verliest die sectie haar band, dan slokt die reeks de pagina op en gaat de test **groen op een kapotte pagina**. Knip op DOM-positie, niet op een groepering die van de bug zelf afhangt.
- Aannemen dat een testfaler jouw code betreft omdat hij ná jouw wijziging valt. `playwright.config.js:32` draait standaard tegen **productie** (`BASE_URL || 'https://hacksimulator.nl'`); mijn eerste 5 rood waren de oude code die zichzelf correct rapporteerde.
- Een browserfout als codefout melden zonder cache-bust. `terminal.html` gaf lokaal een ontbrekende module-export bij byte-identieke JS; warme fetch 1603 bytes, cache-bustend 2157. Mijn MCP-debugbrowser hield een bestand van vóór Sessie 208 vast — precies de val die `architecture-patterns.md` §Cache Strategy beschrijft.
- Een meting vertrouwen die naast je eigen belasting draait. De enige rode test viel tijdens een run waar ik zélf twee extra Playwright-runs naast had gezet. Zelfde fout als Sessie 218, één sessie later.

✅ **Always:**
- Kwantificeer "het leest als één blok" voordat je erover ontwerpt. Groeperen op effectieve achtergrond gaf **3,8 schermen onder** tegen 1,6 boven — dat maakt van een smaakoordeel een meting, en levert meteen de norm voor de fix (949px / 913px = 1,05 / 1,12 scherm).
- Schrijf de **regel** op in plaats van waarden te kiezen. *Pagina = oppervlak, band = verdieping, kaart = verhoging* beslist beide thema's tegelijk, verklaart waarom lichter fout is, en maakt van drie ad-hoc rgba's één token. Netto vier CSS-regels weg, twee erbij.
- Kies de plaats van een beat op de invariant, niet op aantal. Eén band volstond omdat `how-it-works` oppervlak móét blijven (het volgt op de cijfers-band), dus leerpad is de eerste mogelijke beat en knipt de reeks doormidden.
- Prototype in de browser vóór je in het bestand schrijft. De kaart-botsing zag ik alleen op de screenshot; de cijfers zeiden dat het goed was.
- Laat de mutant de oorspronkelijke meting **reproduceren**. "Band == pagina" gaf 2392px (2,66) en 3070px (3,78) — cijfer voor cijfer de nulmeting. En kies een tweede mutant die alleen de andere assertie raakt: "band == `#161b22`" maakt uitsluitend de kaart-Δ rood terwijl het ritme groen blijft, wat bewijst dat die assertie niet overbodig is.
- Bump `?v=` op **beide** entry-points als de ene een custom property van de andere leest. `.section-band` (landing.css) leest `--color-bg-alt` (main.css); een oude cached main.css laat die var ongedefinieerd en `background` valt terug op transparent — álle banden weg.
- Beantwoord "moet dit erbij?" met de rol van de pagina. De homepage eindigt al met **drie opeenvolgende asks** en haar north-star is activation, niet e-mail — dus de juridische sample gaat er niet bij, ook al is de asymmetrie (17 links vs 1) echt. Die hoort contextueel opgelost — in Sessie 220 gebeurd met één wayfinding-link naar `/gidsen.html` in de bestaande lead-magnet-strook. ⚠️ **Correctie (Sessie 220):** de tweede grond ("geblokkeerd zolang `sample-juridisch.html:132` een welkomstmail belooft die de automation nog niet stuurt") was **onjuist**. De automation stond al op Active sinds 7 aug; alleen het runbook meldde nog "Stap 2 en 3 nog te doen". Ik stond op het punt correcte copy te verzachten op gezag van een document dat drie dagen achterliep — controleer de wérkelijkheid, niet de notitie erover.
- Zeg het hardop als een opruiming bytes **kost**. −2 CSS-regels netto, +2,88 KB: het commentaar dat beide rekensommen vastlegt is langer dan de code. Marge nu 2,3% — en 1000 → 1050 → 1100 → 1120 is drie bumps in 15 sessies, dus de volgende vraag is niet "bump".

---
