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
                <strong>[ ! ] Privacy:</strong> Cookies voor analytics & ads · <a href="/assets/legal/cookies.html" target="_blank" rel="noopener noreferrer">Meer info</a>
            </p>
            <div class="cookie-buttons">
                <button id="cookie-accept-all" class="btn-small">Alles Accepteren</button>
                <button id="cookie-accept-analytics" class="btn-small">Alleen Analytics</button>
                <button id="cookie-decline" class="btn-small btn-secondary">Weigeren</button>
            </div>
        </div>
    </div>
  `;
}

export default { createConsentBanner };
