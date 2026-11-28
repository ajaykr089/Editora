import { expect, test } from '@playwright/test';

// The headless hooks (@editora/ui-react Headless) on plain markup, in Chromium, Firefox and WebKit:
// the keyboard, focus, pointer and form behaviour jsdom cannot show.

test.beforeEach(async ({ page }) => {
  await page.goto('/headless.html');
  await page.waitForFunction(() => (window as any).__ready && document.querySelector('[role="tablist"]'));
});

test('dialog: traps focus, Escape closes and returns focus to the trigger', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open dialog' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Delete file?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Delete' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('menu: arrows skip disabled items, Enter chooses and focus returns', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Actions' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Archive' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#menu-out')).toHaveText('Archive');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('menu', { name: 'Actions' })).toBeHidden();
});

test('tabs and accordion: arrows move, panels follow', async ({ page }) => {
  await page.getByRole('tab', { name: 'Account' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Billing' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Billing panel')).toBeVisible();
  await expect(page.getByText('Account panel')).toBeHidden();

  const shipping = page.getByRole('button', { name: 'Shipping' });
  await shipping.click();
  await expect(shipping).toHaveAttribute('aria-expanded', 'true');
  // Safari does not focus a button on click.
  await shipping.focus();
  await expect(page.getByRole('region', { name: 'Shipping' })).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('button', { name: 'Returns' })).toBeFocused();
});

test('tooltip: describes its trigger on hover, hides on Escape', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Save' });
  await trigger.hover();
  const tip = page.getByRole('tooltip');
  await expect(tip).toBeVisible();
  await expect(trigger).toHaveAccessibleDescription('Saves the draft');
  await page.keyboard.press('Escape');
  await expect(tip).toBeHidden();
});

test('toggle group and toolbar: one tab stop, arrows move, text input keeps its arrows', async ({ page }) => {
  const left = page.getByRole('radio', { name: 'Left' });
  await expect(left).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('radio', { name: 'Center' }).click();
  await expect(page.getByRole('radio', { name: 'Center' })).toHaveAttribute('aria-checked', 'true');
  await expect(left).toHaveAttribute('aria-checked', 'false');

  const toolbar = page.getByRole('toolbar', { name: 'Formatting' });
  await toolbar.getByRole('button', { name: 'Bold' }).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  const size = toolbar.getByRole('textbox', { name: 'Font size' });
  await expect(size).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(size).toBeFocused();
});

test('form controls: keyboard and pointer, submitted with the form, restored by reset', async ({ page }) => {
  const submit = page.getByRole('button', { name: 'Submit' });
  await submit.click();
  await expect(page.locator('#form-out')).toHaveText('', { timeout: 2000 });

  await page.getByRole('checkbox', { name: 'Accept terms' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('checkbox', { name: 'Accept terms' })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('switch', { name: 'Wi-Fi' }).click();

  await page.getByRole('radio', { name: 'Free' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'Pro' })).toBeFocused();
  await expect(page.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true');

  const max = page.getByRole('slider', { name: 'Maximum price' });
  await max.focus();
  await page.keyboard.press('End');
  await expect(max).toHaveAttribute('aria-valuenow', '100');
  // Drag the minimum thumb to the middle of the track.
  const track = await page.locator('#track').boundingBox();
  const min = await page.getByRole('slider', { name: 'Minimum price' }).boundingBox();
  await page.mouse.move(min!.x + min!.width / 2, min!.y + min!.height / 2);
  await page.mouse.down();
  await page.mouse.move(track!.x + track!.width / 2, track!.y + track!.height / 2, { steps: 5 });
  await page.mouse.up();
  const value = Number(await page.getByRole('slider', { name: 'Minimum price' }).getAttribute('aria-valuenow'));
  expect(value).toBeGreaterThanOrEqual(45);
  expect(value).toBeLessThanOrEqual(55);

  const fruit = page.getByRole('combobox', { name: 'Fruit' });
  await fruit.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(fruit).toHaveText('Banana');
  await expect(fruit).toBeFocused();

  await submit.click();
  await expect(page.locator('#form-out')).toHaveText(`terms=on&wifi=on&plan=pro&price[]=${value}&price[]=100&fruit=banana`);

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('checkbox', { name: 'Accept terms' })).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-checked', 'true');
  await expect(max).toHaveAttribute('aria-valuenow', '80');
});

test('combobox: typing filters, Enter chooses, focus stays in the input', async ({ page }) => {
  const input = page.getByRole('combobox', { name: 'Country' });
  await input.click();
  await input.pressSequentially('gr');
  await expect(page.getByRole('option', { name: 'Greece' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'France' })).toBeHidden();
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('Greece');
  await expect(page.locator('#combo-out')).toHaveText('gr');
  await expect(input).toBeFocused();
});

test('context menu: right click opens at the pointer, Shift+F10 opens from the keyboard', async ({ page }) => {
  const area = page.locator('#area');
  await area.click({ button: 'right', position: { x: 40, y: 20 } });
  const menu = page.getByRole('menu', { name: 'Area actions' });
  await expect(menu).toBeVisible();
  const box = await area.boundingBox();
  const at = await menu.boundingBox();
  expect(Math.abs(at!.x - (box!.x + 40))).toBeLessThan(12);
  await expect(page.getByRole('menuitem', { name: 'Copy' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('#ctx-out')).toHaveText('Paste');

  await area.focus();
  await page.keyboard.press('Shift+F10');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(area).toBeFocused();
});

test('navigation menu: hover opens, Escape returns to the trigger, links stay links', async ({ page }) => {
  const products = page.getByRole('button', { name: 'Products' });
  await products.hover();
  await expect(products).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Editor' })).toBeVisible();
  await products.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('link', { name: 'Editor' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(products).toHaveAttribute('aria-expanded', 'false');
  await expect(products).toBeFocused();
});

test('toaster: announced, F8 reaches it, timers pause while focused, close button dismisses', async ({ page }) => {
  await page.getByRole('button', { name: 'Show toast' }).click();
  const region = page.getByRole('region', { name: 'Notifications (F8)' });
  await expect(region.getByText('Saved')).toBeVisible();
  await expect(page.locator('[data-toast-announcer="assertive"]')).toHaveText('Saved');
  await page.keyboard.press('F8');
  await page.waitForTimeout(2000);
  await expect(region.getByText('Saved')).toBeVisible();
  await region.getByRole('button', { name: 'Close' }).click();
  await expect(region.getByText('Saved')).toBeHidden();
  // Closing moved focus into the region (which pauses timers): move it out, as a user would.
  await page.getByRole('button', { name: 'Show toast' }).focus();
  await page.getByRole('button', { name: 'Show toast' }).click();
  await page.mouse.move(5, 5);
  await expect(region.getByText('Saved')).toBeHidden({ timeout: 4000 });
});
