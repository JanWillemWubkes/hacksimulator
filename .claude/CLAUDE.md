# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 228)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 14 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125; +2 posts Sessie 160)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E over Chromium/Firefox/WebKit (spec- en test-aantallen: zie TASKS.md §Huidige Focus) | WCAG AAA | 200+ CSS variables (main.css + landing.css; floor-notatie — de exacte telling groeit per sessie en stond hier 182+27 terwijl het er 178+31 waren)
**Bundle:** Runtime <400 KB (strikt, terminal.html) + SEO/content-pijler budgetloos (blog + assets). Site-totaal en exacte KB-breakdown wisselen per sessie — zie TASKS.md §Huidige Focus voor ground truth.
**Monetization stack:** Ko-fi + Brevo newsletter (double opt-in + welkomstmail + deliverability getuned) + Gumroad v1.0 (4 guides + bundel) + 2 lead magnets (Sample Pentest + Sample Juridisch, elk een eigen Brevo-formulier + automation sinds Sessie 212). Eigen consent banner (2 knoppen) met Consent Mode v2. **Geen advertenties** — AdSense verwijderd in Sessie 208 op gemeten kosten/baten. **Per-stack actuele status:** TASKS.md §M5.5 sectie-body.

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

### Sessie 228: Vier CSS-commentaren claimden een contrast dat ze niet haalden — en de sweep die dat had moeten zien, filterde op tokennaam (19 aug 2026)
⚠️ **Never:**
- Een guard schrijven die op een **tokenlijst** filtert en denken dat je een klasse dekt. Drie rondes lang (S226/S227/#72) repareerde elke sessie de vindplaats die toevallig in de lijst stond. Ongefilterd gemeten waren het **152 element-toestanden onder AA en 378 onder AAA over 18 kleurwaarden** — en het zwaarste defect (`--color-footer-link` #c9d1d9 op de witte cookiebanner, **1,54:1**, op élke pagina, in de banner die iedere nieuwe bezoeker als eerste ziet) stond op géén enkele lijst. Een guard die een *lijst* bewaakt, bewaakt geen *klasse*; draai de populatie om naar "alles" en laat de uitzonderingen zich verantwoorden.
- Een sitebrede sweep draaien **zonder te scrollen en in één viewport**. `.leerpad-card` staat op `opacity: 0` tot een IntersectionObserver `.visible` zet, dus de hele `.level-badge`-groep viel buiten de populatie — inclusief de laagste waarde van de site (**1,74:1**). En viewports zijn niet symmetrisch: 115 falers bestaan alléén op mobiel (blog-`<strong>` is op desktop ≥18,66px én bold = LARGE, lat 4,5, en haalt 6,70; op mobiel zakt de font-size en geldt 7,0), 54 alléén op desktop (de toggle zit op mobiel in het dichtgeklapte menu en heeft dan geen rects).
- Alleen **rusttoestanden** meten. `--color-warning`/`--color-info` renderen in light op géén enkele stilstaande pagina — ze zitten in `.terminal-output-warning`/`.tip-box`, die pas ná een commando bestaan (2,60 resp. 4,89). En een `<input>` heeft geen tekstnode, dus `eigenTekst()` ziet de getypte waarde nooit: dáár stond de terminalprompt op **1,96:1**, lime op bijna-wit.
- `getComputedStyle` vertrouwen op een element met `opacity: 0` — het geeft gewoon een kleur terug voor iets dat niemand ziet (54 valse metingen, waaronder een "defect" van 1,00:1). En een themawissel simuleren met alléén `data-theme`: `navbar.js:290` verplaatst óók de `.active`-klasse van de toggle, dus zonder die synchronisatie meet je een combinatie die op de echte site niet bestaat.
- Een `alpha < 1`-tekstkleur meten zonder hem eerst over de achtergrond te **compositen**. `ratio()` negeert alpha, dus `rgba(204,204,204,.4)` leest als #cccccc (10,73) terwijl het gerenderd rgb(97,97,97) is: **2,82:1**, op 27 pagina's in beide thema's.
- Een tokenwaarde **site-breed** optillen voor een lokaal probleem, of zo'n fix themaloos scopen. De edu-zone vroeg #c0c7cf; site-breed doorvoeren wist het onderscheid dim-vs-normaal (#c9d1d9 ís `--color-text-light`). En mijn eerste versie had geen themascope: #c0c7cf landde óók op de lichte panelen = 14 elementen op **1,53:1**, een zwaardere regressie dan het defect.
- Een A/B draaien terwijl je schrijft in de bestanden die de tests laden. De eerste #73-meting gaf 1112 s en 4 falers; dat was mijn eigen CSS-edit, geen eigenschap van de variant. Bevries de werkboom.

✅ **Always:**
- Groepeer contrastbevindingen op **kleurwaarde**, niet op tokennaam. Dezelfde hex zit onder meerdere namen (#a1a8b0 = `--color-text-dim` + `--color-ui-secondary` + `--color-text-muted`), dus per token rapporteren verdeelt één defect over drie regels en verbergt de omvang.
- Behandel een contrastclaim in een **commentaar** als een bewering tot je hem hebt gemeten. Vier logen hier, alle vier geruststellend: `--color-prompt` "4.8:1 (WCAG AA ✅)" → 1,96 · `--color-success` "7.5:1 (WCAG AAA ✅)" → 4,29 · `--color-ui-primary` "3.25:1 on white (WCAG AA)" → 3,25 ís geen AA · en `--color-cta-primary` "op een ACHTERGROND met wit erop is hij prima" → **3,30** op de primaire CTA van 13 pagina's. Die laatste schreef Sessie 227 zelf, bij een verder correcte diagnose van de ándere rol van hetzelfde token: wie één rol doormeet, heeft de andere niet gemeten.
- Laat de **uitsluitingen** van een sweep zelf een assertie zijn, en codeer een uitzondering als assertie mét de gemeten waarde. Niet "let op, niet als tekst gebruiken" maar: nul elementen mogen tekst in dit oppervlak-token renderen. Geef de uitzondering-op-de-uitzondering er één bij — in dark valt `--color-cta-primary` samen met `--color-accent-text` (allebei #9fef00), dus de check slaat daar over, en dát feit is nu geasserteerd in plaats van aangenomen.
- Kies mutanten die op **verschillende asserties** falen, en controleer wélke vuurde — niet alleen hoeveel tests rood werden. M2 (`--color-ui-primary` terug) → alle 30 pagina's via uitsluitend de token-matrix, want dat token rendert in light nergens als tekst. M3 (`.gids-price` terug op het oppervlak-token) → **1 failed / 30 passed** via uitsluitend de oppervlak-assertie, terwijl de contrast-sweep groen blijft omdat 7,07 gewoon AAA haalt. Zonder M3 is die assertie ononderscheidbaar van een die niets doet.
- Bepaal een **testtimeout op een meting**. De 17 webkit-falers waren geen defect maar 24,6 s serieel tegen een limiet van 30 s; 120 s = ~5× gemeten. Een timeout die je op de gemeten waarde plakt, wordt de volgende flaky test.
- Verwijder een guard die niet meer kán falen. `accent-text-contrast.spec.js` tolereerde het CTA-token als tekst mits large text; sinds alle 35 tekstgebruiken weg zijn is die populatie leeg en levert het filter altijd `[]` — groen zonder te meten (#62-klacht). Weg, vervangen door de strengere opvolger (arch-patterns §14).
- Reken de blast radius van je documentatie door tot in de **bundel**. 13,5 KB CSS-commentaar op een marge van 1,5% is geen detail; `styles/` wordt niet geminificeerd. Het verhaal hoort in de spec en in TASKS (die tellen niet mee), de CSS houdt het gemeten cijfer — dat halveerde het tot 8,45 KB.

### Sessie 226: De blog had 418 koppen zonder id en een filter van 26,8px — geen van beide stond in de CSS (18 aug 2026)
⚠️ **Never:**
- `min-height` op een **inline** element zetten en denken dat je een tapdoel hebt vergroot. De zeven categoriefilters waren 26,8px hoog terwijl er geen enkele foute property in de regel stond: een `<a>` is inline en inline boxes negeren hoogte-constraints. Pas `display: inline-flex` erbij maakt de 44px echt. Je vindt dit niet door de CSS te lezen — alleen door de gerenderde box te meten.
- `getComputedStyle` lezen in **dezelfde tick** als een themawissel. `.related-card` draagt `transition: 0.15s`, dus ik mat de startwaarde van een lopende animatie en meldde bijna twee ernstige light-mode-defecten (2,90 en 1,78) die niet bestaan — na 700ms settelen 9,17 en 9,74, allebei AAA. De screenshot was de falsificatie, niet mijn redenering. `accent-text-contrast.spec.js` documenteert deze val al bovenaan; ik liep er alsnog in.
- Specificiteit **optellen**. `[data-theme="light"] .blog-post-content ol a` is (0,2,2) en verslaat `.blog-toc ol li a` (0,1,3): twee klassen winnen van één, ongeacht hoeveel type-selectors erachter staan. Mijn eerste poging (er een `ol` bij zetten) veranderde daarom exact niets. Win met een klasse op de wrapper, niet met `!important` en niet met meer descendants.
- Een **IntersectionObserver** gebruiken voor scroll-spy zolang `html { scroll-behavior: smooth }` aanstaat (dat staat het, in `animations.css`). De observer vuurt tíjdens de animatie op posities die de lezer nooit ziet, en ná afloop kruist er niets meer — de markering blijft dus op een tussenstand staan. Dat gaf een off-by-one die ik eerst aan mijn grenswaarde toeschreef. §12 ("observer als trigger") geldt voor toestandswissels, niet voor een grootheid die continu verandert.
- Een scroll-grens ankeren op de navbar-hoogte terwijl `scroll-padding-top` de kop ergens anders parkeert. 60+8=68 tegen een kop die op 76px landt = structureel de vórige sectie actief. Lees de werkelijke `scrollPaddingTop`.
- Twee losse symptomen als twee bugs behandelen zonder eerst de **cache** uit te sluiten. Een off-by-one scroll-spy én een `<details>` die niet opengaat op desktop hadden één oorzaak: een stale ES-module. `?v=`/`?cb=` bust submodules niet (§3) — verse poort = lege cache. Kostte twee meetrondes.
- Een `**Versie:**`-entry toevoegen door alleen de kopregel te vervangen: mijn `sed`-anker eindigde op `5.99` en plakte de hele body van die entry aan de nieuwe vast. Acht entries werden er zeven zonder foutmelding. Tel de entries ná de bewerking, en houd 1-in-1-out (max 8) aan — de footer-marker moet binnen de laatste 30 regels blijven.

✅ **Always:**
- Meet **afwezigheid** ook. De grootste UX-bevinding was niet iets fouts maar iets dat er niet stond: 0 van 418 koppen had een `id`, in artikelen tot 17.815px hoog. Dat grep je niet; je vindt het door te vragen "wat zou hier moeten zijn?" en het te tellen.
- IJk je rekenmodel eerst op een gemeten waarde vóór je er een nieuwe kleur mee kiest. Mijn luminantieberekening reproduceerde 5,622 en 6,153 waar Playwright 5,62 en 6,15 mat — pas daarna was de voorspelling voor #a1a8b0 (7,88/7,20) te vertrouwen, en die klopte op de honderdste.
- Verdeel een feature over de **goedkoopste laag die elk stuk kan dragen**. Kop-id's statisch (alleen dan bewaakbaar door `validate-blogs.sh`, en de deeplink werkt zonder JS), de TOC runtime (een statische lijst in 15 bestanden zou in lockstep met de koppen moeten blijven). Niet één keuze voor het geheel.
- Controleer of een claim in een **commentaar** ooit gemeten is. `#1976d2` en `#1565c0` droegen allebei "WCAG AAA compliant" en maten 4,60 en 5,75; hun dark-mode tegenhanger `#004494` is wél doorgemeten (7,2) en die twee zijn er "naar analogie" naast gezet. Een geruststellend commentaar is een bewering, geen meting.
- Meet de blast radius van een **site-breed token** buiten het gebied waar je de bug vond. Na de dim-wijziging: 49 dim-tekstelementen op de homepage, 0 onder AAA in beide thema's. En noteer wat je níét oploste — `--color-link` is 5,19:1 in light mode en raakt élke link; dat hoort een eigen taak te zijn, geen bijvangst van een blogopdracht.
- Laat je opdracht-scope de reikwijdte van een fix bepalen, niet de vindplaats. "Over Ons" stond 58× fout, óók in `navbar.js`/`footer.js` — die renderen op élke pagina, dus alleen de blog-noscript-fallback corrigeren had de zichtbare navigatie laten tegenspreken wat eronder stond.

### Sessie 225: De nieuwsbrief was af na vijf redactierondes — en elke ronde legde een defect bloot dat níét in de tekst zat (17-18 aug 2026)
⚠️ **Never:**
- Typografie beoordelen op een Linux-machine zonder eerst `fc-match` te draaien. Mijn x-hoogtemeting gaf voor "Courier New" én "Arial" allebei 8px — verdacht, want Courier heeft een berucht kleine x-hoogte. `fc-match "Courier New"` → **LiberationMono-Regular.ttf**: het font staat er niet en ik mat het substituut. Metrisch compatibel betekent gelijke **breedtes**, niet gelijke x-hoogte (gemeten op 100px: Courier-ontwerp **0,42**, Liberation Mono **0,53**, DejaVu **0,55**). Je keurt anders een weergave goed die geen enkele Apple- of Windows-ontvanger krijgt.
- Een **afstammeling-selector** schrijven waar de klasse óp het element staat. `.mobile-padding td` matcht alleen tds *binnen* de cel met die klasse, niet de cel zelf: `cel.matches('.mobile-padding td') === false`. De mobiele padding-verkleining heeft daardoor **nooit** gewerkt en de regel landde in plaats daarvan op de geneste code-block-cellen, waar hij met (0,1,1) de eigen `.code-block` (0,1,0) versloeg. Kostte 32px tekstbreedte op élke mobiele weergave, jarenlang onopgemerkt.
- Nadruk stapelen. `<strong>` mét kopkleur legt de nadruk al twee keer (gewicht + contrast); een klemtoonteken erbovenop leest niet als nadruk maar als typefout. En `jíj` klopt sowieso niet: het accent hoort op de klinker en bij een digraaf op de eerste twéé letters (`één`, `dáár`) — een `j` kan geen accent aigu dragen.
- Een **toonaanwijzing** als kop gebruiken. `maandelijks-template.md` zei *"Toon: geen harde sell, 'Misschien handig' vibe"* — een beschrijving van hoe het moet vóélen. Juli nam hem letterlijk als kop over, augustus kopieerde juli. Twee edities lang stond er een kop die de lezer vooraf vertelt dat hij het blok kan overslaan.
- Verwijzen naar "die tweede regel" in een blok waar de lezer anders telt dan jij. Het blok had label + 2 regels, dus "die tweede" wees naar de regel die juist **wél** van de site kwam. Bind aan de **inhoud** ("die slotregel — *of alles waarvoor 1 = 1*"), niet aan een positie.
- Een cadans ankeren op de **kalendermaand** als hij een **interval** is. "Eerste dinsdag" dwong na een editie van ~30 juli tot óf 5 dagen gat óf augustus overslaan. En de parenthese "(beste open rates voor B2C NL)" was een onbewezen claim: bij twee verstuurde edities is een dag-van-de-week-effect niet meetbaar.
- `[^<>]{0,50}(a|b|c)[^<]{0,60}` op lange HTML-regels loslaten — twee keer catastrophic backtracking. En `pkill -f "grep -oE"` schiet zijn eigen shell af omdat het patroon in zijn eigen commandoregel staat. Zoek je letterlijke frasen, gebruik dan `grep -F`.

✅ **Always:**
- Vraag je af wélke knop je draait bij "de tekst is klein". Puntgrootte, x-hoogte en regellengte beïnvloeden elkaar; ik greep naar de enige die al in beeld was (17px) en dat kostte +1085px hoogte én duwde de regellengte naar 25 tekens. Heisenbergs vraag "kunnen we niet beter een ander lettertype kiezen?" was de goedkopere hefboom: grotere x-hoogte bij gelijke px = **nul** extra maillengte.
- Kies een fontstack op **waar hij aanwezig is**, niet op reputatie. Courier New staat wél op Windows/macOS/iOS en níét op Android — aanwezig op precies de platforms waar hij het slechtst rendert, dus ~20% grootteverschil binnen dezelfde mailing. Moderne monospace voorop (`JetBrains Mono, Consolas, Menlo, Roboto Mono, …`) legt iedereen op ~0,55.
- Introduceer niets wat de lezer niet kan **herleiden**. Drie feedbackrondes waren dezelfde fout vermomd: de aanvallersinvoer die nergens getoond werd, databasenamen die niet vertaald waren, apostrofs op precieze plekken zonder te zeggen wie ze daar zette. Wie het onderwerp kent leest eroverheen — alleen een lezer die het níét kent merkt het, en die spreek je pas ná verzending.
- Repareer de **oorzaak in het brondocument**, niet alleen het symptoom. Elk van de vijf rondes leverde een regel in `maandelijks-template.md` op (toon-vs-kop, klemtoontekens, invoer náást resultaat, preview moet toevoegen niet parafraseren). Zonder dat neemt september ze allemaal weer over — juli→augustus bewees dat al.
- Attribueer een metriekdelta aan de commit die hem veroorzaakte. Docs claimden 40 specs / 304 declaraties / 1104,61 KB; gemeten 41 / 305 / 1106,46. Alle drie komen uit **`d2d2484`**, een commit die ná de 224-summary viel — mijn vijf commits raakten uitsluitend `docs/newsletter/` en zijn metriek-neutraal.
- Los een venster-guard op met **1-in-1-out** zodra je erin schrijft. De footer-marker van TASKS.md stond op 29 van achteren en Check 2 kijkt in de laatste 30; een 9e `**Versie:**`-entry had hem op 31 gezet. Nieuwe erbij, oudste eruit — precies de remedie die Sessie 224 opschreef.
- Meet de gerenderde weergave die je **niet** hebt. Met `'Nimbus Mono PS'` geforceerd (ratio 0,42, hetzelfde ontwerp als Courier New) bleef alles 0 wraps / 0 overflow — dat is de dichtstbijzijnde benadering van een iOS-ontvanger op een machine zonder Courier New.

### Sessie 224: De dader was 280px breed en 377px lang — de scan keek naar het verkeerde getal (16-17 aug 2026)
⚠️ **Never:**
- Horizontale overflow diagnosticeren met **alleen** een border-box-scan. `getBoundingClientRect().right` en `scrollWidth` zijn **twee metingen op hetzelfde element**: de `<h1>` ís 280px breed en valt netjes binnen beeld, terwijl zijn **inhoud** 377px meet. Sessie 223 concludeerde daaruit "vermoedelijk een pseudo-element of scroll-regio" en die verkeerde oorzaak stond een sessie lang in #67. Scan altijd béíde klassen: `rect.right > clientWidth` (element steekt uit) én `el.scrollWidth > el.clientWidth` (inhoud steekt uit zijn eigen box).
- Aannemen dat een pagina de site-brede mobiele schaal krijgt. De drie legal-pagina's laden **`mobile.css` niet** (alleen `main.css` + `legal.css`), dus `--font-size-base` blijft 18px op ≤768px en de h1 houdt de UA-default `2em` = **36px, ook op 320px**. Er staat nergens een `font-size` op `h1`. Controleer wélke stylesheets een pagina daadwerkelijk laadt voordat je over responsive gedrag redeneert.
- Een fix-kandidaat kiezen op reputatie in plaats van op meting per motor. `hyphens:auto` klinkt als de nette oplossing en is dat ook — **in één van de drie motoren**. Alleen Firefox heeft nl-patronen (breekt op `Gebruiksvoor|waarden`); Chromium en WebKit lieten de 77/78px onveranderd staan. De breukpositie is de discriminator: fill-maximaal (14 tekens) = `overflow-wrap`, lettergreepgrens (12) = hyphenatie.
- Een **schatting** in een plan zetten alsof het een meting is. Ik schreef "≈535px, vraagt 18,8px font"; gemeten is het 502px en **20,1px**. De conclusie hield stand, het getal niet — en een verkeerd getal in een plan wordt in de volgende sessie een feit.
- Een declaratietelling **uitrekenen**. Eén `test()` in een dubbele `for`-lus genereert er hier negen; ik zou +9 hebben genoteerd waar +1 klopt (303 → **304**, niet 312). Vierde bestand met dat patroon. Meet met `grep -rE "^\s*test\("`, tel niet mee met wat je denkt te hebben geschreven.
- Een per-element diagnoselijst ongefilterd laten. Kinderen van een `overflow-x:auto`-container houden hun **onafgekapte rect** (de ≤768px-tabellen gaven vier valse randen per meting), en Firefox geeft `clientWidth: 0` op **inline**-elementen, waardoor `scrollWidth > clientWidth` daar altijd waar is (elke `<strong>` als "158>0"). Ongefilterd staat de assertie permanent rood in één motor en wordt de echte dader uit de lijst geduwd.
- Een symptoombeschrijving overnemen zonder er één screenshot tegenaan te houden. De briefing zei "de bezoeker ziet de pagina zijwaarts schuiven"; `main.css:422` zet `overflow-x:hidden` op `body`, wat **naar de viewport propageert**. `scrollTo` werkt daardoor programmatisch (dát was gemeten) maar pannen niet — de bezoeker ziet een **afgekapte** kop.
- Een guard met een **vast venster** boven inhoud zetten die per sessie **groeit**. Check 2 zoekt de footer-sessiemarker in de laatste 30 regels van TASKS.md, terwijl elke `/summary` er 2 regels (`**Versie:**` + witregel) ónder prependt. Bij 9 entries stond het merk op 31 en viel de check om — niet door de wijziging van die sessie, maar door de lijst zelf. Zulke poorten hebben een houdbaarheidsdatum die niemand opschrijft; los het op met 1-in-1-out (max 8 entries) plus een comment dat de invariant benoemt.

✅ **Always:**
- Probeer de gemelde reeks te reproduceren met **één som** vóór je een browser opent. 77/37/22/7/0 bleek exact `397 − viewport`, en 397 = 20px padding + 377px kopinhoud. Daarmee was de diagnose rekenkundig sluitend en wist ik wat ik zocht; klopt de som niet, dan is er een tweede bron.
- Kies mutanten die **elkaars complement** zijn. Fix eruit → B rood @414 waar A groen is. `min-width:700px` op de body → A rood waar B groen blijft. Pas dat paar bewijst dat géén van beide asserties overbodig is; twee mutanten met hetzelfde faalpatroon bewijzen dat er één te veel is.
- Zorg voor een mutant die de pagina's rood maakt die **altijd** groen zijn. `privacy.html` en `cookies.html` zijn vóór én ná de fix groen — zonder mutant B is hun dekking nooit gefalsifieerd, en een check die nooit faalt is ononderscheidbaar van een check die niet werkt.
- Bewijs "inert op desktop" op **geometrie**, niet op de property. A/B tegen `git archive HEAD` op een tweede poort gaf @1280 en @768 byte-identieke kopbreedte, kophoogte én documenthoogte; alleen de computed `overflow-wrap` verschilt. "De regel vuurt daar toch niet" is een redenering, dit is een meting.
- Geef een nieuwe guard een **zelfbewakende tak**. HTTP-status 200 + een `<h1>` met niet-lege tekst en breedte > 0: een 404 heeft nul overflow en zou de spec anders groen laten staan zonder iets te meten.
- Toets genericiteit door de **tekst te vervangen**, niet door te redeneren. `h1.textContent` tijdelijk op `Verwerkersovereenkomst` (437px, 137 overflow) en `Aansprakelijkheidsbeperking` (502px, 202 overflow) zetten liet zien dat beide naar 0 gaan — en verwierp `clamp()` op een cijfer in plaats van op een vermoeden.
- Kies de scope van een CSS-fix op wat hij **naast** het doel raakt. Containerbrede `overflow-wrap` (het `blog.css`-precedent) zou de `<td>`-afbreking veranderen in de scrollbare tabellen; `h1,h2,h3` niet. De guard dekt de klasse, de CSS dekt het bekende geval.

### Sessie 223: De verantwoording wekte wantrouwen — en de wet die dat regelt gold al twaalf dagen (16 aug 2026)
⚠️ **Never:**
- Een vertrouwenstekst **zelfverzekerder** maken zonder te vragen wat er feitelijk waar is. De defensieve toon wás accuraat: er is geen menselijke feitencontrole. Had ik alleen de toon opgepoetst, dan had ik precies de misleiding gebouwd waar art. 6:193c BW tegen beschermt. Vraag eerst wat het proces écht is — het antwoord ("ik controleer niets zelf, AI doet meerdere rondes") kantelde de hele conclusie.
- Een **positionele selector** gebruiken in een rij waar elementen worden bijgeplakt. `.blog-post-meta span:last-child` (0,2,1) was geschreven voor de categorie-badge; Sessie 208 zette er een span achter en de regel wisselde stilzwijgend van doel, versloeg `.blog-ai-notice` (0,1,0) en verfde een wettelijk verplichte melding in linkblauw op **4,89:1** terwijl het commentaar "bewust gedempt" beloofde. En repareer zo'n regel door hem te **verwijderen** als hij dood is (`.category-badge` zet zelf color + font-weight) — CSS toevoegen om CSS te bevechten die niets meer doet, verdubbelt het probleem.
- Een grep-populatie vertrouwen die één woord te veel eist. Mijn eerste sweep zocht een strafmaat mét "gevangenisstraf" ernaast en vond **3** claims; een ±3-regelvenster op `jaar|jaren` vond er **8**. Ik had Heisenberg een populatie van 3 gemeld die 8 bleek.
- Een mutant accepteren die **het bestand niet verandert**. Twee van mijn vier Check 16-mutanten bleven groen: M1 verwijderde per ongeluk het `138ab`-anker waar de check op zoekt, M3 matchte niet door `<strong>`-tags in de ruwe HTML. "Geen failure" is ononderscheidbaar van "de check werkt niet" — alleen `diff -q` ná de sed onthulde het.
- Een defect repareren zonder **sitebrede sweep en zonder guard**. De 138ab-strafmaatfout was al eens gecorrigeerd (`archive-s121-s164.md:16`); die fix raakte één regel, waardoor `wat-is-ethisch-hacken.html` zichzélf tegensprak (regel 213 fout, regel 301 correct) en twee andere bestanden dezelfde zin hielden. Derde keer dus.
- Een bundelgetal uit een eigen `du`-som melden. `du -sb src/ styles/` gaf 1221 KB (over budget!) omdat het de woff2-fonts meetelt; de canonieke formule in `performance.spec.js:132-141` is `src/**/*.js` + `styles/**/*.css` + `src/ui/**/*.css` + `index.html` = **1103,43 KB**. Draai de test, som niet zelf.

✅ **Always:**
- Meet de **load-bearing** claim van een subagent zelf na. Art. 50 lid 4 AI-verordening geldt sinds **02-08-2026** en de uitzondering eist *menselijke* toetsing met feitencontrole als minimum (certificering uitdrukkelijk **niet**). Dat ene feit bepaalde de hele aanpak, dus het ging langs twee onafhankelijke bronnen vóór ik erop bouwde.
- Zet de melding waar de **wet meet**, niet waar het uitkomt. "Uiterlijk bij de eerste blootstelling" betekent: op de blogpost zelf, want de meeste lezers landen via Google en zien `/over-ons.html` nooit. Een verantwoordingspagina dekt de bezoeker die er toevallig komt.
- Verschuif de trustbasis naar wat **waar én sterk** is als "ik heb dit geverifieerd" niet kan. "Wat er gecontroleerd is" → **"Wat je zelf kunt natrekken"** met concrete ingangen (wetten.overheid.nl, rechtspraak.nl/ECLI, GitHub, de bestaande automatische checks). *Niet geloof me, maar controleer me* is eerlijker én robuuster dan een vage kwaliteitsbelofte.
- Loop na wat een copy-edit **drie alinea's verderop** doet. Het schrappen van "ik loop de beweringen niet zelf na" maakte "geen menselijke feitencontrole" generiek, waardoor het de latere alinea over de *onafhankelijke* lezer inslikte. De blast radius van een tekstwijziging is groter dan de zin waar je in staat.
- Geef een guard een tak die **zichzelf** bewaakt. Check 16 faalt óók wanneer hij nul claims vindt; zonder die tak zet een verouderde zoekterm de check stil op groen — precies hoe een guard verdampt zonder dat iemand het merkt.
- Beantwoord "is deze faler van mij?" met een **A/B tegen HEAD**. De 22px overflow op `terms.html` mat 22px aan beide kanten (`git archive` + twee poorten), dus pre-existing. En noteer meteen de echte oorzaak dat hij ongezien bleef: er is **geen E2E-dekking op de drie legal-pagina's**.
- Kies de goedkoopste laag die de invariant kan dragen. Beide nieuwe guards bewaken **statische tekst**, dus ze horen in `validate-docs.sh`/`validate-blogs.sh` — die draaien al via pre-commit én CI, zonder server en zonder browser. Spec-telling bleef dan ook 39/303.

### Sessie 222: De box-randen braken verticaal — en zes eerdere fixes zochten allemaal in de breedte (14 aug 2026)
⚠️ **Never:**
- Een defect blijven repareren op de **as waar het symptoom naar wijst**. "De rand breekt" leest als breedte, dus Sessie 81/82/189/202/204/205 deden font-subset, canvas-advance, width-contract en reflow. Doorgemeten klopte die kant al volledig: boxfont byte-identiek + `loaded`, álle glyphs exact **10,8px** net als latin, rechterrand-spreiding **≤0,04px** over 8 commando's, nul wraps. De breuk zat in de **verticale** as — `.terminal-line` heeft `margin-bottom: 4px` en een `│`/`┃` tekent alleen binnen zijn eigen linebox. Een monospace-raster heeft twee assen; controleer de andere voordat je de bekende opnieuw optimaliseert.
- `vertical-align` gebruiken om een glyph optisch op te tillen op een plek waar regelhoogte telt. Het doet **mee in de linebox-berekening**: `.marker-arrow{vertical-align:.2em}` maakte elke regel met een pijl 3,59px hoger en dus het gat 8px i.p.v. 4px. `position: relative; top: -.2em` geeft dezelfde optische nudge en raakt de layout niet. Meetbaar verschil: variant "alleen marge weg" gaf pitch {27; **30,59**}, pas met `position:relative` werd het uniform {27}.
- Een `rgba`-achtige bijna-gelijkheid vertrouwen zonder marge uit te rekenen. Onder 768px is de regelafstand **25,6px** en de glyph-ink **~25,78px** — 0,18px overlap, en dat eet de rasterisatie op: **9 naden van 1px, 97,8% dekking**. De grijswaarden in die naden (7-13) waren gelijk aan de achtergrond (10,3), dus echte gaten. Een integer regelafstand (`--line-height` → 27px/24px) lost het op; "het pást wiskundig" is geen bewijs dat het rendert.
- Meten vóór `document.fonts.load()`. `fonts.ready` resolvet terwijl `JetBrains Mono Box` nog op `loading` staat, want dat font wordt pas aangevraagd zodra er een box-glyph gerenderd wordt. Mijn eerste meting gaf daardoor **drie** advances (10,8 / 10,802 / 10,8371) uit fallback-fonts en wees vals naar fontmetrics — precies de conclusie die al zes sessies rondzingt.
- Een assertie schrijven die één **as** van het probleem meet en denken dat de klasse gedekt is. `measureBoxLineWraps()` meet uitsluitend of een regel wrapt; de rand kan pixel-perfect uitgelijnd zijn en tóch als streepjeslijn renderen. Daarom stond deze bug jarenlang groen. En: de twee gemelde commando's (`next`, `metasploit`) stonden **niet eens in `COMMANDS`**.
- Een `--global-timeout` kiezen zonder te weten hoe lang de suite duurt. Ik gaf 420 chromium-tests 25 minuten; hij liep eroverheen en zou afkappen — de Sessie 216-val waarbij "did not run" onder een regel "passed" bijna als groen leest. Afgebroken en **niet geteld**, niet "waarschijnlijk goed" gemeld.

✅ **Always:**
- Falsificeer de **staande** diagnose expliciet en leg de metingen vast. Vijf beweringen ("font corrupt", "advances wijken af", "horizontaal stuk", "reflow stuk", "letter-spacing") zijn stuk voor stuk doorgemeten en alle vijf onwaar. Dat is de helft van het antwoord: zonder die tabel gaat sessie zeven weer aan de breedte sleutelen.
- Bewijs een layoutfix op **gerenderde pixels**, niet op `getComputedStyle`. De randkolom uitlezen gaf "27px ink … 4px gat … (12 stubs)" vóór en "één run van 293px" ná, en @760px "97,8% / 9 naden" → "100,0% / 0 naden". Cijfers uit de DOM hadden de 1px-naden nooit laten zien.
- Kies mutanten die **verschillend** falen. Marge terug → 9 rood (overlevers: de wrap-tests, terecht). `vertical-align` terug → 7 rood, en `metasploit` blijft groen omdat die box geen pijl heeft. `line-height` terug → 1 rood, alleen de reflow-test. Drie identieke faalpatronen zouden betekenen dat twee asserties overbodig zijn.
- Win op **specificiteit**, niet op `!important`, als een later ladend bestand dezelfde property zet. `.terminal-output{line-height:1.6}` in `mobile.css` (0,1,0) laadt ná `terminal.css`; daarom staan de box-regels op twee klassen (0,2,0). Mijn live-experiment werkte alleen omdat een geïnjecteerde `<style>` als laatste komt — dat is géén bewijs dat de echte regel wint.
- Start de no-store-server op een **verse poort** als de debugbrowser een oude module vasthoudt. Ik kreeg `'certificate-templates.js' does not provide an export named 'CERT_DISCLAIMER'` terwijl de export op schijf én over de lijn bestond; nieuwe origin = lege cache. `?cb=` bust submodules niet.
- Controleer de metriek die je overschrijft. TASKS.md/CLAUDE.md claimden **296** `test()`-declaraties terwijl de boom er op `HEAD~1` **300** had, en de bundelregel stond op "1050 → 1100 (Sessie 214)" terwijl de constante sinds Sessie 217 **1120** is. Beide gecorrigeerd; attributie van de +3 declaraties gaat naar deze commit, niet naar de drift.

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


**Rotation:** Top-6 huidig: 222-223-224-225-226-**228** (Sessie 221 → `docs/sessions/current.md` via 1-in-1-out, Sessie 228. ⚠️ **De reeks slaat 227 over, en dat is opzet:** die sessie kreeg destijds geen `/summary`, en zijn `current.md`-entry is in Sessie 228 achteraf gereconstrueerd uit de commits en de TASKS-items. Learnings zijn daar bewust NIET bij gemaakt — die kun je niet eerlijk reconstrueren zonder de dead-ends te kennen, en een verzonnen leerpunt is erger dan een ontbrekend leerpunt; de **staande regel** "geen baseline van bekende testfalers" is bewust in dit bestand gebléven — die is nog van kracht en is geen historisch leerpunt). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie:** laatste uitgevoerd Sessie 225 (210-214 → `archive-s210-s214.md`, byte-geverifieerd: elke entry precies 1× in het archief en 0× in current.md, learnings 212/213/214 meegegaan met hun entry); current.md houdt nu het rolling window 215-228 (19 secties: 12 entries + de learnings van 215-220). **Volgende bulk-rotatie Sessie 230 → archiveer de staart (215-219).** NB: archiveer altijd de **oudste** entries (README §Rotatie-regel: "sessies ouder dan de laatste ~10"). Twee dingen die bij Sessie 220 bleken: (a) een learnings-blok hoort mee te gaan met de sessie waar het bij staat, anders blijft "Sessie N — learnings" achter terwijl entry N in het archief zit; (b) de SESSIONS.md-index dríft — hij claimde window "205-215" terwijl current.md er 15 hield, dus controleer hem bij elke bulk. Historie 81-209 → `archive-s205-s209.md` + `archive-s200-s204.md` + `archive-s195-s199.md` + `archive-s190-s194.md` + `archive-s185-s189.md` + `archive-s180-s184.md` + `archive-s175-s179.md` + `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

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

**Rotation trigger:** Bij elke sessie 1-in-1-out op de CLAUDE.md-learnings (top-6 vast). Bulk-rotatie van `current.md` bij `N % 5 == 0`: archiveer **de staart** — de oudste ~5 entries — naar `archive-sNNN-sMMM.md`. Laatste bulk: Sessie 225 (210-214). **Volgende bulk: Sessie 230** (staart = 215-219). Neem het learnings-blok van een sessie mee met zijn entry. Actuele stand: zie de **Rotation**-regel onder §Recent Critical Learnings.
**Sessie counter:** 228

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

**Last updated:** 19 aug 2026 (Sessie 228 — ongefilterde sitebrede contrastsweep: 13.157 element-toestanden, 152 onder AA en 378 onder AAA over 18 kleurwaarden → 0/0. Vier meetgaten verklaarden waarom drie rondes dit misten. NEW `text-contrast.spec.js`. Volledig: `docs/sessions/current.md`)
**Version:** 6.01 (Sessie 228 — vier CSS-commentaren claimden een contrast dat ze niet haalden (1,96 / 4,29 / "3,25 = AA" / 3,30 op de primaire CTA). Ongefilterd meten vond 152 onder AA; de zwaarste was 1,54:1 in de cookiebanner, op élke pagina. Een guard die op een tokenlijst filtert bewaakt geen klasse. 44 specs / 314 decl; 489 passed chromium. ⚠️ bundel 1103,62/1120 (1,5%) — CSS-commentaar telt mee, `styles/` wordt niet geminificeerd. Historie: `docs/sessions/current.md`)

