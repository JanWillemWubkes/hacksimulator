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
      const line = document.createElement('div');
      line.className = `terminal-line terminal-output terminal-output-${type}`;

      // Process special formatting
      const formattedContent = this._formatText(lineText);
      line.innerHTML = formattedContent;

      this.outputElement.appendChild(line);
    });

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
   */
  renderWelcome() {
    const welcome = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                ┃
┃       🛡️  HACKSIMULATOR.NL - MVP BETA          ┃
┃                                                ┃
┃   Leer ethisch hacken in een veilige terminal ┃
┃                                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

💡 TIP: Type 'help' om te beginnen.
`;
    this.renderOutput(welcome.trim(), 'info');
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

    // Format inline tips
    formatted = formatted.replace(/💡/g, '<span class="tip-icon">💡</span>');
    formatted = formatted.replace(/⚠️/g, '<span class="warning-icon">⚠️</span>');
    formatted = formatted.replace(/🔒/g, '<span class="security-icon">🔒</span>');
    formatted = formatted.replace(/✅/g, '<span class="success-icon">✅</span>');
    formatted = formatted.replace(/❌/g, '<span class="error-icon">❌</span>');

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
   * Scroll terminal to bottom
   * @private
   */
  _scrollToBottom() {
    if (this.outputElement && this.outputElement.parentElement) {
      // Scroll the terminal container
      const container = this.outputElement.parentElement;
      container.scrollTop = container.scrollHeight;
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
