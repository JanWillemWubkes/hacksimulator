# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 150)
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

### Sessie 150: Item #32 VFS NaN Quick-Fix + Item #33 (a) Frame A KEEP — Self-host Google Fonts Breekt 5-op-rij Frame-Falsificatie-Patroon (3 jun 2026)
⚠️ **Never:**
- Plan-table threshold-design rigide volgen wanneer pre-data threshold-onhaalbaarheid GEÏDENTIFICEERD + primary anti-bias rule (Sessie 146: ≥2 onafhankelijke causale dimensies + breedte) satisfied. Sessie 150 #33 (a) had S3 ≤-30 KB mechanisch-onmogelijk door variable-font byte-equivalence (Phase 4 insight pre-data), effectief criterium werd ≥3-of-3 remaining waarvan S2 -63 ms missed -200 ms. Strict letter-Frame-D zou patch met LCP -1150 ms + TBT -491 ms reverteren = pervers anti-pattern. Onderscheid discipline (eerlijke data-driven verdict via structuur van data) vs stijfkoppigheid (vooraf-fout-gecalibreerde regel respecteren ondanks pre-data design-flaw-erkenning). Sessie 146 primary anti-bias rule is FUNDAMENTELER dan secundaire ≥3-of-4 count-mechanism — voor toekomstige verify-first plans expliciet primary criterion noteren als "≥2 onafhankelijke dimensies hit met breedte" niet als count-rule
- Plan-agent session-limit-hit als excuus om Phase 3 Read kritieke files te skippen — Sessie 150 Plan-agent crashed na ~5 sec van prompt-send, switched naar zelf-synthese MAAR Phase 3 5-parallel-Read BLEEF vereist (terminal.html font-block + main.css @font-face anchor + _headers + performance.spec.js + TASKS.md spec). Zelf-synthese vervangt Phase 2 design-werk; vervangt NIET Phase 3 verificatie-discipline. Sessie 149 leerpunt "Phase 3 Read kritieke files NA Plan-agent BLIJFT VEREIST" generaliseert nu naar "ALTIJD vereist ook bij Plan-agent-failure of zelf-synthese-pad"
- Variable-font byte-equivalence NIET inplannen in S3 threshold ontwerp — Sessie 150 plan §6 had S3 ≤-30 KB op basis van verwachting "99 KB CDN bytes elimineren". Awk-parse Google CSS2 API onthulde dat Inter+JetBrainsMono+SpaceGrotesk variable fonts zijn (3 unique woff2 voor 8 weights via browser-dedup) → bytes byte-equivalent. Pre-emptief documenteren in Phase 4 plan-design = anti-rationalisatie-bescherming + voorkomt post-hoc threshold-adjustment-discussie. Pattern: 3rd-party-CDN-replacement-audits beginnen met CSS+asset-parse VÓÓR plan-§6 thresholds vastleggen
- `npx lighthouse` zonder versie-pin op Node 18 — pulls v12+ met ES2025 `import with { type: 'json' }` syntax die SyntaxError exit 2 geeft. Sessie 150 startte met deze faal, switched naar `npx -y lighthouse@11` (Sessie 144-149 canonical) voor pinned 11.7.1. Pattern: alle Lighthouse-recipes gebruiken `lighthouse@11` pin, geen unpinned

✅ **Always:**
- Awk-parse 3rd-party CSS BEFORE plan-design completes — Sessie 150 awk-parse `/* latin */` blocks onthulde variable-font 3-unique-files-discovery die plan §5 file-count en CSS-block-count met 5/8 vermindering. Bij elke CDN-replacement-audit: 30 sec curl+parse VOOR plan-§5 design vermindert plan-design-fout en simplifieert implementation scope dramatisch
- Honest pre-emptive threshold-onhaalbaarheid documenteren in Phase 4 plan-design — Sessie 150 Phase 4 insight "S3 ≤-30 KB WON'T HIT door variable-fonts" was DE smoking gun voor post-data Frame A spirit-rule-override discipline. Pattern: bij elke plan-§6 threshold die op aanname rust van mechanisme dat nog niet bewezen is, documenteer "predicted pre-data" disclaimer + alternatief-criterium-pad. Maakt post-data verdict-conflict-resolutie disciplined ipv rationalisatie
- AskUserQuestion bij Frame-verdict-conflict tussen letter en spirit met leek-uitleg (geen jargon-zwaar) — Sessie 150 patch had aantoonbaar LCP -27% + TBT -54% + score +19 MAAR strict letter zei Frame D. AskUserQuestion (a) gaf Heisenberg de discipline-judgment-call territoir + (b) duidelijke voor/tegen onderbouwing + (c) primary anti-bias rule context + (d) discipline-vs-stijfkoppigheid uitleg. NIET unilateraal beslissen op user-territoir. Pattern Sessie 145 Phase 1 surprise + Sessie 146 Phase 3 surprise + Sessie 150 Frame-verdict-conflict — user-territoir verifieert beslis-eigenaarschap
- Cache-coherency `?v=<sessie>` bump pre-emptief bij CSS+HTML co-edit (Sessie 149 leerpunt verbatim toegepast Sessie 150) — "bij ELKE patch die module-import-keten of sync-inline DOM raakt, evalueer `?v=<sessie>` cache-bust noodzaak voor returning users vóór commit". Sessie 150 reactief discovered tijdens Playwright local verify via stale-cache symptoom (`document.fonts.size=1` vs disk-CSS 9 @font-face) → `main.css?v=114/115` → `?v=150` bump op 20 HTML files (sub-pad #33 (e) PARTIAL closed). Pattern werkt PREVENTIEF (pre-commit evaluatie) en REACTIEF (lokale stale-cache-symptoom-detectie)
- 5-op-rij Frame-falsificatie patroon GEBROKEN door eerste meet-bare mobile-delta sinds Sessie 144 = bevestigt anti-rationalisatie-discipline structureel volwassen IS. Spirit-rule override is mogelijk WANNEER plan-table-flaw pre-data is gedocumenteerd + primary anti-bias rule satisfied. Pattern Sessies 145-149-150: discipline groeit naar volwassen calibratie-feedback-loop. Threshold-design-feedback in CLAUDE.md learnings + plan-files maakt next-cycle thresholds beter calibreerd. Volgende plans expliciet primary-anti-bias-rule als primary criterion (niet ≥N-of-M count)
- Defense-in-depth 5 plekken voor Frame A keep met spirit-vs-letter-conflict-resolutie als NIEUWE uitkomst-categorie — Sessie 140 → 145 → 146 → 147 → 148 → 149 → 150 pattern schaalt over alle uitkomst-typen nu: no-action (#26), framework-gat (#28), patch-regressie (#29), bug-fix-bewezen-werkend (#31), cascade-elimination-sub-threshold met bonus-bug-discovery (#30), **Frame A keep met spirit-rule-override en plan-table-design-flaw-erkenning** (Sessie 150 nieuwe categorie). Plan-table-design-feedback in defense-in-depth voorkomt herhaling

### Sessie 149: Item #30 Frame D Closure — Sync-Inline Cascade-Elimination Geeft Sub-Frame-A Improvement, Cache-Coherency-Bug Ontdekt, Spawn #33 (3 jun 2026)
⚠️ **Never:**
- Plan-agent CLI-syntax-claims blind volgen zonder 1-run dry-test of `--help`-check — Sessie 149 startte 3-run LH met `--preset=mobile` (Plan-agent overgenomen) maar LH@11 valid presets zijn `perf`/`experimental`/`desktop`; mobile is default zonder preset. Sessie 144 leerpunt "comments als ground truth verifiëren" generaliseert nu naar **Plan-agent CLI-syntax-claims**. Triviale fout (1 flag exit 2) maar pattern: bij elke geautomatiseerde meet-recipe verifieer command-syntax vóór 3-run loop. Bespaart background-job-failure-detection-tijd
- Playwright MCP browser-session vertrouwen voor cold-cache-meting van module-imports zonder browser_close + extreme cache-bust — session-persistent caching contamineerde S5 FCP +396 ms = vals positief Frame C-signal dat werkelijke Frame-bepaling kon verstoren. LH lab fresh-Chrome-per-run is single-source-of-truth voor cold-real assessment; Playwright MCP best voor functional-checks + warm-cache analysis + visual-regression. Bij conflict tussen Playwright session-meting en LH fresh-per-run, trust LH (fresh)
- Plan-agent claim "HTML-only patch zonder X" accepteren zonder Phase 3 Read-verificatie van de specifieke code-flow — Sessie 149 Plan-agent miste dat injectNavbar() event-binding-calls NA placeholder-guard early-return wonen, waardoor naïeve sync-inline + early-return = no event-binding = functionele regressie. Plan-agent claims zijn hypothesen, **Phase 3 Read-verificatie blijft VEREIST** ook bij plan-agent-gevalideerde scope. Mantra: Plan-agent levert plan-design, Read kritieke implementation-flow-claims onafhankelijk
- Cache-coherency-impact onderschatten bij module-imports zonder `?v=` query-param — Netlify `max-age=604800,must-revalidate` betekent ALLEEN post-expiration revalidatie. Eerste 7 dagen serveert cache zonder check. Returning users met cached old + nieuwe HTML = functioneel-blockerende mismatch (broken theme-toggle/hamburger/help-dropdown). Sessie 148 #31 patroon (main.js version-mismatch) gegeneraliseerd: bij ELKE patch die module-import-keten of sync-inline DOM raakt, evalueer `?v=<sessie>` cache-bust noodzaak voor returning users vóór commit

✅ **Always:**
- Phase 3 Read kritieke files NA Plan-agent ondanks Plan-agent's eigen Phase 1-readings — onafhankelijke verificatie ving HTML-only-claim-fout op + leidde tot correcte navbar.js mini-refactor scope (event-binding-switch dat ALTIJD draait wanneer #navbar in DOM aanwezig is, statisch óf via injection). Plan-mode workflow's Phase 3 is geen optionele fase, blijft de critical-claim-verifier. Schaalt naar elke plan-mode-flow waar Plan-agent specifieke code-claims maakt
- 3-failure isolated-rerun discriminator-pattern als alternatief voor git stash → rerun → vergelijk (Sessie 147+148 patroon variant): rerun zelfde tests tegen PRODUCTIE (= pre-patch state) ipv localhost (= post-patch). ALLE 3 reproduceren identiek = pre-existing flakes binnen 2 min zonder git-state-mutatie. Sessie 149 gebruikte `BASE_URL=https://hacksimulator.nl` vs `BASE_URL=http://localhost:8765` voor cross-browser footer-links + gamification badges + VFS NaN. Schaalt naar elke pre-commit Playwright-suite-rood-onderzoek waar patch lokaal is + productie nog pre-patch state heeft
- LH-lab-mediaan-cold (fresh Chrome per run) als single-source-of-truth voor cold-real assessment OOK wanneer Playwright MCP simpler beschikbaar is — Playwright session-cache contamineerde S5 +396 ms FCP. LH lab cross-check toonde -19 ms = NOISE. Zonder LH cross-check zou Frame C-rationalisatie kunnen geslopen zijn. Pattern: bij elke cold-real-claim die uit Playwright MCP komt, cross-check met LH-lab-mediaan-FCP-delta. Bij ≥100 ms divergentie tussen bronnen, trust LH
- Plan-file 6-signaal symmetrische 33,3% anti-bias-clustering (Sessie 147 mirror) als design-default — superieur boven Sessie 146 37%-grens. Sessie 149 plan v3 hergebruikte exact pattern + voegde anti-redundancy-onderbouwing per signaal-paar toe (S1 vs S2 onafhankelijke browser-metrics, S3 vs S5 verschillende causale dimensies, S4 vs S6 continu vs binair). 33,3% clustering + decisional-thresholds-tabel-vooraf-vastleggen voorkomt post-hoc rationalisatie. Combineer met expliciete Frame B/C/D eervolle paden in plan-design voor anti-rationalisatie-discipline structureel
- Cache-coherency-bug-discovery tijdens patch-verificatie als BONUS-mechanisme-bevinding documenteren ALS audit-merit-uitkomst, ook al heeft het de patch niet gered — Sessie 148 #31 was reactief tegen main.js. Sessie 149 #30 ontdekte het patroon proactief op navbar.js+footer.js imports. Voorkomt herhaling. Spawn #33 path (e) `?v=<sessie>` systemic mitigation geforceerd in plan-backlog. Bonus-bevindingen tijdens Frame B/C/D closure verdienen DOCUMENTATIE niet onderdrukking — ze accumuleren tot audit-doc-knowledge-base
- Defense-in-depth 5 plekken voor uitkomsten met meerdere bevindingen (Frame D + cache-coherency-bug) — niet alleen TASKS.md item + audit-doc + current.md + CLAUDE.md, OOK plan-file outcome-sectie. Pattern Sessie 140 → 145 → 146 → 147 → 148 → 149 schaalt nu over alle uitkomst-typen: no-action (#26), framework-gat (#28), patch-regressie (#29), bug-fix-bewezen-werkend (#31), cascade-elimination-sub-threshold (#30) met bonus-bug-discovery
- Honest-flag voor 4-op-rij verwachting-vs-data-misalignment EXPLICIET als STRUCTUREEL volwassen disclipline benoemen (geen incident-na-incident) — vier sessies, vier eervolle data-driven closures (145 Frame B + 146 Frame D + 147 Frame C + 149 Frame D). Anti-rationalisatie-discipline volgens Sessie 147 leerpunt nu definitief structureel verankerd. Plan-design-creep-risico is laag voor #33 + toekomstige Frame-bepaling-sessies want pattern is doorgepropageerd. Volgende sessies (incl. #33): scope verwachtingen ONDER + alleen data-driven uitkomst-claims + Frame B/C/D als even-aanvaardbaar als Frame A in plan-design

### Sessie 148: Item #31 Quick-Win Closure — terminal.html:43 Modulepreload Version-Param-Mismatch Fix (2 jun 2026)
⚠️ **Never:**
- Spec-naam blind aannemen zonder `ls tests/e2e/` ground-truth-verify vóór spec-runs — Sessie 148 spot-check probeerde `terminal-load.spec.js` (bestaat niet), pivot naar `performance.spec.js` koste 30 sec maar leerpunt structureel: altijd file-existence ground-truth check op test-fixture-paden, repository-paden, en CLI-argumenten. Generalisatie van "claims in comments verifiëren" Sessie 144-leerpunt naar bestaande-bestand-aannames
- LH@11 3-run mediaan draaien voor performance-delta-meting wanneer fix-bewijs binair is (count: N → M) — variance-noise (Sessie 145 12-punt score-range) verbergt elk effect onder ~5-10% delta. Voor binaire bug-fixes (URL-dedupe-werking, cache-hit-ratio, request-count, header-presence) volstaat single-call Resource Timing API of curl-grep check. Bespaart 8-10 min per sessie + voorkomt vals-claim-bias ("score steeg" terwijl het binnen-noise lag). Sessie 148 sloeg 3-run LH bewust over want fix-bewijs binaire was
- Bij test-failure direct revert overwegen zonder isolated-rerun + code-causale-link-check — Sessie 148 had `performance.spec.js` 2 failed + 1 flaky in initial run. Sessie 147 stash-verify-pattern direct toegepast als spot-check-flake-discriminator: isolated re-run als goedkope eerste check, OF code-lezing van failing-assertion-regel om causale-onmogelijkheid vast te stellen. VFS-NaN failure (regel 496 `stdDev/avgGrowth` waar avgGrowth=0 → 0/0=NaN) was causaal onmogelijk patch-induced want geen storage-codepath geraakt; geen revert-impuls nodig

✅ **Always:**
- Playwright MCP `performance.getEntriesByType('resource')` met `initiatorType` filter is dé snelste resource-dedupe-verifier — pre/post-fix in < 30 sec totaal, byte-exact-evidence (encodedBodySize identiek = zelfde file-content via verschillende cache-keys), attributie-bewijs (initiatorType "other" = preload/modulepreload-tag, "script" = script-tag, "link" = stylesheet). Verandering pre→post in initiatorType-set bewijst exact dat dedupe-mechanisme actief is, niet alleen dat count daalde. Schaalt naar elke resource-hint-bug (preload, prefetch, dns-prefetch, preconnect, modulepreload)
- Pipeline-exit-code-discipline `set -o pipefail` direct toepassen op ALLE test/poll/build-output-validaties — niet pas wanneer een bug optreedt. Sessie 147 leerpunt nu default-pattern: Sessie 148 Netlify-deploy-poll-loop was sowieso met `set -o pipefail` uitgerust ipv reactief na een eerdere bug. Vermijden van bekende valkuil propageert door subsequent sessies = "Always"-pattern die zich verspreidt
- AskUserQuestion previews voor visuele code-vergelijking gebruiken bij scope-keuzes met immediate-visual-outcome — Sessie 148 fix-strategie-vraag had previews met daadwerkelijke `<head>`-sectie tonend optie (a) vs (b) outcome side-by-side. Hielp Heisenberg snel visual symmetrie met bestaand CSS-`?v=114` pattern op regels 41-42 te zien. Aanbevolen voor: HTML-structuur-changes, CSS-layout-keuzes, JSON-shape-decisions, diff-blocks tussen patch-varianten. Niet voor abstract-conceptuele keuzes waar tekstbeschrijving voldoende is
- Audit-merit van diep-LH-Phase-1 schaalt naar bug-detection scope, niet alleen patch-decision-frameworks — Sessie 147 verify-first diep-LH-Phase-1 vond als bijproduct de URL-mismatch bug (#31), Sessie 148 sloot die in 1,5 uur. Anti-attributie-bias-discipline (raw trace > Lighthouse-rapport, per-URL `audits["network-requests"]`-parse met transferSize/encodedBodySize-aggregatie, byte-exact transfer-comparison) is herbruikbaar voor toekomstige bug-hunting OOK wanneer initial-scope eindigt in hypothese-falsificatie (Frame B/C/D-uitkomst). ROI-argument voor diep-LH-pattern blijft positief ondanks individuele-sessie-Frame-uitkomst
- Quick-win-pad ná N Frame B/C/D sessies is legitieme cyclus-fase, geen "verlies van momentum" — Sessies 145/146/147 onthulden 3 verschillende structurele patronen via verify-first cycli; Sessie 148 was de oogst van een spawn-item dat tijdens Sessie 147 diep-LH-Phase-1 ontdekt werd. Quick-wins zonder Frame-bepaling correct wanneer: (a) bewijs van probleem reeds in vorige sessie verzameld, (b) fix is deterministisch (binaire check, geen multi-frame mogelijke uitkomsten), (c) risk-asymmetry laag (geen JS-behavior-change, alleen resource-hint URL of vergelijkbaar). Patroon: Frame-bepaling voor speculative optimization, quick-win voor bewezen deterministische bug-fix
- Defense-in-depth-persistence ook bij deterministische bug-fix-uitkomsten (4 plekken) — TASKS.md item-closure + current.md sessie-entry + CLAUDE.md learnings + plan-file. Toekomstige sessies kunnen niet "stiekem #31 heropenen" zonder al deze tegen te komen. Pattern Sessie 140 → 145 → 146 → 147 → 148 schaalt nu van "geen-code-actie" via "framework-gat" via "patch-regressie-bewezen" naar "bug-fix-bewezen-werkend" — alle uitkomst-typen behandeld met dezelfde discipline

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

**Rotation:** Keep last 6 full (145-150). Archive: docs/sessions/ (current.md, recent.md, archive-*.md)
Pre-Sessie 145 learnings (incl. Sessie 126 Brevo-migratie + 127 Typst PDF + 128 Gumroad factcheck/taalconsistentie + 129-133 monetization-stack + 134 Brevo DnD-herbouw + 135 DNS cleanup + 136 Postmaster re-check + 137 funnel-pulse + 138 OWASP hub-post + 139 unified marketing nav + 140 Doc-Protocol Refactor + 141 Terminal Core Runtime-Verificatie + 142 Lighthouse Meet-Frame-Bias + 143 Third-Party Audit + 144 Pad C1+C2 Implementatie) → zie `docs/sessions/current.md`. Sessie 138 was 1-in-1-out Sessie 144; sessies 135/136/137/139 archived in bulk Sessie 145; Sessie 140 was 1-in-1-out Sessie 146; Sessie 141 was 1-in-1-out Sessie 147; Sessie 142 was 1-in-1-out Sessie 148; Sessie 143 was 1-in-1-out Sessie 149; Sessie 144 was 1-in-1-out Sessie 150 → current.md. Volgende bulk-rotation trigger Sessie 155 (verwijdert 145-149 zodra 155 toegevoegd).

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
**Sessie counter:** 150

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

**Last updated:** 3 jun 2026 (Sessie 150 — Item #32 ✅ VFS NaN guard (commit `1b549d7`) + Item #33 (a) ✅ **Frame A KEEP — self-host Google Fonts** (commit `14b0d44`). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-glittery-rain.md` met 6 signalen × 3 dimensies anti-bias 33,3% symmetrisch. **Variable-font discovery:** Inter v20 + JetBrains Mono v24 + Space Grotesk v22 zijn variable fonts via Google CSS2 API — 3 unique woff2 voor 8 weight-declaraties (browser dedupliceert via URL) = **99,6 KB byte-equivalent aan Google CDN**. **Patch (commit `14b0d44`, 27 files / 449 ins / 121 del):** 3 woff2 in `/styles/fonts/`, 8 @font-face Google-mirror in main.css, SIL OFL 1.1 LICENSES/, REMOVE Google Fonts uit 20 HTML files (preconnect + CSS + noscript), ADD critical font preloads (Inter 400 + Space Grotesk 700 op alle 20, JetBrains Mono 400 extra op terminal.html), cache-coherency bump `main.css?v=114/115` → `?v=150` voor returning-user-mismatch-prevention. **3-run LH@11 mobile post-mediaan R2:** score 82 (+19) / LCP 3141 (-1150 ms, **7,7× threshold**) / FCP 1602 (-63 NOISE) / TBT 416 (-491 ms, **6× threshold**) / CLS 0 stable / TotalBytes 371 KB (0 delta — variable-font byte-equivalent predicted pre-data). **S4 binary check:** 0 Google Fonts origins over alle 3 post-runs (mechanism-proof). **Frame A verdict via spirit + primary anti-bias rule (Sessie 146):** S1 paint-pipeline + S6 main-thread-blocking = 2 ONAFHANKELIJKE causale dimensies met EXTREME magnitudes. Strict letter "≥3 of 4" gefalsifieerd (2-of-4 hit) MAAR plan-table design-flaw geïdentificeerd pre-data (S3 ≤-30 KB mechanisch-onmogelijk door variable-font byte-equivalence). Heisenberg's discipline-judgment-call via AskUserQuestion + leek-uitleg: spirit-rule + primary-anti-bias-rule (≥2 onafhankelijke dimensies hit met breedte) als doorslag, NIET secundaire count-rule. **5-op-rij Frame-falsificatie-patroon GEBROKEN** (145 B + 146 D + 147 C + 149 D → 150 **A**). Anti-rationalisatie-discipline volwassen via spirit-rule-override-pad WANNEER plan-table-flaw pre-data gedocumenteerd. **Defense-in-depth 5 plekken:** TASKS.md item #33 (a) sub-item + sprint + Version 5.4 + Voortgang Overzicht + current.md Sessie 150 + perf-audit §2e nieuwe sectie + dit CLAUDE.md learnings + plan-file outcome-sectie. Sessie 144 archived → current.md. Artifacts `/tmp/sessie150-item33a/{pre-r1,2,3,post-r1,2,3,verdict}.json` + Playwright screenshots.)
**Version:** 5.24 (Sessie 150 BREEKT 5-op-rij Frame-falsificatie-patroon naar Frame A KEEP via spirit + primary anti-bias rule. Bevestigt anti-rationalisatie-discipline volwassen IS, niet alleen "te streng calibreerd". Spirit-rule override is mogelijk WANNEER plan-table-flaw pre-data is gedocumenteerd + primary rule satisfied. **Nieuwe disciplines geïntroduceerd Sessie 150:** (1) Awk-parse 3rd-party CSS BEFORE plan-design completes — variable-font discovery vereenvoudigde plan §5 file-count en CSS-block-count met 5/8 vermindering; (2) Honest pre-emptive threshold-onhaalbaarheid documenteren in Phase 4 plan-design — anti-rationalisatie-bescherming voorkomt post-hoc threshold-adjustment-discussie; (3) AskUserQuestion bij Frame-verdict-conflict tussen letter en spirit met leek-uitleg — user-territoir discipline-judgment-call, NIET unilateraal beslissen; (4) Primary anti-bias rule (Sessie 146: ≥2 onafhankelijke dimensies met breedte) is FUNDAMENTELER dan secundaire ≥N-of-M count-mechanism — toekomstige plans expliciet primary-criterion-vooraf; (5) Onderscheid discipline (eerlijke data-driven verdict via structuur) vs stijfkoppigheid (vooraf-fout-gecalibreerde regel respecteren ondanks pre-data design-flaw-erkenning); (6) Cache-coherency `?v=<sessie>` bump werkt PREVENTIEF (pre-commit evaluatie Sessie 149 leerpunt) en REACTIEF (lokale stale-cache-symptoom-detectie Sessie 150) — sub-pad #33 (e) PARTIAL closed via main.css bump 20 HTML files; (7) Defense-in-depth 5 plekken NU schaalt over alle uitkomst-typen inclusief Frame A keep met spirit-rule-override en plan-table-design-flaw-erkenning (Sessie 150 nieuwe categorie). Defense-in-depth-persistence-pattern Sessie 140 → 145 → 146 → 147 → 148 → 149 → 150. Sessie 144 1-in-1-out → current.md. Volgende bulk-rotation Sessie 155.)
