# Sessie-archief 180-184 — HackSimulator.nl

**Range-archief** (geroteerd uit `current.md`, Sessie 195). Nieuwste-eerst.
Conventie: `docs/sessions/README.md`.

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

