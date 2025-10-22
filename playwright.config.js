// @ts-check
import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
   testDir: './tests',   // 👈 Playwright looks for tests here
  timeout: 30000,
  retries: 0,
  //reporter: 'html',
 // testDir: './tests',
 // fullyParallel: true,
 // forbidOnly: !!process.env.CI,
 // retries: process.env.CI ? 2 : 0,
 // workers: process.env.CI ? 1 : undefined,

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
    name: 'activity',
    testDir: './tests/activity',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'chromium',
    testDir: './tests',
    use: { ...devices['Desktop Chrome'] },
  }
],

  // Optional: fail fast on very slow tests
  reportSlowTests: { max: 5, threshold: 30000 },
})
