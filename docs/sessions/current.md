# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

---

## Sessie 235: Een ontbrekende `</main>` trok de footer de blogcontainer in — en twee contrastspecs bleken hun eigen opvolger (23 sep 2026)

**Mission:** "De footer in /blog/ is niet juist, vergelijk maar met de footers elders." Eén
ontbrekende sluittag, en daarna twee lagen van dezelfde fout: een guard die de tag uit de
vorige bug bewaakte in plaats van de klasse, en twee testspecs die al vervangen waren zonder
dat iemand ze had opgeruimd.

### De bug: één sluittag, 1151px verschil

`blog/index.html` opende op regel 216 `<main id="main-content" class="blog-container">` en
sloot hem nooit. Een niet-gesloten containerelement geeft geen enkel faalsignaal — de parser
sluit hem stil bij `</body>`, er is geen console-fout en de pagina rendert. Het enige symptoom
is dat alles erná zijn stijl erft.

Gemeten op productie, 1823px viewport:

| | `/blog/` | `/blog/terminal-basics.html` |
|---|---|---|
| ouder van `footer.landing-footer` | `MAIN.blog-container` | `BODY` |
| breedte | **672px** | **1823px** |
| linkerrand | 576px | 0 |
| `.footer-content`-kolommen | 207 / 103 / 170 | 636 / 318 / 318 |
| Ko-fi-knop | 194×**70** (gewrapt) | 210×**47** |

De wrappende Ko-fi-knop was een gevolg, geen tweede bug. Statisch bevestigd over **alle 25
HTML-pagina's × 11 gepaarde structuurtags**: dit was de enige tagmismatch van de site. Elke
andere pagina zet `</main>` netjes vóór `#footer-placeholder` — óók `terminal.html`, waar het
placeholder-blok op inspringniveau 4 staat en dus in een wrapper lijkt te zitten. Nagemeten in
de browser: ouder `BODY`, breedte gelijk aan `clientWidth`. Inspringing in de bron is geen
DOM-structuur.

Na de fix op de lokale no-store server: ouder `BODY`, 1823px, links 0, knop 210×47, kolommen
636/318/318 — cijfer voor cijfer gelijk aan de referentiepagina.

### De guard bestond al, en bewaakte het verkeerde

`validate-blogs.sh` check 3 is in Sessie 138 gemaakt voor precies deze faalvorm: een
niet-gesloten `<div class="blog-tip">` die zijn stijl over de rest van de pagina lekte. Hij
telde daarna uitsluitend `<div>`. Toen dezelfde fout op `<main>` optrad was hij per definitie
blind — hij bewaakte de tag uit die ene bug, niet de klasse "niet-gesloten container".

Uitgebreid naar `div main section article nav header footer aside figure table form`. Twee
keuzes die een meting nodig hadden:

- **Woordgrens.** `grep -o '<main'` zou een toekomstige `<main-nav>` meetellen; het patroon is
  nu `<main[[:space:]>]`.
- **`<p>` en `<li>` blijven eruit.** HTML staat daar impliciet sluiten toe, dus die zouden vals
  alarm geven op correcte markup.

Vooraf gemeten dat de uitgebreide set vandaag exact één faler geeft en na de fix nul — anders
had ik een guard voorgesteld die bij invoering al lawaai maakt. Plus een lege-populatie-tak:
het script meldde tot nu toe "All blog files pass" ook als het over nul bestanden liep.

### Guard B: de klasse aan de pixelkant

NEW `tests/e2e/footer-fullbleed.spec.js`. Guard A vangt de *oorzaak* (een niet-gesloten tag),
deze de *klasse*: op elke pagina hangt de component-footer direct in `<body>` en beslaat hij de
volle `clientWidth`. Die faalt óók als ooit een CSS-regel hem inperkt, wat geen tagteller ziet.

De drie legal-pagina's dragen geen component-footer (gemeten: `placeholder=0`, `init=0`). Ze
staan als **tweerichtings**-assertie in `ZONDER_FOOTER`: erin betekent "moet ontbreken", niet
"sla over". Een skip zou stil groen blijven zodra die pagina's alsnog een footer krijgen.

Mijn plan was één test die alle 30 pagina's afloopt. `text-contrast.spec.js` draagt echter een
gemeten notitie dat zestien navigaties in één test flaky werd zodra er een tweede worker naast
draaide — bewijs in de repo tegen mijn eigen aanpak, dus werd het één lichte test per pagina.
93 passed over drie motoren, geen flaky.

Drie mutanten, drie verschillende asserties:

| mutant | uitkomst |
|---|---|
| `</main>` weghalen | guard A `main(1/0)` + guard B op de **ouder**-check — 1 failed / 30 passed |
| legal-pad uit `ZONDER_FOOTER` | guard B op de **aanwezigheids**-assertie — 1 failed / 30 passed |
| `PAGINAS` uitdunnen tot 2 paden | guard B op de **populatie**-tak — 1 failed / **2** passed |

Die derde is de leerzaamste: zonder de populatietak was dat `3 passed` geweest — een groene
sweep die 28 pagina's stil oversloeg.

### De aangrenzende vraag: zeven lijsten, niet drie

`helpers/paginas.js` draagt bovenaan de instructie "Bij een NIEUWE pagina: hier toevoegen".
Die instructie is correct en werd genegeerd — je leest hem alleen als je dat bestand toch al
opent, en wie een nieuwe spec schrijft opent hem juist niet.

Mijn eerste inventarisatie greppte op de naam `PAGINAS` en vond drie specs. De detector die ik
daarna schreef kijkt naar de **vorm** (een array-literal met ≥2 HTML-paden) en vond er zeven:
`POSTS`, `SAMPLES`, `LANDINGSPAGINAS` en `PAGINAS_MET_BADGE` vielen buiten de naam-grep. Zoeken
op een naam in plaats van op een vorm is dezelfde meetfout een laag hoger.

Vijf van de zeven zijn terecht gescopet op een populatie waar de rest van de site niets te
meten heeft — een badge die er niet staat, een CSS-bestand dat niet laadt. NEW
`tests/e2e/paginalijst-dekking.spec.js` draait de populatie om: elke lijst meldt zich, de
uitzonderingen verantwoorden zich met een reden. Vier asserties, vier mutanten, vier
verschillende falers. Dit verving de losse subset-assertie die `legal-pages-overflow` zou
krijgen: generiek over zeven lijsten is meer waard dan een handgeschreven check in één ervan.

Een `const PAGINA = '/over-ons.html'` (enkelvoud) is bewust géén lijst maar een testfixture; de
grens ligt op twee paden in dezelfde array-literal.

### Twee specs verwijderd — en waarom mijn eerste advies fout was

Ik adviseerde `accent-text-contrast.spec.js` (12 pagina's) en `link-contrast.spec.js` (16) uit
te **breiden** naar de volle 30. Toen ik het eerste bestand opende om dat te doen, stond onderin
een verwijzing naar `text-contrast.spec.js`, waarvan de kop zegt:

> "alle eerdere contrastspecs FILTEREN op een tokenlijst (link-contrast op vijf tokens,
> accent-text en eyebrow elk op één). Wat niet in de lijst staat wordt niet gemeten, dus de
> klasse is nooit gesloten. Deze spec filtert niet."

Sessie 228 had ze dus al vervangen: 30 pagina's × 2 thema's × 2 viewports, ongefilterd,
inclusief `HOVER_PAREN` met `--color-link`/`-hover`. Uitbreiden had ~50 trage tests toegevoegd
aan een suite van al 1,2 uur, zonder één extra faalmodus. Dat had ik kunnen weten door de kop
te lezen vóór ik adviseerde.

Redundantie niet beredeneerd maar met mutanten gemeten:

| mutant | gefilterde spec | ongefilterde sweep |
|---|---|---|
| `--color-accent-text` → `#9fef00` | 4 failed | ook rood, **246×** `rgb(159,239,0)` op `/index.html` |
| `--color-link` → `#0969da` | 1 failed | ook rood, **12×** `rgb(9,105,218)` op `/over-ons.html` |

Dekking eerst bewezen (`text-contrast` volledig: 93 passed, drie motoren, 604s), pas daarna
verwijderd. Besparing: **120 tests, 229s wandklok**.

Het "gat van 32 klassen" dat ik eerder mat (klassen in niet-gemeten blogposts) was een gat in de
*populatie van accent-text-contrast*, niet in de *sitedekking* — die klassen wórden gemeten,
door `text-contrast` over alle dertig pagina's.

### `eyebrow-contrast` blijft, en dat is geen inconsequentie

De derde gefilterde voorganger draagt naast contrast ook **aanwezigheids**-asserties:
"`/index.html` hoort twee badges te hebben". Dat kan een ongefilterde sweep per definitie niet
dekken — verdwijnt het element, dan levert dat geen faler op maar een kleinere populatie, en
kleiner is daar altijd groen. Gemeten met een mutant die één van de twee badges hernoemt:

```
eyebrow-contrast   1 failed / 9 passed   (de aanwezigheidsassertie vuurde)
text-contrast      3 passed              (groen, ziet niets)
```

Dezelfde redenering die de andere twee overbodig maakte, bewijst hier het omgekeerde.

### Verwijzingen: bij de oorzaak, niet bij het symptoom

Vier levende verwijzingen naar de verwijderde specs bijgewerkt: `helpers/contrast.js` (de
lockstep-aanleiding), `eyebrow-contrast.spec.js` (verwees naar een bestand dat weg is),
`text-contrast.spec.js` (draagt nu het mutantbewijs, want dáár zit de dekking) en TASKS.md
#71/#72, die allebei een `NEW`-spec claimden die niet meer bestaat. `docs/sessions/`-entries
zijn historie en blijven staan.

### Commits

| hash | onderwerp |
|---|---|
| `5adc792` | Een ontbrekende `</main>` trok de footer de blogcontainer in |
| `0aa3963` | Elke paginalijst in de suite moet zich nu verantwoorden |
| `7a49b0f` | Twee contrastspecs weg die hun opvolger al dekte |

### Learnings

- **Een guard die uit een incident geboren is, bewaakt dat incident.** Check 3 kwam uit een
  `<div>`-bug en telde daarna alleen `<div>`. Vraag bij elke guard: wat is hier de klasse, en
  wat is de goedkoopste manier om die héle klasse te meten in plaats van het exemplaar dat ik
  nu toevallig ken? Dit is dezelfde vorm als de tokenlijst-guards uit Sessie 228.
- **Een meetrapport wordt stilzwijgend een specificatie.** `link-contrast.spec.js` opent met
  "Gemeten over 16 pagina's" — een waarheid over Sessie 227. De volgende lezer ziet dat als een
  afspraak. Niemand heeft dat besloten; het is gewoon blijven staan.
- **Zoek op de vorm, niet op de naam.** Mijn grep op `PAGINAS` vond 3 van de 7 paginalijsten.
  Een detector op de array-literal vond ze allemaal. Nul treffers bewijst iets over je patroon,
  niet over de werkelijkheid — en dat geldt ook als je wél treffers krijgt maar te weinig.
- **Lees de kop van het bestand dat je gaat vervangen vóórdat je adviseert.** Mijn advies om
  twee specs uit te breiden was aantoonbaar verkeerd en stond letterlijk weerlegd in de eerste
  twintig regels van hun opvolger.
- **Een aanwezigheidsassertie is geen contrastassertie.** Een ongefilterde sweep kan nooit
  dekken dat iets er *moet zijn* — daar is een verdwenen element geen faler maar een kleinere
  populatie. Meet dat verschil met een mutant vóór je twee specs op één hoop gooit.
- **Exit 1 zonder eindblok betekent dat je meting niet gedraaid heeft.** `-g "^/index.html"`
  matcht niets, want Playwright matcht tegen de volledige titel inclusief describe-blok. Het
  resultaat was `exit 1` met "No tests found" — zonder het log te openen had dat gelezen als
  "de sweep vangt de mutant wél", precies de omgekeerde conclusie.
- **`import.meta.url` werkt niet in deze suite.** `package.json` heeft geen `"type": "module"`,
  dus Playwright transpileert specs naar CJS. De fout (`require is not defined`) wees naar
  regel 3, een comment — sourcemaps liegen hier. Anker op `process.cwd()` mét een assertie dat
  `tests/e2e` bestaat, in plaats van hopen dat cwd klopt.
- **Bewijs de dekking vóór je hem weggooit, niet erna.** `text-contrast` is eerst volledig
  groen gedraaid (93 passed, 604s) en pas daarna zijn de voorgangers verwijderd. Andersom had
  een rode vervanger een gat achtergelaten dat niemand had gezien.
- **De rotatieregel in `docs/sessions/README.md` en de praktijk lopen uiteen.** De README zegt
  "plak in het **lopende** range-archief, sluit af bij ~250 KB"; de repo doet sinds s165 één
  archief per blok van vijf, en de bestandsnamen dragen exacte ranges. `archive-s215-s219.md` is
  84 KB — volgens de letter had 220-224 daarin gemoeten, wat de naam een leugen maakt. Gevolgd:
  de praktijk, en de README is binnen dezelfde sessie aangepast (#80): één blok = één bestand,
  de afsluit-drempel is weg, en de onderbouwing staat als blockquote ín de README zodat niemand
  hem op gevoel terugdraait. **Meet voor je zo'n regel kiest:** twaalf opeenvolgende blokken van
  exact vijf sinds `s165`, grootste 81 KB — een drempel van 250 KB die in twaalf rotaties nooit
  geraakt is, is geen regel maar een fossiel. Bijvangst: `SESSIONS.md` beloofde "Next rotation:
  Sessie 90 (estimated late december 2025)", **145 sessies verlopen**, terwijl de regel zelf al
  die tijd werkte — een afgeleide waarde hoort niet overgeschreven te worden.

### Metrics delta

- **Bundle:** src 734 KB / styles 462 / blog 491 / assets 1741 — byte-identiek aan Sessie 234.
  Deze sessie raakte alleen `tests/`, `scripts/` en één regel in `blog/index.html`.
- **Specs:** 43 → 43 (+2 nieuw, −2 verwijderd). Declaraties 317 → **320**; gedraaide tests
  **+34**, want `footer-fullbleed` genereert er 31 uit 2 declaraties.
- **Suitetijd:** −229s wandklok over drie motoren door de twee verwijderde specs.
- **Verwijderd:** 338 regels testcode.

### Next steps

- Openstaand uit eerdere sessies, ongewijzigd: #64 (flaky autocomplete-diagnose), #74
  (minify-trigger, marge nog > 5 KB), DMARC `p=quarantine` zodra de rapporten schoon zijn.

---

## Sessie 234: De mailbox kostte ~EUR 96/jaar, en de gratis standaardroute sterft in januari 2027 (15 sep 2026)

**Mission:** "ik heb een emailadres bij TransIP dat 7 euro per maand kost — kan dit ook ergens
gratis?" Uitgemond in een volledige mailmigratie naar Zoho Mail Free, inclusief drie bevindingen
die alleen door meten boven water kwamen en twee correcties op mijn eigen eerdere advies.

### De vraag was breder dan hij leek

Eerste meting: waar wordt `contact@hacksimulator.nl` eigenlijk voor gebruikt?

| taak | loopt via | mailbox nodig? |
|---|---|---|
| Contactformulier | Netlify Forms (`contact.html:169`, `data-netlify="true"`) | nee |
| Nieuwsbrief versturen | Brevo, eigen infra + eigen DKIM | nee |
| 12 `mailto:`-links, SECURITY.md, privacy.html | direct naar contact@ | ontvangen |
| DMARC rua-reports | naar contact@ | ontvangen |
| Antwoorden vanaf contact@ | mailbox | **versturen** |

Negentig procent van de behoefte is ontvangen. Alleen het antwoorden vraagt een echt verzendpad —
en dat maakte het verschil tussen de opties.

### Waarom de klassieke gratis route afviel

De standaardoplossing (forwarden naar Gmail, van daaruit antwoorden als contact@) is stervende:
Google schrapt **"Send mail as" voor niet-Google-adressen in januari 2027** en beperkt nieuwe
configuraties nu al. Bevestigd op Google's eigen supportpagina (`support.google.com/mail/answer/17101213`),
niet alleen in secundaire bronnen.

Voor een domein dat security-disclosures en AVG-verzoeken ontvangt betekent forwarding-zonder-send-as
dat elk antwoord zichtbaar van een prive-Gmail komt. Dat is geen acceptabele eindtoestand, dus
TransIP's doorstuurdienst (EUR 6,99/jaar) viel af ondanks de lage prijs.

### Dead-end: een prijs die niet bestond

Ik adviseerde aanvankelijk "TransIP Email Only vanaf EUR 1,99/mnd" — een cijfer uit een
zoekresultaat-titel dat ik niet kon verifieren omdat hun pagina achter een bot-check zit.
TransIP-support (Seth Peters) weerlegde het direct: er is geen kleiner pakket. Het cijfer was een
bewering die ik als feit had gepresenteerd, en de correctie kwam van buiten in plaats van uit een
meting.

### Bevinding 1: de regio hangt af van de ingang, niet van je IP

Zoho's datacenter-keuze ligt onherroepelijk vast bij het aanmaken van het account. Ik nam eerst aan
dat een `.eu`-URL volstond. Gemeten in de browser bleek iets anders — dezelfde knop, dezelfde
pagina, twee uitkomsten:

| ingang | gratis-knop wijst naar | datacenter |
|---|---|---|
| `www.zoho.com/nl/mail/zohomail-pricing.html` | `workplace.zoho.com` | VS |
| `www.zoho.eu/mail/zohomail-pricing.html` | `workplace.zoho.eu` | EU |

`www.zoho.eu` bestaat niet als eigen site; hij redirect naar `zoho.com/nl/...?sredirect=true`.
Die querystring is het enige zichtbare bewijs dat de EU-context actief is. Heisenberg zat al op
`zoho.com/nl` toen hij dit meldde — een klik verder was het account in het VS-datacenter beland,
onomkeerbaar, en daarmee had de privacyverklaring een paragraaf over internationale doorgifte
nodig gehad.

### Bevinding 2: Brevo slaagt op DKIM, niet op SPF

Ik heb de hele migratie gehamerd op "`include:spf.brevo.com` moet blijven staan, anders breekt je
nieuwsbrief". De headers van de testcampagne weerleggen dat:

```
dkim=pass   header.i=@hacksimulator.nl  header.s=brevo2
spf=pass    smtp.mailfrom=bounces-...@gw.d.sender-sib.com
dmarc=pass  header.from=hacksimulator.nl
```

SPF wordt geevalueerd op het envelope-domein (`Return-Path`), en dat is Brevo's eigen
bounce-domein. Het SPF-record van `hacksimulator.nl` wordt voor die mail dus niet eens
geraadpleegd. Wat de nieuwsbrief laat slagen zijn de twee `brevo*._domainkey`-CNAMEs.

De include blijft staan — hij kost 0 extra DNS-lookups (gemeten: 5/10 voor en na) en is een
vangnet als Brevo ooit een custom Return-Path krijgt. Maar de rangorde van wat je moet beschermen
lag anders dan ik zei.

### Bevinding 3: een guard die niet kon falen

`check-mail.sh` v1 bevatte deze check:

```bash
chk "MX niet meer TransIP" '^((?!transip).)*$' "$(grep -v transip <<<"$mx" | head -1)"
```

Negatieve lookahead werkt niet in `grep -E`; de `grep -v` gaf een lege string terug, en het
patroon matchte die lege string. Resultaat: `[OK] MX niet meer TransIP` terwijl de MX nog naar
`mx.transip.email` wees. De proefdraai vóór de wissel legde het bloot — precies waarvoor die
proefdraai bedoeld was. Herschreven naar een expliciete `hasnt()`-functie; daarna gaf de
voor-meting 6 geslaagd / 6 mislukt, met de zes falers exact gelijk aan de zes voorgenomen
wijzigingen.

Dit is de invariant uit CLAUDE.md in levende lijve: een check die nooit kán falen is niet te
onderscheiden van een kapotte check.

### Herziening: aliassen in plaats van losse gebruikers

Het runbook schreef eerst `contact@` en `dmarc@` als twee aparte gebruikers voor. Heisenberg maakte
zelf een superuser aan op een eigen adres, wat de betere structuur bleek: beheerdersaccount los van
het publieke adres. Geverifieerd dat Zoho 30 aliassen per postvak toestaat op het gratis plan, die
niet meetellen voor de limiet van 5 gebruikers. Eindopzet: één postvak, drie adressen, één
filterregel op het ontvangende adres (niet op afzender — DMARC-rapporten komen van tientallen
providers, het alias is het enige stabiele gegeven in die stroom).

### Waarom vijf records eruit en één erin

Heisenberg vroeg terecht of Zoho geen equivalenten nodig had. Twee verschillende oorzaken:

- `autoconfig` / `autodiscover`: dienen om mailclients hun serverinstellingen te laten vinden.
  Zoho Free heeft geen IMAP/POP/ActiveSync, dus er is niets te ontdekken — en Zoho doet
  autodiscovery sowieso met een SRV-record of XML-bestand, niet met CNAME's.
- `transip-a/b/c._domainkey`: drie selectors is TransIP's sleutelrotatie. Bij het CNAME-model staat
  de sleutel bij de provider, die achter de verwijzing kan roteren — daarvoor zijn meerdere
  selectors nodig. Zoho gebruikt het TXT-model: de sleutel staat in je eigen zone en jij roteert.
  Eén selector volstaat dan.

Praktisch gevolg: de Brevo-DKIM onderhoudt zichzelf, de Zoho-DKIM niet.

### Bijvangst: elf maanden versiedrift in privacy.html

Bij het toevoegen van Zoho aan de verwerkerstabel bleek de kop `v1.1 / 24 augustus 2026` te zeggen
en de footer `v1.0 / 16 oktober 2025`. Voor een juridisch document is dat geen schoonheidsfout: een
bezoeker die onderaan kijkt leest een beleid dat elf maanden ouder lijkt. Beide nu op
`v1.2 / 15 september 2026`.

Gecontroleerd dat de claim "drie partijen" in de TL;DR blijft kloppen — die telt de partijen achter
nieuwsbrief, gids en donatie (Brevo, Gumroad, Ko-fi), niet de tabel als geheel.

TASKS.md en SESSIONS.md noemen nog "Gmail forwarding", maar dat staat in afgevinkte logs van
Sessie 91 en wás toen waar. Historische logs herschrijven maakt de projectgeschiedenis
onbetrouwbaar; alleen levende documentatie is bijgewerkt.

### Eindstand

```
MX      10 mx.zoho.eu. / 20 mx2.zoho.eu. / 50 mx3.zoho.eu.
SPF     v=spf1 a mx include:zoho.eu include:spf.brevo.com ~all   (5/10 lookups)
DKIM    zoho._domainkey  2048-bit, heel aangekomen (OpenSSL-gedecodeerd)
DMARC   v=DMARC1; p=none; rua=mailto:dmarc@hacksimulator.nl
check-mail.sh  12 geslaagd / 0 mislukt, ook ná de opzegging
```

Beide verzendpaden geverifieerd met echte mail, niet met aannames: Zoho SPF/DKIM/DMARC pass,
Brevo DKIM-aligned pass.

### Commits (2)

- `82a9a08` Mail van TransIP naar Zoho Mail (EU) verhuisd; runbook en DNS-guard vastgelegd
- `c058577` Zoho in de verwerkerstabel; de footer liep elf maanden achter op de kop

Vóór de commit is `janwillem@hacksimulator.nl` uit het runbook vervangen door `<eigenaar>@...`.
Check 19b zou het doorlaten (die kijkt naar consumenten-providers), maar het is de superuser-login
van de mailomgeving en deze repo is publiek.

### Learnings

- **Een prijs uit een zoekresultaat-titel is een bewering, geen meting.** De EUR 1,99 die ik
  adviseerde bestond niet; de bot-check die de verificatie blokkeerde was het signaal om het
  cijfer als onzeker te presenteren, niet om het alsnog te noemen.
- **Diagnosticeer niet vanuit één mislukte poging.** Ik concludeerde dat Zoho de directe signup-URL
  weigerde zonder referer. De echte oorzaak was dat mijn browserpaneel dichtstond. Die verkeerde
  diagnose kwam als vaststaand feit in het runbook terecht.
- **De eerste rode regel in een console is zelden de oorzaak.** De lege signup-pagina gaf een 403
  en een 400; dezelfde twee fouten verschenen bij een load die daarna gewoon slaagde. Pas een
  vergelijking met een geslaagde load maakte een foutmelding betekenisvol.
- **Scheid je eigen meting van de bevestiging van de leverancier.** Zoho's Verify-knop herkent een
  vers TXT-record pas na 30-60 minuten. Zonder een onafhankelijke `dig`-meting zit je een uur te
  twijfelen of je record fout is.

### Next steps

- [ ] DMARC `p=none` → `p=quarantine` zodra de rapporten op `dmarc@` alleen eigen verzendpaden
      tonen. Stond al als ambitie in `.claude/plans/brevo-deliverability-sessie-C.md`.
- [ ] Losse bevinding, buiten deze migratie: er staat een wildcard `* AAAA 2a01:7c8:e100:1::50a0`
      in de zone. Gemeten: `willekeurig-subdomein-test.hacksimulator.nl` resolvet daarheen, dus elk
      niet-gedefinieerd subdomein wijst naar TransIP-infrastructuur die niet meer van ons is.
      Eerst uitzoeken of er iets op leunt (`www` heeft een eigen CNAME, dus waarschijnlijk niet —
      maar dat is een bewering tot je het meet).

### Metrics delta

| | vóór | ná |
|---|---|---|
| Mailkosten | ~EUR 96/jaar | EUR 0 |
| Bundle `assets/` | 1740 KB | 1741 KB (+1 KB, privacy.html) |
| `src/` / `styles/` / `blog/` | 734 / 462 / 491 KB | ongewijzigd |
| Playwright | 43 specs / 317 `test()` | ongewijzigd |
| DNS-records mail | 8 (TransIP) | 4 (Zoho + Brevo) |

Geen code-wijziging aan `src/`, `styles/` of `tests/`. `legal-pages-overflow.spec.js` gedraaid op
de gewijzigde pagina: **27 passed** over drie motoren op 320/375/414px, dark + light — de nieuwe
tabelrij veroorzaakt geen horizontale overflow.

---

## Sessie 233: De pijl ontbrak in de font-subset, en die ene hack liet de haak van `[→]` onzichtbaar (5 september 2026)

**Mission:** "lees TASKS.md en CLAUDE.md, wat is de volgende stap?" — uitgemond in het
fire-ready maken van de launch-kit, en van daaruit in een renderbug die de site 38 dagen
onopgemerkt droeg.

### Mijn eerste antwoord was fout gerangschikt

Ik stelde de vier Firefox-flakies uit Sessie 232 voor. Heisenberg vroeg: *"is dat de beste
volgende stap? En niet de site kenbaar maken op fora?"* Dat was terecht, en het bewijs is hard:

| feit | waarde |
|---|---|
| dagen sinds launch-dag (29 jul) | **38** |
| sessies sindsdien (221-232) | **12, allemaal technisch** |
| nooit afgevuurde kanalen | **3** (EHGN-projectpost, Show HN, r/SideProject) |
| D+14-meting (`site:` + GSC + funnel) | gepland ~12 aug, **nooit gedaan** |

`launch-checklist.md:25` noemt dat blok *"Morgen oppakken"*. Dat "morgen" was 37 dagen geleden.

**De bias, expliciet:** ik rangschikte op *meetbaarheid vanuit de repo*, niet op waarde. Een
flaky test geeft een getal, distributie niet. Een codebase met 20 checks en 43 specs genereert
eindeloos zichtbaar werk; zonder tegenkracht wint de repo altijd. Twaalf sessies op rij is geen
toeval maar een patroon. Ook: #45 en #59 wachten op data die niemand ophaalt, dus ze blokkeren
zichzelf.

### De launch-visuals waren de take van vóór 6 juli

Twee onafhankelijke tells, beide gemeten en niet geredeneerd:

1. Ze dragen nog `[?] TIP:` — commit `43eeb58` hernoemde die marker op **6 juli** naar `[TIP]`
   (82 hits, 27 bestanden). Productie serveert `[TIP]` correct (gemeten, HTTP 200 op
   `/src/commands/network/nmap.js`).
2. De GIF is **640 hoog**, terwijl `capture-launch-visuals.mjs` sinds 14 juli 720 zegt.

Dus de her-capture van Sessie 173 is nooit in `~/hacksimulator-launch-visuals/` beland; wat daar
op 29 juli is heen gekopieerd was de oude take, en Sessie 232 gooide `.playwright-mcp/` weg
inclusief het goede origineel. Ondertussen tekende `TASKS.md` over precies die her-capture af:
*"3 artefacten geverifieerd (router-profiel + cyaan `[TIP]` + geen banner)"*. **Die claim is
onwaar tegen het artefact** — het beeld toont het tegendeel. Niemand heeft het beeld bekeken.

Sinds die take: **47 commits** op `styles/` en `src/`, waaronder `260f8af` (14 aug) die
repareerde dat elke verticale box-rand als streepjeslijn rendeerde — en het GIF-scenario is
`help` → `nmap`, waarbij `help.js:38` juist die boxen bouwt.

### De "vreemde cirkels" waren dithering, geen site-bug

Heisenberg meldde cirkels in de achtergrond die hij live niet ziet. `terminal.html:189` draagt
`<div class="grid-background">`, een echte radiale vignette (`main.css:219`, dark: center
`rgb(35,35,35)` → zwarte rand). Gemeten in dezelfde achtergrondstrook:

| | uitkomst |
|---|---|
| PNG (verliesvrij) | **74 unieke tinten**, ramp 4→17, vloeiend |
| GIF (226-kleurenpalet) | **2 kleuren**, pixel-om-pixel, **60 harde overgangen** |

Dither-dichtheid als functie van de straal: `100% → 91,4% → **39,5%** → 17,7% → 9,4% → 0%`.
Die sprong ís de zichtbare ring. De lichtere dithertint is `(13,17,14)` — groenig, want het
palet wordt opgeslokt door de groene terminaltekst en er blijft geen neutraal donkergrijs over.
Vandaar "vreemd" en niet gewoon korrelig.

**Fix:** `.grid-background` platgeslagen tot één effen tint via `addStyleTag`, **alleen in de
GIF-capture**; de PNG's houden de echte vignette omdat die hem getrouw renderen. Zelfde soort
opname-ingreep als de bestaande `CLEAN_STATE`. Afgetekend op de meting: **1 kleur, 0 overgangen**.

### #77 — de haak die niet schilderde

De verse capture toonde ` →]` in plaats van `[→]`. Zelfde beeld, alle drie op x=60:

```
[✓]    inkt 185      rendert
[TIP]  inkt 255      rendert
[→]    inkt 9 en 13  ACHTERGROND
```

Zelfbewakend gemeten: rects vóór én ná de screenshot identiek, populatie niet leeg. Trigger is
`help`; het overleeft scroll, geforceerde repaint én een volledige relayout via viewport-wissel,
dus geen paint-invalidatie. **Chromium-only** — firefox en webkit meten 255.

**Oorzaakketen (fontTools):** `jetbrainsmono-latin.woff2` (229 codepoints) miste U+2192 `→`,
U+2190 `←` én U+2713 `✓`. Die vielen terug op een systeemfont met een andere baseline —
precies waaróm `.marker-arrow`/`.inline-arrow` met `top:-.2em` bestonden. Die spans knippen de
regel in font-runs en laten `[` over als run van één teken vóór een elementgrens.

**Vier leads gemeten en uitgesloten** (zodat een volgende sessie ze niet opnieuw loopt):

| lead | uitkomst |
|---|---|
| `'JetBrains Mono Box'` eerst in de stack | **nee** — ook volledig uit de stack blijft de inkt 9 |
| `font-variant-ligatures: none` (S229) | **nee** — terug op `normal` én `contextual`: inkt blijft 9 |
| `::first-letter`-regel | **nee** — die bestaat nergens in `styles/` |
| span nesten i.p.v. verwijderen | **nee** — een wrapper zonder lift faalt identiek (inkt 9) |

**Vier structuren op de échte regels gemeten**, met de huidige structuur als control die móét falen:

```
A  huidig  [<span>→</span>]                inkt   9   <- control vuurt
B  hele marker in de lift-span             inkt 255   maar tilt óók de haken 4px op,
                                                      en de pijl staat dan nog steeds
                                                      laag t.o.v. de haken -> lost niets op
C  wrapper zonder lift, pijl-span erin     inkt   9   nesten helpt niet
D  geen span                               inkt 255   maar pijl zakt +3,5px door
```

Dat B niets oplost was de vondst die de richting bepaalde: beide "goedkope" fixes zijn slechter
dan ze lijken, dus de reparatie hoorde een laag dieper.

### De reparatie: het brondocument, niet de vindplaats

Subset opnieuw gebouwd uit upstream JetBrains Mono (SIL OFL; licentie stond al in
`styles/fonts/LICENSES/`), ná expliciete toestemming voor de download:

- as beperkt tot **wght 400-800** zoals het origineel (`varLib.instancer`)
- gesubset op de bestaande 229 codepoints **+ U+2190/U+2192/U+2713**
- features gelijkgehouden op `calt,ccmp,frac,locl,mark`

**Twee dingen die de meting corrigeerde vóór installatie:**

1. Met `--layout-features='*'` sleepte de subsetter **36 features en 123 alternate-glyphs** mee:
   35.772 bytes, +4,3 KB voor drie glyphs. Met de originele feature-set: 30.268.
2. **U+00AD** (zachte afbreekstreep) zat wél in de oude subset maar **niet in upstream** — die
   was door de vorige tool op de gewone hyphen gemapt. Zonder expliciet terugmappen was de
   wijziging stilzwijgend *subtractief* geweest.

**Verificatie vóór installatie:** 232 codepoints, niets kwijt, upem 1000, as 400-800, en
**0 advance-width-verschillen over alle 229 gedeelde codepoints** — dus geen layout-verschuiving.
Bestand **31.432 → 30.272 bytes**: kleiner mét drie glyphs erbij.

Daarna kon de hack weg: `.marker-arrow` volledig uit `renderer.js` + `terminal.css`, en
`.inline-arrow` behield kleur/marge maar verloor `position:relative;top:-.2em`.

**Gemeten ná de fix** (lokaal, no-store server, drie motoren), pijl t.o.v. haak:

```
chromium  +0,5px      firefox  0,0px      webkit  +0,5px
```

Beter dan de opgetilde span (−0,5) en ver beter dan de span weghalen zónder font-fix (+3,5).
De `←` in de nmap-output staat op **0,5px** van zijn referentieletter op alle drie de regels.

### Guard + mutanten

NEW `tests/e2e/marker-brackets.spec.js` (2 tests × 3 motoren) met drie asserties: **populatie**
(faalt óók bij nul treffers), **haak-schildert** (pixels, niet DOM) en **pijl-op-de-haaklijn**.

| mutant | faalt op | bijzonderheid |
|---|---|---|
| M1 span terug | structureel (3 motoren) **+** haak-inkt (**alleen chromium**) | bewijst dat de haak-tak motorspecifiek werkt |
| M2 unicode-range inperken | alleen uitlijning, 3 motoren | haak-inkt blijft groen — andere tak |
| M3 marker hernoemen | populatie, mét diagnostische melding | vuurt vóór de rest, dus leesbare diagnose |

⚠️ **De guard betrapte eerst mijn eigen meetfout.** Op webkit is de screenshot in
**device-pixels** en `getBoundingClientRect` in **CSS-pixels** — factor 2. Daardoor lazen álle
vier de markers als "geen inkt", inclusief `[?]` en `[✓]` die aantoonbaar renderen. Zonder een
control die móét slagen had ik dat als een tweede bug gerapporteerd. Nu `devicePixelRatio`-bewust.

⚠️ Tweede eigen fout, dezelfde klasse: mijn verificatiescript filterde op `bb.y + bb.h <= 720`
terwijl een `DOMRect` geen `.h` heeft → `NaN <= 720` is false → **lege populatie**. De spec meldde
dat als "LEGE POPULATIE" in plaats van groen te zijn. Dat is precies waarvoor die tak bestaat.

### Launch-kit fire-ready

- Feitentabel hergeteld: **42** command-files (was 41), **14** blogposts (was 13). Beide vloeren
  (`40+`, `12+`) overleven de drift — dát is waarom ze als vloer staan en niet als exact getal.
- Twee stale instructies weg: de kop stuurde nog naar de op 22 jul overgeslagen demand-validatie
  (#44), en de D-1-lijst stond onafgevinkt terwijl `launch-checklist.md` §Stand meldt dat hij is
  uitgevoerd. Twee documenten die dezelfde toestand bijhielden; de checklist is nu expliciet eigenaar.
- NEW **§6**: de drie open kanalen als definitieve tekst, met de HN-valkuil (URL-veld invullen →
  tekstveld leeg → beschrijving als eerste comment).
- Gemeten: alle bestemmingslinks + **28 sitemap-URL's op HTTP 200**, 0 falers.

### Commits

- `417fa53` — De cirkels waren GIF-dithering; de ontbrekende haak is een echte regressie
- `e50630e` — De pijl ontbrak in de font-subset; die hack liet de haak van `[->]` onzichtbaar
- `86d958d` — Visuals opnieuw gecaptured nu #77 gefixt is; kit-footer bijgewerkt

### Metrics delta

```
specs           42  → 43        (NEW marker-brackets.spec.js)
test()         315  → 317
getrackt       377  → 378
bundel      1104,85 → 1105,32 KB / 1120   (marge 15,15 → 14,68 KB; +480 B, alleen commentaar)
font woff2   31.432 → 30.272 bytes        (telt niet mee in RUNTIME_SOURCE; wél voor de bezoeker)
codepoints      229 → 232                 (+U+2190 +U+2192 +U+2713, 0 advance-width-verschillen)
checks           20 → 20
```

Regressie: **251 passed / 0 failed / 4 skipped** over `responsive-ascii-boxes` +
`font-ligatures` + `marker-brackets`, drie motoren, mét eindblok. De guard daarna óók
**6/6 groen tegen productie**.

### Next steps

- **De vier Firefox-flakies staan er nog steeds** (`blog-theme-toggle`, `tutorial-mobile`,
  `tutorial`, `persistence-flush.spec.js:76`). Sessie 232 noteerde ze al; twee sessies is nog
  geen patroon, drie wel.
- **#45/#46/#59 blokkeren zichzelf** zolang de GA4-funnel en GSC Coverage niet worden opgehaald.
  De launch-kit is nu klaar; wat rest is Heisenberg's uur en zijn login.
- **#74 (minify) heeft zijn trigger niet gehaald:** marge 14,68 KB tegen een drempel van 5.
- De les uit #77 die generaliseert: een **font-subset is een aanname**. Elke CSS-hack die een
  glyph verticaal corrigeert, is een symptoom van een ontbrekende codepoint — kijk daar eerst.

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
