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
   * Check if user has given consent for specific category
   * @param {string} category - 'necessary', 'analytics', or 'advertising'
   * @returns {boolean|null} - true if consented, false if declined, null if not decided
   */
  hasConsent(category = 'analytics') {
    try {
      const consentData = localStorage.getItem(STORAGE_KEY_CONSENT);
      if (consentData === null) return null;

      // Handle legacy binary consent (string 'true'/'false')
      if (consentData === 'true' || consentData === 'false') {
        const legacyConsent = consentData === 'true';
        // Migrate to 3-tier system
        const newConsent = {
          necessary: true,
          analytics: legacyConsent,
          advertising: false // Default: no advertising consent for legacy users
        };
        localStorage.setItem(STORAGE_KEY_CONSENT, JSON.stringify(newConsent));
        return category === 'necessary' ? true : (category === 'analytics' ? legacyConsent : false);
      }

      // Parse 3-tier consent JSON
      const consent = JSON.parse(consentData);
      return consent[category] !== undefined ? consent[category] : null;
    } catch (e) {
      console.warn('Could not parse consent data:', e);
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

    // Setup event listeners (3-tier consent)
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    const acceptAnalyticsBtn = document.getElementById('cookie-accept-analytics');
    const declineBtn = document.getElementById('cookie-decline');

    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', () => this.acceptConsent('all'));
    }

    if (acceptAnalyticsBtn) {
      acceptAnalyticsBtn.addEventListener('click', () => this.acceptConsent('analytics'));
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => this.declineConsent());
    }

    // Track banner shown (without analytics since no consent yet)
    console.log('Cookie consent banner shown');
  },

  /**
   * User accepts cookies (3-tier consent)
   * @param {string} type - 'all', 'analytics', or 'necessary'
   */
  acceptConsent(type = 'all') {
    const consent = {
      necessary: true, // Always true
      analytics: type === 'all' || type === 'analytics',
      advertising: type === 'all' // Only if "Alles Accepteren"
    };

    localStorage.setItem(STORAGE_KEY_CONSENT, JSON.stringify(consent));
    this.hideBanner();

    // Initialize analytics if consent given
    if (consent.analytics) {
      analyticsTracker.init('ga4');
      analyticsEvents.legalEvent('cookies_accepted_analytics');
    }

    // Show AdSense if consent given
    if (consent.advertising) {
      this.loadAdSense();
      analyticsEvents.legalEvent('cookies_accepted_advertising');
    }

    console.log('User accepted cookies:', consent);
  },

  /**
   * User declines all optional cookies (only necessary remain)
   */
  declineConsent() {
    const consent = {
      necessary: true, // Always true
      analytics: false,
      advertising: false
    };

    localStorage.setItem(STORAGE_KEY_CONSENT, JSON.stringify(consent));
    this.hideBanner();

    console.log('User declined optional cookies');
  },

  /**
   * Load AdSense container (show + init script)
   * Called when user consents to advertising cookies
   */
  loadAdSense() {
    const container = document.getElementById('adsense-footer');
    if (container) {
      container.style.display = 'block';
      window.hasAdvertisingConsent = true;

      // Load AdSense script dynamically
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-ad-client', 'ca-pub-0000000000000000');
        document.head.appendChild(script);
      }

      console.log('AdSense container loaded');
    } else {
      console.warn('AdSense container not found (#adsense-footer)');
    }
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
