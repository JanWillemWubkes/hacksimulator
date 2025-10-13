/**
 * main.js - HackSimulator.nl
 * Entry point and initialization
 */

// App configuration
const APP_CONFIG = {
  VERSION: '1.0.0-mvp',
  ENV: 'development',
  ANALYTICS_ENABLED: false,
  DEBUG_MODE: true
};

// App state
const AppState = {
  initialized: false,
  firstVisit: true,
  legalAccepted: false,
  cookieConsent: null,
  sessionStartTime: null
};

/**
 * Initialize the application
 */
function initializeApp() {
  if (AppState.initialized) {
    console.warn('[HackSim] App already initialized');
    return;
  }

  console.log(`[HackSim] Initializing v${APP_CONFIG.VERSION}`);
  AppState.sessionStartTime = Date.now();

  // Check localStorage availability
  if (!checkLocalStorageAvailability()) {
    console.warn('[HackSim] localStorage not available, using session-only mode');
  }

  // Load saved state
  loadAppState();

  // Initialize core components
  initializeTerminal();
  initializeUI();

  // Show onboarding if first visit
  if (AppState.firstVisit) {
    showOnboarding();
  } else {
    showWelcomeMessage();
  }

  // Check legal acceptance
  if (!AppState.legalAccepted) {
    showLegalModal();
  }

  // Check cookie consent
  if (AppState.cookieConsent === null) {
    showCookieConsent();
  }

  AppState.initialized = true;
  console.log('[HackSim] Initialization complete');
}

/**
 * Check if localStorage is available
 */
function checkLocalStorageAvailability() {
  try {
    const test = '__hacksim_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Load application state from localStorage
 */
function loadAppState() {
  try {
    const saved = localStorage.getItem('hacksim_app_state');
    if (saved) {
      const state = JSON.parse(saved);
      AppState.firstVisit = state.firstVisit !== undefined ? state.firstVisit : true;
      AppState.legalAccepted = state.legalAccepted || false;
      AppState.cookieConsent = state.cookieConsent || null;
    }
  } catch (e) {
    console.error('[HackSim] Error loading app state:', e);
  }
}

/**
 * Save application state to localStorage
 */
function saveAppState() {
  try {
    const state = {
      firstVisit: AppState.firstVisit,
      legalAccepted: AppState.legalAccepted,
      cookieConsent: AppState.cookieConsent,
      lastVisit: Date.now()
    };
    localStorage.setItem('hacksim_app_state', JSON.stringify(state));
  } catch (e) {
    console.error('[HackSim] Error saving app state:', e);
  }
}

/**
 * Initialize terminal engine
 * (Will be implemented in terminal.js)
 */
function initializeTerminal() {
  console.log('[HackSim] Initializing terminal...');
  // TODO: Initialize terminal engine
  // This will be implemented when terminal.js is created
}

/**
 * Initialize UI components
 */
function initializeUI() {
  console.log('[HackSim] Initializing UI...');

  // Set up event listeners for modals
  setupModalListeners();

  // Set up feedback widget
  setupFeedbackWidget();

  // Focus terminal input
  const terminalInput = document.getElementById('terminal-input');
  if (terminalInput) {
    terminalInput.focus();
  }
}

/**
 * Set up modal event listeners
 */
function setupModalListeners() {
  // Onboarding modal
  const onboardingAccept = document.getElementById('onboarding-accept');
  if (onboardingAccept) {
    onboardingAccept.addEventListener('click', () => {
      hideOnboarding();
      AppState.firstVisit = false;
      saveAppState();
    });
  }

  // Legal modal
  const legalAccept = document.getElementById('legal-accept');
  if (legalAccept) {
    legalAccept.addEventListener('click', () => {
      hideLegalModal();
      AppState.legalAccepted = true;
      saveAppState();
    });
  }

  // Cookie consent
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      hideCookieConsent();
      AppState.cookieConsent = true;
      saveAppState();
      // TODO: Initialize analytics
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      hideCookieConsent();
      AppState.cookieConsent = false;
      saveAppState();
    });
  }

  // Modal close buttons
  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });
}

/**
 * Set up feedback widget
 */
function setupFeedbackWidget() {
  const feedbackButton = document.getElementById('feedback-button');
  const feedbackModal = document.getElementById('feedback-modal');
  const feedbackSubmit = document.getElementById('feedback-submit');

  if (feedbackButton && feedbackModal) {
    feedbackButton.addEventListener('click', () => {
      feedbackModal.classList.add('active');
    });
  }

  if (feedbackSubmit) {
    feedbackSubmit.addEventListener('click', submitFeedback);
  }

  // Rating stars
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', (e) => {
      const rating = e.target.dataset.rating;
      selectRating(rating);
    });
  });
}

/**
 * Select rating stars
 */
function selectRating(rating) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

/**
 * Submit feedback
 */
function submitFeedback() {
  const selectedStar = document.querySelector('.star.selected:last-of-type');
  const rating = selectedStar ? selectedStar.dataset.rating : null;
  const comment = document.getElementById('feedback-comment').value;

  if (!rating) {
    alert('Selecteer eerst een rating');
    return;
  }

  // TODO: Send feedback to analytics or API
  console.log('[HackSim] Feedback submitted:', { rating, comment });

  // For now, just log to console
  alert('Bedankt voor je feedback!');

  // Close modal and reset form
  const feedbackModal = document.getElementById('feedback-modal');
  feedbackModal.classList.remove('active');
  document.getElementById('feedback-comment').value = '';
  document.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
}

/**
 * Show onboarding modal
 */
function showOnboarding() {
  const modal = document.getElementById('onboarding-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Hide onboarding modal
 */
function hideOnboarding() {
  const modal = document.getElementById('onboarding-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Show legal disclaimer modal
 */
function showLegalModal() {
  const modal = document.getElementById('legal-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Hide legal modal
 */
function hideLegalModal() {
  const modal = document.getElementById('legal-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Show cookie consent banner
 */
function showCookieConsent() {
  const banner = document.getElementById('cookie-consent');
  if (banner) {
    banner.classList.add('active');
    banner.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Hide cookie consent banner
 */
function hideCookieConsent() {
  const banner = document.getElementById('cookie-consent');
  if (banner) {
    banner.classList.remove('active');
    banner.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Show welcome message in terminal
 */
function showWelcomeMessage() {
  // TODO: This will use the terminal renderer once implemented
  console.log('[HackSim] Welkom terug!');
}

/**
 * Handle page unload (track session duration)
 */
window.addEventListener('beforeunload', () => {
  if (AppState.sessionStartTime) {
    const duration = Date.now() - AppState.sessionStartTime;
    console.log(`[HackSim] Session duration: ${Math.round(duration / 1000)}s`);
    // TODO: Send to analytics
  }
});

/**
 * Handle visibility change (track away time)
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('[HackSim] Tab hidden');
  } else {
    console.log('[HackSim] Tab visible');
  }
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    APP_CONFIG,
    AppState,
    initializeApp
  };
}
