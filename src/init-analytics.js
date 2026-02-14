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

// Only track visit/session if analytics consent was given
if (consentManager.hasConsent('analytics') === true) {
  events.incrementVisitCount();
  events.sessionStart();
}
