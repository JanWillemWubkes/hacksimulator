# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

---

## Sessie 247: Wat de bezoeker ziet als hij niets doet, is het ontwerp (1-2 okt 2026)

**Branch:** `design/impeccable`. `main` onaangeroerd; niets staat live.

**Mission:** TASKS #89, `bolder` (+ `overdrive` voor het signatuurmoment) op de landingspagina.
De eigenaar na de ship van sessie 246: "strak, maar oogt niet uniek". Richting kiezen na proeven
op gelijke maat, pas bouwen na zijn go.

### Skill eerst, dan de diagnose toetsen

Eerste tool-call: de skill, dan `impeccable context --target index.html`, dan `bolder.md`,
`overdrive.md`, `animate.md`; `craft-floor.md` vlak vóór de eerste edit. De diagnose van de
eigenaar gemeten in plaats van overgenomen:

- **"Het moment zit achter een klik": half waar.** De auto-demo opende met nmap, en
  `zetDiagram` riep `lichtOp(poorten)` ook bij `oplichten: false` aan. De poorten flitsten dus
  450ms bij laden, terwijl het oog op de kop stond; het hele moment kwam pas na **14,9s** terug.
  Op 375 stond het diagram op y=1102 bij een vouw van 812: daar nooit gezien.
- **"De schaal is braaf": waar.** h1 64,8px = 1,26x de sectiekop; het zwaarste vlak was de terminal.
- **"Het rood is een knop": waar.** 1,07% van de viewport op 1440.

### Proeven (gelijke maat, licht en donker, 1440 en 375)

Proef-CSS via `addStyleTag` (bewijst niets over de cascade, mocht ook niet: het was een proef).
Samengesteld in een tijdelijke HTML-pagina, want er is geen `magick`.

| | 1440 `.af-net` (≤900) | 1280 (≤800) | rood |
|---|---|---|---|
| nu | 788 | 770 | 1,07% |
| A kop 12 kolommen | 883 | 856 | 1,07% |
| B rood vlak | 788 | 770 | 3% / 12-14% op smal |
| C scan + diagram | 815 | 797 | 1,07% |
| A+C 6,2vw | 897 | 871 | 1,07% |

Keuze A+C plus slot op inkt/sample op papier; B las op 1440 als een grotere knop en werd op smal
opdringerig. Eigenaar: go.

### De bouw (`e8970b9`)

- `--af-affiche: clamp(2.2rem, 6.2vw, 4.9rem)`. Eerst 6rem als plafond: op 1920 drie regels,
  want het raster stopt op 1400px en de viewport groeit door. Het plafond hoort bij de
  rasterbreedte.
- Vanaf 1280 de actie als blok op de rij van de ondertitel. De ondertitel zakte 25px: de
  `align-items: end` van het kopblok, en het actieblok was hoger. `align-self: start`.
- Diagram op schaal; slot op inkt (actie inverteert naar papier), sample op papier.
- De scan: rijen staan meteen in de DOM, alleen het beeld wacht (`clip-path` per regel, 90ms).
  Eén test las `.is-open` direct na een klik, dus de toestand bleef meteen waar en alleen de
  poort wachtte visueel (`af-poort-wacht`). Eerste film: 400ms zwarte module, want prompt en kop
  vielen boven het ruststand-venster maar telden mee in de stagger. Nu tellen alleen zichtbare
  rijen, en de pijl gaat vóór de uitvoer.
- Filmen: pauzeren per frame verschoof alle volgende animaties. Eén verse load per frame.

### Gates en de eerste fout

- **Gate 1: 838 passed, 3 failed**, één test in drie motoren: poortlabel zonder 4px lucht op
  320-336 en 1024-1184. Mijn eigen meting keek naar drie breedtes; de 8px-guard van sessie 243
  ving het. Fix: de poortrij is een container en de letter rekent tegen de sleuf. De gate zelf
  was de mutant.
- **Gate 2: 840 passed, 1 flaky**: eyebrow-contrast op `/sample-juridisch.html` in WebKit, een
  goto-time-out op de externe sibforms-stylesheet. Die pagina laadt geen enkel gewijzigd
  bestand; los 5/5.

### Finish review (`e821992`)

Reviewer vers: `fix`, vijf punten, elk nagemeten:
- **Ruststand**: klopte. De lus toonde na 3,2s `ls`, en 53/80/443 stonden gevuld zonder hun
  regels, 12 van elke 15,2s. Geen lus meer: het nmap-frame is de ruststand.
- **Banner**: half. Hij komt op 2,57s, na de laadreeks van 1,1s. Geen replay.
- **Overname**: de poorten klopten (`rustDiagram`); de uitnodiging verdwijnt bewust (`is-taken`).
- **Eyebrow**: het mono-pad stond boven de bloglinktitel. Nu eronder, tikdoel heel.
- **DESIGN.md**: documenter, zonder browser omdat de gate liep; steekproef 18 bron + 9 gerenderd.
Verdict: 1-4 resolved, daarna 5; **ship**, op de gescoorde fixes. **Gate 3: 847 passed, 17
skipped, 0 failed, 0 flaky.**

### Eigen meetfouten, gevangen door zelfbewakende takken

- `getAnimations()` na `goto` was flaky: `goto` wacht op `load`, de reeks kan dan al voorbij zijn.
  Nu `animationstart` gelogd vanaf de eerste byte.
- Een observer op `DOMContentLoaded` miste de demo: modules draaien eerder. En vanaf de eerste
  byte zag hij de statische no-JS-rijen die de parser invoegt; filter op `readyState`.
- `elementFromPoint` buiten het venster geeft `null`.
- Een mutant (`flex-direction: row`) landde maar veranderde niets door `flex-wrap`.
- De reduced-motion-guard keek alleen naar het laadpad, waar `lichtOp` onder reduce nooit loopt.

### Learnings

- **Wat de bezoeker ziet als hij niets doet, is het ontwerp.** Het moment bestond al, maar
  speelde waar niemand keek, en de lus maakte de ruststand 80% van de tijd tot een
  tegenspraak. Ontwerp de ruststand, niet alleen de demo.
- **Een guard die een pixelregel vervangt door de bedoeling, heeft een tak nodig die de oude
  conditie bewaakt.** De replay-guard op 1280 faalt als de poorten weer boven de vouw komen, zodat
  1280 dan terug kan in "De vouw".
- **Een schaalwijziging meet je per breedte, niet op drie maten.** De bestaande sweep per 8px
  ving wat ik miste.
- **Bolder versterkt de compositie, het verandert haar niet.** Stilstaand is het dezelfde
  indeling; de eigenaar bedoelde ook indeling, ritme en onderscheid. Dat is `layout` (#90);
  `layout.md` is in dit traject nooit geladen.

### Commits

- `e8970b9` Bolder: het affiche op schaal, en de scan die zichzelf speelt
- `e821992` Finish review bolder: de ruststand is de scan, en DESIGN.md uit de bouw

### Metrics delta

- Runtime 1082,35 → **1089,83 / 1120 KB** (marge 30,17).
- `test()`-declaraties 374 → **381** (47 specs).
- Bundle (du -sb/1024): src 741 → 745, styles 416 → 429, blog 491 → 492, assets 1762 → 1741.
- `.playwright-mcp/` 5,9 MB opgeruimd na deze entry.

### Next steps

- **#90 `layout`** op de landingspagina (indeling, ritme, onderscheid), met de ceiling-punten
  van de reviewer als input; concludeert layout dat de wereld het probleem is: voorleggen, dan
  pas `new-work`. Daarna #85 (gedeelde laag), dan #84 (merge).

---

## Sessie 246: Een review controleert het contract, niet de ambitie (29 sep - 1 okt 2026)

**Branch:** `design/impeccable`. `main` onaangeroerd; niets staat live.

**Mission:** sessie 3 van het impeccable-traject (TASKS #83): verse reviewbeelden,
`impeccable-finish-reviewer` vers en zonder historie, elke bevinding nameten vóór er iets gebouwd
wordt, daarna `impeccable-documenter` voor DESIGN.md en `.impeccable/design.json`.

### Skill eerst

Het eerste wat er gebeurde was de skill laden en `impeccable context --target index.html` draaien
(les uit sessie 245). Gelezen: `new-work.md` §7 (de finish-handoff), `document.md`,
`degraded/finish-reviewer.md` (alleen voor het inputcontract; de agentdefinitie lees je niet).

### De beelden: twee keer ongeldig voordat ze geldig waren

- De reviewbeelden in `.impeccable/review/` waren van 24 sep, van vóór 240-245. Opnieuw gemaakt.
- **Eerste set ongeldig.** De consentbanner is `fixed` en stond in de full-page-opname op y≈860,
  midden tussen hero en Herkenbaar: een reviewer leest dat als een element in de layout. Mobiel
  375×8143 werd voor de beeldlezer 92px breed.
- **Tweede set ook nog fout op mobiel.** De banner verschijnt pas ná het klikken op "Weigeren"
  (vertraagd), dus de klik raakte niets. Nu: wachten op `#cookie-decline`, de fold mét banner
  vastleggen, dan weigeren en full-page maken.
- Eindset: full-page zonder banner, folds mét banner, mobiel in stukken van 1200px, en (voor de
  verdict pass) aparte focus- en hoverbeelden, want een stilstaand beeld toont geen focus.

### De review: fix, acht punten, zes hielden stand

Detector één keer tegen de URL (`--no-design-system`, want DESIGN.md beschreef nog de oude
wereld): alleen bekende klassen (h1-contrast via analytic-gradient voor de vierde keer, dichte
FAQ-antwoorden als "hidden at rest", cramped-padding op FAQ-rijen).

Reviewer: TYPE, MATERIAL, GROUND **match**; **disposition fix**. Nagemeten:
- **Focus terminalveld (open punt 245).** Niet "0 pixels" zoals 245 noteerde: bij focus kwamen
  twee rode zijstrepen van 4px, **308 px** (licht) / 225 (donker), tegen ~3300 die WCAG 2.4.13
  vraagt. De reviewer noemde de regel "dood": ook fout. Wel terecht op andere gronden.
- **Consentbanner:** licht `#fff` + blauw `#074fa4`, donker `#161b22`. Houdt stand.
- **Chip-balk van 6px:** verdween bij hover in de geïnverteerde chip. Houdt stand.
- **Herkenbaar op mobiel:** 4 regels breken op 320-414 naar kolom 0. Houdt stand.
- **`[♥]`:** glyph als icoon. Houdt stand.
- **CTA:** 20,7px (1440) / 21,4 (1280) boven de basislijn van kopregel 2. Houdt stand.
- **h1 uit het raster op mobiel:** op 1440 lopen de lijnen óók door de h1, en het commentaar zegt
  "de kop op afficheschaal mag over het raster staan". Valt om.
- **FAQ `layout-transition`:** berekend `transition: none`. Valt om.
- **Eigen pass:** onder 769 **164px** tussen nieuwsbriefveld en knop. `flex: 1 1 220px` uit 245
  wordt in de flexkolom van `main.css` de hoogte. De guard van 245 eiste alleen dTop < −20.

### Ronde 1 (`d1d42d4`)

- Ring om de invoerregel. Een pixelguard per zijde ving dat de **bovenzijde** ontbrak: het lichaam
  erboven is `position: relative` (scrollTop) en schildert over de outline van een statische broer.
  De invoerregel is nu zelf gepositioneerd (enige absolute kind: het sr-only-label).
- Banner papier/inkt, knoppen die inverteren, weigeren even zwaar als accepteren.
- Chip: proef C0/C1, C1 (index inverteert). Kolom houdt 1.8em, command 0px verschoven.
- Herkenbaar: proef H0/H1/H2, H2 (hangende inspringing 2em, glos op eigen regel). Eerst in `em`
  (2,8em), maar Chromium rondt de tekenbreedte af op 8px (Firefox 7,68, WebKit gemengd): 2,6px
  naast "inet". Nu een `::before` met dezelfde acht spaties: exact in elke engine.
- CTA: `margin-bottom: calc(var(--af-display) * 0.165)` (0,162-0,168 gemeten over 1280-1920).
- Nieuwsbrief: `flex: none` tot 768, dezelfde grens als `main.css` (§4). Gat 25,6px.
- Footer: glyph weg; `footer.js` v5, `init-components.js` v7 (27 pagina's), dode regel uit
  `main.css` (v240). 108 pagina-configuraties, 1132 footerelementen: 0 verschillen buiten de knop.
- Guard "Finish review (sessie 246)", 72 passed in drie motoren. Acht mutanten, elk op een eigen
  assertie, eerst gecontroleerd dat ze geserveerd werden.
- Gate: 849 passed, 17 skipped, **1 failed**: `blog-theme-toggle` "all blog pages" over 30s. Los
  15,1s, gelijk aan HEAD (15,0). Budget per pagina; daarna 36/36.

### Verdict en documenter (`ab4e2ac`)

- Verdict pass: 1-6 resolved, 7-8 ingetrokken, geen regressies: **ship**, op de gescoorde fixes.
- Documenter: DESIGN.md + sidecar opnieuw, oude wereld volledig vervangen. Steekproef: 18 waarden
  tegen de CSS-regel, 5 gerenderd: allemaal gelijk.
- De documenter vond een fout in de bron: "papieren letter op rood 5,02" in het contract. De knop
  draagt sinds de bouw (`a8bf4fa`) wit, **5,79**. Gerepareerd in het contract.
- Herkomst van rasters gemeten: index laadt er twee van vóór het traject; de bouw maakte er geen.
  `embed-prompt --scan assets`: 26/26 zonder herkomst, allemaal bestaand. Niet ingebed.

### Kleine ronde (`e02a89a`)

"Verder lezen op de blog" in vette mono en "In gewoon Nederlands" in 600 leken twee punten. Op
functie bekeken één: twee koppen boven een kolom op dezelfde naad, twee vormen. Atkinson is
variabel (200-800), dus 600 was echt, geen synthese. Proef P0-P2: **P1** (Atkinson 700, gedempte
inkt); in inkt concurreerde de kop met wat hij aankondigt. Guard: geen kop in mono over élk h1-h6
en élk doel van `aria-labelledby`. Twee mutanten, elk een eigen assertie.
Gate 2: 855 passed, 17 skipped, 0 failed, **1 flaky** (Polish-focustest, los 13,2s, in de gate
over 30s: 47 min, met de eigenaar in de browser). Budget per element; daarna 9/9.

### Learnings

- **Een review controleert het contract, niet de ambitie.** Ship op de fixes, en toch: "strak,
  maar oogt niet uniek". Het contract was ingetoomd (koppen klein voor de vouw, alles getoetst
  tegen "te intimiderend"). De ceiling-punten zijn met eerdere besluiten afgedaan; een eerder
  besluit bewijst niet dat het goed was voor een ander doel.
- **Een guard die de bedoeling toetst, laat het gevolg door.** "Gestapeld" (dTop < −20) was waar
  bij 164px gat. Toets de relatie (veld→knop ≤ reserve), niet de vorm.
- **Een populatietest met een vast budget wordt flaky onder last.** Twee keer deze sessie, na één
  keer in 245. Het patroon is nu: budget × populatie.
- **De reviewer heeft geen browser.** Toestanden (focus, hover) en lange mobiele pagina's moeten
  als eigen beelden mee, anders kan hij ze niet beoordelen.
- **`flex-basis` is de maat op de hoofdas.** Bij een omslag naar kolom wordt "breed" "hoog".

### Commits

- `d1d42d4` Finish review ronde 1: de ring om de invoerregel, en de banner in het affiche
- `ab4e2ac` Finish review vastgelegd: DESIGN.md opnieuw uit het affiche
- `e02a89a` Kolomkoppen op de naad: één vorm, en geen kop in mono

### Metrics delta

- Runtime 1078,18 → **1082,35 / 1120 KB** (marge 37,65).
- `test()`-declaraties 366 → **374** (47 specs).
- `.playwright-mcp/` opgeruimd na deze entry (zie Step 7).

### Next steps

- **Besluit eigenaar (1 okt):** eerst `bolder` (+ `overdrive`) op de landingspagina (TASKS #89),
  dan de gedeelde laag sitebreed (#85), dan de merge (#84). Startprompt gegeven.
- Open: `code` erft 4px radius uit `main.css` (onzichtbaar), bij #85.

---

## Sessie 245: Een skill die je niet laadt, draait niet — polish met een eigen pass (29 sep 2026)

**Branch:** `design/impeccable`. `main` onaangeroerd; niets staat live.

**Mission:** `impeccable polish` op de landingspagina, met zes designpunten van Heisenberg
(screenshots): nieuwsbriefveld en knop niet uitgelijnd, dubbele onderstreping op de koffielink,
bloglink-hover zonder zijlucht, de laatste FAQ-lijn, de negen samplepagina's "passen niet", het
logo wordt groen op hover, en de noot "Ook de code erachter…" staat vreemd. Elk punt eerst meten,
smaakkeuzes via een proef op gelijke maat, bouw na go.

### De fout aan het begin

Ik mat alleen zijn punten en legde een plan voor. Heisenberg: "welke polish punten heb je zelf
gevonden?" Antwoord: alleen bijvangst. De skill `impeccable` was niet geladen, dus de eigen pass uit
`reference/polish.md` (staten per element, raster, typografie per rol, console) had niet gedraaid.
Pas daarna geladen: 63 bedieningselementen × 2 thema's in rust/hover/focus, tekstranden tegen de 13
rasterlijnen, typografie per rol, visuele ronde op 1440/375. Die vond vier fouten die hij niet had
genoemd. De volgende startprompt dwingt het laden af.

### Inventaris (plan: `~/.claude/plans/pasted-content-id-3cdc-ga-verder-linear-puffin.md`)

- **Schoon bij meting:** 0 consolefouten, één maat per rol (h2 47,52 overal), op 1440 alleen de
  slot-microcopy naast het raster (bewust naast de knop), geen overloop op 320-414. Hovertaal
  consistent: een blok inverteert, een tekstlink dikt 1 → 2px.
- **"Dubbele underline op veel links"** viel bij meting weg: 3 van 43 links hadden een tweede lijn,
  de rest dikt alleen. Heisenberg bevestigde dat hij de rode lijn op de koffielink bedoelde.
- **Eigen bevindingen:** schakelaar met een blauwe focusring (`--color-info`) naast 60 rode;
  GitHub-icoon zonder zichtbare hover (alleen `text-decoration`); woordmerk onderstreept in rust;
  e-mailveld met `outline: none`; "naam)" alleen op de laatste regel van de cijfertabel; de
  miniaturen 23-34px breed op telefoon.
- **Gemeten, niet opgelost:** het terminalveld verandert bij focus 0 pixels (alleen de caret).

### Ronde 1 — één hovertaal, en de nieuwsbrief op zijn rij (`c107aa2`)

- Woordmerk: `main.css:1429` `.nav-brand:hover span` kleurde de klasseloze naam-span lime;
  `affiche.css` herstelde alleen `.brand-icon`/`.brand-accent`.
- Koffielink: `main.css:2184` zette `border-bottom-color: var(--color-cta-primary)` = het
  signaalrood, onder onze onderstreping (pixels: band van 3px, rode onderrij). Footerknop en
  skiplink: onderstreping in hun kader. Nu: de knop inverteert, de links zijn gewone tekstlinks.
- Nieuwsbrief, drie lagen diep:
  - 1,59px scheef: `main.css` reserveert onder de wrapper én de knop `1.6em` voor een foutmelding,
    onder een letter van 16 (25,6) en 18px (28,8); de rij centreerde. Nu `flex-start` vanaf 1024.
  - `body.home .af-news .sib-input { flex: 1 1 260px }` (0,3,1) verloor op **elke** breedte van
    `.homepage-newsletter .newsletter-form .sib-input.sib-form-block { flex: 0 1 auto }` (0,4,0).
    Het veld had zijn eigen 247px; op 768-1032 brak de knop onder een veld met `border-right: 0`.
    Gezien pas na de fix: de nameting op 1024 brak nog steeds.
  - De 2px-rand kwam van `border: 2px … !important` in `main.css`. Brevo's regel (0,2,0) verliest
    ook zonder; geen inline styles. `!important` weg (enige wijziging in een gedeeld bestand): op
    sample-pentest, sample-juridisch en /blog/, 1440/375, beide thema's, rand + focus 24/24 identiek.
  - Ook `.sib-form { max-width: 540px }` hield het formulier 4-17px vóór de rand vanaf 1384.
  - Resultaat: vanaf 1024 één rij tot de rasterrand, daaronder gestapeld; 201 breedtes 320-1920.
- Bloglinks `padding: 10px 8px; margin-inline: -8px`. Schakelaar en e-mailveld: de rode ring.
  GitHub-icoon: inversie. Cijfertabel: `text-wrap: pretty` (laatste regel 49 → 74px).
- Voor/na tegen `git archive HEAD` op een tweede no-store server (8902).
- Guard "Polish (sessie 245)", acht tests; zeven mutanten, elk op een eigen assertie.
  `main.css ?v=239`, `affiche.css ?v=21`.

### Ronde 2 — de noot bij de belofte, de sample toont wat erin staat (`0f1bfa9`)

- Proef N0-N3 (`s245-proef-noot-*.png`): N3, de GitHub-zin in de inleiding bij "zelf nakijken".
- Proef F0/F1: laatste FAQ-lijn blijft ≥1024 (kantlijn eindigt op dezelfde y, 4180,5), weg eronder
  (twee haarlijnen 40px onder elkaar).
- Proef S0-S3 (1440/1024/375): S2, inhoudstabel in de grammatica van de cijfertabel. pdftotext liet
  zien dat de negen pagina's omslag, "over dit sample", twee vervolgpagina's, slot en verkooppagina
  bevatten; inhoud is p. 3-7. S1 (rechterblok op de onderlijn, voorstel eigenaar) zette de knop
  110px los van zijn zin; S3 bracht het lege vlak terug. Animatie bewust niet. Negen WebP's weg.
- Heisenberg vroeg of de hover-onderstreping op het logo bewust was: dat was mijn keuze uit ronde 1,
  en ze botste met "een woordmerk is geen actie" (sessie 236). Nu beide woordmerken zonder hover.
- Eerste gate van ronde 2: 1 faler, ook in de herkansing — "geen pagina scrolt zacht" (sessie 244)
  in Firefox, time-out op `load` van een blogpagina. Los 3/3 groen; per pagina gemeten 15s voor 30
  pagina's, traagste 1,5s, geen uitschieter. Het budget was vast 30s voor een populatie die groeit:
  nu `PAGINAS.length * 5000`. Geen mutant (zonder fix slaagt hij meestal); zo in de commit gezet.
- Guards: "De sample toont wat erin staat" (zin = pdf, verwijzingen binnen de pdf en oplopend,
  geen miniaturen, op de knoprij, binnen de naad) + drie in het Polish-blok; elf mutanten.

### Twee gates die de regel bevestigden

- De eerste gate van ronde 1 liep op 13 tests/min terwijl ik in de MCP-browser proeven maakte:
  825 tests zouden 63 min kosten tegen een deadline van 50. Gestopt na 11 min, opnieuw met 90 min
  en zonder parallel browserwerk: 33,4 min. De twee `blog-theme-toggle`-falers uit de eerste run
  ("Tearing down context exceeded") kwamen in de schone run niet terug.

### Learnings

- **Een skill die je niet laadt, draait niet.** Zes punten van de eigenaar zijn input, geen scope.
  Laad de skill vóór het eerste meten; de startprompt dwingt dat nu af.
- **Een gescopete declaratie kan al sessies dood zijn.** De `flex` van de wrapper verloor van een
  (0,4,0)-regel op elke breedte; de pagina "werkte" omdat de kolom op 1440 breed genoeg was. Meet
  na een fix de computed waarde van elke eigenschap die je zette. Rule: `css-layout.md` §30.
- **Een clip-screenshot verloor de hovertoestand** (`:hover` stond op true); meet hover in een
  full-viewport-screenshot. En in WebKit (`deviceScaleFactor` 2) moet een pixelteller CSS-px
  omrekenen; de positieve controle ving dat. Rule: `meten-en-guards.md` §32.
- **Een guard die met zijn populatie groeit, krijgt een budget dat meegroeit.** Rule: §32.
- **Parallel browserwerk tijdens een gate vertraagt hem ~2,5×** en gaf teardown-time-outs.

### Next steps

TASKS #83: `impeccable-finish-reviewer` + `impeccable-documenter` (sessie 3 van het traject), met
het open punt: het terminalveld toont focus alleen via de caret. Daarna merge (sessie 4).

### Metrics delta

- Runtime-bundel: **1074,57 → 1078,18 KB**, marge **41,82 KB (3,7%)**.
- Playwright: 47 spec files, **357 → 366** `test()`-declaraties.
- `du -sb`: src 741 → 742 (759.527 B), styles 416 → 420 (430.282 B), blog 492 (503.564 B),
  assets 1762 → 1741 KB (1.783.137 B; −21.966 B WebP).
- Gates: **808 passed / 17 skipped** (ronde 1, met blog-theme-toggle + paginalijst-dekking) en
  **784 passed / 17 skipped** (ronde 2), 0 failed; skips = 13 motorgebonden + 4 CLS buiten Chromium.
- Mutanten: 7 + 7 + 4, elk op een eigen assertie.

---

## Sessie 244: Een guard die "woordelijk gelijk" heet, vergeleek alleen de helft — audit en NL-review (28-29 sep 2026)

**Branch:** `design/impeccable`. `main` onaangeroerd; niets staat live.

**Mission:** de twee open stappen uit TASKS #82 vóór polish: `impeccable audit` tegen
`http://127.0.0.1:8901/` (toegankelijkheid, performance, responsive, beide thema's via de echte
schakelaar) en de eerste `nl-content-reviewer`-ronde van het traject. Beide leveren beweringen op;
elk punt nagemeten vóór het voorgelegd werd, bouw pas na go.

### Inventaris (plan: `~/.claude/plans/pasted-content-id-69fb-ga-verder-ancient-quiche.md`)

- **Score na meting 16/20.** Toegankelijkheid 2 (vier AA-fouten, alle in de gedeelde FAQ),
  performance 3, responsive 3, theming 4, integriteit 4.
- **Vervallen bij meting:** alle 12 detectormeldingen. De h1 "1,1:1 via analytic-gradient" voor de
  derde keer vals (`text-contrast` + `eyebrow-contrast` 120 passed); `cramped-padding` ×10 waren
  dichte antwoorden van 0px en terminalregels; `layout-transition` was een main.css-regel die op
  home al `none` is. axe (via cdnjs in de pagina, niets geïnstalleerd): alleen
  `landmark-complementary-is-top-level`, best practice. 14 tikdoelen < 24px halen allemaal de
  afstandsuitzondering van 2.5.8 (dichtstbij ≥ 21,5px). NL: title/meta = SEO-besluit 210, "Lees
  eerst"-labels bewust ingekort (188), "pdf" klein is correct, "pentester"/"root" in de woordenlijst.
- **Mijn eigen meetfouten:** "1 Tab-stop in donker" (twee links "Start de simulator" leken één stop
  voor mijn herhaaldetectie); een "gekleurde pixels"-teller die ander rood meetelde (813 met én
  zonder focus); een focusmeting midden in een outline-transitie (1px, kleur halverwege).
- De NL-reviewer miste de skiplink "Skip naar inhoud"; die kwam uit de Tab-ronde.

### Ronde 1 — de FAQ met het toetsenbord (`22cfafc`)

- Vier fouten in één gedeeld component, op index, contact en terminal. Opgelost in `main.css` en
  `faq.js`, niet onder `body.home`: de fout zat in de gedeelde code.
- `.faq-item { overflow: hidden }` knipte de ring (2px offset) weg: 0 veranderde pixels op index en
  terminal, 3320 op contact (daar won `outline-offset: -2px`). De kinderen zijn transparant, dus
  er viel niets anders te knippen. 36 voor/na-beelden pixel-identiek, met een tak die bewijst dat
  de vergelijking toestanden wél ziet (open ≠ dicht, hover ≠ rust).
- Dicht antwoord nu `visibility: hidden` (3 links op index, 3 op contact waren Tab-stops).
- Plafond `max-height: 300px` weg: FAQ 1 −22px @320 (drie motoren), −85px bij 1.4.12-tekstafstand.
  De transitie was op alle drie de pagina's al `none`, dus `none` kost geen beweging.
- `faq.js` `this.blur()` weg: na Enter stond de focus op `<body>`; WebKit begon de volgende Tab bij
  "Skip naar inhoud". Het commentaar ("mobiel toetsenbord") klopte niet voor een `<button>`.
- Guard `faq-toetsenbord.spec.js` over `PAGINAS`; vier mutanten, vier asserties. `main.css ?v=238`.

### Ronde 2 — laden en beweging (`0c3acaf`)

- `navbar.js` vervangt `#navbar-placeholder` (`outerHTML`); zonder reserve zakte `<main>` 60px: CLS
  0,021-0,042 op 1440 en 0,070-0,078 op 375, op 12 van 13 gemeten pagina's. Terminal (navbar
  `fixed`) had 0. `landing.css` wordt door precies de 26 sticky-pagina's geladen en niet door
  terminal, dus de reserve staat daar. Prijs: 33px lucht boven het noscript-menu met JS uit.
- Aangrenzend: sample-download-cover zonder `width`/`height` (CLS 0,067 @375).
- `html { scroll-behavior: smooth }` gold ook onder reduce (ankersprong ~350ms over 2000px).
- Brevo-CSS niet verplaatst: Slow 4G + 4x CPU, vijf runs, mediaan FCP 2300 → 2244 (56ms), onder de
  vooraf gezette drempel van 100ms. De CSP staat geen inline `onload` toe.
- Guard `laden-en-beweging.spec.js`: CLS per pagina alleen in Chromium, met een positieve controle
  (een ingevoegd blok van 200px moet tellen); reduced motion over alle pagina's plus de ankersprong.
  **`test.use({ reducedMotion })` kwam stil niet aan**: terminal.html bleef `smooth` terwijl
  animations.css daar `auto` afdwingt. Nu `emulateMedia`, met een tak die `matchMedia` controleert.
  Drie mutanten, elk op zijn eigen tak. `landing.css ?v=240`.

### Ronde 3 — copy (`2228f84`)

- FAQ 8: schema miste "Lees ons privacybeleid voor alle details." De test heette "FAQPage-schema
  blijft woordelijk gelijk aan de zichtbare FAQ" en vergeleek alleen `q.name`. Nu ook antwoorden;
  eerst rood op precies FAQ 8, mutant vuurt op regel 320 (antwoorden), niet 318 (vragen).
- "command" i.p.v. "commando" (22 tegen 4, in FAQ 3 allebei in één alinea); cybersecuritytips en
  aria-label ook op /blog/; skiplink, terminaltitel, "Onze aanpak heet "80/20 realisme":",
  noscript-menu met Gidsen. De kop breekt op geen van 141 breedtes over de rand (chromium, webkit).
- TASKS #87 (terminalsimulator, 21 pagina's + zoekterm) en #88 (nav klapt in op `px`) erbij.

### Learnings

- **Een guard draagt een belofte in zijn naam; lees wat hij echt vergelijkt.** "Woordelijk gelijk"
  vergeleek de vragen. Rule: `meten-en-guards.md` §31.
- **Een fout in een gedeeld component hoort in het gedeelde bestand.** Onder `body.home` repareren
  had terminal en contact kapot gelaten; de nulmeting per pagina liet dat zien.
- **`overflow: hidden` op een container knipt de focusring van zijn kinderen**, en dat zie je alleen
  in pixels: `getComputedStyle` gaf keurig `2px solid`. Rule: `css-layout.md` §29.
- **Een reserve voor een geïnjecteerd element hoort bij het stylesheet dat de populatie al kent.**
  Bodyklasses scheidden blog en terminal niet; `landing.css` wel.
- **Een emulatie die niet aankomt, meet het standaardgedrag.** Alleen een pagina met een
  gegarandeerde uitkomst (terminal onder reduce) maakte het zichtbaar.
- **Een meter die altijd 0 kan geven, heeft een positieve controle nodig** (CLS: Firefox en WebKit
  kennen `layout-shift` niet).

### Next steps

TASKS #82: polish met de designpunten van Heisenberg (startprompt gegeven), dan #83 (finish review
+ documenter). Sitebreed op `main` na de merge: #86 (`ch` in WebKit), #87, #88.

### Metrics delta

- Runtime-bundel (`performance.spec.js`): **1073,18 → 1074,57 KB**, marge **45,43 KB (4,1%)**.
- Playwright: 45 → **47** spec files, **353 → 357** `test()`-declaraties.
- `du -sb`: src 742 → 741, styles 415 → 416, blog 491, assets 1763 → 1762 KB.
- Gates: **884 / 922 / 853 passed, 0 failed**; skips 13/23/17, elk verklaard (motorgebonden 13,
  CLS buiten Chromium 4, lead-magnet alleen tegen Netlify 6). validate-docs 20/20.
- Mutanten: 8 over drie guards, elk op een eigen assertie.
- CLS: 0,042/0,074 → 0 op elke landing.css-pagina.

---

## Sessie 243: Een attribuutselector is geen wortelselector — adapt, en de critique opnieuw gemeten (28 sep 2026)

**Branch:** `design/impeccable`. `main` onaangeroerd; niets staat live.

**Mission:** `adapt` voor de landingspagina uit TASKS #82: mobiel meescrollen na een chip-tik,
de focus daarna, de band 1024-1279, en uitzoeken wat "tokens" betekende. De critique van sessie
240 (buiten git, twee ombouwen oud) eerst punt voor punt nameten.

### Inventaris

- Gemeten op 360/375/390, 768, 1024, 1180, 1279, 1280 en landscape, beide thema's via de echte
  schakelaar. Verouderd: "chips op 766/768", "labels breken @1280" (in Chromium), "sticky 76px"
  (navbar 60px), de naad in de band (binnen 0,5px op kolomlijn 8 op 1024/1100/1180/1279).
- **Mijn eerste meting was vals:** een "sprong" van +188px na een tik bleek `html{scroll-behavior:
  smooth}`; ik las scrollY midden in de animatie. De sweep bevriest dat sindsdien.
- **"tokens" = critiquepunt P2 8** (zonder het Brevo-veld, dicht in 242): themaschakelaar en
  footer in kleuren van het oude GitHub-palet.

### Ronde 1 — een chip-tik (`26da24e`)

- Uitvoer tot **181px** buiten beeld na een tik, op elke breedte 360-1279, zodra je voorbij de
  terminaltop scrolde. De echte sprong kwam van `inputEl.focus()`: stond het veld boven de rand,
  dan trok de browser de pagina **391-611px** omhoog, en op touch opende elke tik het toetsenbord.
- Nu: focus blijft op de chip (`neemOver({ focus: false })`), Tab gaat naar de volgende; de pagina
  scrolt alleen omhoog en alleen het tekort; de chipnaam draagt ", gedaan" / ", volgende
  suggestie" (label-in-name).
- **De sweep vond een oude fout:** bij 120 regels haalt `trim()` de oudste weg, en de pagina
  schoof 192px, zonder `scrollBy`, ín de click-handler. Scroll-anchoring koos een uitvoerregel als
  anker. `overflow-anchor: none` op het terminallichaam (chromium en firefox; webkit kent het niet).
- **De gate ving mijn eigen fout:** `return rijen[0]` stond vóór `meld('heroDemoCommand')`, dus
  geen enkel command stuurde nog zijn event (3 falers, één test, drie motoren).
- Landscape: de module past niet (242-330px vrij, terminal 300). Uitvoer gaat voor; de chip mag
  onder de rand, een zichtbare balk dekt hem nooit half.

### Ronde 2 — tokens (`8ae459f`)

- `main.css` `[data-theme="light"] { …tokens… }` matchte ook `<span class="toggle-option"
  data-theme="light">`. Dat span zette alle lichte sitetokens op zichzelf en negeerde `body.home`:
  actieve pil `#c9d1d9` met `#1a1a1a` (licht), inactief `#a1a8b0` i.p.v. `--af-inkt-2` (donker).
  Gemeten via de keten: span `#a1a8b0`, button erboven `#b0b0ab`. Ook `landing.css` had zo'n blok.
  Beide op `:root`. **Voor/na over 522 metingen op 18 pagina's: alleen index.html veranderde.**
- Footer donker: `--color-bg-footer` werd alleen in `[data-theme="light"] .landing-footer` gelezen;
  in donker won `rgba(22,27,34,.5)`. De `#000` in `affiche.css` was dood, zijn commentaar een onware
  bewering. Nu leest `body.home .landing-footer` het token zelf.
- Guard over **alle** CSS-regels op alle pagina's (geen tokenregel raakt een optie met
  `data-theme`). Mutant `landing.css` kaal vuurde alléén daar: geen kleur verandert, dus alleen een
  klassebrede guard kan hem zien.
- **Gate rood in firefox 667x375:** de cookiebanner verscheen na een vertraging en lag in landscape
  over de chips; de tik raakte de banner. Mijn losse replay zag het eerst niet. Sweep tikt nu alleen
  waar `elementFromPoint` in de chip valt, wacht twee frames na `scrollTo` (Firefox hit-testte op de
  oude layout) en zet consent vooraf.

### Ronde 3 — tabletband en chips (`b079037`)

- Sweep per 16px vond wat de gevraagde maten misten: **768-928** brak de terminalkop over twee
  regels (losse `~`), **768-864** staken 3306/8080 uit hun sleuf. De oplossingen voor <768 (titel
  weg, poorten 2x6) gelden nu tot 1023.
- Chips: onder 430 brak `nmap 192.168.1.1` en de herkomst per chip verschillend (86/68). Proef
  P1-P3, **P2** (index boven het command): zes chips van 70px, alles op één regel 360-767.
- **WebKit, drie keer:** brak nmap op 1280-1296 (sessie 241 mat alleen Chromium), schatte de
  mobiele rij op 85 i.p.v. 68, en liet nmap op 1280 7px over de rand lopen. Oorzaak van dat laatste:
  `3ch` was in WebKit 31px (Chromium 27), want `--font-terminal` begint met de kadertekensubset en
  WebKit rekent `ch` op dat font. `nowrap` op het command, de indexkolom `1.8em`. Onder 352 mag
  het command weer breken: overlopen (-8px) is erger. Grens als assertie in twee richtingen.
- WebKit houdt de rijhoogte van het gebroken command vast als het venster over 352 groeit, tot een
  herlading. Alleen bij een 320px-telefoon die je kantelt; bewust niet opgelost, in het contract.

### Sample (`4cd303a`) en TASKS (`b6741fb`)

- Heisenberg: "er moet wel iets gebeuren, dit is niet mooi." Linksonder 779x72px leeg (1440),
  592x124 (1024). Proef A/B/C9/C4: **C9**, de negen pagina's van de sample zelf, verkleind, op de
  rasterrij van de knop. De productcover afgewezen (lime, afgerond, de oude wereld).
- Eerste versie vervormde de pagina's op 1024/768 (de rij rekte mee) en zette de knop op 1440 in
  het midden van zijn blok. `align-self: start` op beide. Mutant "zonder `align-items: flex-start`"
  bleef groen: die regel had geen functie meer, geschrapt.
- Gate rood op "lucht ≤ inhoud": de populatie was een taglijst zonder `img`, dus de pagina's telden
  als lucht (209 > 184). `img` toegevoegd.
- Heisenberg vroeg of het oorspronkelijke stappenplan klopte. Nagekeken: audit en polish nooit
  gedaan, de `nl-content-reviewer` nooit gedraaid. Ik had "volgende: sessie 3" gezegd; dat was fout.
  TASKS #82 kreeg twee open subitems vóór #83.

### Commits

- `26da24e` Adapt ronde 1: een chip-tik houdt de focus en haalt de uitvoer in beeld
- `8ae459f` Adapt ronde 2: thematokens op de wortel, de footer in het donker zwart
- `b079037` Adapt ronde 3: de tabletband en de chips, op elke breedte gemeten
- `4cd303a` Sample-sectie: de negen pagina's vullen het lege vlak
- `b6741fb` TASKS #82: audit, NL-review en polish vóór de finish review

### Learnings

- **Een attribuutselector is geen wortelselector.** `[data-theme="light"] { tokens }` betekent
  "elk element met dat attribuut". Als componenten hetzelfde attribuut dragen, herdefiniëren ze
  alle tokens op zichzelf. Rule: `css-layout.md`.
- **`ch` hangt aan het eerste font in de stapel, in WebKit ook als dat font de "0" niet heeft.**
  Maten voor mono-elementen in `em` (JetBrains Mono: 0,6em per teken). Rule: `css-layout.md`.
- **Een losse replay naast de test zetten gaf drie keer de oorzaak.** Smooth scroll, scroll-anchoring
  bij trim en de cookiebanner verschenen alleen onder de voorgeschiedenis van de test. Rule:
  `meten-en-guards.md`.
- **Tik op wat tikbaar is, niet op wat volgens de geometrie vrij ligt:** `elementFromPoint` op het
  tikpunt, en twee frames na een programmatische scroll.
- **Een guard op een taglijst bewaakt die lijst** (lucht ≤ inhoud zonder `img`), dezelfde les als §19.
- **Een mutant die niet vuurt kan een overbodige regel bewijzen**, niet alleen een blinde guard.
- **Mijn eigen stappenplan was een bewering.** Ik noemde sessie 3 als volgende stap zonder het plan na
  te lopen; Heisenberg deed dat wel.

### Next steps

TASKS #82: `impeccable audit` + `nl-content-reviewer`, daarna `polish` met Heisenbergs eigen
designpunten, pas dan #83 (finish review + documenter). #86: `ch` in het terminalfont in WebKit,
sitebreed, eerst meten op terminal.html. #85 kreeg de footer-zweem op andere pagina's als notitie.

### Metrics delta

- Runtime-bundel (`performance.spec.js`): **1065,72 → 1073,18 KB**, marge **46,82 KB (4,2%)**.
- Playwright: 45 spec files, **344 → 353** `test()`-declaraties.
- `du -sb`: src 740 → 742, styles 411 → 415, blog 492, assets 1741 → 1763 KB (negen WebP's, 22 KB).
- Gates: **698 / 736 / 728 / 740 passed**, 13 skipped (motorgebonden), rood verklaard en gerepareerd
  (analytics-return, cookiebanner, img in de lucht-populatie); validate-docs 20/20.
- Mutanten: 23 over vier guards, elke assertie door minstens één geraakt.

---

## Sessie 242: Herhaling is geen fout, herhaling zonder functie wel — de onderpagina op de glos-naad (27-28 sep 2026)

**Branch:** `design/impeccable`. `main` onaangeroerd; niets staat live.

**Mission:** de onderpagina van index.html (alles onder de hero) uit TASKS #82: meten wat er
staat, schrappen en samenvoegen, en de affichegrammatica van de hero doortrekken, met een proef
op gelijke maat per smaakkeuze.

### Ronde 1 — schrappen en volgorde (`89a60f9`)

- **Inventaris gemeten** @1440/375: twaalf secties, 8745/10834px. Critiquepunten nagemeten:
  `#omslag-kop` 66,24 > h1 64,8 klopte @1440 (niet @375). "Zonder het raster" was half waar:
  het raster liep door (subgrid, spans), maar de secties deelden op kolom 4, 5, 8, 9 of 10.
- **Mijn eerste plan telde herhaling en liet de layout liggen.** Heisenberg: *"is herhaling per
  se slecht? of kan het ook bewust zijn en een functie hebben? En wordt de layout verder niet
  beoordeeld?"* Daarna per functie ingedeeld: bewering → bewijs, geruststelling bij de actie,
  naslag, natelbaar maken. De herhalingen zonder functie zaten allemaal in feiten, omslag,
  verschil en stappen. Die gingen weg; "geen account" naast de knoppen bleef.
- **Layout gemeten:** elke sectie 129,6px padding en elke h2 47,52px — een metronoom; ~36% van
  de onderpagina was padding, en sample en nieuwsbrief hadden meer lucht dan inhoud. Nu twee
  sectiegewichten (`--af-sectie-kort`), regel lucht ≤ inhoud.
- **De naad:** de glos-naad van de hero (7|5) werd de naad van de hele pagina; bloglinks naast
  de vragen, cijfers en slot op kolom 8.
- **Proef B/C/D** voor de koppen: B (47,52, gelijk aan de andere h2's) gekozen; C (58px) een
  derde maat voor een nauwelijks zichtbaar verschil; D (sectie-index) gaf "02 Jouw leerpad"
  boven de kaarten 01-03.
- **Aangrenzend:** de rij "3 Missies" was een onderclaim; `src/tutorial/scenarios/` heeft er 5
  (1 Beginner, 2 Gevorderd, 2 Expert). `next` bestaat en wijst precies één stap aan.
- `#features` (menu "Het verschil") verhuisde naar Herkenbaar, zodat `navbar.js` en 27
  cache-bumps buiten schot bleven.

### Ronde 2 — vorm volgt soort (`87f1f4b`)

Heisenberg zag de intro's rechtsboven en bloglinks die als FAQ lazen, en vroeg om de hele pagina
op zulke fouten na te lopen. Zeven gemeten: intro's in de glos-kolom; bloglinks in FAQ-letter,
zelfs groter (20,7 tegen 19,8px) en "Wat is ethisch hacken?" twee keer naast elkaar;
Herkenbaar-koppen 16px boven hun prompt; haarlijnen door lopende tekst in de hero; het
Brevo-veld 70px naast de naad (gedeelde regel: `justify-content: center`); een contactregel als
wees; cijfers als kleinste element van "in cijfers". **Regel: de glos-kolom is alleen voor
uitleg naast iets links.** Proeven K/R (kantlijn gekozen) en N/G (cijfers op afficheschaal in
inkt; herziet de regel "geen afficheschaal = metric-tegel", want een tegel is een los
accentgetal, dit is een tabelrij met bron). De guard op haarlijnen vond twee elementen meer
dan mijn fixlijst (kolomkop, uitnodiging), dus de CSS-regel ging naar de populatie
(`.af-hero-raster p`).

### Ronde 3 — copy, kantlijn, leerpad (`cadd8b3`) en @375 (`afcdc08`)

- Heisenberg vond copyfouten ("Weet je in de simulator niet verder", "die wijst", "De tool praat
  Engels … niet eroverheen"), een pad met slash, een kantlijn die halverwege stopte en een
  onrustig leerpad. Mijn doorloop vond het patroon op 12 plekken: losse samenstellingen,
  Engelse zinsbouw, vaagheid. FAQ zichtbaar én FAQPage, woordelijk gelijk.
- **Kantlijn:** de border stond op een blok zo hoog als zijn inhoud (323 van 551px).
- **Leerpad:** proef L1-L3, L3 gekozen: kolommen met haarlijnen, geen kaarten, 12 → 5 lijnen. De
  lijnen in het commandoblok kwamen uit de gedeelde `landing.css:584`. Het sectieritme-spec mat
  "de kaart op de band"; die bestaat niet meer, dus de assertie meet nu de module die er ligt.
- **@375** (doorloop terwijl de gate liep; code aanpassen tijdens een gate op een live no-store
  server maakt het resultaat waardeloos): de aanhaallijn stak buiten de zijmarge, en `min-height`
  op de bloglinks zette de restruimte onder titels van één regel.

### Commits

- `89a60f9` Onderpagina: zeven secties op de glos-naad in plaats van twaalf
- `87f1f4b` Onderpagina ronde 2: vorm volgt soort
- `cadd8b3` Onderpagina ronde 3: copy in gewoon Nederlands, kantlijn over de volle hoogte, leerpad zonder kaarten
- `afcdc08` Onderpagina @375: geen losse aanhaallijn, gelijke afstanden in de bloglijst

### Learnings

- **Een telling is geen oordeel.** "Staat in zes secties" werd pas bruikbaar toen elk voorkomen
  een functie kreeg of niet. Geheugen: `feedback_repetition_by_function`.
- **Een kolom met één betekenis vindt zijn eigen fouten.** Zodra "rechts = uitleg naast iets
  links" vastlag, vielen intro's, bloglinks en de contactregel vanzelf af.
- **Een guard die mijn fixlijst meet, bewaakt mijn fixlijst.** De haarlijn-guard op alle alinea's
  vond er twee die ik miste; daarna ging ook de CSS naar de populatie.
- **Een mutant die niet vuurt, eerst controleren of hij landde.** `.af-specimen-cmds
  .leerpad-cmd-line` (0,2,0) verloor van `body.home .leerpad-cmd-line` (0,2,1); met een winnende
  selector vuurde de guard wel.
- **Een guard op vorm meet niet de lengte.** De kantlijn-assertie controleerde letter en gewicht,
  niet of de lijn langs de hele lijst liep; de eigenaar zag het op het scherm.
- **Ik begrensde mijn eigen gate te krap** (900s): afgekapt zonder eindblok, dus zonder bewijs.
  Tweede run zonder die grens; 25 minuten is de werkelijke duur met performance.spec erbij.
- **Skips verklaren, niet aannemen:** 4 → 13 kwam volledig uit performance.spec, nieuw in de
  gate (4 + 2 + 3 motorgebonden).

### Next steps

TASKS #82: `adapt` (mobiel meescrollen, focus bij een chip-tik, de band 1024-1279). Door
Heisenberg zelf te beoordelen: het lege vlak linksonder in de sample-sectie. Dan #83 (finish
review + documenter); het open reviewerpunt (Brevo-veld) is dicht.

### Metrics delta

- Runtime-bundel (`performance.spec.js`): **1069,20 → 1065,72 KB**, marge **54,28 KB (4,8%)**.
- Documenthoogte @1440: **8745 → 5764**; @375: **10834 → 7836**.
- Playwright: 45 spec files, **338 → 344** `test()`-declaraties.
- `du -sb`: src 740, styles 410 → 411, blog 492, assets 1741 KB.
- Gates: **665 / 668 / 668 / 674 passed, 0 failed, 13 skipped**, drie motoren; validate-docs 20/20.

---

## Sessie 241: Een test die op vijf posities meet, bewaakt vijf posities — de vouw gehaald, en twee oude gaten dicht (27 sep 2026)

**Branch:** `design/impeccable`. `main` onaangeroerd; niets staat live.

**Mission:** ronde 3 (diagram en terminal samen boven de vouw) en ronde 4 (clarify) uit
TASKS.md #82, elk met gemeten posities, screenshots en de index-gate over drie motoren.

### Ronde 3 — de vouw

- **Beginstand gemeten, reproduceerde sessie 240:** onderkant `.af-net` 949/900 (1440),
  927/800 (1280), 1071/768 (1024). De chips waren 77px in plaats van 60: `nmap
  192.168.1.1` vraagt 144px, een gelijke kolom gaf 121 (1280) of 137 (1440).
- **Waarom alleen marges niet genoeg waren:** op 1280x800 is 741px onder de navbar, en de
  vaste delen (h1 115, ondertitel 72, terminal 285, chips 60-77, router 98) kosten er al
  ~640. Voor alle tussenruimtes bleef ~100px. Er moest een hele rij uit.
- **Het besluit: de glos-grammatica doortrekken.** Twee uitnodigingen zeiden hetzelfde
  ("Deze terminal werkt echt — typ maar" boven, "Probeer: tik een command…" onder), elk
  op een eigen rij. Nu staan de kolomkop "In gewoon Nederlands" naast `.af-term-kop` en de
  uitnodiging als glos naast de invoerregel, met dezelfde aanhaallijn van 1px. Beide
  staan in `.af-term`, zodat auto-placement ze paarsgewijs op één rij zet. De "Probeer:"-
  regel verviel; "proefversie · 6 van de 40+ commands" staat in de terminalkop (via
  `aria-describedby` ook voor schermlezers). Onder 768 staat de uitnodiging onder de
  invoer, en de venstertitel valt weg (beide labels braken @375).
- **Onderschrift van het diagram** ≥1280 onder "jouw machine", met zijn onderkant op die
  van de router. Eerste poging landde bóven de router: een expliciete `grid-row: 1` wordt
  eerst geplaatst en duwde de auto-geplaatste nodes naar rij 2. Oplossing: het diagram
  expliciet in twee rijen, router over beide.
- **Chips in `repeat(6, auto)`:** nmap past (145px ruimte voor 144px tekst op 1280), en
  een auto-track valt terug op wrappen als het niet past.
- **Uitkomst:** 949 → **788** (1440), 927 → **770** (1280); op 1024 de hele terminal met
  uitnodiging (invoerregel eindigt op 663) plus de eerste chiprij. Terminal houdt 7 regels.
- **Guard "De vouw"** in `hero-demo.spec.js` (4 tests): poorten boven de vouw met
  zelfbewakende takken (12 poorten, body = 7 × rij + 16), 1024-afspraak, registratie van
  kolomkop en uitnodiging. Mutanten: onderschrift-blok weg → *"diagram eindigt op 801, de
  vouw ligt op 800"*; 6 regels → zeven-regels-tak; kolomkop terug boven → registratietest.
  Een zwakkere mutant (onderschrift onder de router, mét de nieuwe regelafstand) bleef
  groen, en terecht: 790 ≤ 800. Ik controleerde eerst of hij landde, vóór ik de guard
  wantrouwde.

### Twee gates, twee oude gaten

- **`hero-accent-budget`: de zelfbewakende tak vuurde niet meer** (Expected 2, Received 1).
  De teller rekende alles in `.hero-terminal` als "binnen de module", waar de terminal
  eigen kleuren mag houden. De hint stond daar nu in; maar de glossen (`.reg-glos`) stonden
  er al sinds de bouw, op papier. Een rode glos ontsnapte dus altijd. Gerepareerd in de
  classificatie: glos, kolomkop en uitnodiging tellen als papier.
- **"Geen chip onder de mobiele CTA-balk, op geen enkele scrollpositie"** faalde op webkit
  @375 bij y=300, ook na retry. **A/B tegen `git archive HEAD` op poort 8902:** oud groen,
  nieuw rood, dus schijnbaar mijn regressie. Een sweep per 10px liet het tegendeel zien:

  | | oud | nieuw |
  |---|---|---|
  | afgedekte posities (3 engines × 375/390) | 22 | 3 |

  De invariant gold nooit; de vijf meetpunten misten het venster (hero-CTA net onder de
  navbar, onderste chiprij nog in de balkzone). De krappere hero schoof één positie precies
  op y=300. **Oorzaak gerepareerd:** `landing-demo.js` houdt de balk ook weg zolang hij een
  chip zou afdekken (`zouChipAfdekken`, een tweede observer op de chips met threshold 0/1).
  Bewust afgewogen tegen het contract uit sessie 216 ("verborgen ⟺ CTA-midden
  aantikbaar"): in dat venster van 10-30px zijn de chips de actie, en een afgedekte chip
  navigeerde weg bij een tik. De uitzondering staat in het contractcommentaar zelf.
  Gemeten ná: 0 afgedekt, 0 posities zonder actie, drie engines × 360/375/390. De test is
  nu een sweep per 10px met een tak "de balk verscheen wel"; mutant (fix weg) → rood in
  alle drie.

### Ronde 4 — clarify, beperkt

- **Scopebesluit (Heisenberg):** de onderpagina krijgt een schone sessie, en de hype en het
  jargon daar ("van beginner naar hacker", "sandbox", "man-pagina") staan in secties die
  bij het schrappen kunnen verdwijnen. Die punten staan nu letterlijk, met voorstel, bij
  het onderpagina-item in TASKS #82. "Elk command heeft een man-pagina" is gemeten en
  klopt: 41 van 41 (`hash-benchmarks.js` is een databron).
- **Footerclaim** "De enige Nederlandse terminal simulator" → "Een Nederlandse terminal
  simulator waarin je zonder account ethisch hacken leert…". Grep op `de enige|eerste
  Nederlandse|uniek` vond geen andere claim van die soort.
- **Mobiel menu en themaknop:** Het verschil / Vragen / DONKER / LICHT, aria-label en title
  "licht thema". "Blog" en "Commands" blijven: paginanamen en leenwoorden. Guard met een
  exacte lijst (geen denylist); mutant "FAQ" terug → rood op `+ "FAQ"`.
- **FAQ-vraag voor de carrièreswitcher:** "Past security bij mij als ik van vak wil
  wisselen?" Eerlijk: hier ontdek je of het werk je ligt, een baan krijg je er niet mee.
  Zichtbaar en in de FAQPage-JSON-LD, antwoord woordelijk gelijk (gecontroleerd); ids 4-9
  hernummerd.
- **Cache:** `navbar.js`/`footer.js` `?v=4`, `init-components.js` `?v=6` op 27 pagina's,
  `affiche.css` en `landing-demo.js` `?v=4`.

### Commits

- `ea9a0f6` Ronde 3: terminal en diagram samen boven de vouw
- `6498b44` Ronde 4: de footer beweert niets meer, het menu spreekt Nederlands

### Learnings

- **Een meetlijst bewaakt zichzelf, niet de klasse — ook als die lijst scrollposities is.**
  "Op geen enkele scrollpositie" met vijf posities was 22 posities lang onwaar.
- **Een "regressie" kan een verbetering zijn die een oude fout zichtbaar maakt.** Zonder
  A/B tegen HEAD had ik de hero teruggedraaid of het meetpunt verschoven; met A/B plus een
  sweep werd het "22 → 3, en hier is de oorzaak".
- **Een budget laat zien welk soort ingreep nodig is.** Tel de vaste delen tegen de
  beschikbare hoogte vóór je marges schaaft: blijft er minder over dan de som van de
  tussenruimtes, dan moet er structureel iets uit.
- **Een expliciete grid-plaatsing gaat vóór auto-placement.** Eén item met `grid-row: 1`
  op kolommen die een auto-item nodig had, duwt dat hele item een rij omlaag.
- **Scope volgt de levensduur van de tekst.** Copy polijsten in een sectie die de volgende
  sessie mogelijk schrapt, is dubbel werk; de punten horen bij het item dat de sectie
  herbouwt.

### Next steps

TASKS.md #82: de onderpagina in een schone sessie (raster doortrekken, herhaling schrappen,
h1 < `#omslag-kop`, plus de hype- en jargonpunten uit ronde 4), daarna `adapt` (mobiel
meescrollen, focus bij een chip-tik, de band 1024-1279), dan #83 (finish review +
documenter).

### Metrics delta

- Runtime-bundel (`performance.spec.js`): **1063,96 → 1069,20 KB**, marge **50,80 KB
  (4,5%)**. Vooral uitlegcommentaar; JS 730,65, CSS 263,18, HTML 75,37.
- Playwright: 45 spec files, **334 → 338** `test()`-declaraties.
- `du -sb`: src 738 → 740 KB, styles 409 → 410 KB, blog 492, assets 1741.
- Gates: ronde 3 **560 passed / 0 failed / 4 skipped**, ronde 4 **563 / 0 / 4**, drie
  motoren (de skips zijn de chromium-only bestandssysteemtests).

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
