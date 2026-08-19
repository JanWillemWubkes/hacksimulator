---
paths:
  - "_headers"
  - "netlify.toml"
  - "src/**/*.js"
---

# Cache- en deploystrategie

De §-nummers komen uit de oude `architecture-patterns.md`.
De A/B-methode om een deploy-wijziging te bewijzen staat in `meten-en-guards.md` §6.

## 3. Cache Strategy (Sessie 78)

1-uurs cache + `?v=X` override → `_headers`.

⚠️ **Alleen entry-points dragen een `?v=`** (`main.js`, `main.css`); de 119 modules die
`main.js` relatief importeert (`renderer.js`, `box-utils.js`, …) niet. Een `?v=`-bump bust
die dus **niet** — ze komen tot `max-age` uit browsercache, en `must-revalidate` grijpt pas
ná afloop daarvan. Gevolg bij een te lange max-age: verse entry naast oude submodules =
cross-module-mismatch (Sessie 205: `renderer.formatText is not a function`, en de Sessie
204-fixes in `box-utils.js` bereikten terugkerende bezoekers 7 dagen niet). Daarom staat
`/src/**/*.js` op `max-age=3600`. **Verifieer een submodule-fix daarom altijd tegen een
no-store server of via `import('…?cb='+Date.now())`, nooit tegen een warme browser.**
