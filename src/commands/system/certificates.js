/**
 * certificates command — View, download, and copy earned certificates.
 *
 * Subcommands: (none)/list, <id>, download <id>, copy <id>
 */

import progressStore from '../../gamification/progress-store.js';
import challengeManager from '../../gamification/challenge-manager.js';
import {
  generateChallengeCertificate,
  downloadCertificate,
  copyCertificate
} from '../../gamification/certificate-generator.js';
import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView,
  smartTruncate
} from '../../utils/box-utils.js';
import { CERT_TEMPLATES } from '../../gamification/certificate-templates.js';

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

export default {
  name: 'certificates',
  description: 'Bekijk en download je verdiende certificaten',
  category: 'system',
  usage: 'certificates [<id>|download <id>|copy <id>]',

  execute: function(args) {
    var sub = args.length > 0 ? args[0].toLowerCase() : '';

    // certificates (no args) — show list
    if (sub === '' || sub === 'list') {
      return renderCertificateList();
    }

    // certificates download <id>
    if (sub === 'download') {
      var dlId = args.length > 1 ? args[1].toLowerCase() : '';
      if (!dlId) {
        return '[?] Gebruik: certificates download <challenge-id>\n\n' +
               '[?] Type \'certificates\' om je certificaten te zien.';
      }
      return handleCertAction(dlId, 'download');
    }

    // certificates copy <id>
    if (sub === 'copy') {
      var cpId = args.length > 1 ? args[1].toLowerCase() : '';
      if (!cpId) {
        return '[?] Gebruik: certificates copy <challenge-id>\n\n' +
               '[?] Type \'certificates\' om je certificaten te zien.';
      }
      return handleCertAction(cpId, 'copy');
    }

    // certificates <id> — show full certificate
    return handleCertAction(sub, 'view');
  },

  manPage: (
    "NAAM\n" +
    "    certificates - bekijk en download je verdiende certificaten\n" +
    "\n" +
    "SYNOPSIS\n" +
    "    certificates                    Toon alle verdiende certificaten\n" +
    "    certificates <id>               Toon een volledig certificaat\n" +
    "    certificates download <id>      Download als .txt bestand\n" +
    "    certificates copy <id>          Kopieer naar klembord\n" +
    "\n" +
    "BESCHRIJVING\n" +
    "    Elke voltooide challenge levert een certificaat op. Certificaten\n" +
    "    tonen je rang, moeilijkheidsgraad, en het aantal pogingen.\n" +
    "\n" +
    "    CERTIFICAAT NIVEAUS\n" +
    "        EASY     Certificaat van Voltooiing   (Hacker Apprentice)\n" +
    "        MEDIUM   Certificaat van Bekwaamheid  (Hacker Specialist)\n" +
    "        HARD     Certificaat van Meesterschap (Hacker Elite)\n" +
    "\n" +
    "    Certificaten worden automatisch opgeslagen zodra je een challenge\n" +
    "    voltooit. Je kunt ze altijd opnieuw bekijken, downloaden of kopieren.\n" +
    "\n" +
    "VOORBEELDEN\n" +
    "    certificates\n" +
    "        Bekijk een overzicht van al je verdiende certificaten\n" +
    "\n" +
    "    certificates network-scout\n" +
    "        Toon het volledige certificaat voor Network Scout\n" +
    "\n" +
    "    certificates download network-scout\n" +
    "        Download het certificaat als .txt bestand\n" +
    "\n" +
    "    certificates copy network-scout\n" +
    "        Kopieer het certificaat naar je klembord\n" +
    "\n" +
    "TIPS\n" +
    "    - Voltooi challenges om certificaten te verdienen\n" +
    "    - Hogere moeilijkheidsgraden geven betere rangen\n" +
    "    - Download je certificaten als bewijs van je skills!\n" +
    "\n" +
    "GERELATEERDE COMMANDO'S\n" +
    "    challenge (hack opdrachten), achievements (badges)"
  )
};

function handleCertAction(challengeId, action) {
  // Check if certificate exists
  var certData = progressStore.getCertificate(challengeId);
  if (!certData) {
    // Check if challenge exists at all
    var challenge = challengeManager.getChallenge(challengeId);
    if (!challenge) {
      return '[X] Onbekende challenge: ' + challengeId + '\n\n' +
             '[?] Type \'certificates\' om je verdiende certificaten te zien.\n' +
             '[?] Type \'challenge\' om beschikbare challenges te zien.';
    }
    return '[?] Je hebt deze challenge nog niet voltooid: ' + challenge.title + '\n\n' +
           '[TIP] Type \'challenge start ' + challengeId + '\' om de challenge te starten!';
  }

  var challenge = challengeManager.getChallenge(challengeId);
  if (!challenge) {
    return '[X] Challenge definitie niet gevonden: ' + challengeId;
  }

  if (action === 'download') {
    return downloadCertificate(challenge, certData);
  }

  if (action === 'copy') {
    return copyCertificate(challenge, certData);
  }

  // view
  var output = generateChallengeCertificate(challenge, certData);
  output += '\n\n[TIP] Type \'certificates download ' + challengeId + '\' om te downloaden.';
  output += '\n[TIP] Type \'certificates copy ' + challengeId + '\' om naar klembord te kopieren.';
  return output;
}

function renderCertificateList() {
  var allCerts = progressStore.getAllCertificates();
  var certIds = Object.keys(allCerts);

  if (certIds.length === 0) {
    return '[?] Je hebt nog geen certificaten verdiend.\n\n' +
           '[TIP] Voltooi challenges om certificaten te verdienen!\n' +
           '[TIP] Type \'challenge\' om beschikbare challenges te zien.';
  }

  if (isMobileView()) {
    return renderListMobile(allCerts, certIds);
  }

  var width = getResponsiveBoxWidth();
  var inner = width - 2;
  var lines = [];

  // Header
  var label = ' CERTIFICATEN ';
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

  lines.push(buildEmptyLine(width));

  certIds.forEach(function(id) {
    var challenge = challengeManager.getChallenge(id);
    if (!challenge) return;

    var certData = allCerts[id];
    var template = CERT_TEMPLATES[challenge.difficulty] || CERT_TEMPLATES.easy;
    var title = smartTruncate(challenge.title, inner - 20);
    var diff = challenge.difficulty.toUpperCase();

    lines.push(buildLine('  [✓] ' + title + '  [' + diff + ']', width));
    lines.push(buildLine('      Rang: ' + template.rank + ' | ' + challenge.points + ' pts', width));
    lines.push(buildEmptyLine(width));
  });

  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  var output = lines.join('\n');
  output += '\n\n[?] Bekijk: certificates <id>';
  output += '\n[?] Download: certificates download <id>';
  output += '\n[?] Kopieer: certificates copy <id>';

  return output;
}

function renderListMobile(allCerts, certIds) {
  var out = '\n**CERTIFICATEN**\n\n';

  certIds.forEach(function(id) {
    var challenge = challengeManager.getChallenge(id);
    if (!challenge) return;

    var template = CERT_TEMPLATES[challenge.difficulty] || CERT_TEMPLATES.easy;
    out += '[✓] **' + challenge.title + '**\n';
    out += '    ' + challenge.difficulty.toUpperCase() + ' | ' + template.rank + '\n\n';
  });

  out += '[?] Bekijk: certificates <id>\n';
  out += '[?] Download: certificates download <id>';

  return out;
}
