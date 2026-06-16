# Architectuur- & structuurreview

**Datum:** 16 jun 2026 (Sessie 169-context) | **Scope:** bestands-/mapstructuur, niet runtime-gedrag

Doel: vastleggen of de projectstructuur gezond is, en welke schijnbare "rommel" bewust is —
zodat een volgende sessie dit niet opnieuw hoeft te onderzoeken.

## Verdict: structureel goed georganiseerd

Geverifieerd (niet op gevoel):

- **Broncode schoon.** `src/` is domein-gestructureerd: `commands/{filesystem,network,security,system,special}`,
  `core`, `ui`, `filesystem`, `gamification`, `tutorial`, `utils`, `analytics`. Eén entry
  (`src/main.js`, `type="module"`) + losse init-scripts (`init-theme`, `init-components`, `load-animations-css`).
- **Nul echte weesmodules.** `src/ui/blog-theme.js` lijkt orphan vanuit `src/`, maar wordt
  door alle 10 blogpagina's geladen.
- **Geen getrackte rommel.** Geen `*.backup`/`old`/`tmp` in git; artifact-mappen
  (`test-results/`, `playwright-report/`, `.playwright-mcp/`) correct gitignored.
- **Docs goed beheerd.** Afgeronde plannen staan in `docs/archive/`; levende docs zijn
  gelinkt vanuit `TASKS.md`/`PLANNING.md`. De omvang (`docs/sessions/` ~1,2 MB) is een
  bewust roterend logsysteem, bewaakt door `scripts/validate-docs.sh`.

## "By-design", geen rommel — niet aanraken

| Schijnbaar probleem | Waarom het zo hoort |
|---|---|
| 9 HTML's in repo-root | Schone Netlify-URLs (`/contact`, `/over-ons`); verplaatsen breekt élke productie-URL + SEO + interne links |
| `commands/index.html` naast `src/commands/` | Route-pagina (`/commands/`), geen code-duplicaat |
| Twee script-laad-conventies (`type="module"` vs. globale `defer`) | Bewust: globals hangen op `window`; uniformeren = hoog risico |
| `assets/legal/*.html` | Geserveerde URLs |
| `SESSIONS.md` + `docs/sessions/` | Roterend logsysteem (zie `/summary`-flow in CLAUDE.md) |

## Product-PDF artifact-flow (was schijnbaar een duplicaat)

```
docs/products/*.typ   →  build-pdfs.sh  →  docs/products/*.pdf   →  (kopie)  →  assets/samples/*.pdf
(bron, getrackt)         (typst compile)   (build-output,            (geserveerde
                                            niet getrackt)            lead-magnet, getrackt)
```

`docs/products/pentest-playbook-sample.pdf` was byte-identiek aan `assets/samples/...` —
geen bug, maar de bron→publiceer-stap. Build-PDF's zijn sinds deze review uit git
(`.gitignore: docs/products/*.pdf`); ze zijn herbouwbaar uit `.typ`. De geserveerde
lead-magnet in `assets/samples/` blijft getrackt.

## Bewust NIET gedaan (net-negatief)

- **Afgeronde plan-docs naar `docs/archive/` verplaatsen.** Inbound verwijzingen vanuit
  `docs/sessions/current.md` zijn historische narratie (geen nav-links), en `current.md`
  is een door `validate-docs.sh` bewaakt bestand — eraan editen voor pad-updates
  introduceert gate-risico voor puur cosmetische winst. Bovendien is `seo-launch-checklist.md`
  ambigu "pending". Laten staan.
- **Cache-bust `?v=X` normaliseren.** Raakt live browsercaching (`max-age=604800`); fouten
  zijn lokaal onzichtbaar en treffen terugkerende bezoekers tot 7 dagen. Echte automatisering
  vereist een build-stap (botst met "vanilla, no build"). Apart behandelen indien gewenst.
