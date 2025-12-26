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

## Sessie 90 - Semantic Cleanup (PLANNED)

**Text Variables - Consolidation:**

| Old (DEPRECATED v1.1) | New (Primary) | Migration Action | Rationale |
|-----------------------|---------------|------------------|-----------|
| `--color-text` | `--color-text-primary` | Update usages + keep alias | Generic name → semantic purpose |
| `--color-text-light` | `--color-text-primary` | Update usages + keep alias | "Light" is ambiguous in light theme |
| `--color-text-dim` | `--color-text-secondary` | Update usages + keep alias | Consolidate with --color-text-muted |
| `--color-text-muted` | `--color-text-secondary` | Update usages + keep alias | Same value as --color-text-dim |
| `--color-ui-secondary` | `--color-text-secondary` | Update usages + keep alias | Actually used for text, not UI |

**Font Variables - Naming Consistency:**

| Old (DEPRECATED v1.1) | New (Primary) | Migration Action | Rationale |
|-----------------------|---------------|------------------|-----------|
| `--font-ui` | `--font-family-ui` | Update usages + keep alias | Consistent with --font-size-*, --font-weight-* pattern |
| `--font-terminal` | `--font-family-terminal` | Update usages + keep alias | Consistent with --font-size-*, --font-weight-* pattern |

**Typography Scale - NEW TOKENS:**

| Variable | Value | Usage |
|----------|-------|-------|
| `--font-size-xs` | `0.75rem` (12px) | Disclaimers, captions |
| `--font-size-sm` | `0.875rem` (14px) | Secondary text, metadata |
| `--font-size-md` | `1rem` (16px) | Body text (default) |
| `--font-size-lg` | `1.25rem` (20px) | Subheadings, emphasis |
| `--font-size-xl` | `1.5rem` (24px) | H3 headings |
| `--font-size-2xl` | `1.953rem` (31px) | H2 headings |
| `--font-size-3xl` | `2.441rem` (39px) | H1 headings, hero text |

**Featured Content - NEW TOKENS:**

| Variable | Value | Usage |
|----------|-------|-------|
| `--badge-featured-bg` | `linear-gradient(135deg, #27ae60 0%, #229954 100%)` | Featured affiliate badge background |
| `--badge-featured-border` | `#2ecc71` | Featured badge border |
| `--badge-featured-hover` | `#229954` | Featured badge hover state |
| `--badge-featured-shadow` | `rgba(39, 174, 96, 0.3)` | Featured badge box-shadow |

**Missing Input Tokens:**

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-bg-input` | `var(--color-bg-hover)` | Input fields, textareas (already added in Sessie 89) |

**Backward Compatibility:**
All old variable names remain as aliases until v2.0 stable release (estimated 3 months after Sessie 90).

**Migration Strategy:**
1. **Phase 1 (Sessie 90):** Add new variables, create aliases for old names
2. **Phase 2 (Ongoing):** Update usages in new code to use new names
3. **Phase 3 (v2.0):** Remove deprecated aliases in breaking release

---

## Migration Timeline

### v1.0 → v1.1 (Sessie 89) ✅
- **Date:** 26 december 2025
- **Changes:** Add 4 missing variables
- **Breaking:** No
- **Impact:** Fixed undefined variable bugs

### v1.1 → v1.2 (Sessie 90) 🔜
- **Estimated:** January 2026
- **Changes:** Semantic cleanup, aliases added, DEPRECATED warnings
- **Breaking:** No (aliases maintain compatibility)
- **Impact:** Clearer naming, foundation for future scale

### v1.2 → v2.0 (Sessie 94) 📅
- **Estimated:** April 2026 (3 months after v1.2)
- **Changes:** Remove deprecated aliases
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

### Sessie 89 (Current) ✅
**Added:** 4 variables
**Deprecated:** 0 variables
**Removed:** 0 variables
**Total Variables:** 145 (was 141)

### Sessie 90 (Planned) 🔜
**Added:** ~15 variables (typography scale + featured tokens)
**Deprecated:** 7 variables (text + font aliases)
**Removed:** 0 variables (aliases kept for compatibility)
**Total Variables:** ~160

### Sessie 91-93 (Planned) 📅
**Changes:** Documentation only, no variable changes expected

### Sessie 94 (Planned) 📅
**Added:** Animation tokens (if needed)
**Deprecated:** 0 variables
**Removed:** 7 variables (cleanup deprecated aliases from Sessie 90)
**Total Variables:** ~160 (clean, no deprecated aliases)

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

**Document Version:** 1.0 (Sessie 89)
**Next Update:** Sessie 90 (post-semantic cleanup)
**Maintained by:** HackSimulator.nl Design System Team (solo: Heisenberg)
