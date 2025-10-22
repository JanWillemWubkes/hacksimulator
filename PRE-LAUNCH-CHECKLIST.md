# PRE-LAUNCH CHECKLIST - HackSimulator.nl

**Status:** M5 Testing & Launch Phase
**Created:** 17 oktober 2025
**Purpose:** Centralized tracking van alle pre-launch placeholders en critical tasks

---

## 🔴 CRITICAL - Must Fix Before Launch

⏰ **TIMING:** Setup deze configuratie 24-48u VOOR deployment (niet eerder nodig)

### 1. Analytics Configuration

**File:** `src/analytics/tracker.js`

- [ ] **Line 75:** Replace `G-XXXXXXXXXX` with real GA4 Measurement ID
- [ ] **Line 121:** Replace `G-XXXXXXXXXX` with real GA4 Measurement ID (disable tracking)
- [ ] **Line 108:** Replace `hacksimulator.nl` with actual domain (if different)

**⏱️ Setup Tijd:** ~20 minuten

**How to get GA4 ID:**
1. Visit https://analytics.google.com
2. Create property: "HackSimulator.nl"
3. Choose platform: "Web"
4. Get Measurement ID (format: `G-XXXXXXXXXX`)
5. Find & replace `G-XXXXXXXXXX` in tracker.js (2 locations)

**💡 TIP:** Doe dit PAS vlak voor deployment - GA4 tracking werkt toch niet op localhost

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

**⏱️ Setup Tijd:** ~30 minuten (inclusief email provider registratie)

**Email Setup Options:**

**🎯 AANBEVOLEN voor MVP: Single Email (Option B)**
- Service: Google Workspace (€5.75/mnd) of Zoho Mail (gratis)
- Email: `info@hacksimulator.nl`
- Setup: Vervang ALLE placeholder emails met `info@hacksimulator.nl`
- Pro: Simple, compliant, eenvoudig te beheren

**Alternatief: Multiple Aliases (Option A)**
- Zelfde inbox, meerdere aliassen: privacy@, legal@, cookies@
- Setup via Google Workspace of Zoho admin panel
- Pro: Professioneler, filtering mogelijk

**Quick Alternative: Email Forwarding**
- Via domein registrar (TransIP, Versio, etc.)
- Forward `info@hacksimulator.nl` → persoonlijke Gmail
- Pro: Gratis, 5 minuten setup
- Con: Geen afzender vanaf @hacksimulator.nl domein

**💡 TIP:** Doe email setup PAS na domein registratie

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

**✅ COMPLETED - Automated Playwright Tests (22 oktober 2025)**

**Tested browsers:**
- [x] **Chromium** (Chrome/Edge) - 8/8 tests passing ✅
- [x] **Firefox** - 8/8 tests passing ✅
- [ ] **WebKit/Safari** - Blocked by system dependencies (not critical - works on real macOS/iOS)
- [ ] Mobile Safari iOS 16+ (real device required)
- [ ] Chrome Mobile Android 12+ (real device required)

**Automated test coverage (Chromium + Firefox verified):**
- [x] Terminal renders correctly
- [x] First visit flow - Legal modal and cookie consent
- [x] Basic commands execute without errors (help, whoami, ls, echo)
- [x] Command history navigation works (Arrow keys)
- [x] localStorage persists across page reloads
- [x] Keyboard navigation works correctly
- [x] Error handling and fuzzy matching work
- [x] Footer links are accessible and work

**Test Results:**
- Chromium: 8/8 passing (19.5s runtime)
- Firefox: 8/8 passing (31.3s runtime)
- WebKit: Skipped (missing libevent-2.1-7t64 + libavif16 system deps - dev environment issue only)

**Live URL tested:** https://famous-frangollo-b5a758.netlify.app/

**Remaining manual testing:**
- [ ] Safari macOS (real device - WebKit simulation blocked)
- [ ] Mobile Safari iOS 16+ (real device!)
- [ ] Chrome Mobile Android 12+ (real device!)

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

---

## 🎯 Deployment Day Workflow (24-48u voor launch)

**Totale tijd:** ~1 uur voor alle configuratie

### Step 1: Domain & Email (30 min)
1. Register `hacksimulator.nl` (of verifieer ownership)
2. Setup email forwarding OF Google Workspace/Zoho
3. Verify email delivery (stuur testmail)

### Step 2: Analytics Setup (20 min)
1. Create GA4 property via https://analytics.google.com
2. Copy Measurement ID (format: `G-XXXXXXXXXX`)
3. Update `src/analytics/tracker.js` lines 75 + 121

### Step 3: Replace Placeholders (5 min)
```bash
# Find & replace GA4 ID (gebruik echte ID)
sed -i "s/G-XXXXXXXXXX/G-YOUR_REAL_ID/g" src/analytics/tracker.js

# Replace emails (single email aanpak)
sed -i "s/\[contact@hacksimulator.nl - TO BE ADDED\]/info@hacksimulator.nl/g" assets/legal/*.html
sed -i "s/\[privacy@hacksimulator.nl - TO BE ADDED\]/info@hacksimulator.nl/g" assets/legal/*.html
sed -i "s/\[legal@hacksimulator.nl - TO BE ADDED\]/info@hacksimulator.nl/g" assets/legal/*.html
sed -i "s/\[cookies@hacksimulator.nl - TO BE ADDED\]/info@hacksimulator.nl/g" assets/legal/*.html
```

### Step 4: Verification (5 min)
```bash
# Check geen placeholders over
grep -r "TO BE ADDED\|XXXXXXXXXX" src/ assets/ --include="*.js" --include="*.html"

# Should return: (no output = success)
```

### Step 5: Git Commit & Deploy
```bash
git add .
git commit -m "Configure production: GA4 + contact emails"
git push origin main
# Netlify auto-deploys from main branch
```

---

**Last updated:** 18 oktober 2025
**Status:** Updated met deployment workflow (Sessie 13)
**Owner:** Development Team

**Next steps:**
1. ✅ Configuration strategy documented
2. 🎯 Focus on M5 testing tasks (HIGH PRIORITY section)
3. 📧 Execute deployment workflow 24-48u voor launch
