import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_UI_PORT || 5199);

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/a11y-stories.spec.ts'],
  outputDir: './test-results',
  // Pages compile from source on first visit (Vite dev): allow for a cold, loaded CI runner.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]] : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
  },
  // Visual baselines are platform specific: they are generated on Linux in CI
  // (workflow_dispatch "update visual baselines") and only compared there.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: ['**/visual.spec.ts', '**/a11y-stories.spec.ts'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: ['**/visual.spec.ts', '**/a11y-stories.spec.ts'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: ['**/visual.spec.ts', '**/a11y-stories.spec.ts'] },
    { name: 'visual', use: { ...devices['Desktop Chrome'] }, testMatch: ['**/visual.spec.ts'] },
  ],
  webServer: {
    command: 'npx vite --config vite.config.ts',
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
