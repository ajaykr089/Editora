import { expect, test } from '@playwright/test';

test('built-in icons load on first use: no fallback letter flashes, then the svg (ui-icon and Button)', async ({ page }) => {
  await page.goto('/icons.html');
  await page.waitForFunction(() => (window as any).result, null, { timeout: 15_000 });
  const result = await page.evaluate(() => (window as any).result);
  // Whether the set has already arrived at the first check depends on caching; what must hold is
  // that the fallback letter never shows while it loads, and the icons render once it has.
  expect(result.first.fallback).toBe(false);
  expect(result.later).toEqual({ icon: true, button: true });
});
