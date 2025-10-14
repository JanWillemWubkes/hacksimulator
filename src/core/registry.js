/**
 * Command Registry
 * Central registry for all terminal commands
 * Uses the Command Pattern for extensibility
 */

class CommandRegistry {
  constructor() {
    this.commands = new Map();
  }

  /**
   * Register a new command
   * @param {string} name - Command name (e.g., "ls")
   * @param {Object} handler - Command handler object
   * @param {Function} handler.execute - Execute function
   * @param {string} handler.description - Short description (for help)
   * @param {string} handler.category - Category (system, filesystem, network, security)
   */
  register(name, handler) {
    if (!name || typeof name !== 'string') {
      throw new Error('Command name must be a non-empty string');
    }

    if (!handler || typeof handler.execute !== 'function') {
      throw new Error('Command handler must have an execute function');
    }

    // Validate handler structure
    const validHandler = {
      execute: handler.execute,
      description: handler.description || 'No description available',
      category: handler.category || 'other',
      usage: handler.usage || name,
      manPage: handler.manPage || null
    };

    this.commands.set(name.toLowerCase(), validHandler);
  }

  /**
   * Unregister a command (for testing/dynamic commands)
   * @param {string} name - Command name
   */
  unregister(name) {
    return this.commands.delete(name.toLowerCase());
  }

  /**
   * Get a command handler
   * @param {string} name - Command name
   * @returns {Object|null} Command handler or null if not found
   */
  get(name) {
    return this.commands.get(name.toLowerCase()) || null;
  }

  /**
   * Check if a command exists
   * @param {string} name - Command name
   * @returns {boolean}
   */
  has(name) {
    return this.commands.has(name.toLowerCase());
  }

  /**
   * Get all registered commands
   * @returns {Array<string>} Array of command names
   */
  list() {
    return Array.from(this.commands.keys()).sort();
  }

  /**
   * Get commands by category
   * @param {string} category - Category name
   * @returns {Array<Object>} Array of { name, description, usage }
   */
  getByCategory(category) {
    const results = [];

    for (const [name, handler] of this.commands.entries()) {
      if (handler.category === category) {
        results.push({
          name,
          description: handler.description,
          usage: handler.usage
        });
      }
    }

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get all categories
   * @returns {Array<string>} Unique category names
   */
  getCategories() {
    const categories = new Set();
    for (const handler of this.commands.values()) {
      categories.add(handler.category);
    }
    return Array.from(categories).sort();
  }

  /**
   * Execute a command
   * @param {string} name - Command name
   * @param {Array} args - Command arguments
   * @param {Object} flags - Command flags
   * @param {Object} context - Execution context (terminal, filesystem, etc.)
   * @returns {Promise<string>} Command output
   */
  async execute(name, args, flags, context) {
    const handler = this.get(name);

    if (!handler) {
      return `Command not found: ${name}\n\n💡 TIP: Type 'help' voor een lijst van beschikbare commands.`;
    }

    try {
      // Execute command with context
      const output = await handler.execute(args, flags, context);
      return output || '';
    } catch (error) {
      // Command execution error
      console.error(`Error executing command '${name}':`, error);
      return `Error: ${error.message}\n\n💡 TIP: Type 'man ${name}' voor meer informatie over dit commando.`;
    }
  }

  /**
   * Clear all registered commands (for testing)
   */
  clear() {
    this.commands.clear();
  }

  /**
   * Get registry statistics
   * @returns {Object} Stats object
   */
  getStats() {
    const categories = {};

    for (const handler of this.commands.values()) {
      categories[handler.category] = (categories[handler.category] || 0) + 1;
    }

    return {
      total: this.commands.size,
      categories
    };
  }
}

// Export as singleton
export default new CommandRegistry();
