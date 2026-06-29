# Sessie-archief 170-174 — HackSimulator.nl

**Range-archief** (geroteerd uit `current.md`, Sessie 185). Nieuwste-eerst.
Conventie: `docs/sessions/README.md`.

---

## Sessie 174: Mobiele PDF-download fix — sample-pentest lead magnet (19 jun 2026)

**Mission:** Heisenberg meldde dat de pentest-sample PDF-download op mobiel een foutmelding geeft — een al langer bekende, eerder geparkeerde bug. Doel: de beste fix voor de bezoeker, ongeacht moeite, inclusief het echt aanpakken van de Brevo-kant.

**Diagnose (cold-start research, plan-mode):**
- De PDF wordt niet direct vanaf de site gedownload. Flow: email op `sample-pentest.html` → double opt-in → welkomstmail met "Download Sample (PDF) ↓"-knop → `/assets/samples/pentest-playbook-sample.pdf`.
- Grep + sessie-logs onthulden de echte root cause, al gedocumenteerd in **Sessie 134** (`current.md` regels 3416-3504): Brevo wrapt de PDF-link in een click-tracking-redirect `r.sendibm1.com/?u=…&i=<token>`; het token is **eenmalig consumeerbaar**; Gmail-mobiel's security-prefetch consumeert het token vóór de gebruiker klikt → bij de echte klik **404** (~5-10% mobiele klikken). Unsubscribe/mirror-links werken wél (idempotente endpoints) — daarom faalt alleen de PDF-link.
- **Kernpunt:** de 404 ontstaat op Brevo's server vóór het request hacksimulator.nl bereikt → **geen repo-wijziging kan die redirect repareren**. Sessie 134 probeerde per-link/globale tracking-toggle (niet in Free/Starter-tier) + Button-block-split (404 bleef) → geparkeerd als "tier-limitatie".
- Apart ontdekt: `_headers` forceerde `Content-Disposition: attachment` op `/assets/samples/*` met comment "mobile webviews kunnen PDF niet inline" — **omgekeerd mentaal model**: iOS WKWebviews (Gmail/Outlook-app) kunnen een geforceerde download juist níet afhandelen, maar renderen een PDF inline wél.

**Strategie:** een betrouwbaar same-origin downloadpad bouwen dat Brevo's tracking volledig omzeilt (gegarandeerd, in onze hand), én de Brevo-kant zo goed mogelijk aanpakken (best-effort, tier-/support-afhankelijk → vervolgwerk Heisenberg).

**Work done:**
- `_headers`: `/assets/samples/*` `Content-Disposition: attachment` → `inline; filename="pentest-playbook-sample.pdf"` + comment gecorrigeerd.
- `sample-pentest.html`: download-CTA als **apart element** binnen `#success-message` (niet de tekst-span, want `brevo-submit.js` overschrijft die met Brevo's `json.message`). Directe same-origin `href="/assets/samples/pentest-playbook-sample.pdf"` met `download` + `target="_blank"` + `data-lead-download="pentest"`. Inline-style met CSS-variabele (consistent met bestaande inline-styles; CSP staat `style-src 'unsafe-inline'` toe → géén landing.css cache-bump-sweep nodig). Success-copy gecorrigeerd: noemt directe download + bevestigen-voor-nieuwsbrief, claimt niet onterecht 'al gemaild' (met double opt-in komt de PDF-mail pas ná bevestiging; wat direct verstuurd wordt is de bevestigingsmail).
- NEW `sample-download.html`: verzorgde `noindex` download/bedankt-pagina (clone landing-structuur, hergebruik navbar/footer-injectie + `landing.css`/`pages.css`). Same-origin download-knop + cover-thumbnail (`assets/products/eerste-pentest-playbook.png`) + cross-sell Gumroad `wmvpx` + terminal-CTA. **Niet** in `sitemap.xml`. Bestemming voor de welkomstmail-knop (één centrale downloadplek, twee ingangen).
- `src/analytics/events.js`: `leadMagnetDownload(sampleId, location)` helper (consistent met `leadMagnetSignup`).
- `src/ui/cta-tracking.js`: derde branch `[data-lead-download]` → `leadMagnetDownload` (CSP-safe, geen inline JS).
- `tests/e2e/lead-magnet.spec.js`: +4 tests (download-CTA zichtbaar + correcte href na mocked success; `sample-download.html` rendert + cross-sell + noindex; sitemap-exclusie; `lead_magnet_download`-event).

**Verificatie:** lokaal `@playwright/test@1.56.0` gepind (`--no-save`; matchte de provisioned `chromium-1194` — 1.55.0 wilde build 1187, ^1.56.1 wilde 1228) + statische server (`python3 -m http.server`) + `BASE_URL=localhost` → **10/10 lead-magnet E2E groen op chromium**. WebKit-download egress-geblokkeerd (`cdn.playwright.dev` 403) → iOS = handmatige real-device-check. Visueel geverifieerd (desktop + mobiel screenshot van `sample-download.html`). `validate-docs.sh` exit 0.

**Product-beslissing — double opt-in blijft AAN:** door de on-site instant download zijn "PDF krijgen" (nu meteen op de site) en "nieuwsbrief activeren" (nog steeds via double opt-in bevestiging) **losgekoppeld**. Niet overschakelen naar single opt-in (zou de deliverability-investering Sessies 134-136 — SPF/DKIM/DMARC, mail-tester 8.3+, Postmaster — ondermijnen via onbevestigde/typefout-adressen). De on-site download dekt het bezoekersprobleem al; double opt-in kost daardoor niets meer.

**Commits:** `8f2ce68` (fix: same-origin downloadpad + `_headers` + `sample-download.html` + events/tracking/tests) + `fb397ca` (success-copy aligned op behoud double opt-in). Branch `claude/focused-tesla-0grpev` → gemerged naar `main` (deze sessie).

**Learnings:**
- **De "foutmelding" was niet wat de codebase-comment suggereerde.** `_headers` zei "force download want webviews kunnen niet inline"; de échte bug is een Brevo-tracking-prefetch-404 — een aparte laag. Twee gestapelde issues niet verwarren: lees de sessie-historie (Sessie 134 had dit al exact gediagnosticeerd) vóór je een oorzaak aanneemt.
- **Sommige bugs zijn niet in-repo fixbaar.** De 404 zit op Brevo's infra (`r.sendibm1.com`) vóór het request ons bereikt. Eerlijk zijn dat een `_headers`-tweak dit NIET oplost (zou misleidend zijn); de juiste fix = een betrouwbaar pad bouwen dat het kapotte mechanisme omzeilt, niet doen alsof je het kapotte ding repareert.
- **`Content-Disposition: attachment` is omgekeerd voor iOS in-app webviews** — WKWebView rendert een 90 KB PDF wél inline maar kan een geforceerde download vaak níet afhandelen (vereist host-app download-delegate). Forceren brak precies de webviews die inline aankonden. `inline` = universeel veiliger + maakt embedding mogelijk.
- **Brevo overschrijft de success-span met `json.message`** → een persistente download-CTA moet een apart element in het panel zijn, niet de span. En de copy moet kloppen onder double opt-in (PDF-mail komt pas ná bevestiging — niet "al gemaild" claimen; de gebruiker vroeg hier terecht op door).
- **De PDF-URL is sowieso publiek/raadbaar** → de email-"gate" bood nooit echte bescherming; on-site ungated leveren kost geen security en wint enorm voor de bezoeker. Maar nieuwsbrief-consent apart double-opt-in houden beschermt de deliverability-investering.
- **Playwright-versie ↔ browser-build pinnen** — provisioned `chromium-1194` vereiste `@playwright/test@1.56.0`; `--no-save` zodat `package.json` (^1.56.1) ongemoeid bleef. Egress: npm-registry open, browser-CDN (`cdn.playwright.dev`) geblokkeerd (consistent met Sessie 172).

**Next steps (Heisenberg, Brevo-dashboard — best-effort, los van deze deploy):**
- Houd "Double confirmation email" AAN. Wijzig de Brevo Success message naar: "Gelukt! Je sample staat hieronder klaar. We hebben je ook een mail gestuurd — bevestig daarin je inschrijving voor onze maandelijkse tips." Mailknop-URL → `/sample-download.html`.
- Brevo-404 zelf: (1) her-check op een click-tracking-toggle (UI/tiers >1 jaar gewijzigd sinds Sessie 134); (2) geen toggle → support-ticket (tekst in `.claude/plans/lead-magnet-followup.md` regels 112-148); (3) tier-gated → kies bijlage (PDF in de mail, gratis/definitief), accepteer de minor-404 (site dekt het hoofdpad), of tier-upgrade. Custom tracking-subdomein lost dit waarschijnlijk NIET op (zelfde tokenmechanisme).
- iOS real-device-check van de download (WebKit lokaal niet testbaar).

**Metrics delta:** +1 pagina (`sample-download.html`, noindex, niet in sitemap). src/ ~622→623 KB (events.js + cta-tracking.js, +~0,6 KB). lead-magnet.spec.js +4 tests. Geen Terminal Core-runtime-impact (sample-pages buiten budget).

---

## Sessie 173: Launch-prep marketing-launch wo 24 juni — kit/visuals/homepage + datum-discipline-correctie (18 jun 2026)

**Mission:** Heisenberg wil aanstaande week de marketing-launch doen. De site is technisch al live; doel was bepalen wat de volgende stap is en de launch-prep volledig doen zodat de launch-dag pure handmatige uitvoering is. Launchdatum verschoven van het verlopen do 18 juni naar **wo 24 juni** (di/wo = sterkste HN/Reddit-dagen; Heisenberg heeft ma-do enige — geen hele dag — beschikbaarheid).

**Work done:**
- **Plan-mode verkenning:** ontdekt dat er al een compleet launch-pakket lag (Sessie 160-161): `docs/public-launch-runbook.md` (4 fasen) + `docs/launch-announcement-kit.md` (copy + kanalen + §5 uur-schema) + `docs/seo-launch-checklist.md` + `scripts/capture-launch-visuals.mjs`. Kernconclusie: project is niet meer te *bouwen* maar uit te *voeren*; kit stond alleen hardcoded op het verlopen do 18 juni.
- **WS1 — kit herplanned (`docs/launch-announcement-kit.md`):** do 18 juni → wo 24 juni (header §1, §5-titel, datums). Avond-ervoor → di 23 juni + GA4 Real-Time-verificatie toegevoegd aan de checklist. §5-tijdschema herontworpen voor beperkte beschikbaarheid: niet 09:00-20:00 uitgesmeerd maar geclusterd in een bewaakbaar blok (default 13:00-18:00 CET) met de reactie-gevoelige kanalen (EHGN/Reddit/Show HN ~15:00) vooraan en eigen netwerk (LinkedIn/X) aan de rand.
- **WS2 — launch-visuals geregenereerd:** `node scripts/capture-launch-visuals.mjs` → verse GIF (27 frames, 1000×640) + desktop (1280×720) + mobiel (375×812@2x) in `.playwright-mcp/launch/` (gitignored). Chromium bleek lokaal aanwezig (`ms-playwright/chromium-1194`) — de Sessie-172-egressblok gold alleen voor een *verse* `playwright install`. Render-en-meet: desktop + mobiel visueel geïnspecteerd (Read image) → nieuw **H-monogram**-logo, nmap-routerprofiel (53/80/443) met NL-context + TIP, geen banner. Oude artefacten (12 jun) toonden nog het `>_`-logo.
- **WS3 — homepage cornerstone-linking (`index.html`):** ontdekt dat de homepage-blogsectie ("Lees meer op onze blog") slechts 8 van 13 posts linkte; de sterkste/nieuwste ontbraken (Sessie 169 koos bewust de 5 vastzittende posts als crawl-nudge). 5 cornerstones toegevoegd (nmap, Wireshark, Hashcat, OWASP-hub, "Ethisch hacker worden") → homepage linkt nu alle 13 = complete interne linking vanaf hoogste-autoriteit-pagina + crawl-route. Platte lijst = nul layout-risico. Sitemap homepage `lastmod` 2026-06-15 → 2026-06-18 (echte edit-datum).
- **Datum-discipline-correctie (kern-learning, zie hieronder):** in eerste instantie `dateModified` + `article:modified_time` + sitemap-`lastmod` op 3 cornerstones (nmap/owasp/wireshark) naar 2026-06-24 gebumpt — maar **zonder** echte content-touch. Heisenberg vroeg terecht door ("waarom 24 juni / kan dat niet vandaag / wat hebben we eigenlijk gemodified?"). Inspectie toonde: interne links al compleet, sibling-cross-links bestaan al (nmap↔wireshark, owasp↔sql-injection), OWASP-post dekt de 2025-editie al (Sessie 165). Géén echte verbetering te maken → bump = fake-freshness die runbook Fase 2 (twee-staps-poort: échte touch ontgrendelt pas de datum-bump) + Sessie-169-anti-cargo-cult schendt. **Volledig teruggedraaid** (3 posts netto 0 wijziging in git). Heisenberg wees er daarna op dat het plan dit wél voorschrijft — klopt: maar de poort gate't op een échte touch, en die was er niet (discipline-clausule "niet aangeraakt → ongemoeid"). Eerlijke freshness-hefboom = verse launch-week-post (runbook "aanbevolen"), later samen te schrijven.
- **Geheugen:** `feedback_preserve_plan_gates.md` toegevoegd (+ MEMORY.md-index) — bij gepoorte plan/runbook-stappen: voorwaarde checken vóór de gated actie, poort als conditie coderen, afwijking melden i.p.v. wegredeneren.

**Commits:** `d50b981` (feat(home): homepage linkt alle 13 blogposts + sitemap lastmod) + `4dd17b5` (docs(launch): herplan aankondigings-kit naar wo 24 juni). Visuals gitignored (niet gecommit). Op `main`, deploy-ready.

**Learnings:**
- **Plan-poorten preserveren (2× geflipt dit gesprek: bump→revert→bevestig revert).** Een planstap "doe X eerst, dan pas Y" is een *voorwaarde*, geen volgorde-suggestie. Ik parafraseerde 'm in mijn eigen WS3 naar "X + Y" naast elkaar en deed daarna Y zonder X. De gated actie (datum) hoort downstream van z'n geverifieerde oorzaak (echte inhoudswijziging). → memory `feedback_preserve_plan_gates`.
- **`dateModified` = de dag van een echte touch+deploy** — nooit een toekomstige of "launch-week"-datum zonder bijbehorende wijziging (Google klemt toekomstige datums + wantrouwt niet-onderbouwde freshness). De eerlijke crawl-route is: homepage echt wijzigen (truthful lastmod) → Google hercrawlt homepage → ontdekt nieuwe cornerstone-links → crawlt die.
- **WS3 versmald op grond van inspectie, niet aanname** — "strengthen internal links" was al gedaan (CLAUDE.md + grep bevestigden); forceren = cargo-cult (Sessie 169). De echte winst zat in de homepage (linkte de cornerstones niet), niet in de al-complete posts.
- **Visuals = van productie** → tonen automatisch de live staat (nieuw logo); regenereren was nodig juist door de logo-swap (Sessie 171). "Wie host het bestand bepaalt de update-route."
- **Maandag afgewezen voor launch** (zwakke HN/Reddit-dag); responstijd in de eerste uren na elke post is de echte succesfactor, niet een hele dag aanwezig zijn → schema geclusterd in bewaakbaar blok.

**Next steps:**
- Verse launch-week blogpost schrijven (samen) — kandidaten: Metasploit, Hydra, `grep`/`find`-tutorial.
- Handmatig 23-24 juni: GSC sitemap-resubmit + indexering, Bing import, Rich Results/FB/X validators, GA4 Real-Time-verificatie + annotatie, posten per kit §5.
- Heisenberg deployt de komende dagen (vóór 24 juni); deze commits liften mee.

**Metrics delta:** bundle ground-truth Sessie 173: src 622 / styles 378 / blog 417 / assets 1031 KB (VALIDATE-BUNDLE marker ge-refreshed). Geen runtime/JS/CSS-wijziging (root `index.html` + `sitemap.xml` vallen buiten de gemeten dirs). Tests 23 spec files ongewijzigd. validate-docs fast + `--deep` exit 0.

---

## Sessie 172: GSC "Verkopersvermeldingen" merchant-listing fix + per-gids covers (17 jun 2026)

**Mission:** Google Search Console meldde 4 problemen onder "Gestructureerde gegevens voor Verkopersvermeldingen" (merchant listings) op `hacksimulator.nl` — 1 kritiek (ontbrekend veld `image`) + 3 niet-kritiek (`hasMerchantReturnPolicy` in offers, geen algemene ID zoals gtin/merk, `shippingDetails` in offers). Doel: de Product-markup valide maken zónder misleidende data.

**Work done:**
- **Bron gelokaliseerd:** de enige `Product`-markup zat in `gidsen.html` (JSON-LD `CollectionPage` → `ItemList` met 3 Gumroad-gidsen). De `offers` hadden alleen `price`/`priceCurrency`/`availability`.
- **4 velden per product eerlijk ingevuld (digitaal download-product):**
  - `image` (kritiek): aanvankelijk gedeelde `og-image.png`, daarna vervangen door eigen cover per gids (zie hieronder).
  - `brand`: `{"@type":"Brand","name":"HackSimulator.nl"}` — eigen producten, lost de "algemene ID"-suggestie op (een eigen PDF heeft geen gtin; `brand` is de juiste identifier).
  - `hasMerchantReturnPolicy`: `MerchantReturnPolicy` met `applicableCountry: NL` + `returnPolicyCategory: MerchantReturnNotPermitted` — accuraat: bij directe digitale download vervalt het herroepingsrecht (art. 6:230p BW).
  - `shippingDetails`: `OfferShippingDetails`, `shippingRate` €0, `deliveryTime` handling+transit 0 dagen — instant download, géén verzendkosten. **NIET** "gratis product": `price` blijft `5.00`; verzendkosten ≠ prijs (gebruiker vroeg hierop door — terecht, maar correct).
  - Tevens `offers.url` toegevoegd (Gumroad-link per product).
- **Verbeterpunt (gebruiker vroeg dit expliciet mee te nemen): losse cover-image per gids.** Geen per-product covers aanwezig (alleen `og-image.png` + brand-logo's). NEW `scripts/build-product-covers.mjs` rendert 3 covers (1200×630 @2x) → `assets/products/{ethisch-hacken-wet,eerste-pentest-playbook,ctf-leerplan}.png`. On-brand: H-monogram (groen-op-donker), wordmark met groene `.nl`, eyebrow-chip, witte titel (2 regels), neon-balk, mono-footer "PDF-gids · Nederlands · vanaf €5" + groene cursor. Merkkleuren uit `assets/brand/README.md`.
- **Correctie na review (gebruiker): "pay what you want" zonder minimum is misleidend.** De gidsen hebben een vloer (€5 per gids, €10 bundel; Gumroad name-your-price-met-minimum). Cover-footer gewijzigd "pay what you want" → "vanaf €5" (3 covers her-gerenderd). Tevens 2 kale plekken in `gidsen.html` (hero-subtitle + bundel `gids-price-sub`) uitgelijnd op het al-accurate patroon van de prijskaartjes ("vanaf €X (pay what you want)").
- **Rasterizer-pivot:** Playwright/chromium (Sessie 171-patroon) faalde — `npx playwright install chromium` gaf 403 "Host not in allowlist: cdn.playwright.dev" (egress-policy). Overgestapt op `@resvg/resvg-js` (prebuilt Rust SVG→PNG, geen browser-download). Layout handmatig in SVG (resvg auto-wrapt geen tekst); systeemfonts Liberation Sans (titel/wordmark) + DejaVu Sans Mono (eyebrow/footer). `@resvg/resvg-js` → `devDependencies` (build-only, naast gifenc/pngjs).
- **Render-en-meet:** alle 3 covers visueel geverifieerd (Read image) — langste titel + langste eyebrow passen binnen het frame.
- **`image`-velden gekoppeld** aan de eigen covers; beide JSON-LD-blokken (CollectionPage + BreadcrumbList) parsen valide via Python `json.loads`.
- **Follow-up (gebruiker vroeg ernaar): bundel als 4e Product toegevoegd.** De bundel (`emzjvj`, "HackSimulator Starter Kit", €10) zat nog niet in de markup terwijl het de primaire CTA is. Toegevoegd als `position: 4` met dezelfde eerlijke velden + eigen cover `assets/products/bundel-starter-kit.png` (eigen footer "3 PDF-gidsen · ~47 pagina's · vanaf €10"; ~47 = officiële Gumroad-telling 13+19+15, een bestaande "~75"-fout in de pagina-tekst tegelijk gecorrigeerd op 3 plekken).
- **Site-brede paginatelling-correctie (gebruiker ving het door).** De per-gids badges op `gidsen.html` zeiden 15/35/25 (=75) en `sample-pentest.html` zei "volledige ~35 pagina's" — in tegenspraak met de officiële PDF-telling (Sessie 165 verifieerde 13/19/15/9 + `gumroad-listings.md`): Wet 13 / Pentest 19 / Leerplan 15 (=47). Bron-conflict niet gegokt → via AskUserQuestion bevestigd: 13/19/15 klopt. Gecorrigeerd: 3 badges (`gidsen.html` 15→13, 35→19, 25→15) + sample-pagina full-count (~35→~19). Sample-gratis "9 pagina's" is een los, consistent getal (blijft). De PDF's zelf waren niet te tellen (3 betaalde = gitignored build-output, `typst` ontbreekt + egress blokkeert install). Schema nu 4 producten, allen valide.
- **Gumroad-brontekst pricing-alignment (advies-vraag gebruiker).** `gumroad-listings.md` adviseerde nog €0-minimum PWYW (oude lead-magnet-strategie) — botst met de bevestigde €5/€10 minima + de live site. Advies gegeven + doorgevoerd: €5/€10 is juist want de gratis Sample Pentest vervult de lead-magnet-rol al (schone funnel-scheiding). Doc bijgewerkt (prijstabel, aanbeveling, setup-stap, suggested price, test-stappen, checklist) met de strategie-shift als historische noot. Gumroad-dashboard zelf (live minima) = handmatige check voor gebruiker.

**Commits:**
- `d67d3af` — `fix(seo): los GSC merchant-listing velden op in gidsen.html Product schema`
- `672c32e` — `feat(seo): losse cover-images per gids voor Product-markup`
- `21567d0` — `fix(seo): cover-footer 'pay what you want' -> 'vanaf €5' (minimum klopt)`
- `00efe59` — `fix(copy): kale 'pay what you want' op gidsen.html krijgt minimum erbij`
- `02ffb1e` — `docs(sessions): Sessie 172 /summary`
- `8580969` — `feat(seo): bundel als 4e Product in gidsen.html merchant-listing markup`
- `5908185` — `fix(copy): paginatelling ~75 -> ~47`
- `4403375` — `fix(copy): paginatelling site-wide consistent op echte PDF-telling 13/19/15`
- `d85e442` — `docs(gumroad): pricing-brontekst naar €5/€10 minimum (was stale €0-PWYW)`

**Learnings:**
- **Merchant-listing-velden voor een digitaal product zijn eerlijk in te vullen — geen cargo-cult nodig.** `MerchantReturnNotPermitted` (NL, herroepingsrecht vervalt bij download) en `shippingDetails` €0/0-dagen (instant download) zijn feitelijk juist; géén verzonnen gtin (een eigen PDF heeft er geen — `brand` is de correcte identifier). Dit volgt de Sessie-169-lijn "geen cargo-cult-SEO".
- **`shippingRate: 0` ≠ "gratis product".** Schema scheidt `price` (5.00, blijft staan) van verzendkosten (0). De gebruiker vroeg hier scherp op door; de markup zegt "€5, €0 verzendkosten", niet "gratis". Belangrijk om dit expliciet te kunnen uitleggen.
- **"Pay what you want" zonder genoemd minimum is misleidend wanneer er een vloer is.** Gumroad PWYW heeft een minimumprijs (€5/gids, €10/bundel); kale PWYW suggereert €0. Altijd de vloer noemen ("vanaf €5 (pay what you want)"). De gebruiker ving dit in mijn cover-footer; het stond ook in 2 hero-plekken. Lijn nieuwe copy uit op het al-accurate prijskaartje-patroon i.p.v. een eigen kale variant introduceren.
- **Een feitelijke claim (paginatelling) overnemen uit ongeverifieerde naburige copy plant een fout voort.** Ik nam "~75 pagina's" over uit bestaande pagina-tekst; die "75" was zelf de som van foute badges (15/35/25). Bij een numerieke claim die op meerdere plekken staat: zoek de canonieke bron (hier `gumroad-listings.md` + de Sessie-165 PDF-telling 13/19/15) en sweep site-breed, niet één plek. Bij bronconflict zónder lokaal verifieerbare ground-truth (PDF's niet te tellen): vraag de gebruiker i.p.v. te gokken (AskUserQuestion bevestigde 13/19/15).
- **Achterhaalde strategie in een planning-doc wordt een toekomstige fout-injectie.** `gumroad-listings.md` adviseerde nog €0-minimum (oude lead-magnet-strategie) terwijl de realiteit €5/€10 is — copy-paste daarvan naar Gumroad zou de prijzen breken. Houd planning-docs in lijn met de live realiteit en bewaar de "waarom-gewijzigd" als korte noot i.p.v. de stale instructie.
- **Egress-policy breekt de bestaande rasterizer-route — ken een browserloos alternatief.** `cdn.playwright.dev` staat niet in de allowlist → chromium niet te downloaden. `@resvg/resvg-js` (prebuilt native, via npm-registry die wél bereikbaar is) rasteriseert SVG→PNG zonder browser. Trade-off: resvg auto-wrapt geen tekst → handmatige regel-layout in de SVG.
- **`package-lock.json` is gitignored in deze repo** → een build-dependency toevoegen vergt een handmatige `devDependencies`-entry in `package.json` voor reproduceerbaarheid (de lockfile draagt 'm niet mee).
- **De kritieke `image`-fix telt pas na deploy + GSC re-crawl** → handmatige actie "Validatie van fix valideren" in GSC.

**Next steps:**
- Handmatig (Heisenberg): na Netlify-deploy in GSC bij de melding "Validatie van fix valideren" klikken.
- Optioneel later: de bundel (`emzjvj`) heeft nog géén Product-markup (alleen de 3 losse gidsen). Bewust buiten scope — GSC flagde alleen de bestaande 3.

**Metrics delta:** `assets/` +~255 KB (3 covers ~85 KB elk; SEO/content-pijler, budgetloos — buiten Terminal Core <400 KB). `gidsen.html` +~2,9 KB JSON-LD. Terminal Core runtime onveranderd (geen `src/`/`styles/`-wijziging). E2E specs 23 / 172 tests (ground-truth, ongewijzigd).

---

## Sessie 171: Logo-herontwerp H-monogram + asset-keten + brand-kit (16 jun 2026)

**Mission:** Gebruiker vroeg het bestaande logo te "vernieuwen/verbeteren/perfectioneren". Het oude logo was een generieke terminal-prompt `>_` (HTB-groene tegel) — technisch netjes maar het meest voorkomende dev-tool-symbool, nul onderscheidend vermogen. Doel: een uniek, ownable, op alle web-formaten goed werkend logo ontwerpen en volledig doorvoeren.

**Work done:**
- **Ontwerp-proces (render-en-meet via Playwright):** 3 richtingen → gekozen H-monogram → 4 verfijningen → V2 "H op een command-line-balk" gewonnen. Twee kandidaten afgeschoten ná browser-render (chevron-crossbar las als "skip/next-track"-mediaknop; losse cursor-block las als een punt → afkorting). Elk concept gerenderd op 512/64/32/**16px** + licht/donker/mono om de favicon-bottleneck te toetsen. Geen rasterizer geïnstalleerd (`rsvg`/`inkscape`/`cairosvg` ontbraken) → SVG→browser-canvas→PNG.
- **Nieuw logo:** H-monogram (de letter H opgebouwd uit terminal-primitieven, staand op een `_`-balk). Eén silhouet, twee betekenissen (naam + terminal). 4 rechthoeken → robuust op 16px.
- **Favicon-keten vervangen + alle inline-kopieën:** `favicon.svg` (bron 32-grid) + `navbar.js` (2×) + `footer.js` (inverted glyph zónder tegel, `viewBox 6 6 20 20`, neon-groen op het donkere frame) + `docs/products/logo.svg` (PDF-cover). PNG's pixel-exact gerenderd: `favicon-96` (afgeronde tegel), `apple-touch` (vol-vlak), `web-app-manifest-192/512` (**vol-vlak maskable** — was incorrect afgeronde transparante tegel), `favicon.ico` (16/32/48 PNG-payloads, met Python struct).
- **Brand-kit NEW `assets/brand/`:** `logo.svg` (tegel) + `logo-on-dark.svg` + `logo-mono-black/white.svg` + PNG-exports 256/512/1024 + `README.md` (gebruik per context + merkkleuren `#9fef00`/`#0d1117`/`#c9d1d9`). Alle 6 varianten visueel geverifieerd op hun bedoelde achtergrond.
- **Social-kaart `assets/og-image.png`:** getrouw herbouwd (terminal-mockup nmap-output) mét het nieuwe H-glyph + subtiele groene glow; browser-render exact 1200×630 (matcht og:image:width/height).
- **og:image cache-bust:** `?v=2` op og:image + twitter:image — **60 referenties over 25 pagina's** (`assets/og-image.png"` → `?v=2"`). Reden: `/assets/* immutable 1jr` + social-scraper-cache; zonder URL-wijziging blijft de oude kaart hangen.
- **Gumroad-PDF's herbouwd (typst 0.13.1):** 3 betaald + sample; logo op cover geverifieerd via PDF-pagina 1. Geserveerde lead-magnet `assets/samples/pentest-playbook-sample.pdf` bijgewerkt (md5 bevestigd).
- **Build-DRY:** `build-pdfs.sh` kopieert het logo nu uit canonieke `assets/brand/logo.svg`; `docs/products/logo.svg` gitignored + `git rm --cached` (build-managed). End-to-end getest: logo.svg verwijderd → build regenereerde 'm (md5 identiek) → 4 PDF's compileerden.

**Commits:** deze sessie — `feat(brand): nieuw H-monogram logo door volledige asset-keten + brand-kit + og-kaart + PDF-rebuild + og:image cache-bust + build-DRY` (hash in git log). 3 betaalde PDF's = handmatige Gumroad-upload (buiten repo).

**Learnings:**
- **Render-en-meet is onmisbaar bij ontwerp:** twee kandidaten leken in het hoofd prima maar faalden zichtbaar pas in de browser (verkeerde associatie: skip-knop / afkorting-punt). Een logo bestaat op het netvlies, niet in je hoofd.
- **Cache maskeert verse code → vals-negatief:** de eerste navbar-verificatie toonde nog `>_` doordat de Python-testserver geen `Cache-Control` stuurt en de browser de oude ES-module cachete; de live DOM uitlezen + no-cache server op verse origin bewees dat de edit klopte. (= troubleshooting #2 in de praktijk.)
- **Cache-bust is per-asset, niet alles-of-niets:** alleen waar `immutable` + gelijkblijvende-URL samenvallen (og:image) is `?v=2` nodig; favicons (root, revalideren) niet; JS-imports niet (≤7-dagen cosmetisch verlies, ES-module-query is invasief + botst "vanilla, no build").
- **"Wie host het bestand" bepaalt de update-route:** site-assets (favicon, og-image, sample) verversen via deploy; Gumroad-PDF's zijn een extern eilandje met eigen kopie → handmatige re-upload. De sample staat byte-identiek in `docs/products/` (build-output, gitignored) én `assets/samples/` (geserveerd, getrackt) = de gedocumenteerde bron→build→publiceer-flow, geen bug.
- **Maskable PWA-iconen horen vol-vlak:** `purpose:"maskable"` betekent dat de OS zelf maskt; transparante hoeken geven artefacten. Glyph binnen de safe-zone, achtergrond tot de rand.
- **DRY via build-stap > 3e getrackte kopie:** het logo zat op 3 plekken in git; door `build-pdfs.sh` het uit de canonieke bron te laten kopiëren (en `docs/products/logo.svg` te gitignoren) is er nog 1 bron + 1 favicon, consistent met de PDF-artifact-flow.

**Next steps:**
- **Handmatig (Heisenberg):** 3 betaalde PDF's opnieuw uploaden naar Gumroad (`juridische-gids.pdf`, `pentest-playbook.pdf`, `leerplan.pdf`).
- Na deploy optioneel social-preview re-scrape forceren (Facebook Sharing Debugger / LinkedIn Post Inspector) als oude kaarten blijven hangen.

**Metrics delta:** `assets/` ~695 KB (gegroeid door `assets/brand/` PNG-exports + herbouwde og-image). Runtime-bundle `src/` gedrag ongewijzigd (navbar/footer SVG-swap, verwaarloosbare grootte-delta). Tests onveranderd: 23 spec-files / 172 test-cases. Geen css/js/_headers/netlify-gedragswijziging.

---

## Sessie 170: Structuuranalyse projectopbouw + veilige repo-opruiming (16 jun 2026)

**Mission:** Gebruiker vroeg de bestands-/mapstructuur te analyseren ("is dit goed of kunnen we verbeteren?") met als harde randvoorwaarde dat de functionaliteit volledig intact blijft. Beoordelen, en alleen veilige verbeteringen doorvoeren.

**Work done:**
- **Plan-mode verkenning (read-only):** structuur in kaart gebracht — top-level dirs + groottes, file-type-distributie (609 files excl. git/node_modules), git-tracked overzicht, `src/`-tree per subdir, grootste JS-files, orphan-heuristiek, JS-laad-mechanisme (entry points), `docs/`-tree, alle HTML-pagina's, cruft-hunt.
- **Verdict: structureel goed georganiseerd.** Geverifieerd: schone domein-indeling `src/` (`commands/{filesystem,network,security,system,special}`, `core`, `ui`, `filesystem`, `gamification`, `tutorial`, `utils`, `analytics`); **nul echte weesmodules** (`blog-theme.js` léék orphan vanuit `src/` maar wordt door alle 10 blogpagina's geladen); geen getrackte backups/cruft; artifact-dirs (`test-results/`, `playwright-report/`, `.playwright-mcp/`) correct gitignored; docs goed beheerd (afgeronde plannen al in `archive/`, levende docs gelinkt vanuit trackers).
- **"By-design", niet aangeraakt:** 9 root-HTML's (= schone Netlify-URLs; verplaatsen breekt prod-URLs+SEO+links), `commands/index.html` (route-pagina `/commands/`, geen code-duplicaat), twee script-laad-conventies (`type="module"` vs. globale `defer` — globals op `window`, uniformeren hoog risico), `assets/legal/*.html` (geserveerde URLs), `SESSIONS.md`+`docs/sessions/` (bewust roterend logsysteem).
- **Veilige acties (commit `480a227`, 7 files, nul js/css/html/_headers/netlify-wijziging):**
  - `docs/products/*.pdf` (5 bestanden, ~632 KB) uit git via `.gitignore`-regel `docs/products/*.pdf` + `git rm --cached` — reproduceerbare build-output uit `.typ` (via `build-pdfs.sh`). Bestanden blijven op schijf; `.typ`-bronnen + geserveerde lead-magnet `assets/samples/pentest-playbook-sample.pdf` (gelinkt vanuit welkomstmail) blijven getrackt.
  - Provenance-header in `docs/products/build-pdfs.sh` (bron→build→publiceer-flow expliciet).
  - NEW `docs/architecture-review.md` (~1 pagina): verdict + by-design-overzicht + product-PDF artifact-flow + "bewust niet gedaan".
- **Cache-bust-analyse (read-only, niet uitgevoerd):** 9 inconsistente `?v=X`-schema's over 23 HTML-bestanden; normaliseren raakt live browsercaching (`max-age=604800`), fout = lokaal onzichtbaar + treft terugkerende bezoekers tot 7 dagen; echte automatisering vereist build-stap (botst "vanilla, no build"). Apart te behandelen indien gewenst.

**Commits:** `480a227` (chore(repo): untrack herbouwbare product-PDF's + structuurreview) + `2034a30` (/summary doc-sync) + `279bddb` (docs(sessions): session-log rotatie-conventie vastgelegd — deblokkeert bulk-rotatie; vervolgvraag binnen dezelfde sessie).

**Learnings:**
- **De PDF-"duplicaat" was geen bug maar een gedocumenteerde bron→publiceer-pijplijn** (`.typ` → `docs/products/*.pdf` build → kopie naar `assets/samples/`). `cmp` bevestigde byte-identiek. De juiste fix is build-output untracken, niet één van de twee verwijderen.
- **"Opruimen onder de vlag grondig" durven weigeren:** de in plan-mode goedgekeurde doc-verplaatsing (afgeronde plan-docs → `archive/`) tijdens uitvoering laten vallen toen bleek dat de inbound refs historische log-narratie zijn in `current.md` (een door `validate-docs.sh` bewaakt bestand) en één doc nog "pending" was. Cosmetische winst (1 map dieper) < kosten (gated historisch log editen). Generaliseert de Sessie-169-learning naar de eigen workflow.
- **Orphan-heuristiek moet álle consumers scannen:** eerste sweep miste `blog/`-HTML → vals "orphan"-alarm op `blog-theme.js`. Verifieer vóór je "verwijderbaar" claimt — exact het patroon dat een echte breuk had veroorzaakt.
- **Plan-mode AskUserQuestion bij scope-keuze + risico-asymmetrie:** scope (veilig vs. rapport vs. diepere refactor) is gebruikers-territorium; cache-bust-risico expliciet uitgelegd vóór de keuze i.p.v. mechanisch uitvoeren.

**Next steps:**
- Optioneel: cache-bust `?v=X` normaliseren (apart, mét E2E-verificatie) — niet gebundeld in opruiming.
- Session-log-conventie vastgelegd in NEW `docs/sessions/README.md` (range-naamgeving `archive-sNNN-sMMM.md`; legacy `archive-q*` bevroren want fout gelabeld met 2025-content). SESSIONS.md-index gecorrigeerd (stale "88-160" → "81-170"). **Sessie 175 = eenmalige catch-up** van de backlog (Sessie 81-164 → range-archieven). Deferral-blokkade (ontbrekende bestemming) opgelost.

**Metrics delta:** Bundle runtime onveranderd (geen `src/`/`styles/`-wijziging); test-suite onveranderd (197 tests / 23 spec files); git-tree −632 KB binaries (PDF's untracked). validate-docs fast + `--deep` exit 0.
