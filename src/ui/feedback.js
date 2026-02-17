/**
 * Feedback Modal Manager
 *
 * Manages user feedback collection via a star rating system.
 * Stores feedback in localStorage and tracks via analytics.
 *
 * @module feedback
 */
import tracker from '../analytics/tracker.js';
import FocusTrap from './focus-trap.js';

const STORAGE_KEY = 'hacksim_feedback';

const FeedbackManager = {
  _currentRating: 0,
  _isInitialized: false,

  /**
   * Initialize the feedback manager
   */
  init() {
    if (this._isInitialized) {
      console.warn('Feedback manager already initialized');
      return;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._setupEventHandlers());
    } else {
      this._setupEventHandlers();
    }

    this._isInitialized = true;
    console.log('Feedback manager initialized');
  },

  /**
   * Set up event handlers for feedback UI
   * @private
   */
  _setupEventHandlers() {
    const feedbackLink = document.getElementById('footer-feedback-link');
    const modal = document.getElementById('feedback-modal');
    const closeBtn = modal?.querySelector('.modal-close');
    const submitBtn = document.getElementById('feedback-submit');
    const cancelBtn = document.getElementById('feedback-cancel');
    const stars = document.querySelectorAll('.rating-stars .star');

    if (!feedbackLink || !modal) {
      console.warn('Feedback UI elements not found in DOM');
      return;
    }

    // Open modal on feedback link click
    feedbackLink.addEventListener('click', (e) => {
      e.preventDefault();
      this._openModal();
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this._closeModal();
      });
    }

    // Click outside modal to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this._closeModal();
      }
    });

    // Star rating handlers
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating, 10);
        this._setRating(rating);
      });

      star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.dataset.rating, 10);
        this._highlightStars(rating);
      });
    });

    // Mouse leave on stars container
    const starsContainer = document.querySelector('.rating-stars');
    if (starsContainer) {
      starsContainer.addEventListener('mouseleave', () => {
        this._highlightStars(this._currentRating);
      });
    }

    // Submit button
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this._submitFeedback();
      });
    }

    // Cancel button
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this._closeModal();
      });
    }
  },

  /**
   * Open the feedback modal
   * @private
   */
  _openModal() {
    const modal = document.getElementById('feedback-modal');
    if (!modal) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    this._resetForm();

    // Activate focus trap for accessibility
    FocusTrap.activate(modal, {
      initialFocus: '.star[data-rating="1"]',
      onClose: () => this._closeModal()
    });

    console.log('Feedback modal opened');
  },

  /**
   * Close the feedback modal
   * @private
   */
  _closeModal() {
    const modal = document.getElementById('feedback-modal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    // Deactivate focus trap and restore previous focus
    FocusTrap.deactivate();

    console.log('Feedback modal closed');
  },

  /**
   * Set the current rating
   * @param {number} rating - Rating value (1-5)
   * @private
   */
  _setRating(rating) {
    this._currentRating = rating;
    this._highlightStars(rating);
    console.log('Rating selected:', rating);
  },

  /**
   * Highlight stars up to the given rating
   * @param {number} rating - Rating to highlight up to
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
   * Reset the feedback form to initial state
   * @private
   */
  _resetForm() {
    this._currentRating = 0;
    this._highlightStars(0);

    const comment = document.getElementById('feedback-comment');
    if (comment) {
      comment.value = '';
    }

    const modal = document.getElementById('feedback-modal');
    const errorEl = modal?.querySelector('.feedback-error');
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
  },

  /**
   * Submit the feedback
   * @private
   */
  _submitFeedback() {
    if (this._currentRating === 0) {
      this._showError('Selecteer eerst een rating (1-5 sterren)');
      return;
    }

    const commentEl = document.getElementById('feedback-comment');
    const comment = commentEl?.value.trim() || '';

    const feedback = {
      rating: this._currentRating,
      comment: comment,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    };

    this._saveFeedback(feedback);
    this._trackFeedbackAnalytics(this._currentRating, comment.length > 0);
    this._showSuccess();

    console.log('Feedback submitted:', {
      rating: feedback.rating,
      hasComment: comment.length > 0,
      timestamp: feedback.timestamp
    });
  },

  /**
   * Save feedback to localStorage
   * @param {Object} feedback - Feedback data
   * @private
   */
  _saveFeedback(feedback) {
    try {
      const allFeedback = this.getAllFeedback();
      allFeedback.push(feedback);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allFeedback));
      console.log('Feedback saved to localStorage. Total entries:', allFeedback.length);
    } catch (e) {
      console.error('Could not save feedback to localStorage:', e);
      console.log('FEEDBACK (localStorage failed):', feedback);
    }
  },

  /**
   * Track feedback submission via analytics
   * @param {number} rating - Rating value
   * @param {boolean} hasComment - Whether feedback included a comment
   * @private
   */
  _trackFeedbackAnalytics(rating, hasComment) {
    try {
      tracker.trackEvent('feedback_submitted', {
        rating: rating,
        has_comment: hasComment,
        timestamp: Date.now()
      });
    } catch (e) {
      console.warn('Could not track feedback analytics:', e);
    }
  },

  /**
   * Show success message and close modal
   * @private
   */
  _showSuccess() {
    const modal = document.getElementById('feedback-modal');
    const content = modal?.querySelector('.modal-content');
    if (!content) return;

    const originalContent = content.innerHTML;

    content.innerHTML = `
      <div class="feedback-success visible" style="text-align: center; padding: 40px 20px;">
        <div style="color: var(--color-success); font-size: 3rem; margin-bottom: 20px; font-family: var(--font-terminal); letter-spacing: 0.15em;">[ OK ]</div>
        <h2 style="color: var(--color-success); margin-bottom: 16px; font-size: 2rem; text-transform: uppercase; letter-spacing: 1px;">Bedankt!</h2>
        <p style="color: var(--color-modal-text); font-size: 1rem;">Je feedback helpt ons HackSimulator.nl te verbeteren.</p>
      </div>
    `;

    setTimeout(() => {
      content.innerHTML = originalContent;
      this._closeModal();
      // Re-setup event handlers since we replaced the content
      this._setupEventHandlers();
    }, 2000);
  },

  /**
   * Show error message
   * @param {string} message - Error message to display
   * @private
   */
  _showError(message) {
    const modal = document.getElementById('feedback-modal');
    const errorEl = modal?.querySelector('.feedback-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
      setTimeout(() => {
        errorEl.classList.remove('visible');
      }, 3000);
    }
  },

  /**
   * Get all stored feedback
   * @returns {Array} Array of feedback objects
   */
  getAllFeedback() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Could not retrieve feedback from localStorage:', e);
      return [];
    }
  },

  /**
   * Export feedback as JSON file
   */
  exportFeedback() {
    const feedback = this.getAllFeedback();
    if (feedback.length === 0) {
      console.log('No feedback to export');
      return;
    }

    const blob = new Blob([JSON.stringify(feedback, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hacksimulator-feedback-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('Feedback exported:', feedback.length, 'entries');
  },

  /**
   * Clear all stored feedback
   */
  clearAllFeedback() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('All feedback cleared from localStorage');
    } catch (e) {
      console.error('Could not clear feedback:', e);
    }
  },

  /**
   * Get feedback statistics
   * @returns {Object} Statistics object
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
    feedback.forEach((item) => {
      totalRating += item.rating;
      stats.ratingDistribution[item.rating]++;
      if (item.comment && item.comment.length > 0) {
        stats.withComments++;
      }
    });

    stats.averageRating = (totalRating / feedback.length).toFixed(2);
    return stats;
  }
};

export default FeedbackManager;
