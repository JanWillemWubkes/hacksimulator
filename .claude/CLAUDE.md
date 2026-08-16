# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 223)
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

### Sessie 221: Vijf commits over drie dagen — en de regel die twee van hen stuurde, bleek zelf fout (12 aug 2026)
⚠️ **Never:**
- Een **intern regeldocument** toepassen of handhaven zonder te toetsen of hij klopt. `blog-template.md` verbood iets dat volstrekt normaal is (gratis sample + betaald product = het sample-hoofdstuk-model, dat `sample-pentest.html:238-244` zelf ook voert), benoemde het echte defect niet, en **sprak zichzelf tegen**: zijn mapping-tabel wijst `wmvpx` toe aan recon-posts, de regel eronder verbiedt precies dat. Zes "overtredende" posts waren dus geen zes slordigheden maar één fout document dat zich zes keer reproduceerde. Heisenberg moest me hierop wijzen (*"misschien is die template wel niet correct"*) — ik stond op het punt de regel te gaan handhaven.
- Een defect diagnosticeren op de laag waar het gemeld werd. Drie sessies meldden "6 posts promoten het Playbook twee keer" als redactionele keuze. Doormeten: het probleem was **13 posts**, en niet de koppeling maar het werkwoord — buiten de blog zei **8 van de 8** betaalde CTA's "Bekijk…", binnen de blog **13 van de 15** "Download…". De blog was de enige plek op de site die een download beloofde voor iets achter een betaalmuur.
- Een **negatieve** check schrijven waar een positieve kan. Mijn eerste 14a verbood alleen het wóórd "Download"; de mutant `>Pak het Playbook<` overleefde glansrijk. Erger: het scriptcommentaar bewéérde dat 14b die omzeiling afving, terwijl 14b een ándere invariant meet (betaalmarkering aanwezig, niet werkwoord correct). Een check die één specifieke fout verbiedt, dekt de klasse niet.
- Eén token twee rollen laten dragen. `--color-cta-primary` werkte als CTA-**achtergrond** (wit erop) en faalde als **tekst**: 101 van de 232 accent-tekstelementen onder AA in light mode, over 12 pagina's. En kies de vervanging op meting — de vanzelfsprekende Green 700 haalt AA níét op een `.section-band` (4,31:1); pas Green 900 haalt AAA op beide (7,83 / 9,11).
- `align-items: center` gebruiken om tékst te centreren. Dat centreert de **doos** van de `<p>`, niet de inhoud. Ze vallen alleen samen zolang de regel niet afbreekt; zodra dat gebeurt wordt de doos containerbreed en valt de tekst terug op `text-align: start`. Zulke bugs leven in smalle banden — hier **≤385px fout, ≥390px goed**, en de meeste telefoons zitten daarboven.
- Marketingpercentages als bewijs gebruiken. "266% meer conversie met één CTA" naast "+20% met meerdere" zijn allebei gerecyclede, niet-gerepliceerde cases die elkaar tegenspreken. Het enige robuuste mechanisme was peer-reviewed (zero-price effect) — en dat pleitte niet tégen de koppeling maar vóór onderscheidbaarheid.

✅ **Always:**
- Beantwoord "moet ik deze regel volgen?" met een **meting naast de regel**. Tellen wat er feitelijk staat (23 betaalde CTA's sitebreed, de 8/8-vs-13/15-verdeling) vond een defect dat de regel niet benoemde en dat ruim dubbel zoveel posts raakte. Repareer daarna de **oorzaak** (het document) samen met de symptomen, anders reproduceert hij zich opnieuw.
- Loop de **overlever** van een mutantenreeks na. 6 van 7 rood zei niets tot ik wist waaróm die ene groen bleef — en dat ontmaskerde een claim die ik zelf al als opgelost in het commentaar had gezet. Zeven mutanten, zeven rood is pas een resultaat.
- Kies de goedkoopste guard die de invariant kán dragen. Checks 13 en 14 bewaken statische tekst, dus ze horen in `validate-docs.sh` (draait al via pre-commit, geen server, geen browser) en niet in een Playwright-suite van 48 minuten. En **leid de grondwaarheid af** uit de bron (`gidsen.html`) i.p.v. hem te hardcoderen, anders is de check zelf het volgende dat veroudert.
- Meet vóór je bouwt, ook als de bron je **eigen goedgekeurde plan** is. Punt 4 (CTA-volgorde omdraaien in `leren-hacken.html`) is na meting geschrapt: beide CTA's zitten contextueel goed — "Structuur nodig?" sluit *Stap 1: leer de terminal* af, de gratis sample staat onder *Gratis platforms om te oefenen*. Uitvoeren had consistentie gekocht met een slechtere plaatsing.
- Attribueer een metriekdelta aan de commit die hem veroorzaakte in plaats van aan de laatste. De +2,92 KB bundelgroei kwam volledig uit twee CSS-commits; de blog-CTA-wijziging kost +0,49 KB en telt **nul** in die teller, want die meet `src/` + `styles/` + `index.html` en niet `blog/`.
- Laat een verkeerde motivering niet de hele wijziging omverhalen. `e2dc950` verschoof de metasploit-mid-CTA met twee redenen, waarvan er één (de template) fout was — maar de andere (`ojort` had **nul** instroom) was zelfstandig geldig, en dát is precies waar Check 13d op toetst. Was `ojort` er niet geweest, dan had die commit een goed passend product vervangen door een slechter passend, op gezag van een document.
- Draai `/summary` vóór hij zelf drift wordt. Vijf commits liepen drie dagen ongelogd door; `validate-docs.sh:909` claimde al "(Sessie 221)" terwijl TASKS.md en CLAUDE.md nog 220 hielden. Die counter-discrepantie wás het symptoom, niet een losse observatie.

### Sessie 220: Opruimsessie — vier van de vijf punten bleken een notitie die niet meer klopte (10 aug 2026)
⚠️ **Never:**
- Een notitie vertrouwen die een **toestand** beschrijft in plaats van een meting. Vier van de vijf punten deze sessie waren dezelfde fout: #18 wachtte op een AdSense-dashboard dat sinds Sessie 208 niet bestaat, #34 wachtte 66 sessies op een poort die met Outcome 4 al dicht was, het Brevo-runbook meldde "Stap 2 en 3 nog te doen" terwijl de automation al op **Active** stond, en #60 gaf een oorzaak die op geen enkel punt klopte. Het gemene: **geen van vieren kon terugmelden dat hij verlopen was.** Een test doet dat wel — daarom is de guard die je toevoegt vaak meer waard dan de fix eronder.
- Een testfaler lezen als "de test of de code is stuk". **5 van de 7 falers kwamen van de hostingpartij:** drie parallelle motoren tegen productie lokken **Netlify's bot-protectie** uit, die een interstitial serveert (*"We are verifying your connection"* + Challenge ID) zonder één site-element — symptoom `TypeError: tc is null`. Lees `test-results/*/error-context.md`: de DOM-snapshot geeft het antwoord in vier regels. Draai de suite tegen `scripts/nostore-server.py`, niet tegen productie (lokaal: 27/27 groen).
- Een `if (x === 0) return;` als edge-case-afhandeling laten staan zonder te vragen hóé vaak hij vuurt. `performance.spec.js:480` nam **10 van de 10** seriële runs die tak en meldde "geslaagd". Oorzaak: de VFS-save is gedebounced op 1000 ms en die timer wordt door élke mutatie teruggezet, terwijl er ~350 ms tussen twee `touch`-commando's zit. Gemeten: meteen uitlezen **0 bytes**, na 1200 ms wachten **5139**, na `flush()` **5139**.
- Een mutant accepteren die de drempel niet haalt. Mijn eerste CV-mutant gaf 23,8% tegen een grens van 50% — groen, dus bewees hij niets. Pas exponentieel groeiende namen (59,8%) lieten de assertie vuren. Een mutant die niet rood wordt, is geen mutant.
- Een lange run uitzitten die zijn eigen deadline niet haalt. De volle 3-motorensuite stond na 20 min op 156/1092 en zou afkappen met "did not run" onder een regel "passed" (de val van Sessie 216). Trieer op codepad: de twee gewijzigde specs over drie motoren, plus alle 37 specs op één motor omdat `fixtures.js` de enige brede wijziging was.
- Code wijzigen terwijl de suite tegen diezelfde bestanden draait. Ik bewerkte `index.html` en `landing.css` midden in een run; specs vóór en ná die edit testten verschillende markup, dus die run was als verificatie waardeloos en moest over.

✅ **Always:**
- Meet ook als de bron je **eigen plan** is. Het plan zei "verzacht de copy" op gezag van een runbook; de automation stond al drie dagen live. Was ik gaan bouwen, dan had de bezoeker een slechtere pagina gekregen — een verkeerde notitie met een gedupeerde aan de bezoekerskant in plaats van alleen verspilde tijd.
- Falsificeer hypotheses **hardop** en leg ze vast. Bij de flaky autocomplete-test bleken "de app is nog niet gewired" (8/8 wél — `goto` wacht op `load`) en "de legal-modal blokkeert Tab" (0/10 modal actief) allebei onjuist. Beide staan nu in #64, zodat de volgende sessie ze niet opnieuw onderzoekt. Twee gefalsifieerde hypotheses zijn meer waard dan een derde gok.
- Beantwoord "is deze faler van mij?" met een **A/B tegen de oude code**, niet met een gevoel. `git show HEAD:tests/e2e/fixtures.js` naast de nieuwe, zelfde opdracht, 4 runs per kant: **1 rood aan beide kanten** — daarmee is "pre-existing" een meting.
- Laat een openstaande faler een **diagnose** heten, geen baseline. #64 draagt wat gemeten is én wat gefalsifieerd is. Retries (config: 1 lokaal) maken hem in normaal gebruik een groene "flaky"-run — reden om hem niet te prioriteren, géén reden om hem "bekend" te noemen.
- Neem het learnings-blok van een sessie **mee** met zijn entry bij een bulk-rotatie, en controleer de `SESSIONS.md`-index: die claimde window "205-215" terwijl `current.md` er 15 hield, §Session Overview stond op Sessie 190, en §Maintenance Protocol sprak de canonieke README tegen.
- Meet een tikdoel ná `scrollIntoViewIfNeeded`. Mijn eerste hit-test gaf `raakbaar=false` omdat het midden buiten beeld lag en `elementFromPoint` dan `null` geeft — dezelfde meetfout als Sessie 215. Ná scrollen: 268×50 (chromium) / 268×49 (WebKit), opvanger is de link zelf.

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
- Beantwoord "moet dit erbij?" met de rol van de pagina. De homepage eindigt al met **drie opeenvolgende asks** en haar north-star is activation, niet e-mail — dus de juridische sample gaat er niet bij, ook al is de asymmetrie (17 links vs 1) echt. Die hoort contextueel opgelost — in Sessie 220 gebeurd met één wayfinding-link naar `/gidsen.html` in de bestaande lead-magnet-strook. ⚠️ **Correctie (Sessie 220):** de tweede grond ("geblokkeerd zolang `sample-juridisch.html:132` een welkomstmail belooft die de automation nog niet stuurt") was **onjuist**. De automation stond al op Active sinds 7 aug; alleen het runbook meldde nog "Stap 2 en 3 nog te doen". Ik stond op het punt correcte copy te verzachten op gezag van een document dat drie dagen achterliep — controleer de wérkelijkheid, niet de notitie erover.
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


**Rotation:** Top-6 huidig: 218-219-220-221-222-223 (Sessie 217 → `docs/sessions/current.md` via 1-in-1-out, Sessie 223; de **staande regel** "geen baseline van bekende testfalers" is bewust in dit bestand gebléven — die is nog van kracht en is geen historisch leerpunt). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie:** laatste uitgevoerd Sessie 220 (205-209 → `archive-s205-s209.md`, byte-geverifieerd); current.md houdt nu het rolling window 210-223 (16 secties: 13 entries + de learnings van 212-217). **Volgende bulk-rotatie Sessie 225 → archiveer de staart (210-214).** NB: archiveer altijd de **oudste** entries (README §Rotatie-regel: "sessies ouder dan de laatste ~10"). Twee dingen die bij Sessie 220 bleken: (a) een learnings-blok hoort mee te gaan met de sessie waar het bij staat, anders blijft "Sessie N — learnings" achter terwijl entry N in het archief zit; (b) de SESSIONS.md-index dríft — hij claimde window "205-215" terwijl current.md er 15 hield, dus controleer hem bij elke bulk. Historie 81-209 → `archive-s205-s209.md` + `archive-s200-s204.md` + `archive-s195-s199.md` + `archive-s190-s194.md` + `archive-s185-s189.md` + `archive-s180-s184.md` + `archive-s175-s179.md` + `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

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

**Rotation trigger:** Bij elke sessie 1-in-1-out op de CLAUDE.md-learnings (top-6 vast). Bulk-rotatie van `current.md` bij `N % 5 == 0`: archiveer **de staart** — de oudste ~5 entries — naar `archive-sNNN-sMMM.md`. Laatste bulk: Sessie 220 (205-209). **Volgende bulk: Sessie 225** (staart = 210-214). Neem het learnings-blok van een sessie mee met zijn entry. Actuele stand: zie de **Rotation**-regel onder §Recent Critical Learnings.
**Sessie counter:** 223

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

**Last updated:** 16 aug 2026 (Sessie 223 — verantwoording herschreven van bekentenis naar controleerbaarheid; art. 50 lid 4 AI-verordening geldt sinds 02-08-2026 en de uitzondering vereist menselijke feitencontrole, die er niet is — dus AI-melding op 15 posts + woordenlijst. Volledig: `docs/sessions/current.md`)
**Version:** 5.97 (Sessie 223 — verantwoording van "geloof me" naar "controleer me"; AI-melding per contentpagina, want art. 50 lid 4 meet bij de eerste blootstelling. Bijvangst: `span:last-child` verfde die melding linkblauw op 4,89:1 → 9,17:1, en de verzwaarde 138ab-strafmaat stond op het basisdelict (3x, derde keer) → NEW Check 16. 7 mutanten, 7 faalpatronen. 39 specs / 303 declaraties. Bundel 1103,43/1120. Historie: `docs/sessions/current.md`)

