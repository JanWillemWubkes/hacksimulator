# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

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

---

## Sessie 189: Fase A — leerpad deep-link → in-app tutorial-landing (30 jun 2026)

**Mission:** Sluit de 4-sessie-boog "Leerpad deep-link naar in-app tutorials" (Stap 0 Sessie 186 → Fase B Sessie 187 → ladder Sessie 188). Fase A = deep-link-plumbing + een **perfecte landing**: een bezoeker die op een homepage-leerpad-knop klikt landt direct in een leesbare MISSION BRIEFING van de juiste missie, cursor klaar — niet onder een welkomstbanner, niet in dode input, niet midden in de typewriter. De lat lag expliciet op de landing, niet de plumbing.

**Push-besluit (vooraf gevraagd, advies gegeven):** eerst Fase A afmaken + lokaal committen, dán de 4 onuitgepushte Sessie 185-188-commits (`3ac65aa`/`830b9a1`/`aebcca3`/`9a958c8`) + Fase A in **één** deploy pushen ná akkoord. Onderbouwing: de 4 commits zijn al-geverifieerd docs/leerpad-werk (geen haast), Fase A raakt `terminal.html`/`main.js` (los pushen = 2 deploys zonder winst), en ladder (Sessie 188) + deep-link (Sessie 189) zijn dezelfde feature-boog → samen één coherente live-staat.

**Work done (4 codebestanden + 1 spec):**
- **`src/main.js` — deep-link-handler + sequencer.** `getDeepLinkTutorialId()` leest `?tutorial=<id>`, valideert tegen `tutorialManager.getScenario(id)` (single source of truth; onbekend/typo → `null` = stille no-op). Bij valide id: `history.replaceState({}, '', '/terminal.html')` direct op load (refresh tijdens de ~3s typewriter herstart niet; latere refresh laat resume het overnemen). `scheduleDeepLink(id)`: eerste bezoek → wacht op `typewriter-done`-event + 250 ms (ruimt de 100ms-resume / 200ms-badge-timeouts op); terugkerend → `fire()` direct. `autoStartDeepLink(id)`: resume-vs-deeplink non-destructief — geen actief → start; actief==target → níét herstarten (zou progress naar stap 0 resetten), enkel focus/scroll; actief!=target → `tutorialManager.exit()` (slaat progress op, géén render om verwarring te vermijden) + start target. Auto-start via `terminal.execute('tutorial <id>')` (Sessie-156-registry-pad: command-echo + history + laat `markFirstVisitComplete()` eerlijk flippen). `_focusBriefing()`: `Promise.resolve().then(...)` ná de execute-microtask → scroll output naar bottom + `input.focus()`. Inhaken in `initialize()`: deepLinkId vóór de needlegal-tak; legal-pad breidt de bestaande `legal-accepted`-listener uit, non-legal-pad roept `scheduleDeepLink` direct.
- **`src/tutorial/tutorial-manager.js` — source-aware start (one-shot).** `start()` vuurde al `tutorialEvent('started', id)` zónder source; een tweede call vanuit de deep-link zou dubbeltellen. Opgelost met `_nextStartSource`-veld + `setNextStartSource(src)`; `start()` leest+wist het en geeft het mee aan zijn bestaande event (`{ source } || {}`). Auto-clear → een latere handmatige `tutorial recon` erft de source niet.
- **`index.html` — 3 leerpad-knoppen.** Alleen `.leerpad-btn` (niet de `.leerpad-learn-link`): href `/terminal.html` → `?tutorial=fundamentals/recon/exploitation`; label "Oefen in de terminal" → "Start de Beginner/Gevorderd/Expert-missie". Reflecteert de bestemming (3 verschillende missies) → vermijdt de Sessie-185-affordance-mismatch (3 identieke labels → zelfde plek).
- **`terminal.html` — cache-bump.** `main.js?v=164-marker-green` → `?v=189-deeplink` op beide refs (modulepreload + script).
- **NEW `tests/e2e/leerpad-deeplink.spec.js`** (5 tests): 3 niveaus happy-path (MISSION BRIEFING + `Niveau: <Beginner/Gevorderd/Expert>` + scenario-marker + `Stap 1/` + input enabled+focused + URL gestript) + onbekende-id no-op (geen briefing, URL ongemoeid) + gewone terminal (geen auto-start).

**Ontwerp-beslissingen (expert, anti-gold-plating):**
- **Welcome NIET gecondenseerd/overgeslagen bij een deep-link.** De briefing wordt de held via scroll-to-bottom + input-focus, niet door de welcome-render te herschrijven. Reden: de welcome is het meest fragiele, zorgvuldig-gesequencede boot-pad (typewriter + legal + first-visit-flag); daar conditioneel in snijden = hoog risico voor marginale winst. Na auto-scroll staat briefing+objective+cursor onderaan in beeld; de korte welcome scrollt boven de vouw. **Bewust NIET gedaan:** welcome-suppressie-tak, een aparte "deep-link welcome"-variant, landingsanimaties, blog/commands deep-linken, resume-instellingen-UI.

**Verificatie:**
- **E2E:** `leerpad-deeplink.spec.js` 5/5 groen tegen lokale server. Volledige chromium-suite: **0 failures** (~200 passed + ~10 flaky-op-retry + 5 skipped = 215 totaal; de passed/flaky-split wisselt per run door timing-flaky tests — de stabiele metric is 0 failures). **Twee voorheen-rode tests in dezelfde sessie gefixt** (bevestigd óók rood tegen productie via `baseURL` default → pre-existing stale tests, géén Fase A-regressie): (1) `lead-magnet.spec.js:8` assertte kaart-copy "Command-cheatsheet"/"Beslisboom" die Sessie 183 bewust als feitelijk-onjuiste PDF-claims verwijderde → asserties bijgewerkt naar de huidige h3's (Voorbereiding/verkennen/6 fasen); (2) `cross-browser.spec.js:285` eiste `target="_blank"`+`rel` op de footer-legal-links, maar de footer opent legal **same-tab** (alleen legal-modal + consent-banner openen nieuw-tab) → assertie omgezet naar href-check (`assets/legal/*.html`). Site was in beide gevallen correct; de tests liepen achter.
- **Render-en-meet** (Playwright MCP, lokale `python3 -m http.server`, dark/light/375px): fundamentals dark/light desktop + recon 375px. Gemeten: `inputDisabled:false`, `inputFocused:true` (activeEl `terminal-input`), output naar bottom gescrold (briefing+objective+cursor in beeld), `urlSearch:''`, **doc horizontal overflow 0px** desktop. Op 375px een 10px-overflow van `MAIN#terminal-container` (left 10, width 360, right 370 op docW 360) — **identiek bevestigd op een gewone `/terminal.html` zonder deep-link** = pre-existing page-shell-layout, niet door Fase A geïntroduceerd; de mobiele markdown-briefing wrapt schoon zonder content-clipping. Screenshots `.playwright-mcp/deeplink-{fundamentals-dark,fundamentals-light,recon-375}.png`.
- **validate-docs:** exit 0 (verwacht na deze /summary).

**Kritieke vondst tijdens verificatie:** de happy-path-tests faalden eerst — bleek dat `playwright.config.js` `baseURL` op **productie** (`https://hacksimulator.nl`) heeft staan met `webServer` uitgecommentarieerd. Zonder `BASE_URL` test je dus de live site (geen deep-link-code) i.p.v. je werkkopie; de no-op-tests "slaagden" toevallig (prod toont sowieso geen briefing). Fix: lokale statische server starten + `BASE_URL=http://127.0.0.1:8099` zetten. Een groene/rode test betekent niets als je niet weet waartégen hij draait.

**Commits:** `1de8100` (feat(leerpad): deep-link Fase A) + `fc2175e` (docs(sessie-189): /summary doc-sync) + een derde commit voor de 2 stale-test-fixes, alle op `main`. **Nog niet gepusht** — bundelt met de 4 Sessie 185-188-commits in één deploy ná go.

**Learnings:**
- **`markFirstVisitComplete()` flipt op de eerste `terminal.execute()`** (terminal.js:297), niet in de welcome-render. Auto-start via het registry-pad (`terminal.execute('tutorial <id>')`) wint daarom op drie assen tegelijk: command-echo/transparantie (Sessie 156), history-trail én een eerlijke first-visit-flag. Een directe `tutorialManager.start()` had alle drie gemist.
- **`start()` vuurde al `tutorialEvent('started')` zonder source** → een tweede analytics-call zou dubbeltellen. De nette oplossing is de source *vooraf* in de manager prikken (one-shot veld dat `start()` leest+wist), niet een tweede event vanuit de deep-link.
- **baseURL-valkuil:** `playwright.config.js` test default tegen productie. Lokale verificatie vereist een eigen statische server + `BASE_URL`. Render-en-meet en E2E zijn waardeloos als je het doelwit niet kent.
- **Overflow eerlijk toeschrijven:** de 10px op 375px wás er al zonder de feature (gemeten op een kale terminal). Een meting die je niet baselinet kan een pre-existing eigenaardigheid ten onrechte aan je wijziging hangen (of omgekeerd verbergen). Anti-gold-plating: niet "fixen" wat niet van mij is en buiten scope valt.
- **Resume-vs-deeplink: deep-link wint, maar non-destructief.** Een expliciete klik is verse intentie en mag een stale auto-resume overrulen — maar zonder progress te vernietigen: `exit()` slaat op vóór de nieuwe start, en een deep-link naar de reeds-actieve missie herstart níét (geen reset naar stap 0).

**Next steps:** push (4 Sessie 185-188 + Fase A 2 + test-fix 1 = 7 commits) ná go van Heisenberg. Geen openstaande Fase-items meer in de "Leerpad deep-link"-boog. Optionele toekomst (buiten scope, niet ingepland): blog/commands deep-link-instappunten; analytics-dashboard-segment op `source:homepage-leerpad`.

**Metrics delta:** spec files 24→25, tests 215 (was 210). src/ 631→646 KB (sinds Sessie 185-marker; +deep-link-handler ~3KB, rest = Sessie 187-188-code). Geen styles/blog/assets-delta.

---

## Sessie 188: Eén coherente leerpad-ladder — progressie-oppervlakken uniform (30 jun 2026)

**Mission:** Vraag van Heisenberg: "komt de tutorial-indeling overeen met het leerpad-commando in de simulator?" Antwoord (brutaal eerlijk): structureel niet — en de analyse legde een groter UX-probleem bloot. Opdracht: "analyseer als expert wat echt het beste is voor de UX, tijd speelt geen rol."

**Diagnose (de echte bevinding):** drie vocabulaires voor "hoe moeilijk" over vier leeroppervlakken — homepage `#leerpad` + `tutorial` = Beginner/Gevorderd/Expert (NL); `leerpad`-commando = Fase 1-4 (categorienamen); `challenge` = EASY/MEDIUM/HARD (Engels — schendt UI=NL). Bovendien verwezen `leerpad` (oefenen) en `tutorial` (begeleide missies) nergens naar elkaar, en `privesc` (Gevorderd) gebruikt Fase-1-commando's maar past in geen leerpad-fase. Een leerling kon geen mentaal model van "het pad" vormen.

**Expert-besluit (geen keuzemenu, [[feedback_expert_ux_analysis]]):** niet samenvoegen (elk oppervlak heeft een functie) — wél één canonieke 3-niveau-ladder waar alles op uitlijnt, met per niveau de lus **Lees → Doe de missie → Oefen vrij → Test jezelf**. De 3-niveau-taal is al de homepage/tutorial-standaard; leerpad (4 fases) en challenge (Engels) zijn de outliers die convergeren.

**Work done (commit `aebcca3`, 13 files):**
- **Fase 1 — `leerpad.js` wordt de unifiërende kaart:** de 4 fases gegroepeerd onder 3 niveau-koppen (BEGINNER = Fase 1+2, GEVORDERD = Fase 3, EXPERT = Fase 4) via een nieuwe `tiers`-structuur + `isExpertUnlocked()`. Per niveau een brug `[→] Begeleide missie: tutorial <id>` (fundamentals/recon/exploitation). Fase-namen (informatiever dan kale tiers), command-afvink-tracking en de EXPERT-lock behouden. `buildBoxOutput` + `buildMobileOutput` + manPage herschreven. Desktop-indent: tier 2 / fase 4 / command 8.
- **Fase 3 — homepage-chips kloppend (`index.html`):** GEVORDERD `nmap/netcat/wireshark/hashcat` → `ping/nmap/ifconfig/netstat` (netcat/wireshark bestaan niet als commando; hashcat is Fase 4); EXPERT `metasploit,hydra / sqlmap,nikto / hashcat` (dekt exact Fase 4); BEGINNER ongewijzigd. Beschrijvings-tweaks (geen wireshark-belofte "analyseer verkeer" meer).
- **Fase 2 — challenge-difficulty overal NL:** één gedeelde `difficultyLabel()` (export uit `challenge-renderer.js`) → EASY/MEDIUM/HARD → Makkelijk/Gemiddeld/Moeilijk in **6 bestanden** (challenge-renderer, challenge, dashboard, next (`diffLabels`), certificate-generator, certificates). Interne keys (easy/medium/hard) ongemoeid.
- **E2E:** 3 nieuwe asserts in `fundamentals.spec.js` (leerpad-ladder + missie-brug; challenge NL; homepage geen fictieve commando's). EASY/MEDIUM/HARD-asserts in gamification/gamification-mobile/dashboard/certificates → NL. Stale badge-count `21`→`22` gecorrigeerd (badge-definitions.js heeft 22; oude test leunde op geleakte unlock-state — order-afhankelijk).

**Verificatie:** volledige chromium-suite groen (188 passed, 5 skipped, pre-existing flaky op retry, 0 failures) + `fundamentals.spec.js` cross-browser (firefox+webkit, 20 passed). Render-en-meet (no-store + Playwright MCP, dark/light/375px): leerpad mobiel + desktop (alle box-regels exact 69 breed = pixel-uitgelijnd), tier-koppen + missie-bruggen + EXPERT-lock correct, challenge NL-labels gemeten (hasNL true / hasEN false), homepage 18 chips alle echt (0 fictie). validate-docs exit 0.

**Commits:** `aebcca3` (feat(leerpad): één coherente ladder), op `main`. **Nog niet gepusht** (push = Netlify-deploy; wacht op go van Heisenberg).

**Learnings:**
- **Het echte probleem was groter dan de vraag.** "Komt tutorial overeen met leerpad?" → de werkelijke debt was drie difficulty-vocabulaires over vier oppervlakken zonder onderlinge koppeling. Expert-analyse = de vraag herkaderen naar het systemische probleem, niet alleen het letterlijke punt beantwoorden.
- **Uniform maken ≠ samenvoegen.** leerpad/tutorial/challenge hebben elk een functie; de fix is gedeelde taal + expliciete koppeling, niet minder systemen. De 4 fase-namen behouden (informatiever) en gróéperen onder 3 niveaus geeft best-of-both.
- **Difficulty-labels zaten verspreid over 6 bestanden** — gevonden door test-failures te volgen (certificaten-lijst + cert-generator waren aparte codepaden die de eerste fix miste). Eén gedeelde helper voorkomt herhaling van dit lek. Thoroughness (de hele keten najagen) betaalde.
- **Een "pre-existing" test-failure kan order-afhankelijkheid maskeren.** De badge-count `21`-test slaagde in de volle suite (geleakte unlock-state toonde "21/22") maar faalde geïsoleerd; de echte telling is 22. Een count-assertie hoort de ground-truth te volgen, niet geleakte state.

**Next steps (open):** Fase A — deep-link homepage-knoppen → `?tutorial=fundamentals/recon/exploitation` (`main.js` URLSearchParams + cache-bump + E2E). Push Sessie 187+188 naar `main` (deploy) na go.

**Metrics delta:** src/ +~2 KB (leerpad/challenge); tests 207→**210** per browser-project (24 spec files, +3 asserts in fundamentals.spec.js). Geen runtime-budget-impact (Terminal Core ruim <400 KB).

---

## Sessie 187: Fase B — tutorials op orde (badge == bestemming) (30 jun 2026)

**Mission:** Fase B van het backlog-item "Leerpad deep-link naar in-app tutorials" uitvoeren (vervolg op Sessie 186 Stap 0): de niveau→scenario→labelwijziging-mapping wáármaken in code zodat de difficulty die de gebruiker ziet de échte skill weerspiegelt en er een BEGINNER-bestemming (fundamentals) bestaat. B vóór A (dwingend). Code-werk, direct op `main`.

**Aanpak (plan-mode):** Eigen exploratie (geen subagents) — alle 4 scenario-bestanden, `tutorial-renderer.js`, `tutorial-manager.js`, `next.js`, `leerpad.js`, `dashboard.js`, `certificate.js`, de filesystem-commando's (mkdir/touch/rm/cd/cat/ls/pwd) + de VFS-default (`structure.js`). Eén structuurkeuze via AskUserQuestion voorgelegd (engine valideert per commando → spec's "~5 gegroepeerd" botst); user koos **7 stappen, 1 commando elk**.

**Work done (commit `3ac65aa`, 11 files, +411/−24):**
- **NEW `src/tutorial/scenarios/fundamentals.js`** (Beginner, 7 stappen pwd→ls→cd→cat→mkdir→touch→rm). Validators asymmetrisch: kijk-commando's (pwd/ls/cat) toetsen op *afwezigheid* van error-patronen; maak/wis-commando's (mkdir/touch/rm) op *aanwezigheid* van de succes-marker (`aangemaakt`/`verwijderd`) → één check vangt alle faal-redenen. VFS-coherent geverifieerd tegen `structure.js`: cwd `/home/hacker` → `cd documents` → `cat scan-results.txt` bestaat daar → mkdir/touch/rm in die schrijfbare map. Security-bridge briefing, completion bridge't naar recon.
- **Registratie** `terminal.js`: fundamentals als **eerste** (Beginner bovenaan de `tutorial`-lijst).
- **4 her-tiering-labels:** recon/privesc `Beginner→Gevorderd`, webvuln/exploitation `→Expert`.
- **Verborgen taak bleek anders dan de Stap 0-spec aannam:** `tutorial-renderer.js` heeft GÉÉN Expert-badge nodig. Difficulty wordt overal als platte tekst gerenderd (renderer r.61/85, tutorial-lijst r.61/89, certificate r.88/122); er is geen difficulty-gestuurde badge/kleur-CSS in de terminal (de `.level-badge`/`.command-level-*` horen bij homepage/commands-pagina). `Expert` rendert correct als tekst. Een badge bouwen = cargo-cult. Vastgelegd als geverifieerde NIET-wijziging.
- **De échte doorwerking zat in de funnel:** `next.js` — `buildFundamentalsTutorialStage()` als stage 0 (vóór de phase-1-grind); high-water-mark `hasAnyProgress` +1 hernummerd; **ook de subtiele `buildSkippedHint`-drempels** `0/1/3 → 1/2/4` (verborgen koppeling die de renummering blootlegt). `dashboard.js` `getNextStep` spiegelt (fundamentals-suggestie bovenaan, gegate op zero-progress). `certificate.js` `getDiscipline` + `tutorial.js` manpage (fundamentals + ontbrekende exploitation aangevuld, begin-tip → fundamentals).
- **Plan-afwijking voor correctheid:** bewust GEEN `fundamentals` in `tutorialOrder` (de overige-missies-catch-all ná fase 3) — zou een gevorderde gebruiker die fundamentals oversloeg later achterwaarts "doe fundamentals" tonen. Stage 0 + high-water dekt het correct.
- **E2E NEW `tests/e2e/fundamentals.spec.js`** (7 tests: briefing/Beginner, stap-advance, volledige 7-staps-completion, wrong-arg differentiated, lijst-fundamentals-first, her-tiering Gevorderd/Expert-assert, funnel fundamentals-suggestie).

**Verificatie:** fundamentals.spec 7/7 op chromium + 14/14 cross-browser (firefox+webkit); tutorial.spec 19/19 (geen regressie van difficulty-changes); dashboard.spec 8/8; **volledige chromium-suite groen** (186 passed, 5 skipped, 12 pre-existing flaky op retry, 0 failures). Render-en-meet (no-store server, Playwright MCP): difficulty-tekstkleur gemeten dark `rgb(201,209,217)` / light `rgb(10,10,10)` = standaard leesbare terminal-tekst (bewijst "geen badge nodig"); her-tiering exact gemeten (fundamentals=Beginner/7 · recon+privesc=Gevorderd · webvuln+exploitation=Expert, registratie-volgorde); 375px: 0 elementen buiten viewport. Screenshots dark/light/mobiel in `.playwright-mcp/`. validate-docs exit 0.

**Commits:** `3ac65aa` (feat(tutorial): fundamentals-scenario + her-tiering difficulty-labels (Fase B)), op `main`. **Nog niet gepusht** (push = Netlify-deploy; afwachten op go van Heisenberg).

**Learnings:**
- **De gespecde "verborgen taak" was de verkeerde verborgen taak.** Stap 0 vermoedde een Expert-badge in de renderer; exploratie toonde dat difficulty overal platte tekst is → geen badge nodig. De échte doorwerking zat een laag dieper in de progressie-funnel (`next.js` high-water + `buildSkippedHint`, `dashboard.js`-spiegel). Lees de code vóór je de gespecde taak uitvoert; de spec wijst de goede ríchting maar niet altijd de goede plek.
- **Renummeren legt verborgen index-koppelingen bloot.** Eén nieuwe stage op index 0 verschoof drie plekken: `stageBuilders[]`, `hasAnyProgress`-switch, én de makkelijk te missen `buildSkippedHint`-drempels (`>0/1/3`). Die laatste vergeten = een stille "nog X commando's over"-bug die geen test vangt.
- **Meet-instrument wantrouwen, deel 2 (locale-editie):** `du -sb src/ | awk '{print $1/1024}'` printte "640,823 KB" → leek 640 MB. NL-locale gebruikt komma als decimaalteken → het was 640.8 KB. `du -sh` (956K) was de sanity-check. Niet alleen theme-toggles, ook locale kan je meting vervalsen.
- **Bij spec-vs-engine-conflict: surface de keuze, beslis niet stilletjes af te wijken.** De spec zei "~5 gegroepeerd", de engine valideert per commando. 7-single is robuuster (dwingt elke skill af) maar wijkt af van de letterlijke spec → AskUserQuestion met previews i.p.v. eenzijdig kiezen of klakkeloos volgen.

**Next steps (open):** Fase A — deep-link-plumbing: `main.js` `?tutorial=<id>` laten lezen + auto-start; 3 leerpad-knoppen → `?tutorial=fundamentals/recon/exploitation`; cache-bump + E2E. Push Sessie 187 naar `main` (deploy) na go.

**Metrics delta:** src/ +8,2 KB (`fundamentals.js`); tests 197→**207** per browser-project (24 spec files, +`fundamentals.spec.js`). Geen runtime-/budget-impact buiten het scenario (Terminal Core ruim <400 KB).

---

## Sessie 186: Stap 0 ontwerpbeslissing — leerpad-niveaus → tutorial-scenario's (29 jun 2026)

**Mission:** Stap 0 van het backlog-item "Leerpad deep-link naar in-app tutorials" (vervolg op Sessie 185). Een ontwerpbeslissing, géén implementatie: een vastgelegde, beargumenteerde mapping van de 3 homepage-niveaus (BEGINNER/GEVORDERD/EXPERT) naar tutorial-scenario's, waarop Fase B later bouwt. Geen code/tutorial gebouwd.

**Aanpak (plan-mode):** Twee parallelle Explore-agents lazen (1) de échte scenario-inhoud — `tutorial-manager.js` + alle 4 scenario-bestanden, volledige stappenlijsten + commando's, níét alleen de labels — en (2) de homepage-leerpad-badges + het backlog-item + de Sessie 185-context. Cruciaal: de her-tiering rust op de werkelijke stap-inhoud en op de badge-*beschrijvingen*, niet op de historisch gegroeide `difficulty`-labels.

**Vastgestelde feiten (Explore):**
- 4 scenario's (`difficulty` in `src/tutorial/scenarios/<id>.js`, registratie `src/core/terminal.js:82-86`): recon (`Beginner`, ping→nmap→whois→traceroute), webvuln (`Beginner`, nmap→nikto→sqlmap→cat config), privesc (`Beginner`, cat passwd→ls log→cat auth.log→cat bash_history), exploitation (`Gevorderd`, nmap→hydra→metasploit→cat shadow→hashcat).
- Interne label-vocabulaire = alleen `Beginner`/`Gevorderd` (géén `Expert`). Géén fundamentals-scenario (ls/cd/pwd/cat). Géén URL-param-parsing in `main.js` (= Fase A, bestaat niet).

**Beslissings-tabel:**

| Niveau | Deep-link-doel (Fase A) | Ook in tier | Labelwijziging |
|---|---|---|---|
| BEGINNER | **fundamentals** (NIEUW) | — | nieuw `Beginner` |
| GEVORDERD | **recon** | privesc | recon + privesc: `Beginner→Gevorderd` |
| EXPERT | **exploitation** | webvuln | exploitation `Gevorderd→Expert`; webvuln `Beginner→Expert` |

**Rationale:** (1) Badge = contract; de badge-*beschrijving* is de maatstaf, niet de chips — chips zijn nergens een letterlijke inhoudsopgave (recon leert géén van zijn netcat/wireshark/hashcat-chips). (2) BEGINNER = "kun je überhaupt een terminal gebruiken" (géén security) → alles schuift één tier op (recon van Beginner naar Gevorderd). (3) Inhoud/skill bepaalt de tier, niet de commando-syntaxis (privesc = alleen cat/ls maar log-/credential-analyse → Gevorderd). (4) **webvuln → EXPERT:** sqlmap is dé headline-EXPERT-tool; een tier lager = EXPERT-tool in GEVORDERD-scenario = promise/payoff-leugen naar binnen verplaatst. (5) GEVORDERD-doel = recon (beschrijving "netwerken/scan poorten"), privesc secundair. (6) EXPERT-doel = exploitation (5-staps-vlaggenschip, dekt 2/3 EXPERT-chips), webvuln secundair.

**Twee expert-calls (gebruiker vroeg "wat raad jij aan, brutaal eerlijk" i.p.v. te kiezen):**
- **webvuln → EXPERT** (niet GEVORDERD). "Voelt intermediate" komt door sqlmap's tik-gemak (point-and-shoot), maar tik-gemak ≠ tier. Bijvangst: zo zijn álle EXPERT-badge-chips gedekt binnen de EXPERT-tier (metasploit+hydra in exploitation, sqlmap in webvuln).
- **fundamentals = navigatie + bestandsbeheer** (ls/cd/pwd/cat/mkdir/touch/rm, ~5 gegroepeerde stappen), **NIET** de volle 9 badge-chips. "Volledige badge-match" klinkt principieel maar houdt BEGINNER aan een striktere standaard dan GEVORDERD/EXPERT, waar de chips toegegeven illustratief zijn. De belofte-*zin* ("navigeren door mappen, bestanden lezen, en je eerste bestanden aanmaken en verwijderen") noemt whoami/history niet — die zitten alleen in de chips. Match de zin → optie 2.

**Spec NIEUW fundamentals-scenario (input Fase B):** id `fundamentals`, difficulty `Beginner`. ~5 gegroepeerde stappen: (1) `pwd`+`ls` oriëntatie, (2) `cd <map>`(+`ls`), (3) `cat <bestand>`, (4) `mkdir`+`touch`, (5) `rm`. Verhaaltje = security-bridge ("eerste dag als junior pentester; eerst je weg vinden op het systeem"), voltooiing bridge't naar recon. Volgt bestaande scenario-structuur (`command`/`mustHaveArgs`/3-tier `hints`/`[~]`-feedback, 80/20 NL).

**Labelwijzigingen (input Fase B):** `difficulty`-property in scenario-bestanden — recon Beginner→Gevorderd · privesc Beginner→Gevorderd · webvuln Beginner→Expert · exploitation Gevorderd→Expert · NIEUW fundamentals.js Beginner. **Aandachtspunt:** label-vocabulaire kent nu alleen `Beginner`/`Gevorderd` → controleer in `src/tutorial/tutorial-renderer.js` (en waar `difficulty` getoond/gestyled wordt) of een nieuwe `Expert`-waarde een badge-/kleur-variant nodig heeft. Dit is de verborgen taak die Stap 0 blootlegt: zonder ontwerpstap zou Fase B de strings omzetten en pas bij visuele test ontdekken dat de UI geen `Expert`-badge rendert.

**Deep-link-mapping (input Fase A):** BEGINNER-knop → `?tutorial=fundamentals` · GEVORDERD-knop → `?tutorial=recon` · EXPERT-knop → `?tutorial=exploitation`.

**Work done:** TASKS.md backlog-item — Stap 0 afgevinkt `[x]` + uitgewerkt sub-blok (tabel + 6 rationale-punten + fundamentals-spec + labelwijzigingen + deep-link-mapping). Fase B/A blijven `[ ]`. Doc-sync (TASKS header/footer/sprint/versie, current.md, CLAUDE.md learnings + counter + footer).

**Commits:** geen (doc-only sessie, nog niet gecommit op moment van /summary).

**Learnings:**
- **De badge-*beschrijving*, niet de chips, is de maatstaf voor tier-toewijzing.** Chips zijn overal illustratief (recon = GEVORDERD-doel maar leert géén van zijn chips). Wie fundamentals aan alle 9 chips bindt, hanteert inconsistente standaarden tussen tiers.
- **Inhoud/skill overstemt commando-syntaxis-moeilijkheid.** privesc (alleen cat/ls) is GEVORDERD om wat het léért, niet om hoe makkelijk het tikt — net zoals webvuln EXPERT is ondanks point-and-shoot sqlmap.
- **Stap 0's grootste waarde is niet de tabel maar de blootgelegde verborgen taak:** de her-tiering introduceert een derde label-waarde (`Expert`) die de codebase nog niet kent → Fase B moet de renderer checken. "B vóór A, Stap 0 vóór B" is daarom dwingend, niet ceremonieel.
- **Bij "wat raad jij aan, brutaal eerlijk" i.p.v. een keuze: beslis als expert met onderbouwing** (memory `feedback_expert_decisions`) — beide AskUserQuestion-vragen werden zo teruggekaatst en als expert beslist.

**Next steps (open):** Fase B (NEW fundamentals-scenario bouwen volgens spec + 4 labelwijzigingen + `tutorial-renderer.js` Expert-badge-check), daarna Fase A (URLSearchParams in `main.js` + 3 knoppen → `?tutorial=...` + cache-bump + E2E).

**Metrics delta:** geen (doc-only; bundle/tests ongewijzigd t.o.v. Sessie 185 — 23 E2E spec files, 175 `test()`-cases).

---

## Sessie 185: Leerpad-sectie homepage — van 3 nep-deuren naar een echt leerpad (29 jun 2026)

**Mission:** De homepage-leerpad-sectie (`#leerpad`, 3 kaarten BEGINNER/GEVORDERD/EXPERT) linkte met alle 3 de knoppen naar dezelfde `/terminal.html` — onbevredigend voor de bezoeker. Analyseren + perfectioneren, brutaal eerlijk.

**Diagnose (brutaal):** Drie deuren, één kamer. De knoppen (`Start`/`Verken`/`Beheers Leerpad`) verschilden in label en command-lijst maar niet in bestemming; "Leerpad" beloofde gestuurde progressie die achter de link niet bestond, en dupliceerde de 4 andere terminal-CTA's op de pagina (hero, "Start Simulator", how-it-works, finale CTA). De echte verspilling: de site bezit alle ingrediënten van een leerpad (13 blogposts, 40+ command-naslag, woordenlijst, in-app `tutorial`) maar de sectie linkte naar geen enkel daarvan — juist hier hoort de flow *lezen → oefenen*.

**Work done:**
- **Optie-afweging (plan-mode, AskUserQuestion):** content-enrichment (gekozen) vs. + deep-link-naar-tutorials vs. minimal-dedupe. Deep-linken bewust afgewezen: er is géén fundamentals-tutorial (ls/cd/cat), dus juist de BEGINNER-kaart (kerndoelgroep) kan nergens heen; tutorial→badge-mapping rommelig (recon/webvuln/privesc allemaal "Beginner", alleen `exploitation` "Gevorderd"). Bovendien landt een deep-link wéér in de terminal — de "ene kamer" die we juist proberen te diversifiëren. → eigen vervolgproject.
- **`index.html` (3 kaarten):** elke knop vervangen door een `.leerpad-cta-group` met (a) een NEW `.leerpad-learn-link` "Lees eerst"-link naar de niveau-passende bestaande blogpost — BEGINNER→`/blog/terminal-basics.html`, GEVORDERD→`/blog/nmap-beginnersgids.html`, EXPERT→`/blog/sql-injection-uitgelegd.html` — bóven (b) een eerlijk, **uniform** label "Oefen in de terminal" (was 3× misleidend "Leerpad"). Differentiatie zit nu in de bestemming. De-jargon: "Terminal voor beginners" i.p.v. "Terminal-basics". ASCII-pijl `-&gt;` (geen Unicode/emoji).
- **`styles/landing.css` (+25 regels):** `.leerpad-cta-group` (flex-kolom, `align-items:flex-start`, `gap:--spacing-sm`, `margin-top:auto` → pint het link+knop-paar onderaan zodat de paren over de 3 kaarten uitlijnen bij ongelijke beschrijvingslengtes); `.leerpad-learn-link` (klein, theme-aware via `--color-text-dim`/`--color-cta-primary`, geen hardcoded kleur, `:hover`/`:focus-visible` onderlijn-accent). Entrance-animatie + knop-hover ongemoeid.
- **Cache-bump** `landing.css?v=123→124` op beide refs (preload r.48 + stylesheet r.52) in `index.html`. HTML-edits zelf budgetloos.

**Commits:** `c49c1de` (CSS-fundering) + `9c8cfc6` (HTML-markup + copy + cache-bump) — 2 logische brokken, gepusht naar `main` (`e7edb89..9c8cfc6`).

**Verificatie (render-en-meet, no-store Python-server + Playwright):** 6 links resolven (3 blog HTTP 200 + 3 terminal); groep-tops alle 3 == 4058px en knop-tops == 4088px → `margin-top:auto` lijnt uit ondanks ongelijke beschrijvingen; 3-koloms desktop (card-lefts 32/440/849), 1-koloms ≤768px; dark link `#8b949e` (== kleur van de kaart-beschrijvingstekst, dus bewezen leesbaar) contrast 6,15:1 vs `#0d1117` (WCAG AA), light `#444444` op wit; 375px `scrollWidth` 360 ≤ 375 (geen overflow), langste link past binnen de kaart; animatie intact (3× `.visible`, opacity 1). Screenshots dark-desktop + light-mobiel visueel bevestigd.

**Learnings:**
- **Same-tick `getComputedStyle` ná `setAttribute('data-theme',…)` gaf stale kleur** (eerste dark-meting `#444444` = de light-waarde, niet de echte `#8b949e`). De tell was de *asymmetrie*: `--color-cta-primary` flipte wél bij dezelfde toggle, `--color-text-dim` niet. Inconsistentie wantrouwen i.p.v. de meting geloven → verse lezing in een aparte tool-call (aparte tick + paint) gaf de echte waarde. **Render-en-meet werkt alleen als je óók je meetinstrument wantrouwt.** (Bevestigt `feedback_blog_cta_unified`/Sessie 184-learning.)
- **Bij inconsistentie N-identiek vs. 1 echt verschil: verplaats de differentiatie naar de as die echt verschilt.** De 3 knoppen deden hetzelfde → maak ze identiek + eerlijk; laat de niveau-differentiatie leven in de content-link (die wél per kaart verschilt). Drie verschillende labels op één bestemming is een gebroken affordance.
- **"Interactiever = beter" is een cargo-cult-valkuil.** Deep-linken voelde ambitieuzer (raakt code) maar loste het verkeerde probleem op (de klacht was "geen content-bestemmingen", niet "te weinig interactie") én brak op de belangrijkste kaart. Code raken ≠ probleem raken.
- **`--color-text-dim` is `#8b949e` op `:root` (dark-first) en `#444444` onder `[data-theme="light"]`** — er is géén `[data-theme="dark"]`-blok; dark = de `:root`-defaults. Goed om te weten voor toekomstige dark-contrast-checks.

**Next steps (open):**
- **Deep-link-naar-tutorials als eigen project:** eerst een fundamentals-scenario (ls/cd/cat) bouwen zodat het BEGINNER-gat dicht is, dán URLSearchParams-handling in `main.js` + alle instappunten (homepage/blog/commands) consistent laten deep-linken, mét cache-strategie + E2E.
- Eventueel dezelfde "lees → oefen"-verrijking overwegen voor andere homepage-CTA-clusters (laag prioriteit).

**Metrics delta:** styles/ +~2 KB (`landing.css` leerpad-CTA-groep); src/ + blog/ + assets/ onveranderd. Tests onveranderd (23 spec files / 197 per browser-project — geen test toegevoegd/verwijderd). Geen runtime-/Terminal-Core-impact (alleen homepage-HTML/CSS).

---

## Sessie 184: Blog in-content CTA-boxen visueel geünificeerd (28 jun 2026)

**Mission:** De twee verschillend gestylede CTA-"boxen" in blogposts (gecentreerd met volledige rand vs. links uitgelijnd met blauwe linkerrand) uniform maken — Heisenberg vond de inconsistentie lelijk en ik had die eerder als "bewuste keuze" verdedigd. Heroverweging + correctie als design/UX/conversie-expert.

**Diagnose (de "intentioneel"-claim hield geen stand):**
- De blog heeft één consistente inline-aside-taal: **links uitgelijnd + linkerrand-accent** (`.blog-tip` groen, `.blog-warning` amber, `.blog-info` groen-check, én de product/lead-magnet-kaart `.blog-cta-product` blauw). De gecentreerde, volledige-rand `.blog-cta` was de **enige uitzondering** in het hele blog-content-systeem — dus niet de "linkse" boxen waren afwijkers, maar de gecentreerde.
- Gecentreerde meerregelige bodytekst (de plain CTA-paragraaf wrapt 3 regels) is een leesbaarheids-antipatroon.
- Het promo-vs-navigatie-onderscheid via *vorm* voegde visuele ruis toe voor marginaal nut; copy + knoplabel dragen dat onderscheid al.
- Telling-correctie: de eerdere "5 plain + 2 product per post" was opgeblazen doordat `grep "blog-cta"` ook `.blog-cta-button` telt; de echte DOM heeft per post ~1 plain navigatie-CTA + 2 product-kaarten.

**Work done (`97b1c8a`, alleen `styles/blog.css` + 14× cache-bump):**
- `.blog-cta`: `text-align: center` → `left`; `border-left: 3px solid var(--color-ui-primary)` toegevoegd (blauw in dark).
- `[data-theme='light'] .blog-cta`: dat blok herzet `border: 1px` (zou de accent in light naar grijs terugzetten) → `border-left: 3px solid var(--color-link)` toegevoegd. **Kritiek:** `--color-ui-primary` is blauw in dark (#58a6ff) maar **groen** in light (#0db34f) — zonder deze override zou de accent in light groen worden = palet-schending. Spiegelt de bestaande product-kaart-override.
- `.blog-cta-product`: uitlijning + accent zijn nu in de base → geslankt tot enkel `h3 { font-size: 1.4rem }` (kleinere h3 voor langere producttitels); redundante `border-left`/`text-align`/light-override verwijderd. Netto −4 regels CSS. Product/lead-magnet-kaarten blijven visueel ongewijzigd; alleen de plain navigatie-CTA convergeert op hen.
- Cache-bump `blog.css?v=120 → ?v=121` over alle 14 blog-HTML-bestanden (scripted, 14× vervangen / 0× rest).

**Verificatie (render-en-meet, no-store server):** dark + light + mobiel 375px. `getComputedStyle`: plain == product (beide `text-align:left`, `border-left 3px`, dark `#58a6ff`). Light-accent settelt op `#0969da` (blauw, géén groen) + drie-zijde hairline `#e0e0e0`. Geen horizontale overflow (`scrollWidth` 360 ≤ 375). Cross-check `wachtwoord-beveiliging.html`: alle 3 CTA's uniform. Visueel bevestigd in 3 screenshots.

**Commits:** `97b1c8a` (feat(blog): unificeer in-content CTA-boxen), op `main`, gepusht.

**Learnings:**
- **Cargo-cult-consistentie, omgekeerd toegepast:** bij een inconsistentie tussen N-1 elementen en 1 outlier is de fix meestal de outlier naar de meerderheid trekken, niet andersom. De gecentreerde CTA leek "de standaard" maar was de uitzondering op de blog-brede aside-taal. Identificeer de heersende vocabulaire vóór je kiest welke kant convergeert.
- **CSS-variabelen kunnen themisch van *tint* wisselen, niet alleen van helderheid.** `--color-ui-primary` flipt blauw→groen tussen dark en light. Elke accent die die var gebruikt, heeft een light-override nodig of lekt groen het blog-palet in (`feedback_blog_palette_no_green`). De product-kaart had dit al opgelost; ik moest die oplossing generaliseren.
- **Een "variant"-klasse die alleen bestaat om van de base te verschillen, collapse't als je besluit dat de base de variant moet wórden.** `.blog-cta-product` kromp van 3 regels naar 1. Netto werd de CSS kleiner, niet groter.
- **Same-tick `getComputedStyle` ná een `setAttribute('data-theme',…)` gaf een stale kleur** (`#58a6ff` i.p.v. `#0969da`); een verse lezing ná de style-recalc gaf de juiste waarde. Meet theme-toggles altijd ná recalc, anders jaag je op een spookbug.
- **Telmethode-valkuil:** `grep "blog-cta"` overtelt door de `.blog-cta-button`-substring. Tel containers met een `:not(...)`-DOM-query, niet met een substring-grep.

**Next steps:** Geen openstaande items uit deze sessie. De `.blog-cta`-knop staat nu links (volgt de uitlijning) — consistent met de product-kaarten; geen verdere actie.

**Metrics delta:** `styles/blog.css` netto −4 regels (geünificeerd); geen runtime-bundle-impact (blog = SEO/content-pijler, budgetloos). Tests/bundle ongewijzigd t.o.v. Sessie 183.

---

## Sessie 183: Lead-magnet conversie/UX + dark-mode zichtbaarheid + copy-feitencontrole (28 jun 2026)

**Mission:** De sample-pentest lead-magnet en de nieuwsbrief-oppervlakken verbeteren: copy kloppend met de echte PDF's, het signup-formulier zichtbaar maken als conversiepaneel, en het systemische "dark-surface == pagina"-euvel site-breed opruimen — palet-conform.

**Work done:**
- **sample-pentest copy (`c6b1247`/`82c77a8`/`90463c4`):** belofte-inversie weg — hero/form-intro "direct in je inbox" → "meteen te downloaden" (de instant on-page-download is het écht directe pad; de inbox is dubbel-opt-in-gepoort) + 6 blog-CTA's. Feitfouten in de 3 "Wat zit er in deze sample?"-kaarten + hero-bullets, getoetst tegen de echte 9-pagina sample-PDF: "Fase 0: Reconnaissance" → Fase 0 = Voorbereiding (reconnaissance is Fase 1); "nmap-vlaggen cheatsheet" bestaat niet (echte commands whois/dig/ping/traceroute); "beslisboom Fase 0→1" bestaat niet → "De 6 fasen van een pentest". De-jargon OSINT/reconnaissance → NL "verkenning" (matcht `woordenlijst.html:697`-gloss). Kaart-iconen op betekenis: schild=toestemming, magnifier=verkennen, list=stappenplan (eerst layers → botste met over-ons "Overweldigend"). 12 blog-CTA's + meta/og/JSON-LD "Fase 0 reconnaissance"-mislabel gecorrigeerd.
- **cross-sell tegen volledige 19-pagina Playbook-PDF (`f73ec50`):** "command-templates" bestond niet → "een rapport-template en een overzicht van alle commands" (gids heeft finding/rapport-template p14-16 + commands-snelreferentie p17-18); "beslisbomen" mv → 1 (p8); "Sla het formulier over" geschrapt — élke frictie-framing onjuist want de Gumroad-aankoop vraagt óók e-mail → value-led; "snelreferentie" → "overzicht" (beter NL). Zelfde fix op `sample-download.html`.
- **conversie/UX signup-kaart (`f6efd46`):** kaart in dark onzichtbaar — bg `var(--color-bg-terminal)` #0d1117 == pagina, 1px hairline, geen schaduw; input+kaart+pagina 3× dezelfde kleur. Fix: `background: var(--color-bg-modal)` (#161b22) + `box-shadow: var(--shadow-elevation-2)` + groene accent-rand/gloed (sample = main-site, groen mag) → kaart popt, donkere input popt vanzelf. Zichtbaar `<label>E-mailadres`. Hero `flex`→CSS-grid (named areas), gescoped op nieuwe `.sample-hero-content--lead`-modifier (want `.sample-hero-content` wordt gedeeld met `sample-download` tekst+cover) → mobiel komt het formulier nu vóór de bullets; `landing.css?v=122`.
- **dark-surface-audit + nieuwsbrief-oppervlakken (`6dac1bc`/`6024594`/`05b6500`):** grep-script vond het patroon "light gefixt, dark vergeten" (`[data-theme=light]` met elevated bg vs dark-basis = pagina). Homepage-band `.homepage-newsletter` (`main.css?v=152`, alleen contrast-bg #161b22; full-bleed → geen kaart-rand) + blog-`.newsletter-signup`-kaart. **Palet-correctie:** eerst per ongeluk groene sample-treatment op de blog-kaart → teruggedraaid naar neutraal (blog gebruikt blauw, géén groen; geheugen `feedback_blog_palette_no_green`). 4 blog-informatiekaarten (`.blog-post-card`/`.blog-cta`/`.related-card`/`.blog-support-banner`) gelift naar `--color-bg-modal` — hun `--shadow-elevation-1` is een zwarte schaduw die op #0d1117 onzichtbaar is, dus de bedoelde elevatie rendert niet in dark; oppervlak-contrast herstelt 'm. `blog.css?v=120` over alle 14 blog-pagina's (sed-bump). Modals bewust gelaten (zweven boven dim-overlay); terminal/pre/input/terminal-education = intentioneel.

**Commits:** `c6b1247` (belofte-inversie) · `82c77a8` (feitfouten kaarten + de-jargon) · `90463c4` (kaart-3 icoon layers→list) · `f73ec50` (cross-sell claims vs 19p-PDF) · `f6efd46` (signup conversiepaneel) · `6dac1bc` (homepage-band + blog-kaart zichtbaar) · `6024594` (blog-kaart de-greened) · `05b6500` (4 blog-info-kaarten gelift). Alle op `main`, gepusht.

**Learnings:**
- **Belofte-inversie:** copy moet de écht directe actie vooropstellen (instant on-page download), niet het gevoelsmatig-directe-maar-gepoorte pad (inbox/dubbel-opt-in). Zelfde anti-pattern als Sessie 178.
- **Als copy zich blijft verzetten tegen correctheid, ligt het een laag dieper.** Drie iteraties op dezelfde cross-sell-zin (wachtmail→wachten→formulier) liepen telkens vast op onnauwkeurigheid — signaal dat de *premisse* onwaar was (gratis sample = obstakel, terwijl het alternatief óók e-mail vraagt). Laat de frictie-framing los, leid met waarde.
- **Kloppende copy vereist het artefact lezen, niet oude copy herschrijven.** 3× bleek een mooie zin feitelijk onjuist tot ik de sample- + 19-pagina-PDF zelf las.
- **Elevatie in dark mode = lichter oppervlak, niet schaduw.** `--shadow-elevation-1` (zwart, 40%) is op een #0d1117-pagina vrijwel onzichtbaar. De audit-tabel zei "heeft border+schaduw → ok"; je moet narekenen of die schaduw zíchtbaar is. Lichter oppervlak (`--color-bg-modal`) is het enige middel dat in dark werkt.
- **Grep wie een gedeelde klasse gebruikt vóór je 'm herschrijft.** `.sample-hero-content` (flex→grid) bleek gedeeld met `sample-download` (tekst+cover) → grid had die pagina gesloopt; scope op een `--lead`-modifier.
- **De blog heeft een eigen palet** (blauw, geen groen); main-site gebruikt groen. Een main-site-treatment hergebruiken op de blog = kleur-check vooraf, anders maakt "consistent maken" juist inconsistent (cargo-cult). Geheugen `feedback_blog_palette_no_green`.
- **Niet elke "dark == pagina"-treffer is een bug:** modals zweven boven een dim-overlay (de modal is juist lichter dan z'n verdonkerde omgeving); terminal/pre/input zijn intentioneel pagina-donker. Context (schaduw zichtbaar? overlay aanwezig?) bepaalt of het een gap is.

**Next steps:** Modals (legal/feedback/command-search) optioneel liften naar oppervlak-contrast (laag-prioriteit, overlay dekt het al). Blog-knop blauw vs homepage-nieuwsbrief-knop groen — pre-existerende CTA-kleur-quirk, niet aangeraakt.

**Metrics delta:** styles/ 385→392 KB (landing.css grid/elevatie + blog.css edits), src/ ongewijzigd (geen JS), blog/ ~413. Geen tests geraakt (UI/copy/CSS-polish). Cache-bumps: landing.css 121→122, main.css 151→152 (index), blog.css 117/119→120 (14 blog-pagina's). Nieuw geheugen `feedback_blog_palette_no_green`.

---

## Sessie 182: Live zoekfilter + design-uitlijning woordenlijst ↔ commands (27 jun 2026)

**Mission:** De twee naslagpagina's (`commands/index.html` + `woordenlijst.html`) tot één coherente, doorzoekbare set maken: echte zoekfilter, uitgelijnde sticky balk, en gedeelde categorie-stijl.

**Work done:**
- **Gedeelde filter-module (commit `aa5cad1` + `24d2bc0`):** NEW `src/ui/term-filter.js` — herbruikbare live-filter + scroll-spy, config-gedreven (`sectionSel`/`itemSel`/`navSel`/`inputSel`/… + `itemNoun` voor de teller-tekst). Twee dunne wrappers: `glossary-filter.js` (herschreven van self-contained → import) en `commands-filter.js` (vervangt het **verwijderde** `commands-scrollspy.js` — scroll-spy zit nu in de kern).
- **Woordenlijst-zoekfilter (`aa5cad1`):** sticky balk met zoekveld dat `.glossary-term`-kaarten live filtert op `textContent` (term + definitie → "wachtwoord" vindt *Brute Force*), lege categorieën meeverbergt, teller ("X van 56 termen") + lege-staat met wis-knop. "Ctrl+F"-tip in de intro vervangen. Inline CSS → geen cache-bump.
- **Commands-backport (`24d2bc0`):** zoekveld + teller + lege-staat in de bestaande sticky "filter-balk" (nu eindelijk een echt filter); `commands.css?v=116`. Mobiele nav-fix: `margin:0; min-width:0` zodat de chips-`overflow-x:auto` aangrijpt i.p.v. de pagina te verbreden.
- **Sticky-balk uitlijning (`3af5f53`):** balk-inner kreeg identiek box-model als `.page-section` (horizontale padding van de full-bleed-buitenkant → inner, behoud `max-width` + `margin:0 auto`) → zoekveld en cards vallen op élke breedte samen (gemeten `delta 0` op 1600/1280/375px; was 32px scheef >1400px + 4px mobiel-goot). `commands.css?v=117`.
- **Categorie-intro's woordenlijst (`5e3c5e6`):** 5× korte oriëntatie-zin (`.glossary-category-intro`, links-uitgelijnd, max-width 75ch), elke zin getoetst tegen de echte term-lijst van die categorie. Staan binnen `.glossary-category` → verbergen gratis mee met een lege categorie.
- **Commands-koppen → woordenlijst-stijl (`9795c58`):** `.commands-category h2` van gecentreerd/wit → links/groen/`font-heading 1.3rem` + groene onderlijn-divider (+ `[data-theme="light"]`-override naar de licht-groene variant); intro `.commands-category > p` → links/75ch i.p.v. gecentreerd/700px. `commands.css?v=118`. Card-chrome + hero's bewust ongemoeid.

**Commits:** `aa5cad1` (woordenlijst filter + term-filter) · `24d2bc0` (commands backport) · `3af5f53` (balk-uitlijning) · `5e3c5e6` (categorie-intro's) · `9795c58` (commands-koppen). Alle op `main`, gepusht.

**Learnings:**
- **Flexbox auto-margin overflow-val:** `margin: 0 auto` op een flex-item schakelt `align-items: stretch` uit → het kind sized op z'n min/max-content i.p.v. te klemmen, waardoor `overflow-x:auto` niet aangrijpt en de pagina verbreedt (gemeten: commands-nav 484px duwde de 375px-viewport naar 496px). De fout zat in een geërfde desktop-regel die pas giftig werd ná het herparenten in een flex-kolom. Fix: `margin:0; min-width:0` op het flex-item.
- **`max-width` mét vs zónder padding geeft verschillende content-randen.** De balk-inner (max-width 1400, padding op de buitenkant) reikte tot 1400; `.page-section` (zelfde max-width, 32px padding binnenin) tot 1336 → 32px scheef zodra de viewport > max-width. Twee elementen met *identiek* box-model kunnen niet meer uiteenlopen. CSS lezen ("beide 1400") is niet genoeg — reken het box-model per rand uit.
- **Cargo-cult-consistentie = vorm kopiëren ≠ intentie.** Twee keer dezelfde redenering, twee kanten op: de woordenlijst nam de *gecentreerde* commands-intro NIET over (links past beter bij een lookup-pagina); de commands-kop nam juist de *links-uitgelijnde* glossary-stijl wél over. De juiste consistentie zit in wat de pagina's gemeen hebben (scanbare naslag), niet in de opmaak.
- **Herbruikbaar = kern-module + dunne per-pagina wrappers.** Door de filter-logica config-gedreven te maken (selectors + `itemNoun`) werd de tweede consument (commands) een mechanische kopie i.p.v. ~150 regels duplicatie.
- **Meet de échte staat, niet een test-artefact.** De scroll-spy "faalde" eerst (las "Netwerk" bij Security) — oorzaak was `scroll-behavior: smooth` waardoor de IntersectionObserver tussenposities van de lopende animatie las, niet de code. Instant-scroll via berekende posities bewees correct gedrag. Bijna onterecht aan de code toegeschreven.

**Metrics delta:** src/ → 646 KB (3 nieuwe JS-modules term-filter/glossary-filter/commands-filter; -1 commands-scrollspy). styles/ → 401 KB (commands.css +~3 KB). E2E ongewijzigd (23 spec files; geen tests geraakt — UI-polish, niet command-gedrag). Cache-bumps: `commands.css` 115→118 (3 bumps over de sessie); woordenlijst inline → geen bump.

**Next steps:** Optioneel card-chrome harmoniseren (radius 12 vs 16px, hover lift+neutrale rand vs groene rand) — bewust uitgesteld, lage zichtbare winst; cards zijn in rust al ~90% gelijk.

## Sessie 181: Content-getallen drift-bestendig + blog-table-stacked + over-ons-copy (26 jun 2026)

**Mission:** Bezoeker-zichtbare harde getallen die met de content meegroeien (aantal blogs/commands) drift-bestendig maken; plus twee voorafgaande UX/copy-fixes uit dezelfde sessie-cyclus vastleggen.

**Work done:**
- **Drift-fix (commit `ea379a2`, 3 files, +43/-4):**
  - `gidsen.html` stat-grid: `10` Blog posts → `12+`, `41` Commands → `40+` (open floors i.p.v. exacte tellingen; sluit aan op de bestaande `105+`/`50+`/`40+`-conventie elders op de site). Pure HTML-tekst → geen cache-bump.
  - `PLANNING.md`: twee stale `10 posts` → `12` (canonieke telling = `blog/*.html` minus index+welkom == TASKS.md-SSOT 12/12 + validate-docs Check 6b).
  - `scripts/validate-docs.sh`: NEW `--deep` Check 6c — floor-asserties `geclaimd ≤ ground-truth` voor gidsen Blog posts (vs filesystem `blog_count`), gidsen Commands (vs `grep -c '\.register(' src/main.js` = 41) en woordenlijst Termen (vs `<dt>`-count = 56). Robuust: nooit vals alarm bij groei; negatief getest (99+ → exit 1).
  - **Bewust ongemoeid (geverifieerd correct):** CLAUDE.md "12 posts" (canoniek) en JSON-LD `numberOfItems:39` (== 39 zichtbare command-rijen; "40+" = totaal 41). De inventaris-subagent vlagde beide als bug — beide vals-positief.
- **Blog-table-stacked (commits `3530e07` + `a9006e3`):** de 4 brede blog-datatabellen (nmap/hashcat/wachtwoord/wireshark) van Sessie-176 `overflow-x:auto`-scroll → opt-in `.blog-table--stacked` (rij = gelabelde kaart via `data-label`+`::before` op `@media≤768px`; thead clip-verborgen, `role="table"`+`scope="col"` voor a11y). `blog.css?v=116→117` op 14 blogpagina's. Conventie vastgelegd in `.claude/rules/architecture-patterns.md`.
- **Over-ons-copy (commit `83c130d`):** hero-subtitle "Daarom bouwen we" → "Daarom is HackSimulator.nl een..." (doorlopende "bezig"-tijd ondermijnde een live product); sample-CTA-kop "Wil je zien wat ik bouw?" → "Zo bereid je je eerste pentest voor" (kop↔payload-mismatch weg); meta "bouwen" → "bestaat". Inline HTML, geen cache-bump. "bouwde ik" (voltooid founder-verhaal) bewust behouden.

**Commits:** `83c130d` (over-ons copy) · `3530e07` (blog-table stacked) · `a9006e3` (rule-doc) · `ea379a2` (drift-fix). Alle op `main`, gepusht.

**Learnings:**
- **Floors verouderen netjes, exacte getallen niet.** Het echte probleem was niet "te veel getallen" — de site gebruikte al grotendeels floors. Drift zat in de paar plekken met exacte tellingen voor groeiende content. Een floor is waar zolang `geclaimd ≤ werkelijk`; bij groei (content alleen toegevoegd) blijft hij waar.
- **Verifieer drift-claims tegen de canonieke definitie, niet tegen een oppervlakkige telling.** De inventaris-subagent gaf 2 vals-positieven (CLAUDE "12"→"13", JSON-LD 39→41); beide "fixes" hadden drift/inconsistentie geïntroduceerd. Canonieke telbron = `validate-docs.sh` Check 6b + TASKS.md-SSOT (12).
- **Floor-assertie maakt de forcing function triviaal én robuust.** `geclaimd ≤ ground-truth` geeft nooit vals alarm bij groei — alleen bij overclaim. De alternatief-valkuil (exact-match-validator over elk cijfer) zou het onderhoudsprobleem terugbrengen.
- **Render-en-meet ook voor 2-teken-tekstedits:** mobiel 360px gemeten — `12+/40+/22/105+`, geen overflow, niets afgekapt; screenshot bevestigd. `+`-suffix-rendering was al bewezen door de bestaande `105+`.

**Metrics delta:** drift-commit +43/-4 (3 files), bundle-impact ≈ 0; blog-table +43 regels `blog.css`. E2E ongewijzigd (23 spec files / 197 tests via `--list`; geen tests toegevoegd of geraakt).

**Next steps:** Geen open items uit deze sessie. Buiten scope gehouden (eerlijk benoemd): test-/CSS-var-/bundle-getallen in docs (live metrics → TASKS.md-flow); vaste artefacten (PDF-pagina's/badges/skill-levels, laag drift-risico).

---

## Sessie 180: Blog-auteurschap → merk (Organization); persoonsnaam alleen op over-ons (25 jun 2026)

**Mission:** Strategische vraag van Heisenberg — is het verstandig dat zijn volledige juridische naam als auteur op alle 13 blogposts staat? Analyse als expert, dan uitvoeren.

**Eerlijke add-then-remove (binnen één sessie):**
- **Eerste richting (op verkeerde premisse):** op basis van "ik wil bekendheid onder mijn eigen naam via LinkedIn" → naam *versterkt* in de working tree: byline klikbaar naar /over-ons (`rel="author"`), JSON-LD `author.Person` + `jobTitle` + `sameAs` LinkedIn op 13 posts, over-ons-founder idem, LinkedIn-knop-URL gecorrigeerd (`janwillemwubkes` → `jwwubkes`). Nog niet gecommit.
- **Premisse-correctie:** Heisenberg verhelderde dat het delen op LinkedIn dient om het **product** te promoten, niet voor persoonlijke bekendheid. Daarmee valt de rechtvaardiging voor de naam-broadcast weg.
- **Tweede richting (definitief):** blog-helft van de versterking teruggedraaid in de working tree → **merk-auteurschap**; persoonsnaam alleen nog op over-ons (die versterking + URL-fix blijven — juist gewenst op de about-pagina). Alleen het netto-resultaat is gecommit in `80f0297` (blogs gede-personaliseerd, over-ons versterkt).

**Work done:**
- **13 `blog/*.html`** (scripted sweep, literal block-match + per-bestand `count==1`-assert): `article:author` meta → `HackSimulator.nl`; JSON-LD `author` Person → `{"@type":"Organization","name":"HackSimulator.nl","url":"https://hacksimulator.nl/"}` (== publisher); zichtbare byline-regel **verwijderd** (`datum · leestijd · categorie` blijft, `:after`-pipe-separators herschikken vanzelf, geen CSS nodig).
- **`over-ons.html`** ongewijzigd in de reversal — behoudt naam, bio, LinkedIn-knop (`/in/jwwubkes/`) + founder-`Person` (`jobTitle`+`sameAs`). Bewust de enige plek voor de identiteit.
- **Niet aangeraakt:** `privacy.html` ("beheerd door een individuele ontwikkelaar" — noemt de naam al niet, dus geen GDPR-conflict); GitHub-URL's (structureel repo-eigenaarschap); README/docs (dev-only); `meta name=author` (al merk).

**Verificatie:** eind-asserties (0× naam/LinkedIn in blogs, 13× Organization-author + merk-`article:author`, 0 bylines); JSON-LD parse-validatie (echte parser, 14 bestanden, 0 ongeldig); no-store-server + Playwright render-en-meet (meta-bar zonder byline, pipes correct, dark/light/mobiel 375px, over-ons naam + werkende LinkedIn-knop intact); pre-commit hooks (incl. blog-JSON-LD + SEO-metadata-sync) groen.

**Commit:** `80f0297` (14 files: 13 blogs gede-personaliseerd + over-ons versterking/URL-fix).

**Learnings:**
- **Auteurschaps-oppervlak ≠ promotie-doel.** Las je juridische naam niet als schema-auteur op elke geïndexeerde pagina tenzij persoonlijk merk een *expliciet* doel is. De 13-posts-broadcast is het SEO-versterkte, permanente, "eerste-wat-iemand-vindt"-oppervlak; de about-pagina (1 verwachte pagina) is dat niet.
- **Beslis op het juiste doel.** De eerste richting was coherent met de verkeerde premisse; toen het echte doel (productpromotie) bovenkwam, viel de rechtvaardiging weg. Premisse verifiëren > snel uitvoeren.
- **Anonimiteit vereist een dreigingsmodel, geen onderbuik.** Volledig gezichtsloos gaan is schijnveiligheid zolang de GitHub-repo-URL de naam draagt + de eigenaar zelf onder eigen naam promoot. Brand-byline + één eerlijke about-pagina = de juiste balans voor een site die producten verkoopt (vertrouwensanker).
- **E-E-A-T ≠ juridische naam.** Organisatie-auteurschap is Google-conform voor een product/tool-site; author==publisher is gangbaar.
- **Scripted sweep met literal block-match + `count==1`-guard** > blinde global replace; sluit af met eind-assertie + echte JSON-LD-parser.

**Next steps:** geen open items. Optioneel toekomstig: als Heisenberg ooit volledige anonimiteit wil om een specifieke dreiging → GitHub-repo hernoemen/transfer (breekt links/stars/history; aparte ingreep).

**Metrics delta:** geen runtime-bundle-impact (inline HTML/JSON-LD-edits in blog/ + over-ons; geen CSS/JS, geen cache-bump). Blog-content-pijler blijft 13 posts.

