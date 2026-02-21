// Analytics Tracker - Abstraction layer for analytics providers
// Supports GA4 (MVP) with future migration path to Plausible

const STORAGE_KEY_CONSENT = 'hacksim_analytics_consent';

const analyticsTracker = {
  initialized: false,
  consentGiven: false,
  provider: null, // 'ga4' or 'plausible' or null

  /**
   * Initialize analytics based on user consent
   */
  init(provider = 'ga4') {
    this.provider = provider;
    this.consentGiven = this.checkConsent();

    if (this.consentGiven) {
      this.initializeProvider();
    }

    this.initialized = true;
  },

  /**
   * Check if user has given consent
   */
  checkConsent() {
    try {
      const consent = localStorage.getItem(STORAGE_KEY_CONSENT);
      if (consent === 'true') return true;
      // Support JSON format: {analytics: true}
      try {
        const parsed = JSON.parse(consent);
        return parsed && parsed.analytics === true;
      } catch (parseError) {
        return false;
      }
    } catch (e) {
      console.warn('localStorage not available for consent tracking');
      return false;
    }
  },

  /**
   * Save consent preference
   */
  saveConsent(consent) {
    this.consentGiven = consent;

    try {
      localStorage.setItem(STORAGE_KEY_CONSENT, consent.toString());
      localStorage.setItem('hacksim_consent_date', new Date().toISOString());
    } catch (e) {
      console.warn('Could not save consent to localStorage');
    }

    if (consent && !this.initialized) {
      this.initializeProvider();
    } else if (!consent && this.initialized) {
      this.disableTracking();
    }
  },

  /**
   * Initialize the selected analytics provider
   */
  initializeProvider() {
    if (this.provider === 'ga4') {
      this.initGA4();
    } else if (this.provider === 'plausible') {
      this.initPlausible();
    }
  },

  /**
   * Initialize Google Analytics 4
   */
  initGA4() {
    // GA4 Measurement ID (placeholder - to be replaced with real ID)
    const GA_MEASUREMENT_ID = 'G-7F792VS6CE';

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true, // IP anonymization (AVG/GDPR compliance)
      cookie_flags: 'SameSite=None;Secure',
      send_page_view: true
    });

  },

  /**
   * Initialize Plausible Analytics (future migration)
   */
  initPlausible() {
    // Plausible is cookieless - no consent needed technically
    // But we still respect user choice
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = 'hacksimulator.nl'; // TODO: Replace with actual domain
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);

  },

  /**
   * Disable all tracking
   */
  disableTracking() {
    if (this.provider === 'ga4' && window.gtag) {
      // Disable GA4
      window['ga-disable-G-7F792VS6CE'] = true;
    }
  },

  /**
   * Track an event
   * @param {string} eventName - Name of the event
   * @param {object} params - Event parameters (NEVER include PII or command arguments!)
   */
  trackEvent(eventName, params = {}) {
    if (!this.consentGiven) {
      return;
    }

    // Privacy check: NEVER log command arguments (PRD §6.6)
    if (params.command_args || params.args || params.input) {
      console.warn('PRIVACY VIOLATION: Attempted to log command arguments!');
      delete params.command_args;
      delete params.args;
      delete params.input;
    }

    if (this.provider === 'ga4' && window.gtag) {
      window.gtag('event', eventName, params);
    } else if (this.provider === 'plausible' && window.plausible) {
      window.plausible(eventName, { props: params });
    }
  },

  /**
   * Track page view (single-page app)
   */
  trackPageView(pageName) {
    if (!this.consentGiven) return;

    if (this.provider === 'ga4' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href
      });
    } else if (this.provider === 'plausible' && window.plausible) {
      window.plausible('pageview');
    }
  }
};

export default analyticsTracker;
