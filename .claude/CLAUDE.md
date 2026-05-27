# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 139)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 10 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E ~167 tests / 22 spec files (Chromium, Firefox, WebKit) | WCAG AAA | 182+27 CSS variables (main.css + landing.css)
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

### Sessie 139: Unified Marketing Nav + Breadcrumbs op Blog-Pages (27 mei 2026)
⚠️ **Never:**
- Een nieuwe stylesheet importeren in een sectie van de site zonder eerst grep'en wat er aan globale rules in zit (`^body|^html|^\*`) — `landing.css` toevoegen op blog-pages haalde stilletjes `html { scroll-behavior: smooth }` mee, waardoor `window.scrollTo` van instant naar geanimeerd kantelde en de reading-progress E2E test brak (60% ipv 90%). Klasse aan side-effects = klasse aan onverwachte regressies
- Een ge-injecteerde nav switchen van `position: fixed` (oude `.blog-nav`) naar `position: sticky` (nieuwe `.landing-nav-wrapper`) zonder reading-progress berekeningen te verifiëren — sticky neemt ruimte in layout, fixed niet; document.documentElement.scrollHeight verschilt subtiel tussen de twee, voldoende om <90%-progress-thresholds te breken
- Een Playwright `browser_take_screenshot` als ground truth nemen vóór een DOM-evaluate die de actual state checkt — eerste lokale screenshot toonde "twee navs" wat in feite zichtbare noscript-fallback was door ontbrekende `landing.css` (`.nav-links` viel terug naar `display: block`, mobile-menu niet `display: none`). Visuele bevindingen móét gecorreleerd worden met `getComputedStyle`-data

✅ **Always:**
- CSS overrides plaatsen op het meest specifieke niveau (in dit geval `blog.css { html: scroll-behavior: auto }`) ipv het bron-bestand te splitsen — bewaart single-source-of-truth voor de andere context (landing) en is een 2-regel fix ipv multi-file refactor. Override-niet-fork als default-strategie voor cross-pagina style imports
- `currentPage` param + `activeAttr(page) => currentPage === page ? ' class="active" aria-current="page"' : ''` als pattern voor active-nav-state — werkt automatisch op desktop én mobile-menu zonder duplicate code, uitbreidbaar naar Gidsen/Commands/Woordenlijst met 1 regel in `init-components.js`. Bonus: `aria-current="page"` is gratis a11y-win
- Batch-edits via Python-script met idempotency-checks (skip-condities op marker-strings als `'class="breadcrumb"' in content`) — script kan veilig herhaald draaien zonder dubbele inserts; veel robuuster dan 22 parallelle Edit-calls voor 11 bestanden. Voor uniforme single-line inserts blijft sed met unieke anker-pattern de snelste oplossing
- `git stash` voor regressie-isolatie wanneer een E2E test faalt — stash → run test → pop. Bewijst direct of de failure pre-existing was of door huidige changes. Voorkwam in deze sessie 30+ min van speculatief CSS-debuggen
- Browser-cache-bewustzijn bij Playwright lokaal: ES modules cachen over `browser_close` heen — als runtime-state niet matcht met source-code, eerst handmatig dynamic import met cachebust (`await import('/path?cb=' + Date.now())`) proberen vóór code-debugging. In productie geen probleem (Netlify cache-bust via `?v=` op _headers)

### Sessie 138: Content SEO Plan C — OWASP Top 10 Hub-Post + Markup Fix (26 mei 2026)
⚠️ **Never:**
- Aannemen dat een groene content-DoD (woordcount, CTA-data-attributes, link-counts, JSON-LD, sitemap) ook HTML-structuur dekt — browsers renderen forgiving, dus een ongesloten `<div>` triggert geen JS-error en geen 404. Visuele regressie glipte door 10 groene DoD-items heen en viel pas op bij menselijke review. Tag-balans-check moet expliciet op de DoD
- Een keyword-shortlist accepteren zonder cannibalization-grep tegen bestaande posts — 2/8 keyword-kandidaten (#1 "zonder diploma" + #4 "salaris NL") overlapten direct met `ethisch-hacker-worden.html`. 5-min check voorkwam thin-content + SERP-overlap die Google zou bestraffen
- Een complexe regex bouwen voor een until-loop poll zonder eerst de simpele direct-check (curl + grep) te valideren — mijn `grep -zoE` hing 2.5 min tot timeout terwijl directe curl in 1 sec aantoonde dat de fix al live was. Bij polling: simpel-werkt-eerst, complex-als-nodig

✅ **Always:**
- Tag-balans-check (`grep -c '<div'` vs `grep -c '</div>'`) toevoegen aan elke blog-post DoD — 1-second sanity-check vangt deze hele klasse van ongesloten-element-bugs vóór deploy. Geplande follow-up: bake dit in `scripts/validate-blogs.sh`
- Anker-paragrafen grep'en in bestaande posts vóór inbound-links plannen — 2/3 inbound-targets hadden al een `<abbr class="jargon">OWASP Top 10</abbr>` zonder href die ideale `<a>`-omhullings-punten zijn (organische SEO-anchor "complete OWASP Top 10 uitleg" is superior aan forced "klik hier")
- Ground-truth-first cold-start (Sessie 137-pattern toegepast op Plan C): bevestig topic + post-aantal met user vóór schrijfwerk start — 5-min AskUserQuestion voorkwam plan-aanname over keyword-keuze en post-volume
- Bidirectional clustering opzetten in dezelfde sessie als nieuwe hub-post — 3 inbound-edits in bestaande posts zijn maximaal 5-min werk en geven directe topical-authority-boost; geen aparte follow-up-sessie nodig

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

**Rotation:** Keep last 6 full. Archive: docs/sessions/ (current.md, recent.md, archive-*.md)
Pre-Sessie 134 learnings (incl. Sessie 126 Brevo-migratie + 127 Typst PDF + 128 Gumroad factcheck/taalconsistentie + 129-133 monetization-stack) → zie `docs/sessions/current.md`.

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
   - Footer datum + version
   - Live metrics in Quick Reference: **niet** updaten — verwijs naar TASKS.md

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

**Rotation trigger:** Every 5 sessions, archive sessies N-10..N-6 from CLAUDE.md learnings (last: Sessie 139 cleanup 129-133, next: Sessie 144)
**Sessie counter:** 139

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

**Last updated:** 27 mei 2026 (Sessie 139 — Unified marketing nav + breadcrumbs blog-pages ✅ + Doc-ownership refactor: §Sessie Protocol vervangen door 7-step `/summary` flow met `validate-docs.sh` als forcing function, Quick Reference live metrics verhuisd naar TASKS.md single-source-of-truth)
**Version:** 5.13 (Sessie 139 doc-sync: ownership-mapping in PLANNING.md §Document Ownership, milestone-tabellen + revenue-projections verhuisd uit PLANNING naar TASKS.md, bundle budget gesplitst in runtime <400 KB strikt + SEO/content budgetloos, validate-docs.sh pre-commit hook geïntroduceerd — voorkomt sessie-counter/datum/PRD-version drift. Pattern-learnings Sessie 139 zelf: `currentPage` param + `activeAttr` helper voor active-nav-state, CSS override-niet-fork voor cross-pagina style imports, Python idempotency-check pattern voor batch-edits, `git stash` voor E2E regressie-isolatie)
