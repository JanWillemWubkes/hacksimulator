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
  m-tekst: "#d6d6d2"
  m-dim: "#a3a39d"
  m-prompt: "#efefec"
  m-label: "#efefec"
  m-label-inkt: "#111111"
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
  footer: "#111111"
  footer-donker: "#000000"
typography:
  affiche:
    fontFamily: "Archivo, Atkinson Hyperlegible Next, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.2rem, 6.2vw, 4.9rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo, Atkinson Hyperlegible Next, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.75rem, 3.3vw, 2.85rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  figure:
    fontFamily: "Archivo, Atkinson Hyperlegible Next, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.2rem, 6.2vw, 4.9rem)"
    fontWeight: 700
    lineHeight: 0.94
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
  groep-boven: "clamp(24px, 2.5vw, 44px)"
  groep-stap: "clamp(40px, 3.45vw, 56px)"
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
  button-primary-on-ink-hover:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.inkt}"
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
    height: "52px"
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
  terminal-label:
    backgroundColor: "{colors.m-label}"
    textColor: "{colors.m-label-inkt}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "1px 6px"
  terminal-cursor:
    backgroundColor: "{colors.rood}"
    rounded: "{rounded.none}"
    width: "1ch"
  nav-link-hover:
    backgroundColor: "{colors.inkt}"
    textColor: "{colors.papier}"
  nav-link-active:
    textColor: "{colors.inkt}"
  footer:
    backgroundColor: "{colors.footer}"
    textColor: "{colors.papier}"
  consent-banner:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.inkt}"
    rounded: "{rounded.none}"
  button-consent:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.inkt}"
    rounded: "{rounded.none}"
    height: "44px"
  button-consent-hover:
    backgroundColor: "{colors.inkt}"
    textColor: "{colors.papier}"
---

# Design System: HackSimulator.nl

## Overview

**Creative North Star: "Het affiche op het raster"**

De pagina is een affiche op een zichtbaar raster, in de traditie van Total Design (Wim Crouwel). Gebroken wit papier, zwarte inkt, en precies één signaalrood dat alleen "hier ben jij aan zet" betekent. Alles staat op een 12-koloms raster zonder goot: de kolomgrenzen zijn de haarlijnen, en elke cel draagt zijn eigen binnenruimte. De terminal is een donkere module in dat raster, en de Nederlandse uitleg staat per outputregel ernaast, op dezelfde rasterrij.

Toestanden spreken via inversie en nooit via een extra kleur: een blok wordt inkt met een papieren letter. Er zijn geen schaduwen, geen zichtbare kleurverlopen en geen afgeronde hoeken. Diepte bestaat niet; er is alleen papier, inkt en de zwarte module. Ook de module spreekt de taal van de pagina: haar tekst komt uit de papierfamilie, de prompt is papier in 700, de Nederlandse laag (`[TIP]`, `[→]`) staat op een papieren label, en de cursor is een blok signaalrood. Alleen fout (zalm) en waarschuwing (amber) zijn eigen tinten. Het donkere thema is het geïnverteerde affiche: inkt wordt grond, papier wordt letter.

**Reikwijdte.** Het systeem staat in twee lagen. De gedeelde laag (de tokens op `:root` en in het donkere thema, Archivo, de navbar in beide varianten, de footer en de consentbanner) draait sitebreed: elke pagina met chrome laadt hem als laatste stylesheet, 27 pagina's. De pagina-inhoud staat alleen op `index.html` in het affiche, in een eigen stylesheet onder de homepage-scope. De inhoud van de andere pagina's (gidsen, samples, blog, woordenlijst, commands, over ons, contact, 404, terminal) toont nog het oudere systeem en gaat één pagina per sessie over; dat oudere systeem hoort niet bij dit document. Een gemigreerde pagina doet mee door haar bodyklasse toe te voegen aan de lijst van wortels waarop de gedeelde laag hertokent. Hertokenen gebeurt op de wortel van een component of gemigreerde pagina, nooit op `:root`, want de oude inhoud leest dezelfde tokens. De drie juridische pagina's hebben geen chrome en laden de laag niet.

Expliciet niet: scanlines, glow, groen-op-zwart, matrixregen, mascottes, badges op de voorgrond, kickers en eyebrows.

**Key Characteristics:**
- Papier, inkt, één signaalrood. Verder niets buiten de terminalmodule.
- Een 12-koloms raster zonder goot, met zichtbare haarlijnen van 1px in de hero en in de cijfertabel, en nergens anders.
- De naad op kolom 8: links het ding, rechts de uitleg.
- Eén schaal voor de grote vormen: de h1, de getallen in de cijfertabel en de slotkop staan alle drie op afficheschaal.
- Toestanden via inversie (inktblok, papieren letter), nooit via een extra kleur.
- Hoeken van 0, geen schaduwen, geen zichtbare verlopen.
- Eén reeks per command, regel voor regel: de registratie. Het terminalvenster staat altijd op hele regels.

## Colors

Een neutraal-koel papier met zwarte inkt en één verzadigd rood. Daarbinnen een zwarte module die dezelfde papierfamilie spreekt, met alleen voor fout en waarschuwing een eigen tint.

### Primary
- **Signaalrood** (#cc0a1e): de enige kleur buiten de module. Het vult alleen de primaire actie ("Start de simulator", ook in de mobiele CTA-balk en op de inktband van het slot, waar het als niet-tekstig vlak 3,26 haalt op inkt) en tekent de focusring van 2px op elk focusbaar element. Binnen de module is het alleen de cursor (3,42 op de modulegrond, 3,63 op de donkere modulegrond; niet-tekst, lat 3). Wit op rood haalt 5,79:1, rood op papier 5,02:1. Kleine rode tekst komt niet voor.
- **Letter op rood** (#ffffff): de letter van de primaire actie, altijd vet en groot (20,7px op desktop, minimaal 19px).

### Neutral
- **Papier** (#efefec): de grond. Neutraal-koel gebroken wit, bewust geen crème.
- **Band** (#e2e2de): de achtergrond van afwisselende secties (Leerpad, Vragen, Nieuwsbrief). Inkt erop haalt 14,54:1.
- **Inkt** (#111111): alle tekst, koppen, kaders en elk geïnverteerd blok. Haalt 16,39:1 op papier.
- **Gedempte inkt** (#444440): inleidingen, microcopy, kolomkoppen, bronnen en indexnummers in rust. Haalt 8,49 op papier en 7,53 op de band.
- **Rasterlijn** (#c9c9c4): de haarlijnen van het raster. Decoratief, ze dragen geen informatie.
- **Bedieningslijn** (#7a7a75): randen van bedieningselementen en de scheidingslijnen tussen rijen in tabel en FAQ. Haalt 3,74 op papier en 3,32 op de band (lat 3 voor niet-tekst).

### De terminalmodule
Deze kleuren gelden alleen binnen de rand van de zwarte module (hero-terminal, transcripten in Herkenbaar, commandoblokken in het leerpad). Het is inhoud van de simulator, geen decoratie van de pagina. Ze komen nooit op papier. Contrast hieronder op de modulegrond (#0a0a0a); op de donkere modulegrond (#000000) is het telkens hoger.
- **Modulegrond** (#0a0a0a) met **modulelijn** (#2c2c2a) tussen kop, lichaam en invoerregel.
- **Uitvoer** (#d6d6d2, 13,58:1) en **gedimde uitvoer** (#a3a39d, 7,81:1): uit de papierfamilie, niet blauwgrijs.
- **Prompt** (#efefec in 700, 17,18:1): de promptregel en de invoerregel. Gewicht onderscheidt de prompt, geen tint.
- **Label** (#efefec met **labelinkt** #111111, 16,39:1): de info-rol (`[TIP]` en `[→]`) staat als papieren label achter de tekst, binnen de module. Het label hoort bij de rol, niet bij het woord: de renderer geeft `[?]`, `[→]` en `[TIP]` één rol. Vaste kleuren, ook in het donkere thema.
- **Fout** (#fa7c76, 7,74:1): zalm, en uitdrukkelijk niet het signaalrood.
- **Waarschuwing** (#d29922, 7,84:1): amber.
- **Glos in de module** (#d6d6d2, 13,58:1): alleen onder 768px, waar de uitleg onder zijn regel in de module staat. Dezelfde waarde als de uitvoer.
- **Oplichten** (#23231f): de achtergrond van een regel tijdens de registratie (450ms). Uitvoer erop haalt 10,82, prompt 13,69.

### Het donkere thema
Papier en inkt wisselen van rol. De grond wordt #111111 en de letter #efefec. Daarnaast: band #1c1c1b, gedempte inkt #b0b0ab (8,67 op de grond), rasterlijn #2e2e2c, bedieningslijn #6f6f6a (3,74). De module wordt #000000 met modulelijn #3a3a37 en krijgt een haarlijn in de bedieningslijnkleur, zodat hij als module leest en niet als gat. Het rood blijft; als niet-tekstig merkteken haalt het 3,26 op de grond. Het tiplabel blijft papier met inkt, anders verdwijnt het in de grond. De footer is in beide thema's een inktvlak met een eigen token: in licht #111111, in donker #000000, zodat hij zich van de donkere grond scheidt. Een eigen token en niet de inkt, want in de footer draaien papier en inkt om; daar is papier de letter (16,39 op #111111) en is de gedempte letter #b0b0ab (8,67), voor tagline en copyright. Het slot volgt het token en niet de toon: in donker is het de lichte band (#efefec) met een donkere letter, en de rode actie erop inverteert bij hover naar de grond (#111111).

### Named Rules
**The One Voice Rule.** Het rood betekent alleen "jij bent aan zet": de primaire actie, de focusring en de cursor in de module. Buiten de module is er per scherm één rode drager; een tweede actie in hetzelfde scherm (de nav-CTA, een volgende chip, een actieve toestand) wordt inkt. Binnen de module is rood alleen de cursor, een blok van één teken op het invoerpunt. Bij overname verdwijnt dat blok en blijft alleen de native caret, ook rood: nooit twee rode cursors.

**The Inversion Rule.** Een toestand krijgt geen nieuwe kleur. Hover, volgende en oplichten, de toestanden die je zelf veroorzaakt of die je de weg wijzen, zijn allemaal hetzelfde gebaar: inktblok, papieren letter. Binnen een blok dat al geïnverteerd is, inverteert het label terug. Waar je bent is oriëntatie en geen toestand: de huidige pagina in de navbar is een onderstreping van 2px, de taal van een tekstlink, en geen inktblok. Anders zijn "hier ben je" en "hier wijs je" hetzelfde gebaar, en wijst het zwaarste vlak van de balk naar waar je al bent.

**The Module Boundary Rule.** De simulatortinten (zalm, amber) leven alleen binnen de zwarte module, en het papieren label ook. Buiten de module is er geen groen en geen andere accentkleur dan het rood.

## Typography

**Display Font:** Archivo (met Atkinson Hyperlegible Next, -apple-system, Segoe UI, sans-serif)
**Body Font:** Atkinson Hyperlegible Next (met -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif)
**Label/Mono Font:** JetBrains Mono (met een eigen subset voor kadertekens vooraan, dan Courier New, monospace)

**Character:** Een neo-grotesk op afficheschaal, strak op het raster opgebouwd, met een lopende letter die is ontworpen om verwarbare tekens uit elkaar te houden. Archivo is zelf gehost op wdth 100 en gewicht 700-800, en laadt op elke pagina met chrome, want het woordmerk in navbar en footer staat erin. 900 is er bewust uit.

De rem-basis is 18px op desktop en 16px onder 768px. De maten hieronder schalen daarmee mee.

### Hierarchy
- **Affiche** (Archivo 700, clamp(2.2rem, 6.2vw, 4.9rem), max 88,2px, regelhoogte 0,94, spatiëring -0,02em): de h1 en de slotkop, allebei over alle twaalf kolommen. Het plafond is de rasterbreedte en niet de viewport: van 1280 tot 1920px staat de h1 op twee regels. Op 375 is hij 35,2px. De slotkop deelt de schaal met de h1, zodat de pagina eindigt in de vorm waarin ze begint. Er is geen kop groter dan de h1; even groot mag.
- **Headline** (Archivo 700, clamp(1.75rem, 3.3vw, 2.85rem), max 51,3px, regelhoogte 1,05, spatiëring -0,02em): sectiekoppen over kolom 1-7, met `text-wrap: balance`.
- **Figure** (Archivo 700, afficheschaal, tabelcijfers): de getallen in de cijfertabel, op dezelfde maat als de h1. Altijd in inkt en in een tabelrij met zijn bron, nooit als los accentgetal in een kaart. Omschrijving en bron staan op de basislijn van het getal (bij een omschrijving over twee regels: de laatste).
- **Title** (Archivo 700, 1.22rem = 22px, regelhoogte 1,2): h3 in Herkenbaar. De FAQ-vraag gebruikt Archivo 700 op 1.1rem.
- **Label** (Archivo 800, 1.1rem tot 1.22rem): namen die iets aanduiden in plaats van iets te beweren: het woordmerk en de niveaus in het leerpad (1.22rem).
- **Body** (Atkinson 400, 1rem, regelhoogte 1,55, max 62ch, ongeveer 75 tekens): alle lopende tekst, ook de ondertitel in de hero. Een inleiding onder een kop is 1.1rem in gedempte inkt, max 52ch. De omschrijving in de cijfertabel is 1.1rem in inkt (1rem onder 768px) en heeft geen eigen max-width: de cel (kolom 4-9) is de maat. De zin in het slot is 1.1rem.
- **Small** (Atkinson, 0.83rem = 15px): microcopy, de glos, de kolomkop, privacyregels. Een kop boven een kolom op de naad ("In gewoon Nederlands" boven de glos, "Verder lezen op de blog" boven de kantlijn) is Small in 700 en gedempte inkt (#444440): het gewicht maakt het een kop, de kleur zet hem achter wat hij aankondigt. De uitnodiging naast de invoerregel is Small 700 in inkt.
- **Button** (Atkinson 700): de primaire actie op max(1.15rem, 19px), zodat hij op elke breedte grote tekst blijft. De secundaire knop staat op 0.9rem.
- **Mono** (JetBrains Mono 400, 0.86rem, regelhoogte 1.5rem = 27px in de module; onder 768px 0.8rem op een regel van 24px): terminaluitvoer, de invoerregel (700) en de commands in chips (700). In de transcripten van Herkenbaar 0.8rem, regelhoogte 1,6. Buiten de module op 0.83rem voor indexnummers (700 in tabellen), adressen, bronnen en paginaverwijzingen, en op 0.75rem voor paden.

### Named Rules
**The Mono Is Evidence Rule.** JetBrains Mono staat alleen in de terminal en voor dingen die je letterlijk kunt nalopen: indexnummers, paden, adressen, bronnen, paginaverwijzingen. Nooit voor koppen of lopende tekst.

**The Numbered Order Rule.** Een mono-index (01-06, 01-03) staat alleen waar de volgorde zelf de informatie is: de chips, het leerpad en de inhoud van de sample. Sectiekoppen worden nooit genummerd.

**The Two Weights Rule.** Archivo 700 is voor een bewering (koppen, cijfers), Archivo 800 voor een naam (een merk of een niveau). Andere gewichten van Archivo worden niet gebruikt.

**The Literal Output Rule.** Terminaluitvoer staat er zoals de tool hem schrijft. Een smalle breedte herschikt de uitvoer niet; alleen de zachte omslag springt in (onder 768px 1,8em, drie tekens), op de lijn van een harde vervolgregel.

## Layout

Het raster heeft 12 kolommen (`repeat(12, minmax(0, 1fr))`) zonder goot, is maximaal 1400px breed en heeft een zijrand van clamp(16px, 3vw, 32px). Omdat er geen goot is, zijn de kolomgrenzen de lijnen, en elke cel geeft zijn inhoud zelf binnenruimte (clamp(12px, 1.4vw, 20px)). Kinderen erven het raster via subgrid.

**Haarlijnen in de hero en in de cijfers, verder nergens.** Twaalf verticale lijnen van 1px in de rasterlijnkleur (onder 768px vier), getekend als één achtergrondlaag op de contentbox. In de hero ís het raster de vorm. In "HackSimulator in cijfers" is het een tabel: de kolomlijnen kruisen de rijlijnen. In beide snijdt de tekst zich er met een papieren achtergrond uit (`width: fit-content`), zodat er geen lijn door een regel tekst of een cijfer loopt. Dat geldt voor elke alinea in de hero, voor de kop en inleiding van de cijfers en voor elke cel van de tabel. De h1 op afficheschaal mag over het raster staan. In de andere secties staan geen verticale haarlijnen: daar draagt de naad het raster.

**Het eerste scherm: lucht naar groep.** Kop, ondertitel en actie zijn één groep en staan dicht op elkaar, in leesvolgorde onder elkaar: de kop over alle twaalf kolommen, de ondertitel in kolom 1-8, de rode actie eronder in de leesrij. Vanaf 1280px staat de microcopy naast de knop (20px ertussen), daaronder eronder (8px). De groep begint clamp(24px, 2.5vw, 44px) onder de nav en houdt clamp(40px, 3.45vw, 56px) tot de terminal: de stap naar de terminal is de grote, minstens 40px en 1,4x de grootste stap binnen de groep. Direct onder de invoerregel ligt de toetsenrij, zonder tussenruimte. De vouw is een eis: op 1440x900 en 1280x800 staan de invoerregel en de hele toetsenrij boven de vouw, op 1024x768 de hele terminal met zijn uitnodiging.

**De cijfertabel op het raster.** De tabel loopt over alle twaalf kolommen (subgrid): het getal in kolom 1-3 op afficheschaal, de omschrijving in kolom 4-9 en de bron (een pad in mono) in kolom 10-12, rechts uitgelijnd. De cellen staan op de rasterlijnen en dragen zelf hun binnenruimte (de celmaat), links en rechts gelijk. Onder 768px heeft het raster vier kolommen: het getal staat in kolom 1, zonder binnenruimte op de lijn ("40+" past op 320 niet met marge in 72px), de omschrijving in kolom 2-4 en de bron als tweede regel onder de omschrijving. Een rij inverteert bij hover én bij focus: de rij, elke cel en de bron worden inkt met een papieren letter, en focus tekent daarnaast de rode ring.

**De inhoud van de sample, dezelfde grammatica.** Kop, inleiding (kolom 1-7, max 62ch), inhoud en actie staan onder elkaar, in leesvolgorde. De inhoudstabel staat op het raster: index in kolom 1, titel in kolom 2-10, paginaverwijzing rechts in kolom 11-12, elke cel met de celmaat van zijn lijn. Onder 768px houdt de rij een eigen raster, met de index op de lijn, zoals het getal in de cijfertabel.

**Het slot als tegenhanger van de hero.** De slotkop staat op afficheschaal over alle twaalf kolommen, op elke breedte. Vanaf 1280px staan op één rij de zin (kolom 1-8, max 62ch) en de actie als kolom in 10-12: de rode knop met de microcopy eronder, 8px ertussen. Daaronder staan kop, zin en actie onder elkaar, zin en actie in kolom 1-7.

**De naad.** Kolom 1-7 is voor het ding (terminal, transcript, vragen) en kolom 8-12 voor de uitleg of de vervolgstap (glos, bloglinks, nieuwsbriefveld). De glos-kolom is alleen voor uitleg naast iets links. Wat bij een kop hoort, staat onder die kop. Drie secties gebruiken het hele raster in plaats van de naad: de cijfertabel (1-3, 4-9, 10-12), de sample-inhoud (1, 2-10, 11-12) en het slot (1-8, 10-12).

**De registratie.** Outputregel en glos zijn één rij met twee cellen. De module is precies 7/12 van het raster breed, gemeten tegen de rastercontainer en niet tegen het scrollende lichaam, zodat een scrollbalk de naad niet verschuift. De glos hangt met een aanhaallijn van 1px in inkt aan zijn regel. Elke reeks heeft minstens één glos: ook waar de uitvoer al Nederlands is, legt de glos uit wat er gebeurt of waar een naam vandaan komt, zodat de kolom "In gewoon Nederlands" nooit leeg staat.

**Het venster op hele regels.** Het terminalvenster is een geheel aantal regels hoog: zeven regels van 27px plus 16px (vanaf 768px), twaalf regels van 24px plus 16px = 304px (daaronder). De lucht van 8px boven en onder is een transparante rand en geen padding, want padding scrolt mee en laat een halve naburige regel doorpiepen. Elke rij is precies één regel hoog: de glos krijgt vanaf 768px een marge van -1px onder, omdat hij op de basislijn 1px (of 0,5px) zakt.

**Ritme naar gewicht.** Hoofdsecties (Herkenbaar, Leerpad, Vragen) krijgen clamp(72px, 9vw, 136px) boven en onder. Korte secties (cijfers, slot, sample, nieuwsbrief) krijgen clamp(48px, 5vw, 72px), zodat de lucht nooit groter is dan de inhoud. Secties wisselen tussen papier en band. Het slot is de enige inktband onder de hero, met de rode actie erop; de sample erna staat op papier. Onderaan is de volgorde dus band (vragen), inkt (slot), papier (sample), band (nieuwsbrief). De eerste sectie na de hero begint met een inktlijn van 1px.

**Responsief.**
- Vanaf 1280px staat de microcopy naast de hero-actie, staat de toetsenrij op zes chips (twee rasterkolommen per chip) en staat het slot op één rij.
- Onder 1280px staat de microcopy onder de knop en gaan de chips naar drie per rij.
- De navbar klapt niet in op een vaste breedte maar op wat past: zodra de uitgeklapte nav niet meer in de balk staat met minstens 64px tussen het woordmerk en de eerste link, klapt hij in tot een menublad. Links breken nooit, dus wat niet past loopt uit en wordt gezien; dat werkt ook bij alleen-tekstzoom. Gemeten ligt de omslag rond 1224-1232px (marketing) en 1000-1008px (terminal). De mobiele CTA-balk met de rode actie neemt de rol van de nav-CTA over op hetzelfde moment, niet op een eigen grens.
- Onder 1024px gaan vragen en leerpad over de volle breedte. Leerpadkolommen worden rijen met een inktlijn ertussen, de bloglinks komen onder de vragen, en de terminalkop toont alleen de omvang.
- Onder 768px wordt het raster 4 kolommen, ook de haarlijnen. De cijfertabel wordt getal (kolom 1) naast omschrijving met de bron eronder (kolom 2-4). De glos gaat de module in, onder zijn regel, in 0.78rem, met een aanhaallijn van 1ch in gedimde uitvoer. De kolomkop vervalt, de uitnodiging komt onder de invoerregel zonder aanhaallijn, en de chips staan twee aan twee met de index boven het command.
- Onder 352px mag een command in een chip op de spatie breken.

## Elevation & Depth

Het systeem is volledig plat. Er zijn geen schaduwen, ook niet bij hover of focus, en elke gedeelde component die er een meebrengt, krijgt hier `box-shadow: none`. Er is ook geen lift of `transform` bij hover. Scheiding komt van drie dingen: de zwarte module op papier, een haarlijn van 1px (inkt of bedieningslijn), en het afwisselen van papier en band. Nadruk komt van inversie.

### Named Rules
**The Paper Has No Z-Axis Rule.** Niets zweeft. Een element is papier, inkt of module. Wil je iets laten opvallen, dan inverteer je het. Je tilt het nooit op.

**The Drawn Line Rule.** Een lineair verloop met harde stops is hier gereedschap om lijnen en vlakken te tekenen (de rasterlijnen, de modulegrond naast de glos). Dat mag. Een zichtbare overgang tussen twee kleuren mag nooit.

## Shapes

Elke hoek is recht (0). Knoppen, chips, velden, de module, het tiplabel, de cursor, de FAQ-items en de consentbanner hebben allemaal een radius van 0. Randen zijn inkt: 1px voor knoppen, velden en kolomscheidingen, 2px voor de commandochips (klikbaar) en voor de bovenlijn van tabellen en vragenlijst. Aangrenzende chips delen één lijn van 2px: een chip na de eerste in zijn rij laat zijn linkerrand weg, een rij na de eerste zijn bovenrand, en krijgt die 2px als binnenruimte terug. Rijen binnen een tabel of lijst worden gescheiden door 1px in de bedieningslijnkleur.

## Components

### Buttons
Rechthoekig, plat en direct. Een knop is een blok dat inverteert.
- **Shape:** rechte hoeken (0), geen schaduw, geen icoon, geen lift.
- **Primary:** signaalrood vlak met een witte letter in Atkinson 700 op max(1.15rem, 19px), padding 14px 28px, minimaal 56px hoog (52px in de mobiele CTA-balk). Eén per scherm.
- **Hover / Focus:** het vlak inverteert naar inkt met een papieren letter, via een overgang van 160ms op achtergrond en letterkleur. Focus tekent daarnaast de rode ring (2px, offset 2px). Op de inktband van het slot inverteert de actie naar papier met een inkten letter, anders verdwijnt hij in zijn grond.
- **Secondary:** een kader van 1px in inkt met een inkten letter in Atkinson 700 op 0.9rem, padding 10px 18px, minimaal 44px hoog. Bij hover inverteert hij. De gevulde variant begint als inkt en wordt bij hover weer papier.
- **Nav-CTA:** hetzelfde label als de hero-actie, maar als inkten kader. Het rood blijft voor de hero.

### Command chips (de toetsenrij)
De zes suggesties onder de invoerregel. Het zijn toetsen van de terminal, geen tags.
- **Style:** één rij zonder tussenruimte, strak onder de invoerregel, met de randen op de rasterlijnen: zes gelijke kolommen vanaf 1280px, drie tot 1279, twee onder 768. Elke chip is papier met een kader van 2px in inkt, minimaal 52px hoog, padding 8px plus de celmaat (vanaf 1280px 12px, en 14px na een gedeelde lijn). Links een mono-index (0.83rem, gedempt, 1,8em breed: drie tekens voor `[✓]`; vanaf 1280px 1,6em, waar een gedane `[✓]` 0,2em in de gap steekt, zodat "nmap 192.168.1.1" in Firefox en WebKit 6px lucht tot zijn rand houdt), rechts het command in mono 700 (0.86rem, breekt nooit). Er is geen herkomstlabel: wie begint heeft geen derde tekstniveau nodig om te tikken.
- **State:** hover en focus inverteren de hele chip. De volgende suggestie keert alleen het indexnummer om (inktblok, papieren cijfer); in een geïnverteerde chip keert dat nummer terug naar papier. Een gedane chip vervangt het nummer door `[✓]` zonder dat de kolom verspringt.

### Cards / Containers
Er zijn geen kaarten. Inhoud staat in rijen en kolommen, gescheiden door haarlijnen.
- **Corner Style:** recht (0).
- **Background:** papier, of de band voor een hele sectie, of inkt voor het slot. De zwarte module is het enige vlak binnen een sectie.
- **Shadow Strategy:** geen, zie Elevation & Depth.
- **Border:** tabelrijen (de cijfertabel en de inhoud van de sample) en FAQ-items hebben een onderlijn van 1px in de bedieningslijnkleur onder een bovenlijn van 2px in inkt. Leerpadkolommen hebben een scheidingslijn van 1px in inkt.
- **Internal Padding:** de celmaat clamp(12px, 1.4vw, 20px) horizontaal, aan beide kanten van een cel op een rasterlijn. Rijen van de cijfertabel hebben 16px boven en onder en geen minimumhoogte: het getal op afficheschaal bepaalt de hoogte. Rijen van de sample-inhoud hebben 10px.

### Inputs / Fields
- **Style:** het nieuwsbriefveld is papier met een kader van 1px in inkt, 56px hoog, padding 0 16px, radius 0 en Atkinson 1rem. De knop ernaast is een inktblok van 56px. Vanaf 1024px staan ze op één rij tot de rasterrand, zonder rechterrand op het veld. Daaronder staan ze onder elkaar en neemt de knop de volle breedte.
- **Focus:** de rode ring (2px, offset 2px), net als elk ander element. Het kader blijft inkt.
- **Terminalinvoer:** een mono-invoerregel (700, prompt in papier) in de module, minimaal 44px hoog. In rust staat er een staand (niet knipperend) blok signaalrood van één teken, precies op het invoerpunt; het is beeld en vangt geen klik. Bij overname verdwijnt het blok en neemt de native caret (rood) het over. Bij focus krijgt de hele invoerregel de rode ring, boven de toetsenrij.

### Navigation
Eén navbar op elke pagina met chrome, in twee varianten (de marketingnav en de app-navbar van de terminal) met dezelfde vorm, dezelfde rail en hetzelfde menublad.
- **Style:** een balk van papier met een inktlijn van 1px eronder (donker: geïnverteerd). Woordmerk en hamburger staan op de rail van het raster, links en rechts even ver van de rand. Het woordmerk staat in Archivo 800 en is geen actie: het heeft geen onderstreping en wisselt niet van kleur, in rust noch bij hover, en in de footer net zo.
- **Links:** inkt zonder onderstreping, op één regel (ze breken nooit), 16px uit elkaar. Bij hover inverteren ze tot een inktblok.
- **Actief:** de pagina waar je bent krijgt een onderstreping van 2px in inkt (offset 0.2em), zonder extra gewicht. Elke navbestemming heeft hem. Bij hover inverteert ook de actieve link; de onderstreping gaat mee in de papieren letter.
- **Nav-CTA:** een inkten kader van 1px op elke pagina, dat bij hover inverteert. Rood is per scherm één drager, de primaire actie van de pagina zelf.
- **Focus:** de rode ring (2px, offset 2px, radius 0) op elk element van de chrome: links, woordmerk, schakelaar, menu, footer en banner.
- **Themaschakelaar (uitgeklapt):** twee iconen in een tikdoel van minstens 44px; de labels zijn er alleen voor schermlezers.
- **Help-menu (terminal):** een blad van papier met een inkten kader, zonder schaduw en zonder animatie; een regel inverteert. De trigger draagt een SVG-chevron die 180 graden draait als het menu open is.
- **Ingeklapt (het menublad):** één ontwerp voor beide navbars. Het blad is papier; elke link is een rij van minstens 44px met een inktlijn van 1px eronder, en de onderlijn van de laatste link is de enige lijn vóór de acties. De acties (zoeken, GitHub, schakelaar) zijn blokken met een inkten kader over de volle breedte, met hun label in de letter van het blad naast het icoon, in zinskapitaal. De schakelaar is twee gelijke helften van minstens 44px met "Donker" en "Licht" in de lettermaat van het blad. Het hamburgerteken is inkt.
- **Mobiele CTA-balk (index):** papier met een inktlijn van 1px erboven, de rode actie van 52px hoog over de volle breedte (max 420px). Hij verschijnt wanneer de navbar inklapt.

### Footer
- **Style:** een inktvlak in beide thema's (het footertoken), op de rail van het raster: dezelfde zijrand en dezelfde contentbreedte als nav en raster. Papier en inkt draaien er om: de letter is papier, tagline en copyright staan in de gedempte letter #b0b0ab.
- **Links:** papier zonder onderstreping; bij hover een onderstreping van 2px. De Ko-fi-link en het GitHub-icoon zijn een blok met een papieren kader dat inverteert.

### Consentbanner
Het eerste wat elke nieuwe bezoeker ziet, op elke pagina met chrome.
- **Style:** papier met een inktlijn van 1px erboven, op de rail van het raster, radius 0.
- **Meer info:** een tekstlink (onderstreping 1px, bij hover 2px).
- **Knoppen:** twee gelijkwaardige knoppen met een inkten kader van 1px, Atkinson 700, minstens 44px hoog; hover en focus inverteren. Weigeren oogt nooit zwakker dan accepteren.

### Links
Een tekstlink is inkt met een onderstreping van 1px, offset 0.2em. Bij hover wordt de onderstreping 2px. Dezelfde taal draagt de oriëntatie in de navbar: de huidige pagina staat op een onderstreping van 2px. In de footer staan de links zonder onderstreping in rust; daar is de onderstreping van 2px de hover. Staat een link als blok in een lijst (bloglinks, tabelrijen), dan inverteert het blok in plaats daarvan, met 8px lucht naast de letters (in de cijfertabel de celmaat), bij hover en bij focus. Een bloglink noemt zijn pad in mono (0.75rem, gedempt) onder de titel, zoals een cijfer zijn bron noemt, en nooit erboven. Het pad ligt in de onderpadding van de link en vangt geen tik, zodat het tikdoel van 44px heel blijft.

### Terminal module (signatuur)
Een zwarte module over kolom 1-7 met een mono kopregel (titel en omvang), een lichaam van zeven hele regels van 27px, en een invoerregel. Het lichaam loopt over alle twaalf kolommen: links de module, rechts op papier de glos per regel. Naast de kopregel staat de kolomkop "In gewoon Nederlands"; naast de invoerregel de uitnodiging, met dezelfde aanhaallijn als een glos.

De rollen in de module: uitvoer in de papierfamilie, de prompt in papier 700, de info-rol (`[TIP]`, `[→]`) als papieren label achter de tekst (padding 1px 6px, breekt mee met de regel), fout in zalm, waarschuwing in amber, `[~]` gedimd. Dezelfde rollen en hetzelfde label gelden in de transcripten van Herkenbaar.

Elk command speelt één reeks, regel voor regel. De rijen staan meteen in de DOM; alleen het beeld wacht. Elke rij rolt in 180ms van links open (een clip-path), 90ms na de vorige, en alleen de rijen in het venster tellen mee. Op het moment van verschijnen lichten outputregel en glos samen op als één rij: de regel krijgt de oplichtkleur en de glos inverteert naar inkt. Dat gebeurt zonder overgang erin, staat 450ms, en loopt uit in 700ms in cubic-bezier(0.16, 1, 0.3, 1). Er is geen typanimatie per letter en geen lus. Onder `prefers-reduced-motion` staat meteen de eindstand, bij laden en bij zelf typen.

De auto-demo speelt alleen `nmap 192.168.1.1`, bij laden. Dat nmap-frame is daarna de ruststand: de poortregels staan met hun glos in beeld, met de tip op zijn label. Neemt de bezoeker de terminal over, dan is de demo-uitvoer weg en komt hij niet terug.

## Do's and Don'ts

### Do:
- **Do** zet het signaalrood (#cc0a1e) alleen op de primaire actie, op de focusring (2px, offset 2px) en, binnen de module, op de cursor. Buiten de module één rode drager per scherm.
- **Do** laat elke toestand spreken via inversie: inktblok (#111111), papieren letter (#efefec).
- **Do** markeer de pagina waar je bent met een onderstreping van 2px. Oriëntatie is geen toestand; de inversie is voor hover.
- **Do** houd de hovertaal op twee woorden: een blok inverteert, een tekstlink gaat van een onderstreping van 1px naar 2px. Nooit allebei tegelijk, en nooit een tweede lijn.
- **Do** zet uitleg op de naad: het ding in kolom 1-7, de uitleg in kolom 8-12, op dezelfde rasterrij. Geef elke reeks minstens één glos.
- **Do** laat tekst in een raster met haarlijnen (hero en cijfers) zich met een papieren achtergrond uit de lijnen snijden: alinea's, kop en inleiding, en elke tabelcel.
- **Do** geef een cel op een rasterlijn zijn binnenruimte zelf, links en rechts gelijk (de celmaat).
- **Do** groepeer met lucht: wat bij elkaar hoort staat dicht, de stap naar het volgende blok is de grote.
- **Do** houd elk terminalvenster op een geheel aantal regels; lucht boven en onder is een rand, geen padding.
- **Do** hertoken gedeelde componenten op hun wortel (de component of de bodyklasse van een gemigreerde pagina), nooit op `:root`, en zet de vormeigenschappen die je wilt expliciet (rand 0, schaduw none, radius 0), zodat de vorm van de oude wereld niet doorlekt.
- **Do** laat de navbar inklappen op wat past, niet op een px-grens: links op één regel, minstens 64px tussen woordmerk en eerste link. Wat aan het inklappen hangt (de mobiele CTA-balk) gaat mee op hetzelfde moment.
- **Do** zet de chrome (nav, footer, banner) op de rail van het raster: dezelfde zijrand clamp(16px, 3vw, 32px) en dezelfde contentbreedte.
- **Do** houd zalm, amber en het papieren label binnen de zwarte module (#0a0a0a).
- **Do** maak tikdoelen minimaal 44px. De primaire actie is 56px.

### Don't:
- **Don't** gebruik schaduwen, zichtbare kleurverlopen, afgeronde hoeken of lift bij hover.
- **Don't** introduceer een tweede accentkleur of kleur een toestand in een andere tint dan inkt.
- **Don't** zet rood op kleine tekst, en gebruik het niet voor fouten: een fout in de terminal is zalm (#fa7c76).
- **Don't** gebruik groen, glow, scanlines, matrixregen of groen-op-zwart, ook niet in de module: de prompt is papier in 700.
- **Don't** zet een strook over de volle modulebreedte om een regel te markeren; de info-rol is een label achter de tekst.
- **Don't** herschik terminaluitvoer voor een smalle breedte; alleen de zachte omslag springt in.
- **Don't** gebruik mascottes, badges op de voorgrond, kickers of eyebrows boven koppen.
- **Don't** gebruik een teken (`+`, `→`, `►`) als icoon. Een icoon is een SVG; een hoverpijl is overbodig, de inversie is de feedback.
- **Don't** maak in de consentbanner de ene keuze zwakker dan de andere.
- **Don't** zet getallen als los accentgetal in een kaart. Een cijfer staat in een tabelrij met zijn bron.
- **Don't** nummer sectiekoppen. Een mono-index is alleen voor een echte volgorde.
- **Don't** trek verticale rasterlijnen buiten de hero en de cijfertabel. In de andere secties draagt de naad het raster.
- **Don't** maak een kop groter dan de h1. Even groot mag: de slotkop en de cijfers delen zijn schaal.
- **Don't** voeg een tweede beweging toe naast de registratie. Eén reeks per command, regel voor regel (90ms), zonder typanimatie per letter en zonder lus. Een hover-overgang is hoogstens 160ms op kleur, de cursor knippert niet, en de FAQ opent zonder animatie.
