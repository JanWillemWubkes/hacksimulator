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
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'legal-modal-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.id = 'legal-modal';
    modal.style.cssText = `
      background: #1a1a1a;
      border: 2px solid #00ff00;
      border-radius: 8px;
      padding: 30px;
      max-width: 600px;
      width: 100%;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    `;

    modal.innerHTML = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 32px; margin-bottom: 8px;">⚖️</div>
        <h2 style="margin: 0; font-size: 20px; font-weight: bold;">JURIDISCHE KENNISGEVING</h2>
      </div>

      <div style="line-height: 1.6; margin-bottom: 24px; font-size: 14px;">
        <p style="margin-bottom: 16px;">
          Deze simulator is <strong>UITSLUITEND</strong> voor educatieve doeleinden.
          Ongeautoriseerd hacken is <strong>ILLEGAAL</strong> in Nederland (Artikel 138ab Wetboek van Strafrecht).
        </p>

        <p style="margin-bottom: 16px;">
          Alle activiteiten in deze simulator zijn <strong>gesimuleerd</strong> en beïnvloeden geen echte systemen.
        </p>

        <p style="margin-bottom: 16px;">
          <strong>Belangrijke regels:</strong>
        </p>
        <ul style="margin: 0 0 16px 20px; padding: 0;">
          <li style="margin-bottom: 8px;">Vraag <strong>altijd toestemming</strong> voordat je systemen test</li>
          <li style="margin-bottom: 8px;">Gebruik deze kennis <strong>alleen ethisch en legaal</strong></li>
          <li style="margin-bottom: 8px;">Ongeautoriseerde toegang tot systemen is een <strong>misdrijf</strong></li>
        </ul>

        <p style="margin-bottom: 0;">
          Door verder te gaan, ga je akkoord met de
          <a href="assets/legal/terms.html" target="_blank" style="color: #00ff00; text-decoration: underline;">Gebruiksvoorwaarden</a>
          en bevestig je deze kennis alleen voor legale doeleinden te gebruiken.
        </p>
      </div>

      <div style="text-align: center;">
        <button id="legal-accept-btn" style="
          background: #00ff00;
          color: #000000;
          border: none;
          padding: 12px 32px;
          font-size: 16px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
        ">
          Ik begrijp het - Verder
        </button>
      </div>

      <div style="margin-top: 16px; text-align: center; font-size: 12px; opacity: 0.7;">
        <a href="assets/legal/privacy.html" target="_blank" style="color: #00ff00; margin: 0 8px;">Privacy</a>
        <span>•</span>
        <a href="assets/legal/cookies.html" target="_blank" style="color: #00ff00; margin: 0 8px;">Cookies</a>
      </div>
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // Add hover effect to button
    const btn = document.getElementById('legal-accept-btn');
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#00cc00';
      btn.style.transform = 'scale(1.05)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#00ff00';
      btn.style.transform = 'scale(1)';
    });

    // Handle acceptance
    btn.addEventListener('click', () => {
      this.acceptLegal();
      backdrop.remove();
      // Focus back to terminal input after closing modal
      const terminalInput = document.getElementById('terminal-input');
      if (terminalInput) {
        terminalInput.focus();
      }
    });

    // Prevent closing modal by clicking backdrop (must accept)
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        // Shake animation to indicate must accept
        modal.style.animation = 'shake 0.5s';
        setTimeout(() => {
          modal.style.animation = '';
        }, 500);
      }
    });
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

// Add shake animation for modal
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

export default legalManager;
