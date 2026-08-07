# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

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

## Sessie 209: W2 browserverificatie — kwaliteitsronde bewezen in de browser (05 aug 2026)

**Mission:** De drie terminalwijzigingen uit de Sessie-208-kwaliteitsronde (skip-certificaat DEELNAME vs VOLTOOIING, helpsysteem-escalatie bij correct command + verkeerd argument, bestaande localStorage-voortgang overleeft de leerpad-wijziging) waren nooit in een live browser getest. Schrijf en draai Playwright-tests die bewijzen dat ze werken.

**Branch:** `claude/ultraplan-opvolging-eyzgd4` (zelfde commit `61aa87b` als `claude/quality-assurance-content-strategy-x5rsbd`).

### Regressiecheck

Volledige Chromium-suite gedraaid tegen een lokale no-store server (`scripts/nostore-server.py` poort 8899): **237 passed / 7 failed / 5 skipped**. Alle 7 failures zijn pre-existing/omgevingsspecifiek:
- 5× `tutorial-gestures.spec.js` — iPhone 13 device-emulatie-artefact (geen echte touch in headless Chromium)
- 1× `responsive-ascii-boxes.spec.js` — live resize reflow timing
- 1× `tutorial-mobile.spec.js` — briefing render timing

Geen regressies van de kwaliteitsronde-wijzigingen.

### NEW `tests/e2e/w2-verification.spec.js` (6 tests)

**(a) Skip-certificaat onderscheid (2 tests):**
- `7x skip geeft DEELNAME-certificaat, niet VOLTOOIING`: start `tutorial fundamentals`, skip alle 7 stappen, assert `MISSIE DOORLOPEN` (niet VOLTOOID), `tutorial cert` → `CERTIFICAAT VAN DEELNAME` + `0/7`.
- `mix van solve + skip geeft correct aantal in certificaat`: los pwd+ls echt op, skip 5 stappen → `CERTIFICAAT VAN DEELNAME` + `2/7`.

**Code-pad bewezen:** `tutorial-manager.js:251-282` (skip incrementeert `currentStep` maar NIET `stepsSolved`) → `certificate.js:56` (`fullySolved = stats.stepsCompleted >= stats.totalSteps`) → `certificate.js:70` (VOLTOOIING vs DEELNAME label).

**(b) Helpsysteem-escalatie (2 tests):**
- `na 3x nmap zonder args verschijnt man-page-tip`: `nmap` 3× → `man nmap`-tip verschijnt.
- `escalatie vuurt NIET tijdens een actieve tutorial`: start tutorial, `nmap` 3× → tip verschijnt NIET (tutorial heeft eigen hint-ladder).

**Code-pad bewezen:** `terminal.js:392-397` (roept `helpSystem.recordUsageError()` aan als `_hasErrorOutput(output)` true is EN niet in tutorial/challenge) → `help-system.js:41-48` (tip bij elke 3e fout).

**(c) localStorage backward-compat (2 tests):**
- `pre-change voortgang (zonder stepsSolvedByScenario) werkt nog`: seed oud formaat (`completedScenarios: ['recon']`, geen `stepsSolvedByScenario`), leerpad toont recon als voltooid, certificaat zegt VOLTOOIING (fallback: `getSolvedSteps()` retourneert `scenario.steps.length`).
- `bestaande onboarding-voortgang overleeft reload`: voer pwd/ls/whoami uit, reload, leerpad toont ze als geprobeerd.

**Code-pad bewezen:** `tutorial-manager.js:87-93` (`getSolvedSteps()` valt terug op `scenario.steps.length` voor data zonder `stepsSolvedByScenario`).

### Metrics

- **Bundle:** src=696 KB, styles=398 KB, blog=442 KB, assets=1731 KB (ongewijzigd — alleen tests toegevoegd)
- **Playwright:** 30 spec files, ~243 tests per browser-project
- **Geen runtime-codewijzigingen** — alleen verificatie van bestaande functionaliteit

### Learnings

- **Chromium-binary-pad in CI:** Playwright verwacht een specifiek pad (`chromium_headless_shell-1234/…`), maar de pre-installed binary staat op `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Fix via `CHROMIUM_PATH` env var (de config leest `process.env.CHROMIUM_PATH`).
- **Accepteer pre-existing failures als baseline:** 7/249 failures die óók op productie reproduceren zijn geen regressie. Documenteer ze als baseline i.p.v. ze te repareren in een verificatiesessie.

---

## Sessie 208: Advertenties eruit, kwaliteit aantoonbaar, blog meetbaar (03 aug 2026)

**Mission:** Heisenberg stelde vier vragen tegelijk: haal AdSense weg als het niets oplevert; moeten we meer op de gidsen focussen als die wél verkopen; hoe kan hij de kwaliteit van de inhoud garanderen terwijl hij zelf geen securityexpert is en alles met AI heeft gebouwd; en hoe haalt hij meer uit de blog. Hij koos "alles in één keer", vóór hij woensdagochtend de launch verder oppakt.

**Beslissingen vooraf (via vragen):** 1-5 Gumroad-verkopen → betalingsbereidheid is aangetoond, dus géén vierde gids maar de funnel naar de drie bestaande verbeteren. Docenten zijn géén doelgroep — die suggestie kwam uit mijn eigen `docs/seo-launch-checklist.md:57`, één rij in een lijst van acht backlink-doelen, geen doelgroepbesluit. Voor de expertreview werft hij een gratis vrijwilliger.

### W1 — AdSense volledig verwijderd

**Grond:** €0 gemeten opbrengst tegen 251,7 KB third-party en 73% van alle blokkeertijd (`docs/perf-third-party-audit.md`). Het eigen monetisatie-onderzoek concludeerde in maart 2026 al: "AdSense optimaliseren maakt het niet de moeite waard om er tijd aan te besteden" (`docs/archive/monetization-plan-v2.md:181`). Auto-ads stond dashboard-geverifieerd uit, dus verwijderen was mechanisch zonder verborgen omzetrisico.

**Uitgevoerd:** 44 advertentieblokken uit 20 bestanden (scriptmatig, met blok-detectie op `<div>`-diepte), 27 `google-adsense-account`-meta's, `data-adsense` van 19 pagina's, de `loadAdSenseAfterConsentDefaults`-IIFE + de drie `ad_*`-consentdefaults, `loadAdSense()` en de ad-tak in `acceptConsent()`, de restore in `init-analytics.js`, 63 regels CSS, 5 ad-domeinen uit de CSP (`frame-src` → `'none'` want alleen ad-iframes gebruikten het), `ads.txt` + het `_headers`-blok, en de `["AdSense"]`-regel uit de keyword-gate van `validate-docs.sh` (die laatste bewust als sluitstuk, anders faalt de pre-commit hook halverwege).

**Consent-banner 3 → 2 knoppen, zonder migratie.** Het opgeslagen JSON-formaat blijft `{necessary, analytics, …}`; we schrijven alleen `advertising` niet meer. Daardoor houdt élke bestaande bezoeker zijn keuze en ziet de banner niet opnieuw. Live geverifieerd in vier scenario's: vers (2 knoppen, 0 ad-requests, 0 GA vóór toestemming, `{"necessary":true,"analytics":true}` erná), oude `advertising:true` (geen banner, GA laadt), legacy-string `"true"` (geen banner, GA laadt), geweigerd (geen banner, geen GA). Nul CSP-fouten.

**Rood-op-mutant.** Een nulmeting achteraf bewijst niets. Daarom `git archive HEAD` naar `/tmp/pre-change` + een tweede no-store server op poort 8898: dezelfde meting gaf **2 advertentieverzoeken + 3 `<ins>` + 3 `.ad-container` vóór, en 0/0/0 ná**.

**Bijvangst:** `commands/index.html` was de enige pagina met een **inline** Consent Mode-script. De CSP heeft geen `'unsafe-inline'` in `script-src`, dus dat script draaide daar nooit — die pagina had structureel geen consent-defaults. Nu op het externe `consent-default.js` gezet, zoals de andere 19.

**Legal:** privacy §5.3 en de cookie-tabelrijen vervallen; cookies §2.3 herschreven naar "die plaatsen we niet" met de DPA-alinea omgezet van AdSense naar Analytics. Geknipt zou de documenten inconsistent hebben gelaten — er blijven analytics-cookies.

**Meting:** module-cascade op `/terminal.html` lokaal 579 → 301 ms (mediaan van 3). De echte winst (251,7 KB) is alleen op productie te meten; uitgaand verkeer is hier geblokkeerd. `MODULE_CASCADE`-budget van 3000 → 2500 ms met een expliciete TODO om ná de deploy verder aan te scherpen.

### W2 — Kwaliteit aantoonbaar maken

**Het kernprobleem:** alles wat automatisch bewaakt werd was *structureel*. Geen enkele check keek of een bewering wáár is. 41 man pages, 56 definities, alle tutorial-uitleg: nooit gecontroleerd.

- **NEW `scripts/build-review-package.mjs`** → `docs/review/expert-review-pakket.md`. Destilleert uit de bron 172 controleerbare beweringen (29 commands, gelabeld `output` vs `handleiding`, met regelnummer) + 56 definities, elk met ☐ klopt / ☐ klopt niet / ☐ te vaag. Uit de bron genereren betekent: geen achtste plek die kan driften, en een tweede ronde kost één commando. Claim-detectie op getallen-met-eenheid, CVE's, poorten, wetsartikelen en `[TIP]`/`[!]`, mét een code-filter zodat er geen JavaScript in de vragenlijst belandt.
- **NEW Check 6d** in `validate-docs.sh`: badges per zeldzaamheid, `alle N challenges`-tekst, en scenario-registratie. Ving meteen een echte fout: de `achievements`-man-page claimde **4** RARE badges tegen **5** in `badge-definitions.js` (drie andere plekken noemden 20, 21 en 22). De eerste versie van de scenario-assertie faalde óók — terecht: scenario's worden geïmporteerd in `core/terminal.js`, niet in `tutorial-manager.js`.
- **NEW `#verantwoording`** op `over-ons.html`: hoe het gemaakt is (één developer + AI, geen securitycredentials), wat wél gecontroleerd is, wat nog niet, en waar je fouten meldt. In een eigen `.verantwoording-card` mét light-theme-override — de eerste versie was grijs op wit in light mode (Sessie 44-valkuil).
- **Certificaat-tegenstrijdigheid opgelost:** een downloadbaar "CERTIFICAAT VAN MEESTERSCHAP" naast een FAQ die zegt dat er geen certificaat is. Eén gedeelde `CERT_DISCLAIMER` in `certificate-templates.js`, gebruikt door beide generatoren, inclusief de mobiele variant, gewordwrapt omdat de box tot 30 tekens smal kan worden. Geverifieerd op 1280/900/700/500/375px: randbreedtes uniform, disclaimer overal aanwezig.
- **Zichtbare controledatum op 14 posts** met de échte datum: 14 jun 2026 voor de 13 posts uit de feitencontrole van Sessie 164, 3 aug voor de metasploit-post (daarna geschreven, nu nagelopen: MS17-010/WannaCry 2017, CVE-2019-0708, CVE-2021-44228, CVE-2014-6271 en de patch-vóór-WannaCry-tijdlijn kloppen). Gate in `validate-blogs.sh` zodat de volgende post het niet vergeet.
- **NEW `.github/workflows/validate.yml`** — de gates draaiden uitsluitend als lokale pre-commit hook; `--no-verify`, een andere machine of de webinterface omzeilde ze volledig.

### W3 — Gidsen-funnel

De blog stuurde 14 links naar Gumroad; er kwam er **één** terug. Elke gids-kaart linkt nu 3 thematisch passende blogposts ("Gratis achtergrond bij deze gids"), wat tegelijk interne linkwaarde geeft aan de onderlinkte posts.

### W4 — Blog

- **`data-terminal-cta` op alle 14 posts.** Blog→Gumroad en blog→lead-magnet waren volledig getrackt; blog→terminal — de belangrijkste conversie van de site — vuurde géén enkel event. `cta-tracking.js:52` handelde de tak al af; alleen de markup ontbrak. Geverifieerd door het event op te vangen: `terminal_cta_click {location: "blog_<slug>"}`. De wireshark-post bleek zelfs helemaal geen terminal-CTA in de tekst te hebben; die is toegevoegd.
- **14 RSS-titels gesynchroniseerd** — alle veertien stonden nog in Engelse Title Case sinds de sitebrede omzetting (`65c5f18`), omdat de feed-titel geen van de zeven lockstep-locaties was. Bron is de `<title>`, niet de `<h1>`: bij `wat-is-ethisch-hacken` is de `<h1>` bewust korter en syncen op `<h1>` had de SEO-titel ingekort. **NEW check 9c.**
- **Hubvolgorde hersteld** — `blog/index.html` brak vanaf kaart 5 (december 2025 boven januari 2026). **NEW check 9d.**
- **4 interne links** → wireshark 2→3, metasploit 2→4, linux-bestandssysteem 2→3 inkomend. `welkom` blijft op 2; links naar een welkomstpost forceren zou onnatuurlijk zijn.

### Verificatie

Volledige Chromium-suite **238 passed / 5 skipped / 0 failed** tegen een lokale no-store server. Beide validators groen (`--deep`, 9 checks). Alle vier nieuwe checks (6d, 9c, 9d, blog-fact-checked) rood-op-mutant bewezen vóór vertrouwen. Negen pagina's gecontroleerd op 1280/375px: geen horizontale scroll, nul advertentierestanten, geen console-fouten behalve geblokkeerde Brevo-requests (sandbox-egress).

### Wat bewust NIET is gedaan

Geen vierde gids (bottleneck is verkeer, niet aanbod). Geen docenten-pagina of curriculum-mapping (doelgroep-uitbreiding die PRD §3 uitsluit). Geen Ko-fi verwijderd (0 KB, kost niets). Geen `aggregateRating` (geen echte reviews). De feitencontrole van de 41 man pages en 56 definities zélf loopt door — het reviewpakket maakt die stap klein, maar alleen een mens met vakkennis kan hem zetten.

### Openstaand

- `MODULE_CASCADE`-budget ná de deploy tegen productie meten en verder aanscherpen.
- Heisenberg: site uit AdSense verwijderen, Gumroad/GA4 aflezen, reviewer werven met `docs/review/expert-review-pakket.md`.

---

## Sessie 207: Audit oude follow-up-lijstjes → gesnoeid op bezoekerswaarde (02 aug 2026)

**Mission:** Heisenberg plakte drie oude "optionele follow-up"-lijstjes uit eerdere sessies (leerpad-features, blog/SEO-verbeteringen, een border-refactor) met de vraag wat ervan gedaan is. Halverwege scherpte hij de opdracht aan: *"het waren ooit ideeën, dat betekent niet dat het uitgevoerd moet worden — alleen waarde toevoegende zaken voor de bezoeker, de rest kan de prullenbak in"*, later aangevuld met *"als iets deels klaar is en het is aan te bevelen het af te ronden, mag dat ook mee"*.

**Audit-uitkomst (11 items):** 4 al klaar, 4 verworpen, 3 uitgevoerd — plus 2 items die níét op de lijst stonden maar uit de audit zelf kwamen.

**Al klaar:** Google Search Console (DNS-geverifieerd Sessie 160, sitemap 26 URL's + `robots.txt:35`, indexatie-analyses S160/169/172) · RSS-feed (`/feed.xml`, níét `/blog/feed.xml`; 14/14 items; bewaakt door `validate-docs.sh:475-524`) · related-posts ("Verder lezen", 14/14 posts, 4 kaarten = 56 links) · analytics (GA4 + Consent Mode v2, 943 regels/8 bestanden).

**Verworpen met reden** (vastgelegd als TASKS.md-item #52 zodat ze niet opnieuw opduiken): dashboard-leerpad-% (derde weergave van dezelfde data) · phase-badges (viering bestaat al, `next` wordt ná élk geleerd command aangeboden) · leerpad-certificaat (overbelofte over een browser-simulator) · social sharing (tone-conflict) · SSG (PRD §13, validators lossen duplicatie al op) · blog-engagement-events (GA4 doet dit standaard) · RSS-link in root-heads (winst ≈ 0) · two-tier borders (polish op polish).

**Work done:**
- **W4 — latente border-token-bug (uit de audit).** `.landing-nav-wrapper` (`landing.css:78`) en `.landing-footer` (`main.css:1025`) gebruikten `var(--color-border)` — het *content*-token met **90 call-sites** — voor de dark frame. Werkte alleen doordat `--color-border` in dark mode toevallig dezelfde `#30363d` is als `--color-border-dark-frame`; light mode werd gered door twee overrides. **Rood-op-mutant vóór de fix:** `--color-border` tijdelijk op rood → navbar/footer werden `rgb(255,0,0)` in dark mode (light bleef goed). Ná de fix: `rgb(48,54,61)`, koppeling door. 8/8 metingen identiek op index.html én terminal.html = visuele no-op. Twee redundante overrides geschrapt. **Geen `?v=`-bump** — identieke uitkomst, dus cache busten voor niets.
- **W4-bijvangst — style-guide bleek volledig gedrift.** De `.category-btn`-sectie refereerde **5 niet-bestaande variabelen** (`--color-border-focus`, `--category-filter-height`, `--category-btn-padding`, `--category-btn-radius`, `--radius-full`) én elke state-waarde klopte niet. Verbatim herschreven uit `blog.css:115-137`. "Focus Management" wees naar per-component regels die niet bestaan → vervangen door de echte globale `:focus-visible`-regel uit `animations.css`. Light-theme borderclaim `#d0d0d0` → `#e0e0e0` (`#d0d0d0` is `--color-border-input`, 1 call-site). `css-variable-migration-guide.md` is een gedateerd migratielog → historie niet gecorrigeerd, wel een statusnotitie dat de `--featured-*`-familie inmiddels weg is.
- **W1 — FASE 4 had als enige fase geen vieringsmoment.** Fases 1-3 hebben elk een "FASE X VOLTOOID!"-box; FASE 4 (Security Tools) niet. Vijfde transitie toegevoegd in `next.js` + branch in `detectTransition()`; `phase4Commands` bestond al op regel 25. Copy bewust in de lengteband van de bestaande transities gebracht na een eerste versie die te lang was (skills 44-57 tekens vs bestaande 21-37, bridge 146 vs ~50). Gemeten: desktop 15 regels **allemaal exact 104 tekens**, mobiel borderless, tweede aanroep herhaalt niet.
- **W3 — tutorial-certificaat downloadbaar.** Challenge-certificaten hadden bekijken + download + kopiëren; tutorial-certificaten alleen kopiëren. `downloadCertificate()` toegevoegd op het Blob-patroon uit `certificate-generator.js:159`; de ASCII-conversie zat gedupliceerd en is nu een gedeelde `toPlainText()`. Subcommand `tutorial cert download` + man-page + usage. Gemeten via onderschepte Blob: `hacksimulator-tutorial-recon.txt`, `text/plain`, 2204 tekens, **nul niet-ASCII-tekens**.
- **W2 — og:image per blogpost.** Alle 15 blog-bestanden deelden `assets/og-image.png?v=2`. NEW `scripts/build-blog-og-images.mjs` (resvg, gemodelleerd op `build-product-covers.mjs`) genereert 14 kaarten. **Bron = de post zelf**: titel uit `<h1>`, categorie uit `og:article:section` — bewust géén hardcoded POSTS-array, want de titel leeft al op 7 plekken en een 8e kopie zou gaan driften. Exact **1200×630, niet @2x**: elke post draagt al `og:image:width/height` 1200/630, en een @2x-render zou die tags laten liegen. 14/14 nageteld met `file`, 42 tags vervangen, alle refs bestaan, 548 KB.

**Verificatie:** `validate-blogs.sh` 15/15 · `validate-docs.sh --deep` exit 0 · Playwright volledige suite tegen een lokale **no-store** server.

**Learnings:**
- **"De infrastructuur staat er al" is geen reden om een feature te bouwen.** Mijn eerste ronde markeerde 4 items als "gedeeltelijk — laatste schakel ontbreekt", wat klinkt als afmaken. Maar `getPhaseStats().percentage` (`leerpad.js:25`) is dode code, en de bezoeker ziet zijn fase-voortgang al op twee plekken. Een derde weergave is ruis, geen waarde. Dode code is geen opdracht.
- **Eén grep draaide een oordeel om.** Ik dacht dat fase-viering "pull-based" was en dus gemist werd. Toen bleek `next` ná élk nieuw geleerd command te worden aangeboden (`onboarding.js:311`, `:451-460`, `:196-197`, `:360`, `renderer.js:374`) — de viering is één geprómpte toets weg. Zonder die check had ik 4 overbodige badges gebouwd.
- **Een gevonden defect hoort in het plan, niet in een voetnoot.** Ik parkeerde de border-bug als "meenemen of laten liggen — beide verdedigbaar". Heisenberg: *"Vergeet niet de bug mee te nemen die je gevonden had."* Dat "beide verdedigbaar" is dezelfde hedge als een option-tree: het schuift een technisch oordeel terug naar de user. Nul zichtbare impact ≠ geen bug; beoordeel op toekomstig risico (hier 90 call-sites op het gedeelde token).
- **Bij een no-op-fix is de mutant het hele bewijs.** "Screenshots vóór/ná identiek" is óók waar als je niets doet. De rood-op-mutant-stap (mutant dark: rood → `rgb(48,54,61)`) is het enige dat aantoont dát de koppeling is doorgeknipt.
- **De submodule-cache-val sloeg toe in mijn eigen testharnas.** `import('/src/commands/system/tutorial.js?cb=…')` faalde met "does not provide an export named 'downloadCertificate'" — de `?cb=` bust alleen de entry, niet het relatief geïmporteerde `certificate.js`. Vierde sessie op rij (202/205/206/207). Opgelost met een echte no-store server (`scratchpad/nostore-server.py`) in plaats van steeds slimmere cache-busters.
- **De ingebouwde versheids-assert ving een valse meting.** Mijn eerste W4-na-meting las de CSSOM-regel uit (`var(--color-border)`) en zag dat de light-override er nog stond — bewijs dat de browser oude CSS serveerde. Zonder die assert had ik "no-op bevestigd" gerapporteerd terwijl er niets geladen was.
- **Scope-uitbreiding hoort onderbouwd, niet stiekem.** De style-guide-sectie herschrijven ging verder dan "twee phantom-variabelen fixen". Maar alleen die twee cellen corrigeren in een tabel waarvan élke waarde fout is, levert een half-ware tabel op die er *geverifieerd* uitziet — erger dan beide alternatieven. Gefixt wat ik tegen de CSS kon verifiëren, en de bredere drift gemeld i.p.v. een 8000-regelige audit te starten.
- **Eerlijk blijven over het plafond van een win.** De og:images zijn de enige externe-impact-win, maar Google gebruikt og:image níét in zoekresultaten — de winst zit in gedeelde links, en vooral in het feit dat het nu een script is dat elke volgende post gratis bedient. Dat zo benoemd i.p.v. het als SEO-winst te verkopen.
- **Pre-existente drift gevonden en benoemd.** TASKS.md stond op Versie 5.79, CLAUDE.md op 5.80 — Sessie 206 bumpte alleen CLAUDE.md. Dat glipte langs de pre-commit-hook omdat Check 7 (cross-doc Versie) alleen in `--deep` draait. Ontbrekende 5.80-regel alsnog in de TASKS.md-ketting gezet met die uitleg.

**Next steps:** geen open eind. De verworpen items staan met reden in TASKS.md-item #52; als er ooit een nieuw argument is, is dat de plek om het tegen af te zetten.

---

## Sessie 206: Nieuwsbrief-mails mobiel — code-chip-overlap + witte tekst op groen (01 aug 2026)

**Mission:** Heisenberg stuurde drie Gmail-screenshots (Android, dark mode) van de juli-nieuwsbrief met twee defecten: tekst op de lime balk/knoppen wit i.p.v. donker, en het inline code-blokje (`5f4dcc3b...cf99`) dat door de regels erboven/eronder heen sneed. Analyseren en fixen. Werk viel volledig in `docs/newsletter/` — geen runtime-impact.

**Work done:**
- **Diagnose issue 2 (hard gemeten):** `nieuwsbrief-juli-2026.html` gebruikte één klasse `.code-bg` voor twee dingen — het blok-codevenster (`<td>`, regel 114) én de inline chips (`<code>`, regels 105/135). De mobiele regel `.code-bg { font-size:12px; padding:12px 14px }` was voor het blok bedoeld maar raakte ook de chips. Verticale padding vergroot bij een inline element de regelhoogte niet, alleen het gekleurde vlak. Playwright @375px, vóór de fix: chip **38px hoog in een 24px regelbox** (15px × line-height 1.6) = 7px lek per zijde, **17px overlap** met de buurregels. Ná: 17px, overlap 0. Desktop @700px ongewijzigd (22px in 24px).
- **Fix:** gesplitst naar `.code-block` (td) en `.code-inline` (code) — exact het patroon dat `welkomstmail.html` al hanteerde (`:27,41,50,60`); juli en april waren daarop achtergebleven. Beide klassen toegevoegd in alle drie de kleurblokken (`prefers-color-scheme`, `u + .body`, `[data-ogsc]`) + gesplitste mobiele regels (`.code-inline` → `13px / 1px 4px`).
- **Diagnose issue 1 (mitigatie, niet te bewijzen vanaf hier):** de Gmail-app past ná de CSS zijn eigen kleurcorrectie toe en lift tekst die hij als bijna-zwart-op-donker leest naar wit. `!important` stopt dat niet; de `@media (prefers-color-scheme: dark)`-blokken zijn in die app sowieso dood (Gmail ondersteunt die media query niet — alleen de inline styles tellen). De groene achtergrond stond op de `<td>`/`<a>`, de donkere kleur op een kale `<span>` eronder: zo'n los fragment heeft geen eigen achtergrond en wordt "gerepareerd".
- **Fix:** `background-color:#9fef00` staat nu sámen met `color:#0d1117` op hetzelfde element — 5 spans in juli (3 header + 2 knoppen), plus dezelfde koppeling in de `.header-text`/`.btn-text` klasseregels van alle drie de kleurblokken. Visueel identiek in andere clients (groen-op-groen valt samen met de ouder). Ook toegepast op beide welkomstmails en april.
- **Bijvangst tijdens het opruimen:** beide welkomstmails droegen nog MailerLite-syntax `{$unsubscribe}` en `{$url}` terwijl de stack sinds Sessie 165 op Brevo draait. Brevo vervangt die niet → letterlijke href = dode link. Gecontroleerd tegen de Brevo-docs (niet uit het hoofd): correcte vorm is `{{ unsubscribe }}` en `{{ mirror }}`, mét spaties binnen de accolades. Vervangen in beide bestanden. Heisenberg bevestigde met een screenshot dat `{$unsubscribe}` inderdaad letterlijk in het Brevo HTML-blok stond (automation 2, regel 184).
- **`nieuwsbrief-april-2026.html`:** wél de klassesplitsing + bg/color-koppeling, **niet** de Brevo-syntax — die mail is verstuurd vóór de migratie, dus `{$unsubscribe}` was daar correct. Historie gladstrijken maakt een archief onbetrouwbaar.
- **`maandelijks-template.md` (regressieketen gesloten):** het template wees voor het CSS-blok naar `nieuwsbrief-april-2026.html` — precies het bestand met de bug, waardoor juli hem erfde. Pointer naar juli. Verder: MailerLite → Brevo (titel, platform, lijst `hacksimulator-main`, Import-HTML-waarschuwing), Brevo-variabelen met de waarschuwing dat de oude vorm niet vervangen wordt, uitleg `.code-block` vs `.code-inline`, uitleg waarom bg+color op één element staan, footer-conventie, en checklistregels (uitschrijflink échte klik, één footer, test-mail op telefoon in dark mode).
- **Door Heisenberg zelf uitgevoerd in Brevo:** beide welkomst-automations uniform gemaakt (uitschrijf- en mirror-link in het HTML-blok, los Brevo-footerblok verwijderd) en getest; de dubbele `{EMAIL}` op de Brevo-uitschrijfpagina opgelost. Conventie + status vastgelegd in het template.

**Commits:** `8045b29` (fix, 4 HTML-bestanden), `14ea6b6` (template-documentatie). Beide gepusht naar `main`.

**Learnings:**
- **De rood-op-mutant-volgorde betaalde zich direct uit.** Eerst gemeten op de ónveranderde file (38px / 17px overlap), pas daarna gefixt. Zonder die baseline had ik "overlap 0" gerapporteerd zonder te weten of de meting overlap überhaupt kán detecteren.
- **De Sessie 205-cachval sloeg meteen weer toe.** Mijn eerste na-meting gaf identiek 38px omdat de browser de oude HTML uit cache serveerde — `td.code-block` bestond niet eens in die DOM, en juist dát ontbrekende element verraadde het. Met `?cb=` was het meteen groen. Het patroon herhaalt zich nu drie sessies op rij (202, 205, 206): verifieer nooit tegen een warme browser.
- **Een gemeten afwijking is niet automatisch een bug.** April's tweede chip mat 41px in een 24px regel — dat leek de oude bug. `getClientRects()` toonde 2 fragmenten van elk 17px: de chip wrapt over twee regels en `getBoundingClientRect()` geeft de union-box. Overlap 0. Gecheckt in plaats van "voor de zekerheid" gefixt.
- **Documentatie opruimen legde een levende bug bloot.** De MailerLite-syntax in de welkomstmails leek een documentatie-nit, maar die mails worden nog dagelijks automatisch verstuurd. De "kleine opruimactie" was de hoogste-waarde-vondst van de sessie — vergelijkbaar met Sessie 202, waar de gedeelde util achter de gemelde bug de echte schade droeg.
- **Mijn eerste advies over de juli-mirror was fout.** Ik zei "verzonden campagne → Import HTML", maar Brevo vergrendelt verzonden campagnes: alleen links, alleen ≤24 uur, en uitschrijf-/variabele-links zelfs daarbuiten. Opgezocht in plaats van doorgeredeneerd, en de stap geschrapt in plaats van hem te laten staan.
- **Eerlijk zijn over wat niet te bewijzen viel.** Issue 2 was hard te meten; issue 1 niet — Gmail's dark mode draait op zijn telefoon. Dat als mitigatie benoemd, met de escalatieroute (donkere balk met groene tekst) expliciet als plan B, in plaats van "gefixt" te claimen.
- **De nieuwe checklistregel bewees zichzelf binnen het uur.** "Uitschrijflink écht aanklikken" leidde direct tot de vondst van de dubbele `{EMAIL}` op de Brevo-uitschrijfpagina — een fout die je nooit ziet als je alleen controleert of de link er staat.

**Next steps:**
- Augustus-editie: kopieer `nieuwsbrief-juli-2026.html` (niet april) en test op de telefoon in dark mode. Twee open vragen: houdt de bg+color-koppeling stand in de Gmail-app, en gaat het `<style>`-blok mee bij import (een HTML-blok in een drag-and-drop-ontwerp draagt geen `<head>`; zonder dat blok doen `.code-inline`/`.code-block` niets). Staat als taak in TASKS.md §Volgende Acties.
- Overweging voor later: de Brevo-uitschrijfpagina is Engels terwijl site en mails Nederlands zijn.

**Metrics delta:** geen. Uitsluitend `docs/newsletter/` — bundle, testcount, architectuur en scope ongewijzigd.

---

## Sessie 205: Box-reflow bij venster-resize + structurele submodule-cache-fix (01 aug 2026)

**Mission:** Heisenberg checkte de Sessie 204-fix live en zag de metasploit SECURITY WARNING-box alsnog breken bij het verkleinen van het venster (screenshot 31 jul 20:18). Daarmee verwierp hij expliciet de 204-beslissing "bestaande output reflowt niet bij resize = by design (echte terminals doen dat ook niet)". Opdracht: bestaande box-output moet netjes mee-wrappen.

**Work done:**
- **NEW `src/ui/box-reflow.js`** (~186 regels): debounced (250ms) resize-handler die box-blokken in de DOM detecteert en herbouwt op de actuele `getResponsiveBoxWidth()`.
  - Parser = state machine per container: blok start op `╭`/`┏` (enige 2 corner-sets in de codebase), eindigt op `╰`/`┗`, tussenregels moeten `│`/`┃`/`├` zijn; alles anders verwerpt het blok. Verweesde blokken (top weggetrimd door `_trimOutput`' 500-regel-cap) vallen er vanzelf doorheen. Children-snapshot vóór mutatie (clones worden ingevoegd).
  - **Shrink-only in chars** (`top.textContent.length > width`): idempotent, en de badge-notificatie met z'n `Math.min(width, 50)`-clamp krijgt vanzelf de juiste behandeling zonder dat de clamp gereconstrueerd hoeft te worden. Rij-count kan alleen groeien → geen verwijder-logica.
  - **Géén `isMobileView()`-guard** (bewust verworpen in het plan): een half-gesnapt desktopvenster is 683/720px en valt ónder de 768-drempel — precies het gemelde scenario zou dan kapot blijven. De aanwezigheid van box-blokken ís de guard (mobiel rendert borderless sinds Sessie 82 → parser vindt niets → no-op).
  - **Géén typewriter-guard** (YAGNI): welcome-output bevat geen box-glyphs en box-renders zijn atomair binnen één task.
  - Indent-bewust wordWrappen: `wordWrap` doet `split(' ')` en eet daarmee leidende spaties (óók op part 0), dus indent apart bewaren en elke part her-prefixen — zoals alle producers zelf ook doen.
  - Completion-wrappers (`.terminal-completion-*`) als eigen containers itereren; de wrapper-elementen nooit vervangen (`_revealCelebration` houdt er referenties + animatie-state op).
  - Scroll-pin doorlopend bijgehouden via passieve scroll-listener + `resizing`-vlag; herstel met `scrollTo({behavior:'instant'})` omdat `animations.css` `scroll-behavior:smooth` op `#terminal-output` zet.
- **`renderer.formatText()`**: publieke alias voor `_formatText` zodat herbouwde regels dezelfde marker-spans (`→`/`[✓]`) krijgen.
- **Structurele vondst tijdens live-verificatie (commit 2):** `_headers` zette `/styles/*.css` + `/src/**/*.js` op `max-age=604800`. Binnen die 7 dagen is de response 'fresh', dus `must-revalidate` grijpt niet — en alleen entry-points (`main.js`, `main.css`) dragen een `?v=`. De ~99 relatief geïmporteerde modules bleven dus uit browsercache komen: verse `main.js` + oude `renderer.js` gaf `TypeError: renderer.formatText is not a function`. **Gemeten bewijs dat dit óók Sessie 204 raakte:** de gecachete `box-utils.js` gaf 41 chars, de serverversie 62 — de 204-fixes hadden terugkerende bezoekers nooit bereikt. → `max-age=3600` (herstelt de strategie die `architecture-patterns.md` al documenteerde) + defensieve `renderer._formatText`-fallback in `setLine()`.
- **`architecture-patterns.md`** (commit 3): de val expliciet vastgelegd incl. verificatie-eis (no-store server of `import('…?cb=')`, nooit een warme browser).
- Cache-bump `main.js?v=205-box-reflow` (terminal.html regel 136 + 472).
- **Test**: NEW `Live resize reflow`-describe in `responsive-ascii-boxes.spec.js` — render @1240 (metasploit/next/man nmap/help) → live naar 900/700/**640** (sub-768 = regressietest voor de verworpen mobiel-guard) → 0 wraps + `boxLineCount > 0` + **scroll blijft gepind** + `pageerror`-capture; daarna terug naar 1240 (groei-pad, vers command vol breed). Stale comment over "reflowt bewust niet" herschreven.

**Commits:** `017d872` (feature), `875399d` (cache-fix + fallback), `b02d193` (rules). Alle drie gepusht + live geverifieerd.

**Learnings:**
- **Opnieuw in de Sessie 202-modulecache-val gelopen — nu met de oorzaak erbij.** Drie pin-metingen lang diagnosticeerde ik een niet-bestaand probleem (ik concludeerde zelfs "scroll-event vuurt vóór resize-event") omdat de browser een oude `box-reflow.js` serveerde terwijl het bestand op schijf klopte. Pas een no-store server bracht de waarheid boven. De onderliggende reden is nu bekend én gefixt: `?v=` op het entry-point bust de submodules niet.
- **Dat leidde bijna tot permanente over-engineering.** Ik had een layout-heuristiek toegevoegd (scroll-events mét gewijzigde scrollHeight/clientHeight negeren). Gericht uittesten liet zien dat de simpele `resizing`-vlag al volstond — in Chromium, Firefox én WebKit. Geschrapt; de aanname staat nu als assertie in de e2e-test i.p.v. als defensieve code. Simpelste versie die werkt + test die de aanname bewaakt.
- **Meet vóór je een bug-oorzaak toeschrijft.** Op de vraag "hebben we niet iets dubbel opgelost?" kon ik hard antwoorden omdat ik het screenshot-scenario mét de oude productiecode reproduceerde (69 boxregels, 69 wraps) en met de nieuwe (0 wraps). De 204-fixes gaan over verse render, deze over reflow — disjuncte problemen. Bijkomend inzicht: de 204-fix maakte het symptoom zichtbaarder, want de oude Inter-mismeting maakte boxen ~35% te smal = toevallige speling tegen wrapping.
- **"Live geverifieerd" van Sessie 204 was maar half waar**: het font klopte (CSS-entry mét `?v=`), maar de JS-modules waren stale en zijn niet gecontroleerd. Verificatie moet het hele afhankelijkheidsoppervlak dekken, niet alleen het artefact dat je toevallig gewijzigd hebt.
- **Een "by design"-beoordeling is een productkeuze, geen technische.** Sessie 204 verklaarde niet-reflowen tot echte-terminal-gedrag; technisch verdedigbaar, maar voor een leeromgeving in een browser weegt leesbaarheid bij venstermanipulatie zwaarder. Zulke keuzes horen bij Heisenberg, niet in mijn sessielog.

**Next steps:** Heisenberg moet éénmalig hard refreshen (Ctrl+Shift+R) om zijn gecachete modules te verversen; daarna landen deploys binnen een uur. Geen open code-items.

**Metrics delta:** src/ 677→685 KB (+8 KB: box-reflow.js + formatText-alias), styles/blog/assets ongewijzigd. Specs 29 (gelijk), tests +1 (249). Chromium-suite 243 passed / 5 skipped / 1 flaky (autocomplete-filesystem, ongerelateerd).

---

## Sessie 204: Box-omlijning brak op tussenbreedtes — root-cause fix (31 jul 2026)

**Mission:** Heisenberg meldde (2 foto-screenshots, herhaald aangekaart issue) dat de box-omlijning in de terminal nog steeds breekt op bepaalde schermen — de "VOLGENDE STAP"-box van `next` met wrappende randen en content door de rechterrand. Opdracht: perfecte analyse + fix-advies; plan goedgekeurd en uitgevoerd.

**Work done:**
- **Root cause 0 (dominant, nieuw ontdekt):** de inline base64-embed van 'JetBrains Mono Box' (box-glyphs U+2500-257F) in `styles/main.css:18` was **corrupt sinds Sessie 83** — exact 2 tekens afwijkend van het valide `styles/fonts/jetbrains-mono-box-subset.woff2` (b64-posities 154 en 6350), brotli-decompressie faalde, `FontFace.status === 'error'` (live op productie bevestigd vóór de fix). Alle box-glyphs renderden via OS-fallback-fonts met per-OS/per-glyph afwijkende advances (`━` ≠ `─` ≠ `M`); een borderregel is één ononderbroken glyph-run zonder breekpunten → wrapt als eerste, per machine anders. Verklaart retroactief het Sessie 81/82 Android-uitlijnprobleem (waarvoor `boxText()` mobiel borderless werd). Fix: herembed via `base64 -w0` van de disk-subset (600/1000-advance voor alle 128 glyphs — identiek aan JetBrains Mono latin).
- **Contract-unificatie** `src/utils/asciiBox.js`: rendertte `width + 2` tekens totaal terwijl `getResponsiveBoxWidth()` een totale breedte teruggeeft en alle handgerolde boxen (`next.js`, `dashboard.js`, …) `inner = width - 2` doen → de 5 SECURITY WARNING-boxen + `man`-boxHeader waren 2 chars te breed (veiligheidsmarge opgegeten). Nu totaal == `width` in `createBox` + `createLightBox`; `help.js:180` handmatige `width - 2`-compensatie verwijderd.
- **Meting op het juiste element** `src/utils/box-utils.js`: mat `#terminal-container` — dat erft **Inter** (`--font-body`, proportioneel!) terwijl de tekst in `#terminal-output` rendert (`--font-terminal`, mono), en de 12px webkit-scrollbar zat niet in de berekening. De Inter-M-mismeting *onderschatte* de capaciteit ~35% en redde brede desktops toevallig — maar instabiel per font-laadmoment. Nu: meet `#terminal-output` (juiste font + `clientWidth` excl. eigen scrollbar), `charWidth = max(measureText('M'), '─', '━')` (canvas respecteert unicode-range → meet de echte subset-advance; de max had déze hele bug gevangen).
- **`scrollbar-gutter: stable`** op `#terminal-output` (`styles/terminal.css`): clientWidth gelijk vóór/ná verschijnen van de scrollbar.
- **Test-gat gedicht** `tests/e2e/responsive-ascii-boxes.spec.js`: de `scrollWidth <= clientWidth`-assertie kon door `overflow-x:hidden` + `pre-wrap` nooit falen (structureel vals-groen) en `document.fonts.check()` geeft true óók bij status 'error' (gemeten — zo bleef de corrupte font 120 sessies onzichtbaar). Nu: wrap-detector per `.terminal-line` op **element-hoogte > 1.5× line-height** + max-right-check, NEW describe "Tussenliggende breedtes" @ 800/900/1024/1100 (terminal eerst vullen → scrollbar zichtbaar → commands vers renderen), font-assert via `fonts.load` + `status === 'loaded'`. Verouderde 32/40/48/56-char header-comment + ongebruikte `expectedWidth`-velden opgeruimd.
- `?v=` bump: `main.css` 153→154 + `terminal.css` 117→118 over alle HTML-refs; `.claude/skills/verify-terminal/SKILL.md` bijgewerkt (width-contract + hoogte-gebaseerde wrap-detector).

**Commits:** `418d0da` (35 files) — gepusht + Netlify-deploy live geverifieerd. **Committed context zelfde dag, andere conversatie (niet dit werk):** `69c7eb2` flakiness + bundle-limiet 1000→1050, `cb00326` tracker.js dubbele-init-guard.

**Learnings:**
- Twee corrupte tekens in een 6936-char base64-string = hele woff2 onbruikbaar (brotli is niet fout-tolerant), maar `@font-face` faalt stíl naar een visueel bijna-identieke fallback. Elke test die "renderen de box-tekens?" vroeg zag ze gewoon — alleen metrisch nét verkeerd. Verifieer font-embeds tegen het bronbestand (byte-diff) en assert `fonts.load`+status, nooit `fonts.check`.
- Een accidentele mismeting kan een structurele bug maskeren: de Inter-M-onderschatting hield desktops toevallig binnen de marge. Fix-volgorde was daarom bindend: font → contract → meting; "correct" meten zonder de eerdere fixes had de boxen juist óp de rand gezet.
- Wrap-detectie: rect-`top`-vergelijking én `rects.length` zijn beide vals-positief bij inline spans — `marker-arrow` heeft `vertical-align: .2em` (3.6px @ 18px) waardoor rects op één visuele regel verschillende tops hebben (gemeten: 11 vals-positieven). Element-hoogte > 1.5× line-height is immuun (echte wrap verdubbelt de hoogte). Rood-op-mutant bewezen (kunstmatig 30-chars-te-brede regel gevangen).
- Resize-scenario gereproduceerd = vrijwel zeker de screenshots: output gerenderd @ 1440px wrapt 68/68 na versmalling naar 800px; vers command daarna: 0/12 wraps. Bewust geaccepteerd (echte terminals reflowen ook niet) — test-consequentie: na viewport-resize altijd het command opnieuw uitvoeren, nooit oude output meten.
- Sessienummer-ambiguïteit: een eerdere zelfde-dag-conversatie labelde haar werk al "Sessie 204" in TASKS.md maar rondde `/summary` nooit af (geen current.md-entry, counter bleef 203). Beslist: deze sessie = 204, eerder werk als committed context gelogd (Sessie 200-protocol: niet claimen).

**Next steps:** geen open items uit deze sessie. Bestaande open Heisenberg-acties (Postmaster re-check, GEO-checklist §5) ongewijzigd.

**Metrics delta:** src/ 675→677 KB (+2 KB contract/meting-comments), styles/ 396 KB gelijk (font-b64 zelfde lengte, +25 bytes gutter), spec-files 28→29 (was al 29 door zelfde-dag-context), tests +4 (tussenbreedte-describe). Chromium-suite 242 passed / 5 skipped / 1 flaky (tutorial-gestures, ongerelateerd).

---

## Sessie 203: GEO/AEO — vindbaarheid in AI-zoekmachines (31 jul 2026)

**Mission:** Heisenberg: "Ik wil hoog in de AI zoekresultaten komen met dit project. Analyseer hoe ik dit moet doen en zorg dat dit gebeurt." Doel: HackSimulator.nl citeerbaar maken voor ChatGPT, Perplexity, Google AI Overviews en Claude (GEO/AEO).

**Analyse (Explore-agent + webresearch juli 2026):** Klassieke SEO-basis sterk (canonicals, OG/Twitter-pariteit, BreadcrumbList, Article+Person op alle 14 posts, git-accurate sitemap), maar nul GEO-voorziening: geen llms.txt, geen AI-crawler-beleid, DefinedTermSet dekte 5 van 56 woordenlijst-termen, geen HowTo/WebApplication-schema. Onderzoek: llms.txt ~10% adoptie (nog onderscheidend, laag risico); AI Overviews citeert ~97% uit organische top-20 (bestaande SEO = fundament); ChatGPT-retrieval draait op Bing; Perplexity weegt freshness ~40% en leunt op Reddit; Claude citeert gestructureerde pagina's ~30% vaker.

**Work done (commit `202c8eb`, 9 bestanden, gepusht + live geverifieerd):**
- **NEW `llms.txt`** (llmstxt.org-spec): H1 + blockquote-missie + NL-alinea + korte EN-note, secties Kernpagina's/Blog (14 posts met 1-regel-beschrijving uit echte meta-descriptions)/Over. Alle 20 URL's tegen het filesystem geverifieerd. Netlify serveert root-`.txt` as-is.
- **`robots.txt`**: expliciete AI-crawler-stanza (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, CCBot, meta-externalagent, Applebot-Extended) als gedeelde multi-UA-groep. Cruciaal: een specifieke UA-stanza overschrijft de wildcard vólledig (RFC 9309) → de 4 Disallows (/node_modules/ /tests/ /playwright-report/ /docs/) herhaald in de AI-groep.
- **`index.html` FAQPage JSON-LD**: de 8 FAQ-vragen stonden al zichtbaar op de homepage (regel 541+) zónder schema — goedkoopste grote win van de hele analyse. Antwoorden verbatim uit de zichtbare `<p>`'s, alleen HTML-tags gestript.
- **`woordenlijst.html` DefinedTermSet 5→56**: scriptmatig gegenereerd (scratchpad-Python parseert `glossary-term`-blokken: `<dt>`-naam + `<dd>`-beschrijving, links/tags gestript) i.p.v. 56 objecten met de hand — geen typo's, herhaalbaar bij term-wijzigingen.
- **`scripts/validate-docs.sh` DefinedTerm-lockstep-check** (naast bestaande `term_count` regel 370): `"@type": "DefinedTerm"`-count moet exact gelijk zijn aan zichtbare `<dt>`-count. Rood-op-mutant bewezen (55≠56 faalt), groen op echt bestand.
- **`terminal.html` WebApplication-schema**: EducationalApplication, browser-based, gratis (price 0 EUR), isAccessibleForFree.
- **HowTo-schema op 2 posts**: wireshark (5-staps "Aan de slag"-`<ol>`) + metasploit (7-staps exploit-workflow-`<ol>`), steps verbatim. nmap/hashcat/sql-injection bewust géén HowTo: hun lijsten zijn alternatieven/uitleg, geen stappen — fake-HowTo schaadt.
- **`docs/seo-launch-checklist.md` NEW §5 GEO/AEO**: in-repo-status + platform-citatiegedrag + Heisenberg-acties (Bing Webmaster, herindexering GSC/Bing 4 pagina's, freshness-cadans, externe vermeldingen nuchter, ~1 mnd controle: AI-engines zelf vragen of HackSimulator geciteerd wordt).

**Bewust geschrapt (proportionaliteit):** llms-full.txt (drift-gevoelig, marginale waarde bij 14 posts); aparte veelgestelde-vragen.html (nav/footer JS-injected met noscript-fallbacks in ~24 files — index-schema levert hetzelfde AEO-voordeel voor ~1/20e van de kosten, evt. fase 2); answer-first-herschrijvingen (steekproef: posts openen al met directe definities na "Wat is X?"-koppen).

**Learnings:**
- De goedkoopste GEO-win zat in bestaande zichtbare content zonder schema (homepage-FAQ) — audit eerst wat er ál staat vóór je nieuwe content plant. De Plan-agent-vondst "8 zichtbare FAQ's zonder FAQPage" herframede de hele scope (aparte FAQ-pagina → overbodig).
- Schema-bij-zichtbare-content hoort verbatim + lockstep-bewaakt: FAQ-antwoorden letterlijk gekopieerd, DefinedTerm scriptmatig uit de markup gegenereerd, en de count-check in validate-docs.sh maakt drift onmogelijk. Zelfde discipline als de blog-titel-7-locaties-lockstep.
- robots.txt-valkuil: een specifieke User-agent-groep erft níéts van de wildcard — wie alleen `Allow: /` in een AI-stanza zet, opent per ongeluk /docs/ voor die crawlers. Multi-UA-groep (12 agents, 1 regelset) is compact én RFC 9309-correct.
- On-page GEO maakt je *citeerbaar*, niet *gekozen* — dat doen autoriteit en externe vermeldingen (Perplexity: Reddit ~47% van topcitaties). De eerlijke verwachting staat zo in checklist-§5; de zwaarste hefboom is een Heisenberg-actie, geen code.
- Deploy-verificatie hoort bij "zorg dat dit gebeurt": eerste curl gaf 404 (Netlify nog bezig), achtergrond-recheck na 90s bewees llms.txt 200 + nieuwe robots.txt live.

**Metrics delta:** blog 447→456 KB (+9: 2× HowTo-blok), src/styles ongewijzigd; geen nieuwe pagina's/tests; validate-docs.sh +1 deep-check (DefinedTerm-lockstep); bundle-marker geüpdatet naar Sessie 203-meting.

**Next steps:** Heisenberg-acties in `docs/seo-launch-checklist.md` §5 (Bing Webmaster, herindexering, externe vermeldingen, controle na ~1 mnd). Evt. fase 2: dedicated FAQ-pagina als hub.

---

## Sessie 202: Mobiele kolom-uitlijning + box-truncatie in terminal-output (28 jul 2026)

**Mission:** Gebruiker (screenshot terminal, 375px): het `reset`-tutorial-exit-menu ("[→] Wat wil je doen?" met commando + beschrijving) brak lelijk af — de twee kolommen vielen onder elkaar zodat elke beschrijving als een los menu-item las. Verzoek: "analyseer hoe en waar dit voorkomt site wide. ik wil dit perfect hebben." Scope-keuze Heisenberg: **alle live output** (reset-menu + security-tool-uitvoer); **man-pages buiten scope** (referentie achter expliciet `man`, traditioneel breed).

**Root cause:** `#terminal-output` gebruikt `white-space: pre-wrap` (`styles/terminal.css`). Regels breder dan de viewport (~30 tekens op mobiel; `getResponsiveBoxWidth()` klemt op min. 30) breken af op hun interne spaties → elke fixed-width twee-koloms-tabel (`kolom1` + opvul-spaties + `kolom2`) klapt in elkaar. De bestaande `data-indent` hanging-indent (`renderer.js` → `mobile.css`) redt alléén *continuatie*-regels, niet een twee-koloms-layout. De codebase had het juiste patroon al: commando's die `box-utils.js` gebruiken vertakken op `isMobileView()` en renderen gestapeld (`next.js` `buildMobileBox`/`buildDesktopBox`, `tutorial.js`, `dashboard.js`, `leaderboard.js` `renderListMobile`). De kapotte output omzeilde die helpers met hardcoded opvul-spaties.

**Work done (commit `fe27a17`, 4 bestanden, gepusht naar `main`):**
- **`reset.js`** (de screenshot): twee-koloms-menu → gestapeld (commando op eigen regel, beschrijving 2 spaties dieper eronder, lege regel tussen groepen). Bewust géén per-regel `→`-marker: `    → tutorial start exploitation` = 33 tekens en overschreed de ~30-char mobiele breedte; zonder arrow = 31 en het commando overleeft (of wrapt netjes met hanging-indent). Leest goed op mobiel én desktop → geen `isMobileView()`-vertakking nodig.
- **`nikto.js`**: "Ontbrekende headers"-tabel gestapeld (`header` + ingesprongen `→ beschrijving`); "Forces HTTPS"→"Dwingt HTTPS af" (de-Dunglish, rest van de tabel was al NL). **+ 2 echte bugs**: `+ Start Time: …}+ Server:` en `…seconds)+ 1 host(s)` plakten twee output-regels aaneen zónder `\n`.
- **`hashcat.js`**: 2 lange kolom-0-regels met `←`-glosse (`[*] Detecting hash type… ← …`, `Speed.#1…: X MH/s ← …`) → glosse op eigen ingesprongen regel; de basis-statusregels passen nu.
- **`asciiBox.js`** (de échte reikwijdte-vondst): box-`wrap()` in beide varianten (zwaar + licht) **woord-wrapt** te brede regels via de bestaande `wordWrap()` i.p.v. af te kappen met `...`. De 5 SECURITY WARNING-boxen (`boxText(warningContent, 'SECURITY WARNING')` in metasploit/nikto/sqlmap/hydra/hashcat) kápten waarschuwings-/gebruikstekst af op mobiel — niet alleen hydra's `(SSH brute force)`. Cruciaal: alléén regels die de breedte *overschrijden* worden geherwrapt; passende regels blijven verbatim → desktop-rendering + bewuste inspringing ongewijzigd. Sluit de in TASKS #47 Fase 1c gevlagde "mobiele legal-box-truncatie".
- **Box-titel-guard**: `label.slice(0, width)` als de titel breder is dan de box → geen `RangeError` meer bij `horizontal.repeat(negatief)`. Latent (onbereikbaar in prod: beide titel-callers `man.js`/`help.js` vertakken op `isMobileView()` naar platte tekst; op desktop is de box breed), maar een crash ≫ cosmetisch, dus goedkope guard.
- **Bewust ongemoeid**: `metasploit.js:69-71` + `hydra.js:161-162` `label ← glosse`-regels beginnen al met ≥3 spaties → hanging-indent grijpt al aan (degraderen acceptabel). Authentieke nikto-scan-regels (`+ label: value`) blijven voor 80/20-realisme.

**Learnings:**
- De screenshot was één symptoom van een klasse: fixed-width kolommen vs `pre-wrap`. De hoogste-waarde-vondst (box-truncatie die *waarschuwingstekst* wegkapt) zat níét in de gemelde output maar in de gedeelde `asciiBox`-util die de gemelde security-tools voeden — breed kijken loonde.
- **Verificatie-techniek voor een cache-geblokkeerde module:** er is geen build-stap en `asciiBox.js` wordt relatief geïmporteerd zónder `?v=`, dus de browser serveerde de gecachte oude versie (in-app render toonde nog `...`). Oplossing: `import('/src/utils/asciiBox.js?cb=' + Date.now())` in `browser_evaluate` → draait de échte `boxText()`/`wordWrap()` op het bestand-op-schijf. Bewees: geen ellipsis, alle regels exact `width+2` (randen uitgelijnd), content behouden, desktop verbatim, titel-guard crasht niet. (Sessie 200-techniek: meet het codepad direct, niet via de UI-heuristiek.)
- **Beslissing als expert i.p.v. optiemenu:** systemische renderer-reflow-heuristiek verworpen (ASCII-art/code-blokken/authentieke tool-output hebben óók multi-spaties die je niet mag herschikken; Sessie 196: "bevries de state aan de bron, filter niet de output") → gerichte per-output-fixes. De box-titel-crash wél gefixt ondanks onbereikbaarheid, want de kosten-baten (2 regels vs crash-footgun) is duidelijk.

**Verificatie:** Playwright echte `fill`+`Enter` op 375px + desktop 1280px; `overflowCount: 0` over de hele output, geen horizontale page-scroll; reset-menu + nikto + hashcat schoon; desktop geen regressie; `git diff` collateral-scan: 4 bestanden, alleen bedoelde output-strings, geen man-pages/logica. Screenshots `.playwright-mcp/reset-menu-{mobile,desktop}-fixed.png`.

**Deploy-noot:** live na het gebruikelijke ~1u Netlify-cachevenster (sub-modules relatief geïmporteerd zonder `?v=`; een `?v=`-bump op `main.js` bust ze niet). Direct live = Netlify "Clear cache and deploy site".

**Next steps:** geen open items uit deze sessie. (Optioneel toekomstig: een `?v=`-strategie voor sub-modules zodat sub-module-fixes niet ~1u op de cache wachten — pre-existing deploy-karakteristiek, geen bug.)

**Metrics delta:** 4 bestanden, +51/-22 regels; geen test-count-wijziging (28 spec files / 213 test-defs); bundle-KB-delta verwaarloosbaar (tekst-in-template-literals).

---

## Follow-up (27 jul 2026): Tutorial continuation-inspringing 6→4 spaties

**Mission:** Gebruiker (screenshot terminal, fundamentals-tutorial): "de inspringing die je ziet — is die bewust?" De vervolgregels van `[~]`/`[!]`-feedback sprongen 6 spaties in, 2 tekens voorbij de 4-brede marker.

**Diagnose:** Bewust (hand-authored hanging indent), maar dubbel functioneel én net niet strak: (1) visueel hangend onder de tip; (2) **load-bearing** — de renderer (`src/ui/renderer.js:513` `isContinuationLine`) kleurt vervolgregels met `≥3` leidende spaties door met de kleur van de marker-regel (`lastSemanticType`). 6 spaties lijnde echter niet uit onder de marker-tekst (kolom 4), maar 2 tekens ernaast.

**Fix (commit `6423f0c`, gepusht):** Uniform 6→4 spaties over alle 5 scenario-bestanden (64 continuations), zodat elke vervolgregel — doorgelopen zin, opsomming, genummerde lijst, codeblok — exact uitlijnt onder de marker-tekst. 4 blijft ruim boven de `≥3`-drempel, dus kleur-inheritance intact.

**Verificatie:** scope vooraf bewezen (geen `[TIP]`-6-brede ouders; alle 64 exact 6 spaties) → één transform i.p.v. 64 oordelen; 64 inserts/64 deletes + `git diff -w` leeg (puur whitespace); idempotent (2e pass = 0); `node --check` alle 5 modules OK; kleur-drempel geverifieerd met exacte renderer-logica; `mobile.css` leest `data-indent` generiek (`calc(...*1ch)`) → mobiele hanging indent volgt automatisch.

**Learning:** de ondergrens (4, boven de `≥3`-drempel) was net zo belangrijk als de bovengrens (uitlijnen op de 4-brede marker) — naar 2 spaties zou alle 64 continuations stilletjes hun dim-kleur hebben gekost. De inspringing is een renderer-signaal, geen kosmetiek.

**Scope-noot:** lichte log-entry op verzoek — geen sessie-teller-ophoging (blijft 201), geen CLAUDE.md-rotatie, geen TASKS.md-wijziging. Git-historie (`6423f0c`) is zelf-documenterend.

---

## Sessie 201: Koppen sitebreed naar Nederlands zinskapitaal i.p.v. Engelse Title Case (26 jul 2026)

**Mission:** Gebruiker (screenshot van `blog/metasploit-beginnersgids.html`): "sommige woorden in de titel beginnen met hoofdletters, andere niet — kan je dit analyseren en perfectioneren?" Diagnose: de site gebruikte Engelse Title Case (elk inhoudswoord een hoofdletter), én inconsistent toegepast ("Payloads: Wat Gebeurt er Na de Exploit?" — "er" klein). Correct voor het Nederlands = zinskapitaal (alleen 1e woord + eigennamen). Scope-keuze Heisenberg: hele site + zuiver zinskapitaal (ook Engelse vaktermen klein tenzij eigennaam).

**Aanpak:** 2 Explore-audits (blogs + niet-blogs) telden ~340 Title-Case-koppen. Omdat de omzetting oordeelsgevoelig is (eigennamen-whitelist per kop) maar mechanisch van omvang, koos ik voor één zorgvuldig Python-script (`sentence_case.py`, scratchpad) + grondige dry-run-review per bestand, i.p.v. ~340 handmatige edits. Het script raakt alleen kop-contexten: `<title>`, og/twitter:title, JSON-LD `headline`/breadcrumb-`name`, `<h1-4>` (incl. genest `<a>`/`<abbr>`), zichtbare breadcrumb `<li aria-current>`.

**Work done (commit `65c5f18`, 27 bestanden, 518/518 gebalanceerde regel-vervangingen):**
- **15 blogs** incl. `blog/index.html`-kaarten (in lockstep met elke artikeltitel).
- **8 hoofdpagina's:** index, terminal, gidsen, over-ons, woordenlijst, contact, 404, commands/index.
- **3 juridische pagina's:** cookies, privacy, terms (~102 koppen).
- **1 JS-modalkop:** `src/ui/legal.js:56` "Juridische Kennisgeving" → "Juridische kennisgeving" (handmatig).
- **+typofix:** `terms.html:301` "Scheibaarheid" → "Scheidbaarheid" (severability-clausule; bevestigd door de paragraaftekst).
- **Titel-cluster (7 plekken per blog-artikel):** `<title>`, og:title, twitter:title, JSON-LD `headline`, BreadcrumbList `name` (pos 3), `<h1>`, en de kaart in `blog/index.html` — allen synchroon zodat gestructureerde data niet van de zichtbare kop divergeert.

**Transformatie-regels (in het script gecodeerd):** eerste woord + eigennamen hoofdletter; na `:` klein (NL-conventie); na `?`/`!`/`.`-met-spatie = nieuwe zin (hoofdletter); afkortingen ("vs."/"art.") starten géén valse zin; sectienummers met punt ("2.1"/"1.") kapitaliseren het volgende woord, kardinale getallen ("5 essentiële") niet; hyphen-bewust (IT-kennis, in-band); `<code>`-inhoud letterlijk (nmap-vlag `-sV`). Whitelist behoudt: merken (Metasploit/Nmap/Wireshark/OWASP **Top 10**), nationaliteitsadjectieven (Nederlandse/Engelse — NL houdt hoofdletter), landen (Nederland), camelCase-API's (localStorage/sessionStorage), acroniemen (TCP/WAF/GDPR/SMS/SQL/CTF), juridische afk. (Sr, III), toets-notatie (Ctrl+C). Post-fixes voor meerwoord-productnamen (Pentest Playbook, Starter Kit, Google Analytics/AdSense, Plausible Analytics). Bewust overgeslagen (skip): OWASP-categorieën A01–A10, certificeringsnamen (CEH/OSCP/eJPT-expansies), CompTIA/PenTest+, en enkelvoudige lowercase-command-koppen (`<h2>nmap</h2>` op de commands-pagina).

**Learnings:**
- **Script > handwerk voor bulk-transform-met-whitelist — mits masking.** Twee bugs doken pas op de niet-blog-pagina's op: (1) `woordenlijst.html` heeft letterlijk `<h3>` in een CSS-comment ("de categorie-`<h3>` erachter") → de `<h[1-4]>`-regex liep zonder sluit-tag door tot de échte `</h1>` en verminkte het hele style-blok + de JSON-LD; (2) `commands/index.html` heeft command-namen als koppen (`<h2>nmap</h2>`). Fix: `<style>`/`<script>` maskeren vóór de heading-regex draait (JSON-LD apart met string-patronen verwerken), plus enkel-lowercase-woord-koppen skippen. Blogs misten dit omdat ze geen inline-`<style>` hadden — de gevaarlijkste bug verstopt zich in de bestandsklasse die je het laatst test.
- **Iteratieve dry-run-review is de kern van de methode.** Elke batch onthulde randgevallen die een blinde `sed` zou hebben gemist: "Nederland"→"nederland" (landennaam), "IT-kennis"→"it-kennis" (acroniem-in-compound), "vs."→valse-zin-grens, "-sV"→"-sv" (code-inhoud), "5 Essentiële" (getal-first), "localStorage"→"localstorage". Elk gefixt vóór het schrijven.
- **Idempotentie als verificatie.** Tweede pass over alle 26 bestanden = 0 wijzigingen → bewijst consistentie én dat niets is gemist. Aangevuld met `git diff` collateral-scan (leeg), browser-render van de gemelde pagina, en de pre-commit blog-JSON-LD/tag-balans-hook (groen).
- **518 inserts / 518 deletes = puur tekst-casing, 0 structuur** — een sterke integriteitsindicator bij een grote diff.

**Bewuste keuzes (aan Heisenberg gemeld):** "Filesystem commands" e.d. (welkom-blog + commands-pagina) óók kleingeschreven — consistenter met zuiver zinskapitaal dan de "niet aanraken"-noot uit mijn plan. "Probeer het Metasploit command" kreeg merk-hoofdletter (was lowercase command); aangeboden om terug te draaien indien gewenst.

**Commit (gepusht naar `main`):** `65c5f18` (style(koppen): sitebreed Nederlands zinskapitaal i.p.v. Engelse Title Case).

**Metrics delta:** ~0 KB net (tekst-casing, geen byte-significante wijziging; blog-KB-marker binnen tolerantie, validate-docs Check 6 groen) | 28 spec files / 213 tests ongewijzigd (geen test-wijziging; geen runtime-gedrag geraakt) | 1 commit. NEW memory `feedback_dutch_sentence_case_headings`.

**Next steps (open, Heisenberg):** ongewijzigd t.o.v. Sessie 199-200 — `docs/launch-checklist.md` afwerken → launch wo 29 juli; ná launch item #45 (value-prop/retentie) op echte funnel-data; item #46 GA4-launch-dag-handelingen. Optioneel: "Probeer het Metasploit command" terug naar lowercase indien gewenst.

---

## Sessie 200: Command-output-audit (item #47) afgerond — Fase 3 triviale correctheid-nits (26 jul 2026)

**Mission:** Gebruiker: "voer Fase 3 uit: drie triviale correctheid-nits, in één commit naar main." Fase 3 is het laatste blok van item #47 (command-output-audit), dat eerder op 26 jul in losse werkblokken liep. Deze conversatie deed uitsluitend Fase 3 + de /summary.

**Context — waar Fase 3 op sluit:** item #47 kwam voort uit de metasploit-command-cleanup (`f56d886`) en werd uitgerold in 3 fases (roadmap `ebc86c8`): Fase 1 = security-cluster sqlmap/hydra/hashcat/nikto (`f65c93d`), Fase 2 = meta-funnel next/shortcuts/onboarding/help (`0a256ad`), Fase 3 = deze triviale nits. Fase 1+2 landden eerder dezelfde dag (aparte context); dit logboek beschrijft ze als committed context, niet als eigen werk.

**Work done (Fase 3, commit `e31075b`):**
- `src/commands/filesystem/cp.js:47` — `[TIP] De bronbestand bestaat niet.` → `Het bronbestand` (onzijdig; sloot interne inconsistentie met `mv.js:61` dat het al goed deed).
- `src/commands/system/certificates.js` — `kopieren` → `kopiëren` (ontbrekend trema), `replace_all`. Een `grep -rn "kopieren" src/` vooraf bewees exact 2 voorkomens, beide in dit bestand (`:95` manPage, `:158` execute-output) → file-scoped `replace_all` kon niet over-reachen.
- `src/commands/network/nmap.js` — onvertaald "attack surface" → "aanvalsoppervlak" op 2 user-facing regels (`:160` scan-TIP, `:234` manPage), onzijdig "minimaal" (niet "minimale"), de term die de manPage op `:220` zelf al als glosse gebruikt.
- **Bewust NIET aangeraakt:** `nmap.js:53` (code-comment, niet user-facing) + `:162`/`:235` ("meer ingangen voor aanvallers" hoort bij het veel-poorten/slecht-geval, ander register).

**Verificatie:** `node --check` op de 3 bestanden (schoon). Browser-driving via directe ES-module-import op een lokale http-server i.p.v. de typewriter/consent-UI: `cp.execute(['bestaat-niet.txt','x'], {}, {vfs})` met een stub-`vfs.copy` die "No such file" gooit (bevestigt cp:47-TIP), `nmap.execute(['secure-server.local'], {}, {})` → de single-443-tak (bevestigt de :160-TIP met "minimaal aanvalsoppervlak"), + `nmap.manPage`/`certs.manPage`-regex (bevestigt :234 en :95 incl. correcte `ë`-UTF-8). `certificates.js:158` is challenge-gated → code-inspectie volstond (dezelfde `replace_all` dekte het, grep = 0 residu). Diff = exact 5 regels in/uit, geen collateral.

**Commit (gepusht naar `main`):** `e31075b` (fix(output): drie correctheid-nits, item #47 Fase 3).

**Learnings:**
- **Directe module-import als testinstrument omzeilt de UI-ceremonie.** De command-modules exporteren een object met `execute`/`manPage`; via `import()` in de browser + stubs (vfs) of een passende target (`secure-*` → 443-only) exercise je het échte codepad zonder de typewriter, consent-modal of FocusTrap te doorlopen. Precies het soort meting waar de sessie-learnings herhaaldelijk voor pleiten (meet het gedrag, niet de scherm-heuristiek).
- **`replace_all` is veilig juist omdat de grep vooraf de reikwijdte bewees.** Exact 2 treffers, beide in één bestand — zonder die grep zou een file-scoped replace-all een gok zijn.
- **Faithful attribution in het sessielog.** Deze conversatie deed alleen Fase 3; Fase 1+2 + metasploit-cleanup staan als committed context, niet als geclaimd werk. De git-historie + commit-messages leggen hun detail al vast (protocol: her-leid niet wat de repo al registreert).

**Metrics delta:** src/ 673→671 KB (afronding; Fase 3 = ~0 KB net, 5 char-regels) | styles/blog/assets ongewijzigd (394/447/1030 KB) | 28 spec files / 213 tests ongewijzigd (geen test-wijziging) | 1 commit. Item #47 nu volledig ✅.

**Next steps (open, Heisenberg):** ongewijzigd t.o.v. Sessie 199 — `docs/launch-checklist.md` afwerken → launch wo 29 juli; ná launch item #45 (value-prop/retentie) op echte funnel-data; item #46 GA4-launch-dag-handelingen.

---

## Sessie 202 — learnings (geroteerd uit CLAUDE.md, Sessie 208)

**Sessie 202:** Mobiele kolom-uitlijning + box-truncatie in terminal-output (28 jul 2026)
⚠️ **Never:**
- Een gemelde layout-bug fixen zonder de gedeelde util erachter te checken — de reset-menu-collapse was één symptoom; de hoogste-waarde-bug (`asciiBox.wrap()` kápte *waarschuwingstekst* af met `...` in álle 5 SECURITY WARNING-boxen op mobiel) zat in de util die de gemelde commands voeden, niet in de gemelde output. Grep de callers (`boxText`/`lightBoxText`) vóór je concludeert dat het één command is.
- Een fix in de draaiende app verifiëren als de module relatief-geïmporteerd is zónder `?v=` — geen build-stap + `asciiBox.js` zonder cache-bust → de browser serveerde de oude versie (in-app render toonde nog `...`). `import('/src/…?cb='+Date.now())` in `browser_evaluate` raakt het bestand-op-schijf en draait het échte codepad (Sessie 200-techniek).
- Elke regel in een box blind woord-wrappen — `wordWrap` collapse't leidende + uitlijn-spaties, wat desktop-inspringing sloopt. Alléén regels die de breedte *overschrijden* herwrappen; passende regels verbatim → geen desktop-regressie.
- Een twee-koloms-menu "redden" met alleen hanging-indent — `data-indent` lijnt continuatie uit, maar de beschrijving blijft als sibling-item lezen (precies de screenshot). Echte fix = stapelen met diepere indent + blank-line-groepering.

✅ **Always:**
- Onderscheid "echt kapot" van "degradeert acceptabel" — reset-menu (twee zware kolommen) = kapot; `label ← glosse` met ≥3 leidende spaties wordt al door de hanging-indent gered → ongemoeid (`metasploit`/`hydra`). Proportioneel, geen sweep-om-de-sweep ([[feedback_proportional_effort_hobby]]).
- Een crash-footgun fixen óók als 'ie onbereikbaar is, mits goedkoop — box-titel-`RangeError` (`horizontal.repeat(negatief)` bij titel > boxbreedte) is prod-onbereikbaar (man/help vertakken op `isMobileView()` → desktop-only), maar 1 regel `label.slice(0, width)` zet crash → graceful. Crash ≫ cosmetisch.
- Beslis als expert i.p.v. optiemenu bij techniek — systemische renderer-reflow-heuristiek verworpen (ASCII-art/code-blokken/authentieke tool-output hebben óók multi-spaties die je niet mag herschikken; Sessie 196: bevries aan de bron, filter niet de output) → gerichte per-output-fixes. Scope-omvang wél aan Heisenberg gevraagd (dat is een product-keuze) ([[feedback_expert_decisions]]).
- Meet mobiel objectief — Playwright 375px: `overflowCount` via `scrollWidth>clientWidth`, page-scroll via `scrollX`/`bodyScrollW`, box-randuitlijning via `[...new Set(rows.map(r=>r.length))]` (alle regels exact `width+2`). Niet op het oog.

---

## Sessie 204 — learnings (geroteerd uit CLAUDE.md, Sessie 212)

**Sessie 204:** Box-omlijning brak op tussenbreedtes — corrupte box-font + meetfouten (31 jul 2026)
⚠️ **Never:**
- `document.fonts.check()` als bewijs dat een font laadt — geeft true óók bij `FontFace.status === 'error'` (gemeten); zo bleef de corrupte inline 'JetBrains Mono Box'-embed **120 sessies** (sinds Sessie 83) onzichtbaar terwijl alle box-glyphs via OS-fallbacks met afwijkende advances renderden. Assert `fonts.load(...)` + `status === 'loaded'`.
- `scrollWidth <= clientWidth` als overflow-assert op `#terminal-output` — `overflow-x:hidden` + `pre-wrap` laat te brede regels wrappen, nooit scrollen → de check kan structureel niet falen (vals-groen op precies deze bug-klasse).
- Rect-`top`-vergelijking of `rects.length` als visuele wrap-detector — inline spans (`marker-arrow` heeft `vertical-align:.2em` = 3.6px) verschuiven rects op één visuele regel → 11 gemeten vals-positieven. Element-hoogte > 1.5× line-height is immuun (echte wrap verdubbelt de hoogte); rood-op-mutant bewezen.
- Een meting "correct maken" vóór de bovenliggende bugs gefixt zijn — de Inter-op-container-mismeting *onderschatte* de kolomcapaciteit ~35% en redde brede desktops toevallig; eerst correct meten had de boxen juist óp de rand gezet. Fix-volgorde was bindend: font → breedte-contract → meting.

✅ **Always:**
- Font-embeds byte-diffen tegen het bronbestand — 2 corrupte b64-chars in 6936 maakten de hele woff2 onbruikbaar (brotli is niet fout-tolerant), maar `@font-face` faalt stíl naar een visueel bijna-identieke fallback; alleen de metriek verraadt het. Borderregels (één ononderbroken glyph-run zonder breekpunten) wrappen dan als eerste, per machine anders.
- Meet op het element waar de tekst écht rendert — `#terminal-container` erft `--font-body` (Inter); `#terminal-output` heeft `--font-terminal` én `clientWidth` exclusief de eigen scrollbar. Plus `charWidth = max(measureText('M'), '─', '━')`: canvas respecteert `@font-face` unicode-range, dus dit meet de echte subset-advance — die max had deze hele bug gevangen.
- Oude output die na venster-resize breekt = by-design (echte terminals reflowen ook niet; gereproduceerd: 68/68 wraps oud, 0/12 vers) — test-consequentie: na viewport-resize het command opnieuw uitvoeren, nooit oude output meten.
- Sessienummer-ambiguïteit (eerdere zelfde-dag-context labelde "Sessie 204" in TASKS.md maar rondde `/summary` nooit af): nummer overnemen + dat werk als committed context loggen, niet claimen (Sessie 200-protocol) en niet hernummeren.

---

## Sessie 205 — learnings (geroteerd uit CLAUDE.md, Sessie 213)
⚠️ **Never:**
- Een submodule-fix verifiëren tegen een warme browser — `?v=` zit alléén op de entry-points (`main.js`/`main.css`); de ~99 relatief geïmporteerde modules dragen er géén, dus een entry-bump bust ze niet en `must-revalidate` grijpt pas ná `max-age`. Dit kostte 3 valse diagnoses (fix stond op schijf, browser draaide oud) én verklaarde waarom de Sessie 204-fixes terugkerende bezoekers nooit bereikten (gemeten: gecachete `box-utils` 41 chars vs server 62). Verifieer met een **no-store server** of `import('…?cb='+Date.now())`.
- Een `isMobileView()`-guard gebruiken om "desktop-only" gedrag af te bakenen — een half-gesnapt desktopvenster is 683/720px en valt ónder de 768-drempel, precies het gemelde scenario. Laat de datavorm de guard zijn (hier: de aanwezigheid van box-blokken; mobiel rendert borderless → parser vindt niets → no-op).
- Defensieve heuristiek toevoegen zonder te bewijzen dát je 'm nodig hebt — mijn layout-wijziging-detectie bleek bij gericht uittesten overbodig (de `resizing`-vlag volstond in Chromium/Firefox/WebKit) en is geschrapt. Simpelste versie die werkt + een test die de aanname bewaakt ≫ permanente defensieve code.
- `wordWrap()` op inhoud met inspringing loslaten — `split(' ')` eet leidende spaties, óók op part 0. Indent apart bewaren en elke part her-prefixen, zoals alle box-producers zelf al doen.

✅ **Always:**
- Reproduceer het gemelde scenario mét de oude code vóór je claimt dat je het oploste — het screenshot-scenario gaf 69 boxregels / 69 wraps op productie, en 0 wraps met de reflow. Daarmee was hard te beantwoorden dat dit géén dubbel werk was: Sessie 204 gaat over verse render, dit over reflow van bestaande output (disjunct). Bijvangst: de 204-fix maakte het symptoom zichtbaarder, want de oude Inter-mismeting maakte boxen ~35% te smal = toevallige speling.
- "Live geverifieerd" moet het hele afhankelijkheidsoppervlak dekken, niet alleen het gewijzigde artefact — Sessie 204 checkte het font (CSS-entry mét `?v=` = vers) maar niet de JS-modules (stale). Halve verificatie leest als volledige.
- Bij DOM-mutatie naast lopende animaties: muteer alleen child-regels, nooit de wrapper (`_revealCelebration` houdt referenties + opacity-state op `.terminal-completion-*`), en herstel scroll met `behavior:'instant'` — `animations.css` zet `scroll-behavior:smooth` op `#terminal-output`, wat elke `scrollTop`-toewijzing in een animatie van honderden ms verandert (vertroebelt ook je metingen).
- Een "by design"-verklaring is een productkeuze, geen technische — Sessie 204 verklaarde niet-reflowen tot echte-terminal-gedrag; verdedigbaar, maar in een browser-leeromgeving weegt leesbaarheid bij venstermanipulatie zwaarder. Zulke keuzes horen bij Heisenberg ([[feedback_expert_decisions]] geldt voor techniek, niet voor scope).
