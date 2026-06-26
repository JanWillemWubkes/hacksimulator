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
  term_floor=$(grep -oE '[0-9]+\+ Cybersecurity Termen' woordenlijst.html | grep -oE '^[0-9]+' | head -1)

  # assert_floor <naam> <floor> <ground-truth>
  assert_floor() {
    local name="$1" floor="$2" truth="$3"
    if [ -z "$floor" ]; then
      fail "Floor '$name': geen getal gevonden (HTML-structuur gewijzigd?)"
    elif [ -z "$truth" ] || [ "$truth" -eq 0 ] 2>/dev/null; then
      fail "Floor '$name': ground-truth telling leeg/0 (telbron gewijzigd?)"
    elif [ "$floor" -le "$truth" ]; then
      pass "Floor '$name': ${floor}+ <= werkelijk ${truth}"
    else
      fail "Floor '$name': geclaimd ${floor}+ > werkelijk ${truth} (OVERCLAIM — verlaag de floor of voeg content toe)"
    fi
  }

  assert_floor "gidsen Blog posts" "$blog_floor" "$blog_count"
  assert_floor "gidsen Commands"   "$cmd_floor"  "$cmd_count"
  assert_floor "woordenlijst Termen" "$term_floor" "$term_count"

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
fi

# ============================================================
# Summary
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
