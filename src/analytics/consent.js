/**
 * Cookie Consent Manager (M5.5 GDPR Compliance)
 *
 * Manages user consent for analytics and advertising cookies.
 * Implements 3-tier consent: Necessary (always), Analytics (optional), Advertising (optional).
 *
 * Key Features:
 * - Dynamic banner injection (works on index.html + blog pages)
 * - localStorage persistence across pages
 * - 24-hour banner cooldown (no consent spam)
 * - GDPR-compliant: No tracking before explicit consent
 */

import tracker from './tracker.js';
import events from './events.js';
import { createConsentBanner } from './consent-banner.js';

const CONSENT_KEY = 'hacksim_analytics_consent';
const BANNER_SHOWN_KEY = 'hacksim_consent_banner_shown';

const consentManager = {
  hasShownBanner: false,

  /**
   * Check if banner should be shown
   * - Don't show if user already responded (consent stored)
   * - Don't show if shown in last 24 hours (cooldown)
   *
   * @returns {boolean} True if banner should be shown
   */
  shouldShowBanner() {
    // Don't show if user already gave/declined consent
    if (this.hasConsent() !== null) return false;

    // Don't show if already shown this session
    if (this.hasShownBanner) return false;

    // Check if shown in last 24 hours (localStorage timestamp)
    try {
      const lastShown = localStorage.getItem(BANNER_SHOWN_KEY);
      if (lastShown) {
        const lastShownDate = new Date(lastShown);
        const hoursSinceShown = (new Date() - lastShownDate) / (1000 * 60 * 60);
        if (hoursSinceShown < 24) return false; // 24-hour cooldown
      }
    } catch (e) {
      console.warn('Could not check consent banner history');
    }

    return true;
  },

  /**
   * Check if user has given consent for a specific category
   *
   * @param {string} category - 'necessary', 'analytics', or 'advertising'
   * @returns {boolean|null} True if consented, false if declined, null if no response yet
   */
  hasConsent(category = 'analytics') {
    try {
      const consentData = localStorage.getItem(CONSENT_KEY);

      // No consent data stored yet
      if (consentData === null) return null;

      // Legacy format migration: "true"/"false" string → JSON object
      if (consentData === 'true' || consentData === 'false') {
        const analytics = consentData === 'true';
        const migratedConsent = {
          necessary: true,
          analytics: analytics,
          advertising: false,
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(migratedConsent));
        return category === 'necessary' || (category === 'analytics' && analytics);
      }

      // Parse JSON consent object
      const consent = JSON.parse(consentData);
      return consent[category] !== undefined ? consent[category] : null;
    } catch (e) {
      console.warn('Could not parse consent data:', e);
      return null;
    }
  },

  /**
   * Show cookie consent banner
   * - Injects banner HTML dynamically if not already in DOM (blog pages)
   * - Attaches event listeners to buttons
   * - Marks banner as shown (24-hour cooldown)
   */
  showBanner() {
    // Don't show if conditions not met
    if (!this.shouldShowBanner()) {
      console.log('Cookie consent banner not shown (already responded or shown recently)');
      return;
    }

    // Mark as shown (24-hour cooldown)
    this.hasShownBanner = true;
    try {
      localStorage.setItem(BANNER_SHOWN_KEY, new Date().toISOString());
    } catch (e) {
      console.warn('Could not save banner shown state');
    }

    // Check if banner already exists in DOM
    let banner = document.getElementById('cookie-consent');

    // If banner doesn't exist, inject it dynamically (blog pages)
    if (!banner) {
      console.log('Cookie banner not found in DOM, injecting dynamically...');
      document.body.insertAdjacentHTML('beforeend', createConsentBanner());
      banner = document.getElementById('cookie-consent');
    }

    // Verify banner injection succeeded
    if (!banner) {
      console.error('Cookie consent banner element not found after injection');
      return;
    }

    // Show banner (remove aria-hidden, add active class)
    banner.classList.add('active');
    banner.setAttribute('aria-hidden', 'false');

    // Attach event listeners to buttons
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

    console.log('Cookie consent banner shown');
  },

  /**
   * User accepted cookies (all or analytics-only)
   *
   * @param {string} level - 'all' or 'analytics'
   */
  acceptConsent(level = 'all') {
    const consent = {
      necessary: true,
      analytics: level === 'all' || level === 'analytics',
      advertising: level === 'all',
    };

    // Save consent to localStorage
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

    // Hide banner
    this.hideBanner();

    // Initialize analytics if consented
    if (consent.analytics) {
      tracker.init('ga4');
      events.legalEvent('cookies_accepted_analytics');
    }

    // Load AdSense if advertising consented
    if (consent.advertising) {
      this.loadAdSense();
      events.legalEvent('cookies_accepted_advertising');
    }

    console.log('User accepted cookies:', consent);
  },

  /**
   * User declined optional cookies
   */
  declineConsent() {
    const consent = {
      necessary: true,
      analytics: false,
      advertising: false,
    };

    // Save decline to localStorage
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

    // Hide banner
    this.hideBanner();

    console.log('User declined optional cookies');
  },

  /**
   * Load Google AdSense scripts (only after advertising consent)
   */
  loadAdSense() {
    const adsenseContainer = document.getElementById('adsense-footer');

    if (adsenseContainer) {
      // Show AdSense container
      adsenseContainer.style.display = 'block';
      window.hasAdvertisingConsent = true;

      // Load AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-ad-client', 'ca-pub-6345664385525701');
        document.head.appendChild(script);

        script.onload = () => {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        };
      }

      console.log('AdSense container loaded');
    } else {
      console.warn('AdSense container not found (#adsense-footer)');
    }
  },

  /**
   * Hide cookie consent banner
   */
  hideBanner() {
    const banner = document.getElementById('cookie-consent');
    if (banner) {
      banner.classList.remove('active');
      banner.setAttribute('aria-hidden', 'true');
    }
  },

  /**
   * Show banner with 2-second delay (called by main.js on page load)
   */
  checkAndShowBanner() {
    setTimeout(() => {
      this.showBanner();
    }, 2000); // 2-second delay for better UX
  },

  /**
   * Show consent settings modal (called by "Cookie Instellingen" footer link)
   */
  showConsentSettings() {
    // Reset shown flag to bypass shouldShowBanner() check
    this.hasShownBanner = false;

    // Show banner for settings change
    let banner = document.getElementById('cookie-consent');

    // Inject banner if not in DOM (blog pages)
    if (!banner) {
      document.body.insertAdjacentHTML('beforeend', createConsentBanner());
      banner = document.getElementById('cookie-consent');

      // Re-attach event listeners (banner was just created)
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
    }

    if (banner) {
      banner.classList.add('active');
      banner.setAttribute('aria-hidden', 'false');
    }
  },
};

// Initialize "Cookie Instellingen" footer link listener
document.addEventListener('DOMContentLoaded', () => {
  const settingsLink = document.getElementById('cookie-settings');
  if (settingsLink) {
    settingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      consentManager.showConsentSettings();
    });
  }

  // AUTO-INITIALIZATION for blog pages (standalone usage without main.js)
  // Blog pages don't load main.js, so consent.js must initialize itself
  // Check if we're NOT on index.html (which calls checkAndShowBanner via main.js)
  if (!window.HackSimulator) {
    // HackSimulator object only exists on index.html (set by main.js)
    // This means we're on a blog page → auto-initialize consent banner
    console.log('[consent.js] Auto-initializing for blog page (no main.js detected)');

    // Restore analytics/advertising if user already consented (consent persistence)
    if (consentManager.hasConsent('analytics') === true) {
      console.log('[consent.js] Analytics consent found in storage, initializing tracker...');
      tracker.init('ga4');
    }

    if (consentManager.hasConsent('advertising') === true) {
      console.log('[consent.js] Advertising consent found in storage, loading AdSense...');
      consentManager.loadAdSense();
    }

    // Show consent banner (only if user hasn't responded yet - shouldShowBanner checks this)
    consentManager.checkAndShowBanner();
  }
});

export default consentManager;
