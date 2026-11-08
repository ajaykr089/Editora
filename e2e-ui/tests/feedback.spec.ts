import { expect, test } from '@playwright/test';

// An app team's feedback list, checked in real browsers (see app/feedback.tsx).
test.beforeEach(async ({ page }) => {
  await page.goto('/feedback.html');
  await page.waitForFunction(() => !!document.querySelector('#from')?.shadowRoot?.querySelector('.input'));
});

test.describe('date pickers', () => {
  test('a closed picker builds no calendar', async ({ page }) => {
    const counts = await page.evaluate(() =>
      ['#from', '#to', '#period'].map((id) => {
        const root = document.querySelector(id)!.shadowRoot!;
        return { calendars: root.querySelectorAll('ui-calendar').length, nodes: root.querySelectorAll('*').length };
      })
    );
    for (const count of counts) {
      expect(count.calendars).toBe(0);
      expect(count.nodes).toBeLessThan(60);
    }
  });

  test('the panel opens inside the picker: as wide as its calendar, opaque, themed, no repeated label, one Today', async ({ page }) => {
    await page.locator('#from [data-action="toggle"]').click();
    const panel = page.locator('#from .panel');
    await expect(panel).toBeVisible();
    const facts = await page.evaluate(() => {
      const picker = document.querySelector('#from')!;
      const layer = picker.shadowRoot!.querySelector('[data-picker-layer]') as HTMLElement;
      const panelEl = layer.shadowRoot!.querySelector('.panel') as HTMLElement;
      const calendar = layer.shadowRoot!.querySelector('ui-calendar') as HTMLElement;
      const title = calendar.shadowRoot!.querySelector('.title-btn') as HTMLElement;
      const style = getComputedStyle(panelEl);
      const panelRect = panelEl.getBoundingClientRect();
      const calendarRect = calendar.getBoundingClientRect();
      return {
        inBody: !!document.querySelector('body > .ui-date-picker-overlay-host'),
        fieldWidth: picker.shadowRoot!.querySelector('.field')!.getBoundingClientRect().width,
        panelLeft: panelRect.left,
        panelRight: panelRect.right,
        calendarLeft: calendarRect.left,
        calendarRight: calendarRect.right,
        background: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        shadow: style.boxShadow,
        accent: getComputedStyle(calendar).getPropertyValue('--ui-calendar-accent').trim(),
        headerHidden: (layer.shadowRoot!.querySelector('.header') as HTMLElement).hidden,
        todays: layer.shadowRoot!.querySelectorAll('[data-action="today"]').length + calendar.shadowRoot!.querySelectorAll('.today-btn').length,
        titleText: title.textContent!.trim(),
        titleClipped: title.scrollWidth > title.clientWidth + 1
      };
    });
    expect(facts.inBody).toBe(false);
    expect(facts.fieldWidth).toBeLessThan(200);
    expect(facts.calendarLeft).toBeGreaterThanOrEqual(facts.panelLeft);
    expect(facts.calendarRight).toBeLessThanOrEqual(facts.panelRight);
    // the wrapper's own surface and primary colour reach the panel (a scoped theme does this)
    expect(facts.background).toBe('rgb(253, 244, 255)');
    expect(facts.backgroundImage).toBe('none');
    expect(facts.shadow).not.toBe('none');
    expect(facts.accent).toBe('rgb(124, 58, 237)');
    expect(facts.headerHidden).toBe(true);
    expect(facts.todays).toBe(1);
    expect(facts.titleText).toBe('November 2026');
    expect(facts.titleClipped).toBe(false);
  });

  test('opening focuses the chosen day, not the calendar element, and arrows move it', async ({ page }) => {
    await page.locator('#to input.input').focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#to ui-calendar')).toBeVisible();
    const focused = () =>
      page.evaluate(() => {
        let node: Element | null = document.activeElement;
        while (node?.shadowRoot?.activeElement) node = node.shadowRoot.activeElement;
        return { date: node?.getAttribute('data-date') ?? null, tag: node?.tagName.toLowerCase(), outline: node ? getComputedStyle(node).outlineColor : '' };
      });
    await expect.poll(async () => (await focused()).date).toBe('2026-11-08');
    const first = await focused();
    expect(first.tag).toBe('button');
    // the themed ring (primary colour of the wrapper), not the browser's default
    expect(first.outline).toBe('rgb(124, 58, 237)');
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => (await focused()).date).toBe('2026-11-09');
    await page.keyboard.press('Enter');
    await expect(page.locator('#to')).toHaveAttribute('value', '2026-11-09');
    await expect(page.locator('#to [data-picker-layer]')).toHaveCount(0);
  });

  test('clicking a day commits it and closes; Escape and outside clicks close', async ({ page }) => {
    await page.locator('#to [data-action="toggle"]').click();
    await page.locator('#to ui-calendar .day[data-date="2026-11-12"]').click();
    await expect(page.locator('#to')).toHaveAttribute('value', '2026-11-12');
    await expect(page.locator('#to [data-picker-layer]')).toHaveCount(0);

    await page.locator('#to [data-action="toggle"]').click();
    await expect(page.locator('#to .panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#to [data-picker-layer]')).toHaveCount(0);

    await page.locator('#to [data-action="toggle"]').click();
    await expect(page.locator('#to .panel')).toBeVisible();
    await page.locator('#behind').click();
    await expect(page.locator('#to [data-picker-layer]')).toHaveCount(0);
  });

  test('clearable={false} hides both Clear buttons', async ({ page }) => {
    await expect(page.locator('#from .btn[data-action="clear"]')).toBeHidden();
    await expect(page.locator('#to .btn[data-action="clear"]')).toBeVisible();
    await page.locator('#from [data-action="toggle"]').click();
    await expect(page.locator('#from .panel')).toBeVisible();
    await expect(page.locator('#from [data-picker-layer] .footer [data-action="clear"]')).toBeHidden();
  });

  test('the range picker panel fits its calendar and keeps one Today', async ({ page }) => {
    await page.locator('#period [data-action="toggle"]').click();
    const panel = page.locator('#period .panel');
    await expect(panel).toBeVisible();
    const panelBox = (await panel.boundingBox())!;
    const calendarBox = (await page.locator('#period ui-calendar').boundingBox())!;
    expect(calendarBox.x + calendarBox.width).toBeLessThanOrEqual(panelBox.x + panelBox.width + 0.5);
    await expect(page.locator('#period ui-calendar .today-btn')).toHaveCount(0);
    await expect(page.locator('#period .panel > header.header')).toBeHidden();
    await expect(page.locator('#period [data-picker-layer] .footer [data-action="clear"]')).toBeHidden();
    await page.locator('#period ui-calendar .day[data-date="2026-11-03"]').click();
    await page.locator('#period ui-calendar .day[data-date="2026-11-09"]').click();
    await page.locator('#period [data-picker-layer] [data-action="apply"]').click();
    await expect(page.locator('#period')).toHaveAttribute('value', /2026-11-03.*2026-11-09/);
  });
});
