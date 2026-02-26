# PLANNING.md - HackSimulator.nl

**Laatst bijgewerkt:** 22 februari 2026
**Status:** M5 Testing & Launch Phase - ✅ **LIVE on Netlify!**
**Verantwoordelijk:** Development Team
**Live URL:** https://hacksimulator.nl/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator

---

## 📋 Document Doel

Dit document bevat de **technische planning en architecturale beslissingen** voor HackSimulator.nl. Voor product requirements zie `docs/prd.md`, voor dagelijkse taken zie `TASKS.md`, voor AI context zie `CLAUDE.md`.

---

## 🎯 Productvisie

### Missie
Een veilige, toegankelijke browser-based terminal simulator waar **Nederlandse beginners** de fundamenten van ethisch hacken kunnen leren door hands-on te oefenen met echte commando's, zonder installatie, registratie of risico.

### Kernwaarden
1. **Educatief:** Elk commando is een leermoment met context
2. **Veilig:** Alle activiteiten zijn gesimuleerd, geen echte systemen
3. **Toegankelijk:** Geen technische barrières, gewoon browser openen
4. **Authentiek:** Realistische commands en output (80/20 realisme)
5. **Ethisch:** Duidelijke focus op legaal en ethisch gebruik

### Doelgroep

**Primaire Filter:** Skill level = Beginners (geen tot minimale cybersecurity kennis)
**Secundaire Filter:** Passie = Enthousiastelingen die ethisch hacken willen leren

**Demografische Segmenten:**
- **Studenten (16-25 jaar):** IT-studie voorbereiding, praktijkervaring voor CV, beperkt budget, certificeringen
- **Career Switchers (25-45 jaar):** IT-professionals die transitie overwegen naar cybersecurity, validatie interesse, hogere koopkracht
- **Hobbyisten (Alle leeftijden):** Technologie-enthousiastelingen, nieuwsgierig door media, zelfgestuurd leren op eigen tempo

**Gemeenschappelijke Eigenschappen:**
- Geen voorkennis vereist in cybersecurity
- Wil exploreren zonder commitment of grote investering
- Heeft begeleiding/uitleg nodig (3-tier help systeem)
- Zoekt veilige omgeving zonder risico (gesimuleerd, geen echte systemen)

### Succes Definitie (MVP)
- **Primaire KPI:** Sessieduur > 2 minuten gemiddeld
- **Secundaire KPI:** 5+ commands per sessie
- **Tertiaire KPI:** 10%+ return rate binnen 7 dagen

---

## 🏗️ Architectuur Overzicht

### High-Level Architectuur

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    index.html                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │ Terminal UI  │  │   Onboarding │  │   Feedback   │ │ │
│  │  │   Component  │  │     Modal    │  │    Widget    │ │ │
│  │  └──────┬───────┘  └──────────────┘  └──────────────┘ │ │
│  │         │                                               │ │
│  │  ┌──────▼───────────────────────────────────────────┐  │ │
│  │  │         Terminal Engine (Core)                   │  │ │
│  │  │  ┌─────────────┐  ┌───────────┐  ┌────────────┐ │  │ │
│  │  │  │   Parser    │  │ Command   │  │   History  │ │  │ │
│  │  │  │             │  │ Registry  │  │  Manager   │ │  │ │
│  │  │  └─────┬───────┘  └─────┬─────┘  └────────────┘ │  │ │
│  │  │        │                │                         │  │ │
│  │  │  ┌─────▼────────────────▼───────────────────┐   │  │ │
│  │  │  │        Command Executors                 │   │  │ │
│  │  │  │  [System] [Filesystem] [Network] [Sec]   │   │  │ │
│  │  │  └──────┬───────────────────────────────────┘   │  │ │
│  │  └─────────┼──────────────────────────────────────┘  │ │
│  │            │                                          │ │
│  │  ┌─────────▼──────────────────────────────────────┐  │ │
│  │  │      Virtual Filesystem                        │  │ │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │  │ │
│  │  │  │ In-Memory│◄─┤localStorage│  │ Reset Logic │ │  │ │
│  │  │  │   State  │  │   Sync    │  │             │ │  │ │
│  │  │  └──────────┘  └──────────┘  └──────────────┘ │  │ │
│  │  └───────────────────────────────────────────────┘  │ │
│  │                                                       │ │
│  │  ┌───────────────────────────────────────────────┐  │ │
│  │  │           Support Systems                     │  │ │
│  │  │  • Help System (3-tier)                       │  │ │
│  │  │  • Analytics (GA4/Plausible)                  │  │ │
│  │  │  • Error Handler                              │  │ │
│  │  │  • Fuzzy Matcher                              │  │ │
│  │  └───────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Architectuur Principes

1. **Client-Side Only (MVP)**
   - Geen backend server nodig
   - Alle logica draait in browser
   - State management via localStorage
   - **Rationale:** Eenvoud, geen hosting kosten, maximale privacy

2. **Modular Command System**
   - Commands zijn zelfstandige modules
   - Registry pattern voor command discovery
   - Makkelijk uitbreidbaar (nieuwe commands toevoegen)
   - **Rationale:** Schaalbaarheid, onderhoudbaarheid, testbaarheid

3. **Separation of Concerns**
   - UI Layer: Rendering en user input
   - Core Layer: Business logic, command execution
   - Data Layer: Virtual filesystem, persistence
   - **Rationale:** Clean code, testbaarheid, wijzigingen geïsoleerd

4. **Progressive Enhancement**
   - Basis functionaliteit werkt overal
   - Enhanced features voor moderne browsers
   - Graceful degradation voor oudere browsers
   - **Rationale:** Maximale compatibility

---

## 💻 Technologie Stack

### Frontend

| Component | Technologie | Versie | Rationale |
|-----------|-------------|--------|-----------|
| **Language** | JavaScript | ES6+ (2015+) | Native browser support, geen transpiling |
| **Styling** | Vanilla CSS | CSS3 | Simpele UI, geen framework overhead |
| **HTML** | HTML5 | - | Semantisch, modern |

**Geen frameworks gebruikt:**
- ❌ React/Vue/Angular → Overkill voor terminal UI
- ❌ Tailwind → 20-50KB overhead, terminal UI is simpel
- ❌ jQuery → Native APIs zijn voldoende
- ❌ TypeScript → Extra build complexity, geen directe browser support

### Storage & Persistence

| Component | Technologie | Capacity | Purpose |
|-----------|-------------|----------|---------|
| **State** | localStorage | 5MB | Filesystem state, command history, preferences |
| **Session** | sessionStorage | 5MB | Temporary session data |
| **Cookies** | HTTP Cookies | 4KB | Analytics consent only |

**Rationale localStorage:**
- Synchronous API (simpeler dan IndexedDB)
- Voldoende capacity (filesystem + history < 1MB)
- Breed ondersteund (IE8+)

### Analytics & Monitoring

| Fase | Tool | Kosten | Features |
|------|------|--------|----------|
| **MVP** | Google Analytics 4 | Gratis | Events, funnels, real-time, IP anonymization |
| **Post-MVP** | Plausible Analytics | €9/mnd | Privacy-first, cookie-less, EU hosting, lightweight |

**Migration path:** GA4 → Plausible zodra budget en 10k+ visitors

### Development Tools

| Tool | Purpose | Required? |
|------|---------|-----------|
| **Code Editor** | VS Code / Cursor | ✅ Ja |
| **Browser DevTools** | Chrome/Firefox | ✅ Ja |
| **Git** | Version control | ✅ Ja |
| **Node.js** | Optional build scripts | ❌ Optioneel |
| **Live Server** | Local development | ✅ Ja (VS Code ext) |

**Build Tools (Optional):**
- **Minifier:** Terser (JS) + cssnano (CSS) - voor productie bundle
- **Bundler:** GEEN - bestanden direct in browser laden
- **Rationale:** Simpel houden, direct runnable code

### Browser Support

| Browser | Versions | Market Share | Priority |
|---------|----------|--------------|----------|
| Chrome | Last 2 | ~65% | 🔴 Critical |
| Firefox | Last 2 | ~10% | 🔴 Critical |
| Safari | Last 2 | ~15% | 🔴 Critical |
| Edge | Last 2 | ~5% | 🟡 Medium |
| Mobile Safari | iOS 14+ | ~3% | 🟡 Medium |
| Chrome Mobile | Android 10+ | ~2% | 🟡 Medium |

**Testing Matrix:**
- Desktop: Chrome (Windows), Firefox (Windows), Safari (macOS)
- Mobile: Safari (iOS 16+), Chrome (Android 12+)
- Responsive modes: 320px, 768px, 1024px, 1920px

---

## 📁 Project Structuur

```
hacksimulator/
├── index.html                 # Hoofd HTML bestand
├── CLAUDE.md                  # AI assistant context
├── PLANNING.md               # Dit bestand
├── TASKS.md                  # Takenlijst (nog aan te maken)
├── README.md                 # Project documentatie (nog aan te maken)
│
├── docs/                     # Product documentatie
│   ├── prd.md               # Product Requirements v1.1
│   └── commands-list.md     # Command specificaties
│
├── src/                     # Source code
│   ├── main.js              # Entry point, initialisatie
│   │
│   ├── core/                # Kern systeem
│   │   ├── terminal.js      # Terminal engine
│   │   ├── parser.js        # Command parser
│   │   ├── registry.js      # Command registry
│   │   └── history.js       # Command history manager
│   │
│   ├── commands/            # Command implementaties
│   │   ├── system/          # clear, help, man, history, echo, date, whoami
│   │   ├── filesystem/      # ls, cd, pwd, cat, mkdir, touch, rm, cp, mv, find, grep
│   │   ├── network/         # ping, nmap, ifconfig, netstat, whois, traceroute
│   │   ├── security/        # hashcat, hydra, sqlmap, metasploit, nikto
│   │   └── special/         # reset, continue, tutorial (fase 2)
│   │
│   ├── filesystem/          # Virtual filesystem
│   │   ├── vfs.js           # Virtual filesystem core
│   │   ├── structure.js     # Initial filesystem structure
│   │   └── persistence.js   # localStorage sync
│   │
│   ├── ui/                  # User interface
│   │   ├── renderer.js      # Output rendering
│   │   ├── input.js         # Keyboard handling
│   │   ├── autocomplete.js  # Tab completion
│   │   ├── mobile.js        # Mobile adaptations
│   │   └── onboarding.js    # First-time user experience
│   │
│   ├── utils/               # Utilities
│   │   ├── fuzzy.js         # Fuzzy matching voor typos
│   │   ├── formatter.js     # Output formatting (colors, styles)
│   │   ├── validator.js     # Input validation
│   │   └── helpers.js       # Generic helpers
│   │
│   ├── help/                # Help systeem
│   │   ├── help-system.js   # 3-tier help logic
│   │   ├── man-pages.js     # Manual pages (Nederlands)
│   │   └── tips.js          # Educatieve tips
│   │
│   └── analytics/           # Analytics & tracking
│       ├── tracker.js       # Analytics abstraction layer
│       ├── events.js        # Event definitions
│       └── consent.js       # Cookie consent management
│
├── styles/                  # CSS bestanden
│   ├── main.css             # Global styles + CSS Variables
│   ├── terminal.css         # Terminal-specific styles
│   ├── mobile.css           # Mobile adaptations
│   └── animations.css       # Cursor blink, transitions
│
├── assets/                  # Static assets
│   ├── legal/               # Legal documenten
│   │   ├── privacy.html     # Privacy Policy (Nederlands)
│   │   ├── terms.html       # Gebruiksvoorwaarden
│   │   └── cookies.html     # Cookie Policy
│   └── data/                # Static data
│       └── initial-fs.json  # Initial filesystem structure
│
└── tests/                   # Testing (toekomst)
    ├── unit/                # Unit tests
    ├── integration/         # Integration tests
    └── e2e/                 # End-to-end tests
```

**File Naming Conventions:**
- **kebab-case** voor bestanden: `command-parser.js`
- **camelCase** voor JavaScript functies/variabelen
- **PascalCase** voor classes
- **UPPERCASE** voor constanten

---

## 🔧 Benodigde Tools & Setup

### Minimale Vereisten (Verplicht)

1. **Code Editor**
   - **Aanbevolen:** VS Code of Cursor
   - **Extensies:**
     - Live Server (voor local development)
     - ESLint (code quality)
     - Prettier (code formatting)

2. **Web Browser**
   - Chrome (primary testing)
   - Firefox (cross-browser testing)
   - Safari (macOS, iOS testing)

3. **Git**
   - Voor version control (verplicht)
   - GitHub account (optioneel - voor remote repository en auto-deploy)

4. **Terminal / Command Line**
   - Bash/Zsh (macOS/Linux)
   - PowerShell/Git Bash (Windows)

### Optionele Tools (Nice to Have)

5. **Node.js & npm**
   - **Versie:** LTS (20.x+)
   - **Purpose:** Optional build scripts, minification
   - **Niet vereist voor development!** Code draait direct in browser

6. **Build Tools (Productie)**
   ```bash
   npm install --save-dev terser cssnano
   ```
   - Voor minification van JS en CSS
   - Alleen voor productie deployment

7. **Testing Tools (Toekomst)**
   - Jest (unit testing)
   - Playwright (E2E testing)
   - Lighthouse CI (performance testing)

### Development Environment Setup

```bash
# 1. Clone repository (indien GitHub gebruikt)
# Optie A: Vanaf GitHub
git clone https://github.com/[username]/hacksimulator.git
cd hacksimulator

# Optie B: Lokale Git repository (geen GitHub)
cd hacksimulator
git init

# 2. Open in editor
code .  # VS Code
cursor .  # Cursor

# 3. Start local server (VS Code Live Server extensie)
# Right-click index.html → "Open with Live Server"
# Of: gebruik Python SimpleHTTPServer
python -m http.server 8000

# 4. Open browser
# http://localhost:8000
```

### Browser DevTools Setup

**Chrome DevTools instellingen:**
- Console: Preserve log enabled
- Network: Disable cache (tijdens development)
- Application: Check localStorage contents
- Performance: Monitor load times

**Handige shortcuts:**
- `Cmd/Ctrl + Shift + C`: Inspect element
- `Cmd/Ctrl + Shift + J`: Console
- `Cmd/Ctrl + Shift + M`: Toggle device toolbar (mobile testing)

---

## 🎨 Design System

### CSS Variables (Theming)

```css
:root {
  /* Colors - Hacker Theme */
  --color-bg: #000000;
  --color-text: #00ff00;
  --color-text-dim: #00aa00;
  --color-error: #ff0000;
  --color-warning: #ffff00;
  --color-info: #00ffff;
  --color-success: #00ff00;

  /* Typography */
  --font-terminal: 'Courier New', 'Courier', monospace;
  --font-size-base: 16px;
  --font-size-mobile: 14px;
  --line-height: 1.5;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Layout */
  --terminal-padding: 20px;
  --terminal-max-width: 1200px;
  --mobile-breakpoint: 768px;

  /* Animations */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
}
```

**Toekomstige themes (post-MVP):**
- Light mode
- Colorblind-friendly
- High contrast

### Typography

- **Font family:** Monospace (terminal authentiek)
- **Base size:** 16px (desktop), 14px (mobile)
- **Line height:** 1.5 (leesbaarheid)
- **Font weight:** Normal (400) voor tekst, Bold (700) voor prompts

### Layout Principes

1. **Mobile-first:** Design voor kleinste scherm eerst
2. **Responsive breakpoints:**
   - Mobile: < 768px
   - Tablet: 768px - 1024px
   - Desktop: > 1024px
3. **Terminal centraal:** Volledige viewport height
4. **No scrolljacking:** Natuurlijk scroll gedrag

---

## 🔐 Security & Privacy

### Security Measures

1. **Content Security Policy (CSP)**
   ```html
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'self';
                  script-src 'self' https://www.googletagmanager.com;
                  style-src 'self' 'unsafe-inline';">
   ```

2. **Input Sanitization**
   - Alle user input escapen voor XSS preventie
   - Command arguments valideren
   - Geen `eval()` of `innerHTML` met user input

3. **localStorage Security**
   - Geen gevoelige data opslaan
   - Data is plain-text (geen credentials!)
   - Periodieke cleanup (oude sessions)

### Privacy Strategy

**Data Minimization:**
- ✅ Verzamel: Session duration, command counts, device type
- ❌ NIET: Command arguments, IP addresses, PII

**GDPR/AVG Compliance:**
- Cookie consent banner (first visit)
- Privacy Policy (Nederlands)
- Right to deletion (via contact)
- Data retention: max 14 maanden

**Analytics Migration Path:**
```
MVP Launch → GA4 (gratis)
   ↓
Month 4-6 → Evaluate traffic
   ↓
10k+ visitors → Migrate to Plausible (€9/mnd)
   ↓
Remove cookie banner → Better UX
```

---

## 📊 Performance Budgets

### Load Time Targets

| Metric | Target | Max |
|--------|--------|-----|
| First Contentful Paint | < 1.5s | 2.0s |
| Time to Interactive | < 2.5s | 3.0s |
| Largest Contentful Paint | < 2.0s | 2.5s |
| Cumulative Layout Shift | < 0.1 | 0.25 |

### Bundle Size Budget

**Budgetmodel (Sessie 100 — herdefinieerd voor multi-page site):**

| Scope | Budget | Huidig (na minificatie) | Status |
|-------|--------|------------------------|--------|
| Terminal App Core (JS + core CSS + terminal.html) | 400 KB | ~340 KB | ✅ Binnen budget |
| Per pagina (HTML + page-specifieke CSS) | 50 KB | ~20-45 KB | ✅ Binnen budget |
| Totale site (exclusief afbeeldingen) | 1000 KB | ~809 KB | ✅ Binnen budget |

**Optimization Strategy:**
- Netlify asset processing: CSS/JS/HTML minificatie + image compression
- Bronbestanden blijven leesbaar in repo (geen in-place minificatie)
- Gzip/Brotli compressie via Netlify CDN
- No images in terminal UI (text-only, 0 KB)

### Monitoring

**Development:**
- Chrome DevTools Performance tab
- Lighthouse audits (target score: >90)

**Production:**
- GA4 page load times
- Web Vitals monitoring
- Error rate tracking

---

## 💰 Revenue Streams & Economics

### Hosting Costs

**Current (MVP):**
- **Netlify:** €1.25/month (Pro features unused, only bandwidth)
- **Total:** €1.25/month

**Phase 3 (Backend, conditional):**
- **Netlify:** €1.25/month
- **Backend Hosting:** €10/month (Railway/Fly.io or Netlify Functions)
- **Database:** €50/month (PostgreSQL managed or Supabase)
- **Total:** €61.25/month

---

### Phase 1 Revenue (Month 1-3)

**Components:**
- AdSense: €50-150/month
- Affiliates: €20-100/month
- Donations: €10-50/month

**Total:** €80-300/month
**Net Profit:** €78.75-298.75/month (after €1.25 hosting)

---

### Phase 2 Revenue (Month 4-6)

**Components:**
- Phase 1 streams: €80-300/month
- Sponsorships: €200-1000/month

**Total:** €280-1300/month
**Net Profit:** €278.75-1298.75/month (after hosting)

---

### Phase 3 Revenue (Month 7-12) - **CONDITIONAL**

**Trigger:** If Phase 1 revenue >€200/month after 3 months

**Components:**
- Phase 1+2 streams: €280-1300/month
- Freemium subscriptions: €300-1500/month
- Enterprise licenses: €50-300/month (monthly amortized)

**Total:** €630-3100/month
**Net Profit:** €568.75-3038.75/month (after €61.25 hosting)

---

### Break-Even Analysis

**Development Cost (MVP + Phase 1):**
- MVP: 280 hours
- Phase 1 (M5.5): 17 hours
- **Total:** 297 hours × €50/hour = **€14,850**

**Break-Even Timeline:**
| Monthly Net Profit | Break-Even Time |
|--------------------|-----------------|
| €300/month         | 50 months       |
| €1000/month        | 15 months       |
| €2000/month        | 7 months        |

---

### Decision Points

**Month 3 Evaluation:**
- **If revenue >€200/month:** Proceed to Phase 3 backend build (60-80 hours investment = €3000-4000)
- **If revenue €100-200/month:** Implement Phase 2 sponsorships, defer Phase 3
- **If revenue <€100/month:** PAUSE monetization, focus on traffic growth (SEO, content marketing, partnerships) instead

**Phase 3 Backend Investment Justification:**
- Only invest 60-80 hours if MRR (Monthly Recurring Revenue) from Phase 1 validates market demand
- Backend enables €300-1500/month additional revenue (freemium subscriptions)
- ROI: 3-5 months if conversion rate >5%

---

### Revenue Projections

**Conservative Scenario:**
| Month  | Phase        | Revenue    | Cumulative |
|--------|-------------|------------|------------|
| Month 1  | Phase 1      | €80        | €80        |
| Month 3  | Phase 1      | €150       | €450       |
| Month 6  | Phase 2      | €300       | €1,350     |
| Month 12 | Phase 3      | €630       | €6,390     |

**Optimistic Scenario:**
| Month  | Phase        | Revenue    | Cumulative |
|--------|-------------|------------|------------|
| Month 1  | Phase 1      | €150       | €150       |
| Month 3  | Phase 1      | €300       | €750       |
| Month 6  | Phase 2      | €1000      | €4,750     |
| Month 12 | Phase 3      | €2000      | €19,750    |

---

### Cost Structure Summary

**Fixed Costs (Monthly):**
- MVP (M0-M5): €1.25/month (Netlify)
- Phase 3 Backend: +€60/month (total €61.25/month)

**Variable Costs:**
- Development time (one-time): €14,850 (MVP + Phase 1)
- Phase 3 Backend (one-time): €3,000-4,000 (conditional)

**Revenue Streams:**
- Passive (Phase 1): €80-300/month
- Content-driven (Phase 2): €280-1300/month
- Subscription-based (Phase 3): €630-3100/month (conditional)

---

## 🧪 Testing Strategie

### Manual Testing (MVP)

**Required tests per command:**
1. ✅ Happy path (correcte input)
2. ✅ Error handling (verkeerde input)
3. ✅ Edge cases (lege args, special chars)
4. ✅ Mobile rendering (40 chars width)
5. ✅ Help/man pages aanwezig

**Cross-browser testing:**
- Chrome (Windows + macOS)
- Firefox (Windows)
- Safari (macOS)
- Mobile Safari (iOS real device)
- Chrome Mobile (Android real device)

### Beta Testing (Pre-Launch)

**Minimum 5 beta testers:**
- 2x beginners (no tech background)
- 2x IT students
- 1x experienced developer

**Test scenarios:**
1. First-time user flow (onboarding)
2. Command exploration (trial & error)
3. Error recovery (typos, wrong args)
4. Mobile experience
5. Return visit (localStorage restore)

**Feedback verzamelen:**
- Post-session survey (5 min)
- Screen recordings (met toestemming)
- Bug reports (GitHub issues)

### Automated Testing (Post-MVP)

**Unit tests (toekomst):**
- Command parsers
- Filesystem operations
- Help system logic

**E2E tests (toekomst):**
- Complete user flows
- Cross-browser automation
- Regression testing

---

## 🚀 Deployment Strategie

### Hosting Opties (MVP)

| Platform | Kosten | Features | Aanbeveling |
|----------|--------|----------|-------------|
| **Netlify** | Gratis | CDN, auto-deploy, SSL | ⭐ Beste |
| **Vercel** | Gratis | CDN, auto-deploy, SSL | ⭐ Goed |
| **GitHub Pages** | Gratis | Simpel, geen config | ✅ OK |
| **Cloudflare Pages** | Gratis | CDN, Workers | ✅ OK |

**Aanbeveling: Netlify**
- Gratis tier voldoende voor MVP
- Auto-deploy via Git
- Instant cache invalidation
- Custom domain support (hacksimulator.nl)
- Analytics (basic) included

### Deployment Proces

```bash
# 1. Build (optioneel - minification)
npm run build  # Creates /dist folder

# 2. Deploy (Netlify)
# Optie A: Drag & drop in Netlify UI (geen Git vereist)
# Optie B: Auto-deploy via Git (GitHub/GitLab integratie)
# Optie C: Netlify CLI
netlify deploy --prod

# 3. Verify
# Check: https://hacksimulator.nl
# Test: Load time, functionality, analytics
```

### Environment Configuratie

**Development:**
```javascript
const ENV = 'development';
const ANALYTICS_ENABLED = false;
const DEBUG_MODE = true;
```

**Production:**
```javascript
const ENV = 'production';
const ANALYTICS_ENABLED = true;
const DEBUG_MODE = false;
```

### Rollback Plan

- Git tags voor releases: `v1.0.0-mvp`
- Netlify rollback (1-click in UI)
- Backup van localStorage structure (JSON export)

---

## 📅 Roadmap & Fases

### Fase 1: MVP (Maand 1-3) - 🔵 IN UITVOERING (55.6%) - **LIVE!**

**Status:** 191/295 tasks completed (64.7% totaal project scope)
**MVP-only Progress:** M0-M4 (100%), M5 (39/45 - 87%)
**M5.5 Monetization:** ❌ Geannuleerd (affiliate aanvragen afgewezen)
**Live URL:** https://hacksimulator.nl/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator

> **Note:** Totale project scope (295 taken) omvat MVP (M0-M5.5: 153 taken) + Post-MVP milestones (M6-M9: 142 taken). Voor gedetailleerde takenlijst met subtasks, zie `TASKS.md`. Dit is een high-level overzicht.

**Week 1-2: Foundation** - ✅ VOLTOOID (M0+M1)
- [x] Project setup (structuur, Git)
- [x] Terminal engine (core)
- [x] Virtual filesystem (basis)
- [x] 7 system commands

**Week 3-4: Filesystem Commands** - ✅ VOLTOOID (M2)
- [x] 11 filesystem commands
- [x] localStorage persistence
- [x] Reset functionaliteit

**Week 5-6: Network & Security** - ✅ VOLTOOID (M3)
- [x] 6 network commands
- [x] 5 security commands
- [x] 3-tier help system

**Week 7-8: UX & Polish** - ✅ VOLTOOID (M4)
- [x] Onboarding flow
- [x] Mobile optimalisaties
- [x] Legal disclaimers
- [x] Analytics setup

**Week 9-10: Testing & Launch** - 🔵 IN PROGRESS (M5) - ✅ **DEPLOYED!**
- [x] GitHub repository setup (https://github.com/JanWillemWubkes/hacksimulator)
- [x] Netlify deployment (https://hacksimulator.nl/)
- [x] Performance optimization (<3s load: ~2.0s LCP, bundle: ⚠️ ~590KB uncompressed)
- [x] Lighthouse audit (100/100/92/100) - Performance 100, Accessibility 100, Best Practices 92, SEO 100
- [ ] Beta testing (5+ testers) - TO DO
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge) - TO DO

### Fase 2: Tutorials (Maand 4-6)
**Doel:** Guided learning scenarios + Command system scaling

- [x] Tutorial command (framework) — ✅ Sessie 103-104
- [x] 3 scenario's: recon, webvuln, privesc — ✅ Sessie 103
- [x] Progress tracking — ✅ Sessie 103 (localStorage persistence)
- [ ] **Help Command Interactive Paging** (conditional: when 50+ commands)
  - SPACE/Q navigation pattern (bash `less` style)
  - Page indicators: "Page 1/3", "-- More --"
  - Keyboard handlers: SPACE (next page), Q (quit), Esc (exit)
  - Architecture ready (modular functions from Sessie 36)
  - Trigger condition: Total command count ≥ 50
  - Estimated time: 6-8 uur (state machine + keyboard + UX testing)
- [ ] Migratie naar Plausible

### Fase 3: Gamification (Maand 7-12)
**Doel:** Challenges en certificaten

- [ ] Challenge system
- [ ] Leaderboard (optional)
- [ ] Certificaat generator
- [ ] Advanced difficulty modes

---

## 🔄 Update Protocol

**Wanneer dit document updaten:**
1. Nieuwe architecturale beslissingen
2. Tech stack wijzigingen
3. Tool toevoegingen
4. Performance budget aanpassingen
5. Roadmap updates

**Update volgorde bij requirements change:**
```
docs/prd.md → PLANNING.md → TASKS.md → CLAUDE.md
```

**Consistency checks:**
- Tech stack in PLANNING ↔ CLAUDE.md
- Architectuur principes ↔ PRD beperkingen
- Roadmap ↔ PRD fases

### Document Sync Protocol

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

## 📚 Referenties & Resources

**Interne Documentatie:**
- `docs/prd.md` - Product Requirements v1.1
- `docs/commands-list.md` - Command specificaties
- `CLAUDE.md` - AI assistant context
- `TASKS.md` - Dagelijkse takenlijst (aan te maken)

**Externe Resources:**
- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript/CSS reference
- [Web.dev](https://web.dev/) - Performance best practices
- [OWASP](https://owasp.org/) - Security guidelines
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility

**Community:**
- GitHub repository: https://github.com/JanWillemWubkes/hacksimulator
- Discord/Slack: [TBD - post-MVP]

---

## 🎓 Sessie Learnings (uit Ontwikkeling)

### Cursor Implementation (Sessie 3 - 14 oktober 2025)

**Beslissing:** Native browser cursor i.p.v. custom cursor

**Rationale:**
- ✅ Browser handelt positioning automatisch correct af
- ✅ Geen JavaScript nodig voor cursor sync tijdens typen
- ✅ Simpeler en robuuster (vanilla JS principe)
- ✅ Cleaner code, minder bytes (bundle size kritisch)
- ✅ Geen edge cases (emoji, unicode, font-width berekeningen)

**Verwijderd:**
- Custom cursor HTML element
- CSS `--cursor-blink` variable
- CSS `@keyframes cursor-blink` animation
- CSS `#terminal-cursor` styling rules
- Total: 30+ regels code verwijderd

**Behouden:**
- Native cursor: `caret-color: #00ff00` (groen, zichtbaar)

**Saved:** ~30 regels CSS/JS, betere performance, minder complexity

**Reference:** CLAUDE.md Sessie 3 voor volledige details

**Key Learning:**
> "Gebruik native browser features waar mogelijk. Custom cursor = 30+ regels CSS+JS. Native cursor = 1 regel CSS. Performance > Aesthetics."

---

**Laatst bijgewerkt:** 22 februari 2026
**Versie:** 2.4 (Sessie 105: TASKS sync + M6 tutorial checkboxes + M9 Refactor Sprint)
**Status:** ✅ Deployed - Live in Production | M5.5 Monetization Geannuleerd
**Live URL:** https://hacksimulator.nl/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator
