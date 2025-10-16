// Cookie Consent Manager - AVG/GDPR Compliant
// Singleton pattern for consistent consent state

import analyticsTracker from './tracker.js';
import analyticsEvents from './events.js';

const STORAGE_KEY_CONSENT = 'hacksim_analytics_consent';
const STORAGE_KEY_CONSENT_SHOWN = 'hacksim_consent_banner_shown';

const consentManager = {
  hasShownBanner: false,

  /**
   * Check if consent banner should be shown
   */
  shouldShowBanner() {
    // Don't show if already responded
    if (this.hasConsent() !== null) {
      return false;
    }

    // Don't show if already shown this session
    if (this.hasShownBanner) {
      return false;
    }

    // Don't show if shown in previous session (avoid annoyance)
    try {
      const bannerShown = localStorage.getItem(STORAGE_KEY_CONSENT_SHOWN);
      if (bannerShown) {
        // If shown before but no consent decision, show again after 24h
        const shownDate = new Date(bannerShown);
        const now = new Date();
        const hoursSinceShown = (now - shownDate) / (1000 * 60 * 60);

        if (hoursSinceShown < 24) {
          return false; // Don't show again within 24h
        }
      }
    } catch (e) {
      console.warn('Could not check consent banner history');
    }

    return true;
  },

  /**
   * Check if user has given consent (true), declined (false), or not decided (null)
   */
  hasConsent() {
    try {
      const consent = localStorage.getItem(STORAGE_KEY_CONSENT);
      if (consent === null) return null;
      return consent === 'true';
    } catch (e) {
      return null;
    }
  },

  /**
   * Show cookie consent banner
   */
  showBanner() {
    if (!this.shouldShowBanner()) {
      console.log('Cookie consent banner not shown (already responded or shown recently)');
      return;
    }

    this.hasShownBanner = true;

    // Mark banner as shown
    try {
      localStorage.setItem(STORAGE_KEY_CONSENT_SHOWN, new Date().toISOString());
    } catch (e) {
      console.warn('Could not save banner shown state');
    }

    // Get banner element
    const banner = document.getElementById('cookie-consent');
    if (!banner) {
      console.error('Cookie consent banner element not found');
      return;
    }

    // Show banner
    banner.classList.add('active');
    banner.setAttribute('aria-hidden', 'false');

    // Setup event listeners
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.acceptConsent());
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => this.declineConsent());
    }

    // Track banner shown (without analytics since no consent yet)
    console.log('Cookie consent banner shown');
  },

  /**
   * User accepts cookies
   */
  acceptConsent() {
    analyticsTracker.saveConsent(true);
    this.hideBanner();

    // Initialize analytics now
    analyticsTracker.init('ga4');

    // Track acceptance
    analyticsEvents.legalEvent('cookies_accepted');

    console.log('User accepted analytics cookies');
  },

  /**
   * User declines cookies
   */
  declineConsent() {
    analyticsTracker.saveConsent(false);
    this.hideBanner();

    console.log('User declined analytics cookies');
  },

  /**
   * Hide consent banner
   */
  hideBanner() {
    const banner = document.getElementById('cookie-consent');
    if (banner) {
      banner.classList.remove('active');
      banner.setAttribute('aria-hidden', 'true');
    }
  },

  /**
   * Check and show banner on page load
   */
  checkAndShowBanner() {
    // Small delay to let page settle
    setTimeout(() => {
      this.showBanner();
    }, 2000); // Show after 2 seconds
  },

  /**
   * Allow user to change consent later (from settings/footer)
   */
  showConsentSettings() {
    // Force show banner even if already responded
    this.hasShownBanner = false;

    const banner = document.getElementById('cookie-consent');
    if (banner) {
      banner.classList.add('active');
      banner.setAttribute('aria-hidden', 'false');
    }
  }
};

export default consentManager;
