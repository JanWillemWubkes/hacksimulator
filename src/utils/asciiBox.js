import { getResponsiveBoxWidth } from "./box-utils.js";

function createBox(title, width) {
  if (title === undefined) title = null;
  if (width === undefined) width = getResponsiveBoxWidth();

  var chars = {
    topLeft: "┏", topRight: "┓",
    bottomLeft: "┗", bottomRight: "┛",
    horizontal: "━", vertical: "┃"
  };

  return {
    top: (function() {
      if (!title) return chars.topLeft + chars.horizontal.repeat(width) + chars.topRight;
      var label = '  ' + title.toUpperCase() + '  ';
      var remaining = width - label.length;
      var left = Math.floor(remaining / 2);
      var right = remaining - left;
      return chars.topLeft + chars.horizontal.repeat(left) + label + chars.horizontal.repeat(right) + chars.topRight;
    })(),
    bottom: chars.bottomLeft + chars.horizontal.repeat(width) + chars.bottomRight,
    wrap: function(text) {
      return text.split('\n').map(function(line) {
        var truncated = line.length > width ? line.slice(0, width - 3) + '...' : line;
        var padded = truncated.padEnd(width, ' ');
        return chars.vertical + padded + chars.vertical;
      }).join('\n');
    }
  };
}

export function boxText(text, title, width) {
  if (title === undefined) title = null;
  if (width === undefined) width = getResponsiveBoxWidth();
  var box = createBox(title, width);
  return box.top + '\n' + box.wrap(text) + '\n' + box.bottom;
}

export function boxHeader(title, width) {
  if (width === undefined) width = getResponsiveBoxWidth();
  var box = createBox(title, width);
  return box.top + '\n' + box.bottom;
}

function createLightBox(title, width) {
  if (title === undefined) title = null;
  if (width === undefined) width = getResponsiveBoxWidth();

  var chars = {
    topLeft: "╭", topRight: "╮",
    bottomLeft: "╰", bottomRight: "╯",
    horizontal: "─", vertical: "│"
  };

  return {
    top: (function() {
      if (!title) return chars.topLeft + chars.horizontal.repeat(width) + chars.topRight;
      var label = '  ' + title.toUpperCase() + '  ';
      var remaining = width - label.length;
      var left = Math.floor(remaining / 2);
      var right = remaining - left;
      return chars.topLeft + chars.horizontal.repeat(left) + label + chars.horizontal.repeat(right) + chars.topRight;
    })(),
    bottom: chars.bottomLeft + chars.horizontal.repeat(width) + chars.bottomRight,
    wrap: function(text) {
      return text.split('\n').map(function(line) {
        var truncated = line.length > width ? line.slice(0, width - 3) + '...' : line;
        var padded = truncated.padEnd(width, ' ');
        return chars.vertical + padded + chars.vertical;
      }).join('\n');
    }
  };
}

export function lightBoxText(text, title, width) {
  if (title === undefined) title = null;
  if (width === undefined) width = getResponsiveBoxWidth();
  var box = createLightBox(title, width);
  return box.top + '\n' + box.wrap(text) + '\n' + box.bottom;
}
