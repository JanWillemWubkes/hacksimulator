import { getResponsiveBoxWidth, wordWrap, isMobileView } from "./box-utils.js";

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
      // Smal scherm: titel breder dan de box → afkappen zodat repeat() geen
      // negatieve count krijgt (anders RangeError). Randbreedte blijft width+2.
      if (label.length > width) label = label.slice(0, width);
      var remaining = width - label.length;
      var left = Math.floor(remaining / 2);
      var right = remaining - left;
      return chars.topLeft + chars.horizontal.repeat(left) + label + chars.horizontal.repeat(right) + chars.topRight;
    })(),
    bottom: chars.bottomLeft + chars.horizontal.repeat(width) + chars.bottomRight,
    wrap: function(text) {
      var rows = [];
      text.split('\n').forEach(function(line) {
        if (line.length <= width) {
          // Past al: verbatim laten (behoudt inspringing/uitlijning, incl. desktop)
          rows.push(chars.vertical + line.padEnd(width, ' ') + chars.vertical);
        } else {
          // Te breed: woord-wrappen i.p.v. afkappen, zodat geen (waarschuwings)tekst
          // wegvalt op smalle schermen (bv. de SECURITY WARNING-box op mobiel).
          wordWrap(line, width).forEach(function(w) {
            rows.push(chars.vertical + w.padEnd(width, ' ') + chars.vertical);
          });
        }
      });
      return rows.join('\n');
    }
  };
}

export function boxText(text, title, width) {
  if (title === undefined) title = null;
  if (width === undefined) width = getResponsiveBoxWidth();
  // Mobiel: geen box-drawing (Sessie 82) — de subset-glyphs (JetBrains Mono Box)
  // renderen op Android breder dan de latin-tekst, waardoor de rand niet uitlijnt
  // met de body en over de containerbreedte breekt. Borderless markdown-header
  // (zelfde conventie als man.js op mobiel) → alleen latin-glyphs → lijnt uit.
  if (isMobileView()) {
    return (title ? '**' + title.toUpperCase() + '**\n\n' : '') + text;
  }
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
      // Smal scherm: titel breder dan de box → afkappen zodat repeat() geen
      // negatieve count krijgt (anders RangeError). Randbreedte blijft width+2.
      if (label.length > width) label = label.slice(0, width);
      var remaining = width - label.length;
      var left = Math.floor(remaining / 2);
      var right = remaining - left;
      return chars.topLeft + chars.horizontal.repeat(left) + label + chars.horizontal.repeat(right) + chars.topRight;
    })(),
    bottom: chars.bottomLeft + chars.horizontal.repeat(width) + chars.bottomRight,
    wrap: function(text) {
      var rows = [];
      text.split('\n').forEach(function(line) {
        if (line.length <= width) {
          // Past al: verbatim laten (behoudt inspringing/uitlijning, incl. desktop)
          rows.push(chars.vertical + line.padEnd(width, ' ') + chars.vertical);
        } else {
          // Te breed: woord-wrappen i.p.v. afkappen, zodat geen (waarschuwings)tekst
          // wegvalt op smalle schermen (bv. de SECURITY WARNING-box op mobiel).
          wordWrap(line, width).forEach(function(w) {
            rows.push(chars.vertical + w.padEnd(width, ' ') + chars.vertical);
          });
        }
      });
      return rows.join('\n');
    }
  };
}

export function lightBoxText(text, title, width) {
  if (title === undefined) title = null;
  if (width === undefined) width = getResponsiveBoxWidth();
  var box = createLightBox(title, width);
  return box.top + '\n' + box.wrap(text) + '\n' + box.bottom;
}
