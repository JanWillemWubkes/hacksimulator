/**
 * Niet-render-blokkerende load van animations.css
 *
 * Vervangt het inline onload-attribuut (`onload="this.media='all'"`) dat de
 * enige reden was voor 'unsafe-hashes' in de CSP. De stylesheet wordt met
 * media="print" geladen (niet render-blokkerend) en pas op `load` op media
 * "all" gezet zodat de animaties van toepassing worden.
 *
 * Plaats dit script direct ná de bijbehorende <link id="animations-css">.
 */
(function () {
  var link = document.getElementById('animations-css');
  if (!link) return;

  // Al geladen (sheet beschikbaar) → meteen toepassen; anders op load wachten.
  if (link.sheet) {
    link.media = 'all';
  } else {
    link.addEventListener('load', function () { link.media = 'all'; });
  }
})();
