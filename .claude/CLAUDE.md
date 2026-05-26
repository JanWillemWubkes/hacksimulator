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

### Sessie 137: Funnel-pulse Diagnose + Lead-magnet CTA-Coverage 3→13 (26 mei 2026)
⚠️ **Never:**
- Een meet-validatie-plan starten zonder eerst de ground truth te vragen aan de user — Heisenberg's "0 inschrijvingen"-onthulling falsifieerde de hele Plan B-meetcriteria-aanname. Voorkomt verspilde dashboard-runs op nul-baselines en sessie-tijd op meet-runs met voorspelbaar nul-resultaat. Cold-start checklist móét baseline-bevestiging bevatten vóór technisch werk start
- "0 events in GA4" diagnosticeren als tracking-leak vóór de consent-onafhankelijke laag (Brevo POST) gecheckt is — `brevo-submit.js` doet POST ongeacht consent-banner-state, dus Brevo contactenlijst is harder ground truth dan GA4 voor "is er signup-activiteit?". Andersom kost 30+ min debug aan een non-bug
- Plan-files met nog-relevante referentie-content (ticket-tekst, methodiek) wegrenamen of verwijderen i.p.v. SUPERSEDED-banner toevoegen — banner met expliciete trigger-condities voorkomt dode-link-risico in CLAUDE.md/memory die naar oude path verwijzen én blind cold-start-hergebruik van obsolete plannen

✅ **Always:**
- Pulse-check pipeline-functioneel vóór business-pivot via simulate success-panel toggle (`display: 'block'` + `classList.add('sib-form-message-panel--active')`) — valideert end-to-end MutationObserver-events + GA4 collect-POSTs zonder productie-Brevo-pollution. Bruikbaar diagnose-pattern voor alle Brevo-form-pages
- Unique `data-cta-location` per CTA-positie incl. blog-topic + plaatsing (`blog_nmap_top` ≠ `blog_cybertools_mid` ≠ `homepage_lead_strip`) — enables per-positie GA4-attributie via één delegated listener (Sessie 131-pattern), zero extra JS-bundle-impact, schaalt naar willekeurig veel CTAs
- Contextual CTA-copy per blogpost i.p.v. generiek — bridge-zinnen ("Reconnaissance gaat verder dan techniek") redden imperfecte topical fit (social-engineering / wachtwoord / linux-fs) waar generic copy zou falen. Sessie 129-learning bevestigd
- Productie-spot-check één random pagina is voldoende bij delegated-listener-architectuur — één Playwright `navigate` + `evaluate` valideert het hele pattern voor alle N CTAs, geen per-element test nodig

### Sessie 136: Brevo Deliverability Sessie D — Postmaster Re-check + Track G Voltooid (18 mei 2026)
⚠️ **Never:**
- Brevo's `Blocklisted`-state op transactional channel interpreteren als binaire blocklist — het is een **per-sender approval-lijst** ("0/N senders approved" letterlijk in popup-tekst). Drie sessies (134/135/136) gaven onverklaarbare blokkades omdat het mental model verkeerd was. Werkende unblock-UI-route: **caret-dropdown (▼) náást "Transactional emails"** in Channels-sectie van contact-detail-pagina (NIET More-menu rechtsboven, NIET History-tab — beide gevalideerd nutteloos in Sessie 136)
- Brevo's Logs gebruiken voor "is mijn testmail aangekomen?"-debug — Logs draaien op 3-5 min batch-pipeline tov Real-time stats; voor actuele delivery-status check Real-time, Logs zijn voor postmortem-analyse en reason-detail
- Postmaster Tools "Not enough data" interpreteren als verify-issue — bij outbound-volume <10/dag voor Authentication-stats en <1000/dag voor Spam Rate is dit verwacht aggregatie-gedrag; verify-status apart valideren via `postmaster.google.com/managedomains` (toont Verified/Pending/Failed los van data-aggregatie)

✅ **Always:**
- Bij dashboard-UI-discovery met meerdere kandidaat-routes: systematisch alle valideren + screenshot per route + memory-update mét uitgesloten routes vóór de daadwerkelijke actie-klik. Voorkomt route-verlies bij UI-shifts en bespaart toekomstige sessies de discovery-cost (Sessie 135 verloor 30+ min aan UI-archeologie; Sessie 136 vond Route A in 5 min met deze methode)
- Sample-/transactional-mails framen als "actie-response op user-trigger" (specifieke subject-line + file-delivery-context, bv. `"Je Pentest Sample staat klaar"`) i.p.v. "broadcast-newsletter" — Gmail-classifier kantelt eerder naar Primary i.p.v. Promotions; verschil welkomstmail→Promotions vs sample-pentest→Primary in Sessie 136 was puur content-framing-effect bij identieke DKIM/SPF/DMARC-state
- Postmaster Tools re-check-target zetten op concrete trigger (eerste >100-recipient campaign-send OF kalender-datum 2 wk later) i.p.v. open "wanneer er data is" — voorkomt sessie-tijd-verlies aan "nog steeds leeg"-runs
- Compounding deliverability-investments (Sessie 134 DnD-template-kwaliteit + Sessie 135 DNS-cleanup + Sessie 136 unblock) retroactief documenteren als gezamenlijke voorwaarde voor optimale resultaat (Primary-classificatie) — voorkomt dat individuele componenten in latere sessies als "overkill" worden afgeschreven

### Sessie 135: Brevo Deliverability Tuning — DNS Cleanup + Mail-tester Baseline (11-13 mei 2026)
⚠️ **Never:**
- SPF-record met `include:_spf.mlsend.com` (of andere oude platform-includes) laten staan na een mail-platform-migratie — bij MailerLite→Brevo-switch (Sessie 126) bleef oude SPF-include ~4 maanden ongemerkt, effectief silent SPF-softfail op alle Brevo-outbound (DKIM redde de aflevering, maar Gmail-classifier zag fingerprint-mismatch). Mailer-platform-switches vereisen drie cleanup-passes: SPF-include, apex-verification-TXT, én DKIM-CNAME op subdomein (`litesrv._domainkey` werd pas bij screenshot-audit ontdekt, niet bij `dig` op apex)
- "Blocked" status in Brevo Transactional → Logs interpreteren als Gmail-delivery-failure — het is een **interne suppression-list-check** op Brevo's transactional channel (separate van Email Campaigns channel: dual-channel model). Mail verlaat Brevo's mailservers niet eens. Reason `blocked : due to unsubscribed user` is typisch post-template-test-bijproduct uit Sessie 133/134 unsubscribe-link-validatie
- Plus-alias workaround (`recipient+suffix@gmail.com`) proberen voor adres dat op eigen Brevo-blocklist staat — Brevo normaliseert pre-send tegen canonical form (anti-evasion), match → abort vóór log-creatie, géén log-regel verschijnt. Workaround werkt alleen voor adressen die nog niet ge-suppressed zijn

✅ **Always:**
- Bij DNS-edit in TransIP: gebruik "Home-key-truc" (cursor naar begin van textbox forceren) om volledige record-waarde te kunnen valideren vóór "Opslaan" — TransIP single-line input clipt zonder scroll-indicator, screenshot toont alleen cursor-positie. 5-seconden-check spaart uren debug bij silent SPF-typo
- DNS-propagatie verifiëren via drie resolvers parallel: TransIP authoritative (`ns0.transip.net`) + Google (`8.8.8.8`) + Cloudflare (`1.1.1.1`). Bij asymmetrie weet je welke caches stale zijn; bij universele match: propagatie wereldwijd compleet. TTL `5 Min.` + geen oude cache leverde <2 min wereldwijde propagatie
- Bij delivery-issue "mail komt niet aan": eerst Brevo Transactional → Logs check op `Blocked`-status met detail-paneel-reason, dán pas DNS/auth-debug. Andersom kost 30+ min DNS-debug voor een blocklist-issue
- Architecturale Brevo-UI-vondsten meteen in memory: dual-channel-model (Email Campaigns vs Transactional apart blocklist-state) + plus-alias-normalisatie + verstopte unblock-route achter "More"/dropdown zijn niet-derivable uit code en kosten elke nieuwe sessie 30+ min ontdekkingstijd

### Sessie 134: Brevo Drag-and-Drop Herbouw — Welkomstmails (5-11 mei 2026)
⚠️ **Never:**
- Aannemen dat Brevo Button-blocks per-link click-tracking-toggle hebben in Free/Starter-tier — toggle bestaat niet (gevalideerd in template-edit-paneel + Additional Settings + Settings → SMTP & API + Senders). Pad-1 Button-block-split kost 30 min met nul bug-impact
- Handmatig `{{ unsubscribe }}` / `{$unsubscribe}` als URL typen in Brevo's link-editor — Brevo wrapt het als `https://app.brevo.com/%7B%7B unsubscribe %7D%7D` (URL-encoded), 404 bij klik. Gebruik Type-dropdown `Unsubscribe link (global)` of `Web version` als native Brevo-koppeling
- Canvas-preview hover-URLs of "Preview & test"-modal vertrouwen voor placeholder-validatie — Brevo substitueert pas in outbound rendering bij verzending. Editor toont placeholders als platte tekst-URLs. Enige ground truth = testmail via Brevo's mail-server

✅ **Always:**
- Tooling-aannames in 30 sec valideren vóór 30 min implementeren — vóór elke "fix" eerst checken of de gemaakte aanname over de tool waar is (UI-veld, toggle, feature) i.p.v. direct uitvoeren
- Brevo's automation-templates zijn **snapshot-kopieën**, geen live links naar source-template — bij source-update altijd opnieuw "load template" + "Use this design in automation" in automation-step, anders blijft oude versie actief
- Title/Text-blocks met Type-dropdown special-links voor DnD-footers, NIET pre-built footer-sections — pre-builts (social/address/foto) zijn te druk voor minimal terminal-aesthetic; restylen kost meer dan zelf bouwen
- Cold-start-checklist (git log + curl headers) doorlopen vóór dashboard-werk start — bevestigt server-side state intact, voorkomt verspilde tijd aan opnieuw fixen wat al werkt

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

**Rotation:** Keep last 6 full. Archive: docs/sessions/ (current.md, recent.md, archive-*.md)
Pre-Sessie 129 learnings (incl. Sessie 126 Brevo-migratie + 127 Typst PDF + 128 Gumroad factcheck/taalconsistentie) → zie `docs/sessions/current.md`.

---

## Sessie Protocol

**Voor Sessie:** Lees `PLANNING.md`, `TASKS.md`, dit bestand
**Tijdens:** Markeer taken in TASKS.md direct | Noteer architecturale beslissingen
**Afsluiten:** Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
**Rotation trigger:** Every 5 sessions (last: Sessie 136, next: Sessie 140)
**Sessie counter:** 137
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

**Last updated:** 26 mei 2026 (Sessie 137 — Funnel-pulse diagnose + Lead-magnet CTA-coverage 3→13 ✅: Plan B follow-up gepivoteerd na "0 inschrijvingen" reveal, pipeline 100% groen bevestigd end-to-end, CTA-coverage live op 8 blogposts-top + homepage + over-ons, plan-file `lead-magnet-followup.md` SUPERSEDED-banner met trigger-condities)
**Version:** 5.10 (Sessie 137: ground-truth-first cold-start-pattern — vraag user baseline vóór meet-runs; Brevo POST consent-onafhankelijk als harder ground truth dan GA4; pulse-check via simulate success-panel toggle valideert pipeline zonder productie-pollution; delegated-listener-architectuur schaalt — één spot-check valideert N CTAs; SUPERSEDED-banner-pattern op plan-files met expliciete trigger-condities behoudt referentie zonder dode-link-risico)
