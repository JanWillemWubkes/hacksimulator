/**
 * Tutorial Renderer — Generates formatted terminal output for tutorial UI.
 *
 * Uses box-utils.js for responsive ASCII boxes and mobile detection.
 * Output uses renderer-compatible prefixes ([✓], [!], [?]) for auto-styling.
 */

import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView,
  wordWrap
} from '../utils/box-utils.js';

import { generateCertificate } from './certificate.js';

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

var tutorialRenderer = {

  /**
   * Render the mission briefing when a scenario starts.
   */
  renderBriefing: function(scenario) {
    if (isMobileView()) {
      return this._renderBriefingMobile(scenario);
    }

    var width = getResponsiveBoxWidth();
    var inner = width - 2;
    var lines = [];

    // Top border with title
    var label = ' MISSION BRIEFING ';
    var remaining = inner - label.length;
    var leftPad = Math.floor(remaining / 2);
    var rightPad = remaining - leftPad;
    lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

    lines.push(buildEmptyLine(width));

    // Scenario title
    lines.push(buildLine('  Missie: ' + scenario.title, width));
    lines.push(buildLine('  Niveau: ' + (scenario.difficulty || 'Beginner'), width));
    lines.push(buildLine('  Stappen: ' + scenario.steps.length, width));

    lines.push(buildEmptyLine(width));
    lines.push(buildDivider(width));
    lines.push(buildEmptyLine(width));

    // Description (word-wrapped)
    var descLines = wordWrap(scenario.briefing || scenario.description, inner - 4);
    descLines.forEach(function(line) {
      lines.push(buildLine('  ' + line, width));
    });

    lines.push(buildEmptyLine(width));

    // Bottom border
    lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

    return lines.join('\n');
  },

  _renderBriefingMobile: function(scenario) {
    var out = '\n**MISSION BRIEFING**\n\n';
    out += 'Missie: ' + scenario.title + '\n';
    out += 'Niveau: ' + (scenario.difficulty || 'Beginner') + '\n';
    out += 'Stappen: ' + scenario.steps.length + '\n\n';
    out += (scenario.briefing || scenario.description) + '\n';
    return out;
  },

  /**
   * Render the current step objective.
   */
  renderObjective: function(step, stepIndex, totalSteps) {
    var stepNum = stepIndex + 1;
    var header = '[→] Stap ' + stepNum + '/' + totalSteps + ': ' + step.title;
    var output = '\n' + header + '\n';
    output += '[?] ' + step.objective;
    return output;
  },

  /**
   * Render feedback after a command attempt.
   */
  renderStepFeedback: function(step, isCorrect, hint) {
    if (isCorrect) {
      var output = '\n[✓] Correct! ' + step.title + ' voltooid.';
      if (step.feedback) {
        output += '\n\n' + step.feedback;
      }
      return output;
    }

    // Incorrect attempt
    var output = '\n[!] Dat is niet het juiste commando voor deze stap.';
    if (hint) {
      output += '\n[?] Hint: ' + hint;
    }
    return output;
  },

  /**
   * Render scenario completion summary.
   */
  renderCompletion: function(scenario, stats) {
    if (isMobileView()) {
      return this._renderCompletionMobile(scenario, stats);
    }

    var width = getResponsiveBoxWidth();
    var inner = width - 2;
    var lines = [];

    // Top border
    var label = ' MISSIE VOLTOOID ';
    var remaining = inner - label.length;
    var leftPad = Math.floor(remaining / 2);
    var rightPad = remaining - leftPad;
    lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

    lines.push(buildEmptyLine(width));
    lines.push(buildLine('  ' + scenario.title, width));
    lines.push(buildEmptyLine(width));
    lines.push(buildDivider(width));
    lines.push(buildEmptyLine(width));

    // Stats
    lines.push(buildLine('  Stappen voltooid: ' + stats.stepsCompleted + '/' + stats.totalSteps, width));

    lines.push(buildEmptyLine(width));

    // Completion message
    if (scenario.completionMessage) {
      var msgLines = wordWrap(scenario.completionMessage, inner - 4);
      msgLines.forEach(function(line) {
        lines.push(buildLine('  ' + line, width));
      });
      lines.push(buildEmptyLine(width));
    }

    lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

    var output = lines.join('\n');
    output += '\n\n' + generateCertificate(scenario, stats);
    output += '\n\n[✓] Goed gedaan! Je hebt de ' + scenario.title + ' missie afgerond.';
    output += '\n[?] Type \'tutorial\' om meer scenario\'s te zien.';

    return output;
  },

  _renderCompletionMobile: function(scenario, stats) {
    var out = '\n**MISSIE VOLTOOID**\n\n';
    out += scenario.title + '\n';
    out += 'Stappen: ' + stats.stepsCompleted + '/' + stats.totalSteps + '\n\n';
    if (scenario.completionMessage) {
      out += scenario.completionMessage + '\n\n';
    }
    out += generateCertificate(scenario, stats) + '\n\n';
    out += '[✓] Goed gedaan! Je hebt de missie afgerond.\n';
    out += '[?] Type \'tutorial\' om meer scenario\'s te zien.';
    return out;
  }
};

export default tutorialRenderer;
