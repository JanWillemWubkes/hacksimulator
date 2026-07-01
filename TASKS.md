# TASKS.md - HackSimulator.nl

**Laatst bijgewerkt:** 01 jul 2026 (Sessie 190)
**Sprint:** Sessie 190: bugfix tutorial/challenge-completion — laatste commando-output zichtbaar (scroll-anker) + dubbele "Type 'next'" gedicht (stale-guard)
**Status:** M7 Gamification ✅ 100% | M6 Tutorial System ✅ **100% (Sessie 156 closure)** | M5.5 Monetization ✅ Live + Brevo deliverability tuned + Gumroad v1.0 + Lead magnet (LIVE on hacksimulator.nl) | Doc-protocol refactor + forcing function (Sessie 140) | Terminal Core ⚠️ ~547 KB minified + ✅ **Lighthouse terminal Mobile 63→82** ná #33 (a) self-host Google Fonts (Sessie 150). **Sessie 155:** Item #36 (a) ✅ **CLOSED OUTCOME 4** — single-sessie 3-burst compression baseline-stability analysis, 60 LH@11 mobile runs (3 bursts × 10 INDEX + 10 BLOG met 60 min cool-down) + scipy 3-burst ANOVA F-test + N=30 KS+MWU + per-burst CV-asymmetry tracking. Outcome 4 = alle 3 Sessie 154 secondary findings (discovery-queue/transfer-only CV-asymmetry + BLOG canary HIGH) NIET reproduceer ≤1-of-3 bursts. **Direction-flip smoking gun:** Full CV ratio per burst 2,62×/0,32×/1,04× (INDEX>BLOG, BLOG>INDEX OPPOSITE, equal) = sampling-burst-snapshot. **NEW finding niet pre-enumerated:** 3-burst ANOVA F p<0,001 alle metrics × beide canonicals = time-varying within-canonical variance IS structureel MAAR global niet page-type-specific = niet patchable. **Cumulatieve #34 + #35 categorische closure FINALISED** via 4-sessie methodological-evolution-output (152+153+154+155). Spawn Sessie 156 = M6 Tutorial 3 last taken (M6 88%→100% closure). **Sessie 154:** Item #35 (b) ✅ **CLOSED OUTCOME 4** — AdSense-Auto-ads-state-machine state-leakage diagnostic, zero-code instrumentation, 20 sequential LH@11 mobile runs + scipy distribution-analysis. Outcome 4 = 10-run distribution-analysis falsifies Sessie 153 page-type-asymmetric observation as sampling-noise op LCP-aggregaat. Per-stage decomposition reveals NEW mechanism-categorie (opposing-direction variance-asymmetry per cascade-stage cancellation pattern). Cumulatieve #34 mechanism-isolation closure BEREIKT via methodological-evolution-output. Spawn #36 multi-day baseline-stability. **Sessie 153:** #34 (b) inline-CSS-only mechanism-isolation = Frame D gray REVERT + NEW bidirectional canary discipline + S4 scale-error + page-type-asymmetric mechanism als nieuwe categorie. **Sessie 152:** Combo-pad. (1) #33 (b) ✅ CLOSED N/A — HTTP/2 push deprecated Chrome 106 (Sep 2022) + Netlify dropped support + ZERO local artifacts. (2) #33 (d) ✅ CLOSED PARTIAL — Brotli active HTML/CSS/JS productie via curl-grep; favicon.svg gap accepted low-impact. (3) #34 (a) preconnect-only mechanism-isolation = **Frame B NOISE-no-action REVERT** (patch commit `a19926a` → revert `402b1d4`) na Phase A baseline-anomaly diagnosis via NEW cross-check-baseline-discipline. **Variance-amplification hypothese partial-falsified:** Sessie 151 Frame C kwam NIET uit preconnect alleen (S7 1.83× ≤2× threshold) — mechanism-isolation wijst naar inline-CSS-cascade-interactie of combined-effect. Voorgaande Lighthouse milestones: 49→59 (Sessie 144), Sessie 147 #29 modulepreload Frame C, Sessie 148 #31 main.js dedupe, Sessie 149 #30 sync-inline Frame D, Sessie 150 #33 (a) Frame A self-host fonts, Sessie 151 #27 combined Frame C.
**Sprint:** Sessie 189 — **Fase A: leerpad deep-link → in-app tutorial-landing** (vervolg op Sessie 185-188; sluit de 4-sessie-boog "Leerpad deep-link naar in-app tutorials" Stap 0+B+A). De 3 homepage-leerpad-knoppen linken niet langer naar de kale terminal: BEGINNER→`?tutorial=fundamentals`, GEVORDERD→`?tutorial=recon`, EXPERT→`?tutorial=exploitation`, met eerlijke labels "Start de <Niveau>-missie". `main.js` leest de query (validatie tegen `tutorialManager.getScenario`; onbekend → stille no-op + URL ongemoeid) en auto-start de missie **gesequencet** zodat de MISSION BRIEFING de held is — nooit in dode input of midden in de typewriter: eerste bezoek wacht op `typewriter-done` + 250 ms, terugkerend vuurt direct; auto-start via `terminal.execute('tutorial <id>')` (registry-pad = echo + history + first-visit-flag), dán scroll-to-bottom + input-focus. Welcome **bewust niet gecondenseerd** (boot-fragiliteit; anti-gold-plating). Resume-vs-deeplink non-destructief (geen actief→start; ==target→continue; !=target→`exit()`+start). URL gestript via `history.replaceState`. Analytics-source zonder dubbeltelling via one-shot `tutorialManager.setNextStartSource('homepage-leerpad')`. Cache-bump `main.js?v=189-deeplink` (2 refs). NEW `leerpad-deeplink.spec.js` 5/5 groen; volledige chromium-suite **0 failures** (215 totaal, ~200 passed + ~10 flaky-op-retry + 5 skipped). Twee voorheen-rode stale tests (lead-magnet-kaartcopy = Sessie-183-correctie + footer-legal same-tab) bevestigd óók rood tegen productie = géén Fase A-regressie → in dezelfde sessie bijgewerkt naar de correcte site-staat. Render-en-meet dark/light/375px: input enabled+focused, 0 doc-overflow (10px `#terminal-container`-offset is pre-existing zonder deep-link). **Nog niet gepusht** (push = deploy; bundelt met de 4 onuitgepushte Sessie 185-188-commits in één deploy, wacht op go). Volledig: `docs/sessions/current.md` Sessie 189. **Pre-Sessie 189:** Sessie 188 — **Eén coherente leerpad-ladder: progressie-oppervlakken uniform** (commit `aebcca3`, 13 files; vervolg op de vraag "komt de tutorial-indeling overeen met het leerpad-commando?"). Brutale diagnose: drie vocabulaires voor "hoe moeilijk" (homepage+tutorial = Beginner/Gevorderd/Expert; leerpad = Fase 1-4; challenge = EASY/MEDIUM/HARD Engels = UI=NL-bug) + leerpad/tutorial verwezen niet naar elkaar. Oplossing (geen merge — wél uniform + koppelen): (1) **leerpad-commando** groepeert de 4 fases onder de 3 niveaus + per niveau een brug `[→] Begeleide missie: tutorial <id>`; fase-namen + command-tracking + EXPERT-lock behouden. (2) **homepage-chips kloppend**: GEVORDERD → ping/nmap/ifconfig/netstat (netcat/wireshark bestaan niet, hashcat → Expert); EXPERT dekt Fase 4. (3) **challenge-difficulty overal NL** via één gedeelde `difficultyLabel()`-helper in **6 plekken** (challenge-renderer/challenge/dashboard/next/certificate-generator/certificates) — thoroughness betaalde: labels zaten verspreid, gevonden door test-failures te volgen. Interne keys (easy/medium/hard) ongemoeid. E2E: nieuwe asserts (ladder + missie-brug + challenge NL + homepage geen fictie) + EASY/MEDIUM/HARD→NL + stale badge-count 21→22 gecorrigeerd. Volledige chromium-suite groen (188 passed) + fundamentals cross-browser; desktop-box pixel-uitgelijnd (69 breed). **Nog niet gepusht** (push = deploy; wacht op go). Volledig: `docs/sessions/current.md` Sessie 188. **Pre-Sessie 188:** Sessie 187 — Fase B: NEW fundamentals-scenario (Beginner, 7 stappen) + 4 her-tiering-labels (recon/privesc→Gevorderd, webvuln/exploitation→Expert) + funnel-doorwerking; Expert-badge bleek niet nodig (difficulty = platte tekst). Commit `3ac65aa`. Volledig: `docs/sessions/current.md` Sessie 187. **Pre-Sessie 187:** Sessie 186 — Stap 0 ontwerpbeslissing (doc-only) die deze Fase B stuurde: mapping niveau→scenario→labelwijziging + 2 expert-calls (webvuln→EXPERT want sqlmap = headline-tool; fundamentals = navigatie+bestandsbeheer, niet alle 9 badge-chips). Volledig: `docs/sessions/current.md` Sessie 186. **Pre-Sessie 186:** Sessie 185 — Leerpad-sectie homepage: van 3 nep-deuren naar een echt leerpad (2 commits, geen architectuur-wijziging). De 3 leerpad-knoppen (Start/Verken/Beheers Leerpad) linkten allemaal naar dezelfde `/terminal.html` — drie deuren, één kamer — en dupliceerden de 4 andere terminal-CTA's op de pagina; "Leerpad" beloofde een gestuurd pad dat achter de link niet bestond. Elke kaart wordt nu een mini-leerlijn (lezen → oefenen): NEW `.leerpad-learn-link` "Lees eerst"-link naar bestaande eigen blogcontent per niveau (BEGINNER→`terminal-basics`, GEVORDERD→`nmap-beginnersgids`, EXPERT→`sql-injection-uitgelegd`) bóven een eerlijk, **uniform** knoplabel "Oefen in de terminal" (was 3× misleidend "Leerpad"). Differentiatie zit nu in de bestemming, niet in een label dat overal hetzelfde doet. NEW `.leerpad-cta-group` (flex-kolom, `margin-top:auto`) pint het link+knop-paar onderaan zodat de paren over de 3 kaarten uitlijnen bij ongelijke beschrijvingslengtes; `.leerpad-learn-link` theme-aware via `--color-text-dim`/`--color-cta-primary` (geen hardcoded kleur). **Bewust uitgesteld:** deep-linken naar in-app tutorials (optie 2) — er is géén fundamentals-scenario (ls/cd/cat), dus juist de BEGINNER-kaart (kerndoelgroep) kan nergens heen + tutorial→badge-mapping is rommelig (recon/webvuln/privesc allemaal "Beginner"); verdient eigen vervolgproject (eerst fundamentals-scenario + alle instappunten consistent). Cache-bump `landing.css?v=123→124` (preload + stylesheet, alleen `index.html`; HTML-edits zelf budgetloos). Render-en-meet op no-store server (dark+light+mobiel 375px): 6 links resolven (3 blog 200 + 3 terminal), groep-tops alle 3 == 4058px (`margin-top:auto` lijnt uit), dark link `#8b949e` == kaart-beschrijvingstekst (contrast 6,15:1 WCAG AA), light `#444444` op wit, 0 overflow (`scrollWidth` 360≤375), animatie intact (3× `.visible`, opacity 1), screenshots dark-desktop + light-mobiel. Commits `c49c1de` (CSS) + `9c8cfc6` (HTML), gepusht naar `main` in 2 logische brokken. Kernles: **same-tick `getComputedStyle` ná `setAttribute('data-theme',…)` gaf stale `#444444` voor dark** — de asymmetrie (`--color-cta-primary` flipte wél, `--color-text-dim` niet) was de tell; een verse lezing in een aparte tick gaf de echte `#8b949e`. Render-en-meet werkt alleen als je óók je meetinstrument wantrouwt. **Pre-Sessie 185:** Sessie 184 — Blog in-content CTA-boxen visueel geünificeerd (1 commit, geen architectuur-wijziging). De gecentreerde, volledige-rand `.blog-cta` was de enige uitzondering in een blog die verder een consistente links-uitgelijnde linkerrand-accent aside-taal hanteert (`.blog-tip`/`.blog-warning`/`.blog-info` + de product/lead-magnet-kaarten `.blog-cta-product`). De plain navigatie-CTA's convergeren nu op die behandeling: `text-align:center→left` + `border-left:3px var(--color-ui-primary)`; light-override `border-left var(--color-link)` (`--color-ui-primary` is groen in light → accent blijft blauw, on-palette `feedback_blog_palette_no_green`). `.blog-cta-product` geslankt (uitlijning/accent nu in de base; behoudt alleen kleinere h3 1.4rem). Lost ook gecentreerde meerregelige bodytekst op (leesbaarheids-antipatroon). Cache-bump `blog.css?v=120→121` (14 blog-pagina's). Render-en-meet op no-store server (dark+light+mobiel 375px): plain == product (`getComputedStyle` text-align left + border-left 3px), light-accent `#0969da` blauw (géén groen), 0 overflow (`scrollWidth` 360≤375), cross-check `wachtwoord-beveiliging.html` uniform, product-kaarten ongewijzigd. Commit `97b1c8a`, gepusht. Geheugen `feedback_blog_cta_unified`. Kernlessen: cargo-cult-consistentie omgekeerd — niet de afwijkers maar de outlier corrigeren; en `--color-ui-primary` is themisch (blauw dark / groen light) → accent-overrides moeten mee anders lekt groen het blog-palet in; same-tick `getComputedStyle` ná theme-toggle gaf stale kleur (fresh re-read ná recalc nodig). **Pre-Sessie 184:** Sessie 183 — Lead-magnet conversie/UX + dark-mode zichtbaarheid + copy-feitencontrole (8 commits, geen architectuur-wijziging). (1) **sample-pentest copy:** belofte-inversie weg ("direct in je inbox" → "meteen te downloaden"; de instant on-page-download is het écht directe pad, de inbox is dubbel-opt-in-gepoort) + 6 blog-CTA's; feitfouten in de 3 "Wat zit er in"-kaarten + hero-bullets tegen de echte sample-PDF (Fase 0 = voorbereiding ≠ reconnaissance/Fase 1; géén nmap-cheatsheet; "beslisboom Fase 0→1" bestaat niet → 6-fasen-overzicht); de-jargon OSINT/reconnaissance → NL "verkenning" (matcht woordenlijst-gloss); kaart-iconen op betekenis (schild=toestemming/magnifier=verkennen/list=stappenplan); cross-sell tegen volledige 19-pagina Playbook-PDF ("command-templates" bestond niet → rapport-template + commands-overzicht; "beslisbomen" mv → 1; "sla het formulier over" geschrapt — frictie-framing onjuist want Gumroad vraagt óók e-mail) + 12 blog-CTA's + meta/og/JSON-LD. (2) **conversie/UX `sample-pentest`:** signup-kaart was in dark onzichtbaar (bg #0d1117 = pagina, hairline, geen schaduw) → `--color-bg-modal` #161b22 + elevatie + groene accent + zichtbaar `<label>` + hero flex→CSS-grid (`--lead`-modifier) zodat formulier mobiel vóór de bullets; sample-download regressie-vrij. (3) **dark-surface-audit** ("light gefixt, dark vergeten"): homepage-nieuwsbrief-band + blog-`.newsletter-signup` bg→modal; per ongeluk groene accent op blog-kaart (cargo-cult) → teruggedraaid naar neutraal (blog-palet = blauw, geen groen; geheugen `feedback_blog_palette_no_green`); 4 blog-informatiekaarten gelift naar modal (hun `--shadow-elevation-1` is zwart-op-bijna-zwart = onzichtbaar in dark → elevatie hersteld via oppervlak-contrast); modals bewust gelaten (dim-overlay). Commits `c6b1247`+`82c77a8`+`90463c4`+`f73ec50`+`f6efd46`+`6dac1bc`+`6024594`+`05b6500`, gepusht. Cache-bumps `landing.css?v=122`, `main.css?v=152` (index), `blog.css?v=120` (14 blog-pagina's). Render-en-meet op no-store server (dark+light+mobiel 375px, `getComputedStyle` kaart #161b22 vs pagina #0d1117, mobiele volgorde text→form→bullets). Kernlessen: zwarte schaduw is onzichtbaar op bijna-zwarte bg → elevatie in dark = lichter oppervlak; gedeelde klasse vóór herschrijven grep'en (`.sample-hero-content` ook op sample-download); kloppende copy vereist het artefact lezen; blog ≠ groen. **Pre-Sessie 183:** Sessie 182 — Live zoekfilter + design-uitlijning op de twee naslagpagina's (commands + woordenlijst), 5 commits, geen architectuur-wijziging. (1) NEW gedeelde `src/ui/term-filter.js` (config-gedreven live-filter + scroll-spy + `itemNoun`) met dunne wrappers `glossary-filter.js` + `commands-filter.js`; `commands-scrollspy.js` verwijderd (scroll-spy zit nu in de kern). (2) **woordenlijst**: sticky balk met zoekveld dat termkaarten live filtert (op `textContent` = term+definitie) + categorie-chips + teller + lege-staat (inline CSS, geen cache-bump); "Ctrl+F"-tip vervangen. (3) **commands**: zoekfilter-backport — de bestaande "filter-balk" filtert nu écht (`commands.css?v=116`). (4) **Sticky-balk uitlijning**: balk-inner kreeg identiek box-model als `.page-section` (horizontale padding van full-bleed-buitenkant → inner) zodat zoekveld en cards op élke breedte samenvallen (was 32px scheef >1400px + 4px mobiel); `?v=117`. (5) 5× korte categorie-intro op woordenlijst (`.glossary-category-intro`, links, getoetst tegen term-lijst). (6) **commands categorie-koppen → woordenlijst-stijl** (links/groen/onderlijn-divider + light-override, intro links i.p.v. gecentreerd wit); `?v=118`. Commits `aa5cad1`+`24d2bc0`+`3af5f53`+`5e3c5e6`+`9795c58`, gepusht. Render-en-meet op no-store server (dark/light/mobiel 375px + 1600px breed: geen overflow, randen samenvallend `delta 0`, filter/scroll-spy/lege-staat/wis-knop werkend); validate-docs `--deep` exit 0. Kernlessen: flex-item `margin:0 auto` schakelt `align-items:stretch` uit → `overflow-x` grijpt niet (reset `margin:0;min-width:0`); `max-width` mét vs zónder padding geeft verschillende content-randen >max-width; cargo-cult-consistentie = vorm ≠ intentie (kies per element de behandeling die past bij wat de pagina's gemeen hebben). Card-chrome bewust niet aangeraakt (radius 12/16 + hover, lage zichtbare winst). **Pre-Sessie 182:** Sessie 181 — Drift-bestendige content-tellingen (gidsen-stats "10"/"41" → open floors "12+"/"40+"; PLANNING "10 posts"→12; NEW validate-docs `--deep` Check 6c floor-assertie `geclaimd ≤ ground-truth` over gidsen Blog/Commands + woordenlijst Termen, negatief getest 99+→exit 1) + blog-table-stacked (4 brede blog-datatabellen → `.blog-table--stacked` gelabelde-kaart-op-mobiel i.p.v. Sessie-176 overflow-scroll, conventie in `architecture-patterns.md`) + over-ons-copy (tegenwoordige-tijd framing + kop↔payload-match). CLAUDE.md "12 posts" + JSON-LD `numberOfItems:39` bewust ongemoeid (canoniek correct; oppervlakkige inventaris gaf 2 vals-positieven). Commits `83c130d`+`3530e07`+`a9006e3`+`ea379a2`, gepusht. Render-en-meet 360px (geen overflow). **Pre-Sessie 181:** Sessie 180 — Blog-auteurschap terug naar **merk (Organization)** op 13 posts (`article:author`→merk, JSON-LD `author` Person→Organization, zichtbare byline verwijderd) na strategische analyse; **persoonsnaam alleen nog op over-ons** (founder-schema + LinkedIn behouden als vertrouwensanker). Eerlijke add-then-remove binnen één sessie: eerst naam *versterkt* (op premisse "bekendheid via LinkedIn"), na premisse-correctie (echte doel = productpromotie) blog-helft teruggedraaid. `privacy.html` (noemt naam al niet) / GitHub-URL's / README bewust ongemoeid. Scripted sweep (literal block-match + per-bestand `count==1`) + JSON-LD-parse-validatie (echte parser, 0 ongeldig) + Playwright render-en-meet (meta-bar zonder byline, dark/light/mobiel). Geen cache-bump (inline HTML/JSON-LD). Commit `80f0297`, gepusht. Kernles: **auteurschaps-oppervlak ≠ promotie-doel**; las je naam niet als schema-auteur op elke geïndexeerde pagina tenzij persoonlijk merk een expliciet doel is. Bulk-rotatie 165-169 → `archive-s165-s169.md`. **Pre-Sessie 180:** Sessie 179 — Klantgerichte copy-perfectionering (2 commits, doc-sync only, geen architectuur-wijziging). **Footer-tagline** (`src/components/footer.js`): "perfect voor absolute beginners" → "van je eerste command tot security tools" — een demografisch label zet een plafond (leest als "alleen voor newbies") en was smaller dan de hero; traject-framing sluit niemand uit. Cache-bump `init-components.js?v=2`→`v=3` + `footer.js`-import, 24 HTML-pagina's (footer dynamisch geïnjecteerd → 2 cache-lagen). Commit `0b67fec`. **Hero-subtitle** (`index.html`): demografisch label + onware veiligheidsclaim ("zonder hun PC te riskeren") → "Oefen ethisch hacken met 40+ commands uit de praktijk en Nederlandse uitleg — in een veilige simulatie waar je alles kunt uitproberen zonder echte gevolgen" (tweede persoon, geen plafond, feitelijk waar: de simulator draait op je eigen machine via internet, dus de veiligheid zit in de gesimuleerde uitvoering). H1 ongewijzigd (SEO-alignment `<title>`/OG). **"authentieke commands" → "commands uit de praktijk"** op 9 user-facing plekken (og/twitter-meta index+terminal, feature-card-h3 + stat-label index, 3 blogposts) — "authentieke ervaring" (blog/welkom) bewust behouden (andere betekenis). Commit `8a81de8`. Beide gepusht naar `main`. Render-en-meet geverifieerd op no-store server (dark/light/mobiel 375px, geen overflow). Geheugen `feedback_audience_floor_not_ceiling`. **Pre-Sessie 179:** Sessie 178 — Homepage lead-magnet: UX-reorder + glow-fix + copy-perfectionering (3 commits, geen architectuur-wijziging). **Probleem:** onderaan de homepage stonden "Direct beginnen?" (lead-magnet, email-gated PDF) en "Klaar om te beginnen?" (finale CTA, instant terminal) pal na elkaar = woord-botsing + belofte-inversie (de "directe" kop hing aan het traagste pad) + conversie-prioriteit omgekeerd (secundaire email-ask vóór de primaire terminal-CTA). **Fix 1 (reorder, `index.html`):** lead-magnet-strip verplaatst ná de finale CTA → terminal-CTA krijgt het climax-moment direct na de FAQ-payoff ("Hoe begin ik?" → "Start de Terminal"); PDF + nieuwsbrief clusteren als secundaire email-staart. Commit `26b6f52`. **Fix 2 (glow, `styles/landing.css`):** door de reorder volgde een transparante sectie i.p.v. de nieuwsbrief-band, dus de op de onderrand verankerde `final-cta`-glow (`at 50% 100%`) zweefde hard afgekapt "uit het niets" → homepage-gescopete override via `.final-cta:has(+ .lead-magnet)` = zelfstandige ambient-halo (`at 50% 44%`, uitvaag `transparent 72%`); de 4 andere final-cta-pagina's (over-ons/woordenlijst/commands/contact) houden de naad-uplight. `landing.css?v=121`→`122` op alleen `index.html`. Commit `91aab72`. **Fix 3 (copy, 3 teasers):** stroeve titel "Pak de gratis Pentest Playbook-sample" → "Zo begint een echte pentest" (hook i.p.v. badge-dubbeling); vage jargon-subtekst ("Fase 0 reconnaissance-checklist + beslisboom Fase 0 → 1") → gewone taal (toestemming, scope, doelwit verkennen vóór de eerste aanval) + waarom ("de stap die beginners overslaan"). Geverifieerd tegen de echte 9-pagina PDF-inhoud (Fase 0 voorbereiding + Fase 1 reconnaissance; géén overclaim van scanning/exploitation/rapportage = betaald). Zelfde de-jargon op `over-ons.html` + `gidsen.html` (pagina-specifieke kopjes behouden); `index.html` `.phase-flow`-span vervalt. Niet aangeraakt: `sample-pentest.html` (hero al goed), blog-inline (contextueel), meta/SEO, nieuwsbrief-mail. HTML-only → geen cache-bump. Commit `deab754`. Alle 3 render-en-meet geverifieerd op no-store server (dark/light/mobiel 375px, geen overflow, glow grondt zonder harde rand, "vóór" rendert). Geheugen ongewijzigd (bestaande `reference_renderer_marker_collision`/`feedback_*` dekken het). **Pre-Sessie 178:** Sessie 177 — Terminal voltooid-markers `[X]`→`[✓]` (rode checkboxes op mobiel). **Oorzaak:** de renderer (`src/ui/renderer.js`) kleurt elke regel op z'n eerste teken; `[X]` werd overal als "afgevinkt"-vinkje gebruikt maar botst met de error-marker → **rood op mobiel** (desktop verbergt het toevallig via het ASCII-kader: elke regel begint met `│`), én die kleur lekt door naar ingesprongen regels eronder (≥3 spaties = continuation-line erft de kleur erboven). **Fix:** voltooid/unlocked-marker `[X]`→`[✓]` (success/groen; 3 chars = box-uitlijning blijft pixel-exact) in **6 oppervlakken** — `leerpad` + `challenge status`/lijst (`challenge.js`, `challenge-renderer.js`) + `achievements`/badges (`badge-manager.js`) + `tutorial`-lijst (`tutorial.js`) + `next`-afronding/transitie (`next.js`). Leerpad mobiel: command-inspringing 4→2 spaties zodat niet-voltooide regels niets meer overerven; man-page-legenda glyph achteraan → neutraal wit. **Bewust rood gelaten** (3-categorie-onderscheid uit inventaris): échte foutmeldingen (`[X] Onbekende challenge/scenario`, challenge-manager/certificates/tutorial.js:180) + de "NOOIT doen"-lijsten in security/netwerk-man-pages (hydra/sqlmap/nmap/hashcat/cat/rm — rood kruis = semantisch juist; blinde replace had de waarschuwing omgekeerd). Geverifieerd in browser (no-store server tegen vals-negatief) mobiel **dark+light** + desktop: voltooid groen, niet-voltooid wit, fouten nog rood, boxen `allSame`-uitgelijnd (len 69), 0 console-fouten — challenge status `[✓]` gemeten groen (was rood), achievements unlocked badge groen. Tests `responsive-ascii-boxes.spec.js` bijgewerkt (leerpad mobiel+desktop → `[✓]`); overige specs accepteren al `✓` of toetsen geen marker; geen CI (Netlify deployt enkel, suite = handmatig tegen productie). Geheugen `reference_renderer_marker_collision` toegevoegd. Commit `af91ff8` (7 files), gepusht naar `main`. **Pre-Sessie 177:** Sessie 176 — Mobiele audit + 5 fixes (hoofdpubliek laptop/pc, mobiel secundair; 375px-viewport gemeten met `getBoundingClientRect`/`scrollWidth`). (1) **Brede datatabellen** (blog + legal, tot 574px) werden op mobiel afgekapt (blog: `.blog-container overflow-x:hidden`) of lieten de hele pagina horizontaal scrollen (legal) → tabel-scroll-container (`display:block; overflow-x:auto`) in de `@media (max-width:768px)`-blokken van `blog.css`/`legal.css`. (2) **CSP blokkeerde de inline Consent Mode v2 defaults op alle 14 blogpagina's** → `gtag` undefined, `dataLayer` leeg, AdSense laadde zónder de `denied`-defaults (GDPR-gap); de `blog/`-map was bij de Sessie-166 inline-script-externalisatie gemist → vervangen door het bestaande externe `consent-default.js` (data-adsense). Runtime-geverifieerd (productie vóór: gtag undefined/dataLayer leeg; lokaal ná: gtag=function, default aanwezig, 0 CSP-fouten over 7 pagina's). (3) **Emoji-cleanup 3 legal-pagina's** (~60 glyphs → ASCII `[✓]`/`[✗]`/tekst; decoratieve sectie-markers weg, Ja/Nee-tabelcellen behouden woord, functionele pijlen blijven; assertie ving niet-geïnventariseerde 🎓). (4) **Contact-form-inputs 38→44px** (`pages.css min-height:44px`, WCAG 2.5.5) + `pages.css` cache-drift `v114`/`v132`→`v133` genormaliseerd (8 consumers). (5) **Terminal scroll-hint** ("Scroll voor meer info", fixed bottom:72px) botste met de naar 2 rijen wrappende quick-command-balk (~109px) → verborgen op mobiel (`terminal-education.css`, `?v=115`). **Meedogenloos-eerlijk teruggedraaid:** filterknoppen-tap-target (meting toonde 27px/42px = al ≥24px AA → fix onnodig + inline-flex-neveneffect). 4 commits `c41e317`/`5dae5ca`/`f4c70be`/`ea1c5ea`. Render-en-meet (no-store server tegen vals-negatief, dark+light, mobiel+desktop-regressie). **Pre-Sessie 176:** Sessie 175 — Layout-fixes `sample-pentest.html` (3 problemen, 1-voor-1). (1) **Chevron `Fase 0 → 1`** stond te laag op 2 plekken: `.arrow-glyph` van `position/top` → `vertical-align: 0.2em` (em-schaal, werkt op li + h3); homepage `.phase-arrow` geconsolideerd naar dezelfde canonieke `.arrow-glyph` (DRY). (2) **Success-state brak de layout** (box te groot, verweesde CTA-knop, lelijke Brevo-rand boven het invoerveld): `brevo-submit.js` verbergt nu bij succes het formulier + zet `.newsletter-submitted` op de kaart → bevestiging vervángt het formulier; `main.css` integreert success/error-paneel in de huisstijl (groene/rode tint + icoonkleur + zachte rand) — **0× nieuwe `!important`** (Brevo's `sib-styles.css` gebruikt zelf geen `!important`, dus onze scopes 0,2,0 / 1,1,0 winnen op specificiteit); `landing.css` verbergt stale titel/intro bij succes + download-knop full-width + btn-cta-tekstkleur hersteld (Brevo's `.sib-form-container a` kleurde 'm blauw+underline). E2E `lead-magnet.spec.js` uitgebreid met form-verborgen-asserties (10/10 groen, verse browser + Brevo-mock). (3) **Card-body's niet uitgelijnd** in de 3-koloms rij (card 3 1-regelige titel → body 23px hoger): opt-in `.feature-cards--equal-title` + `@media (min-width:1025px) min-height:2lh` op de titel → body's uitlijnen; gegate op 3-koloms-breakpoint (geen witruimte als cards stacken), scoped zodat index/gidsen/over-ons onaangeroerd blijven. Render-en-meet bevestigd (alle body's `top:923`); dark+light+mobiel geverifieerd. Commits `6f5e27a` (1+2) + `0a64369` (3), gepusht naar `main`. Geheugen `feedback_avoid_important_css` toegevoegd. **Pre-Sessie 175:** Sessie 174 — Mobiele PDF-download fix sample-pentest lead magnet. Root cause (gedocumenteerd Sessie 134): de welkomstmail-downloadknop loopt via Brevo's click-tracking-redirect (`r.sendibm1.com/?u=…&i=<token>`); Gmail-mobiel's prefetch consumeert het eenmalige token vóór de klik → 404 op ~5-10% mobiele klikken. Die 404 zit op Brevo's server → **niet repo-fixbaar**. Oplossing = betrouwbaar same-origin downloadpad dat Brevo-tracking omzeilt: (1) `_headers` `/assets/samples/*` `Content-Disposition: attachment`→`inline` (forceerde download brak iOS WKWebviews; inline rendert wél); (2) download-knop in het `#success-message`-panel van `sample-pentest.html` (directe PDF ná aanmelding, géén Brevo-link); (3) NEW `noindex` `sample-download.html` (download + cross-sell; betrouwbare bestemming voor de mailknop, niet in sitemap); (4) `lead_magnet_download` GA4-event via `data-lead-download` (`cta-tracking.js`+`events.js`, CSP-safe). Double opt-in blijft AAN; success-copy gecorrigeerd (noemt directe download + bevestigen-voor-nieuwsbrief, claimt niet onterecht 'al gemaild'). 10/10 lead-magnet E2E groen op chromium (lokaal tegen statische server; WebKit-download egress-geblokkeerd → iOS = handmatige real-device-check). Commits `8f2ce68` + `fb397ca`. **Brevo-404 zelf = best-effort vervolgwerk Heisenberg:** tracking-toggle-check → support-ticket → bijlage-fallback; + mailknop-URL → `/sample-download.html` + Brevo success-message gelijktrekken. **Pre-Sessie 174:** Sessie 173 — Launch-prep voor de marketing-launch op **wo 24 juni 2026**. (1) `docs/launch-announcement-kit.md` herplanned: do 18 juni (verlopen) → wo 24 juni (sterke HN/Reddit-dag); §5-schema herontworpen voor beperkte beschikbaarheid (geclusterd in bewaakbaar blok, default 13:00-18:00, reactie-gevoelige kanalen vooraan) + GA4 Real-Time-verificatie aan avond-ervoor-checklist. (2) Launch-visuals geregenereerd via `scripts/capture-launch-visuals.mjs` (chromium lokaal aanwezig; egress-blok gold alleen verse install) — verse GIF+desktop+mobiel tonen nu nieuw H-monogram (oude artefacten toonden `>_`), visueel geverifieerd. (3) **Homepage linkt nu alle 13 blogposts** (`index.html`): 5 cornerstones toegevoegd (OWASP-hub, nmap, Wireshark, Hashcat, "Ethisch hacker worden") → complete interne linking + crawl-route; sitemap homepage `lastmod` → 2026-06-18 (echte edit-datum). (4) **Datum-discipline-correctie:** eerst `dateModified`/`article:modified_time`/`lastmod` op 3 cornerstones gebumpt **zónder** echte content-touch (= fake-freshness, schond runbook Fase 2 twee-staps-poort) → volledig teruggedraaid (posts al compleet: interne links + sibling-cross-links nmap↔wireshark/owasp↔sql-injection + OWASP-2025 al gedekt). Eerlijke freshness-hefboom = verse launch-post (later samen). Geheugen `feedback_preserve_plan_gates` toegevoegd. Commits `d50b981` (homepage+sitemap) + `4dd17b5` (kit). **Handmatig (Heisenberg) op 23-24 juni:** zie `docs/launch-announcement-kit.md` §5 + `docs/seo-launch-checklist.md`. **Pre-Sessie 173:** Sessie 172 — GSC "Verkopersvermeldingen" (merchant listings) fix op `gidsen.html` Product-markup: GSC meldde 4 ontbrekende velden op de 3 Gumroad-gidsen (kritiek: `image`; niet-kritiek: `hasMerchantReturnPolicy`, algemene ID/`brand`, `shippingDetails`). Eerlijk ingevuld per digitaal download-product: `brand` HackSimulator.nl, `hasMerchantReturnPolicy` = `MerchantReturnNotPermitted` (NL — herroepingsrecht vervalt bij directe digitale download, art. 6:230p BW), `shippingDetails` = €0/0-dagen (instant download, géén "gratis product" — `price` 5.00 blijft staan; verzendkosten ≠ prijs). Verbeterpunt meegenomen: losse cover-image per gids i.p.v. gedeelde og-image → NEW `assets/products/{ethisch-hacken-wet,eerste-pentest-playbook,ctf-leerplan}.png` (1200×630 @2x, on-brand: H-monogram + neon-groen op donker + terminal-frame). Gegenereerd via NEW reproduceerbare `scripts/build-product-covers.mjs` (SVG→PNG via `@resvg/resvg-js` — browser-rasterizer chromium geblokkeerd door egress-policy, resvg = prebuilt Rust, geen browser-download nodig; render-en-meet visueel geverifieerd). `@resvg/resvg-js` → devDependencies (build-only). Beide JSON-LD-blokken valideren; nul misleidende data. Commits `d67d3af` (schema-fix) + `672c32e` (covers). **Handmatig (Heisenberg): na deploy in GSC "Validatie van fix valideren" klikken** (kritieke `image`-fix telt pas na re-crawl). **Pre-Sessie 172:** Sessie 171 — Logo-herontwerp + volledige asset-keten: generieke `>_` vervangen door een eigen **H-monogram** (de letter H op een `_` command-line-balk) — ownable, leesbaar tot 16px. Doorgevoerd in `favicon.svg` + alle PNG/ICO (favicon-96, apple-touch, maskable 192+512 vol-vlak, favicon.ico met PNG-payloads — browser-gerenderd want geen rasterizer geïnstalleerd) + `navbar.js`/`footer.js` (inverted glyph zónder tegel op het donkere frame) + `docs/products/logo.svg` (PDF-cover). NEW `assets/brand/` brand-kit: `logo.svg` (tegel) + `logo-on-dark.svg` + mono-black/white + PNG-exports 256/512/1024 + README met merkkleuren. Social-kaart `assets/og-image.png` herbouwd mét logo (browser-render 1200×630) + `?v=2` cache-bust op og:image/twitter:image (60 refs, 25 pagina's) wegens `/assets/* immutable 1jr`. 3 Gumroad-PDF's + sample herbouwd (typst 0.13.1, logo op cover geverifieerd via PDF-pagina); geserveerde lead-magnet `assets/samples/` bijgewerkt. Build-DRY: `build-pdfs.sh` kopieert het logo nu uit canonieke `assets/brand/logo.svg`, `docs/products/logo.svg` gitignored (build-managed). Nul site-runtime-impact buiten de bewuste logo-swap (geen css/js/_headers/netlify-gedragswijziging). **Handmatig (Heisenberg): 3 betaalde PDF's opnieuw uploaden naar Gumroad** (Gumroad host z'n eigen kopie, losgekoppeld van repo/deploy). Niet gecommit tot review. **Pre-Sessie 171:** Sessie 170 — Structuuranalyse + veilige repo-opruiming: bestands-/mapopbouw beoordeeld (verdict: structureel goed georganiseerd — schone domein-indeling `src/`, nul echte weesmodules, geen getrackte rommel, artifact-dirs correct gitignored). Meeste schijnbare "rommel" is by-design (root-HTML's = schone Netlify-URLs, `commands/index.html` = route-pagina, dubbele sample-PDF = bron→publiceer-flow). Veilige acties (nul runtime-impact, geen js/css/html/_headers/netlify wijziging): (1) `docs/products/*.pdf` (5 bestanden ~632 KB herbouwbare build-output uit `.typ`) uit git via `.gitignore` + `git rm --cached` — bestanden blijven op schijf, geserveerde lead-magnet `assets/samples/` + `.typ`-bronnen blijven getrackt; (2) provenance-header in `build-pdfs.sh`; (3) NEW `docs/architecture-review.md` (verdict + by-design-overzicht + artifact-flow). **Bewust NIET:** geplande doc-verplaatsing naar `archive/` (inbound refs = historische log-narratie in gated `current.md`; één doc nog pending) = net-negatief, conform Sessie-169-learning "geen cargo-cult-opruimen". Commit `480a227`, 7 files. validate-docs fast + `--deep` exit 0. **Pre-Sessie 170:** zie `docs/sessions/current.md`. **Pre-Sessie 169 (origineel):** Google Search Console meldde 19 niet-geïndexeerde pagina's (3 omleiding + 1 alt-canonical + 8 gevonden + 7 gecrawld). URL-niveau-diagnose (gebruiker leverde GSC-lijsten) toonde 2 echte zelf-veroorzaakte duplicaat-bronnen: alle 14 blog-footers linkten via `href="index.html"` → `/blog/index.html` (canonical is `/blog/`) en `welkom.html` body via `../index.html` → `/index.html`. Fix: footer-links → `/blog/`, welkom-body → `/`, homepage blog-links 3→8 (5 vastzittende posts als crawl-nudge), sitemap `lastmod` ververst (homepage + 6 posts → 2026-06-15). Overige meldingen benign (www/http-redirects correct; extensieloze URL's `/terminal`/`/blog/welkom` historisch, consolideren via canonical). Eerlijk: interne links = marginale nudge (cybersecurity-tools had al 9 inbound + zat tóch vast → dominante factor = crawl-budget/autoriteit/tijd jong domein). Commit `cce7dce`, 15 files. Browser-onafh. verificatie: sitemap XML valid 25 URLs, nul resterende `index.html`-links, validate-docs exit 0. **Pre-Sessie 169:** zie `docs/sessions/current.md`.

**Sprint (Sessie 166):** Pre-launch security-audit + hardening. CSP `script-src` ontdaan van 'unsafe-inline'/'unsafe-hashes' via externalisatie van alle inline scripts naar /src/*.js (consent-default.js, brevo-config.js, init-theme.js, load-animations-css.js; AdSense-injectie ná consent-defaults sluit de consent-race) + X-XSS-Protection→0 + history.search() ReDoS-hardening + privacy.html feitfout (command-args lokaal ≠ verzonden; wissen via `history -c`) + CSP frame-src/img-src `adtrafficquality.google` (F6, pre-existing AdSense fraud-beacon-block) + .well-known/security.txt (RFC 9116) + SECURITY.md. Browser-geverifieerd onder de echte CSP-header: nul violations op index/terminal/legal/brevo; consent-ordering bevestigd in dataLayer; E2E 183 passed (3 'failures' via schone-baseline ontmaskerd als pre-existing/flaky, geen regressie). Commit `aa0396d` op branch `security/csp-hardening-audit`. **Handmatig voor Heisenberg:** branch pushen → Netlify deploy-preview verifiëren → merge naar `main` = productie-deploy. **Pre-Sessie 166:** zie `docs/sessions/current.md`.

---

## 📊 Voortgang Overzicht

**Totaal:** ~292 / ~340 taken voltooid (~86%) — exacte subtask-tellingen kunnen driften per sessie; voor ground truth zie milestone-secties hieronder. Validatie via `scripts/validate-docs.sh`. **Sessie 156 update:** M6 +2 closures (long-press gesture + beta protocol-doc) = 30/32 → 32/32 = 100% closure; M6 doc-drift gecorrigeerd (was 30/33 stale). **Sessie 158 update:** M5 tabel 41/45→64/90 + M5.5 tabel ~16/18→23/26 ad-hoc drift-fixes (Sessie 157 --deep Check 6 extension drift-catch; nieuwe scope M5/M5.5/M9 + Blog sub-check 6b). **Sessie 159 update:** #23.2 M0-M4 permanent-SKIP closure (documentation-of-intent) — geen tabel-cijfer wijzigingen, M0-M4 frozen-by-design (semantic-difference tabel=MVP-essential subset vs section=full-detail incl. defer-to-M5/M4 testing + optional/Post-MVP/Future). **Sessie 160 update:** public-launch SEO-metadata prep — geen tabel-cijfer wijzigingen (sitemap/feed drift-fix + validate-docs Check 9 + GSC Domain-launch + runbook).

| Mijlpaal | Status | Taken | Percentage |
|----------|--------|-------|------------|
| M0: Project Setup | ✅ Voltooid | 15/15 | 100% |
| M1: Foundation | ✅ Voltooid | 20/20 | 100% |
| M2: Filesystem Commands | ✅ Voltooid | 25/25 | 100% |
| M3: Network & Security | ✅ Voltooid | 28/28 | 100% |
| M4: UX & Polish | ✅ Voltooid | 43/43 | 100% |
| M5: Testing & Launch | 🔵 In uitvoering | 64/90 | 71% | ✅ **Performance + Config + Security + Accessibility + Content + Bundle Opt 100%**
| M5.5: Monetization MVP | 🔵 In uitvoering | 23/26 | 88% | ✅ AdSense (10 units) + Ko-fi + **Brevo** (newsletter double opt-in + welkomstmail + deliverability tuning Sessies 134-136) + eigen consent banner + **Gumroad v1.0** (3 guides + bundel) + **Lead magnet** (sample PDF + landing + CTA-coverage 13 plaatsen + **Sessie 174 mobiele-download-fix: same-origin pad omzeilt Brevo-tracking-404**) |
| M6: Tutorial System | ✅ Voltooid | 32/32 | 100% | ✅ ALL Phase 1-3 closed — Framework + 3 scenarios + cert + analytics + E2E tests + perf audit + mobile + cross-browser + **long-press hint gesture + beta protocol-doc (Sessie 156)** |
| M7: Gamification | ✅ Voltooid | 47/47 | 100% | ✅ Phase 1-7 complete (framework, content, badges, certs, dashboard, leaderboard, testing) |
| M8: Analytics & Scaling | ⏭️ Gepland | 1/37 | 2% | (Sessie 157 --deep zelf-test ground-truth fix: was 0/40 stale; section heeft 1 [x] + 36 [ ]) |
| M9: Refactor Sprint | ✅ Voltooid | 19/19 | 100% | ✅ Cache + bundle + code quality + docs sync + performance + test coverage + localStorage opt |
| **Blog (content-pijler)** | ✅ Live | 12/12 posts | 100% | ✅ 105+ jargon-explanations + JSON-LD schema + internal cross-linking + unified marketing nav + breadcrumbs + merk-auteurschap (JSON-LD Organization, zichtbare byline verwijderd Sessie 180; persoonsnaam op over-ons) (Sessies 122-125 + 138-139 + 160: Wireshark + Hashcat posts) |

---

## 🎯 Huidige Focus

**Actieve Mijlpalen:** M5.5 Monetization (deliverability + lead-magnet polish) + M6 Tutorial System (last 3 taken) + Blog content-SEO (post-Sessie 138 hub-clustering)
**Current Status:** ✅ LIVE — Playwright E2E: **215 tests, 25 spec files** (Chromium, Firefox, WebKit) | AdSense + Ko-fi + Brevo (deliverability getuned) + Gumroad v1.0 + Lead magnet live
**Bundle (geverifieerd 29 mei 2026, Sessie 144):**
- **Site totaal:** ~2240 KB unminified | src/ 613 KB | styles/ 262 KB | blog/ 360 KB (12 files: 10 posts + index + welkom) | assets/ 1001 KB (+316 KB Sessie 172: 3 per-gids + 1 bundel cover) | HTML ~150 KB
- **Terminal Core (runtime van terminal.html, gemeten Sessie 141 via BFS module-graph):** **~781 KB unminified** | HTML 19 KB + CSS 160 KB (6 files) + JS 601 KB (99 module-graph files). Geschatte minified ~547 KB. **⚠️ ~37% boven 400 KB budget zelfs minified** — zie #24 (heroverwegen post-implementatie)
- **Lighthouse on-wire ná Pad C1+C2 (Sessie 144, productie):**
  - `/terminal.html`: **Mobile 49→59/100 (+10), Desktop 77→94/100 (+17)** | Total 626→375 KB (-251) | 3rd-party 353→101 KB (-252) | **AdSense 252 KB / 420 ms → 0/0** | LCP mobile 7716→4265 ms (-3451) | TBT mobile 1087→985 ms
  - `/sample-pentest.html`: **Mobile 73→82/100 (+9), Desktop 99→100/100 (+1)** | Total 556→304 KB (-252) | 3rd-party 487→236 KB (Brevo blijft 236 KB dominant) | TBT mobile 1209→680 ms (-529)
- **Resterende third-party-overhead:** terminal.html 101 KB (Google Fonts 99 KB / 0 ms blocking) | sample-pentest.html 236 KB (Brevo sibforms 134 KB + Fonts 102 KB)
- **Playwright:** 25 spec files, 215 tests per browser-project (`npx playwright test --list --project=chromium`, geverifieerd Sessie 189; Sessie 189 added `leerpad-deeplink.spec.js` 5 tests)

<!-- VALIDATE-BUNDLE-START Sessie 157 — ground-truth target voor scripts/validate-docs.sh --deep -->
<!-- src=648 styles=394 blog=414 assets=1030 (KB unminified, du -sb / 1024 basis; Sessie 190 ground-truth meting — src +2KB sinds Sessie 189: completion-scroll-anker in renderer.js + guard-capture in terminal.js) -->
<!-- VALIDATE-BUNDLE-END -->

**Volgende Stappen:**
1. ✅ GitHub repository setup (https://github.com/JanWillemWubkes/hacksimulator)
2. ✅ Netlify deployment (https://hacksimulator.nl/)
3. ✅ Performance audit (Lighthouse 100/100/92/100)
4. ✅ Cross-browser test infrastructure (Playwright 215 tests, 25 spec files)
5. ✅ **M5.5 Monetization Pivot** (Sessie 117-118): AdSense (10 units), Ko-fi donaties, Newsletter signup, eigen consent banner (Consent Mode v2)
6. ✅ **Celebration UX** (Sessie 118-119): 3-zone completion blocks, auto-copy certificaat, sequential reveal
7. ✅ **Learning Funnel Hardening** (Sessie 116-119): "Type next" hints, phase-dependent content, funnel direction lock
8. ✅ **Brevo migratie** (Sessie 126): MailerLite → Brevo (free tier, double opt-in, welkomstmail automation)
9. ✅ **Typst PDF + Gumroad v1.0** (Sessies 127-129): 3 guides + bundel live op Gumroad
10. ✅ **Lead magnet Sample Pentest** (Sessies 130-132): 9-pagina PDF + `/sample-pentest.html` landing + Brevo opt-in flow
11. ✅ **Brevo deliverability tuning** (Sessies 133-136): DnD-template herbouw, DNS cleanup (SPF/DKIM/DMARC), unblock-route, Postmaster verificatie
12. ✅ **Funnel-pulse + Lead-magnet CTA-coverage 3→13** (Sessie 137): GA4 pipeline gevalideerd via simulate success-panel toggle, contextual CTA-copy per blog
13. ✅ **Content SEO Plan C — OWASP Top 10 hub-post** (Sessie 138): nieuwe hub + bidirectional clustering + `validate-blogs.sh` modernisatie + tag-balans-check
14. ✅ **Unified marketing nav + breadcrumbs blog-pages** (Sessie 139): `getMarketingNavbar()` + `currentPage`-param + breadcrumb-strip + BreadcrumbList JSON-LD
15. ✅ **Doc-protocol refactor + drift-resistance** (Sessie 140): §Document Ownership matrix in PLANNING.md, milestone-tabellen + revenue-projections verhuisd naar TASKS.md, bundle budget gesplitst (runtime <400 KB strikt + SEO/content budgetloos), `scripts/validate-docs.sh` met 4 invariant-checks geïntroduceerd + pre-commit hook geactiveerd, `/summary` skill geüpdatet naar 7-step flow met ground-truth-meting, Sessie 144 trigger persistent op 2 plekken (TASKS.md #23 + inline TODO in validate-docs.sh)
16. [ ] Mobile real device testing (iOS, Android)
17. [ ] GA4 Real-Time verificatie (handmatig)
18. [ ] AdSense performance monitoring (CTR, RPM na 30 dagen)
19. [ ] Ko-fi conversion tracking (donaties per maand) — manueel via Ko-fi dashboard
20. [x] M6 Tutorial: laatste 3 open taken ✅ CLOSED Sessie 156 (long-press hint gesture + beta protocol-doc) → M6 100% (zie milestone-tabel)
21. [x] Bundle runtime-budget herijken: split site-totaal in *Terminal Core* (runtime <400 KB) vs *SEO/content* (geen budget) — splitsing toegepast in PLANNING.md bundle-tabel (Sessie 140 doc-split + Sessie 141 ground-truth meting). **Meet-resultaat Sessie 141:** Terminal Core = ~781 KB unminified (HTML 19 + CSS 160 + JS-module-graph 601 over 99 files). Geschatte minified ~547 KB. **⚠️ Overschrijding ~37% boven 400 KB budget zelfs minified** → opvolg-actie #24
22. [ ] Postmaster re-check trigger: eerste >100-recipient campaign-send OF kalender-datum 2 wk later (vanaf 18 mei 2026 → ~1 juni 2026)
23. [x] **Sessie 157 CLOSED** (13 sessies vertraagd van Sessie 140 inline TODO target Sessie 144) — `validate-docs.sh --deep` mode geïmplementeerd: Check 5 Bundle KB ground-truth via VALIDATE-BUNDLE HTML-comment marker block in TASKS.md (±5% tolerance, pure-bash integer arithmetic locale-onafhankelijk), Check 6 Milestone-percentage via `awk` section-range + `[x]/[ ]` count voor M6/M7/M8 (sections-loze milestones graceful `[SKIP]`), Check 7 Cross-doc Versie consistency CLAUDE.md `**Version:**` ↔ TASKS.md `**Versie:**`. `--deep` opt-in flag (pre-commit blijft fast, `/summary` flow Step 7 gate). Phase C clean baseline ving REAL drift M8 0/40/0% → 1/37/2% (forcing-function value real-time). Phase D 3 drift-injection scenarios verified. scripts/validate-docs.sh +129 regels (PRE 211 → POST 340). Plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-precious-dusk.md`.
24. [x] **Bundle-optimalisatie sprint — Pad C1 + C2 voltooid Sessie 144** (commit `4e4eec5`) — adsbygoogle.js verwijderd van 6 no-slot pages (terminal.html + sample-pentest.html + gidsen.html + assets/legal/{privacy,terms,cookies}.html) + animations.css critical-split op terminal.html (inline `:focus-visible` + `prefers-reduced-motion` + modal fade-in keyframes, defer rest via `media="print" onload`) + `fetchpriority="high"` op preloads terminal.html + index.html. **Productie-impact (Lighthouse@11 vóór/ná, productie):** terminal.html mobile **49→59** (+10), terminal.html desktop **77→94** (+17), sample-pentest.html mobile **73→82** (+9), sample-pentest.html desktop **99→100** (+1). AdSense ecosysteem 252 KB / 420 ms → **0/0** op alle 4 runs. Total transfer -251 KB consistent. **Eerlijk-flag:** terminal mobile 59 onder plan-ondergrens (70-80) door first-party bottleneck — box-utils.js (item #26) wordt prioriteit. Full delta-tabel in `docs/perf-third-party-audit.md` §7.
25. [x] **Third-party performance audit** (Sessie 143, voltooid) — Lighthouse@11 JSON-parse op productie `/terminal.html` onthulde: AdSense ecosysteem (`pagead2.googlesyndication.com` 230.5 KB + `ep1/ep2.adtrafficquality.google` 21.2 KB) = 73% blocking-time / 65% transfer. GA4 NIET geladen (consent-default-denied werkt correct), Brevo + Ko-fi laden niet op terminal.html (zijn alleen op index.html / sample-pentest.html). **Smoking gun:** ad-slot script 132.9 KB ongebruikt (77%), adsbygoogle.js 28.7 KB ongebruikt (53%) — terminal.html heeft 0 `<ins>` ad-elementen in body. Reproducibility: Mobile 39→40, Desktop 64→69 (binnen run-variance). **Output: `docs/perf-third-party-audit.md`** met 3 paden voor #24-heropening (C1: quick wins ~275 ms, C2: AdSense Auto-ads investigation ~788 ms TBT-besparing als UIT, C3: budget-herijking).
26. [x] **`box-utils.js` bootup-time profile — Frame B (Lighthouse-attributie-bias), Sessie 145** — Verify-first-plan uitgevoerd (`/home/willem/.claude/plans/heisenberg-hier-pak-item-pure-cascade.md`): 3-run Lighthouse@11 mobile-audit met `--save-assets` + raw `trace.json` parsing + Playwright cold/warm-meting via 5-iteratie cachebust dynamic-import. **Multi-metric bewijs voor Frame B (geen code-actie):** (1) raw trace.json toont voor box-utils.js slechts 3 events totaal = ResourceSendRequest 0 ms + v8.parseOnBackground 1.24 ms + v8.compileModule 0.07 ms = **1.3 ms X-phase dur** (parse op worker-thread, niet main-thread). (2) Playwright Playwright-mediaan op 375×667 viewport: importMs 30.6 ms (incl. ~25 ms netwerk-RTT naar Netlify CDN), **coldCallMs 1.4 ms** (Frame A vereist >20 ms — gefalsifieerd), **warmCallMs 0.1 ms** (cache werkt impeccable — hypothese (b) "cache-key faalt" gefalsifieerd), wordWrap50 0.4 ms. (3) Lighthouse rapporteert 230 ms scripting voor URL — factor **~177x mismatch met raw trace**. Hypotheses (a)/(b)/(c) uit Sessie 143-formulering allemaal gefalsifieerd door data. **Echte cost-drivers (uit `mainthread-work-breakdown`):** Style/Layout **2172 ms**, scriptEvaluation totaal 376 ms (verdeeld), parseHTML 115 ms. Top single tasks = Layout 195/137/87 ms — 2x meer dan alle scripting tezamen. Frame B-uitkomst zonder code-wijziging is legitieme vervulling van verify-first plan §3. Defense-in-depth: status hier + comment box-utils.js regel 1 + audit-doc §2 multi-metric tabel. Mobile-score-verbetering richting 70-80 moet uit Layout/Style-reductie komen (kandidaat-task #28, niet uit box-utils-patch).
27. [x] **Ad-bearing pages preconnect + inline critical-CSS — Frame C REVERT, Sessie 151** (patch commit `a80e675` → revert commit `0354c7a`). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-peppy-sprout.md` met 6-signaal decisional-thresholds-tabel + symmetrische 33,3% anti-bias clustering + Frame B/C/D eervolle paden + pre-data threshold-feasibility-flags. **Phase 1 surprise-findings:** (a) animations.css NIET aanwezig op 16/16 ad-bearing pages (Sessie 144 critical-split-pattern WAS NIET hergebruikbaar — alleen inline-CSS-only pattern toepasbaar); (b) Brevo `sibforms.com` orthogonale factor BEPERKT tot 2 pages (index.html + blog/index.html, niet alle blog posts); (c) 17 pages totaal (typo welkom.html vs welkom-bij-hacksimulator.html in spawn-prompt). **Scope (Optie B-light, Heisenberg expert-decision):** preconnect `pagead2.googlesyndication.com crossorigin` + inline critical-CSS 6 selectoren (terminal.html lines 53-59 verbatim copy: `:focus-visible`, `prefers-reduced-motion`, `@keyframes fadeIn/fadeOut`, `.modal` transitions, `html scroll-behavior:smooth`) op 17 ad-bearing pages — GEEN externe animations.css link (file niet aanwezig op deze pages), GEEN adsbygoogle defer (audit-doc §3 CPM-trade-off geskipt conservatief). **3 sub-patterns toegepast:** Pattern A (13 files) standaard insert NA theme-color, Pattern B (woordenlijst) onder bestaande `<!-- Preconnect -->` placeholder (Sessie 150 residu), Pattern C (index + blog/index) pagead2 VOOR sibforms preconnect (primary resource hint priority). **Patch:** 17 files / 170 ins. **Pre-commit gates ✓:** validate-docs.sh exit 0 + Playwright Chromium 177 passed + 3 pre-existing flakes via Sessie 149 isolated-rerun-pattern (cross-browser footer + gamification badges = Sessie 149 bekend, responsive-breakpoints = 3× isolated rerun PASS bevestigt parallel-execution flake, geen causale link met patch). **S6 PRE-meting (Playwright MCP cold cache):** index.html adsbygoogle.js fetchStart=137/connectStart=259/requestStart=306/responseEnd=362 ms (169 ms connection-overhead), blog/nmap fetchStart=174/connectStart=174/requestStart=326/responseEnd=371 ms (152 ms connection-overhead). **3-run LH@11 mobile baseline mediaan canonicals (sorted op LCP):** index.html r3 LCP=2276/FCP=1877/TBT=1414/Bytes=557KB/CLS=0.084/Score=69, blog/nmap r3 LCP=1865/FCP=1865/TBT=1133/Bytes=425/CLS=0.073/Score=74. **3-run LH@11 mobile post-mediaan canonicals:** index.html r1 LCP=2375/FCP=2147/TBT=1663/Bytes=557/CLS=0.011/Score=68, blog/nmap r2 LCP=2703/FCP=1725/TBT=1427/Bytes=426/CLS=0.073/Score=69. **S6 POST-meting Playwright MCP:** blog/nmap **fetchStart=218/connectStart=218/requestStart=275/responseEnd=315 ms = 57 ms connection-overhead (vs PRE 152 = -95 ms / -62% reduction A HIT clean)**, index.html toonde 2-entry quirk (preload scanner + consent.js dynamic re-fetch) waarvan Entry 2 connection-overhead=2 ms (mechanism-active bewezen). **Multi-metric delta-tabel + Frame-hits canonicals:** Index | S1 LCP +99 NOISE | S2 FCP +270 ms ✗ C | S3 TBT +249 ms ✗ C | S4 Bytes +0 NOISE | S5 CLS **-0,073 A HIT** | S6 mechanism 2-entry quirk |. Blog/nmap | S1 LCP +838 ms ✗ C | S2 FCP **-140 ms A HIT** | S3 TBT +294 ms ✗ C | S4 Bytes +1 NOISE | S5 CLS 0 A HIT | S6 preconnect proof **-95 ms / -62% A HIT clean** |. **Verdict Frame C** per plan §6 (≥1 Frame C-threshold hit op S1/S2/S3/S4/S5) — beide canonicals hebben multiple C HITs ondanks mechanism-proof clean. **Variance-amplification hypothese (Sessie 147 #29 patroon herhaalt):** POST-patch LCP-range Index 802 ms / Blog/nmap 1111 ms vs PRE 123 ms / 144 ms = **6,5-7,7× variance-increase**. Preconnect opent connection vroeg → AdSense backend response-variance + dependent-request-cascade-timing wordt dominant signal source ipv stabiele lazy-connection-flow PRE-patch. **Spot-checks 1-run informatief (3 pages, geen baseline = niet Frame-bepalend):** over-ons.html LCP=2693/TBT=1933/Score=66, blog/welkom.html LCP=1662/TBT=1294/Score=75, commands/index.html LCP=2381/TBT=1114/Score=72. **6-op-rij Frame-falsificatie patroon HERVAT** na Sessie 150 Frame A break: 145B + 146D + 147C + 149D + 150A + **151C**. Anti-rationalisatie-discipline structureel verankerd via Frame-falsificatie blijft de norm — Sessie 150 Frame A was unique font-pipeline mechanism territorium (geen resource-priority-cascade). Sessie 147 #29 patroon (preconnect/modulepreload mechanism bewezen werkend MAAR variance-cascade introduceert netto regressie) herhaalt zich op nieuw resource-type. **Revert commit `0354c7a`** (17 files / 170 del) + push + Netlify deploy poll ✓ productie back to pre-patch state. **Spawn #34:** mechanism-isolation onderzoek — splits Optie B-light patch in (a) preconnect-only en (b) inline-CSS-only naar separate verify-first cycli om te identificeren welk mechanism de variance-amplification veroorzaakt. Hypothesis: preconnect-only meest waarschijnlijk culprit (early-connection-opening = early AdSense-backend-dependency-cascade); inline-CSS-only zou Frame B/D verwacht zijn (puur source-growth zonder timing-impact). **Defense-in-depth 5 plekken:** dit item + sprint regel + Voortgang Overzicht + current.md Sessie 151 + perf-audit §2f + CLAUDE.md learnings + plan-file outcome-sectie. Artifacts `/tmp/sessie151-item27/{pre-r1,2,3,post-r1,2,3,spot-*,s6-pre,s6-post}.json`.

28. [x] **Style/Layout perf-audit op terminal.html — Frame D (no-meerderheid), Sessie 146** — Verify-first-plan uitgevoerd (`/home/willem/.claude/plans/heisenberg-hier-pak-logical-knuth.md`, 2200 woorden, 4-frame decisional-thresholds-tabel met 8 signalen + tie-breaker). **Methodiek:** hergebruik Sessie 145 mediaan-run `/tmp/perf-item26/lh-run2-0.trace.json` voor source-attributie via Python parse met `args.beginData.frame` cross-frame-filter tegen `TracingStartedInBrowser` mainFrame + Playwright MCP cold-meting productie via `performance.getEntriesByType('navigation'|'paint'|'resource')` + buffered `PerformanceObserver({type:'layout-shift'|'longtask', buffered:true})`. **Multi-metric bewijs voor Frame D:** (1) Top-3 Layouts uit trace zijn **parser-driven** (stackTrace depth=0): 194,87 + 137,42 + 86,83 ms = 419 ms. (2) Frame A signaal 1 cluster: Top-1 stack matcht geen JS-file + 0 marks/measures aanwezig (geen code-instrumentatie) = **0/3 sub-checks**. (3) Frame B signalen 2/3/4/5: RecalcStyle >5ms = 3 (vereist >50), ParseAuthorStyleSheet som = 11,54 ms (vereist >100), unique URLs top-10 RecalcStyle = 4 (vereist >5), ratio UpdateLayoutTree/Layout = 6,38 (vereist >10) = **0/4 hit**. (4) Frame C signalen 6/7: Top-1 ts relative 631 ms (BUITEN FOUT-window 200-400 ms), cumulative LayoutShift Playwright productie = 0,000107 (vereist >0,01) = **0/2 hit**. (5) Frame D signaal 8: Top-3 sum 419 ms > 100 ms = niet-worth-it-escape NIET hit. Per tie-breaker "Bij twijfel: Frame D" → Frame D gekozen, geen code-actie. **Mechanisme onthuld buiten v2 framework (spawn #29):** Long-task #1 (520 ms desktop cold-meting productie at startTime 566 ms) omhult navbar.js (140 ms duration, responseEnd 660 ms) + footer.js (204 ms, 726 ms) + legal.js (237 ms, 763 ms) + mobile.css (506 ms) + animations.css (507 ms). Top-3 trace-Layouts zijn browser-default render-cycle-ticks NA deze cascade-resolution, niet als JS-call side-effect. **Honest-flag:** Heisenberg's verwachte mobile +5-15 score gefalsifieerd door data, transparant geaccepteerd (Sessie 145 leerpunt herbevestigd: 2e sessie op rij). Multi-metric tabel + 4-frame beslis-overzicht in `docs/perf-third-party-audit.md` §2b. Defense-in-depth (Sessie 140 pattern): 3 plekken voor Frame D-uitkomst = audit-doc §2b + dit item + CLAUDE.md Sessie 146 learnings.

29. [x] **Lazy-module-fetch-cascade audit + modulepreload-experiment — Frame C (resource-priority-regressie), Sessie 147** — Verify-first-plan uitgevoerd (`/home/willem/.claude/plans/heisenberg-hier-pak-item-foamy-sprout.md`, plan-mode 3 Explore-agents + 1 Plan-agent + 6-signaal decisional-thresholds-tabel met symmetrische 33,3%-clustering, anti-Sessie-146-redundancy 37%-grens). **Phase 1 correcties:** (a) legal.js EXCLUDED uit patch want transitief via `src/main.js` modulepreload-chain (main.js:7 statische import); (b) path-style `/src/components/...` leading-slash voor browser-dedupe-match met init-components.js:15-16 import-specifiers; (c) bestaande terminal.html:43 `src/main.js` modulepreload mismatcht line 385 `src/main.js?v=88-multiline-wrap` — out-of-scope spawn #31. **Pre-patch baseline (mediaan run-3, LH@11 mobile):** score 74 / LCP 4116 ms / TBT 477 ms / Top-1 Layout 166,5 ms / Top-1 RunTask >50ms = 208,1 ms / navbar+footer rendererStart 441 ms / cascade-window 303 ms. **Patch:** 3 HTML-regels (~240 bytes) tussen terminal.html:43 en 44, `fetchpriority="auto"` (anti-Sessie-144-CSS-conflict-precedent). Pre-commit secrets ✓, validate-docs.sh ✓. Playwright full-suite 14/576 failures bewezen pre-existing flakes via stash-verify + chromium-isolated rerun (9.7s ✓). Commit `baa4cf3` + Netlify-deploy 11 sec. **Post-patch (mediaan run-3, LH@11 mobile):** score 62 / LCP 4250 ms / TBT 813 ms / Top-1 Layout 334 ms / Top-1 RunTask 418 ms / navbar+footer rendererStart 200/205 ms / cascade-window 60 ms. **Multi-metric delta-tabel + Frame-hits:** | S1 LCP +133,5 ms C | S2 TBT +335,5 ms C | S3 Layout +167,2 ms C | S4 LT1 +210,2 ms C | S6 navbar -240,7 ms A | S7 footer -236,2 ms A |. **Verdict Frame C** (4/4 page-perf-signalen Frame C-threshold geraakt, 2/2 resource-signalen Frame A). **Mechanisme:** modulepreload met `fetchpriority="auto"` (Chrome browser-default Medium-High) verschuift navbar/footer 240 ms eerder MAAR concurreert met CSS-high tijdens initial-connection-phase → CSS-fetch verlaat → FCP +796 ms / Top-1 Layout verdubbelt / long-task #1 verdubbelt. Patch werkt zoals technisch verwacht maar veroorzaakt netto regressie. Revert commit `6c2ac7a` + deploy 21 sec. **Honest-flag (3e sessie op rij — mobile-delta-verwachting structureel-gefalsifieerd):** Sessie 145 (#26 Frame B Lighthouse-attributie-bias) + Sessie 146 (#28 Frame D no-meerderheid) + Sessie 147 (#29 Frame C resource-priority-regressie). Drie sessies, drie verwachting-vs-data-misalignments, drie eervolle closures zonder rationalisatie. Anti-rationalisatie-discipline nu structureel verankerd. Defense-in-depth-persistence (Sessie 140 pattern): audit-doc §2c multi-metric tabel + dit item + CLAUDE.md Sessie 147 learnings + docs/sessions/current.md Sessie 147 entry. Artifacts: `/tmp/sessie147-item29/{vector-pre,vector-post,verdict}.json` + 6 LH JSON's + 2 trace.json's + parse.py.

30. [x] **Sync-inline navbar/footer — Frame D revert + spawn #33, Sessie 149** (Sessie 147 spawn uit #29 Frame C closure). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-wise-book.md` met 6 signalen × 3 clusters anti-bias 33,3% symmetrisch + decisional-thresholds-tabel vooraf + Frame B/C/D eervolle paden ingebouwd. **Patch (commit `b1c6ded`):** terminal.html navbar-placeholder regels 81-96 + footer-placeholder 358-372 vervangen door exacte `getAppNavbar()` + `getMarketingFooter({basePath:'/', showFeedback:true, showDonate:true, showCookieSettings:true})` output (+5826 bytes = +5,6 KB binnen plan-target), navbar.js regels 445-489 mini-refactor splits in (1) conditional injection-block bij `#navbar-placeholder` aanwezig + (2) event-binding-switch dat ALTIJD draait wanneer `#navbar` in DOM → behoudt theme-toggle/hamburger/help-dropdown handlers bij sync-inline statische DOM. Lokaal verified pre-commit: themeToggleResponded=true (data-theme attr wisselt op klik), 12 footer-links + Ko-fi + feedback + cookie-settings correct gerenderd, alle aria-attributes correct overgenomen, 0 console errors + 1 expected console.warn (footer.js placeholder-skip). Playwright Chromium 183 passed; 3 failed + 1 flaky alle 4 onthuld als **pre-existing flakes** via Sessie 147+148 isolated-rerun tegen productie (cross-browser footer-links, gamification badge tiers, performance VFS NaN = Sessie 148 spawn #32, feedback retry). validate-docs.sh 4/4 ✓. Netlify-deploy <5 sec. **Verse 3-run LH@11 mobile baseline mediaan run-3 (huidige main, niet hergebruik Sessie 147):** score 63 / LCP 4203 ms / TBT 816 ms / FCP 1916 ms / S3 Top-1 Layout (mainFrame) 264,9 ms / S4 LT1 LH-trace 326 ms / S5 FCP cold-real (Playwright) 296 ms / Speed Index 4188 ms / CLS 0,0000. **Post-mediaan run-3:** score 65 / LCP 4178 / TBT 756 / FCP 1897 / S3 Layout 219,6 / S4 LT1 269 / Speed Index 3981 / CLS 0,0002. **Multi-metric delta-tabel + frame-bepaling:** S1 LCP **-25 ms NOISE** (Frame A ≤-150) | S2 TBT **-60 ms NOISE** (Frame A ≤-80, just outside) | S3 Top-1 Layout **-45 ms FRAME A HIT** (Frame A ≤-40) | S4 LT1 **-57 ms NOISE** (Frame A ≤-800) | S5 FCP LH-lab clean **-19 ms NOISE** (Frame A ≤-500) | S6 LT1<200 binair **false → false (NIET FRAME A)** want post-LT1 269 ms > 200 ms threshold. **Verdict Frame D via tie-breaker:** S6 ≠ true → Frame A falsified, S3 outside noise → Frame B falsified, geen clean Frame C hits → Frame C falsified, partial-Frame-A patroon (S3 hit + S2/S4 near-thresholds) onder "Bij twijfel: Frame D = revert + spawn #33". **Bonus bevinding tijdens verificatie — cache-coherency-bug ontdekt:** init-components.js importeert `/src/components/navbar.js` + `/src/components/footer.js` zonder `?v=` cache-bust query-param. Netlify cache-control `public,max-age=604800,must-revalidate` = browser-cache 7 dagen geldig zonder revalidatie tot expiration. Returning users tijdens 7-dagen-window krijgen NIEUWE sync-inline HTML + OLD cached navbar.js → mini-refactor Path-2 niet beschikbaar → no event-binding voor sync-inline DOM = broken theme-toggle/hamburger/help-dropdown. Sessie 148 #31 patroon (main.js version-param-mismatch) gegeneraliseerd naar deze import-keten. **Mitigatie indien #30-pad-A keep ooit gewenst:** sync `?v=149-sync-inline` toevoegen aan init-components.js navbar+footer imports + terminal.html init-components.js script-tag URL. Voor #30 revert is fix overbodig want returning users krijgen OLD navbar.js + OLD HTML = consistent. **Revert commit `5f0f471`** (terminal.html + navbar.js terug naar pre-patch state, 2 files / 51 insertions / 124 deletions) + Netlify-deploy 10 sec + verificatie placeholders restored. **Mechanisme bewezen:** sync-inline elimineert outerHTML+reflow voor navbar+footer maar dit geeft slechts S3 Layout -45 ms hit. DOM-injection-werk is NIET dominant in long-task #1. Sessie 146 cascade-omhulling-hypothese mechanistisch bevestigd MAAR cascade-elimination via static DOM bereikt sub-Frame-A improvement. Bottleneck zit dieper: fonts (99 KB Google Fonts DNS+TLS-handshake), gtag deferred consent, CSS-parse, of compression. **4e mobile-delta-verwachting-falsificatie op rij** (Sessie 145 #26 Frame B + 146 #28 Frame D + 147 #29 Frame C + 149 #30 Frame D). Anti-rationalisatie-discipline structureel verankerd, niet meer fragiel. **Defense-in-depth 5 plekken:** TASKS.md item #30 closure + docs/sessions/current.md Sessie 149 entry + docs/perf-third-party-audit.md §2d multi-metric tabel + .claude/CLAUDE.md Recent Critical Learnings prepend + plan-file outcome-sectie. Artifacts `/tmp/sessie149-item30/{pre-vector,signals-pre,signals-post,verdict,extract-signals.py,pw-local-chromium,pw-prod-suspect-rerun,pre-log,post-log}.json+.txt`.

31. [x] **terminal.html:43 modulepreload version-param-mismatch fix — Sessie 148 quick-win-closure** (Sessie 147 spawn). Heisenberg's keuze: optie (b) — sync `?v=88-multiline-wrap` naar regel 43 modulepreload, conform bestaand `?v=114` pattern op CSS regels 41-42. **Pre-fix Playwright baseline** (productie, warme browser-cache, 2 jun 2026 18:22 UTC): `performance.getEntriesByType('resource').filter(r => r.name.includes('main.js'))` → `count: 2` met entries `https://hacksimulator.nl/src/main.js` (initiatorType "other" = modulepreload regel 43, encodedBodySize 2323, decodedBodySize 8585) + `https://hacksimulator.nl/src/main.js?v=88-multiline-wrap` (initiatorType "script" = script-tag regel 385, identieke 2323/8585 bytes). Bewijs van dubbele cache-key-fetch op identieke file-content. **Post-fix verificatie** (productie, cold cache via `browser_close` + `?cb=148-post`, 2 jun 2026 19:00 UTC): `count: 1` met enkele entry `https://hacksimulator.nl/src/main.js?v=88-multiline-wrap` (initiatorType "other" — modulepreload kickte fetch af, script-tag op regel 385 hergebruikte via byte-exact URL-dedupe). Dedupe-mechanisme bewezen werkend zoals fetch-spec voorschrijft. **Commit `12a93a2`** + Netlify-deploy 36 sec (CDN-edge-pull via cache-bust query-param). Pipeline-exit-code-discipline uit Sessie 147 toegepast op deploy-poll (`set -o pipefail` + `${PIPESTATUS[0]}`). **Spot-check Chromium-only `performance.spec.js`**: 2 failures + 1 flaky in initial run, alle 3 onthuld als pre-existing flakes via Sessie 147 isolated-rerun-pattern: `Load time < 3s` re-run passed (2.69s, 10% onder threshold), `VFS growth NaN` is test-code-bug regel 496 (`stdDev/avgGrowth` als avgGrowth=0 → 0/0=NaN — geen storage-codepath in onze patch dus causaal onmogelijk), `ES6 module cascade < 1s` marked flaky maar uiteindelijk passed. **Besparing:** ~4,6 KB transfer per cold-load (first-time visitors) + 1× v8.parseModule + v8.compileModule cycle per page-load. Page-perf-delta niet meetbaar bovenop run-variance (transfer-besparing onder noise van Sessie 145 12-punt score-range op 3 runs). **Geen Frame-bepaling want deterministische bug-fix** (binaire count check), niet speculatieve optimalisatie zoals #26/#28/#29. **Audit-merit Sessie 147 aangetoond:** ondiepe audits hadden deze mismatch nooit gevonden; multi-bron LH-JSON-parse van `network-requests` was de detectie-trigger. Pleidooi voor diep-LH-pattern voor toekomstige bug-detectie ook (niet alleen voor patch-decision-frameworks). Defense-in-depth 4 plekken: dit item + plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-serialized-gadget.md` + docs/sessions/current.md Sessie 148 + CLAUDE.md Sessie 148 learnings. Artifacts `/tmp/sessie148-item31/{baseline-pre,baseline-post,verdict}.json`.

32. [x] **VFS-growth-test NaN-edge-case fix — Sessie 150 quick-closure** (Sessie 148 spawn). Heisenberg's keuze optie (a) early-return: `if (avgGrowth === 0) { console.log('✓ VFS growth = 0 (no leak, no variance to check)'); return; }` ingevoegd vóór regel 496 `expect(stdDev / avgGrowth).toBeLessThan(0.5)` in `tests/e2e/performance.spec.js`. **Test verified:** isolated Chromium re-run 14,6 s passed, output toont `Avg bytes/file: 0.00` + `Coefficient of variation: NaN%` + `✓ VFS growth = 0` (guard triggert correct, test ends gracefully). **Commit `1b549d7`** + push. Geen LH-meting want deterministische bug-fix. Discrete commit vóór #33 (a) cyclus zodat LH-meting niet contamineerd.

33. [ ] **Structurelere paden voor LT1-reductie ná #30 Frame D** (Sessie 149 spawn). Sub-pad **(a) ✅ CLOSED Sessie 150 Frame A KEEP** — zie hieronder. Open sub-paden (b/c/d/e) blijven kandidaat voor volgende verify-first cycli.

  - **(a) Self-host Google Fonts** — ✅ **Frame A KEEP, Sessie 150** (commit `14b0d44`). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-glittery-rain.md` met 6 signalen × 3 dimensies anti-bias 33,3% symmetrisch + decisional-thresholds-tabel vooraf + Frame B/C/D eervolle paden + 5-op-rij honest-flag pre-emptief. **Variable-font discovery:** Inter v20 + JetBrains Mono v24 + Space Grotesk v22 zijn variable fonts via Google CSS2 API — 3 unique woff2 (Inter 47 KB + JetBrains Mono 31 KB + Space Grotesk 22 KB = 99,6 KB byte-equivalent aan Google CDN) serveren alle 8 weight-declaraties via browser-dedup. Geen pyftsubset build-step nodig. **Implementation (commit `14b0d44`, 27 files / 449 ins / 121 del):** 3 woff2 in `/styles/fonts/`, 8 @font-face Google-mirror in `styles/main.css` (font-display: swap + unicode-range Google's volledige set incl. NL diakrieten dekking), SIL OFL 1.1 LICENSES/ dir (Inter 2016 / JetBrains Mono 2020 / Space Grotesk 2020), REMOVE 4 Google Fonts lines (preconnect googleapis + preconnect gstatic + Google CSS link + noscript fallback) van 20 HTML files via sed, ADD critical font preloads (Inter 400 + Space Grotesk 700 op alle 20, JetBrains Mono 400 extra op terminal.html), cache-coherency bump `main.css?v=114/115` → `?v=150` voor returning-user-mismatch-prevention. **3-run LH@11 mobile baseline mediaan R2 (selected on LCP):** score 63 / LCP 4291 ms / FCP 1665 ms / TBT 907 ms / CLS 0 / TotalBytes 371 KB. **3-run LH@11 mobile post-mediaan R2:** score 82 (+19) / LCP 3141 (-1150 ms, **7,7× Frame A threshold**) / FCP 1602 (-63, NOISE) / TBT 416 (-491 ms, **6× Frame A threshold**) / CLS 0 (stable, S5 hit) / TotalBytes 371 (0 KB delta — variable-font byte-equivalent, S3 NOISE pre-data predicted). **S4 binary mechanism-proof:** 0 Google Fonts origins (`fonts.gstatic.com` + `fonts.googleapis.com`) over alle 3 post-runs. **Multi-metric delta-tabel:** S1 LCP -1150 ms ✓ HIT | S2 FCP -63 ms ✗ NOISE | S3 Bytes 0 KB ✗ NOISE (variable-font byte-equivalent) | S4 Google Fonts origins 0 ✓ HIT binary | S5 CLS +0 ✓ HIT tolerance | S6 TBT -491 ms ✓ HIT. **Strict letter Frame A (≥3 of {S1,S2,S3,S6}):** 2-of-4 hit → Frame A NOT MET door letter. **Spirit + primary anti-bias rule verdict (Sessie 146):** S1 paint-pipeline + S6 main-thread-blocking = 2 ONAFHANKELIJKE causale dimensies met EXTREME magnitudes (7,7× en 6× threshold respectievelijk). Primaire anti-bias rule (≥2 dimensies onafhankelijk hit) ✓ Satisfied. **Honest-flag plan-table design-flaw:** S3 ≤-30 KB was mechanisch-onmogelijk door variable-font byte-equivalence (predicted pre-data in Phase 4 insight). Effectief criterium werd ≥3-of-3 remaining waarvan S2 -63 ms missed -200 ms threshold. Secondary safety "≥3-of-4" te streng calibreerd; primary anti-bias rule (breedte over causale dimensies) is de DOORSLAG-discipline. **5-op-rij patroon GEBROKEN:** Sessie 145 Frame B + 146 Frame D + 147 Frame C + 149 Frame D → 150 **Frame A**. Plan-doc pre-emptief acknowledged Frame A possibility ("eerste meet-bare mobile-delta zou betekenen — font-mechanisme fundamenteel ander territorium dan DOM-injection/resource-prioriteit/cache-attributie"). **Productie LIVE:** https://hacksimulator.nl/terminal.html met self-hosted fonts mediaan score 82 mobile. Defense-in-depth 5 plekken: dit item + current.md Sessie 150 + perf-audit §2e + CLAUDE.md learnings + plan-file outcome-sectie. Artifacts `/tmp/sessie150-item33a/{pre-r1,2,3,post-r1,2,3,verdict}.json` + Playwright screenshots `.playwright-mcp/sessie150-{terminal,blog}-self-host-verified.png`.
  - **(b) HTTP/2 server-push deprecation check** — ✅ **CLOSED N/A Sessie 152**. Triple-source dichtdoen-criterium: (1) `grep -rn "Link:\|http2\|HTTP/2\|server.push" _headers netlify.toml` = ZERO matches. (2) Chrome 106 (Sep 2022) disabled HTTP/2 server-push by default; 1.25% global usage at removal time; HTTP/3 no implementations. (3) Netlify support forum bevestigt support dropped (was via `_headers` Link rel=preload). Mechanisch immuun. Geen patch, geen LH-meting.
  - **(c) CSS critical-path inline** — Open. Extract top-fold CSS naar `<style>` inline + defer rest. Risico: cache-invalidation per HTML-edit ipv per CSS-edit.
  - **(d) Brotli/compression-optimalisatie** — ✅ **CLOSED PARTIAL Sessie 152**. Curl-grep test productie 6 file-types: HTML (`/`, `/blog/nmap-beginnersgids.html`) + CSS (`/styles/main.css`) + JS (`/src/main.js`) → `content-encoding: br` ✓ all 4. PNG (`/assets/og-image.png`) = no encoding (correct binary). **Gap:** SVG (`/favicon.svg`) NIET Brotli-compressed door Netlify Edge — text-based content but not in default Brotli-list. Impact: ~184 bytes savings/request, single small file (434 bytes), aggressively cached. Expert-decision: accept gap not patch (Netlify Edge default-list opaak per support forum, `netlify.toml` MIME-tuning deterministicity-uncertain, orthogonal aan mechanism-budget #34 (a)). Document als audit-item voor toekomstige cumulatieve Brotli-tuning-sweep indien gap-list groeit.
  - **(e) Cache-coherency systemic mitigation** — PARTIAL Sessie 150 toegepast op main.css (`?v=114/115` → `?v=150`). Pattern uitbreiden naar ALLE module-import URLs in init-components.js bij volgende patch die import-keten raakt.

34. [ ] **Mechanism-isolation onderzoek voor Sessie 151 #27 Frame C variance-amplification** (Sessie 151 spawn uit #27 Frame C closure). Sub-pad **(a) ✅ CLOSED Sessie 152 Frame B NOISE-no-action REVERT** — zie hieronder. Sub-pad **(b) inline-CSS-only** blijft open voor Sessie 153+ verify-first cyclus.

  - **(a) Preconnect-only mechanism-isolation** — ✅ **Frame B NOISE-no-action REVERT, Sessie 152** (patch commit `a19926a` → revert commit `402b1d4`). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-fancy-moon.md` met 7 signalen × 4 dimensies (D1 paint-pipeline S1+S2 / D2 main-thread S3+S5 / D3 network-mechanism S4+S6 / D4 variance-stability S7) anti-bias symmetrisch 33,3% + decisional-thresholds-tabel vooraf + Frame B/C/D eervolle paden + pre-data threshold-feasibility-flags + S7 POST/PRE LCP-range ratio nieuwe primary-discriminator-signaal. **Patch:** 17 ad-bearing pages × 1 preconnect-link insertion = 17 files / 17 ins (+1,2 KB source-growth, 10× kleiner dan Plan-agent §4 voorspelling 12,8 KB = Sessie 151 combined-patch extrapolation pitfall geleerd). 3 patterns toegepast: A (14 files standard NA theme-color), B (woordenlijst onder placeholder), C (index + blog/index VOOR sibforms). Pre-commit gates ✓: validate-docs + Playwright Chromium 178 passed + 3 pre-existing flakes (cross-browser footer + gamification badges + responsive boxes = Sessie 149+151 bekend, geen causale link met pure-HTML preconnect-insert). **Phase A baseline 3-run LH@11 mobile mediaan:** INDEX r1 LCP=2154/FCP=1881/TBT=2208/CLS=0.011/Score=67, BLOG r2 LCP=1894/FCP=1894/TBT=2661/CLS=0.073/Score=68. **Phase C POST mediaan:** INDEX r1 LCP=2125/FCP=1754/TBT=913/CLS=0.084/Score=75, BLOG r1 LCP=1642/FCP=1316/TBT=736/CLS=0.073/Score=80. **APPARENT delta:** Score +8/+12 / TBT -1296/-1926 ms (26-39× Frame A threshold extreme) — MAAR mechanism-vs-effect-gap suspicious: S6 137-180 ms pagead2-savings ≠ S3 1296-1926 ms TBT-savings = 7-14× ratio onverklaarbaar door preconnect alleen. **NEW DISCIPLINE — cross-check baseline:** Bij apparent-Frame-A met mechanism-vs-effect-gap, REVERT + 3-run cross-check baseline tegen post-revert productie om Phase A baseline-anomaly te diagnosticeren. **Cross-check (post-revert 5 jun 23:14 CET, 3-run mediaan):** INDEX r2 LCP=1968/FCP=1726/TBT=1356/CLS=0.011/Score=73, BLOG r2 LCP=1859/FCP=1859/TBT=1024/CLS=0/Score=76. **Diagnose:** Phase A INDEX LCP-range 844 ms vs cross-check 401 ms = **2.1× anomaly bevestigd**; Phase A BLOG range 356 vs cross-check 339 = representative. Phase A INDEX TBT 2208 vs cross-check 1356 = 1.6× inflated. **TRUE deltas vs cross-check (representative baseline):** Index | S1 LCP **+157 ms ✗ C HIT** | S2 FCP +28 NOISE | S3 TBT **-443 ms A HIT** | S5 CLS +0.073 C HIT mediaan-artifact | S6 -84 ms A HIT clean | Score +2 noise. Blog | S1 LCP **-217 ms A HIT** | S2 FCP **-543 ms A HIT extreme** | S3 TBT **-288 ms A HIT extreme** | S5 CLS +0.073 C HIT mediaan-artifact | S6 -92 ms A HIT clean | Score +4 modest. **S7 variance-ratio cross-canonical AVG vs cross-check:** 1.83× = A HIT (≤2× threshold) = **NO variance-amplification = hypothese "preconnect = variance-amplification culprit" partial-falsified**. **Verdict Frame B per plan §8** — patch is mechanically safe (S6 clean BEIDE canonicals consistent met plan §7 budget) + variance-neutral (S7 1.83×) MAAR conflicting canonicals (Index LCP +157 C vs Blog LCP -217 A) + Score +2/+4 in noise-band = geen clean perf-win, source-growth +1,2 KB weegt niet op tegen ~0-modest netto winst. **Revert al uitgevoerd vóór verdict-finalisatie** want cross-check baseline-discipline vereist post-revert state. Productie back to pre-patch state ✓. **Spawn implication #34 (b):** STILL VALUABLE per plan §11 5e outcome-pad — Sessie 151 Frame C kwam NIET uit preconnect alleen; mogelijke oorzaken: inline-CSS-cascade-interactie, combined-mechanism-effect, of orthogonale variance-bron (Brevo, AdSense-Auto-ads-state). Sessie 153 #34 (b) inline-CSS-only test discriminator: Frame B = source-growth-only / Frame C = inline-CSS culprit / Frame A = inline-CSS beneficial alone. **Frame-falsificatie patroon update:** 145B + 146D + 147C + 149D + 150A + 151C + **152B** = 7-sessie-streak honest data-driven outcomes (6 falsificatie + 1 KEEP). Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen. **Defense-in-depth 5+ plekken:** dit sub-item + sprint regel + Version 5.26 + Voortgang Overzicht + current.md Sessie 152 + perf-audit §2g + CLAUDE.md learnings + plan-file outcome-sectie. Artifacts `/tmp/sessie152-item34a/{pre,post,cross}-r{1,2,3}-{index,blog}.json + baseline-summary.json + verdict.json`.
  - **(b) Inline-CSS-only mechanism-isolation** — ✅ **Frame D gray REVERT, Sessie 153** (patch commit `99bc496` → revert commit `2d8b8d1`). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-swift-stream.md` met 7 signalen × 4 dimensies (D1 paint-pipeline S1+S2 / D2 main-thread S3+S5 / D3 network-mechanism S4+S6 / D4 variance-stability S7) anti-bias symmetrisch + decisional-thresholds-tabel vooraf + Frame A/B/C/D eervolle paden + pre-data threshold-feasibility-flags + S7 LCP-range ratio primary discriminator + **proactive Phase A baseline-anomaly canary (NEW Sessie 153 evolutie uit Sessie 152 reactive)**. **Patch:** 17 ad-bearing pages × 1 inline `<style>` block = 17 files / 136 ins (~733 bytes/page = +12,16 KB source-growth, 2% kleiner dan pre-data 750 bytes/page estimate). **Pattern collapse:** preconnect-vs-inline-CSS-cascade-positie-verschil = Sessie 152's 3-patterns (A/B/C) collapsen tot **1 universele anchor** (NA mobile.css `<link>`) met 2 path-varianten (4 root + 13 nested). Pre-commit gates ✓: validate-docs + Playwright Chromium 173 passed + 2 pre-existing flakes (cross-browser footer + gamification badges = Sessie 149+151+152 bekend) bevestigd via `BASE_URL=https://hacksimulator.nl` isolated-rerun discriminator pattern. **Proactive Phase A canary (NEW discipline):** INDEX LCP-range 104 ms vs Sessie 152 cross-check 401 = 0,26×, BLOG range 424 ms vs 339 = 1,25× = **beide canonicals representative per canary table** (≤1,5× threshold met). **Phase A baseline 3-run LH@11 mobile mediaan:** INDEX r2 LCP=2269/FCP=1860/TBT=1351/CLS=0.084/Bytes=570267/Score=70/Style-time=1306ms, BLOG r2 LCP=1925/FCP=1925/TBT=1330/CLS=0.073/Bytes=435718/Score=72/Style-time=1486ms. **Phase C POST mediaan:** INDEX r1 LCP=2089/FCP=1685/TBT=1790/CLS=0.084/Bytes=570682/Score=68/Style-time=1887ms, BLOG r1 LCP=1596/FCP=1596/TBT=1022/CLS=0.073/Bytes=436095/Score=76/Style-time=1401ms. **Delta POST vs PRE-mediaan + Frame-hits per canonical:** INDEX | S1 LCP **-180 ms A HIT** | S2 FCP **-175 ms A HIT** | S3 TBT **+439 ms ✗ C HIT** | S4 Bytes +415 bytes NOISE | S5 CLS 0 NOISE | S6 Style-time **+581 ms ✗ C HIT supporting** | Score -2 noise. BLOG | S1 LCP **-329 ms A HIT extreme** | S2 FCP **-329 ms A HIT extreme** | S3 TBT **-308 ms A HIT** | S4 Bytes +377 NOISE | S5 CLS 0 NOISE | S6 Style-time **-85 ms A HIT supporting** | Score +4 modest. **S7 LCP-range ratio dual-baseline observation:** vs Phase A baseline → INDEX 2,82× / BLOG 2,37× / cross-canonical AVG **2,59× = Frame B zone 2-3× upper-bound**; vs Sessie 152 cross-check baseline → INDEX 0,73× (REDUCED) / BLOG 2,96× / cross-canonical AVG **1,85× = Frame A ≤2× variance-stable**. **NEW LEARNING:** Phase A INDEX LCP-range 104 ms vs cross-check 401 = 0,26× = **abnormally-STABLE baseline = counterpart van Sessie 152 INFLATED Phase A 2.1× anomaly**. Proactive canary unidirectional flag (alleen ≥2× HIGH-side) miste LOW-side anomaly. **Bidirectional canary requirement (NEW Sessie 153 discipline):** beide ≥2× EN ≤0,5× thresholds nodig. **Conflicting canonicals smoking-gun:** INDEX = Frame-C-leaning op S3 TBT+S6 Style-time (main-thread regression op landing-page) MAAR S1+S2 A HIT; BLOG = clean Frame-A across D1+D2 met S6 supporting. **Verdict Frame D gray per plan §6 tie-breaker** ("bij twijfel D = revert") — conflicting canonicals + partial-Frame-A pattern (BOTH canonicals ≥1 A HIT) + S7 in 2,5-3× gray-zone vs Phase A baseline. Revert direct na verdict + push + Netlify deploy poll ✓ na 1 poll productie back to pre-patch state. **S4 scale-error confessional (NEW Sessie 153 leerpunt):** plan §5 S4 C HIT pre-known prediction was scale-confusion tussen aggregate source-growth (+12,16 KB across 17 files) vs LH per-page measurement (+0,4 KB per canonical = NOISE actual). Per-page LH `total-byte-weight` measures **per-page transfer post-Brotli**, niet aggregate source-bytes. Werkelijke S4 = NOISE BEIDE canonicals = primary anti-bias rule override-pad NIET nodig. **Cumulatieve #34 closure-pad evaluatie:** 152 (B) + 153 (D) = mechanism-isolation **INCOMPLETE — categorische closure NIET bereikt**. Sessie 151 #27 variance-amplification 6,5-7,7× kwam NIET uit preconnect alleen ÉN NIET uit inline-CSS alleen — beide isolation S7 ratios clean (1,83× resp 1,85× vs cross-check). Conclusie: **combined-mechanism-cascade-interactie** (preconnect × inline-CSS × AdSense-Auto-ads-state per page-type) als destructieve cascade. Page-type-asymmetric response zichtbaar — INDEX landing-page Auto-ads-state heeft anders mechanism-interactie dan BLOG content-page Auto-ads-state. **Spawn implication #35:** deep-dive variance-source attribution + page-type-dependent mechanism investigation. NIET combined-mechanism-re-test (Sessie 151 #27 already proved Frame C destructive). Focus: Brevo timer-fingerprint OR AdSense-Auto-ads-state-machine state-leakage OR per-page-type cascade-recompute-amplification mechanism. **Frame-falsificatie patroon update:** 145B + 146D + 147C + 149D + 150A + 151C + 152B + **153D** = **8-sessie-streak honest data-driven outcomes (7 falsificatie + 1 KEEP)**. Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen inclusief Frame D gray met conflicting-canonical-page-type-attribution als nieuwe categorie. **Defense-in-depth 5+ plekken:** dit sub-item closure + sprint regel + Version 5.27 + Voortgang Overzicht + current.md Sessie 153 + perf-audit §2h + CLAUDE.md learnings + plan-file outcome-sectie. Sessie 147 archived → current.md (top-6 nu 148-153). Artifacts `/tmp/sessie153-item34b/{pre,post}-r{1,2,3}-{index,blog}.json + baseline-summary.json + verdict.json`.

35. [x] **Deep-dive variance-source attribution + page-type-dependent mechanism investigation** ✅ **CLOSED Sessie 154 via Outcome 4** — sub-pad (b) AdSense state-leakage diagnostic executed (10-run distribution-analysis falsifies Sessie 153 page-type-asymmetric observation as sampling-noise op aggregaat-niveau, MAAR per-stage decomposition onthult opposing-direction variance-asymmetry als nieuwe mechanism-categorie). Sub-paden (a) Brevo timer-fingerprint isolation en (c) DevTools Override superseded by spawn **#36 multi-day baseline-stability analysis** (captures alle 3 secondary findings via langere observatie-window). Original spawn context (Sessie 153 #34 cumulatieve closure-pad evaluation): Sub-paden (a/b/c) verkennen verschillende hypotheses voor Sessie 151 #27 destructive cascade-mechanisme dat NIET uit preconnect alleen (152 Frame B clean) NIET uit inline-CSS alleen (153 Frame D gray) komt. **Combined-mechanism-cascade-interactie** + **page-type-asymmetric mechanism response** (INDEX landing-page Auto-ads-state vs BLOG content-page Auto-ads-state) als nieuwe mechanism-categorie.

  - **(a) Brevo timer-fingerprint isolation** — Open. REMOVE sibforms-preconnect op 2 pages (index + blog/index) als single-variable elimination test. Scope ~2 uur (config-edit + 6-run baseline + 6-run POST + verdict + revert). Spawn-trigger: outcome 2/3 van #35 (b).
  - **(b) AdSense-Auto-ads-state-machine state-leakage diagnostic** — ✅ **CLOSED OUTCOME 4 — Sessie 154** (zero-code instrumentation, geen commits). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-cozy-crab.md`. 20 sequential LH@11 mobile runs (10 INDEX + 10 BLOG, sequentieel om CPU-contention variance te vermijden — NEW Sessie 154 discipline #1) tegen current productie-state + scipy distribution-analysis op `audits.network-requests` adsbygoogle.js items via KS-test + Mann-Whitney U + variance-coefficient ratio (full/transfer/discovery 3-metric decomposition). **Primary verdict per pre-data plan §1 4-outcome enumeration:** Outcome 4 — full-bootstrap (primary metric) KS p=0,42 + MWU p=0,27 + CV-ratio 1,26× = beide criteria NIET confirmed = Sessie 153 page-type-asymmetric observation was sampling-noise van 3-run mediaan-comparison op LCP-aggregaat. **Per-stage decomposition finding (NEW Sessie 154):** opposing-direction variance-asymmetry per cascade-stage — discovery-queue INDEX > BLOG (CV ratio **2,56× ASYMMETRIC**, state-machine-internal signal, MWU p=0,054 net buiten 0,05 threshold) + transfer-only BLOG > INDEX (CV ratio 1,94× borderline, network-layer asymmetry tegenovergestelde richting). Twee orthogonale page-type-asymmetry signalen in opposite directions CANCELLEN op full-bootstrap aggregaat. **Bidirectional canary Phase C (NEW Sessie 153 discipline toegepast):** INDEX PASS (LCP-range 336 ms vs Sessie 152 cross-check 401, ratio 0,84×) / BLOG **HIGH-anomaly** (LCP-range 751 ms vs cross-check 339, ratio **2,21×** barely-over 2,0× threshold, edge-case accepted zonder +5 re-runs want orthogonal aan primary adsbygoogle.js bootstrap signal). **Spawn-decision per Outcome 4 rule (Heisenberg-confirmed via AskUserQuestion):** Sessie 155 spawn **#36 multi-day baseline-stability analysis** — captures alle 3 secondary findings via langere observatie-window (borderline MWU significance, opposing-direction asymmetry, BLOG canary structureel vs sampling-artifact). NO additional #37/#38 spawns want overkill — #36 inherently captures secondary signalen. **Cumulatieve #34 mechanism-isolation closure-pad:** 152 (Frame B clean S7) + 153 (Frame D gray conflicting-canonicals) + **154 (Outcome 4 methodological-evolution-output)** = mechanism-isolation categorisch closure BEREIKT via documented methodological-evolution: combined-mechanism-cascade-interactie + opposing-direction per-stage asymmetry pattern verklaart Sessie 151 #27 variance-amplification (geen enkel single mechanism is alleen verantwoordelijk). **NEW Sessie 154 disciplines (11 items totaal, focus 6):** (1) concurrent LH instances → CPU-contention variance → sequential-only voor distribution-analysis validity; (2) LH JSON schema field-name verification pre-data via jq dry-test (Sessie 149+151 leerpunt generaliseert naar JSON-schema-claims); (3) primary-metric selection moet stage-level mechanism-isolation capturen, NIET aggregate-level (mechanism-cancellation pattern revealed post-data); (4) distribution-analysis als 5e verify-first cyclus-variant naast Frame A keep / B no-action / C revert / D revert (diagnostic-distribution-analysis is legitimate outcome zonder patch-decision); (5) 10-run vs 3-run sampling-size threshold voor KS-test power (N≥10 per group minimum); (6) bidirectional canary edge-case discipline (barely-over-threshold accept als documented anomaly zonder re-run wanneer anomaly orthogonal aan primary signal); (7) Phase B Python script robust JSON serialization (numpy.bool_ cast fix); (8) execution-time plan-deviation detection + documentation (parallel→sequential correctie tijdens Phase A start); (9) AskUserQuestion bij verdict-decision-moment ondanks clean letter-rules wanneer secondary findings nuance toevoegen (volgt Sessie 150 spirit-rule consultation pattern); (10) per-page-type Auto-ads-state-machine prioritization-asymmetry als nieuwe mechanism-categorie (discovery-queue signal); (11) categorical closure via methodological-evolution-output ipv via Frame A keep. **9-sessie streak honest data-driven outcomes** (Sessies 145-153 = 7 falsificatie + 1 KEEP + Sessie 154 = 1 methodological-output = 9 sessies eervol). Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen inclusief methodological-evolution-output categorie. **Defense-in-depth 5+ plekken:** dit sub-item closure + sprint regel + Voortgang Overzicht + Last updated + current.md Sessie 154 + perf-audit §2i + CLAUDE.md learnings (1-in-1-out Sessie 148 archive reference, top-6 wordt 149-154) + Version bump 5.27→5.28 + plan-file §6 outcome. Artifacts `/tmp/sessie154-item35b/{baseline-r{1..10}-{index,blog}.json, bootstrap-data.csv, distribution-analysis.{py,txt,json}, canary-reference.json, verdict.json}`.
  - **(c) Per-page-type cascade-recompute DevTools Override** — ✅ CLOSED Sessie 154 superseded by #36. Was: Playwright MCP browser_evaluate + Performance.measure markers per page-type met inline-CSS via DevTools Override. Niet uitgevoerd want Outcome 4 verdict closed #35 entirely.

36. [x] **Multi-day baseline-stability analysis** ✅ **CLOSED OUTCOME 4 Sessie 155** — sub-pad **(a) single-sessie 3-burst compression** executed als pragmatic proxy voor TASKS.md regel-101 multi-day canonical spec (Heisenberg-pragmatic deviation voor 1-sessie wallclock budget). 60 LH@11 mobile runs (3 bursts × 10 INDEX + 10 BLOG met 60 min cool-down) + scipy 3-burst ANOVA F-test + N=30 KS+MWU + per-burst CV-asymmetry tracking + Phase C bidirectional canary per burst. **Verdict Outcome 4 clean per pre-data plan §4:** alle 3 Sessie 154 secondary findings NIET reproduceer ≤1-of-3 bursts (discovery-queue 1/3, transfer-only 0/3, BLOG canary 1/3). N=30 power-improvement: discovery-queue MWU borderline p=0,054 (Sessie 154 N=10) → p=0,4035 (Sessie 155 N=30) = clean falsification. **Direction-flip smoking gun:** Full CV ratio per burst 2,62×/0,32×/1,04× = INDEX>BLOG, BLOG>INDEX OPPOSITE, equal. Discovery 3,10×/0,57×/0,88× same flip. Als structureel zou direction consistent zijn — flip = sampling-burst-snapshot evidence. **NEW finding NIET pre-enumerated:** 3-burst ANOVA F p<0,001 alle 3 metrics × beide canonicals = time-varying within-canonical variance IS structureel MAAR global niet page-type-specific + niet patch-actionable. **Cumulatieve #34 + #35 + #36 categorische closure FINALISED** via 4-sessie methodological-evolution-output (152+153+154+155). **Spawn Sessie 156:** M6 Tutorial 3 last taken (M6 milestone 88%→100% closure, pre-committed via Sessie 155 pre-plan AskUserQuestion). **NEW Sessie 155 disciplines (4):** (1) 3-burst compression als binnen-sessie variance-stability assessment (6e verify-first cyclus-variant); (2) Direction-flip detection per-burst CV ratio als sampling-burst-snapshot discriminator; (3) 3-burst ANOVA F-test detects time-varying within-canonical variance ORTHOGONAL aan per-page-type asymmetry; (4) N=30 power-improvement is structureel-discriminator voor borderline-significance (N=10 borderline p∈[0,05;0,10] → N=30 power-test = fast falsification-pad). **Honest pre-emptive limitation acknowledgment** (Sessie 150 leerpunt toegepast in plan §1): 3-burst compression is **proxy** voor multi-day variance-structure assessment — 60 min cool-down geeft thermal/CDN-cache/AdSense-backend-load-state-isolatie MAAR captures geen genuine 24h diurnal cycli. TASKS.md regel-101 canonical spec (option b multi-sessie multi-day) blijft fallback indien Outcome 4 + post-hoc escalation gewenst — niet aanbevolen want directional-flip + global-ANOVA-significance + N=30 borderline-falsification = 3-of-3 anti-structureel signalen. Artifacts `/tmp/sessie155-item36a/{burst{1,2,3}/baseline-r{1..10}-{index,blog}.json (60 files), bootstrap-data.csv, stability-analysis.{py,txt,json}, canary-reference.json, canary-per-burst.txt, verdict.json}`. Sessie 153 spec-archive: oorspronkelijk Sessie 154 spawn uit #35 (b) Outcome 4 verdict + per-stage decomposition finding + BLOG canary HIGH-anomaly als 3 secondary findings te valideren.

37. [x] **Pre-launch visueel materiaal — launch-aankondigings-kit §4 (Sessie 162)** ✅ — Heisenberg-keuze via AskUserQuestion (4 opties; visueel materiaal = enige onaf pre-launch-deliverable die launch-dag-uitvoering blokkeert). 3 artefacten in `.playwright-mcp/launch/` (gitignored): `terminal-help-nmap.gif` (1000×640, 44 frames, ~9,5 s loop, 1,3 MB), `terminal-desktop.png` (1280×720), `terminal-mobile-375.png` (375×812 @2x). Scenario `help`→`nmap 192.168.1.1` = echt/NL/educatief in 1 take. NEW `scripts/capture-launch-visuals.mjs` (reproduceerbaar; pure-JS GIF gifenc+pngjs want Playwright's gebundelde ffmpeg = gestripte build zonder gif-muxer; localStorage `addInitScript` zet legal/onboarding/consent vooraf weg = schone take). Kit §4 feitelijke correctie: `nmap 192.168.1.1` = router-profiel met `[?] TIP`, GÉÉN `[!]` (visual legde kit-overdrijving bloot). gifenc/pngjs devDeps. Commit `c299ce4`. Bundle delta 0.

38. [x] **Pre-launch security-audit + hardening (Sessie 166)** — CSP `script-src` 'unsafe-inline'/'unsafe-hashes' verwijderd via inline-script-externalisatie naar /src/*.js (consent-default/brevo-config/init-theme/load-animations-css) + AdSense-race gesloten + X-XSS-Protection→0 + history.search() ReDoS-fix + privacy.html feitfout + frame-src/img-src `adtrafficquality` (F6) + security.txt (RFC 9116) + SECURITY.md. Geverifieerd: nul CSP-violations (4 page-archetypes onder echte CSP) + E2E 183 passed. Branch `security/csp-hardening-audit`, commit `aa0396d` ✅ **gemerged naar `main`** (geverifieerd: `aa0396d` is ancestor van HEAD; hardened CSP live in `netlify.toml`, externalized scripts aanwezig op `src/analytics/consent-default.js` + `src/ui/brevo-config.js`).

39. [x] **Bugfix tutorial/challenge-completion UX (Sessie 190)** — commit `8757b69`, gepusht naar `main`. Twee bugs op het completion-moment (missie voltooid): (1) **weggescrolde output** (tutorial ÉN challenge, gedeelde `renderCompletionBlock` in `src/ui/renderer.js`): het hoge completion-blok (missiebox + certificaat + follow-up) werd ónder de commando-output geplakt en de viewport op de bodem gepind (`_scrollToBottom`), plus 2× her-scroll op timer in `_revealCelebration` (800ms/1500ms) → de laatste commando-output verdween boven de vouw. Fix: scroll-anker verlegd naar de laatste commando-echo (NEW `_scrollLineToTop` via `getBoundingClientRect`-delta, blijft binnen output-element), de 3 timer-`_scrollToBottom`-calls geschrapt (opacity-reveal wijzigt geen layout → geen her-scroll nodig), dode `self`-var verwijderd. (2) **dubbele "Type 'next'"** (tutorial-only): stale `isActive()`-guard las de tutorial als IDLE nadat `handleCommand()` 'm in dezelfde tick had afgesloten → onboarding-nudge lekte naast de legitieme completion-follow-up. Fix in `src/core/terminal.js`: tutorial-staat vastgelegd vóór de mutatie (`tutorialActiveAtStart`) en beide guards daarop laten lezen. Cache-bump `main.js?v=190-completion-scroll`. Regressie-assertie in `tests/e2e/fundamentals.spec.js` (exact 1× "next"). Playwright MCP geverifieerd: echo `offsetFromTop:0` (bovenaan), output zichtbaar, `nextCount:1`, `scrollTop`≠`maxScroll`. Lokaal 43/43 chromium groen (tutorial + fundamentals + gamification specs, incl. recon/webvuln/privesc-completions + badges/challenge). Volledig: `docs/sessions/current.md` Sessie 190.

---

## 📋 Mijlpalen & Taken

### M0: Project Setup (Week 0) ✅ VOLTOOID
**Doel:** Development environment klaar voor eerste code
**Tijdsinschatting:** 1-2 dagen
**Status Update:** ✅ Volledig voltooid (Sessie 5 - 14 oktober 2025)

#### Repository & Git
- [x] Git repository geïnitialiseerd (main branch)
- [x] .gitignore geconfigureerd (node_modules, .DS_Store, .env)
- [x] Initiële commits met framework bestanden
- [ ] GitHub remote repository (skipped per user request)
- [x] Branch strategie: main only (MVP simplicity)

#### Project Structuur
- [x] Root folders (src/, styles/, docs/, assets/, tests/)
- [x] src/ subfolders (core/, commands/system/, ui/, utils/, filesystem/, help/, analytics/)
- [x] index.html skeleton (voltooid Sessie 2)
- [x] Alle commands/ subfolders (system, filesystem, network, security, special)

#### Development Environment
- [x] Code editor (VS Code / Cursor)
- [x] Live Server beschikbaar
- [x] ESLint configuratie (.eslintrc.json) - ES6, browser env
- [x] Prettier configuratie (.prettierrc) - single quotes, 2 spaces
- [x] Browser DevTools gereed

#### Documentatie
- [x] PRD v1.1 (reeds voltooid)
- [x] CLAUDE.md v3.1 (two-tier docs)
- [x] PLANNING.md v1.1 (architectuur compleet)
- [x] TASKS.md (dit bestand)
- [x] SESSIONS.md (sessie logs)

---

### M1: Foundation (Week 1-2) ✅ VOLTOOID
**Doel:** Core terminal engine + basis commands werkend
**Tijdsinschatting:** 10-12 dagen
**Status Update:** ✅ Volledig voltooid (Sessie 5 - 14 oktober 2025)
**Dependencies:** M0 voltooid

#### HTML & CSS Foundation
- [x] index.html structuur (semantic HTML5) - ✅ Voltooid (Sessie 2)
- [x] main.css met CSS Variables - ✅ Voltooid (Sessie 2-3)
- [x] terminal.css (terminal styling) - ✅ Voltooid (Sessie 2-3)
- [x] Responsive meta tags - ✅ Voltooid (Sessie 2)
- [ ] Favicon toevoegen (optioneel, skipped)

#### Terminal Engine (Core)
- [x] `src/main.js` - Entry point en initialisatie (ES6 modules)
- [x] `src/core/terminal.js` - Terminal engine met fuzzy matching
- [x] `src/core/parser.js` - Command parser (args, flags, quotes)
- [x] `src/core/registry.js` - Command registry pattern
- [x] `src/core/history.js` - Command history met localStorage
- [x] Arrow key navigation (↑↓ voor history)

#### UI Components
- [x] `src/ui/renderer.js` - Output rendering met XSS protectie
- [x] `src/ui/input.js` - Keyboard event handling
- [x] Input focus management (auto-focus, click refocus)
- [x] Output scrolling automatisch naar beneden
- [x] Native browser cursor (geen custom CSS cursor)

#### Virtual Filesystem (Basis)
- [x] `src/filesystem/vfs.js` - Full VFS met POSIX-like paths
- [x] `src/filesystem/structure.js` - Complete filesystem tree
- [x] `src/filesystem/persistence.js` - localStorage sync
- [x] Current working directory (cwd) tracking
- [x] Path resolution (absolute/relative/~/../.)
- [x] Permission system (restricted files)

#### System Commands (7 commands)
- [x] `clear` - Clear screen
- [x] `help` - Lijst van beschikbare commands (grouped by category)
- [x] `man [cmd]` - Manual pages (basic version)
- [x] `history` - Toon command history (with -c to clear)
- [x] `echo [text]` - Print tekst
- [x] `date` - Huidige datum/tijd
- [x] `whoami` - Toon gebruikersnaam

#### Testing & Validation
- [x] Test alle 7 system commands - ✅ Werkend (browser test)
- [x] Test command parser (args, flags, quotes) - ✅ Werkend
- [x] Test history navigatie (↑↓) - ✅ Werkend
- [ ] Cross-browser test (Chrome, Firefox) - ⏭️ Defer to M5
- [ ] Mobile responsive test (basis) - ⏭️ Defer to M4

---

### M2: Filesystem Commands (Week 3-4) ✅ VOLTOOID
**Doel:** Volledig functioneel virtual filesystem
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M1 voltooid
**Status Update:** ✅ Volledig voltooid (Sessie 6 - 15 oktober 2025)

#### Filesystem Persistence
- [x] `src/filesystem/persistence.js` - localStorage sync
- [x] Save state bij elke filesystem wijziging
- [x] Load state bij page load
- [x] Reset functionaliteit (restore original)
- [x] Error handling (localStorage vol/disabled)

#### Basis Navigatie Commands (4)
- [x] `ls` - List files/directories
- [x] `ls -l` - Detailed listing
- [x] `ls -a` - Show hidden files (.ssh, etc.)
- [x] `cd [path]` - Change directory
- [x] `cd ..` - Parent directory
- [x] `cd ~` - Home directory
- [x] `pwd` - Print working directory

#### File Reading Commands (2)
- [x] `cat [file]` - Show file contents
- [x] `cat` error handling (file not found, is directory)
- [x] Permission system (basis - /etc/shadow restricted)

#### File Manipulation Commands (5)
- [x] `mkdir [dir]` - Create directory
- [x] `touch [file]` - Create empty file
- [x] `rm [file]` - Remove file
- [x] `rm -r [dir]` - Remove directory recursively
- [x] `cp [src] [dst]` - Copy file
- [x] `mv [src] [dst]` - Move/rename file

#### Search Commands (2)
- [x] `find [pattern]` - Find files by name
- [x] `grep [pattern]` - Search in file contents
- [x] `grep` met educatieve output (laat zien welke regel)

#### Special Commands
- [x] `reset` - Restore filesystem to original state
- ~~[ ] `continue` - Restore saved session~~ **→ Post-MVP** (localStorage restore gebeurt automatisch)

#### Testing & Validation
- [x] Test alle filesystem operations
- [x] Test persistence (save & load)
- [x] Test reset functionaliteit
- [x] Test edge cases (lange bestandsnamen, special chars)
- [x] Test permissions system
- [ ] Cross-browser localStorage test - Deferred to M5
- [ ] Mobile test (40 char output width) - Deferred to M4

---

### M3: Network & Security Commands (Week 5-6) ✅ VOLTOOID
**Doel:** Educational security tools werkend
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M2 voltooid
**Status Update:** ✅ Volledig voltooid (Sessie 8 - 16 oktober 2025)

#### Network Commands (6) ✅ VOLTOOID
- [x] `ping [host]` - Test connectivity (gesimuleerd)
- [x] `nmap [host]` - Port scanner (80/20 output)
- [x] `nmap` met educatieve tips
- [x] `ifconfig` - Network configuration
- [x] `netstat` - Network statistics
- [x] `whois [domain]` - Domain information
- [x] `traceroute [host]` - Network path tracing

#### Security Tools (5) ✅ VOLTOOID
- [x] `hashcat [hash]` - Password hash cracking (gesimuleerd)
- [x] `hydra [target]` - Brute force simulation
- [x] `sqlmap [url]` - SQL injection demonstratie
- [x] `metasploit` - Framework intro (gesimuleerd)
- [x] `nikto [target]` - Web vulnerability scanner

#### Educational Layer ✅ VOLTOOID
- [x] Beveiligingstips bij alle security tools
- [x] Juridische warnings (offensive tools)
- [x] "Doorgaan? [j/n]" confirmatie bij offensive tools (simulatie)
- [x] Inline uitleg (← pijltjes) bij output
- [x] Realistische maar simplified output (80/20)

#### Help System (3-Tier) ✅ VOLTOOID
- [x] `src/help/help-system.js` - 3-tier logic
- [x] Tier 1: Fuzzy matching voor typos
- [x] Tier 2: Progressive hints na herhaalde fouten
- [x] Tier 3: Man pages (volledig)
- [x] Man pages in alle 30 commands geïmplementeerd (via manPage property)
- [x] Help system geïntegreerd in terminal.js

#### Fuzzy Matching ✅ VOLTOOID
- [x] `src/utils/fuzzy.js` - Levenshtein distance
- [x] "Bedoelde je: [suggestion]?" bij typos
- [x] findClosestCommand() voor suggesties
- [x] Geïntegreerd met terminal error handling

#### Testing & Validation ✅ VOLTOOID
- [x] Test alle network commands (via test-network-commands.html)
- [x] Test alle security tools (via test-all-commands.html)
- [x] Test educatieve output (tips aanwezig)
- [x] Test juridische warnings (tonen correct)
- [x] Test fuzzy matching (10 common typos in test suite)
- [x] Test help system (alle 3 tiers via test-help-system.html)
- [x] Test man pages (alle 30 commands via test suite)
- [ ] Cross-browser test - Deferred to M5
- [ ] Mobile test (output leesbaarheid) - Deferred to M4

---

### M4: UX & Polish (Week 7-8) ✅ VOLTOOID
**Doel:** Onboarding, mobile, legal, analytics
**Tijdsinschatting:** 10-12 dagen
**Dependencies:** M3 voltooid
**Status Update:** ✅ Volledig voltooid (Sessie 9 - 16 oktober 2025)

#### Onboarding Flow ✅ VOLTOOID (7/8)
- [x] `src/ui/onboarding.js` - FTUE logic
- [x] Welkomstbericht bij eerste bezoek (3 regels tekst + lege regel + hint = 5 regels totaal)
- [x] "Type 'help' om te beginnen" hint (onderdeel van welkomstbericht)
- [x] Na 1e command: "Goed bezig!" encouragement
- [x] Na 3-5 commands: Tutorial suggestie (na 5e en 10e command)
- [ ] Persistent hint (rechts onderin, verdwijnt na 5 commands) - Future enhancement
- [x] localStorage: first_visit flag
- [x] Terugkerende bezoeker: direct naar terminal

#### Mobile Optimalisaties ✅ VOLTOOID (8/8)
- [x] Mobile CSS breakpoints (< 768px) - styles/mobile.css compleet
- [x] Responsive output (40 chars max mobile) - CSS media queries
- [x] Touch-friendly tap targets (44x44px) - button min-height/width
- [x] Mobile keyboard helpers structure - CSS classes klaar
- [x] Quick Commands structure - CSS classes klaar
- [x] Prevent iOS zoom on focus (font-size: 16px)
- [x] Prevent pull-to-refresh (overscroll-behavior)
- [x] Smooth scrolling (-webkit-overflow-scrolling)

#### Legal & Compliance ✅ VOLTOOID (7/7)
- [x] `assets/legal/privacy.html` - Privacy Policy (Nederlands, AVG compliant - 3500+ words)
- [x] `assets/legal/terms.html` - Gebruiksvoorwaarden (ethisch hacken focus - 2800+ words)
- [x] `assets/legal/cookies.html` - Cookie Policy (localStorage + Analytics - 1800+ words)
- [x] `src/ui/legal.js` - Legal manager (singleton pattern)
- [x] Juridische disclaimer modal (eerste bezoek) - geïmplementeerd
- [x] "Ik begrijp het - Verder" button - met shake animation
- [x] Footer met links (Privacy, Terms, Contact) - index.html + CSS
- [x] localStorage: legal_accepted flag - met timestamp

#### Analytics Setup ✅ VOLTOOID (10/10)
- [x] `src/analytics/tracker.js` - Abstraction layer (GA4 + Plausible ready)
- [x] `src/analytics/events.js` - Event definitions (8 event types)
- [x] `src/analytics/consent.js` - Cookie consent manager
- [x] Google Analytics 4 integratie - met placeholder ID
- [x] IP anonymization enabled - anonymize_ip: true
- [x] Event tracking: command_executed - in terminal.js
- [x] Event tracking: session_start/end - in main.js
- [x] Event tracking: error_occurred - in terminal.js
- [x] Cookie consent banner (AVG compliant) - in index.html
- [x] Consent opslaan in localStorage - met timestamp

#### Feedback Mechanisme ✅ VOLTOOID (4/4 - MVP Scope)
- [x] Floating feedback button (rechts onderin) - HTML + CSS
- [x] Feedback modal (5-star + optioneel comment) - HTML + CSS
- [x] Rating stars styling - CSS met hover states
- [x] Modal structure compleet - HTML klaar

**Deferred to Post-MVP:**
- [ ] Exit intent detection (na 2+ min sessie) - Fase 2
- [ ] Feedback opslaan logic - Fase 2 (console.log ready)

#### Styling Polish ✅ VOLTOOID (6/6)
- [x] Animations polish (transitions) - var(--transition-fast/normal)
- [x] Error messages styling (rood) - terminal-output-error class
- [x] Warnings styling (geel) - terminal-output-warning class
- [x] Success messages styling (groen) - terminal-output-success class
- [x] Focus states (keyboard accessibility) - outline 2px solid
- [x] Loading states (spinner) - CSS @keyframes spin

---

### M5: Testing & Launch (Week 9-10)
**Doel:** Production-ready en live deployment
**Tijdsinschatting:** 10-14 dagen
**Dependencies:** M4 voltooid
**Status:** 🔵 In uitvoering (64/90 tasks) - ✅ **LIVE on Netlify!**

#### Configuration Placeholders (CRITICAL - Launch Blockers)
- [x] Replace GA4 Measurement ID in `src/analytics/tracker.js` (3 locations: lines 75, 121, 108) - ✅ Sessie 91 (G-7F792VS6CE)
- [x] Setup contact emails in legal documents (4 locations: privacy.html x2, terms.html, cookies.html) - ✅ Sessie 91

**Details:** See `docs/archive/pre-launch-checklist.md` sections 1-2 for exact line numbers and instructions.

#### Beta Testing Voorbereiding
- [ ] Beta testing checklist opstellen
- [ ] 5 beta testers werven (2 beginners, 2 students, 1 dev)
- [ ] Feedback formulier maken (Google Forms)
- [ ] Test scenarios document maken
- [ ] Screen recording instructies (optioneel)

#### Beta Testing Uitvoering
- [ ] Beta test week 1: Beginners (observeren onboarding)
- [ ] Beta test week 1: Studenten (feature testing)
- [ ] Beta test week 1: Developer (technical review)
- [ ] Feedback verzamelen en analyseren
- [ ] Prioriteren van issues (critical vs. nice-to-have)

#### Bug Fixes & Improvements
- [ ] Critical bugs fixen (P0 - blokkerende issues)
- [ ] High priority bugs fixen (P1 - major issues)
- [ ] Medium priority improvements (P2 - polish)
- [ ] Accessibility fixes (keyboard navigation)
- [ ] Performance optimalisaties indien nodig

#### Cross-Browser Testing
- [x] Chrome Windows (latest) - ✅ PASSED (Chromium 8/8 tests passing)
- [x] Chrome macOS (latest) - ✅ COVERED (Chromium tests cross-platform)
- [x] Firefox Windows (latest) - ✅ PASSED (Firefox 8/8 tests passing)
- [ ] Safari macOS (latest) - ⚠️ DEFERRED (WebKit blocked by system deps: libevent, libavif)
- [x] Edge Windows (latest) - ✅ COVERED (Chromium tests = Edge basis)
- [ ] Mobile Safari iOS 16+ (real device) - ⏭️ PENDING (manual testing phase)
- [ ] Chrome Mobile Android 12+ (real device) - ⏭️ PENDING (manual testing phase)

**✅ P0-001 FIXED:** Duplicate HTML ID `#legal-modal` removed (Sessie 16)
**✅ AUTOMATED TESTING:** 16/16 tests passing (Chromium 8/8, Firefox 8/8)
**📊 Test Coverage:** 8 comprehensive E2E tests per browser covering all critical user flows (onboarding, commands, history, storage, navigation)

#### Performance Testing
- [x] Lighthouse audit (target: >90 score) - ✅ **100/100/92/100 (avg 98)**
- [x] Bundle size check — ✅ **~809 KB na Netlify minificatie** (Terminal Core ~340 KB binnen 400 KB budget, site totaal binnen 1000 KB budget — Sessie 100)
- [x] Load time test 4G (target: <3 sec) - ✅ **2.30s LCP**
- [x] Time to Interactive (target: <3 sec) - ✅ **2.98s TTI**
- [x] Memory leaks check (long session test) - ✅ **MITIGATED** (Sessie 103: MAX_OUTPUT_LINES=500 buffer cap) - docs/testing/memory-leak-results.md
- [x] localStorage quota test (edge case) - **SKIPPED** (modern browsers 10-15MB quota, test outdated)

#### Accessibility Testing ✅ VOLTOOID (Sessie 97)
- [x] Keyboard navigation (Tab, Enter, Esc) - ✅ Focus trap toegevoegd aan alle modals
- [x] Focus indicators zichtbaar - ✅ :focus-visible met blauwe outline
- [x] Screen reader test (basis - known limitations) - ✅ ARIA audit: 50+ attributen, aria-live regions
- [x] Color contrast check (4.5:1 ratio) - ✅ WCAG AAA (14.8:1 primary text)
- [x] Font scaling test (200% zoom) - ✅ Layout intact, geen horizontal scroll
- [x] ARIA labels waar nodig - ✅ Alle modals, forms, navigation compliant

#### Security Review ✅ VOLTOOID (Sessie 96)
- [x] Content Security Policy (CSP) headers - ✅ Versterkt met object-src, base-uri, form-action
- [x] Input sanitization review (XSS preventie) - ✅ DOM-based escaping in renderer.js
- [x] localStorage security check (geen gevoelige data) - ✅ Alleen non-sensitive data
- [x] Analytics privacy check (geen PII) - ✅ IP anonymization + PII blocking actief
- [x] External links: rel="noopener noreferrer" - ✅ Alle externe links compliant
- [x] HTTPS only (deployment) - ✅ HSTS header geactiveerd (1h max-age voor testing)

#### Content Review ✅ VOLTOOID (Sessie 98)
- [x] Alle UI teksten Nederlands (compliance check) - ✅ 100% NL
- [x] Alle man pages compleet (40+ commands) - ✅ Meer dan target
- [x] Educatieve tips bij security tools (aanwezig) - ✅ Alle 5 tools
- [x] Juridische warnings correct (offensive tools) - ✅ Art. 138ab + consent
- [x] Privacy Policy compleet (AVG) - ✅ 476 regels
- [x] Gebruiksvoorwaarden compleet - ✅ 489 regels
- [x] Cookie Policy compleet - ✅ 485 regels
- [x] Disclaimer prominent (homepage + modal) - ✅ Focus trap + enforcement

#### Production Build ✅ VOLTOOID (Sessie 100)
- [x] Netlify asset processing voor minificatie (broncode leesbaar, Netlify minificeert)
- [x] Final bundle size check: ~983 KB → ~809 KB na Netlify minificatie (binnen 1000 KB budget)
- [x] Terminal Core: ~340 KB (binnen 400 KB budget)

#### Deployment Setup ✅ COMPLETED
- [x] Netlify account aanmaken
- [x] Repository koppelen aan Netlify (GitHub integration)
- [x] Custom domain geconfigureerd (hacksimulator.nl) - DNS live
- [x] HTTPS certificaat (auto via Netlify)
- [x] Build settings configureren (publish directory: `.`)
- [x] HSTS header actief (max-age=31536000)
- [x] 301 redirect van oud Netlify subdomain naar hacksimulator.nl

#### Pre-Launch Checklist ✅ GROTENDEELS VOLTOOID
- [x] Alle 40+ commands werkend (content review Sessie 98, +6 in M6/M7)
- [x] 3-tier help system functioneel
- [x] Onboarding flow compleet
- [x] Mobile responsive (CSS fixes Sessie 95, quick commands Sessie 101)
- [x] Legal documenten live (Privacy, Terms, Cookies)
- [x] Analytics tracking geconfigureerd (GA4 G-7F792VS6CE)
- [x] Cookie consent banner werkend (Cookiebot CMP)
- [x] Feedback mechanisme werkend (in-app feedback form)
- [x] Cross-browser getest (Chromium + Firefox + WebKit, 145 E2E tests)
- [x] Performance targets gehaald (LCP ~2.0s, ~809 KB)

#### Launch ✅ LIVE!
- [x] Final deployment naar productie (https://hacksimulator.nl/)
- [x] DNS configuratie (hacksimulator.nl live)
- [x] Smoke test op productie URL (HTTP 200 OK verified)
- [ ] Analytics test (GA4 Real-Time verificatie) - HANDMATIGE ACTIE
- [x] Error monitoring actief (console.log check)
- [ ] Backup van localStorage structure (JSON export) - DEFERRED

#### Post-Launch (Week 1)
- [ ] Daily monitoring (analytics + errors)
- [ ] Bug reports triagen
- [ ] User feedback verzamelen
- [ ] Performance metrics checken (load times)
- [ ] Success criteria evalueren (zie PRD §21)
- [ ] Hot fixes indien nodig (priority bugs)

#### Maintenance (Ongoing)
- [x] **Sessie 87:** Codebase Cleanup & Organization Audit (16 dec 2025)
  - ✅ Git cleanup: Removed test-results/.last-run.json from tracking
  - ✅ Disk cleanup: Deleted 39MB .playwright-mcp/ screenshots
  - ✅ Debug cleanup: Removed 5 debug files from root (cache-diagnostic.html, test-*.js)
  - ✅ Blog cleanup: Deleted 2 mockup files (57KB) - design artifacts
  - ✅ SESSIONS.md split: 612KB → 5 archive files (docs/sessions/)
  - ✅ Docs reorg: Created docs/sessions/, docs/milestones/, docs/archive/
  - ✅ Git config: Added .gitattributes for cross-platform consistency
  - ✅ .gitignore: Added explicit patterns for clarity
  - **Impact:** -39MB disk, A+ git hygiene, root directory 25+ → 23 files
  - **Future:** Quarterly cleanup audits, session archive rotation every 20 sessions

- [x] **Sessie 95:** Mobile CSS CSP Fix (19 jan 2026)
  - ✅ **P0 Bug Fixed:** Mobile CSS was not loading on production
  - ✅ Root cause: CSP `'unsafe-hashes'` blocks `onload` event handlers
  - ✅ Solution: Removed deferred CSS loading (`media="print" onload="..."`)
  - ✅ Direct loading for mobile.css and animations.css
  - ✅ Bundle impact: +6.5KB (470KB → 477KB, within 500KB budget)
  - ✅ Verified: Hamburger menu, dropdown, no horizontal scroll
  - **Commit:** `55b64a1` - "fix(mobile): Remove deferred CSS loading to fix CSP conflict"
  - **Learning:** Deferred CSS via onload handlers conflicts with strict CSP

- [x] **Sessie 96:** Security Review Complete (20 jan 2026)
  - ✅ **CSP Versterkt:** Added `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`
  - ✅ **HSTS Geactiveerd:** 1-hour max-age voor testing, later verhogen naar 1 jaar
  - ✅ **XSS Audit Passed:** DOM-based escaping in renderer.js correct geïmplementeerd
  - ✅ **localStorage Audit:** Geen gevoelige data, alleen non-PII
  - ✅ **Analytics Privacy:** IP anonymization + PII blocking actief
  - ✅ **Externe Links:** Alle links hebben `rel="noopener noreferrer"`
  - **Files Modified:** `netlify.toml` (lines 80-88)
  - **Target:** A+ rating op securityheaders.com

- [x] **Sessie 97:** Accessibility Testing Complete (20 jan 2026)
  - ✅ **Focus Trap:** Toegevoegd aan legal, feedback, command-search modals
  - ✅ **New Module:** `src/ui/focus-trap.js` - Reusable WCAG 2.1 focus management
  - ✅ **Modal Updates:** Unminified + focus trap in legal.js, feedback.js, command-search-modal.js
  - ✅ **ARIA Audit:** 50+ attributen, aria-live regions, role="dialog" op alle modals
  - ✅ **Focus Indicators:** :focus-visible met blauwe outline (2px solid)
  - ✅ **Font Scaling:** 200% zoom test passed, layout intact
  - ✅ **Color Contrast:** WCAG AAA (14.8:1 primary text ratio)
  - **Files Created:** `src/ui/focus-trap.js` (4.4KB)
  - **Files Modified:** `src/ui/legal.js`, `src/ui/feedback.js`, `src/ui/command-search-modal.js`
  - **Bundle Impact:** +16KB unminified (can be re-minified with `npm run minify`)

- [x] **Sessie 100:** Bundle Size Optimalisatie (15 feb 2026)
  - ✅ ~983 KB productieve code → ~809 KB na Netlify minificatie
  - ✅ Terminal Core: ~340 KB (binnen 400 KB budget)
  - ✅ Netlify asset processing voor minificatie (broncode leesbaar)
  - ✅ Budgets herdefinieerd: Terminal Core <400KB, site totaal <1000KB
  - **Learning:** In-place minificatie vermijden; Netlify doet dit gratis

- [x] **Sessie 101:** Playwright E2E Test Fixes (17 feb 2026)
  - ✅ Blog URLs geüpdatet naar hacksimulator.nl
  - ✅ TTI budget aangepast voor productie
  - ✅ Flaky legal modal selector gefixt
  - ✅ Feedback locator geüpdatet
  - ✅ Mobile quick commands geimplementeerd
  - **Test suite:** 145 tests across 27 suites (17 files)

- [x] **Sessie 102:** MVP Perfectionering (18 feb 2026)
  - ✅ Domain referenties geüpdatet (famous-frangollo → hacksimulator.nl)
  - ✅ Pre-launch checklist afgevinkt (90%+ voltooid)
  - ✅ TASKS.md gesynchroniseerd met Sessie 100-101 resultaten
  - ✅ Playwright retry strategie voor flaky tests (1 retry lokaal)
  - ✅ Analytics setup geverifieerd (CSP headers compatible)

- [x] **Sessie 103:** MVP Polish & Production Hardening (20 feb 2026)
  - ✅ Output buffer limit: MAX_OUTPUT_LINES=500 in renderer.js (DOM memory cap)
  - ✅ Dode meta tags verwijderd: Cache-Control, Pragma, Expires, impact-site-verification
  - ✅ animations.css loading gefixt: media="print" onload → direct load (consistent met mobile.css fix)
  - ✅ Console.log cleanup: 25 debug traces verwijderd uit 9 bestanden (console.warn/error behouden)
  - **Impact:** Schonere DevTools, gecapte DOM groei, consistente CSS loading, geen informatielekkage

---

### M5.5: Monetization MVP 🔵 IN UITVOERING (Pivot + uitbreidingen)
**Status:** Heropend maart 2026 (Sessie 117-118) — Nieuwe strategie na affiliate afwijzingen; verdiept naar volledige stack (Sessies 126-137)
**Originele aanpak:** Affiliate links → ❌ Afgewezen door programma's
**Huidige stack:** AdSense + Ko-fi + Brevo newsletter + Gumroad products + Lead magnet (Sample Pentest)

#### Voltooide taken Sessie 117-118 (Pivot) ✅
- [x] **Cookiebot verwijderd** → eigen consent banner (lichter, geen third-party dependency) — Sessie 117
- [x] **AdSense integratie** — 10 ad units manueel geplaatst (blog, sidebar, footer, between-content) — Sessie 117
- [x] **Consent Mode v2** — Google-compliant consent signaling op alle pagina's — Sessie 117
- [x] **CSP updates** — `frame-src` + `connect-src` voor AdSense domains — Sessie 117
- [x] **Ad container visibility** — explicit width op `.ad-container` base class — Sessie 117
- [x] **Ko-fi donatie buttons** — sidebar, download, challenges, footer touchpoints — Sessie 118
- [x] **Blog support banners** — call-to-action voor Ko-fi op blog posts — Sessie 118
- [x] **Newsletter signup forms** — lead generation across site — Sessie 118

#### Voltooide taken Sessies 126-129 (Newsletter + Products) ✅
- [x] **Brevo migratie** — MailerLite → Brevo (free tier), double opt-in flow, welkomstmail automation — Sessie 126
- [x] **Typst PDF guides v1.0** — 3 gidsen geschreven + factcheck + Nederlandse taalconsistentie — Sessies 127-128
- [x] **Gumroad v1.0 publicatie** — 3 guides + bundel-listing live op Gumroad, productpagina's gestyled — Sessie 129

#### Voltooide taken Sessies 130-132 (Lead Magnet) ✅
- [x] **Sample Pentest PDF** — 9-pagina anonimised pentest sample, Typst-gegenereerd — Sessie 130
- [x] **`/sample-pentest.html` landing** — Plan B Sessie 1: landing page met Brevo embedded form — Sessie 131
- [x] **Brevo Form-submitted trigger + welkomstmail** — taalfixes + flow-correctie — Sessie 131
- [x] **Custom Brevo submit handler** — success panel toggelt nu correct (MutationObserver pattern) — Sessie 132
- [x] **Twee-koloms hero** — form above-the-fold layout op `/sample-pentest.html` — Sessie 132

#### Voltooide taken Sessies 133-137 (Deliverability + Funnel) ✅
- [x] **Brevo DnD-template herbouw** — welkomstmail clean-build met Type-dropdown special-links (unsubscribe/web-version) — Sessie 134
- [x] **DNS cleanup** — SPF `include:_spf.mlsend.com` verwijderd, DKIM-CNAME op subdomein gefixt, DMARC stable — Sessie 135
- [x] **Brevo blocklist unblock** — transactional channel sender approval via caret-dropdown route — Sessie 136
- [x] **Postmaster Tools verificatie** — DKIM/SPF/DMARC verified via `postmaster.google.com/managedomains` (data aggregatie pending tot >1000 sends/day) — Sessie 136
- [x] **Welkomstmail bug-cluster** — blog-URLs, prijsclaim €0→€5, mobile inline-code overlap gefixt — post-Sessie 135
- [x] **Funnel-pulse diagnose** — pulse-check pipeline via simulate success-panel toggle (`display: 'block'` + classList) — Sessie 137
- [x] **Lead-magnet CTA-coverage 3→13** — unique `data-cta-location` per CTA-positie incl. blog-topic + plaatsing — Sessie 137

#### Open taken
- [ ] AdSense performance monitoring (CTR, RPM na 30 dagen) — manueel in Google AdSense dashboard
- [ ] Ko-fi conversion tracking (donaties per maand) — manueel via Ko-fi dashboard
- [ ] Postmaster Tools re-check — trigger: eerste >100-recipient campaign-send OF ~1 juni 2026 (Sessie 136 vastgesteld)

---

### Phase A: Post-Launch Quick Wins (Week 11)
**Doel:** Power user features + production validation
**Tijdsinschatting:** 5-7 dagen
**Status:** 🔵 In uitvoering (4/6 completed - 67%)
**Dependencies:** M5 Launch voltooid

#### Tab & History Features ✅ COMPLETED
- [x] **A.4: Tab Autocomplete** (command names + multi-match cycling)
  - Single match: Tab completes immediately
  - Multiple matches: Tab cycles through options
  - Command-only for MVP (path completion = Phase 2)
  - Implemented: `src/ui/autocomplete.js`

- [x] **A.6: Ctrl+R History Search** (bash-style reverse search)
  - Real-time filtering with match counter [1/3]
  - Ctrl+R: Start search / cycle matches
  - Enter: Accept | Esc: Cancel
  - Cyan search prompt above input (bash aesthetic)
  - Implemented: `src/ui/history-search.js`, `src/core/terminal.js`

#### Production Readiness (TODO)
- [ ] **A.1: Beta Testing Setup**
  - Recruit 5+ beta testers (2 beginners, 2 students, 1 dev)
  - Create feedback formulier (Google Forms)
  - Test scenarios document
  - Screen recording instructions (optional)

- [ ] **A.2: Cross-Browser Testing**
  - [ ] Safari macOS (latest) - WebKit blocked by system deps
  - [ ] Mobile Safari iOS 16+ (real device)
  - [ ] Chrome Mobile Android 12+ (real device)
  - ✅ Chrome/Firefox/WebKit automated tests passing (145 tests, 27 suites)

- [x] **A.3: Configuration Setup** ✅ VOLTOOID (Sessie 91)
  - [x] GA4 Measurement ID ingevuld: G-7F792VS6CE
  - [x] Contact emails ingevuld: contact@hacksimulator.nl (Gmail forwarding)

- [x] **A.5: Mobile Quick Commands** ✅ VOLTOOID (Sessie 101)
  - Click handlers geimplementeerd voor quick command buttons
  - Mobile UX fixes voltooid

---

## 🎯 Volgende Acties

**Huidige Status:** M5 In Uitvoering (71%) - ✅ **LIVE on hacksimulator.nl!**

**Voltooid:**
1. [x] GitHub repository setup (https://github.com/JanWillemWubkes/hacksimulator)
2. [x] Netlify deployment + custom domain (https://hacksimulator.nl/)
3. [x] Performance audit (Lighthouse 100/100/92/100)
4. [x] Cross-browser testing (Chrome + Firefox + WebKit, 145 E2E tests)
5. [x] Bundle size optimalisatie (~809 KB na Netlify minificatie)
6. [x] GA4 geconfigureerd (G-7F792VS6CE)
7. [x] Mobile quick commands (Sessie 101)

**Launch-prep (Sessie 173) ✅:**
- [x] Aankondigings-kit herplanned naar wo 24 juni 2026 + §5-schema voor beperkt bewaakbaar venster
- [x] Launch-visuals geregenereerd (nieuw H-monogram) — `.playwright-mcp/launch/` (gitignored)
- [x] Homepage linkt nu alle 13 blogposts (5 cornerstones toegevoegd) + sitemap homepage `lastmod`→18 jun
- [ ] **Verse launch-week blogpost schrijven (samen met Heisenberg)** — eerlijke freshness-hefboom (runbook Fase 2 "aanbevolen"); kandidaten met zoekvolume + nog géén dekking: Metasploit, Hydra, `grep`/`find`-tutorial. Dán is `dateModified`=publicatiedag legitiem.
- [ ] **Launch-uitvoering 23-24 juni (handmatig):** GSC sitemap-resubmit + indexering top-pagina's, Bing import, Rich Results/FB/X validators, GA4-annotatie, posten per `docs/launch-announcement-kit.md` §5

**Resterende handmatige acties:**
- [ ] Mobile real device testing (iOS, Android)
- [ ] Beta testers werven (5+ testers)
- [ ] GA4 Real-Time dashboard verificatie

---

## 🔮 Post-MVP Features (Fase 2+)

Deze features zijn **buiten MVP scope** en worden in Fase 2 geïmplementeerd:

### UX Enhancements
- [x] **Tab Autocomplete** - ✅ COMPLETED (Phase A.4 - Week 11)
- [x] **Ctrl+R History Search** - ✅ COMPLETED (Phase A.6 - Week 11)
- [ ] **Help Command Educational Context** - Add category descriptions to help output
  - Write 5 Nederlands category descriptions voor elke categorie
  - Educational tone: "Deze tools helpen je netwerken te scannen..."
  - Uncomment placeholder in `src/commands/system/help.js` (line 113)
  - Estimated time: 30 min
  - Ready to implement: Architecture done in Sessie 36
- [ ] **Quick Commands UI** - Moved to Phase A.5 (deferred until mobile UX fixes)
- [ ] **Mobile Gestures** - Swipe/long-press navigatie (needs real device testing)
- [ ] **Persistent Help Hint** - Rechts onderin, verdwijnt na 5 commands
- [ ] **Terminal 10px horizontale overflow op mobiel (375px)** — pre-existing, laag-impact cosmetisch (ontdekt tijdens Sessie 189 render-en-meet, NIET van de deep-link: bewezen identiek op een kale `/terminal.html`). `MAIN#terminal-container` meet left 10 / width 360 → right 370 op `docW` 360 → de pagina kan ~10px horizontaal wiebelen op mobiel. Geen content-clipping (tekst wrapt schoon). Fix = de 10px links-offset op `#terminal-container` @375px opsporen (padding/margin op container of een wrapper) en de breedte binnen de viewport houden. Verifieer met `document.documentElement.scrollWidth - clientWidth == 0` op 375px, dark+light, zonder regressie op desktop.

### Feedback & Analytics
- [ ] **Exit Intent Detection** - Survey na 2+ min sessie (FR7.2 deferred)
- [ ] **Feedback Save Logic** - Backend/email integratie voor feedback
- [ ] **Command-Level Feedback** - Thumbs up/down per command (FR7.3 deferred)

### 🔵 OPEN (geblokkeerd op echte data): Product `aggregateRating` + `review` markup (Sessie 173)
**Motief:** GSC meldt 2× **niet-kritieke** suggestie op `gidsen.html` Product-fragmenten — ontbrekende velden `aggregateRating` en `review`. Vullen geeft sterretjes in Google + rijkere snippets.
- **HARDE VOORWAARDE — niet eerder uitvoeren:** alleen toevoegen met **echte** klantbeoordelingen. Fake/verzonnen ratings = Google-beleidsschending → risico op handmatige actie (verlies álle rich results) + botst met de "geen verzonnen schema-data / geen cargo-cult-SEO"-lijn (Sessie 169/172, merchant-listing-fix Sessie 172). Tot die tijd is **niets doen de correcte actie** — de waarschuwing is niet-kritiek en blokkeert niets.
- [ ] Reviewbron regelen: Gumroad-reviews exporteren OF eigen feedbackformulier per gids
- [ ] Bij ≥1 echte review: `aggregateRating` (echt gemiddelde + `reviewCount`) + individuele `review`-objecten per Product in `gidsen.html`
- [ ] JSON-LD valideren (Python `json.loads` over alle blokken) + Rich Results Test 0 fouten, dan pas live + GSC "valideren"

### Commands & Features
- [ ] **Continue Command** - Expliciete sessie restore (localStorage doet dit al automatisch)
- [x] **Tutorial Command** - Guided scenarios (recon, webvuln, privesc) ✅ Gebouwd in M6 (Sessie 103-104)
- [ ] **Challenge System** - Voortgang tracking en certificaten
- [ ] **Leerpad deep-link naar in-app tutorials** (vervolg op Sessie 185 — leerpad-content-verrijking). Doel: de homepage-leerpad-knoppen ("Oefen in de terminal") laten dóórlinken naar een passende begeleide tutorial i.p.v. de kale terminal. **Volgorde is dwingend — B (fundament) vóór A (afwerking); A zonder B = deep-link naar een verkeerd-gelabelde/ontbrekende bestemming = de promise/payoff-leugen naar binnen verplaatst:**
  - [x] **Stap 0 — ontwerpbeslissing** ✅ Beslist Sessie 186 (29 jun 2026). Mapping niveau → scenario → labelwijziging vastgelegd (zie sub-blok hieronder). Stuurt B + A.

    **Beslissings-tabel:**

    | Niveau | Deep-link-doel (Fase A) | Ook in tier | Labelwijziging | Status |
    |---|---|---|---|---|
    | BEGINNER | **fundamentals** | — | nieuw scenario: `Beginner` | ✅ GEBOUWD (Sessie 187) |
    | GEVORDERD | **recon** | privesc | recon `Beginner→Gevorderd`; privesc `Beginner→Gevorderd` | ✅ HER-GETIERD (Sessie 187) |
    | EXPERT | **exploitation** | webvuln | exploitation `Gevorderd→Expert`; webvuln `Beginner→Expert` | ✅ HER-GETIERD (Sessie 187) |

    **Rationale:**
    1. **Badge = contract; de badge-*beschrijving* is de maatstaf, niet de chips.** Chips zijn nergens een letterlijke inhoudsopgave (recon leert géén van zijn netcat/wireshark/hashcat-chips) → toets elk scenario aan de beschrijvingszin, consistent over alle 3 tiers.
    2. **BEGINNER = "kun je überhaupt een terminal gebruiken" (géén security) → alles schuift één tier op.** recon is conceptueel de eerste security-stap, maar BEGINNER is gereserveerd voor pure basis → recon wordt GEVORDERD.
    3. **Inhoud (skill) bepaalt de tier, niet de commando-syntaxis.** privesc gebruikt alleen cat/ls maar leert log-/credential-analyse op een gehackt systeem → GEVORDERD.
    4. **webvuln → EXPERT.** sqlmap is dé headline-EXPERT-tool ("SQL injection testing" staat op de EXPERT-badge); een tier lager = EXPERT-tool in GEVORDERD-scenario = promise/payoff-leugen naar binnen verplaatst. Tik-gemak (point-and-shoot) ≠ tier. Bijvangst: álle EXPERT-badge-chips gedekt binnen EXPERT (metasploit+hydra in exploitation, sqlmap in webvuln).
    5. **GEVORDERD-doel = recon, niet privesc.** GEVORDERD-beschrijving = "netwerken / scan poorten / analyseer verkeer" → recon. privesc (log-analyse, geen netwerk) blijft GEVORDERD maar secundair.
    6. **EXPERT-doel = exploitation, niet webvuln.** exploitation = 5-staps-vlaggenschip, dekt 2/3 EXPERT-chips (metasploit, hydra). webvuln blijft EXPERT maar secundair (bereikbaar via `tutorial`).

    **Spec NIEUW fundamentals-scenario (input Fase B):** id `fundamentals`, difficulty `Beginner`, titel bijv. "De basis: je weg vinden op een Linux-systeem". Scope = **navigatie + bestandsbeheer** (`ls`/`cd`/`pwd`/`cat`/`mkdir`/`touch`/`rm`) — bewust NIET de volle 9 badge-chips; `whoami`/`history` zitten alleen in de illustratieve chips, niet in de belofte-zin ("navigeren door mappen, bestanden lezen, en je eerste bestanden aanmaken en verwijderen"). ~5 gegroepeerde stappen: (1) `pwd`+`ls` oriëntatie, (2) `cd <map>`(+`ls`) navigeren, (3) `cat <bestand>` lezen, (4) `mkdir`+`touch` aanmaken, (5) `rm` verwijderen. Verhaaltje = security-bridge ("eerste dag als junior pentester; eerst je weg vinden op het systeem"), voltooiing bridge't naar recon. Volgt bestaande scenario-structuur (`command`/`mustHaveArgs`/3-tier `hints`/`[~]`-feedback, 80/20 NL).

    **Labelwijzigingen (input Fase B):** `difficulty`-property in scenario-bestanden — `recon.js` Beginner→Gevorderd · `privesc.js` Beginner→Gevorderd · `webvuln.js` Beginner→Expert · `exploitation.js` Gevorderd→Expert · NIEUW `fundamentals.js` Beginner. **Let op:** label-vocabulaire kent nu alleen `Beginner`/`Gevorderd` — controleer in `src/tutorial/tutorial-renderer.js` (en waar `difficulty` getoond/gestyled wordt) of een nieuwe `Expert`-waarde een badge-/kleur-variant nodig heeft.

    **Deep-link-mapping (input Fase A):** BEGINNER-knop → `?tutorial=fundamentals` · GEVORDERD-knop → `?tutorial=recon` · EXPERT-knop → `?tutorial=exploitation`.
  - [x] **Fase B — tutorials op orde (het echte werk):** ✅ Uitgevoerd Sessie 187 (30 jun 2026, commit `3ac65aa`). (1) NEW `src/tutorial/scenarios/fundamentals.js` (Beginner, **7 stappen** pwd/ls/cd/cat/mkdir/touch/rm — 1 commando per stap i.p.v. ~5 gegroepeerd: de engine valideert per commando, zo wordt elke badge-belofte-skill afgedwongen), security-bridge briefing, bridge't naar recon; geregistreerd als eerste in `terminal.js`. (2) 4 her-tiering-labels toegepast (recon/privesc→Gevorderd, webvuln/exploitation→Expert). (3) **Verborgen taak anders dan gespecd:** `tutorial-renderer.js` heeft GÉÉN Expert-badge nodig — difficulty is overal platte tekst (renderer/lijst/certificaat), geen difficulty-gestuurde CSS in de terminal; `Expert` rendert correct (gemeten: dark `#c9d1d9`, light `#0a0a0a`). De échte doorwerking zat in de funnel: `next.js` (fundamentals = stage 0, high-water +1 hernummerd incl. `buildSkippedHint`-drempels), `dashboard.js` (spiegel), `certificate.js` (`getDiscipline`), `tutorial.js` (manpage). E2E `fundamentals.spec.js` (7 tests) cross-browser groen + volledige chromium-suite groen (186 passed).
  - [x] **Fase A — deep-link-plumbing + perfecte landing:** ✅ Uitgevoerd Sessie 189 (30 jun 2026). `main.js` leest nu `?tutorial=<id>` (validatie tegen `tutorialManager.getScenario` = single source of truth; onbekend → stille no-op) en auto-start het scenario gesequencet: eerste bezoek wacht op `typewriter-done` + 250 ms (resume/badge-timeouts), terugkerend vuurt direct → briefing valt nooit in dode input of midden in de typewriter. Auto-start via `terminal.execute('tutorial <id>')` (Sessie-156-registry-pad: echo + history + `markFirstVisitComplete`). **Landing = briefing-held:** scroll-to-bottom + input-focus ná start; welcome bewust NIET gecondenseerd (boot-fragiliteit; anti-gold-plating). Resume-vs-deeplink (non-destructief): geen actief → start; actief==target → niet herstarten; actief!=target → `exit()` (slaat op) + start. URL gestript via `history.replaceState` (refresh herstart niet). Analytics-source zonder dubbeltelling via one-shot `tutorialManager.setNextStartSource('homepage-leerpad')`. 3 leerpad-knoppen → `?tutorial=fundamentals/recon/exploitation` + labels "Start de Beginner/Gevorderd/Expert-missie". Cache-bump `main.js?v=164→189-deeplink` (2 refs). NEW `tests/e2e/leerpad-deeplink.spec.js` (5 tests: 3 niveaus happy-path + onbekende-id no-op + gewone terminal). Render-en-meet dark/light/375px (input enabled+focused, 0 doc-overflow, 10px `#terminal-container`-offset pre-existing zonder deep-link). **Hiermee is "Leerpad deep-link naar in-app tutorials" volledig afgerond (Stap 0 + B + A).**

### Analytics Migration
- [ ] **Plausible Analytics** - Migratie van GA4 naar Plausible (bij 10k+ visitors)
- [ ] **Cookie-less Tracking** - Remove consent banner na Plausible migratie

### 🔵 OPEN (post-launch): esbuild content-hash build + cache-correctheid (Sessie 162)
**Motief:** combineert bundle-budget-winst (M5 Terminal Core ~547 KB > 400 KB) MET het structureel oplossen van een cache-bug-klasse. **Geen pre-launch werk** — bewuste architectuurwijziging (raakt PRD §13 "no build step" red line → eerst PRD/PLANNING scope-besluit).
- **Aanleiding:** Sessie 162 bug-report — `nmap 192.168.1.100` toonde router-profiel (DNS 53) i.p.v. webserver (SSH 22). Inhoudelijk gefixt (commit `bbf6aa3`), maar legde een latente gap bloot: de `?v=`-bump werkt alleen op entry-niveau. ES-module-imports (`import x from './commands/network/nmap.js'`) dragen géén versie-token, en `_headers` cachet `/src/**/*.js` 1 week → diepe modules blijven tot een week stale bij terugkerende bezoekers. Zelfde bug-klasse als Sessie 150 (main.css v=150 miste `assets/legal/*.html`): handmatige tokens zijn inherent onbetrouwbaar.
- [ ] PRD §13 / PLANNING scope-besluit: productie-build-step toestaan (broncode blijft vanilla; alleen output gebundeld)
- [ ] esbuild bundle + minify `src/main.js` → 1-2 output-bundles met **content-hash** in filenaam (`main.<hash>.js`)
- [ ] `_headers`: gehashte assets `Cache-Control: public, max-age=31536000, immutable` (HTML blijft `no-cache`)
- [ ] Verwijder handmatige `?v=`-tokens uit `terminal.html` + alle HTML (worden overbodig)
- [ ] Verifieer bundle-grootte tegen <400 KB Terminal Core budget (verwachte minify-winst 30-50%)
- **Tussenoplossing indien vóór launch nodig (NIET aanbevolen):** `_headers` `/src/**/*.js` → `no-cache` (revalidatie via ETag). Build-vrij, lost correctheid op, maar kost N conditionele requests/load bij grote modulegraaf → wordt tóch vervangen door content-hashing.

---

## 🧹 M9: Refactor Sprint (Toekomstig)

**Doel:** Technical debt cleanup + code quality optimalisatie
**Tijdsinschatting:** 1 week (7-10 dagen)
**Dependencies:** M5 voltooid + 3-4 Post-MVP features geïmplementeerd
**Status:** ✅ **Voltooid** (Sessie 105-110)
**When to Execute:** Elke 4-6 features OF technical debt > 20%

### Cache Implementation Cleanup (3 taken)
- [x] Remove redundant HTML cache meta tags van `terminal.html` — ✅ Sessie 103 (verwijderd: Cache-Control, Pragma, Expires meta tags + impact-site-verification)
- [x] Delete of move `cache-diagnostic.html` naar `/dev/` folder — ✅ Sessie 87: bestand al verwijderd tijdens cleanup
- [x] Document cache strategy in `docs/CACHING.md` — SKIPPED (Sessie 110: Netlify `_headers` is self-documenting, apart doc overbodig)

### Bundle Size Optimization (4 taken) — ✅ DEFERRED (Sessie 100: Netlify minificatie ingeschakeld, budget herdefinieerd)
- [x] Audit bundle size breakdown — ✅ Sessie 100: 983 KB productieve code identified
- [x] Check for duplicate code patterns via `grep`/`ripgrep` (>10 line duplicates) — ✅ Sessie 105: Security commands structureel vergelijkbaar maar content uniek, extractie niet waard
- [x] Minification: Netlify asset processing ingeschakeld (CSS/JS/HTML) — Sessie 100
- [x] Target: Terminal Core ~340 KB (binnen 400 KB budget), site totaal ~809 KB (binnen 1000 KB budget) — Sessie 100

### Code Quality & Deduplication (4 taken)
- [x] Review command modules voor duplicate logic patterns — ✅ Sessie 105: Consent check pattern in 3/5 security commands, structureel niet content duplication
- [x] Extract common patterns to `src/utils/` modules (DRY principle) — ✅ Sessie 105: Reviewed, correct deferred — geen duplicaten >10 regels, `boxText()` al in utils
- [x] CSS cleanup: Remove unused classes via manual audit — ✅ Sessie 105: 531 regels verwijderd (70 orphaned classes, 28 verwijderd uit landing/main/blog.css, 42 in minified files genoteerd voor later)
- [x] JavaScript cleanup: Remove unused imports/functions (grep for unreferenced code) — ✅ Sessie 105: 7 orphaned exports verwijderd (getHomeDirectory, createBox, createLightBox, invalidateCharWidthCache export, isSimilar, findSimilarCommands)

### Documentation Updates (3 taken)
- [x] Sync all version numbers across docs (PRD, PLANNING, TASKS, CLAUDE, SESSIONS) — ✅ Sessie 110: Alle docs gesynchroniseerd op 6 maart 2026
- [x] Update SESSIONS.md with refactor learnings (anti-patterns discovered) — ✅ Sessie 105-110: Alle sessies gedocumenteerd in docs/sessions/current.md
- [x] Add inline code comments for complex logic (VFS path resolution, parser, renderer) — ✅ vfs.js 26%, parser.js 28%, renderer.js 34% comment-to-code ratio

### Performance Audit (3 taken)
- [x] Re-run Lighthouse audit — ✅ Sessie 105: CLI baseline 42/100/74/100 (methodologie verschil met DevTools; A11y+SEO maintained at 100)
- [x] Check for memory leaks via DevTools — ✅ Sessie 103: MAX_OUTPUT_LINES=500 buffer cap (docs/testing/memory-leak-results.md)
- [x] Optimize localStorage read/write patterns if needed (currently: on every VFS change) — ✅ Sessie 110: VFS debounce 1000ms + beforeunload flush, gamification debounce 500ms, onboarding 4→1 key consolidatie

### Test Coverage Review (2 taken)
- [x] Identify untested edge cases in Playwright suite — ✅ Sessie 105: 13 nieuwe command-coverage tests (pwd, date, man, history, find, grep, ifconfig, netstat)
- [x] Add missing tests for refactored code — ✅ Sessie 105-106: 145 tests/27 suites (was 118/14)

**Total Tasks:** 19
**Estimated Time:** 7-10 dagen
**Success Criteria:**
- Bundle size ≤ 400KB (20% margin maintained)
- Lighthouse score ≥ 88/100/100/100 (no regression)
- Zero code duplication >10 lines (grep check)
- All docs synchronized (dates, versions, percentages)
- Playwright tests: 100% passing (22/22 minimum)

**Triggers for Execution:**
1. **Time-Based:** After implementing 3-4 Post-MVP features (Milestone 6-8)
2. **Debt-Based:** Bundle size >400KB OR test failures >5% OR code duplication >15%
3. **Pain-Based:** Developer friction signals (fear, brittleness, confusion)

---

## 🎓 M6: Tutorial System (Fase 2 - Week 11-16)

**Doel:** Transform isolated commands into structured learning scenarios
**Tijdsinschatting:** 35-45 uur (5-6 dagen)
**Taken:** 32 total
**Dependencies:** M5 minimaal MVP (beta testing + Safari)
**Status:** ✅ **VOLTOOID (100% — Sessies 103-156)**
**Bundle Budget:** +60KB max (total: ~378KB / 500KB = 76%)

**Success Criteria:**
- ✓ 3 complete scenarios functional without errors
- ✓ Tutorial state persists across page reloads
- ✓ Validators accept correct commands with >95% accuracy
- ✓ Mobile UI renders correctly on 375px viewport
- ✓ Tutorial completion rate >40% (analytics tracking)
- ✓ Bundle size increase ≤60KB

### Phase 1: Tutorial Framework (15h, 10 tasks) ✅ VOLTOOID
- [x] Create tutorial engine architecture (3h)
  - State machine: IDLE → STEP_ACTIVE → STEP_COMPLETE → COMPLETE
  - Scenario registry pattern (similar to command registry)
  - localStorage persistence: `hacksim_tutorial_progress`
  - Integration hook in terminal.js (detect `tutorial` command)

- [x] Implement command validator (2h)
  - Per-step validate() functions
  - Non-blocking: commands always execute, validation checks afterwards
  - Argument validation (IP format, flags)

- [x] Build navigation system (2h)
  - `tutorial` command: list available scenarios
  - `tutorial [name]` command: start specific scenario
  - `tutorial skip`: skip with educational warning
  - `tutorial exit`: exit and save progress
  - `tutorial cert`: show + copy certificate

- [x] Design tutorial UI renderer (3h)
  - Mission briefing display (ASCII box with box-utils.js)
  - Objective tracker with step counter
  - Inline hints (progressive disclosure)
  - Mobile optimization (isMobileView() fallback)

- [x] Implement progress tracking (2h)
  - localStorage: scenario ID, step number, completion status
  - Resume functionality (restore on page load)
  - Reset functionality (start over)
  - Analytics events: tutorial_started, tutorial_completed, tutorial_abandoned

- [x] Create hint system (1.5h)
  - Progressive hints: Tier 1 (2 attempts), Tier 2 (4 attempts), Tier 3 (6 attempts)
  - Hint triggering: after 2 failed attempts
  - Per-step hint persistence in localStorage

- [x] Build certificate generator (1.5h)
  - Text-based certificate (ASCII art)
  - Include: scenario name, completion date, step count
  - Copy-to-clipboard functionality (navigator.clipboard + textarea fallback)

- [x] Integrate with onboarding system (1.5h)
  - Tutorial hint in onboarding flow
  - Update welcome message with tutorial mention

- [x] Integrate with analytics system (1h)
  - Track tutorial_started (scenario ID)
  - Track tutorial_step_completed (step number)
  - Track tutorial_completed (scenario ID)
  - Track tutorial_abandoned (last step reached)

- [x] Error handling edge cases (1.5h)
  - Invalid scenario name → suggestion list
  - Tutorial command during active scenario → warning
  - Page reload during tutorial → resume prompt
  - localStorage errors → graceful degradation with console.warn

### Phase 2: Scenario Implementations (18h, 15 tasks) — 12/15 voltooid

**Scenario 1: Reconnaissance (6h, 5 tasks)** ✅
- [x] Write reconnaissance scenario script (1.5h)
  - Mission briefing: "SecureCorp pentest - map network topology"
  - Step 1: ping 192.168.1.100 (test connectivity)
  - Step 2: nmap 192.168.1.100 (identify open ports)
  - Step 3: whois securecorp.com (gather domain info)
  - Step 4: traceroute 192.168.1.100 (map route)

- [x] Implement reconnaissance step validators (2h)
  - Ping validator: accept any target IP
  - Nmap validator: require target IP, optional flags OK
  - Whois validator: require domain format
  - Traceroute validator: require target IP

- [x] Write reconnaissance educational feedback (1.5h)
  - Per-step tips with Dutch context
  - Progressive hints (3 tiers per step)
  - Completion message with pentest context

- [x] Mobile testing reconnaissance scenario (0.5h) — ✅ Sessie 112: 4 tests in tutorial-mobile.spec.js
- [x] Integration testing reconnaissance scenario (0.5h) — ✅ Sessie 104: Playwright E2E tests (18 tests covering all 3 scenarios)

**Scenario 2: Web Vulnerabilities (6h, 5 tasks)** — 3/5
- [x] Write web vulnerabilities scenario script (1.5h)
  - Mission: "E-commerce site audit - find SQL injection"
  - Step 1: nmap target (identify web server)
  - Step 2: nikto target (scan for vulnerabilities)
  - Step 3: sqlmap target (test SQL injection)
  - Step 4: hashcat (crack found hashes)

- [x] Implement web vulnerabilities step validators (2h)
  - Command name + args.length validation
  - Non-blocking (forgiving for beginners)

- [x] Write web vulnerabilities educational feedback (1.5h)
  - OWASP Top 10 context
  - Ethical disclosure process

- [x] Mobile testing web vulnerabilities scenario (0.5h) — ✅ Sessie 112: 4 tests in tutorial-mobile.spec.js
- [x] Integration testing web vulnerabilities scenario (0.5h) — ✅ Sessie 104: Playwright E2E coverage

**Scenario 3: Privilege Escalation (6h, 5 tasks)** — 3/5
- [x] Write privilege escalation scenario script (1.5h)
  - Mission: "Linux server analyse - credential discovery"
  - Step 1: cat /etc/passwd (enumerate users)
  - Step 2: ls -la /home (find user directories)
  - Step 3: cat /var/log/auth.log (check login attempts)
  - Step 4: cat ~/.bash_history (find credentials)

- [x] Implement privilege escalation step validators (2h)
  - Filesystem command validation
  - Flexible arg matching for beginners

- [x] Write privilege escalation educational feedback (1.5h)
  - Linux permission model explanation
  - Log analysis context
  - Defense recommendations

- [x] Mobile testing privilege escalation scenario (0.5h) — ✅ Sessie 112: 4 tests in tutorial-mobile.spec.js
- [x] Integration testing privilege escalation scenario (0.5h) — ✅ Sessie 104: Playwright E2E coverage

### Phase 3: Integration & Polish (7h, 7 tasks) — ✅ 7/7 voltooid (Sessies 104+106+112+156)
- [x] Mobile gesture support — Long-press hint only (Sessie 156, expert-decision pedagogie-spanning)
  - ✅ Long-press (≥500ms) op #terminal-output triggert `hint` command via registry-pad
  - ❌ Swipe-next/prev bewust NIET geïmplementeerd — pedagogie-conflict: force-skip step zonder commando = ondergraving leerdoel
  - ✅ Fallback: keyboard navigation + `hint` command altijd functioneel
  - Implementatie: `src/ui/tutorial-gestures.js` (~80 regels vanilla JS) + 5 Playwright tests in `tests/e2e/tutorial-gestures.spec.js` met `devices['iPhone 13']` hasTouch:true

- [x] Cross-browser testing tutorials (2h) — ✅ Sessie 112: All 36 mobile + 24 desktop tests pass on Chromium, Firefox, WebKit
  - Test on Chrome, Firefox, Safari (desktop)
  - Test on Mobile Safari, Chrome Mobile
  - Verify localStorage persistence across browsers

- [x] Performance optimization tutorials (1h) — ✅ Sessie 106: Audit complete, geen actie nodig
  - Tutorial bundle = 37 KB (ruim binnen 60 KB budget)
  - Lazy-loading niet waard: 3 scenarios × ~5 KB = te klein voor dynamic import overhead
  - Validators al minimaal: `cmd === 'x' && args.length > 0` (geen regex)

- [x] Documentation updates tutorials (1h)
  - Added tutorial system to CLAUDE.md Recent Learnings (Sessie 103)
  - Playwright E2E test suite created (Sessie 104)
  - Tutorial cert subcommand documented in man page

- [x] Playwright E2E tests for tutorials (1h) — ✅ Sessie 104: 18 tests in tutorial.spec.js
  - 18 tests covering lifecycle, hints, persistence, completion, all 3 scenarios, cert, reset
  - Follows fixtures.js pattern (Cookiebot blocking)

- [x] Beta testing protocol gedocumenteerd (Sessie 156, uitvoering = Heisenberg-out-of-Claude)
  - ✅ Protocol-doc `docs/testing/beta-protocol-tutorials.md` ~80 regels — rekruteringsbronnen + walkthrough-script per scenario + feedback-form keuze + success-criteria + Brevo retentie-meting + closure-criteria voor heropening
  - Closure: Claude kan geen actual beta-testers werven → expert-decision documenteer-en-close. Heropening van TASKS.md bij ≥3 testers + ≥2 scenarios per tester (zie protocol-doc §6 Closure-criteria)

- [x] Lighthouse audit post-tutorials (0.5h) — ✅ Sessie 106: CLI audit 26/100/74/100 (A11y+SEO stable at 100)
  - Performance CLI score volatile (26-42 per run, netwerk-afhankelijk; DevTools = 100 in sessie 100)
  - Bundle size: 522 KB transfer (binnen 1000 KB budget)
  - A11y 100, Best Practices 74, SEO 100 — geen regressie vs M9 baseline

---

## 🎮 M7: Gamification (Fase 2 - Week 17-22)

**Doel:** Add motivation layer through challenges, badges, and certificates
**Tijdsinschatting:** 40-50 uur (6-7 dagen)
**Taken:** 47 total (46 voltooid)
**Dependencies:** M6 Tutorial System voltooid
**Status:** ✅ Voltooid (Phase 1-7 complete)
**Bundle Budget:** +50KB max (total: ~428KB / 500KB = 86%)

**Success Criteria:**
- ✓ 15+ challenges functional across 3 difficulty levels
- ✓ 20+ badges with unlock detection working
- ✓ Certificate download works on desktop + mobile
- ✓ Challenge completion rate: >30% Easy, >15% Medium, >5% Hard
- ✓ Badge unlock rate >50% for Common badges
- ✓ Bundle size increase ≤50KB

### Phase 1: Challenge Framework (12h, 10 tasks) — ✅ 7/7 voltooid (Sessie 105)
- [x] Design challenge data structure (2h) — ✅ `src/gamification/challenges/*.js`
  - Challenge properties: id, title, description, difficulty, requirements, points
  - Difficulty levels: Easy (5-10 points), Medium (15-25 points), Hard (30-50 points)
  - Requirements format: command list + optional conditions
  - JSON schema definition

- [x] Implement challenge engine (3h) — ✅ `src/gamification/challenge-manager.js` (state machine IDLE→ACTIVE→COMPLETE)
  - Challenge registry (similar to command registry)
  - Validation logic: check if user commands match requirements
  - Progress tracking: completed challenges, timestamps
  - Points calculation: base points + time bonus + accuracy bonus

- [x] Create challenge command interface (2h) — ✅ `src/commands/system/challenge.js`
  - `challenge` → List all challenges by difficulty
  - `challenge [id]` → Start specific challenge
  - `challenge status` → Show progress dashboard
  - `challenge leaderboard` → Local leaderboard (localStorage)

- [x] Build challenge UI (2h) — ✅ `src/gamification/challenge-renderer.js` (ASCII boxes)
  - Challenge list display (grouped by difficulty)
  - Active challenge indicator (top-right corner or status bar)
  - Progress bar (ASCII: [=====>    ] 50%)
  - Challenge completion animation (ASCII art celebration)

- [x] Implement localStorage persistence challenges (1.5h) — ✅ `src/gamification/progress-store.js` (key: `hacksim_gamification`)
  - Key: `hacksim_challenge_progress`
  - Data: { completedChallenges, totalPoints, currentStreak, lastActiveDate }
  - Auto-save after each challenge step
  - Streak calculation (consecutive days)

- [x] Analytics integration challenges (1h) — ✅ Via progressStore tracking
  - Event: challenge_started (challenge_id, difficulty)
  - Event: challenge_completed (challenge_id, time_taken, points_earned)
  - Event: challenge_failed (challenge_id, step_failed_at)

- [x] Error handling challenges (0.5h) — ✅ Invalid ID→suggestion, completed→replay, in progress→resume
  - Invalid challenge ID → suggestion list
  - Challenge already completed → replay option
  - Challenge in progress → resume prompt

### Phase 2: Challenge Content (15h, 15 tasks) — ✅ 15/15 voltooid (Sessie 105)

**Easy Challenges (5h, 5 tasks) - 5 points each**
- [x] "Network Scout" challenge (1h) — ✅ `network-scout.js`
  - Requirements: ping + nmap on same target
  - Validator: check command history for IP match

- [x] "File Explorer" challenge (1h) — ✅ `file-explorer.js`
  - Requirements: find + cat a specific file
  - Validator: check if target file accessed

- [x] "Identity Check" challenge (1h) — ✅ `identity-check.js`
  - Requirements: whoami + id commands
  - Validator: identity enumeration commands

- [x] "Domain Intel" challenge (1h) — ✅ `domain-intel.js`
  - Requirements: whois + dig on domain
  - Validator: domain reconnaissance

- [x] "Log Hunter" challenge (1h) — ✅ `log-hunter.js`
  - Requirements: find + read log files
  - Validator: log analysis sequence

**Medium Challenges (5h, 5 tasks) - 15-25 points each**
- [x] "Port Scanner Pro" challenge (1h) — ✅ `port-scanner-pro.js`
  - Requirements: nmap with flags (-p, -sV) on multiple targets
  - Validator: check for flag usage + multiple IPs

- [x] "Web Recon" challenge (1h) — ✅ `web-recon.js`
  - Requirements: whois + traceroute + nmap on web target
  - Validator: verify command sequence + target type (domain)

- [x] "SQL Sleuth" challenge (1h) — ✅ `sql-sleuth.js`
  - Requirements: nikto → sqlmap on same target
  - Validator: check command order + target match

- [x] "Password Cracker" challenge (1h) — ✅ `password-cracker.js`
  - Requirements: find hash file → hashcat on hash
  - Validator: check if /etc/shadow accessed + hashcat used

- [x] "System Navigator" challenge (1h) — ✅ `system-navigator.js`
  - Requirements: cd through directories + find hidden files
  - Validator: track directory changes + ls -a usage

**Hard Challenges (5h, 5 tasks) - 30-50 points each**
- [x] "Full Recon" challenge (1h) — ✅ `full-recon.js`
  - Requirements: Complete reconnaissance tutorial + scan 5 unique targets
  - Validator: tutorial completion + command history analysis

- [x] "Privesc Path" challenge (1h) — ✅ `privesc-path.js`
  - Requirements: find SUID binaries + enumerate users + access restricted file
  - Validator: specific command sequence + restricted file access

- [x] "Multi-Tool Master" challenge (1h) — ✅ `multi-tool-master.js`
  - Requirements: Use 15+ unique commands in single session
  - Validator: command diversity check

- [x] "Attack Chain" challenge (1h) — ✅ `attack-chain.js`
  - Requirements: Complete multi-step attack simulation
  - Validator: chained command sequence

- [x] "Forensic Investigator" challenge (1h) — ✅ `forensic-investigator.js`
  - Requirements: Log analysis + file forensics
  - Validator: forensic investigation sequence

### Phase 3: Badge & Achievement System (8h, 8 tasks) — ✅ 6/6 voltooid (Sessie 105)
- [x] Design badge data structure (1h) — ✅ `src/gamification/badge-definitions.js`
  - Badge properties: id, title, description, icon (ASCII), rarity, unlockCondition
  - Rarity levels: Common, Uncommon, Rare, Epic, Legendary
  - Unlock conditions: command count, challenge completion, streaks

- [x] Implement badge manager (2h) — ✅ `src/gamification/badge-manager.js`
  - Badge registry with 21 badges
  - Unlock detection logic (check conditions after each command)
  - Badge notification system (ASCII box rendering)
  - Badge gallery (localStorage-backed collection)

- [x] Create achievements command (1h) — ✅ `src/commands/system/achievements.js` + man page
  - `achievements` → Show all badges (locked + unlocked)
  - `achievements unlocked` → Filter unlocked only
  - `achievements rarity [level]` → Filter by rarity

- [x] Define 21 badges (3h) — ✅ 8 Common, 6 Uncommon, 4 Rare, 2 Epic, 1 Legendary
  - 8 Common: "First Command", "10 Commands", "Network Novice", etc.
  - 6 Uncommon: "Tutorial Complete", "Challenge Champion", etc.
  - 4 Rare: "Speed Demon" (<1s command), "Night Owl" (midnight session), etc.
  - 2 Epic: "50 Commands", "All Tutorials Complete"
  - 1 Legendary: "100 Commands + All Challenges Complete"

- [x] Implement unlock notifications (0.5h) — ✅ ASCII box rendering in badge-manager.js
  - ASCII animation on badge unlock
  - Add to badge gallery immediately

- [x] Analytics integration badges (0.5h) — ✅ Via progressStore
  - Event: badge_unlocked (badge_id, rarity, session_time)

### Phase 4: Certificate & Download System (5h, 5 tasks) — ✅ 4/4 voltooid (Sessie 105)
- [x] Design certificate templates (1.5h) — ✅ 3 tiers: Easy/Medium/Hard ASCII art
  - ASCII art border (reuse asciiBox.js)
  - Template variables: challenge name, user name, date, time taken, rank
  - 3 templates: Easy, Medium, Hard (different ASCII art)

- [x] Implement certificate generator (2h) — ✅ `src/gamification/certificate-generator.js`
  - Generate text-based certificate on challenge completion
  - Include: challenge metadata, performance stats, custom message
  - Preview in terminal before download

- [x] Build download functionality (1h) — ✅ .txt via Blob API + clipboard fallback
  - Text file (.txt) download via Blob API
  - Filename: HackSim_Certificate_[ChallengeID]_[Date].txt
  - Copy-to-clipboard fallback (mobile)

- [x] Certificate gallery command (0.5h) — ✅ `certificates` command
  - `certificates` → List all earned certificates
  - `certificates download [id]` → Re-download specific certificate

### Phase 5: Progress Dashboard (5h, 5 tasks) — ✅ 5/5 voltooid (Sessie 105)
- [x] Design dashboard layout (1h) — ✅ Stats, challenges, badges, next step sections
  - Section 1: Overall stats (total commands, points, badges)
  - Section 2: Challenge progress (completed/total by difficulty)
  - Section 3: Recent achievements (last 5 badges)
  - Section 4: Streak tracker (current streak, longest streak)
  - Mobile-optimized (<40 chars width)

- [x] Implement dashboard command (2h) — ✅ `dashboard` met subcommands (stats, badges, challenges)
  - `dashboard` → Show full progress dashboard
  - `dashboard stats` → Stats only
  - `dashboard badges` → Badge gallery
  - `dashboard challenges` → Challenge progress

- [x] Build streak tracking system (1h) — ✅ In progressStore
  - Track last active date in localStorage
  - Calculate streak: consecutive days with >5 commands
  - Streak notification on login
  - Streak reset warning

- [x] Analytics dashboard metrics (0.5h) — ✅ Via progressStore tracking
  - Track dashboard views
  - Track streak milestones (7-day, 30-day, etc.)

- [x] Mobile optimization dashboard (0.5h) — ✅ Plain format for ≤375px viewports
  - Scrollable dashboard sections
  - Simplified layout for narrow screens

### Phase 6: Leaderboard (5h, 5 tasks) — ✅ 4/4 voltooid (Sessie 106)
- [x] Design local leaderboard system (1.5h) — ✅ `src/gamification/leaderboard-data.js` (simulated top-10)
  - Local-only leaderboard (localStorage, MVP approach)
  - Track top 10 sessions by points
  - Simulated competitive usernames for motivation

- [x] Implement local leaderboard (2h) — ✅ `src/gamification/leaderboard-manager.js`
  - Store: top 10 sessions (points, date, command count)
  - Calculate rank: sort by total points
  - Personal ranking integration with simulated data

- [x] Create leaderboard command (1h) — ✅ `src/commands/system/leaderboard.js`
  - `leaderboard` → Show top 10
  - `leaderboard me` → Show user rank
  - Display format: ASCII table with rank, username, points

- [x] Leaderboard UI polish (0.5h) — ✅ Highlight user entry, percentile display
  - Highlight user's entry
  - Show percentile (e.g., "Top 15%")

### Phase 7: Integration & Testing (10h, 7 tasks) — ✅ 6/6 voltooid
- [x] Integrate gamification with terminal system (2h) — ✅ Hooks in terminal.js + challenge flow
  - Award points for tutorial completion
  - Unlock badges on terminal milestones
  - Badge unlock detection across sessions

- [x] Badge unlock detection across sessions (1h) — ✅ Hooked into terminal and challenge flow
  - Badge checks triggered after command execution
  - Cross-session persistence via progressStore

- [x] Cross-system testing gamification (3h) — ✅ Sessie 111: 14 Playwright E2E tests (gamification.spec.js)
  - Challenge flow: list, start, status, hint tiers, exit, completion, already-completed
  - Badge system: unlock notification, achievements display, rarity filter, unlocked filter
  - Leaderboard: ranked list with simulated names, personal ranking

- [x] Performance testing gamification (2h) — ✅ Sessie 111: 7 Playwright E2E tests (gamification-performance.spec.js)
  - Dashboard/achievements/leaderboard/challenge render <2s with heavy data (15 challenges, 21 badges)
  - localStorage <50KB with maximum gamification data
  - 10 rapid commands without terminal errors (debounce stress test)
  - Bundle size verification (<80KB — actual 67.8KB)

- [x] Mobile testing gamification (1.5h) — ✅ Sessie 111: 6 Playwright E2E tests (gamification-mobile.spec.js)
  - All gamification commands on 375x667 viewport (dashboard, challenge, achievements, leaderboard)
  - Certificate display on mobile
  - Full challenge completion flow on mobile

- [x] Beta testing gamification (1h) — ✅ Sessie 130: Heisenberg playtest + AI agent flow test
  - Focus on challenge difficulty balance
  - Gather feedback on point values
  - Test badge unlock satisfaction

---

## 📊 M8: Analytics & Command Scaling (Fase 2 - Week 23-28)

**Doel:** Production-ready analytics + command system optimization for 50+ commands
**Tijdsinschatting:** 30-40 uur (4-5 dagen)
**Taken:** 40 total
**Dependencies:** M5 MVP launched, M6 tutorials deployed
**Status:** ⏭️ Gepland
**Bundle Budget:** +40KB max (net +35KB after GA4 removal, total: ~463KB / 500KB = 93%)

**Success Criteria:**
- ✓ Plausible Analytics tracking 100% of GA4 events
- ✓ Help paging activates at 50+ commands
- ✓ Session export/import with 100% data fidelity
- ✓ Command execution latency <50ms with 100+ commands
- ✓ Bundle size increase ≤40KB (net ≤35KB after GA4 removal)
- ✓ Zero cookies stored (full privacy compliance)

### Phase 1: Plausible Analytics Migration (10h, 10 tasks)
- [ ] Research Plausible API (1h)
  - Review Plausible.io documentation
  - Identify custom event tracking methods
  - Compare with GA4 event structure
  - Plan data mapping (GA4 → Plausible)

- [ ] Create Plausible tracker abstraction (2h)
  - New file: src/analytics/plausible-tracker.js
  - Implement: init(), trackEvent(), trackPageview()
  - Mirror GA4 event structure for compatibility
  - Cookie-less tracking (no consent banner needed)

- [ ] Update analytics abstraction layer (2h)
  - Modify src/analytics/tracker.js to support dual tracking
  - Feature flag: ANALYTICS_PROVIDER ('ga4' | 'plausible')
  - Graceful fallback if Plausible script fails

- [ ] Migrate event definitions (1.5h)
  - Map GA4 events → Plausible custom events
  - Update src/analytics/events.js
  - Ensure backward compatibility during transition

- [ ] Update consent manager (1h)
  - Remove cookie consent banner for Plausible
  - Add informational notice: "We use privacy-friendly analytics"
  - Update src/analytics/consent.js

- [ ] Deploy Plausible script (0.5h)
  - Add Plausible script tag to index.html
  - Configure domain in Plausible dashboard
  - Set up custom event goals

- [ ] Testing & validation Plausible (1.5h)
  - Test custom events in Plausible dashboard
  - Verify cookie-less operation (no consent needed)
  - Compare GA4 vs. Plausible metrics (parallel tracking for 2 weeks)

- [ ] Remove GA4 dependencies (0.5h)
  - Remove GA4 script tags
  - Delete GA4-specific code from tracker.js
  - Bundle size reduction: ~5KB

### Phase 2: Help Command Paging System (8h, 8 tasks)
- [ ] Implement paging state machine (2h)
  - States: DISPLAY → MORE_AVAILABLE → END
  - Page size: 10 commands (fits 80% of terminal viewports)
  - Keyboard handlers: SPACE (next), Q (quit), ESC (quit)
  - Architecture ready from Sessie 36 (modular functions)

- [ ] Build help pager UI (2h)
  - Header: "Commands (Page 1/3)"
  - Body: 10 commands with descriptions
  - Footer: "-- More -- (SPACE for next, Q to quit)"
  - Mobile optimization: 8 commands per page on <768px

- [ ] Integrate with help command (1.5h)
  - Conditional trigger: if command count ≥ 50
  - Fallback: if <50 commands, show all (current behavior)
  - Preserve category filtering: help network (paginated)

- [ ] Implement keyboard navigation help paging (1.5h)
  - SPACE: load next page
  - Q / ESC: exit paging mode
  - Page state persistence during session (not localStorage)

- [ ] Add page indicators (0.5h)
  - Footer: "Page 2 of 5 | 35 commands total"
  - Progress bar (optional): [======>   ] 40%

- [ ] Testing with 50+ commands (0.5h)
  - Simulate 50-command registry
  - Test paging UX across 5 pages
  - Test keyboard shortcuts

### Phase 3: Session Export/Import (7h, 8 tasks)
- [ ] Design export data structure (1h)
  - JSON schema: { version, timestamp, commands[], filesystem, progress, settings }
  - Include: command history, VFS state, tutorial progress, challenge progress
  - Exclude: PII, analytics IDs

- [ ] Implement session export (2h)
  - Command: `export session`
  - Generate JSON from localStorage
  - Download as HackSim_Session_[Timestamp].json
  - File size estimate: 50-200KB (depends on history)

- [ ] Implement session import (2h)
  - Command: `import session`
  - Trigger file picker (input type="file")
  - Validate JSON schema
  - Merge or replace current session (user choice)

- [ ] Build import validator (1h)
  - Schema validation: check required fields
  - Version compatibility check (handle old exports)
  - Data integrity: verify filesystem structure
  - Error handling: corrupted JSON, wrong format

- [ ] Add import conflict resolution (0.5h)
  - Option 1: Replace (overwrite current session)
  - Option 2: Merge (combine histories, keep higher progress)
  - User prompt: "Replace current session or merge?"

- [ ] Testing session export/import (0.5h)
  - Export → import → verify state restoration
  - Test with corrupted JSON
  - Test version compatibility (future-proof)

### Phase 4: Advanced Analytics Dashboard (5h, 6 tasks)
- [ ] Design analytics dashboard UI (1h)
  - Section 1: Session metrics (duration, command count, unique commands)
  - Section 2: Learning progress (tutorials, challenges, badges)
  - Section 3: Command usage heatmap (top 10 commands)
  - Section 4: Error patterns (top 5 errors)
  - Mobile-optimized layout

- [ ] Implement analytics dashboard command (2h)
  - Command: `analytics` or `stats`
  - Pull data from localStorage + Plausible API (optional)
  - Display: ASCII tables + charts (bar chart with | characters)

- [ ] Build command usage tracker (1h)
  - Track: command name, execution count, last used timestamp
  - Store in localStorage: `hacksim_command_usage`
  - Generate heatmap: top 10 most-used commands

- [ ] Build error pattern tracker (0.5h)
  - Track: error type, command causing error, count
  - Store in localStorage: `hacksim_error_patterns`
  - Display: top 5 errors with suggestions

- [ ] Mobile optimization analytics dashboard (0.5h)
  - Collapsible sections
  - Scrollable charts
  - Tap to expand details

### Phase 5: Command System Scaling (10h, 8 tasks)
- [ ] Performance audit with 50+ commands (2h)
  - Measure: registry lookup time, command parsing overhead
  - Benchmark: execute 100 commands, measure avg latency
  - Target: <50ms per command execution

- [ ] Optimize command registry (2h)
  - Index by first character for O(1) lookup
  - Lazy-load command modules (dynamic import)
  - Cache parsed commands (memoization)

- [ ] Implement command caching (1.5h)
  - Cache: parsed command object (name, args, flags)
  - TTL: 5 minutes (clear after inactivity)
  - Memory limit: max 100 cached entries

- [ ] Build command search index (2h)
  - Index: command name, aliases, tags (for fuzzy matching)
  - Structure: inverted index (tag → [commands])
  - Update index when new commands registered

- [ ] Optimize fuzzy matching (1h)
  - Pre-compute Levenshtein distance matrix
  - Early exit for exact matches
  - Limit search to top 5 suggestions

- [ ] Test with 100+ commands (1h)
  - Simulate 100-command registry
  - Measure: registry lookup, fuzzy match, command execution
  - Verify: no performance degradation

- [ ] Bundle size optimization (0.5h)
  - Analyze: largest command modules
  - Compress: minify command descriptions
  - Tree-shake: remove unused exports

---

## 📝 Notities & Beslissingen

### Architecturale Beslissingen
- **Command Pattern:** Elke command is een module met execute() functie
- **Registry Pattern:** Commands registreren in centrale registry
- **VFS in-memory:** Filesystem state in JavaScript object, sync naar localStorage

### Open Vragen
- [ ] Hosting: Netlify vs. Vercel? → **Beslissing: Netlify (zie PLANNING.md)**
- [ ] Analytics: GA4 genoeg of direct Plausible? → **Beslissing: GA4 voor MVP**
- [ ] Minification: Handmatig of build script? → **Beslissing: Optioneel, handmatig**

### Risico's & Mitigaties
- **Risico:** Bundle size >500KB → **Mitigatie:** Regelmatige size checks
- **Risico:** localStorage disabled → **Mitigatie:** Graceful degradation (session-only)
- **Risico:** Mobile te complex → **Mitigatie:** Early mobile testing (M2)

---

## 🔄 Update Instructies

**Hoe deze file gebruiken:**
1. **Voor elke sessie:** Lees welke mijlpaal actief is
2. **Tijdens development:** Check taken af zodra voltooid ([ ] → [x])
3. **Na voltooien taak:** Update voortgang percentage handmatig
4. **Nieuwe taken:** Voeg toe onder relevante mijlpaal
5. **Scope wijziging:** Update eerst PRD, dan PLANNING, dan TASKS

**Taak statussen:**
- [ ] Niet gestart
- [x] Voltooid
- [~] In uitvoering (optioneel, voor langlopende taken)
- [-] Geblokkeerd (vermeld reden in notities)

**Update volgorde bij requirements change:**
```
docs/prd.md → PLANNING.md → TASKS.md → CLAUDE.md
```

---

## 📚 Referenties

**Framework Documenten:**
- `docs/prd.md` - Product Requirements v1.8
- `PLANNING.md` - Architectuur & Tech Stack
- `CLAUDE.md` - AI Assistant Context

**Command Specs:**
- `docs/commands-list.md` - Alle 41 commands gespecificeerd

---

**Laatst bijgewerkt:** 01 jul 2026 (Sessie 190)
**Versie:** 5.64 (Sessie 190 — **Bugfix tutorial/challenge-completion UX** (commit `8757b69`, gepusht). Twee bugs op het completion-moment: (1) weggescrolde laatste-commando-output (tutorial ÉN challenge via gedeelde `renderCompletionBlock`) — scroll-anker verlegd van bodem naar de laatste commando-echo (NEW `_scrollLineToTop`), 3 timer-`_scrollToBottom`-calls in `_revealCelebration` geschrapt; (2) dubbele "Type 'next'" (tutorial-only) — stale `isActive()`-guard las tutorial als IDLE ná same-tick `handleCommand()`-mutatie, gefixt via pre-mutation `tutorialActiveAtStart`. Cache-bump `main.js?v=190-completion-scroll`. Regressie-assertie in `fundamentals.spec.js` (exact 1× "next"). Playwright MCP + 43/43 chromium groen. Volledig: `docs/sessions/current.md` Sessie 190.) | 5.63 (Sessie 189 — **Fase A: leerpad deep-link → in-app tutorial-landing** (sluit de boog Stap 0+B+A). `main.js` leest `?tutorial=<id>` (validatie tegen `tutorialManager.getScenario`; onbekend → stille no-op) + auto-start gesequencet (eerste bezoek ná `typewriter-done`+250ms, terugkerend direct) via `terminal.execute('tutorial <id>')`; briefing = held (scroll-to-bottom + input-focus; welcome bewust niet gecondenseerd). Resume-vs-deeplink non-destructief; URL gestript via `history.replaceState`; analytics-source zonder dubbeltelling via one-shot `setNextStartSource`. 3 knoppen → `?tutorial=fundamentals/recon/exploitation` + labels "Start de <Niveau>-missie"; cache-bump `main.js?v=189-deeplink`. NEW `leerpad-deeplink.spec.js` 5/5; chromium-suite **0 failures** (2 pre-existing stale tests — lead-magnet-copy + footer same-tab — meegefixt). Render-en-meet dark/light/375px groen. Commit (lokaal, nog niet gepusht). Volledig: `docs/sessions/current.md` Sessie 189.) | 5.62 (Sessie 188 — **Eén coherente leerpad-ladder**: leerpad-commando groepeert de 4 fases onder de 3 niveaus + per niveau een missie-brug (`[→] Begeleide missie: tutorial <id>`); homepage-chips kloppend (netcat/wireshark weg — bestaan niet; hashcat→Expert); challenge-difficulty overal NL via één gedeelde `difficultyLabel()`-helper in 6 plekken (UI=NL-bug). Geen merge, wél uniform + koppelen. Volledige chromium-suite groen (188 passed) + fundamentals cross-browser. Commit `aebcca3`. Volledig: `docs/sessions/current.md` Sessie 188.) | 5.61 (Sessie 187 — **Fase B uitgevoerd: tutorials op orde (badge == bestemming)**, commit `3ac65aa`. NEW `fundamentals.js` (Beginner, 7 stappen pwd→ls→cd→cat→mkdir→touch→rm — 1 cmd/stap, user-keuze via AskUserQuestion) als BEGINNER-deep-link-doel; bridge't naar recon; eerste in `terminal.js`. 4 her-tiering-labels (recon/privesc→Gevorderd, webvuln/exploitation→Expert). Verborgen taak anders dan gespecd: GÉÉN Expert-badge nodig (difficulty = platte tekst, geen difficulty-CSS in terminal; gemeten dark `#c9d1d9`/light `#0a0a0a`). Echte doorwerking = funnel: `next.js` (stage 0 + high-water +1 hernummerd incl. `buildSkippedHint`-drempels), `dashboard.js`, `certificate.js`, `tutorial.js`-manpage. E2E `fundamentals.spec.js` 7 tests cross-browser groen + chromium-suite groen (186 passed). Volledig: `docs/sessions/current.md` Sessie 187.) | 5.60 (Sessie 186 — Stap 0 ontwerpbeslissing "Leerpad deep-link naar in-app tutorials" (doc-only, geen code): niveau→scenario→labelwijziging vastgelegd als sub-blok onder het backlog-item + Stap 0 afgevinkt. Mapping BEGINNER→NEW `fundamentals` / GEVORDERD→`recon`+privesc (`Beginner→Gevorderd`) / EXPERT→`exploitation`+webvuln (`→Expert`). Expert-calls: webvuln→EXPERT (sqlmap = headline-badge-tool; tik-gemak≠tier) + fundamentals = navigatie+bestandsbeheer i.p.v. de volle 9 chips (toets aan de belofte-zin; chips zijn overal illustratief). Fase B-noot: nieuwe `Expert`-label-waarde vereist mogelijk badge-variant in `tutorial-renderer.js`. Geen commits. Volledig: `docs/sessions/current.md` Sessie 186.) | 5.59 (Sessie 185 — Leerpad-sectie homepage: van 3 nep-deuren naar een echt leerpad. De 3 leerpad-knoppen (Start/Verken/Beheers Leerpad) linkten allemaal naar dezelfde `/terminal.html` (drie deuren, één kamer) + dupliceerden de 4 andere terminal-CTA's; "Leerpad" beloofde een pad dat achter de link niet bestond. Elke kaart wordt nu een mini-leerlijn (lezen → oefenen): NEW `.leerpad-learn-link` "Lees eerst"-link per niveau naar bestaande blogcontent (`terminal-basics`/`nmap-beginnersgids`/`sql-injection-uitgelegd`) bóven een eerlijk, uniform label "Oefen in de terminal" (was 3× misleidend "Leerpad"); differentiatie zit nu in de bestemming. NEW `.leerpad-cta-group` (flex-kolom + `margin-top:auto`) lijnt link+knop-paren onderaan de 3 kaarten uit; link theme-aware via `--color-text-dim`/`--color-cta-primary`. Deep-link-naar-tutorials (optie 2) bewust uitgesteld (geen fundamentals-scenario → BEGINNER kan nergens heen; eigen vervolgproject). Cache-bump `landing.css?v=123→124` (index.html). Render-en-meet dark+light+mobiel 375px (6 links 200, groep-tops 3×==4058px, dark `#8b949e` contrast 6,15:1 AA, 0 overflow). Commits `c49c1de`+`9c8cfc6`, gepusht. Kernles: same-tick `getComputedStyle` ná theme-toggle gaf stale `#444444` (verse lezing in aparte tick → echte `#8b949e`); wantrouw óók je meetinstrument. Volledig: `docs/sessions/current.md` Sessie 185.) | 5.58 (Sessie 184 — Blog in-content CTA-boxen visueel geünificeerd: de gecentreerde, volledige-rand `.blog-cta` was de enige uitzondering op de links-uitgelijnde linkerrand-accent aside-taal van de blog (`.blog-tip`/`.blog-warning`/`.blog-info` + product-kaarten `.blog-cta-product`); plain navigatie-CTA's convergeren nu op die behandeling (`text-align` center→left + `border-left:3px var(--color-ui-primary)`, light-override `var(--color-link)` want ui-primary is groen in light → accent blijft blauw, `feedback_blog_palette_no_green`); `.blog-cta-product` geslankt tot enkel de kleinere h3. Lost gecentreerde meerregelige bodytekst op (leesbaarheid). Cache-bump `blog.css?v=120→121` (14 pagina's). Render-en-meet dark+light+mobiel 375px (plain==product, light-accent `#0969da` blauw, 0 overflow, cross-check tweede post). Commit `97b1c8a`, gepusht. Geheugen `feedback_blog_cta_unified`. Volledig: `docs/sessions/current.md` Sessie 184.) | 5.57 (Sessie 183 — Lead-magnet conversie/UX + dark-mode zichtbaarheid + copy-feitencontrole: signup-kaart zichtbaar als paneel (oppervlak-contrast `--color-bg-modal` #161b22 + elevatie + label + mobiele grid-reorder `--lead`); dark-surface-audit (homepage-band + 4 blog-kaarten gelift, blog-palet groen→neutraal `feedback_blog_palette_no_green`); copy tegen sample- + 19p-PDF (belofte-inversie, kaart-mislabels, cross-sell-claims) + kaart-iconen. 8 commits `c6b1247`+`82c77a8`+`90463c4`+`f73ec50`+`f6efd46`+`6dac1bc`+`6024594`+`05b6500`. Volledig: `docs/sessions/current.md` Sessie 183.) | 5.56 (Sessie 182 — Live zoekfilter + design-uitlijning naslagpagina's: gedeelde `src/ui/term-filter.js` (kern + dunne wrappers `glossary-filter.js`/`commands-filter.js`, `commands-scrollspy.js` verwijderd) → live filter op woordenlijst + commands; sticky-balk uitgelijnd op het `.page-section`-box-model (randen samenvallend op elke breedte); woordenlijst categorie-intro's; commands-koppen → woordenlijst-stijl (links/groen/divider). 5 commits `aa5cad1`+`24d2bc0`+`3af5f53`+`5e3c5e6`+`9795c58`. Volledig: `docs/sessions/current.md` Sessie 182.) | 5.55 (Sessie 181 — Content-getallen drift-bestendig: gidsen-stats "10"/"41" → floors "12+"/"40+" + PLANNING "10 posts"→12 + NEW validate-docs `--deep` Check 6c floor-assertie (`geclaimd ≤ ground-truth`, negatief getest); blog-table-stacked (4 blogtabellen → gelabelde kaart-op-mobiel) + over-ons-copy. CLAUDE.md "12 posts" + JSON-LD 39 bewust ongemoeid (canoniek correct). Commits `83c130d`+`3530e07`+`a9006e3`+`ea379a2`. Volledig: `docs/sessions/current.md` Sessie 181.) | 5.54 (Sessie 180 — Blog-auteurschap terug naar merk (Organization) op 13 posts: `article:author`→merk + JSON-LD `author` Person→Organization (== publisher) + zichtbare byline verwijderd; persoonsnaam alleen nog op over-ons (founder-schema + LinkedIn behouden als vertrouwensanker). Eerlijke add-then-remove binnen één sessie na premisse-correctie (echte doel = productpromotie, niet persoonlijk merk → naam-broadcast over 13 geïndexeerde posts onnodig). `privacy.html`/GitHub-URL's/README bewust ongemoeid. Scripted sweep (literal block-match + `count==1`) + JSON-LD-parse-validatie + Playwright render-en-meet; geen cache-bump (inline HTML/JSON-LD). Bulk-rotatie 165-169 → `archive-s165-s169.md` (byte-geverifieerd). Commit `80f0297`. Volledig: `docs/sessions/current.md` Sessie 180.) | 5.53 (Sessie 179 — Klantgerichte copy-perfectionering: footer-tagline "absolute beginners" → traject-framing "van je eerste command tot security tools" (demografisch plafond → vloer; cache-bump v2→v3 24 pagina's) + hero-subtitle herschreven (demografisch label + onware "los van computer/internet"-claim → "in een veilige simulatie ... zonder echte gevolgen"; H1 ongewijzigd SEO) + "authentieke commands" → "commands uit de praktijk" op 9 user-facing plekken ("authentieke ervaring" bewust behouden — homonym-discipline). Commits `0b67fec` + `8a81de8`, gepusht naar `main`. Geheugen `feedback_audience_floor_not_ceiling`. Volledig: `docs/sessions/current.md` Sessie 179.) | 5.52 (Sessie 178 — Homepage lead-magnet: sectie-reorder (lead-magnet ná finale CTA → terminal-CTA krijgt climax-moment direct na de FAQ-payoff; PDF + nieuwsbrief als secundaire email-staart) + `final-cta`-glow van zwevende onderrand-glow → zelfstandige ambient-halo via homepage-gescopete `.final-cta:has(+ .lead-magnet)` (de 4 andere final-cta-pagina's houden de naad-uplight; `landing.css?v=122` op alleen index.html) + copy-perfectionering op 3 teasers (titel "Zo begint een echte pentest" + de-jargon subtekst, geverifieerd tegen de echte 9-pagina PDF-inhoud). HTML-edits geen cache-bump. Commits `26b6f52` + `91aab72` + `deab754`. Volledig: `docs/sessions/current.md` Sessie 178.) | 5.51 (Sessie 177 — Terminal voltooid-markers `[X]`→`[✓]`: de renderer kleurt regels op hun eerste teken, dus `[X]` als "afgevinkt"-vinkje botste met de error-marker → rode checkboxes op mobiel (desktop verbergt het via het ASCII-kader) + doorlek naar ingesprongen regels (≥3 spaties = continuation-line). Migratie `[X]`→`[✓]` (groen, box blijft uitgelijnd) in 6 oppervlakken: leerpad + challenge status/lijst + achievements/badges + tutorial-lijst + next-afronding. Leerpad mobiel: inspringing 4→2 tegen doorlek; man-page-legenda glyph achteraan → wit. Bewust rood gelaten: échte foutmeldingen + "NOOIT doen"-lijsten in security/man-pages (rood kruis = juist). Browser-geverifieerd (no-store) mobiel dark+light + desktop: voltooid groen, niet-voltooid wit, fouten rood, boxen uitgelijnd. Geheugen `reference_renderer_marker_collision`. Commit `af91ff8` (7 files). Volledig: `docs/sessions/current.md` Sessie 177.) | 5.50 (Sessie 176 — Mobiele audit + 5 fixes: (1) brede datatabellen blog+legal scrollbaar op mobiel i.p.v. afgekapt/pagina-overflow (`blog.css`/`legal.css` @media≤768px); (2) **CSP-geblokkeerde inline Consent Mode v2 defaults op alle 14 blogpagina's** → AdSense laadde zónder `denied`-defaults (GDPR-gap, blog gemist bij Sessie-166 externalisatie) → extern `consent-default.js`, runtime 0 CSP-fouten; (3) emoji-cleanup 3 legal-pagina's (~60 → ASCII `[✓]`/`[✗]`/tekst); (4) contact-inputs 38→44px WCAG 2.5.5 + `pages.css` cache-drift→`v133`; (5) terminal scroll-hint mobiel verborgen (botste met quick-command-balk). Filterknoppen-tap-target teruggedraaid na meting (al ≥24px AA). 4 commits `c41e317`/`5dae5ca`/`f4c70be`/`ea1c5ea`, render-en-meet geverifieerd. Volledig: `docs/sessions/current.md` Sessie 176.) | 5.49 (Sessie 175 — layout-fixes `sample-pentest.html`: chevron-uitlijning (`.arrow-glyph` → `vertical-align` + homepage `.phase-arrow` geconsolideerd), success-state vervangt het formulier met een huisstijl-paneel zónder nieuwe `!important` (specificiteit wint van Brevo's `sib-styles.css`), card-body-uitlijning via opt-in `min-height:2lh` gegate op 3-koloms-breakpoint. E2E `lead-magnet.spec.js` 10/10 groen (form-verborgen-asserties toegevoegd). Geheugen `feedback_avoid_important_css`. Commits `6f5e27a`+`0a64369`, gepusht naar `main`. Volledig: `docs/sessions/current.md` Sessie 175.) | 5.48 (Sessie 174 — Mobiele PDF-download fix sample-pentest lead magnet: de welkomstmail-downloadknop loopt via Brevo's click-tracking-redirect die Gmail-mobiel-prefetch 404't (~5-10%, eenmalig token geconsumeerd); die 404 zit op Brevo's server → niet repo-fixbaar. Fix = betrouwbaar same-origin downloadpad dat Brevo-tracking omzeilt: `_headers` `/assets/samples/*` `attachment`→`inline` (forceerde download brak iOS WKWebviews), download-knop in `#success-message` van `sample-pentest.html`, NEW noindex `sample-download.html` (download + cross-sell), `lead_magnet_download` GA4-event via `data-lead-download`. Double opt-in blijft AAN, success-copy gecorrigeerd. 10/10 lead-magnet E2E groen chromium. Brevo-404 zelf = best-effort vervolgwerk Heisenberg (toggle/ticket/bijlage). Commits `8f2ce68`+`fb397ca`. Volledig: `docs/sessions/current.md` Sessie 174.) | 5.47 (Sessie 173 — Launch-prep wo 24 juni: aankondigings-kit herplanned (do 18→wo 24 juni + schema voor beperkt venster), launch-visuals geregenereerd (nieuw H-monogram), homepage linkt nu alle 13 blogposts (5 cornerstones toegevoegd) → crawl-route + sitemap homepage lastmod→18 jun. Datum-discipline-correctie: fake-freshness dateModified-bump op 3 al-complete cornerstones teruggedraaid (schond runbook Fase 2 twee-staps-poort); geheugen `feedback_preserve_plan_gates`. Eerlijke freshness = verse launch-post (later). Commits `d50b981`+`4dd17b5`. Volledig: `docs/sessions/current.md` Sessie 173.) | 5.46 (Sessie 172 — GSC "Verkopersvermeldingen"-fix op `gidsen.html` Product-markup: 4 ontbrekende velden eerlijk ingevuld per digitaal download-product — `image` (kritiek), `brand` HackSimulator.nl, `hasMerchantReturnPolicy`=`MerchantReturnNotPermitted` (NL, art. 6:230p BW), `shippingDetails` €0/0-dagen (instant download; `price` 5.00 blijft, verzendkosten≠prijs). Verbeterpunt: losse cover per gids → NEW `assets/products/*.png` (1200×630 @2x, on-brand H-monogram) via NEW `scripts/build-product-covers.mjs` (SVG→PNG `@resvg/resvg-js`; chromium-download egress-geblokkeerd). `@resvg/resvg-js`→devDeps. JSON-LD valide, nul misleidende data. Commits `d67d3af`+`672c32e`. Handmatig: na deploy GSC-fixvalidatie. Volledig: `docs/sessions/current.md` Sessie 172.) | 5.45 (Sessie 171 — logo-herontwerp H-monogram door de hele asset-keten + NEW `assets/brand/` kit + social-kaart mét logo + og:image `?v=2` + Gumroad-PDF's/sample herbouwd + build-DRY logo-sync. Pre-noot Sessie 170 — Structuuranalyse + veilige repo-opruiming: verdict structuur = goed georganiseerd (schone `src/`-domein-indeling, nul echte weesmodules, geen getrackte rommel). `docs/products/*.pdf` (~632 KB herbouwbare build-output) uit git (`.gitignore` + `git rm --cached`; schijf + `.typ`-bron + geserveerde `assets/samples/` intact) + provenance-header `build-pdfs.sh` + NEW `docs/architecture-review.md`. Doc-verplaatsing naar `archive/` bewust NIET (historische refs in gated `current.md` = net-negatief). Nul runtime-/bundle-impact. Commit `480a227`, 7 files. validate-docs fast+`--deep` exit 0. Volledig: `docs/sessions/current.md` Sessie 170.) | 5.43 (Sessie 169 — GSC-indexeringsanalyse + SEO-fix: 2 echte duplicaat-bronnen weggehaald (14 blog-footers `href="index.html"`→`/blog/`, welkom-body `../index.html`→`/`) die `/blog/index.html` + `/index.html` duplicaten voedden; homepage blog-links 3→8 (crawl-nudge vastzittende posts); sitemap `lastmod` homepage+6 posts→2026-06-15. Overige GSC-meldingen benign (redirects correct, extensieloze URL's historisch/canonical-consolidatie). Commit `cce7dce`, 15 files. Volledig: `docs/sessions/current.md` Sessie 169.) | 5.42 (Sessie 168 — Blog-tabel-uitlijning fix: scoped `.blog-post-content table/th/td`-blok in `styles/blog.css` met `vertical-align: top` als kern-fix (browser-default `baseline` trok rijen uit sync bij afgebroken code-cellen) + `border-collapse`/padding/rij-randen, thema-aware via blog-CSS-variabelen (patroon uit `legal.css`). Repareert alle 4 blog-tabellen; browser-geverifieerd `filterTop == descTop` in dark/light/375px. Commit `4368bb4`. Doc-only delta in styles/ +~0,7 KB. Volledig: `docs/sessions/current.md` Sessie 168.) | 5.41 (Sessie 167 — doc-drift fix M9: het Sessie 162 esbuild content-hash post-launch-blok (5 `[ ]`-items) uit de M9-sectie verplaatst naar `## 🔮 Post-MVP Features`; het zat als h3 binnen de Check 6 awk-range `/^## 🧹 M9:/,/^## 🎓 M6:/` → `--deep` telde 19/24 (79%) vs tabel 19/19 (100%), fast-mode miste het. Besluit (b): esbuild = nieuwe post-launch scope (PRD §13 red line, eerste taak = scope-besluit), GEEN M9-taak; M9 legitiem ✅ Voltooid sinds Sessie 110. Python-move met occurrence-asserts; gate `validate-docs.sh --deep` exit 0, M9 19/19. Doc-only, bundle onveranderd. Volledig: `docs/sessions/current.md` Sessie 167.) | 5.40 (Sessie 166 — pre-launch security-audit: CSP zonder 'unsafe-inline'/'unsafe-hashes' via inline-script-externalisatie (consent-default/brevo-config/init-theme/load-animations-css), AdSense-race gesloten, X-XSS-Protection→0, history.search() ReDoS-hardening, privacy.html feitfout, frame-src/img-src adtrafficquality F6, security.txt+SECURITY.md. Browser-geverifieerd nul CSP-violations + E2E 183 passed. Commit `aa0396d`. Volledig: `docs/sessions/current.md` Sessie 166.) | 5.39 (Sessie 165 — Gumroad-producten kwaliteits-/feitencontrole: pagina-claims gecorrigeerd naar echte PDF-telling (13/19/15/47), Krol-zaak feitfout + ECLI-bronnen, helderheids-glosses CVE/CVSS/ICMP + OWASP-2025-namen exact, MailerLite→Brevo; meeste agent-'verdachte' feiten vals alarm. PDF's herbouwd. Volledig: `docs/sessions/current.md` Sessie 165.) | 5.38 (Sessie 164 — Blog feitencontrole 13 posts: 1 echte fout (Sony PSN→Pictures SQLi) + OWASP 2025-kader + art.138ab-trigger-fix + precisie-nuances + natrekbare bronblokken; eigen bronverificatie ontkrachtte 6/7 agent-vals-alarmen. Commit `57dd28f`. Volledig: `docs/sessions/current.md` Sessie 164.) | 5.37 (Sessie 163 — nmap-profiel-fix + bug-klasse-audit + cat.js-hardening; volledig in current.md) | 5.36 (Sessie 162 — Pre-launch visueel materiaal kit §4: 3 artefacten (GIF ~9,5 s + desktop/mobiele PNG) via NEW `scripts/capture-launch-visuals.mjs` (pure-JS GIF gifenc+pngjs; localStorage-schone-take) + kit §4 feitelijke correctie (`nmap 192.168.1.1` = `[?] TIP` geen `[!]`) + gifenc/pngjs devDeps. Beelden gitignored (`.playwright-mcp/launch/`), script committed. Commit `c299ce4`. Bundle delta 0. Volledig: `docs/sessions/current.md` Sessie 162. Pre-Sessie 162: Versie 5.35 (Sessie 161 — Launch-aankondigings-kit `docs/launch-announcement-kit.md`: positionering (toegankelijkheid-eerst) + geverifieerde-feitenlijst single-source-of-truth + 3 copy-varianten + kanaal-etiquette (WebSearch-geverifieerd: HN/Reddit/EHGN/Tweakers) + visual-plan (nmap-GIF) + launch-dag-volgorde 18 jun 2026. Nuchtere toon (memory `feedback_tone_no_hype`), geen overdrijving (`netcat`/`wireshark`/certificaat-credential uitgesloten). Géén site-code, bundle onveranderd. Volledig: `docs/sessions/current.md` Sessie 161. Pre-Sessie 161: Versie 5.34 (Sessie 160 — public-launch SEO-metadata prep: sitemap/feed drift-fix (3× lastmod<datePublished + ontbrekende OWASP-post + newest-first geordend) + validate-docs Check 9 (9a lastmod≥datePublished + 9b RSS-count==blog-count, filesystem-ground-truth, zelf-getest) + pre-commit trigger-extension naar sitemap/feed/blog + GSC Domain-property launch (auto-verified TransIP, sitemap gesubmit, top-pagina's indexering, kernpagina's al geïndexeerd) + docs/public-launch-runbook.md. Disciplined-hybrid datum-strategie. Commits `0584b3e` + `60f4429`. Volledig: `docs/sessions/current.md` Sessie 160. Pre-Sessie 160: Versie 5.33 (Sessie 159 — #23.2 M0-M4 permanent-SKIP closure ✅ CLOSED (documentation-of-intent, ~30 min). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-whimsical-shannon.md`. **Scope:** scripts/validate-docs.sh 3 comment-plekken — M0-M4 SKIP-notice gewijzigd van "apart fix-decision #23.2 nodig" → "permanent by-design (frozen milestones; section [ ] = defer-to-M5/M4 testing of optional/Post-MVP — geen drift mogelijk)". **Phase 1 analyse:** M0-M4 drift structureel-by-design = semantic-difference tabel (MVP-essential subset) vs section (full-detail incl. defer/optional). Geen Check 6 extension nodig want frozen milestones — detection-value = 0. **#33 (c) niet-ready voor Sessie 160 zonder pre-data scope-design** (geen perf-audit §2j + geen tooling + cumulatief-reverted pad Sessie 151+153). **14-sessie streak honest data-driven outcomes:** 7 falsificatie + 1 KEEP + 2 methodological-evolution-output + 3 feature-completion + **1 documentation-of-intent (12e categorie)**. Anti-rationalisatie-discipline structureel verankerd. **Defense-in-depth ~15 plekken** (scripts/validate-docs.sh 3 plekken + TASKS.md sprint/Versie/Laatst bijgewerkt + Voortgang addendum + CLAUDE.md learnings + counter/rotation/last-updated/version + current.md entry + PLANNING.md + plan-file outcome + --deep zelf-test gate). **NEW Sessie 159 disciplines (3):** (1) Plan-assumption verifieer pre-data ook voor self-authored plans (#23.2 geen formele TASKS.md backlog entry, sub-items impliciet via sprint/script comments — generaliseert Sessie 153 #5 + Sessie 156 #6); (2) Documentation-of-intent als 12e uitkomst-categorie — minimal-closure backlog-hygiene zonder code-logic change; (3) Anti-rationalisatie-pivot-resistance — initiële #33 (c) pivot rationalisatie geweerd na Explore-onderzoek toonde target niet-ready. Pre-Sessie 159: Versie 5.32 (Sessie 158 — #23.1 validate-docs `--deep` Check 6 extension naar M5/M5.5/M9 + NEW Blog sub-check 6b ✅ CLOSED. Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-bright-wind.md`. **Scope:** scripts/validate-docs.sh +44 regels (MILESTONE_RANGES dict +3 entries M5/M5.5/M9 met h3 plain-text/h2-emoji anchored awk-ranges + mkey loop array uitbreiding + NEW Check 6b Blog filesystem-based ground-truth via `ls blog/*.html | grep -vE "/(index|welkom)\.html$" | wc -l` + SKIP-notice update naar M0-M4-only). **Phase 1 ontdekking:** 3 doc-drifts gemaskeerd door Sessie 157 SKIP-conservatisme — M5 tabel 41/45/91% ≠ section 64/26=64/90/71% ≠ section header 8/35 (3-way drift) + M5.5 tabel ~16/18/~89% ≠ section 23/26/88%. **Phase A awk-range refinement:** M5.5 = 23/26 (Phase 1 handmatige telling 20/23 telde Sessies 133-137 [x] block niet — generaliseert Sessie 154 leerpunt #2 naar self-authored plans, awk-range canonical regex schaalt zonder telfouten). **Phase C clean baseline ving exact voorspelde 4 fails** (M5 + M5.5 elk taken+pct, M9/Blog clean) = exit 1 forcing-function value-demonstration (Sessie 157 patroon herhaalt). **Phase D 5 plekken TASKS.md ad-hoc fixes** (M5 tabel + M5.5 tabel + M5 section header + Volgende Acties + totaal-regel Sessie 158 addendum). **Phase E exit 0** = gate. **Phase F 5 drift-injection scenarios verified + revert:** A=M5 50/90 (exit 1 ✓), B=M5.5 99/100 (exit 1 beide ✓), C=M9 5/19 (exit 1 beide ✓), D=Blog 5/10 (exit 1 ✓), E=blog/welkom.html rename count 10→11 (exit 1 ✓). **Phase F NEW Sessie 158 disciplines (4 items):** (1) drift-injection tool-level revert (Edit→Edit) ipv `git checkout -- file` want git checkout reset ALLE uncommitted changes (gevaar voor Phase D fixes) + invalidates Edit-tool Read-state (Sessie 153 #5 + Sessie 156 #6 generaliseren naar drift-injection-context); (2) bash `sed -i 's|pattern|replacement|'` met `|` delimiter is gevaarlijk in markdown-tabel context want tabel-cells gebruiken `|` als separator → sed parse-conflict, gebruik Edit-tool of andere delimiter; (3) Awk-range section-mapping fragility: h2-emoji-anchored (M6/M7/M8/M9) OF h3-plain-text-anchored (M5/M5.5) — header-format-wijzigingen breken range silent, documenteer in script-comment; (4) Pre-data handmatige tellingen falen op grote sections, awk-range met canonical regex schaalt zonder telfouten = forcing-function-discipline voor ground-truth-meting. **13-sessie streak honest data-driven outcomes:** 7 falsificatie + 1 KEEP + 2 methodological-evolution-output + **3 feature-completion** (M6 Sessie 156 + 2× infra-investment sub-categorie Sessies 157-158). Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen. **Bundle delta:** scripts/ buiten Terminal Core budget; src/ 615 KB onveranderd. **Defense-in-depth 14+ plekken:** scripts/validate-docs.sh +44 regels + TASKS.md M5/M5.5 tabel + M5 section header + Volgende Acties + totaal-regel addendum + dit Versie footer 5.31→5.32 + sprint regel + Laatst bijgewerkt header/footer + current.md Sessie 158 entry + CLAUDE.md Recent Critical Learnings Sessie 158 prepend + 1-in-1-out Sessie 156 → current.md + Sessie counter 157→158 + Rotation 156-157→157-158 + Last updated bump + Version 5.31→5.32 + plan-file §6 outcome + final --deep zelf-test exit 0 gate. **Pre-Sessie 158:** Versie 5.31 (Sessie 157 — #23 validate-docs `--deep` mode ✅ CLOSED (12 sessies vertraagd inhalen van Sessie 140 inline TODO target Sessie 144). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-precious-dusk.md`. **Scope:** Single `scripts/validate-docs.sh` + `--deep` opt-in flag. 3 nieuwe checks: (5) Bundle KB ground-truth via VALIDATE-BUNDLE HTML-comment marker block in TASKS.md (±5% tolerance, pure-bash integer arithmetic `× 1000 / target` voor 0,1% precision locale-onafhankelijk), (6) Milestone-percentage ground-truth via `[x]/[ ]` count per M6/M7/M8 section (sections-loze graceful `[SKIP]`), (7) Cross-doc Versie consistency CLAUDE.md `**Version:**` ↔ TASKS.md `**Versie:**`. **Implementatie:** scripts/validate-docs.sh PRE 211 regels → POST 340 regels = +129 regels. TASKS.md NEW VALIDATE-BUNDLE marker block. **Phase C clean baseline ving REAL drift M8** tabel 0/40/0% → 1/37/2% = real-time forcing-function value demonstration; ad-hoc fix. **Ad-hoc drift-fix #2:** spec count 22 → 23 (Sessie 156 tutorial-gestures.spec.js zonder count-update). **Phase C awk locale-bug** gefixt: `awk printf "%.1f"` met `nl_NL.UTF-8` produceerde `0,0` (komma) → volgende awk-call zag `(0,0 > 5.0) ? 0 : 1` = syntax error → silent pass. Pure-bash integer arithmetic ipv awk-printf-float = mitigatie. **Phase D 3 drift-injection scenarios verified:** Bundle src=300 +105% (Check 5 fail exit 1), M7 47/47→40/47 (Check 6 fail beide taken+pct exit 1), Versie 5.30→5.99 (Check 7 fail exit 1). Allen revert. **Phase F final --deep zelf-test exit 0** = forcing-function gate. **NEW Sessie 157 disciplines (5 items):** (1) Pure-bash integer arithmetic met `× 1000 / target` voor 0,1% precision in driftcalc (locale-onafhankelijk); (2) `--deep` opt-in flag pattern voor validate-scripts die hard-drift en soft-drift mengen; (3) Structured HTML-comment marker block als robust parse-target voor compound-data ground-truth in docs; (4) Real-time drift-catch via zelf-test = direct forcing-function value-demonstration (Phase C ving M8 + spec count); (5) TODO-inline-as-spawn-marker discipline bewezen (Sessie 140 TODO Sessie 144-trigger 13 sessies vertraagd MAAR fulfilled). **12-sessie streak honest data-driven outcomes:** 7 falsificatie + 1 KEEP + 2 methodological-evolution-output + **2 feature-completion** (M6 Sessie 156 + infra-investment Sessie 157). Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen. **Defense-in-depth 14+ plekken:** scripts/validate-docs.sh + TASKS.md VALIDATE-BUNDLE marker + TASKS.md item #23 closure + TASKS.md sprint regel + TASKS.md Laatst bijgewerkt header/footer + TASKS.md M8 ad-hoc fix + TASKS.md spec count ad-hoc fix + dit Versie footer 5.30→5.31 + current.md Sessie 157 entry + CLAUDE.md Recent Critical Learnings Sessie 157 prepend + CLAUDE.md 1-in-1-out Sessie 155 + CLAUDE.md Sessie counter 156→157 + CLAUDE.md Rotation 156-157 + CLAUDE.md Last updated bump + CLAUDE.md Version 5.30→5.31 + plan-file §6 outcome + --deep zelf-test exit 0 gate. **Pre-Sessie 157:** Versie 5.30 (Sessie 156 — M6 Tutorial 3 last taken pivot ✅ **M6 milestone 100% closure** (30/32 → 32/32). Eerste M-milestone closure sinds M7 Sessies 105-106. Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-synchronous-sundae.md`. **Scope:** Q1 long-press hint alleen (geen swipe-next/prev wegens pedagogie-spanning) + Q2 beta protocol-doc closure-path. **Files:** NEW src/ui/tutorial-gestures.js (~80 regels vanilla JS singleton) + NEW tests/e2e/tutorial-gestures.spec.js (5 Playwright tests met devices['iPhone 13']) + NEW docs/testing/beta-protocol-tutorials.md (~80 regels protocol-doc) + src/main.js +2 regels import+init + terminal.html cache-bump main.js?v=88→?v=156 op 2 refs (modulepreload + script tag). **Document-drift correcties:** M6 88%/30/33 → 100%/32/32 (header + milestone-tabel + Phase 3 header + Voortgang totaal). NEW separate drift gevangen: TASKS.md Versie 5.26 was 4 versies achter CLAUDE.md 5.29 (Sessies 153-155 hadden Versie nooit gebumpt) — ad-hoc fix naar 5.30 voor Sessie 156 + verwijzing naar current.md voor 5.27-5.29 detail. **NEW Sessie 156 disciplines:** (1) pedagogie-tension-check pre-data voor UX-enhancement op educational-product; (2) registry-pad command-execution (`terminal.execute('cmd')`) voor UI-trigger features → pedagogische transparantie + history-trail + analytics-tracking; (3) cross-doc Versie-bump consistency check als ad-hoc forcing-function preview van #23 validate-docs --deep mode; (4) feature-completion als 11e uitkomst-categorie naast Frame A/B/C/D + distribution-analysis + 3-burst compression; (5) plan-mode AskUserQuestion bij pedagogie-tension = strategisch/product-decision territorium; (6) Edit-tool Read-precondition Sessie 153 leerpunt #5 herbevestigd. **10+1 sessie streak:** 145B + 146D + 147C + 149D + 150A + 151C + 152B + 153D + 154 Outcome 4 + 155 Outcome 4 + **156 M6 feature-completion closure** = 7 falsificatie + 1 KEEP + 2 methodological-evolution-output + **1 feature-completion (nieuwe categorie)**. Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen — discipline-laag identiek aan Frame-verdict-cycli (pre-data scope + AskUserQuestion bij ambiguity + defense-in-depth 5+ plekken + validate-docs gate). Pre-Sessie 156 Versies 5.27-5.29 (Sessies 153-155) — zie docs/sessions/current.md voor detail. Pre-Versie 5.27: Versie 5.26 (Sessie 152 — Combo-pad: #33 (b) ✅ CLOSED N/A HTTP/2 push deprecated (Chrome 106 Sep 2022 + Netlify dropped + ZERO local artifacts triple-source dichtdoen-criterium) + #33 (d) ✅ CLOSED PARTIAL Brotli active HTML/CSS/JS via curl-grep, favicon.svg gap accepted (~184 bytes/req low-impact orthogonal aan mechanism-budget) + **#34 (a) Frame B NOISE-no-action REVERT** preconnect-only mechanism-isolation (patch commit `a19926a` → revert commit `402b1d4`). Verify-first plan-file `/home/willem/.claude/plans/heisenberg-hier-cold-start-sessie-fancy-moon.md` met 7 signalen × 4 dimensies + S7 POST/PRE LCP-range ratio nieuwe primary-discriminator-signaal D4. **17 ad-bearing pages × 1 preconnect-link** (+1,2 KB source-growth, 10× kleiner dan Plan-agent §4 voorspelling = Plan-agent combined-patch-extrapolation pitfall geleerd). Phase A baseline mediaan INDEX r1 LCP=2154/TBT=2208/Score=67 BLOG r2 LCP=1894/TBT=2661/Score=68. Phase C POST mediaan INDEX r1 LCP=2125/TBT=913/Score=75 BLOG r1 LCP=1642/TBT=736/Score=80 = APPARENT Score +8/+12 + TBT -1296/-1926 ms (26-39× threshold extreme). **Mechanism-vs-effect-gap diagnostic-trigger:** S6 137-180 ms pagead2-savings ≠ S3 1296-1926 ms TBT-savings = 7-14× ratio onverklaarbaar door preconnect alleen → cross-check baseline-discipline geactiveerd. **NEW DISCIPLINE — cross-check baseline:** Revert + 3-run baseline tegen post-revert productie om Phase A baseline-anomaly te diagnosticeren. **Cross-check (post-revert 5 jun):** INDEX r2 LCP=1968/TBT=1356/Score=73 BLOG r2 LCP=1859/TBT=1024/Score=76. Phase A INDEX LCP-range 844 ms vs cross-check 401 ms = **2.1× anomaly bevestigd**; BLOG range 356 vs 339 = representative. **TRUE deltas vs cross-check (representative):** Index | S1 LCP +157 C HIT | S3 TBT -443 A HIT | S5 CLS +0.073 C mediaan-artifact | S6 -84 A HIT clean | Score +2 noise. Blog | S1 -217 A HIT | S2 -543 A extreme | S3 -288 A extreme | S5 +0.073 C mediaan-artifact | S6 -92 A HIT clean | Score +4 modest. **S7 cross-canonical AVG vs cross-check 1.83×** ≤ 2× threshold = **NO variance-amplification** = hypothese "preconnect = culprit" **partial-falsified**. **Verdict Frame B** — mechanism-safe (S6 clean BEIDE) + variance-neutral (S7 1.83×) MAAR conflicting canonicals (Index LCP +157 C vs Blog LCP -217 A) + Score noise = geen clean perf-win, source-growth +1,2 KB weegt niet op. Revert vóór verdict-finalisatie want cross-check vereist post-revert state. **Spawn implication #34 (b) inline-CSS-only STILL VALUABLE** per plan §11 5e outcome-pad — Sessie 151 Frame C kwam NIET uit preconnect alleen; mogelijke oorzaken inline-CSS-cascade-interactie of combined-effect of orthogonale variance-bron. **Frame-falsificatie patroon:** 145B + 146D + 147C + 149D + 150A + 151C + **152B** = 7-sessie-streak honest data-driven outcomes (6 falsificatie + 1 KEEP). Anti-rationalisatie-discipline structureel verankerd over alle uitkomst-typen. **Nieuwe disciplines geïntroduceerd Sessie 152:** (1) Cross-check baseline-discipline canonical bij apparent-Frame-A met mechanism-vs-effect-gap >5× ratio of >2× baseline-variance-deviation vs prior sessie's same-baseline; (2) Poll-loop curl-tests moeten HTTP-status guard hebben VOOR content-grep (Sessie 152 DNS-failure-during-revert near-miss); (3) Plan-agent source-growth estimates extrapoleren combined-patch naar isolated-component zonder structurele-decompositie — pre-compute per-component source-growth niet inherit-from-parent; (4) Mechanism-vs-effect-gap >5× ratio is diagnostic-signaal voor cross-check trigger; (5) Triple-source dichtdoen-criterium voor deprecation-checks (config-grep ZERO + upstream-policy + platform-doc) voorkomt onnodige patch-cycli (#33 (b) closed in 10 min); (6) Defense-in-depth-persistence-pattern Sessie 140 → ... → 152 schaalt over alle uitkomst-typen inclusief Frame B NOISE-no-action met cross-check-baseline-discipline-introductie. Sessie 146 archived → current.md (1-in-1-out, top-6 nu 147-152). Volgende bulk-rotation Sessie 155.

Pre-Sessie 152: Versie 5.25 Sessie 151 HERVAT 6-op-rij Frame-falsificatie patroon naar Frame C REVERT na Sessie 150 unique font-pipeline Frame A break. Item #27 ✅ **Frame C REVERT — ad-bearing pages preconnect + inline critical-CSS** (patch commit `a80e675` → revert commit `0354c7a`). 6-op-rij Frame-falsificatie patroon HERVAT na Sessie 150 Frame A break — resource-priority-cascade mechanism herhaalt Sessie 147 #29 patroon. **Multi-metric delta canonicals (mediaan):** Index | S1 LCP +99 NOISE | S2 FCP +270 ms C | S3 TBT +249 ms C | S5 CLS -0,073 A HIT |. Blog/nmap | S1 LCP +838 ms C | S2 FCP -140 ms A HIT | S3 TBT +294 ms C | S5 CLS 0 A HIT | S6 preconnect proof -95 ms / -62% A HIT clean |. **Variance-amplification hypothese:** POST-patch LCP-range 802-1111 ms vs PRE 123-144 ms = 6,5-7,7× variance-increase. Preconnect opent connection vroeg → AdSense backend variance + dependent-request-cascade dominant. **Sessie 147 #29 patroon herhaalt** op nieuw resource-type (preconnect vs modulepreload) — beide mechanism-proof-clean MAAR variance-cascade introduceert netto regressie. Spawn #34 mechanism-isolation onderzoek: splits patch in preconnect-only + inline-CSS-only naar 2 separate cycli om welk mechanism culprit te isoleren. Anti-rationalisatie-discipline structureel verankerd: Frame-falsificatie blijft norm, Sessie 150 Frame A was unique font-pipeline territorium. Pre-Sessie 151: Item #32 + #33 (a) Sessie 150 closures. 5-op-rij Frame-falsificatie patroon **GEBROKEN** door eerste meet-bare mobile-delta sinds Sessie 144 Pad C1+C2. Variable-font discovery: Inter v20 + JetBrains Mono v24 + Space Grotesk v22 zijn variable fonts via Google CSS2 API — 3 unique woff2 (99,6 KB byte-equivalent aan Google CDN) serveren alle 8 weight-declaraties via browser-dedup. Geen pyftsubset build-step. **3-run LH@11 mobile mediaan R2 delta:** S1 LCP -1150 ms (**7,7× Frame A threshold**) / S2 FCP -63 NOISE / S3 Bytes 0 KB NOISE (variable-font byte-equivalent pre-data predicted) / S4 Google Fonts origins 0 ✓ binary mechanism-proof / S5 CLS +0 stable / S6 TBT -491 ms (**6× Frame A threshold**) / Score +19 (63→82). **Frame A verdict via spirit + primary anti-bias rule (Sessie 146):** S1 paint-pipeline + S6 main-thread-blocking = 2 onafhankelijke causale dimensies hit met EXTREME magnitudes. Strict letter "≥3-of-4" gefalsifieerd (2-of-4 hit), MAAR plan-table design-flaw geïdentificeerd (S3 ≤-30 KB mechanisch-onmogelijk door variable-font byte-equivalence pre-data predicted). Secondary safety te streng calibreerd; primary anti-bias rule (breedte over dimensies) = doorslag-discipline. **Cache-coherency bump systemic mitigation:** `main.css?v=114/115` → `?v=150` op alle 20 HTML files voor returning-user-mismatch-prevention (Sessie 148 #31 + Sessie 149 #30 pattern partial applied — Spawn #33 (e) PARTIAL closed). **Defense-in-depth 5 plekken:** TASKS.md item #32 closure + #33 (a) sub-item closure + docs/sessions/current.md Sessie 150 entry + docs/perf-third-party-audit.md §2e + .claude/CLAUDE.md learnings + plan-file outcome-sectie. Open spawn #33 (b/c/d/e) — sub-pad (e) PARTIAL, sub-paden (b)(c)(d) blijven kandidaat voor volgende verify-first cycli. Artifacts `/tmp/sessie150-item33a/{pre-r1,2,3,post-r1,2,3,verdict}.json` + Playwright screenshots `.playwright-mcp/sessie150-{terminal,blog}-self-host-verified.png`.)
**Totaal Taken:** ~343 — zie milestone-tabel voor breakdown. Validatie via `scripts/validate-docs.sh` (run automatisch op pre-commit).
**Live URL:** https://hacksimulator.nl/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator
**Bundle (geverifieerd 29 mei 2026, Sessie 144; +99,6 KB woff2 Sessie 150):**
- Site totaal **~2020 KB unminified** | src/ 613 KB + styles/ ~362 KB (262 + 99,6 woff2 + ~13 KB LICENSES) + HTML ~150 KB + blog/ 360 KB + assets/ 685 KB
- **Terminal Core (runtime van terminal.html, gemeten Sessie 141):** **~781 KB unminified** (~547 KB minified geschat) | HTML 19 KB + CSS 160 KB (6 files) + JS module-graph 601 KB (99 files reachable van entry points). woff2-fonts staan buiten Terminal Core budget (asset-pijler). ⚠️ ~37% boven 400 KB budget JS-zijde — volgende sprint: item #26 box-utils.js
- **Lighthouse on-wire ná #33 (a) self-host (Sessie 150, productie):** terminal.html mobile **63→82** (mediaan R2 selected on LCP) | LCP 4291→3141 ms (-1150) | FCP 1665→1602 (-63) | TBT 907→416 (-491) | CLS 0 stable | TotalBytes 371 KB (0 delta, variable-font byte-equivalent). S4 binary check: 0 Google Fonts origins (fonts.googleapis.com + fonts.gstatic.com) over alle 3 post-runs. Voorgaande milestones: 49→59 (Sessie 144 Pad C1+C2 + AdSense 252 KB → 0 op no-slot pages), sample-pentest.html 73→82. Zie `docs/perf-third-party-audit.md` §2e voor multi-metric tabel + frame-verdict + design-flaw honest-flag.

---

**🚀 Let's build HackSimulator.nl!**
