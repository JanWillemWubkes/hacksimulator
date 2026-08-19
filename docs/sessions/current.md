# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

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

## Sessie 224: De dader was 280px breed en 377px lang — de scan keek naar het verkeerde getal (16-17 aug 2026)

**Mission:** TASKS #67 afmaken: de 22px horizontale overflow op `assets/legal/terms.html` fixen én het dekkingsgat sluiten — de drie legal-pagina's kwamen in géén enkele assertie voor, in geen enkele spec. Sessie 223 had de overflow gemeten en via A/B tegen `git archive HEAD` als pre-existing bevestigd, maar de oorzaak bleef staan als *"niet vastgesteld — vermoedelijk een pseudo-element of scroll-regio"*.

**Commits:**

| | | |
|---|---|---|
| `0bffca5` | 16 aug | De dader was 280px breed en 377px lang — de scan keek naar het verkeerde getal |

### De oorzaak: twee getallen op hetzelfde element

De notitie van Sessie 223 zei dat **geen enkel element** met zijn border-box buiten beeld viel. Dat klopte — en juist daarom wees het de verkeerde kant op. De `<h1>` **is** 280px breed en blijft netjes binnen de viewport; het is zijn **inhoud** die 377px meet. `getBoundingClientRect().right` en `scrollWidth` zijn twee verschillende metingen op hetzelfde element, en de scan las alleen de eerste.

Daaronder zat een structureel feit dat niemand eerder had opgeschreven: **de drie legal-pagina's laden `mobile.css` niet.** Ze linken alleen `main.css` en `legal.css` (regel 33-34). Daardoor mist `@media(max-width:768px){:root{--font-size-base:var(--font-size-mobile)}}`, blijft `html{font-size:18px}` staan tot 320px, en overleeft de UA-default `2em` op de h1 — want er staat **nergens** een `font-size` op `h1` (`main.css:426-431` zet alleen family, weight en line-height). Resultaat: **36px, ook op 320px**. Elke andere pagina op de site schaalt daar mee; deze drie niet.

"Gebruiksvoorwaarden" is 19 tekens zonder breekpunt en meet dan 377px in een contentbox van 280px (`body.legal-page` = `max-width:800px; padding:20px`, `box-sizing:border-box`). De documentbreedte is dus 20px linkerpadding + 377 = **397px, ongeacht viewport**. Dat verklaart de hele gemelde reeks als één som:

| viewport | 320 | 360 | 375 | 390 | 414 |
|---|---|---|---|---|---|
| doc-overflow | 77 | 37 | 22 | 7 | 0 |
| = 397 − viewport | 77 | 37 | 22 | 7 | (397 < 414) |

Firefox en WebKit meten consequent 378/398 in plaats van 377/397 — subpixel, geen tolerantie nodig.

Privacy en cookies ontsnappen omdat hun koppen uit **twee woorden** bestaan (er is een breekpunt), niet omdat ze korter zijn. Dat is een correctie op de opdrachtbriefing, die aannam dat er "Privacybeleid" (13) en "Cookiebeleid" (12) stond. Er staat **"Privacy policy"** en **"Cookie policy"** — Engels, op een `lang="nl"`-pagina. Zie #68.

### Het symptoom is afkapping, geen scroll

De briefing zei: *"Het is echt scrollbaar … De bezoeker ziet de pagina zijwaarts schuiven."* De meting klopte, de duiding niet. `main.css:414-422` zet `overflow-x: hidden` op `body`, en omdat `html` op `visible` staat **propageert dat naar de viewport**. Gevolg: `window.scrollTo(9999,0)` verplaatst de pagina wél (programmatisch scrollen is niet geblokkeerd door `overflow:hidden`) maar de bezoeker kan niet pannen. De screenshot @320px op HEAD toont wat hij écht ziet: **"Gebruiksvoorwaa"**, afgekapt op de viewportrand.

### De fix, gekozen op meting in drie motoren

Drie kandidaten, elk via `page.addStyleTag` op de echte pagina, met `document.fonts.load()` vóór het meten (Sessie 222-les: `fonts.ready` resolvet vóór een nog niet aangevraagd font):

| kandidaat | chromium | firefox | webkit |
|---|---|---|---|
| `overflow-wrap: break-word` | **0** | **0** | **0** |
| `hyphens: auto` | 77 ✗ | 0 | 78 ✗ |
| `clamp()` op font-size | verworpen op rekenwerk | | |

De discriminator was **waar de breuk valt**. `overflow-wrap` breekt op het laatste teken dat past: `Gebruiksvoorwa|arden` (14 tekens, WebKit 15). Firefox met `hyphens:auto` breekt op `Gebruiksvoor|waarden` (12) — een lettergreepgrens, dus Firefox heeft nl-hyphenatiepatronen en Chromium/WebKit niet. Eén van drie motoren is te weinig voor een cosmetische verbetering die de rendering per engine laat verschillen; `hyphens` is afgevallen en dat staat nu in het CSS-commentaar, zodat niemand dit experiment overdoet.

`clamp()` faalt op de genericiteitseis, gemeten in plaats van geschat: `Verwerkersovereenkomst` meet 437px (137px overflow) en `Aansprakelijkheidsbeperking` 502px (202px overflow). Die laatste zou **20,1px** font vragen om in 280px te passen — bodytekst-formaat voor een `h1`. Met `overflow-wrap` gaan beide naar 0. (Mijn vooraf-schatting was 535px en 18,8px; 6% te hoog, en dat is precies waarom het gemeten moest worden.)

**Scoping:** `body.legal-page h1, h2, h3`, niet de container. `blog.css:846-855` doet het containerbreed op `.blog-container`, maar hier zou dat de `<td>`-afbreking veranderen in de `overflow-x:auto`-tabellen die `legal.css:145-150` op ≤768px maakt. De guard dekt de klasse, de CSS dekt het bekende geval.

**A/B tegen HEAD** (`git archive HEAD` naar poort 8902, nieuw naar 8901):

| breedte | HEAD | FIX |
|---|---|---|
| 1280 | kop 760/760, hoogte 43px, doc 9448 | 760/760, 43px, **9448** |
| 768 | kop 728/728, hoogte 43px, doc 9563 | 728/728, 43px, **9563** |
| 375 | 377/335, overflow 22 | 335/335, overflow **0**, kop 43→86px |
| 320 | 377/280, overflow 77 | 280/280, overflow **0**, kop 43→86px |

Desktop is byte-identiek in kopbreedte, kophoogte én documenthoogte. Alleen de *computed property* verschilt (`normal` → `break-word`): de regel is daar aanwezig maar inert.

### De spec: twee asserties die op verschillende breedtes falen

`tests/e2e/legal-pages-overflow.spec.js` — de eerste assertie ooit op `assets/legal/*`. 3 pagina's × [320, 375, 414] × 2 thema's, uit **één** `test()`-declaratie.

```
A  documentElement.scrollWidth − clientWidth ≤ 0      (pagina schuift/clipt niet zijwaarts)
B  per kop: scrollWidth ≤ clientWidth + 1             (koptekst binnen de eigen box)
```

B is strenger en dat is opzet: **@414px is A groen** (397 < 414) **terwijl de kop zijn box nog 3px overschrijdt**. Zonder B zou het defect vanaf 414px onzichtbaar zijn voor de suite. 320px zit erbij omdat het defect daar 3,5× groter is en die maat nooit getest werd; 414 omdat de pagina daar op exact 0 stond, dus elke verbreding wordt er meteen rood.

**Zelfbewakende tak:** HTTP-status 200 + een `<h1>` met niet-lege tekst en breedte > 0. Een 404 heeft nul overflow en zou de test anders groen laten staan zonder iets te meten.

**Twee engine-meetvallen, alleen uit de meting gevonden:**

1. **Kinderen van een scroll-container houden hun onafgekapte rect.** Op privacy/cookies meldde de border-box-scan `TBODY right 561`, `TR right 561`, `TH right 334` op **elke** breedte in **elke** motor — dat zijn de ≤768px-tabellen die legitiem in zichzelf scrollen. Ongefilterd vult dat de hele diagnoselijst en duwt het de echte dader uit de `slice(0,5)`. Opgelost door de ancestor-keten te lopen tot `body`.
2. **Firefox geeft `clientWidth: 0` op inline-elementen.** Elke `<strong>` kwam terug als `158>0`, want `clientWidth` is per definitie 0 op inlines. Ongefilterd zou assertie B permanent rood staan in één motor. Opgelost door `display !== 'inline'` te eisen; B zelf kijkt alleen naar h1/h2/h3 en die zijn block-level.

### Mutanten: elkaars complement

| mutant | A | B | uitkomst |
|---|---|---|---|
| `overflow-wrap` weg | rood @320 (77) en @375 (22) | rood @320, @375 **én @414** | 9 rood / 18 groen, alleen terms |
| `min-width:700px` op body | rood op **alle drie** de pagina's | **overal groen** | 27 rood |

Mutant A maakt B rood waar A groen is → B is niet overbodig. Mutant B maakt A rood waar B groen blijft → A is niet overbodig. En mutant B is het **enige** bewijs dat `privacy.html` en `cookies.html` werkelijk gemeten worden: die zijn vóór én ná de fix groen, dus zonder een mutant die ze rood maakt is hun dekking niet gefalsifieerd. Beide mutanten met `cp` + `sed` + **`diff -q`** aangebracht, omdat twee van de vier mutanten in Sessie 223 het bestand niet veranderden en daarom vals groen bleven.

De foutmelding van mutant A luidt letterlijk `Buiten beeld: (niets). Inhoud buiten eigen box: H1 377>280` — de border-box-scan vindt niets (precies zoals in Sessie 223) terwijl de inhoud-scan de dader bij naam noemt. Dat is de hele les in één regel.

### Verificatie

- Nieuwe spec **27/27 groen** over chromium/firefox/webkit (34,3s)
- Regressie `responsive-breakpoints` + `responsive-ascii-boxes` op chromium: **60 passed / 3 skipped** (de bestaande `test.skip`'s)
- `validate-docs.sh --deep` **exit 0** (16 checks) en `validate-blogs.sh` **exit 0**
- Bundeltest groen: **1104,61 / 1120 KB**, marge 15,39 KB (1,37%)
- Screenshots @320px, beide thema's, alle drie de pagina's → `.playwright-mcp/s224-*.png`

### Metrics delta

| | vóór | ná |
|---|---|---|
| spec files | 39 | **40** |
| `test()`-declaraties | 303 | **304** (die er 9 genereert) |
| bundel | 1103,43 KB | **1104,61 KB** (+1,18 KB, volledig commentaar) |
| `styles/` (validate-docs Check 5) | 439 KB | **440 KB** (band 417-460) |

De declaratietelling is een valstrik: mijn spec heeft **één** `test(` binnen een dubbele `for`-lus die er negen genereert. Had ik de delta uitgerekend in plaats van gemeten, dan stond hier 312. Dit is het vierde bestand met dat patroon, naast `lead-magnet`, `navbar-collapse` en drie blokken in `hero-demo`.

### Next steps

- **#68** — `privacy.html` en `cookies.html` voeren Engelse koppen ("Privacy policy" / "Cookie policy") in `<h1>`, `<title>`, `og:title` en `twitter:title` op een `lang="nl"`-pagina, terwijl de site er in het Nederlands naar linkt (*"Lees ons privacybeleid"*, `index.html:828,951` e.a.). Niet meegenomen: een hernoeming raakt 4 metatags × 2 bestanden, `sitemap.xml` en ~20 linklabels — eigen taak met SEO-lockstep. **Gemeten en géén blokkade:** `Privacybeleid` en `Cookiebeleid` passen @320px met 0 overflow, **ook zonder** de fix van #67. De aanname in het plan dat de fix die hernoeming "ongevaarlijk maakt" was te sterk; hij was al veilig.
- Kandidaat voor `architecture-patterns.md` §15: border-box vs. content-box zijn twee metingen op hetzelfde element. Nu vastgelegd in het CLAUDE.md-learningsblok; als het patroon nog eens terugkomt hoort het in de rules-file.

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

Uitgewerkt met code in `.claude/rules/css-layout.md` §9 (themavarianten en focusregels vechten
op bronvolgorde) en §10 (kleur volgt de effectieve achtergrond, niet het merk).

> Deze verwijzing stond tot Sessie 229 op `.claude/CLAUDE.md` §Recent Critical Learnings — maar
> dat blok rouleerde per sessie, dus de pointer wees al sinds Sessie 222 naar niets. Learnings
> horen bij een bestemming die ze houdt.

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

Uitgewerkt met code in `.claude/rules/css-layout.md` §11 (`transition: all` + geërfde
`visibility` = een knop die achterloopt) en `.claude/rules/js-runtime.md` §12
(IntersectionObserver als trigger, één predicaat als regel).

> Zelfde correctie als bij Sessie 215 hierboven: de oude pointer naar CLAUDE.md
> §Recent Critical Learnings was door de rotatie leeg komen te staan.

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

---

## Sessie 218 — learnings (geroteerd uit CLAUDE.md, Sessie 224)

> Oorspronkelijke kop: *De strook onder de terminal was AdSense-vulling die AdSense vijf maanden overleefde* (09 aug 2026)

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


---

## Sessie 219 — learnings (geroteerd uit CLAUDE.md, Sessie 225)

**Onderwerp:** Onder "in cijfers" was de homepage één blok — en de band die als voorbeeld gold, maakte in light mode nul verschil (09 aug 2026)
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

---

## Sessie 220 — learnings (geroteerd uit CLAUDE.md, Sessie 226)

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
