# Sessie-archief 200-204 - HackSimulator.nl

**Geroteerd uit `current.md` bij Sessie 215** (steady-state `N % 5`-rotatie, zie
`docs/sessions/README.md` §Rotatie-regel). Nieuwste-eerst binnen dit blok.

> Correctie t.o.v. de rotatienotitie in `.claude/CLAUDE.md`, die "archiveer 205-209"
> aangaf: dat zou 200-204 als oudere entries in `current.md` laten staan én een gat in de
> archiefreeks maken. De README-regel — "sessies ouder dan de laatste ~10" — geeft 200-204.

---

## Sessie 204: Box-omlijning brak op tussenbreedtes — root-cause fix (31 jul 2026)

**Mission:** Heisenberg meldde (2 foto-screenshots, herhaald aangekaart issue) dat de box-omlijning in de terminal nog steeds breekt op bepaalde schermen — de "VOLGENDE STAP"-box van `next` met wrappende randen en content door de rechterrand. Opdracht: perfecte analyse + fix-advies; plan goedgekeurd en uitgevoerd.

**Work done:**
- **Root cause 0 (dominant, nieuw ontdekt):** de inline base64-embed van 'JetBrains Mono Box' (box-glyphs U+2500-257F) in `styles/main.css:18` was **corrupt sinds Sessie 83** — exact 2 tekens afwijkend van het valide `styles/fonts/jetbrains-mono-box-subset.woff2` (b64-posities 154 en 6350), brotli-decompressie faalde, `FontFace.status === 'error'` (live op productie bevestigd vóór de fix). Alle box-glyphs renderden via OS-fallback-fonts met per-OS/per-glyph afwijkende advances (`━` ≠ `─` ≠ `M`); een borderregel is één ononderbroken glyph-run zonder breekpunten → wrapt als eerste, per machine anders. Verklaart retroactief het Sessie 81/82 Android-uitlijnprobleem (waarvoor `boxText()` mobiel borderless werd). Fix: herembed via `base64 -w0` van de disk-subset (600/1000-advance voor alle 128 glyphs — identiek aan JetBrains Mono latin).
- **Contract-unificatie** `src/utils/asciiBox.js`: rendertte `width + 2` tekens totaal terwijl `getResponsiveBoxWidth()` een totale breedte teruggeeft en alle handgerolde boxen (`next.js`, `dashboard.js`, …) `inner = width - 2` doen → de 5 SECURITY WARNING-boxen + `man`-boxHeader waren 2 chars te breed (veiligheidsmarge opgegeten). Nu totaal == `width` in `createBox` + `createLightBox`; `help.js:180` handmatige `width - 2`-compensatie verwijderd.
- **Meting op het juiste element** `src/utils/box-utils.js`: mat `#terminal-container` — dat erft **Inter** (`--font-body`, proportioneel!) terwijl de tekst in `#terminal-output` rendert (`--font-terminal`, mono), en de 12px webkit-scrollbar zat niet in de berekening. De Inter-M-mismeting *onderschatte* de capaciteit ~35% en redde brede desktops toevallig — maar instabiel per font-laadmoment. Nu: meet `#terminal-output` (juiste font + `clientWidth` excl. eigen scrollbar), `charWidth = max(measureText('M'), '─', '━')` (canvas respecteert unicode-range → meet de echte subset-advance; de max had déze hele bug gevangen).
- **`scrollbar-gutter: stable`** op `#terminal-output` (`styles/terminal.css`): clientWidth gelijk vóór/ná verschijnen van de scrollbar.
- **Test-gat gedicht** `tests/e2e/responsive-ascii-boxes.spec.js`: de `scrollWidth <= clientWidth`-assertie kon door `overflow-x:hidden` + `pre-wrap` nooit falen (structureel vals-groen) en `document.fonts.check()` geeft true óók bij status 'error' (gemeten — zo bleef de corrupte font 120 sessies onzichtbaar). Nu: wrap-detector per `.terminal-line` op **element-hoogte > 1.5× line-height** + max-right-check, NEW describe "Tussenliggende breedtes" @ 800/900/1024/1100 (terminal eerst vullen → scrollbar zichtbaar → commands vers renderen), font-assert via `fonts.load` + `status === 'loaded'`. Verouderde 32/40/48/56-char header-comment + ongebruikte `expectedWidth`-velden opgeruimd.
- `?v=` bump: `main.css` 153→154 + `terminal.css` 117→118 over alle HTML-refs; `.claude/skills/verify-terminal/SKILL.md` bijgewerkt (width-contract + hoogte-gebaseerde wrap-detector).

**Commits:** `418d0da` (35 files) — gepusht + Netlify-deploy live geverifieerd. **Committed context zelfde dag, andere conversatie (niet dit werk):** `69c7eb2` flakiness + bundle-limiet 1000→1050, `cb00326` tracker.js dubbele-init-guard.

**Learnings:**
- Twee corrupte tekens in een 6936-char base64-string = hele woff2 onbruikbaar (brotli is niet fout-tolerant), maar `@font-face` faalt stíl naar een visueel bijna-identieke fallback. Elke test die "renderen de box-tekens?" vroeg zag ze gewoon — alleen metrisch nét verkeerd. Verifieer font-embeds tegen het bronbestand (byte-diff) en assert `fonts.load`+status, nooit `fonts.check`.
- Een accidentele mismeting kan een structurele bug maskeren: de Inter-M-onderschatting hield desktops toevallig binnen de marge. Fix-volgorde was daarom bindend: font → contract → meting; "correct" meten zonder de eerdere fixes had de boxen juist óp de rand gezet.
- Wrap-detectie: rect-`top`-vergelijking én `rects.length` zijn beide vals-positief bij inline spans — `marker-arrow` heeft `vertical-align: .2em` (3.6px @ 18px) waardoor rects op één visuele regel verschillende tops hebben (gemeten: 11 vals-positieven). Element-hoogte > 1.5× line-height is immuun (echte wrap verdubbelt de hoogte). Rood-op-mutant bewezen (kunstmatig 30-chars-te-brede regel gevangen).
- Resize-scenario gereproduceerd = vrijwel zeker de screenshots: output gerenderd @ 1440px wrapt 68/68 na versmalling naar 800px; vers command daarna: 0/12 wraps. Bewust geaccepteerd (echte terminals reflowen ook niet) — test-consequentie: na viewport-resize altijd het command opnieuw uitvoeren, nooit oude output meten.
- Sessienummer-ambiguïteit: een eerdere zelfde-dag-conversatie labelde haar werk al "Sessie 204" in TASKS.md maar rondde `/summary` nooit af (geen current.md-entry, counter bleef 203). Beslist: deze sessie = 204, eerder werk als committed context gelogd (Sessie 200-protocol: niet claimen).

**Next steps:** geen open items uit deze sessie. Bestaande open Heisenberg-acties (Postmaster re-check, GEO-checklist §5) ongewijzigd.

**Metrics delta:** src/ 675→677 KB (+2 KB contract/meting-comments), styles/ 396 KB gelijk (font-b64 zelfde lengte, +25 bytes gutter), spec-files 28→29 (was al 29 door zelfde-dag-context), tests +4 (tussenbreedte-describe). Chromium-suite 242 passed / 5 skipped / 1 flaky (tutorial-gestures, ongerelateerd).

---

## Sessie 203: GEO/AEO — vindbaarheid in AI-zoekmachines (31 jul 2026)

**Mission:** Heisenberg: "Ik wil hoog in de AI zoekresultaten komen met dit project. Analyseer hoe ik dit moet doen en zorg dat dit gebeurt." Doel: HackSimulator.nl citeerbaar maken voor ChatGPT, Perplexity, Google AI Overviews en Claude (GEO/AEO).

**Analyse (Explore-agent + webresearch juli 2026):** Klassieke SEO-basis sterk (canonicals, OG/Twitter-pariteit, BreadcrumbList, Article+Person op alle 14 posts, git-accurate sitemap), maar nul GEO-voorziening: geen llms.txt, geen AI-crawler-beleid, DefinedTermSet dekte 5 van 56 woordenlijst-termen, geen HowTo/WebApplication-schema. Onderzoek: llms.txt ~10% adoptie (nog onderscheidend, laag risico); AI Overviews citeert ~97% uit organische top-20 (bestaande SEO = fundament); ChatGPT-retrieval draait op Bing; Perplexity weegt freshness ~40% en leunt op Reddit; Claude citeert gestructureerde pagina's ~30% vaker.

**Work done (commit `202c8eb`, 9 bestanden, gepusht + live geverifieerd):**
- **NEW `llms.txt`** (llmstxt.org-spec): H1 + blockquote-missie + NL-alinea + korte EN-note, secties Kernpagina's/Blog (14 posts met 1-regel-beschrijving uit echte meta-descriptions)/Over. Alle 20 URL's tegen het filesystem geverifieerd. Netlify serveert root-`.txt` as-is.
- **`robots.txt`**: expliciete AI-crawler-stanza (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, CCBot, meta-externalagent, Applebot-Extended) als gedeelde multi-UA-groep. Cruciaal: een specifieke UA-stanza overschrijft de wildcard vólledig (RFC 9309) → de 4 Disallows (/node_modules/ /tests/ /playwright-report/ /docs/) herhaald in de AI-groep.
- **`index.html` FAQPage JSON-LD**: de 8 FAQ-vragen stonden al zichtbaar op de homepage (regel 541+) zónder schema — goedkoopste grote win van de hele analyse. Antwoorden verbatim uit de zichtbare `<p>`'s, alleen HTML-tags gestript.
- **`woordenlijst.html` DefinedTermSet 5→56**: scriptmatig gegenereerd (scratchpad-Python parseert `glossary-term`-blokken: `<dt>`-naam + `<dd>`-beschrijving, links/tags gestript) i.p.v. 56 objecten met de hand — geen typo's, herhaalbaar bij term-wijzigingen.
- **`scripts/validate-docs.sh` DefinedTerm-lockstep-check** (naast bestaande `term_count` regel 370): `"@type": "DefinedTerm"`-count moet exact gelijk zijn aan zichtbare `<dt>`-count. Rood-op-mutant bewezen (55≠56 faalt), groen op echt bestand.
- **`terminal.html` WebApplication-schema**: EducationalApplication, browser-based, gratis (price 0 EUR), isAccessibleForFree.
- **HowTo-schema op 2 posts**: wireshark (5-staps "Aan de slag"-`<ol>`) + metasploit (7-staps exploit-workflow-`<ol>`), steps verbatim. nmap/hashcat/sql-injection bewust géén HowTo: hun lijsten zijn alternatieven/uitleg, geen stappen — fake-HowTo schaadt.
- **`docs/seo-launch-checklist.md` NEW §5 GEO/AEO**: in-repo-status + platform-citatiegedrag + Heisenberg-acties (Bing Webmaster, herindexering GSC/Bing 4 pagina's, freshness-cadans, externe vermeldingen nuchter, ~1 mnd controle: AI-engines zelf vragen of HackSimulator geciteerd wordt).

**Bewust geschrapt (proportionaliteit):** llms-full.txt (drift-gevoelig, marginale waarde bij 14 posts); aparte veelgestelde-vragen.html (nav/footer JS-injected met noscript-fallbacks in ~24 files — index-schema levert hetzelfde AEO-voordeel voor ~1/20e van de kosten, evt. fase 2); answer-first-herschrijvingen (steekproef: posts openen al met directe definities na "Wat is X?"-koppen).

**Learnings:**
- De goedkoopste GEO-win zat in bestaande zichtbare content zonder schema (homepage-FAQ) — audit eerst wat er ál staat vóór je nieuwe content plant. De Plan-agent-vondst "8 zichtbare FAQ's zonder FAQPage" herframede de hele scope (aparte FAQ-pagina → overbodig).
- Schema-bij-zichtbare-content hoort verbatim + lockstep-bewaakt: FAQ-antwoorden letterlijk gekopieerd, DefinedTerm scriptmatig uit de markup gegenereerd, en de count-check in validate-docs.sh maakt drift onmogelijk. Zelfde discipline als de blog-titel-7-locaties-lockstep.
- robots.txt-valkuil: een specifieke User-agent-groep erft níéts van de wildcard — wie alleen `Allow: /` in een AI-stanza zet, opent per ongeluk /docs/ voor die crawlers. Multi-UA-groep (12 agents, 1 regelset) is compact én RFC 9309-correct.
- On-page GEO maakt je *citeerbaar*, niet *gekozen* — dat doen autoriteit en externe vermeldingen (Perplexity: Reddit ~47% van topcitaties). De eerlijke verwachting staat zo in checklist-§5; de zwaarste hefboom is een Heisenberg-actie, geen code.
- Deploy-verificatie hoort bij "zorg dat dit gebeurt": eerste curl gaf 404 (Netlify nog bezig), achtergrond-recheck na 90s bewees llms.txt 200 + nieuwe robots.txt live.

**Metrics delta:** blog 447→456 KB (+9: 2× HowTo-blok), src/styles ongewijzigd; geen nieuwe pagina's/tests; validate-docs.sh +1 deep-check (DefinedTerm-lockstep); bundle-marker geüpdatet naar Sessie 203-meting.

**Next steps:** Heisenberg-acties in `docs/seo-launch-checklist.md` §5 (Bing Webmaster, herindexering, externe vermeldingen, controle na ~1 mnd). Evt. fase 2: dedicated FAQ-pagina als hub.

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

## Sessie 202 — learnings (geroteerd uit CLAUDE.md, Sessie 208)

**Sessie 202:** Mobiele kolom-uitlijning + box-truncatie in terminal-output (28 jul 2026)
⚠️ **Never:**
- Een gemelde layout-bug fixen zonder de gedeelde util erachter te checken — de reset-menu-collapse was één symptoom; de hoogste-waarde-bug (`asciiBox.wrap()` kápte *waarschuwingstekst* af met `...` in álle 5 SECURITY WARNING-boxen op mobiel) zat in de util die de gemelde commands voeden, niet in de gemelde output. Grep de callers (`boxText`/`lightBoxText`) vóór je concludeert dat het één command is.
- Een fix in de draaiende app verifiëren als de module relatief-geïmporteerd is zónder `?v=` — geen build-stap + `asciiBox.js` zonder cache-bust → de browser serveerde de oude versie (in-app render toonde nog `...`). `import('/src/…?cb='+Date.now())` in `browser_evaluate` raakt het bestand-op-schijf en draait het échte codepad (Sessie 200-techniek).
- Elke regel in een box blind woord-wrappen — `wordWrap` collapse't leidende + uitlijn-spaties, wat desktop-inspringing sloopt. Alléén regels die de breedte *overschrijden* herwrappen; passende regels verbatim → geen desktop-regressie.
- Een twee-koloms-menu "redden" met alleen hanging-indent — `data-indent` lijnt continuatie uit, maar de beschrijving blijft als sibling-item lezen (precies de screenshot). Echte fix = stapelen met diepere indent + blank-line-groepering.

✅ **Always:**
- Onderscheid "echt kapot" van "degradeert acceptabel" — reset-menu (twee zware kolommen) = kapot; `label ← glosse` met ≥3 leidende spaties wordt al door de hanging-indent gered → ongemoeid (`metasploit`/`hydra`). Proportioneel, geen sweep-om-de-sweep ([[feedback_proportional_effort_hobby]]).
- Een crash-footgun fixen óók als 'ie onbereikbaar is, mits goedkoop — box-titel-`RangeError` (`horizontal.repeat(negatief)` bij titel > boxbreedte) is prod-onbereikbaar (man/help vertakken op `isMobileView()` → desktop-only), maar 1 regel `label.slice(0, width)` zet crash → graceful. Crash ≫ cosmetisch.
- Beslis als expert i.p.v. optiemenu bij techniek — systemische renderer-reflow-heuristiek verworpen (ASCII-art/code-blokken/authentieke tool-output hebben óók multi-spaties die je niet mag herschikken; Sessie 196: bevries aan de bron, filter niet de output) → gerichte per-output-fixes. Scope-omvang wél aan Heisenberg gevraagd (dat is een product-keuze) ([[feedback_expert_decisions]]).
- Meet mobiel objectief — Playwright 375px: `overflowCount` via `scrollWidth>clientWidth`, page-scroll via `scrollX`/`bodyScrollW`, box-randuitlijning via `[...new Set(rows.map(r=>r.length))]` (alle regels exact `width+2`). Niet op het oog.

---

## Sessie 204 — learnings (geroteerd uit CLAUDE.md, Sessie 212)

**Sessie 204:** Box-omlijning brak op tussenbreedtes — corrupte box-font + meetfouten (31 jul 2026)
⚠️ **Never:**
- `document.fonts.check()` als bewijs dat een font laadt — geeft true óók bij `FontFace.status === 'error'` (gemeten); zo bleef de corrupte inline 'JetBrains Mono Box'-embed **120 sessies** (sinds Sessie 83) onzichtbaar terwijl alle box-glyphs via OS-fallbacks met afwijkende advances renderden. Assert `fonts.load(...)` + `status === 'loaded'`.
- `scrollWidth <= clientWidth` als overflow-assert op `#terminal-output` — `overflow-x:hidden` + `pre-wrap` laat te brede regels wrappen, nooit scrollen → de check kan structureel niet falen (vals-groen op precies deze bug-klasse).
- Rect-`top`-vergelijking of `rects.length` als visuele wrap-detector — inline spans (`marker-arrow` heeft `vertical-align:.2em` = 3.6px) verschuiven rects op één visuele regel → 11 gemeten vals-positieven. Element-hoogte > 1.5× line-height is immuun (echte wrap verdubbelt de hoogte); rood-op-mutant bewezen.
- Een meting "correct maken" vóór de bovenliggende bugs gefixt zijn — de Inter-op-container-mismeting *onderschatte* de kolomcapaciteit ~35% en redde brede desktops toevallig; eerst correct meten had de boxen juist óp de rand gezet. Fix-volgorde was bindend: font → breedte-contract → meting.

✅ **Always:**
- Font-embeds byte-diffen tegen het bronbestand — 2 corrupte b64-chars in 6936 maakten de hele woff2 onbruikbaar (brotli is niet fout-tolerant), maar `@font-face` faalt stíl naar een visueel bijna-identieke fallback; alleen de metriek verraadt het. Borderregels (één ononderbroken glyph-run zonder breekpunten) wrappen dan als eerste, per machine anders.
- Meet op het element waar de tekst écht rendert — `#terminal-container` erft `--font-body` (Inter); `#terminal-output` heeft `--font-terminal` én `clientWidth` exclusief de eigen scrollbar. Plus `charWidth = max(measureText('M'), '─', '━')`: canvas respecteert `@font-face` unicode-range, dus dit meet de echte subset-advance — die max had deze hele bug gevangen.
- Oude output die na venster-resize breekt = by-design (echte terminals reflowen ook niet; gereproduceerd: 68/68 wraps oud, 0/12 vers) — test-consequentie: na viewport-resize het command opnieuw uitvoeren, nooit oude output meten.
- Sessienummer-ambiguïteit (eerdere zelfde-dag-context labelde "Sessie 204" in TASKS.md maar rondde `/summary` nooit af): nummer overnemen + dat werk als committed context loggen, niet claimen (Sessie 200-protocol) en niet hernummeren.

---
