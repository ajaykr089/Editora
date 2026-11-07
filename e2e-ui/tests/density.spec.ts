import { expect, test } from '@playwright/test';

// ThemeProvider density rescales the shared control tokens for the whole app.
const heights = { compact: 28, default: 32, comfortable: 36 } as const;

for (const [density, height] of Object.entries(heights)) {
  test(`${density}: controls are ${height}px`, async ({ page }) => {
    await page.goto(`/density.html?density=${density}`);
    await page.waitForFunction(() => document.querySelector('#sel')?.shadowRoot?.querySelector('[role=combobox]'));
    const sizes = await page.evaluate(() => ({
      button: Math.round(document.querySelector('#btn')!.shadowRoot!.querySelector('button')!.getBoundingClientRect().height),
      input: Math.round(document.querySelector('#inp')!.shadowRoot!.querySelector('.shell')!.getBoundingClientRect().height),
      select: Math.round(document.querySelector('#sel')!.shadowRoot!.querySelector('.control')!.getBoundingClientRect().height),
    }));
    expect(sizes).toEqual({ button: height, input: height, select: height });
  });
}
