/**
 * leaderboard command — Simulated + personal ranking display.
 *
 * Subcommands: (none)/full list, me (personal rank)
 * Follows dashboard.js pattern: box-utils helpers, desktop/mobile rendering.
 */

import leaderboardManager from '../../gamification/leaderboard-manager.js';
import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView
} from '../../utils/box-utils.js';

var B = BOX_CHARS;

function buildLine(text, width) {
  var inner = width - 2;
  var pad = inner - text.length;
  if (pad < 0) pad = 0;
  return B.vertical + text + ' '.repeat(pad) + B.vertical;
}

function buildEmptyLine(width) {
  var inner = width - 2;
  return B.vertical + ' '.repeat(inner) + B.vertical;
}

function buildDivider(width) {
  var inner = width - 2;
  return B.dividerLeft + B.horizontal.repeat(inner) + B.dividerRight;
}

function buildHeader(label, width) {
  var inner = width - 2;
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  return B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight;
}

function padRight(str, len) {
  if (str.length >= len) return str.substring(0, len);
  return str + ' '.repeat(len - str.length);
}

function padLeft(str, len) {
  if (str.length >= len) return str;
  return ' '.repeat(len - str.length) + str;
}

// --- Desktop Rendering ---

function renderListDesktop() {
  var width = getResponsiveBoxWidth();
  var ranked = leaderboardManager.getRankedList();
  var lines = [];

  lines.push(buildHeader(' LEADERBOARD ', width));
  lines.push(buildEmptyLine(width));

  // Column header
  lines.push(buildLine('  #   NAAM               PTS   TITEL', width));
  lines.push(buildDivider(width));

  ranked.forEach(function(entry) {
    var marker = entry.isPlayer ? '>>' : '  ';
    var rank = padLeft(String(entry.rank), 2);
    var name = padRight(entry.name, 17);
    var pts = padLeft(String(entry.points), 5);
    var title = entry.title;
    var row = marker + rank + '  ' + name + pts + '   ' + title;
    lines.push(buildLine(row, width));
  });

  lines.push(buildEmptyLine(width));

  var playerRank = leaderboardManager.getPlayerRank();
  if (playerRank && playerRank.pointsToClimb > 0) {
    lines.push(buildLine('  Nog ' + playerRank.pointsToClimb + ' punten om te stijgen!', width));
  } else if (playerRank && playerRank.rank === 1) {
    lines.push(buildLine('  Je staat op #1! Hacker Elite!', width));
  }

  var inner = width - 2;
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  var output = lines.join('\n');
  output += '\n\n[TIP] Type \'leaderboard me\' voor je persoonlijke ranking details.';
  return output;
}

function renderListMobile() {
  var ranked = leaderboardManager.getRankedList();
  var out = '\n**LEADERBOARD**\n\n';

  ranked.forEach(function(entry) {
    var marker = entry.isPlayer ? '>> ' : '   ';
    out += marker + '#' + entry.rank + ' ' + entry.name + ' (' + entry.points + ' pts) - ' + entry.title + '\n';
  });

  var playerRank = leaderboardManager.getPlayerRank();
  if (playerRank && playerRank.pointsToClimb > 0) {
    out += '\nNog ' + playerRank.pointsToClimb + ' punten om te stijgen!';
  } else if (playerRank && playerRank.rank === 1) {
    out += '\nJe staat op #1! Hacker Elite!';
  }

  return out;
}

// --- Me Subcommand ---

function renderMeDesktop() {
  var width = getResponsiveBoxWidth();
  var pr = leaderboardManager.getPlayerRank();
  var lines = [];

  lines.push(buildHeader(' JOUW RANKING ', width));
  lines.push(buildEmptyLine(width));
  lines.push(buildLine('  Positie:  #' + pr.rank + ' van ' + pr.total, width));
  lines.push(buildLine('  Punten:   ' + pr.points, width));
  lines.push(buildLine('  Titel:    ' + pr.title, width));
  lines.push(buildEmptyLine(width));
  lines.push(buildDivider(width));

  if (pr.above) {
    lines.push(buildLine('  Boven jou: #' + pr.above.rank + ' ' + pr.above.name + ' (' + pr.above.points + ' pts)', width));
    lines.push(buildLine('  Verschil:  ' + pr.pointsToClimb + ' punten om te stijgen', width));
  } else {
    lines.push(buildLine('  Je staat bovenaan! Niemand boven jou.', width));
  }

  if (pr.below) {
    lines.push(buildLine('  Onder jou: #' + pr.below.rank + ' ' + pr.below.name + ' (' + pr.below.points + ' pts)', width));
  }

  lines.push(buildEmptyLine(width));
  var inner = width - 2;
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  var output = lines.join('\n');
  output += '\n\n[TIP] Voltooi challenges om punten te verdienen en te stijgen!';
  return output;
}

function renderMeMobile() {
  var pr = leaderboardManager.getPlayerRank();
  var out = '\n**JOUW RANKING**\n\n';
  out += 'Positie: #' + pr.rank + ' van ' + pr.total + '\n';
  out += 'Punten: ' + pr.points + '\n';
  out += 'Titel: ' + pr.title + '\n\n';

  if (pr.above) {
    out += 'Boven jou: ' + pr.above.name + ' (' + pr.above.points + ' pts)\n';
    out += 'Nog ' + pr.pointsToClimb + ' punten om te stijgen\n';
  } else {
    out += 'Je staat bovenaan!\n';
  }

  if (pr.below) {
    out += 'Onder jou: ' + pr.below.name + ' (' + pr.below.points + ' pts)\n';
  }

  out += '\n[TIP] Voltooi challenges om punten te verdienen!';
  return out;
}

// --- Command Export ---

export default {
  name: 'leaderboard',
  description: 'Bekijk de ranglijst met je positie',
  category: 'system',
  usage: 'leaderboard [me]',

  execute: function(args) {
    var sub = args.length > 0 ? args[0].toLowerCase() : '';

    if (sub === '' || sub === 'list' || sub === 'all') {
      if (isMobileView()) return renderListMobile();
      return renderListDesktop();
    }

    if (sub === 'me' || sub === 'rank' || sub === 'mijn') {
      if (isMobileView()) return renderMeMobile();
      return renderMeDesktop();
    }

    return '[?] Onbekend subcommando: ' + sub + '\n\n' +
           '[?] Gebruik: leaderboard [me]\n' +
           '[TIP] Type \'leaderboard\' voor de volledige ranglijst.';
  },

  manPage: (
    "NAAM\n" +
    "    leaderboard - bekijk de ranglijst en je positie\n" +
    "\n" +
    "SYNOPSIS\n" +
    "    leaderboard                     Toon de volledige ranglijst\n" +
    "    leaderboard me                  Toon je persoonlijke ranking\n" +
    "\n" +
    "BESCHRIJVING\n" +
    "    Het leaderboard toont een ranglijst van hackers gesorteerd op punten.\n" +
    "    Jouw score wordt live berekend op basis van voltooide challenges.\n" +
    "    Je positie verschuift automatisch als je meer punten verdient.\n" +
    "\n" +
    "    TITELS\n" +
    "        250+ punten    Hacker Elite    (top-tier CTF speler)\n" +
    "        200+ punten    Pentester       (professionele pentester)\n" +
    "        150+ punten    Red Teamer      (offensieve security)\n" +
    "        100+ punten    Bug Hunter      (kwetsbaarheden zoeker)\n" +
    "         70+ punten    Scripter        (automatisering expert)\n" +
    "         40+ punten    Analyst         (security analyst)\n" +
    "         20+ punten    Explorer        (actieve ontdekker)\n" +
    "         10+ punten    Beginner        (net gestart)\n" +
    "          1+ punten    Newbie          (eerste stappen)\n" +
    "          0  punten    Script Kiddie   (nog geen punten)\n" +
    "\n" +
    "    Titels zijn gebaseerd op CTF (Capture The Flag) en security\n" +
    "    rollen uit de cybersecurity wereld.\n" +
    "\n" +
    "VOORBEELDEN\n" +
    "    leaderboard\n" +
    "        Bekijk de volledige ranglijst met alle spelers\n" +
    "\n" +
    "    leaderboard me\n" +
    "        Bekijk je eigen positie, titel en verschil met andere spelers\n" +
    "\n" +
    "TIPS\n" +
    "    - Voltooi challenges om punten te verdienen en te stijgen\n" +
    "    - Je kunt de #1 positie bereiken door alle challenges te voltooien\n" +
    "    - Je positie wordt met >> gemarkeerd in de ranglijst\n" +
    "\n" +
    "GERELATEERDE COMMANDO'S\n" +
    "    dashboard (voortgang), challenge (opdrachten), achievements (badges)"
  )
};
