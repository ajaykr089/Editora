import { expect, test } from '@playwright/test';

// What assistive technology is told about the headless widgets: roles, names, states and the
// relations screen readers announce, read from the browser's accessibility tree.

test.beforeEach(async ({ page }) => {
  await page.goto('/headless.html');
  await page.waitForFunction(() => (window as any).__ready && document.querySelector('[role="tablist"]'));
});

test('static widgets: roles, names and states', async ({ page }) => {
  await expect(page.locator('body')).toMatchAriaSnapshot(`
    - tablist "Settings":
      - tab "Account" [selected]
      - tab "Billing"
      - tab "Team"
    - tabpanel "Account"
    - heading "Shipping" [level=3]:
      - button "Shipping" [expanded=false]
    - radiogroup "Alignment":
      - radio "Left" [checked]
      - radio "Center" [checked=false]
    - toolbar "Formatting":
      - button "Bold"
      - textbox "Font size"
    - checkbox "Accept terms" [checked=false]
    - switch "Wi-Fi" [checked=false]
    - radiogroup "Plan":
      - radio "Free" [checked]
    - slider "Minimum price"
    - slider "Maximum price"
    - combobox "Fruit" [expanded=false]
    - combobox "Country" [expanded=false]
    - navigation "Main":
      - list:
        - listitem:
          - button "Products" [expanded=false]
    - region "Notifications (F8)"
  `);
  await expect(page.getByRole('slider', { name: 'Maximum price' })).toHaveAttribute('aria-valuenow', '80');
  await expect(page.getByRole('slider', { name: 'Maximum price' })).toHaveAttribute('aria-valuemin', '20');
  await expect(page.getByRole('checkbox', { name: 'Accept terms' })).toHaveAttribute('aria-required', 'true');
  await expect(page.getByRole('button', { name: 'Save' })).toHaveAccessibleDescription('Saves the draft');
});

test('open popups are named and say what is active', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Fruit' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('listbox', { name: 'Fruit' })).toMatchAriaSnapshot(`
    - listbox "Fruit":
      - option "Apple" [selected=false]
      - option "Banana" [selected=false]
      - option "Cherry" [selected=false]
  `);
  const active = await page.getByRole('combobox', { name: 'Fruit' }).getAttribute('aria-activedescendant');
  await expect(page.locator(`[id="${active}"]`)).toHaveText('Apple');
  await page.keyboard.press('Escape');

  await page.getByRole('combobox', { name: 'Country' }).pressSequentially('gr');
  await expect(page.getByRole('listbox', { name: 'Country' })).toMatchAriaSnapshot(`
    - listbox "Country":
      - option "Greece"
  `);

  await page.getByRole('button', { name: 'Actions' }).click();
  await expect(page.getByRole('menu', { name: 'Actions' })).toMatchAriaSnapshot(`
    - menu "Actions":
      - menuitem "Edit"
      - menuitem "Duplicate" [disabled]
      - menuitem "Archive"
  `);
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog', { name: 'Delete file?' })).toBeVisible();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Shipping' }).click();
  await expect(page.getByRole('region', { name: 'Shipping' })).toBeVisible();
});

test('toasts are announced once, through a live region that existed before them', async ({ page }) => {
  const live = page.locator('[data-toast-announcer="assertive"]');
  await expect(live).toHaveAttribute('aria-live', 'assertive');
  await expect(live).toHaveText('');
  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(live).toHaveText('Saved');
});
