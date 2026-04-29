# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 10 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E 165 tests across 31 suites (22 files, 3 browsers) | WCAG AAA | 182 CSS variables (main.css) + 27 (landing.css) = 209 totaal
**Bundle:** Site totaal **~1192 KB** (geverifieerd 06-04-2026) + sample-pentest landing 15 KB + sample PDF 90 KB → effectief ~1297 KB | Splitsing: src/ 604 KB, styles/ 249 KB, blog/ 306 KB (10 posts + JSON-LD), assets/ 597 KB (screenshots 401 + OG image 151) | ⚠️ Runtime budget herijking nodig — blog SEO assets vallen buiten origineel 400 KB Terminal Core budget
**Monetization:** AdSense (10 units) + Ko-fi donaties + Brevo newsletter (double opt-in + welkomstmail live) + **Gumroad products v1.0** (3 guides + bundel) + **Lead magnet** (`/sample-pentest.html` Brevo opt-in → 9-pagina sample) | Eigen consent banner (Consent Mode v2)

→ **Live metrics:** `TASKS.md` regels 9-26 (meest recente tellingen)
→ **Architecture:** `PLANNING.md` v2.9 | **Commands:** `docs/commands-list.md` (41 commands)

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

### Sessie 133: Lead Magnet Landing + Dual-Fire Tracking + Brevo Submit Fix (26-29 april 2026)
⚠️ **Never:**
- `data-product-id` overloaden voor gratis lead-magnet CTAs — semantiek vervaagt en GA4-conversiedoel `product_cta_click` gaat revenue-funnel en lead-funnel dubbel tellen
- `lead_magnet_signup` firen zonder óók `newsletter_signup` op sample-pages — bestaande GA4-conversiedoelen leunen op de globale teller; sample-signers raken anders uit lijstgroei-rapporten
- Aannemen dat Brevo's main.js de success-panel toggelt bij `{success:true}` JSON-response — POST keert 200 maar `#success-message` blijft op `display:none`. User ontvangt welkomstmail zonder visuele bevestiging; eigen submit-handler met capture-phase + `stopImmediatePropagation()` is verplicht voor élk Brevo-form

✅ **Always:**
- Aparte `data-lead-magnet` attribute + tweede `closest()` branche met return-guard tussen branches in `cta-tracking.js` — voorkomt dubbel-firing en schaalt zero-cost naar volgende samples
- Bij eigen Brevo-submit handler: panels togglen via *zowel* `style.display='block'` *als* `classList.add('sib-form-message-panel--active')` — alleen die combinatie werkt voor zowel success- als error-panel (Brevo CDN-CSS specificity vereist class voor error-panel `display:inline-block`)
- Playwright `page.route()` met **regex** ipv glob bij Brevo-subdomains — `/sibforms\.com\/serve\//` matcht consistent terwijl `**/sibforms.com/**` faalt op `09a5e5c2.sibforms.com` door wildcard-segmentatie, met als gevolg dat mocks omzeild worden en echte test-contacten in productie-Brevo aangemaakt worden

### Sessie 132: Brevo Dashboard Setup — Form-submitted Pivot (24 april 2026)
⚠️ **Never:**
- Aannemen dat "Contact added to tag" Brevo-trigger nog bestaat — Brevo verwijderde deze trigger uit de automation-builder; "Contact matches custom filters" is daily-batch (8PM) en kent geen tag-filter
- Sample-funnels architectureren op tag-routing in Brevo — tags zijn niet filterbaar in de custom-filter builder, dit blokkeert élke realtime tag-gebaseerde segmentatie-strategie
- Brevo welkomstmails uitsturen zonder NL-taalreview — academisch jargon zoals `methodologie` overleeft preview-toggles in de visual builder onopgemerkt

✅ **Always:**
- Form-submitted trigger als primaire automation-anker — multi-form-architectuur (één lijst, N forms) maakt lead-routing event-driven en realtime, geen 8PM-batch-vertraging
- Sample-signers naar dezelfde hoofdlijst (`hacksimulator-main`) sturen — sample-form blokkeert hoofd-welcome via uniek trigger-form, dus geen duplicaat-mail terwijl ze wel volwaardig nieuwsbrieflid worden
- Architecturale UI-veranderingen meteen in memory vastleggen — `reference_brevo_tags.md` capturet "tags ≠ filterbaar in builder" zodat een toekomstige sessie geen 30 min verspilt aan dezelfde dead-end

### Sessie 131: CTA Click Tracking & Session Handoff via Plan Files (21 april 2026)
⚠️ **Never:**
- Relatieve `src/...` paths in `<script>` tags van landing pages — `gidsen.html` miste `init-analytics.js` waardoor GA4 sinds Sessie 129 nooit initialiseerde op dé conversie-pagina; absolute `/src/...` voorkomt dat scripts niet laden bij subpad-URL-varianten
- Per-element `onclick`-handlers voor N tracking-CTAs — één delegated `document.addEventListener('click', ... closest('[data-product-id]'))` schaalt beter én blijft CSP-compatible
- MutationObserver zonder `fired`-flag + `disconnect()` — Brevo success panel kan meerdere style-mutaties triggeren, wat dubbele `newsletter_signup` events oplevert

✅ **Always:**
- Declaratieve `data-product-id` + `data-cta-location` attributen + delegated listener — zero inline JS, zero CSP-problemen, makkelijk uit te breiden bij nieuwe CTAs
- GA4 consent-check verifiëren via DevTools Network (filter `collect?v=2`) i.p.v. alleen localStorage-inspectie — netwerkverkeer is de enige ground truth voor "event is echt verzonden"
- Bij bijna-vol context window: commit + zelf-bevattende plan files in `.claude/plans/` schrijven — nieuwe sessies cold-starten zonder context-overdracht, geen informatie-verlies

### Sessie 130: M7 Gamification Afsluiting & QA (21 april 2026)
⚠️ **Never:**
- "ethical hacking" als fallback in code — ook in fallback strings "ethisch hacken" gebruiken; de Sessie 128 taalregel geldt voor álle code, niet alleen zichtbare UI
- Prompt prefix (`user@hacksim` vs `hacker@hacksim`) op sommige plekken anders dan de terminal — check HTML templates, JS en landing demo bij prompt-wijzigingen
- Badge progressie asymmetrisch laten (easy-sweep + medium-sweep maar geen hard-sweep) — spelers verwachten een consistent pad

✅ **Always:**
- Gamification edge cases testen via code review naast UI test — code review vangt meer dan alleen klikken (fallback strings, empty states, boundary conditions)
- Na prompt/branding wijziging grep uitvoeren op oude waarde in *.html, *.js én tests/ — E2E test assertions bevatten vaak gehardcode UI strings
- CSP errors uit console logs als AdSense nieuwe domeinen toevoegt — Google voegt regelmatig subdomains toe (ep1, ep2, etc.)

### Sessie 129: Gumroad Products Live & Site-Integratie (13-15 april 2026)
⚠️ **Never:**
- Gumroad PWYW toggle activeren bij Amount €0 — toggle is grayed out, zet Amount eerst op €1+, activeer PWYW, dan minimum op €0 zetten
- Aannemen dat Gumroad PWYW "pay less" betekent — PWYW laat klanten alleen *meer* betalen dan Amount, niet minder; Amount = altijd het minimum
- Blog CTAs via JS injecteren bij <15 posts — hardcoded HTML is beter voor SEO (zichtbaar zonder JS) en makkelijker te onderhouden bij klein aantal

✅ **Always:**
- Contextual CTAs per blogpost (match product aan topic) — verhoogt click-through vs. generieke CTA's
- Gumroad product links naar `/gidsen` landing page in man page tips (niet direct naar Gumroad) — centraliseert traffic, makkelijker te updaten als URLs veranderen
- Bestaande CSS patterns hergebruiken (`.feature-card`, `.btn-cta`, `.blog-cta`) — zero nieuwe JS, verwaarloosbare bundle impact

### Sessie 128: Gumroad Products — Factcheck & Taalconsistentie (12 april 2026)
⚠️ **Never:**
- "Ethical hacking" in Nederlandse lopende tekst — gebruik "ethisch hacken" / "ethische hacker" (NCSC, OM, Wikipedia NL gebruiken de Nederlandse term)
- MailerLite verwijzingen laten staan in product-docs na Brevo-migratie — cross-check alle referenties bij platform-switches
- Producten publiceren zonder online factcheck van claims (OWASP categorieën, certificeringsprijzen, wetsartikelen) — feiten veranderen jaarlijks

✅ **Always:**
- Gumroad tags: beide termen ("ethisch hacken" + "ethical hacking") voor SEO-bereik op Nederlandse én Engelse zoekopdrachten
- Na taalwijziging in drafts ook Typst templates + `template.typ` (header tagline) + listings updaten — template tagline verschijnt op élke PDF-pagina
- PDFs opnieuw compileren na content-wijzigingen (`bash build-pdfs.sh`) — anders zijn PDF en source out-of-sync

**Rotation:** Keep last 6 full. Archive: docs/sessions/ (current.md, recent.md, archive-*.md)
Pre-Sessie 128 learnings (incl. Sessie 126 Brevo-migratie + 127 Typst PDF) → zie `docs/sessions/current.md`.

---

## Sessie Protocol

**Voor Sessie:** Lees `PLANNING.md`, `TASKS.md`, dit bestand
**Tijdens:** Markeer taken in TASKS.md direct | Noteer architecturale beslissingen
**Afsluiten:** Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
**Rotation trigger:** Every 5 sessions (last: Sessie 130, next: Sessie 135)
**Sessie counter:** 133
**Bij Requirement Changes:** `docs/prd.md` → `PLANNING.md` → `TASKS.md` → `CLAUDE.md`

→ **Document Sync Protocol:** PLANNING.md §Document Sync

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

**Last updated:** 29 april 2026 (Sessie 133 — Plan B lead magnet ✅ COMPLETE + post-deploy Brevo silent panel-toggle fix)
**Version:** 5.6 (Sessie 132 + 133: Brevo Form-submitted automations live, `/sample-pentest.html` met dual-fire GA4 events `lead_magnet_signup` + `lead_magnet_cta_click`, 3 inbound CTAs, custom `brevo-submit.js` handler die main.js silent fail bypasst, 184 Playwright tests groen)
