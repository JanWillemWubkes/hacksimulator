/**
 * Brevo (Sendinblue) newsletter-form configuratie
 *
 * Geëxternaliseerd uit een inline <script> om te voldoen aan de CSP
 * (geen 'unsafe-inline' in script-src). Zet de globale instellingen die
 * Brevo's main.js (https://sibforms.com/.../main.js, defer) bij laden uitleest.
 *
 * Moet vóór die main.js draaien. Als klassiek script geladen op de plek van
 * het oude inline-blok gebeurt dat vanzelf (klassiek script tijdens parse,
 * vóór de defer-script main.js). Gebruikt op pagina's met een Brevo-formulier
 * (index.html, blog/index.html, sample-pentest.html, sample-juridisch.html).
 *
 * LET OP: dit dekt alleen de client-side validatiestrings van Brevo's main.js.
 * De tekst die de bezoeker ná verzenden leest komt uit twee bronnen, en
 * brevo-submit.js:39-42 / :55-58 laten Brevo's `json.message` de hardcoded
 * paneltekst in de HTML overschrijven.
 *
 * Gemeten (Sessie 212, live endpoint + echte inschrijving):
 *   - gelukte inzending, geldig adres -> message = de "Success message" die
 *     onder Contacts > Forms > <form> > Messages staat. Die WINT van de HTML;
 *     de paneltekst in de pagina is dan niet wat de bezoeker leest.
 *   - leeg EMAIL / ongeldig formaat / gevulde honeypot -> {"success":true}
 *     zonder message; dan blijft de HTML-tekst staan.
 *   - kapotte payload -> message is een onvertaalde interne string.
 *
 * Gevolg: zet de bevestigingscopy die ertoe doet in Brevo's Messages-stap, en
 * houd de HTML-tekst als vangnet voor de message-loze paden.
 */

window.REQUIRED_CODE_ERROR_MESSAGE = 'Selecteer een landcode';
window.LOCALE = 'nl';
window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "Het e-mailadres lijkt niet te kloppen. Controleer het en probeer opnieuw.";
window.REQUIRED_ERROR_MESSAGE = "Vul je e-mailadres in.";
window.GENERIC_INVALID_MESSAGE = "Het e-mailadres lijkt niet te kloppen. Controleer het en probeer opnieuw.";
window.translation = {
  common: {
    selectedList: '{quantity} list selected',
    selectedLists: '{quantity} lists selected'
  }
};
var AUTOHIDE = Boolean(0);

// Voorkom dat Brevo's main.js auto-scrollt bij validatiefouten.
// Brevo roept window.scrollTo({top, behavior:'smooth'}) aan na forminteractie.
(function () {
  var origScrollTo = window.scrollTo.bind(window);
  var blocking = false;
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.sib-form')) {
      blocking = true;
      setTimeout(function () { blocking = false; }, 500);
    }
  }, true);
  window.scrollTo = function () {
    if (blocking) return;
    return origScrollTo.apply(window, arguments);
  };
})();
