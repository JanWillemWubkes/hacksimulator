# Impeccable-bevindingen — fase B

**Gemeten:** 19 september 2026 · Impeccable v4.3.1 · branch `design/impeccable`
**Methode:** `impeccable detect` tegen **gerenderde URL's** op een lokale server, @1280x800 en @390x844.
**Status:** analyse. Nul coderegels gewijzigd.

---

## De meetregel die hieruit volgt

**Draai de detector tegen URL's, nooit tegen bestanden.**

Statisch gescand gaf één blogpost 45 bevindingen, waarvan ~35 low-contrast met
`text #000000 on #0d1117`. Gerenderd gaf dezelfde pagina 27 bevindingen en **nul**
contrast. De oorzaak: de blog laadt `../styles/main.css?v=233` en gebruikt
`var(--color-text)`. Uit een los bestand kan de detector die variabele niet oplossen en
valt hij terug op zwart.

Over de hele blog waren dat **514 low-contrast-bevindingen die geen van alle bestonden**.
Dezelfde invariant die hier geldt staat al in CLAUDE.md: meet gerenderde pixels, niet wat
er in de bron of de DOM staat.

---

## Uitkomst per regel

Elke regel hieronder is geverifieerd tegen de draaiende pagina, niet overgenomen.

### Bevestigd echt — fixen

| regel | n (desktop/mobiel) | bewijs |
|---|---|---|
| `skipped-heading` | 6 / — | `woordenlijst.html`: `h1 "50+ cybersecurity termen uitgelegd"` → `h3 "Basis termen"`, geen h2. Geverifieerd via DOM-uitlezing. Ook contact, gidsen, sample-pentest, sample-juridisch. Raakt schermlezers én SEO. |
| `cramped-padding` | 20 / 12 | `.faq-item` heeft `padding: 0px` met een 1px border én achtergrond `rgba(22,27,34,.3)`; het eerste kind `h3.faq-heading` ook `padding: 0px`. De tekst plakt tegen de rand. Geverifieerd via computed style. |
| `layout-transition` | 19 / 14 | `transition: max-height, padding` op de faq-items. Staat letterlijk in de CSS. Echte layout-thrash; de moderne fix is `grid-template-rows`, geen eenregelige wissel. |
| `clipped-overflow-container` | 1 / 1 | `main` op `terminal.html` klipt een absoluut gepositioneerd kind. **Nog niet geverifieerd** — staat hier als open punt, niet als feit. |

### Bevestigd false positive — niet fixen

| regel | n | waarom het niet klopt |
|---|---|---|
| `low-contrast` | 26 / 18 | Twee artefactklassen, allebei nagemeten. **(a)** `analytic-gradient+alpha`: de detector claimt 1.1:1 op `h2 "Direct aan de slag?"`; uit de screenshotpixels gemeten is het **12.10:1**. Hij rekent de gradientkleur door in plaats van hem over de basisachtergrond te compositen. **(b)** `on filter`: gemeten dóór een nog niet gevuurde scroll-reveal heen — de ouder `.animate-on-scroll` staat dan op `opacity: 0; filter: blur(4px)`. Na de reveal: `opacity: 1, blur(0px)`. Dit is exact de invariant "bevries transities vóór je meet"; de detector doet dat niet. |
| `undersized-ui-text` | 11 / 4 | Claimt 10.4px op `.eyebrow-badge` en `.comparison-cell`. Gerenderd @1280x800 gemeten: **13.5px** en **18.9px**. De 11px-ondergrens wordt nergens geraakt. |

### Smaakoordeel — invoer voor fase D, geen defect

Deze vallen onder de **uitvoeringslaag**, die je expliciet hebt opengezet. Ze zijn dus
geen ruis die weggefilterd moet worden, maar materiaal om over te beslissen.

| regel | n | wat het aankaart |
|---|---|---|
| `overused-font` | 10 | `Inter` + `Space Grotesk`. Voorspeld vóór de eerste scan: Inter staat als voorbeeld in Impeccable's eigen documentatie. Terecht punt zodra typografie open is. |
| `dark-glow` + `radial-spotlight-glow` | 6 + 4 | De neon-lime halo. Kern van de huidige uitvoering van de hacker-identiteit. |
| `side-tab` | 3 | Gekleurde linkerrand op kaarten. **Botst met een eerder bewust besluit**: de blog-CTA's zijn in een eerdere sessie juist geünificeerd op een blauwe linkerrand. Dit is geen bug maar een keuze — die jij mag herzien of handhaven, maar niet stilzwijgend mag verdwijnen. |
| `all-caps-body` | 8 | 32–40 tekens in uppercase (`VOORHEEN`, `MET HACKSIMULATOR`). Grensgeval: dat is labellengte, geen alinea. |
| `line-length` | 14 | Regellengte. Nog niet nagemeten. |
| `gpt-thin-border-wide-shadow` | 6 | Advisory. 1px rand + 40–60px schaduwblur: kies één van beide. |
| `blinking-cursor` | 1 | De terminalcursor. Valt onder de identiteitslaag — dit ís het product. |
| `wide-tracking`, `tight-leading`, `flat-type-hierarchy`, `em-dash-overuse`, `bounce-easing` | 1–3 elk | Klein grut, meenemen in fase D. |

---

## Wat dit zegt over het gereedschap

**De structurele regels kloppen, de meetregels niet.**

- Structureel (koppenhiërarchie, padding, CSS-transities): 3 van 3 geverifieerd correct.
- Metend (contrast, tekstgrootte): 2 van 2 geverifieerde klassen fout, en fors —
  1.1:1 tegenover 12.10:1, 10.4px tegenover 13.5px.

**Gevolg voor de hook.** De per-edit-tier van de hook bevat juist de metende regels
(contrast, overflow, clipping). Aanzetten zou dus vooral de onbetrouwbare helft in je
sessie duwen. Dat is nu een meting en geen mening: **hook blijft uit**, de detector draait
handmatig tegen URL's wanneer er iets te meten valt.

---

## Correctie op de hextellingen (19 sep 2026)

Elk getal over hardgecodeerde kleuren dat eerder in dit traject genoemd is, was fout.
Drie oorzaken, opeenvolgend gevonden:

1. **De regex `#[0-9a-fA-F]{6}` matcht CSS-selectors.** `#feedback-modal` levert de
   "kleur" `#feedba`, want f-e-e-d-b-a zijn geldige hexcijfers. Dat alleen al gaf 33
   spookkleuren in `tests/e2e/`.
2. **Het `[data-theme="light"]`-blok werd meegeteld als "buiten `:root`".** Dat zijn geen
   losse waarden maar de tokens van het lichte thema.
3. **CSS-commentaar en `@media print` telden mee.** Dit project documenteert zijn gemeten
   contrastratio's in commentaar - dat is geen drift maar goede praktijk. En zwarte tekst
   in een printblok is correct, geen fout.

De gecontroleerde telling, met een patroon dat zijn eigen testgevallen haalt
(vijf kleuren gevonden, vier selectors afgewezen) en een parser die op een minivoorbeeld
2 tokens / 2 hardcoded / 1 print moet opleveren:

| categorie | n |
|---|---|
| hexcodes in `styles/` totaal | 292 |
| waarvan in CSS-commentaar | 124 |
| waarvan tokendefinities (`--x: #hex`) | 115 |
| waarvan `@media print` | 2 |
| **werkelijk hardgecodeerd** | **51** over 19 unieke waarden |

Eerder genoemd in dit traject: 211, daarna 111, daarna 118, daarna 58. Allemaal te hoog.
Fase C bleek daardoor een middag in plaats van een project.

---

## Openstaand

- `clipped-overflow-container` op `terminal.html` verifiëren.
- `line-length` (14) nameten.
- De blogpagina's zijn alleen statisch gescand (dus onbruikbaar); één gerenderde pass
  gaf 27 bevindingen op `nmap-beginnersgids.html`. De rest van de blog nog gerenderd meten.

**Na fase C staan er nog vier hardgecodeerde waarden.** Alle vier zijn lichtthema-nuances
waar geen bestaand token exact op past, dus ze vragen een besluit in plaats van een
mechanische vervanging:

| waarde | plek | wat het is |
|---|---|---|
| `#f5f5f5` | `blog.css` `[data-theme=light] .blog-post-content code` | achtergrond van inline code |
| `#fafafa` | `blog.css` `[data-theme=light] .blog-post-content pre` | achtergrond van codeblokken; verschilt nauwelijks van de vorige |
| `#0a0a0a` | `blog.css` `[data-theme=light] .terminal-example` | een terminalvoorbeeld dat óók in het lichte thema donker hoort te blijven |
| `#57606a` | `main.css` `[data-theme=light] .modal-close` | gedempte sluitknop; `--color-text-dim` is in licht `#444444` en dus donkerder |

Voorstel: `#f5f5f5` en `#fafafa` samentrekken tot één `--color-bg-code` (het verschil is
met het blote oog niet te zien), `#0a0a0a` een thema-onafhankelijk
`--color-bg-example-terminal` geven naar analogie van `--color-bg-demo-terminal`, en
`#57606a` laten staan of bewust naar `--color-text-dim` schuiven - dat laatste verhoogt
het contrast maar verandert het uiterlijk.
