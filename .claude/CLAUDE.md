# CLAUDE.md — HackSimulator.nl

**Project:** Browser-based terminal simulator die Nederlandse beginners ethisch hacken leert.
**Status:** MVP Development — ✅ LIVE op Netlify (laatste: Sessie 230)
**Stack:** Vanilla JS/CSS, client-side only, geen backend, geen build-stap. Deploy = push naar `main`.
**Docs:** `docs/prd.md` v1.8 | `PLANNING.md` v3.0 | `TASKS.md` (live metrics) | `docs/style-guide.md` v1.5

---

## Verifiëren

Draai dit vóór je "klaar" zegt. Beide validate-scripts draaien ook als pre-commit hook én in CI
(`.github/workflows/validate.yml`), dus een falende check blokkeert de commit sowieso.

```bash
bash scripts/validate-docs.sh --deep   # cross-doc-invarianten + content-drift — exit 0 vereist
./scripts/validate-blogs.sh            # blogstructuur (ook PostToolUse-hook op blog/*.html)
npx playwright test                    # E2E over Chromium/Firefox/WebKit
```

**Er is GEEN baseline van bekende testfalers.** Gaat er iets rood, behandel het als regressie —
er is niets om het aan toe te schrijven. Een onopgeloste conditie hoort als assertie in een test
(die meldt terug), niet als notitie (die verdampt). "Dat is een bekende faler" is een bewering
die je moet meten.

---

## Red lines

- **Vanilla JS/CSS.** Geen framework, geen bundler, geen build-stap, geen backend in MVP.
- **Budget:** Terminal Core <400 KB, site totaal <1000 KB. Actuele meting: **TASKS.md §Huidige
  Focus** — dat is de single source of truth. Zet hier geen KB-, test- of commandotellingen neer.
- **Geen emoji in code of output.** ASCII-brackets: `[TIP]`, `[!]`, `[✓]`.
- **Geen `!important` in `styles/`.** Win op specificiteit; check eerst of de tegenregel dood is.
- **Geen logging van commando-argumenten** (gebruikersinvoer).
- **Geen advertenties.** AdSense is in Sessie 208 verwijderd op gemeten kosten/baten.

Volledige tech-rationale: PRD §13.

---

## Taal & toon

| laag | taal |
|---|---|
| UI, help, tips, warnings | Nederlands |
| commandonamen + tool-output | Engels |
| foutmeldingen | Engels + Nederlandse uitleg |

- **"je", niet "u".** Toegankelijk, niet afstandelijk formeel.
- **Bemoedigend:** "Goed bezig!", "Bijna!" — niet "Fout." of "Wrong."
- **Koppen in Nederlands zinskapitaal:** alleen eerste woord + eigennamen. Geen Engelse Title Case.
  Merken, acroniemen en camelCase blijven zoals ze zijn.
- **Leg "waarom" uit, niet alleen "wat".** Elk command is een leermoment.
- **80/20-output:** technische output (EN) + `← NL-context` + `[TIP]` (NL) + `[!]` bij offensive tools.
  Voorbeeld: `22/tcp OPEN SSH ← Secure Shell` + `[TIP] Open poorten = attack vectors`.

Rationale: PRD §6.6 (taal) en §9.2 (80/20). Good/bad-paren + checklist: `.claude/rules/command-output.md`.

---

## Werkafspraken

- **Spreek me aan met "Heisenberg"** (bevestigt dat je deze instructies gelezen hebt).
- **Wees meedogenloos eerlijk, geen jaknikker.** Heb ik ongelijk: wijs me erop. Is code slecht:
  zeg het direct. Werkt een aanpak niet: geef kritische feedback. **Technische correctheid gaat
  vóór mijn gevoelens.**
- **Commit direct naar `main`.** Nooit een feature- of fix-branch.
- **Meet, reken niet.** Elk getal dat je in een doc zet komt uit een commando, niet uit
  hoofdrekenen of een schatting. Een verkeerd getal in een plan wordt volgende sessie een feit.
- **Screenshots:** altijd expliciete `filename`, met prefix `.playwright-mcp/` (staat in
  `.gitignore`). Bijv. `filename: ".playwright-mcp/legal-light-h1.png"`. Nooit zonder filename,
  nooit in de repo-root — de `/*.png`-regel in `.gitignore` is een vangnet, geen excuus.

---

## Harde invarianten

Sessie-overstijgend, duur betaald. De uitwerking mét code staat in de gescopete rules hieronder.

- Een contrast- of kwaliteitsclaim in een **commentaar** is een **bewering** tot je hem meet.
- Een guard die op een **lijst** filtert, bewaakt die lijst — niet de klasse. Draai de populatie
  om naar "alles" en laat de uitzonderingen zich verantwoorden.
- Meet **gerenderde pixels**, niet `getComputedStyle` of `textContent`, bij layout, naden,
  tapdoelen en shaping — het font kan iets anders schrijven dan er in de DOM staat.
- **Bevries transities vóór je meet**; wachten op "uitgesetteld" is niet betrouwbaar.
- Kies mutanten die op **verschillende asserties** falen, en controleer wélke vuurde.
- Geef elke guard een **zelfbewakende tak** — een check die nooit kán falen is niet te
  onderscheiden van een kapotte check.
- Verifieer een submodule-fix tegen een **no-store server**, nooit tegen een warme browser.
- Repareer de **oorzaak in het brondocument**, niet alleen het symptoom op de vindplaats.
- Eis **positief bewijs dat een meting gedraaid heeft** — een eindblok, een niet-lege populatie.
  Exit 0, een lege grep en een afgekapte run zien er anders identiek uit.

---

## Waar de rest woont

De rules met een `paths:`-veld laden automatisch zodra je een matchend bestand opent — ze staan
dus niet in elke sessie in context, maar zijn er wél voordat je zo'n bestand bewerkt.

| wat | waar | laadt |
|---|---|---|
| CSS-, layout- en themapatronen | `.claude/rules/css-layout.md` | bij `styles/**`, `**/*.html` |
| JS-runtimepatronen | `.claude/rules/js-runtime.md` | bij `src/**/*.js` |
| Meet- en guarddiscipline | `.claude/rules/meten-en-guards.md` | bij `tests/e2e/**`, `scripts/**` |
| Cache- en deploystrategie | `.claude/rules/caching-deploy.md` | bij `_headers`, `netlify.toml` |
| Command-output + 8-staps checklist | `.claude/rules/command-output.md` | bij `src/commands/**` |
| Troubleshooting (top 10) | `.claude/rules/troubleshooting.md` | altijd |
| Sessie afsluiten (7 stappen) | `/summary` | op aanroep |
| Blogpost toevoegen/bijwerken | `blog-post`-skill | op aanroep |
| Nieuw command toevoegen | `new-command`-skill | op aanroep |
| Terminal-wijziging in de app verifiëren | `verify-terminal`-skill | op aanroep |
| NL-copy-review / technische SEO-audit | `nl-content-reviewer` / `seo-auditor` (agents) | op verzoek |
| Sessiehistorie + volledige casuïstiek | `docs/sessions/current.md` + `archive-s*.md` | lezen |
| Commandospecs (41 commands) | `docs/commands-list.md` | lezen |
| Scope, requirements, tech-rationale | `docs/prd.md` | lezen |
| Architectuur + document-ownership | `PLANNING.md §Document Ownership` | lezen |
| Executietracker + live metrics | `TASKS.md` | lezen |

**Monetization:** Ko-fi + Brevo-nieuwsbrief (double opt-in) + Gumroad (4 guides + bundel) +
2 lead magnets (Sample Pentest + Sample Juridisch). Eigen consent banner met Consent Mode v2.
Actuele status per kanaal: TASKS.md §M5.5.

**URLs:** [hacksimulator.nl](https://hacksimulator.nl/) · [GitHub](https://github.com/JanWillemWubkes/hacksimulator) · contact@hacksimulator.nl

---

## Sessie Protocol

**Voor:** lees dit bestand + de sprint-regel en Volgende Stappen in `TASKS.md`.
**Tijdens:** markeer taken direct in `TASKS.md`. `PLANNING.md` alleen bij een echte
architectuurwijziging, `docs/prd.md` alleen bij scopewijziging.
**Afsluiten:** `/summary` — die bevat de volledige 7-staps flow, inclusief de ground-truth-meting
en de validatiegate. Niet hier dupliceren.

**Sessie counter:** 230

<!-- Onderhoudsnotitie (wordt niet in context geladen):
     Dit bestand is de altijd-geladen laag. Houd het onder 150 regels — validate-docs.sh
     Check 18 bewaakt dat, samen met de eis dat elke rule buiten troubleshooting.md een
     paths:-veld heeft. Sessienarratief hoort in docs/sessions/current.md, herbruikbare
     patronen in .claude/rules/. Check 18d weigert `### Sessie NNN`-koppen hier. -->

---

**Last updated:** 21 aug 2026 (Sessie 230 — het blogfilter verbergt alleen `.blog-post-card`, dus het nieuwsbriefblok bleef staan: 4 van de 6 categorieën toonden bovenaan een formulier i.p.v. een artikel. Klasse-gebaseerde `order` erbij. Rotatie 215-219. Volledig: `docs/sessions/current.md`)
**Version:** 6.03 (Sessie 230 — één grid-item met een vaste breedte rekte via de enige `auto`-track álle 15 kaarten op, onzichtbaar weggeknipt door `overflow-x: hidden`. Twee metingen logen groen: een geïnjecteerde `<style>` wint altijd op bronvolgorde, en `goto` naar een fragment-only URL herlaadt niet. Historie: `docs/sessions/current.md`)
