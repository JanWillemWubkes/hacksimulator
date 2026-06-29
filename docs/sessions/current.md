# Sessie Logs - HackSimulator.nl

**Doel:** Gedetailleerde logs van development sessies (gescheiden van CLAUDE.md)

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

---

## Sessie 179: Klantgerichte copy-perfectionering — footer-tagline + hero-subtitle + "authentiek"-sweep (25 jun 2026)

**Mission:** Heisenberg vond de footer-regel "voor absolute beginners" te kort door de bocht (de site is óók voor enthousiastelingen). Analyse → herschrijven; in vervolgvragen uitgebreid naar de hero-subtitle en daarna een repo-brede consistentie-sweep van het afgekeurde woord "authentieke commands".

**Work done:**
- **Footer-tagline** (`src/components/footer.js`): "perfect voor absolute beginners" → "van je eerste command tot security tools". Cache-bump `init-components.js?v=2`→`v=3` + `footer.js?v=2`→`v=3`-import, gepropageerd naar 24 HTML-pagina's (footer wordt via `injectFooter()` dynamisch geïnjecteerd → twee cache-lagen). Commit `0b67fec` (21 files).
- **Hero-subtitle** (`index.html`): "Voor Nederlandse studenten en overstappers die cybersecurity willen leren zonder hun PC te riskeren. 40+ authentieke commands, direct in je browser." → "Oefen ethisch hacken met 40+ commands uit de praktijk en Nederlandse uitleg — in een veilige simulatie waar je alles kunt uitproberen zonder echte gevolgen." H1 bewust ongewijzigd (SEO-alignment met `<title>`/OG).
- **"authentieke commands" → "commands uit de praktijk"** op alle 9 user-facing plekken: og/twitter-meta (`index.html` + `terminal.html`), feature-card-h3 + stat-label (`index.html`), 3 blogposts (`blog/index.html`, `blog/ethisch-hacker-worden.html`, `blog/welkom.html`). Hero + authentiek samen in commit `8a81de8` (5 content-files). Beide commits gepusht naar `main`.
- Geen cache-bump op de content-edits (HTML-only tekst); footer-edit wél (gerenderde JS-output).

**Bewust ongemoeid:** `blog/welkom.html:180` "Authentieke ervaring" (andere betekenis — beleving voelt echt, verdedigbaar) · `terminal.html:293` "studenten, overstappers en iedereen die nieuwsgierig is" (al inclusief, geen plafond) · interne docs (PLANNING/README/style-guide/sessions/prd) historisch/niet-user-facing.

**Learnings:**
- **Toegankelijkheid = vloer, geen plafond.** Demografische labels ("absolute beginners", "studenten en overstappers") bakenen het publiek af en sluiten enthousiastelingen uit. Frame de *instap* ("van je eerste command tot...") i.p.v. het *publiek* — sluit niemand uit en is feitelijk waar (ls/cd → security tools). De footer was zelfs smaller dan de hero, dus verbreden vergrootte de consistentie.
- **Een geruststelling moet letterlijk waar zijn.** Eerste concept-veiligheidsclaim "los van je eigen computer en het echte internet" was onwaar — de simulator draait op de machine van de gebruiker via internet. De échte veiligheid zit in de *gesimuleerde uitvoering* (echte command-syntax, nagebootste resultaten) → "zonder echte gevolgen". Verifieer copy tegen de fysieke werkelijkheid, niet tegen wat lekker klinkt (product-kwaliteitsregel).
- **Homonym-valkuil bij replace.** "authentiek" droeg twee claims: "authentieke *commands*" (afgekeurd) vs "authentieke *ervaring*/voelt authentiek" (legitiem 80/20-principe). Eerst inventariseren + per-treffer op betekenis categoriseren, dán pas vervangen — een blinde sweep had de legitieme variant gesloopt (zelfde discipline als de Sessie-177 `[X]`-marker-bug).
- **Word-craft:** "echte commands" zou met "zonder echte gevolgen" twee keer "echt" opleveren → "commands uit de praktijk" lost de dubbeling op én is eerlijker dan "authentiek".

**Next steps:** geen open items. Eventueel later: `<meta name="description">`-regel (`index.html:6`) zegt nog "voor beginners" — buiten scope gehouden (SEO-relevant, niet de afgekeurde tekst).

**Metrics delta:** verwaarloosbaar (HTML/JS-tekstedits, ~37 regels over 26 bestanden). Geen test-wijzigingen. Geheugen `feedback_audience_floor_not_ceiling` toegevoegd.

---

## Sessie 178: Homepage lead-magnet — UX-reorder + glow-fix + copy-perfectionering (24 jun 2026)

**Mission:** Heisenberg zag onderaan de homepage twee vragen pal na elkaar — "Direct beginnen?" (lead-magnet, download een PDF) en "Klaar om te beginnen?" (finale CTA, start de terminal) — en vond dat verwarrend. Analyse → reorder + reframe; in vervolgvragen uitgebreid naar een glow-regressie en daarna naar copy-perfectionering.

**Probleem (diagnose):**
- **Woord-botsing:** twee bijna identieke "beginnen?"-vragen achter elkaar met verschillende antwoorden (PDF downloaden vs. terminal openen).
- **Belofte-inversie:** "Direct beginnen?" hing aan het traagste, meest-gated pad (formulier → email → double opt-in → PDF), terwijl het écht directe pad (terminal, geen account) er net onder stond = leest als bait-and-switch.
- **Conversie-prioriteit omgekeerd:** secundaire email-ask (PDF) vóór de primaire terminal-CTA; nieuwsbrief (derde email-ask) erna.

**Work done (3 commits):**
- **Fix 1 — reorder (`index.html`):** lead-magnet-strip verplaatst van vóór naar ná de finale-CTA-sectie. Nieuwe staart: FAQ ("Hoe begin ik?") → finale CTA ("Klaar om te beginnen?" → Start de Terminal) → lead-magnet (PDF) → nieuwsbrief. Terminal-CTA krijgt het climax-moment direct na de FAQ-payoff; PDF + nieuwsbrief clusteren als secundaire email-staart. Tracking-attributen (`data-lead-magnet`/`data-cta-location`) intact (attribuut-gebaseerd, positie-onafhankelijk).
- **Fix 2 — glow (`styles/landing.css`):** de `final-cta`-glow zat verankerd op `at 50% 100%` (onderrand) en leunde op de aangrenzende band om in over te lopen (nieuwsbrief op homepage, footer op de 4 andere final-cta-pagina's). Na de reorder volgde een transparante lead-magnet-sectie → de glow werd hard afgekapt en zweefde "uit het niets". Fix: homepage-gescopete override `.final-cta:has(+ .lead-magnet)` → zelfstandige ambient-halo (`radial-gradient(ellipse 42% 58% at 50% 44%, var(--final-cta-glow) 0%, transparent 72%)`) die naar alle randen uitvaagt. De 4 andere pagina's matchen `:has` niet → houden de naad-uplight. `landing.css?v=121`→`122` op **alleen** `index.html` (de regel rendert nergens anders).
- **Fix 3 — copy (3 teasers):** titel "Pak de gratis Pentest Playbook-sample" (stroef + dubbelt de badge) → **"Zo begint een echte pentest"** (hook). Subtekst "Krijg de Fase 0 reconnaissance-checklist + beslisboom Fase 0 → 1" (jargon) → gewone taal: "hoe je een pentest voorbereidt — toestemming, scope en de juridische check — en je doelwit verkent vóór de eerste aanval. Precies de stap die beginners overslaan." Zelfde de-jargon op `over-ons.html` + `gidsen.html` (pagina-specifieke kopjes "Wil je zien wat ik bouw?"/"Nog niet overtuigd?" behouden). `index.html` `.phase-flow`/`.arrow-glyph`-span vervalt.

**Copy-verificatie tegen artefact (product-kwaliteitsregel):** twee Explore-agenten — één voor de site-brede copy-inventaris (~55 plaatsen; teaser-groep = homepage + over-ons + gidsen; `sample-pentest.html`-hero al goed; ~10 blog-vermeldingen bewust contextueel), één voor de echte PDF-inhoud (`pdfinfo`/`pdftotext`): sample = 9 pag., Fase 0 (toestemmingsdocument, scope, juridische check) + Fase 1 reconnaissance (whois/dig/OSINT + licht actief). Géén scanning/exploitation/rapportage (= betaald 19-pagina Playbook). Copy claimt dus niets buiten de sample.

**Niet aangeraakt:** `sample-pentest.html` (hero al goed), blog-inline-vermeldingen (contextueel), meta/SEO-tags, nieuwsbrief-mail.

**Verificatie (render-en-meet, no-store server tegen ES-module-cache-vals-negatief):**
- Reorder: DOM-volgorde FAQ→finale CTA→lead-magnet→nieuwsbrief bevestigd; dark+light+mobiel 375px, geen horizontale overflow (scrollWidth 360 ≤ 375); lead-magnet→nieuwsbrief-spacing gebalanceerd (Wijziging-3 CSS niet nodig).
- Glow: ambient-halo grondt netjes in dark+light+mobiel, geen harde rand; `:has(+ .lead-magnet)` matcht alleen homepage (bevestigd via `el.matches()`).
- Copy: titel/subtekst exact, "vóór" (`&oacute;&oacute;r`) rendert correct, geen "Fase 0 → 1"/`arrow-glyph`-resten, badge + knop intact; over-ons + gidsen nieuwe paragraaf onder behouden kop.

**Commits:** `26b6f52` (reorder + titel-reframe, 2 files), `91aab72` (glow-fix `final-cta` + `?v=122`, 2 files), `deab754` (copy de-jargon 3 teasers, 3 files). Alle gepusht naar `main`.

**Learnings:**
- **Sectie-reorder kan een naad-afhankelijk visueel effect stil breken.** De glow leek standalone maar was ontworpen om in de band eronder over te lopen (`at 50% 100%`, hard-clipped). Bij elke DOM-herschikking: gradients/borders op sectiegrenzen nalopen.
- **Verankerde gradients zijn reorder-veilig, naad-uplights niet.** De fix maakt de glow zelfstandig (centered halo, uitvaag vóór alle randen) i.p.v. afhankelijk van de buur.
- **Scoping > herontwerp.** `:has(+ .lead-magnet)` raakte exact de ene gebroken case en liet 4 gezonde pagina's met rust — geen body-class of JS-detectie nodig.
- **`?v=`-bumps zijn voor gedragswijziging, niet voor bestandswijziging.** HTML-only tekstedits en een CSS-comment-only edit hebben geen render-effect → geen bump; de glow-regel (homepage-only) bumpte alleen index.html.
- **Copy verifiëren tegen het artefact, niet tegen de oude tekst.** De oude subtekst noemde echte features maar in jargon; de PDF-inhoud leverde de eerlijke, begrijpelijke verkoopargumenten (toestemming/scope/juridische check) die "Fase 0" verborg.

**Next steps:** geen open punten uit deze sessie. (Bestaande backlog ongewijzigd — zie TASKS.md.)

**Metrics delta:** geen test-toevoeging (197 tests / 23 specs ongewijzigd; copy/layout-werk). Bundle ground-truth Sessie 178: src 625 KB / styles 385 KB (+1 KB `final-cta`-glow override) / blog 413 KB / assets 1031 KB. HTML-copy-edits vallen buiten de gemeten dirs.

---

## Sessie 177: Terminal voltooid-markers `[X]`→`[✓]` — systemische rode-checkbox-botsing op mobiel (22 jun 2026)

**Mission:** Heisenberg zag in de terminal dat `leerpad` op mobiel sommige commands rood toonde en andere wit, terwijl op laptop alles wit is — "net alsof er iets fout is". Analyse → fix → in vervolgvragen uitgebreid naar de man-page en daarna naar de hele gamification/voortgang-stack.

**Oorzaak (twee samenwerkende mechanismen in `src/ui/renderer.js`):**
- **Marker-botsing** (`renderer.js:101`): elke regel die na trim met `[X]` begint wordt als `error` geclassificeerd → rood. `leerpad` (en bijna elke voortgangsweergave) gebruikte `[X]` als "afgevinkt"-vinkje → voltooide items rood.
- **Kleur-doorlek** (`renderer.js:497-506`): een regel met ≥3 spaties inspringing zónder eigen marker is een *continuation line* en erft de kleur van de regel erboven. Mobiele rijen sprongen 4 spaties in → het rood van een voltooid item lekte door naar de niet-voltooide `[ ]`-regels eronder.
- **Waarom alleen mobiel:** desktop tekent een ASCII-kader; elke regel begint met `│` (geen marker, 0 inspringing) → alles wit. Het kader schermt de inhoud toevallig af.

**Work done:**
- **Leerpad (`leerpad.js`):** mobiel `[X]`→`[✓]` (success/groen) op fase-kop + command-rij; command-inspringing 4→2 spaties zodat niet-voltooide regels onder de continuation-drempel vallen (geen doorlek). Desktop-box ook `[X]`→`[✓]` voor symbool-consistentie (in het kader → blijft wit; `[✓]` is 3 chars = uitlijning pixel-exact). Man-page-legenda herschreven met de glyph **achteraan** (`Voltooid   [✓]`) i.p.v. vooraan → geen marker-match → neutraal wit (geen rood, geen doorgeërfd groen op de "niet voltooid"-regel).
- **Gamification/voortgang (na scope-akkoord "alles, zoals leerpad"):** `[X]`→`[✓]` voor voltooid/unlocked in `challenge-renderer.js` (lijst + renderProgress), `badge-manager.js` (box + mobiel), `tutorial.js` (box + mobiel), `challenge.js` (status-tekst), `next.js` (transitie + completion `[X] … afgerond/voltooid!` — gebruikte z'n sub-regels al met `[✓]`, was intern inconsistent).
- **Tests:** `responsive-ascii-boxes.spec.js` leerpad mobiel+desktop → `[✓]` verwacht, `[X]` verboden. Overige specs (`tutorial.spec.js` accepteert al `[X]` OF `✓`; `gamification.spec.js` toetst geen marker) onaangeroerd.
- **Geheugen:** `reference_renderer_marker_collision.md` toegevoegd (+ MEMORY.md-pointer).

**Cruciaal onderscheid (uit volledige `[X]`-inventaris vóór edits):** drie categorieën, niet twee.
- **A. Voltooid-checkbox** (de bug → `[✓]`): de 6 oppervlakken hierboven.
- **B. Échte foutmelding** (rood correct, niet aangeraakt): `[X] Onbekende challenge` (challenge-manager:112), `[X] Onbekend scenario` (tutorial.js:180), certificates:133/143.
- **C. "NOOIT doen"-lijsten in security/netwerk-man-pages** (rood correct, niet aangeraakt): hydra/sqlmap/nmap/hashcat/cat/rm/ping/netstat/whois/ifconfig/traceroute/metasploit/nikto — `[X] password, admin, 123456` enz. Hier is rood een rood kruis = "niet doen"; een blinde `[X]→[✓]` had de waarschuwing **omgekeerd** ("`[✓] password`"). Daarom eerst inventariseren, niet globaal vervangen.

**Verificatie (render-en-meet, no-store Node-server tegen ES-module-cache-vals-negatief):**
- Leerpad mobiel **dark** (`[✓]`=`#3fb950` groen) + **light** (`#008844`), niet-voltooid `terminal-output-normal`, `anyRed:0`, regels ónder een groene regel wit (doorlek weg).
- Leerpad desktop 1440px: box `allSame`-uitgelijnd (len 69), voltooide rij wit (afgeschermd), `[X]` weg, 0 rood — `[✓]` rendert als 1 monospace-cel (screenshot bevestigd).
- `challenge status` na 1 afgevinkt doel: `[✓] Check je gebruikersnaam` = `success` (groen — was eerder gemeten `error`/rood), `[ ]` = wit.
- `achievements` met unlocked badge: `[✓] First Steps` groen, locked badges wit.
- Regressie: `tutorial start <bestaat-niet>` → `[X] Onbekend scenario` = `error`/rood (categorie B intact). Desktop achievements- + tutorial-box: `allSame`, len 69, 0 rood.

**Commits:** `af91ff8` — "fix(terminal): voltooid-markers [X]->[✓] — verhelp rode checkboxes op mobiel" (7 files: leerpad/challenge/next/tutorial/badge-manager/challenge-renderer + responsive-ascii-boxes.spec.js). Gepusht naar `main`.

**Learnings:**
- De renderer kleurt puur op het **eerste teken** van een regel; content-tokens die toevallig markers zijn (`[X]`) botsen. Eén conventie, zes vindplaatsen — de bug was systemisch, niet leerpad-specifiek.
- **Meten vóór claimen:** de eerste mobiele probe toonde 0 rood omdat niets voltooid was; pas ná het triggeren van een afgevinkt item (`challenge status` met 1 met-requirement) werd het rood zichtbaar/gemeten. Aanname "het is rood" ≠ bewijs.
- **Inventariseer vóór bulk-replace:** de categorie-C "NOOIT doen"-`[X]` lijken identiek maar dragen de tegenovergestelde betekenis. Een sed-brede replace was hier destructief geweest.
- `[✓]` is 3 chars en 1 monospace-cel → desktop-box-uitlijning blijft pixel-exact; geen reden om desktop op `[X]` te houden (symbool nu overal gelijk).
- **Geen CI:** `.github/workflows` bestaat niet en Netlify draait alleen een echo-build; de Playwright-suite test bewust de **live productie**-site en draait enkel handmatig → de browser-verificatie hier (no-store, computed-style) is het eigenlijke bewijs; de suite valideert pas ná deploy.

**Next steps (open):** categorie C (man-page "NOOIT doen"-`[X]`) staat bewust nog op rood — desgewenst later naar `[✗]` voor projectconventie-consistentie (geen functioneel defect). Na Netlify-deploy: `npx playwright test responsive-ascii-boxes.spec.js` tegen productie als regressie-vangnet.

**Metrics delta:** geen test- of bundle-impact van betekenis — alleen asserties gewijzigd (geen specs toegevoegd; blijft 23 files / 197 tests per browser-project) en enkele `[✓]`-tekens in src JS (sub-KB). Ground-truth `du -sb`: src ~624 KB / styles ~384 KB / blog ~413 KB / assets ~1030 KB.

---

## Sessie 176: Mobiele audit + 5 fixes — tabel-overflow, CSP/consent-gap, emoji-cleanup, tap-targets, scroll-hint (21 jun 2026)

**Mission:** Heisenberg vroeg een audit of de mobiele weergaves ongewenste afwijkingen vertonen (hoofdpubliek laptop/pc, mobiel secundair). Gemeten op 375px-viewport (`getBoundingClientRect`/`scrollWidth`, niet op het oog) tegen productie. Eindoordeel: mobiel grotendeels gezond; 1 echt layout-defect + enkele kleinere punten. Daarna in vervolgvragen uitgebreid naar CSP-onderzoek, emoji-cleanup, tap-targets en de scroll-hint.

**Fix 1 — brede tabellen afgekapt/pagina-overflow (blog + legal):**
- Eén grondoorzaak: `.blog-post-content table` (`blog.css:478`) en `body.legal-page table` (`legal.css:73`) hadden `width:100%` + default `table-layout:auto` zónder scroll-container → bij 4 koloms tekst groeit de tabel buiten de viewport (tot 574px @375px). Blog maskeerde dit met `.blog-container overflow-x:hidden` → kolom afgekapt; legal had die net-niet → hele pagina scrollde horizontaal (`scrollWidth` 594).
- Fix: in de bestaande `@media (max-width:768px)`-blokken de tabel zelf een scroll-container maken (`display:block; overflow-x:auto; -webkit-overflow-scrolling:touch; max-width:100%`) — zelfde patroon als `.blog-post-content pre`. Geverifieerd: pagina-overflow weg (594→360), tabel scrollt binnen eigen box, afgekapte kolom weer leesbaar (dark+light). Desktop ongemoeid (`display:table` op ≥769px).

**Fix 2 — CSP blokkeerde Consent Mode v2 defaults op alle 14 blogpagina's (GDPR-gap):**
- Het inline consent-default `<script>` werd door de CSP (`script-src 'self'`, geen unsafe-inline) geblokkeerd → `gtag` undefined, `dataLayer` leeg, maar de losse `adsbygoogle.js` (CSP-toegestaan) laadde **wel** → AdSense laadde zonder de `denied`-defaults. De 11 niet-blog-pagina's gebruikten al het geëxternaliseerde `consent-default.js` (Sessie 166); de `blog/`-map was bij die migratie gemist.
- Runtime-bewijs: productie-blog vóór = `gtag:undefined`, `dataLayer.length:0`, `consentDefault:false`, AdSense in DOM; homepage = `gtag:function`, default met alle `denied`+`wait_for_update:500`. `init-analytics.js` vangt het niet op (zet alleen een consent-*update*, en alleen als `gtag` bestaat).
- Fix: inline-block + losse adsbygoogle-tag vervangen door `<script src="/src/analytics/consent-default.js" data-cookieconsent="ignore" data-adsense="ca-pub-6345664385525701">` (dat zet defaults én injecteert AdSense daarná — race-veilig). Python-vervangscript met regex + dry-run + per-bestand assertie (exact 1 match). Geverifieerd: 0 CSP-fouten over 7 pagina's, gtag=function, default aanwezig.

**Fix 3 — emoji-cleanup 3 legal-pagina's:**
- Legal gebruikte ~18-22 emoji's elk (rest van de site emoji-vrij; brand-regel = ASCII brackets only). Heisenberg koos: alles weg, ✅/❌ → tekst.
- Script met contextregels: decoratieve sectie-markers (📌🔒📢🔮🚫⚠️⚖️🎓) verwijderd; ✅/❌ in `<td>` → emoji weg, Ja/Nee behouden; ✅/❌ in lijst-items → `[✓]`/`[✗]`; trailing emoji in `<h3>` weg; functionele pijlen (→←↑↓) behouden. Eind-assertie ving 🎓 (niet pre-geïnventariseerd) → toegevoegd. 0 emoji over op alle 3, dark+light geverifieerd.

**Fix 4 — contact-form tap-targets 38→44px:**
- `.form-group input/textarea/select` (`pages.css:325`) was ~38px (alleen padding) → `min-height:44px` (WCAG 2.5.5 AAA). Homepage-newsletter had al `height:44px`. Cache-bump `pages.css?v=133` — normaliseerde meteen bestaande drift (2 bestanden op `v=114`, 6 op `v=132`).
- **Teruggedraaid (meedogenloos-eerlijk):** de blog-filterknoppen-fix. Heisenberg koos "filterknoppen naar AA-24px", maar ná implementatie tonen metingen dat ze al 27px (mobiel) / 42px (desktop) zijn — ruim boven het 24px AA-minimum. Mijn `inline-flex` had bovendien geen effect op de hoogte (al display:block). Fix repareerde niets → teruggedraaid. Premisse ("~20px") was een ongemeten aanname; "meten wint van oogwerk" beet terug.

**Fix 5 — terminal scroll-hint collisie:**
- `.scroll-hint` ("Scroll voor meer info", `position:fixed; bottom:4.5rem; z-index:2`, buiten `<main>`) botste op mobiel met de `.mobile-quick-commands`-balk, die naar 2 rijen wrapt (gemeten 109px) en dezelfde onderste zone bezet. Op desktop bestaat de balk niet (`display:none`) → daar correct.
- Fix: `@media (max-width:768px){ .scroll-hint{ display:none } }` in `terminal-education.css` (waar de hint woont; dat bestand wordt alleen door `terminal.html` geladen → kleinste cache-blast-radius). Cache-bump `terminal-education.css?v=115`. Geen JS-wijziging (IntersectionObserver in `faq.js`/`terminal.js` draait foutloos door). Geverifieerd: mobiel `display:none`/balk zichtbaar, desktop `display:flex`/bottom 81px.

**Commits:** `c41e317` (fix mobile: tabel + scroll-hint) + `5dae5ca` (fix blog: consent extern, 14 posts) + `f4c70be` (style legal: emoji's → ASCII) + `ea1c5ea` (fix a11y: form-inputs 44px + pages.css-normalisatie). 30 bestanden, +134/−284. Cache-bumps `blog.css?v=116`/`legal.css?v=3` reizen mee in de consent- resp. emoji-commit (per-bestand gegroepeerd want hunk-splitting niet mogelijk in deze omgeving).

**Learnings:**
- **Meten wint van oogwerk — ook over je eigen aannames:** de filterknoppen-"fix" was gebaseerd op een ongemeten "~20px"-aanname; meting toonde ze al AA-conform → teruggedraaid. Implementeer-dan-meet ontmaskerde het.
- **Console-error ≠ cosmetisch:** de CSP-melding leek een losse console-regel maar bleek een echte GDPR/Consent-Mode-gap op de hoogste-organische-traffic-pagina's. Runtime-meten (dataLayer + gtag-type) op productie vóór én lokaal ná = sluitend bewijs.
- **Voltooi migraties volledig:** de Sessie-166 inline-script-externalisatie miste `blog/`; een repo-brede grep (consent-default.js vs inline gtag) legde de 11-vs-14-split bloot.
- **Cache-blast-radius bepaalt de fix-locatie:** scroll-hint-regel in `terminal-education.css` (1 consumer) i.p.v. `mobile.css` (site-breed) → één cache-bump i.p.v. ~25.
- **Per-bestand committen wanneer hunks verweven zijn:** cache-bumps zaten in dezelfde HTML's als content-changes; `git add -p` is interactief (niet beschikbaar) → per-bestand groeperen geeft dezelfde eindtree met leesbare history.
- **Scope-validatie via assertie:** het emoji-script faalde hard op 🎓 (niet geïnventariseerd) — de eind-assertie (0 emoji over, excl. pijlen/✓✗) was het vangnet.

**Next steps:** Brevo click-tracking-404 op mobiele PDF-download blijft best-effort (Sessie 174). De catch-up-archivering current.md Sessie 81-164 → range-archieven (gedeferd Sessie 175) blijft openstaan.

**Metrics delta:** styles/ 378→384 KB (+6, tabel/a11y-CSS), blog/ 417→412 KB (−5, inline-consent-scripts verwijderd uit 14 posts), src/ 623 KB onveranderd, assets/ 1031 KB onveranderd. Geen test-count-wijziging (23 spec files). `validate-docs.sh` exit 0.

---

## Sessie 175: Layout-fixes sample-pentest.html — chevron, success-state, card-uitlijning (21 jun 2026)

**Mission:** Heisenberg meldde meerdere layout-problemen op `sample-pentest.html` en wilde ze 1-voor-1 aanpakken. Drie problemen opgelost, elk gecommit, daarna gepusht.

**Probleem 1 — chevron `Fase 0 → 1` te laag (2 plekken):**
- `.arrow-glyph` gebruikte `position: relative; top: 1px` (duwde de pijl omláág). Vervangen door `vertical-align: 0.2em` — schaalt met font-grootte, werkt op zowel hero-`<li>` als card-`<h3>`. Identiek aan de eerdere homepage-fix `.phase-arrow`.
- Homepage `.phase-arrow` geconsolideerd naar dezelfde canonieke `.arrow-glyph` (DRY): `.phase-arrow`-regel verwijderd uit `landing.css`, `index.html:669` class omgezet. `.phase-flow` (nowrap-wrapper, homepage-specifiek) behouden — apart concern.

**Probleem 2 — success-state brak de layout:**
- Oorzaak: `brevo-submit.js` toonde bij succes het paneel maar verborg het formulier níet → kaart droeg dubbele content (titel+intro+succes-box+download-knop+invoerveld+verweesde CTA+privacy) → explodeerde in hoogte; de achtergebleven "Stuur mijn sample"-knop oogde verweesd. De harde rand kwam uit Brevo's externe `sib-styles.css`.
- `brevo-submit.js`: bij succes `form.style.display='none'` + `.newsletter-submitted` op de `.homepage-newsletter`-kaart (generiek, werkt homepage + sample). Bevestiging vervángt nu het formulier.
- `main.css`: paneel-styling (padding, box-shadow none) + success/error-tint (groen/rood via `color-mix`) + icoonkleur. **0× nieuwe `!important`** — Brevo's `.sib-form-message-panel` (0,1,0) heeft zelf geen `!important`, dus onze scopes `.homepage-newsletter .sib-form-message-panel` (0,2,0) en `#success-message` (1,1,0) winnen op specificiteit. (Eerste plan gebruikte `!important`; Heisenberg vroeg om een schonere oplossing → curl van Brevo's CSS bevestigde dat specificiteit volstaat.)
- `landing.css`: sample-kaart verbergt stale titel+intro bij succes; download-knop full-width; btn-cta-tekstkleur hersteld (Brevo's `.sib-form-container a` (0,1,1) kleurde 'm blauw+underline → onze `.sample-success-download .btn-cta` (0,2,0) wint).
- `lead-magnet.spec.js`: success-test uitgebreid met `#sib-form` hidden + `#sample-form` heeft `.newsletter-submitted`.

**Probleem 3 — card-body's niet uitgelijnd (3-koloms rij):**
- Meting: titels top-uitgelijnd (alle `top:861`) maar card 3 ("Beslisboom Fase 0 → 1") heeft 1-regelige titel → body begon 23px hoger (900 vs 923) dan card 1+2 (2-regelig).
- Fix: opt-in `.feature-cards--equal-title` op de `.feature-cards`-div (raakt index/gidsen/over-ons niet, die delen `.feature-card`) + `@media (min-width:1025px) { .feature-cards--equal-title .feature-card h3 { min-height: 2lh } }`. `2lh` = exact 2 tekstregels (geen line-height-giswerk). Gegate op de 3-koloms-breakpoint → geen witruimte zodra de cards stacken (≤1024px = 2-kolom met card 3 full-width, ≤768px = 1-kolom).
- Na fix gemeten: alle drie body's `top:923`, h3-hoogtes 54px gelijk. Bij 1000px (2-kolom): min-height niet actief (27/32px natuurlijk) = correct gescoped.

**Commits:** `6f5e27a` (probleem 1+2) + `0a64369` (probleem 3). Gepusht naar `main` (`33f239f..0a64369`, incl. eerder lokaal-only `57a8379`). Cache-bumps: `main.css` v150→151, `landing.css` v118→119→120→121 (cumulatief).

**Verificatie:** Playwright met fetch/route-mock voor Brevo (geen echt contact) + no-cache server (Python `http.server` cachte de oude ES-module → Sessie-171-valkuil; opgelost met `Cache-Control: no-store`-server). E2E `lead-magnet.spec.js` 10/10 groen in verse browser (echte module). Render-en-meet + screenshots: sample success, homepage success (dark), error-state (rood, form blijft voor retry), light-theme success, card-uitlijning. `validate-docs.sh` exit 0 (pre-commit hooks groen bij beide commits).

**Learnings:** zie `.claude/CLAUDE.md` Sessie 175. Kern: meten vóór concluderen (chevron-richting; card-body i.p.v. titel); specificiteit boven `!important` (geheugen `feedback_avoid_important_css`); gedeelde-JS blast-radius bewust scheiden (generieke form-hide + sample-specifieke cosmetiek).

**Next steps / deferred:**
- **Rotation/catch-up niet uitgevoerd:** Sessie 175 was in CLAUDE.md gemarkeerd als eenmalige current.md-archivering (Sessie 81-164 → range-archieven) + standaard `N%5` rotatie (archiveer 165-169). Bewust gedeferd — grote, risicovolle operatie, niet gevraagd deze sessie. Aparte sessie waard.
- Brevo-404 best-effort vervolgwerk (uit Sessie 174) blijft open.

