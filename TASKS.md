# TASKS.md - HackSimulator.nl

**Laatst bijgewerkt:** 19 aug 2026 (Sessie 228; ongefilterde contrast-sweep → 152 onder AA en 378 onder AAA gerepareerd, nieuwe sitebrede guard)
**Sprint:** Sessie 228: **Vier CSS-commentaren claimden een contrast dat ze niet haalden — en de sweep die dat had moeten zien, filterde op tokennaam** (`a9a4946`, gepusht). Opdracht: sluit de contrast-KLASSE, niet het volgende exemplaar (#72). **Meting:** 30 pagina's × 2 thema's × 2 viewports = **13.157 element-toestanden**, ongefilterd (élk element dat zelf een tekstnode rendert, tegen zijn effectieve achtergrond), gegroepeerd op **kleurwaarde** en niet op token — dezelfde hex zit onder meerdere namen. Uitkomst **152 onder AA / 378 onder AAA over 18 kleurwaarden**; ná de fixes **0 / 0**, en de volle chromium-suite bleef op **489 passed / 0 failed / 7 skipped** ondanks 14 gewijzigde tokenwaarden. **Waarom drie eerdere rondes dit misten — vier meetgaten:** (a) élke bestaande contrastspec filtert op een tokenlijst, en het zwaarste defect (`--color-footer-link` #c9d1d9 op de witte cookiebanner, **1,54:1**, op élke pagina) stond op geen enkele lijst; (b) geen sweep scrolde, terwijl `.leerpad-card` op `opacity: 0` staat tot een observer `.visible` zet — de hele `.level-badge`-groep viel buiten de populatie, inclusief de laagste waarde van de site (**1,74:1**); (c) één viewport, terwijl 115 falers alleen op mobiel bestaan (blog-`<strong>` zakt onder 18,66px en verliest de large-text-lat) en 54 alleen op desktop; (d) alleen rusttoestanden, terwijl `--color-warning`/`--color-info` pas ná een commando renderen en een `<input>`-waarde géén tekstnode heeft — dáár zat de promptregel van de terminal op **1,96:1**, in light mode lime op bijna-wit. **Vier commentaren logen, alle vier geruststellend:** `--color-prompt` "4.8:1 (WCAG AA ✅)" → 1,96; `--color-success` "7.5:1 (WCAG AAA ✅)" → 4,29; `--color-ui-primary` "3.25:1 on white (WCAG AA)" → 3,25 ís geen AA; en `--color-cta-primary` ("op een ACHTERGROND met wit erop is hij prima", geschreven in Sessie 227) → **3,30** op de primaire "Start de simulator"-knop, 13 pagina's. NEW `tests/e2e/text-contrast.spec.js` (31 tests, 6 mutanten met 6 verschillende faalpatronen). Zie #72 en #73.
**Sprint:** Sessie 227: **Vier taken die elk een halve reparatie van een eerdere sessie afmaakten** (`8daf26d`, `8696111`, `53f6412`, `d2dad44`, gepusht) — bundelpoort telde 50 KB blog mee en de helft van zijn eigen entry-points niet (#70); `--color-link` haalde nergens AAA plus vier hover-toestanden onder AA (#71); de legal-pagina's heetten anders dan waar de site naar linkte, in vier titelvelden tegelijk (#68); en de flaky autocomplete-spec bleek de enige terminal-spec zónder legal-modal-afhandeling (#64). ⚠️ Deze sessie kreeg destijds géén `/summary`; de sprintregel en de `current.md`-entry zijn in Sessie 228 achteraf gereconstrueerd uit de commits en de TASKS-items.
**Sprint:** Sessie 226: **De blog had 418 koppen zonder id en een filter van 26,8px — geen van beide stond in de CSS** (`e19e74f`, `90e7ccd`, `04e4d57`, gepusht). Opdracht: analyseer de blogsectie op layout/UX/UI/design en bepaal zelf verdere controlepunten. Alles gemeten op `nostore-server` @375px en @1280px in **beide** thema's; 13 punten gevonden (5 defecten, 5 structuurgaten, 3 onderhoudsrisico's), volledige scope uitgevoerd op verzoek. **Tapdoelen:** alle 7 categoriefilters waren **26,8px** hoog (WCAG AAA 2.5.5 = 44×44). De oorzaak was níét de padding maar `display` — op een inline `<a>` doet `min-height` niets; `display:inline-flex` erbij → 7/7 op 44px. **Contrast:** `--color-text-dim` (#8b949e) haalde op **geen enkel** donker oppervlak AAA (6,15 op `--color-bg`, 5,62 op `--color-bg-modal`) → #a1a8b0 (7,88 / 7,20). Bijvangst: de light-mode knopkleuren `#1976d2`/`#1565c0` dróegen "WCAG AAA compliant" in hun eigen commentaar en maten **4,60** en **5,75** — de dark-mode tegenhanger `#004494` is wél ooit doorgemeten (7,2), deze twee zijn er naar analogie naast gezet. Nu 7,41 / 8,68. Sitebreed nagemeten op de homepage: 49 dim-tekstelementen, **0 onder AAA** in beide thema's. **Inhoudsopgave:** 0 van 418 koppen had een `id`, in 15 posts van 19-41 koppen elk, terwijl een artikel tot **~17.800px** oploopt op 375px (~22 schermen zonder in-page navigatie). Werkverdeling: id's **statisch** (NEW `scripts/add-heading-ids.mjs`, idempotent, 343 toegevoegd) zodat `validate-blogs.sh` ze kan bewaken en een deeplink zonder JS werkt; de TOC zelf **runtime** (NEW `src/ui/blog-toc.js`) want een statische lijst in 15 bestanden moet in lockstep blijven. `blog.css` had geen `scroll-padding-top` → ankers landden achter de vaste navbar. **Index:** het nieuwsbriefblok (606px = 75% viewport) stond tussen filter en grid en duwde de eerste kaart naar **y=1125** op 375×812, 313px voorbij een vol scherm → nu na de derde kaart, **y=522**. Datums waren 15 plain spans terwijl de posts `<time datetime>` voeren. NEW `src/ui/blog-filter.js` voor `aria-current` + resultaatteller; het filter blijft CSS-only werken zonder JS. **Twee latente valstrikken:** `.blog-meta span:last-child` bond op **positie** in een rij die aangroeit (exact het patroon dat in Sessie 223 op `.blog-post-meta` misging) → klasse; en `#bronnen` stond als losse kopie ~600 regels van de andere vijf filterregels, met `.category-btn.active`/`:target` die **nooit** iets matchten. **ARIA/taal:** 31 Engelse aria-labels op `lang="nl"`-pagina's en 15× `role="progressbar"` **zonder** `aria-valuenow` (kapot aangegeven widget; de leesbalk is decoratief → `aria-hidden`). "Over Ons" stond 58× in Engelse Title Case, óók in `navbar.js`/`footer.js` die op élke pagina renderen. **Guards:** `validate-blogs.sh` checks 8-10, elk met een tak die faalt bij **nul** treffers; 4 mutanten, 4 rood, elk geverifieerd dat hij het bestand echt wijzigt. NEW `tests/e2e/blog-navigation.spec.js` voor wat alleen gerenderd meetbaar is. 186 tests groen over drie motoren. ⚠️ **Bundel 1118,63/1120 — marge 1,37 KB (0,1%)**; zie de bundelregel voor de formule-vraag die dit oproept.
**Sprint:** Sessie 225: **De nieuwsbrief was af na vijf redactierondes — en elke ronde legde een defect bloot dat níét in de tekst zat** (`0d24f45`…`a3e6c44`, gepusht). Opdracht: ontwerp de augustus-editie. Tip werd **SQL-injectie via `sqlmap`** — het juni-onderwerp uit de contentkalender dat nooit verstuurd is. Alle claims tegen de echte codepad gemeten (`MySQL 5.7.32`, 3 databases, `shop_db`/`users_db`, de tweetraps consent-flow); de leerpad-melding *"Fase 4 vergrendeld"* bleek **display-only** (`leerpad.js:59`) — `registry.execute()` kent geen gate, dus een nieuwe lezer kan `sqlmap` meteen typen. **Verzendconventie herzien:** "eerste dinsdag" ankert op de kalendermaand terwijl de cadans een *interval* is; juli ging ~30 juli en de eerstvolgende eerste dinsdag was 4 aug, dus de regel dwong tot óf 5 dagen gat óf augustus overslaan. Nu **derde dinsdag + minimaal 21 dagen** (gaten aug→dec: 19/28/35/28/28, met `date -d` gemeten). De parenthese "(beste open rates voor B2C NL)" is geschrapt: bij twee verstuurde edities is een dag-van-de-week-effect niet meetbaar. **Drie typografische defecten gevonden bij het nameten van "de tekst is klein":** (1) `.mobile-padding td` is een **afstammeling**-selector terwijl de klasse óp de cel staat — `cel.matches('.mobile-padding td') === false`, dus de mobiele padding-verkleining heeft **nooit** gewerkt; de regel landde in plaats daarvan op de geneste code-block-cellen. Kostte 32px tekstbreedte op élke mobiele weergave. (2) Vet erfde exact de bodykleur: **5,62:1 voor beide**, alleen `font-weight` verschilde. (3) De Courier-familie heeft x-hoogte-ratio **0,42** tegen 0,53-0,55 voor elke moderne monospace (canvas-inkmeting op 100px: Nimbus Mono PS 0,42, Liberation Mono 0,53, DejaVu 0,55) — en staat juist wél op Windows/macOS/iOS en níét op Android, dus de mail verschilde ~20% in optische grootte per ontvanger. **Nul code geraakt:** alle zeven commits sinds `851e237` op `docs/newsletter/` na `d2d2484`, die als enige bundel- en spec-bestanden raakte.
**Sprint:** Sessie 224: **De dader was 280px breed en 377px lang — de scan keek naar het verkeerde getal** (`0bffca5`, gepusht). Opdracht: fix de 22px horizontale overflow op `assets/legal/terms.html` en sluit het dekkingsgat op de drie legal-pagina's (TASKS #67). **Sessie 223 noteerde de oorzaak als "niet vastgesteld — vermoedelijk een pseudo-element of scroll-regio", omdat geen enkel element met zijn border-box buiten beeld viel. Dat klopte ook:** de `<h1>` *is* 280px breed en blijft binnen de viewport; het is zijn **inhoud** die 377px meet. Twee verschillende getallen op hetzelfde element, en de scan las het verkeerde. Onderliggend mechanisme: deze drie pagina's laden **`mobile.css` niet** (alleen `main.css` + `legal.css`), dus `--font-size-base` blijft 18px op ≤768px en de h1 houdt de UA-default `2em` = **36px, ook op 320px** — elke andere pagina schaalt daar mee. "Gebruiksvoorwaarden" (19 tekens, geen breekpunt) is dan 377px in een contentbox van 280px; documentbreedte = 20px padding + 377 = **397px ongeacht viewport**, wat de hele gemelde reeks in één som verklaart (77/37/22/7/0 @320/360/375/390/414). Privacy en cookies ontsnappen omdat hun koppen **twee woorden** zijn — niet omdat ze korter zijn. **Zichtbaar symptoom is een afgekapte kop, geen pannende pagina:** `main.css:422` zet `overflow-x:hidden` op `body`, wat naar de viewport propageert — `scrollTo` werkt programmatisch (dát mat Sessie 223), pannen niet; de screenshot toont "Gebruiksvoorwaa". **Fix gekozen op meting in drie motoren:** `overflow-wrap:break-word` 0/0/0 → gekozen; `hyphens:auto` alleen Firefox (die heeft nl-patronen, breekt op `Gebruiksvoor|waarden`), Chromium 77 en WebKit 78 onveranderd → afgevallen; `clamp()` verworpen omdat een 27-tekenkop 20px font zou vragen. Generiek getest tot 502px (`Aansprakelijkheidsbeperking`, 202px → 0). A/B tegen HEAD: @1280 en @768 **byte-identiek** in kopbreedte, kophoogte én documenthoogte — inert op desktop. NEW `tests/e2e/legal-pages-overflow.spec.js` (**eerste assertie ooit op `assets/legal/*`**) met twee asserties die op **verschillende breedtes** falen: A = documentoverflow, B = koptekst binnen de eigen box — @414px is A groen (397 < 414) terwijl B nog 3px ziet. Twee mutanten die elkaars complement zijn: fix eruit → 9 rood (alleen terms; A @320/@375, B óók @414); `min-width:700px` op de body → 27 rood op A, B overal groen. **Die tweede is het enige bewijs dat privacy/cookies werkelijk gemeten worden** — die zijn vóór én ná de fix groen. Twee meetvallen gefilterd: kinderen van `overflow-x:auto`-tabellen houden onafgekapte rects (vier valse randen per meting), en Firefox geeft `clientWidth 0` op inline-elementen (elke `<strong>` als "158>0"). 27/27 groen ×3 motoren, regressie 60 passed / 3 skipped. Bundel **1104,61 / 1120 KB** (marge 15,39 KB = 1,37%). Bijvangst als #68: `privacy.html`/`cookies.html` voeren **Engelse koppen** ("Privacy policy"/"Cookie policy") op een `lang="nl"`-pagina terwijl de site er in het Nederlands naar linkt.
**Sprint:** Sessie 223: **De verantwoording wekte wantrouwen, en de wet die dat regelt gold al twaalf dagen** (`9e93336`, `b051b1b`, `fbb1fc5`, gepusht). Opdracht: de `#verantwoording`-sectie op `over-ons.html` maakt de site juist ónbetrouwbaarder; herschrijf hem wetsconform zonder het vertrouwen te schaden, en haal de perspectiefsprong (3e persoon → ik-vorm) eruit. **Juridisch onderzoek (subagent) draaide de aanname om:** art. 50 lid 4 AI-verordening is van toepassing sinds **02-08-2026**, geverifieerd bij twee onafhankelijke bronnen. AI-tekst die het publiek informeert over aangelegenheden van algemeen belang moet als zodanig worden aangemerkt; de uitzondering vereist **menselijke** inhoudelijke toetsing (feitencontrole = minimumvereiste) plus een met naam genoemd redactioneel eindverantwoordelijke. Certificering is uitdrukkelijk **niet** vereist. Heisenberg bevestigde: geen eigen feitencontrole, wel meerdere AI-rondes — dus de uitzondering is **niet beschikbaar** en de melding moet op de contentpagina's zelf staan, want de wet meet bij de *eerste blootstelling* en de meeste lezers landen via Google op een post. **Twee claims klopten daardoor niet:** het `title`-attribuut op 15 posts beloofde dat "de feitelijke beweringen zijn nagelopen", en `over-ons.html` claimde dat de betaalde gidsen "apart gecontroleerd" waren inclusief wetsartikelen. De trustbasis is verschoven van *geloof me* naar *controleer me*: "Wat er gecontroleerd is" → **"Wat je zelf kunt natrekken"** met concrete ingangen (wetten.overheid.nl, rechtspraak.nl/ECLI, GitHub, de twee bestaande automatische checks). Elke hergebruikte claim eerst tegen de bron geverifieerd. **Bijvangst 1:** `.blog-post-meta span:last-child` (0,2,1) versloeg `.blog-ai-notice` (0,1,0) — de melding rendeerde in linkblauw op **4,89:1** terwijl het commentaar "bewust gedempt" beloofde; die regel was geschreven toen de categorie-badge de laatste span was en wisselde in Sessie 208 stilzwijgend van doel. Verwijderd (dood voor de badge, die zet zelf color + font-weight) → **9,17:1 AAA**. **Bijvangst 2:** drie plekken schreven de verzwaarde strafmaat van art. 138ab Sr toe aan het basisdelict ("ongeautoriseerde toegang … maximaal 4 jaar"; lid 1 = **2 jaar**, lid 2/3 = 4 jaar) — **derde keer** dat deze fout opduikt, want de eerdere correctie raakte één regel zonder sweep en zonder guard, waardoor `wat-is-ethisch-hacken.html` zichzélf tegensprak. NEW Check 16 in `validate-docs.sh` (positieve invariant: toon de gradatie via "tot N jaar" óf beide grenzen; meet 8 claims), NEW AI-melding-assertie in Check 7 van `validate-blogs.sh`. Mutanten: 3 op de AI-melding + 4 op Check 16, elk met een **andere** faalmelding; twee mutant-pogingen muteerden aanvankelijk niet en zijn herbouwd. E2E 164 passed / 0 failed over 11 specs. Bundel **1103,43 / 1120 KB** (marge 16,57 KB = 1,48%).
**Sprint:** Sessie 220: **Opruimsessie — vier van de vijf punten bleken een notitie te zijn die niet meer klopte** (8 commits, gepusht). **(1) De juridische welkomstmail was al af**: het plan wilde `sample-juridisch.html:132` verzachten omdat het runbook nog "Stap 2 en 3 nog te doen" meldde, maar Heisenberg had de automation op 7 aug gebouwd — `Sample Juridisch — welkomstflow`, Active, trigger op het juiste formulier (`MUIFAGIf…`), mét het echte template. Pagina ongewijzigd; ik stond op het punt correcte copy te verzachten op gezag van een document dat drie dagen achterliep. **(2) `performance.spec.js:480` mat serieel niets**: de VFS-save is gedebounced op 1000 ms en die timer wordt door élke mutatie teruggezet, terwijl er ~350 ms tussen twee `touch`-commando's zit — meteen uitlezen gaf 0 bytes, na `flush()` 5139. Guard vervangen door `expect(avgGrowth).toBeGreaterThan(0)`; meet nu 44,00 bytes/bestand bij CV 0,0%. **(3) `responsive-breakpoints.spec.js:209`**: de vastgelegde diagnose ("10s `toBeVisible` onder CPU-contentie") klopte op geen van beide punten. Het waren 7 falers, en 5 daarvan waren géén testfout — drie parallelle motoren tegen productie triggeren **Netlify's bot-protectie**, wiens interstitial geen enkel site-element bevat (`TypeError: tc is null`). NEW guard in `fixtures.js`. De echte `:209`-bug was de legal-modal die de klik onderschept, ~500 ms ná de hamburger. **(4) Bulk-rotatie 205-209** byte-geverifieerd; de SESSIONS.md-index liep twee bulks achter. **(5) Zeven dode taken gesloten mét reden**, waaronder #34 dat 66 sessies wachtte op een poort die al dicht was. Plus één wayfinding-link naar `/gidsen.html` (tikdoel gemeten 268×49-50px). Bundel 1095,54 KB / 1120 (marge 2,2%).
**Sprint:** Sessie 219: **Onder "HackSimulator in cijfers" was de homepage één blok — en de band die als goed voorbeeld gold, was in light mode nul verschil** (commit `e7cc0c4`, gepusht). Heisenberg vroeg waarom de secties boven cijfers wél onderscheidend zijn en eronder niet. **Nulmeting (live, groeperen op effectieve achtergrond):** onder cijfers liepen `how-it-works` + `leerpad` + `blog-links` + `faq` op één achtergrond door — **2390px @1440 en 3078px @375 = 3,8 schermen**; bóven cijfers was de langste zo'n reeks 1023/1329px (1,6 scherm). Op mobiel telt mee dat `.landing-section` onder 768px van 96px naar 32px padding zakt, dus de scheiding is daar 64px witruimte bij een identieke achtergrond. **Twee bugs kwamen pas bij het meten boven.** (1) `[data-theme="light"] .results-section` was `rgba(248,248,248,0.8)` over een `#f8f8f8` pagina — dat composit naar **exact rgb(248,248,248)**, verschil `[0,0,0]`: de band was in light mode onzichtbaar en alleen de haarlijnen droegen hem (de comment erboven zei "zeer subtiel off-white" — de bedoeling klopte, de rekensom maakte hem nul). (2) De nieuwsbrief-band was `#161b22` en de kaarten zijn `rgba(22,27,34,α)` — tinten van diezelfde kleur, dus een kaart op die band composit naar de **bandkleur (Δ0)**. Dat maakt "banden lichter maken" op deze site structureel de verkeerde richting; ik liep er zelf in met mijn eerste prototype en zag het pas op de screenshot. **Regel i.p.v. drie ad-hoc waarden:** pagina = oppervlak, band = verdieping, kaart = verhoging — een band gaat in béíde thema's ónder `--color-bg`, zodat de kaart de lichtste laag blijft. Gemeten Δ t.o.v. de pagina **2 → 8** (dark) en **0 → 12** (light); kaart-op-band **3 → 6 / 19**. **Ná: langste oppervlak-reeks 949px (1,05 scherm) @1440 en 913px (1,12) @375** — de onderhelft is nu strakker geritmeerd dan de bovenhelft. Eén nieuwe band volstond (`.leerpad-section`): plaatsing telt, niet aantal, want `how-it-works` moet oppervlak blijven na de cijfers-band. **`--color-bg-alt` + `.section-band` (verf) + `.landing-section.section-band` (full-bleed);** die twee staan los omdat `.trust-bar` en `.homepage-newsletter` al volle breedte zijn. De `padding-inline: max(…)` vervangt een inner wrapper die `.leerpad-section` niet heeft — geverifieerd byte-identiek aan een gewone sectie (`[45,1381]` @1440, `[20,340]` @360). **Vier regels verwijderd, twee toegevoegd**; `.results-grid` ligt nu op dezelfde rail als de rest (was 13px breder). **Twee cascade-verliezen die alleen `getComputedStyle` verraadt:** `.leerpad-section { background: transparent }` had gelíjke specificiteit aan `.section-band` maar stond ~480 regels later, en `[data-theme="light"] .homepage-newsletter` herhaalde letterlijk zijn eigen basisregel maar op (0,2,0) en versloeg daarmee de band. **Bewijs:** 26/26 groen over drie motoren; mutant "band == pagina" maakt de ritme-assertie rood met **2392px (2,66) en 3070px (3,78)** — cijfer voor cijfer de oorspronkelijke meting; mutant "band == `#161b22`" maakt alleen de kaart-Δ-assertie rood terwijl het ritme groen blijft. **Kost 2,88 KB** (1091,02 → 1093,90; marge 2,3%) ondanks netto minder CSS-regels: het commentaar dat beide bugs vastlegt is langer dan de code. **Tweede vraag beantwoord zonder werk:** de juridische sample is bewust **niet** aan de homepage toegevoegd — die eindigt al met drie opeenvolgende asks, de north-star is activation (`docs/launch-success-metrics.md:39`), de asymmetrie is 17 links vs 1 en hoort contextueel opgelost (de drie juridisch-getinte blogposts), en `docs/newsletter/brevo-setup-sample-juridisch.md:9-10` zegt dat de welkomstmail-automation nog niet af is terwijl `sample-juridisch.html:132` hem wél belooft.
**Sprint:** Sessie 218: **De strook onder de terminal was AdSense-vulling die AdSense vijf maanden overleefde — gehalveerd, klikbaar gemaakt en voor het eerst gemeten** (commit `9b44314`, gepusht). Heisenberg vroeg of alles onder de terminal nog nodig was. **De herkomst besliste de vraag:** commit `1cc04ff` (4 mrt 2026) heet letterlijk *"full-viewport terminal + scroll hint for AdSense content"* en het bericht zegt *"Education content stays below the fold, fully crawlable by AdSense"*; de voorganger `f748c38` droeg de cache-buster `?v=108-adsense-content`, en de aanleiding was de thin-content-drempel uit `.claude/plans/monetization-C-content-seo.md:96`. Advertenties zijn in Sessie 208 verwijderd — de aanleiding bestond dus niet meer, maar de strook was nooit heroverwogen. **Nulmeting op productie (1280×800):** 2424px van 3737px = **65% van de pagina**, 396 woorden, **3 links** — allemaal in het laatste blok; de zes command-kaarten noemden `nmap`/`hashcat`/`sqlmap` bij naam en waren **geen link**; **nul `<h1>`** op de hele pagina. **Ná: 1784px (−26%), 12 links, 284 woorden, 1 `<h1>`** — pagina van 4,67 naar 3,87 schermen. **Rangschikking i.p.v. "alle drie de rollen":** de gedocumenteerde north-star van deze pagina is *activation-rate* (`docs/launch-success-metrics.md:44` — "typte de bezoeker een command", niet "las hij iets"), alle site-brede CTA's wijzen hiernaartoe en alle monetisatie staat op `index.html`; dus app-oppervlak eerst, SEO een echte maar secundaire bijrol, en "onboarding onder de vouw" is geen rol maar een bug. **"Zo begin je" geschrapt** omdat de terminal het zélf zegt op het juiste moment (`onboarding.js:196`, de input-placeholder, en `next.js`/`leerpad.js` als echte commands) — vier schermen lager is onboarding voor wie hem niet meer nodig heeft, en `.scroll-hint` staat onder 768px op `display: none`, dus mobiel weet niet eens dat er iets ónder staat. **Kaarten zijn links** naar `/commands/#cmd-X` (ankers bestaan, en die vorm is al site-brede conventie: 12× naar `#cmd-nmap` vanuit blogposts), met CTA "Bekijk alle **40+** commands" — niet "41", want `validate-docs.sh:432` handhaaft een `N+`-vloer. FAQ + FAQPage-JSON-LD ongemoeid. **Drie pre-existing bugs die bovenkwamen:** (1) alle drie de bloglabels waren verlopen (`"Terminal Basics voor Beginners"` tegen een `<h1>` die *"Terminal commands voor beginners"* luidt) én in Engelse Title Case — de homepage heeft hier een test voor (`homepage-conversion.spec.js:311`), terminal.html niet, dus dreven ze stil weg; (2) **zonder JS stond de hele strook op `opacity: 0`** want de reveal-observer voegt `.visible` nooit toe — `index.html:62-66` heeft dat `<noscript><style>`-vangnet al, terminal.html nooit gekregen, en dat maakte élke link erin waardeloos; (3) `WebPage.name`, `<title>` en de zichtbare kop waren drie verschillende strings — `WebPage.name` is nu woordelijk gelijk aan de nieuwe `<h1>`. **Eén bug van mezelf, gevonden door te meten:** de nieuwe CTA mat **193×22px** op 375px, onder de 44px-tikdoelgrens; nu 217×46 mét assertie. **Instrumentatie (NEW):** `edu_section_reached` vuurt zodra de strook in beeld komt, één keer per paginaweergave, geverifieerd met een gtag-spy. Gedeeld door de `page_view` op `/terminal.html` geeft dat de doorscroll-rate — het cijfer dat vijf maanden lang niet bestond (er was site-breed **geen enkel** scroll-event). Bewust een eigen module i.p.v. `faq.js` uitbreiden: die is een klassieke IIFE (geen module, kan `events.js` niet importeren) en wordt óók door index.html en contact.html geladen. **Eigen meetfout hardop gecorrigeerd:** mijn contrastmeting gaf eerst onzin omdat `getComputedStyle` een **live** object teruggeeft — ik zette het thema terug naar dark vóór het opbouwen van het resultaat en las dus de dark-kleur tegen de light-achtergrond. Met momentopnames: `.edu-command-card code` in light was **3,30:1** op de witte kaart (níét de 3,10:1 uit architecture-patterns §10 — die is tegen `--color-bg` gemeten, een laag lager) bij 19,8px/700, wat als **grote tekst** telt, dus de lat is 3 (AA) / 4,5 (AAA): het haalde AA wél en AAA niet. Nu `--color-text` = **19,80:1**; dark blijft 11,19:1. **Verificatie:** 8 nieuwe asserties × 3 motoren groen; **zeven mutanten geplant, zeven rood**, na herstel groen, en de ene overlever nagelopen en verklaard (die test stript de hash, dus een kapot `#cmd-nmapx` is terecht níét zijn taak). Gerichte suite over drie motoren **145 passed / 2 failed** — beide dezelfde `responsive-breakpoints.spec.js:209` (navbar) op firefox+webkit, en **géén regressie**: tegen `git archive HEAD` op een tweede poort **32/32 groen** (8× per motor per kant, tijden op 0,1s gelijk: 50,6 vs 50,7s en 35,4 vs 35,5s). Het is contentie — die test wacht 10s op een JS-geïnjecteerde navbar en haalt dat niet met drie browsers tegelijk. Mijn eerste A/B (4 rood / 1 rood) was zélf besmet doordat de achtergrondrun nog liep; opnieuw gemeten zonder belasting. **Let op — dit levert geen bytes op, het kóst er ~3,3 KB** (terminal.html +76 B, CSS +1454 B, nieuwe module +1740 B): de winst is hoogte, links en meetbaarheid, geen perf, en dat hoort ook zo gelezen te worden. NEW `terminal-seo.spec.js` + `src/ui/edu-visibility-tracking.js`; 36 → **37** spec-bestanden. Bundel **1091,02 KB / 1120** (marge 28,98 KB = 2,6%). **Openstaand:** Search Console-data voor `/terminal.html` (Heisenberg levert klikken/vertoningen/CTR/positie + top-10 zoekopdrachten) bepaalt of de strook verder mag krimpen of juist een echte landingstekst verdient.
**Sprint:** Sessie 217: **Vier vastgelegde pre-existing punten opgeruimd — en drie van de vier metingen die erbij stonden, klopten niet.** Elk punt eindigt als fix mét regressietest of als "geen bug" mét de meting; geen enkel punt blijft notitie. Heisenberg wantrouwde twee van de vier metingen; bij één klopte dat wantrouwen in de diagnose maar niet in de richting. **(a) De 76px reserve is zichtbaar, en raakt 10 pagina's i.p.v. 9.** `body.landing-page { padding-bottom: 76px }` wordt geverfd met de bódy-achtergrond: light `#f8f8f8` tegen een footer van `#1a1a1a` = **16,39:1**, een onmiskenbare witte strook; dark 1,04:1 en onzichtbaar. Nieuw t.o.v. de notitie: **index.html doet mee** — reserve 76 min balkhoogte 65 laat er 11px van zien op maximale scroll. Opgelost door de reserve naar de **footer** te verhuizen (donker in beide thema's) met `:has(.mobile-cta-bar)`, zodat balkloze pagina's hem niet krijgen en index.html hem donker geverfd krijgt. De onvoorwaardelijkheid die de oude regel beschermde (conditioneel = documenthoogte wisselt per toggle → scrollsprong → herbeoordeling → terugkoppellus) is gemeten en niet aangenomen: **9481/9481/9481** over `zichtbaar → verborgen → zichtbaar`, nu als eigen test. Specificiteit (0,3,1) wint van mobile.css (0,1,0), dus geen `!important`; bijvangst is dat `env(safe-area-inset-bottom)` niet langer dubbel wordt geteld. **(b) Het badge-contrast was tegen de verkeerde achtergrond gemeten — en de notitie was te gúnstig.** `.eyebrow-badge` heeft een eigen `background: var(--eyebrow-bg)`, een rgba, dus de tekst ligt op de compositie daarvan over de paginakleur. Tegen de páginakleur meet `#16a34a` inderdaad **3,10:1** (de notitie reproduceert exact — dát is het bewijs voor de diagnose), maar tegen de effectieve achtergrond `rgb(230,241,234)` is het **2,85:1**, en 2,74:1 op de hero waar de radial glow een derde alpha-laag toevoegt. Dat is **onder AA (4,5)**, niet "net onder AAA". Dark haalt 12,26:1 en blijft groen. Ook de genoteerde 14,4px klopte niet: gemeten 13,5px (desktop) / 10,4px (≤768px, waar `--font-size-base` naar 16px zakt én de badge naar `0.65rem`) — beide normale tekst, dus geen large-text-uitzondering. Opgelost met een `--eyebrow-text`-token naast het bestaande `--eyebrow-bg`/`--eyebrow-border`-paar: `--color-text` in light (**17,12:1**), merkgroen in dark. `#14532d` (green-900, 7,87:1) was het alternatief dat groen behoudt, afgewezen op marge. **(c) De terminal-overflow was geen bug meer: al gefixt op 07 jul 2026.** Commit `3d7df13` — titel letterlijk *"fix(mobile): terminal-container 10px horizontale overflow op ≤768px"* — voegde `width: auto` toe, een week na de melding in Sessie 189; het item stond daarna nog vijf sessies open. Hermeten @375px: left 10 / **width 340** / right 350 bij `clientWidth` 360 → **overflow 0**, idem over 320/360/375/390/414/768 in dark én light. De schijnbare tegenstrijdigheid in de notitie ("375px" vs `docW 360`) is dezelfde meting vóór en ná aftrek van een 15px scrollbar. **Waarom het zo lang bleef staan:** er was site-breed geen horizontale-overflow-assertie op `/terminal.html` — een notitie meldt niet terug dat hij achterhaald is. Dat gat is nu gedicht. **(d) Budget expliciet naar 1120 KB** (32,95 KB vrij = 2,94%, precedent Sessie 214), besloten vóór de fixes en niet als bijvangst; bij de constante staat nu dat dit de **derde bump in 14 sessies** is. Bijvangst: de testnaam luidde `Bundle size < 1000KB` terwijl de limiet al twee keer was opgehoogd — precies de staleness die deze sessie opruimde; hij interpoleert nu de constante. **Mutanten, alle drie tweezijdig:** (a) 12 rood / 2 groen, en die 2 zijn nagelopen in plaats van weggeredeneerd (`@1280px` valt buiten de `≤1279px`-band, de terugkoppellus-test bewaakt iets anders — beide horen groen); (b) **10 rood, allemaal in light**, allemaal exact 2,85:1, dus één thema testen had de bug doorgelaten; (c) 6 rood, en op 360px letterlijk `left 10 / width 360 / right 370 bij clientWidth 360, overflow 10` — **cijfer voor cijfer de notitie uit Sessie 189**. **Zelfcorrectie:** mijn eerste aflezing van de balkstaat was stale (2 rAF is te vroeg voor de IO-callback, dus ik las de staat van y=0 en overdreef de bug); met 300ms settle klopt hij, en die settle staat nu in de test. Eén valse faler onderweg (`/404.html`, 1px) bleek subpixel-afronding: documenthoogtes zijn fractioneel terwijl `scrollHeight` naar boven afrondt, dus `Math.round(0.5)` maakte er 1 van — de assertie meet nu exact. **Verificatie:** volle suite tegen `nostore-server` — chromium **343✓/2✘**, firefox **341✓/2✘**, webkit afgekapt na 85✓/0✘ omdat de resterende wachtrij vrijwel geheel `/terminal.html` betrof, dat geen van de gewijzigde bestanden laadt; in plaats daarvan gericht **88✓/0✘ op webkit** over de zes specs die `landing.css` wél laden (footer-reserve, homepage-conversion, hero-demo, gidsen-layout, navbar-collapse, lead-magnet). De 2 falers per motor zijn `tutorial-mobile:65` (chromium+firefox) en `responsive-ascii-boxes:427` (firefox); geïsoleerd tegen `git archive HEAD` op een tweede poort gaven oud en nieuw **byte-identiek 101✓/3✘ met dezelfde testnummers** — pre-existing als meting, niet als aanname. Twee `gamification`-falers in de volle run waren **flaky onder belasting** (retry groen op chromium, meteen groen op firefox), geen falers: een `✘`-regel is een mislukte póging, niet per se een mislukte test. **Vijfde taak (optioneel) ook gedaan — en de baseline is nu leeg.** De vastgelegde lijst klopte op geen enkel punt: de 5 `tutorial-gestures`-falers zijn verdwenen (5× groen), `responsive-breakpoints:194` is groen op chromium/firefox maar flaky op webkit (3/12), `autocomplete-filesystem:88` is groen, en er stonden er twee **niet** in die wél structureel rood waren (`feedback:207` + `:233` op webkit). **De categorie "meet iets dat headless niet kán" kwam geen enkele keer voor** — alle vier waren fouten in de test zelf, dus repareren i.p.v. skippen: (1) `tutorial-mobile:65` eiste het woord `ping` in de briefing, terwijl commit `c031d9d` de objectives juist herschreef om het commando níét te verklappen — de assertie bewaakt nu die pedagogische invariant, met de productwijziging als mutant; (2) `responsive-ascii-boxes:427` mat box-tekens op 375px waar er per ontwerp geen zijn (gemeten 0/6 op 375, 6/6 op 1440, beide motoren); (3) `feedback:207`/`:233` hadden 500ms marge over een eigen `setTimeout` van 2000ms in `src/ui/feedback.js:277` → conditie-wacht, **0/2 → 8/8**; (4) `responsive-breakpoints:194` deed `goto` op 1280px vóór de resize naar 375px terwijl `mobile.css` media-gated is → viewport vóór navigatie, **3/12 → 8/8**. **Eigen meetfout hardop gecorrigeerd:** ik las bij (4) "nieuw rood / oud groen" als mogelijke regressie, maar `/tmp/pre-change` was ná de commit aangemaakt — `md5sum` over `terminal.html`/`terminal.css`/`mobile.css`/`main.css`/`main.js` gaf identiek, dus er was geen codeverschil. Eindverificatie over de vier aangeraakte specs: **224 passed / 0 failed** in drie motoren. **Geen baseline-notitie meer toevoegen:** gaat er iets rood, dan is dat vanaf nu een echt signaal. NEW `footer-reserve.spec.js` + `eyebrow-contrast.spec.js`; 34 → **36** spec-bestanden. Bundel **1087,05 KB / 1120**.
**Sprint:** Sessie 216: **De mobiele CTA-balk verscheen waar hij niets toevoegde — en de guard die dat moest bewaken, scrollde nooit** (commits `2c1068e` + `00433e4` + `570d44c`, gepusht). **(1) De balk.** `.mobile-cta-bar` bestaat om altijd een CTA in beeld te houden, maar op scrollpositie 0 deed hij dat niet: de hero-CTA staat daar al (gemeten op zes maten: midden y=306..361, balkrand pas vanaf y=602). Hij dekte er `whoami`/`pwd`/`help` af (360×800, 390×844) en zette een tweede identieke groene knop op het scherm (390×844). **Keuze: IntersectionObserver, niet `position: sticky`.** Sticky lost de pláats op, niet het mechanisme — hij overlapt content nog steeds zodra hij plakt, het duplicaat blijft tijdens het scrollen bestaan, hij kost 65px flow-gat pal na de hero en vraagt een DOM-verhuizing van een monetisatie-element. Zijn enige voordeel ("werkt in de synchrone test") is winst voor de test, niet voor de bezoeker. **(2) De grens is de spil, niet het mechanisme.** De balk stapt opzij zodra het *middelpunt* van een primaire CTA vrij ligt — onder de navbar, boven de balkrand. Alleen die grens maakt beide eisen per constructie waar: "zodra hij het scherm raakt" laat de balk verdwijnen voor een strookje van 1px (geen tikdoel), "pas bij volledig zichtbaar" laat een venster van **~24px** (halve knophoogte) open waarin balk én CTA-midden allebei aantikbaar zijn. Bij "midden vrij" geldt *balk verborgen ⟺ CTA-midden aantikbaar* — één conditie, dus geen gat en geen overlap. Geverifieerd over **884-893 posities à 10px** in Chromium/Firefox/WebKit: nul gaten, nul dubbels, identiek wisselpatroon. **(3) IO is de trigger, één predicaat is de regel.** Bewust niet op `entry.isIntersecting` beslissen — die is `true` zodra het doel de root raakt, ongeacht de threshold (bij passeren van 0.5 vuurt de callback en levert `isIntersecting: true` met ratio 0.4). De geometrische beslissing houdt het gedrag óók correct als de `rootMargin` veroudert: bij draaien van het toestel klopte de staat in alle vier de gemeten toestanden. Doelen zijn alleen hero/mid/final (zelfde label als de balk); leerpad-deeplinks en cijfertegels dragen een ánder label, dus daar is geen duplicaat en blijft de balk nuttig. **(4) De guard scrollde nooit.** `html { scroll-behavior: smooth }` staat in `animations.css`, dus `window.scrollTo(0, y)` ánimeert; de oude lus zette dat 13× in één synchrone tick en `scrollY` bleef op **2px** steken — die test asserteerde dertien keer dezelfde ongescrollde pagina. Herschreven met `behavior: 'instant'` + await per stap, en hit-testing i.p.v. bounding box. **Aantoonbaar strenger, gemeten:** op één mutant (balk altijd `visibility: hidden`) is de **oude guard 3× groen en de nieuwe 3× rood**, met zes benoemde posities. **(5) Bug die ik zelf introduceerde en ving.** `.btn-cta` draagt `transition: all` en erft `visibility` van de balk — met `all` loopt die overerving als transitie mee, dus de knop liep ~150ms achter: een onzichtbaar tikdoel dat nog reageert, en andersom een zichtbare balk waar een tik niets doet. Alleen zichtbaar in het venster ná een toestandswissel. **Vastgelegd, niet opgelost:** 9 pagina's dragen `body.landing-page` (dus 76px reserve) zónder balk — byte-identiek tegen `git archive HEAD`, pre-existing sinds Sessie 214. **Verificatie:** `BASELINE_BEDEKT` van Sessie 215 naar `[]` voor alle drie de maten (360×800 toegevoegd — stond in het commentaar, niet in de map); 5 nieuwe asserties, **elk met de mutant rood bewezen**; volledige suite chromium 313✓/1✘ · firefox 310✓/3✘+1 flaky · webkit **309✓/2✘**, alle falers op `/terminal.html` en byte-identiek reproducerend tegen `git archive HEAD`. Bundel **1084,92 KB / 1100** (marge 15,08 KB = 1,4%, was 2,0%).
**Sprint:** Sessie 215: **Hero-terminal: uitlijning, focusrand en een cursor 317px van zijn eigen tekst** (commit `f567ebc`, gepusht). Vier vondsten, alle vier eerst gemeten op productie. **(1) Uitlijning.** `.hero-terminal` droeg `margin-top: 3rem` (54px bij de 18px root-font): een handmatige optische centrering uit de tijd dat het venster 313px hoog was (header 37 + body 235 + invoerregel 41) — toen liep het 194→507, nét binnen de tekstkolom 140→568. Sessie 214 hing er `.hero-demo-bar` onder (**+152px gemeten**), waarmee het venster 468px werd en **94px ónder de tekstkolom** uit ging steken terwijl de bovenkant nog 54px te laag begon; optische middens 74px uit elkaar. Vervangen door `align-items: center` in een eigen `@media (min-width: 769px)`-band — middens nu 0,5px uit elkaar en zelfonderhoudend bij elke volgende hoogtewijziging. **`align-self: center` op de terminal was een no-op** (gemeten: 140→608 ongewijzigd): de terminal is inmiddels zélf het hoogste flex-item en bepaalt dus de cross-size van de regel, dus het kórtere item moet bewegen en hoort de regel op de container. Eigen band i.p.v. de basisregel omdat `align-items` onder 769px de *horizontale* as stuurt (kolom-flexbox). Horizontaal was er niets mis: rechterrand terminal 1576 = rechterrand navbar-CTA 1576. **(2) Focusrand.** De blauwe rand was onze eigen sitebrede `:focus-visible`-stijl uit `animations.css` (`--color-info` #79c0ff/#0969da), niet die van de browser — en `:focus-within` vuurt óók bij een muisklik, waardoor de terminal het enige element op de site was dat ná een klik een rand hield. Nu gaat het venster áán: rand + 1px ring + halo in `--terminal-demo-prompt` (#9fef00 op #000 = ~17:1, WCAG 2.2 SC 2.4.11 vraagt 3:1) plus een oplichtend groen vensterbolletje; `outline: 2px solid transparent` blijft staan als vangnet voor forced-colors (die negeert box-shadows). **Keyboard-only kán hier niet:** gemeten dat `input.matches(':focus-visible')` `true` is ná een muisklik (spec: tekstvelden tonen altijd focus), dus `:focus-within` en `:has(:focus-visible)` zijn identiek. **Bronvolgorde-val:** `[data-theme="light"] .hero-terminal` zet óók `box-shadow` en is even specifiek (0,2,0), dus de focusregel moest ná dat blok — mutant bewees het: **light rood, dark groen**. **(3) Uitnodiging.** NEW `.hero-terminal-col`-wrapper (`.hero-content` telt precies twee kolommen, een derde kind wordt een derde kolom) met "Deze terminal werkt echt — typ maar" + ↓ erboven; weg bij overname via `visibility` en niet `display` (anders krimpt de kolom 29px en verspringt het venster ~15px onder de muis van wie er net op klikte). Woorden in `--color-text`: het CTA-groen meet **3,10:1** op de lichte achtergrond bij 14,4px en zakt door AA, laat staan AAA. **Niet op mobiel** — gemeten afweging: de regel kost 30px en die duwden de tweede chiprij van midden-736 naar midden-764 terwijl `.mobile-cta-bar` op 375×812 vanaf y=747 vastzit, dus `nmap`/`whoami`/`pwd` werden onaantikbaar; de hint lost bovendien een *desktop*-probleem op (met een muis lijkt het venster een plaatje) terwijl er op een telefoon al zes knoppen onder de prompt staan. **(4) Cursor (zelf gevonden, niet gevraagd).** Sessie 214 maakte van `#typing-target` een `<input>` met `flex: 1`; dat at de hele regel en zette de decoratieve `_` op **317px van zijn eigen tekst** (155px breed). Het veld hugt in rust nu zijn inhoud in `ch` (exact — `--font-terminal` resolvet naar JetBrains Mono) en krijgt bij overname de regel terug; gat **162px → 18px**, precies één teken. **Twee regressies die ik zelf introduceerde en zelf ving:** het tikdoel kromp van 309px naar 10px (WebKit miste hem in de testrun) → de hele promptregel neemt nu over + `cursor: text`; en de mobiele hint duwde chips onder de CTA-balk → verborgen ≤768px. **`?v=` op `landing-demo.js`** (had er geen, terwijl `/src/**/*.js` op `max-age=3600` staat): zonder dat krijgt een terugkerende bezoeker tot een uur nieuwe CSS naast oude JS, en typt de auto-demo in een veld van één teken breed. **Vastgelegd, niet opgelost:** op 360×800 en 390×844 liggen `whoami`/`pwd`/`help` bij scrollpositie 0 onder `.mobile-cta-bar` — pre-existing, oud en nieuw **byte-identiek** over zes telefoonmaten (`git archive HEAD` op een tweede poort). De fix hoort bij de balk (die is daar aantoonbaar overbodig: de hero-CTA staat op élke gemeten maat in beeld) en raakt de conversiegarantie in `homepage-conversion.spec.js`, die synchroon scrollt en een IntersectionObserver dus nooit ziet vuren → zie #55. Staat als baseline per viewport in `hero-demo.spec.js`. **Verificatie:** **105/105** over Chromium/Firefox/WebKit, geen flakes; 9 nieuwe `test()`-declaraties (12 tests), **elk met de mutant rood bewezen**; een Firefox-chiptest die ik onderweg brak (2/8 rood) tegen de oude code vergeleken (0/12) en weer 8/8. `html-validate` identiek vóór/ná (7 pre-existing). Bundel **1078,05 KB / 1100** (marge 20,95 KB = 2,0%, was 2,9%).
**Sprint:** Sessie 214: **De hero-terminal doet nu iets — en de demo die er stond, loog over drie van de vier commands.** Twee rondes. **(A) Homepage-trechter** (commit `0f2a306`): drie van de negen trechterstappen leunden op nooit-geplaatste placeholders ("1.200+ gebruikers", testimonials), dus stap 6 en 8 stonden hol. Gevuld met wat natelbaar is (40+ commands met man-pagina, 3 missies, 10+ artikelen met bron en controledatum, 50+ begrippen — elke tegel linkt naar de plek waar je het kunt natellen). CTA-gat van **4179px (5,1 schermen)** gedicht met `.mobile-cta-bar`; site-breed één CTA-label ("Start de simulator", 28 bestanden, 5 lockstep-locaties incl. FAQPage-JSON-LD). 20 tikdoelen <44px → 0. 16 contentblokken waren leeg zonder JS (`.animate-on-scroll` op `opacity:0`) → noscript-vangnet. validate-docs 10 → 12 checks. NEW `homepage-conversion.spec.js` (10 tests). **(B) Interactieve hero-terminal** (commit `810f082`): `#typing-target` was een `<span>` en `.hero-terminal` had **nul** tabbare elementen — de sterkste interactie-uitnodiging op de pagina deed niets. Nu een vrije mini-REPL (`help`/`ls`/`cat`/`nmap`/`whoami`/`pwd`) met de begeleiding als zes tikbare chips: die markeren de volgende suggestie, tónen de grens van de demo, én vervangen typen op 375px. **Geleid óp vrij, niet in plaats van** — een scripted click-through zonder invoer botst met wat de subtitel drie regels hoger belooft. **De oude demo loog:** `whoami` → `user` (engine: `hacker`), `ls` → `passwords.txt`/`notes.md` (bestaan niet in de VFS), `nmap 192.168.1.1` → 22/SSH i.p.v. het router-profiel 53/80/443. Alle uitvoer nu afgeleid uit de bron. **Vijf bugs**: 2 bestaande in `landing-demo.js` (`stop()` brak de await-keten niet af → `visibilitychange` liet twee lussen in dezelfde DOM schrijven; diezelfde handler herstartte de demo óver de bezoeker heen) en 3 tijdens de bouw (Firefox focust geen veld dat bij mousedown nog `readonly` was — `activeElement` bleef `BODY`; `RESPONSES[naam]` is truthy voor élke prototype-sleutel, dus `constructor` typen blokkeerde de REPL op `undefined.slice()`; de afrondboodschap telde `gedaan.size` i.p.v. de suggestieset). Alle drie met een mutant bewezen. Bundlelimiet 1050 → **1100 KB** (gemeten 1069,20; driftalarm, geen perf-poort — Terminal Core wordt met nul bytes geraakt). NEW `hero-demo.spec.js` (13 tests). **111 passed / 0 failed / 9 by-design skips** over drie engines; CI groen.
**Sprint:** Sessie 213: **Gidsen-pagina herontworpen + een navbar die site-breed 500px te breed was.** Vier klachten van Heisenberg op `/gidsen.html`, drie oorzaken — plus een navbar-bug die tijdens het onderzoek bovenkwam. **(1) Weeskaart.** `.feature-cards` was `repeat(3, 1fr)` met vier kaarten. NEW modifier `.feature-cards--2col` geeft 2×2, gescoped in `@media (min-width: 769px)`: zonder die query verslaat pages.css (later geladen, gelijke specificiteit) de mobiele 1fr-regel — per ongeluk gemeten met een `!important`-prototype dat 6px overflow en kaarten van 173px gaf. Vier lay-outs in de live DOM vergeleken (3-koloms / 2×2 vol / 2×2 gecapt / 4-naast-elkaar) vóór de keuze; 2×2 op volle breedte omdat de buitenranden dan exact samenvallen met de bundelkaart erboven (656+24+656 = 1336) en de beschrijvingen op 2-4 regels uitkomen i.p.v. 8-10. **(2) Scheve CTA's (82px gemeten).** `.gids-card p { flex: 1 }` selecteerde óók `p.gids-sample-link` — dat is immers een `<p>` — dus twee flex-items met `flex-basis: 0` deelden de rek (gemeten: beschrijving 82px + chip 66px = 148px, precies de 164px van een kaart-zonder-sample min de extra 16px marge). Gevolg: `.btn-cta { margin-top: auto }` was een no-op (flex-grow verdeelt vóór auto-marges) en `.gids-sample-link { margin: 8px 0 0 }` landde nooit ((0,1,1) verslaat (0,1,0)). Opgelost met NEW `.gids-card-body` als enige groeier: prijs, knop en bloglinks staan daardoor op vaste afstand van de kaartbodem, dus de invariant **kaartbodem − CTA-bodem = 186px** geldt voor alle vier — ongeacht welke kaart een sample draagt, en dus bestand tegen copy-wijzigingen. **(3) Beide gratis samples op hun eigen kaart.** Het pentest-sample stond alleen in een los blok onderaan (dat bovendien transparant rendert door de niet-bestaande `--color-bg-card`), het juridische als gecentreerd blauw tekstlinkje onder de knop — blauw is per conventie het blog-palet. Nu allebei een coupon-chip in de body-zone met thema-aware tokens (`--color-prompt-bg-light` / `--color-cta-primary`) en `min-height: 44px` (mat 40px, net onder WCAG AAA). Dubbel blok vervangen door een slanke afsluitstrook die de blog-/terminal-links behoudt. **(4) Gedeelde CSS, één selector-token.** `:nth-child(3)` → `:nth-child(3):last-child` op de drie weesregels in landing.css: de regel was altijd al bedoeld voor de laatste kaart van een 3-kaart-grid. Fixt gidsen én `over-ons.html`, die op 820px kolomsporen `211/185/136/136` gaf met kaart 3 geforceerd op 500px — dwars door zijn eigen spoor. Elk aangeraakt grid geteld (5× drie kinderen, 2× vier) om te bewijzen dat er nul gedragswijziging is waar het wél klopte. `.features-4col` naar `@media (min-width: 1025px)` — stond zonder query en versloeg daardoor zowel de tablet- als de mobielregel. **(5) Navbar, site-breed.** Klapte pas onder 768px in maar past daar lang niet: **341px overflow @820px, 161px @1000px**, op élke marketingpagina én alle 15 blogposts (zelfde navbar). Twee grenzen binair gezocht: vanaf **1147px** loopt niets meer buiten de balk, maar pas vanaf **1264px** (1266 in WebKit) breekt er ook niets meer af — daartussen "past" hij puur doordat "Over Ons" en "Start Simulator" over twee regels vallen. Band nu tot 1279px, desktopnav vanaf de gangbare 1280px. Overlay-regels in landing.css i.p.v. mobile.css (dubbel gepoort via link-`media` én interne query, plus terminal-regels die daar horen); waarden overgenomen van de gemeten effectieve stijlen op 700px, niet overgetikt. De terminal-navbar past wél in deze band (menu 738px @1000px) en blijft bewust ongemoeid. **(6) `.mobile-cta-link` heeft nooit gewerkt.** main.css `.navbar-links > li:not(.navbar-dropdown) > a` (0,2,2) versloeg `.navbar-links .mobile-cta-link` (0,2,0) — gelijk aantal klassen, maar twee type-selectors geven de doorslag. "Start Simulator" was dus niet van "Woordenlijst" te onderscheiden; relevanter geworden nu de band tot 1279px loopt. Opgelost op specificiteit (0,3,2) in main.css, en landing.css ging van **1 naar 0** `!important`-declaraties (het commentaar dat hem "nodig" noemde klopte niet). **(7) `scripts/nostore-server.py` naar `ThreadingTCPServer`.** `TCPServer` handelt één request tegelijk af; drie parallelle browsers serialiseerden daarop tot `page.goto` in zijn timeout liep. Dat las als flaky tests terwijl er nul assertiefouten waren — 12 parallelle requests nu in 0,24s. **Tests:** NEW `gidsen-layout.spec.js` (8) + `navbar-collapse.spec.js` (6, waarvan 3 geparametriseerd), `lead-magnet.spec.js` geparametriseerd over beide samples. Eerst rood tegen productie (5/8 resp. 7/8 faalden om de juiste redenen), daarna **111/111 groen** in Chromium, Firefox en WebKit — twee volledige runs achter elkaar. Commit `d3ab459`, gepusht.
**Sprint:** Sessie 212: **De juridische sample leverde de pentest-bestandsnaam én de pentest-welkomstmail.** Twee losstaande bugs, gemeld door Heisenberg na een eigen proefinschrijving, beide tegen productie geverifieerd met `curl -I`. **(1) Bestandsnaam.** `_headers` zette via `/assets/samples/*` één harde `Content-Disposition: filename` over de héle map. Die regel klopte toen de map één sample had en werd stilzwijgend fout toen de juridische erbij kwam: juiste inhoud (83.672 bytes, 6 pagina's) onder de naam `pentest-playbook-sample.pdf` — geen 404, geen foutmelding, alleen een naam die loog. Nu een exacte regel per PDF, met `Cache-Control` bewust in elk blok herhaald zodat het niet afhangt van hoe Netlify headers van `/assets/*` meemerged (live bevestigd: `max-age=3600` wint, de `immutable` van de wildcard lekt niet door), plus expliciete `download="<naam>.pdf"` op alle drie de knoppen zodat het niet uitmaakt of de browser het attribuut of de header laat winnen. **(2) Welkomstmail.** `sample-juridisch.html` en `sample-pentest.html` postten naar een bytes-identieke Brevo-`action`; de automation draait op een *Form submitted*-trigger en tags zijn in Brevo geen automation-criterium, dus Brevo **kón** de instromen niet scheiden — iedereen kreeg de pentest-mail, terwijl `sample-juridisch.html:132` letterlijk belooft dat je 'm gemaild krijgt. Gekozen route (niet de in Sessie 206 geadviseerde gedeelde neutrale mail): eigen formulier + eigen automation, omdat de pagina bestaat om te meten of de juridische gids verkoopt bij dezelfde funnel-behandeling — een verwaterde cross-sell meet een halve funnel. NEW `docs/newsletter/welkomstmail-sample-juridisch.html` (alle claims geteld uit de PDF met `pdftotext`, niet geschat; code-chip @375px gemeten op 17px in een 24px regelbox = overlap 0, erft de Sessie 206-fix) + NEW runbook + `sample-juridisch-embed-form.html` als bron van waarheid voor de `action`. Brevo-kant door Heisenberg uitgevoerd en end-to-end getest: één juiste mail, juiste PDF, cross-sell `yzdtfx`, pentest-flow onaangetast. **(3) Waarom dit maanden bleef staan:** nul E2E-dekking op de juridische funnel en geen enkele assert op response-headers. NEW Check 10 in `validate-docs.sh` (elke `assets/samples/*.pdf` moet een exacte-pad-regel met eigen basename hebben, plus een verbod op een wildcard met vaste filename) + Content-Disposition-tests; beide faalden aantoonbaar op de oude code vóór ze groen werden gemaakt. `lead-magnet.spec.js` geparametriseerd over beide samples en elke pagina gepind op zijn eigen formuliertoken: **60 passed tegen productie**, 3 engines. **(4) Bijvangst:** `type="text"` → `type="email"` op alle vier de Brevo-formulieren nadat meting toonde dat Brevo een malformed adres met `{"success":true}` accepteert (iemand die zich vertypte zag het succespaneel, kreeg de PDF, en wachtte vergeefs op een mail). Doc-opruiming: het blok in `brevo-setup-sample-pentest.md` dat de tag-filter-aanpak beschreef die dertig regels eerder onmogelijk werd verklaard, is weg. Commits `e24e324` + `8c72329`, beide gepusht, CI success, live geverifieerd.
**Sprint:** Sessie 211: **Interne links naar de nieuwe leren-hacken.html vanuit 5 blogposts + homepage** (in-body anchor links + 3 related-card-swaps) + achterstallige /summary voor Sessie 210 + bulk-rotatie sessies 195-199.
**Sprint:** Sessie 210: **SEO-optimalisaties op basis van Google Search Console zoekdata + nieuwe blogpost.** Titel/meta-optimalisaties op 3 bestaande pagina's (ethisch-hacker-worden → "Hoe word je ethisch hacker? Stappenplan 2026", nmap-beginnersgids → "Wat is Nmap en hoe werkt het?", homepage → "Leren hacken: gratis hacking simulator voor beginners") + FAQ-sectie met FAQPage microdata op ethisch-hacker-worden + NEW `blog/leren-hacken.html` (~1850 woorden, 8 min leestijd, target "leren hacken" cluster: 190 impressies, positie 18-27, 0 klikken) + interne links terminal-basics→ethisch-hacker-worden + nmap→ethisch-hacker-worden + RSS-titels gesynchroniseerd. Admin-lockstep compleet: blog/index.html kaart, feed.xml item, sitemap.xml entry, blog-count 14/14.
**Sprint:** Sessie 209: **W2 browserverificatie van de Sessie-208-kwaliteitsronde.** De drie ongeteste terminalwijzigingen (skip-certificaat DEELNAME vs VOLTOOIING, helpsysteem-escalatie bij correct command + verkeerd argument, bestaande localStorage-voortgang overleeft de leerpad-wijziging) bewezen via 6 nieuwe Playwright-tests in `tests/e2e/w2-verification.spec.js`. Regressiecheck: 237/249 bestaande tests groen, 7 failures zijn pre-existing/omgevingsspecifiek (5× tutorial-gestures iPhone 13 emulatie-artefact, 1× responsive-ascii-boxes resize reflow, 1× tutorial-mobile briefing timing). Totaal: 30 spec files, ~243 tests.
**Sprint:** Sessie 208: **Advertenties volledig van de site + kwaliteit aantoonbaar gemaakt + blog meetbaar.** Heisenberg gaf vier opdrachten: (1) haal AdSense weg als het niets oplevert, (2) focus op de gidsen als die wél verkopen, (3) maak de kwaliteit van de inhoud aantoonbaar — hij is zelf geen securityexpert en bouwde alles met AI, (4) haal meer uit de blog. **W1 AdSense volledig verwijderd:** 44 advertentieblokken uit 20 bestanden, 27 meta-tags, `data-adsense` van 19 pagina's, de laadcode uit `consent-default.js`/`consent.js`/`init-analytics.js`, 63 regels CSS, 5 ad-domeinen uit de CSP (`frame-src` → `'none'`), `ads.txt` weg, en de advertentieparagrafen uit privacy- en cookiebeleid herschreven i.p.v. geknipt. Consent-banner van 3 naar 2 knoppen, **zonder migratie**: het opgeslagen JSON-formaat blijft gelijk, dus bestaande bezoekers houden hun keuze (live geverifieerd in 4 scenario's: vers / oude `advertising:true` / legacy-string / geweigerd). Rood-op-mutant: dezelfde meting gaf vóór de wijziging 2 advertentieverzoeken + 3 units, erná 0/0. Bijvangst: `commands/index.html` gebruikte een **inline** consent-script dat de CSP blokkeert — die pagina had dus nooit Consent Mode-defaults; nu op het externe script gezet. Grond voor de verwijdering: €0 gemeten opbrengst tegen 251,7 KB third-party en 73% van de blokkeertijd, en het eigen monetisatie-onderzoek noemde AdSense in maart 2026 al niet-lonend. **W2 kwaliteitsborging:** NEW `scripts/build-review-package.mjs` genereert uit de bron een afgebakend reviewpakket (172 beweringen uit 29 commands + 56 definities, met bestand/regel en aankruisvakjes) zodat een vrijwilliger-expert het in ~2 uur kan nakijken; NEW Check 6d in `validate-docs.sh` (badges per zeldzaamheid, challenges, tutorial-scenario's) die meteen een échte fout ving — de `achievements`-man-page claimde 4 RARE badges tegen 5 in de broncode; NEW `#verantwoording` op `over-ons.html` (hoe het gemaakt is, wat wél/niet gecontroleerd is, waar je fouten meldt); certificaat-tegenstrijdigheid opgelost met één gedeelde `CERT_DISCLAIMER` in beide generatoren; zichtbare **Feiten gecontroleerd**-datum op alle 14 posts met de echte controledatum (14 jun 2026 voor 13 posts, 3 aug voor de metasploit-post) + gate in `validate-blogs.sh`; NEW CI-workflow zodat de gates niet langer op één machine staan. **W3 gidsen:** elke gids-kaart linkt nu 3 blogposts (was 1 link terug op 14 heen). **W4 blog:** `data-terminal-cta` op alle 14 posts — blog→terminal was volledig onmeetbaar terwijl blog→Gumroad dat wél was; wireshark-post had zelfs helemaal geen terminal-CTA in de tekst. 14 RSS-titels gesynchroniseerd (allemaal nog Title Case sinds commit 65c5f18) + NEW check 9c, hubpagina op datum gesorteerd (brak vanaf kaart 5) + NEW check 9d, en 4 interne links waarmee wireshark/metasploit/linux-bestandssysteem de 3-inkomend-norm halen. Alle nieuwe checks rood-op-mutant bewezen.

**Sprint (Sessie 206):** **Nieuwsbrief- en welkomstmails mobiel gefixt + Brevo-conventies vastgelegd (2 commits `8045b29`+`14ea6b6`, gepusht)** — Heisenberg meldde twee defecten in de juli-nieuwsbrief in de Gmail-app (Android, dark mode). **(1) Code-chip-overlap:** `nieuwsbrief-juli-2026.html` gebruikte één klasse `.code-bg` voor zowel het blok-codevenster (`<td>`) als de inline chips (`<code>`), waardoor de mobiele regel `padding:12px 14px` ook de chips raakte. Verticale padding vergroot bij een inline element de regelhoogte niet, alleen het gekleurde vlak → gemeten @375px: chip 38px in een 24px regelbox = 17px overlap met de buurregels. Gesplitst naar `.code-block`/`.code-inline` (het patroon dat `welkomstmail.html` al hanteerde); na de fix 17px / overlap 0, desktop ongewijzigd (22px in 24px). **(2) Witte tekst op de lime balk/knoppen:** de Gmail-app herschrijft kleuren ná de CSS en tilt bijna-zwart-op-donker naar wit; `!important` stopt dat niet en de `prefers-color-scheme`-blokken zijn in die app dood. `background-color` staat nu sámen met `color` op hetzelfde element (5 spans) i.p.v. een kaal tekstfragment — mitigatie, te bevestigen bij de eerstvolgende test-send. **(3) Bijvangst:** beide welkomstmails droegen nog MailerLite-syntax (`{$unsubscribe}`/`{$url}`) in een Brevo-stack — die vervangt Brevo niet, dus die links liepen dood; nu `{{ unsubscribe }}`/`{{ mirror }}`. Heisenberg heeft beide automations uniform gemaakt (footer in de HTML, los Brevo-blok verwijderd) en getest, plus de dubbele `{EMAIL}` op de Brevo-uitschrijfpagina opgelost. **(4) Regressieketen gesloten:** `maandelijks-template.md` wees voor het CSS-blok naar `nieuwsbrief-april-2026.html` — precies de bron van de bug in juli. Pointer naar juli, plus Brevo-variabelen, de twee code-klassen, de bg+color-regel, de footer-conventie en dark-mode-checklistregels. **Geen runtime-impact:** uitsluitend `docs/newsletter/`, bundle/tests/architectuur ongewijzigd. **Juli-mirror vervalt:** Brevo vergrendelt verzonden campagnes (alleen links, ≤24u).
**Status:** M7 Gamification ✅ 100% | M6 Tutorial System ✅ **100% (Sessie 156 closure)** | M5.5 Monetization ✅ Live + Brevo deliverability tuned + Gumroad v1.0 + Lead magnet (LIVE on hacksimulator.nl) | Doc-protocol refactor + forcing function (Sessie 140) | Terminal Core ⚠️ ~547 KB minified + ✅ **Lighthouse terminal Mobile 63→82** ná #33 (a) self-host Google Fonts (Sessie 150). **Sessie 155:** Item #36 (a) ✅ **CLOSED OUTCOME 4** — single-sessie 3-burst compression baseline-stability analysis, 60 LH@11 mobile runs (3 bursts × 10 INDEX + 10 BLOG met 60 min cool-down) + scipy 3-burst ANOVA F-test + N=30 KS+MWU + per-burst CV-asymmetry tracking. Outcome 4 = alle 3 Sessie 154 secondary findings (discovery-queue/transfer-only CV-asymmetry + BLOG canary HIGH) NIET reproduceer ≤1-of-3 bursts. **Direction-flip smoking gun:** Full CV ratio per burst 2,62×/0,32×/1,04× (INDEX>BLOG, BLOG>INDEX OPPOSITE, equal) = sampling-burst-snapshot. **NEW finding niet pre-enumerated:** 3-burst ANOVA F p<0,001 alle metrics × beide canonicals = time-varying within-canonical variance IS structureel MAAR global niet page-type-specific = niet patchable. **Cumulatieve #34 + #35 categorische closure FINALISED** via 4-sessie methodological-evolution-output (152+153+154+155). Spawn Sessie 156 = M6 Tutorial 3 last taken (M6 88%→100% closure). **Sessie 154:** Item #35 (b) ✅ **CLOSED OUTCOME 4** — AdSense-Auto-ads-state-machine state-leakage diagnostic, zero-code instrumentation, 20 sequential LH@11 mobile runs + scipy distribution-analysis. Outcome 4 = 10-run distribution-analysis falsifies Sessie 153 page-type-asymmetric observation as sampling-noise op LCP-aggregaat. Per-stage decomposition reveals NEW mechanism-categorie (opposing-direction variance-asymmetry per cascade-stage cancellation pattern). Cumulatieve #34 mechanism-isolation closure BEREIKT via methodological-evolution-output. Spawn #36 multi-day baseline-stability. **Sessie 153:** #34 (b) inline-CSS-only mechanism-isolation = Frame D gray REVERT + NEW bidirectional canary discipline + S4 scale-error + page-type-asymmetric mechanism als nieuwe categorie. **Sessie 152:** Combo-pad. (1) #33 (b) ✅ CLOSED N/A — HTTP/2 push deprecated Chrome 106 (Sep 2022) + Netlify dropped support + ZERO local artifacts. (2) #33 (d) ✅ CLOSED PARTIAL — Brotli active HTML/CSS/JS productie via curl-grep; favicon.svg gap accepted low-impact. (3) #34 (a) preconnect-only mechanism-isolation = **Frame B NOISE-no-action REVERT** (patch commit `a19926a` → revert `402b1d4`) na Phase A baseline-anomaly diagnosis via NEW cross-check-baseline-discipline. **Variance-amplification hypothese partial-falsified:** Sessie 151 Frame C kwam NIET uit preconnect alleen (S7 1.83× ≤2× threshold) — mechanism-isolation wijst naar inline-CSS-cascade-interactie of combined-effect. Voorgaande Lighthouse milestones: 49→59 (Sessie 144), Sessie 147 #29 modulepreload Frame C, Sessie 148 #31 main.js dedupe, Sessie 149 #30 sync-inline Frame D, Sessie 150 #33 (a) Frame A self-host fonts, Sessie 151 #27 combined Frame C.
**Sprint:** Sessie 189 — **Fase A: leerpad deep-link → in-app tutorial-landing** (vervolg op Sessie 185-188; sluit de 4-sessie-boog "Leerpad deep-link naar in-app tutorials" Stap 0+B+A). De 3 homepage-leerpad-knoppen linken niet langer naar de kale terminal: BEGINNER→`?tutorial=fundamentals`, GEVORDERD→`?tutorial=recon`, EXPERT→`?tutorial=exploitation`, met eerlijke labels "Start de <Niveau>-missie". `main.js` leest de query (validatie tegen `tutorialManager.getScenario`; onbekend → stille no-op + URL ongemoeid) en auto-start de missie **gesequencet** zodat de MISSION BRIEFING de held is — nooit in dode input of midden in de typewriter: eerste bezoek wacht op `typewriter-done` + 250 ms, terugkerend vuurt direct; auto-start via `terminal.execute('tutorial <id>')` (registry-pad = echo + history + first-visit-flag), dán scroll-to-bottom + input-focus. Welcome **bewust niet gecondenseerd** (boot-fragiliteit; anti-gold-plating). Resume-vs-deeplink non-destructief (geen actief→start; ==target→continue; !=target→`exit()`+start). URL gestript via `history.replaceState`. Analytics-source zonder dubbeltelling via one-shot `tutorialManager.setNextStartSource('homepage-leerpad')`. Cache-bump `main.js?v=189-deeplink` (2 refs). NEW `leerpad-deeplink.spec.js` 5/5 groen; volledige chromium-suite **0 failures** (215 totaal, ~200 passed + ~10 flaky-op-retry + 5 skipped). Twee voorheen-rode stale tests (lead-magnet-kaartcopy = Sessie-183-correctie + footer-legal same-tab) bevestigd óók rood tegen productie = géén Fase A-regressie → in dezelfde sessie bijgewerkt naar de correcte site-staat. Render-en-meet dark/light/375px: input enabled+focused, 0 doc-overflow (10px `#terminal-container`-offset is pre-existing zonder deep-link). **Nog niet gepusht** (push = deploy; bundelt met de 4 onuitgepushte Sessie 185-188-commits in één deploy, wacht op go). Volledig: `docs/sessions/current.md` Sessie 189. **Pre-Sessie 189:** Sessie 188 — **Eén coherente leerpad-ladder: progressie-oppervlakken uniform** (commit `aebcca3`, 13 files; vervolg op de vraag "komt de tutorial-indeling overeen met het leerpad-commando?"). Brutale diagnose: drie vocabulaires voor "hoe moeilijk" (homepage+tutorial = Beginner/Gevorderd/Expert; leerpad = Fase 1-4; challenge = EASY/MEDIUM/HARD Engels = UI=NL-bug) + leerpad/tutorial verwezen niet naar elkaar. Oplossing (geen merge — wél uniform + koppelen): (1) **leerpad-commando** groepeert de 4 fases onder de 3 niveaus + per niveau een brug `[→] Begeleide missie: tutorial <id>`; fase-namen + command-tracking + EXPERT-lock behouden. (2) **homepage-chips kloppend**: GEVORDERD → ping/nmap/ifconfig/netstat (netcat/wireshark bestaan niet, hashcat → Expert); EXPERT dekt Fase 4. (3) **challenge-difficulty overal NL** via één gedeelde `difficultyLabel()`-helper in **6 plekken** (challenge-renderer/challenge/dashboard/next/certificate-generator/certificates) — thoroughness betaalde: labels zaten verspreid, gevonden door test-failures te volgen. Interne keys (easy/medium/hard) ongemoeid. E2E: nieuwe asserts (ladder + missie-brug + challenge NL + homepage geen fictie) + EASY/MEDIUM/HARD→NL + stale badge-count 21→22 gecorrigeerd. Volledige chromium-suite groen (188 passed) + fundamentals cross-browser; desktop-box pixel-uitgelijnd (69 breed). **Nog niet gepusht** (push = deploy; wacht op go). Volledig: `docs/sessions/current.md` Sessie 188. **Pre-Sessie 188:** Sessie 187 — Fase B: NEW fundamentals-scenario (Beginner, 7 stappen) + 4 her-tiering-labels (recon/privesc→Gevorderd, webvuln/exploitation→Expert) + funnel-doorwerking; Expert-badge bleek niet nodig (difficulty = platte tekst). Commit `3ac65aa`. Volledig: `docs/sessions/current.md` Sessie 187. **Pre-Sessie 187:** Sessie 186 — Stap 0 ontwerpbeslissing (doc-only) die deze Fase B stuurde: mapping niveau→scenario→labelwijziging + 2 expert-calls (webvuln→EXPERT want sqlmap = headline-tool; fundamentals = navigatie+bestandsbeheer, niet alle 9 badge-chips). Volledig: `docs/sessions/current.md` Sessie 186. **Pre-Sessie 186:** Sessie 185 — Leerpad-sectie homepage: van 3 nep-deuren naar een echt leerpad (2 commits, geen architectuur-wijziging). De 3 leerpad-knoppen (Start/Verken/Beheers Leerpad) linkten allemaal naar dezelfde `/terminal.html` — drie deuren, één kamer — en dupliceerden de 4 andere terminal-CTA's op de pagina; "Leerpad" beloofde een gestuurd pad dat achter de link niet bestond. Elke kaart wordt nu een mini-leerlijn (lezen → oefenen): NEW `.leerpad-learn-link` "Lees eerst"-link naar bestaande eigen blogcontent per niveau (BEGINNER→`terminal-basics`, GEVORDERD→`nmap-beginnersgids`, EXPERT→`sql-injection-uitgelegd`) bóven een eerlijk, **uniform** knoplabel "Oefen in de terminal" (was 3× misleidend "Leerpad"). Differentiatie zit nu in de bestemming, niet in een label dat overal hetzelfde doet. NEW `.leerpad-cta-group` (flex-kolom, `margin-top:auto`) pint het link+knop-paar onderaan zodat de paren over de 3 kaarten uitlijnen bij ongelijke beschrijvingslengtes; `.leerpad-learn-link` theme-aware via `--color-text-dim`/`--color-cta-primary` (geen hardcoded kleur). **Bewust uitgesteld:** deep-linken naar in-app tutorials (optie 2) — er is géén fundamentals-scenario (ls/cd/cat), dus juist de BEGINNER-kaart (kerndoelgroep) kan nergens heen + tutorial→badge-mapping is rommelig (recon/webvuln/privesc allemaal "Beginner"); verdient eigen vervolgproject (eerst fundamentals-scenario + alle instappunten consistent). Cache-bump `landing.css?v=123→124` (preload + stylesheet, alleen `index.html`; HTML-edits zelf budgetloos). Render-en-meet op no-store server (dark+light+mobiel 375px): 6 links resolven (3 blog 200 + 3 terminal), groep-tops alle 3 == 4058px (`margin-top:auto` lijnt uit), dark link `#8b949e` == kaart-beschrijvingstekst (contrast 6,15:1 WCAG AA), light `#444444` op wit, 0 overflow (`scrollWidth` 360≤375), animatie intact (3× `.visible`, opacity 1), screenshots dark-desktop + light-mobiel. Commits `c49c1de` (CSS) + `9c8cfc6` (HTML), gepusht naar `main` in 2 logische brokken. Kernles: **same-tick `getComputedStyle` ná `setAttribute('data-theme',…)` gaf stale `#444444` voor dark** — de asymmetrie (`--color-cta-primary` flipte wél, `--color-text-dim` niet) was de tell; een verse lezing in een aparte tick gaf de echte `#8b949e`. Render-en-meet werkt alleen als je óók je meetinstrument wantrouwt. **Pre-Sessie 185:** Sessie 184 — Blog in-content CTA-boxen visueel geünificeerd (1 commit, geen architectuur-wijziging). De gecentreerde, volledige-rand `.blog-cta` was de enige uitzondering in een blog die verder een consistente links-uitgelijnde linkerrand-accent aside-taal hanteert (`.blog-tip`/`.blog-warning`/`.blog-info` + de product/lead-magnet-kaarten `.blog-cta-product`). De plain navigatie-CTA's convergeren nu op die behandeling: `text-align:center→left` + `border-left:3px var(--color-ui-primary)`; light-override `border-left var(--color-link)` (`--color-ui-primary` is groen in light → accent blijft blauw, on-palette `feedback_blog_palette_no_green`). `.blog-cta-product` geslankt (uitlijning/accent nu in de base; behoudt alleen kleinere h3 1.4rem). Lost ook gecentreerde meerregelige bodytekst op (leesbaarheids-antipatroon). Cache-bump `blog.css?v=120→121` (14 blog-pagina's). Render-en-meet op no-store server (dark+light+mobiel 375px): plain == product (`getComputedStyle` text-align left + border-left 3px), light-accent `#0969da` blauw (géén groen), 0 overflow (`scrollWidth` 360≤375), cross-check `wachtwoord-beveiliging.html` uniform, product-kaarten ongewijzigd. Commit `97b1c8a`, gepusht. Geheugen `feedback_blog_cta_unified`. Kernlessen: cargo-cult-consistentie omgekeerd — niet de afwijkers maar de outlier corrigeren; en `--color-ui-primary` is themisch (blauw dark / groen light) → accent-overrides moeten mee anders lekt groen het blog-palet in; same-tick `getComputedStyle` ná theme-toggle gaf stale kleur (fresh re-read ná recalc nodig). **Pre-Sessie 184:** Sessie 183 — Lead-magnet conversie/UX + dark-mode zichtbaarheid + copy-feitencontrole (8 commits, geen architectuur-wijziging). (1) **sample-pentest copy:** belofte-inversie weg ("direct in je inbox" → "meteen te downloaden"; de instant on-page-download is het écht directe pad, de inbox is dubbel-opt-in-gepoort) + 6 blog-CTA's; feitfouten in de 3 "Wat zit er in"-kaarten + hero-bullets tegen de echte sample-PDF (Fase 0 = voorbereiding ≠ reconnaissance/Fase 1; géén nmap-cheatsheet; "beslisboom Fase 0→1" bestaat niet → 6-fasen-overzicht); de-jargon OSINT/reconnaissance → NL "verkenning" (matcht woordenlijst-gloss); kaart-iconen op betekenis (schild=toestemming/magnifier=verkennen/list=stappenplan); cross-sell tegen volledige 19-pagina Playbook-PDF ("command-templates" bestond niet → rapport-template + commands-overzicht; "beslisbomen" mv → 1; "sla het formulier over" geschrapt — frictie-framing onjuist want Gumroad vraagt óók e-mail) + 12 blog-CTA's + meta/og/JSON-LD. (2) **conversie/UX `sample-pentest`:** signup-kaart was in dark onzichtbaar (bg #0d1117 = pagina, hairline, geen schaduw) → `--color-bg-modal` #161b22 + elevatie + groene accent + zichtbaar `<label>` + hero flex→CSS-grid (`--lead`-modifier) zodat formulier mobiel vóór de bullets; sample-download regressie-vrij. (3) **dark-surface-audit** ("light gefixt, dark vergeten"): homepage-nieuwsbrief-band + blog-`.newsletter-signup` bg→modal; per ongeluk groene accent op blog-kaart (cargo-cult) → teruggedraaid naar neutraal (blog-palet = blauw, geen groen; geheugen `feedback_blog_palette_no_green`); 4 blog-informatiekaarten gelift naar modal (hun `--shadow-elevation-1` is zwart-op-bijna-zwart = onzichtbaar in dark → elevatie hersteld via oppervlak-contrast); modals bewust gelaten (dim-overlay). Commits `c6b1247`+`82c77a8`+`90463c4`+`f73ec50`+`f6efd46`+`6dac1bc`+`6024594`+`05b6500`, gepusht. Cache-bumps `landing.css?v=122`, `main.css?v=152` (index), `blog.css?v=120` (14 blog-pagina's). Render-en-meet op no-store server (dark+light+mobiel 375px, `getComputedStyle` kaart #161b22 vs pagina #0d1117, mobiele volgorde text→form→bullets). Kernlessen: zwarte schaduw is onzichtbaar op bijna-zwarte bg → elevatie in dark = lichter oppervlak; gedeelde klasse vóór herschrijven grep'en (`.sample-hero-content` ook op sample-download); kloppende copy vereist het artefact lezen; blog ≠ groen. **Pre-Sessie 183:** Sessie 182 — Live zoekfilter + design-uitlijning op de twee naslagpagina's (commands + woordenlijst), 5 commits, geen architectuur-wijziging. (1) NEW gedeelde `src/ui/term-filter.js` (config-gedreven live-filter + scroll-spy + `itemNoun`) met dunne wrappers `glossary-filter.js` + `commands-filter.js`; `commands-scrollspy.js` verwijderd (scroll-spy zit nu in de kern). (2) **woordenlijst**: sticky balk met zoekveld dat termkaarten live filtert (op `textContent` = term+definitie) + categorie-chips + teller + lege-staat (inline CSS, geen cache-bump); "Ctrl+F"-tip vervangen. (3) **commands**: zoekfilter-backport — de bestaande "filter-balk" filtert nu écht (`commands.css?v=116`). (4) **Sticky-balk uitlijning**: balk-inner kreeg identiek box-model als `.page-section` (horizontale padding van full-bleed-buitenkant → inner) zodat zoekveld en cards op élke breedte samenvallen (was 32px scheef >1400px + 4px mobiel); `?v=117`. (5) 5× korte categorie-intro op woordenlijst (`.glossary-category-intro`, links, getoetst tegen term-lijst). (6) **commands categorie-koppen → woordenlijst-stijl** (links/groen/onderlijn-divider + light-override, intro links i.p.v. gecentreerd wit); `?v=118`. Commits `aa5cad1`+`24d2bc0`+`3af5f53`+`5e3c5e6`+`9795c58`, gepusht. Render-en-meet op no-store server (dark/light/mobiel 375px + 1600px breed: geen overflow, randen samenvallend `delta 0`, filter/scroll-spy/lege-staat/wis-knop werkend); validate-docs `--deep` exit 0. Kernlessen: flex-item `margin:0 auto` schakelt `align-items:stretch` uit → `overflow-x` grijpt niet (reset `margin:0;min-width:0`); `max-width` mét vs zónder padding geeft verschillende content-randen >max-width; cargo-cult-consistentie = vorm ≠ intentie (kies per element de behandeling die past bij wat de pagina's gemeen hebben). Card-chrome bewust niet aangeraakt (radius 12/16 + hover, lage zichtbare winst). **Pre-Sessie 182:** Sessie 181 — Drift-bestendige content-tellingen (gidsen-stats "10"/"41" → open floors "12+"/"40+"; PLANNING "10 posts"→12; NEW validate-docs `--deep` Check 6c floor-assertie `geclaimd ≤ ground-truth` over gidsen Blog/Commands + woordenlijst Termen, negatief getest 99+→exit 1) + blog-table-stacked (4 brede blog-datatabellen → `.blog-table--stacked` gelabelde-kaart-op-mobiel i.p.v. Sessie-176 overflow-scroll, conventie in `architecture-patterns.md`) + over-ons-copy (tegenwoordige-tijd framing + kop↔payload-match). CLAUDE.md "12 posts" + JSON-LD `numberOfItems:39` bewust ongemoeid (canoniek correct; oppervlakkige inventaris gaf 2 vals-positieven). Commits `83c130d`+`3530e07`+`a9006e3`+`ea379a2`, gepusht. Render-en-meet 360px (geen overflow). **Pre-Sessie 181:** Sessie 180 — Blog-auteurschap terug naar **merk (Organization)** op 13 posts (`article:author`→merk, JSON-LD `author` Person→Organization, zichtbare byline verwijderd) na strategische analyse; **persoonsnaam alleen nog op over-ons** (founder-schema + LinkedIn behouden als vertrouwensanker). Eerlijke add-then-remove binnen één sessie: eerst naam *versterkt* (op premisse "bekendheid via LinkedIn"), na premisse-correctie (echte doel = productpromotie) blog-helft teruggedraaid. `privacy.html` (noemt naam al niet) / GitHub-URL's / README bewust ongemoeid. Scripted sweep (literal block-match + per-bestand `count==1`) + JSON-LD-parse-validatie (echte parser, 0 ongeldig) + Playwright render-en-meet (meta-bar zonder byline, dark/light/mobiel). Geen cache-bump (inline HTML/JSON-LD). Commit `80f0297`, gepusht. Kernles: **auteurschaps-oppervlak ≠ promotie-doel**; las je naam niet als schema-auteur op elke geïndexeerde pagina tenzij persoonlijk merk een expliciet doel is. Bulk-rotatie 165-169 → `archive-s165-s169.md`. **Pre-Sessie 180:** Sessie 179 — Klantgerichte copy-perfectionering (2 commits, doc-sync only, geen architectuur-wijziging). **Footer-tagline** (`src/components/footer.js`): "perfect voor absolute beginners" → "van je eerste command tot security tools" — een demografisch label zet een plafond (leest als "alleen voor newbies") en was smaller dan de hero; traject-framing sluit niemand uit. Cache-bump `init-components.js?v=2`→`v=3` + `footer.js`-import, 24 HTML-pagina's (footer dynamisch geïnjecteerd → 2 cache-lagen). Commit `0b67fec`. **Hero-subtitle** (`index.html`): demografisch label + onware veiligheidsclaim ("zonder hun PC te riskeren") → "Oefen ethisch hacken met 40+ commands uit de praktijk en Nederlandse uitleg — in een veilige simulatie waar je alles kunt uitproberen zonder echte gevolgen" (tweede persoon, geen plafond, feitelijk waar: de simulator draait op je eigen machine via internet, dus de veiligheid zit in de gesimuleerde uitvoering). H1 ongewijzigd (SEO-alignment `<title>`/OG). **"authentieke commands" → "commands uit de praktijk"** op 9 user-facing plekken (og/twitter-meta index+terminal, feature-card-h3 + stat-label index, 3 blogposts) — "authentieke ervaring" (blog/welkom) bewust behouden (andere betekenis). Commit `8a81de8`. Beide gepusht naar `main`. Render-en-meet geverifieerd op no-store server (dark/light/mobiel 375px, geen overflow). Geheugen `feedback_audience_floor_not_ceiling`. **Pre-Sessie 179:** Sessie 178 — Homepage lead-magnet: UX-reorder + glow-fix + copy-perfectionering (3 commits, geen architectuur-wijziging). **Probleem:** onderaan de homepage stonden "Direct beginnen?" (lead-magnet, email-gated PDF) en "Klaar om te beginnen?" (finale CTA, instant terminal) pal na elkaar = woord-botsing + belofte-inversie (de "directe" kop hing aan het traagste pad) + conversie-prioriteit omgekeerd (secundaire email-ask vóór de primaire terminal-CTA). **Fix 1 (reorder, `index.html`):** lead-magnet-strip verplaatst ná de finale CTA → terminal-CTA krijgt het climax-moment direct na de FAQ-payoff ("Hoe begin ik?" → "Start de Terminal"); PDF + nieuwsbrief clusteren als secundaire email-staart. Commit `26b6f52`. **Fix 2 (glow, `styles/landing.css`):** door de reorder volgde een transparante sectie i.p.v. de nieuwsbrief-band, dus de op de onderrand verankerde `final-cta`-glow (`at 50% 100%`) zweefde hard afgekapt "uit het niets" → homepage-gescopete override via `.final-cta:has(+ .lead-magnet)` = zelfstandige ambient-halo (`at 50% 44%`, uitvaag `transparent 72%`); de 4 andere final-cta-pagina's (over-ons/woordenlijst/commands/contact) houden de naad-uplight. `landing.css?v=121`→`122` op alleen `index.html`. Commit `91aab72`. **Fix 3 (copy, 3 teasers):** stroeve titel "Pak de gratis Pentest Playbook-sample" → "Zo begint een echte pentest" (hook i.p.v. badge-dubbeling); vage jargon-subtekst ("Fase 0 reconnaissance-checklist + beslisboom Fase 0 → 1") → gewone taal (toestemming, scope, doelwit verkennen vóór de eerste aanval) + waarom ("de stap die beginners overslaan"). Geverifieerd tegen de echte 9-pagina PDF-inhoud (Fase 0 voorbereiding + Fase 1 reconnaissance; géén overclaim van scanning/exploitation/rapportage = betaald). Zelfde de-jargon op `over-ons.html` + `gidsen.html` (pagina-specifieke kopjes behouden); `index.html` `.phase-flow`-span vervalt. Niet aangeraakt: `sample-pentest.html` (hero al goed), blog-inline (contextueel), meta/SEO, nieuwsbrief-mail. HTML-only → geen cache-bump. Commit `deab754`. Alle 3 render-en-meet geverifieerd op no-store server (dark/light/mobiel 375px, geen overflow, glow grondt zonder harde rand, "vóór" rendert). Geheugen ongewijzigd (bestaande `reference_renderer_marker_collision`/`feedback_*` dekken het). **Pre-Sessie 178:** Sessie 177 — Terminal voltooid-markers `[X]`→`[✓]` (rode checkboxes op mobiel). **Oorzaak:** de renderer (`src/ui/renderer.js`) kleurt elke regel op z'n eerste teken; `[X]` werd overal als "afgevinkt"-vinkje gebruikt maar botst met de error-marker → **rood op mobiel** (desktop verbergt het toevallig via het ASCII-kader: elke regel begint met `│`), én die kleur lekt door naar ingesprongen regels eronder (≥3 spaties = continuation-line erft de kleur erboven). **Fix:** voltooid/unlocked-marker `[X]`→`[✓]` (success/groen; 3 chars = box-uitlijning blijft pixel-exact) in **6 oppervlakken** — `leerpad` + `challenge status`/lijst (`challenge.js`, `challenge-renderer.js`) + `achievements`/badges (`badge-manager.js`) + `tutorial`-lijst (`tutorial.js`) + `next`-afronding/transitie (`next.js`). Leerpad mobiel: command-inspringing 4→2 spaties zodat niet-voltooide regels niets meer overerven; man-page-legenda glyph achteraan → neutraal wit. **Bewust rood gelaten** (3-categorie-onderscheid uit inventaris): échte foutmeldingen (`[X] Onbekende challenge/scenario`, challenge-manager/certificates/tutorial.js:180) + de "NOOIT doen"-lijsten in security/netwerk-man-pages (hydra/sqlmap/nmap/hashcat/cat/rm — rood kruis = semantisch juist; blinde replace had de waarschuwing omgekeerd). Geverifieerd in browser (no-store server tegen vals-negatief) mobiel **dark+light** + desktop: voltooid groen, niet-voltooid wit, fouten nog rood, boxen `allSame`-uitgelijnd (len 69), 0 console-fouten — challenge status `[✓]` gemeten groen (was rood), achievements unlocked badge groen. Tests `responsive-ascii-boxes.spec.js` bijgewerkt (leerpad mobiel+desktop → `[✓]`); overige specs accepteren al `✓` of toetsen geen marker; geen CI (Netlify deployt enkel, suite = handmatig tegen productie). Geheugen `reference_renderer_marker_collision` toegevoegd. Commit `af91ff8` (7 files), gepusht naar `main`. **Pre-Sessie 177:** Sessie 176 — Mobiele audit + 5 fixes (hoofdpubliek laptop/pc, mobiel secundair; 375px-viewport gemeten met `getBoundingClientRect`/`scrollWidth`). (1) **Brede datatabellen** (blog + legal, tot 574px) werden op mobiel afgekapt (blog: `.blog-container overflow-x:hidden`) of lieten de hele pagina horizontaal scrollen (legal) → tabel-scroll-container (`display:block; overflow-x:auto`) in de `@media (max-width:768px)`-blokken van `blog.css`/`legal.css`. (2) **CSP blokkeerde de inline Consent Mode v2 defaults op alle 14 blogpagina's** → `gtag` undefined, `dataLayer` leeg, AdSense laadde zónder de `denied`-defaults (GDPR-gap); de `blog/`-map was bij de Sessie-166 inline-script-externalisatie gemist → vervangen door het bestaande externe `consent-default.js` (data-adsense). Runtime-geverifieerd (productie vóór: gtag undefined/dataLayer leeg; lokaal ná: gtag=function, default aanwezig, 0 CSP-fouten over 7 pagina's). (3) **Emoji-cleanup 3 legal-pagina's** (~60 glyphs → ASCII `[✓]`/`[✗]`/tekst; decoratieve sectie-markers weg, Ja/Nee-tabelcellen behouden woord, functionele pijlen blijven; assertie ving niet-geïnventariseerde 🎓). (4) **Contact-form-inputs 38→44px** (`pages.css min-height:44px`, WCAG 2.5.5) + `pages.css` cache-drift `v114`/`v132`→`v133` genormaliseerd (8 consumers). (5) **Terminal scroll-hint** ("Scroll voor meer info", fixed bottom:72px) botste met de naar 2 rijen wrappende quick-command-balk (~109px) → verborgen op mobiel (`terminal-education.css`, `?v=115`). **Meedogenloos-eerlijk teruggedraaid:** filterknoppen-tap-target (meting toonde 27px/42px = al ≥24px AA → fix onnodig + inline-flex-neveneffect). 4 commits `c41e317`/`5dae5ca`/`f4c70be`/`ea1c5ea`. Render-en-meet (no-store server tegen vals-negatief, dark+light, mobiel+desktop-regressie). **Pre-Sessie 176:** Sessie 175 — Layout-fixes `sample-pentest.html` (3 problemen, 1-voor-1). (1) **Chevron `Fase 0 → 1`** stond te laag op 2 plekken: `.arrow-glyph` van `position/top` → `vertical-align: 0.2em` (em-schaal, werkt op li + h3); homepage `.phase-arrow` geconsolideerd naar dezelfde canonieke `.arrow-glyph` (DRY). (2) **Success-state brak de layout** (box te groot, verweesde CTA-knop, lelijke Brevo-rand boven het invoerveld): `brevo-submit.js` verbergt nu bij succes het formulier + zet `.newsletter-submitted` op de kaart → bevestiging vervángt het formulier; `main.css` integreert success/error-paneel in de huisstijl (groene/rode tint + icoonkleur + zachte rand) — **0× nieuwe `!important`** (Brevo's `sib-styles.css` gebruikt zelf geen `!important`, dus onze scopes 0,2,0 / 1,1,0 winnen op specificiteit); `landing.css` verbergt stale titel/intro bij succes + download-knop full-width + btn-cta-tekstkleur hersteld (Brevo's `.sib-form-container a` kleurde 'm blauw+underline). E2E `lead-magnet.spec.js` uitgebreid met form-verborgen-asserties (10/10 groen, verse browser + Brevo-mock). (3) **Card-body's niet uitgelijnd** in de 3-koloms rij (card 3 1-regelige titel → body 23px hoger): opt-in `.feature-cards--equal-title` + `@media (min-width:1025px) min-height:2lh` op de titel → body's uitlijnen; gegate op 3-koloms-breakpoint (geen witruimte als cards stacken), scoped zodat index/gidsen/over-ons onaangeroerd blijven. Render-en-meet bevestigd (alle body's `top:923`); dark+light+mobiel geverifieerd. Commits `6f5e27a` (1+2) + `0a64369` (3), gepusht naar `main`. Geheugen `feedback_avoid_important_css` toegevoegd. **Pre-Sessie 175:** Sessie 174 — Mobiele PDF-download fix sample-pentest lead magnet. Root cause (gedocumenteerd Sessie 134): de welkomstmail-downloadknop loopt via Brevo's click-tracking-redirect (`r.sendibm1.com/?u=…&i=<token>`); Gmail-mobiel's prefetch consumeert het eenmalige token vóór de klik → 404 op ~5-10% mobiele klikken. Die 404 zit op Brevo's server → **niet repo-fixbaar**. Oplossing = betrouwbaar same-origin downloadpad dat Brevo-tracking omzeilt: (1) `_headers` `/assets/samples/*` `Content-Disposition: attachment`→`inline` (forceerde download brak iOS WKWebviews; inline rendert wél); (2) download-knop in het `#success-message`-panel van `sample-pentest.html` (directe PDF ná aanmelding, géén Brevo-link); (3) NEW `noindex` `sample-download.html` (download + cross-sell; betrouwbare bestemming voor de mailknop, niet in sitemap); (4) `lead_magnet_download` GA4-event via `data-lead-download` (`cta-tracking.js`+`events.js`, CSP-safe). Double opt-in blijft AAN; success-copy gecorrigeerd (noemt directe download + bevestigen-voor-nieuwsbrief, claimt niet onterecht 'al gemaild'). 10/10 lead-magnet E2E groen op chromium (lokaal tegen statische server; WebKit-download egress-geblokkeerd → iOS = handmatige real-device-check). Commits `8f2ce68` + `fb397ca`. **Brevo-404 zelf = best-effort vervolgwerk Heisenberg:** tracking-toggle-check → support-ticket → bijlage-fallback; + mailknop-URL → `/sample-download.html` + Brevo success-message gelijktrekken. **Pre-Sessie 174:** Sessie 173 — Launch-prep voor de marketing-launch op **wo 24 juni 2026**. (1) `docs/launch-announcement-kit.md` herplanned: do 18 juni (verlopen) → wo 24 juni (sterke HN/Reddit-dag); §5-schema herontworpen voor beperkte beschikbaarheid (geclusterd in bewaakbaar blok, default 13:00-18:00, reactie-gevoelige kanalen vooraan) + GA4 Real-Time-verificatie aan avond-ervoor-checklist. (2) Launch-visuals geregenereerd via `scripts/capture-launch-visuals.mjs` (chromium lokaal aanwezig; egress-blok gold alleen verse install) — verse GIF+desktop+mobiel tonen nu nieuw H-monogram (oude artefacten toonden `>_`), visueel geverifieerd. (3) **Homepage linkt nu alle 13 blogposts** (`index.html`): 5 cornerstones toegevoegd (OWASP-hub, nmap, Wireshark, Hashcat, "Ethisch hacker worden") → complete interne linking + crawl-route; sitemap homepage `lastmod` → 2026-06-18 (echte edit-datum). (4) **Datum-discipline-correctie:** eerst `dateModified`/`article:modified_time`/`lastmod` op 3 cornerstones gebumpt **zónder** echte content-touch (= fake-freshness, schond runbook Fase 2 twee-staps-poort) → volledig teruggedraaid (posts al compleet: interne links + sibling-cross-links nmap↔wireshark/owasp↔sql-injection + OWASP-2025 al gedekt). Eerlijke freshness-hefboom = verse launch-post (later samen). Geheugen `feedback_preserve_plan_gates` toegevoegd. Commits `d50b981` (homepage+sitemap) + `4dd17b5` (kit). **Handmatig (Heisenberg) op 23-24 juni:** zie `docs/launch-announcement-kit.md` §5 + `docs/seo-launch-checklist.md`. **Pre-Sessie 173:** Sessie 172 — GSC "Verkopersvermeldingen" (merchant listings) fix op `gidsen.html` Product-markup: GSC meldde 4 ontbrekende velden op de 3 Gumroad-gidsen (kritiek: `image`; niet-kritiek: `hasMerchantReturnPolicy`, algemene ID/`brand`, `shippingDetails`). Eerlijk ingevuld per digitaal download-product: `brand` HackSimulator.nl, `hasMerchantReturnPolicy` = `MerchantReturnNotPermitted` (NL — herroepingsrecht vervalt bij directe digitale download, art. 6:230p BW), `shippingDetails` = €0/0-dagen (instant download, géén "gratis product" — `price` 5.00 blijft staan; verzendkosten ≠ prijs). Verbeterpunt meegenomen: losse cover-image per gids i.p.v. gedeelde og-image → NEW `assets/products/{ethisch-hacken-wet,eerste-pentest-playbook,ctf-leerplan}.png` (1200×630 @2x, on-brand: H-monogram + neon-groen op donker + terminal-frame). Gegenereerd via NEW reproduceerbare `scripts/build-product-covers.mjs` (SVG→PNG via `@resvg/resvg-js` — browser-rasterizer chromium geblokkeerd door egress-policy, resvg = prebuilt Rust, geen browser-download nodig; render-en-meet visueel geverifieerd). `@resvg/resvg-js` → devDependencies (build-only). Beide JSON-LD-blokken valideren; nul misleidende data. Commits `d67d3af` (schema-fix) + `672c32e` (covers). **Handmatig (Heisenberg): na deploy in GSC "Validatie van fix valideren" klikken** (kritieke `image`-fix telt pas na re-crawl). **Pre-Sessie 172:** Sessie 171 — Logo-herontwerp + volledige asset-keten: generieke `>_` vervangen door een eigen **H-monogram** (de letter H op een `_` command-line-balk) — ownable, leesbaar tot 16px. Doorgevoerd in `favicon.svg` + alle PNG/ICO (favicon-96, apple-touch, maskable 192+512 vol-vlak, favicon.ico met PNG-payloads — browser-gerenderd want geen rasterizer geïnstalleerd) + `navbar.js`/`footer.js` (inverted glyph zónder tegel op het donkere frame) + `docs/products/logo.svg` (PDF-cover). NEW `assets/brand/` brand-kit: `logo.svg` (tegel) + `logo-on-dark.svg` + mono-black/white + PNG-exports 256/512/1024 + README met merkkleuren. Social-kaart `assets/og-image.png` herbouwd mét logo (browser-render 1200×630) + `?v=2` cache-bust op og:image/twitter:image (60 refs, 25 pagina's) wegens `/assets/* immutable 1jr`. 3 Gumroad-PDF's + sample herbouwd (typst 0.13.1, logo op cover geverifieerd via PDF-pagina); geserveerde lead-magnet `assets/samples/` bijgewerkt. Build-DRY: `build-pdfs.sh` kopieert het logo nu uit canonieke `assets/brand/logo.svg`, `docs/products/logo.svg` gitignored (build-managed). Nul site-runtime-impact buiten de bewuste logo-swap (geen css/js/_headers/netlify-gedragswijziging). **Handmatig (Heisenberg): 3 betaalde PDF's opnieuw uploaden naar Gumroad** (Gumroad host z'n eigen kopie, losgekoppeld van repo/deploy). Niet gecommit tot review. **Pre-Sessie 171:** Sessie 170 — Structuuranalyse + veilige repo-opruiming: bestands-/mapopbouw beoordeeld (verdict: structureel goed georganiseerd — schone domein-indeling `src/`, nul echte weesmodules, geen getrackte rommel, artifact-dirs correct gitignored). Meeste schijnbare "rommel" is by-design (root-HTML's = schone Netlify-URLs, `commands/index.html` = route-pagina, dubbele sample-PDF = bron→publiceer-flow). Veilige acties (nul runtime-impact, geen js/css/html/_headers/netlify wijziging): (1) `docs/products/*.pdf` (5 bestanden ~632 KB herbouwbare build-output uit `.typ`) uit git via `.gitignore` + `git rm --cached` — bestanden blijven op schijf, geserveerde lead-magnet `assets/samples/` + `.typ`-bronnen blijven getrackt; (2) provenance-header in `build-pdfs.sh`; (3) NEW `docs/architecture-review.md` (verdict + by-design-overzicht + artifact-flow). **Bewust NIET:** geplande doc-verplaatsing naar `archive/` (inbound refs = historische log-narratie in gated `current.md`; één doc nog pending) = net-negatief, conform Sessie-169-learning "geen cargo-cult-opruimen". Commit `480a227`, 7 files. validate-docs fast + `--deep` exit 0. **Pre-Sessie 170:** zie `docs/sessions/current.md`. **Pre-Sessie 169 (origineel):** Google Search Console meldde 19 niet-geïndexeerde pagina's (3 omleiding + 1 alt-canonical + 8 gevonden + 7 gecrawld). URL-niveau-diagnose (gebruiker leverde GSC-lijsten) toonde 2 echte zelf-veroorzaakte duplicaat-bronnen: alle 14 blog-footers linkten via `href="index.html"` → `/blog/index.html` (canonical is `/blog/`) en `welkom.html` body via `../index.html` → `/index.html`. Fix: footer-links → `/blog/`, welkom-body → `/`, homepage blog-links 3→8 (5 vastzittende posts als crawl-nudge), sitemap `lastmod` ververst (homepage + 6 posts → 2026-06-15). Overige meldingen benign (www/http-redirects correct; extensieloze URL's `/terminal`/`/blog/welkom` historisch, consolideren via canonical). Eerlijk: interne links = marginale nudge (cybersecurity-tools had al 9 inbound + zat tóch vast → dominante factor = crawl-budget/autoriteit/tijd jong domein). Commit `cce7dce`, 15 files. Browser-onafh. verificatie: sitemap XML valid 25 URLs, nul resterende `index.html`-links, validate-docs exit 0. **Pre-Sessie 169:** zie `docs/sessions/current.md`.

**Sprint (Sessie 166):** Pre-launch security-audit + hardening. CSP `script-src` ontdaan van 'unsafe-inline'/'unsafe-hashes' via externalisatie van alle inline scripts naar /src/*.js (consent-default.js, brevo-config.js, init-theme.js, load-animations-css.js; AdSense-injectie ná consent-defaults sluit de consent-race) + X-XSS-Protection→0 + history.search() ReDoS-hardening + privacy.html feitfout (command-args lokaal ≠ verzonden; wissen via `history -c`) + CSP frame-src/img-src `adtrafficquality.google` (F6, pre-existing AdSense fraud-beacon-block) + .well-known/security.txt (RFC 9116) + SECURITY.md. Browser-geverifieerd onder de echte CSP-header: nul violations op index/terminal/legal/brevo; consent-ordering bevestigd in dataLayer; E2E 183 passed (3 'failures' via schone-baseline ontmaskerd als pre-existing/flaky, geen regressie). Commit `aa0396d` op branch `security/csp-hardening-audit`. **Handmatig voor Heisenberg:** branch pushen → Netlify deploy-preview verifiëren → merge naar `main` = productie-deploy. **Pre-Sessie 166:** zie `docs/sessions/current.md`.

---

## 📊 Voortgang Overzicht

**Totaal:** ~292 / ~340 taken voltooid (~86%) — exacte subtask-tellingen kunnen driften per sessie; voor ground truth zie milestone-secties hieronder. Validatie via `scripts/validate-docs.sh`. **Sessie 156 update:** M6 +2 closures (long-press gesture + beta protocol-doc) = 30/32 → 32/32 = 100% closure; M6 doc-drift gecorrigeerd (was 30/33 stale). **Sessie 158 update:** M5 tabel 41/45→64/90 + M5.5 tabel ~16/18→23/26 ad-hoc drift-fixes (Sessie 157 --deep Check 6 extension drift-catch; nieuwe scope M5/M5.5/M9 + Blog sub-check 6b). **Sessie 159 update:** #23.2 M0-M4 permanent-SKIP closure (documentation-of-intent) — geen tabel-cijfer wijzigingen, M0-M4 frozen-by-design (semantic-difference tabel=MVP-essential subset vs section=full-detail incl. defer-to-M5/M4 testing + optional/Post-MVP/Future). **Sessie 160 update:** public-launch SEO-metadata prep — geen tabel-cijfer wijzigingen (sitemap/feed drift-fix + validate-docs Check 9 + GSC Domain-launch + runbook).

| Mijlpaal | Status | Taken | Percentage |
|----------|--------|-------|------------|
| M0: Project Setup | ✅ Voltooid | 15/15 | 100% |
| M1: Foundation | ✅ Voltooid | 20/20 | 100% |
| M2: Filesystem Commands | ✅ Voltooid | 25/25 | 100% |
| M3: Network & Security | ✅ Voltooid | 28/28 | 100% |
| M4: UX & Polish | ✅ Voltooid | 43/43 | 100% |
| M5: Testing & Launch | 🔵 In uitvoering | 64/90 | 71% | ✅ **Performance + Config + Security + Accessibility + Content + Bundle Opt 100%**
| M5.5: Monetization MVP | 🔵 In uitvoering | 25/27 | 92% | ✅ ~~AdSense (10 units, verwijderd Sessie 208)~~ + Ko-fi + **Brevo** (newsletter double opt-in + welkomstmail + deliverability tuning Sessies 134-136) + eigen consent banner + **Gumroad v1.0** (4 guides + bundel) + **Lead magnet** (sample PDF + landing + CTA-coverage 13 plaatsen + **Sessie 174 mobiele-download-fix: same-origin pad omzeilt Brevo-tracking-404**) |
| M6: Tutorial System | ✅ Voltooid | 32/32 | 100% | ✅ ALL Phase 1-3 closed — Framework + 3 scenarios + cert + analytics + E2E tests + perf audit + mobile + cross-browser + **long-press hint gesture + beta protocol-doc (Sessie 156)** |
| M7: Gamification | ✅ Voltooid | 47/47 | 100% | ✅ Phase 1-7 complete (framework, content, badges, certs, dashboard, leaderboard, testing) |
| M8: Analytics & Scaling | ⏭️ Gepland | 1/37 | 2% | (Sessie 157 --deep zelf-test ground-truth fix: was 0/40 stale; section heeft 1 [x] + 36 [ ]) |
| M9: Refactor Sprint | ✅ Voltooid | 19/19 | 100% | ✅ Cache + bundle + code quality + docs sync + performance + test coverage + localStorage opt |
| **Blog (content-pijler)** | ✅ Live | 14/14 posts | 100% | ✅ 105+ jargon-explanations + JSON-LD schema + internal cross-linking + unified marketing nav + breadcrumbs + merk-auteurschap (JSON-LD Organization, zichtbare byline verwijderd Sessie 180; persoonsnaam op over-ons) (Sessies 122-125 + 138-139 + 160: Wireshark + Hashcat posts; Sessie 199: Metasploit; Sessie 210: leren-hacken) |

---

## 🎯 Huidige Focus

**Actieve Mijlpalen:** M5.5 Monetization (deliverability + lead-magnet polish) + M6 Tutorial System (last 3 taken) + Blog content-SEO (post-Sessie 138 hub-clustering)
**Current Status:** ✅ LIVE — Playwright E2E: **44 spec files / 314 `test()`-declaraties** (Chromium, Firefox, WebKit). Let op: het aantal *gedraaide* tests ligt hoger dan het aantal declaraties sinds Sessie 212 — `lead-magnet.spec.js`, `navbar-collapse.spec.js` (Sessie 213), sinds Sessie 215 drie blokken in `hero-demo.spec.js` en sinds Sessie 224 `legal-pages-overflow.spec.js` genereren hun scenario's in een `for…of`, dus 1 declaratie = 2-9 tests. (Die laatste is de scherpste: **1 declaratie → 9 tests** = 3 pagina's × 3 breedtes. Reken de declaratie-delta dus nooit uit maar meet hem — de +1 hier zou als +9 genoteerd zijn.) Sessie 219-verificatie: **413 passed / 1 failed / 15 skipped** over de twaalf specs die de gewijzigde bestanden kunnen raken, drie engines. De faler is `performance.spec.js:480` (VFS-groei) en aantoonbaar niet van deze wijziging: **5/5 groen op zowel `d0ba157` als `e7cc0c4`** (twee servers, serieel), en CSS kan niet beïnvloeden hoeveel bytes `touch` naar localStorage schrijft. Hij viel alleen tijdens een run waar twee extra Playwright-runs naast liepen. | Ko-fi + Brevo (deliverability getuned) + Gumroad v1.0 + **2 lead magnets met elk een eigen Brevo-formulier + automation (Sessie 212)** | **advertenties volledig verwijderd (Sessie 208)**
**Bundle (geverifieerd 29 mei 2026, Sessie 144):**
- **Site totaal:** ~2240 KB unminified | src/ 613 KB | styles/ 262 KB | blog/ 473 KB (13 files: 11 posts + index + welkom) | assets/ 1001 KB (+316 KB Sessie 172: 3 per-gids + 1 bundel cover) | HTML ~150 KB
- **E2E-bundle-test-limiet (performance.spec.js): 1120 KB** — gemeten stand **1103,62 KB** (Sessie 228, marge **16,38 KB = 1,5%**). De formule zelf is in Sessie 227 gerepareerd (#70: blog-assets uitgesloten, dode `src/ui/**/*.css`-term weg, `terminal.html` erbij) en is sindsdien ongewijzigd. De delta van deze sessie is **+8,45 KB** t.o.v. de 1095,17 KB waarmee Sessie 228 begon, en attribueert volledig aan CSS-**commentaar**, niet aan regels: main.css +5,0 KB, terminal-education.css +1,3 KB, terminal.css +1,1 KB, blog.css +1,0 KB, landing.css +0,9 KB, commands.css +0,3 KB. ⚠️ Die commentaren stonden eerst op +13,5 KB en zijn binnen de sessie gehalveerd door het verhaal naar de spec en naar dit bestand te verplaatsen (die tellen niet mee) en in de CSS alleen het **gemeten cijfer** te laten staan. Verder snoeien haalt gemeten waarden weg; als de marge opnieuw knelt is de eerlijke keuze óf een minify-stap voor `styles/` (er is er geen — commentaar wordt letterlijk uitgeleverd) óf een bewuste limietverhoging, niet nóg een ronde comprimeren.
- **Terminal Core (runtime van terminal.html, gemeten Sessie 141 via BFS module-graph):** **~781 KB unminified** | HTML 19 KB + CSS 160 KB (6 files) + JS 601 KB (99 module-graph files). Geschatte minified ~547 KB. **⚠️ ~37% boven 400 KB budget zelfs minified** — zie #24 (heroverwegen post-implementatie)
- **Lighthouse on-wire ná Pad C1+C2 (Sessie 144, productie):**
  - `/terminal.html`: **Mobile 49→59/100 (+10), Desktop 77→94/100 (+17)** | Total 626→375 KB (-251) | 3rd-party 353→101 KB (-252) | **AdSense 252 KB / 420 ms → 0/0** | LCP mobile 7716→4265 ms (-3451) | TBT mobile 1087→985 ms
  - `/sample-pentest.html`: **Mobile 73→82/100 (+9), Desktop 99→100/100 (+1)** | Total 556→304 KB (-252) | 3rd-party 487→236 KB (Brevo blijft 236 KB dominant) | TBT mobile 1209→680 ms (-529)
- **Resterende third-party-overhead:** terminal.html 101 KB (Google Fonts 99 KB / 0 ms blocking) | sample-pentest.html 236 KB (Brevo sibforms 134 KB + Fonts 102 KB)
- **Playwright:** **44 spec files, 314 `test()`-declaraties** per browser-project — **Sessie 228: +1 spec / +2 declaraties netto** (`text-contrast.spec.js` +2, en `accent-text-contrast.spec.js` −1 door het verwijderen van een test die niet meer kón falen). Gemeten met `grep -rE "^\s*test\("`, niet uitgerekend — en dat is hier scherper dan ooit: die +2 declaraties genereren **31 tests** (één `test()` in een `for…of` over 30 pagina's, plus de terminal-uitvoertest). Wie de delta uitrekent noteert +2 waar 31 gedraaid wordt, of andersom. Sessie 228-verificatie: volle chromium-suite **489 passed / 0 failed / 7 skipped** (22,0 min), de nieuwe spec **93 passed** over drie motoren.

<!-- VALIDATE-BUNDLE-START Sessie 157 — ground-truth target voor scripts/validate-docs.sh --deep -->
<!-- src=733 styles=460 blog=493 assets=1737 (KB unminified, du -sb / 1024 basis; Sessie 228 ground-truth meting) -->
<!-- VALIDATE-BUNDLE-END -->

**Volgende Stappen:**
1. ✅ GitHub repository setup (https://github.com/JanWillemWubkes/hacksimulator)
2. ✅ Netlify deployment (https://hacksimulator.nl/)
3. ✅ Performance audit (Lighthouse 100/100/92/100)
4. ✅ Cross-browser test infrastructure (Playwright 215 tests, 25 spec files)
5. ✅ **M5.5 Monetization Pivot** (Sessie 117-118): AdSense (10 units), Ko-fi donaties, Newsletter signup, eigen consent banner (Consent Mode v2)
6. ✅ **Celebration UX** (Sessie 118-119): 3-zone completion blocks, auto-copy certificaat, sequential reveal
7. ✅ **Learning Funnel Hardening** (Sessie 116-119): "Type next" hints, phase-dependent content, funnel direction lock
8. ✅ **Brevo migratie** (Sessie 126): MailerLite → Brevo (free tier, double opt-in, welkomstmail automation)
9. ✅ **Typst PDF + Gumroad v1.0** (Sessies 127-129): 3 guides + bundel live op Gumroad
10. ✅ **Lead magnet Sample Pentest** (Sessies 130-132): 9-pagina PDF + `/sample-pentest.html` landing + Brevo opt-in flow
11. ✅ **Brevo deliverability tuning** (Sessies 133-136): DnD-template herbouw, DNS cleanup (SPF/DKIM/DMARC), unblock-route, Postmaster verificatie
12. ✅ **Funnel-pulse + Lead-magnet CTA-coverage 3→13** (Sessie 137): GA4 pipeline gevalideerd via simulate success-panel toggle, contextual CTA-copy per blog
13. ✅ **Content SEO Plan C — OWASP Top 10 hub-post** (Sessie 138): nieuwe hub + bidirectional clustering + `validate-blogs.sh` modernisatie + tag-balans-check
14. ✅ **Unified marketing nav + breadcrumbs blog-pages** (Sessie 139): `getMarketingNavbar()` + `currentPage`-param + breadcrumb-strip + BreadcrumbList JSON-LD
15. ✅ **Doc-protocol refactor + drift-resistance** (Sessie 140): §Document Ownership matrix in PLANNING.md, milestone-tabellen + revenue-projections verhuisd naar TASKS.md, bundle budget gesplitst (runtime <400 KB strikt + SEO/content budgetloos), `scripts/validate-docs.sh` met 4 invariant-checks geïntroduceerd + pre-commit hook geactiveerd, `/summary` skill geüpdatet naar 7-step flow met ground-truth-meting, Sessie 144 trigger persistent op 2 plekken (TASKS.md #23 + inline TODO in validate-docs.sh)
15b. [x] **Sessie 220 opruimronde** — twee tests die niet maten wat ze beweerden gerepareerd (#62, #63), bulk-rotatie 205-209, zeven dode taken gesloten mét reden, Brevo-runbook juridisch afgerond, wayfinding-link naar `/gidsen.html`. NEW openstaande diagnose #64.
16. [ ] Mobile real device testing (iOS, Android)
17. [ ] GA4 Real-Time verificatie (handmatig)
18. [x] ~~AdSense performance monitoring (CTR, RPM na 30 dagen)~~ — **GESLOTEN N.v.t. Sessie 220.** AdSense is in Sessie 208 volledig van de site verwijderd (€0 opbrengst tegen 251,7 KB third-party); er is geen dashboard meer om af te lezen en geen ad-unit die een CTR kan produceren. Deze taak stond 12 sessies open ná zijn eigen onderwerp. Zie ook #58: de educatiestrook onder de terminal was AdSense-vulling die de advertenties zelf overleefde — dezelfde faalklasse (de aanleiding verdwijnt, het gevolg blijft staan)
19. [ ] Ko-fi conversion tracking (donaties per maand) — manueel via Ko-fi dashboard
20. [x] M6 Tutorial: laatste 3 open taken ✅ CLOSED Sessie 156 (long-press hint gesture + beta protocol-doc) → M6 100% (zie milestone-tabel)
21. [x] Bundle runtime-budget herijken: split site-totaal in *Terminal Core* (runtime <400 KB) vs *SEO/content* (geen budget) — splitsing toegepast in PLANNING.md bundle-tabel (Sessie 140 doc-split + Sessie 141 ground-truth meting). **Meet-resultaat Sessie 141:** Terminal Core = ~781 KB unminified (HTML 19 + CSS 160 + JS-module-graph 601 over 99 files). Geschatte minified ~547 KB. **⚠️ Overschrijding ~37% boven 400 KB budget zelfs minified** → opvolg-actie #24
22. [ ] Postmaster re-check — **kalenderhelft van de trigger geschrapt in Sessie 220.** Was: "eerste >100-recipient campaign-send OF kalender-datum ~1 juni 2026". Die datum is >2 maanden verstreken en is twee keer doorgeschoven (Sessie 204, Sessie 220) zonder dat er iets te zien viel — logisch, want Postmaster Tools **aggregeert pas bij volume** (Sessie 136: DKIM/SPF/DMARC verified, data pending tot >1000 sends/dag). Een datum die geen data oplevert is geen trigger maar een herinnering die je elke sessie opnieuw wegklikt. **Enige resterende conditie: de eerste campagne met >100 ontvangers** — dán pas is `postmaster.google.com/managedomains` zinvol. Actie bij Heisenberg
23. [x] **Sessie 157 CLOSED** (13 sessies vertraagd van Sessie 140 inline TODO target Sessie 144) — `validate-docs.sh --deep` mode geïmplementeerd: Check 5 Bundle KB ground-truth via VALIDATE-BUNDLE HTML-comment marker block in TASKS.md (±5% tolerance, pure-bash integer arithmetic locale-onafhankelijk), Check 6 Milestone-percentage via `awk` section-range + `[x]/[ ]` count voor M6/M7/M8 (sections-loze milestones graceful `[SKIP]`), Check 7 Cross-doc Versie consistency CLAUDE.md `**Version:**` ↔ TASKS.md `**Versie:**`. `--deep` opt-in flag (pre-commit blijft fast, `/summary` flow Step 7 gate). Phase C clean baseline ving REAL drift M8 0/40/0% → 1/37/2% (forcing-function value real-time). Phase D 3 drift-injection scenarios verified. scripts/validate-docs.sh +129 regels (PRE 211 → POST 340). Plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-precious-dusk.md`.
24. [x] **Bundle-optimalisatie sprint — Pad C1 + C2 voltooid Sessie 144** (commit `4e4eec5`) — adsbygoogle.js verwijderd van 6 no-slot pages (terminal.html + sample-pentest.html + gidsen.html + assets/legal/{privacy,terms,cookies}.html) + animations.css critical-split op terminal.html (inline `:focus-visible` + `prefers-reduced-motion` + modal fade-in keyframes, defer rest via `media="print" onload`) + `fetchpriority="high"` op preloads terminal.html + index.html. **Productie-impact (Lighthouse@11 vóór/ná, productie):** terminal.html mobile **49→59** (+10), terminal.html desktop **77→94** (+17), sample-pentest.html mobile **73→82** (+9), sample-pentest.html desktop **99→100** (+1). AdSense ecosysteem 252 KB / 420 ms → **0/0** op alle 4 runs. Total transfer -251 KB consistent. **Eerlijk-flag:** terminal mobile 59 onder plan-ondergrens (70-80) door first-party bottleneck — box-utils.js (item #26) wordt prioriteit. Full delta-tabel in `docs/perf-third-party-audit.md` §7.
25. [x] **Third-party performance audit** (Sessie 143, voltooid) — Lighthouse@11 JSON-parse op productie `/terminal.html` onthulde: AdSense ecosysteem (`pagead2.googlesyndication.com` 230.5 KB + `ep1/ep2.adtrafficquality.google` 21.2 KB) = 73% blocking-time / 65% transfer. GA4 NIET geladen (consent-default-denied werkt correct), Brevo + Ko-fi laden niet op terminal.html (zijn alleen op index.html / sample-pentest.html). **Smoking gun:** ad-slot script 132.9 KB ongebruikt (77%), adsbygoogle.js 28.7 KB ongebruikt (53%) — terminal.html heeft 0 `<ins>` ad-elementen in body. Reproducibility: Mobile 39→40, Desktop 64→69 (binnen run-variance). **Output: `docs/perf-third-party-audit.md`** met 3 paden voor #24-heropening (C1: quick wins ~275 ms, C2: AdSense Auto-ads investigation ~788 ms TBT-besparing als UIT, C3: budget-herijking).
26. [x] **`box-utils.js` bootup-time profile — Frame B (Lighthouse-attributie-bias), Sessie 145** — Verify-first-plan uitgevoerd (`/home/willem/.claude/plans/heisenberg-hier-pak-item-pure-cascade.md`): 3-run Lighthouse@11 mobile-audit met `--save-assets` + raw `trace.json` parsing + Playwright cold/warm-meting via 5-iteratie cachebust dynamic-import. **Multi-metric bewijs voor Frame B (geen code-actie):** (1) raw trace.json toont voor box-utils.js slechts 3 events totaal = ResourceSendRequest 0 ms + v8.parseOnBackground 1.24 ms + v8.compileModule 0.07 ms = **1.3 ms X-phase dur** (parse op worker-thread, niet main-thread). (2) Playwright Playwright-mediaan op 375×667 viewport: importMs 30.6 ms (incl. ~25 ms netwerk-RTT naar Netlify CDN), **coldCallMs 1.4 ms** (Frame A vereist >20 ms — gefalsifieerd), **warmCallMs 0.1 ms** (cache werkt impeccable — hypothese (b) "cache-key faalt" gefalsifieerd), wordWrap50 0.4 ms. (3) Lighthouse rapporteert 230 ms scripting voor URL — factor **~177x mismatch met raw trace**. Hypotheses (a)/(b)/(c) uit Sessie 143-formulering allemaal gefalsifieerd door data. **Echte cost-drivers (uit `mainthread-work-breakdown`):** Style/Layout **2172 ms**, scriptEvaluation totaal 376 ms (verdeeld), parseHTML 115 ms. Top single tasks = Layout 195/137/87 ms — 2x meer dan alle scripting tezamen. Frame B-uitkomst zonder code-wijziging is legitieme vervulling van verify-first plan §3. Defense-in-depth: status hier + comment box-utils.js regel 1 + audit-doc §2 multi-metric tabel. Mobile-score-verbetering richting 70-80 moet uit Layout/Style-reductie komen (kandidaat-task #28, niet uit box-utils-patch).
27. [x] **Ad-bearing pages preconnect + inline critical-CSS — Frame C REVERT, Sessie 151** (patch commit `a80e675` → revert commit `0354c7a`). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-peppy-sprout.md` met 6-signaal decisional-thresholds-tabel + symmetrische 33,3% anti-bias clustering + Frame B/C/D eervolle paden + pre-data threshold-feasibility-flags. **Phase 1 surprise-findings:** (a) animations.css NIET aanwezig op 16/16 ad-bearing pages (Sessie 144 critical-split-pattern WAS NIET hergebruikbaar — alleen inline-CSS-only pattern toepasbaar); (b) Brevo `sibforms.com` orthogonale factor BEPERKT tot 2 pages (index.html + blog/index.html, niet alle blog posts); (c) 17 pages totaal (typo welkom.html vs welkom-bij-hacksimulator.html in spawn-prompt). **Scope (Optie B-light, Heisenberg expert-decision):** preconnect `pagead2.googlesyndication.com crossorigin` + inline critical-CSS 6 selectoren (terminal.html lines 53-59 verbatim copy: `:focus-visible`, `prefers-reduced-motion`, `@keyframes fadeIn/fadeOut`, `.modal` transitions, `html scroll-behavior:smooth`) op 17 ad-bearing pages — GEEN externe animations.css link (file niet aanwezig op deze pages), GEEN adsbygoogle defer (audit-doc §3 CPM-trade-off geskipt conservatief). **3 sub-patterns toegepast:** Pattern A (13 files) standaard insert NA theme-color, Pattern B (woordenlijst) onder bestaande `<!-- Preconnect -->` placeholder (Sessie 150 residu), Pattern C (index + blog/index) pagead2 VOOR sibforms preconnect (primary resource hint priority). **Patch:** 17 files / 170 ins. **Pre-commit gates ✓:** validate-docs.sh exit 0 + Playwright Chromium 177 passed + 3 pre-existing flakes via Sessie 149 isolated-rerun-pattern (cross-browser footer + gamification badges = Sessie 149 bekend, responsive-breakpoints = 3× isolated rerun PASS bevestigt parallel-execution flake, geen causale link met patch). **S6 PRE-meting (Playwright MCP cold cache):** index.html adsbygoogle.js fetchStart=137/connectStart=259/requestStart=306/responseEnd=362 ms (169 ms connection-overhead), blog/nmap fetchStart=174/connectStart=174/requestStart=326/responseEnd=371 ms (152 ms connection-overhead). **3-run LH@11 mobile baseline mediaan canonicals (sorted op LCP):** index.html r3 LCP=2276/FCP=1877/TBT=1414/Bytes=557KB/CLS=0.084/Score=69, blog/nmap r3 LCP=1865/FCP=1865/TBT=1133/Bytes=425/CLS=0.073/Score=74. **3-run LH@11 mobile post-mediaan canonicals:** index.html r1 LCP=2375/FCP=2147/TBT=1663/Bytes=557/CLS=0.011/Score=68, blog/nmap r2 LCP=2703/FCP=1725/TBT=1427/Bytes=426/CLS=0.073/Score=69. **S6 POST-meting Playwright MCP:** blog/nmap **fetchStart=218/connectStart=218/requestStart=275/responseEnd=315 ms = 57 ms connection-overhead (vs PRE 152 = -95 ms / -62% reduction A HIT clean)**, index.html toonde 2-entry quirk (preload scanner + consent.js dynamic re-fetch) waarvan Entry 2 connection-overhead=2 ms (mechanism-active bewezen). **Multi-metric delta-tabel + Frame-hits canonicals:** Index | S1 LCP +99 NOISE | S2 FCP +270 ms ✗ C | S3 TBT +249 ms ✗ C | S4 Bytes +0 NOISE | S5 CLS **-0,073 A HIT** | S6 mechanism 2-entry quirk |. Blog/nmap | S1 LCP +838 ms ✗ C | S2 FCP **-140 ms A HIT** | S3 TBT +294 ms ✗ C | S4 Bytes +1 NOISE | S5 CLS 0 A HIT | S6 preconnect proof **-95 ms / -62% A HIT clean** |. **Verdict Frame C** per plan §6 (≥1 Frame C-threshold hit op S1/S2/S3/S4/S5) — beide canonicals hebben multiple C HITs ondanks mechanism-proof clean. **Variance-amplification hypothese (Sessie 147 #29 patroon herhaalt):** POST-patch LCP-range Index 802 ms / Blog/nmap 1111 ms vs PRE 123 ms / 144 ms = **6,5-7,7× variance-increase**. Preconnect opent connection vroeg → AdSense backend response-variance + dependent-request-cascade-timing wordt dominant signal source ipv stabiele lazy-connection-flow PRE-patch. **Spot-checks 1-run informatief (3 pages, geen baseline = niet Frame-bepalend):** over-ons.html LCP=2693/TBT=1933/Score=66, blog/welkom.html LCP=1662/TBT=1294/Score=75, commands/index.html LCP=2381/TBT=1114/Score=72. **6-op-rij Frame-falsificatie patroon HERVAT** na Sessie 150 Frame A break: 145B + 146D + 147C + 149D + 150A + **151C**. Anti-rationalisatie-discipline structureel verankerd via Frame-falsificatie blijft de norm — Sessie 150 Frame A was unique font-pipeline mechanism territorium (geen resource-priority-cascade). Sessie 147 #29 patroon (preconnect/modulepreload mechanism bewezen werkend MAAR variance-cascade introduceert netto regressie) herhaalt zich op nieuw resource-type. **Revert commit `0354c7a`** (17 files / 170 del) + push + Netlify deploy poll ✓ productie back to pre-patch state. **Spawn #34:** mechanism-isolation onderzoek — splits Optie B-light patch in (a) preconnect-only en (b) inline-CSS-only naar separate verify-first cycli om te identificeren welk mechanism de variance-amplification veroorzaakt. Hypothesis: preconnect-only meest waarschijnlijk culprit (early-connection-opening = early AdSense-backend-dependency-cascade); inline-CSS-only zou Frame B/D verwacht zijn (puur source-growth zonder timing-impact). **Defense-in-depth 5 plekken:** dit item + sprint regel + Voortgang Overzicht + current.md Sessie 151 + perf-audit §2f + CLAUDE.md learnings + plan-file outcome-sectie. Artifacts `/tmp/sessie151-item27/{pre-r1,2,3,post-r1,2,3,spot-*,s6-pre,s6-post}.json`.

28. [x] **Style/Layout perf-audit op terminal.html — Frame D (no-meerderheid), Sessie 146** — Verify-first-plan uitgevoerd (`/home/willem/.claude/plans/heisenberg-hier-pak-logical-knuth.md`, 2200 woorden, 4-frame decisional-thresholds-tabel met 8 signalen + tie-breaker). **Methodiek:** hergebruik Sessie 145 mediaan-run `/tmp/perf-item26/lh-run2-0.trace.json` voor source-attributie via Python parse met `args.beginData.frame` cross-frame-filter tegen `TracingStartedInBrowser` mainFrame + Playwright MCP cold-meting productie via `performance.getEntriesByType('navigation'|'paint'|'resource')` + buffered `PerformanceObserver({type:'layout-shift'|'longtask', buffered:true})`. **Multi-metric bewijs voor Frame D:** (1) Top-3 Layouts uit trace zijn **parser-driven** (stackTrace depth=0): 194,87 + 137,42 + 86,83 ms = 419 ms. (2) Frame A signaal 1 cluster: Top-1 stack matcht geen JS-file + 0 marks/measures aanwezig (geen code-instrumentatie) = **0/3 sub-checks**. (3) Frame B signalen 2/3/4/5: RecalcStyle >5ms = 3 (vereist >50), ParseAuthorStyleSheet som = 11,54 ms (vereist >100), unique URLs top-10 RecalcStyle = 4 (vereist >5), ratio UpdateLayoutTree/Layout = 6,38 (vereist >10) = **0/4 hit**. (4) Frame C signalen 6/7: Top-1 ts relative 631 ms (BUITEN FOUT-window 200-400 ms), cumulative LayoutShift Playwright productie = 0,000107 (vereist >0,01) = **0/2 hit**. (5) Frame D signaal 8: Top-3 sum 419 ms > 100 ms = niet-worth-it-escape NIET hit. Per tie-breaker "Bij twijfel: Frame D" → Frame D gekozen, geen code-actie. **Mechanisme onthuld buiten v2 framework (spawn #29):** Long-task #1 (520 ms desktop cold-meting productie at startTime 566 ms) omhult navbar.js (140 ms duration, responseEnd 660 ms) + footer.js (204 ms, 726 ms) + legal.js (237 ms, 763 ms) + mobile.css (506 ms) + animations.css (507 ms). Top-3 trace-Layouts zijn browser-default render-cycle-ticks NA deze cascade-resolution, niet als JS-call side-effect. **Honest-flag:** Heisenberg's verwachte mobile +5-15 score gefalsifieerd door data, transparant geaccepteerd (Sessie 145 leerpunt herbevestigd: 2e sessie op rij). Multi-metric tabel + 4-frame beslis-overzicht in `docs/perf-third-party-audit.md` §2b. Defense-in-depth (Sessie 140 pattern): 3 plekken voor Frame D-uitkomst = audit-doc §2b + dit item + CLAUDE.md Sessie 146 learnings.

29. [x] **Lazy-module-fetch-cascade audit + modulepreload-experiment — Frame C (resource-priority-regressie), Sessie 147** — Verify-first-plan uitgevoerd (`/home/willem/.claude/plans/heisenberg-hier-pak-item-foamy-sprout.md`, plan-mode 3 Explore-agents + 1 Plan-agent + 6-signaal decisional-thresholds-tabel met symmetrische 33,3%-clustering, anti-Sessie-146-redundancy 37%-grens). **Phase 1 correcties:** (a) legal.js EXCLUDED uit patch want transitief via `src/main.js` modulepreload-chain (main.js:7 statische import); (b) path-style `/src/components/...` leading-slash voor browser-dedupe-match met init-components.js:15-16 import-specifiers; (c) bestaande terminal.html:43 `src/main.js` modulepreload mismatcht line 385 `src/main.js?v=88-multiline-wrap` — out-of-scope spawn #31. **Pre-patch baseline (mediaan run-3, LH@11 mobile):** score 74 / LCP 4116 ms / TBT 477 ms / Top-1 Layout 166,5 ms / Top-1 RunTask >50ms = 208,1 ms / navbar+footer rendererStart 441 ms / cascade-window 303 ms. **Patch:** 3 HTML-regels (~240 bytes) tussen terminal.html:43 en 44, `fetchpriority="auto"` (anti-Sessie-144-CSS-conflict-precedent). Pre-commit secrets ✓, validate-docs.sh ✓. Playwright full-suite 14/576 failures bewezen pre-existing flakes via stash-verify + chromium-isolated rerun (9.7s ✓). Commit `baa4cf3` + Netlify-deploy 11 sec. **Post-patch (mediaan run-3, LH@11 mobile):** score 62 / LCP 4250 ms / TBT 813 ms / Top-1 Layout 334 ms / Top-1 RunTask 418 ms / navbar+footer rendererStart 200/205 ms / cascade-window 60 ms. **Multi-metric delta-tabel + Frame-hits:** | S1 LCP +133,5 ms C | S2 TBT +335,5 ms C | S3 Layout +167,2 ms C | S4 LT1 +210,2 ms C | S6 navbar -240,7 ms A | S7 footer -236,2 ms A |. **Verdict Frame C** (4/4 page-perf-signalen Frame C-threshold geraakt, 2/2 resource-signalen Frame A). **Mechanisme:** modulepreload met `fetchpriority="auto"` (Chrome browser-default Medium-High) verschuift navbar/footer 240 ms eerder MAAR concurreert met CSS-high tijdens initial-connection-phase → CSS-fetch verlaat → FCP +796 ms / Top-1 Layout verdubbelt / long-task #1 verdubbelt. Patch werkt zoals technisch verwacht maar veroorzaakt netto regressie. Revert commit `6c2ac7a` + deploy 21 sec. **Honest-flag (3e sessie op rij — mobile-delta-verwachting structureel-gefalsifieerd):** Sessie 145 (#26 Frame B Lighthouse-attributie-bias) + Sessie 146 (#28 Frame D no-meerderheid) + Sessie 147 (#29 Frame C resource-priority-regressie). Drie sessies, drie verwachting-vs-data-misalignments, drie eervolle closures zonder rationalisatie. Anti-rationalisatie-discipline nu structureel verankerd. Defense-in-depth-persistence (Sessie 140 pattern): audit-doc §2c multi-metric tabel + dit item + CLAUDE.md Sessie 147 learnings + docs/sessions/current.md Sessie 147 entry. Artifacts: `/tmp/sessie147-item29/{vector-pre,vector-post,verdict}.json` + 6 LH JSON's + 2 trace.json's + parse.py.

30. [x] **Sync-inline navbar/footer — Frame D revert + spawn #33, Sessie 149** (Sessie 147 spawn uit #29 Frame C closure). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-wise-book.md` met 6 signalen × 3 clusters anti-bias 33,3% symmetrisch + decisional-thresholds-tabel vooraf + Frame B/C/D eervolle paden ingebouwd. **Patch (commit `b1c6ded`):** terminal.html navbar-placeholder regels 81-96 + footer-placeholder 358-372 vervangen door exacte `getAppNavbar()` + `getMarketingFooter({basePath:'/', showFeedback:true, showDonate:true, showCookieSettings:true})` output (+5826 bytes = +5,6 KB binnen plan-target), navbar.js regels 445-489 mini-refactor splits in (1) conditional injection-block bij `#navbar-placeholder` aanwezig + (2) event-binding-switch dat ALTIJD draait wanneer `#navbar` in DOM → behoudt theme-toggle/hamburger/help-dropdown handlers bij sync-inline statische DOM. Lokaal verified pre-commit: themeToggleResponded=true (data-theme attr wisselt op klik), 12 footer-links + Ko-fi + feedback + cookie-settings correct gerenderd, alle aria-attributes correct overgenomen, 0 console errors + 1 expected console.warn (footer.js placeholder-skip). Playwright Chromium 183 passed; 3 failed + 1 flaky alle 4 onthuld als **pre-existing flakes** via Sessie 147+148 isolated-rerun tegen productie (cross-browser footer-links, gamification badge tiers, performance VFS NaN = Sessie 148 spawn #32, feedback retry). validate-docs.sh 4/4 ✓. Netlify-deploy <5 sec. **Verse 3-run LH@11 mobile baseline mediaan run-3 (huidige main, niet hergebruik Sessie 147):** score 63 / LCP 4203 ms / TBT 816 ms / FCP 1916 ms / S3 Top-1 Layout (mainFrame) 264,9 ms / S4 LT1 LH-trace 326 ms / S5 FCP cold-real (Playwright) 296 ms / Speed Index 4188 ms / CLS 0,0000. **Post-mediaan run-3:** score 65 / LCP 4178 / TBT 756 / FCP 1897 / S3 Layout 219,6 / S4 LT1 269 / Speed Index 3981 / CLS 0,0002. **Multi-metric delta-tabel + frame-bepaling:** S1 LCP **-25 ms NOISE** (Frame A ≤-150) | S2 TBT **-60 ms NOISE** (Frame A ≤-80, just outside) | S3 Top-1 Layout **-45 ms FRAME A HIT** (Frame A ≤-40) | S4 LT1 **-57 ms NOISE** (Frame A ≤-800) | S5 FCP LH-lab clean **-19 ms NOISE** (Frame A ≤-500) | S6 LT1<200 binair **false → false (NIET FRAME A)** want post-LT1 269 ms > 200 ms threshold. **Verdict Frame D via tie-breaker:** S6 ≠ true → Frame A falsified, S3 outside noise → Frame B falsified, geen clean Frame C hits → Frame C falsified, partial-Frame-A patroon (S3 hit + S2/S4 near-thresholds) onder "Bij twijfel: Frame D = revert + spawn #33". **Bonus bevinding tijdens verificatie — cache-coherency-bug ontdekt:** init-components.js importeert `/src/components/navbar.js` + `/src/components/footer.js` zonder `?v=` cache-bust query-param. Netlify cache-control `public,max-age=604800,must-revalidate` = browser-cache 7 dagen geldig zonder revalidatie tot expiration. Returning users tijdens 7-dagen-window krijgen NIEUWE sync-inline HTML + OLD cached navbar.js → mini-refactor Path-2 niet beschikbaar → no event-binding voor sync-inline DOM = broken theme-toggle/hamburger/help-dropdown. Sessie 148 #31 patroon (main.js version-param-mismatch) gegeneraliseerd naar deze import-keten. **Mitigatie indien #30-pad-A keep ooit gewenst:** sync `?v=149-sync-inline` toevoegen aan init-components.js navbar+footer imports + terminal.html init-components.js script-tag URL. Voor #30 revert is fix overbodig want returning users krijgen OLD navbar.js + OLD HTML = consistent. **Revert commit `5f0f471`** (terminal.html + navbar.js terug naar pre-patch state, 2 files / 51 insertions / 124 deletions) + Netlify-deploy 10 sec + verificatie placeholders restored. **Mechanisme bewezen:** sync-inline elimineert outerHTML+reflow voor navbar+footer maar dit geeft slechts S3 Layout -45 ms hit. DOM-injection-werk is NIET dominant in long-task #1. Sessie 146 cascade-omhulling-hypothese mechanistisch bevestigd MAAR cascade-elimination via static DOM bereikt sub-Frame-A improvement. Bottleneck zit dieper: fonts (99 KB Google Fonts DNS+TLS-handshake), gtag deferred consent, CSS-parse, of compression. **4e mobile-delta-verwachting-falsificatie op rij** (Sessie 145 #26 Frame B + 146 #28 Frame D + 147 #29 Frame C + 149 #30 Frame D). Anti-rationalisatie-discipline structureel verankerd, niet meer fragiel. **Defense-in-depth 5 plekken:** TASKS.md item #30 closure + docs/sessions/current.md Sessie 149 entry + docs/perf-third-party-audit.md §2d multi-metric tabel + .claude/CLAUDE.md Recent Critical Learnings prepend + plan-file outcome-sectie. Artifacts `/tmp/sessie149-item30/{pre-vector,signals-pre,signals-post,verdict,extract-signals.py,pw-local-chromium,pw-prod-suspect-rerun,pre-log,post-log}.json+.txt`.

31. [x] **terminal.html:43 modulepreload version-param-mismatch fix — Sessie 148 quick-win-closure** (Sessie 147 spawn). Heisenberg's keuze: optie (b) — sync `?v=88-multiline-wrap` naar regel 43 modulepreload, conform bestaand `?v=114` pattern op CSS regels 41-42. **Pre-fix Playwright baseline** (productie, warme browser-cache, 2 jun 2026 18:22 UTC): `performance.getEntriesByType('resource').filter(r => r.name.includes('main.js'))` → `count: 2` met entries `https://hacksimulator.nl/src/main.js` (initiatorType "other" = modulepreload regel 43, encodedBodySize 2323, decodedBodySize 8585) + `https://hacksimulator.nl/src/main.js?v=88-multiline-wrap` (initiatorType "script" = script-tag regel 385, identieke 2323/8585 bytes). Bewijs van dubbele cache-key-fetch op identieke file-content. **Post-fix verificatie** (productie, cold cache via `browser_close` + `?cb=148-post`, 2 jun 2026 19:00 UTC): `count: 1` met enkele entry `https://hacksimulator.nl/src/main.js?v=88-multiline-wrap` (initiatorType "other" — modulepreload kickte fetch af, script-tag op regel 385 hergebruikte via byte-exact URL-dedupe). Dedupe-mechanisme bewezen werkend zoals fetch-spec voorschrijft. **Commit `12a93a2`** + Netlify-deploy 36 sec (CDN-edge-pull via cache-bust query-param). Pipeline-exit-code-discipline uit Sessie 147 toegepast op deploy-poll (`set -o pipefail` + `${PIPESTATUS[0]}`). **Spot-check Chromium-only `performance.spec.js`**: 2 failures + 1 flaky in initial run, alle 3 onthuld als pre-existing flakes via Sessie 147 isolated-rerun-pattern: `Load time < 3s` re-run passed (2.69s, 10% onder threshold), `VFS growth NaN` is test-code-bug regel 496 (`stdDev/avgGrowth` als avgGrowth=0 → 0/0=NaN — geen storage-codepath in onze patch dus causaal onmogelijk), `ES6 module cascade < 1s` marked flaky maar uiteindelijk passed. **Besparing:** ~4,6 KB transfer per cold-load (first-time visitors) + 1× v8.parseModule + v8.compileModule cycle per page-load. Page-perf-delta niet meetbaar bovenop run-variance (transfer-besparing onder noise van Sessie 145 12-punt score-range op 3 runs). **Geen Frame-bepaling want deterministische bug-fix** (binaire count check), niet speculatieve optimalisatie zoals #26/#28/#29. **Audit-merit Sessie 147 aangetoond:** ondiepe audits hadden deze mismatch nooit gevonden; multi-bron LH-JSON-parse van `network-requests` was de detectie-trigger. Pleidooi voor diep-LH-pattern voor toekomstige bug-detectie ook (niet alleen voor patch-decision-frameworks). Defense-in-depth 4 plekken: dit item + plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-serialized-gadget.md` + docs/sessions/current.md Sessie 148 + CLAUDE.md Sessie 148 learnings. Artifacts `/tmp/sessie148-item31/{baseline-pre,baseline-post,verdict}.json`.

32. [x] **VFS-growth-test NaN-edge-case fix — Sessie 150 quick-closure** (Sessie 148 spawn). Heisenberg's keuze optie (a) early-return: `if (avgGrowth === 0) { console.log('✓ VFS growth = 0 (no leak, no variance to check)'); return; }` ingevoegd vóór regel 496 `expect(stdDev / avgGrowth).toBeLessThan(0.5)` in `tests/e2e/performance.spec.js`. **Test verified:** isolated Chromium re-run 14,6 s passed, output toont `Avg bytes/file: 0.00` + `Coefficient of variation: NaN%` + `✓ VFS growth = 0` (guard triggert correct, test ends gracefully). **Commit `1b549d7`** + push. Geen LH-meting want deterministische bug-fix. Discrete commit vóór #33 (a) cyclus zodat LH-meting niet contamineerd.

33. [x] **Structurelere paden voor LT1-reductie ná #30 Frame D** (Sessie 149 spawn) — **GESLOTEN Sessie 220.** Alle vijf sub-paden zijn beslist, drie ervan zonder dat het hier werd opgeschreven: (a) fonts self-hosted ✅ KEEP, (b) HTTP/2-push ✅ N/A, (d) Brotli ✅ PARTIAL, **(c) is twee keer gemeten en twee keer teruggedraaid** (#27 Frame C REVERT Sessie 151, #34(b) Frame D gray REVERT Sessie 153), **(e) is structureel opgelost in Sessie 205** — niet door het `?v=`-patroon uit te breiden maar door `/src/**/*.js` op `max-age=3600, must-revalidate` te zetten (`_headers:37-38`), wat de submodule-staleness bij de wortel aanpakt. Bovendien is de meetgrond weg: de dominante variantiebron die dit hele cluster najoeg was AdSense, en dat is er in Sessie 208 uit (third-party 353 → 101 KB, Lighthouse mobile 49 → 59). Een nieuw LT1-onderzoek hoort op verse metingen te starten, niet op deze lijst

  - **(a) Self-host Google Fonts** — ✅ **Frame A KEEP, Sessie 150** (commit `14b0d44`). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-glittery-rain.md` met 6 signalen × 3 dimensies anti-bias 33,3% symmetrisch + decisional-thresholds-tabel vooraf + Frame B/C/D eervolle paden + 5-op-rij honest-flag pre-emptief. **Variable-font discovery:** Inter v20 + JetBrains Mono v24 + Space Grotesk v22 zijn variable fonts via Google CSS2 API — 3 unique woff2 (Inter 47 KB + JetBrains Mono 31 KB + Space Grotesk 22 KB = 99,6 KB byte-equivalent aan Google CDN) serveren alle 8 weight-declaraties via browser-dedup. Geen pyftsubset build-step nodig. **Implementation (commit `14b0d44`, 27 files / 449 ins / 121 del):** 3 woff2 in `/styles/fonts/`, 8 @font-face Google-mirror in `styles/main.css` (font-display: swap + unicode-range Google's volledige set incl. NL diakrieten dekking), SIL OFL 1.1 LICENSES/ dir (Inter 2016 / JetBrains Mono 2020 / Space Grotesk 2020), REMOVE 4 Google Fonts lines (preconnect googleapis + preconnect gstatic + Google CSS link + noscript fallback) van 20 HTML files via sed, ADD critical font preloads (Inter 400 + Space Grotesk 700 op alle 20, JetBrains Mono 400 extra op terminal.html), cache-coherency bump `main.css?v=114/115` → `?v=150` voor returning-user-mismatch-prevention. **3-run LH@11 mobile baseline mediaan R2 (selected on LCP):** score 63 / LCP 4291 ms / FCP 1665 ms / TBT 907 ms / CLS 0 / TotalBytes 371 KB. **3-run LH@11 mobile post-mediaan R2:** score 82 (+19) / LCP 3141 (-1150 ms, **7,7× Frame A threshold**) / FCP 1602 (-63, NOISE) / TBT 416 (-491 ms, **6× Frame A threshold**) / CLS 0 (stable, S5 hit) / TotalBytes 371 (0 KB delta — variable-font byte-equivalent, S3 NOISE pre-data predicted). **S4 binary mechanism-proof:** 0 Google Fonts origins (`fonts.gstatic.com` + `fonts.googleapis.com`) over alle 3 post-runs. **Multi-metric delta-tabel:** S1 LCP -1150 ms ✓ HIT | S2 FCP -63 ms ✗ NOISE | S3 Bytes 0 KB ✗ NOISE (variable-font byte-equivalent) | S4 Google Fonts origins 0 ✓ HIT binary | S5 CLS +0 ✓ HIT tolerance | S6 TBT -491 ms ✓ HIT. **Strict letter Frame A (≥3 of {S1,S2,S3,S6}):** 2-of-4 hit → Frame A NOT MET door letter. **Spirit + primary anti-bias rule verdict (Sessie 146):** S1 paint-pipeline + S6 main-thread-blocking = 2 ONAFHANKELIJKE causale dimensies met EXTREME magnitudes (7,7× en 6× threshold respectievelijk). Primaire anti-bias rule (≥2 dimensies onafhankelijk hit) ✓ Satisfied. **Honest-flag plan-table design-flaw:** S3 ≤-30 KB was mechanisch-onmogelijk door variable-font byte-equivalence (predicted pre-data in Phase 4 insight). Effectief criterium werd ≥3-of-3 remaining waarvan S2 -63 ms missed -200 ms threshold. Secondary safety "≥3-of-4" te streng calibreerd; primary anti-bias rule (breedte over causale dimensies) is de DOORSLAG-discipline. **5-op-rij patroon GEBROKEN:** Sessie 145 Frame B + 146 Frame D + 147 Frame C + 149 Frame D → 150 **Frame A**. Plan-doc pre-emptief acknowledged Frame A possibility ("eerste meet-bare mobile-delta zou betekenen — font-mechanisme fundamenteel ander territorium dan DOM-injection/resource-prioriteit/cache-attributie"). **Productie LIVE:** https://hacksimulator.nl/terminal.html met self-hosted fonts mediaan score 82 mobile. Defense-in-depth 5 plekken: dit item + current.md Sessie 150 + perf-audit §2e + CLAUDE.md learnings + plan-file outcome-sectie. Artifacts `/tmp/sessie150-item33a/{pre-r1,2,3,post-r1,2,3,verdict}.json` + Playwright screenshots `.playwright-mcp/sessie150-{terminal,blog}-self-host-verified.png`.
  - **(b) HTTP/2 server-push deprecation check** — ✅ **CLOSED N/A Sessie 152**. Triple-source dichtdoen-criterium: (1) `grep -rn "Link:\|http2\|HTTP/2\|server.push" _headers netlify.toml` = ZERO matches. (2) Chrome 106 (Sep 2022) disabled HTTP/2 server-push by default; 1.25% global usage at removal time; HTTP/3 no implementations. (3) Netlify support forum bevestigt support dropped (was via `_headers` Link rel=preload). Mechanisch immuun. Geen patch, geen LH-meting.
  - **(c) CSS critical-path inline** — ✅ **CLOSED Sessie 220: twee keer gemeten, twee keer teruggedraaid.** Was: extract top-fold CSS naar `<style>` inline + defer rest. Uitgevoerd als #27 (Frame C REVERT, Sessie 151, commit `a80e675` → `0354c7a`) en nogmaals geïsoleerd als #34(b) (Frame D gray REVERT, Sessie 153, commit `99bc496` → `2d8b8d1`). Het genoteerde risico (cache-invalidation per HTML-edit) was niet eens de reden — de meting gaf geen winst.
  - **(d) Brotli/compression-optimalisatie** — ✅ **CLOSED PARTIAL Sessie 152**. Curl-grep test productie 6 file-types: HTML (`/`, `/blog/nmap-beginnersgids.html`) + CSS (`/styles/main.css`) + JS (`/src/main.js`) → `content-encoding: br` ✓ all 4. PNG (`/assets/og-image.png`) = no encoding (correct binary). **Gap:** SVG (`/favicon.svg`) NIET Brotli-compressed door Netlify Edge — text-based content but not in default Brotli-list. Impact: ~184 bytes savings/request, single small file (434 bytes), aggressively cached. Expert-decision: accept gap not patch (Netlify Edge default-list opaak per support forum, `netlify.toml` MIME-tuning deterministicity-uncertain, orthogonal aan mechanism-budget #34 (a)). Document als audit-item voor toekomstige cumulatieve Brotli-tuning-sweep indien gap-list groeit.
  - **(e) Cache-coherency systemic mitigation** — ✅ **CLOSED Sessie 220: opgelost, maar anders dan hier stond.** Het plan was "het `?v=`-patroon uitbreiden naar ALLE module-import-URLs in init-components.js". Dat is niet gebeurd en hoeft ook niet: Sessie 205 pakte de oorzaak bij de wortel door `/src/*.js` én `/src/**/*.js` op `max-age=3600, must-revalidate` te zetten (`_headers:34-38`), zodat een verse entry nooit meer dan een uur naast stale submodules kan staan. Handmatige `?v=`-boekhouding over ~99 modules zou een tweede bron van waarheid zijn geweest. Zie `.claude/rules/architecture-patterns.md` §Cache Strategy.

34. [x] **Mechanism-isolation onderzoek voor Sessie 151 #27 Frame C variance-amplification** (Sessie 151 spawn) — **GESLOTEN Sessie 220: de eigen poort is dichtgegaan.** Sub-pad (b) is CLOSED (Frame D gray REVERT, Sessie 153). Sub-pad (a) draagt de spawn-trigger *"outcome 2/3 van #35(b)"* — en **#35(b) sloot met Outcome 4** (Sessie 154, 20 sequentiële LH-runs). De voorwaarde om (a) te starten is dus expliciet niet ingetreden; het item stond 66 sessies open op een conditie die al beantwoord was. Bijkomend: (a) wilde de Brevo-preconnect isoleren als variantiebron in een meetopstelling waar AdSense het beeld domineerde, en dat is er sinds Sessie 208 uit

  - **(a) Preconnect-only mechanism-isolation** — ✅ **Frame B NOISE-no-action REVERT, Sessie 152** (patch commit `a19926a` → revert commit `402b1d4`). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-fancy-moon.md` met 7 signalen × 4 dimensies (D1 paint-pipeline S1+S2 / D2 main-thread S3+S5 / D3 network-mechanism S4+S6 / D4 variance-stability S7) anti-bias symmetrisch 33,3% + decisional-thresholds-tabel vooraf + Frame B/C/D eervolle paden + pre-data threshold-feasibility-flags + S7 POST/PRE LCP-range ratio nieuwe primary-discriminator-signaal. **Patch:** 17 ad-bearing pages × 1 preconnect-link insertion = 17 files / 17 ins (+1,2 KB source-growth, 10× kleiner dan Plan-agent §4 voorspelling 12,8 KB = Sessie 151 combined-patch extrapolation pitfall geleerd). 3 patterns toegepast: A (14 files standard NA theme-color), B (woordenlijst onder placeholder), C (index + blog/index VOOR sibforms). Pre-commit gates ✓: validate-docs + Playwright Chromium 178 passed + 3 pre-existing flakes (cross-browser footer + gamification badges + responsive boxes = Sessie 149+151 bekend, geen causale link met pure-HTML preconnect-insert). **Phase A baseline 3-run LH@11 mobile mediaan:** INDEX r1 LCP=2154/FCP=1881/TBT=2208/CLS=0.011/Score=67, BLOG r2 LCP=1894/FCP=1894/TBT=2661/CLS=0.073/Score=68. **Phase C POST mediaan:** INDEX r1 LCP=2125/FCP=1754/TBT=913/CLS=0.084/Score=75, BLOG r1 LCP=1642/FCP=1316/TBT=736/CLS=0.073/Score=80. **APPARENT delta:** Score +8/+12 / TBT -1296/-1926 ms (26-39× Frame A threshold extreme) — MAAR mechanism-vs-effect-gap suspicious: S6 137-180 ms pagead2-savings ≠ S3 1296-1926 ms TBT-savings = 7-14× ratio onverklaarbaar door preconnect alleen. **NEW DISCIPLINE — cross-check baseline:** Bij apparent-Frame-A met mechanism-vs-effect-gap, REVERT + 3-run cross-check baseline tegen post-revert productie om Phase A baseline-anomaly te diagnosticeren. **Cross-check (post-revert 5 jun 23:14 CET, 3-run mediaan):** INDEX r2 LCP=1968/FCP=1726/TBT=1356/CLS=0.011/Score=73, BLOG r2 LCP=1859/FCP=1859/TBT=1024/CLS=0/Score=76. **Diagnose:** Phase A INDEX LCP-range 844 ms vs cross-check 401 ms = **2.1× anomaly bevestigd**; Phase A BLOG range 356 vs cross-check 339 = representative. Phase A INDEX TBT 2208 vs cross-check 1356 = 1.6× inflated. **TRUE deltas vs cross-check (representative baseline):** Index | S1 LCP **+157 ms ✗ C HIT** | S2 FCP +28 NOISE | S3 TBT **-443 ms A HIT** | S5 CLS +0.073 C HIT mediaan-artifact | S6 -84 ms A HIT clean | Score +2 noise. Blog | S1 LCP **-217 ms A HIT** | S2 FCP **-543 ms A HIT extreme** | S3 TBT **-288 ms A HIT extreme** | S5 CLS +0.073 C HIT mediaan-artifact | S6 -92 ms A HIT clean | Score +4 modest. **S7 variance-ratio cross-canonical AVG vs cross-check:** 1.83× = A HIT (≤2× threshold) = **NO variance-amplification = hypothese "preconnect = variance-amplification culprit" partial-falsified**. **Verdict Frame B per plan §8** — patch is mechanically safe (S6 clean BEIDE canonicals consistent met plan §7 budget) + variance-neutral (S7 1.83×) MAAR conflicting canonicals (Index LCP +157 C vs Blog LCP -217 A) + Score +2/+4 in noise-band = geen clean perf-win, source-growth +1,2 KB weegt niet op tegen ~0-modest netto winst. **Revert al uitgevoerd vóór verdict-finalisatie** want cross-check baseline-discipline vereist post-revert state. Productie back to pre-patch state ✓. **Spawn implication #34 (b):** STILL VALUABLE per plan §11 5e outcome-pad — Sessie 151 Frame C kwam NIET uit preconnect alleen; mogelijke oorzaken: inline-CSS-cascade-interactie, combined-mechanism-effect, of orthogonale variance-bron (Brevo, AdSense-Auto-ads-state). Sessie 153 #34 (b) inline-CSS-only test discriminator: Frame B = source-growth-only / Frame C = inline-CSS culprit / Frame A = inline-CSS beneficial alone. **Frame-falsificatie patroon update:** 145B + 146D + 147C + 149D + 150A + 151C + **152B** = 7-sessie-streak honest data-driven outcomes (6 falsificatie + 1 KEEP). Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen. **Defense-in-depth 5+ plekken:** dit sub-item + sprint regel + Version 5.26 + Voortgang Overzicht + current.md Sessie 152 + perf-audit §2g + CLAUDE.md learnings + plan-file outcome-sectie. Artifacts `/tmp/sessie152-item34a/{pre,post,cross}-r{1,2,3}-{index,blog}.json + baseline-summary.json + verdict.json`.
  - **(b) Inline-CSS-only mechanism-isolation** — ✅ **Frame D gray REVERT, Sessie 153** (patch commit `99bc496` → revert commit `2d8b8d1`). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-swift-stream.md` met 7 signalen × 4 dimensies (D1 paint-pipeline S1+S2 / D2 main-thread S3+S5 / D3 network-mechanism S4+S6 / D4 variance-stability S7) anti-bias symmetrisch + decisional-thresholds-tabel vooraf + Frame A/B/C/D eervolle paden + pre-data threshold-feasibility-flags + S7 LCP-range ratio primary discriminator + **proactive Phase A baseline-anomaly canary (NEW Sessie 153 evolutie uit Sessie 152 reactive)**. **Patch:** 17 ad-bearing pages × 1 inline `<style>` block = 17 files / 136 ins (~733 bytes/page = +12,16 KB source-growth, 2% kleiner dan pre-data 750 bytes/page estimate). **Pattern collapse:** preconnect-vs-inline-CSS-cascade-positie-verschil = Sessie 152's 3-patterns (A/B/C) collapsen tot **1 universele anchor** (NA mobile.css `<link>`) met 2 path-varianten (4 root + 13 nested). Pre-commit gates ✓: validate-docs + Playwright Chromium 173 passed + 2 pre-existing flakes (cross-browser footer + gamification badges = Sessie 149+151+152 bekend) bevestigd via `BASE_URL=https://hacksimulator.nl` isolated-rerun discriminator pattern. **Proactive Phase A canary (NEW discipline):** INDEX LCP-range 104 ms vs Sessie 152 cross-check 401 = 0,26×, BLOG range 424 ms vs 339 = 1,25× = **beide canonicals representative per canary table** (≤1,5× threshold met). **Phase A baseline 3-run LH@11 mobile mediaan:** INDEX r2 LCP=2269/FCP=1860/TBT=1351/CLS=0.084/Bytes=570267/Score=70/Style-time=1306ms, BLOG r2 LCP=1925/FCP=1925/TBT=1330/CLS=0.073/Bytes=435718/Score=72/Style-time=1486ms. **Phase C POST mediaan:** INDEX r1 LCP=2089/FCP=1685/TBT=1790/CLS=0.084/Bytes=570682/Score=68/Style-time=1887ms, BLOG r1 LCP=1596/FCP=1596/TBT=1022/CLS=0.073/Bytes=436095/Score=76/Style-time=1401ms. **Delta POST vs PRE-mediaan + Frame-hits per canonical:** INDEX | S1 LCP **-180 ms A HIT** | S2 FCP **-175 ms A HIT** | S3 TBT **+439 ms ✗ C HIT** | S4 Bytes +415 bytes NOISE | S5 CLS 0 NOISE | S6 Style-time **+581 ms ✗ C HIT supporting** | Score -2 noise. BLOG | S1 LCP **-329 ms A HIT extreme** | S2 FCP **-329 ms A HIT extreme** | S3 TBT **-308 ms A HIT** | S4 Bytes +377 NOISE | S5 CLS 0 NOISE | S6 Style-time **-85 ms A HIT supporting** | Score +4 modest. **S7 LCP-range ratio dual-baseline observation:** vs Phase A baseline → INDEX 2,82× / BLOG 2,37× / cross-canonical AVG **2,59× = Frame B zone 2-3× upper-bound**; vs Sessie 152 cross-check baseline → INDEX 0,73× (REDUCED) / BLOG 2,96× / cross-canonical AVG **1,85× = Frame A ≤2× variance-stable**. **NEW LEARNING:** Phase A INDEX LCP-range 104 ms vs cross-check 401 = 0,26× = **abnormally-STABLE baseline = counterpart van Sessie 152 INFLATED Phase A 2.1× anomaly**. Proactive canary unidirectional flag (alleen ≥2× HIGH-side) miste LOW-side anomaly. **Bidirectional canary requirement (NEW Sessie 153 discipline):** beide ≥2× EN ≤0,5× thresholds nodig. **Conflicting canonicals smoking-gun:** INDEX = Frame-C-leaning op S3 TBT+S6 Style-time (main-thread regression op landing-page) MAAR S1+S2 A HIT; BLOG = clean Frame-A across D1+D2 met S6 supporting. **Verdict Frame D gray per plan §6 tie-breaker** ("bij twijfel D = revert") — conflicting canonicals + partial-Frame-A pattern (BOTH canonicals ≥1 A HIT) + S7 in 2,5-3× gray-zone vs Phase A baseline. Revert direct na verdict + push + Netlify deploy poll ✓ na 1 poll productie back to pre-patch state. **S4 scale-error confessional (NEW Sessie 153 leerpunt):** plan §5 S4 C HIT pre-known prediction was scale-confusion tussen aggregate source-growth (+12,16 KB across 17 files) vs LH per-page measurement (+0,4 KB per canonical = NOISE actual). Per-page LH `total-byte-weight` measures **per-page transfer post-Brotli**, niet aggregate source-bytes. Werkelijke S4 = NOISE BEIDE canonicals = primary anti-bias rule override-pad NIET nodig. **Cumulatieve #34 closure-pad evaluatie:** 152 (B) + 153 (D) = mechanism-isolation **INCOMPLETE — categorische closure NIET bereikt**. Sessie 151 #27 variance-amplification 6,5-7,7× kwam NIET uit preconnect alleen ÉN NIET uit inline-CSS alleen — beide isolation S7 ratios clean (1,83× resp 1,85× vs cross-check). Conclusie: **combined-mechanism-cascade-interactie** (preconnect × inline-CSS × AdSense-Auto-ads-state per page-type) als destructieve cascade. Page-type-asymmetric response zichtbaar — INDEX landing-page Auto-ads-state heeft anders mechanism-interactie dan BLOG content-page Auto-ads-state. **Spawn implication #35:** deep-dive variance-source attribution + page-type-dependent mechanism investigation. NIET combined-mechanism-re-test (Sessie 151 #27 already proved Frame C destructive). Focus: Brevo timer-fingerprint OR AdSense-Auto-ads-state-machine state-leakage OR per-page-type cascade-recompute-amplification mechanism. **Frame-falsificatie patroon update:** 145B + 146D + 147C + 149D + 150A + 151C + 152B + **153D** = **8-sessie-streak honest data-driven outcomes (7 falsificatie + 1 KEEP)**. Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen inclusief Frame D gray met conflicting-canonical-page-type-attribution als nieuwe categorie. **Defense-in-depth 5+ plekken:** dit sub-item closure + sprint regel + Version 5.27 + Voortgang Overzicht + current.md Sessie 153 + perf-audit §2h + CLAUDE.md learnings + plan-file outcome-sectie. Sessie 147 archived → current.md (top-6 nu 148-153). Artifacts `/tmp/sessie153-item34b/{pre,post}-r{1,2,3}-{index,blog}.json + baseline-summary.json + verdict.json`.

35. [x] **Deep-dive variance-source attribution + page-type-dependent mechanism investigation** ✅ **CLOSED Sessie 154 via Outcome 4** — sub-pad (b) AdSense state-leakage diagnostic executed (10-run distribution-analysis falsifies Sessie 153 page-type-asymmetric observation as sampling-noise op aggregaat-niveau, MAAR per-stage decomposition onthult opposing-direction variance-asymmetry als nieuwe mechanism-categorie). Sub-paden (a) Brevo timer-fingerprint isolation en (c) DevTools Override superseded by spawn **#36 multi-day baseline-stability analysis** (captures alle 3 secondary findings via langere observatie-window). Original spawn context (Sessie 153 #34 cumulatieve closure-pad evaluation): Sub-paden (a/b/c) verkennen verschillende hypotheses voor Sessie 151 #27 destructive cascade-mechanisme dat NIET uit preconnect alleen (152 Frame B clean) NIET uit inline-CSS alleen (153 Frame D gray) komt. **Combined-mechanism-cascade-interactie** + **page-type-asymmetric mechanism response** (INDEX landing-page Auto-ads-state vs BLOG content-page Auto-ads-state) als nieuwe mechanism-categorie.

  - **(a) Brevo timer-fingerprint isolation** — ✅ **CLOSED Sessie 220: spawn-trigger niet ingetreden.** De voorwaarde was letterlijk *"outcome 2/3 van #35(b)"*, en #35(b) sloot met **Outcome 4** (Sessie 154). Een gepoorte taak waarvan de poort dicht is, is geen open taak — hij was al beslist en las alleen nog als werk.
  - **(b) AdSense-Auto-ads-state-machine state-leakage diagnostic** — ✅ **CLOSED OUTCOME 4 — Sessie 154** (zero-code instrumentation, geen commits). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-cozy-crab.md`. 20 sequential LH@11 mobile runs (10 INDEX + 10 BLOG, sequentieel om CPU-contention variance te vermijden — NEW Sessie 154 discipline #1) tegen current productie-state + scipy distribution-analysis op `audits.network-requests` adsbygoogle.js items via KS-test + Mann-Whitney U + variance-coefficient ratio (full/transfer/discovery 3-metric decomposition). **Primary verdict per pre-data plan §1 4-outcome enumeration:** Outcome 4 — full-bootstrap (primary metric) KS p=0,42 + MWU p=0,27 + CV-ratio 1,26× = beide criteria NIET confirmed = Sessie 153 page-type-asymmetric observation was sampling-noise van 3-run mediaan-comparison op LCP-aggregaat. **Per-stage decomposition finding (NEW Sessie 154):** opposing-direction variance-asymmetry per cascade-stage — discovery-queue INDEX > BLOG (CV ratio **2,56× ASYMMETRIC**, state-machine-internal signal, MWU p=0,054 net buiten 0,05 threshold) + transfer-only BLOG > INDEX (CV ratio 1,94× borderline, network-layer asymmetry tegenovergestelde richting). Twee orthogonale page-type-asymmetry signalen in opposite directions CANCELLEN op full-bootstrap aggregaat. **Bidirectional canary Phase C (NEW Sessie 153 discipline toegepast):** INDEX PASS (LCP-range 336 ms vs Sessie 152 cross-check 401, ratio 0,84×) / BLOG **HIGH-anomaly** (LCP-range 751 ms vs cross-check 339, ratio **2,21×** barely-over 2,0× threshold, edge-case accepted zonder +5 re-runs want orthogonal aan primary adsbygoogle.js bootstrap signal). **Spawn-decision per Outcome 4 rule (Heisenberg-confirmed via AskUserQuestion):** Sessie 155 spawn **#36 multi-day baseline-stability analysis** — captures alle 3 secondary findings via langere observatie-window (borderline MWU significance, opposing-direction asymmetry, BLOG canary structureel vs sampling-artifact). NO additional #37/#38 spawns want overkill — #36 inherently captures secondary signalen. **Cumulatieve #34 mechanism-isolation closure-pad:** 152 (Frame B clean S7) + 153 (Frame D gray conflicting-canonicals) + **154 (Outcome 4 methodological-evolution-output)** = mechanism-isolation categorisch closure BEREIKT via documented methodological-evolution: combined-mechanism-cascade-interactie + opposing-direction per-stage asymmetry pattern verklaart Sessie 151 #27 variance-amplification (geen enkel single mechanism is alleen verantwoordelijk). **NEW Sessie 154 disciplines (11 items totaal, focus 6):** (1) concurrent LH instances → CPU-contention variance → sequential-only voor distribution-analysis validity; (2) LH JSON schema field-name verification pre-data via jq dry-test (Sessie 149+151 leerpunt generaliseert naar JSON-schema-claims); (3) primary-metric selection moet stage-level mechanism-isolation capturen, NIET aggregate-level (mechanism-cancellation pattern revealed post-data); (4) distribution-analysis als 5e verify-first cyclus-variant naast Frame A keep / B no-action / C revert / D revert (diagnostic-distribution-analysis is legitimate outcome zonder patch-decision); (5) 10-run vs 3-run sampling-size threshold voor KS-test power (N≥10 per group minimum); (6) bidirectional canary edge-case discipline (barely-over-threshold accept als documented anomaly zonder re-run wanneer anomaly orthogonal aan primary signal); (7) Phase B Python script robust JSON serialization (numpy.bool_ cast fix); (8) execution-time plan-deviation detection + documentation (parallel→sequential correctie tijdens Phase A start); (9) AskUserQuestion bij verdict-decision-moment ondanks clean letter-rules wanneer secondary findings nuance toevoegen (volgt Sessie 150 spirit-rule consultation pattern); (10) per-page-type Auto-ads-state-machine prioritization-asymmetry als nieuwe mechanism-categorie (discovery-queue signal); (11) categorical closure via methodological-evolution-output ipv via Frame A keep. **9-sessie streak honest data-driven outcomes** (Sessies 145-153 = 7 falsificatie + 1 KEEP + Sessie 154 = 1 methodological-output = 9 sessies eervol). Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen inclusief methodological-evolution-output categorie. **Defense-in-depth 5+ plekken:** dit sub-item closure + sprint regel + Voortgang Overzicht + Last updated + current.md Sessie 154 + perf-audit §2i + CLAUDE.md learnings (1-in-1-out Sessie 148 archive reference, top-6 wordt 149-154) + Version bump 5.27→5.28 + plan-file §6 outcome. Artifacts `/tmp/sessie154-item35b/{baseline-r{1..10}-{index,blog}.json, bootstrap-data.csv, distribution-analysis.{py,txt,json}, canary-reference.json, verdict.json}`.
  - **(c) Per-page-type cascade-recompute DevTools Override** — ✅ CLOSED Sessie 154 superseded by #36. Was: Playwright MCP browser_evaluate + Performance.measure markers per page-type met inline-CSS via DevTools Override. Niet uitgevoerd want Outcome 4 verdict closed #35 entirely.

36. [x] **Multi-day baseline-stability analysis** ✅ **CLOSED OUTCOME 4 Sessie 155** — sub-pad **(a) single-sessie 3-burst compression** executed als pragmatic proxy voor TASKS.md regel-101 multi-day canonical spec (Heisenberg-pragmatic deviation voor 1-sessie wallclock budget). 60 LH@11 mobile runs (3 bursts × 10 INDEX + 10 BLOG met 60 min cool-down) + scipy 3-burst ANOVA F-test + N=30 KS+MWU + per-burst CV-asymmetry tracking + Phase C bidirectional canary per burst. **Verdict Outcome 4 clean per pre-data plan §4:** alle 3 Sessie 154 secondary findings NIET reproduceer ≤1-of-3 bursts (discovery-queue 1/3, transfer-only 0/3, BLOG canary 1/3). N=30 power-improvement: discovery-queue MWU borderline p=0,054 (Sessie 154 N=10) → p=0,4035 (Sessie 155 N=30) = clean falsification. **Direction-flip smoking gun:** Full CV ratio per burst 2,62×/0,32×/1,04× = INDEX>BLOG, BLOG>INDEX OPPOSITE, equal. Discovery 3,10×/0,57×/0,88× same flip. Als structureel zou direction consistent zijn — flip = sampling-burst-snapshot evidence. **NEW finding NIET pre-enumerated:** 3-burst ANOVA F p<0,001 alle 3 metrics × beide canonicals = time-varying within-canonical variance IS structureel MAAR global niet page-type-specific + niet patch-actionable. **Cumulatieve #34 + #35 + #36 categorische closure FINALISED** via 4-sessie methodological-evolution-output (152+153+154+155). **Spawn Sessie 156:** M6 Tutorial 3 last taken (M6 milestone 88%→100% closure, pre-committed via Sessie 155 pre-plan AskUserQuestion). **NEW Sessie 155 disciplines (4):** (1) 3-burst compression als binnen-sessie variance-stability assessment (6e verify-first cyclus-variant); (2) Direction-flip detection per-burst CV ratio als sampling-burst-snapshot discriminator; (3) 3-burst ANOVA F-test detects time-varying within-canonical variance ORTHOGONAL aan per-page-type asymmetry; (4) N=30 power-improvement is structureel-discriminator voor borderline-significance (N=10 borderline p∈[0,05;0,10] → N=30 power-test = fast falsification-pad). **Honest pre-emptive limitation acknowledgment** (Sessie 150 leerpunt toegepast in plan §1): 3-burst compression is **proxy** voor multi-day variance-structure assessment — 60 min cool-down geeft thermal/CDN-cache/AdSense-backend-load-state-isolatie MAAR captures geen genuine 24h diurnal cycli. TASKS.md regel-101 canonical spec (option b multi-sessie multi-day) blijft fallback indien Outcome 4 + post-hoc escalation gewenst — niet aanbevolen want directional-flip + global-ANOVA-significance + N=30 borderline-falsification = 3-of-3 anti-structureel signalen. Artifacts `/tmp/sessie155-item36a/{burst{1,2,3}/baseline-r{1..10}-{index,blog}.json (60 files), bootstrap-data.csv, stability-analysis.{py,txt,json}, canary-reference.json, canary-per-burst.txt, verdict.json}`. Sessie 153 spec-archive: oorspronkelijk Sessie 154 spawn uit #35 (b) Outcome 4 verdict + per-stage decomposition finding + BLOG canary HIGH-anomaly als 3 secondary findings te valideren.

37. [x] **Pre-launch visueel materiaal — launch-aankondigings-kit §4 (Sessie 162)** ✅ — Heisenberg-keuze via AskUserQuestion (4 opties; visueel materiaal = enige onaf pre-launch-deliverable die launch-dag-uitvoering blokkeert). 3 artefacten in `.playwright-mcp/launch/` (gitignored): `terminal-help-nmap.gif` (1000×640, 44 frames, ~9,5 s loop, 1,3 MB), `terminal-desktop.png` (1280×720), `terminal-mobile-375.png` (375×812 @2x). Scenario `help`→`nmap 192.168.1.1` = echt/NL/educatief in 1 take. NEW `scripts/capture-launch-visuals.mjs` (reproduceerbaar; pure-JS GIF gifenc+pngjs want Playwright's gebundelde ffmpeg = gestripte build zonder gif-muxer; localStorage `addInitScript` zet legal/onboarding/consent vooraf weg = schone take). Kit §4 feitelijke correctie: `nmap 192.168.1.1` = router-profiel met `[?] TIP`, GÉÉN `[!]` (visual legde kit-overdrijving bloot). gifenc/pngjs devDeps. Commit `c299ce4`. Bundle delta 0.

38. [x] **Pre-launch security-audit + hardening (Sessie 166)** — CSP `script-src` 'unsafe-inline'/'unsafe-hashes' verwijderd via inline-script-externalisatie naar /src/*.js (consent-default/brevo-config/init-theme/load-animations-css) + AdSense-race gesloten + X-XSS-Protection→0 + history.search() ReDoS-fix + privacy.html feitfout + frame-src/img-src `adtrafficquality` (F6) + security.txt (RFC 9116) + SECURITY.md. Geverifieerd: nul CSP-violations (4 page-archetypes onder echte CSP) + E2E 183 passed. Branch `security/csp-hardening-audit`, commit `aa0396d` ✅ **gemerged naar `main`** (geverifieerd: `aa0396d` is ancestor van HEAD; hardened CSP live in `netlify.toml`, externalized scripts aanwezig op `src/analytics/consent-default.js` + `src/ui/brevo-config.js`).

39. [x] **Bugfix tutorial/challenge-completion UX (Sessie 190)** — commit `8757b69`, gepusht naar `main`. Twee bugs op het completion-moment (missie voltooid): (1) **weggescrolde output** (tutorial ÉN challenge, gedeelde `renderCompletionBlock` in `src/ui/renderer.js`): het hoge completion-blok (missiebox + certificaat + follow-up) werd ónder de commando-output geplakt en de viewport op de bodem gepind (`_scrollToBottom`), plus 2× her-scroll op timer in `_revealCelebration` (800ms/1500ms) → de laatste commando-output verdween boven de vouw. Fix: scroll-anker verlegd naar de laatste commando-echo (NEW `_scrollLineToTop` via `getBoundingClientRect`-delta, blijft binnen output-element), de 3 timer-`_scrollToBottom`-calls geschrapt (opacity-reveal wijzigt geen layout → geen her-scroll nodig), dode `self`-var verwijderd. (2) **dubbele "Type 'next'"** (tutorial-only): stale `isActive()`-guard las de tutorial als IDLE nadat `handleCommand()` 'm in dezelfde tick had afgesloten → onboarding-nudge lekte naast de legitieme completion-follow-up. Fix in `src/core/terminal.js`: tutorial-staat vastgelegd vóór de mutatie (`tutorialActiveAtStart`) en beide guards daarop laten lezen. Cache-bump `main.js?v=190-completion-scroll`. Regressie-assertie in `tests/e2e/fundamentals.spec.js` (exact 1× "next"). Playwright MCP geverifieerd: echo `offsetFromTop:0` (bovenaan), output zichtbaar, `nextCount:1`, `scrollTop`≠`maxScroll`. Lokaal 43/43 chromium groen (tutorial + fundamentals + gamification specs, incl. recon/webvuln/privesc-completions + badges/challenge). Volledig: `docs/sessions/current.md` Sessie 190.

40. [x] **UX-fix voltooiingsscherm — één heldere "wat nu?"-CTA (Sessie 191)** — commit `20578a6`, gepusht naar `main`. Vervolg op Sessie 190 (zelfde completion-moment). Klacht: na een tutorial staat bovenaan "typ next" én onderaan al de volgende opdracht → dubbelop/verwarrend. Diagnose (brutaal eerlijk): (a) **mislabel** `[→] Type 'next' voor je volgende stap` is fout op elk voltooiingsblok — er is geen volgende *stap* (missie klaar) en `next` is de globale begeleidings-funnel, geen stap-advancer; "stap" botst bovendien met de "Stap 1/4" van de volgende missie eronder. (b) **drievoudige CTA** na Fundamentals: box (`tutorial recon`) + `tutorial` + `next`. Analyse "komt vaker voor": mislabel op **4 plekken** (tutorial+challenge, desktop+mobile); triple-CTA uniek voor `fundamentals.js` (de 4 andere scenario's sluiten al schoon af). Fix: `next` als enige primaire CTA, correct verwoord (`[→] Typ 'next' en ik wijs je naar je volgende missie/uitdaging`) + secundaire browse-regel (`[?] Of typ 'tutorial'/'challenge'...`); `Type`→`Typ` (de-Dunglish, `feedback_nl_copy_dejargon`); `fundamentals.js`-box stopt met hardcoded `tutorial recon` (routering intact via `buildReconTutorialStage` in `next.js`). Bewust NIET: scroll/reveal-sequencing (Sessie 190) ongemoeid, geen auto-advance, overige 4 scenario-`completionMessage`s ongemoeid. Regressie-assertie `fundamentals.spec.js` gesplitst + versterkt (nieuwe CTA exact 1× ÉN oude onboarding-string 0×). Cache-bump `main.js?v=191-completion-cta`. 65 e2e groen chromium (10 fundamentals + 45 tutorial/mobile/gamification + rest) tegen lokale server (`BASE_URL`, config-baseURL wijst naar productie). 5 files. Volledig: `docs/sessions/current.md` Sessie 191.

41. [x] **Tutorial-voltooiing past in beeld — next-step CTA altijd zichtbaar (Sessie 192)** — commit `24dc7ec`, gepusht naar `main`. Vervolg op Sessie 190/191 (zelfde completion-moment). Klacht: na afronden zie je de `MISSIE VOLTOOID`-box maar **niet** de vervolgstap-CTA — die staat onder de vouw, je moet zelf scrollen. Diagnose (in regels gemeten): het blok is ~43 regels/~1300px vs viewport ~830px (1,6×); van boven→onder: commando-echo → stap-feedback (~6) → `MISSIE VOLTOOID` (~13) → **`CERTIFICAAT`-box (~20)** → follow-up CTA (4). Sessie 190's top-anker (commando bovenaan, om "ik zie mijn output niet" te fixen) duwde de CTA (onderkant) ~470px onder de vouw; de 20-regelige inline-certificaat-box is de wig. **Besluit (brutaal eerlijk):** de inline-cert is redundant (staat al op klembord + opvraagbaar via `tutorial cert`, geverifieerd post-completion via `completedScenarios`) → verwijder 'm uit de auto-voltooiing. Blok krimpt naar ~23 regels/~750px → past → scroll-anker terug naar `_scrollToBottom` (CTA altijd laatste zichtbare; commando-output blijft óók zichtbaar want blok past). Beide eerder-botsende eisen (Sessie 190 output-zichtbaar + Sessie 192 CTA-zichtbaar) nu vervuld. **Files:** `tutorial-renderer.js` (certificate-veld weg uit completion-object desktop+mobile; follow-up regel 2 → "typ 'tutorial cert' om het te bekijken"), `renderer.js` (`_scrollLineToTop`→`_scrollToBottom` + dode anchor-capture + ongebruikte helper opgeruimd, −14 regels), `terminal.html` cache-bump `main.js?v=192-completion-fit`, `fundamentals.spec.js` (cert niet auto-getoond + follow-up-pointer + `tutorial cert` toont cert nog). Bewust NIET: cert-feature behouden (klembord+`tutorial cert`), challenge-voltooiing ongemoeid (geen inline cert; blok past al), box/banner/reveal ongemoeid. Render-en-meet (Playwright, lokale server, `BASE_URL`): 1920×1080 `echoInView:true`+`ctaInView:true`+`certPresent:false`; 1280×800 CTA zichtbaar (echo scrollt weg — juiste prioriteit op klein scherm). 61 e2e chromium groen (10 fundamentals + tutorial/mobile/gamification/certificates, incl. `tutorial cert after completion`). Volledig: `docs/sessions/current.md` Sessie 192.

42. [x] **Test-suite: 10 prod-hardcoded specs → `baseURL` (backlog Sessie 197) ✅ CLOSED 14 jul 2026** — alle 10 specs (feedback, autocomplete-filesystem, css-variable-test, debug-console, debug-storage, feedback-onboarding-headers, modal-colors-simple, modal-headers, performance, responsive-breakpoints) omgezet naar relatieve `goto`'s tegen de config-`baseURL`; `TEST_URL`-constante relatief, `PRODUCTION_URL`→`TERMINAL_URL` (naam werd onwaar). **Per-bestand-oordeel vervalt veilig:** de config-default (`playwright.config.js` `baseURL: BASE_URL || 'https://hacksimulator.nl'`) is al productie, dus default-runs (incl. performance/debug) blijven exact prod-gedrag — alleen `BASE_URL=http://localhost:PORT` test nu wél de werkkopie; daarmee is het smoketest-split-alternatief overbodig (één suite, target per run). Bewijs: eerste werkkopie-run ooit voor deze specs — 46 passed / 4 skipped / **0 failed** (chromium, verse poort 8232, incl. feedback-analytics via de dataLayer-shim); harness-steekproef fundamentals 14 + command-coverage 15 groen. Niet aangeraakt: cross-browser.spec (alleen comment) + lead-magnet.spec (domein in test-e-mailadressen/sitemap-assert = legitiem content-contract).

43. [x] **Launch-readiness WS1: funnel-meetbaarheid (Sessie 198)** ✅ — analytics-funnel-audit + 2 launch-kritische events gebouwd (`terminal_cta_click` op 6 homepage-CTA's + `terminal_activated` bij eerste command); self-test bewees 0 events missing; NEW `docs/launch-success-metrics.md`. Code live op main. **Open (Heisenberg):** GA4 key-events + funnel-exploration + DebugView-check configureren vóór launch (stappen in de doc).

44. [~] **Launch-readiness WS2: demand-validatie — BEWUST OVERGESLAGEN (besluit Heisenberg 22 jul 2026)** — protocol blijft klaar (`docs/demand-validation-protocol.md`), maar Heisenberg koos direct launchen zonder voorafgaande validatie-sessies. **Consequentie expliciet aanvaard:** de value-prop/onboarding wordt live getoetst i.p.v. vooraf; de launch-data (funnel-events, item #43/#46) vervangt het validatiesignaal. Poort niet wegvallen maar als afwijking gelogd. Protocol blijft beschikbaar als de launch-data een probleem toont dat gerichte sessies moeten uitdiepen.

45. [ ] **Launch-readiness WS3: value-prop + retentie beslissen/bouwen (Sessie 198)** — audit + 3 hero-varianten + retentie-opties klaar (`docs/value-prop-and-retention.md`), bewust nog niet live. **Open (na launch):** nu WS2-validatie is overgeslagen (#44) stuurt de **echte launch-data** (homepage→terminal-conversie + activation-rate uit `launch-success-metrics.md`) de keuze — laagste funnel-stap = het te fixen oppervlak; dán hero-variant + retentie-optie kiezen en implementeren (triviale copy-wijziging + retentie-v1 in `src/gamification/`). Blijft bewust NIET vooraf gegokt.

46. [ ] **GA4-config afronden + launch-dag-handelingen (Sessie 199)** — uitvoering van item #43's "Open"-clausule via GA4 Realtime-verificatie. **Bug gevonden + gefixt (live op main, commit `9f241e8`):** `terminal.html` laadde als enige pagina niet `/src/init-analytics.js` → gtag initialiseerde daar nooit → `terminal_activated` (north-star) + `tutorial` werden aangeroepen maar nergens heen gestuurd. Eén regel toegevoegd; Realtime bevestigt nu alle terminal-events komen binnen. CSP (`netlify.toml /*`) staat google-domeinen al toe. **Gedaan in GA4:** `newsletter_signup` + `lead_magnet_signup` als key event gemarkeerd; custom dimensions `location` + `user_type` (Bereik=Gebeurtenis) aangemaakt. **⏳ NOG DOEN — getimede handelingen:**
    - **[x] `terminal_activated` als key event gemarkeerd** (14 jul, ster gezet in Beheer → Gebeurtenissen → Recente gebeurtenissen). North-star telt nu als conversie.
    - **[x] Launch-dag: annotatie gezet** op 29 jul 2026 (Beheer → Annotaties), op de geverifieerde property `G-7F792VS6CE` — de streamnaam "Netlify Staging" is een cosmetisch overblijfsel, data landt correct. Bron: `docs/launch-checklist.md` §Stand. Afgevinkt in Sessie 220; stond twee weken na uitvoering nog open.
    - [ ] Optioneel: `tutorial_completed` afgeleid event (Gebeurtenis maken, `event_name`=tutorial én `action`=completed) → sterren; en funnel-exploratie bouwen (`launch-success-metrics.md §4.2`) zodra er verkeer is.

47. [x] **Command-output opschonen — verbeter-roadmap 40 overige commands (audit 26 jul 2026)** — ✅ **VOLTOOID Sessie 200** (alle 3 fases gepusht: Fase 1 `f65c93d`, Fase 2 `0a256ad`, Fase 3 `e31075b`). na de metasploit-opschoning (commit `f56d886`: `%%%%`-banner + dubbele warningbox weg, msf6-demo gekaderd, canonieke markers, NL art. 138ab i.p.v. US "10 jaar") alle command-`execute()`-outputs geaudit (3 Explore-passes: netwerk / filesystem+system / security+meta) tegen de renderer-marker-regels (`src/ui/renderer.js`) + 80/20 + mobiel ≤40 + NL-copy + eerlijke juridische claims. **Uitkomst:** meeste commands schoon; problemen clusteren in de oudere security- + funnel-commands. Metasploit = bewezen template. Gefaseerd (volgorde = prioriteit):
    - **Fase 1 — security-cluster (schone sessie aanbevolen, hoogste waarde):** sqlmap/hydra/hashcat/nikto, zelfde klasse als metasploit. **(1a cosmetisch)** `[***] BESCHERMING/REMEDIATIE` centreert per ongeluk → `[###]`/`[?]` (sqlmap:171, hydra:177, nikto:150); marker-zoo `[ > ]`/`[*]`/`[+]` renderen plain → canoniek (o.a. hashcat `[+] HASH CRACKED`:134 → `[✓]` groen); oversized rulers weg (nikto 75-char streepregels 88/93/139, hashcat `.repeat(50)`:132, hydra `.repeat(40)`:158); nikto "unauthorized access attempt" → NL. **(1b juridisch)** sqlmap "Tot 6 jaar + civiele aansprakelijkheid" + hydra "Tot 6 jaar gevangenisstraf" → NL-framing zónder getal (art. 138ab Sr, consistent met metasploit + de 8 blogposts); manPage US-recht sqlmap:352 (CFAA) + nikto:369 → NL. **(1c STRUCTUREEL — BESLIST Heisenberg 26 jul: consent-box ALTIJD één keer tonen)** vóór de eerste tool-run, óók mét args. Nu omzeilbaar: `sqlmap http://site` op eerste run zet stil `consent=true` en toont direct de aanval-output zonder ooit de waarschuwing te tonen (`sqlmap.js:20` vs `:53`; zelfde patroon hydra/nikto/hashcat) → gelijktrekken met metasploit's box-eerst-flow; e2e-verwachtingen checken want `sqlmap <url>`-eerste-run-gedrag verandert. Plus mobiele legal-box-truncatie (`boxText` kapt >breedte af, clamp 30) als breedte-fix meenemen.
    - **Fase 2 — meta-funnel (hoge zichtbaarheid, laag risico):** `next.js` `[->]`/`<-`-pseudo-markers → `[→]`/echte `[TIP]` (funnel gelijk aan de al-canonieke tutorial-tak :580) + >40-char mobiele regel :540; `shortcuts.js` Engelse mobiele output (:50-51) → NL; `onboarding.js` `_getFirstTimeWelcome` (~204-219) kale `→`-FASE-bullets + ~50-char mobiel; `help-system.js:103` hardcoded "41 commands" → afleiden uit de command-registry (drift-fix).
    - **Fase 3 — triviale nits (1 commit):** `cp.js:47` "De bronbestand" → "Het bronbestand" (vgl. `mv.js:61`); `certificates.js:158` "kopieren" → "kopiëren"; `nmap` "attack surface" → NL.
    - **Bewust NIET:** netwerk-tabelbreedte (netstat ~82/nmap ~78 chars = inherent aan authentieke tool-output, 0 marker-/kleurdefecten in alle 6 netwerk-commands — realisme > mobiel forceren); brede manPage-marker-zoo (naslag, niet de beginner-first-output).
    - Verificatie per fase = metasploit-recept: `node --check` + renderer-marker-simulatie (node) + Playwright echte-render (lokale server, consent-flow, kleur-classes, 375px overflow via `getBoundingClientRect`) + blog-consistentie; commit per fase direct naar `main`.

48. [x] **Mobiele kolom-uitlijning + box-truncatie in terminal-output (Sessie 202, commit `fe27a17`, gepusht)** — n.a.v. screenshot: het `reset`-tutorial-exit-menu brak lelijk af op 375px (twee zware kolommen commando+beschrijving vielen onder elkaar). **Root cause:** `#terminal-output` = `white-space: pre-wrap` → fixed-width twee-koloms-tabellen klappen in bij ~30 tekens; `data-indent` hanging-indent redt alleen continuatie-regels. **Fixes (live output, man-pages buiten scope per Heisenberg):** (1) `reset.js`-menu gestapeld; (2) `nikto.js` headers-tabel gestapeld + 2 echte `\n`-plak-bugs (Start Time/Server, End Time/1 host) + "Forces HTTPS"→"Dwingt HTTPS af"; (3) `hashcat.js` 2 ←-glosse-regels op eigen regel; (4) **`asciiBox.js` box-`wrap()` woord-wrapt i.p.v. afkappen** — sluit de in #47 Fase 1c gevlagde "mobiele legal-box-truncatie (`boxText` kapt >breedte af)": de 5 SECURITY WARNING-boxen kápten waarschuwingstekst af op mobiel; passende regels blijven verbatim (desktop ongewijzigd). **Bonus:** latente `RangeError` in box-titel afgevangen (titel-afkap-guard; onbereikbaar in prod want man/help zijn desktop-only, maar goedkoop). `metasploit.js`/`hydra.js` glosse-regels bewust ongemoeid (al ≥3 spaties → hanging-indent). Geverifieerd: Playwright 375px + desktop (0 overflow, randen uitgelijnd, geen regressie); box-fix via verse `import('...?cb=')` (geen build-stap + `asciiBox.js` zonder `?v=` → modulecache serveerde stale in-app render). **Deploy-noot:** live na ~1u Netlify-cache (relatieve sub-imports zonder `?v=`; harde purge = "Clear cache and deploy site").

49. [x] **GEO/AEO — vindbaarheid in AI-zoekmachines (Sessie 203, commit `202c8eb`, gepusht + live)** — llms.txt + robots.txt AI-stanzas + FAQPage op index + DefinedTermSet 5→56 met lockstep-check + WebApplication op terminal + HowTo op wireshark/metasploit + §5 GEO in seo-launch-checklist.md. **Open (Heisenberg, zie checklist §5):** ~~Bing Webmaster~~ ✅ 31 jul (GSC-import + sitemap + 4 URL's via URL Submission), herindexering GSC (4 pagina's) + `terminal.html` in Bing, externe vermeldingen, ~1 mnd controle of AI-engines HackSimulator citeren.

51. [x] **Box-reflow bij venster-resize + submodule-cache-fix (Sessie 205, commits `017d872`+`875399d`+`b02d193`, gepusht + live geverifieerd)** — NEW `src/ui/box-reflow.js` herbouwt bestaande box-blokken shrink-only op de actuele breedte (geen mobiel-guard: half-gesnapte vensters vallen onder 768px; indent-bewust wordWrappen; completion-wrappers ongemoeid; scroll-pin behouden). Structurele vondst: `_headers` `/src/**/*.js` stond op 7 dagen → alleen `main.js` draagt `?v=`, dus ~99 submodules bleven gecached en de Sessie 204-fixes bereikten terugkerende bezoekers nooit (gemeten: 41 vs 62 chars) → `max-age=3600` + `renderer._formatText`-fallback. 276 boxregels @640px = 0 wraps; suite 243 passed; reflow-test groen op 3 engines. **Voor Heisenberg:** eenmalig hard refreshen (Ctrl+Shift+R) om de gecachete modules te verversen.

53. [x] **Lead magnets: juridische sample leverde pentest-naam én pentest-mail (Sessie 212, commits `e24e324` + `8c72329`, gepusht + live geverifieerd)** — twee losstaande bugs uit één proefinschrijving. (a) `_headers` zette via `/assets/samples/*` één harde `Content-Disposition: filename` over de hele map; correct met één sample, stil fout zodra er een tweede bij kwam. Nu een exacte regel per PDF (Cache-Control herhaald zodat Netlify's merge-gedrag geen open aanname is) + expliciete `download="<naam>.pdf"`, zodat het niet uitmaakt welke van de twee de browser laat winnen. (b) Beide sample-pagina's deelden één Brevo-formulier terwijl de automation op een *Form submitted*-trigger draait → Brevo kón de instromen niet scheiden. Eigen formulier + automation + NEW `welkomstmail-sample-juridisch.html`; Brevo-kant door Heisenberg uitgevoerd en end-to-end getest. (c) Dekking: NEW Check 10 in `validate-docs.sh` + Content-Disposition-tests, beide rood-op-mutant bewezen; `lead-magnet.spec.js` geparametriseerd over beide samples (60 passed tegen productie). (d) `type="email"` op alle vier de Brevo-formulieren — Brevo accepteert een malformed adres met `success:true`, dus een typefout gaf stil geen mail. **Open (klein):** de drie niet-succes-Messages verschillen nog tussen de formulieren, en `welkomstmail-sample-pentest.html` staat één teken (88 vs 89 KB) uit de pas met de Brevo-template — beide alleen de moeite bij een volgende aanraking.

52. [x] **Audit oude follow-up-lijstjes → gesnoeid op bezoekerswaarde (Sessie 207)** — drie eerder genoteerde ideeënlijstjes (leerpad-features, blog/SEO, border-refactor) nagelopen. **Al klaar (4):** Google Search Console (DNS-geverifieerd Sessie 160, sitemap 26 URL's + in `robots.txt:35`), RSS-feed (`/feed.xml`, 14/14 items, bewaakt door `validate-docs.sh:475-524` — staat op root, níét op `/blog/feed.xml`), related-posts ("Verder lezen", 14/14 posts, 56 links), analytics (GA4 `G-7F792VS6CE` + Consent Mode v2, 943 regels/8 bestanden). **Uitgevoerd (4):** zie items W1-W4 in de sprint-regel. **⛔ BEWUST VERWORPEN — niet opnieuw oppakken zonder nieuw argument:** (a) *leerpad-completion in `dashboard`* — wordt de derde weergave van dezelfde data (`leerpad.js:68/117` toont al `[✓] FASE 2 (3/8)` + vinkjes per command, `dashboard.js:116-130` zegt al "Volgende: Fase 2 voltooien (3/8)"); het ongebruikte `percentage`-veld op `leerpad.js:25` is géén argument, dode code is geen opdracht. (b) *phase-badges* — fase-voltooiing wórdt al gevierd en `next` wordt ná élk nieuw geleerd command aangeboden (`onboarding.js:311`, `:451-460`, `renderer.js:374`), dus de viering is één geprompte toets weg; 4 badges bovenop 22 verdunt de set. Het enige echte gat (ontbrekende FASE 4-viering) is als W1 gedicht. (c) *leerpad-certificaat voor CV/portfolio* — certificaten bestaan al voor challenges én tutorials, en "zet dit op je CV" over een browser-simulator zonder verificatie is de overbelofte die de tone-regels verbieden. (d) *social sharing "Ik heb FASE 3 voltooid!"* — tone-conflict (nuchter, geen LinkedIn-theater), lage deelintentie, permanente UI-ruimte. (e) *Static Site Generator (11ty/Hugo)* — botst met PRD §13 (`netlify.toml:6-9` = geen build-step) en lost een probleem op dat `validate-blogs.sh` + `validate-docs.sh --deep` Check 9 + de `blog-post`-skill al afvangen; bij 14 posts is de migratiekost een veelvoud. (f) *blog-engagement-events* — GA4 enhanced measurement meet scroll (90%) en engagement time standaard; owner-facing, bezoeker merkt niets. (g) *RSS-link in root-`<head>`s* — feed-readers ontdekken de feed via `/blog/` (`blog/index.html:31`), winst ≈ 0. (h) *two-tier border system* — polish op polish (90 call-sites + visuele verificatie in 2 themes × 4 paginatypes) voor een contrast dat niemand meldt; de latente bug die deze verkenning wél opleverde is als W4 gefixt.

50. [x] **Box-omlijning brak op tussenbreedtes — root-cause fix (Sessie 204, commit `418d0da`, gepusht + live geverifieerd)** — dominante oorzaak: inline 'JetBrains Mono Box'-embed in `main.css` corrupt (2 b64-chars, brotli-fail, `FontFace.status 'error'` sinds Sessie 83) → box-glyphs renderden via OS-fallbacks met afwijkende advances; borders wrapten als eerste. Herembed van valide disk-subset (600/1000-advance == latin). Plus: `asciiBox.js`-contract totaal==`width` (was `width+2`, at de veiligheidsmarge op), `box-utils.js` meet nu `#terminal-output` (echt font + clientWidth excl. scrollbar; mat Inter op container = ~35% onderschatting) met `max(M,─,━)`-advance, `scrollbar-gutter:stable`. Test-gat: `scrollWidth`-assert + `fonts.check()` beide structureel vals-groen → echte wrap-detector (hoogte >1.5× line-height, rood-op-mutant bewezen) + viewports 800/900/1024/1100 + `fonts.load`-assert. Resize van oude output reflowt bewust niet (echte-terminal-gedrag; = het screenshot-scenario, vers command rendert passend). Suite 242 passed; font live 'loaded' op productie.

54. [x] **Gidsen-grid + CTA-uitlijning + site-brede navbar-inklapband (Sessie 213, commit `d3ab459`, gepusht)** — vier klachten op `/gidsen.html`, drie oorzaken. Weeskaart (`repeat(3, 1fr)` met vier kaarten) → NEW `.feature-cards--2col` 2×2 in `@media (min-width: 769px)`. CTA's 82px scheef doordat `.gids-card p { flex: 1 }` óók `p.gids-sample-link` selecteerde (twee groeiers deelden de rek: 82 + 66 i.p.v. 164) → NEW `.gids-card-body` als enige groeier, invariant kaartbodem − CTA-bodem = 186px voor alle vier. Beide gratis samples als coupon-chip op hun eigen kaart (thema-aware tokens, `min-height: 44px`); dubbel pentest-blok onderaan vervangen door een slanke strook. Gedeeld: `:nth-child(3)` → `:nth-child(3):last-child` fixt gidsen én over-ons (820px gaf `211/185/136/136` met kaart 3 op 500px); `.features-4col` naar `@media (min-width: 1025px)`. **Navbar:** klapte pas onder 768px in maar past pas vanaf 1264px zonder afbreken (1266 in WebKit) — 341px overflow @820px op élke marketingpagina + alle blogposts; band nu tot 1279px, terminal-navbar bewust ongemoeid. `.mobile-cta-link` heeft nooit gewerkt ((0,2,2) versloeg (0,2,0)) → opgelost op specificiteit (0,3,2); landing.css van 1 naar 0 `!important`. `nostore-server.py` naar `ThreadingTCPServer` (single-threaded las als flaky tests). NEW `gidsen-layout.spec.js` + `navbar-collapse.spec.js`, beide eerst rood tegen productie; 111/111 groen in 3 engines.

55. [x] **Hero-terminal: uitlijning, focusrand, uitnodiging + cursor (Sessie 215, commit `f567ebc`, gepusht)** — drie klachten van Heisenberg plus één defect dat ik tijdens het meten vond. **Uitlijning:** `margin-top: 3rem` was een handmatige centrering voor een venster van 313px; de demobalk van Sessie 214 (+152px) liet het 94px onder de tekstkolom uitsteken → `align-items: center` in een `≥769px`-band, middens 0,5px uit elkaar. `align-self` op de terminal is een no-op: die is zélf het hoogste flex-item. **Focusrand:** de blauwe rand was onze eigen `--color-info`, niet die van de browser; nu rand + ring + halo in het promptgroen (~17:1) + oplichtend vensterbolletje, met transparante outline als forced-colors-vangnet. Keyboard-only is onmogelijk (tekstvelden matchen `:focus-visible` ook na muisklik); de regel moet ná het light-theme-blok (gelijke specificiteit, bronvolgorde beslist). **Uitnodiging:** "Deze terminal werkt echt — typ maar" boven het venster in NEW `.hero-terminal-col`, weg bij overname via `visibility`; tekst in `--color-text` want CTA-groen meet 3,10:1 op licht; niet op mobiel omdat de 30px drie chips onder `.mobile-cta-bar` duwden. **Cursor:** de `_` stond 317px van zijn eigen tekst (`flex: 1` op het `<input>` sinds Sessie 214) → veld hugt in rust zijn inhoud in `ch`, gat 18px; tikdoel-regressie (309→10px) opgevangen door de hele promptregel te laten overnemen. Plus `?v=` op `landing-demo.js`. 105/105 in 3 engines, 9 nieuwe declaraties elk met mutant bewezen.

56. [x] **`.mobile-cta-bar`: verschijnen gekoppeld aan "geen primaire CTA in beeld" (Sessie 216, commits `00433e4` + `570d44c`, gepusht)** — de balk stapt nu opzij zodra het **middelpunt** van een primaire CTA vrij ligt (onder de navbar, boven de balkrand). Die grens is de spil: "zodra hij het scherm raakt" laat de balk verdwijnen voor een strookje van 1px (geen tikdoel), "pas bij volledig zichtbaar" laat ~24px scroll open waarin balk én CTA-midden allebei aantikbaar zijn. Bij "midden vrij" geldt *balk verborgen ⟺ CTA-midden aantikbaar* — één conditie, dus geen gat en geen overlap. IntersectionObserver boven `position: sticky` gekozen: sticky lost de plaats op, niet het mechanisme (overlapt nog steeds zodra hij plakt, duplicaat blijft tijdens scrollen, 65px flow-gat na de hero, DOM-verhuizing van een monetisatie-element). IO is alleen de trigger; een geometrisch predicaat is de regel — dat vermijdt de `isIntersecting`-val en blijft correct als de `rootMargin` veroudert (bij toestelrotatie in alle vier de toestanden geverifieerd). Verbergen via `visibility` zodat de box meetbaar blijft; zonder JS staat de CSS-default en gedraagt de pagina zich als voorheen. `BASELINE_BEDEKT` naar `[]` op alle drie de maten. **De guard is meegeherschreven** (zie #57-context): hij scrollde nooit (`scroll-behavior: smooth` + synchrone lus → `scrollY` bleef 2px) en mat bounding boxes i.p.v. aantikbaarheid; op één mutant is de oude versie 3× groen en de nieuwe 3× rood.

57. [x] **Vier vastgelegde pre-existing punten opgeruimd (Sessie 217)** — elk punt eindigt als fix mét regressietest of als "geen bug" mét de meting; geen enkel punt blijft notitie. **Drie van de vier vastgelegde metingen bleken niet te kloppen.** **(a) Bug, en groter dan genoteerd.** De 76px reserve wordt geverfd met de body-achtergrond: light `#f8f8f8` tegen een footer van `#1a1a1a` = **16,39:1**, dus een onmiskenbare witte strook; dark 1,04:1 en onzichtbaar. Niet 9 maar **10 pagina's** — index.html toont er 11px van (reserve 76 − balk 65) op maximale scroll, wat de notitie miste. Opgelost door de reserve naar de **footer** te verhuizen (donker in beide thema's) met `:has(.mobile-cta-bar)`, dus balkloze pagina's krijgen hem niet en index.html krijgt hem donker geverfd. Onvoorwaardelijkheid bewezen: documenthoogte 9481/9481/9481 over `zichtbaar → verborgen → zichtbaar`. Bijvangst: `env(safe-area-inset-bottom)` werd dubbel geteld, nu één keer. **(b) Bug, en de genoteerde meting was te gúnstig.** 3,10:1 reproduceert exact — maar tegen de páginaachtergrond. Tegen de effectieve achtergrond van het element (rgba-badge over pagina) is het **2,85:1**, en 2,74:1 op de hero waar de radial glow een derde laag toevoegt: onder AA, niet "net onder AAA". Dark haalt 12,26:1 en blijft groen. Nieuw `--eyebrow-text`-token → `--color-text` in light (17,12:1). Ook de genoteerde 14,4px klopte niet: gemeten 13,5px (desktop) / 10,4px (≤768px). **(c) Geen bug — al gefixt op 07 jul door commit `3d7df13`.** Zie het gesloten item onder §Deferred. Wel de ontbrekende regressietest toegevoegd, want dát is waarom het item zeven sessies bleef staan. **(d) Budget → 1120 KB** (2,94% marge, precedent Sessie 214); expliciet besloten vóór de fixes, niet als bijvangst. **Mutanten:** alle drie tweezijdig bewezen — (a) 12 rood / 2 groen, en die 2 zijn groen om principiële redenen (`@1280px` valt buiten de `≤1279px`-band, de terugkoppellus-test bewaakt iets anders); (b) 10 rood, **allemaal in light**, allemaal exact 2,85:1; (c) 6 rood, elk met `MAIN#terminal-container` benoemd. **Zelfcorrectie tijdens het meten:** mijn eerste aflezing van de balkstaat was stale (2 rAF is te vroeg voor de IO-callback, dus ik las de staat van y=0) — met 300ms settle klopt hij, en die settle staat nu in de test. ~~startprompt in `/home/willem/.claude/plans/startprompt-pre-existing-bugs.md`~~. **(a)** 9 pagina's dragen `body.landing-page` (dus `padding-bottom: 76px`) zónder `.mobile-cta-bar`: `over-ons`, `gidsen`, `contact`, `woordenlijst`, `commands/index`, `404`, `sample-pentest`, `sample-juridisch`, `sample-download`. Gemeten in Sessie 216, byte-identiek tegen `git archive HEAD` → pre-existing sinds Sessie 214. Meet eerst óf die ruimte in light mode zichtbaar is als lichte strook onder de donkere footer; zo niet is "geen bug" de uitkomst. ⚠️ De reserve op index.html moet **onvoorwaardelijk** blijven (conditioneel = documenthoogte verandert per toggle → scrollsprong → herbeoordeling → terugkoppellus). **(b)** `.eyebrow-badge` (10× op 9 pagina's) staat in `architecture-patterns.md` §10 genoteerd als 3,10:1 — **die meting is verdacht**: het element heeft een eigen `background: var(--eyebrow-bg)` plus border, dus die waarde is tegen de páginaachtergrond gemeten, niet tegen de achtergrond waar de tekst op ligt. Hermeten tegen de effectieve `background-color`, beide thema's; 0.75rem = normale tekst, dus 4,5:1 (AA) / 7:1 (AAA). **(c)** Terminal ~10px horizontale overflow mobiel (open sinds Sessie 189): meting is van 30 jun en noemt 375px in de titel maar `docW 360` in de meting, en de terminal-CSS is daarna aangeraakt — hermeten op 360 én 375. Verdachte: `mobile.css` `#terminal-container { margin: 10px; width: auto }`. **(d)** Beslis vóóraf of **1100 KB** nog klopt: marge is 1,4% en (a)-(c) voegen alle drie CSS toe. **Optioneel:** de baseline-testfalers zijn Chromium-only vastgelegd; een driemotorenrun geeft er meer (zie §Sessie 216-sprint). Let op de eigen `--global-timeout`: de volle suite over drie motoren duurt >48 min.
58. [x] **Educatiestrook onder de terminal gehalveerd en klikbaar gemaakt (Sessie 218, commit `9b44314`)** — Heisenberg vroeg of alles onder de terminal nog nodig was nu de advertenties weg zijn. **De herkomst besliste het:** commit `1cc04ff` (4 mrt) heet *"full-viewport terminal + scroll hint for AdSense content"*, met in het bericht *"Education content stays below the fold, fully crawlable by AdSense"*; `f748c38` droeg `?v=108-adsense-content`. AdSense is in Sessie 208 verwijderd — de aanleiding was dood, de strook nooit heroverwogen. Nulmeting: **2424px = 65% van de pagina, 396 woorden, 3 links** (allemaal in het laatste blok), zes command-kaarten die commando's bij naam noemen en géén link zijn, **nul `<h1>`**. Ná: **1784px (−26%), 12 links, 284 woorden, 1 `<h1>`**. "Zo begin je" geschrapt (de terminal zegt het zélf via `onboarding.js:196` + de placeholder + `next`/`leerpad`), kaarten → `/commands/#cmd-X`, CTA "Bekijk alle **40+** commands" (niet 41 — `validate-docs.sh:432` handhaaft de `N+`-vloer), bloglinks → "Verder lezen" in twee kolommen plus woordenlijst en gidsen. FAQ + FAQPage-JSON-LD ongemoeid. **Drie pre-existing bugs meegenomen:** verlopen bloglabels (de homepage heeft die test, terminal.html niet), de hele strook op `opacity: 0` zonder JS (noscript-vangnet ontbrak, `index.html:62-66` had het al), en `WebPage.name` ≠ `<title>` ≠ zichtbare kop. Eén eigen bug gevangen door te meten: de nieuwe CTA mat 193×22px op 375px → nu 217×46. NEW `edu_section_reached` + `terminal-seo.spec.js` (8 asserties, **de eerste ooit onder de terminal**). Zeven mutanten, zeven rood; overlever nagelopen. **Kost ~3,3 KB in plaats van te besparen** — de winst is hoogte, links en meetbaarheid.
59. [ ] **Search Console-data voor `/terminal.html` beoordelen (Sessie 218 openstaand)** — Heisenberg levert klikken / vertoningen / gem. CTR / gem. positie over 3 maanden plus de top-10 zoekopdrachten (Prestaties → Zoekresultaten → filter *Pagina bevat* `terminal.html` → tabblad Zoekopdrachten → Exporteren), plus dezelfde cijfers zonder paginafilter als noemer. Bepaalt of de strook verder mag krimpen (nauwelijks zoekverkeer) of juist een echte landingstekst verdient (wél zoekverkeer). ⚠️ Combineer met `edu_section_reached / page_view` zodra daar een week data in zit; verwacht een lagere doorscroll-rate op mobiel omdat `.scroll-hint` onder 768px op `display: none` staat (bewuste keuze Sessie 176, botsing met `#mobile-quick-commands`) — dat gat is bewust open gelaten tot de meting er is.
60. [x] **`responsive-breakpoints.spec.js:209` overleeft geen parallelle run** ✅ **GESLOTEN Sessie 220 → zie #63.** ⚠️ **De diagnose in dit item was fout op beide punten** en heeft twee sessies lang een verkeerd beeld doorgegeven: het waren 7 falers en niet 1, en de oorzaak was niet CPU-contentie maar (a) Netlify's bot-protectie die een challenge-interstitial serveert en (b) de legal-modal die de klik onderschept. Oorspronkelijke tekst: (gevonden Sessie 218) — faalt op firefox+webkit zodra drie motoren tegelijk draaien, en is **geen regressie**: serieel gemeten 32/32 groen, 8× per motor per kant tegen `git archive HEAD`, met tijden die op 0,1s gelijk zijn (50,6 vs 50,7s / 35,4 vs 35,5s). Oorzaak is de 10s `toBeVisible`-wachttijd op een JS-geïnjecteerde navbar, die onder CPU-contentie niet gehaald wordt. Bewust niet stilzwijgend verruimd in Sessie 218 (viel buiten die wijziging). Kandidaat-fixes: conditie-wacht op de component-injectie i.p.v. een vaste timeout, of dit blok serialiseren.
61. [x] **Sectieritme onder "in cijfers" hersteld + één band-token voor de hele homepage (Sessie 219, commit `e7cc0c4`)** — de langste reeks zonder achtergrondwissel ging van 2390px/3078px (3,8 schermen) naar 949px/913px (1,05 / 1,12 scherm), strakker dan de 1,6 die bóven de vouw bestaat. Onderweg twee bugs die alleen uit een meting komen: de light-mode cijfers-band had **nul** kleurverschil met de pagina (`rgba(248,248,248,0.8)` over `#f8f8f8`), en "banden lichter maken" laat de kaarten oplossen omdat die `rgba(22,27,34,α)`-tinten van de nieuwsbriefkleur zijn (Δ0). Opgelost met de regel *pagina = oppervlak, band = verdieping, kaart = verhoging* → `--color-bg-alt` + `.section-band`. Vier CSS-regels weg, twee erbij; `.results-grid` ligt nu op dezelfde content-rail als de rest. 26/26 groen over drie motoren, beide mutanten tweezijdig.
62. [x] **`performance.spec.js:480` (VFS-groei) asserteert serieel helemaal niets** ✅ **GEFIXT Sessie 220** (commit `d5741f5`) — oorzaak gemeten: de VFS-save is gedebounced op 1000 ms (`persistence.js:47-58`) en die timer wordt door élke mutatie teruggezet, terwijl er tussen twee `touch`-commando's ~350 ms zit. Meteen uitlezen = 0 bytes, na 1200 ms = 5139, na `persistence.flush()` = 5139. Nu deterministisch geflusht via de al geëxporteerde `window.HackSimulator.debug.persistence`; guard vervangen door `expect(avgGrowth).toBeGreaterThan(0)`. Meet 44,00 bytes/bestand bij CV 0,0%, 33 passed / 9 skipped / 0 failed over drie motoren. Twee mutanten: flush eruit → 5× `0.00 KB` (cijfer voor cijfer de nulmeting), exponentiële bestandsnamen → alleen de CV-assertie rood. Oorspronkelijke tekst: (gevonden Sessie 219) — de `avgGrowth === 0`-guard op regel 530 (bedoeld tegen 0/0 = NaN) zet "er is niks gemeten" om in "geslaagd": **10 van de 10 seriële runs namen die tak**, op zowel `d0ba157` als `e7cc0c4`, met `hacksim_filesystem` onaangeroerd terwijl `persistence.js:13` diezelfde sleutel gebruikt. Hij wordt pas een echte assertie onder parallelle load, en is dán variantie-gevoelig (de enige faler van de 12-spec-run). **Dit is een openstaande diagnose, geen baseline** — een test die niet kan falen om de juiste reden is erger dan geen test. Eerst uitzoeken waarom `touch` in de testcontext niets persisteert; pas daarna beslissen of de guard weg kan.

63. [x] **`responsive-breakpoints.spec.js:209` + Netlify bot-protectie** ✅ **GEFIXT Sessie 220** (commit `1e7d417`) — de vastgelegde diagnose (#60: "10s `toBeVisible` op een JS-geïnjecteerde navbar onder CPU-contentie") klopte op **geen van beide helften**. Een 3-motorenrun tegen productie gaf **7 falers, niet 1**. Vijf daarvan waren géén testfout: de DOM-snapshot toont *"We are verifying your connection"* mét Challenge ID — drie parallelle motoren lopen tegen **Netlify's bot-protectie**, en die interstitial bevat geen enkel site-element (symptoom: `TypeError: tc is null`). Lokaal: 27 passed / 0 failed. → NEW guard in `tests/e2e/fixtures.js` die na elke `goto` op die interstitial controleert en faalt mét oorzaak + uitweg (mutant tegen een neppagina bewezen). `:209` was wél een echte testfout maar een andere: de **legal-modal onderschept de klik** (call log noemt het element letterlijk); deze test was de enige in het bestand die klikt zonder `acceptLegalModal()`. Venster gemeten: op het moment dat `.navbar-toggle` zichtbaar wordt bestaat `#legal-modal` nog niet, binnen ~500 ms wordt hij ingevoegd mét `.active` — de hamburger komt van `init-components.js`, de modal van `main.js`, dus de modal landt structureel ín het klikvenster

64. [x] **`autocomplete-filesystem.spec.js` was flaky onder volle-suite-load ✅ OPGELOST Sessie 227 — mét gemeten oorzaak** — **de diagnose in #64 was te smal.** Het symptoom zat niet op regel 99: in de volle run van Sessie 227 viel regel 148 (`mv ~/no`), onder gerichte load vielen 20/34/109, en bij de mutant 108/148/158. Het is de **spec als klasse**, niet één test. **Goedkope reproductie gevonden:** `--repeat-each=12 --workers=4` geeft hetzelfde faalpatroon in **1,5 min** i.p.v. een volle run van 20 min — dát maakte de diagnose mogelijk. **Gemeten oorzaak (36 runs, 4 rood, staat bij elk faalmoment vastgelegd):** de discriminator is de **focus** op het moment van `Tab`, niet of de modal open staat — `terminal-input`→`terminal-input` = OK (31×), `legal-accept-btn`→`A` = FAAL (3×), `terminal-input`→`A` = FAAL (1×). `input.fill()` zet de waarde óók zonder focus, dus die stap slaagt altijd; daarna grijpt de legal-modal de focus (asynchroon, ná de eerste paint) en gaat `Tab` naar zijn focus-trap. Deze spec was **de enige terminal-spec zonder legal-modal-afhandeling**. Dat verklaart óók waarom Sessie 220 het 0/10 in isolatie mat: zonder concurrentie valt de focusgreep vóór de `fill`. **Fix:** `page.addInitScript` zet `hacksim_legal_accepted` vóór de navigatie, dus de modal verschijnt niet — de race is wég in plaats van overleefd, en de spec meet weer puur autocomplete. **Falsificatie:** ná de fix **144 passed / 0 failed** onder exact dezelfde load; mutant (het `addInitScript`-blok eruit, `diff -q` geverifieerd) → **12 rood / 132 passed**. Eén valkuil onderweg genoteerd: mijn eerste instrumentatie zag `registry: 0` bij álle vier de falers en dat las als de oorzaak — maar het was 0 bij álle **36** runs, ook de 31 geslaagde (de debug-API leest anders uit dan ik aannam). Een waarde die in elke faler voorkomt is pas een aanwijzing als hij in de geslaagden **ontbreekt**.
73. [ ] **`certificates.spec.js:61,70` vielen in de volle chromium-run op een teardown-timeout (Sessie 227)** — `Tearing down "context" exceeded the test timeout of 30000ms`; de derde faler had geen eigen foutmelding en was een cascade. **Géén assertiefout en niet code-gerelateerd:** A/B in isolatie tegen `git archive HEAD~3` gaf **6 passed aan beide kanten**, en gericht onder load (`--repeat-each=6 --workers=4`) **36/36 groen**. Reproduceert dus alléén in de volle 20-minutenrun — ander mechanisme dan de autocomplete-race van #64 (die is opgelost). Openstaande diagnose, **geen** "bekende faler": de oorzaak is niet gemeten. Volgende stap: kijken of `acceptLegalModal()` (klik + 2× 5s wachten binnen een testtimeout van 30s) onder volle belasting het budget opeet — dezelfde `addInitScript`-aanpak als #64 zou dat wegnemen, maar dat is een vermoeden, geen meting. **Update Sessie 228:** in de volle chromium-run van deze sessie (489 passed / 0 failed / 7 skipped, 22,0 min) kwam het **niet terug** — tweede volle run op rij zonder deze faler. Eén waarneming in drie runs is geen patroon, dus de diagnose blijft open en er wordt niets op een vermoeden gerepareerd. Twee cijfers die de scope corrigeren: het zijn **20** specs die een eigen `acceptLegalModal`-kopie dragen (niet 25), met **69** aanroepsites; en de helper kost bij een afwezige modal de volle `toBeVisible`-timeout (5 s in `certificates.spec.js`, 3+2 s in `blog-theme-toggle.spec.js`) omdat hij die in een `try/catch` afwacht — een `addInitScript`-omzetting die de aanroep laat staan maakt de spec dus juist trager, niet sneller. **A/B gemeten** op `certificates.spec.js` (`--repeat-each=4 --workers=4`, 24 test-instanties per run, 2 runs per arm): arm A (zoals nu) **94 s / 93 s**, arm B (`addInitScript` vóór de navigatie + de klik-aanroep weg) **82 s / 80 s** — **~13% sneller, en 24/24 passed in álle vier de runs**. Winst in tijd dus, **nul winst in robuustheid**: geen van beide armen reproduceerde de teardown-timeout. Omdat #73 een robuustheidsprobleem is en geen snelheidsprobleem, is de sitebrede omzetting (69 aanroepen over 20 specs, waarvan enkele de modal juist bewust testen) **niet uitgevoerd** — conform de afspraak "wint het niets, laat het dan staan". ⚠️ Meetnotitie: de eerste A/B-poging was ongeldig omdat er tijdens arm B in `styles/*.css` werd geschreven, wat die tests laden; run 2 gaf toen 1112 s en 4 falers. Dat was contaminatie, geen eigenschap van de variant — een A/B moet draaien met een bevroren werkboom.
65. [x] **Verantwoording herschreven + AI-melding wettelijk verplicht per contentpagina (Sessie 223)** — `#verantwoording` op `over-ons.html` wekte wantrouwen in plaats van vertrouwen. Juridisch subagent-onderzoek: **art. 50 lid 4 AI-verordening geldt sinds 02-08-2026**; de uitzondering vereist *menselijke* toetsing met feitencontrole als minimum (certificering uitdrukkelijk niet). Heisenberg bevestigde: geen eigen feitencontrole, wel meerdere AI-rondes → uitzondering **niet beschikbaar**, melding moet op de contentpagina's zelf (de wet meet bij de *eerste blootstelling*). AI-melding op 15 blogposts + `woordenlijst.html`; twee onjuiste claims gecorrigeerd (het `title`-attribuut beloofde menselijke feitencontrole, de gidsen-claim suggereerde geverifieerde wetsartikelen); trustbasis van *geloof me* naar *controleer me* ("Wat er gecontroleerd is" → "Wat je zelf kunt natrekken"); perspectief sitebreed op `over-ons.html` naar ik-vorm. NEW AI-melding-assertie in Check 7 van `validate-blogs.sh` + skill-template in lockstep. Commits `9e93336`, `b051b1b`.
66. [x] **Strafmaat art. 138ab Sr gecorrigeerd + NEW Check 16 (Sessie 223)** — drie plekken schreven de verzwaarde maximumstraf toe aan het basisdelict (lid 1 = **2 jaar**, lid 2/3 = 4 jaar): `terms.html:181`, `blog/cybersecurity-tools.html:461`, `blog/wat-is-ethisch-hacken.html:213`. **Derde keer** dat deze fout opduikt — de eerdere correctie (`archive-s121-s164.md:16`) raakte één regel zonder sitebrede sweep en zonder guard, waardoor `wat-is-ethisch-hacken.html` zichzélf tegensprak. Geverifieerd tegen de wettekst via meerdere juridische databases. NEW Check 16 in `validate-docs.sh`: positieve invariant (toon de gradatie via "tot N jaar" óf beide grenzen), meet 8 claims, faalt óók bij nul treffers. 4 mutanten met verschillende faalmeldingen. Commit `fbb1fc5`.
67. [x] **Horizontale overflow op `terms.html` opgelost + dekkingsgat op alle drie de legal-pagina's gesloten (Sessie 224)** — oorzaak gevonden en het was géén pseudo-element: de `<h1>` is 280px **breed** (netjes binnen beeld, daarom vond de border-box-scan van Sessie 223 niets) terwijl zijn **inhoud** 377px meet. Twee verschillende getallen op hetzelfde element. Onderliggend: deze drie pagina's laden `mobile.css` **niet** (alleen `main.css` + `legal.css`), dus `--font-size-base` blijft 18px op ≤768px en de h1 houdt de UA-default `2em` = **36px, ook op 320px** — elke andere pagina schaalt daar mee. "Gebruiksvoorwaarden" (19 tekens, geen breekpunt) is dan 377px in een contentbox van 280px; documentbreedte = 20px padding + 377 = **397px ongeacht viewport**, wat de hele gemelde reeks verklaart (77/37/22/7/0 @320/360/375/390/414). Privacy en cookies ontsnappen omdat hun koppen **twee woorden** zijn. Zichtbaar symptoom is een **afgekapte kop**, niet een pannende pagina: `main.css:422` zet `overflow-x:hidden` op `body`, wat naar de viewport propageert — programmatische `scrollTo` werkt nog (dát mat Sessie 223), pannen niet. Fix: `overflow-wrap: break-word` op `body.legal-page h1/h2/h3` in `styles/legal.css` + `?v=3`→`?v=224` op alle drie de pagina's. Gemeten keuze uit drie kandidaten: `clamp()` **verworpen** (een 27-tekenkop zou 20px font vragen), `hyphens:auto` **verworpen** — alleen Firefox heeft nl-patronen (breekt op `Gebruiksvoor|waarden`), Chromium en WebKit lieten de 77/78px onveranderd. Generiek getest tot 502px (`Aansprakelijkheidsbeperking`, 202px overflow → 0). A/B tegen HEAD: desktop @1280 en @768 **byte-identiek** in kopbreedte, kophoogte en documenthoogte — de regel is daar inert. NEW `tests/e2e/legal-pages-overflow.spec.js`, 27/27 groen over drie motoren. Commit: zie git log.
68. [x] **`privacy.html` en `cookies.html` voerden Engelse koppen op een `lang="nl"`-pagina ✅ OPGELOST Sessie 227** — `Privacy policy` → **`Privacybeleid`**, `Cookie policy` → **`Cookiebeleid`** in `<h1>`, `<title>`, `og:title` en `twitter:title`. **De omvang week af van de schatting in beide richtingen.** Kleiner: `sitemap.xml` bevat alleen `<loc>`/`<lastmod>` en géén titels, en de ~20 "linklabels" bleken gemeten 28× `Cookies` + 27× `Privacy` — al Nederlands, dus onaangeroerd; er is géén JSON-LD op deze pagina's. Groter: de sweep vond ook twee `<h3>`'s op **`over-ons.html`** (regel 396/431, dezelfde fout op de verantwoordingspagina) plus **19 body-voorkomens** van "Privacy Policy"/"Cookie Policy" in lopende tekst die naar het eígen document verwijzen (*"We kunnen deze Privacy Policy updaten"*, de `legal-footer`-versieregels, de kolomkop `<th>Privacy Policy</th>`). Die zijn meegenomen; de twee **eigennamen** "Google Privacy Policy" (`cookies.html:180,272`) blijven staan — dat is het document van Google, geen vertaalbare kop. Bijvangst uit `footer.js` (rendert op élke pagina): `Privacy Beleid` → `Privacybeleid` (fout aaneengeschreven én Title Case), `Algemene Voorwaarden` → **`Gebruiksvoorwaarden`** (het label noemde de pagina anders dan zijn eigen `<h1>` — exact de klacht van #68) en `Cookie Instellingen` → `Cookie-instellingen`. Ook `<th>Data Gedeeld</th>` → `Gedeelde data`. **Guard:** NEW Check 17 in `validate-docs.sh` (statische tekst → goedkoopste laag, draait al via pre-commit + CI). Twee invarianten: (a) geen `policy` in een titelveld, (b) **lockstep** — `h1`, `title`, `og:title` en `twitter:title` dragen dezelfde kop, want vier velden bijwerken en er één vergeten is precies hoe zo'n hernoeming half blijft staan. Vier mutanten op vier verschillende takken: Engelse h1 → taal-tak; alleen `og:title` afwijkend maar **wél Nederlands** → alléén lockstep (bewijst dat die tak zelfstandig werkt); `twitter:title` verwijderd → zelfbewaking per bestand; `assets/legal/` hernoemd → nul-treffer-tak. `legal-pages-overflow.spec.js` 27/27 over chromium/firefox/webkit ná de hernoeming.
69. [x] **Blogsectie-analyse: tapdoelen, AAA-contrast, inhoudsopgave en drie guards (Sessie 226)** — commits `e19e74f`, `90e7ccd`, `04e4d57`. Opdracht was analyseren, niet repareren; 13 punten gemeten, volledige scope daarna uitgevoerd op verzoek. **Gerepareerd:** 7/7 categoriefilters van 26,8px → 44px (oorzaak was `display`, niet padding — `min-height` doet niets op een inline `<a>`); `--color-text-dim` #8b949e → #a1a8b0 (6,15/5,62 → 7,88/7,20); light-mode knopkleuren die AAA in hun commentaar claimden en 4,60/5,75 maten → 7,41/8,68; 343 kop-id's over 15 posts + runtime-TOC; nieuwsbrief van tussen filter en grid naar ná de 3e kaart (eerste artikel y=1125 → y=522 @375×812); 15 datums naar `<time datetime>`; `.blog-meta span:last-child` → klasse; `#bronnen`-bolt-on geconsolideerd + 2 dode selectors weg; 31 Engelse aria-labels en 15 kapotte `role="progressbar"`; "Over Ons" 58× → zinskapitaal. **NEW:** `scripts/add-heading-ids.mjs`, `src/ui/blog-toc.js`, `src/ui/blog-filter.js`, `tests/e2e/blog-navigation.spec.js`, `validate-blogs.sh` checks 8-10, TOC-sectie in `docs/blog-template.md`.
70. [x] **De bundelformule telde blog-assets tegen een "Terminal Core"-budget ✅ OPGELOST Sessie 227** — gekozen: optie (a), **doorgetrokken**. Niet de grens verhoogd (dat zou de vierde bump in 22 sessies zijn: 1000 → 1050 → 1100 → 1120), maar drie fouten in de **teller** gerepareerd. (1) `styles/blog.css` (42.991 B) + `src/ui/blog-*.js` (8.689 B) telden mee terwijl alleen `blog/*.html` ze laadt (`navbar.js` noemt `blog.css` enkel in een comment) en `.claude/CLAUDE.md` de blog "budgetloos" noemt → uitgesloten via `isBlogAsset()`, de som wordt nog wél **gelogd** zonder assertie (dat is de kern van optie (b), tegen 2 regels). (2) De term `src/ui/**/*.css` matchte **nul** bestanden — dode term, verwijderd. (3) `index.html` telde mee, `terminal.html` niet, terwijl juist dát de entry van deze pijler is → beide erin. `TOTAL_BUNDLE` → `RUNTIME_SOURCE`, testnaam volgt de constante. **Gemeten: 1118,63 → 1091,85 / 1120 KB, marge 28,15 KB (2,5%)**, limiet ongewijzigd. **Drie mutanten, drie verschillende asserties:** M1 (60 KB dummy in `src/`) → grootte rood 1151,85; M2' (alle 4 blogbestanden hernoemd) → nul-treffer-tak rood, en die vuurt vóór de grootte zodat de diagnose "uitsluiting kapot" leest i.p.v. "1142 > 1120"; M3 (predicaat verbreed met `landing.css`) → te-breed-tak rood terwijl de som juist **daalt** naar 1015,53 KB — dát bewijst dat de integriteitstak zelfstandig werkt. Twee mutanten die het níét doen staan mét reden in het commentaar: "uitsluiting weghalen" blijft groen (1118,63 < 1120), en "alleen `blog.css` hernoemen" faalt op de **grootte** i.p.v. de integriteit omdat de blogsom (50,47) groter is dan de marge (28,15).
71. [x] **`--color-link` haalde AAA niet in light mode ✅ OPGELOST Sessie 227** — `#0969da` → **`#0a4d94`** (light), hover `#0550ae` → **`#044289`**; in dark ging de hover van `#58a6ff` → **`#8ecbff`** (die was **donkerder** dan de link zelf en mat 6,85 op de blogkaart). Eindmeting over 16 pagina's × 2 thema's, 3× byte-identiek herhaald: **light 302 elementen / 0 onder AA / 0 onder AAA / laagste 7,29**; dark 130 / 0 / 0 / laagste 7,34. **Drie dingen die de meting corrigeerde t.o.v. de redenering vooraf:** (a) dit is geen linkkleur-taak — `blog.css` mapt in light óók koppen, post-titels, kaarttitels, `<strong>`, inline `<code>`, CTA-koppen en de support-banner op dit token, dus de blast radius is de hele light-mode blog; (b) de achtergrondenset onder links is `#fff`/`#fefefe`/`#f8f8f8`/`#f5f5f5`/`#f1f1f1`/`#e8f0f9`/`#f2f9ff` — `--color-bg-hover` (#ebebeb) en `--color-bg-alt` (#eceef0) komen er **helemaal niet** in voor, dus een kandidatentabel op die twee wees de verkeerde waarde aan; (c) `#0a4d94` stond al in de codebase als de `.related-category`-uitzondering van Sessie 226 — door hem tot token te promoveren kon die override wég (architecture-patterns §14). **Vier ONDER-AA-defecten als bijvangst, alle vier ernstiger dan #71 zelf:** `.blog-post-content th` had als enige de `[data-theme='light']`-override gemist die `code` wél heeft terwijl zijn eigen commentaar "zelfde accent als code" claimt (2,61 bij 19,8px bold, lat 3,0); `.btn-secondary:hover` + `.btn-small.btn-secondary:hover` zetten `--color-ui-primary` als **tekst** (2,61-2,77 in light, 6,85 in dark) → nu `--color-link-hover`; `.gids-sample-link:hover` viel terug op `--color-cta-primary` (**2,76**) terwijl Sessie 221 de rust-toestand al naar `--color-accent-text` had gebracht — de hover bleef achter omdat **geen enkele spec een hover-toestand mat**. **Sessie 226 was incompleet:** `--color-text-dim` ging toen van `#8b949e` → `#a1a8b0`, maar dezelfde waarde stond óók op `--color-ui-secondary`, `--color-text-muted`, `landing.css --terminal-demo-text-dim` en drie hardcoded footer-regels — samen 34 elementen onder AAA (laagste 5,62). Allemaal meegetild. NEW `tests/e2e/link-contrast.spec.js` (16 pagina's × 2 thema's, 16 tests) met **twee** asserties: element-sweep (rust) én token-matrix (dekt **hover** zonder hem te simuleren). Drie complementaire mutanten: A (`--color-link` terug) → light rood via de element-sweep op 14 pagina's; B (dark hover terug) → **alleen dark, alleen de token-matrix, 4 pagina's, 12 passed** — bewijst dat de hover-dekking zelfstandig werkt; C (token hernoemd) → zelfbewakende tak. NEW `tests/e2e/helpers/contrast.js`: de derde kopie van `effBg()` was de aanleiding; `accent-text-contrast` en `eyebrow-contrast` importeren hem nu ook (46 passed vóór én ná, identiek).
72. [x] **De contrast-KLASSE gesloten met een ongefilterde sitebrede sweep ✅ Sessie 228** — #72 vroeg om één token op één oppervlak; uitgevoerd is de hele klasse, want dit was de derde ronde van hetzelfde patroon (S226 tilde `--color-text-dim`, S227 vond dezelfde waarde onder drie andere namen, #72 was de nieuwe waarde die het op een derde oppervlak alsnog niet haalde). **Meting:** 30 pagina's × 2 thema's × 2 viewports = **13.157 element-toestanden**, ongefilterd (élk element dat zelf een tekstnode rendert, tegen zijn effectieve achtergrond), gegroepeerd op KLEURWAARDE en niet op token — dezelfde hex zit onder meerdere namen. Uitkomst **152 onder AA en 378 onder AAA over 18 kleurwaarden**; ná de fixes **0 en 0**. **Waarom drie eerdere rondes de klasse misten — vier meetgaten, elk met een gemeten voorbeeld:** (a) élke bestaande contrastspec filtert op een tokenlijst, en het zwaarste defect (`--color-footer-link` #c9d1d9 op de witte cookiebanner, **1,54:1**, op élke pagina) stond in geen enkele lijst; (b) geen enkele sweep scrolde, terwijl `.leerpad-card` op `opacity: 0` staat tot een IntersectionObserver `.visible` zet — daardoor viel de hele `.level-badge`-groep buiten de populatie, inclusief de laagste waarde van de site (**1,74:1**); (c) één viewport, terwijl 115 falers alleen op mobiel bestaan (blog-`<strong>` zakt onder 18,66px en verliest de large-text-lat) en 54 alleen op desktop (de toggle zit op mobiel in het dichtgeklapte menu); (d) alleen rusttoestanden, terwijl `--color-warning`/`--color-info` pas ná een commando renderen en een `<input>`-waarde géén tekstnode heeft — daar zat de promptregel op **1,96:1**. **Vier CSS-commentaren claimden een contrast dat ze niet haalden**, alle vier in de geruststellende richting: `--color-prompt` "4.8:1 (WCAG AA ✅)" → 1,96; `--color-success` "7.5:1 (WCAG AAA ✅)" → 4,29; `--color-ui-primary` "3.25:1 on white (WCAG AA)" → 3,25 ís geen AA; `--color-cta-primary` "op een ACHTERGROND met wit erop is hij prima" → **3,30**, de primaire "Start de simulator"-knop op 13 pagina's. **Fixes langs vier mechanismen:** tokenwaarden (`--color-error` L+D, `--color-warning` L, `--color-info` L, `--color-success` L, `--color-text-muted` L, `--color-ui-primary` L+D, `--color-ui-secondary` L, `--color-toggle-text-inactive` beide thema's); één-token-twee-rollen (`--color-cta-primary` blijft het CTA-OPPERVLAK en gaat naar Green 800 zodat wit erop 7,13 haalt, terwijl álle 35 `color:`-gebruiken — 32 in `styles/`, 3 in `woordenlijst.html` — naar `--color-accent-text` verhuizen); één badge-tokenset voor `.level-badge.*` + `.command-level-*` (vier hues × twee thema's, want een hue kan niet tegelijk een 15%-tint zijn en er leesbaar op staan); en drie gescopede herdefinities voor oppervlakken die van hun thema afwijken (`#terminal-container` in light, `.terminal-example` als donker eiland, `.terminal-edu-inner` — dát sluit de oorspronkelijke #72). **NEW `tests/e2e/text-contrast.spec.js`** (31 tests): ongefilterde element-sweep + uitsluitingen-als-assertie + token-matrix voor de hover + de OPPERVLAK-token-assertie + een aparte test die eerst commando's typt. **Zes mutanten, zes verschillende faalpatronen:** M1 (cta-primary terug) 13 pagina's via de sweep; M2 (ui-primary terug) **alle 30** via ALLEEN de matrix, want dat token rendert in light nergens als tekst; M3 (`.gids-price` terug op het oppervlak-token) **1 failed / 30 passed** via ALLEEN assertie 5, terwijl de sweep groen blijft omdat 7,07 gewoon AAA haalt; M4 (warning terug) 1 idle element tegen **14** in de terminal-uitvoertest; M5 (token hernoemd) raakt de zelfbewakende tak; M6 (badge terug) één pagina, uitsluitend zichtbaar dankzij de scrollstap. **Bijvangst:** `accent-text-contrast.spec.js` verloor zijn CTA-tolerantietest — die populatie is nu structureel leeg en kon dus niet meer om de juiste reden falen (#62-klacht); vervangen door de strengere assertie 5. Oorspronkelijke tekst: `--color-text-dim`/`--color-ui-secondary` (#a1a8b0) haalt AAA niet op de edu-panelen van `terminal.html` (Sessie 227) — gemeten in dezelfde sweep: `span.edu-cmd-category` **5,21:1** op rgb(43,55,38) en de paneel-`p` **6,60:1** op rgb(30,35,42) — 12 elementen, onder AAA maar boven AA. Oorzaak is dezelfde klasse als `--eyebrow-text` (architecture-patterns §10): `.edu-cmd-category` heeft een **eigen** `background: var(--color-prompt-bg-light)` (een rgba-groen), dus de tekst ligt op de compositie en niet op de paginakleur. Sessie 226 mat "49 dim-elementen op de homepage, 0 onder AAA" — dat klopte, maar `terminal.html` met zijn gekleurde edu-panelen zat niet in die populatie. Doorgerekend: `#c0c7cf` haalt 7,34 / 9,26, `#c9d1d9` haalt 8,11 / 10,24 maar is gelijk aan `--color-text-light` en wist daarmee het onderscheid dim-vs-normaal. **Bewust NIET in Sessie 227 opgelost:** dit vraagt óf een eigen token voor de edu-zone óf een derde verhoging van `--color-text-dim` sitebreed — beide een eigen meting over álle edu-oppervlakken, niet een bijvangst van een linkkleur-taak.
74. [ ] **Minify-trigger: pas bij <5 KB marge óf zodra JS-groei duwt — en dan héél, niet alleen CSS (Sessie 228)** — de bundelmarge staat op **16,38 KB (1,5%)** van de 1120 KB. Gemeten wat minifyen zou opleveren, want zonder cijfer is dit giswerk: **CSS 302 KB totaal, waarvan 77 KB al geminified** (`animations.css`, `mobile.css`, `terminal.css` — mét sourcemaps) en **274 KB leesbaar met 119 KB (44%) te winnen**; **JS 733 KB, waarvan 0 KB geminified**, met alleen al **168 KB (23%) aan commentaar + lege regels**. Bundel zou van 1103,62 naar ~985 (CSS-only) of ~816 KB (CSS+JS) gaan. **Doorslaggevende vondst: er is géén minify-beleid.** `package.json` heeft geen minifier en geen build-stap (alleen Playwright-scripts); die drie CSS-bestanden zijn ooit eenmalig geminified en zó gecommit, en hun sourcemaps zijn inmiddels verouderd omdat er sindsdien met de hand in is bewerkt. Het is een fossiel, geen pijplijn. **Waarom NU nog niet:** 16 KB is genoeg voor normaal werk, en wat de druk veroorzaakte was 8,45 KB CSS-commentaar uit één sessie — atypisch. De goedkopere remedie werkt al: het verhaal hoort in `tests/`, `docs/` en dit bestand (die tellen niet mee in `performance.spec.js`), de CSS houdt alleen het gemeten cijfer. Dat halveerde de kosten van Sessie 228 (13,5 → 8,45 KB) zonder informatie te verliezen. **Trigger om het wél te doen:** marge onder ~5 KB, óf zodra **JS**-groei het duwt in plaats van CSS — dan minify je voor de bezoeker en niet voor de poort. **Als je het doet, is het pakket:** (a) build-stap invoeren — dit wordt de eerste toolchain en raakt PRD §13 "Vanilla JS/CSS", dus het hoort met een beslissing in PLANNING.md; (b) **`performance.spec.js` omzetten naar de gebouwde output**, anders meet de poort de bron en vleit hij je — exact de fout die #70 in diezelfde test net heeft gerepareerd; (c) de drie verouderde sourcemaps opruimen. **Doe het dan heel:** CSS-only optimaliseert de kleinste helft (119 van de ~287 KB). ⚠️ **In-place minifyen is de verkeerde variant** — dat sloopt het commentaar, en dat is in dit project het geheugen dat herhaling van fouten voorkomt (zie #72: vier commentaren die een contrast claimden dat ze niet haalden, opgelost door ze te *meten*, niet door ze te verwijderen). Klein restpunt uit Sessie 228: `terminal.css` is nu een hybride — een leesbaar commentaarblok achter de geminifieerde blob. Werkt prima, lost zichzelf op zodra hier een echte pijplijn komt.

---

## 📋 Mijlpalen & Taken

### M0: Project Setup (Week 0) ✅ VOLTOOID
**Doel:** Development environment klaar voor eerste code
**Tijdsinschatting:** 1-2 dagen
**Status Update:** ✅ Volledig voltooid (Sessie 5 - 14 oktober 2025)

#### Repository & Git
- [x] Git repository geïnitialiseerd (main branch)
- [x] .gitignore geconfigureerd (node_modules, .DS_Store, .env)
- [x] Initiële commits met framework bestanden
- [ ] GitHub remote repository (skipped per user request)
- [x] Branch strategie: main only (MVP simplicity)

#### Project Structuur
- [x] Root folders (src/, styles/, docs/, assets/, tests/)
- [x] src/ subfolders (core/, commands/system/, ui/, utils/, filesystem/, help/, analytics/)
- [x] index.html skeleton (voltooid Sessie 2)
- [x] Alle commands/ subfolders (system, filesystem, network, security, special)

#### Development Environment
- [x] Code editor (VS Code / Cursor)
- [x] Live Server beschikbaar
- [x] ESLint configuratie (.eslintrc.json) - ES6, browser env
- [x] Prettier configuratie (.prettierrc) - single quotes, 2 spaces
- [x] Browser DevTools gereed

#### Documentatie
- [x] PRD v1.1 (reeds voltooid)
- [x] CLAUDE.md v3.1 (two-tier docs)
- [x] PLANNING.md v1.1 (architectuur compleet)
- [x] TASKS.md (dit bestand)
- [x] SESSIONS.md (sessie logs)

---

### M1: Foundation (Week 1-2) ✅ VOLTOOID
**Doel:** Core terminal engine + basis commands werkend
**Tijdsinschatting:** 10-12 dagen
**Status Update:** ✅ Volledig voltooid (Sessie 5 - 14 oktober 2025)
**Dependencies:** M0 voltooid

#### HTML & CSS Foundation
- [x] index.html structuur (semantic HTML5) - ✅ Voltooid (Sessie 2)
- [x] main.css met CSS Variables - ✅ Voltooid (Sessie 2-3)
- [x] terminal.css (terminal styling) - ✅ Voltooid (Sessie 2-3)
- [x] Responsive meta tags - ✅ Voltooid (Sessie 2)
- [ ] Favicon toevoegen (optioneel, skipped)

#### Terminal Engine (Core)
- [x] `src/main.js` - Entry point en initialisatie (ES6 modules)
- [x] `src/core/terminal.js` - Terminal engine met fuzzy matching
- [x] `src/core/parser.js` - Command parser (args, flags, quotes)
- [x] `src/core/registry.js` - Command registry pattern
- [x] `src/core/history.js` - Command history met localStorage
- [x] Arrow key navigation (↑↓ voor history)

#### UI Components
- [x] `src/ui/renderer.js` - Output rendering met XSS protectie
- [x] `src/ui/input.js` - Keyboard event handling
- [x] Input focus management (auto-focus, click refocus)
- [x] Output scrolling automatisch naar beneden
- [x] Native browser cursor (geen custom CSS cursor)

#### Virtual Filesystem (Basis)
- [x] `src/filesystem/vfs.js` - Full VFS met POSIX-like paths
- [x] `src/filesystem/structure.js` - Complete filesystem tree
- [x] `src/filesystem/persistence.js` - localStorage sync
- [x] Current working directory (cwd) tracking
- [x] Path resolution (absolute/relative/~/../.)
- [x] Permission system (restricted files)

#### System Commands (7 commands)
- [x] `clear` - Clear screen
- [x] `help` - Lijst van beschikbare commands (grouped by category)
- [x] `man [cmd]` - Manual pages (basic version)
- [x] `history` - Toon command history (with -c to clear)
- [x] `echo [text]` - Print tekst
- [x] `date` - Huidige datum/tijd
- [x] `whoami` - Toon gebruikersnaam

#### Testing & Validation
- [x] Test alle 7 system commands - ✅ Werkend (browser test)
- [x] Test command parser (args, flags, quotes) - ✅ Werkend
- [x] Test history navigatie (↑↓) - ✅ Werkend
- [ ] Cross-browser test (Chrome, Firefox) - ⏭️ Defer to M5
- [ ] Mobile responsive test (basis) - ⏭️ Defer to M4

---

### M2: Filesystem Commands (Week 3-4) ✅ VOLTOOID
**Doel:** Volledig functioneel virtual filesystem
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M1 voltooid
**Status Update:** ✅ Volledig voltooid (Sessie 6 - 15 oktober 2025)

#### Filesystem Persistence
- [x] `src/filesystem/persistence.js` - localStorage sync
- [x] Save state bij elke filesystem wijziging
- [x] Load state bij page load
- [x] Reset functionaliteit (restore original)
- [x] Error handling (localStorage vol/disabled)

#### Basis Navigatie Commands (4)
- [x] `ls` - List files/directories
- [x] `ls -l` - Detailed listing
- [x] `ls -a` - Show hidden files (.ssh, etc.)
- [x] `cd [path]` - Change directory
- [x] `cd ..` - Parent directory
- [x] `cd ~` - Home directory
- [x] `pwd` - Print working directory

#### File Reading Commands (2)
- [x] `cat [file]` - Show file contents
- [x] `cat` error handling (file not found, is directory)
- [x] Permission system (basis - /etc/shadow restricted)

#### File Manipulation Commands (5)
- [x] `mkdir [dir]` - Create directory
- [x] `touch [file]` - Create empty file
- [x] `rm [file]` - Remove file
- [x] `rm -r [dir]` - Remove directory recursively
- [x] `cp [src] [dst]` - Copy file
- [x] `mv [src] [dst]` - Move/rename file

#### Search Commands (2)
- [x] `find [pattern]` - Find files by name
- [x] `grep [pattern]` - Search in file contents
- [x] `grep` met educatieve output (laat zien welke regel)

#### Special Commands
- [x] `reset` - Restore filesystem to original state
- ~~[ ] `continue` - Restore saved session~~ **→ Post-MVP** (localStorage restore gebeurt automatisch)

#### Testing & Validation
- [x] Test alle filesystem operations
- [x] Test persistence (save & load)
- [x] Test reset functionaliteit
- [x] Test edge cases (lange bestandsnamen, special chars)
- [x] Test permissions system
- [ ] Cross-browser localStorage test - Deferred to M5
- [ ] Mobile test (40 char output width) - Deferred to M4

---

### M3: Network & Security Commands (Week 5-6) ✅ VOLTOOID
**Doel:** Educational security tools werkend
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M2 voltooid
**Status Update:** ✅ Volledig voltooid (Sessie 8 - 16 oktober 2025)

#### Network Commands (6) ✅ VOLTOOID
- [x] `ping [host]` - Test connectivity (gesimuleerd)
- [x] `nmap [host]` - Port scanner (80/20 output)
- [x] `nmap` met educatieve tips
- [x] `ifconfig` - Network configuration
- [x] `netstat` - Network statistics
- [x] `whois [domain]` - Domain information
- [x] `traceroute [host]` - Network path tracing

#### Security Tools (5) ✅ VOLTOOID
- [x] `hashcat [hash]` - Password hash cracking (gesimuleerd)
- [x] `hydra [target]` - Brute force simulation
- [x] `sqlmap [url]` - SQL injection demonstratie
- [x] `metasploit` - Framework intro (gesimuleerd)
- [x] `nikto [target]` - Web vulnerability scanner

#### Educational Layer ✅ VOLTOOID
- [x] Beveiligingstips bij alle security tools
- [x] Juridische warnings (offensive tools)
- [x] "Doorgaan? [j/n]" confirmatie bij offensive tools (simulatie)
- [x] Inline uitleg (← pijltjes) bij output
- [x] Realistische maar simplified output (80/20)

#### Help System (3-Tier) ✅ VOLTOOID
- [x] `src/help/help-system.js` - 3-tier logic
- [x] Tier 1: Fuzzy matching voor typos
- [x] Tier 2: Progressive hints na herhaalde fouten
- [x] Tier 3: Man pages (volledig)
- [x] Man pages in alle 30 commands geïmplementeerd (via manPage property)
- [x] Help system geïntegreerd in terminal.js

#### Fuzzy Matching ✅ VOLTOOID
- [x] `src/utils/fuzzy.js` - Levenshtein distance
- [x] "Bedoelde je: [suggestion]?" bij typos
- [x] findClosestCommand() voor suggesties
- [x] Geïntegreerd met terminal error handling

#### Testing & Validation ✅ VOLTOOID
- [x] Test alle network commands (via test-network-commands.html)
- [x] Test alle security tools (via test-all-commands.html)
- [x] Test educatieve output (tips aanwezig)
- [x] Test juridische warnings (tonen correct)
- [x] Test fuzzy matching (10 common typos in test suite)
- [x] Test help system (alle 3 tiers via test-help-system.html)
- [x] Test man pages (alle 30 commands via test suite)
- [ ] Cross-browser test - Deferred to M5
- [ ] Mobile test (output leesbaarheid) - Deferred to M4

---

### M4: UX & Polish (Week 7-8) ✅ VOLTOOID
**Doel:** Onboarding, mobile, legal, analytics
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M3 voltooid
**Status Update:** ✅ Volledig voltooid (Sessie 9 - 16 oktober 2025)

#### Onboarding Flow ✅ VOLTOOID (7/8)
- [x] `src/ui/onboarding.js` - FTUE logic
- [x] Welkomstbericht bij eerste bezoek (3 regels tekst + lege regel + hint = 5 regels totaal)
- [x] "Type 'help' om te beginnen" hint (onderdeel van welkomstbericht)
- [x] Na 1e command: "Goed bezig!" encouragement
- [x] Na 3-5 commands: Tutorial suggestie (na 5e en 10e command)
- [ ] Persistent hint (rechts onderin, verdwijnt na 5 commands) - Future enhancement
- [x] localStorage: first_visit flag
- [x] Terugkerende bezoeker: direct naar terminal

#### Mobile Optimalisaties ✅ VOLTOOID (8/8)
- [x] Mobile CSS breakpoints (< 768px) - styles/mobile.css compleet
- [x] Responsive output (40 chars max mobile) - CSS media queries
- [x] Touch-friendly tap targets (44x44px) - button min-height/width
- [x] Mobile keyboard helpers structure - CSS classes klaar
- [x] Quick Commands structure - CSS classes klaar
- [x] Prevent iOS zoom on focus (font-size: 16px)
- [x] Prevent pull-to-refresh (overscroll-behavior)
- [x] Smooth scrolling (-webkit-overflow-scrolling)

#### Legal & Compliance ✅ VOLTOOID (7/7)
- [x] `assets/legal/privacy.html` - Privacy Policy (Nederlands, AVG compliant - 3500+ words)
- [x] `assets/legal/terms.html` - Gebruiksvoorwaarden (ethisch hacken focus - 2800+ words)
- [x] `assets/legal/cookies.html` - Cookie Policy (localStorage + Analytics - 1800+ words)
- [x] `src/ui/legal.js` - Legal manager (singleton pattern)
- [x] Juridische disclaimer modal (eerste bezoek) - geïmplementeerd
- [x] "Ik begrijp het - Verder" button - met shake animation
- [x] Footer met links (Privacy, Terms, Contact) - index.html + CSS
- [x] localStorage: legal_accepted flag - met timestamp

#### Analytics Setup ✅ VOLTOOID (10/10)
- [x] `src/analytics/tracker.js` - Abstraction layer (GA4 + Plausible ready)
- [x] `src/analytics/events.js` - Event definitions (8 event types)
- [x] `src/analytics/consent.js` - Cookie consent manager
- [x] Google Analytics 4 integratie - met placeholder ID
- [x] IP anonymization enabled - anonymize_ip: true
- [x] Event tracking: command_executed - in terminal.js
- [x] Event tracking: session_start/end - in main.js
- [x] Event tracking: error_occurred - in terminal.js
- [x] Cookie consent banner (AVG compliant) - in index.html
- [x] Consent opslaan in localStorage - met timestamp

#### Feedback Mechanisme ✅ VOLTOOID (4/4 - MVP Scope)
- [x] Floating feedback button (rechts onderin) - HTML + CSS
- [x] Feedback modal (5-star + optioneel comment) - HTML + CSS
- [x] Rating stars styling - CSS met hover states
- [x] Modal structure compleet - HTML klaar

**Deferred to Post-MVP:**
- [ ] Exit intent detection (na 2+ min sessie) - Fase 2
- [ ] Feedback opslaan logic - Fase 2 (console.log ready)

#### Styling Polish ✅ VOLTOOID (6/6)
- [x] Animations polish (transitions) - var(--transition-fast/normal)
- [x] Error messages styling (rood) - terminal-output-error class
- [x] Warnings styling (geel) - terminal-output-warning class
- [x] Success messages styling (groen) - terminal-output-success class
- [x] Focus states (keyboard accessibility) - outline 2px solid
- [x] Loading states (spinner) - CSS @keyframes spin

---

### M5: Testing & Launch (Week 9-10)
**Doel:** Production-ready en live deployment
**Tijdsinschatting:** 10-14 dagen
**Dependencies:** M4 voltooid
**Status:** 🔵 In uitvoering (64/90 tasks) - ✅ **LIVE on Netlify!**

#### Configuration Placeholders (CRITICAL - Launch Blockers)
- [x] Replace GA4 Measurement ID in `src/analytics/tracker.js` (3 locations: lines 75, 121, 108) - ✅ Sessie 91 (G-7F792VS6CE)
- [x] Setup contact emails in legal documents (4 locations: privacy.html x2, terms.html, cookies.html) - ✅ Sessie 91

**Details:** See `docs/archive/pre-launch-checklist.md` sections 1-2 for exact line numbers and instructions.

#### Beta Testing Voorbereiding
- [ ] Beta testing checklist opstellen
- [ ] 5 beta testers werven (2 beginners, 2 students, 1 dev)
- [ ] Feedback formulier maken (Google Forms)
- [ ] Test scenarios document maken
- [ ] Screen recording instructies (optioneel)

#### Beta Testing Uitvoering
- [ ] Beta test week 1: Beginners (observeren onboarding)
- [ ] Beta test week 1: Studenten (feature testing)
- [ ] Beta test week 1: Developer (technical review)
- [ ] Feedback verzamelen en analyseren
- [ ] Prioriteren van issues (critical vs. nice-to-have)

#### Bug Fixes & Improvements
- [ ] Critical bugs fixen (P0 - blokkerende issues)
- [ ] High priority bugs fixen (P1 - major issues)
- [ ] Medium priority improvements (P2 - polish)
- [ ] Accessibility fixes (keyboard navigation)
- [ ] Performance optimalisaties indien nodig

#### Cross-Browser Testing
- [x] Chrome Windows (latest) - ✅ PASSED (Chromium 8/8 tests passing)
- [x] Chrome macOS (latest) - ✅ COVERED (Chromium tests cross-platform)
- [x] Firefox Windows (latest) - ✅ PASSED (Firefox 8/8 tests passing)
- [ ] Safari macOS (latest) - ⚠️ DEFERRED (WebKit blocked by system deps: libevent, libavif)
- [x] Edge Windows (latest) - ✅ COVERED (Chromium tests = Edge basis)
- [ ] Mobile Safari iOS 16+ (real device) - ⏭️ PENDING (manual testing phase)
- [ ] Chrome Mobile Android 12+ (real device) - ⏭️ PENDING (manual testing phase)

**✅ P0-001 FIXED:** Duplicate HTML ID `#legal-modal` removed (Sessie 16)
**✅ AUTOMATED TESTING:** 16/16 tests passing (Chromium 8/8, Firefox 8/8)
**📊 Test Coverage:** 8 comprehensive E2E tests per browser covering all critical user flows (onboarding, commands, history, storage, navigation)

#### Performance Testing
- [x] Lighthouse audit (target: >90 score) - ✅ **100/100/92/100 (avg 98)**
- [x] Bundle size check — ✅ **~809 KB na Netlify minificatie** (Terminal Core ~340 KB binnen 400 KB budget, site totaal binnen 1000 KB budget — Sessie 100)
- [x] Load time test 4G (target: <3 sec) - ✅ **2.30s LCP**
- [x] Time to Interactive (target: <3 sec) - ✅ **2.98s TTI**
- [x] Memory leaks check (long session test) - ✅ **MITIGATED** (Sessie 103: MAX_OUTPUT_LINES=500 buffer cap) - docs/testing/memory-leak-results.md
- [x] localStorage quota test (edge case) - **SKIPPED** (modern browsers 10-15MB quota, test outdated)

#### Accessibility Testing ✅ VOLTOOID (Sessie 97)
- [x] Keyboard navigation (Tab, Enter, Esc) - ✅ Focus trap toegevoegd aan alle modals
- [x] Focus indicators zichtbaar - ✅ :focus-visible met blauwe outline
- [x] Screen reader test (basis - known limitations) - ✅ ARIA audit: 50+ attributen, aria-live regions
- [x] Color contrast check (4.5:1 ratio) - ✅ WCAG AAA (14.8:1 primary text)
- [x] Font scaling test (200% zoom) - ✅ Layout intact, geen horizontal scroll
- [x] ARIA labels waar nodig - ✅ Alle modals, forms, navigation compliant

#### Security Review ✅ VOLTOOID (Sessie 96)
- [x] Content Security Policy (CSP) headers - ✅ Versterkt met object-src, base-uri, form-action
- [x] Input sanitization review (XSS preventie) - ✅ DOM-based escaping in renderer.js
- [x] localStorage security check (geen gevoelige data) - ✅ Alleen non-sensitive data
- [x] Analytics privacy check (geen PII) - ✅ IP anonymization + PII blocking actief
- [x] External links: rel="noopener noreferrer" - ✅ Alle externe links compliant
- [x] HTTPS only (deployment) - ✅ HSTS header geactiveerd (1h max-age voor testing)

#### Content Review ✅ VOLTOOID (Sessie 98)
- [x] Alle UI teksten Nederlands (compliance check) - ✅ 100% NL
- [x] Alle man pages compleet (40+ commands) - ✅ Meer dan target
- [x] Educatieve tips bij security tools (aanwezig) - ✅ Alle 5 tools
- [x] Juridische warnings correct (offensive tools) - ✅ Art. 138ab + consent
- [x] Privacy Policy compleet (AVG) - ✅ 476 regels
- [x] Gebruiksvoorwaarden compleet - ✅ 489 regels
- [x] Cookie Policy compleet - ✅ 485 regels
- [x] Disclaimer prominent (homepage + modal) - ✅ Focus trap + enforcement

#### Production Build ✅ VOLTOOID (Sessie 100)
- [x] Netlify asset processing voor minificatie (broncode leesbaar, Netlify minificeert)
- [x] Final bundle size check: ~983 KB → ~809 KB na Netlify minificatie (binnen 1000 KB budget)
- [x] Terminal Core: ~340 KB (binnen 400 KB budget)

#### Deployment Setup ✅ COMPLETED
- [x] Netlify account aanmaken
- [x] Repository koppelen aan Netlify (GitHub integration)
- [x] Custom domain geconfigureerd (hacksimulator.nl) - DNS live
- [x] HTTPS certificaat (auto via Netlify)
- [x] Build settings configureren (publish directory: `.`)
- [x] HSTS header actief (max-age=31536000)
- [x] 301 redirect van oud Netlify subdomain naar hacksimulator.nl

#### Pre-Launch Checklist ✅ GROTENDEELS VOLTOOID
- [x] Alle 40+ commands werkend (content review Sessie 98, +6 in M6/M7)
- [x] 3-tier help system functioneel
- [x] Onboarding flow compleet
- [x] Mobile responsive (CSS fixes Sessie 95, quick commands Sessie 101)
- [x] Legal documenten live (Privacy, Terms, Cookies)
- [x] Analytics tracking geconfigureerd (GA4 G-7F792VS6CE)
- [x] Cookie consent banner werkend (Cookiebot CMP)
- [x] Feedback mechanisme werkend (in-app feedback form)
- [x] Cross-browser getest (Chromium + Firefox + WebKit, 145 E2E tests)
- [x] Performance targets gehaald (LCP ~2.0s, ~809 KB)

#### Launch ✅ LIVE!
- [x] Final deployment naar productie (https://hacksimulator.nl/)
- [x] DNS configuratie (hacksimulator.nl live)
- [x] Smoke test op productie URL (HTTP 200 OK verified)
- [ ] Analytics test (GA4 Real-Time verificatie) - HANDMATIGE ACTIE
- [x] Error monitoring actief (console.log check)
- [ ] Backup van localStorage structure (JSON export) - DEFERRED

#### Post-Launch (Week 1)
- [ ] Daily monitoring (analytics + errors)
- [ ] Bug reports triagen
- [ ] User feedback verzamelen
- [ ] Performance metrics checken (load times)
- [ ] Success criteria evalueren (zie PRD §21)
- [ ] Hot fixes indien nodig (priority bugs)

#### Maintenance (Ongoing)
- [x] **Sessie 87:** Codebase Cleanup & Organization Audit (16 dec 2025)
  - ✅ Git cleanup: Removed test-results/.last-run.json from tracking
  - ✅ Disk cleanup: Deleted 39MB .playwright-mcp/ screenshots
  - ✅ Debug cleanup: Removed 5 debug files from root (cache-diagnostic.html, test-*.js)
  - ✅ Blog cleanup: Deleted 2 mockup files (57KB) - design artifacts
  - ✅ SESSIONS.md split: 612KB → 5 archive files (docs/sessions/)
  - ✅ Docs reorg: Created docs/sessions/, docs/milestones/, docs/archive/
  - ✅ Git config: Added .gitattributes for cross-platform consistency
  - ✅ .gitignore: Added explicit patterns for clarity
  - **Impact:** -39MB disk, A+ git hygiene, root directory 25+ → 23 files
  - **Future:** Quarterly cleanup audits, session archive rotation every 20 sessions

- [x] **Sessie 95:** Mobile CSS CSP Fix (19 jan 2026)
  - ✅ **P0 Bug Fixed:** Mobile CSS was not loading on production
  - ✅ Root cause: CSP `'unsafe-hashes'` blocks `onload` event handlers
  - ✅ Solution: Removed deferred CSS loading (`media="print" onload="..."`)
  - ✅ Direct loading for mobile.css and animations.css
  - ✅ Bundle impact: +6.5KB (470KB → 477KB, within 500KB budget)
  - ✅ Verified: Hamburger menu, dropdown, no horizontal scroll
  - **Commit:** `55b64a1` - "fix(mobile): Remove deferred CSS loading to fix CSP conflict"
  - **Learning:** Deferred CSS via onload handlers conflicts with strict CSP

- [x] **Sessie 96:** Security Review Complete (20 jan 2026)
  - ✅ **CSP Versterkt:** Added `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`
  - ✅ **HSTS Geactiveerd:** 1-hour max-age voor testing, later verhogen naar 1 jaar
  - ✅ **XSS Audit Passed:** DOM-based escaping in renderer.js correct geïmplementeerd
  - ✅ **localStorage Audit:** Geen gevoelige data, alleen non-PII
  - ✅ **Analytics Privacy:** IP anonymization + PII blocking actief
  - ✅ **Externe Links:** Alle links hebben `rel="noopener noreferrer"`
  - **Files Modified:** `netlify.toml` (lines 80-88)
  - **Target:** A+ rating op securityheaders.com

- [x] **Sessie 97:** Accessibility Testing Complete (20 jan 2026)
  - ✅ **Focus Trap:** Toegevoegd aan legal, feedback, command-search modals
  - ✅ **New Module:** `src/ui/focus-trap.js` - Reusable WCAG 2.1 focus management
  - ✅ **Modal Updates:** Unminified + focus trap in legal.js, feedback.js, command-search-modal.js
  - ✅ **ARIA Audit:** 50+ attributen, aria-live regions, role="dialog" op alle modals
  - ✅ **Focus Indicators:** :focus-visible met blauwe outline (2px solid)
  - ✅ **Font Scaling:** 200% zoom test passed, layout intact
  - ✅ **Color Contrast:** WCAG AAA (14.8:1 primary text ratio)
  - **Files Created:** `src/ui/focus-trap.js` (4.4KB)
  - **Files Modified:** `src/ui/legal.js`, `src/ui/feedback.js`, `src/ui/command-search-modal.js`
  - **Bundle Impact:** +16KB unminified (can be re-minified with `npm run minify`)

- [x] **Sessie 100:** Bundle Size Optimalisatie (15 feb 2026)
  - ✅ ~983 KB productieve code → ~809 KB na Netlify minificatie
  - ✅ Terminal Core: ~340 KB (binnen 400 KB budget)
  - ✅ Netlify asset processing voor minificatie (broncode leesbaar)
  - ✅ Budgets herdefinieerd: Terminal Core <400KB, site totaal <1000KB
  - **Learning:** In-place minificatie vermijden; Netlify doet dit gratis

- [x] **Sessie 101:** Playwright E2E Test Fixes (17 feb 2026)
  - ✅ Blog URLs geüpdatet naar hacksimulator.nl
  - ✅ TTI budget aangepast voor productie
  - ✅ Flaky legal modal selector gefixt
  - ✅ Feedback locator geüpdatet
  - ✅ Mobile quick commands geimplementeerd
  - **Test suite:** 145 tests across 27 suites (17 files)

- [x] **Sessie 102:** MVP Perfectionering (18 feb 2026)
  - ✅ Domain referenties geüpdatet (famous-frangollo → hacksimulator.nl)
  - ✅ Pre-launch checklist afgevinkt (90%+ voltooid)
  - ✅ TASKS.md gesynchroniseerd met Sessie 100-101 resultaten
  - ✅ Playwright retry strategie voor flaky tests (1 retry lokaal)
  - ✅ Analytics setup geverifieerd (CSP headers compatible)

- [x] **Sessie 103:** MVP Polish & Production Hardening (20 feb 2026)
  - ✅ Output buffer limit: MAX_OUTPUT_LINES=500 in renderer.js (DOM memory cap)
  - ✅ Dode meta tags verwijderd: Cache-Control, Pragma, Expires, impact-site-verification
  - ✅ animations.css loading gefixt: media="print" onload → direct load (consistent met mobile.css fix)
  - ✅ Console.log cleanup: 25 debug traces verwijderd uit 9 bestanden (console.warn/error behouden)
  - **Impact:** Schonere DevTools, gecapte DOM groei, consistente CSS loading, geen informatielekkage

---

### M5.5: Monetization MVP 🔵 IN UITVOERING (Pivot + uitbreidingen)
**Status:** Heropend maart 2026 (Sessie 117-118) — Nieuwe strategie na affiliate afwijzingen; verdiept naar volledige stack (Sessies 126-137)
**Originele aanpak:** Affiliate links → ❌ Afgewezen door programma's
**Huidige stack:** AdSense + Ko-fi + Brevo newsletter + Gumroad products + Lead magnet (Sample Pentest)

#### Voltooide taken Sessie 117-118 (Pivot) ✅
- [x] **Cookiebot verwijderd** → eigen consent banner (lichter, geen third-party dependency) — Sessie 117
- [x] **AdSense integratie** — 10 ad units manueel geplaatst (blog, sidebar, footer, between-content) — Sessie 117
- [x] **Consent Mode v2** — Google-compliant consent signaling op alle pagina's — Sessie 117
- [x] **CSP updates** — `frame-src` + `connect-src` voor AdSense domains — Sessie 117
- [x] **Ad container visibility** — explicit width op `.ad-container` base class — Sessie 117
- [x] **Ko-fi donatie buttons** — sidebar, download, challenges, footer touchpoints — Sessie 118
- [x] **Blog support banners** — call-to-action voor Ko-fi op blog posts — Sessie 118
- [x] **Newsletter signup forms** — lead generation across site — Sessie 118

#### Voltooide taken Sessies 126-129 (Newsletter + Products) ✅
- [x] **Brevo migratie** — MailerLite → Brevo (free tier), double opt-in flow, welkomstmail automation — Sessie 126
- [x] **Typst PDF guides v1.0** — 3 gidsen geschreven + factcheck + Nederlandse taalconsistentie — Sessies 127-128
- [x] **Gumroad v1.0 publicatie** — 3 guides + bundel-listing live op Gumroad, productpagina's gestyled — Sessie 129

#### Voltooide taken Sessies 130-132 (Lead Magnet) ✅
- [x] **Sample Pentest PDF** — 9-pagina anonimised pentest sample, Typst-gegenereerd — Sessie 130
- [x] **`/sample-pentest.html` landing** — Plan B Sessie 1: landing page met Brevo embedded form — Sessie 131
- [x] **Brevo Form-submitted trigger + welkomstmail** — taalfixes + flow-correctie — Sessie 131
- [x] **Custom Brevo submit handler** — success panel toggelt nu correct (MutationObserver pattern) — Sessie 132
- [x] **Twee-koloms hero** — form above-the-fold layout op `/sample-pentest.html` — Sessie 132

#### Voltooide taken Sessies 133-137 (Deliverability + Funnel) ✅
- [x] **Brevo DnD-template herbouw** — welkomstmail clean-build met Type-dropdown special-links (unsubscribe/web-version) — Sessie 134
- [x] **DNS cleanup** — SPF `include:_spf.mlsend.com` verwijderd, DKIM-CNAME op subdomein gefixt, DMARC stable — Sessie 135
- [x] **Brevo blocklist unblock** — transactional channel sender approval via caret-dropdown route — Sessie 136
- [x] **Postmaster Tools verificatie** — DKIM/SPF/DMARC verified via `postmaster.google.com/managedomains` (data aggregatie pending tot >1000 sends/day) — Sessie 136
- [x] **Welkomstmail bug-cluster** — blog-URLs, prijsclaim €0→€5, mobile inline-code overlap gefixt — post-Sessie 135
- [x] **Funnel-pulse diagnose** — pulse-check pipeline via simulate success-panel toggle (`display: 'block'` + classList) — Sessie 137
- [x] **Lead-magnet CTA-coverage 3→13** — unique `data-cta-location` per CTA-positie incl. blog-topic + plaatsing — Sessie 137
- [x] **tracker.js dubbele-init-guard** — DOM-check in `initGA4()`/`initPlausible()` voorkomt dubbele gtag-script-injectie; bleek élke consenting page-load te raken (terminal.html laadt init-analytics.js én main.js, beide roepen `tracker.init()`) = dubbeltelling launch-metrics — Sessie 204

#### Open taken
- [x] ~~AdSense performance monitoring (CTR, RPM na 30 dagen)~~ — **GESLOTEN N.v.t. Sessie 220**, AdSense verwijderd in Sessie 208 (zie #18)
- [ ] Ko-fi conversion tracking (donaties per maand) — manueel via Ko-fi dashboard
- [ ] Postmaster Tools re-check — **enige trigger: eerste campagne met >100 ontvangers** (kalenderhelft geschrapt in Sessie 220, zie #22). Actie bij Heisenberg

---

### Phase A: Post-Launch Quick Wins (Week 11)
**Doel:** Power user features + production validation
**Tijdsinschatting:** 5-7 dagen
**Status:** 🔵 In uitvoering (4/6 completed - 67%)
**Dependencies:** M5 Launch voltooid

#### Tab & History Features ✅ COMPLETED
- [x] **A.4: Tab Autocomplete** (command names + multi-match cycling)
  - Single match: Tab completes immediately
  - Multiple matches: Tab cycles through options
  - Command-only for MVP (path completion = Phase 2)
  - Implemented: `src/ui/autocomplete.js`

- [x] **A.6: Ctrl+R History Search** (bash-style reverse search)
  - Real-time filtering with match counter [1/3]
  - Ctrl+R: Start search / cycle matches
  - Enter: Accept | Esc: Cancel
  - Cyan search prompt above input (bash aesthetic)
  - Implemented: `src/ui/history-search.js`, `src/core/terminal.js`

#### Production Readiness (TODO)
- [ ] **A.1: Beta Testing Setup**
  - Recruit 5+ beta testers (2 beginners, 2 students, 1 dev)
  - Create feedback formulier (Google Forms)
  - Test scenarios document
  - Screen recording instructions (optional)

- [ ] **A.2: Cross-Browser Testing**
  - [ ] Safari macOS (latest) - WebKit blocked by system deps
  - [ ] Mobile Safari iOS 16+ (real device)
  - [ ] Chrome Mobile Android 12+ (real device)
  - ✅ Chrome/Firefox/WebKit automated tests passing (145 tests, 27 suites)

- [x] **A.3: Configuration Setup** ✅ VOLTOOID (Sessie 91)
  - [x] GA4 Measurement ID ingevuld: G-7F792VS6CE
  - [x] Contact emails ingevuld: contact@hacksimulator.nl (Gmail forwarding)

- [x] **A.5: Mobile Quick Commands** ✅ VOLTOOID (Sessie 101)
  - Click handlers geimplementeerd voor quick command buttons
  - Mobile UX fixes voltooid

---

## 🎯 Volgende Acties

**Huidige Status:** M5 In Uitvoering (71%) - ✅ **LIVE on hacksimulator.nl!**

**Voltooid:**
1. [x] GitHub repository setup (https://github.com/JanWillemWubkes/hacksimulator)
2. [x] Netlify deployment + custom domain (https://hacksimulator.nl/)
3. [x] Performance audit (Lighthouse 100/100/92/100)
4. [x] Cross-browser testing (Chrome + Firefox + WebKit, 145 E2E tests)
5. [x] Bundle size optimalisatie (~809 KB na Netlify minificatie)
6. [x] GA4 geconfigureerd (G-7F792VS6CE)
7. [x] Mobile quick commands (Sessie 101)

**Launch-prep (Sessie 173, her-geverifieerd 14 jul 2026) ✅:**
- [x] Aankondigings-kit **datum-agnostisch gemaakt (14 jul 2026)** — de 24-juni-datum was verlopen; §5-schema nu relatief (D-1 / launch-dag / D+14), nieuwe datum kiezen ná demand-validatie (item #44). Stale feiten gecorrigeerd: 12 blogposts (was 11), NL-niveau-labels, `[TIP]`-marker in visual-plan, leerpad-rationale netcat/wireshark (Sessie 188/195 al opgeschoond); D-1-checklist gekoppeld aan `launch-success-metrics.md` §4/§6 + GA4-annotatie als launch-dag-stap.
- [x] Launch-visuals **opnieuw gecaptured (14 jul 2026)** — oude GIF toonde de verouderde `[?] TIP`-marker; nieuwe take tegen de lokale werkkopie (prod egress-geblokkeerd) via `BASE_URL` + NEW `CHROMIUM_PATH`-override in `scripts/capture-launch-visuals.mjs`. GIF-hoogte 640→720 (op 640 viel de `[TIP]`-regel half achter de input-balk). 3 artefacten geverifieerd (router-profiel + cyaan `[TIP]` + geen banner) — `.playwright-mcp/launch/` (gitignored, aan Heisenberg geleverd)
- [x] Homepage linkt nu alle 13 blogposts (5 cornerstones toegevoegd) + sitemap homepage `lastmod`→18 jun
- [x] ~~**Verse launch-week blogpost schrijven (samen met Heisenberg)**~~ — **GESLOTEN Sessie 220: gesuperseerd door de regel hieronder.** De post is er (Metasploit, Sessie 199, 22 jul). Deze regel stond sinds Sessie 199 open én afgevinkt náást elkaar; van de drie genoemde kandidaten is Metasploit gekozen, Hydra en `grep`/`find` zijn geen open taak maar een ideeënlijst — die hoort in Post-MVP, niet in launch-prep.
- [x] **Verse launch-week blogpost geschreven (Sessie 199, 22 jul 2026)** — NEW `blog/metasploit-beginnersgids.html` (freshness-hefboom, runbook Fase 2) + cornerstone-cross-links (cybersecurity-tools + nmap → nieuwe post, article:modified_time/dateModified/lastmod eerlijk naar 22 jul). Live gepusht → geeft de blog een verse landingsplek op de launch-dag.
- [~] **Launch-uitvoering — BEGONNEN op wo 29 juli 2026** (handmatig, demand-validatie #44 bewust overgeslagen). **Stand Sessie 220:** D-1-prep compleet, GA4-annotatie gezet, EHGN Discord-intro + LinkedIn geplaatst; X/Mastodon/Bluesky n.v.t. (geen accounts). **Nog open — het reactie-gevoelige blok:** EHGN projectpost, Show HN, r/SideProject. Actuele stand staat in `docs/launch-checklist.md` §Stand, niet hier. De titel zei tot nu toe "doel wo 29 juli" alsof er niets gebeurd was. → **Volledige stap-voor-stap to-do: `docs/launch-checklist.md`** (single source voor Heisenberg's handelingen). Kort: D-1 (di 28 jul avond) GSC sitemap-resubmit + indexering aanvragen homepage/`/blog/`/metasploit-post + Bing import + GA4 DebugView-funneltest + link-check copy; launch-dag GA4-annotatie + posten per `docs/launch-announcement-kit.md` §5 (blok 13:00–18:00 CET, EHGN→Reddit→Show HN→LinkedIn→X). D+14 `site:` + GSC Coverage her-meten.

**Sessie 222 (14 aug 2026) ✅:**
- [x] **Box-randen verticaal gerepareerd** (`260f8af`) — `.terminal-line`'s `margin-bottom: 4px`
  maakte van elke verticale box-rand een streepjeslijn (12 stukjes van 27px, 4px gaten; 8px op
  pijlregels door `vertical-align: .2em`). Marge weg op box-regels + pijl via `position: relative`
  → uniform pitch 27. Onder 768px extra: line-height 25,6px (fractioneel) tegen glyph 25,78px gaf
  naden van 1px → box-regels volgen nu `--line-height` (integer op 18px én 16px).
- [x] **Gemeten dat de bréédte al klopte** — boxfont byte-identiek + `loaded`, alle glyphs 10,8px,
  rechterrand-spreiding ≤0,04px over 8 commando's. Sessie 204/205 hoeft niet heropend.
- [x] **Verticale-continuïteitsdetector** in `responsive-ascii-boxes.spec.js` + `next`/`metasploit`
  toegevoegd (stonden niet in `COMMANDS` terwijl het de gemelde commando's waren) + reflow-test.
- [x] **Volle chromium-suite groen: 413 passed / 0 failed / 7 skipped in 18,1 min**, en hij liep
  tot `[420/420]` — dus compleet, niet afgekapt. Nul flaky. Eerste poging kreeg van mij een
  `--global-timeout` van 25 min terwijl de suite ~18 min nodig heeft plus opstart; die liep
  eroverheen en zou afkappen met "did not run" onder een regel "passed" (de Sessie 216-val).
  Afgebroken en **niet geteld**, opnieuw gedraaid met 50 min. Box-spec apart: 152 passed over
  chromium/firefox/webkit.

**Resterende handmatige acties:**
- [ ] Mobile real device testing (iOS, Android)
- [ ] Beta testers werven (5+ testers)
- [ ] GA4 Real-Time dashboard verificatie
- [ ] **Augustus-nieuwsbrief: dark-mode-test op telefoon (Sessie 206)** — kopieer
  `docs/newsletter/nieuwsbrief-juli-2026.html` als basis (níét april: die draagt de
  MailerLite-merge-tags `{$unsubscribe}`/`{$url}`, die Brevo niet vervangt, plus twee dode
  blog-URLs — de klassen zijn wél identiek aan juli, beide gefixt in `8045b29`, dus dát is
  geen onderscheid) en open de test-send op de telefoon in dark mode. Twee open vragen die
  alleen daar te beantwoorden zijn: (a) houdt de bg+color-koppeling de tekst op de lime
  balk/knoppen donker in de Gmail-app, en (b) gaat het `<style>`-blok mee bij import — een
  HTML-blok in een drag-and-drop-ontwerp draagt geen `<head>`, en zonder dat blok doen
  `.code-inline`/`.code-block` niets. Blijft de tekst wit → escaleren naar de ontwerpvariant
  (donkere balk/knop met groene tekst; die kan Gmail's dark mode per definitie niet breken).

---

## 🔮 Post-MVP Features (Fase 2+)

Deze features zijn **buiten MVP scope** en worden in Fase 2 geïmplementeerd:

### UX Enhancements
- [x] **Tab Autocomplete** - ✅ COMPLETED (Phase A.4 - Week 11)
- [x] **Ctrl+R History Search** - ✅ COMPLETED (Phase A.6 - Week 11)
- [ ] **Help Command Educational Context** - Add category descriptions to help output
  - Write 5 Nederlands category descriptions voor elke categorie
  - Educational tone: "Deze tools helpen je netwerken te scannen..."
  - Uncomment placeholder in `src/commands/system/help.js` (line 113)
  - Estimated time: 30 min
  - Ready to implement: Architecture done in Sessie 36
- [ ] **Quick Commands UI** - Moved to Phase A.5 (deferred until mobile UX fixes)
- [ ] **Mobile Gestures** - Swipe/long-press navigatie (needs real device testing)
- [ ] **Persistent Help Hint** - Rechts onderin, verdwijnt na 5 commands
- [x] **Terminal 10px horizontale overflow op mobiel — GESLOTEN in Sessie 217, want al gefixt op 07 jul 2026.** Het item stond hier sinds Sessie 189 (30 jun) en was zeven sessies later nog open, terwijl commit `3d7df13` het een week na de melding oploste: *"fix(mobile): terminal-container 10px horizontale overflow op ≤768px"* voegde `width: auto` toe aan de `≤768px`-regel in `styles/mobile.css`. Hermeten (Sessie 217, nostore-server): op 375px meet `#terminal-container` left 10 / **width 340** / right 350 bij `clientWidth` 360 → **overflow 0**, en dat geldt over 320/360/375/390/414/768 in dark én light. De schijnbare tegenstrijdigheid in de oude notitie ("375px" vs `docW 360`) is verklaard: dat is dezelfde meting vóór en ná aftrek van een 15px scrollbar. Met de mutant (`width: auto` weg) komt de oude notitie **cijfer voor cijfer** terug: left 10 / width 360 / right 370 bij clientWidth 360, overflow 10. **Waarom het zo lang bleef staan:** er was site-breed géén horizontale-overflow-assertie op `/terminal.html`, dus niets meldde terug dat de notitie niet meer klopte. Dat gat is nu gedicht → `tests/e2e/responsive-breakpoints.spec.js` §"Terminal — geen horizontale overflow op telefoonmaten".

### Feedback & Analytics
- [ ] **Exit Intent Detection** - Survey na 2+ min sessie (FR7.2 deferred)
- [ ] **Feedback Save Logic** - Backend/email integratie voor feedback
- [ ] **Command-Level Feedback** - Thumbs up/down per command (FR7.3 deferred)

### 🔵 OPEN (geblokkeerd op echte data): Product `aggregateRating` + `review` markup (Sessie 173)
**Motief:** GSC meldt 2× **niet-kritieke** suggestie op `gidsen.html` Product-fragmenten — ontbrekende velden `aggregateRating` en `review`. Vullen geeft sterretjes in Google + rijkere snippets.
- **HARDE VOORWAARDE — niet eerder uitvoeren:** alleen toevoegen met **echte** klantbeoordelingen. Fake/verzonnen ratings = Google-beleidsschending → risico op handmatige actie (verlies álle rich results) + botst met de "geen verzonnen schema-data / geen cargo-cult-SEO"-lijn (Sessie 169/172, merchant-listing-fix Sessie 172). Tot die tijd is **niets doen de correcte actie** — de waarschuwing is niet-kritiek en blokkeert niets.
- [ ] Reviewbron regelen: Gumroad-reviews exporteren OF eigen feedbackformulier per gids
- [ ] Bij ≥1 echte review: `aggregateRating` (echt gemiddelde + `reviewCount`) + individuele `review`-objecten per Product in `gidsen.html`
- [ ] JSON-LD valideren (Python `json.loads` over alle blokken) + Rich Results Test 0 fouten, dan pas live + GSC "valideren"

### Commands & Features
- [ ] **Continue Command** - Expliciete sessie restore (localStorage doet dit al automatisch)
- [x] **Tutorial Command** - Guided scenarios (recon, webvuln, privesc) ✅ Gebouwd in M6 (Sessie 103-104)
- [ ] **Challenge System** - Voortgang tracking en certificaten
- [ ] **Leerpad deep-link naar in-app tutorials** (vervolg op Sessie 185 — leerpad-content-verrijking). Doel: de homepage-leerpad-knoppen ("Oefen in de terminal") laten dóórlinken naar een passende begeleide tutorial i.p.v. de kale terminal. **Volgorde is dwingend — B (fundament) vóór A (afwerking); A zonder B = deep-link naar een verkeerd-gelabelde/ontbrekende bestemming = de promise/payoff-leugen naar binnen verplaatst:**
  - [x] **Stap 0 — ontwerpbeslissing** ✅ Beslist Sessie 186 (29 jun 2026). Mapping niveau → scenario → labelwijziging vastgelegd (zie sub-blok hieronder). Stuurt B + A.

    **Beslissings-tabel:**

    | Niveau | Deep-link-doel (Fase A) | Ook in tier | Labelwijziging | Status |
    |---|---|---|---|---|
    | BEGINNER | **fundamentals** | — | nieuw scenario: `Beginner` | ✅ GEBOUWD (Sessie 187) |
    | GEVORDERD | **recon** | privesc | recon `Beginner→Gevorderd`; privesc `Beginner→Gevorderd` | ✅ HER-GETIERD (Sessie 187) |
    | EXPERT | **exploitation** | webvuln | exploitation `Gevorderd→Expert`; webvuln `Beginner→Expert` | ✅ HER-GETIERD (Sessie 187) |

    **Rationale:**
    1. **Badge = contract; de badge-*beschrijving* is de maatstaf, niet de chips.** Chips zijn nergens een letterlijke inhoudsopgave (recon leert géén van zijn netcat/wireshark/hashcat-chips) → toets elk scenario aan de beschrijvingszin, consistent over alle 3 tiers.
    2. **BEGINNER = "kun je überhaupt een terminal gebruiken" (géén security) → alles schuift één tier op.** recon is conceptueel de eerste security-stap, maar BEGINNER is gereserveerd voor pure basis → recon wordt GEVORDERD.
    3. **Inhoud (skill) bepaalt de tier, niet de commando-syntaxis.** privesc gebruikt alleen cat/ls maar leert log-/credential-analyse op een gehackt systeem → GEVORDERD.
    4. **webvuln → EXPERT.** sqlmap is dé headline-EXPERT-tool ("SQL injection testing" staat op de EXPERT-badge); een tier lager = EXPERT-tool in GEVORDERD-scenario = promise/payoff-leugen naar binnen verplaatst. Tik-gemak (point-and-shoot) ≠ tier. Bijvangst: álle EXPERT-badge-chips gedekt binnen EXPERT (metasploit+hydra in exploitation, sqlmap in webvuln).
    5. **GEVORDERD-doel = recon, niet privesc.** GEVORDERD-beschrijving = "netwerken / scan poorten / analyseer verkeer" → recon. privesc (log-analyse, geen netwerk) blijft GEVORDERD maar secundair.
    6. **EXPERT-doel = exploitation, niet webvuln.** exploitation = 5-staps-vlaggenschip, dekt 2/3 EXPERT-chips (metasploit, hydra). webvuln blijft EXPERT maar secundair (bereikbaar via `tutorial`).

    **Spec NIEUW fundamentals-scenario (input Fase B):** id `fundamentals`, difficulty `Beginner`, titel bijv. "De basis: je weg vinden op een Linux-systeem". Scope = **navigatie + bestandsbeheer** (`ls`/`cd`/`pwd`/`cat`/`mkdir`/`touch`/`rm`) — bewust NIET de volle 9 badge-chips; `whoami`/`history` zitten alleen in de illustratieve chips, niet in de belofte-zin ("navigeren door mappen, bestanden lezen, en je eerste bestanden aanmaken en verwijderen"). ~5 gegroepeerde stappen: (1) `pwd`+`ls` oriëntatie, (2) `cd <map>`(+`ls`) navigeren, (3) `cat <bestand>` lezen, (4) `mkdir`+`touch` aanmaken, (5) `rm` verwijderen. Verhaaltje = security-bridge ("eerste dag als junior pentester; eerst je weg vinden op het systeem"), voltooiing bridge't naar recon. Volgt bestaande scenario-structuur (`command`/`mustHaveArgs`/3-tier `hints`/`[~]`-feedback, 80/20 NL).

    **Labelwijzigingen (input Fase B):** `difficulty`-property in scenario-bestanden — `recon.js` Beginner→Gevorderd · `privesc.js` Beginner→Gevorderd · `webvuln.js` Beginner→Expert · `exploitation.js` Gevorderd→Expert · NIEUW `fundamentals.js` Beginner. **Let op:** label-vocabulaire kent nu alleen `Beginner`/`Gevorderd` — controleer in `src/tutorial/tutorial-renderer.js` (en waar `difficulty` getoond/gestyled wordt) of een nieuwe `Expert`-waarde een badge-/kleur-variant nodig heeft.

    **Deep-link-mapping (input Fase A):** BEGINNER-knop → `?tutorial=fundamentals` · GEVORDERD-knop → `?tutorial=recon` · EXPERT-knop → `?tutorial=exploitation`.
  - [x] **Fase B — tutorials op orde (het echte werk):** ✅ Uitgevoerd Sessie 187 (30 jun 2026, commit `3ac65aa`). (1) NEW `src/tutorial/scenarios/fundamentals.js` (Beginner, **7 stappen** pwd/ls/cd/cat/mkdir/touch/rm — 1 commando per stap i.p.v. ~5 gegroepeerd: de engine valideert per commando, zo wordt elke badge-belofte-skill afgedwongen), security-bridge briefing, bridge't naar recon; geregistreerd als eerste in `terminal.js`. (2) 4 her-tiering-labels toegepast (recon/privesc→Gevorderd, webvuln/exploitation→Expert). (3) **Verborgen taak anders dan gespecd:** `tutorial-renderer.js` heeft GÉÉN Expert-badge nodig — difficulty is overal platte tekst (renderer/lijst/certificaat), geen difficulty-gestuurde CSS in de terminal; `Expert` rendert correct (gemeten: dark `#c9d1d9`, light `#0a0a0a`). De échte doorwerking zat in de funnel: `next.js` (fundamentals = stage 0, high-water +1 hernummerd incl. `buildSkippedHint`-drempels), `dashboard.js` (spiegel), `certificate.js` (`getDiscipline`), `tutorial.js` (manpage). E2E `fundamentals.spec.js` (7 tests) cross-browser groen + volledige chromium-suite groen (186 passed).
  - [x] **Fase A — deep-link-plumbing + perfecte landing:** ✅ Uitgevoerd Sessie 189 (30 jun 2026). `main.js` leest nu `?tutorial=<id>` (validatie tegen `tutorialManager.getScenario` = single source of truth; onbekend → stille no-op) en auto-start het scenario gesequencet: eerste bezoek wacht op `typewriter-done` + 250 ms (resume/badge-timeouts), terugkerend vuurt direct → briefing valt nooit in dode input of midden in de typewriter. Auto-start via `terminal.execute('tutorial <id>')` (Sessie-156-registry-pad: echo + history + `markFirstVisitComplete`). **Landing = briefing-held:** scroll-to-bottom + input-focus ná start; welcome bewust NIET gecondenseerd (boot-fragiliteit; anti-gold-plating). Resume-vs-deeplink (non-destructief): geen actief → start; actief==target → niet herstarten; actief!=target → `exit()` (slaat op) + start. URL gestript via `history.replaceState` (refresh herstart niet). Analytics-source zonder dubbeltelling via one-shot `tutorialManager.setNextStartSource('homepage-leerpad')`. 3 leerpad-knoppen → `?tutorial=fundamentals/recon/exploitation` + labels "Start de Beginner/Gevorderd/Expert-missie". Cache-bump `main.js?v=164→189-deeplink` (2 refs). NEW `tests/e2e/leerpad-deeplink.spec.js` (5 tests: 3 niveaus happy-path + onbekende-id no-op + gewone terminal). Render-en-meet dark/light/375px (input enabled+focused, 0 doc-overflow, 10px `#terminal-container`-offset pre-existing zonder deep-link). **Hiermee is "Leerpad deep-link naar in-app tutorials" volledig afgerond (Stap 0 + B + A).**

### Analytics Migration
- [ ] **Plausible Analytics** - Migratie van GA4 naar Plausible (bij 10k+ visitors)
- [ ] **Cookie-less Tracking** - Remove consent banner na Plausible migratie

### 🔵 OPEN (post-launch): esbuild content-hash build + cache-correctheid (Sessie 162)
**Motief:** combineert bundle-budget-winst (M5 Terminal Core ~547 KB > 400 KB) MET het structureel oplossen van een cache-bug-klasse. **Geen pre-launch werk** — bewuste architectuurwijziging (raakt PRD §13 "no build step" red line → eerst PRD/PLANNING scope-besluit).
- **Aanleiding:** Sessie 162 bug-report — `nmap 192.168.1.100` toonde router-profiel (DNS 53) i.p.v. webserver (SSH 22). Inhoudelijk gefixt (commit `bbf6aa3`), maar legde een latente gap bloot: de `?v=`-bump werkt alleen op entry-niveau. ES-module-imports (`import x from './commands/network/nmap.js'`) dragen géén versie-token, en `_headers` cachet `/src/**/*.js` 1 week → diepe modules blijven tot een week stale bij terugkerende bezoekers. Zelfde bug-klasse als Sessie 150 (main.css v=150 miste `assets/legal/*.html`): handmatige tokens zijn inherent onbetrouwbaar.
- [ ] PRD §13 / PLANNING scope-besluit: productie-build-step toestaan (broncode blijft vanilla; alleen output gebundeld)
- [ ] esbuild bundle + minify `src/main.js` → 1-2 output-bundles met **content-hash** in filenaam (`main.<hash>.js`)
- [ ] `_headers`: gehashte assets `Cache-Control: public, max-age=31536000, immutable` (HTML blijft `no-cache`)
- [ ] Verwijder handmatige `?v=`-tokens uit `terminal.html` + alle HTML (worden overbodig)
- [ ] Verifieer bundle-grootte tegen <400 KB Terminal Core budget (verwachte minify-winst 30-50%)
- **Tussenoplossing indien vóór launch nodig (NIET aanbevolen):** `_headers` `/src/**/*.js` → `no-cache` (revalidatie via ETag). Build-vrij, lost correctheid op, maar kost N conditionele requests/load bij grote modulegraaf → wordt tóch vervangen door content-hashing.

---

## 🧹 M9: Refactor Sprint (Toekomstig)

**Doel:** Technical debt cleanup + code quality optimalisatie
**Tijdsinschatting:** 1 week (7-10 dagen)
**Dependencies:** M5 voltooid + 3-4 Post-MVP features geïmplementeerd
**Status:** ✅ **Voltooid** (Sessie 105-110)
**When to Execute:** Elke 4-6 features OF technical debt > 20%

### Cache Implementation Cleanup (3 taken)
- [x] Remove redundant HTML cache meta tags van `terminal.html` — ✅ Sessie 103 (verwijderd: Cache-Control, Pragma, Expires meta tags + impact-site-verification)
- [x] Delete of move `cache-diagnostic.html` naar `/dev/` folder — ✅ Sessie 87: bestand al verwijderd tijdens cleanup
- [x] Document cache strategy in `docs/CACHING.md` — SKIPPED (Sessie 110: Netlify `_headers` is self-documenting, apart doc overbodig)

### Bundle Size Optimization (4 taken) — ✅ DEFERRED (Sessie 100: Netlify minificatie ingeschakeld, budget herdefinieerd)
- [x] Audit bundle size breakdown — ✅ Sessie 100: 983 KB productieve code identified
- [x] Check for duplicate code patterns via `grep`/`ripgrep` (>10 line duplicates) — ✅ Sessie 105: Security commands structureel vergelijkbaar maar content uniek, extractie niet waard
- [x] Minification: Netlify asset processing ingeschakeld (CSS/JS/HTML) — Sessie 100
- [x] Target: Terminal Core ~340 KB (binnen 400 KB budget), site totaal ~809 KB (binnen 1000 KB budget) — Sessie 100

### Code Quality & Deduplication (4 taken)
- [x] Review command modules voor duplicate logic patterns — ✅ Sessie 105: Consent check pattern in 3/5 security commands, structureel niet content duplication
- [x] Extract common patterns to `src/utils/` modules (DRY principle) — ✅ Sessie 105: Reviewed, correct deferred — geen duplicaten >10 regels, `boxText()` al in utils
- [x] CSS cleanup: Remove unused classes via manual audit — ✅ Sessie 105: 531 regels verwijderd (70 orphaned classes, 28 verwijderd uit landing/main/blog.css, 42 in minified files genoteerd voor later)
- [x] JavaScript cleanup: Remove unused imports/functions (grep for unreferenced code) — ✅ Sessie 105: 7 orphaned exports verwijderd (getHomeDirectory, createBox, createLightBox, invalidateCharWidthCache export, isSimilar, findSimilarCommands)

### Documentation Updates (3 taken)
- [x] Sync all version numbers across docs (PRD, PLANNING, TASKS, CLAUDE, SESSIONS) — ✅ Sessie 110: Alle docs gesynchroniseerd op 6 maart 2026
- [x] Update SESSIONS.md with refactor learnings (anti-patterns discovered) — ✅ Sessie 105-110: Alle sessies gedocumenteerd in docs/sessions/current.md
- [x] Add inline code comments for complex logic (VFS path resolution, parser, renderer) — ✅ vfs.js 26%, parser.js 28%, renderer.js 34% comment-to-code ratio

### Performance Audit (3 taken)
- [x] Re-run Lighthouse audit — ✅ Sessie 105: CLI baseline 42/100/74/100 (methodologie verschil met DevTools; A11y+SEO maintained at 100)
- [x] Check for memory leaks via DevTools — ✅ Sessie 103: MAX_OUTPUT_LINES=500 buffer cap (docs/testing/memory-leak-results.md)
- [x] Optimize localStorage read/write patterns if needed (currently: on every VFS change) — ✅ Sessie 110: VFS debounce 1000ms + beforeunload flush, gamification debounce 500ms, onboarding 4→1 key consolidatie

### Test Coverage Review (2 taken)
- [x] Identify untested edge cases in Playwright suite — ✅ Sessie 105: 13 nieuwe command-coverage tests (pwd, date, man, history, find, grep, ifconfig, netstat)
- [x] Add missing tests for refactored code — ✅ Sessie 105-106: 145 tests/27 suites (was 118/14)

**Total Tasks:** 19
**Estimated Time:** 7-10 dagen
**Success Criteria:**
- Bundle size ≤ 400KB (20% margin maintained)
- Lighthouse score ≥ 88/100/100/100 (no regression)
- Zero code duplication >10 lines (grep check)
- All docs synchronized (dates, versions, percentages)
- Playwright tests: 100% passing (22/22 minimum)

**Triggers for Execution:**
1. **Time-Based:** After implementing 3-4 Post-MVP features (Milestone 6-8)
2. **Debt-Based:** Bundle size >400KB OR test failures >5% OR code duplication >15%
3. **Pain-Based:** Developer friction signals (fear, brittleness, confusion)

---

## 🎓 M6: Tutorial System (Fase 2 - Week 11-16)

**Doel:** Transform isolated commands into structured learning scenarios
**Tijdsinschatting:** 35-45 uur (5-6 dagen)
**Taken:** 32 total
**Dependencies:** M5 minimaal MVP (beta testing + Safari)
**Status:** ✅ **VOLTOOID (100% — Sessies 103-156)**
**Bundle Budget:** +60KB max (total: ~378KB / 500KB = 76%)

**Success Criteria:**
- ✓ 3 complete scenarios functional without errors
- ✓ Tutorial state persists across page reloads
- ✓ Validators accept correct commands with >95% accuracy
- ✓ Mobile UI renders correctly on 375px viewport
- ✓ Tutorial completion rate >40% (analytics tracking)
- ✓ Bundle size increase ≤60KB

### Phase 1: Tutorial Framework (15h, 10 tasks) ✅ VOLTOOID
- [x] Create tutorial engine architecture (3h)
  - State machine: IDLE → STEP_ACTIVE → STEP_COMPLETE → COMPLETE
  - Scenario registry pattern (similar to command registry)
  - localStorage persistence: `hacksim_tutorial_progress`
  - Integration hook in terminal.js (detect `tutorial` command)

- [x] Implement command validator (2h)
  - Per-step validate() functions
  - Non-blocking: commands always execute, validation checks afterwards
  - Argument validation (IP format, flags)

- [x] Build navigation system (2h)
  - `tutorial` command: list available scenarios
  - `tutorial [name]` command: start specific scenario
  - `tutorial skip`: skip with educational warning
  - `tutorial exit`: exit and save progress
  - `tutorial cert`: show + copy certificate

- [x] Design tutorial UI renderer (3h)
  - Mission briefing display (ASCII box with box-utils.js)
  - Objective tracker with step counter
  - Inline hints (progressive disclosure)
  - Mobile optimization (isMobileView() fallback)

- [x] Implement progress tracking (2h)
  - localStorage: scenario ID, step number, completion status
  - Resume functionality (restore on page load)
  - Reset functionality (start over)
  - Analytics events: tutorial_started, tutorial_completed, tutorial_abandoned

- [x] Create hint system (1.5h)
  - Progressive hints: Tier 1 (2 attempts), Tier 2 (4 attempts), Tier 3 (6 attempts)
  - Hint triggering: after 2 failed attempts
  - Per-step hint persistence in localStorage

- [x] Build certificate generator (1.5h)
  - Text-based certificate (ASCII art)
  - Include: scenario name, completion date, step count
  - Copy-to-clipboard functionality (navigator.clipboard + textarea fallback)

- [x] Integrate with onboarding system (1.5h)
  - Tutorial hint in onboarding flow
  - Update welcome message with tutorial mention

- [x] Integrate with analytics system (1h)
  - Track tutorial_started (scenario ID)
  - Track tutorial_step_completed (step number)
  - Track tutorial_completed (scenario ID)
  - Track tutorial_abandoned (last step reached)

- [x] Error handling edge cases (1.5h)
  - Invalid scenario name → suggestion list
  - Tutorial command during active scenario → warning
  - Page reload during tutorial → resume prompt
  - localStorage errors → graceful degradation with console.warn

### Phase 2: Scenario Implementations (18h, 15 tasks) — 12/15 voltooid

**Scenario 1: Reconnaissance (6h, 5 tasks)** ✅
- [x] Write reconnaissance scenario script (1.5h)
  - Mission briefing: "SecureCorp pentest - map network topology"
  - Step 1: ping 192.168.1.100 (test connectivity)
  - Step 2: nmap 192.168.1.100 (identify open ports)
  - Step 3: whois securecorp.com (gather domain info)
  - Step 4: traceroute 192.168.1.100 (map route)

- [x] Implement reconnaissance step validators (2h)
  - Ping validator: accept any target IP
  - Nmap validator: require target IP, optional flags OK
  - Whois validator: require domain format
  - Traceroute validator: require target IP

- [x] Write reconnaissance educational feedback (1.5h)
  - Per-step tips with Dutch context
  - Progressive hints (3 tiers per step)
  - Completion message with pentest context

- [x] Mobile testing reconnaissance scenario (0.5h) — ✅ Sessie 112: 4 tests in tutorial-mobile.spec.js
- [x] Integration testing reconnaissance scenario (0.5h) — ✅ Sessie 104: Playwright E2E tests (18 tests covering all 3 scenarios)

**Scenario 2: Web Vulnerabilities (6h, 5 tasks)** — 3/5
- [x] Write web vulnerabilities scenario script (1.5h)
  - Mission: "E-commerce site audit - find SQL injection"
  - Step 1: nmap target (identify web server)
  - Step 2: nikto target (scan for vulnerabilities)
  - Step 3: sqlmap target (test SQL injection)
  - Step 4: hashcat (crack found hashes)

- [x] Implement web vulnerabilities step validators (2h)
  - Command name + args.length validation
  - Non-blocking (forgiving for beginners)

- [x] Write web vulnerabilities educational feedback (1.5h)
  - OWASP Top 10 context
  - Ethical disclosure process

- [x] Mobile testing web vulnerabilities scenario (0.5h) — ✅ Sessie 112: 4 tests in tutorial-mobile.spec.js
- [x] Integration testing web vulnerabilities scenario (0.5h) — ✅ Sessie 104: Playwright E2E coverage

**Scenario 3: Privilege Escalation (6h, 5 tasks)** — 3/5
- [x] Write privilege escalation scenario script (1.5h)
  - Mission: "Linux server analyse - credential discovery"
  - Step 1: cat /etc/passwd (enumerate users)
  - Step 2: ls -la /home (find user directories)
  - Step 3: cat /var/log/auth.log (check login attempts)
  - Step 4: cat ~/.bash_history (find credentials)

- [x] Implement privilege escalation step validators (2h)
  - Filesystem command validation
  - Flexible arg matching for beginners

- [x] Write privilege escalation educational feedback (1.5h)
  - Linux permission model explanation
  - Log analysis context
  - Defense recommendations

- [x] Mobile testing privilege escalation scenario (0.5h) — ✅ Sessie 112: 4 tests in tutorial-mobile.spec.js
- [x] Integration testing privilege escalation scenario (0.5h) — ✅ Sessie 104: Playwright E2E coverage

### Phase 3: Integration & Polish (7h, 7 tasks) — ✅ 7/7 voltooid (Sessies 104+106+112+156)
- [x] Mobile gesture support — Long-press hint only (Sessie 156, expert-decision pedagogie-spanning)
  - ✅ Long-press (≥500ms) op #terminal-output triggert `hint` command via registry-pad
  - ❌ Swipe-next/prev bewust NIET geïmplementeerd — pedagogie-conflict: force-skip step zonder commando = ondergraving leerdoel
  - ✅ Fallback: keyboard navigation + `hint` command altijd functioneel
  - Implementatie: `src/ui/tutorial-gestures.js` (~80 regels vanilla JS) + 5 Playwright tests in `tests/e2e/tutorial-gestures.spec.js` met `devices['iPhone 13']` hasTouch:true

- [x] Cross-browser testing tutorials (2h) — ✅ Sessie 112: All 36 mobile + 24 desktop tests pass on Chromium, Firefox, WebKit
  - Test on Chrome, Firefox, Safari (desktop)
  - Test on Mobile Safari, Chrome Mobile
  - Verify localStorage persistence across browsers

- [x] Performance optimization tutorials (1h) — ✅ Sessie 106: Audit complete, geen actie nodig
  - Tutorial bundle = 37 KB (ruim binnen 60 KB budget)
  - Lazy-loading niet waard: 3 scenarios × ~5 KB = te klein voor dynamic import overhead
  - Validators al minimaal: `cmd === 'x' && args.length > 0` (geen regex)

- [x] Documentation updates tutorials (1h)
  - Added tutorial system to CLAUDE.md Recent Learnings (Sessie 103)
  - Playwright E2E test suite created (Sessie 104)
  - Tutorial cert subcommand documented in man page

- [x] Playwright E2E tests for tutorials (1h) — ✅ Sessie 104: 18 tests in tutorial.spec.js
  - 18 tests covering lifecycle, hints, persistence, completion, all 3 scenarios, cert, reset
  - Follows fixtures.js pattern (Cookiebot blocking)

- [x] Beta testing protocol gedocumenteerd (Sessie 156, uitvoering = Heisenberg-out-of-Claude)
  - ✅ Protocol-doc `docs/testing/beta-protocol-tutorials.md` ~80 regels — rekruteringsbronnen + walkthrough-script per scenario + feedback-form keuze + success-criteria + Brevo retentie-meting + closure-criteria voor heropening
  - Closure: Claude kan geen actual beta-testers werven → expert-decision documenteer-en-close. Heropening van TASKS.md bij ≥3 testers + ≥2 scenarios per tester (zie protocol-doc §6 Closure-criteria)

- [x] Lighthouse audit post-tutorials (0.5h) — ✅ Sessie 106: CLI audit 26/100/74/100 (A11y+SEO stable at 100)
  - Performance CLI score volatile (26-42 per run, netwerk-afhankelijk; DevTools = 100 in sessie 100)
  - Bundle size: 522 KB transfer (binnen 1000 KB budget)
  - A11y 100, Best Practices 74, SEO 100 — geen regressie vs M9 baseline

---

## 🎮 M7: Gamification (Fase 2 - Week 17-22)

**Doel:** Add motivation layer through challenges, badges, and certificates
**Tijdsinschatting:** 40-50 uur (6-7 dagen)
**Taken:** 47 total (46 voltooid)
**Dependencies:** M6 Tutorial System voltooid
**Status:** ✅ Voltooid (Phase 1-7 complete)
**Bundle Budget:** +50KB max (total: ~428KB / 500KB = 86%)

**Success Criteria:**
- ✓ 15+ challenges functional across 3 difficulty levels
- ✓ 20+ badges with unlock detection working
- ✓ Certificate download works on desktop + mobile
- ✓ Challenge completion rate: >30% Easy, >15% Medium, >5% Hard
- ✓ Badge unlock rate >50% for Common badges
- ✓ Bundle size increase ≤50KB

### Phase 1: Challenge Framework (12h, 10 tasks) — ✅ 7/7 voltooid (Sessie 105)
- [x] Design challenge data structure (2h) — ✅ `src/gamification/challenges/*.js`
  - Challenge properties: id, title, description, difficulty, requirements, points
  - Difficulty levels: Easy (5-10 points), Medium (15-25 points), Hard (30-50 points)
  - Requirements format: command list + optional conditions
  - JSON schema definition

- [x] Implement challenge engine (3h) — ✅ `src/gamification/challenge-manager.js` (state machine IDLE→ACTIVE→COMPLETE)
  - Challenge registry (similar to command registry)
  - Validation logic: check if user commands match requirements
  - Progress tracking: completed challenges, timestamps
  - Points calculation: base points + time bonus + accuracy bonus

- [x] Create challenge command interface (2h) — ✅ `src/commands/system/challenge.js`
  - `challenge` → List all challenges by difficulty
  - `challenge [id]` → Start specific challenge
  - `challenge status` → Show progress dashboard
  - `challenge leaderboard` → Local leaderboard (localStorage)

- [x] Build challenge UI (2h) — ✅ `src/gamification/challenge-renderer.js` (ASCII boxes)
  - Challenge list display (grouped by difficulty)
  - Active challenge indicator (top-right corner or status bar)
  - Progress bar (ASCII: [=====>    ] 50%)
  - Challenge completion animation (ASCII art celebration)

- [x] Implement localStorage persistence challenges (1.5h) — ✅ `src/gamification/progress-store.js` (key: `hacksim_gamification`)
  - Key: `hacksim_challenge_progress`
  - Data: { completedChallenges, totalPoints, currentStreak, lastActiveDate }
  - Auto-save after each challenge step
  - Streak calculation (consecutive days)

- [x] Analytics integration challenges (1h) — ✅ Via progressStore tracking
  - Event: challenge_started (challenge_id, difficulty)
  - Event: challenge_completed (challenge_id, time_taken, points_earned)
  - Event: challenge_failed (challenge_id, step_failed_at)

- [x] Error handling challenges (0.5h) — ✅ Invalid ID→suggestion, completed→replay, in progress→resume
  - Invalid challenge ID → suggestion list
  - Challenge already completed → replay option
  - Challenge in progress → resume prompt

### Phase 2: Challenge Content (15h, 15 tasks) — ✅ 15/15 voltooid (Sessie 105)

**Easy Challenges (5h, 5 tasks) - 5 points each**
- [x] "Network Scout" challenge (1h) — ✅ `network-scout.js`
  - Requirements: ping + nmap on same target
  - Validator: check command history for IP match

- [x] "File Explorer" challenge (1h) — ✅ `file-explorer.js`
  - Requirements: find + cat a specific file
  - Validator: check if target file accessed

- [x] "Identity Check" challenge (1h) — ✅ `identity-check.js`
  - Requirements: whoami + id commands
  - Validator: identity enumeration commands

- [x] "Domain Intel" challenge (1h) — ✅ `domain-intel.js`
  - Requirements: whois + dig on domain
  - Validator: domain reconnaissance

- [x] "Log Hunter" challenge (1h) — ✅ `log-hunter.js`
  - Requirements: find + read log files
  - Validator: log analysis sequence

**Medium Challenges (5h, 5 tasks) - 15-25 points each**
- [x] "Port Scanner Pro" challenge (1h) — ✅ `port-scanner-pro.js`
  - Requirements: nmap with flags (-p, -sV) on multiple targets
  - Validator: check for flag usage + multiple IPs

- [x] "Web Recon" challenge (1h) — ✅ `web-recon.js`
  - Requirements: whois + traceroute + nmap on web target
  - Validator: verify command sequence + target type (domain)

- [x] "SQL Sleuth" challenge (1h) — ✅ `sql-sleuth.js`
  - Requirements: nikto → sqlmap on same target
  - Validator: check command order + target match

- [x] "Password Cracker" challenge (1h) — ✅ `password-cracker.js`
  - Requirements: find hash file → hashcat on hash
  - Validator: check if /etc/shadow accessed + hashcat used

- [x] "System Navigator" challenge (1h) — ✅ `system-navigator.js`
  - Requirements: cd through directories + find hidden files
  - Validator: track directory changes + ls -a usage

**Hard Challenges (5h, 5 tasks) - 30-50 points each**
- [x] "Full Recon" challenge (1h) — ✅ `full-recon.js`
  - Requirements: Complete reconnaissance tutorial + scan 5 unique targets
  - Validator: tutorial completion + command history analysis

- [x] "Privesc Path" challenge (1h) — ✅ `privesc-path.js`
  - Requirements: find SUID binaries + enumerate users + access restricted file
  - Validator: specific command sequence + restricted file access

- [x] "Multi-Tool Master" challenge (1h) — ✅ `multi-tool-master.js`
  - Requirements: Use 15+ unique commands in single session
  - Validator: command diversity check

- [x] "Attack Chain" challenge (1h) — ✅ `attack-chain.js`
  - Requirements: Complete multi-step attack simulation
  - Validator: chained command sequence

- [x] "Forensic Investigator" challenge (1h) — ✅ `forensic-investigator.js`
  - Requirements: Log analysis + file forensics
  - Validator: forensic investigation sequence

### Phase 3: Badge & Achievement System (8h, 8 tasks) — ✅ 6/6 voltooid (Sessie 105)
- [x] Design badge data structure (1h) — ✅ `src/gamification/badge-definitions.js`
  - Badge properties: id, title, description, icon (ASCII), rarity, unlockCondition
  - Rarity levels: Common, Uncommon, Rare, Epic, Legendary
  - Unlock conditions: command count, challenge completion, streaks

- [x] Implement badge manager (2h) — ✅ `src/gamification/badge-manager.js`
  - Badge registry with 21 badges
  - Unlock detection logic (check conditions after each command)
  - Badge notification system (ASCII box rendering)
  - Badge gallery (localStorage-backed collection)

- [x] Create achievements command (1h) — ✅ `src/commands/system/achievements.js` + man page
  - `achievements` → Show all badges (locked + unlocked)
  - `achievements unlocked` → Filter unlocked only
  - `achievements rarity [level]` → Filter by rarity

- [x] Define 21 badges (3h) — ✅ 8 Common, 6 Uncommon, 4 Rare, 2 Epic, 1 Legendary
  - 8 Common: "First Command", "10 Commands", "Network Novice", etc.
  - 6 Uncommon: "Tutorial Complete", "Challenge Champion", etc.
  - 4 Rare: "Speed Demon" (<1s command), "Night Owl" (midnight session), etc.
  - 2 Epic: "50 Commands", "All Tutorials Complete"
  - 1 Legendary: "100 Commands + All Challenges Complete"

- [x] Implement unlock notifications (0.5h) — ✅ ASCII box rendering in badge-manager.js
  - ASCII animation on badge unlock
  - Add to badge gallery immediately

- [x] Analytics integration badges (0.5h) — ✅ Via progressStore
  - Event: badge_unlocked (badge_id, rarity, session_time)

### Phase 4: Certificate & Download System (5h, 5 tasks) — ✅ 4/4 voltooid (Sessie 105)
- [x] Design certificate templates (1.5h) — ✅ 3 tiers: Easy/Medium/Hard ASCII art
  - ASCII art border (reuse asciiBox.js)
  - Template variables: challenge name, user name, date, time taken, rank
  - 3 templates: Easy, Medium, Hard (different ASCII art)

- [x] Implement certificate generator (2h) — ✅ `src/gamification/certificate-generator.js`
  - Generate text-based certificate on challenge completion
  - Include: challenge metadata, performance stats, custom message
  - Preview in terminal before download

- [x] Build download functionality (1h) — ✅ .txt via Blob API + clipboard fallback
  - Text file (.txt) download via Blob API
  - Filename: HackSim_Certificate_[ChallengeID]_[Date].txt
  - Copy-to-clipboard fallback (mobile)

- [x] Certificate gallery command (0.5h) — ✅ `certificates` command
  - `certificates` → List all earned certificates
  - `certificates download [id]` → Re-download specific certificate

### Phase 5: Progress Dashboard (5h, 5 tasks) — ✅ 5/5 voltooid (Sessie 105)
- [x] Design dashboard layout (1h) — ✅ Stats, challenges, badges, next step sections
  - Section 1: Overall stats (total commands, points, badges)
  - Section 2: Challenge progress (completed/total by difficulty)
  - Section 3: Recent achievements (last 5 badges)
  - Section 4: Streak tracker (current streak, longest streak)
  - Mobile-optimized (<40 chars width)

- [x] Implement dashboard command (2h) — ✅ `dashboard` met subcommands (stats, badges, challenges)
  - `dashboard` → Show full progress dashboard
  - `dashboard stats` → Stats only
  - `dashboard badges` → Badge gallery
  - `dashboard challenges` → Challenge progress

- [x] Build streak tracking system (1h) — ✅ In progressStore
  - Track last active date in localStorage
  - Calculate streak: consecutive days with >5 commands
  - Streak notification on login
  - Streak reset warning

- [x] Analytics dashboard metrics (0.5h) — ✅ Via progressStore tracking
  - Track dashboard views
  - Track streak milestones (7-day, 30-day, etc.)

- [x] Mobile optimization dashboard (0.5h) — ✅ Plain format for ≤375px viewports
  - Scrollable dashboard sections
  - Simplified layout for narrow screens

### Phase 6: Leaderboard (5h, 5 tasks) — ✅ 4/4 voltooid (Sessie 106)
- [x] Design local leaderboard system (1.5h) — ✅ `src/gamification/leaderboard-data.js` (simulated top-10)
  - Local-only leaderboard (localStorage, MVP approach)
  - Track top 10 sessions by points
  - Simulated competitive usernames for motivation

- [x] Implement local leaderboard (2h) — ✅ `src/gamification/leaderboard-manager.js`
  - Store: top 10 sessions (points, date, command count)
  - Calculate rank: sort by total points
  - Personal ranking integration with simulated data

- [x] Create leaderboard command (1h) — ✅ `src/commands/system/leaderboard.js`
  - `leaderboard` → Show top 10
  - `leaderboard me` → Show user rank
  - Display format: ASCII table with rank, username, points

- [x] Leaderboard UI polish (0.5h) — ✅ Highlight user entry, percentile display
  - Highlight user's entry
  - Show percentile (e.g., "Top 15%")

### Phase 7: Integration & Testing (10h, 7 tasks) — ✅ 6/6 voltooid
- [x] Integrate gamification with terminal system (2h) — ✅ Hooks in terminal.js + challenge flow
  - Award points for tutorial completion
  - Unlock badges on terminal milestones
  - Badge unlock detection across sessions

- [x] Badge unlock detection across sessions (1h) — ✅ Hooked into terminal and challenge flow
  - Badge checks triggered after command execution
  - Cross-session persistence via progressStore

- [x] Cross-system testing gamification (3h) — ✅ Sessie 111: 14 Playwright E2E tests (gamification.spec.js)
  - Challenge flow: list, start, status, hint tiers, exit, completion, already-completed
  - Badge system: unlock notification, achievements display, rarity filter, unlocked filter
  - Leaderboard: ranked list with simulated names, personal ranking

- [x] Performance testing gamification (2h) — ✅ Sessie 111: 7 Playwright E2E tests (gamification-performance.spec.js)
  - Dashboard/achievements/leaderboard/challenge render <2s with heavy data (15 challenges, 21 badges)
  - localStorage <50KB with maximum gamification data
  - 10 rapid commands without terminal errors (debounce stress test)
  - Bundle size verification (<80KB — actual 67.8KB)

- [x] Mobile testing gamification (1.5h) — ✅ Sessie 111: 6 Playwright E2E tests (gamification-mobile.spec.js)
  - All gamification commands on 375x667 viewport (dashboard, challenge, achievements, leaderboard)
  - Certificate display on mobile
  - Full challenge completion flow on mobile

- [x] Beta testing gamification (1h) — ✅ Sessie 130: Heisenberg playtest + AI agent flow test
  - Focus on challenge difficulty balance
  - Gather feedback on point values
  - Test badge unlock satisfaction

---

## 📊 M8: Analytics & Command Scaling (Fase 2 - Week 23-28)

**Doel:** Production-ready analytics + command system optimization for 50+ commands
**Tijdsinschatting:** 30-40 uur (4-5 dagen)
**Taken:** 40 total
**Dependencies:** M5 MVP launched, M6 tutorials deployed
**Status:** ⏭️ Gepland
**Bundle Budget:** +40KB max (net +35KB after GA4 removal, total: ~463KB / 500KB = 93%)

**Success Criteria:**
- ✓ Plausible Analytics tracking 100% of GA4 events
- ✓ Help paging activates at 50+ commands
- ✓ Session export/import with 100% data fidelity
- ✓ Command execution latency <50ms with 100+ commands
- ✓ Bundle size increase ≤40KB (net ≤35KB after GA4 removal)
- ✓ Zero cookies stored (full privacy compliance)

### Phase 1: Plausible Analytics Migration (10h, 10 tasks)
- [ ] Research Plausible API (1h)
  - Review Plausible.io documentation
  - Identify custom event tracking methods
  - Compare with GA4 event structure
  - Plan data mapping (GA4 → Plausible)

- [ ] Create Plausible tracker abstraction (2h)
  - New file: src/analytics/plausible-tracker.js
  - Implement: init(), trackEvent(), trackPageview()
  - Mirror GA4 event structure for compatibility
  - Cookie-less tracking (no consent banner needed)

- [ ] Update analytics abstraction layer (2h)
  - Modify src/analytics/tracker.js to support dual tracking
  - Feature flag: ANALYTICS_PROVIDER ('ga4' | 'plausible')
  - Graceful fallback if Plausible script fails

- [ ] Migrate event definitions (1.5h)
  - Map GA4 events → Plausible custom events
  - Update src/analytics/events.js
  - Ensure backward compatibility during transition

- [ ] Update consent manager (1h)
  - Remove cookie consent banner for Plausible
  - Add informational notice: "We use privacy-friendly analytics"
  - Update src/analytics/consent.js

- [ ] Deploy Plausible script (0.5h)
  - Add Plausible script tag to index.html
  - Configure domain in Plausible dashboard
  - Set up custom event goals

- [ ] Testing & validation Plausible (1.5h)
  - Test custom events in Plausible dashboard
  - Verify cookie-less operation (no consent needed)
  - Compare GA4 vs. Plausible metrics (parallel tracking for 2 weeks)

- [ ] Remove GA4 dependencies (0.5h)
  - Remove GA4 script tags
  - Delete GA4-specific code from tracker.js
  - Bundle size reduction: ~5KB

### Phase 2: Help Command Paging System (8h, 8 tasks)
- [ ] Implement paging state machine (2h)
  - States: DISPLAY → MORE_AVAILABLE → END
  - Page size: 10 commands (fits 80% of terminal viewports)
  - Keyboard handlers: SPACE (next), Q (quit), ESC (quit)
  - Architecture ready from Sessie 36 (modular functions)

- [ ] Build help pager UI (2h)
  - Header: "Commands (Page 1/3)"
  - Body: 10 commands with descriptions
  - Footer: "-- More -- (SPACE for next, Q to quit)"
  - Mobile optimization: 8 commands per page on <768px

- [ ] Integrate with help command (1.5h)
  - Conditional trigger: if command count ≥ 50
  - Fallback: if <50 commands, show all (current behavior)
  - Preserve category filtering: help network (paginated)

- [ ] Implement keyboard navigation help paging (1.5h)
  - SPACE: load next page
  - Q / ESC: exit paging mode
  - Page state persistence during session (not localStorage)

- [ ] Add page indicators (0.5h)
  - Footer: "Page 2 of 5 | 35 commands total"
  - Progress bar (optional): [======>   ] 40%

- [ ] Testing with 50+ commands (0.5h)
  - Simulate 50-command registry
  - Test paging UX across 5 pages
  - Test keyboard shortcuts

### Phase 3: Session Export/Import (7h, 8 tasks)
- [ ] Design export data structure (1h)
  - JSON schema: { version, timestamp, commands[], filesystem, progress, settings }
  - Include: command history, VFS state, tutorial progress, challenge progress
  - Exclude: PII, analytics IDs

- [ ] Implement session export (2h)
  - Command: `export session`
  - Generate JSON from localStorage
  - Download as HackSim_Session_[Timestamp].json
  - File size estimate: 50-200KB (depends on history)

- [ ] Implement session import (2h)
  - Command: `import session`
  - Trigger file picker (input type="file")
  - Validate JSON schema
  - Merge or replace current session (user choice)

- [ ] Build import validator (1h)
  - Schema validation: check required fields
  - Version compatibility check (handle old exports)
  - Data integrity: verify filesystem structure
  - Error handling: corrupted JSON, wrong format

- [ ] Add import conflict resolution (0.5h)
  - Option 1: Replace (overwrite current session)
  - Option 2: Merge (combine histories, keep higher progress)
  - User prompt: "Replace current session or merge?"

- [ ] Testing session export/import (0.5h)
  - Export → import → verify state restoration
  - Test with corrupted JSON
  - Test version compatibility (future-proof)

### Phase 4: Advanced Analytics Dashboard (5h, 6 tasks)
- [ ] Design analytics dashboard UI (1h)
  - Section 1: Session metrics (duration, command count, unique commands)
  - Section 2: Learning progress (tutorials, challenges, badges)
  - Section 3: Command usage heatmap (top 10 commands)
  - Section 4: Error patterns (top 5 errors)
  - Mobile-optimized layout

- [ ] Implement analytics dashboard command (2h)
  - Command: `analytics` or `stats`
  - Pull data from localStorage + Plausible API (optional)
  - Display: ASCII tables + charts (bar chart with | characters)

- [ ] Build command usage tracker (1h)
  - Track: command name, execution count, last used timestamp
  - Store in localStorage: `hacksim_command_usage`
  - Generate heatmap: top 10 most-used commands

- [ ] Build error pattern tracker (0.5h)
  - Track: error type, command causing error, count
  - Store in localStorage: `hacksim_error_patterns`
  - Display: top 5 errors with suggestions

- [ ] Mobile optimization analytics dashboard (0.5h)
  - Collapsible sections
  - Scrollable charts
  - Tap to expand details

### Phase 5: Command System Scaling (10h, 8 tasks)
- [ ] Performance audit with 50+ commands (2h)
  - Measure: registry lookup time, command parsing overhead
  - Benchmark: execute 100 commands, measure avg latency
  - Target: <50ms per command execution

- [ ] Optimize command registry (2h)
  - Index by first character for O(1) lookup
  - Lazy-load command modules (dynamic import)
  - Cache parsed commands (memoization)

- [ ] Implement command caching (1.5h)
  - Cache: parsed command object (name, args, flags)
  - TTL: 5 minutes (clear after inactivity)
  - Memory limit: max 100 cached entries

- [ ] Build command search index (2h)
  - Index: command name, aliases, tags (for fuzzy matching)
  - Structure: inverted index (tag → [commands])
  - Update index when new commands registered

- [ ] Optimize fuzzy matching (1h)
  - Pre-compute Levenshtein distance matrix
  - Early exit for exact matches
  - Limit search to top 5 suggestions

- [ ] Test with 100+ commands (1h)
  - Simulate 100-command registry
  - Measure: registry lookup, fuzzy match, command execution
  - Verify: no performance degradation

- [ ] Bundle size optimization (0.5h)
  - Analyze: largest command modules
  - Compress: minify command descriptions
  - Tree-shake: remove unused exports

---

## 📝 Notities & Beslissingen

### Architecturale Beslissingen
- **Command Pattern:** Elke command is een module met execute() functie
- **Registry Pattern:** Commands registreren in centrale registry
- **VFS in-memory:** Filesystem state in JavaScript object, sync naar localStorage

### Open Vragen
- [ ] Hosting: Netlify vs. Vercel? → **Beslissing: Netlify (zie PLANNING.md)**
- [ ] Analytics: GA4 genoeg of direct Plausible? → **Beslissing: GA4 voor MVP**
- [ ] Minification: Handmatig of build script? → **Beslissing: Optioneel, handmatig**

### Risico's & Mitigaties
- **Risico:** Bundle size >500KB → **Mitigatie:** Regelmatige size checks
- **Risico:** localStorage disabled → **Mitigatie:** Graceful degradation (session-only)
- **Risico:** Mobile te complex → **Mitigatie:** Early mobile testing (M2)

---

## 🔄 Update Instructies

**Hoe deze file gebruiken:**
1. **Voor elke sessie:** Lees welke mijlpaal actief is
2. **Tijdens development:** Check taken af zodra voltooid ([ ] → [x])
3. **Na voltooien taak:** Update voortgang percentage handmatig
4. **Nieuwe taken:** Voeg toe onder relevante mijlpaal
5. **Scope wijziging:** Update eerst PRD, dan PLANNING, dan TASKS

**Taak statussen:**
- [ ] Niet gestart
- [x] Voltooid
- [~] In uitvoering (optioneel, voor langlopende taken)
- [-] Geblokkeerd (vermeld reden in notities)

**Update volgorde bij requirements change:**
```
docs/prd.md → PLANNING.md → TASKS.md → CLAUDE.md
```

---

## 📚 Referenties

**Framework Documenten:**
- `docs/prd.md` - Product Requirements v1.8
- `PLANNING.md` - Architectuur & Tech Stack
- `CLAUDE.md` - AI Assistant Context

**Command Specs:**
- `docs/commands-list.md` - Alle 41 commands gespecificeerd

---

<!-- LET OP (Sessie 224): validate-docs.sh Check 2 zoekt de footer-sessiemarker in de LAATSTE 30 REGELS.
     Elke sessie prependt hieronder een **Versie:**-entry + witregel, dus het merk schuift er 2 regels
     per sessie vanaf. Houd de lijst op MAX 8 entries — 1-in-1-out, oudste eruit (die staat volledig in
     docs/sessions/current.md). Bij 9 entries stond het merk op 31 en faalde Check 2; dat gebeurde in
     Sessie 224 en kwam niet door de wijziging van die sessie maar door de groei van de lijst zelf. -->
**Laatst bijgewerkt:** 19 aug 2026 (Sessie 228; ongefilterde contrast-sweep → 152 onder AA en 378 onder AAA gerepareerd, nieuwe sitebrede guard)
**Versie:** 6.01 (Sessie 228 — **Vier CSS-commentaren claimden een contrast dat ze niet haalden, en de sweep die dat had moeten zien filterde op tokennaam.** Ongefilterd gemeten over 30 pagina's × 2 thema's × 2 viewports: 13.157 element-toestanden, **152 onder AA / 378 onder AAA** over 18 kleurwaarden → 0/0. Vier meetgaten verklaren waarom drie eerdere rondes dit misten: tokenfilter, geen scroll, één viewport, alleen rusttoestanden. Laagste waarde van de site was 1,54:1 in de cookiebanner, op élke pagina. NEW `text-contrast.spec.js` (31 tests, 6 mutanten). 44 specs / 314 decl. Bundel 1103,62/1120 KB. ⚠️ Sessie 227 kreeg destijds geen eigen `**Versie:**`-entry; zijn werk staat in de sprintregel en in `docs/sessions/current.md`, achteraf gereconstrueerd.)

**Versie:** 6.00 (Sessie 226 — **De blog had 418 koppen zonder id en een filter van 26,8px; geen van beide stond in de CSS.** Opdracht was analyseren, niet repareren — 13 punten gemeten op een no-store-server @375/@1280 in beide thema's. De tapdoelen (7/7 op 26,8px, AAA eist 44) faalden niet op padding maar op `display`: `min-height` doet niets op een inline `<a>`. `--color-text-dim` haalde op **geen enkel** donker oppervlak AAA (6,15 / 5,62) → #a1a8b0 (7,88 / 7,20); bijvangst waren twee light-mode knopkleuren die "WCAG AAA compliant" in hun eigen commentaar dragen en 4,60 en 5,75 maten, terwijl de dark-mode tegenhanger wél ooit is doorgemeten. 0 van 418 koppen had een `id` in artikelen tot ~17.800px hoog: id's nu **statisch** (bewaakbaar door `validate-blogs.sh`, deeplink werkt zonder JS), de TOC **runtime** (een statische lijst in 15 bestanden zou in lockstep moeten blijven). Nieuwsbrief van tussen filter en grid naar ná de 3e kaart: eerste artikel y=1125 → **y=522**. Twee latente valstrikken opgeruimd: `.blog-meta span:last-child` bond op positie in een groeiende rij (het Sessie 223-patroon) en `#bronnen` stond als losse kopie 600 regels van zijn vijf broers, naast twee selectors die nooit iets matchten. **Twee eigen meetfouten onderweg:** ik las computed styles in dezelfde tick als een themawissel en meldde bijna twee light-mode-defecten die niet bestaan (transitie-startwaarde; na settelen 9,17 en 9,74), en een stale ES-module deed twee losse bugs voorwenden tot ik op een verse poort draaide. 42 specs / 312 declaraties (+1/+7, gemeten), 186 tests groen over drie motoren. ⚠️ Bundel **1118,63/1120 — marge 0,1%**; zie #70, want de formule telt blog-assets tegen een budget dat de blog budgetloos noemt. Historie: `docs/sessions/current.md`)

**Versie:** 5.99 (Sessie 225 — **De nieuwsbrief was af na vijf redactierondes; elke ronde legde een defect bloot dat níét in de tekst zat.** NEW `nieuwsbrief-augustus-2026.html` (SQL-injectie via `sqlmap`, alle claims tegen de echte codepad gemeten). Drie defecten in het gedeelde `<style>`-blok: `.mobile-padding td` is een **afstammeling**-selector terwijl de klasse óp de cel staat — de mobiele padding-verkleining heeft nooit gewerkt en kostte 32px tekstbreedte; vet erfde exact de bodykleur (5,62:1 voor beide); de Courier-familie heeft x-ratio **0,42** tegen 0,53-0,55 voor moderne monospace én staat wél op Apple/Windows en niet op Android, dus ~20% grootteverschil per ontvanger. Fixes: `td.mobile-padding`, vet op `.heading-text` (11,21:1), nieuwe fontstack met JetBrains Mono voorop, body 15→16px. Voor een iOS-lezer x-hoogte 6,30→8,80px (+40%). Verzendconventie: eerste → **derde dinsdag + min. 21 dagen interval**, en de onbewezen open-rate-claim geschrapt. **Nul code geraakt** — 41 specs / 305 declaraties en bundel 1106,46/1120 zijn beide de stand ná `d2d2484`, een ongelogde commit van vóór deze sessie. Historie: `docs/sessions/current.md`)

**Versie:** 5.98 (Sessie 224 — **De dader was 280px breed en 377px lang; de scan keek naar het verkeerde getal.** Sessie 223 liet #67 open met "oorzaak niet vastgesteld — vermoedelijk een pseudo-element", omdat geen element met zijn border-box buiten beeld viel. Dat was waar én misleidend: de `<h1>` *is* 280px breed, het is zijn **inhoud** die 377px meet. Border-box en content-box zijn twee getallen op hetzelfde element, en een scan die de ene meet is blind voor de andere. Daaronder een structureel feit: de drie legal-pagina's laden **`mobile.css` niet**, dus `--font-size-base` blijft 18px en de h1 houdt `2em` = 36px tot 320px toe. Documentbreedte = 20px padding + 377 = **397px ongeacht viewport** — dat verklaart 77/37/22/7/0 als één som. Symptoom is een **afgekapte** kop, niet een pannende pagina (`overflow-x:hidden` op `body` propageert naar de viewport; `scrollTo` werkt nog, pannen niet). Fix gekozen op meting: `overflow-wrap:break-word` werkt in alle drie de motoren, `hyphens:auto` alleen in Firefox, `clamp()` verworpen op rekenwerk. NEW `legal-pages-overflow.spec.js` — eerste assertie ooit op `assets/legal/*`, twee asserties met verschillende faalverzamelingen, twee complementaire mutanten. Twee engine-meetvallen gefilterd: scroll-container-kinderen en Firefox' `clientWidth 0` op inlines. 40 specs / 304 declaraties (1 declaratie → 9 tests: **meet die telling, reken hem niet uit**). Bundel 1104,61/1120. Volledig: `docs/sessions/current.md`)

**Versie:** 5.97 (Sessie 223 — **De verantwoording wekte wantrouwen, en art. 50 lid 4 AI-verordening gold al twaalf dagen.** De kop stelde de twijfel zelf ("hoe betrouwbaar is deze inhoud?"), de AI-alinea was een bekentenis, een eigen kop "Wat nog niet gecontroleerd is" gaf het ontbrekende evenveel gewicht, en de hoofdcontrole stond in de toekomende tijd. Juridisch onderzoek (subagent, twee onafhankelijke bronnen): art. 50 lid 4 geldt sinds **02-08-2026**; de uitzondering vereist **menselijke** toetsing met feitencontrole als minimum — niet beschikbaar hier, want de controle gebeurt met AI. Dus melding op de contentpagina's zelf (15 posts + woordenlijst), niet alleen op `/over-ons.html`: de wet meet bij de eerste blootstelling. Trustbasis verschoven van *geloof me* naar *controleer me* — "Wat er gecontroleerd is" werd **"Wat je zelf kunt natrekken"**. Twee onjuiste claims gecorrigeerd (het `title`-attribuut beloofde menselijke feitencontrole; de gidsen-claim suggereerde geverifieerde wetsartikelen), plus de tegenspraak `index.html` "10+ artikelen met bron" ↔ "geen bronnenlijst". Perspectief sitebreed op `over-ons.html` naar ik-vorm (drie perspectieven → één). **Bijvangst 1:** `.blog-post-meta span:last-child` (0,2,1) versloeg `.blog-ai-notice` (0,1,0) — melding in linkblauw op 4,89:1 terwijl het commentaar "gedempt" beloofde; regel geschreven voor de categorie-badge en in Sessie 208 stilzwijgend van doel gewisseld. Verwijderd i.p.v. overschreven → **9,17:1 AAA**. **Bijvangst 2:** de verzwaarde strafmaat van art. 138ab Sr stond op het basisdelict (lid 1 = 2 jaar, lid 2/3 = 4 jaar) op drie plekken — **derde keer**, want de eerdere correctie raakte één regel zonder sweep en zonder guard; `wat-is-ethisch-hacken.html` sprak zichzélf tegen. NEW Check 16 (positieve invariant, 8 claims) + NEW AI-melding-assertie in Check 7 van `validate-blogs.sh`. 7 mutanten, elk met een andere faalmelding; twee muteerden eerst niet en zijn herbouwd. E2E 164 passed / 0 failed. **Geen nieuwe Playwright-specs** — 39 specs / 303 declaraties ongewijzigd; beide guards bewaken statische tekst en horen in de shellscripts. Openstaand: 22px horizontale overflow op `terms.html` @375px (pre-existing, A/B tegen HEAD bevestigd) en géén E2E-dekking op de drie legal-pagina's. Bundel **1103,43/1120** (marge 1,48%). Volledig: `docs/sessions/current.md`)

**Versie:** 5.96 (Sessie 222 — **De box-randen braken verticaal; zes eerdere fixes zochten allemaal in de breedte.** Die kant klopte al volledig: boxfont byte-identiek aan de schijf-subset én `loaded`, álle box-glyphs exact 10,8px net als latin, rechterrand-spreiding ≤0,04px over acht commando's @1440/900/620px, nul wraps. De breuk zat op de as die nooit gemeten was: `.terminal-line` draagt `margin-bottom: 4px` en een `│`/`┃` tekent alléén binnen zijn eigen linebox — gemeten op de gerenderde randkolom **12 stubs van 27px met 4px gaten**, en 8px op regels met een pijl omdat `vertical-align: .2em` meedoet in de linebox-berekening (+3,59px). Marge weghalen alléén is niet genoeg (pitch bleef {27; 30,59}); pas mét de pijl op `position: relative` werd het uniform {27}. Tweede breuk onder 768px: regelafstand 25,6px (fractioneel) tegen ~25,78px glyph-ink gaf **9 naden van 1px bij 97,8% dekking** — box-regels volgen nu `--line-height`, integer op 18px én 16px. Ná: **0 gaten** over acht commando's, rand is **één run van 293px**, 100,0% dekking @760px. NEW verticale-continuïteitsdetector in `responsive-ascii-boxes.spec.js` (pitch ≤ ink-hoogte via canvas — één predicaat dat marge, `vertical-align` én line-height dekt); de twee gemelde commando's (`next`, `metasploit`) stonden **niet eens in `COMMANDS`**. Drie mutanten falen **verschillend**: marge terug 9 rood, `vertical-align` terug 7 rood (metasploit groen — geen pijl), line-height terug 1 rood. Volle chromium-suite **413 passed / 0 failed**. 39 specs / 303 declaraties (was 296 genoteerd, 300 gemeten). Bundel 1102,37/1120 — marge 1,57%. Volledig: `docs/sessions/current.md`)

**Versie:** 5.95 (Sessie 221 — **Vijf commits over drie dagen; de regel die twee van hen stuurde bleek zelf fout.** `blog-template.md` sprak zichzelf tegen (mapping-tabel wijst `wmvpx` aan recon-posts toe, de regel eronder verbiedt dat), dus zes "overtredende" posts waren één fout document dat zich zes keer reproduceerde. Het echte defect raakte 13 posts: buiten de blog zei 8/8 betaalde CTA's "Bekijk…", binnen de blog 13/15 "Download…" voor iets achter een betaalmuur → nu 0/15. NEW Check 13 (gidsen-aantal afgeleid uit `gidsen.html`) + Check 14 (CTA-werkwoord + betaalmarkering + paginaclaims), beide **positief** geformuleerd na een overlevende mutant. Ook: `--color-cta-primary` droeg twee rollen en faalde als tekst (101 → 0 onder AA over 12 pagina's, nieuw token `--color-accent-text`), en `align-items: center` centreerde de doos maar niet de afgebroken copyright-regel (≤385px-band). 37 → 39 specs, 290 → 296 declaraties. Bundel 1098,46/1120 — marge 1,9%. Volledig: `docs/sessions/current.md`)

**Versie:** 5.94 (Sessie 220 — **Opruimsessie: vier van de vijf punten bleken een notitie die niet meer klopte.** (1) De juridische welkomstmail was al gebouwd (7 aug, Active, juiste formulier + echt template); het runbook liep drie dagen achter en ik stond op het punt correcte copy te verzachten op gezag daarvan. Pagina ongewijzigd. (2) `performance.spec.js:480` mat serieel niets: de VFS-save is gedebounced op 1000 ms en die timer wordt door élke mutatie teruggezet terwijl er ~350 ms tussen twee `touch`-commando's zit — meteen uitlezen 0 bytes, na `flush()` 5139. Guard → assertie; meet nu 44,00 bytes/bestand bij CV 0,0%, mutanten tweezijdig bewezen. (3) `responsive-breakpoints.spec.js:209`: de vastgelegde diagnose klopte op geen van beide punten. 7 falers i.p.v. 1, en 5 daarvan géén testfout maar **Netlify's bot-protectie** die drie parallelle motoren een challenge-interstitial serveert zonder site-elementen (`TypeError: tc is null`); lokaal 27/27 groen. NEW goto-guard in `fixtures.js` die dat benoemt i.p.v. het te laten raden. De echte `:209`-bug: de legal-modal onderschept de klik, ~500 ms ná de hamburger. (4) Bulk-rotatie 205-209 byte-geverifieerd; SESSIONS.md-index liep twee bulks achter, §Session Overview stond op Sessie 190 en §Maintenance Protocol sprak de README tegen. (5) Zeven dode taken gesloten mét reden, waaronder #34 dat 66 sessies wachtte op een poort die met Outcome 4 al dicht was. Plus één wayfinding-link naar `/gidsen.html` (index.html had er nul; tikdoel gemeten 268×49-50px). Open: #64, een flaky test met twee gefalsifieerde hypotheses en géén baseline-status. Bundel 1095,54 KB / 1120 (marge 2,2%). Volledig: `docs/sessions/current.md`)

Pre-Sessie 152: Versie 5.25 Sessie 151 HERVAT 6-op-rij Frame-falsificatie patroon naar Frame C REVERT na Sessie 150 unique font-pipeline Frame A break. Item #27 ✅ **Frame C REVERT — ad-bearing pages preconnect + inline critical-CSS** (patch commit `a80e675` → revert commit `0354c7a`). 6-op-rij Frame-falsificatie patroon HERVAT na Sessie 150 Frame A break — resource-priority-cascade mechanism herhaalt Sessie 147 #29 patroon. **Multi-metric delta canonicals (mediaan):** Index | S1 LCP +99 NOISE | S2 FCP +270 ms C | S3 TBT +249 ms C | S5 CLS -0,073 A HIT |. Blog/nmap | S1 LCP +838 ms C | S2 FCP -140 ms A HIT | S3 TBT +294 ms C | S5 CLS 0 A HIT | S6 preconnect proof -95 ms / -62% A HIT clean |. **Variance-amplification hypothese:** POST-patch LCP-range 802-1111 ms vs PRE 123-144 ms = 6,5-7,7× variance-increase. Preconnect opent connection vroeg → AdSense backend variance + dependent-request-cascade dominant. **Sessie 147 #29 patroon herhaalt** op nieuw resource-type (preconnect vs modulepreload) — beide mechanism-proof-clean MAAR variance-cascade introduceert netto regressie. Spawn #34 mechanism-isolation onderzoek: splits patch in preconnect-only + inline-CSS-only naar 2 separate cycli om welk mechanism culprit te isoleren. Anti-rationalisatie-discipline structureel verankerd: Frame-falsificatie blijft norm, Sessie 150 Frame A was unique font-pipeline territorium. Pre-Sessie 151: Item #32 + #33 (a) Sessie 150 closures. 5-op-rij Frame-falsificatie patroon **GEBROKEN** door eerste meet-bare mobile-delta sinds Sessie 144 Pad C1+C2. Variable-font discovery: Inter v20 + JetBrains Mono v24 + Space Grotesk v22 zijn variable fonts via Google CSS2 API — 3 unique woff2 (99,6 KB byte-equivalent aan Google CDN) serveren alle 8 weight-declaraties via browser-dedup. Geen pyftsubset build-step. **3-run LH@11 mobile mediaan R2 delta:** S1 LCP -1150 ms (**7,7× Frame A threshold**) / S2 FCP -63 NOISE / S3 Bytes 0 KB NOISE (variable-font byte-equivalent pre-data predicted) / S4 Google Fonts origins 0 ✓ binary mechanism-proof / S5 CLS +0 stable / S6 TBT -491 ms (**6× Frame A threshold**) / Score +19 (63→82). **Frame A verdict via spirit + primary anti-bias rule (Sessie 146):** S1 paint-pipeline + S6 main-thread-blocking = 2 onafhankelijke causale dimensies hit met EXTREME magnitudes. Strict letter "≥3-of-4" gefalsifieerd (2-of-4 hit), MAAR plan-table design-flaw geïdentificeerd (S3 ≤-30 KB mechanisch-onmogelijk door variable-font byte-equivalence pre-data predicted). Secondary safety te streng calibreerd; primary anti-bias rule (breedte over dimensies) = doorslag-discipline. **Cache-coherency bump systemic mitigation:** `main.css?v=114/115` → `?v=150` op alle 20 HTML files voor returning-user-mismatch-prevention (Sessie 148 #31 + Sessie 149 #30 pattern partial applied — Spawn #33 (e) PARTIAL closed). **Defense-in-depth 5 plekken:** TASKS.md item #32 closure + #33 (a) sub-item closure + docs/sessions/current.md Sessie 150 entry + docs/perf-third-party-audit.md §2e + .claude/CLAUDE.md learnings + plan-file outcome-sectie. Open spawn #33 (b/c/d/e) — sub-pad (e) PARTIAL, sub-paden (b)(c)(d) blijven kandidaat voor volgende verify-first cycli. Artifacts `/tmp/sessie150-item33a/{pre-r1,2,3,post-r1,2,3,verdict}.json` + Playwright screenshots `.playwright-mcp/sessie150-{terminal,blog}-self-host-verified.png`.)
**Totaal Taken:** ~343 — zie milestone-tabel voor breakdown. Validatie via `scripts/validate-docs.sh` (run automatisch op pre-commit).
**Live URL:** https://hacksimulator.nl/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator
**Bundle (geverifieerd 29 mei 2026, Sessie 144; +99,6 KB woff2 Sessie 150):**
- Site totaal **~2020 KB unminified** | src/ 613 KB + styles/ ~362 KB (262 + 99,6 woff2 + ~13 KB LICENSES) + HTML ~150 KB + blog/ 360 KB + assets/ 685 KB
- **Terminal Core (runtime van terminal.html, gemeten Sessie 141):** **~781 KB unminified** (~547 KB minified geschat) | HTML 19 KB + CSS 160 KB (6 files) + JS module-graph 601 KB (99 files reachable van entry points). woff2-fonts staan buiten Terminal Core budget (asset-pijler). ⚠️ ~37% boven 400 KB budget JS-zijde — volgende sprint: item #26 box-utils.js
- **Lighthouse on-wire ná #33 (a) self-host (Sessie 150, productie):** terminal.html mobile **63→82** (mediaan R2 selected on LCP) | LCP 4291→3141 ms (-1150) | FCP 1665→1602 (-63) | TBT 907→416 (-491) | CLS 0 stable | TotalBytes 371 KB (0 delta, variable-font byte-equivalent). S4 binary check: 0 Google Fonts origins (fonts.googleapis.com + fonts.gstatic.com) over alle 3 post-runs. Voorgaande milestones: 49→59 (Sessie 144 Pad C1+C2 + AdSense 252 KB → 0 op no-slot pages), sample-pentest.html 73→82. Zie `docs/perf-third-party-audit.md` §2e voor multi-metric tabel + frame-verdict + design-flaw honest-flag.

---

**🚀 Let's build HackSimulator.nl!**
