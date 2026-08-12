# Gumroad Product Listings — HackSimulator.nl

**Doel:** Dit bestand is de brontekst voor de 4 gidsen + de bundel op Gumroad. Copy-paste de teksten direct naar Gumroad.

## Producten in één oogopslag

| # | Product | Gumroad-ID | PDF | Pagina's | Prijs |
|---|---------|-----------|-----|----------|-------|
| 1 | Ethisch Hacken & Nederlandse Wet | `yzdtfx` | `juridische-gids.pdf` | 13 | vanaf €5 |
| 2 | Je Eerste Pentest: Playbook | `wmvpx` | `pentest-playbook.pdf` | 19 | vanaf €5 |
| 3 | Van Nul naar CTF: 12-Weken Leerplan | `eogjdk` | `leerplan.pdf` | 21 | vanaf €5 |
| 4 | Je Eigen Hacklab | `ojort` | `lab-opzetten.pdf` | 19 | vanaf €5 |
| 5 | **Starter Kit (bundel, alle 4)** | `emzjvj` | alle 4 bovenstaande | **72** | **vanaf €10** |

URL-vorm: `https://hacksimulator.gumroad.com/l/<ID>`. Alle vijf zijn live en gelinkt vanuit `gidsen.html`.

**Paginatellingen zijn geteld uit de gebouwde PDF's** (`./build-pdfs.sh`, 7 aug 2026), niet geschat.

Wijzigt een `.typ`-bron van omvang? Herbouwen, opnieuw tellen, en de claim op **zes** plekken
meetrekken. In deze volgorde, want de laatste twee worden het vaakst vergeten:

1. De tabel hierboven
2. De productbeschrijving in dit bestand (`~N pagina's | PDF | Nederlands`)
3. De bundeltelling in dit bestand (som van alle vier)
4. `gidsen.html` — de kaart-badge (`PDF | ~N pagina's`)
5. `gidsen.html` — de JSON-LD-beschrijving van de bundel
6. `scripts/build-product-covers.mjs` — de voettekst op de bundel-cover, daarna het script draaien

De bundeltelling ging in aug 2026 precies hierop mis: de lab-gids groeide van 18 naar 19 pagina's,
plek 2 en 4 werden meegetrokken, maar 3 en 5 bleven op ~70 staan terwijl de cover (6) al 71 zei.

**Lead magnets (gratis, op de site — niet op Gumroad):** `pentest-playbook-sample.pdf` (9 pagina's,
via `/sample-pentest.html`) en `juridische-gids-sample.pdf` (6 pagina's, via `/sample-juridisch.html`).

---

## Pricing Strategie

| Product | PWYW-minimum (vloer) | Suggestie op Gumroad |
|---------|----------------------|----------------------|
| Juridische Gids | €5 | €5+ |
| Pentest Playbook | €5 | €5+ |
| 12-Weken Leerplan | €5 | €5+ |
| Je Eigen Hacklab | €5 | €5+ |
| **Bundel (alle 4)** | **€10** | **€10+** |

**Aanbeveling:** **Pay-what-you-want met minimum €5 per gids / €10 bundel** (de getoonde "vanaf €5/€10" op de site). Los gekocht kosten de vier gidsen €20, dus de bundel bespaart €10.

> **Strategie-noot:** het oorspronkelijke plan was een €0-minimum (gidsen als lead magnet). Dat is verlaten — een vloer werkt beter, én de twee **gratis samples** (Pentest 9 p., Juridisch 6 p., beide met e-mail-capture) vervullen de lead-magnet-rol al. Zo is de funnel schoon gescheiden: gratis samples = bereik + e-mailadressen, betaalde gidsen = inkomsten. Noem daarom altijd het minimum ("vanaf €5"), **nooit kaal "pay what you want" en nooit "gratis"** — de gidsen kosten geld.

---

## Product 1: Juridische Gids

> **Product-ID: `yzdtfx`** — URL: `https://hacksimulator.gumroad.com/l/yzdtfx`
> PDF: `juridische-gids.pdf` (13 pagina's) · Cover: `assets/products/ethisch-hacken-wet.png`
> Gratis sample: `juridische-gids-sample.pdf` (6 pagina's) op `/sample-juridisch.html`.
> **Versie 1.1 (juni 2026):** de Krol-zaak bevatte feitfouten (beroep, "geanonimiseerde"
> dossiers, de manier van binnendringen) en zaak 2 was onverifieerbaar. Gecorrigeerd met
> echte ECLI-bronnen. Wie vóór juni 2026 kocht, heeft de onjuiste versie.

### Gumroad Titel
```
Ethisch Hacken & Nederlandse Wet: Wat Mag Wel, Wat Mag Niet?
```

### Korte beschrijving (Gumroad summary, max ~150 tekens)
```
De complete gids over ethisch hacken en de Nederlandse wet. Wat is legaal, wat niet, en hoe bescherm je jezelf? In gewoon Nederlands.
```

### Lange beschrijving (Gumroad productpagina)
```
Je wilt ethisch hacken leren. Maar mag dat eigenlijk wel?

Het korte antwoord: hacken is niet per definitie illegaal — ongeautoriseerd hacken is dat wel. Deze gids legt in gewoon Nederlands uit waar de grens ligt.

Wat je leert:
- De kernwet: Art. 138ab Sr (computervredebreuk) — wat is strafbaar en wat niet?
- De drie Wetten Computercriminaliteit (1993, 2006, 2019)
- Coordinated Vulnerability Disclosure (CVD) — hoe meld je een lek zonder gearresteerd te worden?
- De drie juridische voorwaarden van het OM
- Echte rechtszaken uit Nederland — wat ging er mis?
- AVG/GDPR en pentesting — wanneer heb je een verwerkersovereenkomst nodig?
- Bug bounty programma's in Nederland (HackerOne, Zerocopter, NCSC)
- Hack_Right: het OM-programma voor jonge hackers
- Praktische 10-punten veiligheidscheck voordat je begint

~13 pagina's | PDF | Nederlands
Met zorg samengesteld en gecontroleerd · herzien juni 2026.

Geschreven door HackSimulator.nl — de gratis browser-based terminal simulator voor ethisch hacken.
```

### Tags
```
ethisch hacken, ethical hacking, cybersecurity, Nederlandse wet, computervredebreuk, responsible disclosure, CVD, pentesting, beginner, Nederlands
```

### Categorie
```
Education > Cybersecurity
```

### Cover (gegenereerd door `scripts/build-product-covers.mjs`)
```
Titel: Ethisch Hacken & Nederlandse Wet
Subtitel: Wat Mag Wel, Wat Mag Niet?
Branding: HackSimulator.nl
Kleuren: donkere achtergrond (#0d1117), groene accenten (#9fef00) — match site huisstijl
```

---

## Product 2: Pentest Playbook

> **Product-ID: `wmvpx`** — URL: `https://hacksimulator.gumroad.com/l/wmvpx`
> PDF: `pentest-playbook.pdf` (19 pagina's) · Cover: `assets/products/eerste-pentest-playbook.png`
> Gratis sample: `pentest-playbook-sample.pdf` (9 pagina's) op `/sample-pentest.html`.

### Gumroad Titel
```
Je Eerste Pentest: Stap-voor-Stap Playbook
```

### Korte beschrijving (max ~150 tekens)
```
Van reconnaissance tot rapportage: een compleet werkboek voor je eerste pentest. Met beslisbomen, templates en alle commands.
```

### Lange beschrijving
```
Je weet wat Nmap doet. Je weet dat SQL injection bestaat. Maar hoe voer je een echte pentest uit, van begin tot eind?

Dit playbook geeft je de structuur die het verschil maakt tussen tools kennen en een methodologie beheersen.

De 6 fases die je doorloopt:
- Fase 0: Voorbereiding — toestemmingsdocument, testomgeving, mentale checklist
- Fase 1: Reconnaissance — passief en actief informatie verzamelen (whois, dig, ping, traceroute)
- Fase 2: Scanning & Enumeration — Nmap, Nikto, SQLmap met beslisbomen per tool
- Fase 3: Exploitation — Hydra, Metasploit met duidelijke do's en don'ts
- Fase 4: Post-Exploitation — systeemverkenning, gevoelige data, password cracking
- Fase 5: Rapportage — compleet template met management samenvatting, findings en ernst-classificatie

Inclusief:
- Beslisbomen bij elke fase (wat doe je als X?)
- Snelreferentie: alle commands op 1 pagina
- Veelvoorkomende poorten referentietabel
- Finding-template voor je rapport
- Ernst-classificatie (CVSS-gebaseerd, vereenvoudigd)

~19 pagina's | PDF | Nederlands
Met zorg samengesteld en gecontroleerd · april 2026.

Geschreven door HackSimulator.nl — de gratis browser-based terminal simulator voor ethisch hacken.
```

### Tags
```
pentest, penetration testing, ethisch hacken, ethical hacking, cybersecurity, nmap, werkboek, playbook, beginner, methodologie, Nederlands
```

### Categorie
```
Education > Cybersecurity
```

### Cover (gegenereerd door `scripts/build-product-covers.mjs`)
```
Titel: Je Eerste Pentest
Subtitel: Stap-voor-Stap Playbook
Branding: HackSimulator.nl
Kleuren: donkere achtergrond (#0d1117), groene accenten (#9fef00) — match site huisstijl
```

---

## Product 3: 12-Weken Leerplan

> **Product-ID: `eogjdk`** — URL: `https://hacksimulator.gumroad.com/l/eogjdk`
> PDF: `leerplan.pdf` (21 pagina's) · Cover: `assets/products/ctf-leerplan.png`
> **Versie 1.1 (aug 2026), twee wijzigingen:** (1) zelftests toetsen nu echt — 27 open vragen +
> antwoordsleutel. (2) Feitcorrectie: de FAQ noemde tweemaal "TryHackMe's Pwnbox". Pwnbox is van
> **HackTheBox** (gratis: eenmalig 2 uur ooit); TryHackMe's browser-VM heet **AttackBox** (gratis:
> 1 uur per dag). Samen 15 → 21 pagina's.

### Gumroad Titel
```
Van Nul naar CTF: 12-Weken Leerplan voor Ethisch Hacken
```

### Korte beschrijving (max ~150 tekens)
```
Van complete beginner naar je eerste Capture The Flag. 12 weken, 27 toetsvragen met antwoordsleutel, geen voorkennis nodig.
```

### Lange beschrijving
```
Duizenden cybersecurity-resources online. YouTube, cursussen, blogs, tools — overweldigend. De meeste beginners verdrinken niet in gebrek aan informatie, maar in een overvloed ervan.

Dit leerplan geeft je precies een ding per week, in de juiste volgorde.

Het 12-weken programma:
- Week 1-4 (Fundering): Terminal basics, netwerken, hoe websites werken, wet & ethiek
- Week 5-8 (Hands-on): TryHackMe, Nmap in de praktijk, web security, Linux privilege escalation
- Week 9-12 (CTF-voorbereiding): picoCTF, HackTheBox, zwakke punten versterken, eerste live CTF

Elke week bevat:
- Concreet doel (wat je aan het einde kunt)
- Activiteiten (wat je doet)
- Tijdsindicatie (hoeveel uur)
- Zelftest in twee delen — zie hieronder

De zelftest die je niet kunt bluffen:
De meeste cursussen sluiten af met "begrijp je dit?". Daar antwoord je "ja" op zonder het te
begrijpen, en dat doet vrijwel iedereen — niet uit oneerlijkheid, maar omdat herkennen precies
hetzelfde voelt als weten. Daarom bestaat de zelftest hier uit twee delen:

- "Gedaan?" — vinkjes voor wat je feitelijk hebt gedaan (drie rooms afgerond, Burp geïnstalleerd). Daar valt niets aan te interpreteren.
- "Begrepen?" — 27 open vragen verdeeld over week 1 t/m 10, met een drempel per week. Je schrijft je antwoord eerst op en kijkt daarna pas in de antwoordsleutel achterin. Die volgorde is het hele punt.

Week 11 en 12 zijn bewust reflectie zonder sleutel: daar bestaat geen goed antwoord dat ik voor je
kan opschrijven.

Inclusief:
- Antwoordsleutel op alle 27 vragen, met "ook goed"-varianten waar die er zijn
- Weekoverzicht op 1 pagina (tear-out referentie)
- Certificeringsadvies (Security+, eJPT, OSCP, CEH) met beslisboom
- Veelgestelde vragen ("Moet ik kunnen programmeren?" "Heb ik Kali Linux nodig?")
- Alle bronnen en platforms per week

~21 pagina's | PDF | Nederlands
Geen voorkennis nodig. 5-8 uur per week.
Week 1 t/m 4 doe je volledig in je browser. Vanaf week 5 heb je een gratis TryHackMe-account
nodig; vanaf week 10 werkt HackTheBox het prettigst vanaf je eigen virtuele machine.
Met zorg samengesteld en gecontroleerd · herzien augustus 2026.

Geschreven door HackSimulator.nl — de gratis browser-based terminal simulator voor ethisch hacken.
```

### Tags
```
ethisch hacken, ethical hacking, leerplan, beginner, CTF, capture the flag, cybersecurity, TryHackMe, HackTheBox, cursus, Nederlands
```

### Categorie
```
Education > Cybersecurity
```

### Cover (gegenereerd door `scripts/build-product-covers.mjs`)
```
Titel: Van Nul naar CTF
Subtitel: 12-Weken Leerplan
Branding: HackSimulator.nl
Kleuren: donkere achtergrond (#0d1117), groene accenten (#9fef00) — match site huisstijl
```

---

## Product 4: Je Eigen Hacklab

> **Product-ID: `ojort`** — URL: `https://hacksimulator.gumroad.com/l/ojort`
> PDF: `lab-opzetten.pdf` (19 pagina's) · Cover: `assets/products/je-eigen-hacklab.png`
> Live op Gumroad en gelinkt vanuit `gidsen.html`. Nieuwste gids (aug 2026).

### Gumroad Titel
```
Je Eigen Hacklab: Van Simulator naar een Echte Kali-Omgeving
```

### Korte beschrijving (Gumroad summary, max ~150 tekens)
```
Elke gids begint met "start je Kali VM". Deze gids bouwt hem — veilig afgeschermd, met snapshots en een doelwit om legaal op te oefenen.
```

### Lange beschrijving (Gumroad productpagina)
```
Je hebt in een simulator geoefend. Je weet wat nmap doet. En dan begint elke cursus, gids en video met dezelfde zin: "start je Kali VM en verbind met de VPN" — alsof dat vanzelf spreekt.

Deze gids maakt die stap. Aan het eind heb je een werkende oefenomgeving waarin je kunt scannen, exploiteren en dingen kapotmaken zonder dat iemand anders er last van heeft.

Wat je leert:
- Kali Linux in een virtuele machine, van download tot eerste login
- Welke virtualisatiesoftware bij jouw computer past (inclusief Apple Silicon)
- De netwerkmodus: het hoofdstuk dat ertoe doet. NAT, host-only en bridged — en waarom één verkeerde instelling je hele huis scant
- Snapshots: waarom een fout je een klik kost in plaats van een avond
- Een kwetsbaar doelwit opzetten om legaal op te oefenen
- Verbinden met TryHackMe of HackTheBox via VPN
- Van simulator naar lab: dezelfde commando's, maar wat er anders is aan echte output
- Vijf problemen die je waarschijnlijk tegenkomt, met de oplossing

Alle software in deze gids is gratis voor persoonlijk gebruik.

~19 pagina's | PDF | Nederlands
Met zorg samengesteld en gecontroleerd · augustus 2026.

Geschreven door HackSimulator.nl — de gratis browser-based terminal simulator voor ethisch hacken.
```

### Tags
```
kali linux, virtualbox, hacklab, pentesting lab, ethisch hacken, cybersecurity, tryhackme, hackthebox, VM, beginner, Nederlands
```

### Categorie
```
Education > Cybersecurity
```

### Cover (gegenereerd door `scripts/build-product-covers.mjs`)
```
Titel: Je Eigen Hacklab
Subtitel: Van Simulator naar Echte Kali-Omgeving
Branding: HackSimulator.nl
Kleuren: donkere achtergrond (#0d1117), groene accenten (#9fef00) — match site huisstijl
```

### Status

Afgerond: product aangemaakt (`ojort`), prijs op pay-what-you-want vanaf €5, productkaart +
JSON-LD + tracking-attributen staan op `gidsen.html`, cover gegenereerd.

**Opgelost op 7 aug 2026:** deze gids hoorde óók in het bundelproduct (`emzjvj`) te zitten. Zolang
`lab-opzetten.pdf` daar niet als vierde bestand aan hing, beloofde de site vier gidsen voor €10
terwijl de bundel er drie leverde. Dat bestand is inmiddels toegevoegd — zie §Stand van zaken
onderaan dit bestand, dat is de actuele status.

> Deze alinea zei tot 11 aug 2026 nog "nog open", vier dagen nadat het punt gesloten was. Dat is
> het bekende patroon: een notitie die een tóéstand beschrijft kan niet terugmelden dat hij
> verlopen is. Bij een volgende wijziging aan een product: werk §Status en §Stand van zaken in
> dezelfde bewerking bij, of laat §Status alleen naar §Stand van zaken verwijzen.

---

## Product 5: Bundle (alle 4)

> **Product-ID: `emzjvj`** — URL: `https://hacksimulator.gumroad.com/l/emzjvj`
> Bevat: `juridische-gids.pdf` + `pentest-playbook.pdf` + `leerplan.pdf` + `lab-opzetten.pdf`
> Cover: `assets/products/bundel-starter-kit.png` (gegenereerd door `scripts/build-product-covers.mjs`)

### Gumroad Titel
```
HackSimulator Starter Kit: 4 Gidsen voor Beginnende Ethische Hackers
```

### Korte beschrijving (max ~150 tekens)
```
Alles wat je nodig hebt om te starten met ethisch hacken: de wet, je eigen oefenlab, de methodologie en een 12-weken plan. 4 gidsen, 1 prijs.
```

### Lange beschrijving
```
Dit pakket bevat alle vier de HackSimulator-gidsen in een bundel:

1. Ethisch Hacken & Nederlandse Wet (~13 pagina's)
   Ken de regels voordat je begint. Nederlandse wetgeving, CVD, bug bounty's en echte rechtszaken.

2. Je Eerste Pentest: Stap-voor-Stap Playbook (~19 pagina's)
   De methodologie die professionals gebruiken. Van reconnaissance tot rapportage, met beslisbomen bij elke stap.

3. Van Nul naar CTF: 12-Weken Leerplan (~21 pagina's)
   Een gestructureerd pad van complete beginner naar je eerste Capture The Flag competitie. Met 27 open toetsvragen en een antwoordsleutel, zodat je per week merkt of je het echt snapt.

4. Je Eigen Hacklab (~19 pagina's)
   Van simulator naar een echte Kali-omgeving. Virtualisatie, de netwerkmodus die bepaalt of je per ongeluk je hele huis scant, snapshots en een doelwit om legaal op te oefenen.

Samen: ~72 pagina's praktische kennis in het Nederlands.
Geen voorkennis nodig. Met zorg samengesteld en gecontroleerd · laatst herzien augustus 2026.

Waarom deze bundel?
- De gidsen verwijzen naar elkaar: het leerplan gebruikt de beslisboom uit het playbook (week 6) en de juridische gids (week 4), en de hacklab-gids bouwt de omgeving waarin de andere drie zich afspelen
- Samen vormen ze een compleet startpakket: de regels, de omgeving, de methode en het tempo
- Los gekocht is dit €20 — als bundel vanaf €10

Geschreven door HackSimulator.nl — de gratis browser-based terminal simulator voor ethisch hacken.
```

### Tags
```
ethisch hacken, ethical hacking, bundel, beginner, cybersecurity, pentest, Nederlandse wet, leerplan, CTF, Nederlands
```

---

## CTA's: waar ze wonen

> Deze sectie bevatte kant-en-klare CTA-blokken met placeholder-URL's en het woord "gratis".
> Beide waren fout geworden: de URL's bestaan inmiddels écht, en de gidsen kosten €5.
> De templates zijn hier weggehaald in plaats van gerepareerd — twee plekken die hetzelfde
> beweren, driften uit elkaar. Er is er nu één per kanaal:

| Kanaal | Bron van waarheid |
|--------|-------------------|
| Blogposts (mid-content productkaart) | `docs/blog-template.md` §Gumroad product-CTA — inclusief de topic→product-mapping |
| Terminal (`man`-pagina's, "en nu?"-moment) | `src/` — de gidsen zijn bereikbaar vanuit de terminal sinds commit `c930fe2` |
| Nieuwsbrief | `docs/newsletter/` |
| Productpagina | `gidsen.html` |

**Woordkeus over alle kanalen:** "vanaf €5" of "vanaf €10". Nooit "gratis" — dat geldt alleen voor
de twee samples en de simulator zelf. Nooit kaal "pay what you want" zonder het minimum erbij.

### Nieuwsbrief-blok (nog wél hier, want geen ander thuis)

**Toevoegen aan een nieuwsbrief-editie** (de live welkomstmails staan in `docs/newsletter/`):
```
Vier Nederlandse gidsen, pay what you want vanaf €5:
- Ethisch Hacken & Nederlandse Wet — https://hacksimulator.gumroad.com/l/yzdtfx
- Je Eerste Pentest: Playbook — https://hacksimulator.gumroad.com/l/wmvpx
- Van Nul naar CTF: 12-Weken Leerplan — https://hacksimulator.gumroad.com/l/eogjdk
- Je Eigen Hacklab — https://hacksimulator.gumroad.com/l/ojort
Alle vier samen als bundel, vanaf €10: https://hacksimulator.gumroad.com/l/emzjvj
```
Hang er `?utm_source=newsletter&utm_medium=email&utm_campaign=<editie>` achter, zoals de
bestaande welkomstmail doet.

---

## Onderhoud: het proces zoals het écht werkt

De oorspronkelijke instructies hier beschreven Canva en Google Docs. Dat is achterhaald — de
gidsen worden uit Typst-bronnen gebouwd en de covers uit een Node-script.

### Een gids wijzigen

1. Bewerk de bron: `docs/products/<gids>.typ` (getrackt in git = single source of truth).
   Gedeelde opmaak zit in `template.typ` — een wijziging daar raakt **alle vier** de gidsen.
2. Herbouwen: `cd docs/products && ./build-pdfs.sh` (vereist `typst`).
   De `.pdf`-bestanden zijn build-output en staan in `.gitignore`.
3. **Tel de pagina's opnieuw** en trek de claim mee: de tabel bovenaan dit bestand, de
   productbeschrijving, de bundeltelling, `gidsen.html` (kaart-badge + JSON-LD) en de
   bundel-cover in `scripts/build-product-covers.mjs`.
4. Upload de nieuwe PDF naar het losse product **én** naar het bundelproduct. Gumroad ziet die
   twee als losstaande bestanden; één ervan bijwerken is de klassieke misser.
5. Verandert er een sample-hoofdstuk? Kopieer de herbouwde `*-sample.pdf` naar `assets/samples/`,
   anders serveert de site een oude versie.

### Een cover wijzigen

`node scripts/build-product-covers.mjs` → `assets/products/*.png` (2400×1260). Titel, eyebrow en
de bundel-voettekst staan in de `GUIDES`-array bovenin dat script.

### Instellingen per product op Gumroad

- Type: **Digital product**
- Price: **Pay what you want**, minimum €5 (bundel €10), suggested gelijk aan het minimum
- Cover: de PNG uit `assets/products/`
- Tags: uit dit bestand
- "Collect email addresses": **aan**

### Brevo-koppeling (nog steeds niet gebouwd)

Gumroad heeft geen directe Brevo-integratie. Opties: Zapier (gratis tier) voor
`Gumroad sale → Brevo subscriber`, of handmatig exporteren/importeren. Bij het huidige volume is
handmatig genoeg.

---

## Stand van zaken: afgerond op 7 aug 2026

Er staat niets open. Deze sectie legt vast wát er gedaan is en — belangrijker — wat er bewust
**niet** is gedaan, zodat dat niet over een paar sessies opnieuw als openstaand punt opduikt.

**Op Gumroad**

- [x] Alle vier de PDF's opnieuw geüpload, zowel als los product als in bundel `emzjvj` —
      daarmee zit `lab-opzetten.pdf` als vierde bestand in de bundel en klopt de belofte
      "alle 4 gidsen" weer. **Bij de bron nageteld op 11 aug 2026: vier PDF's in `emzjvj`.**
- [x] Beschrijvingen en paginagetallen van alle vijf de producten bijgewerkt.
- [x] Bundel-cover vervangen door `assets/products/bundel-starter-kit.png` ("~72 pagina's").
- [x] Gecontroleerd dat er nergens "gratis" staat bij de betaalde producten.

De vier losse covers zijn níét gewijzigd: `build-product-covers.mjs` hertekent ze wel, maar alleen
de bundel-voettekst veranderde. Op Gumroad hoeven ze dus niet opnieuw.

**Op de site** — commit `db7d7de`, live geverifieerd na deploy: bundelkaart en JSON-LD op
~72 pagina's, leerplan-badge op ~21, de gratis juridische sample verwijst naar v1.1, en de gratis
pentest-sample breekt weer met Nederlandse patronen af (`verwij-zen` i.p.v. `verwi-jzen`).

**Bewust niet gedaan: bestaande kopers inlichten**

Er is tot nu toe **één koper** (eerst het playbook los, daarna de oude bundel van drie gidsen).
Hij heeft dus de Pwnbox-fout in het leerplan gehad, en mogelijk de Krol-fout. Besloten om hem
niet te mailen — Heisenberg's afweging, 7 aug 2026.

Wat daarbij hoort te blijven staan voor een volgende keer: omdat de bestanden in het bestaande
product zijn vervángen en niet in een nieuw product zijn gezet, halen bestaande kopers via hun
oorspronkelijke downloadlink of Gumroad-bibliotheek automatisch de actuele versie op. Zij krijgen
de correcties dus hoe dan ook, alleen zonder dat iemand ze erop wijst.

**Bundelinhoud geverifieerd op 11 aug 2026** — Heisenberg heeft bij de bron nageteld dat er vier
PDF's in `emzjvj` zitten. Daarmee is de belofte "alle 4 gidsen" op de site gedekt door het product
zelf, en niet langer alleen door dit document. Wat daarmee níét bewezen is: of de koper van vóór
5 aug via zijn oude downloadlink óók die vierde PDF ziet. Dat hangt af van hoe Gumroad
bestandsvervanging afhandelt en is alleen hard te maken met een eigen testbestelling — geen reden
tot actie, want die ene koper kocht de bundel van drie en is bewust niet gemaild (zie hierboven).

**Versienummers: wanneer wel, wanneer niet**

Ophogen bij een **feitcorrectie of een omvangswijziging** — dan verschilt wat twee kopers in
handen hebben. Niet ophogen bij verduidelijking, opmaak of woordafbreking. Zo blijft een bump een
signaal in plaats van ruis. Stand: juridisch **1.1**, playbook **1.0**, leerplan **1.1**,
hacklab **1.0**.

---

*Laatst bijgewerkt: 11 augustus 2026 — bundelinhoud (4 PDF's in `emzjvj`) bij de bron nageteld;
paginatellingen eerder geteld uit de gebouwde PDF's*
