Please add a session summary following the 7-step `/summary` flow (introduced Sessie 139 — Document Ownership refactor).

This skill replaces the pre-Sessie 139 two-tier approach (SESSIONS.md + CLAUDE.md only). The new flow ensures **TASKS.md is the single source of truth** for execution-state and that `scripts/validate-docs.sh` validates cross-doc invariants.

---

## Step 1: Ground-truth meting (read-only, ~30 sec)

Run these BEFORE writing anything — cache results to use in steps 2-4:

```bash
# Bundle metrics (paste in /tmp/ground-truth.txt)
du -sb src/ styles/ blog/ assets/ 2>/dev/null

# Test infrastructure ground truth
find tests/e2e -name "*.spec.js" 2>/dev/null | wc -l
grep -rE "^\s*test\(" tests/e2e --include="*.spec.js" 2>/dev/null | wc -l

# Sessie context (latest commit + current sessie-counter)
git log --oneline -5
grep -E "^\*\*Sessie counter:" .claude/CLAUDE.md

# Verify current state is drift-free BEFORE we start
bash scripts/validate-docs.sh
```

**Decision points before Step 2:**
- If validate-docs.sh exit ≠ 0: STOP. Fix existing drift first (the sessie introduced drift somewhere).
- Determine sessie number: usually previous+1, but ask user if uncertain (extended-sessie vs new-sessie).

## Step 2: Update `TASKS.md` (primary execution-tracker)

- **Header**: `**Laatst bijgewerkt:** [DATUM] (Sessie [N])` + `**Sprint:** Sessie [N]: [korte beschrijving]`
- **Voortgang Overzicht** table: percentage update bij task completion
- **Huidige Focus** sectie: vervang oude bundle/test metrics met ground-truth getallen uit Step 1
- **Volgende Stappen** lijst: voeg deze sessie's voltooide werk toe als `[x]`, nieuwe open taken als `[ ]`
- **Mijlpaal-secties** (M5/M5.5/M6/M7/etc): mark sub-tasks as completed
- **Footer**: `**Laatst bijgewerkt:** [DATUM] (Sessie [N])` + version bump
- Belangrijk: gebruik dezelfde sessie-nummer in header EN footer (validate-docs Check 2)

## Step 3: Update `docs/sessions/current.md`

Add new entry for Sessie [N] with full detail:
- **Mission** (1-2 sentences)
- **Work done** (bulleted: files touched, key implementation choices)
- **Commits** (hash + message)
- **Learnings** (full reasoning, including dead-ends and surprises)
- **Next steps** (open items that didn't fit this sessie)
- **Metrics delta** (bundle KB before/after, test count change, etc.)

### Rotatie (bij `N % 5 == 0`)

**De regel staat in [`docs/sessions/README.md`](../../docs/sessions/README.md) §Rotatie-regel —
lees hem daar en reken hier niets uit.** Hier stond tot Sessie 230 *"archiveer [N-10 .. N-6]"*,
en die formule gaf twee keer aantoonbaar de verkeerde actie:

| | formule zei | README-regel gaf | wat de formule had aangericht |
|---|---|---|---|
| Sessie 215 (de notitie stond toen in `CLAUDE.md`) | 205-209 | 200-204 | 200-204 blijft als **ouder** blok staan |
| Sessie 230 (de notitie stond toen hier) | 220-224 | 215-219 | 215-219 blijft staan + **gat** in de archiefreeks |

De correctie is bij Sessie 215 al vastgelegd in `SESSIONS.md` en overleefde tóch in dit document —
de fout verhuisde mee in plaats van te verdwijnen. Dáárom staat hier nu geen rekensom meer maar
een verwijzing: twee formuleringen van dezelfde regel is er één te veel, en de kopie is degene
die verjaart.

**Volg alle vijf de stappen van de README-regel, ook de saaie.** Bij Sessie 225 is stap 4 (de
index in `SESSIONS.md`) overgeslagen; de index claimde daarna tien sessies lang het verkeerde
window en miste het archief dat diezelfde sessie had aangemaakt. Zo'n overslag meldt zichzelf
niet — `validate-docs.sh` kijkt niet naar `SESSIONS.md`.

## Step 4: Learnings routeren + `.claude/CLAUDE.md` bijwerken

CLAUDE.md is de **altijd-geladen laag**: elke regel kost context in élke sessie, ook in sessies
waar hij niet over gaat. Anthropics richtlijn is <200 regels; hier bewaakt `validate-docs.sh`
Check 18 een harde grens van 150.

Tot Sessie 228 schreef deze stap voor om elke sessie een narratieve entry van 5-8 bullets te
**prependen** in §Recent Critical Learnings. Dat blok groeide daardoor naar 134 van de 320 regels
— en stond woordelijk óók al in `architecture-patterns.md` én `current.md`. De les over guards
gold hier op zichzelf: Check 8 bewaakte twee losse regels, dus het bestand kon van 12 KB naar
43 KB groeien zonder dat er iets rood werd.

**Routeer elke learning naar de goedkoopste laag die hem kan dragen:**

| soort learning | bestemming | laadt |
|---|---|---|
| Narratief, casuïstiek, dead-ends, metingen | `docs/sessions/current.md` (Step 3) | alleen bij lezen |
| Herbruikbaar patroon met code | de bijpassende rule in `.claude/rules/` | bij matchende bestanden |
| Écht sessie-overstijgende invariant | §Harde invarianten in CLAUDE.md | altijd |

De rules zijn gescopet op `paths:` — kies op wát de learning raakt:
`css-layout.md` (styles, html) · `js-runtime.md` (src) · `meten-en-guards.md` (tests, scripts) ·
`caching-deploy.md` (_headers, netlify.toml) · `command-output.md` (src/commands).
Bestaat er geen passende rule, maak er dan één mét `paths:`-frontmatter — Check 18c weigert een
nieuwe rule zonder scope, want die zou stilzwijgend in elke sessie meeladen.

**De lat voor §Harde invarianten is hoog.** Alleen als de regel in méérdere domeinen geldt en
niet aan een bestandstype te koppelen is. Max 10 regels, **1-in-1-out**: nieuwe erbij = zwakste
eruit. Eén regel, geen sessienummer, geen datum. Check 18d weigert `### Sessie NNN`-koppen in
CLAUDE.md — het rotatieritueel is daarmee structureel overbodig in plaats van handmatig.

**Verder in CLAUDE.md:**
- **Sessie counter:** [N] (in §Sessie Protocol)
- **Footer**: `**Last updated:** [DATUM] (Sessie [N] — [short tag])` + `**Version:** [bumped]`.
  Beide VERVANGEN, niet appenden. Hard limit ≤500 bytes per regel (Check 8).
- **Geen tellingen** (KB, specs, commands, blogposts) — die wonen in TASKS.md.

Sluit deze stap af met `bash scripts/validate-docs.sh --deep` → exit 0.

## Step 5: `PLANNING.md` — sessie-marker ALTIJD, inhoud alleen bij architectuur-wijziging

Twee verschillende dingen, en ze hebben verschillende voorwaarden. Tot Sessie 229 stond hier
"ALLEEN bij architectuur-wijziging" plus *"**Als** je PLANNING.md updatet: ook header + footer
synchroniseren"* — die conditionele formulering klopt niet met de guards en levert elke sessie
zonder architectuurwijziging twee falers op.

**(a) De sessie-marker: onvoorwaardelijk.** Bump de header (eerste 10 regels) én de footer
(laatste 30 regels) naar de nieuwe sessie, óók als er inhoudelijk niets verandert:

```
**Laatst bijgewerkt:** [DATUM] (Sessie [N] — [korte reden, of expliciet "geen architectuurwijziging, wél …"])
```

Wat de guards feitelijk eisen — gelezen in `scripts/validate-docs.sh`, niet aangenomen:

| check | eis |
|---|---|
| Check 1 | `Sessie N` (N = de counter uit CLAUDE.md) staat **ergens** in TASKS.md **én** PLANNING.md |
| Check 2 | binnen CLAUDE.md, PLANNING.md én TASKS.md dragen **eerste 10** en **laatste 30** regels dezelfde N |
| Check 2 | herkent alleen `Laatst bijgewerkt` / `Last updated` / `laatste`, met `Sessie N` binnen 80 tekens |
| Check 7 | vergelijkt **alleen** CLAUDE.md `**Version:**` ↔ TASKS.md `**Versie:**` — PLANNING.md's `**Versie:**` doet hier niet mee |

Die laatste rij betekent: PLANNING.md's eigen `**Versie:**` bumpen is **optioneel**. Doe het als
er inhoudelijk iets verandert; laat het staan bij een pure marker-bump.

Precedent voor de formulering bij een niet-architectuursessie: Sessie 228 en 229 openen hun
PLANNING-entry met *"geen architectuurwijziging, wél …"* — dat houdt de marker eerlijk zonder te
suggereren dat de architectuur schoof.

**(b) De inhoud: alleen bij een echte architectuur-wijziging.**

Wel: nieuwe tech-stack-keuze, design-system-change (óók een sitebrede default zoals typografie),
security-strategie-shift, performance-budget-aanpassing, deployment-shift,
monetization-architectuur-change.

Niet: milestone-percentages, bundle-KB, sprint-status, task-niveau — die wonen in TASKS.md.

## Step 6: Update `docs/prd.md` ALLEEN bij scope-wijziging

Wel updaten bij: nieuwe functional requirements, success criteria change, new milestone added to scope, MVP-vs-Post-MVP grens verschuift.

NIET updaten bij: tactical execution, implementatie-details, sessie-tracking.

## Step 7: Validatie (forcing function)

```bash
bash scripts/validate-docs.sh
```

Vereist exit code 0. Bij FAIL:
- Lees output zorgvuldig — wijst exact aan welke invariant brak
- Quickfix: sync sessie-counter / datum / monetization-keyword / PRD-version
- Re-run tot exit 0
- Pre-commit hook draait dit automatisch bij `git commit` — een gefaalde validate-docs blokkeert de commit

---

## Goal

Context carry-over tussen sessies ZONDER bloating, met TASKS.md als single source of truth voor execution-state en forcing function tegen drift.

**Document-ownership-map:** zie `PLANNING.md §Document Ownership`
**Protocol-context:** zie `.claude/CLAUDE.md §Sessie Protocol`
