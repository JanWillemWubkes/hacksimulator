/**
 * Input Handler
 * Manages keyboard input and events
 * Handles: Enter (submit), Arrow keys (history), Tab (autocomplete), Ctrl+R (history search)
 */

import history from '../core/history.js';
import autocomplete from './autocomplete.js';
import historySearch from './history-search.js';

class InputHandler {
  constructor() {
    this.inputElement = null;
    this.terminal = null; // Terminal instance for clear functionality
    this.onSubmitCallback = null;
    this.onSearchPromptUpdate = null; // Callback for search prompt updates
    this.currentInput = '';
    this.isProgrammaticChange = false; // Track programmatic changes
  }

  /**
   * Initialize input handler
   * @param {HTMLInputElement} inputElement - Terminal input field
   * @param {Function} onSubmit - Callback when command is submitted
   * @param {Object} terminal - Terminal instance for keyboard shortcuts
   */
  init(inputElement, onSubmit, terminal) {
    if (!inputElement) {
      throw new Error('Input element is required');
    }

    if (typeof onSubmit !== 'function') {
      throw new Error('onSubmit callback is required');
    }

    if (!terminal) {
      throw new Error('Terminal instance is required');
    }

    this.inputElement = inputElement;
    this.onSubmitCallback = onSubmit;
    this.terminal = terminal;

    // Attach event listeners
    this._attachListeners();

    // Focus input on load
    this.focus();
  }

  /**
   * Set search prompt update callback
   * @param {Function} callback - Callback for search prompt updates
   */
  setSearchPromptCallback(callback) {
    this.onSearchPromptUpdate = callback;
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

      // Only reset if this is actual user input (not programmatic change)
      if (!this.isProgrammaticChange) {
        // Check if in search mode
        if (historySearch.isSearchActive()) {
          // Update search with new input
          historySearch.updateSearch(this.currentInput);
          this._updateSearchPrompt();
        } else {
          // Normal mode: Reset history navigation when user types
          history.resetIndex();
          // Reset autocomplete state when user types
          autocomplete.reset();
        }
      }

      // Reset flag after handling
      this.isProgrammaticChange = false;
    });

    // Keep input focused (click anywhere refocuses)
    // BUT: Don't steal focus if user is interacting with a modal
    document.addEventListener('click', (e) => {
      // Check if click is inside any active modal
      const clickedElement = e.target;
      const isInsideModal = clickedElement.closest('.modal.active');

      // Don't refocus terminal if user clicked inside an active modal
      if (!isInsideModal) {
        this.focus();
      }
    });
  }

  /**
   * Handle keydown events
   * @private
   */
  _handleKeyDown(e) {
    // Check if in search mode
    if (historySearch.isSearchActive()) {
      this._handleSearchModeKeys(e);
      return;
    }

    // Normal mode key handling
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
        this._handleAutocomplete();
        break;

      case 'r':
        // Ctrl+R to start history search
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this._handleHistorySearchStart();
        }
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

      case 'Home':
        // Home key to scroll to top of terminal output
        e.preventDefault();
        this._handleScrollToTop();
        break;

      case 'End':
        // End key to scroll to bottom of terminal output
        e.preventDefault();
        this._handleScrollToBottom();
        break;
    }
  }

  /**
   * Handle keys during search mode
   * @private
   */
  _handleSearchModeKeys(e) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this._handleSearchAccept();
        break;

      case 'Escape':
        e.preventDefault();
        this._handleSearchCancel();
        break;

      case 'ArrowUp':
        // Navigate to previous match (newer command)
        e.preventDefault();
        this._handleSearchPrevious();
        break;

      case 'ArrowDown':
        // Navigate to next match (older command)
        e.preventDefault();
        this._handleSearchNext();
        break;

      case 'r':
        // Ctrl+R to cycle through matches
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this._handleSearchNext();
        }
        break;

      case 'c':
        // Ctrl+C to cancel search
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this._handleSearchCancel();
        }
        break;

      // Let other keys pass through for typing search term
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
   * Handle autocomplete (Tab)
   * @private
   */
  _handleAutocomplete() {
    const currentInput = this.getValue();

    // Try to get completion
    const completion = autocomplete.complete(currentInput);

    if (completion) {
      // Set the completed value
      this.setValue(completion);
    }
    // If no completion, do nothing (Tab is simply ignored)
  }

  /**
   * Handle history search start (Ctrl+R)
   * @private
   */
  _handleHistorySearchStart() {
    // Start search mode
    historySearch.start();

    // Initialize search with current input (if any)
    const currentInput = this.getValue();
    historySearch.updateSearch(currentInput);

    // Update search prompt
    this._updateSearchPrompt();
  }

  /**
   * Handle search accept (Enter during search)
   * @private
   */
  _handleSearchAccept() {
    const selected = historySearch.accept();

    if (selected) {
      // Set the selected command
      this.setValue(selected);
    }

    // Clear search prompt
    this._clearSearchPrompt();
  }

  /**
   * Handle search cancel (Esc or Ctrl+C during search)
   * @private
   */
  _handleSearchCancel() {
    historySearch.cancel();

    // Clear input and search prompt
    this.clear();
    this._clearSearchPrompt();
  }

  /**
   * Handle search previous (↑ during search)
   * @private
   */
  _handleSearchPrevious() {
    historySearch.previousMatch();

    // Update search prompt with new match
    this._updateSearchPrompt();
  }

  /**
   * Handle search next (↓ or Ctrl+R again during search)
   * @private
   */
  _handleSearchNext() {
    historySearch.nextMatch();

    // Update search prompt with new match
    this._updateSearchPrompt();
  }

  /**
   * Update search prompt display
   * @private
   */
  _updateSearchPrompt() {
    if (this.onSearchPromptUpdate) {
      const promptText = historySearch.getPromptText();
      this.onSearchPromptUpdate(promptText);
    }
  }

  /**
   * Clear search prompt display
   * @private
   */
  _clearSearchPrompt() {
    if (this.onSearchPromptUpdate) {
      this.onSearchPromptUpdate(null);
    }
  }

  /**
   * Handle clear terminal (Ctrl+L)
   * @private
   */
  _handleClear() {
    // Clear terminal output
    if (this.terminal) {
      this.terminal.clear();
    }
    // Clear input field
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
   * Handle scroll to top of terminal output (Home key)
   * @private
   */
  _handleScrollToTop() {
    if (!this.terminal || !this.terminal.getOutputElement()) {
      return;
    }

    const outputElement = this.terminal.getOutputElement();
    outputElement.scrollTop = 0;
  }

  /**
   * Handle scroll to bottom of terminal output (End key)
   * @private
   */
  _handleScrollToBottom() {
    if (!this.terminal || !this.terminal.getOutputElement()) {
      return;
    }

    const outputElement = this.terminal.getOutputElement();
    outputElement.scrollTop = outputElement.scrollHeight;
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
      // Mark as programmatic change before setting value
      this.isProgrammaticChange = true;

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
