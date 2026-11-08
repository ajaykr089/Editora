import { defineConfig, devices } from '@playwright/test';

// Tests the production build of the reference app (vite build + vite preview), the closest thing
// to what a user ships. The Editora packages come from source, so this tests the branch.
const port = Number(process.env.REFERENCE_APP_PORT || 5211);

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
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
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testMatch: ['**/flows.spec.ts'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testMatch: ['**/flows.spec.ts'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testMatch: ['**/flows.spec.ts'] },
    { name: 'a11y', use: { ...devices['Desktop Chrome'] }, testMatch: ['**/a11y.spec.ts'] },
    // Baselines are platform specific: generated and compared on Linux in CI only.
    { name: 'visual', use: { ...devices['Desktop Chrome'] }, testMatch: ['**/visual.spec.ts'] },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
