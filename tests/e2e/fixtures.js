// Shared Test Fixtures - HackSimulator.nl
// Purpose: Block third-party consent dialogs (Cookiebot) during E2E tests
// All test files should import { test, expect } from './fixtures' instead of '@playwright/test'

import { test as base, expect } from '@playwright/test';

// Extend base test to block Cookiebot CMP dialog
// This prevents the consent overlay from blocking test interactions
export const test = base.extend({
  page: async ({ page }, use) => {
    // Block Cookiebot script — prevents consent dialog from appearing
    await page.route('**/consent.cookiebot.com/**', route => route.abort());
    await page.route('**/consentcdn.cookiebot.com/**', route => route.abort());
    await use(page);
  },
});

export { expect };
