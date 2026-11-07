import { expect, test } from '@playwright/test';

// The PettyFlow fixes, in real browsers: app/index.html renders them with React 19.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.querySelector('#side')?.shadowRoot?.querySelector('.item-button'));
});

test('a checkbox inside a tab panel does not change or close the tab', async ({ page }) => {
  await page.click('#box');
  expect(await page.evaluate(() => document.querySelector('#tabs')!.getAttribute('selected'))).toBe('0');
  await expect(page.locator('#tabs [slot=panel]').first()).toBeVisible();
  expect(await page.evaluate(() => (window as any).log.tabChanges)).toEqual([]);
});

test('tabs keep focus when panel content re-renders, and arrow keys still work', async ({ page }) => {
  await page.getByRole('tab', { name: 'Two' }).click();
  for (let i = 0; i < 3; i += 1) await page.evaluate(() => (window as any).bump());
  await expect(page.getByRole('tab', { name: 'Two' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Three' })).toBeFocused();
  expect(await page.evaluate(() => document.querySelector('#tabs')!.getAttribute('selected'))).toBe('2');
});

test('select shows the placeholder for value="" and opens on click', async ({ page }) => {
  const combobox = page.getByRole('combobox', { name: 'Kind' });
  await expect(combobox).toHaveText('Pick one');
  await combobox.click();
  await expect(combobox).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('option', { name: 'Beta' }).click();
  await expect(combobox).toHaveText('Beta');
});

test('pagination is right on its first render', async ({ page }) => {
  const pages = await page.evaluate(() => Array.from(document.querySelector('#pager')!.shadowRoot!.querySelectorAll('button[data-page]:not([aria-label])')).map((b) => b.textContent));
  expect(pages).toEqual(['1', '2', '3']);
  await expect(page.locator('#pager').getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('card inset written after the header renders below it', async ({ page }) => {
  const order = await page.evaluate(() => {
    const card = document.querySelector('#card')!;
    return card.querySelector('[slot=header]')!.getBoundingClientRect().top < card.querySelector('#inset')!.getBoundingClientRect().top;
  });
  expect(order).toBe(true);
});

test('sidebar links route in the app (click and Enter) without a page load', async ({ page }) => {
  const url = page.url();
  await expect(page.locator('#side .item-label')).toHaveText(['Home', 'Reports']);
  await page.locator('#side a.item-button').nth(1).click();
  await page.locator('#side a.item-button').nth(0).focus();
  await page.keyboard.press('Enter');
  expect(page.url()).toBe(url);
  expect(await page.evaluate(() => (window as any).log.navigated)).toEqual(['/reports', '/home']);
});

test('dropdown exposes one set of menu items', async ({ page }) => {
  await page.getByRole('button', { name: 'Actions' }).click();
  await expect(page.getByRole('menuitem')).toHaveText(['Export', 'Archive']);
});

test('dialog is a single named dialog', async ({ page }) => {
  await page.evaluate(() => document.querySelector('#dlg')!.setAttribute('open', ''));
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect(page.getByRole('dialog', { name: 'Edit item' })).toBeVisible();
  expect(await page.evaluate(() => document.querySelector('#dlg')!.getAttribute('role'))).toBeNull();
});
