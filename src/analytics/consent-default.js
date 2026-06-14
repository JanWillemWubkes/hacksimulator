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
 *   zodat GA4/AdSense niets opslaan tot de gebruiker toestemming geeft.
 * - `gtag` en `dataLayer` worden bewust op top-level (globaal) gedeclareerd:
 *   src/analytics/consent.js en src/init-analytics.js roepen `gtag` aan als
 *   kale identifier (`typeof gtag === 'function'`). Niet in een IIFE wikkelen,
 *   anders vuurt de consent-'update' bij toestemming nooit.
 */

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});

/**
 * Op pagina's mét AdSense: laad de AdSense-library PAS NA het zetten van de
 * consent-defaults, zodat AdSense gegarandeerd de 'denied'-state ziet. Dit
 * voorkomt de race die ontstaat als een aparte `<script async>` AdSense-tag
 * sneller laadt dan dit (geëxternaliseerde) consent-script.
 *
 * De ad-pagina's geven hun publisher-id mee via data-adsense op de scripttag.
 * Een aparte IIFE houdt `self`/`pub` lokaal en raakt de globale gtag niet.
 */
(function loadAdSenseAfterConsentDefaults() {
  var self = document.currentScript;
  var pub = self && self.dataset ? self.dataset.adsense : null;
  if (!pub) return;

  var script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(pub);
  document.head.appendChild(script);
})();
