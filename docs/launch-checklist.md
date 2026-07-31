# Launch-checklist — HackSimulator.nl (jouw to-do)

**Dit is je enige stappenlijst voor de publieke launch.** Alle handelingen hieronder zijn handmatig (door Heisenberg). Het bouwwerk is klaar en live; wat rest is uitvoering.

- **Doel-launchdag:** woensdag **29 juli 2026**, bewaakbaar blok **13:00–18:00 CET**.
- **Besluit 22 jul 2026:** demand-validatie (5-10 testsessies) is **bewust overgeslagen** — de launch-data zelf wordt het signaal. Zie TASKS.md item #44.
- **Al gedaan (22 jul):** verse blogpost *Metasploit voor Beginners* live + cornerstone-cross-links; funnel-events live + geverifieerd; GA4 key-events gemarkeerd; launch-visuals gegenereerd.

Detail-docs waar deze checklist naar verwijst:
- Aankondigingsteksten + kanalen + dagschema → `docs/launch-announcement-kit.md`
- GA4-config + wat te meten → `docs/launch-success-metrics.md`
- SEO/indexering-achtergrond → `docs/public-launch-runbook.md`

---

## Stand — 29 juli 2026 (launch-dag, bijgewerkt ~19:00)

**Launch is begonnen.** Vandaag gedaan (laag-drempel, hoog-match kanalen):
- ✅ **D-1-prep compleet** — `site:`-nulmeting genoteerd, indexering aangevraagd voor de Metasploit-post (homepage + `/blog/` waren al geïndexeerd → bewust niet opnieuw aangevraagd), GA4 DebugView eerder bevestigd, alle bestemmings-links 200. Sitemap opnieuw indienen bewust overgeslagen (niet essentieel; sitemap bereikbaar op 200).
- ✅ **GA4 launch-annotatie** gezet op de juiste property (Metings-ID `G-7F792VS6CE` geverifieerd; streamnaam "Netlify Staging" = cosmetisch overblijfsel, data landt correct).
- ✅ **EHGN Discord — intro** geplaatst (`#voorstellen`). Projectpost bewust uitgesteld tot een bewaakbaar blok.
- ✅ **LinkedIn** — variant C + statische desktop-PNG (GIF rendert slecht op LinkedIn) geplaatst.
- ⏭️ **X / Mastodon / Bluesky** — **N.v.t.** (geen accounts). Niet posten.

**Morgen oppakken — het reactie-gevoelige blok (samen doen wanneer je ~1 aaneengesloten uur kunt bewaken):**
- [ ] **EHGN Discord — projectpost** (variant B ingekort, NL, + GIF `~/hacksimulator-launch-visuals/terminal-help-nmap.gif`) in het projectkanaal (`#projecten`/`#showcase`/`#zelfpromotie`).
- [ ] **Hacker News — Show HN** (feedback-play, geen wervingskanaal voor een NL-product; HN-links zijn `nofollow`). Titel + eerste-comment-tekst staan klaar in het gesprek/announcement-kit. Valkuil: URL-veld invullen → text-veld leeg → beschrijving als eerste comment. Blijf het eerste uur actief reageren.
- [ ] **r/SideProject** (enige realistische Reddit-optie: account `WoLLom18` heeft 7 jaar leeftijd maar 1 karma → strengere subs (r/thenetherlands, r/cybersecurity) blokkeren/filteren; die eerst opbouwen). Engelse titel + body staan klaar. Lees de sidebar vlak vóór posten.
- [ ] **Meet-tip:** kijk je GA4-funnel **gesegmenteerd op land** (NL/BE apart) zodat HN/Reddit-bounce je echte doelgroep-activation niet vertroebelt.

**Launch-visuals** staan klaar in `~/hacksimulator-launch-visuals/` (GIF + desktop-PNG + mobiel-PNG).

---

## Blok 1 — Deze week (~20 min)
- [ ] Zet wo 29 jul **13:00–18:00** in je agenda (post-en-reageer-blok).
- [ ] Kopieer de 3 launch-visuals uit `.playwright-mcp/launch/` (GIF + desktop-PNG + mobiel-PNG) naar een veilige map — die map is gitignored.
- [ ] (Optioneel) GA4: `tutorial_completed` afgeleid event aanmaken + ster. Key-events `terminal_activated`/`newsletter_signup`/`lead_magnet_signup` staan al goed.

## Blok 2 — D-1 (uitgevoerd op launch-dag 29 jul zelf, ~ochtend/middag)
- [x] Google: zoek `site:hacksimulator.nl` → nulmeting genoteerd (getal + datum bij Heisenberg).
- [~] Google Search Console: sitemap opnieuw indienen — **bewust overgeslagen** (niet essentieel; sitemap bereikbaar op 200, Google recrawlt vanzelf).
- [x] GSC → URL-inspectie → indexering aangevraagd voor `/blog/metasploit-beginnersgids.html`. Homepage + `/blog/` waren al geïndexeerd → niet opnieuw aangevraagd (dubbele aanvraag = geen effect).
- [ ] (Optioneel) Bing Webmaster Tools: sitemap indienen — nog niet gedaan, lage prioriteit.
- [x] GA4 DebugView-funnelcheck — eerder bevestigd (events landen in property `G-7F792VS6CE`).
- [x] Links getest — homepage/terminal/`/blog/`/metasploit-post/sitemap alle 200.

## Blok 3 — Launch-dag wo 29 jul (teksten: `launch-announcement-kit.md` §2)
- [x] **Vóór de eerste post:** GA4-annotatie "Publieke launch" gezet (29 jul).
- [x] **EHGN Discord — intro** geplaatst in `#voorstellen` (nog geen lid → eerst voorgesteld). Projectpost volgt in het monitoring-blok.
- [x] **LinkedIn** — variant C + desktop-PNG geplaatst.
- [ ] **Hacker News "Show HN"** (Engels, kaal) — morgen, in een bewaakbaar uur. Feedback-play (NL-product op EN-platform; `nofollow`-links). Titel/eerste-comment staan klaar.
- [ ] **EHGN Discord — projectpost** (variant B + GIF) — morgen, in het monitoring-blok.
- [ ] **r/SideProject** — morgen, in het monitoring-blok (account 1 karma → alleen deze sub realistisch).
- [~] **X / Mastodon / Bluesky** — **N.v.t.**, geen accounts → niet posten.
- [ ] Reageer zo snel mogelijk op elke reactie. Kanaal dat je niet kunt bewaken → niet posten.
- [ ] Einde launch-fase: check in GA4 de 3 minimum-doelen (`launch-success-metrics.md` §3): ≥1 aanmelding van een vreemde, ≥1 voltooide tutorial van een nieuwe bezoeker, klikken vanaf ≥2 plekken op de pagina. **Segmenteer op land (NL/BE)** voor de echte doelgroep-conversie.

## Na de launch — dag 2 t/m 14
- [ ] Dag 2-3: lees de conversie-percentages af (`launch-success-metrics.md` §2) → de **laagste funnel-stap = je volgende werk**. Dit voedt de value-prop/retentie-keuze (TASKS.md item #45), nu met echte data i.p.v. een gok.
- [ ] Na 1-2 weken: `site:hacksimulator.nl` + GSC Coverage opnieuw meten vs. de nulmeting; noteer welk kanaal verkeer/aanmeldingen bracht.

---

*Opgesteld Sessie 199 (22 jul 2026). Losse detail-docs blijven leidend voor de exacte teksten/config; deze checklist is het overzicht + de volgorde.*
