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

import { CERT_DISCLAIMER } from '../gamification/certificate-templates.js';

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

  // Een missie kan ook doorlopen worden met 'tutorial skip'. Dan is er niets
  // "voltooid" en mag het certificaat dat niet suggereren (Sessie 209).
  var fullySolved = stats.stepsCompleted >= stats.totalSteps;

  // Top border with label
  var label = fullySolved ? ' CERTIFICAAT VAN VOLTOOIING ' : ' CERTIFICAAT VAN DEELNAME ';
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
  var skipped = stats.totalSteps - stats.stepsCompleted;
  var msg = fullySolved
    ? 'Je hebt deze missie succesvol afgerond en de basis van ' +
      getDiscipline(scenario.id) + ' geleerd.'
    : 'Je hebt deze missie doorlopen, maar ' + skipped + ' van de ' + stats.totalSteps +
      ' stappen overgeslagen. Doe ze alsnog voor een volledig certificaat.';
  var msgLines = wordWrap(msg, inner - 4);
  msgLines.forEach(function(line) {
    lines.push(buildLine('  ' + line, width));
  });

  lines.push(buildEmptyLine(width));

  // Star decoration bottom
  lines.push(buildLine(centerText(stars, inner), width));

  // Eerlijkheidsregel (zie CERT_DISCLAIMER in gamification/certificate-templates.js).
  // Gewordwrapt omdat de box tot 30 tekens smal kan worden.
  lines.push(buildEmptyLine(width));
  wordWrap(CERT_DISCLAIMER, inner - 4).forEach(function(part) {
    lines.push(buildLine(centerText(part, inner), width));
  });

  lines.push(buildEmptyLine(width));

  // Bottom border
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  return lines.join('\n');
}

function generateCertificateMobile(scenario, stats) {
  var fullySolved = stats.stepsCompleted >= stats.totalSteps;
  var out = fullySolved
    ? '\n**CERTIFICAAT VAN VOLTOOIING**\n'
    : '\n**CERTIFICAAT VAN DEELNAME**\n';
  out += '*  *  *\n\n';
  out += 'HACKSIMULATOR.NL\n\n';
  out += 'Missie:  ' + scenario.title + '\n';
  out += 'Niveau:  ' + (scenario.difficulty || 'Beginner') + '\n';
  out += 'Stappen: ' + stats.stepsCompleted + '/' + stats.totalSteps + '\n';
  out += 'Datum:   ' + formatDate() + '\n\n';
  out += '*  *  *\n';
  if (!fullySolved) {
    out += (stats.totalSteps - stats.stepsCompleted) + ' stappen overgeslagen.\n';
  }
  out += CERT_DISCLAIMER + '\n';
  return out;
}

function getDiscipline(scenarioId) {
  var disciplines = {
    'fundamentals': 'terminal-navigatie en bestandsbeheer',
    'recon': 'reconnaissance en netwerk verkenning',
    'webvuln': 'web applicatie security testing',
    'privesc': 'systeem analyse en credential discovery'
  };
  return disciplines[scenarioId] || 'ethisch hacken';
}

/**
 * Unicode box-drawing → ASCII. Buiten de terminal is er geen box-font, dus in een
 * .txt of plakvenster zouden de randen als vraagtekens of misalignment landen.
 * Gedeeld door copy én download (spiegelt generatePlainTextCertificate in
 * gamification/certificate-generator.js).
 */
function toPlainText(certificateText) {
  return certificateText.replace(/[╭╮╰╯│─├┤]/g, function(ch) {
    var map = { '╭': '+', '╮': '+', '╰': '+', '╯': '+', '│': '|', '─': '-', '├': '+', '┤': '+' };
    return map[ch] || ch;
  });
}

/**
 * Copy certificate text to clipboard.
 * Returns a promise-like result message.
 */
function copyCertificateToClipboard(certificateText) {
  var plainText = toPlainText(certificateText);

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

/**
 * Download certificate as .txt file (Blob + createObjectURL pattern).
 *
 * Sessie 207: challenge-certificaten konden al gedownload worden
 * (gamification/certificate-generator.js), tutorial-certificaten alleen gekopieerd.
 * Zelfde artefact, dus nu ook dezelfde mogelijkheden.
 */
function downloadCertificate(certificateText, scenarioId) {
  var text = toPlainText(certificateText);
  var filename = 'hacksimulator-tutorial-' + scenarioId + '.txt';
  var blob = new Blob([text], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return '[✓] Certificaat gedownload als ' + filename;
}

export { generateCertificate, copyCertificateToClipboard, downloadCertificate };
