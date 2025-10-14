/**
 * Command Parser
 * Parses user input into command, arguments, and flags
 *
 * Examples:
 *   "ls" -> { command: "ls", args: [], flags: {} }
 *   "ls -la" -> { command: "ls", args: [], flags: { l: true, a: true } }
 *   "cat file.txt" -> { command: "cat", args: ["file.txt"], flags: {} }
 *   "nmap -p 80 192.168.1.1" -> { command: "nmap", args: ["192.168.1.1"], flags: { p: "80" } }
 */

class CommandParser {
  /**
   * Parse a command string into structured data
   * @param {string} input - Raw command input
   * @returns {Object} Parsed command object
   */
  parse(input) {
    // Trim and normalize whitespace
    const trimmed = input.trim();

    // Empty input
    if (!trimmed) {
      return {
        command: '',
        args: [],
        flags: {},
        raw: input
      };
    }

    // Split by whitespace, but respect quotes
    const tokens = this._tokenize(trimmed);

    // First token is the command
    const command = tokens[0].toLowerCase();

    // Parse remaining tokens as args and flags
    const { args, flags } = this._parseTokens(tokens.slice(1));

    return {
      command,
      args,
      flags,
      raw: input
    };
  }

  /**
   * Tokenize input string, respecting quotes
   * @private
   */
  _tokenize(input) {
    const tokens = [];
    let current = '';
    let inQuote = false;
    let quoteChar = null;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      // Handle quotes
      if ((char === '"' || char === "'") && !inQuote) {
        inQuote = true;
        quoteChar = char;
        continue;
      }

      if (char === quoteChar && inQuote) {
        inQuote = false;
        quoteChar = null;
        continue;
      }

      // Handle whitespace
      if (char === ' ' && !inQuote) {
        if (current) {
          tokens.push(current);
          current = '';
        }
        continue;
      }

      current += char;
    }

    // Add last token
    if (current) {
      tokens.push(current);
    }

    return tokens;
  }

  /**
   * Parse tokens into args and flags
   * @private
   */
  _parseTokens(tokens) {
    const args = [];
    const flags = {};

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // Short flags: -a, -la, -p 80
      if (token.startsWith('-') && !token.startsWith('--')) {
        const flagStr = token.slice(1);

        // Combined flags like -la
        if (flagStr.length > 1 && !/\d/.test(flagStr)) {
          for (const flag of flagStr) {
            flags[flag] = true;
          }
        } else {
          // Single flag, might have value
          const flag = flagStr;

          // Check if next token is a value (not a flag)
          if (i + 1 < tokens.length && !tokens[i + 1].startsWith('-')) {
            flags[flag] = tokens[i + 1];
            i++; // Skip next token
          } else {
            flags[flag] = true;
          }
        }
      }
      // Long flags: --help, --verbose
      else if (token.startsWith('--')) {
        const flag = token.slice(2);

        // Check for = syntax: --port=8080
        if (flag.includes('=')) {
          const [key, value] = flag.split('=');
          flags[key] = value;
        } else {
          // Check if next token is a value
          if (i + 1 < tokens.length && !tokens[i + 1].startsWith('-')) {
            flags[flag] = tokens[i + 1];
            i++;
          } else {
            flags[flag] = true;
          }
        }
      }
      // Regular argument
      else {
        args.push(token);
      }
    }

    return { args, flags };
  }

  /**
   * Validate if a command name is valid
   * @param {string} command - Command name to validate
   * @returns {boolean}
   */
  isValidCommand(command) {
    // Command must be alphanumeric (and hyphens)
    return /^[a-z0-9-]+$/.test(command);
  }
}

// Export as singleton
export default new CommandParser();
