#!/bin/bash
# Doc Validation Script (Sessie 140 — drift-detection forcing function)
#
# Validates cross-document invariants between the four core docs:
#   1. CLAUDE.md sessie-counter == TASKS.md sprint-regel sessie
#   2. Header canonical sessie-marker == footer canonical sessie-marker binnen elke doc
#      (Sessie 140 refinement: regex zoekt alleen canonieke markers — "Laatst bijgewerkt"
#      / "Last updated" / "laatste" — om random "Sessie N" mentions in body te skippen)
#   3. PRD-versie referentie identiek in CLAUDE.md en PLANNING.md
#   4. Monetization-stack keywords aanwezig in alle 3 docs (Ko-fi, Brevo, Gumroad, Lead magnet)
#
# Doel: voorkom doc-drift die in Sessie 139 zichtbaar werd
# (CLAUDE.md liep 14 sessies vooruit op PLANNING.md/TASKS.md).
#
# Usage:
#   ./scripts/validate-docs.sh           — Checks 1-4 + 8 (fast, pre-commit hook)
#   ./scripts/validate-docs.sh --deep    — Checks 1-8 (opt-in, end-of-sessie /summary gate)
# Exit code: 0 = all valid, 1 = drift detected
#
# Sessie 157: --deep mode toegevoegd voor soft-drift detectie (Sessie 140 TODO fulfilled).
#   - Check 5: Bundle KB ground-truth via VALIDATE-BUNDLE marker block in TASKS.md (±5% tol)
#   - Check 6: Milestone-percentage ground-truth via [x]/[ ] count per M5/M5.5/M6/M7/M8/M9 section
#               + Blog file-count ground-truth (sub-check 6b: ls blog/*.html minus index/welkom)
#               (legacy M0-M4: permanent [SKIP] by-design — tabel-targets = MVP-essential subset,
#                section [ ] items zijn defer-to-M5/M4 testing-tasks of legitiem-optional/Post-MVP.
#                Frozen milestones, drift mechanisch-onmogelijk — Check 6 detection-value = 0.
#                #23.2 CLOSED Sessie 159 (documentation-of-intent, geen code-logic change).)
#               Awk-ranges fragile bij header-format-wijzigingen (emoji/h2-h3-shift) — zie comments.
#               Sessie 158: extension naar M5/M5.5/M9 + Blog sub-check 6b (item #23.1).
#               Sessie 159: M0-M4 permanent-SKIP gedocumenteerd (item #23.2).
#   - Check 7: Cross-doc Versie consistency CLAUDE.md `**Version:**` ↔ TASKS.md `**Versie:**`
# Soft-drift = cijfers die langzaam verouderen zonder dat één invariant breekt.
#
# #23.3 (housekeeping pre-Sessie 160): Check 8 toegevoegd voor hard structuur-constraint.
#   - Check 8: CLAUDE.md `**Last updated:**` + `**Version:**` regels ≤500 bytes each
#               (forcing-function tegen single-line narrative-accumulation —
#                CLAUDE.md 77,6 KB → 12 KB cleanup voorkomt herintreding via deze check).
#               Runs in zowel fast als --deep mode (hard constraint, niet tolerance-gevoelig).
#
# Sessie 160 (public-launch prep): Check 9 toegevoegd voor SEO-metadata integriteit.
#   - Check 9: sitemap.xml + feed.xml ↔ blog content-sync (hard constraint, fast + --deep).
#       9a: per blogpost geldt sitemap <lastmod> >= JSON-LD datePublished
#           (vangt "gewijzigd vóór gepubliceerd"-onmogelijkheid — bug gevonden bij launch-prep).
#       9b: RSS <item>-count == aantal blogposts (blog/*.html minus index.html) +
#           elke post-URL aanwezig in feed.xml (vangt ontbrekende post — OWASP ontbrak).
#       Filesystem-ground-truth (zoals Check 6b): nieuwe posts tellen automatisch mee.
#       ISO-datums (YYYY-MM-DD) vergelijken lexicaal correct via [[ "$a" < "$b" ]].
#
# Sessie 212 (lead-magnet-bugfix): Check 10 toegevoegd voor download-bestandsnamen.
#   - Check 10: elke assets/samples/*.pdf heeft een exacte _headers-regel waarvan
#       Content-Disposition filename="…" gelijk is aan zijn eigen basename.
#       Bugklasse: `/assets/samples/*` droeg één harde filename="pentest-playbook-sample.pdf".
#       Die regel klopte toen de map één PDF had, en werd stilzwijgend fout toen de
#       juridische sample erbij kwam — geen 404, geen foutmelding, alleen een naam die
#       loog. Filesystem-ground-truth: een derde sample telt automatisch mee.

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

# Signaleert zonder te falen. Bestaat voor de verouderde-floor-melding (Sessie 214):
# een floor die ver onder de werkelijkheid ligt is niet fout — je verkoopt jezelf
# alleen tekort — dus dat mag de build niet breken, maar moet je wél zien.
warn() {
  echo -e "  ${YELLOW}[LET OP]${NC} $1"
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
# Sessie 208: "AdSense" verwijderd — de advertentiestack is van de site gehaald.
# De keyword-gate bewaakt de *actuele* stack; een verdwenen kanaal hoort er niet in.
declare -A KEYWORDS=(
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

  # Section-range mapping: milestones met dynamische TASKS.md section.
  # M0-M4: permanent SKIP by-design (Sessie 159 #23.2 CLOSED documentation-of-intent).
  #        Frozen milestones — tabel-targets = MVP-essential subset, section [ ] items
  #        zijn defer-to-M5/M4 testing-tasks of legitiem-optional/Post-MVP/Future.
  #        Detection-value = 0 want toekomstige drift mechanisch-onmogelijk.
  # Blog: content-pijler, file-based ground-truth → aparte sub-check 6b hieronder.
  # Bekend-fragile: awk ranges gebruiken h2-emoji-anchored OF h3-plain-text-anchored headers.
  # Als header-format wijzigt (emoji-swap, h-level-shift, rename) → update hier.
  # Sessie 158 #23.1 extension: M5/M5.5/M9 toegevoegd (h3 plain-text voor M5/M5.5,
  # h2-emoji voor M9). M6/M7/M8 onveranderd voor backwards-compatible output-order.
  declare -A MILESTONE_RANGES
  MILESTONE_RANGES[M6]='/^## 🎓 M6:/,/^## 🎮 M7:/'
  MILESTONE_RANGES[M7]='/^## 🎮 M7:/,/^## 📊 M8:/'
  MILESTONE_RANGES[M8]='/^## 📊 M8:/,/^## 📚 Referenties/'
  MILESTONE_RANGES[M5]='/^### M5: /,/^### M5\.5:/'
  MILESTONE_RANGES[M5.5]='/^### M5\.5:/,/^### Phase A:/'
  MILESTONE_RANGES[M9]='/^## 🧹 M9:/,/^## 🎓 M6:/'

  for mkey in M6 M7 M8 M5 M5.5 M9; do
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

  echo -e "  ${YELLOW}[SKIP]${NC} M0-M4: permanent by-design (frozen milestones; section [ ] = defer-to-M5/M4 testing of optional/Post-MVP — geen drift mogelijk, #23.2 CLOSED Sessie 159)"

  # ----------------------------------------------------------
  # Check 6b: Blog content-pijler file-count ground-truth (sub-check, geen CHECK_COUNT bump)
  # ----------------------------------------------------------
  echo ""
  echo "Check 6b: Blog content-pijler ground-truth (--deep, filesystem-based)"

  # Filesystem ground-truth: blog posts = blog/*.html minus index.html (hub) en welkom.html (welkomstpost).
  # Future content additions (post 11+) reflecteren automatisch zonder script-update.
  blog_count=$(ls blog/*.html 2>/dev/null | grep -vE "/(index|welkom)\.html$" | wc -l)
  blog_table_row=$(grep -E "^\| \*\*Blog \(content-pijler\)" "$TASKS" | head -1)

  if [ -z "$blog_table_row" ]; then
    fail "Blog: geen Voortgang Overzicht tabel-rij gevonden (verwacht '| **Blog (content-pijler)** | ...')"
  else
    claimed_blog=$(echo "$blog_table_row" | grep -oE '\| [0-9]+/[0-9]+ posts' | grep -oE '[0-9]+/[0-9]+')
    claimed_blog_pct=$(echo "$blog_table_row" | grep -oE '\| [0-9]+%' | head -1 | grep -oE '[0-9]+')
    expected_blog="${blog_count}/${blog_count}"

    if [ "$claimed_blog" != "$expected_blog" ]; then
      fail "Blog: tabel-taken='$claimed_blog' ≠ filesystem ground-truth='$expected_blog' (ls blog/*.html minus index/welkom)"
    else
      pass "Blog: tabel-taken match filesystem ($expected_blog posts)"
    fi

    if [ "$claimed_blog_pct" != "100" ]; then
      fail "Blog: tabel-pct='${claimed_blog_pct}%' ≠ 100% (alle aanwezige posts tellen mee)"
    else
      pass "Blog: tabel-pct match (100%)"
    fi
  fi

  # ----------------------------------------------------------
  # Check 6c: User-facing stat-grid floor-asserties (gidsen.html) — drift-bestendig
  # ----------------------------------------------------------
  # Bezoeker-zichtbare content-tellingen staan als open FLOORS ("12+", "40+", "50+"),
  # nooit als exact getal — zo verouderen ze netjes bij groei (content wordt alleen
  # toegevoegd). Deze check assert per floor: geclaimde_floor <= echte_telling.
  # Faalt ALLEEN bij overclaim (site claimt meer dan er is) of als de floor gênant
  # laag is geworden t.o.v. de drempel; klaagt NOOIT bij gezonde groei.
  echo ""
  echo "Check 6c: User-facing stat-grid floors (--deep, gidsen.html + woordenlijst.html)"

  # Ground-truth tellingen (filesystem/source, niet hardcoded)
  cmd_count=$(grep -cE '\.register\(' src/main.js 2>/dev/null)
  term_count=$(grep -c '<dt' woordenlijst.html 2>/dev/null)

  # Floor-extractie: pak het getal in <span class="gids-stat-value">N+</span> dat
  # vlak vóór het bijbehorende -label staat.
  blog_floor=$(grep -B1 'gids-stat-label">Blog posts<' gidsen.html | grep -oE 'gids-stat-value">[0-9]+' | grep -oE '[0-9]+$')
  cmd_floor=$(grep -B1 'gids-stat-label">Commands<' gidsen.html | grep -oE 'gids-stat-value">[0-9]+' | grep -oE '[0-9]+$')
  # -i: sinds Sessie 201 zinskapitaal ("50+ cybersecurity termen"), niet meer Title Case
  term_floor=$(grep -oiE '[0-9]+\+ Cybersecurity Termen' woordenlijst.html | grep -oE '^[0-9]+' | head -1)

  # assert_floor <naam> <floor> <ground-truth>
  assert_floor() {
    local name="$1" floor="$2" truth="$3"
    if [ -z "$floor" ]; then
      fail "Floor '$name': geen getal gevonden (HTML-structuur gewijzigd?)"
    elif [ -z "$truth" ] || [ "$truth" -eq 0 ] 2>/dev/null; then
      fail "Floor '$name': ground-truth telling leeg/0 (telbron gewijzigd?)"
    elif [ "$floor" -gt "$truth" ]; then
      fail "Floor '$name': geclaimd ${floor}+ > werkelijk ${truth} (OVERCLAIM — verlaag de floor of voeg content toe)"
    elif [ $((truth - floor)) -ge 10 ]; then
      # De check was tot Sessie 214 eenzijdig: hij faalde alleen bij overclaim, dus een
      # floor van 5 bleef eeuwig groen en verouderen was structureel onzichtbaar. Deze
      # tak maakt onderclaimen zichtbaar zonder de build te breken — eerlijk zijn mag
      # nooit rood worden. Drempel 10 = de afrondstap van de floors zelf.
      warn "Floor '$name': ${floor}+ terwijl er ${truth} zijn — tijd om de floor op te hogen"
    else
      pass "Floor '$name': ${floor}+ <= werkelijk ${truth}"
    fi
  }

  assert_floor "gidsen Blog posts" "$blog_floor" "$blog_count"
  assert_floor "gidsen Commands"   "$cmd_floor"  "$cmd_count"
  assert_floor "woordenlijst Termen" "$term_floor" "$term_count"

  # --- Sessie 214: dekking uitgebreid van 3 naar alle groeiende claims -------------
  # De check dekte hiervoor alleen gidsen.html + woordenlijst.html, terwijl "40+
  # commands" op 16 plekken in 7 bestanden stond en nergens werd bewaakt. Hieronder
  # per claim-soort de HOOGSTE floor die érgens op de site staat: zakt de werkelijke
  # telling daaronder, dan is minstens één pagina aan het overclaimen. Een nieuw
  # bestand met dezelfde claim telt automatisch mee — geen lijst om bij te werken.
  hoogste_floor() {
    grep -rhoiE "$1" --include=*.html . \
      --exclude-dir=node_modules --exclude-dir=.playwright-mcp --exclude-dir=test-results 2>/dev/null \
      | grep -oE '[0-9]+' | sort -n | tail -1
  }

  cmd_floor_site=$(hoogste_floor '[0-9]+\+ ?(echte )?(terminal )?commands')
  assert_floor "site-breed 'N+ commands'" "$cmd_floor_site" "$cmd_count"

  # Homepage-cijfertegels (#results, Sessie 214). Ze linken elk naar de plek waar de
  # bezoeker het na kan tellen, dus overclaimen is hier direct betrapbaar.
  # -B1: nummer en label staan op opeenvolgende regels, net als bij gidsen.html.
  home_art_floor=$(grep -B1 'result-label">Artikelen' index.html | grep -oE 'result-number">[0-9]+' | grep -oE '[0-9]+$')
  home_term_floor=$(grep -B1 'result-label">Begrippen' index.html | grep -oE 'result-number">[0-9]+' | grep -oE '[0-9]+$')
  assert_floor "homepage Artikelen"  "$home_art_floor"  "$blog_count"
  assert_floor "homepage Begrippen"  "$home_term_floor" "$term_count"

  # DefinedTerm-lockstep (GEO): elke zichtbare <dt>-term moet een DefinedTerm-entry
  # in de JSON-LD hebben — exact gelijk, anders drift tussen schema en content.
  definedterm_count=$(grep -c '"@type": "DefinedTerm"' woordenlijst.html 2>/dev/null)
  if [ "$definedterm_count" -eq "$term_count" ] 2>/dev/null; then
    pass "woordenlijst DefinedTerm-lockstep: JSON-LD ${definedterm_count} == zichtbaar ${term_count}"
  else
    fail "woordenlijst DefinedTerm-lockstep: JSON-LD ${definedterm_count} != zichtbaar ${term_count} (hergenereer hasDefinedTerm-array bij term-wijziging)"
  fi

  # ----------------------------------------------------------
  # Check 6d: In-app content-tellingen ↔ broncode (Sessie 208)
  # ----------------------------------------------------------
  # Check 6c dekte 3 van de 6 telbare content-types (blogposts, commands, termen).
  # Badges, challenges en tutorial-scenario's stonden er niet in — en dáár was de
  # drift dan ook: de `achievements`-man-page claimde 4 RARE badges terwijl
  # badge-definitions.js er 5 definieert, en drie andere plekken noemden 20, 21 en 22.
  # Anders dan 6c zijn dit EXACTE tellingen (geen "N+"-floors), dus exacte gelijkheid.
  echo ""
  echo "Check 6d: In-app content-tellingen ↔ broncode (--deep)"

  BADGE_SRC="src/gamification/badge-definitions.js"
  ACH_SRC="src/commands/system/achievements.js"

  # assert_exact <naam> <geclaimd> <ground-truth> <hint>
  assert_exact() {
    local name="$1" claimed="$2" truth="$3" hint="$4"
    if [ -z "$claimed" ]; then
      fail "Telling '$name': geen getal gevonden (bronstructuur gewijzigd?) — $hint"
    elif [ -z "$truth" ] || [ "$truth" -eq 0 ] 2>/dev/null; then
      fail "Telling '$name': ground-truth leeg/0 (telbron gewijzigd?) — $hint"
    elif [ "$claimed" -eq "$truth" ] 2>/dev/null; then
      pass "Telling '$name': ${claimed} == broncode ${truth}"
    else
      fail "Telling '$name': geclaimd ${claimed} != broncode ${truth} — $hint"
    fi
  }

  # Badges per zeldzaamheid: man-page-regel "[*] COMMON  ... (8 badges)" vs rarity-veld
  for rarity in common uncommon rare epic legendary; do
    RAR_UPPER=$(echo "$rarity" | tr '[:lower:]' '[:upper:]')
    truth=$(grep -cE "rarity: *'${rarity}'" "$BADGE_SRC" 2>/dev/null)
    claimed=$(grep -oE "${RAR_UPPER} +[^(]*\(([0-9]+) badges?\)" "$ACH_SRC" 2>/dev/null \
              | grep -oE '\([0-9]+' | grep -oE '[0-9]+' | head -1)
    assert_exact "achievements man-page ${RAR_UPPER}" "$claimed" "$truth" \
      "werk de ZELDZAAMHEID-lijst in ${ACH_SRC} bij"
  done

  # Totaal badges: som van de rarity-velden moet gelijk zijn aan het aantal id-velden
  badge_total=$(grep -cE "rarity: *'[a-z]+'" "$BADGE_SRC" 2>/dev/null)
  badge_ids=$(grep -cE "^ *id: *'" "$BADGE_SRC" 2>/dev/null)
  assert_exact "badge-definitions rarity-dekking" "$badge_total" "$badge_ids" \
    "elke badge hoort exact één rarity-veld te hebben"

  # Challenges: badge-beschrijvingen noemen "alle N challenges" — moet het echte aantal zijn
  challenge_truth=$(grep -chE "^ *id: *'" src/gamification/challenges/*.js 2>/dev/null | paste -sd+ | bc)
  challenge_claimed=$(grep -oE 'alle ([0-9]+) challenges' "$BADGE_SRC" 2>/dev/null \
                      | grep -oE '[0-9]+' | head -1)
  assert_exact "badge-tekst 'alle N challenges'" "$challenge_claimed" "$challenge_truth" \
    "pas de badge-beschrijvingen in ${BADGE_SRC} aan"

  # Tutorial-scenario's: bestandstelling vs de registratie-imports in terminal.js
  # (daar worden de scenario's geregistreerd, niet in tutorial-manager.js)
  scenario_files=$(ls src/tutorial/scenarios/*.js 2>/dev/null | wc -l | tr -d ' ')
  scenario_registered=$(grep -cE "^import .* from '\.\./tutorial/scenarios/" src/core/terminal.js 2>/dev/null)
  assert_exact "tutorial-scenario's geregistreerd" "$scenario_registered" "$scenario_files" \
    "elk bestand in src/tutorial/scenarios/ hoort geïmporteerd te zijn in src/core/terminal.js"

  # Check 6e: Hash-snelheden ↔ gedeelde constante (Sessie 209)
  # ----------------------------------------------------------
  # Vóór deze check noemde de site DRIE verschillende getallen voor dezelfde
  # MD5-snelheid (man page 200 miljard, blog 200+, kraaktijd-tabel impliciet
  # ~100/3000/28000) en waren ze allemaal 3-5x te hoog t.o.v. de gepubliceerde
  # hashcat-benchmarks. Sinds Sessie 209 is hash-benchmarks.js de enige bron;
  # de blogposts zijn statische HTML en kunnen niet importeren, dus deze check
  # bewaakt dat ze de constante blijven volgen.
  echo ""
  echo "Check 6e: Hash-snelheden ↔ gedeelde constante (--deep)"

  HASH_SRC="src/commands/security/hash-benchmarks.js"
  HASHCAT_POST="blog/hashcat-wachtwoorden-kraken.html"

  if [ ! -f "$HASH_SRC" ]; then
    fail "Hash-benchmarks: ${HASH_SRC} ontbreekt — de bron van waarheid is weg"
  else
    # 1. Elk label uit HASH_SPEEDS moet verbatim in de hashcat-blogtabel staan
    while IFS= read -r hs_label; do
      [ -z "$hs_label" ] && continue
      if grep -qF "$hs_label" "$HASHCAT_POST" 2>/dev/null; then
        pass "Hash-snelheid '${hs_label}' staat in de blogtabel"
      else
        fail "Hash-snelheid '${hs_label}' uit ${HASH_SRC} ontbreekt in ${HASHCAT_POST} — werk de tabel bij"
      fi
    done < <(grep -oE "label: '[^']+'" "$HASH_SRC" | sed "s/^label: '//; s/'$//")

    # 2. Het MD5-getal draagt de kraaktijd-tabel en de hub-samenvatting
    MD5_FIG=$(grep -oE "label: '~?[0-9]+ miljard/sec'" "$HASH_SRC" | grep -oE '[0-9]+ miljard' | head -1)
    if [ -z "$MD5_FIG" ]; then
      fail "Hash-benchmarks: MD5-label niet te parsen uit ${HASH_SRC}"
    else
      for f in blog/wachtwoord-beveiliging.html blog/index.html; do
        if grep -qF "$MD5_FIG" "$f" 2>/dev/null; then
          pass "MD5-snelheid '${MD5_FIG}' consistent in $(basename "$f")"
        else
          fail "MD5-snelheid '${MD5_FIG}' ontbreekt in ${f} — kraaktijden/samenvatting lopen uit de pas"
        fi
      done
    fi

    # 3. De weerlegde cijfers mogen niet terugkeren (200 miljard was 3x te hoog)
    STALE=$(grep -rlE '200\+? miljard' --include=*.html --include=*.js blog/ src/ 2>/dev/null || true)
    if [ -n "$STALE" ]; then
      fail "Weerlegd cijfer '200 miljard' staat terug in: ${STALE}"
    else
      pass "Weerlegde hash-cijfers (200 miljard) komen nergens meer voor"
    fi
  fi

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
# Check 8: CLAUDE.md Last updated + Version single-line constraint
#   Hard structural constraint — runs in fast mode + --deep.
#   Forcing-function tegen single-line narrative-accumulation
#   pattern. Sessie 159 housekeeping #23.3 schoonde CLAUDE.md
#   van 77,6 KB → 12 KB; deze check voorkomt herintreding.
#   Cap: 500 bytes per regel — historie hoort in current.md
#   (zie .claude/CLAUDE.md §Sessie Protocol stap 4).
# ============================================================
check_start "CLAUDE.md Last updated + Version single-line constraint"

MAX_BYTES=500

# 8a. Last updated regel ≤ MAX_BYTES
LU_LINENO=$(grep -nE '^\*\*Last updated:\*\*' "$CLAUDE" | head -1 | cut -d: -f1)
if [ -z "$LU_LINENO" ]; then
  fail "CLAUDE.md: geen canonieke '**Last updated:**' regel gevonden"
else
  LU_BYTES=$(sed -n "${LU_LINENO}p" "$CLAUDE" | wc -c)
  if [ "$LU_BYTES" -gt "$MAX_BYTES" ]; then
    fail "CLAUDE.md Last updated regel ${LU_BYTES} bytes > ${MAX_BYTES} max — sessie-narratief moet naar docs/sessions/current.md (zie /summary stap 4 protocol)"
  else
    pass "CLAUDE.md Last updated regel ${LU_BYTES} bytes ≤ ${MAX_BYTES}"
  fi
fi

# 8b. Version regel ≤ MAX_BYTES
V_LINENO=$(grep -nE '^\*\*Version:\*\*' "$CLAUDE" | head -1 | cut -d: -f1)
if [ -z "$V_LINENO" ]; then
  fail "CLAUDE.md: geen canonieke '**Version:**' regel gevonden"
else
  V_BYTES=$(sed -n "${V_LINENO}p" "$CLAUDE" | wc -c)
  if [ "$V_BYTES" -gt "$MAX_BYTES" ]; then
    fail "CLAUDE.md Version regel ${V_BYTES} bytes > ${MAX_BYTES} max — version-narratief moet naar docs/sessions/current.md"
  else
    pass "CLAUDE.md Version regel ${V_BYTES} bytes ≤ ${MAX_BYTES}"
  fi
fi

# ============================================================
# Check 9: Sitemap/RSS ↔ blog content-sync integriteit
#   Hard constraint — runs in fast mode + --deep. SEO-metadata
#   forcing-function (Sessie 160 public-launch prep). Vangt de
#   twee drift-bugs gevonden bij launch-prep: sitemap-lastmod
#   ouder dan datePublished, en ontbrekende post in feed.xml.
# ============================================================
check_start "Sitemap/RSS ↔ blog content-sync integriteit"

SITEMAP="sitemap.xml"
FEED="feed.xml"

if [ ! -f "$SITEMAP" ] || [ ! -f "$FEED" ]; then
  fail "sitemap.xml of feed.xml niet gevonden (run vanuit project root)"
else
  # 9a: per blogpost sitemap <lastmod> >= JSON-LD datePublished + sitemap-entry aanwezig
  sync_ok=1
  for f in blog/*.html; do
    base=$(basename "$f")
    [ "$base" = "index.html" ] && continue

    pub=$(grep -oE '"datePublished"[[:space:]]*:[[:space:]]*"[0-9]{4}-[0-9]{2}-[0-9]{2}"' "$f" \
          | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' | head -1)
    lastmod=$(grep -A1 "blog/${base}</loc>" "$SITEMAP" \
              | grep -oE '<lastmod>[0-9]{4}-[0-9]{2}-[0-9]{2}</lastmod>' \
              | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' | head -1)

    if [ -z "$pub" ]; then
      fail "9a $base: geen JSON-LD datePublished gevonden in blogpost"
      sync_ok=0
    elif [ -z "$lastmod" ]; then
      fail "9a $base: geen sitemap <lastmod> entry (post mist in sitemap.xml?)"
      sync_ok=0
    elif [[ "$lastmod" < "$pub" ]]; then
      fail "9a $base: sitemap lastmod=$lastmod ouder dan datePublished=$pub (logisch onmogelijk)"
      sync_ok=0
    fi
  done
  [ "$sync_ok" = "1" ] && pass "9a: alle blog-posts: sitemap lastmod >= datePublished + entry aanwezig"

  # 9b: RSS item-count == blog-post-count + elke post-URL aanwezig in feed
  blog_posts=$(ls blog/*.html 2>/dev/null | grep -vE '/index\.html$' | wc -l | tr -d ' ')
  rss_items=$(grep -c '<item>' "$FEED")

  if [ "$rss_items" != "$blog_posts" ]; then
    fail "9b: RSS item-count ($rss_items) ≠ blog-post-count ($blog_posts) — post mist in feed.xml?"
  else
    pass "9b: RSS item-count match blog-posts ($rss_items)"
  fi

  feed_ok=1
  for f in blog/*.html; do
    base=$(basename "$f")
    [ "$base" = "index.html" ] && continue
    if ! grep -q "blog/${base}" "$FEED"; then
      fail "9b: blog/${base} ontbreekt in feed.xml"
      feed_ok=0
    fi
  done
  [ "$feed_ok" = "1" ] && pass "9b: elke blog-post-URL aanwezig in feed.xml"

  # 9c: RSS-titel == <title> van de post (Sessie 208)
  # De RSS-titel hoorde niet bij de 7 lockstep-locaties van de blog-post-skill.
  # Gevolg: bij de sitebrede overgang naar Nederlands zinskapitaal (commit 65c5f18)
  # bleven 14 van de 14 feed-titels in Engelse Title Case staan — stil, want niets
  # controleerde het. Dit is de ontbrekende 8e locatie.
  rss_title_ok=1
  for f in blog/*.html; do
    base=$(basename "$f")
    [ "$base" = "index.html" ] && continue

    page_title=$(sed -n 's/.*<title>\(.*\)<\/title>.*/\1/p' "$f" | head -1 \
                 | sed 's/[[:space:]]*[|–-][[:space:]]*HackSimulator\.nl[[:space:]]*$//')
    # De <item> van deze post: het blok tussen <item> en </item> dat de URL bevat.
    feed_title=$(awk -v post="blog/${base}" '
      /<item>/ { block = ""; inblock = 1 }
      inblock  { block = block $0 "\n" }
      /<\/item>/ { if (inblock && index(block, post)) { print block; exit } inblock = 0 }
    ' "$FEED" | sed -n 's/.*<title>\(.*\)<\/title>.*/\1/p' | head -1)

    if [ -z "$feed_title" ]; then
      : # ontbrekende item is al door 9b gemeld
    elif [ "$feed_title" != "$page_title" ]; then
      fail "9c ${base}: feed-titel wijkt af van <title>
        feed: ${feed_title}
        post: ${page_title}"
      rss_title_ok=0
    fi
  done
  [ "$rss_title_ok" = "1" ] && pass "9c: elke RSS-titel gelijk aan de <title> van de post"

  # 9d: blog/index.html toont de kaarten nieuwste-eerst (Sessie 208)
  # De volgorde brak vanaf kaart 5 zonder dat iets het zag: een bezoeker kreeg
  # een post uit december 2025 bóven een uit januari 2026.
  order_ok=$(python3 - <<'PYEOF'
import re, sys
MONTHS = {'jan':1,'feb':2,'mrt':3,'apr':4,'mei':5,'jun':6,'jul':7,'aug':8,'sep':9,'okt':10,'nov':11,'dec':12}
s = open('blog/index.html', encoding='utf-8').read()
cards = re.findall(r'<article class="blog-post-card".*?</article>', s, re.S)
dates = []
for c in cards:
    m = re.search(r'\[(\d{1,2}) ([a-z]{3}) (\d{4})\]', c)
    if not m:
        print('GEEN_DATUM'); sys.exit()
    dates.append((int(m.group(3)), MONTHS[m.group(2)], int(m.group(1))))
for i in range(len(dates) - 1):
    if dates[i] < dates[i + 1]:
        print(f'FOUT:{i+1}:{dates[i]}:{dates[i+1]}'); sys.exit()
print(f'OK:{len(dates)}')
PYEOF
)
  case "$order_ok" in
    OK:*)        pass "9d: blog/index.html nieuwste-eerst gesorteerd (${order_ok#OK:} kaarten)" ;;
    GEEN_DATUM)  fail "9d: blog-kaart zonder [d mmm jjjj]-datum (markup gewijzigd?)" ;;
    *)           fail "9d: blog/index.html niet nieuwste-eerst — breuk bij kaart ${order_ok#FOUT:}" ;;
  esac
fi

# ============================================================
# Check 10: sample-PDF's ↔ Content-Disposition filename in _headers (Sessie 212)
#   Hard constraint — fast + --deep. Vangt de bug waarbij een bezoeker die de
#   juridische sample downloadde een bestand kreeg dat pentest-playbook-sample.pdf
#   heette: één wildcard-regel zette één harde filename voor de héle map.
#   De check eist per PDF een exacte-pad-regel met zijn eigen naam, én verbiedt
#   een wildcard met vaste filename — anders keert dezelfde bug terug bij sample 3.
# ============================================================
check_start "Sample-PDF's ↔ Content-Disposition filename in _headers"

if [ ! -f "_headers" ]; then
  fail "_headers niet gevonden (run vanuit project root)"
elif [ ! -d "assets/samples" ]; then
  fail "assets/samples/ niet gevonden (run vanuit project root)"
else
  headers_result=$(python3 - <<'PYEOF'
import os, re

SAMPLES = 'assets/samples'

# _headers-formaat: regel zonder inspringing = pad, ingesprongen regels = headers daarvoor
rules = []
for line in open('_headers', encoding='utf-8'):
    stripped = line.strip()
    if not stripped or stripped.startswith('#'):
        continue
    if line[0].isspace():
        if rules:
            rules[-1][1].append(stripped)
    else:
        rules.append((stripped, []))

problems = []
pdfs = sorted(f for f in os.listdir(SAMPLES) if f.endswith('.pdf'))
if not pdfs:
    problems.append(f'geen PDF gevonden in {SAMPLES}/ — is de map leeg?')

for pdf in pdfs:
    path = f'/{SAMPLES}/{pdf}'
    exact = [h for p, h in rules if p == path]
    if not exact:
        problems.append(f'{pdf}: geen exacte regel "{path}" in _headers')
        continue
    names = [m.group(1) for h in exact[0]
             for m in [re.search(r'filename="([^"]+)"', h)] if m]
    if not names:
        problems.append(f'{pdf}: regel "{path}" zet geen Content-Disposition filename')
    elif names[0] != pdf:
        problems.append(f'{pdf}: filename="{names[0]}" — hoort filename="{pdf}" te zijn')

# De bugklasse zelf: een wildcard die één vaste naam over de hele map legt
for path, hdrs in rules:
    if '*' in path and path.startswith('/assets/samples'):
        for hdr in hdrs:
            if 'filename="' in hdr:
                problems.append(f'wildcard "{path}" zet een vaste filename — die geldt voor élke PDF in de map')

print('OK' if not problems else '\n'.join(problems))
PYEOF
)
  if [ "$headers_result" = "OK" ]; then
    pass "10: elke sample-PDF heeft een exacte _headers-regel met zijn eigen bestandsnaam"
  else
    while IFS= read -r problem; do
      [ -n "$problem" ] && fail "10: $problem"
    done <<< "$headers_result"
  fi
fi

# ============================================================
# Summary
# ============================================================
# Check 11: homepage-bloglabels ↔ echte <h1> van de doelpost (Sessie 214)
#   Hard constraint — fast + --deep. De labels in .blog-links-list waren letterlijk
#   overgetikt uit docs/landing-page-plan.md (jan 2026) en zijn nooit meegegaan in de
#   zinskapitaal-omzetting (Sessie 201) of de lockstep-ronde (Sessie 208): 10 van de 14
#   stonden nog in Engelse Title Case en 4 noemden een andere titel dan de post zelf
#   ("Terminal Basics voor Beginners" op een post die "Terminal commands voor
#   beginners" heet). Een 9e drift-locatie dus, die niemand bewaakte.
#   Een label mag korter zijn dan de <h1> — die draagt soms een SEO-staart als
#   ": complete carrièregids" — maar moet er wel mee beginnen.
# ============================================================
check_start "Homepage-bloglabels ↔ <h1> van de doelpost"

bloglabel_result=$(python3 - <<'PYEOF'
import re, os, html

src = open('index.html', encoding='utf-8').read()
links = re.findall(r'<a href="(/blog/[a-z0-9-]+\.html)"[^>]*class="[^"]*\bblog-link\b[^"]*"[^>]*>(.*?)</a>',
                   src, re.S)

problems = []
if not links:
    problems.append('geen <a class="blog-link"> gevonden in index.html (markup gewijzigd?)')

for href, label in links:
    label = html.unescape(re.sub(r'<[^>]+>', '', label)).strip()
    pad = href.lstrip('/')
    if not os.path.exists(pad):
        problems.append(f'{href}: doelbestand bestaat niet')
        continue
    post = open(pad, encoding='utf-8').read()
    m = re.search(r'<h1[^>]*>(.*?)</h1>', post, re.S)
    if not m:
        problems.append(f'{href}: geen <h1> in de post')
        continue
    titel = html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))
    titel = re.sub(r'\s+', ' ', titel).strip()
    # Hoofdlettergevoelig vergelijken. Met .lower() aan beide kanten slaagde de check
    # nog op "Wat is Ethisch Hacken?" tegen een post die "Wat is ethisch hacken?" heet —
    # en precies die Engelse Title Case was 10 van de 14 oorspronkelijke afwijkingen,
    # de hele reden dat Sessie 201 sitebreed naar zinskapitaal ging. Betrapt door de
    # mutant; de eerste versie van deze check was er blind voor.
    if not titel.startswith(label):
        problems.append(f'{href}: label "{label}" != titel "{titel}"')

print('OK' if not problems else '\n'.join(problems))
PYEOF
)
if [ "$bloglabel_result" = "OK" ]; then
  pass "Elk .blog-link-label komt overeen met de <h1> van zijn doelpost"
else
  while IFS= read -r regel; do fail "11: $regel"; done <<< "$bloglabel_result"
fi

# ============================================================
# Check 12: geclaimde PDF-paginatellingen ↔ de echte PDF (Sessie 214)
#   Hard constraint — fast + --deep. "N pagina's" staat op 42 plekken op de site en
#   werd nergens tegen het artefact gecontroleerd, terwijl juist die klasse in Sessie
#   165 al een keer fout bleek (pagina-claims tegen de echte PDF-telling). Dit is
#   géén floor: een paginatelling is geen groeiende inventaris maar een eigenschap
#   van een bestand, dus hij hoort exact te zijn en uitleesbaar uit het artefact.
#   Vereist pdfinfo (poppler-utils); zonder dat wordt de check overgeslagen.
# ============================================================
check_start "Geclaimde PDF-paginatellingen ↔ echte PDF"

if ! command -v pdfinfo >/dev/null 2>&1; then
  pass "12: overgeslagen — pdfinfo niet beschikbaar (poppler-utils)"
else
  pdf_problems=""
  for landing in sample-pentest.html sample-juridisch.html; do
    [ -f "$landing" ] || { pdf_problems+="${landing}: bestaat niet"$'\n'; continue; }
    pdf=$(grep -oE 'assets/samples/[a-z0-9-]+\.pdf' "$landing" | sort -u | head -1)
    if [ -z "$pdf" ]; then
      pdf_problems+="${landing}: verwijst naar geen enkele assets/samples/*.pdf"$'\n'; continue
    fi
    [ -f "$pdf" ] || { pdf_problems+="${landing}: ${pdf} bestaat niet"$'\n'; continue; }
    echt=$(pdfinfo "$pdf" 2>/dev/null | awk '/^Pages:/{print $2}')
    # De dominante claim: de sample-omvang wordt meerdere keren genoemd, de betaalde
    # gids ernaast één keer. De vaakst geclaimde telling hoort die van de sample te zijn.
    dominant=$(grep -oE "[0-9]+ pagina" "$landing" | grep -oE '^[0-9]+' | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
    if [ -z "$echt" ]; then
      pdf_problems+="${pdf}: pdfinfo gaf geen paginatelling"$'\n'
    elif [ "$dominant" != "$echt" ]; then
      pdf_problems+="${landing}: claimt ${dominant} pagina's, ${pdf} heeft er ${echt}"$'\n'
    fi
  done

  # De teaser op de homepage noemt dezelfde sample; die moet meebewegen.
  pentest_echt=$(pdfinfo assets/samples/pentest-playbook-sample.pdf 2>/dev/null | awk '/^Pages:/{print $2}')
  home_claim=$(grep -oE "Gratis sample \| [0-9]+ pagina" index.html | grep -oE '[0-9]+')
  if [ -n "$pentest_echt" ] && [ -n "$home_claim" ] && [ "$home_claim" != "$pentest_echt" ]; then
    pdf_problems+="index.html: lead-magnet-badge claimt ${home_claim} pagina's, de PDF heeft er ${pentest_echt}"$'\n'
  fi

  if [ -z "$pdf_problems" ]; then
    pass "Elke sample-pagina claimt de echte paginatelling van zijn PDF"
  else
    while IFS= read -r regel; do [ -n "$regel" ] && fail "12: $regel"; done <<< "$pdf_problems"
  fi
fi

# ============================================================
echo ""
echo "=========================================="
if [ "$DEEP_MODE" = "1" ]; then
  echo "Summary (--deep mode: Checks 1-8)"
else
  echo "Summary (fast mode: Checks 1-4 + 8 — run with --deep for soft-drift Checks 5-7)"
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
    echo "Quickfix: synchroniseer sessie-counter / datums / monetization-keywords / bundle KB marker / milestone-tabel / Versie / CLAUDE.md single-line constraint."
  else
    echo "Quickfix: synchroniseer sessie-counter, datums, monetization-keywords, of CLAUDE.md Last updated/Version single-line."
  fi
  echo "Volledige protocol: PLANNING.md §Document Ownership + .claude/CLAUDE.md §Sessie Protocol"
  exit 1
fi
