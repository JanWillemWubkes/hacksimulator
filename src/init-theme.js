/**
 * Theme Initialization - HackSimulator.nl
 *
 * External script to prevent theme flash on page load.
 * Must be loaded synchronously (no defer/async) for immediate execution.
 *
 * Moved from inline script to comply with CSP (no 'unsafe-inline').
 *
 * Standaard per pagina (Sessie 238): zonder opgeslagen keuze geldt wat de pagina zelf
 * op <html data-theme-default="..."> zet, en anders donker. De landingspagina is
 * ontworpen als licht papier; de simulator als terminal. Een expliciete keuze via de
 * schakelaar staat in localStorage en wint op elke pagina, zoals voorheen.
 */

(function() {
  const root = document.documentElement;
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {
    /* privémodus of geblokkeerde opslag: dan geldt de paginastandaard */
  }
  const standaard = root.getAttribute('data-theme-default') === 'light' ? 'light' : 'dark';
  const thema = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : standaard;
  root.setAttribute('data-theme', thema);
})();
