# Sessie-archief 230-234 - HackSimulator.nl

**Geroteerd uit `current.md` bij Sessie 245** (steady-state `N % 5`-rotatie, zie
`docs/sessions/README.md` §Rotatie-regel). Nieuwste-eerst binnen dit blok. Er waren geen
losse learnings-blokken voor deze sessies; alles zit in de entries zelf.

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
