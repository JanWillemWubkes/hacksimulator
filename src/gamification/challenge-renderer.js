/**
 * Challenge Renderer — ASCII box output for challenges.
 *
 * Uses shared box-utils for consistent rendering with tutorial system.
 * Falls back to plain markdown on mobile viewports.
 */

import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView,
  wordWrap,
  smartTruncate
} from '../utils/box-utils.js';

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

var challengeRenderer = {
  /**
   * Render the challenge list.
   */
  renderChallengeList: function(challenges) {
    if (challenges.length === 0) {
      return '[?] Geen challenges beschikbaar.';
    }

    if (isMobileView()) {
      return this._renderListMobile(challenges);
    }

    var width = getResponsiveBoxWidth();
    var inner = width - 2;
    var lines = [];

    // Header
    var label = ' CHALLENGES ';
    var remaining = inner - label.length;
    var leftPad = Math.floor(remaining / 2);
    var rightPad = remaining - leftPad;
    lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

    lines.push(buildEmptyLine(width));

    var difficultyOrder = { easy: 1, medium: 2, hard: 3 };
    var sorted = challenges.slice().sort(function(a, b) {
      return (difficultyOrder[a.difficulty] || 9) - (difficultyOrder[b.difficulty] || 9);
    });

    sorted.forEach(function(c) {
      var checkbox = c.completed ? '[X]' : '[ ]';
      var diffLabel = c.difficulty.toUpperCase();
      var pts = c.points + ' pts';
      var titleLine = '  ' + checkbox + ' ' + smartTruncate(c.title, inner - 22) +
                      '  [' + diffLabel + '] ' + pts;
      lines.push(buildLine(titleLine, width));

      var descLines = wordWrap(c.description, inner - 6);
      descLines.forEach(function(line) {
        lines.push(buildLine('      ' + line, width));
      });

      lines.push(buildEmptyLine(width));
    });

    lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

    var output = lines.join('\n');
    output += '\n\n[?] Start een challenge: challenge start <id>';
    output += '\n[?] Beschikbare ID\'s: ' + sorted.map(function(c) { return c.id; }).join(', ');

    return output;
  },

  /**
   * Render challenge list for mobile.
   */
  _renderListMobile: function(challenges) {
    var out = '\n**CHALLENGES**\n\n';

    challenges.forEach(function(c) {
      var checkbox = c.completed ? '[X]' : '[ ]';
      out += checkbox + ' **' + c.title + '**\n';
      out += '    ' + c.difficulty.toUpperCase() + ' | ' + c.points + ' punten\n';
      out += '    ' + c.description + '\n\n';
    });

    out += '[?] Start: challenge start <id>\n';
    out += '[?] ID\'s: ' + challenges.map(function(c) { return c.id; }).join(', ');

    return out;
  },

  /**
   * Render challenge briefing (on start).
   */
  renderBriefing: function(challenge) {
    if (isMobileView()) {
      return this._renderBriefingMobile(challenge);
    }

    var width = getResponsiveBoxWidth();
    var inner = width - 2;
    var lines = [];

    // Header
    var label = ' MISSION BRIEFING ';
    var remaining = inner - label.length;
    var leftPad = Math.floor(remaining / 2);
    var rightPad = remaining - leftPad;
    lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

    lines.push(buildEmptyLine(width));
    lines.push(buildLine('  Challenge: ' + smartTruncate(challenge.title, inner - 14), width));
    lines.push(buildLine('  Moeilijkheid: ' + challenge.difficulty.toUpperCase() + ' | Punten: ' + challenge.points, width));
    lines.push(buildEmptyLine(width));

    lines.push(buildDivider(width));
    lines.push(buildEmptyLine(width));

    // Description
    var descLines = wordWrap(challenge.description, inner - 4);
    descLines.forEach(function(line) {
      lines.push(buildLine('  ' + line, width));
    });

    lines.push(buildEmptyLine(width));
    lines.push(buildDivider(width));
    lines.push(buildEmptyLine(width));

    // Requirements
    lines.push(buildLine('  DOELEN:', width));
    var reqs = challenge.requirements || [];
    reqs.forEach(function(req, i) {
      var desc = req.description || req.command;
      lines.push(buildLine('  [ ] ' + (i + 1) + '. ' + desc, width));
    });

    lines.push(buildEmptyLine(width));
    lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

    var output = lines.join('\n');
    output += '\n\n[TIP] Voer de juiste commando\'s uit om de doelen af te vinken.';
    output += '\n[?] Type \'challenge hint\' als je vastloopt.';
    output += '\n[?] Type \'challenge status\' om je voortgang te zien.';

    return output;
  },

  _renderBriefingMobile: function(challenge) {
    var out = '\n**MISSION BRIEFING**\n\n';
    out += '**' + challenge.title + '**\n';
    out += challenge.difficulty.toUpperCase() + ' | ' + challenge.points + ' punten\n\n';
    out += challenge.description + '\n\n';
    out += '**DOELEN:**\n';

    var reqs = challenge.requirements || [];
    reqs.forEach(function(req, i) {
      var desc = req.description || req.command;
      out += '[ ] ' + (i + 1) + '. ' + desc + '\n';
    });

    out += '\n[TIP] Voer commando\'s uit om doelen af te vinken.';
    out += '\n[?] Type \'challenge hint\' als je vastloopt.';

    return out;
  },

  /**
   * Render progress update.
   */
  renderProgress: function(challenge, progress) {
    var completed = progress.filter(function(p) { return p.met; }).length;
    var total = progress.length;

    var out = '[?] Challenge voortgang: ' + completed + '/' + total + ' doelen\n';

    progress.forEach(function(p) {
      var icon = p.met ? '[X]' : '[ ]';
      out += '  ' + icon + ' ' + p.description + '\n';
    });

    if (completed > 0 && completed < total) {
      out += '\n[TIP] Goed bezig! Nog ' + (total - completed) + ' doel' + (total - completed > 1 ? 'en' : '') + ' te gaan.';
    }

    return out;
  },

  /**
   * Render challenge completion.
   */
  renderCompletion: function(challenge, attempts) {
    if (isMobileView()) {
      return this._renderCompletionMobile(challenge, attempts);
    }

    var width = getResponsiveBoxWidth();
    var inner = width - 2;
    var lines = [];

    var label = ' CHALLENGE VOLTOOID ';
    var remaining = inner - label.length;
    var leftPad = Math.floor(remaining / 2);
    var rightPad = remaining - leftPad;
    lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

    lines.push(buildEmptyLine(width));
    lines.push(buildLine('  ' + challenge.title, width));
    lines.push(buildEmptyLine(width));
    lines.push(buildLine('  Punten verdiend: +' + challenge.points, width));
    lines.push(buildLine('  Pogingen: ' + attempts, width));
    lines.push(buildEmptyLine(width));

    lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

    var output = lines.join('\n');
    output += '\n\n[✓] Goed gedaan! Je hebt deze challenge succesvol afgerond.';
    output += '\n[?] Type \'challenge\' voor meer challenges.';
    output += '\n[?] Type \'dashboard\' voor je totale voortgang.';

    return output;
  },

  _renderCompletionMobile: function(challenge, attempts) {
    var out = '\n**CHALLENGE VOLTOOID**\n\n';
    out += '**' + challenge.title + '**\n\n';
    out += 'Punten verdiend: +' + challenge.points + '\n';
    out += 'Pogingen: ' + attempts + '\n\n';
    out += '[✓] Goed gedaan!\n';
    out += '[?] Type \'challenge\' voor meer challenges.';

    return out;
  }
};

export default challengeRenderer;
