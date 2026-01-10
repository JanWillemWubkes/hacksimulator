# Blog Post Template (M5.5 GDPR Compliance)

**Last Updated:** 10 januari 2026
**Version:** 1.0
**Purpose:** Template for creating new blog posts with GDPR-compliant cookie consent

---

## 📋 Required Elements

Every blog post **MUST** include the following elements for GDPR compliance:

### 1. Cookie Consent Scripts (in `<head>`)

**Location:** After stylesheets, before `</head>` closing tag

```html
<!-- Cookie Consent & Analytics (M5.5 GDPR Compliance) -->
<script src="../src/analytics/consent-banner.js" type="module"></script>
<script src="../src/analytics/consent.js" type="module"></script>
<script src="../src/analytics/tracker.js" type="module"></script>
<script src="../src/analytics/events.js" type="module"></script>
```

**Critical Notes:**
- Path is `../src/` (blog pages are in subdirectory)
- `type="module"` is required (ES6 imports)
- Order matters: consent-banner → consent → tracker → events

---

### 2. Cookie Instellingen Footer Link

**Location:** Footer navigation, after "Cookies" link, before "Affiliate" link

```html
<nav aria-label="Footer navigatie">
  <a href="../index.html">Home</a>
  <a href="../assets/legal/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
  <a href="../assets/legal/terms.html" target="_blank" rel="noopener noreferrer">Voorwaarden</a>
  <a href="../assets/legal/cookies.html" target="_blank" rel="noopener noreferrer">Cookies</a>
  <a href="#" id="cookie-settings">Cookie Instellingen</a>
  <a href="../assets/legal/affiliate-disclosure.html" target="_blank" rel="noopener noreferrer">Affiliate</a>
</nav>
```

**Critical Notes:**
- `id="cookie-settings"` is required (JavaScript hook)
- `href="#"` prevents navigation (JavaScript intercepts click)
- Placement after "Cookies" is logical UX grouping

---

## ✅ Validation Checklist

Before publishing a new blog post, verify:

- [ ] 4 consent scripts in `<head>` (consent-banner, consent, tracker, events)
- [ ] Scripts use `../src/` path (relative to blog subdirectory)
- [ ] Scripts have `type="module"` attribute
- [ ] Cookie Instellingen link in footer navigation
- [ ] Link has `id="cookie-settings"` attribute
- [ ] Link placed after "Cookies", before "Affiliate"

**Automated Validation:** Run `scripts/validate-blogs.sh` to verify all elements present

---

## 🔍 Implementation Details

### How Cookie Consent Works

1. **Banner Injection (Dynamic)**
   - `consent-banner.js` exports `createConsentBanner()` function
   - `consent.js` calls function and injects HTML into DOM
   - Banner only shows if no consent stored (24-hour cooldown)

2. **Consent Storage (localStorage)**
   - Key: `hacksim_analytics_consent`
   - Format: JSON `{ necessary: true, analytics: boolean, advertising: boolean }`
   - Persists across pages (index.html + all blogs)

3. **Analytics Initialization**
   - `tracker.js` only initializes if `analytics: true` in consent
   - `events.js` tracks consent events (accept/decline)
   - Google Analytics (GA4) loads only after consent

4. **AdSense Loading**
   - AdSense container `#adsense-footer` hidden by default (`display: none`)
   - Only shows after `advertising: true` consent
   - Script loads dynamically after consent given

---

## 🚨 Common Mistakes

### ❌ **WRONG: Hardcoded Banner HTML**
```html
<!-- DON'T DO THIS -->
<div id="cookie-consent" class="cookie-banner">
  <p>Cookies...</p>
</div>
```
**Why:** Duplicates HTML across all blog files. Hard to maintain.

### ✅ **CORRECT: Dynamic Injection**
```html
<!-- Script tags load banner dynamically -->
<script src="../src/analytics/consent-banner.js" type="module"></script>
<script src="../src/analytics/consent.js" type="module"></script>
```
**Why:** Single source of truth. Update once, applies everywhere.

---

### ❌ **WRONG: Missing `id="cookie-settings"`**
```html
<!-- DON'T DO THIS -->
<a href="#">Cookie Instellingen</a>
```
**Why:** JavaScript can't find the link. Settings modal won't open.

### ✅ **CORRECT: ID Attribute Required**
```html
<a href="#" id="cookie-settings">Cookie Instellingen</a>
```
**Why:** `consent.js` uses `document.getElementById('cookie-settings')` to attach click listener.

---

### ❌ **WRONG: Wrong Path (absolute instead of relative)**
```html
<!-- DON'T DO THIS -->
<script src="/src/analytics/consent.js" type="module"></script>
```
**Why:** Absolute path `/src/` may fail depending on server configuration.

### ✅ **CORRECT: Relative Path from Blog Subdirectory**
```html
<script src="../src/analytics/consent.js" type="module"></script>
```
**Why:** Works reliably from `blog/*.html` → `../src/` goes up one level.

---

## 📂 Reference Files

**Existing Implementations (Copy from these):**
- `blog/welkom.html` (pilot implementation)
- `blog/index.html` (blog overview page)
- `blog/terminal-basics.html` (standard article)

**Core Scripts:**
- `src/analytics/consent-banner.js` - Banner HTML export
- `src/analytics/consent.js` - Consent logic + injection
- `src/analytics/tracker.js` - Google Analytics wrapper
- `src/analytics/events.js` - Event tracking

**Documentation:**
- `docs/prd.md` §21 - Monetization & GDPR compliance
- `CLAUDE.md` §14 - Monetization patterns
- `PLANNING.md` - Document sync protocol

---

## 🛠️ Testing

After creating a new blog post:

1. **Direct Landing Test**
   ```
   1. Clear localStorage + cookies
   2. Navigate directly to blog/your-post.html
   3. Verify cookie banner appears within 2s
   4. Click "Alles Accepteren"
   5. Verify banner disappears
   6. Check localStorage: "hacksim_analytics_consent" = JSON object
   ```

2. **Cross-Page Consent Test**
   ```
   1. Accept cookies on index.html
   2. Navigate to blog/your-post.html
   3. Verify NO banner shown (consent persisted)
   4. Check Network tab: GA4 requests firing
   ```

3. **Cookie Settings Link Test**
   ```
   1. Load blog/your-post.html
   2. Accept cookies (banner disappears)
   3. Scroll to footer, click "Cookie Instellingen"
   4. Verify banner reappears with all 3 options
   ```

4. **Validation Script**
   ```bash
   ./scripts/validate-blogs.sh
   ```
   Should output: `✓ All blogs valid`

---

## 🔗 Related Documentation

- **PRD §21**: Monetization & GDPR compliance strategy
- **CLAUDE.md §14**: Monetization patterns & implementation
- **PLANNING.md**: Document sync protocol (quarterly review trigger)
- **Plan File**: `/home/willem/.claude/plans/distributed-coalescing-sundae.md` (full implementation plan)

---

## 💡 Tips

1. **Copy-Paste from Pilot**: Use `blog/welkom.html` as template (known good implementation)
2. **Run Validation Early**: Don't wait until all content is written. Add consent elements first.
3. **Test Direct Landing**: Most users arrive via Google search (direct blog landing), not via index.html
4. **Check Console Errors**: Open DevTools → Console. Should see no errors related to consent scripts.

---

**Questions?** See `CLAUDE.md` §12 Troubleshooting or review existing blog implementations.
