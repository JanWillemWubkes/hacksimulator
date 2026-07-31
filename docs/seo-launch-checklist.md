# SEO-playbook — off-page acties voor Heisenberg

**Aangemaakt:** 12 juni 2026 (Sessie 160) · **Herzien:** 28 juli 2026 (Sessie 203 — na launch;
levend playbook i.p.v. pre-launch-checklist)

**Context:** De site is live. Alle **on-page/technische** SEO zit in de codebase en wordt
drift-bestendig bewaakt door `scripts/validate-blogs.sh` + `scripts/validate-docs.sh --deep`
(sitemap↔feed↔posts-sync) en de `seo-auditor`-agent (oordeels-laag). Dit document bevat het werk dat
**buiten de repo** gebeurt — handmatig, met accounts waar alleen jij bij kunt. Code beweegt de
grootste rankingfactor (autoriteit/backlinks) niet; dat doe jij hier.

**Huidige stand:** 14 blogposts, 26 sitemap-URL's. Oudste post 8 nov 2025, nieuwste
(Metasploit) 22 jul 2026.

---

## 1. Eenmalig na (her)deploy — ~30 min

### Google Search Console (geverifieerd via DNS)
- [ ] Sitemap opnieuw indienen: GSC → Sitemaps → `https://hacksimulator.nl/sitemap.xml`
      (de `<lastmod>`-datums zijn 28 jul rechtgetrokken naar de echte git-wijzigingsdatums —
      resubmit triggert herbezoek van de bijgewerkte pagina's).
- [ ] URL-inspectie + "Indexering aanvragen" voor de nieuwste/gewijzigde pagina's:
  - `https://hacksimulator.nl/blog/metasploit-beginnersgids.html`
  - `https://hacksimulator.nl/terminal.html` (FAQ-schema)
  - Elke nieuwe post die je sindsdien publiceert.

### Bing Webmaster Tools (~10 min, eenmalig)
- [ ] https://www.bing.com/webmasters → **"Import from Google Search Console"** (neemt site + sitemap over).
- [ ] Waarom: Bing voedt ook DuckDuckGo en Ecosia — samen ~5-10% van NL-zoekverkeer, vrijwel gratis erbij.

### Validatie van de rich results (~15 min)
- [ ] **Rich Results Test** (https://search.google.com/test/rich-results):
      `terminal.html` → FAQPage (4 vragen); een blogpost → Article + BreadcrumbList.
- [ ] **Facebook Sharing Debugger** (https://developers.facebook.com/tools/debug/): homepage + 1 post,
      "Scrape Again" zodat de OG-tags opnieuw gecachet worden.
- [ ] **Twitter/X Card Validator**: 1 post — sinds 28 jul hebben álle posts expliciete
      `twitter:title` + `twitter:description` (spiegelen og), dus de preview toont nu de juiste tekst
      i.p.v. een og-fallback.
- [ ] 404-test: bezoek `https://hacksimulator.nl/bestaat-niet` → branded 404.

---

## 2. Backlinks — de grootste ontbrekende rankingfactor

On-page is af; autoriteit niet. Backlinks vanaf relevante NL-sites zijn de #1 hefboom. Werk de
lijst af in volgorde van verwachte impact; vink af en noteer de datum + resultaat.

| Doel | Kanaal / hoe | Angle | Status |
|---|---|---|---|
| **Tweakers.net** | Forum (Nettech/Security) of .plan | Gratis NL-terminal om ethisch hacken te oefenen — technisch publiek | [ ] |
| **Security.NL** | Nieuws-tip insturen (redactie) | "Gratis Nederlandstalig leerplatform voor ethisch hacken" | [ ] |
| **Reddit r/thenetherlands** | Showcase-vrijdag | NL-hoek, geen harde promo | [ ] |
| **Reddit r/cybersecurity / r/netsec** | Post (Engels) | "Dutch-language learning platform" — nicheangle | [ ] |
| **Hacker News** | Show HN | "Show HN: Browser-based terminal for learning ethical hacking (Dutch)" | [ ] |
| **LinkedIn** | Persoonlijke post + NL cybersecurity-groepen | Verhaal achter het project; nuchter, geen hype | [ ] |
| **NL-onderwijs (ROC/HBO)** | Docenten cybersecurity mailen | Gratis NL-lesmateriaal — `woordenlijst.html` + terminal als oefenomgeving | [ ] |
| **Woordenlijst als naslag** | In posts/comments actief noemen | `/woordenlijst.html` is linkbaar als referentie (HaveIBeenPwned-achtige naslag-hoek) | [ ] |

**Toon:** nuchter en eerlijk, geen LinkedIn-theater — liever weglaten dan opkloppen. Elke plaatsing
= één natuurlijke link, niet spammen.

---

## 3. Meetlus — elke ~2 weken (GSC)

Zonder meten is elke SEO-actie een gok. Vaste ronde:

- [ ] **GSC → Prestaties**: welke zoektermen krijgen impressies? Noteer pagina's met **veel impressies
      + lage CTR** → title/`meta description` daar bijsturen (dat is de goedkoopste CTR-winst).
      Let op: title-bijstelling raakt de **titel-lockstep op 7 plekken** (zie `blog-post` skill) —
      beweeg ze samen, niet alleen de `<h1>`.
- [ ] **GSC → Indexering**: raken alle 26 sitemap-URL's geïndexeerd? Niet-geïndexeerde pagina's
      inspecteren (reden + "Indexering aanvragen").
- [ ] **Positie-drift**: posts die van pagina 2 naar pagina 1 kruipen (of terugzakken) → daar loont
      een interne-link-boost of een contentupdate.

**Titel-lengtes om in de gaten te houden** (soft — SERP kapt ~60 tekens af; bijsturen alléén als GSC
lage CTR toont, niet blind): homepage (74), terminal (74), commands (67), woordenlijst (68),
hashcat-post (75), wireshark-post (79), metasploit-post (73), cybersecurity-tools-post (66).
De `seo-auditor`-agent print deze lijst opnieuw op verzoek.

---

## 4. Content-cadans — ~1 nieuwe post per 2 weken

Nieuwe long-form posts = nieuwe indexeerbare pagina's + interne-link-ankers. Gebruik de `blog-post`
skill (bewaakt de lockstep + de 4 afgeleide admin-items). Kandidaten met zoekvolume en nog géén dekking:

- [ ] **Hydra** (login brute-forcing) — sluit aan op de security-tools-reeks.
- [ ] **`grep` / `find`** tutorial — hoog zoekvolume, past bij `terminal-basics` + `linux-bestandssysteem`.
- [ ] **Netcat** — "Swiss army knife", natuurlijke recon→exploitation-brug vanaf de nmap-post.

Bij elke nieuwe post: link 'm meteen vanaf de posts die 'm natuurlijk noemen (interne-link-winst
is direct), en draai de `seo-auditor` op link-kansen/orphans.

---

## 5. GEO/AEO — vindbaarheid in AI-zoekmachines (ChatGPT, Perplexity, AI Overviews)

**Al in de repo geregeld (31 jul 2026):** `llms.txt` (site-overzicht voor LLM's, alle 20 URL's
geverifieerd), expliciete AI-crawler-stanzas in `robots.txt` (GPTBot, OAI-SearchBot, ClaudeBot,
PerplexityBot, Google-Extended e.a. — alles open behalve interne dirs), FAQPage-schema op
`index.html` (8 zichtbare Q&A's), WebApplication-schema op `terminal.html`, DefinedTermSet
compleet op `woordenlijst.html` (56/56 termen, lockstep bewaakt door `validate-docs.sh --deep`),
HowTo-schema op de wireshark- en metasploit-gids.

**Hoe AI-zoekmachines bronnen kiezen (stand juli 2026):** Google AI Overviews citeert in ~97%
uit de organische top-20 — klassieke SEO (secties 1-4 hierboven) blijft dus het fundament.
ChatGPT-retrieval draait op **Bing**; Perplexity weegt **freshness** het zwaarst (~40%) en leunt
sterk op Reddit; Claude citeert gestructureerde pagina's (lijsten, Q&A) aantoonbaar vaker.

**Acties voor Heisenberg:**

- [ ] **Bing Webmaster Tools** — als sectie 1 nog niet gedaan is: nu doen. Dit is voor
  ChatGPT-vindbaarheid belangrijker dan Google. Sitemap opnieuw indienen na deze deploy.
- [ ] **Herindexering aanvragen** na deploy: GSC URL-inspectie op `index.html`,
  `woordenlijst.html`, de wireshark- en metasploit-gids; zelfde in Bing.
- [ ] **Freshness-cadans**: de bestaande ~1 post/2 weken (sectie 4) is precies wat Perplexity
  beloont. Bij een inhoudelijke update van een bestaande post: `dateModified` in de JSON-LD
  en sitemap-`lastmod` mee laten bewegen (gebeurt al via de bestaande scripts).
- [ ] **Externe vermeldingen** — AI-modellen citeren wat elders genoemd wordt. Nuchter en
  eerlijk (geen spam, geen hype): een post op r/cybersecurity_nl / Tweakers-forum /
  security.nl waar het écht past ("gratis NL-oefenterminal voor beginners"), en de
  bestaande backlink-acties uit sectie 2. Wikipedia-NL alleen als er ooit een natuurlijke
  plek is (bijv. externe-links-sectie "ethisch hacken") — niet forceren.
- [ ] **Controle na ~1 maand**: vraag ChatGPT/Perplexity/Claude zelf "hoe kan ik veilig
  ethisch hacken leren in het Nederlands?" en kijk of HackSimulator genoemd/geciteerd wordt.
  GSC → Verschijning → "AI-overzichten" (indien beschikbaar) voor Google-kant.

---

## Referentie — on-page status (in de repo)

Canonicals compleet (incl. terminal + legal); **Twitter cards site-breed mét expliciete
title/description** (28 jul); og:image-dimensies overal; FAQPage-schema op `terminal.html`;
BreadcrumbList op alle posts; author-bylines + Person-schema; branded `404.html`; RSS-feed actueel +
zichtbaar gelinkt; **sitemap 26 URL's met git-accurate `lastmod`** (28 jul rechtgetrokken).
Bewaakt door `validate-blogs.sh` (Check 1-6), `validate-docs.sh --deep` (Check 9) en de
`seo-auditor`-agent.
