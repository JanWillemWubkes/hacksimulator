/**
 * Command Search Modal
 *
 * Provides a searchable modal for browsing and selecting commands.
 * Supports keyboard navigation and filtering by command name/description.
 *
 * @module command-search-modal
 */

// Import FocusTrap if using ES modules, otherwise it's loaded globally
// import FocusTrap from './focus-trap.js';

window.CommandSearchModal = class {
  /**
   * @param {Object} registry - Command registry instance
   */
  constructor(registry) {
    this.registry = registry;
    this.searchStrategy = new window.SimpleFilterStrategy();
    this.overlay = null;
    this.modal = null;
    this.searchInput = null;
    this.resultsContainer = null;
    this.closeButton = null;
    this.cancelButton = null;
    this.isOpen = false;
    this.selectedIndex = 0;
    this.filteredCommands = [];
    this.allCommands = [];
    this.categoryOrder = ['system', 'filesystem', 'network', 'security', 'special'];
    this._previousFocus = null;
  }

  /**
   * Initialize the modal
   */
  init() {
    this.overlay = document.getElementById('command-search-modal-overlay');
    this.modal = document.querySelector('.modal-content.command-search-modal');
    this.searchInput = document.getElementById('command-search-input');
    this.resultsContainer = document.getElementById('command-search-results');
    this.closeButton = this.modal.querySelector('.modal-close');
    this.cancelButton = document.getElementById('command-search-cancel');

    if (!this.overlay || !this.searchInput || !this.resultsContainer) {
      console.error('CommandSearchModal: Required DOM elements not found');
      return;
    }

    // Add aria-label for accessibility
    this.searchInput.setAttribute('aria-label', 'Zoek commands');
    this.searchInput.setAttribute('aria-autocomplete', 'list');
    this.searchInput.setAttribute('aria-controls', 'command-search-results');

    this.loadAllCommands();
    this.attachEventListeners();
    console.log('CommandSearchModal initialized');
  }

  /**
   * Load all commands from registry
   */
  loadAllCommands() {
    this.allCommands = [];

    this.registry.list().forEach((name) => {
      const cmd = this.registry.get(name);
      if (cmd) {
        this.allCommands.push({
          name: name,
          description: cmd.description || 'No description',
          category: cmd.category || 'other',
          usage: cmd.usage || name
        });
      }
    });

    // Sort by category order, then alphabetically
    this.allCommands.sort((a, b) => {
      const catDiff = this.categoryOrder.indexOf(a.category) - this.categoryOrder.indexOf(b.category);
      if (catDiff !== 0) return catDiff;
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Search input events
    this.searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    this.searchInput.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });

    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }

    // Cancel button
    if (this.cancelButton) {
      this.cancelButton.addEventListener('click', () => this.close());
    }

    // Click outside to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Prevent clicks inside modal from closing
    this.modal.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /**
   * Open the modal
   */
  open() {
    // Save current focus for restoration
    this._previousFocus = document.activeElement;

    this.isOpen = true;
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');

    // Reset state
    this.searchInput.value = '';
    this.selectedIndex = 0;
    this.filteredCommands = [...this.allCommands];

    this.render();

    // Focus search input after small delay for animation
    setTimeout(() => {
      this.searchInput.focus();
    }, 100);
  }

  /**
   * Close the modal
   */
  close() {
    this.isOpen = false;
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');

    // Restore previous focus
    if (this._previousFocus && this._previousFocus.focus) {
      this._previousFocus.focus();
    } else {
      // Fallback to terminal input
      const terminalInput = document.getElementById('terminal-input');
      if (terminalInput) {
        terminalInput.focus();
      }
    }
  }

  /**
   * Handle search input
   * @param {string} query - Search query
   */
  handleSearch(query) {
    this.filteredCommands = this.searchStrategy.search(query, this.allCommands);
    this.selectedIndex = 0;
    this.render();
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e
   */
  handleKeyboard(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.moveSelection(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.moveSelection(-1);
        break;
      case 'Enter':
        e.preventDefault();
        this.selectCommand();
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
      case 'Tab':
        // Trap Tab within modal
        e.preventDefault();
        if (e.shiftKey) {
          // Focus cancel button if exists, otherwise stay on input
          if (this.cancelButton) {
            this.cancelButton.focus();
          }
        } else {
          // Focus first result or cancel button
          const firstResult = this.resultsContainer.querySelector('.command-item');
          if (firstResult) {
            firstResult.focus();
          } else if (this.cancelButton) {
            this.cancelButton.focus();
          }
        }
        break;
    }
  }

  /**
   * Move selection up or down
   * @param {number} direction - 1 for down, -1 for up
   */
  moveSelection(direction) {
    const maxIndex = this.filteredCommands.length - 1;
    this.selectedIndex += direction;

    if (this.selectedIndex < 0) {
      this.selectedIndex = 0;
    }
    if (this.selectedIndex > maxIndex) {
      this.selectedIndex = maxIndex;
    }

    this.updateSelection();
    this.scrollSelectedIntoView();
  }

  /**
   * Update visual selection state
   */
  updateSelection() {
    const items = this.resultsContainer.querySelectorAll('.command-item');
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('selected');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('selected');
        item.setAttribute('aria-selected', 'false');
      }
    });
  }

  /**
   * Scroll selected item into view
   */
  scrollSelectedIntoView() {
    const selected = this.resultsContainer.querySelector('.command-item.selected');
    if (selected) {
      selected.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  /**
   * Select the currently highlighted command
   */
  selectCommand() {
    if (this.filteredCommands.length === 0) return;

    const command = this.filteredCommands[this.selectedIndex];
    if (command) {
      this.insertCommandInTerminal(command.name);
    }
  }

  /**
   * Insert command into terminal input
   * @param {string} commandName - Command to insert
   */
  insertCommandInTerminal(commandName) {
    const terminalInput = document.getElementById('terminal-input');
    if (terminalInput) {
      terminalInput.value = commandName;
      this.close();
      terminalInput.focus();
      terminalInput.setSelectionRange(commandName.length, commandName.length);
    }
  }

  /**
   * Render the results
   */
  render() {
    if (this.filteredCommands.length === 0) {
      this.renderEmpty();
      return;
    }

    const grouped = this.groupByCategory(this.filteredCommands);
    let html = '';

    this.categoryOrder.forEach((category) => {
      const commands = grouped[category];
      if (commands && commands.length > 0) {
        html += this.renderCategory(category, commands);
      }
    });

    this.resultsContainer.innerHTML = html;
    this.attachCommandClickHandlers();
    this.updateSelection();
  }

  /**
   * Group commands by category
   * @param {Array} commands
   * @returns {Object}
   */
  groupByCategory(commands) {
    const grouped = {};
    commands.forEach((cmd) => {
      if (!grouped[cmd.category]) {
        grouped[cmd.category] = [];
      }
      grouped[cmd.category].push(cmd);
    });
    return grouped;
  }

  /**
   * Render a category section
   * @param {string} category
   * @param {Array} commands
   * @returns {string}
   */
  renderCategory(category, commands) {
    let html = `
      <div class="command-category" role="group" aria-label="${this.formatCategoryName(category)} commands">
        <h3 class="command-category-header">${this.formatCategoryName(category)} (${commands.length})</h3>
    `;

    commands.forEach((cmd) => {
      const globalIndex = this.filteredCommands.indexOf(cmd);
      html += this.renderCommandItem(cmd, globalIndex);
    });

    html += '</div>';
    return html;
  }

  /**
   * Render a single command item
   * @param {Object} cmd
   * @param {number} index
   * @returns {string}
   */
  renderCommandItem(cmd, index) {
    return `
      <div class="command-item"
           data-command="${cmd.name}"
           data-index="${index}"
           role="option"
           aria-selected="false"
           tabindex="-1">
        <span class="command-item-name">${cmd.name}</span>
        <span class="command-item-description">- ${cmd.description}</span>
      </div>
    `;
  }

  /**
   * Render empty state
   */
  renderEmpty() {
    this.resultsContainer.innerHTML = `
      <div class="command-search-empty" role="status">
        <div class="command-search-empty-icon">?</div>
        <div class="command-search-empty-text">
          Geen commands gevonden<br>
          <small>Probeer een andere zoekterm</small>
        </div>
      </div>
    `;
  }

  /**
   * Format category name for display
   * @param {string} category
   * @returns {string}
   */
  formatCategoryName(category) {
    const names = {
      system: 'SYSTEM',
      filesystem: 'FILESYSTEM',
      network: 'NETWORK',
      security: 'SECURITY',
      special: 'SPECIAL'
    };
    return names[category] || category.toUpperCase();
  }

  /**
   * Attach click handlers to command items
   */
  attachCommandClickHandlers() {
    const items = this.resultsContainer.querySelectorAll('.command-item');
    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.selectedIndex = index;
        this.selectCommand();
      });

      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });

      // Allow keyboard selection when focused
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.selectCommand();
        }
      });
    });
  }
};
