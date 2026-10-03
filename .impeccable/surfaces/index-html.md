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
terminal is een donker blok op het papier en behoudt binnen zijn rand het onderscheid tussen
zijn rollen (prompt, tip, fout, waarschuwing); dat is inhoud, geen decoratie. Sinds sessie 250
spreekt de module daarbij de taal van de pagina: prompt in papier 700, de info-rol (`[TIP]`,
`[→]`) op een papieren label, de cursor in het signaalrood; fout (zalm) en waarschuwing (amber)
zijn de enige tinten. Koppen in een
neo-grotesk op afficheschaal, opgebouwd op het raster; JetBrains Mono alleen binnen de
terminal en voor indexnummers. Expliciet niet: scanlines, glow, groen-op-zwart, matrixregen,
mascottes, badges op de voorgrond.

**STORY.** De bezoeker leest eerst wat dit is, ziet dan in hetzelfde scherm een echte
terminal waarvan elke regel in het Nederlands wordt uitgelegd, gelooft dat hij hier niets kan
breken, en opent de simulator. Wie twijfelt tikt eerst een command en ziet de terminal in het
Nederlands antwoorden. (Tot sessie 249 legde een netwerkdiagram uit wat een scan doet; het is
uit de hero, zie "Onderscheid (sessie 249-250)".)

**FIRST VIEWPORT.** Maximaal 1400px, 12 kolommen, haarlijnen zichtbaar. Bovenaan de kop
op afficheschaal over alle twaalf kolommen (88px op 1440, sessie 247): het instappunt en het
beeld van het affiche. Daaronder, in de leesrij en op de lijn van de kop, de ondertitel en de
enige rode actie, "Start de simulator". De microcopy staat vanaf 1280px naast de knop en
daaronder eronder (sessie 249; tot dan stond de actie in de laatste drie kolommen). Kop, zin en actie
zijn één groep; de stap naar de terminal is de grote (sessie 250). Dan links de terminalmodule over zeven kolommen met de nmap-uitvoer,
rechts daarvan op dezelfde rasterrijen de Nederlandse glos per regel. Die grammatica geldt
voor elke rij van de module: de kolomkop "In gewoon Nederlands" staat naast de
terminalkop, en de uitnodiging ("Werkt echt: typ hier, of tik hieronder een command.") is
de glos van de invoerregel, met dezelfde aanhaallijn. De terminalkop noemt de omvang
("proefversie · 6 van de 40+ commands"). Direct onder de invoerregel de zes commandochips
als toetsenrij (inktkader, index 01-06, aaneen op het raster; sessie 249). Het netwerkdiagram
dat hier tot sessie 249 als laatste stond, is weg. Onder 768px: een kolom, glos onder zijn
regel, de uitnodiging onder de invoer.
**De vouw (sessie 241, herzien in 247 en 250):** sinds sessie 250 moeten op 1440x900 en
1280x800 de invoerregel en de hele toetsenrij boven de vouw staan (gemeten onderkant 821 en
793), op 1024x768 de hele terminal met zijn uitnodiging (735). Daarvóór, met diagram: sinds de afficheschaal gold de pixelvouw
op 1440x900 (diagram 889/900) en 1024x768; op 1280x800 staan de poorten 64px onder de vouw
(864/800) en speelt de scan opnieuw zodra het diagram in beeld komt (zie "Bolder (sessie
247)"). Oorspronkelijk: op 1440x900 en 1280x800 staan terminal, chips en de poorten van de
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
Vragen met de bloglinks ernaast (band), Slot (papier; *sinds sessie 247 inkt*), Sample (inkt, de enige inversie
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
eronder wordt het behang; de naad draagt het raster; *herzien in sessie 248: ook in de
cijfers, als tabel, en verder nergens*, zie "Layout (sessie 248)"), geen mid-CTA (mobiele balk ≤1279,
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

**Laden en beweging.**
- `<main>` zakte 60px zodra `navbar.js` de placeholder verving (CLS 0,042 op 1440, 0,074 op 375,
  en zo op elke pagina die `landing.css` laadt). `landing.css` reserveert nu `--navbar-height` op
  `#navbar-placeholder`: CLS 0 op alle pagina's. Terminal laadt `landing.css` niet (navbar
  `fixed`, daar zou een reserve een sprong maken). Prijs: met JS uit staat er 33px lucht boven het
  noscript-menu (placeholder 60, menu 27). Aangrenzend: de cover op sample-download had geen
  `width`/`height` (CLS 0,067 op 375).
- Onder reduced motion scrolde een ankersprong nog ~350ms: `landing.css` zet `scroll-behavior:
  auto` onder `reduce`, zoals de signatuurinteractie al de eindstand toont.
- **Bewust niet:** de Brevo-CSS niet uit het kritieke pad. Onder Slow 4G (150ms, 1,6 Mbps,
  4x CPU, vijf runs) scheelt het 56ms FCP (mediaan 2300 → 2244): hij laadt parallel met onze
  eigen CSS. Onder de vooraf gekozen drempel van 100ms, en de CSP staat geen inline `onload` toe.
Bewaakt in `laden-en-beweging.spec.js` (CLS per pagina met positieve controle, alleen Chromium;
reduced motion over alle pagina's); drie mutanten.

**Copy (NL-review, nagemeten).**
- FAQ 8: het schema miste de laatste zin. De guard "FAQPage-schema blijft woordelijk gelijk"
  vergeleek alleen de vragen; hij vergelijkt nu ook de antwoorden (mutant: één zin weg → rood op
  de antwoorden, niet op de vragen).
- **"command", niet "commando".** De pagina zei 22× "command(s)" (chips, "40+ commands", de pagina
  /commands) en 4× "commando", in FAQ 3 allebei in één alinea. "basiscommando's" werd "eenvoudige
  commands".
- "Gratis cybersecuritytips" (ook op /blog/), aria-label "E-mailadres voor de nieuwsbrief" (ook
  op /blog/), skiplink "Naar de inhoud", terminaltitel `hacker@hacksim:~` zoals de prompt,
  "Onze aanpak heet "80/20 realisme": …" (de term zelf staat op acht plekken en blijft), en het
  noscript-menu noemt Gidsen. De kop breekt op geen van 141 breedtes (320-1440) over zijn rand.
- **Bewust niet:** title en meta ("hacking simulator", SEO-besluit sessie 210), "Lees eerst:
  Terminal voor beginners" (bewust ingekort, sessie 188), "pdf" (Woordenlijst: kleine letters),
  "pentester" en "root" in de hero-tips (in de woordenlijst; elk woord in de glos kost ruimte).
  Sitebreed en dus niet op deze branch: "terminal simulator" (21 pagina's, en een zoekterm) en de
  desktopnav die op `px` inklapt (horizontaal scrollen bij alleen-tekstzoom). Beide in TASKS.

## Polish (sessie 245)

Zes designpunten van de eigenaar plus een eigen pass (`impeccable polish`): 63 bedieningselementen
× 2 thema's in rust, hover en focus, tekstranden tegen de 13 rasterlijnen, typografie per rol,
console. Schoon bij meting: 0 consolefouten, één maat per rol, geen tekst naast het raster behalve
de slot-microcopy naast zijn knop, geen overloop op 320-414. De hovertaal heeft twee woorden:
**een blok inverteert, een tekstlink wordt dikker** (1 → 2px). Wat geen van beide deed, of beide
tegelijk, was de fout.

**Ronde 1: de oude wereld lekte, en twee toestanden stapelden.** Alles in `affiche.css`, op één
regel in `main.css` na.
- **Woordmerk.** `main.css` kleurt bij hover élke span in het merk lime; de naam is een klasseloze
  span, dus "HackSimulator" werd `rgb(159,239,0)`. En `body.home a` onderstreepte het merk in rust.
  Nu zonder lijn en zonder kleurwissel, in rust én bij hover, en dat geldt ook voor het merk in
  de footer (dat kreeg via de footerlinks een onderstreping bij hover). Eerst zette ronde 1 er een
  hover-onderstreping op; de eigenaar vroeg of dat bewust was, en het botste met "een woordmerk is
  geen actie" (sessie 236) en met de hovertaal hieronder, want een merk is blok noch tekstlink.
- **Tweede lijnen.** Van 43 zichtbare links kregen er drie een tweede lijn bij hover: de koffielink
  een rand in `--color-cta-primary` (het signaalrood, gemeten als band van 3px met rode onderrij),
  de footerknop een onderstreping in zijn kader, de skiplink idem. Koffielink nu een gewone
  tekstlink; de footerknop inverteert zoals elke knop.
- **Focus.** De schakelaar had als enige van 61 een blauwe ring (`--color-info` uit `landing.css`);
  nu rood. Het e-mailveld had `outline: none` en alleen een gekleurde rand; nu de rode ring.
- **GitHub-icoon:** zijn hover was een onderstreping, en een icoon heeft er geen. Nu de inversie.
- **Nieuwsbrief.** Veld 1,59px lager dan de knop: `main.css` reserveert onder beide ruimte voor een
  foutmelding in `em`, onder een letter van 16 en van 18px. Vanaf 1024 nu bovenkant op bovenkant.
  Twee dingen daaronder die je niet in de CSS van deze pagina ziet: de `flex` van de wrapper
  verloor op elke breedte van een (0,4,0)-regel in `main.css`, dus het veld had zijn eigen 247px
  en de knop brak op 768-1032 onder een veld **zonder rechterrand**. En de rand van 2px kwam van
  een `!important` in `main.css` die niets won: Brevo's eigen regel (0,2,0) verliest ook zonder.
  Die `!important` is weg (de enige wijziging in een gedeeld bestand; voor/na op sample-pentest,
  sample-juridisch en /blog/, 1440/375, beide thema's, rand en focus: 24 van 24 identiek). Nu:
  vanaf 1024 één rij tot de rasterrand, daaronder onder elkaar met de knop op volle breedte;
  gemeten op 201 breedtes 320-1920.
- **Bloglinks:** het zwarte blok stond op 0px van zijn letters. Nu 8px, met een even grote
  negatieve marge: de tekst blijft op de naad.
- **Cijfertabel:** "naam)" stond op 1024-1920 alleen op de laatste regel (49px); `text-wrap:
  pretty` → "de naam)" (74px). Niet bewaakt: WebKit ondersteunt het niet overal, en een los woord
  is geen fout.
Bewaakt in `homepage-conversion.spec.js` "Polish (sessie 245)", acht tests; zeven mutanten, elk op
een eigen assertie. De pixeltest heeft een positieve controle, en die ving de eerste versie: in
WebKit (`deviceScaleFactor` 2) keek de teller naar het verkeerde stuk beeld.

**Ronde 2: drie besluiten na een proef** (gelijke breedte en ondergrond, onder elkaar;
`.playwright-mcp/s245-proef-{noot-1440,faq,sample-1440,sample-375}.png`).
- **De noot staat bij de belofte** (proef N0-N3, N3 gekozen). "Ook de code erachter…" stond in
  de glos-kolom naast rij 1 van de cijfertabel (eerste regel 3024,4 in rij 3011,4-3099,4) en
  hoorde bij geen regel ervan. Hij is geen uitleg van "40+" maar een vierde bewijs, dus hoort hij
  bij "dit kun je allemaal zelf nakijken". N1 (op de labelregel) schoof 4px en bleef zonder
  reden naast rij 1; N2 (onder de tabel) las als voetnoot, het lichtste gewicht voor een even
  sterk bewijs. De glos-kolom naast de tabel is nu leeg, en dat klopt: er staat links niets
  dat uitleg nodig heeft. Sectie 563 → 593 @1440, 538 → 495 @375.
- **De laatste FAQ-lijn per breedte** (proef F0/F1). Vanaf 1024 blijft hij: de kantlijn eindigt
  op dezelfde y (4180,5 = 4180,5), en zonder slotlijn hing die verticale lijn onder de laatste
  vraag in het niets. Onder 1024 wordt de kantlijn een bovenlijn van het blogblok, 40px onder de
  laatste vraag: twee haarlijnen vlak onder elkaar. Daar valt hij weg.
- **De sample toont wat erin staat** (proef S0-S3, S2 gekozen; herziet "De sample toont zijn
  pagina's" van sessie 243). De negen miniaturen waren op 320-414 23-34px breed, en telden de
  omslag, "over dit sample", het slot en de verkooppagina als bewijs mee; de inhoud zelf is
  p. 3-7. Nu een inhoudsopgave in de grammatica van de cijfertabel: mono-index, titel, bron in
  mono, haarlijnen (papier op 35% in de inktband). Drie regels, titels uit de pdf (pdftotext) in
  zinskapitaal: de 6 fases (p. 3), Fase 0 (p. 4-5), Fase 1 (p. 6-7); de verkooppagina telt niet.
  - S1 (rechterblok op de onderlijn, voorstel eigenaar): de knop kwam 110px los van de zin die
    hij afsluit, en op 375 botsten de miniaturen tegen de knop.
  - S3 (geen beeld, kop op twee regels): linksonder weer het lege vlak van sessie 243.
  - **Animatie bewust niet:** de pagina heeft één beweging per command (de registratie); een
    tweede beweging onderaan is decoratie, en onder reduced motion bleef het vlak toch leeg.
  Prijs: sectie 393 → 429 @1440, 509 → 656 @375. De negen WebP's (21.966 B) zijn weg.
Bewaakt: "Polish (sessie 245)" (noot, slotlijn) en "De sample toont wat erin staat" (zin = pdf,
verwijzingen binnen de pdf en oplopend, geen miniaturen, bovenlijn op de knoprij, binnen de
naad); zeven mutanten, elk op een eigen assertie.

**Een guard die met zijn populatie meegroeit, krijgt een budget dat meegroeit.** De gate van ronde
2 ving één faler: "geen pagina scrolt zacht" (sessie 244) laadt alle 30 pagina's in één test met
de vaste 30s. Los: 15s in Firefox, traagste pagina 1,5s, geen uitschieter; in de volle gate één
keer over de grens. Nu 5s per pagina.

**Gemeten, niet opgelost.** Het terminalveld verandert bij focus 0 pixels: alleen de caret, die de
invoerregel van de module met zijn prompt deelt. Genoteerd voor de finish review.

## Finish review (sessie 246)

`impeccable-finish-reviewer`, vers en zonder historie, met het contract, 26 beelden (1440 en 375,
beide thema's via de echte schakelaar, transities bevroren, full-page zonder banner, folds mét
banner, mobiel in stukken van 1200px), de craft floor en de betwiste detectorbevindingen.
Geen comp en geen QUALITY BAR-kaart (code-led zonder beeldgeneratie): TYPE, MATERIAL en GROUND
tegen OWN-WORLD. Die drie: **match** (papier #efefec zonder crèmedrift, inkt #111 zonder
slatedrift, Archivo 700, geen nepmateriaal).

**Review: `disposition: fix`**, acht material fixes. Elke bevinding eerst nagemeten.
**Verdict pass: `disposition: ship`**, voor de acht gescoorde fixes (geen nieuwe review van het
hele oppervlak). 1-6 resolved, 7 en 8 door de reviewer ingetrokken.

| # | Bevinding | Gemeten | Besluit |
|---|---|---|---|
| 1 | Terminalveld toont focus alleen via de caret (open punt sessie 245) | Twee rode zijstrepen van 4px: 308 px (licht), 225 (donker), tegen ~3300 die WCAG 2.4.13 vraagt. "0 pixels" uit sessie 245 was zelf een meetfout. | De ring van de pagina om de invoerregel. De bovenzijde verdween onder het `position: relative`-lichaam; de regel is nu zelf gepositioneerd. |
| 2 | Consentbanner in de oude wereld | Licht `#fff` + blauw `#074fa4`, donker `#161b22`. 75-110px van elke eerste viewport. | Papier/inkt, inktlijn boven, knoppen die inverteren; weigeren even zwaar als accepteren. |
| 3 | Chip "volgende" = balk van 6px | Bij hover verdween hij in de geïnverteerde chip (beide thema's). | Proef C0/C1: **C1**, de index inverteert. Kolom houdt 1.8em, command verschuift 0px. |
| 4 | Herkenbaar-terminals breken naar kolom 0 op mobiel | 4 regels op 320-414, "← Je lokale" / "IP adres" uit elkaar. | Proef H0/H1/H2: **H2**, hangende inspringing (2em) en de glos op een eigen regel onder zijn waarde, zoals de mobiele hero. Ingesprongen met dezelfde acht spaties: Chromium rondt de tekenbreedte af op 8px (Firefox 7,68), dus 4,8em stond 2,6px naast "inet". |
| 5 | `[♥]` in de footerknop | Glyph als icoon naast een SVG-icoon; ♥ kan op iOS als emoji renderen. | Alleen tekst. Gedeeld: `footer.js` v5, `init-components.js` v7, dode regel uit `main.css` (v240). 108 pagina-configuraties: 0 verschillen buiten die knop. |
| 6 | CTA niet op de onderste kopregel | Onderkant 20,7px (1440) / 21,4px (1280) boven de basislijn van regel 2. | Onderkant op de basislijn: `margin-bottom: calc(var(--af-display) * 0.165)` (0,162-0,168 gemeten over 1280-1920). Microcopy naar de rij van de ondertitel. Vouw ongewijzigd. |
| 7 | h1 niet uit het raster gesneden op mobiel | Op 1440 lopen de haarlijnen óók door de h1. | Niets: "de kop op afficheschaal mag over het raster staan" (sessie 242). Ingetrokken. |
| 8 | FAQ `layout-transition` (detector) | Berekend `transition: none` op `.faq-answer`. | Niets. Ingetrokken. |

**Eigen pass (niet in de lijst van de reviewer):** onder 769 stond er **164px** tussen
nieuwsbriefveld en knop. `flex: 1 1 220px` (sessie 245) wordt in de flexkolom van `main.css` de
hoogte. Nu `flex: none` tot 768 (dezelfde grens als `main.css`): 25,6px, de foutreserve. De guard
van sessie 245 eiste alleen "gestapeld" (dTop < −20) en liet het gat door.

**Bewust niet (ceiling-punten van de reviewer):** wisselende banden (sessie 242, ritme naar
gewicht), lege kolommen 8-12 naast de cijfers (sessie 245, proef N3), het slot op inkt (dat zou
samensmelten met de inktband van de sample direct eronder, één zwart vlak van ~1000px).

**Bewaakt** in `homepage-conversion.spec.js` "Finish review (sessie 246)" (ring per zijde in
pixels met een rust-tak zonder rood, bannerkleuren uit de tokens, index-inversie en hover,
inspringing en glos op 320-1440 met een tak die gebroken regels eist, CTA op de basislijn over
1280-1920, veld→knop ≤ foutreserve op 320-768, glyphs met positieve controle) en `hero-demo`
"focustoestand" (ring, geen zijstreep). Acht mutanten, elk op een eigen assertie, eerst
gecontroleerd dat ze geserveerd werden. `blog-theme-toggle` "all blog pages" kreeg een budget per
pagina: los gelijk aan HEAD (15,1 tegen 15,0s), in de volle gate over de vaste 30s.

**Documenter.** `impeccable-documenter` schreef `DESIGN.md` en `.impeccable/design.json`
(schemaVersion 2) opnieuw, afgeleid uit `affiche.css` en de gerenderde pagina, en verving de
oude wereld (lime op GitHub-donker) volledig. Steekproef: 18 waarden tegen de CSS-regel en 5
gerenderd (h1 64,8, h2 47,52 Archivo, CTA 20,7px wit, raster 1400, body 18px): allemaal gelijk.
Wat hij als afwijking tussen contract en CSS vond, en wat ermee gebeurde:
- De letter op rood: de notitie hieronder was fout, gerepareerd in de bron (zie "Nog niet besloten").
- Haarlijnen alleen in de hero, mono ook voor paden en paginaverwijzingen, en onder 768 vier
  kolommen i.p.v. "een kolom": besluiten uit latere rondes; DESIGN.md beschrijft de bouw.
- "Geen verlopen": de haarlijnen zijn getekend met gradiënten met harde overgangen. Vastgelegd
  als regel (lijnen tekenen mag, zichtbare kleurverlopen niet).
- **Kolomkoppen op de naad, opgelost in dezelfde sessie.** "Verder lezen op de blog" stond in
  vette mono (mono is voor wat je kunt nalopen, niet voor een kop) en "In gewoon Nederlands" in
  600: één functie, twee vormen. Proef P0-P2 (`.playwright-mcp/s246-proef-kolomkoppen.png`):
  **P1**, allebei Atkinson 700 in gedempte inkt. P2 (inkt) liet de kop concurreren met de glos en
  de links die hij aankondigt. Eén regel voor beide; 200 posities en beide labels 0px verschoven.
  Bewaakt: geen kop in mono (populatie: élk h1-h6 en elk doel van aria-labelledby, niet een
  lijst) en de twee koppen hebben één vorm; twee mutanten, elk op een eigen assertie.
- **Open, buiten deze ronde:** `code` erft nog 4px radius uit `main.css` (onzichtbaar, geen
  achtergrond). Gedeelde regel, dus bij de migratie van de andere pagina's (TASKS #85).

**FINISH afgelost:** review, verdict (ship, op de gescoorde fixes) en DESIGN.md zijn er. Rasters:
gemeten, niet aangenomen. `index.html` laadt twee rasters, `favicon-96x96.png` en
`apple-touch-icon.png`, allebei van vóór het traject; de bouw maakte geen enkel raster (code-led,
geen beeldgeneratie). `impeccable embed-prompt --scan assets` meldt 26 van 26 rasters zonder
ingebedde herkomst: allemaal bestaand (productcovers, screenshots), geen ervan geladen door deze
pagina. Niet ingebed: dat wijzigt binaire bestanden sitebreed voor een pagina die er geen levert.
Als herkomst sitebreed gewenst is: een eigen taak.

## Bolder (sessie 247)

**Aanleiding.** Verdict `ship` in sessie 246, en toch van de eigenaar: "strak, maar oogt niet
uniek". Een review toetst het contract, niet de ambitie; dit contract was zelf ingetoomd.
`impeccable` geladen; `bolder.md`, `overdrive.md`, `animate.md`, daarna `craft-floor.md`.

**Eigen pass (1440 en 375, beide thema's via de schakelaar, transities bevroren).**
- Skeleton test: zonder copy las het eerste scherm als dashboard (kop, zwart blok, rij vakjes,
  rij vakjes). Chips en diagram droegen dezelfde celvorm en hetzelfde gewicht.
- De h1 (64,8px) was 1,26x de sectiekop; het zwaarste vlak was de terminal, niet de kop. Kolom
  10-12 boven de knop was leeg papier.
- "Het moment zit achter een klik": half waar. De auto-demo opende met nmap, maar de poorten
  flitsten 450ms bij laden terwijl het oog op de kop stond, en het hele moment kwam pas na
  14,9s terug. Op 375 stond het diagram 290px onder de vouw: daar nooit gezien.
- Rood: 1,07% van de viewport op 1440.

**Proeven** (`.playwright-mcp/s247-proef-{0,A,B,C,AC,onder}.png`, gelijke maat, licht en donker):

| | 1440 `.af-net` (≤900) | 1280 (≤800) | 1024 invoer (≤768) | rood |
|---|---|---|---|---|
| nu | 788 | 770 | 663 | 1,07% |
| A: kop over 12 kolommen, 6,7vw | 883 | 856 | 700 | 1,07% |
| B: rood vlak kolom 10-12 | 788 | 770 | 716 | 3% op 1440, 12-14% op 1024/375 |
| C: diagram groter + scan speelt zelf | 815 | 797 | 663 | 1,07% |
| A+C, 6,2vw | 897 | 871 | 690 | 1,07% |

**Besluit (go eigenaar): A+C, plus de omwisseling slot/sample. B niet.** A geeft het
statische affiche, C het ene moment. B las op 1440 als een grotere knop en werd op smal
opdringerig (12-14% rood); het rood blijft de actie. Bolder.md: "commit, then quiet
everything around it": een schaalzet en een moment, niet drie.

**Gebouwd** (gemeten na de bouw):
- `--af-affiche: clamp(2.2rem, 6.2vw, 4.9rem)` voor de h1, over 1/-1, lh 0,94, -0,02em. Het
  plafond is de rasterbreedte: 6rem gaf op 1920 drie regels. 1440: 88,2px, kop 89-255;
  verhouding tot de sectiekop 1,86. Op 375 blijft 35,2px (40px gaf vijf regels).
- Vanaf 1280 is `.af-actie` een blok in kolom 10-12 op de rij van de ondertitel, de knop op
  haar eerste regel (267 = 257 + 10), de microcopy eronder.
- Poorten 56px; de letter schaalt naar de sleuf (container query), met 1rem en open 1,3rem
  als plafond (zie Gate 1 hieronder); bloknamen 1.4rem. De open poorten zijn de zwaarste
  inversies van het scherm.
- De scan: de reeks rolt regel voor regel uit (`clip-path`, 90ms per regel, alleen de regels in
  het venster tellen), bij nmap tekent eerst de pijl zich (360ms, `--scan-duur`), en elke open
  poort springt open op de tik van zijn regel. `is-open` staat meteen: de toestand is waar, het
  beeld wacht. Speelt bij laden, en één keer opnieuw als het diagram pas later voor 60% in
  beeld komt (1280x800, mobiel). Onder reduced motion: de eindstand, op beide paden.
- Slot op inkt (slotactie inverteert naar papier), sample op papier (tabel met bovenlijn 2px
  inkt, rijen in de bedieningslijn). Volgorde: band, inkt, papier, band.

**Teruggedraaide besluiten, met prijs:**
- *De vouw op 1280x800* (sessie 241): poorten 864/800. De guard toetst daar nu de bedoeling
  (de scan speelt als het diagram in beeld komt, één keer), met een tak die faalt zodra de
  poorten weer boven de vouw staan. 1440 en 1024 houden de pixelvouw.
- *De koppenmaat bewust klein* (sessie 240): vervallen, met de vouw gemeten (zie boven).
- *CTA op de basislijn van kopregel 2* (finish review s246, #6): naast de kop is geen plaats
  meer. Nu: actie op de rij van de ondertitel.
- *Eén beweging per command* (signatuur): wordt één reeks per command, regel voor regel.
- *De sample als enige inktband* (sessie 242): het slot is nu die band.
- Roodbudget ongewijzigd: één drager per scherm, een primaire actie.

**Bewaakt.** `hero-demo` "De scan" (laden 1440 met de scan in beeld en geen tweede; 1280
replay één keer, met zelfbewakende tak; poort op de tik van zijn regel en na de pijl; reduced
motion bij laden én bij zelf typen) en "De vouw" (1440, 1024). `homepage-conversion`: kop op
afficheschaal (2 regels, stap ≥1,7, knop op de eerste regel van de ondertitel, microcopy
eronder, 1280-1920) en slot/sample per thema (met de hero-hover als tak tegen lekken). Negen
mutanten, elk geserveerd gecontroleerd en elk op een eigen assertie. Twee lessen onderweg: een
mutant (`flex-direction: row`) landde maar veranderde niets door `flex-wrap`; en de
reduced-motion-guard keek alleen naar het laadpad, waar `lichtOp` onder reduce nooit wordt
aangeroepen. Achteraf `getAnimations()` lezen na `goto` was flaky (de reeks kan voor `load`
voorbij zijn); de guard logt `animationstart` vanaf de eerste byte.

**Gate 1: 838 passed, 17 skipped, 3 failed**, één test in drie motoren: "Hero op elke
breedte … per 8px", poortlabel zonder 4px lucht op 320-336 en 1024-1184 ("3306", "8080", open
"443"). Mijn eigen meting keek naar 1440, 1280 en 375, niet per breedte; de guard van sessie
243 ving het. Fix: de poortrij is een container en de letter rekent tegen de sleuf
(`min(1rem, calc(3.4cqw - 4px))`, open `min(1.3rem, calc(4.5cqw - 5px))`, zes per rij
`6.8cqw`/`9cqw`). 1440 ongewijzigd (18 / 23,4px), 1024 14 / 18,9px, 320 13,8 / 18,6px. De
gate zelf was de mutant: met de vaste maat vuurde precies deze assertie.

**Budget:** runtime 1082,35 → 1089,83 / 1120 KB (na de reviewfixes; marge 30,17).

**Gate 3 (na de reviewfixes): 847 passed, 17 skipped, 0 failed, 0 flaky.**

**Finish review (s247): `disposition: fix`**, vijf material fixes, elk eerst nagemeten:

| # | Bevinding | Gemeten | Besluit |
|---|---|---|---|
| 1 | Signatuur niet in rust: de lus toonde na 3,2s `ls`, 53/80/443 gevuld zonder regels | Klopt: `ls` op 3,5s, `whoami` op 7,5s; 12 van elke 15,2s | Geen lus meer: het nmap-frame ís de ruststand. Replay op 1280/mobiel blijft, één keer. |
| 2 | Moment achter de consentbanner (1440, eerste bezoek) | Deels: de laadreeks loopt 0-1,1s, de banner komt op 2,57s; daarna dekt hij de poortrij (823 tegen 812-868) | Geen replay na de banner: met fix 1 staat de eindstand heel in beeld na het wegklikken. |
| 3 | Overname: lege terminal, poorten gevuld, uitnodiging weg | Poorten: klopt. Uitnodiging: eerder besluit (`is-taken`) | Diagram naar rust bij overname (`rustDiagram`). Uitnodiging blijft weg: een aangenomen uitnodiging is ruis. |
| 4 | Mono-pad boven de bloglinktitel = eyebrow (floor) | Klopt | Pad onder de titel, in de onderpadding van de link met `pointer-events: none`: tikdoel 44px heel. |
| 5 | DESIGN.md verouderd | Klopt | Documenter na de verdict. |

**Ceiling (voor #90, niet in deze ronde):** het raster stopt bij y≈950; zeven van zeven secties
hangen aan kolom 1; elke sectie is H2 → lede → module met metronoom-wisseling papier/band;
Herkenbaar en het leerpad zijn herhaling als structuur; de cijfers en de slotkop gebruiken de
afficheschaal niet; het onderscheid (de naad met aanhaallijn en Nederlandse glos) leeft alleen
in de hero. *Uitgewerkt in "Layout (sessie 248)": cijfers en slotkop staan op afficheschaal en
het raster loopt in de cijfers door; Herkenbaar, de metronoom en de naad buiten de hero bewust
niet.*

**Bewaakt:** "de ruststand is het nmap-frame" (na 8s alleen nmap, elke gevulde poort met regel
en glos in beeld), "overname zet het diagram in rust", "bloglinks: het pad onder de titel"
(met tikdoel en hit-test). Drie mutanten (lus terug, rustDiagram weg, pad weer boven), elk op
een eigen assertie. Onderweg twee meetfouten in mijn eigen tests, gevangen door de
zelfbewakende tak: een observer die pas op DOMContentLoaded startte (modules draaien eerder), en
`elementFromPoint` buiten het venster (geeft `null`). Herhaling: 81/81 in drie motoren, zonder
retries.

## Layout (sessie 248)

**Aanleiding.** Na bolder (s247) van de eigenaar: "meer dan alleen bolder: indeling, ritme,
onderscheid". `impeccable` geladen, `reference/layout.md` voor het eerst in dit traject, daarna
`craft-floor.md` vlak voor de eerste edit. Twee geïsoleerde beoordelingen.

**Layoutbeoordeling (1440x900 en 375x812, transities bevroren).** De hero leest goed; daaronder
zeven blokken van gelijk gewicht. Gemeten: 7/7 koppen op kolom 1, elke h2 47,52px (slot 64,8),
6/7 secties kop 1-7 / ding 1-7 / uitleg 8-12; na de h1 (88,2) geen schaalsprong; kolom 8-12 leeg
naast de cijfers (266px hoog) en in het slot (349px inkt, 5/12 leeg). In Herkenbaar staat het
Nederlands als `.af-sub`-pijltje ín de module, de enige rij in de oude 80/20-vorm. **Oordeel:
de indeling, niet de wereld**: het vocabulaire (raster, naad, inversie, afficheschaal) werd onder
de hero niet gebruikt. Dus `layout`, geen `new-work`.

**Mechanische scan** (`detect --scope layout` tegen de URL, 1280 en 390): 11 en 10 meldingen,
geen structurele. `cramped-padding` op dichte FAQ-items en de oplichtende terminalregel,
`content-hidden-at-rest` 41-43% = de dichte FAQ-antwoorden (bewust, s244).

**Proeven** (`.playwright-mcp/s248-proef-{P1,P2,P2b,P3}-{1440,375}.png`, nul-stand ernaast,
licht en donker via de echte schakelaar):

| | sectie 1440 | sectie 375 | besluit |
|---|---|---|---|
| P1 Herkenbaar: glos per regel op de naad | 1069 → 1467 | 1442 → 1567 | **verworpen** |
| P2 cijfers over 12 kolommen + haarlijnen | 593 → 677 | 471 → 481 | **gekozen** |
| P2b als P2, zonder haarlijnen | 593 → 677 | 471 → 481 | (prijs van het raster los) |
| P3 slot als tegenhanger van de hero | 349 → 347 | 361 → 358 | **gekozen** |

- P1 maakte elke Herkenbaar-rij kop → tekst → module (precies het stramien), liet de
  rechterkolom leeg (vier korte glossen op +398px), en er valt weinig te glossen: 8 van de 12
  regels zijn al Nederlands (`[!]`, `[TIP]`). De glos als drager werkt in de hero omdat daar
  Engelse uitvoer staat; elders is hij decoratie in de vorm van uitleg. Niet geforceerd.
- P2 boven P2b: het raster loopt één keer door, als tabel (rijlijnen kruisen kolomlijnen).
- Go eigenaar: P2 + P3.

**Gebouwd** (`fd55a70`, reviewfixes `3e71936`):
- **Cijfers** over 12 kolommen via subgrid: getal op `--af-affiche` in 1-3, label 4-9 (de cel is
  de maat), bron 10-12. Elke cel snijdt zich met papier uit de haarlijnen. Elke cel draagt
  `--af-cel`: getal en bron staan vanaf 768 exact even ver van hun lijn (12 @768 … 20 @1440).
  Onder 768: getal in kolom 1 óp de lijn ("40+" is 62,9px, kolom op 320 72px), label 2-4, bron
  eronder. Hover en focus inverteren rij en cellen.
- **Slot**: kop op `--af-affiche` over 12 kolommen; vanaf 1280 zin 1-8 en actie 10-12 op één
  rij, knop op de eerste zinregel (zelfde definitie als de hero). `--af-display` vervallen.
- Een dode `background: none` op het getal (landing.css zet daar al lang niets meer) versloeg
  de uitsnede; de pixelguard ving een haarlijn door "40+" (71 van 81 pixelrijen).

**Omgegane besluiten, met prijs:**
- *Haarlijnen alleen in de hero* (s242): nu hero én cijfers, verder nergens. Bewaakt als
  populatie (élk element met een betegelde verloop-achtergrond), niet als selectorlijst.
- *Kolom 8-12 leeg naast de cijfers* (s245, N3): de tabel vult nu het raster. De noot-afweging
  van N3 blijft geldig: er staat geen glos naast de tabel.
- *De naad 7|8 voor elke tweedelige rij* (s242): de cijfers zijn een benoemde uitzondering;
  de naadguard noemt ze in commentaar en de Layout-guard bewaakt hun eigen vorm.
- *Slotkop op display over 1-7*: nu afficheschaal; "geen kop groter dan de h1" blijft waar
  (gelijk mag) en bewaakt.
- *Getal op de lijn* (proef P2): teruggedraaid na de review, zie hieronder.

**Finish review (vers): eerst `recapture`, dan `fix`, verdict `ship`** op de gescoorde fixes.
- *Recapture*: mijn folds liepen via `html { scroll-behavior: smooth }`; transities bevriezen
  stopt een geprogrammeerde smooth scroll niet. Opnieuw met `scrollBehavior = 'auto'`,
  `behavior: 'instant'` en per shot gelogd: scrollY, navbar op 0, sectie onder de navbar,
  banner op `innerHeight` (16/16).
- Vier fixes, elk nagemeten: (1) focus gaf alleen de ring → inversie zoals hover; (2) getal op
  de lijn, bron 20px ervan, bij hover plakte het getal tegen zijn inktblok → beide cellen
  `--af-cel`. Het `::before`-voorstel van de reviewer niet gevolgd: dat legt de focusring
  midden in het inktvlak en de rijlijnen lopen dan niet meer gelijk met de bovenlijn van de
  tabel; (3) `max-width: 40ch` brak rij 1 af op kolom 7 → weg; (4) smal was de bron verborgen,
  zonder hover zie je niet dat de rij een link is → onder het label.
- Prijs (reviewer): het getal hangt in rust ~20px rechts van de kop, terwijl de inhoudsopgave
  van de sample "01" op de lijn houdt. Twee tabellen, twee regels. **Open**, zie hieronder.

**Bewaakt** in `homepage-conversion.spec.js` "Layout (sessie 248)": sweep per 8px 320-1920
(slotkop en getal op afficheschaal, slotactie in 10-12 op de eerste zinregel ≥1280 en eronder
smal, getal en bron op de rasterranden met gelijke binnenruimte, label op één regel ≥1280, bron
onder het label smal, geen overlap, geen overloop; zelfbewakend: 201 breedtes, beide vormen van
slot en tabel gemeten), haarlijnen alleen in hero en cijfers (populatie), geen haarlijn door tekst
in de cijfers (gerenderde pixels, lijnkolom gezocht in apparaatpixels, positieve controle per
lijn, beide thema's), focus-inversie per thema met een rusttak. **Twaalf mutanten, twaalf
asserties**, elk eerst geserveerd en gerenderd gecontroleerd. Een mutant ving een fout in de guard
zelf: de smalle tak telde ná een vroege `return`, dus vuurde de zelfbewakende tak in plaats van de
bedoelde assertie.

**Gates:** gate 1 afgekapt (`exit 124` op 869/876: de deadline van 30 min was te krap, 0 fouten
tot daar; telt niet als groen). Gate 2: 859 passed, 17 skipped, 0 failed. Gate 3 (na de review):
865 passed, 17 skipped, 0 failed. Runtime 1089,83 → 1092,76 / 1120 KB.

**Gemeten, niet opgelost.**
- **WebKit werkt layout niet bij als het venster in kleine stappen over een mediagrens groeit**
  (matchMedia zegt al het nieuwe): over 768 bleef `display: none` staan (85 breedtes), over 1280
  bleven hero- én slotactie links (81/81). Gelijk op de commit vóór deze sessie (HEAD-css via een
  route geserveerd); weg na een herlading. Zelfde familie als de rijhoogte in s243. De sweep laadt
  op 768 en 1280 opnieuw. Alleen voor wie een Safari-venster sleept.
- **Twee tabellen, twee regels**: cijfers met binnenruimte, de sample-inhoud op de lijn. Eén
  regel kiezen hoort bij #85 (de gedeelde laag), niet bij deze ronde.

**Bewust niet (ceiling van de reviewer, voor de eigenaar).**
- *Basislijn-registratie*: label en bron op de basislijn van het getal (FORM belooft "zelfde
  basislijn"). Nu `align-items: center`. Goedkoop en on-thesis, maar niet gevraagd en niet
  geproefd.
- *"Geen schaalsprong na de hero"* was het probleem, niet het doel: de schaal springt nu
  88 → 47 → 88 (cijfers) → 47 → 88 (slot). Kop van ±47 boven getallen van 88: in gewicht is de
  kop het lichtste element van zijn sectie. Dat is gekozen, geen tegenspraak.
- *Onderscheid via de naad*: P1 liet zien dat de glos onder de hero geen inhoud heeft. Het
  onderscheid blijft in de hero; het raster en de afficheschaal lopen nu door.
- *Metronoom papier/band*: P2 breekt hem één keer met textuur; meer vraagt een nieuw ritmebesluit.

## Onderscheid (sessie 249-250)

**Aanleiding.** TASKS #91, eigenaar na sessie 248: "stukken beter, maar het kan nog
onderscheidender". Hero onrustig/onduidelijk, Herkenbaar saai, de sample zigzagt, en de wens
"secties die op een bepaalde manier in elkaar overlopen".

**Sessie 249 (niet apart gecommit; samen met 250 vastgelegd).** Critique (dual-agent) 26/36,
detector zonder echte defecten. Gebouwd na go:
- **V3, de hero zonder diagram.** Het netwerkdiagram (markup, CSS, `zetDiagram`, `rustDiagram`,
  replay) is uit de hero: zes lagen onder elkaar las als onrustig. De actie staat in de leesrij
  onder de ondertitel in plaats van in kolom 10-12 ("vreemd gepositioneerd"), met de microcopy
  "Geen account nodig. Alles is nagebootst: je raakt geen echte systemen."
- **H2, de toetsenrij.** De chips aaneen op het raster, strak onder de invoerregel, zonder
  herkomstlabel.
- **S3, de sample onder elkaar** (kop, inleiding, inhoud, actie), met de inhoudstabel op het
  raster: één regel voor een cel op de lijn (open punt (a) van 248).
- **B1, basislijn-registratie** in de cijfers (open punt (b)), en in het leerpad de knop vóór
  "Lees eerst" in de bron, zoals in beeld.

**Teruggedraaid na het live-oordeel van de eigenaar, met prijs.** Beide waren gekozen op
verkleinde verzamelbladen; op ware grootte zag de eigenaar het meteen. Gemeten op de
sectiecaptures van 249 (grootste aaneengesloten inktvlak, lijnen dunner dan 5px gefilterd):
- **E1, het slot als laatste sectie, direct op de footer:** "Klaar om te beginnen loopt in één
  zwart vlak door naar de footer". 655.756 → 1.102.926 px² op 1440 (+68%, 820px hoog),
  193.192 → 303.212 op 375 (+57%).
- **K2, Herkenbaar als één doorlopende module:** "één groot zwart vlak". 100.535 → 435.405 px²
  op 1440 (4,3x).
- Prijs van het terugdraaien: de wens "secties die in elkaar overlopen" staat nog open.
  "Overlopen" betekent niet: vlakken samensmelten. Een volgende poging toetst eerst de massa
  (zie hieronder) en wordt op ware grootte voorgelegd.

**Sessie 250: verder op de hero.** Eigenaar: cat en help tonen geen tekst bij "In gewoon
Nederlands"; het lime komt uit de oude wereld, en ook de andere modulekleuren (hero,
Herkenbaar, leerpad) mogen worden beoordeeld; alles zit krap op elkaar; is het weinige kleur
op de pagina bewust? Werkwijze: proeven als losse folds op ware grootte (1440x900, 1280x800,
375x812, licht en donker), per variant de grootste aaneengesloten donkere vlakte gemeten.

- **De glos bij elke reeks.** De bron gaf regels die al Nederlands zijn bewust geen glos, en dan
  stond de kolom leeg (`help`, `cat`, en ook `nmap` op een ander adres). Nu krijgt elke reeks
  er minstens één, die niet vertaalt maar uitlegt: wat cat doet, waar een naam vandaan komt
  ("van concatenate: aan elkaar plakken"). Gemeten: 16 invoeren x breed/smal, 0 reeksen leeg.
- **Lucht naar groep.** Op 1440 stond alles even ver: nav→kop 30, kop→zin ±14, zin→knop 20,
  knop→terminal 26. Nu zijn kop, zin en knop één groep, en de stap naar de terminal is de grote:
  minstens 40px en 1,4x de grootste stap binnen de groep, op elke breedte (1440: 49,7; 375: 40).
  Begrensd door de vouw op 1280x800 (toetsenrij onder op 793).
- **Het modulepalet (proef A/B, B gekozen).** A: warme tekst en een blauwe prompt (`#7ab4ff`,
  9,24). Rustig, maar alleen een kleurwissel. **B: de module spreekt de taal van de pagina.**
  Tekst uit de papierfamilie (`#d6d6d2`, 13,58; dim `#a3a39d`, 7,81) in plaats van
  GitHub-blauwgrijs; de prompt in papier 700 in plaats van lime; de cursor een blok in
  signaalrood; een `[TIP]` op een papieren label (inkt op papier, 16,39), omdat de tip de
  Nederlandse laag van de 80/20-output is: Engelse uitvoer op zwart, Nederlandse uitleg op
  papier. Zalm en amber blijven, en zijn nu de enige tinten. De eerste versie van B faalde: een
  strook over de volle modulebreedte las als een snee (dezelfde kleur als de pagina, op de rand);
  een label achter de tekst houdt de module heel. Massa op 1440 licht: 203.704 (nu) → 193.446
  (B); op 375 36,8% → 31,9% van de fold.
- **Een regel van het systeem opgerekt.** *One Voice* zei één rood vlak per scherm. De cursor is
  een tweede rood element in het eerste scherm (±10x22px, niet-tekst, 3,42 op de modulegrond),
  met dezelfde betekenis: jij bent aan zet, hier typ je. Buiten de module blijft het één rode
  drager per scherm; binnen de module is rood alleen de cursor. Beide bewaakt.
- **Herkenbaar:** de `[TIP]`-regels kregen in de transcripten geen tipkleur (klasse `output`),
  in de hero wel. Nu dezelfde `.tip` en hetzelfde label.

**Aangrenzend gevonden en gerepareerd.**
- *Halve regels in het venster.* Na `help` stond de `[TIP]` half onderaan, na `cat` een halve oude
  regel bovenaan. Drie oorzaken: de glos zakte 1px (Chromium, WebKit) of 0,5px (Firefox) voor de
  basislijn en maakte de rij 28 in plaats van 27; de padding van 8px scrolde mee, waardoor het
  venster 7,6 regels hoog was; en `toonCommand` zette de prompt op de rand. Nu een marge van
  -1px op de glos (alleen naast elkaar, onder 768 maakte hij de rij 47), een transparante rand
  van 8px in plaats van padding (een rand scrolt niet mee), en een mobiel venster van 12 hele
  regels (300 → 304px).
- *De eerste chip dood sinds sessie 249.* Het blok `@media (min-width: 1280px)` met de
  binnenruimte van de chips stond vóór de basisregel en verloor op volgorde: de eerste chip hield
  `--af-cel` (20px op 1440), 8px meer dan de rest. Nu erna.
- *De focusring van de invoerregel viel onderaan weg* sinds de toetsenrij er strak onder ligt (de
  chips schilderen erna). `z-index: 1` bij focus.
- *De accentbudget-sweep schoof nooit.* `perScherm` deed `scrollTo(0, y)` onder `html {
  scroll-behavior: smooth }` en wachtte 80ms: hij telde zes keer het eerste scherm. Gevonden toen
  de rode cursor op zes "schermen" stond. Nu `instant`, met een controle dat de pagina er echt is.
  De regel "één rode drager per scherm" is daarmee voor het eerst over de hele pagina gemeten.
- *De focustest van 246 mat tijdens een smooth scroll* op 375x900 (de invoerregel staat sinds de
  lucht net onder de vouw); nu `scrollBehavior = 'auto'` vóór het meten.

**Bewaakt.** `hero-demo.spec.js`: de diagramguards zijn vervangen door "Elke reeks heeft
Nederlands ernaast" (alle zes plus `cat README.txt`, `nmap 10.0.0.1`, `lss`; help per regel),
"De vouw: terminal en toetsenrij in beeld" (1440 en 1280, venster precies 7 regels, rand 8px;
1024; kolomkop en uitnodiging op hun rij), "Het venster staat op hele regels" (1440 en 375: elke
rij begint op een hele regel vanaf de rand, het venster is een geheel aantal regels; zelfbewakend:
het venster schoof), "De reeks" (rolt bij laden en niet opnieuw, 90ms per regel, reduced
motion), de ruststand (de drie poortregels met glos, geen diagram) en de overname (de demo-uitvoer
is weg en komt niet terug). Uit de breedtesweep zijn de poortlabels gehaald.
`homepage-conversion.spec.js`: "de actie in de leesrij" op 375-1920 (vervangt de guard voor kolom
10-12) en "lucht naar groep". `hero-accent-budget.spec.js`: geen lime meer op de pagina (met
positieve controle), rood in de module alleen de cursor, elke `[TIP]` op het label en de prompt
vet. Twaalf mutanten, twaalf asserties (vóór de review; zie hieronder voor de zestien), elk rood op de bedoelde melding; na elke mutant en
aan het eind sha256 van `affiche.css`, `hero-antwoorden.js` en `hero-registratie.js` gelijk aan
het origineel, 0 MUTANT-markeringen.

**Finish review (vers, zonder browser omdat de gate liep): verdict `fix`, vier punten, alle vier
verwerkt en nagemeten.** Daarna de captures die de reviewer zelf niet kon maken
(`.playwright-mcp/s250-aanvraag-*.png`): een fout (`lss`) in zalm, onderscheiden; focus en typen;
375 tot de toetsenrij; 1024.
1. *Het rode blok stond 2ch rechts van het invoerpunt* (gap van 1ch plus het rustveld van 1ch
   ervoor): "hier typ je" klopte niet. Nu `margin-left: -2ch` en exact op het invoerpunt in drie
   engines (0,0px). Een eerste versie ving de klik op het veld eronder (de suite zag het:
   "intercepts pointer events"), dus ook `pointer-events: none`. Bij overname verdwijnt het blok,
   en dan staat er alleen de native caret: nooit twee rode cursors in de module.
2. *Het contract sprak zichzelf tegen* (OWN-WORLD noemde nog de eigen kleuren van prompt en tip;
   een verminkte zin in FIRST VIEWPORT). Bijgewerkt.
3. *Het papieren label ook voor `[→]`.* Bewust: de echte renderer (`ui/renderer.js`) geeft `[?]`,
   `[→]` en `[TIP]` één rol (`info`), en PRODUCT.md maakt de afbeelding marker → rol bindend. Het
   label hoort bij de rol, niet bij het woord. Geen gedragswijziging: de hint blijft in de
   geschiedenis staan, zoals in een terminal.
4. *De cat-uitvoer op smal rafelde.* Het voorstel (een `smal`-variant met andere regelbreuken) is
   niet gevolgd: de harde breuk "   iets werkt" staat zo in het bestand (`structure.js:47-48`), en
   herschikken zou het bestand vervalsen. Het rafelige zat in de zachte omslag. Die springt nu 1,8em
   in (drie tekens), op de lijn van de harde vervolgregel: Firefox en WebKit exact, Chromium 1px
   (het rondt de letter af op 8px).
- *Ceiling, niet gedaan (voor de eigenaar):* de glos onder 768 heeft dezelfde kleur als de uitvoer
  (`--af-m-glos` = `--af-m-tekst`); Engels en Nederlands verschillen daar alleen in letter, maat en
  streepje. En Herkenbaar oogt als vóór deze ronde.
- *Aangrenzend:* de guard "@375px binnen 40 tekens" klopte niet; gemeten passen er 39 (319px, 8px
  per letter in Chromium). De lat is 39.
- Vier mutanten erbij (cursor op het invoerpunt, klik door het blok, zachte omslag, label voor
  `[→]`): **zestien mutanten, zestien asserties.** Eén meetfout in mijn eigen guard: een range over
  een regel met een `<span>` gaf ook de elementbox, die als extra rij telde; nu alleen tekstknopen.

**Gates.** De suite telt 1908 tests (gemeten met `--list`; HEAD 1824). De "17 skipped" en ±880 van
sessie 248 horen niet bij deze populatie en zijn niet te reproduceren.
- Poging 1 gestopt op 74/1899: de deadline van 60 min was gerekend op ±880 tests. Poging 2 gestopt op
  126/1899 met 0 falers, om de reviewfixes in te voeren. Geen van beide telt.
- **Gate: 1873 passed, 33 skipped, 2 failed (82 min).** De twee falers waren één test in Firefox
  en WebKit: de nmap-chip stond op 1280-1296 3,2/3,3px van zijn rand (lat 6). Een regressie van
  s249 (H2, zes gelijke kolommen); Chromium haalde het, en s249 draaide nooit een volle gate. Eerst
  rechts de kleinste celmaat geprobeerd: geen effect, want het command breekt nooit en staat links,
  dus alleen wat links staat telt. Fix: de indexkolom vanaf 1280 1,6em in plaats van 1,8em; lucht
  nu 6,2 / 6,3 / 10,8 (Firefox, WebKit, Chromium), van `[✓]` tot het command 5px. De gate zelf was
  de mutant: dezelfde assertie vuurde op de echte fout.
- **Herhaling van de specs die dit codepad raken** (hero-demo, homepage-conversion,
  hero-accent-budget) in drie engines: **464 passed, 4 skipped, 0 failed** (11 min).
- Skips (33), elk verklaard uit zijn voorwaarde in de bron: 18 motorgebonden (fontbudget, preloads,
  CLS, ES6-cascade, 4G, kadertekens), 9 onvoorwaardelijk `test.skip` (quota, dropdown, modal), 6
  alleen tegen productie (`_headers` is Netlify-only, lead-magnet). Geen raakt deze diff.

**Bekende toestand, geen regel:** gedimde uitvoer (#a3a39d) op de oplichtkleur (#23231f) haalt 6,22,
onder AAA, gedurende de 450ms van het oplichten. Met de vorige dim (#a1a8b0) was dat 6,57: ook
eronder. Gemeld door de documenter.

**Open na sessie 250, voor de eigenaar** (beslist in sessie 251, hieronder).
- *Kleur op de pagina.* Bewust: papier, inkt, één signaalrood (DESIGN.md). De eigenaar vroeg of
  dat zo blijft; mijn advies: ja, de kracht van het rood komt uit zijn zeldzaamheid. Meer kleur
  kan alleen eerlijk per functie, niet per sectie, en verandert een regel van de wereld. Eerst
  vaststellen wat de eigenaar mist (warmte, contrast tussen secties, iets anders).
- *Secties die in elkaar overlopen* (zie E1/K2).
- *Herkenbaar saai*: in 249 niet opgelost (K2 teruggedraaid).

**Sessie 251: het kleurgesprek en de laatste proef. Uitkomst: de huidige stand blijft, #91 is
dicht.** De eigenaar op "wat mis je aan kleur": "enige warmte en contrast. Feitelijk is alles
zwart-wit en heel klein beetje rood." Gemeten, en het klopt: op 1440 is 2,25% van de pixels
kleurig, waarvan 0,28% rood (de rest: zalm en amber in de module). Papier en band verschillen
1,13:1 (donker 1,11).
- **Voorstel van Claude:** één tweede kleur met één rol. Signaalgeel (`#ffc917`, inkt erop
  12,25) als het vlak waarop de Nederlandse uitleg staat (Engels op zwart, Nederlands op geel),
  altijd vlak en nooit letter; in de module alleen het label van de info-rol. Verworpen vóór de
  proef: crème papier (warmte zonder contrast, AI-standaardlook), meer rood (s247 proef B),
  oranje (te dicht bij rood en amber), blauw (koel, het accent van de blog).
- **Gevonden in de proef:** gele *letters* in de module (de glos `← Je lokale IP adres`)
  botsten met het amber van `[!]`; één tint droeg dan twee rollen. Wie ooit opnieuw kleur
  toevoegt: in de module is elke warme tint al bezet (rood, zalm, amber).
- **De proef** (folds op ware grootte, 1440x900, 1280x800, 375x812, licht en donker;
  `.playwright-mcp/s251-proef-{0,A,B,C}-*.png`). Grootste aaneengesloten donkere vlakte in licht
  in alle varianten gelijk aan nu (geel is een licht vlak); in donker brak het geel de massa
  (hero 72 → 61/58%, Herkenbaar 71 → 60/34%).
  - A "Rol": alleen het label en een gele aanhaallijn onder 768 (geel 0,9% van de fold).
  - B "Kolom": de uitlegkolom naast de module en de tekstcellen van Herkenbaar als geel vlak
    (12,5-16,7%).
  - C "Draad": B, met de gele kolom ononderbroken van de module tot het eind van Herkenbaar,
    over de sectiegrens (tot 35,7%); prijs: een leeg geel vlak van ±557x313px naast de kop van
    Herkenbaar.
- **Oordeel eigenaar: geen variant, laat zoals het was.** Daarmee staan ook de open punten:
  papier, inkt en één signaalrood blijven (DESIGN.md ongewijzigd); "secties die overlopen" en
  "Herkenbaar saai" worden niet verder nagestreefd; de glos onder 768 houdt de kleur van de
  uitvoer (onderscheid via letter, maat en aanhaallijn). De bron is in deze sessie niet
  gewijzigd.

## De gedeelde laag (sessie 252, TASKS #85 stap 1 en #88)

**Besluit (ook in PLANNING.md).** Twee lagen, twee bestanden: `styles/affiche-basis.css` is de
gedeelde laag (Archivo, de `--af-`-tokens op `:root`, navbar marketing én app, footer,
consentbanner) en laadt als laatste stylesheet op de 27 pagina's met chrome; `styles/affiche.css`
blijft de homepage onder `body.home`. Hertokend wordt op de componentwortel, niet op `:root`: de
oude wereld leest dezelfde tokens in pagina-inhoud. Niet `affiche.css` sitebreed (70.064 B,
grotendeels homepage, render-blocking zonder gebruik), niet in `main.css`/`landing.css`
(laadvolgorde: vijf latere bestanden winnen elke gelijke stand; `landing.css` laadt niet op de
terminal; de naad oud/nieuw verdwijnt in 97 KB).

**Wat er sitebreed veranderde.** Navbar papier met inktlijn (donker geïnverteerd), woordmerk
Archivo 800, nav-CTA als inkten kader. De pagina waar je bent is een onderstreping van 2px, geen
inktblok (eerst als blok gebouwd; met de eigenaar herzien: 'hier ben je' en 'hier wijs je' waren
hetzelfde gebaar, en het zwaarste vlak wees naar waar je al was). Footer `#111`/`#000`; de zweem
`rgba(22,27,34,.5)` in donker is in de bron (`main.css`) weg, en op index zelf twee relicten
(`.nl` `#fff`, tagline `#a1a8b0` → `#efefec`/`#b0b0ab`). Banner papier met twee gelijkwaardige
inkten knoppen. De terminal-navbar: dezelfde rail (merk 56 → 52 @1440, 32 @1280, 20 @375), links
16px uit elkaar (was 24), schakelaar 44px (was 30) zonder zichtbare labels, Help-menu papier met
inkten kader (was inkt op `#1a1a1a`, onleesbaar), iconen inkt (waren wit op papier).

**#88: inklappen op wat past.** `navbar.js` (`bewaakInklap`) zet `html.nav-ingeklapt` zodra de
uitgeklapte nav niet past met 64px tot het merk (met 16 stond "Blog" dichter bij het merk dan bij
de volgende link). Links op `nowrap`. Omslag nu 1224-1232 (marketing) en 1000-1008 (terminal) per
engine; op HEAD liep de terminal-navbar op 769-1033 tot 266px buiten beeld (fixed, dus
onbereikbaar). Mobiele CTA-balk en footerreserve gaan mee op de klasse; `landing-demo.js` bouwt
zijn observers opnieuw bij een maatwissel van de balk (anders cachete hij hoogte 0).

**Gemeten.** 30 pagina's × 1440/375 × beide thema's via de echte schakelaar, 240 opnamen, twee
nulmetingen (ruisvloer 1/240). De pagina-inhoud bleef gelijk; elk restverschil herleid met een
tegenproef: 1px kortere pagina (footerrand) verschuift full-page-opnamen, de ondoorzichtige footer
verandert de anti-aliasing op terminal donker (0 px met een ondoorzichtige footer op HEAD), de
banner is een eigen laag (0 px met de banner verborgen). Index-chrome tegen een HEAD-worktree:
nav, menu en banner pixelgelijk, footer alleen x 52-408 (de twee kleurcorrecties).

**Bewaakt.** `gedeelde-laag.spec.js` (chrome = index op elke pagina, beide thema's; grond van
niet-gemigreerde pagina's beweegt niet; blogpostinhoud leest de oude tokens; actief = onderstreping;
terminal-rail en schakelaar), `navbar-collapse.spec.js` (uitgeklapt ⟺ past, op elke breedte; tekstzoom
200%; terminal dezelfde regel). Mutanten met sha256-herstelcontrole: M1 hertoken op `:root` → grond;
M2 footertoken weg → footerkleur; M3 actief als blok → onderstreping; M4b `#navbar` padding → rail;
M5 merklucht 16 → merklucht; M6 observer-herbouw weg → CTA-balk @375; M7 schakelaarfocus → rode ring;
M8 tekstzoom-observer weg → tekstzoom. Equivalente mutant M4 (rail op `.navbar-content`) wees een
dode regel aan; verwijderd.

**Wat de eerste gate vond (1872/20/1/33), en hoe het opgelost is.**
- *Terminaluitvoer leidde "mobiel" af uit de navbar* (18 falers, `responsive-ascii-boxes`
  op 800/900 in drie engines): `isMobileView()` in `src/utils/box-utils.js` gaf mobiel als de
  hamburger zichtbaar was. Zolang de terminal-navbar op 768 inklapte viel dat samen; nu kreeg
  een venster van 900px de mobiele lijst in plaats van de boxen. Nu `max-width: 768px`, de
  oude betekenis, los van de navigatie.
- *Tekstzoom klapte niet in* (Firefox; in Chromium slaagde het op geluk): de links groeien
  via een transitie, ná de meting (op het meetmoment r=1388 = past, 500ms later 1463). De
  ResizeObserver kijkt nu naar het merk én elk element rechts. Mutant M9 (alleen het merk)
  faalt in Firefox op de tekstzoomtest.
- *Merklucht 62,5 tegen 64 op 1224 in WebKit*: na de webfont werd via rAF gemeten; wie op
  `document.fonts.ready` wachtte, zag de terugvalletter. Nu direct.
- *Flaky sweep in WebKit (scrollWidth 1035 op 320-336)*: meten direct na `setViewportSize`,
  vóór het frame waarin de resize-gebeurtenis valt. De nav meet nu synchroon bij resize
  (vóór animatie-callbacks en schilderen), en de sweep laat één frame renderen vóór hij meet.
- Een schone herhaling van de geraakte specs in drie engines: 707/4/0/0.

**Bewust niet.** De paginagrond en lopende tekst van andere pagina's (fase B, per pagina, met
herbeoordeling van de oude kleuren en koppen in Archivo, besluit eigenaar); de oude
nav/footer-regels schrappen (fase C); de focus en selectie van de pagina-inhoud.

## Memorabel moment

Je doet niets, en bij laden rolt de nmap-scan regel voor regel uit; of je tikt zelf een command.
Links staat de uitvoer zoals de tool hem schrijft, rechts verschijnt per regel de Nederlandse
uitleg op dezelfde rij, en de tip staat op papier in de module. Zelfs bij `help` en `cat` staat
er iets in de kolom "In gewoon Nederlands": waar de naam vandaan komt, wat er gebeurt. (Tot
sessie 249 sprongen ook drie poorten open in een netwerkdiagram eronder.)

## Signatuurinteractie

De registratie: outputregel en glos lichten als één rij tegelijk op. Eén reeks per command,
regel voor regel (90ms), geen typanimatie per letter. Het venster staat altijd op hele regels.
`prefers-reduced-motion` toont de eindstand.

## Nog niet besloten

Besloten in sessie 240 (typeset, na een letterproef op gelijke maat en breedte):
- **Koppen: Archivo 700**, labels 800; 900 is eruit. Vergeleken met Archivo 900/800,
  Archivo smal (wdth 72) en Schibsted Grotesk op 64,8px over negen kolommen. 900 liet de
  woordspaties dichtlopen en las als startup-display; smal was het meest affiche maar luid
  (botst met "te intimiderend"); Schibsted kostte +38 KB zonder zichtbaar eigen karakter
  op deze maat. 700 staat al in het bestand: nul extra bytes, het bestand kromp 1.380 B.
- **Rood: #cc0a1e blijft.** Witte letter op rood 5,79 (`--af-op-rood: #ffffff`, sinds de bouw
  `a8bf4fa`; hier stond tot sessie 246 "papieren letter 5,02", dat is papier op rood en niet wat
  de knop draagt), rood op papier 5,02 (AAA grote tekst ≥4,5; de knoptekst is `max(1.15rem,
  19px)`, 20,7px vet op 1440). Warmer gaat onder de lat: #d4380d 4,17,
  #e0401f 3,70. Fout in de terminal is zalm (--af-m-fout), geen signaalrood.
- De koppenmaat: besloten in sessie 247, met de vouw erbij gemeten. De h1 gaat naar
  afficheschaal (`--af-affiche`, 88px op 1440); prijs en guard staan in "Bolder (sessie 247)".

- Het donkere thema: het geïnverteerde affiche (inkt als grond, papier als letter). Blijft
  verplicht, want de themaschakelaar bestaat sitebreed.
- De vorige bouw (terminal-hero, lime-accent, mono-koppen, commit 8b33014) is bewijs van
  wat werkte, geen autoriteit: behouden wat inhoud is (demo, chips, copy), de look vervalt.
