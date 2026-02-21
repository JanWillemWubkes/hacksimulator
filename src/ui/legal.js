/**
 * Legal Modal Manager
 *
 * Manages the legal disclaimer modal that appears on first visit.
 * Users must accept terms before using the simulator.
 *
 * @module legal
 */
import FocusTrap from './focus-trap.js';

const STORAGE_KEY = 'hacksim_legal_accepted';

const LegalManager = {
  /**
   * Check if user has already accepted legal terms
   * @returns {boolean}
   */
  hasAcceptedLegal() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      console.warn('localStorage not available for legal tracking');
      return false;
    }
  },

  /**
   * Mark legal terms as accepted
   */
  acceptLegal() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem('hacksim_legal_accepted_date', new Date().toISOString());
    } catch (e) {
      console.warn('Could not save legal acceptance to localStorage');
    }
  },

  /**
   * Show the legal disclaimer modal
   */
  showLegalModal() {
    const modal = document.createElement('div');
    modal.id = 'legal-modal';
    modal.className = 'modal active';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'legal-title');
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="modal-content legal-modal-content">
        <!-- Header with warning icon -->
        <div class="legal-modal-header">
          <div class="legal-warning-icon">[!]</div>
          <h2 id="legal-title">Juridische Kennisgeving</h2>
        </div>

        <!-- Scrollable body content -->
        <div class="modal-body">
          <p>Deze simulator is <strong>UITSLUITEND</strong> voor educatieve doeleinden.
          Ongeautoriseerd hacken is <strong>ILLEGAAL</strong> in Nederland (Artikel 138ab Wetboek van Strafrecht).</p>

          <p>Alle activiteiten in deze simulator zijn <strong>gesimuleerd</strong> en beïnvloeden geen echte systemen.</p>

          <p><strong>Belangrijke regels:</strong></p>
          <ul>
            <li>Vraag <strong>altijd toestemming</strong> voordat je systemen test</li>
            <li>Gebruik deze kennis <strong>alleen ethisch en legaal</strong></li>
            <li>Ongeautoriseerde toegang tot systemen is een <strong>misdrijf</strong></li>
          </ul>

          <p>Door verder te gaan, ga je akkoord met de
          <a href="assets/legal/terms.html" target="_blank" rel="noopener noreferrer">Gebruiksvoorwaarden</a>
          en bevestig je deze kennis alleen voor legale doeleinden te gebruiken.</p>

          <!-- Warning message (shown when user tries to close without accepting) -->
          <div id="legal-warning-text" class="legal-warning-text" style="display: none;">
            [!] Je moet akkoord gaan met de voorwaarden om verder te gaan.
          </div>
        </div>

        <!-- Footer with button and legal links -->
        <div class="modal-footer">
          <button id="legal-accept-btn" class="btn-primary">Ik begrijp het - Verder</button>
          <div class="legal-footer-links">
            <a href="assets/legal/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
            <span>•</span>
            <a href="assets/legal/cookies.html" target="_blank" rel="noopener noreferrer">Cookies</a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Activate focus trap for accessibility
    FocusTrap.activate(modal, {
      initialFocus: '#legal-accept-btn',
      onClose: () => {
        // Show warning when trying to close without accepting
        this._showWarning();
      }
    });

    // Handle accept button click
    const acceptBtn = document.getElementById('legal-accept-btn');
    acceptBtn.addEventListener('click', () => {
      this.acceptLegal();
      FocusTrap.deactivate();
      modal.remove();

      // Focus terminal input after accepting
      const terminalInput = document.getElementById('terminal-input');
      if (terminalInput) {
        terminalInput.focus();
      }
    });

    // Handle click outside modal (show warning)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this._showWarning();
      }
    });
  },

  /**
   * Show warning message when user tries to dismiss without accepting
   * @private
   */
  _showWarning() {
    const warningText = document.getElementById('legal-warning-text');
    if (warningText) {
      warningText.style.display = 'block';
      setTimeout(() => {
        warningText.style.display = 'none';
      }, 3000);
    }
  },

  /**
   * Check if legal has been accepted, show modal if not
   */
  checkAndShowModal() {
    if (!this.hasAcceptedLegal()) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        this.showLegalModal();
      }, 500);
    }
  }
};

export default LegalManager;
