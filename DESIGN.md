---
name: HackSimulator.nl
description: Nederlandstalige terminalsimulator waarin beginners ethisch hacken leren zonder iets te kunnen breken
colors:
  neon-lime: "#9fef00"
  neon-lime-hover: "#8ad600"
  lime-aaa-light: "#7ac800"
  forest-cta-light: "#166534"
  forest-cta-light-hover: "#14532d"
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
  paper-hover-light: "#ebebeb"
  ink-light: "#0a0a0a"
  ink-dim-light: "#444444"
  border-grey-light: "#e0e0e0"
  signal-error-light: "#a30039"
  signal-warning-light: "#744800"
  signal-info-light: "#074fa4"
  signal-success-light: "#0a5c2e"
typography:
  display:
    fontFamily: "JetBrains Mono, Courier New, Courier, monospace"
    fontSize: "clamp(1.75rem, 4.2vw, 2.55rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-1px"
  headline:
    fontFamily: "JetBrains Mono, Courier New, Courier, monospace"
    fontSize: "clamp(1.4rem, 3vw, 1.78rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "JetBrains Mono, Courier New, Courier, monospace"
    fontSize: "1.22rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Atkinson Hyperlegible Next, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  ui:
    fontFamily: "Atkinson Hyperlegible Next, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    letterSpacing: "0.5px"
  label:
    fontFamily: "Atkinson Hyperlegible Next, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "1px"
  terminal:
    fontFamily: "JetBrains Mono Box, JetBrains Mono, Courier New, Courier, monospace"
    fontSize: "18px"
    lineHeight: 1.5
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
  cta-nav: "10px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.neon-lime}"
    textColor: "{colors.night}"
    typography: "{typography.ui}"
    rounded: "{rounded.lg}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.neon-lime-hover}"
    textColor: "{colors.night}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.neon-lime}"
    rounded: "{rounded.md}"
    padding: "11px 20px"
    height: "44px"
  button-nav:
    backgroundColor: "transparent"
    textColor: "{colors.soft-white}"
    rounded: "{rounded.cta-nav}"
    padding: "8px 16px"
  command-chip:
    backgroundColor: "transparent"
    textColor: "{colors.neon-lime}"
    typography: "{typography.terminal}"
    rounded: "{rounded.md}"
    padding: "4px 16px"
    height: "44px"
  card:
    backgroundColor: "rgba(22, 27, 34, 0.3)"
    textColor: "{colors.soft-white}"
    rounded: "16px"
    padding: "32px"
  terminal-window:
    backgroundColor: "{colors.bg-demo-terminal}"
    textColor: "{colors.soft-white}"
    typography: "{typography.terminal}"
    rounded: "{rounded.lg}"
  terminal-input:
    backgroundColor: "{colors.bg-demo-terminal}"
    textColor: "{colors.neon-lime}"
    typography: "{typography.terminal}"
    rounded: "0"
    padding: "8px 24px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.soft-white}"
    typography: "{typography.ui}"
    padding: "8px 16px"
  theme-toggle-active:
    backgroundColor: "{colors.soft-white}"
    textColor: "{colors.chrome-black}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
    height: "44px"
---

# Design System: HackSimulator.nl

> Afgeleid uit `styles/` en uit gerenderde computed styles op `index.html` (1440x900,
> transities bevroren) op 20 september 2026, niet uit `docs/style-guide.md` en niet uit
> het ontwerpvoorstel. Waar dit document en de CSS uiteenlopen wint de CSS: dat is wat
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
toonladder van vier stappen en uit haarlijnen van 1px. Op de hele landingspagina rendert
nog precies één `box-shadow`, en dat is een inzetrand van 1px op de volgende commandochip —
geen hoogte, maar een rand die geen ruimte inneemt. Het neon-lime accent is zeldzaam: het
markeert waar jij aan zet bent (de prompt, wat je typt, de primaire actie) en verder niets.
Die zeldzaamheid is de reden dat het werkt.

De letter is sinds deze bouw de werkletter van het product zelf. JetBrains Mono kopt én
werkt; Atkinson Hyperlegible Next leest en draagt het chroom. Twee families, drie rollen —
en mono is de stem van het ding, nooit een sfeerlaagje op een los label. Toon is
bemoedigend en nuchter. Geen hype, geen opgeklopte cijfers, geen urgentie die er niet is.

**Key Characteristics:**
- Donkerbasis `#0d1117` met een tonale ladder in vier stappen; geen schaduwen.
- Eén schel accent (`#9fef00`), spaarzaam ingezet als signaal, nooit als decoratie.
- Twee letters in drie rollen: JetBrains Mono kopt en werkt, Atkinson Hyperlegible Next
  leest en draagt het chroom.
- Volwaardig licht thema met eigen AAA-afgestemde waarden, niet een omgekeerd donker thema.
- Chroom (navbar, footer) blijft donker in beide thema's: het Dark Frame-patroon.

## Colors

Een donkere GitHub-achtige basis met precies één schel accent, en een lichte tegenhanger
waarin elk accent opnieuw is afgestemd in plaats van omgedraaid.

### Primary
- **Neon Lime** (`#9fef00`): de prompt, de tekst die jij typt, de commandochips binnen het
  venster en de primaire actie eronder. Dit is de kleur van "hier ben jij aan zet". In het
  lichte thema wordt dit `#7ac800` op vast donkere oppervlakken en Forest CTA (`#166534`,
  hover `#14532d`) waar witte tekst erop moet: hetzelfde signaal, opnieuw gemeten voor AAA.

### Secondary
- **Azure Deep** (`#004494`): knoppen met witte tekst buiten de landingspagina. Draagt de
  acties die wel belangrijk maar niet de hoofdweg zijn. Op de landingspagina komt deze
  kleur sinds deze bouw niet meer voor — de themaschakelaar was de laatste drager.

### Tertiary
De statuskleuren. Ze zijn bewust gedempt zodat ze naast elkaar kunnen staan zonder te
schreeuwen, en elk haalt AAA op zijn eigen basis:
- **Signal Success** (`#3fb950`, licht `#0a5c2e`): positieve terugkoppeling. Nadrukkelijk
  onderscheiden van Neon Lime — succes is niet hetzelfde als "jij bent aan zet".
- **Signal Error** (`#fa7c76` / `#a30039`), **Signal Warning** (`#d29922` / `#744800`),
  **Signal Info** (`#79c0ff` / `#074fa4`).

### Neutral
- **Night** (`#0d1117`): pagina en terminal. GitHub-donker, bewust geen puur zwart.
- **Night Sunken** (`#080b0f`): sectiebanden, een verdieping onder de pagina.
- **Night Raised** (`#161b22`): kaarten, modals, dropdowns, de titelbalk van het venster.
- **Night Hover** (`#21262d`): hover-toestanden.
- **Chrome Black** (`#1a1a1a`): navbar en footer, in beide thema's gelijk.
- **Soft White** (`#c9d1d9`): primaire tekst. **Dim Grey** (`#a1a8b0`): secundaire tekst.
- **Border Grey** (`#30363d`, licht `#e0e0e0`): alle randen en scheidingen.
- **Demo Terminal** (`#000000`): het venster op de landingspagina staat een trede dieper
  dan de pagina, zodat het als scherm leest en niet als sectie.

### Named Rules

**The One Voice Rule.** Neon Lime markeert alleen waar de gebruiker aan zet is: de prompt,
de invoer, de commandochips, de primaire actie, en hover in het Dark Frame. Zodra het ook
decoratie wordt, stopt het met signaleren en is het alleen nog fel.

**The One Carrier Rule.** Binnen het terminalvenster ís kleur betekenis en verandert er
niets. Buiten het venster betekent kleur "hier kun je klikken" en staat er hoogstens één
accentdrager per scherm. **Deze regel geldt op dit moment alleen voor het eerste scherm.**
Gemeten op 1440x900: het eerste scherm draagt 1 accent buiten het venster (de primaire
actie) en 14 erbinnen; de acht schermen onder de vouw dragen er 2 tot 12 per scherm —
de vergelijkingstabel, de leerpad-kaarten met hun `$`-regels, de sectie-iconen. Dat is
een vastgelegde grens uit het direction contract, geen vergeten opruiming. Wie hier
verdergaat, sweept de resterende acht schermen of schrapt de regel als sitebrede belofte;
laat hem niet half staan. De grens zelf is geasserteerd in
`tests/e2e/hero-accent-budget.spec.js`, dat de populatie splitst naar binnen/buiten en
alleen eigenschappen telt die daadwerkelijk verf op het scherm zetten.

**The Dark Frame Rule.** Navbar en footer zijn in beide thema's donker (`#1a1a1a`). Kleuren
die daarop landen zijn daarom thema-onafhankelijk vastgezet (`--color-cta-dark-frame`,
`--color-navbar-*`, `--color-footer-text-*`). Gebruik nooit een thema-afhankelijke
tekstkleur op dat vaste donker: in het lichte thema wordt die onzichtbaar.

**The Measured Contrast Rule.** Elke kleurwaarde hier is gekozen op een gemeten ratio,
niet op gevoel; de comments in `styles/main.css` dragen die cijfers. Een nieuwe waarde is
pas geldig als de contrast-specs in `tests/e2e/` groen blijven (`text-contrast`,
`link-contrast`, `accent-text-contrast`, `eyebrow-contrast`). Doel is AAA, niet AA.

## Typography

**Display / Heading Font:** JetBrains Mono, variabel op de as 400–800 (terugval `Courier New`, `Courier`, monospace)
**Body & UI Font:** Atkinson Hyperlegible Next, variabel op de as 200–800 (terugval `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif)
**Terminal Font:** JetBrains Mono Box, met JetBrains Mono en Courier New als terugval

**Character:** de kopletter is de werkletter van het product zelf: een kop leest als iets
dat een machine heeft uitgeprint, niet als iets dat een merkbureau heeft gezet. Atkinson
Hyperlegible Next is gekozen op een functie en niet op smaak — hij houdt verwarbare tekens
uit elkaar op een site waar bezoekers tekens overtypen. Beide bestanden zijn variabel, dus
één `@font-face` met een gewichtsbereik in plaats van meerdere blokken naar hetzelfde
bestand. De box-drawing-subset staat vooraan in de terminalstack omdat `asciiBox` op die
glyphs rekent.

### Hierarchy
Gemeten op de gerenderde pagina bij 1440px breedte:
- **Display** (700, 45,9px, 1.1, -1px): de h1. Eén per pagina.
- **Headline** (700, 32,0px, 1.2): sectiekoppen.
- **Title** (600, 22,0px token / 22,5px zoals gerenderd, 1.2): kaartkoppen en subsecties.
- **Body** (400, 18px, 1.5): lopende tekst. Basis is 18px, op mobiel 16px.
- **UI** (500, 18px, 0,5px): navigatielinks, knoplabels, formulierlabels, meta — het
  chroom. Zelfde familie als Body, ander gewicht.
- **Label** (600, 13px, 1px): kleine schakelaarlabels en metadata.
- **Terminal** (400, 18px, 1.5, mono): alle simulatoroutput. De demo op de landingspagina
  rendert deze rol op 16,2px, en de commandochips eronder op 14,4px.

### Named Rules

**The Two Letters Rule.** Twee families, drie rollen: JetBrains Mono kopt en werkt,
Atkinson Hyperlegible Next leest én draagt het chroom. Een derde familie voegt niets toe
wat een gewicht niet ook kan. De Body- en UI-rol delen bewust één bestand: `--font-ui` is
een rol, geen familie.

**The Mono Is The Voice Rule.** Mono draagt de koppen, de merknaam en getallen — een getal
is een meting, geen decoratie. Mono op losse labels, knoppen of navigatielinks is precies
het sfeerlaagje dat deze wereld weigert, en het kost breedte: gemeten op 1280px vroeg de
balk met de navlinks in mono 1303px bij 1265px beschikbaar, met de bodyletter 1211px.

**The Shell Is Mono Rule.** Alles binnen het terminalvenster is monospace — output, prompt
en invoer. Dit is geen smaak: `asciiBox` en de nmap-achtige output rekenen op
kolomuitlijning, en prompt en invoer moeten dezelfde metriek hebben als de regels erboven.

**The Even Ladder Rule.** De ladder is gelijkmatig: 45,9 → 32,0 → 22,5 → 18px, dus factor
1,43 / 1,42 / 1,25. Het gat van factor 2,00 tussen Headline en Title dat dit document tot
19 sep 2026 als ontwerpschuld noteerde, bestaat niet meer. Een nieuwe tussenlaag hoort die
verhouding te houden, niet opnieuw te openen. Display en Headline zijn vloeiend
(`clamp()`); Title is dat niet.

## Layout

Eén kolom, links uitgelijnd, geen zichtbaar raster. Containers gaan tot
`--layout-max-width: 1400px` met `--layout-padding-x: 32px` aan weerszijden. Het
terminalvenster op de landingspagina loopt over de volle contentbreedte
(`--terminal-demo-max-width: 100%`); in de simulator zelf blijft het op
`--terminal-max-width: 1200px` met 20px binnenruimte, zodat regels leesbaar blijven.

Ritme komt uit een spacingschaal van vijf stappen: 4 / 8 / 16 / 24 / 32px. Daarboven staat
één sectieritme: 10 van de 13 secties op de landingspagina meten 96px boven én onder, en
de footer opent met dezelfde 96px. Eén breekpunt doet het echte werk:
`--mobile-breakpoint: 768px`, waar de basisgrootte van 18px naar 16px gaat en de navigatie
naar een volledig scherm klapt. Een tweede breekpunt op 480px verkleint alleen de
spacingstappen.

Kaartroosters vloeien en stapelen; niets krijgt een `min-width` breder dan het scherm.
Tapdoelen zijn minimaal 44x44px — de commandochips, de themaschakelaar en de secundaire
knoppen dragen daarvoor een expliciete `min-height`.

## Elevation & Depth

**Dit systeem gebruikt geen schaduwen.** Op de volledige landingspagina rendert er nog
precies één `box-shadow`, en dat is `inset 0 0 0 1px` neon op de volgende commandochip:
een rand die geen layout verschuift, geen hoogte. Diepte komt uit twee middelen:

1. **Toonladder.** `#080b0f` (verzonken) → `#0d1117` (pagina) → `#161b22` (opgetild) →
   `#21262d` (hover). Het lichte thema spiegelt die ladder met eigen waarden:
   `#eceef0` → `#f8f8f8` → `#ffffff` → `#ebebeb`. Een schaduwsysteem overleeft zo'n
   themawissel niet netjes, want schaduwen op licht vragen andere alpha's; een toonladder
   wel. Het terminalvenster tilt niet op door een halo maar doordat het een trede dieper
   staat dan de pagina: puur zwart op `#0d1117`.
2. **Haarlijnen.** 1px `#30363d` markeert waar een vlak ophoudt — de vensterrand, de
   titelbalk, de invoerregel, de kaarten, de footer.

Modals worden ook tonaal gescheiden, met een bijna dekkende scrim
(`--color-modal-overlay: rgba(0,0,0,0.95)`) in plaats van met hoogte.

De tokens `--shadow-elevation-1`, `--shadow-elevation-2` en `--shadow-accent-terminal`
bestaan nog en worden buiten de landingspagina nog aangeroepen. Ze zijn restanten, geen
vocabulaire; ze dragen geen enkele regel op het gedocumenteerde oppervlak.

### Named Rules

**The No Shadow Rule.** Een shell heeft geen schaduwen; schaduw is een papiermetafoor en
dit is geen papier. Wie diepte nodig heeft pakt de volgende toontrede of een haarlijn.
Er is geen uitzondering meer: de statische neon-glow — de halo om het venster, de radiale
waas achter de hero, de halo's onder de laatste CTA en de limoengloed op de knophovers —
is in deze bouw verwijderd, samen met de tokens die hem droegen. Glow die overblijft is
toestandsfeedback (de focusring op de terminalinvoer), en die is state, geen elevatie.

## Shapes

Zachte maar bescheiden afrondingen op een donker, rechthoekig grondvlak. De tokens
definiëren 2px (kleine chips en schakelaars), 4px (knoppen, invoervelden, commandochips,
dropdowns), 8px (het terminalvenster, modals en grote containers), 10px
(CTA-navigatieknoppen) en 50% (cirkels).

**De praktijk wijkt hiervan af, gemeten op `index.html` op 20 sep 2026:** in gebruik zijn
4px (23x), 12px (21x), 16px (14x), 8px (10x), 2px (7x), 50% (6x), 999px (3x), 10px (1x) en
3px (1x). Van die negen zijn 12px, 16px, 999px en 3px géén token. De telling is vrijwel
onveranderd sinds de vorige meting; `--border-radius-cta-nav: 10px` rendert nu wél, op de
nav-CTA. Het tokensysteem dekt nog steeds maar een deel van wat er draait.

Randen zijn consequent 1px en grijs. Het enige gekleurde randgebruik zit op de
commandochips en de invoerregel van het venster: volle neon op 1px, binnen het venster,
waar kleur betekenis is.

Voor kleur is de scheur maar half gedicht. Hergemeten op 20 sep 2026, met blokcommentaar
weggestreept en tokendefinities zelf niet meegeteld: **6 losse hexwaarden** (5 uniek, 2
stylesheets) én **73 chromatische `rgb()`/`rgba()`-literals zonder token** (23 unieke
basiskleuren, 9 stylesheets). De grootste post is `rgba(22,27,34,α)` — de halftransparante
kaartvulling, 24 keer. Het getal "vier waarden" dat hier tot 19 sep 2026 stond telde alleen
hex en gaf daarmee een te gunstig beeld. Zie `docs/design/impeccable-bevindingen.md`.

## Components

### Buttons
- **Shape:** 8px op de primaire actie (`{rounded.lg}`), 4px op de secundaire
  (`{rounded.md}`), 10px op de nav-CTA (`{rounded.cta-nav}`).
- **Primary:** Neon Lime vlak met donkere tekst (`#0d1117`), 16px/32px binnenruimte, UI-rol
  op 20,25px/600 met 0,5px letterafstand, geen rand. In het lichte thema Forest CTA
  (`#166534`) met witte tekst. Eén per scherm; dit is de enige accentdrager buiten het
  venster in het eerste scherm.
- **Hover / Focus:** donkerder accent (`#8ad600`), overgang `--transition-fast` (0.15s
  ease). Geen gloed. Focus blijft zichtbaar; reserveer een transparante rand zodat er
  niets verspringt.
- **Secondary:** transparant met een 1px rand in Neon Lime en tekst in dezelfde kleur,
  11px/20px binnenruimte, `min-height: 44px`. Rustig van zichzelf.
- **Nav-CTA:** transparant met een 1px rand in Border Grey en tekst in Soft White,
  8px/16px. Sinds deze bouw draagt hij op de homepage géén neon meer — een navigatieknop
  is niet de hoofdweg.

### Chips
- **Style:** de commandochip onder het venster is de kanonieke chip: terminaltekst op
  14,4px, Neon Lime op transparant, 1px neon rand, 4px afronding, 4px/16px binnenruimte,
  `min-height: 44px`.
- **State:** tikbaar, niet decoratief. De eerstvolgende chip draagt `inset 0 0 0 1px` neon
  als tweede rand. Een chip die niet klikt hoort hier niet.

### Cards / Containers
- **Corner Style:** 16px in de praktijk (niet getokeniseerd — zie Shapes).
- **Background:** Night Raised op lage alpha (`rgba(22,27,34,0.3)`, elders 0,5) zodat de
  paginatoon doorschemert.
- **Shadow Strategy:** geen. Zie Elevation & Depth.
- **Border:** 1px Border Grey.
- **Internal Padding:** 32px (`{spacing.xl}`).

### Inputs / Fields
- **Style:** in het venster een zwart vlak met een 1px Border Grey-scheiding erboven, geen
  afronding, 8px/24px binnenruimte, tekst in Neon Lime in de terminalletter.
- **Focus:** randverschuiving plus een subtiele lime-focusring
  (`--color-prompt-shadow: rgba(159,239,0,0.15)`). Dit is state, geen elevatie.
- **Error / Disabled:** statuskleuren uit Tertiary; nooit alleen kleur als signaal.

### Navigation
- Chrome Black (`#1a1a1a`) in beide thema's, 60px hoog, 32px horizontale ruimte, 1px
  Border Grey onderrand.
- De merknaam staat in de kopletter (JetBrains Mono, 18,9px/600, 0,3px) in Soft White; het
  merkicoon deelt die kleur. Een wordmark is geen actie en draagt dus geen accent.
- Links in de UI-rol (Atkinson, 18px/500, 0,5px) in Soft White, 8px/16px, hover naar wit;
  de actieve onderstreping is blauw (`#58a6ff`) en thema-onafhankelijk.
- **Themaschakelaar:** in de balk icoon-only — getekende maan- en zon-SVG's van 14px op
  `currentColor`, met de tekstlabels visueel weggeklemd en alleen leesbaar in het
  overlaymenu. Een glyph-icoon uit de fontsubset is hier geen optie: het `█`-teken dat er
  eerder stond zat in geen van de geladen subsets. De actieve optie is een **toon-inversie**
  (navbar-tekstkleur als vlak, navbar-achtergrond als tekst, 2px afronding), niet een
  gevuld gekleurd vlak — dat zou een tweede accentdrager in het eerste scherm zijn. De
  inactieve optie wordt gedempt met een kleur (`#a1a8b0`) en nooit met `opacity`, omdat een
  gemeten ratio een alpha-laag niet overleeft.
- Onder 768px: volledig schermmenu op `#000`, tapdoelen minimaal 44x44px.

### Signature Component: het terminalvenster

De reden dat het product bestaat, en op de landingspagina de hoofdrol: het staat bovenaan
over de volle contentbreedte, niet als screenshot naast een kop. Een puur zwart vlak (8px
afronding) met een 1px Border Grey-rand, een titelbalk in Night Raised met de drie
macOS-vensterknopjes, gedraaide nmap-uitvoer met een Nederlandse ondertitel per regel, een
`[TIP]`, en een levende prompt.

Twee eigenschappen zijn functioneel en niet esthetisch:

1. **De renderer kleurt regels op het eerste teken.** `[X]` aan regelbegin wordt rood,
   `[✓]` groen; drie of meer spaties erven de kleur door. Kleurwáárden mogen wijzigen, de
   afbeelding van marker naar rol niet.
2. **Kolomuitlijning.** `asciiBox` en de nmap-achtige output rekenen erop dat elk teken
   dezelfde breedte heeft.

Markers zijn ASCII, nooit emoji.

## Do's and Don'ts

### Do:
- **Do** diepte uitdrukken in de toonladder (`#080b0f` / `#0d1117` / `#161b22` / `#21262d`)
  en 1px `#30363d`-randen.
- **Do** Neon Lime bewaren voor waar de gebruiker aan zet is. Zeldzaamheid is de functie:
  binnen het venster is kleur betekenis, buiten het venster hoogstens één drager.
- **Do** elke nieuwe kleurwaarde afrekenen op een gemeten ratio en de contrast-specs in
  `tests/e2e/` groen houden. Doel is AAA.
- **Do** voor het lichte thema een eigen waarde kiezen in plaats van de donkere om te
  keren; dat is hoe het huidige systeem het doet en waarom het AAA haalt.
- **Do** thema-onafhankelijke kleuren gebruiken op navbar en footer.
- **Do** een selectie tonen door te inverteren binnen de bestaande tonen, niet door er een
  nieuwe verzadigde kleur bij te zetten.
- **Do** iconen tekenen als SVG op `currentColor`, niet kiezen uit een fontsubset.
- **Do** elke nieuwe kleur, radius of spacing als token toevoegen, niet als losse waarde.

### Don't:
- **Don't** schaduwen of statische gloed introduceren. Dit systeem is vlak; zie
  The No Shadow Rule. Glow mag alleen state zijn.
- **Don't** het terminalvenster uit monospace halen. Output, prompt en invoer delen alle
  drie `var(--font-terminal)`. Verwijs nooit rechtstreeks naar een fontnaam in het venster.
- **Don't** mono gebruiken op chroom — knoppen, navigatielinks, formulierlabels, meta. Die
  staan in `--font-ui`; zie The Mono Is The Voice Rule.
- **Don't** emoji gebruiken in code of output. ASCII-markers, altijd.
- **Don't** een derde lettertypefamilie toevoegen.
- **Don't** een merknaam, merkicoon, sectie-icoon of navigatieknop in het accent zetten.
  Accent is een aanwijzing dat je kunt handelen, geen merkkleur.
- **Don't** `!important` gebruiken in `styles/`; win op specificiteit.
- **Don't** het groene accent van de hoofdsite doortrekken naar de blog. Die gebruikt
  bewust blauw, en de in-content CTA-boxen zijn bewust links uitgelijnd met een blauwe
  linkerrand.
- **Don't** een buildstap, framework of bundler introduceren om een ontwerpprobleem op te
  lossen. Vanilla is een red line, geen voorkeur.
