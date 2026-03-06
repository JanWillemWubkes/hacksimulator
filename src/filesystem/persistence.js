/**
 * Filesystem Persistence
 * Handles saving/loading VFS state to/from localStorage
 * Uses debounced saves (1000ms) to batch rapid filesystem mutations
 */

import vfs from './vfs.js';

const SAVE_DEBOUNCE_MS = 1000;

class FilesystemPersistence {
  constructor() {
    this.storageKey = 'hacksim_filesystem';
    this.autoSave = true;
    this._saveTimeout = null;
  }

  /**
   * Initialize persistence: load saved state and wire up VFS change listener
   */
  init() {
    // Load saved filesystem if available
    if (this.hasSavedData()) {
      this.load();
    }

    // Listen for VFS mutations → debounced save
    vfs.onChange(() => this.scheduleSave());

    // Flush pending saves before page unload
    window.addEventListener('beforeunload', () => this.flush());
  }

  /**
   * Schedule a debounced save (resets timer on each call)
   */
  scheduleSave() {
    if (!this.autoSave) return;

    if (this._saveTimeout) {
      clearTimeout(this._saveTimeout);
    }

    this._saveTimeout = setTimeout(() => {
      this.save();
      this._saveTimeout = null;
    }, SAVE_DEBOUNCE_MS);
  }

  /**
   * Flush any pending debounced save immediately
   */
  flush() {
    if (this._saveTimeout) {
      clearTimeout(this._saveTimeout);
      this._saveTimeout = null;
      this.save();
    }
  }

  /**
   * Save current filesystem state to localStorage
   */
  save() {
    if (!this.autoSave) {
      return;
    }

    try {
      const serialized = vfs.serialize();
      localStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      console.warn('[VFS] Failed to save filesystem:', error);
    }
  }

  /**
   * Load filesystem state from localStorage
   * @returns {boolean} True if loaded successfully
   */
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);

      if (stored) {
        vfs.deserialize(stored);
        return true;
      }

      return false;
    } catch (error) {
      console.warn('[VFS] Failed to load filesystem:', error);
      return false;
    }
  }

  /**
   * Reset filesystem to initial state and clear storage
   */
  reset() {
    // Cancel any pending save
    if (this._saveTimeout) {
      clearTimeout(this._saveTimeout);
      this._saveTimeout = null;
    }

    vfs.reset();
    this.clear();
  }

  /**
   * Clear saved filesystem from localStorage
   */
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('[VFS] Failed to clear filesystem storage:', error);
    }
  }

  /**
   * Enable/disable auto-save
   * @param {boolean} enabled
   */
  setAutoSave(enabled) {
    this.autoSave = enabled;
  }

  /**
   * Check if there is saved filesystem data
   * @returns {boolean}
   */
  hasSavedData() {
    try {
      return localStorage.getItem(this.storageKey) !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get storage size (for debugging)
   * @returns {number} Size in bytes
   */
  getStorageSize() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? stored.length : 0;
    } catch (error) {
      return 0;
    }
  }
}

// Export as singleton
const persistence = new FilesystemPersistence();
export default persistence;
