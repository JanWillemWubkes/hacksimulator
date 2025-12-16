# Link Hover Modernization Plan

**Sessie:** Sessie 52 - Global Link Hover Architecture Modernization
**Datum:** 20 november 2025
**Context:** Blog CTA button opacity bug → ontdekking global `a:hover` pattern niet WCAG compliant
**Status:** 🟡 Plan Ready - Awaiting Implementation

---

## Executive Summary

**Current State:**
Global `a:hover { opacity: 0.8; }` (main.css:258-260) dimmed alle anchor tags met 20% transparency

**Problem:**
- ⚠️ Kan WCAG contrast ratios onder 4.5:1 brengen (accessibility violation)
- ⚠️ Conflicts met button-styled anchors (vereist `opacity: 1` overrides)
- ⚠️ Niet aligned met industry best practices (GitHub, Bootstrap 5.3)

**Proposed Solution:**
Vervang opacity dimming door explicit color changes via `--color-link-hover` variables

**Impact:**
- ✅ Better WCAG compliance (geen contrast loss)
- ✅ Consistent met moderne link patterns in codebase
- ✅ Eliminates need for `opacity: 1` overrides

---

## Background Research (Nov 2025)

### Industry Best Practices

**WCAG Accessibility:**
- Opacity 0.8 reduces contrast by 20%, can drop below 4.5:1 threshold
- Best practice: Color change + underline (not color alone)
- All hover states must independently meet WCAG requirements

**Industry Implementations:**
- **GitHub:** Explicit color changes (#58a6ff → darker blue)
- **Bootstrap 5.3:** Color changes primary, opacity as utility only
- **Material Design:** 12% opacity overlays for backgrounds (NOT text)

**Consensus:** Explicit color changes > opacity dimming

### Current HackSimulator.nl Variables

```css
/* Dark mode */
--color-link: #79c0ff;           /* Base link color */
--color-link-hover: #58a6ff;     /* Hover (brighter blue) */

/* Light mode */
--color-link: #0969da;           /* Base link color */
--color-link-hover: #0550ae;     /* Hover (darker blue) */
```

**Links Already Using Explicit Hover:**
- ✅ Blog post card titles
- ✅ Blog read-more links
- ✅ Blog content inline links
- ✅ Navbar links (custom colors)

**Links Using Global Opacity Fallback:**
- 🔍 Footer links (Privacy, Voorwaarden, Cookies) - needs verification
- 🔍 Modal content links - needs verification
- 🔍 Terminal output links - needs verification

---

## Implementation Plan

### Phase 1: Audit Link Hover States (15 min)

**Find all links relying on global opacity rule:**

```bash
# Find anchor tags without explicit classes
grep -r "<a " --include="*.html" | grep -v "class=" | head -20

# Find all CSS anchor hover rules
grep -r "a:hover\|a :hover" styles/

# Check existing opacity overrides (indicates conflict)
grep -r "opacity: 1" styles/ | grep hover
```

---

### Phase 2: Implement Modern Pattern (5 min)

**File:** `styles/main.css` (lines 258-260)

**BEFORE:**
```css
a:hover {
  opacity: 0.8;
}
```

**AFTER (Recommended):**
```css
/* Modern link hover: Explicit color change + underline (WCAG compliant) */
a:hover:not(.blog-cta-button):not(.btn-primary):not(.btn-secondary):not(.navbar-link) {
  color: var(--color-link-hover);  /* Explicit color - no contrast loss */
  text-decoration: underline;      /* Additional visual cue (WCAG 1.4.1) */
}
```

**Alternative (Color Only):**
```css
/* If links already have underlines */
a:hover:not(.blog-cta-button):not(.btn-primary):not(.btn-secondary):not(.navbar-link) {
  color: var(--color-link-hover);
}
```

**Rationale:**
- `:not()` excludes button-styled anchors (no opacity battles)
- Uses defined `--color-link-hover` variables
- WCAG 4.5:1 contrast maintained
- Aligned with GitHub/Bootstrap patterns

---

### Phase 3: Remove Redundant Overrides (10 min)

**1. styles/blog.css (line 247):**

```css
/* BEFORE */
.blog-post-card h2 a:hover {
  color: var(--color-link-hover);
  opacity: 1;  /* ← No longer needed */
}

/* AFTER */
.blog-post-card h2 a:hover {
  color: var(--color-link-hover);
}
```

**2. Find other opacity overrides:**

```bash
grep -r "opacity: 1" styles/ | grep -i hover
```

---

### Phase 4: Verification Checklist (20 min)

**Test ALL link types in BOTH themes:**

#### Footer Links
- [ ] Privacy → hover changes to `--color-link-hover`
- [ ] Voorwaarden → hover changes to `--color-link-hover`
- [ ] Cookies → hover changes to `--color-link-hover`
- [ ] Dark: #79c0ff → #58a6ff (brighter)
- [ ] Light: #0969da → #0550ae (darker)

#### Blog Links
- [ ] Post card titles
- [ ] Read-more links
- [ ] Content inline links
- [ ] Navbar links (custom hover)

#### Main App Links
- [ ] Navbar (Help, Over, Blog)
- [ ] Modal links

#### Button-Styled Anchors (Should NOT change)
- [ ] Blog CTA buttons → still use `--color-button-bg-hover`
- [ ] Verify `:not()` exclusions work

---

### Phase 5: WCAG Contrast Check (10 min)

**Test with DevTools or online checker:**

| Theme | Element | Base | Hover | Required | Pass? |
|-------|---------|------|-------|----------|-------|
| Dark | Footer link | #79c0ff | #58a6ff | 4.5:1 | ⬜ |
| Light | Footer link | #0969da | #0550ae | 4.5:1 | ⬜ |
| Dark | Blog link | #79c0ff | #58a6ff | 4.5:1 | ⬜ |
| Light | Blog link | #0969da | #0550ae | 4.5:1 | ⬜ |

**Pass Criteria:** All ≥ 4.5:1 contrast

---

## Rollback Strategy

**Quick revert:**
```css
/* main.css line 258-260 */
a:hover {
  opacity: 0.8;  /* Restore global fallback */
}
```

**Partial revert (softer opacity):**
```css
a:hover:not(.blog-cta-button):not(.btn-primary) {
  color: var(--color-link-hover);
  opacity: 0.9;  /* Softer dimming */
}
```

**Git revert:**
```bash
git diff styles/main.css
git checkout HEAD -- styles/main.css
```

---

## Files Modified

1. **styles/main.css** (line 258-260) - Replace opacity with color
2. **styles/blog.css** (line 247) - Remove `opacity: 1` override
3. **[Optional]** Other files with hover opacity overrides

---

## Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Link hover method | Opacity 0.8 (dimming) | Color change (explicit) |
| Button conflicts | Needs `opacity: 1` overrides | No conflicts |
| WCAG compliance | ⚠️ Potential violations | ✅ 4.5:1 minimum |
| Industry alignment | ❌ Outdated pattern | ✅ Modern (GitHub/Bootstrap) |

---

## Documentation Updates

**After implementation:**
- [ ] **SESSIONS.md:** Add Sessie 52 entry
- [ ] **CLAUDE.md §8 CSS Patterns:** Add "Link Hover: Color > Opacity"
- [ ] **STYLEGUIDE.md:** Document link hover behavior

---

## Estimated Time

| Phase | Time |
|-------|------|
| 1. Audit | 15 min |
| 2. Implementation | 5 min |
| 3. Cleanup | 10 min |
| 4. Verification | 20 min |
| 5. WCAG Check | 10 min |
| **Total** | **~60 min** |

---

## Open Questions

1. **Underline:** Add on hover, or is color change sufficient?
2. **Exceptions:** Any links that SHOULD keep opacity (disabled states)?
3. **Focus styles:** Add `:focus` matching `:hover` for keyboard nav?

---

## Implementation Command

**To execute this plan in next session:**

```
Heisenberg: Implementeer LINK-HOVER-MODERNIZATION-PLAN.md
```

Of verwijs naar specifieke fase:
```
Heisenberg: Start Phase 1 van docs/LINK-HOVER-MODERNIZATION-PLAN.md
```

---

**Plan Status:** 🟡 Ready for Implementation
**Last Updated:** 20 november 2025
**Related:** Sessie 52 - Blog CTA Button Opacity Bug Fix
