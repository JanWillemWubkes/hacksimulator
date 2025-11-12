# Contributing to HackSimulator.nl

Bedankt voor je interesse om bij te dragen aan HackSimulator.nl! 🎉

We zijn blij met alle soorten bijdragen: bug fixes, nieuwe features, documentatie verbeteringen, of zelfs typo correcties.

## 📋 Quick Start

### Development Setup

1. **Clone de repository**
   ```bash
   git clone https://github.com/JanWillemWubkes/hacksimulator.git
   cd hacksimulator
   ```

2. **Open in je browser**
   ```bash
   # Open index.html in je favoriete browser
   # Er is GEEN build step nodig - dit is vanilla JavaScript!
   ```

3. **Install test dependencies (optioneel)**
   ```bash
   npm install
   ```

### Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+), Vanilla CSS
- **No frameworks:** React, Vue, of andere frameworks zijn niet toegestaan
- **No CSS frameworks:** Tailwind, Bootstrap, etc. zijn niet toegestaan
- **Storage:** LocalStorage (client-side only)
- **Testing:** Playwright voor E2E tests
- **Deployment:** Netlify (auto-deploy vanaf main branch)

**Waarom vanilla?** Performance en bundle size zijn kritiek voor dit educatieve platform. Zie `docs/prd.md` §13 voor volledige rationale.

## 🎯 Contribution Guidelines

### Code Style

We gebruiken ESLint en Prettier voor code formatting:

```bash
# Code wordt automatisch geformatteerd volgens .prettierrc
# ESLint config staat in .eslintrc.json
```

**Belangrijkste regels:**
- **Indentatie:** 2 spaces
- **Quotes:** Single quotes voor JavaScript, double quotes voor HTML
- **Semicolons:** Ja, altijd
- **Line length:** Max 100 karakters (waar mogelijk)
- **Naming:**
  - `camelCase` voor functies en variabelen
  - `PascalCase` voor classes
  - `UPPER_SNAKE_CASE` voor constanten

### Branch Naming

Gebruik deze prefixes voor je branches:

- `feature/` - Nieuwe features (bijv. `feature/add-ssh-command`)
- `fix/` - Bug fixes (bijv. `fix/nmap-output-formatting`)
- `docs/` - Documentatie updates (bijv. `docs/update-readme`)
- `refactor/` - Code refactoring (bijv. `refactor/terminal-renderer`)
- `test/` - Test improvements (bijv. `test/add-filesystem-tests`)

### Commit Messages

We volgen een duidelijk commit message formaat:

```
<type>: <korte beschrijving>

[Optionele langere beschrijving]

[Optionele footer met issue references]
```

**Types:**
- `feat:` - Nieuwe feature
- `fix:` - Bug fix
- `docs:` - Documentatie
- `style:` - Code style (formatting, geen functionaliteit)
- `refactor:` - Code refactoring
- `test:` - Tests toevoegen/wijzigen
- `chore:` - Maintenance (dependencies, config, etc.)

**Voorbeelden:**
```bash
feat: Add ifconfig command with network interface simulation

fix: Correct nmap port scanning output format

docs: Update CONTRIBUTING.md with branch naming conventions
```

### Taal Strategie

HackSimulator.nl heeft een specifieke taal strategie:

| Component | Taal | Voorbeeld |
|-----------|------|-----------|
| UI teksten | 🇳🇱 Nederlands | "Welkom", "Instellingen" |
| Commands | 🇬🇧 Engels | `nmap`, `ls`, `cat` |
| Command output | 🇬🇧 Engels + 🇳🇱 context | `PORT 22/tcp OPEN ← SSH poort` |
| Error messages | 🇬🇧 + 🇳🇱 | `Permission denied. Geen toegang tot dit bestand.` |
| Help/man pages | 🇳🇱 Nederlands | Volledige uitleg in Nederlands |
| Tips | 🇳🇱 Nederlands | `[ TIP ] Dit is een veelgebruikte poort.` |

Zie `docs/prd.md` §9 voor volledige details.

## 🐛 Bug Reports

Voordat je een bug report indient, check of de bug al gerapporteerd is in [Issues](https://github.com/JanWillemWubkes/hacksimulator/issues).

**Goede bug reports bevatten:**
- Clear title en beschrijving
- Stappen om te reproduceren
- Verwacht gedrag vs. actueel gedrag
- Screenshots indien relevant
- Browser + versie (Chrome 120, Firefox 121, etc.)
- Console errors (F12 → Console tab)

**Template:**
```markdown
**Beschrijving:**
[Korte beschrijving van de bug]

**Stappen om te reproduceren:**
1. Ga naar...
2. Klik op...
3. Voer commando in: `...`
4. Zie error

**Verwacht gedrag:**
[Wat had er moeten gebeuren]

**Actueel gedrag:**
[Wat er écht gebeurt]

**Screenshots:**
[Indien relevant]

**Browser:**
- Browser: [bijv. Chrome]
- Versie: [bijv. 120.0.6099.109]

**Console errors:**
[Paste errors uit F12 Console]
```

## ✨ Feature Requests

We zijn altijd geïnteresseerd in nieuwe ideeën!

**Voordat je een feature request indient:**
- Check of het binnen de MVP scope past (zie `docs/prd.md` §5)
- Check of het niet conflicteert met onze design principes (geen frameworks, < 500KB bundle, etc.)
- Check of het request al bestaat in [Issues](https://github.com/JanWillemWubkes/hacksimulator/issues)

**Template:**
```markdown
**Feature:**
[Korte titel]

**Probleem:**
[Welk probleem lost dit op voor gebruikers?]

**Oplossing:**
[Beschrijf je voorgestelde oplossing]

**Alternatieven:**
[Andere oplossingen die je hebt overwogen]

**Extra context:**
[Screenshots, voorbeelden van andere tools, etc.]
```

## 🔧 Pull Requests

### Voordat je een PR indient

1. **Test je wijzigingen lokaal**
   - Open `index.html` in je browser
   - Test in zowel dark als light mode
   - Test op mobile (F12 → Device toolbar)
   - Check console voor errors (F12 → Console)

2. **Run Playwright tests (indien van toepassing)**
   ```bash
   npm test
   # Of specifieke browser:
   npx playwright test --project=chromium
   ```

3. **Verifieer dat je aan de code style voldoet**
   - Gebruik ESLint en Prettier
   - Geen console.log statements in production code
   - Comments in Nederlands voor complexe logica

4. **Update documentatie indien nodig**
   - Update README.md als je user-facing changes maakt
   - Update `docs/commands-list.md` als je commands toevoegt/wijzigt
   - Update relevante docs in `docs/` directory

### PR Proces

1. **Fork de repository** (eerste keer)
2. **Maak een feature branch** vanaf `main`
3. **Maak je wijzigingen** volgens guidelines hierboven
4. **Test grondig** (zie "Voordat je een PR indient")
5. **Commit met duidelijke messages** (zie "Commit Messages")
6. **Push naar je fork**
7. **Open een Pull Request** naar `main` branch

**PR Beschrijving moet bevatten:**
```markdown
**Wat:**
[Korte beschrijving van wat deze PR doet]

**Waarom:**
[Waarom is deze change nodig?]

**Hoe getest:**
- [ ] Getest in Chrome
- [ ] Getest in Firefox
- [ ] Getest op mobile
- [ ] Playwright tests draaien (indien van toepassing)
- [ ] Getest in light + dark mode

**Screenshots:**
[Indien UI changes]

**Checklist:**
- [ ] Code volgt style guidelines
- [ ] Comments toegevoegd waar nodig
- [ ] Documentatie geüpdatet
- [ ] Geen console.log statements
- [ ] Geen breaking changes (of gedocumenteerd)

**Gerelateerde issues:**
Closes #[issue nummer]
```

### PR Review Proces

- Maintainers zullen je PR reviewen binnen 1 week
- Feedback wordt gegeven via GitHub comments
- Je wordt gevraagd om wijzigingen aan te brengen indien nodig
- Na approval wordt de PR gemerged naar `main`
- Netlify deploy gebeurt automatisch na merge

## 📚 Command Development

Als je een nieuw command wilt toevoegen, volg deze stappen:

### 1. Check Command Spec

Zie `docs/commands-list.md` voor de volledige lijst van geplande commands en hun specificaties.

### 2. Command Structuur

Commands leven in `src/commands/[category]/`:
- `system/` - System commands (ls, cat, pwd, etc.)
- `filesystem/` - File operations (mkdir, rm, cp, etc.)
- `network/` - Network commands (ping, nmap, netstat, etc.)
- `security/` - Security tools (john, hashcat, metasploit, etc.)

### 3. Command Template

```javascript
// src/commands/[category]/[command].js
export default {
  name: 'commandname',
  category: 'category',
  description: 'Korte Nederlandse beschrijving',

  execute(args, terminal) {
    // Validatie
    if (args.length === 0) {
      return {
        output: 'Usage: commandname [options] <target>',
        error: true
      };
    }

    // Educatieve waarschuwing (voor offensive tools)
    if (this.requiresWarning) {
      terminal.showSecurityWarning(() => {
        // Actual command logic hier
      });
      return;
    }

    // Command logica
    const output = this.generateOutput(args);

    return {
      output: output,
      tip: '[ TIP ] Educatieve context hier'
    };
  },

  generateOutput(args) {
    // 80/20 realisme: Simpel maar authentiek
    return 'Command output here';
  },

  help() {
    return `
NAAM
    ${this.name} - ${this.description}

SYNOPSIS
    ${this.name} [options] <target>

BESCHRIJVING
    Volledige Nederlandse uitleg van wat dit command doet.

OPTIES
    -h, --help      Toon deze help

VOORBEELDEN
    ${this.name} example.com
        Beschrijving van wat dit voorbeeld doet
    `;
  }
};
```

### 4. Educational Patterns

Alle commands moeten educatief zijn:

- **80/20 Output:** Simpel maar authentiek (niet te technisch, niet te simpel)
- **Tips:** Geef context bij output (`[ TIP ] Deze poort...`)
- **Warnings:** Waarschuw bij offensive tools (`[ ! ] Dit is alleen toegestaan...`)
- **Errors als leermomenten:** Geef uitleg + suggesties bij errors

Zie `CLAUDE.md` §5 "Educational Patterns" voor meer details.

## 🧪 Testing

### Manual Testing

**Minimum:**
- Test je wijzigingen in Chrome EN Firefox
- Test dark + light mode (toggle in navbar)
- Test mobile view (F12 → Device toolbar, 375px width minimum)
- Check browser console voor errors

### Playwright E2E Tests

```bash
# All tests
npm test

# Specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Debug mode (headed)
npx playwright test --headed

# Specific test file
npx playwright test tests/example.spec.js
```

Als je nieuwe features toevoegt, overweeg dan om Playwright tests toe te voegen.

## 📖 Documentation

We hebben uitgebreide documentatie in `docs/`:

- `docs/prd.md` - Product Requirements Document (v1.4)
- `docs/commands-list.md` - Command specifications
- `docs/STYLEGUIDE.md` - CSS design system & component library (v1.0)
- `PLANNING.md` - Project planning & milestones
- `TASKS.md` - Task tracking
- `SESSIONS.md` - Development session logs
- `CLAUDE.md` - AI assistant instructions (coding patterns)

**Als je wijzigingen maakt die deze docs beïnvloeden, update ze alsjeblieft.**

## 🤝 Code of Conduct

Dit project volgt de [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

Door bij te dragen ga je akkoord met de voorwaarden hierin.

Onacceptabel gedrag kan gerapporteerd worden via [GitHub Issues](https://github.com/JanWillemWubkes/hacksimulator/issues).

## ❓ Vragen?

- Open een [GitHub Issue](https://github.com/JanWillemWubkes/hacksimulator/issues) met label "question"
- Check bestaande issues - misschien is je vraag al beantwoord
- Lees de documentatie in `docs/` directory

## 🎉 Contributors

Alle contributors worden vermeld in het project. Bedankt voor je bijdrage!

---

**Happy hacking! 🔐**
