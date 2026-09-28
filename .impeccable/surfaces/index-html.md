---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief — index.html

**Scope:** de landingspagina. Niet terminal.html, niet src/commands, niet de simulator zelf.
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
**Voelt fout (eigenaar, 24 sep 2026):** hackerkostuum, te schools of kinderlijk, te
intimiderend. Niets anders ligt vast: "als iets beter kan, mag het aangepast worden."

---

## Direction contract

**THESIS.** De pagina is een affiche op een zichtbaar raster, in de traditie van Total
Design: de terminal is een module in dat raster, en de Nederlandse uitleg staat per
outputregel exact ernaast, op dezelfde rasterrij. Geweigerd worden de categoriestandaard
(donkere hero, neon, terminalscreenshot, featuretegels) en het voorspelbare tegendeel
(pastel edtech met illustraties).

**OWN-WORLD.** Licht papier (gebroken wit) als grond, zwarte inkt, en precies een
signaalrood dat uitsluitend betekent "hier ben jij aan zet". Een zichtbaar 12-koloms
raster met 1px-haarlijnen; geen schaduwen, geen verlopen, geen afgeronde kaarten.
Toestanden spreken via inversie (zwart blok, papieren letter), niet via extra kleur. De
terminal is een donker blok op het papier en behoudt binnen zijn rand zijn eigen
betekeniskleuren (prompt, tip, fout); dat is inhoud, geen decoratie. Koppen in een
neo-grotesk op afficheschaal, opgebouwd op het raster; JetBrains Mono alleen binnen de
terminal en voor indexnummers. Expliciet niet: scanlines, glow, groen-op-zwart, matrixregen,
mascottes, badges op de voorgrond.

**STORY.** De bezoeker leest eerst wat dit is, ziet dan in hetzelfde scherm een echte
terminal waarvan elke regel in het Nederlands wordt uitgelegd, begrijpt via het netwerkdiagram wat een scan eigenlijk doet,
gelooft dat hij hier niets kan breken, en opent de simulator. Wie twijfelt tikt eerst een
commando en ziet het diagram antwoorden.

**FIRST VIEWPORT.** Maximaal 1400px, 12 kolommen, haarlijnen zichtbaar. Bovenaan de kop
op afficheschaal over negen kolommen: het instappunt en het beeld van het affiche. Vanaf
1280px staat de enige rode actie, "Start de simulator" met "geen account nodig", in de
laatste drie kolommen op de onderste kopregel, en de ondertitel onder de kop; daaronder
alles onder elkaar. Dan links de terminalmodule over zeven kolommen met de nmap-uitvoer,
rechts daarvan op dezelfde rasterrijen de Nederlandse glos per regel. Die grammatica geldt
voor elke rij van de module: de kolomkop "In gewoon Nederlands" staat naast de
terminalkop, en de uitnodiging ("Werkt echt: typ hier, of tik hieronder een command.") is
de glos van de invoerregel, met dezelfde aanhaallijn. De terminalkop noemt de omvang
("proefversie · 6 van de 40+ commands"). Direct onder de invoerregel de zes commandochips
als knoppen (inktkader, index 01-06, herkomstlabel). Als laatste het netwerkdiagram in één
zin: jouw machine, een scan-pijl, en het routerblok met de twaalf poorten als sleuven erin;
één onderschrift zegt dat een gevulde poort open staat, vanaf 1280px in de kolom onder
jouw machine, met zijn onderkant op die van de router. Onder 768px: een kolom, glos onder
zijn regel, de uitnodiging onder de invoer, de scan-pijl verticaal.
**De vouw (sessie 241):** op 1440x900 en 1280x800 staan terminal, chips en de poorten van de
router samen boven de vouw (gemeten bodem 788 en 770; vóór 949 en 927). Op 1024x768 valt de
vouw na de terminal: daar moeten kop, actie en de héle terminal met zijn uitnodiging boven
staan (invoerregel eindigt op 663). Bewaakt in `hero-demo.spec.js` "De vouw". De terminal
houdt zeven regels; de ruimte kwam uit twee rijen die dezelfde uitnodiging herhaalden.
Herzien in sessie 2b (25 sep 2026): de kop stond eerst onderaan als ondertiteling. Gemeten
gevolg: zeven lagen van gelijk gewicht, kop en actie tegen de onderrand (761-888 op
1440x900, y=947 op 375px), en diagram en chips in dezelfde celvorm met dezelfde
vierkantjes, zodat ze als één tabel lazen.

**FORM.** Vervanging van de visuele wereld (redesign), geen verfijning van de vorige.
Kandidaat 3 van 7 op de eigen lijst ("Crouwel / Total Design"), toegewezen door de loting;
seed key 88f43840. Code-led: er is geen beeldgeneratie, dus geen comp; de ambitie staat in
FIRST VIEWPORT en in de signatuurinteractie hieronder. Verbeteringen uit de ronde, elk als
eigen regel:
- van de netwerkstad: het onzichtbare netwerk zichtbaar maken, in de grammatica van het raster.
- van de 1-bit desktop: toestanden via inversie in plaats van kleur.
- van de nachtvlucht-instrumenten: elke rastermodule draagt een bewering, in vaste leesvolgorde.
- van de zeefdruk-overdruk: exacte registratie van glos op outputregel, zelfde basislijn.
- van de schaduwbazaar: een herkomstlabel per commando (categorie en niveau).
- van de glazuurplank: leerpadlessen als genummerde specimenkaarten met mono-index.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

---

## Onderpagina (sessie 242)

**Besluit.** Onder de hero volgen zeven secties in plaats van twaalf: Herkenbaar (papier,
inktlijn boven, draagt het menu-anker `#features`), Leerpad (band), In cijfers (papier),
Vragen met de bloglinks ernaast (band), Slot (papier), Sample (inkt, de enige inversie
onder de hero), Nieuwsbrief (band). Geschrapt: de feitenband, "De oplossing" (omslag),
"Wat maakt HackSimulator anders?" (tabel + drie features) en "Hoe het werkt" (incl. de
mid-CTA). Documenthoogte 8745 → 5494 @1440, 10834 → 7892 @375.

**Herhaling per functie, niet per telling.** Herhaling blijft als ze een functie heeft:
bewering → bewijs (h1 "veilig" → `rm -rf /`), geruststelling bij de actie (microcopy
naast een rode knop), naslag (FAQ, FAQPage) of natelbaar maken ("40+" → `/commands/`). De
geschrapte secties waren abstracte herformuleringen zonder nieuw bewijs, niet op een
beslismoment. De twee feiten die alleen in de feitenband stonden (gratis, geen
advertenties) staan nu bij de slot-actie.

**De naad.** De glos-naad van de hero (terminal 1-7, uitleg 8-12) is de naad van de hele
pagina: links het ding (transcript, lijst, vragen, actie), rechts de uitleg of de
vervolgstap (glos, noot, bloglinks, contact). Vóór: delingen op kolom 4, 5, 8, 9 en 10.
Bewaakt in `homepage-conversion.spec.js` "Onderpagina".

**Ritme naar gewicht.** Hoofdsecties (Herkenbaar, Leerpad, Vragen) houden `--af-sectie`;
korte secties (cijfers, slot, sample, nieuwsbrief) krijgen `--af-sectie-kort`. Regel: lucht
≤ inhoud (vóór: sample 259 lucht om 184 inhoud, nieuwsbrief 259 om 155). Geen kop groter
dan de h1 (vóór: omslag 66,24 > 64,8). Beide bewaakt.

**De proef** (`.playwright-mcp/s242-proef-koppen.png`, gelijke breedte, onder elkaar):
- B: Herkenbaar-kop 47,52, gelijk aan de andere h2's. **Gekozen.**
- C: Herkenbaar-kop 58px. Een derde koppenmaat voor een verschil dat op de proef
  nauwelijks zichtbaar was; de platte hiërarchie kwam van de gelijke padding, niet van
  de kopmaat.
- D: een mono-sectie-index 01-04 boven de koppen. Verworpen: "02 Jouw leerpad" stond
  direct boven de kaarten 01-03, twee nummeringen in één beeld. De mono-index blijft voor
  volgordes (chips, leerpad).

**Ronde 2: vorm volgt soort** (na feedback eigenaar: "die kleinere tekst boven de rechter
kolom vind ik niet mooi", "de bloglinks lijken ook FAQ's"). Een doorloop van de hele pagina
vond zeven plekken waar de vorm iets anders zei dan de inhoud. Regel: **de glos-kolom
(8-12) is alleen voor uitleg naast iets links**; wat bij een kop hoort, staat onder die kop.
- Inleidingen onder hun kop (1-7), niet rechtsboven.
- Bloglinks als kantlijn op de naad: haarlijn op kolom 8, mono-label "Verder lezen op de
  blog", pad in mono, titel in lopende letter. Proef K/R: K gekozen; R liet vijf lege
  kolommen naast de vragen. "Wat is ethisch hacken?" stond als vraag én als link; de link
  staat nu in het antwoord (zichtbaar + FAQPage), de lijst noemt de tools-gids.
- Herkenbaar-koppen op de rij van hun promptregel, met de aanhaallijn van de hero (was 16px
  erboven).
- Elke alinea in het hero-raster snijdt zich uit het raster, zoals de glos al deed (was:
  haarlijnen door ondertitel, onderschrift, kolomkop, uitnodiging en microcopy).
- Nieuwsbriefveld op de naad (de gedeelde regel centreerde het: 70px ernaast).
- Contactregel van het slot naar de FAQ-inleiding ("Staat je vraag er niet bij? Mail …").
- **Cijfers op afficheschaal, in inkt** (proef N/G, G gekozen). Dit herziet de regel "geen
  afficheschaal, dat is de metric-tegel": een metric-tegel is een los accentgetal in een
  kaart. Hier staat elk getal in een tabelrij met zijn bron, zonder kleur. Op 19px was het
  getal het kleinste element van een sectie die "in cijfers" heet.
Bewaakt in `homepage-conversion.spec.js` "Vorm volgt soort"; zes mutanten, zes falers.

**Ronde 3: copy, kantlijn, leerpad** (na feedback eigenaar op het scherm).
- **Leerpad zonder kaarten** (proef L1/L2/L3, `.playwright-mcp/s242-r3-proef-leerpad.png`,
  L3 gekozen): drie kolommen gescheiden door een haarlijn, zoals Herkenbaar zijn rijen
  scheidt; het donkere commandoblok is het enige vlak; per kolom één knop vooraan en
  "Lees eerst" klein eronder. Van 12 naar 5 lijnen per kolom, sectie 954 → 855px. De
  scheidingslijnen in het commandoblok waren geërfd uit de gedeelde `landing.css`.
- **De kantlijn loopt langs de hele vragenlijst** (stopte halverwege: de rand stond op een
  blok zo hoog als zijn inhoud).
- **Paden in één schrijfwijze:** `/` vooraan, geen `/` achteraan.
- **Copyregel:** Nederlandse samenstellingen aaneen ("netwerken scannen",
  "cybersecuritynieuws", "pentesttools"), geen Engelse zinsbouw ("Weet je in de simulator
  niet verder"), en concreet boven vaag: noem `reset` in plaats van "één woord".
  "Tool" zei niet wat er bedoeld werd: het zijn de commando's.
Bewaakt in "Vorm volgt soort" (paden, kantlijnhoogte, geen randen in de module).

**Bewust niet:** geen verticale haarlijnen onder de hero (daar is het raster de vorm,
eronder wordt het behang; de naad draagt het raster), geen mid-CTA (mobiele balk ≤1279,
navbar ≥1280, bewaakt door "op elke scrollpositie een tikbare CTA").

## Adapt (sessie 243)

De critique van sessie 240 (buiten git, twee ombouwen oud) is punt voor punt opnieuw gemeten
op 360/375/390, 768, 1024, 1180, 1279, 1280 en landscape 844x390/667x375, in beide thema's
via de echte schakelaar. Verouderd bij meting: "chips op 766/768", "labels breken @1280"
(in Chromium; in WebKit wél, zie hieronder), "sticky 76px" (navbar 60px), en de naad in de
band (op 1024/1100/1180/1279 binnen 0,5px op kolomlijn 8).

**Een chip-tik.** De focus blijft op de chip: een geactiveerde knop houdt zijn focus, Tab
gaat naar de volgende chip, en op touch opent er geen toetsenbord. Het invoerveld focussen
trok de pagina 391-611px omhoog zodra het veld boven de rand stond. Daarna scrolt de pagina
alleen omhoog en alleen het tekort, tot de bovenkant van de uitvoer 8px onder de navbar
staat (was tot 181px buiten beeld, op elke breedte). Staat de uitvoer al in beeld, dan
beweegt er niets. In landscape past de module niet (242-330px vrij, terminal 300px): daar
gaat de uitvoer voor en mag de chip onder de rand schuiven, maar een zichtbare balk dekt hem
nooit half af. De chipnaam draagt de toestand (", gedaan" / ", volgende suggestie"), met de
zichtbare tekst vooraan. Het terminallichaam heeft `overflow-anchor: none`: trim() bij 120
regels schoof de pagina anders 192px.

**Thematokens op de wortel.** `[data-theme="light"] { tokens }` matchte ook de schakelaaroptie
met dat attribuut, en die negeerde daarmee elke override van `body.home`: de actieve pil was
`#c9d1d9` (licht) en het inactieve label `#a1a8b0` (donker). Nu `:root[data-theme="light"]`
in main.css en landing.css; de schakelaar is in beide thema's de inversie inkt/papier, het
inactieve label `--af-inkt-2`. De footer is in het donker `#000` (was de zweem
`rgba(22,27,34,.5)`, want `--color-bg-footer` werd alleen in licht gelezen). Voor/na over
522 metingen op 18 pagina's: alleen index.html veranderde. Dit was "tokens" in TASKS #82.

**De tabletband 768-1023.** De mobiele oplossingen gelden nu tot 1023: de terminaltitel
verdwijnt (titel en omvang braken 768-928 allebei, met een losse `~`), en de poorten staan
in twee rijen van zes (3306 en 8080 staken 768-864 buiten hun sleuf).

**Chips.** Een command breekt nooit (`nowrap`), behalve onder 352px, waar een halve chip
112px heeft en "nmap 192.168.1.1" 132 vraagt: overlopen is erger dan breken. Onder 768 staat
de index bóven het command (proef P1-P3, `.playwright-mcp/s243-r3-proef-chips-P*.png`):
- P1 (index ernaast): command en herkomst braken per chip verschillend, rijen 86/68.
- **P2 (index erboven): gekozen.** Zes gelijke chips van 70px, alles op één regel op
  360-767; de index staat als mono-label boven wat hij nummert, zoals in het leerpad.
- P3 (P2 + herkomst in twee regels): 85px per chip zonder winst boven P2.
De indexkolom is `1.8em` en niet `3ch`: `--font-terminal` begint met de kadertekensubset en
WebKit rekent `ch` op dat font (3ch = 31px in de chip, 22 in het nummer tegen 27 elders).
Zes keer 4px was precies waarom de nmap-chip in WebKit op 1280 7px over zijn rand liep.

**De sample toont zijn pagina's** (na feedback eigenaar: "dit is niet mooi"). Linksonder
stond een leeg vlak: 779x72px op 1440, 592x124 op 1024, want de kop is één regel en de uitleg
ernaast vier. Proef A/B/C9/C4 (`.playwright-mcp/s243-proef-sample-{1440,1024}.png`):
- A (huidig): het lege vlak.
- B (knoppen links onder de kop): herschikt alleen; op 1024 bleef links een gat, en de knop
  raakte los van de uitleg die hij afsluit.
- **C9 (de negen pagina's, klein, naast elkaar): gekozen.** Het vult het gat met het bewijs
  zelf: de zin belooft "de eerste 9 pagina's", en hier staan ze, telbaar, in negen gelijke
  cellen. Eerste pagina op dezelfde rasterrij als de knop (op elke breedte ≥768 0px
  verschil). Sectie 328 → 393px op 1440. Negen WebP's samen 22 KB, lazy.
- C4 (vier pagina's groot): 544px voor een korte sectie, en de oude lime-cover werd een
  blikvanger.
De productcover (`assets/products/eerste-pentest-playbook.png`) is afgewezen: lime-neon,
afgeronde rand, Title Case, de wereld die dit affiche vervangt. De kleine accenten in de
pagina's zelf zijn inhoud van het product, net als de kleuren binnen de terminal.
Zin, afbeeldingen en pdf tellen hetzelfde (bewaakt; de pdf wordt uit de bytes geteld).

**Bewaakt** in `hero-demo.spec.js` ("een chip-tik op elke scrollpositie", "focus en naam",
"Hero op elke breedte": 320-1440 per 8px), `thema-standaard.spec.js` ("Thematokens horen op
de wortel") en `homepage-conversion.spec.js` (naad en kantlijn ook op 1279/1180/1024; "De
sample toont zijn pagina's").

**Gemeten en bewust niet opgelost.**
- Onder 352px breken de omvangregel en het nmap-command nog; vastgelegd als assertie in
  twee richtingen (`ONDERGRENS_EEN_REGEL`).
- WebKit houdt de rijhoogte van het gebroken command (85px) vast als het venster van onder
  352 over die grens groeit, tot een herlading. Alleen bij een 320px-telefoon die je kantelt.
- Ongemeten, want headless niet te meten: of een schermlezer de eerste uitvoer na de
  overname voorleest (aria-live gaat pas bij overname op polite), en het virtuele toetsenbord.
- `ch` in `--font-terminal` is in WebKit sitebreed fout (kadertekensubset vooraan). Buiten
  deze pagina: TASKS.

## Audit (sessie 244)

`impeccable audit` tegen de URL, in beide thema's via de echte schakelaar, plus de eerste
`nl-content-reviewer`-ronde. Elk punt nagemeten; score na meting 16/20. Vervallen bij meting:
alle twaalf detectormeldingen (de h1-contrastclaim voor de derde keer; `text-contrast` +
`eyebrow-contrast` 120 passed), de 14 tikdoelen onder 24px (allemaal de afstandsuitzondering
van 2.5.8, dichtstbij ≥21,5px), en de geneste `aside` (best practice, geen WCAG).

**De FAQ met het toetsenbord.** Vier fouten in één gedeeld component, op index, contact en
terminal. Opgelost bij de oorzaak (`main.css`, `faq.js`), niet onder `body.home`:
- De focusring werd weggeknipt door `.faq-item { overflow: hidden }` (0 veranderde pixels bij
  focus op index en terminal). De kinderen zijn transparant, dus er viel niets anders te knippen.
- Een dicht antwoord is `visibility: hidden`: de links erin waren Tab-stops op iets onzichtbaars.
- Open heeft geen plafond meer (was 300px: FAQ 1 verloor 22px op 320 en 85px bij de tekstafstand
  van WCAG 1.4.12). Geen verlies aan beweging: de transitie was op alle drie de pagina's al `none`.
- `faq.js` roept geen `blur()` meer aan: na Enter stond de focus op `<body>`, en WebKit begon de
  volgende Tab bovenaan de pagina. Het commentaar ("mobiel toetsenbord") klopte niet.
Voor/na: 36 beelden (drie pagina's, 1440/375, beide thema's, dicht/open/hover) pixel-identiek.
Bewaakt in `faq-toetsenbord.spec.js`, over alle pagina's uit `PAGINAS`: vier mutanten, vier
asserties.

## Memorabel moment

Je tikt `nmap 192.168.1.1`. Links rolt de poortuitvoer uit, rechts verschijnt per regel de
Nederlandse uitleg op dezelfde rij, en in het diagram eronder springen drie uitsparingen in
het hostblok invers open: 53, 80, 443. Het netwerk dat je niet kon zien, staat nu op papier.

## Signatuurinteractie

De registratie: outputregel, glos en diagramuitsparing lichten als een rij tegelijk op. Een
beweging per commando, geen typanimatie, en `prefers-reduced-motion` toont de eindstand.

## Nog niet besloten

Besloten in sessie 240 (typeset, na een letterproef op gelijke maat en breedte):
- **Koppen: Archivo 700**, labels 800; 900 is eruit. Vergeleken met Archivo 900/800,
  Archivo smal (wdth 72) en Schibsted Grotesk op 64,8px over negen kolommen. 900 liet de
  woordspaties dichtlopen en las als startup-display; smal was het meest affiche maar luid
  (botst met "te intimiderend"); Schibsted kostte +38 KB zonder zichtbaar eigen karakter
  op deze maat. 700 staat al in het bestand: nul extra bytes, het bestand kromp 1.380 B.
- **Rood: #cc0a1e blijft.** Papieren letter op rood 5,02, rood op papier 5,02 (AAA grote
  tekst ≥4,5; de knoptekst is 18,9px vet). Warmer gaat onder de lat: #d4380d 4,17,
  #e0401f 3,70. Fout in de terminal is zalm (--af-m-fout), geen signaalrood.
- De koppenmaat is bewust niet vergroot: dat duwt terminal en diagram verder onder de
  vouw. Maat beslissen met de vouw erbij gemeten.

- Het donkere thema: het geïnverteerde affiche (inkt als grond, papier als letter). Blijft
  verplicht, want de themaschakelaar bestaat sitebreed.
- De vorige bouw (terminal-hero, lime-accent, mono-koppen, commit 8b33014) is bewijs van
  wat werkte, geen autoriteit: behouden wat inhoud is (demo, chips, copy), de look vervalt.
