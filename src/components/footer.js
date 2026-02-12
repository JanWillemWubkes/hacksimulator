/**
 * Footer Component - HackSimulator.nl
 *
 * Twee varianten:
 * - 'marketing': Uitgebreide footer voor landing, over-ons, contact
 * - 'compact': Minimale footer voor terminal en blog pagina's
 *
 * @module components/footer
 */

// ============================================
// FOOTER HTML TEMPLATES
// ============================================

/**
 * Marketing footer - uitgebreid met kolommen
 * Gebruikt op: index.html, over-ons.html, contact.html
 * @param {Object} options - Configuratie opties
 * @param {string} options.basePath - Relatief pad naar root (bijv. './')
 */
function getMarketingFooter(options = {}) {
  const basePath = options.basePath || '/';

  return `
  <footer class="landing-footer">
    <div class="footer-content">
      <div class="footer-brand">
        <a href="${basePath}" class="footer-logo">
          <svg class="brand-icon" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="6" fill="#9fef00"/>
            <path d="M8 22 L16 16 L8 10" stroke="#0d1117" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M18 22 L26 22" stroke="#0d1117" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <span>HackSimulator<span class="brand-accent">.nl</span></span>
        </a>
        <p class="footer-tagline">De enige Nederlandse terminal simulator waar je direct, zonder account, ethisch hacken leert — perfect voor absolute beginners.</p>
      </div>

      <div class="footer-links">
        <div class="footer-column">
          <h3>Platform</h3>
          <ul>
            <li><a href="${basePath}terminal.html">Simulator</a></li>
            <li><a href="${basePath}blog/">Blog</a></li>
            <li><a href="${basePath}commands/">Commands</a></li>
            <li><a href="${basePath}over-ons.html">Over Ons</a></li>
            <li><a href="${basePath}contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>Juridisch</h3>
          <ul>
            <li><a href="${basePath}assets/legal/privacy.html">Privacy Beleid</a></li>
            <li><a href="${basePath}assets/legal/terms.html">Algemene Voorwaarden</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} HackSimulator.nl — Alle rechten voorbehouden</p>
      <div class="footer-social">
        <a href="https://github.com/JanWillemWubkes/hacksimulator" aria-label="GitHub" rel="noopener noreferrer" target="_blank">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>
    </div>
  </footer>`;
}

/**
 * Compact footer - minimaal voor terminal en blog
 * Gebruikt op: terminal.html, blog/*.html
 * @param {Object} options - Configuratie opties
 * @param {string} options.basePath - Relatief pad naar root (bijv. '../')
 * @param {boolean} options.showFeedback - Toon feedback link (alleen terminal)
 * @param {boolean} options.showDonate - Toon donate button
 * @param {boolean} options.showCookieSettings - Toon cookie settings link
 */
function getCompactFooter(options = {}) {
  const basePath = options.basePath || '/';
  const showFeedback = options.showFeedback !== false;
  const showDonate = options.showDonate !== false;
  const showCookieSettings = options.showCookieSettings !== false;

  return `
  <footer role="contentinfo">
    <div class="footer-content">
      <!-- Column 1: Copyright (left) -->
      <p class="footer-copyright">&copy; ${new Date().getFullYear()} HackSimulator.nl</p>

      ${showDonate ? `
      <!-- Column 2: Donation CTA (center) -->
      <p class="donate-compact support-label">
        <a href="https://paypal.me/HackSimulator"
           target="_blank"
           rel="noopener noreferrer"
           class="btn-donate-compact"
           aria-label="Doneer via PayPal om onze educatieve missie te steunen"
           title="Steun onze educatieve missie">
          Doneer
        </a>
      </p>
      ` : ''}

      <!-- Column 3: Navigation (right) -->
      <nav aria-label="Footer navigation">
        ${showFeedback ? '<a href="#feedback" id="footer-feedback-link">Feedback</a>' : ''}
        <a href="${basePath}assets/legal/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
        <a href="${basePath}assets/legal/terms.html" target="_blank" rel="noopener noreferrer">Voorwaarden</a>
        <a href="${basePath}assets/legal/cookies.html" target="_blank" rel="noopener noreferrer">Cookies</a>
        ${showCookieSettings ? '<a href="#" id="cookie-settings">Cookie Instellingen</a>' : ''}
      </nav>
    </div>
  </footer>`;
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

/**
 * Inject footer into placeholder element
 *
 * @param {string} variant - 'marketing' or 'compact'
 * @param {Object} options - Additional options
 * @param {string} options.basePath - Base path for relative URLs
 * @param {boolean} options.showFeedback - Show feedback link (compact only)
 * @param {boolean} options.showDonate - Show donate button (compact only)
 * @param {boolean} options.showCookieSettings - Show cookie settings (compact only)
 *
 * @example
 * // Marketing pages (landing, over-ons, contact)
 * injectFooter('marketing');
 *
 * // Terminal page (with all features)
 * injectFooter('compact', { showFeedback: true, showDonate: true });
 *
 * // Blog page (simplified)
 * injectFooter('compact', {
 *   basePath: '../',
 *   showFeedback: false,
 *   showCookieSettings: false
 * });
 */
export function injectFooter(variant = 'marketing', options = {}) {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) {
    console.warn('[footer.js] No #footer-placeholder element found');
    return;
  }

  // Get appropriate HTML
  let html;
  switch (variant) {
    case 'compact':
      html = getCompactFooter(options);
      break;
    case 'marketing':
    default:
      html = getMarketingFooter(options);
  }

  // Inject HTML
  placeholder.outerHTML = html;
}
