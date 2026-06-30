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
      { name: "rm", description: "Bestanden verwijderen" },
      { name: "cp", description: "Bestanden kopiëren" },
      { name: "mv", description: "Bestanden verplaatsen" },
      { name: "echo", description: "Tekst weergeven" }
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

// Eén canonieke ladder (Beginner/Gevorderd/Expert) — dezelfde taal als de homepage
// en het tutorial-systeem. De 4 fases worden gegroepeerd onder de 3 niveaus, elk met
// een brug naar de bijbehorende begeleide missie (oefenen ↔ tutorial = twee views).
// EXPERT (Fase 4) blijft vergrendeld tot GEVORDERD (Fase 3) compleet is.
const tiers = [
  { name: "BEGINNER",  phases: [phases[0], phases[1]], tutorial: "fundamentals" },
  { name: "GEVORDERD", phases: [phases[2]],            tutorial: "recon" },
  { name: "EXPERT",    phases: [phases[3]],            tutorial: "exploitation" }
];

function isExpertUnlocked(triedSet) {
  var s = getPhaseStats(phases[2], triedSet); // GEVORDERD = Fase 3
  return s.completed === s.total;
}

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

  // Boxed content line, links uitgelijnd + gepad tot de binnenbreedte (kader = wit;
  // markers binnenin worden niet door de renderer gekleurd want regel begint met │).
  var pushLine = function(text) {
    lines.push(B.vertical + text + ' '.repeat(Math.max(0, inner - text.length)) + B.vertical);
  };

  var expertUnlocked = isExpertUnlocked(triedSet);

  tiers.forEach(function(tier, tIdx) {
    // Niveau-kop (geen checkbox = visueel onderscheiden van de fase-koppen eronder)
    pushLine('  ' + tier.name);

    var locked = (tier.name === 'EXPERT' && !expertUnlocked);
    if (locked) {
      var prev = getPhaseStats(phases[2], triedSet);
      var rem = prev.total - prev.completed;
      pushLine('    [!] Vergrendeld - voltooi eerst Gevorderd (nog ' + rem + ' commando' + (rem === 1 ? '' : "'s") + ')');
    } else {
      tier.phases.forEach(function(phase) {
        var stats = getPhaseStats(phase, triedSet);
        var done = stats.completed === stats.total;
        var checkbox = done ? '[✓]' : '[ ]';
        pushLine('    ' + checkbox + ' ' + phase.phase + ' (' + stats.completed + '/' + stats.total + ')');

        phase.commands.forEach(function(cmd) {
          var cb = isTried(cmd.name, triedSet) ? '[✓]' : '[ ]';
          var descMaxLen = inner - 8 - 3 - 1 - 13 - 2;
          pushLine('        ' + cb + ' ' + cmd.name.padEnd(13) + '- ' + smartTruncate(cmd.description, descMaxLen));
        });
      });
      // Brug naar de begeleide missie van dit niveau (oefenen ↔ tutorial)
      pushLine('    [→] Begeleide missie: tutorial ' + tier.tutorial);
    }

    if (tIdx < tiers.length - 1) {
      lines.push(buildEmptyLine(width));
    }
  });

  lines.push(buildEmptyLine(width));

  // TIP inside box
  lines.push(B.dividerLeft + B.horizontal.repeat(inner) + B.dividerRight);
  pushLine("  [?] Type 'next' voor je volgende stap");

  // Footer
  lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

  return lines.join('\n');
}

function buildMobileOutput(triedSet) {
  var out = '\n**LEERPAD: ETHICAL HACKER**\n\n';
  var expertUnlocked = isExpertUnlocked(triedSet);

  tiers.forEach(function(tier) {
    // Niveau-kop als eigen bold block-heading
    out += '**' + tier.name + '**\n';

    var locked = (tier.name === 'EXPERT' && !expertUnlocked);
    if (locked) {
      out += '  [!] Vergrendeld - voltooi eerst Gevorderd\n';
    } else {
      tier.phases.forEach(function(phase) {
        var stats = getPhaseStats(phase, triedSet);
        var done = stats.completed === stats.total;
        // Voltooid = [✓] (renderer → success/groen). Niet-voltooid = [ ] (geen marker → wit).
        // Vinkje + count BINNEN de bold: mobile.css geeft strong display:block, dus alles
        // buiten **..** zou op een eigen regel "zweven"; binnen de bold = schone heading,
        // [✓] wordt groen via de .marker-success span (renderer._formatText).
        var checkbox = done ? '[✓]' : '[ ]';
        out += '**' + checkbox + ' ' + phase.phase + ' (' + stats.completed + '/' + stats.total + ')**\n';

        // Command-rijen springen 2 spaties in (NIET ≥3): zo zijn niet-voltooide regels geen
        // continuation-line en erven ze geen kleur van een groene regel erboven (renderer.js).
        phase.commands.forEach(function(cmd) {
          var cb = isTried(cmd.name, triedSet) ? '[✓]' : '[ ]';
          out += '  ' + cb + ' ' + cmd.name + ' - ' + cmd.description + '\n';
        });
      });
      // Brug naar de begeleide missie ([→] → renderer kleurt info/cyaan na trim)
      out += '  [→] Begeleide missie: tutorial ' + tier.tutorial + '\n';
    }

    out += '\n';
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

  manPage: "\nNAAM\n    leerpad - toon leerpad met voortgang\n\nSYNOPSIS\n    leerpad\n\nBESCHRIJVING\n    Toont je leerpad als ethical hacker in 3 niveaus (Beginner,\n    Gevorderd, Expert), opgebouwd uit 4 fases. Elke command die je\n    correct uitvoert wordt automatisch afgevinkt. Bij elk niveau hoort\n    een begeleide missie (zie 'tutorial') die dezelfde stof stap voor\n    stap leert - oefenen en missie zijn twee views op hetzelfde niveau.\n\n    BEGINNER (Fase 1+2)   -> begeleide missie: tutorial fundamentals\n    GEVORDERD (Fase 3)    -> begeleide missie: tutorial recon\n    EXPERT (Fase 4)       -> begeleide missie: tutorial exploitation\n\n    FASE 1: TERMINAL BASICS\n        Leer de basis terminal commands. Begin hier als je nieuw bent.\n        Commands: help, ls, cd, pwd, cat, whoami, history\n\n    FASE 2: FILE MANIPULATION\n        Leer bestanden en directories maken en verwijderen.\n        Commands: mkdir, touch, rm\n\n    FASE 3: RECONNAISSANCE\n        Leer netwerk scanning en informatie verzamelen.\n        Commands: ping, nmap, ifconfig, netstat\n\n    FASE 4: SECURITY TOOLS\n        Geavanceerde security testing tools. Let op: educatief gebruik!\n        Commands: hashcat, hydra, sqlmap, metasploit, nikto\n\n        [!] Deze fase is vergrendeld totdat je Fase 3 hebt voltooid.\n\nVOORTGANG TRACKING\n    Je voortgang wordt automatisch opgeslagen in je browser.\n\n    Symbolen:\n        Voltooid        [✓]   (fase of command afgevinkt)\n        Niet voltooid   [ ]   (nog te doen)\n\nVOORBEELDEN\n    leerpad\n        Bekijk je huidige voortgang\n\n    help\n        Zie alle beschikbare commands\n\n    man nmap\n        Leer hoe een specifiek command werkt\n\nTIPS\n    • Begin met 'tutorial fundamentals' als je nieuw bent\n    • Type 'help' om alle commands te zien\n    • Commands worden alleen afgevinkt bij correct gebruik (met argumenten)\n    • Fase 4 wordt ontgrendeld na voltooiing van Fase 3\n\n    [HACKSIM] Dit command is uniek voor HackSimulator.\n       Het bestaat niet in standaard Linux.\n\n    [+] In real Linux:\n       Er is geen leerpad command. Ethisch hacken leer je via\n       certificeringen (CEH, OSCP) en CTF.\n\nGERELATEERDE COMMANDO'S\n    tutorial (begeleide missies per niveau), next (je volgende stap),\n    challenge (test jezelf), help (alle commands), man (uitleg)\n".trim()
};
