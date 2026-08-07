# Sessie Archief 195-199 — HackSimulator.nl

**Geroteerd uit `current.md`:** Sessie 210 (06 aug 2026)
**Sessies:** 199 → 195 (nieuwste-eerst)
**Period:** 05 juli - 26 juli 2026
**Topics:** Marketing-launch uitvoering + verse blogpost metasploit-beginnersgids (199), launch-readiness 3 workstreams funnel/validatie/retentie (198), laatste volledige simulator-bug-test + mobiele overflow + persistence-flush (197), CTA-consistentie-audit "typ next" vs directe opdracht + copy-sweep + 2 gedragsbugs (196), leerpad-consistentie + brede spook-command-nasweep + learning-path.js single-source (195)

---

## Sessie 199: Marketing-launch uitvoeren — verse launch-week-post + launch-beslissing (22-26 jul 2026)

**Mission:** Gebruiker: "ik wil de marketing launch uitvoeren; zeg me precies wat te doen en of ik nu kan launchen of dat er eerst iets moet gebeuren." Diagnose: technisch launch-ready, alles voorbereid (Sessie 161-198: funnel-events live, GA4 grotendeels geconfigureerd, aankondigings-kit + visuals her-geverifieerd, copy plak-klaar). Enige echte bouw-blocker = de verse launch-week-blogpost die het runbook aanbeveelt.

**Besluit (Heisenberg, via AskUserQuestion):** demand-validatie (item #44, 5-10 testsessies) **bewust overslaan → direct launchen**, mét de verse blogpost. Launch-datum: te kort dag voor vandaag (post + prep eerst) → **doel wo 29 juli 2026** (woensdag = beste HN/Reddit-dag, kit §5).

**Datum-verificatie-correctie:** in het eerste plan noemde ik "wo 23 jul (morgen)" terwijl 22 jul zélf al woensdag was — Heisenberg corrigeerde. Weekdag met `date -d` geverifieerd. Geheugen `feedback_verify_calendar_dates` toegevoegd.

**Deel A — gebouwd (code/content, live op main):**
- **NEW `blog/metasploit-beginnersgids.html`** (~2100 woorden, 10 min, categorie Tools) — verse launch-week-post = freshness-hefboom (runbook Fase 2; vorige nieuwste was 26 mei). Beginnersgids: wat is een exploit-framework, de 4 bouwstenen (exploits/payloads/auxiliary/encoders) + post-exploitation, de 7-staps exploit-workflow (recon→lateral movement), payloads (reverse/bind shell + meterpreter), beroemde exploits (EternalBlue/WannaCry + BlueKeep/Log4Shell/Shellshock, tabel), het patch-leermoment (WannaCry-patch was maanden beschikbaar), verdediging, juridische grens (art. 138ab Sr, gemirrord van bestaande posts — géén eigen strafmaat-getal geclaimd). Gemodelleerd op `nmap-beginnersgids.html`: JSON-LD Article (Organization-auteur) + BreadcrumbList, breadcrumbs, blauw blog-palet (geen groen), consent-model-CTA's, lead-magnet + Gumroad + practice-CTA. Feiten alleen uit `metasploit.js` + de geverifieerde-feitenlijst in `launch-announcement-kit.md` §1. `datePublished` 22 jul = echte deploy-dag (geen future-dating op 29 jul → slecht voor SEO + botst met datum-discipline).
- **Ingehaakt:** blog-index (nieuwste boven), `feed.xml` (RSS-item newest-first + `lastBuildDate` → 22 jul; Check 9b RSS-count = blog/*.html minus index), `sitemap.xml` (entry, lastmod >= datePublished; Check 9a), homepage-bloglinks-lijst.
- **Cornerstone-touch (runbook Fase 2, echte content-verbetering rechtvaardigt datum-bump):** natuurlijke interne links naar de nieuwe gids vanaf `cybersecurity-tools.html` (had al een Metasploit-sectie) + `nmap-beginnersgids.html` (recon→exploitation = pedagogisch logische volgende stap). Beide: `article:modified_time` toegevoegd + JSON-LD `dateModified` + sitemap `lastmod` eerlijk naar 22 jul; homepage-lastmod mee (blog-link toegevoegd).
- **NEW `docs/launch-checklist.md`** — één blijvende, vindbare stap-voor-stap to-do (Blok 1 deze week / Blok 2 D-1 28 jul / Blok 3 launch-dag 29 jul / D+14) met vinkvakjes + verwijzingen naar announcement-kit/success-metrics/runbook. Reden: de volledige stappenlijst stond alleen in het ephemere plan-bestand + verspreid over docs; Heisenberg vroeg expliciet "hoe vind ik de stappen terug?".
- **Admin/besluit gelogd in TASKS.md:** #44 → BEWUST OVERGESLAGEN (poort niet weggeredeneerd, als afwijking genoteerd; launch-data vervangt validatiesignaal), #45 (value-prop/retentie) draait nu op echte launch-data i.p.v. validatie-sessies, launch-uitvoering-item gedateerd (29 jul, D-1/dag/D+14) + wijst als eerste naar de checklist.

**Verificatie:** validate-blogs 15/15, validate-docs `--deep` 9/9 (na sync van blog-count 12/12→13/13 + bundle-marker blog 415→447 KB), feed.xml + sitemap.xml well-formed XML (python parse), render-en-meet lokaal (dark/light/375px): 0 horizontale overflow (scrollWidth 360≤375), navbar/footer/consent-banner correct geïnjecteerd, breadcrumb aanwezig, alle 7 interne links resolven 200. Screenshots dark-mobiel + light-desktop.

**Commits (gepusht naar `main`):** `f6894b1` (blogpost + wiring + cornerstone-links), `4245ec9` (blog-count + bundle-marker sync), `7f65d94` (launch-beslissing #44/#45), `d45631d` (launch-checklist.md) + deze /summary doc-sync.

**Learnings:**
- **Filesystem-ground-truth-validatie dwingt afgeleide administratie mee te bewegen.** Een blogpost toevoegen trekt automatisch 3 checks uit sync: Check 6b (blog-count in TASKS-tabel), Check 9b (RSS-item-count == blog/*.html minus index), Check 9a (sitemap lastmod >= datePublished) + Check 5 (bundle blog KB ±5%). Drift-bestendig ontwerp = nieuwe content valt nooit stil buiten beeld, maar je moet de tabel/feed/sitemap/marker expliciet bijwerken. Ken die koppeling vóór je een post toevoegt.
- **datePublished = echte deploy-dag, niet de launch-dag.** Een post nu (22 jul) live zetten met datum 29 jul = future-dating → Google wantrouwt het + botst met "nooit datums faken". 22 jul is eerlijk én op de launch (29 jul) veruit de verste post = precies de freshness die het runbook wil.
- **Juridische claims mirroren, niet zelf verzinnen.** `metasploit.js` noemt "6 jaar" (warning) én "Federal Computer Fraud Act, 10 jaar" (US, manPage) — beide ongeschikt voor NL-copy. De 8 bestaande blogposts citeren art. 138ab Sr zónder strafmaat-getal; die framing gemirrord ([[feedback_verify_claims_against_artifact]]).
- **Cornerstone-touch: doe de niet-datumgevoelige waarde nu, laat de rest voor launch-dag.** De echte SEO-winst (interne links naar de nieuwe post vanaf posts die 'm natuurlijk noemen) kan meteen; de bredere Fase-2 date-align blijft Heisenberg's launch-dag-taak. Twee posten getoucht met eerlijke 22-jul-datums i.p.v. de hele cornerstone-set nu forceren (proportionele inspanning, [[feedback_proportional_effort_hobby]]).
- **Stappen die de gebruiker moet uitvoeren horen in een blijvend repo-bestand, niet alleen in het plan-bestand.** Het plan in `~/.claude/plans/` is sessie-scoped en kan opschonen; `docs/launch-checklist.md` is de duurzame single-source.

**Metrics delta:** blog/ 415→447 KB (+32, nieuwe post) | blogposts 12→13 | RSS-items 13→14 | src/styles/assets ongewijzigd (673/394/1030 KB) | 28 spec files / 213 tests ongewijzigd (geen code-wijziging, alleen content/docs) | 5 commits.

**Next steps (open, Heisenberg):** `docs/launch-checklist.md` afwerken → launch wo 29 juli. Ná launch: item #45 (value-prop/retentie) beslissen op de echte funnel-data. Item #46 open GA4-launch-dag-handelingen (annotatie).

---

## Sessie 198: Launch-readiness — 3 workstreams (08 jul 2026)

**Mission:** Gebruiker: "wat is iets fundamenteels dat we nog moeten doen voor de (uitgestelde) marketing-launch? Wees brutaal eerlijk." Analyse → gebruiker koos "alles aanpakken" (goedgekeurd plan, 3 workstreams).

**Brutaal-eerlijke analyse (de kern):** het product is technisch launch-ready (live, SEO, legal/consent, monetization, funnel-events instrumented) maar strategisch **on**gevalideerd — gebouwd/getest door maker + AI, **nul extern signaal**, geen vooraf-gedefinieerd succescriterium, go-to-market onuitgevoerd. Het fundamentele gat is geen feature maar extern bewijs dat de launch landt + een meetbaar succescriterium. Extra eerlijke randvoorwaarden: NL-taalplafond (grootste megafoons zijn Engels) + zwakke retentie-haak.

**WS1 — Launch meetklaar (code live):**
- **Funnel-audit** (`events.js`/`tracker.js`/`consent.js`): `trackEvent` is consent-gated → `window.gtag('event',...)` → dataLayer (GA4-ID `G-7F792VS6CE`). Call-site-grep: de meeste events waren al bedraad (tutorial-lifecycle, challenge/badge, signups, product-CTA, command_executed). **2 launch-kritische gaten:** (a) geen tracking op de primaire homepage→terminal-CTA's (de #1 conversie onmeetbaar); (b) geen activation-signaal. `onboardingEvent`/`feedbackSubmitted`-wrappers bleken dood (feedback.js roept `tracker.trackEvent` direct aan — geen functioneel gat).
- **Gebouwd:** NEW `terminalCtaClick`/`terminalActivated` in `events.js`; `data-terminal-cta="<locatie>"` op de 6 homepage-CTA's (hero/mid/final + 3 leerpad-deeplinks) + branch in `cta-tracking.js` (reuse delegated-click; cta-tracking laadt transitief via `init-components.js`); activation-hook in `terminal.js` naast `commandExecuted`, once-per-tab-sessie via `sessionStorage['hacksim_activated']`. Bewust géén nav-link (zat in `<noscript>` → kan met JS-vereiste analytics nooit vuren → dode attr verwijderd) + geen gedeelde geïnjecteerde navbar.
- **Verificatie:** browser-self-test (`scratchpad/ws1-funnel-selftest.mjs`) met consent pre-set via `addInitScript` (JSON `{analytics:true}` = zelfde key voor consent.js én tracker.js), funnel gedreven, dataLayer-`event`-tuples opgevangen (de shim werkt óók al is het externe GA4-script egress-geblokkeerd). **Alle funnel-events vuren, 0 ontbrekend**, incl. de 6 CTA-locaties; activation exact 1× + 0× na reload (guard survives reload); 0 code-console-errors (alleen `ERR_TUNNEL` van het geblokkeerde GA4-script). 56 e2e groen (command-coverage/gamification/tutorial — kern-flow intact).
- NEW `docs/launch-success-metrics.md`: funnel→event-mapping, streefgetallen als expliciete hypotheses (north-star = activation-rate), dag-1-minimum, GA4-config (key-events + funnel-exploration + custom dimensions + DebugView-check), read-order launch-dag.
- Cache-bump `main.js v=201→202-funnel` (terminal) + `init-components.js v=3→4` (24 marketing-pagina's).

**WS2 — Demand-validatie (doc):** NEW `docs/demand-validation-protocol.md` — uitvoerbaar cold-start-protocol: 5 taken (5-sec-positioneringstest → CTA-keuze → activation → missie → deel/terugkeer-intentie) met drop-off-checkpoints, 5 na-vragen, resultaten-template, recruiting voor NL-beginners (mijd HN/netsec — dat publiek vertekent het signaal). Uitvoering (werven + sessies) = Heisenberg.

**WS3 — Value-prop + retentie (doc):** NEW `docs/value-prop-and-retention.md` — brutaal-eerlijke hero-audit (correct maar niet magnetisch: beschrijft WAT i.p.v. uitkomst, feature-lijst-subtitle, geen proof boven de vouw, generieke CTA) + 3 kandidaat-hero's (uitkomst / frictie-nul / doelgroep-spiegel) om te toetsen in de WS2-5-sec-test + retentie-opties gerangschikt (terugkeer-pull > e-mail > streak > content-cadans). **Bewust niet live gezet** — wacht op WS2-validatie.

**Commits (alle ff-gemerged naar main `efdf958..23bbb1a`, gedeployed):** `4728c54` (WS1 funnel-code), `2b95854` (WS1+WS2 docs), `23bbb1a` (WS3 doc).

**Stop-hook signing-noot:** commits tonen als "Unverified" — gediagnosticeerd: **niet** door e-mail (auteur+committer al `noreply@anthropic.com` op álle sessie-commits) maar door ontbrekende SSH-handtekening. `commit.gpgsign=true` + key-pad `/home/claude/.ssh/commit_signing_key.pub` bestaat maar is **0 bytes** (geen private key) + ik draai als `root` zonder toegang tot de `claude`-user-keys → niet ondertekenbaar in deze omgeving. Bewust niet geforceerd: amend/rebase voegt geen handtekening toe (geen key) én zou gedeployde main-historie herschrijven voor niets.

**Learnings:**
- **Het fundamentele launch-gat is zelden een feature — het is extern bewijs + een meetbaar succescriterium.** 197 sessies polish + M8-analytics op 2% is een tell: energie ging naar product, niet naar validatie/distributie. De brutaal-eerlijke diagnose (over-gepolijst, ongevalideerd) was waardevoller dan welke feature ook.
- **Bouw WS3 (copy/retentie) niet vóór de validatie** — op eigen smaak de hero herschrijven = exact de onbewezen-aanname-fout die de analyse aankaartte. De 3 varianten leveren + laten toetsen is de integere vorm; "alles aanpakken" betekent de haakjes klaarleggen, niet blind bouwen.
- **Funnel-events bewijs je zónder productie-GA4** — de gtag-shim pusht naar `window.dataLayer` ook al faalt het externe script (egress); consent pre-setten via `addInitScript` + dataLayer-`event`-tuples lezen = volledige funnel-verificatie in de sandbox.
- **Activation hoort once-per-sessie, niet per command/page-load** — `sessionStorage`-guard (survives reload) voorkomt dubbeltelling; module-boolean zou per reload her-vuren.
- **"Unverified" ≠ verkeerde auteur** — check `%G?` + de signing-key vóór je history herschrijft; een lege 0-byte key betekent dat geen enkele amend/rebase het oplost, dus niet forceren op gedeployde main.

**Next steps:** WS2-sessies draaien (Heisenberg) → voedt WS3-keuze; GA4-goals configureren vóór launch; ná validatie hero-variant + retentie-v1 bouwen. TASKS.md items 43 (✅) / 44 / 45.

**Metrics delta:** src 671→673 KB (funnel-code). Spec-bestanden 28 (ongewijzigd — WS1 geverifieerd via scratchpad-self-test, geen e2e-spec toegevoegd). 3 NEW docs in `docs/`. validate-docs exit 0.

---

## Sessie 197: Laatste volledige simulator-bug-test + 2 fixes (07 jul 2026)

**Mission:** Gebruiker: "ik wil de functies en flow in de simulator 1 laatste keer testen op bugs." Scope (via AskUserQuestion): **alléén de terminal-simulator** (`terminal.html`); beleid: **bevestigde bugs direct fixen** met regressietest, één eindrapport.

**Aanpak:** 8 systematische browser-driving-passes met een eigen Playwright-harness (`scratchpad/driver.mjs`) tegen de lokale werkkopie (verse poort 8237, `BASE_URL`). Echte `fill`+`press('Enter')`, nooit synthetische `dispatchEvent` (Sessie 196-les). Chromium via de voorgeïnstalleerde binary `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` + `--no-sandbox` (Playwright 1.56 wilde build 1228 downloaden → override-config in de repo-root, niet gecommit).

**Dekking (alles schoon tenzij vermeld):**
- **1A Commands:** alle 41 commands (happy + error-paden) + 41 man-pages renderen + typo-fuzzy-suggestie + unknown-command-handling + nul console-errors.
- **1B Security-consent:** alle 5 tools — bare call toont warning zonder tool-output, args zetten consent + draaien, consent gedeeld over tools, `reset consent` re-armt, metasploit's no-arg-variant (typ-opnieuw = accept) werkt.
- **1C Tutorials:** alle 5 scenario's (fundamentals/recon/privesc/webvuln/exploitation) end-to-end voltooid + exit→resume op juiste stap + reload-mid-missie behoudt voortgang + herstart-na-voltooiing + cert-uitgifte + completion-CTA.
- **1D Challenges:** easy/medium/hard end-to-end, order-gevoelige (sql-sleuth/attack-chain) locken niet bij verkeerde volgorde, reload-mid-challenge resumet en voltooit, status/list render, tutorial⇄challenge mutual exclusion.
- **1E Gamification:** leerpad-vinkjes, hasError-guard (gefaalde traceroute vinkt níét af — Sessie 195-fix intact), EXPERT-unlock ≥4-van-6, dashboard/achievements/certificates/leaderboard/next/shortcuts render, next-funnel state-aware.
- **1F Core/input:** VFS-mutaties (touch/mkdir/cp/mv) overleven reload, `reset` herstelt VFS + bewaart history, ↑↓-history-navigatie, Tab command- én fs-pad-autocomplete, Ctrl+R reverse-search, Ctrl+L, Ctrl+C. **Modal-protection/focus-trap expliciet geverifieerd degelijk.**
- **1G Welcome-state:** vers → "Typ 'next'"-CTA; hervatte tutorial/challenge → suppress + neutrale placeholder + resume-notice.
- **1H Mobile 375px:** quick-command-bar tap (na typewriter-enable), mission-hiding ls/nmap-knoppen, completion in beeld — **en de bug.**

**Bug gevonden + gefixt — `3d7df13` mobiele 10px horizontale overflow:** `#terminal-container` erfde `width:100%` uit `styles/terminal.css` maar kreeg in de `@media (max-width:768px)`-regel van `styles/mobile.css` `margin:10px` → met `box-sizing:border-box` werd de rechterrand 385px op een 375-viewport. `body overflow-x:hidden` clipte het (geen zichtbare scrollbar, `window.scrollX` blijft 0) maar de terminal stond 10px uit het midden en de rechter 10px content werd afgekapt; de navbar (100% van de te brede body) rekte mee naar 385. Pre-existing (Sessie 189 noteerde de "10px offset" zonder de oorzaak te fixen). **Fix:** `width:auto` op de mobiele regel → blok past binnen de 10px-marges. Render-en-meet 375px: 0 doc-overflow over leerpad/help/man/achievements/challenge/shortcuts, container symmetrisch (left 10 / right 365), navbar 375. Desktop 1280 ongewijzigd, 0 console-errors. Cache-bump `mobile.css v=115→116` (24 HTML-refs). responsive-ascii-boxes + tutorial-mobile + gamification-mobile 53 groen.

**Robuustheidsfix (na brutaal-eerlijk advies, gebruiker koos "alleen #1") — `9bd487b` persistence-flush:** `progress-store.js` + `persistence.js` flushten hun 500ms-debounce alleen op `beforeunload` — op mobiel (iOS Safari) vuurt dat vaak niet bij app-switch/scherm-lock. `completeChallenge()` schrijft via de debounce, dus een challenge voltooien + tab backgrounden binnen 500ms verloor de voltooiing (de gebruiker moet 'm opnieuw doen). **Fix:** naast `beforeunload` nu ook `pagehide` + `visibilitychange(hidden)` → `flush()` in beide stores (idempotent, geen dubbel-schrijf-risico). Bewezen: challenge voltooid + `<500ms` `visibilitychange(hidden)` → voltooiing staat in localStorage (stond er vlak ervoor, binnen het venster, aantoonbaar níét); idem VFS-mutatie. NEW `persistence-flush.spec.js` (2 tests). Cache-bump `main.js v=199→200-persist-flush`. vfs-versioning + gamification suites groen (23 passed).

**Backlog vastgelegd — `d936e7d` TASKS.md item 42:** 10 spec-bestanden hardcoden productie-URL's i.p.v. `baseURL` (feedback, autocomplete-filesystem, css-variable-test, debug-console, debug-storage, feedback-onboarding-headers, modal-colors-simple, modal-headers, performance, responsive-breakpoints) → ~44 tests valideren nooit de werkkopie. Bewust uitgesteld: testinfra-schuld, geen gebruiker-bug, per-bestand-oordeel nodig (performance/debug wijzen mogelijk bewust naar prod). Hoogste-waarde-move = productie-smoketests van werkkopie-tests splitsen (apart project óf `test.skip`) i.p.v. blind URL-swappen.

**Commits:** `3d7df13` (mobiele overflow), `9bd487b` (persistence-flush), `d936e7d` (backlog-noot), + `/summary`-doc-sync. Alle op branch `claude/test-simulator-bugs-9rhzt4`.

**Learnings:**
- **~6 vals-positieven onderzocht + verworpen vóór ik iets een bug noemde** — heuristiek-matches op body-tekst (man-page bevat "command not found" als voorbeeld; tool-output bevat "waarschuwing"), progress-store 500ms-debounce vs een localStorage-lees op 350ms (leek dataverlies, was timing), scrollback-accumulatie in `innerText` (een eerdere `leerpad`-render bleef in beeld en matchte "Vergrendeld"/afgevinkte commands), en de by-design typewriter-tap-guard (`if (input.disabled) return`). Elke "bug" eerst tegen het codepad houden (Sessie 194-les).
- **Wantrouw je meetinstrument, niet alleen de code** — het eerste "modal-protection kapot"-signaal kwam doordat Playwright's `fill()` de focus voorbij de FocusTrap forceert (onbereikbaar voor een echte gebruiker); een echt-gebruikerspad (typen zonder force-focus) bewees dat de terminal onbereikbaar is met de legal-modal actief. Zelfde klasse als Sessie 185/190/196.
- **De duurzame mobiele fix zit in de breedte, niet in het scroll-anker** — Sessie 189 noteerde de 10px offset als symptoom; de oorzaak was `width:100%` + `margin:10px` samen. `width:auto` centreert én elimineert de overflow in één regel. Meet met `getBoundingClientRect` + `window.scrollX` of het gebruiker-zichtbaar is voordat je 't een bug noemt.
- **Persistence-flush op alleen `beforeunload` is een mobiele data-loss-klasse** — `pagehide` + `visibilitychange(hidden)` is het standaardpatroon; de fix is 3 regels per store, idempotent, en dicht een niet-zelfherstellende voltooiings-verlies (anders dan de bewust-geaccepteerde multi-tab-kwestie). Bewijs het venster (lees localStorage binnen 500ms = leeg) én de fix (na de event = gevuld).
- **Scope bewust smal houden bij een "laatste check"** — niet uitbreiden naar entry-points/hele-site (deep-link al spec-gedekt, blog/consent net ~15 sessies geaudit); een brede oppervlakkige sweep verwatert een scherpe, begrepen eindstaat. De prod-hardcoded-specs als backlog vastleggen i.p.v. half-blind omzetten vanuit een egress-geblokkeerde omgeving.

**Metrics delta:** src 670→671 KB (2 listeners + width:auto, netto ~0). Spec-bestanden 27→28 (+`persistence-flush.spec.js`), +2 tests. Geen bundle-budget-impact. validate-docs exit 0.

**Next steps:** backlog item 42 (prod-hardcoded specs). Geen open simulator-bugs.

---

## Sessie 196: CTA-consistentie-audit — "typ next" vs directe opdracht (06 jul 2026)

**Mission:** Gebruiker: "sommige tutorials zeggen dat je 'next' moet typen, andere geven direct een opdracht — bewust of bug? Ik wil de perfecte gebruikerservaring." Audit van de volledige begeleidingslaag + fixronde op alles wat niet klopte.

**Auditverdict (2 Explore + 1 Plan-agent): bewust design, geen bug.**
- Alle 40 tutorial-stappen (5 scenario's) schrijven een concreet commando voor en advancen *uitsluitend* op correct commando (`validate()` → true); er bestaat géén info-stap-type dat op 'next' advanced. `next` mid-tutorial herhaalt alleen de huidige stap (next.js:575-583) en staat in terminal.js' uitsluitlijst — kan een stap nooit afvinken.
- "Typ 'next'" leeft uitsluitend in de vrije-verkenning-funnel: onboarding-nudges, welcome-CTA, voltooiingsschermen, fase-transitieboxen. De ervaren "inconsistentie" is het contrast tussen twee bewust gescheiden modi.
- De Sessie 190/193-guards tegen kruisbesmetting (`tutorialActiveAtStart`, suppress-paden terminal.js:323-413) staan er aantoonbaar en dekken alle paden.

**Wél gevonden en gefixt — 4 commits:**
1. **`9532b0b` NL-copy-sweep:** ~31 Engelse "Type"-restanten → Typ. Grootste cluster: 24 hint-strings in álle 5 scenario's (`'Type het commando...'` + `'Type: <cmd>'`) — de Sessie-193 ~90-string-sweep matchte dat patroon niet. Verder: onboarding Ctrl+R-tip, reset.js, help-system.js, shortcuts.js-manpage (`Type Ctrl+R`→`Druk Ctrl+R`: toetsdruk ≠ typen), terminal.html edu-steps (2×) + search-placeholder `🔍 Type to search...`→`Zoek een command...` (NL + no-emoji-regel). Quote-unificatie double→single (onboarding/help/help-system).
2. **`914677d` marker-unificatie:** dezelfde CTA-string "Typ 'next' voor je volgende stap" verscheen met 3 markers — `[→]` (onboarding basis), kale `→` (progressive hints), `[?]` (leerpad-box + mobiel, dashboard) → overal `[→]` = primaire actie-CTA. Instructie-bullets (`→ Typ 'nm' en druk Tab`) blijven bewust kale lijst-pijlen. renderer.js-fallback-welcome punt weg. Renderer kleurt →/[?]/[→] alle drie info → visueel no-op.
3. **`43eeb58` `[?] TIP:` → `[TIP]`** (82 hits, 27 bestanden): dubbel-marker naast de canonieke Sessie-194-vorm. Vooraf geverifieerd: `_stripTips` matcht beide (dual-match blijft als vangnet, comment toegevoegd), beide vormen renderen info/cyaan, geen e2e-contract op `[?] TIP`, mobiel 3 chars korter. Geen multi-line-indent-gevallen.
4. **`7fce8c5` twee gedragsbugs (D1+D2):**
   - **D1 — welcome niet challenge-aware:** `ctaMode` (terminal.js `_renderWelcomeSequence`) keek alleen naar tutorialManager; een op boot hervatte challenge kreeg `[→] Typ 'next' voor je volgende stap` én +100ms `[✓] Challenge hervat ... typ 'challenge status'` = twee concurrerende instructies; placeholder bleef ook op de next-nudge staan. Fix: suppress + placeholder-flip óók op `challengeManager.isActive()` (veilig: `resume()` draait in `init()` vóór de welcome-render).
   - **D2 — missies verbruikten one-time-tips:** `onboarding.recordCommand()` draaide vol mee tijdens missies (commandCount++, `_getProgressiveHint()` consumeert flags) terwijl terminal.js de geretourneerde hint nulde. Omdat de drempels `===`-exact zijn (1/3/5/7/...) én de flags one-time, verdwenen de Tab-/Ctrl+R-tips permanent voor wie z'n eerste commands in een missie deed. Fix: `recordCommand(cmd, { deferHints })` — bij missie wél `commandsTried` (leerpad-vinkjes, Sessie 195!) + save, géén count/hints; de nulling-guard in terminal.js vervalt. Bewust géén `===`→`>=`: copy-mismatch ("Eerste opdracht voltooid!" bij count 8) + cascade van opgespaarde hints.

**Tests:** bug-J-reload-test uitgebreid (geen "Typ 'next'" in welcome + neutrale placeholder bij hervatte challenge) + NIEUW challenge-completion-CTA exact 1× / oude nudge 0× (spiegel van fundamentals.spec:114-119) + NIEUW deferHints-assert (commandCount 0 + flags falsy + commandsTried wél gevuld via localStorage-read). 27 specs / 238 tests.

**Verificatie:** volledige chromium-suite **0 failures** (230 passed, 3 bekende flaky-op-retry: 2× tab-autocomplete + 1× long-press-gesture, 5 skipped; verse poort 8199 + BASE_URL). Na-greps: `\bType\b` alleen vakjargon/comments, `[?] TIP` alleen vangnet, kale `→ Typ 'next'` 0. Render-en-meet: leerpad-box 38 regels × exact 1148px na markerswap; 375px geen overflow, `[TIP]`/`[→]` info-kleur; D1 live (challenge-resume: 1 instructie + neutrale placeholder, screenshot `.playwright-mcp/d1-challenge-resume-welcome.png`). validate-docs exit 0. Cache-bump `v=199-cta-audit`.

**Learnings:**
- **Stel eerst vast of de gemelde "inconsistentie" design is** — de architectuur (command-stappen vs next-funnel) was correct; alleen de verpakking (copy/markers) en twee randgevallen waren drift. Een "fix" op de architectuur had het bewuste twee-modi-ontwerp gesloopt.
- **Een string-sweep is pas af na een patroon-brede na-grep, niet na de gemelde plekken** — Sessie 193 verving ~90 `Type '`-strings maar miste `'Type het commando'` en `'Type: <cmd>'` (geen quote na Type). `grep -rn "\bType\b"` + handmatige jargon-triage ving alles.
- **"Onderdrukken" ná een mutatie ≠ uitstellen** — de hint nullen liet de state-mutatie (count++, flags) gewoon doorgaan; bij exacte drempels + one-time-flags is dat permanent verlies. Bevries de state aan de bron (deferHints), filter niet de output.
- **Symmetrie-check tutorial⇄challenge** — elke plek die tutorial-state leest hoort challenge-state ook te lezen; ctaMode was de zoveelste asymmetrie in deze klasse (vgl. traceroute/hasError Sessie 195). De filesystem-/simulator-hints waren wél al symmetrisch geguard, de progressive-hints niet — asymmetrie binnen één bestand.
- **Meet een marker-swap in een padEnd-box** — `[?]`→`[→]` is beide 1 UTF-16-unit dus padEnd klopt, maar glyph-breedte kan per font verschillen; `getBoundingClientRect` op alle 38 boxregels (uniek: 1148px) bewees het objectief.
- **Synthetische KeyboardEvents vuren de command-handler niet** — render-en-meet via `dispatchEvent(new KeyboardEvent(...))` deed niets (en de eerdere "gevonden" CTA bleek de welcome-regel); echte `fill`+`press('Enter')` wel. Wantrouw je meetinstrument (vgl. Sessie 185/190).
- **Bewust NIET (met reden):** next.js ASCII `[->]`/`<-` (padEnd-uitlijning + `next-funnel.spec` grept `/\[->\] Typ/` als contract); kale `→`-lijst-bullets (opsommingsteken ≠ CTA — promotie verwatert de hiërarchie); EN-vakjargon in tool-output (`hash type`, `Database type` — 80/20); usage-syntax-vormen (`[?] Gebruik: challenge start <id>` = andere klasse dan actie-CTA); `===`→`>=`-drempelconversie (zie D2).

**Next steps:** geen open bugs uit deze audit. Bekend maar geen blocker: 3 pre-existing flaky e2e-tests (autocomplete ×2, gesture — timing, groen op retry; kandidaat voor een test-hardening-sessie); Brevo mobiele-PDF-404 blijft handmatig Heisenberg-punt (Sessie 174).

**Metrics delta:** bundle ongewijzigd (string-level edits, src 670 / styles 394 / blog 415 / assets 1031 KB); tests 236→238 (+2), specs 27; cache `v=198`→`v=199-cta-audit`.

---

## Sessie 195: Leerpad-consistentie + brede spook-command-nasweep (05-06 jul 2026)

**Mission:** Gebruiker meldde "leerpad toont niet alle commands — ik gebruikte whois maar zie 'm niet". Follow-up na de fix: "wat missen we nog?". Twee delen: (1) de leerpad-bug oplossen, (2) systematisch dezelfde bug-klasse door de hele codebase auditen.

**Deel 1 — leerpad-fix (`c9ffc65`):**
- **Diagnose:** het `leerpad`-commando rendert een hardcoded 22-command-subset (`leerpad.js`), maar de tracking (`onboarding.getCommandsTried()`) registreert *elk* correct-gebruikt commando. `whois` (dat `tutorial recon` letterlijk leert!) kreeg dus nergens een vinkje. Scherpste inconsistentie: de GEVORDERD-tier bridge't naar `tutorial recon` (leert ping/nmap/whois/traceroute) terwijl FASE 3 ping/nmap/ifconfig/netstat toonde. De faselijsten stonden op **5 plekken** gedupliceerd en al gedivergeerd.
- **Fix:** NEW `src/core/learning-path.js` = single source of truth (`phases`/`tiers`/`PHASE3_UNLOCK_THRESHOLD`/`phaseCommandNames()`; pure datamodule zonder imports → geen cyclus). 6 consumenten omgezet: leerpad.js, next.js (+tips/voorbeelden), dashboard.js, help.js, dynamic-content.js, onboarding.js network-gate. Fase 2 +find/grep (8), Fase 3 +whois/traceroute (6, in recon-tutorial-volgorde → finisher ziet 4 aaneengesloten vinkjes).
- **EXPERT-unlock backwards-compat:** fase 3 groeide 4→6; "alles geprobeerd" zou bestaande unlockers her-vergrendelen → drempel `≥4 van 6` (`PHASE3_UNLOCK_THRESHOLD=4`). Oude 4/4-users houden unlock; recon-finisher (4 commands) unlockt direct. dynamic-content README-fasedetectie idem drempels (voorkomt fase-terugval bij bestaande users).
- Homepage-GEVORDERD-chips + leerpad-manpage (noemde 3 van 8 fase-2-commands) gecorrigeerd. Cache-bump `v=197-leerpad`. Tests: whois/traceroute/find/grep-dekking + EXPERT-unlock-assert; `responsive-ascii-boxes.spec.js` van hardcoded productie-URL → `baseURL` (testte nooit de werkkopie — Sessie-194-valkuil).

**Deel 2+3 — brede audit (`af2bd78` code, `6afd3d6` content/docs):** 3 parallelle Explore-audits (content-oppervlakken / in-app-data / docs) → 20 inconsistenties, dezelfde klasse.
- **Functioneel (code):** (a) terminal.js `_shouldTrackCommand` miste traceroute's `Failed to resolve` in de `hasError`-markers → een gefaalde traceroute werd als succes getrackt en vinkte Fase 3 af (nieuwe regressietest). (b) `SIMULATOR_COMMANDS` stond 2× gedupliceerd (help.js + onboarding.js) en miste `hint`+`shortcuts` → `hint` (zelf-verklaard `[HACKSIM]`) kreeg geen `*` in help; één named-export-bron gemaakt, shortcuts.js-manpage kreeg de `[HACKSIM]`-noot. (c) badge `network-novice` hardcodede de fase-3-lijst → `phaseCommandNames(2)`.
- **Content:** terminal.html "Populaire Commands" prees **wireshark** aan (bestaat niet) → traceroute; commands/index.html toonde 39/41 (`shortcuts`+`welcome` ontbraken volledig, incl. JSON-LD `numberOfItems` + stats-balk) → 41; blog-spoken `ps`/`top`/`uname`/`curl` (3× dode `#cmd-curl`-anchor)/`chmod` eerlijk gemaakt; hashcat-flag-voorbeeld gekaderd als "echte hashcat"; kale-command-CTA's (sqlmap/nikto) conform het consent-model (kaal = warning, dus doelwit toegevoegd).
- **Docs:** prd Bijlage A "30 commands"→41 (+HackSimulator-groep); style-guide stale `[X]`=completed → `[✓]` (botste met eigen marker-tabel + renderer + memory-regel) + echte functienamen; commands-list tutorial/leerpad-voorbeelden; help-system "30 commands"→41; 6 manpages markeerden externe tools (rename/burp/mtr/john/wpscan) als "(niet in simulator)".

**Commits:** `c9ffc65` (leerpad, eerdere sessie-turn) + `af2bd78` (code/tests) + `6afd3d6` (content/docs). Cache-bumps `v=197-leerpad` + `v=198-consistency`.

**Learnings:**
- **"Data gedupliceerd in N views" is de echte bug — niet het ontbrekende item.** De fix is niet "voeg whois op 5 plekken toe" maar de duplicatie elimineren (learning-path.js). Zodra één plek wijzigt (recon-tutorial kreeg whois) divergeert de rest geruisloos: geen error, alleen een gebruiker die z'n vinkje mist.
- **Verifieer een audit-suggestie vóór je 'm toepast.** De audit wilde feed.xml OWASP "2021"→"2025"; verificatie toonde dat 2021 de officieel uitgebrachte editie is (2025 nog concept) en dat de blog-meta bewust 2021 zegt → suggestie was fout. Blind toepassen had een feitfout geïntroduceerd. Zelfde discipline als [[feedback_verify_before_launch_critical]].
- **Een tracking-guard die de meeste commands correct afhandelt kan één command anders behandelen dan z'n buren.** whois/ping's foutstrings zaten in `hasError`, traceroute's niet — precies het asymmetrie-patroon dat de leerpad-bug zelf ook was.
- **"hop voor hop" is geen Nederlands** (vak-idioom letterlijk vertaald) → "stap voor stap" (user-correctie; [[feedback_nl_copy_dejargon]] uitgebreid).
- **Bewust NIET (met reden):** help-system categorie-lijsten registry-derived maken (nu correct, refactor te breed); `hostname`/`uptime` in gamification-performance.spec (dekt bewust het command-not-found-pad); E2E-dekking voor metasploit/welcome (genoteerd, geen blocker).

**Next steps:** geen open technische items uit deze audit. Kandidaat-vervolg: help-system categorie-lijsten alsnog uit de registry afleiden als er ooit een derde consument bijkomt.

**Metrics delta:** src 666→670 KB (+4: learning-path.js). Tests 232→236 / 27 spec files (+4 in bestaande specs, geen nieuwe spec). Cache `v=198-consistency`.
