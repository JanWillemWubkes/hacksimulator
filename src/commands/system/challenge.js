/**
 * challenge command — Entry point for hack challenges.
 *
 * Subcommands: (none)/list, start <id>, status, hint, exit, reset
 */

import challengeManager from '../../gamification/challenge-manager.js';

export default {
  name: 'challenge',
  description: 'Hack challenges om je skills te testen',
  category: 'system',
  usage: 'challenge [start <id>|status|hint|exit]',

  execute: function(args) {
    var sub = args.length > 0 ? args[0].toLowerCase() : '';

    // challenge (no args) or challenge list
    if (sub === '' || sub === 'list') {
      var challenges = challengeManager.listChallenges();
      return challengeManager._renderer.renderChallengeList(challenges);
    }

    // challenge start <id>
    if (sub === 'start') {
      var challengeId = args.length > 1 ? args[1].toLowerCase() : '';
      if (!challengeId) {
        return '[?] Gebruik: challenge start <challenge-id>\n\n' +
               '[?] Type \'challenge\' om beschikbare challenges te zien.';
      }
      return challengeManager.start(challengeId);
    }

    // challenge status
    if (sub === 'status') {
      return renderStatus();
    }

    // challenge hint
    if (sub === 'hint') {
      return challengeManager.getHint();
    }

    // challenge exit
    if (sub === 'exit' || sub === 'stop' || sub === 'quit') {
      return challengeManager.exit();
    }

    // challenge reset (hidden/debug)
    if (sub === 'reset') {
      challengeManager.reset();
      return '[✓] Challenge voortgang gereset.';
    }

    // Maybe user typed challenge ID directly: challenge network-scout
    var challenge = challengeManager.getChallenge(sub);
    if (challenge) {
      return challengeManager.start(sub);
    }

    return '[?] Onbekend subcommando: ' + sub + '\n\n' +
           '[?] Gebruik: challenge [start <id>|status|hint|exit]\n' +
           '[?] Type \'challenge\' voor beschikbare challenges.';
  },

  manPage: (
    "NAAM\n" +
    "    challenge - hack challenges om je skills te testen\n" +
    "\n" +
    "SYNOPSIS\n" +
    "    challenge                      Toon beschikbare challenges\n" +
    "    challenge start <id>           Start een challenge\n" +
    "    challenge <id>                 Start een challenge (snelkoppeling)\n" +
    "    challenge status               Toon huidige voortgang\n" +
    "    challenge hint                 Vraag een hint op\n" +
    "    challenge exit                 Verlaat challenge\n" +
    "    challenge reset                Reset challenge voortgang (debug)\n" +
    "\n" +
    "BESCHRIJVING\n" +
    "    Het challenge systeem biedt hack-opdrachten van oplopende\n" +
    "    moeilijkheidsgraad. Anders dan tutorials zijn challenges\n" +
    "    open-ended: je moet zelf uitzoeken welke commando's je nodig\n" +
    "    hebt om het doel te bereiken.\n" +
    "\n" +
    "    MOEILIJKHEIDSGRADEN\n" +
    "        EASY     5-10 punten    Basis commando's combineren\n" +
    "        MEDIUM   15-25 punten   Meerdere tools combineren\n" +
    "        HARD     30-50 punten   Complexe scenario's oplossen\n" +
    "\n" +
    "    HINT SYSTEEM\n" +
    "        Na 3 pogingen   - Eerste hint (richting)\n" +
    "        Na 6 pogingen   - Tweede hint (specifieker)\n" +
    "        Na 10 pogingen  - Derde hint (bijna het antwoord)\n" +
    "\n" +
    "    Je voortgang en punten worden opgeslagen. Voltooide challenges\n" +
    "    zijn zichtbaar in het dashboard.\n" +
    "\n" +
    "VOORBEELDEN\n" +
    "    challenge\n" +
    "        Bekijk alle beschikbare challenges met status\n" +
    "\n" +
    "    challenge network-scout\n" +
    "        Start de Network Scout challenge\n" +
    "\n" +
    "    challenge status\n" +
    "        Bekijk je voortgang in de actieve challenge\n" +
    "\n" +
    "    challenge hint\n" +
    "        Vraag een hint op als je vastloopt\n" +
    "\n" +
    "TIPS\n" +
    "    - Begin met de EASY challenges als je nieuw bent\n" +
    "    - Lees de mission briefing goed door voor aanwijzingen\n" +
    "    - Gebruik 'man <command>' als je niet weet hoe een tool werkt\n" +
    "    - Hints worden beter naarmate je meer pogingen doet\n" +
    "\n" +
    "GERELATEERDE COMMANDO'S\n" +
    "    tutorial (begeleide scenario's), achievements (badges), dashboard (voortgang)"
  )
};

function renderStatus() {
  var status = challengeManager.getStatus();

  if (!status.active) {
    if (status.completedCount > 0) {
      return '[?] Geen actieve challenge.\n' +
             '[✓] Voltooide challenges: ' + status.completedCount + '\n' +
             '[✓] Totaal punten: ' + status.totalPoints + '\n\n' +
             '[?] Type \'challenge\' om beschikbare challenges te zien.';
    }
    return '[?] Geen actieve challenge.\n\n' +
           '[?] Type \'challenge\' om te beginnen.';
  }

  var output = '[?] Actieve challenge: ' + status.challengeTitle + '\n';
  output += '[?] Moeilijkheid: ' + status.difficulty.toUpperCase() + ' | Punten: ' + status.points + '\n';
  output += '[?] Pogingen: ' + status.attempts + '\n\n';

  output += 'Doelen:\n';
  status.progress.forEach(function(p) {
    var icon = p.met ? '[X]' : '[ ]';
    output += '  ' + icon + ' ' + p.description + '\n';
  });

  return output;
}
