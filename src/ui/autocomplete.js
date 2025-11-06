/**
 * Autocomplete Handler
 * Provides Tab completion for commands and paths
 * Phase 1: Command name completion
 * Phase 2: Path/file completion (future)
 */

import registry from '../core/registry.js';
import vfs from '../filesystem/vfs.js';

class AutocompleteHandler {
  constructor() {
    this.lastInput = '';
    this.matches = [];
    this.currentMatchIndex = 0;
  }

  /**
   * Handle Tab key press for autocomplete
   * @param {string} currentInput - Current input value
   * @returns {string|null} Completed value or null if no completion
   */
  complete(currentInput) {
    const trimmed = currentInput.trim();

    // Empty input - show hint
    if (!trimmed) {
      return null;
    }

    // Check if current input is one of our previous matches (cycling scenario)
    const isCycling = this.matches.length > 0 && this.matches.includes(trimmed);

    if (!isCycling) {
      // New input - find matches
      this.lastInput = trimmed;
      this.matches = this._findMatches(trimmed);
      this.currentMatchIndex = 0;
    }

    // No matches
    if (this.matches.length === 0) {
      return null;
    }

    // Single match - complete immediately
    if (this.matches.length === 1) {
      return this.matches[0];
    }

    // Multiple matches - cycle through them
    const completion = this.matches[this.currentMatchIndex];
    this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length;

    return completion;
  }

  /**
   * Get all matches for display (when user wants to see options)
   * @param {string} input - Current input
   * @returns {Array<string>} Array of matching commands
   */
  getMatches(input) {
    return this._findMatches(input.trim());
  }

  /**
   * Find matching commands for input
   * @private
   * @param {string} input - User input
   * @returns {Array<string>} Array of matching commands
   */
  _findMatches(input) {
    // Parse input to determine completion context
    const parts = input.split(/\s+/);
    const isCommandOnly = parts.length === 1;

    if (isCommandOnly) {
      // Complete command name
      return this._matchCommands(parts[0]);
    } else {
      // Multi-word input: check for argument completion
      const commandName = parts[0];
      const args = parts.slice(1); // All parts except command name
      const partial = parts[parts.length - 1]; // Last word being typed

      // Try to get argument completions from the command
      const argCompletions = this._matchArguments(commandName, args, partial);

      if (argCompletions.length > 0) {
        // Return full commands with completed arguments
        const prefix = parts.slice(0, -1).join(' '); // Everything except last word
        return argCompletions.map(completion => `${prefix} ${completion}`.trim());
      }

      // No argument completions - path completion (Phase 2 - future)
      return [];
    }
  }

  /**
   * Match command names
   * @private
   * @param {string} partial - Partial command name
   * @returns {Array<string>} Matching command names
   */
  _matchCommands(partial) {
    const allCommands = registry.list();
    const lowerPartial = partial.toLowerCase();

    // Exact prefix matches
    const matches = allCommands.filter(cmd =>
      cmd.toLowerCase().startsWith(lowerPartial)
    );

    return matches;
  }

  /**
   * Match command arguments using command-specific completion provider
   * @private
   * @param {string} commandName - Command name
   * @param {Array<string>} args - Current arguments (including partial)
   * @param {string} partial - Partial argument being typed
   * @returns {Array<string>} Matching argument completions
   */
  _matchArguments(commandName, args, partial) {
    // Get completion suggestions from the command's completion provider
    const suggestions = registry.getCompletions(commandName, args);

    if (suggestions.length === 0) {
      return [];
    }

    // Filter suggestions by the partial input
    const lowerPartial = partial.toLowerCase();
    const matches = suggestions.filter(suggestion =>
      suggestion.toLowerCase().startsWith(lowerPartial)
    );

    return matches;
  }

  /**
   * Match paths/files (Phase 2 - future implementation)
   * @private
   * @param {string} partial - Partial path
   * @param {string} cwd - Current working directory
   * @returns {Array<string>} Matching paths
   */
  _matchPaths(partial, cwd) {
    // TODO: Phase 2 - Path completion
    // Will use vfs.listDirectory() to find matching files/dirs

    // Example logic (to be implemented):
    // 1. Parse partial path: "/home/use" → directory="/home", prefix="use"
    // 2. List contents of directory via vfs
    // 3. Filter by prefix
    // 4. Return completed paths

    return [];
  }

  /**
   * Reset autocomplete state (called when user types new input)
   */
  reset() {
    this.lastInput = '';
    this.matches = [];
    this.currentMatchIndex = 0;
  }

  /**
   * Get completion hint message
   * @param {string} input - Current input
   * @returns {string|null} Hint message or null
   */
  getHint(input) {
    const matches = this.getMatches(input);

    if (matches.length === 0) {
      return null;
    }

    if (matches.length === 1) {
      return `\n[ TAB ] Druk Tab om te completeren: ${matches[0]}`;
    }

    if (matches.length <= 5) {
      return `\n[ TAB ] Mogelijke commando's:\n  ${matches.join(', ')}`;
    }

    return `\n[ TAB ] ${matches.length} mogelijke commando's (druk Tab om te cyclen)`;
  }
}

// Export as singleton
export default new AutocompleteHandler();
