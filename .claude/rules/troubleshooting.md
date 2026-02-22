# Troubleshooting (Top 9 Common Issues)

## Build & Performance

1. **Bundle >500KB:** Check imports | Minify JS/CSS | Tree-shake | Remove unused code
   - Measure: `du -sb styles/*.css src/ *.html | awk '{sum+=$1} END {print sum/1024 "KB"}'`
   - Exclude backup files (*.backup*) from measurements

2. **CSS not live on production:** 1-hour Netlify cache normal - wait OR bump `?v=X` immediately
   - Quick fix: Update version param in HTML `<link>` tags
   - Root cause: Sessie 78 cache strategy (short TTL + must-revalidate)

3. **Slow load time (>3s):** Check Lighthouse Performance score, optimize images, defer JS
   - Tool: `npx lighthouse https://hacksimulator.nl/ --view`

## Testing & Events

4. **Playwright passes, manual fails:** Duplicate event listeners → commands execute 2x
   - Root cause: Sessie 52 - event handlers registered twice
   - Fix: Check `src/ui/input.js` - ensure `addEventListener` only called once
   - Test: Open DevTools → Console → type command → should see 1 output, not 2

5. **Focus/keyboard bugs:** Modal active but terminal still captures input
   - Root cause: Missing modal protection check
   - Fix: Add `if (document.querySelector('.modal.active')) return;` to keydown handler
   - File: `src/ui/input.js`
   - Affected: Legal modal, feedback form, tutorial system

6. **localStorage not persisting:** Quota exceeded (rare) OR privacy mode blocking
   - Debug: `console.log(localStorage.length, JSON.stringify(localStorage).length)`
   - Fix: Implement cleanup - remove old command history >30 days

## Visual & Layout

7. **Light mode colors invisible:** Theme-dependent colors on fixed dark backgrounds
   - Example: `var(--color-text)` on dark navbar → invisible in light theme
   - Fix: Use theme-agnostic colors for fixed backgrounds (Sessie 44 Dark Frame pattern)
   - File: `styles/main.css` (navbar/footer always dark)

8. **Layout jank on hover:** Missing transparent border reserve → elements shift
   - Fix: Add `border: 2px solid transparent` to default state
   - Example: `.btn { border: 2px solid transparent; }` → `.btn:hover { border-color: var(--color-primary); }`

## Mobile Specific

9. **Touch events not firing:** Missing touch handlers OR tap targets <44x44px
   - Fix: Add `touchstart` listeners alongside `click` events
   - Minimum size: `min-width: 44px; min-height: 44px;` (WCAG AAA)
   - File: `styles/mobile.css`

## Playwright / Testing

10. **Playwright tests hangen na afloop (process stopt nooit):** `html` reporter start webserver die wacht op Ctrl+C
   - Root cause: `['html']` in `playwright.config.js` → `open: 'on-failure'` (default) start blocking server
   - Fix: `['html', { open: 'never' }]` — genereert report zonder server te starten
   - Bekijk report achteraf: `npx playwright show-report`
   - File: `playwright.config.js` (reporter sectie)

→ **Volledige troubleshooting:** docs/sessions/current.md §Common Issues
→ **Memory leak debugging:** docs/testing/memory-leak-results.md
