/**
 * Filesystem Persistence
 * Handles saving/loading VFS state to/from localStorage
 */

import vfs from './vfs.js';

class FilesystemPersistence {
  constructor() {
    this.storageKey = 'hacksim_filesystem';
    this.autoSave = true;
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

// Try to load saved filesystem on initialization
if (persistence.hasSavedData()) {
  persistence.load();
}

export default persistence;
