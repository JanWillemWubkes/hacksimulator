# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 217)
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


### Sessie 213: Gidsen-grid, CTA-uitlijning en een navbar die site-breed 500px te breed was (07 aug 2026)
⚠️ **Never:**
- `flex: 1` op een type-selector zetten. `.gids-card p { flex: 1 }` selecteerde óók `p.gids-sample-link`, dus twee flex-items met `flex-basis: 0` deelden de rek (gemeten: 82px + 66px = precies de 164px van een kaart-zonder-sample min de extra marge). Twee vervolgeffecten die als los raadsel oogden: `margin-top: auto` op de knop werd een no-op (flex-grow verdeelt vóór auto-marges) en de eigen marge van de sample-link landde nooit ((0,1,1) verslaat (0,1,0)). **Zulke bugs vind je niet door de CSS te lezen — alleen `getComputedStyle` verraadt een `flex-grow` die je nooit hebt gezet.**
- Denken dat een media query specificiteit toevoegt. Hij telt voor nul, dus bij gelijke selectoren wint puur de laadvolgorde. `.features-4col` in pages.css versloeg daardoor `@media (max-width: 1024px)` in landing.css, en mijn eigen 2-koloms-regel deed hetzelfde met de mobiele 1fr-regel: 6px overflow en kaarten van 173px op 375px. Gebruik wederzijds uitsluitende ranges (`≤768` naast `≥769`) — die hebben helemaal geen winnaar nodig.
- `scrollWidth <= clientWidth` lezen als "het past". Wrappen is geen overflow: mijn eerste navbar-grens (1179px) werd door mijn eigen test goedgekeurd terwijl de screenshot twee afgebroken labels toonde. Zet een aparte wrap-assertie naast de overflow-check, want de ene maat is structureel blind voor de andere.
- `getClientRects().length` gebruiken om wrap te detecteren in een flexbox. Flex-children zijn geblokkeerd, dus tekst over twee regels levert nog steeds één rect op. Meet op hoogte tegen `line-height`.
- Een `color` meenemen in een layout-override met een ID in de selector. `#landing-mobile-menu .navbar-links a` is (1,1,1) en versloeg daarmee élke kleurregel in main.css — inclusief mijn eigen CTA-fix. Symptoom: `font-weight` kwam wél door en de kleur niet.
- `checkVisibility()` vertrouwen bij visually-hidden-patronen. Die API kijkt naar `display`/`visibility`/`opacity` en negeert `clip-path` en `overflow` — hij gaf `true` op een `<th>` die aantoonbaar weggeknipt was. Hit-testing (`elementFromPoint`) is daar de betrouwbare meting.

✅ **Always:**
- Los een uitlijningsklacht structureel op, niet met een afstelling. Eén groeier (`.gids-card-body`) zet prijs, knop en bloglinks op vaste afstand van de kaartbodem, dus de invariant **kaartbodem − CTA-bodem = 186px** geldt voor alle vier de kaarten — ongeacht welke een sample draagt. Een `margin-top: auto`-fix was gebroken zodra iemand een derde sample toevoegde.
- Zoek een breakpoint binair op in plaats van hem te schatten, en meet in élke engine. Vanaf 1147px liep er niets meer buiten de balk, maar pas vanaf 1264px (1266 in WebKit) brak er ook niets meer af. De strengste meting wint, plus marge: band tot 1279px zodat de desktopnav vanaf de gangbare 1280px verschijnt.
- Bewijs met de oude code dat een gevonden overflow niet van jou is. Productie gaf exact dezelfde 341px en dezelfde 917px `nav-right` — daarmee was in één meting duidelijk dat het pre-existing was en hoe groot de blast radius was (élke marketingpagina + alle blogposts).
- Verklein een regel met een selector-token in plaats van een uitzondering toe te voegen. `:nth-child(3)` → `:nth-child(3):last-child` drukt uit wat de regel altijd al bedoelde en fixte twee pagina's tegelijk; elk aangeraakt grid geteld (5× drie kinderen, 2× vier) om nul gedragswijziging te bewijzen waar het wél klopte.
- Neem bij het verbreden van een media-band de **gemeten effectieve stijlen** van de directe buur over, niet de bron-CSS. Die bron wordt daar deels overruled, dus overtikken levert iets anders op dan wat er staat. Visueel vergeleken op 700px en 1000px: identiek.
- Behandel flaky tests als een meetfout tot het tegendeel blijkt. Vier "browserverschillen" waren allemaal `page.goto`-timeouts met nul assertiefouten; oorzaak was `TCPServer` in `scripts/nostore-server.py` die één request tegelijk afhandelt terwijl drie browsers parallel laden. `ThreadingTCPServer` haalde de hele faalklasse weg.
- Leg vast wat géén bug is, mét de meting. De `<th>` uit `.blog-table--stacked` is het complete visually-hidden-patroon (absoluut, 1×1px, `clip-path`), uit de flow, geen scroll, niets raakbaar — "oplossen" zou `display: none` betekenen en schermlezers de kolomkoppen kosten.

### Sessie 212: Lead magnets — verkeerde bestandsnaam en verkeerde welkomstmail (07 aug 2026)
⚠️ **Never:**
- Een `_headers`-wildcard een vaste `filename` laten dragen. `/assets/samples/*` met `filename="pentest-playbook-sample.pdf"` was correct toen de map één sample had, en werd stilzwijgend fout toen de juridische erbij kwam — zonder commit die de bug introduceert. Live bewijs: de juridische URL leverde 83.672 bytes (de júíste PDF) onder de pentest-naam. Geen 404, geen foutmelding, alleen een naam die loog.
- Twee lead magnets op één Brevo-formulier laten posten terwijl de automation op een *Form submitted*-trigger draait — Brevo **kán** de instromen dan niet scheiden en tags zijn er geen automation-criterium. Eén formulier per lead magnet, één automation per formulier.
- Een absolute regel maken van een eigen notitie die een voorwaarde draagt. "Plus-alias anti-evasion" gold alléén voor adressen die al op de blocklist staan, én alleen op het transactional-kanaal — een kanaalonderscheid dat ik in dezelfde boodschap zélf uitlegde. Ik adviseerde "geen plus-alias"; Heisenberg testte er gewoon mee en het werkte.
- Twee keer achter elkaar met te veel zekerheid over hetzelfde punt praten. Ik claimde Brevo's Messages-gedrag zonder meting, corrigeerde daarna te ver op basis van alleen de goedkoop testbare foutpaden, en zat beide keren mis. Het pad dat telde (gelukte inzending) was juist het pad dat ik niet zelf kon testen.

✅ **Always:**
- Laat een drift-check filesystem-ground-truth eisen, geen lijst. Check 10 verlangt per `assets/samples/*.pdf` een exacte-pad-regel met zijn eigen basename én verbiedt een wildcard met vaste filename — een derde sample telt automatisch mee en kan de bug niet herhalen.
- Codeer een openstaande handmatige stap als een **bewust rode test**, niet als TODO. "Elke sample post naar een ánder Brevo-formulier" faalde tot het Brevo-handwerk klaar was en werd groen op het exacte moment dat het af was. Een regel in een runbook meldt niets terug.
- Vraag het de gebruiker wanneer hij de discriminator in twee seconden kan leveren. Welke tekst het bevestigingspaneel toont, kon alleen een echte inschrijving beantwoorden — en Heisenberg had de flow net doorlopen. De twee kandidaat-teksten liepen na "klaar." uiteen; dat had mijn eerste vraag moeten zijn, niet mijn derde.
- Maak bij een browserverschil **beide kanten** correct in plaats van uit te zoeken wie wint. `download="<naam>.pdf"` én `Content-Disposition: filename` dragen nu dezelfde naam, dus de fix draagt geen browser-specifieke aanname. Zelfde reflex bij Netlify's header-merge: `Cache-Control` in elk exact blok herhaald i.p.v. hopen dat de wildcard-waarde meekomt (ná deploy bevestigd).

**Rotation:** Top-6 huidig: 212-213-214-215-216-217 (Sessie 209 → `docs/sessions/current.md` via 1-in-1-out, Sessie 217). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie:** laatste uitgevoerd Sessie 215 (200-204 → `archive-s200-s204.md`); current.md houdt nu het rolling window 205-217 (13 entries). **Volgende bulk-rotatie Sessie 220 → archiveer de staart (205-209).** NB: archiveer altijd de **oudste** entries (README §Rotatie-regel: "sessies ouder dan de laatste ~10") — de eerdere notitie hier gaf bij Sessie 215 "205-209", wat 200-204 als ouder blok had laten staan én een gat in de archiefreeks gemaakt. SESSIONS.md-index gesynct. Historie 81-204 → `archive-s200-s204.md` + `archive-s195-s199.md` + `archive-s190-s194.md` + `archive-s185-s189.md` + `archive-s180-s184.md` + `archive-s175-s179.md` + `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

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
**Sessie counter:** 217

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

**Last updated:** 09 aug 2026 (Sessie 217 — vier pre-existing punten opgeruimd; drie van de vier vastgelegde metingen klopten niet: de 76px-strook raakt 10 pagina's i.p.v. 9, het badge-contrast is 2,85:1 i.p.v. de genoteerde 3,10:1 (dus onder AA), en de terminal-overflow was al gefixt op 07 jul. Volledig: `docs/sessions/current.md`)
**Version:** 5.91 (Sessie 217 — pre-existing-opruiming: reserve naar de donkere footer, `--eyebrow-text`-token, terminal-overflow-item gesloten met de test die ontbrak, budget expliciet naar 1120 KB; 3 mutanten tweezijdig bewezen incl. de overlevers nagelopen; historie: `docs/sessions/current.md` + TASKS.md)

