# Vergelijking van richtingen: affiche, pixelstad, teletekst

**Status:** klaargezet op 24 sep 2026 (sessie 2 van het Impeccable-traject). Uitvoeren in de
volgende sessie, **vóór** sessie 3 (finish review + DESIGN.md van het affiche).

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

## Aanpassingspunten voor het affiche

De eigenaar heeft na sessie 2 punten gezien die hij wil aanpassen. Die horen hier genoteerd
te worden, zodat ze niet verdampen, en worden alleen uitgevoerd als het affiche wint:

- _(nog in te vullen door de eigenaar)_

Open punt uit de inspectieronde van sessie 2, voor de finish-reviewer: het invoerveld van
het Brevo-formulier staat op desktop ~70px rechts van de privacyregels eronder.
