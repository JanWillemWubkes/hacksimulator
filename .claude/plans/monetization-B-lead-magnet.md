# Plan B — Lead Magnet (Sample PDF achter Brevo opt-in)

**Status:** ✅ COMPLETE — Sessie 1 (23 apr) + Sessie 132 Brevo-setup (24 apr) + Sessie 133 implementatie (26 apr)
**Reconstructed from session log:** 22 april 2026 (Sessie 132)

## Sessie 1 resultaat (23 april 2026)

**Gemaakt:**
- `docs/products/pentest-playbook-sample.typ` — sample source (Fase 0 + 1 + cliffhanger-CTA)
- `docs/products/pentest-playbook-sample.pdf` — 89 KB, 9 pagina's (onder 100 KB budget)
- `assets/samples/pentest-playbook-sample.pdf` — hosting-ready kopie
- `docs/newsletter/welkomstmail-sample-pentest.html` — Brevo template (hergebruikt dark-mode pattern)
- `docs/newsletter/brevo-setup-sample-pentest.md` — 6-stappen dashboard setup guide
- `docs/products/build-pdfs.sh` — aangepast zodat sample automatisch mee-compileert

## Sessie 132 resultaat (24 april 2026) — Brevo dashboard setup

**Voltooid in Brevo:**
- Sample-template geüpload + preview text gekozen (contrast-angle: "De meeste tutorials slaan Fase 0 over…")
- Welkomstmail taalfixes: `werkwijze` i.p.v. `methodologie`, `Het volledige Playbook`, `Bekijk Volledig Playbook`
- **Architecturale pivot — Form-submitted trigger**: tijdens setup bleek Brevo's UI veranderd — "Contact added to tag" trigger bestaat niet meer, "Contact matches custom filters" is batch (daily 8PM, niet realtime) + ondersteunt geen tag-filter. Oplossing: beide welkomstmail-automations triggeren nu op **Form submitted**:
  - `HackSimulator Signup` form → Welcome message automation (bestaand, hergekoppeld)
  - `Sample Pentest embed` form → nieuwe Sample Pentest automation
- Beide automations **Active**, end-to-end test geslaagd (user confirmed)
- Brevo form HTML gekopieerd → staat klaar in `docs/newsletter/sample-pentest-embed-form.html` (form action URL: `MUIFACJ0paJnTVMUH9lXS2lXtNFuy54...`)
- Memory bijgewerkt: `reference_brevo_tags.md` met kritieke beperking "Tags zijn NIET filterbaar in automation custom-filter builder"
- Commits `1d679ac` + `4b49466` gepusht (Netlify deploy PDF in progress)

**Sessie 2 start-conditie:** Brevo embed form HTML staat in `docs/newsletter/sample-pentest-embed-form.html`, klaar om in `/sample-pentest.html` te plakken. Beide automations live.

---

## Doel

Nieuwsbriefinschrijving stimuleren **én** een direct voorproefje geven van de betaalde Gumroad-gidsen. Wie een sample PDF downloadt, is warmer dan iemand die alleen blog leest — en de welkomstmail kan dan cross-sellen naar de volledige gids.

**Hypothese:** Sample → nieuwsbriefgroei → Gumroad conversie. Zonder sample is de psychologische stap van "gratis blog" naar "€5 PDF" te groot voor cold traffic.

---

## Scope (wat wél)

1. **Eén sample PDF kiezen en extraheren** — geen drie, focus eerst bewijzen. Aanbeveling: **Pentest Playbook sample** (3-5 pagina's uit recon/nmap hoofdstuk). Rationale: nmap is #1 blog traffic driver, sample resoneert met bestaande lezers.
2. **Sample genereren via bestaande Typst pipeline** — `docs/products/pentest-playbook.typ` kopiëren naar `pentest-playbook-sample.typ`, secties buiten sample verwijderen, footer-CTA "Download de volledige gids op hacksimulator.nl/gidsen" toevoegen.
3. **Hosting PDF** — upload naar `assets/samples/pentest-playbook-sample.pdf` (of Netlify Large Media als >1 MB). URL: `https://hacksimulator.nl/assets/samples/pentest-playbook-sample.pdf`.
4. **Brevo automation** — aparte lijst of tag (`sample_downloaded_pentest`), automation verstuurt welkomstmail met download-link + cross-sell naar volledige Gumroad-gids.
5. **Landingspagina `/sample-pentest.html`** — minimale pagina met:
   - H1 + 3-bullet preview ("wat zit er in de volledige gids")
   - Brevo embed form (hergebruik `index.html` pattern)
   - Data-attribuut `data-newsletter-location="sample_pentest"` → tracking werkt automatisch via bestaande `newsletter-tracking.js`
6. **CTAs plaatsen** op:
   - `blog/nmap-beginnersgids.html` — bovenin (hoogste intent)
   - `blog/cybersecurity-tools.html` — in midden
   - `gidsen.html` — als secundaire CTA naast betaalde Pentest Playbook
7. **Analytics** — nieuwe event `lead_magnet_signup` in `src/analytics/events.js`:
   ```javascript
   leadMagnetSignup(sampleId, location) {
     analyticsTracker.trackEvent('lead_magnet_signup', {
       sample_id: sampleId, location: location
     });
   }
   ```

## Scope (niet)

- Meerdere samples tegelijk — eerst één bewijzen (A/B complexiteit houden we weg).
- Server-side pingback naar Gumroad — blijft out of MVP scope.
- Paywall/drip-sequence — gewoon één welkomstmail met link, klaar.

---

## Stappen (volgorde)

### Sessie 1: PDF + hosting + Brevo
1. `cp docs/products/pentest-playbook.typ docs/products/pentest-playbook-sample.typ`
2. Sample inkorten: eerste 3-5 pagina's (bv. intro + recon hoofdstuk), sluitpagina met "meer in de volledige gids" CTA + Gumroad link `https://hacksimulator.gumroad.com/l/wmvpx`.
3. `bash docs/products/build-pdfs.sh` aanpassen zodat sample ook wordt gecompileerd.
4. PDF kopiëren naar `assets/samples/pentest-playbook-sample.pdf`.
5. Brevo dashboard: nieuwe lijst `pentest-sample` OF tag `sample_pentest` op bestaande `hacksimulator-main` lijst (aanbevolen: tag — geen dubbele dubbele opt-in).
6. Brevo automation: trigger "tag added", action = email met HTML template (hergebruik `docs/newsletter/welkomstmail.html` als base, vervang content door: "Hier is je sample + link" + Gumroad CTA).
7. Brevo form: nieuw embed form voor `/sample-pentest.html` met hidden field voor tag.

### Sessie 2: Landing + integratie + tracking
1. `sample-pentest.html` bouwen (baseer op `gidsen.html` structuur).
2. CTAs toevoegen op 3 bestemmingen (blog posts + gidsen.html).
3. `events.js` — nieuwe helper `leadMagnetSignup(sampleId, location)`.
4. `newsletter-tracking.js` uitbreiden of forken: als URL matcht `/sample-*`, fire `leadMagnetSignup` i.p.v. `newsletterSignup` (of extra event bovenop).
5. Playwright E2E: happy path (klik CTA → form → submit → success panel → event in GA4 network tab).
6. Sitemap.xml: nieuwe `/sample-pentest.html` entry (priority 0.7).

---

## Kritieke files (weten wat waar zit)

- `docs/products/pentest-playbook.typ` — source voor sample
- `docs/products/build-pdfs.sh` — compile script
- `docs/newsletter/welkomstmail.html` — template voor Brevo mail
- `src/analytics/events.js` — analytics helpers (lines 1-50 zijn bestaande helpers)
- `src/ui/newsletter-tracking.js` — al bestaande MutationObserver
- `index.html:683-750` — Brevo form pattern om te kopiëren
- `gidsen.html:167-230` — card pattern voor CTAs

## Weten vóór je start

- Brevo form action URL per form is uniek — nieuw form = nieuwe URL uit Brevo dashboard kopiëren
- Brevo `sib-form` IDs moeten uniek zijn per pagina (zie Sessie 126 Never-regel)
- GA4 consent check loopt al via `init-analytics.js` — geen extra werk nodig
- `assets/` directory zit in site totaal bundle (~1192 KB) — sample PDF <100 KB houden

## Risico's

- **PDF >500 KB:** compileer met subset fonts in Typst, anders groter dan volledige Pentest Playbook PDF (111 KB is benchmark)
- **Brevo dagelijkse 300-mail limiet:** bij succesvolle lead magnet kan dit krap worden — upgrade-moment bij >10 signups/dag
- **Cannibalisatie:** sample kan full-product sales verminderen als sample te volledig is — 3-5 pagina's max, eindigt op cliffhanger

---

## Definition of Done

- [x] Sample PDF gegenereerd en gehost op `/assets/samples/` *(Sessie 1)*
- [x] `/sample-pentest.html` live met Brevo form *(Sessie 133)*
- [x] Brevo automation "sample pentest" stuurt welkomstmail binnen 5 min *(Sessie 132 dashboard-setup)*
- [x] Welkomstmail bevat download-link + Gumroad cross-sell *(Sessie 1)*
- [x] 3 CTAs geplaatst (nmap post top, cybersec tools post mid, gidsen.html secundair) *(Sessie 133)*
- [x] `lead_magnet_signup` event en `lead_magnet_cta_click` event zichtbaar via spy in Playwright *(Sessie 133 — production GA4 DebugView verificatie post-deploy)*
- [x] Playwright E2E happy path passeert (5 tests in `tests/e2e/lead-magnet.spec.js`) *(Sessie 133)*
- [x] Sitemap.xml bijgewerkt (`/sample-pentest.html` priority 0.7) *(Sessie 133)*

## Meetcriteria (4 weken na launch)

- ≥20 sample downloads/week
- ≥10% klik-door van welkomstmail naar Gumroad
- ≥1 Gumroad sale toegeschreven aan sample-flow via `location=sample_pentest` referrer trail
