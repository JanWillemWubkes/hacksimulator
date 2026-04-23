# Plan C — Content SEO (2-3 nieuwe blog posts met keyword research)

**Status:** Open | **Geschat:** ~2-3 sessies | **Opvolger van:** Sessie 131 (CTA tracking live)
**Reconstructed from session log:** 22 april 2026 (Sessie 132)

---

## Doel

Organisch verkeer uitbreiden via Nederlandstalige long-tail keywords die matchen met Gumroad-producten. Huidige 10 blog posts dekken fundamentals; ontbrekend: **beginner-to-intermediate brug-content** die zoekintentie ná eerste installatie/exploratie vangt (waar Gumroad-gidsen relevant worden).

**Hypothese:** Meer zoekverkeer op intent-queries ("hoe leer ik ethisch hacken stap voor stap", "eerste CTF challenge nederland") → meer contextual Gumroad CTA clicks → meer sales. Gumroad click tracking (Sessie 131) maakt dit meetbaar per post.

---

## Scope (wat wél)

**2-3 nieuwe posts, elk 1500-2500 woorden**, volgens bestaand patroon (zie `docs/blog-template.md` als die bestaat, anders: mirror `blog/ethisch-hacker-worden.html` structuur).

### Stap 1: Keyword research (Sessie 1 — 1-2 uur)
Gebruik gratis tools: Google Suggest (autocomplete), AnswerThePublic NL, Google Trends NL, "people also ask" in SERP. Geen paid tools nodig voor MVP-scope.

**Shortlist voor research (nog te valideren op volume/competitie):**
- "hoe word ik cybersecurity specialist zonder diploma"
- "eerste hack oefening beginner"
- "kali linux installeren beginners nederlands"
- "wat verdient een ethisch hacker nederland"
- "TryHackMe vs HackTheBox nederlands"
- "ctf challenge oplossen uitleg"
- "wireshark tutorial nederlands beginner"
- "OWASP top 10 uitgelegd nederlands"

**Selectie-criteria:**
- Nederlandse taal (huidige SEO strategie UI=NL)
- Long-tail (3+ woorden) → lagere concurrentie
- Match met Gumroad-product (één van: Juridische Gids, Pentest Playbook, 12-Weken Leerplan, Bundle)
- Zoekintentie = educatie/oriëntatie, niet transactie (die hebben we al via gidsen.html)

### Stap 2: Per post (Sessie 2-3, ~1 uur schrijven + 30 min integratie per post)
1. Mirror bestaande post-structuur (`blog/ethisch-hacker-worden.html` als referentie — rijkste SEO setup)
2. Inline jargon uitleg in Nederlands (105+ bestaande in site, consistentie)
3. Contextual Gumroad CTA in het midden (Sessie 129 learning: mid-content > bottom-stack)
4. `.blog-cta-button` met `data-product-id` + `data-cta-location="blog_<slug>"` attributen (tracking werkt automatisch)
5. JSON-LD Article schema (kopieer uit bestaande post, pas datePublished/headline aan)
6. Internal cross-linking sectie onderaan (3 gerelateerde bestaande posts — topical authority)
7. BreadcrumbList schema

### Stap 3: Distributie (einde van laatste sessie)
- `sitemap.xml` — nieuwe entries toevoegen (priority 0.7)
- `blog/index.html` — post cards toevoegen in chronologische volgorde
- Cross-linking vanuit 2-3 bestaande posts *naar* nieuwe post (bidirectional topical clusters)
- Newsletter-item: nieuwe post aankondigen in eerstvolgende Brevo nieuwsbrief

## Scope (niet)

- Geen Google Ads / paid promotion — alleen organic SEO
- Geen externe backlink-outreach — te hoog effort voor MVP scope
- Geen AI-generated content — user's product quality standard: 100% verifieerbaar (zie `memory/feedback_product_quality.md`)
- Geen blog post redesign — hergebruik bestaande `styles/blog.css` + template

---

## Product → Post Mapping (aanbevolen CTAs)

| Post topic | Gumroad product | Reden |
|-----------|-----------------|-------|
| "Career switch cybersecurity" / "zonder diploma" | 12-Weken Leerplan | Pad naar CTF-ready |
| "Eerste hack oefening" / "beginner practice" | Pentest Playbook | Recon checklist actionable |
| "CTF uitleg" / "TryHackMe vergelijking" | 12-Weken Leerplan of Bundle | Structureel leerpad |
| "Wat mag wel/niet" / "coordinated disclosure NL" | Juridische Gids | Directe fit |
| "Kali Linux installeren" | Bundle | Breed instapproduct |

---

## Kritieke files (weten wat waar zit)

- `blog/ethisch-hacker-worden.html` — meest uitgebreide referentie-post (SEO + tracking + CTA + schema)
- `docs/blog-template.md` — template voor nieuwe posts (als bestaand)
- `blog/index.html` — lijst met alle posts, nieuwe toevoegen hier
- `sitemap.xml` — SEO sitemap, nieuwe entries
- `styles/blog.css` — bestaande styling, NIET aanpassen
- `src/ui/cta-tracking.js` — tracking werkt automatisch via data-attributes
- Gumroad URLs: Juridisch `yzdtfx`, Pentest `wmvpx`, Leerplan `eogjdk`, Bundle `emzjvj`

## Weten vóór je start

- Bundle zit op `~1192 KB` site totaal (blog/ = 306 KB voor 10 posts ≈ 30 KB/post) — 3 nieuwe posts = +~90 KB, binnen tolerantie
- Inline jargon uitleg pattern: `<abbr title="uitleg">term</abbr>` of inline parenthesen — check bestaande posts voor style
- Elke post moet ≥1 `[TIP]`-stijl callout hebben (educatief pedagogy, matcht terminal tone)
- `"ethisch hacken"` niet `"ethical hacking"` in lopende tekst (Sessie 128 learning)
- Geen emojis in code/content (zie CLAUDE.md tone guidelines)

## Risico's

- **Duplicate content:** kleine overlap met bestaande posts onvermijdelijk — canonical + cross-link i.p.v. verwijderen
- **Thin content penalty:** <1000 woorden = Google ignores — mik op 1500-2500
- **Keyword cannibalization:** nieuwe post competing met bestaande op zelfde keyword — check SERP vóór je schrijft, kies differentiërende hoek

---

## Definition of Done (per post)

- [ ] 1500+ woorden, in NL, jargon-uitleg inline
- [ ] JSON-LD Article + BreadcrumbList schema
- [ ] 1 contextual Gumroad CTA mid-content met tracking attributes
- [ ] 3 internal links naar bestaande posts
- [ ] 3 bestaande posts linken *naar* nieuwe post
- [ ] `blog/index.html` bijgewerkt
- [ ] `sitemap.xml` entry (priority 0.7)
- [ ] Playwright smoke test (post laadt, CTA click fired, consent-aware)
- [ ] Bundle delta <35 KB

## Meetcriteria (8 weken na launch)

- ≥50 organic sessies/maand op nieuwe posts (Search Console)
- ≥3 `product_cta_click` events met `location=blog_<nieuwe-slug>` per week
- Dwell time ≥2 min per post (GA4 engagement)
- Minstens 1 nieuwe post in top-10 Google NL voor target keyword
