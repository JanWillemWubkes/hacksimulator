---
paths:
  - "src/**/*.js"
---

# JS-runtimepatronen

De §-nummers komen uit de oude `architecture-patterns.md` en zijn ongewijzigd.
Verwante bestanden: `css-layout.md`, `meten-en-guards.md`, `caching-deploy.md`.

## 0. Snelle regel

- **No Duplicate Listeners:** event delegation boven per-element handlers (Sessie 52) → `src/ui/input.js`

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

