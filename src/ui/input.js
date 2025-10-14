/**
 * Input Handler
 * Manages keyboard input and events
 * Handles: Enter (submit), Arrow keys (history), Tab (autocomplete future)
 */

import history from '../core/history.js';

class InputHandler {
  constructor() {
    this.inputElement = null;
    this.onSubmitCallback = null;
    this.currentInput = '';
  }

  /**
   * Initialize input handler
   * @param {HTMLInputElement} inputElement - Terminal input field
   * @param {Function} onSubmit - Callback when command is submitted
   */
  init(inputElement, onSubmit) {
    if (!inputElement) {
      throw new Error('Input element is required');
    }

    if (typeof onSubmit !== 'function') {
      throw new Error('onSubmit callback is required');
    }

    this.inputElement = inputElement;
    this.onSubmitCallback = onSubmit;

    // Attach event listeners
    this._attachListeners();

    // Focus input on load
    this.focus();
  }

  /**
   * Attach keyboard event listeners
   * @private
   */
  _attachListeners() {
    // Keydown for special keys
    this.inputElement.addEventListener('keydown', (e) => {
      this._handleKeyDown(e);
    });

    // Input for tracking changes
    this.inputElement.addEventListener('input', (e) => {
      this.currentInput = e.target.value;
      // Reset history navigation when user types
      history.resetIndex();
    });

    // Keep input focused (click anywhere refocuses)
    document.addEventListener('click', () => {
      this.focus();
    });
  }

  /**
   * Handle keydown events
   * @private
   */
  _handleKeyDown(e) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this._handleSubmit();
        break;

      case 'ArrowUp':
        e.preventDefault();
        this._handleHistoryPrevious();
        break;

      case 'ArrowDown':
        e.preventDefault();
        this._handleHistoryNext();
        break;

      case 'Tab':
        e.preventDefault();
        // TODO: Autocomplete in future
        break;

      case 'l':
        // Ctrl+L or Cmd+L to clear (common terminal shortcut)
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this._handleClear();
        }
        break;

      case 'c':
        // Ctrl+C to cancel input
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this._handleCancel();
        }
        break;
    }
  }

  /**
   * Handle command submission (Enter key)
   * @private
   */
  _handleSubmit() {
    const command = this.getValue().trim();

    // Call the submit callback
    if (this.onSubmitCallback) {
      this.onSubmitCallback(command);
    }

    // Clear input
    this.clear();
  }

  /**
   * Handle history navigation - previous (↑)
   * @private
   */
  _handleHistoryPrevious() {
    const previous = history.previous();
    if (previous !== null) {
      this.setValue(previous);
    }
  }

  /**
   * Handle history navigation - next (↓)
   * @private
   */
  _handleHistoryNext() {
    const next = history.next();
    if (next !== null) {
      this.setValue(next);
    }
  }

  /**
   * Handle clear terminal (Ctrl+L)
   * @private
   */
  _handleClear() {
    // Clear is handled by terminal, but we clear input
    this.clear();
  }

  /**
   * Handle cancel input (Ctrl+C)
   * @private
   */
  _handleCancel() {
    this.clear();
  }

  /**
   * Get current input value
   * @returns {string}
   */
  getValue() {
    return this.inputElement ? this.inputElement.value : '';
  }

  /**
   * Set input value
   * @param {string} value - New input value
   */
  setValue(value) {
    if (this.inputElement) {
      this.inputElement.value = value;
      this.currentInput = value;

      // Move cursor to end
      this.inputElement.setSelectionRange(value.length, value.length);
    }
  }

  /**
   * Clear input field
   */
  clear() {
    this.setValue('');
  }

  /**
   * Focus input field
   */
  focus() {
    if (this.inputElement) {
      this.inputElement.focus();
    }
  }

  /**
   * Disable input (for async operations)
   */
  disable() {
    if (this.inputElement) {
      this.inputElement.disabled = true;
    }
  }

  /**
   * Enable input
   */
  enable() {
    if (this.inputElement) {
      this.inputElement.disabled = false;
      this.focus();
    }
  }

  /**
   * Check if input is empty
   * @returns {boolean}
   */
  isEmpty() {
    return !this.getValue().trim();
  }
}

// Export as singleton
export default new InputHandler();
