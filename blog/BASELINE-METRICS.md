# Blog Simplification - Baseline Metrics
**Date:** 2026-01-11
**Branch:** feature/blog-simplification
**Purpose:** Document current state before simplification

---

## Current State (Before Simplification)

| Blog Post | Arrows (←) | Boxes | Strong Tags | Complexity |
|-----------|------------|-------|-------------|------------|
| terminal-basics.html | 8 | 3 | 40 | **BASELINE** (cleanest) |
| welkom.html | 8 | 6 | 34 | LOW |
| wat-is-ethisch-hacken.html | 22 | 5 | 62 | MEDIUM |
| top-5-hacking-boeken.html | 33 | 0 | 56 | MEDIUM-HIGH |
| career-switch-gids.html | 14 | 8 | 127 | HIGH |
| beste-online-cursussen-ethical-hacking.html | 22 | 6 | 145 | **HIGHEST** |

---

## Totals

- **Total Arrows:** 107
- **Total Boxes:** 28
- **Total Strong Tags:** 464
- **Average per post:**
  - Arrows: 17.8
  - Boxes: 4.7
  - Strong tags: 77.3

---

## Target State (User Approved)

| Blog Post | Arrows | Boxes | Strong Tags |
|-----------|--------|-------|-------------|
| terminal-basics.html | 4-5 | 2-3 | 30-35 |
| welkom.html | 5-6 | 3-4 | 30-35 |
| wat-is-ethisch-hacken.html | 6-8 | 3-4 | 45-50 |
| top-5-hacking-boeken.html | 6-8 | 2-3 | 40-45 |
| career-switch-gids.html | 5-7 | 3-4 | 50-60 |
| beste-online-cursussen-ethical-hacking.html | 7-8 | 4-5 | 60-70 |

**Target Totals:**
- Arrows: 30-40 (72% reduction from 107)
- Boxes: 20-25 (29-11% reduction from 28)
- Strong tags: 255-305 (34-45% reduction from 464)

---

## Key Observations

1. **terminal-basics.html** = cleanest pattern, use as reference
2. **top-5-hacking-boeken.html** = highest arrow density (33 arrows!)
3. **beste-online-cursussen-ethical-hacking.html** = most overwhelming (145 strong tags)
4. **career-switch-gids.html** = most boxes (8), needs consolidation

---

## Transformation Order

1. terminal-basics.html (pilot, reference pattern)
2. welkom.html (bracket taxonomy fixes)
3. wat-is-ethisch-hacken.html (keep legal warnings)
4. top-5-hacking-boeken.html (aggressive arrow pruning)
5. career-switch-gids.html (box consolidation)
6. beste-online-cursussen-ethical-hacking.html (bracket chaos + [LINK] removal)

---

## Next Steps

- [ ] Take before screenshots (desktop + mobile)
- [ ] Start pilot transformation: terminal-basics.html
- [ ] Validate metrics after pilot
- [ ] Roll out to remaining 5 blogs
