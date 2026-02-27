/**
 * achievements command — View and filter earned badges.
 *
 * Subcommands: (none)/all, unlocked, rarity <level>
 */

import badgeManager from '../../gamification/badge-manager.js';

var VALID_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export default {
  name: 'achievements',
  description: 'Bekijk je badges en achievements',
  category: 'system',
  usage: 'achievements [all|unlocked|rarity <level>]',

  execute: function(args) {
    var sub = args.length > 0 ? args[0].toLowerCase() : '';

    // achievements (no args) or achievements all
    if (sub === '' || sub === 'all') {
      var allBadges = badgeManager.listBadges({ filter: 'all' });
      var output = badgeManager.renderGallery(allBadges, 'ACHIEVEMENTS');
      output += '\n\n[TIP] Gebruik \'achievements unlocked\' om alleen je verdiende badges te zien.';
      output += '\n[TIP] Gebruik \'achievements rarity rare\' om te filteren op zeldzaamheid.';
      return output;
    }

    // achievements unlocked
    if (sub === 'unlocked' || sub === 'earned') {
      var unlocked = badgeManager.listBadges({ filter: 'unlocked' });
      if (unlocked.length === 0) {
        return '[?] Je hebt nog geen badges verdiend.\n\n' +
               '[TIP] Voer commando\'s uit en voltooi challenges om badges te verdienen!\n' +
               '[TIP] Type \'achievements\' om te zien welke badges beschikbaar zijn.';
      }
      return badgeManager.renderGallery(unlocked, 'VERDIENDE BADGES');
    }

    // achievements rarity <level>
    if (sub === 'rarity') {
      var level = args.length > 1 ? args[1].toLowerCase() : '';

      if (!level || VALID_RARITIES.indexOf(level) === -1) {
        return '[?] Gebruik: achievements rarity <level>\n\n' +
               '[?] Beschikbare levels: ' + VALID_RARITIES.join(', ') + '\n' +
               '[TIP] Hogere rarities zijn moeilijker te verdienen!';
      }

      var filtered = badgeManager.listBadges({ rarity: level });
      return badgeManager.renderGallery(filtered, level.toUpperCase() + ' BADGES');
    }

    // achievements locked (undocumented but useful)
    if (sub === 'locked') {
      var locked = badgeManager.listBadges({ filter: 'locked' });
      if (locked.length === 0) {
        return '[✓] Gefeliciteerd! Je hebt alle badges verdiend!';
      }
      return badgeManager.renderGallery(locked, 'LOCKED BADGES');
    }

    return '[?] Onbekend subcommando: ' + sub + '\n\n' +
           '[?] Gebruik: achievements [all|unlocked|rarity <level>]\n' +
           '[TIP] Type \'achievements\' voor een overzicht van alle badges.';
  },

  manPage: (
    "NAAM\n" +
    "    achievements - bekijk je badges en achievements\n" +
    "\n" +
    "SYNOPSIS\n" +
    "    achievements                    Toon alle badges\n" +
    "    achievements all                Toon alle badges (zelfde als hierboven)\n" +
    "    achievements unlocked           Toon alleen verdiende badges\n" +
    "    achievements rarity <level>     Filter op zeldzaamheid\n" +
    "\n" +
    "BESCHRIJVING\n" +
    "    Het achievement systeem beloont je met badges voor milestones\n" +
    "    die je bereikt tijdens het leren. Badges worden automatisch\n" +
    "    ontgrendeld wanneer je aan de voorwaarden voldoet.\n" +
    "\n" +
    "    ZELDZAAMHEID (RARITY)\n" +
    "        [*] COMMON      Basis milestones (8 badges)\n" +
    "        [+] UNCOMMON    Gevorderde milestones (6 badges)\n" +
    "        [#] RARE        Uitdagende milestones (4 badges)\n" +
    "        [!] EPIC        Indrukwekkende prestaties (2 badges)\n" +
    "        [S] LEGENDARY   Ultieme meesterschap (1 badge)\n" +
    "\n" +
    "    Badges worden verdiend door commando's uit te voeren,\n" +
    "    challenges te voltooien, en dagelijkse streaks te halen.\n" +
    "\n" +
    "VOORBEELDEN\n" +
    "    achievements\n" +
    "        Bekijk al je badges (unlocked en locked)\n" +
    "\n" +
    "    achievements unlocked\n" +
    "        Toon alleen de badges die je al hebt verdiend\n" +
    "\n" +
    "    achievements rarity epic\n" +
    "        Bekijk alle epic badges\n" +
    "\n" +
    "TIPS\n" +
    "    - Locked badges tonen '???' als naam — ontgrendel ze om te ontdekken!\n" +
    "    - Hogere rarities vereisen meer inspanning maar zijn zeldzamer\n" +
    "    - Sommige badges vereisen een dagelijkse streak — kom elke dag terug!\n" +
    "\n" +
    "GERELATEERDE COMMANDO'S\n" +
    "    challenge (hack opdrachten), tutorial (begeleide scenario's), dashboard (voortgang)"
  )
};
