import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

// axe over every Storybook story (Chromium). Build Storybook first:
//   STORYBOOK_DISABLE_TELEMETRY=1 npx storybook build --output-dir e2e-ui/storybook-static   (from the repo root)
// then: npm run test:a11y   (SB_DIR overrides the build folder)
const sbPort = Number(process.env.SB_PORT || 6107);
const appPort = Number(process.env.E2E_UI_PORT || 5199);
const sbDir = path.resolve(process.env.SB_DIR || 'storybook-static');

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/a11y-stories.spec.ts'],
  outputDir: './test-results-a11y',
  timeout: 30_000,
  fullyParallel: true,
  workers: process.env.CI ? 4 : 6,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['dot'], ['html', { open: 'never', outputFolder: 'playwright-report-a11y' }]] : [['dot']],
  use: { ...devices['Desktop Chrome'], reducedMotion: 'reduce', baseURL: `http://127.0.0.1:${sbPort}` },
  projects: [
    { name: 'unthemed' },
    { name: 'light', metadata: { theme: 'light' } },
  ],
  webServer: [
    { command: `node serve-static.mjs "${sbDir}" ${sbPort}`, url: `http://127.0.0.1:${sbPort}/index.json`, reuseExistingServer: !process.env.CI },
    { command: 'npx vite --config vite.config.ts', url: `http://127.0.0.1:${appPort}/`, reuseExistingServer: !process.env.CI, timeout: 120_000 },
  ],
});
