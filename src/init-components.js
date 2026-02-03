/**
 * Component Initialization - HackSimulator.nl
 *
 * External script for navbar/footer injection.
 * Moved from inline scripts to comply with CSP (no 'unsafe-inline').
 *
 * Usage: <script src="/src/init-components.js" type="module"></script>
 *
 * Auto-detects page type based on URL:
 * - /terminal.html -> 'app' navbar
 * - /blog/* -> 'blog' navbar
 * - / or /index.html, /over-ons.html, /contact.html -> 'marketing' navbar
 */

import { injectNavbar } from '/src/components/navbar.js';
import { injectFooter } from '/src/components/footer.js';

/**
 * Detect page type from current URL
 * @returns {{ variant: string, options: Object, footerVariant: string, footerOptions: Object }}
 */
function detectPageType() {
  const path = window.location.pathname;

  // Terminal page
  if (path.includes('terminal.html')) {
    return {
      variant: 'app',
      options: {},
      footerVariant: 'compact',
      footerOptions: { showFeedback: true, showDonate: true, showCookieSettings: true }
    };
  }

  // Blog pages
  if (path.includes('/blog/')) {
    // Blog index vs blog post
    const isIndex = path.endsWith('/blog/') || path.endsWith('/blog/index.html');
    return {
      variant: 'blog',
      options: {
        basePath: '../',
        backTo: isIndex ? 'blog' : 'simulator'
      },
      footerVariant: 'compact',
      footerOptions: {
        basePath: '../',
        showFeedback: true,
        showDonate: true,
        showCookieSettings: true
      }
    };
  }

  // Marketing pages (landing, over-ons, contact)
  return {
    variant: 'marketing',
    options: {},
    footerVariant: 'marketing',
    footerOptions: {}
  };
}

// Initialize components
const config = detectPageType();
injectNavbar(config.variant, config.options);
injectFooter(config.footerVariant, config.footerOptions);
