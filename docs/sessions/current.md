# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

---

## Sessie 240: Een critique is een lijst beweringen — twee rondes gerepareerd, vier bevindingen vielen bij meting weg (26 sep 2026)

**Branch:** `design/impeccable`. `main` onaangeroerd; niets staat live.

**Mission:** de landingspagina "af" maken vóór de finish review: `impeccable critique` over
de hele pagina (niet alleen de hero), bevindingen geprioriteerd voorleggen, en per gekozen
ronde uitvoeren met gemeten posities, screenshots en de index-specs over drie motoren.

### De critique

Twee geïsoleerde sub-agents, zoals `critique.md` eist. **A** (ontwerpreview) op
`127.0.0.1:8901` via de MCP-browser, **B** (detector) in een eigen Node-Playwright-proces op
`localhost:8901`. Die tweede origin was nodig: het thema staat in `localStorage`, dus twee
agents op dezelfde origin hadden elkaars themawissel geërfd. Beide thema's via een klik op de
echte schakelaar; op 375 eerst via het hamburgermenu.

- **Score 25/36 (69%)**, heuristiek 7 n/a (Persuade). De hero is voor dit product; onder de
  hero een uitwisselbare reeks (probleem → oplossing → tabel → drie features → stappen → FAQ)
  zonder het raster, 8795px op 1440 en 10868 op 375. `#omslag-kop` 66,24px > h1 64,8px.
- **Detector: 58 meldingen, 2 echt.** `af-transcript` had op 375 `padding-left: 0` op een
  zwart vlak; `.faq-answer` animeert `max-height`. De rest structureel vals: 32× ingeklapte
  FAQ, 12× een indexnummer dat bewust boven zijn h3 staat. **Nul contrastclaims.**
  Scheidsrechter toch gedraaid: `text-contrast` + `eyebrow-contrast` **120 passed**, drie motoren.
- Ik heb de zwaarste claims van A zelf nagemeten vóór ze in de lijst kwamen. Eén
  reproduceerde niet headless: de scrollbalk van 10px. Playwright start standaard met
  `--hide-scrollbars`; met `ignoreDefaultArgs: ['--hide-scrollbars']` kwam hij terug.

### Ronde 1 — layout (gedrag)

- **Het getikte command stond buiten beeld.** `pinScroll()` zette `scrollTop` op de bodem;
  nmap geeft 374px uitvoer in een venster van 205px, dus de promptregel stond **107px** boven
  de rand (−92 op 375). Nu `toonCommand(promptRij)`: `scrollTop = promptRij.offsetTop`. Eerst
  met de 8px padding eraf; dat liet de afgesneden onderkant van de vorige regel erboven
  piepen, dus strak op de rand. Onderaan valt nu een halve regel af, wat juist signaleert
  dat er meer is. Een korte uitvoer klemt vanzelf op de bodem.
- **De registratienaad hing aan de scrollbalk.** `.reg { grid-template-columns: 7fr 5fr }`
  verdeelt de ruimte *binnen* de scrollbalk; met een klassieke balk (10px) lag de naad op 818,0
  tegen 823,8 voor `.af-term-kop` en `.af-glos-kop`, zichtbaar als zwarte tandjes in de
  glos-kolom. Nu `--af-module: calc(100cqw * 7 / 12)` met `container-type: inline-size` op
  `.af-hero-raster`. **Niet op `.af-term`:** `container-type` brengt layout-containment mee,
  en dan valt `subgrid` terug op `none`; `.af-term-col` en `.af-term` zijn allebei subgrid.
  Het verloop op het lichaam gebruikt dezelfde variabele.
- **Transcript @375:** `.af-transcript` stond in de lijst tekstblokken die `padding-left: 0`
  krijgen om op de rail te staan. Het is een module; eruit gehaald, 12px inzet.
- **Guards** in `hero-demo.spec.js`: "het getikte command staat in beeld" (1280 en 375, met
  zelfbewakende tak `scrollHeight - clientHeight > 40`) en "de naad blijft op de rasterlijn
  als het lichaam smaller wordt". Een klassieke scrollbalk kan niet in drie motoren, dus
  `padding-right: 10px` simuleert hem (zelfde krimp van de contentbox), met een tak die
  controleert dat de rij echt ≥9px kromp. Mutanten: `pinScroll` terug → *"promptregel
  -107px"*; `7fr 5fr` terug → *"naad 825.5 tegen kop 831.3"*; `container-type` weg →
  *"naad 892.0 tegen 831.3"* (`cqw` valt dan terug op de viewport).
- `css-layout.md` §8 leerde nog "pin op `scrollHeight`"; aangevuld bij de bron.

### Ronde 2 — typeset

- **Live verworpen.** Drie varianten (Archivo 700, Archivo smal op wdth 72, Schibsted
  Grotesk) via `impeccable live`. Heisenberg: *"de layout veranderde dus ik kon niet goed
  vergelijken … eigenlijk wil ik advies en een keuze die jij maakt."* Vastgelegd als geheugen
  `feedback_design_choice_by_specimen`.
- **Letterproef op gelijke maat** (64,8px, 1002px = negen kolommen, papier) →
  `.playwright-mcp/s240-r2-letterproef.png`. 900 liet de woordspaties dichtlopen; smal was
  het meest affiche maar luid (botst met "te intimiderend"); Schibsted kostte +38 KB zonder
  zichtbaar eigen karakter op deze maat. **Besluit: koppen Archivo 700, labels 800.** Alle
  kopregels mee (`.af h2` stond op 800, drie displaykoppen op 900): alleen de h1 omzetten had
  een 700-kop boven 800-sectiekoppen gegeven. Display-tracking −0,03 → −0,012em.
- **900 had geen gebruiker meer**, gemeten over elk renderend element. Font geïnstantieerd op
  `wght=700:800`: **22.068 → 20.688 B**, 219 codepoints gelijk, 0 advance-verschillen, en
  gerenderd op 700 en 800 exact even breed (2557,00 / 2686,00 px). `@font-face` naar 700 800.
- **Rood #cc0a1e blijft.** Papieren letter op rood 5,02; de knoptekst is 18,9px vet, dus AAA
  grote tekst ≥4,5. Warmer zakt eronder: #d4380d 4,17, #e0401f 3,70. Beide besluiten in het
  contract (`.impeccable/surfaces/index-html.md`), dat ze als open punt had.

### Wat bij meting wegviel

Vier van de tien geprioriteerde bevindingen:
- **"Regelvakken overlappen 8px"**: elke letter gaf 4-13px, want bij een regelafstand onder
  ~1,1 is de contentbox altijd hoger dan de regel. Inkt kan niet botsen: "Leer ethisch hacken
  in een" heeft geen enkele onderstok.
- **"CTA hangt tussen de kopregels"**: het actieblok staat al op de onderste kopregel, de
  microcopy 3px van de kopbasislijn. `align-self: last baseline` geprobeerd; de knop verschoof
  0px, dus teruggedraaid in plaats van een no-op met een commentaar dat het tegendeel beweert.
- **"Focus verliest het rood"**: zwart vlak met rode outline is de inversie die het contract
  voorschrijft.
- **"Diagram houdt de oude nmap-toestand"**: een besluit, `hero-registratie.js:83` ("een scan
  is kennis").

### Voorbereiding ronde 3 (gemeten, niet uitgevoerd)

Onderkant `.af-net` tegen de vouw: **949/900** (tekort 49px) op 1440, **927/800** (127) op
1280, **1071/768** (303) op 1024. Lucht: ondertitel → hint 47px, terminal → chips 51px,
chips → diagram 28px. De volledige nmap-uitvoer in beeld (13 regels in plaats van 7) kost
+169px en bijt met het diagram boven de vouw.

### Commits

- `542a2d5` Ronde 1: het getikte command staat in beeld, en de naad houdt stand naast een scrollbalk
- `4016dd5` Ronde 2: koppen in Archivo 700, het rood blijft, en 900 uit het font

### Learnings

- **Een critique is een lijst beweringen, geen lijst defecten.** Vier van de tien vielen bij
  meting weg, en twee daarvan waren meetartefacten van de agent zelf (contentbox,
  knop-versus-actieblok). Nameten vóór het voorleggen is goedkoper dan repareren wat niet stuk is.
- **Een reproductie die faalt is een meting van de meetopstelling.** De scrollbalk "bestond
  niet" headless omdat Playwright hem verbergt. `ignoreDefaultArgs` maakte hem zichtbaar;
  een "kan niet reproduceren" had een echte fout voor Windows- en Linux-bezoekers weggestreept.
- **`fr` verdeelt de ruimte binnen een scrollbalk, container-units niet.** En een container
  mag nooit op een subgrid staan: `container-type` zet hem stil op `none`.
- **Live vergelijkt slecht als de variant de layout verschuift.** Een proef op gelijke maat
  en breedte liet in één blik zien wat drie keer doorklikken verborg.
- **Een tweede server was er al.** Mijn `nostore-server` op 8901 faalde met "Address already
  in use"; de server van 24 sep diende dezelfde map zonder cache, dus de metingen klopten,
  maar het stopcommando dat ik gaf (PID van de mislukte start) niet. Kijk met `ss -ltnp`.
- **Twee agents, één origin, gedeelde `localStorage`.** Een themawissel in de ene tab had de
  andere agent mee laten wisselen. Andere hostnaam = andere origin = gescheiden opslag.

### Next steps

TASKS.md #82: ronde 3 (layout, de vouw) en ronde 4 (clarify: footerclaim "De enige
Nederlandse terminal simulator", Engels mobiel menu, hype, jargon, de vraag van de
carrièreswitcher). Daarna in een volgende sessie de onderpagina (raster doortrekken,
herhaling schrappen) en `adapt` (mobiel meescrollen, focus bij een chip-tik, de band
1024-1279). Pas dan #83 (finish review + documenter).

### Metrics delta

- Runtime-bundel (`performance.spec.js`): **1062,32 → 1063,96 KB**, marge **56,04 KB (5,0%)**.
- Playwright: 45 spec files, **332 → 334** `test()`-declaraties.
- Fonts: Archivo **22.068 → 20.688 B**, fonttotaal 91.536 → **90.156 B**.
- `du -sb`: src 738 KB, styles 409 KB, blog 492 KB, assets 1741 KB (afgerond gelijk aan 239).
- Gate per ronde: 10 index-specs × 3 motoren = **548 passed / 0 failed / 4 skipped** (twee
  keer), de skips zijn de chromium-only bestandssysteemtests in `hero-accent-budget.spec.js:208`.

---

## Sessie 239: Het affiche blijft — en de hero kreeg een instappunt (25 sep 2026)

**Branch:** `design/impeccable`. `main` staat op Sessie 235 en is onaangeroerd; niets van
dit werk staat live. Deze entry vat 236-238 samen uit de commits, want op de branch is tot nu
toe geen `/summary` gedraaid terwijl code en commits zichzelf al 236-238 noemen. Dit is
Sessie 239 zodat teller en code overeenkomen; telt `main` intussen door, dan wordt het bij de
merge rechtgezet.

**Mission:** de twee uitdagers uit de richtingsronde (pixelstad/eBoy en teletekst) in het
echt zien naast het gebouwde affiche, vóór de finish review werk vastlegt dat bij een wissel
verloren gaat. Daarna: de keuze van Heisenberg uitvoeren.

### 236-238 in het kort (uit de commits)

- Impeccable-traject gestart: `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`,
  bevindingen in `docs/design/impeccable-bevindingen.md`. De detector is alleen betrouwbaar
  op structurele regels; zijn contrastmetingen gingen twee van twee keer onderuit.
- Sitebrede fontwissel: drie fonts werden er twee (Atkinson Hyperlegible Next voor tekst;
  Archivo 700-900 voor de koppen van de landingspagina).
- Richtingsronde (seed `88f43840`, `924ea95`): "Het raster van Total Design" koos boven de
  neon-terminal. Contract: `.impeccable/surfaces/index-html.md`.
- Het affiche gebouwd (`a8bf4fa`, `bec060e`): `styles/affiche.css` onder `body.home`, alleen
  op index; gedeelde componenten opnieuw getokend in plaats van overschreven; 189 dode
  `landing.css`-regels weg; themastandaard per pagina via `data-theme-default`.

### De verloren beschrijvingen stonden op een screenshot

Het vergelijkingsdoc ging ervan uit dat de beslispagina van sessie 1 verloren was
(`.impeccable/questions/` leeg). Heisenberg had een screenshot bewaard. De teletekstkaart
stond er volledig op, inclusief FIRST VIEWPORT en RISK; de eBoy-kaart was rechts
afgesneden. Het contract per richting markeerde daarom per zin wat letterlijk van de
screenshot kwam en wat reconstructie was. Die markering maakte de bevestiging goedkoop: hij
hoefde alleen de reconstructie te beoordelen.

### De prototypes

Beide in een eigen worktree, alleen het eerste scherm, met de vier hero-scripts
ongewijzigd hergebruikt. Het DOM-contract (`#hero-demo`, `.reg`, `.af-net`, `.af-node`,
`.af-poort`) bleek de echte naad:

- **Pixelstad:** canvas van 200x156 logische pixels, opgeschaald met
  `image-rendering: pixelated`. Afwijking van het contract, en gemeld: SVG blijft vector en
  schaalt met gladde randen. De stad leest de toestand van `zetDiagram` met een
  MutationObserver; de deuren gaan pas open als een pakketje over de kabel is aangekomen.
- **Teletekst:** klok, mozaieklogo en paginateller in één klein bestand; de ondertitel onder
  de regel is alleen CSS op de bestaande `.reg`.

Twee bugs tijdens de bouw, allebei alleen zichtbaar op een tussenmoment:
- pixelstad: `.px-onder .reg-glos` woog zwaarder dan `.reg.is-lit` van het affiche, dus bij
  het oplichten werd de glos papier op papier;
- teletekst: de pagina was 700ms leeg terwijl de teller al op 888 stond, omdat de module
  onderaan gepind is en de zichtbare regels dus als laatste verschenen.

### De meting en de keuze

| | kop | CTA | terminal (1440x900) | terminal (375) |
|---|---|---|---|---|
| affiche (toen) | 761-888 | 798-857 | 101 | 95 |
| pixelstad | 162-448 | 576-635 | **714** | **1034** |
| teletekst | 204-290 | 788-844 | 435 | 441 |

Alle drie: nul consolefouten, geen horizontale scroll, tekst >= 7:1; rode CTA's 5,79 en 5,25
als grote vetgedrukte letter (lat 4,5). Op herkenning en productduidelijkheid won teletekst.
**Heisenberg koos het affiche**: teletekst visueel niet mooi, pixelstad te verwarrend voor het
product. Het criterium was vooraf vastgelegd tegen "welke vind ik vandaag het mooist" — het
was een hulpmiddel, geen vervanging van het oordeel van de eigenaar over zijn eigen merk.
Worktrees en branches verwijderd (lokaal, nooit gepusht).

### De hero: een instappunt en twee dingen die op elkaar leken

Heisenberg miste een blikvanger en vond de hero onoverzichtelijk, vooral de band diagram +
poorten + legenda + chips. Gemeten oorzaak voor het eerste: zeven lagen van gelijk gewicht,
met het enige grote typografische moment onderaan. Voor het tweede: diagram en chips deelden
celvorm; ■/□ betekende in de legenda open/dicht en op de chips gedaan/nog niet; de
poortenrij hing onder beide machines; de uitleg stond verspreid.

- Kop bovenaan, CTA ernaast op de onderste kopregel **vanaf 1280px**. Bij 1024 brak de knop
  over twee regels in een kolom van 3/12; 1280 is ook de grens van de mobiele CTA-balk. De
  ondertitel naast de kop was vier regels hoog en duwde de kop 100px omlaag; nu staat hij
  eronder, via `display: contents` zodat DOM-, lees- en tabvolgorde gelijk blijven.
- Chips direct onder de terminal als knoppen: 2px inktkader, index 01-06 (aria-hidden),
  `[✓]` als ze gedaan zijn, inkten balk voor de volgende.
- Diagram als één zin: jouw machine → scan → router, poorten als sleuven in het blok, één
  onderschrift. Eerst "Zwart = open poort" — fout in het donkere thema, waar open licht is;
  nu "een gevulde poort staat open". Op mobiel wees de scan-pijl het scherm uit; nu
  verticaal.
- `hero-demo.spec.js`: "terminal vóór de kop" omgedraaid naar "kop vóór de terminal", met
  de actie erbij, en met waarom de reden van Sessie 236 niet meer geldt.

### De guard die een pseudo-element niet zag

De eerste run gaf 3 falers, alle drie `hero-accent-budget.spec.js`: de rode rand op de
volgende chip stond in hetzelfde scherm als de CTA. De rode markering bestond al sinds de
bouw van het affiche — als vierkantje in `::before` — en de teller keek alleen naar
elementen. Nu kop en CTA in hetzelfde scherm als de chips staan, kwam het boven. Opgelost
aan twee kanten: de markering is inkt, en de teller leest `::before`/`::after`.

Mutanten, elk op een eigen assertie en gecontroleerd welke vuurde:
- het oude rode vierkantje terug → `bovenaan: [... "button.hero-chip|01ls ... [::before]"]`;
- `order: 2` op de kop → `@1440px: kop (673) hoort boven de terminal (72)`, de
  scherm-assertie en niet de DOM-assertie.

### Commits

- `33ce10b` Hero herschikt: de kop is het instappunt, diagram en chips niet langer één tabel
- (236-238: `924ea95`, `a8bf4fa`, `bec060e`)

### Learnings

- **Een vooraf vastgelegd criterium is een hulpmiddel, geen stemming.** Het deed wat het
  moest: de vergelijking ging over herkenning en duidelijkheid in plaats van smaak. Dat de
  eigenaar daarna anders koos, is geen falen van het criterium maar zijn recht.
- **"Onoverzichtelijk" was meetbaar.** Het oordeel werd pas bruikbaar toen het cijfers had:
  zeven lagen, kop op 761, CTA op 798, dezelfde vierkantjes met twee betekenissen.
- **De afwijking van het contract melden kostte niets.** Canvas in plaats van SVG stond in
  het contract; het vooraf zeggen voorkwam een discussie achteraf.
- **Een DOM-contract als naad maakte hergebruik gratis.** Zolang klassen en ids bleven,
  bestuurden de bestaande demoscripts een pixelstad en een teletekstpagina zonder één regel
  JS-wijziging.
- **`pkill -f` op een patroon schoot opnieuw de eigen shell af** (exit 144), precies zoals
  `meten-en-guards.md` §22 al zegt. Kill op PID of poort.
- **Een themawissel via alleen `data-theme` gaf een screenshot die op de echte site niet
  bestaat** (navbartekst onzichtbaar, lege knooppunten). Via de echte schakelaar klopte alles.
  §19 van dezelfde rule, opnieuw bevestigd.

### Next steps

Zie TASKS.md #82-85: eerst tweakrondes op de hero, dan de finish review + documenter, dan de
merge, dan de overige pagina's één per sessie op `main`.

### Metrics delta

- Runtime-bundel (`performance.spec.js`): **1105,32 → 1062,32 KB** (Sessie 233 → 239),
  marge 14,68 → **57,68 KB (5,15%)**. Het grootste deel komt uit Sessie 238 (dode
  `landing.css`-regels).
- Playwright: **43 → 45 spec files, 320 → 332 `test()`-declaraties** (branch 236-239).
- `du -sb`: src 738 KB, styles 409 KB, blog 492 KB, assets 1741 KB.
- Verificatie deze sessie: 14 specs die index laden × 3 motoren = **668 passed / 0 failed /
  10 skipped** (678, volledig gedraaid). CI "Validatie" op de branch groen.

---


## Sessie 235: Een ontbrekende `</main>` trok de footer de blogcontainer in — en twee contrastspecs bleken hun eigen opvolger (23 sep 2026)

**Mission:** "De footer in /blog/ is niet juist, vergelijk maar met de footers elders." Eén
ontbrekende sluittag, en daarna twee lagen van dezelfde fout: een guard die de tag uit de
vorige bug bewaakte in plaats van de klasse, en twee testspecs die al vervangen waren zonder
dat iemand ze had opgeruimd.

### De bug: één sluittag, 1151px verschil

`blog/index.html` opende op regel 216 `<main id="main-content" class="blog-container">` en
sloot hem nooit. Een niet-gesloten containerelement geeft geen enkel faalsignaal — de parser
sluit hem stil bij `</body>`, er is geen console-fout en de pagina rendert. Het enige symptoom
is dat alles erná zijn stijl erft.

Gemeten op productie, 1823px viewport:

| | `/blog/` | `/blog/terminal-basics.html` |
|---|---|---|
| ouder van `footer.landing-footer` | `MAIN.blog-container` | `BODY` |
| breedte | **672px** | **1823px** |
| linkerrand | 576px | 0 |
| `.footer-content`-kolommen | 207 / 103 / 170 | 636 / 318 / 318 |
| Ko-fi-knop | 194×**70** (gewrapt) | 210×**47** |

De wrappende Ko-fi-knop was een gevolg, geen tweede bug. Statisch bevestigd over **alle 25
HTML-pagina's × 11 gepaarde structuurtags**: dit was de enige tagmismatch van de site. Elke
andere pagina zet `</main>` netjes vóór `#footer-placeholder` — óók `terminal.html`, waar het
placeholder-blok op inspringniveau 4 staat en dus in een wrapper lijkt te zitten. Nagemeten in
de browser: ouder `BODY`, breedte gelijk aan `clientWidth`. Inspringing in de bron is geen
DOM-structuur.

Na de fix op de lokale no-store server: ouder `BODY`, 1823px, links 0, knop 210×47, kolommen
636/318/318 — cijfer voor cijfer gelijk aan de referentiepagina.

### De guard bestond al, en bewaakte het verkeerde

`validate-blogs.sh` check 3 is in Sessie 138 gemaakt voor precies deze faalvorm: een
niet-gesloten `<div class="blog-tip">` die zijn stijl over de rest van de pagina lekte. Hij
telde daarna uitsluitend `<div>`. Toen dezelfde fout op `<main>` optrad was hij per definitie
blind — hij bewaakte de tag uit die ene bug, niet de klasse "niet-gesloten container".

Uitgebreid naar `div main section article nav header footer aside figure table form`. Twee
keuzes die een meting nodig hadden:

- **Woordgrens.** `grep -o '<main'` zou een toekomstige `<main-nav>` meetellen; het patroon is
  nu `<main[[:space:]>]`.
- **`<p>` en `<li>` blijven eruit.** HTML staat daar impliciet sluiten toe, dus die zouden vals
  alarm geven op correcte markup.

Vooraf gemeten dat de uitgebreide set vandaag exact één faler geeft en na de fix nul — anders
had ik een guard voorgesteld die bij invoering al lawaai maakt. Plus een lege-populatie-tak:
het script meldde tot nu toe "All blog files pass" ook als het over nul bestanden liep.

### Guard B: de klasse aan de pixelkant

NEW `tests/e2e/footer-fullbleed.spec.js`. Guard A vangt de *oorzaak* (een niet-gesloten tag),
deze de *klasse*: op elke pagina hangt de component-footer direct in `<body>` en beslaat hij de
volle `clientWidth`. Die faalt óók als ooit een CSS-regel hem inperkt, wat geen tagteller ziet.

De drie legal-pagina's dragen geen component-footer (gemeten: `placeholder=0`, `init=0`). Ze
staan als **tweerichtings**-assertie in `ZONDER_FOOTER`: erin betekent "moet ontbreken", niet
"sla over". Een skip zou stil groen blijven zodra die pagina's alsnog een footer krijgen.

Mijn plan was één test die alle 30 pagina's afloopt. `text-contrast.spec.js` draagt echter een
gemeten notitie dat zestien navigaties in één test flaky werd zodra er een tweede worker naast
draaide — bewijs in de repo tegen mijn eigen aanpak, dus werd het één lichte test per pagina.
93 passed over drie motoren, geen flaky.

Drie mutanten, drie verschillende asserties:

| mutant | uitkomst |
|---|---|
| `</main>` weghalen | guard A `main(1/0)` + guard B op de **ouder**-check — 1 failed / 30 passed |
| legal-pad uit `ZONDER_FOOTER` | guard B op de **aanwezigheids**-assertie — 1 failed / 30 passed |
| `PAGINAS` uitdunnen tot 2 paden | guard B op de **populatie**-tak — 1 failed / **2** passed |

Die derde is de leerzaamste: zonder de populatietak was dat `3 passed` geweest — een groene
sweep die 28 pagina's stil oversloeg.

### De aangrenzende vraag: zeven lijsten, niet drie

`helpers/paginas.js` draagt bovenaan de instructie "Bij een NIEUWE pagina: hier toevoegen".
Die instructie is correct en werd genegeerd — je leest hem alleen als je dat bestand toch al
opent, en wie een nieuwe spec schrijft opent hem juist niet.

Mijn eerste inventarisatie greppte op de naam `PAGINAS` en vond drie specs. De detector die ik
daarna schreef kijkt naar de **vorm** (een array-literal met ≥2 HTML-paden) en vond er zeven:
`POSTS`, `SAMPLES`, `LANDINGSPAGINAS` en `PAGINAS_MET_BADGE` vielen buiten de naam-grep. Zoeken
op een naam in plaats van op een vorm is dezelfde meetfout een laag hoger.

Vijf van de zeven zijn terecht gescopet op een populatie waar de rest van de site niets te
meten heeft — een badge die er niet staat, een CSS-bestand dat niet laadt. NEW
`tests/e2e/paginalijst-dekking.spec.js` draait de populatie om: elke lijst meldt zich, de
uitzonderingen verantwoorden zich met een reden. Vier asserties, vier mutanten, vier
verschillende falers. Dit verving de losse subset-assertie die `legal-pages-overflow` zou
krijgen: generiek over zeven lijsten is meer waard dan een handgeschreven check in één ervan.

Een `const PAGINA = '/over-ons.html'` (enkelvoud) is bewust géén lijst maar een testfixture; de
grens ligt op twee paden in dezelfde array-literal.

### Twee specs verwijderd — en waarom mijn eerste advies fout was

Ik adviseerde `accent-text-contrast.spec.js` (12 pagina's) en `link-contrast.spec.js` (16) uit
te **breiden** naar de volle 30. Toen ik het eerste bestand opende om dat te doen, stond onderin
een verwijzing naar `text-contrast.spec.js`, waarvan de kop zegt:

> "alle eerdere contrastspecs FILTEREN op een tokenlijst (link-contrast op vijf tokens,
> accent-text en eyebrow elk op één). Wat niet in de lijst staat wordt niet gemeten, dus de
> klasse is nooit gesloten. Deze spec filtert niet."

Sessie 228 had ze dus al vervangen: 30 pagina's × 2 thema's × 2 viewports, ongefilterd,
inclusief `HOVER_PAREN` met `--color-link`/`-hover`. Uitbreiden had ~50 trage tests toegevoegd
aan een suite van al 1,2 uur, zonder één extra faalmodus. Dat had ik kunnen weten door de kop
te lezen vóór ik adviseerde.

Redundantie niet beredeneerd maar met mutanten gemeten:

| mutant | gefilterde spec | ongefilterde sweep |
|---|---|---|
| `--color-accent-text` → `#9fef00` | 4 failed | ook rood, **246×** `rgb(159,239,0)` op `/index.html` |
| `--color-link` → `#0969da` | 1 failed | ook rood, **12×** `rgb(9,105,218)` op `/over-ons.html` |

Dekking eerst bewezen (`text-contrast` volledig: 93 passed, drie motoren, 604s), pas daarna
verwijderd. Besparing: **120 tests, 229s wandklok**.

Het "gat van 32 klassen" dat ik eerder mat (klassen in niet-gemeten blogposts) was een gat in de
*populatie van accent-text-contrast*, niet in de *sitedekking* — die klassen wórden gemeten,
door `text-contrast` over alle dertig pagina's.

### `eyebrow-contrast` blijft, en dat is geen inconsequentie

De derde gefilterde voorganger draagt naast contrast ook **aanwezigheids**-asserties:
"`/index.html` hoort twee badges te hebben". Dat kan een ongefilterde sweep per definitie niet
dekken — verdwijnt het element, dan levert dat geen faler op maar een kleinere populatie, en
kleiner is daar altijd groen. Gemeten met een mutant die één van de twee badges hernoemt:

```
eyebrow-contrast   1 failed / 9 passed   (de aanwezigheidsassertie vuurde)
text-contrast      3 passed              (groen, ziet niets)
```

Dezelfde redenering die de andere twee overbodig maakte, bewijst hier het omgekeerde.

### Verwijzingen: bij de oorzaak, niet bij het symptoom

Vier levende verwijzingen naar de verwijderde specs bijgewerkt: `helpers/contrast.js` (de
lockstep-aanleiding), `eyebrow-contrast.spec.js` (verwees naar een bestand dat weg is),
`text-contrast.spec.js` (draagt nu het mutantbewijs, want dáár zit de dekking) en TASKS.md
#71/#72, die allebei een `NEW`-spec claimden die niet meer bestaat. `docs/sessions/`-entries
zijn historie en blijven staan.

### Commits

| hash | onderwerp |
|---|---|
| `5adc792` | Een ontbrekende `</main>` trok de footer de blogcontainer in |
| `0aa3963` | Elke paginalijst in de suite moet zich nu verantwoorden |
| `7a49b0f` | Twee contrastspecs weg die hun opvolger al dekte |

### Learnings

- **Een guard die uit een incident geboren is, bewaakt dat incident.** Check 3 kwam uit een
  `<div>`-bug en telde daarna alleen `<div>`. Vraag bij elke guard: wat is hier de klasse, en
  wat is de goedkoopste manier om die héle klasse te meten in plaats van het exemplaar dat ik
  nu toevallig ken? Dit is dezelfde vorm als de tokenlijst-guards uit Sessie 228.
- **Een meetrapport wordt stilzwijgend een specificatie.** `link-contrast.spec.js` opent met
  "Gemeten over 16 pagina's" — een waarheid over Sessie 227. De volgende lezer ziet dat als een
  afspraak. Niemand heeft dat besloten; het is gewoon blijven staan.
- **Zoek op de vorm, niet op de naam.** Mijn grep op `PAGINAS` vond 3 van de 7 paginalijsten.
  Een detector op de array-literal vond ze allemaal. Nul treffers bewijst iets over je patroon,
  niet over de werkelijkheid — en dat geldt ook als je wél treffers krijgt maar te weinig.
- **Lees de kop van het bestand dat je gaat vervangen vóórdat je adviseert.** Mijn advies om
  twee specs uit te breiden was aantoonbaar verkeerd en stond letterlijk weerlegd in de eerste
  twintig regels van hun opvolger.
- **Een aanwezigheidsassertie is geen contrastassertie.** Een ongefilterde sweep kan nooit
  dekken dat iets er *moet zijn* — daar is een verdwenen element geen faler maar een kleinere
  populatie. Meet dat verschil met een mutant vóór je twee specs op één hoop gooit.
- **Exit 1 zonder eindblok betekent dat je meting niet gedraaid heeft.** `-g "^/index.html"`
  matcht niets, want Playwright matcht tegen de volledige titel inclusief describe-blok. Het
  resultaat was `exit 1` met "No tests found" — zonder het log te openen had dat gelezen als
  "de sweep vangt de mutant wél", precies de omgekeerde conclusie.
- **`import.meta.url` werkt niet in deze suite.** `package.json` heeft geen `"type": "module"`,
  dus Playwright transpileert specs naar CJS. De fout (`require is not defined`) wees naar
  regel 3, een comment — sourcemaps liegen hier. Anker op `process.cwd()` mét een assertie dat
  `tests/e2e` bestaat, in plaats van hopen dat cwd klopt.
- **Bewijs de dekking vóór je hem weggooit, niet erna.** `text-contrast` is eerst volledig
  groen gedraaid (93 passed, 604s) en pas daarna zijn de voorgangers verwijderd. Andersom had
  een rode vervanger een gat achtergelaten dat niemand had gezien.
- **De rotatieregel in `docs/sessions/README.md` en de praktijk lopen uiteen.** De README zegt
  "plak in het **lopende** range-archief, sluit af bij ~250 KB"; de repo doet sinds s165 één
  archief per blok van vijf, en de bestandsnamen dragen exacte ranges. `archive-s215-s219.md` is
  84 KB — volgens de letter had 220-224 daarin gemoeten, wat de naam een leugen maakt. Gevolgd:
  de praktijk, en de README is binnen dezelfde sessie aangepast (#80): één blok = één bestand,
  de afsluit-drempel is weg, en de onderbouwing staat als blockquote ín de README zodat niemand
  hem op gevoel terugdraait. **Meet voor je zo'n regel kiest:** twaalf opeenvolgende blokken van
  exact vijf sinds `s165`, grootste 81 KB — een drempel van 250 KB die in twaalf rotaties nooit
  geraakt is, is geen regel maar een fossiel. Bijvangst: `SESSIONS.md` beloofde "Next rotation:
  Sessie 90 (estimated late december 2025)", **145 sessies verlopen**, terwijl de regel zelf al
  die tijd werkte — een afgeleide waarde hoort niet overgeschreven te worden.

### Metrics delta

- **Bundle:** src 734 KB / styles 462 / blog 491 / assets 1741 — byte-identiek aan Sessie 234.
  Deze sessie raakte alleen `tests/`, `scripts/` en één regel in `blog/index.html`.
- **Specs:** 43 → 43 (+2 nieuw, −2 verwijderd). Declaraties 317 → **320**; gedraaide tests
  **+34**, want `footer-fullbleed` genereert er 31 uit 2 declaraties.
- **Suitetijd:** −229s wandklok over drie motoren door de twee verwijderde specs.
- **Verwijderd:** 338 regels testcode.

### Next steps

- Openstaand uit eerdere sessies, ongewijzigd: #64 (flaky autocomplete-diagnose), #74
  (minify-trigger, marge nog > 5 KB), DMARC `p=quarantine` zodra de rapporten schoon zijn.

---

## Sessie 234: De mailbox kostte ~EUR 96/jaar, en de gratis standaardroute sterft in januari 2027 (15 sep 2026)

**Mission:** "ik heb een emailadres bij TransIP dat 7 euro per maand kost — kan dit ook ergens
gratis?" Uitgemond in een volledige mailmigratie naar Zoho Mail Free, inclusief drie bevindingen
die alleen door meten boven water kwamen en twee correcties op mijn eigen eerdere advies.

### De vraag was breder dan hij leek

Eerste meting: waar wordt `contact@hacksimulator.nl` eigenlijk voor gebruikt?

| taak | loopt via | mailbox nodig? |
|---|---|---|
| Contactformulier | Netlify Forms (`contact.html:169`, `data-netlify="true"`) | nee |
| Nieuwsbrief versturen | Brevo, eigen infra + eigen DKIM | nee |
| 12 `mailto:`-links, SECURITY.md, privacy.html | direct naar contact@ | ontvangen |
| DMARC rua-reports | naar contact@ | ontvangen |
| Antwoorden vanaf contact@ | mailbox | **versturen** |

Negentig procent van de behoefte is ontvangen. Alleen het antwoorden vraagt een echt verzendpad —
en dat maakte het verschil tussen de opties.

### Waarom de klassieke gratis route afviel

De standaardoplossing (forwarden naar Gmail, van daaruit antwoorden als contact@) is stervende:
Google schrapt **"Send mail as" voor niet-Google-adressen in januari 2027** en beperkt nieuwe
configuraties nu al. Bevestigd op Google's eigen supportpagina (`support.google.com/mail/answer/17101213`),
niet alleen in secundaire bronnen.

Voor een domein dat security-disclosures en AVG-verzoeken ontvangt betekent forwarding-zonder-send-as
dat elk antwoord zichtbaar van een prive-Gmail komt. Dat is geen acceptabele eindtoestand, dus
TransIP's doorstuurdienst (EUR 6,99/jaar) viel af ondanks de lage prijs.

### Dead-end: een prijs die niet bestond

Ik adviseerde aanvankelijk "TransIP Email Only vanaf EUR 1,99/mnd" — een cijfer uit een
zoekresultaat-titel dat ik niet kon verifieren omdat hun pagina achter een bot-check zit.
TransIP-support (Seth Peters) weerlegde het direct: er is geen kleiner pakket. Het cijfer was een
bewering die ik als feit had gepresenteerd, en de correctie kwam van buiten in plaats van uit een
meting.

### Bevinding 1: de regio hangt af van de ingang, niet van je IP

Zoho's datacenter-keuze ligt onherroepelijk vast bij het aanmaken van het account. Ik nam eerst aan
dat een `.eu`-URL volstond. Gemeten in de browser bleek iets anders — dezelfde knop, dezelfde
pagina, twee uitkomsten:

| ingang | gratis-knop wijst naar | datacenter |
|---|---|---|
| `www.zoho.com/nl/mail/zohomail-pricing.html` | `workplace.zoho.com` | VS |
| `www.zoho.eu/mail/zohomail-pricing.html` | `workplace.zoho.eu` | EU |

`www.zoho.eu` bestaat niet als eigen site; hij redirect naar `zoho.com/nl/...?sredirect=true`.
Die querystring is het enige zichtbare bewijs dat de EU-context actief is. Heisenberg zat al op
`zoho.com/nl` toen hij dit meldde — een klik verder was het account in het VS-datacenter beland,
onomkeerbaar, en daarmee had de privacyverklaring een paragraaf over internationale doorgifte
nodig gehad.

### Bevinding 2: Brevo slaagt op DKIM, niet op SPF

Ik heb de hele migratie gehamerd op "`include:spf.brevo.com` moet blijven staan, anders breekt je
nieuwsbrief". De headers van de testcampagne weerleggen dat:

```
dkim=pass   header.i=@hacksimulator.nl  header.s=brevo2
spf=pass    smtp.mailfrom=bounces-...@gw.d.sender-sib.com
dmarc=pass  header.from=hacksimulator.nl
```

SPF wordt geevalueerd op het envelope-domein (`Return-Path`), en dat is Brevo's eigen
bounce-domein. Het SPF-record van `hacksimulator.nl` wordt voor die mail dus niet eens
geraadpleegd. Wat de nieuwsbrief laat slagen zijn de twee `brevo*._domainkey`-CNAMEs.

De include blijft staan — hij kost 0 extra DNS-lookups (gemeten: 5/10 voor en na) en is een
vangnet als Brevo ooit een custom Return-Path krijgt. Maar de rangorde van wat je moet beschermen
lag anders dan ik zei.

### Bevinding 3: een guard die niet kon falen

`check-mail.sh` v1 bevatte deze check:

```bash
chk "MX niet meer TransIP" '^((?!transip).)*$' "$(grep -v transip <<<"$mx" | head -1)"
```

Negatieve lookahead werkt niet in `grep -E`; de `grep -v` gaf een lege string terug, en het
patroon matchte die lege string. Resultaat: `[OK] MX niet meer TransIP` terwijl de MX nog naar
`mx.transip.email` wees. De proefdraai vóór de wissel legde het bloot — precies waarvoor die
proefdraai bedoeld was. Herschreven naar een expliciete `hasnt()`-functie; daarna gaf de
voor-meting 6 geslaagd / 6 mislukt, met de zes falers exact gelijk aan de zes voorgenomen
wijzigingen.

Dit is de invariant uit CLAUDE.md in levende lijve: een check die nooit kán falen is niet te
onderscheiden van een kapotte check.

### Herziening: aliassen in plaats van losse gebruikers

Het runbook schreef eerst `contact@` en `dmarc@` als twee aparte gebruikers voor. Heisenberg maakte
zelf een superuser aan op een eigen adres, wat de betere structuur bleek: beheerdersaccount los van
het publieke adres. Geverifieerd dat Zoho 30 aliassen per postvak toestaat op het gratis plan, die
niet meetellen voor de limiet van 5 gebruikers. Eindopzet: één postvak, drie adressen, één
filterregel op het ontvangende adres (niet op afzender — DMARC-rapporten komen van tientallen
providers, het alias is het enige stabiele gegeven in die stroom).

### Waarom vijf records eruit en één erin

Heisenberg vroeg terecht of Zoho geen equivalenten nodig had. Twee verschillende oorzaken:

- `autoconfig` / `autodiscover`: dienen om mailclients hun serverinstellingen te laten vinden.
  Zoho Free heeft geen IMAP/POP/ActiveSync, dus er is niets te ontdekken — en Zoho doet
  autodiscovery sowieso met een SRV-record of XML-bestand, niet met CNAME's.
- `transip-a/b/c._domainkey`: drie selectors is TransIP's sleutelrotatie. Bij het CNAME-model staat
  de sleutel bij de provider, die achter de verwijzing kan roteren — daarvoor zijn meerdere
  selectors nodig. Zoho gebruikt het TXT-model: de sleutel staat in je eigen zone en jij roteert.
  Eén selector volstaat dan.

Praktisch gevolg: de Brevo-DKIM onderhoudt zichzelf, de Zoho-DKIM niet.

### Bijvangst: elf maanden versiedrift in privacy.html

Bij het toevoegen van Zoho aan de verwerkerstabel bleek de kop `v1.1 / 24 augustus 2026` te zeggen
en de footer `v1.0 / 16 oktober 2025`. Voor een juridisch document is dat geen schoonheidsfout: een
bezoeker die onderaan kijkt leest een beleid dat elf maanden ouder lijkt. Beide nu op
`v1.2 / 15 september 2026`.

Gecontroleerd dat de claim "drie partijen" in de TL;DR blijft kloppen — die telt de partijen achter
nieuwsbrief, gids en donatie (Brevo, Gumroad, Ko-fi), niet de tabel als geheel.

TASKS.md en SESSIONS.md noemen nog "Gmail forwarding", maar dat staat in afgevinkte logs van
Sessie 91 en wás toen waar. Historische logs herschrijven maakt de projectgeschiedenis
onbetrouwbaar; alleen levende documentatie is bijgewerkt.

### Eindstand

```
MX      10 mx.zoho.eu. / 20 mx2.zoho.eu. / 50 mx3.zoho.eu.
SPF     v=spf1 a mx include:zoho.eu include:spf.brevo.com ~all   (5/10 lookups)
DKIM    zoho._domainkey  2048-bit, heel aangekomen (OpenSSL-gedecodeerd)
DMARC   v=DMARC1; p=none; rua=mailto:dmarc@hacksimulator.nl
check-mail.sh  12 geslaagd / 0 mislukt, ook ná de opzegging
```

Beide verzendpaden geverifieerd met echte mail, niet met aannames: Zoho SPF/DKIM/DMARC pass,
Brevo DKIM-aligned pass.

### Commits (2)

- `82a9a08` Mail van TransIP naar Zoho Mail (EU) verhuisd; runbook en DNS-guard vastgelegd
- `c058577` Zoho in de verwerkerstabel; de footer liep elf maanden achter op de kop

Vóór de commit is `janwillem@hacksimulator.nl` uit het runbook vervangen door `<eigenaar>@...`.
Check 19b zou het doorlaten (die kijkt naar consumenten-providers), maar het is de superuser-login
van de mailomgeving en deze repo is publiek.

### Learnings

- **Een prijs uit een zoekresultaat-titel is een bewering, geen meting.** De EUR 1,99 die ik
  adviseerde bestond niet; de bot-check die de verificatie blokkeerde was het signaal om het
  cijfer als onzeker te presenteren, niet om het alsnog te noemen.
- **Diagnosticeer niet vanuit één mislukte poging.** Ik concludeerde dat Zoho de directe signup-URL
  weigerde zonder referer. De echte oorzaak was dat mijn browserpaneel dichtstond. Die verkeerde
  diagnose kwam als vaststaand feit in het runbook terecht.
- **De eerste rode regel in een console is zelden de oorzaak.** De lege signup-pagina gaf een 403
  en een 400; dezelfde twee fouten verschenen bij een load die daarna gewoon slaagde. Pas een
  vergelijking met een geslaagde load maakte een foutmelding betekenisvol.
- **Scheid je eigen meting van de bevestiging van de leverancier.** Zoho's Verify-knop herkent een
  vers TXT-record pas na 30-60 minuten. Zonder een onafhankelijke `dig`-meting zit je een uur te
  twijfelen of je record fout is.

### Next steps

- [ ] DMARC `p=none` → `p=quarantine` zodra de rapporten op `dmarc@` alleen eigen verzendpaden
      tonen. Stond al als ambitie in `.claude/plans/brevo-deliverability-sessie-C.md`.
- [ ] Losse bevinding, buiten deze migratie: er staat een wildcard `* AAAA 2a01:7c8:e100:1::50a0`
      in de zone. Gemeten: `willekeurig-subdomein-test.hacksimulator.nl` resolvet daarheen, dus elk
      niet-gedefinieerd subdomein wijst naar TransIP-infrastructuur die niet meer van ons is.
      Eerst uitzoeken of er iets op leunt (`www` heeft een eigen CNAME, dus waarschijnlijk niet —
      maar dat is een bewering tot je het meet).

### Metrics delta

| | vóór | ná |
|---|---|---|
| Mailkosten | ~EUR 96/jaar | EUR 0 |
| Bundle `assets/` | 1740 KB | 1741 KB (+1 KB, privacy.html) |
| `src/` / `styles/` / `blog/` | 734 / 462 / 491 KB | ongewijzigd |
| Playwright | 43 specs / 317 `test()` | ongewijzigd |
| DNS-records mail | 8 (TransIP) | 4 (Zoho + Brevo) |

Geen code-wijziging aan `src/`, `styles/` of `tests/`. `legal-pages-overflow.spec.js` gedraaid op
de gewijzigde pagina: **27 passed** over drie motoren op 320/375/414px, dark + light — de nieuwe
tabelrij veroorzaakt geen horizontale overflow.

---

## Sessie 233: De pijl ontbrak in de font-subset, en die ene hack liet de haak van `[→]` onzichtbaar (5 september 2026)

**Mission:** "lees TASKS.md en CLAUDE.md, wat is de volgende stap?" — uitgemond in het
fire-ready maken van de launch-kit, en van daaruit in een renderbug die de site 38 dagen
onopgemerkt droeg.

### Mijn eerste antwoord was fout gerangschikt

Ik stelde de vier Firefox-flakies uit Sessie 232 voor. Heisenberg vroeg: *"is dat de beste
volgende stap? En niet de site kenbaar maken op fora?"* Dat was terecht, en het bewijs is hard:

| feit | waarde |
|---|---|
| dagen sinds launch-dag (29 jul) | **38** |
| sessies sindsdien (221-232) | **12, allemaal technisch** |
| nooit afgevuurde kanalen | **3** (EHGN-projectpost, Show HN, r/SideProject) |
| D+14-meting (`site:` + GSC + funnel) | gepland ~12 aug, **nooit gedaan** |

`launch-checklist.md:25` noemt dat blok *"Morgen oppakken"*. Dat "morgen" was 37 dagen geleden.

**De bias, expliciet:** ik rangschikte op *meetbaarheid vanuit de repo*, niet op waarde. Een
flaky test geeft een getal, distributie niet. Een codebase met 20 checks en 43 specs genereert
eindeloos zichtbaar werk; zonder tegenkracht wint de repo altijd. Twaalf sessies op rij is geen
toeval maar een patroon. Ook: #45 en #59 wachten op data die niemand ophaalt, dus ze blokkeren
zichzelf.

### De launch-visuals waren de take van vóór 6 juli

Twee onafhankelijke tells, beide gemeten en niet geredeneerd:

1. Ze dragen nog `[?] TIP:` — commit `43eeb58` hernoemde die marker op **6 juli** naar `[TIP]`
   (82 hits, 27 bestanden). Productie serveert `[TIP]` correct (gemeten, HTTP 200 op
   `/src/commands/network/nmap.js`).
2. De GIF is **640 hoog**, terwijl `capture-launch-visuals.mjs` sinds 14 juli 720 zegt.

Dus de her-capture van Sessie 173 is nooit in `~/hacksimulator-launch-visuals/` beland; wat daar
op 29 juli is heen gekopieerd was de oude take, en Sessie 232 gooide `.playwright-mcp/` weg
inclusief het goede origineel. Ondertussen tekende `TASKS.md` over precies die her-capture af:
*"3 artefacten geverifieerd (router-profiel + cyaan `[TIP]` + geen banner)"*. **Die claim is
onwaar tegen het artefact** — het beeld toont het tegendeel. Niemand heeft het beeld bekeken.

Sinds die take: **47 commits** op `styles/` en `src/`, waaronder `260f8af` (14 aug) die
repareerde dat elke verticale box-rand als streepjeslijn rendeerde — en het GIF-scenario is
`help` → `nmap`, waarbij `help.js:38` juist die boxen bouwt.

### De "vreemde cirkels" waren dithering, geen site-bug

Heisenberg meldde cirkels in de achtergrond die hij live niet ziet. `terminal.html:189` draagt
`<div class="grid-background">`, een echte radiale vignette (`main.css:219`, dark: center
`rgb(35,35,35)` → zwarte rand). Gemeten in dezelfde achtergrondstrook:

| | uitkomst |
|---|---|
| PNG (verliesvrij) | **74 unieke tinten**, ramp 4→17, vloeiend |
| GIF (226-kleurenpalet) | **2 kleuren**, pixel-om-pixel, **60 harde overgangen** |

Dither-dichtheid als functie van de straal: `100% → 91,4% → **39,5%** → 17,7% → 9,4% → 0%`.
Die sprong ís de zichtbare ring. De lichtere dithertint is `(13,17,14)` — groenig, want het
palet wordt opgeslokt door de groene terminaltekst en er blijft geen neutraal donkergrijs over.
Vandaar "vreemd" en niet gewoon korrelig.

**Fix:** `.grid-background` platgeslagen tot één effen tint via `addStyleTag`, **alleen in de
GIF-capture**; de PNG's houden de echte vignette omdat die hem getrouw renderen. Zelfde soort
opname-ingreep als de bestaande `CLEAN_STATE`. Afgetekend op de meting: **1 kleur, 0 overgangen**.

### #77 — de haak die niet schilderde

De verse capture toonde ` →]` in plaats van `[→]`. Zelfde beeld, alle drie op x=60:

```
[✓]    inkt 185      rendert
[TIP]  inkt 255      rendert
[→]    inkt 9 en 13  ACHTERGROND
```

Zelfbewakend gemeten: rects vóór én ná de screenshot identiek, populatie niet leeg. Trigger is
`help`; het overleeft scroll, geforceerde repaint én een volledige relayout via viewport-wissel,
dus geen paint-invalidatie. **Chromium-only** — firefox en webkit meten 255.

**Oorzaakketen (fontTools):** `jetbrainsmono-latin.woff2` (229 codepoints) miste U+2192 `→`,
U+2190 `←` én U+2713 `✓`. Die vielen terug op een systeemfont met een andere baseline —
precies waaróm `.marker-arrow`/`.inline-arrow` met `top:-.2em` bestonden. Die spans knippen de
regel in font-runs en laten `[` over als run van één teken vóór een elementgrens.

**Vier leads gemeten en uitgesloten** (zodat een volgende sessie ze niet opnieuw loopt):

| lead | uitkomst |
|---|---|
| `'JetBrains Mono Box'` eerst in de stack | **nee** — ook volledig uit de stack blijft de inkt 9 |
| `font-variant-ligatures: none` (S229) | **nee** — terug op `normal` én `contextual`: inkt blijft 9 |
| `::first-letter`-regel | **nee** — die bestaat nergens in `styles/` |
| span nesten i.p.v. verwijderen | **nee** — een wrapper zonder lift faalt identiek (inkt 9) |

**Vier structuren op de échte regels gemeten**, met de huidige structuur als control die móét falen:

```
A  huidig  [<span>→</span>]                inkt   9   <- control vuurt
B  hele marker in de lift-span             inkt 255   maar tilt óók de haken 4px op,
                                                      en de pijl staat dan nog steeds
                                                      laag t.o.v. de haken -> lost niets op
C  wrapper zonder lift, pijl-span erin     inkt   9   nesten helpt niet
D  geen span                               inkt 255   maar pijl zakt +3,5px door
```

Dat B niets oplost was de vondst die de richting bepaalde: beide "goedkope" fixes zijn slechter
dan ze lijken, dus de reparatie hoorde een laag dieper.

### De reparatie: het brondocument, niet de vindplaats

Subset opnieuw gebouwd uit upstream JetBrains Mono (SIL OFL; licentie stond al in
`styles/fonts/LICENSES/`), ná expliciete toestemming voor de download:

- as beperkt tot **wght 400-800** zoals het origineel (`varLib.instancer`)
- gesubset op de bestaande 229 codepoints **+ U+2190/U+2192/U+2713**
- features gelijkgehouden op `calt,ccmp,frac,locl,mark`

**Twee dingen die de meting corrigeerde vóór installatie:**

1. Met `--layout-features='*'` sleepte de subsetter **36 features en 123 alternate-glyphs** mee:
   35.772 bytes, +4,3 KB voor drie glyphs. Met de originele feature-set: 30.268.
2. **U+00AD** (zachte afbreekstreep) zat wél in de oude subset maar **niet in upstream** — die
   was door de vorige tool op de gewone hyphen gemapt. Zonder expliciet terugmappen was de
   wijziging stilzwijgend *subtractief* geweest.

**Verificatie vóór installatie:** 232 codepoints, niets kwijt, upem 1000, as 400-800, en
**0 advance-width-verschillen over alle 229 gedeelde codepoints** — dus geen layout-verschuiving.
Bestand **31.432 → 30.272 bytes**: kleiner mét drie glyphs erbij.

Daarna kon de hack weg: `.marker-arrow` volledig uit `renderer.js` + `terminal.css`, en
`.inline-arrow` behield kleur/marge maar verloor `position:relative;top:-.2em`.

**Gemeten ná de fix** (lokaal, no-store server, drie motoren), pijl t.o.v. haak:

```
chromium  +0,5px      firefox  0,0px      webkit  +0,5px
```

Beter dan de opgetilde span (−0,5) en ver beter dan de span weghalen zónder font-fix (+3,5).
De `←` in de nmap-output staat op **0,5px** van zijn referentieletter op alle drie de regels.

### Guard + mutanten

NEW `tests/e2e/marker-brackets.spec.js` (2 tests × 3 motoren) met drie asserties: **populatie**
(faalt óók bij nul treffers), **haak-schildert** (pixels, niet DOM) en **pijl-op-de-haaklijn**.

| mutant | faalt op | bijzonderheid |
|---|---|---|
| M1 span terug | structureel (3 motoren) **+** haak-inkt (**alleen chromium**) | bewijst dat de haak-tak motorspecifiek werkt |
| M2 unicode-range inperken | alleen uitlijning, 3 motoren | haak-inkt blijft groen — andere tak |
| M3 marker hernoemen | populatie, mét diagnostische melding | vuurt vóór de rest, dus leesbare diagnose |

⚠️ **De guard betrapte eerst mijn eigen meetfout.** Op webkit is de screenshot in
**device-pixels** en `getBoundingClientRect` in **CSS-pixels** — factor 2. Daardoor lazen álle
vier de markers als "geen inkt", inclusief `[?]` en `[✓]` die aantoonbaar renderen. Zonder een
control die móét slagen had ik dat als een tweede bug gerapporteerd. Nu `devicePixelRatio`-bewust.

⚠️ Tweede eigen fout, dezelfde klasse: mijn verificatiescript filterde op `bb.y + bb.h <= 720`
terwijl een `DOMRect` geen `.h` heeft → `NaN <= 720` is false → **lege populatie**. De spec meldde
dat als "LEGE POPULATIE" in plaats van groen te zijn. Dat is precies waarvoor die tak bestaat.

### Launch-kit fire-ready

- Feitentabel hergeteld: **42** command-files (was 41), **14** blogposts (was 13). Beide vloeren
  (`40+`, `12+`) overleven de drift — dát is waarom ze als vloer staan en niet als exact getal.
- Twee stale instructies weg: de kop stuurde nog naar de op 22 jul overgeslagen demand-validatie
  (#44), en de D-1-lijst stond onafgevinkt terwijl `launch-checklist.md` §Stand meldt dat hij is
  uitgevoerd. Twee documenten die dezelfde toestand bijhielden; de checklist is nu expliciet eigenaar.
- NEW **§6**: de drie open kanalen als definitieve tekst, met de HN-valkuil (URL-veld invullen →
  tekstveld leeg → beschrijving als eerste comment).
- Gemeten: alle bestemmingslinks + **28 sitemap-URL's op HTTP 200**, 0 falers.

### Commits

- `417fa53` — De cirkels waren GIF-dithering; de ontbrekende haak is een echte regressie
- `e50630e` — De pijl ontbrak in de font-subset; die hack liet de haak van `[->]` onzichtbaar
- `86d958d` — Visuals opnieuw gecaptured nu #77 gefixt is; kit-footer bijgewerkt

### Metrics delta

```
specs           42  → 43        (NEW marker-brackets.spec.js)
test()         315  → 317
getrackt       377  → 378
bundel      1104,85 → 1105,32 KB / 1120   (marge 15,15 → 14,68 KB; +480 B, alleen commentaar)
font woff2   31.432 → 30.272 bytes        (telt niet mee in RUNTIME_SOURCE; wél voor de bezoeker)
codepoints      229 → 232                 (+U+2190 +U+2192 +U+2713, 0 advance-width-verschillen)
checks           20 → 20
```

Regressie: **251 passed / 0 failed / 4 skipped** over `responsive-ascii-boxes` +
`font-ligatures` + `marker-brackets`, drie motoren, mét eindblok. De guard daarna óók
**6/6 groen tegen productie**.

### Next steps

- **De vier Firefox-flakies staan er nog steeds** (`blog-theme-toggle`, `tutorial-mobile`,
  `tutorial`, `persistence-flush.spec.js:76`). Sessie 232 noteerde ze al; twee sessies is nog
  geen patroon, drie wel.
- **#45/#46/#59 blokkeren zichzelf** zolang de GA4-funnel en GSC Coverage niet worden opgehaald.
  De launch-kit is nu klaar; wat rest is Heisenberg's uur en zijn login.
- **#74 (minify) heeft zijn trigger niet gehaald:** marge 14,68 KB tegen een drempel van 5.
- De les uit #77 die generaliseert: een **font-subset is een aanname**. Elke CSS-hack die een
  glyph verticaal corrigeert, is een symptoom van een ontbrekende codepoint — kijk daar eerst.

---

## Sessie 232: De bloat zat niet in de code — twee "debugtests" klikten alleen een modal weg (5 september 2026)

**Mission:** "analyseer dit project op bloat — zijn er bestanden die niet meer nodig zijn of
dubbel zijn?" Doel was een schone, goed georganiseerde projectmap.

### Diagnose: de code was al schoon, en dat is de hoofdbevinding

Gemeten vóór er iets werd weggegooid, per basename over de hele repo behalve `node_modules`
en `.git`:

```
src/      118 JS-modules      0 ongebruikt
styles/    11 stylesheets     0 verweesd
assets/    36 bestanden       0 ongerefereerd
tracked   387 bestanden       0 md5-duplicaten
```

Er viel in de applicatie dus niets weg te gooien. Dat is een compliment aan de validate-scripts
en de 8-staps command-checklist: die houden de code schoon. De bloat was verschoven naar de
lagen die géén guard hadden.

### Werk

**(a) Schijf-cruft, 153M → 97M.** `.playwright-mcp/` stond op **55 MB in 1111 screenshots**
(mrt–aug 2026; 147 uit juni, 143 uit augustus) — meer dan alle broncode, docs en assets samen.
Plus `playwright-report/` (608 KB) en `test-results/`. Alle drie gitignored, en juist daardoor
onzichtbaar in `git status`. De twee sample-PDF's in `docs/products/` bleken bovendien
**md5-identiek** aan de geserveerde `assets/samples/*.pdf`.

**(b) `git gc`, 69M → 26M.** `git count-objects -vH` gaf 3388 losse objecten (44,31 MiB) naast
4 packs (23,02 MiB). Losse objecten krijgen geen delta-compressie, en de historie bestaat
grotendeels uit honderden revisies van `current.md`/`SESSIONS.md` van 500–600 KB die onderling
nauwelijks verschillen — precies waar delta-packing wint. Ná: 0 los, 1 pack, `git fsck` schoon.
**Bewust niet gedaan:** `filter-repo`/BFG om die blobs uit de historie te snijden. Dat
herschrijft elke commit-hash en breekt elke `git`-verwijzing in TASKS.md en de archieven, voor
minder winst dan een `gc`.

**(c) Twee tests die niet konden falen op hun eigen onderwerp.**

```
debug-console.spec.js   2 expects  15 console.logs
debug-storage.spec.js   4 expects  15 console.logs
```

Alle zes `expect()`-calls doen hetzelfde: het legal-modal wegklikken als setup. Geen enkele
assertie over console-errors of localStorage — de bestanden printten, en een mens moest kijken.
Ze draaiden wel mee in elke run over drie motoren, en wekten de indruk dat die paden gedekt
waren. De echte dekking staat assertief in `persistence-flush.spec.js` (flush-on-hidden voor
challenges én VFS) en `vfs-versioning.spec.js` (matchende signature, stale save, verse
bezoeker). `modal-colors-simple.spec.js` (2 expects) was een strikte subset van
`modal-headers.spec.js` (7 expects, dekt legal + feedback + de neon-green-guard). 45 → 42 specs
zonder verlies van één assertie.

**(d) Het grootste getrackte bestand was een dood meetartefact.**
`docs/testing/lighthouse-m9-baseline.json`, **637 KB** — groter dan TASKS.md — en de enige
verwijzing in de hele repo was een *uitsluitingsregel* in `.gitleaks.toml`. Bij het opruimen
daarvan bleek de meting het waard: van de vier exclusies was er maar **één** exclusief van dat
bestand afhankelijk (`AIDAQEBA{13}`). Het commentaar bij `ca-pub-6345664385525701` noemde
expliciet "een historisch Lighthouse-rapport", maar die ID staat óók in
`archive-s175-s179.md` — beide schrappen had de CI-secretscan rood gemaakt. Het commentaar was
een bewering: het zei waar de match vandaan kwam, niet waar hij overál vandaan komt.

**(e) Verweesde docs, per bestand beoordeeld.** Vier plandocumenten in `docs/archive/` plus
`docs/milestones/m5-audit-report.md` hadden nul verwijzingen. `docs/netlify-setup.md` is even
verweesd maar operationeel en blijft staan — verweesd is een reden om te kijken, geen
verwijderargument. Ook weg: `tests/e2e/test-report.md`, een subset van
`CROSS-BROWSER-TEST-REPORT.md` (zelfde suite, zelfde datum 22 okt 2025); de langere verhuisde
naar `docs/testing/` bij de vier andere.

**(f) NEW Check 20 in `validate-docs.sh`** — op verzoek, nadat de opruimstap eerst als notitie
in `/summary` Step 7 was gezet.

`20a` meet de omvang met **twee** drempels: warn vanaf 10 MB, fail vanaf 50 MB. Bewust
verschillend. Een volle map is rommel, geen defect — er lekt niets en de site werkt. Alleen
warnen scrollt voorbij in twintig checks; alleen falen blokkeert een commit midden in een
debugsessie en leert je `--no-verify`, wat de guard erger maakt dan geen guard. De 50 is geen
rond getal maar de gemeten stand waarop het probleem ontdekt werd (55 MB).

`20b` faalt zodra er iets getrackt onder die paden staat. Dat bewaakt de aanname waaronder de
`rm -rf` uit Step 7 veilig is, en het is de subcheck die **wél** in CI vuurt — daar bestaan die
mappen nooit, dus `20a` meet er per definitie 0 MB.

Beide dragen een ijkmeting (`du -sb src` ≥ 100 KB, `git ls-files src` ≥ 1 bestand), want de
mappen zijn er meestal niet en "0 MB, niets getrackt" is anders niet te onderscheiden van een
script dat in de verkeerde map draait.

Vijf mutanten, elk op een **andere** assertie:

```
15 MB artefacten          20a WARN        script exit 0  (blokkeert niet)
60 MB artefacten          20a FAIL        script exit 1
getrackt bestand erin     20b FAIL        20a bleef OK
du naar leeg pad          20a ijk-FAIL
git ls-files naar leeg    20b ijk-FAIL
```

### Learnings

**Een pipe verbergt de exit-code van het commando dat je meet.** Mijn eerste volle suite draaide
als `npx playwright test ... | tail -40` en rapporteerde exit 0. Dat was `tail`'s exit-code. De
werkelijke run was afgekapt door mijn eigen `--global-timeout=1800000`: **672 passed, 862 did
not run, 1 interrupted**. Erger: de `| tail` buffert tot EOF, dus het outputbestand bleef 0
bytes en er was geen tussenstand mogelijk. Correcte meting daarna: `> bestand 2>&1` gevolgd door
`echo "PLAYWRIGHT_EXIT=$?"` → **1520 passed / 0 failed / 0 did not run** in 1.3h.

**Dit stond al opgeschreven en heeft niet geholpen.** De `**Versie:** 6.02`-entry van Sessie 229
eindigt met: *"⚠️ Een eerste volle run gaf exit 0 mét `55 did not run` — een global-timeout op
gevoel i.p.v. op een meting."* Exact hetzelfde patroon, één sessie eerder, en het herhaalde zich
toch. Een sessielog laadt niet mee in de volgende sessie. Daarom is de regel deze keer naar
`.claude/rules/meten-en-guards.md` gegaan (scoped op `tests/e2e/**` en `scripts/**`, dus hij
laadt vanzelf zodra iemand een testrun aanraakt) in plaats van naar een derde sessielog dat
hetzelfde nog eens vertelt.

**Ik heb tijdens het verifiëren 37 MB nieuwe bloat gemaakt.** De drie testruns vulden
`test-results/` (video's via `retain-on-failure`) en `playwright-report/` opnieuw, en die stonden
bijna in de eindmeting. Opgeruimd na het uitlezen — maar het illustreert waarom Check 20 nodig
was: deze mappen groeien door normaal werk, niet door nalatigheid.

**Drie Firefox-flakies blijven staan:** `blog-theme-toggle`, `tutorial-mobile`, `tutorial`, plus
`persistence-flush.spec.js:76` in de gerichte run. Alle vier timing, alle vier groen bij retry.
Die laatste is ongemakkelijk: het is precies de test die de dekking van het geschrapte
`debug-storage.spec.js` overneemt. Hij dekt het assertief, maar stabiel is hij niet — en "de
dekking bestaat al" is een sterkere claim dan "de dekking bestaat al en is stabiel". Alleen het
eerste is gemeten waar.

### Metrics delta

```
schijf         153M → 53M        (.git 69M → 26M, werkbestanden 8,6M)
specs           45  → 42
test()         316  → 315
getrackt       387  → 377
bundel        1104,62 → 1104,85 KB / 1120  (marge 15,15 KB)
checks          19  → 20
```

### Next steps

- **`.playwright-mcp/` groeit door normaal werk.** Check 20 meldt het nu, maar de opruiming is
  handwerk in `/summary` Step 7.
- **De vier Firefox-flakies** horen gemeten te worden, niet gewend — er is geen baseline van
  bekende falers.
- **TASKS.md's footer-marker staat op 29 regels van het einde** (Check 2 eist < 30). Elke sessie
  voegt een `**Versie:**`-regel bóven die marker toe, dus de volgende sessie breekt hem.

---

## Sessie 231: `publish = "."` zette de bron van vier betaalde gidsen op de CDN (22–24 augustus 2026)

> **Achteraf gereconstrueerd in Sessie 232** uit de acht commits. Deze sessie kreeg destijds
> geen `/summary`, terwijl acht codebestanden zichzelf al "Sessie 231" noemen — de code kende
> het nummer, de documentatie niet. Precedent: Sessie 227 is op dezelfde manier gereconstrueerd.

**Mission:** niet vooraf vastgelegd. Uit de commits blijkt een securityronde die uitwaaierde
naar CI-gates, privacy en een paar copy-defecten.

### Het lek

Er is geen build-stap, dus de Netlify publish-root is de repo-root: **alles wat git trackt werd
geserveerd**. Gemeten op productie, allemaal HTTP 200:

```
/docs/products/pentest-playbook.typ    24.584 bytes
/docs/products/leerplan.typ            36.373 bytes
/docs/products/lab-opzetten.typ        31.067 bytes
/docs/products/juridische-gids.typ     17.830 bytes
```

Dat is de volledige inhoud van de vier Gumroad-gidsen, gratis naast de betaalde PDF.
`.gitignore` sluit `docs/products/*.pdf` uit en houdt de `.typ`-bron bewust getrackt — een keuze
die klopte zolang niemand de map kon opvragen. Daarnaast stond `archive-s121-s164.md` live
(388 KB) met drie privé-mailadressen van de eigenaar, naast `/TASKS.md`, `/PLANNING.md`,
`/SESSIONS.md`, `/scripts/*.sh` en `/package.json`. `robots.txt` had `Disallow: /docs/`, maar
dat is indexeringsadvies en geen toegangscontrole.

### Werk

**(a) Check 19, met de populatie omgedraaid.** Niet "staan de paden die ik nu ken in een
blokkeerlijst", maar "élke top-level entry die git trackt wordt door `publish = "."` geserveerd,
dus verantwoord je". Een entry mag dat op drie manieren, alle drie gemeten tegen productie:
dotfile/dotdir (Netlify serveert die nooit), `netlify.toml`/`_headers` (wordt geconsumeerd), of
de expliciete PUBLIEK-allowlist. Al het overige moet een 404-redirect hebben. Een lijst-guard
bewaakt zijn lijst — precies daardoor kon `docs/products/` meeliften. 19b vangt
privé-mailadressen als *klasse* (consumenten-mailproviders), niet als lijst.

**(b) Check 19 betrapte in zijn eerste CI-run de commit die hem introduceerde.**
`package-lock.json` uit `.gitignore` halen maakte er een getrackte top-level entry van — precies
de klasse die 19a bewaakt. Twee redenen dat het lokaal groen was, beide gerepareerd: validate-docs
draaide vóór `git add` (Check 19 leest `git ls-files`, dus een ongestaged bestand bestaat voor hem
niet), en de pre-commit-hook draaide helemaal niet omdat zijn `files:`-patroon `netlify.toml` noch
`.gitignore` dekte — terwijl Check 19 juist `netlify.toml` uitleest en een `.gitignore`-wijziging
een bestand nieuw deploybaar maakt.

**(c) 450 KB derde-partij-JS dat niets meer deed.** Brevo's `main.js` stond op vier pagina's en
laadde vóór elke toestemmingsvraag, terwijl `brevo-submit.js` het submit-event in de capture-fase
onderschept met `stopImmediatePropagation()` en de POST zelf doet — Brevo's eigen handler kwam er
niet meer aan te pas. Ablatie gemeten in plaats van beredeneerd, want "Brevo-assets" is één naam
voor twee verschillende dingen:

```
main.js         450,6 KB   render byte-identiek zonder (zelfde MD5)  → weg
sib-styles.css   57,6 KB   kaart verschuift 74px zonder              → blijft
```

Zelf-hosten van die stylesheet viel af op de bundel (1118,63/1120 KB). Hij staat nu expliciet in
het privacybeleid in plaats van dat je hem in je netwerkverkeer moet ontdekken; het beleid noemde
vier verwerkers niet.

**(d) `try/catch` dekt kapotte JSON, niet geldige JSON van de verkeerde vorm.** `"hoi"`, `[]` en
`null` zijn allemaal geldige JSON, komen dus nooit in de `catch`, en werden daarna als object
geïndexeerd. De fallback bestond in alle drie de gevallen al — hij werd alleen niet bereikt.
`progress-store.load()` → `_defaults()`, `tutorial-manager._load()` → `null`, `._loadHints()` →
`{}`. Zelfde patroon als `history.js:180` en `vfs.js:469`, die dit al deden.

**(e) De rotatieformule uit `/summary` verwijderd.** Hij droeg `archiveer [N-10 .. N-6]` en gaf
twee keer aantoonbaar de verkeerde actie (Sessie 215: 205-209 i.p.v. 200-204; Sessie 230:
220-224 i.p.v. 215-219). Het patroon is niet "de formule is fout" maar "er is een kopie": de
correctie werd bij 215 al vastgelegd en de formule verhuisde naar een ánder document in plaats
van te verdwijnen. Nu een verwijzing naar de eigenaar (`docs/sessions/README.md`) plus een
falsificatietabel, zodat "hier stond ooit een getal" niet als omissie leest.

**(f) Copy.** De AI-tooltip uit 15 blogposts — gematcht op de exacte 107-byte string en niet op
`title=`, want dezelfde pagina's dragen 149 `abbr`-jargontooltips en 16 RSS-link-titles die een
brede strip zou hebben meegenomen; beide tellingen staan als zelfbewakende tak. En een CTA op
`over-ons.html` die "Direct aan de slag" beloofde en één regel later "Nieuw met hacken? Lees
eerst ..." zei — een aarzelprikkel op precies het punt waar de bezoeker de knop indrukt.

### Learnings

- **Een lijst-guard bewaakt zijn lijst, niet de klasse.** Dit is dezelfde les als bij de
  contrastsweep (Sessie 228) en de ligaturen (Sessie 229), nu in een securitycontext.
- **`git ls-files` ziet geen ongestagede bestanden.** Een guard die daarop leest, moet ná
  `git add` draaien — anders meet je de vorige toestand.
- **`Disallow` is geen toegangscontrole.** Het is een verzoek aan crawlers, geen 404.

---

## Sessie 230: Het nieuwsbriefblok viel buiten de filterpopulatie — en rekte via één grid-track alle 15 kaarten op (21 aug 2026)

**Mission:** een melding met screenshot — `/blog/#gevorderden` toont bovenaan het
inschrijfformulier en geen enkel artikel. Opdracht: analyseren en perfectioneren.

### Diagnose

Het categoriefilter is CSS-only via `:target` en verbergt **uitsluitend** `.blog-post-card`
(`blog.css` groep 1). Het nieuwsbriefblok staat als 4e kind ín `.blog-posts-grid` en draagt
géén `data-category`, dus het viel buiten die populatie en bleef in élke filterstand staan waar
het stond. De drie kaarten ervóór zijn `beginners`, `tools`, `tools`.

Gemeten op de live site, alle 7 standen — geen randgeval maar **4 van de 6 categorieën**:

```
#all          15 kaarten   kaart eerst
#beginners     4           kaart eerst
#tools         5           kaart eerst
#concepten     3           NIEUWSBRIEF eerst
#carriere      1           NIEUWSBRIEF eerst
#bronnen       1           NIEUWSBRIEF eerst
#gevorderden   1           NIEUWSBRIEF eerst
```

`beginners` en `tools` waren toevallig goed omdat hun eerste match vóór het blok valt. Dat is
precies waarom één screenshot dit niet vertelt en zeven metingen wel.

### Werk

**(a) De volgorde.** Groep 4 in het `:target`-blok: `order: 1` zodra er gefilterd wordt.
Klasse-gebaseerd op `.category-target` in plaats van zes id-selectors erbij — groep 1 t/m 3
móéten enumereren (er is geen selector die `[data-category]` aan een target-id koppelt), deze
niet. De ⚠️-comment erboven zei "ALLE DRIE DE GROEPEN" en zegt nu expliciet dat groep 4 zichzelf
bijhoudt, anders plakt de volgende sessie er onnodig een 7e selector bij.

Ongefilterd blijft het blok op index 3 staan. Dat is geen luiheid maar een gemeten
conversiekeuze: het blok staat nu op y=1871, de gridbodem op y=7329 — "gewoon onderaan" is
**5458px dieper** op een pagina van 7361px.

**Prijs, bewust betaald en als commentaar bij de regel vastgelegd:** in de zes gefilterde
standen wijkt de DOM-volgorde af van de visuele. Een toetsenbordgebruiker tabt eerst door het
formulier en daarna naar het artikel dat erbóven staat. De node in JS verplaatsen zou dat óók
repareren, maar breekt de belofte in `blog-filter.js:12` dat er functioneel niets verandert als
het script wegvalt — en beide volgordes zijn betekenisbehoudend: het zijn twee losse blokken,
geen omgedraaide leesvolgorde bínnen één component.

**(b) Eén grid-item rekte alle 15 kaarten op.** `blog.css` zette `width: 280px` op de
Brevo-input — twee keer zelfs, in twee near-duplicate blokken. De mobiele tegenregel
`.newsletter-form input[type="email"] { width: 100% }` is (0,2,1) tegen (0,3,1) en verloor; een
media query voegt geen specificiteit toe. Computed op 375px was dus gewoon 280px.

Gevolg zat niet op de input maar op de héle lijst: 280px gaf het blok een **min-content van
400px**, en het was het enige grid-item boven 360px (alle 15 kaarten zitten eronder).
`.blog-posts-grid` heeft één impliciete `auto`-track, dus het breedste item sleept de rest mee:
**alle 15 kaarten renderden 400px breed in een container van 336px**, en
`main.blog-container { overflow-x: hidden }` knipte die 64px onzichtbaar weg. Daarom heeft
niemand het ooit gemeld.

De 280px staat nu in `@media (min-width: 769px)` — elkaar uitsluitende ranges in plaats van een
cascade-gevecht (`css-layout.md` §4).

```
@375px   input 308 -> 244    min-content 400 -> 232    track 400 -> 336
         kaartrand 412 -> 348  == containerrand 348      (nul clipping)
@1280px  input 316x48, knop 137, kaart 672               identiek aan vóór
```

**(c) De teller loog tegen schermlezers op de skip-link.** `blog-filter.js` behandelde élke hash
als categorie. `/blog/#main-content` — het doel van de skip-link, dus de eerste bediening die
een toetsenbordgebruiker tegenkomt — meldde "0 van 15 artikelen" in een `role="status"`-regio
terwijl CSS alle 15 kaarten toonde. Idem `#newsletter`, een id dat op deze pagina bestaat.
Valideert nu tegen de `.category-target`-ids die de pagina zélf declareert, dus een nieuwe
categorie is vanzelf geldig. Bijvangst: `aria-current` staat bij een onbekende hash nu op "Alle
posts", wat de visuele stand al deed.

### Guards

Drie nieuwe tests in `blog-navigation.spec.js`, elk met zelfbewakende tak. De mutanten vuren op
drie **verschillende** asserties, elk 1 failed / 10 passed — geen overlap:

| mutant | rood geworden test |
|---|---|
| `order: 1` weggehaald | geen filterstand begint met het nieuwsbriefblok |
| vaste inputbreedte terug | geen grid-item steekt buiten de container (@375px) |
| hash-validatie terug | een hash die geen categorie is, laat de teller met rust |

Opruiming: de bestaande tellertest hardcodeerde `15 artikelen`. Leidt het totaal nu uit de DOM
af, zodat blogpost #16 hem niet omgooit — de assertie toetst daarmee de formule in plaats van
het getal.

### Learnings

**1. Een geïnjecteerde `<style>` bewijst niets over de cascade — en dat kostte bijna een dode
fix.** Mijn eerste plaatsing van de `order`-regel stond in het bestand **vóór** een tweede
`width: 280px`-blok. Gelijke specificiteit, latere bronvolgorde wint, dus die regel had gewonnen
en mijn fix was dood geweest. Het live-experiment zei "werkt" omdat een via `<style>`
geïnjecteerde regel per definitie als laatste komt. `css-layout.md` §13 waarschuwt hier al voor;
hij redde me niet omdat die §13 over box-drawing-randen gaat en ik daar niet in las. Gevangen
door A/B te meten tegen een no-store server met verse loads.

**2. Een guard die groen blijft op een echte regressie is geen guard.** Mutant 1 (order weg) gaf
eerst `10 passed`. Oorzaak: de test deed `page.goto('/blog/')` en daarna `page.goto('/blog/#cat')`
in een lus — een URL die alleen in het fragment verschilt is een **same-document navigatie**,
dus er herlaadde niets en de meting werd onbetrouwbaar. Opgelost met een unieke query per stand,
wat óók representatiever is: zo komt een bezoeker via een gedeelde link binnen.

**3. Drie keer las iets als groen terwijl het dat niet was.** Alle drie dezelfde vorm — een
patroon dat niet kán vinden wat je zoekt:
- `10 passed` bij 11 chromium-tests: er dráaide er één niet, en mijn grep-patroon toonde geen
  `flaky`, dus het las als volledig groen.
- Mijn eigen mutant-runner eiste een positief eindblok (goed) maar zocht `^\s+[0-9]+ passed`
  terwijl er ANSI-escapes vóór het cijfer staan — hij meldde "GEEN EINDBLOK" op een run die
  gewoon 11/11 groen was.
- `grep -rn "geïnjecteerde <style>"` gaf nul treffers in `.claude/rules/`, waaruit ik bijna
  concludeerde dat de les nog niet gedocumenteerd was. Er staat `geïnjecteerde \`<style>\``, met
  backtick. Nul treffers betekende "verkeerd patroon", niet "staat er niet".

**4. De suite draait standaard tegen productie.** `playwright.config.js` zet
`baseURL: process.env.BASE_URL || 'https://hacksimulator.nl'`. Mijn eerste run gaf drie rode
tests die de bug in **productie** correct maten, niet een fout in mijn werkkopie. Voor
pre-deploy-verificatie hoort er dus `BASE_URL=http://localhost:8899` voor; na de deploy is
dezelfde suite meteen een echte productiegate.

**5. "Blog telt toch niet mee voor het budget" was een aanname met 15,38 KB marge eronder.**
Ik voegde ~2,5 KB CSS-commentaar toe terwijl `performance.spec.js` op 1104,62 / 1120 KB stond.
Gemeten in plaats van aangenomen: `styles/blog.css` en `src/ui/blog-filter.js` vallen in de
**Blog-pijler (budgetloos)** — totaal onveranderd, delta **0,00 KB**. De uitsluiting uit Sessie
227 dekt blog.css, niet alleen blogafbeeldingen. Goede uitkomst, maar de check was het punt.

### Nasleep: de rotatieformule in `/summary` verwijderd i.p.v. gecorrigeerd

De `/summary`-skill schreef *"archiveer [N-10 .. N-6]"*. Dat gaf bij deze rotatie 220-224,
wat 215-219 als ouder blok in `current.md` zou laten staan én een gat in de archiefreeks maakt.
`SESSIONS.md` legt exact dezelfde correctie al vast bij **Sessie 215** — toen stond de foute
notitie in `CLAUDE.md` en gaf hij 205-209 waar de README-regel 200-204 geeft.

Dat is het interessante deel: de correctie werd toen vastgelegd, maar de **formule verhuisde
mee** naar een ander document in plaats van te verdwijnen. Een kopie van een regel verjaart, de
eigenaar niet. De skill draagt daarom nu geen rekensom meer maar een verwijzing naar
`docs/sessions/README.md` §Rotatie-regel, plus de falsificatietabel die uitlegt waaróm er geen
getal meer staat.

Bij het schrijven van die fix maakte ik prompt dezelfde fout: mijn eerste versie zette drie
operationele punten in de skill, waarvan er **twee al woordelijk in de README stonden** (de
index-stap en de Python-occurrence-asserts). Alleen "neem het learnings-blok mee met zijn entry"
ontbrak daar — dus dat punt is toegevoegd bij de eigenaar, en de skill is teruggetrimd tot
verwijzing + historie.

Eén claim in die tekst is gemeten en niet aangenomen: `validate-docs.sh` noemt `SESSIONS.md`
nergens (0 treffers), dus een overgeslagen index-stap meldt zich inderdaad niet vanzelf — dat is
precies hoe hij bij Sessie 225 tien sessies lang onopgemerkt bleef.

### Commits

- `e55f21e` — Het nieuwsbriefblok viel buiten de filterpopulatie en rekte alle 15 kaarten op
- `11c89f0` — Sessie 230 /summary: het filter bewaakte een klasse waar het blok niet in zat

### Metrics delta

| | vóór | ná |
|---|---|---|
| E2E-bundel | 1104,62 KB | **1104,62 KB** (delta 0,00 — blog-pijler is budgetloos) |
| Blog-pijler (budgetloos) | — | 55,56 KB (`blog.css` 46,33) |
| `styles/blog.css` | 44.845 B | 47.437 B (+2,53 KB commentaar) |
| `src/ui/blog-filter.js` | 2.259 B | 3.023 B (+0,75 KB) |
| Playwright | 45 specs / 316 decl | **45 specs / 319 decl** |
| Cache-versies | `blog.css?v=229`, `blog-filter.js?v=1` | `?v=230`, `?v=2` |

Verificatie: `blog-navigation` 3 motoren **33 passed tegen productie** (lokaal 32 passed /
1 flaky), `validate-docs --deep` 18/18, `validate-blogs` 16/16, aangrenzende blogspecs 34 passed,
`performance.spec.js` 7/7. De lokale flaky is de bestaande test op regel 120 (firefox) en faalt
op **navigeren** — wachten op `sibforms.com` onder parallelle belasting, geen assertie; 3× los
herhaald alle drie groen in ~7s.

### Next steps

- Geen open punten uit deze sessie. #74 (minify-trigger) blijft uit: de marge is nog 15,38 KB
  en de groei van deze sessie viel buiten het budget.

---
