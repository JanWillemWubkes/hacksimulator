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

// Initialize GA4 tracker
tracker.init('ga4');

// Show consent banner if needed
consentManager.checkAndShowBanner();

// Track page view & session
events.incrementVisitCount();
events.sessionStart();
