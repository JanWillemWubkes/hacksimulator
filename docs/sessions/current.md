# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

---

## Sessie 202: Mobiele kolom-uitlijning + box-truncatie in terminal-output (28 jul 2026)

**Mission:** Gebruiker (screenshot terminal, 375px): het `reset`-tutorial-exit-menu ("[→] Wat wil je doen?" met commando + beschrijving) brak lelijk af — de twee kolommen vielen onder elkaar zodat elke beschrijving als een los menu-item las. Verzoek: "analyseer hoe en waar dit voorkomt site wide. ik wil dit perfect hebben." Scope-keuze Heisenberg: **alle live output** (reset-menu + security-tool-uitvoer); **man-pages buiten scope** (referentie achter expliciet `man`, traditioneel breed).

**Root cause:** `#terminal-output` gebruikt `white-space: pre-wrap` (`styles/terminal.css`). Regels breder dan de viewport (~30 tekens op mobiel; `getResponsiveBoxWidth()` klemt op min. 30) breken af op hun interne spaties → elke fixed-width twee-koloms-tabel (`kolom1` + opvul-spaties + `kolom2`) klapt in elkaar. De bestaande `data-indent` hanging-indent (`renderer.js` → `mobile.css`) redt alléén *continuatie*-regels, niet een twee-koloms-layout. De codebase had het juiste patroon al: commando's die `box-utils.js` gebruiken vertakken op `isMobileView()` en renderen gestapeld (`next.js` `buildMobileBox`/`buildDesktopBox`, `tutorial.js`, `dashboard.js`, `leaderboard.js` `renderListMobile`). De kapotte output omzeilde die helpers met hardcoded opvul-spaties.

**Work done (commit `fe27a17`, 4 bestanden, gepusht naar `main`):**
- **`reset.js`** (de screenshot): twee-koloms-menu → gestapeld (commando op eigen regel, beschrijving 2 spaties dieper eronder, lege regel tussen groepen). Bewust géén per-regel `→`-marker: `    → tutorial start exploitation` = 33 tekens en overschreed de ~30-char mobiele breedte; zonder arrow = 31 en het commando overleeft (of wrapt netjes met hanging-indent). Leest goed op mobiel én desktop → geen `isMobileView()`-vertakking nodig.
- **`nikto.js`**: "Ontbrekende headers"-tabel gestapeld (`header` + ingesprongen `→ beschrijving`); "Forces HTTPS"→"Dwingt HTTPS af" (de-Dunglish, rest van de tabel was al NL). **+ 2 echte bugs**: `+ Start Time: …}+ Server:` en `…seconds)+ 1 host(s)` plakten twee output-regels aaneen zónder `\n`.
- **`hashcat.js`**: 2 lange kolom-0-regels met `←`-glosse (`[*] Detecting hash type… ← …`, `Speed.#1…: X MH/s ← …`) → glosse op eigen ingesprongen regel; de basis-statusregels passen nu.
- **`asciiBox.js`** (de échte reikwijdte-vondst): box-`wrap()` in beide varianten (zwaar + licht) **woord-wrapt** te brede regels via de bestaande `wordWrap()` i.p.v. af te kappen met `...`. De 5 SECURITY WARNING-boxen (`boxText(warningContent, 'SECURITY WARNING')` in metasploit/nikto/sqlmap/hydra/hashcat) kápten waarschuwings-/gebruikstekst af op mobiel — niet alleen hydra's `(SSH brute force)`. Cruciaal: alléén regels die de breedte *overschrijden* worden geherwrapt; passende regels blijven verbatim → desktop-rendering + bewuste inspringing ongewijzigd. Sluit de in TASKS #47 Fase 1c gevlagde "mobiele legal-box-truncatie".
- **Box-titel-guard**: `label.slice(0, width)` als de titel breder is dan de box → geen `RangeError` meer bij `horizontal.repeat(negatief)`. Latent (onbereikbaar in prod: beide titel-callers `man.js`/`help.js` vertakken op `isMobileView()` naar platte tekst; op desktop is de box breed), maar een crash ≫ cosmetisch, dus goedkope guard.
- **Bewust ongemoeid**: `metasploit.js:69-71` + `hydra.js:161-162` `label ← glosse`-regels beginnen al met ≥3 spaties → hanging-indent grijpt al aan (degraderen acceptabel). Authentieke nikto-scan-regels (`+ label: value`) blijven voor 80/20-realisme.

**Learnings:**
- De screenshot was één symptoom van een klasse: fixed-width kolommen vs `pre-wrap`. De hoogste-waarde-vondst (box-truncatie die *waarschuwingstekst* wegkapt) zat níét in de gemelde output maar in de gedeelde `asciiBox`-util die de gemelde security-tools voeden — breed kijken loonde.
- **Verificatie-techniek voor een cache-geblokkeerde module:** er is geen build-stap en `asciiBox.js` wordt relatief geïmporteerd zónder `?v=`, dus de browser serveerde de gecachte oude versie (in-app render toonde nog `...`). Oplossing: `import('/src/utils/asciiBox.js?cb=' + Date.now())` in `browser_evaluate` → draait de échte `boxText()`/`wordWrap()` op het bestand-op-schijf. Bewees: geen ellipsis, alle regels exact `width+2` (randen uitgelijnd), content behouden, desktop verbatim, titel-guard crasht niet. (Sessie 200-techniek: meet het codepad direct, niet via de UI-heuristiek.)
- **Beslissing als expert i.p.v. optiemenu:** systemische renderer-reflow-heuristiek verworpen (ASCII-art/code-blokken/authentieke tool-output hebben óók multi-spaties die je niet mag herschikken; Sessie 196: "bevries de state aan de bron, filter niet de output") → gerichte per-output-fixes. De box-titel-crash wél gefixt ondanks onbereikbaarheid, want de kosten-baten (2 regels vs crash-footgun) is duidelijk.

**Verificatie:** Playwright echte `fill`+`Enter` op 375px + desktop 1280px; `overflowCount: 0` over de hele output, geen horizontale page-scroll; reset-menu + nikto + hashcat schoon; desktop geen regressie; `git diff` collateral-scan: 4 bestanden, alleen bedoelde output-strings, geen man-pages/logica. Screenshots `.playwright-mcp/reset-menu-{mobile,desktop}-fixed.png`.

**Deploy-noot:** live na het gebruikelijke ~1u Netlify-cachevenster (sub-modules relatief geïmporteerd zonder `?v=`; een `?v=`-bump op `main.js` bust ze niet). Direct live = Netlify "Clear cache and deploy site".

**Next steps:** geen open items uit deze sessie. (Optioneel toekomstig: een `?v=`-strategie voor sub-modules zodat sub-module-fixes niet ~1u op de cache wachten — pre-existing deploy-karakteristiek, geen bug.)

**Metrics delta:** 4 bestanden, +51/-22 regels; geen test-count-wijziging (28 spec files / 213 test-defs); bundle-KB-delta verwaarloosbaar (tekst-in-template-literals).

---

## Follow-up (27 jul 2026): Tutorial continuation-inspringing 6→4 spaties

**Mission:** Gebruiker (screenshot terminal, fundamentals-tutorial): "de inspringing die je ziet — is die bewust?" De vervolgregels van `[~]`/`[!]`-feedback sprongen 6 spaties in, 2 tekens voorbij de 4-brede marker.

**Diagnose:** Bewust (hand-authored hanging indent), maar dubbel functioneel én net niet strak: (1) visueel hangend onder de tip; (2) **load-bearing** — de renderer (`src/ui/renderer.js:513` `isContinuationLine`) kleurt vervolgregels met `≥3` leidende spaties door met de kleur van de marker-regel (`lastSemanticType`). 6 spaties lijnde echter niet uit onder de marker-tekst (kolom 4), maar 2 tekens ernaast.

**Fix (commit `6423f0c`, gepusht):** Uniform 6→4 spaties over alle 5 scenario-bestanden (64 continuations), zodat elke vervolgregel — doorgelopen zin, opsomming, genummerde lijst, codeblok — exact uitlijnt onder de marker-tekst. 4 blijft ruim boven de `≥3`-drempel, dus kleur-inheritance intact.

**Verificatie:** scope vooraf bewezen (geen `[TIP]`-6-brede ouders; alle 64 exact 6 spaties) → één transform i.p.v. 64 oordelen; 64 inserts/64 deletes + `git diff -w` leeg (puur whitespace); idempotent (2e pass = 0); `node --check` alle 5 modules OK; kleur-drempel geverifieerd met exacte renderer-logica; `mobile.css` leest `data-indent` generiek (`calc(...*1ch)`) → mobiele hanging indent volgt automatisch.

**Learning:** de ondergrens (4, boven de `≥3`-drempel) was net zo belangrijk als de bovengrens (uitlijnen op de 4-brede marker) — naar 2 spaties zou alle 64 continuations stilletjes hun dim-kleur hebben gekost. De inspringing is een renderer-signaal, geen kosmetiek.

**Scope-noot:** lichte log-entry op verzoek — geen sessie-teller-ophoging (blijft 201), geen CLAUDE.md-rotatie, geen TASKS.md-wijziging. Git-historie (`6423f0c`) is zelf-documenterend.

---

## Sessie 201: Koppen sitebreed naar Nederlands zinskapitaal i.p.v. Engelse Title Case (26 jul 2026)

**Mission:** Gebruiker (screenshot van `blog/metasploit-beginnersgids.html`): "sommige woorden in de titel beginnen met hoofdletters, andere niet — kan je dit analyseren en perfectioneren?" Diagnose: de site gebruikte Engelse Title Case (elk inhoudswoord een hoofdletter), én inconsistent toegepast ("Payloads: Wat Gebeurt er Na de Exploit?" — "er" klein). Correct voor het Nederlands = zinskapitaal (alleen 1e woord + eigennamen). Scope-keuze Heisenberg: hele site + zuiver zinskapitaal (ook Engelse vaktermen klein tenzij eigennaam).

**Aanpak:** 2 Explore-audits (blogs + niet-blogs) telden ~340 Title-Case-koppen. Omdat de omzetting oordeelsgevoelig is (eigennamen-whitelist per kop) maar mechanisch van omvang, koos ik voor één zorgvuldig Python-script (`sentence_case.py`, scratchpad) + grondige dry-run-review per bestand, i.p.v. ~340 handmatige edits. Het script raakt alleen kop-contexten: `<title>`, og/twitter:title, JSON-LD `headline`/breadcrumb-`name`, `<h1-4>` (incl. genest `<a>`/`<abbr>`), zichtbare breadcrumb `<li aria-current>`.

**Work done (commit `65c5f18`, 27 bestanden, 518/518 gebalanceerde regel-vervangingen):**
- **15 blogs** incl. `blog/index.html`-kaarten (in lockstep met elke artikeltitel).
- **8 hoofdpagina's:** index, terminal, gidsen, over-ons, woordenlijst, contact, 404, commands/index.
- **3 juridische pagina's:** cookies, privacy, terms (~102 koppen).
- **1 JS-modalkop:** `src/ui/legal.js:56` "Juridische Kennisgeving" → "Juridische kennisgeving" (handmatig).
- **+typofix:** `terms.html:301` "Scheibaarheid" → "Scheidbaarheid" (severability-clausule; bevestigd door de paragraaftekst).
- **Titel-cluster (7 plekken per blog-artikel):** `<title>`, og:title, twitter:title, JSON-LD `headline`, BreadcrumbList `name` (pos 3), `<h1>`, en de kaart in `blog/index.html` — allen synchroon zodat gestructureerde data niet van de zichtbare kop divergeert.

**Transformatie-regels (in het script gecodeerd):** eerste woord + eigennamen hoofdletter; na `:` klein (NL-conventie); na `?`/`!`/`.`-met-spatie = nieuwe zin (hoofdletter); afkortingen ("vs."/"art.") starten géén valse zin; sectienummers met punt ("2.1"/"1.") kapitaliseren het volgende woord, kardinale getallen ("5 essentiële") niet; hyphen-bewust (IT-kennis, in-band); `<code>`-inhoud letterlijk (nmap-vlag `-sV`). Whitelist behoudt: merken (Metasploit/Nmap/Wireshark/OWASP **Top 10**), nationaliteitsadjectieven (Nederlandse/Engelse — NL houdt hoofdletter), landen (Nederland), camelCase-API's (localStorage/sessionStorage), acroniemen (TCP/WAF/GDPR/SMS/SQL/CTF), juridische afk. (Sr, III), toets-notatie (Ctrl+C). Post-fixes voor meerwoord-productnamen (Pentest Playbook, Starter Kit, Google Analytics/AdSense, Plausible Analytics). Bewust overgeslagen (skip): OWASP-categorieën A01–A10, certificeringsnamen (CEH/OSCP/eJPT-expansies), CompTIA/PenTest+, en enkelvoudige lowercase-command-koppen (`<h2>nmap</h2>` op de commands-pagina).

**Learnings:**
- **Script > handwerk voor bulk-transform-met-whitelist — mits masking.** Twee bugs doken pas op de niet-blog-pagina's op: (1) `woordenlijst.html` heeft letterlijk `<h3>` in een CSS-comment ("de categorie-`<h3>` erachter") → de `<h[1-4]>`-regex liep zonder sluit-tag door tot de échte `</h1>` en verminkte het hele style-blok + de JSON-LD; (2) `commands/index.html` heeft command-namen als koppen (`<h2>nmap</h2>`). Fix: `<style>`/`<script>` maskeren vóór de heading-regex draait (JSON-LD apart met string-patronen verwerken), plus enkel-lowercase-woord-koppen skippen. Blogs misten dit omdat ze geen inline-`<style>` hadden — de gevaarlijkste bug verstopt zich in de bestandsklasse die je het laatst test.
- **Iteratieve dry-run-review is de kern van de methode.** Elke batch onthulde randgevallen die een blinde `sed` zou hebben gemist: "Nederland"→"nederland" (landennaam), "IT-kennis"→"it-kennis" (acroniem-in-compound), "vs."→valse-zin-grens, "-sV"→"-sv" (code-inhoud), "5 Essentiële" (getal-first), "localStorage"→"localstorage". Elk gefixt vóór het schrijven.
- **Idempotentie als verificatie.** Tweede pass over alle 26 bestanden = 0 wijzigingen → bewijst consistentie én dat niets is gemist. Aangevuld met `git diff` collateral-scan (leeg), browser-render van de gemelde pagina, en de pre-commit blog-JSON-LD/tag-balans-hook (groen).
- **518 inserts / 518 deletes = puur tekst-casing, 0 structuur** — een sterke integriteitsindicator bij een grote diff.

**Bewuste keuzes (aan Heisenberg gemeld):** "Filesystem commands" e.d. (welkom-blog + commands-pagina) óók kleingeschreven — consistenter met zuiver zinskapitaal dan de "niet aanraken"-noot uit mijn plan. "Probeer het Metasploit command" kreeg merk-hoofdletter (was lowercase command); aangeboden om terug te draaien indien gewenst.

**Commit (gepusht naar `main`):** `65c5f18` (style(koppen): sitebreed Nederlands zinskapitaal i.p.v. Engelse Title Case).

**Metrics delta:** ~0 KB net (tekst-casing, geen byte-significante wijziging; blog-KB-marker binnen tolerantie, validate-docs Check 6 groen) | 28 spec files / 213 tests ongewijzigd (geen test-wijziging; geen runtime-gedrag geraakt) | 1 commit. NEW memory `feedback_dutch_sentence_case_headings`.

**Next steps (open, Heisenberg):** ongewijzigd t.o.v. Sessie 199-200 — `docs/launch-checklist.md` afwerken → launch wo 29 juli; ná launch item #45 (value-prop/retentie) op echte funnel-data; item #46 GA4-launch-dag-handelingen. Optioneel: "Probeer het Metasploit command" terug naar lowercase indien gewenst.

---

## Sessie 200: Command-output-audit (item #47) afgerond — Fase 3 triviale correctheid-nits (26 jul 2026)

**Mission:** Gebruiker: "voer Fase 3 uit: drie triviale correctheid-nits, in één commit naar main." Fase 3 is het laatste blok van item #47 (command-output-audit), dat eerder op 26 jul in losse werkblokken liep. Deze conversatie deed uitsluitend Fase 3 + de /summary.

**Context — waar Fase 3 op sluit:** item #47 kwam voort uit de metasploit-command-cleanup (`f56d886`) en werd uitgerold in 3 fases (roadmap `ebc86c8`): Fase 1 = security-cluster sqlmap/hydra/hashcat/nikto (`f65c93d`), Fase 2 = meta-funnel next/shortcuts/onboarding/help (`0a256ad`), Fase 3 = deze triviale nits. Fase 1+2 landden eerder dezelfde dag (aparte context); dit logboek beschrijft ze als committed context, niet als eigen werk.

**Work done (Fase 3, commit `e31075b`):**
- `src/commands/filesystem/cp.js:47` — `[TIP] De bronbestand bestaat niet.` → `Het bronbestand` (onzijdig; sloot interne inconsistentie met `mv.js:61` dat het al goed deed).
- `src/commands/system/certificates.js` — `kopieren` → `kopiëren` (ontbrekend trema), `replace_all`. Een `grep -rn "kopieren" src/` vooraf bewees exact 2 voorkomens, beide in dit bestand (`:95` manPage, `:158` execute-output) → file-scoped `replace_all` kon niet over-reachen.
- `src/commands/network/nmap.js` — onvertaald "attack surface" → "aanvalsoppervlak" op 2 user-facing regels (`:160` scan-TIP, `:234` manPage), onzijdig "minimaal" (niet "minimale"), de term die de manPage op `:220` zelf al als glosse gebruikt.
- **Bewust NIET aangeraakt:** `nmap.js:53` (code-comment, niet user-facing) + `:162`/`:235` ("meer ingangen voor aanvallers" hoort bij het veel-poorten/slecht-geval, ander register).

**Verificatie:** `node --check` op de 3 bestanden (schoon). Browser-driving via directe ES-module-import op een lokale http-server i.p.v. de typewriter/consent-UI: `cp.execute(['bestaat-niet.txt','x'], {}, {vfs})` met een stub-`vfs.copy` die "No such file" gooit (bevestigt cp:47-TIP), `nmap.execute(['secure-server.local'], {}, {})` → de single-443-tak (bevestigt de :160-TIP met "minimaal aanvalsoppervlak"), + `nmap.manPage`/`certs.manPage`-regex (bevestigt :234 en :95 incl. correcte `ë`-UTF-8). `certificates.js:158` is challenge-gated → code-inspectie volstond (dezelfde `replace_all` dekte het, grep = 0 residu). Diff = exact 5 regels in/uit, geen collateral.

**Commit (gepusht naar `main`):** `e31075b` (fix(output): drie correctheid-nits, item #47 Fase 3).

**Learnings:**
- **Directe module-import als testinstrument omzeilt de UI-ceremonie.** De command-modules exporteren een object met `execute`/`manPage`; via `import()` in de browser + stubs (vfs) of een passende target (`secure-*` → 443-only) exercise je het échte codepad zonder de typewriter, consent-modal of FocusTrap te doorlopen. Precies het soort meting waar de sessie-learnings herhaaldelijk voor pleiten (meet het gedrag, niet de scherm-heuristiek).
- **`replace_all` is veilig juist omdat de grep vooraf de reikwijdte bewees.** Exact 2 treffers, beide in één bestand — zonder die grep zou een file-scoped replace-all een gok zijn.
- **Faithful attribution in het sessielog.** Deze conversatie deed alleen Fase 3; Fase 1+2 + metasploit-cleanup staan als committed context, niet als geclaimd werk. De git-historie + commit-messages leggen hun detail al vast (protocol: her-leid niet wat de repo al registreert).

**Metrics delta:** src/ 673→671 KB (afronding; Fase 3 = ~0 KB net, 5 char-regels) | styles/blog/assets ongewijzigd (394/447/1030 KB) | 28 spec files / 213 tests ongewijzigd (geen test-wijziging) | 1 commit. Item #47 nu volledig ✅.

**Next steps (open, Heisenberg):** ongewijzigd t.o.v. Sessie 199 — `docs/launch-checklist.md` afwerken → launch wo 29 juli; ná launch item #45 (value-prop/retentie) op echte funnel-data; item #46 GA4-launch-dag-handelingen.

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

