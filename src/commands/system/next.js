/**
 * next command — Context-aware beginner guidance funnel.
 *
 * Reads state from onboarding, tutorialManager, challengeManager,
 * and progressStore to suggest exactly ONE next step.
 */

import onboarding from '../../ui/onboarding.js';
import tutorialManager from '../../tutorial/tutorial-manager.js';
import challengeManager from '../../gamification/challenge-manager.js';
import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView,
  wordWrap
} from '../../utils/box-utils.js';

var B = BOX_CHARS;

// Phase definitions (mirrors leerpad.js)
var phase1Commands = ['ls', 'cat', 'pwd', 'cd', 'whoami', 'history', 'help'];
var phase2Commands = ['mkdir', 'touch', 'rm', 'cp', 'mv', 'echo'];
var phase3Commands = ['ping', 'nmap', 'ifconfig', 'netstat'];
var phase4Commands = ['hashcat', 'hydra', 'sqlmap', 'metasploit', 'nikto'];

var tutorialOrder = ['recon', 'webvuln', 'privesc', 'exploitation'];

// Educational tips per command (80/20 pattern: what + why)
var commandTips = {
  help:     'Ontdek welke tools je tot je beschikking hebt',
  ls:       'Bekijk bestanden in de huidige map - het eerste commando dat elke hacker leert',
  cd:       'Navigeer naar andere mappen - essentieel voor het verkennen van een systeem',
  pwd:      'Toon je huidige locatie - weet altijd waar je bent in het bestandssysteem',
  cat:      "Lees de inhoud van bestanden - probeer 'cat README.txt' (let op: hoofd/kleine letters maken uit!)",
  whoami:   'Check met welk account je bent ingelogd - ben je een gewone gebruiker of heb je admin-rechten?',
  history:  'Bekijk eerder uitgevoerde commands - soms laten andere gebruikers sporen achter',
  mkdir:    'Maak een nieuwe map aan - organiseer je tools en bevindingen',
  touch:    'Maak een nieuw bestand aan - handig voor notities en scripts',
  rm:       'Verwijder bestanden - leer hoe bestanden permanent verdwijnen',
  cp:       'Kopieer bestanden - maak backups voordat je iets aanpast',
  mv:       'Verplaats of hernoem bestanden - organiseer je bevindingen',
  echo:     'Toon tekst in de terminal - de basis van shell scripting',
  ping:     'Test of een server bereikbaar is - de eerste stap van network reconnaissance',
  nmap:     'Scan open poorten op een server - ontdek welke services draaien',
  ifconfig: 'Bekijk je eigen netwerkinterfaces - ken je eigen IP-adres',
  netstat:  'Toon actieve netwerkverbindingen - wie praat met wie?'
};

// Per-command voorbeeld suggesties (voorkomt naam-conflicten tussen stappen)
var commandExamples = {
  mkdir: 'mkdir projecten',
  touch: 'touch notities.txt',
  rm:    'rm notities.txt',
  cp:    'cp notes.txt backup.txt',
  mv:    'mv old.txt new.txt',
  echo:  'echo "hello world"'
};

/**
 * Build context-aware "Daarna:" hint for the next step
 */
function buildNextHint(stage) {
  // Numeric progress like "2/7" → show next step number
  if (stage.progress && stage.progress.indexOf('/') !== -1) {
    var parts = stage.progress.split('/');
    var current = parseInt(parts[0], 10);
    var total = parseInt(parts[1], 10);
    if (current < total) {
      return "Daarna: type 'next' voor stap " + (current + 1) + '/' + total;
    }
    return "Daarna: type 'next' voor volgende fase";
  }
  // Tutorials/challenges: don't suggest 'next' — the tutorial/challenge handles its own flow
  if (stage.suggestion && (stage.suggestion.indexOf('tutorial') !== -1 || stage.suggestion.indexOf('challenge') !== -1)) {
    return "De missie begeleidt je stap voor stap";
  }
  // Generic fallback
  return "Daarna: type 'next' voor je volgende stap";
}

// Stage builders — each returns a stage object if incomplete, null if complete

function buildPhase1Stage(triedSet) {
  var next = findNextUntried(phase1Commands, triedSet);
  if (!next) return null;
  var done = countTried(phase1Commands, triedSet);
  return {
    phase: 'Fase 1: Terminal Basics',
    progress: done + '/' + phase1Commands.length,
    command: next,
    tip: commandTips[next] || '',
    suggestion: next === 'cat'
      ? "Type 'cat README.txt'"
      : next === 'cd'
        ? "Type 'cd documents'"
        : "Type '" + next + "'"
  };
}

function buildPhase2Stage(triedSet) {
  var next = findNextUntried(phase2Commands, triedSet);
  if (!next) return null;
  var done = countTried(phase2Commands, triedSet);
  return {
    phase: 'Fase 2: File Manipulation',
    progress: done + '/' + phase2Commands.length,
    command: next,
    tip: commandTips[next] || '',
    suggestion: "Type '" + (commandExamples[next] || next + " test") + "'"
  };
}

function buildReconTutorialStage() {
  if (tutorialManager.isScenarioCompleted('recon')) return null;
  return {
    phase: 'Missie: Reconnaissance',
    progress: 'niet gestart',
    command: null,
    tip: 'Voordat je netwerk tools gebruikt, leer je eerst reconnaissance in een begeleide missie. Dit is hoe echte pentesters beginnen.',
    suggestion: "Type 'tutorial recon'"
  };
}

function buildPhase3Stage(triedSet) {
  var next = findNextUntried(phase3Commands, triedSet);
  if (!next) return null;
  var done = countTried(phase3Commands, triedSet);
  return {
    phase: 'Fase 3: Reconnaissance',
    progress: done + '/' + phase3Commands.length,
    command: next,
    tip: commandTips[next] || '',
    suggestion: "Type '" + next + (next === 'ping' || next === 'nmap' ? " 192.168.1.1'" : "'")
  };
}

function buildRemainingTutorialsStage() {
  var scenarioNames = { recon: 'Reconnaissance', webvuln: 'Web Vulnerabilities', privesc: 'Privilege Escalation', exploitation: 'Exploitation' };
  for (var i = 0; i < tutorialOrder.length; i++) {
    var id = tutorialOrder[i];
    if (!tutorialManager.isScenarioCompleted(id)) {
      return {
        phase: 'Missie: ' + (scenarioNames[id] || id),
        progress: 'niet gestart',
        command: null,
        tip: 'Begeleide missies leren je echte hacking technieken stap voor stap',
        suggestion: "Type 'tutorial " + id + "'"
      };
    }
  }
  return null;
}

function buildChallengeStage(difficulty) {
  var challenges = challengeManager.listChallenges();
  var nextChallenge = null;
  for (var c = 0; c < challenges.length; c++) {
    if (challenges[c].difficulty === difficulty && !challenges[c].completed) {
      nextChallenge = challenges[c];
      break;
    }
  }
  if (!nextChallenge) return null;
  var diffLabels = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  return {
    phase: 'Challenge: ' + diffLabels[difficulty],
    progress: countCompleted(challenges, difficulty) + '/' + countTotal(challenges, difficulty),
    command: null,
    tip: nextChallenge.title + ' - test je skills zonder begeleiding',
    suggestion: "Type 'challenge start " + nextChallenge.id + "'"
  };
}

/**
 * Check if user has any progress in a given stage.
 * Used to find the high-water mark (highest stage with activity).
 */
function hasAnyProgress(stageIndex, triedSet) {
  switch (stageIndex) {
    case 0: return countTried(phase1Commands, triedSet) > 0;
    case 1: return countTried(phase2Commands, triedSet) > 0;
    case 2: return tutorialManager.isScenarioCompleted('recon');
    case 3: return countTried(phase3Commands, triedSet) > 0;
    case 4: return tutorialManager.isScenarioCompleted('webvuln') || tutorialManager.isScenarioCompleted('privesc') || tutorialManager.isScenarioCompleted('exploitation');
    case 5: return countCompleted(challengeManager.listChallenges(), 'easy') > 0;
    case 6: return countCompleted(challengeManager.listChallenges(), 'medium') > 0;
    case 7: return countCompleted(challengeManager.listChallenges(), 'hard') > 0;
    default: return false;
  }
}

/**
 * Build a gentle hint about skipped earlier phases.
 * Returns string or null.
 */
function buildSkippedHint(startFrom, triedSet) {
  var gaps = [];
  if (startFrom > 0 && findNextUntried(phase1Commands, triedSet)) {
    var remaining = phase1Commands.length - countTried(phase1Commands, triedSet);
    gaps.push(remaining + ' Terminal Basics');
  }
  if (startFrom > 1 && findNextUntried(phase2Commands, triedSet)) {
    var remaining2 = phase2Commands.length - countTried(phase2Commands, triedSet);
    gaps.push(remaining2 + ' File Manipulation');
  }
  if (startFrom > 3 && findNextUntried(phase3Commands, triedSet)) {
    var remaining3 = phase3Commands.length - countTried(phase3Commands, triedSet);
    gaps.push(remaining3 + ' Reconnaissance');
  }
  if (gaps.length === 0) return null;
  return "[?] Tip: nog " + gaps.join(' en ') + " commands over. Type 'leerpad' voor overzicht.";
}

/**
 * Detect current stage using forward-only high-water mark algorithm.
 * Never sends user backwards after reaching advanced content.
 */
function detectStage(triedSet) {
  // All stage builders in order
  var stageBuilders = [
    function() { return buildPhase1Stage(triedSet); },
    function() { return buildPhase2Stage(triedSet); },
    buildReconTutorialStage,
    function() { return buildPhase3Stage(triedSet); },
    buildRemainingTutorialsStage,
    function() { return buildChallengeStage('easy'); },
    function() { return buildChallengeStage('medium'); },
    function() { return buildChallengeStage('hard'); }
  ];

  // Find high-water mark: highest stage where user has ANY progress
  var highWater = -1;
  for (var i = stageBuilders.length - 1; i >= 0; i--) {
    if (hasAnyProgress(i, triedSet)) {
      highWater = i;
      break;
    }
  }

  // From high-water mark (or 0 if none), find first incomplete stage
  var startFrom = Math.max(0, highWater);
  for (var j = startFrom; j < stageBuilders.length; j++) {
    var stage = stageBuilders[j]();
    if (stage) {
      stage.skippedHint = buildSkippedHint(startFrom, triedSet);
      return stage;
    }
  }

  // Everything from high-water onward is complete — check if truly all done
  // (covers edge case: all advanced stages done but early phases have gaps)
  return null;
}

// --- Helpers ---

function findNextUntried(commands, triedSet) {
  for (var i = 0; i < commands.length; i++) {
    if (!triedSet.has(commands[i])) return commands[i];
  }
  return null;
}

function countTried(commands, triedSet) {
  var count = 0;
  for (var i = 0; i < commands.length; i++) {
    if (triedSet.has(commands[i])) count++;
  }
  return count;
}

function countCompleted(challenges, difficulty) {
  var count = 0;
  for (var i = 0; i < challenges.length; i++) {
    if (challenges[i].difficulty === difficulty && challenges[i].completed) count++;
  }
  return count;
}

function countTotal(challenges, difficulty) {
  var count = 0;
  for (var i = 0; i < challenges.length; i++) {
    if (challenges[i].difficulty === difficulty) count++;
  }
  return count;
}

// --- Transition definitions ---

var transitions = [
  {
    id: 'phase1-phase2',
    fromLabel: 'FASE 1 VOLTOOID!',
    summary: 'Terminal Basics',
    skills: [
      'Bestanden bekijken en lezen',
      'Door mappen navigeren',
      'Systeem info opvragen'
    ],
    nextPhase: 'Fase 2: File Manipulation',
    bridge: 'Je kent nu de basis! Tijd om bestanden te manipuleren.'
  },
  {
    id: 'phase2-recon',
    fromLabel: 'FASE 2 VOLTOOID!',
    summary: 'File Manipulation',
    skills: [
      'Mappen en bestanden aanmaken',
      'Bestanden kopiëren en verplaatsen',
      'Bestanden verwijderen en beheren'
    ],
    nextPhase: 'Missie: Reconnaissance',
    bridge: 'Bestanden onder controle! Tijd voor je eerste missie.'
  },
  {
    id: 'recon-phase3',
    fromLabel: 'MISSIE VOLTOOID!',
    summary: 'Reconnaissance Tutorial',
    skills: [
      'Informatie verzamelen over doelwitten',
      'Reconnaissance technieken toepassen',
      'Gestructureerd een pentest starten'
    ],
    nextPhase: 'Fase 3: Network Scanning',
    bridge: 'Missie voltooid! Nu echte network tools leren.'
  },
  {
    id: 'phase3-tutorials',
    fromLabel: 'FASE 3 VOLTOOID!',
    summary: 'Reconnaissance & Scanning',
    skills: [
      'Network connectivity testen',
      'Poorten scannen en analyseren',
      'Netwerk interfaces begrijpen'
    ],
    nextPhase: 'Geavanceerde Missies',
    bridge: "Reconnaissance gedaan! Tijd voor geavanceerde missies.\n\n[?] Type 'dashboard' voor je voortgang, 'leerpad' voor een overzicht."
  }
];

/**
 * Check which phase just completed (if any)
 * Returns transition object or null
 */
function detectTransition(triedSet) {
  var phase1Done = findNextUntried(phase1Commands, triedSet) === null;
  var phase2Done = findNextUntried(phase2Commands, triedSet) === null;
  var phase3Done = findNextUntried(phase3Commands, triedSet) === null;

  // Check transitions in ascending order (oldest unshown wins)
  if (phase1Done && !onboarding.hasShownTransition('phase1-phase2')) {
    return transitions[0];
  }
  if (phase2Done && !onboarding.hasShownTransition('phase2-recon')) {
    return transitions[1];
  }
  if (phase2Done && tutorialManager.isScenarioCompleted('recon') && !onboarding.hasShownTransition('recon-phase3')) {
    return transitions[2];
  }
  if (phase3Done && !onboarding.hasShownTransition('phase3-tutorials')) {
    return transitions[3];
  }
  return null;
}

/**
 * Build a transition celebration box
 */
function buildTransitionBox(transition) {
  if (isMobileView()) {
    var out = '\n**' + transition.fromLabel + '**\n\n';
    out += '[X] ' + transition.summary + ' afgerond!\n\n';
    out += 'Je kunt nu:\n';
    for (var i = 0; i < transition.skills.length; i++) {
      out += '  [✓] ' + transition.skills[i] + '\n';
    }
    out += '\n' + transition.bridge + '\n\n';
    out += "[→] Type 'next' om door te gaan\n";
    return out;
  }

  var width = getResponsiveBoxWidth();
  var inner = width - 2;
  var lines = [];

  // Header
  var label = ' ' + transition.fromLabel + ' ';
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);
  lines.push(B.dividerLeft + B.horizontal.repeat(inner) + B.dividerRight);

  // Summary
  var summaryLine = '  [X] ' + transition.summary + ' afgerond!';
  lines.push(B.vertical + summaryLine.padEnd(inner) + B.vertical);
  lines.push(B.vertical + ' '.repeat(inner) + B.vertical);

  // Skills learned
  var skillsHeader = '  Je kunt nu:';
  lines.push(B.vertical + skillsHeader.padEnd(inner) + B.vertical);
  for (var s = 0; s < transition.skills.length; s++) {
    var skillLine = '    [✓] ' + transition.skills[s];
    var wrappedSkill = wordWrap(skillLine, inner - 2);
    for (var w = 0; w < wrappedSkill.length; w++) {
      lines.push(B.vertical + ('  ' + wrappedSkill[w]).padEnd(inner) + B.vertical);
    }
  }

  lines.push(B.vertical + ' '.repeat(inner) + B.vertical);

  // Bridge text
  var bridgeLines = wordWrap(transition.bridge, inner - 4);
  for (var b = 0; b < bridgeLines.length; b++) {
    lines.push(B.vertical + ('  ' + bridgeLines[b]).padEnd(inner) + B.vertical);
  }

  // Next hint
  lines.push(B.vertical + ' '.repeat(inner) + B.vertical);
  lines.push(B.dividerLeft + B.horizontal.repeat(inner) + B.dividerRight);
  var hintLine = "  [→] Type 'next' om door te gaan";
  lines.push(B.vertical + hintLine.padEnd(inner) + B.vertical);

  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);
  return lines.join('\n');
}

// --- Rendering ---

function buildDesktopBox(stage, width) {
  var inner = width - 2;
  var lines = [];

  // Header
  var label = ' VOLGENDE STAP ';
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

  // Divider
  lines.push(B.dividerLeft + B.horizontal.repeat(inner) + B.dividerRight);

  // Phase + progress
  var phaseLine = '  ' + stage.phase + ' (' + stage.progress + ')';
  lines.push(B.vertical + phaseLine.padEnd(inner) + B.vertical);

  // Empty line
  lines.push(B.vertical + ' '.repeat(inner) + B.vertical);

  // Suggestion (word-wrapped)
  var suggestionLines = wordWrap('[->] ' + stage.suggestion, inner - 4);
  suggestionLines.forEach(function(line) {
    lines.push(B.vertical + ('  ' + line).padEnd(inner) + B.vertical);
  });

  // Empty line
  lines.push(B.vertical + ' '.repeat(inner) + B.vertical);

  // Tip (word-wrapped with <- prefix)
  if (stage.tip) {
    var tipLines = wordWrap('<- ' + stage.tip, inner - 4);
    tipLines.forEach(function(line) {
      lines.push(B.vertical + ('  ' + line).padEnd(inner) + B.vertical);
    });
  }

  // Next hint inside box
  lines.push(B.vertical + ' '.repeat(inner) + B.vertical);
  lines.push(B.dividerLeft + B.horizontal.repeat(inner) + B.dividerRight);
  var hintText = '  ' + buildNextHint(stage);
  lines.push(B.vertical + hintText.padEnd(inner) + B.vertical);

  // Footer
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  var result = lines.join('\n');
  if (stage.skippedHint) {
    result += '\n\n' + stage.skippedHint;
  }
  return result;
}

function buildMobileOutput(stage) {
  var out = '\n**VOLGENDE STAP**\n\n';
  out += stage.phase + ' (' + stage.progress + ')\n\n';
  out += '[->] ' + stage.suggestion + '\n\n';
  if (stage.tip) {
    out += '<- ' + stage.tip + '\n\n';
  }
  out += buildNextHint(stage) + '\n';
  if (stage.skippedHint) {
    out += '\n' + stage.skippedHint + '\n';
  }
  return out;
}

function buildCompletionMessage() {
  var summaryLines = [
    '[X] Alle fases, missies en challenges voltooid!',
    '',
    'Je hebt geleerd:',
    '  [✓] Terminal navigatie en bestandsbeheer',
    '  [✓] Network reconnaissance en port scanning',
    '  [✓] Password cracking, brute force en SQL injection',
    '  [✓] Privilege escalation technieken',
    '  [✓] Exploitation met Metasploit en Hydra',
    '',
    "[?] Type 'certificates' voor je certificaat",
    "[?] Type 'dashboard' voor je statistieken",
    "[?] Type 'achievements' voor je badges",
    '',
    'Volgende stap? Probeer echte CTF platforms:',
    '  TryHackMe.com | HackTheBox.com | OverTheWire.org'
  ];

  if (isMobileView()) {
    return '\n**VOLTOOID**\n\n' + summaryLines.map(function(l) { return l; }).join('\n') + '\n';
  }

  var width = getResponsiveBoxWidth();
  var inner = width - 2;
  var lines = [];

  var label = ' VOLTOOID ';
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);
  lines.push(B.dividerLeft + B.horizontal.repeat(inner) + B.dividerRight);

  summaryLines.forEach(function(line) {
    lines.push(B.vertical + ('  ' + line).padEnd(inner) + B.vertical);
  });

  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);
  return lines.join('\n');
}

// --- Command Export ---

export default {
  name: 'next',
  description: 'Toon je volgende stap',
  category: 'system',

  execute: function() {
    // Check if tutorial is active — show tutorial status, not funnel
    if (tutorialManager.isActive()) {
      var status = tutorialManager.getStatus();
      var step = status.step;
      var out = '';
      out += '[?] Je bent bezig met: ' + status.scenarioTitle + '\n';
      out += '[→] Stap ' + (status.currentStep + 1) + '/' + status.totalSteps + ': ' + step.title + '\n';
      out += '[?] ' + step.objective + '\n';
      out += "\n[TIP] Typ 'hint' als je vastzit, of 'tutorial exit' om te stoppen.";
      return out;
    }

    // Check if challenge is active — redirect to challenge status
    if (challengeManager.isActive()) {
      return "[?] Je bent bezig met een challenge.\n[TIP] Type 'challenge status' voor je voortgang.";
    }

    var triedSet = new Set(onboarding.getCommandsTried());

    // Check for phase transitions first (celebration moment!)
    var transition = detectTransition(triedSet);
    if (transition) {
      onboarding.markTransitionShown(transition.id);
      return buildTransitionBox(transition);
    }

    var stage = detectStage(triedSet);

    if (!stage) {
      return buildCompletionMessage();
    }

    var output;
    if (isMobileView()) {
      output = buildMobileOutput(stage);
    } else {
      var width = getResponsiveBoxWidth();
      output = buildDesktopBox(stage, width);
    }

    return output;
  },

  manPage: (
    "NAAM\n" +
    "    next - toon je volgende stap\n" +
    "\n" +
    "SYNOPSIS\n" +
    "    next\n" +
    "\n" +
    "BESCHRIJVING\n" +
    "    Analyseert je voortgang en geeft een persoonlijke suggestie\n" +
    "    voor je volgende stap. Het command bekijkt welke fases,\n" +
    "    tutorials en challenges je al hebt voltooid.\n" +
    "\n" +
    "    STAGES\n" +
    "        1. Terminal Basics     ls, cd, pwd, cat, whoami, history\n" +
    "        2. File Manipulation   mkdir, touch, rm, cp, mv, echo\n" +
    "        3. Tutorial Recon      Begeleide reconnaissance missie\n" +
    "        4. Network Scanning    ping, nmap, ifconfig, netstat\n" +
    "        5. Tutorials           Overige begeleide missies\n" +
    "        6. Easy Challenges     Zelfstandige opdrachten\n" +
    "        7. Medium/Hard         Moeilijkere challenges\n" +
    "        8. Voltooid            Alles afgerond!\n" +
    "\n" +
    "    Elke suggestie bevat een korte uitleg waarom die stap\n" +
    "    belangrijk is voor je ontwikkeling als ethical hacker.\n" +
    "\n" +
    "VOORBEELDEN\n" +
    "    next\n" +
    "        Bekijk wat je volgende stap is\n" +
    "\n" +
    "TIPS\n" +
    "    - 'next' werkt het best als je het regelmatig gebruikt\n" +
    "    - Je voortgang wordt automatisch bijgehouden\n" +
    "    - Na voltooiing van alles krijg je een felicitatie\n" +
    "\n" +
    "    [HACKSIM] Dit command is uniek voor HackSimulator.\n" +
    "       Het bestaat niet in standaard Linux.\n" +
    "\n" +
    "    [+] In real Linux:\n" +
    "       Er is geen 'next' command. Je bepaalt zelf je leerpad\n" +
    "       via cursussen en CTF platforms.\n" +
    "\n" +
    "GERELATEERDE COMMANDO'S\n" +
    "    leerpad (volledige voortgang), tutorial (missies), challenge (opdrachten)"
  )
};
