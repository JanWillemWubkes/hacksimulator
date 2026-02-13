import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView
} from "../../utils/box-utils.js";

const B = BOX_CHARS;

const shortcutGroups = [
  {
    category: "NAVIGATION",
    items: [
      { keys: "↑ / ↓", description: "Blader door geschiedenis" },
      { keys: "Tab", description: "Vul command aan" }
    ]
  },
  {
    category: "ZOEKEN",
    items: [
      { keys: "Ctrl+R", description: "Start geschiedenis zoeken" },
      { keys: "Ctrl+R (repeat)", description: "Volgende match" },
      { keys: "Enter", description: "Accepteer command" },
      { keys: "Esc / Ctrl+C", description: "Annuleer zoeken" }
    ]
  },
  {
    category: "TERMINAL",
    items: [
      { keys: "Ctrl+L", description: "Maak scherm leeg" },
      { keys: "Ctrl+C", description: "Annuleer input" },
      { keys: "Enter", description: "Voer command uit" }
    ]
  }
];

function buildEmptyLine(width) {
  var inner = width - 2;
  return B.vertical + ' '.repeat(inner) + B.vertical;
}

function buildMobileOutput() {
  var out = '\n**KEYBOARD SHORTCUTS**\n\n';
  shortcutGroups.forEach(function(group) {
    out += '**' + group.category + '**\n';
    group.items.forEach(function(item) {
      out += '  ' + item.keys + ' - ' + item.description + '\n';
    });
    out += '\n';
  });
  out += '[?] These shortcuts work like real Linux terminals\n';
  out += '[!] Mobile: Use Tab for autocomplete\n';
  return out;
}

export default {
  name: "shortcuts",
  description: "Toon keyboard shortcuts",
  category: "system",

  execute() {
    if (isMobileView()) return buildMobileOutput();

    // Calculate width ONCE and thread through
    var width = getResponsiveBoxWidth();
    var inner = width - 2;
    var lines = [];

    // Header: ╭──── KEYBOARD SHORTCUTS ────╮
    var label = ' KEYBOARD SHORTCUTS ';
    var remaining = inner - label.length;
    var leftPad = Math.floor(remaining / 2);
    var rightPad = remaining - leftPad;
    lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

    lines.push(buildEmptyLine(width));

    shortcutGroups.forEach(function(group, idx) {
      // Category header
      var catText = '  ' + group.category;
      var catPad = inner - catText.length;
      lines.push(B.vertical + catText + ' '.repeat(catPad) + B.vertical);

      // Shortcut items
      group.items.forEach(function(item) {
        var rowText = '  ' + item.keys.padEnd(16) + ' ' + item.description;
        var rowPad = inner - rowText.length;
        lines.push(B.vertical + rowText + ' '.repeat(Math.max(0, rowPad)) + B.vertical);
      });

      if (idx < shortcutGroups.length - 1) {
        lines.push(buildEmptyLine(width));
      }
    });

    lines.push(buildEmptyLine(width));

    // Footer
    lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

    lines.push('');
    lines.push('[?] TIP: Deze shortcuts werken net als in echte Linux terminals!');

    return lines.join('\n');
  },

  manPage: "\nNAAM\n    shortcuts - toon keyboard shortcuts\n\nSYNOPSIS\n    shortcuts\n\nBESCHRIJVING\n    Toont een overzicht van alle beschikbare keyboard shortcuts.\n    Deze shortcuts zijn geïnspireerd op echte Linux/Bash terminals.\n\n    NAVIGATION\n        ↑ / ↓        Blader door command geschiedenis\n        Tab          Vul command aan (autocomplete)\n\n    ZOEKEN\n        Ctrl+R       Start geschiedenis zoeken (reverse-i-search)\n                     Net als in Bash - type deel van command\n                     en druk Ctrl+R opnieuw om door matches te cyclen\n        Enter        Accepteer geselecteerde command\n        Esc/Ctrl+C   Annuleer zoekmode\n\n    TERMINAL\n        Ctrl+L       Maak scherm leeg (clear screen)\n                     Standaard terminal shortcut - maakt output leeg\n                     zonder je geschiedenis te verwijderen\n        Ctrl+C       Annuleer huidige input\n        Enter        Voer command uit\n\nVOORBEELDEN\n    shortcuts\n        Toon alle shortcuts\n\n    Type Ctrl+R en begin te typen om door je command geschiedenis\n    te zoeken. Druk Ctrl+R opnieuw om door matches te cyclen.\n\nGERELATEERDE COMMANDO'S\n    help (alle commands), history (command geschiedenis)\n".trim()
};
