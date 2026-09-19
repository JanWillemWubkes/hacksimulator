# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Ontwerp voor **de absolute beginner**: iemand die nog nooit een terminal heeft geopend.
Dat is een instapniveau, geen leeftijd en geen type. Wie meer weet kan altijd sneller
doorklikken; andersom werkt niet. Alles wat begrijpelijk is voor die persoon blijft
bruikbaar voor iedereen die verder is.

Wie er in de praktijk komt (PRD hoofdstuk 3, drie segmenten) beschrijft het publiek, niet
de ondergrens waarop ontworpen wordt:

- **Studenten (16-25)** — IT-studie of carriereorientatie, beperkt budget, zoekt praktijk
  voor cv en certificeringen.
- **Carriereswitchers (25-45)** — werkt in IT-support, sysadmin of development en wil
  weten of security bij ze past voordat ze erin investeren.
- **Hobbyisten (alle leeftijden)** — nieuwsgierig door media of nieuws, wil snappen hoe
  het werkt zonder carriereambitie.

De gedeelde situatie: ze hebben over ethisch hacken gehoord, willen verkennen zonder
verplichting of risico, en hebben uitleg nodig bij wat ze zien.

## Product Purpose

Een browsergebaseerde terminalsimulator waarin je de basis van ethisch hacken leert door
echte commando's te typen in een omgeving waar niets kapot kan.

Het probleem dat het wegneemt: leren hacken vraagt normaal om installatie van complexe
tools of dure cloud labs, en een beginner riskeert daarbij schade aan het eigen systeem
of per ongeluk iets illegaals. Bestaande platforms zijn of te geavanceerd of te gamified.

**Succes is conversie** — nieuwsbriefinschrijvingen, verkochte gidsen, Ko-fi-steun. Dat is
een bewuste keuze en beslecht een tegenspraak die in de projectdocumentatie stond. Het
betekent dat de Persuade-surfaces (`index.html`, `gidsen.html`, de sample-pagina's)
zwaarder wegen in ontwerpbeslissingen dan het terminalvenster zelf.

Die conversie staat wel onder de ethische red lines uit PRD 21.1: geen dark patterns,
geen nepurgentie, geen schuldinductie, geen paywall op de basiscommando's. Omzet mag het
leren nooit in de weg zitten. Een ontwerp dat beter converteert door de bezoeker te
manipuleren is een mislukking, geen verbetering.

## Positioning

**Nederlandstalig, voor wie op Engels afhaakt.**

Dat is geen kenmerk maar het hele product. De landingspagina opent niet voor niets met
"Te veel Engels" als eerste pijnpunt. Een concurrent als TryHackMe of Hack The Box kan
dit niet eerlijk overnemen: hun materiaal, community en tooling zijn Engelstalig tot op
het bot. Hier leer je hacken zonder er eerst een woordenboek bij te houden.

Praktisch gevolg voor elk ontwerp: Nederlands is de taal van de uitleg, niet een vertaling
die eroverheen ligt. Zie ook de taalregels onder Brand Commitments.

## Operating Context

De bezoeker opent een tab en typt. Geen installatie, geen registratie, geen account,
geen VM, geen VPN. Voortgang leeft in `localStorage` van die ene browser.

Rondom de simulator staat een site die uitlegt, overtuigt en verkoopt: een landingspagina,
een blog, een woordenlijst, productpagina's voor de gidsen en twee gratis sample-pdf's als
lead magnet. Nieuwsbrief loopt via Brevo met double opt-in, betaalde gidsen via Gumroad,
donaties via Ko-fi.

Deploy is een push naar `main`; Netlify serveert de repo-root rechtstreeks, zonder
buildstap.

## Capabilities and Constraints

**Functioneel**

- 41 terminalcommando's verdeeld over vijf categorieen: `filesystem` (11), `network` (6),
  `security` (6), `special` (1), `system` (18). Gemeten: 42 JS-bestanden onder
  `src/commands/`, waarvan `security/hash-benchmarks.js` een gedeelde databron is en geen
  commando (het exporteert constanten, geen `export default`).
- Virtueel bestandssysteem, tutorialsysteem, gamification met badges en certificaten,
  commandozoeker.
- 14 blogartikelen, een woordenlijst, 4 betaalde gidsen plus bundel, 2 gratis samples.

**Technisch bindend** — dit zijn red lines, geen voorkeuren:

- Vanilla JS en CSS. Geen framework, geen bundler, **geen buildstap**, geen backend.
- Budget: Terminal Core onder 400 KB, site totaal onder 1000 KB. De actuele meting staat
  in `TASKS.md` en is de enige bron; reken hem niet uit het hoofd na.
- Geen `!important` in `styles/`. Win op specificiteit.
- Geen advertenties. Bewust verwijderd op gemeten kosten en baten.

**Functioneel bindend in het terminalvenster** — niet om esthetische maar om technische
redenen. De simulator gaat er kapot van:

- **ASCII-markers, geen emoji.** Gemeten frequentie in `src/commands/`: `[?]` 149x,
  `[TIP]` 113x, `[✓]` 92x, `[!]` 51x, `[X]` 49x, `[INFO]` 19x, `[+]` 18x.
- **De renderer kleurt regels op het eerste teken.** Een `[X]` aan regelbegin wordt rood
  (error), het vinkje groen; drie of meer spaties erven de kleur door. De kleurwaarden
  mogen veranderen, de afbeelding van marker naar rol niet, en het onderscheid moet
  zichtbaar blijven.
- **Monospace in het outputvenster.** `asciiBox` en de nmap- en nslookup-achtige output
  rekenen op kolomuitlijning. De monospace-letter mag wijzigen, de monospace-eis niet.
- **80/20-output**: echte toolvorm in het Engels, met Nederlandse context erachter en een
  `[TIP]` eronder. Dat is pedagogiek, geen opmaak.

## Brand Commitments

**De identiteit ligt vast, de uitvoering niet.** Dit onderscheid is expliciet door de
eigenaar gemaakt en is het belangrijkste dat in dit bestand staat.

- **Bindend:** dit moet voelen als een hacker- en terminalomgeving. Wie `terminal.html`
  opent weet binnen een seconde waar hij is. Dat is het product.
- **Open:** palet, typografie, ritme, chrome, spacing en motion. De huidige uitvoering
  (neon-lime op GitHub-donker, Inter en Space Grotesk) is een keuze uit 2024, geen
  natuurwet. Als het beter kan, mag het beter. Een voorstel dat de identiteit bewaart maar
  anders uitvoert is welkom, geen overtreding.

**Naam en toon**

- Nederlands in UI, help, tips en waarschuwingen. Commandonamen en tool-output blijven
  Engels. Foutmeldingen: Engels met Nederlandse uitleg.
- **"je", niet "u".** Toegankelijk, niet afstandelijk formeel.
- Bemoedigend: "Goed bezig!", "Bijna!" — niet "Fout." of "Wrong."
- Nuchter en eerlijk. Geen hype, geen opgeklopte marketingtaal. Liever iets weglaten dan
  het groter maken dan het is.
- Koppen in Nederlands zinskapitaal: alleen het eerste woord en eigennamen. Geen Engelse
  Title Case. Merken, acroniemen en camelCase blijven zoals ze zijn.
- Leg het "waarom" uit, niet alleen het "wat". Elk commando is een leermoment.

**Bestaande bewuste afwijkingen** — geen inconsistenties om op te ruimen:

- De blog gebruikt blauw als accent en bewust geen groen; de hoofdsite gebruikt groen voor
  CTA's. Controleer dit voordat je een behandeling van de hoofdsite op de blog hergebruikt.
- De in-content CTA-boxen op de blog zijn geunificeerd op links uitgelijnd met een blauwe
  linkerrand, niet gecentreerd. Dat is een besluit, geen toeval.

## Evidence on Hand

Gemeten op 19 september 2026, niet overgenomen uit documentatie.

- Live: https://hacksimulator.nl/ — bron: https://github.com/JanWillemWubkes/hacksimulator
- 42 JS-bestanden onder `src/commands/`, specificaties in `docs/commands-list.md`.
- 14 blogartikelen in `blog/` (naast index en welkomstpost).
- 4 betaalde gidsen plus 2 sample-pdf's, bron in `docs/products/*.typ`.
- 3 juridische pagina's in `assets/legal/`.
- 43 end-to-end-specs in `tests/e2e/`, waarvan 7 specifiek op contrast.
- Designsysteem beschreven in `docs/style-guide.md` (8203 regels).

**Niet aanwezig, dus niet verzinnen:** er zijn geen klantcitaten, testimonials,
gebruikersaantallen, omzetcijfers of externe benchmarks. Elke claim van die soort moet uit
een meting komen of wegblijven.

## Product Principles

1. **De vloer is de absolute beginner.** Begrijpelijk voor wie nog nooit een terminal
   opende. Wie verder is klikt sneller door.
2. **Nederlands is de uitleg, niet de vertaling.** Het onderscheid van dit product zit in
   de taal; behandel die als inhoud, niet als laklaag.
3. **Elk commando is een leermoment.** Output zonder "waarom" is halve output.
4. **Echt genoeg om te overtuigen, veilig genoeg om te durven.** De simulatie moet
   geloofwaardig voelen zonder dat iemand iets kan breken.
5. **Conversie mag nooit manipuleren.** Beter overtuigen is toegestaan, de bezoeker onder
   druk zetten niet.

## Accessibility & Inclusion

- WCAG AAA-contrast is het doel, niet AA. Er staan 7 specs in `tests/e2e/` die gerenderd
  contrast meten; die zijn de vangrail bij elke paletwijziging.
- Toetsenbordnavigatie en zichtbare focus overal; de terminal is per definitie een
  toetsenbordinterface.
- Tapdoelen minimaal 44 bij 44 pixels.
- Ondersteuning voor schermlezers; koppenhierarchie mag geen niveaus overslaan.
- `prefers-reduced-motion` respecteren.
