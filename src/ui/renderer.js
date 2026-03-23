/**
 * Output Renderer
 * Renders command output to the terminal DOM
 * Handles special formatting (colors, icons, newlines)
 */

import { showCelebrationBanner } from './celebration-banner.js';

const MAX_OUTPUT_LINES = 500;

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
    this._trimOutput();

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
    let lastSemanticType = type; // Track semantic type across lines

    lines.forEach(lineText => {
      const trimmed = lineText.trim();

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
      // Supports both ASCII brackets ([?]) and emoji (💡) for backward compatibility
      let lineType = type;

      // ASCII bracket detection (primary - terminal authentic)
      if (trimmed.startsWith('[?]') || trimmed.startsWith('[→]')) {
        lineType = 'info';      // Tips/Info/Educational → cyaan
      } else if (trimmed.startsWith('[!]')) {
        lineType = 'warning';   // Warnings/Legal → oranje
      } else if (trimmed.startsWith('[✓]')) {
        lineType = 'success';   // Success → groen
      } else if (trimmed.startsWith('[X]')) {
        lineType = 'error';     // Errors/Critical → magenta
      } else if (trimmed.startsWith('[~]')) {
        lineType = 'dim';       // Systeem notices → dim grijs
      } else if (trimmed.startsWith('→')) {
        lineType = 'info';      // FASE lines (bare arrow) → cyaan
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
      // Check for continuation line (6+ spaces inherit parent semantic color)
      else if (isContinuationLine(lineText)) {
        lineType = lastSemanticType; // Inherit previous line's color
      }

      // Update state for next line (only on non-empty lines)
      if (trimmed !== '') {
        lastSemanticType = lineType;
      }

      line.className = `terminal-line terminal-output terminal-output-${lineType}`;

      // Detect continuation lines and store indent level for CSS hanging indent (mobile)
      // Reuses isContinuationLine() detection, adds data attribute for mobile.css
      // See Sessie 84/85: Mobile Continuation Line Wrapping Fix
      if (isContinuationLine(lineText)) {
        const leadingSpaces = getLeadingSpaces(lineText);
        line.dataset.indent = leadingSpaces; // CSS uses this via attr(data-indent)
      }

      // Process special formatting
      const formattedContent = this._formatText(lineText);
      line.innerHTML = formattedContent;

      this.outputElement.appendChild(line);
    });

    this._trimOutput();

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
   * Render completion block with enhanced styling + celebration banner
   * Wraps output in .terminal-completion-block for visual distinction
   * @param {string} output - Completion output text
   * @param {string} celebrationTitle - Title shown in the flash banner
   */
  renderCompletionBlock(output, celebrationTitle) {
    if (!output) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'terminal-completion-block';

    const lines = output.split('\n');
    let lastSemanticType = 'info';

    lines.forEach(lineText => {
      const trimmed = lineText.trim();

      if (trimmed.startsWith('[###]')) {
        const header = document.createElement('div');
        header.className = 'section-header';
        header.textContent = trimmed;
        wrapper.appendChild(header);
        return;
      }

      if (trimmed.startsWith('[***]')) {
        const message = document.createElement('div');
        message.className = 'welcome-message';
        message.textContent = trimmed;
        wrapper.appendChild(message);
        return;
      }

      const line = document.createElement('div');
      let lineType = 'info';

      if (trimmed.startsWith('[?]') || trimmed.startsWith('[→]')) {
        lineType = 'info';
      } else if (trimmed.startsWith('[!]')) {
        lineType = 'warning';
      } else if (trimmed.startsWith('[✓]')) {
        lineType = 'success';
      } else if (trimmed.startsWith('[X]')) {
        lineType = 'error';
      } else if (trimmed.startsWith('[~]')) {
        lineType = 'dim';
      } else if (trimmed.startsWith('→')) {
        lineType = 'info';
      } else if (isContinuationLine(lineText)) {
        lineType = lastSemanticType;
      }

      if (trimmed !== '') {
        lastSemanticType = lineType;
      }

      line.className = `terminal-line terminal-output terminal-output-${lineType}`;

      if (isContinuationLine(lineText)) {
        const leadingSpaces = getLeadingSpaces(lineText);
        line.dataset.indent = leadingSpaces;
      }

      const formattedContent = this._formatText(lineText);
      line.innerHTML = formattedContent;

      wrapper.appendChild(line);
    });

    this.outputElement.appendChild(wrapper);
    this._trimOutput();
    this._scrollToBottom();

    if (celebrationTitle) {
      showCelebrationBanner(celebrationTitle);
    }
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
   * First visit: typewriter effect (line by line with delay)
   * Returning visit: instant render
   * @param {Object} onboarding - Onboarding instance (optional for backward compatibility)
   * @param {Object|null} stats - Progress stats from progressStore
   */
  renderWelcome(onboarding = null, stats = null) {
    if (onboarding) {
      const welcome = onboarding.getWelcomeMessage(stats);
      if (onboarding.isFirstTimeVisitor()) {
        this._renderTypewriter(welcome);
      } else {
        this.renderOutput(welcome, 'normal');
      }
    } else {
      const welcome = `Connecting to hacksim.lab... OK

[→] Type 'next' om te beginnen.`;
      this.renderOutput(welcome, 'normal');
    }
  }

  /**
   * Render text line-by-line with typewriter effect
   * First 2 lines render quickly (connection simulation),
   * remaining lines render at a steady pace
   * @private
   * @param {string} text - Full text to render
   */
  _renderTypewriter(text) {
    const lines = text.split('\n');
    let delay = 0;

    lines.forEach((line, index) => {
      // Context-aware delays for cinematic SSH login feel
      let lineDelay;
      if (index < 2) {
        lineDelay = 60;          // Connection handshake: fast
      } else if (line.trim() === '') {
        lineDelay = 300;         // Section breaks: dramatic pause
      } else if (line.trim().startsWith('→')) {
        lineDelay = 150;         // FASE lines: steady reveal
      } else {
        lineDelay = 120;         // Default: comfortable read pace
      }
      delay += lineDelay;

      setTimeout(() => {
        this.renderOutput(line, 'normal');
      }, delay);
    });

    // Dispatch event when typewriter is done (for input re-enable)
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('typewriter-done'));
    }, delay + 50);
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

    // Format markdown bold (mobile headers) - **text** → <strong>text</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Note: Emoji formatting removed - we now use ASCII brackets [?] [!] [✓] [X]
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
   * Trim output to prevent unbounded DOM growth
   * Removes oldest lines when exceeding MAX_OUTPUT_LINES
   * @private
   */
  _trimOutput() {
    if (this.outputElement && this.outputElement.children.length > MAX_OUTPUT_LINES) {
      while (this.outputElement.children.length > MAX_OUTPUT_LINES) {
        this.outputElement.removeChild(this.outputElement.firstChild);
      }
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

/**
 * Check if a line is a continuation of the previous semantic message
 * Continuation lines have 6+ leading spaces
 * @private
 * @param {string} lineText - Raw line text with spacing
 * @returns {boolean}
 */
function isContinuationLine(lineText) {
  // Normalize tabs to 4 spaces
  const normalized = lineText.replace(/\t/g, '    ');
  const leadingSpaces = normalized.match(/^(\s*)/)[1].length;
  const trimmed = lineText.trim();

  // Must have 3+ spaces AND non-empty content
  // Threshold lowered from 6 to 3 to include 4-space indents (GERELATEERDE COMMANDO'S sections)
  // See Sessie 84/85: Phase 3 - Mobile continuation line wrapping (all indents need hanging indent)
  return leadingSpaces >= 3 && trimmed.length > 0;
}

/**
 * Get number of leading spaces in a line (tabs normalized to 4 spaces)
 * Used for CSS hanging indent calculation on mobile
 * @private
 * @param {string} lineText - Raw line text with spacing
 * @returns {number} Number of leading spaces
 */
function getLeadingSpaces(lineText) {
  // Normalize tabs to 4 spaces (same as isContinuationLine)
  const normalized = lineText.replace(/\t/g, '    ');
  return normalized.match(/^(\s*)/)[1].length;
}

// Export as singleton
export default new Renderer();
