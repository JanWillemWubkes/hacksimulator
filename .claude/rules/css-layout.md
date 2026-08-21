---
paths:
  - "styles/**/*.css"
  - "**/*.html"
---

# CSS- en layoutpatronen

Gemeten patronen uit ~50 sessies. De §-nummers zijn die van de oude
`architecture-patterns.md` en bewust ongewijzigd, zodat kruisverwijzingen blijven kloppen.
Verwante bestanden: `js-runtime.md` (§2, 7, 12, 16), `meten-en-guards.md` (§6, 17, 18, 19),
`caching-deploy.md` (§3).

## 0. Snelle regels

- **Dark Frame:** navbar/footer altijd donker (Sessie 44) → `styles/main.css`
- **3-Layer Modals:** Legal (z-10) > Feedback (z-20) > Tutorial (z-30) — Sessie 33
- **Responsive Blog Tables:** brede `<table>` in blogcontent → opt-in class `.blog-table--stacked` (Sessie 181), NIET horizontale `overflow-x:auto`-scroll. Op `@media≤768px` wordt elke rij een gelabelde kaart via `data-label` op elke `<td>` + `::before`; voeg ook `role="table"` op de tabel + `scope="col"` op elke `<th>` toe (a11y: `<thead>` clip-verborgen, niet `display:none`). → `styles/blog.css`
- **Geen `!important` in `styles/`.** Win op specificiteit; check eerst of de tegenregel dood is en verwijderd kan worden (§14).
- **Een geïnjecteerde `<style>` bewijst niets over de cascade** — die komt altijd als laatste, dus hij wint ook als de echte regel zou verliezen (§13). Verifieer tegen een no-store server. Deze regel staat hier omdat hij in §13 onvindbaar was voor wie niet over box-randen las (Sessie 230).

---

## 1. CSS Variables First (Sessie 90 - Design System)

Always use CSS variables for colors, spacing, typography.

**DO:**
```css
.terminal-output-error {
  color: var(--color-error);  /* Theme-aware */
  font-size: var(--font-size-base);
}
```

**DON'T:**
```css
.terminal-output-error {
  color: #ff0000;  /* Hardcoded, breaks dark mode */
  font-size: 16px;
}
```

**Why:** Theme switching, design system consistency, single source of truth
**Files:** `styles/main.css` + `styles/landing.css` (200+ tokens — floor, geen exacte telling;
die groeit per sessie), Style Guide v1.5

---

## 4. Media queries voegen géén specificiteit toe (Sessie 213)

Een `@media`-blok telt voor nul in de specificiteitsberekening. Bij twee gelijke selectoren
wint dus puur de **laadvolgorde** — en `pages.css` laadt ná `landing.css`.

```css
/* landing.css */  @media (max-width: 768px) { .feature-cards { grid-template-columns: 1fr; } }
/* pages.css   */  .features-4col { grid-template-columns: repeat(4, 1fr); }   /* wint óók op 375px */
```

Dat is precies hoe `over-ons.html` tot Sessie 213 vier kolommen van ~185px hield op tablet.
Zelfde val bij een nieuwe grid-modifier: zonder query gaf die 6px horizontale overflow en
kaarten van 173px op 375px.

**Regel:** scope zulke overrides in **wederzijds uitsluitende ranges** (`≤768` naast `≥769`).
Twee regels die nooit tegelijk gelden hoeven elkaar niet te verslaan — geen cascade-gevecht,
geen `!important`. Voor de site-brede navbar-band, zie `PLANNING.md §Layout Principes`.

---

## 5. `flex: 1` hoort niet op een type-selector (Sessie 213)

`.gids-card p { flex: 1 }` leest als "de beschrijving mag groeien", maar een type-selector
kent geen intentie: hij matchte óók `p.gids-sample-link`. Twee flex-items met `flex-basis: 0`
verdelen de vrije ruimte **gelijk**, dus de beschrijving kreeg 82px en het linkje 66px — samen
exact de 164px die één `<p>` alleen zou krijgen. Gevolgen die als losse raadsels oogden:

- `margin-top: auto` op de knop werd een **no-op** — `flex-grow` verdeelt de vrije ruimte
  vóórdat auto-marges iets kunnen absorberen;
- de eigen marge van het linkje landde nooit: `.gids-card p` is (0,1,1) en verslaat (0,1,0).

**Patroon voor kaarten met uitgelijnde CTA's:** geef de kaart precies **één** groeier — een
wrapper om de variabele inhoud (`.gids-card-body { flex: 1 }`). Alles daaronder staat dan op
vaste afstand van de kaartbodem, en omdat grid-rijen even hoog zijn lijnen de knoppen uit
**by construction** — ook als de ene kaart een extra element draagt en de andere niet.
Bewaakt door de invariant `kaartbodem − CTA-bodem` in `tests/e2e/gidsen-layout.spec.js`.

> Zulke bugs vind je niet door de CSS te lezen. Alleen `getComputedStyle` verraadt een
> `flex-grow` die je nooit op dat element hebt gezet.

---

## 8. `flex-end` en `overflow-y: auto` gaan niet samen (Sessie 214)

Een terminal-achtig venster dat nieuwe regels onderaan toevoegt, wil `justify-content:
flex-end`. Zodra je datzelfde element scrollbaar maakt, **clippen Chrome en Firefox de
bovenkant van de inhoud onbereikbaar weg**: je kunt niet terugscrollen naar wat eruit liep.

```css
/* idle: vaste hoogte, geen scroll, nieuwe regels duwen oude omhoog */
.terminal-body { height: 235px; overflow: hidden; display: flex;
                 flex-direction: column; justify-content: flex-end; }

/* live: scrollbaar — display:block, en pin in JS */
.terminal-body.is-live { display: block; overflow-y: auto; overscroll-behavior: contain; }
```
```js
bodyEl.scrollTop = bodyEl.scrollHeight;   // ná elke append
```

Let ook op een `::before`-fade-mask: die is `position: absolute` binnen het element en
scrollt dus mét de inhoud mee in plaats van bovenaan te blijven plakken — zet hem uit in
live-modus. Bewaakt door "eerdere uitvoer blijft terugscrollbaar" in
`tests/e2e/hero-demo.spec.js`; die test gaat rood zodra je `display: flex` terugzet.

---

## 9. Themavarianten en focusregels vechten op bronvolgorde (Sessie 215)

`.hero-terminal:focus-within` en `[data-theme="light"] .hero-terminal` zijn allebei
**(0,2,0)** — één klasse + één pseudo-klasse tegenover één attribuut + één klasse. Bij
gelijke specificiteit beslist de laadvolgorde, dus een focusregel die *vóór* het
light-theme-blok staat en dezelfde property zet (hier `box-shadow`) wordt daar
stilzwijgend overruled. Symptoom: de focustoestand werkt in dark en is dood in light.

**Regel:** zet focus-/state-varianten **ná** de themablokken, of geef ze hun eigen
`[data-theme]`-variant. En test focusstijlen **in beide thema's** — de mutant hiervoor
gaf letterlijk *light rood, dark groen*; één thema testen had de bug doorgelaten.

Twee dingen die daarbij horen:

- **Keyboard-only focus bestaat niet op een tekstveld.** Gemeten:
  `input.matches(':focus-visible')` is `true` ná een muisklik — de spec schrijft voor dat
  tekstvelden altijd focus tonen. `:focus-within` en `:has(:focus-visible)` zijn daar dus
  equivalent. Je kunt de ring niet muis-vrij maken; je kunt hem alleen *bedoeld* laten
  ogen.
- **Houd een transparante outline.** `forced-colors`/High Contrast negeert `box-shadow`
  maar kleurt `outline: 2px solid transparent` wél in. Zonder die regel heeft een
  glow-gebaseerde focusindicator daar géén zichtbaar equivalent.

Bewaakt door "het venster gaat groen aan bij focus (dark|light)" in
`tests/e2e/hero-demo.spec.js`.

---

## 10. Kleur volgt de achtergrond, niet het merk (Sessie 215, aangescherpt Sessie 217)

`--color-cta-primary` is het merkgroen en werkt overal waar het op de zwarte terminal
staat (~17:1). Op de **lichte paginaachtergrond** meet datzelfde token **3,10:1** — onder
WCAG AA (4.5:1), laat staan de AAA die dit project voert.

**Regel:** vóór je een merkkleur op tekst zet, kijk op wélke achtergrond die tekst landt.
Binnen een Dark-Frame-element (terminal, navbar, footer) is merkgroen prima; daarbuiten
hoort de tekst `var(--color-text)` te zijn en mag hooguit een decoratief glyph
(`aria-hidden`) de merkkleur dragen.

### "Welke achtergrond" is de EFFECTIEVE achtergrond, niet de pagina (Sessie 217)

`.eyebrow-badge` stond hier als "voldoet nog niet, 3,10:1". Die waarde was fout, en op de
gevaarlijke manier: **te gunstig**. De badge heeft een eigen `background: var(--eyebrow-bg)`,
en dat is een rgba. De tekst ligt dus op de compositie van badge-achtergrond over
paginakleur, niet op de paginakleur zelf:

```
light   #16a34a op rgb(230,241,234)    2,85:1   ← de echte waarde: onder AA
light   op de hero (radial glow erbij) 2,74:1   ← een derde alpha-laag
dark    #9fef00 op rgb(20,28,22)      12,26:1   ← ruim boven AAA
```

De 3,10:1 reproduceert exact tegen `--color-bg`. Dat is precies de valstrik:
`getComputedStyle(el).backgroundColor` geeft `rgba(22,163,74,0.08)` terug — geen kleur waar
je tegen kúnt meten — en wie dan naar de paginakleur grijpt, meet de laag ónder de verf.

**Meet zo:** loop de ancestor-keten omhoog en composite elke `backgroundColor` tot de eerste
laag met `alpha === 1`. Uitgeschreven in `tests/e2e/eyebrow-contrast.spec.js` (`effBg()`).

Twee dingen die hierbij horen:

- **Test beide thema's.** De mutant voor deze fix (kleur terug naar `--color-cta-primary`)
  is **licht rood, donker groen** — 10 pagina's rood in light, allemaal met exact 2,85:1,
  terwijl dark op 12,26:1 blijft staan. Eén thema testen had de bug doorgelaten. Zelfde les
  als §9.
- **Controleer de font-size die je noteert.** De oude notitie zei 14,4px; gemeten is het
  13,5px op desktop en 10,4px onder 768px (`--font-size-base` zakt daar naar 16px én de
  badge zelf naar `0.65rem`). Beide zijn normale tekst, dus de lat is 4,5 / 7 — er was geen
  large-text-uitzondering om op te leunen.

Opgelost met een `--eyebrow-text`-token naast de bestaande `--eyebrow-bg`/`--eyebrow-border`:
merkgroen in dark, `--color-text` in light (17,12:1).

---

## 11. `transition: all` + geërfde `visibility` = een knop die achterloopt (Sessie 216)

`visibility` erft. Zet je hem op een container om die te verbergen, dan krijgt elk kind de
nieuwe waarde — en een kind met `transition: all` **animeert die overerving**. Gemeten op
`.mobile-cta-bar`, waarvan de knop `.btn-cta` is (die draagt `transition: all` in zijn
basisregel):

```
na omklappen, 0ms:    balk hidden   knop visible   → onzichtbaar tikdoel dat wél reageert
na omklappen, 0ms:    balk visible  knop hidden    → zichtbare balk waar een tik niets doet
na 400ms:             gelijk
```

Beide gaten bestaan **alleen in het venster ná een toestandswissel**. Geen enkele meting
"in rust" ziet ze; je vindt ze door direct na het scrollen te meten in plaats van na een
ruime wachttijd.

```css
.balk[data-state="verborgen"] { visibility: hidden; opacity: 0; }
.balk .btn-cta { transition-property: opacity; }   /* nooit `all` onder een visibility-toggle */
```

Bewaakt door "de knop klapt mee met zijn balk, zonder na te lopen" in
`tests/e2e/homepage-conversion.spec.js`.

---

## 13. Box-drawing randen leven op de verticale as (Sessie 222)

Een ASCII-box is geen tekening maar een **stapel losse block-elementen**. De horizontale
randen (`─`/`━`) zijn onbreekbaar — die zitten binnen één regel. De verticale randen
(`│`/`┃`) bestaan uit één glyph per regel, en zo'n glyph tekent **alleen binnen zijn eigen
linebox**. Élke ruimte tussen twee opeenvolgende box-regels wordt daarom een zichtbaar gat.

Drie bronnen van die ruimte, alle drie gemeten in Sessie 222:

```
margin-bottom op .terminal-line   → 4px gat per regel   (12 stubs van 27px)
vertical-align op een inline-span → +3,59px op die regel (gat wordt 8px)
line-height > glyph-ink-hoogte    → gat = verschil       (25,6 vs 25,78 → 1px naden)
```

`vertical-align` is de verraderlijkste: hij telt mee in de **linebox-berekening**. Wil je
een glyph optisch optillen zonder de layout te raken, gebruik `position: relative`:

```css
/* FOUT binnen een box: rekt de linebox op, rand krijgt een gat */
.marker-arrow { vertical-align: .2em; }

/* GOED: zelfde optische nudge, nul layout-impact */
.marker-arrow { vertical-align: baseline; position: relative; top: -.2em; }
```

**De invariant:** `pitch tussen twee aangrenzende box-regels ≤ ink-hoogte van de randglyph`.
De ink-hoogte is ~1,61 × font-size voor JetBrains Mono (18px → 29px, 16px → ~25,78px), dus
een `line-height` van 1,5 heeft ruimte; 1,6 op 16px níét. Houd de regelafstand bovendien op
een **heel getal**: fractionele rij-origins laten de rasterisatie naden van 1px vallen, ook
als het wiskundig past.

Bewaakt door `measureBoxVerticalGaps()` in `tests/e2e/responsive-ascii-boxes.spec.js` — één
predicaat dat alle drie de bronnen dekt. Meet **gerenderde pixels** als je twijfelt:
`getComputedStyle` laat naden van 1px niet zien, een screenshot-kolomanalyse wel.

> Let op de cascade: `.terminal-output{line-height:1.6}` staat in `mobile.css`, dat ná
> `terminal.css` laadt. Box-regels winnen daarom op specificiteit (twee klassen, 0,2,0) en
> niet met `!important`. Een live-experiment via een geïnjecteerde `<style>` bewijst dit
> níét — die komt altijd als laatste.

---

## 14. Positionele selectors verouderen stil in een rij die aangroeit (Sessie 223)

`:last-child`, `:nth-child(3)` en `:first-of-type` binden aan een **positie**, niet aan een
bedoeling. Zodra iemand een element aan die rij toevoegt, wisselt de regel van doel — zonder
foutmelding, zonder testfaler, zonder dat de auteur van de nieuwe regel het merkt.

```css
/* Geschreven toen .category-badge de laatste span was. */
.blog-post-meta span:last-child { color: var(--color-link); font-weight: medium; }  /* (0,2,1) */

/* Sessie 208 plakte hier een span achter → de regel greep die, en versloeg: */
.blog-ai-notice { color: var(--color-text-dim); }                                   /* (0,1,0) */
```

Gevolg, gemeten: de AI-melding rendeerde in **linkblauw met medium gewicht** op **4,89:1** in
light mode, terwijl het commentaar erboven "bewust gedempt" beloofde. Niet-link-tekst in
linkkleur, op een element dat wettelijk zichtbaar móét zijn.

**Repareer door te verwijderen, niet door te overschrijven.** Controleer eerst of de regel nog
iets dóét voor zijn oorspronkelijke doel — hier zette `.category-badge` (blog.css:920) zijn
`color` en `font-weight` allang zelf, dus de positionele regel was voor de badge al dood. Een
tegenregel toevoegen (`.blog-post-meta span.blog-ai-notice`) had de specificiteitsstrijd
gewonnen en het dode gewicht laten staan: CSS toevoegen om CSS te bevechten die niets meer doet,
verdubbelt het probleem.

**Regel:** in een container waar elementen bijkomen (meta-rijen, kaartvoeten, breadcrumb-lijsten)
bind je op de **klasse** van wat je bedoelt. Positionele selectors zijn alleen veilig in een rij
met een vaste, afgedwongen samenstelling.

> Je vindt dit niet door de CSS te lezen — beide regels zien er los prima uit. Alleen
> `getComputedStyle` op het gerenderde element verraadt dat er een kleur wint die je nergens op
> dat element hebt gezet. Zelfde meetles als §5.

---

## 15. De CSS klopt, de gerenderde box niet (Sessie 226)

Twee bugs uit dezelfde sessie die je met lezen nóóit vindt, want in de bron staat niets fout.

### `min-height` doet niets op een inline element

```css
/* Leest als een tapdoel van 44px. Is 26,8px. */
.category-btn { min-height: 44px; padding: 5px 8px; }   /* <a> = inline */
```

Inline boxes negeren hoogte-constraints. De zeven blogfilters waren daardoor 26,8px hoog terwijl
er geen enkele foute waarde in de regel stond — WCAG AAA 2.5.5 eist 44×44. De fix is niet meer
padding maar een `display` die hoogte kán dragen:

```css
.category-btn { display: inline-flex; align-items: center;
                min-height: 44px; min-width: 44px; }
```

**Meet tapdoelen dus altijd op `getBoundingClientRect()`**, niet op de gedeclareerde waarde.
Hetzelfde geldt voor `<summary>`, `<a>` in meta-rijen en elk ander inline-element dat als knop
oogt.

### Specificiteit vergelijkt per tier — hij telt niet op

```
[data-theme="light"] .blog-post-content ol a   → (0,2,2)   wint
.blog-toc ol li a                              → (0,1,3)   verliest
```

Twee klassen verslaan één klasse, ongeacht hoeveel type-selectors erachter komen. Een extra
`ol` of `li` aan je selector plakken helpt dus **niet** tegen een `[data-theme]`-variant — het
verhoogt alleen de tier die al gelijk was. Win met een klasse erbij:

```css
.blog-toc-nav .blog-toc ol li a { … }   /* (0,2,3) — wint van (0,2,2) */
```

Diagnose zonder gokken: loop `document.styleSheets` langs, filter op regels die het element
`matches()` én de property zetten, en print selector + herkomst. Dat wees hier in één keer de
winnende regel aan, inclusief bestand.

> Vuistregel bij beide: als de gerenderde waarde niet matcht met wat je schreef, is de vraag
> niet "welke waarde moet ik veranderen" maar "welk mechanisme kijkt hier overheen" — display,
> cascade, of een transitie die nog loopt (zie §9/§10).

---

## 20. Het font kan iets anders schrijven dan er in de DOM staat (Sessie 229)

`--font-terminal` resolvet naar JetBrains Mono, en die ligeert via de OpenType-feature `calt`
(367 lookups, gemeten met fontTools). **`calt` staat in browsers standaard aan.** In een terminal
die letterlijke tekst moet tonen is dat altijd fout:

```
>=   ->  ≥        _|_  ->  ⊥        ->  ->  →        !=  ->  ≠
```

Die laatste is geen cosmetiek: `$pdo->prepare(` rendeerde als `$pdo→prepare(` in het PHP-
voorbeeld onder het kopje "Veilige code:" — wie overtypte wat hij zag kreeg een parse-error.

```css
/* Populatie omgedraaid, GEEN lijst mono-selectors. */
*, *::before, *::after { font-variant-ligatures: none; }
```

**Waarom sitebreed en niet gescopet.** `--font-terminal` staat in **48 declaraties over 7
stylesheets**; een selectorlijst bewaakt zichzelf, niet de klasse. Omgedraaid valt de drift in de
goedkope richting: een prose-element dat de regel mist verliest een fi-ligatuur, een mono-context
die hem mist toont weer `$pdo→prepare`. De kosten zijn gemeten en niet beredeneerd — de
prose-fonts dragen wél features (Space Grotesk `liga` 22 lookups, Inter `calt` 43), maar de
breedtedelta `normal` vs `none` op 40px tekst is **0,17px** resp. **0,00px**. Sub-pixel.

`font-variant-ligatures: none` dekt `calt` volgens spec en werkt **unprefixed** in Chromium,
Firefox én WebKit (gemeten, 62/62). Zet er geen `font-feature-settings: "calt" 0` naast: twee
mechanismen voor hetzelfde is er één te veel.

> Let op bij het schrijven van een guard hierop: breedte en `textContent` detecteren dit
> **niet** — zie `meten-en-guards.md` §21.

---

## 21. Een UA-declaratie op het element zelf verslaat overerving (Sessie 229)

`font-family` erft, maar `<pre>`, `<code>`, `<kbd>`, `<samp>`, `<textarea>` en `<input>` krijgen
in de UA-stylesheet een **eigen** `font-family` (`monospace`, resp. de systeem-UI-font). Een
declaratie die het element zelf matcht wint altijd van een geërfde waarde, ongeacht
specificiteit — overerving komt pas aan bod als er níéts matcht.

```js
// In #terminal-output (font-family: var(--font-terminal)) een <pre> hangen:
getComputedStyle(pre).fontFamily   // "monospace"  ← NIET de terminal-stack
```

Dat kostte in Sessie 229 een meetinstrument dat het verkeerde font mat. Gebruik een `<div>` als
je de context-font wilt erven, of zet expliciet `font-family: inherit`. Zelfde mechanisme als
`min-height` op een inline `<a>` (§15): de regel die je schreef is niet fout, er kijkt iets
overheen dat je niet zelf hebt gezet.

---

## 22. In een grid met één auto-track bepaalt het breedste item de breedte van álle items (Sessie 230)

`.blog-posts-grid { display: grid; gap: … }` zonder `grid-template-columns` krijgt **één
impliciete `auto`-track**. Die track wordt zo breed als de **min-content-bijdrage van het
breedste item** — en alle andere items erven die breedte, ook als ze zelf smal kunnen.

Eén vaste breedte diep in één kind lekt daarmee uit naar de hele lijst:

```
.newsletter-signup .sib-form .entry__field input { width: 280px; }   /* 1 item */
        ↓ min-content van dat item wordt 400px
        ↓ track wordt 400px
15 blogkaarten renderen 400px in een container van 336px            /* 15 items */
```

`main.blog-container { overflow-x: hidden }` knipte die 64px onzichtbaar weg, dus het defect
was maanden aanwezig zonder melding. **Een overflow-guard op `document.scrollWidth` staat hier
per definitie groen** — het document groeit niet mee. Toets elementrects tegen de containerrand.

**Vind de schuldige door min-content per item te meten**, niet door de CSS te lezen — de
gerenderde breedte van élk item is identiek, dus die verraadt niets:

```js
const meetMin = (el) => {                       // kloon, vrij laten meten, opruimen
  const k = el.cloneNode(true);
  k.style.cssText += ';position:absolute;visibility:hidden;width:min-content;left:-9999px;';
  document.body.appendChild(k);
  const w = k.getBoundingClientRect().width;
  k.remove();
  return w;
};
[...grid.children].map(meetMin);   // 15 kaarten < 360px, nieuwsbrief 400px → dader gevonden
```

**Repareer bij de bron, niet met een `max-width` op de zusters.** Hier hoorde de vaste 280px in
`@media (min-width: 769px)` — elkaar uitsluitende ranges (§4) in plaats van een cascade-gevecht,
want de mobiele tegenregel was (0,2,1) tegen (0,3,1) en verloor stilzwijgend. Ná de fix zakte de
min-content naar 232px en de track naar 336px = exact de container.

> Percentage-breedtes (`width: 100%`) tellen **niet** mee voor de min-content-bijdrage; vaste
> px-breedtes wél. Dat is precies waarom de mobiele regel het probleem zou hebben opgelost als
> hij had gewonnen.
