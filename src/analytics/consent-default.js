/**
 * Google Consent Mode v2 — defaults
 *
 * Geëxternaliseerd uit een inline <script> om te voldoen aan de CSP
 * (geen 'unsafe-inline' in script-src), volgens hetzelfde patroon als
 * src/init-theme.js.
 *
 * BELANGRIJK:
 * - Dit bestand MOET als klassiek (niet-defer/async) script in de <head>
 *   staan, vóór elke Google-tag. Het zet de consent-defaults op 'denied'
 *   zodat GA4 niets opslaat tot de gebruiker toestemming geeft.
 * - `gtag` en `dataLayer` worden bewust op top-level (globaal) gedeclareerd:
 *   src/analytics/consent.js en src/init-analytics.js roepen `gtag` aan als
 *   kale identifier (`typeof gtag === 'function'`). Niet in een IIFE wikkelen,
 *   anders vuurt de consent-'update' bij toestemming nooit.
 */

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'wait_for_update': 500
});
