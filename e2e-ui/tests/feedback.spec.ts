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

test.describe('chart', () => {
  test('fits a narrow card, keeps summary and readout off, no status pill, Indian grouping, axis from 0', async ({ page }) => {
    await page.waitForFunction(() => !!document.querySelector('#spend')?.shadowRoot?.querySelector('.plot-shell'));
    const facts = await page.evaluate(() => {
      const root = (id: string) => document.querySelector(id)!.shadowRoot!;
      const scroll = (id: string) => {
        const shell = root(id).querySelector('.plot-shell') as HTMLElement;
        return shell.scrollWidth - shell.clientWidth;
      };
      const ticks = (id: string) => Array.from(root(id).querySelectorAll('.axis-y span')).map((node) => node.textContent || '');
      return {
        overflow: ['#spend', '#flat', '#tones'].map(scroll),
        summary: !!root('#spend').querySelector('.summary'),
        insight: !!root('#spend').querySelector('.insight'),
        headerShown: getComputedStyle(root('#spend').querySelector('.header')!).display !== 'none',
        pill: !!root('#spend').querySelector('.status-pill'),
        cells: Array.from(root('#spend').querySelectorAll('table.data-table td')).map((node) => node.textContent),
        ticks: [...ticks('#spend'), ...ticks('#flat')],
        fills: Array.from(root('#tones').querySelectorAll('svg rect')).map((node) => getComputedStyle(node).fill)
      };
    });
    expect(facts.overflow.every((px) => px <= 0)).toBe(true);
    expect(facts.summary).toBe(false);
    expect(facts.insight).toBe(false);
    expect(facts.headerShown).toBe(false);
    expect(facts.pill).toBe(false);
    expect(facts.cells).toContain('₹1,00,000');
    expect(facts.ticks.some((tick) => tick.includes('-'))).toBe(false);
    // tone names: success and danger from the theme, not black
    expect(facts.fills).toContain('rgb(21, 128, 61)');
    expect(facts.fills).toContain('rgb(220, 38, 38)');
    expect(facts.fills).not.toContain('rgb(0, 0, 0)');
  });

  test('a single dataset has no "Series 1" in its tooltip', async ({ page }) => {
    await page.locator('#spend .plot-hit[data-point-index="2"]').hover();
    const tooltip = page.locator('#spend .tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).not.toContainText('Series');
    await expect(tooltip).toContainText('₹900');
  });
});

test('dropdown: near the window edge the menu lines up with the trigger end; align="start" overrides', async ({ page }) => {
  await page.locator('#menu [slot="trigger"], #menu > :first-child').first().click();
  const panel = page.locator('#menu .panel');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-align', 'end');
  const box = (await panel.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  await page.locator('#menu').evaluate((el) => el.setAttribute('align', 'start'));
  await expect(panel).toHaveAttribute('data-align', 'start');
});

test('sidebar row gap is configurable', async ({ page }) => {
  const gap = () => page.locator('#side').evaluate((el) => getComputedStyle(el.shadowRoot!.querySelector('.section-items')!).rowGap);
  await expect.poll(gap).toBe('2px');
  await page.locator('#side').evaluate((el) => (el as HTMLElement).style.setProperty('--ui-sidebar-row-gap', '6px'));
  await expect.poll(gap).toBe('6px');
});

test('field outlines reach 3:1 against the page', async ({ page }) => {
  const ratios = await page.evaluate(() => {
    const toRgb = (value: string) => {
      const nums = (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      return value.startsWith('color(') ? nums.map((v) => v * 255) : nums;
    };
    const lum = (rgb: number[]) => {
      const [r, g, b] = rgb.map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    return ['#f-input', '#f-select', '#f-textarea', '#to'].map((id) => {
      const root = document.querySelector(id)!.shadowRoot!;
      const edge = Array.from(root.querySelectorAll('*')).find((el) => {
        const style = getComputedStyle(el);
        return parseFloat(style.borderTopWidth) >= 1 && style.borderTopStyle !== 'none' && (el as HTMLElement).offsetWidth > 100;
      })!;
      const l = lum(toRgb(getComputedStyle(edge).borderTopColor));
      return { id, ratio: (1 + 0.05) / (l + 0.05) };
    });
  });
  for (const { id, ratio } of ratios) expect(ratio, id).toBeGreaterThanOrEqual(3);
});

test('layout shell: a sidebar that fills its column does not scroll sideways', async ({ page }) => {
  await page.goto('/feedback-shell.html');
  await page.waitForFunction(() => !!document.querySelector('#layout')?.shadowRoot?.querySelector('.sidebar-panel'));
  const sizes = await page.evaluate(() => {
    const panel = document.querySelector('#layout')!.shadowRoot!.querySelector('.sidebar-panel') as HTMLElement;
    const style = getComputedStyle(panel);
    return {
      client: panel.clientWidth,
      scrollbar: panel.offsetHeight - panel.clientHeight - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth),
      overflowX: style.overflowX,
      sidebar: document.querySelector('#side')!.getBoundingClientRect().width
    };
  });
  // no horizontal scrollbar, and the sidebar fits inside the panel next to its 1px divider
  expect(sizes.overflowX).toBe('hidden');
  expect(sizes.scrollbar).toBeLessThanOrEqual(0);
  expect(sizes.sidebar).toBeLessThanOrEqual(sizes.client);
  expect(sizes.sidebar).toBeGreaterThan(250);
});
