// Shared Test Fixtures - HackSimulator.nl
// Purpose: Shared test setup for E2E tests
// All test files should import { test, expect } from './fixtures' instead of '@playwright/test'

import { test as base, expect } from '@playwright/test';

// Extend base test with shared page setup
export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page);
  },
});

export { expect };
