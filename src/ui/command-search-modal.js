/**
 * Command Search Modal
 * Phase 1 MVP: Command discovery through search interface
 *
 * Features:
 * - Real-time search (name + description + category)
 * - Grouped display by category
 * - Click to insert command in terminal
 * - Keyboard navigation (↑↓ Enter Esc)
 * - Mobile responsive
 *
 * Architecture:
 * - Uses enterprise 3-layer modal pattern (Sessie 33)
 * - Focus management respects modal state
 * - Keyboard navigation similar to Ctrl+R (Sessie 34)
 */

class CommandSearchModal {
  constructor(registry) {
    this.registry = registry;
    this.searchStrategy = new window.SimpleFilterStrategy();

    // UI elements
    this.overlay = null;
    this.modal = null;
    this.searchInput = null;
    this.resultsContainer = null;
    this.closeButton = null;
    this.cancelButton = null;

    // State
    this.isOpen = false;
    this.selectedIndex = 0;
    this.filteredCommands = [];
    this.allCommands = [];

    // Category order for display
    this.categoryOrder = ['system', 'filesystem', 'network', 'security', 'special'];
  }

  /**
   * Initialize modal - attach event listeners
   */
  init() {
    // Get UI elements
    this.overlay = document.getElementById('command-search-modal-overlay');
    this.modal = document.querySelector('.command-search-modal');
    this.searchInput = document.getElementById('command-search-input');
    this.resultsContainer = document.getElementById('command-search-results');
    this.closeButton = document.querySelector('.command-search-modal-header .modal-close');
    this.cancelButton = document.getElementById('command-search-cancel');

    if (!this.overlay || !this.searchInput || !this.resultsContainer) {
      console.error('CommandSearchModal: Required DOM elements not found');
      return;
    }

    // Load all commands
    this.loadAllCommands();

    // Attach event listeners
    this.attachEventListeners();

    console.log('CommandSearchModal initialized');
  }

  /**
   * Load all commands from registry with metadata
   */
  loadAllCommands() {
    this.allCommands = [];

    const commandNames = this.registry.list();

    commandNames.forEach(name => {
      const handler = this.registry.get(name);
      if (handler) {
        this.allCommands.push({
          name: name,
          description: handler.description || 'No description',
          category: handler.category || 'other',
          usage: handler.usage || name
        });
      }
    });

    // Sort by category, then by name
    this.allCommands.sort((a, b) => {
      const catCompare = this.categoryOrder.indexOf(a.category) -
                        this.categoryOrder.indexOf(b.category);
      if (catCompare !== 0) return catCompare;
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Attach all event listeners
   */
  attachEventListeners() {
    // Search input - real-time filtering
    this.searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    // Search input - keyboard navigation
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

    // Click overlay to close
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
   * Open modal
   */
  open() {
    this.isOpen = true;
    this.overlay.classList.add('active');

    // Reset state
    this.searchInput.value = '';
    this.selectedIndex = 0;

    // Show all commands initially
    this.filteredCommands = [...this.allCommands];
    this.render();

    // Focus search input
    setTimeout(() => {
      this.searchInput.focus();
    }, 100);
  }

  /**
   * Close modal
   */
  close() {
    this.isOpen = false;
    this.overlay.classList.remove('active');

    // Restore terminal focus
    const terminalInput = document.getElementById('terminal-input');
    if (terminalInput) {
      terminalInput.focus();
    }
  }

  /**
   * Handle search input
   * @param {string} term - Search term
   */
  handleSearch(term) {
    // Use search strategy to filter commands
    this.filteredCommands = this.searchStrategy.search(term, this.allCommands);

    // Reset selection
    this.selectedIndex = 0;

    // Re-render
    this.render();
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event
   */
  handleKeyboard(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveSelection(1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.moveSelection(-1);
        break;

      case 'Enter':
        event.preventDefault();
        this.selectCommand();
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  /**
   * Move selection up/down
   * @param {number} direction - 1 for down, -1 for up
   */
  moveSelection(direction) {
    const maxIndex = this.filteredCommands.length - 1;

    // Calculate new index
    this.selectedIndex += direction;

    // Clamp to bounds
    if (this.selectedIndex < 0) this.selectedIndex = 0;
    if (this.selectedIndex > maxIndex) this.selectedIndex = maxIndex;

    // Update UI
    this.updateSelection();
    this.scrollSelectedIntoView();
  }

  /**
   * Update visual selection
   */
  updateSelection() {
    const items = this.resultsContainer.querySelectorAll('.command-item');

    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }

  /**
   * Scroll selected item into view
   */
  scrollSelectedIntoView() {
    const selectedItem = this.resultsContainer.querySelector('.command-item.selected');
    if (selectedItem) {
      selectedItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  /**
   * Select currently highlighted command (Enter key or click)
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
    if (!terminalInput) return;

    // Insert command (user presses Enter themselves - educational pattern)
    terminalInput.value = commandName;

    // Close modal
    this.close();

    // Focus terminal
    terminalInput.focus();

    // Position cursor at end
    terminalInput.setSelectionRange(commandName.length, commandName.length);
  }

  /**
   * Render command list grouped by category
   */
  render() {
    if (this.filteredCommands.length === 0) {
      this.renderEmpty();
      return;
    }

    // Group commands by category
    const grouped = this.groupByCategory(this.filteredCommands);

    let html = '';

    // Render each category
    this.categoryOrder.forEach(category => {
      const commands = grouped[category];
      if (!commands || commands.length === 0) return;

      html += this.renderCategory(category, commands);
    });

    this.resultsContainer.innerHTML = html;

    // Attach click handlers to command items
    this.attachCommandClickHandlers();

    // Update selection (highlight first item)
    this.updateSelection();
  }

  /**
   * Group commands by category
   * @param {Array} commands - Commands to group
   * @returns {Object} Grouped commands
   */
  groupByCategory(commands) {
    const grouped = {};

    commands.forEach(cmd => {
      if (!grouped[cmd.category]) {
        grouped[cmd.category] = [];
      }
      grouped[cmd.category].push(cmd);
    });

    return grouped;
  }

  /**
   * Render a category section
   * @param {string} category - Category name
   * @param {Array} commands - Commands in category
   * @returns {string} HTML string
   */
  renderCategory(category, commands) {
    const categoryName = this.formatCategoryName(category);
    const count = commands.length;

    let html = `
      <div class="command-category">
        <h3 class="command-category-header">${categoryName} (${count})</h3>
    `;

    commands.forEach((cmd, index) => {
      const globalIndex = this.filteredCommands.indexOf(cmd);
      html += this.renderCommandItem(cmd, globalIndex);
    });

    html += '</div>';

    return html;
  }

  /**
   * Render a single command item
   * @param {Object} cmd - Command object
   * @param {number} index - Global index in filtered list
   * @returns {string} HTML string
   */
  renderCommandItem(cmd, index) {
    return `
      <div class="command-item" data-command="${cmd.name}" data-index="${index}">
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
      <div class="command-search-empty">
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
   * @param {string} category - Category name
   * @returns {string} Formatted name
   */
  formatCategoryName(category) {
    const names = {
      'system': 'SYSTEM',
      'filesystem': 'FILESYSTEM',
      'network': 'NETWORK',
      'security': 'SECURITY',
      'special': 'SPECIAL'
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

      // Hover updates selection
      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });
    });
  }
}

// Export to window for global access
window.CommandSearchModal = CommandSearchModal;
