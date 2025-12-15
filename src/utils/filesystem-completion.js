/**
 * Filesystem Autocomplete Utility
 * Provides path completion for filesystem commands (cd, ls, cat, etc.)
 *
 * Implements 80/20 path completion - good enough for educational use,
 * not perfect POSIX compliance.
 */

import vfs from '../filesystem/vfs.js';

/**
 * Get filesystem completions for a partial path
 * Handles absolute paths (/etc/pa), relative paths (Do), tilde (~), and parent refs (..)
 *
 * @param {string} partial - Partial path typed by user (e.g., "/home/ha", "Do", "../et")
 * @param {Object} options - Completion options
 * @param {string} options.type - Filter by entry type: 'directory', 'file', or 'both' (default: 'both')
 * @param {boolean} options.showHidden - Include hidden files/directories (default: false)
 * @returns {Array<string>} - Array of completed paths matching the partial input
 *
 * @example
 * // User types: cd /home/ha[TAB]
 * getPathCompletions('/home/ha', { type: 'directory' })
 * // Returns: ['/home/hacker/']
 *
 * @example
 * // User types: cd Do[TAB] (in /home/hacker)
 * getPathCompletions('Do', { type: 'directory' })
 * // Returns: ['Documents/', 'Downloads/'] (if those directories exist)
 */
export function getPathCompletions(partial, options = {}) {
  const { type = 'both', showHidden = false } = options;

  try {
    // Parse partial path into directory and prefix components
    const { directory, prefix, inputStyle } = parsePartialPath(partial);

    // Get directory contents from VFS
    const entries = vfs.listDirectory(directory, showHidden);

    // Filter entries by type and prefix match
    const matches = filterEntries(entries, prefix, type);

    // Build completed paths, preserving user's input style
    return buildCompletedPaths(matches, directory, inputStyle, partial);

  } catch (error) {
    // Directory doesn't exist, permission denied, or other VFS error
    // Return empty array - let command show error on Enter (educational moment)
    return [];
  }
}

/**
 * Parse partial path into components
 * Determines the directory to list and the prefix to match
 *
 * @private
 * @param {string} partial - Partial path from user input
 * @returns {Object} - { directory, prefix, inputStyle }
 *
 * @example
 * parsePartialPath('/home/ha')
 * // Returns: { directory: '/home', prefix: 'ha', inputStyle: 'absolute' }
 *
 * parsePartialPath('Do')  // in /home/hacker
 * // Returns: { directory: '/home/hacker', prefix: 'Do', inputStyle: 'relative' }
 *
 * parsePartialPath('~/no')
 * // Returns: { directory: '/home/hacker', prefix: 'no', inputStyle: 'tilde' }
 */
function parsePartialPath(partial) {
  // Empty or current directory
  if (!partial || partial === '.') {
    return {
      directory: vfs.getCwd(),
      prefix: '',
      inputStyle: 'relative'
    };
  }

  // Determine input style for path preservation
  let inputStyle = 'relative';
  if (partial.startsWith('/')) {
    inputStyle = 'absolute';
  } else if (partial.startsWith('~')) {
    inputStyle = 'tilde';
  }

  // Handle tilde expansion BEFORE processing
  let processedPartial = partial;
  if (partial.startsWith('~')) {
    const homeDir = '/home/hacker';
    // Replace ~ with home directory
    processedPartial = partial === '~'
      ? homeDir
      : homeDir + partial.slice(1);
  }

  // Find last slash to split directory and prefix
  const lastSlash = processedPartial.lastIndexOf('/');

  if (lastSlash === -1) {
    // No slash - completing in current directory
    return {
      directory: vfs.getCwd(),
      prefix: processedPartial,
      inputStyle: 'relative'
    };
  }

  // Has slash - extract directory and prefix
  const directoryPart = processedPartial.slice(0, lastSlash) || '/';
  const prefix = processedPartial.slice(lastSlash + 1);

  // Resolve directory path (handles .., ., multiple slashes)
  const resolvedDir = vfs.resolvePath(directoryPart);

  return {
    directory: resolvedDir,
    prefix: prefix,
    inputStyle: inputStyle
  };
}

/**
 * Filter entries by type and prefix match
 *
 * @private
 * @param {Array<Object>} entries - Directory entries from vfs.listDirectory()
 * @param {string} prefix - Prefix to match (case-insensitive)
 * @param {string} type - Entry type filter: 'directory', 'file', or 'both'
 * @returns {Array<Object>} - Filtered entries
 */
function filterEntries(entries, prefix, type) {
  const lowerPrefix = prefix.toLowerCase();

  return entries.filter(entry => {
    // Type filter
    if (type === 'directory' && entry.type !== 'directory') return false;
    if (type === 'file' && entry.type !== 'file') return false;
    // type === 'both' allows all types

    // Prefix match (case-insensitive)
    return entry.name.toLowerCase().startsWith(lowerPrefix);
  });
}

/**
 * Build completed paths from matched entries
 * Preserves user's input style (absolute/relative/tilde)
 *
 * @private
 * @param {Array<Object>} matches - Filtered directory entries
 * @param {string} directory - Resolved directory path
 * @param {string} inputStyle - User's input style: 'absolute', 'relative', or 'tilde'
 * @param {string} originalPartial - Original partial input (for context)
 * @returns {Array<string>} - Completed paths
 */
function buildCompletedPaths(matches, directory, inputStyle, originalPartial) {
  const homeDir = '/home/hacker';

  return matches.map(entry => {
    // Add trailing slash for directories (terminal convention)
    const name = entry.type === 'directory' ? entry.name + '/' : entry.name;

    // Build path based on input style
    switch (inputStyle) {
      case 'absolute':
        // User typed absolute path - return absolute completion
        return directory === '/' ? '/' + name : directory + '/' + name;

      case 'tilde':
        // User typed tilde path - return tilde completion
        if (directory === homeDir) {
          return '~/' + name;
        } else {
          // Subdirectory of home - replace home prefix with ~
          const relativePath = directory.replace(homeDir, '~');
          return relativePath + '/' + name;
        }

      case 'relative':
      default:
        // User typed relative path - return just the name
        // Exception: if partial had slashes, we need to preserve the path structure
        if (originalPartial.includes('/') && !originalPartial.startsWith('/') && !originalPartial.startsWith('~')) {
          // Relative path with subdirectories like "../etc" or "subdir/file"
          const lastSlash = originalPartial.lastIndexOf('/');
          const pathPrefix = originalPartial.slice(0, lastSlash + 1);
          return pathPrefix + name;
        }
        return name;
    }
  });
}
