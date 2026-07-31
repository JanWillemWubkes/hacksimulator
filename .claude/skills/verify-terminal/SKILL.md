---
name: verify-terminal
description: Gebruik om een terminal-simulator-wijziging (src/commands, src/core, asciiBox, output-rendering) end-to-end in de echte app te verifiëren zonder de volle UI. Codificeert de real-codepath-import-truc + objectieve mobielmeting @375px via Playwright. Trigger op "verifieer in de app", "real codepath", "mobiel meten", "in-app render".
---

# Terminal-wijziging in de echte app verifiëren

De projectvariant van de ingebouwde `verify`-skill. Er is **geen build-stap** (vanilla JS, Netlify
minify-on-deploy), dus je test bestand-op-schijf direct via Playwright MCP.

## Kernprincipe
Meet **gedrag, niet de scherm-heuristiek**. Playwright's `fill()` forceert focus voorbij de
FocusTrap, waardoor een command "uitvoert" met een modal actief → vals-positief. Gebruik het
echte input-pad of importeer de module direct.

## Techniek 1 — Real-codepath via directe module-import (Sessie 200/202)
De typewriter, consent-modal en FocusTrap staan tussen jou en de `execute()`-output. Importeer de
command-module direct in `browser_evaluate` en draai de échte tak:

```js
// Cache-bust verplicht: geen build-stap → browser serveert anders de oude versie
const mod = await import('/src/commands/security/nmap.js?cb=' + Date.now());
// Stub of passende target om een specifieke tak te raken, bv.:
//   - vfs.copy die "No such file" gooit (cp/mv error-tak)
//   - nmap op een 'secure-*' host → de 443-only-tak
const out = mod.execute(/* args die de doeltak raken */);
return out; // meet de string, niet wat het scherm toont
```

Relatieve imports zónder `?cb=` serveren de oude versie — de in-app render kan dan nog het oude
gedrag tonen terwijl schijf al klopt. Altijd `?cb='+Date.now()`.

## Techniek 2 — Objectieve mobielmeting @375px (Sessie 197/202)
Resize naar 375px (iPhone SE) en meet numeriek, niet op het oog:

```js
// In browser_evaluate na browser_resize(375, …):
const el = document.querySelector('#terminal-container');
return {
  // horizontale overflow van elementen
  overflowCount: [...document.querySelectorAll('*')]
    .filter(n => n.scrollWidth > n.clientWidth + 1).length,
  // heeft de pagina zelf gescrolld? (moet 0 zijn)
  pageScrollX: window.scrollX,
  bodyScrollW: document.body.scrollWidth,
  clientW: document.documentElement.clientWidth,
};
```

Voor ASCII-box-randuitlijning: verzamel de output-regels en check dat álle box-regels exact even
lang zijn (totaal == `width`, het contract van `getResponsiveBoxWidth()`; inner = `width - 2`):
```js
const lens = [...new Set(rows.map(r => r.length))]; // moet lengte 1 hebben binnen één box
```

Voor visuele wrap-detectie (box-rand breekt op het scherm): check per `.terminal-line`
`el.getBoundingClientRect().height > 1.5 × line-height` — een echte wrap verdubbelt de hoogte.
**Niet** rect-`top`-waarden of `rects.length` gebruiken: inline spans (`marker-arrow` heeft
`vertical-align: 3.6px`) verschuiven rects op dezelfde visuele regel (gemeten vals-positief).
`scrollWidth <= clientWidth` is óók onbruikbaar: `overflow-x:hidden` + `pre-wrap` op
`#terminal-output` laat te brede regels wrappen, nooit scrollen.

## Wanneer wél de volle UI
Typewriter-gedrag, consent-flow-transities, scroll-to-bottom, focus-herstel — dat zijn juist de
lagen die techniek 1 omzeilt. Test die via het echte input-pad (typen zónder force-focus).

## Reikwijdte
Deze skill dekt runtime-gedrag van terminal-output. Voor puur-tekst/docs/CSS zonder runtime-oppervlak
is er niets te driven — sla dan over.
