import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  smartTruncate,
  isMobileView
} from "../../utils/box-utils.js";
import onboarding from "../../ui/onboarding.js";

const B = BOX_CHARS;

const phases = [
  {
    phase: "FASE 1: TERMINAL BASICS",
    commands: [
      { name: "help", description: "Commands ontdekken" },
      { name: "ls", description: "Bestanden bekijken" },
      { name: "cd", description: "Navigeren" },
      { name: "pwd", description: "Huidige locatie" },
      { name: "cat", description: "Bestanden lezen" },
      { name: "whoami", description: "Je identiteit" },
      { name: "history", description: "Command geschiedenis" }
    ]
  },
  {
    phase: "FASE 2: FILE MANIPULATION",
    commands: [
      { name: "mkdir", description: "Directory aanmaken" },
      { name: "touch", description: "Bestand aanmaken" },
      { name: "rm", description: "Bestanden verwijderen" }
    ]
  },
  {
    phase: "FASE 3: RECONNAISSANCE",
    commands: [
      { name: "ping", description: "Test verbinding" },
      { name: "nmap", description: "Scan netwerk poorten" },
      { name: "ifconfig", description: "Network interfaces" },
      { name: "netstat", description: "Actieve verbindingen" }
    ]
  },
  {
    phase: "FASE 4: SECURITY TOOLS",
    commands: [
      { name: "hashcat", description: "Crack wachtwoorden" },
      { name: "hydra", description: "Brute-force login" },
      { name: "sqlmap", description: "SQL injection scanner" },
      { name: "metasploit", description: "Exploit framework" },
      { name: "nikto", description: "Web scanner" }
    ]
  }
];

function isTried(name, triedSet) {
  return triedSet.has(name);
}

function getPhaseStats(phase, triedSet) {
  var total = phase.commands.length;
  var completed = phase.commands.filter(function(c) { return isTried(c.name, triedSet); }).length;
  return { completed: completed, total: total, percentage: Math.round(completed / total * 100) };
}

function buildEmptyLine(width) {
  var inner = width - 2;
  return B.vertical + ' '.repeat(inner) + B.vertical;
}

function buildBoxOutput(triedSet, width) {
  var inner = width - 2;
  var lines = [];

  // Header: ╭─── LEERPAD: ETHICAL HACKER ───╮
  var label = ' LEERPAD: ETHICAL HACKER ';
  var remaining = inner - label.length;
  var leftPad = Math.floor(remaining / 2);
  var rightPad = remaining - leftPad;
  lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

  lines.push(buildEmptyLine(width));

  var allUnlocked = true;

  phases.forEach(function(phase, idx) {
    var stats = getPhaseStats(phase, triedSet);
    var done = stats.completed === stats.total;

    // Phase header: │  [X] FASE 1: TERMINAL BASICS (3/7)  │
    var checkbox = done ? '[X]' : '[ ]';
    var phaseText = '  ' + checkbox + ' ' + phase.phase + ' (' + stats.completed + '/' + stats.total + ')';
    var phasePad = inner - phaseText.length;
    lines.push(B.vertical + phaseText + ' '.repeat(Math.max(0, phasePad)) + B.vertical);

    // Phase 4 locked unless phase 3 completed
    if (idx === 3 && !allUnlocked) {
      var lockText = '      [!] Voltooi eerst alle Fase 3 commands';
      var lockPad = inner - lockText.length;
      lines.push(B.vertical + lockText + ' '.repeat(Math.max(0, lockPad)) + B.vertical);
    } else {
      // Command rows
      phase.commands.forEach(function(cmd) {
        var tried = isTried(cmd.name, triedSet);
        var cb = tried ? '[X]' : '[ ]';
        var descMaxLen = inner - 6 - 3 - 1 - 13 - 2;
        var rowText = '      ' + cb + ' ' + cmd.name.padEnd(13) + '- ' + smartTruncate(cmd.description, descMaxLen);
        var rowPad = inner - rowText.length;
        lines.push(B.vertical + rowText + ' '.repeat(Math.max(0, rowPad)) + B.vertical);
      });
    }

    if (idx < phases.length - 1) {
      lines.push(buildEmptyLine(width));
    }

    allUnlocked = done;
  });

  lines.push(buildEmptyLine(width));

  // TIP inside box
  lines.push(B.dividerLeft + B.horizontal.repeat(inner) + B.dividerRight);
  var tipText = "  [?] Type 'next' voor je volgende stap";
  lines.push(B.vertical + tipText.padEnd(inner) + B.vertical);

  // Footer
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  return lines.join('\n');
}

function buildMobileOutput(triedSet) {
  var out = '\n**LEERPAD: ETHICAL HACKER**\n\n';
  var allUnlocked = true;

  phases.forEach(function(phase, idx) {
    var stats = getPhaseStats(phase, triedSet);
    var done = stats.completed === stats.total;
    var checkbox = done ? '[X]' : '[ ]';
    out += checkbox + ' **' + phase.phase + '** (' + stats.completed + '/' + stats.total + ')\n';

    if (idx === 3 && !allUnlocked) {
      out += '    [!] Voltooi eerst alle Fase 3 commands\n';
    } else {
      phase.commands.forEach(function(cmd) {
        var tried = isTried(cmd.name, triedSet);
        var cb = tried ? '[X]' : '[ ]';
        out += '    ' + cb + ' ' + cmd.name + ' - ' + cmd.description + '\n';
      });
    }

    out += '\n';
    allUnlocked = done;
  });

  out += "[?] Type 'next' voor je volgende stap\n";
  return out;
}

function getTriedCommands() {
  return new Set(onboarding.getCommandsTried());
}

export default {
  name: "leerpad",
  description: "Toon leerpad met voortgang",
  category: "system",

  execute() {
    var triedSet = getTriedCommands();

    var output;
    if (isMobileView()) {
      output = buildMobileOutput(triedSet);
    } else {
      // Calculate width ONCE and thread through
      var width = getResponsiveBoxWidth();
      output = buildBoxOutput(triedSet, width);
    }

    return output;
  },

  manPage: "\nNAAM\n    leerpad - toon leerpad met voortgang\n\nSYNOPSIS\n    leerpad\n\nBESCHRIJVING\n    Toont je leerpad als ethical hacker in 4 fases. Elke command\n    die je correct uitvoert wordt automatisch afgevinkt, zodat je\n    je voortgang kunt volgen.\n\n    FASE 1: TERMINAL BASICS\n        Leer de basis terminal commands. Begin hier als je nieuw bent.\n        Commands: help, ls, cd, pwd, cat, whoami, history\n\n    FASE 2: FILE MANIPULATION\n        Leer bestanden en directories maken en verwijderen.\n        Commands: mkdir, touch, rm\n\n    FASE 3: RECONNAISSANCE\n        Leer netwerk scanning en informatie verzamelen.\n        Commands: ping, nmap, ifconfig, netstat\n\n    FASE 4: SECURITY TOOLS\n        Geavanceerde security testing tools. Let op: educatief gebruik!\n        Commands: hashcat, hydra, sqlmap, metasploit, nikto\n\n        [!] Deze fase is vergrendeld totdat je Fase 3 hebt voltooid.\n\nVOORTGANG TRACKING\n    Je voortgang wordt automatisch opgeslagen in je browser.\n\n    Symbolen:\n        [X] Fase voltooid\n        [ ] Fase niet voltooid\n        [X] command   Command uitgeprobeerd\n        [ ] command   Command nog niet geprobeerd\n\nVOORBEELDEN\n    leerpad\n        Bekijk je huidige voortgang\n\n    help\n        Zie alle beschikbare commands\n\n    man nmap\n        Leer hoe een specifiek command werkt\n\nTIPS\n    • Begin met Fase 1 als je nieuw bent\n    • Type 'help' om alle commands te zien\n    • Commands worden alleen afgevinkt bij correct gebruik (met argumenten)\n    • Fase 4 wordt ontgrendeld na voltooiing van Fase 3\n\n    [HACKSIM] Dit command is uniek voor HackSimulator.\n       Het bestaat niet in standaard Linux.\n\n    [+] In real Linux:\n       Er is geen leerpad command. Ethisch hacken leer je via\n       certificeringen (CEH, OSCP) en CTF.\n\nGERELATEERDE COMMANDO'S\n    help (alle commands), man (gedetailleerde uitleg)\n".trim()
};
