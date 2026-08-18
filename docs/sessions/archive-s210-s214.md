# Sessie-archief 210-214 - HackSimulator.nl

**Geroteerd uit `current.md` bij Sessie 225** (steady-state `N % 5`-rotatie, zie
`docs/sessions/README.md` §Rotatie-regel). Nieuwste-eerst binnen dit blok.

> Dit blok bevat naast de vijf sessie-entries ook de drie **learnings-blokken** van 212,
> 213 en 214 die eerder uit `.claude/CLAUDE.md` waren geroteerd. Die horen bij hun sessie:
> ze losknippen zou "Sessie 212 — learnings" in `current.md` laten staan terwijl entry 212
> hier zit (de val die bij Sessie 220 werd vastgesteld).

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

