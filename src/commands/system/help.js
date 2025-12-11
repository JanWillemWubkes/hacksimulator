/**
 * help - Display available commands
 */

import registry from '../../core/registry.js';
import { lightBoxText } from '../../utils/asciiBox.js';
import { BOX_CHARS, getResponsiveBoxWidth, smartTruncate, isMobileView } from '../../utils/box-utils.js';

// ─────────────────────────────────────────────────
// Box Drawing Configuration
// ─────────────────────────────────────────────────
const BOX = BOX_CHARS; // Responsive box characters (shared utility)
const COMMAND_COL_WIDTH = 15; // Width for command name column

// Note: BOX_WIDTH is calculated dynamically in execute() to ensure DOM is ready

// ─────────────────────────────────────────────────
// Helper Functions - Box Drawing
// ─────────────────────────────────────────────────

/**
 * Creates top border with category title and count
 * Example: ╭─────────────── SYSTEM (7) ────────────────╮
 */
function createCategoryHeader(categoryName, count) {
  const BOX_WIDTH = getResponsiveBoxWidth(); // Calculate width when needed (DOM ready)
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
  const BOX_WIDTH = getResponsiveBoxWidth(); // Calculate width when needed (DOM ready)
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
  const BOX_WIDTH = getResponsiveBoxWidth(); // Calculate width when needed (DOM ready)
  const innerWidth = BOX_WIDTH - 2; // -2 for side borders
  return BOX.dividerLeft + BOX.horizontal.repeat(innerWidth) + BOX.dividerRight;
}

/**
 * Creates bottom border
 * Example: ╰───────────────────────────────────────────╯
 */
function createCategoryFooter() {
  const BOX_WIDTH = getResponsiveBoxWidth(); // Calculate width when needed (DOM ready)
  const innerWidth = BOX_WIDTH - 2;
  return BOX.bottomLeft + BOX.horizontal.repeat(innerWidth) + BOX.bottomRight;
}

// ─────────────────────────────────────────────────
// Helper Functions - Content Formatting
// ─────────────────────────────────────────────────

/**
 * Formats a single command row
 * Example: │ clear           Clear terminal screen     │
 */
function formatCommandRow(cmd) {
  const BOX_WIDTH = getResponsiveBoxWidth(); // Calculate width when needed (DOM ready)
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
// Mobile Rendering (Minimalist - Terminal Zen)
// ─────────────────────────────────────────────────

/**
 * Formats help output for mobile (typography-based, no borders)
 * Terminal-authentic: like `man`, `ls`, `git` - content over decoration
 */
function formatHelpMobile(categories) {
  let output = '\n**HELP**\n\n';

  Object.entries(categories).forEach(([category, commands]) => {
    if (commands.length > 0) {
      output += `**${category.toUpperCase()}** (${commands.length})\n`;
      commands.forEach(cmd => {
        output += `  ${cmd.name} - ${cmd.description}\n`;
      });
      output += '\n';
    }
  });

  output += '[ ? ] Type "man <command>" for details\n';
  output += '[ ! ] Real hackers: start with SYSTEM & FILESYSTEM basics\n';

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

    // Mobile: simplified rendering (no box-drawing)
    if (isMobileView()) {
      // If category specified (mobile: simple list)
      if (args.length > 0) {
        const category = args[0].toLowerCase();
        const commands = registry.getByCategory(category);

        if (commands.length === 0) {
          return `Geen commands in '${category}'.\n\n[ ? ] Type 'help' voor alle categorieën.`;
        }

        let output = `\n**${category.toUpperCase()}** (${commands.length})\n\n`;
        commands.forEach(cmd => {
          output += `  ${cmd.name} - ${cmd.description}\n`;
        });

        return output;
      }

      // Show all commands (mobile format)
      const categories = registry.getCategories();
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat] = registry.getByCategory(cat);
      });

      return formatHelpMobile(categoryMap);
    }

    // Desktop: existing box-drawing rendering
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
