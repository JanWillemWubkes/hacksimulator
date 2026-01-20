/**
 * Focus Trap Utility for Modal Accessibility
 *
 * Implements WCAG 2.1 focus management:
 * - Traps Tab/Shift+Tab within modal
 * - Saves and restores previous focus
 * - Handles Escape key to close
 *
 * @module focus-trap
 */

const FocusTrap = {
  /** @type {HTMLElement|null} */
  _previousFocus: null,

  /** @type {HTMLElement|null} */
  _activeModal: null,

  /** @type {Function|null} */
  _keydownHandler: null,

  /**
   * Activates focus trap on a modal element
   * @param {HTMLElement} modal - The modal container element
   * @param {Object} options - Configuration options
   * @param {Function} [options.onClose] - Callback when Escape is pressed
   * @param {string} [options.initialFocus] - Selector for initial focus element
   */
  activate(modal, options = {}) {
    if (!modal) {
      console.warn('FocusTrap: No modal element provided');
      return;
    }

    // Save current focus to restore later
    this._previousFocus = document.activeElement;
    this._activeModal = modal;

    // Get all focusable elements within the modal
    const focusableElements = this._getFocusableElements(modal);

    if (focusableElements.length === 0) {
      console.warn('FocusTrap: No focusable elements found in modal');
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Set initial focus
    if (options.initialFocus) {
      const initialElement = modal.querySelector(options.initialFocus);
      if (initialElement) {
        initialElement.focus();
      } else {
        firstElement.focus();
      }
    } else {
      firstElement.focus();
    }

    // Create keydown handler for Tab trap and Escape
    this._keydownHandler = (e) => {
      // Handle Escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        if (options.onClose) {
          options.onClose();
        }
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab') {
        // Re-query focusable elements (they might have changed)
        const currentFocusable = this._getFocusableElements(modal);
        if (currentFocusable.length === 0) return;

        const first = currentFocusable[0];
        const last = currentFocusable[currentFocusable.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: if on first element, go to last
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab: if on last element, go to first
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', this._keydownHandler);
  },

  /**
   * Deactivates focus trap and restores previous focus
   */
  deactivate() {
    // Remove keydown handler
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
      this._keydownHandler = null;
    }

    // Restore previous focus
    if (this._previousFocus && this._previousFocus.focus) {
      // Small delay to ensure modal is fully closed
      setTimeout(() => {
        this._previousFocus.focus();
        this._previousFocus = null;
      }, 10);
    }

    this._activeModal = null;
  },

  /**
   * Gets all focusable elements within a container
   * @param {HTMLElement} container
   * @returns {HTMLElement[]}
   */
  _getFocusableElements(container) {
    const selector = [
      'button:not([disabled]):not([tabindex="-1"])',
      'a[href]:not([tabindex="-1"])',
      'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(selector))
      .filter(el => {
        // Filter out elements that are not visible
        const style = window.getComputedStyle(el);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               el.offsetParent !== null;
      });
  },

  /**
   * Check if a focus trap is currently active
   * @returns {boolean}
   */
  isActive() {
    return this._activeModal !== null;
  }
};

export default FocusTrap;
