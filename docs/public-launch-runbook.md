# Public Launch Runbook — HackSimulator.nl

**Status:** Klaar voor uitvoering (Fase 1 metadata-bugs al gefixt, Sessie 160)
**Doel:** De site is technisch live maar nooit publiek aangekondigd. Dit runbook is het pad naar
de feitelijke publieke launch, geoptimaliseerd voor geloofwaardigheid + Google/SEO.

**Datum-strategie = "disciplined hybrid":** `datePublished` blijft historisch (nov 2025 – mei 2026,
behoudt het autoriteitsverhaal). `dateModified`/`lastmod` worden alléén verhoogd naar de launch-datum
op pagina's die je op de launch-dag écht inhoudelijk aanraakt — nooit bulk-faken (Google wantrouwt
`lastmod` dat overal identiek is, en straft kunstmatig-verversen af).

> Vul overal `<LAUNCH>` in met de echte launch-datum, ISO-formaat `YYYY-MM-DD`
> (bijv. `2026-06-15`). RSS gebruikt RFC-822: `Mon, 15 Jun 2026 12:00:00 +0200` (zomertijd `+0200`).

---

## ✅ Fase 1 — Metadata-bugs (AL GEDAAN)
- [x] `sitemap.xml`: 3 blog-`lastmod` < `datePublished` gecorrigeerd (welkom/wat-is-ethisch-hacken/terminal-basics)
- [x] `feed.xml`: OWASP-post toegevoegd, newest-first geordend (11 items), `lastBuildDate` ververst, nmap-weekdag gefixt
- [x] Beide gevalideerd als well-formed XML

---

## Fase 2 — Launch-pass content (op de launch-dag)

Kies 3–5 **cornerstone-pagina's** (homepage + best-presterende/belangrijkste posts). Doe per pagina
een échte verbetering, en pas dán de datums aan:

1. **Echte content-touch** (rechtvaardigt de datum-bump):
   - Interne links versterken (naar terminal, naar gerelateerde posts, naar gidsen/sample-pentest)
   - Newsletter-opt-in / CTA's checken en waar nodig verbeteren
   - Kleine inhoudelijke verversing waar zinvol (cijfers, jaartal "2026", dode links)
2. **Pas dán de datums aan** op precies die pagina's:
   - JSON-LD `dateModified` → `<LAUNCH>` (`blog/*.html`, ~regel 76)
   - Voeg `<meta property="article:modified_time" content="<LAUNCH>">` toe (naast de bestaande
     `article:published_time`, ~regel 18 — ontbreekt nu overal)
   - `sitemap.xml` `<lastmod>` van die pagina → `<LAUNCH>`
3. **Discipline:** posts die je NIET aanraakt → `datePublished`, `dateModified` en `lastmod` ongemoeid laten.

**Optioneel (aanbevolen):** publiceer 1 verse post in de launch-week (datum = juni 2026) zodat de blog
"actueel/levend" oogt bij binnenkomende bezoekers. Nieuwste post is nu 26 mei 2026.

---

## Fase 3 — SEO-launch (de feitelijke "publiek maken")

Dit is de échte hefboom — géén code, externe handelingen:

- [ ] **Index-status nulmeting:** zoek `site:hacksimulator.nl` in Google → noteer hoeveel pagina's
      al geïndexeerd zijn (bepaalt vertrekpunt).
- [ ] **Google Search Console:**
  - [ ] Property geverifieerd? (check of dit al gedaan is via bestaande GA4/meta-tag)
  - [ ] `sitemap.xml` (her)submitten
  - [ ] `feed.xml` als extra bron toevoegen
  - [ ] Indexering aanvragen (URL-inspectie → "Indexering aanvragen") voor: homepage, `/blog/`,
        en de top-3 cornerstone-posts
- [ ] **GA4:** annotatie op `<LAUNCH>` plaatsen → schone voor/na-meting van de launch-impact
- [ ] **robots.txt / noindex:** al correct (`Allow: /`, geen `noindex`) — alleen bevestigen, niet wijzigen
- [ ] **Bing Webmaster Tools** (optioneel, 5 min): sitemap submitten — gratis extra bereik

---

## Fase 4 — Aankondiging & eerste backlinks

Zonder eerdere promotie heeft de Brevo-newsletter weinig subscribers → de hefboom zijn **externe
kanalen**. Eerste backlinks triggeren een diepere crawl en geven de historische content ranking-grond:

- [ ] NL/EU security- & dev-communities (relevante subreddits, Tweakers, fora, Discord/Slack-groepen)
- [ ] Socials (LinkedIn/X) — aankondigingspost met link naar terminal + 1 cornerstone-post
- [ ] Eenmalige newsletter-broadcast naar bestaande contacten (indien zinvol qua aantal)
- [ ] Overweeg een gerichte launch op een aggregator (NL: Tweakers; internationaal: relevante
      educatieve/security-listings)

**Meet na ~1–2 weken:** herhaal `site:hacksimulator.nl` + GSC Coverage → vergelijk met de nulmeting.

---

## Niet wijzigen (bewuste keuzes)
- `over-ons.html` `foundingDate: "2024"` → plausibel (opgericht 2024, blog later), laten
- Legal "Laatst bijgewerkt"-datums (okt/dec 2025) → echt, laten
- Copyright `© 2026` → correct
- Sitemap `<lastmod>` ISO 8601 `YYYY-MM-DD` → verplicht formaat, niet "vernederlandsen"

---

## Optioneel — drift-preventie (voorkomt herhaling van de Fase 1-bugs)
Klein generator-script of een check in `scripts/validate-docs.sh`:
- `lastmod >= datePublished` per blog-URL
- RSS-item-count == aantal blogposts in `/blog/`
Voorkomt dat sitemap/feed opnieuw stilletjes uit sync lopen bij een nieuwe post.
