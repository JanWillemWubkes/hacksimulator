# PLANNING.md - HackSimulator.nl

**Laatst bijgewerkt:** 05 jul 2026 (Sessie 194 — uitgestelde Sessie-193-punten: VFS-schema-signature op `hacksim_filesystem` (runtime djb2-hash over `initialFilesystem`, stale saves verworpen + notice), analytics-replay-guard, `[TIP]` renderer-branch; 4 punten document-and-accept. GEEN architectuur-wijziging — signature-veld valt binnen de bestaande localStorage-persistentie-architectuur (zelfde key, zelfde flow), geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 194: Sessie 193 — volledige tutorial-flow-audit, 18 fixes (A–P) in 4 gefaseerde commits: deep-link/welcome-coherentie, state-eerlijkheid (`completedScenarios`-hoist + `exit()` bewaart echt + tutorial⇄challenge exclusief), omgevings-robuustheid (NEW `src/tutorial/scenario-setup.js` VFS-fixture-hook + challenge-persistentie + order-lok-fixes), marker-unificatie + Type→Typ sweep + docs-correcties. GEEN architectuur-wijziging — de nieuwe `scenario-setup.js`-helper + `hacksim_active_challenge`-persist-key vallen binnen de bestaande M6-tutorial- + gamification- + static-site-architectuur (VFS-fixture-patroon, localStorage-persist zoals tutorial), geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 193: Sessie 192 — Tutorial-voltooiing past in beeld: inline-certificaat (~20 regels) uit de auto-voltooiing (blok 1,6× viewport verborg de next-step CTA onder de vouw); blok krimpt en past nu → scroll-anker `_scrollLineToTop`→`_scrollToBottom`, dode helper opgeruimd; certificaat blijft op klembord + `tutorial cert`. GEEN architectuur-wijziging — completion-render/scroll-gedrag binnen de bestaande M6-tutorial- + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 192: Sessie 191 — UX-fix voltooiingsscherm: mislabel "Type 'next' voor je volgende stap" + drievoudige "wat nu?"-CTA weg; één primaire `next`-CTA + secundaire browse-regel op 4 completion-renderers (tutorial+challenge, desktop+mobile) + `fundamentals.js`-box stopt met hardcoded `tutorial recon` (routering intact via `next`). GEEN architectuur-wijziging — completion-CTA-copy binnen de bestaande M6-tutorial- + gamification- + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 191: Sessie 190 — Bugfix tutorial/challenge-completion: laatste commando-output zichtbaar via scroll-anker op de commando-echo (`_scrollLineToTop`, was bodem-pin) + 3 timer-her-scrolls in `_revealCelebration` geschrapt; dubbele "Type 'next'" gedicht via pre-mutation `tutorialActiveAtStart`-guard. Gedeelde `renderCompletionBlock` → dekt tutorial én challenge. GEEN architectuur-wijziging — bugfix in terminal-renderer + execute-flow binnen de bestaande M6-tutorial- + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 190: Sessie 189 — Fase A: leerpad deep-link → in-app tutorial-landing (`main.js` leest `?tutorial=<id>` + gesequencete auto-start naar de MISSION BRIEFING, 3 leerpad-knoppen deep-linken, cache-bump `main.js?v=189-deeplink`, NEW `leerpad-deeplink.spec.js`). GEEN architectuur-wijziging — feature-implementatie binnen de bestaande M6-tutorial- + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 189: Sessie 188 — Eén coherente leerpad-ladder: leerpad-commando groepeert de 4 fases onder de 3 niveaus + per niveau een missie-brug naar de tutorial, homepage-chips kloppend (netcat/wireshark weg, hashcat→Expert), challenge-difficulty overal NL via gedeelde difficultyLabel() in 6 plekken (UI=NL-bug), commit aebcca3. GEEN architectuur-wijziging — UX-coherentie/copy binnen de bestaande M6-tutorial- + gamification-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 188: Sessie 187 — Fase B uitgevoerd: NEW fundamentals-scenario (Beginner, 7 stappen) + 4 her-tiering-labels (recon/privesc→Gevorderd, webvuln/exploitation→Expert) + funnel-doorwerking (next.js stage 0 / dashboard / certificate / tutorial-manpage), commit 3ac65aa. GEEN architectuur-wijziging — feature-implementatie binnen de bestaande M6-tutorial-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 187: Sessie 186 — Stap 0 ontwerpbeslissing leerpad-niveaus → tutorial-scenario's: doc-only ontwerpbeslissing onder het bestaande backlog-item "Leerpad deep-link naar in-app tutorials" (niveau→scenario→labelwijziging-mapping vastgelegd), GEEN architectuur-wijziging — geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 186: Sessie 185 — leerpad-sectie homepage: 3 knoppen naar dezelfde `/terminal.html` → mini-leerlijn (lezen → oefenen) met per-niveau `.leerpad-learn-link` "Lees eerst"-blogposts + uniform eerlijk knoplabel "Oefen in de terminal": GEEN architectuur-wijziging — HTML/CSS-content-verrijking + interne linking binnen het bestaande design-system (CSS Variables First, theme-aware `--color-text-dim`/`--color-cta-primary`) + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 185: Sessie 184 — blog in-content CTA-boxen visueel geünificeerd (gecentreerde `.blog-cta` → links uitgelijnd + blauwe linkerrand-accent, gelijk aan de product-kaarten; light-override want `--color-ui-primary` is groen in light): GEEN architectuur-wijziging — CSS-only design-system-consistentie binnen het bestaande design-system (CSS Variables First, `architecture-patterns.md` §1) + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 184: Sessie 183 — lead-magnet conversie/UX (signup-kaart zichtbaar als paneel via oppervlak-contrast `--color-bg-modal` + elevatie + mobiele grid-reorder) + dark-surface-audit (homepage-nieuwsbrief-band + 4 blog-kaarten gelift naar oppervlak-contrast, blog-palet groen→neutraal) + copy-feitencontrole tegen sample/19p-PDF: GEEN architectuur-wijziging — UX/CSS-zichtbaarheidsfix + copy binnen het bestaande design-system (CSS Variables First, bestaande `--color-bg-modal`/`--shadow-elevation-2`-tokens) + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 183: Sessie 182 — live zoekfilter op woordenlijst + commands via gedeelde `term-filter.js` + sticky-balk uitgelijnd op het `.page-section`-box-model + woordenlijst categorie-intro's + commands-koppen → woordenlijst-stijl, geen architectuur-wijziging: herbruikbare UI-module + CSS-uitlijning binnen het bestaande design-system + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 182: Sessie 181 — content-getallen drift-bestendig (gidsen-stats → open floors "12+"/"40+" + NEW validate-docs `--deep` Check 6c floor-assertie) + blog-table-stacked + over-ons-copy: GEEN architectuur-wijziging — content/CSS/tooling-fixes binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 181: Sessie 180 — blog-auteurschap terug naar merk (Organization) op 13 posts + persoonsnaam alleen op over-ons: GEEN architectuur-wijziging — content/SEO-metadata-fix (JSON-LD `author` Person→Organization + `article:author`-meta + zichtbare byline verwijderd) binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 180: Sessie 179 — klantgerichte copy-perfectionering (footer-tagline + hero-subtitle + "authentiek"-sweep): GEEN architectuur-wijziging — copy/content-fixes binnen het bestaande design-system + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 179: Sessie 178 — homepage lead-magnet: sectie-reorder (lead-magnet ná finale CTA → terminal-CTA krijgt het climax-moment na de FAQ-payoff) + `final-cta`-glow van zwevende onderrand-glow naar zelfstandige ambient-halo via homepage-gescopete `.final-cta:has(+ .lead-magnet)` (de 4 andere final-cta-pagina's houden de naad-uplight) + copy-perfectionering op 3 teasers (vloeiende titel "Zo begint een echte pentest" + de-jargon subtekst, geverifieerd tegen de echte 9-pagina PDF-inhoud). GEEN architectuur-wijziging: UX/CSS/content-fixes binnen het bestaande design-system (CSS Variables First, architecture-patterns.md §1) + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 178: Sessie 177 — terminal voltooid-markers [X]→[✓]: de renderer kleurt regels op hun eerste teken, dus [X] als "afgevinkt"-vinkje botste met de error-marker → rode checkboxes op mobiel (desktop verbergt het via het ASCII-kader) + doorlek naar ingesprongen regels; gemigreerd naar [✓] (groen, box blijft uitgelijnd) in 6 voortgangsweergaven (leerpad/challenge/achievements/tutorial/next), leerpad-inspringing 4→2 tegen doorlek, man-page-legenda glyph achteraan → wit; échte foutmeldingen + "NOOIT doen"-lijsten in security/netwerk-man-pages bewust rood (rood kruis = juist). GEEN architectuur-wijziging: bugfix in de terminal-renderer-marker-conventie binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 177: Sessie 176 — mobiele audit + 5 fixes: tabel-scroll blog/legal, CSP-geblokkeerde Consent Mode v2 defaults op 14 blogpagina's → extern `consent-default.js` (GDPR-gap, blog gemist bij Sessie-166 inline-script-externalisatie), emoji-cleanup legal → ASCII, contact-inputs 44px + `pages.css`-cache-normalisatie, terminal scroll-hint mobiel verborgen. GEEN architectuur-wijziging: de consent-fix vóltooit de Sessie-166 externalisatie (security-config binnen de bestaande "no backend"-architectuur, geen nonce/Edge-Function); CSS/content-fixes binnen het design-system; geen tech/design/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 176: Sessie 175 — layout-fixes `sample-pentest.html` (chevron-uitlijning `.arrow-glyph` + `.phase-arrow`-consolidatie; success-state vervangt het formulier met een huisstijl-paneel zónder nieuwe `!important` — specificiteit wint van Brevo's `sib-styles.css`; card-body-uitlijning via opt-in `min-height:2lh` gegate op de 3-koloms-breakpoint). GEEN architectuur-wijziging: CSS/JS-styling + bugfix binnen het bestaande design-system (CSS Variables First, architecture-patterns.md §1), geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 175: Sessie 174 — mobiele PDF-download fix sample-pentest lead magnet: betrouwbaar same-origin downloadpad dat Brevo's click-tracking-prefetch-404 omzeilt (`_headers` `/assets/samples/*` attachment→inline + download-knop in `#success-message` + noindex `sample-download.html` + `lead_magnet_download` GA4-event), double opt-in behouden. GEEN architectuur-wijziging: bugfix + content-pagina binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 174: Sessie 173 — launch-prep wo 24 juni: aankondigings-kit herplanned (do 18→wo 24 juni + schema voor beperkt venster) + launch-visuals geregenereerd (nieuw H-monogram) + homepage linkt nu alle 13 blogposts (5 cornerstones) → crawl-route + sitemap homepage lastmod→18 jun. Datum-discipline-correctie: fake-freshness dateModified-bump op 3 al-complete cornerstones teruggedraaid (runbook Fase 2 twee-staps-poort) + memory `feedback_preserve_plan_gates`. GEEN architectuur-wijziging: SEO/content/launch-doc binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 173: Sessie 172 — GSC "Verkopersvermeldingen"-fix op `gidsen.html` Product-markup (4 merchant-listing-velden eerlijk per digitaal download-product) + NEW per-gids cover-images via `scripts/build-product-covers.mjs` (SVG→PNG `@resvg/resvg-js`) + copy-correctie kaal "pay what you want" → vorm mét minimum. GEEN architectuur-wijziging: SEO-markup + content-assets + build-tooling binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 172: Sessie 171 — logo-herontwerp + asset-keten + brand-kit: generieke `>_` → eigen H-monogram door alle favicon/PWA/navbar/footer/og/PDF-assets, NEW `assets/brand/` kit, og-image `?v=2` cache-bust, build-time logo-sync uit canonieke `assets/brand/logo.svg`. GEEN architectuur-wijziging: asset/build-hygiene binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 171: Sessie 170 — structuuranalyse + veilige repo-opruiming: build-PDF's (`docs/products/*.pdf`, ~632 KB) uit git als herbouwbare artifacts (`.gitignore` + `git rm --cached`; `.typ`-bron + geserveerde `assets/samples/` blijven getrackt), provenance-header `build-pdfs.sh`, NEW `docs/architecture-review.md`. GEEN architectuur-wijziging: repo-/git-hygiene + docs binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 170: Sessie 169 — GSC-indexeringsanalyse + SEO-fix: 2 duplicaat-URL-bronnen weggehaald (blog-footer/welkom `index.html`-links → canonical `/blog/`+`/`), homepage blog-links 3→8 crawl-nudge, sitemap `lastmod` ververst. GEEN architectuur-wijziging: interne-link/SEO-correctie binnen de bestaande static-site-architectuur, geen tech/design/security-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 169: Sessie 168 — blog-tabel-uitlijning fix in `styles/blog.css` (scoped `.blog-post-content table/th/td` + `vertical-align: top`), GEEN architectuur-wijziging: CSS-styling binnen het bestaande design-system (CSS Variables First, architecture-patterns.md §1), geen tech/design/security-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 168: Sessie 167 — doc-drift fix M9: Sessie 162 esbuild content-hash post-launch-blok verplaatst uit de M9-sectie naar `## Post-MVP Features` (`--deep` Check 6 telde 19/24 vs tabel 19/19 doordat het blok als h3 binnen de M9-awk-range zat). Besluit (b): esbuild = nieuwe post-launch scope (PRD §13 no-build red line, besluit uitgesteld tot ná launch), geen M9-taak; M9 legitiem ✅ Voltooid sinds Sessie 110. Doc-only, geen architectuur-wijziging, PLANNING.md ownership ongewijzigd. Pre-Sessie 167: Sessie 166 — pre-launch security-audit + CSP-hardening doc-sync, geen architectuur-wijziging (CSP-hardening = security-config binnen de bestaande "no backend"-architectuur; geen nonce/Edge-Function = PRD §13 red line gerespecteerd). Pre-Sessie 166: Sessie 165 — /summary doc-sync only, geen architectuur-wijziging. Gumroad-producten kwaliteits-/feitencontrole (pagina-claims→echte PDF-telling 13/19/15/47, Krol-feitfout + ECLI-bronnen, helderheids-glosses CVE/CVSS/ICMP, OWASP-2025-namen exact, MailerLite→Brevo) = content-deliverable, geen tech/design/security-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 165: Sessie 164 — /summary doc-sync only, geen architectuur-wijziging. Blog feitencontrole 13 posts (feitelijke + juridische correcties + natrekbare bronblokken + OWASP 2025-kader) = content-deliverable, geen tech/design/security-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 164: Sessie 163 — /summary doc-sync only, geen architectuur-wijziging. nmap-profiel bug-report fix (substring `target.includes('192.168.1.1')` → exacte match) + cat.js-hardening (getPermissionTip geankerd op resolvedPath) + bug-klasse-audit (geen andere reachable bugs) = bugfix/hardening, geen tech/design/security-shift, PLANNING.md ownership ongewijzigd. NEW post-launch M9 esbuild content-hash cache-item genoteerd — architectuur-besluit (PRD §13 no-build red line) bewust uitgesteld tot ná launch. Pre-Sessie 163: Sessie 162 — /summary doc-sync only, geen architectuur-wijziging. Pre-launch visueel materiaal kit §4 (GIF + desktop/mobiele screenshots via NEW scripts/capture-launch-visuals.mjs, pure-JS GIF gifenc+pngjs) + kit §4 feitelijke correctie = content/tooling-deliverable, geen tech/design/security-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 162: Sessie 161 — /summary doc-sync only, geen architectuur-wijziging. Launch-aankondigings-kit Fase 4 groundwork (NEW docs/launch-announcement-kit.md) = content-deliverable, geen tech/design/security-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 161: Sessie 160 — /summary doc-sync only, geen architectuur-wijziging. Public-launch SEO-metadata prep: sitemap/feed drift-fix + validate-docs Check 9 (lastmod≥datePublished + RSS-count==blog-count) + pre-commit trigger-extension naar sitemap/feed/blog + GSC Domain-property launch + docs/public-launch-runbook.md. Disciplined-hybrid datum-strategie (historische datePublished behouden). Commits 0584b3e + 60f4429. PLANNING.md ownership ongewijzigd — perf/SEO-tooling-laag. Pre-Sessie 160: Sessie 159 — /summary doc-sync only, geen architectuur-wijziging. Item #23.2 M0-M4 permanent-SKIP closure ✅ CLOSED (documentation-of-intent, 12e uitkomst-categorie, ~30 min minimal scope). scripts/validate-docs.sh 3 comment-plekken — M0-M4 SKIP-notice gewijzigd van "apart fix-decision #23.2 nodig" naar "permanent by-design (frozen milestones; section [ ] = defer-to-M5/M4 testing of optional/Post-MVP — geen drift mogelijk)". Phase 1 analyse: M0-M4 drift structureel-by-design = semantic-difference tabel (MVP-essential subset) vs section (full-detail incl. defer/optional). Geen Check 6 extension nodig want detection-value = 0 voor frozen milestones. **Sessie 160 aanbeveling:** perf-audit §2j scope-design voor #33 (c) OF M8 feature-completion OF iets anders — Heisenberg-tussen-pauze besluit. PLANNING.md ownership ongewijzigd. Pre-Sessie 159: Sessie 158 — /summary doc-sync only, geen architectuur-wijziging. Item #23.1 validate-docs --deep Check 6 extension naar M5/M5.5/M9 + NEW Blog sub-check 6b CLOSED — tooling-infra zoals geïntroduceerd Sessie 140; PLANNING.md ownership ongewijzigd. Pre-Sessie 158: Sessie 155 — /summary doc-sync only, geen architectuur-wijziging. Item #36 (a) single-sessie 3-burst compression baseline-stability analysis ✅ CLOSED OUTCOME 4 (zero-code instrumentation, 60 LH@11 mobile runs verdeeld over 3 bursts × 10 INDEX + 10 BLOG sequential per Sessie 154 discipline #1 met 60 min cool-down tussen bursts). Alle 3 Sessie 154 secondary findings NIET reproduceer ≤1-of-3 bursts = sampling-burst-effect falsified. Direction-flip smoking gun (Full CV ratio per burst 2,62×/0,32×/1,04×). N=30 power-improvement falsifies Sessie 154 discovery MWU borderline (p=0,054 → p=0,4035). NEW finding: 3-burst ANOVA F p<0,001 alle metrics = global between-burst variance significant MAAR niet page-type-specific + niet patch-actionable. Cumulatieve #34 + #35 + #36 mechanism-isolation categorisch closure FINALISED via 4-sessie methodological-evolution-output (152 B + 153 D + 154 Outcome 4 + 155 Outcome 4). Spawn Sessie 156 = M6 Tutorial 3 last taken (M6 milestone 88%→100% closure). NEW Sessie 155 disciplines (4 items): (1) 3-burst compression als 6e verify-first cyclus-variant naast Frame A/B/C/D + distribution-analysis Sessie 154; (2) direction-flip detection per-burst CV ratio als sampling-burst-snapshot discriminator; (3) 3-burst ANOVA F-test detects time-varying within-canonical variance ORTHOGONAL aan per-page-type asymmetry; (4) N=30 power-improvement is structureel-discriminator voor borderline-significance. 10-sessie streak honest data-driven outcomes (7 falsificatie + 1 KEEP + 2 methodological-evolution-output). Bulk-rotation Sessie 155 trigger executed: sessies 149-153 archived → current.md, top-6 nu 154-155. Pre-Sessie 155: Sessie 154 Item #35 (b) AdSense-Auto-ads-state-machine state-leakage diagnostic ✅ CLOSED OUTCOME 4 (zero-code instrumentation, 20 sequential LH@11 mobile runs + scipy distribution-analysis op adsbygoogle.js bootstrap-time 3-metric decomposition). Full-bootstrap primary metric KS p=0,42 + MWU p=0,27 + CV-ratio 1,26× = beide criteria NIET confirmed = Sessie 153 page-type-asymmetric observation was sampling-noise op LCP-aggregaat. Per-stage decomposition finding (NEW Sessie 154 mechanism-categorie): opposing-direction variance-asymmetry per cascade-stage — discovery-queue INDEX > BLOG (CV 2,56× ASYMMETRIC state-machine-internal) + transfer-only BLOG > INDEX (1,94× borderline) CANCELLEN op aggregaat. Cumulatieve #34 mechanism-isolation closure-pad BEREIKT (152 B + 153 D + 154 Outcome 4 methodological-evolution-output). Spawn #36 multi-day baseline-stability. NEW Sessie 154 disciplines (11 items, focus: distribution-analysis als 5e verify-first cyclus-variant naast Frame A/B/C/D + per-stage primary-metric selection + bidirectional canary edge-case handling + 10-run sampling threshold). 9-sessie streak honest data-driven outcomes (7 falsificatie + 1 KEEP + 1 methodological-evolution-output). Pre-Sessie 154: Sessie 153 #34 (b) inline-CSS-only Frame D gray REVERT met conflicting-canonical-page-type-attribution + NEW bidirectional canary discipline. Pre-Sessie 153: Sessie 152 combo-pad #33 (b/d) housekeeping + #34 (a) preconnect-only Frame B NOISE-no-action REVERT met NEW cross-check-baseline-discipline. Pre-Sessie 152: Sessie 151 — /summary doc-sync only, geen architectuur-wijziging. Item #27 ✅ Frame C REVERT ad-bearing pages preconnect + inline critical-CSS (patch commit `a80e675` → revert commit `0354c7a`). Multi-page perf-audit Optie B-light op 17 ad-bearing pages: preconnect `pagead2.googlesyndication.com` + inline critical-CSS 6 selectoren (terminal.html lines 53-59 verbatim copy). **3-run LH@11 mobile canonicals mediaan delta:** Index | S1 LCP +99 NOISE | S2 FCP +270 ms ✗ C | S3 TBT +249 ms ✗ C | S5 CLS -0,073 A HIT |. Blog/nmap | S1 LCP +838 ms ✗ C | S2 FCP -140 ms A HIT | S3 TBT +294 ms ✗ C | S5 CLS 0 A HIT | S6 preconnect proof -95 ms / -62% A HIT clean |. **Variance-amplification:** POST-patch LCP-range 802-1111 ms vs PRE 123-144 ms = 6,5-7,7× variance-increase. Mechanism werkt clean MAAR introduceert timing-sensitivity voor AdSense backend variance + dependent-request-cascade. **6-op-rij Frame-falsificatie patroon HERVAT** na Sessie 150 Frame A break — Sessie 147 #29 patroon (resource-hint mechanism-proof werkend MAAR variance-cascade netto regressie) herhaalt op nieuw resource-type. Revert commit `0354c7a` (17 files / 170 del) + deploy ✓ pre-patch state. Spawn #34 mechanism-isolation onderzoek splits patch in (a) preconnect-only en (b) inline-CSS-only. Defense-in-depth 5 plekken. Sessie 145 1-in-1-out → current.md (top-6 nu 146-151). Pre-Sessie 151: Sessie 150 Item #32 ✅ + Item #33 (a) ✅ Frame A KEEP self-host Google Fonts (commit `14b0d44`).
**Status:** ✅ LIVE on Netlify | M5 Testing 91% | M5.5 Monetization deep (AdSense + Ko-fi + Brevo + Gumroad + Lead magnet) | M6 Tutorial 88% | M7 Gamification 100% | Blog content-pijler 12 posts live
**Verantwoordelijk:** Development Team
**Live URL:** https://hacksimulator.nl/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator

> **Scope van dit document:** Architectuur, tech rationale, design system, security/privacy strategie, performance principes, deployment. Voor milestone-percentages, task-counts, sprints, live metrics en monetization-stack-status → `TASKS.md` (single source of truth). Voor recent learnings → `.claude/CLAUDE.md`. Document-ownership-mapping in §Document Ownership.

---

## 📋 Document Doel

Dit document bevat de **technische planning en architecturale beslissingen** voor HackSimulator.nl. Voor product requirements zie `docs/prd.md`, voor dagelijkse taken zie `TASKS.md`, voor AI context zie `CLAUDE.md`.

---

## 🎯 Productvisie

### Missie
Een veilige, toegankelijke browser-based terminal simulator waar **Nederlandse beginners** de fundamenten van ethisch hacken kunnen leren door hands-on te oefenen met echte commando's, zonder installatie, registratie of risico.

### Kernwaarden
1. **Educatief:** Elk commando is een leermoment met context
2. **Veilig:** Alle activiteiten zijn gesimuleerd, geen echte systemen
3. **Toegankelijk:** Geen technische barrières, gewoon browser openen
4. **Authentiek:** Realistische commands en output (80/20 realisme)
5. **Ethisch:** Duidelijke focus op legaal en ethisch gebruik

### Doelgroep

**Primaire Filter:** Skill level = Beginners (geen tot minimale cybersecurity kennis)
**Secundaire Filter:** Passie = Enthousiastelingen die ethisch hacken willen leren

**Demografische Segmenten:**
- **Studenten (16-25 jaar):** IT-studie voorbereiding, praktijkervaring voor CV, beperkt budget, certificeringen
- **Career Switchers (25-45 jaar):** IT-professionals die transitie overwegen naar cybersecurity, validatie interesse, hogere koopkracht
- **Hobbyisten (Alle leeftijden):** Technologie-enthousiastelingen, nieuwsgierig door media, zelfgestuurd leren op eigen tempo

**Gemeenschappelijke Eigenschappen:**
- Geen voorkennis vereist in cybersecurity
- Wil exploreren zonder commitment of grote investering
- Heeft begeleiding/uitleg nodig (3-tier help systeem)
- Zoekt veilige omgeving zonder risico (gesimuleerd, geen echte systemen)

### Succes Definitie (MVP)
- **Primaire KPI:** Sessieduur > 2 minuten gemiddeld
- **Secundaire KPI:** 5+ commands per sessie
- **Tertiaire KPI:** 10%+ return rate binnen 7 dagen

---

## 🏗️ Architectuur Overzicht

### High-Level Architectuur

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    index.html                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │ Terminal UI  │  │   Onboarding │  │   Feedback   │ │ │
│  │  │   Component  │  │     Modal    │  │    Widget    │ │ │
│  │  └──────┬───────┘  └──────────────┘  └──────────────┘ │ │
│  │         │                                               │ │
│  │  ┌──────▼───────────────────────────────────────────┐  │ │
│  │  │         Terminal Engine (Core)                   │  │ │
│  │  │  ┌─────────────┐  ┌───────────┐  ┌────────────┐ │  │ │
│  │  │  │   Parser    │  │ Command   │  │   History  │ │  │ │
│  │  │  │             │  │ Registry  │  │  Manager   │ │  │ │
│  │  │  └─────┬───────┘  └─────┬─────┘  └────────────┘ │  │ │
│  │  │        │                │                         │  │ │
│  │  │  ┌─────▼────────────────▼───────────────────┐   │  │ │
│  │  │  │        Command Executors                 │   │  │ │
│  │  │  │  [System] [Filesystem] [Network] [Sec]   │   │  │ │
│  │  │  └──────┬───────────────────────────────────┘   │  │ │
│  │  └─────────┼──────────────────────────────────────┘  │ │
│  │            │                                          │ │
│  │  ┌─────────▼──────────────────────────────────────┐  │ │
│  │  │      Virtual Filesystem                        │  │ │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │  │ │
│  │  │  │ In-Memory│◄─┤localStorage│  │ Reset Logic │ │  │ │
│  │  │  │   State  │  │   Sync    │  │             │ │  │ │
│  │  │  └──────────┘  └──────────┘  └──────────────┘ │  │ │
│  │  └───────────────────────────────────────────────┘  │ │
│  │                                                       │ │
│  │  ┌───────────────────────────────────────────────┐  │ │
│  │  │           Support Systems                     │  │ │
│  │  │  • Help System (3-tier)                       │  │ │
│  │  │  • Analytics (GA4/Plausible)                  │  │ │
│  │  │  • Error Handler                              │  │ │
│  │  │  • Fuzzy Matcher                              │  │ │
│  │  └───────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Architectuur Principes

1. **Client-Side Only (MVP)**
   - Geen backend server nodig
   - Alle logica draait in browser
   - State management via localStorage
   - **Rationale:** Eenvoud, geen hosting kosten, maximale privacy

2. **Modular Command System**
   - Commands zijn zelfstandige modules
   - Registry pattern voor command discovery
   - Makkelijk uitbreidbaar (nieuwe commands toevoegen)
   - **Rationale:** Schaalbaarheid, onderhoudbaarheid, testbaarheid

3. **Separation of Concerns**
   - UI Layer: Rendering en user input
   - Core Layer: Business logic, command execution
   - Data Layer: Virtual filesystem, persistence
   - **Rationale:** Clean code, testbaarheid, wijzigingen geïsoleerd

4. **Progressive Enhancement**
   - Basis functionaliteit werkt overal
   - Enhanced features voor moderne browsers
   - Graceful degradation voor oudere browsers
   - **Rationale:** Maximale compatibility

---

## 💻 Technologie Stack

### Frontend

| Component | Technologie | Versie | Rationale |
|-----------|-------------|--------|-----------|
| **Language** | JavaScript | ES6+ (2015+) | Native browser support, geen transpiling |
| **Styling** | Vanilla CSS | CSS3 | Simpele UI, geen framework overhead |
| **HTML** | HTML5 | - | Semantisch, modern |

**Geen frameworks gebruikt:**
- ❌ React/Vue/Angular → Overkill voor terminal UI
- ❌ Tailwind → 20-50KB overhead, terminal UI is simpel
- ❌ jQuery → Native APIs zijn voldoende
- ❌ TypeScript → Extra build complexity, geen directe browser support

### Storage & Persistence

| Component | Technologie | Capacity | Purpose |
|-----------|-------------|----------|---------|
| **State** | localStorage | 5MB | Filesystem state, command history, preferences |
| **Session** | sessionStorage | 5MB | Temporary session data |
| **Cookies** | HTTP Cookies | 4KB | Analytics consent only |

**Rationale localStorage:**
- Synchronous API (simpeler dan IndexedDB)
- Voldoende capacity (filesystem + history < 1MB)
- Breed ondersteund (IE8+)

### Analytics & Monitoring

| Fase | Tool | Kosten | Features |
|------|------|--------|----------|
| **MVP** | Google Analytics 4 | Gratis | Events, funnels, real-time, IP anonymization |
| **Post-MVP** | Plausible Analytics | €9/mnd | Privacy-first, cookie-less, EU hosting, lightweight |

**Migration path:** GA4 → Plausible zodra budget en 10k+ visitors

### Development Tools

| Tool | Purpose | Required? |
|------|---------|-----------|
| **Code Editor** | VS Code / Cursor | ✅ Ja |
| **Browser DevTools** | Chrome/Firefox | ✅ Ja |
| **Git** | Version control | ✅ Ja |
| **Node.js** | Optional build scripts | ❌ Optioneel |
| **Live Server** | Local development | ✅ Ja (VS Code ext) |

**Build Tools (Optional):**
- **Minifier:** Terser (JS) + cssnano (CSS) - voor productie bundle
- **Bundler:** GEEN - bestanden direct in browser laden
- **Rationale:** Simpel houden, direct runnable code

### Browser Support

| Browser | Versions | Market Share | Priority |
|---------|----------|--------------|----------|
| Chrome | Last 2 | ~65% | 🔴 Critical |
| Firefox | Last 2 | ~10% | 🔴 Critical |
| Safari | Last 2 | ~15% | 🔴 Critical |
| Edge | Last 2 | ~5% | 🟡 Medium |
| Mobile Safari | iOS 14+ | ~3% | 🟡 Medium |
| Chrome Mobile | Android 10+ | ~2% | 🟡 Medium |

**Testing Matrix:**
- Desktop: Chrome (Windows), Firefox (Windows), Safari (macOS)
- Mobile: Safari (iOS 16+), Chrome (Android 12+)
- Responsive modes: 320px, 768px, 1024px, 1920px

---

## 📁 Project Structuur

```
hacksimulator/
├── index.html                 # Hoofd HTML bestand
├── CLAUDE.md                  # AI assistant context
├── PLANNING.md               # Dit bestand
├── TASKS.md                  # Takenlijst (nog aan te maken)
├── README.md                 # Project documentatie (nog aan te maken)
│
├── docs/                     # Product documentatie
│   ├── prd.md               # Product Requirements v1.8
│   └── commands-list.md     # Command specificaties
│
├── src/                     # Source code
│   ├── main.js              # Entry point, initialisatie
│   │
│   ├── core/                # Kern systeem
│   │   ├── terminal.js      # Terminal engine
│   │   ├── parser.js        # Command parser
│   │   ├── registry.js      # Command registry
│   │   └── history.js       # Command history manager
│   │
│   ├── commands/            # Command implementaties
│   │   ├── system/          # clear, help, man, history, echo, date, whoami
│   │   ├── filesystem/      # ls, cd, pwd, cat, mkdir, touch, rm, cp, mv, find, grep
│   │   ├── network/         # ping, nmap, ifconfig, netstat, whois, traceroute
│   │   ├── security/        # hashcat, hydra, sqlmap, metasploit, nikto
│   │   └── special/         # reset, continue, tutorial (fase 2)
│   │
│   ├── filesystem/          # Virtual filesystem
│   │   ├── vfs.js           # Virtual filesystem core
│   │   ├── structure.js     # Initial filesystem structure
│   │   └── persistence.js   # localStorage sync
│   │
│   ├── ui/                  # User interface
│   │   ├── renderer.js      # Output rendering
│   │   ├── input.js         # Keyboard handling
│   │   ├── autocomplete.js  # Tab completion
│   │   ├── mobile.js        # Mobile adaptations
│   │   └── onboarding.js    # First-time user experience
│   │
│   ├── utils/               # Utilities
│   │   ├── fuzzy.js         # Fuzzy matching voor typos
│   │   ├── formatter.js     # Output formatting (colors, styles)
│   │   ├── validator.js     # Input validation
│   │   └── helpers.js       # Generic helpers
│   │
│   ├── help/                # Help systeem
│   │   ├── help-system.js   # 3-tier help logic
│   │   ├── man-pages.js     # Manual pages (Nederlands)
│   │   └── tips.js          # Educatieve tips
│   │
│   └── analytics/           # Analytics & tracking
│       ├── tracker.js       # Analytics abstraction layer
│       ├── events.js        # Event definitions
│       └── consent.js       # Cookie consent management
│
├── styles/                  # CSS bestanden
│   ├── main.css             # Global styles + CSS Variables
│   ├── terminal.css         # Terminal-specific styles
│   ├── mobile.css           # Mobile adaptations
│   └── animations.css       # Cursor blink, transitions
│
├── assets/                  # Static assets
│   ├── legal/               # Legal documenten
│   │   ├── privacy.html     # Privacy Policy (Nederlands)
│   │   ├── terms.html       # Gebruiksvoorwaarden
│   │   └── cookies.html     # Cookie Policy
│   └── data/                # Static data
│       └── initial-fs.json  # Initial filesystem structure
│
└── tests/                   # Testing (toekomst)
    ├── unit/                # Unit tests
    ├── integration/         # Integration tests
    └── e2e/                 # End-to-end tests
```

**File Naming Conventions:**
- **kebab-case** voor bestanden: `command-parser.js`
- **camelCase** voor JavaScript functies/variabelen
- **PascalCase** voor classes
- **UPPERCASE** voor constanten

---

## 🔧 Benodigde Tools & Setup

### Minimale Vereisten (Verplicht)

1. **Code Editor**
   - **Aanbevolen:** VS Code of Cursor
   - **Extensies:**
     - Live Server (voor local development)
     - ESLint (code quality)
     - Prettier (code formatting)

2. **Web Browser**
   - Chrome (primary testing)
   - Firefox (cross-browser testing)
   - Safari (macOS, iOS testing)

3. **Git**
   - Voor version control (verplicht)
   - GitHub account (optioneel - voor remote repository en auto-deploy)

4. **Terminal / Command Line**
   - Bash/Zsh (macOS/Linux)
   - PowerShell/Git Bash (Windows)

### Optionele Tools (Nice to Have)

5. **Node.js & npm**
   - **Versie:** LTS (20.x+)
   - **Purpose:** Optional build scripts, minification
   - **Niet vereist voor development!** Code draait direct in browser

6. **Build Tools (Productie)**
   ```bash
   npm install --save-dev terser cssnano
   ```
   - Voor minification van JS en CSS
   - Alleen voor productie deployment

7. **Testing Tools (Toekomst)**
   - Jest (unit testing)
   - Playwright (E2E testing)
   - Lighthouse CI (performance testing)

### Development Environment Setup

```bash
# 1. Clone repository (indien GitHub gebruikt)
# Optie A: Vanaf GitHub
git clone https://github.com/[username]/hacksimulator.git
cd hacksimulator

# Optie B: Lokale Git repository (geen GitHub)
cd hacksimulator
git init

# 2. Open in editor
code .  # VS Code
cursor .  # Cursor

# 3. Start local server (VS Code Live Server extensie)
# Right-click index.html → "Open with Live Server"
# Of: gebruik Python SimpleHTTPServer
python -m http.server 8000

# 4. Open browser
# http://localhost:8000
```

### Browser DevTools Setup

**Chrome DevTools instellingen:**
- Console: Preserve log enabled
- Network: Disable cache (tijdens development)
- Application: Check localStorage contents
- Performance: Monitor load times

**Handige shortcuts:**
- `Cmd/Ctrl + Shift + C`: Inspect element
- `Cmd/Ctrl + Shift + J`: Console
- `Cmd/Ctrl + Shift + M`: Toggle device toolbar (mobile testing)

---

## 🎨 Design System

### CSS Variables (Theming)

```css
:root {
  /* Colors - Hacker Theme */
  --color-bg: #000000;
  --color-text: #00ff00;
  --color-text-dim: #00aa00;
  --color-error: #ff0000;
  --color-warning: #ffff00;
  --color-info: #00ffff;
  --color-success: #00ff00;

  /* Typography */
  --font-terminal: 'Courier New', 'Courier', monospace;
  --font-size-base: 16px;
  --font-size-mobile: 14px;
  --line-height: 1.5;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Layout */
  --terminal-padding: 20px;
  --terminal-max-width: 1200px;
  --mobile-breakpoint: 768px;

  /* Animations */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
}
```

**Toekomstige themes (post-MVP):**
- Light mode
- Colorblind-friendly
- High contrast

### Typography

- **Font family:** Monospace (terminal authentiek)
- **Base size:** 16px (desktop), 14px (mobile)
- **Line height:** 1.5 (leesbaarheid)
- **Font weight:** Normal (400) voor tekst, Bold (700) voor prompts

### Layout Principes

1. **Mobile-first:** Design voor kleinste scherm eerst
2. **Responsive breakpoints:**
   - Mobile: < 768px
   - Tablet: 768px - 1024px
   - Desktop: > 1024px
3. **Terminal centraal:** Volledige viewport height
4. **No scrolljacking:** Natuurlijk scroll gedrag

---

## 🔐 Security & Privacy

### Security Measures

1. **Content Security Policy (CSP)**
   ```html
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'self';
                  script-src 'self' https://www.googletagmanager.com;
                  style-src 'self' 'unsafe-inline';">
   ```

2. **Input Sanitization**
   - Alle user input escapen voor XSS preventie
   - Command arguments valideren
   - Geen `eval()` of `innerHTML` met user input

3. **localStorage Security**
   - Geen gevoelige data opslaan
   - Data is plain-text (geen credentials!)
   - Periodieke cleanup (oude sessions)

### Privacy Strategy

**Data Minimization:**
- ✅ Verzamel: Session duration, command counts, device type
- ❌ NIET: Command arguments, IP addresses, PII

**GDPR/AVG Compliance:**
- Cookie consent banner (first visit)
- Privacy Policy (Nederlands)
- Right to deletion (via contact)
- Data retention: max 14 maanden

**Analytics Migration Path:**
```
MVP Launch → GA4 (gratis)
   ↓
Month 4-6 → Evaluate traffic
   ↓
10k+ visitors → Migrate to Plausible (€9/mnd)
   ↓
Remove cookie banner → Better UX
```

---

## 📊 Performance Budgets

### Load Time Targets

| Metric | Target | Max |
|--------|--------|-----|
| First Contentful Paint | < 1.5s | 2.0s |
| Time to Interactive | < 2.5s | 3.0s |
| Largest Contentful Paint | < 2.0s | 2.5s |
| Cumulative Layout Shift | < 0.1 | 0.25 |

### Bundle Size Budget

**Budgetmodel (Sessie 140 — runtime vs SEO/content gescheiden, na bundle-explosie blog/lead-magnet):**

Site is sinds Sessie 100 (~983 KB) gegroeid naar **~2196 KB unminified** door content-investering (blog 369 KB met 12 posts + JSON-LD, screenshots/OG image 700+ KB). Origineel "totale site <1000 KB" budget bewust losgelaten ten faveure van SEO-content. Runtime-budget blijft strikt.

| Scope | Budget | Status |
|-------|--------|--------|
| **Terminal App Core (runtime van terminal.html)** — JS + core CSS + terminal.html geladen bij terminal-load | **<400 KB** (strikt) | ⚠️ **~781 KB unminified** gemeten Sessie 141 (HTML 19 KB + 6 CSS 160 KB + 99 JS module-graph 601 KB). Geschatte minified ~547 KB (70%-ratio). **Overschrijding ~37% boven budget zelfs minified** — Sessie 142 Lighthouse-meting onthulde echter dat eigen bundle NIET de performance-bottleneck is (zie SEO/content-pijler rationale hieronder + TASKS.md #25). Bundle-optimalisatie sprint (#24) ⏸️ paused tot na third-party perf research |
| **Per pagina** — HTML + page-specifieke CSS (homepage, blog post, sample-pentest) | <50 KB per pagina | ✅ Binnen budget |
| **SEO/content-pijler** — blog/ + assets/ (screenshots + OG image + sample-PDF) | Geen budget (bewust losgelaten) | ⚠️ Groei monitoren bij elke Lighthouse-audit |

**Rationale voor budget-split (Sessie 140):**
- Runtime (wat gebruikers laden bij terminal-gebruik) is de UX-kritieke maat → blijft strikt
- SEO/content (wat Google crawlt) is groei-as → budgetloos, mits Lighthouse Performance ≥90 blijft
- Live metrics per directory: zie TASKS.md §Huidige Focus

**Sessie 142 Lighthouse-meting — frame-bias-onthulling:**
- Productie /terminal.html gemeten: **Mobile 39/100, Desktop 64/100** Performance (beide ver onder 90-drempel)
- Resource-breakdown on-wire (Lighthouse audit): Total 624 KB / 118 requests | **first-party scripts ~98 KB gzipped (~93 files)** | **third-party scripts 353 KB / 10 requests (~57% van bundle: AdSense + GA + Brevo + Ko-fi + misc)** | fonts 100 KB | stylesheets 48 KB
- TBT 3,270 ms mobile / 610 ms desktop (target <300 ms) — hoofdoorzaak is third-party main-thread blocking, niet first-party bundle-grootte
- **Frame-bias inzicht:** "bundle-source size (~547 KB minified)" ≠ "on-wire transfer (~98 KB gzipped first-party)" ≠ "Lighthouse Performance score". Deze drie metrics zijn losjes gerelateerd; eerdere `<400 KB` budget-discussie ging over (1), maar Lighthouse meet via (2)+(3)+execution-time.
- **Implicatie voor #24 (Pad A lazy-load):** lazy-loaden van ~108 KB minified eigen code bespaart ~22 KB gzipped → niet relevant voor TBT 3.3 s die domineren wordt door third-party execution. Pad A blijft een geldige optimalisatie voor bundle-source budget, maar fixt de gemeten performance-regressie niet.
- **Performance-regressie sinds Sessie 100 (Lighthouse Perf 100/100/92/100):** veroorzaakt door monetization-stack toevoegingen (Sessies 117-137: AdSense + Ko-fi + Brevo + Gumroad + Lead-magnet trackers), niet door bundle-groei eigen code. M6 Tutorial + M7 Gamification + nieuwe commands tellen ~207 KB minified delta op (eigen code), wat ~40 KB gzipped on-wire is — verwaarloosbaar t.o.v. ~353 KB third-party.
- **Vervolg:** TASKS.md #25 — third-party perf research (~2 uur scope) inventariseert per script de revenue-vs-UX trade-off voorafgaand aan implementatie-beslissing. Item #24 heropent na #25 met mogelijk gecombineerde Pad A + Pad C aanpak.

**Optimization Strategy:**
- Netlify asset processing: CSS/JS/HTML minificatie + image compression
- Bronbestanden blijven leesbaar in repo (geen in-place minificatie)
- Gzip/Brotli compressie via Netlify CDN
- No images in terminal UI (text-only, 0 KB)
- Blog images: lazy-loaded (`loading="lazy"`) — onder-the-fold geen impact op LCP

### Monitoring

**Development:**
- Chrome DevTools Performance tab
- Lighthouse audits (target score: >90)

**Production:**
- GA4 page load times
- Web Vitals monitoring
- Error rate tracking

---

## 💰 Revenue Streams & Economics (architecturale principes)

**Hosting strategie (architecturaal):**
- MVP/Phase 1: Static site op Netlify, €1.25/maand (bandwidth only)
- Phase 3 (conditional, alleen bij MRR >€200/maand validatie): +backend (Netlify Functions of Railway €10/maand) + managed Postgres/Supabase (€50/maand)
- **Trigger voor backend-investering:** 60-80 uur dev-tijd alleen bij gevalideerde Phase 1 MRR

**Monetization-architectuur (5 streams, allen client-side voor MVP):**
1. **AdSense** display-ads (passieve revenue, GDPR-consent vereist via eigen banner)
2. **Ko-fi** donaties (lightweight iframe, geen consent vereist)
3. **Brevo newsletter** (lead generation → product-funnel)
4. **Gumroad products** (extern hosted checkout, embedded buy-buttons)
5. **Lead magnet** (Sample Pentest PDF → Brevo opt-in → upsell-flow)

**Break-even principe:** Dev-tijd is gemodelleerd op €50/uur. Phase 3 backend-build (60-80 uur, ~€3000-4000) wordt alleen geïnvesteerd bij ROI <5 maanden bij >5% conversie.

→ **Actuele revenue-projecties, scenario-tabellen, Phase 1/2/3 maandelijkse targets en break-even tijdlijnen:** zie TASKS.md `## 💰 Monetization-roadmap` (zodra geconsolideerd; tot die tijd staan oude projecties in commit-historie).

---

## 🧪 Testing Strategie

### Manual Testing (MVP)

**Required tests per command:**
1. ✅ Happy path (correcte input)
2. ✅ Error handling (verkeerde input)
3. ✅ Edge cases (lege args, special chars)
4. ✅ Mobile rendering (40 chars width)
5. ✅ Help/man pages aanwezig

**Cross-browser testing:**
- Chrome (Windows + macOS)
- Firefox (Windows)
- Safari (macOS)
- Mobile Safari (iOS real device)
- Chrome Mobile (Android real device)

### Beta Testing (Pre-Launch)

**Minimum 5 beta testers:**
- 2x beginners (no tech background)
- 2x IT students
- 1x experienced developer

**Test scenarios:**
1. First-time user flow (onboarding)
2. Command exploration (trial & error)
3. Error recovery (typos, wrong args)
4. Mobile experience
5. Return visit (localStorage restore)

**Feedback verzamelen:**
- Post-session survey (5 min)
- Screen recordings (met toestemming)
- Bug reports (GitHub issues)

### Automated Testing (Post-MVP)

**Unit tests (toekomst):**
- Command parsers
- Filesystem operations
- Help system logic

**E2E tests (toekomst):**
- Complete user flows
- Cross-browser automation
- Regression testing

---

## 🚀 Deployment Strategie

### Hosting Opties (MVP)

| Platform | Kosten | Features | Aanbeveling |
|----------|--------|----------|-------------|
| **Netlify** | Gratis | CDN, auto-deploy, SSL | ⭐ Beste |
| **Vercel** | Gratis | CDN, auto-deploy, SSL | ⭐ Goed |
| **GitHub Pages** | Gratis | Simpel, geen config | ✅ OK |
| **Cloudflare Pages** | Gratis | CDN, Workers | ✅ OK |

**Aanbeveling: Netlify**
- Gratis tier voldoende voor MVP
- Auto-deploy via Git
- Instant cache invalidation
- Custom domain support (hacksimulator.nl)
- Analytics (basic) included

### Deployment Proces

```bash
# 1. Build (optioneel - minification)
npm run build  # Creates /dist folder

# 2. Deploy (Netlify)
# Optie A: Drag & drop in Netlify UI (geen Git vereist)
# Optie B: Auto-deploy via Git (GitHub/GitLab integratie)
# Optie C: Netlify CLI
netlify deploy --prod

# 3. Verify
# Check: https://hacksimulator.nl
# Test: Load time, functionality, analytics
```

### Environment Configuratie

**Development:**
```javascript
const ENV = 'development';
const ANALYTICS_ENABLED = false;
const DEBUG_MODE = true;
```

**Production:**
```javascript
const ENV = 'production';
const ANALYTICS_ENABLED = true;
const DEBUG_MODE = false;
```

### Rollback Plan

- Git tags voor releases: `v1.0.0-mvp`
- Netlify rollback (1-click in UI)
- Backup van localStorage structure (JSON export)

---

## 📅 Roadmap & Fases (high-level architectuur)

> Dit is een high-level fase-overzicht voor architecturale context. Voor actuele milestone-percentages, task-counts, sprints en open items: zie `TASKS.md` (single source of truth).

### Fase 1: MVP (M0-M5.5) — ✅ LIVE
**Architecturale scope:** Vanilla JS/CSS client-side terminal simulator + virtual filesystem + 41 commands + 3-tier help system + onboarding + analytics (GA4) + legal compliance + monetization-stack (AdSense + Ko-fi + Brevo + Gumroad + Lead magnet).

### Fase 2: Tutorials & Scaling (M6 + M8)
**Architecturale scope:** Tutorial state-machine + scenario-registry pattern + Help paging system (conditional bij 50+ commands) + Plausible migratie (privacy-first, cookie-loos).

### Fase 3: Gamification (M7) — ✅ VOLTOOID
**Architecturale scope:** Challenge engine + badge-manager + certificate-generator + dashboard + leaderboard. Lokale persistentie via localStorage (`hacksim_gamification`).

### Fase 4: Content-pijler (Blog) — ✅ LIVE
**Architecturale scope:** 10 educatieve posts + JSON-LD schema + internal cross-linking + unified marketing nav (`getMarketingNavbar()`) + breadcrumbs + BreadcrumbList schema. Validation via `scripts/validate-blogs.sh` pre-commit hook (5 structurele checks).

---

## 🔄 Document Ownership (Sessie 140 — refactor van oude Sync Protocol)

**Eén bron per type informatie.** Geen duplicatie tussen docs.

| Document | Owns | Update-trigger |
|----------|------|----------------|
| `docs/prd.md` | Product requirements, scope, success criteria, success-definitie | Handmatig bij PRD-revisie |
| **`PLANNING.md`** (dit doc) | Architectuur, tech rationale, design system, security/privacy strategie, performance principes (budgets), deployment-strategie, monetization-architectuur (streams + hosting cost-principes, niet specifieke maandtargets) | Handmatig bij architectuur-change |
| **`TASKS.md`** | Execution-tracking: milestones, tasks, sprints, percentages, live metrics (bundle, tests), monetization-stack-status, revenue-data, sessie-counter | `/summary` command-flow (zie `.claude/CLAUDE.md §Sessie Protocol`) |
| **`.claude/CLAUDE.md`** | AI-context, tone, do/don'ts, top-6 sessie-learnings, sessie-protocol-instructies | `/summary` command-flow |
| `docs/sessions/current.md` | Volledig sessie-log archief vanaf rotation-cutoff | `/summary` command-flow |
| `scripts/validate-docs.sh` | Drift-detection: cross-doc invariants als pre-commit hook | Pre-commit (forcing function) |

**Wanneer dit document updaten:**
1. Nieuwe architecturale beslissingen (modular pattern, state-management-keuze)
2. Tech stack wijzigingen (nieuwe library, framework, build-tool)
3. Tool toevoegingen (linter, test-runner, validator)
4. Performance budget aanpassingen
5. Security/privacy strategie aanpassingen
6. Roadmap fase-definities (niet task-niveau — dat woont in TASKS.md)

**NIET hier updaten (woont elders):**
- Milestone-percentages → TASKS.md
- Sprint-status → TASKS.md
- Sessie-counter → `.claude/CLAUDE.md` + TASKS.md
- Live metrics (bundle KB, test counts) → TASKS.md
- Monetization-targets per maand → TASKS.md

**Forcing function:** `scripts/validate-docs.sh` als pre-commit hook detecteert drift tussen docs (sessie-counter mismatch, datum-incongruentie, PRD-version-skew). Commits met drift worden geblokkeerd.

---

## 📚 Referenties & Resources

**Interne Documentatie:**
- `docs/prd.md` - Product Requirements v1.8
- `docs/commands-list.md` - Command specificaties
- `CLAUDE.md` - AI assistant context
- `TASKS.md` - Dagelijkse takenlijst (aan te maken)

**Externe Resources:**
- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript/CSS reference
- [Web.dev](https://web.dev/) - Performance best practices
- [OWASP](https://owasp.org/) - Security guidelines
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility

**Community:**
- GitHub repository: https://github.com/JanWillemWubkes/hacksimulator
- Discord/Slack: [TBD - post-MVP]

---

## 🎓 Sessie Learnings (uit Ontwikkeling)

### Cursor Implementation (Sessie 3 - 14 oktober 2025)

**Beslissing:** Native browser cursor i.p.v. custom cursor

**Rationale:**
- ✅ Browser handelt positioning automatisch correct af
- ✅ Geen JavaScript nodig voor cursor sync tijdens typen
- ✅ Simpeler en robuuster (vanilla JS principe)
- ✅ Cleaner code, minder bytes (bundle size kritisch)
- ✅ Geen edge cases (emoji, unicode, font-width berekeningen)

**Verwijderd:**
- Custom cursor HTML element
- CSS `--cursor-blink` variable
- CSS `@keyframes cursor-blink` animation
- CSS `#terminal-cursor` styling rules
- Total: 30+ regels code verwijderd

**Behouden:**
- Native cursor: `caret-color: #00ff00` (groen, zichtbaar)

**Saved:** ~30 regels CSS/JS, betere performance, minder complexity

**Reference:** CLAUDE.md Sessie 3 voor volledige details

**Key Learning:**
> "Gebruik native browser features waar mogelijk. Custom cursor = 30+ regels CSS+JS. Native cursor = 1 regel CSS. Performance > Aesthetics."

---

**Laatst bijgewerkt:** 05 jul 2026 (Sessie 194)
**Versie:** 4.25 (Sessie 193 noot — volledige tutorial-flow-audit, 18 fixes (A–P) in 4 commits: deep-link/welcome-coherentie + state-eerlijkheid (`completedScenarios`-hoist + `exit()` bewaart echt + tutorial⇄challenge exclusief) + omgevings-robuustheid (NEW `src/tutorial/scenario-setup.js` VFS-fixture-hook + `hacksim_active_challenge`-persist + order-lok-fixes) + marker-unificatie + Type→Typ + docs. GEEN architectuur-wijziging — `scenario-setup.js`-helper + persist-key binnen de bestaande M6-tutorial- + gamification- + static-site-architectuur (VFS-fixture-patroon, localStorage-persist zoals tutorial), geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd) | 4.24 (Sessie 192 noot — Tutorial-voltooiing past in beeld: inline-certificaat (~20 regels) uit de auto-voltooiing (blok 1,6× viewport verborg de next-step CTA onder de vouw); blok krimpt en past nu → scroll-anker `_scrollLineToTop`→`_scrollToBottom` + dode helper opgeruimd; certificaat blijft op klembord + `tutorial cert`; cache-bump `main.js?v=192-completion-fit`. GEEN architectuur-wijziging — completion-render/scroll-gedrag binnen de bestaande M6-tutorial- + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd) | 4.23 (Sessie 191 noot — UX-fix voltooiingsscherm: mislabel "Type 'next' voor je volgende stap" + drievoudige "wat nu?"-CTA weg; één primaire `next`-CTA + secundaire browse-regel op 4 completion-renderers (tutorial+challenge, desktop+mobile) + `fundamentals.js`-box stopt met hardcoded `tutorial recon` (routering intact via `next`); cache-bump `main.js?v=191-completion-cta`. GEEN architectuur-wijziging — completion-CTA-copy binnen de bestaande M6-tutorial- + gamification- + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd) | 4.22 (Sessie 190 noot — Bugfix tutorial/challenge-completion: laatste commando-output zichtbaar via scroll-anker op de commando-echo (`_scrollLineToTop`, was bodem-pin) + 3 timer-her-scrolls geschrapt; dubbele "Type 'next'" gedicht via pre-mutation `tutorialActiveAtStart`-guard; gedeelde `renderCompletionBlock` dekt tutorial én challenge; cache-bump `main.js?v=190-completion-scroll`; regressie-assertie in `fundamentals.spec.js`. GEEN architectuur-wijziging — bugfix in terminal-renderer + execute-flow binnen de bestaande M6-tutorial- + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd) | 4.21 (Sessie 189 noot — Fase A: leerpad deep-link → in-app tutorial-landing: `main.js` leest `?tutorial=<id>` + gesequencete auto-start naar de MISSION BRIEFING (briefing = held: scroll+focus; welcome niet gecondenseerd), 3 leerpad-knoppen deep-linken + labels "Start de <Niveau>-missie", one-shot analytics-source in `tutorial-manager.js`, cache-bump `main.js?v=189-deeplink`, NEW `leerpad-deeplink.spec.js`. GEEN architectuur-wijziging — feature-implementatie binnen de bestaande M6-tutorial- + static-site-architectuur (client-side, no backend), geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Sluit de boog "Leerpad deep-link" Stap 0+B+A. Pre-Sessie 189: Sessie 188 noot — Eén coherente leerpad-ladder: leerpad-tiers + missie-bruggen + homepage-chips kloppend + challenge-difficulty NL (6 plekken), commit aebcca3; GEEN architectuur-wijziging, UX-coherentie binnen bestaande M6/gamification) | 4.19 (Sessie 187 noot — Fase B uitgevoerd: fundamentals-scenario + her-tiering difficulty-labels + funnel-doorwerking, commit 3ac65aa; GEEN architectuur-wijziging, feature binnen bestaande M6-tutorial-architectuur) | 4.18 (Sessie 186 noot — Stap 0 ontwerpbeslissing leerpad-niveaus → tutorial-scenario's: doc-only ontwerpbeslissing onder bestaand backlog-item, geen architectuur-wijziging, PLANNING.md ownership ongewijzigd. Pre-Sessie 186: Sessie 185 noot — leerpad-sectie homepage: 3 knoppen naar dezelfde `/terminal.html` → mini-leerlijn (lezen → oefenen) met per-niveau `.leerpad-learn-link` "Lees eerst"-blogposts + uniform eerlijk knoplabel "Oefen in de terminal" + NEW `.leerpad-cta-group` (`margin-top:auto` lijnt CTA-paren uit); geen architectuur-wijziging: HTML/CSS-content-verrijking + interne linking binnen het bestaande design-system (CSS Variables First, theme-aware `--color-text-dim`/`--color-cta-primary`, architecture-patterns.md §1) + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Sessie 184 noot — blog in-content CTA-boxen visueel geünificeerd: gecentreerde `.blog-cta` (de enige outlier op de blog-brede links+linkerrand-accent aside-taal) → links uitgelijnd + blauwe accent-stripe gelijk aan de product-kaarten + light-override (`--color-ui-primary` is groen in light → accent blijft blauw), `.blog-cta-product` geslankt; geen architectuur-wijziging: CSS-only design-system-consistentie binnen het bestaande design-system (CSS Variables First, architecture-patterns.md §1) + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Sessie 183 noot — lead-magnet conversie/UX + dark-surface-audit (oppervlak-contrast) + copy-feitencontrole, geen architectuur-wijziging. Sessie 182 noot — live zoekfilter op woordenlijst + commands via NEW gedeelde `src/ui/term-filter.js` (kern + dunne per-pagina wrappers) + sticky-balk uitgelijnd op het `.page-section`-box-model + woordenlijst categorie-intro's + commands-categoriekoppen → woordenlijst-stijl (links/groen/divider), geen architectuur-wijziging: herbruikbare UI-module + CSS-uitlijning binnen het bestaande design-system (CSS Variables First, architecture-patterns.md §1) + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 182: Sessie 181 noot — content-getallen drift-bestendig (gidsen-stats → open floors + NEW validate-docs `--deep` Check 6c floor-assertie `geclaimd ≤ ground-truth`) + blog-table-stacked + over-ons-copy, geen architectuur-wijziging: content/CSS/tooling-fixes binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Pre-Sessie 181: Sessie 180 noot — blog-auteurschap terug naar merk (Organization) op 13 posts (`article:author`→merk + JSON-LD `author` Person→Organization + zichtbare byline verwijderd) + persoonsnaam alleen op over-ons (founder-schema + LinkedIn behouden als vertrouwensanker), geen architectuur-wijziging: content/SEO-metadata-fix binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Sessie 179 noot — klantgerichte copy-perfectionering: footer-tagline "absolute beginners" → traject-framing + hero-subtitle herschreven (demografisch label + onware veiligheidsclaim → "veilige simulatie ... zonder echte gevolgen") + "authentieke commands" → "commands uit de praktijk" sweep op 9 user-facing plekken, geen architectuur-wijziging: copy/content-fixes binnen het bestaande design-system + static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Sessie 178 noot — homepage lead-magnet: sectie-reorder (lead-magnet ná finale CTA) + `final-cta`-glow zwevende onderrand → zelfstandige ambient-halo via homepage-gescopete `.final-cta:has(+ .lead-magnet)` + copy-perfectionering op 3 teasers (titel + de-jargon subtekst, geverifieerd tegen echte PDF-inhoud), geen architectuur-wijziging: UX/CSS/content binnen bestaande design-system + static-site-architectuur, PLANNING.md ownership ongewijzigd. Sessie 177 noot — terminal voltooid-markers [X]→[✓]: rode-checkbox-botsing op mobiel systemisch gefixt (renderer kleurt op 1e teken; [X] als afgevink-vinkje botste met error-marker + doorlek; [✓] in 6 voortgangsweergaven + leerpad-inspringing 4→2 + man-page-legenda glyph achteraan; échte fouten + man-page-"NOOIT doen"-lijsten bewust rood), geen architectuur-wijziging: bugfix in de terminal-renderer binnen de bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Sessie 176 noot — mobiele audit + 5 fixes (tabel-scroll blog/legal, CSP/consent-extern op 14 blogpagina's = GDPR-gap-fix die de Sessie-166 externalisatie voltooit, emoji-cleanup legal → ASCII, contact-inputs 44px + pages.css-cache-normalisatie, terminal scroll-hint mobiel verborgen), geen architectuur-wijziging: security-config + CSS/content binnen de bestaande static-site-architectuur, geen nonce/Edge-Function/tech/design/deployment-shift, PLANNING.md ownership ongewijzigd. Sessie 175 noot — layout-fixes sample-pentest (chevron/success-state/card-uitlijning), specificiteit boven `!important`, geen architectuur-wijziging: CSS/JS-styling binnen bestaande design-system, PLANNING.md ownership ongewijzigd. Sessie 174 noot — mobiele PDF-download fix sample-pentest (betrouwbaar same-origin downloadpad omzeilt Brevo's tracking-prefetch-404; `_headers` attachment→inline + download-knop in `#success-message` + noindex `sample-download.html` + GA4 download-event), geen architectuur-wijziging: bugfix + content-pagina binnen bestaande static-site-architectuur, geen tech/design/security/deployment-shift, PLANNING.md ownership ongewijzigd. Sessie 173 noot — launch-prep (kit-herplan + visuals + homepage cornerstone-linking + datum-discipline-correctie), geen architectuur-wijziging: SEO/content/launch-doc binnen bestaande static-site-architectuur, PLANNING.md ownership ongewijzigd. Sessie 170 noot — structuuranalyse + veilige repo-opruiming: build-PDF's untracked (herbouwbaar uit `.typ`) + provenance-header `build-pdfs.sh` + NEW `docs/architecture-review.md`, geen architectuur-wijziging: repo-/git-hygiene + docs binnen bestaande static-site-architectuur, PLANNING.md ownership ongewijzigd. Sessie 169 noot — GSC-indexeringsanalyse + SEO-fix (duplicaat-URL-bronnen + crawl-nudge + sitemap lastmod), geen architectuur-wijziging: interne-link/SEO-correctie binnen bestaande static-site-architectuur, PLANNING.md ownership ongewijzigd. Sessie 168 noot — blog-tabel CSS-uitlijning fix (`vertical-align: top`), geen architectuur-wijziging. Sessie 167 noot — doc-drift fix M9: esbuild content-hash post-launch-blok verplaatst uit M9-sectie naar Post-MVP Features (besluit (b): nieuwe post-launch scope, geen M9-taak), geen architectuur-wijziging, PLANNING.md ownership ongewijzigd. Pre-Sessie 167: Sessie 166 noot — pre-launch security-audit + CSP-hardening = security-config binnen bestaande no-backend-architectuur, geen architectuur-wijziging, PLANNING.md ownership ongewijzigd. Pre-Sessie 166: Sessie 165 noot — Gumroad-producten kwaliteits-/feitencontrole = content-deliverable, geen architectuur-wijziging, PLANNING.md ownership ongewijzigd. Pre-Sessie 165: Sessie 164 noot — blog feitencontrole 13 posts (feitelijke/juridische correcties + OWASP 2025-kader + bronblokken) = content-deliverable, geen architectuur-wijziging, PLANNING.md ownership ongewijzigd. Commit `57dd28f`. Pre-Sessie 164: Sessie 163 noot — nmap-profiel bugfix + cat.js-hardening + bug-klasse-audit = bugfix/hardening, geen architectuur-wijziging, PLANNING.md ownership ongewijzigd. NEW post-launch M9 esbuild content-hash cache-item genoteerd (besluit uitgesteld tot ná launch). Pre-Sessie 163: Sessie 162 noot — Pre-launch visueel materiaal kit §4 (GIF + screenshots via NEW scripts/capture-launch-visuals.mjs) + kit §4 feitelijke correctie = content/tooling-deliverable, geen architectuur-wijziging, PLANNING.md ownership ongewijzigd. Pre-Sessie 162: Sessie 161 noot — Launch-aankondigings-kit (docs/launch-announcement-kit.md) = content-deliverable Fase 4, geen architectuur-wijziging, PLANNING.md ownership ongewijzigd. Pre-Sessie 161: Sessie 160 noot — public-launch SEO-metadata prep: sitemap/feed drift-fix + validate-docs Check 9 + pre-commit trigger-extension + GSC Domain-property launch + docs/public-launch-runbook.md. Disciplined-hybrid datum-strategie (historische datePublished behouden). Geen architectuur-wijziging — perf/SEO-tooling-laag, PLANNING.md ownership ongewijzigd. Pre-Sessie 160: Sessie 159 noot — Item #23.2 M0-M4 permanent-SKIP closure ✅ CLOSED via documentation-of-intent (12e uitkomst-categorie, ~30 min minimal scope). scripts/validate-docs.sh 3 comment-plekken — M0-M4 SKIP-notice gewijzigd naar "permanent by-design (frozen milestones)". Geen architectuur-wijziging — minimal-closure backlog-hygiene, PLANNING.md ownership ongewijzigd. **NEW Sessie 159 disciplines (3):** (1) Pivot-rationalisatie zonder Explore-onderzoek van pivot-target — initiële #33 (c) "anti-overspecialisatie-pivot" aanbeveling geweerd na Explore toonde target niet-ready; (2) Plan-assumption verifieer pre-data ook voor self-authored plans — #23.2 had geen formele TASKS.md backlog entry; (3) Documentation-of-intent als 12e uitkomst-categorie naast Frame A/B/C/D + distribution-analysis + 3-burst compression + feature-completion + infra-investment + infra-investment-extension. 14-sessie streak honest data-driven outcomes (7 falsificatie + 1 KEEP + 2 methodological-evolution-output + 3 feature-completion + **1 documentation-of-intent**). Pre-Sessie 159: Sessie 158 noot — `scripts/validate-docs.sh --deep` Check 6 extension naar M5/M5.5/M9 + NEW Blog sub-check 6b via item #23.1 closure. Geen architectuur-wijziging — extension van Sessie 157 infra-investment categorie, PLANNING.md ownership ongewijzigd. Pre-Sessie 158: Sessie 157 noot — `scripts/validate-docs.sh --deep` mode geïmplementeerd via item #23 closure (3 nieuwe checks: Bundle KB ground-truth + Milestone-percentage ground-truth + Cross-doc Versie consistency CLAUDE.md ↔ TASKS.md). Geen architectuur-wijziging — validate-docs blijft tooling-infra zoals geïntroduceerd Sessie 140; PLANNING.md ownership ongewijzigd. Pre-Sessie 157: Sessie 156 M6 Tutorial 3 last taken pivot ✅ M6 100% closure (long-press hint gesture + beta protocol-doc), geen architectuur-wijziging. Pre-Sessie 156: Sessie 155 doc-sync, geen architectuur-wijziging. Item #36 (a) single-sessie 3-burst compression baseline-stability analysis ✅ CLOSED OUTCOME 4. Zero-code instrumentation cyclus (60 LH@11 mobile runs verdeeld over 3 bursts × 10 INDEX + 10 BLOG sequential per Sessie 154 discipline #1 + 60 min cool-down tussen bursts + scipy 3-burst ANOVA F-test + N=30 KS+MWU + per-burst CV-asymmetry tracking + bidirectional canary per burst). Alle 3 Sessie 154 secondary findings NIET reproduceer = sampling-burst-effect falsified. Direction-flip smoking gun + N=30 power-improvement falsifies discovery MWU borderline. NEW finding: 3-burst ANOVA F p<0,001 alle metrics = global between-burst variance structureel MAAR niet page-type-specific + niet patch-actionable. Cumulatieve #34 + #35 + #36 categorisch closure FINALISED via 4-sessie methodological-evolution-output. Spawn Sessie 156 = M6 Tutorial 3 last taken. NEW Sessie 155 disciplines (4): 3-burst compression als 6e cyclus-variant + direction-flip detection + 3-burst ANOVA orthogonal + N=30 power-improvement. 10-sessie streak (7 falsificatie + 1 KEEP + 2 methodological-output). Bulk-rotation Sessie 155 trigger executed. Pre-Sessie 155: Sessie 154 Item #35 (b) AdSense-Auto-ads-state-machine state-leakage diagnostic ✅ CLOSED OUTCOME 4. Zero-code instrumentation cyclus (20 sequential LH@11 mobile runs + scipy distribution-analysis). Cumulatieve #34 mechanism-isolation closure-pad BEREIKT via methodological-evolution-output (152 B + 153 D + 154 Outcome 4 = combined-mechanism-cascade-interactie + opposing-direction per-stage asymmetry pattern verklaart Sessie 151 #27 destructive variance-amplification). Per-stage decomposition finding als nieuwe mechanism-categorie (discovery-queue INDEX > BLOG CV 2,56× state-machine-internal + transfer-only BLOG > INDEX 1,94× borderline opposing-direction). Spawn #36 multi-day baseline-stability. NEW Sessie 154 disciplines (11 items): distribution-analysis als 5e verify-first cyclus-variant + per-stage primary-metric selection + bidirectional canary edge-case + N≥10 sampling threshold + concurrent-LH contention + jq dry-test JSON schema + AskUserQuestion verdict-decision + categorical closure via methodological-evolution. 9-sessie streak honest data-driven outcomes (7 falsificatie + 1 KEEP + 1 methodological-output). Pre-Sessie 154: Sessie 153 #34 (b) Frame D gray REVERT + NEW bidirectional canary. Pre-Sessie 153: Sessie 152 #34 (a) Frame B NOISE-no-action REVERT met NEW cross-check-baseline-discipline. Pre-Sessie 152: Sessie 151 doc-sync, geen architectuur-wijziging. Item #27 ✅ Frame C REVERT — ad-bearing pages preconnect + inline critical-CSS variance-amplification. 6-op-rij Frame-falsificatie patroon HERVAT na Sessie 150 Frame A break. Sessie 147 #29 resource-hint mechanism-proof-werkend MAAR variance-cascade-regressie patroon herhaalt op nieuw resource-type (preconnect vs modulepreload). Spawn #34 mechanism-isolation onderzoek splits patch in (a) preconnect-only + (b) inline-CSS-only naar separate cycli. Defense-in-depth 5 plekken. **Nieuwe disciplines Sessie 151:** (1) Plan-agent CLI-syntax-claims pattern generaliseert naar alle goedgekeurde plan-files inclusief self-authored — dry-test voor eerste loop; (2) Single Frame A streak ≠ guarantee — anti-rationalisatie-discipline structureel via Frame-falsificatie als norm; (3) Playwright MCP timing-meting kwetsbaar voor session-contamination + consent.js dynamic-script-injection — LH `audits.network-requests` als fresh-Chrome-per-run single-source-of-truth voor preconnect-style mechanisms; (4) Phase 1 file-state-surprise direct AskUserQuestion (animations.css-absence-discovery leidde tot Optie B-classic→B-light scope-aanpassing); (5) Variance-amplification als nieuwe mechanism-categorie audit-doc §2f. Sessie 145 1-in-1-out → current.md (top-6 nu 146-151). Pre-Sessie 151: Sessie 150 Item #32 + #33 (a) Frame A KEEP.
**Status:** ✅ Deployed - Live in Production | M5.5 Monetization stack deep + Brevo deliverability getuned | M7 Gamification ✅ 100% | Blog content-pijler live
**Live URL:** https://hacksimulator.nl/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator
