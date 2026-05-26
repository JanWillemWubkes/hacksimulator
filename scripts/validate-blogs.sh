#!/bin/bash
# Blog Validation Script (Sessie 138 modernization)
#
# Validates that all blog HTML files meet structural standards:
#   1. init-analytics.js script tag aanwezig (Sessie 131 pattern)
#   2. JSON-LD schema in <head> (SEO requirement)
#   3. HTML tag-balans: <div> count == </div> count (Sessie 138-learning)
#
# Replaces pre-Sessie-131 GDPR-script-checks (4 aparte consent-scripts
# vervangen door 1 gebundelde init-analytics.js).
#
# Usage: ./scripts/validate-blogs.sh
# Exit code: 0 = all valid, 1 = validation failures found

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counters
TOTAL_FILES=0
VALID_FILES=0
INVALID_FILES=0

echo "=========================================="
echo "Blog Validation"
echo "=========================================="
echo ""

if [ ! -d "blog" ]; then
  echo -e "${RED}Error: blog/ directory not found${NC}"
  echo "Run this script from project root: ./scripts/validate-blogs.sh"
  exit 1
fi

validate_blog() {
  local file=$1
  local filename=$(basename "$file")
  local errors=0
  local issues=""

  # Check 1: init-analytics.js script tag (Sessie 131 pattern)
  if ! grep -q 'init-analytics.js' "$file"; then
    issues+="    [FAIL] MISSING: init-analytics.js script tag\n"
    errors=$((errors + 1))
  fi

  # Check 2: JSON-LD schema in <head>
  if ! grep -q 'application/ld+json' "$file"; then
    issues+="    [FAIL] MISSING: JSON-LD schema (<script type=\"application/ld+json\">)\n"
    errors=$((errors + 1))
  fi

  # Check 3: HTML tag-balans (Sessie 138-learning)
  # Catches unclosed <div> elements that browsers render forgiving
  # but inherit styling (e.g. blog-tip class) over subsequent content.
  local open_count
  local close_count
  open_count=$(grep -o '<div' "$file" | wc -l)
  close_count=$(grep -o '</div>' "$file" | wc -l)
  if [ "$open_count" -ne "$close_count" ]; then
    local diff=$((open_count - close_count))
    issues+="    [FAIL] TAG-BALANS: <div>=$open_count, </div>=$close_count (diff=$diff)\n"
    errors=$((errors + 1))
  fi

  # Report per file
  if [ $errors -eq 0 ]; then
    printf "  %-42s ${GREEN}[OK]${NC}\n" "$filename"
    VALID_FILES=$((VALID_FILES + 1))
  else
    printf "  %-42s ${RED}[FAIL] (%d issue(s))${NC}\n" "$filename" "$errors"
    printf "%b" "$issues"
    INVALID_FILES=$((INVALID_FILES + 1))
  fi

  TOTAL_FILES=$((TOTAL_FILES + 1))
}

echo "Scanning blog/*.html..."
echo ""

for file in blog/*.html; do
  if [ -f "$file" ]; then
    validate_blog "$file"
  fi
done

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo "Total files checked: $TOTAL_FILES"
echo -e "${GREEN}Valid: $VALID_FILES${NC}"
if [ $INVALID_FILES -gt 0 ]; then
  echo -e "${RED}Invalid: $INVALID_FILES${NC}"
else
  echo "Invalid: 0"
fi
echo ""

if [ $INVALID_FILES -eq 0 ]; then
  echo -e "${GREEN}All blog files pass validation.${NC}"
  exit 0
else
  echo -e "${RED}Some blog files failed validation. See errors above.${NC}"
  exit 1
fi
