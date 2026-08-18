# Maandelijks Newsletter Template — Brevo

**Type:** Regular campaign (maandelijks)
**Platform:** Brevo (migratie van MailerLite: Sessie 165, juni 2026)
**Editor:** **Import HTML** — NIET de drag-and-drop editor (die sloopt de dark-mode media
queries en de Outlook-conditionals; zie `brevo-setup-sample-pentest.md`)
**Verzenddag:** Derde dinsdag van de maand
**Verzendtijd:** 10:00 CET
**Lijst:** `hacksimulator-main`

> **De regel is het interval, niet de kalenderdag: minimaal 21 dagen sinds de vorige
> verzending.** Schuift een editie daardoor, schuif dan naar de **volgende dinsdag** —
> niet naar de volgende maand.
>
> **Waarom dit is veranderd (augustus 2026).** Hier stond "eerste dinsdag van de maand
> (beste open rates voor B2C NL)". Twee dingen mis:
>
> 1. Die parenthese was een onbewezen claim. "Beste dag om te mailen"-onderzoek is
>    geaggregeerd over duizenden afzenders, de studies spreken elkaar tegen, en met twee
>    verstuurde edities is een dag-van-de-week-effect op deze lijst niet meetbaar. Kies
>    hier niets op "open rates" — dat is kiezen op ruis.
> 2. Het anker was fout. "Eerste dinsdag" rekent per **kalendermaand**, terwijl de cadans
>    een **interval** is. De juli-editie ging eind juli de deur uit; de eerstvolgende
>    eerste dinsdag was 4 augustus — vijf dagen later. De regel dwong dus tot óf een gat
>    van 5 dagen, óf augustus overslaan. Precies de twee uitkomsten die je niet wil.
>
> Met de derde dinsdag zijn de gaten aug→dec 2026: **19 / 28 / 35 / 28 / 28 dagen**
> (gemeten met `date -d`, niet uitgerekend).
>
> Wat wél voor een vaste dag pleit is niet de openratio maar de **deadline**. Er staan
> twee edities in git over vijf maanden (april, juli); mei en juni zijn overgeslagen. Het
> risico in dit project is niet de verkeerde weekdag — het is dat er geen editie komt.
> Daarnaast: een voorspelbare afzender wordt herkend in plaats van als verrassing
> behandeld, en een regelmatige verzendcadans is voor ISP's een gezonder signaal dan
> lange stiltes met uitschieters. Alle drie die argumenten staan los van de weekdag zelf.
>
> Wil je ooit iets optimaliseren op deze lijstgrootte: test onderwerpregels, niet de klok.

---

## Vast Format (elke maand invullen)

### Onderwerpregel formaat
"[Pakkende tip/onderwerp in max 50 tekens]"

Geen maandprefix — subscribers zien de datum al in hun inbox. Houd het kort en creëer nieuwsgierigheid.

Voorbeelden:
- "Eén commando onthult een heel netwerk"
- "Waarom poort 443 belangrijker is dan je denkt"
- "Je eerste SQL injection (legaal)"

**Preview tekst:** Eerste zin van de Tip van de Maand sectie.

---

## Email Structuur

### [1] Terminal Header (vast)
```
$ cat nieuwsbrief-[maand]-2026.txt
> Loading...
```
Kleur: #9fef00 (neon groen), font: monospace, 13px

---

### [1.5] Intro (vast)

**Heading (vast, elke editie hetzelfde):**
> **Welkom bij je maandelijkse dosis cybersecurity.**

**Tekst (variabel per editie):**
> [1-2 zinnen context over wat er in deze editie staat. Bij de eerste editie:
> introductie van de nieuwsbrief. Bij latere edities: korte teaser van de tip.]

---

### [2] Tip van de Maand (hoofdcontent)

**Format:**
> **[Titel van de tip]**
>
> [2-3 alinea's, 150-250 woorden. Praktisch, actionable, beginner-friendly.
> Eindig altijd met een concrete "probeer dit zelf" actie.]
>
> **Probeer het zelf:** Open de simulator en typ `[commando]`
> [BUTTON: Open de simulator →]

**Toon:** Zoals een blogpost, maar korter. "je", bemoedigend, context geven.

### Bij een aanvals-tip: toon de invoer náást het resultaat

De augustus-editie moest hier twee keer voor terug. De eerste versies lieten zien wat de
database *vóór* en *ná* de aanval te verwerken kreeg, maar nergens **wat de aanvaller intypte**.
Daarmee mist de lezer de schakel die alles verbindt: hij moet aannemen dat één teken in de
adresbalk spontaan een hele extra regel oplevert.

Dat is geen stijlprobleem en je herstelt het niet met betere formuleringen — er moet een stap
bij. Het patroon dat wél werkt:

```
Jij typt 1, dus:
Zoek product met nummer: 1

Jij typt 1 of 1=1, dus:
Zoek product met nummer: 1
of alles waarvoor 1 = 1
```

**Vuistregel:** elke stap moet zichtbaar uit de vorige volgen. Kun je een regel schrappen zonder
dat de lezer struikelt, dan was hij overbodig; moet de lezer iets aannemen, dan ontbreekt er een
regel.

Twee dingen die daarbij horen:

- **Geef een metafoor werk te doen.** Een eerdere versie noemde de aanhalingstekens "een hek".
  Dat gééft het begrip alleen een naam; wie het onderscheid tussen gegeven en opdracht nog niet
  voelt, heeft aan dat woord niets. Een invulbriefje werkt wél, omdat de lezer er zelf ooit een
  heeft ingevuld en het mechanisme dus al kent.
- **Leg de syntax pas uit ná het mechanisme.** De apostrof staat in augustus bewust in de
  laatste alinea: eerst begrijpen wat er gebeurt, dan pas hoe je het opschrijft. Andersom leest
  het als code die je maar moet geloven.

### De onderliggende regel: introduceer niets wat de lezer niet kan herleiden

De augustus-tip moest hier **drie** ronden voor terug, en het was elke keer dezelfde fout in een
andere vermomming: een teken, term of naam neerzetten zonder dat de lezer kan zien waar hij
vandaan komt. Eerst de invoer van de aanvaller, daarna de databasenamen, daarna de apostrofs.

Dat is geen taalprobleem. Wie het onderwerp kent leest eroverheen, want zíjn hoofd vult de
herkomst zelf in. Alleen een lezer die het níét kent merkt het — en die krijg je pas te spreken
nadat de mail verstuurd is. Leg een tip daarom langs deze drie vragen:

1. **Komt elk symbool ergens vandaan?** Als er ineens vier apostrofs op precieze plekken staan,
   moet de tekst zeggen wie ze daar heeft gezet en waarom. "Zo ziet het er in het echt uit" is
   geen uitleg maar een verzoek om vertrouwen.
2. **Is elke technische naam één keer vertaald?** `users_db` betekent niets tot je zegt dat
   *users* gebruikers zijn. Hetzelfde geldt voor jargon dat je terloops gebruikt: "tabellen en
   kolommen" is in augustus geschrapt omdat de lezer het niet nodig had.
3. **Spreekt een later voorbeeld een eerder voorbeeld tegen?** Zo ja, benoem het verschil —
   schrijf het niet weg. In augustus stond in het eerste voorbeeld géén apostrof en in het
   tweede vier. Beide klopten (getalveld versus tekstveld), maar zolang dat er niet stond, leek
   het een fout van de schrijver. Een oplettende lezer struikelt daar altijd over.

Vuistregel bij twijfel: kun je een regel schrappen zonder dat de lezer struikelt, dan was hij
overbodig. Moet de lezer iets aannemen, dan ontbreekt er juist een regel.

**Voorbeelden van onderwerpen:**
- "Wat vertelt een open poort over een systeem?"
- "3 manieren om een sterk wachtwoord te herkennen"
- "Wat gebeurt er eigenlijk als je `ping` typt?"
- "De 5 belangrijkste Linux commando's voor beginners"

---

### [3] Nieuws / Updates (kort)

**Format:**
> **Wat is er nieuw?**
>
> - [Nieuw blogpost / feature / update — 1 regel + link]
> - [Eventueel tweede item]

Maximaal 2-3 bullets. Als er geen nieuws is, laat deze sectie weg.

---

### [4] Aanbeveling (eigen product)

**Format:**
> **Download: [Cheatsheet naam]**
>
> [1-2 zinnen over wat het is en voor wie]
>
> [BUTTON: Download (gratis / €2.50) →]
> Link: Gumroad product URL

**Toon:** Geen harde sell. "Misschien handig" vibe.

> ⚠️ **Dat is een toonaanwijzing, géén kop.** In juli 2026 is die omschrijving letterlijk als
> sectiekop overgenomen ("Misschien handig"), en in augustus is hij klakkeloos meegekopieerd.
> Twee edities lang stond er dus een kop die de lezer vooraf vertelt dat hij dit blok kan
> overslaan. "Geen harde sell" betekent niet dat je je eigen aanbod wegwuift.

**Kies de kop als de vraag die de tip oproept.** Een goede aanbevelingskop is een vraag waar de
lezer na het lezen van de tip mee zit, en het aanbod is dan het antwoord in plaats van een
advertentie. Augustus 2026: de sqlmap-tip laat een aanval zien, dus de kop werd
**"Mag dit eigenlijk wel?"** met de gratis juridische sample eronder.

**Laat de kop matchen met de H1 van de landingspagina.** Die van augustus staat woordelijk zo op
`sample-juridisch.html`. Kop en bestemming zeggen dan hetzelfde: eerlijker, en de klik levert wat
hij belooft.

Als er geen nieuw product is, verwijs naar een bestaande cheatsheet of laat weg.

---

### [5] Footer (vast)

```
---
HackSimulator.nl — Leer ethisch hacken in je browser

Je ontvangt deze mail omdat je je hebt aangemeld via hacksimulator.nl.
[Uitschrijven] · [Privacybeleid] · [Bekijk in browser]
```

**Conventie (vastgelegd 01 aug 2026): één footer, in de HTML.** De uitschrijf- en mirror-link
horen in deze gestileerde footerregel, binnen de donkere kaart — niet in een los Brevo-blok
eronder. Zo blijft de mail één geheel in het HackSimulator-uiterlijk.

- In de HTML: `<a href="{{ unsubscribe }}">` en `<a href="{{ mirror }}">` (Brevo-syntax,
  spaties binnen de accolades)
- In Brevo: géén extra native footer-blok onder de HTML toevoegen. Staat er al één, verwijder
  hem. Weigert Brevo dat, dan eist hij zijn eigen blok en laat je het staan

**Status 01 aug 2026: beide welkomst-automations volgen deze conventie.** Automation 1
(`welkomstmail.html`) en automation 2 (`welkomstmail-sample-pentest.html`) hebben allebei de
uitschrijf- en mirror-link in het HTML-blok staan; het losse Brevo-footerblok is bij beide
verwijderd en de links zijn na de wijziging getest. De repo-bestanden en Brevo lopen dus
gelijk — houd dat zo bij een volgende import.

**Aanvulling Sessie 212:** er komt een derde bij — `welkomstmail-sample-juridisch.html`. Die is
gekopieerd van de pentest-variant en draagt dezelfde footer-conventie, maar staat pas in Brevo
zodra `brevo-setup-sample-juridisch.md` is uitgevoerd. Controleer bij die import hetzelfde:
geen extra native footer-blok.

---

## Design

Zelfde stijl als welkomstmail:
- Achtergrond: #0d1117 (outer) / #161b22 (inner)
- Tekst: #c9d1d9 (headings) / #8b949e (body)
- Links: #79c0ff
- Buttons: #9fef00 met #0d1117 tekst
- **Font: de monospace-stack hieronder, 16px** (was Courier New 15px tot augustus 2026)
- **Vet = kopkleur #c9d1d9, niet alleen font-weight** (zie hieronder)
- Max breedte: 600px

### De fontstack (herzien augustus 2026)

```
'JetBrains Mono', Consolas, Menlo, 'Roboto Mono', 'DejaVu Sans Mono', 'Courier New', monospace
```

Windows pakt Consolas (Vista+, komt ook met Office mee), Apple pakt Menlo, Android Roboto Mono,
Linux DejaVu Sans Mono. Courier New staat achteraan als vangnet. JetBrains Mono voorop kost
niets en is het font dat de **site zelf** draait, dus bij een lezer die het heeft matcht de mail
het merk exact.

**Waarom Courier New niet meer voorop staat.** Het Courier-ontwerp heeft een uitzonderlijk kleine
x-hoogte, en het staat juist wél op de platforms waar dat het meest opvalt:

| platform | Courier New aanwezig? | x-hoogte-ratio |
|---|---|---|
| Windows / macOS / iOS | **ja** | **0,42** |
| Android | nee → Roboto/Droid Sans Mono | ~0,53 |
| Linux | nee → Liberation Mono | 0,53 |

Gemeten op 100px met canvas-inkmeting: Nimbus Mono PS (Courier-ontwerp) **0,42**, Liberation Mono
**0,53**, DejaVu Sans Mono **0,55**. Bij 15px betekende dat 6,30px x-hoogte voor een Apple-lezer
tegen 7,95px voor een Android-lezer: ~20% verschil in optische grootte binnen dezelfde mailing.
De nieuwe stack legt iedereen op ~0,55, en dat kost **nul extra maillengte** — een grotere
x-hoogte bij gelijke px-grootte en gelijke regelhoogte.

### Vet: geef het de kopkleur, niet alleen gewicht

Tot augustus 2026 zat `<strong>` binnen een span met `color:#8b949e`, dus vet erfde exact de
bodykleur. Gemeten: **5,62:1 voor beide** — vet kreeg alleen een gewichtsverschil, en in een
monospace is dat te weinig om op te vallen.

```html
<strong class="heading-text" style="color:#c9d1d9;">…</strong>   <!-- 11,21:1 -->
```

`heading-text` is bewust hergebruikt: die klasse heeft in het gedeelde `<style>`-blok al haar
drie dark-mode-varianten, dus dit vraagt geen blokwijziging. **Uitzonderingen:** de `<strong>` in
de terminal-header (staat op de groene balk) en die in de footer (draagt de kopkleur al).

### Klemtoontekens: spaarzaam, en nooit bovenop vet

Een `<strong>` met de kopkleur legt de nadruk al twee keer (gewicht + contrast). Zet daar geen
klemtoonteken bovenop — een derde signaal leest niet als nadruk maar als typefout. In augustus
2026 stond er `eerste die jíj typt` binnen zo'n strong; het accent is geschrapt, het vet bleef.

Twee regels:

- **Nooit op `ij`.** Het accent hoort op de klinker, en staat die met meer letters geschreven,
  dan op de eerste twéé (`één`, `óók`, `dáár`). In `jij` is de klinker de digraaf `ij` en een `j`
  kan geen accent aigu dragen, dus `jíj` accentueert de helft. Los het op met vet, cursief of
  een herformulering.
- **`één` is de uitzondering** en blijft altijd staan: dat is geen nadruk maar een
  betekenisonderscheid (telwoord tegenover lidwoord).

Correcte gevallen in de augustus-editie, ter referentie: `één` (6×), `dáár` (2×), `wél` (1×).

> **Meet nooit typografie op een Linux-machine zonder eerst `fc-match` te draaien.**
> `fc-match "Courier New"` geeft hier LiberationMono-Regular.ttf. Dat substituut is metrisch
> compatibel in **breedte** maar heeft een 26% grotere x-hoogte. Je keurt dan een weergave goed
> die geen enkele Apple- of Windows-ontvanger krijgt. Wil je de echte Courier-weergave zien,
> forceer dan `'Nimbus Mono PS'` — zelfde ontwerp, ratio 0,42.

---

## Base CSS Block (kopieer naar elke nieuwe email)

Het `<style>` blok in de `<head>` is identiek voor alle emails.
Kopieer dit blok exact uit `nieuwsbrief-augustus-2026.html`, **niet uit juli of eerder**.
Controleer na het kopiëren met een diff dat het blok byte-identiek is aan augustus; wijkt er iets
af, dan heb je per ongeluk een dark-mode-override meegewijzigd.

> **Het blok is in augustus 2026 gewijzigd en die wijziging is bewust.** Twee dingen: de
> `.mobile-padding`-selector is gerepareerd (zie §De `.mobile-padding`-bug) en de fontstack is
> vervangen (zie §Design). De juli-editie en de drie welkomstmails dragen dus nog het óude blok.
> Dat is geen drift maar historie: juli is een verzendrecord. Werk je een welkomstmail bij, neem
> dan het augustus-blok mee en importeer hem opnieuw in Brevo.

Het blok bevat:
- `@media (prefers-color-scheme: dark)` — dark mode overrides (11 klassen)
- `u + .body` — Gmail dark mode prevention (11 klassen)
- `[data-ogsc]` — Outlook.com dark mode overrides (12 klassen)
- `@media (max-width: 600px)` — responsive regels + mobiele header/code block

**Wijzig deze klassen NIET per email.** Ze beschermen de HackSimulator kleuren tegen automatische dark mode inversie door email clients.

### Twee code-klassen, nooit één

- `.code-block` — het blok-codevenster (`<td>`), krijgt op mobiel `padding: 12px 14px`
- `.code-inline` — een code-chip midden in een zin (`<code>`), krijgt op mobiel `padding: 1px 4px`

Gebruik nooit dezelfde klasse voor beide. Verticale padding vergroot bij een inline element
de regelhoogte niet, alleen het gekleurde vlak: met de blok-padding wordt een chip 38px hoog
in een regel van 24px en snijdt hij door de regels erboven en eronder (Sessie 206).

### Codeblok-budget: 29 tekens per regel

Gemeten, niet gerekend. **Houd 29 aan** — dan is de mail op élke breedte schoon:

| breedte | binnenruimte | capaciteit |
|---|---|---|
| 320px | 213px | **29 tekens** ← de bindende grens |
| 375px | 268px | 37 tekens |
| 600px+ | 500px+ | 68 tekens |

Vóór augustus 2026 stond hier 32, op basis van een 232px binnenruimte. Dat cijfer klopte, maar
het was een symptoom: zie de selector-bug hieronder. Ná de fix is er @375px méér ruimte (268px),
maar de bindende grens verschoof naar 320px omdat de mail daar nu ook schoon moet zijn.

**Wat je hier makkelijk verkeerd doet:**

- **`word-break: break-all` laat een te lange regel WRAPPEN, niet overlopen.** Daardoor blijft
  `scrollWidth == clientWidth` en ziet een overflow-check dit **niet**. Meet de tekstbreedte per
  regel tegen de binnenruimte, of vergelijk gerenderde regels met bedoelde regels (hoogte /
  line-height). De juli-editie heeft hierdoor één wrappende regel van 38 tekens
  (`$ hashcat -m 0 hashes.txt wordlist.txt`) die niemand had gezien.
- **Meet met het Courier-ontwerp erbij.** Forceer `'Nimbus Mono PS'` en controleer dat het
  daar óók past — anders keur je goed wat een Apple-lezer niet krijgt.

### De `.mobile-padding`-bug (gerepareerd augustus 2026)

Het gedeelde blok had jarenlang:

```css
.mobile-padding td { padding-left: 16px !important; ... }   /* afstammeling-selector */
```

De klasse staat **óp** de contentcel (`<td class="content-bg mobile-padding">`), maar
`.mobile-padding td` matcht alleen tds *binnen* die cel. Gemeten:
`cel.matches('.mobile-padding td') === false`. De cel hield dus zijn inline 32px, en de regel
landde in plaats daarvan op de geneste **code-block**-cellen — waar hij met (0,1,1) de eigen
`.code-block { padding: 12px 14px }` (0,1,0) versloeg.

Twee gevolgen, allebei jarenlang onopgemerkt: de tekstkolom was 264px waar 296px bedoeld was, en
de codeblokken kregen 16px in plaats van 14px. Nu `td.mobile-padding`. Netto leverde die ene
fix +32px kolombreedte op **en** werd de mail 366px korter, omdat tekst minder vaak afbreekt.

### `white-space: nowrap` op een code-chip

Een chip midden in een zin kan over twee regels vallen (`shop.nl/?` + `id=1`). Dat is geen
renderfout — elk fragment blijft 17px in een regelbox van 24px — maar een URL of commando
leest zo verkeerd. `nowrap` lost het op, met één grens:

**Zet nooit `nowrap` op een chip breder dan ~190px zonder @320px te hermeten.** Gemeten met
drie varianten in augustus 2026:

| Variant | @320px document | URL-chip |
|---|---|---|
| `nowrap` op alle 4 chips | **19px te breed** | heel |
| `nowrap` op geen enkele | 0px | valt in 2 stukken |
| `nowrap` op de 3 korte (≤110px) | **0px** | **heel** ← gekozen |

Een chip met `nowrap` die breder is dan de kolom kan niet breken en duwt de buitenste tabel
voorbij de viewport. De lange commando-chip (219px) houdt daarom géén `nowrap`.

### Donkere tekst op de groene balk/knop

De donkere tekstkleur staat altijd sámen met `background-color:#9fef00` op hetzelfde element
(zowel inline als in de `.header-text`/`.btn-text` klasseregels). De Gmail-app herschrijft in
dark mode losse tekstfragmenten zonder eigen achtergrond naar wit — een lokaal kloppend
kleurenpaar voorkomt dat. Haal die achtergrond er niet af.

---

## Content Kalender

### Verstuurd

| Maand | Tip van de Maand | Aanbeveling |
|-------|-----------------|-------------|
| April 2026 | "Wat vertelt nmap over een netwerk?" | — |
| Juli 2026 | "Hoe kraakt een hacker een wachtwoord?" (`hashcat`) | Gratis Sample Pentest |
| Augustus 2026 | "Hoe één apostrof een database opent" (`sqlmap`) | Gratis juridische sample |

Mei en juni 2026 zijn **niet** verstuurd. Hun geplande onderwerpen staan hieronder weer op
de kandidatenlijst — de SQL-injectietip van juni is in augustus 2026 alsnog gebruikt.

### Kandidaten

Elke tip heeft een commando in de simulator nodig waar de lezer hem direct kan proberen;
zonder dat hoort het onderwerp op het blog, niet in de tipslot.

| Onderwerp | Commando('s) | Bestaande blogpost om naar te linken |
|---|---|---|
| Zoeken in een systeem: waar informatie ligt | `grep`, `find` | `linux-bestandssysteem.html`, `terminal-basics.html` |
| Wat verraadt jouw eigen machine? | `netstat`, `ifconfig` | — (nog geen post) |
| Wat een open poort eigenlijk zegt | `nmap`, `whois` | `nmap-beginnersgids.html` |
| Zwakke plekken in een webserver | `nikto` | `cybersecurity-tools.html` |
| Wachtwoorden brute-forcen vs. raden | `hydra` | `wachtwoord-beveiliging.html` |

**Twee aanvalstools op rij is een signaal, geen verbod.** Juli (`hashcat`) en augustus
(`sqlmap`) waren beide offensief. De doelgroep is beginners, dus zet daar een tip tegenover
die de terminal zelf leert — de eerste kandidaat in de tabel is daarvoor bedoeld.

**Kies de aanbeveling op wat nieuw is sinds de vorige editie**, niet op wat het beste
verkoopt. Herhaal geen product dat de vorige editie al pushte: de lezer zag het net.

---

## Checklist voor verzending

- [ ] Onderwerpregel < 60 tekens
- [ ] Preview tekst ingevuld (de verborgen preheader-div bovenaan de HTML)
- [ ] Alle links getest (terminal, blog, cheatsheet)
- [ ] UTM parameters op alle links (`?utm_source=newsletter&utm_medium=email&utm_campaign=[maand]-[jaar]`)
      — behalve `privacy.html`, dat is een juridische link en geen campagnelink
- [ ] Elk getal in de mail nageteld tegen zijn bron (pagina-aantallen ↔ `gidsen.html`,
      command-output ↔ `src/commands/…`) — niet tegen een eerdere editie
- [ ] `<style>`-blok byte-identiek aan de vorige editie (`diff`, niet op het oog)
- [ ] Via **Import HTML** geplaatst, niet via de drag-and-drop editor
- [ ] **Codeblokregels ≤ 29 tekens, gemeten** — niet "mobiel preview gecheckt". Zie
      §Codeblok-budget: een te lange regel *wrapt* en is daardoor onzichtbaar voor een
      overflow-check én makkelijk te missen in een previewvenster
- [ ] Uitschrijflink werkt (`{{ unsubscribe }}`) — echt aanklikken in de test-mail
- [ ] Eén footer: de gestileerde regel in de HTML, géén los Brevo-blok eronder
- [ ] Verzendtijd: 10:00 CET, eerste dinsdag
- [ ] Test-email verstuurd naar eigen adres
- [ ] Test-email geopend op telefoon in **dark mode** (Gmail-app) — donkere tekst op de
      groene balk/knop, code-chips binnen hun regel

### Brevo variabelen
- Uitschrijven: `{{ unsubscribe }}`
- Bekijk in browser (mirror): `{{ mirror }}`
- Voornaam: `{{ contact.FIRSTNAME }}` (optioneel)

Let op de spaties binnen de accolades — dat is Brevo Template Language. De oude
MailerLite-vorm (`{$unsubscribe}`, `{$url}`) wordt door Brevo **niet** vervangen en blijft
letterlijk als href staan. De april-2026-nieuwsbrief in deze map draagt die oude syntax nog;
dat is historisch correct (verstuurd vóór de migratie), geen model om van te kopiëren.
