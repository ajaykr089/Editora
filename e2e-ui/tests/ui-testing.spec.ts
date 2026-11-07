import { expect, test } from '@playwright/test';
import { chooseMenuItem, fillField, getFieldError, openDropdown, selectOption, selectTab, toggleField } from '../../packages/ui-testing/src/playwright';

// The @editora/ui-testing Playwright helpers against real components (app/testing.tsx).
test.beforeEach(async ({ page }) => {
  await page.goto('/testing.html');
  await page.getByRole('combobox', { name: 'Role' }).waitFor();
});

const log = (page: import('@playwright/test').Page) => page.evaluate(() => (window as any).log as string[]);

test('select, menu and tab helpers act like a user', async ({ page }) => {
  await selectOption(page, 'Role', 'Staff');
  const menu = await openDropdown(page, 'Actions');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await chooseMenuItem(page, 'Actions', 'Export');
  await selectTab(page, 'Billing');
  expect(await log(page)).toEqual(['role:staff', 'menu:export', 'tab:1']);
});

test('field helpers fill, append, commit, toggle and read errors', async ({ page }) => {
  await fillField(page, 'Email', 'ann@acme.test');
  await fillField(page, 'Email', '.uk', { append: true, commit: true });
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('ann@acme.test.uk');
  await toggleField(page, 'Billable');
  await toggleField(page, 'Active');
  expect(await log(page)).toEqual(['commit:ann@acme.test.uk', 'billable:true', 'active:true']);

  await fillField(page, 'Email', '');
  expect(await getFieldError(page, 'Email')).toBe('');
  await page.evaluate(() => (document.getElementById('form') as any).validate());
  expect(await getFieldError(page, 'Email')).not.toBe('');
  expect(await getFieldError(page.locator('#form'), 'Company')).toBe('');
});
