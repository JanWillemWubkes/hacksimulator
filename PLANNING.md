# PLANNING.md - HackSimulator.nl

**Laatst bijgewerkt:** 19 aug 2026 (Sessie 228 — **geen architectuurwijziging, wél een verbreding van de design-system-constraint.** Sessie 226 legde AAA vast op dim- en knoptokens; ongefilterd meten liet zien dat die scope te smal was — 152 element-toestanden onder AA over 18 kleurwaarden. De norm is nu élk element dat zelf tekst rendert, in beide thema's en beide viewports, tegen de effectieve achtergrond. Zie §Design System → Contrast.)
**Status:** ✅ LIVE on Netlify | M5 Testing 71% | M5.5 Monetization deep (Ko-fi + Brevo + Gumroad + Lead magnet) | M6 Tutorial 100% | M7 Gamification 100% | Blog content-pijler 14 posts live
**Verantwoordelijk:** Development Team
**Live URL:** https://hacksimulator.nl/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator

> **Scope van dit document:** Architectuur, tech rationale, design system, security/privacy strategie, performance principes, deployment. Voor milestone-percentages, task-counts, sprints, live metrics en monetization-stack-status → `TASKS.md` (single source of truth). Voor recent learnings → `.claude/CLAUDE.md`. Document-ownership-mapping in §Document Ownership.

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
│   ├── prd.md               # Product Requirements v1.8
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
   - **Uitzondering — marketing-navbar: hamburger tot en met 1279px** (Sessie 213). Deze
     navbar volgt de drietrap hierboven bewust niet: hij heeft meer breedte nodig dan
     "desktop" begint. Binair gemeten: vanaf 1147px loopt niets meer buiten de balk, maar
     pas vanaf 1264px (1266 in WebKit) breken de labels "Over Ons" en "Start Simulator"
     ook niet meer af. Grens op 1279px, zodat de inline nav vanaf de gangbare
     1280px-laptopbreedte verschijnt. Compacter maken is geen optie: op 769px is er 492px
     beschikbaar en zelfs met nul padding en een icoon-only themaschakelaar blijft
     `nav-right` ~545px. De **terminal**-navbar is een eigen, smallere variant die in deze
     band wél past en bewust níét mee inklapt. Regels staan in `landing.css` (niet in
     `mobile.css`, dat dubbel gepoort is op 768px én terminal-specifieke regels draagt);
     bewaakt door `tests/e2e/navbar-collapse.spec.js`.
3. **Terminal centraal:** Volledige viewport height
4. **No scrolljacking:** Natuurlijk scroll gedrag
5. **Sectieritme — pagina = oppervlak, band = verdieping, kaart = verhoging** (Sessie 219).
   Een landingspagina wisselt van achtergrond om een **wisseling van doel** te markeren, niet
   ter decoratie. Twee regels die daaruit volgen:
   - **Een band gaat ónder `--color-bg`, in béíde thema's** (`--color-bg-alt`: `#080b0f` dark,
     `#eceef0` light). Niet erboven: de kaarten zijn `rgba(22,27,34,α)`-tinten van `#161b22`,
     dus hun zichtbaarheid is `0.3 × |kaart − band|` en wordt **nul** zodra een band naar die
     kleur toe beweegt. Een verdieping houdt de kaart automatisch de lichtste laag.
   - **Geen reeks secties met dezelfde achtergrond langer dan ~1,4 viewport.** Gemeten vóór
     Sessie 219: 3,8 schermen onder "in cijfers" tegen 1,6 erboven. Op mobiel weegt dit
     zwaarder omdat `.landing-section` onder 768px van 96px naar 32px padding zakt.

   Toepassen via `.section-band` (verf) plus `.landing-section.section-band` (full-bleed) —
   bewust gescheiden, want `.trust-bar` en `.homepage-newsletter` zijn al volle breedte.
   Bewaakt door `tests/e2e/homepage-conversion.spec.js` §Homepage sectieritme, dat óók de
   kaart-Δ asserteert; die assertie is degene die de "lichtere band"-val vangt.


### Contrast: de norm is AAA op élk renderend tekstelement (Sessie 228)

Sessie 226 legde AAA vast als meetbare ondergrens op *dim- en knoptokens*. Die formulering
was te smal, en dat is gemeten: een ongefilterde sweep (30 pagina's × 2 thema's × 2 viewports,
13.157 element-toestanden) vond **152 onder AA en 378 onder AAA, verdeeld over 18
kleurwaarden**. De constraint luidt daarom nu:

> **Élk element dat zelf tekst rendert haalt WCAG AAA tegen zijn *effectieve* achtergrond,
> in beide thema's en in beide viewports.** Uitzonderingen bestaan, maar alleen als
> assertie met de gemeten waarde erbij — nooit als notitie.

Drie regels die daaruit volgen en die in de tokenlaag thuishoren:

1. **Een token draagt één rol.** `--color-cta-primary` is een OPPERVLAK (wit erop, 7,13:1);
   accenttekst is `--color-accent-text` (8,58:1). Beide rollen in één token gepropt geeft
   gegarandeerd één rol die faalt — het kostte hier 35 misgebruiken en een primaire CTA op
   3,30:1. Bewaakt door de `OPPERVLAK_TOKENS`-assertie in `tests/e2e/text-contrast.spec.js`.
2. **Een oppervlak dat van zijn thema afwijkt herdefinieert zijn tokens op de container**,
   niet per selector. Custom properties erven, dus één regel dekt ook de gebruiken die pas
   ná interactie renderen (`[data-theme="light"] #terminal-container` dekt tien
   `--color-prompt`-gebruiken waarvan er negen alleen ná een commando bestaan).
3. **Een kleur die tegelijk tint én tekst is, bestaat niet.** `background: rgba(HUE,.15);
   color: HUE` haalt nooit AAA; badges krijgen een tekst-token per thema
   (`--badge-*-text`), de tint blijft.

**Meetdiscipline** (waarom drie eerdere rondes de klasse misten): niet op tokennaam filteren,
scrollen vóór het meten, beide viewports, en de toestanden meenemen die interactie vereisen.
Uitgewerkt met code in `.claude/rules/meten-en-guards.md` §19.

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

### AI-transparantie: een staande publicatie-constraint (Sessie 223)

**Art. 50 lid 4 AI-verordening** is van toepassing sinds **2 augustus 2026**. Wie AI-gegenereerde
tekst publiceert die het publiek informeert over aangelegenheden van algemeen belang — en
security, computercriminaliteit en consumentenveiligheid vallen daaronder — moet die als zodanig
aanmerken, **zichtbaar zonder interactie en uiterlijk bij de eerste blootstelling**.

Er is één uitzondering: inhoud die een **natuurlijk persoon** inhoudelijk heeft getoetst
(controle van de feitelijke juistheid is daarbij het minimumvereiste), gepubliceerd onder de
redactionele verantwoordelijkheid van een met naam genoemd persoon. Certificering van die toetser
is uitdrukkelijk **niet** vereist.

**Voor dit project geldt de uitzondering niet.** De inhoud wordt met AI geschreven en met AI
gecontroleerd; er is geen menselijke feitencontrole. Daaruit volgen drie constraints:

1. **Elke contentpagina draagt zelf de melding** — niet alleen `/over-ons.html`. De meeste lezers
   landen via een zoekmachine direct op een blogpost; dát is het moment van eerste blootstelling.
2. **De melding mag nooit visueel verborgen worden.** Geen `display: none`, geen contrast onder de
   AA-drempel, geen tooltip-only. Zie ook `.claude/rules/css-layout.md` §14 — een
   positionele selector verfde deze melding ooit in linkkleur op 4,89:1 zonder dat iemand het zag.
3. **Geen claim mag menselijke verificatie suggereren** die er niet is. Dat is niet alleen de
   AI-verordening maar ook art. 6:193c BW (misleidende informatie over hoedanigheid en
   kwalificaties), met omkering van de bewijslast in art. 6:193j lid 2 BW.

Bewaakt door Check 7 in `scripts/validate-blogs.sh`. **Wijzigt de werkwijze ooit naar échte
menselijke feitencontrole, dan mag de melding weg** — pas dan, en pas nadat `#verantwoording` op
`over-ons.html` in dezelfde commit is bijgewerkt.

Wat hier bewust **niet** staat: een brede aansprakelijkheidsuitsluiting. Richting consumenten is
die grotendeels vernietigbaar (art. 6:233 jo. 6:237 sub f BW) en het dwingende conformiteitsrecht
van afd. 7.1AA BW laat zich er niet door opzijzetten. Wat wél werkt is een **scope-mededeling**
vóór de aankoop: zeggen wat het product is en niet is.

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

**Budgetmodel (Sessie 140 — runtime vs SEO/content gescheiden, na bundle-explosie blog/lead-magnet):**

Site is sinds Sessie 100 (~983 KB) gegroeid naar **~2196 KB unminified** door content-investering (blog 474 KB met 14 posts + JSON-LD, screenshots/OG image 700+ KB). Origineel "totale site <1000 KB" budget bewust losgelaten ten faveure van SEO-content. Runtime-budget blijft strikt.

| Scope | Budget | Status |
|-------|--------|--------|
| **Terminal App Core (runtime van terminal.html)** — JS + core CSS + terminal.html geladen bij terminal-load | **<400 KB** (strikt) | ⚠️ **~781 KB unminified** gemeten Sessie 141 (HTML 19 KB + 6 CSS 160 KB + 99 JS module-graph 601 KB). Geschatte minified ~547 KB (70%-ratio). **Overschrijding ~37% boven budget zelfs minified** — Sessie 142 Lighthouse-meting onthulde echter dat eigen bundle NIET de performance-bottleneck is (zie SEO/content-pijler rationale hieronder + TASKS.md #25). Bundle-optimalisatie sprint (#24) ⏸️ paused tot na third-party perf research |
| **Per pagina** — HTML + page-specifieke CSS (homepage, blog post, sample-pentest) | <50 KB per pagina | ⚠️ **`index.html` 54,5 KB — sinds Sessie 214 boven budget** (was 47,2 KB bij `d912f9b`; de trechter-invulling + interactieve hero-markup kostten +6,1 KB, Sessie 215 nog +1,2 KB voor de wrapper, de uitnodigingsregel en hun toelichting). Overige marketingpagina's ruim binnen: contact 14,8 · over-ons 22,7 · gidsen 26,3 KB. Bewust geaccepteerd voor nu — het is de conversiepagina en de on-wire kost wordt gedomineerd door de gedeelde `landing.css` (62,3 KB, 27 pagina's) die wél gecachet wordt. **Openstaand:** beslissen of de homepage een eigen budget krijgt of dat de FAQ (438 van 1108 woorden, dichtgeklapt) naar een eigen pagina moet. |
| **SEO/content-pijler** — blog/ + assets/ (screenshots + OG image + sample-PDF) | Geen budget (bewust losgelaten) | ⚠️ Groei monitoren bij elke Lighthouse-audit |

**Rationale voor budget-split (Sessie 140):**
- Runtime (wat gebruikers laden bij terminal-gebruik) is de UX-kritieke maat → blijft strikt
- SEO/content (wat Google crawlt) is groei-as → budgetloos, mits Lighthouse Performance ≥90 blijft
- Live metrics per directory: zie TASKS.md §Huidige Focus

**Sessie 142 Lighthouse-meting — frame-bias-onthulling:**
- Productie /terminal.html gemeten: **Mobile 39/100, Desktop 64/100** Performance (beide ver onder 90-drempel)
- Resource-breakdown on-wire (Lighthouse audit): Total 624 KB / 118 requests | **first-party scripts ~98 KB gzipped (~93 files)** | **third-party scripts 353 KB / 10 requests (~57% van bundle: AdSense + GA + Brevo + Ko-fi + misc)** | fonts 100 KB | stylesheets 48 KB
- TBT 3,270 ms mobile / 610 ms desktop (target <300 ms) — hoofdoorzaak is third-party main-thread blocking, niet first-party bundle-grootte
- **Frame-bias inzicht:** "bundle-source size (~547 KB minified)" ≠ "on-wire transfer (~98 KB gzipped first-party)" ≠ "Lighthouse Performance score". Deze drie metrics zijn losjes gerelateerd; eerdere `<400 KB` budget-discussie ging over (1), maar Lighthouse meet via (2)+(3)+execution-time.
- **Implicatie voor #24 (Pad A lazy-load):** lazy-loaden van ~108 KB minified eigen code bespaart ~22 KB gzipped → niet relevant voor TBT 3.3 s die domineren wordt door third-party execution. Pad A blijft een geldige optimalisatie voor bundle-source budget, maar fixt de gemeten performance-regressie niet.
- **Performance-regressie sinds Sessie 100 (Lighthouse Perf 100/100/92/100):** veroorzaakt door monetization-stack toevoegingen (Sessies 117-137: AdSense + Ko-fi + Brevo + Gumroad + Lead-magnet trackers), niet door bundle-groei eigen code. M6 Tutorial + M7 Gamification + nieuwe commands tellen ~207 KB minified delta op (eigen code), wat ~40 KB gzipped on-wire is — verwaarloosbaar t.o.v. ~353 KB third-party.
- **Vervolg:** TASKS.md #25 — third-party perf research (~2 uur scope) inventariseert per script de revenue-vs-UX trade-off voorafgaand aan implementatie-beslissing. Item #24 heropent na #25 met mogelijk gecombineerde Pad A + Pad C aanpak.
- **Opgelost in Sessie 208:** de dominante third-party-bron is weggenomen — AdSense (251,7 KB / 73% van de blokkeertijd, `docs/perf-third-party-audit.md`) is volledig van de site verwijderd. De metingen hierboven blijven staan als historisch verslag van het probleem; ze beschrijven niet de huidige stand.

**Optimization Strategy:**
- Netlify asset processing: CSS/JS/HTML minificatie + image compression
- Bronbestanden blijven leesbaar in repo (geen in-place minificatie)
- Gzip/Brotli compressie via Netlify CDN
- No images in terminal UI (text-only, 0 KB)
- Blog images: lazy-loaded (`loading="lazy"`) — onder-the-fold geen impact op LCP

### Monitoring

**Development:**
- Chrome DevTools Performance tab
- Lighthouse audits (target score: >90)

**Production:**
- GA4 page load times
- Web Vitals monitoring
- Error rate tracking

---

## 💰 Revenue Streams & Economics (architecturale principes)

**Hosting strategie (architecturaal):**
- MVP/Phase 1: Static site op Netlify, €1.25/maand (bandwidth only)
- Phase 3 (conditional, alleen bij MRR >€200/maand validatie): +backend (Netlify Functions of Railway €10/maand) + managed Postgres/Supabase (€50/maand)
- **Trigger voor backend-investering:** 60-80 uur dev-tijd alleen bij gevalideerde Phase 1 MRR

**Monetization-architectuur (4 streams, allen client-side voor MVP):**
1. **Ko-fi** donaties (platte hyperlink, geen script, geen consent vereist)
2. **Brevo newsletter** (lead generation → product-funnel)
3. **Gumroad products** (extern hosted checkout, embedded buy-buttons)
4. **Lead magnets** (sample-PDF → Brevo opt-in → upsell-flow) — 2 stuks: Sample Pentest en Sample Juridisch

> **Sessie 212 — conventie: één Brevo-formulier per lead magnet, één automation per formulier.**
> Beide sample-pagina's deelden aanvankelijk hetzelfde formulier. Dat is geen stijlkwestie: de
> welkomst-automations draaien op een *Form submitted*-trigger, en tags zijn in Brevo géén
> automation-criterium (alleen attributes, creation date, list membership, engagement — en de
> custom-filter-trigger vuurt batchgewijs om 20:00, ongeschikt voor een welkomstmail). Met één
> gedeeld formulier kán Brevo de instromen dus niet scheiden en krijgt iedereen dezelfde mail,
> ongeacht welk sample hij aanvroeg. Eén lijst blijft één lijst (`hacksimulator-main`) zodat het
> bij één dubbele opt-in blijft; de scheiding zit in het formulier, niet in de lijst. Een derde
> lead magnet krijgt dus opnieuw een eigen formulier + automation.
> Runbook: `docs/newsletter/brevo-setup-sample-juridisch.md`. Bewaakt door de E2E-test
> "elke sample post naar een ánder Brevo-formulier".

> **Sessie 208 — AdSense verwijderd.** Display-ads waren stream 1. Gemeten opbrengst: €0;
> gemeten kosten: 251,7 KB third-party en 73% van alle blokkeertijd (`docs/perf-third-party-audit.md`).
> Het eigen monetisatie-onderzoek concludeerde in maart 2026 al dat AdSense bij dit
> verkeersniveau €1-4/maand oplevert en de tijd niet waard is
> (`docs/archive/monetization-plan-v2.md:12,181`). De Gumroad-gidsen tonen wél
> betalingsbereidheid en dragen geen performancekosten — daar ligt de focus.

**Break-even principe:** Dev-tijd is gemodelleerd op €50/uur. Phase 3 backend-build (60-80 uur, ~€3000-4000) wordt alleen geïnvesteerd bij ROI <5 maanden bij >5% conversie.

→ **Actuele revenue-projecties, scenario-tabellen, Phase 1/2/3 maandelijkse targets en break-even tijdlijnen:** zie TASKS.md `## 💰 Monetization-roadmap` (zodra geconsolideerd; tot die tijd staan oude projecties in commit-historie).

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

### Automated Testing — Playwright E2E (bestaand, niet "toekomst")

Deze sectie beschreef E2E-tests tot Sessie 220 als *toekomstmuziek* terwijl de suite al
tientallen sessies draait. Actuele aantallen staan in `TASKS.md` §Huidige Focus (single
source of truth); hier alleen de architecturale regels.

- **Drie motoren** (Chromium/Firefox/WebKit) als projects in `playwright.config.js`. Een
  bug die in één engine onzichtbaar is, bestaat wél — Sessie 214 ving een Firefox-only
  focusbug die op Chromium niet te zien was.
- **Draai tegen een lokale server, niet tegen productie.** `playwright.config.js:32` valt
  standaard terug op `https://hacksimulator.nl`, en dat is de val: drie parallelle motoren
  die samen honderden navigaties afvuren lokken **Netlify's bot-protectie** uit, die een
  challenge-interstitial serveert in plaats van de pagina. Gemeten Sessie 220: **5 van de 7
  falers** kwamen daarvandaan, met een onbegrijpelijk symptoom (`TypeError: tc is null`,
  want de interstitial bevat geen enkel site-element). Dezelfde suite lokaal: 27/27 groen.

  ```bash
  python3 scripts/nostore-server.py 8901 "$(pwd)" &
  BASE_URL=http://localhost:8901 npx playwright test
  ```

  `nostore-server.py` markeert élke respons als `no-store` — nodig omdat submodules geen
  `?v=` dragen (zie `.claude/rules/caching-deploy.md` §3). Een guard in
  `tests/e2e/fixtures.js` faalt met een benoemde melding als er tóch een challenge-pagina
  binnenkomt.
- **Begrens elke volle run.** `--global-timeout` is verplicht: zonder die grens kapt een
  3-motorenrun af met *"N did not run"* onder een regel *"N passed"*, wat bijna als groen
  leest (Sessie 216). Haalt de wachtrij je diff niet meer, kap dan af en trieer op codepad
  (Sessie 220).
- **Geen baseline van bekende falers.** Rood = regressie tot je het tegendeel meet. Een
  onopgeloste conditie hoort als assertie in een test, niet als notitie — een notitie meldt
  niets terug (staande regel sinds Sessie 217, zie `.claude/CLAUDE.md`).
- **Bewijs een fix met een mutant**, ook als de test al groen is: draai de oude conditie
  terug en controleer dat de assertie dán rood wordt. Een mutant die niet rood wordt bewijst
  niets (Sessie 220: een te zwakke CV-mutant bleef groen op 23,8% tegen een grens van 50%).
- **Loop de overlever na.** Een reeks van 6 rood en 1 groen is pas een resultaat als je weet
  waaróm die ene groen bleef. In Sessie 221 ontmaskerde dat een claim die al als opgelost in
  het scriptcommentaar stond: de negatieve check "knoptekst begint niet met `Download`" liet
  `>Pak het Playbook<` ongemoeid, terwijl het commentaar beweerde dat een tweede assertie die
  omzeiling afving — die meet een ándere invariant. **Formuleer een guard positief** (*moet
  met "Bekijk" beginnen*) waar dat kan: een verbod op één specifieke fout dekt de klasse niet.
- **Kies de goedkoopste laag die de invariant kan dragen.** Gaat het over **statische tekst**
  (copy, attributen, claims die tussen documenten in lockstep horen), dan hoort de guard in
  `scripts/validate-docs.sh` — die draait al via de pre-commit hook, zonder server, browser of
  suite van 48 minuten. Playwright is voor **gedrag**: geometrie, focus, events, thema's.
  Checks 13 en 14 (Sessie 221) zijn daarom shell-checks. Leid daarbij de grondwaarheid **af**
  uit de bron (`gidsen.html`) in plaats van hem te hardcoderen, anders is de check zelf het
  volgende dat veroudert.

- **Meet gerenderde pixels als het over zichtbaarheid gaat.** `getComputedStyle` en
  `getBoundingClientRect` beschrijven de layout, niet wat er op het scherm staat. In Sessie 222
  waren de box-randen volgens de DOM in orde terwijl ze als streepjeslijn renderden; pas een
  kolomanalyse op een screenshot gaf het bewijs (27px ink / 4px gat, en later 9 naden van 1px
  waarvan de grijswaarden gelijk waren aan de achtergrond). Voor sub-pixel-effecten —
  rasterisatie, fractionele regelafstanden, antialiasing — is de screenshot de enige meting die
  telt.
- **Dek de hele faalklasse, niet één as ervan.** `measureBoxLineWraps()` bewaakte box-randen
  jarenlang groen omdat hij uitsluitend *horizontaal* meet (wrapt de regel?), terwijl de breuk
  *verticaal* zat. Vraag bij een nieuwe guard expliciet: welke dimensies kán dit defect hebben,
  en meet ik ze allemaal? En controleer of de gemelde gevallen überhaupt in de testmatrix zitten
  — `next` en `metasploit` stonden niet in `COMMANDS` terwijl het juist die twee waren.
- **Laat mutanten verschillend falen.** Drie mutanten die alle drie hetzelfde patroon rood maken
  betekenen dat twee asserties overbodig zijn. In Sessie 222 gaven ze 9 / 7 / 1 rood met
  verschillende overlevers (de wrap-tests bij de marge-mutant, `metasploit` bij de pijl-mutant
  omdat die box geen pijl bevat) — dát maakt aannemelijk dat elke assertie iets eigens draagt.

**Unit tests:** bewust nog niet ingericht. De commandolaag wordt via de echte codepad-import
getest (`.claude/skills/verify-terminal`), wat voor een client-side simulator zonder backend
dichter bij het werkelijke gedrag zit dan geïsoleerde parserprogramma's.

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

## 📅 Roadmap & Fases (high-level architectuur)

> Dit is een high-level fase-overzicht voor architecturale context. Voor actuele milestone-percentages, task-counts, sprints en open items: zie `TASKS.md` (single source of truth).

### Fase 1: MVP (M0-M5.5) — ✅ LIVE
**Architecturale scope:** Vanilla JS/CSS client-side terminal simulator + virtual filesystem + 41 commands + 3-tier help system + onboarding + analytics (GA4) + legal compliance + monetization-stack (Ko-fi + Brevo + Gumroad + Lead magnet).

### Fase 2: Tutorials & Scaling (M6 + M8)
**Architecturale scope:** Tutorial state-machine + scenario-registry pattern + Help paging system (conditional bij 50+ commands) + Plausible migratie (privacy-first, cookie-loos).

### Fase 3: Gamification (M7) — ✅ VOLTOOID
**Architecturale scope:** Challenge engine + badge-manager + certificate-generator + dashboard + leaderboard. Lokale persistentie via localStorage (`hacksim_gamification`).

### Fase 4: Content-pijler (Blog) — ✅ LIVE
**Architecturale scope:** 10 educatieve posts + JSON-LD schema + internal cross-linking + unified marketing nav (`getMarketingNavbar()`) + breadcrumbs + BreadcrumbList schema. Validation via `scripts/validate-blogs.sh` pre-commit hook (5 structurele checks).

---

## 🔄 Document Ownership (Sessie 140 — refactor van oude Sync Protocol)

**Eén bron per type informatie.** Geen duplicatie tussen docs.

| Document | Owns | Update-trigger |
|----------|------|----------------|
| `docs/prd.md` | Product requirements, scope, success criteria, success-definitie | Handmatig bij PRD-revisie |
| **`PLANNING.md`** (dit doc) | Architectuur, tech rationale, design system, security/privacy strategie, performance principes (budgets), deployment-strategie, monetization-architectuur (streams + hosting cost-principes, niet specifieke maandtargets) | Handmatig bij architectuur-change |
| **`TASKS.md`** | Execution-tracking: milestones, tasks, sprints, percentages, live metrics (bundle, tests), monetization-stack-status, revenue-data, sessie-counter | `/summary` command-flow (zie `.claude/CLAUDE.md §Sessie Protocol`) |
| **`.claude/CLAUDE.md`** | AI-context, tone, do/don'ts, top-6 sessie-learnings, sessie-protocol-instructies | `/summary` command-flow |
| `docs/sessions/current.md` | Volledig sessie-log archief vanaf rotation-cutoff | `/summary` command-flow |
| `scripts/validate-docs.sh` | Drift-detection: cross-doc invariants als pre-commit hook | Pre-commit (forcing function) |

**Wanneer dit document updaten:**
1. Nieuwe architecturale beslissingen (modular pattern, state-management-keuze)
2. Tech stack wijzigingen (nieuwe library, framework, build-tool)
3. Tool toevoegingen (linter, test-runner, validator)
4. Performance budget aanpassingen
5. Security/privacy strategie aanpassingen
6. Roadmap fase-definities (niet task-niveau — dat woont in TASKS.md)

**NIET hier updaten (woont elders):**
- Milestone-percentages → TASKS.md
- Sprint-status → TASKS.md
- Sessie-counter → `.claude/CLAUDE.md` + TASKS.md
- Live metrics (bundle KB, test counts) → TASKS.md
- Monetization-targets per maand → TASKS.md

**Forcing function:** `scripts/validate-docs.sh` als pre-commit hook detecteert drift tussen docs (sessie-counter mismatch, datum-incongruentie, PRD-version-skew). Commits met drift worden geblokkeerd.

---

## 📚 Referenties & Resources

**Interne Documentatie:**
- `docs/prd.md` - Product Requirements v1.8
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

**Laatst bijgewerkt:** 19 aug 2026 (Sessie 228 — **geen architectuurwijziging, wél een verbreding van de design-system-constraint.** Sessie 226 legde AAA vast op dim- en knoptokens; ongefilterd meten liet zien dat die scope te smal was — 152 element-toestanden onder AA over 18 kleurwaarden. De norm is nu élk element dat zelf tekst rendert, in beide thema's en beide viewports, tegen de effectieve achtergrond. Zie §Design System → Contrast.)
**Versie:** 4.47 (Sessie 228 — **AAA op élk renderend tekstelement, plus drie tokenregels die daaruit volgen:** één token draagt één rol (oppervlak vs. tekst — de CTA-knop stond op 3,30:1 omdat beide rollen in één token zaten); een oppervlak dat van zijn thema afwijkt herdefinieert zijn tokens op de container, niet per selector; en een kleur die tegelijk 15%-tint én tekst is haalt nooit AAA. Uitzonderingen alleen als assertie met de gemeten waarde. Meetdiscipline met code: meten-en-guards §19.)
**Status:** ✅ Deployed - Live in Production | M5.5 Monetization stack deep + Brevo deliverability getuned | M7 Gamification ✅ 100% | Blog content-pijler 14 posts live
**Live URL:** https://hacksimulator.nl/
**GitHub:** https://github.com/JanWillemWubkes/hacksimulator
