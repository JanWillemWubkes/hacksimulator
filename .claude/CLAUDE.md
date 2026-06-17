# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 172)
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

### Sessie 169: GSC-indexeringsanalyse + SEO-fix niet-geïndexeerde pagina's (16 jun 2026)
⚠️ **Never:**
- Een GSC "niet-geïndexeerd"-melding als bug behandelen zonder de bron-kolom te lezen — "Website"-bron (redirect/canonical) = jouw config en vaak gewenst gedrag; "Google-systemen" (gevonden/gecrawld niet geïndexeerd) = crawl-budget/autoriteit/tijd, niet patchbaar in code. 17 van 19 meldingen waren benign of niet-fixbaar; slechts 2 echte zelf-veroorzaakte fouten.
- Indexering-fixes plannen op de GSC-aantallen alleen — de screenshots tonen tellingen, niet URL's. Pas de exacte URL-lijsten (gebruiker klikt rij → "Voorbeelden") onthulden het patroon (extensieloze duplicaten + relatieve `index.html`-links) dat op educated guesses gemist was.
- Interne link-depth als silver bullet voor "niet geïndexeerd" verkopen — `cybersecurity-tools` had 9 inbound related-card-links en zat tóch vast. (En: eerste inbound-telling was fout doordat 'ie alleen absolute `/blog/`-links ving, niet relatieve related-cards — corrigeer de meting vóór de conclusie.)
- Cargo-cult-SEO toevoegen onder de vlag "grondig" — expliciete `<meta name="robots" content="index,follow">` doet niets (default is al index,follow); bewust uit scope ondanks "volledige sweep"-verzoek.

✅ **Always:**
- Relatieve `href="index.html"` in een footer = stille duplicaat-fabriek op Netlify — `/foo.html` wordt óók op `/foo` (200) geserveerd ongeacht `pretty_urls=false`, en `index.html` → `/blog/index.html` naast canonical `/blog/`. Link naar de canonical (`/blog/`, `/`) zodat Google geen duplicaat ontdekt.
- Per-URL diagnose tegen de echte GSC-lijst = scheidslijn echte fout vs. benign (3 redirect-varianten + 1 alt-canonical = werkend; extensieloze URL's = historisch, canonical consolideert vanzelf).
- Eerlijk de verwachting kalibreren: code-fixes ruimen zelf-veroorzaakte ruis op en geven een nudge (verse `lastmod` op gewijzigde pagina's, homepage-link als hoogste-autoriteit signaal), maar de dominante hefboom voor een jong domein is off-page (backlinks + tijd) — geen sweep forceert indexering.
- Browser-onafhankelijk verifiëren wat meetbaar is: XML-validatie (25 URLs), nul resterende duplicaat-links repo-breed, link-resolutie, `validate-docs.sh` exit 0. Volledig: `docs/sessions/current.md` Sessie 169.

### Sessie 168: Blog-tabel-uitlijning fix (Filter ↔ beschrijving) (15 jun 2026)
⚠️ **Never:**
- Aannemen dat een nette HTML-`<table>` vanzelf uitlijnt — zonder eigen CSS valt 'ie terug op browser-default `vertical-align: baseline`; bij een afgebroken (multi-line) cel lijnt de buurcel uit op de baseline van de laatste regel → rijen uit sync. `styles/blog.css` had nul tabel-regels (latente bug, pas zichtbaar toen een filter-cel afbrak).
- Een uitlijn-fix "verifiëren" op het oog via screenshot — meet het: `getBoundingClientRect().top` cel-1 vs cel-2 per rij (`filterTop == descTop`) is binair pass/fail, ook over dark/light/375px.

✅ **Always:**
- Fix op cascade-niveau wanneer de oorzaak een *ontbrekende* regel is, niet een verkeerde override — één scoped `.blog-post-content table/th/td`-blok repareerde alle 4 blog-tabellen (wireshark/nmap/hashcat/wachtwoord-beveiliging) tegelijk i.p.v. symptoom-per-pagina.
- `vertical-align: top` op `th,td` als kern-fix tegen baseline-drift bij wrappende cellen; `border-collapse: collapse` + rij-randen voor leesbaarheid.
- Bewezen patroon hergebruiken (`legal.css` tabel-styling) maar met de doel-context z'n eigen CSS-variabelen (`--spacing-*`/`--color-*`) → thema-aware "gratis", conform architecture-patterns.md §1. Volledig: `docs/sessions/current.md` Sessie 168.

### Sessie 167: Doc-drift fix M9 — esbuild post-launch-blok uit milestone-sectie (15 jun 2026)
⚠️ **Never:**
- Een sectie↔tabel-drift "fixen" door de tabelcijfers te herschrijven — de echte fix is fysieke *verplaatsing* over een h2-grens. Check 6's awk-range is h2-emoji-anchored (`/^## 🧹 M9:/,/^## 🎓 M6:/`), dus een h3-subsectie erft de milestone-checkbox-telling van z'n omhullende h2; 5 `[ ]` binnen M9 → 19/24 i.p.v. 19/19.
- Topisch verwante toekomst-scope onder een afgeronde milestone-h3 parkeren — esbuild (Sessie 162, post-launch, raakt PRD §13 red line) zat onder M9 (bundle/cache-sprint, ✅ Voltooid Sessie 110). Verwantschap ≠ sprint-lidmaatschap; het heropende M9 vals in `--deep`.
- Vertrouwen dat de pre-commit-gate (fast-mode) sectie-drift vangt — fast-mode telt geen sectie-checkboxes; alleen `--deep` doet dat. Een drift die fast passeert maar `--deep` faalt, kwam binnen via checkbox-telling (het gat dat Sessie 158 #23.1 dichtte).

✅ **Always:**
- Bij een (a)/(b)-scope-beslissing over milestone-toewijzing: bron-onderbouwing eerst (Status, `Total Tasks`-footer, sub-sectie-som, "geen pre-launch werk"-labels, tag-sessie) en de keuze met aanbeveling via AskUserQuestion vóór de edit — milestone-membership is scope-territorium (Heisenberg).
- Blok-verplaatsing in grote docs (>25k tokens) via Python met occurrence-asserts: h3-uniciteit, behoud `[ ]`-count in blok, ná-move M9-range 0 `[ ]`/19 `[x]`, h3 buiten range, totaal-`[ ]` ongewijzigd. Asserts bewaken semantiek, niet witruimte.
- Cosmetische witregel-controle ná een geautomatiseerde markdown-move — een cut neemt de sectie-scheider mee (ontbrekende leegregel), een paste verdubbelt er een; occurrence-asserts zien dat niet.
- `--deep` exit 0 als harde gate ná de fix (M9 `OK 19/19` + `OK 100%`). Volledig: `docs/sessions/current.md` Sessie 167.

**Rotation:** Top-6 huidig: 167-168-169-170-171-172 (Sessie 165 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie nu vastgelegd (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. Bulk-rotatie current.md-entries was gedeferd t/m 169 (ontbrekende bestemming = nu opgelost). **Sessie 175 = eenmalige catch-up:** archiveer current.md Sessie 81-164 → range-archieven (voorstel `archive-s081-s120.md` + `archive-s121-s164.md`), houd 165+ in current.md, corrigeer SESSIONS.md-index; daarna steady-state per README. Pre-Sessie 162 historie → `docs/sessions/current.md`.

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
**Sessie counter:** 172

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

**Last updated:** 17 jun 2026 (Sessie 172 — GSC "Verkopersvermeldingen"-fix `gidsen.html` Product-markup: 4 velden eerlijk per digitaal product + NEW per-gids covers via `scripts/build-product-covers.mjs` (resvg) + "pay what you want"→"vanaf €5/€10". Volledig: `docs/sessions/current.md`)
**Version:** 5.46 (volledige version-historie + per-sessie scope-notes: `docs/sessions/current.md`)

