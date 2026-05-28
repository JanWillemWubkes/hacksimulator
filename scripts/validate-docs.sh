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
# Usage: ./scripts/validate-docs.sh
# Exit code: 0 = all valid, 1 = drift detected
#
# TODO Sessie 144: voeg --deep mode toe voor soft-drift detectie
#   - Check 5: Bundle KB ground-truth — vergelijk `du -sb src/ styles/ blog/ assets/`
#     output met cijfers in TASKS.md §Huidige Focus (tolerance ±5%)
#   - Check 6: Milestone-percentage ground-truth — raw `[x]`/`[ ]` count per
#     mijlpaal-sectie vs claimed percentage in Voortgang Overzicht tabel
#   Trigger: Sessie 144 rotation (zie TASKS.md Volgende Stappen #23). ~20 min werk.
#   Soft-drift = cijfers die langzaam verouderen zonder dat één invariant breekt.

set -o pipefail

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
# Summary
# ============================================================
echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo "Total checks run: $CHECK_COUNT"
if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}All checks passed.${NC}"
  exit 0
else
  echo -e "${RED}$FAIL_COUNT failure(s) detected.${NC}"
  echo ""
  echo "Doc-drift gedetecteerd. Zie failures hierboven."
  echo "Quickfix: synchroniseer sessie-counter, datums, of monetization-keywords."
  echo "Volledige protocol: PLANNING.md §Document Ownership + .claude/CLAUDE.md §Sessie Protocol"
  exit 1
fi
