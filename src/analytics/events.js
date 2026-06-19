// Analytics Event Definitions
// Centralized event tracking for consistency

import analyticsTracker from './tracker.js';

const analyticsEvents = {
  /**
   * Track session start
   */
  sessionStart() {
    analyticsTracker.trackEvent('session_start', {
      timestamp: new Date().toISOString(),
      user_type: this.getUserType()
    });
  },

  /**
   * Track session end
   * @param {number} duration - Session duration in seconds
   * @param {number} commandCount - Number of commands executed
   */
  sessionEnd(duration, commandCount) {
    analyticsTracker.trackEvent('session_end', {
      duration_seconds: Math.round(duration),
      command_count: commandCount,
      user_type: this.getUserType()
    });
  },

  /**
   * Track command execution
   * @param {string} commandName - Name of the command (NO ARGUMENTS!)
   * @param {boolean} success - Whether command succeeded
   */
  commandExecuted(commandName, success = true) {
    // PRIVACY: Only log command NAME, never arguments (PRD §6.6)
    analyticsTracker.trackEvent('command_executed', {
      command: commandName,
      success: success,
      timestamp: Date.now()
    });
  },

  /**
   * Track error occurrence
   * @param {string} errorType - Type of error (syntax, not_found, permission, etc.)
   * @param {string} commandName - Command that caused error
   */
  errorOccurred(errorType, commandName = 'unknown') {
    analyticsTracker.trackEvent('error_occurred', {
      error_type: errorType,
      command: commandName
    });
  },

  /**
   * Track help system usage
   * @param {string} helpType - Type of help (command_help, man_page, fuzzy_suggestion)
   * @param {string} commandName - Command being helped with
   */
  helpUsed(helpType, commandName = null) {
    const params = {
      help_type: helpType
    };

    if (commandName) {
      params.command = commandName;
    }

    analyticsTracker.trackEvent('help_used', params);
  },

  /**
   * Track tutorial/onboarding events
   * @param {string} action - onboarding action (welcome_shown, tutorial_started, etc.)
   */
  onboardingEvent(action) {
    analyticsTracker.trackEvent('onboarding', {
      action: action,
      user_type: this.getUserType()
    });
  },

  /**
   * Track tutorial events
   * @param {string} action - tutorial action (started, step_completed, completed, abandoned)
   * @param {string} scenarioId - Scenario identifier
   * @param {object} extra - Additional data (stepIndex, lastStep)
   */
  tutorialEvent(action, scenarioId, extra = {}) {
    analyticsTracker.trackEvent('tutorial', {
      action: action,
      scenario: scenarioId,
      ...extra
    });
  },

  /**
   * Track gamification events
   * @param {string} action - gamification action (challenge_started, challenge_completed, etc.)
   * @param {string} itemId - Challenge or badge identifier
   * @param {object} extra - Additional data (attempts, points)
   */
  gamificationEvent(action, itemId, extra = {}) {
    analyticsTracker.trackEvent('gamification', {
      action: action,
      item: itemId,
      ...extra
    });
  },

  /**
   * Track feedback submission
   * @param {number} rating - Star rating (1-5)
   * @param {boolean} hasComment - Whether user left a comment
   */
  feedbackSubmitted(rating, hasComment = false) {
    analyticsTracker.trackEvent('feedback_submitted', {
      rating: rating,
      has_comment: hasComment
    });
  },

  /**
   * Track legal/compliance events
   * @param {string} action - legal action (modal_shown, terms_accepted, etc.)
   */
  legalEvent(action) {
    analyticsTracker.trackEvent('legal', {
      action: action
    });
  },

  /**
   * Track Gumroad / product CTA click
   * @param {string} productId - Gumroad short ID (yzdtfx, wmvpx, eogjdk, emzjvj)
   * @param {string} location - Page context (gidsen_juridisch, blog_nmap, man_tip, etc.)
   * @param {string} label - Visible button text (for wording-effectiveness analysis)
   */
  productCtaClick(productId, location, label) {
    analyticsTracker.trackEvent('product_cta_click', {
      product_id: productId,
      location: location,
      label: label
    });
  },

  /**
   * Track newsletter signup success (after Brevo form confirmation)
   * @param {string} location - Where the form is placed (footer, blog_sidebar, etc.)
   */
  newsletterSignup(location) {
    analyticsTracker.trackEvent('newsletter_signup', {
      location: location
    });
  },

  /**
   * Track lead magnet signup success (after Brevo form confirmation on sample-pages)
   * @param {string} sampleId - Sample identifier (pentest, future: juridisch, leerplan)
   * @param {string} location - Page context (sample_pentest, etc.)
   */
  leadMagnetSignup(sampleId, location) {
    analyticsTracker.trackEvent('lead_magnet_signup', {
      sample_id: sampleId,
      location: location
    });
  },

  /**
   * Track lead magnet PDF download click (same-origin download na signup of op de download-pagina)
   * @param {string} sampleId - Sample identifier (pentest, future: juridisch, leerplan)
   * @param {string} location - Page context (sample_success_panel, sample_download_page, etc.)
   */
  leadMagnetDownload(sampleId, location) {
    analyticsTracker.trackEvent('lead_magnet_download', {
      sample_id: sampleId,
      location: location
    });
  },

  /**
   * Track lead magnet CTA click (sample-promo links on blog/gidsen)
   * @param {string} magnetId - Lead magnet identifier (pentest_sample, future: juridisch_sample)
   * @param {string} location - Page context (blog_nmap_top, blog_cybertools_mid, gidsen_sample_secondary)
   * @param {string} label - Visible button text (for wording-effectiveness analysis)
   */
  leadMagnetCtaClick(magnetId, location, label) {
    analyticsTracker.trackEvent('lead_magnet_cta_click', {
      magnet_id: magnetId,
      location: location,
      label: label
    });
  },

  /**
   * Determine user type (first-time vs returning)
   * @returns {string} 'new' or 'returning'
   */
  getUserType() {
    try {
      const visitCount = localStorage.getItem('hacksim_visit_count');
      return visitCount && parseInt(visitCount) > 1 ? 'returning' : 'new';
    } catch (e) {
      return 'unknown';
    }
  },

  /**
   * Increment visit counter
   */
  incrementVisitCount() {
    try {
      const visitCount = parseInt(localStorage.getItem('hacksim_visit_count') || '0');
      localStorage.setItem('hacksim_visit_count', (visitCount + 1).toString());
    } catch (e) {
      console.warn('Could not increment visit count');
    }
  }
};

export default analyticsEvents;
