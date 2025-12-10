/**
 * Box Utilities - Responsive ASCII Box System
 * Centralized box drawing logic for commands with adaptive width based on viewport
 * Prevents mobile layout breakage on small screens (iPhone SE 375px → 32 chars safe)
 */

// ─────────────────────────────────────────────────
// Shared Box Drawing Characters
// ─────────────────────────────────────────────────

/**
 * Box drawing characters (light rounded style)
 * Used by: help.js, shortcuts.js, leerpad.js
 * Consistency: All commands use identical characters
 */
export const BOX_CHARS = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  dividerLeft: '├',
  dividerRight: '┤'
};

// ─────────────────────────────────────────────────
// Responsive Breakpoints
// ─────────────────────────────────────────────────

/**
 * Viewport width breakpoints (in pixels)
 * Based on mobile.css responsive design system
 */
const BREAKPOINTS = {
  SMALL_MOBILE: 480,   // iPhone SE, small Android phones
  MOBILE: 768,         // Standard mobile devices
  TABLET: 1024         // Tablet and small desktop
};

/**
 * Box width per breakpoint (in characters)
 * Conservative values tested on real devices
 */
const BOX_WIDTHS = {
  SMALL_MOBILE: 32,    // iPhone SE safe (375px / 16px font ≈ 37 chars - 5 margin)
  MOBILE: 40,          // Standard mobile safe (480px viewport)
  TABLET: 48,          // Current "mobile-friendly" standard (768px)
  DESKTOP: 56          // Current leerpad desktop width (1024px+)
};

// ─────────────────────────────────────────────────
// Responsive Box Width Function
// ─────────────────────────────────────────────────

/**
 * Get responsive box width based on terminal container width
 * Uses DOM measurement for accurate detection
 *
 * Algorithm:
 * 1. Measure actual terminal container width (accounts for padding/scrollbars)
 * 2. Calculate usable characters based on font size
 * 3. Map to appropriate breakpoint
 * 4. Return conservative width (90% safety margin)
 *
 * Performance: ~0.1ms overhead per command execution (one getComputedStyle call)
 *
 * @returns {number} Box width in characters (32-56)
 */
export function getResponsiveBoxWidth() {
  // Fallback for SSR/testing environments
  if (typeof window === 'undefined' || !document.getElementById('terminal-container')) {
    return BOX_WIDTHS.TABLET; // Conservative fallback (48 chars)
  }

  const terminalContainer = document.getElementById('terminal-container');
  const containerWidth = terminalContainer.offsetWidth;

  // Calculate usable chars (account for padding/margins)
  // Formula: containerWidth / (fontSize * charWidthRatio) * safetyMargin
  // Approximate: 16px font = 9-10px per char on mobile, 10-11px on desktop
  const fontSize = parseInt(getComputedStyle(terminalContainer).fontSize) || 16;
  const charsPerPixel = 1 / (fontSize * 0.6); // ~0.6 pixels per char (monospace font)
  const maxChars = Math.floor(containerWidth * charsPerPixel * 0.9); // 90% width for safety

  // Map to breakpoints with fallback to maxChars
  if (containerWidth <= BREAKPOINTS.SMALL_MOBILE || maxChars < 37) {
    return Math.min(BOX_WIDTHS.SMALL_MOBILE, maxChars - 5); // Extra margin for safety
  } else if (containerWidth <= BREAKPOINTS.MOBILE || maxChars < 48) {
    return Math.min(BOX_WIDTHS.MOBILE, maxChars - 5);
  } else if (containerWidth <= BREAKPOINTS.TABLET || maxChars < 56) {
    return Math.min(BOX_WIDTHS.TABLET, maxChars - 5);
  } else {
    return BOX_WIDTHS.DESKTOP;
  }
}

// ─────────────────────────────────────────────────
// Mobile Detection Function (Sessie 82)
// ─────────────────────────────────────────────────

/**
 * Check if current viewport is mobile (simplified UI mode)
 * Used by commands to render simplified lists on mobile vs ASCII boxes on desktop
 *
 * Detection strategy:
 * 1. Check window.innerWidth < 768px (mobile breakpoint from mobile.css)
 * 2. Double-check with CSS visibility of navbar-toggle (media query alignment)
 * 3. Return true if either condition matches
 *
 * Rationale:
 * - Terminal ASCII art is historically desktop-first (80x24 VT100 terminals)
 * - Mobile users consume content read-only (typing commands on mobile impractical)
 * - Simplified UI prevents alignment issues from variable-width fonts
 *
 * @returns {boolean} True if mobile viewport (<768px), false otherwise
 */
export function isMobileView() {
  // Fallback for SSR/testing environments
  if (typeof window === 'undefined') return false;

  // Check viewport width (primary signal)
  const isMobile = window.innerWidth < BREAKPOINTS.MOBILE; // 768px

  // Check if mobile menu toggle is visible (CSS-based detection for consistency)
  const toggle = document.querySelector('.navbar-toggle');
  const isMobileByCSS = toggle && getComputedStyle(toggle).display !== 'none';

  // Return true if either signal indicates mobile
  return isMobile || isMobileByCSS;
}

// ─────────────────────────────────────────────────
// Smart Truncation Function
// ─────────────────────────────────────────────────

/**
 * Smart truncation at word boundaries
 * Extracted from help.js (lines 89-108) and centralized for reuse
 *
 * Prevents cutting words mid-character:
 * - BAD:  "brute fo..." (cuts "force" in half)
 * - GOOD: "brute..." (cuts at word boundary)
 *
 * Algorithm:
 * 1. If text fits, return as-is
 * 2. Find last complete word before maxWidth - 3 (reserve for "...")
 * 3. Truncate at word boundary
 * 4. Fallback: single long word → hard truncate
 *
 * @param {string} text - Text to truncate
 * @param {number} maxWidth - Maximum width including "..."
 * @returns {string} Truncated text with "..." or original if fits
 *
 * @example
 * smartTruncate("Crack wachtwoorden", 15)
 * // Returns: "Crack..."
 *
 * smartTruncate("SQL injection scanner", 18)
 * // Returns: "SQL injection..."
 */
export function smartTruncate(text, maxWidth) {
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
  // Example: "Superlongcommandname" with maxWidth=10 → "Superlo..."
  return truncated + '...';
}
