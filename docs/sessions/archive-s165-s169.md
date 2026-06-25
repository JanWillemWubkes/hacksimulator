# Sessie-archief 165-169 — HackSimulator.nl

**Range-archief** (geroteerd uit `current.md`, Sessie 180). Nieuwste-eerst.
Conventie: `docs/sessions/README.md`.

---

## Sessie 169: GSC-indexeringsanalyse + SEO-fix (niet-geïndexeerde pagina's) (16 jun 2026)

**Mission:** Gebruiker deelde Google Search Console-screenshots ("Waarom pagina's niet worden geïndexeerd": 3 omleiding + 1 alt-canonical + 8 gevonden + 7 gecrawld = 19 pagina's). Analyseren wat echt kapot is vs. benign, de fixbare oorzaken oplossen, deployen en GSC-vervolgstappen aanreiken.

**Work done:**
- **Plan-mode diagnose (read-only):** 2 Explore-agents brachten alle SEO-config + 30 HTML-pagina's in kaart. Conclusie vooraf: SEO-fundament solide (canonicals overal, complete sitemap, correcte robots.txt, geen duplicate-pagina's). Geen bug op config-niveau.
- **Scope-besluit:** "slimme sweep" aanbevolen (optie 3 minus expliciete `robots`-meta op alle pagina's = cargo-cult; default is al index,follow). Gebruiker leverde de **exacte GSC-URL-lijsten** → per-URL diagnose i.p.v. gokwerk.
- **Per-URL diagnose (de kern):**
  - *Pagina met omleiding (3):* `http://www.`, `https://www.`, `http://` homepage-varianten → 301's werken correct, **benign**.
  - *Alt-canonical (1):* `/index.html` → canonical `/`. **Bron achterhaald:** `welkom.html` body linkte via `../index.html`.
  - *Gecrawld, niet geïndexeerd (7):* o.a. `/blog/index.html` (**bron: alle 14 blog-footers `href="index.html"`**) + extensieloze URL's (`/terminal`, `/blog/welkom`, `/blog/terminal-basics`, `/blog/wat-is-ethisch-hacken`, `/assets/legal/privacy`) = historisch (staan nergens meer in code), consolideren via canonical.
  - *Gevonden, niet geïndexeerd (8):* 5 blogposts + gidsen/sample-pentest/woordenlijst = crawl-budget/autoriteit voor jong domein.
- **Fixes (commit `cce7dce`, 15 files):**
  - `sed` over `blog/*.html`: 14 footer-links `href="index.html"` → `href="/blog/"` (verwijdert `/blog/index.html`-duplicaat-bron).
  - `welkom.html` body: `../index.html` → `/` (verwijdert `/index.html`-duplicaat-bron).
  - `index.html`: homepage blog-links 3 → 8 (cybersecurity-tools, wachtwoord-beveiliging, sql-injection-uitgelegd, social-engineering, linux-bestandssysteem toegevoegd; `.blog-links-list` is `flex-wrap` → wrapt netjes).
  - `sitemap.xml`: `lastmod` → 2026-06-15 voor homepage + 6 vastzittende posts (accuraat: vandaag gewijzigd; nudgt recrawl).
- **Verificatie:** Python XML-parse (xmllint ontbreekt) = 25 URLs valid; alle nieuwe links resolven naar bestaande bestanden; nul resterende `index.html`-links repo-breed; `validate-docs.sh` exit 0 (incl. Check 6 sitemap↔blog lastmod≥datePublished). Gepusht naar `main` → Netlify deploy.
- **GSC-vervolgstappen aangereikt:** sitemap opnieuw indienen (ná deploy-verificatie van live `lastmod`), 9 prioriteit-1-URL's voor "Indexering aanvragen" + 5 prioriteit-2-URL's (eerst inspecteren, want canonieke `.html`-versies mogelijk al geïndexeerd).

**Commits:** `cce7dce` (fix(seo): duplicaat-URL-bronnen + recrawl-nudge) + deze /summary doc-sync.

**Learnings:**
- **GSC-bron-kolom scheidt fixbaar van niet-fixbaar:** "Website"-bron (redirect/canonical/noindex) = jouw config; "Google-systemen" (gevonden/gecrawld niet geïndexeerd) = crawl-budget/autoriteit/tijd, niet patchbaar in code. Eerlijk blijven hierover voorkwam over-promising.
- **Exacte URL's > educated guesses:** de screenshots toonden alleen aantallen. Pas de echte lijsten onthulden het patroon (extensieloze duplicaten + `index.html`-links) dat ik op aannames had gemist. De 30 sec die de gebruiker aan kopiëren besteedde, bespaarde een diff die het echte probleem miste.
- **Interne links zijn hier een marginale nudge, geen oplossing:** `cybersecurity-tools` had 9 inbound related-card-links én zat tóch in "gevonden, niet geïndexeerd" → falsificeert link-depth als silver bullet. Mijn eerste inbound-telling was bovendien fout (ving alleen absolute `/blog/`-links, niet relatieve related-cards) — gecorrigeerd vóór ik er conclusies aan verbond.
- **Relatieve `index.html`-links = stille duplicaat-fabriek:** Netlify serveert `/foo.html` óók op `/foo` (200) ongeacht `pretty_urls=false`; een `href="index.html"` in een footer voedt Google een `/blog/index.html` naast de canonical `/blog/`. Canonical lost het op, maar de bron weghalen is netter en stopt crawl-budget-verspilling.
- **Cargo-cult vermijden:** expliciete `<meta name="robots" content="index,follow">` toevoegen doet niets (default = index,follow) — bewust uit scope gehouden ondanks "volledige sweep"-verzoek; correctheid boven schijn-grondigheid.

**Next steps (handmatig, gebruiker in GSC — geen code):**
- [ ] Verifiëren dat live `sitemap.xml` `2026-06-15` toont, dan sitemap opnieuw indienen.
- [ ] "Indexering aanvragen" voor 9 prioriteit-1-URL's (gidsen/sample-pentest/woordenlijst + 5 blogposts + ethisch-hacker-worden); prioriteit-2 eerst inspecteren.
- [ ] `/index.html`-melding in GSC "Oplossing valideren" (bron-link verwijderd).
- [ ] Over weken: duplicaat-meldingen horen te verdwijnen; gevonden/gecrawld-niet-geïndexeerd hangt af van backlinks + tijd.

**Metrics delta:** `index.html` +5 regels, 13 blog-footers + 1 welkom-body link, sitemap 7× lastmod. Geen runtime/bundle-impact (blog + index buiten Terminal Core budget). Tests ongewijzigd (23 spec files / 172 test()-decls / ~197 runs).

---

## Sessie 168: Blog-tabel-uitlijning fix (Filter ↔ beschrijving) (15 jun 2026)

**Mission:** Door gebruiker gemelde visuele bug: in de blog-tabellen (screenshot Wireshark-gids) liepen de kolommen "Filter" en "Wat laat het zien?" per rij niet gelijk. Oorzaak achterhalen en oplossen, daarna committen + doc-sync.

**Work done:**
- **Diagnose (plan-mode, read-only):** De tabel is een correcte HTML-`<table>` binnen `.blog-post-content`. `styles/blog.css` bevat één styling voor `code`/`pre`/`.terminal-example` maar **nul regels** voor `<table>`/`<th>`/`<td>`. De tabel viel dus terug op browser-defaults: `border-collapse: separate` én — de echte boosdoener — `vertical-align: baseline`. Zodra een kolom-1-cel met `<code>` afbrak over twee regels (`ip.addr == 192.168.1.10`, en `dns` → 2-regelige beschrijving), lijnde de rechterkolom uit op de baseline van de afgebroken code-regel → rijen uit sync.
- **Fix:** Scoped blok in `styles/blog.css` (vóór `.terminal-example`): `.blog-post-content table` (`width:100%`, `border-collapse:collapse`, marge) + `.blog-post-content th,td` (`padding`, `text-align:left`, **`vertical-align:top`** = kern-fix, `border-bottom`) + `.blog-post-content th` (accent-kleur + dikkere onderrand). Patroon gespiegeld uit `styles/legal.css` (regels 73-91), maar met blog-CSS-variabelen (`--spacing-*`, `--color-border`, `--color-ui-primary`) → thema-aware zonder aparte light-override. Geen HTML aangeraakt.
- **Scope-bonus:** omdat de oorzaak een *ontbrekende* regel was (geen verkeerde override), repareert één cascade-blok alle 4 blog-tabellen tegelijk: wireshark (5 rijen), nmap (6), hashcat (5), wachtwoord-beveiliging (7).
- **Verificatie (Playwright MCP, lokale `python3 -m http.server`):** per rij `getBoundingClientRect().top` van cel-1 vs cel-2 vergeleken → alle rijen `filterTop == descTop` op alle 4 pagina's. Computed `border-collapse: collapse` + `vertical-align: top` bevestigd. Dark + light screenshots OK (`.playwright-mcp/wireshark-table-{dark,light}.png`). Mobiel 375px: geen horizontale overflow (`scrollWidth 360 == clientWidth 360`), rijen uitgelijnd. De console-`403` van AdSense op localhost is bestaand/ongerelateerd.

**Commits:** `4368bb4` (fix(blog): tabel-uitlijning) + deze /summary doc-sync.

**Learnings:**
- Een nette HTML-`<table>` lijnt niet vanzelf uit: zonder eigen CSS valt 'ie terug op `vertical-align: baseline`, wat bij multi-line cellen de rij-uitlijning breekt. `blog.css` had nooit tabel-styling — een latente bug die pas zichtbaar werd toen een filter-cel afbrak.
- Uitlijning *meten* (`getBoundingClientRect().top` cel-1 vs cel-2) bewijst de fix harder dan een screenshot beoordelen — `filterTop == descTop` is een binaire pass/fail, ook over dark/light/375px.
- Fix op cascade-niveau wanneer de oorzaak een ontbrekende regel is: één scoped `.blog-post-content table`-blok repareerde 4 pagina's i.p.v. symptoom-per-pagina.
- Bewezen patroon hergebruiken (`legal.css` tabel-styling) maar met de doel-context z'n eigen CSS-variabelen → thema-aware "gratis", conform architecture-patterns.md §1 (CSS Variables First).

**Next steps:** Geen open punten. Bulk-rotatie 155-159 in CLAUDE.md blijft apart gedeferd.

**Metrics delta:** `styles/` ~377→378 KB unminified (+~0,7 KB), binnen Check 5 ±5%-tolerantie. Bundle-budget (Terminal Core <400 KB) ongewijzigd — blog.css zit niet in de terminal-runtime-graaf. Tests ongewijzigd (23 spec files / ~197 per project).

---

## Sessie 167: Doc-drift fix M9 — esbuild post-launch-blok uit milestone-sectie (15 jun 2026)

**Mission:** Losstaande doc-drift opruimen (geen site-code). `scripts/validate-docs.sh --deep` Check 6 faalde op M9: de milestone-tabel zegt `19/19` (100%), maar de M9-sectie telt via `[x]+[ ]` ground-truth `19/24` (79%). Plan-mode: reproduceren → bron lezen → bewuste (a)/(b)-beslissing met aanbeveling vóór edit.

**Work done:**
- **Diagnose:** In Sessie 162/163 is een esbuild content-hash post-launch-blok (`### 🔵 OPEN (post-launch): esbuild content-hash build + cache-correctheid`, 5 `[ ]`-items) toegevoegd ALS h3 *binnen* de M9-sectie. Check 6 bakent M9 af als h2-emoji-anchored awk-range `/^## 🧹 M9:/,/^## 🎓 M6:/` → de h3 valt binnen die range → 19 `[x]` + 5 `[ ]` = 24. Fast-mode (pre-commit-gate) telt geen sectie-checkboxes en miste dit; alleen `--deep` vangt het.
- **Beslissing (b), bevestigd via AskUserQuestion:** esbuild = nieuwe post-launch scope, GEEN M9-taak. Bron-onderbouwing: M9 Status = ✅ Voltooid (Sessie 105-110), footer `Total Tasks: 19`, 6 sub-secties tellen exact op tot 19 (3+4+4+3+3+2) allen `[x]`; het esbuild-blok zegt letterlijk "**Geen pre-launch werk**", is getagd Sessie 162 (50+ sessies ná M9-closure), raakt PRD §13 "no build step" red line, en de eerste taak is een PRD/PLANNING scope-*besluit* (nog niet genomen). Optie (a) (reopen → 🔵 In uitvoering) zou een afgeronde sprint heropenen voor niet-besloten werk = drift institutionaliseren.
- **Fix:** Python-script met occurrence-asserts (`/tmp/move_esbuild.py`) — knip het blok van de h3-anchor t/m (excl.) `### Bundle Size Optimization`, plak het na `- [ ] **Cookie-less Tracking**` in `## 🔮 Post-MVP Features` (regel 686, vóór de M9-h2 → buiten élke `MILESTONE_RANGES`-entry). Asserts: h3 exact 1×, 5×`[ ]` behouden in blok, ná move M9-range 0 `[ ]` + 19 `[x]`, h3 buiten M9-range, totaal-`[ ]` ongewijzigd (97→97). Twee cosmetische witregel-artefacten (cut nam de scheider mee → ontbrekende leegregel vóór `### Bundle Size Optimization`; paste verdubbelde een leegregel vóór de M9-`---`) handmatig met Edit gecorrigeerd.
- **Gate:** `bash scripts/validate-docs.sh --deep` exit 0; M9 nu `OK 19/19` + `OK 100%`, nul FAIL.

**Commits:** deze /summary doc-sync.

**Learnings:**
- De "fix" voor een sectie↔tabel-drift is fysieke *verplaatsing* over een h2-grens, niet cijfers herschrijven: Check 6's awk-range is h2-anchored, dus een h3-subsectie erft de milestone-telling van z'n omhullende h2. Topische verwantschap (esbuild ≈ M9 bundle/cache-sprint) ≠ sprint-lidmaatschap.
- Fast-mode vs `--deep` asymmetrie bevestigd in de praktijk: een drift die de pre-commit-gate passeert maar `--deep` faalt, betekent dat de drift via sectie-checkbox-telling binnenkwam — precies het gat dat Sessie 158 #23.1 dichtte.
- Occurrence-asserts bewaken semantiek (checkbox-counts, h3-uniciteit, range-grenzen) maar niet cosmetische witruimte → losse visuele controle ná de geautomatiseerde move blijft nodig bij blok-verplaatsingen in markdown.

**Next steps:** Geen. Bulk-rotatie 155-159 in CLAUDE.md blijft apart gedeferd (dubbelzinnige archief-bestemming). esbuild content-hash blijft post-launch backlog-item, geblokkeerd op PRD §13 scope-besluit.

**Metrics delta:** Doc-only. Bundle onveranderd (src 637 / styles 387 / blog 427 / assets 704 KB — alle binnen Check 5 ±5% tolerantie). E2E 23 specs / 172 tests ongewijzigd. M9 19/19 (100%).

---

## Sessie 166: Pre-launch security-audit + CSP-hardening (14 jun 2026)

**Mission:** Volledige security-audit van het project zélf vóór de marketing-launch, zodat een security-/ethisch-hacken-product geen eigen zwakheden bevat (geloofwaardigheid). Plan-mode: 3 parallelle Explore-agents (XSS-surface / headers+integraties / privacy+deps) → eigen bronverificatie → AskUserQuestion (scope + timing) → uitvoeren met verificatie als gate.

**Work done:**
- **Audit-uitkomst:** codebase structureel gezond. Geverifieerd in orde: renderer-escaping (`src/ui/renderer.js:420` `_formatText` escapet eerst, formatteert daarna), geen secrets (alleen publieke IDs), sterke header-set (HSTS/X-Frame/nosniff/COOP/Permissions-Policy), Consent Mode v2 gate, `rel=noopener`, `_headers` (cache) ≠ conflict met `netlify.toml` (security).
- **F1 — `'unsafe-inline'`/`'unsafe-hashes'` uit CSP `script-src`** via externalisatie (niet hashen — Netlify HTML-minify breekt hashes; niet nonce — schendt "no backend"). NEW `src/analytics/consent-default.js` (gedeeld, gtag globaal gehouden, injecteert AdSense ná consent-defaults → race dicht), NEW `src/ui/brevo-config.js`, NEW `src/load-animations-css.js` (vervangt inline `onload=`); legal-pagina's inline theme → bestaande `init-theme.js`. 11 HTML-files via geverifieerd Python-transform (occurrence-asserts). Statische AdSense-tag van 4 ad-pagina's verwijderd.
- **F2** `X-XSS-Protection: 1; mode=block` → `0` (OWASP). **F4** `history.search()` try/catch + substring-fallback (invalide/ReDoS-regex). **F3** `privacy.html` feitfout gecorrigeerd (claimde misleidend "args niet gelogd" pal onder command-history-rij; args wórden lokaal bewaard ≠ verzonden; wissen via `history -c`, niet `reset`). **F6** (pre-existing, gevonden tijdens verificatie) CSP `frame-src` + `img-src` kregen `ep1/ep2.adtrafficquality.google` (AdSense fraud-frame + sodar-beacon werden geblokkeerd).
- **Trust:** NEW `.well-known/security.txt` (RFC 9116) + `SECURITY.md` + `_headers` text/plain + `/security.txt` redirect in `netlify.toml`.
- **Verificatie:** lokale server die de échte `netlify.toml`-CSP injecteert (gewone static server stuurt geen CSP) → Playwright per pagina-archetype: index/terminal/legal/brevo = **nul CSP-violations**; consent-default-denied vóór AdSense-injectie bevestigd in `dataLayer`; `gtag` globaal werkt; animations.css media→all. E2E chromium **183 passed**; de 3 "failures" via `git stash` schone-baseline ontmaskerd als 2 pre-existing + 1 flaky (geen regressie).

**Commits:** `aa0396d` (security-werk, branch `security/csp-hardening-audit`) + deze /summary doc-sync.

**Learnings:**
- Eigen bronverificatie redde de centrale bevinding: een Explore-agent claimde vals "geen unsafe-inline in script-src" terwijl `netlify.toml` het tegendeel toont.
- De gevraagde extra veiligheidscheck vóór uitvoering vond een echte consent-vs-async-AdSense race in het eerste plan → opgelost door AdSense ná de defaults te injecteren. Memory `feedback_verify_before_launch_critical` toegevoegd.
- Een "rode" test is pas een regressie als 'ie groen is zónder de diff: stash-baseline scheidde 2 pre-existing + 1 flaky van echte regressie.
- F6 was alleen zichtbaar omdat ik de echte CSP-header serveerde — anders blijven third-party CSP-gaten onzichtbaar in lokale tests.

**Next steps (handmatig voor Heisenberg):** branch pushen → Netlify deploy-preview met de echte headers verifiëren (de enige check die lokaal niet 100% na te bootsen was: Netlify-header-toepassing + HTML-minify-interactie) → merge naar `main` = productie-deploy. Niet-gedraaid: firefox/webkit E2E (wijzigingen browser-agnostisch, laag risico).

**Metrics delta:** src/ 636796 bytes (+3 kleine JS-files, verwaarloosbaar); E2E 23 specs / 172 tests (ongewijzigd). CSP `script-src` na: `'self'` + Google/Brevo hosts, geen `'unsafe-inline'`/`'unsafe-hashes'`.

---

## Sessie 165: Kwaliteits-/feitencontrole betaalde Gumroad-producten (14 jun 2026)

**Mission:** Grondige inhoudelijke kwaliteits- en feitencontrole op de betaalde Gumroad-producten (`docs/products/`), met een hógere lat dan de Sessie-164-blog-audit want dit zijn betaalde producten (memory `feedback_product_quality`: 100% accuraat). Plan-mode: verkennen → eigen bronverificatie → AskUserQuestion-scopekeuzes → uitvoeren.

**Work done:**
- **Inventaris:** canonieke bron = `.typ` (build-pdfs.sh compileert die; `-draft.md` stale). `typst 0.13.1` lokaal aanwezig. 3 Explore-agents bouwden claim-inventaris (juridische-gids / playbook+sample / listings+leerplan). **Vondst:** `leerplan.typ` is óók een betaald product maar stond niet in de opdracht — meegenomen (clean bevonden).
- **Eigen bronverificatie (WebSearch/WebFetch)** scheidde echte fouten van vals alarm. **Vals alarm (NIET aangeraakt):** OWASP Top 10:2025-volgorde in playbook (A05 Injection) + leerplan (A01–A10) — exact correct vs. officiële editie; art. 138ab-strafmaten (2/4/4 jr, 4e cat) + ingangsdatum "20 april 2016" (= officiële datum huidige tekst, maxius.nl); boete 4e cat €27.500 per 2026; art. 138b/139c/139d/350a/350b; Gelderland-zaak (€10.000/27 mnd/3,7 mln); OSCP $1.749; eJPT→INE; TryHackMe 54 rooms/13 modules; Wet Computercriminaliteit 1993/2006/2019; alle door playbook genoemde sim-commando's bestaan (`dig` correct als "niet in sim" gelabeld).
- **3 echte issues gefixt:**
  1. **Pagina-claims overdreven** (`gumroad-listings.md`): ~15/~35/~25 → "~75 totaal", echte PDF-telling (`pdfinfo`, 3 methodes) = 13/19/15 = 47. Playbook 84% overdreven. Gecorrigeerd naar 13/19/15/47 (regels 54/113/174/217/220/223/226). Geen filler — listings naar realiteit (`feedback_tone_no_hype`).
  2. **Juridische Gids Krol-zaak** (`juridische-gids.typ` r.148): "gemeenteraadslid" → "journalist en politicus" (Krol was journalist/Kamerlid); "(geanonimiseerde)" → "(echte)" medische dossiers (waren echt — dat was de pointe). Geverifieerde bronnen toegevoegd: ECLI:NL:RBOBR:2013:BZ1157 (zaak 1) + Rechtbank-Gelderland-news-URL (zaak 3, april 2021). Zaak 2 ("2014", onverifieerbaar — geen bron matcht) genericeerd tot het rechts­principe (Sessie 164: liever weglaten dan onzeker claimen). Krol-ruling-nuance toegevoegd ("rechter prees de zorgvuldigheid").
  3. **Listings MailerLite → Brevo** (r.288, stale na migratie commit 63124dd).
- **Helderheids-pass** (playbook + leerplan, volledig gelezen): offensive-tool-disclaimer in playbook bevestigd aanwezig + sterk (`#warning` schriftelijke toestemming + Fase-0 toestemmingsdocument + proportionaliteits-warnings). Glosses toegevoegd voor beginner-jargon: ICMP ("netwerkprotocol achter ping"), CVE ("openbaar gedocumenteerde kwetsbaarheden"), CVSS ("Common Vulnerability Scoring System, 0–10"). Leerplan: OWASP-2025-namen exact uitgelijnd op officiële editie (A08 "Software or Data Integrity Failures", A09 "Security Logging and Alerting Failures" — let op 2025 Monitoring→Alerting, A10 "Mishandling of Exceptional Conditions") + SQLi-superlatief "meest voorkomende" → "een van de bekendste". Cert-prijzen ongemoeid (al afgedekt door bestaande `#letop` "prijzen veranderen").
- **PDF's herbouwd** via `build-pdfs.sh` (typst 0.13.1, geen warnings). Geverifieerd: paginatelling 13/19/15/9 (matcht listings), alle fixes aanwezig in PDF-output (`pdftotext`), oude foute teksten verdwenen. `sample.pdf` (ongewijzigde bron, alleen rebuild-timestamp-ruis) teruggedraaid voor schone diff.

**Commits:** (zie git log Sessie 165 — products `.typ`+`.pdf` + listings + doc-sync).

**Learnings:**
- **Eigen bronverificatie redde wéér correcte feiten** (generaliseert Sessie 164 naar betaalde producten): élk verdacht juridisch punt + OWASP-volgorde bleek vals alarm. Blind agent/intuïtie volgen had correcte content "kapot-gefixt" (bv. "20 april 2016" leek fout maar is de officiële ingangsdatum; eJPT→INE was correcter dan de zoek-snippet die "OffSec" zei).
- **Belofte-vs-inhoud is de echte zwakte, niet de feiten:** verkoopcopy-cijfers tegen het gebouwde artefact tellen (`pdfinfo`), niet tegen de draft/schatting — *natelbaar = betrapbaar* (Sessie 161). Nieuwe memory `feedback_verify_claims_against_artifact`.
- **Onverifieerbaar specifiek = genericeren, niet gokken:** geen ECLI verzonnen voor de Gelderland-zaak (kon niet bevestigd) → geverifieerde news-URL; zaak-2-"2014" zonder bron → tot principe herschreven.
- **Eerlijk deferren boven blind protocol:** current.md bulk-rotatie (155-159) gedefererd — archief-bestemmingsconventie dubbelzinnig (recent.md t/m 149 oplopend; archive-q* 2024; N-10..N-6-regel zou een gat in current.md slaan), niet door validate-docs gecontroleerd → risico > baat vóór commit.

**Next steps:**
- **Handmatig (Heisenberg, buiten repo):** herbouwde PDF's (3 betaald + sample naar `assets/samples/`) opnieuw naar Gumroad uploaden + listing-teksten op gumroad.com met de gecorrigeerde pagina-aantallen bijwerken.
- current.md bulk-rotatie 155-159 — bestemmingsconventie bevestigen, dan uitvoeren.

**Metrics delta:** geen runtime-bundle-impact (alleen `docs/products/`). PDF-bytes: juridische 106K, playbook 118K (was 120K), leerplan 110K (was 113K), sample 89K (ongewijzigd). Tests/bundle ongewijzigd.

---
