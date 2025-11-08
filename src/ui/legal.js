// Legal Manager - Disclaimer modal & legal compliance
// Singleton pattern for consistent legal state management

const STORAGE_KEY_LEGAL = 'hacksim_legal_accepted';

const legalManager = {
  hasAcceptedLegal() {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY_LEGAL);
      return accepted === 'true';
    } catch (e) {
      console.warn('localStorage not available for legal tracking');
      return false; // Default to showing modal if localStorage fails
    }
  },

  acceptLegal() {
    try {
      localStorage.setItem(STORAGE_KEY_LEGAL, 'true');
      localStorage.setItem('hacksim_legal_accepted_date', new Date().toISOString());
    } catch (e) {
      console.warn('Could not save legal acceptance to localStorage');
    }
  },

  showLegalModal() {
    // Create modal using standard 3-layer architecture (Sessie 37)
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
          <div class="legal-warning-icon">[ ! ]</div>
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
          <a href="assets/legal/terms.html" target="_blank">Gebruiksvoorwaarden</a>
          en bevestig je deze kennis alleen voor legale doeleinden te gebruiken.</p>

          <!-- Warning message (shown when user tries to close without accepting) -->
          <div id="legal-warning-text" class="legal-warning-text" style="display: none;">
            [ ! ] Je moet akkoord gaan met de voorwaarden om verder te gaan.
          </div>
        </div>

        <!-- Footer with button and legal links -->
        <div class="modal-footer">
          <button id="legal-accept-btn" class="btn-primary">Ik begrijp het - Verder</button>
          <div class="legal-footer-links">
            <a href="assets/legal/privacy.html" target="_blank">Privacy</a>
            <span>•</span>
            <a href="assets/legal/cookies.html" target="_blank">Cookies</a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event handlers
    const btn = document.getElementById('legal-accept-btn');
    btn.addEventListener('click', () => {
      this.acceptLegal();
      modal.remove();

      // Focus back to terminal input
      const terminalInput = document.getElementById('terminal-input');
      if (terminalInput) {
        terminalInput.focus();
      }
    });

    // Backdrop click - show warning text instead of shake (accessibility)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        const warning = document.getElementById('legal-warning-text');
        if (warning) {
          warning.style.display = 'block';
          setTimeout(() => warning.style.display = 'none', 3000);
        }
      }
    });

    // ESC key disabled for legal modal (must accept)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        e.preventDefault();
        const warning = document.getElementById('legal-warning-text');
        if (warning) {
          warning.style.display = 'block';
          setTimeout(() => warning.style.display = 'none', 3000);
        }
      }
    }, { once: true });
  },

  checkAndShowModal() {
    // Check if user has already accepted legal terms
    if (!this.hasAcceptedLegal()) {
      // Small delay to let page load first
      setTimeout(() => {
        this.showLegalModal();
      }, 500);
    }
  }
};

export default legalManager;
