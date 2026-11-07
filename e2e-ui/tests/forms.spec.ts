import { expect, test } from '@playwright/test';

test.describe('form association (ElementInternals: jsdom cannot test this)', () => {
  test('FormData, reset, fieldset disabled and required, for every form control', async ({ page }) => {
    await page.goto('/forms.html');
    await page.waitForFunction(() => (window as any).result, null, { timeout: 15_000 });
    const r = await page.evaluate(() => (window as any).result);
    expect(r.initial).toMatchObject({
      email: ['a@b.c'], notes: ['hello'], pw: ['pw-test-value'], qty: ['3'], kind: ['b'], agree: ['on'],
      notify: ['on'], plan: ['pro'], vol: ['40'], tags: ['x', 'y'],
    });
    expect(r.initial.news).toBeUndefined();
    expect(r.changed).toMatchObject({ notes: ['changed'], qty: ['9'], kind: ['a'], plan: ['free'], vol: ['70'], tags: ['z'] });
    expect(r.changed.agree).toBeUndefined();
    expect(r.afterReset).toEqual(r.initial);
    expect(r.disabledViaFieldset.formData).toEqual({});
    expect(Object.values(r.disabledViaFieldset).filter((v) => v === true)).toHaveLength(7);
    expect(r.reenabled).toEqual({ select: false, checkbox: false, textareaInner: false });
    expect(r.requiredInvalid.every(([, invalid]: [string, boolean]) => invalid)).toBe(true);
    expect(r.formValid).toBe(false);
  });

  test('Enter in ui-input submits once through the default button; reset restores', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.querySelector('#email')?.shadowRoot?.querySelector('input'));
    // The form also has an empty required field, which must block submission natively.
    await page.locator('#email input').fill('typed@example.com');
    await page.locator('#email input').press('Enter');
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => (window as any).log.submits)).toEqual([]);
    await page.locator('#req input').fill('filled');
    await page.locator('#email input').press('Enter');
    await expect.poll(() => page.evaluate(() => (window as any).log.submits)).toEqual([{ submitter: 'Save', email: 'typed@example.com' }]);
    expect(await page.evaluate(() => { (document.querySelector('#f') as HTMLFormElement).reset(); return (document.querySelector('#email') as any).value; })).toBe('first@example.com');
  });
});

// A made-up value for the sign-in form in app/signin.html (not a credential for anything).
const TEST_PASSWORD = 'example-test-value';

test('sign-in fields: the author\'s slotted inputs are real form fields', async ({ page }) => {
  await page.goto('/signin.html');
  await page.waitForFunction(() => (window as any).ready);
  await page.locator('#email').evaluate((el) => (el.shadowRoot!.querySelector('.label') as HTMLElement).click());
  await expect(page.locator('input[name=email]')).toBeFocused();
  await page.keyboard.type('ann@acme.test');
  await page.locator('input[name=password]').fill(TEST_PASSWORD);
  await page.locator('#pw').evaluate((el) => (el.shadowRoot!.querySelector('.toggle-btn') as HTMLElement).click());
  await expect(page.locator('input[name=password]')).toHaveAttribute('type', 'text');
  await page.locator('#pw').evaluate((el) => (el.shadowRoot!.querySelector('.toggle-btn') as HTMLElement).click());
  await page.locator('input[name=password]').press('Enter');
  await expect.poll(() => page.evaluate(() => (window as any).submits)).toEqual([['email=ann@acme.test', `password=${TEST_PASSWORD}`]]);
  await expect(page.locator('input[name=email]')).toHaveAttribute('autocomplete', 'username');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveAttribute('name', 'email');
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('name', 'password');
});

test('controlled text fields: fast typing, transforms and the caret', async ({ page }) => {
  await page.goto('/typing.html');
  await page.waitForFunction(() => document.querySelector('#d')?.shadowRoot?.querySelector('input'));
  const value = (id: string) => page.evaluate((i) => (document.querySelector('#' + i)!.shadowRoot!.querySelector('input, textarea') as HTMLInputElement).value, id);
  await page.locator('#a input').click();
  await page.keyboard.type('hello world', { delay: 0 });
  await page.evaluate(() => (document.querySelector('#a')!.shadowRoot!.querySelector('input') as HTMLInputElement).setSelectionRange(5, 5));
  await page.keyboard.type(', big', { delay: 0 });
  expect(await value('a')).toBe('hello, big world');
  expect(await page.evaluate(() => (document.querySelector('#a')!.shadowRoot!.querySelector('input') as HTMLInputElement).selectionStart)).toBe(10);
  await page.locator('#b input').click();
  await page.keyboard.type('abcdefghijk', { delay: 0 });
  await expect.poll(() => value('b')).toBe('ABCDEFGH');
  await page.locator('#c textarea').click();
  await page.keyboard.type('line one\nline two', { delay: 0 });
  expect(await value('c')).toBe('line one\nline two');
  await page.locator('#d input').click();
  await page.keyboard.press('End');
  await page.keyboard.type('ed', { delay: 0 });
  expect(await value('d')).toBe('started');
  expect(await page.evaluate(() => (window as any).commits)).toEqual(['hello, big world']);
});
