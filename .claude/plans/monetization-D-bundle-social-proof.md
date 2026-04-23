# Plan D — Bundle-first /gidsen layout + social proof

**Status:** Open | **Geschat:** ~0.5 sessie | **Opvolger van:** Sessie 131 (CTA tracking live)
**Reconstructed from session log:** 22 april 2026 (Sessie 132)

---

## Doel

De `/gidsen` pagina herordenen zodat de **Starter Kit Bundle (€10)** als primaire optie wordt gepresenteerd, met de drie losse gidsen (€5 elk) als secundair. Daarnaast eerste laag social proof (stats of eerste testimonials) bovenaan toevoegen om vertrouwen te verhogen bij cold traffic uit Google/blog.

**Hypothese:** Bundle heeft betere unit economics (€10 vs. gemiddeld €5 AOV), maar huidige layout toont losse gidsen eerst → visitors kiezen goedkoopste optie. Bundle bovenaan met "bespaar €5" framing verhoogt AOV. Social proof pakt cold-traffic twijfel aan.

---

## Scope (wat wél)

**Dit is een bewust kleine sessie (~0.5).** Doel = structurele herschikking, geen nieuwe features.

### Deel 1: Bundle-first herordening
1. In `gidsen.html`: verplaats `.gids-bundle` sectie van onderaan (regels ~225-230+) naar **direct onder de page-hero**, vóór de 3 losse gidsen-cards.
2. Bundle-card visueel prominenter maken:
   - Badge aanpassen: `"Bundel | Alle 3 gidsen | Bespaar €5"` (ipv alleen "Bundel | Alle 3 gidsen | ~75 pagina's")
   - Prijs-display: `~~€15~~ €10` (doorgestreepte originele prijs + bundle prijs) — visueel anchoring
   - Groene `border-accent` intact (al aanwezig via `.gids-bundle`)
   - Optioneel: "POPULAIR" of "AANBEVOLEN" label (eerlijk gebruiken — alleen als stats dat dekken, anders weglaten)
3. 3 losse gidsen daaronder als "Liever één onderwerp?" sectie — nieuwe h2 boven de `.feature-cards` grid.
4. `data-cta-location` attributen bijwerken zodat Sessie 131 tracking blijft kloppen:
   - Bundle bovenaan: `data-cta-location="gidsen_bundle_top"` (was: `gidsen_bundle`)
   - 3 losse cards: blijven `gidsen_juridisch`, `gidsen_pentest`, `gidsen_leerplan`

### Deel 2: Social proof laag (placeholder-safe)
Twee opties — kies op basis van werkelijke data op implementatiedag:

**Optie A (als ≥3 echte testimonials binnen):**
- Testimonial grid (3 cards) onder de bundle-card
- Per card: quote, naam (of voornaam + initiaal), context ("Beginner, 2 weken user")
- ALLEEN echte quotes (user product quality standard — zie `memory/feedback_product_quality.md`)

**Optie B (als nog geen testimonials — verwacht scenario):**
- Stats-strip onder bundle-card met verifiable nummers:
  - "10 blog posts" (feitelijk — `blog/` directory)
  - "41 commands in simulator" (feitelijk — `docs/commands-list.md`)
  - "21 gamification badges" (feitelijk — `src/gamification/badge-definitions.js`)
  - "105+ jargon uitleg" (feitelijk — CLAUDE.md Quick Reference)
- Geen fake numbers ("1000+ gebruikers" zonder bewijs) — user's product quality standard verbiedt dat.

### Deel 3: Kleine polish
- Terminal aesthetic intact — stats in monospace font via `.gids-badge` / CSS var `--font-family-mono`
- Licht/donker thema parity checken via Playwright screenshots
- Mobile layout (375px) check — bundle card mag niet breken bij column collapse

## Scope (niet)

- Geen nieuwe Gumroad product-additions
- Geen A/B testing framework
- Geen testimonial-collectie automation (eerst handmatig verzamelen)
- Geen redesign van de hele pagina — alleen herordenen + social proof-strip

---

## Kritieke files

- `gidsen.html` — regels 167-230+ (cards + bundle), daar herordenen
- `styles/pages.css` — bestaande `.gids-card`, `.gids-bundle`, `.gids-badge` (Sessie 129) — hergebruik + hooguit ~20 regels nieuw
- `src/analytics/events.js` — geen wijzigingen nodig, tracking werkt via data-attributes
- `src/ui/cta-tracking.js` — delegated listener pakt automatisch nieuwe posities op

## Weten vóór je start

- Huidige `/gidsen` is marketing-page variant navbar (Sessie 129) — geen terminal UI
- Bundle Gumroad URL: `https://hacksimulator.gumroad.com/l/emzjvj` — niet veranderen
- Sessie 131 tracking werkt met `[data-product-id]` — dat attribuut moet blijven op alle CTAs
- `.feature-cards` grid = 3-kolom op desktop, 1-kolom op mobile — bundle mag full-width blijven
- Light theme overrides al aanwezig in `styles/pages.css` (Sessie 129) — inspecteer vóór je nieuwe CSS schrijft

## Risico's

- **Tracking breuk:** `data-cta-location` waardes wijzigen zonder GA4 custom dimension cleanup vervuilt analytics history. Oplossing: nieuwe waarde (`gidsen_bundle_top`), oude waarde (`gidsen_bundle`) niet hergebruiken — rapporten blijven zo vergelijkbaar.
- **Nep-testimonials:** Optie A zonder echte quotes = direct conflict met user's product quality memory. **Niet doen** zonder schriftelijke toestemming per testimonial.
- **"Populair" label zonder bewijs:** Alleen gebruiken als er feitelijke stats zijn (bv. Gumroad dashboard toont >50% bundle sales). Anders weglaten — liegen op een monetization page erodeert vertrouwen sneller dan het verkoopt.

---

## Definition of Done

- [ ] Bundle card zichtbaar vóór de 3 losse cards (both desktop + mobile)
- [ ] Bundle prijs toont anchoring (`~~€15~~ €10` of "Bespaar €5")
- [ ] 3 losse cards onder "Liever één onderwerp?" heading
- [ ] Social proof-strip of testimonials toegevoegd (Optie A of B)
- [ ] `data-cta-location="gidsen_bundle_top"` op bundle CTA
- [ ] Light + dark theme Playwright screenshots bijgevoegd (in `.playwright-mcp/`)
- [ ] Mobile (375px) layout werkt
- [ ] GA4 DebugView: klik op nieuwe bundle-top CTA vuurt event met correcte location

## Meetcriteria (4 weken na launch)

- Bundle-ratio (`product_cta_click` met `location=gidsen_bundle_top`) / losse ≥ 1.5×
- AOV-proxy: clicks op bundle ≥ clicks op één individuele gids
- Geen click-through daling op losse gidsen (nieuwe bundle mag niet kannibaliseren zonder compensatie in bundle-clicks)
