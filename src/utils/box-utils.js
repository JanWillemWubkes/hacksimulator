export const BOX_CHARS = {
  topLeft: "╭",
  topRight: "╮",
  bottomLeft: "╰",
  bottomRight: "╯",
  horizontal: "─",
  vertical: "│",
  dividerLeft: "├",
  dividerRight: "┤"
};

// --- Character width measurement with Canvas API ---
let _charWidthCache = null;
let _charWidthCacheKey = '';

function measureCharWidth() {
  const container = document.getElementById('terminal-container');
  if (!container) return 9.6; // safe fallback

  const style = getComputedStyle(container);
  const fontSize = style.fontSize || '16px';
  const fontFamily = style.fontFamily || 'monospace';
  const cacheKey = fontSize + '|' + fontFamily;

  if (_charWidthCacheKey === cacheKey && _charWidthCache !== null) {
    return _charWidthCache;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = fontSize + ' ' + fontFamily;
  // Measure 'M' - reliable monospace reference character
  const width = ctx.measureText('M').width;

  _charWidthCache = width;
  _charWidthCacheKey = cacheKey;
  return width;
}

function invalidateCharWidthCache() {
  _charWidthCache = null;
  _charWidthCacheKey = '';
}

// Invalidate cache on font load and viewport resize
if (typeof document !== 'undefined') {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() { invalidateCharWidthCache(); });
  }
  let _resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(invalidateCharWidthCache, 150);
  });
}

/**
 * Calculate the maximum number of monospace characters that fit
 * in the terminal container, using pixel-accurate Canvas measurement.
 * Returns a value between 30 and 120.
 */
export function getResponsiveBoxWidth() {
  if (typeof window === 'undefined' || !document.getElementById('terminal-container')) return 48;

  const container = document.getElementById('terminal-container');
  // clientWidth excludes scrollbar, unlike offsetWidth
  const clientW = container.clientWidth;
  const style = getComputedStyle(container);
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const paddingRight = parseFloat(style.paddingRight) || 0;
  const availablePixels = clientW - paddingLeft - paddingRight;

  const charWidth = measureCharWidth();
  // Subtract 2 characters safety margin for subpixel rounding
  const maxChars = Math.floor(availablePixels / charWidth) - 2;

  // Clamp between 30 (minimum readable) and 120 (max useful)
  return Math.max(30, Math.min(120, maxChars));
}

export function isMobileView() {
  if (typeof window === 'undefined') return false;
  const narrow = window.innerWidth < 768;
  const toggle = document.querySelector('.navbar-toggle');
  const toggleVisible = toggle && getComputedStyle(toggle).display !== 'none';
  return narrow || toggleVisible;
}

export function smartTruncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  const cutoff = maxLen - 3;
  let truncated = text.substring(0, cutoff);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

export function wordWrap(text, maxLen) {
  if (!text || text.length === 0) return [''];
  if (maxLen < 10) maxLen = 10;

  const words = text.split(' ');
  const lines = [];
  let current = '';

  words.forEach(function(word) {
    if (word.length > maxLen) {
      if (current) lines.push(current.trim());
      lines.push(word.substring(0, maxLen - 3) + '...');
      current = '';
      return;
    }
    const test = current ? current + ' ' + word : word;
    if (test.length <= maxLen) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  });

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}
