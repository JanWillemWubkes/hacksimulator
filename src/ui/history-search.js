/**
 * History Search Handler
 * Implements Ctrl+R reverse search functionality (like bash)
 * Allows searching through command history interactively
 */

import history from '../core/history.js';

class HistorySearchHandler {
  constructor() {
    this.isActive = false;
    this.searchTerm = '';
    this.matches = [];
    this.currentMatchIndex = 0;
  }

  /**
   * Start history search mode
   */
  start() {
    this.isActive = true;
    this.searchTerm = '';
    this.matches = [];
    this.currentMatchIndex = 0;
  }

  /**
   * Stop history search mode
   */
  stop() {
    this.isActive = false;
    this.searchTerm = '';
    this.matches = [];
    this.currentMatchIndex = 0;
  }

  /**
   * Check if search mode is active
   * @returns {boolean}
   */
  isSearchActive() {
    return this.isActive;
  }

  /**
   * Update search term and find matches
   * @param {string} term - Search term
   */
  updateSearch(term) {
    this.searchTerm = term;

    if (!term.trim()) {
      // Empty search - show all history (most recent first)
      this.matches = history.getAll().reverse();
    } else {
      // Search history (case-insensitive)
      const allMatches = history.search(term);
      // Reverse to show most recent first
      this.matches = allMatches.reverse();
    }

    // Reset to first match
    this.currentMatchIndex = 0;
  }

  /**
   * Get current search term
   * @returns {string}
   */
  getSearchTerm() {
    return this.searchTerm;
  }

  /**
   * Get current match
   * @returns {string|null} Current match or null if no matches
   */
  getCurrentMatch() {
    if (this.matches.length === 0) {
      return null;
    }

    return this.matches[this.currentMatchIndex];
  }

  /**
   * Cycle to next match (older command)
   */
  nextMatch() {
    if (this.matches.length === 0) {
      return;
    }

    this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length;
  }

  /**
   * Cycle to previous match (newer command)
   */
  previousMatch() {
    if (this.matches.length === 0) {
      return;
    }

    this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matches.length) % this.matches.length;
  }

  /**
   * Get match count
   * @returns {number}
   */
  getMatchCount() {
    return this.matches.length;
  }

  /**
   * Get current match index (1-based for display)
   * @returns {number}
   */
  getCurrentMatchNumber() {
    return this.matches.length > 0 ? this.currentMatchIndex + 1 : 0;
  }

  /**
   * Get search prompt text (for display)
   * @returns {string} Formatted search prompt
   */
  getPromptText() {
    const match = this.getCurrentMatch();
    const matchNum = this.getCurrentMatchNumber();
    const totalMatches = this.getMatchCount();

    if (totalMatches === 0) {
      return `(reverse-i-search)\`${this.searchTerm}': [geen matches]`;
    }

    return `(reverse-i-search)\`${this.searchTerm}' [${matchNum}/${totalMatches}]: ${match || ''}`;
  }

  /**
   * Accept current match (Enter key)
   * @returns {string|null} Selected command
   */
  accept() {
    const selected = this.getCurrentMatch();
    this.stop();
    return selected;
  }

  /**
   * Cancel search (Esc key)
   */
  cancel() {
    this.stop();
  }
}

// Export as singleton
export default new HistorySearchHandler();
