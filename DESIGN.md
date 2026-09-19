---
name: HackSimulator.nl
description: Nederlandstalige terminalsimulator waarin beginners ethisch hacken leren zonder iets te kunnen breken
colors:
  neon-lime: "#9fef00"
  neon-lime-hover: "#8ad600"
  lime-aaa-light: "#7ac800"
  forest-cta-light: "#166534"
  night: "#0d1117"
  night-sunken: "#080b0f"
  night-raised: "#161b22"
  night-hover: "#21262d"
  chrome-black: "#1a1a1a"
  soft-white: "#c9d1d9"
  dim-grey: "#a1a8b0"
  border-grey: "#30363d"
  azure-deep: "#004494"
  signal-error: "#fa7c76"
  signal-warning: "#d29922"
  signal-info: "#79c0ff"
  signal-success: "#3fb950"
  footer-text-dim: "#a1a8b0"
  footer-text-strong: "#ffffff"
  bg-navbar-mobile: "#000000"
  bg-demo-terminal: "#000000"
  traffic-light-red: "#ff5f56"
  traffic-light-yellow: "#ffbd2e"
  traffic-light-green: "#27c93f"
  paper-light: "#f8f8f8"
  paper-sunken-light: "#eceef0"
  paper-raised-light: "#ffffff"
  ink-light: "#0a0a0a"
typography:
  display:
    fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "63px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-1px"
  headline:
    fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "45px"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "22.5px"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono Box, JetBrains Mono, Courier New, monospace"
    fontSize: "13.5px"
    fontWeight: 500
    letterSpacing: "0.5px"
  terminal:
    fontFamily: "JetBrains Mono Box, JetBrains Mono, Courier New, Courier, monospace"
    fontSize: "18px"
    lineHeight: 1.5
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.neon-lime}"
    textColor: "{colors.night}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.neon-lime-hover}"
    textColor: "{colors.night}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.dim-grey}"
    borderColor: "{colors.dim-grey}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.night-raised}"
    borderColor: "{colors.border-grey}"
    padding: "32px"
  eyebrow-badge:
    textColor: "{colors.neon-lime}"
    borderColor: "{colors.neon-lime}"
    padding: "4px 16px"
  terminal-input:
    backgroundColor: "{colors.night}"
    textColor: "{colors.neon-lime}"
    borderColor: "{colors.border-grey}"
    rounded: "0"
    padding: "8px 12px"
---

# Design System: HackSimulator.nl

> Afgeleid uit `styles/` en uit gerenderde computed styles op 19 september 2026, niet uit
> `docs/style-guide.md`. Waar dit document en de CSS uiteenlopen wint de CSS: dat is wat
> er draait. `docs/style-guide.md` blijft het menselijke document en volgt.
>
> Dit is een **vertrekpunt, geen bevriezing**. De identiteit ligt vast, de uitvoering niet.

## Overview

**Creative North Star: "De ondertitelde terminal"**

Alles ziet er echt en Engels uit, met Nederlands dat er rustig naast meeloopt. Dat is
tegelijk de positionering van het product en de vorm van elke output: de tool spreekt zoals
de echte tool spreekt, en de uitleg staat ernaast in plaats van eroverheen. Een bezoeker
die op Engels afhaakt kan hier meekijken zonder dat het echte werk verwatert.

Het systeem is donker, vlak en precies. De diepte komt niet uit schaduw maar uit een
toonladder van vier stappen en uit haarlijnen van 1px. Het neon-lime accent is zeldzaam:
het markeert waar jij aan zet bent (de prompt, wat je typt, de primaire CTA) en verder
niets. Die zeldzaamheid is de reden dat het werkt. De omliggende site is bewust stiller dan
het terminalvenster, zodat het terminalvenster de hoofdrol houdt.

Toon is bemoedigend en nuchter. Geen hype, geen opgeklopte cijfers, geen urgentie die er
niet is. Wat je ziet is wat het is.

**Key Characteristics:**
- Donkerbasis `#0d1117` met een tonale ladder in vier stappen; geen schaduwen.
- Eén schel accent (`#9fef00`), spaarzaam ingezet als signaal, nooit als decoratie.
- Drie fonts met drie duidelijke rollen: Space Grotesk kopt, Inter leest, JetBrains Mono werkt.
- Volwaardig licht thema met eigen AAA-afgestemde waarden, niet een omgekeerd donker thema.
- Chrome (navbar, footer) blijft donker in beide thema's: het Dark Frame-patroon.

## Colors

Een donkere GitHub-achtige basis met precies één schel accent, en een lichte tegenhanger
waarin elk accent opnieuw is afgestemd in plaats van omgedraaid.

### Primary
- **Neon Lime** (`#9fef00`): de prompt, de tekst die jij typt, de primaire CTA en de
  hover-accenten in navbar en footer. Dit is de kleur van "hier ben jij aan zet". In het
  lichte thema wordt dit `#7ac800` op donkere oppervlakken en `#166534` (Forest CTA) waar
  witte tekst erop moet: hetzelfde signaal, opnieuw gemeten voor AAA.

### Secondary
- **Azure Deep** (`#004494`): secundaire knoppen met witte tekst, 7,2:1. Draagt de acties
  die wel belangrijk maar niet de hoofdweg zijn.

### Tertiary
De statuskleuren. Ze zijn bewust gedempt zodat ze naast elkaar kunnen staan zonder te
schreeuwen, en elk haalt AAA op de donkere basis:
- **Signal Success** (`#3fb950`): positieve terugkoppeling. Nadrukkelijk onderscheiden van
  Neon Lime — succes is niet hetzelfde als "jij bent aan zet".
- **Signal Error** (`#fa7c76`), **Signal Warning** (`#d29922`), **Signal Info** (`#79c0ff`).

### Neutral
- **Night** (`#0d1117`): pagina en terminal. GitHub-donker, bewust geen puur zwart.
- **Night Sunken** (`#080b0f`): sectiebanden, een verdieping onder de pagina.
- **Night Raised** (`#161b22`): kaarten, modals, dropdowns.
- **Night Hover** (`#21262d`): hover-toestanden.
- **Chrome Black** (`#1a1a1a`): navbar en footer, in beide thema's gelijk.
- **Soft White** (`#c9d1d9`): primaire tekst. **Dim Grey** (`#a1a8b0`): secundaire tekst.
- **Border Grey** (`#30363d`): alle randen en scheidingen.

### Named Rules

**The One Voice Rule.** Neon Lime markeert alleen waar de gebruiker aan zet is: de prompt,
de invoer, de primaire CTA, en hover in het Dark Frame. Zodra het ook decoratie wordt,
stopt het met signaleren en is het alleen nog fel.

**The Dark Frame Rule.** Navbar en footer zijn in beide thema's donker (`#1a1a1a`). Kleuren
die daarop landen zijn daarom thema-onafhankelijk vastgezet (`--color-cta-dark-frame`,
`--color-navbar-*`). Gebruik nooit een thema-afhankelijke tekstkleur op dat vaste donker:
in het lichte thema wordt die onzichtbaar.

**The Measured Contrast Rule.** Elke kleurwaarde hier is gekozen op een gemeten ratio,
niet op gevoel; de comments in `styles/main.css` dragen die cijfers. Een nieuwe waarde is
pas geldig als de 7 contrast-specs in `tests/e2e/` groen blijven. Doel is AAA, niet AA.

## Typography

**Display Font:** Space Grotesk (fallback `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif)
**Body Font:** Inter (zelfde fallbackketen)
**Label/Mono Font:** JetBrains Mono Box, met JetBrains Mono en Courier New als terugval

**Character:** Space Grotesk geeft koppen een technische, licht geometrische stem; Inter
leest rustig op schermen; JetBrains Mono Box draagt alles wat een terminal is. De
box-drawing-subset staat vooraan in de stack omdat `asciiBox` op die glyphs rekent.

### Hierarchy
- **Display** (700, 63px, 1.1, -1px): de h1 van een landingspagina. Eén per pagina.
- **Headline** (700, 45px, 1.2): sectiekoppen.
- **Title** (600, 22.5px, 1.2): kaartkoppen en subsecties.
- **Body** (400, 18px, 1.5): lopende tekst; 19,8px in hero-lead. Basis is 18px, op mobiel 16px.
- **Label** (500, 13.5px, 0.5px, mono): eyebrow-badges en metadata.
- **Terminal** (18px, 1.5, mono): alle simulatoroutput.

### Named Rules

**The Three Voices Rule.** Drie fonts, drie rollen: Space Grotesk kopt, Inter leest,
JetBrains Mono werkt. Een vierde familie voegt niets toe wat een gewicht niet ook kan.

**The Shell Is Mono Rule.** Alles binnen het terminalvenster is monospace — output, prompt
en invoer. Dit is geen smaak: `asciiBox` en de nmap-achtige output rekenen op
kolomuitlijning, en prompt en invoer moeten dezelfde metriek hebben als de regels erboven.
Alle drie gemeten op 10,8px per teken; het box-teken en de letter `M` zijn even breed.

**The Scale Gap Rule.** De sprong van Headline (45px) naar Title (22,5px) is precies factor
twee, terwijl Display naar Headline factor 1,4 is. Dat gat is niet ontworpen maar ontstaan.
Elke nieuwe tussenlaag hoort die verhouding te repareren, niet te verdiepen.

## Layout

Eén gecentreerde kolom, geen zichtbaar raster. Containers gaan tot `--layout-max-width:
1400px` met `--layout-padding-x: 32px` aan weerszijden; het terminalvenster is smaller op
`--terminal-max-width: 1200px` met 20px binnenruimte, zodat regels leesbaar blijven.

Ritme komt uit een spacingschaal van vijf stappen: 4 / 8 / 16 / 24 / 32px. Secties krijgen
ruime verticale lucht (de footer opent met 96px). Eén breekpunt doet het echte werk:
`--mobile-breakpoint: 768px`, waar de basisgrootte van 18px naar 16px gaat en de navigatie
naar een volledig scherm klapt. Een tweede breekpunt op 480px verkleint alleen de
spacingstappen.

Kaartroosters vloeien en stapelen; niets krijgt een `min-width` breder dan het scherm.

## Elevation & Depth

**Dit systeem gebruikt geen schaduwen.** Op de volledige landingspagina renderen er twee,
en dat is eerder een restant dan een systeem. Diepte komt uit twee middelen:

1. **Toonladder.** `#080b0f` (verzonken) → `#0d1117` (pagina) → `#161b22` (opgetild) →
   `#21262d` (hover). Het lichte thema spiegelt die ladder exact: `#eceef0` → `#f8f8f8` →
   `#ffffff` → `#ebebeb`. Een schaduwsysteem overleeft zo'n themawissel niet netjes, want
   schaduwen op licht vragen andere alpha's; een toonladder wel.
2. **Haarlijnen.** 1px `#30363d` markeert waar een vlak ophoudt.

Modals worden ook tonaal gescheiden, met een bijna dekkende scrim
(`--color-modal-overlay: rgba(0,0,0,0.95)`) in plaats van met hoogte.

De tokens `--shadow-elevation-1`, `--shadow-elevation-2` en `--shadow-accent-terminal`
bestaan nog maar worden nauwelijks gebruikt. Ze zijn restanten, geen vocabulaire.

### Named Rules

**The No Shadow Rule.** Een shell heeft geen schaduwen; schaduw is een papiermetafoor en
dit is geen papier. Wie diepte nodig heeft pakt de volgende toontrede of een haarlijn.
De enige uitzondering die nog ter discussie staat is de neon-glow rond het terminalvenster
— die is identiteit, geen elevatie, en hoort thuis in de esthetische afweging.

## Shapes

Zachte maar bescheiden afrondingen op een donker, rechthoekig grondvlak. De tokens
definiëren 2px (kleine chips), 4px (knoppen, invoervelden, dropdowns), 8px (modals en grote
containers), 50% (cirkels) en 10px (CTA-navigatieknoppen).

**De praktijk wijkt hiervan af, gemeten op `index.html`:** in gebruik zijn 4px (25x), 12px
(21x), 16px (14x), 8px (10x), 2px (7x), 50% (6x) en 999px (3x). Van die zeven zijn 12px,
16px en 999px géén token. En `--border-radius-cta-nav: 10px`, dat wél gedefinieerd is, komt
op die pagina niet voor. Dat is dezelfde scheur als bij kleur: het tokensysteem dekt maar
een deel van wat er draait.

Randen zijn consequent 1px en grijs; de neon-rand op badges is het enige gekleurde
randgebruik en blijft onder 40% alpha.

Voor kleur is die scheur op 19 sep 2026 gedicht: van de 51 hardgecodeerde kleurwaarden in
`styles/` zijn er 47 vervangen door een token, en zeven nieuwe tokens gaven een naam aan
wat geen naam had (`--color-footer-text-dim`, `--color-footer-text-strong`,
`--color-bg-navbar-mobile`, `--color-bg-demo-terminal`, `--traffic-light-red/-yellow/-green`).
De vier die overblijven staan in `docs/design/impeccable-bevindingen.md`.

## Components

### Buttons
- **Shape:** licht afgerond, 4px (`{rounded.md}`).
- **Primary:** Neon Lime vlak met donkere tekst (`#0d1117`), 8px/16px binnenruimte. In het
  lichte thema Forest CTA (`#166534`) met witte tekst.
- **Hover / Focus:** donkerder accent (`#8ad600`), overgang `--transition-fast` (0.15s ease).
  Focus blijft zichtbaar; reserveer een transparante rand zodat er niets verspringt.
- **Secondary / Ghost:** transparant met een 2px rand in Dim Grey en tekst in dezelfde
  kleur. Rustig van zichzelf, kleurt pas bij interactie.

### Chips
- **Style:** de eyebrow-badge is de kanonieke chip: monotekst 13,5px/500 met 0,5px
  letterafstand, Neon Lime tekst op `rgba(159,239,0,0.05)`, 1px rand op 30% alpha,
  volledig afgerond (20px), 4px/16px binnenruimte.
- **State:** statisch; badges labelen, ze schakelen niet.

### Cards / Containers
- **Corner Style:** 16px in de praktijk (niet getokeniseerd — zie Shapes).
- **Background:** Night Raised, vaak op halve alpha (`rgba(22,27,34,0.5)`) zodat de
  paginatoon doorschemert.
- **Shadow Strategy:** geen. Zie Elevation & Depth.
- **Border:** 1px Border Grey.
- **Internal Padding:** 32px (`{spacing.xl}`).

### Inputs / Fields
- **Style:** Night-vlak met 1px Border Grey, geen afronding in het terminalvenster,
  8px/12px binnenruimte, tekst in Neon Lime.
- **Focus:** randverschuiving plus een subtiele lime-gloed
  (`--color-prompt-shadow: rgba(159,239,0,0.15)`).
- **Error / Disabled:** statuskleuren uit Tertiary; nooit alleen kleur als signaal.

### Navigation
- Chrome Black (`#1a1a1a`) in beide thema's, 60px hoog, 32px horizontale ruimte.
- Links in Soft White op 1rem/500, hover naar wit met een neon-accent; de actieve
  onderstreping is blauw (`#58a6ff`) en thema-onafhankelijk.
- Onder 768px: volledig schermmenu, tapdoelen minimaal 44x44px.

### Signature Component: het terminalvenster

De reden dat het product bestaat. Transparant vlak binnen een 1200px-kolom, output in
JetBrains Mono Box op 18px/1.5, prompt en invoer in Neon Lime.

Twee eigenschappen zijn functioneel en niet esthetisch:

1. **De renderer kleurt regels op het eerste teken.** `[X]` aan regelbegin wordt rood,
   `[✓]` groen; drie of meer spaties erven de kleur door. Kleurwáárden mogen wijzigen, de
   afbeelding van marker naar rol niet.
2. **Kolomuitlijning.** `asciiBox` en de nmap-achtige output rekenen erop dat elk teken
   dezelfde breedte heeft.

Markers zijn ASCII, nooit emoji. Gemeten frequentie: `[?]` 149x, `[TIP]` 113x, `[✓]` 92x,
`[!]` 51x, `[X]` 49x.

## Do's and Don'ts

### Do:
- **Do** diepte uitdrukken in de toonladder (`#080b0f` / `#0d1117` / `#161b22` / `#21262d`)
  en 1px `#30363d`-randen.
- **Do** Neon Lime bewaren voor waar de gebruiker aan zet is. Zeldzaamheid is de functie.
- **Do** elke nieuwe kleurwaarde afrekenen op een gemeten ratio en de 7 contrast-specs in
  `tests/e2e/` groen houden. Doel is AAA.
- **Do** voor het lichte thema een eigen waarde kiezen in plaats van de donkere om te
  keren; dat is hoe het huidige systeem het doet en waarom het AAA haalt.
- **Do** thema-onafhankelijke kleuren gebruiken op navbar en footer.
- **Do** elke nieuwe kleur, radius of spacing als token toevoegen, niet als losse waarde.

### Don't:
- **Don't** schaduwen introduceren. Dit systeem is vlak; zie The No Shadow Rule.
- **Don't** het terminalvenster uit monospace halen. Output, prompt en invoer delen sinds
  19 sep 2026 alle drie `var(--font-terminal)`; daarvoor stond de prompt in Inter en het
  invoerveld in een hardgecodeerde Courier-stack. Verwijs nooit rechtstreeks naar een
  fontnaam in het terminalvenster.
- **Don't** emoji gebruiken in code of output. ASCII-markers, altijd.
- **Don't** een vierde lettertypefamilie toevoegen.
- **Don't** `!important` gebruiken in `styles/`; win op specificiteit.
- **Don't** het groene accent van de hoofdsite doortrekken naar de blog. Die gebruikt
  bewust blauw, en de in-content CTA-boxen zijn bewust links uitgelijnd met een blauwe
  linkerrand.
- **Don't** een buildstap, framework of bundler introduceren om een ontwerpprobleem op te
  lossen. Vanilla is een red line, geen voorkeur.
