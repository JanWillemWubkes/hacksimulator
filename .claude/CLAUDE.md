# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 219)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 14 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125; +2 posts Sessie 160)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E over Chromium/Firefox/WebKit (spec- en test-aantallen: zie TASKS.md §Huidige Focus) | WCAG AAA | 182+27 CSS variables (main.css + landing.css)
**Bundle:** Runtime <400 KB (strikt, terminal.html) + SEO/content-pijler budgetloos (blog + assets). Site-totaal en exacte KB-breakdown wisselen per sessie — zie TASKS.md §Huidige Focus voor ground truth.
**Monetization stack:** Ko-fi + Brevo newsletter (double opt-in + welkomstmail + deliverability getuned) + Gumroad v1.0 (3 guides + bundel) + 2 lead magnets (Sample Pentest + Sample Juridisch, elk een eigen Brevo-formulier + automation sinds Sessie 212). Eigen consent banner (2 knoppen) met Consent Mode v2. **Geen advertenties** — AdSense verwijderd in Sessie 208 op gemeten kosten/baten. **Per-stack actuele status:** TASKS.md §M5.5 sectie-body.

→ **Live metrics (bundle, tests, sessie-counter):** `TASKS.md` §Huidige Focus + Voortgang Overzicht — single source of truth
→ **Architecture & document-ownership:** `PLANNING.md` v3.0 §Document Ownership | **Commands:** `docs/commands-list.md` (41 commands)

---

## Kritieke "Niet Doen"

→ **Framework & Tech Red Lines:** PRD §13 (Vanilla JS/CSS, <500KB bundle, no backend MVP, Dutch UI, 80/20 output, no arg logging)

---

## Command Output Principe: "80/20 Realisme"

→ **Formule:** Output (EN) + Inline context (← NL) + Tip (NL) + Warning (NL)
→ **Voorbeeld & Philosophy:** PRD §9.2

**Quick:** `nmap 192.168.1.1` → `22/tcp OPEN SSH ← Secure Shell` + `[TIP] Open poorten = attack vectors`

---

## Taal Strategie

→ **Matrix:** UI=NL | Commands=EN | Errors=EN+NL | Help=NL
→ **Rationale:** PRD §6.6 (trust, authenticity, accessibility)

---

## Educational Patterns

→ **3-Tier:** Error=Learning → Progressive hints → Man pages | Security tools=Consent+Warning
→ **Full pedagogy:** PRD §8.3

---

## Tone of Voice

**Principles:**
- **"je" (niet "u"):** Toegankelijk, persoonlijk (niet afstandelijk formeel)
- **Bemoedigend:** "Goed bezig!", "Bijna!", niet "Fout." of "Wrong."
- **Context geven:** Leg "waarom" uit, niet alleen "wat"
- **Symbols:** ASCII brackets only (`[TIP]`, `[!]`, `[✓]`) — terminal aesthetic, NO emojis in code

→ **Voorbeelden (good/bad pairs):** `.claude/rules/tone-and-output.md`

---

## Command Implementation Checklist

Bij nieuwe command: 80/20 output | Educatieve feedback | Help/man (NL) | Warning (offensive) | Mobile (≤40 chars)

→ **Volledige 8-stappen checklist:** `.claude/rules/command-checklist.md`
→ **Command specs:** `docs/commands-list.md`

---

## Architectural Patterns

→ **Top patterns met code:** `.claude/rules/architecture-patterns.md`
→ **All 40+ patterns indexed:** docs/sessions/current.md

---

## Recent Critical Learnings

### Sessie 219: Onder "in cijfers" was de homepage één blok — en de band die als voorbeeld gold, maakte in light mode nul verschil (09 aug 2026)
⚠️ **Never:**
- Een `rgba()` over een ondergrond zetten zonder het product uit te rekenen. `rgba(248,248,248,0.8)` over een `#f8f8f8` pagina composit naar **exact `rgb(248,248,248)`** — de cijfers-band die als goed voorbeeld gold, bestond in light mode alleen uit twee haarlijnen. De comment erboven zei "zeer subtiel off-white": de bedoeling klopte, de rekensom maakte hem nul. **Derde keer in vijf sessies** (215, 217, nu) dat een alpha-over-ondergrond niet is uitgerekend — dit is geen incident maar een patroon.
- Een kaart behandelen alsof hij een kleur heeft. `rgba(22,27,34,α)` is een **verhouding tot wat erachter staat**, niet een waarde: het verschil is `0.3 × |kaart − band|`, dus nul zodra de band naar `#161b22` kruipt. Daardoor is "banden lichter maken" op deze site structureel fout. Ik zag het niet in de cijfers (band Δ11 = prima) maar op de screenshot.
- Een assertie ankeren op iets dat zelf kan verdwijnen. Ik mat "de langste reeks ná de reeks die `results-section` bevat" — verliest die sectie haar band, dan slokt die reeks de pagina op en gaat de test **groen op een kapotte pagina**. Knip op DOM-positie, niet op een groepering die van de bug zelf afhangt.
- Aannemen dat een testfaler jouw code betreft omdat hij ná jouw wijziging valt. `playwright.config.js:32` draait standaard tegen **productie** (`BASE_URL || 'https://hacksimulator.nl'`); mijn eerste 5 rood waren de oude code die zichzelf correct rapporteerde.
- Een browserfout als codefout melden zonder cache-bust. `terminal.html` gaf lokaal een ontbrekende module-export bij byte-identieke JS; warme fetch 1603 bytes, cache-bustend 2157. Mijn MCP-debugbrowser hield een bestand van vóór Sessie 208 vast — precies de val die `architecture-patterns.md` §Cache Strategy beschrijft.
- Een meting vertrouwen die naast je eigen belasting draait. De enige rode test viel tijdens een run waar ik zélf twee extra Playwright-runs naast had gezet. Zelfde fout als Sessie 218, één sessie later.

✅ **Always:**
- Kwantificeer "het leest als één blok" voordat je erover ontwerpt. Groeperen op effectieve achtergrond gaf **3,8 schermen onder** tegen 1,6 boven — dat maakt van een smaakoordeel een meting, en levert meteen de norm voor de fix (949px / 913px = 1,05 / 1,12 scherm).
- Schrijf de **regel** op in plaats van waarden te kiezen. *Pagina = oppervlak, band = verdieping, kaart = verhoging* beslist beide thema's tegelijk, verklaart waarom lichter fout is, en maakt van drie ad-hoc rgba's één token. Netto vier CSS-regels weg, twee erbij.
- Kies de plaats van een beat op de invariant, niet op aantal. Eén band volstond omdat `how-it-works` oppervlak móét blijven (het volgt op de cijfers-band), dus leerpad is de eerste mogelijke beat en knipt de reeks doormidden.
- Prototype in de browser vóór je in het bestand schrijft. De kaart-botsing zag ik alleen op de screenshot; de cijfers zeiden dat het goed was.
- Laat de mutant de oorspronkelijke meting **reproduceren**. "Band == pagina" gaf 2392px (2,66) en 3070px (3,78) — cijfer voor cijfer de nulmeting. En kies een tweede mutant die alleen de andere assertie raakt: "band == `#161b22`" maakt uitsluitend de kaart-Δ rood terwijl het ritme groen blijft, wat bewijst dat die assertie niet overbodig is.
- Bump `?v=` op **beide** entry-points als de ene een custom property van de andere leest. `.section-band` (landing.css) leest `--color-bg-alt` (main.css); een oude cached main.css laat die var ongedefinieerd en `background` valt terug op transparent — álle banden weg.
- Beantwoord "moet dit erbij?" met de rol van de pagina. De homepage eindigt al met **drie opeenvolgende asks** en haar north-star is activation, niet e-mail — dus de juridische sample gaat er niet bij, ook al is de asymmetrie (17 links vs 1) echt. Die hoort contextueel opgelost, en is bovendien geblokkeerd zolang `sample-juridisch.html:132` een welkomstmail belooft die de automation nog niet stuurt.
- Zeg het hardop als een opruiming bytes **kost**. −2 CSS-regels netto, +2,88 KB: het commentaar dat beide rekensommen vastlegt is langer dan de code. Marge nu 2,3% — en 1000 → 1050 → 1100 → 1120 is drie bumps in 15 sessies, dus de volgende vraag is niet "bump".

### Sessie 218: De strook onder de terminal was AdSense-vulling die AdSense vijf maanden overleefde (09 aug 2026)
⚠️ **Never:**
- Een contentblok beoordelen zonder eerst te vragen **waarom het er staat**. `git log` gaf het antwoord in één regel: commit `1cc04ff` heet *"full-viewport terminal + scroll hint for AdSense content"* en `f748c38` droeg `?v=108-adsense-content`. Advertenties gingen eruit in Sessie 208; het blok bleef, met zijn aanleiding dood. Zonder die herkomst was dit een smaakdiscussie geweest — mét was het een feit. Let op wat er méér uit die commit komt: ook de 100vh-terminal is AdSense-erfgoed.
- `getComputedStyle` gebruiken alsof het een momentopname is. Het is een **live** object: ik zette het thema terug naar dark vóór het opbouwen van mijn resultaat, dus `cs.color` gaf de dark-kleur tegen een light-achtergrond die ik wél had geparsed — 1,42:1 onzin. Lees de waarden als string op het moment dat je ze meet.
- De contrastwaarde uit een notitie overnemen als het element een **eigen** achtergrond heeft. §10 noemt 3,10:1 tegen `--color-bg`; de kaart is `#ffffff`, dus de echte waarde is **3,30:1**. En controleer of het grote tekst is: 19,8px/700 telt als large (lat 3 / 4,5), dus "onder AA" was alarmerender dan waar — het haalde AA wél en AAA niet.
- Een exact aantal in copy zetten voor een groeiende inventaris. Mijn plan zei "Bekijk alle 41 commands" terwijl de site overal "40+" voert en `validate-docs.sh:432` daar een vloer op handhaaft.
- Links toevoegen aan een blok dat zonder JS op `opacity: 0` staat. De reveal-observer voegt `.visible` nooit toe, dus élke link erin is waardeloos. `index.html:62-66` had het `<noscript><style>`-vangnet al; terminal.html niet — en ik stond op het punt er negen bij te zetten.
- Een A/B-meting vertrouwen die naast andere belasting draait. Mijn eerste vergelijking gaf 4 rood tegen 1 rood en zag eruit als een regressie; de tijden verraadden het (1,0m vs 32s voor hetzelfde werk) omdat de achtergrondrun nog liep. Serieel opnieuw: 32/32 groen aan beide kanten.

✅ **Always:**
- Rangschik de rollen van een pagina in plaats van ze op te tellen. "App-oppervlak én doorstroom én SEO" wás de reden dat het blok alle drie slecht deed. De gedocumenteerde north-star besliste: `docs/launch-success-metrics.md:44` meet *activation* ("typte hij een command"), niet lezen — dus app eerst, SEO secundair, en "onboarding onder de vouw" is geen rol maar een bug.
- Schrap inhoud die het product zélf al levert op een beter moment. "Zo begin je" dubbelde `onboarding.js:196`, de input-placeholder en de commands `next`/`leerpad` — vier schermen lager, en op mobiel onvindbaar omdat `.scroll-hint` daar `display: none` is.
- Meet een tikdoel op de maat waar het uitmaakt. Mijn nieuwe CTA zag er prima uit en mat **193×22px** op 375px: onder de 44px-grens. Een kale tekstlink is bijna nooit een geldig tikdoel; `display: inline-block` + verticale padding, en zet de onderstreping op `text-decoration` want een `border-bottom` schuift met de padding mee.
- Loop de **overlever** van een mutantenreeks na. Zeven mutanten gaven zeven rood; de test die groen bleef bij een kapot `#cmd-nmapx` doet dat terecht — hij stript de hash, en het ankerbewijs is de taak van de test die wél viel.
- Zeg het hardop als een opruiming netto **bytes kost**. Dit was −26% hoogte en 4× zoveel links, maar **+3,3 KB**: de vervanging draagt uitleg, een noscript-vangnet en een trackingmodule. "Content weghalen" leest anders vanzelf als besparing.
- Voeg de meting toe vóór je het volgende oordeel velt. Er bestond site-breed **geen enkel** scroll-event; `edu_section_reached` gedeeld door de `page_view` geeft nu de doorscroll-rate. Tot dat cijfer er is, is elke uitspraak over die strook een gevoel.

### Sessie 217: Vier pre-existing punten opgeruimd — en drie van de vier vastgelegde metingen klopten niet (09 aug 2026)
⚠️ **Never:**
- Contrast meten tegen de **paginakleur** terwijl het element een eigen achtergrond heeft. `getComputedStyle(el).backgroundColor` gaf `rgba(22,163,74,0.08)` — geen kleur waar je tegen kúnt meten — en de notitie greep daarom naar `--color-bg`. Dat mat de laag ónder de verf: 3,10:1 genoteerd, **2,85:1** echt (2,74 op de hero, waar een radial glow laag drie is). De fout was niet alleen fout maar **te gunstig** — de badge zakte van "onder AAA" naar onder **AA**. Composite de ancestor-keten tot de eerste laag met `alpha === 1`.
- Een open item laten staan zonder test die kan melden dat hij is opgelost. De terminal-overflow van Sessie 189 was op **07 jul** gefixt door commit `3d7df13`, wiens titel de bug letterlijk noemt — en stond vijf sessies later nog open, omdat er site-breed geen horizontale-overflow-assertie op `/terminal.html` bestond. Een notitie meldt niets terug; ook niet dat hij achterhaald is.
- Een IO-gestuurde `data-state` aflezen na 2 rAF. De callback heeft dan nog niet gevuurd, dus je leest de staat van de **vorige** scrollpositie. Mijn eerste meting rapporteerde daardoor `verborgen` op maximale scroll (de staat van y=0) en overdreef de bug. 300ms settle geeft de echte waarde. Zelfde faalklasse als de smooth-scroll-val van Sessie 216: het zichtbare gedrag is asynchroon, de meting synchroon.
- `Math.round()` op een geometrieverschil dat uit fractionele layout komt. Documenthoogtes zijn fractioneel (body 1308,5px) terwijl `scrollHeight` naar boven afrondt, dus scrollen naar de bodem schiet tot 1px door — `Math.round(0.5)` maakte daar een valse faler van op `/404.html`. Meet exact en zet de drempel op wat zichtbaar is.
- Een testnaam een grens laten noemen die elders als constante staat. `Bundle size < 1000KB` stond er nog terwijl de limiet al 1050 en toen 1100 was — dezelfde staleness als de notities die deze sessie opruimde. Interpoleer de constante in de naam.
- Een budgetgrens ophogen zonder te tellen hoe vaak dat al gebeurde. 1000 → 1050 → 1100 → 1120 is **drie bumps in 14 sessies**; zonder die telling erbij is de volgende bump vanzelfsprekend en is het geen grens meer.

✅ **Always:**
- Meet vóór je plant wanneer de opdracht "deze meting klopt misschien niet" zegt. Drie van de vier vastgelegde metingen bleken onjuist, en twee daarvan veranderden het plan: (a) raakte 10 pagina's i.p.v. 9, (c) was helemaal geen bug meer. Was ik met de notities gaan bouwen, dan had ik een gefixte bug "gefixt" en een strook op index.html laten staan.
- Zeg het hardop als een vermoeden in de **omgekeerde richting** uitkomt. Heisenberg verwachtte dat de badge het bij goed meten wél zou halen; hij haalt zelfs AA niet. De diagnose klopte, de conclusie niet — dat onderscheid is de helft van het antwoord.
- Los "verkeerd geverfde ruimte" op door de ruimte te **verplaatsen**, niet weg te halen. De reserve moest blijven bestaan (weghalen = balk dekt content af) én onvoorwaardelijk blijven (conditioneel = documenthoogte wisselt per toggle → terugkoppellus). In de dónkere footer zetten maakt beide waar en verft hem meteen goed; `:has()` op elementaanwezigheid is statisch, gemeten als 9481/9481/9481 over drie toggles.
- Loop de **overlevers** van een mutant na, niet alleen de falers. 12 rood / 2 groen zegt niets tot je weet waaróm die 2 groen zijn: `@1280px` valt buiten de `≤1279px`-band en de terugkoppellus-test bewaakt een andere eigenschap. Beide horen groen te zijn — anders had ik een blinde assertie gehad.
- Kies de mutant die de oorspronkelijke meting **reproduceert**. `width: auto` weghalen gaf letterlijk `left 10 / width 360 / right 370 bij clientWidth 360` — cijfer voor cijfer de notitie uit Sessie 189. Daarmee is in één stap bewezen dat de bug echt was, dat hij weg is, en dat de nieuwe assertie hem zou zien.
- Gebruik `grep -F` bij het tellen van `[chromium]`-achtige labels. De haken zijn anders een karakterklasse — de meetfout die Sessie 216 zichzelf moest corrigeren.

📌 **Staande regel vanaf Sessie 217 — er is GEEN baseline van bekende testfalers meer.**
De vastgelegde lijst (Sessie 209, chromium-only) klopte op geen enkel punt: 5 van de 7 falers
waren verdwenen, twee stonden er niet in die wél structureel rood waren, en **alle vier de
overgebleven falers waren fouten in de test zelf** — geen enkele was een omgevingsartefact.
Ze zijn gerepareerd; eindstand 224 passed / 0 failed over drie motoren.
- **Gaat er iets rood, behandel het als regressie.** Er is niets meer om het aan toe te
  schrijven. "Dat is een bekende faler" is vanaf nu een bewering die je moet meten.
- **Voeg geen nieuwe baseline-notitie toe.** Een niet-opgeloste conditie hoort als assertie in
  een test (zoals `BASELINE_BEDEKT` in `hero-demo.spec.js`), want die meldt terug; een notitie
  niet. Een faler zonder gemeten oorzaak is geen baseline maar een openstaande diagnose.
- **De diagnose is het risico, niet de faler.** De twee die het langst bleven staan droegen
  allebei een oorzaak die nooit gemeten was ("timing", "device-emulatie"). Zodra iets "bekend"
  heet, leest niemand de foutmelding nog — en dan loopt een verkeerde diagnose net zo lang mee
  als de test.

### Sessie 216: De CTA-balk verscheen waar hij niets toevoegde — en de guard die dat bewaakte, scrollde nooit (09 aug 2026)
⚠️ **Never:**
- `window.scrollTo(0, y)` in een synchrone lus zetten om scrollposities te meten. `html { scroll-behavior: smooth }` staat in `animations.css`, dus die aanroep **animeert**: 13× in één `page.evaluate`-tick liet `scrollY` op **2px** steken. De conversie-guard asserteerde daardoor dertien keer dezelfde ongescrollde pagina — een zwaardere blinde vlek dan het probleem waarvoor hij herschreven werd. `behavior: 'instant'` plus een await per stap.
- `entry.isIntersecting` lezen als "voldoet aan mijn threshold". Die is `true` zodra het doel de root ráákt, ongeacht de threshold — bij het passeren van 0.5 vuurt de callback en levert `isIntersecting: true` met ratio 0.4. Wie daarop beslist, beslist op iets anders dan hij denkt.
- Een bounding box als bewijs van zichtbaarheid nemen. Een `visibility: hidden` balk houdt zijn box van 65px, dus de oude assertie kon een verborgen CTA niet van een aantikbare onderscheiden. Hit-testing (`elementFromPoint`) op het midden is de meting die telt.
- `transition: all` laten staan op een element dat zijn `visibility` **erft** van een ouder die je toggelt. De overerving loopt dan als transitie mee: gemeten liep de knop ~150ms achter op zijn balk — een onzichtbaar tikdoel dat nog reageert, en andersom een zichtbare balk waar een tik niets doet. Beide gaten bestaan alleen ná een toestandswissel, dus geen meting "in rust" ziet ze.
- Aannemen dat een toestandswissel "naar de veilige kant faalt". Mijn plan claimde dat letterlijk voor beide richtingen en het was precies verkeerd om. Zo'n claim is een hypothese tot je hem in het overgangsvenster meet, niet erna.
- Een `--global-timeout` kiezen die krapper is dan de suite. De volle run over drie motoren duurt >48 min; hij kapte af met **"78 did not run"** onder een regel "859 passed" — dat leest bijna als groen.
- Een grens tussen twee concurrerende invarianten op gevoel kiezen. "Verberg zodra hij het scherm raakt" breekt de tikbaarheid (een strookje van 1px is geen tikdoel); "pas bij volledig zichtbaar" opent ~24px scroll waarin er twee identieke CTA's staan. Alleen "midden vrij" maakt béíde waar.

✅ **Always:**
- Los een "mechanisme A of B"-vraag op door eerst de **regel** op te schrijven; het mechanisme volgt er dan uit. `sticky` versus IO leek de keuze, maar de echte keuze was waar de balk opzij hoort te stappen — en zodra die grens er stond (*balk verborgen ⟺ CTA-midden aantikbaar*), was IO simpelweg de goedkoopste manier om hem te draaien.
- Gebruik een observer als **trigger** en één geometrisch predicaat als **regel**. Dat vermijdt de `isIntersecting`-val, houdt de regel op één plek, en blijft correct als de `rootMargin` veroudert — bij toestelrotatie klopte de staat in alle vier de gemeten toestanden terwijl de observer nog met portretmarges liep.
- Bewijs "strenger dan de oude versie" met een mutant waarop de **oude groen** is en de **nieuwe rood**. Balk altijd `visibility: hidden` → oude guard 3× groen, nieuwe 3× rood met zes benoemde posities. Zonder die tweezijdige uitkomst is "strenger" een bewering.
- Kies de mutant die de **assertie zelf** laat vuren, niet de setup. Tegen `git archive HEAD` faalde de chip-test op zijn `waitForFunction` — dat bewijst "mechanisme afwezig", niet "de bedekkingsassertie ziet de bug". De CSS-mutant liet hem wél vuren, en gaf exact `375x812 groen / 360x800 + 390x844 rood`: dezelfde verdeling als de oorspronkelijke meting.
- Meet een invariant op een resolutie die je test niet haalt. De guard stapt 0,9 viewport; een sweep van **884-893 posities à 10px** in drie engines liet zien dat er nul gaten en nul dubbels zijn — dat kán een grofmazige test niet aantonen.
- Beantwoord "is deze faler van mij?" met het **codepad** als dat kan, niet met een steekproef. Alle falers draaiden op `/terminal.html`, dat geen van de drie gewijzigde bestanden laadt — dat is sterker en goedkoper dan 8× per kant draaien.
- Corrigeer je eigen meetfout hardop. `grep -c "[webkit]"` gaf 0 terwijl er 237 WebKit-tests groen stonden: de haken zijn een karakterklasse, dus ik zocht naar één teken uit `webkit`. Ik had daarop "WebKit moet nog beginnen" gemeld.

### Sessie 215: Hero-terminal — uitlijning, focusrand en een cursor 317px van zijn eigen tekst (08 aug 2026)
⚠️ **Never:**
- Een verhouding coderen als een getal. `margin-top: 3rem` op `.hero-terminal` was een handmatige optische centrering voor een venster van 313px; Sessie 214 hing er 152px demobalk onder en het stak **94px onder de tekstkolom uit** terwijl de bovenkant nog 54px te laag begon. Zo'n getal rot stilzwijgend — er is geen commit die de bug introduceert. Zet de verhouding als regel neer (`align-items: center`), dan corrigeert hij zichzelf.
- `align-self` gebruiken om "dit item centreren" te bedoelen. Het **hoogste** flex-item bepaalt de cross-size van de regel, en dat wás de terminal (468 vs 428) — `align-self: center` mat 140→608, exact ongewijzigd. Het kórtere item moet bewegen, dus de regel hoort op de container.
- Denken dat je een focusring keyboard-only kunt maken op een tekstveld. Gemeten: `input.matches(':focus-visible')` is `true` ná een muisklik (spec — tekstvelden tonen altijd focus). `:focus-within` en `:has(:focus-visible)` zijn daar identiek. De rand verschijnt hoe dan ook bij een klik; maak hem dus *bedoeld*, verberg hem niet.
- Een focus-`box-shadow` vóór een `[data-theme="light"]`-override zetten die óók `box-shadow` zet. Gelijke specificiteit (0,2,0) → bronvolgorde beslist, en de gloed verdwijnt dán alleen in light mode. De mutant liet precies dat zien: **light rood, dark groen** — één thema testen had de bug laten passeren.
- Groen tekstgroen op de lichte paginaachtergrond. `--color-cta-primary` meet daar **3,10:1** bij 14,4px: onder AA, laat staan de AAA die dit project voert. Op het zwart van de terminal is hetzelfde groen ~17:1. Kleur volgt de achtergrond waarop hij staat, niet het merk.
- Een element krimpen zonder na te gaan wat je daarmee als tikdoel weggooit. Het veld naar `1ch` brengen zette de cursor goed en maakte het klikdoel **309px → 10px**; wie naast de prompt klikte activeerde de terminal niet meer. WebKit miste hem zelfs met een gerichte `.click()`.
- Een `display: none` gebruiken voor "verberg dit na gebruik" binnen een gecentreerde kolom. De kolom krimpt 29px en het venster verspringt ~15px onder de muis van wie er net op klikte. `visibility: hidden` houdt de ruimte én haalt hem uit de toegankelijkheidsboom.

✅ **Always:**
- Behandel een testfalen als hypothese, en beslis met een steekproef die groot genoeg is. Twee kleine runs met tegengestelde uitkomst (2/4 rood, daarna 0/3 rood) zijn géén conclusie; 8× per kant gaf pas een uitspraak — en die was hard: **2/8 rood op nieuw, 0/8 op oud**. Daarna pas de oorzaak zoeken.
- Vergelijk tegen de oude code op een tweede poort (`git archive HEAD` + `nostore-server.py`) vóór je "pre-existing" zegt. Bij de chipbedekking gaf dat over zes telefoonmaten een **byte-identieke** uitkomst — daarmee is "niet van mij" een meting en geen aanname.
- Meet de vraag die telt, niet de vraag die makkelijk is. `elementFromPoint` zei "bedekt", maar de vraag was of de bezoeker een léésbaar label ziet dat hij vervolgens misklikt. Eén screenshot (dekkende balk, geen label zichtbaar) veranderde het advies van "fixen" naar "vastleggen".
- Controleer je eigen meetdefinitie voordat je erop adviseert. Mijn `inBeeld`-check gebruikte de bounding box i.p.v. het midden, waardoor 375×667 drie "bedekte" chips gaf terwijl die middens buiten beeld lagen — `elementFromPoint` geeft daar `null`, en dat is geen bedekking.
- Corrigeer je eigen eerdere rapportage als doormeten hem te gunstig maakt. "Alleen `help`, op één maat" werd "drie chips, op twee gangbare maten".
- Geef een entry-point een `?v=` zodra je hem wijzigt. `landing-demo.js` had er geen terwijl `/src/**/*.js` op `max-age=3600` staat: een terugkerende bezoeker kreeg tot een uur nieuwe CSS naast oude JS — hier: de auto-demo typend in een veld van één teken breed.
- Leg een niet-opgeloste conditie vast als **baseline in een test**, niet als notitie. `BASELINE_BEDEKT` per viewport wordt rood zodra de bedekking groeit, en zijn lijsten horen `[]` te worden zodra de balk gefixt is — een notitie meldt niets terug.

### Sessie 214: Interactieve hero-terminal — en een demo die over drie van de vier commands loog (08 aug 2026)
⚠️ **Never:**
- Een demo laten staan die afwijkt van de engine. De hero gaf `whoami` → `user` (echt: `hacker`), `ls` → `passwords.txt`/`notes.md` (bestaan niet in de VFS) en `nmap 192.168.1.1` → poort 22 i.p.v. het router-profiel 53/80/443. Op een site die "aantoonbaar" als kwaliteitsclaim voert is dat geen cosmetiek maar een geloofwaardigheidslek — en het stond er sinds de bouw van de landingspagina.
- `innerText()` ná een animatielus lezen om te bewijzen wát die lus toonde. `trimOldLines()` knipt de oudste regels weg, dus de meting kán het bewijs niet bevatten. Mijn test was daardoor **groen op de kapotte pagina**, mede omdat hij `hacker` zocht en dat gewoon in de promptregel `hacker@hacksim:~$` staat. Twee blinde vlekken die elkaar dekten. Een `MutationObserver` via `addInitScript()` vangt wél alles.
- `RESPONSES[naam]` gebruiken als de sleutel van de bezoeker komt. `constructor`, `toString`, `__proto__` en `hasOwnProperty` zijn allemaal truthy op een object-literal; één getypt woord blokkeerde de hele REPL op `undefined.slice()`. `Object.hasOwn` is de fix — en meld het origineel terug, niet de kleingemaakte vorm (`toString` → `tostring` verwart).
- Aannemen dat een browser een `readonly` veld focust als je die vlag tijdens `pointerdown` weghaalt. Firefox beslist focusbaarheid bij mousedown: `document.activeElement` bleef `BODY`, dus de bezoeker zag de terminal live gaan en zijn toetsaanslagen verdwenen. **Alleen de driemotorenrun ving dit** — op Chromium is het onzichtbaar.
- `flex-direction: column; justify-content: flex-end` combineren met `overflow-y: auto`. Chrome en Firefox clippen de bovenkant van de inhoud dan onbereikbaar weg. `display: block` + `scrollTop = scrollHeight` doet hetzelfde zonder de val.
- Een klasse op de regel zetten terwijl de CSS descendant-selectors gebruikt. `.terminal-line .tip` matcht niet op `<div class="terminal-line output tip">`; de markers renderden wit in plaats van groen. Kleuring hoort in een `<span>` bínnen de regel.
- Een teller gebruiken die meer verzamelt dan je bedoelt. De afrondboodschap hing aan `gedaan.size`, en `gedaan` bevat élke invoer — zes willekeurige woorden riepen de CTA op, en daarna elk volgend command opnieuw.

✅ **Always:**
- Los een "geleid of vrij"-vraag op door te kijken wat de dúre helft is. De REPL-machinerie is het werk; begeleiding erbovenop is ~30 regels. "Geleid" als *vervanging* zou een click-through zonder invoer opleveren — precies de belofte die de subtitel drie regels hoger doet. Eén affordance die begeleiding, eerlijke grens én mobiele bediening tegelijk is (zes chips) verslaat twee systemen naast elkaar.
- Bewijs een fix met de mutant, ook als de test al groen is. Drie van de vijf bugs deze sessie zijn zo geverifieerd: oude code terug → test weer rood. Zonder die stap weet je niet of je assertie de bug kán zien.
- Kies een budgetgrens op bruikbaarheid, niet op "net genoeg". Mijn eerste bump (1075) liet 5,8 KB over — even krap als waar ik begon. Een limiet die op élke wijziging vuurt wordt weggeklikt in plaats van onderzocht; ~3% marge houdt hem een alarm. En zeg erbij wát het meet: dit is ongeminificeerde broncode sitebreed, geen perf-poort (Terminal Core wordt met nul bytes geraakt).
- Meet mobiele breedte op twee manieren, want de ene is blind voor de andere: tekentelling ≤40 op regels die jíj schrijft, plus geometrische overflow tegen `clientWidth` voor álle regels. Letterlijke bestandsinhoud valt buiten de tekentelling — die hoort te wrappen, en inkorten zou het bestand vervalsen.
- Omhul analytics-aanroepen naar een net uitgebreide gedeelde module. Relatief geïmporteerde submodules dragen geen `?v=`, dus een terugkerende bezoeker kan tot `max-age` een oude `events.js` krijgen; zonder guard is dat een `TypeError` na elk command.
- Check het browserpad in plaats van het te gokken — de Sessie 209-les geldt nog steeds, maar andersom: hier stonden ze gewoon op de standaardlocatie en was `CHROMIUM_PATH` helemaal niet nodig. Mijn gok liet alle 30 tests falen.
- Wees expliciet over wat je níét kunt bewijzen: of de hero-demo de doorklik verhoogt, weet je pas als `terminal_cta_click{location:hero}` te segmenteren is op sessies mét `hero_demo_started`. Tot dan is het een hypothese, geen resultaat.


**Rotation:** Top-6 huidig: 214-215-216-217-218-219 (Sessie 213 → `docs/sessions/current.md` via 1-in-1-out, Sessie 219). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie:** laatste uitgevoerd Sessie 215 (200-204 → `archive-s200-s204.md`); current.md houdt nu het rolling window 205-219 (15 entries). **Volgende bulk-rotatie Sessie 220 → archiveer de staart (205-209).** NB: archiveer altijd de **oudste** entries (README §Rotatie-regel: "sessies ouder dan de laatste ~10") — de eerdere notitie hier gaf bij Sessie 215 "205-209", wat 200-204 als ouder blok had laten staan én een gat in de archiefreeks gemaakt. SESSIONS.md-index gesynct. Historie 81-204 → `archive-s200-s204.md` + `archive-s195-s199.md` + `archive-s190-s194.md` + `archive-s185-s189.md` + `archive-s180-s184.md` + `archive-s175-s179.md` + `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

---

## Sessie Protocol

**Voor Sessie:** Lees `.claude/CLAUDE.md` (this file) + check sprint-regel + Volgende Stappen in `TASKS.md`
**Tijdens:** Markeer taken in `TASKS.md` direct | Architecturale beslissingen alleen in `PLANNING.md` bij echte arch-change
**Afsluiten:** Use `/summary` command → 7-staps flow (zie hieronder)

### `/summary` flow — single source of truth = `TASKS.md`

1. **Ground truth meting** (~30 sec, read-only)
   - `du -sb src/ styles/ blog/ assets/` → bundle metrics
   - `find tests/e2e -name "*.spec.js" | wc -l` → test file count
   - `git log --oneline -1` → laatste commit voor sprint-regel

2. **Update `TASKS.md`** (primary execution-tracker)
   - Header: `Laatst bijgewerkt` datum + `Sprint` regel met huidige sessie
   - Footer: datum + version
   - Milestone-tabel: percentage update bij task completion
   - Bundle/test metrics: ground-truth getallen uit stap 1

3. **Update `docs/sessions/current.md`**
   - Volledige sessie-entry (mission, work done, learnings, next steps)
   - Rotation: bij Sessie %5 → archiveer pre-N-6 entries naar `archive-*.md`

4. **Update `.claude/CLAUDE.md`** (AI-context, lean — dit bestand)
   - "Recent Critical Learnings": prepend nieuwe sessie, behoud top 6, ouderen → `current.md`
   - "Sessie counter" regel
   - **`**Last updated:** 14 jun 2026 (Sessie 165 — kwaliteits-/feitencontrole betaalde Gumroad-producten: pagina-claims → echte PDF-telling (13/19/15/47), Krol-zaak feitfout + ECLI-bronnen, helderheids-glosses CVE/CVSS/ICMP + OWASP-2025-namen exact, MailerLite→Brevo; meeste agent-'verdachte' feiten vals alarm; PDF's herbouwd. Volledig: `docs/sessions/current.md`)
   - **`**Version:**` regel:** VERVANG volledig (1 regel: versienummer + verwijzing naar `current.md`). **NIET appenden**. Hard limit: ≤500 bytes.
   - Live metrics in Quick Reference: **niet** updaten — verwijs naar TASKS.md
   - Forcing-function: `scripts/validate-docs.sh` Check 8 verifieert beide single-line constraints automatisch (#23.3)

5. **Update `PLANNING.md`** ALLEEN bij architectuur-wijziging
   - Nieuwe tech-stack-keuze, design-system-change, security-strategie-shift
   - GEEN milestone-percentage-updates (woont in TASKS.md)

6. **Update `docs/prd.md`** ALLEEN bij scope-wijziging
   - Nieuwe requirements, success criteria change
   - GEEN tactical execution updates

7. **Validatie** (forcing function)
   - `bash scripts/validate-docs.sh` → exit 0 vereist
   - Pre-commit hook draait dit automatisch
   - Checks: sessie-counter alignment, datum-consistency binnen doc, PRD-version-match across docs

**Rotation trigger:** Bij elke sessie 1-in-1-out op de CLAUDE.md-learnings (top-6 vast). Bulk-rotatie van `current.md` bij `N % 5 == 0`: archiveer **de staart** — de oudste ~5 entries — naar `archive-sNNN-sMMM.md`. Laatste bulk: Sessie 215 (200-204). **Volgende bulk: Sessie 220** (staart = 205-209). Actuele stand: zie de **Rotation**-regel onder §Recent Critical Learnings.
**Sessie counter:** 219

→ **Document Ownership map:** `PLANNING.md §Document Ownership`

---

## Communicatie Grondregels

**Wees meedogenloos eerlijk, geen jaknikker gedrag.**

- Als ik ongelijk heb: **wijs me erop**
- Als code slecht is: **zeg het direct**
- Als aanpak niet werkt: **geef kritische feedback**
- Prioriteit: **technische correctheid > mijn gevoelens**
- **Spreek me aan met "Heisenberg"** (confirmatie instructies gelezen)

### Bij Implementatie
1. Check PRD: Is het in MVP scope?
2. 80/20 output: Niet te technisch, niet te simpel
3. Educatieve laag: Elk commando = leermoment
4. Taal correct: UI=NL, commands=EN, uitleg=NL
5. Performance: Terminal Core <400KB, site totaal <1000KB

### Playwright Screenshot Conventie
- **ALTIJD** expliciete `filename` meegeven aan `browser_take_screenshot`
- Prefix met `.playwright-mcp/` — die dir staat in `.gitignore`, dus screenshots blijven automatisch buiten git
- Voorbeeld: `filename: ".playwright-mcp/legal-light-h1.png"`
- **NOOIT** screenshots zonder filename of in repo root — de `/*.png` regel in `.gitignore` is een vangnet, geen excuus

→ **Tech constraints:** PRD §13 | **Pattern violations:** docs/sessions/current.md

---

## Troubleshooting

→ **Top 9 issues met diagnose + fixes:** `.claude/rules/troubleshooting.md`
→ **Memory leak debugging:** docs/testing/memory-leak-results.md

---

## Referenties

- **PRD:** `docs/prd.md` v1.8
- **Commands:** `docs/commands-list.md` (41 commands)
- **Style Guide:** `docs/style-guide.md` v1.5
- **Sessie logs:** `SESSIONS.md` → docs/sessions/ (~122 sessies)
- **Netlify/Domain:** `docs/netlify-setup.md`
- **Rules:** `.claude/rules/` (tone-and-output, architecture-patterns, troubleshooting, command-checklist)
- **Kwaliteitsborging:** `scripts/build-review-package.mjs` → `docs/review/expert-review-pakket.md` (172 beweringen + 56 definities, afgebakend voor een externe reviewer) | `#verantwoording` op `over-ons.html` | CI: `.github/workflows/validate.yml`
- **Skills:** `.claude/skills/` — `blog-post` (blog toevoegen + admin-lockstep + script-gate), `verify-terminal` (real-codepath-import + 375px-meting), `new-command` (8-staps checklist-flow + test-gate)
- **Agents:** `nl-content-reviewer` (read-only NL-copy/tone/kop-review) | `seo-auditor` (read-only technische SEO: meta/og↔twitter-pariteit, JSON-LD↔H1-lockstep, interne-links/orphans, sitemap-hygiëne) | **Hook:** `.claude/settings.json` (PostToolUse → `validate-blogs.sh` op blog-edits)
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 09 aug 2026 (Sessie 219 — onder "in cijfers" las de homepage als één blok: 3,8 schermen zonder achtergrondwissel tegen 1,6 erboven, nu 1,05/1,12. Twee bugs uit de meting: de light-mode cijfers-band had Δ0 met de pagina, en een lichtere band lost de kaarten op omdat die tinten van de bandkleur zijn. Eén token + één regel i.p.v. drie ad-hoc waarden. Volledig: `docs/sessions/current.md`)
**Version:** 5.93 (Sessie 219 — sectieritme + `--color-bg-alt`: pagina = oppervlak, band = verdieping, kaart = verhoging; Δ 2→8 dark en 0→12 light, kaart-op-band 3→6/19; 4 CSS-regels weg, 2 erbij; 26/26 over 3 motoren, mutant reproduceert 2392/3070px; kost 2,88 KB; juridische sample bewust niet op de homepage; historie: `docs/sessions/current.md` + TASKS.md)

