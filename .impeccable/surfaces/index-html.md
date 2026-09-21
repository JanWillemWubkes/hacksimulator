---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief — index.html

**Scope:** de landingspagina. Niet terminal.html, niet src/, niet de simulator zelf.
**Visitor mode:** Persuade.

**Publiek:** de absolute beginner die nog nooit een terminal opende, plus de
carriereswitcher die wil weten of security bij hem past. Nederlandstalig, en afgehaakt
op Engels.
**Taak van de bezoeker:** begrijpen wat dit is en de simulator openen.
**Bewijs dat we hebben:** een werkende terminal met echte 80/20-output, 41 commando's,
openbare broncode, natelbare cijfers. Geen testimonials, geen gebruikersaantallen,
geen benchmarks — die mogen niet verzonnen worden.
**Bindende beperkingen:** vanilla JS/CSS, geen buildstap, geen framework. Geen
`!important` in styles/. WCAG AAA-contrast in beide thema's. Geen emoji. Geen dark
patterns.

---

## Direction contract

**THESIS.** De pagina neemt haar eigen kernbeeld letterlijk: de terminal speelt, de tekst
ondertitelt. Geweigerd wordt de categoriestandaard waarin een kop links vertelt wat een
screenshot rechts al laat zien — twee kolommen die hetzelfde werk twee keer doen. Hier
is het bewijs de hoofdrol en is de beschrijving eronder de bijrol.

**OWN-WORLD.** Donkerbasis met een toonladder van vier treden en 1px-haarlijnen; geen
schaduwen. Precies een schel accent (neon-lime), dat uitsluitend betekent "hier ben jij
aan zet": de prompt, de invoer, de primaire actie. Buiten de terminal hoogstens een
accentdrager per scherm — **en die regel is op dit moment alleen in het eerste scherm
doorgevoerd** (gemeten: 21 vaste dragers naar 1). Onder de vouw staat hij nog op 5 tot 9
per scherm: de vergelijkingstabel met zijn vier vinkjes, en de leerpad-kaarten met hun
`$`-regels en drie knoppen. Dat is een bewuste scopebeperking van Sessie 236, geen
vergeten sweep: de meetlat in het goedgekeurde voorstel gaat expliciet over het eerste
scherm, en de eigenaar heeft de sessie daarop begrensd. Wie hier verder gaat, sweept de
resterende acht schermen of schrapt de regel als sitebrede belofte — maar laat hem niet
half staan. Twee letters in plaats van drie: JetBrains Mono kopt en werkt,
Atkinson Hyperlegible Next leest. Mono is de stem, nooit een sfeerlaagje op losse labels.
Expliciet niet: scanlines, glow, groen-op-zwart-nostalgie, matrixregen.

**STORY.** De bezoeker begrijpt binnen een scherm dat dit een echte terminal is die hij
zelf kan bedienen, gelooft dat hij er niets mee kan breken en dat de uitleg Nederlands is,
en opent de simulator. Wie twijfelt tikt eerst een chip en merkt dat het venster antwoordt.

**FIRST VIEWPORT.** Een kolom, links uitgelijnd, maximaal 1400px. Bovenaan het
terminalvenster over de volle contentbreedte — geen gekleurde rand, geen 60px-schaduw; het
venster tilt op doordat de pagina een toontrede dieper staat. Daarbinnen een gedraaide
nmap-uitvoer met Nederlandse ondertitels per regel, een [TIP], en een levende prompt. Onder
het venster de zes tikbare commandochips met de zin die zegt dat het venster echt werkt —
ook op mobiel, waar die zin nu ten onrechte verborgen is. Daaronder de kop als
ondertiteling, in mono op 46px, zonder eyebrow-badge en zonder gekleurd onderstreept
tussenstuk. Daaronder de primaire actie: een lime knop "Start de simulator" met
"geen account nodig" ernaast. Dat is de enige accentdrager in dit scherm.

**FORM.** Herzien binnen een bestaande wereld, geen vervanging ervan. De richting is
brief-pinned door docs/design/voorstel-landingspagina.md, goedgekeurd op 19 sep 2026, en
slaat daarmee de dobbelsteen — new-work.md: "a user- or brief-pinned direction beats the
roll, always". Er is dus geen seed key en geen richtingstoernooi; dat is een bewuste
uitzondering, geen overgeslagen stap. Code-led: geen comp, de ambitie staat in FIRST
VIEWPORT hierboven.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

---

## Memorabel moment

Je tikt op de chip `nmap 192.168.1.1` en er rolt echte poortuitvoer uit, met achter elke
regel een Nederlandse ondertitel. Geen animatie die iets naspeelt — het ding antwoordt.

## Nog niet besloten

- Houdt mono als displayletter stand, of glijdt hij af naar kostuum? De finish-reviewer
  toetst dat tegen dit contract. Terugvaloptie bij afkeuring: een nuchtere schreefloze,
  niet Space Grotesk terug.
- Atkinson Hyperlegible is functioneel verdedigd (verwarbare tekens uit elkaar houden op
  een site waar je tekens overtypt). Houdt dat in de praktijk geen stand, dan is
  Source Sans 3 de terugval.
- Uit de critique meegenomen maar niet in het oorspronkelijke voorstel: de lime-plaat van
  .solution-section, het knopgewicht in de consentbanner, vier elementen op 10,4px, en de
  navbar-inklapband. Blijven liggen: de FAQ-herschikking en de sectievolgorde.
