# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

---

## Sessie 223: De verantwoording wekte wantrouwen — en de wet die dat regelt gold al twaalf dagen (14-16 aug 2026)

**Mission:** Heisenberg stuurde een screenshot van `#verantwoording` op `over-ons.html` met de observatie dat die sectie de site juist *onbetrouwbaarder* laat overkomen. Opdracht: analyseer de huidige tekst, laat een subagent uitzoeken wat de Nederlandse wet- en regelgeving hier eist, en herschrijf hem wetsconform zonder het vertrouwen te schaden. Plus: de perspectiefsprong eruit — eerst derde persoon over Jan Willem, daarna de ik-vorm.

**Commits:**

| | | |
|---|---|---|
| `9e93336` | 14 aug | De AI-melding stond op één pagina; art. 50 lid 4 meet bij de eerste blootstelling |
| `b051b1b` | 15 aug | Vier zinnen die zichzelf onderuithaalden, plus een tooltip die met ze mee moest |
| `fbb1fc5` | 16 aug | De verzwaarde strafmaat stond op het basisdelict — op drie plekken, voor de derde keer |

### De diagnose: het probleem was niet de toon, maar wat de toon verzweeg

Vier oorzaken, gemeten in de tekst zelf:

1. **De kop stelde de twijfel zelf.** *"Verantwoording: hoe betrouwbaar is deze inhoud?"* — een vraag die de lezer nog niet had, en die je daarna moet wegnemen.
2. **De AI-alinea was een bekentenis, geen werkwijze.** *"levert fouten op die er overtuigend uitzien"* + *"Dat is geen excuus vooraf"* verdedigt zich tegen een aanklacht die niemand had ingediend.
3. **Een eigen kop "Wat nog niet gecontroleerd is"** gaf structureel evenveel gewicht aan het ontbrekende als aan het aanwezige.
4. **De hoofdcontrole stond in de toekomende tijd.** *"Zodra die review is uitgevoerd"* — de lezer hoort: het belangrijkste moet nog gebeuren.

Plus een interne tegenspraak op één klik afstand: `index.html:553` claimde *"10+ Artikelen met bron en controledatum"* en linkte naar precies de sectie die zei dat de artikelen *"nog geen bronnenlijst"* hebben.

### Het juridisch onderzoek draaide de aanname om

Subagent-onderzoek langs negen vragen (AI-verordening, art. 3:15d BW, oneerlijke handelspraktijken, consumentenrecht digitale inhoud, exoneratie, art. 138ab/139d Sr, titelbescherming, AVG, en of een verantwoording überhaupt verplicht is). De load-bearing bevinding zelf nagemeten bij twee onafhankelijke bronnen:

**Art. 50 lid 4 AI-verordening is van toepassing sinds 2 augustus 2026** — twaalf dagen op het moment van de sessie. Wie AI-tekst publiceert die het publiek informeert over aangelegenheden van algemeen belang (justitie, openbare veiligheid, consumentenveiligheid) moet die als zodanig aanmerken. Er is één uitzondering: menselijke inhoudelijke toetsing — de definitieve richtsnoeren noemen *"controle van de feitelijke juistheid vormt een minimumvereiste"* — plus een met naam genoemd redactioneel eindverantwoordelijke. **Certificering is uitdrukkelijk niet vereist**; dat Jan Willem geen OSCP heeft was dus nooit het probleem.

Op de directe vraag antwoordde Heisenberg: *"Ik controleer niets zelf op feiten. Wel laat ik AI meerdere keren controleren."* AI die AI controleert is geen menselijke toetsing. **De uitzondering is dus niet beschikbaar**, en de melding moet op de contentpagina's zelf staan — de wet meet bij de *eerste blootstelling*, en de meeste lezers landen via Google direct op een blogpost, niet op `/over-ons.html`.

### Twee claims die daardoor niet klopten

| Waar | Wat er stond | Waarom fout |
|---|---|---|
| 15× `blog/*.html` | `title="Datum waarop de feitelijke beweringen … zijn nagelopen"` + "Feiten gecontroleerd:" | Impliceert menselijke redactie |
| `over-ons.html:326` | *"De betaalde gidsen zijn apart gecontroleerd, inclusief de wetsartikelen en rechtszaken"* | Zelfde probleem, maar bij een **betaald** product |

### De herschrijving: van "geloof me" naar "controleer me"

Zonder menselijke feitencontrole kan het vertrouwen niet uit *"ik heb dit geverifieerd"* komen — dat zou precies de misleiding zijn waar art. 6:193c BW tegen beschermt. Het moet komen uit het enige dat waar én sterk is: **alles is controleerbaar, en hier staat hoe.** "Wat er gecontroleerd is" → **"Wat je zelf kunt natrekken"**, met concrete ingangen: wetten.overheid.nl, rechtspraak.nl/ECLI, de open broncode op GitHub, en de twee automatische checks die al bestonden.

Elke hergebruikte claim eerst tegen de bron geverifieerd vóór hij opnieuw werd opgeschreven: Check 6e bewaakt de hash-snelheden echt, 6b/6c/6d de tellingen echt, 15/15 posts dragen echt een datum.

Bewust **geen** brede aansprakelijkheidsuitsluiting toegevoegd: richting consumenten grotendeels vernietigbaar (art. 6:233 jo. 6:237 sub f BW), `terms.html:184-217` draagt hem al, en op een vertrouwenspagina kost hij alleen. Wel de scope-mededeling die juridisch wél werkt (educatief, geen juridisch of beveiligingsadvies).

### Copy-revisie (commit 2): vier zinnen die zichzelf onderuithaalden

Heisenberg las de nieuwe tekst terug en gaf drie punten; het vierde volgde uit de meting:

1. *"klopt er iets niet, dan ligt dat bij mij"* → zin eindigt na *"gepubliceerd wordt"*. Het Nederlands klopte niet: *"de verantwoordelijkheid ligt bij mij"* is correct, maar hier is het onderwerp de **fout** zelf, en een fout "ligt" niet bij iemand. Grammaticaal correct zou "aan mij" zijn — precies de zelfbeschuldiging die weg moest.
2. *"is er niet: ik loop de beweringen niet zelf regel voor regel na"* → *"is er nog niet."*
3. *"Dat is een echte beperking, en het is de reden dat de site verder is ingericht op controleerbaarheid in plaats van op mijn woord"* → *"De site is ingericht op controleerbaarheid."*
4. **Niet gemeld, wel gevolg van punt 2:** door het schrappen van die bijzin werd "geen menselijke feitencontrole" generiek en overlapte hij met de alinea verderop die opende met *"Wat er nog niet is: een onafhankelijke securityprofessional…"*. Die alinea leidt nu met het aanbod (het reviewpakket) in plaats van met het tekort.

Randvoorwaarde die is bewaakt: **geen enkel feit verdwijnt**. *"Een menselijke feitencontrole is er nog niet"* dekt zowel de eigen controle als de onafhankelijke lezer.

### Bijvangst 1: een CSS-bug die er sinds Sessie 208 zat

`.blog-post-meta span:last-child { color: var(--color-link); font-weight: medium }` is geschreven toen de **categorie-badge** de laatste span in de meta-rij was. Sessie 208 plakte de controledatum-span erachter en de regel wisselde stilzwijgend van doel: (0,2,1) verslaat `.blog-ai-notice` (0,1,0), dus de melding rendeerde in **linkblauw met medium gewicht** terwijl het commentaar erboven "bewust gedempt" beloofde.

Gemeten light mode: **4,89:1** in plaats van de bedoelde 9,17:1, plus niet-link-tekst in linkkleur. Voor de badge was de regel al dood — `.category-badge` (regel ~920) zet zelf `color` + `font-weight`. Dus **verwijderd** in plaats van er met specificiteit tegenaan geduwd: CSS toevoegen om CSS te bevechten die niets meer doet, verdubbelt het probleem.

### Bijvangst 2: de verzwaarde strafmaat stond op het basisdelict — voor de derde keer

Art. 138ab Sr, geverifieerd tegen de wettekst via meerdere juridische databases:

| Lid | Delict | Max |
|---|---|---|
| 1 | opzettelijk en wederrechtelijk **binnendringen** | **2 jaar** |
| 2 | + gegevens overnemen, aftappen of opnemen | 4 jaar |
| 3 | via openbaar telecomnet + verwerkingscapaciteit misbruiken | 4 jaar |

Drie plekken schreven het verzwaarde maximum toe aan het basisdelict: `terms.html:181`, `blog/cybersecurity-tools.html:461`, `blog/wat-is-ethisch-hacken.html:213`. Ongeautoriseerde toegang ís lid 1, dus 2 jaar.

`wat-is-ethisch-hacken.html` **sprak zichzelf tegen**: regel 213 was fout terwijl regel 301 in hetzelfde bestand de juiste uitsplitsing al had. Dat is het spoor van de eerdere correctie (`archive-s121-s164.md:16`) — die repareerde één regel, veegde niet sitebreed en liet geen guard achter.

Vijf claims waren al goed en leverden het model: drie posts gebruiken de open vorm (*"straffen kunnen oplopen tot vier jaar"*), twee noemen beide grenzen. **De betaalde juridische gids splitst óók correct uit per lid** — de gratis pagina's waren hier slechter dan het betaalde product, precies omgekeerd aan wat in de vorige sessie-notitie stond.

### Guards

- **`validate-blogs.sh` Check 7 uitgebreid**: assert positief dat elke post `Met AI geschreven` draagt. Niet: verbied de oude tekst — een verbod op één formulering laat elke andere door.
- **NEW Check 16 in `validate-docs.sh`**: een venster rond een 138ab-vermelding dat een strafmaat in jaren noemt, moet de gradatie tonen via (a) open vorm `tot N jaar` of (b) beide grenzen (dekt ook `2-4 jaar`). Vensters zonder jaartal blijven vrij — 138ab noemen zónder strafmaat is de veiligste vorm en de meeste posts doen dat al. Meet 8 claims over html/typ/js, en faalt óók wanneer hij nul claims vindt (dan is de zoekterm verouderd).
- **`.claude/skills/blog-post/SKILL.md` stap 5** in lockstep, inclusief de juridische grond én de conditie waaronder de melding weg mág (échte menselijke feitencontrole, en pas nadat `#verantwoording` in dezelfde commit is bijgewerkt).

### Mutanten

| Mutant | Uitkomst |
|---|---|
| AI-melding weg (label vervangen, span blijft) | rood — de AI-assertie |
| span-klasse hernoemd | rood — de klasse-assertie |
| `<strong>` vóór de `<time>` | rood — de structuur-assertie |
| gesloten maximum terug in `terms.html` | rood — Check 16 tak (a)+(b) |
| open vorm dichtgezet in `wachtwoord-beveiliging.html` | rood — tak (a) is dragend |
| 2-jaar-grens weg uit `wat-is-ethisch-hacken.html:301` | rood — tak (b) is dragend |
| zoekterm naar `138abXX` | rood — "check meet niets meer" |

Zeven mutanten, zeven verschillende faalmeldingen. **Twee pogingen werden aanvankelijk niet rood omdat de mutant zelf niet muteerde**: M1 verwijderde per ongeluk het `138ab`-anker waar de check op zoekt, M3 matchte niet door `<strong>`-tags in de ruwe HTML. Beide gaven "geen failure" — ononderscheidbaar van "de check werkt niet". Alleen `diff -q` na de sed onthulde het.

### Metrics

| | Vóór | Ná |
|---|---|---|
| Bundel | 1102,37 KB | **1103,43 / 1120 KB** (marge 16,57 KB = 1,48%) |
| Playwright specs / declaraties | 39 / 303 | **39 / 303 (ongewijzigd)** |
| `validate-docs.sh` checks | 15 | **16** |
| Contrast AI-melding light | 4,89:1 | **9,17:1 AAA** |
| Contrast AI-melding dark | 6,15:1 | 6,15:1 (gelijk aan de publicatiedatum ernaast) |
| E2E chromium (11 specs) | — | 164 passed, 2 skipped, **0 failed** |

De +1,06 KB komt volledig uit `blog.css` (het commentaar dat beide rekensommen vastlegt) en `index.html`; de wijzigingen in `over-ons.html` en `blog/*.html` tellen niet mee in die formule.

### Openstaand

- **22px horizontale overflow op `assets/legal/terms.html` @375px.** A/B tegen HEAD (`git archive` + twee poorten): **22px aan beide kanten**, dus pre-existing en niet door deze sessie veroorzaakt. `scrollWidth` 397 tegen `clientWidth` 375, terwijl **geen enkel element** met zijn border-box buiten beeld valt — vermoedelijk een pseudo-element of scroll-regio.
- **Geen E2E-dekking op de drie legal-pagina's** (`privacy.html`, `terms.html`, `cookies.html`). De bestaande overflow-asserties dekken index, gidsen, over-ons en één blogpost. Dát gat is waarschijnlijk waardevoller dan de 22px zelf — het is de reden dat dit ongezien bleef.
- **Art. 3:15d sub a: fysiek vestigingsadres ontbreekt.** Onvoorwaardelijk verplicht, ook zonder KvK-inschrijving; een postbus telt niet. Heisenberg heeft besloten hier nu niets mee te doen. Het onderliggende punt — betaalde producten aan het publiek verkopen raakt in beginsel de inschrijfplicht van de Handelsregisterwet — is een beslissing, geen tekstwijziging.
- **De 7 overige wetsartikelen en het ene ECLI-nummer in de betaalde gids** zijn niet doorgelopen: daar is geen gemeten defect, alleen een ongemeten aanname. Mechanisch verifieerbaar tegen rechtspraak.nl en wetten.overheid.nl.

---

## Sessie 222: De box-randen braken verticaal — en vier eerdere fixes zochten allemaal in de breedte (14 aug 2026)

**Mission:** Heisenberg leverde drie foto's van een scherm met `metasploit`, `next` en `man metasploit`, waarop de omlijning rond de terminal-output stukgaat, met de vraag hoe dat kan na zoveel pogingen ("we hebben dit probleem al zo vaak proberen te verhelpen"). Eis: alles netjes uitgelijnd, en dat blijft zo bij een veranderende schermgrootte.

**Commits:**

| | | |
|---|---|---|
| `260f8af` | 14 aug | Box-randen braken verticaal: 4px marge tussen elke regel, geen breedteprobleem |

### De diagnose die vier sessies lang de verkeerde as had

Sessie 81, 82, 189, 202, 204 en 205 hebben dit alle zes als **breedte**probleem behandeld: font-subset, canvas-meting van de glyph-advance, contract-unificatie van `width`, reflow-bij-resize. Doorgemeten klopt die kant inmiddels volledig:

| bewering | meting |
|---|---|
| inline base64-boxfont corrupt? | **nee** — byte-identiek aan `styles/fonts/jetbrains-mono-box-subset.woff2` (zelfde sha256, 5200 bytes), `status: loaded`, `fonts.check` true |
| glyph-advances wijken af? | **nee** — `─ ━ │ ┃ ╭ ┏ ├ ┫` én latin `M`/spatie allemaal **10,8px** op 18px; beide woff2's 1000 upm / advance 600 |
| horizontale uitlijning stuk? | **nee** — rechterrand-spreiding **≤0,04px** over 8 box-commando's @1440px, 0,02px @900px, 0,01px @620px ná reflow; nul wraps, nul overflow |
| `box-reflow.js` stuk? | **nee** — render @900 (75 tekens) → resize naar 620 → herbouwd naar 54 tekens, spreiding 0,01px |
| `letter-spacing`? | **nee** — `#terminal-output` staat expliciet op 0; de `0.5px`-regels raken alleen navbar-links |

De breuk zit in de **verticale** as, die nooit onderzocht was. `.terminal-line` draagt `margin-bottom: var(--spacing-xs)` = 4px. Box-regels zijn losse block-elementen, en een verticale glyph (`│`/`┃`) tekent alléén binnen zijn eigen linebox — nooit over die marge heen. Gemeten op de gerenderde randkolom van een `next`-box (x=138, drempel >90):

```
segmenten: 27px ink … 4px gat … 27px ink … 4px gat …   (12 stubs)
één gat van 8px op de regel met '→'
```

Die 8px is de tweede bijdrager: `.marker-arrow`/`.inline-arrow` droegen `vertical-align: .2em`, en `vertical-align` telt **mee in de linebox-hoogte**. Elke regel met een pijl werd 3,59px hoger.

Regelafstand vóór de fix, alle acht box-producenten @1440px (`gap = pitch − line-height`):

| commando | box-regels | pitch | gat |
|---|---|---|---|
| help | 55 | 31 / 34,59 | 4 / 7,59 |
| shortcuts | 18 | 31 | 4 |
| leerpad | 39 | 31 / 34,59 | 4 / 7,59 |
| next | 11 | 31 / 34,59 | 4 / 7,59 |
| man nmap | 2 | 31 | 4 |
| metasploit | 17 | 31 | 4 |
| dashboard | 34 | 31 / 34,59 | 4 / 7,59 |
| tutorial | 23 | 31 | 4 |

### Waarom "alleen de marge weghalen" niet genoeg was

Drie varianten naast elkaar gemeten op dezelfde `next`-box:

| variant | pitch | hoogte pijlregel |
|---|---|---|
| huidig | 31 / 34,59 | 30,59 |
| A: alleen marge weg | 27 / **30,59** | 30,59 |
| B: marge weg + pijl via `position: relative` | **27** (uniform) | **27** |

`position: relative` verschuift alleen het **schilderen**, niet de layout: de pijl houdt exact dezelfde optische correctie (die bewust bestaat omdat het fallback-glyph laag zit) zonder de linebox te vergroten.

### De tweede breuk, die pas bij het versmallen zichtbaar wordt

Onder 768px zakt `--font-size-mobile` naar 16px en zet `mobile.css` `.terminal-output{line-height:1.6}` → **25,6px**, fractioneel, tegen een glyph-ink van ~25,78px. Dat is 0,18px overlap, en dat eet de rasterisatie op. Pixelmeting van de randkolom @760px ná reflow: **97,8% dekking, 9 naden van 1px** — de grijswaarden in die naden (7-13) waren identiek aan de achtergrond (gem. 10,3), dus echte gaten, geen antialiasing.

Opgelost door box-regels `--line-height` (1,5) te laten volgen: 18px → 27px en 16px → 24px, allebei **integer**, en met 1px overlap tegen de glyph. Omdat `.terminal-output` in `mobile.css` (0,1,0) later laadt dan `terminal.css`, moesten de box-regels op **twee klassen** (0,2,0) — geen `!important`.

### Resultaat

| | voor | na |
|---|---|---|
| gaten, 8 commando's @1440px | 4px / 7,59px | **0** |
| randdekking @1440px | 12 stukjes | **één run van 293px** |
| randdekking @760px na resize | 97,8% (9 naden) | **100,0% (0 naden)** |
| rechteruitlijning | ≤0,04px | onveranderd ≤0,05px |

**Work done:**
- `src/ui/renderer.js` — `getBoxLineClass()` naast de bestaande gedeelde helpers; aangehaakt op **beide** render-paden (`renderOutput` regel ~128 en de mission/completion-render regel ~334) zodat ze niet uit sync lopen. De sluitregel (`╰`/`┗`) houdt zijn marge, zodat de box losstaat van wat erna komt. `box-reflow.js` hoefde niet mee: `rebuildBlock` gebruikt `cloneNode(false)`, wat de className meekopieert.
- `styles/terminal.css` — `.terminal-line.terminal-line--box{margin-bottom:0;line-height:var(--line-height)}` + `--box-end` die de marge terugzet; `.marker-arrow`/`.inline-arrow` van `vertical-align:.2em` naar `vertical-align:baseline;position:relative;top:-.2em`.
- `terminal.html` — `terminal.css?v=118` → `?v=119`. `main.css` **niet** gebumpt: die verandert niet en `--spacing-xs`/`--line-height` bestonden daar al, dus geen cross-entry-staleness.
- `tests/e2e/responsive-ascii-boxes.spec.js` — `measureBoxVerticalGaps()`: pitch tussen aangrenzende box-siblings mag niet groter zijn dan de ink-hoogte van de randglyph (via `canvas.measureText`). Eén predicaat dat **drie** regressieklassen dekt (marge, `vertical-align`, te grote `line-height`), vergelijkt alleen aangrenzende siblings en nooit over een blokgrens (`╰`/`┗`) heen. Plus `next` en `metasploit` — die stonden **niet in `COMMANDS`** terwijl het juist de gemelde commando's waren — en een reflow-test 1280 → 700px.

**Mutanten** (drie, met **verschillende** faalpatronen — anders is een assertie blind):

| mutant | uitkomst |
|---|---|
| `margin-bottom` terug op `.terminal-line--box` | **9 rood** — alle gap-tests; de 2 overlevers zijn de wrap-tests (marge veroorzaakt geen wrap) |
| `vertical-align: .2em` terug op `.marker-arrow` | **7 rood** — alleen `next`/`leerpad`/`help` + reflow; `metasploit` blijft groen (geen pijl in die box) |
| `line-height` uit `.terminal-line--box` | **1 rood** — alleen de reflow-test, de enige die onder 768px komt |

**Twee meetvallen die tijd kostten:**
1. **Meten vóór het font geladen is.** `document.fonts.ready` resolvet terwijl `JetBrains Mono Box` nog op `loading` staat — het font wordt pas aangevraagd zodra er een box-glyph gerenderd wordt. Mijn eerste meting gaf daardoor drie verschillende advances (10,8 / 10,802 / 10,8371) uit fallback-fonts en wees vals naar een fontmetrics-probleem. Altijd eerst `await document.fonts.load(...)`.
2. **De MCP-browser hield een verouderde module vast** (`'certificate-templates.js' does not provide an export named 'CERT_DISCLAIMER'`) terwijl de export op schijf én over de lijn bestond; de terminal boot-te niet. Exact de val uit Sessie 219. Opgelost door de no-store-server op een **verse poort** te starten (nieuwe origin = lege cache), niet met `?cb=`.

**Metrics delta:** bundel 1102,37 / 1120 KB (marge 17,63 KB = 1,57%); mijn wijziging kost ~2,0 KB, vrijwel volledig commentaar (renderer.js +1327 B, terminal.css +746 B). Specs 39 → 39; `test()`-declaraties **300 → 303** (+3 in `responsive-ascii-boxes.spec.js`, 16 → 19). NB: TASKS.md en CLAUDE.md claimden **296** voor Sessie 221 terwijl de boom er op `HEAD~1` **300** had — die telling liep al 4 achter vóór deze sessie, nu gecorrigeerd. Idem de bundelregel in TASKS.md, die op "1050 → 1100 (Sessie 214)" stond terwijl de constante sinds Sessie 217 op 1120 staat.

**Next steps:**
- **Volle chromium-suite: 413 passed / 0 failed / 7 skipped in 18,1 min**, gedraaid tot `[420/420]` — compleet, niet afgekapt, nul flaky. De box-spec apart: 152 passed / 4 skipped over chromium/firefox/webkit. Mijn eerste poging kreeg een `--global-timeout` van 25 min; de suite heeft ~18 min nodig plus opstart en liep eroverheen, wat zou afkappen met "did not run" onder een regel "passed" (de Sessie 216-val). Die run is afgebroken en **niet geteld** — de 25 min was mijn schatting, niet een meting, en dat is precies de fout die die val voedt. Meet de looptijd één keer en kies de grens daarop.
- Bundelmarge staat op 1,57%. 1000 → 1050 → 1100 → 1120 is drie bumps in 14 sessies; de volgende vraag is niet "bump".

---

## Sessie 221: Vijf commits over drie dagen — en de regel die twee van hen stuurde, bleek zelf fout (12 aug 2026)

**Mission:** Geen enkele opdracht vooraf; dit is een verzamelsessie. Vijf commits liepen tussen 10 en 12 aug zonder tussentijdse `/summary`, dus ze vormen per de nummerregel (*nummer telt per summary-ronde, niet per commit — ook na `/clear`*) samen Sessie 221. Twee ervan raken dezelfde regel in `blog-template.md`, en komen tot tegengestelde conclusies. Dat is de rode draad.

**Commits:**

| | | |
|---|---|---|
| `0dd0c64` | 10 aug 21:35 | #64 draagt nu ook zijn prioriteit, niet alleen zijn diagnose |
| `8c0c455` | 11 aug 06:49 | Copyright-regel centreert nu ook als hij afbreekt (≤385px) |
| `c8cd46b` | 11 aug 19:57 | `--color-cta-primary` was ook tekstkleur, en faalde daar: 101 → 0 onder AA |
| `e2dc950` | 12 aug 19:59 | Gidsen-verwijzingen op 4: de blog beloofde er drie naast een knop voor vier |
| `3a78a5e` | 12 aug 21:04 | Betaalde blog-CTA's beloofden een download: 13 van de 15, nu 0 |

### `0dd0c64` — een openstaand item dat zijn eigen prioriteit niet droeg

#64 beschreef wát gemeten was en wat de volgende stap zou zijn, maar niet dat het láág geprioriteerd is. Een volgende sessie leest dat als werk. Toegevoegd: de suite draait met `retries: 1` lokaal, dus in normaal gebruik is dit een groene run met het label *flaky* en blokkeert hij niets; alle Sessie 220-metingen zijn met `--retries=0` gedaan om schoon te kunnen tellen, en pas dáár werd het een rode run. Met de expliciete waarschuwing erbij om hem tóch geen "bekende faler" te noemen — laag geprioriteerd is iets anders dan wegverklaard (staande regel sinds Sessie 217).

### `8c0c455` — `align-items: center` centreert de doos, niet de tekst

`.footer-bottom` stond op mobiel al op `align-items: center`, maar dat centreert de **doos** van de `<p>`, niet de tekst erin. Zolang de regel op één lijn past vallen die samen; zodra hij afbreekt is `max-content` groter dan de beschikbare breedte, wordt de doos exact containerbreed en staat de tekst op `text-align: start` — dus links.

Daardoor leefde de bug in een smalle band: **≤385px breekt af (fout), ≥390px past (goed)**. De meeste telefoons zitten daarboven, wat verklaart waarom dit lang onopgemerkt bleef.

Gemeten op `over-ons.html`, afwijking t.o.v. het midden van `.footer-bottom`:

| viewport | vóór | ná |
|---|---|---|
| 360px | regel 1 −36,5 / regel 2 −115,0 | 0 / 0 |
| 375px | regel 1 −44,0 / regel 2 −122,5 | 0 / 0 |
| 390px | 0 (één regel) | 0 |
| 769+ | links (`space-between`) | ongewijzigd |

`text-wrap: balance` erbij omdat gecentreerd nog niet evenwichtig is: de natuurlijke breuk gaf 247px naast 90px, balance maakt er 171/166 van en breekt ná het em-streepje in plaats van middenin "Alle rechten". Progressive enhancement — oudere browsers negeren het en houden de gecentreerde-maar-rafelige variant. NEW `footer-copyright.spec.js`.

### `c8cd46b` — één token met twee onverenigbare rollen

`--color-cta-primary` droeg zowel de CTA-**achtergrond** (met wit erop: werkt) als **tekstkleur** (in light mode nergens AA). Gemeten over 12 pagina's tegen de *effectieve* achtergrond, niet tegen `--color-bg` (de meetfout van Sessie 217):

| | accent-tekstelementen | onder AA | onder AAA |
|---|---|---|---|
| vóór | 232 | **101** | 232 |
| ná | 232 | **0** | 90 |

Nieuw token `--color-accent-text` (lime in dark, Tailwind Green 900 in light), op 22 declaraties. Green 900 is **op meting** gekozen, niet op gevoel — de vanzelfsprekende keuze (Green 700, bestond al als `-hover`) haalt AA níét op een `.section-band`:

| | op band | op wit | |
|---|---|---|---|
| `#16a34a` Green 600 (was) | 2,83:1 | 3,30:1 | onder AA |
| `#15803d` Green 700 | 4,31:1 | 5,02:1 | onder AA op band |
| `#166534` Green 800 | 6,13:1 | 7,13:1 | geen AAA op band |
| `#14532d` Green 900 | 7,83:1 | 9,11:1 | **AAA op beide** |

Twee dingen die de nieuwe test vond en de sweep niet: `.terminal-line .tip/.highlight` stonden op een theme-token terwijl de hero-terminal in **beide** thema's zwart is (in light `#16a34a` op zwart = 6,37:1). NEW `accent-text-contrast.spec.js`. Dit scherpt `architecture-patterns.md §10` verder aan: niet alleen "kleur volgt de achtergrond", maar ook **"een token dat twee rollen draagt, faalt in minstens één"**.

### `e2dc950` — vier gidsen, drie in de copy

De commits die de vierde gids toevoegden (`da366ce`, `470f4f8`, `8a9f6dd`, `db7d7de`) raakten uitsluitend `gidsen.html` en `docs/products/*`. Elke aantal-claim daarbuiten bleef op 3 staan, en er was niets dat dat kon terugmelden: `blog/welkom.html` noemde "drie gidsen" pal naast de bundel-CTA (`emzjvj`) die er vier levert. Ook `llms.txt`, de JSDoc-ID-lijst in `src/analytics/events.js` en de huidige-toestand-regels in CLAUDE.md + TASKS.md M5.5 bijgewerkt.

`gumroad-listings.md` sprak zichzelf tegen: §Status zei *"nog open — en dit is een echte"* over de bundelinhoud terwijl §Stand van zaken datzelfde punt op 7 aug al had afgevinkt. Bundelinhoud bij de bron nageteld (vier PDF's in `emzjvj`) en als **meting** vastgelegd i.p.v. als notitie; wat de telling níét bewijst staat er expliciet bij.

NEW **Check 13** in `validate-docs.sh`: leidt N=4 en paginasom=72 **af** uit `gidsen.html` (niet hardgecodeerd) en toetst bundelclaim, JSON-LD-Product-aantal, elke aantal-claim in bezoekercopy, en of elk product buiten `gidsen.html` gelinkt wordt (13d — kwam er omdat `ojort` nul instroom had). Vier mutanten rood; drie vuurden elk precies één andere assertie.

Ook hier: de metasploit-post kreeg `wmvpx` → `ojort` in de mid-CTA. **Twee redenen, waarvan er één fout was** — zie hieronder.

### `3a78a5e` — de betaalde CTA beloofde een download

Drie eerdere sessies meldden hetzelfde openstaande punt: 6 blogposts promoten het Pentest Playbook twee keer (gratis sample boven, betaald product midden), en `blog-template.md:182` noemt dat letterlijk *"Niet doen"*. Alle drie noemden het een **redactionele keuze**, geen correctheidsfout. Heisenberg vroeg expliciet om de norm zélf te onderzoeken in plaats van hem toe te passen: *"misschien is die template wel niet correct"*.

**Dat bleek beslissend.** Drie uitkomsten:

1. **De template was zijn eigen oorzaak.** De mapping-tabel wijst `wmvpx` toe aan *"Recon, pentest-praktijk, checklist"*; twintig regels lager staat dat `wmvpx` alleen lead-magnet mag zijn. Wie de tabel volgde, landde in de verboden toestand. Zes posts zijn dus geen zes slordigheden maar één tegenstrijdig document dat zich zes keer reproduceerde.
2. **Het gemelde defect was niet het echte defect.** "Twee CTA's voor hetzelfde product" is het sample-hoofdstuk-model — `sample-pentest.html:238-244` doet exact dezelfde koppeling, met bétere copy (*"Bekijk het **volledige** Playbook"*). Het probleem was dat de twee asks ononderscheidbaar waren.
3. **Het raakte 13 posts, niet 6.**

| | vóór | ná |
|---|---|---|
| blog, betaalde knop "Download…" | **13 van 15** | 0 |
| blog, betaalde knop "Bekijk…" | 2 | **15** |
| buiten de blog | 8 van 8 "Bekijk…" | ongewijzigd |
| sitebreed totaal | 23 | 23 (geen product raakte instroom kwijt) |

De blog was de enige plek op de site die een *download* beloofde voor iets achter een betaalmuur. In de 6 `wmvpx`-posts stapelde dat op: bovenaan "Download de gratis sample" (9 pagina's uit het Playbook), 300 regels lager "Download het Playbook" — zelfde werkwoord, zelfde naam, geen prijs, in een visueel identieke doos (`.blog-cta-product` verschilt van `.blog-cta` in precies één property: `h3` font-size).

**Geen prijzen in de copy.** De site noemt nergens een bedrag — de enige `€` in de blog zijn salariscijfers in lopende tekst. Een bedrag in 15 posts zetten creëert 15 plekken die verouderen. "Betaalde gids op Gumroad." geeft hetzelfde signaal zonder onderhoudslast. Bij `wmvpx` doet "alle 6 fasen in ~19 pagina's" tegenover de 9 gratis het onderscheidende werk.

NEW **Check 14** in `validate-docs.sh`: knoptekst begint met "Bekijk", de alinea draagt een betaalmarkering, en de paginaclaims worden afgeleid uit `gidsen.html` zodat de check niet zelf veroudert.

### De spanning tussen `e2dc950` en `3a78a5e`

Beide commits raken `blog-template.md:182`, en ze concluderen het tegenovergestelde. `e2dc950` **handhaafde** de regel (metasploit-mid-CTA `wmvpx` → `ojort`, met als tweede motivering *"blog-template.md:182 verbiedt een betaalde CTA voor hetzelfde product als de gratis sample erboven"*). `3a78a5e` mat dat die regel zichzelf tegensprak.

**Staat die wijziging dan nog?** Ja — omdat hij twee onafhankelijke redenen had, en de eerste geldig was: `ojort` had **nul** instroom terwijl het lijstitem pal boven die CTA over een eigen lab gaat. Alleen de tweede reden was onjuist. Dat is precies waarom Check 13d (elk product moet buiten `gidsen.html` gelinkt zijn) de goede grond was en de template niet.

Het waarschuwende deel: was `ojort` er níét geweest, dan had `e2dc950` in zes posts een goed passend product vervangen door een slechter passend — de fout vergroot in plaats van verkleind, op gezag van een document.

### Learnings

- **Een intern regeldocument is een bewering, geen grondwaarheid.** De template verbood iets dat normaal is, benoemde het echte defect niet, en produceerde de overtredingen die hij verbood. Onderzoek de norm vóór je hem handhaaft — inclusief extern onderzoek naar wat het vakgebied zegt.
- **Marketingstatistiek is geen bewijs.** "266% meer conversie met één CTA" naast "+20% met meerdere" zijn allebei gerecyclede, niet-gerepliceerde cases. Het enige robuuste mechanisme is het zero-price effect (peer-reviewed) — en dat pleit niet tégen de koppeling, maar vóór onderscheidbaarheid.
- **Een negatieve check is te omzeilen.** De eerste versie van 14a verbood alleen het wóórd "Download"; de mutant `>Pak het Playbook<` overleefde glansrijk. Erger: het scriptcommentaar beweerde dat 14b die omzeiling afving, terwijl 14b een ándere invariant meet. Beide asserties zijn nu positief geformuleerd. **De overlever nalopen loonde — hij ontmaskerde een claim die ik zelf al als opgelost had opgeschreven.**
- **Een token dat twee rollen draagt, faalt in minstens één.** `--color-cta-primary` werkte als achtergrond en faalde als tekst: 101 elementen onder AA. Splitsen is de fix, en de vervangende waarde hoort gemeten — Green 700 leek vanzelfsprekend en haalde AA niet op een band.
- **Centreren van een doos is niet centreren van tekst.** `align-items: center` en `text-align` zijn verschillende dingen; ze vallen alleen samen zolang de inhoud niet afbreekt. Zulke bugs leven in smalle viewport-banden (hier ≤385px) en zijn daarom bijna onvindbaar zonder gerichte meting.
- **Meet vóór je plant, ook als de bron je eigen plan is.** Punt 4 van het goedgekeurde plan (CTA-volgorde in `leren-hacken.html` omdraaien) is na meting **geschrapt**: beide CTA's zitten contextueel goed — "Structuur nodig?" sluit *Stap 1: leer de terminal* af, de gratis sample staat onder *Gratis platforms om te oefenen*. Omwisselen had consistentie gekocht met een slechtere plaatsing.
- **De `/summary` zelf kan driften.** Vijf commits liepen drie dagen ongelogd door. `validate-docs.sh:909` claimde al "(Sessie 221)" terwijl TASKS.md en CLAUDE.md nog 220 hielden — de counter-discrepantie wás het symptoom, niet een losse observatie.

### Metrics

| | Sessie 220 | Sessie 221 |
|---|---|---|
| Bundel (`performance.spec.js`-teller) | 1095,54 KB | **1098,46 KB** |
| Marge tot 1120 | 24,46 KB (2,2%) | **21,54 KB (1,9%)** |
| Spec-bestanden | 37 | **39** |
| `test()`-declaraties | 290 | **296** |
| `du -sb` styles/ | 434 KB | 437 KB |
| `du -sb` blog/ | 474 KB | 474 KB |

De +2,92 KB komt volledig uit `8c0c455` + `c8cd46b` (CSS). De blog-CTA-wijziging kost +0,49 KB en telt **nul** in deze teller: die meet `src/` + `styles/` + `index.html`, niet `blog/`.

⚠️ **De marge is nu 1,9% en de alarmgrens is in zicht.** 1000 → 1050 → 1100 → 1120 is drie bumps in 17 sessies. De volgende niet-triviale wijziging raakt de grens, en dan is de vraag niet weer een bump maar of dit nog het juiste getal is om te meten.

### Verificatie

- `validate-docs.sh` fast + `--deep` exit 0 (14 checks).
- Check 14: **7 mutanten, 7 rood**, daarna hersteld groen.
- `lead-magnet.spec.js` chromium tegen `nostore-server.py`: **19 passed / 0 failed** (2 skipped = productie-header-tests).
- Pre-commit hooks groen bij beide commits van 12 aug.

### Next steps

- [ ] Bundelgrens: bij 1,9% marge is de volgende wijziging de aanleiding. Niet bumpen zonder eerst te toetsen of `src/ + styles/ + index.html` nog de juiste teller is.
- [ ] #64 blijft open (laag geprioriteerd, draagt zijn diagnose én zijn prioriteit).
- [ ] Bulk-rotatie bij Sessie 225: staart = 210-214.

---

## Sessie 220: Opruimsessie — vier van de vijf punten bleken een notitie die niet meer klopte (10 aug 2026)

**Mission:** Vijf losse opruimpunten: een pagina die een e-mail belooft, twee tests die niet meten wat ze beweren, de bulk-rotatie, en dode taken. De opdracht zei expliciet *"MEET EERST, BOUW DAARNA — de metingen hieronder komen uit Sessie 219 en kunnen achterhaald zijn"*. Dat bleek de kern van de sessie: **vier van de vijf punten waren geen bug maar een verouderde notitie.**

### Punt 1 — de juridische welkomstmail was al gebouwd

Het plan wilde `sample-juridisch.html:132` (*"We mailen 'm ook zodra je je inschrijving bevestigt"*) verzachten, want `docs/newsletter/brevo-setup-sample-juridisch.md:7-10` meldde nog "Stap 2 (template) en Stap 3 (automation) nog te doen".

Heisenberg keek in de Brevo-UI: automation **`Sample Juridisch — welkomstflow`** staat sinds 7 aug op **Active**, trigger *Form submitted* op het juiste formulier (`Sample Juridisch embed`, token `MUIFAGIf…`, niet het pentest-formulier `MUIFACJ0…`), en de mail-actie draagt het echte template en niet Brevo's lege default — onderwerp en preview komen letterlijk overeen met Stap 2 §5-6, en de body toont `> Bestand klaargezet: juridische-gids-sample.pdf`. Repo-template bevestigd: 2× `gumroad.com/l/yzdtfx` (de volledige juridische gids, ~13 pagina's, vanaf €5) en de juiste PDF.

**De pagina is niet gewijzigd.** Bijgewerkt: runbookstatus, Stap 2/3/4 afgevinkt, plus twee interne tegenspraken die náást elkaar in hetzelfde document stonden (*"de `action`-URL wijst nog naar het pentest-formulier"* terwijl Stap 1 vier alinea's verderop meldt dat hij vervangen is; en de free-tier-poort *"lukt een derde automation?"* die al met ja beantwoord was en in CLAUDE.md nog als blokkade werd meegedragen). Stap 4 dicht na Heisenbergs proefinschrijving.

### Punt 2 — `performance.spec.js:480` asserteerde serieel niets

Gereproduceerd: 5 metingen van `0.00 KB`, CV `NaN%`, guard genomen, **groen in 11,7s**.

Oorzaak gemeten (10 `touch`-commando's tegen productie, drie condities):

| Conditie | bytes in `hacksim_filesystem` |
|---|---|
| meteen uitlezen — wat de test deed | **0** |
| 1200 ms wachten | 5139 |
| `persistence.flush()` | 5139 |

`persistence.js:47-58` doet `clearTimeout` + nieuwe `setTimeout(…, 1000)` bij élke mutatie; tussen twee `touch`-commando's zit ~350 ms. Die seconde verstrijkt dus nooit. Tegenbewijs stond in dezelfde repo: `vfs-versioning.spec.js:54-56` doet het wél goed, mét de comment *"laat de debounced save (1000ms) landen"*.

Opgelost met een deterministische flush via de al geëxporteerde `window.HackSimulator.debug.persistence` (`main.js:336-344`) i.p.v. wachten — 5× 1200 ms zou de test van ~12s naar ~18s duwen tegen een timeout van 30s. Guard vervangen door `expect(avgGrowth).toBeGreaterThan(0)`, plus een assertie op de debug-handle zelf (`?.flush()` zou stil dezelfde nulmeting opleveren). Meet nu **44,00 bytes/bestand, stddev 0,00, CV 0,0%**.

Twee mutanten: flush eruit → 5× `0.00 KB` + CV `NaN%`, cijfer voor cijfer de nulmeting, rood op de nieuwe assertie. Exponentieel groeiende bestandsnamen → 269 bytes/file bij CV 59,8%, **uitsluitend** rood op de CV-assertie terwijl `avgGrowth > 0` groen blijft. (Eerste poging met lineair groeiende namen gaf CV 23,8% — te zwak om iets te bewijzen.)

### Punt 3 — de diagnose klopte op geen van beide punten

TASKS.md #60 zei: *"faalt op firefox+webkit zodra drie motoren tegelijk draaien; oorzaak is de 10s `toBeVisible`-wachttijd op een JS-geïnjecteerde navbar onder CPU-contentie"*. Twee dingen die daar al niet mee rijmden: de eerste test in hetzelfde bestand heeft dezelfde race met een *krappere* 5s-timeout en valt niet om, en een `toBeVisible({timeout})` ís al een conditie-wacht.

Gemeten: **7 falers, niet 1.** De DOM-snapshot van de faler:

```
- paragraph: "We are verifying your connection. This will only take a few seconds."
- code: "Challenge ID: 01KZN1SA8QM5JFGZGN9V69SCFS"
```

**Netlify's bot-protectie.** Drie parallelle motoren die samen honderden navigaties naar productie afvuren krijgen een interstitial in plaats van de pagina; die bevat geen enkel site-element, vandaar `TypeError: Cannot read properties of null (reading 'getBoundingClientRect')`. Dezelfde suite tegen `scripts/nostore-server.py`: **27 passed / 0 failed.**

`:209` was wél een echte testfout, maar een andere. De call log noemt het element letterlijk: `<div id="legal-modal" class="modal active"> intercepts pointer events`. Deze test was de enige in het bestand die klikt zónder `acceptLegalModal()` — de drie erboven roepen hem wel aan. Venster gemeten: op het moment dat `.navbar-toggle` zichtbaar wordt bestáát `#legal-modal` nog niet; binnen ~500 ms wordt hij ingevoegd, meteen mét `.active`. De hamburger komt van `init-components.js`, de modal van `main.js` (99 modules) — de modal landt dus structureel ín het klikvenster.

NEW guard in `tests/e2e/fixtures.js`: wrapt `page.goto` en faalt op de interstitial mét oorzaak én uitweg. Mutant tegen een lokaal geserveerde neppagina met de challenge-tekst: de test faalt nu op de `goto` met de benoemde melding i.p.v. verderop met een `TypeError`. Dekt 150 `goto`-aanroepen in 37 specs; geen `about:blank`/`data:`-navigaties en opties worden doorgegeven.

### Punt 4 — bulk-rotatie 205-209

`current.md` hield geen 15 entries maar **20 `##`-secties**: 15 sessie-entries plus 5 losse learnings-blokken die eerder uit CLAUDE.md waren geroteerd (205, 207, 209, 212, 213). Die learnings horen mee te gaan met hun sessie — anders blijft *"Sessie 205 — learnings"* in `current.md` staan terwijl entry 205 in het archief zit. Toevallig aaneengesloten, dus het bleef één knip: regels 954-1214, byte-geverifieerd met `prefix + knip + suffix == origineel` (149.084 bytes), 20 → 12 secties.

Drie stukken bijgevangen staleness in `SESSIONS.md`, geen van drieën van deze rotatie: de index claimde window "205-215" terwijl `current.md` er 15 hield; §Session Overview stond op Sessie 190; en §Maintenance Protocol gaf een rotatieregel ("max 5 sessions full detail", "verplaats 82-84 naar RECENT") die `docs/sessions/README.md` sinds Sessie 170 tegenspreekt en die naar het bevroren `recent.md` verwees.

### Punt 5 — zeven dode taken gesloten

| Item | Grond |
|---|---|
| #18 AdSense-monitoring | AdSense verwijderd in Sessie 208 — geen dashboard, geen ad-unit, geen CTR. Stond 12 sessies open ná zijn eigen onderwerp |
| #22 Postmaster | Kalenderhelft van de trigger geschrapt: Postmaster aggregeert pas bij volume, dus die datum leverde nooit data. Enige conditie nu: eerste campagne >100 ontvangers |
| #33 LT1-reductie | Alle vijf sub-paden beslist; (c) twee keer gemeten en twee keer teruggedraaid, (e) in Sessie 205 structureel opgelost via `max-age=3600` op `/src/**/*.js` i.p.v. handmatige `?v=`-boekhouding over ~99 modules |
| #34 Mechanism-isolation | Sub-pad (a) draagt de trigger *"outcome 2/3 van #35(b)"* — en #35(b) sloot met **Outcome 4**. Wachtte 66 sessies op een poort die al dicht was |
| launch-blok (3×) | "verse blogpost schrijven" stond open náást zijn eigen afgevinkte uitvoering; "Launch-uitvoering — doel wo 29 juli" las alsof er niets gebeurd was terwijl de launch die dag begon; de GA4-annotatie was op 29 jul gezet en stond nog open |

M5.5-tabel 24/27 (88%) → 25/27 (92%), gemeld door `validate-docs.sh --deep` Check 6 — de forcing function ving exact mijn wijziging.

### Extra — één wayfinding-link naar `/gidsen.html`

`index.html` bevatte **nul** voorkomens van "gidsen". Correctie op de notitie uit Sessie 219 die "alleen via de navbar" zei: de footer linkt er ook naartoe (`footer.js:51`) — beide JS-geïnjecteerd, dus in-content is er geen route, maar het is iets anders dan er stond. Eén secundaire regel in de bestaande lead-magnet-strook; geen vierde ask. Geen `data-cta-location`, want dat attribuut werkt alleen náást `data-lead-magnet`/`data-product-id`/`data-lead-download` en zou los eraan dode markup zijn die er getrackt uitziet.

Tikdoel gemeten i.p.v. aangenomen: **268×50 (chromium) / 268×49 (WebKit)** op 375px en 360px, hit-test raakbaar met de link zelf als opvanger, nul horizontale overflow, beide thema's.

### Geen tweede rotatie deze sessie

De `/summary`-skilltekst zegt "bij `N % 5 == 0`: archiveer [N-10 .. N-6]", wat bij N=220 op 210-214 uitkomt. **Dat is de formule die Sessie 215 al als fout heeft gecorrigeerd** (zie `SESSIONS.md` §Rotatie-log). De canonieke regel staat in `docs/sessions/README.md`: archiveer wat ouder is dan de laatste ~10, en houd `current.md` op 10-15 entries. Met Sessie 220 erbij staat de teller op 11 (210-220) en is de oudste precies 10 sessies oud — er kwalificeert dus niets. Nogmaals roteren zou `current.md` op 6 entries brengen. Volgende bulk: **Sessie 225, staart = 210-214.**

**Commits (8, alle direct naar `main` gepusht):**
- `d5741f5` — De VFS-groeitest mat niets: guard vervangen door assertie + deterministische flush
- `69f785a` — Bulk-rotatie 205-209 — en de index die al twee bulks achterliep
- `907597c` — Dode taken gesloten met reden: vijf items wachtten op iets dat al beslist was
- `9076750` — Juridische welkomstmail was al af — het runbook liep drie dagen achter
- `1e7d417` — De navbar-test faalde niet op contentie maar op de legal-modal — en 5 van de 7 falers waren Netlify
- `3ccf880` — Homepage linkt eindelijk naar /gidsen.html — een link, geen vierde ask
- `c5d3cdb` — Testitems bijgewerkt: #60 en #62 gesloten, #64 geopend als openstaande diagnose
- `d5fd2b9` — Brevo-runbook juridische sample volledig afgerond (Stap 4 bevestigd)

**Learnings:**

- **Vier van de vijf punten waren dezelfde fout in verschillende vermommingen:** een notitie die een *toestand* beschreef in plaats van een meting, en die niets kon terugmelden toen hij verliep. #18 wachtte op een dashboard dat niet meer bestaat, #34 op een poort die al dicht was, het runbook meldde onaf werk dat af was, en #60 gaf een oorzaak die op geen enkel punt klopte. Dat is geen incident maar het patroon van de sessie — en de reden dat de guard in `fixtures.js` meer waard is dan de fix eronder: die *meldt* wél terug.
- **Een testfaler is geen bewijs dat de test of de code stuk is.** Vijf van de zeven falers kwamen van de hostingpartij. De DOM-snapshot in `error-context.md` gaf het antwoord in vier regels; zonder die snapshot had ik naar timing zitten kijken, precies zoals de vorige sessie deed.
- **Twee hypotheses hardop falsificeren is waardevoller dan een derde gokken.** Bij de flaky autocomplete-test bleken zowel "de app is nog niet gewired" (8/8 wél gewired — `goto` wacht op `load`) als "de legal-modal blokkeert Tab" (0/10 modal actief, 0/10 focus weg) onjuist. Die twee staan nu in #64 zodat de volgende sessie ze niet opnieuw onderzoekt. Doorgaan met gissen zou géén meting zijn geweest.
- **Meet ook wanneer de bron je eigen plan is.** Mijn plan zei "verzacht de copy" op gezag van een runbook. Was ik gaan bouwen, dan had de bezoeker een slechtere pagina gekregen op basis van een document van drie dagen oud — de eerste keer dit jaar dat een verkeerde notitie bijna een *gedupeerde aan de bezoekerskant* opleverde in plaats van verspilde tijd.
- **Drie eigen meetfouten, alle drie gemeld:** (a) ik hit-testte het tikdoel op coördinaten buiten beeld, wat `raakbaar=false` gaf — na `scrollIntoViewIfNeeded` klopt het (zelfde val als Sessie 215); (b) ik bewerkte `index.html` terwijl de suite tegen datzelfde bestand liep, waardoor die run als verificatie waardeloos was en opnieuw moest; (c) mijn eerste mutant voor de CV-assertie was te zwak (23,8%, onder de drempel van 50%) en bewees dus niets tot ik hem exponentieel maakte.
- **Een lange run triëren op codepad in plaats van hem uitzitten.** De volle 3-motorensuite (1092 tests) liep op 156 na 20 minuten en zou zijn eigen `--global-timeout` niet halen — precies de val van Sessie 216 ("did not run" onder een regel "passed"). Afgekapt en vervangen door: de twee gewijzigde specs over drie motoren (al groen) plus alle 37 specs op één motor, want `fixtures.js` is de enige brede wijziging. 356 passed / 1 failed / 7 skipped in 17,1 min.
- **Retries zijn geen antwoord maar wel context.** Ik draaide alles met `--retries=0` om schoon te meten; de echte config geeft lokaal 1 retry, dus de overgebleven flaky wordt in normaal gebruik als *flaky* gerapporteerd bij een groene run. Dat is de reden dat #64 geen sessie verdient — maar bewust géén reden om hem "bekende faler" te noemen, want dat is precies het label waar de staande regel van Sessie 217 tegen is geschreven.

**Next steps:**
- **#64** — `autocomplete-filesystem.spec.js:99` flaky onder volle-suite-load. Openstaande diagnose mét metingen; reproduceren ónder parallelle load i.p.v. in isolatie, en `focus-trap.js:74` + `input.js:138` instrumenteren op het faalmoment.
- **Bundelmarge 24,46 KB (2,2%).** De volgende niet-triviale wijziging raakt de alarmgrens. De vraag is dan **niet** weer een bump — 1000 → 1050 → 1100 → 1120 is drie bumps in 16 sessies — maar of dit nog het juiste getal is om te meten.
- Op Heisenberg: #59 Search Console-data voor `/terminal.html`, #17/#46 GA4 Realtime, #22 Postmaster bij de eerste campagne >100 ontvangers.

**Metrics delta:** src/ 722 KB (−1, afronding), styles/ 434 KB, blog/ 474 KB, assets/ 1737 KB — ongewijzigd. Specs 37, `test()`-declaraties 290: **nul nieuwe**, deze sessie repareerde bestaande tests. Bundeltest 1093,90 → **1095,54 KB** van 1120 (marge 26,10 → 24,46 KB). `current.md` 149.084 → 106.210 bytes na de rotatie; NEW `archive-s205-s209.md` 43.378 bytes.

---

## Sessie 219: Onder "in cijfers" was de homepage één blok — en de band die als voorbeeld gold, maakte in light mode nul verschil (09 aug 2026)

**Mission:** Heisenberg constateerde dat de secties tot en met "HackSimulator in cijfers" visueel onderscheidend zijn en alles daaronder als één blok leest, en vroeg om een UX/UI-analyse als expert. Tweede vraag: nu er ook een Sample Juridisch is, is het verstandig die naast de Sample Pentest op de homepage te zetten?

**Commits:** `e7cc0c4` (gepusht)

### De klacht was meetbaar, en erger op mobiel

Methode: groepeer opeenvolgende secties op *effectieve* achtergrond en meet de langste reeks zonder wissel.

| | @1440 | @375 |
|---|---:|---:|
| Langste reeks **boven** cijfers | 1023px (1,6 scherm) | 1329px (1,6 scherm) |
| Langste reeks **onder** cijfers | **2390px (2,66)** | **3078px (3,79)** |
| Ná deze sessie | **949px (1,05)** | **913px (1,12)** |

De reeks bestond uit `how-it-works` + `leerpad` + `blog-links` + `faq`. Op mobiel telt mee dat `.landing-section` onder 768px van 96px naar 32px padding zakt: de scheiding tussen twee secties is daar 64px witruimte in plaats van 192px — mínder ruimte én geen kleurwissel.

Wat de bovenhelft in werkelijkheid structuur geeft is niet subtiliteit maar de **groene solution-sectie** (Δ ~200). De twee banden daar zijn Δ2 en Δ0; de haarlijnen doen bijna al het werk. Dat is relevant voor de diagnose: er ontbrak onder de vouw niet alleen een kleurwissel, maar élke vorm van interpunctie.

### Twee bugs die alleen uit een meting komen

**1. De light-mode cijfers-band had nul kleurverschil met de pagina.**

`[data-theme="light"] .results-section` was `rgba(248, 248, 248, 0.8)` over een `#f8f8f8` pagina. Dat composit naar **exact `rgb(248,248,248)`** — verschil `[0,0,0]`. De comment erboven zei *"Zeer subtiel off-white"*: de bedoeling klopte, de rekensom maakte hem nul. De band die als goed voorbeeld gold bestond in light mode alleen uit twee haarlijnen. Dit is dezelfde familie als Sessie 215 en 217 — de derde keer dat een rgba-over-ondergrond niet is uitgerekend.

**2. "Banden lichter maken" is op deze site structureel fout.**

Mijn eerste prototype gebruikte `#161b22` (de nieuwsbriefkleur). De kaarten zijn `rgba(22, 27, 34, α)` — tinten van precies dat `#161b22`. Een kaart op zo'n band composit naar de bándkleur:

```
kaart-Δ = 0.3 × |kaartkleur − bandkleur|   →   0 zodra de band naar #161b22 kruipt
```

Ik zag het niet in de cijfers (band Δ11: prima) maar op de screenshot: kaarten met alleen nog een randje. Een kaart heeft hier geen eigen kleur, alleen een verhouding tot wat erachter staat.

### De regel die eruit volgde

> **Pagina = oppervlak. Band = verdieping. Kaart = verhoging.**

In beide thema's gaat de band *onder* `--color-bg`, zodat de kaart de lichtste laag blijft. Dat is de enige richting die niet botst met de kaart-tinten, en in light mode is het precies de Stripe/Linear-elevatie die de comment op `landing.css:2232` al nastreefde.

| | band vs. pagina | kaart vs. band |
|---|---:|---:|
| dark, vóór | 2 | 3 |
| dark, ná (`#080b0f`) | **8** | **6** |
| light, vóór | **0** | 7 |
| light, ná (`#eceef0`) | **12** | **19** |

Beter op beide assen. Eén nieuwe band volstond (`.leerpad-section`): plaatsing telt, niet aantal — `how-it-works` moet oppervlak blijven omdat het op de cijfers-band volgt, dus leerpad is de eerste mogelijke beat en knipt de reeks doormidden.

### Implementatie

- **`--color-bg-alt`** in beide thema's (`main.css`).
- **`.section-band`** (verf: achtergrond + twee haarlijnen) en **`.landing-section.section-band`** (full-bleed) staan bewust los: `.trust-bar` en `.homepage-newsletter` zijn al volle breedte en hebben alleen de verf nodig.
- De **`padding-inline: max(…)`** vervangt een inner wrapper die `.leerpad-section` niet heeft (h2, subtitle en `.leerpad-cards` zijn directe kinderen, dus kaal `max-width: 100%` zou de kaarten meetrekken). Geverifieerd byte-identiek aan een gewone begrensde sectie: `[45, 1381]` @1440 naast `.how-it-works-steps`, `[20, 340]` @360 naast `.faq-grid`.
- **`--band-gutter`** is geen luxe: het mobiele `padding`-shorthand staat in een media query, die géén specificiteit toevoegt (0,1,0) en dus verliest van de modifier (0,2,0). Zonder de custom property bleef de desktop-gutter op mobiel staan.
- Netto **vier regels verwijderd, twee toegevoegd**. `.results-grid` ligt nu op dezelfde content-rail als de rest (was `[32,1393]`, nu `[45,1381]`).
- **`?v=219` op main.css én landing.css.** `.section-band` leest `--color-bg-alt`; een oude cached `main.css` laat die var ongedefinieerd, waarna `background` terugvalt op transparent en álle banden verdwijnen.

### Twee cascade-verliezen die alleen `getComputedStyle` verraadt

Na de eerste implementatie waren twee van de vier banden Δ0. Beide declaraties zien er los prima uit:

- `.leerpad-section { background: transparent }` — **gelijke** specificiteit aan `.section-band`, maar ~480 regels later in hetzelfde bestand. Bronvolgorde besliste.
- `[data-theme="light"] .homepage-newsletter { background-color: var(--color-bg-modal) }` — herhaalde letterlijk zijn eigen basisregel (`--color-bg-modal` is zelf al thema-afhankelijk), maar deed dat op (0,2,0) en versloeg daarmee de band. Pure redundantie die toevallig zwaarder woog.

De sample-pagina's houden hun verf via `.sample-hero-form.homepage-newsletter` (0,2,0) en zijn byte-identiek geverifieerd: `#161b22` dark / `#ffffff` light, eigen randen, geen band-klasse.

### Bewijs

- **26/26 groen** over chromium/firefox/webkit voor het nieuwe blok. De `max()`-met-custom-property is apart op firefox+webkit gecontroleerd — dat was het enige echte cross-engine-risico in de diff.
- De **eerste testrun gaf 5 rood** omdat `playwright.config.js:32` standaard tegen *productie* draait (`BASE_URL || 'https://hacksimulator.nl'`). Geen bug maar een gratis nulmeting: productie is de oude code en reproduceerde exact de cijfers van vóór de wijziging.
- **Mutant "band == pagina"** → ritme-assertie rood met **2392px (2,66)** en **3070px (3,78)**: cijfer voor cijfer de oorspronkelijke meting.
- **Mutant "band == `#161b22`"** → alleen de kaart-Δ-assertie rood, ritme blijft groen. Dat bewijst dat die assertie niet overbodig is: zij ving mijn eigen eerste ontwerpfout. Light bleef groen omdat de mutant alleen het dark-token raakte — één thema testen had de bug doorgelaten (zelfde les als Sessie 215/217).

**Zwakte in mijn eigen assertie, gevonden door de mutant.** Ik ankerde de ritmemeting eerst op "de reeks die `results-section` bevat". Verliest die sectie haar band, dan slokt die reeks de hele pagina op en meet de assertie stilzwijgend een staartje — hij ging groen op een pagina die kapot was. Nu knip ik op DOM-positie, wat niet kan dissolven.

### De tweede vraag: juridische sample op de homepage — nee

Beantwoord zonder werk, met de meting erbij:

- De homepage eindigt **al met drie opeenvolgende asks** (final-cta → lead-magnet → nieuwsbrief). Een vierde verzwakt ze alle vier, en twee samples naast elkaar dwingen een keuze op het moment dat je nul wrijving wilt.
- De north-star van deze pagina is *activation*, niet e-mail (`docs/launch-success-metrics.md:39`); lead magnets zijn trechterstap 6.
- De asymmetrie is echt maar niet homepage-vormig: **17 inkomende links naar de pentest-sample tegen 1 naar de juridische** (alleen de chip op `gidsen.html:444`). De natuurlijke plek zijn de drie juridisch-getinte blogposts (`wat-is-ethisch-hacken`, `ethisch-hacker-worden`, `social-engineering`) die `gidsen.html:457-459` zélf al als juridische achtergrond labelt maar die alle drie naar de *pentest*-sample linken.
- **Zwaarst:** `docs/newsletter/brevo-setup-sample-juridisch.md:9-10` zegt dat stap 2+3 (template + automation) niet af zijn, terwijl `sample-juridisch.html:132` belooft *"We mailen 'm ook zodra je je inschrijving bevestigt"*. Meer verkeer daarheen schaalt een niet-nagekomen belofte.
- Er staat bovendien een poort op dit werk: `.claude/plans/lead-magnet-followup.md:13-15` hervat lead-magnet-werk pas bij ≥5 Brevo-contacten óf ≥50 GA4-pageviews/maand op `/sample-pentest.html`.

**Los gat, vastgelegd niet opgelost:** `index.html` bevat **nul** links naar `/gidsen.html` — de enige pagina die beide samples symmetrisch behandelt is vanaf de drukste pagina alleen via de navbar bereikbaar.

### De rode test was niet van mij (gemeten, niet beweerd)

De 12-spec-run over drie motoren gaf **413 passed / 1 failed / 15 skipped**. De faler: `performance.spec.js:480` (VFS-groei) op firefox. Twee servers ernaast gezet (`d0ba157` op 8898, `e7cc0c4` op 8899), 5× per kant serieel: **5/5 groen op beide**, identiek. En CSS kan onmogelijk beïnvloeden hoeveel bytes `touch` naar localStorage schrijft. Hij viel alleen tijdens een run waar ik zelf twee extra Playwright-runs naast had gezet — dezelfde belasting-naast-de-meting als Sessie 218.

**Maar de overlever verklaren leverde iets ergers op:** die test asserteert serieel helemaal niets. De `avgGrowth === 0`-guard op regel 530 (bedoeld tegen 0/0 = NaN) zet "er is niks gemeten" om in "geslaagd" — **10 van de 10 seriële runs namen die tak**, met `hacksim_filesystem` onaangeroerd terwijl `persistence.js:13` diezelfde sleutel gebruikt. Hij wordt pas een echte assertie onder load, en is dán variantie-gevoelig. Vastgelegd als openstaande diagnose (TASKS.md #62), niet als baseline.

### De console-fout die ik bijna als bug rapporteerde

Tijdens dat onderzoek gaf `terminal.html` op mijn lokale server: *"The requested module '../gamification/certificate-templates.js' does not provide an export named 'CERT_DISCLAIMER'"*. Oude code: 0 fouten. Productie: 0 fouten. JS byte-identiek (`diff -rq` leeg), werkmap schoon, en de export staat gewoon op regel 21.

De verklaring stond in onze eigen regels. Warme fetch: **1603 bytes zonder** de export. Cache-bustende fetch: **2157 bytes mét**. Mijn MCP-debugbrowser hield een `certificate-templates.js` van vóór commit `feea49e` (Sessie 208, toen het bestand 1611 bytes was) vast — exact de val die `.claude/rules/architecture-patterns.md` §Cache Strategy beschrijft: *"Verifieer een submodule-fix altijd tegen een no-store server of via `import('…?cb='+Date.now())`, nooit tegen een warme browser."* De server stuurde keurig `no-store` en 40/40 curl-opvragingen gaven 2166 bytes; het was puur de browser.

### Metrics

| | Vóór | Ná |
|---|---:|---:|
| Langste oppervlak-reeks onder cijfers @1440 | 2390px | 949px |
| Idem @375 | 3078px | 913px |
| Band vs. pagina (dark / light) | 2 / **0** | 8 / 12 |
| Kaart vs. band (dark / light) | 3 / 7 | 6 / 19 |
| `test()`-declaraties | 288 | 290 |
| Bundel (limiet 1120 KB) | 1091,02 KB | **1093,90 KB** (marge 2,3%) |

⚠️ **+2,88 KB terwijl de diff nétto CSS-regels verwijdert.** Het commentaar dat beide bugs vastlegt is langer dan de code die het vervangt. Bewuste keuze — die twee rekensommen zijn precies wat een volgende sessie anders opnieuw moet ontdekken — maar de marge is nu 2,3% en de volgende wijziging tikt het alarm aan. Dan is de vraag niet "hoe knip ik bytes" en zeker niet weer een bump: 1000 → 1050 → 1100 → 1120 is drie bumps in 15 sessies.

### Volgende stappen

- `performance.spec.js:480` diagnosticeren (TASKS.md #62) — waarom persisteert `touch` in de testcontext niets?
- Overwegen om `index.html` één contextuele link naar `/gidsen.html` te geven (wayfinding, geen extra ask).
- De juridische Brevo-automation afmaken óf de belofte op `sample-juridisch.html:132` verzachten, vóór er meer verkeer heen gaat.

---

## Sessie 218: De strook onder de terminal was AdSense-vulling die AdSense vijf maanden overleefde (09 aug 2026)

**Mission:** Heisenberg vroeg of alles onder de terminal-simulator nog nodig was, nu er geen advertenties meer zijn — met de opdracht grondig te analyseren, vragen te stellen en de keuze te beargumenteren. Verwijderen, laten staan of iets anders eronder zetten waren alle drie open.

**Commits:** `9b44314` (gepusht)

### De herkomst besliste de vraag

Dit was geen smaakkwestie zodra de git-historie erbij lag:

| Commit | Datum | Titel |
|---|---|---|
| `f748c38` | 1 mrt 2026 | *"enrich noscript fallbacks for SEO and **AdSense crawlability**"* — voegde de 131 regels + de stylesheet toe, met cache-buster `?v=108-adsense-content` |
| `1cc04ff` | 4 mrt 2026 | *"full-viewport terminal + scroll hint **for AdSense content**"* — bericht: *"Education content stays below the fold, fully crawlable by AdSense"* |
| `feea49e` | Sessie 208 | *"Feat: advertenties eruit"* — 44 advertentieblokken uit 20 bestanden, €0 opbrengst tegen 251,7 KB third-party |

De aanleiding stond zelfs expliciet in `.claude/plans/monetization-C-content-seo.md:96`: *"Thin content penalty: <1000 woorden = Google ignores"*. Die drempel was van een advertentienetwerk dat sinds Sessie 208 niet meer bestaat. De strook is daarna nooit heroverwogen — en, zo bleek, ook nooit gemeten.

**Let op:** de 100vh-terminal komt uit dezelfde commit. Ook die vorm is dus AdSense-erfgoed. Bewust níét teruggedraaid: voor een app-oppervlak is een groot terminalvenster gewoon goed, en dat is een aparte vraag.

### Nulmeting op productie (1280×800)

| | Vóór | Ná |
|---|---:|---:|
| Hoogte strook | 2424px | **1784px** (−26%) |
| Aandeel van de pagina | 65% | 58% |
| Pagina totaal | 4,67 schermen | 3,87 |
| Links | **3** | 12 |
| `<h1>` op de pagina | **0** | 1 |
| Woorden | 396 | 284 |

De drie links zaten allemaal in het láátste blok, na vier schermen scrollen. De zes command-kaarten noemden `nmap`, `hashcat` en `sqlmap` bij naam en waren geen link. Het was een doodlopende weg met een uitgang op de achterdeur.

### "Alle drie de rollen" was het probleem, niet het antwoord

Heisenberg dacht dat de pagina app-oppervlak, doorstroom én SEO-landingspagina tegelijk was. Dat is precies waarom de strook was wat hij was: hij probeerde drie dingen en deed ze alle drie slecht. Tegenbewijs per rol:

- **Onboarding:** staat vier schermen ónder de plek waar onboarding nodig is, terwijl de terminal het zélf zegt op het juiste moment — `src/ui/onboarding.js:196` print `[→] Typ 'next' om te beginnen`, de placeholder zegt hetzelfde, en `next.js`/`leerpad.js` bestaan als commands. Erger: `.scroll-hint` staat onder 768px op `display: none` (bewuste keuze Sessie 176 wegens botsing met `#mobile-quick-commands`), dus mobiel weet niet eens dat er iets onder staat.
- **Doorstroom:** 2424px met drie links, geen daarvan naar `/commands/` terwijl er een blok "Populaire commands" stond.
- **SEO:** de enige echte rol — maar de pagina had nul `<h1>`, en de tekst was geschreven om een advertentiedrempel te halen, niet om een zoeker te beantwoorden.

**Rangschikking i.p.v. gelijkwaardigheid.** De gedocumenteerde north-star van deze pagina is *activation-rate* — `docs/launch-success-metrics.md:44`: "typte de bezoeker een command", niet "las hij iets". Alle site-brede CTA's wijzen hiernaartoe, en alle monetisatie (Brevo, Ko-fi, lead magnets) staat op `index.html`; `terminal.html` heeft in eigen markup nul CTA's. Dus: app-oppervlak eerst, SEO een echte maar secundaire bijrol, en "onboarding onder de vouw" is geen rol maar een bug.

### Wat er is gebeurd, per blok

| Blok | Beslissing | Grond |
|---|---|---|
| Intro | `<h2>` → **`<h1>`**, ingekort naar 38 woorden | De pagina had er nul; deze alinea neemt bovendien de grootste beginnersangst weg ("je kunt onmogelijk per ongeluk echte systemen aanvallen") |
| Populaire commands | Kaarten → links naar `/commands/#cmd-X` + CTA | Dubbelde `/commands/` en bevatte nul links. De ankervorm was al site-brede conventie (12× `#cmd-nmap` vanuit blogposts) |
| Zo begin je | **Geschrapt** | De terminal zegt het zelf, op het juiste moment |
| Veelgestelde vragen | Ongemoeid | Dichtste inhoud per pixel (160 woorden / 372px); schema-gebonden |
| Lees meer op onze blog | → "Verder lezen", 2 kolommen, +woordenlijst +gidsen | Enige werkende uitgang; 450px voor 25 woorden was de dunste inhoud van de strook → 315px |

"Bekijk alle **40+** commands", niet "41": `scripts/validate-docs.sh:432` handhaaft een site-brede `N+`-vloer, en het plan had hier per ongeluk een exact getal in staan.

### Drie pre-existing bugs die bovenkwamen

1. **Alle drie de bloglabels waren verlopen.** `"Wat is Ethisch Hacken? - Alles wat je moet weten"` tegen een `<h1>` die *"Wat is ethisch hacken?"* luidt; `"Terminal Basics voor Beginners"` tegen *"Terminal commands voor beginners"*; `"Nmap Beginnersgids - Netwerk Scanning Uitgelegd"` tegen *"Netwerk scanning met Nmap: beginnersgids"*. Alle drie bovendien in Engelse Title Case. De homepage heeft hier een test voor (`homepage-conversion.spec.js:311`), terminal.html niet — dus dreven ze stil weg.
2. **Zonder JavaScript stond de hele strook op `opacity: 0`.** `.edu-command-card`, `.terminal-edu-faq .faq-item` en `.terminal-edu-blog-links a` starten verborgen en worden alleen zichtbaar als de IntersectionObserver `.visible` toevoegt. `index.html:62-66` heeft daar een `<noscript><style>`-vangnet voor; terminal.html heeft het nooit gekregen. Dat maakte élke link erin waardeloos zonder JS — en ik stond op het punt er negen bij te zetten.
3. **`WebPage.name`, `<title>` en de zichtbare kop waren drie verschillende strings.** `WebPage.name` is nu woordelijk gelijk aan de nieuwe `<h1>`.

### Eén bug van mezelf, gevonden door te meten

De nieuwe CTA "Bekijk alle 40+ commands" mat als kale tekstlink **193×22px** op 375px — onder de 44px WCAG AAA-tikdoelgrens. Nu 217×46 via `display: inline-block` + verticale padding, met de onderstreping op `text-decoration` in plaats van `border-bottom` (een border zou met de padding meeschuiven en 11px onder de tekst landen). Assertie toegevoegd, mutant-bewezen.

### Instrumentatie: het cijfer dat vijf maanden ontbrak

Er bestond site-breed **geen enkel scroll-event** (`grep scroll_depth|scrollDepth` in `src/**/*.js` = niets). NEW `edu_section_reached` vuurt zodra de strook in beeld komt, één keer per paginaweergave. Gedeeld door de `page_view` op `/terminal.html` geeft dat de doorscroll-rate.

Bewust een **eigen module** (`src/ui/edu-visibility-tracking.js`) en geen uitbreiding van `src/ui/faq.js`: die is een klassieke IIFE onder `<script defer>` en kan `events.js` dus niet importeren, én wordt ook door `index.html` en `contact.html` geladen — hem tot module maken verandert de uitvoeringssemantiek op twee pagina's die hier niets mee te maken hebben. De analytics-aanroep is omhuld met `typeof … === 'function'` tegen de submodule-cache-mismatch uit Sessie 214.

### Eigen meetfout, hardop gecorrigeerd

Mijn contrastmeting gaf eerst onzin (1,42:1). Oorzaak: **`getComputedStyle` geeft een live object terug.** Ik zette het thema terug naar dark vóórdat het resultaatobject werd opgebouwd, dus `cs.color` las de dark-kleur — tegen een achtergrond die ik wél als momentopname had geparsed. Met echte momentopnames:

```
.edu-command-card code, light, 19,8px/700 (telt als GROTE tekst → lat 3 / 4,5)
  vóór: #16a34a op #ffffff        3,30:1   ← haalde AA wél, AAA niet
  ná:   --color-text op #ffffff  19,80:1
dark:   #9fef00 op rgb(30,35,42) 11,19:1  (ongewijzigd)
```

Twee dingen die ik bijna fout in een codecommentaar had gezet: de waarde is **3,30**, niet de 3,10 uit `architecture-patterns.md` §10 (die is tegen `--color-bg` gemeten, een laag lager — de kaart is `#ffffff`), en het is **grote tekst**, dus "onder AA" was alarmerender dan waar. De fix blijft juist (dit project voert AAA), maar de reden in het commentaar moest de gemeten reden worden.

### Verificatie

- **8 nieuwe asserties × 3 motoren groen** (`tests/e2e/terminal-seo.spec.js`) — de eerste asserties ooit op de content ónder de terminal. Vóór deze sessie gaf grep op `terminal-education|edu-command-card|scroll-hint|faq-terminal` in `tests/` **nul** hits; precies daarom konden de drie bugs hierboven stil ontstaan.
- **Zeven mutanten geplant, zeven rood**, na herstel weer groen. De ene overlever is nagelopen in plaats van weggeredeneerd: "elke link wijst naar een bestaande pagina" bleef terecht groen bij een kapot `#cmd-nmapx`, want die test stript de hash — het ankerbewijs is de taak van de test die wél rood ging.
- **Gerichte suite over drie motoren: 145 passed / 2 failed.** Beide falers zijn dezelfde `responsive-breakpoints.spec.js:209` (navbar) op firefox+webkit — en **géén regressie**: serieel gemeten tegen `git archive HEAD` op een tweede poort **32/32 groen**, 8× per motor per kant, met tijden die op 0,1s gelijk zijn (50,6 vs 50,7s / 35,4 vs 35,5s). Het is contentie: die test wacht 10s op een JS-geïnjecteerde navbar en haalt dat niet met drie browsers tegelijk.
- **Mijn eerste A/B was zelf besmet** — die draaide terwijl de achtergrondrun nog liep en gaf 4 rood / 1 rood, wat er als een regressie uitzag. De tijden verraadden het (1,0m vs 32s voor hetzelfde werk). Opnieuw gemeten zonder belasting.
- `bash scripts/validate-docs.sh` → exit 0. CSP gecontroleerd in `netlify.toml` (`style-src 'unsafe-inline'` staat toe wat de `<noscript><style>` nodig heeft — het lokale testserver-pad zou dat níét hebben laten zien).
- Beide thema's visueel gecontroleerd, en 360/375px op horizontale overflow (nul) plus tikdoelen (nul onder 44px).

### Metrics delta

| | Vóór | Ná |
|---|---:|---:|
| Spec-bestanden | 36 | **37** |
| `test()`-declaraties | 280 | **288** |
| Sitetotaal (drift-alarm) | 1087,05 KB | **1091,02 KB** / 1120 |
| terminal.html | 24.186 B | 24.262 B |
| terminal-education.css | 8.264 B | 9.718 B |

**Dit levert geen bytes op — het kost er ~3,3 KB.** De winst is hoogte, links en meetbaarheid. Dat hoort ook zo gelezen te worden: "content weghalen" klinkt als een besparing en is het hier niet, omdat de vervanging uitleg, een noscript-vangnet en een trackingmodule draagt. Terminal Core wordt niet geraakt door de CSS (die staat alleen op `terminal.html`), en `performance.spec.js:136` telt sowieso `index.html`, niet `terminal.html`.

### Next steps

1. **Search Console-data voor `/terminal.html`** (TASKS.md #59). Bepaalt of de strook verder mag krimpen of juist een echte landingstekst verdient. De gekozen snitten hangen er niet van af — wat weg is ging weg wegens dubbeling en doodlopendheid, en juist de twee blokken mét zoekwaarde staan er nog.
2. **`responsive-breakpoints.spec.js:209` bestand maken tegen parallelle runs** (TASKS.md #60). Bewust niet stilzwijgend verruimd in deze sessie.
3. **De mobiele blinde vlek** (`.scroll-hint` `display: none` <768px) pas aanpakken als `edu_section_reached` heeft gemeten hoeveel mensen er sowieso komen.
4. **Niet gedaan, bewust:** de FAQ ontdubbelen tegen `index.html` (twee van de vier vragen overlappen in intentie met de acht daar) — aparte SEO-afweging met eigen schema-risico. En: reken de FAQPage níét als rich-result-opbrengst; Google beperkte FAQ rich results in aug 2023 tot gezaghebbende overheids- en gezondheidssites. Dat staat nu ook in `docs/seo-launch-checklist.md`.

---

## Sessie 217: Vier pre-existing punten opgeruimd — en drie van de vier vastgelegde metingen klopten niet (09 aug 2026)

**Mission:** Vier dingen stonden in de repo als "gemeten, gedocumenteerd, nooit gefixt" — één sinds Sessie 189. Heisenberg vroeg ze af te handelen, met de expliciete opdracht om te zeggen wanneer een vastgelegde meting níét klopt in plaats van hem over te nemen. Bij twee punten was "dit is geen bug" een geldige uitkomst, mits gemeten.

**Commits:** *(zie TASKS.md §Sprint)*

### De uitkomst in één tabel

| Punt | De notitie zei | De meting zegt |
|---|---|---|
| (a) 76px reserve | 9 pagina's, zichtbaarheid onbekend | **Bug** — 16,39:1 seam in light; index.html doet mee met 11px → **10 pagina's** |
| (b) Badge-contrast | 3,10:1 bij 14,4px, "voldoet nog niet" | **Bug, en de notitie was te gúnstig** — 2,85:1 (2,74 op de hero) bij 13,5/10,4px; light-only |
| (c) Terminal-overflow | open sinds Sessie 189 | **Geen bug** — al gefixt op 07 jul door commit `3d7df13` |
| (d) Budget 1100 KB | 1,4% marge | Bevestigd; fixes kosten ~2 KB, dus het was puur een beleidsvraag |

Heisenberg wantrouwde de metingen van (a) en (b). Bij (b) klopte dat wantrouwen in de diagnose maar niet in de richting: de badge haalt AAA niet, hij haalt zelfs **AA** niet. De "geen bug"-uitkomst kwam bij (c) vandaan.

### (a) De reserve was zichtbaar, en op één pagina meer dan genoteerd

`body.landing-page { padding-bottom: 76px }` wordt geverfd met de **body**-achtergrond. In light is dat `#f8f8f8` tegen een footer van `#1a1a1a` — 16,39:1, een onmiskenbare witte strook onder de donkere footer. In dark 1,04:1 en dus onzichtbaar; het is een light-only defect. Screenshot van `/over-ons.html` @390x844 bevestigt het visueel.

Nieuw t.o.v. de notitie: **index.html heeft hem ook.** De reserve is 76px en de balk 65px — die 11px slack is precies wat er op maximale scroll overblijft. Dus 76px op negen pagina's plus 11px op de tiende.

**Zelfcorrectie tijdens het meten.** Mijn eerste aflezing gaf `balkState: verborgen` op maximale scroll, wat de strook veel groter zou maken. Dat was een stale read: na 2 rAF had de IntersectionObserver-callback nog niet gevuurd, dus ik las de staat van `y=0` af. Met 300ms settle staat de balk daar `zichtbaar`. Die settle staat nu in de test.

**Fix: de reserve verhuist naar de footer** in plaats van te verdwijnen. De footer is donker in beide thema's, dus de ruimte wordt donker geverfd; met `:has(.mobile-cta-bar)` krijgen balkloze pagina's hem helemaal niet. Dat lost beide gevallen met één regel op.

De reden dat de reserve op de body stond, was dat hij **onvoorwaardelijk** moest zijn: beweegt hij mee met `data-state`, dan verandert de documenthoogte bij elke toggle → scrollsprong → herbeoordeling → terugkoppellus. `:has()` op de *aanwezigheid* van het element is statisch, maar dat is een bewering tot je hem meet — gemeten documenthoogte **9481 / 9481 / 9481** over `zichtbaar → verborgen → zichtbaar`. Staat nu als eigen test.

Specificiteit (0,3,1) verslaat `.landing-footer` (0,1,0) uit mobile.css ongeacht laadvolgorde, dus geen `!important`. Bijvangst: `env(safe-area-inset-bottom)` werd dubbel geteld (body-padding + footer-padding) en nu één keer.

### (b) De contrastmeting was tegen de verkeerde achtergrond — en te gunstig

`.eyebrow-badge` heeft een **eigen** `background: var(--eyebrow-bg)`, en dat is een rgba. De tekst ligt dus op de compositie van badge-achtergrond over paginakleur:

```
light            #16a34a op rgb(230,241,234)    2,85:1   ← de echte waarde: onder AA
light op de hero (radial glow = laag drie)      2,74:1
dark             #9fef00 op rgb(20,28,22)      12,26:1   ← ruim boven AAA
vs paginabg      #16a34a op #f8f8f8             3,10:1   ← reproduceert de notitie exact
```

Dat de 3,10:1 exact reproduceert tegen `--color-bg` is het bewijs voor de diagnose. De valstrik: `getComputedStyle(el).backgroundColor` geeft `rgba(22,163,74,0.08)` — geen kleur waar je tegen kúnt meten — en wie dan naar de paginakleur grijpt, meet de laag ónder de verf.

Ook de genoteerde font-size klopte niet: 14,4px zou `0.8rem × 18px` zijn. Gemeten is het **13,5px** (desktop) en **10,4px** onder 768px, waar `--font-size-base` naar 16px zakt én de badge zelf naar `0.65rem`. Beide zijn normale tekst, dus er was geen large-text-uitzondering om op te leunen.

**Fix:** `--eyebrow-text`-token naast de bestaande `--eyebrow-bg`/`--eyebrow-border` — merkgroen in dark (12,26:1), `--color-text` in light (17,12:1). Eén token, tien badges op negen pagina's erven mee. Rand en tint blijven groen, dus de badge blijft herkenbaar.

`#14532d` (green-900, 7,87:1) was het alternatief dat het merkgroen behoudt; afgewezen op marge — 12% boven AAA zakt eronder zodra iemand de alpha van `--eyebrow-bg` aanraakt, en dit project heeft net laten zien hoe stilzwijgend zo'n getal rot.

### (c) Al gefixt op 7 juli; de notitie was een maand stale

Verse meting op `/terminal.html` @375px (`clientWidth` 360 door een 15px scrollbar): container left 10 / **width 340** / right 350 → **overflow 0**. Idem over 320/360/375/390/414/768 in dark én light.

`git log` op `styles/mobile.css` wijst de fix aan: commit **`3d7df13` (2026-07-07)**, titel letterlijk *"fix(mobile): terminal-container 10px horizontale overflow op ≤768px"*, die `width: auto` toevoegde. De melding is van 30 juni; de fix kwam een week later en het item bleef daarna nog vijf sessies open staan.

De schijnbare tegenstrijdigheid in de notitie ("375px" in de titel, `docW 360` in de meting) is dezelfde meting vóór en ná aftrek van de scrollbar.

**Waarom het zo lang bleef staan:** er was site-breed geen enkele horizontale-overflow-assertie op `/terminal.html`. Een notitie meldt niet terug dat hij niet meer klopt. Dat gat is nu gedicht.

### (d) Budget: expliciet besloten, niet als bijvangst

Gemeten vóór de fixes: 1084,92 KB / 1100 KB — 15,08 KB vrij (1,37%). De fixes kosten samen ~2 KB (punt (c) kost nul bronbytes), dus ze pasten. De vraag was beleid, en die is expliciet beantwoord: **1120 KB**, 32,95 KB vrij (2,94%) — hetzelfde ~3%-argument als Sessie 214, die bij 1069,20 KB naar 1100 ging.

Bij de bump staat nu een waarschuwing: dit is de **derde bump in 14 sessies**. Nog een keer zonder discussie maakt er een ratel van in plaats van een grens.

Bijvangst: de testnaam luidde `Bundle size < 1000KB` terwijl de limiet al twee keer was opgehoogd — precies dezelfde staleness als de notities die deze sessie opruimde. De naam interpoleert nu de constante.

### Tests — alle drie tweezijdig bewezen

| Mutant | Uitkomst |
|---|---|
| Reserve terug op de body | **12 rood / 2 groen** — en die 2 zijn groen om principiële redenen |
| Badge-kleur terug naar `--color-cta-primary` | **10 rood, allemaal in light**, allemaal exact 2,85:1 |
| `width: auto` weg uit mobile.css | **6 rood**, elk met `MAIN#terminal-container` benoemd |

De twee overlevers van mutant 1 zijn nagelopen in plaats van weggeredeneerd: `@1280px` valt buiten de `≤1279px`-band waar de reserve leeft, en de terugkoppellus-test bewaakt een andere eigenschap (de oude code was óók onvoorwaardelijk). Beide horen groen te zijn.

Mutant 3 gaf op 360px letterlijk `container left 10 / width 360 / right 370 bij clientWidth 360, overflow 10` — **cijfer voor cijfer de notitie uit Sessie 189**. Dat is meteen het bewijs dat de assertie die er had moeten staan de bug wél had gezien.

Mutant 2 is licht rood en donker groen: één thema testen had de bug doorgelaten. Zelfde les als §9 van de rules.

**Eén valse faler onderweg, en waarom hij vals was.** `/404.html` gaf 1px onbedekte ruimte. Doorgemeten: de documenthoogte is fractioneel (body 1308,5px) terwijl `scrollHeight` naar boven afrondt, dus scrollen naar de bodem schiet tot 1px door. `Math.round(0.5)` maakte daar 1 van. De assertie meet nu exact en eist `< 1`; een echte regressie is 76 of 11 en komt daar niet bij in de buurt.

### Verificatie

Volle suite tegen `nostore-server.py`: chromium **343✓/2✘**, firefox **341✓/2✘**. WebKit is na 85✓/0✘ afgekapt — zijn resterende wachtrij betrof vrijwel geheel `/terminal.html`, en dat bestand is ongewijzigd én laadt noch `landing.css` noch een van de tien aangepaste HTML-bestanden. In plaats daarvan gericht gedraaid wat de diff wél raakt: **88✓/0✘ op webkit** over `footer-reserve`, `homepage-conversion`, `hero-demo`, `gidsen-layout`, `navbar-collapse` en `lead-magnet`.

De twee falers per motor zijn `tutorial-mobile.spec.js:65` (chromium + firefox) en `responsive-ascii-boxes.spec.js:427` (firefox) — precies de bekende lijst. Geïsoleerd tegen `git archive HEAD` op poort 8898 gaven oud en nieuw **byte-identiek 101✓/3✘, met dezelfde testnummers 43/89/96**. Daarmee is "pre-existing" een meting.

**Twee rapportagefouten van mezelf, beide gecorrigeerd:**

1. Ik meldde twee `gamification`-falers als "onverklaard". Ze waren **flaky onder belasting**: de chromium-retries slaagden (`✓ 133`, `✓ 134`) en op firefox slaagden ze meteen. Ik telde `✘`-regels in plaats van uitkomsten — een `✘` is een mislukte póging, niet per se een mislukte test. De eindregel (`N failed` / `N flaky`) is de waarheid.
2. Mijn eerste `sed`-vervanging van de `**Last updated:**`-regel in CLAUDE.md raakte het **sjabloonvoorbeeld** in de `/summary`-sectie in plaats van de echte footer, omdat dat voorbeeld eerder in het bestand staat en het patroon niet aan regelbegin was verankerd. Teruggezet en beide regels gecontroleerd.

### Metrics

- **Bundel:** 1087,05 KB / **1120** KB — 32,95 KB vrij (2,94%)
- **Spec-bestanden:** 34 → **36** (`footer-reserve.spec.js`, `eyebrow-contrast.spec.js` nieuw)
- **Nieuwe asserties:** 3 testgroepen, elk met mutant bewezen
- **Aangeraakte bestanden:** `styles/landing.css`, 10× HTML (`?v=144`), `tests/e2e/performance.spec.js`, `tests/e2e/responsive-breakpoints.spec.js`, `.claude/rules/architecture-patterns.md`, `TASKS.md`

### Learnings

Zie `.claude/CLAUDE.md` §Recent Critical Learnings.

### De baseline per motor — er is er geen meer

De optionele vijfde taak alsnog gedaan. Uitkomst: **de vastgelegde baseline klopte op geen enkel punt, en na afloop is hij leeg.**

| Vastgelegd (Sessie 209 / startprompt) | Gemeten in Sessie 217 |
|---|---|
| 5× `tutorial-gestures` — "geen echte touch in headless" | **5× groen** op chromium én firefox. Verdwenen. |
| 1× `tutorial-mobile:65` — "briefing render timing" | Faalt in **alle drie** de motoren, maar niet door timing |
| 1× `responsive-ascii-boxes` — "live resize timing" | Faalt op firefox, maar niet door timing |
| `responsive-breakpoints:194` — firefox + webkit | Groen op chromium/firefox, **flaky op webkit** (3/12) |
| `autocomplete-filesystem:88` — firefox flaky | Groen |
| *(niet vastgelegd)* | `feedback:207` + `:233` — **structureel rood op webkit** |

**Geen van de falers was een omgevingsartefact.** De opdracht noemde "deze test meet iets dat headless niet kán" als geldige uitkomst; die categorie kwam niet één keer voor. Alle vier waren fouten in de test zelf:

1. **`tutorial-mobile:65`** verwachtte het woord `ping` in de briefing. Commit `c031d9d` (03 aug, "Terminal eerlijk maken") herschreef juist alle vier de objectives om het commando **niet** te verklappen — `'Gebruik ping om te controleren of ...'` werd `'Controleer of het doelwit 192.168.1.100 überhaupt bereikbaar is.'`. Twee dagen later noemde Sessie 209 de faler "briefing render timing". De assertie bewaakt nu de pedagogische invariant zelf: de briefing toont de opdracht en verklapt het commando niet. Mutant = de productwijziging terugdraaien → rood.
2. **`responsive-ascii-boxes:427`** zette viewport 375px en verwachtte box-tekens, terwijl zijn eigen Chromium-zuster drie regels hoger schrijft dat mobiel bewust zonder box-tekens rendert. Gemeten met `leerpad`: **0/6 op 375px, 6/6 op 1440px, in beide motoren**. Nu dezelfde desktop-viewport als die zuster. Mutant = viewport terug naar 375 → rood.
3. **`feedback:207` + `:233`** wachtten met een vaste `waitForTimeout(2500)` op een modal die zichzelf pas ná een eigen `setTimeout` van 2000ms sluit, herstelt én opnieuw koppelt (`src/ui/feedback.js:277`) — **500ms marge voor drie stappen**. Hield stand op chromium/firefox, liep op webkit in de testtimeout van 30s (gemeten 32-36s). Vervangen door een conditie-wacht; **0/2 → 8/8 groen**.
4. **`responsive-breakpoints:194`** deed `goto` op 1280px en resizede daarna naar 375px, terwijl `mobile.css` in terminal.html achter `media="screen and (max-width: 768px)"` hangt en dus pas ná die resize hoeft te laden — plus de navbar wordt geïnjecteerd, dus `.navbar-toggle` bestond soms nog niet. Viewport nu vóór de navigatie. **3/12 → 8/8 groen.**

**Meetfout van mezelf, hardop gecorrigeerd.** Ik mat `responsive-breakpoints:194` als "nieuw 0/6 rood, oud 3/6 groen" en noemde dat een mogelijke regressie van mij. Dat kon niet: ik had `/tmp/pre-change` ná de commit aangemaakt, dus poort 8898 serveerde mijn eigen commit. `md5sum` over `terminal.html`, `terminal.css`, `mobile.css`, `main.css` en `main.js` gaf **identiek** — er wás geen codeverschil om aan toe te schrijven. Een oud/nieuw-vergelijking is alleen bewijs als de twee kanten aantoonbaar verschillen.

### Volgende stappen

- De optionele vijfde taak is alsnog gedaan (zie de sectie hierboven). **Er is geen baseline van bekende falers meer** — alle vier bleken fouten in de test zelf en zijn gerepareerd, geen enkele was een omgevingsartefact. Voeg er dus ook geen nieuwe notitie toe: gaat er iets rood, dan is dat vanaf nu een echt signaal.
- De volle driemotorensuite is deze sessie niet in één keer uitgedraaid. Chromium en firefox wel (343✓ resp. 341✓), webkit apart (350 tests). Bij een volgende volledige run hoort de uitkomst **nul** falers te zijn; is dat niet zo, behandel het als regressie en niet als "bekend".

---

## Sessie 216: De CTA-balk verscheen waar hij niets toevoegde — en de guard die dat bewaakte, scrollde nooit (09 aug 2026)

**Mission:** Sessie 215 legde vast dat `.mobile-cta-bar` bij scrollpositie 0 overbodig is én chips afdekt, maar loste het niet op: de fix zou de conversiegarantie tijdsafhankelijk maken en de synchrone scroll-guard in `homepage-conversion.spec.js` breken. Heisenberg vroeg om dat alsnog uit te zoeken, te beslissen tussen IntersectionObserver en `position: sticky`, en te bouwen — met de guard minstens zo streng als hij was.

**Commits:** `2c1068e` (achterstallige Sessie 215-summary) · `00433e4` (balkgedrag) · `570d44c` (guard) — alle gepusht naar `origin/main`

### De beslissing: IO, en waarom sticky afvalt

`position: sticky; bottom: 0` lost de **plaats** van het probleem op, niet het mechanisme. Vier bezwaren, aflopend in gewicht:

1. Een sticky balk overlapt content nog steeds zodra hij plakt — hij doet het alleen niet meer op scrollpositie 0. Het dubbele-CTA-probleem blijft ook: hij plakt zodra zijn natuurlijke positie (net onder de hero) de onderrand raakt, en de hero-CTA staat op dat moment nog bovenin beeld.
2. Hij kost **65px echte flow-ruimte** — een gat pal na de hero.
3. Hij vraagt een DOM-herstructurering (sticky-bottom werkt alleen binnen een container die de rest van de pagina omspant), waarmee een monetisatie-element door de markup verhuist en `data-terminal-cta="sticky_mobile"` van betekenis verandert.
4. Zijn enige voordeel is "werkt in de synchrone test". Dat is winst voor de *test*, niet voor de bezoeker — en die herschrijving bleek geen kost maar een correctie.

### De echte keuze was de grens, niet het mechanisme

Drie kandidaat-regels, waarvan er maar één beide eisen **per constructie** waarmaakt:

| regel | "altijd een tikbare CTA" | "nooit twee identieke" |
|---|---|---|
| verbergen zodra de CTA het scherm raakt | breekt — een strookje van 1px is geen tikdoel | ok |
| verbergen pas bij volledig zichtbaar | ok | breekt — ~24px scrollvenster (halve knophoogte) waarin balk én CTA-midden aantikbaar zijn |
| **verbergen zodra het midden vrij is** | **ok** | **ok** |

Bij de derde geldt *balk verborgen ⟺ CTA-midden boven de balkrand ⟺ CTA-midden aantikbaar*. Verbergen en aantikbaarheid zijn dezelfde conditie, dus er is geen venster waarin beide zichtbaar zijn en geen positie zonder tikdoel. Bewezen met een sweep van **884-893 posities à 10px** per engine: nul gaten, nul dubbels, en in alle drie de engines hetzelfde wisselpatroon (5 wissels rond de hero-, mid- en final-CTA).

### Implementatie

- **`src/ui/landing-demo.js`** — `initCtaBar()` (~40 regels). IO is het "er is iets veranderd"-signaal; `middenVrij()` is de regel. Doelen: `a.btn-cta[href="/terminal.html"]` buiten de balk = hero/mid/final, precies de drie die het label "Start de simulator" delen. Bewust **niet** de leerpad-deeplinks en cijfertegels: die dragen een ander label, dus daar is geen duplicaat en blijft de balk nuttig als drager van het canonieke label. `navHoogte` uit `--navbar-height`; de balkrand leest de balk uit zichzelf (neemt `env(safe-area-inset-bottom)` mee, kan niet driften). Eén synchrone beoordeling bij init tegen een flits van één frame, plus een `resize`-listener.
- **`styles/landing.css`** — `.mobile-cta-bar[data-state="verborgen"] { visibility: hidden; opacity: 0 }` (0,2,0 verslaat 0,1,0 in hetzelfde blok). `visibility` en niet `display`, want de box moet meetbaar blijven voor de JS-regel; `opacity: 0` alléén zou een onzichtbaar tikdoel opleveren. `padding-bottom: 76px` blijft **onvoorwaardelijk**: conditioneel verandert de documenthoogte per toggle → scrollsprong → herbeoordeling → terugkoppellus.
- **`index.html`** — `?v=` gebumpt op `landing.css` (142→143) en `landing-demo.js` (1→2); commentaarblok bijgewerkt (het zei nog "zichtbaar t/m 768px", wat al niet meer klopte).

### Vier metingen die de fix schragen

1. **Zes maten, scroll 0:** hero-CTA-midden op y=306..361, balkrand vanaf y=602 (375×667) tot y=959 (768×1024) → `midVrij` op álle zes. De regel vuurt overal.
2. **Pagina-bodem:** balk staat op alle zes maten aan en dekt de volle 76px reserve — geen lichte strook onder de donkere footer.
3. **Toestelrotatie:** portret → landschap → scroll → terug; staat correct in alle vier, terwijl de `rootMargin` van de observer nog met portretwaarden liep. Dat is precies wat de "IO is alleen de trigger"-keuze moest opleveren.
4. **Zonder JS / reduced motion:** `data-state` niet gezet, balk `visible` opacity 1 (gedrag van vóór deze sessie); reduced motion → `transitionDuration: 0s`, mechanisme werkt.

### De guard was op drie punten blind

1. **Hij scrollde niet.** `html { scroll-behavior: smooth }` staat in `animations.css`, dus `window.scrollTo(0, y)` ánimeert. De oude lus zette dat 13× in één synchrone `page.evaluate`-tick; de animatie kreeg nooit een frame en `scrollY` bleef op **2px** steken. Die test asserteerde dertien keer dezelfde ongescrollde pagina — een zwaardere blinde vlek dan "IO vuurt niet in een synchrone lus", want ook de oude meting was al blind.
2. **Hij mat bounding boxes.** Een `visibility: hidden` balk heeft nog steeds een box van 65px.
3. **Hij was synchroon**, waardoor een IO er per definitie nooit kon vuren.

**"Even streng" is een meting geworden.** Op één mutant (balk onvoorwaardelijk `visibility: hidden`) is de oude guard **3× groen** en de nieuwe **3× rood**, met zes benoemde posities. Zelfde raster van 0,9 viewport, dus dezelfde posities als zijn voorganger; het predicaat is strikt sterker.

### Bug die ik zelf introduceerde en zelf ving

`.btn-cta` draagt `transition: all` en erft `visibility` van de balk — met `all` loopt die overerving als transitie mee. Gemeten: na het omklappen meldt de balk `hidden` terwijl de knop nog `visible` is (onzichtbaar tikdoel dat wél reageert), en andersom een zichtbare balk waar een tik niets doet. Na 400ms lopen ze weer gelijk. Twee spiegelbeeldige gaten van ~150ms die alleen bestaan ná een toestandswissel, dus geen meting "in rust" ziet ze. Mijn plan claimde letterlijk dat beide richtingen "naar de veilige kant falen" — dat was precies verkeerd om. Fix: `transition-property: opacity` op de knop in de balk.

### Tests

- `hero-demo.spec.js` — `BASELINE_BEDEKT` naar `[]` op alle drie de maten; **360×800 toegevoegd** (stond in het commentaar, niet in de map, dus die conditie werd daar niet bewaakt). Test hernoemd van "blijft op de vastgelegde baseline" naar "dekt niets de suggestiechips af", plus een directe assertie op `data-state === 'verborgen'`. Die test is in Sessie 215 bewust als tikkende baseline neergezet en heeft nu teruggemeld.
- `homepage-conversion.spec.js` — guard async + hit-testing, twee helpers (`scrollposities`, `meetOpPositie`), plus NEW "de knop klapt mee met zijn balk, zonder na te lopen".

**Mutanten (elk nieuw assertie-paar bewezen):**

| assertie | mutant | uitkomst |
|---|---|---|
| guard strenger dan oud | balk altijd `visibility: hidden` | oud **3× groen**, nieuw **3× rood** |
| geen chip bedekt | `[data-state="verborgen"]` verbergt niets | rood op 360×800 + 390×844, **375×812 blijft groen** (exact de Sessie 215-meting) |
| geen dubbel label | idem | rood op y=0, 4386, 7310 — de drie CTA-zones |
| balk uit op scroll 0 | beslissing vastgezet op `'zichtbaar'` | 6/6 rood |
| knop loopt niet na | `transition-property` eruit | rood met `balk hidden, knop visible` |

Tegen de oude code (`git archive HEAD`, poort 8898) faalt de chip-test op de `waitForFunction` — dat bewijst "mechanisme afwezig", niet "de bedekkingsassertie ziet de bug". Daarom de CSS-mutant erbij, die de assertie zélf laat vuren.

### Vastgelegd, niet opgelost

**9 pagina's dragen `body.landing-page` (dus 76px reserve) zonder balk:** `over-ons`, `gidsen`, `contact`, `woordenlijst`, `commands/index`, `404`, `sample-pentest`, `sample-juridisch`, `sample-download`. Gemeten byte-identiek tegen `git archive HEAD` → pre-existing sinds Sessie 214, niet van deze wijziging. Zie TASKS.md #57.

**De hero-hint blijft uit op mobiel.** De reden om hem te verbergen (de balk dekte de chips af) valt weg, maar dezelfde notitie in `landing.css` zegt dat de hint een *desktop*-probleem oplost: met een muis lijkt het venster een plaatje, terwijl op een telefoon al zes knoppen onder de prompt staan. Bewust buiten scope; de assertie die het bewaakt blijft staan.

### Metrics

- **Bundle:** 1078,05 → **1084,92 KB** van 1100 (marge 21,95 → 15,08 KB, 2,0% → 1,4%). Mijn schatting was ~2 KB; het werd +6,87 KB, vrijwel volledig commentaar. Ground truth `du -sb`: src 720 KB · styles 428 KB · blog 474 KB · assets 1737 KB.
- **Playwright:** 34 spec files, 273 → **274** `test()`-declaraties.
- **Volledige suite** tegen no-store server: chromium 313✓/1✘ · firefox 310✓/3✘+1 flaky · webkit **309✓/2✘**. Alle falers draaien op `/terminal.html` (dat geen van de drie gewijzigde bestanden laadt) en reproduceren byte-identiek tegen `git archive HEAD`.
- **Let op:** de eerste volledige run kapte af op mijn eigen `--global-timeout` van 2900s met "78 did not run" — dat leest in de samenvatting bijna als groen. WebKit apart uitgedraaid om die 78 alsnog een uitspraak te geven.

### Learnings

Zie `.claude/CLAUDE.md` §Recent Critical Learnings, Sessie 216.

### Volgende stappen

TASKS.md #57 — vier vastgelegde pre-existing punten, met startprompt in `/home/willem/.claude/plans/startprompt-pre-existing-bugs.md`. Twee daarvan dragen een meting die ik wantrouw (`.eyebrow-badge` 3,10:1 is tegen de páginaachtergrond gemeten terwijl het element een eigen achtergrond heeft; het terminal-overflow-item noemt 375px in de titel en `docW 360` in de meting). Bij beide is "dit is geen bug" een geldige uitkomst, mits gemeten.

---

## Sessie 215: Hero-terminal — uitlijning, focusrand en een cursor 317px van zijn eigen tekst (08 aug 2026)

**Mission:** Heisenberg leverde een screenshot met drie klachten over de hero-terminal uit Sessie 214: hij lijnt niet uit met de tekst ernaast, hij krijgt een blauwe standaardrand zodra je erin kunt typen, en niets nodigt uit om hem te gebruiken ("iets als 'try me' met een pijl"). Expliciet gevraagd: grondig analyseren en met advies komen.

**Commit:** `f567ebc` (gepusht naar `origin/main`)

---

### Analyse — alle drie gemeten op productie, niet beredeneerd

Metingen op `https://hacksimulator.nl/` bij 1830×1000 en 375×812, dark én light.

**(1) Uitlijning — een verrot magisch getal.** `.hero-terminal` droeg `margin-top: 3rem`. Bij de 18px root-font van dit project is dat 54px, niet 48. Dat getal was een handmatige optische centrering uit de tijd dat het venster 313px hoog was (header 37 + body 235 + invoerregel 41): het liep toen 194→507 en paste daarmee binnen de tekstkolom 140→568, met 54px lucht boven en 61px onder. Sessie 214 hing er `.hero-demo-bar` onder — **+152px gemeten** — waarmee het venster 468px werd en 194→662 liep: **94px ónder de tekstkolom uit**, terwijl de bovenkant nog steeds 54px te laag begon. Optische middens 74px uit elkaar. Klassieke magic-number-rot: een getal dat een *verhouding* codeerde, en de verhouding veranderde.

Horizontaal was er niets mis — rechterrand terminal 1576 = rechterrand navbar-CTA 1576 = contentrand. Dat is meteen gecheckt zodat het niet later als "ook nog" terugkwam.

**(2) De blauwe rand is van ons, niet van de browser.** `animations.css` heeft een sitebrede `:focus-visible { outline: 2px solid var(--color-info) }` en `landing.css:636` spiegelde dat met `.hero-terminal:focus-within`. `--color-info` = `#79c0ff` (dark) / `#0969da` (light). Twee losse problemen: systeemchroom om een zwarte hackerterminal, én `:focus-within` vuurt óók bij een muisklik — de terminal was daarmee het enige element op de site dat ná een klik een rand hield.

**De voor de hand liggende fix bestaat niet.** Ik wilde `:has(:focus-visible)` gebruiken zodat de rand alleen bij Tab verschijnt. Gemeten: `input.matches(':focus-visible')` is `true` ná een muisklik. Dat is spec-gedrag — tekstvelden tonen altijd focus-indicatie. `:focus-within` en `:has(:focus-visible)` zijn hier dus identiek; keyboard-only kán niet. De rand verschijnt hoe dan ook bij een klik, dus het antwoord is hem er *bedoeld* uit laten zien in plaats van hem te verbergen.

**(3) De affordance bestond al, de zin ontbrak.** Er staan zes tikbare chips onder het venster. Wat miste was copy die zegt dát het ding leeft: de enige regel in de buurt was `.hero-demo-uitleg` ("Proefversie met zes commands…") — een **disclaimer in dim grijs, helemaal onderaan**, dus het laatste wat je leest én geframed als beperking.

**(4) Defect gevonden tijdens het meten, niet gevraagd.** De knipperende `_` stond **317px van de linkerrand van het veld terwijl de tekst 155px breed was** — 162px leegte tussen de tekst en zijn eigen cursor. Sessie 214 maakte van `#typing-target` een `<span>` een `<input>` met `flex: 1`; die eet de hele regel en duwt de decoratieve cursor naar de rechterrand. Het leest als een renderfout, uitgerekend op het element dat "dit is een levende prompt" moet zeggen.

---

### Wat er is gebouwd

**A. Uitlijning** (`styles/landing.css`)
- `margin-top: 3rem` weg; nieuw blok `@media (min-width: 769px) { .hero-content { align-items: center } }`.
- **`align-self: center` op de terminal is een no-op** — geprototypeerd en gemeten: 140→608, ongewijzigd. De terminal (468px) is inmiddels zélf het hoogste flex-item en bepaalt dus de cross-size van de flexregel; het kórtere item (de tekst, 428px) moet bewegen, dus de regel hoort op de container.
- Eigen band i.p.v. de basisregel aanpassen: onder 769px klapt `.hero-content` naar `flex-direction: column` en stuurt `align-items` daar de *horizontale* as. Wederzijds uitsluitende ranges (architecture-patterns §4).
- Resultaat: middens 0,5px uit elkaar, en zelfonderhoudend bij elke volgende hoogtewijziging.

**B. Focustoestand** (`styles/landing.css`, ná het light-theme-blok)
- Rand + 1px ring + halo in `--terminal-demo-prompt`, plus een oplichtend groen vensterbolletje. `#9fef00` op `#000` = ~17:1, ruim boven de 3:1 van WCAG 2.2 SC 2.4.11.
- `outline: 2px solid transparent` blijft staan: forced-colors/High Contrast negeert box-shadows maar kleurt een transparante outline wél in.
- **Plaatsing is de crux.** `[data-theme="light"] .hero-terminal` (regel ~2185) zet óók `box-shadow` en is even specifiek (0,2,0). Bij gelijkspel wint bronvolgorde, dus de focusregel moest ná dat blok. Een pointer-comment staat op de oude plek zodat de volgende lezer hem vindt.

**C. Uitnodiging** (`index.html` + `styles/landing.css` + `src/ui/hero-repl.js`)
- NEW `.hero-terminal-col`-wrapper: `.hero-content` telt precies twee kolommen, dus een sibling van `.hero-terminal` zou een derde kolom worden.
- `↓ Deze terminal werkt echt — typ maar` erboven. Copy benoemt de aanname die de bezoeker maakt (*dit is een screenshot*), is waar, en wordt drie regels lager begrensd door de bestaande disclaimer. Uitnodiging, geen instructie.
- Verdwijnt bij overname (`is-taken` op de wrapper in `neemOver()`) via **`visibility`, niet `display`** — anders krimpt de kolom 29px en verspringt het venster ~15px onder de muis van wie er net op klikte. Anders dan `opacity: 0` haalt `visibility` de regel wél uit de toegankelijkheidsboom.
- Woorden in `--color-text`, alleen de pijl in `--color-cta-primary` (decoratief, `aria-hidden`): het CTA-groen meet **3,10:1** op de lichte paginaachtergrond bij 14,4px — onder AA, laat staan de AAA die dit project voert.

**D. Cursor** (`styles/landing.css` + `src/ui/landing-demo.js` + `src/ui/hero-repl.js`)
- In rust `flex: 0 0 auto` + `width: (len+1)ch`, per aanslag gezet in `setTyped()`. `ch` is exact: `--font-terminal` resolvet naar JetBrains Mono. Gat cursor↔tekst **162px → 18px**, precies één teken.
- Bij overname krijgt het veld de regel terug; `neemOver()` wist de inline breedte, want inline verslaat de stylesheet.

**E. Cache-correctheid** (`index.html`)
- `?v=1` op `landing-demo.js` (had er geen) en `hero-repl.js` `?v=1 → ?v=2`, `landing.css` 141 → 142. `/src/**/*.js` staat op `max-age=3600`: zonder dit krijgt een terugkerende bezoeker tot een uur nieuwe CSS naast oude JS, en typt de auto-demo in een veld van één teken breed.

---

### Twee regressies die ik zelf introduceerde en zelf ving

**1. Het tikdoel kromp van 309px naar 10px.** Het veld naar `1ch` krimpen maakte het klikdoel piepklein. WebKit miste hem zelfs met een gerichte `.click()` in de testrun. Erger dan testflakiness: wie rechts naast de prompt klikt — de hele lege rechterhelft van de regel — activeerde de terminal niet meer. Opgelost door de héle promptregel te laten overnemen (`pointerdown` op `.terminal-input-line`, met `preventDefault` zodat het veld de focus houdt) plus `cursor: text`. Dat is bovendien hoe een echte terminal werkt.

**2. De mobiele hint duwde drie chips onder de vaste CTA-balk.** De hint kost 30px. Op 375×812 verplaatste dat de tweede chiprij van midden-736 naar midden-764, terwijl `.mobile-cta-bar` vanaf y=747 vastzit: `nmap`, `whoami` en `pwd` werden onaantikbaar en een tik daar navigeerde wég van de pagina. Opgelost door de hint onder 769px te verbergen — een gemeten afweging, geen bezuiniging: de hint lost een *desktop*-probleem op (met een muis lijkt het venster een plaatje), terwijl er op een telefoon al zes knoppen onder de prompt staan.

Beide gevonden door een testfalen serieus te nemen in plaats van als flake af te doen (zie learnings).

---

### Vastgelegd, niet opgelost: `.mobile-cta-bar` dekt chips af

Heisenberg vroeg expliciet of er nog iets met de "pre-existing help chip bug" moest gebeuren. Gemeten over zes telefoonmaten met consent gezet (zodat dit de balk meet en niet de cookiebanner), telkens tegen `git archive HEAD` op een tweede poort:

| viewport | bedekt bij scrollpositie 0 | oud vs nieuw |
|---|---|---|
| 375×667 | chipmiddens buiten beeld (niets te bedekken) | identiek |
| 375×812 · 412×915 · 768×1024 | geen | identiek |
| 360×800 · 390×844 | `whoami`, `pwd`, `help` | identiek |

**Correctie op mijn eigen eerste rapportage:** ik meldde dit als "alleen `help`, op één maat". Het zijn drie chips op twee gangbare maten. Oud en nieuw zijn byte-identiek, dus deze wijziging veroorzaakt het niet — maar mijn beschrijving was te gunstig.

**Waarom niet nu gefixt.** De fix zit niet bij de chips maar bij de balk, en daar zit de klem. De balk is bij scrollpositie 0 aantoonbaar overbodig: de hero-CTA staat op élke gemeten maat al in beeld — op 390×844 zie je zelfs twee identieke groene "Start de simulator"-knoppen tegelijk. Maar hem daar verbergen vraagt een IntersectionObserver, en `homepage-conversion.spec.js:153` scrollt synchroon in één `page.evaluate` waar observer-callbacks nooit vuren: die guard zou de balk op élke scrollpositie als verborgen zien en rood worden terwijl er niets mis is. Je ruilt dan een grotendeels cosmetisch probleem in voor een tijdsafhankelijke conversiegarantie plus een herschreven conversietest. Het CSS-alternatief (`position: sticky; bottom: 0` in de flow ná de hero) heeft geen JS en geen timing, maar kost 65px echte flow-ruimte en verhuist een monetisatie-element in de DOM. Beide zijn een eigen afweging, geen bijvangst van een polijstsessie.

Verzachtend: de balk is 92% dekkend met blur, dus je ziet geen label dat je vervolgens misklikt — je ziet de balk. Rij 1 (`ls`, `cat notes.txt`, `nmap`) staat volledig in beeld en is precies het begeleide pad (`is-next` begint op `ls`).

Vastgelegd als **TASKS.md #56** en als `BASELINE_BEDEKT` per viewport in `hero-demo.spec.js` — die test wordt rood zodra de bedekking groeit, en zijn lijsten horen `[]` te worden zodra de balk gefixt is.

---

### Verificatie

- **105/105 groen** over Chromium + Firefox + WebKit (`hero-demo` + `homepage-conversion`), geen flakes. Gemeten tegen `scripts/nostore-server.py`.
- **9 nieuwe `test()`-declaraties** (12 tests door drie `for…of`-blokken), **elk met de mutant rood bewezen**: magische marge terug · `order` van de wrapper halen · focusregel vóór het light-blok (→ light rood, dark groen) · `flex: 1` terug op het veld · `display: none` i.p.v. `visibility` · promptregel-handler weg · hint tóch op mobiel.
- **Firefox-chiptest die ik brak:** 2/8 rood op nieuw, 0/12 op oud (tweede server) → oorzaak gevonden → 8/8 groen.
- `html-validate` identiek vóór/ná: 7 pre-existing meldingen, alleen regelnummers verschoven.
- `validate-docs.sh` exit 0.

**Metrics delta:** bundel 1069,20 → **1078,05 KB** (limiet 1100, marge 20,95 KB = 2,0%, was 2,9%). Specs 34 (ongewijzigd), `test()`-declaraties 264 → **273**. Groei +8,8 KB, waarvan `landing.css` +6,3 KB — grotendeels commentaar; de prosa is één keer uitgedund met behoud van elke meting en valkuil.

---

### Learnings

- **Het hoogste flex-item bepaalt de regel.** `align-self: center` op de terminal deed niets omdat híj het hoogste item is. Zonder `getComputedStyle`/geometrie had ik dit fout gehad — dezelfde klasse fout als de `flex-grow` die niemand had gezet (Sessie 213).
- **Twee thema's testen was hier geen netheid maar noodzaak.** De mutant bewees het: focusregel vóór het light-blok → **light rood, dark groen**. Eén thema testen had de bug laten passeren.
- **Een testfalen is een hypothese, geen ruis — maar ook geen bewijs.** De WebKit-flake wees op het 10px-tikdoel; de Firefox-flake bleek een echte regressie (2/8 vs 0/12 tegen de oude code). Omgekeerd waren twee kleine steekproeven met tegengestelde uitkomst (2/4 rood, dan 0/3 rood) géén conclusie — pas 8× per kant gaf een uitspraak.
- **Meet de vraag die telt, niet de vraag die makkelijk is.** Bij de chipbedekking was "ligt er iets overheen" niet genoeg; de vraag was "ziet de bezoeker een label dat hij vervolgens misklikt". Een screenshot beantwoordde dat (dekkende balk, geen leesbaar label) en veranderde het advies.
- **Eerste meting was fout op één maat.** Mijn `inBeeld`-check gebruikte de bounding box i.p.v. het midden, waardoor 375×667 "drie bedekte chips" gaf terwijl die middens gewoon buiten beeld lagen. Gecorrigeerd vóór het advies — `elementFromPoint` geeft `null` buiten de viewport, en dat is geen bedekking.
- **Wees expliciet als je eigen eerdere rapportage te gunstig was.** "Alleen `help`, op één maat" werd na doormeten "drie chips, op twee gangbare maten".

**Next steps:** TASKS.md #56 (`.mobile-cta-bar` koppelen aan "geen andere CTA in beeld") — startprompt is aan Heisenberg geleverd.

---

## Sessie 214: De hero-terminal doet nu iets — en de demo die er stond, loog over drie van de vier commands (08 aug 2026)

**Mission:** Twee rondes op de homepage. (A) De 9-staps conversietrechter uit `docs/landing-page-plan.md` tegen `index.html` leggen en de holle stappen vullen. (B) De hero-terminal interactief maken: hij toonde prompt, knipperende cursor en auto-typende commands — de sterkste interactie-uitnodiging op de pagina — en deed niets.

**Commits:** `0f2a306` (trechter) · `810f082` (hero-terminal)

---

### Ronde A — homepage-trechter (commit `0f2a306`)

Drie van de negen trechterstappen leunden op placeholders die terecht nooit geplaatst zijn ("1.200+ gebruikers" 2×, drie testimonials met naam en foto). De stappen eromheen zijn nooit opnieuw gevuld, dus stap 6 herhaalde alleen de trust-bar 2000px hoger en van stap 8 bleef alleen de bijlage over.

- **#results** 40+/100%/0/3 → vier tegels die elk linken naar de plek waar je het kunt natellen (`/commands/`, `/terminal.html`, `over-ons#verantwoording`, `/woordenlijst.html`). `over-ons#verantwoording` was 0× gelinkt.
- **CTA-woestijn 4179px (5,1 schermen)** tussen hero-CTA (y=303) en de eerstvolgende knop (y=4462) → `.mobile-cta-bar`, zelfde grens als de navbar-inklapband (1279px). In de navbar paste geen CTA: op 375px is er 112px vrij naast de merknaam (179px) en het label heeft 150px nodig.
- **Eén naam voor één actie**, site-breed 28 bestanden: 4 labels → "Start de simulator". Vijf lockstep-locaties, niet vier — de FAQ citeert het label letterlijk in zichtbare tekst én in de FAQPage-JSON-LD.
- **16 contentblokken leeg zonder JS** (`.animate-on-scroll` op `opacity:0`, alleen `landing-demo.js` zet `.visible`) → noscript-`<style>` in de head.
- **20 tikdoelen <44px → 0.** De leerpad-knop bleek een componentdefect: `.btn-cta-secondary` staat later in `landing.css` dan `.leerpad-btn` en won op laadvolgorde, dus de padding daar was al dode code.
- `validate-docs.sh` 10 → 12 checks. NEW `homepage-conversion.spec.js` (10 tests).

---

### Ronde B — interactieve hero-terminal (commit `810f082`)

**Nulmeting:** `#typing-target` was een `<span>`, `.hero-terminal` had **nul** tabbare elementen, geen input, geen contenteditable. `src/ui/landing-demo.js` typte een lus van vier canned commands.

#### De beslissing vooraf: geleid **óp** vrij, niet geleid **in plaats van** vrij

De vraag was of de hero een vrije mini-REPL wordt of een geleide demo, met als aanname dat geleid goedkoper is. Die aanname klopt alleen als "geleid" een scripted click-through zonder invoer betekent — en dat botst frontaal met wat de subtitel drie regels hoger belooft ("je kunt alles uitproberen"). De dure helft is de REPL-machinerie (input, echo, render, scroll, mobiel, a11y); de geleide laag is daarbovenop ~30 regels.

Gekozen: vrije REPL met de begeleiding als **zes tikbare chips**, die drie dingen tegelijk doen en daarom één systeem zijn in plaats van twee:
1. begeleiding — de eerstvolgende suggestie is gemarkeerd en schuift op na gebruik;
2. eerlijkheid — je *ziet* de grens van de demo: zes chips, meer is er niet;
3. mobiel — op 375px is typen duur (toetsenbord neemt het halve scherm), tikken niet.

#### De demo loog over drie van de vier commands

| hero toonde | engine geeft | bron |
|---|---|---|
| `whoami` → `user` | `hacker` | `core/terminal.js:45` |
| `ls` → `passwords.txt`, `notes.md` | `documents/  notes.txt  README.txt` | `filesystem/structure.js:7-206` |
| `nmap 192.168.1.1` → 22/SSH, 80/HTTP | 53/DNS, 80/HTTP, 443/HTTPS (router-profiel) | `network/nmap.js:32-39,67-69` |

Dat zat er sinds de bouw van de landingspagina in. Meegenomen omdat de responsemap toch herschreven werd — inclusief de `<noscript>`-fallback en de auto-lus. Op een site die "aantoonbaar" als kwaliteitsclaim voert is een demo met niet-bestaande bestanden een geloofwaardigheidslek, geen cosmetisch detail.

#### Vijf bugs — twee bestonden al, drie ontstonden tijdens de bouw

**A. Dubbele lus (bestond al).** `stop()` (`landing-demo.js:211`) zette alleen een boolean; de lopende `await delay()`-keten wordt niet afgebroken. De `visibilitychange`-handler riep bij terugkeer `startAnimation()` aan, waarna de *oude* opgeschorte lus verderliep langs zijn `if (!isRunning)`-poorten: twee lussen die in dezelfde DOM schrijven. → generatieteller; een lus die niet meer de huidige generatie is stopt onherroepelijk.

**B. Herstart over de bezoeker heen (bestond al).** Diezelfde handler herstartte de auto-demo ook ná overname — tabwissel wiste de sessie van de bezoeker. → `handOff()`, onomkeerbaar.

**C. Firefox focust geen readonly veld.** Gemeten: na `click()` bleef `document.activeElement` op `BODY`. Firefox beslist focusbaarheid bij mousedown, en toen was het veld nog `readonly`. Zonder expliciete `.focus()` klikt een Firefox-bezoeker de terminal aan, ziet hem live gaan, en verdwijnen zijn toetsaanslagen. **Alleen de driemotorenrun ving dit; op Chromium is het onzichtbaar.**

**D. Prototype-sleutels blokkeerden de REPL.** `RESPONSES[naam]` is truthy voor élke `Object.prototype`-sleutel. Wie `constructor`, `toString`, `__proto__` of `hasOwnProperty` typte liet `kies()` stuklopen op `undefined.slice()` — één woord en de demo stond stil. → `Object.hasOwn`. Bij het repareren bleek een tweede laag: `naam` was kleingemaakt, dus de foutmelding gaf `tostring` terug. Nu wordt het origineel teruggemeld.

**E. Afrondboodschap op de verkeerde teller.** Hij telde `gedaan.size`, en `gedaan` verzamelt élke invoer — zes willekeurige woorden riepen de CTA op, en daarna elk volgend command opnieuw. → `SUGGESTIES.every()` plus een eenmalig-vlag.

C, D en E zijn met een mutant bewezen: oude code terug → test weer rood.

#### De valse groene test

Mijn eerste versie van "de auto-demo toont wat de echte engine ook toont" was **groen op de ongewijzigde pagina**. Twee blinde vlekken die elkaar dekten:
- `innerText()` ná de lus meet een venster waar `trimOldLines()` (max 8 regels) de bewijsregels al uit heeft geknipt;
- de assertie zocht `hacker`, en dat staat gewoon in de promptregel `hacker@hacksim:~$`.

Vervangen door een `MutationObserver` via `page.addInitScript()` die álles opvangt wat de lus ooit schreef, plus een assertie op de regel *ná* de `$ whoami`-echo. Toen pas rood.

#### Implementatie-keuzes

- **Geen import van de echte engine.** Terminal Core zit ~37% boven het 400 KB-budget. Enige gedeelde code: `findClosestCommand` uit `src/utils/fuzzy.js` — bestond al (1716 bytes), levert tier-1-gedrag identiek aan `help-system.js:78-83` ("Bedoelde je 'nmap'?"), kost nul nieuwe repo-bytes.
- **Chips *binnen* `.hero-terminal`.** `.hero-content` is een flex-rij met exact twee kolommen; een derde kind maakte er een derde kolom van. Binnen het venster volgt het bovendien het bestaande `#mobile-quick-commands`-patroon van `terminal.html`, inclusief de 44px-tikdoelmaat (testconditie, geen cosmetiek).
- **`.terminal-body` blijft 235px/200px met interne scroll** — vaste hoogte + overflow = nul layoutverschuiving in de hero. In live-modus `display: block` en **niet** flex-end + scroll: die combinatie clipt de bovenkant onbereikbaar weg in Chrome en Firefox. De fade-mask (`::before`, `position: absolute`) zou meescrollen met de inhoud en gaat daarom uit.
- **Markerkleuring in een `<span>` binnen de regel**, niet als klasse op de regel: de hero-CSS gebruikt descendant-selectors (`.terminal-line .tip`). Eerste versie was daardoor wit in plaats van groen.
- **`{breed, smal}`-paren per response**, gekozen op `innerWidth < 768` — precies zoals de engine dat doet via `isMobileView()`. De nmap-tabel is in het origineel 60-77 tekens breed.
- **Altijd `textContent`**, nooit `innerHTML`: de invoer komt van de bezoeker.
- **Statisch `<input readonly>` in de HTML**, niet door JS aangemaakt: zonder JS ziet de bezoeker een niet-bewerkbaar veld (eerlijk) in plaats van een veld dat belooft te werken. Houdt bovendien het mobiele toetsenbord dicht tijdens de auto-demo.
- **`role="log"` + `aria-live="off"`** tijdens de lus, `"polite"` pas bij overname — anders leest een schermlezer de eindeloze lus voor. Geen autofocus.

#### Analytics

`hero_demo_started` (eenmalig) en `hero_demo_command` (alléén de commandonaam). Via `events.js`, dus de consent-poort en de privacy-guard in `tracker.js:146` komen gratis mee. De aanroepen lopen door een `meld()`-wrapper: `events.js` is deze sessie uitgebreid maar relatief geïmporteerde submodules dragen geen `?v=`, dus een terugkerende bezoeker kan tot `max-age` (3600s) een oude `events.js` uit cache krijgen — zonder wrapper een `TypeError` na elk command.

Pas als `terminal_cta_click{location:hero}` te segmenteren is op sessies mét `hero_demo_started`, weet je of dit rendeert. Tot dan is "de hero-demo verhoogt de doorklik" een hypothese.

#### Bundlelimiet 1050 → 1100 KB

De wijziging kost 24 KB tegen **4,78 KB** resterende ruimte. Twee keer een oordeel:
1. **Verhogen, niet code-golfen.** Deze meting is een driftalarm over ongeminificeerde broncode sitebreed, geen perf-poort: de echte poort blijft Terminal Core <400 KB minified, en die wordt met **nul** bytes geraakt — `hero-repl.js` zit alleen in de module-graph van `index.html`. Precedent en formulering staan al in TASKS.md (Sessie 204, 1000 → 1050).
2. **1100 en niet 1075.** Mijn eerste bump was op een projectie van ~12 KB gebaseerd; het werd 24 KB, wat 5,8 KB marge zou laten — net zo krap als waar ik begon. Een limiet die vlak boven de huidige stand ligt vuurt op élke wijziging en wordt dan weggeklikt in plaats van onderzocht. Nu ~31 KB (2,9%).

---

### Verificatie

- **NEW `tests/e2e/hero-demo.spec.js`** — 13 tests, **39/39** over Chromium/Firefox/WebKit. Elke assertie eerst rood gedraaid tegen de ongewijzigde pagina.
- Mobiel op **twee** maten gemeten, want de ene is blind voor de andere: tekentelling ≤40 op authored regels + geometrische overflow tegen `clientWidth` voor álle regels. `cat` valt buiten de tekentelling — dat is letterlijke bestandsinhoud uit de VFS en die hoort te wrappen; inkorten zou het bestand vervalsen.
- **Regressie: 111 passed / 0 failed / 9 skipped** (`hero-demo` + `homepage-conversion` + `performance` + `navbar-collapse`). De 9 skips zijn de by-design browserspecifieke tests in `performance.spec.js` (2+2+2+3), geen van deze wijziging.
- `validate-docs.sh --deep`: exit 0, 12 checks. CI groen op beide commits.
- Visueel op 375/768/1280px in licht én donker, vóór en ná overname, met een **versheids-assert** in elke meting (`chip min-height == 44px`) zodat een oude CSS-lading zich niet als "ziet er goed uit" kan voordoen.
- Meetserver geverifieerd op zijn `Cache-Control`-header, niet op de statuscode. Chromium-pad **niet** geraden: `~/.cache/ms-playwright` was de standaardlocatie, dus `CHROMIUM_PATH` was helemaal niet nodig — mijn eerste gok (`/opt/pw-browsers/…`) liet alle 30 tests falen op "executable doesn't exist".

### Metrics delta

| | vóór | ná |
|---|---|---|
| Bundle (performance.spec meting) | 1045,22 KB | 1069,20 KB (limiet 1050 → 1100) |
| `src/` | 698 KB | 714 KB |
| `styles/` | 407 KB | 419 KB |
| Spec files / `test()`-declaraties | 32 / 243 | 34 / 264 |
| Tabbare elementen in `.hero-terminal` | 0 | 7 (invoer + 6 chips) |
| `landing.css` cache-versie | v139 | v141 |

### Niet gedaan, met reden

- **Geen commandogeschiedenis (pijltje-omhoog).** Buiten de gevraagde scope; toevoegen zonder vraag is scope creep. Wel de meest verwachte terminal-affordance ná Enter — kandidaat voor een volgende ronde.
- **De Engelse `←`-annotaties in de échte nmap-engine** (`network/nmap.js:132-144`) blijven staan. CLAUDE.md schrijft Nederlandse inline context voor, dus die drift bestáát — maar repareren hoort in een eigen wijziging, niet verstopt in deze. De hero-demo gebruikt wél Nederlands.
- **Geen opslag van de demo-sessie.** Een lokmiddel dat je voortgang onthoudt suggereert dat het de simulator is.
- **Geen tweede CTA-knop in de terminal.** Zou `homepage-conversion.spec.js:183` breken ("alle primaire CTA's dragen hetzelfde label") en de tikdoel-assertie op :238.

### Next steps

- Over ~2-4 weken GA4 lezen: verhoogt `hero_demo_started` de `terminal_cta_click{location:hero}`-ratio? Dat is de enige manier om te weten of deze investering rendeert.
- Overweeg commandogeschiedenis in de hero-REPL als de data laat dat bezoekers meer dan 2-3 commands typen.
- `nmap.js` inline-context naar Nederlands (eigen wijziging).

---

## Sessie 213: Gidsen-grid, CTA-uitlijning en een navbar die site-breed 500px te breed was (07 aug 2026)

**Mission:** Heisenberg meldde vier dingen op `/gidsen.html`: de pagina oogt niet mooi, de 4e gids staat alleen onderaan, het pentest-sample ontbreekt terwijl het bestaat, en de CTA-knoppen liggen niet op één lijn. Vraag was expliciet om grondige UX-/design-analyse. Onderzoek bracht een vijfde, grotere bug boven die niets met gidsen te maken had.

### Oorzaak 1 — harde 3-koloms grid met vier kaarten

`landing.css:831` → `grid-template-columns: repeat(3, 1fr)`. Vier kaarten = rij 1 vol, rij 2 één weeskaart op ⅓ breedte.

Vóór de keuze vier lay-outs in de live DOM gemeten op 1440px (met de flex-fix al gesimuleerd, anders meet je de bug mee):

| variant | kaartbreedte | regels beschrijving | sectiehoogte | wees |
|---|---|---|---|---|
| A huidig 3-koloms | 429px | 5-6 | 1319px | ja |
| **B 2×2 volle breedte** | **656px** | **2-4** | **1213px** | nee |
| C 2×2 gecapt op 940px | 458px | 3-6 | 1264px | nee |
| D 4 naast elkaar | 316px | 8-10 | 832px | nee |

Gekozen: B. D is het compactst maar maakt van elke kaart een smalle kolom met 8-10 tekstregels. C oogt goed maar sluit niet meer aan op de volle-breedte bundelkaart erboven. B's buitenranden vallen exact samen met die bundelkaart (656+24+656 = 1336), dus de pagina leest als één kolomstapel. Bijvangst: rij 1 werd de twee gidsen mét gratis sample, rij 2 die zonder — informatieontwerp dat de bestaande kaartvolgorde gratis opleverde.

NEW modifier `.feature-cards--2col`, in `@media (min-width: 769px)`. Die query is niet cosmetisch: pages.css laadt ná landing.css en beide selectoren zijn (0,1,0), dus een ongepoorte regel verslaat `@media (max-width: 768px) { 1fr }`. Per ongeluk gemeten met een `!important`-prototype: **6px horizontale overflow en kaarten van 173/184px op 375px**.

### Oorzaak 2 — twee flex-items deelden de rek (de scheve CTA)

`pages.css:482-489` zette `flex: 1` op `.gids-card p`. Dat selecteert óók `<p class="gids-sample-link">`, want dat ís een `<p>`. Gemeten op kaart 1:

| element | natuurlijke hoogte | werkelijke hoogte | `flex-grow` |
|---|---|---|---|
| beschrijving `<p>` | ~49px | **82px** | 1 |
| `p.gids-sample-link` | 21px (de `<a>`) | **66px** | 1 |

82 + 66 = 148 = precies de 164px van een kaart-zonder-sample min de extra 16px marge. Twee vervolgeffecten die allebei als los raadsel oogden:

- **`.btn-cta { margin-top: auto }` was een no-op.** `flex-grow` verdeelt de vrije ruimte vóórdat auto-marges iets kunnen absorberen. De regel deed letterlijk niets.
- **`.gids-sample-link { margin: 8px 0 0 }` landde nooit.** `.gids-card p` heeft (0,1,1) tegen (0,1,0); `margin-top` rekende uit op `0px`.

Resultaat op 1440px: CTA kaart 1 op y=356, kaarten 2 en 3 op y=438. **82px scheef.**

**Fix:** NEW `.gids-card-body` als enige groeier. Daarmee staan `.gids-price`, `.btn-cta` en `.gids-related` alle drie op vaste afstand van de kaartbodem, en kaarten in één grid-rij zijn even hoog. De invariant **kaartbodem − CTA-bodem = 186px** geldt daardoor voor alle vier — ongeacht welke kaart een sample draagt. Dat is het punt: een `margin-top: auto`-oplossing zou opnieuw breken zodra iemand een derde sample toevoegt of de copy wijzigt.

### Oorzaak 3 — de samples stonden niet waar de koopbeslissing valt

Het pentest-sample stond alleen in een apart blok onderaan; het juridische als gecentreerd blauw onderstreept tekstlinkje onder de groene knop. Blauw is per projectconventie het *blog*-palet — op een main-site productkaart met groen accentsysteem leest dat als vreemd element.

Beide nu een coupon-chip in de body-zone, boven de prijs: omrande blok met download-icoon, `var(--color-prompt-bg-light)` + `var(--color-cta-primary)` (allebei thema-aware, geen hardgecodeerde lime zoals `.gids-badge` had), `min-height: 44px` want hij mat 40px op 375px — net onder WCAG AAA. Data-attributen `data-lead-magnet` + `data-cta-location` letterlijk behouden: `cta-tracking.js` delegeert erop en `lead-magnet.spec.js` selecteert er hard op.

Het dubbele blok onderaan is vervangen door een slanke afsluitstrook die de blog-/terminal-links behoudt. Dat blok rendeerde bovendien als transparante spookdoos: `--color-bg-card` bestaat niet, en omdat het inline stond overrulede het ook `[data-theme="light"] .gids-bundle` (gemeten: `rgba(0,0,0,0)` tegen `rgba(255,255,255,0.8)` van de bundelkaart erboven). Zelfde constructie stond op `over-ons.html` en is daar ook weggehaald.

### Oorzaak 4 — de weesregel vuurde op 4-kaart-grids

`landing.css:1462-1467`: `.feature-cards .feature-card:nth-child(3) { grid-column: 1/-1; max-width: 500px; margin: 0 auto }` — bedoeld om de laatste kaart van een 3-kaart-grid te centreren op tablet. Bij vier kaarten gaf dat op 1000px drie verschillende breedtes en twee wezen, en op `over-ons.html` @820px kolomsporen **211/185/136/136** met kaart 3 geforceerd op 500px, dwars door zijn eigen spoor heen.

**Fix: één selector-token.** `:nth-child(3)` → `:nth-child(3):last-child`. De regel was altijd al bedoeld voor de laatste kaart van een drietal. Elk aangeraakt grid geteld om te bewijzen dat er nul gedragswijziging is waar het wél klopte:

| grid | kaarten | kaart 3 = last-child | effect |
|---|---|---|---|
| index.html: feature-cards / leerpad-cards / how-it-works-steps | 3 / 3 / 3 | ja | ongewijzigd |
| sample-pentest.html, sample-juridisch.html | 3 | ja | ongewijzigd |
| gidsen.html | 4 | nee | wees weg |
| over-ons.html | 4 | nee | 500px-kaart weg |

Daarnaast `.features-4col` (`pages.css:89`) naar `@media (min-width: 1025px)`: die stond zonder query en versloeg daardoor zowel `@media (max-width: 1024px)` als de mobielregel — dezelfde cascade-val als in oorzaak 1.

### De vijfde bug — de navbar paste al 500px lang niet

Tijdens de over-ons-verificatie bleek 341px horizontale overflow op 820px. Eerst gecontroleerd of ik hem veroorzaakt had: **productie gaf exact dezelfde 341px en dezelfde 917px `nav-right`**, dus pre-existing. Meting per pagina: 161px @1000px, op élke marketingpagina én alle 15 blogposts (die dezelfde `landing-nav` gebruiken).

De omslag naar het hamburgermenu zat volledig in `@media (max-width: 768px)`. Waar hij écht hoort, is twee keer binair gezocht:

- vanaf **1147px** loopt er niets meer buiten de balk;
- maar pas vanaf **1264px** (Chromium/Firefox) resp. **1266px** (WebKit) breekt er ook niets meer af.

Daartussen "past" de nav puur doordat "Over Ons" en "Start Simulator" over twee regels vallen. Band loopt nu tot en met **1279px**, zodat de desktopnav vanaf de gangbare 1280px-laptopbreedte verschijnt.

Compacter maken was geen alternatief en dat is doorgerekend: op 769px is er 492px beschikbaar voor `nav-right`, en zelfs met nul padding op de links, een kleinere gap en een icoon-only schakelaar blijft hij ~545px. De hamburger is in deze band noodzakelijk, geen voorkeur.

**Waarom de overlay-regels in landing.css staan en niet in mobile.css:** dat bestand is dubbel gepoort (link-`media` én interne query, allebei 768px) en draagt terminal-specifieke regels (`#terminal-container`-padding, modal-maten, font-sizes) die daar horen. De waarden zijn niet overgetikt uit mobile.css maar overgenomen van de **gemeten effectieve stijlen op 700px** — de directe buur van de band — omdat de bron-CSS daar deels overruled wordt en overtikken dus iets anders zou opleveren dan wat er staat. Visueel vergeleken: 700px en 1000px zijn identiek.

**De terminal-navbar is bewust niet mee ingeklapt.** Die heeft een eigen, smallere variant (menu 738px @1000px) die in deze band wél past; meeklappen zou 1024px-gebruikers onnodig een hamburger geven. Er staat een test op dat onderscheid.

### De groene CTA in het mobiele menu heeft nooit gewerkt

`.mobile-cta-link` ("Start Simulator") hoort neon te zijn. Cascade uitgelezen via de CSSOM: `main.css`'s `.navbar-links > li:not(.navbar-dropdown) > a` is **(0,2,2)** en verslaat `.navbar-links .mobile-cta-link` **(0,2,0)** — gelijk aantal klassen, maar twee type-selectors (`li`, `a`) geven de doorslag. De regel was dood vanaf het moment dat hij geschreven werd, op elke breedte.

Relevanter geworden door deze sessie: tot vandaag zag alleen ≤768px dit menu (telefoons), nu élke laptop onder 1280px. Opgelost op specificiteit **(0,3,2)** in main.css — geen `!important`. Mijn eigen band-regel `#landing-mobile-menu .navbar-links a` (1,1,1) blokkeerde de fix eerst: die zette defensief een `color` die al onvoorwaardelijk uit main.css kwam. Symptoom was leerzaam: `font-weight: 600` kwam wél door en de kleur niet — het vingerafdrukje van een gedeeltelijke override.

### Wat géén bug bleek

De element-scan meldde bij `.blog-table--stacked` een `<th>` met een rect buiten de viewport. Nagemeten: `thead` is `position: absolute`, 1×1px, `overflow: hidden` + `clip-path: inset(50%)` — het complete visually-hidden-patroon. Uit de flow, geen scroll, `elementFromPoint()` op die coördinaten geeft `null`. Dat een kind buiten zijn 1px-ouder uitsteekt in `getBoundingClientRect()` is hoe de DOM-API werkt. "Oplossen" zou `display: none` betekenen, precies wat de CSS-comment verbiedt omdat schermlezers de kolomkoppen dan verliezen. Reden in de test vastgelegd zodat de volgende sessie er niet opnieuw op jaagt.

Let op: `checkVisibility()` gaf hier `true`. Die API kijkt naar `display`/`visibility`/`opacity` en negeert `clip-path` en `overflow` — bij visually-hidden-patronen is hit-testing de betrouwbare meting.

### Testinfrastructuur

NEW `tests/e2e/gidsen-layout.spec.js` (8 tests) en `tests/e2e/navbar-collapse.spec.js` (6 declaraties, waarvan 3 geparametriseerd). `lead-magnet.spec.js` uitgebreid: `SAMPLES`-fixture kreeg `magnetId` + `gidsenLocation`, en de losse juridisch-test is vervangen door een geparametriseerde die beide chips dekt inclusief de eis dat de chip ín een `.gids-card` staat.

**Beide suites eerst rood gedraaid tegen productie:** gidsen-layout 5/8 gefaald (de 3 die slaagden waren juist de regressiewachten), navbar-collapse 7/8 (de terminal-wacht hoorde groen te zijn). Daarna 111/111 groen in Chromium, Firefox en WebKit, twee volledige runs achter elkaar.

Drie testfouten van mezelf onderweg, allemaal instructief:

1. **`contains(@class,"gids-card")` matchte ook `gids-card-body`** — substring in plaats van token. Opgelost met het `concat(" ", normalize-space(@class), " ")`-idioom.
2. **`getClientRects().length` detecteert geen wrap in een flexbox.** `.nav-links` is `display: flex`, dus elke `<a>` is een geblokkeerd flex-item: tekst over twee regels levert nog steeds precies één rect op. Mijn eerste wrap-detector meldde daardoor "niets wrapt" terwijl het zichtbaar wél gebeurde. Meten op hoogte tegen `line-height` is hier de enige die klopt.
3. **`navPast` (scrollWidth ≤ clientWidth) accepteert wrappen als "past".** Mijn eerste breakpoint (1179px) werd door mijn eigen test goedgekeurd terwijl de screenshot twee afgebroken labels toonde. Er staat nu een aparte wrap-assertie naast de overflow-check.

### De flakiness was de server, niet de browser

Vier "browserverschillen" in Firefox/WebKit bleken allemaal `page.goto`-timeouts, nul assertiefouten. Oorzaak: `scripts/nostore-server.py` gebruikte `socketserver.TCPServer`, dat één request tegelijk afhandelt. Drie parallelle browsers serialiseerden daarop tot page loads in hun timeout liepen. Naar `ThreadingTCPServer` — 12 parallelle requests nu in 0,24s, en twee opeenvolgende volledige runs op 111/111.

(Een deel van de tijd draaide ik bovendien tegen een leftover `python3 -m http.server` op poort 8899 uit een eerdere sessie — géén no-store headers. Gedetecteerd doordat de response geen `Cache-Control` droeg; server verplaatst naar 8901.)

### Commits

- `d3ab459` — Gidsen-grid, CTA-uitlijning en een navbar die 500px te breed was (37 files, +787/−143), gepusht naar main

### Metrics delta

- **Spec files:** 30 → 32 | **`test()`-declaraties:** 229 → 243 (+14)
- **Bundle (du -sb / 1024):** src 698 KB | styles 398 → **407 KB** | blog 474 KB | assets 1737 KB
- **`!important` in landing.css:** 1 → **0** (de weggehaalde stond in de mobiele nav-regel met een comment dat hem "nodig" noemde; `.landing-nav .theme-toggle` (0,2,0) won al van main.css (0,1,0))
- **Gidsen-sectiehoogte @1440px:** 1319 → 1213px
- **Navbar-overflow:** 341px @820px / 161px @1000px → **0 op alle geteste breedtes** (375/700/820/1000/1024/1180/1279/1280/1440)

### Next steps

- Geen open items uit deze sessie. Wel genoteerd maar bewust niet gedaan: de `.blog-table--stacked` `<th>` (geen bug, zie boven).
- `mobile.css` bevat nog steeds de generieke `.navbar-menu`-overlayregels die voor de landing-nav dood zijn geworden (mijn `#landing-mobile-menu`-regels winnen ≤1279px). Ze bedienen nog wel de terminal- en blog-nav-varianten, dus opruimen kan alleen samen met een beslissing over die twee.

---

## Sessie 212: Lead magnets — verkeerde bestandsnaam en verkeerde welkomstmail (07 aug 2026)

**Mission:** Heisenberg schreef zich als proef in op `/sample-juridisch.html` en zag twee dingen misgaan: de PDF die hij downloadde héétte `pentest-playbook-sample.pdf`, en na het bevestigen van de inschrijving kwam de pentest-sample in zijn mailbox. Twee losstaande bugs met verschillende oorzaken.

### Bug 1 — één harde bestandsnaam voor de hele samples-map

`_headers:67-68` zette `Content-Disposition: inline; filename="pentest-playbook-sample.pdf"` op het pad `/assets/samples/*`. Die regel was correct toen de map één sample had, en werd stilzwijgend fout toen de juridische erbij kwam. Live gemeten vóór de fix: de juridische URL leverde 83.672 bytes (de júíste PDF, 6 pagina's) onder de pentest-naam. Geen 404, geen foutmelding — alleen een naam die loog.

**Fix:** een exacte regel per PDF, met `Cache-Control` bewust in elk blok herhaald zodat het niet afhangt van hoe Netlify headers van de minder specifieke `/assets/*`-regel meemerged. Dat de specifieker regel wint was empirisch al bewezen (`/assets/samples/*` overschreef nu al de `immutable` van `/assets/*`), en ná deploy bevestigd: beide bestanden geven `max-age=3600, must-revalidate` én hun eigen filename.

Plus `download="<naam>.pdf"` met expliciete waarde op alle drie de downloadknoppen (beide samples + de wees-pagina `sample-download.html`). Reden: browsers verschillen in of het `download`-attribuut of het `Content-Disposition`-filename wint. Door beide de juiste naam te geven maakt de winnaar niet uit — geen browser-specifieke aanname in de fix. Juridische link tegelijk van `?v=1` naar `?v=2`, want de PDF was op 7 aug herbouwd (`db7d7de`) zonder bump terwijl `max-age=3600` de oude bytes én de oude header nog een uur liet plakken.

### Bug 2 — één Brevo-formulier voor twee lead magnets

`sample-juridisch.html:158` en `sample-pentest.html:158` postten naar een bytes-identieke `action` (live gecheckt: beide eindigden op `…Q8Ut3Hzh9yz_CcCsMw==`; de homepage gebruikt wél een ander formulier). De welkomst-automation draait op een *Form submitted*-trigger, en tags zijn in Brevo geen automation-criterium (`brevo-setup-sample-pentest.md:55-59`). Brevo **kon** de twee instromen dus niet onderscheiden — iedereen kreeg `welkomstmail-sample-pentest.html`, met het verkeerde onderwerp, de verkeerde PDF en een cross-sell naar `wmvpx` in plaats van `yzdtfx`.

Verzwarend: `sample-juridisch.html:132` belooft letterlijk *"We mailen 'm ook zodra je je inschrijving bevestigt."*

**Keuze:** eigen formulier + eigen automation, niet de in Sessie 206 geadviseerde gedeelde neutrale mail. De juridische pagina bestaat om te meten of de gids verkoopt bij dezelfde funnel-behandeling als het playbook (`brevo-setup-sample-juridisch.md:64-70`); een gedeelde mail met een verwaterde cross-sell meet een halve funnel en maakt dat experiment onleesbaar. Dat argument woog zwaarder dan de ~30 minuten extra handwerk.

**Repo-kant:** NEW `docs/newsletter/welkomstmail-sample-juridisch.html`, gekopieerd van de pentest-variant zodat de Sessie 206-mobielfixes meekomen (gesplitste `.code-block`/`.code-inline`, `{{ unsubscribe }}`/`{{ mirror }}`, inline kleuren). Alle claims geteld uit de PDF met `pdftotext`, niet geschat: 6 pagina's, 82 KB, en de drie beloofde onderwerpen (art. 138ab Sr, de gouden regel, CVD met NCSC-termijnen) staan er aantoonbaar in. Code-chip @375px gemeten: 17px in een 24px regelbox, overlap 0 — identiek aan de post-fix-staat van Sessie 206. Runbook `brevo-setup-sample-juridisch.md` herschreven van optielijst naar uitvoerbaar document met een poort op de derde automation. NEW `sample-juridisch-embed-form.html` als bron van waarheid voor de `action`-URL.

**Brevo-kant (Heisenberg):** formulier `Sample Juridisch embed` op dezelfde lijst, template via Import HTML, automation met Form-submitted-trigger. Geen "Stap 3b" nodig — de hoofdautomation luistert al naar het homepage-formulier en pentest naar het pentest-formulier, dus drie formulieren met drie automations overlappen niet. End-to-end getest: één juiste mail, juiste PDF, cross-sell `yzdtfx`, pentest-flow onaangetast.

### Bug 3 — nul dekking, daarom kon dit maanden blijven staan

`lead-magnet.spec.js` was volledig pentest-only; `sample_juridisch` kwam nergens onder `tests/` voor, en er was geen enkele assert op response-headers.

Meevaller die dit goedkoop maakte: `playwright.config.js:32` zet `baseURL` op productie, dus een header-assert is een échte test. Rood-op-mutant bewezen vóór de fix: de juridische header-test faalde met exact de verkeerde naam terwijl de pentest-variant slaagde — het onderscheid tussen kapot en werkend zat in de test zelf.

- NEW Check 10 in `validate-docs.sh`: elke `assets/samples/*.pdf` moet een exacte-pad-regel hebben waarvan `filename="…"` gelijk is aan zijn basename, plus een verbod op een wildcard met vaste filename. Faalde met 3 meldingen op de oude `_headers` vóór hij groen werd gemaakt.
- `lead-magnet.spec.js` geparametriseerd over een `SAMPLES`-tabel; elke pagina gepind op zijn eigen formuliertoken, plus een kruiscontrole dat geen twee funnels hetzelfde formulier delen én dat de homepage-nieuwsbrief van beide losstaat.
- Eindmeting: **60 passed / 0 failed** tegen productie over chromium, firefox en webkit.

### Bijvangst: `type="email"` en het Brevo-Messages-mechanisme

Bij het bevragen van het live endpoint bleek Brevo een malformed adres te accepteren met `{"success":true}`. Iemand die zich vertypte zag dus het succespaneel, kreeg de PDF, en wachtte daarna vergeefs op een mail — het veld was `type="text"` (Brevo's standaard), dus de browser controleerde het formaat evenmin. `type="email"` op alle vier de Brevo-formulieren (2 samples, homepage, blog-index), `autocomplete` meteen van `off` naar `email`.

Dezelfde probes legden bloot dat `brevo-submit.js:39-42` `json.message` over de hardcoded paneltekst heen zet. Wie wint bleek alleen door een echte inschrijving te beantwoorden — de twee teksten lopen na "klaar." uiteen, en Heisenberg zag Brevo's variant. Conclusie: de **Success message** uit `Contacts → Forms → Messages` is wat de bezoeker leest; de HTML-tekst is het vangnet voor de paden waar Brevo geen message meestuurt (leeg veld, ongeldig formaat, honeypot — alle drie gemeten als `{"success":true}` zonder message). Vastgelegd in `brevo-config.js`, het runbook en een comment boven het paneel. De vangnettekst zei *"We hebben je ook een mail gestuurd"*, wat op precies die paden onwaar is → gelijkgetrokken.

Bijvangst van dezelfde meting: de honeypot werkt aantoonbaar — een gevulde `email_address_check` levert `success:true` zonder dat er een contact ontstaat, dus de bot krijgt geen signaal.

### Doc-opruiming

`brevo-setup-sample-pentest.md:109-123` bevatte een tweede "Resultaat na deze stap"+"Testen"-blok dat de verlaten tag-filter-aanpak beschreef ("tag blokkeert normale", "check dat de 'does NOT contain' tag-regel er staat") — terwijl regel 84 dertig regels eerder uitlegt dat die aanpak in Brevo onmogelijk is. Verwijderd. `maandelijks-template.md` sprak nog van "beide welkomst-automations"; aangevuld naar drie. Micro-correctie: `welkomstmail-sample-pentest.html` claimde 89 KB waar het bestand 90.604 bytes = 88 KB is.

### Commits

- `e24e324` — bugfix 1 + 2 + dekking (11 bestanden gewijzigd, 2 nieuw)
- `8c72329` — `type="email"` op vier formulieren + Messages-gedrag gedocumenteerd

Beide gepusht naar `main`, CI success, deploy live geverifieerd met `curl -I`.

### Learnings

- **Een regel die klopt kan fout worden zonder dat iemand hem aanraakt.** De wildcard-filename was correct bij één sample. De tweede sample maakte hem stilzwijgend onwaar. Dat is een andere bugklasse dan een tikfout: er is geen commit die hem introduceert. Check 10 vangt precies die klasse door filesystem-ground-truth te eisen in plaats van een lijst.
- **De discriminator die het snelst antwoord geeft is soms de gebruiker.** Ik claimde het Messages-gedrag eerst zonder meting, corrigeerde daarna te ver op basis van alleen de goedkoop te testen foutpaden, en had beide keren te veel zekerheid. Het succespad was de enige die telde en kon alleen door een echte inschrijving beantwoord worden — twee seconden werk voor Heisenberg, die de flow net had doorlopen. Dat had mijn eerste vraag moeten zijn, niet mijn derde.
- **Een bewust rode test is een betere poort dan een TODO.** De test "elke sample post naar een ánder Brevo-formulier" faalde tot het Brevo-handwerk klaar was, en werd groen op het exacte moment dat het af was. Een TODO in een runbook had niemand teruggemeld.
- **Adviezen overnemen uit eigen notities zonder de voorwaarde mee te lezen.** Mijn notitie zei "plus-alias anti-evasion" mét de voorwaarde *alleen voor adressen die al op de blocklist staan*, plus een kanaalonderscheid dat ik in dezelfde boodschap zelf uitlegde. Ik maakte er een absolute regel van ("geen plus-alias") en had het mis — Heisenberg testte er gewoon mee. Notitie gecorrigeerd zodat het advies nu omdraait.
- **Twee servers naast elkaar bleek niet nodig, één curl-vergelijking wel.** Bij een header-fix is `curl -I` vóór en ná de deploy voldoende rood-op-mutant-bewijs, mits je het "vóór" daadwerkelijk vastlegt. Dat kostte 10 seconden en maakte de "na"-meting pas betekenisvol.

### Next steps

- De drie niet-succes-Messages verschillen nog tussen de formulieren (Invalid / Error / Empty field). Voorkeursformuleringen zijn aangeleverd; laag risico, lage impact sinds `type="email"` er twee van afvangt.
- `welkomstmail-sample-pentest.html` staat één teken (88 vs 89 KB) uit de pas met de Brevo-template. Her-importeren heeft de relink-val; alleen meenemen bij een volgende aanraking van die template.
- `sample-download.html` blijft een wees-pagina zonder inbound links. Bewust niet uitgebreid met een juridische tegenhanger.

### Metrics delta

- Bundle (`du -sb`, KB): src 697→698 | styles 398 | blog 474 | assets 1772→1737
- Tests: 30 spec files, 229 `test()`-declaraties. `lead-magnet.spec.js` genereert zijn scenario's nu in een `for…of`, dus declaraties ≠ gedraaide tests: die suite alleen is 60 passed tegen productie.
- `scripts/validate-docs.sh`: +77 regels (Check 10)

---

## Sessie 211: Interne links naar leren-hacken.html + achterstallige /summary Sessie 210 (06 aug 2026)

**Mission:** Sessie 210 (SEO-optimalisaties + nieuwe blogpost `leren-hacken.html`) was gecommit en gepusht op branch `claude/ultraplan-opvolging-eyzgd4` maar niet in main gemerged. Doel: (1) dat werk binnenhalen via merge, (2) interne links naar de nieuwe post toevoegen vanuit bestaande blogposts + homepage, (3) achterstallige /summary voor Sessie 210 draaien, (4) /summary voor Sessie 211.

**Fase 0 — Merge:** `git merge origin/claude/ultraplan-opvolging-eyzgd4 --no-edit` — clean fast-forward (20 commits, 101 bestanden). Post `blog/leren-hacken.html` nu beschikbaar op onze werkbranch. validate-blogs 16/16 groen.

**Fase 1 — Interne links (6 bestanden bewerkt):**
- `blog/ethisch-hacker-worden.html`: in-body link "ik wil leren hacken" + related card swap (social-engineering → leren-hacken)
- `blog/cybersecurity-tools.html`: in-body link "Je wilt leren hacken" + related card swap (terminal-basics → leren-hacken)
- `blog/wat-is-ethisch-hacken.html`: in-body link in "Start je reis"-CTA + related card swap (welkom → leren-hacken)
- `blog/terminal-basics.html`: bullet in "Volgende stappen" sectie met link
- `blog/linux-bestandssysteem.html`: bullet in "Volgende stappen" sectie met link
- `index.html`: "Je wilt leren hacken" in homepage-copy gewrapt met link naar `/blog/leren-hacken.html`

**Verificatie:** validate-blogs 16/16 groen na alle edits.

**Fase 2+3 — /summary Sessie 210 + 211:**
- TASKS.md: header, sprint-regels, VALIDATE-BUNDLE marker (src=697 styles=398 blog=474 assets=1772), footer versie-regels bijgewerkt
- current.md: Sessie 210 + 211 entries toegevoegd, bulk-rotatie 195-199 → `archive-s195-s199.md`
- SESSIONS.md: index bijgewerkt (nieuwe archive, window 200-211)
- CLAUDE.md: counter 209→211, Last updated + Version ≤500 bytes
- PLANNING.md: sessie-referentie → 211, blog count 12→14

**Metrics delta:** blog/ 447→474 KB (+27, interne links in 5 posts) | blogposts 14 (ongewijzigd, +2 via merge) | src/styles/assets ongewijzigd (697/398/1772 KB) | 30 spec files ongewijzigd.

**Next steps:** geen open technische items. Kandidaat-vervolg: de merged branch naar main mergen (Heisenberg-actie).

---

## Sessie 210: SEO-optimalisaties + nieuwe blogpost leren-hacken.html (06 aug 2026)

**Mission:** SEO-optimalisaties op basis van zoekdata + nieuwe blogpost `leren-hacken.html` (~2500 woorden, 8 min leestijd, categorie Beginners). Gebouwd op branch `claude/ultraplan-opvolging-eyzgd4`.

**Work done:**
- **NEW `blog/leren-hacken.html`** — complete beginnersgids "Leren hacken": van absolute beginner tot ethisch hacker, het volledige leerpad. 10 secties: waarom, wettelijk kader, 6 fasen (basis→geavanceerd), tools, certificeringen, communities, veelgestelde vragen. JSON-LD Article + BreadcrumbList, breadcrumbs, blauw blog-palet, consent-model-CTA's.
- **SEO-titels geoptimaliseerd:** homepage ("Leren hacken"), ethisch-hacker-worden, nmap-beginnersgids — op basis van zoekvolume-data.
- **Ingehaakt:** blog-index, feed.xml, sitemap.xml, homepage-bloglinks.
- **Admin:** TASKS.md, CLAUDE.md, PLANNING.md bijgewerkt; validate-blogs + validate-docs groen.

**Commits:** 20 commits op `claude/ultraplan-opvolging-eyzgd4` (101 bestanden, ~6000 regels). Blogposts 12→14 (+leren-hacken + eerdere post).

**Learnings:** Sessie 210 was content/SEO-werk — geen diepe code-inzichten. SEO-titels op zoekdata baseren i.p.v. op wat je zelf "logisch" vindt.

---

## Sessie 212 — learnings (geroteerd uit CLAUDE.md, Sessie 218)

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

## Sessie 213 — learnings (geroteerd uit CLAUDE.md, Sessie 219)

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

## Sessie 214 — learnings (geroteerd uit CLAUDE.md, Sessie 220)

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

## Sessie 215 — learnings (geroteerd uit CLAUDE.md, Sessie 221)

⚠️ **Never:**
- Een verhouding coderen als een getal. `margin-top: 3rem` op `.hero-terminal` was een handmatige optische centrering voor een venster van 313px; Sessie 214 hing er 152px demobalk onder en het stak **94px onder de tekstkolom uit** terwijl de bovenkant nog 54px te laag begon. Zo'n getal rot stilzwijgend — er is geen commit die de bug introduceert. Zet de verhouding als regel neer (`align-items: center`), dan corrigeert hij zichzelf.
- `align-self` gebruiken om "dit item centreren" te bedoelen. Het **hoogste** flex-item bepaalt de cross-size van de regel, en dat wás de terminal (468 vs 428) — `align-self: center` mat 140→608, exact ongewijzigd. Het kórtere item moet bewegen, dus de regel hoort op de container.
- Denken dat je een focusring keyboard-only kunt maken op een tekstveld. Gemeten: `input.matches(':focus-visible')` is `true` ná een muisklik (spec — tekstvelden tonen altijd focus). `:focus-within` en `:has(:focus-visible)` zijn daar identiek. De rand verschijnt hoe dan ook bij een klik; maak hem dus *bedoeld*, verberg hem niet.
- Een focus-`box-shadow` vóór een `[data-theme="light"]`-override zetten die óók `box-shadow` zet. Gelijke specificiteit (0,2,0) → bronvolgorde beslist, en de gloed verdwijnt dán alleen in light mode. De mutant liet precies dat zien: **light rood, dark groen** — één thema testen had de bug laten passeren.
- Groen tekstgroen op de lichte paginaachtergrond. `--color-cta-primary` meet daar **3,10:1** bij 14,4px: onder AA, laat staan de AAA die dit project voert. Op het zwart van de terminal is hetzelfde groen ~17:1. Kleur volgt de achtergrond waarop hij staat, niet het merk. ⚠️ **Vervolg (Sessie 221, `c8cd46b`):** dit token droeg twee rollen — als CTA-achtergrond werkt het, als tekst faalde het op 101 van de 232 accent-tekstelementen. Opgelost met een apart `--color-accent-text`.
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

---

## Sessie 216 — learnings (geroteerd uit CLAUDE.md, Sessie 222)

> Oorspronkelijke kop: *De CTA-balk verscheen waar hij niets toevoegde — en de guard die dat bewaakte, scrollde nooit*

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

---

## Sessie 217 — learnings (geroteerd uit CLAUDE.md, Sessie 223)

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


> De **staande regel** die bij deze sessie hoort ("er is GEEN baseline van bekende testfalers meer")
> is bewust **in CLAUDE.md gebleven**: die is nog steeds van kracht en is geen historisch
> leerpunt maar een lopende afspraak. Roteren zou een actieve regel uit de context halen.
