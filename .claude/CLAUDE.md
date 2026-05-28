# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 142)
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

### Sessie 142: Lighthouse Meet-Frame-Bias — Bundle-Source ≠ On-Wire ≠ Performance (28 mei 2026)
⚠️ **Never:**
- Een beslis-tabel ontwerpen die één metric als proxy voor user-impact gebruikt zonder de andere meet-niveaus uit te sluiten — Sessie 142 begon met "Pad B als Lighthouse ≥90, anders Pad A". Lighthouse mat Mobile 39 + Desktop 64; Pad A is automatische conclusie. MAAR Pad A target (eigen-code bundle ~108 KB minified lazy-loaden) bespaart ~22 KB gzipped van 624 KB on-wire totaal = niet relevant voor TBT 3,270 ms die domineren wordt door third-party (353 KB / 57%). Beslis-framework veronderstelde impliciet dat als er user-impact is, ónze bundle de oorzaak is — Lighthouse falsifieerde het tweede deel van die aanname maar niet het eerste. Klakkeloos het beslis-frame volgen zou hebben geleid tot 15-20 uur Pad A engineering met Lighthouse-score van 39 → ~42 als "succes"
- "Lighthouse 100/100/92/100" uit Sessie 100 als baseline-claim accepteren zonder de meet-context te kennen — die historische score is vermoedelijk desktop, mogelijk vóór de complete monetization-stack (AdSense in 117-118, Brevo in 126, Gumroad in 127-129, Lead magnet in 130-132, ~10 third-party scripts toegevoegd in 20 sessies). Score-comparison zonder context creëert valse zekerheid over performance-trend; absoluut cijfer in een vacuüm zegt weinig
- Pad B "rebudget want geen user-impact" rationale toepassen terwijl Lighthouse net 39/64 mat — dat zou een budget-shift documenteren met een bewijs dat we niet hebben. Anti-drift werk Sessie 140 voorkomt structurele drift, maar een rebudget op verkeerde rationale is rationale-drift binnen één sessie. Open laten + research-task spawn (#25) is intellectueel eerlijker dan dichten-met-foute-grond

✅ **Always:**
- Drie meet-niveaus expliciet onderscheiden bij elk bundle-performance-debat: (1) **bundle-source size** (wat in repo staat, ~781 KB unminified / ~547 KB minified Terminal Core), (2) **on-wire transfer** (wat de browser download, ~98 KB gzipped first-party + 353 KB third-party = 624 KB totaal in Sessie 142 Lighthouse-audit), (3) **performance-score** (Lighthouse executie-time + render-path metrics, niet direct uit (1) of (2) afleidbaar). Deze drie zijn losjes gerelateerd — fix op niveau (1) garandeert geen verbetering op (3). Documenteer welk niveau het probleem zit voordat je naar oplossing rent
- Lighthouse mobile EN desktop draaien als basis-meting — default Lighthouse is mobile met 4x CPU throttling + 1.6 Mbps; desktop is no-throttling. Verschil Mobile 39 vs Desktop 64 onthult of het probleem CPU-bound (third-party JS execution) of bandwidth-bound (large bundle download) is. In Sessie 142: mobile TBT 3,270 ms / desktop 610 ms = 5x verschil → CPU-bound = third-party execution, niet transfer-size. Twee-meting is reproduceerbaar in <3 min met `npx lighthouse@11`
- Pre-empt revenue-impact-discussies voordat performance-edits in monetization-scripts toegepast worden — AdSense lazy-loading raakt viewability metrics (CPM rates), Brevo/Ko-fi iframe defer raakt signup/donation friction. Dit zijn revenue-vs-performance trade-offs, geen pure perf-tweaks. Heisenberg moet die trade bewust maken, niet als bijproduct van bundle-budget-cleanup. Daarom: third-party perf werk eerst als RESEARCH-task scopen (#25, ~2 uur), geen implementatie zonder per-script trade-off-tabel
- Bij surprise-bevinding in execution: stop, presenteer data + interpretatie + nieuwe opties aan user via `AskUserQuestion` met expliciete vermelding "verrassend t.o.v. plan-aanname" — Sessie 142 stopte na Lighthouse-output i.p.v. mechanisch door te gaan naar Pad A research; Heisenberg gaf akkoord op gewijzigde scope (item #24 paused + #25 spawn). Plan-bestanden zijn snapshot van veronderstellingen op moment-T; nieuwe data overrulet plan
- Item-status "✅ gesloten" alleen toepassen als de werkelijke kwestie is opgelost — niet als bewijs-onderbouwing weerlegd is. Sessie 142 had item #24 kunnen "afronden met Pad B-conclusie" maar dat zou een sluiting met foute rationale zijn. ⏸️ paused-status + cross-link naar #25 + heropen-conditie is honester en behoudt context voor toekomstige sessies
- npx lighthouse pinning op major-version bij Node-version-mismatch (`lighthouse@11` werkt op Node 18, `@12+` vereist Node 22+) — bespaart 5 min npm-error-debug. Documenteer in plan-file welke pinning gebruikt is voor reproduceerbaarheid

### Sessie 141: Terminal Core Runtime-Verificatie — Het Bewijs Achter de Doc-Claim (28 mei 2026)
⚠️ **Never:**
- ⏭️-status in een performance-budget-tabel accepteren zonder concreet cijfer — PLANNING.md regel 497 stond 40 sessies op `⏭️ Verificatie gepland`. Werkelijke meting bleek ~781 KB unminified / ~547 KB minified = ~37% over 400 KB budget. Dit is precies het "ground truth degradeert silent zonder forcing function"-syndroom uit Sessie 140's eigen learnings — verouderde cijfers (Sessie 100 ~340 KB) creëren valse zekerheid en blijven onbetwist tot iemand het meet
- Plan-onderwerpen accepteren op basis van claim-strings in TODO-lijsten / CLAUDE.md learnings zonder de scripts/docs zelf te inspecteren — initieel voorstel "tag-balans-check inbouwen in validate-blogs.sh" bleek al gedaan (regels 58-69, Sessie 138-modernisation deed dit in dezelfde sessie ondanks de "Geplande follow-up"-claim). Ground-truth-first principe geldt ook voor task-status zelf, niet alleen voor metrics
- Bundle-meting via `find <dir> -name "*.js"` als ground truth nemen zonder import-trace — pakt page-specific files mee (`blog-theme.js`, `contact-form.js`, `landing-demo.js` zijn niet runtime-bereikbaar vanaf terminal.html) en kan dubbele telling geven tussen entry-points en module-graph. Verschil was klein (582 KB vs 601 KB BFS), maar voor strikte budget-checks moet methodiek precies kloppen om geloofwaardig te zijn

✅ **Always:**
- Twee-iteratie meet-aanpak voor bundle-baselines: ronde 1 snelle bovengrens via `du -bc` over `find` (~10 sec), ronde 2 precieze BFS via import-regex (`(?:from|import)\s+['"]([^'"]+)['"]`) in Python (~20 regels, <1 sec uitvoeren) — pragmatisch correct *als* ronde 1 <budget oplevert, anders kost verfijning ~20 min. Reproduceerbaar zonder externe tooling (geen madge/esbuild nodig)
- Plan-scope tijdens uitvoering verkleinen via transparante tekst aan user als blijkt dat een deel al gedaan is — Sessie 141 dropte initieel-voorgestelde tag-balans-check + bundle-tabel-split tijdens verfijning, Heisenberg gaf onmiddellijk akkoord. Beter scope-correctie dan blind plan volgen en dubbel werk doen
- Bij overschrijdings-bevinding een follow-up task creëren MET twee paden (Pad A: lazy-load gamification + tutorial via dynamic `import()` ~100 KB besparing / Pad B: budget heroverwegen met rationale) — geeft user een framed beslissing in plaats van "we hebben een probleem". Defense-in-depth (Sessie 140 principe): persistent op TASKS.md #24 + current.md entry + CLAUDE.md learnings tegelijk
- BFS-script herbruikbaar maken voor Sessie 144 `--deep` mode trigger — dezelfde Python BFS uit Sessie 141 kan in `validate-docs.sh --deep` als Check 5 (bundle KB ground-truth-check tegen TASKS.md cijfers met tolerance). Eén keer goed bouwen, twee keer gebruiken. Schaalt naar elke toekomstige runtime-meting
- Cold-start meta-rationaliteit: gebruiker vraagt "logische volgende stap?" → eerst CLAUDE.md + TASKS.md daadwerkelijk lezen + de open #items inspecteren in scripts/docs zelf (niet alleen op item-string vertrouwen). 50% van mijn eerste voorstel-set bleek al gedaan; alleen feitelijke inspectie onthulde dat

### Sessie 140: Doc-Protocol Refactor + Drift-Resistance Forcing Function (27-28 mei 2026)
⚠️ **Never:**
- Drie conflicterende sync-protocollen documenteren in twee bestanden — CLAUDE.md had twee verschillende update-orders (`/summary → SESSIONS+CLAUDE` én `PRD→PLANNING→TASKS→CLAUDE`), PLANNING.md had de omgekeerde volgorde (`TASKS→CLAUDE→PLANNING→PRD`). Resultaat: niemand volgt er één, drift onvermijdelijk. Conflicterende protocollen = effectief géén protocol
- Vertrouwen op een document's "geverifieerd op datum X" claim zonder periodieke re-meting — CLAUDE.md zei "1192 KB geverifieerd 06-04-2026", werkelijke meting 2 maanden later was 2196 KB (+170%). Ground truth degradeert silent zonder forcing function; verouderde cijfers zijn erger dan ontbrekende cijfers want ze creëren valse zekerheid
- Een follow-up uitspreken in chat zonder persistentie op tenminste 1 plek (TASKS.md / memory / inline TODO) — "bij Sessie 144 doen we X" leeft alleen in transcript en wordt over weken zekerlijk vergeten. Goodwill heeft lage hit-rate
- ~30% content-overlap tussen docs accepteren (PLANNING.md milestone-tabel + TASKS.md milestone-tabel = drift-magneet) — elke wijziging vereist updates op 2 plekken, één wordt vergeten, drift binnen 10 sessies terug. Anti-duplicatie is anti-drift

✅ **Always:**
- Forcing function via pre-commit hook bouwen voor elk drift-gevoelig invariant — `scripts/validate-docs.sh` analoog aan `validate-blogs.sh` (Sessie 138), 4 checks (sessie-counter alignment / header-footer-sessie / PRD-version-match / monetization-keyword-superset). Drift wordt blokkerende commit-fout in plaats van slow rot. Onbevangen-runs bewijzen dat checks elkaar's blinde vlekken dekken (intentional 'Sessie 200' drift trigger Check 2 vóór Check 1, geen redundantie)
- Document Ownership matrix expliciet maken: één bron per type informatie. Owners: PRD = requirements, PLANNING = architectuur, TASKS = execution + metrics, CLAUDE = AI-context + top-6 learnings, sessions/current.md = volledige sessie-log. Geen overlap = geen drift-mogelijkheid
- Skill-files updaten gelijk met protocol-wijziging zodat skill-registry-runtime de nieuwe instructies oppikt — `.claude/commands/summary.md` save → system-reminder toonde direct nieuwe beschrijving zonder restart. Skill-registry leest live
- Defense-in-depth voor follow-ups: persistent op tenminste 2 plekken met verschillende leesgewoontes (TASKS.md Volgende Stappen voor /summary-cycle + inline TODO in betreffend script voor codebase-aanraking). Verschillende leespaden vangen elk een andere blinde vlek
- Ground-truth-first vóór doc-edits: `du -sb`, `find tests/e2e`, `git log` — verzamel cijfers vóór je iets schrijft, gebruik in alle docs tegelijk. Voorkomt dat een doc verouderde cijfers krijgt terwijl je een ander updatet
- Plan-mode toepassen op meta-werk wanneer impact-scope onduidelijk is — AskUserQuestion met 4 concrete opties (Light sync / Full sync / Defer / Ground-truth first) gaf duidelijk frame. Voor protocol-redesigns is plan-mode beter dan direct uitvoeren, want trade-offs zijn niet self-evident

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

**Rotation:** Keep last 6 full. Archive: docs/sessions/ (current.md, recent.md, archive-*.md)
Pre-Sessie 135 learnings (incl. Sessie 126 Brevo-migratie + 127 Typst PDF + 128 Gumroad factcheck/taalconsistentie + 129-133 monetization-stack + 134 Brevo DnD-herbouw) → zie `docs/sessions/current.md`.

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

**Rotation trigger:** Every 5 sessions, archive sessies N-10..N-6 from CLAUDE.md learnings (last: Sessie 140 cleanup Sessie 134, next: Sessie 145)
**Sessie counter:** 142

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

**Last updated:** 28 mei 2026 (Sessie 142 — Lighthouse productie-meting /terminal.html: Mobile 39/100, Desktop 64/100. Frame-bias-onthulling: first-party bundle is NIET de Lighthouse-bottleneck; third-party scripts (AdSense+GA+Brevo+Ko-fi, ~353 KB / 57% van 624 KB on-wire) domineren TBT 3.3 s. Item #24 ⏸️ paused (Pad A zou ~22 KB gzipped besparen = niet relevant), item #25 spawned voor third-party perf research ~2 uur. Geen budget-shift: ⚠️-status blijft tot echte fix.)
**Version:** 5.16 (Sessie 142 meedogenloos-eerlijke scope-correctie: oorspronkelijk plan-mode beslis-tabel (Pad B als Lighthouse ≥90, anders Pad A) bleek incompleet na meting — beide paden adresseren niet de werkelijke performance-regressie. Stop-en-reframe-pattern toegepast via `AskUserQuestion` met meet-data + 4 opties; gekozen route = item #24 paused + item #25 spawn i.p.v. forceren naar Pad A/B. Sessie 140 anti-drift-werk gehouden: alle drift-checks slagen, geen rationale-shortcut. Drie meet-niveaus (bundle-source vs on-wire vs Lighthouse-score) expliciet gedocumenteerd in PLANNING.md + learnings.)
