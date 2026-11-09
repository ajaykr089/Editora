import { expect, test, type Page } from '@playwright/test';

// Overlays and controls from the follow-up audit (see app/feedback-overlays.tsx).
test.beforeEach(async ({ page }) => {
  await page.goto('/feedback-overlays.html');
  await page.waitForFunction(() => !!document.querySelector('#menu') && !!customElements.get('ui-menu'));
});

/** The box of the first visible element with this role (deep), skipping hidden copies. */
const boxOfRole = (page: Page, role: string) =>
  page.evaluate((role) => {
    const find = (root: ParentNode): Element | null => {
      for (const el of Array.from(root.querySelectorAll('*'))) {
        const r = el.getBoundingClientRect();
        if (el.getAttribute('role') === role && !el.closest('[aria-hidden="true"]') && r.width > 30 && r.height > 12) return el;
        if ((el as HTMLElement).shadowRoot) { const f = find((el as HTMLElement).shadowRoot!); if (f) return f; }
      }
      return null;
    };
    const el = find(document);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }, role);

/** What paints at a point: the first element (deepest first) with a background, and its padding. */
const surfaceAt = (page: Page, x: number, y: number) =>
  page.evaluate(({ x, y }) => {
    let el: any = document.elementFromPoint(x, y);
    while (el?.shadowRoot) { const inner = el.shadowRoot.elementFromPoint(x, y); if (!inner || inner === el) break; el = inner; }
    for (let n: any = el; n; n = n.parentElement || n.getRootNode?.().host) {
      const cs = getComputedStyle(n);
      if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none') {
        return { id: n.id || '', bg: cs.backgroundColor, image: cs.backgroundImage !== 'none' };
      }
    }
    return { id: 'none', bg: '', image: false };
  }, { x, y });

const opaque = (bg: string) => !/rgba\([^)]*,\s*0(\.\d+)?\)|\/\s*0?\.\d+\)/.test(bg);

for (const [name, open, role] of [
  ['menu', (p: Page) => p.locator('#menu ui-button, #menu button').first().click(), 'menu'],
  ['context menu', (p: Page) => p.locator('#context-open').click(), 'menu'],
  ['tooltip', (p: Page) => p.locator('#tooltip ui-button, #tooltip button').first().hover(), 'tooltip']
] as const) {
  test(`${name}: the panel is opaque and paints over the page`, async ({ page }) => {
    await open(page);
    await expect.poll(() => boxOfRole(page, role)).not.toBeNull();
    await page.waitForTimeout(300);
    const box = (await boxOfRole(page, role))!;
    // just inside the top-right corner: padding, not an item
    const surface = await surfaceAt(page, box.x + box.width - 4, box.y + 3);
    expect(surface.id, `${name} painted by the page behind it`).not.toBe('scope');
    expect(opaque(surface.bg), `${name} bg ${surface.bg}`).toBe(true);
  });
}

test('menu and popover panels take the wrapper theme', async ({ page }) => {
  await page.locator('#menu ui-button, #menu button').first().click();
  await expect.poll(() => boxOfRole(page, 'menu')).not.toBeNull();
  await page.waitForTimeout(300);
  const menuBox = (await boxOfRole(page, 'menu'))!;
  expect((await surfaceAt(page, menuBox.x + menuBox.width - 4, menuBox.y + 3)).bg).toBe('rgb(253, 244, 255)');
  await page.keyboard.press('Escape');

  await page.locator('#popover ui-button, #popover button').first().click();
  const body = page.locator('text=Popover body >> visible=true').first();
  await expect(body).toBeVisible();
  const box = (await body.boundingBox())!;
  expect((await surfaceAt(page, box.x + 2, box.y + box.height / 2)).bg).toBe('rgb(253, 244, 255)');
});

test('control outlines reach 3:1', async ({ page }) => {
  const ratios = await page.evaluate(() => {
    const toRgb = (v: string) => { const n = (v.match(/[\d.]+/g) || []).map(Number); return v.startsWith('color(') ? { rgb: n.slice(0, 3).map((x) => x * 255), a: n[3] ?? 1 } : { rgb: n.slice(0, 3), a: n[3] ?? 1 }; };
    const lum = (rgb: number[]) => { const [r, g, b] = rgb.map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const onWhite = (v: string) => { const { rgb, a } = toRgb(v); return 1.05 / (lum(rgb.map((c) => c * a + 255 * (1 - a))) + 0.05); };
    const best = (id: string, prop: 'border' | 'fill', selector?: string) => {
      const out: number[] = [];
      const walk = (root: ParentNode) => { for (const el of Array.from(root.querySelectorAll(selector || '*'))) { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); if (r.width >= 8 && r.height >= 3 && Number(cs.opacity) > 0.1 && !/spinner/.test(String((el as HTMLElement).className))) { if (prop === 'border' && parseFloat(cs.borderTopWidth) >= 1 && cs.borderTopStyle !== 'none') out.push(onWhite(cs.borderTopColor)); if (prop === 'fill' && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') out.push(onWhite(cs.backgroundColor)); } } for (const el of Array.from(root.querySelectorAll('*'))) if ((el as HTMLElement).shadowRoot) walk((el as HTMLElement).shadowRoot!); };
      walk(document.getElementById(id)!.shadowRoot || document.getElementById(id)!);
      walk(document.getElementById(id)!);
      return Math.max(0, ...out);
    };
    return { pin: best('pin', 'border'), checkbox: best('checkbox', 'border'), radio: best('radio', 'border'), switch: best('switch', 'border'), slider: best('slider', 'fill', '.track, [part~="track"]') };
  });
  for (const [name, ratio] of Object.entries(ratios)) expect(ratio, name).toBeGreaterThanOrEqual(3);
});
