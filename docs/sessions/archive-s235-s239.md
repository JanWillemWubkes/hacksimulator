# Sessie-archief 235-239 - HackSimulator.nl

**Geroteerd uit `current.md` bij Sessie 250** (steady-state `N % 5`-rotatie, zie
`docs/sessions/README.md` §Rotatie-regel; de rotatie bij 245 sloeg dit blok over). Nieuwste-eerst
binnen dit blok. Twee entries: Sessie 236-238 zijn samengevat in de entry van 239 (de teller werd
bij de eerste `/summary` op de branch op 239 gezet). Geen losse learnings-blokken.

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
