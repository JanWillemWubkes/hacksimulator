#!/bin/bash
# Blog Validation Script (Sessie 138 modernization)
#
# Validates that all blog HTML files meet structural standards:
#   1. init-analytics.js script tag aanwezig (Sessie 131 pattern)
#   2. JSON-LD schema in <head> (SEO requirement)
#   3. HTML tag-balans: <div> count == </div> count (Sessie 138-learning)
#   4. Breadcrumb <nav class="breadcrumb"> aanwezig (Sessie 139 unified nav)
#   5. BreadcrumbList JSON-LD aanwezig (Sessie 139 SEO rich-results)
#   6. twitter:title + twitter:description aanwezig (og<->twitter card-pariteit, SEO)
# Checks 4+5 worden geskipped voor blog/index.html (hub-pagina, geen breadcrumb nodig).
# Check 6 geldt voor alle posts incl. index (elke pagina heeft een social-preview).
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

  # Checks 4+5: breadcrumb + BreadcrumbList JSON-LD (Sessie 139)
  # Skip voor blog/index.html — hub-pagina, geen breadcrumb nodig.
  if [ "$filename" != "index.html" ]; then
    # Check 4: <nav class="breadcrumb"> aanwezig
    if ! grep -q 'class="breadcrumb"' "$file"; then
      issues+="    [FAIL] MISSING: breadcrumb nav (<nav class=\"breadcrumb\">)\n"
      errors=$((errors + 1))
    fi

    # Check 5: BreadcrumbList JSON-LD aanwezig
    if ! grep -q '"@type": "BreadcrumbList"' "$file"; then
      issues+="    [FAIL] MISSING: BreadcrumbList JSON-LD schema\n"
      errors=$((errors + 1))
    fi
  fi

  # Check 6: og <-> twitter card-pariteit (SEO — expliciete social-preview titel/omschrijving)
  # twitter:card + twitter:image alleen laat title/desc terugvallen op og; expliciet is beter.
  # Bron = dezelfde string als og:title/og:description (titel-lockstep, blog-post skill).
  if ! grep -q 'name="twitter:title"' "$file"; then
    issues+="    [FAIL] MISSING: twitter:title (spiegel van og:title — zie blog-post skill lockstep)\n"
    errors=$((errors + 1))
  fi
  if ! grep -q 'name="twitter:description"' "$file"; then
    issues+="    [FAIL] MISSING: twitter:description (spiegel van og:description)\n"
    errors=$((errors + 1))
  fi

  # Check 7: zichtbare AI-melding + verificatiedatum (Sessie 208, uitgebreid Sessie 223)
  # De lezer kan niet zelf beoordelen of de inhoud klopt. Twee dingen bieden we wel:
  # WANNEER de beweringen voor het laatst zijn nagelopen, en WAARMEE dat gebeurde.
  #
  # Dat tweede is niet vrijblijvend. Art. 50 lid 4 AI-verordening (van toepassing sinds
  # 02-08-2026) eist dat AI-gegenereerde tekst die het publiek informeert over
  # aangelegenheden van algemeen belang als zodanig wordt aangemerkt, "uiterlijk bij de
  # eerste blootstelling". Er is een uitzondering voor inhoud die een mens inhoudelijk
  # heeft getoetst (feitencontrole is daarbij het minimumvereiste) — die uitzondering
  # geldt hier NIET: de controle gebeurt met AI, niet door een mens. Een melding op
  # /over-ons.html alleen is dus onvoldoende; wie via Google op een post landt, moet het
  # dáár zien.
  #
  # De assertie is POSITIEF (de melding moet er staan), niet negatief (de oude tekst
  # verbieden). Een verbod op één formulering laat elke andere formulering door — de val
  # van Sessie 221 checkpunt 14a.
  # Skip blog/index.html: de hub bevat geen eigen beweringen.
  if [ "$(basename "$file")" != "index.html" ]; then
    if ! grep -q 'class="blog-ai-notice"' "$file"; then
      issues+="    [FAIL] MISSING: <span class=\"blog-ai-notice\"> met AI-melding + controledatum in .blog-post-meta\n"
      errors=$((errors + 1))
    else
      if ! grep -qE 'blog-ai-notice[^>]*>[^<]*<time datetime="[0-9]{4}-[0-9]{2}-[0-9]{2}">' "$file"; then
        issues+="    [FAIL] blog-ai-notice zonder geldige <time datetime=\"JJJJ-MM-DD\">\n"
        errors=$((errors + 1))
      fi
      if ! grep -q 'Met AI geschreven' "$file"; then
        issues+="    [FAIL] blog-ai-notice zonder zichtbare AI-melding (art. 50 lid 4 AI-verordening)\n"
        errors=$((errors + 1))
      fi
    fi
  fi

  # Check 8: elke h2/h3 in .blog-post-content heeft een id (Sessie 226)
  # Zonder id is er geen deeplink en kan src/ui/blog-toc.js geen inhoudsopgave bouwen.
  # Tot Sessie 226 had 0 van de 418 koppen er een; artikelen lopen tot ~17.800px op 375px.
  # De id's worden gezet door `node scripts/add-heading-ids.mjs` — die is idempotent.
  #
  # Zelfbewakende tak: als er NUL koppen gevonden worden klopt de zoekterm niet meer, en dan
  # moet de check falen in plaats van stil groen blijven (de val uit Sessie 223 Check 16).
  if [ "$(basename "$file")" != "index.html" ]; then
    body=$(sed -n '/<div class="blog-post-content">/,/<section class="related-articles">/p' "$file")
    koppen=$(printf '%s' "$body" | grep -cE '<h[23][ >]' || true)
    zonder_id=$(printf '%s' "$body" | grep -oE '<h[23][^>]*>' | grep -cve 'id=' || true)
    if [ "$koppen" -eq 0 ]; then
      issues+="    [FAIL] Check 8 vond NUL h2/h3 in .blog-post-content — zoekterm verouderd?\n"
      errors=$((errors + 1))
    elif [ "$zonder_id" -gt 0 ]; then
      issues+="    [FAIL] $zonder_id van $koppen koppen zonder id — draai: node scripts/add-heading-ids.mjs\n"
      errors=$((errors + 1))
    fi
  fi

  # Check 9: geen Engelse aria-labels op een lang="nl"-pagina (Sessie 226)
  # Stonden er 31 (15x "Reading progress", 15x "Breadcrumb", 1x "Filter posts by category").
  # Een schermlezer in NL-modus spreekt die uit met Nederlandse fonologie.
  engels=$(grep -oE 'aria-label="[^"]*"' "$file" \
    | grep -icE 'aria-label="(Reading|Breadcrumb|Filter posts|Search|Close|Menu|Next|Previous)' || true)
  if [ "$engels" -gt 0 ]; then
    issues+="    [FAIL] $engels Engelse aria-label(s) op een Nederlandse pagina\n"
    errors=$((errors + 1))
  fi

  # Check 10: geen role="progressbar" zonder aria-valuenow (Sessie 226)
  # Een progressbar zonder waarde is een kapot aangegeven widget: de schermlezer meldt
  # "voortgangsbalk" en kan geen stand noemen. De leesvoortgangsbalk is decoratief en
  # hoort daarom aria-hidden="true" te zijn, zonder role.
  if grep -q 'role="progressbar"' "$file" && ! grep -q 'aria-valuenow' "$file"; then
    issues+="    [FAIL] role=\"progressbar\" zonder aria-valuenow (maak hem aria-hidden of geef hem waarden)\n"
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
