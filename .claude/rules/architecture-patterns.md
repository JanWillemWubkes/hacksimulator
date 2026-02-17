# Architectural Patterns

## 1. CSS Variables First (Sessie 90 - Design System)

Always use CSS variables for colors, spacing, typography.

**DO:**
```css
.terminal-output-error {
  color: var(--color-error);  /* Theme-aware */
  font-size: var(--font-size-base);
}
```

**DON'T:**
```css
.terminal-output-error {
  color: #ff0000;  /* Hardcoded, breaks dark mode */
  font-size: 16px;
}
```

**Why:** Theme switching, design system consistency, single source of truth
**Files:** `styles/main.css` (165 variables), Style Guide v1.5

---

## 2. Modal Protection Pattern (Sessie 77 - Focus Management)

Prevent input capture when modal is active.

**DO:**
```javascript
// src/ui/input.js
document.addEventListener('keydown', (e) => {
  if (document.querySelector('.modal.active')) return;
  handleTerminalInput(e);
});
```

**DON'T:**
```javascript
document.addEventListener('keydown', handleTerminalInput);
```

**Why:** Prevents keyboard shortcuts firing while modal open (legal disclaimer, feedback form)
**Files:** `src/ui/input.js`, `src/ui/legal.js`, `src/ui/feedback.js`
**Test:** Open legal modal → type command → should NOT appear in terminal

---

## 3. Quick Reference (Other Patterns)

- **Dark Frame:** navbar/footer always dark (Sessie 44) → `styles/main.css`
- **No Duplicate Listeners:** Event delegation over per-element handlers (Sessie 52) → `src/ui/input.js`
- **3-Layer Modals:** Legal (z-10) > Feedback (z-20) > Tutorial (z-30) - Sessie 33
- **Cache Strategy:** 1-hour cache + `?v=X` override (Sessie 78) → `_headers` file

→ **All 40+ patterns indexed:** docs/sessions/current.md
