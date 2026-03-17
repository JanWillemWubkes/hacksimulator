/**
 * hint command — Progressive help during tutorials.
 *
 * Each invocation escalates: general hint → specific hint → exact command.
 * Does NOT count as a wrong attempt — no penalty for asking help.
 */

import tutorialManager from '../../tutorial/tutorial-manager.js';

export default {
  name: 'hint',
  description: 'Vraag een hint tijdens een tutorial',
  category: 'system',

  execute: function() {
    if (!tutorialManager.isActive()) {
      return '[?] Geen actieve tutorial. Type \'tutorial\' om een missie te starten, of \'help\' voor hulp.';
    }

    var result = tutorialManager.getHint();

    if (!result) {
      return '[?] Geen hints beschikbaar voor deze stap.';
    }

    var output = '[?] Hint (' + result.tier + '/' + result.maxTier + '): ' + result.text;

    if (result.tier < result.maxTier) {
      output += '\n[?] Nog vastzit? Type \'hint\' opnieuw voor een specifiekere hint.';
    }

    return output;
  },

  manPage: (
    "NAAM\n" +
    "    hint - vraag een hint tijdens een tutorial\n" +
    "\n" +
    "SYNOPSIS\n" +
    "    hint\n" +
    "\n" +
    "BESCHRIJVING\n" +
    "    Toont een progressieve hint voor de huidige tutorial stap.\n" +
    "    Elke keer dat je 'hint' typt krijg je een specifiekere hint:\n" +
    "\n" +
    "    Hint 1/3   Algemene richting (welk commando?)\n" +
    "    Hint 2/3   Specifiekere aanwijzing (welke syntax?)\n" +
    "    Hint 3/3   Het exacte commando dat je moet typen\n" +
    "\n" +
    "    Hints vragen telt NIET als een foute poging. Er is geen\n" +
    "    straf voor het vragen van hulp!\n" +
    "\n" +
    "VOORBEELDEN\n" +
    "    tutorial recon\n" +
    "    hint                  Toon eerste hint\n" +
    "    hint                  Toon specifiekere hint\n" +
    "    hint                  Toon exact commando\n" +
    "\n" +
    "TIPS\n" +
    "    - Hint teller reset automatisch bij elke nieuwe stap\n" +
    "    - Werkt alleen tijdens een actieve tutorial\n" +
    "    - Combineer met 'man <command>' voor uitgebreide uitleg\n" +
    "\n" +
    "    [HACKSIM] Dit command is uniek voor HackSimulator.\n" +
    "       Het bestaat niet in standaard Linux.\n" +
    "\n" +
    "GERELATEERDE COMMANDO'S\n" +
    "    tutorial (start missie), man (command uitleg), help (alle commands)"
  )
};
