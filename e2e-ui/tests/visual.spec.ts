import { existsSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Screenshot comparisons per theme and density. Baselines are platform specific and are only
// generated and compared on Linux in CI (workflow "Update visual baselines"); without a baseline for
// the current platform the test is skipped instead of failing.
for (const theme of ['light', 'dark'] as const) {
  for (const density of ['compact', 'default', 'comfortable'] as const) {
    test(`${theme} / ${density}`, async ({ page }, info) => {
      const name = `showcase-${theme}-${density}.png`;
      const updating = info.config.updateSnapshots === 'all' || info.config.updateSnapshots === 'changed';
      test.skip(!updating && !existsSync(info.snapshotPath(name)), `no ${process.platform} baseline yet for ${name}`);
      await page.emulateMedia({ colorScheme: theme });
      await page.setViewportSize({ width: 768, height: 900 });
      await page.goto(`/visual.html?theme=${theme}&density=${density}`);
      await page.waitForFunction(() => (window as any).ready);
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(name, { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.002 });
    });
  }
}
