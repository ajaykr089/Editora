import { expect, test, type Page } from '@playwright/test';
import { fillField, getFieldError, selectOption } from '../../../packages/ui-testing/src/playwright';

// The journeys a Tallyhawk user takes, on the production build, in Chromium, Firefox and WebKit.
// The app runs on a pretend API with latency, so these also cover loading and server errors.

function watch(page: Page) {
  const errors: string[] = [];
  const requests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', (request) => requests.push(request.url()));
  return { errors, requests };
}

const summary = (page: Page) => page.locator('ui-data-table').locator('.summary');
const firstRow = (page: Page) => page.locator('ui-data-table tbody tr').first();

test('from the website into the app, and around it with the sidebar', async ({ page }) => {
  const { errors } = watch(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Expenses that');
  await page.getByRole('button', { name: 'Start free' }).first().click();
  await expect(page).toHaveURL(/#\/app$/);
  await expect(page.getByRole('heading', { name: 'Good morning, Maya' })).toBeVisible();
  await page.getByRole('link', { name: 'Expenses' }).first().click();
  await expect(page).toHaveURL(/#\/app\/expenses$/);
  await expect(summary(page)).toHaveText('Showing 1-12 of 140');
  expect(errors).toEqual([]);
});

test('the expense list pages, sorts and filters on the server, and rows open the expense', async ({ page }) => {
  const { errors } = watch(page);
  await page.goto('/#/app/expenses');
  await expect(summary(page)).toHaveText('Showing 1-12 of 140');

  const pageOneFirst = await firstRow(page).getAttribute('data-id');
  await page.locator('#expenses-pager').getByRole('button', { name: '2', exact: true }).click();
  await expect(summary(page)).toHaveText('Showing 13-24 of 140');
  // the summary changes at once, the rows when the server answers
  await expect(firstRow(page)).not.toHaveAttribute('data-id', pageOneFirst!);

  await selectOption(page, /status/i, 'Waiting');
  await expect(summary(page)).toContainText(/^Showing 1-\d+ of \d+$/);
  await expect(page.locator('ui-data-table tbody ui-badge').first()).toContainText('Waiting');

  const id = await firstRow(page).getAttribute('data-id');
  await firstRow(page).locator('td').nth(2).click();
  await expect(page).toHaveURL(new RegExp(`#/app/expenses/${id}$`));
  expect(errors).toEqual([]);
});

test('rejecting asks for confirmation, then tells the user and updates the status', async ({ page }) => {
  const { errors } = watch(page);
  await page.goto('/#/app/expenses?status=submitted');
  await expect(page.locator('ui-data-table tbody ui-badge').first()).toContainText('Waiting');
  await firstRow(page).locator('td').nth(2).click();

  await page.getByRole('button', { name: 'Reject' }).first().click();
  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Keep it' }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole('button', { name: 'Reject' }).first().click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Reject expense' }).click();
  await expect(page.getByText('Expense rejected').first()).toBeVisible();
  await expect(page.locator('.detail-grid ui-badge').first()).toContainText('Rejected');
  expect(errors).toEqual([]);
});

test('a new expense shows the server’s errors on its fields, then is created', async ({ page }) => {
  const { errors } = watch(page);
  await page.goto('/#/app/expenses/new');
  await fillField(page, 'Merchant', 'Rail Europe');
  await selectOption(page, 'Category', 'Travel');
  await fillField(page, 'Amount', '9000');
  await page.getByRole('button', { name: 'Submit for approval' }).click();
  await expect.poll(() => getFieldError(page, 'Amount')).toContain('purchase order');

  await fillField(page, 'Amount', '120.50');
  expect(await getFieldError(page, 'Amount')).toBe('');
  await page.getByRole('button', { name: 'Submit for approval' }).click();
  await expect(page).toHaveURL(/#\/app\/expenses\/EX-\d+$/);
  await expect(page.getByRole('heading', { name: 'Rail Europe' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('the app never downloads the full icon set or the server renderer', async ({ page }) => {
  const { requests } = watch(page);
  for (const hash of ['', '#/app', '#/app/expenses', '#/app/expenses/new']) {
    await page.goto(`/${hash}`);
    await page.waitForLoadState('networkidle');
  }
  // the app registers its own icons with addIcons; Sidebar loads react-dom/server only on demand
  const chunks = requests.filter((url) => /\/assets\/.+\.js$/.test(url)).map((url) => url.split('/').pop()!);
  expect(chunks.filter((name) => /^(src|server\.browser)-/.test(name))).toEqual([]);
});
