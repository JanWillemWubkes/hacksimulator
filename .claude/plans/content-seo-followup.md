# Plan: Content SEO Follow-up — Cold-Start Plan voor Plan C uitvoering

## Status

**Cold start hier in nieuwe sessie.** Plan C bron-spec staat in `.claude/plans/monetization-C-content-seo.md` (22 april 2026): 2-3 nieuwe blog posts, 1500-2500 woorden, keyword research → schrijven → integratie. Sessie 137 (26 mei 2026) voltooide funnel-pulse-diagnose + CTA-coverage 3→13 — pipeline is 100% groen, elke nieuwe post profiteert automatisch van de delegated-listener-architectuur.

Deze sessie focust op: **eerst keyword-research + topic-selectie samen met Heisenberg, dán minimaal 1 post live in productie** (kwaliteit > kwantiteit).

---

## Eerste stappen nieuwe sessie (cold-start checklist)

1. Lees dit bestand volledig
2. Lees bron-plan `.claude/plans/monetization-C-content-seo.md` (complete spec: product-mapping, risico's, meetcriteria)
3. Lees `docs/blog-template.md` (template-bron, bestaat geverifieerd) en `blog/ethisch-hacker-worden.html` als rijkste referentie-post
4. Verifieer post-Sessie-137-state:
   ```bash
   git log --oneline -5
   ```
   Verwacht: top-commits bevatten Sessie 137-werk (`7258d34 docs(sessions): Sessie 137 — Funnel-pulse Diagnose + CTA-Coverage 3→13`) en eronder `da29283` (SUPERSEDED-banner) + `5f27ee2` (CTA-coverage)
5. Lees `.claude/CLAUDE.md` Recent Critical Learnings Sessie 137 (ground-truth-first pattern + delegated-listener-schaling + pulse-check-pattern)
6. Bevestig met Heisenberg vóór schrijven start:
   - Welke 1-2 keywords uit de shortlist hebben prioriteit? (zie keuze-tabel hieronder)
   - Aantal posts deze sessie: **1 (focus + diepgang, aanbevolen)** of 2 (volume)?

---

## Wat is veranderd sinds bron-plan (22 april 2026)

Bron-plan is goed maar pre-Plan-B-launch. Drie aanpassingen op de Definition of Done:

1. **Sample-pentest lead magnet live** sinds Sessie 133 (`/sample-pentest.html`) — elke nieuwe post moet contextual lead-magnet-CTA krijgen (Sessie 137-pattern: top-of-article met `[data-lead-magnet="pentest_sample"]`)
2. **CTA-coverage uitgebreid 3→13** (Sessie 137) — alle 10 bestaande blogposts hebben nu een sample-CTA top-of-article. Nieuwe post moet ditzelfde patroon volgen (consistency)
3. **0 inschrijvingen baseline** (cold-start onthulling Sessie 137) — Plan C is dé traffic-driver om die baseline te verhogen, niet alleen Gumroad-conversie. Prioriteit-shift: nieuwe posts feeden zowel Gumroad-funnel als lead-magnet-funnel

---

## Sessie scope

### Track 1: Keyword research + topic selectie (~30-45 min)

**Heisenberg's keuze uit bron-plan shortlist** (zie `monetization-C-content-seo.md` regel 23-31):

| # | Keyword | Gumroad product-fit | Hoek |
|---|---------|---------------------|------|
| 1 | "hoe word ik cybersecurity specialist zonder diploma" | 12-Weken Leerplan (`eogjdk`) | Carrière-pad |
| 2 | "eerste hack oefening beginner" | Pentest Playbook (`wmvpx`) | Recon-actionable |
| 3 | "kali linux installeren beginners nederlands" | Bundle (`emzjvj`) | Setup-instap |
| 4 | "wat verdient een ethisch hacker nederland" | 12-Weken Leerplan | Carrière-motivatie |
| 5 | "TryHackMe vs HackTheBox nederlands" | 12-Weken Leerplan / Bundle | Tool-vergelijking |
| 6 | "ctf challenge oplossen uitleg" | 12-Weken Leerplan | Praktijk-instap |
| 7 | "wireshark tutorial nederlands beginner" | Bundle | Tool-tutorial |
| 8 | "OWASP top 10 uitgelegd nederlands" | Juridische Gids / Bundle | Security-framework |

Per gekozen topic:
- Google Suggest (autocomplete) check
- SERP-inspectie eerste 10 resultaten — concurrentie + Nederlandse content?
- "People also ask"-block voor h2-structuur-ideeën
- Keyword cannibalization-check tegen bestaande posts (bv. 1+4 vs `ethisch-hacker-worden.html`, 7 vs `cybersecurity-tools.html`)

Output Track 1: 1 gekozen topic + h2-structuur skeleton (5-7 h2's) + product-CTA-keuze + lead-magnet-CTA-positie.

### Track 2: Post schrijven volgens template (~60-90 min per post)

Mirror `blog/ethisch-hacker-worden.html` structuur (rijkste SEO-setup). Of: gebruik `docs/blog-template.md` als startpunt.

**Definition of Done (uitgebreid t.o.v. bron-plan §Definition of Done):**

- [ ] 1500-2500 woorden, NL, inline jargon-uitleg via `<abbr class="jargon" title="...">term</abbr>` pattern
- [ ] JSON-LD `Article` + `BreadcrumbList` schema in `<head>`
- [ ] **Lead-magnet CTA top-of-article** (na intro-paragraaf, vóór eerste `<h2>`) — Sessie 137-pattern:
  ```html
  <div class="blog-cta blog-cta-product">
    <h3>[contextuele bridge-zin]</h3>
    <p>[één-zin tie-in naar Fase 0 reconnaissance]</p>
    <a href="/sample-pentest.html" class="blog-cta-button" data-lead-magnet="pentest_sample" data-cta-location="blog_<slug>_top">Download de gratis sample</a>
  </div>
  ```
- [ ] **Contextual Gumroad CTA mid-content** (Sessie 129-learning: mid-content > bottom-stack) met `data-product-id` + `data-cta-location="blog_<slug>_mid"` — productkeuze per bovenstaande mapping
- [ ] **3 internal links** naar bestaande gerelateerde posts (topical authority)
- [ ] **3 bestaande posts linken *naar* nieuwe post** (bidirectional clustering) — edit "Gerelateerde Artikelen" of inline-links in bestaande posts
- [ ] **`blog/index.html` bijgewerkt** met post-card in chronologische volgorde — kopieer exacte card-structuur van bestaande post, geen markup-afwijkingen
- [ ] **`sitemap.xml` entry** toegevoegd (priority `0.7`, lastmod = vandaag, changefreq `monthly`)
- [ ] **Playwright smoke-test (productie ná deploy):**
  - Navigate naar nieuwe post-URL
  - CTA-aanwezigheid + visibility check
  - Click lead-magnet-CTA → verifieer `lead_magnet_cta_click` event met correcte `location` in dataLayer
  - Click Gumroad-CTA → verifieer `product_cta_click` event met correct `product_id`
  - Patroon uit Sessie 137: `cta.addEventListener('click', e => e.preventDefault(), { once: true }); cta.click();` voor non-navigerende test
- [ ] **Bundle delta < 35 KB** (huidige `blog/` = 306 KB voor 10 posts ≈ 30 KB/post)

### Track 3: Distributie + commit (~15 min)

- Commit met message-pattern: `feat(blog): voeg <slug>.html toe — <keyword-target>` (zie Sessie 137 voor commit-stijl)
- Push naar `main` → Netlify auto-deploy (~30-60 sec)
- Productie-spot-check via Playwright op nieuwe post-URL (Sessie 137-pattern: één `navigate` + één `evaluate` valideert het hele pattern)
- **Optioneel:** newsletter-item klaarzetten voor eerstvolgende Brevo-nieuwsbrief — niet verplicht voor sessie-success, kan in opvolg-sessie

---

## Wat NIET in scope

- **Geen Google Ads / paid promotion** — alleen organic SEO (bron-plan §Scope niet)
- **Geen AI-generated content** — Heisenberg's product quality standard: 100% verifieerbaar (memory `feedback_product_quality.md`). Onderzoek + schrijven moet menselijke kwaliteitscontrole hebben
- **Geen externe backlink-outreach** — te hoog effort voor MVP scope
- **Geen blog-redesign** — hergebruik `styles/blog.css` + bestaand template-pattern
- **Plan D (bundle social-proof) niet starten** — wacht op echte signups/sales na Plan C traffic-uplift
- **Geen veranderingen aan `cta-tracking.js`** — delegated listener werkt automatisch voor alle nieuwe `[data-lead-magnet]` en `[data-product-id]` elementen. Zero JS-changes nodig
- **Niet de SUPERSEDED-banner op `lead-magnet-followup.md` aanraken** — Track A/B blijven geparkeerd tot trigger-condities

---

## Cruciale "niet doen"

⚠️ **NIET 3 posts in één sessie proberen** — kwaliteit > kwantiteit. 1 grondige post met volledige DoD > 3 thin-content posts (<1000 woorden = Google ignores per bron-plan §Risico's). Bron-plan zegt expliciet "1500-2500 woorden".

⚠️ **NIET een topic kiezen zonder SERP-check** — keyword cannibalization-risico met bestaande 10 posts. Topics #1 en #4 hebben overlap met `ethisch-hacker-worden.html`; #7 met `cybersecurity-tools.html`. Differentiërende hoek vereist of skip.

⚠️ **NIET tone-guidelines uit CLAUDE.md negeren** — Sessie 128: `"ethisch hacken"` niet `"ethical hacking"` in lopende tekst. Sessie 130: prompt prefix consistency (`user@hacksim` of `hacker@hacksim`). Sessie 137: NO emojis in code/content.

⚠️ **NIET nieuwe post-card aan `blog/index.html` toevoegen zonder exact bestaande card-structuur te kopiëren** — afwijkende markup breekt grid-styling. Inspecteer 2 bestaande cards eerst.

⚠️ **NIET vergeten bidirectional linking** — DoD vereist 3 bestaande posts die linken *naar* de nieuwe. Vergeten = orphan-content = thin topical authority.

⚠️ **NIET commit + push doen zonder Playwright productie-spot-check** — Sessie 137-pattern: één `navigate` + één `evaluate` valideert hele pipeline, kost <1 min, voorkomt dat je een gebroken CTA live deployt.

---

## Communicatie-stijl

- User heet **Heisenberg**
- Wees **meedogenloos eerlijk** — als gekozen topic slecht keyword-fit heeft of als h2-structuur overlapt met bestaande post: zeg het direct, niet wegmasseren
- Bij keyword-volume-onzekerheid (geen paid tools beschikbaar): noteer "indicatief, niet geverifieerd via Search Console" — geen valse precisie suggereren
- Inhoud-correcties: als Heisenberg een claim wil dat onverifieerbaar is, vraag de bron of stel alternatieve formulering voor — geen invented facts (memory `feedback_product_quality.md`)

---

## Referenties

- **Bron-plan:** `.claude/plans/monetization-C-content-seo.md` (complete spec, product-mapping, risico's, meetcriteria)
- **Template:** `docs/blog-template.md` (template-bron — bestaat geverifieerd)
- **Rijkste referentie-post:** `blog/ethisch-hacker-worden.html` (mirror SEO + tracking + CTA + schema-pattern)
- **CLAUDE.md learnings:** Sessie 137 (ground-truth-first, pulse-check, delegated-listener), Sessie 129 (contextual CTAs > generic), Sessie 128 (taalconsistentie)
- **Memory:** `feedback_product_quality.md` (geen AI-generated content), `feedback_validate_tooling_assumptions.md` (30-sec UI-check pattern)
- **Gumroad product-IDs:** Juridisch `yzdtfx`, Pentest `wmvpx`, Leerplan `eogjdk`, Bundle `emzjvj`
- **Test-pattern Sessie 137:** simulate-toggle voor Brevo-form pipeline-validation zonder productie-pollution

---

## Success-criteria deze sessie

Sessie compleet als minimaal:

1. **1 nieuwe blog-post live in productie** met alle Definition of Done-items afgevinkt
2. **Playwright smoke-test groen** (lead-magnet-CTA + Gumroad-CTA clicks vuren correcte GA4-events op productie)
3. **`blog/index.html` + `sitemap.xml` bijgewerkt** met nieuwe entry
4. **Commit + push** voltooid + productie-verificatie geslaagd
5. **Sluit af met `/summary`** — SESSIONS.md + CLAUDE.md update + Sessie-counter 137 → 138

**Bonus:** 2 posts in één sessie = dubbel-success. **Minimum-acceptabel:** 0 posts live maar wel grondig keyword-research + h2-structuur klaar + opvolg-plan `content-seo-followup-v2.md` geschreven voor volgende sessie (zoals deze sessie zelf bestaat als handover-pattern).

---

## Meetcriteria (8 weken na launch — uit bron-plan)

Niet voor deze sessie maar voor toekomstige evaluatie:

- ≥50 organic sessies/maand op nieuwe posts (Search Console — vereist toegang)
- ≥3 `product_cta_click` events met `location=blog_<slug>_mid` per week (GA4)
- ≥3 `lead_magnet_cta_click` events met `location=blog_<slug>_top` per week (GA4 — nieuwe metric sinds Sessie 137)
- Dwell time ≥2 min per post (GA4 engagement)
- Minimaal 1 nieuwe post in top-10 Google NL voor target keyword

**Trigger voor evaluatie:** 8 weken na publicatie OF wanneer Sessie 137-baseline (Brevo ≥5 contacten OF GA4 page_views ≥50/maand op `/sample-pentest.html`) bereikt wordt — combineer met Track A hervatting uit `lead-magnet-followup.md` SUPERSEDED-banner.
