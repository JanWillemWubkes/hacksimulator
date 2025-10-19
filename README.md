# HackSimulator.nl

Een veilige browser-based terminal simulator waar Nederlandse beginners de fundamenten van ethisch hacken kunnen leren door hands-on te oefenen met echte commando's.

**🚀 Live Demo:** [https://famous-frangollo-b5a758.netlify.app/](https://famous-frangollo-b5a758.netlify.app/)
**📦 GitHub:** [https://github.com/JanWillemWubkes/hacksimulator](https://github.com/JanWillemWubkes/hacksimulator)

## 🎯 Project Overzicht

**Status:** ✅ **LIVE** on Netlify (M5 Testing Phase - 93.8% MVP Complete)
**Versie:** 1.0.0-mvp
**Doelgroep:** Nederlandse beginners (15-25 jaar) zonder technische achtergrond

**Performance:**
- Bundle Size: 299 KB (40% onder 500 KB budget)
- Load Time: ~2.0s LCP (target: <3s)
- Lighthouse: 88/100/100/100 (Performance/Accessibility/Best Practices/SEO)

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
└── tests/              # Tests (future)
```

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

## 📋 MVP Features (30 Commands)

### System Commands (7)
`clear`, `help`, `man`, `history`, `echo`, `date`, `whoami`

### Filesystem Commands (11)
`ls`, `cd`, `pwd`, `cat`, `mkdir`, `touch`, `rm`, `cp`, `mv`, `find`, `grep`

### Network Commands (6)
`ping`, `nmap`, `ifconfig`, `netstat`, `whois`, `traceroute`

### Security Commands (5)
`hashcat`, `hydra`, `sqlmap`, `metasploit`, `nikto`

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

### Fase 1: MVP (Month 1-3) ✅ **93.8% Complete - LIVE!**
- [x] Project setup (M0 - 100%)
- [x] Terminal engine + 7 system commands (M1 - 100%)
- [x] Filesystem (11 commands) + persistence (M2 - 100%)
- [x] Network & security commands (11 commands) (M3 - 100%)
- [x] UX polish + legal compliance (M4 - 100%)
- [x] GitHub + Netlify deployment ✅ **LIVE**
- [ ] Cross-browser testing (M5 - 14% - in progress)
- [ ] Beta testing (5+ testers)

### Fase 2: Tutorials (Month 4-6)
- Guided learning scenarios
- Progress tracking
- 3 scenarios: recon, webvuln, privesc

### Fase 3: Gamification (Month 7-12)
- Challenge system
- Certificates
- Leaderboard (optional)

## 🤝 Contributing

This is currently a solo educational project. Contributions will be considered post-MVP launch.

### Code Style
- **Naming:** kebab-case for files, camelCase for JS, PascalCase for classes
- **Comments:** Dutch for documentation, English for inline code
- **Formatting:** Use Prettier (config included)
- **Linting:** Use ESLint (config included)

## 📄 License

TBD (will be added pre-launch)

## 📧 Contact

- **Live Demo:** [https://famous-frangollo-b5a758.netlify.app/](https://famous-frangollo-b5a758.netlify.app/)
- **GitHub:** [https://github.com/JanWillemWubkes/hacksimulator](https://github.com/JanWillemWubkes/hacksimulator)
- **Issues:** [GitHub Issues](https://github.com/JanWillemWubkes/hacksimulator/issues)
- **Email:** [TBD - will be added before full launch]

## ⚠️ Legal Disclaimer

**BELANGRIJK:** HackSimulator.nl is uitsluitend bedoeld voor educatieve doeleinden. Alle activiteiten zijn gesimuleerd en beïnvloeden geen echte systemen. Het ongeautoriseerd toegang krijgen tot computersystemen is illegaal. Gebruik deze kennis alleen voor legale en ethische doeleinden.

---

**Built with ❤️ for Dutch cybersecurity learners**

**Last Updated:** 19 oktober 2025
**Version:** 1.0.0-mvp
**Status:** ✅ Live on Netlify (M5 Testing Phase)
