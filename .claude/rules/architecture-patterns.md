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
