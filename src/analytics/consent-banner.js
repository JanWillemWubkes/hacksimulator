/**
 * Cookie Consent Banner Module (M5.5 GDPR Compliance)
 *
 * Exports createConsentBanner() function that returns cookie consent banner HTML.
 * Used by both index.html and blog pages for dynamic injection.
 *
 * @returns {string} HTML string for cookie consent banner
 */

export function createConsentBanner() {
  return `
    <div id="cookie-consent" class="cookie-banner" role="alertdialog" aria-labelledby="cookie-title" aria-hidden="true">
        <div class="cookie-content">
            <p id="cookie-title">
                <strong>[!] Privacy:</strong> Cookies voor analytics · <a href="/assets/legal/cookies.html" target="_blank" rel="noopener noreferrer">Meer info</a>
            </p>
            <!-- Beide knoppen dragen exact dezelfde klassen, en dat is de hele bedoeling.
                 Tot Sessie 236 was "Accepteren" een gevulde azuren knop en "Weigeren" een
                 transparante met een dimgrijze rand, die daardoor als uitgeschakeld las.
                 Ongelijk visueel gewicht op een toestemmingskeuze is een consent dark
                 pattern, en dit is de eerste interactie van elke nieuwe bezoeker.
                 PRODUCT.md: "Een ontwerp dat beter converteert door de bezoeker te
                 manipuleren is een mislukking, geen verbetering." -->
            <div class="cookie-buttons">
                <button id="cookie-accept-analytics" class="btn-small btn-secondary">Accepteren</button>
                <button id="cookie-decline" class="btn-small btn-secondary">Weigeren</button>
            </div>
        </div>
    </div>
  `;
}

export default { createConsentBanner };
