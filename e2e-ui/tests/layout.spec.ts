import { expect, test } from '@playwright/test';

const panel = (page: import('@playwright/test').Page) => page.locator('#layout').locator('.sidebar-panel');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/shell.html');
  await page.waitForFunction(() => document.querySelector('#side')?.shadowRoot?.querySelector('.item-button'));
});

test('shell: flush full-height frame, only the content scrolls', async ({ page }) => {
  const geo = await page.evaluate(() => {
    const sh = document.querySelector('#layout')!.shadowRoot!;
    const lay = sh.querySelector('.layout')!;
    const content = sh.querySelector('.content-panel')!;
    const b = lay.getBoundingClientRect();
    return { box: [b.left, b.top, b.width, b.height], border: getComputedStyle(lay).borderTopWidth, pad: getComputedStyle(lay).paddingTop, contentScrolls: content.scrollHeight > content.clientHeight, docScroll: document.documentElement.scrollHeight > innerHeight + 1 };
  });
  expect(geo).toEqual({ box: [0, 0, 1280, 800], border: '0px', pad: '0px', contentScrolls: true, docScroll: false });
  await expect(page.locator('#hdr').getByRole('button', { name: /navigation/ })).toBeHidden();
});

test('narrow: sidebar is a modal drawer opened by the header menu button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  const menu = page.locator('#hdr').getByRole('button', { name: /navigation/ });
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#side a.item-button').first()).toBeFocused();
  expect(await page.evaluate(() => document.querySelector('#layout')!.shadowRoot!.querySelector('.content-panel')!.hasAttribute('inert'))).toBe(true);

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeHidden();
  await menu.click();
  await page.mouse.click(370, 400);
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeHidden();
  await menu.click();
  await page.locator('#side a.item-button').nth(1).click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeHidden();
  expect(await page.evaluate(() => (window as any).log.map(([open, source]: [boolean, string]) => `${open}:${source}`))).toEqual([
    'true:menu', 'false:escape', 'true:menu', 'false:backdrop', 'true:menu', 'false:navigate',
  ]);
  void panel;
});
