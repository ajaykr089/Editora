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
  '/settings', '/settings/security', '/pricing', '/ui', '/auth/sign-in', '/auth/sign-up', '/does-not-exist'];

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
