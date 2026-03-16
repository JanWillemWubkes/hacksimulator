/**
 * welcome - Re-display the welcome message / fase roadmap
 * HackSimulator-only command
 */

import onboarding from '../../ui/onboarding.js';

export default {
  name: 'welcome',
  description: 'Toon het welkomstbericht opnieuw',
  category: 'system',
  usage: 'welcome',

  execute() {
    return onboarding._getFirstTimeWelcome();
  },

  manPage: (
    "NAAM\n" +
    "    welcome - toon het welkomstbericht opnieuw\n" +
    "\n" +
    "SYNOPSIS\n" +
    "    welcome\n" +
    "\n" +
    "BESCHRIJVING\n" +
    "    Toont het welkomstbericht met de fase-roadmap opnieuw.\n" +
    "    Handig als je wilt terugkijken welke fases er zijn.\n" +
    "\n" +
    "VOORBEELDEN\n" +
    "    welcome\n" +
    "        Toon de fase-roadmap opnieuw\n" +
    "\n" +
    "    [HACKSIM] Dit command is uniek voor HackSimulator.\n" +
    "       Het bestaat niet in standaard Linux.\n" +
    "\n" +
    "    [+] In real Linux:\n" +
    "       Linux toont een 'Message of the Day' (MOTD) bij inloggen\n" +
    "       via /etc/motd.\n" +
    "\n" +
    "GERELATEERDE COMMANDO'S\n" +
    "    next (volgende stap), leerpad (volledige voortgang)"
  )
};
