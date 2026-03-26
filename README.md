# HackSimulator.nl

Een veilige browser-based terminal simulator waar Nederlandse beginners de fundamenten van ethisch hacken kunnen leren door hands-on te oefenen met echte commando's.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=flat-square)](https://hacksimulator.nl/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](CODE_OF_CONDUCT.md)

**🚀 Live Demo:** [https://hacksimulator.nl/](https://hacksimulator.nl/)
**📦 GitHub:** [https://github.com/JanWillemWubkes/hacksimulator](https://github.com/JanWillemWubkes/hacksimulator)

---

## ⚠️ Development Status

**✅ Live — Actieve Ontwikkeling**

HackSimulator.nl is live op [hacksimulator.nl](https://hacksimulator.nl/) en in actieve doorontwikkeling.

| Status | Feature |
|--------|---------|
| ✅ **Live** | 40+ commands, virtual filesystem, dark/light mode |
| ✅ **Live** | Educational tooltips, security warnings |
| ✅ **Live** | Custom domain (hacksimulator.nl) |
| ✅ **Live** | Guided tutorials & learning paths |
| ✅ **Live** | 15 challenges in 3 moeilijkheidsniveaus |
| ✅ **Live** | Gamification: 21 badges, achievements, leaderboard |
| ✅ **Live** | 10 blog posts met 105+ jargon explanations |

**Contributions welcome!** See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 🎯 Project Overzicht

**Status:** ✅ **LIVE** on Netlify
**Doelgroep:** Nederlandse beginners zonder technische achtergrond - studenten, career switchers en enthousiastelingen

**Performance:**
- Terminal Core: ~340 KB (binnen 400 KB budget)
- Load Time: < 3s LCP target
- WCAG AAA compliant

### Kernwaarden
- ✅ **Educatief** - Elk commando is een leermoment met context
- ✅ **Veilig** - Alle activiteiten zijn gesimuleerd
- ✅ **Toegankelijk** - Geen installatie of registratie nodig
- ✅ **Authentiek** - Realistische commands en output (80/20 realisme)
- ✅ **Ethisch** - Duidelijke focus op legaal en ethisch gebruik

## 🚀 Quick Start

### Development

```bash
# Clone repository
git clone https://github.com/JanWillemWubkes/hacksimulator.git
cd hacksimulator

# Open in VS Code
code .

# Start local server
# Optie 1: VS Code Live Server (right-click index.html)
# Optie 2: Python SimpleHTTPServer
python -m http.server 8000

# Open browser
# http://localhost:8000
```

### Project Structure

```
hacksimulator/
├── index.html              # Main HTML file
├── src/                    # Source code
│   ├── main.js            # Entry point
│   ├── core/              # Terminal engine
│   ├── commands/          # Command implementations
│   ├── filesystem/        # Virtual filesystem
│   ├── ui/                # UI components
│   ├── utils/             # Utilities
│   ├── help/              # Help system
│   └── analytics/         # Analytics
├── styles/                # CSS files
│   ├── main.css          # Global styles
│   ├── terminal.css      # Terminal styles
│   ├── mobile.css        # Mobile adaptations
│   └── animations.css    # Animations
├── assets/               # Static assets
│   ├── legal/           # Legal documents
│   └── data/            # Static data
├── docs/                # Documentation
│   ├── prd.md          # Product Requirements
│   └── commands-list.md # Command specs
└── tests/              # Playwright E2E tests (161 tests, 21 files)
```

## 📸 Screenshots

### Dark Mode (Default)
![HackSimulator - Dark Mode](assets/screenshots/dark-mode.png?v=2)
*Terminal interface met educatieve tooltips en authentic command output*

### Light Mode
![HackSimulator - Light Mode](assets/screenshots/light-mode.png?v=2)
*Volledig responsive design met toegankelijke kleurcontrasten*

## 💻 Tech Stack

- **Frontend:** Vanilla JavaScript ES6+
- **Styling:** Vanilla CSS (no frameworks!)
- **Storage:** localStorage (5MB)
- **Analytics:** Google Analytics 4 (MVP) → Plausible (post-MVP)
- **Hosting:** Netlify (recommended)

### Why Vanilla?
- Terminal UI is simple (no complex state management needed)
- Bundle size critical (< 500KB hard limit)
- Code must be understandable for learners (educational project)

## 📋 Features (40+ Commands)

### Filesystem Commands (11)
`ls`, `cd`, `pwd`, `cat`, `mkdir`, `touch`, `rm`, `cp`, `mv`, `find`, `grep`

### Network Commands (6)
`ping`, `nmap`, `ifconfig`, `netstat`, `whois`, `traceroute`

### Security Commands (5)
`hashcat`, `hydra`, `sqlmap`, `metasploit`, `nikto`

### System Commands (18)
`clear`, `help`, `man`, `history`, `echo`, `date`, `whoami`, `welcome`, `tutorial`, `challenge`, `achievements`, `dashboard`, `certificates`, `leaderboard`, `leerpad`, `hint`, `next`, `shortcuts`

### Special Commands (1)
`reset` - Restore filesystem to original state

## 🎨 Design Principles

### 80/20 Realisme
- Realistisch genoeg om te leren
- Simpel genoeg om te begrijpen
- Geen overwhelming output

### Taal Strategie
- **UI:** Nederlands (target markt vertrouwen)
- **Commands:** Engels (authentiek)
- **Uitleg:** Nederlands (educatief toegankelijk)
- **Errors:** Engels + Nederlandse uitleg

### Educational Layer
Elk commando bevat:
- 💡 Educatieve tips
- ⚠️ Juridische warnings (offensive tools)
- 🎯 Volgende stappen suggesties
- ← Inline uitleg bij output

## 🔧 Development

### Requirements
- Modern browser (Chrome/Firefox/Safari)
- Code editor (VS Code recommended)
- Git
- Live Server (for development)

### Optional
- Node.js (for build scripts)
- Python (for local server)

### Browser Support

**Minimum Versions (ES6 Module Support Required):**
- Chrome 61+ ✅
- Firefox 60+ ✅
- Safari 11+ ✅
- Edge 16+ (Chromium 79+) ✅
- Mobile Safari iOS 11+ ✅
- Chrome Mobile 61+ ✅

**Not Supported:**
- Internet Explorer 11 ❌ (no ES6 modules, no CSS variables)
- Opera Mini ⚠️ (limited support due to extreme compression)

### Performance Budgets
- **Bundle Size:** < 500KB (hard limit)
- **Load Time:** < 3 seconds (4G)
- **Time to Interactive:** < 3 seconds

## 📚 Documentation

- **Product Requirements:** `docs/prd.md`
- **Technical Planning:** `PLANNING.md`
- **Task List:** `TASKS.md`
- **AI Context:** `CLAUDE.md`
- **Command Specifications:** `docs/commands-list.md`

## 🧪 Testing

### Manual Testing (MVP)
- Happy path (correct input)
- Error handling (wrong input)
- Edge cases (empty args, special chars)
- Mobile rendering (40 chars width)
- Cross-browser compatibility

### Beta Testing (Pre-Launch)
- Minimum 5 testers
- 2x beginners, 2x students, 1x developer
- Feedback via Google Forms

## 🚀 Deployment

### Recommended: Netlify
- Free tier sufficient for MVP
- Auto-deploy via Git
- Custom domain support
- SSL included
- CDN globally

```bash
# Deploy to Netlify
netlify deploy --prod
```

## 🔐 Security & Privacy

### Security Measures
- Content Security Policy (CSP)
- Input sanitization (XSS prevention)
- No eval() or innerHTML with user input
- localStorage: no sensitive data

### Privacy (GDPR/AVG Compliant)
- Cookie consent banner
- Privacy Policy (Nederlands)
- Analytics: anonymous data only
- No PII collection
- No command arguments logging

## 📊 Success Metrics

### Primary KPI
- Session duration > 2 minutes average

### Secondary KPIs
- Commands per session > 5
- Return rate > 10% within 7 days

### Red Flags
- Week 2: Session < 30 sec → UX crisis
- Month 3: < 3 commands avg → Onboarding fails
- Month 4: Mobile bounce > 90% → Mobile broken

## 🗺️ Roadmap

### Fase 1: Terminal Core ✅
- [x] Terminal engine + filesystem commands
- [x] Network & security commands
- [x] UX polish + legal compliance
- [x] Cross-browser testing (Chromium, Firefox, WebKit)

### Fase 2: Tutorials ✅
- [x] Guided learning scenarios
- [x] Progress tracking
- [x] 8-stage learning funnel

### Fase 3: Gamification ✅
- [x] 15 challenges in 3 moeilijkheidsniveaus
- [x] 21 badges (common → legendary)
- [x] Certificates & leaderboard
- [x] Achievement system

## 🤝 Contributing

Contributions are welcome! We're looking for:
- 🐛 Bug reports and fixes
- ✨ New command implementations
- 📚 Documentation improvements
- 🌍 Translations (future)
- 🎨 UI/UX enhancements

**Before contributing:**
1. Read our [Contributing Guidelines](CONTRIBUTING.md) for setup and development process
2. Check the [Command Specifications](docs/commands-list.md) for planned features
3. Review our [Code of Conduct](CODE_OF_CONDUCT.md)

### Quick Guidelines
- **Tech:** Vanilla JS/CSS only (no frameworks!)
- **Code Style:** ESLint + Prettier (configs included)
- **Taal:** UI in Nederlands, commands in Engels, uitleg in Nederlands
- **Testing:** Test both dark/light mode, mobile (40 chars), Chrome + Firefox

For detailed instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

We are committed to providing a welcoming and inclusive environment for all contributors. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 HackSimulator.nl

## 📧 Contact

- **Live Demo:** [https://hacksimulator.nl/](https://hacksimulator.nl/)
- **GitHub:** [https://github.com/JanWillemWubkes/hacksimulator](https://github.com/JanWillemWubkes/hacksimulator)
- **Issues:** [GitHub Issues](https://github.com/JanWillemWubkes/hacksimulator/issues) (bug reports, feature requests, questions)

## ⚠️ Legal Disclaimer

**BELANGRIJK:** HackSimulator.nl is uitsluitend bedoeld voor educatieve doeleinden. Alle activiteiten zijn gesimuleerd en beïnvloeden geen echte systemen. Het ongeautoriseerd toegang krijgen tot computersystemen is illegaal. Gebruik deze kennis alleen voor legale en ethische doeleinden.

---

**Built with ❤️ for Dutch cybersecurity learners**

**Last Updated:** 25 maart 2026
**Status:** ✅ Live on Netlify
