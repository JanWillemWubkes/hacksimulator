/**
 * help - Display available commands
 */

import registry from '../../core/registry.js';
import { lightBoxText } from '../../utils/asciiBox.js';

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

const BOX_WIDTH = 48; // Total width including borders (mobile: 40 char + 8 overflow for readability)
const COMMAND_COL_WIDTH = 15; // Width for command name column

// ─────────────────────────────────────────────────
// Helper Functions - Box Drawing
// ─────────────────────────────────────────────────

/**
 * Creates top border with category title and count
 * Example: ╭─────────────── SYSTEM (7) ────────────────╮
 */
function createCategoryHeader(categoryName, count) {
  const title = ` ${categoryName.toUpperCase()} (${count}) `;
  const totalPadding = BOX_WIDTH - 2 - title.length; // -2 for corner chars
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  return BOX.topLeft +
    BOX.horizontal.repeat(leftPadding) +
    title +
    BOX.horizontal.repeat(rightPadding) +
    BOX.topRight;
}

/**
 * Creates column headers row
 * Example: │ COMMAND         DESCRIPTION               │
 */
function createColumnHeaders() {
  const command = 'COMMAND'.padEnd(COMMAND_COL_WIDTH);
  const description = 'DESCRIPTION';
  const content = ` ${command} ${description}`;
  const padding = BOX_WIDTH - 2 - content.length;

  return BOX.vertical + content + ' '.repeat(padding) + BOX.vertical;
}

/**
 * Creates divider line between header and content
 * Example: ├───────────────────────────────────────────┤
 */
function createDivider() {
  const innerWidth = BOX_WIDTH - 2; // -2 for side borders
  return BOX.dividerLeft + BOX.horizontal.repeat(innerWidth) + BOX.dividerRight;
}

/**
 * Creates bottom border
 * Example: ╰───────────────────────────────────────────╯
 */
function createCategoryFooter() {
  const innerWidth = BOX_WIDTH - 2;
  return BOX.bottomLeft + BOX.horizontal.repeat(innerWidth) + BOX.bottomRight;
}

// ─────────────────────────────────────────────────
// Helper Functions - Content Formatting
// ─────────────────────────────────────────────────

/**
 * Smart truncation at word boundaries
 * Prevents cutting words mid-character (e.g., "brute fo..." → "brute...")
 *
 * @param {string} text - Text to truncate
 * @param {number} maxWidth - Maximum width including "..."
 * @returns {string} Truncated text with "..." or original if fits
 */
function smartTruncate(text, maxWidth) {
  if (text.length <= maxWidth) {
    return text;
  }

  // Reserve 3 chars for "..."
  const truncatePoint = maxWidth - 3;
  let truncated = text.substring(0, truncatePoint);

  // Find last complete word (last space before truncate point)
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    // Truncate at word boundary
    return truncated.substring(0, lastSpace) + '...';
  }

  // Fallback: single word longer than available width
  return truncated + '...';
}

/**
 * Formats a single command row
 * Example: │ clear           Clear terminal screen     │
 */
function formatCommandRow(cmd) {
  const commandName = cmd.name.padEnd(COMMAND_COL_WIDTH);
  const contentWidth = BOX_WIDTH - 2; // -2 for side borders
  const descriptionMaxWidth = contentWidth - COMMAND_COL_WIDTH - 2; // -2 for spacing

  // Apply smart truncation to description only
  const description = smartTruncate(cmd.description, descriptionMaxWidth);
  const content = ` ${commandName} ${description}`;

  return BOX.vertical + content.padEnd(contentWidth) + BOX.vertical;
}

/**
 * Formats complete category section with box
 * Phase 2 ready: can add category description between header and column headers
 */
function formatCategorySection(category, commands, registry) {
  const count = commands.length;
  let output = '';

  // Top border with category name and count
  output += createCategoryHeader(category, count) + '\n';

  // Column headers
  output += createColumnHeaders() + '\n';

  // Divider
  output += createDivider() + '\n';

  // PHASE 2 PLACEHOLDER: Add formatCategoryDescription() here
  // output += formatCategoryDescription(category) + '\n';

  // Command rows
  commands.forEach(cmd => {
    output += formatCommandRow(cmd) + '\n';
  });

  // Bottom border
  output += createCategoryFooter();

  return output;
}

// ─────────────────────────────────────────────────
// Main Command Implementation
// ─────────────────────────────────────────────────

export default {
  name: 'help',
  description: 'Toon beschikbare commands',
  category: 'system',
  usage: 'help [category]',

  /**
   * Autocomplete provider for help command arguments
   * Returns available category names for tab-completion
   */
  completionProvider(args) {
    return registry.getCategories();
  },

  execute(args, flags, context) {
    const registry = context.terminal.getRegistry();

    // If category specified, show commands in that category
    if (args.length > 0) {
      const category = args[0].toLowerCase();
      const commands = registry.getByCategory(category);

      if (commands.length === 0) {
        return `Geen commands gevonden in categorie '${category}'.\n\n[ ? ] TIP: Type 'help' voor alle categorieën.`;
      }

      let output = `Commands in categorie '${category}':\n\n`;
      output += formatCategorySection(category, commands, registry);

      return output;
    }

    // Show all commands grouped by category
    const categories = registry.getCategories();
    let output = 'Beschikbare commands:\n\n';
    output += '[ ! ] Real hackers beginnen met SYSTEM & FILESYSTEM basics, dan NETWORK scanning, en uiteindelijk SECURITY tools.\n\n';

    categories.forEach(category => {
      const commands = registry.getByCategory(category);

      if (commands.length > 0) {
        output += formatCategorySection(category, commands, registry) + '\n\n';
      }
    });

    // Consolidated tip box (light rounded borders for friendly educational tone)
    const tipContent = `• man <command> → Gedetailleerde uitleg van een tool
• ↑↓ keys → Navigeer door command geschiedenis
• Tab → Autocomplete (bijv. "nm" + Tab → "nmap")
• shortcuts → Toon alle keyboard shortcuts`;

    const tipBox = lightBoxText(tipContent, 'TIP: NAVIGATIE & SHORTCUTS', 60);
    output += tipBox;

    return output;
  },

  manPage: `
NAAM
    help - toon beschikbare commands

SYNOPSIS
    help [CATEGORY]

BESCHRIJVING
    Toont een overzicht van alle beschikbare commands, gegroepeerd per
    categorie. Optioneel kun je een specifieke categorie opvragen.

ARGUMENTEN
    CATEGORY (optioneel)
        Categorienaam: system, filesystem, network, security, special

VOORBEELDEN
    help
        Toon alle commands

    help filesystem
        Toon alleen filesystem commands

CATEGORIEËN
    • system       → Basis terminal commands
    • filesystem   → Bestanden en directories
    • network      → Netwerk analyse tools
    • security     → Security testing tools
    • special      → Speciale commands (reset)

GERELATEERDE COMMANDO'S
    man <command> (gedetailleerde help voor specifiek command)
`.trim()
};
