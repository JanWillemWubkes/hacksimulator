/**
 * Theme Initialization - HackSimulator.nl
 *
 * External script to prevent theme flash on page load.
 * Must be loaded synchronously (no defer/async) for immediate execution.
 *
 * Moved from inline script to comply with CSP (no 'unsafe-inline').
 */

(function() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = !savedTheme || savedTheme === 'dark';
  document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
})();
