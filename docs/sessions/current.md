# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

---

## Sessie 232: De bloat zat niet in de code — twee "debugtests" klikten alleen een modal weg (5 september 2026)

**Mission:** "analyseer dit project op bloat — zijn er bestanden die niet meer nodig zijn of
dubbel zijn?" Doel was een schone, goed georganiseerde projectmap.

### Diagnose: de code was al schoon, en dat is de hoofdbevinding

Gemeten vóór er iets werd weggegooid, per basename over de hele repo behalve `node_modules`
en `.git`:

```
src/      118 JS-modules      0 ongebruikt
styles/    11 stylesheets     0 verweesd
assets/    36 bestanden       0 ongerefereerd
tracked   387 bestanden       0 md5-duplicaten
```

Er viel in de applicatie dus niets weg te gooien. Dat is een compliment aan de validate-scripts
en de 8-staps command-checklist: die houden de code schoon. De bloat was verschoven naar de
lagen die géén guard hadden.

### Werk

**(a) Schijf-cruft, 153M → 97M.** `.playwright-mcp/` stond op **55 MB in 1111 screenshots**
(mrt–aug 2026; 147 uit juni, 143 uit augustus) — meer dan alle broncode, docs en assets samen.
Plus `playwright-report/` (608 KB) en `test-results/`. Alle drie gitignored, en juist daardoor
onzichtbaar in `git status`. De twee sample-PDF's in `docs/products/` bleken bovendien
**md5-identiek** aan de geserveerde `assets/samples/*.pdf`.

**(b) `git gc`, 69M → 26M.** `git count-objects -vH` gaf 3388 losse objecten (44,31 MiB) naast
4 packs (23,02 MiB). Losse objecten krijgen geen delta-compressie, en de historie bestaat
grotendeels uit honderden revisies van `current.md`/`SESSIONS.md` van 500–600 KB die onderling
nauwelijks verschillen — precies waar delta-packing wint. Ná: 0 los, 1 pack, `git fsck` schoon.
**Bewust niet gedaan:** `filter-repo`/BFG om die blobs uit de historie te snijden. Dat
herschrijft elke commit-hash en breekt elke `git`-verwijzing in TASKS.md en de archieven, voor
minder winst dan een `gc`.

**(c) Twee tests die niet konden falen op hun eigen onderwerp.**

```
debug-console.spec.js   2 expects  15 console.logs
debug-storage.spec.js   4 expects  15 console.logs
```

Alle zes `expect()`-calls doen hetzelfde: het legal-modal wegklikken als setup. Geen enkele
assertie over console-errors of localStorage — de bestanden printten, en een mens moest kijken.
Ze draaiden wel mee in elke run over drie motoren, en wekten de indruk dat die paden gedekt
waren. De echte dekking staat assertief in `persistence-flush.spec.js` (flush-on-hidden voor
challenges én VFS) en `vfs-versioning.spec.js` (matchende signature, stale save, verse
bezoeker). `modal-colors-simple.spec.js` (2 expects) was een strikte subset van
`modal-headers.spec.js` (7 expects, dekt legal + feedback + de neon-green-guard). 45 → 42 specs
zonder verlies van één assertie.

**(d) Het grootste getrackte bestand was een dood meetartefact.**
`docs/testing/lighthouse-m9-baseline.json`, **637 KB** — groter dan TASKS.md — en de enige
verwijzing in de hele repo was een *uitsluitingsregel* in `.gitleaks.toml`. Bij het opruimen
daarvan bleek de meting het waard: van de vier exclusies was er maar **één** exclusief van dat
bestand afhankelijk (`AIDAQEBA{13}`). Het commentaar bij `ca-pub-6345664385525701` noemde
expliciet "een historisch Lighthouse-rapport", maar die ID staat óók in
`archive-s175-s179.md` — beide schrappen had de CI-secretscan rood gemaakt. Het commentaar was
een bewering: het zei waar de match vandaan kwam, niet waar hij overál vandaan komt.

**(e) Verweesde docs, per bestand beoordeeld.** Vier plandocumenten in `docs/archive/` plus
`docs/milestones/m5-audit-report.md` hadden nul verwijzingen. `docs/netlify-setup.md` is even
verweesd maar operationeel en blijft staan — verweesd is een reden om te kijken, geen
verwijderargument. Ook weg: `tests/e2e/test-report.md`, een subset van
`CROSS-BROWSER-TEST-REPORT.md` (zelfde suite, zelfde datum 22 okt 2025); de langere verhuisde
naar `docs/testing/` bij de vier andere.

**(f) NEW Check 20 in `validate-docs.sh`** — op verzoek, nadat de opruimstap eerst als notitie
in `/summary` Step 7 was gezet.

`20a` meet de omvang met **twee** drempels: warn vanaf 10 MB, fail vanaf 50 MB. Bewust
verschillend. Een volle map is rommel, geen defect — er lekt niets en de site werkt. Alleen
warnen scrollt voorbij in twintig checks; alleen falen blokkeert een commit midden in een
debugsessie en leert je `--no-verify`, wat de guard erger maakt dan geen guard. De 50 is geen
rond getal maar de gemeten stand waarop het probleem ontdekt werd (55 MB).

`20b` faalt zodra er iets getrackt onder die paden staat. Dat bewaakt de aanname waaronder de
`rm -rf` uit Step 7 veilig is, en het is de subcheck die **wél** in CI vuurt — daar bestaan die
mappen nooit, dus `20a` meet er per definitie 0 MB.

Beide dragen een ijkmeting (`du -sb src` ≥ 100 KB, `git ls-files src` ≥ 1 bestand), want de
mappen zijn er meestal niet en "0 MB, niets getrackt" is anders niet te onderscheiden van een
script dat in de verkeerde map draait.

Vijf mutanten, elk op een **andere** assertie:

```
15 MB artefacten          20a WARN        script exit 0  (blokkeert niet)
60 MB artefacten          20a FAIL        script exit 1
getrackt bestand erin     20b FAIL        20a bleef OK
du naar leeg pad          20a ijk-FAIL
git ls-files naar leeg    20b ijk-FAIL
```

### Learnings

**Een pipe verbergt de exit-code van het commando dat je meet.** Mijn eerste volle suite draaide
als `npx playwright test ... | tail -40` en rapporteerde exit 0. Dat was `tail`'s exit-code. De
werkelijke run was afgekapt door mijn eigen `--global-timeout=1800000`: **672 passed, 862 did
not run, 1 interrupted**. Erger: de `| tail` buffert tot EOF, dus het outputbestand bleef 0
bytes en er was geen tussenstand mogelijk. Correcte meting daarna: `> bestand 2>&1` gevolgd door
`echo "PLAYWRIGHT_EXIT=$?"` → **1520 passed / 0 failed / 0 did not run** in 1.3h.

**Dit stond al opgeschreven en heeft niet geholpen.** De `**Versie:** 6.02`-entry van Sessie 229
eindigt met: *"⚠️ Een eerste volle run gaf exit 0 mét `55 did not run` — een global-timeout op
gevoel i.p.v. op een meting."* Exact hetzelfde patroon, één sessie eerder, en het herhaalde zich
toch. Een sessielog laadt niet mee in de volgende sessie. Daarom is de regel deze keer naar
`.claude/rules/meten-en-guards.md` gegaan (scoped op `tests/e2e/**` en `scripts/**`, dus hij
laadt vanzelf zodra iemand een testrun aanraakt) in plaats van naar een derde sessielog dat
hetzelfde nog eens vertelt.

**Ik heb tijdens het verifiëren 37 MB nieuwe bloat gemaakt.** De drie testruns vulden
`test-results/` (video's via `retain-on-failure`) en `playwright-report/` opnieuw, en die stonden
bijna in de eindmeting. Opgeruimd na het uitlezen — maar het illustreert waarom Check 20 nodig
was: deze mappen groeien door normaal werk, niet door nalatigheid.

**Drie Firefox-flakies blijven staan:** `blog-theme-toggle`, `tutorial-mobile`, `tutorial`, plus
`persistence-flush.spec.js:76` in de gerichte run. Alle vier timing, alle vier groen bij retry.
Die laatste is ongemakkelijk: het is precies de test die de dekking van het geschrapte
`debug-storage.spec.js` overneemt. Hij dekt het assertief, maar stabiel is hij niet — en "de
dekking bestaat al" is een sterkere claim dan "de dekking bestaat al en is stabiel". Alleen het
eerste is gemeten waar.

### Metrics delta

```
schijf         153M → 53M        (.git 69M → 26M, werkbestanden 8,6M)
specs           45  → 42
test()         316  → 315
getrackt       387  → 377
bundel        1104,62 → 1104,85 KB / 1120  (marge 15,15 KB)
checks          19  → 20
```

### Next steps

- **`.playwright-mcp/` groeit door normaal werk.** Check 20 meldt het nu, maar de opruiming is
  handwerk in `/summary` Step 7.
- **De vier Firefox-flakies** horen gemeten te worden, niet gewend — er is geen baseline van
  bekende falers.
- **TASKS.md's footer-marker staat op 29 regels van het einde** (Check 2 eist < 30). Elke sessie
  voegt een `**Versie:**`-regel bóven die marker toe, dus de volgende sessie breekt hem.

---

## Sessie 231: `publish = "."` zette de bron van vier betaalde gidsen op de CDN (22–24 augustus 2026)

> **Achteraf gereconstrueerd in Sessie 232** uit de acht commits. Deze sessie kreeg destijds
> geen `/summary`, terwijl acht codebestanden zichzelf al "Sessie 231" noemen — de code kende
> het nummer, de documentatie niet. Precedent: Sessie 227 is op dezelfde manier gereconstrueerd.

**Mission:** niet vooraf vastgelegd. Uit de commits blijkt een securityronde die uitwaaierde
naar CI-gates, privacy en een paar copy-defecten.

### Het lek

Er is geen build-stap, dus de Netlify publish-root is de repo-root: **alles wat git trackt werd
geserveerd**. Gemeten op productie, allemaal HTTP 200:

```
/docs/products/pentest-playbook.typ    24.584 bytes
/docs/products/leerplan.typ            36.373 bytes
/docs/products/lab-opzetten.typ        31.067 bytes
/docs/products/juridische-gids.typ     17.830 bytes
```

Dat is de volledige inhoud van de vier Gumroad-gidsen, gratis naast de betaalde PDF.
`.gitignore` sluit `docs/products/*.pdf` uit en houdt de `.typ`-bron bewust getrackt — een keuze
die klopte zolang niemand de map kon opvragen. Daarnaast stond `archive-s121-s164.md` live
(388 KB) met drie privé-mailadressen van de eigenaar, naast `/TASKS.md`, `/PLANNING.md`,
`/SESSIONS.md`, `/scripts/*.sh` en `/package.json`. `robots.txt` had `Disallow: /docs/`, maar
dat is indexeringsadvies en geen toegangscontrole.

### Werk

**(a) Check 19, met de populatie omgedraaid.** Niet "staan de paden die ik nu ken in een
blokkeerlijst", maar "élke top-level entry die git trackt wordt door `publish = "."` geserveerd,
dus verantwoord je". Een entry mag dat op drie manieren, alle drie gemeten tegen productie:
dotfile/dotdir (Netlify serveert die nooit), `netlify.toml`/`_headers` (wordt geconsumeerd), of
de expliciete PUBLIEK-allowlist. Al het overige moet een 404-redirect hebben. Een lijst-guard
bewaakt zijn lijst — precies daardoor kon `docs/products/` meeliften. 19b vangt
privé-mailadressen als *klasse* (consumenten-mailproviders), niet als lijst.

**(b) Check 19 betrapte in zijn eerste CI-run de commit die hem introduceerde.**
`package-lock.json` uit `.gitignore` halen maakte er een getrackte top-level entry van — precies
de klasse die 19a bewaakt. Twee redenen dat het lokaal groen was, beide gerepareerd: validate-docs
draaide vóór `git add` (Check 19 leest `git ls-files`, dus een ongestaged bestand bestaat voor hem
niet), en de pre-commit-hook draaide helemaal niet omdat zijn `files:`-patroon `netlify.toml` noch
`.gitignore` dekte — terwijl Check 19 juist `netlify.toml` uitleest en een `.gitignore`-wijziging
een bestand nieuw deploybaar maakt.

**(c) 450 KB derde-partij-JS dat niets meer deed.** Brevo's `main.js` stond op vier pagina's en
laadde vóór elke toestemmingsvraag, terwijl `brevo-submit.js` het submit-event in de capture-fase
onderschept met `stopImmediatePropagation()` en de POST zelf doet — Brevo's eigen handler kwam er
niet meer aan te pas. Ablatie gemeten in plaats van beredeneerd, want "Brevo-assets" is één naam
voor twee verschillende dingen:

```
main.js         450,6 KB   render byte-identiek zonder (zelfde MD5)  → weg
sib-styles.css   57,6 KB   kaart verschuift 74px zonder              → blijft
```

Zelf-hosten van die stylesheet viel af op de bundel (1118,63/1120 KB). Hij staat nu expliciet in
het privacybeleid in plaats van dat je hem in je netwerkverkeer moet ontdekken; het beleid noemde
vier verwerkers niet.

**(d) `try/catch` dekt kapotte JSON, niet geldige JSON van de verkeerde vorm.** `"hoi"`, `[]` en
`null` zijn allemaal geldige JSON, komen dus nooit in de `catch`, en werden daarna als object
geïndexeerd. De fallback bestond in alle drie de gevallen al — hij werd alleen niet bereikt.
`progress-store.load()` → `_defaults()`, `tutorial-manager._load()` → `null`, `._loadHints()` →
`{}`. Zelfde patroon als `history.js:180` en `vfs.js:469`, die dit al deden.

**(e) De rotatieformule uit `/summary` verwijderd.** Hij droeg `archiveer [N-10 .. N-6]` en gaf
twee keer aantoonbaar de verkeerde actie (Sessie 215: 205-209 i.p.v. 200-204; Sessie 230:
220-224 i.p.v. 215-219). Het patroon is niet "de formule is fout" maar "er is een kopie": de
correctie werd bij 215 al vastgelegd en de formule verhuisde naar een ánder document in plaats
van te verdwijnen. Nu een verwijzing naar de eigenaar (`docs/sessions/README.md`) plus een
falsificatietabel, zodat "hier stond ooit een getal" niet als omissie leest.

**(f) Copy.** De AI-tooltip uit 15 blogposts — gematcht op de exacte 107-byte string en niet op
`title=`, want dezelfde pagina's dragen 149 `abbr`-jargontooltips en 16 RSS-link-titles die een
brede strip zou hebben meegenomen; beide tellingen staan als zelfbewakende tak. En een CTA op
`over-ons.html` die "Direct aan de slag" beloofde en één regel later "Nieuw met hacken? Lees
eerst ..." zei — een aarzelprikkel op precies het punt waar de bezoeker de knop indrukt.

### Learnings

- **Een lijst-guard bewaakt zijn lijst, niet de klasse.** Dit is dezelfde les als bij de
  contrastsweep (Sessie 228) en de ligaturen (Sessie 229), nu in een securitycontext.
- **`git ls-files` ziet geen ongestagede bestanden.** Een guard die daarop leest, moet ná
  `git add` draaien — anders meet je de vorige toestand.
- **`Disallow` is geen toegangscontrole.** Het is een verzoek aan crawlers, geen 404.

---

## Sessie 230: Het nieuwsbriefblok viel buiten de filterpopulatie — en rekte via één grid-track alle 15 kaarten op (21 aug 2026)

**Mission:** een melding met screenshot — `/blog/#gevorderden` toont bovenaan het
inschrijfformulier en geen enkel artikel. Opdracht: analyseren en perfectioneren.

### Diagnose

Het categoriefilter is CSS-only via `:target` en verbergt **uitsluitend** `.blog-post-card`
(`blog.css` groep 1). Het nieuwsbriefblok staat als 4e kind ín `.blog-posts-grid` en draagt
géén `data-category`, dus het viel buiten die populatie en bleef in élke filterstand staan waar
het stond. De drie kaarten ervóór zijn `beginners`, `tools`, `tools`.

Gemeten op de live site, alle 7 standen — geen randgeval maar **4 van de 6 categorieën**:

```
#all          15 kaarten   kaart eerst
#beginners     4           kaart eerst
#tools         5           kaart eerst
#concepten     3           NIEUWSBRIEF eerst
#carriere      1           NIEUWSBRIEF eerst
#bronnen       1           NIEUWSBRIEF eerst
#gevorderden   1           NIEUWSBRIEF eerst
```

`beginners` en `tools` waren toevallig goed omdat hun eerste match vóór het blok valt. Dat is
precies waarom één screenshot dit niet vertelt en zeven metingen wel.

### Werk

**(a) De volgorde.** Groep 4 in het `:target`-blok: `order: 1` zodra er gefilterd wordt.
Klasse-gebaseerd op `.category-target` in plaats van zes id-selectors erbij — groep 1 t/m 3
móéten enumereren (er is geen selector die `[data-category]` aan een target-id koppelt), deze
niet. De ⚠️-comment erboven zei "ALLE DRIE DE GROEPEN" en zegt nu expliciet dat groep 4 zichzelf
bijhoudt, anders plakt de volgende sessie er onnodig een 7e selector bij.

Ongefilterd blijft het blok op index 3 staan. Dat is geen luiheid maar een gemeten
conversiekeuze: het blok staat nu op y=1871, de gridbodem op y=7329 — "gewoon onderaan" is
**5458px dieper** op een pagina van 7361px.

**Prijs, bewust betaald en als commentaar bij de regel vastgelegd:** in de zes gefilterde
standen wijkt de DOM-volgorde af van de visuele. Een toetsenbordgebruiker tabt eerst door het
formulier en daarna naar het artikel dat erbóven staat. De node in JS verplaatsen zou dat óók
repareren, maar breekt de belofte in `blog-filter.js:12` dat er functioneel niets verandert als
het script wegvalt — en beide volgordes zijn betekenisbehoudend: het zijn twee losse blokken,
geen omgedraaide leesvolgorde bínnen één component.

**(b) Eén grid-item rekte alle 15 kaarten op.** `blog.css` zette `width: 280px` op de
Brevo-input — twee keer zelfs, in twee near-duplicate blokken. De mobiele tegenregel
`.newsletter-form input[type="email"] { width: 100% }` is (0,2,1) tegen (0,3,1) en verloor; een
media query voegt geen specificiteit toe. Computed op 375px was dus gewoon 280px.

Gevolg zat niet op de input maar op de héle lijst: 280px gaf het blok een **min-content van
400px**, en het was het enige grid-item boven 360px (alle 15 kaarten zitten eronder).
`.blog-posts-grid` heeft één impliciete `auto`-track, dus het breedste item sleept de rest mee:
**alle 15 kaarten renderden 400px breed in een container van 336px**, en
`main.blog-container { overflow-x: hidden }` knipte die 64px onzichtbaar weg. Daarom heeft
niemand het ooit gemeld.

De 280px staat nu in `@media (min-width: 769px)` — elkaar uitsluitende ranges in plaats van een
cascade-gevecht (`css-layout.md` §4).

```
@375px   input 308 -> 244    min-content 400 -> 232    track 400 -> 336
         kaartrand 412 -> 348  == containerrand 348      (nul clipping)
@1280px  input 316x48, knop 137, kaart 672               identiek aan vóór
```

**(c) De teller loog tegen schermlezers op de skip-link.** `blog-filter.js` behandelde élke hash
als categorie. `/blog/#main-content` — het doel van de skip-link, dus de eerste bediening die
een toetsenbordgebruiker tegenkomt — meldde "0 van 15 artikelen" in een `role="status"`-regio
terwijl CSS alle 15 kaarten toonde. Idem `#newsletter`, een id dat op deze pagina bestaat.
Valideert nu tegen de `.category-target`-ids die de pagina zélf declareert, dus een nieuwe
categorie is vanzelf geldig. Bijvangst: `aria-current` staat bij een onbekende hash nu op "Alle
posts", wat de visuele stand al deed.

### Guards

Drie nieuwe tests in `blog-navigation.spec.js`, elk met zelfbewakende tak. De mutanten vuren op
drie **verschillende** asserties, elk 1 failed / 10 passed — geen overlap:

| mutant | rood geworden test |
|---|---|
| `order: 1` weggehaald | geen filterstand begint met het nieuwsbriefblok |
| vaste inputbreedte terug | geen grid-item steekt buiten de container (@375px) |
| hash-validatie terug | een hash die geen categorie is, laat de teller met rust |

Opruiming: de bestaande tellertest hardcodeerde `15 artikelen`. Leidt het totaal nu uit de DOM
af, zodat blogpost #16 hem niet omgooit — de assertie toetst daarmee de formule in plaats van
het getal.

### Learnings

**1. Een geïnjecteerde `<style>` bewijst niets over de cascade — en dat kostte bijna een dode
fix.** Mijn eerste plaatsing van de `order`-regel stond in het bestand **vóór** een tweede
`width: 280px`-blok. Gelijke specificiteit, latere bronvolgorde wint, dus die regel had gewonnen
en mijn fix was dood geweest. Het live-experiment zei "werkt" omdat een via `<style>`
geïnjecteerde regel per definitie als laatste komt. `css-layout.md` §13 waarschuwt hier al voor;
hij redde me niet omdat die §13 over box-drawing-randen gaat en ik daar niet in las. Gevangen
door A/B te meten tegen een no-store server met verse loads.

**2. Een guard die groen blijft op een echte regressie is geen guard.** Mutant 1 (order weg) gaf
eerst `10 passed`. Oorzaak: de test deed `page.goto('/blog/')` en daarna `page.goto('/blog/#cat')`
in een lus — een URL die alleen in het fragment verschilt is een **same-document navigatie**,
dus er herlaadde niets en de meting werd onbetrouwbaar. Opgelost met een unieke query per stand,
wat óók representatiever is: zo komt een bezoeker via een gedeelde link binnen.

**3. Drie keer las iets als groen terwijl het dat niet was.** Alle drie dezelfde vorm — een
patroon dat niet kán vinden wat je zoekt:
- `10 passed` bij 11 chromium-tests: er dráaide er één niet, en mijn grep-patroon toonde geen
  `flaky`, dus het las als volledig groen.
- Mijn eigen mutant-runner eiste een positief eindblok (goed) maar zocht `^\s+[0-9]+ passed`
  terwijl er ANSI-escapes vóór het cijfer staan — hij meldde "GEEN EINDBLOK" op een run die
  gewoon 11/11 groen was.
- `grep -rn "geïnjecteerde <style>"` gaf nul treffers in `.claude/rules/`, waaruit ik bijna
  concludeerde dat de les nog niet gedocumenteerd was. Er staat `geïnjecteerde \`<style>\``, met
  backtick. Nul treffers betekende "verkeerd patroon", niet "staat er niet".

**4. De suite draait standaard tegen productie.** `playwright.config.js` zet
`baseURL: process.env.BASE_URL || 'https://hacksimulator.nl'`. Mijn eerste run gaf drie rode
tests die de bug in **productie** correct maten, niet een fout in mijn werkkopie. Voor
pre-deploy-verificatie hoort er dus `BASE_URL=http://localhost:8899` voor; na de deploy is
dezelfde suite meteen een echte productiegate.

**5. "Blog telt toch niet mee voor het budget" was een aanname met 15,38 KB marge eronder.**
Ik voegde ~2,5 KB CSS-commentaar toe terwijl `performance.spec.js` op 1104,62 / 1120 KB stond.
Gemeten in plaats van aangenomen: `styles/blog.css` en `src/ui/blog-filter.js` vallen in de
**Blog-pijler (budgetloos)** — totaal onveranderd, delta **0,00 KB**. De uitsluiting uit Sessie
227 dekt blog.css, niet alleen blogafbeeldingen. Goede uitkomst, maar de check was het punt.

### Nasleep: de rotatieformule in `/summary` verwijderd i.p.v. gecorrigeerd

De `/summary`-skill schreef *"archiveer [N-10 .. N-6]"*. Dat gaf bij deze rotatie 220-224,
wat 215-219 als ouder blok in `current.md` zou laten staan én een gat in de archiefreeks maakt.
`SESSIONS.md` legt exact dezelfde correctie al vast bij **Sessie 215** — toen stond de foute
notitie in `CLAUDE.md` en gaf hij 205-209 waar de README-regel 200-204 geeft.

Dat is het interessante deel: de correctie werd toen vastgelegd, maar de **formule verhuisde
mee** naar een ander document in plaats van te verdwijnen. Een kopie van een regel verjaart, de
eigenaar niet. De skill draagt daarom nu geen rekensom meer maar een verwijzing naar
`docs/sessions/README.md` §Rotatie-regel, plus de falsificatietabel die uitlegt waaróm er geen
getal meer staat.

Bij het schrijven van die fix maakte ik prompt dezelfde fout: mijn eerste versie zette drie
operationele punten in de skill, waarvan er **twee al woordelijk in de README stonden** (de
index-stap en de Python-occurrence-asserts). Alleen "neem het learnings-blok mee met zijn entry"
ontbrak daar — dus dat punt is toegevoegd bij de eigenaar, en de skill is teruggetrimd tot
verwijzing + historie.

Eén claim in die tekst is gemeten en niet aangenomen: `validate-docs.sh` noemt `SESSIONS.md`
nergens (0 treffers), dus een overgeslagen index-stap meldt zich inderdaad niet vanzelf — dat is
precies hoe hij bij Sessie 225 tien sessies lang onopgemerkt bleef.

### Commits

- `e55f21e` — Het nieuwsbriefblok viel buiten de filterpopulatie en rekte alle 15 kaarten op
- `11c89f0` — Sessie 230 /summary: het filter bewaakte een klasse waar het blok niet in zat

### Metrics delta

| | vóór | ná |
|---|---|---|
| E2E-bundel | 1104,62 KB | **1104,62 KB** (delta 0,00 — blog-pijler is budgetloos) |
| Blog-pijler (budgetloos) | — | 55,56 KB (`blog.css` 46,33) |
| `styles/blog.css` | 44.845 B | 47.437 B (+2,53 KB commentaar) |
| `src/ui/blog-filter.js` | 2.259 B | 3.023 B (+0,75 KB) |
| Playwright | 45 specs / 316 decl | **45 specs / 319 decl** |
| Cache-versies | `blog.css?v=229`, `blog-filter.js?v=1` | `?v=230`, `?v=2` |

Verificatie: `blog-navigation` 3 motoren **33 passed tegen productie** (lokaal 32 passed /
1 flaky), `validate-docs --deep` 18/18, `validate-blogs` 16/16, aangrenzende blogspecs 34 passed,
`performance.spec.js` 7/7. De lokale flaky is de bestaande test op regel 120 (firefox) en faalt
op **navigeren** — wachten op `sibforms.com` onder parallelle belasting, geen assertie; 3× los
herhaald alle drie groen in ~7s.

### Next steps

- Geen open punten uit deze sessie. #74 (minify-trigger) blijft uit: de marge is nog 15,38 KB
  en de groei van deze sessie viel buiten het budget.

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
