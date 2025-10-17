# PRE-LAUNCH CHECKLIST - HackSimulator.nl

**Status:** M5 Testing & Launch Phase
**Created:** 17 oktober 2025
**Purpose:** Centralized tracking van alle pre-launch placeholders en critical tasks

---

## 🔴 CRITICAL - Must Fix Before Launch

### 1. Analytics Configuration

**File:** `src/analytics/tracker.js`

- [ ] **Line 75:** Replace `G-XXXXXXXXXX` with real GA4 Measurement ID
- [ ] **Line 121:** Replace `G-XXXXXXXXXX` with real GA4 Measurement ID (disable tracking)
- [ ] **Line 108:** Replace `hacksimulator.nl` with actual domain (if different)

**How to get GA4 ID:**
1. Visit https://analytics.google.com
2. Create property: "HackSimulator.nl"
3. Get Measurement ID (format: `G-XXXXXXXXXX`)
4. Replace ALL occurrences in tracker.js

---

### 2. Contact Email Addresses

**Files:** All legal documents in `assets/legal/`

#### Privacy Policy (`privacy.html`)
- [ ] **Line 103:** Replace `[contact@hacksimulator.nl - TO BE ADDED]`
- [ ] **Line 394:** Replace `[privacy@hacksimulator.nl - TO BE ADDED]`

#### Terms of Service (`terms.html`)
- [ ] **Line 346:** Replace `[legal@hacksimulator.nl - TO BE ADDED]`

#### Cookie Policy (`cookies.html`)
- [ ] **Line 353:** Replace `[cookies@hacksimulator.nl - TO BE ADDED]`

**Email Setup Options:**
- **Option A:** Create dedicated emails (privacy@, legal@, cookies@)
- **Option B:** Use single contact email (contact@) for all
- **Option C:** Use personal email temporarily (mark in docs: "temporarily")

**Recommended:** Option A (professional) or B (simpler for MVP)

---

### 3. Domain Configuration

- [ ] Register domain: `hacksimulator.nl` (or confirm ownership)
- [ ] Update all references if using different domain:
  - `src/analytics/tracker.js` line 108 (Plausible domain)
  - Legal documents (if domain mentioned explicitly)
  - README.md (if exists)

---

## 🟡 HIGH PRIORITY - Before Beta Testing

### 4. Performance Validation

- [ ] Measure bundle size (must be < 500KB)
  - **How:** Use browser DevTools Network tab, disable cache
  - **Target:** Total < 500KB (HTML + CSS + JS)
- [ ] Test load time on 4G connection (must be < 3 seconds)
  - **How:** Chrome DevTools → Network → Throttling → "Fast 3G"
  - **Target:** Time to Interactive < 3 seconds
- [ ] Run Lighthouse audit (target score > 90)
  - **How:** Chrome DevTools → Lighthouse → Generate report
  - **Target:** Performance > 90, Accessibility > 90

---

### 5. Cross-Browser Testing

**Required browsers (PRD §6.4):**
- [ ] Chrome Windows (latest)
- [ ] Chrome macOS (latest)
- [ ] Firefox Windows (latest)
- [ ] Safari macOS (latest)
- [ ] Edge Windows (latest)
- [ ] Mobile Safari iOS 16+ (real device!)
- [ ] Chrome Mobile Android 12+ (real device!)

**Test checklist per browser:**
- [ ] Terminal renders correctly
- [ ] Commands execute without errors
- [ ] localStorage persists across sessions
- [ ] Keyboard navigation works (Tab, Enter, arrows)
- [ ] Legal modal shows on first visit
- [ ] Cookie consent banner works
- [ ] No console errors

---

### 6. Accessibility Testing

- [ ] Keyboard navigation (Tab through all interactive elements)
- [ ] Focus indicators visible (2px outline)
- [ ] Color contrast check (4.5:1 ratio for all text)
  - **Tool:** https://webaim.org/resources/contrastchecker/
- [ ] Font scaling test (200% zoom in browser)
- [ ] Screen reader basic test (optional but recommended)
  - **Tools:** NVDA (Windows), VoiceOver (macOS)

---

## 🟢 MEDIUM PRIORITY - Before Production

### 7. Content Review

- [ ] All UI text in Nederlands (no English UI)
- [ ] All 30 commands have man pages
- [ ] Educational tips present bij security tools
- [ ] Juridische warnings correct bij offensive tools
- [ ] Spelling check all legal documents
- [ ] Disclaimer prominent on homepage

---

### 8. Security Review

- [ ] Content Security Policy (CSP) headers configured
  - **Check:** Browser DevTools → Network → Response headers
- [ ] Input sanitization review (XSS preventie)
  - **Test:** Try `<script>alert('xss')</script>` in commands
- [ ] localStorage security (geen gevoelige data)
  - **Check:** DevTools → Application → Local Storage
- [ ] Analytics privacy (geen PII, geen command args)
  - **Verify:** Check `tracker.js` privacy checks (lines 137-143)
- [ ] External links use `rel="noopener noreferrer"`

---

### 9. Beta Testing Setup

- [ ] Recruit 5 beta testers:
  - 2x beginners (no tech background)
  - 2x IT students
  - 1x experienced developer
- [ ] Create feedback form (Google Forms or similar)
- [ ] Prepare test scenarios document:
  - First-time user flow (onboarding)
  - Command exploration (trial & error)
  - Error recovery (typos, wrong args)
  - Mobile experience
  - Return visit (localStorage restore)
- [ ] Optional: Screen recording instructions

---

### 10. Deployment Preparation

- [ ] Create Netlify account (or chosen hosting)
- [ ] Connect Git repository to Netlify
- [ ] Configure build settings (if using minification)
- [ ] Set environment variables (production config)
- [ ] Test deployment on staging URL first
- [ ] Prepare rollback plan (Git tag for v1.0.0-mvp)

---

## 📝 Post-Launch (Week 1)

### 11. Monitoring Setup

- [ ] Verify analytics tracking works (test event in GA4)
- [ ] Monitor error rate (console.log check)
- [ ] Check performance metrics (load times via GA4)
- [ ] Daily bug triage (if issues reported)
- [ ] Collect user feedback (feedback widget data)

---

## 🔍 Verification Commands

**Check for remaining placeholders:**
```bash
grep -r "TODO\|PLACEHOLDER\|TO BE ADDED\|XXXXX" src/ assets/ --include="*.js" --include="*.html"
```

**Check bundle size:**
```bash
find . -name "*.js" -o -name "*.css" -o -name "*.html" | xargs wc -c
```

**Find all localStorage usage (ensure try-catch):**
```bash
grep -rn "localStorage\." src/ --include="*.js"
```

---

## ✅ Quick Checklist Summary

Before launch, ALL these must be ✅:

- [ ] GA4 ID replaced (3 locations in tracker.js)
- [ ] Contact emails added (4 locations in legal docs)
- [ ] Domain registered/configured
- [ ] Bundle size < 500KB
- [ ] Load time < 3 seconds on 4G
- [ ] Tested on 5+ browsers (incl. mobile)
- [ ] No console errors in production
- [ ] Beta tested by 5+ users
- [ ] Legal documents complete and reviewed
- [ ] Analytics consent working correctly

---

**Last updated:** 17 oktober 2025
**Status:** Created for M5 phase
**Owner:** Development Team

**Next steps:**
1. Fix CRITICAL items (placeholders)
2. Run HIGH PRIORITY validations
3. Execute M5 testing tasks (see TASKS.md)
4. Launch when all ✅
