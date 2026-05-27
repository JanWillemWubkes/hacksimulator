# Blog Post Template — Moderne Standaard

**Last Updated:** 26 mei 2026 (Sessie 138)
**Version:** 2.0
**Purpose:** Pattern voor nieuwe NL-blogposts op HackSimulator.nl

---

## Wanneer dit template te gebruiken

- Nieuwe content-post (educatief, oriëntatie-intent, niet transactioneel)
- 1500-2500 woorden Nederlandse lopende tekst
- Moet aanwezig zijn in `blog/index.html` overzicht + `sitemap.xml`

**Niet voor:** landing pages (`gidsen.html`, `sample-pentest.html`), legal pages of pure tool-tutorials zonder educatieve laag.

---

## Ground truth: kopieer een bestaande post

De rijkste referentie-post is **`blog/ethisch-hacker-worden.html`** — complete moderne stack met JSON-LD, dual-CTA, bidirectional clustering, callouts en terminal-examples. Kopieer deze structuur als startpunt en swap content.

Andere goede referenties:

- `blog/owasp-top-10-uitgelegd.html` — hub-post-pattern (10 H3's onder één H2, bidirectional naar 3 bestaande posts) — Sessie 138
- `blog/sql-injection-uitgelegd.html` — diepere-uitleg-pattern met case-studies
- `blog/welkom.html` — minimale instap-pattern voor korte posts

---

## Vereiste structuur

### `<head>`

1. SEO meta tags (`title`, `description`, `keywords`, `author`)
2. Open Graph + `article:published_time` / `article:section`
3. Canonical URL
4. Favicons + manifest
5. Stylesheets: `main.css`, `blog.css`, `mobile.css` (alle drie met `?v=NNN` versioning)
6. Google AdSense + Consent Mode v2 defaults
7. **JSON-LD Article schema** — verplicht voor SEO
8. **JSON-LD BreadcrumbList schema** — verplicht voor SEO rich-results (Sessie 139)

### Pre-`</body>` scripts (in deze volgorde)

```html
<!-- Theme Initialization (prevents flash) - external for CSP compliance -->
<script src="/src/init-theme.js"></script>

<!-- Component Injection (external script for CSP compliance) -->
<script src="/src/init-components.js" type="module"></script>

<!-- Analytics & Consent (external for CSP compliance) -->
<script src="/src/init-analytics.js" type="module"></script>

<!-- Reading Progress (blog-specific) -->
<script src="../src/ui/blog-theme.js" type="module"></script>
```

**Kritiek (Sessie 131-fix):**

- **Absolute paths (`/src/...`)** voor init-scripts — relatieve paths breken op subpath-URLs. `gidsen.html` faalde silent omdat het relatieve paden gebruikte.
- **`init-analytics.js` bundelt** consent-banner + GA4 + Brevo + CTA-tracking. Géén losse `consent-banner.js` / `consent.js` / `tracker.js` / `events.js` meer (pre-Sessie-131 pattern is verouderd).

---

## JSON-LD Article schema

Plaats in `<head>`, mirror `blog/ethisch-hacker-worden.html` regel 70-101:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "<Title zonder site-name>",
  "description": "<1-zin summary, 150-160 chars>",
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "author": { "@type": "Organization", "name": "HackSimulator.nl" },
  "publisher": { "@type": "Organization", "name": "HackSimulator.nl", "url": "https://hacksimulator.nl/" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "<full-URL>" },
  "inLanguage": "nl-NL",
  "keywords": "<comma-separated long-tail keywords>",
  "wordCount": <integer, meet via validate-blogs.sh>,
  "image": {
    "@type": "ImageObject",
    "url": "https://hacksimulator.nl/assets/og-image.png",
    "width": 1200,
    "height": 630
  }
}
</script>
```

---

## Breadcrumb (verplicht, Sessie 139)

Plaats direct binnen `<main>`, vóór `<article class="blog-post">`. Hardcoded HTML — geen JS-injectie (SEO-crawlbaar, valt onder unified-nav strategie):

```html
<!-- Breadcrumb (Sessie 139) -->
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/blog/">Blog</a></li>
    <li aria-current="page"><Post Titel></li>
  </ol>
</nav>
```

Plus de bijbehorende JSON-LD in `<head>` (direct na het Article schema-blok):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hacksimulator.nl/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://hacksimulator.nl/blog/" },
    { "@type": "ListItem", "position": 3, "name": "<Post Titel>", "item": "https://hacksimulator.nl/blog/<filename>.html" }
  ]
}
</script>
```

`scripts/validate-blogs.sh` controleert beide (checks 4+5). Skip alleen voor `blog/index.html` (hub-pagina).

---

## CTAs (verplicht)

Sessie 137-pattern: 13+ CTAs werken zero-cost via delegated listener in `src/ui/cta-tracking.js`. Géén JS-changes nodig — alleen `data-*` attributen.

### Lead-magnet CTA (top-of-article)

Plaats direct na de intro-paragraaf, vóór de eerste `<h2>`:

```html
<div class="blog-cta blog-cta-product">
  <h3>[Contextuele bridge-zin naar Fase 0 reconnaissance]</h3>
  <p>[Korte tie-in tussen blog-topic en pentest-sample]</p>
  <a href="/sample-pentest.html" class="blog-cta-button"
     data-lead-magnet="pentest_sample"
     data-cta-location="blog_<unique-slug>_top">Download de gratis sample</a>
</div>
```

**Kritiek:**

- `data-cta-location` moet **uniek per positie** (per-positie GA4-attributie). Pattern: `blog_<post-topic>_<top|mid|bottom>`.
- Contextual copy per post — bridge-zin redt imperfecte topical fit (Sessie 129 + 137-learning).
- `data-lead-magnet` triggert `lead_magnet_cta_click` event, niet `product_cta_click` (Sessie 133 dual-fire pattern).

### Gumroad product-CTA (mid-content)

Plaats na een natuurlijke break in content (~50% door post, na een H2 die structureel past):

```html
<div class="blog-cta blog-cta-product">
  <h3>[Product-bridge-zin]</h3>
  <p>[Tie-in tussen blog-content en product]</p>
  <a href="https://hacksimulator.gumroad.com/l/<product-id>" class="blog-cta-button"
     target="_blank" rel="noopener noreferrer"
     data-product-id="<product-id>"
     data-cta-location="blog_<unique-slug>_mid">Bekijk [Product]</a>
</div>
```

**Product-mapping (Sessie 129):**

| Topic | Product | Gumroad ID |
|---|---|---|
| Carrière, leerpad, structureel leren | 12-Weken Leerplan | `eogjdk` |
| Recon, pentest-praktijk, checklist | Pentest Playbook | `wmvpx` |
| Juridisch, wat-mag-wel-niet | Juridische Gids | `yzdtfx` |
| Algemeen, instap, breed | Bundle | `emzjvj` |

**Niet doen:** twee CTAs voor hetzelfde product. Pentest Playbook is alleen voor lead-magnet (gratis sample). Mid-CTA = ander product.

---

## Bidirectional clustering (verplicht)

Sessie 125 + 138-pattern. Voor élke nieuwe post:

1. **3+ outbound internal links** naar bestaande posts (in content, niet alleen Related Articles grid)
2. **3 inbound links** vanuit bestaande posts (1 edit per post)

### Anker-paragraaf-strategie (Sessie 138)

Vóór je inbound-links plant, grep bestaande posts op je topic-keyword:

```bash
grep -n "OWASP\|XSS\|<topic>" blog/*.html
```

Vaak hebben ze al een `<abbr class="jargon">` of plain mention die je kunt omhullen met `<a href=...>`. Geeft descriptive SEO-anchor zonder content-rewrite.

### Related Articles grid (onderaan post)

Mirror `blog/ethisch-hacker-worden.html` regel 562-589 — 4 kaarten naar gerelateerde posts.

---

## Content-patterns

### Inline jargon (verplicht)

Elke technische term de eerste keer in de post:

```html
<abbr class="jargon" title="<NL-uitleg, complete zin>" tabindex="0"><strong>term</strong></abbr>
```

Site-totaal nu 105+ jargon-explanations. Consistency essentieel — toon de term zelf in `<strong>`, uitleg in `title`-attribute.

### Terminal-example block (aanbevolen, 1-2 per post)

```html
<div class="terminal-example">
  <div class="prompt">$ <command></div>
  <div class="output">
<output regel 1>     ← <NL context>
<output regel 2>     ← <NL context>

[TIP] <NL-tip over wat dit betekent>
  </div>
</div>
```

### Callouts (3 varianten)

- `<div class="blog-tip">...</div>` — proactieve hint
- `<div class="blog-warning">...</div>` — juridische of security-waarschuwing
- `<div class="blog-info">...</div>` — context, achtergrond, nuance

**KRITIEK (Sessie 138-bug):** sluit ALTIJD met `</div>`, NOOIT met `</p>`. Browsers renderen forgiving, dus een ongesloten div = callout-styling erft door over de rest van de post tot een ouderlijk `</div>` het opvangt. Tag-balans-check vangt dit (zie Validatie).

---

## Tone & taalconsistentie

- "ethisch hacken" niet "ethical hacking" (Sessie 128 + 130 — geldt ook in fallback-strings)
- "je" niet "u" — toegankelijk en persoonlijk
- "Goed bezig!", "Bijna!" — bemoedigend, niet "Fout." of "Wrong."
- **Geen emojis** in code/content (CLAUDE.md tone-guideline)
- ASCII brackets only: `[TIP]`, `[!]`, `[✓]` — terminal aesthetic
- Prompt prefix `user@hacksim` of `hacker@hacksim` consistent over hele post (Sessie 130)

---

## Distributie bij publicatie

1. **`blog/index.html`** — voeg `<article class="blog-post-card">` bovenaan de grid toe. Mirror exacte markup van bestaande card (inclusief `data-category=`). Markup-afwijking breekt grid-styling.
2. **`sitemap.xml`** — voeg `<url>` entry binnen Blog-sectie: `priority` 0.7 (hub-post) of 0.6 (gewone post), `lastmod` = vandaag, `changefreq` monthly.
3. **3 bestaande posts** — voeg inbound-link toe (bidirectional clustering, zie boven).

---

## Validatie

### Pre-deploy lokaal (verplicht)

```bash
./scripts/validate-blogs.sh
```

Drie checks per blog HTML-file:

1. `init-analytics.js` script tag aanwezig (Sessie 131-pattern)
2. JSON-LD schema in `<head>` (SEO requirement)
3. HTML tag-balans: `<div>` count == `</div>` count (Sessie 138-learning)

Alle drie moeten groen zijn vóór commit. Bij failure: lees de exit-message, fix, run opnieuw.

**Geautomatiseerd:** dit script draait automatisch via pre-commit hook (`.pre-commit-config.yaml`) bij wijzigingen in `blog/*.html`. Commit-poging faalt als één van de 3 checks rood is.

**Known limitation (Sessie 138):** de tag-balans-check is grep-based, geen echte HTML-parser. Posts met inline HTML-strings in tekst-content (bv. `<div>` in een code-voorbeeld zonder backticks) kunnen false positives/negatives geven. Voor lopende-tekst-content werkt het robuust; bij twijfel: extra Playwright structure-check post-deploy.

### Post-deploy productie smoke-test

Playwright pattern (Sessie 137-learning — gebruik dataLayer-hook als consent-onafhankelijke ground truth):

```js
await page.goto('https://hacksimulator.nl/blog/<slug>.html');
const events = await page.evaluate(() => {
  const captured = [];
  const origPush = window.dataLayer.push.bind(window.dataLayer);
  window.dataLayer.push = (...args) => { captured.push(args[0]); return origPush(...args); };

  const lm = document.querySelector('[data-lead-magnet="pentest_sample"]');
  lm.addEventListener('click', e => e.preventDefault(), { once: true, capture: true });
  lm.click();

  const gm = document.querySelector('[data-product-id]');
  gm.addEventListener('click', e => e.preventDefault(), { once: true, capture: true });
  gm.click();

  return captured;
});
```

Verwacht: 2 events met juiste `data-cta-location`-strings in payload.

---

## Definition of Done

Voor élke nieuwe blog-post:

- [ ] 1800-2200 woorden NL lopende tekst (gemeten via `validate-blogs.sh`-equivalente regex op `.blog-post-content`)
- [ ] JSON-LD Article schema met juiste `headline`, `datePublished`, `wordCount`, `keywords`
- [ ] Lead-magnet CTA top-of-article met uniek `data-cta-location`
- [ ] Gumroad CTA mid-content met juist `data-product-id` + uniek `data-cta-location`
- [ ] 3+ outbound internal links naar bestaande posts
- [ ] 3 inbound links toegevoegd in bestaande posts
- [ ] `blog/index.html` post-card toegevoegd bovenaan grid
- [ ] `sitemap.xml` entry toegevoegd
- [ ] `./scripts/validate-blogs.sh` groen (3/3 checks)
- [ ] Playwright productie-smoke-test groen na Netlify-deploy
- [ ] Bundle delta < 35 KB (target ~30 KB per post)

---

## Referenties

**Template-bronnen:**

- `blog/ethisch-hacker-worden.html` — rijkste referentie-post
- `blog/owasp-top-10-uitgelegd.html` — hub-post-pattern (Sessie 138)
- `blog/welkom.html` — minimale instap-pattern

**Tooling:**

- `scripts/validate-blogs.sh` — pre-deploy validatie (3 checks)
- `src/ui/cta-tracking.js` — delegated CTA-listener (Sessie 131)
- `src/init-analytics.js` — consent + GA4 + Brevo bundling

**Documentatie:**

- `.claude/rules/tone-and-output.md` — taal- en stijlvoorbeelden
- `.claude/plans/monetization-C-content-seo.md` — Plan C bron (product-mapping, meetcriteria)
- `docs/prd.md` — full PRD inclusief monetization-strategie

---

## Critical sessions reference

- **Sessie 125** — JSON-LD schema + internal cross-linking strategie
- **Sessie 128** — Taalconsistentie: "ethisch hacken" niet "ethical hacking"
- **Sessie 129** — Contextual CTAs > generic CTAs (per-post product-fit)
- **Sessie 131** — `init-analytics.js` consolidation + absolute paths + delegated CTA-listener
- **Sessie 133** — Dual-fire pattern voor lead-magnet vs product clicks
- **Sessie 137** — Pulse-check via simulate success-panel toggle + 13-CTA coverage met unieke `data-cta-location`
- **Sessie 138** — Tag-balans-check als DoD-item + bidirectional clustering hub-pattern + anker-paragraaf-strategie
