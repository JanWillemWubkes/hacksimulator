#!/bin/bash
# Doc Validation Script (Sessie 140 — drift-detection forcing function)
#
# Validates cross-document invariants between the four core docs:
#   1. CLAUDE.md sessie-counter == TASKS.md sprint-regel sessie
#   2. Header canonical sessie-marker == footer canonical sessie-marker binnen elke doc
#      (Sessie 140 refinement: regex zoekt alleen canonieke markers — "Laatst bijgewerkt"
#      / "Last updated" / "laatste" — om random "Sessie N" mentions in body te skippen)
#   3. PRD-versie referentie identiek in CLAUDE.md en PLANNING.md
#   4. Monetization-stack keywords aanwezig in alle 3 docs (AdSense, Ko-fi, Brevo, Gumroad, Lead magnet)
#
# Doel: voorkom doc-drift die in Sessie 139 zichtbaar werd
# (CLAUDE.md liep 14 sessies vooruit op PLANNING.md/TASKS.md).
#
# Usage:
#   ./scripts/validate-docs.sh           — Checks 1-4 (fast, pre-commit hook)
#   ./scripts/validate-docs.sh --deep    — Checks 1-7 (opt-in, end-of-sessie /summary gate)
# Exit code: 0 = all valid, 1 = drift detected
#
# Sessie 157: --deep mode toegevoegd voor soft-drift detectie (Sessie 140 TODO fulfilled).
#   - Check 5: Bundle KB ground-truth via VALIDATE-BUNDLE marker block in TASKS.md (±5% tol)
#   - Check 6: Milestone-percentage ground-truth via [x]/[ ] count per M6/M7/M8 section
#               (sections-loze milestones M0-M5/M5.5/M9/Blog: graceful [SKIP])
#   - Check 7: Cross-doc Versie consistency CLAUDE.md `**Version:**` ↔ TASKS.md `**Versie:**`
# Soft-drift = cijfers die langzaam verouderen zonder dat één invariant breekt.

set -o pipefail

# --deep flag parsing: opt-in soft-drift checks (5-7). Pre-commit hook blijft fast (default).
DEEP_MODE=0
for arg in "$@"; do
  if [ "$arg" = "--deep" ]; then
    DEEP_MODE=1
  fi
done

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CLAUDE=".claude/CLAUDE.md"
PLANNING="PLANNING.md"
TASKS="TASKS.md"

FAIL_COUNT=0
CHECK_COUNT=0

echo "=========================================="
echo "Doc Drift Validation (Sessie 139+)"
echo "=========================================="
echo ""

# Sanity: all three docs exist
for doc in "$CLAUDE" "$PLANNING" "$TASKS"; do
  if [ ! -f "$doc" ]; then
    echo -e "${RED}FATAL: $doc not found${NC}"
    echo "Run this script from project root: ./scripts/validate-docs.sh"
    exit 1
  fi
done

fail() {
  echo -e "  ${RED}[FAIL]${NC} $1"
  FAIL_COUNT=$((FAIL_COUNT + 1))
}

pass() {
  echo -e "  ${GREEN}[OK]${NC}   $1"
}

check_start() {
  CHECK_COUNT=$((CHECK_COUNT + 1))
  echo ""
  echo "Check $CHECK_COUNT: $1"
}

# ============================================================
# Check 1: Sessie-counter alignment across all 3 docs
# ============================================================
check_start "Sessie-counter alignment"

CLAUDE_SESSIE=$(grep -oE '^\*\*Sessie counter:\*\* [0-9]+' "$CLAUDE" | grep -oE '[0-9]+' | head -1)

if [ -z "$CLAUDE_SESSIE" ]; then
  fail "Sessie counter regel niet gevonden in $CLAUDE (verwacht: '**Sessie counter:** N')"
else
  pass "CLAUDE.md sessie-counter: $CLAUDE_SESSIE"

  if ! grep -qE "Sessie $CLAUDE_SESSIE([^0-9]|$)" "$TASKS"; then
    fail "TASKS.md bevat geen referentie naar 'Sessie $CLAUDE_SESSIE' (CLAUDE.md sessie-counter)"
  else
    pass "TASKS.md refereert aan Sessie $CLAUDE_SESSIE"
  fi

  if ! grep -qE "Sessie $CLAUDE_SESSIE([^0-9]|$)" "$PLANNING"; then
    fail "PLANNING.md bevat geen referentie naar 'Sessie $CLAUDE_SESSIE' (CLAUDE.md sessie-counter)"
  else
    pass "PLANNING.md refereert aan Sessie $CLAUDE_SESSIE"
  fi
fi

# ============================================================
# Check 2: Header vs footer datum-sessie binnen elke doc
# ============================================================
check_start "Header/footer sessie-consistency per doc"

check_doc_internal() {
  local doc=$1
  local name=$2

  # Extract canonical sessie-marker. Accepted patterns:
  #   - "Laatst bijgewerkt:** ... (Sessie N)" (TASKS.md, PLANNING.md headers/footers)
  #   - "Last updated:** ... (Sessie N)" (CLAUDE.md footer)
  #   - "Status:** ... (laatste: Sessie N)" (CLAUDE.md header)
  # Negeert random mentions in body/comments (Sessie 144 trigger, Sessie 200 test-context).
  local header_sessie
  local footer_sessie
  local canon_pattern='(Laatst bijgewerkt|Last updated|laatste).{0,80}Sessie [0-9]+'
  header_sessie=$(head -10 "$doc" | grep -oE "$canon_pattern" | grep -oE 'Sessie [0-9]+' | grep -oE '[0-9]+' | head -1)
  footer_sessie=$(tail -30 "$doc" | grep -oE "$canon_pattern" | grep -oE 'Sessie [0-9]+' | grep -oE '[0-9]+' | head -1)

  if [ -z "$header_sessie" ]; then
    fail "$name: geen canonieke sessie-marker in header (Laatst bijgewerkt / Last updated / laatste:Sessie N — eerste 10 regels)"
    return
  fi

  if [ -z "$footer_sessie" ]; then
    fail "$name: geen canonieke sessie-marker in footer (Laatst bijgewerkt / Last updated / laatste:Sessie N — laatste 30 regels)"
    return
  fi

  if [ "$header_sessie" != "$footer_sessie" ]; then
    fail "$name: header-sessie ($header_sessie) ≠ footer-sessie ($footer_sessie) — datum-drift"
  else
    pass "$name: header & footer beide refereren aan Sessie $header_sessie"
  fi
}

check_doc_internal "$CLAUDE" "CLAUDE.md"
check_doc_internal "$PLANNING" "PLANNING.md"
check_doc_internal "$TASKS" "TASKS.md"

# ============================================================
# Check 3: PRD-version referentie consistency
# ============================================================
check_start "PRD-version referentie consistency"

CLAUDE_PRD=$(grep -ioE '(prd\.md|PRD|Product Requirements)[^[:alnum:]]+v[0-9]+\.[0-9]+' "$CLAUDE" | grep -oE 'v[0-9]+\.[0-9]+' | sort -u | head -1)
PLANNING_PRD=$(grep -ioE '(prd\.md|PRD|Product Requirements)[^[:alnum:]]+v[0-9]+\.[0-9]+' "$PLANNING" | grep -oE 'v[0-9]+\.[0-9]+' | sort -u | head -1)

if [ -z "$CLAUDE_PRD" ]; then
  fail "CLAUDE.md: geen PRD-versie referentie gevonden"
elif [ -z "$PLANNING_PRD" ]; then
  fail "PLANNING.md: geen PRD-versie referentie gevonden"
elif [ "$CLAUDE_PRD" != "$PLANNING_PRD" ]; then
  fail "PRD-versie mismatch: CLAUDE.md zegt $CLAUDE_PRD, PLANNING.md zegt $PLANNING_PRD"
else
  pass "CLAUDE.md + PLANNING.md beide refereren aan PRD $CLAUDE_PRD"
fi

# ============================================================
# Check 4: Monetization-stack keywords across all 3 docs
# ============================================================
check_start "Monetization-stack keyword coverage"

# Keyword + acceptable variant patterns
declare -A KEYWORDS=(
  ["AdSense"]="AdSense"
  ["Ko-fi"]="Ko-fi"
  ["Brevo"]="Brevo"
  ["Gumroad"]="Gumroad"
  ["Lead magnet"]="[Ll]ead.[mM]agnet|sample-pentest|Sample Pentest"
)

check_keyword_in_doc() {
  local keyword=$1
  local pattern=$2
  local doc=$3
  local name=$4

  if ! grep -qE "$pattern" "$doc"; then
    fail "$name: monetization-keyword '$keyword' ontbreekt"
    return 1
  fi
  return 0
}

for keyword in "${!KEYWORDS[@]}"; do
  pattern="${KEYWORDS[$keyword]}"
  all_present=0

  check_keyword_in_doc "$keyword" "$pattern" "$CLAUDE" "CLAUDE.md" || all_present=1
  check_keyword_in_doc "$keyword" "$pattern" "$PLANNING" "PLANNING.md" || all_present=1
  check_keyword_in_doc "$keyword" "$pattern" "$TASKS" "TASKS.md" || all_present=1

  if [ $all_present -eq 0 ]; then
    pass "'$keyword' aanwezig in alle 3 docs"
  fi
done

# ============================================================
# --deep mode: soft-drift checks (Sessie 157)
# ============================================================
if [ "$DEEP_MODE" = "1" ]; then

  # ----------------------------------------------------------
  # Check 5: Bundle KB ground-truth (±5% tolerance)
  # ----------------------------------------------------------
  check_start "Bundle KB ground-truth (--deep, ±5% tolerance)"

  MARKER_LINE=$(grep -A2 'VALIDATE-BUNDLE-START' "$TASKS" | grep -oE 'src=[0-9]+ styles=[0-9]+ blog=[0-9]+ assets=[0-9]+' | head -1)

  if [ -z "$MARKER_LINE" ]; then
    fail "TASKS.md mist VALIDATE-BUNDLE marker block (verwacht: '<!-- src=N styles=N blog=N assets=N -->' tussen VALIDATE-BUNDLE-START/END HTML comments in §Huidige Focus)"
  else
    for dir in src styles blog assets; do
      target=$(echo "$MARKER_LINE" | grep -oE "${dir}=[0-9]+" | grep -oE '[0-9]+')
      if [ ! -d "${dir}/" ]; then
        fail "Bundle ${dir}/: directory niet gevonden (skip measurement)"
        continue
      fi
      measured_bytes=$(du -sb "${dir}/" | cut -f1)
      measured_kb=$((measured_bytes / 1024))
      # Pure-bash integer arithmetic (locale-onafhankelijk; awk printf gaf nl_NL komma's
      # die volgende awk calls deden syntax-failen — Sessie 157 leerpunt).
      # drift_x10 = drift% × 10 voor 1 decimal precision zonder floats.
      delta=$((measured_kb - target))
      abs_delta=$(( delta < 0 ? -delta : delta ))
      abs_pct_x10=$(( abs_delta * 1000 / target ))
      sign=""
      if [ "$delta" -lt 0 ]; then sign="-"; fi
      drift_int=$((abs_pct_x10 / 10))
      drift_frac=$((abs_pct_x10 % 10))
      if [ "$abs_pct_x10" -gt 50 ]; then
        fail "Bundle ${dir}/ drift buiten ±5%: target=${target} KB vs measured=${measured_kb} KB = ${sign}${drift_int}.${drift_frac}%"
      else
        pass "Bundle ${dir}/: target=${target} KB / measured=${measured_kb} KB / drift=${sign}${drift_int}.${drift_frac}%"
      fi
    done
  fi

  # ----------------------------------------------------------
  # Check 6: Milestone-percentage ground-truth (M6/M7/M8 sections)
  # ----------------------------------------------------------
  check_start "Milestone-percentage ground-truth (--deep)"

  # Section-range mapping: alleen milestones met dynamische TASKS.md section.
  # M0-M5/M5.5/M9/Blog: historisch of section-loos → graceful [SKIP].
  # Bekend-fragile: awk range gebruikt emoji-anchored headers. Als emoji wijzigt → update hier.
  declare -A MILESTONE_RANGES
  MILESTONE_RANGES[M6]='/^## 🎓 M6:/,/^## 🎮 M7:/'
  MILESTONE_RANGES[M7]='/^## 🎮 M7:/,/^## 📊 M8:/'
  MILESTONE_RANGES[M8]='/^## 📊 M8:/,/^## 📚 Referenties/'

  for mkey in M6 M7 M8; do
    range="${MILESTONE_RANGES[$mkey]}"
    done_count=$(awk "$range" "$TASKS" | grep -c '^- \[x\]' || true)
    todo_count=$(awk "$range" "$TASKS" | grep -c '^- \[ \]' || true)
    total=$((done_count + todo_count))

    if [ "$total" -eq 0 ]; then
      fail "$mkey: section range gevonden maar [x]+[ ] count = 0 (mogelijk verkeerde range-marker — emoji wijziging?)"
      continue
    fi

    expected_pct=$((100 * done_count / total))
    expected_taken="${done_count}/${total}"

    table_row=$(grep -E "^\| ${mkey}:" "$TASKS" | head -1)
    if [ -z "$table_row" ]; then
      fail "$mkey: geen Voortgang Overzicht tabel-rij gevonden (verwacht '| $mkey: ...')"
      continue
    fi

    claimed_taken=$(echo "$table_row" | grep -oE '\| [0-9~]+/[0-9~]+' | head -1 | tr -d '| ')
    claimed_pct=$(echo "$table_row" | grep -oE '\| [0-9~]+%' | head -1 | tr -d '| %')

    if [ "$claimed_taken" != "$expected_taken" ]; then
      fail "$mkey: tabel-taken='$claimed_taken' ≠ section ground-truth='$expected_taken' ([x]+[ ] count)"
    else
      pass "$mkey: tabel-taken match section ($expected_taken)"
    fi

    if [ "$claimed_pct" != "$expected_pct" ]; then
      fail "$mkey: tabel-pct='${claimed_pct}%' ≠ section ground-truth='${expected_pct}%'"
    else
      pass "$mkey: tabel-pct match section (${expected_pct}%)"
    fi
  done

  echo -e "  ${YELLOW}[SKIP]${NC} M0-M5/M5.5/M9/Blog: geen TASKS.md section voor checklist ground-truth (historisch of section-loos)"

  # ----------------------------------------------------------
  # Check 7: Cross-doc Versie consistency (CLAUDE.md ↔ TASKS.md)
  # ----------------------------------------------------------
  check_start "Cross-doc Versie consistency (--deep)"

  CLAUDE_VERSION=$(grep -oE '^\*\*Version:\*\* [0-9]+\.[0-9]+' "$CLAUDE" | grep -oE '[0-9]+\.[0-9]+' | head -1)
  TASKS_VERSIE=$(grep -oE '^\*\*Versie:\*\* [0-9]+\.[0-9]+' "$TASKS" | grep -oE '[0-9]+\.[0-9]+' | head -1)

  if [ -z "$CLAUDE_VERSION" ]; then
    fail "CLAUDE.md: geen canonieke '**Version:** N.M' regel gevonden (verwacht start-of-line bold marker)"
  elif [ -z "$TASKS_VERSIE" ]; then
    fail "TASKS.md: geen canonieke '**Versie:** N.M' regel gevonden (verwacht start-of-line bold marker)"
  elif [ "$CLAUDE_VERSION" != "$TASKS_VERSIE" ]; then
    fail "Versie cross-doc mismatch: CLAUDE.md=$CLAUDE_VERSION vs TASKS.md=$TASKS_VERSIE"
  else
    pass "CLAUDE.md + TASKS.md beide refereren aan Versie $CLAUDE_VERSION"
  fi

fi  # end of --deep block

# ============================================================
# Summary
# ============================================================
echo ""
echo "=========================================="
if [ "$DEEP_MODE" = "1" ]; then
  echo "Summary (--deep mode: Checks 1-7)"
else
  echo "Summary (fast mode: Checks 1-4 — run with --deep for soft-drift Checks 5-7)"
fi
echo "=========================================="
echo "Total checks run: $CHECK_COUNT"
if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}All checks passed.${NC}"
  exit 0
else
  echo -e "${RED}$FAIL_COUNT failure(s) detected.${NC}"
  echo ""
  echo "Doc-drift gedetecteerd. Zie failures hierboven."
  if [ "$DEEP_MODE" = "1" ]; then
    echo "Quickfix: synchroniseer sessie-counter / datums / monetization-keywords / bundle KB marker / milestone-tabel / Versie."
  else
    echo "Quickfix: synchroniseer sessie-counter, datums, of monetization-keywords."
  fi
  echo "Volledige protocol: PLANNING.md §Document Ownership + .claude/CLAUDE.md §Sessie Protocol"
  exit 1
fi
