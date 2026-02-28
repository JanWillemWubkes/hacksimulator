/**
 * Leaderboard Data — Simulated player entries for the leaderboard.
 *
 * 10 hardcoded entries spread across the 5-315 point range.
 * Max simulated (295) < max achievable (315) so the player can reach #1.
 * Names mix Dutch culture with hacker aesthetics.
 */

var SIMULATED_ENTRIES = [
  { name: 'Sh4d0wR00t', points: 295, title: 'Hacker Elite' },
  { name: 'CyberKees', points: 250, title: 'Pentester' },
  { name: 'ByteStorm_NL', points: 210, title: 'Red Teamer' },
  { name: 'NullPointerNina', points: 175, title: 'Bug Hunter' },
  { name: 'HackWillem', points: 140, title: 'Scripter' },
  { name: 'TerminalTess', points: 105, title: 'Analyst' },
  { name: 'P1ngMaster', points: 75, title: 'Explorer' },
  { name: 'R00kieRuud', points: 45, title: 'Beginner' },
  { name: 'CtrlAltDaan', points: 20, title: 'Newbie' },
  { name: 'ScriptKiddieMax', points: 5, title: 'Script Kiddie' }
];

export default SIMULATED_ENTRIES;
