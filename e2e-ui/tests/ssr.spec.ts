import { expect, test } from '@playwright/test';

async function measure(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const shown = (id: string) => { const e = document.getElementById(id); if (!e) return false; return getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0; };
    return {
      p2: shown('p2'), dialog: shown('dlg') && getComputedStyle(document.getElementById('dlg')!).position !== 'fixed',
      options: [...document.querySelectorAll('#sel option')].some((o) => o.getBoundingClientRect().height > 0), menu: shown('ddc'),
      afterTop: Math.round(document.getElementById('after')!.getBoundingClientRect().top),
    };
  });
}

test('server-rendered markup: nothing hidden flashes, and the page barely moves when elements load', async ({ page }) => {
  await page.goto('/ssr.html?preload=1');
  await page.waitForFunction(() => (window as any).ready);
  const before = await measure(page);
  expect(before).toMatchObject({ p2: false, dialog: false, options: false, menu: false });
  await page.evaluate(() => (window as any).defineElements());
  await page.waitForTimeout(500);
  const after = await measure(page);
  expect(Math.abs(after.afterTop - before.afterTop)).toBeLessThanOrEqual(12);
});

test('without the preload styles the same page jumps (guards the measurement)', async ({ page }) => {
  await page.goto('/ssr.html');
  await page.waitForFunction(() => (window as any).ready);
  const before = await measure(page);
  await page.evaluate(() => (window as any).defineElements());
  await page.waitForTimeout(500);
  const after = await measure(page);
  expect(Math.abs(after.afterTop - before.afterTop)).toBeGreaterThan(40);
});
