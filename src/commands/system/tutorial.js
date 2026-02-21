/**
 * tutorial command — Entry point for guided learning scenarios.
 *
 * Subcommands: (none)/list, start <id>, status, skip, exit, reset
 */

import tutorialManager from '../../tutorial/tutorial-manager.js';
import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView,
  wordWrap,
  smartTruncate
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

function renderList() {
  var scenarios = tutorialManager.listScenarios();

  if (scenarios.length === 0) {
    return '[?] Geen tutorial scenario\'s beschikbaar.';
  }

  if (isMobileView()) {
    return renderListMobile(scenarios);
  }

  var width = getResponsiveBoxWidth();
  var inner = width - 2;
  var lines = [];

  // Header
  var label = ' TUTORIALS ';
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

  lines.push(buildEmptyLine(width));

  scenarios.forEach(function(s) {
    var completed = tutorialManager.isScenarioCompleted(s.id);
    var checkbox = completed ? '[X]' : '[ ]';
    var titleLine = '  ' + checkbox + ' ' + smartTruncate(s.title, inner - 8);
    lines.push(buildLine(titleLine, width));

    var detailLine = '      Niveau: ' + s.difficulty + ' | Stappen: ' + s.stepCount;
    lines.push(buildLine(detailLine, width));

    var descLines = wordWrap(s.description, inner - 6);
    descLines.forEach(function(line) {
      lines.push(buildLine('      ' + line, width));
    });

    lines.push(buildEmptyLine(width));
  });

  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  var output = lines.join('\n');
  output += '\n\n[?] Start een tutorial: tutorial start <id>';
  output += '\n[?] Beschikbare ID\'s: ' + scenarios.map(function(s) { return s.id; }).join(', ');

  return output;
}

function renderListMobile(scenarios) {
  var out = '\n**TUTORIALS**\n\n';

  scenarios.forEach(function(s) {
    var completed = tutorialManager.isScenarioCompleted(s.id);
    var checkbox = completed ? '[X]' : '[ ]';
    out += checkbox + ' **' + s.title + '**\n';
    out += '    Niveau: ' + s.difficulty + ' | Stappen: ' + s.stepCount + '\n';
    out += '    ' + s.description + '\n\n';
  });

  out += '[?] Start: tutorial start <id>\n';
  out += '[?] ID\'s: ' + scenarios.map(function(s) { return s.id; }).join(', ');

  return out;
}

function renderStatus() {
  var status = tutorialManager.getStatus();

  if (!status.active) {
    var completedCount = status.completedScenarios.length;
    if (completedCount > 0) {
      return '[?] Geen actieve tutorial.\n' +
             '[✓] Voltooide scenario\'s: ' + completedCount + '\n\n' +
             '[?] Type \'tutorial\' om beschikbare scenario\'s te zien.';
    }
    return '[?] Geen actieve tutorial.\n\n' +
           '[?] Type \'tutorial\' om beschikbare scenario\'s te zien.';
  }

  var output = '[?] Actieve tutorial: ' + status.scenarioTitle + '\n';
  output += '[?] Voortgang: stap ' + (status.currentStep + 1) + '/' + status.totalSteps + '\n';
  output += '[?] Huidige opdracht: ' + status.step.title + '\n';
  output += '[?] ' + status.step.objective;

  return output;
}

export default {
  name: 'tutorial',
  description: 'Begeleide hacking scenario\'s',
  category: 'system',
  usage: 'tutorial [start <id>|status|skip|exit]',

  execute: function(args) {
    var sub = args.length > 0 ? args[0].toLowerCase() : '';

    // tutorial (no args) or tutorial list → show available scenarios
    if (sub === '' || sub === 'list') {
      return renderList();
    }

    // tutorial start <id> OR tutorial <id> (shortcut)
    if (sub === 'start') {
      var scenarioId = args.length > 1 ? args[1].toLowerCase() : '';
      if (!scenarioId) {
        return '[?] Gebruik: tutorial start <scenario-id>\n\n' +
               '[?] Type \'tutorial\' om beschikbare scenario\'s te zien.';
      }
      return tutorialManager.start(scenarioId);
    }

    // tutorial status
    if (sub === 'status') {
      return renderStatus();
    }

    // tutorial skip
    if (sub === 'skip') {
      return tutorialManager.skip();
    }

    // tutorial exit
    if (sub === 'exit' || sub === 'stop' || sub === 'quit') {
      return tutorialManager.exit();
    }

    // tutorial reset (hidden/debug)
    if (sub === 'reset') {
      tutorialManager.reset();
      return '[✓] Tutorial voortgang gereset.';
    }

    // Maybe user typed scenario ID directly: tutorial recon
    var scenario = tutorialManager.getScenario(sub);
    if (scenario) {
      return tutorialManager.start(sub);
    }

    return '[?] Onbekend subcommando: ' + sub + '\n\n' +
           '[?] Gebruik: tutorial [start <id>|status|skip|exit]\n' +
           '[?] Type \'tutorial\' voor beschikbare scenario\'s.';
  },

  manPage: (
    "NAAM\n" +
    "    tutorial - begeleide hacking scenario's\n" +
    "\n" +
    "SYNOPSIS\n" +
    "    tutorial                      Toon beschikbare scenario's\n" +
    "    tutorial start <id>           Start een scenario\n" +
    "    tutorial <id>                 Start een scenario (snelkoppeling)\n" +
    "    tutorial status               Toon huidige voortgang\n" +
    "    tutorial skip                 Sla huidige stap over\n" +
    "    tutorial exit                 Verlaat tutorial (voortgang opgeslagen)\n" +
    "\n" +
    "BESCHRIJVING\n" +
    "    Het tutorial systeem biedt begeleide hacking scenario's waarin je\n" +
    "    stap voor stap leert hoe ethical hackers te werk gaan. Elk scenario\n" +
    "    simuleert een realistische opdracht.\n" +
    "\n" +
    "    Bij elke stap krijg je een opdracht. Voer het juiste commando uit\n" +
    "    om verder te gaan. Als je vastloopt, krijg je automatisch hints\n" +
    "    na een paar pogingen.\n" +
    "\n" +
    "    HINT SYSTEEM\n" +
    "        Na 2 foute pogingen  - Eerste hint (richting)\n" +
    "        Na 4 foute pogingen  - Tweede hint (specifieker)\n" +
    "        Na 6 foute pogingen  - Volledig antwoord\n" +
    "\n" +
    "    Je voortgang wordt automatisch opgeslagen. Als je de pagina\n" +
    "    herlaadt, kun je verder waar je gebleven was.\n" +
    "\n" +
    "BESCHIKBARE SCENARIO'S\n" +
    "    recon    Reconnaissance: SecureCorp Pentest (4 stappen)\n" +
    "             Leer netwerk verkenning met ping, nmap, whois, traceroute\n" +
    "\n" +
    "VOORBEELDEN\n" +
    "    tutorial\n" +
    "        Bekijk alle beschikbare scenario's met status\n" +
    "\n" +
    "    tutorial recon\n" +
    "        Start het reconnaissance scenario\n" +
    "\n" +
    "    tutorial status\n" +
    "        Bekijk je voortgang in het actieve scenario\n" +
    "\n" +
    "    tutorial skip\n" +
    "        Sla de huidige stap over (je mist de uitleg)\n" +
    "\n" +
    "TIPS\n" +
    "    - Begin met 'tutorial recon' als je nieuw bent\n" +
    "    - Lees de mission briefing goed door voor context\n" +
    "    - Gebruik 'man <command>' als je niet weet hoe een tool werkt\n" +
    "    - De tutorial blokkeert geen commands - je kunt altijd alles typen\n" +
    "\n" +
    "GERELATEERDE COMMANDO'S\n" +
    "    leerpad (passieve voortgang), help (alle commands), man (uitleg)"
  )
};
