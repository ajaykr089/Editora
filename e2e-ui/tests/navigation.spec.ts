import { expect, test } from '@playwright/test';

// One link contract: NavigationProvider routes Breadcrumb, Sidebar, route Tabs and Pagination links.
test.beforeEach(async ({ page }) => {
  await page.goto('/navigation.html');
  await page.waitForFunction(() => document.querySelector('#pager')?.shadowRoot?.querySelector('a[data-page]'));
});

test('every component routes its links through the provider, without a page load', async ({ page }) => {
  const url = page.url();
  await page.locator('#crumbs').getByRole('link', { name: 'Expenses' }).click();
  await page.locator('#side').getByRole('link', { name: 'Reports' }).click();
  await page.getByRole('tab', { name: 'History' }).click();
  await page.locator('#pager').getByRole('link', { name: '3' }).click();
  expect(page.url()).toBe(url);
  expect(await page.evaluate(() => (window as any).routed)).toEqual(['/expenses', '/reports', '/history', '/expenses?page=3']);
  await expect(page.locator('#pager').getByRole('link', { name: '3' })).toHaveAttribute('aria-current', 'page');
});

test('pagination controls are real links (new tab, sharing) and keyboard navigable', async ({ page }) => {
  const link = page.locator('#pager').getByRole('link', { name: '2' });
  await expect(link).toHaveAttribute('href', '/expenses?page=2');
  await expect(page.locator('#pager').getByRole('button', { name: 'Previous' })).toBeDisabled();
  await link.focus();
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => (window as any).routed)).toEqual(['/expenses?page=2']);
});
