# Architectural Patterns

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
**Files:** `styles/main.css` (182 variables), Style Guide v1.5

---

## 2. Modal Protection Pattern (Sessie 77 - Focus Management)

Prevent input capture when modal is active.

**DO:**
```javascript
// src/ui/input.js
document.addEventListener('keydown', (e) => {
  if (document.querySelector('.modal.active')) return;
  handleTerminalInput(e);
});
```

**DON'T:**
```javascript
document.addEventListener('keydown', handleTerminalInput);
```

**Why:** Prevents keyboard shortcuts firing while modal open (legal disclaimer, feedback form)
**Files:** `src/ui/input.js`, `src/ui/legal.js`, `src/ui/feedback.js`
**Test:** Open legal modal → type command → should NOT appear in terminal

---

## 3. Quick Reference (Other Patterns)

- **Dark Frame:** navbar/footer always dark (Sessie 44) → `styles/main.css`
- **No Duplicate Listeners:** Event delegation over per-element handlers (Sessie 52) → `src/ui/input.js`
- **3-Layer Modals:** Legal (z-10) > Feedback (z-20) > Tutorial (z-30) - Sessie 33
- **Cache Strategy:** 1-hour cache + `?v=X` override (Sessie 78) → `_headers` file.
  ⚠️ **Alleen entry-points dragen een `?v=`** (`main.js`, `main.css`); de ~99 modules die
  `main.js` relatief importeert (`renderer.js`, `box-utils.js`, …) niet. Een `?v=`-bump bust
  die dus **niet** — ze komen tot `max-age` uit browsercache, en `must-revalidate` grijpt pas
  ná afloop daarvan. Gevolg bij een te lange max-age: verse entry naast oude submodules =
  cross-module-mismatch (Sessie 205: `renderer.formatText is not a function`, en de Sessie
  204-fixes in `box-utils.js` bereikten terugkerende bezoekers 7 dagen niet). Daarom staat
  `/src/**/*.js` op `max-age=3600`. **Verifieer een submodule-fix daarom altijd tegen een
  no-store server of via `import('…?cb='+Date.now())`, nooit tegen een warme browser.**
- **Responsive Blog Tables:** brede `<table>` in blogcontent → opt-in class `.blog-table--stacked` (Sessie 181), NIET horizontale `overflow-x:auto`-scroll. Op `@media≤768px` wordt elke rij een gelabelde kaart via `data-label` op elke `<td>` + `::before`; voeg ook `role="table"` op de tabel + `scope="col"` op elke `<th>` toe (a11y: `<thead>` clip-verborgen, niet `display:none`). → `styles/blog.css`

→ **All 40+ patterns indexed:** docs/sessions/current.md

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

## 6. Third-party verwijderen: twee servers, niet één meting (Sessie 208)

Bij het weghalen van een externe afhankelijkheid bewijst een nulmeting achteraf niets — "0 verzoeken"
is óók de uitkomst van een kapotte meting. Zet de oude code ernaast:

```bash
git archive HEAD | tar -x -C /tmp/pre-change
python3 scripts/nostore-server.py 8898 /tmp/pre-change &   # oud
python3 scripts/nostore-server.py 8899 $(pwd) &            # nieuw
```

Draai daarna dezelfde meting tegen beide poorten. Bij de AdSense-verwijdering gaf dat
**2 advertentieverzoeken + 3 ad-units vóór, 0 + 0 ná** — pas dáármee is de nulmeting bewijs.

**Consent-state migreren = meestal niet nodig.** Laat het opgeslagen JSON-formaat intact en stop
alleen met het schrijven van de verdwenen sleutel. `hasConsent('analytics')` blijft dan werken voor
iedereen die al toestemming gaf: geen banner-herhaling, geen verloren keuzes. Verifieer wel álle
toestandsvarianten live (vers / oude vorm / legacy-string / geweigerd) — "geen migratie nodig" is
een aanname tot je het gemeten hebt.

---

## 7. Gebruikersinvoer nooit rechtstreeks als object-sleutel (Sessie 214)

`RESPONSES[naam]` leest als "kennen we dit command?", maar een object-literal erft
`Object.prototype`. `constructor`, `toString`, `__proto__` en `hasOwnProperty` zijn
allemaal **truthy** — en leveren geen response-object op:

```js
// FOUT: 'constructor' typen levert de Object-constructor, daarna undefined.slice()
if (RESPONSES[naam]) return kies(RESPONSES[naam]);

// GOED
if (Object.hasOwn(RESPONSES, naam)) return kies(RESPONSES[naam]);
```

In de hero-REPL blokkeerde dat de hele demo op één getypt woord. Geldt overal waar een
lookup-map met bezoekersinvoer wordt geïndexeerd — de command-registry, filesystem-paden,
scenario-id's. Alternatief: `Object.create(null)` of een `Map`.

Tweede laag die er bij hoort: meld het **origineel** terug, niet de genormaliseerde vorm.
`naam.toLowerCase()` maakte van `toString` de foutmelding `Command not found: tostring` —
technisch waar, voor de bezoeker verwarrend.

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

## 12. IntersectionObserver als trigger, één predicaat als regel (Sessie 216)

Bij "toon/verberg X afhankelijk van of Y in beeld staat" is de verleiding om op
`entry.isIntersecting` of `entry.intersectionRatio` te beslissen. Twee problemen:

- **`isIntersecting` is geen thresholdtest.** Hij is `true` zodra het doel de root ráákt,
  ongeacht `threshold`. Bij het passeren van 0.5 vuurt de callback en levert dan gewoon
  `isIntersecting: true` met ratio 0.4.
- **`rootMargin` veroudert.** Hij staat vast bij constructie; na een viewportwijziging
  (toestelrotatie) klopt hij niet meer, en de observer alleen herbouwen bij `resize`
  betekent dat je tussen die momenten op stale marges beslist.

Gebruik de observer daarom als "er is iets veranderd"-signaal en laat de beslissing door
één geometrische functie doen, die je óók synchroon bij init en op `resize` aanroept:

```js
const middenVrij = (el) => {
  const r = el.getBoundingClientRect();
  const mid = r.top + r.height / 2;
  return r.height > 0 && mid >= navHoogte && mid <= balkRand();
};
const herbeoordeel = () => { balk.dataset.state = doelen.some(middenVrij) ? 'verborgen' : 'zichtbaar'; };

new IntersectionObserver(herbeoordeel, { rootMargin: `-${nav}px 0px -${balk}px 0px`, threshold: 0.5 })
  .observe(...);
herbeoordeel();                                             // geen flits van één frame bij eerste paint
window.addEventListener('resize', herbeoordeel, { passive: true });
```

De `rootMargin` bepaalt hier alleen nog het *moment* van herbeoordelen; het predicaat leest
de echte geometrie, dus drift is onschadelijk. Bij toestelrotatie klopte de staat in alle
vier de gemeten toestanden.

**Kies de grens op de invariant, niet op gevoel.** Bij "een vaste balk mag geen tweede
identieke CTA opleveren én er moet altijd één aantikbaar zijn" breekt "verberg zodra het
doel het scherm raakt" de eerste eis (een strookje van 1px is geen tikdoel) en "verberg pas
bij volledig zichtbaar" de tweede (~24px scroll waarin beide aantikbaar zijn). Alleen
"midden vrij" maakt ze allebei waar, want dan is *verborgen ⟺ aantikbaar* één conditie.

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

## 16. Scroll-spy hoort niet op een IntersectionObserver (Sessie 226)

`animations.css` zet `html { scroll-behavior: smooth }`. Een observer die de actieve sectie moet
bijhouden vuurt dan **tijdens** de animatie — op posities die de lezer nooit ziet — en ná afloop
kruist er niets meer, dus de markering blijft op een tussenstand staan. Gemeten symptoom:
stelselmatig de vórige sectie actief, bij élke sprong.

```js
// Scrollpositie verandert continu → scroll-listener met rAF, niet een observer.
let gepland = false;
const opScroll = () => {
  if (gepland) return;
  gepland = true;
  requestAnimationFrame(() => { gepland = false; herbeoordeel(); });
};
window.addEventListener('scroll', opScroll, { passive: true });
window.addEventListener('resize', opScroll, { passive: true });
herbeoordeel();                                    // ook synchroon bij init
```

Dit spreekt §12 niet tegen: dáár is de observer een *"er is iets veranderd"*-signaal voor een
**toestandswissel**. Een grootheid die continu verandert heeft een trigger nodig die dat ook doet.

**Anker je grens op `scroll-padding-top`, niet op de navbar-hoogte.** Met
`scroll-padding-top: calc(var(--navbar-height) + 16px)` parkeert een `#anker`-sprong de kop op
76px; een grens van `navbar + 8 = 68` markeert dan structureel de sectie ervóór.

```js
const basis = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
const grens = basis + 8;   // tolerantie voor afronding bij smooth scroll
```

En vergeet `scroll-padding-top` niet op de pagina zelf: `blog.css` had hem niet (terwijl
`landing.css` en `commands.css` wel), dus elk anker landde achter de vaste navbar.

---

## 17. Een rusttoestand-sweep laat de helft van je kleuren ongemeten (Sessie 227)

Contrastspecs meten wat `getComputedStyle` op een element teruggeeft. Dat is per definitie de
**rusttoestand** — dus `:hover`, `:focus-visible` en `:active` worden nooit aangeraakt. Vier
defecten die in Sessie 227 boven kwamen zaten precies daar, en drie ervan waren **onder AA**:

```
.btn-secondary:hover        --color-ui-primary als TEKST   2,61-2,77 (light)   onder AA
.gids-sample-link:hover     --color-cta-primary            2,76                onder AA
--color-link-hover (dark)   #58a6ff op --color-bg-modal    6,85                onder AAA
```

De `.gids-sample-link` is het scherpste voorbeeld: Sessie 221 repareerde daar de **rust**-kleur
naar `--color-accent-text` (8,07:1) en liet de hover op het oude merkgroen staan. Twee sessies
lang groen, want geen enkele spec keek.

**Simuleer de hover niet** — een muis-hover per element over 16 pagina's maakt de suite
onwerkbaar. Toets in plaats daarvan de **token-matrix**: verzamel tijdens de element-sweep de
verzameling effectieve achtergronden waar het token feitelijk op landt, en zet élk verwant
token daar tegenaan.

```js
const achtergronden = new Set();
achtergronden.add(effBg(document.body));           // ondergrens: de paginakleur zelf
for (const el of kandidaten) achtergronden.add(effBg(el));

for (const naam of ['--color-link', '--color-link-hover'])
  for (const bg of achtergronden)
    if (ratio(token(naam), bg) < 7) overtreders.push(`${naam} op ${bg}`);
```

Die ondergrens is niet cosmetisch: vier pagina's (contact + de drie sample-pagina's) dragen in
light **nul** elementen met een link-token — hun links staan op knopstijlen, en de navbar is
Dark Frame met een eigen token. Zonder de body-achtergrond zou de matrix daar niets toetsen.

**De mutant die dit bewijst faalt anders dan de rest.** `--color-link-hover` in dark
terugzetten gaf *4 rood, 12 groen*, en die 4 uitsluitend op de token-matrix — de element-sweep
bleef groen, want een hover-kleur komt in rust nergens voor.

---

## 18. Bevries transities voordat je meet; wachten is geen oplossing (Sessie 227)

§15 zegt al dat een lopende transitie een tussenframe oplevert. De remedie die daar (en in
Sessie 226) stond — "wacht ~700 ms" — is **niet betrouwbaar**. Gemeten op dezelfde pagina, met
dezelfde wachttijd, twee opeenvolgende runs:

```
run A   .related-category (light)   7,88:1  op rgb(242,249,255)   ← badge over de WITTE kaart
run B   .related-category (light)   1,70:1  op rgb(32,44,56)      ← badge over de DONKERE kaart
```

En het aantal gemeten elementen wisselde mee (106 vs 110 op één pagina). De oorzaak is niet de
kleurtransitie maar de fade-ins uit `animations.css`: die bepalen wanneer een kaart zijn
eindstaat heeft, en dat hangt van timing af die je niet in de hand hebt. Een guard die soms
1,70 meet gaat willekeurig rood — en wordt dan weggeklikt.

Haal de race wég in plaats van hem te overleven:

```js
await page.addStyleTag({ content:
  `*, *::before, *::after { transition: none !important; animation: none !important; }` });
```

`getComputedStyle` geeft daarna per definitie de eindwaarde. Drie runs erna byte-identiek.
`!important` is hier het juiste gereedschap — dit is een **meetinstrument** dat auteur-CSS
moet verslaan, geen productiecode (vgl. de vuistregel om `!important` in `styles/` te mijden).

> Diagnostisch signaal, uit §10 en hier bevestigd: komt een gemeten kleur **of achtergrond**
> met geen enkel token overeen, dan meet je een tussenframe. Let op dat het ook de
> ACHTERGROND kan zijn die achterloopt, niet alleen de tekstkleur — dat kostte hier een
> verkeerde diagnose ("de fix heeft iets gesloopt") voordat een directe inspectie 7,88 gaf.
