/**
 * Analytics Initialization - HackSimulator.nl
 *
 * External script for GA4 tracking and consent management.
 * Moved from inline script to comply with CSP (no 'unsafe-inline').
 *
 * Usage: <script src="/src/init-analytics.js" type="module"></script>
 */

import consentManager from './analytics/consent.js';
import tracker from './analytics/tracker.js';
import events from './analytics/events.js';

// Only initialize GA4 if user has already given analytics consent
if (consentManager.hasConsent('analytics') === true) {
  tracker.init('ga4');
}

// Show consent banner if needed
consentManager.checkAndShowBanner();

// Restore AdSense if advertising consent was previously given (blog pages with ad slots)
if (consentManager.hasConsent('advertising') === true) {
  consentManager.loadAdSense();
}

// Only track visit/session if analytics consent was given
if (consentManager.hasConsent('analytics') === true) {
  events.incrementVisitCount();
  events.sessionStart();
}
