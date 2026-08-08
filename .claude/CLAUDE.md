# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify (laatste: Sessie 214)
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 14 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125; +2 posts Sessie 160)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E over Chromium/Firefox/WebKit (spec- en test-aantallen: zie TASKS.md §Huidige Focus) | WCAG AAA | 182+27 CSS variables (main.css + landing.css)
**Bundle:** Runtime <400 KB (strikt, terminal.html) + SEO/content-pijler budgetloos (blog + assets). Site-totaal en exacte KB-breakdown wisselen per sessie — zie TASKS.md §Huidige Focus voor ground truth.
**Monetization stack:** Ko-fi + Brevo newsletter (double opt-in + welkomstmail + deliverability getuned) + Gumroad v1.0 (3 guides + bundel) + 2 lead magnets (Sample Pentest + Sample Juridisch, elk een eigen Brevo-formulier + automation sinds Sessie 212). Eigen consent banner (2 knoppen) met Consent Mode v2. **Geen advertenties** — AdSense verwijderd in Sessie 208 op gemeten kosten/baten. **Per-stack actuele status:** TASKS.md §M5.5 sectie-body.

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

### Sessie 214: Interactieve hero-terminal — en een demo die over drie van de vier commands loog (08 aug 2026)
⚠️ **Never:**
- Een demo laten staan die afwijkt van de engine. De hero gaf `whoami` → `user` (echt: `hacker`), `ls` → `passwords.txt`/`notes.md` (bestaan niet in de VFS) en `nmap 192.168.1.1` → poort 22 i.p.v. het router-profiel 53/80/443. Op een site die "aantoonbaar" als kwaliteitsclaim voert is dat geen cosmetiek maar een geloofwaardigheidslek — en het stond er sinds de bouw van de landingspagina.
- `innerText()` ná een animatielus lezen om te bewijzen wát die lus toonde. `trimOldLines()` knipt de oudste regels weg, dus de meting kán het bewijs niet bevatten. Mijn test was daardoor **groen op de kapotte pagina**, mede omdat hij `hacker` zocht en dat gewoon in de promptregel `hacker@hacksim:~$` staat. Twee blinde vlekken die elkaar dekten. Een `MutationObserver` via `addInitScript()` vangt wél alles.
- `RESPONSES[naam]` gebruiken als de sleutel van de bezoeker komt. `constructor`, `toString`, `__proto__` en `hasOwnProperty` zijn allemaal truthy op een object-literal; één getypt woord blokkeerde de hele REPL op `undefined.slice()`. `Object.hasOwn` is de fix — en meld het origineel terug, niet de kleingemaakte vorm (`toString` → `tostring` verwart).
- Aannemen dat een browser een `readonly` veld focust als je die vlag tijdens `pointerdown` weghaalt. Firefox beslist focusbaarheid bij mousedown: `document.activeElement` bleef `BODY`, dus de bezoeker zag de terminal live gaan en zijn toetsaanslagen verdwenen. **Alleen de driemotorenrun ving dit** — op Chromium is het onzichtbaar.
- `flex-direction: column; justify-content: flex-end` combineren met `overflow-y: auto`. Chrome en Firefox clippen de bovenkant van de inhoud dan onbereikbaar weg. `display: block` + `scrollTop = scrollHeight` doet hetzelfde zonder de val.
- Een klasse op de regel zetten terwijl de CSS descendant-selectors gebruikt. `.terminal-line .tip` matcht niet op `<div class="terminal-line output tip">`; de markers renderden wit in plaats van groen. Kleuring hoort in een `<span>` bínnen de regel.
- Een teller gebruiken die meer verzamelt dan je bedoelt. De afrondboodschap hing aan `gedaan.size`, en `gedaan` bevat élke invoer — zes willekeurige woorden riepen de CTA op, en daarna elk volgend command opnieuw.

✅ **Always:**
- Los een "geleid of vrij"-vraag op door te kijken wat de dúre helft is. De REPL-machinerie is het werk; begeleiding erbovenop is ~30 regels. "Geleid" als *vervanging* zou een click-through zonder invoer opleveren — precies de belofte die de subtitel drie regels hoger doet. Eén affordance die begeleiding, eerlijke grens én mobiele bediening tegelijk is (zes chips) verslaat twee systemen naast elkaar.
- Bewijs een fix met de mutant, ook als de test al groen is. Drie van de vijf bugs deze sessie zijn zo geverifieerd: oude code terug → test weer rood. Zonder die stap weet je niet of je assertie de bug kán zien.
- Kies een budgetgrens op bruikbaarheid, niet op "net genoeg". Mijn eerste bump (1075) liet 5,8 KB over — even krap als waar ik begon. Een limiet die op élke wijziging vuurt wordt weggeklikt in plaats van onderzocht; ~3% marge houdt hem een alarm. En zeg erbij wát het meet: dit is ongeminificeerde broncode sitebreed, geen perf-poort (Terminal Core wordt met nul bytes geraakt).
- Meet mobiele breedte op twee manieren, want de ene is blind voor de andere: tekentelling ≤40 op regels die jíj schrijft, plus geometrische overflow tegen `clientWidth` voor álle regels. Letterlijke bestandsinhoud valt buiten de tekentelling — die hoort te wrappen, en inkorten zou het bestand vervalsen.
- Omhul analytics-aanroepen naar een net uitgebreide gedeelde module. Relatief geïmporteerde submodules dragen geen `?v=`, dus een terugkerende bezoeker kan tot `max-age` een oude `events.js` krijgen; zonder guard is dat een `TypeError` na elk command.
- Check het browserpad in plaats van het te gokken — de Sessie 209-les geldt nog steeds, maar andersom: hier stonden ze gewoon op de standaardlocatie en was `CHROMIUM_PATH` helemaal niet nodig. Mijn gok liet alle 30 tests falen.
- Wees expliciet over wat je níét kunt bewijzen: of de hero-demo de doorklik verhoogt, weet je pas als `terminal_cta_click{location:hero}` te segmenteren is op sessies mét `hero_demo_started`. Tot dan is het een hypothese, geen resultaat.


### Sessie 213: Gidsen-grid, CTA-uitlijning en een navbar die site-breed 500px te breed was (07 aug 2026)
⚠️ **Never:**
- `flex: 1` op een type-selector zetten. `.gids-card p { flex: 1 }` selecteerde óók `p.gids-sample-link`, dus twee flex-items met `flex-basis: 0` deelden de rek (gemeten: 82px + 66px = precies de 164px van een kaart-zonder-sample min de extra marge). Twee vervolgeffecten die als los raadsel oogden: `margin-top: auto` op de knop werd een no-op (flex-grow verdeelt vóór auto-marges) en de eigen marge van de sample-link landde nooit ((0,1,1) verslaat (0,1,0)). **Zulke bugs vind je niet door de CSS te lezen — alleen `getComputedStyle` verraadt een `flex-grow` die je nooit hebt gezet.**
- Denken dat een media query specificiteit toevoegt. Hij telt voor nul, dus bij gelijke selectoren wint puur de laadvolgorde. `.features-4col` in pages.css versloeg daardoor `@media (max-width: 1024px)` in landing.css, en mijn eigen 2-koloms-regel deed hetzelfde met de mobiele 1fr-regel: 6px overflow en kaarten van 173px op 375px. Gebruik wederzijds uitsluitende ranges (`≤768` naast `≥769`) — die hebben helemaal geen winnaar nodig.
- `scrollWidth <= clientWidth` lezen als "het past". Wrappen is geen overflow: mijn eerste navbar-grens (1179px) werd door mijn eigen test goedgekeurd terwijl de screenshot twee afgebroken labels toonde. Zet een aparte wrap-assertie naast de overflow-check, want de ene maat is structureel blind voor de andere.
- `getClientRects().length` gebruiken om wrap te detecteren in een flexbox. Flex-children zijn geblokkeerd, dus tekst over twee regels levert nog steeds één rect op. Meet op hoogte tegen `line-height`.
- Een `color` meenemen in een layout-override met een ID in de selector. `#landing-mobile-menu .navbar-links a` is (1,1,1) en versloeg daarmee élke kleurregel in main.css — inclusief mijn eigen CTA-fix. Symptoom: `font-weight` kwam wél door en de kleur niet.
- `checkVisibility()` vertrouwen bij visually-hidden-patronen. Die API kijkt naar `display`/`visibility`/`opacity` en negeert `clip-path` en `overflow` — hij gaf `true` op een `<th>` die aantoonbaar weggeknipt was. Hit-testing (`elementFromPoint`) is daar de betrouwbare meting.

✅ **Always:**
- Los een uitlijningsklacht structureel op, niet met een afstelling. Eén groeier (`.gids-card-body`) zet prijs, knop en bloglinks op vaste afstand van de kaartbodem, dus de invariant **kaartbodem − CTA-bodem = 186px** geldt voor alle vier de kaarten — ongeacht welke een sample draagt. Een `margin-top: auto`-fix was gebroken zodra iemand een derde sample toevoegde.
- Zoek een breakpoint binair op in plaats van hem te schatten, en meet in élke engine. Vanaf 1147px liep er niets meer buiten de balk, maar pas vanaf 1264px (1266 in WebKit) brak er ook niets meer af. De strengste meting wint, plus marge: band tot 1279px zodat de desktopnav vanaf de gangbare 1280px verschijnt.
- Bewijs met de oude code dat een gevonden overflow niet van jou is. Productie gaf exact dezelfde 341px en dezelfde 917px `nav-right` — daarmee was in één meting duidelijk dat het pre-existing was en hoe groot de blast radius was (élke marketingpagina + alle blogposts).
- Verklein een regel met een selector-token in plaats van een uitzondering toe te voegen. `:nth-child(3)` → `:nth-child(3):last-child` drukt uit wat de regel altijd al bedoelde en fixte twee pagina's tegelijk; elk aangeraakt grid geteld (5× drie kinderen, 2× vier) om nul gedragswijziging te bewijzen waar het wél klopte.
- Neem bij het verbreden van een media-band de **gemeten effectieve stijlen** van de directe buur over, niet de bron-CSS. Die bron wordt daar deels overruled, dus overtikken levert iets anders op dan wat er staat. Visueel vergeleken op 700px en 1000px: identiek.
- Behandel flaky tests als een meetfout tot het tegendeel blijkt. Vier "browserverschillen" waren allemaal `page.goto`-timeouts met nul assertiefouten; oorzaak was `TCPServer` in `scripts/nostore-server.py` die één request tegelijk afhandelt terwijl drie browsers parallel laden. `ThreadingTCPServer` haalde de hele faalklasse weg.
- Leg vast wat géén bug is, mét de meting. De `<th>` uit `.blog-table--stacked` is het complete visually-hidden-patroon (absoluut, 1×1px, `clip-path`), uit de flow, geen scroll, niets raakbaar — "oplossen" zou `display: none` betekenen en schermlezers de kolomkoppen kosten.

### Sessie 212: Lead magnets — verkeerde bestandsnaam en verkeerde welkomstmail (07 aug 2026)
⚠️ **Never:**
- Een `_headers`-wildcard een vaste `filename` laten dragen. `/assets/samples/*` met `filename="pentest-playbook-sample.pdf"` was correct toen de map één sample had, en werd stilzwijgend fout toen de juridische erbij kwam — zonder commit die de bug introduceert. Live bewijs: de juridische URL leverde 83.672 bytes (de júíste PDF) onder de pentest-naam. Geen 404, geen foutmelding, alleen een naam die loog.
- Twee lead magnets op één Brevo-formulier laten posten terwijl de automation op een *Form submitted*-trigger draait — Brevo **kán** de instromen dan niet scheiden en tags zijn er geen automation-criterium. Eén formulier per lead magnet, één automation per formulier.
- Een absolute regel maken van een eigen notitie die een voorwaarde draagt. "Plus-alias anti-evasion" gold alléén voor adressen die al op de blocklist staan, én alleen op het transactional-kanaal — een kanaalonderscheid dat ik in dezelfde boodschap zélf uitlegde. Ik adviseerde "geen plus-alias"; Heisenberg testte er gewoon mee en het werkte.
- Twee keer achter elkaar met te veel zekerheid over hetzelfde punt praten. Ik claimde Brevo's Messages-gedrag zonder meting, corrigeerde daarna te ver op basis van alleen de goedkoop testbare foutpaden, en zat beide keren mis. Het pad dat telde (gelukte inzending) was juist het pad dat ik niet zelf kon testen.

✅ **Always:**
- Laat een drift-check filesystem-ground-truth eisen, geen lijst. Check 10 verlangt per `assets/samples/*.pdf` een exacte-pad-regel met zijn eigen basename én verbiedt een wildcard met vaste filename — een derde sample telt automatisch mee en kan de bug niet herhalen.
- Codeer een openstaande handmatige stap als een **bewust rode test**, niet als TODO. "Elke sample post naar een ánder Brevo-formulier" faalde tot het Brevo-handwerk klaar was en werd groen op het exacte moment dat het af was. Een regel in een runbook meldt niets terug.
- Vraag het de gebruiker wanneer hij de discriminator in twee seconden kan leveren. Welke tekst het bevestigingspaneel toont, kon alleen een echte inschrijving beantwoorden — en Heisenberg had de flow net doorlopen. De twee kandidaat-teksten liepen na "klaar." uiteen; dat had mijn eerste vraag moeten zijn, niet mijn derde.
- Maak bij een browserverschil **beide kanten** correct in plaats van uit te zoeken wie wint. `download="<naam>.pdf"` én `Content-Disposition: filename` dragen nu dezelfde naam, dus de fix draagt geen browser-specifieke aanname. Zelfde reflex bij Netlify's header-merge: `Cache-Control` in elk exact blok herhaald i.p.v. hopen dat de wildcard-waarde meekomt (ná deploy bevestigd).

### Sessie 209: W2 browserverificatie — kwaliteitsronde bewezen in de browser (05 aug 2026)
⚠️ **Never:**
- Aannemen dat een codewijziging werkt omdat de logica klopt — de skip-certificaat-code was geschreven, gereviewed en gecommit zonder dat iemand 7× `tutorial skip` had getypt in een browser. Pas de Playwright-test bewees dat `stepsSolved` inderdaad op 0 bleef terwijl `currentStep` naar 7 ging.
- Een pre-installed Chromium-pad raden — Playwright verwachtte `chromium_headless_shell-1234/…/chrome-headless-shell` maar de binary stond op `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Alle 242 tests faalden tot `CHROMIUM_PATH` expliciet was gezet. Check het pad, gok het niet.

✅ **Always:**
- Schrijf tests die het volledige pad door de code bewijzen, niet alleen de eindtoestand — de W2-tests volgen elk het pad (input → manager → certificate/help-system → output) en asserteren op de zichtbare terminal-tekst, niet op interne state. Dat ving ook dat `_hasErrorOutput()` op string-output werkt (niet objecten) en dat de tutorial-guard in `terminal.js:392` de escalatie correct onderdrukt.
- Behandel pre-existing test-failures als gedocumenteerde baseline — 7/249 failures die óók tegen productie reproduceren zijn geen regressie. Documenteer ze (5× device-emulatie, 1× resize-timing, 1× briefing-timing) zodat de volgende sessie ze niet opnieuw diagnosticeert.

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

**Rotation:** Top-6 huidig: 207-208-209-212-213-214 (Sessie 206 → `docs/sessions/current.md` via 1-in-1-out, Sessie 214). **Bestemmings-conventie (Sessie 170): `docs/sessions/README.md`** — range-naamgeving `archive-sNNN-sMMM.md`, legacy `archive-q*`/`recent.md` bevroren. **Bulk-rotatie:** laatste uitgevoerd Sessie 211 (195-199 → `archive-s195-s199.md`); current.md houdt nu het rolling window 200-214 (15 entries). Volgende bulk-rotatie Sessie 215 → archiveer 205-209. SESSIONS.md-index gesynct. Historie 81-199 → `archive-s195-s199.md` + `archive-s190-s194.md` + `archive-s185-s189.md` + `archive-s180-s184.md` + `archive-s175-s179.md` + `archive-s170-s174.md` + `archive-s165-s169.md` + `archive-s121-s164.md` + `archive-s081-s120.md`; pre-Sessie 81 → legacy `archive-*`.

---

## Sessie Protocol

**Voor Sessie:** Lees `.claude/CLAUDE.md` (this file) + check sprint-regel + Volgende Stappen in `TASKS.md`
**Tijdens:** Markeer taken in `TASKS.md` direct | Architecturale beslissingen alleen in `PLANNING.md` bij echte arch-change
**Afsluiten:** Use `/summary` command → 7-staps flow (zie hieronder)

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

**Rotation trigger:** Bij elke sessie 1-in-1-out op de CLAUDE.md-learnings (top-6 vast). Bulk-rotatie van `current.md` bij `N % 5 == 0`: archiveer de oudste ~5 entries naar `archive-sNNN-sMMM.md`. Laatste bulk: Sessie 211 (195-199). **Volgende bulk: Sessie 215** (archiveer 205-209). Actuele stand: zie de **Rotation**-regel onder §Recent Critical Learnings.
**Sessie counter:** 214

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

**Last updated:** 08 aug 2026 (Sessie 214 — interactieve hero-terminal op index.html: vrije mini-REPL met zes commands + tikbare suggestiechips, en de auto-demo die over `whoami`/`ls`/`nmap` loog rechtgezet tegen de bron. Volledig: `docs/sessions/current.md`)
**Version:** 5.88 (Sessie 214 — hero-REPL + homepage-trechter; 5 bugs, 3 met mutant bewezen; bundlelimiet 1050 → 1100 KB; volledige historie: `docs/sessions/current.md` + TASKS.md)

