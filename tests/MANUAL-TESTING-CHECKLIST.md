# Manual Testing Checklist - Affiliate CTA Optimization

**Purpose:** Validate Phases 1-4 implementation (ribbon badges, category contrast, CTA animations)
**Date:** 2025-12-25
**Tester:** __________
**Build:** Phase 4 complete (commit bc47dd8)

---

## Pre-Test Setup

- [ ] Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- [ ] Test on fresh incognito/private window
- [ ] Ensure latest deployment is live on Netlify
- [ ] Check deployment status: https://app.netlify.com/sites/hacksimulator/deploys

**Test URLs:**
1. https://hacksimulator.nl/blog/top-5-hacking-boeken.html
2. https://hacksimulator.nl/blog/beste-online-cursussen-ethical-hacking.html

---

## Section 1: Visual Rendering (Desktop)

**Browser:** Chrome/Firefox/Safari
**Viewport:** 1280x720 or larger

### Affiliate Ribbon (Phase 3)
- [ ] Ribbon appears in **top-right corner** of each card
- [ ] Ribbon shows **orange gradient** background (#e67e22 → #d35400)
- [ ] Text reads "**[ AFFILIATE ]**" with ASCII brackets
- [ ] Ribbon does **NOT overlap** title or category badge
- [ ] Ribbon has **angled bottom-left corner** (clip-path polygon)
- [ ] All 5 book cards have ribbon (top-5-hacking-boeken.html)
- [ ] All 3 course cards have ribbon (beste-online-cursussen-ethical-hacking.html)

### Category Badges (Phase 2)
- [ ] **PENTEST** badge: Green background (#27ae60), white text, 2px darker green border
- [ ] **WEB SEC** badge: Blue background (#3498db), white text, 2px darker blue border
- [ ] **EXPLOITS** badge: Teal background (#16a085), white text, 2px darker teal border
- [ ] **PYTHON** badge: Orange background (#f39c12), **dark text** (#0a0a0a), 2px darker orange border
- [ ] **SOCIAL ENG** badge: Red background (#e74c3c), white text, 2px darker red border
- [ ] All badges are **clearly visible** in current theme
- [ ] Badges have **subtle shadow** for depth (0 2px 4px rgba)

### Text Wrapping Fix (Phase 1)
- [ ] Old inline `[AFFILIATE]` badge is **completely removed** from button text
- [ ] CTA buttons show only "**Bekijk op Bol.com**" or similar (no affiliate badge)
- [ ] No text wrapping issues on any element

### Card Layout
- [ ] `.resource-card__header` has **padding-top** (~36px) to prevent ribbon overlap
- [ ] Card structure: Ribbon → Header (badge + title) → Description → Meta → CTA
- [ ] Cards are vertically aligned in grid
- [ ] No layout shift on page load

---

## Section 2: Interactive Behavior (Desktop)

### Category Badge Hover
- [ ] Hover over badge: **Lifts slightly** (translateY -1px)
- [ ] Hover: **Shadow increases** (0 3px 8px rgba)
- [ ] Transition is **smooth** (~150ms)
- [ ] No jank or stuttering

### CTA Button Hover (Phase 4)
- [ ] Button shows **arrow indicator** (→) at end of text
- [ ] Hover: Button **lifts** (translateY -2px)
- [ ] Hover: **Shadow elevation** appears (0 4px 12px blue glow)
- [ ] Hover: **Arrow slides right** (translateX 4px)
- [ ] Hover: Background color **lightens** slightly (#4a9eff)
- [ ] Transition is **smooth** (200ms)
- [ ] No jank or stuttering

### CTA Button Click
- [ ] Click: Button **presses down** (translateY 0)
- [ ] Click: **Opens new tab** with affiliate link
- [ ] Click: No console errors

### Keyboard Navigation
- [ ] Press **Tab** key repeatedly to navigate page
- [ ] CTA buttons receive **visible focus outline** (3px solid)
- [ ] Focus outline has **2px offset** for clarity
- [ ] Can activate button with **Enter** or **Space** key
- [ ] Focus order is logical: Badge → Title → CTA (per card)

---

## Section 3: Theme Compatibility

### Light Theme
- [ ] Switch to **Light theme** via toggle button
- [ ] Category badges are **clearly visible** (not washed out)
- [ ] Ribbon is **clearly visible** against light card background
- [ ] CTA button has good contrast
- [ ] No text becomes unreadable

### Dark Theme
- [ ] Switch to **Dark theme** via toggle button
- [ ] Category badges are **clearly visible** (not too dim)
- [ ] Ribbon is **clearly visible** against dark card background
- [ ] CTA button has good contrast
- [ ] No text becomes unreadable

### Theme Toggle Persistence
- [ ] Toggle theme, **refresh page**: Theme persists
- [ ] No flash of unstyled content (FOUC)
- [ ] All elements render in correct theme on load

---

## Section 4: Mobile Responsiveness

**Device:** iPhone/Android or Chrome DevTools mobile emulation
**Viewports to test:** 375x667 (iPhone SE), 414x896 (iPhone 11), 360x640 (Android)

### Visual Rendering
- [ ] Grid switches to **single column** layout
- [ ] Ribbon is **smaller** (font-size 0.65rem, padding 6px 12px)
- [ ] Ribbon does **NOT overlap** title on small screens
- [ ] Header padding is **reduced** to 32px
- [ ] Category badges do **NOT wrap** to multiple lines
- [ ] All text is **readable** without zooming

### CTA Button
- [ ] CTA button is **full width** of card
- [ ] Button has **44px+ height** (WCAG 2.5.5 touch target minimum)
- [ ] Padding is **16px vertical** for larger thumb target
- [ ] Arrow indicator is **visible**
- [ ] **Tap** button: No hover jank (hover states don't persist on mobile)

### Touch Interactions
- [ ] Tap CTA: Opens link in new tab
- [ ] Tap category badge: No action (decorative, not interactive on mobile)
- [ ] No accidental taps due to small targets
- [ ] Scroll is smooth, no janky animations

### Landscape Mode
- [ ] Rotate device to landscape
- [ ] Layout adapts appropriately
- [ ] Ribbon remains in top-right
- [ ] No horizontal scroll

---

## Section 5: Tablet (768px - 1024px)

**Device:** iPad or Chrome DevTools tablet emulation
**Viewports to test:** 768x1024 (iPad), 1024x768 (iPad landscape)

### Layout
- [ ] Grid shows **2 columns** (not 1, not 3)
- [ ] Cards are evenly spaced
- [ ] Ribbon renders at desktop size (not mobile size)
- [ ] CTA buttons are full-width within cards
- [ ] Touch targets are 44px+ (if touchscreen)

---

## Section 6: Cross-Browser Testing

### Chrome
- [ ] All visual tests pass
- [ ] All interactive tests pass
- [ ] Gradient renders correctly
- [ ] Clip-path polygon works

### Firefox
- [ ] All visual tests pass
- [ ] All interactive tests pass
- [ ] Gradient renders correctly
- [ ] Clip-path polygon works

### Safari (if available)
- [ ] All visual tests pass
- [ ] All interactive tests pass
- [ ] Gradient renders correctly
- [ ] Clip-path polygon works
- [ ] No webkit-specific issues

### Edge (if available)
- [ ] All visual tests pass
- [ ] All interactive tests pass
- [ ] Gradient renders correctly

---

## Section 7: Accessibility

### Screen Reader (Optional - NVDA/JAWS/VoiceOver)
- [ ] Ribbon content is announced correctly
- [ ] Category badges are announced with semantic meaning
- [ ] CTA links are announced with "Affiliate" disclosure
- [ ] Link purpose is clear from context
- [ ] No meaningless or confusing announcements

### Keyboard-Only Navigation
- [ ] **No mouse usage** - navigate entire page with keyboard
- [ ] All interactive elements are reachable via Tab
- [ ] Focus indicators are visible at all times
- [ ] Can activate all CTAs with Enter/Space
- [ ] Can skip to main content (if skip link exists)

### Reduced Motion Preference
- [ ] **System setting:** Enable "Reduce motion" (macOS: Accessibility → Display → Reduce motion)
- [ ] Reload page with reduced motion enabled
- [ ] Badge hover: **NO transform** animation
- [ ] CTA hover: **NO transform** animation
- [ ] CTA arrow: **NO translateX** animation
- [ ] All other functionality works normally

---

## Section 8: Performance

### Page Load
- [ ] Page loads in **< 3 seconds** on 3G connection (Chrome DevTools throttling)
- [ ] No layout shift (CLS < 0.1)
- [ ] Ribbon appears immediately (not after delay)
- [ ] No flash of unstyled content (FOUC)

### Animation Performance
- [ ] Hover animations are **smooth** (60 FPS)
- [ ] No janky scrolling
- [ ] No excessive CPU usage (check DevTools Performance tab)

### Bundle Size
- [ ] Check main.css file size: **Should be < 500KB**
- [ ] Check network tab: CSS loads quickly
- [ ] No unnecessary assets loaded

---

## Section 9: Visual Regression

### Screenshot Comparison
- [ ] Take screenshot of **book grid** (light theme)
- [ ] Take screenshot of **book grid** (dark theme)
- [ ] Compare with previous design (if available)
- [ ] Verify no unintended changes to other page elements
- [ ] Check footer, header, navigation remain unchanged

---

## Section 10: Edge Cases

### Content Overflow
- [ ] **Long book title:** Does it wrap correctly without breaking layout?
- [ ] **Long description:** Does card expand appropriately?
- [ ] **Very short title:** Does ribbon still position correctly?

### Browser Zoom
- [ ] Zoom to **200%**: All text readable, layout intact
- [ ] Zoom to **50%**: Layout doesn't break
- [ ] Ribbon remains in top-right at all zoom levels

### Slow Network
- [ ] Chrome DevTools: Throttle to "Slow 3G"
- [ ] Reload page
- [ ] CSS loads before rendering (no FOUC)
- [ ] Page is usable during load

### Disabled JavaScript
- [ ] Disable JavaScript in browser
- [ ] Reload page
- [ ] CSS styling still works (all phases are CSS-only)
- [ ] Links still functional
- [ ] Only JS-dependent features (theme toggle) fail gracefully

---

## Section 11: SEO & Metadata

### Affiliate Disclosure Compliance
- [ ] Each CTA link has `rel="sponsored noopener noreferrer"`
- [ ] Each CTA link has `aria-label` mentioning "Affiliate"
- [ ] Ribbon clearly discloses affiliate relationship
- [ ] No deceptive practices (clear, transparent)

### Link Attributes
- [ ] All CTA links have `target="_blank"` (open in new tab)
- [ ] All CTA links have `href` attribute with valid URL
- [ ] All CTA links have `data-program` attribute (tracking)
- [ ] All CTA links have `data-product` attribute (tracking)

---

## Bugs Found

| Bug # | Page | Issue | Severity | Screenshot |
|-------|------|-------|----------|------------|
| 1 | | | High/Med/Low | |
| 2 | | | High/Med/Low | |
| 3 | | | High/Med/Low | |

---

## Sign-Off

**Tester Name:** __________
**Date:** __________
**Overall Result:** ☐ PASS | ☐ FAIL (see bugs)
**Notes:**

---

## Next Steps After Manual Testing

1. **Run Lighthouse Audit** (see instructions below)
2. **Run Playwright E2E tests** (see commands below)
3. **WCAG Contrast Validation** (see tools below)
4. **Performance profiling** (see Chrome DevTools guide)

### Lighthouse Audit
```bash
npx lighthouse https://hacksimulator.nl/blog/top-5-hacking-boeken.html --view

# Target scores:
# Accessibility: 100/100
# Performance: 90+/100
# Best Practices: 100/100
# SEO: 90+/100
```

### Run E2E Tests
```bash
# All tests
npx playwright test tests/e2e/affiliate-badges.spec.js

# Chromium only (fast)
npx playwright test tests/e2e/affiliate-badges.spec.js --project=chromium

# Debug mode (visual)
npx playwright test tests/e2e/affiliate-badges.spec.js --ui

# Specific test
npx playwright test tests/e2e/affiliate-badges.spec.js -g "affiliate ribbon"
```

### WCAG Contrast Checker
**Tool:** https://webaim.org/resources/contrastchecker/

**Test each badge:**
1. PENTEST: #27ae60 bg / #ffffff text → Expect 4.7:1 (AA+)
2. WEB SEC: #3498db bg / #ffffff text → Expect 4.5:1 (AA)
3. EXPLOITS: #16a085 bg / #ffffff text → Expect 4.6:1 (AA)
4. PYTHON: #f39c12 bg / #0a0a0a text → Expect 8.9:1 (AAA ✓)
5. SOCIAL ENG: #e74c3c bg / #ffffff text → Expect 4.8:1 (AA+)
6. Ribbon: #e67e22 bg / #ffffff text → Check actual ratio

**Pass criteria:** All ratios ≥ 4.5:1 for AA compliance

### Colorblindness Simulation
**Tool:** Chrome DevTools → Rendering → Emulate vision deficiencies

**Test:**
- Deuteranopia (red-green blindness)
- Protanopia (red blindness)
- Tritanopia (blue-yellow blindness)
- Achromatopsia (total color blindness)

**Pass criteria:** Badges remain distinguishable by shape, position, or label

---

**End of Manual Testing Checklist**
*Generated: 2025-12-25 | Phase 5 Testing*
