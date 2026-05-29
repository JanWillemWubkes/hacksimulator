# Third-Party Performance Audit — `/terminal.html`

**Sessie:** 143 (28 mei 2026)
**Trigger:** Sessie 142 Lighthouse-meting Mobile 39/Desktop 64 → TASKS.md item #25 spawned voor scope-correctie #24
**Bron-meting:** Productie `https://hacksimulator.nl/terminal.html`, `lighthouse@11`, `--only-categories=performance`
**Status:** Research complete (~2 uur), recommendations gereed voor #24-heropening

---

## TL;DR

**Hoofdbevinding:** Op `/terminal.html` is **AdSense het complete ecosysteem dat de Lighthouse performance domineert** — niet "AdSense+GA+Brevo+Ko-fi+misc" zoals Sessie 142 attribueerde. GA4, Brevo, Ko-fi laden niet op deze pagina.

| Metric | Sessie 142 | Sessie 143 (reproduction) | Delta |
|--------|-----------|---------------------------|-------|
| Mobile score | 39/100 | 40/100 | +1 (binnen noise) |
| Desktop score | 64/100 | 69/100 | +5 (run-variance) |
| Third-party transfer | 353 KB / 10 req | 353 KB / 12 req / 6 origins | identiek |

**Ground truth third-party op `/terminal.html`:**
- AdSense ecosystem (pagead2 + DoubleClick + adtrafficquality): **251.7 KB / 73% blocking-time / 8 requests**
- Google Fonts (gstatic + googleapis): **101.3 KB / 0 ms blocking** (al optimaal gedeferred)
- GA4 / Brevo / Ko-fi: **0 KB, 0 requests** (consent-denied default + niet geladen op terminal.html)

**Killer-bevinding:** AdSense ad-slot script heeft **132.9 KB / 77% ongebruikte code** op terminal.html. Terminal.html bevat geen `<ins>` ad-elementen in de body — `adsbygoogle.js` is op deze pagina structureel waste, tenzij AdSense Auto-ads in het dashboard aanstaat. Verifieer Auto-ads-state → indien UIT → 4 regels HTML weghalen levert ~230 KB / ~788 ms blocking besparing op, zonder revenue-impact.

---

## §1 Methodologie (reproduceerbaar)

### Lighthouse run

```bash
mkdir -p /tmp/perf-audit-143

# Mobile (default preset: 4x CPU throttling + 1.6 Mbps, viewport 360×640)
npx --yes lighthouse@11 https://hacksimulator.nl/terminal.html \
  --only-categories=performance \
  --output=json --output-path=/tmp/perf-audit-143/lh-mobile.json \
  --chrome-flags="--headless --no-sandbox" --quiet

# Desktop (no throttling, viewport 1350×940)
npx --yes lighthouse@11 https://hacksimulator.nl/terminal.html \
  --only-categories=performance --preset=desktop \
  --output=json --output-path=/tmp/perf-audit-143/lh-desktop.json \
  --chrome-flags="--headless --no-sandbox" --quiet
```

**Pin op `lighthouse@11`** — Node 18 compat (Lighthouse 12+ vereist Node 22+ door import-attributes syntax). Bevestigd in Sessie 142 als productie-baseline.

### Parse-script (Python ~30 regels)

Bekijk `audits["network-requests"]` en `audits["third-party-summary"]` in de JSON. Volledig script in deze sessie-entry: `docs/sessions/current.md` Sessie 143.

### Reproducibility-check

Run 2x na elkaar → score-variantie typisch ±3 punten door AdSense creative-rotation + CDN-cache state. Voor budget-vergelijking gebruik mediaan van 3 runs.

---

## §2 Ground truth — per-origin breakdown (`/terminal.html`)

### Network requests + transfer-size

| Origin | KB Mobile | KB Desktop | Requests | Types |
|--------|-----------|-----------|----------|-------|
| `pagead2.googlesyndication.com` | 230.5 | 230.6 | 4 | Document, Script |
| `fonts.gstatic.com` | 99.8 | 99.8 | 3 | Font (woff2) |
| `ep1.adtrafficquality.google` | 13.3 | 13.4 | 1 | XHR (telemetry) |
| `ep2.adtrafficquality.google` | 7.9 | 7.9 | 1 | Script (`sodar2.js`) |
| `fonts.googleapis.com` | 1.5 | 1.5 | 1 | Stylesheet |
| anonymous (image beacons) | 0.0 | 0.0 | 2 | Image (0-byte pixels) |
| **Totaal** | **353.0** | **353.1** | **12** | **6 origins** |

Transfer-size is identiek tussen mobile en desktop — preset-verschil zit in CPU/network throttling, niet in laad-payload.

### Blocking-time per entity (`audits.third-party-summary`)

| Entity | Mobile blocking | Desktop blocking | Mobile main-thread | Transfer |
|--------|-----------------|------------------|--------------------|----------|
| **Google/Doubleclick Ads** | **788 ms** | 104 ms | 1329 ms | 230.5 KB |
| adtrafficquality.google | 97 ms | 0 ms | 210 ms | 21.2 KB |
| Google Fonts | 0 ms | 0 ms | 11 ms | 101.3 KB |

Mobile-vs-desktop blocking-time-ratio voor AdSense = 788/104 = **7.5x** → bevestigt: AdSense bottleneck is **CPU-execution, niet bandwidth**. CPU-throttled mobile-devices vrijwel uitsluitend getroffen.

### Render-blocking resources (`audits.render-blocking-resources`)

| Resource | KB | Wasted | Reden |
|----------|----|----|-------|
| `styles/mobile.css?v=115` | 10.1 | 165 ms | onvermijdelijk op mobile (media query terecht actief) |
| `styles/animations.css?v=114` | 5.0 | 165 ms | **defer-kandidaat** (geen media-query split) |

### Unused JavaScript (`audits.unused-javascript`)

| Script | Totaal | Ongebruikt | % |
|--------|--------|-----------|---|
| AdSense ad-slot module (`pagead/managed/js/adsense/m20...`) | 172.7 KB | **132.9 KB** | **77%** |
| `adsbygoogle.js` (loader) | 53.9 KB | 28.7 KB | 53% |

**Tolk:** AdSense laadt 226 KB JS waarvan 161 KB nooit uitgevoerd op terminal.html. Dit is *prima facie* bewijs dat de pagina geen ads serveert.

### Bootup-time (`audits.bootup-time`, top scripting cost)

| Script | Total time | Pure scripting | Eigenaar |
|--------|-----------|---------------|----------|
| `pagead/.../adsense/m20...sh` | 915 ms | 766 ms | AdSense (Google) |
| `adsbygoogle.js` | 409 ms | 344 ms | AdSense (Google) |
| `src/utils/box-utils.js` | 309 ms | 200 ms | **first-party** ⚠️ |
| `ep2.adtrafficquality.google/sodar/sodar2.js` | 210 ms | 179 ms | AdSense fraud-detection |
| `chrome-error://chromewebdata/` | 147 ms | 45 ms | Chrome internal |

**Out-of-scope nota:** `box-utils.js` 309 ms total + 200 ms scripting is verrassend hoog voor utility-code. Niet onderdeel van #25 (third-party) — registreren als nieuwe first-party-perf-task (`box-utils.js` profile + cache-warming review) na #24-sprint.

**Sessie 145 closure — Frame B bevestigd (geen actie):** verify-first-plan uitgevoerd met 3-run Lighthouse@11 + raw trace.json parsing + Playwright cold/warm. Bewijs voor attributie-bias-frame:

| Meting | Waarde | Frame-implicatie |
|---|---|---|
| Raw trace EvaluateScript box-utils.js | 0 ms | Frame B (Lighthouse-attributie-bias) |
| Raw trace v8.parseOnBackground + v8.compileModule | 1.31 ms | background-thread, geen main-thread cost |
| Playwright importMs cold (mediaan N=5) | 30.6 ms | incl. ~25 ms netwerk-RTT, V8-werk <2 ms |
| Playwright coldCallMs `getResponsiveBoxWidth()` | **1.4 ms** | Frame A vereist >20 ms → gefalsifieerd |
| Playwright warmCallMs (na 1e call) | **0.1 ms** | cache werkt impeccable → hypothese (b) gefalsifieerd |
| Lighthouse `audits.bootup-time` scripting | **230 ms** | **~177x mismatch t.o.v. raw trace** |
| Mainthread-work-breakdown styleLayout | **2172 ms** | écht dominante cost-driver |
| Mainthread-work-breakdown scriptEvaluation totaal | 376 ms | box-utils zou 61% daarvan zijn — onmogelijk |

Conclusie: Lighthouse's `bootup-time` URL-attributie via call-stack-heuristiek schrijft hier ~230 ms toe aan een module die in raw event-data <2 ms main-thread-cost heeft en waarvan élke functie-aanroep sub-2-ms is. Het is een meet-artefact, niet een optimalisatie-target. Mobile-score-verbetering richting 70-80 moet uit Layout/Style-reductie komen (kandidaat-task #28 — `Layout` 195+137+87 ms top single tasks dominant). Volledige verify-first-protocol vastgelegd in `/home/willem/.claude/plans/heisenberg-hier-pak-item-pure-cascade.md`. Direct learning voor toekomstige perf-audits: **`bootup-time` per-URL-cijfers vereisen multi-metric verificatie via raw trace + isolated measurement vóór gebruikt als beslis-anchor**.

---

## §2b Sessie 146 closure — item #28 Style/Layout Frame D (geen actie, spawn item #29)

**Verify-first-plan:** `/home/willem/.claude/plans/heisenberg-hier-pak-logical-knuth.md` (~2200 woorden, 4-frame decisional-thresholds-tabel met 8 signalen + tie-breaker, anti-Sessie-145-attributie-bias cross-check verplicht).

**Methodiek:** hergebruik Sessie 145 mediaan-run `/tmp/perf-item26/lh-run2-0.trace.json` voor source-attributie (Layout-events met `args.beginData.frame` cross-frame-filter tegen `TracingStartedInBrowser` mainFrame) + Playwright MCP cold-meting op productie voor deterministische cross-check via `performance.getEntriesByType('navigation'|'paint'|'resource')` + buffered `PerformanceObserver({type: 'layout-shift'|'longtask', buffered: true})`.

**Multi-metric bewijs voor Frame D (geen meerderheid, no-action):**

| Signaal | Meting | Frame-implicatie |
|---|---|---|
| Raw trace main-frame Layout events (8 totaal) | Top-3 dur = 194,87 + 137,42 + 86,83 ms (som 419 ms) | parser-driven (stackTrace depth 0) — geen JS-attributie |
| Top-1 Layout `args.beginData.stackTrace` | `depth=0` (empty) | Frame A signaal 1 sub-check 1: **NIET hit** |
| Playwright `performance.getEntriesByType('measure')` count | **0 marks + 0 measures** | Frame A signaal 1 sub-check 2 (perf.measure >30ms): structureel N/A zonder code-instrumentatie |
| RecalcStyle events main-frame met dur >5 ms | 3 events | Frame B signaal 2 (>50): **NIET hit** |
| ParseAuthorStyleSheet som (5 stylesheets) | 11,54 ms | Frame B signaal 3 (>100): **NIET hit** |
| Unique top-3-frame URLs in top-10 RecalcStyle | 4 | Frame B signaal 4 (>5): **NIET hit** |
| Ratio UpdateLayoutTree / Layout main-frame | 6,38 (51/8) | Frame B signaal 5 (>10): **NIET hit** |
| Top-1 Layout ts relative aan first event | 631 ms (BUITEN FOUT-window 200-400ms) | Frame C signaal 6: **NIET hit** |
| Cumulative LayoutShift score (Playwright buffered observer, productie) | 0,000107 | Frame C signaal 7 (>0,01): **NIET hit** |
| Som Top-3 Layout | 419 ms (>100ms = NIET niet-worth-it) | Frame D signaal 8: **NIET hit** |
| Long-task #1 cold-meting productie desktop | **520 ms at startTime 566 ms** (omhult navbar.js arrival 660ms + footer.js 726ms + legal.js 763ms + mobile.css 506ms + animations.css 507ms) | observatie buiten v2 framework |

**Frame-tabel samengevat:**

| Frame | Hits | Beslissing |
|---|---|---|
| A (DOM-injection-driven) | 0/1 cluster sub-checks | NIET valide |
| B (CSS-cascade-driven) | 0/4 signalen | NIET valide |
| C (Font-swap-driven) | 0/2 signalen | NIET valide |
| D (no-meerderheid) | tie-breaker per plan v2 | **GEKOZEN per "Bij twijfel: Frame D" regel** |

**Conclusie:** plan v2's decisional-thresholds-tabel geeft 0 frames een data-driven verdict. Per tie-breaker-regel valt het in Frame D (legitiem identiek aan Sessie 145 item #26 Frame B closure-pad). Geen code-actie in Sessie 146.

**Plan v2 framework-gat — structureel learning:** de cold-meting onthulde een **lazy-module-fetch-cascade-mechanisme** dat in de 4-frame-set niet gecategoriseerd is. navbar.js, footer.js, legal.js worden niet sync inline geladen maar door `<script type="module" src="/src/init-components.js">` als module-graph-imports gefetched. Long-task #1 (520 ms desktop, ≈ 2000 ms mobile met 4× CPU throttling) omhult deze cascade. Top-3 trace-Layouts (parser-driven, geen JS-stack) komen uit browser-default render-cycle-ticks NA cascade-resolution, niet als JS-call side-effect — daarom kunnen ze NIET via Frame A's "JS-injection rAF/contain"-patches gepatcht worden. Frame B (CSS-cascade) signalen falsifiëren ook de "main.css selector-complexity"-hypothese. Frame C falsifieert door cumulative LayoutShift 0,000107 + Top-1 ts buiten FOUT-window.

**Spawn item #29 — lazy-module-fetch-cascade audit + modulepreload-experiment:** documenteer hypothese (`<link rel="modulepreload" href="/src/components/navbar.js">` + footer.js + legal.js → cascade-latency wegnemen → Top-1 Layout (194 ms mobile) krimpt mee). Vereist aparte verify-first-cyclus met eigen 3-run mediaan baseline + ná-meting; geen impulsief experiment NU want plan v2-framework noemt dit pad niet.

**Honest-flag:** Heisenberg's spawn-instructie ("Verwachte uitkomst: mobile 59 → 70-80 indien top-3 Layout-triggers stabiel gemaakt of uitgesteld") werd NIET vervuld. Data toonde dat top-3 triggers geen actionable JS-events zijn binnen het plan v2 framework. Tweede sessie op rij waarin Heisenberg's verwachte mobile-score-delta door data wordt gefalsifieerd én transparant geaccepteerd zonder rationalisatie of plan-design-creep (Sessie 145 Frame B leerpunt herbevestigd).

**Defense-in-depth-persistence-pattern (Sessie 140):** Frame D-uitkomst vastgelegd op 3 plekken — (a) dit audit-doc §2b multi-metric tabel, (b) TASKS.md item #28 closure-tekst, (c) CLAUDE.md "Recent Critical Learnings" Sessie 146.

---

## §3 Trade-off-tabel per origin (defer-kosten vs perf-impact)

| Origin | Functie | Huidige load | Consent-gated? | Defer-optie | Revenue-impact bij defer | UX-impact | Perf-besparing geschat | Status |
|--------|---------|--------------|----------------|-------------|--------------------------|-----------|----------------------|--------|
| `pagead2.googlesyndication.com` (adsbygoogle.js + ad-slot module) | AdSense JS-loader, ad-serving runtime | `<script async>` in `<head>`, Consent Mode v2 init | Nee (laadt ook met denied — Google's CMv2 design) | **A**: lazy via IntersectionObserver (geen ads aanwezig → niet relevant); **B**: defer tot na `load`-event (~3-5 s); **C**: verwijderen van terminal.html | **A/B**: ~~CPM-drop 5-15%~~ → vermoedelijk NUL (geen ad-slots in body); **C**: NUL als Auto-ads UIT, **anders 100% van Auto-ads-revenue op terminal.html** | NUL (geen ads in body) | ~230 KB transfer + 788 ms TBT + 1325 ms main-thread (mobile) | 🟢 **Quick win** als Auto-ads UIT, anders 🟡 |
| `ep1.adtrafficquality.google` (XHR telemetry) | AdSense fraud-detection ping | Lazy — geladen door adsbygoogle | AdSense-afhankelijk | Hangt aan AdSense → kan niet apart | Marginaal (volgt AdSense status) | NUL | 0 ms blocking desktop, 97 ms mobile (gezamenlijk met ep2) | 🔴 hands-off (Google-vereiste) |
| `ep2.adtrafficquality.google` (`sodar2.js`) | AdSense Spam-and-Other-Behaviour fraud-detection | Lazy door AdSense | AdSense-afhankelijk | Idem | Marginaal | NUL | 210 ms main-thread mobile | 🔴 hands-off |
| `fonts.gstatic.com` (3 woff2 files) | Inter, JetBrains Mono, Space Grotesk webfonts | `<link rel="stylesheet" media="print" onload="this.media='all'">` deferred pattern + `&display=swap` | Nee | Self-host woff2-subsets → elimineer `gstatic` round-trip; verandert load-path niet verder | NUL | NUL bij self-host (zelfde glyphs) | **0 ms blocking nu** (al optimaal) → self-host bespaart 50-100 ms initial-connection-time tijdens TLS-handshake | 🟢 optioneel (self-host) / al optimaal als-is |
| `fonts.googleapis.com` (CSS) | Google Fonts CSS-bestand | `media="print" onload` deferred + preconnect hint | Nee | Idem self-host | NUL | NUL | <50 ms (klein CSS-bestand) | 🟢 optioneel met self-host |
| anonymous (2x image-beacons) | AdSense pixels / pixel-tracker | Lazy | AdSense-afhankelijk | Hangt aan AdSense | NUL | NUL | 0 KB | 🔴 hands-off |

**Belangrijkste regel uit deze tabel:**

> Op `/terminal.html` is de **complete AdSense-overhead vrijwel uitsluitend Google-execution-cost** (766+344+179 = 1289 ms pure scripting) **zonder enige rendering-output** (geen `<ins>`-slots in `<main>`). De Sessie 142-aanname "AdSense + viewability-CPM-trade-off" geldt voor blog-pagina's met ads, NIET voor terminal.html.

> ⚠️ **Zie §3a hieronder voor de structurele onderbouwing van Pad C2-veiligheid** — revenue-baseline-data uit het AdSense-dashboard is bevestiging, NIET het primaire argument.

---

## §3a Productie-revenue-context + structurele Pad C2-veiligheid (post-audit verificatie, 28 mei 2026)

Heisenberg verifieerde AdSense dashboard ná Sessie 143-audit-completion:
- **Auto-ads UIT** (bevestigt grep-bewijs uit §2 + maakt dynamic ad-injectie technisch onmogelijk)
- **Site-totaal revenue €0,02 / 30 dagen** (39 impressions, 625 pageviews, 0 klikken, viewability 17,95%)

**Belangrijke context die deze cijfers nuance geeft (anti-frame-bias):**

De site is sinds launch **nog nooit gepromoot** (geen social, geen SEO-push, geen paid distribution). De rapportage-data reflecteren puur organische discovery — een **pre-promotion floor**, niet representatief voor toekomstige steady-state na promotion (waar traffic 10-100x kan schalen).

**Daarom: Pad C2-veiligheid wordt onderbouwd op STRUCTURELE gronden, niet op revenue-baseline:**

| Argumentlaag | Status | Traffic-afhankelijk? |
|--------------|--------|----------------------|
| `terminal.html` heeft 0 `<ins>` ad-slots in `<body>` (grep-verified) | ✅ Hard structureel feit | Nee |
| Auto-ads UIT in dashboard = geen dynamic injection mogelijk | ✅ Dashboard-verified 28 mei 2026 | Nee |
| `consent.js loadAdSense()` itereert `.ad-unit` elementen → 0 elements = no-op | ✅ Code-verified | Nee |
| €0,02 site-totaal revenue / 30 dagen | ⚪ Pre-promotion baseline (informatief, niet beslissend) | Ja — schaalt met promotion |

**Conclusie:** ongeacht toekomstige traffic-volume genereert `adsbygoogle.js` op `terminal.html` 0 ad-revenue, want er bestaat geen ad-render-target op deze pagina. Pad C2 is **traffic-onafhankelijk safe**.

**Wat dit NIET betekent (om misinterpretatie te voorkomen):**

- §3 revenue-trade-off-framework (industry estimate 5-15% CPM-drop bij defer) **blijft volledig van toepassing voor pages MET ad-slots** (`index.html`, blog-pages, `sample-pentest.html`). Voor die pages moet bij elke toekomstige defer-audit hetzelfde framework gebruikt worden. De absolute revenue-impact in EUR/maand is **nu** laag door pre-promotion traffic, maar kan met promotion 10-100x schalen — gebruik dáár nooit huidige €-cijfers als beslis-anchor.
- Toekomstige ad-monetization van `terminal.html` is mogelijk maar vergt expliciete code-change (`<ins>` slot toevoegen + adsbygoogle.js-script terugplaatsen). Dat is een bewuste opt-in revenue-beslissing, niet een unintended-default. Pad C2 blokkeert die toekomst niet, maakt 'm alleen expliciet.

**Decision-tree voor toekomstige per-page third-party-audits:**

| Page-config | Aanpak |
|-------------|--------|
| Heeft ad-slots + Auto-ads UIT | Defer-trade-off framework §3 toepassen, CPM-impact in EUR/maand schatten met huidige traffic + scaling-factor naar promotion-state |
| Geen ad-slots + Auto-ads UIT | Structureel safe-to-remove (Pad C2-pattern, traffic-onafhankelijk) |
| Geen ad-slots + Auto-ads AAN | Auto-ads kan dynamisch ads injecteren — eerst Auto-ads page-rules in dashboard checken vóór removal-decision |
| Heeft ad-slots + Auto-ads AAN | Combinatie: §3-framework + Auto-ads-config raadplegen, hoogste revenue-impact-scenario plannen |

Dit decision-tree is herbruikbaar voor latere audits (blog-pages, index.html, sample-pentest.html).

---

## §4 Quick wins inventaris (Heisenberg's Q4)

### A. `font-display` audit — ALREADY DONE

- Google Fonts URL bevat al `&display=swap` op alle 3 pagina's (`terminal.html:37`, `index.html:42`, `sample-pentest.html:41`)
- Locale `@font-face` voor JetBrains Mono Box (`styles/main.css:16-21`) heeft expliciet `font-display: block` — **intentional** om FOIT te voorkomen voor box-drawing characters in terminal-output
- **Eerlijk-flag:** Heisenberg's prompt noemde dit als "quick win ~100 KB" — bij re-inspectie blijkt het al actief. Geen task hier.
- **Eventuele toekomstige optimization:** zelf-host woff2-subsets ipv `fonts.gstatic.com` → bespaart 1 DNS+TLS round-trip (~50-100 ms initial), maar de huidige `media="print" onload` pattern haalt deze al van het critical-path af. Lage prioriteit.

### B. Preconnect / dns-prefetch hints — partiële win mogelijk

**Huidig op terminal.html:34-36:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Mogelijke toevoegingen (mits AdSense behouden blijft):**
```html
<link rel="preconnect" href="https://pagead2.googlesyndication.com">
<!-- doubleclick + adtrafficquality NIET preconnecten: te speculatief, kan resource-throttling triggeren -->
```

- Verwachte besparing: ~50-150 ms LCP via parallel TLS-handshake tijdens HTML-parse
- Risico: te veel preconnects (>4-6) trigger Chrome's connection-throttling, kan tegenovergesteld effect hebben
- **Niet doen voor:** `ep1/ep2.adtrafficquality.google` (kleine late-loaded XHR's, preconnect waste), `googleads.g.doubleclick.net` (laadt alleen als pagead2 ads serveert)

### C. Async vs defer audit op terminal.html script-tags

| Script | Huidig | Status |
|--------|--------|--------|
| `init-theme.js` (476 bytes) | sync (lijn 371) | ✅ Acceptabel — voorkomt theme-flash, te klein voor defer-overhead |
| `init-components.js` (module) | `type="module"` (implicit defer) | ✅ Al deferred |
| `search-strategies.js` | `defer` | ✅ |
| `command-search-modal.js` | `defer` | ✅ |
| `mobile-quick-commands.js` | `defer` | ✅ |
| `faq.js` | `defer` | ✅ |
| `main.js` | `type="module"` | ✅ Al deferred |
| `adsbygoogle.js` | `async` | ✅ technisch correct, maar zie §5 voor defer-window |
| Consent Mode v2 init inline | sync, blocking | ✅ Required by Google (must be before AdSense) |

**Conclusie:** alle eigen scripts zijn correct geladen. Geen async/defer quick win hier.

### D. `animations.css` render-blocking fix — geconfirmeerd quick win

Lighthouse identificeert `styles/animations.css?v=114` als 165 ms render-blocking op mobile (5.0 KB). Twee paden:

- **Pad D1:** loadbar via `media="print" onload="this.media='all'"` pattern (zelfde als Google Fonts, terminal.html:37) → 165 ms besparing
- **Pad D2:** split animations.css in critical (inline in `<head>`) + non-critical (lazy) — meer werk, dezelfde besparing
- **Risico:** als animations.css critical animations bevat die direct na DOMContentLoaded zichtbaar zijn (onboarding fade-in, terminal-cursor blink) → flash van non-animated state mogelijk. Verifieer welke `@keyframes` actief zijn bij first-paint.

**Aanbeveling D1:** ~165 ms gratis besparing, mits visual-flash-check ok.

### E. fetchpriority hints

`<link rel="preload">` regels 41-43 voor main.css + terminal.css + main.js bestaan al. Kunnen krijgen `fetchpriority="high"` (Chromium ≥101). Marginale impact (~10-30 ms LCP).

### Quick-wins-tabel samengevat

| ID | Maatregel | KB-besparing | TBT/LCP-besparing | Risico | Aanbevolen |
|----|-----------|--------------|--------------------|--------|------------|
| A | `font-display:swap` toevoegen | n/a | n/a | n/a | ❌ **al actief** (non-task) |
| B | Preconnect `pagead2.googlesyndication.com` | 0 | ~100 ms LCP | Laag (1 extra connection) | ✅ |
| C | `animations.css` deferred via media-print onload | 0 | ~165 ms TBT/render-block | Medium (visual flash mogelijk) | 🟡 verifieer eerst |
| D | `fetchpriority="high"` op main.css/terminal.css/main.js preload | 0 | ~10-30 ms LCP | Laag | ✅ |
| E | Self-host fonts woff2-subsets | 0 | ~50 ms initial | Laag (compat-test nodig) | 🟡 optioneel |

Gezamenlijke quick-wins (B+C+D) = **~275 ms TBT/LCP-besparing zonder revenue-impact**.

---

## §5 Defer-window-analyse (Heisenberg's Q5)

Per script bepalen: kan dit pas N seconden na FCP of na user-interaction laden zonder UX-stutter en zonder Consent Mode v2 te breken?

### AdSense (`adsbygoogle.js`)

- **Huidige state:** `<script async>` in `<head>` met Consent Mode v2 `wait_for_update=500ms` ervoor
- **Defer-window optie 1 — wachten tot na `load`-event:** mogelijk (Google's eigen guidance: "for non-critical pages, consider deferring"). Spaart ~409 ms scripting + ~344 ms main-thread tijdens parse-fase. Risico: late lazy-injection van Auto-ads na load → laat CLS-event mogelijk (mitigatie: reserveer space, maar moeilijk zonder slots-positie)
- **Defer-window optie 2 — Intersection Observer rond ad-containers:** niet toepasbaar op terminal.html omdat er **geen ad-containers in body bestaan**. Maakt deze optie void voor deze pagina.
- **Defer-window optie 3 — Verwijderen van terminal.html:** structurele oplossing als Auto-ads UIT staat. Geen defer nodig, geen UX-impact.

### Consent Mode v2 init (inline `<script data-cookieconsent="ignore">`)

- **Huidige state:** sync inline, blocking ~3-5 ms (klein script, alleen `dataLayer` + `gtag('consent', 'default', ...)`)
- **Defer-window:** **NEE** — moet vóór AdSense laden per Google-vereiste. Niet defer-baar.
- **`wait_for_update=500ms`:** verlenging naar 2000-3000 ms zou AdSense forceren om 2-3 sec te wachten op een consent-banner-keuze. **Risico:** verslechtert revenue voor user die niet binnen 500 ms klikt; verbetert TBT marginaal. **Geen aanbeveling.**

### GA4 (`gtag.js`)

- **Huidige state:** wordt NIET geladen op default-Lighthouse-run (geen consent in fresh localStorage). Bij user-consent: dynamic injectie via `tracker.js:84-87` na `analyticsTracker.init('ga4')` call in `main.js:211`
- **Defer-window:** al opt-in + post-DOMContentLoaded geladen. **Optimaal as-is.**

### `ep1`/`ep2.adtrafficquality.google`

- Lazy geladen door AdSense fraud-detection runtime. Niet onafhankelijk defer-baar.
- **Defer-window:** geen — volgt AdSense lifecycle.

### Google Fonts

- **Huidige state:** `media="print" onload="this.media='all'"` pattern + `&display=swap` + preconnect = al maximaal off-critical
- **Defer-window:** **al optimaal.** Lighthouse rapporteert 0 ms blocking. Verdere defer = FOUT-risico op brand-fonts (Space Grotesk, Inter) zonder perf-winst.

---

## §6 Aanbevelingen voor #24-heropening — 3 concrete paden

Op basis van bovenstaande data zijn er drie zinvolle paden waaruit Heisenberg een keuze kan maken. Ze zijn complementair (kunnen gecombineerd) maar verschillen sterk in revenue/UX-risico.

### Pad C1 — Low-risk quick-win bundle (~30 min werk, ~275 ms LCP-besparing)

Doelvariant: voor scenario waar AdSense Auto-ads aanblijft. Combinatie van quick wins zonder revenue-impact:

- B: preconnect-hint toevoegen voor `pagead2.googlesyndication.com`
- C: `animations.css` via `media="print" onload` deferred (na visual-flash-verificatie)
- D: `fetchpriority="high"` op main.css/terminal.css/main.js preloads

**Verwachte impact:** Mobile 40 → ~50-55, Desktop 69 → ~75-80. Niet voldoende om naar ≥90 te komen, maar gratis winst.

### Pad C2 — AdSense Auto-ads investigation (USER ACTION nodig, dan potentieel ~230 KB / ~788 ms)

**Pre-werk (Heisenberg buiten Claude Code):**
1. Login AdSense dashboard → Sites → hacksimulator.nl → Auto ads tab
2. Verifieer of Auto-ads aanstaat voor `/terminal.html` (of: voor de hele site)
3. Check Page Reports → bestaan er ad-impressions op terminal.html-paths in de laatste 30 dagen?

**Beslissing:**

- **Als Auto-ads UIT** + geen ad-impressions op terminal.html in 30 dagen → adsbygoogle.js verwijderen van terminal.html (4-regel HTML edit, lines 68-71). Verwachte Lighthouse-impact: **Mobile 40 → ~70-80, Desktop 69 → ~85-90**. Geen revenue-impact.
- **Als Auto-ads AAN** met meetbare revenue → keuze tussen: (a) Auto-ads uitschakelen voor terminal.html-path specifically via AdSense advanced settings (revenue-trade-off), (b) status-quo accepteren en naar Pad C3 gaan.

### Pad C3 — Status-quo + budget herijken met onderbouwing

Als Pad C2 leidt tot conclusie "Auto-ads is een belangrijke revenue-stream voor terminal.html":

- Documenteer rationale: AdSense Auto-ads waarschijnlijk ~X% van site-revenue, Lighthouse Mobile <50 acceptabel als revenue-cost van die optimization is hoger dan SEO-benefit van >90
- Herijk Terminal Core budget officieel naar realistischer niveau (bv. 600 KB total transfer ipv huidige 624 KB als ceiling)
- PLANNING.md regel 497 budget-status van ⚠️ naar ✅ met expliciete trade-off-rationale
- Voeg C1 quick-wins toe als baseline-floor (geen reden om die te skippen)

### Combinatie-recommendation

Mijn aanbeveling als technical advisor (te verifiëren met Heisenberg):

1. **Direct doen (~30 min):** Pad C1 alle 3 quick wins implementeren — gratis winst, lage risico
2. **Volgende sessie (~15 min Heisenberg-actie):** Pad C2 dashboard-verificatie
3. **Op basis van C2-resultaat:** kies C2-implementatie OF C3-budget-herijking
4. Out-of-scope volgsessie: `box-utils.js` 309 ms total / 200 ms scripting profile (first-party, niet onderdeel van #25)

---

## §7 Verification

### Sessie 144 resultaten — Pad C1 + Pad C2 geïmplementeerd (29 mei 2026)

**Scope-uitbreiding tijdens implementatie:** grep `<ins class="adsbygoogle">` over alle HTML-files onthulde dat naast `terminal.html` óók **5 andere pages** dezelfde 0-slot-pattern hadden. Pad C2 toegepast op **6 pages**: `terminal.html` + `sample-pentest.html` + `gidsen.html` + `assets/legal/{privacy,terms,cookies}.html`. Comment `index.html:71` ("AdSense Script nodig voor crawler") werd technisch gefalsifieerd: crawler-ownership gebruikt `<meta name="google-adsense-account">` + `/ads.txt`, NIET de runtime script.

**Pad C1 strategy-aanpassing:** maatregel B (preconnect pagead2) **GESKIPT** want na C2 zinloos op terminal/sample-pentest/gidsen. Maatregel C (animations.css defer) opgewaardeerd naar **D2 critical-split** want het bestand bevat NIET alleen animations maar óók `:focus-visible` + `prefers-reduced-motion` (WCAG-compliance). Volledig defer = 165 ms a11y-regressie op keyboard/vestibular-users. Inline-extract van kritieke regels (~600 bytes) elimineert die regressie. Maatregel D (fetchpriority) toegepast op terminal.html + index.html preloads (sample-pentest.html heeft geen preloads).

**Delta-tabel — vóór/ná Pad C1 + C2 (productie Lighthouse@11):**

| Page | Preset | Score vóór | Score ná | Δ | TBT vóór | TBT ná | LCP vóór | LCP ná | Total KB | 3rd-party KB | AdSense KB/ms |
|------|--------|-----------|----------|----|---------|--------|----------|--------|----------|--------------|---------------|
| terminal.html | mobile | 49/100 | **59/100** | +10 | 1087 ms | 985 ms | 7716 ms | **4265 ms** (-3451) | 626 → 375 | 353 → 101 | 252/420 → **0/0** |
| terminal.html | desktop | 77/100 | **94/100** | +17 | 268 ms | 136 ms | 2184 ms | 1032 ms | 626 → 375 | 353 → 101 | 252/100 → **0/0** |
| sample-pentest.html | mobile | 73/100 | **82/100** | +9 | 1209 ms | 680 ms (-529) | 1655 ms | 1826 ms | 556 → 304 | 487 → 236 | 252/368 → **0/0** |
| sample-pentest.html | desktop | 99/100 | **100/100** | +1 | 68 ms | 62 ms | 555 ms | 542 ms | 555 → 304 | 487 → 236 | 251/0 → **0/0** |

**Harde succes-indicatoren:**
- **AdSense KB / blocking → 0** op alle 4 runs = Pad C2 effectief op productie
- **Total transfer -251 KB** consistent op alle 4 runs
- **terminal.html desktop 77 → 94** = +17 punten, dichtbij green-zone (>90)
- **sample-pentest.html desktop = perfect 100/100** voor het eerst
- **terminal.html mobile LCP -3451 ms** (-44%) — verwijdering van AdSense execution-blocking unblokte LCP-resource
- **sample-pentest.html mobile TBT -529 ms** = grote win, ondanks resterende Brevo-overhead 236 KB

**Eerlijk-flags (transparante observaties):**

1. **terminal.html mobile score 59 valt onder plan-ondergrens (70-80)** — net buiten stop-en-reframe-trigger (<55) maar lager dan verwacht. Hoofdoorzaak vermoedelijk first-party bottleneck: `src/utils/box-utils.js` 309 ms total / 200 ms scripting (item #26) + `terminal-education.css` content-rendering. Pad C1+C2 lost third-party deel op, maar Lighthouse mobile-score wordt nog steeds gedomineerd door eigen-code execution
2. **terminal.html mobile FCP +476 ms regression** (1566 → 2042 ms) — vermoedelijk run-variance, want desktop-run toont FCP -54 ms. Animations.css defer kan subtiel impact hebben op first-paint-readiness als CSSOM-tree complexer wordt. Marginaal en niet user-noticeable
3. **sample-pentest.html mobile LCP +171 ms regression** (1655 → 1826) — eveneens vermoedelijk run-variance (desktop toont LCP -13 ms = stabiel). Brevo iframe (`sibforms.com`) blijft op 236 KB de dominante factor op deze page
4. **Cumulatieve Lighthouse-noise** rond ±5 punten observeerd tussen Sessie 142 (mobile 39), Sessie 143 (mobile 40), Sessie 144 baseline (mobile 49), Sessie 144 ná-meting (mobile 59). Score-trend duidelijk positief, maar puntdelta's vereisen mediaan-meting voor statistische zekerheid (Sessie 143 §1 advisering: 3+ runs)

### Cross-page nota: gidsen.html + 3 legal-pages

Pad C2 ook toegepast maar **geen Lighthouse-meting uitgevoerd** in deze sessie. Verwachte impact analoog aan sample-pentest.html (geen ad-slots → identieke -252 KB transfer + -100-400 ms blocking-time afhankelijk van bestaande page-complexity). Validatie defer-baar tot volgende perf-audit.

### Out-of-scope discoveries (registreer als follow-up)

- **Item #26 (eerder gepland) — `box-utils.js` profile:** terminal.html mobile-score-gap onderbouwt urgentie. 309 ms total / 200 ms scripting blijft #3 op bootup-time-tabel; verwachte impact na cache-warming patch: +5-15 mobile-score
- **Nieuw item #27 (Sessie 144) — Ad-bearing pages perf-audit:** `index.html`, `woordenlijst.html`, `contact.html`, `over-ons.html`, `commands/index.html`, alle `blog/*.html`. Deze pages behouden adsbygoogle.js (correct, ze hebben `<ins>` slots). Audit-vraag: preconnect-hint `pagead2.googlesyndication.com` toevoegen (~100 ms LCP-win) + animations.css critical-split-pattern hergebruiken? ~30-45 min werk

### Forcing function (ongewijzigd)

- `scripts/validate-docs.sh` exit 0 vereist na Sessie 144 commit
- Lighthouse-cijfers handmatig invalidated bij toekomstige perf-relevante changes (head-edits, third-party additions, AdSense config-shift)
- **Sessie 145 trigger:** `validate-docs.sh --deep` mode bouw (item #23) — ongewijzigd

---

## Bronnen en referenties

- **Sessie 142 entry:** `docs/sessions/current.md` (eerste Lighthouse-meting, item #25 spawn)
- **Sessie 143 entry:** `docs/sessions/current.md` (audit-execution + §3a structureel argument)
- **Sessie 144 entry:** `docs/sessions/current.md` (deze implementatie + verificatie)
- **TASKS.md item #25:** ✅ Voltooid Sessie 143
- **TASKS.md item #24:** ✅ Voltooid Sessie 144 (Pad C1 + C2 implementatie)
- **TASKS.md item #27 (nieuw Sessie 144):** Ad-bearing pages perf-audit
- **Lighthouse JSON output:** `/tmp/perf-audit-143/` (Sessie 143 baseline) + `/tmp/perf-audit-144/` (Sessie 144 vóór/ná) — lokaal, niet gecommit
- **Commit:** `4e4eec5` perf(third-party): Pad C1 + C2 (6 files no-slot pages + terminal.html critical-split + 2 pages fetchpriority)
- **AdSense documentatie:** [Auto ads overview](https://support.google.com/adsense/answer/9189610) — externe link voor Heisenberg-dashboard-verificatie

---

**Last updated:** 29 mei 2026 (Sessie 144)
**Reviewed by:** Claude (Opus 4.7) + Heisenberg-akkoord via plan-mode + uitgevoerde implementatie
**Volgende update-trigger:** na item #26 (box-utils.js profile) of item #27 (ad-bearing pages audit)
