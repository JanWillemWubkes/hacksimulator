# PRE-LAUNCH CHECKLIST - HackSimulator.nl

**Status:** ✅ LAUNCHED — hacksimulator.nl is LIVE
**Created:** 17 oktober 2025
**Updated:** 18 februari 2026 (Sessie 102)
**Purpose:** Centralized tracking van alle pre-launch placeholders en critical tasks

---

## 🔴 CRITICAL - Must Fix Before Launch

⏰ **TIMING:** Setup deze configuratie 24-48u VOOR deployment (niet eerder nodig)

### 1. Analytics Configuration ✅ VOLTOOID (Sessie 91)

**File:** `src/analytics/tracker.js`

- [x] **GA4 Measurement ID:** `G-7F792VS6CE` ingevuld (Sessie 91)
- [x] **Domain:** `hacksimulator.nl` correct geconfigureerd
- [x] **IP Anonymization:** Actief (`anonymize_ip: true`)
- [x] **PII Blocking:** Command args worden actief gefilterd

---

### 2. Contact Email Addresses ✅ VOLTOOID (Sessie 91)

- [x] contact@hacksimulator.nl geconfigureerd (Gmail forwarding)
- [x] Privacy Policy email ingevuld
- [x] Terms of Service email ingevuld
- [x] Cookie Policy email ingevuld

---

### 3. Domain Configuration ✅ VOLTOOID

- [x] Domain `hacksimulator.nl` geregistreerd en live
- [x] DNS geconfigureerd naar Netlify
- [x] HTTPS certificaat actief (auto via Netlify)
- [x] HSTS header actief (max-age=31536000)
- [x] 301 redirect van famous-frangollo-b5a758.netlify.app naar hacksimulator.nl

---

## 🟡 HIGH PRIORITY - Before Beta Testing

### 4. Performance Validation ✅ VOLTOOID (Sessie 99-100)

- [x] Bundle size < budget (~983 KB productieve code → ~809 KB na Netlify minificatie, binnen 1000 KB budget)
- [x] Terminal Core < 400 KB (~340 KB)
- [x] Load time < 3 seconds (LCP ~2.0s)
- [x] Lighthouse audit: 100/100/92/100 (Performance/Accessibility/Best Practices/SEO)

---

### 5. Cross-Browser Testing ✅ GROTENDEELS VOLTOOID

**Automated Playwright E2E Tests: 100 tests across 13 suites**

**Tested browsers:**
- [x] **Chromium** (Chrome/Edge) — 91+ tests passing ✅
- [x] **Firefox** — passing ✅
- [ ] **WebKit/Safari** — Blocked by system dependencies (not critical — works on real macOS/iOS)
- [ ] Mobile Safari iOS 16+ (real device required)
- [ ] Chrome Mobile Android 12+ (real device required)

**Live URL tested:** https://hacksimulator.nl/

---

### 6. Accessibility Testing ✅ VOLTOOID (Sessie 97)

- [x] Keyboard navigation (Tab, Enter, Esc) — Focus trap op alle modals
- [x] Focus indicators visible — :focus-visible met blauwe outline (2px solid)
- [x] Color contrast WCAG AAA (14.8:1 primary text ratio)
- [x] Font scaling test (200% zoom) — Layout intact, geen horizontal scroll
- [x] ARIA audit: 50+ attributen, aria-live regions, role="dialog"
- [x] Screen reader basis test — Known limitations gedocumenteerd

---

## 🟢 MEDIUM PRIORITY - Before Production

### 7. Content Review ✅ VOLTOOID (Sessie 98)

- [x] All UI text in Nederlands (100% NL compliance)
- [x] All 32 commands have man pages
- [x] Educational tips present bij security tools (alle 5)
- [x] Juridische warnings correct bij offensive tools (Art. 138ab + consent)
- [x] Privacy Policy compleet (476 regels)
- [x] Gebruiksvoorwaarden compleet (489 regels)
- [x] Cookie Policy compleet (485 regels)
- [x] Disclaimer prominent (homepage + modal met focus trap)

---

### 8. Security Review ✅ VOLTOOID (Sessie 96)

- [x] CSP headers geconfigureerd (object-src, base-uri, form-action)
- [x] Input sanitization review — DOM-based escaping in renderer.js
- [x] localStorage security — Alleen non-sensitive, non-PII data
- [x] Analytics privacy — IP anonymization + PII blocking actief
- [x] External links: alle `rel="noopener noreferrer"`
- [x] HSTS geactiveerd (1 jaar max-age)

---

### 9. Beta Testing Setup — DEFERRED

- [ ] Recruit 5 beta testers (handmatige actie)
- [ ] Create feedback form
- [ ] Prepare test scenarios document

**Note:** In-app feedback systeem is geimplementeerd (Sessie 97). Beta testers werven is een handmatige actie.

---

### 10. Deployment Preparation ✅ VOLTOOID

- [x] Netlify account aangemaakt
- [x] GitHub repository gekoppeld
- [x] Netlify asset processing voor minificatie (broncode leesbaar)
- [x] HTTPS certificaat actief
- [x] Deployment live en werkend

---

## 📝 Post-Launch (Week 1)

### 11. Monitoring Setup — HANDMATIGE VERIFICATIE NODIG

- [ ] Verify analytics tracking werkt (GA4 Real-Time dashboard)
- [x] Error monitoring actief (console.log check)
- [ ] Performance metrics checken via GA4
- [x] Feedback mechanisme werkend (in-app feedback form)

---

## ✅ Quick Checklist Summary

- [x] GA4 ID replaced ✅ (G-7F792VS6CE, Sessie 91)
- [x] Contact emails added ✅ (contact@hacksimulator.nl, Sessie 91)
- [x] Domain registered/configured ✅ (hacksimulator.nl)
- [x] Bundle size < budget ✅ (~809 KB < 1000 KB)
- [x] Load time < 3 seconds ✅ (LCP ~2.0s)
- [x] Tested on Chrome + Firefox ✅ (100 E2E tests)
- [x] No console errors in production ✅
- [ ] Beta tested by 5+ users — DEFERRED
- [x] Legal documents complete and reviewed ✅ (Sessie 98)
- [x] Analytics consent working correctly ✅ (Cookiebot CMP)

---

**Last updated:** 18 februari 2026 (Sessie 102)
**Status:** ✅ LAUNCHED — Meeste items voltooid. Resterende items zijn handmatige acties (beta testers, GA4 dashboard verificatie).
