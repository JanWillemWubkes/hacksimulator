/**
 * Certificate Generator — ASCII art certificate for tutorial completion.
 *
 * Generates a text-based certificate and provides copy-to-clipboard
 * functionality (navigator.clipboard with textarea fallback).
 */

import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView,
  wordWrap
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

function centerText(text, innerWidth) {
  var pad = innerWidth - text.length;
  if (pad < 0) return text;
  var left = Math.floor(pad / 2);
  return ' '.repeat(left) + text;
}

function formatDate() {
  var now = new Date();
  var dag = now.getDate();
  var maanden = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december'
  ];
  return dag + ' ' + maanden[now.getMonth()] + ' ' + now.getFullYear();
}

/**
 * Generate an ASCII certificate for a completed scenario.
 */
function generateCertificate(scenario, stats) {
  if (isMobileView()) {
    return generateCertificateMobile(scenario, stats);
  }

  var width = getResponsiveBoxWidth();
  var inner = width - 2;
  var lines = [];

  // Top border with label
  var label = ' CERTIFICAAT VAN VOLTOOIING ';
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

  lines.push(buildEmptyLine(width));

  // Star decoration
  var stars = '*  *  *';
  lines.push(buildLine(centerText(stars, inner), width));

  lines.push(buildEmptyLine(width));

  // Title
  var title = 'HACKSIMULATOR.NL';
  lines.push(buildLine(centerText(title, inner), width));

  lines.push(buildEmptyLine(width));
  lines.push(buildDivider(width));
  lines.push(buildEmptyLine(width));

  // Scenario info
  lines.push(buildLine('  Missie:    ' + scenario.title, width));
  lines.push(buildLine('  Niveau:    ' + (scenario.difficulty || 'Beginner'), width));
  lines.push(buildLine('  Stappen:   ' + stats.stepsCompleted + '/' + stats.totalSteps + ' voltooid', width));
  lines.push(buildLine('  Datum:     ' + formatDate(), width));

  lines.push(buildEmptyLine(width));
  lines.push(buildDivider(width));
  lines.push(buildEmptyLine(width));

  // Congratulations message
  var msg = 'Je hebt deze missie succesvol afgerond en de basis van ' +
            getDiscipline(scenario.id) + ' geleerd.';
  var msgLines = wordWrap(msg, inner - 4);
  msgLines.forEach(function(line) {
    lines.push(buildLine('  ' + line, width));
  });

  lines.push(buildEmptyLine(width));

  // Star decoration bottom
  lines.push(buildLine(centerText(stars, inner), width));

  lines.push(buildEmptyLine(width));

  // Bottom border
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  return lines.join('\n');
}

function generateCertificateMobile(scenario, stats) {
  var out = '\n**CERTIFICAAT VAN VOLTOOIING**\n';
  out += '*  *  *\n\n';
  out += 'HACKSIMULATOR.NL\n\n';
  out += 'Missie:  ' + scenario.title + '\n';
  out += 'Niveau:  ' + (scenario.difficulty || 'Beginner') + '\n';
  out += 'Stappen: ' + stats.stepsCompleted + '/' + stats.totalSteps + '\n';
  out += 'Datum:   ' + formatDate() + '\n\n';
  out += '*  *  *\n';
  return out;
}

function getDiscipline(scenarioId) {
  var disciplines = {
    'recon': 'reconnaissance en netwerk verkenning',
    'webvuln': 'web applicatie security testing',
    'privesc': 'systeem analyse en credential discovery'
  };
  return disciplines[scenarioId] || 'ethical hacking';
}

/**
 * Copy certificate text to clipboard.
 * Returns a promise-like result message.
 */
function copyCertificateToClipboard(certificateText) {
  var plainText = certificateText
    .replace(/[╭╮╰╯│─├┤]/g, function(ch) {
      var map = { '╭': '+', '╮': '+', '╰': '+', '╯': '+', '│': '|', '─': '-', '├': '+', '┤': '+' };
      return map[ch] || ch;
    });

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(plainText).then(function() {
      // Success handled by caller
    }).catch(function() {
      fallbackCopy(plainText);
    });
  } else {
    fallbackCopy(plainText);
  }
  return '[✓] Certificaat gekopieerd naar klembord!';
}

function fallbackCopy(text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch (e) {
    // Silent fail
  }
  document.body.removeChild(textarea);
}

export { generateCertificate, copyCertificateToClipboard };
