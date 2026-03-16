/**
 * dashboard command — Central progress overview for gamification data.
 *
 * Subcommands: (none)/overview, stats, badges, challenges
 */

import progressStore from '../../gamification/progress-store.js';
import challengeManager from '../../gamification/challenge-manager.js';
import badgeManager from '../../gamification/badge-manager.js';
import onboarding from '../../ui/onboarding.js';
import tutorialManager from '../../tutorial/tutorial-manager.js';
import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView,
  wordWrap
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

function progressBar(current, total, barWidth) {
  if (total === 0) return '[' + '░'.repeat(barWidth) + '] 0/0';
  var filled = Math.round((current / total) * barWidth);
  if (filled > barWidth) filled = barWidth;
  return '[' + '█'.repeat(filled) + '░'.repeat(barWidth - filled) + '] ' + current + '/' + total;
}

function buildHeader(label, width) {
  var inner = width - 2;
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  return B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight;
}

// --- Section Renderers ---

function getStatsData() {
  var stats = progressStore.getStats();
  return {
    totalPoints: stats.totalPoints,
    totalCommands: stats.totalCommands,
    completedChallenges: stats.completedChallenges.length,
    badgeCount: stats.badges.length,
    streak: stats.streak,
    lastActiveDate: stats.lastActiveDate
  };
}

function getChallengeData() {
  var challenges = challengeManager.listChallenges();
  var byDifficulty = { easy: { done: 0, total: 0 }, medium: { done: 0, total: 0 }, hard: { done: 0, total: 0 } };

  challenges.forEach(function(c) {
    var d = c.difficulty;
    if (!byDifficulty[d]) byDifficulty[d] = { done: 0, total: 0 };
    byDifficulty[d].total++;
    if (c.completed) byDifficulty[d].done++;
  });

  var totalDone = 0;
  var totalAll = 0;
  for (var key in byDifficulty) {
    totalDone += byDifficulty[key].done;
    totalAll += byDifficulty[key].total;
  }

  return { byDifficulty: byDifficulty, totalDone: totalDone, totalAll: totalAll };
}

// Phase definitions (mirrors next.js/leerpad.js)
var phase1Commands = ['ls', 'cd', 'pwd', 'cat', 'whoami', 'history', 'help'];
var phase2Commands = ['mkdir', 'touch', 'rm'];
var phase3Commands = ['ping', 'nmap', 'ifconfig', 'netstat'];

function countTriedInPhase(commands, triedSet) {
  var count = 0;
  for (var i = 0; i < commands.length; i++) {
    if (triedSet.has(commands[i])) count++;
  }
  return count;
}

function getNextStep(challengeData, badgeSummary) {
  // Check onboarding phases first (same logic as next.js)
  var triedSet = new Set(onboarding.getCommandsTried());

  var done1 = countTriedInPhase(phase1Commands, triedSet);
  if (done1 < phase1Commands.length) {
    return "Volgende: Fase 1 voltooien (" + done1 + "/" + phase1Commands.length + " commands geleerd). Type 'next'.";
  }

  var done2 = countTriedInPhase(phase2Commands, triedSet);
  if (done2 < phase2Commands.length) {
    return "Volgende: Fase 2 voltooien (" + done2 + "/" + phase2Commands.length + " commands geleerd). Type 'next'.";
  }

  if (!tutorialManager.isScenarioCompleted('recon')) {
    return "Volgende: start de tutorial (type 'tutorial recon').";
  }

  var done3 = countTriedInPhase(phase3Commands, triedSet);
  if (done3 < phase3Commands.length) {
    return "Volgende: Fase 3 voltooien (" + done3 + "/" + phase3Commands.length + " commands geleerd). Type 'next'.";
  }

  // Then check challenges (original logic)
  var cd = challengeData;

  if (cd.totalDone === cd.totalAll) {
    if (badgeSummary.unlocked < badgeSummary.total) {
      return 'Alle challenges voltooid! Nog ' + (badgeSummary.total - badgeSummary.unlocked) + ' badges te unlocken.';
    }
    return 'Alles voltooid! Je bent een echte Hacker Elite.';
  }

  var difficulties = ['easy', 'medium', 'hard'];
  for (var i = 0; i < difficulties.length; i++) {
    var d = difficulties[i];
    var group = cd.byDifficulty[d];
    if (group && group.done < group.total) {
      return 'Volgende: probeer een ' + d.toUpperCase() + ' challenge (' + group.done + '/' + group.total + ' voltooid).';
    }
  }

  return 'Type \'challenge\' om beschikbare challenges te bekijken.';
}

// --- Desktop Rendering ---

function renderStatsSection(lines, width, stats) {
  lines.push(buildLine('  PLAYER STATS', width));
  lines.push(buildDivider(width));
  lines.push(buildLine('  Punten:      ' + stats.totalPoints, width));
  lines.push(buildLine('  Commando\'s:  ' + stats.totalCommands, width));
  var streakText = stats.streak > 0 ? stats.streak + ' dagen' : '--';
  lines.push(buildLine('  Streak:      ' + streakText, width));
  lines.push(buildLine('  Badges:      ' + stats.badgeCount, width));
}

function renderChallengesSection(lines, width, cd) {
  lines.push(buildLine('  CHALLENGES', width));
  lines.push(buildDivider(width));

  var barWidth = 10;
  var difficulties = ['easy', 'medium', 'hard'];
  var labels = { easy: 'EASY  ', medium: 'MEDIUM', hard: 'HARD  ' };

  difficulties.forEach(function(d) {
    var group = cd.byDifficulty[d];
    var bar = progressBar(group.done, group.total, barWidth);
    lines.push(buildLine('  ' + labels[d] + '  ' + bar, width));
  });

  lines.push(buildEmptyLine(width));
  lines.push(buildLine('  Totaal: ' + progressBar(cd.totalDone, cd.totalAll, barWidth), width));
}

function renderBadgesSection(lines, width, summary) {
  lines.push(buildLine('  BADGES', width));
  lines.push(buildDivider(width));
  lines.push(buildLine('  Unlocked: ' + progressBar(summary.unlocked, summary.total, 10), width));

  var rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  var rarityLabels = { common: 'Common   ', uncommon: 'Uncommon ', rare: 'Rare     ', epic: 'Epic     ', legendary: 'Legendary' };

  rarities.forEach(function(r) {
    var data = summary.byRarity[r];
    if (data) {
      lines.push(buildLine('  ' + rarityLabels[r] + '  ' + data.unlocked + '/' + data.total, width));
    }
  });
}

function renderFullDesktop() {
  var width = getResponsiveBoxWidth();
  var lines = [];
  var stats = getStatsData();
  var cd = getChallengeData();
  var badgeSummary = badgeManager.getSummary();

  // Header
  lines.push(buildHeader(' DASHBOARD ', width));
  lines.push(buildEmptyLine(width));

  // Section 1: Player Stats
  renderStatsSection(lines, width, stats);
  lines.push(buildEmptyLine(width));

  // Section 2: Challenges
  renderChallengesSection(lines, width, cd);
  lines.push(buildEmptyLine(width));

  // Section 3: Badges
  renderBadgesSection(lines, width, badgeSummary);
  lines.push(buildEmptyLine(width));

  // Section 4: Next step
  lines.push(buildLine('  VOLGENDE STAP', width));
  lines.push(buildDivider(width));
  var nextStep = getNextStep(cd, badgeSummary);
  var wrapped = wordWrap(nextStep, width - 6);
  wrapped.forEach(function(line) {
    lines.push(buildLine('  ' + line, width));
  });
  lines.push(buildEmptyLine(width));

  // Tips inside box
  var inner = width - 2;
  lines.push(B.dividerLeft + B.horizontal.repeat(inner) + B.dividerRight);
  lines.push(buildLine("  [?] 'dashboard stats|badges|challenges' voor details", width));
  lines.push(buildLine("  [?] Type 'next' voor een persoonlijke suggestie", width));

  // Footer
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  return lines.join('\n');
}

// --- Mobile Rendering ---

function renderFullMobile() {
  var stats = getStatsData();
  var cd = getChallengeData();
  var badgeSummary = badgeManager.getSummary();

  var out = '\n**DASHBOARD**\n\n';

  out += '**PLAYER STATS**\n';
  out += 'Punten: ' + stats.totalPoints + '\n';
  out += 'Commando\'s: ' + stats.totalCommands + '\n';
  var streakText = stats.streak > 0 ? stats.streak + ' dagen' : '--';
  out += 'Streak: ' + streakText + '\n';
  out += 'Badges: ' + stats.badgeCount + '\n\n';

  out += '**CHALLENGES**\n';
  var difficulties = ['easy', 'medium', 'hard'];
  difficulties.forEach(function(d) {
    var group = cd.byDifficulty[d];
    out += d.toUpperCase() + ': ' + group.done + '/' + group.total + '\n';
  });
  out += 'Totaal: ' + cd.totalDone + '/' + cd.totalAll + '\n\n';

  out += '**BADGES**\n';
  out += 'Unlocked: ' + badgeSummary.unlocked + '/' + badgeSummary.total + '\n\n';

  out += '**VOLGENDE STAP**\n';
  out += getNextStep(cd, badgeSummary) + '\n';

  return out;
}

// --- Subcommand Renderers ---

function renderStats() {
  var stats = getStatsData();

  if (isMobileView()) {
    var out = '\n**PLAYER STATS**\n\n';
    out += 'Punten: ' + stats.totalPoints + '\n';
    out += 'Commando\'s: ' + stats.totalCommands + '\n';
    var mStreak = stats.streak > 0 ? stats.streak + ' dagen' : '--';
    out += 'Streak: ' + mStreak + '\n';
    out += 'Badges: ' + stats.badgeCount + '\n';
    out += 'Challenges: ' + stats.completedChallenges + ' voltooid\n';
    return out;
  }

  var width = getResponsiveBoxWidth();
  var lines = [];
  lines.push(buildHeader(' PLAYER STATS ', width));
  lines.push(buildEmptyLine(width));
  renderStatsSection(lines, width, stats);
  lines.push(buildLine('  Challenges:  ' + stats.completedChallenges + ' voltooid', width));
  lines.push(buildEmptyLine(width));
  var inner = width - 2;
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);
  return lines.join('\n');
}

function renderBadges() {
  var summary = badgeManager.getSummary();

  if (isMobileView()) {
    var out = '\n**BADGE OVERZICHT**\n\n';
    out += 'Unlocked: ' + summary.unlocked + '/' + summary.total + '\n\n';
    var rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    rarities.forEach(function(r) {
      var data = summary.byRarity[r];
      if (data) {
        out += r.toUpperCase() + ': ' + data.unlocked + '/' + data.total + '\n';
      }
    });
    out += '\n[TIP] Type \'achievements\' voor de volledige badge galerij.';
    return out;
  }

  var width = getResponsiveBoxWidth();
  var lines = [];
  lines.push(buildHeader(' BADGE OVERZICHT ', width));
  lines.push(buildEmptyLine(width));
  renderBadgesSection(lines, width, summary);
  lines.push(buildEmptyLine(width));
  var inner = width - 2;
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);
  var output = lines.join('\n');
  output += '\n\n[TIP] Type \'achievements\' voor de volledige badge galerij.';
  return output;
}

function renderChallenges() {
  var cd = getChallengeData();

  if (isMobileView()) {
    var out = '\n**CHALLENGE VOORTGANG**\n\n';
    var difficulties = ['easy', 'medium', 'hard'];
    difficulties.forEach(function(d) {
      var group = cd.byDifficulty[d];
      out += d.toUpperCase() + ': ' + group.done + '/' + group.total + '\n';
    });
    out += '\nTotaal: ' + cd.totalDone + '/' + cd.totalAll + '\n';
    out += '\n[TIP] Type \'challenge\' om een challenge te starten.';
    return out;
  }

  var width = getResponsiveBoxWidth();
  var lines = [];
  lines.push(buildHeader(' CHALLENGE VOORTGANG ', width));
  lines.push(buildEmptyLine(width));
  renderChallengesSection(lines, width, cd);
  lines.push(buildEmptyLine(width));
  var inner = width - 2;
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);
  var output = lines.join('\n');
  output += '\n\n[TIP] Type \'challenge\' om een challenge te starten.';
  return output;
}

// --- Command Export ---

export default {
  name: 'dashboard',
  description: 'Bekijk je voortgang en statistieken',
  category: 'system',
  usage: 'dashboard [stats|badges|challenges]',

  execute: function(args) {
    var sub = args.length > 0 ? args[0].toLowerCase() : '';

    // dashboard (no args) — full overview
    if (sub === '' || sub === 'overview' || sub === 'all') {
      if (isMobileView()) return renderFullMobile();
      return renderFullDesktop();
    }

    // dashboard stats
    if (sub === 'stats' || sub === 'score') {
      return renderStats();
    }

    // dashboard badges
    if (sub === 'badges') {
      return renderBadges();
    }

    // dashboard challenges
    if (sub === 'challenges') {
      return renderChallenges();
    }

    return '[?] Onbekend subcommando: ' + sub + '\n\n' +
           '[?] Gebruik: dashboard [stats|badges|challenges]\n' +
           '[TIP] Type \'dashboard\' voor een volledig overzicht.';
  },

  manPage: (
    "NAAM\n" +
    "    dashboard - bekijk je voortgang en statistieken\n" +
    "\n" +
    "SYNOPSIS\n" +
    "    dashboard                       Toon volledig overzicht\n" +
    "    dashboard stats                 Toon alleen speler statistieken\n" +
    "    dashboard badges                Toon badge samenvatting\n" +
    "    dashboard challenges            Toon challenge voortgang\n" +
    "\n" +
    "BESCHRIJVING\n" +
    "    Het dashboard is je centrale voortgangsoverzicht. Het combineert\n" +
    "    data uit alle gamification systemen in een handig overzicht.\n" +
    "\n" +
    "    SECTIES\n" +
    "        Player Stats    Totaal punten, commando's, streak\n" +
    "        Challenges      Voortgang per moeilijkheidsgraad\n" +
    "        Badges          Verdiende badges per zeldzaamheid\n" +
    "        Volgende stap   Suggestie voor je volgende uitdaging\n" +
    "\n" +
    "    Het dashboard past zich automatisch aan op mobiele schermen\n" +
    "    met een compacte tekst-weergave.\n" +
    "\n" +
    "VOORBEELDEN\n" +
    "    dashboard\n" +
    "        Bekijk je volledige voortgangsoverzicht\n" +
    "\n" +
    "    dashboard stats\n" +
    "        Bekijk alleen je punten, streak en commando-teller\n" +
    "\n" +
    "    dashboard challenges\n" +
    "        Bekijk hoeveel challenges je per niveau hebt voltooid\n" +
    "\n" +
    "    dashboard badges\n" +
    "        Bekijk een samenvatting van je verdiende badges\n" +
    "\n" +
    "TIPS\n" +
    "    - Het dashboard update automatisch na elke challenge of badge\n" +
    "    - Gebruik subcommando's om snel specifieke info op te vragen\n" +
    "    - Je streak telt opeenvolgende dagen dat je actief bent\n" +
    "\n" +
    "    [HACKSIM] Dit command is uniek voor HackSimulator.\n" +
    "       Het bestaat niet in standaard Linux.\n" +
    "\n" +
    "    [+] In real Linux:\n" +
    "       Tools als 'htop' tonen systeemstatus, niet\n" +
    "       leervoortgang.\n" +
    "\n" +
    "GERELATEERDE COMMANDO'S\n" +
    "    challenge (hack opdrachten), achievements (badges), certificates (diploma's)"
  )
};
