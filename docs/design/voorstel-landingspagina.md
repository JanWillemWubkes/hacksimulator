# Ontwerpvoorstel landingspagina

**Datum:** 19 september 2026 · branch `design/impeccable` · surface: `index.html` (mode: Persuade)
**Reikwijdte:** herzien — nieuwe typografie en een nieuwe kleurverdeling, bestaande opbouw.
**Status:** voorstel. Nog geen regel code gewijzigd.

---

## De diagnose in één zin

De pagina *beschrijft* een terminal in schreefloze letters en *toont* er een in een kadertje
ernaast. Ze doet dus twee keer hetzelfde werk, en de beschrijving wint het van het bewijs.

Gemeten: **23 neon-elementen in het eerste scherm.** Het accent dat volgens je eigen systeem
"hier ben jij aan zet" betekent, staat op de merknaam, twee CTA's, een badge, een stuk
headline, een pijltje, een rand, een bolletje, drie keer `OPEN`, twee `[TIP]`-regels en vier
trust-bar-iconen. Daarmee betekent het niets meer.

---

## De richting: het kernbeeld letterlijk nemen

`DESIGN.md` noemt als kernbeeld **"de ondertitelde terminal"**. Tot nu toe was dat een
beschrijving van de output. Het voorstel is om het de vorm van de héle pagina te laten zijn.

Een ondertitelde film beschrijft zichzelf niet. Hij speelt, en de ondertiteling loopt eronder
mee: stiller, altijd aanwezig, nooit in concurrentie met het beeld. Vertaald naar deze pagina:

- **De terminal speelt.** Hij is de hero, niet een illustratie ernaast.
- **De tekst ondertitelt.** Hij staat eronder, in een rustiger register, en herhaalt niet wat
  de terminal al laat zien.
- **Kleur is beeld, niet decoratie.** Binnen de terminal is kleur betekenis (prompt, tip,
  fout). Buiten de terminal is kleur alleen een uitnodiging om te klikken.

---

## 1. Kleur — de waarden blijven, de verdeling verandert

**Eerlijke bevinding: je palet is niet het probleem.** Elke waarde is op een gemeten
contrastratio gekozen en haalt AAA; de comments in `main.css` dragen de cijfers. Die hues
vervangen zou 122 tokens opnieuw laten doormeten zonder ander argument dan nieuwigheid. Dat
doe ik niet.

Wat wel verandert is het *budget*:

| | nu | voorstel |
|---|---|---|
| Neon buiten de terminal | 23 elementen in beeld 1 | **hoogstens 1 per scherm**, altijd de primaire actie |
| Neon binnen de terminal | ongewijzigd | ongewijzigd — dat is inhoud |
| Merknaam-accent, eyebrow, headline-accent, pijltje, trust-iconen | neon | tekstkleur |

**Eén toevoeging, en die lost iets structureels op.** `--color-bg` en `--color-bg-terminal`
zijn allebei `#0d1117`: de pagina en de terminal hebben exact dezelfde kleur. Daarom heeft de
hero-terminal een neon rand nodig om überhaupt als venster te lezen. Zet de pagina een trede
dieper — `--color-bg-alt: #080b0f` bestaat al — en de terminal tilt vanzelf op. Dan kan die
rand weg, en daarmee één van de 23.

---

## 2. Typografie — van drie families naar twee

| rol | nu | voorstel |
|---|---|---|
| Display + UI-chrome | Space Grotesk | **JetBrains Mono** |
| Lopende tekst | Inter | **Atkinson Hyperlegible** |
| Terminal | JetBrains Mono | ongewijzigd |

**Waarom mono als displayletter.** Dit is een terminalproduct. Een landingspagina die zijn
koppen zet in de letter van het product zelf is eerlijk in plaats van decoratief, en het is
precies het soort keuze dat uit het onderwerp komt en niet uit een trend. Bijkomend: Space
Grotesk verdwijnt volledig — **21,8 KB van de 103,5 KB aan fonts**, zonder dat er iets voor
terugkomt.

**Waarom Atkinson Hyperlegible.** Ontworpen door het Braille Institute om verwarbare tekens
uit elkaar te houden: `l` versus `1` versus `I`, `O` versus `0`. Op een site die absolute
beginners leert **commando's te typen**, en die WCAG AAA als doel heeft, is dat een
functioneel argument en geen modegril. Het vervangt bovendien Inter, dat de detector bij naam
noemt als versleten.

**De schaal, met het gat erin gerepareerd.** Nu: 63 → 45 → 22,5px, dus factor 1,4 gevolgd
door factor 2,0. Er is geen middenlaag.

| rol | nu | voorstel | verhouding |
|---|---|---|---|
| Display | 63px | **46px** | — |
| Headline | 45px | **32px** | 1,44 |
| Title | 22,5px | **22px** | 1,45 |
| Body | 18px | 18px | 1,22 |
| Label | 13,5px | 13,5px | 1,33 |

Mono loopt breder dan een schreefloze, dus 46px draagt evenveel gewicht als 63px nu. De
pagina wordt daardoor rustiger zonder aan nadruk te verliezen.

---

## 3. Layout — de terminal leidt

**Nu:** twee kolommen van gelijk gewicht. Links een kop die vertelt wat rechts al te zien is.

```
┌──────────────────────────────────────────────────┐
│ nav                                    [ CTA ]   │
├───────────────────────────┬──────────────────────┤
│ ( eyebrow badge, Engels ) │  ┌────────────────┐  │
│                           │  │ terminal-demo  │  │
│ GROTE KOP met een         │  │ met neon rand  │  │
│ GEKLEURD ONDERSTREEPT     │  │                │  │
│ stuk erin                 │  │                │  │
│                           │  └────────────────┘  │
│ subkop                    │                      │
│ [ CTA ]   microcopy       │                      │
└───────────────────────────┴──────────────────────┘
```

**Voorstel:** de terminal krijgt de volle contentbreedte en staat bovenaan. De kop verhuist
eronder en wordt daarmee letterlijk de ondertiteling.

```
┌──────────────────────────────────────────────────┐
│ nav                                    start →   │
├──────────────────────────────────────────────────┤
│                                                  │
│    hacker@hacksim:~$ nmap 192.168.1.1            │
│    22/tcp   open   ssh      OpenSSH 8.2p1        │
│       ← Secure Shell: versleutelde toegang       │
│         op afstand                               │
│    [TIP] Open poorten zijn mogelijke ingangen    │
│    hacker@hacksim:~$ _                           │
│                                                  │
│    ls    cat notes.txt    nmap    whoami         │
│                                                  │
│    Leer ethisch hacken in je eigen browser.      │
│    Elke regel output krijgt uitleg in het        │
│    Nederlands.                                   │
│                                                  │
│    [ Start de simulator ]   geen account nodig   │
└──────────────────────────────────────────────────┘
```

Wat verdwijnt: de Engelse eyebrow-badge, het gekleurde onderstreepte stuk in de kop, de neon
rand om de terminal, en de tweede CTA in het eerste scherm. Wat blijft: de werkende demo met
klikbare commando's — dat is het beste dat de pagina heeft.

Linkslijnend, één kolom, maximaal 1400px zoals nu. Onder 768px stapelt alles; de terminal
houdt zijn eigen horizontale scroll zodat de boxen nooit breken.

---

## 4. Principes

1. **Eén actie per scherm.** De pagina heeft er nu 13; elk scherm krijgt er één, de rest wordt
   ondergeschikt van vorm.
2. **Kleur buiten de terminal betekent: hier kun je klikken.** Nergens anders voor gebruiken.
3. **De terminal legt zichzelf uit.** De pagina herhaalt niet wat de demo al toont.
4. **Mono is de stem, niet het accent.** Geen monospace als sfeerlaagje op losse labels.
5. **Niets beweegt zonder aanleiding.** De bestaande scroll-reveals blijven, er komt niets bij.

---

## 5. Zelfkritiek: wat hieraan generiek is

*Deze sectie hoort bij het proces: het plan toetsen aan de brief vóór er code komt.*

- **Mijn eerste ingeving was een nieuw palet.** Verworpen. Je waarden zijn gemeten en halen
  AAA; ze vervangen zou werk zijn zonder argument. De echte fout zat in de verdeling, en dat
  toegeven is nuttiger dan een nieuwe kleurenwaaier tonen.
- **"Terminal over de volle breedte als hero" is op zichzelf een patroon.** Hier verdedigbaar
  omdat het product letterlijk een terminal is — maar dan moet ik ook de generieke
  vervolgstap laten: **geen typanimatie.** Die zou het van bewijs terugbrengen tot effect.
- **Atkinson Hyperlegible kan lezen als een truc.** Het argument is functioneel: verwarbare
  tekens uit elkaar houden op een site waar je tekens moet overtypen. Houdt dat argument geen
  stand in de praktijk, dan is Source Sans 3 de nuchtere terugvaloptie.
- **Mono als displayletter kan afglijden naar "hackerthema".** Daarom expliciet niet: geen
  scanlines, geen glow, geen groen-op-zwart-nostalgie, geen matrixregen. De letter doet het
  werk, niet het effect.

---

## Wat dit niet doet

- De opbouw en de argumentvolgorde blijven staan. Die werken.
- De copy blijft grotendeels staan; alleen de eyebrow verdwijnt en de kop wordt korter.
- De terminal zelf verandert niet. Geen enkele regel in `terminal.html`.
- Het palet krijgt geen nieuwe hues.

## Meetlat vóór het live mag

- De 7 contrast-specs groen, in beide thema's.
- `responsive-ascii-boxes.spec.js` groen — de demo gebruikt dezelfde box-tekens.
- Fontbudget gelijk of lager dan de huidige 103,5 KB.
- Neon-elementen in het eerste scherm: van 23 naar hoogstens 3, geteld met hetzelfde script.
