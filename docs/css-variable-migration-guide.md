# CSS Variable Migration Guide - Sessie 89-94

**Purpose:** Track variable renames and deprecations during design system upgrade to v2.0

**Status:** Living document - Updates each sessie

**Last Updated:** Sessie 89 (26 december 2025)

---

## Sessie 89 - Undefined Variable Fixes

**Added Variables:**

| Variable | Value | Purpose | Impact |
|----------|-------|---------|--------|
| `--font-mono` | `var(--font-terminal)` | Alias for monospace font | Resource category badges now render correctly |
| `--color-bg-secondary` | `var(--color-bg-modal)` | Ad container background | AdSense containers have defined background |
| `--font-family-primary` | `var(--font-ui)` | Future-proof UI font naming | Search modal uses consistent typography (5 usages) |
| `--color-bg-input` | `var(--color-bg-hover)` | Input field background | Search modal input has defined background |

**Breaking Changes:** None

**Testing Impact:** Zero visual changes - these are aliases to existing values

---

## Sessie 90 - Semantic Cleanup ✅ COMPLETED (26 dec 2025)

**Implementation Summary:**
- **Strategy:** Alias-first migration (keep existing names as PRIMARY, add deprecated aliases)
- **Changes:** +34 lines in styles/main.css (+2KB)
- **Breaking:** None (100% backward compatible)
- **Visual:** Zero regressions (aliases use identical values)

**Text Variables - Consolidated via Aliases:**

| Deprecated (v1.1) | Primary (Keep) | Alias Definition | Impact |
|-------------------|----------------|------------------|--------|
| `--color-text-light` | `--color-text` | `var(--color-text)` | Light mode: #2a2a2a → #0a0a0a (better contrast) |
| `--color-modal-text` | `--color-text` | `var(--color-text)` | Unified modal text color |
| `--color-text-muted` | `--color-text-dim` | `var(--color-text-dim)` | Light mode: #666 → #444 (WCAG AAA win!) |
| `--color-input` | `--color-prompt` | `var(--color-prompt)` | Terminal branding consistency |

**Chrome Variables - Dark Frame Pattern Consolidation:**

| Deprecated (v1.1) | Primary (Keep) | Alias Definition | Impact |
|-------------------|----------------|------------------|--------|
| `--color-footer-text` | `--color-navbar-link` | `var(--color-navbar-link)` | Unified chrome text (#c9d1d9) |
| `--color-navbar-dropdown-icon` | `--color-navbar-link` | `var(--color-navbar-link)` | Icon matches nav links |

**Modal Background - Simplified:**

| Deprecated (v1.1) | Primary (Keep) | Alias Definition | Impact |
|-------------------|----------------|------------------|--------|
| `--color-bg-modal-content` | `--color-bg-modal` | `var(--color-bg-modal)` | Unified modal backgrounds |

**Typography Scale - NEW TOKENS (7 added):**

| Variable | Value | Usage |
|----------|-------|-------|
| `--font-size-xs` | `0.75rem` (12px) | Captions, metadata |
| `--font-size-sm` | `0.875rem` (14px) | Secondary text |
| `--font-size-md` | `1rem` (16px) | Body text (default) |
| `--font-size-lg` | `1.25rem` (20px) | Subheadings |
| `--font-size-xl` | `1.5rem` (24px) | H3 headings |
| `--font-size-2xl` | `1.953rem` (31px) | H2 headings |
| `--font-size-3xl` | `2.441rem` (39px) | H1 headings, hero |

**Design System:** Minor Third scale (1.2 ratio) - Industry standard (GitHub, Medium, Stripe)

**Font Family Variables - NO CHANGES:**
- Kept `--font-ui` and `--font-terminal` as PRIMARY (avoid 158+ usage migrations)
- Aliases `--font-family-ui` / `--font-family-terminal` remain from Sessie 89 (future-preferred)

**Backward Compatibility:**
All deprecated variable names remain as aliases until v2.0 stable release (April 2026).

**Files Modified:**
- `styles/main.css`: +34 lines (16 deprecated aliases :root, 7 light mode overrides, 9 typography scale + comments)
- `docs/style-guide.md`: Typography section updated + deprecated variables table added
- `docs/css-variable-migration-guide.md`: This section (PLANNED → COMPLETED)

**Testing Results:**
- ✅ Both themes tested (dark + light)
- ✅ Zero visual regressions
- ✅ WCAG AAA maintained (7:1+ contrast ratios)
- ✅ Bundle size: 74KB → 76KB (+2KB, within budget)

---

## Migration Timeline

### v1.0 → v1.1 (Sessie 89) ✅
- **Date:** 26 december 2025
- **Changes:** Add 4 missing variables
- **Breaking:** No
- **Impact:** Fixed undefined variable bugs

### v1.1 → v1.2 (Sessie 90) ✅ COMPLETE
- **Date:** 26 december 2025
- **Changes:** Semantic cleanup, aliases added, DEPRECATED warnings
- **Breaking:** No (aliases maintain compatibility)
- **Impact:** Clearer naming, foundation for future scale

### v1.2 → v1.3 (Sessie 91) ✅ COMPLETE
- **Date:** 27 december 2025
- **Changes:** Featured content token system + blog documentation
- **Breaking:** No (tokens are additive)
- **Impact:** 100/100 Design System score achieved

**Added Variables:**

| Variable | Value (Dark) | Value (Light) | Purpose |
|----------|-------------|---------------|---------|
| `--featured-bg-emphasis` | rgba(255, 215, 0, 0.08) | rgba(255, 215, 0, 0.12) | Premium content background |
| `--featured-border-accent` | #ffd700 | #d97706 | Priority content borders |
| `--featured-text-strong` | #ffc107 | #b45309 | CTA emphasis text (WCAG AAA) |
| `--featured-ribbon-start` | #e67e22 | #e67e22 | Ribbon gradient start (alias) |
| `--featured-ribbon-end` | #d35400 | #d35400 | Ribbon gradient end (alias) |

**Documentation Added:**
- Style guide §Featured Content System (~176 lines)
- Style guide §6.11 Blog Design Patterns (~925 lines)

**Testing Results:**
- ✅ WCAG AAA maintained (7:1+ contrast for text tokens)
- ✅ Zero visual regressions (dark + light themes tested)
- ✅ Bundle size: 76KB → 77KB (+1KB, within budget)

### v1.3 → v2.0 (Sessie 94) 📅
- **Estimated:** April 2026 (3 months after v1.2)
- **Changes:** Remove deprecated aliases from Sessie 90
- **Breaking:** YES (old variable names will error)
- **Impact:** Clean design system, no technical debt

---

## For Developers

### Using This Guide:

1. **Always use NEW primary names in new code**
   - ✅ `font-family: var(--font-family-ui);`
   - ❌ `font-family: var(--font-ui);`

2. **Update OLD names when editing existing files**
   - If you touch a file with `--font-ui`, update it to `--font-family-ui`
   - Don't create new usages of deprecated variables

3. **Grep codebase for DEPRECATED variables monthly**
   ```bash
   grep -r "var(--font-ui)" styles/ src/
   grep -r "var(--color-text-light)" styles/ src/
   ```

4. **Plan for v2.0 alias removal**
   - Set reminder for 3 months post-Sessie 90
   - Budget time for final migration sweep

### Testing After Variable Changes:

**Manual Testing Checklist:**
1. Load `index.html` → Check terminal, resource cards, modals
2. Load `blog/index.html` → Check blog posts, category filters
3. Toggle theme (dark ↔ light) → Verify colors match Quick Reference
4. Open search modal → Check typography, input styling
5. Test affiliate links → Verify badge colors, hover states

**Automated Testing:**
```bash
# Run Playwright E2E tests
npm run test:all

# Lighthouse audit (check for layout shifts from CSS changes)
npx lighthouse https://famous-frangollo-b5a758.netlify.app --view
```

**Visual Regression Checklist:**
- [ ] Terminal prompt color unchanged (#9fef00 dark, #7ac800 light)
- [ ] Button colors match Sessie 88 (blue trust pattern)
- [ ] Blog borders match buttons (Sessie 89 fix maintained)
- [ ] Resource badges render correctly (no fallback fonts)
- [ ] Search modal typography consistent

---

## Sessie-by-Sessie Variable Changes

### Sessie 89 ✅
**Added:** 4 variables
**Deprecated:** 0 variables
**Removed:** 0 variables
**Total Variables:** 145 (was 141)

### Sessie 90 ✅
**Added:** 7 variables (typography scale)
**Deprecated:** 7 variables (text + chrome + modal aliases)
**Removed:** 0 variables (aliases kept for compatibility)
**Total Variables:** 152

### Sessie 91 (Current) ✅
**Added:** 5 variables (featured content tokens)
**Deprecated:** 0 variables
**Removed:** 0 variables
**Total Variables:** 157

### Sessie 92 ✅ COMPLETE
**Date:** 27 december 2025
**Changes:** Documentation only (§6.8 Monetization Component Library - ~1200 lines)
**Breaking:** No
**Impact:** Complete monetization component documentation for design system 100/100

**Documentation Added:**
- Section 6.8.1: Resource Card System (~268 lines)
- Section 6.8.2: Affiliate Badge & Ribbon System (~115 lines)
- Section 6.8.3: Category Badge System (~167 lines)
- Section 6.8.4: CTA Button Variations (~199 lines)
- Section 6.8.5: Featured Content System (~120 lines)
- Section 6.8.6: Data Attributes & Tracking (~110 lines)
- Section 6.8.7: Grid & Section Layout (~112 lines)
- Section 6.8.8: Bonus Donation CTA (~93 lines)
- Summary stats (~17 lines)

**Total:** 1201 lines of monetization component documentation

### Sessie 93-94 (Planned) 📅
**Changes:** Documentation only (§6.9 Core Design Systems, §6.10 Animation & Accessibility)
**Note:** Variable changes complete - roadmap focus shifts to documentation completion

### Sessie 95+ (Future) 📅
**Estimated:** April 2026 (v2.0 cleanup)
**Removed:** 7 variables (cleanup deprecated aliases from Sessie 90)
**Total Variables:** ~150 (clean, no deprecated aliases)

---

## Troubleshooting

### "My component is using a deprecated variable, what do I do?"

**Short term (before v2.0):**
- It still works via alias, no urgency
- Update when you next edit that file

**Long term (v2.0 release approaching):**
- Find-replace old name with new name
- Test visually before committing

### "I updated a variable but nothing changed visually"

**Expected scenarios:**
- Alias values are identical (e.g., `--font-mono` = `var(--font-terminal)`)
- These fixes prevent **future** bugs, not current visual changes

**Unexpected scenarios:**
- Check browser cache (Ctrl+Shift+R to hard refresh)
- Check CSS specificity conflicts
- Check if variable is actually used in that component

### "Build broke after variable rename"

**Likely causes:**
1. Minified CSS not rebuilt → Run `npm run build:css` (if exists)
2. Missed usage in grep → Search thoroughly before removing aliases
3. Third-party code using variables → Don't remove aliases for external code

**Rollback plan:**
```bash
git revert <commit-hash>
git push origin main
# Netlify auto-deploys rollback within 2 minutes
```

---

## Reference: Industry Standards

**Naming Conventions We Follow:**

| Pattern | Example | Industry Source |
|---------|---------|-----------------|
| `--[type]-[property]-[variant]` | `--color-text-primary` | Material Design, GitHub Primer |
| `--font-family-*` | `--font-family-ui` | Tailwind CSS, Bootstrap 5 |
| `--font-size-*` | `--font-size-lg` | Tailwind, Material UI |
| Semantic over descriptive | `--color-button-bg` not `--color-blue` | GitHub Primer, Atlassian Design |
| Purpose over appearance | `--color-text-secondary` not `--color-text-grey` | Material Design |

**Resources:**
- [GitHub Primer Design System](https://primer.style/primitives/colors)
- [Material Design 3 Tokens](https://m3.material.io/foundations/design-tokens/overview)
- [Tailwind CSS Variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables)

---

**Document Version:** 1.4 (Sessie 93)
**Last Updated:** 27 december 2025
**Last Synced:** Sessie 93 (Core Design Systems documentation complete)
**Maintained by:** HackSimulator.nl Design System Team (solo: Heisenberg)
