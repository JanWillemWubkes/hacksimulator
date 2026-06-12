# SEO Launch Checklist — Acties voor Heisenberg

**Aangemaakt:** 12 juni 2026 (Sessie 160 — SEO launch-perfectie)
**Context:** Marketing-launch over ~6 dagen. Alle on-page/technische SEO-fixes zitten in de codebase
(zie commit-historie branch `claude/exciting-rubin-0p9r8t`). Dit document bevat de acties die
**buiten de repo** moeten gebeuren — handmatig, met accounts waar alleen jij bij kunt.

---

## 1. Direct na deploy (dag 1) — ~30 min

### Google Search Console (al geverifieerd via DNS)
- [ ] Sitemap opnieuw indienen: GSC → Sitemaps → `https://hacksimulator.nl/sitemap.xml`
      (er staan 2 nieuwe blogposts + bijgewerkte lastmod-datums in)
- [ ] URL-inspectie + "Indexering aanvragen" voor:
  - `https://hacksimulator.nl/blog/wireshark-beginnersgids.html`
  - `https://hacksimulator.nl/blog/hashcat-wachtwoorden-kraken.html`
  - `https://hacksimulator.nl/terminal.html` (nieuwe title/description/FAQ-schema)

### Bing Webmaster Tools (nog niet ingericht — ~10 min)
- [ ] Ga naar https://www.bing.com/webmasters
- [ ] Kies **"Import from Google Search Console"** — neemt site + sitemap automatisch over
- [ ] Waarom: Bing voedt ook DuckDuckGo en Ecosia; samen ~5-10% van NL-zoekverkeer, vrijwel gratis erbij

## 2. Validatie na deploy (dag 1-2) — ~20 min

- [ ] **Rich Results Test** (https://search.google.com/test/rich-results) op:
  - `terminal.html` → moet FAQPage tonen (4 vragen)
  - een blogpost → moet Article + BreadcrumbList tonen
- [ ] **Facebook Sharing Debugger** (https://developers.facebook.com/tools/debug/):
      plak homepage + 1 blogpost URL, klik "Scrape Again" zodat de nieuwe og-tags gecachet worden
- [ ] **Twitter/X Card Validator**: deel-preview checken van 1 blogpost (alle posts hebben nu
      `summary_large_image` cards)
- [ ] Test de 404-pagina: bezoek `https://hacksimulator.nl/bestaat-niet` → moet de nieuwe
      branded 404 tonen (niet de kale Netlify-default)

## 3. Launch-dag promotie (backlinks = grootste ontbrekende rankingfactor)

Suggesties, in volgorde van verwachte impact voor NL-publiek:
- [ ] **Tweakers.net** — forum-post of .plan; technisch NL-publiek, sterke backlink
- [ ] **Security.NL** — nieuws-tip insturen over gratis NL leerplatform
- [ ] **Reddit** — r/thenetherlands (showcase-vrijdag), r/cybersecurity, r/netsec (Engels: focus op
      "Dutch-language learning platform" angle)
- [ ] **LinkedIn** — persoonlijke post + relevante NL cybersecurity-groepen
- [ ] **Hacker News** — "Show HN: Browser-based terminal for learning ethical hacking (Dutch)"
- [ ] **NL-onderwijs**: ROC's/HBO's met cybersecurity-opleidingen mailen (docenten zoeken gratis NL lesmateriaal)

## 4. Eerste 2 weken na launch

- [ ] GSC → Prestaties: check welke zoektermen impressies krijgen; titels/descriptions bijsturen
      op pagina's met veel impressies maar lage CTR
- [ ] GSC → Indexering: check of alle 25 sitemap-URL's geïndexeerd raken
- [ ] HaveIBeenPwned-achtige linkbuilding-kansen: woordenlijst (`/woordenlijst.html`) is linkbaar
      als naslagwerk — vermeld hem actief in posts/comments
- [ ] Overweeg 1 nieuwe blogpost per 2 weken (volgende kandidaten met zoekvolume en nog géén dekking:
      Metasploit, Hydra, `grep`/`find` tutorial, Netcat)

---

**On-page status (in de repo, ter referentie):** canonicals compleet incl. terminal + legal pages,
twitter cards site-breed, og:image-dimensies overal, FAQPage-schema op terminal.html, BreadcrumbList
op alle pagina's, author-bylines + Person-schema op alle 13 posts, 404.html, RSS-feed actueel +
zichtbaar gelinkt, sitemap 25 URL's.
