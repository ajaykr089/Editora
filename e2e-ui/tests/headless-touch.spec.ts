import { expect, test, type CDPSession, type Page } from '@playwright/test';

// Touch input for the headless hooks: real touch events through the Chrome DevTools Protocol, so
// Chromium only (Firefox and WebKit have no equivalent in Playwright).
test.skip(({ browserName }) => browserName !== 'chromium', 'touch events via CDP');
test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

async function touch(cdp: CDPSession, type: 'touchStart' | 'touchMove' | 'touchEnd', x: number, y: number) {
  await cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
}

async function drag(page: Page, cdp: CDPSession, from: { x: number; y: number }, to: { x: number; y: number }, steps = 8) {
  await touch(cdp, 'touchStart', from.x, from.y);
  for (let i = 1; i <= steps; i += 1) {
    await touch(cdp, 'touchMove', from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps);
    await page.waitForTimeout(16);
  }
  await touch(cdp, 'touchEnd', to.x, to.y);
}

const centre = async (page: Page, selector: string) => {
  const box = (await page.locator(selector).first().boundingBox())!;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2, box };
};

test.beforeEach(async ({ page }) => {
  await page.goto('/headless.html');
  await page.waitForFunction(() => (window as any).__ready && document.querySelector('[role="tablist"]'));
});

test('slider: a thumb follows a touch drag, and the page does not scroll instead', async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  const min = page.getByRole('slider', { name: 'Minimum price' });
  await min.scrollIntoViewIfNeeded();
  const thumb = await centre(page, '[aria-label="Minimum price"]');
  const track = await centre(page, '#track');
  const scrollBefore = await page.evaluate(() => scrollY);
  await drag(page, cdp, thumb, { x: track.box.x + track.box.width * 0.5, y: thumb.y });
  const value = Number(await min.getAttribute('aria-valuenow'));
  expect(value).toBeGreaterThanOrEqual(44);
  expect(value).toBeLessThanOrEqual(56);
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
});

test('tooltip: a tap does not open it (touch has no hover)', async ({ page }) => {
  await page.getByRole('button', { name: 'Save' }).tap();
  await page.waitForTimeout(400);
  await expect(page.getByRole('tooltip')).toBeHidden();
});

test('context menu: a long press opens it, a short tap does not', async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  await page.locator('#area').scrollIntoViewIfNeeded();
  const area = await centre(page, '#area');
  const menu = page.getByRole('menu', { name: 'Area actions' });
  await touch(cdp, 'touchStart', area.x, area.y);
  await page.waitForTimeout(150);
  await touch(cdp, 'touchEnd', area.x, area.y);
  await page.waitForTimeout(900);
  await expect(menu).toBeHidden();
  // Far from the first touch and later, so it is not a double tap.
  await touch(cdp, 'touchStart', area.box.x + 10, area.box.y + 10);
  await page.waitForTimeout(900);
  await expect(menu).toBeVisible();
  await touch(cdp, 'touchEnd', area.box.x + 10, area.box.y + 10);
  await expect(menu).toBeVisible();
});

test('toaster: a touch swipe dismisses a toast, a short one springs back', async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  await page.getByRole('button', { name: 'Show toast' }).tap();
  const toast = page.locator('#toasts li').first();
  await expect(toast).toBeVisible();
  // Keep it on screen while testing: focus pauses the timer.
  await toast.evaluate((el) => (el as HTMLElement).focus());
  const box = (await toast.boundingBox())!;
  const start = { x: box.x + 20, y: box.y + box.height / 2 };
  await drag(page, cdp, start, { x: start.x + 20, y: start.y });
  await expect(toast).toBeVisible();
  await expect(toast).toHaveAttribute('data-swipe', 'cancel');
  await drag(page, cdp, start, { x: start.x + 120, y: start.y });
  await expect(page.locator('#toasts li')).toHaveCount(0);
});

test('navigation menu: a tap toggles the panel (no hover on touch)', async ({ page }) => {
  const products = page.getByRole('button', { name: 'Products' });
  await products.tap();
  await expect(products).toHaveAttribute('aria-expanded', 'true');
  await products.tap();
  await expect(products).toHaveAttribute('aria-expanded', 'false');
});
