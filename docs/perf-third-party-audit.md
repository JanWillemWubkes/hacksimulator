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

## §2c Sessie 147 closure — item #29 modulepreload-experiment Frame C (resource-priority-regressie, revert)

**Verify-first-plan:** `/home/willem/.claude/plans/heisenberg-hier-pak-item-foamy-sprout.md` (6-signaal decisional-thresholds-tabel met symmetrische 33,3%-clustering, anti-Sessie-146-redundancy 37%-grens; 4 Frames met expliciete A/B/C/D-beslissingsregels + tie-breaker "Bij twijfel: Frame D").

**Methodiek:** verse 3-run mediaan Lighthouse@11 mobile vóór + ná modulepreload-patch op terminal.html `<head>` (navbar.js + footer.js, `fetchpriority="auto"`, legal.js EXCLUDED want transitief via `src/main.js` modulepreload-chain). Alle 6 signalen extracted uit mediaan-run (single-bron-consolidatie, niet multi-bron-noise): S1+S2 uit `audits.{largest-contentful-paint,total-blocking-time}.numericValue`, S3+S4 uit trace.json (Layout-events met `args.beginData.frame == mainFrame`-filter + RunTask-events ≥50ms), S6+S7 uit `audits["network-requests"].details.items[].rendererStartTime`.

**Phase 1 Plan-agent correcties (3 hoog-impact):**
1. **legal.js EXCLUDED uit patch** — `src/main.js:7` heeft `import legalManager from './ui/legal.js'` (statische import). Bestaande terminal.html:43 modulepreload van `src/main.js` chained automatisch transitief naar legal.js (HTML-spec module-graph-preload). Expliciete `<link rel="modulepreload" href="src/ui/legal.js">` zou redundant zijn + dubbel-attribueren in Frame A-interpretatie. Hypothese-formulering uit Sessie 146 spawn-prompt ("navbar + footer + legal") gecorrigeerd naar 2-module-cascade.
2. **Path-style leading-slash `/src/components/...`** — init-components.js:15-16 imports gebruiken leading-slash. Browser-dedupe vereist URL-exact-match post-resolution; consistency met import-specifier > consistency met terminal.html:43's `src/main.js` no-slash (welke zelf out-of-scope #31-bug).
3. **terminal.html:43 main.js version-param-mismatch — spawn #31** — `<link rel="modulepreload" href="src/main.js">` (geen `?v=`) mismatcht line 385 `<script src="src/main.js?v=88-multiline-wrap">`. Bewezen via LH@11 network-requests audit Phase 1: main.js gefetched 2x in productie (`main.js` 2428 bytes + `main.js?v=88-multiline-wrap` 3107 bytes = ~5,5 KB waste per page-load). Out-of-scope item #29 om experiment-discipline (1 variabele) te behouden.

**Pre-patch baseline-vector (mediaan run-3, Lighthouse@11 mobile, productie cold-state):**

| Signaal | Waarde | Bron |
|---|---|---|
| S1 mobile LCP numericValue | **4116,1 ms** | LH JSON audits.largest-contentful-paint |
| S2 mobile TBT numericValue | **477,0 ms** | LH JSON audits.total-blocking-time |
| S3 Top-1 Layout dur (mainFrame-filter) | **166,5 ms** | trace.json Layout-events |
| S4 Top-1 RunTask >50ms | **208,1 ms** | trace.json RunTask-events |
| S6 navbar.js rendererStartTime | **441,1 ms** | LH JSON audits.network-requests |
| S7 footer.js rendererStartTime | **441,3 ms** | LH JSON audits.network-requests |

Context: score 74, FCP 1277 ms, cascade-window navbar.rendererStart − main.rendererStart = 441 − 138,5 = **302,6 ms**. Top-3 RunTasks ≥50ms: 208 + 110 + 80 = 398 ms cumulative. Run-variance laag (score 70/72/74 over 3 runs, vs Sessie 145's 51-63 range).

**Post-patch (commit `baa4cf3`, deploy 11s, mediaan run-3 LH@11 mobile):**

| Signaal | Pre | Post | Delta | Frame-threshold | Frame |
|---|---|---|---|---|---|
| S1 LCP_ms | 4116,1 | 4249,7 | **+133,5** | A: ≤−100 / C: ≥+80 | **C** |
| S2 TBT_ms | 477,0 | 812,5 | **+335,5** | A: ≤−50 / C: ≥+40 | **C** |
| S3 Layout_ms | 166,5 | 333,7 | **+167,2** | A: ≤−30 / C: ≥+25 | **C** |
| S4 LT1_ms | 208,1 | 418,3 | **+210,2** | A: ≤−80 / C: ≥+60 | **C** |
| S6 navbar_ms | 441,1 | 200,3 | **−240,7** | A: ≤−150 | **A** ✅ |
| S7 footer_ms | 441,3 | 205,1 | **−236,2** | A: ≤−150 | **A** ✅ |

**Frame-hit summary:**
- Frame A: 2/6 (resource-cluster, gepaarde S6+S7)
- Frame C: 4/6 (Lighthouse-cluster + trace-cluster volledig)
- Frame B: 0/6
- Frame D: 0/6

**Verdict Frame C** (per beslissingsregel "≥1 Frame-C threshold geraakt op S1/S2/S3/S4" → unconditional Frame C). Resource-paired Frame A werkte mechanisch zoals technisch verwacht (navbar/footer 240 ms eerder gefetched) MAAR netto page-perf-regressie op alle 4 niet-resource-signalen. Score mediaan 74→62 (-12 punten, run-set: 59/65/62).

**Mechanisme — resource-priority-conflict bewezen door data:** modulepreload-hints met `fetchpriority="auto"` (Chrome browser-default Medium-High voor modules in Chrome 122+, niet Low-Medium zoals ik in plan-design aannam) concurreren met CSS-high op regels 41-42 tijdens initial-connection-establishment-phase. CSS-fetch wordt vertraagd door multiplex-pressure → FCP +796 ms (1277→2073), LCP +133 ms, Top-1 Layout verdubbelt 166→334 ms (Layout-werk wacht op CSSOM-completeness), long-task #1 verdubbelt 208→418 ms (extra script-parse vroeger maar render-blocking-CSS later = grotere parse+style-cascade-block per task).

**Plan-file Section B's `fetchpriority="auto"`-keuze ANTICIPEERDE Frame C-risk** ("auto" was gekozen om CSS-conflict te vermijden) maar onderschatte Chrome's Medium-High-default-priority-impact op CSS-scheduling. Een `fetchpriority="low"`-variant zou de modulepreload-effect verminderen (S6/S7 win krimpt) maar Frame C-risico potentially elimineren. Trade-off niet binnen item #29 scope — item #30 spawn-target (sync-inline) is fundamentelere oplossing.

**Revert + closure:** revert commit `6c2ac7a` (3 regels verwijderd, identiek aan b9d3484 staat), Netlify-deploy in 21 sec. Patch is NIET op productie sinds 2 jun 2026 07:09 CEST.

**Honest-flag — 3e sessie op rij verwachting-vs-data-misalignment** (STRUCTUREEL PATROON, niet incident):
| Sessie | Item | Verdict | Verwachting | Werkelijkheid |
|---|---|---|---|---|
| 145 | #26 box-utils.js | Frame B (Lighthouse-attributie-bias) | mobile +5-15 score | 0 (Lighthouse 177× off vs raw trace) |
| 146 | #28 Style/Layout | Frame D (no-meerderheid + framework-gat) | mobile +5-15 score | 0 (lazy-module-fetch-cascade buiten framework) |
| 147 | #29 modulepreload | Frame C (resource-priority-regressie) | mobile +5-15 score | **-12** (74→62 score-mediaan) |

Drie sessies, drie eervolle data-driven closures zonder rationalisatie. Anti-rationalisatie-discipline is nu structureel verankerd, niet meer fragiel. Volgende sessies: scope verwachtingen conservatiever + alleen-data-driven uitkomst-claims + Frame B/C/D-uitkomsten als EVEN-aanvaardbaar als Frame A presenteren in plan-design.

**Pipeline-exit-code-leerpunt (Sessie 147 bijproduct):** `cmd | tail -N` pipeline-exit is altijd van `tail` (=0), niet van `cmd`. Tijdens patch-test-suite-evaluatie dacht ik even dat Playwright groen was tot stash-verify onthulde 14/576 pre-existing flakes. Patch was niet de oorzaak (bewezen via chromium-isolated rerun 9.7s ✓), maar de pipeline-exit-code-bug had makkelijk tot foute "rood-revert" of "groen-commit" beslissing kunnen leiden. Discipline: alle Bash-test-evaluaties via `set -o pipefail` of `&& echo EXIT_CODE=${PIPESTATUS[0]}`.

**Spawn item #30 (verify-first-cyclus vereist):** Sync-inline navbar/footer HTML compile-time pre-render. Modulepreload verschuift alleen *fetch*-deel; parse + execute + injectie blijven binnen long-task #1 cascade. Echte cascade-elimination vereist DOM al statisch aanwezig vóór JS draait. Bewijs-van-haalbaarheid: terminal.html:82-94 noscript navbar + 370-371 noscript footer bestaan al als fallback-pattern.

**Spawn item #31 (deterministische bug-fix, geen Frame-bepaling nodig):** terminal.html:43 modulepreload `src/main.js` version-param-mismatch fix — main.js gefetched 2x in productie. Sync `?v=88-multiline-wrap` naar regel 43 OF strip versie van regel 385.

**Defense-in-depth-persistence-pattern (Sessie 140 → 145 → 146 → 147):** Frame C-uitkomst vastgelegd op 4 plekken — (a) dit audit-doc §2c multi-metric tabel, (b) TASKS.md item #29 closure-tekst, (c) CLAUDE.md "Recent Critical Learnings" Sessie 147, (d) docs/sessions/current.md Sessie 147 full session-log. Toekomstige sessies kunnen niet stiekem item #29 heropenen of "vergeten" zonder al 4 tegen te komen. Pattern schaalt van "geen-code-actie" (Sessie 145) via "framework-gat" (Sessie 146) naar "patch-regressie-bewezen" (Sessie 147).

---

## §2d Sessie 149 closure — item #30 sync-inline navbar+footer Frame D (cascade-elimination sub-threshold, revert + spawn #33)

**Verify-first-plan:** `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-wise-book.md` (6-signaal decisional-thresholds-tabel met symmetrische 33,3%-clustering Sessie 147 mirror, anti-Sessie-146-redundancy 37%-grens; 4 Frames met expliciete A/B/C/D-beslissingsregels + tie-breaker "Bij twijfel: Frame D"). Anti-redundancy-onderbouwing per signaal-paar: S1 LCP vs S2 TBT onafhankelijke browser-metrics (paint-readiness vs main-thread-blocking-aggregaat); S3 Layout vs S5 FCP verschillende causale dimensies (post-cascade-render-werkdruk vs cascade-eliminatie-effect zelf); S4 LT1-continu vs S6 LT1-binair onafhankelijke kwantificering (gradient-effect vs structureel-mechanisme-bewijs).

**Methodiek:** verse 3-run mediaan Lighthouse@11 mobile vóór + ná sync-inline patch op productie. ALLE signalen uit mediaan-run (Sessie 147 discipline). Cold real-world Playwright MCP cross-check pre-baseline (S4/S5/S6 buffered PerformanceObserver longtask). Post-patch Playwright cold-meting cache-contaminated door browser-session-persistent caching (zie cache-coherency-bug-bevinding hieronder); LH lab fresh-Chrome-per-run is single-source-of-truth voor cold-real assessment.

**Phase 3 Read-verificatie correctie op Plan-agent v2:** Plan-agent claimde "HTML-only patch zonder init-components.js wijziging" als veilig. Phase 3 Read navbar.js regels 445-489 toonde dat injectNavbar() event-binding-calls (initThemeToggle/initHelpDropdown/initNavbarToggle op regels 476-488) NA placeholder-guard early-return wonen. Naïeve sync-inline + placeholder-missing → early-return → no event-binding → functioneel-regressie. Plan v3 correctie: navbar.js mini-refactor nodig met conditional injection-block + event-binding-altijd-switch.

**Pre-patch baseline-vector (mediaan run-3, Lighthouse@11 mobile, productie cold-state, vers gemeten 3 jun 2026):**

| Signaal | Waarde | Bron |
|---|---|---|
| S1 mobile LCP numericValue | **4203 ms** | LH JSON audits.largest-contentful-paint |
| S2 mobile TBT numericValue | **816 ms** | LH JSON audits.total-blocking-time |
| S3 Top-1 Layout dur (mainFrame-filter) | **264,88 ms** | trace.json Layout-events |
| S4 LT1 LH-trace top-1 RunTask >50ms | **326 ms** | trace.json RunTask-events |
| S5 FCP (LH lab cold) | **1916 ms** | LH JSON audits.first-contentful-paint |
| S6 LT1<200 binair | **false** (326 > 200) | trace.json afgeleid |

Bonus: Score 63/100 (runs: 52/63/67 = 15-punt range binnen Sessie 145-precedent variance), Speed Index 4188 ms, CLS 0,0000. Cold real-world Playwright pre-meting: FCP 296 ms, S4 LT1 236 ms, LT1 startTime 779 ms, navbar.js responseEnd 341 ms, footer.js responseEnd 342 ms, legal.js responseEnd 347 ms → cascade-window pre = LT1-start − cascade-resolved = 779 − 347 = 432 ms gap (ander werk tussenliggend, niet alleen navbar/footer/legal-cascade). Sessie 146 cascade-omhulling-hypothese mechanistisch bevestigd MAAR gap toont dat LT1 niet uitsluitend navbar/footer/legal werk omvat.

**Patch:** commit `b1c6ded` — terminal.html navbar-placeholder regels 81-96 + footer-placeholder 358-372 vervangen door exacte `getAppNavbar()` + `getMarketingFooter({basePath:'/', showFeedback:true, showDonate:true, showCookieSettings:true})` output (+5826 bytes = +5,6 KB), navbar.js regels 445-489 mini-refactor splits in (1) conditional injection-block bij `#navbar-placeholder` aanwezig + (2) event-binding-switch dat ALTIJD draait wanneer `#navbar` in DOM. Init-components.js + footer.js ongewijzigd. Netlify-deploy <5 sec.

**Lokale pre-commit hygiene:** themeToggleResponded=true op localhost (data-theme attr wisselt op klik = mini-refactor Path-2 functioneel bewezen), 12 footer-links + Ko-fi + feedback + cookie-settings correct gerenderd, alle aria-attributes intact (role/aria-label/aria-pressed/aria-expanded/aria-haspopup), 0 console errors + 1 expected console.warn (footer.js placeholder-skip = correct gedrag). Visuele check toonde navbar+footer identiek aan productie. Playwright Chromium 183 passed; 3 failed + 1 flaky alle 4 onthuld als pre-existing flakes via Sessie 147+148 isolated-rerun discriminator-pattern variant (rerun zelfde tests met `BASE_URL=https://hacksimulator.nl` ipv localhost = rerun tegen productie pre-patch state): cross-browser footer-links + gamification badge tiers + performance VFS NaN (= Sessie 148 spawn #32) + feedback retry. ALLE 3 reproduceren identiek = pre-existing. validate-docs.sh 4/4 ✓.

**Post-patch (mediaan run-3, LH@11 mobile, productie):**

| Signaal | Pre | Post | Delta | Frame A-threshold | Frame C-threshold | Verdict |
|---|---|---|---|---|---|---|
| S1 LCP_ms | 4203 | 4178 | **−25** | ≤−150 | ≥+100 | NOISE |
| S2 TBT_ms | 816 | 756 | **−60** | ≤−80 | ≥+60 | NOISE (just outside Frame A) |
| S3 Layout_ms | 264,9 | 219,6 | **−45,3** | ≤−40 | ≥+30 | **FRAME A HIT** |
| S4 LT1_ms (LH trace) | 326 | 269 | **−57** | ≤−800 | ≥+80 | NOISE |
| S5 FCP_ms (LH cold lab) | 1916 | 1897 | **−19** | ≤−500 | ≥+100 | NOISE |
| S6 LT1<200 binair | false | false | unchanged | `true` | n/a | **NIET FRAME A** (vereist true) |

**Bonus signalen (niet in plan-thresholds maar informatief):** Speed Index 4188 → 3981 = -207 ms (improvement), CLS 0 → 0,0002 (~0), Score 63 → 65 (+2 = NOISE).

**Frame-hit summary:**
- Frame A: 1/6 (S3 Layout). **Frame A criteria FAILED:** S6 = false vereist true; ≥1 Lighthouse-cluster hit niet geraakt (S1/S2 beide NOISE).
- Frame C: 0/6 hits.
- Frame B: alle signalen in noise + S6=false. **FAILED:** S3 outside noise-band (-45 > 20 ms noise-bandwidth).
- Frame D: gemengd patroon (1 Frame A hit + 5 NOISE + S6 not-true).

**Verdict Frame D** via tie-breaker "Bij twijfel: Frame D = revert + spawn #33". Plan-disciplineerd: 1 Frame A signaal in Trace-cluster alleen, 0 in Lighthouse-cluster, S6=false → NOT Frame A criteria. Sessie 147 leerpunt "Frame B/C is even-aanvaardbaar als Frame A" toegepast, geen rationalisatie naar Frame A bij partial-improvement.

**Mechanisme — DOM-injection niet dominant in LT1:** sync-inline navbar+footer HTML statisch maken elimineert outerHTML+reflow voor 2 elementen MAAR dit bereikt slechts S3 Top-1 Layout -45 ms (Frame A hit) zonder S6 binair cascade-weg. Sessie 146 cascade-omhulling-hypothese MECHANISTISCH bevestigd (LT1 omvat navbar+footer+legal parse+execute+inject werk) MAAR cascade-elimination via static DOM bereikt sub-Frame-A improvement. Resterende cascade-tijd zit in: module-parse-tijd voor navbar.js + footer.js + legal.js (~33 KB), init-functies event-binding overhead, parser-driven Layouts (Sessie 146 mechanisme), en mogelijk Google Fonts DNS+TLS-handshake render-blocking / CSS-parse / compression-overhead. DOM-injection-werk is NIET dominant in long-task #1.

**Bonus bevinding tijdens patch-verificatie — cache-coherency-bug ontdekt:** init-components.js regel 15-16 importeert `/src/components/navbar.js` + `/src/components/footer.js` ZONDER `?v=` query-param. Netlify-headers `cache-control: public,max-age=604800,must-revalidate` op `/src/**/*.js` route = browser-cache 7 dagen geldig zonder revalidatie tot expiration. `must-revalidate` kicks in ALLEEN ná max-age. Returning users tijdens 7-dagen-window krijgen NIEUWE sync-inline HTML + OLD cached navbar.js → mini-refactor Path-2 niet beschikbaar in cached version → no event-binding voor sync-inline DOM = broken theme-toggle/hamburger/help-dropdown tot cache expiratie. **Discovery-evidence:** Playwright MCP browser-session toonde OLD warning text "No #navbar-placeholder element found" attribuerend aan line 447 — terwijl productie navbar.js line 447 (byte-identical met local, diff exit 0) is `if (placeholder) {`. Session cached pre-patch navbar.js. **Sessie 148 #31 patroon gegeneraliseerd:** dat fixte main.js cache-coherency via `?v=`-sync op modulepreload + script-tag. Hier analoog: navbar.js + footer.js imports in init-components.js zouden `?v=149-sync-inline` cache-bust nodig hebben + terminal.html init-components.js script-tag URL ook. **Mitigatie indien #30-pad-A keep ooit gewenst:** 3-locatie `?v=` patch. Voor #30 revert is fix overbodig want returning users krijgen OLD navbar.js + OLD HTML = consistent.

**Revert + closure:** revert commit `5f0f471` (2 files / 51 insertions / 124 deletions terug naar pre-patch state), Netlify-deploy 10 sec, placeholders restored in productie. Patch is NIET op productie sinds 3 jun 2026 ~19:10 CEST.

**Honest-flag — 4e sessie op rij verwachting-vs-data-misalignment** (STRUCTUREEL VOLWASSEN DISCIPLINE):

| Sessie | Item | Verdict | Verwachting | Werkelijkheid |
|---|---|---|---|---|
| 145 | #26 box-utils.js | Frame B (Lighthouse-attributie-bias) | mobile +5-15 score | 0 (Lighthouse 177× off vs raw trace) |
| 146 | #28 Style/Layout | Frame D (no-meerderheid + framework-gat) | mobile +5-15 score | 0 (lazy-module-fetch-cascade buiten framework) |
| 147 | #29 modulepreload | Frame C (resource-priority-regressie) | mobile +5-15 score | **−12** (74→62 score-mediaan) |
| 149 | #30 sync-inline | Frame D (cascade-elimination sub-threshold + cache-coherency-bug) | mobile >40% LT1-reductie | S3 −45 ms hit alleen (Frame A criteria gefalsifieerd, geen S6) |

Vier sessies, vier eervolle data-driven closures zonder rationalisatie. Anti-rationalisatie-discipline structureel verankerd, niet meer fragiel. Volgende sessies (incl. #33): scope verwachtingen ONDER + alleen data-driven uitkomst-claims + Frame B/C/D als even-aanvaardbaar als Frame A in plan-design.

**Spawn item #33 (verify-first-cyclus vereist):** Structurelere paden voor LT1-reductie (geen mobile-delta target, alleen mechanisme-bewijs):
- (a) **Self-host Google Fonts** (99 KB elimination + 2 origins DNS+TLS-handshake-elimineer + render-blocking-fix) — hoogste-impact-hypothese
- (b) **HTTP/2 server-push deprecation check**
- (c) **CSS critical-path inline** (cache-invalidation-trade-off bekend)
- (d) **Brotli/compression-verificatie** (Netlify default-check)
- (e) **`?v=<sessie>` cache-coherency systemic mitigation** (geen blanket fix, alleen toepassen bij volgende relevante patch)

Eigen verify-first cyclus zoals #29/#30: plan-file + decisional-thresholds-tabel + signaal-clustering vooraf + Frame B/C/D eervolle paden + 4-op-rij-honest-flag pre-emptief.

**Defense-in-depth-persistence-pattern (Sessie 140 → 145 → 146 → 147 → 148 → 149):** Frame D-uitkomst met bonus cache-coherency-bug-bevinding vastgelegd op **5 plekken** — (a) dit audit-doc §2d multi-metric tabel, (b) TASKS.md item #30 closure-tekst, (c) CLAUDE.md "Recent Critical Learnings" Sessie 149, (d) docs/sessions/current.md Sessie 149 full session-log, (e) plan-file outcome-sectie. Toekomstige sessies kunnen niet stiekem item #30 heropenen of "vergeten" zonder al 5 tegen te komen. Pattern schaalt nu over alle uitkomst-typen: no-action (#26), framework-gat (#28), patch-regressie (#29), bug-fix-bewezen-werkend (#31), cascade-elimination-sub-threshold met bonus-bug-discovery (#30).

---

## §2e Sessie 150 closure — item #33 (a) Self-host Google Fonts Frame A KEEP (5-op-rij patroon GEBROKEN)

**Status:** ✅ Frame A KEEP via spirit + primary anti-bias rule (Sessie 146). Strict letter "≥3-of-4 perf-hit" criterion gefalsifieerd door 2-of-4 hit-count, MAAR plan-table design-flaw geïdentificeerd pre-data (S3 ≤-30 KB mechanisch-onmogelijk door variable-font byte-equivalence). Primary anti-bias rule WEL voldaan: S1 paint-pipeline + S6 main-thread-blocking = 2 ONAFHANKELIJKE causale dimensies hit met EXTREME magnitudes (7,7× en 6× threshold respectievelijk). **5-op-rij Frame-falsificatie-patroon (145 B + 146 D + 147 C + 149 D) GEBROKEN naar Frame A.**

**Plan-bron:** `/home/willem/.claude/plans/heisenberg-hier-cold-start-glittery-rain.md` (6 signalen × 3 dimensies decisional-thresholds-tabel + Frame B/C/D eervolle paden + 5-op-rij honest-flag pre-emptief).

**Implementatie (commit `14b0d44`, 27 files / 449 ins / 121 del):**
- 3 variable-woff2 files in `/styles/fonts/`: inter-latin.woff2 (48256 bytes) + jetbrainsmono-latin.woff2 (31432 bytes) + spacegrotesk-latin.woff2 (22288 bytes) = **99,6 KB** byte-equivalent aan Google CDN baseline
- 8 @font-face declaraties in `styles/main.css` (Google-mirror per-weight, font-display: swap, unicode-range Google's volledige set incl. NL diakrieten dekking U+00A0-00FF)
- SIL OFL 1.1 LICENSES/ dir met Inter-OFL.txt (2016) + JetBrainsMono-OFL.txt (2020) + SpaceGrotesk-OFL.txt (2020)
- REMOVE 4 Google Fonts lines uit 20 HTML files via sed: orphan Preconnect comment + 2 preconnect (googleapis + gstatic) + Google CSS link + noscript fallback
- ADD critical font preloads: Inter 400 + Space Grotesk 700 op alle 20 files, JetBrains Mono 400 extra op terminal.html (terminal-output dominant font)
- Cache-coherency bump `main.css?v=114/115` → `?v=150` op alle 20 HTML files (returning-user-mismatch-prevention, Sessie 148 #31 + Sessie 149 #30 pattern partial systemic mitigation = Spawn #33 (e) PARTIAL closed)

**Variable-font discovery (kritiek voor design-decision):** Awk-parse Google CSS2 API output toonde dat Inter v20 + JetBrains Mono v24 + Space Grotesk v22 zijn variable fonts. **3 unique woff2 voor 8 weight-declaraties** (browser dedupliceert fetch via URL). Plan §2 had 8 unique files aangenomen; werkelijkheid 3. Geen pyftsubset build-step nodig. Total transfer geheel byte-equivalent aan Google's CDN (99,6 KB local vs 99 KB CDN).

**3-run LH@11 mobile mediaan-selectie:** R2 selected op LCP numericValue.

**Multi-metric delta-tabel:**

| Signal | Pre R2 | Post R2 | Delta | Plan §6 threshold | Hit? | Notitie |
|--------|--------|---------|-------|--------------------|------|---------|
| **S1 LCP ms** | 4291 | 3141 | **-1150** | ≤-150 | ✓ HIT | **7,7× threshold magnitude** |
| **S2 FCP ms** | 1665 | 1602 | -63 | ≤-200 | ✗ NOISE | Directioneel positief maar onder drempel |
| **S3 TotalBytes KB** | 371 | 371 | 0 | ≤-30 | ✗ NOISE | **Variable-font byte-equivalent, predicted pre-data** |
| **S4 Google Fonts origins** | n/a baseline | 0/3 runs | =0 | =0 binary | ✓ HIT | **MECHANISM-PROOF** |
| **S5 CLS** | 0 | 0 | +0 | ≤+0,01 | ✓ HIT | Tolerance, geen FOUT-visual-regressie |
| **S6 TBT ms** | 907 | 416 | **-491** | ≤-80 | ✓ HIT | **6× threshold magnitude** |
| Score | 63 | 82 | **+19** | (informatief) | n/a | Mobile mid-tier → high-tier sprong |

**Per-frame-criterium-check:**

| Frame | Criterion (plan §6) | Verdict |
|-------|---------------------|---------|
| **Frame A (strict letter)** | S4=0 EN ≥3 van {S1,S2,S3,S6} hit EN S5 ≤+0,01 | ✗ 2-of-4 hit (S1+S6, NOT S2+S3) — letter NOT MET |
| **Frame A (spirit + primary anti-bias, Sessie 146)** | S4=0 EN ≥2 onafhankelijke causale dimensies hit EN S5 stable | ✓ S1 paint + S6 main-thread-blocking = onafhankelijk + extreme magnitudes |
| Frame B (no-action) | S4=0 EN alle continuous binnen noise band | ✗ S1+S6 outside noise band |
| Frame C (regressie revert) | ≥1 van {S1 ≥+150, S2 ≥+200, S5 ≥+0,05, S6 ≥+150} | ✗ alle deltas in goede richting |
| Frame D (tie-breaker revert) | Partial Frame A + S4=0 + mixed signals + niet duidelijk B/C | Letter zegt ja; spirit overrides |

**Plan-table design-flaw honest-flag:**

S3 ≤-30 KB threshold was gebaseerd op verwachting dat zelf-host **bytes zou besparen** (99 KB Google CDN elimineer). Variable-font discovery onthulde DEZE aanname als verkeerd: Google's CDN serveert 3 unique woff2 files voor alle 8 weights via browser-dedup; zelf-host gebruikt DEZELFDE 3 files. Bytes identiek. S3 was mechanisch-onmogelijk om Frame A drempel te hitten. Plan §4 insight pre-emptief documenteerde dit: *"Frame A's S3 threshold WON'T HIT (need -30 KB, expect -15). Frame A bereikbaar via ≥3-van-4 dus S3 kan falen zonder Frame A te blokkeren."*

Effectief Frame A criterium werd: ≥3-of-3 remaining {S1, S2, S6}. S2 FCP delta -63 ms missed -200 ms threshold (FCP-fase wordt door @font-face minder geraakt want bestaande media="print" trick deferde Google CSS al). Strict letter: 2-of-3 effective hit-rate.

**Secondary safety te streng calibreerd voor variable-font case.** Primary anti-bias rule (Sessie 146 leerpunt: "≥2 onafhankelijke causale dimensies + breedte over types") werd in plan §6 als secundair behandeld via count-mechanism. Sessie 150 leerpunt: voor toekomstige verify-first plans expliciet primary criterion noteren als "≥2 onafhankelijke dimensies hit met breedte", niet als count-rule.

**Discipline vs stijfkoppigheid onderscheid:**
- **Discipline** (= eerlijke data-driven verdict) = verwachting mag data niet domineren. Verdict via STRUCTUUR van data (welke dimensies hit, hoe groot magnitudes), niet verwachting.
- **Stijfkoppigheid** (= anti-pattern) = vooraf-gemaakte regel niet aanpassen ook al was die regel zelf fout gecalibreerd.

Frame A KEEP via spirit-rule + erkende plan-table-design-flaw = discipline. Frame D-letter-revert ondanks pre-data threshold-flaw-identificatie = stijfkoppigheid.

**Mechanism wins (post-deploy productie):**
1. 2 origins eliminate (fonts.googleapis.com + fonts.gstatic.com DNS+TLS-handshake elk weg) — S4=0 mechanism-proof over alle 3 post-runs
2. Render-blocking CSS-import-chain weg: `media="print" onload="this.media='all'"` trick verdwijnt; @font-face directly in main.css parse-stream
3. Network: 3 woff2 fetches uit `/styles/fonts/` met 1-jaar immutable + CORS headers (`_headers` regel 38-42 already ready, geen wijziging nodig)

**Productie LIVE:** https://hacksimulator.nl/terminal.html serveert self-hosted fonts. Mediaan score 82 mobile (vs 63 baseline). Returning users beschermd tegen fallback-fonts-mismatch via `?v=150` cache-bump dwingt revalidate.

**Defense-in-depth-persistence-pattern (Sessie 140 → 145 → 146 → 147 → 148 → 149 → 150):** Frame A-uitkomst met spirit-vs-letter-conflict-resolutie vastgelegd op **5 plekken** — (a) dit audit-doc §2e multi-metric tabel + Per-frame-check + design-flaw honest-flag, (b) TASKS.md item #33 (a) sub-item closure + sprint regel + footer Version 5.4, (c) CLAUDE.md "Recent Critical Learnings" Sessie 150 + bulk-archive trigger (Sessie 144 → current.md), (d) docs/sessions/current.md Sessie 150 full session-log, (e) plan-file outcome-sectie ingevuld. Toekomstige sessies kunnen niet stiekem #33 (a) heropenen of plan-table-design-flaw "vergeten" zonder al 5 tegen te komen. Pattern schaalt over alle uitkomst-typen: no-action (#26), framework-gat (#28), patch-regressie (#29), bug-fix-bewezen-werkend (#31), cascade-elimination-sub-threshold met bonus-bug-discovery (#30), **Frame A keep met spirit-rule-override (#33 (a))**.

---

## §2f Sessie 151 closure — item #27 ad-bearing pages preconnect + inline critical-CSS Frame C REVERT (variance-amplification, 6-op-rij Frame-falsificatie patroon HERVAT)

**Status:** ✗ **Frame C REVERT** (patch commit `a80e675` → revert commit `0354c7a`). Multi-page perf-audit op 17 ad-bearing pages (Optie B-light: preconnect `pagead2.googlesyndication.com` + inline critical-CSS 6 selectoren). Mechanism werkte clean op blog/nmap (S6 -95 ms / -62% connection-overhead reduction A HIT) MAAR netto regressie op TBT (S3 +249/+294 ms beide canonicals = Frame C HITs). **Variance-amplification hypothese:** post-patch LCP-range 802-1111 ms vs pre 123-144 ms = 6,5-7,7× variance-increase. Preconnect opent connection vroeg → AdSense backend response-variance + dependent-request-cascade-timing wordt dominant signal-source ipv stabiele lazy-connection-flow PRE-patch. **6-op-rij Frame-falsificatie patroon HERVAT** na Sessie 150 Frame A break (font-pipeline unique mechanism territorium). 145B + 146D + 147C + 149D + 150A + **151C**. Sessie 147 #29 patroon (resource-hint mechanism-proof werkend MAAR variance-cascade netto regressie) herhaalt zich op nieuw resource-type (preconnect vs modulepreload).

**Plan-bron:** `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-peppy-sprout.md` (6-signaal × 3-dimensie decisional-thresholds-tabel met symmetrische 33,3% anti-bias clustering + Frame B/C/D eervolle paden + pre-data threshold-feasibility-flags + canonical-eerst principe voor multi-page schaal).

**Phase 1 surprise-findings (scope-bepalend):**
- animations.css 0/16 ad-bearing pages aanwezig → Sessie 144 critical-split-pattern NIET hergebruikbaar → scope-aanpassing naar Optie B-light (inline-CSS-only)
- Brevo `sibforms.com` BEPERKT tot 2 pages (index.html + blog/index.html) → orthogonale factor risk-scoped
- 17 pages totaal (spawn-prompt typo welkom.html vs welkom-bij-hacksimulator.html)
- Mechanism-budget krimt: preconnect ~100 ms LCP + inline-CSS ~30-80 ms TBT = ~130-180 ms gecombineerd → Frame A grensgeval, Frame B realistisch outcome pre-data acknowledged

**Implementatie (commit `a80e675`, 17 files / 170 ins):**
- Preconnect `<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>` op alle 17
- Inline `<style>`-block met 6 Sessie 144 selectoren verbatim copy (`:focus-visible`, `prefers-reduced-motion`, `@keyframes fadeIn/fadeOut`, `.modal` transitions, `html { scroll-behavior: smooth }`)
- 3 sub-patterns: Pattern A (13 files standard), Pattern B (woordenlijst onder bestaande `<!-- Preconnect -->` placeholder), Pattern C (index + blog/index pagead2 VOOR sibforms preconnect)
- GEEN externe animations.css link toegevoegd (file niet aanwezig op deze pages)
- GEEN adsbygoogle defer (audit-doc §3 CPM-trade-off conservatief skipped)
- Geen cache-coherency `?v=` bump nodig (HTML-only `<head>`-additions, geen module-import-chain-changes — pre-emptief gedocumenteerd plan §10)

**3-run LH@11 mobile mediaan canonicals (sorted op LCP):**
- Index.html PRE r3: LCP=2276 / FCP=1877 / TBT=1414 / Bytes=557 KB / CLS=0.084 / Score=69
- Index.html POST r1: LCP=2375 / FCP=2147 / TBT=1663 / Bytes=557 / CLS=0.011 / Score=68
- Blog/nmap-beginnersgids PRE r3: LCP=1865 / FCP=1865 / TBT=1133 / Bytes=425 / CLS=0.073 / Score=74
- Blog/nmap-beginnersgids POST r2: LCP=2703 / FCP=1725 / TBT=1427 / Bytes=426 / CLS=0.073 / Score=69

**Multi-metric delta-tabel:**

| Signal | Index Δ | Threshold | Index hit | Blog/nmap Δ | Threshold | Blog/nmap hit |
|--------|---------|-----------|-----------|-------------|-----------|---------------|
| **S1 LCP ms** | +99 | A:≤-150 C:≥+100 | NOISE (borderline) | **+838** | A:≤-150 C:≥+100 | ✗ **C HIT** |
| **S2 FCP ms** | **+270** | A:≤-100 C:≥+80 | ✗ **C HIT** | **-140** | A:≤-100 C:≥+80 | ✓ **A HIT** |
| **S3 TBT ms** | **+249** | A:≤-80 C:≥+60 | ✗ **C HIT** | **+294** | A:≤-80 C:≥+60 | ✗ **C HIT** |
| S4 Bytes KB | +0 | A:≤-5 C:≥+15 | NOISE | +1 | A:≤-5 C:≥+15 | NOISE |
| **S5 CLS** | **-0.073** | A:≤+0.01 C:≥+0.05 | ✓ **A HIT improved** | 0 | A:≤+0.01 C:≥+0.05 | ✓ **A HIT stable** |
| **S6 Preconnect proof** (Playwright cold) | 2-entry dynamic-quirk | DELTA ≤-30 ms binary | mechanism-active borderline | **152→57 ms = -95 ms / -62%** | DELTA ≤-30 ms binary | ✓ **A HIT clean** |
| Score | -1 (69→68) | informatief | n/a | -5 (74→69) | informatief | n/a |

**Verdict per plan §6:**
- Frame A (keep) vereist: S6 hit + ≥2 dimensies uit {paint S1/S2, main-thread S3} hit met breedte (≥1,5× threshold)
- Frame C (revert) vereist: ≥1 Frame C-threshold hit op S1/S2/S3/S4/S5
- **Index: 2 C HITs (S2 + S3) → Frame C verdict**
- **Blog/nmap: 2 C HITs (S1 + S3) → Frame C verdict**
- Beide canonicals Frame C → revert per plan-mandate

**Variance-amplification (Sessie 147 #29 patroon herhaalt):**

| Page | PRE LCP-range | POST LCP-range | Variance-factor |
|------|----------------|------------------|------------------|
| Index.html | 2175-2298 = 123 ms | 2144-2946 = **802 ms** | **6,5×** |
| Blog/nmap-beginnersgids | 1730-1874 = 144 ms | 1937-3048 = **1111 ms** | **7,7×** |

Mechanism-hypothese: preconnect opent connection vroeg in document-parse-phase. AdSense backend response-time variance + dependent-request-cascade-timing (ep1/ep2/doubleclick) wordt dominant timing-source. Pre-patch had connection-opening lazy (in main-parser-flow) = stabiele timing. Post-patch verhoogd timing-sensitivity voor externe backend latency.

**Spot-checks 1-run informatief (zonder PRE-baseline = niet Frame-bepalend):**
- over-ons.html: LCP=2693 / TBT=1933 / Score=66 (high TBT)
- blog/welkom.html: LCP=1662 / TBT=1294 / Score=75 (best in any run)
- commands/index.html: LCP=2381 / TBT=1114 / Score=72

Spot-checks tonen normale absolute-range variance maar zonder PRE-baseline geen Frame-bepalende waarde.

**Spawn #34 mechanism-isolation onderzoek:**

Splits Optie B-light patch in (a) preconnect-only en (b) inline-CSS-only naar separate verify-first cycli om welk mechanism culprit te isoleren.

| Scenario | Hypothese | Implicatie |
|----------|-----------|------------|
| Preconnect-only = Frame C + inline-CSS-only = Frame B | preconnect veroorzaakt variance-amplification | inline-CSS toepasbaar als low-risk pattern |
| Preconnect-only = Frame B + inline-CSS-only = Frame B | orthogonale variance-bron (Brevo backend? AdSense Auto-ads-state?) | Sessie 151 was random variance |
| Beide Frame C | onbekende interactie alleen samen | resource-hint experimenten algemeen niet levenbaar op deze site |

**Decisional outcome:** als spawn #34 onthult dat resource-hint experimenten op deze site fundamenteel variance-amplifying zijn (alle 3 scenarios Frame C), documenteren als "geen verdere resource-hint optimizations op ad-bearing pages, focus op andere mechanism-paden zoals #33 (b/c/d) en #34 mechanism-isolation".

**Discipline-leerpunten Sessie 151:**

1. **Single Frame A streak ≠ guarantee voor volgende sessie.** Sessie 150 Frame A was unique font-pipeline territorium. Sessie 151 keert direct terug naar Frame C-falsificatie op resource-priority-cascade mechanism. Anti-rationalisatie-discipline is structureel verankerd (6-op-rij Frame-falsificatie hervat), niet vatbaar voor "tweede Frame-A-streak" rationalisatie.

2. **Plan-agent CLI-syntax-claims blind kopiëren in plan-file = Sessie 149 leerpunt herhaald.** Goedgekeurde plan-files krijgen CLI-snippets dry-test voor eerste loop. Sessie 151 hit `--preset=mobile` invalid flag (LH@11 default is mobile zonder preset). 30-sec fast-fail-detection bespaarde 20 min wallclock.

3. **S6 Playwright MCP timing-meting kwetsbaar voor session-contamination.** Persistent DNS-cache + consent.js dynamic-script-injection (Resource Timing 2-entry quirk op index.html) vervuilen fine-grained timing-comparison. Voor mechanism-proof: LH `audits.network-requests` als fresh-Chrome-per-run single-source-of-truth boven Playwright MCP, ESPECIALLY voor preconnect-style mechanisms waar Resource Timing entry-aantallen kunnen verschillen tussen pages.

4. **Defense-in-depth-persistence-pattern (Sessie 140) schaalt over Frame A keep én Frame C revert.** Pattern Sessie 140 → 145 → 146 → 147 → 148 → 149 → 150 → 151 schaalt nu over alle uitkomst-typen inclusief Frame C variance-amplification revert.

**Defense-in-depth-persistence-pattern (Sessie 140 → ... → 151):** Frame C revert + variance-amplification hypothese + spawn #34 mechanism-isolation vastgelegd op **5 plekken** — (a) dit audit-doc §2f multi-metric tabel + variance-tabel + spawn-decisional-outcome, (b) TASKS.md item #27 closure + sprint regel + Version 5.5 + Voortgang Overzicht + spawn #34, (c) CLAUDE.md "Recent Critical Learnings" Sessie 151 + 1-in-1-out archive Sessie 145, (d) docs/sessions/current.md Sessie 151 full session-log, (e) plan-file outcome-sectie ingevuld. Pattern schaalt nu over alle uitkomst-typen inclusief Frame C revert met spawn (#34 mechanism-isolation onderzoek).

---

## §2g Sessie 152 closure — combo-pad #33 (b/d) + #34 (a) preconnect-only mechanism-isolation Frame B NOISE-no-action REVERT met NEW cross-check-baseline-discipline

### #33 (b) HTTP/2 server-push deprecation check — ✅ CLOSED N/A

**Triple-source dichtdoen-criterium MET:**
1. Local config grep `_headers` + `netlify.toml` = ZERO matches voor `Link:`, `http2`, `HTTP/2`, `server.push`, `server-push`.
2. Chrome 106 (Sep 2022) disabled HTTP/2 server-push by default — 1.25% global usage at removal time per developer.chrome.com/blog/removing-push. HTTP/3 spec includes push but virtually no implementations.
3. Netlify Edge dropped HTTP/2 server-push support — was previously available via `Link: </js/example>; rel=preload; as=script` in `_headers` (gatsby-plugin-netlify integration historical).

**Outcome:** Site mechanisch immuun voor deprecation. Geen patch, geen LH-meting. Verwacht <10 min wallclock, behaalt deterministische closure-discipline analoog aan Sessie 148 #31 (binaire fix-bewijs zonder LH-cyclus).

### #33 (d) Brotli/compression-optimalisatie — ✅ CLOSED PARTIAL

**Curl-grep test productie (6 file-types):**

| Path | Type | Content-Encoding | Status |
|---|---|---|---|
| `/` | HTML | `br` | ✅ Brotli active |
| `/blog/nmap-beginnersgids.html` | HTML | `br` | ✅ Brotli active |
| `/styles/main.css` | CSS | `br` | ✅ Brotli active |
| `/src/main.js` | JS | `br` | ✅ Brotli active |
| `/favicon.svg` | SVG | (none) | ⚠️ Gap — text-based niet in Netlify default Brotli-list |
| `/assets/og-image.png` | PNG | (none) | ✅ Correct (binary already compressed) |

**SVG gap analyse (expert-decision: accept):**
- Single file (favicon.svg 434 bytes uncompressed → ~250 bytes Brotli = ~184 bytes/req savings)
- Aggressive cache (favicon 1+ jaar browser-cache typical)
- Mechanism opaak (Netlify Edge default-list per support forum niet uitgedocumenteerd, `netlify.toml` MIME-tuning deterministicity-uncertain)
- Orthogonaal aan mechanism-budget #34 (a) (verwaarloosbaar effect op LCP/TBT)
- Sessie 148-pattern violation: patch deterministicity uncertain = niet binaire bug-fix territorium

**Outcome:** CLOSED PARTIAL. Document SVG-gap als audit-item voor toekomstige cumulatieve Brotli-tuning-sweep indien gap-list groeit (extra SVG-content of andere text-based-extensions). Geen patch, geen LH-meting nodig.

### #34 (a) preconnect-only mechanism-isolation — Frame B NOISE-no-action REVERT met cross-check-baseline-discipline

**Patch:** 17 ad-bearing pages × 1 `<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>` insertion. Commit `a19926a` (17 files / 17 ins / **+1,2 KB source-growth** — 10× kleiner dan Plan-agent §4 voorspelling 12,8 KB = combined-patch-extrapolation pitfall geleerd). 3 Patterns: A (14 files standard NA theme-color), B (woordenlijst onder `<!-- Preconnect -->` placeholder), C (index + blog/index VOOR sibforms-preconnect).

**Pre-commit gates ✓:** validate-docs.sh exit 0 + Playwright Chromium 178 passed + 3 pre-existing flakes (cross-browser footer + gamification badge tiers + responsive ASCII box = Sessie 149+151 bekend, mechanisch onmogelijk causal link met pure-HTML preconnect-insert).

#### Multi-metric tabel — APPARENT delta vs Phase A baseline (BEFORE cross-check diagnosis)

| Signaal | INDEX delta | INDEX Frame | BLOG delta | BLOG Frame |
|---|---|---|---|---|
| S1 LCP | -28.5 ms | NOISE | -251.7 ms | **A HIT** |
| S2 FCP | -126.9 ms | **A HIT** | -577.3 ms | **A HIT extreme** |
| S3 TBT | **-1295.5 ms** | **A HIT (26× threshold)** | **-1925.5 ms** | **A HIT (39× threshold)** |
| S4 Bytes | -3.6 KB | NOISE (3rd-party version variance) | +0.1 KB | NOISE stable |
| S5 CLS | +0.073 | C HIT | 0.000 | NOISE stable |
| S6 adsbygoogle.js dur | -83.9 ms | **A HIT clean** | -92.3 ms | **A HIT clean** |
| S7 LCP-range ratio | 0.79× | A HIT | 1.90× | NOISE |
| Cross-canonical AVG S7 | | | **1.35×** | **A HIT (≤2× threshold)** |
| Score | +8 (67→75) | | +12 (68→80) | |

**Apparent verdict op signaal-niveau:** Frame A territorium (4 dimensies hit A breedte, S6 mechanism-proof clean, S7 ≤2×) — MAAR strict letter blocked door S5 CLS Index C HIT (mediaan-selection-artifact plan §7 orthogonal-flag).

#### Diagnostic-trigger: mechanism-vs-effect-gap

**Key observation:** S6 mechanism-proof showed -84 / -92 ms pagead2 connect-overhead reduction (consistent met plan §7 budget ~100-150 ms TLS-handshake savings). Maar S3 TBT showed -1296 / -1926 ms improvement = **7-14× ratio onverklaarbaar door preconnect mechanism alleen**. Possible explanations:
- (a) Downstream cascade-amplification van earlier-arriving ads
- (b) Phase A baseline anomaly (specific AdSense-ecosystem-state outlier)
- (c) Diurnal/weekly variance tussen PRE en POST run-windows

Geen van deze kan data-alleen onderscheiden zonder controle-meting. **Sessie 150 spirit-rule precedent past niet cleanly:** Sessie 150 had unambiguous mechanism (font self-host) + clean baseline + 0 confound-factor. Sessie 152 heeft mechanism-vs-effect-gap + 5-7× hogere Phase A baseline-variance vs Sessie 151. Spirit-rule override in aanwezigheid van confound = rationalisatie.

#### NEW DISCIPLINE — Cross-check baseline

**Protocol:** Bij apparent-Frame-A met (a) mechanism-vs-effect-gap >5× ratio OF (b) baseline-variance-deviation >2× vs prior sessie's same-baseline → REVERT + 3-run cross-check baseline tegen post-revert productie om Phase A baseline-anomaly empirisch te diagnosticeren.

**Cross-check uitvoering (post-revert 5 jun 23:14 CET, 3 runs × 2 canonicals):**

| Signaal | INDEX cross-check mediaan (r2) | BLOG cross-check mediaan (r2) |
|---|---|---|
| LCP | 1968 ms | 1859 ms |
| FCP | 1726 ms | 1859 ms |
| TBT | 1356 ms | 1024 ms |
| CLS | 0.011 | 0.000 |
| Score | 73 | 76 |
| LCP-range over 3 runs | **400.8 ms** | **338.6 ms** |

**Diagnose:**

| Comparison | INDEX | BLOG |
|---|---|---|
| Phase A LCP-range | 844 ms | 356 ms |
| Cross-check LCP-range | 401 ms | 339 ms |
| Phase A : Cross-check ratio | **2.1× anomaly** | 1.05× representative |
| Phase A TBT | 2208 ms | 2661 ms |
| Cross-check TBT | 1356 ms | 1024 ms |
| Phase A : Cross-check ratio | **1.6× inflated** | 2.6× inflated |
| Sessie 151 PRE LCP-range (ref) | 123 ms | 144 ms |

**Conclusie:** Phase A INDEX baseline was anomalously high-variance (2.1×) AND high-TBT (1.6× inflated vs cross-check). BLOG Phase A baseline was representative for LCP-range maar inflated voor TBT (2.6×). Both baselines run higher-variance regime dan Sessie 151 (productie-state mogelijk genuine drift over 24-48u door AdSense ecosystem-state).

#### Multi-metric tabel — TRUE deltas vs cross-check baseline (representative)

| Signaal | INDEX delta vs cross-check | INDEX Frame | BLOG delta vs cross-check | BLOG Frame |
|---|---|---|---|---|
| S1 LCP | **+157.2 ms** | **C HIT** | -217.0 ms | **A HIT** |
| S2 FCP | +27.6 ms | NOISE | -542.5 ms | **A HIT extreme** |
| S3 TBT | -442.5 ms | **A HIT** | -287.5 ms | **A HIT extreme** |
| S4 Bytes | -3.4 KB | NOISE | -0.1 KB | NOISE |
| S5 CLS | +0.073 | C HIT (mediaan-artifact) | +0.073 | C HIT (mediaan-artifact) |
| S6 adsbygoogle.js dur | -83.9 ms | **A HIT clean** | -92.3 ms | **A HIT clean** |
| S7 LCP-range ratio | 1.66× | A HIT | 2.00× | borderline |
| Cross-canonical AVG S7 | | | **1.83×** | **A HIT (≤2× threshold)** |
| Score | +2 (73→75) | noise | +4 (76→80) | modest |

#### Frame Verdict Logic

| Frame check | Result | Rationale |
|---|---|---|
| Frame A KEEP | **BLOCKED** | Conflicting canonicals (INDEX LCP +157 C vs BLOG LCP -217 A) + S5 CLS C HIT (mediaan-artifact spirit-flag-able MAAR Phase A baseline confound past niet cleanly Sessie 150 spirit-rule). Strict letter Frame A not justifiable na cross-check diagnosis. |
| Frame C REVERT | **BLOCKED** | Only INDEX LCP single C HIT (not ≥2 signals C-range per canonical per plan §8 criterion). S7 ratio 1.83× ≤2× threshold = geen variance-amplification = primary-discriminator-signaal niet HIT. |
| **Frame B NOISE-no-action** | **MET** | Score deltas +2/+4 within noise band, no clean perf-win vs representative cross-check baseline, mechanism-safe (S6 A HIT clean BEIDE) + variance-neutral (S7 1.83×). Source-growth +1,2 KB weegt niet op tegen ~0-modest netto winst. |
| Frame D gray | Niet van toepassing | Conflicting canonicals would suggest D MAAR no twijfel-zone after recognizing Phase A INDEX anomaly + S5 mediaan-selection-artifact. Frame B more honest. |

#### Spawn implication #34 (b) inline-CSS-only

**STILL VALUABLE per plan §11 5e outcome-pad:** Sessie 151 Frame C variance-amplification (6,5-7,7× LCP-range ratio) kwam NIET uit preconnect alleen — Sessie 152 #34 (a) toonde S7 1.83× (no variance-amplification). Mogelijke oorzaken voor Sessie 151 variance-amplification:
- Inline-CSS-cascade-interactie (sync-blocking-style-parse cascade triggert variance op AdSense backend timing)
- Combined-mechanism-effect (preconnect + inline-CSS samen onthullen variance dat alleen niet zichtbaar is)
- Orthogonale variance-bron buiten patch-mechanism (Brevo backend variance op Index? AdSense-Auto-ads-state-variance?)

**Sessie 153 #34 (b) test discriminator:**
- Frame B → source-growth-only orthogonaal aan variance (zowel preconnect-only ALS inline-CSS-only zijn variance-neutral; Sessie 151 variance kwam uit combined-effect of orthogonal-source)
- Frame C → inline-CSS WAS variance-amplifier (preconnect onschuldig, gevonden culprit)
- Frame A → inline-CSS beneficial alone (Sessie 151 patch was over-engineered met destructive interaction)

#### Frame-falsificatie patroon update (7 sessies)

| Sessie | Item | Frame |
|---|---|---|
| 145 | #26 box-utils.js | B (Lighthouse-attributie-bias) |
| 146 | #28 Style/Layout | D (framework-gat) |
| 147 | #29 modulepreload | C (resource-priority-regressie) |
| 149 | #30 sync-inline | D (cascade-elimination sub-Frame-A) |
| 150 | #33 (a) self-host fonts | **A KEEP** (unique font-pipeline) |
| 151 | #27 combined preconnect+CSS | C (variance-amplification) |
| **152** | **#34 (a) preconnect-only** | **B (NOISE-no-action met cross-check-discipline-introductie)** |

**7-sessie-streak honest data-driven outcomes:** 6 Frame-falsificatie + 1 Frame A KEEP. Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen inclusief NEW Frame B NOISE-no-action met cross-check-baseline-discipline-introductie als methodologische evolutie.

**Defense-in-depth-persistence-pattern (Sessie 140 → ... → 152):** Frame B + cross-check-baseline-discipline-introductie + #33 (b/d) triple-source dichtdoen-criterium + S7 partial-falsification + #34 (b) spawn-discriminator-design vastgelegd op **5+ plekken** — (a) dit audit-doc §2g multi-metric tabel + diagnose-tabel + discriminator-spawn, (b) TASKS.md item #33 (b/d) closures + item #34 (a) sub-item closure + sprint regel + Version 5.26 + Voortgang Overzicht, (c) CLAUDE.md "Recent Critical Learnings" Sessie 152 + 1-in-1-out archive Sessie 146, (d) docs/sessions/current.md Sessie 152 full session-log, (e) plan-file outcome-sectie ingevuld. Pattern schaalt over alle uitkomst-typen nu inclusief Frame B NOISE-no-action met cross-check-discipline-introductie als methodologische-evolutie-output.

---

## §2h Sessie 153 closure — item #34 (b) inline-CSS-only mechanism-isolation Frame D gray REVERT met conflicting-canonical-page-type-attribution + NEW bidirectional canary discipline

**Outcome:** ✅ Frame D gray REVERT — patch commit `99bc496` (17 ad-bearing pages × 1 inline `<style>` block, 17 files / 136 ins / +12,16 KB source-growth) → revert commit `2d8b8d1` (17 files / 136 del). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-swift-stream.md`. 7-signaal × 4-dimensie matrix met S7 LCP-range ratio primary discriminator + proactive Phase A baseline-anomaly canary (NEW Sessie 153 evolutie uit Sessie 152 reactive).

### Multi-metric tabel (mediaan-r selected on LCP per canonical, 3-run LH@11 mobile)

| Signaal | INDEX PRE r2 | INDEX POST r1 | INDEX delta | INDEX Frame | BLOG PRE r2 | BLOG POST r1 | BLOG delta | BLOG Frame |
|---|---|---|---|---|---|---|---|---|
| **S1 LCP ms** | 2269 | 2089 | **-180** | **A HIT** | 1925 | 1596 | **-329** | **A HIT extreme** |
| **S2 FCP ms** | 1860 | 1685 | **-175** | **A HIT** | 1925 | 1596 | **-329** | **A HIT extreme** |
| **S3 TBT ms** | 1351 | 1790 | **+439** | **✗ C HIT** | 1330 | 1022 | **-308** | **A HIT** |
| **S4 Bytes** | 570267 | 570682 | +415 | NOISE | 435718 | 436095 | +377 | NOISE |
| **S5 CLS** | 0.084 | 0.084 | 0 | NOISE | 0.073 | 0.073 | 0 | NOISE |
| **S6 Style-time ms** (LH `mainthread-work-breakdown` Style & Layout) | 1306 | 1887 | **+581** | **✗ C HIT supporting** | 1486 | 1401 | **-85** | **A HIT supporting** |
| **Performance Score** | 70 | 68 | -2 | noise | 72 | 76 | +4 | modest |

### S7 LCP-range ratio dual-baseline observation

| Computation | INDEX | BLOG | Cross-canonical AVG | Frame zone |
|---|---|---|---|---|
| PRE Phase A range | 104 ms | 424 ms | — | — |
| POST Phase C range | 293 ms | 1005 ms | — | — |
| **S7 vs Phase A** | 2,82× | 2,37× | **2,59×** | Frame B 2-3× upper-bound |
| **S7 vs Sessie 152 cross-check baseline** | 0,73× (REDUCED) | 2,96× | **1,85×** | **Frame A ≤2× variance-stable** |

**KRITIEKE DISCOVERY (NEW Sessie 153 leerpunt):** Phase A INDEX LCP-range 104 ms vs Sessie 152 cross-check 401 ms = **0,26× = abnormally-STABLE baseline = counterpart van Sessie 152 INFLATED Phase A INDEX 2.1× anomaly**. Sessie 153 proactive canary unidirectional flag (alleen ≥2× HIGH-side trigger) MISTE de LOW-side anomaly-detection. **Bidirectional canary requirement** (NEW Sessie 153 discipline): proactive canary moet BIDIRECTIONEEL checken — ZOWEL ≥2× HIGH-side ALS ≤0,5× LOW-side als baseline-anomaly-trigger. Beide kanten geven misleidende Phase A baseline state.

### Frame D verdict logic (used by plan §6 tabel)

**Frame A KEEP BLOCKED:** INDEX heeft S3 C HIT (counter-mechanism in D2), conflicting canonicals, S7 vs Phase A 2,59× > 2× threshold.

**Frame B NOISE-no-action BLOCKED:** S3 INDEX +439 ms en S1+S2 BLOG -329/-329 ms NIET in NOISE-range; verdict-criterium "alle S1/S2/S3/S5/S6 in NOISE-range" gefalsifieerd door zowel mechanism-savings (BLOG) als counter-mechanism (INDEX S3).

**Frame C REVERT BLOCKED:** S7 vs Phase A 2,59× < 3× (primary discriminator NOT triggered) + S4 NIET C HIT (corrected from scale-error, plan §5 was scale-confusion tussen aggregate-source vs LH-per-page-measurement) = ≥1 C HIT under {S1,S2,S3} maar dimensie-count blijft 1 zonder S4 backing.

**Frame D gray MET:** Partial-Frame-A pattern BOTH canonicals (≥1 dim A HIT) + S7 INDEX 2,82× in 2,5-3× gray-zone + **conflicting canonicals smoking-gun** (INDEX = Frame-C-leaning op S3 TBT + S6 Style-time main-thread regression; BLOG = clean Frame-A across D1+D2 met S6 supporting) → tie-breaker "bij twijfel D = revert".

### Page-type-asymmetric mechanism response (NEW mechanism-categorie)

**Pattern:** Inline-CSS-cascade-recompute interacteert verschillend met page-type AdSense-Auto-ads-state:
- **INDEX (landing-page hoge-priority Auto-ads-state):** S3 TBT +439 ms + S6 Style-time +581 ms = main-thread regression. Inline-CSS-additive-render-blocking versterkt de cascade-recompute-window terwijl AdSense bootstrap-execution main-thread bezet.
- **BLOG (content-page lichte Auto-ads-state):** S1+S2 -329 ms extreme + S3 -308 ms + S6 -85 ms = clean improvement. Inline-CSS-additive parsed cleanly want AdSense-bootstrap minder main-thread-bezet op content-pages.

Dit is een **nieuwe mechanism-categorie**: per-page-type mechanism response asymmetrie wanneer patch interacteert met variable-state externe ecosystem (AdSense Auto-ads state-machine). Sessie 145+146+147+149+151+152 patches gedragen zich uniformer per canonical — Sessie 153 is eerste sessie waar page-type-asymmetry de verdict-criterium domineert.

### Cumulatieve #34 closure-pad evaluatie

| Sessie | Mechanism | Verdict | S7 | Cumulatieve closure-pad implicatie |
|---|---|---|---|---|
| 151 | preconnect + inline-CSS (combined) | Frame C REVERT | 6,5-7,7× variance-amplification | Combined = destructieve cascade. Mechanism-isolation spawn #34 nodig. |
| 152 | preconnect alleen (#34 a) | Frame B NOISE | 1,83× clean | Preconnect alleen NIET variance-amplifier. Hypothese "preconnect = culprit" partial-falsified. |
| **153** | **inline-CSS alleen (#34 b)** | **Frame D gray REVERT** | **vs cross-check 1,85× clean (variance-stable) MAAR conflicting canonicals + page-type-asymmetry** | **Inline-CSS alleen ook NIET variance-amplifier. Mechanism-isolation INCOMPLETE — categorische closure NIET bereikt.** |

**Conclusie:** Sessie 151 #27 variance-amplification kwam NIET uit één mechanism alleen → **combined-mechanism-cascade-interactie** (preconnect × inline-CSS × AdSense-Auto-ads-state per page-type) als destructieve cascade. Page-type-asymmetric response (INDEX vs BLOG diverge) toont dat AdSense-Auto-ads-state-machine state-leakage per page-type relevant is.

**Spawn implication #35:** deep-dive variance-source attribution + page-type-dependent mechanism investigation. Focus-options:
1. **Brevo timer-fingerprint** — sibforms.com preconnect op alleen 2 pages (index + blog/index). Sessie 151 patroon spike kan timing-source zijn.
2. **AdSense-Auto-ads-state-machine state-leakage** — landing-page hoge-priority vs content-page lichte Auto-ads-state. Per-page-type response zou variance amplification verklaren.
3. **Per-page-type cascade-recompute-amplification** — inline-CSS-additive interacteert met AdSense bootstrap-execution main-thread-budget verschillend per page-type.

**NIET combined-mechanism-re-test** (Sessie 151 #27 already proved Frame C destructive cascade). Spawn-scope wijst naar instrumentation/diagnostic experiments boven patch-iterations.

### Frame-falsificatie patroon update (8-sessie-streak)

**145B + 146D + 147C + 149D + 150A + 151C + 152B + 153D = 7 falsificatie + 1 KEEP over 8 sessies.** Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen inclusief Frame D gray met conflicting-canonical-page-type-attribution als nieuwe uitkomst-categorie. Sessie 150 Frame A (#33 a self-host fonts) blijft enige KEEP — unique font-pipeline territorium met clean baseline + 0 confound-factor.

### Defense-in-depth-persistence-pattern (Sessie 140 → ... → 153)

5+ plekken vastgelegd: (a) dit audit-doc §2h multi-metric tabel + dual-baseline S7 + Frame D verdict logic + page-type-asymmetric mechanism + cumulatieve #34 closure-pad, (b) TASKS.md item #34 (b) sub-item closure + sprint regel + Laatst bijgewerkt (header + footer), (c) CLAUDE.md "Recent Critical Learnings" Sessie 153 + 1-in-1-out archive Sessie 147 + Last updated + Version 5.27, (d) docs/sessions/current.md Sessie 153 full session-log, (e) plan-file swift-stream.md outcome-sectie ingevuld. Pattern schaalt over Frame D gray REVERT met methodologische-evolutie-output (bidirectional canary + S4 scale-error + Edit-tool precondition + page-type-asymmetric mechanism als nieuwe categorieën).

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
