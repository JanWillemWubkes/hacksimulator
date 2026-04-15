# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development — ✅ LIVE on Netlify
**Docs:** `docs/prd.md` v1.8 | `docs/commands-list.md` | `docs/style-guide.md` v1.5 | `SESSIONS.md`

---

## Quick Reference

**What:** Browser-based terminal simulator voor Nederlandse beginners — ethisch hacken leren
**Tech Stack:** Vanilla JS/CSS, client-side only, no backend (MVP) | Budget: Terminal Core <400KB, Site totaal <1000KB
**Language:** UI=NL | Commands=EN | Help/Errors=NL

**URLs:** [Production](https://hacksimulator.nl/) | [GitHub](https://github.com/JanWillemWubkes/hacksimulator)
**Blog:** 10 posts live at `/blog/` (105+ inline jargon explanations) | JSON-LD schema + internal cross-linking compleet (Sessie 125)
**Contact:** contact@hacksimulator.nl (Gmail forwarding)

**Performance:** Playwright E2E 160 tests across 30 suites (21 files, 3 browsers) | WCAG AAA | 182 CSS variables (main.css) + 27 (landing.css) = 209 totaal
**Bundle:** Site totaal **~1192 KB** (geverifieerd 06-04-2026) | Splitsing: src/ 604 KB, styles/ 249 KB, blog/ 306 KB (10 posts + JSON-LD), assets/ 597 KB (screenshots 401 + OG image 151) | ⚠️ Runtime budget herijking nodig — blog SEO assets vallen buiten origineel 400 KB Terminal Core budget
**Monetization:** AdSense (10 units) + Ko-fi donaties + Brevo newsletter (double opt-in + welkomstmail live) + **Gumroad products v1.0** (3 guides klaar) | Eigen consent banner (Consent Mode v2)

→ **Live metrics:** `TASKS.md` regels 9-26 (meest recente tellingen)
→ **Architecture:** `PLANNING.md` v2.9 | **Commands:** `docs/commands-list.md` (41 commands)

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

### Sessie 129: Gumroad Products Live & Site-Integratie (13-15 april 2026)
⚠️ **Never:**
- Gumroad PWYW toggle activeren bij Amount €0 — toggle is grayed out, zet Amount eerst op €1+, activeer PWYW, dan minimum op €0 zetten
- Aannemen dat Gumroad PWYW "pay less" betekent — PWYW laat klanten alleen *meer* betalen dan Amount, niet minder; Amount = altijd het minimum
- Blog CTAs via JS injecteren bij <15 posts — hardcoded HTML is beter voor SEO (zichtbaar zonder JS) en makkelijker te onderhouden bij klein aantal

✅ **Always:**
- Contextual CTAs per blogpost (match product aan topic) — verhoogt click-through vs. generieke CTA's
- Gumroad product links naar `/gidsen` landing page in man page tips (niet direct naar Gumroad) — centraliseert traffic, makkelijker te updaten als URLs veranderen
- Bestaande CSS patterns hergebruiken (`.feature-card`, `.btn-cta`, `.blog-cta`) — zero nieuwe JS, verwaarloosbare bundle impact

### Sessie 128: Gumroad Products — Factcheck & Taalconsistentie (12 april 2026)
⚠️ **Never:**
- "Ethical hacking" in Nederlandse lopende tekst — gebruik "ethisch hacken" / "ethische hacker" (NCSC, OM, Wikipedia NL gebruiken de Nederlandse term)
- MailerLite verwijzingen laten staan in product-docs na Brevo-migratie — cross-check alle referenties bij platform-switches
- Producten publiceren zonder online factcheck van claims (OWASP categorieën, certificeringsprijzen, wetsartikelen) — feiten veranderen jaarlijks

✅ **Always:**
- Gumroad tags: beide termen ("ethisch hacken" + "ethical hacking") voor SEO-bereik op Nederlandse én Engelse zoekopdrachten
- Na taalwijziging in drafts ook Typst templates + `template.typ` (header tagline) + listings updaten — template tagline verschijnt op élke PDF-pagina
- PDFs opnieuw compileren na content-wijzigingen (`bash build-pdfs.sh`) — anders zijn PDF en source out-of-sync

### Sessie 127: Gumroad Products — PDF Generatie met Typst (12 april 2026)
⚠️ **Never:**
- Huisstijl-kleuren hardcoden in product docs zonder cross-check met `main.css` — listings hadden `#1a1a2e`/`#00ff41`, site gebruikt `#0d1117`/`#9fef00`
- `Courier New` of `Inter` in Typst templates op Linux — niet standaard geïnstalleerd, gebruik `DejaVu Sans Mono` + `Liberation Sans`
- `<` onescaped in Typst tabel-cellen — parsed als label, geeft compile error (escape met `\<`)

✅ **Always:**
- Typst voor herhaalbare PDF-generatie bij meerdere documenten — één template, `typst compile` en klaar (geen handmatig Canva-werk per update)
- PDF binnenwerk op witte achtergrond voor leesbaarheid (print + telefoon) — donkere covers + donkere code-blokken voor brand, witte body voor content
- Build script (`build-pdfs.sh`) naast templates — maakt PDF-generatie reproduceerbaar voor iedereen

### Sessie 125: SEO, Legal Refactor & A11y Polish (5-6 april 2026)
⚠️ **Never:**
- Hardcoded kleuren in legal pages laten staan na design system migratie — breekt theme support en is inconsistent met blog/pages
- `alert()` voor user-facing errors gebruiken — blokkeert UI thread, geen styling, slechte a11y, geen brand consistency
- Playwright screenshots zonder expliciete `.playwright-mcp/` filename — repo root vervuilt ondanks `/*.png` gitignore vangnet

✅ **Always:**
- JSON-LD schema op álle blog posts (niet alleen homepage) — Google Rich Results vereist per-page structured data
- Internal cross-linking tussen blog posts — verhoogt dwell time en Google's topical authority signal
- Theme toggle button met `aria-pressed` + visible focus ring — WCAG AAA voor stateful controls

### Sessie 126: Newsletter Platform Migratie MailerLite → Brevo (8-12 april 2026)
⚠️ **Never:**
- Brevo automation "Send an email" met de default template deployen — altijd eigen HTML template selecteren via trash-icoon + opnieuw koppelen
- Brevo embed form gebruiken zonder `sib-styles.css` — `main.js` is afhankelijk van specifieke CSS klassen (`.input--hidden`, `.sib-form-message-panel`)
- `sib-form` IDs hergebruiken op dezelfde pagina — Brevo JS koppelt aan `#sib-form`, `#error-message`, `#success-message` (uniek per pagina)

✅ **Always:**
- Domain authenticeren (SPF/DKIM) vóór eerste verzending — Brevo kan dit automatisch via TransIP API-integratie
- Double opt-in voor GDPR-compliance — bevestigingsmail trigger zit op form-niveau, niet op list-niveau in Brevo
- Brevo inline styles overrulen met `!important` in eigen CSS — standaard bij third-party embeds, geen anti-pattern in deze context
- `locale` hidden field op `nl` zetten + alle `window.*_MESSAGE` variabelen in het Nederlands — Brevo's JS leest deze voor client-side validatie

### Sessie 124: Gumroad Products v1.0 (3-4 april 2026)
⚠️ **Never:**
- Product content publiceren zonder dubbele factcheck — paid products eisen 100% verifieerbare claims (user product quality standard)
- Generieke "leerplan" zonder concrete uren/weken/oefeningen — kopers verwachten directe actionability

✅ **Always:**
- Product drafts in `docs/products/` versioneren (v1.0, v1.1...) — git history is changelog voor refunds/disputes
- Listings + setup guide naast product zelf opleveren — Gumroad onboarding heeft eigen metadata vereisten (preview, FAQ, refund policy)
- Monetization track diversificatie: AdSense (passief) + Ko-fi (donaties) + Newsletter (lead nurture) + Gumroad (digital products) — geen single point of failure

### Sessie 123: Newsletter Polish & April Editie (29 mrt – 1 april 2026)
⚠️ **Never:**
- Aannemen dat MailerLite duplicate signups silent blokkeert — server response parsen + localStorage cross-check vereist
- Newsletter HTML schrijven zonder Outlook/Gmail dark mode test — clients renderen `<style>` tags inconsistent

✅ **Always:**
- UTM parameters op alle nieuwsbrief CTA's — anders zijn newsletter conversies onzichtbaar in GA4
- Theme-aware feedback colors (success/error) via CSS vars, niet hardcoded greens/reds — consistent met design system
- Mobile-first button styling testen op 375px viewport vóór desktop polish — newsletter signup is hot path op mobile

**Rotation:** Keep last 5 full. Archive: docs/sessions/ (current.md, recent.md, archive-*.md)

---

## Sessie Protocol

**Voor Sessie:** Lees `PLANNING.md`, `TASKS.md`, dit bestand
**Tijdens:** Markeer taken in TASKS.md direct | Noteer architecturale beslissingen
**Afsluiten:** Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
**Rotation trigger:** Every 5 sessions (last: Sessie 125, next: Sessie 130)
**Sessie counter:** 129
**Bij Requirement Changes:** `docs/prd.md` → `PLANNING.md` → `TASKS.md` → `CLAUDE.md`

→ **Document Sync Protocol:** PLANNING.md §Document Sync

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
- **Filesystem:** PRD Bijlage B | **Tech rationale:** PRD §13

---

**Last updated:** 15 april 2026 (Sessie 129 — Gumroad Products live & site-integratie)
**Version:** 5.2 (Sessie 129: /gidsen page, blog CTAs, man page tips, navbar + footer links)
