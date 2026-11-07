import { expect, test, type Page } from '@playwright/test';

// WAI-ARIA keyboard patterns: tabs, listbox (select), menu (dropdown), dialog, combobox.
const deepActive = (page: Page) => page.evaluate(() => {
  let a: any = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return a?.id || a?.getAttribute('aria-label') || a?.textContent?.trim() || a?.tagName;
});

test.beforeEach(async ({ page }) => {
  await page.goto('/keyboard.html');
  await page.waitForFunction(() => document.querySelector('#cb')?.shadowRoot?.querySelector('input'));
});

test('tabs: arrows move and select (wrapping), Home/End jump', async ({ page }) => {
  await page.getByRole('tab', { name: 'One' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Two' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Three' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'One' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Three' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true');
});

test('select (listbox): ArrowDown opens, arrows move the active option, Enter picks, Escape closes', async ({ page }) => {
  const combobox = page.getByRole('combobox', { name: 'Fruit' });
  await combobox.focus();
  await page.keyboard.press('ArrowDown');
  await expect(combobox).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown');
  const active = await combobox.getAttribute('aria-activedescendant');
  expect(active).toBeTruthy();
  await expect(page.locator(`#sel >> [id="${active}"]`)).toHaveText(/Banana/);
  await page.keyboard.press('Enter');
  await expect(combobox).toHaveAttribute('aria-expanded', 'false');
  await expect(combobox).toHaveText('Banana');
  await expect(combobox).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  await expect(combobox).toHaveAttribute('aria-expanded', 'false');
  await expect(combobox).toHaveText('Banana');
});

test('menu (dropdown): Enter opens on the first item, arrows move, Escape closes back to the trigger', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Actions' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Duplicate' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('dialog: focus moves in, Tab stays inside and reaches its fields, Escape returns focus', async ({ page }) => {
  await page.getByRole('button', { name: 'Open dialog' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Edit item' })).toBeVisible();
  const seen: string[] = [await deepActive(page)];
  for (let i = 0; i < 6; i += 1) {
    await page.keyboard.press('Tab');
    seen.push(await deepActive(page));
  }
  // The fields inside the dialog are reachable, and focus never leaves the dialog.
  expect(seen).toContain('first');
  expect(seen).toContain('second');
  expect(seen).not.toContain('opener');
  expect(seen.filter((id) => ['Fruit', 'Actions', 'One', 'City'].includes(id))).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open dialog' })).toBeFocused();
});

test('combobox: typing filters, ArrowDown and Enter pick', async ({ page }) => {
  const input = page.getByRole('combobox', { name: 'City' });
  await input.focus();
  await page.keyboard.type('bo');
  await expect(page.getByRole('option')).toHaveCount(1);
  await expect(page.getByRole('option')).toContainText('Boston');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => (document.querySelector('#cb') as any).value)).toBe('boston');
});
