/**
 * Output Renderer
 * Renders command output to the terminal DOM
 * Handles special formatting (colors, icons, newlines)
 */

class Renderer {
  constructor() {
    this.outputElement = null;
    this.promptPrefix = 'hacker@hacksim:~$';
  }

  /**
   * Initialize renderer with DOM element
   * @param {HTMLElement} outputElement - Terminal output container
   */
  init(outputElement) {
    if (!outputElement) {
      throw new Error('Output element is required');
    }
    this.outputElement = outputElement;
  }

  /**
   * Render command input line (echo what user typed)
   * @param {string} command - Command string
   */
  renderInput(command) {
    const line = document.createElement('div');
    line.className = 'terminal-line terminal-input';

    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    prompt.textContent = this.promptPrefix + ' ';

    const commandText = document.createElement('span');
    commandText.textContent = command;

    line.appendChild(prompt);
    line.appendChild(commandText);

    this.outputElement.appendChild(line);

    this._scrollToBottom();
  }

  /**
   * Render command output
   * @param {string} output - Command output text
   * @param {string} type - Output type (normal, error, success, warning, info)
   */
  renderOutput(output, type = 'normal') {
    if (!output) {
      return;
    }

    // Split by newlines and render each line
    const lines = output.split('\n');

    lines.forEach(lineText => {
      const trimmed = lineText.trim();

      // Check for separator marker - render as visual separator div
      if (trimmed === '[SEPARATOR]') {
        const separator = document.createElement('div');
        separator.className = 'welcome-separator';
        this.outputElement.appendChild(separator);
        return;  // Skip normal line rendering
      }

      // Check for section header marker - render as left-aligned header (man pages + educational content)
      if (trimmed.startsWith('[###]')) {
        const header = document.createElement('div');
        header.className = 'section-header';
        header.textContent = trimmed;
        this.outputElement.appendChild(header);
        return;  // Skip normal line rendering
      }

      // Check for welcome message marker - render as centered message
      if (trimmed.startsWith('[***]')) {
        const message = document.createElement('div');
        message.className = 'welcome-message';
        message.textContent = trimmed;
        this.outputElement.appendChild(message);
        return;  // Skip normal line rendering
      }

      const line = document.createElement('div');

      // Auto-detect semantic lines and force correct color type
      // This ensures consistent colors regardless of parent output type
      // Supports both ASCII brackets ([ ? ]) and emoji (💡) for backward compatibility
      let lineType = type;

      // ASCII bracket detection (primary - terminal authentic)
      if (trimmed.startsWith('[ ? ]') || trimmed.startsWith('[ → ]')) {
        lineType = 'info';      // Tips/Info/Educational → cyaan
      } else if (trimmed.startsWith('[ ! ]')) {
        lineType = 'warning';   // Warnings/Legal → oranje
      } else if (trimmed.startsWith('[ ✓ ]')) {
        lineType = 'success';   // Success → groen
      } else if (trimmed.startsWith('[ X ]')) {
        lineType = 'error';     // Errors/Critical → magenta
      }
      // Emoji detection (fallback for backward compatibility during migration)
      else if (trimmed.startsWith('💡') || trimmed.startsWith('🎯')) {
        lineType = 'info';      // Tips/Educational → cyaan
      } else if (trimmed.startsWith('⚠️') || trimmed.startsWith('🔒')) {
        lineType = 'warning';   // Warnings & Security → oranje
      } else if (trimmed.startsWith('✅')) {
        lineType = 'success';   // Success → groen
      } else if (trimmed.startsWith('❌')) {
        lineType = 'error';     // Errors → magenta/rood
      }

      line.className = `terminal-line terminal-output terminal-output-${lineType}`;

      // Process special formatting
      const formattedContent = this._formatText(lineText);
      line.innerHTML = formattedContent;

      this.outputElement.appendChild(line);
    });

    // Always scroll to bottom (industry standard)
    this._scrollToBottom();
  }

  /**
   * Render an error message
   * @param {string} message - Error message
   */
  renderError(message) {
    this.renderOutput(message, 'error');
  }

  /**
   * Render a success message
   * @param {string} message - Success message
   */
  renderSuccess(message) {
    this.renderOutput(message, 'success');
  }

  /**
   * Render a warning message
   * @param {string} message - Warning message
   */
  renderWarning(message) {
    this.renderOutput(message, 'warning');
  }

  /**
   * Render an info message
   * @param {string} message - Info message
   */
  renderInfo(message) {
    this.renderOutput(message, 'info');
  }

  /**
   * Clear the terminal output
   */
  clear() {
    if (this.outputElement) {
      this.outputElement.innerHTML = '';
    }
  }

  /**
   * Render welcome message
   * Uses onboarding system for personalized welcome
   * @param {Object} onboarding - Onboarding instance (optional for backward compatibility)
   */
  renderWelcome(onboarding = null) {
    if (onboarding) {
      const welcome = onboarding.getWelcomeMessage();
      this.renderOutput(welcome, 'info');
    } else {
      // Fallback to default welcome if no onboarding provided
      const welcome = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                            ┃
┃  [***] HACKSIMULATOR.NL - MVP BETA        ┃
┃                                            ┃
┃  Leer ethisch hacken in een veilige       ┃
┃  terminal                                  ┃
┃                                            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

[ ? ] TIP: Type 'help' om te beginnen.
`;
      this.renderOutput(welcome.trim(), 'info');
    }
  }

  /**
   * Format text with special markers
   * @private
   */
  _formatText(text) {
    // Escape HTML to prevent XSS
    let formatted = this._escapeHtml(text);

    // Replace emoji shortcuts with actual emoji (already in text)
    // No processing needed - emoji pass through

    // Format inline arrows (← for Dutch explanations)
    formatted = formatted.replace(/←/g, '<span class="inline-arrow">←</span>');

    // Note: Emoji formatting removed - we now use ASCII brackets [ ? ] [ ! ] [ ✓ ] [ X ]
    // Icon wrapping handled by semantic line detection above (lines 68-87)

    return formatted;
  }

  /**
   * Escape HTML to prevent XSS
   * @private
   */
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Scroll terminal to bottom (industry standard behavior)
   * @private
   */
  _scrollToBottom() {
    if (this.outputElement) {
      // Scroll the output element itself (not parent)
      this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
  }

  /**
   * Update prompt prefix (for directory changes)
   * @param {string} cwd - Current working directory
   */
  updatePrompt(cwd = '~') {
    this.promptPrefix = `hacker@hacksim:${cwd}$`;
  }

  /**
   * Get current prompt
   * @returns {string}
   */
  getPrompt() {
    return this.promptPrefix;
  }
}

// Export as singleton
export default new Renderer();
