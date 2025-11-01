// Feedback Manager - User feedback collection & persistence
// Singleton pattern for consistent feedback state management

import analyticsTracker from '../analytics/tracker.js';

const STORAGE_KEY_FEEDBACK = 'hacksim_feedback';

const feedbackManager = {
  // Internal state
  _currentRating: 0,
  _isInitialized: false,

  /**
   * Initialize feedback system
   * Sets up event listeners for feedback button and modal
   */
  init() {
    if (this._isInitialized) {
      console.warn('Feedback manager already initialized');
      return;
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._setupEventHandlers());
    } else {
      this._setupEventHandlers();
    }

    this._isInitialized = true;
    console.log('Feedback manager initialized');
  },

  /**
   * Setup all event handlers for feedback UI
   * @private
   */
  _setupEventHandlers() {
    const feedbackButton = document.getElementById('feedback-button');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeButton = feedbackModal?.querySelector('.modal-close');
    const submitButton = document.getElementById('feedback-submit');
    const stars = document.querySelectorAll('.rating-stars .star');

    if (!feedbackButton || !feedbackModal) {
      console.warn('Feedback UI elements not found in DOM');
      return;
    }

    // Open modal when feedback button clicked
    feedbackButton.addEventListener('click', () => {
      this._openModal();
    });

    // Close modal when X button clicked
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this._closeModal();
      });
    }

    // Close modal when clicking outside (backdrop)
    feedbackModal.addEventListener('click', (e) => {
      if (e.target === feedbackModal) {
        this._closeModal();
      }
    });

    // Star rating interaction
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating, 10);
        this._setRating(rating);
      });

      // Hover effect (visual preview)
      star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.dataset.rating, 10);
        this._highlightStars(rating);
      });
    });

    // Reset highlight on mouse leave
    const starsContainer = document.querySelector('.rating-stars');
    if (starsContainer) {
      starsContainer.addEventListener('mouseleave', () => {
        this._highlightStars(this._currentRating);
      });
    }

    // Submit feedback
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        this._submitFeedback();
      });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && feedbackModal.classList.contains('active')) {
        this._closeModal();
      }
    });
  },

  /**
   * Open feedback modal
   * @private
   */
  _openModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');

      // Reset form state
      this._resetForm();

      console.log('Feedback modal opened');
    }
  },

  /**
   * Close feedback modal
   * @private
   */
  _closeModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');

      console.log('Feedback modal closed');
    }
  },

  /**
   * Set rating and update UI
   * @param {number} rating - Rating from 1-5
   * @private
   */
  _setRating(rating) {
    this._currentRating = rating;
    this._highlightStars(rating);
    console.log('Rating selected:', rating);
  },

  /**
   * Highlight stars up to given rating
   * @param {number} rating - Number of stars to highlight
   * @private
   */
  _highlightStars(rating) {
    const stars = document.querySelectorAll('.rating-stars .star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  },

  /**
   * Reset feedback form to initial state
   * @private
   */
  _resetForm() {
    this._currentRating = 0;
    this._highlightStars(0);

    const commentField = document.getElementById('feedback-comment');
    if (commentField) {
      commentField.value = '';
    }

    // Clear any visible error messages
    const modal = document.getElementById('feedback-modal');
    const errorElement = modal?.querySelector('.feedback-error');
    if (errorElement) {
      errorElement.classList.remove('visible');
    }
  },

  /**
   * Submit feedback
   * Saves to localStorage and shows confirmation
   * @private
   */
  _submitFeedback() {
    // Validation: Rating is required
    if (this._currentRating === 0) {
      this._showError('Selecteer eerst een rating (1-5 sterren)');
      return;
    }

    const commentField = document.getElementById('feedback-comment');
    const comment = commentField?.value.trim() || '';

    // Create feedback entry
    const feedbackEntry = {
      rating: this._currentRating,
      comment: comment,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    };

    // Save to localStorage
    this._saveFeedback(feedbackEntry);

    // Track analytics (privacy-safe: no comment text!)
    this._trackFeedbackAnalytics(this._currentRating, comment.length > 0);

    // Show success message
    this._showSuccess();

    console.log('Feedback submitted:', {
      rating: feedbackEntry.rating,
      hasComment: comment.length > 0,
      timestamp: feedbackEntry.timestamp
    });
  },

  /**
   * Save feedback to localStorage
   * @param {Object} feedbackEntry - Feedback data to save
   * @private
   */
  _saveFeedback(feedbackEntry) {
    try {
      // Get existing feedback array
      const existingFeedback = this.getAllFeedback();

      // Add new entry
      existingFeedback.push(feedbackEntry);

      // Save back to localStorage
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(existingFeedback));

      console.log('Feedback saved to localStorage. Total entries:', existingFeedback.length);
    } catch (e) {
      console.error('Could not save feedback to localStorage:', e);
      // Fallback: log to console
      console.log('FEEDBACK (localStorage failed):', feedbackEntry);
    }
  },

  /**
   * Track feedback submission in analytics
   * @param {number} rating - User rating (1-5)
   * @param {boolean} hasComment - Whether user added comment
   * @private
   */
  _trackFeedbackAnalytics(rating, hasComment) {
    try {
      analyticsTracker.trackEvent('feedback_submitted', {
        rating: rating,
        has_comment: hasComment,
        timestamp: Date.now()
      });
    } catch (e) {
      console.warn('Could not track feedback analytics:', e);
    }
  },

  /**
   * Show success message and close modal after delay
   * @private
   */
  _showSuccess() {
    const modal = document.getElementById('feedback-modal');
    const modalContent = modal?.querySelector('.modal-content');

    if (!modalContent) return;

    // Save original content
    const originalContent = modalContent.innerHTML;

    // Show success message
    modalContent.innerHTML = `
      <div class="feedback-success" style="text-align: center; padding: 40px 20px;">
        <div style="color: var(--color-success); font-size: 3rem; margin-bottom: 20px; font-family: var(--font-terminal); letter-spacing: 0.15em;">[ OK ]</div>
        <h2 style="color: var(--color-success); margin-bottom: 16px; font-size: 2rem; text-transform: uppercase; letter-spacing: 1px;">Bedankt!</h2>
        <p style="color: var(--color-modal-text); font-size: 1rem;">Je feedback helpt ons HackSimulator.nl te verbeteren.</p>
      </div>
    `;

    // Close modal and restore content after 2 seconds
    setTimeout(() => {
      modalContent.innerHTML = originalContent;
      this._closeModal();
      // Re-setup event handlers for restored content
      this._setupEventHandlers();
    }, 2000);
  },

  /**
   * Show error message (validation failure)
   * Uses CSS toggle pattern for zero layout shift (reserved space in HTML)
   * @param {string} message - Error message to display
   * @private
   */
  _showError(message) {
    const modal = document.getElementById('feedback-modal');
    const errorElement = modal?.querySelector('.feedback-error');

    if (!errorElement) return;

    // Set message and show via CSS class toggle
    errorElement.textContent = message;
    errorElement.classList.add('visible');

    // Hide error after 3 seconds (CSS transition handles fade-out)
    setTimeout(() => {
      errorElement.classList.remove('visible');
    }, 3000);
  },

  /**
   * Get all feedback from localStorage
   * @returns {Array} Array of feedback entries
   */
  getAllFeedback() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FEEDBACK);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Could not retrieve feedback from localStorage:', e);
      return [];
    }
  },

  /**
   * Export feedback as JSON file (download)
   * Useful for beta testing: developer can collect feedback
   */
  exportFeedback() {
    const feedback = this.getAllFeedback();

    if (feedback.length === 0) {
      console.log('No feedback to export');
      return;
    }

    // Create JSON blob
    const jsonBlob = new Blob(
      [JSON.stringify(feedback, null, 2)],
      { type: 'application/json' }
    );

    // Create download link
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hacksimulator-feedback-${Date.now()}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    console.log('Feedback exported:', feedback.length, 'entries');
  },

  /**
   * Clear all feedback from localStorage
   * Use with caution!
   */
  clearAllFeedback() {
    try {
      localStorage.removeItem(STORAGE_KEY_FEEDBACK);
      console.log('All feedback cleared from localStorage');
    } catch (e) {
      console.error('Could not clear feedback:', e);
    }
  },

  /**
   * Get feedback statistics
   * @returns {Object} Statistics about collected feedback
   */
  getStats() {
    const feedback = this.getAllFeedback();

    if (feedback.length === 0) {
      return {
        total: 0,
        averageRating: 0,
        withComments: 0,
        ratingDistribution: {}
      };
    }

    const stats = {
      total: feedback.length,
      averageRating: 0,
      withComments: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    let totalRating = 0;

    feedback.forEach((entry) => {
      totalRating += entry.rating;
      stats.ratingDistribution[entry.rating]++;
      if (entry.comment && entry.comment.length > 0) {
        stats.withComments++;
      }
    });

    stats.averageRating = (totalRating / feedback.length).toFixed(2);

    return stats;
  }
};

// Export singleton
export default feedbackManager;
