/**
 * leerpad - Display learning path with progress tracking
 * Shows 3-phase hacker progression with checked/unchecked commands
 */

// ─────────────────────────────────────────────────
// Box Drawing Configuration
// ─────────────────────────────────────────────────
const BOX = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  dividerLeft: '├',
  dividerRight: '┤'
};

const BOX_WIDTH = 56; // Wider for phase descriptions
const COMMAND_COL_WIDTH = 13; // Width for command name

// ─────────────────────────────────────────────────
// Learning Path Data (4-Phase Progression)
// ─────────────────────────────────────────────────
const LEARNING_PATH = [
  {
    phase: 'FASE 1: TERMINAL BASICS',
    commands: [
      { name: 'help', description: 'Commands ontdekken' },
      { name: 'ls', description: 'Bestanden bekijken' },
      { name: 'cd', description: 'Navigeren' },
      { name: 'pwd', description: 'Huidige locatie' },
      { name: 'cat', description: 'Bestanden lezen' },
      { name: 'whoami', description: 'Je identiteit' },
      { name: 'history', description: 'Command geschiedenis' }
    ]
  },
  {
    phase: 'FASE 2: FILE MANIPULATION',
    commands: [
      { name: 'mkdir', description: 'Directory aanmaken' },
      { name: 'touch', description: 'Bestand aanmaken' },
      { name: 'rm', description: 'Bestanden verwijderen' }
    ]
  },
  {
    phase: 'FASE 3: RECONNAISSANCE',
    commands: [
      { name: 'ping', description: 'Test verbinding' },
      { name: 'nmap', description: 'Scan netwerk poorten' },
      { name: 'ifconfig', description: 'Network interfaces' },
      { name: 'netstat', description: 'Actieve verbindingen' }
    ]
  },
  {
    phase: 'FASE 4: SECURITY TOOLS',
    commands: [
      { name: 'hashcat', description: 'Crack wachtwoorden' },
      { name: 'hydra', description: 'Brute-force login' },
      { name: 'sqlmap', description: 'SQL injection scanner' },
      { name: 'metasploit', description: 'Exploit framework' },
      { name: 'nikto', description: 'Web scanner' }
    ]
  }
];

// ─────────────────────────────────────────────────
// localStorage Management
// ─────────────────────────────────────────────────

const STORAGE_KEY = 'hacksim_commands_tried';

/**
 * Get list of tried commands from localStorage
 * @returns {Set<string>} Set of command names
 */
function getTriedCommands() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();

    const commands = stored.split(',').filter(cmd => cmd.trim());
    return new Set(commands);
  } catch (e) {
    console.warn('Could not read tried commands:', e);
    return new Set();
  }
}

/**
 * Check if command has been tried
 * @param {string} commandName
 * @param {Set<string>} triedCommands
 * @returns {boolean}
 */
function hasTriedCommand(commandName, triedCommands) {
  return triedCommands.has(commandName);
}

/**
 * Calculate phase progress
 * @param {Object} phase - Phase object with commands array
 * @param {Set<string>} triedCommands
 * @returns {Object} { completed, total, percentage }
 */
function calculatePhaseProgress(phase, triedCommands) {
  const total = phase.commands.length;
  const completed = phase.commands.filter(cmd =>
    hasTriedCommand(cmd.name, triedCommands)
  ).length;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
}

// ─────────────────────────────────────────────────
// Helper Functions - Box Drawing
// ─────────────────────────────────────────────────

/**
 * Creates main header
 * Example: ╭────────── LEERPAD: ETHICAL HACKER ──────────╮
 */
function createHeader(title) {
  const titleText = ` ${title} `;
  const totalPadding = BOX_WIDTH - 2 - titleText.length;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  return BOX.topLeft +
    BOX.horizontal.repeat(leftPadding) +
    titleText +
    BOX.horizontal.repeat(rightPadding) +
    BOX.topRight;
}

/**
 * Creates phase header with progress
 * Example: │  [ ✓ ] FASE 1: TERMINAL BASICS (5/7)         │
 */
function createPhaseHeader(phaseName, progress, isComplete) {
  const checkbox = isComplete ? '✓' : '○';
  const progressText = `(${progress.completed}/${progress.total})`;
  const content = `  [ ${checkbox} ] ${phaseName} ${progressText}`;
  const padding = BOX_WIDTH - 2 - content.length;
  return BOX.vertical + content + ' '.repeat(Math.max(0, padding)) + BOX.vertical;
}

/**
 * Creates command row with checkbox
 * Example: │      ✓ help         - Commands ontdekken     │
 */
function createCommandRow(command, isTried) {
  const checkbox = isTried ? '✓' : '○';
  const cmdName = command.name.padEnd(COMMAND_COL_WIDTH);
  const content = `      ${checkbox} ${cmdName}- ${command.description}`;
  const padding = BOX_WIDTH - 2 - content.length;
  return BOX.vertical + content + ' '.repeat(Math.max(0, padding)) + BOX.vertical;
}

/**
 * Creates empty row for spacing
 */
function createEmptyRow() {
  const innerWidth = BOX_WIDTH - 2;
  return BOX.vertical + ' '.repeat(innerWidth) + BOX.vertical;
}

/**
 * Creates bottom border
 */
function createFooter() {
  const innerWidth = BOX_WIDTH - 2;
  return BOX.bottomLeft + BOX.horizontal.repeat(innerWidth) + BOX.bottomRight;
}

/**
 * Creates locked phase indicator
 * Example: │      [ ! ] Unlock na Fase 2 voltooiing       │
 */
function createLockedMessage(requiredPhase) {
  const content = `      [ ! ] Unlock na ${requiredPhase} voltooiing`;
  const padding = BOX_WIDTH - 2 - content.length;
  return BOX.vertical + content + ' '.repeat(Math.max(0, padding)) + BOX.vertical;
}

// ─────────────────────────────────────────────────
// Main Rendering Logic
// ─────────────────────────────────────────────────

/**
 * Render complete learning path
 * @param {Set<string>} triedCommands
 * @returns {string}
 */
function renderLearningPath(triedCommands) {
  const lines = [];

  // Header
  lines.push(createHeader('LEERPAD: ETHICAL HACKER'));
  lines.push(createEmptyRow());

  // Track if previous phase is complete (for locking Fase 4)
  let previousPhaseComplete = true;

  // Render each phase
  LEARNING_PATH.forEach((phase, phaseIndex) => {
    const progress = calculatePhaseProgress(phase, triedCommands);
    const isComplete = progress.completed === progress.total;

    // Phase header
    lines.push(createPhaseHeader(phase.phase, progress, isComplete));

    // Fase 4 locking logic: Only show commands if Fase 3 is complete
    const isFase4 = phaseIndex === 3;
    const shouldLock = isFase4 && !previousPhaseComplete;

    if (shouldLock) {
      // Show locked message instead of commands
      lines.push(createLockedMessage('Fase 3'));
    } else {
      // Show commands with checkboxes
      phase.commands.forEach(cmd => {
        const isTried = hasTriedCommand(cmd.name, triedCommands);
        lines.push(createCommandRow(cmd, isTried));
      });
    }

    // Add spacing between phases (except last)
    if (phaseIndex < LEARNING_PATH.length - 1) {
      lines.push(createEmptyRow());
    }

    // Track phase completion for next iteration
    previousPhaseComplete = isComplete;
  });

  // Footer
  lines.push(createEmptyRow());
  lines.push(createFooter());

  return lines.join('\n');
}

// ─────────────────────────────────────────────────
// Command Implementation
// ─────────────────────────────────────────────────

export default {
  name: 'leerpad',
  description: 'Toon leerpad met voortgang',
  category: 'system',
  execute() {
    const triedCommands = getTriedCommands();
    let output = renderLearningPath(triedCommands);

    // Educational tips
    output += '\n\n';
    output += '[ ? ] TIP: Type een command om progressie te maken!\n';
    output += '[ ? ] TIP: Type \'man <command>\' voor uitleg over een tool';

    return output;
  },
  manPage: `
NAAM
    leerpad - toon leerpad met voortgang

SYNOPSIS
    leerpad

BESCHRIJVING
    Toont je leerpad als ethical hacker in 4 fases. Elke command
    die je correct uitvoert wordt automatisch afgevinkt, zodat je
    je voortgang kunt volgen.

    FASE 1: TERMINAL BASICS
        Leer de basis terminal commands. Begin hier als je nieuw bent.
        Commands: help, ls, cd, pwd, cat, whoami, history

    FASE 2: FILE MANIPULATION
        Leer bestanden en directories maken en verwijderen.
        Commands: mkdir, touch, rm

    FASE 3: RECONNAISSANCE
        Leer netwerk scanning en informatie verzamelen.
        Commands: ping, nmap, ifconfig, netstat

    FASE 4: SECURITY TOOLS
        Geavanceerde security testing tools. Let op: educatief gebruik!
        Commands: hashcat, hydra, sqlmap, metasploit, nikto

        [ ! ] Deze fase is vergrendeld totdat je Fase 3 hebt voltooid.

VOORTGANG TRACKING
    Je voortgang wordt automatisch opgeslagen in je browser.

    Symbolen:
        [ ✓ ] Fase voltooid
        [ ○ ] Fase niet voltooid
        ✓ command   Command uitgeprobeerd
        ○ command   Command nog niet geprobeerd

VOORBEELDEN
    leerpad
        Bekijk je huidige voortgang

    help
        Zie alle beschikbare commands

    man nmap
        Leer hoe een specifiek command werkt

TIPS
    • Begin met Fase 1 als je nieuw bent
    • Type 'help' om alle commands te zien
    • Commands worden alleen afgevinkt bij correct gebruik (met argumenten)
    • Fase 4 wordt ontgrendeld na voltooiing van Fase 3

GERELATEERDE COMMANDO'S
    help (alle commands), man (gedetailleerde uitleg)
`.trim()
};
