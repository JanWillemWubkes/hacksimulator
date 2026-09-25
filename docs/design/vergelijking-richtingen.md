# Vergelijking van richtingen: affiche, pixelstad, teletekst

**Status:** uitgevoerd op 25 sep 2026 (sessie 2b). **Uitkomst: het affiche blijft.** De
prototypebranches zijn verwijderd; zie "Uitkomst" onderaan.

## Waarom

De richtingsronde van sessie 1 (seed `88f43840`) koos "Het raster van Total Design". Het
affiche is gebouwd (commit `a8bf4fa` e.v. op `design/impeccable`). De eigenaar wil de twee
uitdagers die hij daarnaast serieus overwoog ook in het echt zien voordat het affiche
"af" gemaakt wordt: een finish review en DESIGN.md zijn verloren werk als er daarna nog
gewisseld wordt.

## Opzet: worktrees, niet wisselen

| branch | worktree | poort | wat |
|---|---|---|---|
| `design/impeccable` | deze repo | 8901 | het affiche — **niet aanraken** |
| `design/pixelstad` | `../hacksimulator-pixelstad` | 8902 | prototype |
| `design/teletekst` | `../hacksimulator-teletekst` | 8903 | prototype |

Beide prototypebranches takken af van de laatste commit van `design/impeccable`. Per
worktree een eigen server: `python3 scripts/nostore-server.py <poort> "$(pwd)"`. Zo staan
de drie naast elkaar in drie tabs.

Netlify deployt alleen `main`, en de repo is openbaar: prototypes horen daarom **nooit** op
`main`, ook niet als losse bestanden.

## Scope per prototype

- **Alleen het eerste scherm** van `index.html`: hero, terminal, signatuurinteractie. De
  rest van de pagina mag blijven zoals hij is of wegvallen.
- **Wegwerp:** geen testaanpassingen, geen documentatie, nooit mergen. Wint er een, dan
  wordt hij daarna echt gebouwd, met contract, tests en review.
- **Wat vervangen wordt:** `styles/affiche.css` (of een eigen stylesheet op die plek) en de
  hero-markup in `index.html`. **Hergebruiken:** `src/ui/hero-antwoorden.js` (de antwoorden
  van de demo, afgeleid van de engine), `hero-repl.js`, `landing-demo.js`. De registratie
  (`hero-registratie.js`) mag per richting anders renderen.
- **Code-led:** er is geen beeldgeneratie, dus geen comps. Het contract per richting draagt
  de ambitie.
- Wat voor elke richting bindend blijft: PRODUCT.md (identiteit, taal, red lines), AAA-contrast
  in beide thema's, vanilla zonder buildstap, geen `!important` in `styles/`, geen emoji.

## Wat er van de twee richtingen bekend is — en wat niet

De beslispagina van sessie 1 is niet bewaard (`.impeccable/questions/` is leeg en niet
getrackt). Wat vastligt, staat in commit `924ea95` en in het direction contract
(`.impeccable/surfaces/index-html.md`, blok FORM):

- **Netwerkstad (eBoy):** de isometrische pixelstad; door de ronde "competitief" genoemd.
  Eén discipline ervan zit al in het affiche: *het onzichtbare netwerk zichtbaar maken*.
- **Teletekst:** alleen de naam is vastgelegd.

**Eerste stap van de volgende sessie is daarom: per richting een kort contract schrijven en
door de eigenaar laten bevestigen** (THESIS, OWN-WORLD, FIRST VIEWPORT, memorabel moment),
vóór er een regel CSS gebouwd wordt. Alles hierboven buiten de twee opsommingstekens is
reconstructie, geen besluit.

## Beslissingscriterium — vooraf vastgelegd

Dezelfde twee assen als de richtingsronde van sessie 1, zodat de vergelijking niet
"welke vind ik vandaag het mooist" wordt:

1. **Herkenning door het publiek:** herkent een Nederlandse beginner (student,
   carrièreswitcher, hobbyist) hierin iets uit zijn eigen wereld, zonder hackerkostuum?
2. **Productduidelijkheid:** weet een eerste bezoeker binnen één scherm wat dit is (een
   terminal die Nederlands terugpraat), waarom het veilig is, en wat hij moet doen?

Plus de "voelt fout"-lijst van de eigenaar uit de surface brief: hackerkostuum, te
schools of kinderlijk, te intimiderend.

Uitkomst: één richting gaat door naar de echte bouw. Blijft het affiche, dan worden de
prototypebranches verwijderd en volgt sessie 3 zoals gepland.

## Uitkomst (25 sep 2026)

De beschrijvingen uit sessie 1 bleken toch grotendeels bewaard, op een screenshot van de
beslispagina: de teletekstkaart volledig, de eBoy-kaart rechts afgesneden. Daarmee zijn per
richting contracten geschreven, bevestigd, en als wegwerpprototype van het eerste scherm
gebouwd (lokale commits, nooit gepusht, daarna verwijderd).

Gemeten op 1440x900 en 375x812: in alle drie nul consolefouten en geen horizontale scroll;
alle tekst haalt 7:1 of meer, de rode CTA's 5,79 (pixelstad) en 5,25 (teletekst) als grote
vetgedrukte letter (lat 4,5).

| | herkenning | productduidelijkheid | voelt fout |
|---|---|---|---|
| affiche | zwak (Crouwel kent vrijwel niemand) | sterk | laag |
| pixelstad | middel | zwak: terminal pas op y=714/900 (mobiel 1034), en een klik in de terminal scrollt de stad uit beeld | hoog op "kinderlijk" |
| teletekst | sterk (888 kent iedereen) | sterk: alles in één scherm, ook op 375px | middel op "hackerkostuum" (zwart + mono) |

Op de twee vooraf vastgelegde assen won teletekst. **De eigenaar koos het affiche**:
teletekst vond hij visueel niet mooi ondanks de herkenbaarheid, de pixelstad (de animatie
wel leuk) te onduidelijk voor het product. Dat is een geldige weging: het criterium was een
hulpmiddel tegen "welke vind ik vandaag het mooist", geen vervanging van het oordeel van de
eigenaar over zijn eigen merk.

## Aanpassingspunten voor het affiche

Van de eigenaar na de vergelijking, uitgevoerd in sessie 2b:

- **De hero mist een blikvanger.** Oorzaak: de kop, het enige grote typografische moment,
  stond onderaan (761-888 op 1440x900, y=947 op 375px). Nu staat hij bovenaan, met de
  rode actie ernaast; `hero-demo.spec.js` bewaakt de nieuwe volgorde.
- **De hero is onoverzichtelijk, vooral de band diagram + poorten + legenda + chips.**
  Oorzaken: diagram en chips hadden dezelfde celvorm; ■/□ betekende in de legenda
  open/dicht en op de chips gedaan/nog niet; de poortenrij hing onder beide machines;
  uitleg stond verspreid. Nu: chips direct onder de terminal als knoppen met index 01-06
  en `[✓]`, het diagram als één zin met de poorten ín het routerblok en één onderschrift.

Open punt uit de inspectieronde van sessie 2, voor de finish-reviewer: het invoerveld van
het Brevo-formulier staat op desktop ~70px rechts van de privacyregels eronder.
