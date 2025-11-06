/**
 * Search Strategies for Command Discovery Modal
 *
 * Pluggable architecture for extensibility:
 * - Phase 1 (MVP): Simple text filtering
 * - Phase 2 (Future): Search ranking, recent commands, fuzzy matching
 *
 * Pattern: Strategy Pattern
 * - Each strategy implements search() method
 * - Returns filtered/scored results
 * - Easy to add new strategies without refactoring
 */

/**
 * Base Search Strategy
 * Abstract class for all search strategies
 */
class SearchStrategy {
  /**
   * Search for commands matching the given term
   * @param {string} term - Search term
   * @param {Array} commands - Array of command objects
   * @returns {Array} Filtered/scored commands
   */
  search(term, commands) {
    throw new Error('SearchStrategy.search() must be implemented by subclass');
  }
}

/**
 * Simple Filter Strategy (Phase 1 MVP)
 * Filters commands by name, description, and category
 */
class SimpleFilterStrategy extends SearchStrategy {
  search(term, commands) {
    if (!term || term.trim() === '') {
      // Empty search = show all commands
      return commands;
    }

    const searchTerm = term.toLowerCase().trim();

    return commands.filter(cmd => {
      // Search in command name
      const nameMatch = cmd.name.toLowerCase().includes(searchTerm);

      // Search in description
      const descMatch = cmd.description &&
                       cmd.description.toLowerCase().includes(searchTerm);

      // Search in category
      const categoryMatch = cmd.category &&
                           cmd.category.toLowerCase().includes(searchTerm);

      return nameMatch || descMatch || categoryMatch;
    });
  }
}

/**
 * Future: Scored Search Strategy (Phase 2)
 * Ranks results by relevance:
 * - Exact name match = highest score
 * - Partial name match = medium score
 * - Description match = lower score
 *
 * Example implementation (not used in Phase 1):
 *
 * class ScoredSearchStrategy extends SearchStrategy {
 *   search(term, commands) {
 *     const results = commands.map(cmd => {
 *       let score = 0;
 *       const searchTerm = term.toLowerCase();
 *
 *       // Exact name match
 *       if (cmd.name.toLowerCase() === searchTerm) score += 100;
 *       // Name starts with term
 *       else if (cmd.name.toLowerCase().startsWith(searchTerm)) score += 50;
 *       // Name contains term
 *       else if (cmd.name.toLowerCase().includes(searchTerm)) score += 25;
 *
 *       // Description match
 *       if (cmd.description?.toLowerCase().includes(searchTerm)) score += 10;
 *
 *       return { ...cmd, score };
 *     })
 *     .filter(cmd => cmd.score > 0)
 *     .sort((a, b) => b.score - a.score);
 *
 *     return results;
 *   }
 * }
 */

/**
 * Future: Recent Commands Strategy (Phase 2)
 * Prioritizes recently used commands in search results
 *
 * Example implementation (not used in Phase 1):
 *
 * class RecentCommandsStrategy extends SearchStrategy {
 *   constructor(historyService) {
 *     super();
 *     this.history = historyService;
 *   }
 *
 *   search(term, commands) {
 *     const recentCommands = this.history.getRecent(5);
 *     const searchTerm = term.toLowerCase();
 *
 *     // Filter recent commands that match search term
 *     const recentMatches = recentCommands
 *       .filter(cmd => cmd.toLowerCase().includes(searchTerm))
 *       .map(cmdName => ({
 *         ...commands.find(c => c.name === cmdName.split(' ')[0]),
 *         isRecent: true,
 *         score: 1000 // High score = appear first
 *       }));
 *
 *     return recentMatches;
 *   }
 * }
 */

/**
 * Future: Fuzzy Match Strategy (Phase 3)
 * Tolerates typos and abbreviations
 *
 * Example: "nmp" matches "nmap"
 * Example: "lst" matches "ls"
 *
 * Would use Levenshtein distance or similar algorithm
 */

// Export strategies for use in command-search-modal.js
window.SearchStrategy = SearchStrategy;
window.SimpleFilterStrategy = SimpleFilterStrategy;
