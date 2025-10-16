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
