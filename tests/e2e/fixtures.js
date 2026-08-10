// Shared Test Fixtures - HackSimulator.nl
// Purpose: Shared test setup for E2E tests
// All test files should import { test, expect } from './fixtures' instead of '@playwright/test'

import { test as base, expect } from '@playwright/test';

// De suite draait standaard tegen PRODUCTIE (playwright.config.js:32,
// `BASE_URL || 'https://hacksimulator.nl'`). Drie parallelle motoren die samen honderden
// navigaties afvuren lopen daar tegen Netlify's bot-protectie aan: die serveert dan een
// interstitial ("We are verifying your connection") mét Challenge ID in plaats van de
// gevraagde pagina.
//
// Zo'n challenge-pagina bevat geen enkel element van de site, dus de test die erop landt
// faalt met iets onbegrijpelijks — gemeten Sessie 220:
//
//     TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
//
// Dat las vijf sessies lang als "flaky onder CPU-contentie" (TASKS.md #60) terwijl er
// niets mis was met de test én niets met de site. Dezelfde run tegen een lokale server:
// 27 passed / 0 failed.
//
// Deze guard maakt van die stille verwarring een benoemde faler. Draai bij voorkeur
// tegen een lokale server:
//
//     python3 scripts/nostore-server.py 8901 "$(pwd)" &
//     BASE_URL=http://localhost:8901 npx playwright test
const CHALLENGE_MARKER = /verifying your connection/i;

async function isBotChallenge(page) {
  try {
    return await page.evaluate(
      (bron) => new RegExp(bron, 'i').test(document.body ? document.body.innerText : ''),
      CHALLENGE_MARKER.source
    );
  } catch {
    // Navigatie afgebroken, frame weg, about:blank — dan is er niets te beoordelen.
    return false;
  }
}

// Extend base test with shared page setup
export const test = base.extend({
  page: async ({ page }, use) => {
    const origineleGoto = page.goto.bind(page);

    page.goto = async (url, options) => {
      const response = await origineleGoto(url, options);

      if (await isBotChallenge(page)) {
        throw new Error(
          `Netlify bot-protectie geserveerd i.p.v. de pagina (${url}).\n` +
            'Je meet de challenge-interstitial, niet de site — elke assertie hierna is betekenisloos.\n' +
            'Draai tegen een lokale server:\n' +
            '  python3 scripts/nostore-server.py 8901 "$(pwd)" &\n' +
            '  BASE_URL=http://localhost:8901 npx playwright test'
        );
      }

      return response;
    };

    await use(page);
  },
});

export { expect };
