import registry from "../../core/registry.js";
import { lightBoxText } from "../../utils/asciiBox.js";
import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  smartTruncate,
  isMobileView,
  wordWrap
} from "../../utils/box-utils.js";

const B = BOX_CHARS;

const categoryDescriptions = {
  system: "Deze tools helpen je de terminal te gebruiken en je huidige sessie te beheren.",
  filesystem: "Deze tools laten je bestanden en mappen organiseren, net als in een grafische verkenner.",
  network: "Deze tools scannen netwerken en verzamelen informatie over servers en open poorten.",
  security: "Deze tools testen de beveiliging van systemen - gebruik ze alleen ethisch!",
  special: "Speciale commands om de simulator te resetten of configureren."
};

function buildDivider(width) {
  var inner = width - 2;
  return B.dividerLeft + B.horizontal.repeat(inner) + B.dividerRight;
}

function buildCategoryBox(categoryName, commands, width) {
  var count = commands.length;
  var inner = width - 2;
  var output = '';

  // Header: ╭──── CATEGORY (N) ────╮
  var label = ' ' + categoryName.toUpperCase() + ' (' + count + ') ';
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  output += B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight + '\n';

  // Column header: │ COMMAND         DESCRIPTION │
  var colHeader = ' ' + 'COMMAND'.padEnd(15) + ' DESCRIPTION';
  var colPadding = inner - colHeader.length;
  output += B.vertical + colHeader + ' '.repeat(colPadding) + B.vertical + '\n';

  // Divider
  output += buildDivider(width) + '\n';

  // Category description (word-wrapped)
  var desc = categoryDescriptions[categoryName.toLowerCase()] || "Commands in de '" + categoryName + "' categorie.";
  var wrappedDesc = wordWrap(desc, inner - 2);
  wrappedDesc.forEach(function(line) {
    var padded = (' ' + line).padEnd(inner);
    output += B.vertical + padded + B.vertical + '\n';
  });
  output += buildDivider(width) + '\n';

  // Command rows
  commands.forEach(function(cmd) {
    var descWidth = inner - 15 - 2;
    var row = ' ' + cmd.name.padEnd(15) + ' ' + smartTruncate(cmd.description, descWidth);
    output += B.vertical + row.padEnd(inner) + B.vertical + '\n';
  });

  // Footer: ╰──────────────────────╯
  output += B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight;

  return output;
}

export default {
  name: "help",
  description: "Toon beschikbare commands",
  category: "system",
  usage: "help [category]",
  completionProvider: function(n) { return registry.getCategories(); },

  execute(args, flags, context) {
    var reg = context.terminal.getRegistry();

    // Mobile: plain text (no boxes)
    if (isMobileView()) {
      if (args.length > 0) {
        var cat = args[0].toLowerCase();
        var cmds = reg.getByCategory(cat);
        if (cmds.length === 0) return "Geen commands in '" + cat + "'.\n\n[?] Type 'help' voor alle categorieën.";
        var out = '\n**' + cat.toUpperCase() + '** (' + cmds.length + ')\n\n';
        cmds.forEach(function(c) { out += '  ' + c.name + ' - ' + c.description + '\n'; });
        return out;
      }
      var cats = reg.getCategories();
      var grouped = {};
      cats.forEach(function(c) { grouped[c] = reg.getByCategory(c); });
      return buildMobileHelp(grouped);
    }

    // Desktop: calculate width ONCE
    var width = getResponsiveBoxWidth();

    if (args.length > 0) {
      var cat = args[0].toLowerCase();
      var cmds = reg.getByCategory(cat);
      if (cmds.length === 0) return "Geen commands gevonden in categorie '" + cat + "'.\n\n[?] TIP: Type 'help' voor alle categorieën.";
      var out = "Commands in categorie '" + cat + "':\n\n";
      out += buildCategoryBox(cat, cmds, width);
      return out;
    }

    var categories = reg.getCategories();
    var result = "Beschikbare commands:\n\n";
    result += "[!] Real hackers beginnen met SYSTEM & FILESYSTEM basics, dan NETWORK scanning, en uiteindelijk SECURITY tools.\n\n";

    categories.forEach(function(cat) {
      var cmds = reg.getByCategory(cat);
      if (cmds.length > 0) {
        result += buildCategoryBox(cat, cmds, width) + '\n\n';
      }
    });

    // Tip box: pass (width - 2) as inner width so total matches category boxes
    var tipText = '• man <command> → Gedetailleerde uitleg van een tool\n'
      + '• ↑↓ keys → Navigeer door command geschiedenis\n'
      + '• Tab → Autocomplete (bijv. "nm" + Tab → "nmap")\n'
      + '• shortcuts → Toon alle keyboard shortcuts';
    result += lightBoxText(tipText, 'TIP: NAVIGATIE & SHORTCUTS', width - 2);

    return result;
  },

  manPage: "\nNAAM\n    help - toon beschikbare commands\n\nSYNOPSIS\n    help [CATEGORY]\n\nBESCHRIJVING\n    Toont een overzicht van alle beschikbare commands, gegroepeerd per\n    categorie. Optioneel kun je een specifieke categorie opvragen.\n\nARGUMENTEN\n    CATEGORY (optioneel)\n        Categorienaam: system, filesystem, network, security, special\n\nVOORBEELDEN\n    help\n        Toon alle commands\n\n    help filesystem\n        Toon alleen filesystem commands\n\nCATEGORIEËN\n    • system       → Basis terminal commands\n    • filesystem   → Bestanden en directories\n    • network      → Netwerk analyse tools\n    • security     → Security testing tools\n    • special      → Speciale commands (reset)\n\nGERELATEERDE COMMANDO'S\n    man <command> (gedetailleerde help voor specifiek command)\n".trim()
};

function buildMobileHelp(grouped) {
  var out = '\n**HELP**\n\n';
  Object.entries(grouped).forEach(function(entry) {
    var cat = entry[0];
    var cmds = entry[1];
    if (cmds.length > 0) {
      out += '**' + cat.toUpperCase() + '** (' + cmds.length + ')\n';
      cmds.forEach(function(c) { out += '  ' + c.name + ' - ' + c.description + '\n'; });
      out += '\n';
    }
  });
  out += '[?] Type "man <command>" for details\n';
  out += '[!] Real hackers: start with SYSTEM & FILESYSTEM basics\n';
  return out;
}
