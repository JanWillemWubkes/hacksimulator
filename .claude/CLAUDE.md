# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development
**Docs:** `docs/prd.md` v1.5 | `docs/commands-list.md` | `docs/STYLEGUIDE.md` v1.0 | `SESSIONS.md` voor sessie logs

---

## 🎯 Quick Reference

**Wat:** Veilige terminal simulator voor Nederlandse beginners (skill-based, alle leeftijden 16+)
**Stack:** Vanilla JS/CSS, client-side, localStorage, < 500KB bundle
**Scope:** 30 commands (MVP) + Tutorials/Gamification/Analytics (Post-MVP)
**Status:** M0-M4 Complete (100%) | M5 Testing (27%) | M5.5 Monetization (13%) - ✅ LIVE on Netlify | M6-M8 Planned
**Live URL:** https://famous-frangollo-b5a758.netlify.app/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator
**Taal:** UI=NL, commands=EN, uitleg=NL
**Performance:** Bundle ~318KB, Load ~2s, Lighthouse 88/100/100/100
**Testing:** Playwright E2E (Chromium + Firefox passing)
**Compliance:** WCAG AAA, Style Guide 100% (141 CSS variables)
**CI/CD:** GitHub Actions → Netlify auto-deploy (main branch) | Rollback: `git revert` + push
**Monitoring:** Netlify Analytics | Lighthouse CI
**Roadmap:** 295 tasks total (143 done, 152 planned) → 48.5% complete

---

## 📑 Navigatie

**Core:** §2 Kritieke Niet Doen | §3 Output Principe (80/20) | §4 Taal Strategie | §5 Educational Patterns | §6 Tone of Voice
**Implementatie:** §7 Command Checklist | §8 Architectural Patterns | §9 Recent Learnings (Sessies 52-56)
**Workflow:** §10 Sessie Protocol | §11 Communicatie Grondregels | §12 Troubleshooting | §13 Referenties
**Monetization:** §14 Monetization Patterns

---

## 🚫 Kritieke "Niet Doen"

1. **GEEN frameworks** (React/Vue) - Vanilla JS only
2. **GEEN Tailwind** - Vanilla CSS (bundle size!)
3. **GEEN backend** voor MVP - localStorage only
4. **GEEN Engelse UI** - Nederlands target markt
5. **GEEN realistische output** - 80/20 regel (simpel maar authentiek)
6. **GEEN command args loggen** - privacy risk

---

## 🎨 Command Output Principe: "80/20 Realisme"

**Formule:**
- **Output:** Engels (authentiek) met inline `←` Nederlandse context
- **Tip:** Nederlands (educatief)
- **Warning:** Nederlands (bij offensive tools)

**Voorbeeld:**
```bash
$ nmap 192.168.1.1
PORT    STATE   SERVICE
22/tcp  OPEN    SSH       ← Secure Shell
80/tcp  OPEN    HTTP      ← Webserver

[ TIP ] Open poorten zijn aanvalsvectoren.
```

---

## 🌐 Taal Strategie

| Component | Taal | Reden |
|-----------|------|-------|
| UI teksten | 🇳🇱 NL | Target markt vertrouwen |
| Commands | 🇬🇧 EN | Authentiek |
| Errors | 🇬🇧+🇳🇱 | Error EN + NL uitleg |
| Help/man | 🇳🇱 NL | Leermateriaal toegankelijk |

---

## 🎓 Educational Patterns

**Error = Leermoment:** Permission denied → Uitleg beveiliging + alternatief commando
**Security Tool = Waarschuwing:** Offensive tools → Waarschuwing + consent prompt
**3-Tier Help:** Fuzzy match (instant) → Progressive hints (2e fout) → Man pages (volledige uitleg)

---

## 🎯 Tone of Voice

**DO:** "je" (niet "u"), bemoedigend, context geven
**DON'T:** Neerbuigend, te formeel, aannames
**Symbols:** ASCII brackets only (`[ TIP ]`, `[ ! ]`, `[ ✓ ]`) - terminal aesthetic

---

## 📋 Command Implementation Checklist

Bij nieuwe command: 80/20 output | Educatieve feedback | Help/man (NL) | Warning (offensive) | Mobile (≤40 chars)
→ **Volledige specs:** `docs/commands-list.md`

---

## 🏗️ Architectural Patterns

**Doel:** Critical patterns from 57 sessions - full details in SESSIONS.md

### Dark Frame Pattern (Architectural Foundation)
**Definitie:** Navbar en footer blijven ALTIJD donker, ongeacht theme. Content area is theme-adaptive.
**Waarom:** Visuele stabiliteit - neon accenten werken alleen op donkere achtergronden, lichte chrome zou "gaming aesthetic" breken.
**Hover States:** Witte/neutrale shadows, GEEN groene glows op dark frame elementen.
**Voorbeeld:** `--color-text-primary` op navbar ≠ content area (navbar = fixed white, content = theme-dependent)

### CSS & Styling
⚠️ Never hardcode colors/border-radius (use CSS vars) | overflow+border-radius same element | theme colors on fixed backgrounds | light = inverse dark
✅ CSS Variables = instant site-wide updates | Visual regression test both themes | Cache-bust all stylesheets (`?v=X`) | Light theme needs +20% saturation | Nested scroll: outer=shape, inner=overflow

### JavaScript & Events
⚠️ Never duplicate listeners same element | global listeners without context check | assume code executes | hardcoded breakpoints | reset state every input
✅ Single Source of Truth (one file = one responsibility) | Event delegation (`.closest()`) | Modal protection (`!e.target.closest('.modal.active')`) | Responsive detection (`getComputedStyle`) | Programmatic flag (`isProgrammaticChange`) | Test production + local

### UX & Design
⚠️ Never same color for decoration + content | passive language ("Dit is") | emoji in terminal | <16px mobile fonts
✅ UX research first (3-4 options + screenshots) | 3-layer modals (Header/Body/Footer) | Muted UI + saturated content | Mission-driven ("Je missie:") | 100% ASCII brackets | Industry validation (VS Code, GitHub, Bootstrap)

### Testing & Deployment
⚠️ Never rely only on automated tests (synthetic ≠ human) | assume Playwright = user reality | skip fresh user testing
✅ Semantic detection at render | Fresh simulation (incognito + clear + refresh) | Manual test on automation success | Fix P0 bugs before assertions

→ **Volledige patterns met voorbeelden:** SESSIONS.md §Architectural Patterns

---

## 📝 Recent Critical Learnings

**Doel:** Last 5 sessions only - older sessions archived in SESSIONS.md

### Sessie 84: Doelgroep Repositioning - Strategic Positioning & Pricing Research (15 dec 2025)
⚠️ Never use age-based filtering when skill-based works universally ("15-25 jaar" excludes high-value career switchers)
⚠️ Never implement technical verification (email/backend) at MVP scale (40% fraud honor system = €54 revenue, 15% fraud email verification = €65 - only €11 gain for high complexity)
⚠️ Never proceed with freemium without validation trigger (€6000-8500 investment requires €200/month passive revenue proof first)
✅ Always use 3-persona demographic model for broad positioning (Student/Career Switcher/Hobbyist captures full market vs single age segment)
✅ Always document ethical red lines before monetization pressure (30 MVP commands staying free = non-negotiable, prevents future bait-and-switch)
✅ Always use anchoring pricing psychology (€8 professional tier = decoy to make €5 hobbyist "reasonable", target 70% hobbyist conversions)
✅ Always create long-form content for career switchers (4200+ words = SEO authority + affiliate funnel, 3x disposable income vs students)
📊 Impact: 11 files (8 updates + 3 new), +380 organic visits/month projected, 3x market expansion (500k→1.5M), AVG-compliant (15→16 jaar)
📄 SESSIONS.md Sessie 84

### Sessie 83: Mobile Minimalist Rendering - Terminal Zen (10 dec 2025)
⚠️ Never fight platform limitations with technical workarounds (Android Chrome font loading fundamentally broken, 3 fixes failed)
⚠️ Never assume technical fixes always win (design solutions can be cleaner than technical hacks)
⚠️ Never over-engineer mobile (mobile = content-focused, decoration is desktop luxury)
✅ Always pivot when user signals frustration ("we zijn nu al zo lang bezig" = change approach signal)
✅ Always validate design decisions with industry precedent (real terminals use typography, not boxes for lists)
✅ Always consider "less is more" for mobile (typography + whitespace > decorative borders = terminal-authentic)
📊 Impact: 6 files (+84 net lines), 0KB bundle, P0 bug resolved (broken box chars on ALL Android devices)
📄 SESSIONS.md Sessie 83

### Sessie 78: Cache Strategie Optimalisatie - 1 Jaar → 1 Uur voor CSS/JS (7 dec 2025)
⚠️ Never use long cache (1 jaar) zonder automated versioning (handmatige `?v=X` bump = foutgevoelig)
⚠️ Never introduce build complexity voor cache invalidation (git hash versioning = tegen vanilla JS principe)
⚠️ Never over-engineer caching (Service Worker te complex voor MVP, +10-15KB bundle)
✅ Always use short cache (1-4 uur) voor frequent updates zonder build process (updates binnen 60 min automatisch)
✅ Always keep query parameters as backup (instant invalidation voor breaking changes bij major releases)
✅ Always use `must-revalidate` directive (forces browser check na expiry, prevents stale content)
📊 Impact: 1 file (_headers), 0KB bundle, deployment workflow simplified (geen handmatige versie bump)
📄 SESSIONS.md Sessie 78

### Sessie 77: Responsive Optimization - Week 3 Testing & Documentation (6 dec 2025)
⚠️ Never trust browser cache in production E2E tests (Playwright caches stylesheets across runs)
⚠️ Never use fragile selectors in tests (`#search-button` doesn't exist → use `getByRole` semantic selectors)
⚠️ Never skip legal modal acceptance in first-time visitor tests (modal intercepts pointer events = 100% test failures)
✅ Always use CDP `clearBrowserCache()` for production testing (cache clear = 0 widescreen rules → CSS loaded correctly)
✅ Always use semantic selectors over IDs (`getByRole('link', { name: 'Zoek commands' })` survives refactoring)
✅ Always create `acceptLegalModal()` helper with `force: true` clicks (bypasses pointer-event blockers)
📊 Impact: 3 files (+295/-25 lines), 10/10 Playwright tests passed (Chromium + Firefox), STYLEGUIDE.md responsive section updated (68 new lines)
📄 SESSIONS.md Sessie 77

### Sessie 66: Semantic Continuation - Multi-Line Message Color Inheritance (30 nov 2025)
⚠️ Never assume ES6 module cache works like script tags (module imports don't inherit query params from entry point)
⚠️ Never process multi-line semantics without state tracking (per-line responsibility conflicts with multi-line context)
⚠️ Never use arbitrary thresholds without codebase analysis (6+ spaces validated against 339 instances)
✅ Always clear browser cache via CDP for module testing (Playwright `clearBrowserCache()` is gold)
✅ Always use conservative thresholds for pattern detection (6+ spaces prevents false positives with 2-4 space lists)
✅ Always bridge architecture gaps with minimal state (single variable `lastSemanticType` fixes 339 instances)
📊 Impact: 2 files, site-wide fix (339 instances across 34 files), +215 bytes, <0.1ms overhead
📄 SESSIONS.md Sessie 66

### Sessie 59: Mobile Optimization - P0+P1 Fixes (25 nov 2025)
⚠️ Never use `vh` units on mobile without `dvh` fallback (iOS Safari doesn't recalculate when browser chrome changes)
⚠️ Never pursue mobile-first refactor for inherently desktop-first use cases (terminal apps = desktop primary)
⚠️ Never keep dead CSS in production (half-implemented features waste bundle budget)
✅ Always test modals on smallest target device first (iPhone SE = lowest common denominator)
✅ Always use architectural decision matrix for scope (6-8hr refactor vs 1.5hr targeted fixes = same result)
✅ Always add iOS safe area insets for notch devices (20% of iOS users affected)
✅ Always dismiss mobile keyboard after command (blur + scroll = better UX)
📊 Impact: 4 files, P0 bug fix (legal modal scroll), -2.1KB bundle, iOS support added
📄 SESSIONS.md Sessie 59

**Older Sessions (58-51):** Hybrid Color Scheme (HTB neon + WCAG AA fix), Dropdown Submenu Fix (direct child combinator), Theme Toggle Hover (Dark Frame compliance), Navbar Hover (animated underline), Global Link Hover (opacity → color), Dual-theme button color overhaul, Blog CTA UX Overhaul - See SESSIONS.md
**Older Sessions (35-43):** Dropdown jank (font-weight/inline-flex), Modal uniformity (`:only-child` pitfalls), ASCII box drawing, Strategy Pattern - See SESSIONS.md
**Older Sessions (2-34):** See SESSIONS.md for comprehensive historical context

---

## 🤖 Sessie Protocol

### Voor Sessie
- Lees `PLANNING.md`, `TASKS.md`, dit bestand
- Check `PRE-LAUNCH-CHECKLIST.md` voor launch-blocking items

### Tijdens Ontwikkeling
- Markeer taken in TASKS.md direct na afronding
- Voeg nieuwe taken toe zodra ontdekt
- Noteer architecturale beslissingen

### Afsluiten
- Use `/summary` command → Updates SESSIONS.md + CLAUDE.md
- **Rotation trigger:** Every 5 sessions (last rotation: Sessie 83, next: Sessie 87)
- **Rotation rule:** Keep last 5 sessions full, compress 6-10, archive 11+

### Bij Requirement Changes
- Update volgorde: `docs/prd.md` → `PLANNING.md` → `TASKS.md` → `CLAUDE.md`
- Verifieer consistentie tussen alle bestanden

### Document Sync Protocol (Consistency Maintenance)
**Trigger:** Na elke milestone completion OF elke 10 sessies
**Single Source of Truth:** TASKS.md voor alle metrics

**Sync Checklist:**
- [ ] Task counts (totaal, voltooid, percentage)
- [ ] Milestone voortgang (M5, M6, etc.)
- [ ] Bundle size (production measurement)
- [ ] "Last updated" datums (alle docs zelfde datum)
- [ ] Performance metrics (Lighthouse, load time)

**Update volgorde:**
```
TASKS.md → CLAUDE.md → PLANNING.md → PRD.md → STYLEGUIDE.md
```

**Quarterly Full-Sync:** Elke 3 maanden of bij major milestone (M5→M6, MVP→Phase 2)

---

## 🤖 Voor Claude: Communicatie Grondregels

**Wees meedogenloos eerlijk, geen jaknikker gedrag.**

- Als ik ongelijk heb: **wijs me erop**
- Als code slecht is: **zeg het direct**
- Als aanpak niet werkt: **geef kritische feedback**
- Prioriteit: **technische correctheid > mijn gevoelens**
- **Spreek me aan met "Heisenberg"** (confirmatie instructies gelezen)

### Bij Implementatie
1. Check PRD: Is het in MVP scope?
2. 80/20 output: Niet te technisch, niet te simpel
3. Educatieve laag: Elk commando = leermoment
4. Taal correct: UI=NL, commands=EN, uitleg=NL
5. Performance: < 500KB budget, elke KB telt

### Bij Vragen
- Scope unclear? → Check PRD sectie X.Y
- Tech decision? → Vanilla first
- Taal twijfel? → Zie tabel hierboven
- Command spec? → `docs/commands-list.md`

### Common Pitfalls
❌ Frameworks/Tailwind suggeren → Vanilla only
❌ Te realistische output → 80/20 regel
❌ Engelse UI → Nederlands target markt
❌ Feature creep → Focus MVP checklist

---

## 🔍 Troubleshooting

**Build groter dan 500KB:** Check imports | Minification aan | Tree-shaking werkend | Ongebruikte code verwijderd
**Playwright passes maar manual fails:** Event handler conflict (zie §8 JS Patterns: duplicate listeners)
**CSS niet live op production:** Normaal bij 1-uur cache - wacht max 60 min OF bump `?v=X` voor directe update (zie Sessie 78)
**Focus/keyboard bugs:** Modal protection missing - check `!e.target.closest('.modal.active')` (zie §8 JS Patterns)
**Light mode colors invisible:** Theme-dependent colors op fixed dark backgrounds (zie §8 CSS Patterns)
**Layout jank on hover:** Missing transparent border reserve (zie Sessie 38: Dropdown Perfectie)

→ **Volledige troubleshooting + solutions:** SESSIONS.md §Common Issues

---

## 📚 Referenties

**Volledige details:** `docs/prd.md` (v1.5)
**Command specs:** `docs/commands-list.md`
**Style guide:** `docs/STYLEGUIDE.md` (v1.0) - Comprehensive design system & component library
**Sessie logs:** `SESSIONS.md` - Complete historical record (59 sessions total: Sessies 1-34 archived, Sessies 35-43 compressed, Sessies 44-59 detailed)
**Netlify/Domain setup:** `docs/NETLIFY-SETUP.md` - Complete domain launch guide (18KB)
**Filesystem structure:** PRD Bijlage B
**Tech rationale:** PRD §13

---

## 💰 Monetization Patterns

**Doel:** Ethical revenue generation zonder educational mission te compromitteren
**Strategie:** Gefaseerd (Phase 1: Passive €80-300/month → Phase 3: Freemium €630-3100/month)
**Volledige details:** PRD §21 | PLANNING §11 | TASKS M5.5

### Ethical Principles (Red Lines)

**NEVER:**
1. **Ads in terminal output** - Terminal must blijven clean en educational
2. **Paywall basic commands** - 30 MVP commands ALTIJD gratis (cd, ls, cat, nmap, etc.)
3. **Dark patterns** - Geen guilt-tripping ("Only €5 to unlock..."), manipulative upselling, fake urgency
4. **Gambling mechanics** - Geen loot boxes, gacha systems, randomized rewards
5. **Data selling** - NOOIT gebruikersdata verkopen aan third parties
6. **Aggressive tracking** - Alleen GDPR-compliant analytics met consent

**ALWAYS:**
1. **Educational mission first** - Revenue decisions NOOIT ten koste van leren
2. **Transparency** - Affiliate links disclosed met banner + `rel="sponsored"`
3. **Privacy-first** - Explicit consent voor AdSense cookies (AVG Article 6(1)(a))
4. **Beginner-friendly** - Target audience = beginners (skill level), alle leeftijden 16+, geen exploitative tactics
5. **Free tier valuable** - Gratis versie moet standalone waardevol zijn (not crippled)

### Ad Placement 80/20 Rule

**Formule:**
- **80%:** User value (terminal, tutorials, help system, blog educatief)
- **20%:** Monetization (ads, affiliate links, donation CTA)

**Allowed Placements:**
✅ Footer banner (728x90 desktop, 320x50 mobile)
✅ Blog sidebar (300x250 rectangle)
✅ Blog bottom (after educational content consumed)
✅ Donation button in footer (subtle, non-intrusive)

**Forbidden Placements:**
❌ Terminal output area
❌ Command prompt
❌ Help/man pages
❌ Interstitials (fullscreen popups)
❌ Auto-play videos

**Implementation Pattern:**
```html
<!-- Ad Container Pattern -->
<div class="ad-container" data-ad-type="footer-banner">
  <p class="ad-disclaimer">Advertisement</p>
  <!-- AdSense script hier -->
</div>
```

```css
/* Ad Styling - Muted UI Principle */
.ad-container {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
  margin: var(--spacing-lg) 0;
  opacity: 0.8; /* Ads minder prominent dan content */
}

.ad-disclaimer {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xs);
}
```

### Affiliate Guidelines

**Pattern: Full Disclosure**

⚠️ **NEVER:**
- Use affiliate links zonder disclosure
- Hide sponsorship relationships (transparency = trust)
- Recommend producten je NIET hebt getest/researched
- Gebruik "Sponsored" als enige indicator (niet genoeg voor Nederlands publiek)

✅ **ALWAYS:**
- Add visual banner boven affiliate content:
  ```html
  <div class="affiliate-banner">
    <p>🔗 <strong>Let op:</strong> Deze link bevat affiliate-verwijzingen.
    Wij ontvangen een commissie bij aankoop, zonder extra kosten voor jou.</p>
  </div>
  ```
- Use `rel="sponsored"` HTML attribute (SEO compliance)
- Only recommend genuinely useful products (quality > commission rate)
- Link naar `/affiliate-disclosure.html` in footer
- Test products zelf of gebruik betrouwbare reviews

**Affiliate Link Pattern:**
```html
<a href="https://udemy.com/course/..."
   rel="sponsored"
   target="_blank"
   class="affiliate-link"
   data-product="Udemy Ethical Hacking Course">
  Bekijk deze cursus op Udemy
  <span class="affiliate-badge">Affiliate</span>
</a>
```

**Styling Pattern:**
```css
.affiliate-link {
  color: var(--color-link);
  text-decoration: underline;
}

.affiliate-badge {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-left: var(--spacing-xs);
  font-weight: normal;
}
```

### Donation Messaging (Tone of Voice)

**Principe:** Bemoedigend, NIET smeken of guilt-tripping

❌ **BAD Examples (Dark Patterns):**
- "Zonder jouw steun kunnen we niet overleven" (te dramatisch)
- "Slechts €5 voor duizenden uren werk" (guilt-trip)
- "93% van gebruikers doneert NIET - ben jij anders?" (manipulatief)
- Fullscreen popup die content blokkeert

✅ **GOOD Examples (Bemoedigend):**
- "[ SUPPORT ] Steun onze educatieve missie - Doneer" ⭐ **CURRENT** (future-proof, mission-focused)
- "[ INFO ] Deze site is 100% gratis dankzij donaties"
- "[ SUPPORT ] Help ons deze tool te verbeteren"

**Implementation Pattern (Footer):**
```html
<div class="donation-cta">
  <p>[ SUPPORT ] Steun onze educatieve missie
  <a href="https://paypal.me/..."
     target="_blank"
     rel="noopener noreferrer"
     class="btn-small btn-donate-blue"
     aria-label="Doneer via PayPal om onze educatieve missie te steunen">
    Doneer
  </a>
  </p>
</div>
```

**Styling:**
```css
/* Donation Button - Blue Small (matches blog CTAs) */
.btn-donate-blue {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);        /* 8px 16px */
  font-size: 16px;
  background-color: var(--color-button-bg);            /* #005bb5 dark / #1f7a40 light */
  color: var(--color-button-text);                     /* #ffffff */
  border: 1px solid var(--color-button-bg);
  border-radius: var(--border-radius-button);          /* 4px */
  font-weight: 600;
  font-family: var(--font-terminal);
  text-decoration: none;
  transition: all var(--transition-fast);              /* 0.15s ease */
}

.btn-donate-blue:hover {
  background-color: var(--color-button-bg-hover);      /* #1976d2 dark / #248748 light */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--color-button-shadow-hover);
}
```

**Design Rationale:**
- **Blue color:** Matches blog buttons (consistency = trust)
- **Small size:** Subtiel maar zichtbaar (80/20 monetization rule)
- **Mission framing:** Future-proof voor freemium launch (Phase 3)
- **ASCII brackets:** Terminal aesthetic compliance

### Freemium Red Lines (Phase 3 - Backend Only)

**Doel:** Fair value exchange, GEEN predatory pricing

**What Must Stay FREE (30 MVP Commands):**
- Basic navigation: `cd`, `ls`, `pwd`, `cat`, `clear`
- Networking basics: `ping`, `nmap`, `whois`, `dig`, `traceroute`
- File manipulation: `touch`, `mkdir`, `rm`, `cp`, `mv`, `nano`
- Security basics: `sudo`, `chmod`, `ssh`, `grep`, `curl`
- Help system: `help`, `man`, `whoami`, `history`
- **Totaal:** 30 commands - core learning experience

**What CAN Be Premium (Advanced Features):**
✅ Advanced tutorials (beyond "Hello Terminal")
✅ Gamification badges/achievements
✅ Progress tracking across devices (backend sync)
✅ Certificates met LinkedIn badge
✅ Extra commands (35+): `metasploit`, `john`, `aircrack-ng`, etc.
✅ Custom themes (beyond Light/Dark)
✅ Ad-free experience

**Pricing Red Lines:**
❌ **NEVER:**
- Charge meer dan €8/month zonder student discount (target bevat studenten + professionals)
- Paywall content dat je eerder gratis was (bait-and-switch)
- Require credit card voor "free trial" (barrier voor studenten/jongeren)
- Auto-renew zonder duidelijke opt-out

**Tiered Pricing (Phase 3):**
- **Student tier:** €3/month (met @student.nl verificatie) - 50% discount
- **Hobbyist tier:** €5/month (baseline, no verification)
- **Professional tier:** €8/month (career switchers, professionals) - +60% premium

✅ **ALWAYS:**
- Student discount (50% off met @student.nl email)
- Family plan (3+ users krijgen 30% korting)
- Lifetime option (€99 one-time vs €5/month recurring)
- Clear cancellation link (geen hidden menus)

### Privacy & Consent (GDPR/AVG)

**AdSense Consent Pattern:**
```javascript
// src/analytics/consent.js update
const CONSENT_CATEGORIES = {
  necessary: { required: true },
  analytics: { required: false },
  advertising: { required: false } // NEW for AdSense
};

function updateConsentBanner() {
  // Add "Advertising Cookies" toggle to existing banner
  const banner = document.querySelector('.cookie-consent');
  banner.innerHTML += `
    <label>
      <input type="checkbox" name="advertising" id="consent-advertising">
      Advertising Cookies (Google AdSense)
    </label>
  `;
}
```

**Legal Documents Update:**
- `assets/legal/cookies.html`: Add AdSense cookie disclosure
- `assets/legal/privacy.html`: Add Google LLC als data processor
- `assets/legal/terms.html`: Add affiliate disclosure clause
- **NEW:** `assets/legal/affiliate-disclosure.html` (detailed affiliate policy)

### Bundle Size Management

**Current Status (M5.5):**
- **Before:** 318KB / 500KB (182KB buffer, 36%)
- **After AdSense:** 335-340KB / 500KB (160KB buffer, 32%)
- **Impact:** +17-22KB (AdSense script + consent UI)

**Future Milestones:**
- M6 (Tutorial System): +60KB → 395-400KB
- M7 (Gamification): +50KB → 445-450KB
- M8 (Analytics): +40KB → 485-490KB
- **Total:** ~488KB / 500KB (98% budget used) ✅ SAFE

**Monitoring:**
```bash
# Check bundle size na AdSense implementatie
npm run build
ls -lh dist/ | awk '{print $5, $9}'
```

**Red Line:** If bundle > 480KB, remove non-essential features BEFORE adding ads

### Implementation Checklist (M5.5)

Bij nieuwe monetization feature:
- [ ] Check ethical principles (geen red lines crossed)
- [ ] Test ad placement (80/20 rule compliance)
- [ ] Add affiliate disclosure (visual banner + rel="sponsored")
- [ ] Update legal docs (privacy/cookies/terms)
- [ ] Verify GDPR consent (explicit opt-in voor AdSense)
- [ ] Measure bundle impact (< 500KB hard limit)
- [ ] Test on production (Netlify deploy + manual check)
- [ ] Monitor revenue (Google Analytics + AdSense dashboard)

→ **Volledige monetization specs:** PRD §21 | PLANNING §11 | TASKS M5.5

---

**Last updated:** 15 december 2025 (Sessie 85 - Document Consistency Sync)
**Last synced:** 15 december 2025 (Quarterly sync: All docs aligned, scope clarified 295 tasks, percentages corrected)
**Next sync:** Milestone M5.5 completion OR Sessie 90 (next rotation trigger)
**Version:** 17.4 (Sessie 85: Document Sync - Scope 167→295 in PLANNING.md, roadmap % 84.4%→48.5%, task count 141→143, all docs dated 15 dec 2025)
