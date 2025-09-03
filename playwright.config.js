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
    ['line'], // console output (must be lowercase)
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // optional html
    ['allure-playwright', { outputFolder: './allure-results' }], // Allure results
  ],

  // ✅ Output for traces/screenshots/videos
  outputDir: 'playwright-artifacts',

  use: {
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Optional: fail fast on very slow tests
  reportSlowTests: { max: 5, threshold: 30000 },
})
