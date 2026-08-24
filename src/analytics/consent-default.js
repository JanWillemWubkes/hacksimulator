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

// Consent Mode v2 vraagt om alle zes de signalen, niet alleen analytics_storage.
// Zonder expliciete default vallen ad_user_data en ad_personalization terug op
// Google's impliciete waarde - een stille aanname op precies de twee signalen die
// v2 verplicht stelt. Ze staan hier allemaal op 'denied' omdat dat feitelijk klopt:
// er draaien geen advertenties (AdSense is in Sessie 208 verwijderd) en er is geen
// personalisatie. Alleen analytics_storage kan later door toestemming op 'granted'.
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'wait_for_update': 500
});
