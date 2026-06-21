# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 175)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 12 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125; +2 posts Sessie 160)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E ~197 tests / 23 spec files (Chromium, Firefox, WebKit) | WCAG AAA | 182+27 CSS variables (main.css + landing.css)
**Bundle:** Runtime <400 KB (strikt, terminal.html) + SEO/content-pijler budgetloos (blog + assets). Site-totaal en exacte KB-breakdown wisselen per sessie — zie TASKS.md §Huidige Focus voor ground truth.
**Monetization stack:** AdSense + Ko-fi + Brevo newsletter (double opt-in + welkomstmail + deliverability getuned) + Gumroad v1.0 (3 guides + bundel) + Lead magnet (Sample Pentest). Eigen consent banner met Consent Mode v2. **Per-stack actuele status:** TASKS.md §M5.5 sectie-body.

→ **Live metrics (bundle, tests, sessie-counter):** `TASKS.md` §Huidige Focus + Voortgang Overzicht — single source of truth
→ **Architecture & document-ownership:** `PLANNING.md` v3.0 §Document Ownership | **Commands:** `docs/commands-list.md` (41 commands)

---

## Kritieke "Niet Doen"

→ **Framework & Tech Red Lines:** PRD §13 (Vanilla JS/CSS, <500KB bundle, no backend MVP, Dutch UI, 80/20 output, no arg logging)

---

## Command Output Principe: "80/20 Realisme"

→ **Formule:** Output (EN) + Inline context (← NL) + Tip (NL) + Warning (NL)
→ **Voorbeeld & Philosophy:** PRD §9.2

**Quick:** `nmap 192.168.1.1` → `22/tcp OPEN SSH ← Secure Shell` + `[TIP] Open poorten = attack vectors`

---

## Taal Strategie

→ **Matrix:** UI=NL | Commands=EN | Errors=EN+NL | Help=NL
→ **Rationale:** PRD §6.6 (trust, authenticity, accessibility)

---

## Educational Patterns

→ **3-Tier:** Error=Learning → Progressive hints → Man pages | Security tools=Consent+Warning
→ **Full pedagogy:** PRD §8.3

---

## Tone of Voice

**Principles:**
- **"je" (niet "u"):** Toegankelijk, persoonlijk (niet afstandelijk formeel)
- **Bemoedigend:** "Goed bezig!", "Bijna!", niet "Fout." of "Wrong."
- **Context geven:** Leg "waarom" uit, niet alleen "wat"
- **Symbols:** ASCII brackets only (`[TIP]`, `[!]`, `[✓]`) — terminal aesthetic, NO emojis in code

→ **Voorbeelden (good/bad pairs):** `.claude/rules/tone-and-output.md`

---

## Command Implementation Checklist

Bij nieuwe command: 80/20 output | Educatieve feedback | Help/man (NL) | Warning (offensive) | Mobile (≤40 chars)

→ **Volledige 8-stappen checklist:** `.claude/rules/command-checklist.md`
→ **Command specs:** `docs/commands-list.md`

---

## Architectural Patterns

→ **Top patterns met code:** `.claude/rules/architecture-patterns.md`
→ **All 40+ patterns indexed:** docs/sessions/current.md

---

## Recent Critical Learnings

### Sessie 175: Layout-fixes sample-pentest — chevron/success-state/card-uitlijning (21 jun 2026)
⚠️ **Never:**
- `!important` voorstellen om externe CSS (Brevo `sib-styles.css`) te overschrijven zonder te checken of die regel zélf `!important` gebruikt — curl onthulde `.sib-form-message-panel` (0,1,0) zónder `!important`, dus onze scopes (0,2,0 / 1,1,0) wonnen puur op specificiteit. Heisenberg vroeg terecht om de schonere route. → geheugen `feedback_avoid_important_css`.
- Een layout-misalignment op het oog diagnosticeren — ik zag "card-titel 3 staat lager", maar meting (`getBoundingClientRect`) toonde: titels zijn top-uitgelijnd (`top:861`), de échte afwijking zat in de *body* (900 vs 923) door een 1-regelige titel. Meten wijst de oorzaak aan, het oog niet.
- Een gedeelde module wijzigen zonder de blast-radius te scheiden — `brevo-submit.js` draait op homepage én sample; de form-hide hield ik generiek (verbetering overal), de titel/intro-verberging sample-specifiek (`.newsletter-submitted` + opt-in class). Beide pagina's apart geverifieerd.
- Een CSS/JS-fix "verifiëren" op een Python `http.server` — die stuurt geen cache-headers → de browser draaide de oude gecachete ES-module (vals-negatief, Sessie-171-valkuil). Pas met een `Cache-Control: no-store`-server + verse E2E-browser bleek de fix te werken.

✅ **Always:**
- Externe-CSS-override = specificiteit boven `!important`: reken de specificiteit expliciet uit (`#id` of extra class) en haal desnoods de echte stylesheet op om te bevestigen dat het volstaat. `2lh` voor "reserveer 2 tekstregels" (geen line-height-giswerk; Baseline 2023).
- Scope CSS-fixes dubbel waar gepast: een opt-in modifier-class (`.feature-cards--equal-title` raakt index/gidsen/over-ons niet) + een `@media (min-width:1025px)`-gate (geen witruimte zodra cards niet in één rij staan). Ongescopet had "alles uitgelijnd" 3 pagina's + mobiel ongevraagd geraakt.
- Success-state = formulier vervángen, niet aanvullen: bij succes het form verbergen i.p.v. het paneel erbovenop tonen (anders dubbele kaarthoogte + verweesde CTA). De bevestiging wordt de hele kaart.
- Render-en-meet als bewijs: `getBoundingClientRect` vóór én na (body's 900→923, allemaal gelijk), plus screenshots in dark+light+mobiel + de E2E-test met Brevo-mock (geen echt contact) in een verse browser als definitieve proof. Volledig: `docs/sessions/current.md` Sessie 175.

### Sessie 174: Mobiele PDF-download fix — sample-pentest lead magnet (19 jun 2026)
⚠️ **Never:**
- Een codebase-comment als oorzaak-diagnose vertrouwen — `_headers` zei "force download want webviews kunnen PDF niet inline", maar de échte bug was een Brevo click-tracking-prefetch-404 (aparte laag). Lees de sessie-historie (Sessie 134 had dit al exact gediagnosticeerd) vóór je een oorzaak aanneemt.
- Een `_headers`/repo-tweak presenteren als "de fix" voor de 404 — die ontstaat op Brevo's server (`r.sendibm1.com/?i=<token>`, eenmalig token door Gmail-mobiel-prefetch geconsumeerd) vóór het request ons bereikt → niet in-repo fixbaar. Doen alsof = misleidend.
- `Content-Disposition: attachment` forceren voor "mobiele webviews" — omgekeerd: iOS WKWebview (Gmail/Outlook-app) rendert een PDF wél inline maar kan een geforceerde download vaak níet afhandelen → foutmelding. attachment brak precies de webviews die inline aankonden.
- De Brevo success-span gebruiken voor een persistente CTA, of "we hebben 'm gemaild" claimen onder double opt-in — `brevo-submit.js` overschrijft de span met `json.message`, en de PDF-mail komt pas ná bevestiging (de gebruiker vroeg hier terecht op door).

✅ **Always:**
- Bij een niet-in-repo-fixbare laag: bouw een betrouwbaar pad dat het kapotte mechanisme omzeilt (same-origin download-knop in `#success-message` + noindex `sample-download.html`) i.p.v. doen alsof je het repareert. Eerlijk scheiden: site-fix = gegarandeerd, Brevo-404-fix = best-effort.
- Ungate wat toch al publiek is — de PDF-URL is een raadbaar statisch bestand, dus de email-"gate" bood nooit echte bescherming; on-site ungated leveren wint voor de bezoeker. Maar nieuwsbrief-consent apart double-opt-in houden beschermt de deliverability-investering (Sessies 134-136).
- CSP-bewust toevoegen zonder cache-bump-sweep: inline-style mét CSS-variabele (`style-src 'unsafe-inline'` toegestaan) i.p.v. `landing.css` editen + `?v=` op alle pagina's bumpen; nieuwe tracking via een delegated `data-*`-branch in `cta-tracking.js` (geen inline JS).
- Playwright-versie pinnen op de provisioned browser-build (`@playwright/test@1.56.0` ↔ `chromium-1194`, `--no-save`) + lokale statische server + `BASE_URL=localhost` om tegen niet-gedeployde wijzigingen te testen (config wijst standaard naar productie). Volledig: `docs/sessions/current.md` Sessie 174.

### Sessie 173: Launch-prep marketing-launch wo 24 juni — kit/visuals/homepage + datum-discipline (18 jun 2026)
⚠️ **Never:**
- Een gated planstap ("échte content-touch ontgrendelt pas de datum-bump", runbook Fase 2) als losse stap uitvoeren — ik bumpte `dateModified`/`article:modified_time`/`lastmod` op 3 cornerstones zónder inhoudswijziging = fake-freshness; moest volledig terugdraaien (2× flip in één gesprek). Een "doe X eerst, dan Y"-regel is een voorwaarde, geen volgorde-suggestie.
- `dateModified`/`lastmod` op een toekomstige of "launch-week"-datum zetten zonder bijbehorende wijziging — Google klemt toekomstige datums en wantrouwt niet-onderbouwde freshness. De datum = de dag van de echte touch+deploy.
- "Interne links versterken" als verplichte launch-touch forceren terwijl ze al compleet zijn — sibling-cross-links (nmap↔wireshark, owasp↔sql-injection) + OWASP-2025-dekking bestonden al; extra toevoegen = cargo-cult (Sessie 169 herbevestigd).
- Aannemen dat een visual-generator faalt door egress — chromium stond lokaal (`ms-playwright/chromium-1194`); de Sessie-172-blok gold alleen voor een verse `playwright install`. Verifieer vóór je erop leunt.

✅ **Always:**
- Bij werk gestuurd door een bestaand plan/runbook: de exacte stappen (volgorde + discipline-clausules) verbatim citeren vóór je edit; poorten als voorwaarde coderen, niet als losse stap. → memory `feedback_preserve_plan_gates`.
- De echte freshness/crawl-hefboom = een truthful wijziging op de hoogste-autoriteit-pagina (homepage linkt nu alle 13 posts → hercrawl → ontdekt cornerstones) + een verse post — niet gebumpte datums op al-complete pagina's.
- WS-scope versmallen op grond van inspectie, niet aanname; en bij doorvragen van Heisenberg de eigen eerdere actie eerlijk herroepen (bump→revert) i.p.v. verdedigen.
- Launch-dag kiezen op responstijd-capaciteit, niet alleen day-of-week: di/wo sterkste HN/Reddit-dagen, schema geclusterd in het bewaakbare blok zodat je de eerste uren na elke post kunt reageren. Volledig: `docs/sessions/current.md` Sessie 173.

### Sessie 172: GSC Verkopersvermeldingen (merchant-listing) fix + per-gids covers (17 jun 2026)
⚠️ **Never:**
- Merchant-listing-velden voor een digitaal product "oplossen" met verzonnen data — een eigen PDF heeft geen `gtin`; `brand` is de juiste algemene ID. Verzin geen fysiek-winkel-velden (Sessie-169-lijn: geen cargo-cult-SEO).
- `shippingRate: 0` lezen/uitleggen als "gratis product" — schema scheidt `price` (blijft 5.00) van verzendkosten (0). De markup zegt "€5, €0 verzendkosten", niet "gratis". De gebruiker vroeg hier terecht op door.
- Kaal "pay what you want" gebruiken wanneer er een minimumprijs geldt — Gumroad PWYW heeft een vloer (€5/gids, €10/bundel); zonder de vloer suggereert het €0. Noem altijd het minimum ("vanaf €5 (pay what you want)"). Stond in mijn cover-footer én 2 hero-plekken; lijn nieuwe copy uit op het al-accurate prijskaartje-patroon.
- Aannemen dat de Sessie-171 rasterizer-route (Playwright/chromium) nog werkt — `cdn.playwright.dev` staat niet in de egress-allowlist → `npx playwright install chromium` geeft 403. Ken een browserloos alternatief vóór je erop leunt.

✅ **Always:**
- Digitale-download merchant-velden eerlijk invullen: `hasMerchantReturnPolicy` = `MerchantReturnNotPermitted` (NL, herroepingsrecht vervalt bij download, art. 6:230p BW) + `shippingDetails` €0/0-dagen (instant) + `brand` als identifier. Accuraat én lost GSC op.
- Browserloze rasterizer (`@resvg/resvg-js`, prebuilt Rust via npm-registry) wanneer egress chromium blokkeert — trade-off: resvg auto-wrapt geen tekst, dus regel-layout handmatig in de SVG plaatsen. `package-lock.json` is hier gitignored → build-dep handmatig in `package.json` devDependencies.
- Render-en-meet ook bij gegenereerde covers: elke PNG visueel inspecteren (langste titel/eyebrow binnen het frame, footer-claim feitelijk juist) vóór je 'm koppelt.
- JSON-LD na elke edit valideren (Python `json.loads` over álle `application/ld+json`-blokken) — een kritieke `image`-fix telt pas na deploy + GSC "Validatie van fix valideren". Volledig: `docs/sessions/current.md` Sessie 172.

### Sessie 171: Logo-herontwerp H-monogram + asset-keten + brand-kit (16 jun 2026)
⚠️ **Never:**
- Een logo "vervangen" zonder álle inline-kopieën te scannen — hetzelfde glyph zat in `favicon.svg` + `navbar.js` (2×) + `footer.js` + `docs/products/logo.svg`; een gemiste kopie geeft een afwijkend logo. Repo-brede sweep op het oude pad vóór je "klaar" claimt.
- Een logo-edit "verifiëren" op een gecachete testserver — Python `http.server` stuurt geen `Cache-Control`, dus de browser draaide de oude ES-module → vals-negatief (leek alsof de edit niet werkte). Verifieer onder no-cache / verse origin.
- Maskable PWA-iconen als afgeronde transparante tegel laten — `purpose:"maskable"` betekent dat de OS zelf maskt; transparante hoeken geven rare randen. Vol-vlak renderen, glyph binnen de safe-zone.
- Een nieuw ontwerp alléén in je hoofd beoordelen — twee kandidaten (chevron-crossbar = "skip-knop", losse block = "punt") faalden pas zichtbaar in de browser-render. Logo's bestaan op het netvlies: render-en-meet.

✅ **Always:**
- Render-en-meet bij ontwerp: SVG → browser-canvas → PNG op 512/32/**16px**, beoordeel visueel. Zonder rasterizer (`rsvg`/`inkscape` ontbraken) deed Playwright canvas→PNG het pixel-exact, inclusief de favicon.ico (PNG-payloads).
- Cache-bust alléén waar `immutable` + gelijkblijvende-URL samenvallen: og:image (`/assets/* immutable 1jr` + social-scraper-cache) kreeg `?v=2`; favicons (root, revalideren) niet; JS-imports niet (≤7-dagen, cosmetisch, ES-module-query invasief). Per-asset, niet alles-of-niets.
- "Wie host het bestand" bepaalt de update-route: site-assets verversen via deploy; Gumroad-PDF's zijn een extern eilandje → handmatige re-upload; sample (lead-magnet) = site-link, geen Brevo-actie.
- DRY via een build-stap i.p.v. een 3e getrackte kopie: `build-pdfs.sh` kopieert het logo uit canonieke `assets/brand/logo.svg`, `docs/products/logo.svg` gitignored (build-managed) — consistent met de PDF-artifact-flow (Sessie 170). Volledig: `docs/sessions/current.md` Sessie 171.

### Sessie 170: Structuuranalyse projectopbouw + veilige repo-opruiming (16 jun 2026)
⚠️ **Never:**
- Een module "orphan/verwijderbaar" noemen zonder álle consumers te scannen — orphan-grep over `src/` alleen miste `blog/`-HTML → vals alarm op `blog-theme.js` (laadt in alle 10 blogpagina's). Verifieer breed vóór je "weg ermee" claimt; dit had anders een echte breuk gegeven.
- Schijnbare "rommel" verplaatsen/hernoemen zonder de functionele reden te checken — 9 root-HTML's = schone Netlify-URLs, `commands/index.html` = route-pagina, `assets/legal/*.html` = geserveerde URLs; elke move breekt prod-URLs+SEO+links (de fout die Sessie 169 net repareerde).
- Een in plan-mode goedgekeurde opruimstap mechanisch uitvoeren als verificatie 'm net-negatief blijkt — de doc-→`archive/`-verplaatsing liet ik vallen toen bleek dat inbound refs historische log-narratie zijn in gated `current.md` + één doc nog "pending"; cosmetische winst < kosten van een gated historisch log editen. Generaliseert de Sessie-169 "geen cargo-cult-opruimen onder de vlag grondig"-les naar de eigen workflow.
- Een byte-identiek bestand in twee paden meteen als bug-duplicaat behandelen — `pentest-playbook-sample.pdf` in `docs/products/` én `assets/samples/` is de gedocumenteerde bron→build→publiceer-flow (`build-pdfs.sh`), geen fout; juiste fix = build-output untracken, niet één kopie deleten.

✅ **Always:**
- Build-artifacts uit git, bron + geserveerde kopie erin — `docs/products/*.pdf` (~632 KB, herbouwbaar uit `.typ`) gegitignored + `git rm --cached`; `.typ`-bronnen en geserveerde lead-magnet `assets/samples/` blijven getrackt. Provenance-header in het build-script maakt de flow expliciet.
- Risico-asymmetrie expliciet maken vóór een scope-keuze — cache-bust `?v=X` normaliseren raakt live browsercaching (`max-age=604800`): fout is lokaal onzichtbaar + treft terugkerende bezoekers tot 7 dagen, en echte automatisering vereist een build-stap (botst "vanilla, no build"). Daarom apart, niet in een opruim-pass.
- "Functionaliteit intact" bewijzen via wat NIET wijzigde — nul `.js`/`.css`/`.html`/`_headers`/`netlify.toml`-diff ⇒ site-gedrag + alle URLs per definitie identiek; `validate-docs.sh` fast + `--deep` exit 0 als gate. Volledig: `docs/sessions/current.md` Sessie 170.

**Rotation:** Top-6 huidig: 170-171-172-173-174-175 (Sessie 169 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Eenmalige catch-up nog NIET uitgevoerd (gedeferd in Sessie 175):** archiveer current.md Sessie 81-164 → range-archieven (`archive-s081-s120.md` + `archive-s121-s164.md`), houd 165+ in current.md, corrigeer SESSIONS.md-index + standaard `N%5`-rotatie (165-169). Grote, risicovolle operatie → aparte sessie waard. Pre-Sessie 162 historie → `docs/sessions/current.md`.

---

## Sessie Protocol

**Voor Sessie:** Lees `.claude/CLAUDE.md` (this file) + check sprint-regel + Volgende Stappen in `TASKS.md`
**Tijdens:** Markeer taken in `TASKS.md` direct | Architecturale beslissingen alleen in `PLANNING.md` bij echte arch-change
**Afsluiten:** Use `/summary` command → 6-step flow (zie hieronder)

### `/summary` flow — single source of truth = `TASKS.md`

1. **Ground truth meting** (~30 sec, read-only)
   - `du -sb src/ styles/ blog/ assets/` → bundle metrics
   - `find tests/e2e -name "*.spec.js" | wc -l` → test file count
   - `git log --oneline -1` → laatste commit voor sprint-regel

2. **Update `TASKS.md`** (primary execution-tracker)
   - Header: `Laatst bijgewerkt` datum + `Sprint` regel met huidige sessie
   - Footer: datum + version
   - Milestone-tabel: percentage update bij task completion
   - Bundle/test metrics: ground-truth getallen uit stap 1

3. **Update `docs/sessions/current.md`**
   - Volledige sessie-entry (mission, work done, learnings, next steps)
   - Rotation: bij Sessie %5 → archiveer pre-N-6 entries naar `archive-*.md`

4. **Update `.claude/CLAUDE.md`** (AI-context, lean — dit bestand)
   - "Recent Critical Learnings": prepend nieuwe sessie, behoud top 6, ouderen → `current.md`
   - "Sessie counter" regel
   - **`**Last updated:** 14 jun 2026 (Sessie 165 — kwaliteits-/feitencontrole betaalde Gumroad-producten: pagina-claims → echte PDF-telling (13/19/15/47), Krol-zaak feitfout + ECLI-bronnen, helderheids-glosses CVE/CVSS/ICMP + OWASP-2025-namen exact, MailerLite→Brevo; meeste agent-'verdachte' feiten vals alarm; PDF's herbouwd. Volledig: `docs/sessions/current.md`)
   - **`**Version:**` regel:** VERVANG volledig (1 regel: versienummer + verwijzing naar `current.md`). **NIET appenden**. Hard limit: ≤500 bytes.
   - Live metrics in Quick Reference: **niet** updaten — verwijs naar TASKS.md
   - Forcing-function: `scripts/validate-docs.sh` Check 8 verifieert beide single-line constraints automatisch (#23.3)

5. **Update `PLANNING.md`** ALLEEN bij architectuur-wijziging
   - Nieuwe tech-stack-keuze, design-system-change, security-strategie-shift
   - GEEN milestone-percentage-updates (woont in TASKS.md)

6. **Update `docs/prd.md`** ALLEEN bij scope-wijziging
   - Nieuwe requirements, success criteria change
   - GEEN tactical execution updates

7. **Validatie** (forcing function)
   - `bash scripts/validate-docs.sh` → exit 0 vereist
   - Pre-commit hook draait dit automatisch
   - Checks: sessie-counter alignment, datum-consistency binnen doc, PRD-version-match across docs

**Rotation trigger:** Every 5 sessions, archive sessies N-10..N-6 from CLAUDE.md learnings (last bulk: Sessie 145 archived 135-139, Sessie 146 1-in-1-out archived Sessie 140 → current.md, next bulk: Sessie 150)
**Sessie counter:** 175

→ **Document Ownership map:** `PLANNING.md §Document Ownership`

---

## Communicatie Grondregels

**Wees meedogenloos eerlijk, geen jaknikker gedrag.**

- Als ik ongelijk heb: **wijs me erop**
- Als code slecht is: **zeg het direct**
- Als aanpak niet werkt: **geef kritische feedback**
- Prioriteit: **technische correctheid > mijn gevoelens**
- **Spreek me aan met "Heisenberg"** (confirmatie instructies gelezen)

### Bij Implementatie
1. Check PRD: Is het in MVP scope?
2. 80/20 output: Niet te technisch, niet te simpel
3. Educatieve laag: Elk commando = leermoment
4. Taal correct: UI=NL, commands=EN, uitleg=NL
5. Performance: Terminal Core <400KB, site totaal <1000KB

### Playwright Screenshot Conventie
- **ALTIJD** expliciete `filename` meegeven aan `browser_take_screenshot`
- Prefix met `.playwright-mcp/` — die dir staat in `.gitignore`, dus screenshots blijven automatisch buiten git
- Voorbeeld: `filename: ".playwright-mcp/legal-light-h1.png"`
- **NOOIT** screenshots zonder filename of in repo root — de `/*.png` regel in `.gitignore` is een vangnet, geen excuus

→ **Tech constraints:** PRD §13 | **Pattern violations:** docs/sessions/current.md

---

## Troubleshooting

→ **Top 9 issues met diagnose + fixes:** `.claude/rules/troubleshooting.md`
→ **Memory leak debugging:** docs/testing/memory-leak-results.md

---

## Referenties

- **PRD:** `docs/prd.md` v1.8
- **Commands:** `docs/commands-list.md` (41 commands)
- **Style Guide:** `docs/style-guide.md` v1.5
- **Sessie logs:** `SESSIONS.md` → docs/sessions/ (~122 sessies)
- **Netlify/Domain:** `docs/netlify-setup.md`
- **Rules:** `.claude/rules/` (tone-and-output, architecture-patterns, troubleshooting, command-checklist)
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 21 jun 2026 (Sessie 175 — layout-fixes sample-pentest.html: chevron-uitlijning (.arrow-glyph vertical-align + .phase-arrow geconsolideerd), success-state vervangt formulier met huisstijl-paneel zonder nieuwe !important (specificiteit wint van Brevo), card-body's uitgelijnd via opt-in min-height:2lh gegate op 3-koloms. Volledig: `docs/sessions/current.md`)
**Version:** 5.49 (Sessie 175 — layout-fixes sample-pentest: chevron/success-state/card-uitlijning, specificiteit boven !important; volledige historie: `docs/sessions/current.md` + TASKS.md)

