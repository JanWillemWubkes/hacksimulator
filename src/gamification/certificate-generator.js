/**
 * Certificate Generator — ASCII art certificates for challenge completion.
 *
 * Reuses box-utils for responsive rendering and the clipboard/download
 * patterns from tutorial/certificate.js and ui/feedback.js.
 */

import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView,
  wordWrap
} from '../utils/box-utils.js';

import { CERT_TEMPLATES, DISCIPLINES } from './certificate-templates.js';

var B = BOX_CHARS;

// --- Shared box helpers (same as challenge-renderer / tutorial cert) ---

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

function formatDate(isoString) {
  var d = isoString ? new Date(isoString) : new Date();
  var dag = d.getDate();
  var maanden = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december'
  ];
  return dag + ' ' + maanden[d.getMonth()] + ' ' + d.getFullYear();
}

// --- Public API ---

/**
 * Generate an ASCII box certificate for a completed challenge.
 *
 * @param {Object} challenge - { id, title, difficulty, points }
 * @param {Object} stats     - { earnedAt, attempts }
 * @returns {string} ASCII certificate
 */
export function generateChallengeCertificate(challenge, stats) {
  if (isMobileView()) {
    return generateCertificateMobile(challenge, stats);
  }

  var template = CERT_TEMPLATES[challenge.difficulty] || CERT_TEMPLATES.easy;
  var discipline = DISCIPLINES[challenge.id] || 'ethical hacking';
  var width = getResponsiveBoxWidth();
  var inner = width - 2;
  var lines = [];

  // Top border with label
  var label = ' ' + template.label + ' ';
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

  lines.push(buildEmptyLine(width));

  // Decoration
  lines.push(buildLine(centerText(template.decoration, inner), width));

  lines.push(buildEmptyLine(width));

  // Title
  lines.push(buildLine(centerText('HACKSIMULATOR.NL', inner), width));

  lines.push(buildEmptyLine(width));
  lines.push(buildDivider(width));
  lines.push(buildEmptyLine(width));

  // Challenge info
  lines.push(buildLine('  Challenge:    ' + challenge.title, width));
  lines.push(buildLine('  Moeilijkheid: ' + challenge.difficulty.toUpperCase() + ' | ' + challenge.points + ' punten', width));
  lines.push(buildLine('  Rang:         ' + template.rank, width));
  lines.push(buildLine('  Pogingen:     ' + (stats.attempts || '?'), width));
  lines.push(buildLine('  Datum:        ' + formatDate(stats.earnedAt), width));

  lines.push(buildEmptyLine(width));
  lines.push(buildDivider(width));
  lines.push(buildEmptyLine(width));

  // Congratulations message
  var msg = template.message + ' ' + discipline + ' beheerst.';
  var msgLines = wordWrap(msg, inner - 4);
  msgLines.forEach(function(line) {
    lines.push(buildLine('  ' + line, width));
  });

  lines.push(buildEmptyLine(width));

  // Decoration bottom
  lines.push(buildLine(centerText(template.decoration, inner), width));

  lines.push(buildEmptyLine(width));

  // Bottom border
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  return lines.join('\n');
}

function generateCertificateMobile(challenge, stats) {
  var template = CERT_TEMPLATES[challenge.difficulty] || CERT_TEMPLATES.easy;
  var discipline = DISCIPLINES[challenge.id] || 'ethical hacking';

  var out = '\n**' + template.label + '**\n';
  out += template.decoration + '\n\n';
  out += 'HACKSIMULATOR.NL\n\n';
  out += 'Challenge:    ' + challenge.title + '\n';
  out += 'Moeilijkheid: ' + challenge.difficulty.toUpperCase() + ' | ' + challenge.points + ' punten\n';
  out += 'Rang:         ' + template.rank + '\n';
  out += 'Pogingen:     ' + (stats.attempts || '?') + '\n';
  out += 'Datum:        ' + formatDate(stats.earnedAt) + '\n\n';
  out += template.message + ' ' + discipline + ' beheerst.\n';
  out += template.decoration + '\n';
  return out;
}

/**
 * Generate a plain-text version (Unicode → ASCII) for .txt download.
 */
export function generatePlainTextCertificate(challenge, stats) {
  var cert = generateChallengeCertificate(challenge, stats);
  return cert.replace(/[╭╮╰╯│─├┤]/g, function(ch) {
    var map = { '╭': '+', '╮': '+', '╰': '+', '╯': '+', '│': '|', '─': '-', '├': '+', '┤': '+' };
    return map[ch] || ch;
  });
}

/**
 * Download certificate as .txt file (Blob + createObjectURL pattern).
 */
export function downloadCertificate(challenge, stats) {
  var text = generatePlainTextCertificate(challenge, stats);
  var blob = new Blob([text], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = 'hacksimulator-cert-' + challenge.id + '.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return '[✓] Certificaat gedownload als hacksimulator-cert-' + challenge.id + '.txt';
}

/**
 * Copy certificate to clipboard (with fallback).
 */
export function copyCertificate(challenge, stats) {
  var text = generatePlainTextCertificate(challenge, stats);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(function() {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
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
