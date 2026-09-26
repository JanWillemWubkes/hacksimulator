# Sessie-archief 225-229 - HackSimulator.nl

**Geroteerd uit `current.md` bij Sessie 240** (steady-state `N % 5`-rotatie, zie
`docs/sessions/README.md` §Rotatie-regel). Nieuwste-eerst binnen dit blok. Er waren geen
losse learnings-blokken voor deze sessies; alles zit in de entries zelf.

---

## Sessie 229: Het font schreef iets anders dan de DOM — `calt`-ligaturen stonden sitebreed aan (20 aug 2026)

**Mission:** een vraag beantwoorden, niet een taak uitvoeren. Heisenberg vroeg of de vreemde
tekens in de `sqlmap`-output bewust waren of een bug. Het bleek een bug, met een vindplaats die
ernstiger was dan de plek waar hij opviel.

### Commits

- `aab57a2` — De sqlmap-banner was niet corrupt, het font schreef iets anders dan de DOM
- `3d3a228` — De sqlmap-banner was het enige output-blok zonder NL-context

### Diagnose

De bron was correct. `textContent` op de live site gaf keurig `>=`, `-|` en `_|_` terug — er
stond dus niets fout in `src/commands/security/sqlmap.js`. Het ging mis in de **font-shaping**.

`--font-terminal` is JetBrains Mono, en die ligeert via de OpenType-feature `calt`. Gemeten met
fontTools op `styles/fonts/jetbrainsmono-latin.woff2`: **367 lookups**. `calt` staat in browsers
standaard aan, en een grep over `styles/` gaf **0 treffers** op `font-variant-ligatures` of
`font-feature-settings`. Gerenderd werd:

```
>=   ->  ≥        -|   ->  ⊣        <=  ->  ≤     =>  ->  ⇒
_|_  ->  ⊥        ->   ->  →        !=  ->  ≠     ==  ->  samengevoegde balk
```

**De zwaarste vindplaats was niet de banner.** In `man sqlmap`, onder het kopje *"Veilige
code:"*, rendeerde de site:

```
$stmt = $pdo→prepare("SELECT * FROM products WHERE id = ?");
$stmt→execute([$id]);
[✓] Prepared statement = SQL en data gescheiden
```

Dat staat direct onder het onveilige voorbeeld dat met `[X]` is gemarkeerd. Een beginner die
overtypt wat hij ziet krijgt een PHP-parse-error — bij precies het voorbeeld dat als het juiste
alternatief wordt aangewezen. Dat maakte dit een leerbug in plaats van cosmetiek.

**Waarom dit drie sessies onopgemerkt bleef:** de schade zat óók in de sqlmap-banner, en daar
valt hij niet op. Een corrupte `⊥` in ASCII-art ziet er niet corrupter uit dan een correcte
`_|_`. Pas waar de tekens *betekenis* dragen was het ondubbelzinnig.

### Werk

- **`styles/main.css`** — één regel: `*, *::before, *::after { font-variant-ligatures: none }`.
  Populatie omgedraaid i.p.v. een lijst mono-selectors, want `--font-terminal` staat in **48
  declaraties over 7 stylesheets** en zo'n lijst bewaakt zichzelf, niet de klasse. Drift valt nu
  in de goedkope richting: een prose-element dat de regel mist verliest een fi-ligatuur; een
  mono-context die hem mist toont weer `$pdo→prepare`.
- **Kosten van die keuze gemeten, niet beredeneerd.** De prose-fonts dragen wél
  ligature-features (fontTools op de subsets: Space Grotesk `liga`, 22 lookups; Inter `calt`,
  43), dus een blanket-disable is niet gratis. Breedtedelta `normal` vs `none` op **40px** tekst
  over vier teststrings incl. `fi fl ff ffi ffl`: Space Grotesk max **0,17px**, Inter
  **0,00px**. Sub-pixel op 40px, dus onmeetbaar op de werkelijke 16-32px — geen uitzondering
  waard.
- **`?v=228` → `?v=229`** op **79 verwijzingen over 30 HTML-bestanden**. Geverifieerd dat de sed
  niets anders raakte: 79 regels weg, 79 erbij, en een diff-filter op alles behalve `v=22[89]`
  gaf leeg.
- **NEW `tests/e2e/font-ligatures.spec.js`** en **NEW `tests/e2e/helpers/paginas.js`** (de
  `PAGINAS`-lijst uit `text-contrast.spec.js` gehaald — twee sweeps over dezelfde site horen
  niet elk hun eigen paginalijst te dragen).
- **`src/commands/security/sqlmap.js`** (commit 2) — één `[TIP]`-regel onder de banner, in
  **beide** takken.

### Learnings

**1. Breedte kan een ligatuur niet detecteren.** JetBrains Mono-ligaturen behouden het
monospace-grid **exact** — dat is hun ontwerpdoel, zodat code niet verspringt. Gemeten delta
tussen `MySQL >= 5.0` met en zonder ligaturen: **0,00px**; `$pdo->prepare()`: **0,00px**. Een
guard op breedte is dus groen bij een kapotte render. Een guard op `textContent` óók, want de
DOM klopte al. Alleen **gerenderde pixels** bewijzen hier iets. Die meting bepaalde de hele
opzet van de spec.

**2. De zelfbewakende tak verdiende zich onmiddellijk terug.** Assertie B vergelijkt drie
screenshots van dezelfde probe: pagina-CSS, `normal` geforceerd, `none` geforceerd. Tak 1 eist
dat `normal` en `none` **verschillen** — vuurt die niet, dan ligeert het font niet en bewijst
tak 2 niets. Bij de eerste run vuurde precies die tak: de probe was een `<pre>`, en de
UA-stylesheet zet daarop een eigen `font-family: monospace` die **overerving verslaat**. Gemeten
computed `fontFamily`: `"monospace"`. De probe mat dus de generieke browser-monospace, die niet
ligeert. Zonder tak 1 was assertie 2 groen geweest en had de guard niets aangetoond. Opgelost
met een `<div>` plus een eigen assertie dat de probe daadwerkelijk in JetBrains Mono staat.

**3. De legal-modal krijgt `active` pas rond 800ms.** Een `isVisible()` op t=0 geeft `false`,
slaat het wegklikken over, en dan appendt de terminal **nul** regels — 6 seconden later nog
steeds leeg (gemeten op 200/800/1500/3000/6000ms). Mijn `waitForFunction` op een stabiele
regeltelling liep daardoor in een timeout. Dezelfde valstrik als de flaky autocomplete-spec uit
Sessie 227; de house-pattern (`expect(legal).toBeVisible()` eerst) lost het op.

**4. Een pixelvergelijking racet met alles wat de layout beweegt.** Tak 2 was eerst
intermitterend rood omdat de bootsequentie tussen twee screenshots door regels appendde en de
probe meebewoog — de beelden verschilden op **layout**, niet op shaping. Opgelost door de probe
`position: fixed` met een dekkende achtergrond te geven: hij blijft een DOM-kind van
`#terminal-output` (dus erft de fontstack) maar staat buiten de flow.

**5. Exit code 0 is geen bewijs van een groene run.** De eerste volle chromium-run gaf exit 0
mét `55 did not run`, `2 failed` en `Timed out waiting 1500s for the test suite to run`. Mijn
eigen `--global-timeout` van 25 min had de run afgekapt; 451 passed in **25,0** min las als
groen. De twee falers waren mid-flight afgekapte tests, geen assertiefouten. Twee fouten in één:
de limiet stond op een **gevoel** i.p.v. een meting (`meten-en-guards.md` §0 zegt dit letterlijk),
en ik rapporteerde tussentijds "0 falers" op basis van een grep die het faalformaat van de
reporter niet matcht. Een grep die nul teruggeeft is niet hetzelfde als nul falers. Meting:
chromium alleen ~28 min, drie motoren **1,2 uur**.

**6. Cross-browser was hier geen ceremonie.** `font-variant-ligatures` had in oudere WebKit een
`-webkit-`-prefix nodig, dus "werkt overal" was een aanname. Gemeten: **62/62** op Firefox +
WebKit, inclusief tak 1 — wat bewijst dat beide engines écht ligeerden met `normal` en écht
onderdrukken met `none`.

**7. Een verwarrend beeld is een bevinding, ook als het correct is.** Na de fix vroeg
Heisenberg of dat blok tekens wel klopte. Het klopt — het is het echte ASCII-logo van sqlmap —
maar de verwarring wees op iets meetbaars: `sqlmap` is de **enige** van de 41 commands met
ASCII-art (8 bannerregels), en daarmee het enige output-blok zonder `← NL-context` of `[TIP]`,
terwijl `.claude/rules/command-output.md` dat voorschrijft. Er was geen precedent voor het
toelichten van een banner omdat er geen tweede banner is.

**8. Handmatige regelafbrekingen zijn een tweede opmaaksysteem.** De eerste `[TIP]`-formulering
brak de zin middenin (`...ASCII-logo van` / `sqlmap - dat print...`). Op desktop onzichtbaar; op
375px viel die breuk samen met de soft-wrap en las het blok als twee losse stukken met een gat.
De vraag is niet "past het" maar "waar mág het breken" — een breuk op een zinsgrens is immuun,
een breuk midden in een naamwoordgroep niet. Dat viel niet af te leiden uit de tekenlengte (62
en 49 klonken allebei prima); het moest gezien worden op 375px.

### Mutanten

| mutant | uitkomst | welke assertie |
|---|---|---|
| M1 — de `*`-regel weghalen | 30 failed / 1 passed | A op 29 pagina's + B tak 2 |
| M2 — regel scopen naar `#terminal-output` | 29 failed / 2 passed | A alleen; **B groen** |
| M3 — `jetbrainsmono-latin.woff2` hernoemen | 1 failed / 30 passed | **B tak 1 alleen**; A groen |

De ene groene bij M1 is `/assets/legal/terms.html`: **nul** monospace-elementen, dus daar valt
niets te overtreden. Dat was zelf een correctie op een aanname — ik ging ervan uit dat elke
pagina wel ergens mono-tekst draagt, en de zelfbewakende tak ving dat. Gemeten over alle 30:
terms 0, cookies 1, contact 1, privacy 3, tot `linux-bestandssysteem.html` 138 en
`commands/index.html` 132. Vastgelegd als `PAGINAS_ZONDER_MONO`, geasserteerd in **twee**
richtingen — een pagina erin moet nul houden, een pagina erbuiten minstens één.

### Metrics delta

| | vóór | ná |
|---|---|---|
| Bundel (`performance.spec.js`) | 1103,62 KB | **1104,62 KB** (marge 15,38 KB = 1,4%) |
| Spec-bestanden | 44 | **45** |
| `test()`-declaraties | 314 | **316** (= 31 gedraaide tests) |
| Volle suite, 3 motoren | — | **1520 passed / 0 failed / 25 skipped** (1,2 u) |

Het CSS-commentaar stond eerst op +1,69 KB en is gehalveerd door de volledige meting naar de
spec te verplaatsen (die telt niet mee in de bundelpoort) en in de CSS alleen het gemeten cijfer
plus een verwijzing te laten staan. Zelfde remedie als Sessie 228.

### Next steps

- **#73** (`certificates.spec.js` teardown-timeout) kwam in de derde volle run op rij niet
  terug. Diagnose blijft open; nog steeds niets gerepareerd op een vermoeden.
- **#74** (minify-trigger) staat nog niet aan: marge > 5 KB en de groei is CSS-commentaar, geen
  JS.

---

## Sessie 228: Vier CSS-commentaren claimden een contrast dat ze niet haalden — en de sweep die dat had moeten zien, filterde op tokennaam (19 aug 2026)

**Mission:** sluit de contrast-KLASSE, niet het volgende exemplaar. TASKS #72 noteerde één
token op één oppervlak (`--color-text-dim` op de edu-panelen, 5,21:1), maar dat was de derde
ronde van hetzelfde patroon: Sessie 226 tilde `--color-text-dim` van #8b949e naar #a1a8b0
("haalt nergens AAA"), Sessie 227 vond dat #8b949e óók op `--color-ui-secondary`,
`--color-text-muted`, `landing.css --terminal-demo-text-dim` en drie hardcoded footer-regels
stond (34 elementen), en #72 was de nieuwe waarde die het op een derde oppervlak alsnog niet
haalde. Opdracht: één ongefilterde sitebrede sweep, per kleurwaarde rapporteren, en het
verschil tussen "gerepareerd" en "gemeten uitzondering" vastleggen als assertie.

**Meting.** 30 pagina's × 2 thema's × 2 viewports = **13.157 unieke element-toestanden**.
Élk element dat zelf een tekstnode rendert, tegen zijn effectieve achtergrond, gegroepeerd op
**kleurwaarde** en niet op tokennaam — dezelfde hex zit onder meerdere namen (#a1a8b0 is
tegelijk `--color-text-dim`, `--color-ui-secondary` en `--color-text-muted`, dus per token
rapporteren verdeelt één defect over drie regels en verbergt de omvang).

| | element-toestanden | onder AA | onder AAA |
|---|---|---|---|
| vóór | 13.157 | **152** | **378** |
| ná | 13.157 | **0** | **0** |

18 kleurwaarden faalden. De grootste, op laagste ratio:

| kleur | rol | laagste | omvang |
|---|---|---|---|
| `#c9d1d9` op wit | `--color-footer-link` in de cookiebanner | **1,54** | élke pagina, light |
| `#eab308` | `.level-badge.intermediate` op eigen 15%-tint | **1,74** | index, light |
| `#7ac800` | `--color-prompt`/`--color-input` op de lichte terminal | **1,96** | promptregel + getypte tekst |
| `#1aff6b` | `--color-ui-hover` (latent) | **1,27** | via token-matrix |
| `rgba(204,204,204,.4)` | `--color-toggle-text-inactive` | **2,82** | 27 pagina's, **beide** thema's |
| `#0a4d94` op `#0a0a0a` | `--color-link` in een blog-demo | **2,36** | sql-injection-uitgelegd |
| wit op `#16a34a` | `--color-cta-primary` als knopvlak | **3,30** | 13 pagina's — de primaire CTA |

**Waarom drie eerdere rondes de klasse misten — vier meetgaten, elk met een gemeten voorbeeld:**

1. **Tokenfilter.** Álle bestaande contrastspecs filteren op een tokenlijst (`link-contrast`
   op vijf tokens, `accent-text` en `eyebrow` op één). Het zwaarste defect van de site stond
   op geen enkele lijst. Een guard die een *lijst* bewaakt, bewaakt geen *klasse*.
2. **Geen scroll.** `.leerpad-card` (landing.css) staat op `opacity: 0` tot een
   IntersectionObserver `.visible` zet. Zonder een scrollstap viel de hele `.level-badge`-groep
   buiten de populatie — en dáár zat de laagste waarde van de site.
3. **Eén viewport.** 115 falers bestaan alléén op mobiel: blog-`<strong>` en `h3` zijn op
   desktop ≥18,66px én bold (LARGE, lat 4,5) en halen 6,70, maar op mobiel zakt de font-size
   en geldt de lat van 7,0. Omgekeerd bestaan 54 falers alleen op desktop, omdat de
   thema-toggle op mobiel in het dichtgeklapte menu zit en dan geen rects heeft.
4. **Alleen rusttoestanden.** `--color-warning` en `--color-info` renderen in light op géén
   enkele stilstaande pagina: ze zitten in `.terminal-output-warning`, `.tip-box` en
   `.warning-icon`, die pas ontstaan nádat er een commando is getypt. En een `<input>` heeft
   geen tekstnode, dus `eigenTekst()` ziet de getypte waarde nooit — dáár zat 1,96:1.

**Vier CSS-commentaren claimden een contrast dat ze niet haalden**, alle vier in de
geruststellende richting (de richting waarin niemand narekent):

| commentaar | claim | gemeten |
|---|---|---|
| `--color-prompt` | "4.8:1 contrast (WCAG AA ✅)" | **1,96** op de lichte terminal |
| `--color-success` | "7.5:1 (WCAG AAA ✅)" | **4,29** op #f8f8f8 (4,56 op zuiver wit) |
| `--color-ui-primary` | "3.25:1 on white (WCAG AA)" | 3,25 **ís** geen AA (lat 4,5) |
| `--color-cta-primary` | "op een ACHTERGROND met wit erop is hij prima" (S227) | **3,30** |

Die laatste is de scherpste: Sessie 227 diagnosticeerde correct dat het token als *tekst*
faalde en verplaatste die gebruiken, maar schreef zonder meten dat de *achtergrond*-rol in
orde was. De rol die als veilig werd afgeschreven, was de rol die faalde — op de primaire
"Start de simulator"-knop van de hele site.

**Fixes, langs vier mechanismen:**

- **Tokenwaarden** (waar de waarde simpelweg te licht/donker was): `--color-error` (light
  #d60047→#a30039, dark #f85149→#fa7c76), `--color-warning` (light #dd8800→#744800),
  `--color-info` (light #0969da→#074fa4), `--color-success` (light #008844→#0a5c2e),
  `--color-text-muted` (light #666666→#4f4f4f), `--color-ui-primary` (dark #58a6ff→#6cb6ff,
  light #0db34f→#075f2a), `--color-ui-hover` (light #1aff6b→#00511d), `--color-ui-secondary`
  (light #0969da→#074fa4), `--color-toggle-text-inactive` (beide thema's, rgba→#a1a8b0).
- **Eén token, twee rollen** (S221-patroon): `--color-cta-primary` blijft het CTA-OPPERVLAK
  en gaat naar Green 800 (#166534) zodat wit erop 7,13 haalt; de hover naar Green 900. Álle
  **35** `color:`-gebruiken (32 in `styles/`, 3 in een inline `<style>` in `woordenlijst.html`)
  verhuizen naar `--color-accent-text`. In dark is dat een no-op: daar zijn beide #9fef00.
- **Eén badge-tokenset** voor `.level-badge.*` (landing.css) en `.command-level-*`
  (commands.css). Beide deden `background: rgba(HUE,.15); color: HUE` — één hue kan niet
  tegelijk een 15%-tint ZIJN en er leesbaar OP staan. Vier hues × twee thema's, waarden
  gekozen door de lichtheid te schuiven tot de laagste van beide badge-achtergronden ≥7,4
  haalt (kop boven de lat, zodat een kleine achtergrondwijziging hem er niet onder duwt).
- **Drie gescopede herdefinities** voor oppervlakken die van hun thema afwijken. Custom
  properties erven, dus één herdefinitie op de container dekt alles eronder:
  `[data-theme="light"] #terminal-container` (prompt/input → Green 900; dekt óók de negen
  `--color-prompt`-gebruiken in terminal.css die pas ná een commando renderen),
  `[data-theme='light'] .terminal-example` (donker eiland: link- én UI-tokens houden hun
  donkere waarde), en `html:not([data-theme='light']) .terminal-edu-inner` (`--color-text-dim`
  → #c0c7cf) — dát sluit de oorspronkelijke #72.

**NEW `tests/e2e/text-contrast.spec.js`** (2 declaraties → 31 tests). Zes asserties per
pagina: zelfbewaking, ongefilterde element-sweep, **uitsluitingen-als-assertie** (elk
overgeslagen element moet een gedocumenteerde reden hebben), token-matrix voor de hover,
de OPPERVLAK-token-assertie, en de uitzondering-op-de-uitzondering. Plus een aparte test die
eerst commando's typt en dán meet, inclusief de `<input>`-waarde.

**De gedocumenteerde uitzondering is een assertie, geen notitie.** `--color-cta-primary`
haalt AAA niet als tekst (6,71 op #f8f8f8) en dat is correct — het is een oppervlak-token.
In plaats van "let op, niet als tekst gebruiken" staat er: nul elementen mogen tekst in die
kleur renderen. En omdat het token in dark samenvalt met zijn tekstalternatief (allebei
#9fef00) slaat die check daar over — wat op zijn beurt in `gelijkInThema` is vastgelegd en
geasserteerd, zodat de check vanzelf weer aangaat zodra de waarden uit elkaar lopen.

**Zes mutanten, zes verschillende faalpatronen** (basislijn 31 passed):

| mutant | uitkomst | wat het bewijst |
|---|---|---|
| M1 `--color-cta-primary` → #16a34a | 18 passed | element-sweep, 13 pagina's |
| M2 `--color-ui-primary` → #0db34f | 1 passed | **alle 30** via ALLEEN de matrix — dit token rendert in light nergens als tekst |
| M3 `.gids-price` → oppervlak-token | 1 failed / 30 passed | **ALLEEN assertie 5**; de sweep blijft groen want 7,07 haalt AAA gewoon |
| M4 `--color-warning` → #dd8800 | 29 passed | 1 idle element tegen **14** in de terminal-uitvoertest |
| M5 `--color-link` hernoemd | assertie 2 én 4 | de zelfbewakende tak ("token bestaat niet") |
| M6 `.level-badge.intermediate` → #eab308 | 1 failed / 30 passed | uitsluitend zichtbaar dankzij `onthulAlles()` |

M2, M3 en M4 zijn de dragende drie: elk faalt op precies één assertie die de andere twee niet
raken. Zonder M3 zou de oppervlak-token-check ononderscheidbaar zijn van een check die niets
doet; zonder M4 zou de terminal-uitvoertest niets toevoegen boven de paginasweep.

**Helper uitgebreid** (`tests/e2e/helpers/contrast.js`):
- `zetThema()` zette alleen `data-theme` en liet de `.active`-klasse van de thema-toggle
  staan, terwijl `navbar.js:290` die óók verplaatst. Gevolg: een pagina waar de toggle het
  thema tegensprak, en twee valse defecten (1,00:1 en 2,35:1) op een element met `opacity: 0`.
- `rendert(el)` — rects + cumulatieve opacity + niet-transparante tekstkleur.
- `onthulAlles(page)` — scrollt de pagina één keer door zodat scroll-onthulde inhoud
  daadwerkelijk gemeten wordt.

**Bijvangst: een test verwijderd.** `accent-text-contrast.spec.js` had een assertie die
`--color-cta-primary` als tekst tolereerde mits large text. Sinds élk tekstgebruik weg is, is
die populatie structureel leeg en levert het filter altijd `[]` — groen zonder iets te meten,
exact de klacht uit #62. Verwijderd (arch-patterns §14: repareren door te verwijderen) en
vervangen door de strengere assertie 5, die 30 pagina's × 2 thema's dekt in plaats van 12
pagina's in light.

**#73 gemeten en bewust niet uitgevoerd.** A/B op `certificates.spec.js`
(`--repeat-each=4 --workers=4`, 24 test-instanties per run, 2 runs per arm): arm A (huidige
klik-gebaseerde `acceptLegalModal`) **94 s / 93 s**, arm B (`addInitScript` vóór de navigatie
+ de klik weg) **82 s / 80 s** — ~13% sneller, **24/24 passed in alle vier de runs**. Winst in
tijd, nul winst in robuustheid: geen van beide armen reproduceerde de teardown-timeout. Omdat
#73 een robuustheidsprobleem is, is de omzetting van 69 aanroepen over 20 specs niet gedaan.

**Commits:** `a9a4946` (implementatie + spec + TASKS), plus de doc-commit van deze `/summary`.

**Metrics delta:**
- Specs **43 → 44**, declaraties **313 → 314** (+2 van `text-contrast.spec.js`, −1 van de
  verwijderde vacuüme test). Gemeten met `grep -rE "^\s*test\("`, niet uitgerekend: die +2
  genereren **31** gedraaide tests.
- Bundel **1095,17 → 1103,62 / 1120 KB**, marge 16,38 KB (1,5%). De +8,45 KB is volledig
  CSS-**commentaar**; hij stond eerst op +13,5 KB en is binnen de sessie gehalveerd door het
  verhaal naar de spec en naar TASKS te verplaatsen en in de CSS alleen het gemeten cijfer te
  laten staan. `styles/` wordt niet geminificeerd, dus commentaar gaat letterlijk over de lijn.
- Volle chromium-suite **489 passed / 0 failed / 7 skipped** (22,0 min) — nul regressies
  ondanks 14 gewijzigde tokenwaarden. Nieuwe spec **93 passed** over drie motoren (7,9 min).

**Learnings**

⚠️ **Never:**
- Een guard schrijven die op een **tokenlijst** filtert en denken dat je een klasse dekt. Drie
  sessies lang repareerde elke ronde de vindplaats die toevallig in de lijst stond. Het
  zwaarste defect van de site (1,54:1, elke pagina) stond in geen enkele lijst en was
  onvindbaar zolang de populatie een lijst was in plaats van "alles".
- Een contrastsweep draaien **zonder te scrollen**. Vier kaartgroepen dragen "Entrance
  animation" met `opacity: 0` + een observer; zonder scrollstap meet je ze niet, en juist daar
  zat 1,74:1.
- Een contrastsweep draaien in **één viewport**. Het is niet symmetrisch: de large-text-lat
  (≥18,66px én bold) kantelt bij een kleinere basisfont, dus 6,70 is groen op desktop en rood
  op mobiel. 115 falers bestonden alleen mobiel, 54 alleen desktop.
- `getComputedStyle` vertrouwen op een element met `opacity: 0`. Het geeft gewoon een kleur
  terug voor iets dat niemand ziet — 54 valse metingen, waaronder een "defect" van 1,00:1.
- Een **themawissel** simuleren met alleen `data-theme`. `navbar.js` verplaatst óók de
  `.active`-klasse van de toggle; zonder die synchronisatie meet je een combinatie die op de
  echte site niet bestaat.
- Een `alpha < 1`-tekstkleur meten zonder hem eerst **over de achtergrond te compositen**.
  `ratio()` negeert alpha, dus `rgba(204,204,204,.4)` leest als #cccccc (10,73) terwijl het
  gerenderd rgb(97,97,97) is (**2,82**).
- Een A/B draaien terwijl je in de bestanden schrijft die de tests laden. Mijn eerste
  #73-meting gaf 1112 s en 4 falers; dat was mijn eigen CSS-edit, geen eigenschap van de
  variant. Een A/B hoort op een bevroren werkboom.
- Een tokenwaarde site-breed optillen om een **lokaal** probleem op te lossen. De edu-zone
  vroeg #c0c7cf; site-breed doorvoeren zou het onderscheid dim-vs-normaal wissen
  (#c9d1d9 is `--color-text-light`). En scope zo'n fix op het thema: mijn eerste versie was
  themaloos en zette #c0c7cf óók op de lichte panelen — 14 elementen op 1,53:1, een zwaardere
  regressie dan het defect.

✅ **Always:**
- Groepeer contrastbevindingen op **kleurwaarde**, niet op token. Dezelfde hex zit onder
  meerdere namen; per token rapporteren verdeelt één defect over drie regels.
- Behandel een contrastclaim in een **commentaar** als een bewering tot je hem hebt gemeten.
  Vier stuks logen hier, alle vier geruststellend. Eén ervan ("zo gebruikt is hij prima") was
  vorige sessie geschreven bij een correcte diagnose van de *andere* rol van hetzelfde token.
- Meet de **toestand die interactie vereist** apart. Negen van de tien `--color-prompt`-
  gebruiken en beide onzichtbare semantische tokens renderen pas ná een commando; een
  `<input>`-waarde heeft geen tekstnode en valt door élke `eigenTekst()`-filter.
- Laat de **uitsluitingen** van een sweep zelf een assertie zijn. Een sweep die stil
  overslaat kan een defect wegfilteren; nu faalt de test op een reden die niet in de lijst
  staat.
- Codeer een uitzondering als **assertie met de gemeten waarde**, niet als notitie. En geef
  de uitzondering-op-de-uitzondering er één bij: in dark valt het oppervlak-token samen met
  zijn tekstalternatief, en dát feit is nu geasserteerd in plaats van aangenomen.
- Kies mutanten die op **verschillende asserties** falen en controleer welke assertie vuurde,
  niet alleen hoeveel tests rood werden. M2 en M3 hebben allebei "een token op de verkeerde
  plek" als mutatie, maar M2 raakt uitsluitend de matrix en M3 uitsluitend assertie 5.
- Bepaal een testtimeout op een **meting**. De 17 webkit-falers waren geen defect maar 24,6 s
  serieel tegen een limiet van 30 s; 120 s is ~5× de gemeten waarde. Een timeout die je op de
  gemeten waarde plakt, wordt de volgende flaky test.
- Reken de blast radius van een fix door tot in de **bundel**. 13,5 KB commentaar op een
  marge van 1,5% is geen detail; het verhaal hoort in de spec en in TASKS (die tellen niet
  mee), de CSS houdt het gemeten cijfer.

**Next steps:**
- **Bundelmarge 1,5%** (16,38 KB). `styles/` wordt niet geminificeerd, dus élk commentaar
  gaat over de lijn. De eerlijke keuzes zijn een minify-stap voor `styles/` of een bewuste
  limietverhoging — niet nóg een ronde comprimeren, want dat haalt gemeten waarden weg.
- **#73 blijft open** met een gemeten, niet-uitgevoerde optie. Twee volle runs op rij zonder
  de faler; de oorzaak is nog steeds niet gemeten.
- **Hover wordt gedekt via de token-matrix, niet gesimuleerd.** Dat werkt voor tokenparen,
  maar een `:hover` die een *hardcoded* kleur zet (geen token) blijft onzichtbaar. Nog niet
  gemeten of die bestaan.
- **`--color-warning` in dark** haalt 7,50 op `--color-bg` maar is niet doorgemeten op de
  lichtere donkere oppervlakken (`--color-bg-hover` #21262d). Dezelfde vraag geldt voor
  `--color-success` (7,45). Beide net boven de lat, dus een klein achtergrondverschil kantelt ze.

---

## Sessie 227: Vier taken die elk een halve reparatie van een eerdere sessie afmaakten (18 aug 2026)

> ⚠️ **Deze entry is achteraf gereconstrueerd** (in Sessie 228) uit de vier commits en de
> TASKS-items #64, #68, #70 en #71. Sessie 227 kreeg destijds geen `/summary`: de counter bleef
> op 226 staan terwijl de commits en TASKS-items zichzelf al 227 noemden. De inhoud hieronder
> is feitelijk — maar dead-ends, verworpen alternatieven en metingen die niet in TASKS beland
> zijn, ontbreken. Lees de afwezigheid van verrassingen hier dus als "niet vastgelegd", niet
> als "er waren er geen".

**Mission:** vier openstaande TASKS-items afwerken. Achteraf hebben ze een gemeenschappelijke
vorm: elk maakte een reparatie af die een eerdere sessie half had gedaan.

**Werk (per commit):**

- **`8daf26d` — de bundelpoort telde 50 KB blog mee en de helft van zijn eigen entry-points
  niet (#70).** Niet de grens verhoogd (dat zou de vierde bump in 22 sessies zijn: 1000 →
  1050 → 1100 → 1120) maar drie fouten in de *teller* gerepareerd: `styles/blog.css` +
  `src/ui/blog-*.js` telden mee terwijl alleen `blog/*.html` ze laadt; de term
  `src/ui/**/*.css` matchte **nul** bestanden (dode term); en `index.html` telde mee terwijl
  `terminal.html` — juist de entry van deze pijler — ontbrak. `TOTAL_BUNDLE` →
  `RUNTIME_SOURCE`. Gemeten 1118,63 → **1091,85 / 1120 KB**. Drie mutanten op drie
  verschillende asserties, en twee die het níét doen staan mét reden in het commentaar.
- **`8696111` — de linkkleur haalde nergens AAA, en vier hover-toestanden zaten onder AA
  (#71).** `--color-link` #0969da → **#0a4d94** (light), hover #0550ae → #044289; in dark ging
  de hover van #58a6ff → #8ecbff, want die was **donkerder** dan de link zelf. Eindmeting over
  16 pagina's × 2 thema's, 3× byte-identiek: light 302 elementen / 0 onder AA / 0 onder AAA /
  laagste 7,29; dark 130/0/0/7,34. **Vier onder-AA-defecten als bijvangst, alle vier ernstiger
  dan #71 zelf** — `.blog-post-content th` (2,61), `.btn-secondary:hover` en
  `.btn-small.btn-secondary:hover` (2,61-2,77 in light), `.gids-sample-link:hover` (**2,76**,
  waar Sessie 221 de rust-toestand al had gerepareerd maar de hover had laten staan omdat geen
  enkele spec een hover-toestand mat). NEW `tests/e2e/link-contrast.spec.js` (element-sweep +
  token-matrix) en NEW `tests/e2e/helpers/contrast.js` — de derde kopie van `effBg()` was de
  aanleiding.
- **`53f6412` — de pagina heette anders dan waar de site naar linkte, in vier titelvelden
  tegelijk (#68).** `Privacy policy` → **Privacybeleid**, `Cookie policy` → **Cookiebeleid**
  in `<h1>`, `<title>`, `og:title` en `twitter:title`. De omvang week in beide richtingen af
  van de schatting: kleiner (geen JSON-LD op die pagina's, de ~20 "linklabels" bleken al
  Nederlands), groter (twee `<h3>`'s op `over-ons.html` plus 19 body-voorkomens, en uit
  `footer.js` — dat op élke pagina rendert — `Privacy Beleid` → `Privacybeleid` en
  `Algemene Voorwaarden` → **Gebruiksvoorwaarden**). NEW Check 17 in `validate-docs.sh` met
  twee invarianten (geen `policy` in een titelveld; **lockstep** tussen de vier velden) en
  vier mutanten op vier verschillende takken.
- **`d2dad44` — de flaky autocomplete-spec was de enige zonder legal-modal-afhandeling
  (#64).** De vastgelegde diagnose was te smal: het was de spec als klasse, niet één regel.
  Goedkope reproductie gevonden (`--repeat-each=12 --workers=4` in 1,5 min i.p.v. een volle
  run van 20 min), en dáármee de oorzaak gemeten: de discriminator is de **focus** op het
  moment van `Tab`, niet of de modal open staat. `input.fill()` zet de waarde ook zonder
  focus, dus die stap slaagt altijd; daarna grijpt de legal-modal de focus en gaat `Tab` naar
  zijn focus-trap. Fix: `page.addInitScript` zet `hacksim_legal_accepted` vóór de navigatie —
  de race is wég in plaats van overleefd. Ná de fix 144 passed / 0 failed onder dezelfde load;
  mutant → 12 rood.

**Commits:** `8daf26d`, `8696111`, `53f6412`, `d2dad44` (alle gepusht).

**Metrics delta (gereconstrueerd):** specs 39 → 43, declaraties 303 → 313; bundel 1118,63 →
1091,85 → 1095,17 / 1120 KB.

**Wat Sessie 228 hierop bouwde:** #71 loste de linkkleur op maar liet drie tokens met dezelfde
oude waarde staan (`--color-info`, `--color-ui-secondary` en — via een commentaar dat "matches
info/links" beloofde — de knopkleur in de cookiebanner). En het commentaar dat #71 bij
`--color-cta-primary` achterliet ("zo gebruikt is hij prima") bleek zelf ongemeten: wit op dat
token haalt 3,30.

---

## Sessie 226: De blog had 418 koppen zonder id en een filter van 26,8px — geen van beide stond in de CSS (18 aug 2026)

**Mission:** analyseer de blogsectie op layout, UX/UI en design, en bepaal zelf verdere
controlepunten. Uitdrukkelijk een *analyse*-opdracht; de reparatie kwam pas na goedkeuring van
het plan, in volledige scope inclusief inhoudsopgave.

### Commits

| Hash | Onderwerp |
|---|---|
| `e19e74f` | contrast-tokens: dim-tekst naar AAA, twee knopkleuren die AAA claimden maar 4,60/5,75 maten |
| `90e7ccd` | "Over Ons" → "Over ons", 58×, inclusief `navbar.js` en `footer.js` |
| `04e4d57` | de blogsectie: tapdoelen, inhoudsopgave, index-UX, ARIA, guards |

### Methode

Alles gemeten op `scripts/nostore-server.py` @375px en @1280px, in **beide** thema's. Geen
enkele bevinding komt uit het lezen van de CSS — de twee grootste defecten waren in de
broncode onzichtbaar:

- de filterknop had geen foute property; hij was 26,8px omdat een `<a>` **inline** is en
  inline boxes hoogte-constraints negeren. `min-height: 44px` toevoegen zonder
  `display: inline-flex` had niets gedaan;
- de kop-id's waren niet fout maar **afwezig**, en afwezigheid grep je niet.

### Wat gemeten is (13 punten)

| # | Bevinding | Meting |
|---|---|---|
| 1 | Categoriefilters te klein | 7/7 op **26,8px** (WCAG AAA 2.5.5 = 44×44), font 11,2px |
| 2 | Donker thema haalt AAA niet | `#8b949e` op `#0d1117` = **6,15**; op `#161b22` = **5,62** |
| 3 | Kapotte ARIA-progressbar | 15× `role="progressbar"`, **0×** `aria-valuenow` |
| 4 | Engelse aria-labels | **31**: 15× "Reading progress", 15× "Breadcrumb", 1× "Filter posts by category" |
| 5 | Engelse Title Case | "Alle **P**osts", "Over **O**ns" (58× sitebreed) |
| 6 | Geen in-page navigatie | **0 van 418** koppen met `id`; 19-41 koppen/post; artikel **17.815px** @375px |
| 7 | Nieuwsbrief begraaft artikelen | blok **606px** (75% viewport); eerste kaart op **y=1125** @375×812 |
| 8 | Filterstatus alleen visueel | geen `aria-current`, geen resultaatteller |
| 9 | Datum-semantiek inconsistent | index **45 spans / 0 `<time>`**; posts wél `<time datetime>` |
| 10 | Index-schema onvolledig | `Blog` + `BreadcrumbList`, geen `blogPost` |
| 11 | Positionele selector, latent | `.blog-meta span:last-child` — het Sessie 223-patroon |
| 12 | Filter-CSS versnipperd | `#bronnen` 600 regels verderop; `.category-btn.active`/`:target` matchen nooit iets |
| 13 | Geen a11y-guards | `validate-blogs.sh` dekte head/meta/breadcrumb/AI-melding, geen van bovenstaande |

**Gemeten en in orde bevonden** (geen werk aan besteed): regellengte 76 tekens @1280 (binnen
WCAG 1.4.8), typografische schaal mobiel 28,8/24/19,2/16, per-post OG-images uniek,
terminal-voorbeelden lopen niet over @360px, related-cards (158px) en CTA's (55px) ruim boven
44px, en het CSS-only filter wérkt (5/15 kaarten bij `#tools`, juiste knop actief, geen
scroll-sprong).

### Werk

**Tapdoelen.** `display: inline-flex` + `min-height/min-width: 44px` op `.category-btn`; de
mobiele overrides mogen de fontgrootte nog verkleinen maar niet de tapmaat. 7/7 op 44px,
breedtes 54-97px. Zeven knoppen wikkelen naar ~3 rijen op 360px — bewust boven een
horizontale scrollstrip gekozen, want zo blijven alle categorieën zichtbaar.

**Contrast.** `--color-text-dim` #8b949e → **#a1a8b0** (7,88 op de pagina, 7,20 op een kaart).
Waarde afgeleid met een handberekening die eerst tegen de metingen is geijkt: mijn model
reproduceerde 5,622 en 6,153 waar Playwright 5,62 en 6,15 mat, dus de voorspelling voor de
nieuwe waarde was betrouwbaar. Bijvangst: de light-mode knopkleuren `#1976d2` en `#1565c0`
droegen allebei "WCAG AAA compliant" in hun eigen commentaar en maten **4,60** en **5,75** met
witte tekst — de dark-mode tegenhanger `#004494` is wél ooit doorgemeten (7,2), deze twee zijn
er destijds "naar analogie" naast gezet. Nu 7,41 / 8,68. `.related-category` in light (4,88)
kreeg een eigen token naar het `--eyebrow-text`-precedent uit Sessie 217.

**Inhoudsopgave.** Bewust in drie lagen, elk in de goedkoopste laag die hem kan dragen:

1. **statische id's** via NEW `scripts/add-heading-ids.mjs` (idempotent, 343 toegevoegd, alle
   uniek) — statisch omdat alleen HTML-id's door `validate-blogs.sh` te bewaken zijn en een
   deeplink dan zonder JS werkt;
2. **runtime-TOC** via NEW `src/ui/blog-toc.js`, gebouwd uit de `h2`'s (callouts en CTA-boxen
   uitgesloten met `closest()`) — runtime omdat een statische lijst in 15 bestanden in lockstep
   met de koppen zou moeten blijven;
3. **actieve-sectiemarkering** met een scroll-listener + rAF, niet met een IntersectionObserver.

`blog.css` had géén `scroll-padding-top` terwijl `landing.css` en `commands.css` die wel
hebben — zonder dat landen alle nieuwe ankers achter de 60px navbar. Toegevoegd.

**Index-UX.** Nieuwsbrief van tussen filter en grid naar ná de derde kaart, als grid-item
(de grid is enkelkoloms). Eerste artikel **y=1125 → y=522**, binnen het eerste scherm.
`data-newsletter-location="blog_index"` meeverhuisd zodat `newsletter-tracking.js` het effect
kan meten. 15 datums naar `<time datetime>` — de CSS was er al op voorbereid (`blog.css` had
naast de `span`-varianten al `time`-selectors). NEW `src/ui/blog-filter.js` voor `aria-current`
+ resultaatteller ("5 van 15 artikelen", zelfde formulering als `term-filter.js`); het filter
blijft CSS-only werken zonder JS. `blogPost`-array met 15 items in het index-schema.

**Opgeruimd.** `.blog-meta span:last-child` → `.blog-category`; `#bronnen` bij zijn vijf broers
gezet met een comment dat benoemt dat een nieuwe categorie drie regelgroepen raakt; twee dode
selectors weg.

**Guards.** `validate-blogs.sh` checks 8-10 (kop-id's, Engelse aria-labels, progressbar zonder
waarde), elk met een tak die faalt bij **nul** treffers. NEW `tests/e2e/blog-navigation.spec.js`
voor wat alleen gerenderd meetbaar is. `docs/blog-template.md` kreeg een verplichte
TOC-sectie — zonder die regel neemt post 16 het gat weer over.

### Learnings

**Twee eigen meetfouten, allebei gevangen door een tweede meting.**

1. Ik meldde eerst twee ernstige light-mode-contrastfouten: `.breadcrumb a` op **2,90** en
   `.related-meta` op **1,78**. Een screenshot sprak dat tegen — de kaarten renderden wit. De
   oorzaak: ik las `getComputedStyle` in dezelfde tick als de themawissel, terwijl
   `.related-card` een `transition` van 0,15s heeft, dus ik mat de **startwaarde van een
   lopende animatie**. Na 700ms settelen: **9,17** en **9,74**, allebei AAA. Zonder die
   screenshot had ik twee defecten gerapporteerd die niet bestaan en er een "fix" op gebouwd.
   `accent-text-contrast.spec.js` documenteert deze val al bovenaan — ik liep er alsnog in.
2. De scroll-spy leek stelselmatig één sectie achter te lopen én het `<details>` opende niet op
   desktop. Twee losse bugs, één oorzaak: de browser hield een **stale ES-module** vast. Op een
   verse poort waren beide weg. `architecture-patterns.md §3` schrijft dit met zoveel woorden
   op ("`?cb=` bust submodules niet"); ik verloor er twee meetrondes mee.

**Specificiteit vergelijkt per tier, hij telt niet op.** De TOC-links bleven blauw omdat
`[data-theme="light"] .blog-post-content ol a` **(0,2,2)** mijn `.blog-toc ol li a` **(0,1,3)**
verslaat: twee klassen winnen van één, ongeacht hoeveel type-selectors erachter staan. Dat is
ook waarom mijn eerste poging (er een `ol` bij zetten) precies niets veranderde tegen de
`[data-theme]`-variant. Opgelost met een klasse op de wrapper → (0,2,3), niet met `!important`.

**`html { scroll-behavior: smooth }` maakt een IntersectionObserver ongeschikt voor scroll-spy.**
De observer vuurt tíjdens de animatie, op posities die de lezer nooit ziet, en ná afloop kruist
er niets meer — dus de markering blijft staan op een tussenstand. Dat gaf het off-by-one-beeld
dat ik aanvankelijk aan mijn grenswaarde toeschreef. Een scroll-listener met rAF is hier het
juiste gereedschap; §12 ("observer als trigger") geldt voor toestandswissels, niet voor een
grootheid die continu verandert.

**Een grens moet mee-ademen met de scroll-padding.** Mijn eerste predicaat gebruikte
navbar-hoogte + 8 = 68px, terwijl `scroll-padding-top` de kop op 76px parkeert — structureel
de vórige sectie. Het predicaat leest nu de werkelijke `scrollPaddingTop`.

**Een blog-analyse legde een budgetcontradictie bloot.** De bundel staat op **1118,63 / 1120 KB**
(0,1% marge). De formule telt `styles/**/*.css` en `src/**/*.js`, dus `blog.css` en de twee
nieuwe blogmodules tellen mee — terwijl `terminal.html` ze nooit laadt en CLAUDE.md de blog
"budgetloos" noemt. Doc en gate spreken elkaar tegen; dit is de eerste sessie die er blogcode
in schreef en het daarmee zichtbaar maakte. Staat als #70 open — een beslissing van Heisenberg,
niet van de volgende sessie die toevallig tegen de grens loopt.

**Wat ik bewust NIET heb gedaan.** `--color-link` meet **5,19:1** in light mode en faalt dus
AAA op élke link van de site. Dat is een echte bevinding, maar een blogopdracht hoort niet de
sitebrede linkkleur te herzien; het staat als #71 open met de meting erbij.

### Metrics delta

| | Voor | Na |
|---|---|---|
| Bundel | 1106,46 KB | **1118,63 KB** / 1120 (marge 0,1%) |
| Spec-bestanden | 41 | **42** |
| `test()`-declaraties | 305 | **312** (+7, gemeten — de laatste zit in een `for…of`) |
| Kop-id's in blogposts | 0 van 418 | **343** |
| Tapdoelen < 44px op `/blog/` | 7 | **0** |
| Engelse aria-labels | 31 | **0** |

Verificatie: 186 tests groen over Chromium/Firefox/WebKit (`blog-navigation`,
`blog-meta-separators`, `blog-theme-toggle`, `accent-text-contrast` — die laatste dekt de
token-wijziging af). `validate-blogs.sh` en `validate-docs.sh` exit 0. Vier mutanten op de
nieuwe checks, alle vier rood, elk met `diff -q` geverifieerd dat hij het bestand écht wijzigt.

### Next steps

- **#70** bundelformule vs. "blog is budgetloos" — 0,1% marge, volgende wijziging breekt de poort
- **#71** `--color-link` 5,19:1 in light mode (sitebreed); `--color-text-dim` 6,34 op `--color-bg-hover`
- **#68** Engelse koppen op `privacy.html`/`cookies.html` (onaangeroerd)
- **#64** flaky `autocomplete-filesystem.spec.js:99` (onaangeroerd)

---

## Sessie 225: De nieuwsbrief was af na vijf redactierondes — en elke ronde legde een defect bloot dat níét in de tekst zat (17-18 aug 2026)

**Mission:** ontwerp de augustus-nieuwsbrief. Wat begon als een redactieklus werd een
typografie-audit: de vijf feedbackrondes van Heisenberg legden stuk voor stuk een defect bloot
in de *gedeelde* e-mailtemplate, niet in de kopij van deze editie.

### Commits (7 sinds de Sessie 224-summary `851e237`)

| Hash | Onderwerp |
|---|---|
| `d2d2484` | scheidingsteken in de blog-badge — **niet van deze sessie**, viel ná de 224-summary |
| `213c5cf` | dode newsletter-doc opgeruimd — idem |
| `0d24f45` | NEW `nieuwsbrief-augustus-2026.html` + de `.mobile-padding`-selectorbug |
| `d589784` | "Die tweede regel" wees naar de eerste |
| `8cffcb8` | toonaanwijzing was kop geworden; accent bovenop vet |
| `614a489` | interne notities uit de mail, kennis naar de template |
| `a3e6c44` | preview-tekst |

### Werk

**De editie.** Tip = SQL-injectie via `sqlmap`, het juni-onderwerp uit de contentkalender dat
nooit verstuurd is. Nieuws: de `leren-hacken`-post en de vierde gids. Aanbeveling: de gratis
juridische sample. Alle claims tegen de **echte codepad** gemeten via dynamische import —
`MySQL 5.7.32`, 3 databases, `shop_db`/`users_db`, en de tweetraps consent-flow (eerste aanroep
toont alleen de waarschuwing en zét consent; de tool draait pas bij de tweede). Paginatelling
uit de PDF's zelf met `pdfinfo`: 13+19+21+19 = **exact 72**, dus "~72" mocht "72" worden.

**Verzendconventie herzien.** "Eerste dinsdag van de maand (beste open rates voor B2C NL)" had
twee problemen. De parenthese is een onbewezen claim — bij twee verstuurde edities is een
dag-van-de-week-effect niet meetbaar. En het anker faalt structureel: het rekent per
*kalendermaand* terwijl de cadans een *interval* is. Juli ging ~30 juli, de eerstvolgende eerste
dinsdag was 4 augustus, dus de regel dwong tot óf een gat van 5 dagen óf augustus overslaan.
Nu **derde dinsdag + minimaal 21 dagen**, met `date -d` gemeten: 19/28/35/28/28 dagen (aug→dec).

**Drie typografische defecten**, alle drie gevonden bij het nameten van "de tekst is klein":

1. **`.mobile-padding td` is een afstammeling-selector** terwijl de klasse óp de cel staat.
   `cel.matches('.mobile-padding td') === false`. De mobiele padding-verkleining heeft dus
   **nooit** gewerkt; de regel landde in plaats daarvan op de geneste code-block-cellen, waar hij
   met (0,1,1) de eigen `.code-block`-padding (0,1,0) versloeg. Kostte 32px tekstbreedte op élke
   mobiele weergave. Fix `td.mobile-padding`: +32px kolom, codeblok-budget 32→37 @375px, en de
   mail werd **366px korter**.
2. **Vet erfde exact de bodykleur.** `rgb(139,148,158)` voor beide, **5,62:1** voor beide; alleen
   `font-weight` verschilde. De kopkleur (11,21:1) lag ongebruikt in het ontwerp. Fix: de
   bestaande `.heading-text` op de 11 strongs in lopende tekst (terminal-header en footer
   uitgezonderd).
3. **De Courier-familie is de uitschieter.** Canvas-inkmeting op 100px: Nimbus Mono PS (het
   Courier-ontwerp) **0,42**, Liberation Mono 0,53, DejaVu 0,55. En Courier New staat wél op
   Windows/macOS/iOS en níét op Android — dus aanwezig op precies de platforms waar hij het
   slechtst rendert. Gevolg: ~20% verschil in optische grootte per ontvanger. Nieuwe stack met
   JetBrains Mono voorop (het font dat de site zelf draait), Courier New als vangnet.

Body 15→16px erbij. Netto voor een iOS-lezer: x-hoogte **6,30 → 8,80px (+40%)**, en de mail
groeit maar 142px omdat de padding-fix de puntbump betaalt.

### Learnings

- **Een metrisch compatibel substituut is dat in breedte, niet in ontwerp.** Mijn eerste
  x-hoogtemeting gaf voor "Courier New" en "Arial" allebei 8px — verdacht, want Courier heeft een
  berucht kleine x-hoogte. `fc-match "Courier New"` → LiberationMono-Regular.ttf: het font staat
  niet op deze machine. Ik mat het substituut. Voor e-mail is dat structureel: je ontwerpt voor
  fonts die je niet kunt zien, dus draai `fc-match` vóór je typografie beoordeelt.
- **"De tekst is klein" is niet één knop.** Puntgrootte, x-hoogte en regellengte beïnvloeden
  elkaar. Ik greep naar de enige die ik al in beeld had (17px) en dat kostte +1085px hoogte én
  dúwde de regellengte naar 25 tekens. Heisenbergs vraag "kunnen we niet beter een ander
  lettertype kiezen?" was de goedkopere hefboom: grotere x-hoogte bij gelijke px = nul extra
  maillengte.
- **Introduceer niets wat de lezer niet kan herleiden.** Drie feedbackrondes waren dezelfde fout
  in een andere vermomming: de aanvallersinvoer die nergens getoond werd, databasenamen die niet
  vertaald waren, apostrofs op precieze plekken zonder uitleg wie ze daar zette. Wie het
  onderwerp kent leest eroverheen — alleen een lezer die het níét kent merkt het, en die spreek
  je pas ná verzending.
- **Een positieverwijzing heeft een impliciete aanname over hoe de ander telt.** "Die tweede
  regel" wees in een blok van drie (label + 2 regels) naar de regel die juist *wél* van de site
  kwam. Zelfde klasse als de CSS-les uit Sessie 223: bind aan wat je bedoelt, niet aan waar het
  staat.
- **Een toonaanwijzing is geen kop.** `maandelijks-template.md:179` zei *Toon: geen harde sell,
  "Misschien handig" vibe*. Juli nam die omschrijving letterlijk als kop over, augustus
  kopieerde juli. Twee edities lang stond er een kop die de lezer vertelt dat hij het blok kan
  overslaan.
- **De teller liep al achter vóór deze sessie.** Docs claimden 40 specs / 304 declaraties /
  1104,61 KB; gemeten 41 / 305 / 1106,46. Alle drie de delta's komen uit `d2d2484`, een commit
  die ná de 224-summary viel. Attribueer aan de veroorzaker, niet aan de laatste commit.
- **Twee greps liepen vast op catastrophic backtracking** (`[^<>]{0,50}(a|b|c)[^<]{0,60}` op lange
  HTML-regels), en mijn `pkill -f "grep -oE"` schoot daarna zijn eigen shell af omdat het patroon
  in zijn eigen commandoregel stond. `grep -F` met vaste strings deed het werk direct — dat was
  hier ook de juiste tool, want ik zocht letterlijke frasen.

### Metrics delta

| | Sessie 224 | Sessie 225 | Oorzaak |
|---|---|---|---|
| Spec files | 40 (genoteerd) | **41** | `d2d2484`, niet deze sessie |
| `test()`-declaraties | 304 (genoteerd) | **305** | idem |
| Bundel | 1104,61 KB | **1106,46 KB** | `styles/blog.css` in `d2d2484` |
| Marge tot 1120 | 15,39 KB | **13,54 KB (1,21%)** | |

Deze sessie raakte **nul** bestanden in `src/`, `styles/`, `tests/`, `blog/` of enige pagina —
uitsluitend `docs/newsletter/`.

### Next steps

- **Verzenden ligt bij Heisenberg.** Import HTML in Brevo (niet de drag-and-drop editor),
  testmail in de Gmail-app in dark mode, `{{ unsubscribe }}` echt aanklikken. Let bij die
  testmail extra op de codeblokken: de fontstack is nieuw en gaat voor het eerst door een
  echte client.
- **De drie welkomstmails dragen nog het oude `<style>`-blok** (oude selector, oude fontstack).
  Dat is geen drift maar historie; werk je er ooit een bij, neem dan het augustus-blok mee en
  importeer opnieuw in Brevo.
- **`gidsen.html` zegt "~72 pagina's"** terwijl de PDF's exact 72 tellen. Losse correctie.
- **Marge onder 1120 is 1,21%** — de volgende niet-triviale wijziging raakt de grens, en dan is
  de vraag niet weer een bump (1000→1050→1100→1120 is drie bumps in 18 sessies).

---
