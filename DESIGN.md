---
name: HackSimulator.nl
description: Nederlandstalige terminalsimulator waarin beginners ethisch hacken leren zonder iets te kunnen breken
colors:
  rood: "#cc0a1e"
  op-rood: "#ffffff"
  papier: "#efefec"
  papier-2: "#e2e2de"
  inkt: "#111111"
  inkt-2: "#444440"
  lijn: "#c9c9c4"
  lijn-sterk: "#7a7a75"
  m-grond: "#0a0a0a"
  m-lijn: "#2c2c2a"
  m-tekst: "#c9d1d9"
  m-dim: "#a1a8b0"
  m-prompt: "#9fef00"
  m-fout: "#fa7c76"
  m-waarsch: "#d29922"
  m-glos: "#d6d6d2"
  m-oplicht: "#23231f"
  papier-2-donker: "#1c1c1b"
  inkt-2-donker: "#b0b0ab"
  lijn-donker: "#2e2e2c"
  lijn-sterk-donker: "#6f6f6a"
  m-grond-donker: "#000000"
  m-lijn-donker: "#3a3a37"
typography:
  display:
    fontFamily: "Archivo, Atkinson Hyperlegible Next, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Archivo, Atkinson Hyperlegible Next, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.75rem, 3.3vw, 2.85rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  figure:
    fontFamily: "Archivo, Atkinson Hyperlegible Next, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  title:
    fontFamily: "Archivo, Atkinson Hyperlegible Next, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.22rem"
    fontWeight: 700
    lineHeight: 1.2
  label:
    fontFamily: "Archivo, Atkinson Hyperlegible Next, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 800
    lineHeight: 1.15
  body:
    fontFamily: "Atkinson Hyperlegible Next, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: "Atkinson Hyperlegible Next, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.83rem"
    fontWeight: 400
    lineHeight: 1.3
  button:
    fontFamily: "Atkinson Hyperlegible Next, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "max(1.15rem, 19px)"
    fontWeight: 700
    letterSpacing: "0"
  mono:
    fontFamily: "JetBrains Mono Box, JetBrains Mono, Courier New, Courier, monospace"
    fontSize: "0.86rem"
    fontWeight: 400
    lineHeight: "1.5rem"
rounded:
  none: "0"
spacing:
  rand: "clamp(16px, 3vw, 32px)"
  cel: "clamp(12px, 1.4vw, 20px)"
  sectie: "clamp(72px, 9vw, 136px)"
  sectie-kort: "clamp(48px, 5vw, 72px)"
  breed: "1400px"
components:
  button-primary:
    backgroundColor: "{colors.rood}"
    textColor: "{colors.op-rood}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.inkt}"
    textColor: "{colors.papier}"
  button-secondary:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.inkt}"
    rounded: "{rounded.none}"
    padding: "10px 18px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.inkt}"
    textColor: "{colors.papier}"
  chip-command:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.inkt}"
    rounded: "{rounded.none}"
    padding: "8px {spacing.cel}"
    height: "60px"
  chip-command-hover:
    backgroundColor: "{colors.inkt}"
    textColor: "{colors.papier}"
  input-newsletter:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.inkt}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "56px"
  button-newsletter:
    backgroundColor: "{colors.inkt}"
    textColor: "{colors.papier}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "56px"
  button-newsletter-hover:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.inkt}"
  terminal-module:
    backgroundColor: "{colors.m-grond}"
    textColor: "{colors.m-tekst}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
  nav-link-hover:
    backgroundColor: "{colors.inkt}"
    textColor: "{colors.papier}"
---

# Design System: HackSimulator.nl

## Overview

**Creative North Star: "Het affiche op het raster"**

De pagina is een affiche op een zichtbaar raster, in de traditie van Total Design (Wim Crouwel). Gebroken wit papier, zwarte inkt, en precies één signaalrood dat alleen "hier ben jij aan zet" betekent. Alles staat op een 12-koloms raster zonder goot: de kolomgrenzen zijn de haarlijnen, en elke cel draagt zijn eigen binnenruimte. De terminal is een donkere module in dat raster, en de Nederlandse uitleg staat per outputregel ernaast, op dezelfde rasterrij.

Toestanden spreken via inversie en nooit via een extra kleur: een blok wordt inkt met een papieren letter. Er zijn geen schaduwen, geen zichtbare kleurverlopen en geen afgeronde hoeken. Diepte bestaat niet; er is alleen papier, inkt en de zwarte module. Het donkere thema is het geïnverteerde affiche: inkt wordt grond, papier wordt letter.

**Reikwijdte.** Dit systeem draait nu alleen op `index.html`. Het staat in één stylesheet dat alleen die pagina laadt, als laatste, en hangt volledig onder de homepage-scope. Het hertokent de gedeelde componenten (navbar, footer, knoppen, FAQ, nieuwsbrief) in plaats van ze te overschrijven. De andere pagina's (gidsen, samples, blog, terminal, juridisch) tonen nog het oudere systeem en gaan één per sessie over. Dat oudere systeem hoort niet bij dit document.

Expliciet niet: scanlines, glow, groen-op-zwart, matrixregen, mascottes, badges op de voorgrond, kickers en eyebrows.

**Key Characteristics:**
- Papier, inkt, één signaalrood. Verder niets buiten de terminalmodule.
- Een 12-koloms raster zonder goot, met in het eerste scherm zichtbare haarlijnen van 1px.
- De naad op kolom 8: links het ding, rechts de uitleg.
- Toestanden via inversie (inktblok, papieren letter), nooit via een extra kleur.
- Hoeken van 0, geen schaduwen, geen zichtbare verlopen.
- Eén beweging per command: de registratie.

## Colors

Een neutraal-koel papier met zwarte inkt en één verzadigd rood. Daarbinnen een zwarte module die zijn eigen simulatorkleuren houdt.

### Primary
- **Signaalrood** (#cc0a1e): de enige kleur buiten de module. Het vult alleen de primaire actie ("Start de simulator", ook in de mobiele CTA-balk) en tekent de focusring van 2px op elk focusbaar element. Wit op rood haalt 5,79:1, rood op papier 5,02:1. Kleine rode tekst komt niet voor.
- **Letter op rood** (#ffffff): de letter van de primaire actie, altijd vet en groot (20,7px op desktop, minimaal 19px).

### Neutral
- **Papier** (#efefec): de grond. Neutraal-koel gebroken wit, bewust geen crème.
- **Band** (#e2e2de): de achtergrond van afwisselende secties (Leerpad, Vragen, Nieuwsbrief) en van gesloten poorten in het diagram. Inkt erop haalt 14,54:1.
- **Inkt** (#111111): alle tekst, koppen, kaders en elk geïnverteerd blok. Haalt 16,39:1 op papier.
- **Gedempte inkt** (#444440): inleidingen, microcopy, herkomstlabels, bronnen en indexnummers in rust. Haalt 8,49 op papier en 7,53 op de band.
- **Rasterlijn** (#c9c9c4): de haarlijnen van het raster. Decoratief, ze dragen geen informatie.
- **Bedieningslijn** (#7a7a75): randen van bedieningselementen en de scheidingslijnen tussen rijen in tabel en FAQ. Haalt 3,74 op papier en 3,32 op de band (lat 3 voor niet-tekst).

### De terminalmodule
Deze kleuren gelden alleen binnen de rand van de zwarte module (hero-terminal, transcripten in Herkenbaar, commandoblokken in het leerpad). Het is inhoud van de simulator, geen decoratie van de pagina. Ze komen nooit op papier.
- **Modulegrond** (#0a0a0a) met **modulelijn** (#2c2c2a) tussen kop, lichaam en invoerregel.
- **Uitvoer** (#c9d1d9, 12,83:1) en **gedimde uitvoer** (#a1a8b0, 8,24:1).
- **Prompt en tip** (#9fef00, 13,97:1): de prompt, de caret en `[TIP]`-regels.
- **Fout** (#fa7c76, 7,74:1): zalm, en uitdrukkelijk niet het signaalrood.
- **Waarschuwing** (#d29922, 7,84:1).
- **Glos in de module** (#d6d6d2, 13,58:1): alleen onder 768px, waar de uitleg onder zijn regel in de module staat.
- **Oplichten** (#23231f): de achtergrond van een regel tijdens de registratie.

### Het donkere thema
Papier en inkt wisselen van rol. De grond wordt #111111 en de letter #efefec. Daarnaast: band #1c1c1b, gedempte inkt #b0b0ab (8,67 op de grond), rasterlijn #2e2e2c, bedieningslijn #6f6f6a (3,74). De module wordt #000000 met modulelijn #3a3a37 en krijgt een haarlijn in de bedieningslijnkleur, zodat hij als module leest en niet als gat. Het rood blijft; als niet-tekstig merkteken haalt het 3,26 op de grond. De footer is in beide thema's een inktvlak: in licht #111111, in donker #000000.

### Named Rules
**The One Voice Rule.** Het rood betekent alleen "jij bent aan zet": de primaire actie en de focusring. Er is per scherm één rood vlak. Een tweede actie in hetzelfde scherm (de nav-CTA, een volgende chip, een actieve toestand) wordt inkt.

**The Inversion Rule.** Een toestand krijgt geen nieuwe kleur. Hover, actief, volgende, open en oplichten zijn allemaal hetzelfde gebaar: inktblok, papieren letter. Binnen een blok dat al geïnverteerd is, inverteert het label terug.

**The Module Boundary Rule.** De simulatorkleuren (groen, zalm, amber, blauwgrijs) leven alleen binnen de zwarte module. Buiten de module is groen geen accent.

## Typography

**Display Font:** Archivo (met Atkinson Hyperlegible Next, -apple-system, Segoe UI, sans-serif)
**Body Font:** Atkinson Hyperlegible Next (met -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif)
**Label/Mono Font:** JetBrains Mono (met een eigen subset voor kadertekens vooraan, dan Courier New, monospace)

**Character:** Een neo-grotesk op afficheschaal, strak op het raster opgebouwd, met een lopende letter die is ontworpen om verwarbare tekens uit elkaar te houden. Archivo is zelf gehost op wdth 100 en gewicht 700-800. 900 is er bewust uit.

De rem-basis is 18px op desktop en 16px onder 768px. De maten hieronder schalen daarmee mee.

### Hierarchy
- **Display** (Archivo 700, clamp(2.2rem, 4.6vw, 3.6rem), max 64,8px, regelhoogte 0,98, spatiëring -0,012em): de h1 over negen kolommen en de slotkop. Er is geen kop groter dan de h1.
- **Headline** (Archivo 700, clamp(1.75rem, 3.3vw, 2.85rem), max 51,3px, regelhoogte 1,05, spatiëring -0,02em): sectiekoppen over kolom 1-7, met `text-wrap: balance`.
- **Figure** (Archivo 700, clamp(2rem, 3.4vw, 3rem), regelhoogte 1, tabelcijfers): de getallen in de cijfertabel. Altijd in inkt en in een tabelrij met zijn bron, nooit als los accentgetal in een kaart.
- **Title** (Archivo 700, 1.22rem = 22px, regelhoogte 1,2): h3 in Herkenbaar. De FAQ-vraag gebruikt Archivo 700 op 1.1rem.
- **Label** (Archivo 800, 1.1rem tot 1.22rem): namen die iets aanduiden in plaats van iets te beweren. Denk aan het woordmerk, de bloknamen in het diagram ("jouw machine", de router) en de niveaus in het leerpad.
- **Body** (Atkinson 400, 1rem, regelhoogte 1,55, max 62ch, ongeveer 75 tekens): alle lopende tekst. Een inleiding onder een kop is 1.1rem in gedempte inkt, max 52ch.
- **Small** (Atkinson, 0.83rem = 15px): microcopy, de glos, de kolomkop, herkomst- en privacyregels. De herkomst in een chip is 0.72rem (13px).
- **Button** (Atkinson 700): de primaire actie op max(1.15rem, 19px), zodat hij op elke breedte grote tekst blijft. De secundaire knop staat op 0.9rem.
- **Mono** (JetBrains Mono 400, 0.86rem, regelhoogte 1.5rem = 27px in de module): terminaluitvoer, de invoerregel en de commands in chips (700). Buiten de module op 0.83rem voor indexnummers (700), adressen, bronnen en paginaverwijzingen, en op 0.75rem voor paden.

### Named Rules
**The Mono Is Evidence Rule.** JetBrains Mono staat alleen in de terminal en voor dingen die je letterlijk kunt nalopen: indexnummers, paden, adressen, bronnen, paginaverwijzingen. Nooit voor koppen of lopende tekst.

**The Numbered Order Rule.** Een mono-index (01-06, 01-03) staat alleen waar de volgorde zelf de informatie is: de chips, het leerpad en de inhoud van de sample. Sectiekoppen worden nooit genummerd.

**The Two Weights Rule.** Archivo 700 is voor een bewering (koppen, cijfers), Archivo 800 voor een naam (een merk, een blok of een niveau). Andere gewichten van Archivo worden niet gebruikt.

## Layout

Het raster heeft 12 kolommen (`repeat(12, minmax(0, 1fr))`) zonder goot, is maximaal 1400px breed en heeft een zijrand van clamp(16px, 3vw, 32px). Omdat er geen goot is, zijn de kolomgrenzen de lijnen, en elke cel geeft zijn inhoud zelf binnenruimte (clamp(12px, 1.4vw, 20px)). Kinderen erven het raster via subgrid.

**Haarlijnen alleen in het eerste scherm.** In de hero ís het raster de vorm: twaalf verticale lijnen van 1px in de rasterlijnkleur, getekend als één achtergrondlaag. Elke alinea in dat raster snijdt zich er met een papieren achtergrond uit, zodat er geen lijn door een regel tekst loopt. De kop op afficheschaal mag over het raster staan. Onder de hero staan geen verticale haarlijnen: daar draagt de naad het raster.

**De naad.** Kolom 1-7 is voor het ding (terminal, transcript, tabel, vragen, actie) en kolom 8-12 voor de uitleg of de vervolgstap (glos, bloglinks, sample-uitleg, nieuwsbriefveld). De glos-kolom is alleen voor uitleg naast iets links. Wat bij een kop hoort, staat onder die kop.

**De registratie.** Outputregel en glos zijn één rij met twee cellen. De module is precies 7/12 van het raster breed, gemeten tegen de rastercontainer en niet tegen het scrollende lichaam, zodat een scrollbalk de naad niet verschuift. De glos hangt met een aanhaallijn van 1px in inkt aan zijn regel.

**Ritme naar gewicht.** Hoofdsecties (Herkenbaar, Leerpad, Vragen) krijgen clamp(72px, 9vw, 136px) boven en onder. Korte secties (cijfers, slot, sample, nieuwsbrief) krijgen clamp(48px, 5vw, 72px), zodat de lucht nooit groter is dan de inhoud. Secties wisselen tussen papier en band. De sample is de enige inktband onder de hero. De eerste sectie na de hero begint met een inktlijn van 1px.

**Responsief.**
- Vanaf 1280px staat de rode actie naast de kop, in kolom 10-12, met zijn onderkant op de basislijn van de onderste kopregel. De ondertitel staat onder de kop.
- Onder 1280px staan kop en actie onder elkaar, gaan de chips naar 3 kolommen en neemt een mobiele CTA-balk met de rode actie de rol van de nav-CTA over.
- Onder 1024px gaan tabel, vragen en leerpad over de volle breedte. Leerpadkolommen worden rijen met een inktlijn ertussen, de bloglinks komen onder de vragen en de poorten staan in twee rijen van zes.
- Onder 768px wordt het raster 4 kolommen. De glos gaat de module in, onder zijn regel, in 0.78rem. De chips staan twee aan twee met de index boven het command, en de scanpijl in het diagram loopt verticaal.

## Elevation & Depth

Het systeem is volledig plat. Er zijn geen schaduwen, ook niet bij hover of focus, en elke gedeelde component die er een meebrengt, krijgt hier `box-shadow: none`. Er is ook geen lift of `transform` bij hover. Scheiding komt van drie dingen: de zwarte module op papier, een haarlijn van 1px (inkt of bedieningslijn), en het afwisselen van papier en band. Nadruk komt van inversie.

### Named Rules
**The Paper Has No Z-Axis Rule.** Niets zweeft. Een element is papier, inkt of module. Wil je iets laten opvallen, dan inverteer je het. Je tilt het nooit op.

**The Drawn Line Rule.** Een lineair verloop met harde stops is hier gereedschap om lijnen en vlakken te tekenen (de rasterlijnen, de modulegrond naast de glos). Dat mag. Een zichtbare overgang tussen twee kleuren mag nooit.

## Shapes

Elke hoek is recht (0). Knoppen, chips, velden, de module, de FAQ-items en de consentbanner hebben allemaal een radius van 0. Randen zijn inkt: 1px voor knoppen, velden, diagramblokken en kolomscheidingen, 2px voor de commandochips (klikbaar) en voor de bovenlijn van tabel en vragenlijst. Rijen binnen een tabel of lijst worden gescheiden door 1px in de bedieningslijnkleur. Pijlen in het diagram zijn getekend uit twee lijnen van 2px, geen glyphs. Het diagram heeft bewust geen celkaders, zodat klikbare elementen en tekening niet op elkaar lijken.

## Components

### Buttons
Rechthoekig, plat en direct. Een knop is een blok dat inverteert.
- **Shape:** rechte hoeken (0), geen schaduw, geen icoon, geen lift.
- **Primary:** signaalrood vlak met een witte letter in Atkinson 700 op max(1.15rem, 19px), padding 14px 28px, minimaal 56px hoog (52px in de mobiele CTA-balk). Eén per scherm.
- **Hover / Focus:** het vlak inverteert naar inkt met een papieren letter, via een overgang van 160ms op achtergrond en letterkleur. Focus tekent daarnaast de rode ring (2px, offset 2px).
- **Secondary:** een kader van 1px in inkt met een inkten letter in Atkinson 700 op 0.9rem, padding 10px 18px, minimaal 44px hoog. Bij hover inverteert hij. De gevulde variant begint als inkt en wordt bij hover weer papier. Op de inktband zijn de rollen omgedraaid: papieren kader en papieren letter.
- **Nav-CTA:** hetzelfde label als de hero-actie, maar als inkten kader. Het rood blijft voor de hero.

### Command chips
De zes suggesties onder de invoerregel. Het zijn knoppen, geen tags.
- **Style:** papier met een kader van 2px in inkt, minimaal 60px hoog, padding 8px plus de celmaat. Links een mono-index (0.83rem, gedempt), rechts het command in mono 700 (0.86rem, breekt nooit) met eronder de herkomst (categorie en niveau, 0.72rem, gedempt).
- **State:** hover en focus inverteren de hele chip. De volgende suggestie keert alleen het indexnummer om (inktblok, papieren cijfer). Een gedane chip vervangt het nummer door `[✓]` zonder dat de kolom verspringt.

### Cards / Containers
Er zijn geen kaarten. Inhoud staat in rijen en kolommen, gescheiden door haarlijnen.
- **Corner Style:** recht (0).
- **Background:** papier, of de band voor een hele sectie. De zwarte module is het enige vlak binnen een sectie.
- **Shadow Strategy:** geen, zie Elevation & Depth.
- **Border:** tabelrijen en FAQ-items hebben een onderlijn van 1px in de bedieningslijnkleur onder een bovenlijn van 2px in inkt. Leerpadkolommen hebben een scheidingslijn van 1px in inkt.
- **Internal Padding:** de celmaat clamp(12px, 1.4vw, 20px) horizontaal. Rijen van de cijfertabel zijn minimaal 88px hoog.

### Inputs / Fields
- **Style:** het nieuwsbriefveld is papier met een kader van 1px in inkt, 56px hoog, padding 0 16px, radius 0 en Atkinson 1rem. De knop ernaast is een inktblok van 56px. Vanaf 1024px staan ze op één rij tot de rasterrand, zonder rechterrand op het veld. Daaronder staan ze onder elkaar en neemt de knop de volle breedte.
- **Focus:** de rode ring (2px, offset 2px), net als elk ander element. Het kader blijft inkt.
- **Terminalinvoer:** een mono-invoerregel in de module, minimaal 44px hoog, met een staande (niet knipperende) cursor. Bij focus krijgt de hele invoerregel de rode ring.

### Navigation
- **Style:** een balk van papier met een inktlijn van 1px eronder. Het woordmerk staat in Archivo 800 en is geen actie: het heeft geen onderstreping en wisselt niet van kleur, in rust noch bij hover, en in de footer net zo.
- **Links:** inkt zonder onderstreping. Bij hover inverteren ze tot een inktblok.
- **Mobiel:** de menulinks zijn inkt op papier, het hamburgerteken is inkt.
- **Footer:** een inktvlak op de rail van het raster (dezelfde zijrand en breedte). Papier en inkt draaien er om. De Ko-fi-link en het GitHub-icoon zijn een blok met een papieren kader dat inverteert.

### Links
Een tekstlink is inkt met een onderstreping van 1px, offset 0.2em. Bij hover wordt de onderstreping 2px. Staat een link als blok in een lijst (bloglinks, tabelrijen), dan inverteert het blok in plaats daarvan, met 8px lucht naast de letters.

### Terminal module (signatuur)
Een zwarte module over kolom 1-7 met een mono kopregel (titel en omvang), een lichaam van zeven regels van 27px, en een invoerregel. Het lichaam loopt over alle twaalf kolommen: links de module, rechts op papier de glos per regel. Bij elk command lichten outputregel, glos en diagramsleuf samen op als één rij. De regel krijgt de oplichtkleur en de glos inverteert naar inkt. Dat gebeurt zonder overgang erin en met 700ms uitloop in cubic-bezier(0.16, 1, 0.3, 1). Onder `prefers-reduced-motion` staat meteen de eindstand.

### Netwerkdiagram
Twee blokken met een kader van 1px in inkt ("jouw machine" over kolom 1-3 en de router over kolom 6-12), verbonden door een getekende scanpijl van 2px. In het routerblok zitten twaalf poorten als sleuven op de band. Een open poort is gevuld (inktblok, papieren cijfer, 700). Een actief blok keert alleen zijn kopregel om, zodat "gevuld = open" blijft kloppen.

## Do's and Don'ts

### Do:
- **Do** zet het signaalrood (#cc0a1e) alleen op de primaire actie en op de focusring (2px, offset 2px). Eén rood vlak per scherm.
- **Do** laat elke toestand spreken via inversie: inktblok (#111111), papieren letter (#efefec).
- **Do** houd de hovertaal op twee woorden: een blok inverteert, een tekstlink gaat van een onderstreping van 1px naar 2px. Nooit allebei tegelijk, en nooit een tweede lijn.
- **Do** zet uitleg op de naad: het ding in kolom 1-7, de uitleg in kolom 8-12, op dezelfde rasterrij.
- **Do** laat alinea's in het hero-raster zich met een papieren achtergrond uit de haarlijnen snijden.
- **Do** hertoken gedeelde componenten onder de homepage-scope, en zet de vormeigenschappen die je wilt expliciet (rand 0, schaduw none, radius 0), zodat de vorm van de oude wereld niet doorlekt.
- **Do** houd de simulatorkleuren binnen de zwarte module (#0a0a0a).
- **Do** maak tikdoelen minimaal 44px. De primaire actie is 56px.

### Don't:
- **Don't** gebruik schaduwen, zichtbare kleurverlopen, afgeronde hoeken of lift bij hover.
- **Don't** introduceer een tweede accentkleur of kleur een toestand in een andere tint dan inkt.
- **Don't** zet rood op kleine tekst, en gebruik het niet voor fouten: een fout in de terminal is zalm (#fa7c76).
- **Don't** gebruik groen, glow, scanlines, matrixregen of groen-op-zwart als pagina-esthetiek. Het groen van de prompt hoort alleen in de module.
- **Don't** gebruik mascottes, badges op de voorgrond, kickers of eyebrows boven koppen.
- **Don't** zet getallen als los accentgetal in een kaart. Een cijfer staat in een tabelrij met zijn bron.
- **Don't** nummer sectiekoppen. Een mono-index is alleen voor een echte volgorde.
- **Don't** trek verticale rasterlijnen door onder de hero. Daar draagt de naad het raster.
- **Don't** voeg een tweede beweging toe naast de registratie. Een hover-overgang is hoogstens 160ms op kleur, en de FAQ opent zonder animatie.
