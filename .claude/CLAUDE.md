# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 208)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 14 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125; +2 posts Sessie 160)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E ~240 tests / 29 spec files (Chromium, Firefox, WebKit) | WCAG AAA | 182+27 CSS variables (main.css + landing.css)
**Bundle:** Runtime <400 KB (strikt, terminal.html) + SEO/content-pijler budgetloos (blog + assets). Site-totaal en exacte KB-breakdown wisselen per sessie — zie TASKS.md §Huidige Focus voor ground truth.
**Monetization stack:** Ko-fi + Brevo newsletter (double opt-in + welkomstmail + deliverability getuned) + Gumroad v1.0 (3 guides + bundel) + Lead magnet (Sample Pentest). Eigen consent banner (2 knoppen) met Consent Mode v2. **Geen advertenties** — AdSense verwijderd in Sessie 208 op gemeten kosten/baten. **Per-stack actuele status:** TASKS.md §M5.5 sectie-body.

→ **Live metrics (bundle, tests, sessie-counter):** `TASKS.md` §Huidige Focus + Voortgang Overzicht — single source of truth
→ **Architecture & document-ownership:** `PLANNING.md` v3.0 §Document Ownership | **Commands:** `docs/commands-list.md` (41 commands)

---

## Kritieke "Niet Doen"

→ **Framework & Tech Red Lines:** PRD §13 (Vanilla JS/CSS, <500KB bundle, no backend MVP, Dutch UI, 80/20 output, no arg logging)

---

## Command Output Principe: "80/20 Realisme"

→ **Formule:** Output (EN) + Inline context (← NL) + Tip (NL) + Warning (NL)
→ **Voorbeeld & Philosophy:** PRD §9.2

**Quick:** `nmap 192.168.1.1` → `22/tcp OPEN SSH ← Secure Shell` + `[TIP] Open poorten = attack vectors`

---

## Taal Strategie

→ **Matrix:** UI=NL | Commands=EN | Errors=EN+NL | Help=NL
→ **Rationale:** PRD §6.6 (trust, authenticity, accessibility)

---

## Educational Patterns

→ **3-Tier:** Error=Learning → Progressive hints → Man pages | Security tools=Consent+Warning
→ **Full pedagogy:** PRD §8.3

---

## Tone of Voice

**Principles:**
- **"je" (niet "u"):** Toegankelijk, persoonlijk (niet afstandelijk formeel)
- **Bemoedigend:** "Goed bezig!", "Bijna!", niet "Fout." of "Wrong."
- **Context geven:** Leg "waarom" uit, niet alleen "wat"
- **Symbols:** ASCII brackets only (`[TIP]`, `[!]`, `[✓]`) — terminal aesthetic, NO emojis in code

→ **Voorbeelden (good/bad pairs):** `.claude/rules/tone-and-output.md`

---

## Command Implementation Checklist

Bij nieuwe command: 80/20 output | Educatieve feedback | Help/man (NL) | Warning (offensive) | Mobile (≤40 chars)

→ **Volledige 8-stappen checklist:** `.claude/rules/command-checklist.md`
→ **Command specs:** `docs/commands-list.md`

---

## Architectural Patterns

→ **Top patterns met code:** `.claude/rules/architecture-patterns.md`
→ **All 40+ patterns indexed:** docs/sessions/current.md

---

## Recent Critical Learnings

### Sessie 208: Advertenties eruit, kwaliteit aantoonbaar, blog meetbaar (03 aug 2026)
⚠️ **Never:**
- Een verwijdering "geverifieerd" noemen op basis van een nulmeting achteraf — "0 advertentieverzoeken" is óók waar op een kapotte meting. Pas de vergelijking mét de oude code bewees het: `git archive HEAD` naar `/tmp` + een tweede no-store server op een andere poort gaf **2 advertentieverzoeken + 3 units vóór, 0/0 ná**. Twee servers naast elkaar is de goedkoopste rood-op-mutant die er is bij een verwijdering.
- Een consent-model versimpelen door het opgeslagen dataformaat te wijzigen. Het JSON-formaat `{necessary, analytics, advertising}` ongewijzigd laten en alleen `advertising` niet meer schrijven, betekent dat élke bestaande bezoeker zijn keuze houdt en de banner niet opnieuw ziet. Vier scenario's live getest (vers / oude `advertising:true` / legacy-string `"true"` / geweigerd) — zonder die test was "geen migratie nodig" een aanname geweest.
- Aannemen dat gelijkvormige pagina's ook gelijk geconfigureerd zijn. `commands/index.html` bleek als enige een **inline** Consent Mode-script te dragen; de CSP heeft geen `'unsafe-inline'`, dus dat script draaide daar nooit en die pagina had structureel geen consent-defaults. Gevonden omdat de opruiming langs élke pagina ging, niet omdat iets erop wees.
- Een nieuwe kaart bouwen met een hardgecodeerde `rgba(22,27,34,.3)` omdat de buurkaart dat ook doet — de buurkaart heeft een `[data-theme="light"]`-override 500 regels verderop. Zonder die override werd de verantwoordingskaart grijs op wit (Sessie 44-valkuil, opnieuw). Kopieer de override mee, niet alleen de basisregel.
- De RSS-titel als "één van de zeven lockstep-locaties" beschouwen: hij was het niet, en daardoor stonden **14 van de 14** feed-titels nog in Engelse Title Case sinds de sitebrede omzetting. Een lockstep die je niet valideert is geen lockstep.
- De `<h1>` als bron nemen voor de RSS-titel. Bij `wat-is-ethisch-hacken` is de `<h1>` bewust korter dan de `<title>`; syncen op `<h1>` had de SEO-titel stilletjes ingekort. Eerst kijken wélke van de zeven locaties de juiste bron is.

✅ **Always:**
- Verwijder een kanaal op **gemeten kosten tegen gemeten baten**, niet op gevoel: €0 opbrengst tegen 251,7 KB third-party en 73% van de blokkeertijd, plus een eigen analyse uit maart 2026 die het al niet-lonend noemde. Het argument stond al in de repo; het was alleen nooit uitgevoerd.
- Laat een nieuwe drift-check zijn eigen aanname bewijzen. Mijn eerste versie van Check 6d zocht de scenario-imports in `tutorial-manager.js` — de check faalde en had gelijk: ze staan in `core/terminal.js`. Een check die meteen groen is, heb je niet getest.
- Genereer een reviewpakket **uit de bron** in plaats van het over te tikken: geen achtste plek die kan driften, en een tweede ronde kost één commando. Filter op "controleerbare bewering" (getallen met eenheid, CVE's, poorten, wetsartikelen) mét een code-filter, anders krijg je JavaScript in je vragenlijst.
- Vul een verificatiedatum in met de **échte** datum. 13 posts kregen 14 jun 2026 (de laatste feitencontrole), de metasploit-post 3 aug omdat die daarna geschreven is en nu is nagelopen. Vandaag invullen voor alles zou de hele regel waardeloos maken.
- Los een geloofwaardigheidsspanning op bij de bron, niet met een uitleg elders: "CERTIFICAAT VAN MEESTERSCHAP" naast een FAQ die zegt dat er geen certificaat is, wordt opgelost met één gedeelde `CERT_DISCLAIMER` in beide generatoren — inclusief de mobiele variant en gewordwrapt, want de box kan tot 30 tekens smal worden.
- Wees expliciet over het plafond: bronvermelding, controledata en automatische gates maken kwaliteit **aantoonbaar en bewaakbaar**, niet **gegarandeerd**. Alleen een mens met vakkennis kan bewijzen dát de inhoud klopt; al het andere bestaat om die stap klein te maken.

### Sessie 207: Audit oude follow-up-lijstjes → gesnoeid op bezoekerswaarde (02 aug 2026)
⚠️ **Never:**
- "De infrastructuur staat er al" gebruiken als reden om een feature te bouwen — `getPhaseStats().percentage` (`leerpad.js:25`) is berekend en nooit gerenderd, wat verleidt tot "even gebruiken". Maar de bezoeker ziet fase-voortgang al in `leerpad` (`[✓] FASE 2 (3/8)` + vinkjes per command) én in `dashboard` ("Volgende: Fase 2 voltooien (3/8)"). Een derde weergave is ruis. **Dode code is geen opdracht.**
- Een gemeld "gat" aannemen zonder de trigger-frequentie te checken — ik dacht dat fase-viering pull-based was en dus gemist werd, tot bleek dat `next` ná élk nieuw geleerd command wordt aangeboden (`onboarding.js:311`, `:451-460`, `renderer.js:374`). Eén grep bespaarde 4 overbodige badges bovenop de 22 bestaande.
- Een defect dat je zélf tijdens onderzoek vindt parkeren als "meenemen of laten liggen — beide verdedigbaar". Dat is dezelfde hedge als een option-tree: het schuift een technisch oordeel terug naar Heisenberg. Zijn reactie was direct ("vergeet niet de bug mee te nemen"). Nul zichtbare impact ≠ geen bug — beoordeel op toekomstig risico ([[feedback_expert_decisions]]).
- Bij een no-op-fix vertrouwen op "screenshots vóór/ná zijn identiek" — dat is óók waar als je niets deed. Alleen de mutant bewijst iets: `--color-border` op rood → navbar/footer wérden rood vóór de fix, en niet meer erná.
- Alleen de foute cellen fixen in een tabel waarvan élke waarde gedrift is — dat levert een half-ware tabel op die er *geverifieerd* uitziet. Erger dan zowel niets doen als volledig herschrijven.
- Een og:image @2x renderen als de post `og:image:width/height` 1200/630 draagt — dan liegen die tags. Het cover-script doet wél @2x, maar dat dient een ander doel (merchant listings).

✅ **Always:**
- Snoei ideeënlijstjes op **wat de bezoeker merkt**, niet op wat af is — van 11 items bleken er 4 klaar, 4 waardeloos en 3 de moeite waard, en 2 van die 3 stonden niet eens op de lijst. Leg verworpen items **mét reden** vast (TASKS.md #52), anders duiken ze over vijf sessies opnieuw op als "openstaand".
- Bouw een versheids-assert ín de meting — mijn W4-na-meting las de CSSOM-regel uit en zag `var(--color-border)` + de nog-bestaande light-override staan: hard bewijs dat de browser oude CSS serveerde. Zonder die assert had ik "no-op bevestigd" gerapporteerd terwijl er niets geladen was.
- Gebruik een **echte no-store server** i.p.v. steeds slimmere cache-busters — `import('…tutorial.js?cb=…')` faalde met "does not provide an export named 'downloadCertificate'" omdat `?cb=` de relatief geïmporteerde `certificate.js` niet bust. Vierde sessie op rij (202/205/206/207); sinds Sessie 208 staat hij als `scripts/nostore-server.py` in de repo i.p.v. per sessie opnieuw in een gitignored scratchpad.
- Laat een generator uit het artefact lezen i.p.v. uit een kopie — `build-blog-og-images.mjs` haalt titel (`<h1>`) en categorie (`og:article:section`) uit de post zelf, dus er ontstaat géén 8e lockstep-locatie naast de bestaande 7.
- Nieuwe copy in de lengteband van de bestaande varianten brengen — mijn eerste FASE 4-transitie had skills van 44-57 tekens waar de bestaande 21-37 zijn, en een bridge van 146 tegen ~50. Meten tegen de siblings, niet tegen een absolute limiet.
- Wees eerlijk over het plafond van een win: og:image is de enige externe-impact-win, maar Google gebruikt het níét in zoekresultaten. De waarde zit in gedeelde links + het feit dat elke volgende post zijn kaart nu gratis erft.

### Sessie 206: Nieuwsbrief-mails mobiel — code-chip-overlap + witte tekst op groen (01 aug 2026)
⚠️ **Never:**
- Eén klasse geven aan blok-code (`<td>`) en inline code (`<code>`) — verticale padding vergroot bij een *inline* element de regelhoogte niet, alleen het gekleurde vlak. De mobiele blok-regel (`padding:12px 14px`) maakte de chip **38px hoog in een 24px regelbox** = 17px overlap met de buurregels (gemeten @375px). Splits `.code-block`/`.code-inline`; `welkomstmail.html` deed dit al goed, juli en april waren erop achtergebleven.
- Vertrouwen op `!important` of `@media (prefers-color-scheme: dark)` om kleuren in de Gmail-app te beschermen — die app ondersteunt de media query níét (het halve `<style>`-blok is er dood) en herschrijft kleuren ná je CSS. Alleen de inline styles tellen, en zelfs die worden gecorrigeerd als een tekstfragment geen eigen achtergrond heeft.
- Een gemeten afwijking meteen als bug behandelen — april's chip mat 41px in een 24px regel (leek dezelfde bug), maar `getClientRects()` gaf 2 fragmenten van 17px: hij wrapt over twee regels en `getBoundingClientRect()` geeft de union-box. Overlap 0. Fragmenten tellen vóór je fixt.
- Adviseren dat je een verzonden Brevo-campagne opnieuw kunt importeren — verzonden campagnes zijn vergrendeld; alléén links, alléén ≤24u, en uitschrijf-/variabele-links zelfs daarbuiten. De mirror-pagina is een momentopname van het verzendmoment. (Ik gaf dit eerst fout; opgezocht en de stap geschrapt.)

✅ **Always:**
- Meet de baseline op de ónveranderde file vóór je fixt — 38px/17px overlap vooraf maakte "17px/overlap 0" achteraf pas betekenisvol. Zonder baseline weet je niet of je meting de bugklasse überhaupt kán detecteren (rood-op-mutant, [[feedback_verify_claims_against_artifact]]).
- Cache-buster bij élke na-meting, ook bij een lokale `python3 -m http.server` — de eerste na-meting gaf identiek 38px omdat `td.code-block` niet eens in de DOM bestond. Derde sessie op rij (202/205/206) dat dit toeslaat.
- Documentatie-opruimen serieus nemen als bug-jacht: de "MailerLite-syntax in de docs"-nit bleek `{$unsubscribe}`/`{$url}` in twee **live** welkomstmails — Brevo vervangt die niet, dus dode links. Correcte vorm `{{ unsubscribe }}`/`{{ mirror }}` opgezocht in de Brevo-docs, niet uit het hoofd ([[feedback_validate_tooling_assumptions]]).
- Sluit de regressieketen, niet alleen het symptoom — `maandelijks-template.md` droeg je op het CSS-blok uit april te kopiëren, precies het bestand met de bug; zonder die pointer-fix erft elke volgende editie hem opnieuw.
- Wees expliciet over wat je níét kunt bewijzen — issue 2 was hard meetbaar, issue 1 draait op Heisenberg's telefoon. Als mitigatie benoemd mét plan B (donkere balk + groene tekst), niet als "gefixt" geclaimd.
- Archief-bestanden niet gladstrijken: april houdt de MailerLite-syntax (verstuurd vóór de migratie, Sessie 165) met een notitie dat het geen kopieermodel is. Historie corrigeren maakt een archief onbetrouwbaar.

### Sessie 205: Box-reflow bij venster-resize + submodule-cache-val (01 aug 2026)
⚠️ **Never:**
- Een submodule-fix verifiëren tegen een warme browser — `?v=` zit alléén op de entry-points (`main.js`/`main.css`); de ~99 relatief geïmporteerde modules dragen er géén, dus een entry-bump bust ze niet en `must-revalidate` grijpt pas ná `max-age`. Dit kostte 3 valse diagnoses (fix stond op schijf, browser draaide oud) én verklaarde waarom de Sessie 204-fixes terugkerende bezoekers nooit bereikten (gemeten: gecachete `box-utils` 41 chars vs server 62). Verifieer met een **no-store server** of `import('…?cb='+Date.now())`.
- Een `isMobileView()`-guard gebruiken om "desktop-only" gedrag af te bakenen — een half-gesnapt desktopvenster is 683/720px en valt ónder de 768-drempel, precies het gemelde scenario. Laat de datavorm de guard zijn (hier: de aanwezigheid van box-blokken; mobiel rendert borderless → parser vindt niets → no-op).
- Defensieve heuristiek toevoegen zonder te bewijzen dát je 'm nodig hebt — mijn layout-wijziging-detectie bleek bij gericht uittesten overbodig (de `resizing`-vlag volstond in Chromium/Firefox/WebKit) en is geschrapt. Simpelste versie die werkt + een test die de aanname bewaakt ≫ permanente defensieve code.
- `wordWrap()` op inhoud met inspringing loslaten — `split(' ')` eet leidende spaties, óók op part 0. Indent apart bewaren en elke part her-prefixen, zoals alle box-producers zelf al doen.

✅ **Always:**
- Reproduceer het gemelde scenario mét de oude code vóór je claimt dat je het oploste — het screenshot-scenario gaf 69 boxregels / 69 wraps op productie, en 0 wraps met de reflow. Daarmee was hard te beantwoorden dat dit géén dubbel werk was: Sessie 204 gaat over verse render, dit over reflow van bestaande output (disjunct). Bijvangst: de 204-fix maakte het symptoom zichtbaarder, want de oude Inter-mismeting maakte boxen ~35% te smal = toevallige speling.
- "Live geverifieerd" moet het hele afhankelijkheidsoppervlak dekken, niet alleen het gewijzigde artefact — Sessie 204 checkte het font (CSS-entry mét `?v=` = vers) maar niet de JS-modules (stale). Halve verificatie leest als volledige.
- Bij DOM-mutatie naast lopende animaties: muteer alleen child-regels, nooit de wrapper (`_revealCelebration` houdt referenties + opacity-state op `.terminal-completion-*`), en herstel scroll met `behavior:'instant'` — `animations.css` zet `scroll-behavior:smooth` op `#terminal-output`, wat elke `scrollTop`-toewijzing in een animatie van honderden ms verandert (vertroebelt ook je metingen).
- Een "by design"-verklaring is een productkeuze, geen technische — Sessie 204 verklaarde niet-reflowen tot echte-terminal-gedrag; verdedigbaar, maar in een browser-leeromgeving weegt leesbaarheid bij venstermanipulatie zwaarder. Zulke keuzes horen bij Heisenberg ([[feedback_expert_decisions]] geldt voor techniek, niet voor scope).

### Sessie 204: Box-omlijning brak op tussenbreedtes — corrupte box-font + meetfouten (31 jul 2026)
⚠️ **Never:**
- `document.fonts.check()` als bewijs dat een font laadt — geeft true óók bij `FontFace.status === 'error'` (gemeten); zo bleef de corrupte inline 'JetBrains Mono Box'-embed **120 sessies** (sinds Sessie 83) onzichtbaar terwijl alle box-glyphs via OS-fallbacks met afwijkende advances renderden. Assert `fonts.load(...)` + `status === 'loaded'`.
- `scrollWidth <= clientWidth` als overflow-assert op `#terminal-output` — `overflow-x:hidden` + `pre-wrap` laat te brede regels wrappen, nooit scrollen → de check kan structureel niet falen (vals-groen op precies deze bug-klasse).
- Rect-`top`-vergelijking of `rects.length` als visuele wrap-detector — inline spans (`marker-arrow` heeft `vertical-align:.2em` = 3.6px) verschuiven rects op één visuele regel → 11 gemeten vals-positieven. Element-hoogte > 1.5× line-height is immuun (echte wrap verdubbelt de hoogte); rood-op-mutant bewezen.
- Een meting "correct maken" vóór de bovenliggende bugs gefixt zijn — de Inter-op-container-mismeting *onderschatte* de kolomcapaciteit ~35% en redde brede desktops toevallig; eerst correct meten had de boxen juist óp de rand gezet. Fix-volgorde was bindend: font → breedte-contract → meting.

✅ **Always:**
- Font-embeds byte-diffen tegen het bronbestand — 2 corrupte b64-chars in 6936 maakten de hele woff2 onbruikbaar (brotli is niet fout-tolerant), maar `@font-face` faalt stíl naar een visueel bijna-identieke fallback; alleen de metriek verraadt het. Borderregels (één ononderbroken glyph-run zonder breekpunten) wrappen dan als eerste, per machine anders.
- Meet op het element waar de tekst écht rendert — `#terminal-container` erft `--font-body` (Inter); `#terminal-output` heeft `--font-terminal` én `clientWidth` exclusief de eigen scrollbar. Plus `charWidth = max(measureText('M'), '─', '━')`: canvas respecteert `@font-face` unicode-range, dus dit meet de echte subset-advance — die max had deze hele bug gevangen.
- Oude output die na venster-resize breekt = by-design (echte terminals reflowen ook niet; gereproduceerd: 68/68 wraps oud, 0/12 vers) — test-consequentie: na viewport-resize het command opnieuw uitvoeren, nooit oude output meten.
- Sessienummer-ambiguïteit (eerdere zelfde-dag-context labelde "Sessie 204" in TASKS.md maar rondde `/summary` nooit af): nummer overnemen + dat werk als committed context loggen, niet claimen (Sessie 200-protocol) en niet hernummeren.

### Sessie 203: GEO/AEO — vindbaarheid in AI-zoekmachines (31 jul 2026)
⚠️ **Never:**
- Nieuwe content plannen vóór je audit wat er ál zichtbaar staat zonder schema — de homepage had 8 zichtbare FAQ-vragen zónder FAQPage JSON-LD; die vondst maakte de geplande aparte FAQ-pagina overbodig (nav/footer JS-injected + noscript in ~24 files = 20× de kosten voor hetzelfde AEO-voordeel).
- Een AI-crawler-stanza in robots.txt met alléén `Allow: /` — een specifieke User-agent-groep erft níéts van de wildcard (RFC 9309), dus zonder herhaalde Disallows open je per ongeluk /docs/ voor die crawlers. Multi-UA-groep (12 agents, 1 gedeelde regelset) is compact én correct.
- HowTo-schema op niet-stapsgewijze content forceren — nmap/hashcat/sql-injection-lijsten zijn alternatieven/uitleg, geen stappen; alleen wireshark (5-staps) en metasploit (7-staps) hebben échte `<ol>`-workflows. Fake-HowTo schaadt de geloofwaardigheid van álle schema op de site.
- 56 JSON-LD-objecten met de hand overtikken — scriptmatig genereren uit de zichtbare markup (glossary-term-blokken parsen) = geen typo's + herhaalbaar bij term-wijzigingen ([[feedback_proportional_effort_hobby]]: script > handwerk zodra mechanisch-van-omvang).

✅ **Always:**
- Schema-bij-zichtbare-content verbatim + lockstep-bewaakt — FAQ-antwoorden letterlijk uit de zichtbare `<p>`'s (alleen tags gestript), en de nieuwe DefinedTerm-count-check in `validate-docs.sh --deep` (JSON-LD == zichtbare `<dt>`-count, rood-op-mutant bewezen vóór vertrouwen). Zelfde discipline als de blog-titel-7-locaties-lockstep.
- Eerlijk zijn over wat on-page GEO wél/niet doet — het maakt je *citeerbaar*, niet *gekozen*: AI Overviews citeert ~97% uit de organische top-20, Perplexity leunt op Reddit (~47%), ChatGPT-retrieval draait op Bing. De zwaarste hefboom (externe vermeldingen, Bing Webmaster) is een Heisenberg-actie en staat zo in checklist-§5, niet weggemoffeld achter de code-wins.
- "Zorg dat dit gebeurt" eindigt bij live-verificatie, niet bij de push — eerste curl gaf 404 (Netlify nog bezig); achtergrond-recheck na 90s bewees llms.txt 200 + nieuwe robots.txt op productie.
- llms.txt-URL's tegen het filesystem verifiëren vóór commit — elke link in het LLM-overzicht moet naar een bestaand bestand wijzen; 20/20 gecheckt met één grep-loop.

**Rotation:** Top-6 huidig: 203-204-205-206-207-208 (Sessie 202 → `docs/sessions/current.md` via 1-in-1-out). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie Sessie 205 UITGEVOERD:** current.md staart Sessie 190-194 geknipt naar `archive-s190-s194.md` (5 entries); current.md houdt nu het rolling window 195-206 (12 entries; volgende bulk-rotatie Sessie 210 → archiveer oudste ~5). SESSIONS.md-index gesynct. Historie 81-184 → `archive-s180-s184.md` + `archive-s175-s179.md` + `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

---

## Sessie Protocol

**Voor Sessie:** Lees `.claude/CLAUDE.md` (this file) + check sprint-regel + Volgende Stappen in `TASKS.md`
**Tijdens:** Markeer taken in `TASKS.md` direct | Architecturale beslissingen alleen in `PLANNING.md` bij echte arch-change
**Afsluiten:** Use `/summary` command → 6-step flow (zie hieronder)

### `/summary` flow — single source of truth = `TASKS.md`

1. **Ground truth meting** (~30 sec, read-only)
   - `du -sb src/ styles/ blog/ assets/` → bundle metrics
   - `find tests/e2e -name "*.spec.js" | wc -l` → test file count
   - `git log --oneline -1` → laatste commit voor sprint-regel

2. **Update `TASKS.md`** (primary execution-tracker)
   - Header: `Laatst bijgewerkt` datum + `Sprint` regel met huidige sessie
   - Footer: datum + version
   - Milestone-tabel: percentage update bij task completion
   - Bundle/test metrics: ground-truth getallen uit stap 1

3. **Update `docs/sessions/current.md`**
   - Volledige sessie-entry (mission, work done, learnings, next steps)
   - Rotation: bij Sessie %5 → archiveer pre-N-6 entries naar `archive-*.md`

4. **Update `.claude/CLAUDE.md`** (AI-context, lean — dit bestand)
   - "Recent Critical Learnings": prepend nieuwe sessie, behoud top 6, ouderen → `current.md`
   - "Sessie counter" regel
   - **`**Last updated:** 14 jun 2026 (Sessie 165 — kwaliteits-/feitencontrole betaalde Gumroad-producten: pagina-claims → echte PDF-telling (13/19/15/47), Krol-zaak feitfout + ECLI-bronnen, helderheids-glosses CVE/CVSS/ICMP + OWASP-2025-namen exact, MailerLite→Brevo; meeste agent-'verdachte' feiten vals alarm; PDF's herbouwd. Volledig: `docs/sessions/current.md`)
   - **`**Version:**` regel:** VERVANG volledig (1 regel: versienummer + verwijzing naar `current.md`). **NIET appenden**. Hard limit: ≤500 bytes.
   - Live metrics in Quick Reference: **niet** updaten — verwijs naar TASKS.md
   - Forcing-function: `scripts/validate-docs.sh` Check 8 verifieert beide single-line constraints automatisch (#23.3)

5. **Update `PLANNING.md`** ALLEEN bij architectuur-wijziging
   - Nieuwe tech-stack-keuze, design-system-change, security-strategie-shift
   - GEEN milestone-percentage-updates (woont in TASKS.md)

6. **Update `docs/prd.md`** ALLEEN bij scope-wijziging
   - Nieuwe requirements, success criteria change
   - GEEN tactical execution updates

7. **Validatie** (forcing function)
   - `bash scripts/validate-docs.sh` → exit 0 vereist
   - Pre-commit hook draait dit automatisch
   - Checks: sessie-counter alignment, datum-consistency binnen doc, PRD-version-match across docs

**Rotation trigger:** Every 5 sessions, archive sessies N-10..N-6 from CLAUDE.md learnings (last bulk: Sessie 145 archived 135-139, Sessie 146 1-in-1-out archived Sessie 140 → current.md, next bulk: Sessie 150)
**Sessie counter:** 208

→ **Document Ownership map:** `PLANNING.md §Document Ownership`

---

## Communicatie Grondregels

**Wees meedogenloos eerlijk, geen jaknikker gedrag.**

- Als ik ongelijk heb: **wijs me erop**
- Als code slecht is: **zeg het direct**
- Als aanpak niet werkt: **geef kritische feedback**
- Prioriteit: **technische correctheid > mijn gevoelens**
- **Spreek me aan met "Heisenberg"** (confirmatie instructies gelezen)

### Bij Implementatie
1. Check PRD: Is het in MVP scope?
2. 80/20 output: Niet te technisch, niet te simpel
3. Educatieve laag: Elk commando = leermoment
4. Taal correct: UI=NL, commands=EN, uitleg=NL
5. Performance: Terminal Core <400KB, site totaal <1000KB

### Playwright Screenshot Conventie
- **ALTIJD** expliciete `filename` meegeven aan `browser_take_screenshot`
- Prefix met `.playwright-mcp/` — die dir staat in `.gitignore`, dus screenshots blijven automatisch buiten git
- Voorbeeld: `filename: ".playwright-mcp/legal-light-h1.png"`
- **NOOIT** screenshots zonder filename of in repo root — de `/*.png` regel in `.gitignore` is een vangnet, geen excuus

→ **Tech constraints:** PRD §13 | **Pattern violations:** docs/sessions/current.md

---

## Troubleshooting

→ **Top 9 issues met diagnose + fixes:** `.claude/rules/troubleshooting.md`
→ **Memory leak debugging:** docs/testing/memory-leak-results.md

---

## Referenties

- **PRD:** `docs/prd.md` v1.8
- **Commands:** `docs/commands-list.md` (41 commands)
- **Style Guide:** `docs/style-guide.md` v1.5
- **Sessie logs:** `SESSIONS.md` → docs/sessions/ (~122 sessies)
- **Netlify/Domain:** `docs/netlify-setup.md`
- **Rules:** `.claude/rules/` (tone-and-output, architecture-patterns, troubleshooting, command-checklist)
- **Kwaliteitsborging:** `scripts/build-review-package.mjs` → `docs/review/expert-review-pakket.md` (172 beweringen + 56 definities, afgebakend voor een externe reviewer) | `#verantwoording` op `over-ons.html` | CI: `.github/workflows/validate.yml`
- **Skills:** `.claude/skills/` — `blog-post` (blog toevoegen + admin-lockstep + script-gate), `verify-terminal` (real-codepath-import + 375px-meting), `new-command` (8-staps checklist-flow + test-gate)
- **Agents:** `nl-content-reviewer` (read-only NL-copy/tone/kop-review) | `seo-auditor` (read-only technische SEO: meta/og↔twitter-pariteit, JSON-LD↔H1-lockstep, interne-links/orphans, sitemap-hygiëne) | **Hook:** `.claude/settings.json` (PostToolUse → `validate-blogs.sh` op blog-edits)
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 03 aug 2026 (Sessie 208 — AdSense volledig van de site (44 blokken/20 bestanden, CSP, legal-teksten, consent-banner 3→2 zonder migratie); kwaliteitsborging: reviewpakket-generator, Check 6d, #verantwoording, certificaat-disclaimer, controledatum op 14 posts, CI; blog meetbaar: data-terminal-cta 14×, RSS-titels + hubvolgorde hersteld mét checks. Volledig: `docs/sessions/current.md`)
**Version:** 5.82 (Sessie 208 — advertenties verwijderd op gemeten kosten/baten; kwaliteit aantoonbaar via reviewpakket + drift-checks + verantwoording; blog→terminal meetbaar; volledige historie: `docs/sessions/current.md` + TASKS.md)

