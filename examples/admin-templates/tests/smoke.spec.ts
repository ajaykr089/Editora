import { expect, test, type Page } from '@playwright/test';

// Every screen of both templates renders a heading with no console error, and every custom
// element on it is defined (an undefined one renders nothing and fails silently).

function watch(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  return errors;
}

async function undefinedElements(page: Page) {
  return page.evaluate(() => [...new Set(Array.from(document.querySelectorAll('*'))
    .filter((el) => el.tagName.includes('-') && !customElements.get(el.tagName.toLowerCase()))
    .map((el) => el.tagName.toLowerCase()))]);
}

const LARKSPUR = ['/', '/analytics', '/crm', '/projects', '/orders', '/orders/48300', '/customers', '/customers/C-1003', '/products',
  '/invoices', '/invoices/INV-2026-0139', '/mail', '/calendar', '/kanban', '/journal', '/journal/A-1', '/journal/new', '/profile',
  '/settings', '/settings/security', '/pricing', '/ui', '/ui/sidebars', '/auth/sign-in', '/auth/sign-up', '/does-not-exist'];

for (const route of LARKSPUR) {
  test(`larkspur ${route}`, async ({ page }) => {
    const errors = watch(page);
    await page.goto(`/larkspur/?latency=0#${route}`);
    await expect(page.locator('h1').first()).toBeAttached();
    await page.waitForTimeout(400);
    expect(await undefinedElements(page)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

const COPPERLINE = ['', 'orders.html', 'order.html?id=48300', 'articles.html', 'editor.html', 'editor.html?id=A-2', 'settings.html', 'sign-in.html', '404.html'];

for (const file of COPPERLINE) {
  test(`copperline /${file}`, async ({ page }) => {
    const errors = watch(page);
    await page.goto(`/copperline/${file}${file.includes('?') ? '&' : '?'}latency=0`);
    await expect(page.locator('h1').first()).toBeAttached();
    await page.waitForTimeout(400);
    expect(await undefinedElements(page)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('larkspur: typing into an empty editor makes paragraphs', async ({ page }) => {
  await page.goto('/larkspur/?latency=0#/mail?compose=1');
  const editor = page.locator('ui-drawer .rte-content');
  await editor.click();
  await page.keyboard.type('Hello there');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Second line');
  await expect.poll(() => editor.innerHTML()).toBe('<p>Hello there</p><p>Second line</p>');
});

test('larkspur: the icon rail + panel sidebar follows the route and opens areas', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = watch(page);
  await page.goto('/larkspur/?latency=0&sidebar=dual#/orders');
  const sidebar = page.locator('ui-sidebar[layout="dual"]').first();
  await expect(sidebar.locator('.panel-title-label')).toHaveText('Store');
  await expect(sidebar.locator('.panel [aria-current="page"]')).toContainText('Orders');
  await sidebar.locator('.rail .item-button', { hasText: 'Apps' }).click();
  await expect(sidebar.locator('.panel-title-label')).toHaveText('Apps');
  await sidebar.locator('.panel .item-button', { hasText: 'Calendar' }).click();
  await expect(page).toHaveURL(/#\/calendar/);
  await expect(sidebar.locator('.panel [aria-current="page"]')).toContainText('Calendar');
  // the open area folds the panel away
  await sidebar.locator('.rail .item-button', { hasText: 'Apps' }).click();
  await expect(sidebar).toHaveAttribute('collapsed', '');
  expect(errors).toEqual([]);
});

test('larkspur: the collapsed sidebar names icons and opens groups in a flyout', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = watch(page);
  await page.goto('/larkspur/?latency=0&sidebar=solid#/orders');
  const sidebar = page.locator('ui-sidebar').first();
  await sidebar.locator('.collapse-btn').click();
  await expect(sidebar).toHaveAttribute('collapsed', '');
  // the icon still has its name for screen readers
  await expect(sidebar.getByRole('link', { name: 'Customers' })).toBeVisible();
  await sidebar.getByRole('link', { name: 'Customers' }).hover();
  await expect(sidebar.locator('.tip')).toHaveText('Customers');
  await sidebar.getByRole('button', { name: 'Dashboards' }).click();
  await expect(sidebar.locator('.flyout')).toBeVisible();
  await sidebar.locator('.flyout').getByRole('link', { name: 'Analytics' }).click();
  await expect(page).toHaveURL(/#\/analytics/);
  await expect(sidebar.locator('.flyout')).toBeHidden();
  expect(errors).toEqual([]);
});
