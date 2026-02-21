/**
 * Virtual Filesystem (VFS)
 * In-memory filesystem implementation for the terminal simulator
 */

import { initialFilesystem, getInitialCwd } from './structure.js';

class VirtualFilesystem {
  constructor() {
    this.fs = null;
    this.cwd = '/';
    this.init();
  }

  /**
   * Initialize (or reset) the filesystem
   */
  init() {
    // Deep clone the initial structure
    this.fs = JSON.parse(JSON.stringify(initialFilesystem));
    this.cwd = getInitialCwd();
  }

  /**
   * Get current working directory
   * @returns {string}
   */
  getCwd() {
    return this.cwd;
  }

  /**
   * Set current working directory
   * @param {string} path - New working directory
   */
  setCwd(path) {
    const resolved = this.resolvePath(path);
    const node = this.getNode(resolved);

    if (!node) {
      throw new Error(`No such directory: ${path}`);
    }

    if (node.type !== 'directory') {
      throw new Error(`Not a directory: ${path}`);
    }

    this.cwd = resolved;
  }

  /**
   * Resolve a path (handle relative and absolute paths)
   * @param {string} path - Path to resolve
   * @returns {string} Absolute path
   */
  resolvePath(path) {
    // Empty path = current directory
    if (!path || path === '.') {
      return this.cwd;
    }

    // Home directory shortcut
    if (path === '~') {
      return '/home/hacker';
    }

    // Home directory prefix (~/...)
    if (path.startsWith('~/')) {
      return this._normalizePath('/home/hacker/' + path.slice(2));
    }

    // Already absolute
    if (path.startsWith('/')) {
      return this._normalizePath(path);
    }

    // Relative path - combine with cwd
    const combined = this.cwd === '/'
      ? '/' + path
      : this.cwd + '/' + path;

    return this._normalizePath(combined);
  }

  /**
   * Normalize a path (handle .. and . and multiple slashes)
   * @private
   */
  _normalizePath(path) {
    const parts = path.split('/').filter(p => p && p !== '.');
    const stack = [];

    for (const part of parts) {
      if (part === '..') {
        if (stack.length > 0) {
          stack.pop();
        }
      } else {
        stack.push(part);
      }
    }

    return '/' + stack.join('/');
  }

  /**
   * Get a filesystem node by path
   * @param {string} path - Path to node
   * @returns {Object|null} Node object or null if not found
   */
  getNode(path) {
    const resolved = this.resolvePath(path);

    if (resolved === '/') {
      return this.fs['/'];
    }

    const parts = resolved.split('/').filter(p => p);
    let current = this.fs['/'];

    for (const part of parts) {
      if (!current || current.type !== 'directory') {
        return null;
      }

      if (!current.children || !current.children[part]) {
        return null;
      }

      current = current.children[part];
    }

    return current;
  }

  /**
   * Check if a path exists
   * @param {string} path - Path to check
   * @returns {boolean}
   */
  exists(path) {
    return this.getNode(path) !== null;
  }

  /**
   * Check if a path is a directory
   * @param {string} path - Path to check
   * @returns {boolean}
   */
  isDirectory(path) {
    const node = this.getNode(path);
    return node !== null && node.type === 'directory';
  }

  /**
   * Check if a path is a file
   * @param {string} path - Path to check
   * @returns {boolean}
   */
  isFile(path) {
    const node = this.getNode(path);
    return node !== null && node.type === 'file';
  }

  /**
   * Read file contents
   * @param {string} path - Path to file
   * @returns {string} File contents
   */
  readFile(path) {
    const node = this.getNode(path);

    if (!node) {
      throw new Error(`No such file: ${path}`);
    }

    if (node.type !== 'file') {
      throw new Error(`Is a directory: ${path}`);
    }

    if (node.permissions === 'restricted') {
      throw new Error(`Permission denied: ${path}`);
    }

    return node.content || '';
  }

  /**
   * List directory contents
   * @param {string} path - Path to directory (defaults to cwd)
   * @param {boolean} showHidden - Show hidden files (starting with .)
   * @returns {Array<Object>} Array of {name, type, permissions}
   */
  listDirectory(path = this.cwd, showHidden = false) {
    const resolved = this.resolvePath(path);
    const node = this.getNode(resolved);

    if (!node) {
      throw new Error(`No such directory: ${path}`);
    }

    if (node.type !== 'directory') {
      throw new Error(`Not a directory: ${path}`);
    }

    const entries = [];

    if (node.children) {
      for (const [name, child] of Object.entries(node.children)) {
        // Skip hidden files if not requested
        if (!showHidden && name.startsWith('.')) {
          continue;
        }

        entries.push({
          name,
          type: child.type,
          permissions: child.permissions || 'normal'
        });
      }
    }

    return entries.sort((a, b) => {
      // Directories first, then files
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Create a directory
   * @param {string} path - Path for new directory
   */
  createDirectory(path) {
    const resolved = this.resolvePath(path);
    const parts = resolved.split('/').filter(p => p);
    const dirName = parts.pop();
    const parentPath = '/' + parts.join('/');

    const parent = this.getNode(parentPath);

    if (!parent) {
      throw new Error(`No such directory: ${parentPath}`);
    }

    if (parent.type !== 'directory') {
      throw new Error(`Not a directory: ${parentPath}`);
    }

    if (parent.children[dirName]) {
      throw new Error(`File exists: ${path}`);
    }

    parent.children[dirName] = {
      type: 'directory',
      children: {}
    };
  }

  /**
   * Create a file
   * @param {string} path - Path for new file
   * @param {string} content - File content (default empty)
   */
  createFile(path, content = '') {
    const resolved = this.resolvePath(path);
    const parts = resolved.split('/').filter(p => p);
    const fileName = parts.pop();
    const parentPath = '/' + parts.join('/');

    const parent = this.getNode(parentPath);

    if (!parent) {
      throw new Error(`No such directory: ${parentPath}`);
    }

    if (parent.type !== 'directory') {
      throw new Error(`Not a directory: ${parentPath}`);
    }

    if (parent.children[fileName]) {
      // File exists - update modified time (touch behavior)
      if (parent.children[fileName].type === 'file') {
        return; // Touch updates timestamp (we don't track that yet)
      } else {
        throw new Error(`Is a directory: ${path}`);
      }
    }

    parent.children[fileName] = {
      type: 'file',
      content
    };
  }

  /**
   * Delete a file or directory
   * @param {string} path - Path to delete
   * @param {boolean} recursive - Delete directories recursively
   */
  delete(path, recursive = false) {
    const resolved = this.resolvePath(path);

    // Prevent deleting root
    if (resolved === '/') {
      throw new Error('Cannot delete root directory');
    }

    const node = this.getNode(resolved);

    if (!node) {
      throw new Error(`No such file or directory: ${path}`);
    }

    // Check if directory and needs recursive
    if (node.type === 'directory' && !recursive) {
      if (Object.keys(node.children || {}).length > 0) {
        throw new Error(`Directory not empty: ${path}`);
      }
    }

    // Get parent and remove node
    const parts = resolved.split('/').filter(p => p);
    const nodeName = parts.pop();
    const parentPath = '/' + parts.join('/');
    const parent = this.getNode(parentPath);

    if (parent && parent.children) {
      delete parent.children[nodeName];
    }
  }

  /**
   * Copy file or directory
   * @param {string} source - Source path
   * @param {string} destination - Destination path
   */
  copy(source, destination) {
    const srcNode = this.getNode(source);

    if (!srcNode) {
      throw new Error(`No such file or directory: ${source}`);
    }

    // Deep clone the source node
    const clone = JSON.parse(JSON.stringify(srcNode));

    // Create at destination
    const destResolved = this.resolvePath(destination);
    const parts = destResolved.split('/').filter(p => p);
    const destName = parts.pop();
    const destParentPath = '/' + parts.join('/');

    const destParent = this.getNode(destParentPath);

    if (!destParent) {
      throw new Error(`No such directory: ${destParentPath}`);
    }

    if (destParent.type !== 'directory') {
      throw new Error(`Not a directory: ${destParentPath}`);
    }

    destParent.children[destName] = clone;
  }

  /**
   * Move/rename file or directory
   * @param {string} source - Source path
   * @param {string} destination - Destination path
   */
  move(source, destination) {
    // Copy then delete
    this.copy(source, destination);
    this.delete(source, true);
  }

  /**
   * Reset filesystem to initial state
   */
  reset() {
    this.init();
  }

  /**
   * Serialize filesystem to JSON (for localStorage)
   * @returns {string}
   */
  serialize() {
    return JSON.stringify({
      fs: this.fs,
      cwd: this.cwd
    });
  }

  /**
   * Deserialize filesystem from JSON
   * @param {string} json - JSON string
   */
  deserialize(json) {
    try {
      const data = JSON.parse(json);
      if (data.fs && data.cwd) {
        this.fs = data.fs;
        this.cwd = data.cwd;
      }
    } catch (error) {
      console.error('Failed to deserialize filesystem:', error);
      this.init(); // Fallback to initial state
    }
  }
}

// Export as singleton
export default new VirtualFilesystem();
