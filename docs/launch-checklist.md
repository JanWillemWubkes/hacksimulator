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

## Blok 1 — Deze week (~20 min)
- [ ] Zet wo 29 jul **13:00–18:00** in je agenda (post-en-reageer-blok).
- [ ] Kopieer de 3 launch-visuals uit `.playwright-mcp/launch/` (GIF + desktop-PNG + mobiel-PNG) naar een veilige map — die map is gitignored.
- [ ] (Optioneel) GA4: `tutorial_completed` afgeleid event aanmaken + ster. Key-events `terminal_activated`/`newsletter_signup`/`lead_magnet_signup` staan al goed.

## Blok 2 — Dinsdagavond 28 jul (D-1, ~30 min)
- [ ] Google: zoek `site:hacksimulator.nl` → noteer aantal geïndexeerde pagina's (**nulmeting** voor de voor/na-vergelijking).
- [ ] Google Search Console: dien `sitemap.xml` opnieuw in.
- [ ] GSC → URL-inspectie → **indexering aanvragen** voor: homepage, `/blog/`, en de nieuwe post `/blog/metasploit-beginnersgids.html`.
- [ ] (Optioneel, 5 min) Bing Webmaster Tools: sitemap indienen.
- [ ] GA4 DebugView openen + zelf de funnel één keer doorlopen (homepage → klik "start terminal"-knop → typ een command → doe een tutorialstap) → bevestig dat elk event binnenkomt. Stappen: `launch-success-metrics.md` §4.
- [ ] Test alle links in de aankondigingsteksten (terminal, homepage, 1 blogpost).

## Blok 3 — Launch-dag wo 29 jul (teksten: `launch-announcement-kit.md` §2)
- [ ] **Vóór de eerste post:** GA4-annotatie zetten (Beheer → Annotaties) op het launch-moment.
- [ ] **13:00** EHGN Discord — variant B ingekort (NL).
- [ ] **13:30** Reddit (project-/feedbackthread; lees eerst de sidebar-regels).
- [ ] **15:00** Hacker News "Show HN" (Engels, kaal-feitelijk) — **belangrijkste slot: blijf t/m ~18:00 actief reageren**.
- [ ] **17:00** LinkedIn — variant C.
- [ ] **vanaf 18:00** X / Mastodon / Bluesky — variant A + GIF.
- [ ] Reageer zo snel mogelijk op elke reactie. Kanaal dat je niet kunt bewaken → niet posten.
- [ ] Einde dag: check in GA4 de 3 minimum-doelen (`launch-success-metrics.md` §3): ≥1 aanmelding van een vreemde, ≥1 voltooide tutorial van een nieuwe bezoeker, klikken vanaf ≥2 plekken op de pagina.

## Na de launch — dag 2 t/m 14
- [ ] Dag 2-3: lees de conversie-percentages af (`launch-success-metrics.md` §2) → de **laagste funnel-stap = je volgende werk**. Dit voedt de value-prop/retentie-keuze (TASKS.md item #45), nu met echte data i.p.v. een gok.
- [ ] Na 1-2 weken: `site:hacksimulator.nl` + GSC Coverage opnieuw meten vs. de nulmeting; noteer welk kanaal verkeer/aanmeldingen bracht.

---

*Opgesteld Sessie 199 (22 jul 2026). Losse detail-docs blijven leidend voor de exacte teksten/config; deze checklist is het overzicht + de volgorde.*
