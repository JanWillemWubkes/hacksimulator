#!/bin/bash
# Blog GDPR Compliance Validation Script (M5.5)
#
# Validates that all blog files have required cookie consent elements:
# 1. consent-banner.js script tag
# 2. consent.js script tag
# 3. tracker.js script tag
# 4. events.js script tag
# 5. cookie-settings footer link
#
# Usage: ./scripts/validate-blogs.sh
# Exit code: 0 = all valid, 1 = validation failures found

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_FILES=0
VALID_FILES=0
INVALID_FILES=0

echo "=========================================="
echo "Blog GDPR Compliance Validation"
echo "=========================================="
echo ""

# Check if blog directory exists
if [ ! -d "blog" ]; then
  echo -e "${RED}❌ Error: blog/ directory not found${NC}"
  echo "Run this script from project root: ./scripts/validate-blogs.sh"
  exit 1
fi

# Function to validate a single blog file
validate_blog() {
  local file=$1
  local filename=$(basename "$file")
  local errors=0

  echo "Checking: $filename"

  # Check 1: consent-banner.js script tag
  if ! grep -q 'src="../src/analytics/consent-banner.js"' "$file"; then
    echo -e "  ${RED}❌ Missing: consent-banner.js script tag${NC}"
    ((errors++))
  fi

  # Check 2: consent.js script tag
  if ! grep -q 'src="../src/analytics/consent.js"' "$file"; then
    echo -e "  ${RED}❌ Missing: consent.js script tag${NC}"
    ((errors++))
  fi

  # Check 3: tracker.js script tag
  if ! grep -q 'src="../src/analytics/tracker.js"' "$file"; then
    echo -e "  ${RED}❌ Missing: tracker.js script tag${NC}"
    ((errors++))
  fi

  # Check 4: events.js script tag
  if ! grep -q 'src="../src/analytics/events.js"' "$file"; then
    echo -e "  ${RED}❌ Missing: events.js script tag${NC}"
    ((errors++))
  fi

  # Check 5: cookie-settings footer link
  if ! grep -q 'id="cookie-settings"' "$file"; then
    echo -e "  ${RED}❌ Missing: cookie-settings footer link (id='cookie-settings')${NC}"
    ((errors++))
  fi

  # Bonus: Check for type="module" attribute on scripts
  if ! grep -q 'type="module"' "$file"; then
    echo -e "  ${YELLOW}⚠️  Warning: No type='module' found (should be on consent scripts)${NC}"
  fi

  # Report results for this file
  if [ $errors -eq 0 ]; then
    echo -e "  ${GREEN}✓ Valid (all 5 elements present)${NC}"
    ((VALID_FILES++))
  else
    echo -e "  ${RED}✗ Invalid ($errors missing elements)${NC}"
    ((INVALID_FILES++))
  fi

  echo ""
  ((TOTAL_FILES++))
}

# Find all HTML files in blog/ directory
echo "Scanning blog/*.html files..."
echo ""

for file in blog/*.html; do
  if [ -f "$file" ]; then
    validate_blog "$file"
  fi
done

# Summary report
echo "=========================================="
echo "Validation Summary"
echo "=========================================="
echo -e "Total files checked: $TOTAL_FILES"
echo -e "${GREEN}Valid files: $VALID_FILES${NC}"
if [ $INVALID_FILES -gt 0 ]; then
  echo -e "${RED}Invalid files: $INVALID_FILES${NC}"
else
  echo -e "Invalid files: 0"
fi
echo ""

# Exit with appropriate code
if [ $INVALID_FILES -eq 0 ]; then
  echo -e "${GREEN}✅ All blog files are GDPR compliant!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some blog files are missing required consent elements.${NC}"
  echo "See errors above. Refer to docs/blog-template.md for implementation guide."
  exit 1
fi
