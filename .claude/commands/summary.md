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

Rotation: if N % 5 == 0, archive sessies [N-10 .. N-6] from current.md to `archive-*.md`.

## Step 4: Update `.claude/CLAUDE.md` (AI-context, lean)

- **Sessie counter:** [N] (in §Sessie Protocol section)
- **Recent Critical Learnings**: prepend new sessie entry using this format:

```markdown
### Sessie [N]: [Topic] ([Datum])
⚠️ **Never:**
- Anti-pattern 1 — [why: concrete cost/incident from this sessie]
- Anti-pattern 2 — [why]
- Anti-pattern 3 — [why]

✅ **Always:**
- Best practice 1 — [why: validated benefit from this sessie]
- Best practice 2 — [why]
- Best practice 3 — [why]
- Best practice 4 — [why]
```

- **Rotation**: keep top-6 learnings full, ouderen → `docs/sessions/current.md` already has them
- **Footer**: `**Last updated:** [DATUM] (Sessie [N] — [short tag])` + `**Version:** [bumped]`
- **Live metrics block in Quick Reference**: NIET updaten met concrete cijfers — verwijs naar TASKS.md

**Guidelines for learnings format:**
- Focus on actionable anti-patterns and best practices
- Keep CLAUDE.md entry to 5-8 bullets per sessie
- Include the *why* (concrete reasoning) — these enable judgment calls in edge cases
- NO commit details (those go in `docs/sessions/current.md`)

## Step 5: Update `PLANNING.md` ALLEEN bij architectuur-wijziging

Wel updaten bij: nieuwe tech-stack-keuze, design-system-change, security-strategie-shift, performance-budget-aanpassing, deployment-shift, monetization-architectuur-change.

NIET updaten bij: milestone-percentage updates, bundle KB cijfers, sprint-status, task-niveau wijzigingen — die wonen in TASKS.md.

Als je PLANNING.md updatet: ook header + footer sessie-nummer synchroniseren (validate-docs Check 2).

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
