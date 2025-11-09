/**
 * shortcuts - Display keyboard shortcuts
 */

// ─────────────────────────────────────────────────
// Box Drawing Configuration
// ─────────────────────────────────────────────────
const BOX = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  dividerLeft: '├',
  dividerRight: '┤'
};

const BOX_WIDTH = 48; // Total width including borders (mobile-friendly)
const KEYS_COL_WIDTH = 16; // Width for keyboard keys column

// ─────────────────────────────────────────────────
// Shortcuts Data
// ─────────────────────────────────────────────────
const SHORTCUTS = [
  {
    category: 'NAVIGATION',
    items: [
      { keys: '↑ / ↓', description: 'Blader door geschiedenis' },
      { keys: 'Tab', description: 'Vul command aan' }
    ]
  },
  {
    category: 'ZOEKEN',
    items: [
      { keys: 'Ctrl+R', description: 'Start geschiedenis zoeken' },
      { keys: 'Ctrl+R (repeat)', description: 'Volgende match' },
      { keys: 'Enter', description: 'Accepteer command' },
      { keys: 'Esc / Ctrl+C', description: 'Annuleer zoeken' }
    ]
  },
  {
    category: 'TERMINAL',
    items: [
      { keys: 'Ctrl+L', description: 'Maak scherm leeg' },
      { keys: 'Ctrl+C', description: 'Annuleer input' },
      { keys: 'Enter', description: 'Voer command uit' }
    ]
  }
];

// ─────────────────────────────────────────────────
// Helper Functions - Box Drawing
// ─────────────────────────────────────────────────

/**
 * Creates top border with title
 * Example: ╭───────── KEYBOARD SHORTCUTS ──────────╮
 */
function createHeader(title) {
  const titleText = ` ${title} `;
  const totalPadding = BOX_WIDTH - 2 - titleText.length; // -2 for corner chars
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  return BOX.topLeft +
    BOX.horizontal.repeat(leftPadding) +
    titleText +
    BOX.horizontal.repeat(rightPadding) +
    BOX.topRight;
}

/**
 * Creates category section header
 * Example: │  NAVIGATION                              │
 */
function createCategoryHeader(categoryName) {
  const content = `  ${categoryName}`;
  const padding = BOX_WIDTH - 2 - content.length;
  return BOX.vertical + content + ' '.repeat(padding) + BOX.vertical;
}

/**
 * Creates shortcut row
 * Example: │  ↑ / ↓           Blader door geschiedenis │
 */
function createShortcutRow(keys, description) {
  const keysText = keys.padEnd(KEYS_COL_WIDTH);
  const content = `  ${keysText} ${description}`;
  const padding = BOX_WIDTH - 2 - content.length;
  return BOX.vertical + content + ' '.repeat(Math.max(0, padding)) + BOX.vertical;
}

/**
 * Creates empty row for spacing
 * Example: │                                          │
 */
function createEmptyRow() {
  const innerWidth = BOX_WIDTH - 2;
  return BOX.vertical + ' '.repeat(innerWidth) + BOX.vertical;
}

/**
 * Creates bottom border
 * Example: ╰──────────────────────────────────────────╯
 */
function createFooter() {
  const innerWidth = BOX_WIDTH - 2;
  return BOX.bottomLeft + BOX.horizontal.repeat(innerWidth) + BOX.bottomRight;
}

// ─────────────────────────────────────────────────
// Command Implementation
// ─────────────────────────────────────────────────

export default {
  name: 'shortcuts',
  description: 'Toon keyboard shortcuts',
  category: 'system',
  execute() {
    const lines = [];

    // Header
    lines.push(createHeader('KEYBOARD SHORTCUTS'));
    lines.push(createEmptyRow());

    // Each category
    SHORTCUTS.forEach((category, categoryIndex) => {
      // Category name
      lines.push(createCategoryHeader(category.category));

      // Shortcuts in this category
      category.items.forEach(item => {
        lines.push(createShortcutRow(item.keys, item.description));
      });

      // Add spacing between categories (except last)
      if (categoryIndex < SHORTCUTS.length - 1) {
        lines.push(createEmptyRow());
      }
    });

    // Footer
    lines.push(createEmptyRow());
    lines.push(createFooter());

    // Educational tip
    lines.push('');
    lines.push('[ ? ] TIP: Deze shortcuts werken net als in echte Linux terminals!');

    return lines.join('\n');
  },
  manPage: `
NAAM
    shortcuts - toon keyboard shortcuts

SYNOPSIS
    shortcuts

BESCHRIJVING
    Toont een overzicht van alle beschikbare keyboard shortcuts.
    Deze shortcuts zijn geïnspireerd op echte Linux/Bash terminals.

    NAVIGATION
        ↑ / ↓        Blader door command geschiedenis
        Tab          Vul command aan (autocomplete)

    ZOEKEN
        Ctrl+R       Start geschiedenis zoeken (reverse-i-search)
                     Net als in Bash - type deel van command
                     en druk Ctrl+R opnieuw om door matches te cyclen
        Enter        Accepteer geselecteerde command
        Esc/Ctrl+C   Annuleer zoekmode

    TERMINAL
        Ctrl+L       Maak scherm leeg (clear screen)
                     Standaard terminal shortcut - maakt output leeg
                     zonder je geschiedenis te verwijderen
        Ctrl+C       Annuleer huidige input
        Enter        Voer command uit

VOORBEELDEN
    shortcuts
        Toon alle shortcuts

    Type Ctrl+R en begin te typen om door je command geschiedenis
    te zoeken. Druk Ctrl+R opnieuw om door matches te cyclen.

GERELATEERDE COMMANDO'S
    help (alle commands), history (command geschiedenis)
`.trim()
};
