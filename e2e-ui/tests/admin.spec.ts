import { expect, test } from '@playwright/test';

// Phase 4 admin building blocks in real browsers (see app/admin.tsx).
test.beforeEach(async ({ page }) => {
  await page.goto('/admin.html');
  await page.waitForFunction(() => document.querySelector('#table')?.shadowRoot?.querySelector('.summary')?.textContent?.includes('of 42'));
});

const deepActive = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    let node: Element | null = document.activeElement;
    while (node?.shadowRoot?.activeElement) node = node.shadowRoot.activeElement;
    return node ? `${node.tagName.toLowerCase()}${node.getAttribute('name') ? `[name=${node.getAttribute('name')}]` : ''}` : '';
  });

test('server errors show on their fields, focus the first, and clear when edited', async ({ page }) => {
  await page.locator('#server-errors').click();
  const email = page.locator('#form ui-input[name="email"]');
  await expect(email.getByText('Already registered')).toBeVisible();
  // the first field on the page, although the error object lists phone first
  expect(await deepActive(page)).toMatch(/^input/);
  await expect(page.locator('#form input[name="phone"]')).toHaveAttribute('aria-invalid', 'true');
  await page.keyboard.type('x');
  await expect(email.getByText('Already registered')).toBeHidden();
  await expect(page.locator('#form input[name="phone"]')).toHaveAttribute('aria-invalid', 'true');
});

test('a server-driven table pages through the app and follows row links', async ({ page }) => {
  const summary = page.locator('#table').locator('.summary');
  await expect(summary).toHaveText('Showing 1-3 of 42');
  await expect(page.locator('#table th[data-key="email"]')).toBeHidden();
  await page.locator('#pager').getByRole('button', { name: '2', exact: true }).click();
  await expect(summary).toHaveText('Showing 4-6 of 42');
  await expect(page.locator('#table tbody tr').first()).toHaveAttribute('aria-rowindex', '4');

  const url = page.url();
  await page.locator('#table tbody tr').nth(1).click();
  await page.locator('#table tbody tr').first().focus();
  await page.keyboard.press('Enter');
  expect(page.url()).toBe(url);
  expect(await page.evaluate(() => (window as any).routed)).toEqual(['/people/5', '/people/4']);
});

test('the chart shows its numbers as a table', async ({ page }) => {
  const table = page.locator('#chart').getByRole('table', { name: 'Spend by month' });
  await expect(table).toBeVisible();
  await expect(table.getByRole('row', { name: /Feb/ })).toContainText('80');
});

test('date-range presets set the range and show which one is active', async ({ page }) => {
  const q2 = page.locator('#filters').getByRole('group', { name: 'Period presets' }).getByRole('button', { name: 'Q2' });
  await q2.click();
  await expect(q2).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#filters ui-date-range-picker')).toHaveAttribute('value', JSON.stringify({ start: '2026-04-01', end: '2026-06-30' }));
});
