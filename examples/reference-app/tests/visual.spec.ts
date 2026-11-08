import { existsSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Screenshots of the reference app's key pages. Baselines are platform specific: they are
// generated on Linux by the "Update visual baselines" workflow and compared there; without a
// baseline for the current platform the test is skipped.
const PAGES = [
  ['website', '/', 1280],
  ['dashboard', '/#/app', 1366],
  ['expenses', '/#/app/expenses', 1366],
  ['new-expense', '/#/app/expenses/new', 1366],
  ['dashboard-phone', '/#/app', 390],
] as const;

for (const theme of ['light', 'dark'] as const) {
  for (const [name, path, width] of PAGES) {
    test(`${name} / ${theme}`, async ({ page }, info) => {
      const file = `reference-${name}-${theme}.png`;
      const updating = info.config.updateSnapshots === 'all' || info.config.updateSnapshots === 'changed';
      test.skip(!updating && !existsSync(info.snapshotPath(file)), `no ${process.platform} baseline yet for ${file}`);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path.includes('#') ? path.replace('/#', `/?theme=${theme}#`) : `/?theme=${theme}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(800);
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(file, { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.002 });
    });
  }
}
