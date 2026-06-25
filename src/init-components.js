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
 * - /blog/* -> 'marketing' navbar (unified nav; currentPage='blog' for active-state)
 * - / or /index.html, /over-ons.html, /contact.html, /woordenlijst.html -> 'marketing' navbar
 */

// ?v= cache-bust: Netlify edge serveerde een stale navbar.js (oud logo) bij
// normale module-imports ondanks nieuwe origin-versie (cache-status: fwd=stale).
// Versie-query forceert een nieuwe cache-key -> gegarandeerd verse logo-code.
// Bump dit nummer bij elke logo/markup-wijziging in navbar.js of footer.js.
import { injectNavbar } from '/src/components/navbar.js?v=2';
import { injectFooter } from '/src/components/footer.js?v=3';
import '/src/ui/cta-tracking.js';
import '/src/ui/newsletter-tracking.js';
import '/src/ui/brevo-submit.js';

/**
 * Detect page type from current URL
 * @returns {{ variant: string, options: Object, footerVariant: string, footerOptions: Object }}
 */
function detectPageType() {
  const path = window.location.pathname;

  // Terminal page (supports both /terminal.html and /terminal for Netlify Pretty URLs)
  if (path.includes('terminal.html') || path.endsWith('/terminal') || path === '/terminal') {
    return {
      variant: 'app',
      options: {},
      footerVariant: 'marketing',
      footerOptions: { showFeedback: true, showDonate: true, showCookieSettings: true }
    };
  }

  // Blog pages: unified marketing nav with currentPage='blog' for active-state
  if (path.includes('/blog/')) {
    return {
      variant: 'marketing',
      options: { currentPage: 'blog' },
      footerVariant: 'marketing',
      footerOptions: {
        basePath: '../',
        showFeedback: false,
        showDonate: true,
        showCookieSettings: true
      }
    };
  }

  // Commands page (uses marketing layout with basePath adjustment)
  if (path.includes('/commands/') || path.endsWith('/commands')) {
    return {
      variant: 'marketing',
      options: {},
      footerVariant: 'marketing',
      footerOptions: { showDonate: true }
    };
  }

  // Marketing pages (landing, over-ons, contact, woordenlijst)
  const isLanding = path === '/' || path === '/index.html' || path.endsWith('/index');
  return {
    variant: 'marketing',
    options: { isLanding },
    footerVariant: 'marketing',
    footerOptions: { showDonate: true }
  };
}

// Initialize components
const config = detectPageType();
injectNavbar(config.variant, config.options);
injectFooter(config.footerVariant, config.footerOptions);
