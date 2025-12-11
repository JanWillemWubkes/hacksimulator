/**
 * shortcuts - Display keyboard shortcuts
 */

import { BOX_CHARS, getResponsiveBoxWidth, isMobileView } from '../../utils/box-utils.js';

// ─────────────────────────────────────────────────
// Box Drawing Configuration
// ─────────────────────────────────────────────────
const BOX = BOX_CHARS; // Responsive box characters (shared utility)
const KEYS_COL_WIDTH = 16; // Width for keyboard keys column

// Note: BOX_WIDTH is calculated dynamically in each function to ensure DOM is ready

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
  const BOX_WIDTH = getResponsiveBoxWidth(); // Calculate width when needed (DOM ready)
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
  const BOX_WIDTH = getResponsiveBoxWidth(); // Calculate width when needed (DOM ready)
  const content = `  ${categoryName}`;
  const padding = BOX_WIDTH - 2 - content.length;
  return BOX.vertical + content + ' '.repeat(padding) + BOX.vertical;
}

/**
 * Creates shortcut row
 * Example: │  ↑ / ↓           Blader door geschiedenis │
 */
function createShortcutRow(keys, description) {
  const BOX_WIDTH = getResponsiveBoxWidth(); // Calculate width when needed (DOM ready)
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
  const BOX_WIDTH = getResponsiveBoxWidth(); // Calculate width when needed (DOM ready)
  const innerWidth = BOX_WIDTH - 2;
  return BOX.vertical + ' '.repeat(innerWidth) + BOX.vertical;
}

/**
 * Creates bottom border
 * Example: ╰──────────────────────────────────────────╯
 */
function createFooter() {
  const BOX_WIDTH = getResponsiveBoxWidth(); // Calculate width when needed (DOM ready)
  const innerWidth = BOX_WIDTH - 2;
  return BOX.bottomLeft + BOX.horizontal.repeat(innerWidth) + BOX.bottomRight;
}

// ─────────────────────────────────────────────────
// Mobile Rendering (Minimalist - Terminal Zen)
// ─────────────────────────────────────────────────

/**
 * Formats shortcuts output for mobile (typography-based, no borders)
 * Clean list format: category → items
 */
function formatShortcutsMobile() {
  let output = '\n**KEYBOARD SHORTCUTS**\n\n';

  SHORTCUTS.forEach(category => {
    output += `**${category.category}**\n`;
    category.items.forEach(item => {
      output += `  ${item.keys} - ${item.description}\n`;
    });
    output += '\n';
  });

  output += '[ ? ] These shortcuts work like real Linux terminals\n';
  output += '[ ! ] Mobile: Use Tab for autocomplete\n';

  return output;
}

// ─────────────────────────────────────────────────
// Command Implementation
// ─────────────────────────────────────────────────

export default {
  name: 'shortcuts',
  description: 'Toon keyboard shortcuts',
  category: 'system',
  execute() {
    // Mobile: simplified rendering (no box-drawing)
    if (isMobileView()) {
      return formatShortcutsMobile();
    }

    // Desktop: existing box-drawing rendering
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
