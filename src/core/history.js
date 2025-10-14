/**
 * Command History Manager
 * Manages command history with navigation (↑↓ arrow keys)
 * Persists to localStorage for session continuity
 */

class HistoryManager {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.history = [];
    this.currentIndex = -1;
    this.storageKey = 'hacksim_history';

    // Load from localStorage
    this.load();
  }

  /**
   * Add a command to history
   * @param {string} command - Command string to add
   */
  add(command) {
    // Don't add empty commands
    if (!command || !command.trim()) {
      return;
    }

    const trimmed = command.trim();

    // Don't add duplicate of last command
    if (this.history.length > 0 && this.history[this.history.length - 1] === trimmed) {
      this.currentIndex = this.history.length;
      return;
    }

    // Add to history
    this.history.push(trimmed);

    // Enforce max size (remove oldest)
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }

    // Reset navigation index
    this.currentIndex = this.history.length;

    // Persist to localStorage
    this.save();
  }

  /**
   * Navigate to previous command (↑ key)
   * @returns {string|null} Previous command or null
   */
  previous() {
    if (this.history.length === 0) {
      return null;
    }

    // Move index back (but not below 0)
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }

    return this.history[this.currentIndex];
  }

  /**
   * Navigate to next command (↓ key)
   * @returns {string|null} Next command or null (empty for newest)
   */
  next() {
    if (this.history.length === 0) {
      return null;
    }

    // Move index forward
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }

    // If at the end, return empty (clear input)
    if (this.currentIndex === this.history.length - 1) {
      this.currentIndex = this.history.length;
      return '';
    }

    return '';
  }

  /**
   * Reset navigation index (when user types)
   */
  resetIndex() {
    this.currentIndex = this.history.length;
  }

  /**
   * Get all history entries
   * @returns {Array<string>} History array
   */
  getAll() {
    return [...this.history];
  }

  /**
   * Get history entry by index
   * @param {number} index - History index (0 = oldest)
   * @returns {string|null}
   */
  get(index) {
    if (index >= 0 && index < this.history.length) {
      return this.history[index];
    }
    return null;
  }

  /**
   * Search history by pattern
   * @param {string} pattern - Search pattern (case-insensitive)
   * @returns {Array<string>} Matching commands
   */
  search(pattern) {
    const regex = new RegExp(pattern, 'i');
    return this.history.filter(cmd => regex.test(cmd));
  }

  /**
   * Clear all history
   */
  clear() {
    this.history = [];
    this.currentIndex = -1;
    this.save();
  }

  /**
   * Get history size
   * @returns {number}
   */
  size() {
    return this.history.length;
  }

  /**
   * Save history to localStorage
   * @private
   */
  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (error) {
      // localStorage disabled or full
      console.warn('Failed to save history to localStorage:', error);
    }
  }

  /**
   * Load history from localStorage
   * @private
   */
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.history = JSON.parse(stored);
        this.currentIndex = this.history.length;

        // Enforce max size after loading
        if (this.history.length > this.maxSize) {
          this.history = this.history.slice(-this.maxSize);
          this.save();
        }
      }
    } catch (error) {
      // Invalid JSON or localStorage disabled
      console.warn('Failed to load history from localStorage:', error);
      this.history = [];
      this.currentIndex = -1;
    }
  }

  /**
   * Export history as string (for debugging)
   * @returns {string}
   */
  toString() {
    return this.history.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
  }
}

// Export as singleton
export default new HistoryManager();
