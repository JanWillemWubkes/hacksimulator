/**
 * Affiliate Link Manager
 * Handles click tracking and disclosure banners for affiliate links
 *
 * Features:
 * - Conditional loading (blog pages only)
 * - Privacy-first tracking (no URLs, only program + product)
 * - Automatic event handler attachment
 * - Static disclosure banner generator
 */

import tracker from '../analytics/events.js';
import AFFILIATE_CONFIG from '../config/affiliate-config.js';

class AffiliateLinks {
  constructor() {
    this.initialized = false;
    this.linkCount = 0;
  }

  /**
   * Initialize affiliate tracking (ONLY on blog pages)
   * Conditional loading pattern - skips on main terminal page
   */
  init() {
    // Only run on blog pages (performance optimization)
    if (!window.location.pathname.includes('/blog/')) {
      console.log('[AffiliateLinks] Skipping init - not a blog page');
      return;
    }

    // Prevent double initialization
    if (this.initialized) {
      console.warn('[AffiliateLinks] Already initialized');
      return;
    }

    // Attach click handlers to all affiliate links
    this.attachClickHandlers();

    this.initialized = true;
    console.log(`[AffiliateLinks] Initialized on blog page - tracking ${this.linkCount} links`);
  }

  /**
   * Attach click handlers to all affiliate links on the page
   * Uses event delegation for performance
   */
  attachClickHandlers() {
    const links = document.querySelectorAll('a.affiliate-link');
    this.linkCount = links.length;

    if (this.linkCount === 0) {
      console.warn('[AffiliateLinks] No affiliate links found on this page');
      return;
    }

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleAffiliateClick(e.target);
      });
    });

    console.log(`[AffiliateLinks] Attached handlers to ${this.linkCount} links`);
  }

  /**
   * Handle affiliate link click
   * Tracks: program name + product category (NOT URLs - privacy!)
   *
   * @param {HTMLElement} linkElement - The clicked <a> element
   */
  handleAffiliateClick(linkElement) {
    // Extract data attributes
    const program = linkElement.dataset.program;
    const product = linkElement.dataset.product || 'unknown';

    // Validation
    if (!program) {
      console.warn('[AffiliateLinks] Click on link without data-program attribute', linkElement);
      return;
    }

    if (!AFFILIATE_CONFIG.isValidProgram(program)) {
      console.warn(`[AffiliateLinks] Unknown affiliate program: ${program}`);
      return;
    }

    // Track the click (privacy-first: no URLs!)
    tracker.affiliateClick(program, product);

    console.log(`[AffiliateLinks] Tracked click: ${program}/${product}`);
  }

  /**
   * Create disclosure banner HTML (for blog post tops)
   * Static method - can be called without instance
   *
   * @returns {string} HTML string for disclosure banner
   */
  static createDisclosureBanner() {
    return `
      <div class="affiliate-banner">
        <p>
          ${AFFILIATE_CONFIG.disclosure.banner}
          <a href="../assets/legal/affiliate-disclosure.html" target="_blank" rel="noopener noreferrer">
            ${AFFILIATE_CONFIG.disclosure.linkText}
          </a>
        </p>
      </div>
    `;
  }

  /**
   * Create affiliate link HTML with proper attributes
   * Helper method for programmatic link creation
   *
   * @param {object} options - Link options
   * @param {string} options.program - Program ID (e.g., 'bol', 'udemy')
   * @param {string} options.product - Product ID (e.g., 'hacker-playbook-3')
   * @param {string} options.url - Full affiliate URL
   * @param {string} options.text - Link text to display
   * @param {string} [options.cssClass='btn-small'] - Additional CSS class
   * @returns {string} HTML string for affiliate link
   */
  static createAffiliateLink({ program, product, url, text, cssClass = 'btn-small' }) {
    // Validate program exists
    if (!AFFILIATE_CONFIG.isValidProgram(program)) {
      console.error(`[AffiliateLinks] Invalid program: ${program}`);
      return '';
    }

    const programInfo = AFFILIATE_CONFIG.getProgram(program);

    return `
      <a href="${url}"
         target="_blank"
         rel="sponsored noopener noreferrer"
         class="affiliate-link ${cssClass}"
         data-program="${program}"
         data-product="${product}"
         aria-label="${text} - ${programInfo.name} affiliate link">
        ${text}
        <span class="affiliate-badge">${AFFILIATE_CONFIG.disclosure.badge}</span>
      </a>
    `;
  }

  /**
   * Get statistics about affiliate links on current page
   * Useful for debugging and analytics
   *
   * @returns {object} Statistics object
   */
  getStats() {
    const links = document.querySelectorAll('a.affiliate-link');
    const programCounts = {};

    links.forEach(link => {
      const program = link.dataset.program || 'unknown';
      programCounts[program] = (programCounts[program] || 0) + 1;
    });

    return {
      totalLinks: links.length,
      programCounts,
      initialized: this.initialized,
      isBlogPage: window.location.pathname.includes('/blog/')
    };
  }

  /**
   * Validate all affiliate links on page
   * Checks for required attributes and GDPR compliance
   *
   * @returns {object} Validation results
   */
  validateLinks() {
    const links = document.querySelectorAll('a.affiliate-link');
    const issues = [];

    links.forEach((link, index) => {
      // Check required attributes
      if (!link.dataset.program) {
        issues.push(`Link ${index + 1}: Missing data-program attribute`);
      }

      if (!link.dataset.product) {
        issues.push(`Link ${index + 1}: Missing data-product attribute`);
      }

      // Check GDPR compliance
      const rel = link.getAttribute('rel');
      if (!rel || !rel.includes('sponsored')) {
        issues.push(`Link ${index + 1}: Missing rel="sponsored" (GDPR requirement)`);
      }

      // Check external link security
      if (!link.getAttribute('target') === '_blank') {
        issues.push(`Link ${index + 1}: Should have target="_blank"`);
      }

      if (!rel || !rel.includes('noopener')) {
        issues.push(`Link ${index + 1}: Missing rel="noopener" (security)`);
      }
    });

    return {
      valid: issues.length === 0,
      totalLinks: links.length,
      issues: issues
    };
  }
}

// Export singleton instance
const affiliateLinks = new AffiliateLinks();
export default affiliateLinks;
