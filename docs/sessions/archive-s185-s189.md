# Sessie-archief s185–s189

**Rol:** Range-archief (geroteerd uit `current.md` bij Sessie 200, `N%5`-rotatie).
**Ordening:** nieuwste-eerst (189 → 185). Zie `README.md` voor de conventie.

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
