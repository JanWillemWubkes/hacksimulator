---
name: blog-post
description: Gebruik bij het toevoegen of bijwerken van een blogpost op HackSimulator (blog/*.html). Bewaakt de titel-lockstep over 7 locaties, de 4 afgeleide admin-items (blog-count, RSS, sitemap, bundle-KB) en draait de bestaande validatiescripts als gate. Trigger op "nieuwe blogpost", "blog toevoegen", "blog updaten".
---

# Blogpost toevoegen / bijwerken

Deze skill levert **oordeel + volgorde**. De verificatie komt van de bestaande scripts
(`scripts/validate-blogs.sh` + `scripts/validate-docs.sh --deep`) — herimplementeer die checks niet,
draai ze.

## Waarom deze skill bestaat
Een nieuwe post trekt automatisch 4 afgeleide administratie-items uit sync (Sessie 199-learning).
Alleen de `<h1>` schrijven laat de gestructureerde data + de site-administratie divergeren. Beweeg
alles in lockstep.

## Stap 1 — Modelleer op een bestaande post
Kopieer de structuur van een bestaande, complete post (bv. `blog/ethisch-hacker-worden.html` of de
nmap-post). Zo erf je gratis alle conventies die `validate-blogs.sh` afdwingt:
- `init-analytics.js` script-tag
- JSON-LD in `<head>` met Organization-auteur
- `<nav class="breadcrumb">` + `"@type": "BreadcrumbList"` JSON-LD
- consent-model-CTA's, blauw palet (**geen groen** — dat is main-site), gebalanceerde `<div>`-tags

## Stap 2 — Titel-lockstep: één bronstring → 7 locaties
De titel leeft op 7 plekken. Kies één bronstring en zet 'm consistent (zelfde bron → zelfde output):
1. `<title>…| HackSimulator.nl</title>`
2. `<meta property="og:title" …>`
3. `<meta name="twitter:title" …>`
4. JSON-LD `"headline": …`
5. BreadcrumbList `"name"` (position 3, de huidige pagina)
6. `<h1 class="blog-post-title">…</h1>`
7. De kaart op `blog/index.html` (blog-index)

Alleen de `<h1>` fixen = gestructureerde data divergeert. Beweeg ze samen.

**Descriptions parallel:** `<meta name="twitter:description">` spiegelt `<meta property="og:description">`
verbatim (net als twitter:title ↔ og:title hierboven). `validate-blogs.sh` Check 6 dwingt af dat
beide twitter-tags aanwezig zijn.

## Stap 3 — NL-zinskapitaal in de kop
Eerste woord + eigennamen hoofdletter, de rest klein — óók Engelse vaktermen ("brute force",
"social engineering") tenzij echte eigennaam. Behoud: merken (Metasploit/Nmap/OWASP Top 10),
nationaliteitsadjectieven (Nederlandse/Engelse), camelCase-API's, acroniemen, officiële namen.
Bij twijfel: draai de `nl-content-reviewer`-agent of de `new-command`-conventies.

## Stap 4 — Beweeg de 4 afgeleide admin-items MEE (expliciet)
Drift-detectie in `validate-docs.sh --deep` trekt deze 4 uit sync als je ze vergeet:
1. **Blog-count** in de TASKS.md-tabel (sub-check 6b: `ls blog/*.html` minus index/welkom).
2. **RSS-item** in `feed.xml` (check 9b: item-count == `blog/*.html` minus index).
3. **Sitemap-entry** in `sitemap.xml` met `lastmod >= datePublished` (check 9a).
4. **Bundle blog-KB** in de VALIDATE-BUNDLE-marker in TASKS.md (check 5, ±5% tolerantie).

**Datums nooit faken of future-daten** (Sessie 199): `datePublished` = echte deploy-dag. Verifieer
weekdag/datum met `date -d YYYY-MM-DD +%A` vóór je iets plant. Juridische claims spiegelen op de
bestaande posts (art. 138ab Sr zónder verzonnen strafmaat).

## Stap 5 — Gate (verplicht, exit 0)
```bash
./scripts/validate-blogs.sh          # structuur: init-analytics, JSON-LD, div-balans, breadcrumb(s)
./scripts/validate-docs.sh --deep    # cross-doc + SEO-metadata sync (blog-count/RSS/sitemap/bundle)
```
Beide moeten exit 0 geven. Bij falen: los de gemelde drift op, herdraai. De pre-commit hook draait
dit óók — maar hier vang je het fail-fast, vóór de commit.

## Niet committen zonder expliciete go
Commit + push zijn een aparte stap (project-conventie), niet onderdeel van deze skill.
