/**
 * ASCII Box Utility
 * Creates terminal-authentic ASCII boxes for man pages and command output
 */

/**
 * Create an ASCII box with optional header
 * @param {string} header - Optional header text (e.g., command name)
 * @param {number} width - Box width in characters (default: 60)
 * @returns {object} Box drawing characters and methods
 */
export function createBox(header = null, width = 60) {
  // Box drawing characters (UTF-8)
  const chars = {
    topLeft: '┏',
    topRight: '┓',
    bottomLeft: '┗',
    bottomRight: '┛',
    horizontal: '━',
    vertical: '┃'
  };

  /**
   * Create top border with optional header
   */
  function createTop() {
    if (!header) {
      return chars.topLeft + chars.horizontal.repeat(width) + chars.topRight;
    }

    // Center header in top border
    const headerText = `  ${header.toUpperCase()}  `;
    const padding = width - headerText.length;
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;

    return (
      chars.topLeft +
      chars.horizontal.repeat(leftPad) +
      headerText +
      chars.horizontal.repeat(rightPad) +
      chars.topRight
    );
  }

  /**
   * Create bottom border
   */
  function createBottom() {
    return chars.bottomLeft + chars.horizontal.repeat(width) + chars.bottomRight;
  }

  /**
   * Wrap text in box with vertical borders
   * @param {string} content - Content to wrap
   */
  function wrapContent(content) {
    const lines = content.split('\n');
    return lines
      .map(line => {
        // Truncate if too long (prevent overflow)
        const truncated = line.length > width ? line.slice(0, width - 3) + '...' : line;
        const padded = truncated.padEnd(width, ' ');
        return `${chars.vertical}${padded}${chars.vertical}`;
      })
      .join('\n');
  }

  return {
    top: createTop(),
    bottom: createBottom(),
    wrap: wrapContent
  };
}

/**
 * Create a complete ASCII box around content
 * @param {string} content - Content to box
 * @param {string} header - Optional header text
 * @param {number} width - Box width (default: 60)
 * @returns {string} Complete boxed content
 */
export function boxText(content, header = null, width = 60) {
  const box = createBox(header, width);
  return `${box.top}\n${box.wrap(content)}\n${box.bottom}`;
}

/**
 * Create a header-only box (no content wrapping)
 * Useful for man page titles
 * @param {string} header - Header text
 * @param {number} width - Box width (default: 60)
 * @returns {string} Box with header
 */
export function boxHeader(header, width = 60) {
  const box = createBox(header, width);
  return `${box.top}\n${box.bottom}`;
}

/**
 * Create a light rounded box (for educational content, tips, info)
 * @param {string} header - Optional header text
 * @param {number} width - Box width in characters (default: 60)
 * @returns {object} Light box drawing characters and methods
 */
export function createLightBox(header = null, width = 60) {
  // Light rounded box drawing characters (UTF-8)
  const chars = {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│'
  };

  /**
   * Create top border with optional header
   */
  function createTop() {
    if (!header) {
      return chars.topLeft + chars.horizontal.repeat(width) + chars.topRight;
    }

    // Center header in top border
    const headerText = `  ${header.toUpperCase()}  `;
    const padding = width - headerText.length;
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;

    return (
      chars.topLeft +
      chars.horizontal.repeat(leftPad) +
      headerText +
      chars.horizontal.repeat(rightPad) +
      chars.topRight
    );
  }

  /**
   * Create bottom border
   */
  function createBottom() {
    return chars.bottomLeft + chars.horizontal.repeat(width) + chars.bottomRight;
  }

  /**
   * Wrap text in box with vertical borders
   * @param {string} content - Content to wrap
   */
  function wrapContent(content) {
    const lines = content.split('\n');
    return lines
      .map(line => {
        // Truncate if too long (prevent overflow)
        const truncated = line.length > width ? line.slice(0, width - 3) + '...' : line;
        const padded = truncated.padEnd(width, ' ');
        return `${chars.vertical}${padded}${chars.vertical}`;
      })
      .join('\n');
  }

  return {
    top: createTop(),
    bottom: createBottom(),
    wrap: wrapContent
  };
}

/**
 * Create a complete light rounded box around content
 * Use for educational tips, info blocks, progress reports (friendly tone)
 * @param {string} content - Content to box
 * @param {string} header - Optional header text
 * @param {number} width - Box width (default: 60)
 * @returns {string} Complete boxed content with light borders
 */
export function lightBoxText(content, header = null, width = 60) {
  const box = createLightBox(header, width);
  return `${box.top}\n${box.wrap(content)}\n${box.bottom}`;
}
