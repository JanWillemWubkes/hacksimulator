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
      background: #000000;
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
      background: #2d2d2d;
      border: none;
      border-radius: 8px;
      padding: 40px;
      max-width: 600px;
      width: 100%;
      color: #cccccc;
      font-family: 'Courier New', monospace;
      box-shadow: none;
    `;

    modal.innerHTML = `
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="font-size: 40px; margin-bottom: 12px;">⚖️</div>
        <h2 style="margin: 0; font-size: 32px; font-weight: bold; color: #00ff00; text-transform: uppercase; letter-spacing: 1px;">Juridische Kennisgeving</h2>
      </div>

      <div style="line-height: 1.7; margin-bottom: 32px; font-size: 17px; color: #cccccc;">
        <p style="margin-bottom: 18px;">
          Deze simulator is <strong style="color: #00ff00;">UITSLUITEND</strong> voor educatieve doeleinden.
          Ongeautoriseerd hacken is <strong style="color: #00ff00;">ILLEGAAL</strong> in Nederland (Artikel 138ab Wetboek van Strafrecht).
        </p>

        <p style="margin-bottom: 18px;">
          Alle activiteiten in deze simulator zijn <strong style="color: #00ff00;">gesimuleerd</strong> en beïnvloeden geen echte systemen.
        </p>

        <p style="margin-bottom: 12px;">
          <strong style="color: #00ff00;">Belangrijke regels:</strong>
        </p>
        <ul style="margin: 0 0 18px 20px; padding: 0;">
          <li style="margin-bottom: 10px;">Vraag <strong style="color: #00ff00;">altijd toestemming</strong> voordat je systemen test</li>
          <li style="margin-bottom: 10px;">Gebruik deze kennis <strong style="color: #00ff00;">alleen ethisch en legaal</strong></li>
          <li style="margin-bottom: 10px;">Ongeautoriseerde toegang tot systemen is een <strong style="color: #00ff00;">misdrijf</strong></li>
        </ul>

        <p style="margin-bottom: 0;">
          Door verder te gaan, ga je akkoord met de
          <a href="assets/legal/terms.html" target="_blank" style="color: #00ff00; text-decoration: underline;">Gebruiksvoorwaarden</a>
          en bevestig je deze kennis alleen voor legale doeleinden te gebruiken.
        </p>
      </div>

      <div style="margin-bottom: 20px;">
        <button id="legal-accept-btn" style="
          background: #00ff00;
          color: #000000;
          border: none;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">
          Ik begrijp het - Verder
        </button>
      </div>

      <div style="margin-top: 16px; text-align: center; font-size: 13px; color: #888888;">
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
      btn.style.background = '#00dd00';
      btn.style.transform = 'scale(1.02)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#00ff00';
      btn.style.transform = 'scale(1)';
    });

    // Handle acceptance
    btn.addEventListener('click', () => {
      this.acceptLegal();

      // Remove backdrop from DOM (CRITICAL: must be removed to not block other modals)
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }

      // Double-check: force remove by ID if still present
      const backdropCheck = document.getElementById('legal-modal-backdrop');
      if (backdropCheck) {
        backdropCheck.remove();
      }

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

// Add shake animation for modal (defer until DOM is ready)
function addShakeAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}

// Add animation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addShakeAnimation);
} else {
  addShakeAnimation();
}

export default legalManager;
