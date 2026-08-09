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

## 10. Kleur volgt de achtergrond, niet het merk (Sessie 215)

`--color-cta-primary` is het merkgroen en werkt overal waar het op de zwarte terminal
staat (~17:1). Op de **lichte paginaachtergrond** meet datzelfde token **3,10:1** bij
14,4px — onder WCAG AA (4.5:1), laat staan de AAA die dit project voert.

**Regel:** vóór je een merkkleur op tekst zet, kijk op wélke achtergrond die tekst landt.
Binnen een Dark-Frame-element (terminal, navbar, footer) is merkgroen prima; daarbuiten
hoort de tekst `var(--color-text)` te zijn en mag hooguit een decoratief glyph
(`aria-hidden`) de merkkleur dragen.

> Bestaand voorbeeld dat hier nog niet aan voldoet: `.eyebrow-badge` gebruikt
> `--color-cta-primary` op 0.75rem op de lichte achtergrond. Pre-existing, apart van
> Sessie 215 vastgelegd.
