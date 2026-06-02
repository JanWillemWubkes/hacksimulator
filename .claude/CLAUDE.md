# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 147)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 10 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E ~167 tests / 22 spec files (Chromium, Firefox, WebKit) | WCAG AAA | 182+27 CSS variables (main.css + landing.css)
**Bundle:** Runtime <400 KB (strikt, terminal.html) + SEO/content-pijler budgetloos (blog + assets). Site-totaal en exacte KB-breakdown wisselen per sessie — zie TASKS.md §Huidige Focus voor ground truth.
**Monetization stack:** AdSense + Ko-fi + Brevo newsletter (double opt-in + welkomstmail + deliverability getuned) + Gumroad v1.0 (3 guides + bundel) + Lead magnet (Sample Pentest). Eigen consent banner met Consent Mode v2. **Per-stack actuele status:** TASKS.md §M5.5 sectie-body.

→ **Live metrics (bundle, tests, sessie-counter):** `TASKS.md` §Huidige Focus + Voortgang Overzicht — single source of truth
→ **Architecture & document-ownership:** `PLANNING.md` v3.0 §Document Ownership | **Commands:** `docs/commands-list.md` (41 commands)

---

## Kritieke "Niet Doen"

→ **Framework & Tech Red Lines:** PRD §13 (Vanilla JS/CSS, <500KB bundle, no backend MVP, Dutch UI, 80/20 output, no arg logging)

---

## Command Output Principe: "80/20 Realisme"

→ **Formule:** Output (EN) + Inline context (← NL) + Tip (NL) + Warning (NL)
→ **Voorbeeld & Philosophy:** PRD §9.2

**Quick:** `nmap 192.168.1.1` → `22/tcp OPEN SSH ← Secure Shell` + `[TIP] Open poorten = attack vectors`

---

## Taal Strategie

→ **Matrix:** UI=NL | Commands=EN | Errors=EN+NL | Help=NL
→ **Rationale:** PRD §6.6 (trust, authenticity, accessibility)

---

## Educational Patterns

→ **3-Tier:** Error=Learning → Progressive hints → Man pages | Security tools=Consent+Warning
→ **Full pedagogy:** PRD §8.3

---

## Tone of Voice

**Principles:**
- **"je" (niet "u"):** Toegankelijk, persoonlijk (niet afstandelijk formeel)
- **Bemoedigend:** "Goed bezig!", "Bijna!", niet "Fout." of "Wrong."
- **Context geven:** Leg "waarom" uit, niet alleen "wat"
- **Symbols:** ASCII brackets only (`[TIP]`, `[!]`, `[✓]`) — terminal aesthetic, NO emojis in code

→ **Voorbeelden (good/bad pairs):** `.claude/rules/tone-and-output.md`

---

## Command Implementation Checklist

Bij nieuwe command: 80/20 output | Educatieve feedback | Help/man (NL) | Warning (offensive) | Mobile (≤40 chars)

→ **Volledige 8-stappen checklist:** `.claude/rules/command-checklist.md`
→ **Command specs:** `docs/commands-list.md`

---

## Architectural Patterns

→ **Top patterns met code:** `.claude/rules/architecture-patterns.md`
→ **All 40+ patterns indexed:** docs/sessions/current.md

---

## Recent Critical Learnings

### Sessie 147: Item #29 Frame C Closure — Modulepreload Resource-Priority-Regressie Bewezen (2 jun 2026)
⚠️ **Never:**
- `cmd | tail -N` als test-suite-exit-code-check vertrouwen — pipeline-exit is altijd van laatste cmd (`tail` = 0), NIET van Playwright. In Sessie 147 dacht ik 14/576 Playwright failures = "exit 0 = groen" tot ik stash-verify deed en doorhad. Gebruik `set -o pipefail` of `${PIPESTATUS[0]}` voor pipeline-test-result-checks. Was bijna-rationalisatie naar "commit anyway" zonder verificatie
- `fetchpriority="auto"` als veilige conservatieve keuze accepteren voor JS-modulepreload zonder Chrome-default-priority te kennen — Chrome's modulepreload-default IS Medium-High (niet Medium-Low zoals ik aannam in plan-design). Met CSS-high op zelfde page-init-phase concurreren auto-hints WEL met CSS-fetch → Frame C resource-priority-conflict. Sessie 147 was geen "te aggressief"-fout (high zou erger zijn) maar wel een "denk eerst aan default-priority empirisch ipv via spec-lezing"-les
- "Bij rood: revert direct"-plan-regel mechanisch volgen wanneer rood het PRE-PATCH-state ook al was — pre-existing flakes ≠ patch-induced regressie. In Sessie 147 was 14/576 Playwright failures 100% pre-existing (bewezen via stash-verify + chromium-isolated rerun, 12 min totaal). Revert-direct zonder root-cause-check zou patch ten onrechte gefalsifieerd hebben. Plan-regel was anti-fix-loop, niet anti-investigation
- Browser-state-persistence in Playwright MCP context onderschatten als cold-baseline-meet-bron — browser_close clear't tab maar NIET HTTP-cache; cache-bust query (`?cb=...`) invalidates alleen HTML, niet JS-module-cache. Sessie 147 vroege Playwright-runs toonden navbar fetchStart 698 ms (cold) → 210 ms (warm) → 591 ms (partial) — 3 verschillende states. Voor cold-baseline gebruik Lighthouse@11 (eigen fresh Chrome per run)

✅ **Always:**
- Mediaan-selectie-discipline: pick mediaan-run op één metric (LCP numericValue), ALLE andere signalen uit DIE run extracten — niet mix-and-match per-metric mediaan. Sessie 145-precedent herbevestigd. Voorkomt cross-metric-correlation-bias en houdt run-state consistent (DNS-warmth, AdSense-state, CDN-cache binnen run gemeenschappelijk)
- Plan-agent's Phase 1 correcties expliciet valideren met Read-tool tegen werkelijke source — Sessie 147 Plan-agent claimde "legal.js transitief gepreload via main.js graph", verificatie via main.js:7 bevestigde statische import (correct) MAAR Playwright meting toonde legal.js fetchStart ~700 ms gelijk met navbar/footer (transitive chain werkt mogelijk niet zoals Plan-agent claimde door version-param-mismatch op terminal.html:43). Plan-agent-claims zijn hypothesen, verificatie tegen bestand-bron blijft vereist
- Frame C (regressie) is even legitieme ✅-closure-pad als Frame B (no-action) en Frame D (tie-breaker) — niet "patch faalde", maar "patch werkte mechanisch (S6/S7 -240 ms = Frame A) maar veroorzaakte netto regressie elders". Revert + spawn-structureler-pad + honest-flag is volledige cyclus, geen verlies. Sessie 145-147-pattern: alle 3 closure-paden gevalideerd via verify-first-discipline binnen 3 sessies
- Single-bron-consolidatie verkozen boven multi-bron-noise wanneer bronnen verschillende state-models hebben — Sessie 147 begon met Lighthouse + Playwright als 2 evidence-bronnen, ontdekte Playwright cache-state-persistence-vervuiling, switched naar alle 6 signalen uit dezelfde mediaan LH-run (`audits["network-requests"]` voor S6/S7 + trace.json voor S3/S4 + JSON-audits voor S1/S2). Cleaner reproduceerbaar, geen cross-source-noise-vermenging. Mantra: cleaner-bron > meer-bronnen wanneer noise-profielen verschillen
- 3-op-rij mobile-delta-verwachting-falsificatie expliciet als STRUCTUREEL PATROON benoemen, niet incident-na-incident — Sessie 145 box-utils Frame B + Sessie 146 #28 Frame D + Sessie 147 #29 Frame C = drie sessies, drie verwachting-vs-data-misalignments, drie eervolle data-driven-closures. Anti-rationalisatie-discipline is volwassen, niet meer fragiel. Volgende sessies: scope verwachtingen onder + alleen-data-claims + Frame B/C/D als even-aanvaardbaar als Frame A presenteren in plan-design
- Pipeline-exit-code-protocol: alle Bash-tests via `set -o pipefail` of `&& echo EXIT_CODE=${PIPESTATUS[0]}` — niet 1-regel "cmd | tail" voor test-results. Sessie 147 leerpunt direct toepasbaar op alle toekomstige Playwright/npm-test/build-output-validaties
- Defense-in-depth-persistence ook bij Frame C-uitkomst (4 plekken): TASKS.md item-closure + audit-doc §2c multi-metric tabel + CLAUDE.md learnings + docs/sessions/current.md sessie-entry. Toekomstige sessies kunnen niet "stiekem item #29 heropenen" of "vergeten" zonder al 4 tegen te komen. Pattern Sessie 140 → 145 → 146 → 147 schaalt van "geen-code-actie" via "framework-gat" naar "patch-regressie-bewezen"

### Sessie 146: Item #28 Frame D Closure — Lazy-Module-Fetch-Cascade Buiten Plan v2 Framework (29 mei 2026)
⚠️ **Never:**
- Decisional-thresholds-tabel ontwerpen zonder anti-bias-cross-check op signaal-redundantie — Plan v1 voor item #28 had 3 van 8 signalen (1, 4, 7) die hetzelfde causale cluster (DOM-injection-attributie) maten. Frame A zou quasi-automatisch winnen zodra Top-1 stack `init-components.js` bevat, ongeacht andere signalen. Plan-agent ving dat alleen door specifiek naar weegfout-patroon te zoeken. Voor multi-frame beslis-tabellen: per frame moet ≥2 onafhankelijke signalen bestaan, geen frame mag >37% van totaal-gewicht claimen via gecorreleerde signalen
- Post-hoc Frame-toevoegen ("Frame E voor lazy-module-cascade") nadat data een gat onthult — dat is exact het anti-pattern uit Sessie 145 ("decisional-thresholds-tabel vooraf vastleggen zodat je na data-collectie geen rationalisatie kunt doen"). Frame E NA data = rationalisatie verkleed als frame-completeness. Eervolle weg = plan v2 tie-breaker volgen + structureel-gat als learning documenteren + spawn-item voor mechanisme-onderzoek in eigen verify-first-cyclus
- Trace-stackTrace empty op Top-N Layouts interpreteren als "geen oorzaak / Frame D-automatisch" — parser-driven Layouts bestaan en BETEKENEN dat browser de Layout op default render-cycle-tick doet na DOM-mutaties of resource-arrivals. Verklaring zit niet in JS-stack maar in TIMING van browser-render-pipeline t.o.v. resource-cascade. Long-task observer is de cross-check; zonder die data zou Sessie 146 onterecht "geen actionable bottleneck" geconcludeerd hebben
- Mobile-score-verwachting van user accepteren als hard target zonder eerlijke data-gefalsifieerde uitkomst-acceptatie — Sessie 146 is 2e sessie op rij waarin Heisenberg's verwachte +5-15 score-delta door data is gefalsifieerd. Eerlijke flag in ALLE 3 documentatie-plekken (audit-doc §2b + TASKS.md item #28 + dit) voorkomt drift naar "ja het ging goed"-rationale terwijl feitelijk no-action was. Tweede-sessie-op-rij-patroon is signaal: user's mental model van score-delta verwachtingen overschat consequent. Volgende sessies: scope verwachtingen lager + alleen-data-driven uitkomst-claims

✅ **Always:**
- Playwright MCP buffered PerformanceObserver met `{type: 'longtask', buffered: true}` gebruiken voor cold-meting deterministische cross-check op trace-attributie — toonde dat long-task #1 = 520 ms desktop boot-window dat navbar.js/footer.js/legal.js lazy-fetch-cascade omhult. Identificeerde mechanisme dat trace-parse alleen niet gaf. `PerformanceObserver` met `buffered: true` retrieve't pre-observer-events na page-load, geen pre-navigation init-script nodig. Pattern werkt ook voor `layout-shift`, `paint`, `largest-contentful-paint`, `event`
- AskUserQuestion bij Phase 3 surprise-finding (Top-3 parser-driven = plan v2 framework-gat) — Heisenberg's keuze "Pad A eervolle plan-discipline" binnen 1 user-turn. Mechanische door-actie naar Pad B/C zou plan-design-creep introduceren. Multi-frame escape-pad-keuze hoort bij user, niet bij Claude (Sessie 145 patroon herbevestigd)
- Plan-agent in Phase 2 OOK voor verify-first-plan-designs gebruiken — niet alleen voor "wat is het patch-pattern". Plan-agent ving 3 hoog-impact correcties in plan v1: anti-bias signaal-redundantie + a11y-risico's bij containment-patches (`content-visibility:auto` op `aria-live="polite"` breekt screenreader-announcement, `contain:paint` op `.modal` kan focus-visible outline afkappen, rAF-batching op typewriter is verkeerde patch — juiste is `_scrollToBottom` naar rAF met setTimeout-cadence intact) + ontbrekende cross-frame-filter. Zonder Plan-agent zou plan v1 zelf de oorzaak van foute Frame-conclusie geweest zijn
- `args.beginData.frame` cross-frame-filter implementeren in elke trace-parse vanaf nu — Sessie 145's 177× Lighthouse-attributie-bias had deze filter als root-cause. Sessie 146 toonde 8 main-frame Layouts vs 8 totaal (alle main-frame in dit geval), maar filter is goedkoop (~5 regels Python via extract van `TracingStartedInBrowser` mainFrame) en voorkomt cross-origin iframe-noise in andere cases (Google Fonts iframe, Brevo iframe, eventueel AdSense iframes op andere pages)
- Defense-in-depth-persistence ook bij Frame D no-action-uitkomst — 3 plekken: audit-doc §2b multi-metric tabel + TASKS.md item #28 closure-tekst + dit CLAUDE.md learnings. Toekomstige sessies kunnen niet "stiekem" item #28 heropenen of als "vergeten" behandelen zonder al deze drie tegen te komen. Pattern Sessie 140 → 145 → 146: schaalt van "geen-code-actie" naar "framework-gat-bevinding"
- Honest-flag in elke audit-doc-sectie waar user's verwachting niet door data wordt vervuld — niet stilletjes weglaten, niet rationaliseren in andere richting. Audit-doc §2b honest-flag-zin: "Heisenberg's spawn-instructie (mobile +5-15) NIET vervuld; data toonde dat top-3 triggers geen actionable JS-events zijn binnen plan v2 framework. 2e sessie op rij waarin verwachte mobile-score-delta gefalsifieerd én transparant geaccepteerd zonder rationalisatie of plan-design-creep." Twee-sessie-patroon expliciet noemen markeert anti-rationalisatie-discipline als structureel, niet incident

### Sessie 145: Item #26 Frame B Closure — Lighthouse-Attributie-Bias Onthuld via Multi-Metric Verify-First (29 mei 2026)
⚠️ **Never:**
- Lighthouse `audits["bootup-time"]` per-URL scripting-cijfers gebruiken als beslis-anchor voor optimalisatie zonder multi-metric verificatie via raw `trace.json` `traceEvents` filter — Sessie 145 onthulde **factor 177x mismatch** op `box-utils.js` (Lighthouse 230 ms scripting vs raw trace 1.3 ms). Lighthouse's `bootup-time` algoritme attribueert v8-sampler-tijd per script-URL via call-stack-heuristiek; bij ES-module-graph met shared leaf-dependencies kan attributie falen. Een hele sessie cache-warming-engineering (Frame A pad) was gepland op deze foute basis tot multi-metric data het corrigeerde. Sessie 142-les uitgebreid: niet alleen mobile vs desktop, óók Lighthouse-cijfer vs raw trace vs isolated measurement vereist alle drie
- Hypothese-formulering accepteren met specifieke source-locatie-claims (regelnummers, functie-namen) zonder die regels direct te lezen — item #26 hypothese (a) zei "regels 12-50 draaien herhaaldelijk zonder cache-hit". Werkelijke regels = pure function-definities + event-registraties, geen top-level executie. Source-claim-verificatie via direct Read kost 30 sec en is forcing-function tegen hypothese-drift voorin elke perf-audit
- "Bewijs-van-succes" sectie in verify-first plan schrijven als enkel Frame A/C gerelevanteerd zonder Frame B (no-action) expliciet als legitieme uitkomst markeren — Frame B docs-only heeft geen vóór/ná-meting want geen patch. Plan-design dat alleen action-paden valideert creëert impliciete bias naar "altijd patchen". Sessie 145 plan §4 had Frame B expliciet als ✅-pad gemarkeerd, wat ons toeliet om de no-action-uitkomst te claimen zonder rationalisatie-discomfort. Cruciaal want Heisenberg's verwachte "+5-15 mobile-score" werd NIET vervuld — eerlijke uitkomst zonder gezicht-verlies
- `validate-docs.sh` quickfix als "minor cosmetic" afdoen en `--no-verify` overwegen wanneer Check 2 header/footer-drift vangt — die check bestaat juist omdat ik in Sessie 145 ALLEEN de TASKS.md-header had bijgewerkt en de footer-Versie was vergeten. Root-cause fix (beide regels actueel) is 30 sec werk; `--no-verify` zou Sessie 140's hele forcing-function-investering ondermijnen binnen 1 commit

✅ **Always:**
- Drie meet-niveaus expliciet onderscheiden bij elk perf-audit-debat: (1) **Lighthouse-attributie** (audit-output, heuristisch per-URL), (2) **raw trace events** (devtools.timeline EvaluateScript/v8.compile/FunctionCall via `--save-assets` flag, ground-truth), (3) **isolated measurement** (Playwright dynamic import + cold/warm meting per functie). Multi-metric overeenstemming vereist voor frame-conclusie. Bij conflict: raw trace > isolated > Lighthouse-rapport
- Plan-mode AskUserQuestion stellen bij Phase 1 surprise-finding ipv mechanisch door te gaan met originele scope-spec — Phase 1 Explore-agent onthulde hypothese-mismatch tussen item #26-formulering en source. Direct stoppen + AskUserQuestion met 3 explicit opties + mijn-aanbevelingen leverde verify-first frame-keuze binnen 1 user-turn. Mechanische cache-warming-patch had Heisenberg de werkelijke conclusie (Frame B) ontnomen
- `--save-assets` flag op Lighthouse gebruiken om `trace.json` + `devtoolslog.json` op te slaan voor diepe analyse — JSON-output alleen geeft summary, niet de raw event-stream nodig voor attributie-verificatie. Trace.json is groot (~6-7 MB voor 5s mobile trace) maar Python-parsing kost <1 sec. `mainthread-work-breakdown` audit toont aggregaat-categorieën (styleLayout/scriptEvaluation/parseHTML) die per-URL `bootup-time` niet biedt en die de échte cost-drivers identificeren
- Decisional-thresholds-tabel met expliciete drempels per frame OPSCHRIJVEN in plan-file vóór data binnen komt — zonder die tabel kies je Frame-conclusie waar je je goed bij voelt ipv waar data naar wijst. Sessie 145 tabel had 6 signalen × 3 frames met concrete numerieke drempels zodat ik na data-collectie geen rationalisatie kon doen. Tie-breaker-regel ook vooraf vastleggen
- Defense-in-depth-persistence-pattern (Sessie 140) toepassen ook bij "geen-code-actie"-uitkomsten — Frame B bevinding op 3 plekken vastgelegd: (a) TASKS.md item #26 closure-tekst met multi-metric tabel, (b) inline comment regel 1 box-utils.js, (c) audit-doc §2 closure-tabel. Toekomstige sessies kunnen niet "stiekem" item #26 heropenen zonder al deze drie tegen te komen
- Playwright MCP cold/warm via dynamic `import('...?cb=' + Date.now())` cachebust voor isolated per-functie meting — geen test-spec-bestand nodig voor ad-hoc verificatie, één `browser_evaluate`-call levert N-iteratie mediaan-cijfers. Pattern: t0=now → import → t1 → cold-call → t2 → warm-call → t3 → functioneel-werk → t4. Schaalt naar elke utility-module-meting. Caveat: importMs bevat netwerk-RTT op productie-fetches (~25ms naar Netlify CDN), niet relevant tijdens echte boot want HTTP/2 multiplex
- Variance-bewustzijn bij mobile-Lighthouse: Sessie 145 3-run mediaan toonde scores 51-63 (range 12 punten). Single-run zou óf "score gestegen tot 63" óf "score gedaald tot 51" geclaimd hebben — beide verkeerd. Mediaan-selectie op `audits["bootup-time"].numericValue` ipv score zelf voorkomt mooie-cijfer-bias

### Sessie 144: Pad C1 + C2 Implementatie — Scope-uitbreiding 1→6 Pages, AdSense KB/ms → 0 op productie (29 mei 2026)
⚠️ **Never:**
- Comments in HTML-source als ground truth gebruiken zonder verifiëring — `index.html:71` "AdSense Script nodig voor crawler, toont GEEN ads zonder ad slots" was misleidend en zou Pad C2 hebben kunnen blokkeren op 6 pages. Crawler-ownership-mechanismen zijn `<meta name="google-adsense-account">` + `/ads.txt` op root, NIET de runtime `adsbygoogle.js` script. Verifieer claims in inline comments via Google docs of grep op de daadwerkelijke mechanismen vóór ze als beslis-anchor accepteren
- Een CSS-defer maatregel klakkeloos toepassen op een bestand dat naast animations ook accessibility-utility-styles bevat — `animations.css` had `:focus-visible` outline + `prefers-reduced-motion` reset die WCAG-compliance dekken. Volledig defer = 165 ms a11y-regressie op keyboard/vestibular-disorder-users. Critical-split (~600 bytes inline extract) is geen "meer werk" maar correctie-mandaat. Lees de ECHTE inhoud van het defer-target vóór defer-strategie kiezen
- Lighthouse-verwachtingen formuleren zonder ondergrens-detectie en eerlijk-flag-protocol — terminal mobile 59 < verwacht 70-80 was direct zichtbaar in delta-tabel ná Pad C1+C2. Verzwijgen zou drift creëren ("Pad C1+C2 = succes"). Eerlijk-flag in zowel TASKS.md item #24 sprint-regel ("onder verwacht door box-utils.js bottleneck") als audit-doc §7 "eigenlijk-flags"-sectie plus prioriteit-bump voor item #26 = transparante navigatie naar volgende sprint
- Heisenberg's exacte schaal-instructie ("terminal.html voor C2") accepteren als upper-bound zonder cross-page grep tijdens cold-start — `grep '<ins class="adsbygoogle"' *.html` over alle HTML-files toonde dat 6 pages (terminal + sample-pentest + gidsen + 3 legal) het structurele no-slot-pattern hadden, niet 1. Plan-mode scope-uitbreiding via AskUserQuestion verviervoudigde de impact

✅ **Always:**
- Tijdens cold-start ground-truth-grep doen vóór scope te definiëren — `grep <ins class="adsbygoogle"' *.html` was 30 sec werk en onthulde 5 extra pages met identiek waste-pattern. Sessie 143 §3a decision-tree direct toepasbaar zonder modificatie. Site-wide grep is anti-tunnel-vision pattern voor elke structurele audit
- AskUserQuestion stellen met expliciete mijn-aanbeveling + onderbouwing bij scope-keuze in plan-mode — Heisenberg's "wat raad je aan?" antwoord komt binnen seconden als argumentatie helder is ("comment is technisch onjuist", "delete-cost symmetrisch"). Plan-mode is voor scope-alignment, niet pure mechanische executie van originele scope-spec
- Playwright MCP browser-evaluate gebruiken voor multi-criteria visual verification — 10 onafhankelijke checks in 1 evaluate-call (DOM-presence, `performance.getEntriesByType('resource')` network-history, computed-styles, localStorage, dataLayer, console-errors). Sneller en completer dan screenshot-only, correspondeert direct met implementation-criteria
- Tab-keypress simuleren voor `:focus-visible` test — programmatische `.focus()` triggert `:focus` maar NIET `:focus-visible` (intentional browser-policy onderscheidt keyboard van mouse). Verschil: `outlineStyle: "none"` vs `outline: "rgb(121, 192, 255) solid 2px"`. Subtiel maar fundamenteel voor WCAG-claim-verification
- Vóór/ná Lighthouse delta-tabel met expliciete kolommen voor AdSense KB + AdSense ms apart van total/3rd-party — toont direct welk deel van performance-win toe te schrijven is aan Pad C2 versus Pad C1 versus run-variance. AdSense 252→0 op ALLE 4 runs = harde productie-evidence ipv "ongeveer beter"
- Polling-pattern via `until curl | grep` + `run_in_background` ipv vaste sleep — completion-notification triggert exact wanneer deploy live is (Netlify 60-90 sec variabel), bespaart 30-60 sec t.o.v. arbitraire `sleep 120`. Sessie 138-pattern ("simpel-werkt-eerst") herbevestigd
- Anti-frame-bias check uitvoeren tegen Lighthouse-resultaten — terminal mobile FCP +476 ms regressie en sample-pentest mobile LCP +171 ms regressie waren tegenovergesteld op desktop runs (-54 / -13 ms). Conclusie: run-variance, niet defer-trade-off-effect. Cross-preset vergelijking is anti-noise-sanity-check

### Sessie 143: Third-Party Audit — AdSense Domineert, Sessie 142's Attributie Verfijnd (28 mei 2026)
⚠️ **Never:**
- Sessie 142's casual third-party-attributie ("AdSense+GA+Brevo+Ko-fi+misc") accepteren zonder per-origin verificatie via Lighthouse JSON `audits["network-requests"]` — bij `/terminal.html` bleek GA4 NIET geladen (consent-default-denied), Brevo + Ko-fi laden ALLEEN op index.html / sample-pentest.html (sibforms script + Ko-fi widget bestaat niet als script-injectie ergens). Frame-bias-correctie binnen frame-bias-correctie: Sessie 142 was al een correctie van Pad A/B beslis-frame, en bevatte alsnog een nuance-fout in attributie. Per-pagina audit is non-fungible — wat third-party doet op index.html is anders dan op terminal.html
- Quick-win-aannames uit instructie klakkeloos overnemen ("font-display:swap voor 3 fonts ~100 KB") zonder eerst `grep -n display=swap` op de relevante HTML-files te draaien — `&display=swap` was al actief in Google Fonts URL op alle 3 pagina's (`terminal.html:37`, `index.html:42`, `sample-pentest.html:41`). Lighthouse rapporteerde 0 ms blocking voor Fonts → al optimaal. Eerlijk-flag in audit-doc voorkomt dat een "quick win" die geen win is in de aanbeveling belandt
- Lighthouse `third-party-summary` audit als enige ground truth nemen voor wat third-party laadt — die summary groepeert en attribueert per "entity" (`Google/Doubleclick Ads`, `Google Fonts`) wat handig is voor blocking-time-rangschikking, maar voor exacte URL+KB-breakdown moet je `network-requests` parseren. Eén audit dekt niet alle vragen; gebruik beide
- **Productie-data uit dashboards interpreteren zonder context van marketing/distributie-state** — Sessie 143 audit gebruikte initieel €0,02 / 30 dagen AdSense-revenue als "baseline-bewijs dat Pad C2 risico nul is". Heisenberg corrigeerde: site is nog nooit gepromoot, deze cijfers zijn een pre-promotion floor, geen steady-state. Drift-risico: als latere sessie diezelfde data ziet zonder context, kan een "revenue is laag dus alles defer-baar" rationale ontstaan die fout schaalt naar post-promotion-state (10-100x traffic). Structureel: vraag áltijd naar marketing/distributie-state vóór economische trade-off-conclusies; bouw redenering op invarianten die traffic-onafhankelijk zijn (terminal.html heeft 0 `<ins>` slots = ad-revenue is structureel 0 ongeacht traffic) ipv variabele baselines (huidige €-cijfers). Audit-doc §3a documenteert het juiste argumentatie-frame

✅ **Always:**
- Voor third-party perf-audits: Lighthouse JSON capture met `--output=json` + Python parse (~30 regels) van `audits["network-requests"]` + `audits["third-party-summary"]` + `audits["unused-javascript"]` + `audits["bootup-time"]` + `audits["render-blocking-resources"]` → geeft per-URL transfer/blocking/scripting-time + per-script unused-bytes percentage + per-script main-thread-cost. Volledig reproduceerbaar (geen DevTools-screenshots). Lighthouse@11 pinnen voor Node 18 compat
- Bij pagina-specifieke audits: óók `<ins>` / `.ad-container` / iframe-elementen in `<body>` grep'en, niet alleen `<script>` in `<head>` — Sessie 143 onthulde dat `terminal.html` adsbygoogle.js laadt maar **0 ad-slots** heeft = AdSense ad-slot-module laadt 172.7 KB waarvan 132.9 KB (77%) ongebruikt blijft. Smoking gun voor "verwijder script van deze pagina" hypothese, conditional op AdSense Auto-ads dashboard-state
- Audit-output als separate reference-doc (`docs/perf-third-party-audit.md`) ipv inline in TASKS.md — past Sessie 140 Doc Ownership matrix (TASKS = execution-tracker, niet deep-reference). 7-sectie structuur (methodologie / ground truth / trade-off / quick wins / defer-window / recommendations / verification) is template voor toekomstige audits (blog-page, index-page met Brevo, etc.). TASKS.md item krijgt enkel 1-regel-pointer naar het reference-doc
- Bij smoking-gun-bevinding (high-impact maar revenue-gated): output framen als **gevalueerde paden voor user-decision** (Pad C1 low-risk / C2 high-impact-blocked-op-user-action / C3 status-quo) ipv auto-fix-aanbeveling. Removal van adsbygoogle.js van terminal.html vereist Heisenberg's AdSense dashboard-verificatie (Auto-ads aan/uit); zonder die input is hypothese niet falsifieerbaar. Pad-framing geeft Heisenberg keuze-structuur met expliciete revenue-risk-labels
- Reproducibility-check tussen sessies: Sessie 142 mat Mobile 39/Desktop 64, Sessie 143 reproduction Mobile 40/Desktop 69. ±5 punten variantie binnen run-noise (vermoedelijk AdSense ad-creative-rotation + CDN-cache-warmth). Voor budget-vergelijkingen: mediaan van 3+ runs ipv enkele meting. Score-claims in CLAUDE.md / PLANNING.md zonder run-context zijn brittle
- Eerlijk-flag bij quick-wins-tabel als oorspronkelijke instructie een aanname bevat die door grep wordt gefalsifieerd — niet stilletjes weglaten ("font-display al actief"), wél in tabel met expliciete "❌ al actief (non-task)" status. Meedogenloos-eerlijke audit = vertelt user ook waar zijn aanname fout zat

### Sessie 142: Lighthouse Meet-Frame-Bias — Bundle-Source ≠ On-Wire ≠ Performance (28 mei 2026)
⚠️ **Never:**
- Een beslis-tabel ontwerpen die één metric als proxy voor user-impact gebruikt zonder de andere meet-niveaus uit te sluiten — Sessie 142 begon met "Pad B als Lighthouse ≥90, anders Pad A". Lighthouse mat Mobile 39 + Desktop 64; Pad A is automatische conclusie. MAAR Pad A target (eigen-code bundle ~108 KB minified lazy-loaden) bespaart ~22 KB gzipped van 624 KB on-wire totaal = niet relevant voor TBT 3,270 ms die domineren wordt door third-party (353 KB / 57%). Beslis-framework veronderstelde impliciet dat als er user-impact is, ónze bundle de oorzaak is — Lighthouse falsifieerde het tweede deel van die aanname maar niet het eerste. Klakkeloos het beslis-frame volgen zou hebben geleid tot 15-20 uur Pad A engineering met Lighthouse-score van 39 → ~42 als "succes"
- "Lighthouse 100/100/92/100" uit Sessie 100 als baseline-claim accepteren zonder de meet-context te kennen — die historische score is vermoedelijk desktop, mogelijk vóór de complete monetization-stack (AdSense in 117-118, Brevo in 126, Gumroad in 127-129, Lead magnet in 130-132, ~10 third-party scripts toegevoegd in 20 sessies). Score-comparison zonder context creëert valse zekerheid over performance-trend; absoluut cijfer in een vacuüm zegt weinig
- Pad B "rebudget want geen user-impact" rationale toepassen terwijl Lighthouse net 39/64 mat — dat zou een budget-shift documenteren met een bewijs dat we niet hebben. Anti-drift werk Sessie 140 voorkomt structurele drift, maar een rebudget op verkeerde rationale is rationale-drift binnen één sessie. Open laten + research-task spawn (#25) is intellectueel eerlijker dan dichten-met-foute-grond

✅ **Always:**
- Drie meet-niveaus expliciet onderscheiden bij elk bundle-performance-debat: (1) **bundle-source size** (wat in repo staat, ~781 KB unminified / ~547 KB minified Terminal Core), (2) **on-wire transfer** (wat de browser download, ~98 KB gzipped first-party + 353 KB third-party = 624 KB totaal in Sessie 142 Lighthouse-audit), (3) **performance-score** (Lighthouse executie-time + render-path metrics, niet direct uit (1) of (2) afleidbaar). Deze drie zijn losjes gerelateerd — fix op niveau (1) garandeert geen verbetering op (3). Documenteer welk niveau het probleem zit voordat je naar oplossing rent
- Lighthouse mobile EN desktop draaien als basis-meting — default Lighthouse is mobile met 4x CPU throttling + 1.6 Mbps; desktop is no-throttling. Verschil Mobile 39 vs Desktop 64 onthult of het probleem CPU-bound (third-party JS execution) of bandwidth-bound (large bundle download) is. In Sessie 142: mobile TBT 3,270 ms / desktop 610 ms = 5x verschil → CPU-bound = third-party execution, niet transfer-size. Twee-meting is reproduceerbaar in <3 min met `npx lighthouse@11`
- Pre-empt revenue-impact-discussies voordat performance-edits in monetization-scripts toegepast worden — AdSense lazy-loading raakt viewability metrics (CPM rates), Brevo/Ko-fi iframe defer raakt signup/donation friction. Dit zijn revenue-vs-performance trade-offs, geen pure perf-tweaks. Heisenberg moet die trade bewust maken, niet als bijproduct van bundle-budget-cleanup. Daarom: third-party perf werk eerst als RESEARCH-task scopen (#25, ~2 uur), geen implementatie zonder per-script trade-off-tabel
- Bij surprise-bevinding in execution: stop, presenteer data + interpretatie + nieuwe opties aan user via `AskUserQuestion` met expliciete vermelding "verrassend t.o.v. plan-aanname" — Sessie 142 stopte na Lighthouse-output i.p.v. mechanisch door te gaan naar Pad A research; Heisenberg gaf akkoord op gewijzigde scope (item #24 paused + #25 spawn). Plan-bestanden zijn snapshot van veronderstellingen op moment-T; nieuwe data overrulet plan
- Item-status "✅ gesloten" alleen toepassen als de werkelijke kwestie is opgelost — niet als bewijs-onderbouwing weerlegd is. Sessie 142 had item #24 kunnen "afronden met Pad B-conclusie" maar dat zou een sluiting met foute rationale zijn. ⏸️ paused-status + cross-link naar #25 + heropen-conditie is honester en behoudt context voor toekomstige sessies
- npx lighthouse pinning op major-version bij Node-version-mismatch (`lighthouse@11` werkt op Node 18, `@12+` vereist Node 22+) — bespaart 5 min npm-error-debug. Documenteer in plan-file welke pinning gebruikt is voor reproduceerbaarheid

**Rotation:** Keep last 6 full (142-147). Archive: docs/sessions/ (current.md, recent.md, archive-*.md)
Pre-Sessie 142 learnings (incl. Sessie 126 Brevo-migratie + 127 Typst PDF + 128 Gumroad factcheck/taalconsistentie + 129-133 monetization-stack + 134 Brevo DnD-herbouw + 135 DNS cleanup + 136 Postmaster re-check + 137 funnel-pulse + 138 OWASP hub-post + 139 unified marketing nav + 140 Doc-Protocol Refactor + 141 Terminal Core Runtime-Verificatie) → zie `docs/sessions/current.md`. Sessie 138 was 1-in-1-out Sessie 144; sessies 135/136/137/139 archived in bulk Sessie 145; Sessie 140 was 1-in-1-out Sessie 146; Sessie 141 was 1-in-1-out Sessie 147. Volgende bulk-rotation trigger Sessie 150 (verwijdert 142-145 zodra 150 toegevoegd).

---

## Sessie Protocol

**Voor Sessie:** Lees `.claude/CLAUDE.md` (this file) + check sprint-regel + Volgende Stappen in `TASKS.md`
**Tijdens:** Markeer taken in `TASKS.md` direct | Architecturale beslissingen alleen in `PLANNING.md` bij echte arch-change
**Afsluiten:** Use `/summary` command → 6-step flow (zie hieronder)

### `/summary` flow — single source of truth = `TASKS.md`

1. **Ground truth meting** (~30 sec, read-only)
   - `du -sb src/ styles/ blog/ assets/` → bundle metrics
   - `find tests/e2e -name "*.spec.js" | wc -l` → test file count
   - `git log --oneline -1` → laatste commit voor sprint-regel

2. **Update `TASKS.md`** (primary execution-tracker)
   - Header: `Laatst bijgewerkt` datum + `Sprint` regel met huidige sessie
   - Footer: datum + version
   - Milestone-tabel: percentage update bij task completion
   - Bundle/test metrics: ground-truth getallen uit stap 1

3. **Update `docs/sessions/current.md`**
   - Volledige sessie-entry (mission, work done, learnings, next steps)
   - Rotation: bij Sessie %5 → archiveer pre-N-6 entries naar `archive-*.md`

4. **Update `.claude/CLAUDE.md`** (AI-context, lean — dit bestand)
   - "Recent Critical Learnings": prepend nieuwe sessie, behoud top 6, ouderen → `current.md`
   - "Sessie counter" regel
   - Footer datum + version
   - Live metrics in Quick Reference: **niet** updaten — verwijs naar TASKS.md

5. **Update `PLANNING.md`** ALLEEN bij architectuur-wijziging
   - Nieuwe tech-stack-keuze, design-system-change, security-strategie-shift
   - GEEN milestone-percentage-updates (woont in TASKS.md)

6. **Update `docs/prd.md`** ALLEEN bij scope-wijziging
   - Nieuwe requirements, success criteria change
   - GEEN tactical execution updates

7. **Validatie** (forcing function)
   - `bash scripts/validate-docs.sh` → exit 0 vereist
   - Pre-commit hook draait dit automatisch
   - Checks: sessie-counter alignment, datum-consistency binnen doc, PRD-version-match across docs

**Rotation trigger:** Every 5 sessions, archive sessies N-10..N-6 from CLAUDE.md learnings (last bulk: Sessie 145 archived 135-139, Sessie 146 1-in-1-out archived Sessie 140 → current.md, next bulk: Sessie 150)
**Sessie counter:** 147

→ **Document Ownership map:** `PLANNING.md §Document Ownership`

---

## Communicatie Grondregels

**Wees meedogenloos eerlijk, geen jaknikker gedrag.**

- Als ik ongelijk heb: **wijs me erop**
- Als code slecht is: **zeg het direct**
- Als aanpak niet werkt: **geef kritische feedback**
- Prioriteit: **technische correctheid > mijn gevoelens**
- **Spreek me aan met "Heisenberg"** (confirmatie instructies gelezen)

### Bij Implementatie
1. Check PRD: Is het in MVP scope?
2. 80/20 output: Niet te technisch, niet te simpel
3. Educatieve laag: Elk commando = leermoment
4. Taal correct: UI=NL, commands=EN, uitleg=NL
5. Performance: Terminal Core <400KB, site totaal <1000KB

### Playwright Screenshot Conventie
- **ALTIJD** expliciete `filename` meegeven aan `browser_take_screenshot`
- Prefix met `.playwright-mcp/` — die dir staat in `.gitignore`, dus screenshots blijven automatisch buiten git
- Voorbeeld: `filename: ".playwright-mcp/legal-light-h1.png"`
- **NOOIT** screenshots zonder filename of in repo root — de `/*.png` regel in `.gitignore` is een vangnet, geen excuus

→ **Tech constraints:** PRD §13 | **Pattern violations:** docs/sessions/current.md

---

## Troubleshooting

→ **Top 9 issues met diagnose + fixes:** `.claude/rules/troubleshooting.md`
→ **Memory leak debugging:** docs/testing/memory-leak-results.md

---

## Referenties

- **PRD:** `docs/prd.md` v1.8
- **Commands:** `docs/commands-list.md` (41 commands)
- **Style Guide:** `docs/style-guide.md` v1.5
- **Sessie logs:** `SESSIONS.md` → docs/sessions/ (~122 sessies)
- **Netlify/Domain:** `docs/netlify-setup.md`
- **Rules:** `.claude/rules/` (tone-and-output, architecture-patterns, troubleshooting, command-checklist)
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 2 jun 2026 (Sessie 147 — Item #29 ✅ gesloten via Frame C (resource-priority-regressie). Verify-first-plan uit `/home/willem/.claude/plans/heisenberg-hier-pak-item-foamy-sprout.md` uitgevoerd: 6-signaal decisional-thresholds-tabel met symmetrische 33,3%-clustering (anti-Sessie-146-redundancy 37%-grens), Phase 1 ontdekte 3 correcties (legal.js EXCLUDED transitief via main.js graph + leading-slash path-style + terminal.html:43 main.js version-param-mismatch out-of-scope #31). 3-run mediaan LH@11 mobile vóór: score 74 / LCP 4116 / TBT 477 / Top-1 Layout 166,5 / Top-1 RunTask 208,1 / navbar+footer rendererStart 441 ms. Patch 3 HTML-regels (~240 bytes, `fetchpriority="auto"`, commit `baa4cf3`). Post-patch mediaan: score 62 / LCP 4250 / TBT 813 / Top-1 Layout 334 / Top-1 RunTask 418 / navbar+footer 200/205 ms. Multi-metric delta: S6/S7 -240/-236 ms ✅ Frame A MAAR S1/S2/S3/S4 +133/+335/+167/+210 ms ⚠️ Frame C (4/4 page-perf-signalen Frame C-threshold). Mechanisme: modulepreload-fetchpriority=auto concurreert met CSS-high tijdens initial-connection-phase → CSS-fetch verlaat → cascade-regressie. Revert commit `6c2ac7a` + deploy 21s. **3e sessie op rij waarin mobile-delta-verwachting structureel-gefalsifieerd** (Sessie 145 #26 Frame B + Sessie 146 #28 Frame D + Sessie 147 #29 Frame C) — patroon nu structureel verankerd, anti-rationalisatie-discipline volwassen. Spawn #30 sync-inline navbar/footer + #31 main.js version-param-mismatch. Defense-in-depth 4 plekken: audit-doc §2c + TASKS.md item #29 + dit + current.md Sessie 147. Sessie 141 1-in-1-out → current.md.)
**Version:** 5.21 (Sessie 147 verify-first-plan-protocol bevestigt Frame C als legitieme ✅-closure-pad bij patch-regressie — 6-signaal tabel met 3 clusters × 2 elk = 33,3% per cluster (onder 37%-grens van Sessie 146), Frame A targeting resource-cluster + Lighthouse-cluster + trace-cluster simultaan, Frame C als 1-of-meer C-threshold-hit. Patch werkte mechanisch op gerichte cluster (S6/S7) MAAR veroorzaakte regressie op 4/4 page-perf-signalen door resource-priority-conflict met CSS-high. Eervolle Frame C-closure = data-driven revert + spawn structureler pad, geen rationalisatie. Plan-agent's Phase 1 vond 3 hoog-impact correcties (transitive preload-chain via main.js graph, browser-dedupe-correctheid van leading-slash path, version-param-mismatch ontdekt out-of-scope). Pipeline-exit-code-bug-leerpunt: `cmd | tail -N` exit-code is van `tail` niet van cmd — gebruik `set -o pipefail` of `${PIPESTATUS[0]}`. Test-suite-flake-discipline: 14/576 Playwright failures bewezen 100% pre-existing via stash-verify + chromium-isolated rerun binnen 12 min = legitieme root-cause-diagnosis, geen patch-fix-loop. 3-op-rij verwachting-vs-data-misalignment expliciet als STRUCTUREEL patroon benoemd in alle 4 persistence-plekken. Volgende bulk-rotation Sessie 150.)
