# Style Guide - HackSimulator.nl

**Version:** 1.0
**Last Updated:** 22 november 2025
**Status:** Production Ready

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Typography System](#typography-system)
3. [Color System](#color-system)
4. [Spacing System](#spacing-system)
5. [Border Radius System](#border-radius-system)
6. [Component Library](#component-library)
7. [Interactive States](#interactive-states)
8. [Animation Guidelines](#animation-guidelines)
9. [Background Effects](#background-effects)
10. [Responsive Design](#responsive-design)
11. [Accessibility Standards](#accessibility-standards)
12. [Code Conventions](#code-conventions)
13. [Common Patterns](#common-patterns)
14. [Anti-Patterns](#anti-patterns)

---

## Design Philosophy

### Core Principles

HackSimulator.nl volgt een **Cyberpunk Terminal Aesthetic** met educatieve focus:

1. **Authenticity over Realism** - 80/20 regel: Commands voelen echt, maar output is gesimplificeerd voor educatie
2. **Educational First** - Elk element is een leermoment (tips, warnings, context)
3. **Accessibility Commitment** - WCAG AAA contrast (15.3:1), keyboard navigation, screen reader support
4. **Performance Obsessed** - Bundle < 500KB, vanilla JS/CSS, zero-build pipeline

### Visual Identity

- **GitHub Dark Background** (#0d1117) - Professional depth (not pure black)
- **HTB Neon Lime Prompt** (#9fef00) - Exciting hacker vibe for terminal interaction
- **GitHub Muted Success** (#3fb950) - Trustworthy feedback (distinct from prompt)
- **Hybrid Philosophy** - Best of both worlds: HTB excitement + GitHub professionalism
- **Monospace Typography** - Terminal aesthetic consistency

---

## Typography System

### Dual Font Strategy

HackSimulator.nl gebruikt **twee font stacks** voor verschillende contexten:

#### Primary: Terminal Font (Monospace)

```css
--font-terminal: 'Courier New', 'Courier', monospace;
```

**Gebruik voor:**
- ✅ Terminal output/input (authenticity)
- ✅ Buttons, badges, UI controls (hacker aesthetic)
- ✅ Modal headers & short content (<100 words)
- ✅ Code blocks & command examples

**Rationale:** Monospace fonts geven retro terminal feel en zijn essentieel voor de brand identity.

#### Secondary: UI Font (Sans-serif)

```css
--font-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
```

**Gebruik voor:**
- ✅ Legal documents (>500 words) - readability
- ✅ Help articles & tutorials (long-form content)
- ✅ Educational content waar eye strain een issue is

**Rationale:** System fonts zijn 20-30% sneller te lezen bij lange teksten en beter voor dyslexie.

### Beslisboom: Welke Font?

| Content Type | Font | Reason |
|--------------|------|--------|
| Terminal output/input | `--font-terminal` | Core experience, authenticity |
| Buttons/controls | `--font-terminal` | Consistent hacker aesthetic |
| Modal headers | `--font-terminal` | Visual hierarchy (loud) |
| Legal docs (>500w) | `--font-ui` | Readability, accessibility |
| Help/tutorials | `--font-ui` | Educational clarity |
| Short modals (<100w) | `--font-terminal` | Brand consistency |

### Font Sizes

```css
:root {
  --font-size-base: 18px;       /* Desktop terminal */
  --font-size-mobile: 16px;     /* Mobile terminal */
}
```

**Rationale:**
- 18px base prevents 16px mobile zoom-on-focus on iOS
- Minimum 16px for accessibility (WCAG AAA)
- Legal modal text: 17px (tussen terminal en body text)

### Line Heights

```css
--line-height: 1.5;  /* Standard for terminal output */
```

**Context-specific:**
- Terminal code: `1.2` (compact, zoals echte terminals)
- Long-form text: `1.6-1.7` (legal docs, betere leesbaarheid)

---

## Color System

### Color Palette

#### Background Layers

```css
--color-bg: #0d1117;              /* GitHub Dark - professional depth (not pure black) */
--color-bg-terminal: #0d1117;     /* Same as body - unified dark */
--color-bg-modal: #161b22;        /* Modals/overlays - GitHub secondary */
--color-bg-hover: #21262d;        /* Hover states - GitHub tertiary */
```

**Rationale:** GitHub Dark (#0d1117) biedt professionele uitstraling met subtiele depth. Proven palette van 100M+ developers.

#### Terminal Text Colors (Hybrid Approach)

```css
--color-prompt: #9fef00;          /* HTB Neon Lime - exciting hacker vibe */
--color-input: #9fef00;           /* HTB Neon Lime - user commands (consistent) */
--color-text: #c9d1d9;            /* GitHub soft white - primary output */
--color-text-dim: #8b949e;        /* GitHub muted grey - secondary info */
```

**Hybrid Philosophy:**
- **#9fef00** (HTB neon lime) - Prompt/input only (excitement waar het telt)
- **#c9d1d9** (GitHub soft white) - Body text (professional, readable)
- **#8b949e** (GitHub grey) - Secondary info (subtle hierarchy)

**Rationale:** Best of both worlds - neon prompt geeft "hacker vibe", muted text zorgt voor trust en leesbaarheid.

#### Semantic Colors

```css
--color-error: #f85149;           /* GitHub red - errors (60% sat) */
--color-warning: #d29922;         /* GitHub orange - warnings (55% sat) */
--color-info: #79c0ff;            /* GitHub blue - tips/hints (60% sat) */
--color-success: #3fb950;         /* GitHub muted green - DISTINCT from prompt! */
```

**Accessibility:**
- Error red: 6.8:1 contrast ratio (WCAG AA)
- Warning orange: 7.2:1 contrast ratio (WCAG AAA)
- Info blue: 8.1:1 contrast ratio (WCAG AAA)
- Success green: 9.2:1 contrast ratio (WCAG AAA)
- **Prompt distinctie:** Success (#3fb950 muted) ≠ Prompt (#9fef00 neon) voor duidelijke feedback

#### UI Elements

```css
--color-ui-primary: #58a6ff;      /* GitHub blue - primary buttons (60% sat) */
--color-ui-hover: #79c0ff;        /* Lighter blue - hover state */
--color-ui-secondary: #8b949e;    /* GitHub grey - secondary elements */
--color-border: #30363d;          /* GitHub border - visible but subtle */
--color-link: #79c0ff;            /* GitHub blue - links (60% sat) */
--color-modal-text: #c9d1d9;      /* GitHub soft white - readable */
```

**Rationale:** GitHub blue palette voor UI elements zorgt voor professionele uitstraling en consistente user experience.
- White voor legal text (maximale readability bij 2000+ woorden)
- **White voor navbar utility icons** (distinct van primary nav links, industry standard: GitHub, VS Code, Slack)

### Color Usage Rules

#### ✅ DO:

```css
/* Use CSS variables for all colors */
color: var(--color-error);

/* Semantic color names in output */
<div class="terminal-output-error">Error: Command not found</div>

/* Override emoji colors explicitly (prevent inheritance) */
.tip-icon { color: var(--color-info); }
```

#### ❌ DON'T:

```css
/* Hardcode colors */
color: #ff0055;  /* BAD - use var(--color-error) */

/* Use transparent in dark themes */
background: transparent;  /* Invisible op zwart! */

/* Mix semantic messages in single output */
renderError(`Error\n💡 TIP: Try this`);  /* Tip inherits error color! */
```

**Fix voor laatste issue** (uit Sessie 19):
```javascript
// Split semantic types
renderError("Error: Command not found");
renderInfo("💡 TIP: Try 'help' command");
```

### Contrast Ratios

| Combination | Ratio | WCAG Level |
|-------------|-------|------------|
| #ccffcc on #000000 | 15.3:1 | AAA ✅ |
| #00ff88 on #000000 | 11.2:1 | AAA ✅ |
| #00ffff on #000000 | 10.5:1 | AAA ✅ |
| #ffaa00 on #000000 | 9.1:1 | AAA ✅ |
| #ff0055 on #000000 | 8.2:1 | AAA ✅ |

**Gemeten met:** WebAIM Contrast Checker

### Context-Aware Theming (Dark Frame Pattern)

**Principle:** Light mode ≠ inverted dark mode. Each theme is **optimized for its usage context**.

#### Strategy: Neon Chrome, Professional Content

```css
/* Light Mode: Differentiated color strategy */
[data-theme="light"] {
  /* CHROME (navbar/footer): Stays dark → neon cyan preserved */
  --color-footer-link: #00ffff;         /* NEON CYAN - signature identity */
  --color-navbar-dropdown-icon: #00ffff; /* Consistent with dark mode */

  /* CONTENT (terminal area): Light bg → professional blue */
  --color-info: #0969da;                /* GitHub blue - proven readability */
  --color-link: #0969da;                /* Matches info color */
  --color-link-hover: #0550ae;          /* Darker blue hover */
}
```

#### Rationale: Why Different Colors Per Theme?

**Physics of Color Perception:**
- **Dark mode:** Additive color (screen emits light) → bright neon = glow effect ✨
- **Light mode:** Subtractive color (reflected light) → bright neon = harsh glare 💥

**UX Research (Sessie 32 analysis):**

| Tool | Dark Mode Links | Light Mode Links | Pattern |
|------|----------------|------------------|---------|
| **VS Code** | Cyan #4fc1ff | Blue #0078d4 | Warmer in dark, cooler in light |
| **GitHub** | Cyan #58a6ff | Blue #0969da | Desaturated in light |
| **Figma** | Bright #0c8ce9 | Darker #0d99ff | Contrast-optimized per theme |

**Conclusion:** Industry leaders use **context-specific colors**, never 1:1 mapping between themes.

#### Implementation: Surgical Color Targeting

**What Changed (Sessie 32):**
```css
/* 4 variables updated for light mode content */
--color-info:          #00bbff → #0969da  /* Tips, hints */
--color-link:          #00bbff → #0969da  /* Terminal links */
--color-ui-secondary:  #00bbff → #0969da  /* Secondary UI */
--color-link-hover:    #0099ff → #0550ae  /* Link hover */

/* 3 variables UNCHANGED for light mode chrome */
--color-footer-link:         #00ffff ✅  /* Neon signature intact */
--color-footer-link-hover:   #33ffff ✅  /* Hover preserved */
--color-navbar-dropdown-icon: #00ffff ✅  /* Icons preserved */
```

**Result:**
- ✅ Cyberpunk identity preserved (neon chrome frame in both modes)
- ✅ Content readability optimized (professional blue on white, less eye strain)
- ✅ Visual sophistication (context-aware = design expertise, not inconsistency)

#### Design Decision Tree: When to Use Dark Frame Pattern?

**Use Dark Frame Pattern when:**
- Tool has strong brand color identity (neon, vibrant accent)
- Light mode users need **productivity** (long reading sessions)
- Chrome elements (nav/footer) are visually separated from content

**Example:** HackSimulator.nl
- Dark nav/footer = cyberpunk frame (always dark, both themes)
- Content area = adaptive (white in light, black in dark)
- Neon cyan = signature on dark chrome ✅
- GitHub blue = readability on light content ✅

**Avoid when:**
- Simple informational sites (blog, documentation without brand identity)
- Uniform color aesthetic needed (monochrome, minimalist design)
- Content and chrome are not visually separated

---

## Spacing System

### Spacing Tokens

```css
:root {
  --spacing-xs: 4px;    /* Tight spacing (icon margins) */
  --spacing-sm: 8px;    /* Small gaps (button groups) */
  --spacing-md: 16px;   /* Standard padding/margin */
  --spacing-lg: 24px;   /* Section spacing */
  --spacing-xl: 32px;   /* Large section breaks */
}
```

### Usage Guidelines

| Token | Use Cases | Examples |
|-------|-----------|----------|
| `xs` (4px) | Icon margins, tight lists | `.tip-icon { margin-right: var(--spacing-xs); }` |
| `sm` (8px) | Button groups, inline elements | `.cookie-buttons { gap: var(--spacing-sm); }` |
| `md` (16px) | Standard padding, card spacing | `.modal-content { padding: var(--spacing-md); }` |
| `lg` (24px) | Section separation, margins | `footer { margin-top: var(--spacing-lg); }` |
| `xl` (32px) | Major layout breaks | `.modal-content { padding: var(--spacing-xl); }` |

### Layout Constants

```css
--terminal-padding: 20px;         /* Terminal container padding */
--terminal-max-width: 1200px;     /* Max terminal width (readability) */
```

**Rationale:**
- 1200px max-width: 80-90 tekens per regel (optimaal voor lezen)
- 20px padding: ruimte voor mobiele duimen (44px touch targets)

---

## Border Radius System

### CSS Variables

```css
:root {
  --border-radius-button: 4px;      /* Standard buttons, inputs, dropdowns */
  --border-radius-small: 2px;       /* Small UI chips, toggles, bars */
  --border-radius-modal: 8px;       /* Large containers, modals */
  --border-radius-none: 0;          /* Explicit opt-out (brutalist elements) */
  --border-radius-circle: 50%;      /* Circular elements */
}
```

### Beslisboom: Welke Border Radius?

| Element Type | Variable | Value | Use Case |
|--------------|----------|-------|----------|
| Buttons (all sizes) | `--border-radius-button` | 4px | Primary, secondary, small buttons |
| Input fields | `--border-radius-button` | 4px | Textareas, text inputs |
| Dropdowns | `--border-radius-button` | 4px | Navbar dropdowns, select menus |
| Error boxes | `--border-radius-button` | 4px | Feedback errors, warnings |
| Toggle chips | `--border-radius-small` | 2px | Theme toggle labels, small badges |
| Hamburger bars | `--border-radius-small` | 2px | Mobile menu animation bars |
| Modals | `--border-radius-modal` | 8px | Modal containers, large overlays |
| Circular buttons | `--border-radius-circle` | 50% | Floating action buttons |
| Brutalist elements | `--border-radius-none` | 0 | Explicit design choice (rare) |

### Rationale

- **4px als standaard**: Industry pattern (GitHub, VS Code) - subtiel afgerond zonder "bubbly" te worden
- **Hiërarchie via size**: Grotere containers (8px modals) = meer rounding, kleine UI (2px chips) = minder rounding
- **Consistency over aesthetics**: Alle buttons gebruiken DEZELFDE radius - voorspelbaar voor gebruikers
- **Mobile-friendly**: 4px radius verbetert touch target detectie op schermranden (iOS Safari quirk)

### Anti-Patterns

❌ **NEVER:**
- Hardcode border-radius waarden (gebruik altijd CSS variables)
- Mix verschillende radius waarden op hetzelfde component type (inconsistent UX)
- Gebruik >12px radius (te "bubbly" voor developer tools - breekt cyberpunk aesthetic)
- Skip border-radius op interactive elements (buttons zonder radius zien broken uit)

✅ **ALWAYS:**
- Gebruik semantische variable namen (`--border-radius-button` not `--radius-4`)
- Test visual consistency across all button states (hover, focus, active)
- Apply border-radius to ALL interactive elements (buttons, inputs, dropdowns)

### Component Examples

#### Button met Correct Border Radius
```css
.btn-primary {
  background-color: var(--color-ui-primary);
  border-radius: var(--border-radius-button);  /* ✅ Correct */
  /* ... other styles ... */
}
```

#### Modal met Correct Border Radius
```css
.modal-content {
  background-color: var(--color-bg-modal);
  border-radius: var(--border-radius-modal);  /* ✅ Correct - larger container */
  /* ... other styles ... */
}
```

#### Toggle Chip met Correct Border Radius
```css
.toggle-option {
  padding: 4px 8px;
  border-radius: var(--border-radius-small);  /* ✅ Correct - small UI element */
  /* ... other styles ... */
}
```

---

## Component Library

### Buttons

#### Primary Button

```css
.btn-primary {
  background-color: var(--color-ui-primary);  /* #00ff00 */
  color: #000000;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-terminal);
  border: 2px solid var(--color-ui-primary);
}
```

**Gebruik:** Call-to-action buttons (modal accept, feedback submit)

#### Secondary Button

```css
.btn-secondary {
  background-color: transparent;
  color: var(--color-ui-secondary);  /* Cyan */
  border: 2px solid var(--color-ui-secondary);
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-terminal);
}
```

**Gebruik:** Alternative actions (cookie decline, cancel)

#### Small Button

```css
.btn-small {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 16px;
  background-color: var(--color-ui-primary);
  color: #000000;
  border: 1px solid var(--color-ui-primary);
}
```

**Gebruik:** Cookie banner, compact interfaces

### Modals

**Unified Modal System (Sessie 37 - Pattern A Universal)**
All modals use **Pattern A** (full-width single button footer) with consistent terminal aesthetics: black background (dark mode), white background (light mode), border, shadow, and scale animation.

#### 3-Layer Architecture Pattern (Sessie 33)

**Enterprise Modal Structure:**
1. **Header** - Title + close button (fixed position, or title in body)
2. **Body** - Scrollable content INCLUDING tips (overflow on inner element prevents border-radius clipping)
3. **Footer** - Single action button ONLY (no tips, no competing elements)

```html
<div class="modal" role="dialog" aria-labelledby="modal-title">
  <div class="modal-content">
    <button class="modal-close" aria-label="Sluiten">&times;</button>

    <!-- Body: ALL content goes here (title, text, tips) -->
    <div class="modal-body">
      <h2 id="modal-title">Modal Titel</h2>
      <p>Content hier...</p>

      <!-- Tips belong in BODY, not footer -->
      <p class="modal-tip">[ TIP ] Educational context</p>
    </div>

    <!-- Footer: ONLY action button -->
    <div class="modal-footer">
      <button class="btn-secondary">Sluiten</button>
    </div>
  </div>
</div>
```

**Key Principle:** Tips and educational content belong in the **body** (content), not the **footer** (chrome). Footer = actions only.

#### Styling

```css
/* Overlay */
.modal {
  display: none;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: var(--color-modal-overlay);
  z-index: var(--z-modal);
  justify-content: center;
  align-items: center;
}

.modal.active {
  display: flex;
}

/* Container (Outer - Shape) - NO PADDING on outer element */
.modal-content {
  background-color: var(--color-bg-terminal);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-modal);
  padding: 0;  /* Padding on children, NOT container */
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 255, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;  /* Clips children to border-radius */

  /* Scale animation */
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.modal.active .modal-content {
  opacity: 1;
  transform: scale(1);
}

[data-theme="light"] .modal-content {
  background-color: #ffffff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Body: Scrollable - Padding on inner element */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  background-color: var(--color-bg-terminal);
}

[data-theme="light"] .modal-body {
  background-color: #ffffff;
}

/* Footer: Pattern A (full-width button) */
.modal-footer {
  flex-shrink: 0;  /* Don't compress */
  padding: var(--spacing-lg) 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: var(--color-bg-terminal);
}

[data-theme="light"] .modal-footer {
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-footer > button {
  width: 100%;  /* Pattern A: full-width single button */
}
```

#### Button Semantics

**Dismissive Actions = Secondary Style**
```html
<!-- Modal close buttons always use .btn-secondary -->
<button class="btn-secondary">Sluiten</button>
<button class="btn-secondary">Annuleer</button>
```

**Affirming Actions = Primary Style**
```html
<!-- Submit/confirm actions use .btn-primary -->
<button class="btn-primary">Versturen</button>
<button class="btn-primary">Ik begrijp het - Verder</button>
```

**Rationale:** Primary buttons are for affirming actions (save, confirm, submit). Modal dismissal is a secondary/cancel action.

#### Why Pattern A Universal?

**Pattern A** (full-width single button) is the universal standard for ALL modals because:

1. **Cognitive Load**: One footer pattern = one mental model for users
2. **Terminal Aesthetic**: Tips belong in output (body), not chrome (footer)
3. **Mobile UX**: No competing elements = thumb-friendly 44px target
4. **Accessibility**: Single clear action = WCAG AAA compliant
5. **Industry Standard**: VS Code, GitHub Desktop, Slack all use single-button footers

**Anti-Pattern:** Flex layout with tip + button creates:
- Competing visual elements (where do users look?)
- Responsive complexity (stacking behavior on mobile)
- Semantic confusion (tips are content, not actions)

#### Custom Modal Extensions

For specialized modals (search, settings), extend the base pattern:

```html
<div class="modal" id="custom-modal">
  <div class="modal-content custom-modal">  <!-- Add custom class -->
    <!-- Standard modal structure -->
    <!-- Custom elements (search input, etc.) -->
  </div>
</div>
```

```css
/* Only override specific aspects, inherit base styling */
.custom-modal {
  max-height: 70vh;  /* Override specific properties */
}
```

#### Focus Management Pattern

```javascript
// Prevent global focus-steal when modal is open
document.addEventListener('click', (e) => {
  if (!e.target.closest('.modal.active')) {
    terminalInput.focus();  // Only refocus if click outside modal
  }
});
```

### Terminal Output Types

#### HTML Structure

```html
<div class="terminal-line">
  <span class="terminal-prompt">user@hacksim:~$</span>
  <span class="terminal-input">nmap 192.168.1.1</span>
</div>
<div class="terminal-output terminal-output-normal">
  Scanning for open ports...
</div>
```

#### Output Classes

```css
.terminal-output-normal  { color: var(--color-text); }        /* #ccffcc */
.terminal-output-error   { color: var(--color-error); }       /* #ff0055 */
.terminal-output-warning { color: var(--color-warning); }     /* #ffaa00 */
.terminal-output-info    { color: var(--color-info); }        /* #00ffff */
.terminal-output-success { color: var(--color-success); }     /* #00ff88 */
```

#### Icon Color Override Pattern

**Problem:** Emoji icons inherit parent output color (error red overschrijft tip cyan)

**Solution** (Sessie 19):
```css
/* Force icon colors regardless of parent */
.tip-icon     { color: var(--color-info); }      /* Always cyan */
.warning-icon { color: var(--color-warning); }   /* Always orange */
.success-icon { color: var(--color-success); }   /* Always green */
.error-icon   { color: var(--color-error); }     /* Always magenta */
```

### Forms

#### Text Input

```css
#terminal-input {
  flex: 1;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-input);              /* Neon green */
  font-family: var(--font-terminal);
  font-size: 18px;                        /* Prevent iOS zoom on focus */
  padding: 8px 12px;
  caret-color: var(--color-prompt);       /* Green caret */
  outline: none;
}
```

**Focus state:**
```css
#terminal-input:focus {
  outline: none;  /* Caret color + border provide sufficient feedback */
}
```

#### Textarea

```css
#feedback-comment {
  width: 100%;
  background-color: #1a1a1a;
  color: #cccccc;
  border: 1px solid #444444;
  padding: 12px;
  font-family: var(--font-terminal);
  font-size: 17px;
  resize: vertical;
  border-radius: 4px;
}

#feedback-comment:focus {
  outline: 2px solid var(--color-info);   /* Cyan outline */
  outline-offset: 2px;
}
```

### Feedback Widget

#### Floating Button

```css
.floating-btn {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  background-color: var(--color-ui-primary);
  color: #000000;
  font-size: 2rem;                        /* Emoji size */
  border: none;
  box-shadow:
    0 0 0 2px #333333,                    /* Inner border */
    0 0 0 10px var(--color-ui-primary);   /* Outer glow */
}
```

#### Rating Stars

```css
.star {
  background: none;
  font-size: 4.5rem;                      /* Extra large (72px) */
  padding: var(--spacing-xs);
  color: #555;                            /* Medium grey (unselected) */
  transition: all var(--transition-fast);
}

.star:hover,
.star.selected {
  color: var(--color-ui-primary);         /* Pure neon green */
  text-shadow: 0 0 8px var(--color-ui-primary);  /* Subtle glow */
}
```

**Design Decision** (Sessie 18):
- Stars groter gemaakt (3rem → 4.5rem) voor balanced visual weight
- Question text groter (17px → 20px) voor hierarchy
- Margin tussen vraag en stars vergroot (8px → 12px)

### Cookie Banner

```css
.cookie-banner {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background-color: var(--color-bg-modal);
  border-top: 2px solid var(--color-border);
  padding: var(--spacing-md);
  z-index: var(--z-cookie);               /* 2000 (highest) */
}

.cookie-content {
  max-width: var(--terminal-max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}
```

**Timing:** 2 seconden delay na page load (niet onmiddellijk, goede UX)

### Footer

```css
footer {
  position: static;                       /* NOT fixed (blocks input) */
  background-color: var(--color-bg);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 16px;                        /* Was 12px - accessibility fix Sessie 15 */
  text-align: center;
  margin-top: var(--spacing-lg);
}
```

**Accessibility Fix** (Sessie 15): Footer text 12px → 16px (+33%, WCAG AAA requirement)

### ASCII Box Drawing

**Purpose:** ASCII boxes provide visual hierarchy and emphasis for critical content (security warnings, multi-line tips, structured data) while maintaining terminal authenticity.

#### Character Set

**Heavy Borders** (High visual weight - use for warnings, errors, critical content):
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  SECURITY WARNING              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Characters:
┏ (U+250F) Top-left     ┓ (U+2513) Top-right
┗ (U+2517) Bottom-left  ┛ (U+251B) Bottom-right
━ (U+2501) Horizontal   ┃ (U+2503) Vertical
```

**Light Rounded** (Friendly visual weight - use for tips, info, structured data):
```
╭─────────────────────────────────╮
│ TIP: Educational Content        │
├─────────────────────────────────┤
│ Multi-line content here         │
╰─────────────────────────────────╯

Characters:
╭ (U+256D) Top-left     ╮ (U+256E) Top-right
╰ (U+2570) Bottom-left  ╯ (U+256F) Bottom-right
─ (U+2500) Horizontal   │ (U+2502) Vertical
├ (U+251C) Left T       ┤ (U+2524) Right T (dividers)
```

#### Utility Functions

Located in `/src/utils/asciiBox.js`:

```javascript
import { boxText, boxHeader } from '../../utils/asciiBox.js';

// Full content box (header + content)
const box = boxText(content, 'HEADER TEXT', 60);

// Header-only box (man pages)
const header = boxHeader('COMMAND NAME', 60);
```

#### When to Use Boxes

**✅ DO use boxes for:**
- **Security warnings** (consent prompts, legal warnings)
- **Multi-line tips** (3+ lines of educational content)
- **Error explanations** (error + why + what to do)
- **Structured data** (tables, lists with headers)
- **Progress/status blocks** (achievements, leerpad updates)
- **Man page titles** (header-only boxes)

**❌ DON'T use boxes for:**
- **Single-line tips** - ASCII brackets `[ TIP ]` are sufficient
- **Command output** - Would break 80/20 realism (real terminals don't box ls output)
- **Success messages** - Keep minimal (`[ ✓ ] File created`)
- **Every error** - Reserve for educational multi-line explanations
- **Decoration** - Only use when adding semantic meaning

#### Semantic Rules

**Heavy borders (┏━┓) for:**
- Security warnings
- Error messages
- Destructive action confirmations
- **Rationale:** Maximum visual weight = "STOP and read carefully"

**Light rounded (╭─╮) for:**
- Educational tips
- Info boxes
- Progress reports
- Help system content
- **Rationale:** Friendly, less alarming, "helpful guidance"

#### Width Standards

```javascript
// Standard widths
const WIDTH_STANDARD = 60;  // Default for most content
const WIDTH_FULL = 80;      // Full terminal width (rare, only for tables)

// Always use consistent widths - mixing 40/60/80 creates visual noise
boxText(content, 'Header', 60);  // ✅ Standard
boxText(content, 'Header', 45);  // ❌ Non-standard
```

#### Implementation Example

**Security Warning Pattern (Heavy Borders):**
```javascript
import { boxText } from '../../utils/asciiBox.js';

const warningContent = `HYDRA - Network Logon Brute Force Tool

JURIDISCHE WAARSCHUWING:
Brute force aanvallen zonder toestemming zijn ILLEGAAL.
Dit is een strafbaar feit onder de Computercriminaliteit wet.

  Straf: Tot 6 jaar gevangenisstraf

EDUCATIEF GEBRUIK:
Deze simulator demonstreert brute force concepten veilig.`;

const warningBox = boxText(warningContent, 'SECURITY WARNING', 60);
return `${warningBox}\n\n[ ? ] DOORGAAN? [j/n]`;
```

**Tip Consolidation Pattern (Light Borders - Future):**
```javascript
// Current: Multiple [ ? ] lines (verbose)
// Future: Single boxed block (cleaner)
const tipBox = boxText(
  '• Open poorten = aanvalsvectoren\n' +
  '• Closed = service niet beschikbaar\n' +
  '• Filtered = firewall blokkeert',
  'TIP: PORT SCANNING',
  60
);
```

#### Box Drawing Pitfalls

**❌ Character Count Precision:**
```javascript
// OFF BY ONE = VISUAL CORRUPTION
const header = 'TITLE';
const width = 20;
const padding = width - header.length;  // Must be EXACT
```

**❌ Mixing Styles:**
```javascript
// Don't mix heavy and light in same box
┏━━━━━━━━━━┓  // ✅ Consistent heavy
│ Content  │  // ❌ Light vertical with heavy horizontal
┗━━━━━━━━━━┛
```

**❌ Overuse:**
```javascript
// Every tip in a box = visual clutter
[ TIP ] Single line tip  // ✅ Sufficient
┏━━━━━━━━━━━━━━━━━━┓
┃ TIP: One line    ┃  // ❌ Overkill
┗━━━━━━━━━━━━━━━━━━┛
```

#### Current Implementation Status

**Implemented (Sessie 61):**
- ✅ Heavy border security warnings (hydra, metasploit, sqlmap, nikto, hashcat)
- ✅ Man page header boxes (all 32 commands)
- ✅ Help command table (light rounded borders)

**Future (Fase 2 & 3):**
- ⏳ Tip consolidation (multi-line tips → single boxed block)
- ⏳ Error education (permission denied + educational context)
- ⏳ Progress reports (leerpad achievements, system messages)

---

## Interactive States

### Hover States

```css
button:hover {
  transform: translateY(-2px);            /* Subtle lift */
}

.btn-primary:hover {
  background-color: var(--color-ui-hover);  /* Brighter green */
}

a:hover {
  opacity: 0.8;                           /* Subtle fade */
}
```

**Timing:** `var(--transition-fast)` (0.15s) voor responsive feel

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--color-info);   /* Cyan outline (accessible) */
  outline-offset: 2px;
  transition: outline-offset var(--transition-fast);
}

button:focus {
  outline: 2px solid var(--color-info);
  outline-offset: 2px;
}
```

**Accessibility:** Altijd zichtbare focus indicators (keyboard navigation)

### Active States

```css
button:active {
  transform: translateY(0);               /* Reset lift on click */
}

.mobile-key:active {
  background-color: rgba(0, 255, 136, 0.2);
  border-color: var(--color-prompt);
}
```

### Disabled States

**Not implemented yet** - Terminal commands hebben geen disabled state (simulatie altijd actief)

---

## Animation Guidelines

### Transition Speeds

```css
:root {
  --transition-fast: 0.15s ease;          /* Instant feedback (hover) */
  --transition-normal: 0.3s ease;         /* Standard (modal open) */
}
```

**Usage:**
- **Fast (0.15s)**: Hover, focus, button states
- **Normal (0.3s)**: Modal fade-in, page transitions

### Keyframe Animations

#### Fade In

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}
```

**Gebruik:** Modal appearance, hints, notifications

#### Shake (Error Feedback)

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
  animation: shake 0.5s ease-in-out;
}
```

**Gebruik:** Invalid command input (optioneel, niet geïmplementeerd in MVP)

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Accessibility:** Respecteert OS-level motion preferences

---

## Background Effects

### Perspective Grid (Cyberpunk Aesthetic)

HackSimulator.nl gebruikt een **3D perspective grid achtergrond** voor een cyberpunk terminal aesthetic.

#### Visual Design

```css
.grid-background {
  position: fixed;
  z-index: -1;
  /* Grid rendered via ::before en ::after pseudo-elements */
}
```

**Pattern:** Repeating linear gradients met 3D transforms

#### Kleurstrategie: Grijs + Groen Mix

```css
/* CSS Variables */
--grid-color-base: rgba(42, 42, 42, 0.8);          /* Dark grey (#2a2a2a) - optimal readability */
--grid-color-accent: rgba(0, 255, 136, 0.25);      /* Green accent lines - cyberpunk pop */
--grid-size-desktop: 60px;                         /* Grid spacing */
--grid-size-mobile: 40px;                          /* Mobile grid (kleiner) */
--grid-perspective: 800px;                         /* 3D depth */
--grid-opacity: 1.0;                               /* Full visibility for grid layer */
```

**Rationale:**
- **Dark Grey (rgba(42, 42, 42, 0.8))** = Neutral foundation, optimal readability vs green text (+35-40% improvement)
- **Groen (rgba(0, 255, 136, 0.25))** = Brand accent, matcht terminal prompt kleur (#00ff88), cyberpunk pop
- **Selective accent** = Elke 5e lijn groen (20%), rest grijs (80%) - visuele hiërarchie zonder overweldigend te zijn
- **Balanced opacity** = Grid duidelijk zichtbaar maar terminal output blijft focus

#### Implementation Pattern

**Dual Pseudo-Element Approach:**

1. **::before** = Basis grid (grijs + groen lijnen)
2. **::after** = Glow layer (alleen groene lijnen met blur filter)

```css
.grid-background::before {
  /* 4 stacked repeating-linear-gradients */
  /* 1. Groene horizontale lijnen (elke 300px) */
  /* 2. Grijze horizontale lijnen (elke 60px) */
  /* 3. Groene verticale lijnen (elke 300px) */
  /* 4. Grijze verticale lijnen (elke 60px) */

  transform: perspective(800px) rotateX(60deg) translateZ(-100px);
  opacity: 0.6;
}

.grid-background::after {
  /* Glow effect - alleen groene lijnen */
  filter: blur(1px);
  opacity: 0.8;
}
```

**Performance:** Native CSS gradients = GPU-accelerated, geen extra HTTP requests

#### 3D Perspective Effect

**Transform Stack:**
```css
/* On container */
perspective: 800px;
perspective-origin: center center;

/* On ::before and ::after */
transform: rotateX(35deg) translateY(-15%);
transform-origin: center center;
transform-style: preserve-3d;
```

**Visual Result:** Grid appears to recede naar horizon (zoals screenshot), geeft terminal "floating in 3D space" gevoel

#### Glow Effect

**Technique:** Blur filter op ::after pseudo-element
```css
filter: blur(1px);  /* Subtle glow op groene lijnen */
```

**Selective Glow:** Alleen elke 5e lijn (groene accenten) heeft glow - performance optimization (blur is rendering-intensief)

### Mobile Optimalisatie

```css
@media (max-width: 768px) {
  .grid-background::before {
    /* Kleinere grid: 40px vs 60px desktop */
    background-size: 40px 40px;
    opacity: 0.4;  /* Extra dimming */
  }

  .grid-background::after {
    opacity: 0.6;  /* Reduced glow intensity */
  }
}
```

**Rationale:**
- **40px grid** = Minder processing voor mobiele GPU's
- **Opacity 0.4** = Extra subtiel op kleine schermen (minder visuele ruis)
- **Performance** = Kleinere gradients = snellere rendering

### Accessibility: Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .grid-background::before,
  .grid-background::after {
    transform: none;       /* Disable 3D effect */
    opacity: 0.3;          /* Extra dimming voor static grid */
  }

  .grid-background::after {
    filter: none;          /* Disable glow effect */
    opacity: 0.2;
  }
}
```

**WCAG Compliance:** Respecteert vestibular disorder accommodations (3D motion kan duizeligheid veroorzaken)

### Contrast Validation

**Terminal Text Readability:**
- **Zonder grid:** #ccffcc op #000000 = **15.3:1** (WCAG AAA)
- **Met grid:** #ccffcc op grid achtergrond = **~14.5:1** (WCAG AAA maintained)

**Test Method:** Chrome DevTools → Inspect → Contrast ratio in Color Picker

### Design Rationale

**Waarom Perspective Grid?**
1. **Cyberpunk aesthetic** = Industry pattern (Tron, Blade Runner, Cyberpunk 2077 UI's)
2. **Depth perception** = Terminal voelt "3D" vs flat black background
3. **Brand differentiation** = Uniek vs andere terminal simulators
4. **Subtle enhancement** = Lage opacity (0.6) = niet afleidend van core functionality

**Waarom Grijs + Groen Mix?**
1. **Visual hierarchy** = Grijs foundation + groen accent (niet 100% groen = te druk)
2. **Leesbaarheid** = Grijze lijnen interfereren minimaal met terminal text
3. **Consistent branding** = Groen matcht terminal prompt (#00ff88)
4. **Performance** = 80% grijze lijnen = geen glow = minder rendering cost

**Trade-offs:**
- **Bundle size:** +2KB CSS (~0.64% van 500KB budget) - acceptable voor significant visual impact
- **Rendering:** Minimal GPU cost (native gradients), geen merkbare performance impact op 2020+ hardware
- **Complexity:** ~190 regels CSS, maar goed gedocumenteerd en maintainable

### Usage Guidelines

#### ✅ DO:

```css
/* Adjust grid opacity via CSS variable */
:root {
  --grid-opacity: 0.5;  /* Subtler grid */
}

/* Disable on specific pages if needed */
.page-text-heavy .grid-background {
  display: none;  /* Voor long-form reading */
}
```

#### ❌ DON'T:

```css
/* Don't animate the grid */
.grid-background::before {
  animation: rotate 10s infinite;  /* Vestibular disorder trigger! */
}

/* Don't increase opacity too much */
:root {
  --grid-opacity: 0.9;  /* Te prominent, terminal onleesbaar */
}

/* Don't use on light backgrounds */
.light-theme .grid-background {
  /* Grid designed voor pure black only */
}
```

### Future Enhancements (Post-MVP)

**Potential additions:**
- **Scan line effect** - Moving horizontal line (animated, opt-in via settings)
- **Grid fade-out edges** - Vignette effect naar schermranden
- **Dynamic opacity** - User preference slider (0.3 - 0.8)
- **Alternative patterns** - Hexagon grid, circuit board pattern

**Not planned:**
- ❌ Animated grid (accessibility violation)
- ❌ Multiple color themes (grijs+groen is brand identity)
- ❌ Parallax effect (too complex, performance cost)

---

## Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { ... }

/* Small mobile */
@media (max-width: 480px) { ... }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { ... }

/* Landscape mobile */
@media (max-width: 768px) and (orientation: landscape) { ... }
```

### Mobile Adaptations

#### Font Size

```css
@media (max-width: 768px) {
  :root {
    --font-size-base: var(--font-size-mobile);  /* 16px */
  }

  #terminal-input {
    font-size: 18px;  /* Prevent iOS zoom on focus - DO NOT CHANGE */
  }
}
```

**Critical:** iOS zooms bij input fields < 16px. Terminal input blijft 18px.

#### Touch Targets

```css
@media (max-width: 768px) {
  button {
    min-height: 44px;  /* Apple HIG minimum touch target */
    min-width: 44px;
  }
}
```

#### Padding Adjustments

```css
@media (max-width: 768px) {
  #terminal-container {
    padding: 16px;
    padding-top: 40px;  /* Extra ruimte voor status bar */
  }

  #terminal-output {
    padding-bottom: 120px;  /* Extra ruimte voor mobile keyboard */
  }
}
```

### Mobile Quick Commands (Future Feature)

```css
.mobile-quick-commands {
  display: none;
  position: fixed;
  bottom: 60px;
  /* ... */
}

@media (max-width: 768px) {
  .mobile-quick-commands.active {
    display: block;
  }
}
```

**Status:** Voorbereid maar niet actief in MVP

---

## Accessibility Standards

### WCAG AAA Compliance

**Achieved:**
- ✅ Color contrast 15.3:1 (requirement: 7:1)
- ✅ Minimum font size 16px (requirement: 14px)
- ✅ Touch targets 44px (requirement: 44px)
- ✅ Keyboard navigation (tab, enter, escape)
- ✅ Focus indicators visible (2px cyan outline)
- ✅ Reduced motion support

### ARIA Patterns

#### Modal

```html
<div class="modal" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
  <div class="modal-content">
    <h2 id="modal-title">Welkom bij HackSimulator.nl</h2>
    <!-- content -->
  </div>
</div>
```

#### Cookie Banner

```html
<div class="cookie-banner" role="alertdialog" aria-labelledby="cookie-title">
  <p id="cookie-title"><strong>Privacy:</strong> We gebruiken cookies...</p>
</div>
```

#### Terminal

```html
<div id="terminal-output" aria-live="polite" aria-atomic="false">
  <!-- dynamic content -->
</div>

<input id="terminal-input" aria-label="Terminal commando invoer" />
```

### Keyboard Navigation

**Supported:**
- `Tab` - Navigate focusable elements
- `Enter` - Activate buttons/submit
- `Escape` - Close modals
- `↑↓` - Command history (terminal input)

### Screen Reader Considerations

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Gebruik:** Hidden labels voor screen readers

---

## Code Conventions

### CSS Organization

#### File Structure

```
styles/
├── main.css        # Variables, reset, global styles
├── terminal.css    # Terminal-specific styling
├── mobile.css      # Responsive adaptations
└── animations.css  # Keyframes & transitions
```

**Rationale:** Separation of concerns, modulaire updates

#### CSS Variable Naming

```css
/* Pattern: --category-property-modifier */
--color-ui-primary
--color-ui-hover
--spacing-md
--font-terminal
--transition-fast
--z-modal
```

**Convention:**
- Kebab-case (lowercase met hyphens)
- Descriptive names (niet abstract zoals `--color-1`)
- Hierarchy in naming (`primary` → `hover`)

### CSS Rule Order

```css
.component {
  /* 1. Display & Box Model */
  display: flex;
  position: relative;
  width: 100%;
  padding: var(--spacing-md);

  /* 2. Typography */
  font-family: var(--font-terminal);
  font-size: var(--font-size-base);
  color: var(--color-text);

  /* 3. Visual */
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);

  /* 4. Misc */
  transition: all var(--transition-fast);
  cursor: pointer;
}
```

### Class Naming (BEM-inspired)

```css
/* Block */
.modal { ... }

/* Block__Element */
.modal-content { ... }
.modal-close { ... }

/* Block--Modifier */
.modal.active { ... }

/* State classes */
.is-loading { ... }
.is-visible { ... }
```

**Not strict BEM** - Pragmatic approach voor leesbaarheid

### Performance Guidelines

#### Bundle Size Target

```
Total: < 500KB
Current: 312 KB (37.5% buffer)

Breakdown:
- HTML: ~4 KB
- CSS: ~38 KB (4 files)
- JS: ~270 KB (ES6 modules)
```

#### Critical CSS

**Niet geïmplementeerd in MVP** - Zero-build philosophy

Toekomstig: Inline critical CSS in `<head>` voor faster first paint

#### Asset Optimization

```html
<!-- Cache busting via query params -->
<link rel="stylesheet" href="styles/main.css?v=20251027-v13">
```

**Versioning pattern:** `YYYYMMDD-vNN`

---

## Common Patterns

### Command Output (80/20 Rule)

**Principle:** Output is gesimplificeerd maar voelt authentiek

#### ✅ DO:

```bash
$ nmap 192.168.1.1
Scanning for open ports...
PORT    STATE   SERVICE
22/tcp  OPEN    SSH       ← Secure Shell (externe toegang)
80/tcp  OPEN    HTTP      ← Webserver

💡 TIP: Open poorten zijn aanvalsvectoren.
```

**Kenmerken:**
- Engels output (authentiek)
- Inline `←` Nederlandse context (educatief)
- Nederlandse tip (toegankelijk)
- 5-10 regels max (niet 50+ zoals echte nmap)

#### ❌ DON'T:

```bash
$ nmap 192.168.1.1
Poort 22: open
Poort 80: open

Tip: Dit zijn kwetsbare poorten.
```

**Problemen:**
- Nederlandse output (niet authentiek)
- Te simpel (geen context)
- Geen educatieve waarde

### Error Messaging (Educational Feedback)

#### ✅ DO:

```javascript
renderError("Error: Permission denied - /etc/shadow");
renderInfo("🔒 BEVEILIGING: Dit bestand bevat password hashes.");
renderInfo("🎯 Probeer: cat /etc/passwd (wel leesbaar)");
```

**Pattern:** Error + Context + Alternative

#### ❌ DON'T:

```javascript
renderError("Error: Permission denied\n💡 TIP: Try /etc/passwd");
```

**Probleem:** Tip inherits error color (magenta) - niet distinguishable

### Modal Focus Management

**Problem:** Global click listener steelt focus van modals

#### ✅ DO:

```javascript
document.addEventListener('click', (e) => {
  // Check if click is outside ANY active modal
  if (!e.target.closest('.modal.active')) {
    terminalInput.focus();
  }
});
```

**Pattern:** `e.target.closest('.modal.active')` - werkt voor alle modals

#### ❌ DON'T:

```javascript
// Hardcoded modal IDs
if (e.target.id !== 'feedback-modal' && e.target.id !== 'legal-modal') {
  terminalInput.focus();
}
```

**Probleem:** Breekt bij nieuwe modals, niet maintainable

### Icon Color Inheritance Prevention

**Problem:** Emoji icons inherit parent output color

#### ✅ DO:

```css
/* Force icon colors explicitly */
.tip-icon     { color: var(--color-info); }
.warning-icon { color: var(--color-warning); }
```

```javascript
// Render separate calls
renderError("Error: Command failed");
renderInfo("💡 TIP: Check syntax");  // Cyan, niet magenta
```

#### ❌ DON'T:

```javascript
// Combined output
renderError("Error: Command failed\n💡 TIP: Check syntax");
// TIP inherits error color (magenta)
```

---

## Anti-Patterns

### CSS Anti-Patterns

#### ❌ NEVER:

```css
/* 1. Use transparent in dark themes */
background: transparent;  /* Invisible op #000000! */

/* 2. Hardcode colors */
color: #00ff00;  /* Use var(--color-ui-primary) */

/* 3. Use position: fixed on footer */
footer {
  position: fixed;
  bottom: 0;
}
/* Blokkeert terminal input! */

/* 4. Use custom cursors without JS sync */
cursor: url('custom.png'), auto;
/* Buggy, gebruik native cursor */

/* 5. Font size < 16px on mobile */
input {
  font-size: 14px;  /* iOS zoom-on-focus! */
}
```

#### ✅ ALWAYS:

```css
/* Hardcode colors voor debugging (tijdelijk) */
background: #ff0000;  /* TEMP DEBUG - REMOVE BEFORE COMMIT */

/* Native browser features first */
cursor: pointer;  /* Niet custom cursor */

/* Minimum 16px font mobile */
input {
  font-size: 18px;  /* Prevent iOS zoom */
}
```

### JavaScript Anti-Patterns

#### ❌ NEVER:

```javascript
// 1. Assume localStorage valid
const history = localStorage.getItem('history');
history.push('cmd');  // Crash als niet array!

// 2. Use `this` in object literal exports
export const utils = {
  helper() { this._internal(); }  // `this` undefined in imports!
};

// 3. Execute DOM manipulation without readyState check
document.querySelector('#element').classList.add('active');
// Null error als DOM niet ready

// 4. Let flags consume next token
if (args[0] === '-r') {
  recursive = true;
}
// rm -r foo → `-r` consumes `foo` als flag!
```

#### ✅ ALWAYS:

```javascript
// 1. Validate localStorage
const history = localStorage.getItem('history');
const historyArray = Array.isArray(history) ? history : [];

// 2. Standalone functions
export function helper() {
  return internal();
}

// 3. Check DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 4. Single-letter flags = boolean only
const flags = args.filter(a => a.startsWith('-'));
const files = args.filter(a => !a.startsWith('-'));
```

### Documentation Anti-Patterns

#### ❌ NEVER:

```markdown
<!-- Let instruction files grow >250 lines -->
CLAUDE.md: 800 lines  <!-- Onleesbaar! -->

<!-- Remove context without impact analysis -->
"Deleted Sessie 3-7 logs"  <!-- Key learnings lost! -->

<!-- Vague browser support -->
"Works on latest browsers"  <!-- What version?! -->
```

#### ✅ ALWAYS:

```markdown
<!-- Two-tier docs: Compact + detailed logs -->
CLAUDE.md: ~250 lines (compressed learnings)
SESSIONS.md: Full context (not deleted)

<!-- Explicit browser support with rationale -->
Chrome 61+ (ES6 modules)
Firefox 60+ (CSS variables)
Safari 11+ (async/await)

<!-- Rotation strategy at 5+ sessions -->
Key Learnings: Max 9 entries, compress oldest
```

---

## Quick Reference

### Color Palette Cheat Sheet

```css
/* Backgrounds */
#000000  Pure black
#0a0a0a  Modal background
#1a1a1a  Hover state
#2d2d2d  Modal content background

/* Terminal Colors */
#00ff88  Prompt/Input (softer neon)
#ccffcc  Output text (readable mint)
#669966  Dim text (secondary)

/* Semantic */
#ff0055  Error (magenta)
#ffaa00  Warning (orange)
#00ffff  Info (cyan)
#00ff88  Success (green)

/* UI Elements */
#00ff00  Primary button (pure neon)
#33ff33  Hover (brighter neon)
#00ffff  Secondary/links (cyan)
#333333  Borders
#ffffff  Legal text (white)
```

### Spacing Tokens

```
xs: 4px   sm: 8px   md: 16px   lg: 24px   xl: 32px
```

### Z-Index Layers

```css
--z-terminal: 1
--z-footer: 10
--z-feedback: 100
--z-modal: 1000
--z-cookie: 2000
```

### Transition Speeds

```
Fast: 0.15s (hover, focus)
Normal: 0.3s (modals, transitions)
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 27 okt 2025 | Initial style guide creation - Comprehensive documentation van huidige implementatie (312KB bundle, WCAG AAA, dual font system) |

---

## Maintenance

**Update This Guide When:**
- 🎨 Nieuwe CSS variables toegevoegd
- 🧩 Nieuwe componenten gemaakt
- 📱 Breakpoints aangepast
- 🌈 Color palette wijzigingen
- 🔤 Typography updates

**Review Frequency:** Bij elke major release (M6+)

**Owner:** Jan Willem Wubkes (@JanWillemWubkes)

---

**Last Updated:** 22 november 2025
**Status:** Production Ready ✅
**Bundle Size:** ~318 KB / 500 KB (36% buffer)
