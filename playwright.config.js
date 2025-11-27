// @ts-check
import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // ✅ Reporters configuration
  reporter: [
    ['line'], // console output
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // html report
    ['allure-playwright', { outputFolder: './allure-results' }], // allure report
  ],

  // ✅ Output for traces/screenshots/videos
  outputDir: 'playwright-artifacts',

  use: {
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },

  // ✅ Projects: module-based, using only Chromium
  projects: [
    {
      name: 'country',
      testDir: './tests/country',   
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'users',
      testDir: './tests/users',   
      use: { ...devices['Desktop Chrome'] },
    },

    {
    name: 'moderator',
    testDir: './tests/stakeholders/moderator',
    use: { ...devices['Desktop Chrome'] },
  },
    // 👉 Add other modules like state, district, user here
    // {
    //   name: 'state',
    //   testDir: './tests/state',
    //   use: { ...devices['Desktop Chrome'] },
    // },
  ],

  // Optional: fail fast on very slow tests
  reportSlowTests: { max: 5, threshold: 30000 },
})
