# Sessie-archief 220-224 - HackSimulator.nl

**Geroteerd uit `current.md` bij Sessie 235** (steady-state `N % 5`-rotatie, zie
`docs/sessions/README.md` §Rotatie-regel). Nieuwste-eerst binnen dit blok.

> Dit blok bevat naast de vijf sessie-entries ook het **learnings-blok van Sessie 220** dat
> eerder uit `.claude/CLAUDE.md` was geroteerd. Dat hoort bij zijn sessie: losknippen zou
> "Sessie 220 — learnings" in `current.md` laten staan terwijl entry 220 hier zit (de val die
> bij Sessie 220 werd vastgesteld en bij 230 opnieuw geraakt).

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
