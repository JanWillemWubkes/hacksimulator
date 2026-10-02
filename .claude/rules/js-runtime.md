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

**Een uitzondering hoort in het predicaat, met de afweging in het commentaar (Sessie 241).**
"Midden vrij" liet een venster open waarin de hero-CTA net onder de navbar schoof terwijl de
onderste chiprij nog in de balkzone stond (22 afgedekte posities, gemeten per 10px). Nu:
`doelen.some(middenVrij) || zouChipAfdekken()`, met een tweede observer op de chips
(`threshold: [0, 1]`, want die kruisen de balkrand met hun randen, niet hun midden). In dat
venster is geen "Start"-knop aantikbaar, maar de chips zijn het wel. Dat is een bewuste
afweging, en ze staat in het contractcommentaar van `landing-demo.js`.

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


## 17. De toestand meteen, het beeld met vertraging; een stagger telt wat je ziet (Sessie 247)

Een reeks die regel voor regel uitrolt, hoeft de DOM niet stap voor stap te vullen. Zet alles
meteen neer en laat alleen het beeld wachten (`animation-delay` per element, `backwards`-fill).
Dan leest een schermlezer, een test of een kopieerder nooit een halve reeks, en staat zonder
animatie (reduced motion, een meting) direct de eindstand. Zo bleef `is-open` op een poort meteen
waar terwijl de inversie op de tik van zijn regel wachtte; een bestaande test las `.is-open`
direct na een klik.

Tel in een stagger alleen wat in beeld staat. In een venster met `justify-content: flex-end`
vielen de eerste regels van een lange uitvoer boven de rand, maar telden ze mee in de vertraging:
400ms zwarte module voordat er iets verscheen.

En: wat een auto-demo in rust laat staan, is het ontwerp. Een lus die na 3,2s een ander command
toont, liet de open poorten zonder hun regels staan, 12 van elke 15 seconden.
