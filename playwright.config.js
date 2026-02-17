// Playwright Configuration - HackSimulator.nl Cross-Browser Testing
// Created: 2025-10-22
// Purpose: Test live Netlify deployment across Chrome, Firefox, Safari

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter to use
  reporter: [
    ['html'],
    ['list']
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL for tests
    baseURL: 'https://hacksimulator.nl',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Maximum time each action can take
    actionTimeout: 10 * 1000,

    // Viewport size (desktop default)
    viewport: { width: 1280, height: 720 }
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Enable localStorage
        storageState: undefined
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: undefined
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: undefined
      },
    },
  ],

  // Web server configuration (not needed - testing live URL)
  // webServer: undefined,
});
