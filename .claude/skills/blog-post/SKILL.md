---
name: blog-post
description: Gebruik bij het toevoegen of bijwerken van een blogpost op HackSimulator (blog/*.html). Bewaakt de titel-lockstep over 8 locaties, de 4 afgeleide admin-items (blog-count, RSS, sitemap, bundle-KB), de zichtbare verificatiedatum en draait de bestaande validatiescripts als gate. Trigger op "nieuwe blogpost", "blog toevoegen", "blog updaten".
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

## Stap 2 — Titel-lockstep: één bronstring → 8 locaties
De titel leeft op 8 plekken. Kies één bronstring en zet 'm consistent (zelfde bron → zelfde output):
1. `<title>…| HackSimulator.nl</title>`
2. `<meta property="og:title" …>`
3. `<meta name="twitter:title" …>`
4. JSON-LD `"headline": …`
5. BreadcrumbList `"name"` (position 3, de huidige pagina)
6. `<h1 class="blog-post-title">…</h1>`
7. De kaart op `blog/index.html` (blog-index)
8. **`<title>` van het `<item>` in `feed.xml`** (Sessie 208 — deze ontbrak, waardoor alle 14
   feed-titels in Title Case bleven staan na de sitebrede omzetting naar zinskapitaal)

Alleen de `<h1>` fixen = gestructureerde data divergeert. Beweeg ze samen.

> **Let op bij locatie 8:** de bron voor de RSS-titel is de **`<title>`-tag**, niet de `<h1>`.
> Bij sommige posts is de `<h1>` bewust korter dan de SEO-titel (bijv. `wat-is-ethisch-hacken`);
> syncen op `<h1>` zou de feed-titel dan onbedoeld inkorten. `validate-docs.sh --deep` check 9c
> bewaakt dit (merk-suffix `| HackSimulator.nl` wordt afgestript).

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

**Volgorde op de hubpagina:** nieuwe kaart bovenaan in `blog/index.html` — de grid staat
nieuwste-eerst en `validate-docs.sh --deep` check 9d faalt bij een oudere post boven een nieuwere.

**Datums nooit faken of future-daten** (Sessie 199): `datePublished` = echte deploy-dag. Verifieer
weekdag/datum met `date -d YYYY-MM-DD +%A` vóór je iets plant. Juridische claims spiegelen op de
bestaande posts (art. 138ab Sr zónder verzonnen strafmaat).

## Stap 5 — Zet de verificatiedatum (verplicht, gate in `validate-blogs.sh` check 7)
Elke post draagt zichtbaar wannéér de feitelijke beweringen voor het laatst zijn nagelopen.
De lezer kan de inhoud niet zelf beoordelen; dit is het minimum dat we wél kunnen bieden.
Zet in `.blog-post-meta`, ná de categorie-badge:

```html
<span class="blog-fact-checked" title="Datum waarop de feitelijke beweringen in dit artikel voor het laatst zijn nagelopen">Feiten gecontroleerd: <time datetime="JJJJ-MM-DD">D maand JJJJ</time> &middot; <a href="/over-ons.html#verantwoording">hoe ik dit controleer</a></span>
```

De link naar `#verantwoording` is verplicht: zonder ingang is het redactiebeleid onvindbaar.
Zet hem **ná** de `</time>` — de gate in `validate-blogs.sh` eist dat er tussen de span-tag en
`<time` geen `<` staat, dus een link ervóór breekt de check.

**Vul de échte datum in — de dag waarop je de claims daadwerkelijk hebt nagelopen.** Niet
"vandaag" omdat het bestand vandaag is aangeraakt: dan is de regel op álle posts waardeloos.
Elke harde numerieke claim (snelheden, CVSS-scores, percentages, jaartallen) krijgt een bron of
verdwijnt — liever een feit weglaten dan een onzekere claim plaatsen (Sessie 164).

## Stap 6 — Genereer de social share card
Elke post heeft een eigen `og:image`; er is géén generieke terugval meer (Sessie 207). Draai:

```bash
node scripts/build-blog-og-images.mjs      # leest blog/*.html, schrijft assets/blog/<slug>.png
```

Het script leest titel (`<h1>`) en categorie (`og:article:section`) **uit de post zelf**, dus dit
is bewust géén 8e lockstep-locatie — je hoeft niets over te tikken. Wel dit zetten in de post
(3 plekken, allemaal dezelfde URL `https://hacksimulator.nl/assets/blog/<slug>.png?v=1`):
`og:image`, `twitter:image` en JSON-LD `image.url`. De bestaande `og:image:width/height` (1200/630)
blijven kloppen — het script rendert exact die maat, niet @2x.

Wijzigt de titel later? Herdraai het script, anders toont de kaart de oude kop.

**Controle:** `file assets/blog/<slug>.png` moet `1200 x 630` geven, en
`grep -c 'assets/og-image.png' blog/<slug>.html` moet 0 zijn.

## Stap 7 — Gate (verplicht, exit 0)
```bash
./scripts/validate-blogs.sh          # structuur: init-analytics, JSON-LD, div-balans, breadcrumb(s)
./scripts/validate-docs.sh --deep    # cross-doc + SEO-metadata sync (blog-count/RSS/sitemap/bundle)
```
Beide moeten exit 0 geven. Bij falen: los de gemelde drift op, herdraai. De pre-commit hook draait
dit óók — maar hier vang je het fail-fast, vóór de commit.

## Niet committen zonder expliciete go
Commit + push zijn een aparte stap (project-conventie), niet onderdeel van deze skill.
