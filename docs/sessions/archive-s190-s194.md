# Sessie-archief s190–s194

**Rol:** Range-archief (geroteerd uit `current.md` bij Sessie 205, `N%5`-rotatie).
**Ordening:** nieuwste-eerst (194 → 190). Zie `README.md` voor de conventie.

---

## Sessie 194: Uitgestelde Sessie-193-punten — 3 gebouwd, 4 document-and-accept (05 jul 2026)

**Mission:** Sessie 193 liet 7 punten bewust buiten scope. Opdracht: lees de sessie-entry + de punten, beslis meedogenloos eerlijk per punt (bouwen vs document-and-accept) en voer uit. Heisenbergs eigen inschatting (analytics triviaal; VFS-persistentie hoogste prioriteit; #2/#6/#7 waarschijnlijk accepteren) bleek grotendeels juist — met twee correcties uit de verkenning.

**Twee vondsten die de opdracht corrigeerden:**
1. **De challenge-kant van de dubbele-analytics was al veilig** — `challenge-manager.js` `start()` weigert een voltooide challenge (r125-126) en `resume()` ruimt voltooide op (r173); replay-completion is daar onmogelijk. Alleen de tutorial-kant had de bug.
2. **Docs spraken elkaar tegen over `[TIP]`** — de style-guide (Sessie 193) zei "gebruik `[?]`, niet `[TIP]`", maar CLAUDE.md/tone-and-output/command-checklist schrijven `[TIP]` voor als hét canonieke 80/20-patroon. De style-guide-notitie documenteerde renderer-*realiteit* (geen branch); die realiteit wás de bug.

**Work done (3 commits, gepusht in één deploy `cb275f1..f276820`):**
- **`380417e` fix(analytics):** `tutorialEvent('completed')` verplaatst binnen de bestaande `completedScenarios.indexOf === -1`-guard in `_markComplete()` — alleen de éérste voltooiing telt. Challenge ongewijzigd (vondst 1). Bewust géén e2e (analytics is consent-gated → brosse test voor een one-line guard).
- **`8e7bbe6` feat(vfs): schema-signature op `hacksim_filesystem`.** Kern: **runtime djb2-hash over `JSON.stringify(initialFilesystem)`** (`INITIAL_FS_SIGNATURE` in structure.js) i.p.v. een handmatige versie-constante — elimineert de "vergeten te bumpen"-faalklasse volledig. Deterministisch omdat fase-content (README/notes) bij *lezen* wordt geïnjecteerd via `getDynamicContent()`, niet in de boom gebakken. `vfs.serialize()` draagt `base`; `deserialize()` verwerpt bij mismatch (init + return false); `persistence.load()` ruimt dan de stale key op + zet one-shot `wasReset`; `_renderWelcomeSequence` (terminal.js) toont eenmalig `[~] De oefenomgeving is bijgewerkt...` via het bestaande deferred-resume-patroon. Migratie-effect: bestaande bezoekers (save zonder `base`) krijgen éénmalig een verse boom — gewenst, brengt iedereen op de actuele wereld. **Bewust NIET:** versievelden op `hacksim_onboarding`/`_gamification`/`_tutorial_progress`/`_active_challenge` — `||default`-tolerantie + geen consument voor het veld = dood gewicht (YAGNI tot een echte veld-migratie). Cache-bump `v=196-vfs-version`. NEW `tests/e2e/vfs-versioning.spec.js` (3 tests: match→user-file overleeft reload zonder notice; stale seed→verse boom + notice + key opgeruimd; verse bezoeker→geen notice), 3/3 groen eerste run.
- **`f276820` polish(renderer): `[TIP]` first-class info-marker.** Branch op **beide** mapping-plekken (`renderOutput` r95 + `_renderLinesInto` r317 — de style-guide zelf waarschuwde "houd ze synchroon"; de eerste patch miste de tweede) → alle 37 `[TIP]`-regels cyaan met 2 regels code, géén sweep (strings + security-warnings ongemoeid, `_stripTips` ongewijzigd, landing-demo's `<span class="tip">` is een eigen pad). Style-guide-tabel geharmoniseerd + `[TIP]`/`[?]`-semantiek vastgelegd. E2E-assert in gamification.spec.js (achievements-`[TIP]`-regel heeft `terminal-output-info`). Troubleshooting.md: multi-tab-item als bewust geaccepteerd.

**Document-and-accept (4, met rationale):**
- **#2 Multi-tab last-write-wins:** dagdeel bouw + blijvende reconcile-complexiteit (merge-semantiek per key, `_cache`-invalidatie mid-command, debounce-races) tegen een zeldzaam, zelfherstellend, corruptievrij scenario → accepteren; gedocumenteerd in `.claude/rules/troubleshooting.md` item 10.
- **#5 Hint-tier-persistentie:** expliciete `hint`-tier valt na reload terug naar 1 — nauwelijks waarneembaar, zelfs verdedigbaar (heroriëntatie); de tier die ertoe doet (auto-hints op foute pogingen) persisteert al. Schema-wijziging van de hints-blob voor een onzichtbaar effect: niet doen.
- **#6 Mobiel virtual-keyboard:** platform-afhankelijk, vereist echt toestel; speculatieve mitigaties op het fragiele boot-pad = regressierisico zonder verificatie. Oppakken bij device-repro.
- **#7 Per-scenario-voortgangsmap:** single-slot volstaat; pas bij bewijs dat gebruikers missies jongleren.

**Verificatie:** lokaal (verse poort 8321 + `BASE_URL`, NIET productie). NEW spec 3/3 + gamification/tutorial/fundamentals/leerpad-deeplink = 62 chromium groen. performance/debug-storage-specs hardcoden productie-URL's (testen lokale code per definitie niet; hun `hacksim_filesystem`-asserts zijn size-gebaseerd → `base`-veld raakt ze niet). Ground truth: 232 tests / 27 spec files (`--list`), src 666 KB.

**Learnings:**
- **Hash-als-versie werkt alleen dankzij de read-time-injectie-architectuur** — zou `dynamic-content.js` de boom muteren, dan verschilde de signature per gebruiker/fase en resette elke boot. Zelfde les als Sessie 193's fixture-principe: de duurzame fix zit in de bron van de staat.
- **Verifieer de bug vóór je hem fixt — de helft bestond niet.** De "dubbele challenge-analytics" was onmogelijk (start() weigert voltooide challenges). Eén read van de manager voorkwam een overbodige guard + test.
- **Een docs-conflict is een beslissing die niemand genomen heeft.** Style-guide vs CLAUDE.md over `[TIP]` bestond sinds Sessie 193 documenteerde wat de renderer dééd i.p.v. wat hij hóórde te doen. De fix (branch) maakt de canonieke docs waar met 2 regels; de sweep-richting had 37 strings + 3 regels-documenten + security-context geraakt.
- **De style-guide's eigen waarschuwing ("mapping op TWEE plekken") ving mijn halve patch** — `renderOutput` gefixt, `_renderLinesInto` bijna gemist. Gedocumenteerde duplicatie lezen vóór je de "ene" plek patcht.
- **YAGNI op versievelden:** een versie zonder migratielogica-consument is dood gewicht; `||default`-tolerantie dekt de JSON-state-keys tot een veld echt hernoemt.

**Next steps:** geen open technische items. Toekomstig (buiten scope): #6 oppakken bij een echt-toestel-repro; #2 alleen bij bewijs van multi-tab-gebruik.

**Metrics delta:** src 647→666 KB (+19: Sessie 193's 18 fixes + Sessie 194 signature/notice; Sessie 193 had de bundle-marker niet bijgewerkt). Tests 215→232 / 25→27 spec files (Sessie 193 +14 asserts/tests, Sessie 194 +3 vfs-versioning). Cache `v=196-vfs-version`.

---

## Sessie 193: Volledige tutorial-flow-audit — 18 fixes (A–P) in 4 gefaseerde commits (03-05 jul 2026)

**Mission:** Heisenberg meldde met 3 screenshots: (1) deep-link vanaf de homepage toonde "Typ 'next'" (welcome-CTA + placeholder) terwijl de auto-gestarte missie "gebruik pwd" zei; (2) deep-link naar een andere missie toonde eerst de hervat-tekst van de oude missie; (3) `[~] Typ 'hint'` vs `[?] Hint:` oogde inconsistent. Vervolgvraag: niet losse fixes, maar de héle flow perfect — alle routes en faalklassen in kaart. "Alles draait om de gebruikerservaring."

**Aanpak:** 5 Explore-agents + Plan-agent (regelnummers zelf geverifieerd) over twee lagen — begeleiding (meldingen/CTA/state/markers) én omgeving (VFS-precondities/persistentie/sessies/mobile). Uitvoering in 4 fasen, elk apart gecommit + lokaal getest (`BASE_URL=http://127.0.0.1:8123`, NIET productie).

**Antwoord op de hint-vraag:** `[~]` vs `[?]` is **bewust** (renderer.js:95-121: `[~]` dim = staande uitnodiging, `[?]` blauw = hint-inhoud). Hiërarchie behouden; probleem was dat 3 oppervlakken 3 markers gebruikten + nergens gedocumenteerd (style-guide claimde foutief `[TIP]`=cyaan).

**Work done (4 commits):**
- **Fase 1 — deep-link/welcome-coherentie (`c222597`, cache `v=194-deeplink-ux`):** deep-link-id vóór `terminal.init()` gelezen (rauw) + doorgegeven; terminal valideert ná scenario-registratie (`getPendingDeepLink()`). `_renderWelcomeSequence` bepaalt `ctaMode` (deeplink→"Je missie wordt geladen"; suppress bij actieve tutorial; default) + onderdrukt `getResumeMessage()` bij missie-wissel. `main.js` `getState()`→`getStatus()` (bug C: deep-link naar zélfde missie wiste voortgang). `getFilesystemHint`/`getSimulatorCommandHint` geguard (lekten onder briefing). Placeholder state-aware + Type→Typ.
- **Fase 2 — state-eerlijkheid (`2d93dae`):** `resume()` hoist `completedScenarios` vóór early-return (bug H: voltooide missies + certificaat raakten permanent kwijt na reload). `_save()` krijgt `active`-veld; `exit()` bewaart gepauzeerde stap (`_savePaused`, active:false); `start()` hervat die stap ("Voortgang hervat"). Tutorial⇄challenge wederzijds geweigerd + exclusielijsten (`challenge`→tutorial-lijst, `tutorial`/`next`→challenge-lijst).
- **Fase 3 — omgevings-robuustheid (`606f85c`, cache `v=195-env-robust`):** NEW `src/tutorial/scenario-setup.js` (`normalizeCwd`/`restoreFile`/`removeIfExists`) + `setup(vfs)` op alle 5 scenario's, aangeroepen in `start()` bij verse start (niet resume). Fixt F (mkdir-"File exists"-strand bij herhaalrun), G (cwd-drift breekt `cd documents`), M (gewiste read-targets, getrouw hersteld uit `initialFilesystem`). Plus: `clear` heroriënteert (`renderCurrentStep`); challenge persist + resume (`hacksim_active_challenge`); mobiele ls/nmap-knoppen verborgen via `body.mission-active` + tap-guard tijdens typewriter; exploitation shadow-stap eerlijk herschreven (permission-denied = leermoment); consent-writes in 5 tools gewrapt; sql-sleuth/attack-chain order-loks niet-lockend; multi-tool-master-hint `clear` verwijderd.
- **Fase 4 — markers + Typ-sweep + docs (`ced455d`):** hint-markers geünificeerd (next/challenge-renderer/challenge-manager); `_stripTips` strippt ook `[TIP]`; ~90 `Type '`→`Typ '` over src/ (Python-sweep, incl. escaped `\'`-varianten); dode `getPersistentHint` verwijderd; style-guide marker→kleur-tabel + `[~]`/`[?]`-hiërarchie; command-checklist (j/n)→echte consent-model.

**Tests:** 13 nieuwe deterministische asserts (deeplink coherentie ×3, D/E/H ×3, F/G idempotentie+cwd ×2, I clear, J persist, O order-recovery). next-funnel-regex bijgewerkt naar `[->] Typ '`. Volledige aangeraakte chromium-suite groen (deeplink 8, tutorial 38, fundamentals 12, gamification 16, next-funnel, cross-browser, tutorial-mobile 12). Browser-geverifieerd: deep-link toont "Je missie wordt geladen", 0 console-errors.

**Learnings:**
- **Een viewport-/timing-klacht is vaak een volgorde-probleem, niet een render-gat.** Bug A/B kwamen niet uit ontbrekende code maar uit dat de deep-link-id pas ná de welcome-render bekend was. De fix zit in *wanneer* je de staat kent (id vóór `init`), niet in nieuwe UI.
- **Eén slot moet soms 3 toestanden coderen.** `activeScenario` alleen kon "gepauzeerd" niet van "nooit gestart" onderscheiden → een `active`-boolean lost bug D+H op zonder tweede opslag of migratie (oude saves = actief, backwards-compatibel).
- **Bij output-vs-verhaal-conflict: buig het verhaal naar de wereld als de wereld pedagogisch juist is.** `/etc/shadow` restricted is correct + consistent met cat.js' eigen "restricted!"-tip → de tutorial-tekst werd eerlijk, geen globale VFS-mutatie die "shadow leesbaar" zou lekken.
- **De duurzame omgevings-fix is een fixture, niet een validator-patch.** Eén `setup(vfs)` bij verse start neutraliseert F+G+M ineens; validators per stap najagen zou dweilen zijn.
- **first-occurrence-index-vergelijking = permanente lock.** sql-sleuth/attack-chain werden onwinbaar bij één verkeerde-volgorde-poging; "geordende subsequence ergens in de log" behoudt de leerwaarde zonder te vergrendelen.
- **Byte-sweeps missen escaped quotes.** `sed s/Type '/` matchte `Type \'next\'` niet (backslash-byte ertussen); een regex-sweep die `\\?['"]` toestaat ving alle ~90.

**Next steps:** `/summary` doc-sync (deze). Geen open technische items uit de audit — bewust niet aangeraakt (met reden): multi-tab last-write-wins, localStorage-versioning, virtual-keyboard-gedrag.

---

## Sessie 192: Tutorial-voltooiing past in beeld — next-step CTA altijd zichtbaar (02 jul 2026)

**Mission:** Heisenberg meldde met 2 screenshots: na het afronden van Fundamentals zie je de `MISSIE VOLTOOID`-box, maar **niet** de vervolgstap-CTA (`Typ 'next' ...` / `Of typ 'tutorial' ...`). Die staat onder de vouw; je moet zelf naar beneden scrollen om te weten wat je nu moet doen. Voor een beginner een verwarrend doodlopend eind. Analyseren + perfectioneren, brutaal eerlijk.

**Diagnose (plan-mode, directe code-lezing van de bekende completion-keten):** het is de directe consequentie van Sessie 190's scroll-anker, en het verdiende eerlijkheid. Het voltooiingsblok is **~43 regels / ~1300px**, de viewport **~830px** (1080-scherm) = 1,6×. Van boven→onder: commando-echo → stap-feedback (~6) → `MISSIE VOLTOOID`-box (~13) → **`CERTIFICAAT VAN VOLTOOIING`-box (~20)** → follow-up CTA (4). Sessie 190 verankerde de commando-echo aan de **bovenkant** (om "ik zie mijn output niet" te fixen) → de **onderkant** (de CTA) belandt ~470px onder de vouw. Een blok van 1,6× de viewport kan onmogelijk beide uiteinden tonen; de 20-regelige inline-certificaat-box is de wig die box en CTA uit elkaar duwt. **Sessies 190 en 191 zaten op tegenovergestelde uiteinden van deze wip zonder hem te benoemen.**

**Besluit (brutaal eerlijk, expert-call — `feedback_expert_ux_analysis`):** de inline-certificaat-box is volledig redundant — het certificaat staat al op het klembord (`copyCertificateToClipboard`) én is on-demand op te vragen met `tutorial cert` (geverifieerd: `tutorial.js` leest `completedScenarios`, werkt ná voltooiing wanneer de tutorial IDLE is). Een beginner heeft geen 20-regelige ASCII-muur nodig; de `MISSIE VOLTOOID`-box + "Goed gedaan!" belonen al. Verwijder de inline-cert → blok krimpt naar ~23 regels/~750px → *past* → beide eisen (Sessie 190 output-zichtbaar + deze CTA-zichtbaar) worden met één `_scrollToBottom` vervuld. Challenges hebben dit niet (`challenge-renderer.js` levert geen `certificate`-veld; blok ~11 regels past al) → tutorial-specifiek.

**Work done (3 code + 1 test):**
- **`src/tutorial/tutorial-renderer.js`** — `renderCompletion` (desktop) + `_renderCompletionMobile`: `certificate: cert` uit het return-object (renderer slaat Zone 2 over via de `if (completion.certificate)`-guard). `generateCertificate()` + `copyCertificateToClipboard()` behouden (klembord blijft). Follow-up regel 2: `[✓] Certificaat gekopieerd naar je klembord!` → `[✓] Certificaat op je klembord — typ 'tutorial cert' om het te bekijken.`
- **`src/ui/renderer.js`** — `renderCompletionBlock`: scroll-anker `_scrollLineToTop(anchorLine)` → `_scrollToBottom()`; de nu-dode `anchorLine`-capture + de ongebruikte `_scrollLineToTop`-helper verwijderd (−14 regels). `_revealCelebration` ongewijzigd (opacity-only reveal wijzigt geen layout → geen her-scroll). Zone 2-render-code blijft staan (defensief; nooit meer getriggerd want niemand levert nog `certificate`).
- **`terminal.html`** — cache-bump `main.js?v=191-completion-cta` → `?v=192-completion-fit` (modulepreload + script).
- **`tests/e2e/fundamentals.spec.js`** — completion-test: `output` bevat **geen** `CERTIFICAAT VAN VOLTOOIING`; de nieuwe follow-up-pointer-regel `toHaveCount(1)`; ná voltooiing `tutorial cert` → toont het certificaat nog steeds.

**Verificatie (lokaal tegen werkkopie, NIET productie — Sessie-189-leerpunt `BASE_URL`):**
- **Render-en-meet (Playwright, throwaway script, `getBoundingClientRect`):** 1920×1080 (het gemelde scherm) → `echoInView:true` + `ctaInView:true` + `certPresent:false` + box zichtbaar = commando-output ÉN CTA beide in beeld, wig weg. 1280×800 (klein) → `ctaInView:true` maar `echoInView:false` (echo scrollt weg) = juiste prioriteit op een te klein scherm (CTA wint).
- **E2E:** 61 chromium groen — `fundamentals` 10/10 (incl. de aangepaste completion-test) + `tutorial + tutorial-mobile + gamification + certificates` 51/51 (incl. `tutorial cert after completion shows certificate` = cert-feature intact).

**Learnings:**
- **Benoem de wip.** Sessie 190 (output verborgen) en Sessie 192 (CTA verborgen) zijn dezelfde bug van twee kanten: een blok groter dan de viewport waarvan je maar één uiteinde kunt tonen. De duurzame fix is niet nóg een anker-keuze maar het blok kleiner maken dan de viewport; dán vervalt de trade-off. Wantrouw een "fix" die een klacht verplaatst i.p.v. oplost.
- **Meet in regels/pixels, niet in gevoel.** Command→CTA in lijnen tellen (~43) tegen de viewport (~830px) maakte meteen duidelijk dát het niet paste en wélke ~20 regels (de cert) de wig waren. `getBoundingClientRect`-meting op de échte schermmaat (1920×1080) bevestigde de fix objectief i.p.v. "ziet er goed uit".
- **Redundantie is licentie om te schrappen.** De inline-cert kon weg juist omdat dezelfde inhoud al op het klembord stond én via `tutorial cert` opvraagbaar was — eerst die twee paden geverifieerd (post-completion IDLE-pad in `tutorial.js`), pas daarna geschrapt. Anti-gold-plating: feature behouden, alleen de dubbele/schadelijke weergave weg.

**Next steps:** geen open items uit deze sessie. Completion-moment is nu over 3 sessies (190/191/192) uitgehard: output zichtbaar, één heldere CTA, CTA in beeld.

**Metrics delta:** src 648→647 KB (−1 KB: cert-veld + dode helper weg). Tests 25 files/188 ongewijzigd (asserts toegevoegd aan bestaande test). Netto −14 regels code.

**Commit:** `24dc7ec` (`fix(completion): tutorial-voltooiing past in beeld — next-step CTA zichtbaar`), gepusht naar `main` (`2225d7a..24dc7ec`).

---

## Sessie 191: UX-fix voltooiingsscherm — één heldere "wat nu?"-CTA (02 jul 2026)

**Mission:** Heisenberg meldde met screenshot: na het afronden van een tutorial staat er bovenaan "typ next" en verder onderaan al de volgende opdracht (in dit geval "gebruik ping"). Dat is dubbelop. Opdracht: analyseren, achterhalen of het vaker voorkomt, en perfectioneren zodat er geen verwarring ontstaat. Brutaal eerlijk.

**Diagnose (plan-mode, 2 Explore-agents parallel + eigen code-lezing):** het voltooiingsblok is een informatie-architectuur-bug, geen smaakkwestie.
1. **Mislabel (systemisch).** De regel `[→] Type 'next' voor je volgende stap` staat hardcoded op **4 plekken** — `tutorial-renderer.js` desktop (176) + mobile (199), `challenge-renderer.js` desktop (246) + mobile (262). Hij is overal fout op een voltooiingsblok: er is geen "volgende stap" (de stappen zijn klaar), en `next` (`src/commands/system/next.js`) is de globale begeleidings-funnel — géén stap-advancer. Het woord "stap" botst bovendien met de "Stap 1/4" van de volgende missie die er direct onder verschijnt zodra je `tutorial recon` typt (de exacte visuele botsing op de screenshot).
2. **Drievoudige CTA (lokaal).** Audit van alle 5 scenario's: alleen `fundamentals.js` sluit z'n `completionMessage` af met een hardcoded `Type 'tutorial recon'`. De andere 4 (recon/webvuln/privesc/exploitation) eindigen met een thematische afronding zonder commando. Dus na Fundamentals krijgt een beginner **drie** concurrerende "doe dit nu"-commando's: `tutorial recon` (box) + `tutorial` (menu) + `next`. Fundamentals is de outlier, niet de regel.

**Ontwerpbesluit (expert-call, geen keuzemenu — `feedback_expert_ux_analysis`):** `next` is precies gebouwd om dé enkele "wat nu?"-router te zijn (context-aware, high-water-mark, stuurt nooit terug). Dus: route elke voltooiing via één primaire `next`-CTA, demoot het bladermenu tot een duidelijk secundaire "Of"-regel, en laat de box geen specifiek commando meer voorschrijven dat `next` toch al dupliceert.

**Work done (4 code + 1 test):**
- **`src/tutorial/tutorial-renderer.js`** — desktop + mobile `followUp`: `[→] Typ 'next' en ik wijs je naar je volgende missie.` + `[?] Of typ 'tutorial' om alle missies te bekijken.` (was 2 losse CTA-regels met de "stap"-mislabel). `Type`→`Typ`.
- **`src/gamification/challenge-renderer.js`** — desktop + mobile `followUp`: `[→] Typ 'next' en ik wijs je naar je volgende uitdaging.` + secundaire `Of typ 'challenge'...`-regel (desktop ook `dashboard`). Zelfde mislabel-fix voor consistentie.
- **`src/tutorial/scenarios/fundamentals.js`** — laatste zin `Type 'tutorial recon' om je eerste pentest-missie te starten.` geschrapt uit `completionMessage`; eindigt nu op "...klaar voor je eerste echte verkenning." Routering naar recon blijft intact via `next` → `buildReconTutorialStage`.
- **`terminal.html`** — cache-bump `main.js?v=190-completion-scroll` → `?v=191-completion-cta` (modulepreload + script).
- **`tests/e2e/fundamentals.spec.js`** — de Sessie-190-regressie-assertie gesplitst + versterkt: de nieuwe completion-CTA (`Typ 'next' en ik wijs je naar je volgende missie`) `toHaveCount(1)` **én** de oude onboarding-nudge-string (`voor je volgende stap`) `toHaveCount(0)`. Strakkere garantie tegen een dubbele "next"-prompt dan het originele single-count-op-één-string.

**Bewust NIET (anti-gold-plating):**
- De fragiele completion-scroll/reveal-sequencing (Sessie 190) ongemoeid — alleen tekst-inhoud van `followUp`/`completionMessage`.
- Geen auto-advance naar de volgende tutorial gebouwd; `next` blijft de transparante, handmatige funnel.
- De overige 4 scenario-`completionMessage`s niet herschreven (sluiten al schoon af).
- De bredere `Type 'next' voor je volgende stap`-hits in `onboarding.js`/`leerpad.js` niet aangeraakt — dat is de first-visit-nudge/leerpad-view, waar `next` mid-flow wél de eerstvolgende stap is; niet dezelfde mislabel.

**Verificatie (lokaal tegen werkkopie, NIET productie):** `BASE_URL=http://127.0.0.1:8899` (config `baseURL` staat op productie — Sessie-189-leerpunt). **65 e2e groen chromium:** `fundamentals.spec.js` 10/10 (incl. de volledige 7-staps completion-flow + de nieuwe split-assertie), `tutorial + tutorial-mobile + gamification` 45/45. Geen enkele test assert de challenge-`followUp`-strings → geen breakage daar. validate-docs exit 0 vóór start (drift-vrij).

**Learnings:**
- **Grep breder dan de klacht vóór je fixt.** De ene screenshot toonde 1 plek; grep toonde de mislabel op 4 completion-renderers + tientallen onboarding-hits. De juiste scope was de 4 completion-plekken (echte mislabel) — niet de onboarding-hits (daar is `next` wél de volgende stap). "Komt het vaker voor?" letterlijk beantwoorden voorkomt zowel under- als over-reach.
- **Audit alle peers vóór je de outlier fixt.** Pas na het lezen van alle 5 `completionMessage`s bleek dat Fundamentals de enige is met een hardcoded commando — dus de fix is "breng de outlier in lijn", niet "herschrijf alle scenario's".
- **Een string-wijziging kan een regressietest sterker maken.** Doordat de nieuwe CTA een andere string is dan de (gesuppresste) onboarding-nudge, kon de count-1-assertie gesplitst worden in "nieuwe CTA 1× ÉN oude string 0×" — een strengere garantie dan voorheen.

**Commit:** `20578a6` (`fix(completion): één heldere 'wat nu?'-CTA — mislabel + triple-CTA weg`), gepusht naar `main` (`79a41b2..20578a6`).

---

## Sessie 190: Bugfix tutorial/challenge-completion — laatste output zichtbaar + één "next" (01 jul 2026)

**Mission:** Heisenberg meldde met screenshot: na het afronden van de (Fundamentals-)tutorial zie je de output van je **laatste commando niet** — de terminal scrolt direct door naar de completion-melding onderaan. Opdracht: analyseren, achterhalen waar het nóg meer speelt, en perfectioneren. Brutaal eerlijk.

**Diagnose (plan-mode, 2 Explore-agents parallel + eigen code-lezing):** twee losstaande bugs op het meest belonende moment (missie voltooid):
1. **Weggescrolde output (scroll-timing).** De output verdwijnt niet — hij wordt *weggescrold*. `renderer.js` `renderCompletionBlock` plakt een hoog blok (missiebox + certificaat + follow-up) ónder de commando-output en pint de viewport op de bodem (`_scrollToBottom`, regel 233); `_revealCelebration` herhaalt dat op timers (800ms regel 270 + 1500ms regel 278). De opacity:0-zones nemen al layout-hoogte in → `scrollHeight` staat toch al maximaal, dus zelfs handmatig omhoogscrollen wordt teruggetrokken. **Speelt op twee plekken:** tutorial (`terminal.js:283/290`) én challenge (`terminal.js:347`) delen `renderCompletionBlock`.
2. **Dubbele "Type 'next'" (stale-guard, tutorial-only).** `handleCommand()` (`tutorial-manager.js`) zet de tutorial via `_markComplete()` op IDLE in dezelfde tick. De onboarding-guards daarna (`terminal.js` regel 314 & 330) lezen `tutorialManager.isActive()` → `false` → de onboarding-nudge lekt naast de legitieme completion-follow-up. Challenge heeft dit níét (wordt op regel 342 ná de guards afgehandeld → `isActive()` daar nog true).

**Work done (3 code + 1 test):**
- **`src/ui/renderer.js`** — scroll-anker verlegd van "bodem" naar de **laatste commando-echo**. NEW `_scrollLineToTop(line)` via `getBoundingClientRect`-delta (blijft binnen het output-element, scrolt nooit navbar/pagina — consistent met de bestaande `_scrollToBottom`-conventie). In `renderCompletionBlock`: anchorLine (laatste `.terminal-line.terminal-input`) vastgelegd vóór het appenden; ná `_trimOutput()` → `_scrollLineToTop(anchorLine)` met fallback naar `_scrollToBottom()`. De 3 timer-`_scrollToBottom`-calls in `_revealCelebration` geschrapt (opacity-reveal wijzigt geen layout → geen her-scroll nodig; het anker blijft staan). Dode `self`-var verwijderd.
- **`src/core/terminal.js`** — `const tutorialActiveAtStart = tutorialManager.isActive()` vastgelegd vóór de `handleCommand()`-mutatie; guards 314 & 330 lezen die pre-mutation-staat i.p.v. de post-mutation `isActive()`. `challengeManager.isActive()` blijft live (correct — challenge muteert later).
- **`terminal.html`** — cache-bump `main.js?v=189-deeplink` → `?v=190-completion-scroll` (modulepreload + script). Bare ES-imports erven de deploy-invalidatie.
- **`tests/e2e/fundamentals.spec.js`** — regressie-assertie in de bestaande completion-test: `.terminal-line` met "Type 'next' voor je volgende stap" → `toHaveCount(1)`.

**Verificatie (lokaal tegen werkkopie, NIET productie):**
- **Playwright MCP driver** (deterministische start via `tutorial fundamentals` + polling per stap, na eerdere flaky deep-link-timing in headless): na de laatste stap (`rm notes.txt`) gemeten `echoOffsetFromTop: 0` (commando bovenaan), `rmOutputVisible: true`, `nextCount: 1`, `scrollTop 2902 ≠ maxScroll 3727` (niet meer op bodem). Screenshot bevestigt leesvolgorde: commando → output → `[✓] Correct!` → uitleg → missiebox.
- **E2E:** `BASE_URL=http://127.0.0.1:<port>` (config `baseURL` staat op productie — zonder BASE_URL test je de live site, Sessie-189-leerpunt). `fundamentals.spec.js` completion-test groen; volledige `tutorial + fundamentals + gamification` = **43/43 chromium groen** (incl. recon/webvuln/privesc-completions + badges/challenge die dezelfde `renderCompletionBlock` raken).

**Learnings:**
- **Test-tegen-wat.** Twee valse metingen kostten tijd: (1) een warme HTTP-cache serveerde oude modules (scrollTop = exact `scrollHeight − clientHeight` + `nextCount: 2` = tell van oude code) → schone origin/poort nodig; (2) een run waarin de deep-link-auto-start nog niet actief was → commando's liepen als normale commando's (onboarding-hints na elke stap). Fix: deterministisch starten + per stap pollen op `Stap N/7` vóór het volgende commando.
- **Meet-artefact vs. bug.** `find(/Correct/i)` pakte de "Correct!" van stáp 1 (ver weggescrold) → leek "niet zichtbaar"; de relevante asserts (echo bovenaan, output zichtbaar, 1× next) waren groen. Wantrouw je meetinstrument, niet alleen de code.
- **Anti-gold-plating.** Scroll-*positie* bewust niet in E2E vastgelegd (bros) — alleen de deterministische kern (1× next) als regressie-guard; scroll handmatig via Playwright bevestigd. De fragiele welcome/celebratie-sequencing niet herschreven; enkel het anker + de overbodige her-scrolls aangeraakt.

**Commit:** `8757b69` (`fix(tutorial): completion toont laatste commando-output + één 'next'`), gepusht naar `main` (`fbac060..8757b69`).

**Next steps:** geen open items. De eerder gemelde deep-link-auto-start-flakiness in headless is een test-timing-observatie (geen productbug); indien ooit relevant → aparte E2E-helper die op tutorial-actief-staat wacht.

**Metrics delta:** src/ 646→648 KB unminified (+2 KB: `_scrollLineToTop` + guard-capture). Geen nieuwe `test()`-blokken (assertie toegevoegd aan bestaande test) → 215 tests / 25 spec files ongewijzigd. Runtime-bundle-impact verwaarloosbaar.
