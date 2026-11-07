import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-input';
import '../components/ui-password-field';

const wait = () => new Promise((resolve) => setTimeout(resolve, 10));
afterEach(() => { document.body.innerHTML = ''; });

describe('<input slot="input"> (password managers, autofill)', () => {
  it('uses the author input as the control and leaves its name, type and autocomplete alone', async () => {
    document.body.innerHTML = `
      <form>
        <ui-input label="Email" name="ignored" type="text"><input slot="input" name="email" type="email" autocomplete="username"></ui-input>
        <ui-password-field label="Password"><input slot="input" name="password" autocomplete="current-password"></ui-password-field>
      </form>`;
    await wait();
    const email = document.querySelector('input[name="email"]') as HTMLInputElement;
    const password = document.querySelector('input[name="password"]') as HTMLInputElement;
    expect(email.type).toBe('email');
    expect(email.getAttribute('autocomplete')).toBe('username');
    expect(email.getAttribute('aria-label')).toBe('Email');
    expect(password.type).toBe('password');
    expect(password.getAttribute('aria-label')).toBe('Password');

    email.value = 'ann@acme.test';
    email.dispatchEvent(new Event('input', { bubbles: true }));
    await wait();
    expect((document.querySelector('ui-input') as HTMLElement & { value: string }).value).toBe('ann@acme.test');

    // Both are ordinary form fields: one entry each.
    const data = [...new FormData(document.querySelector('form')!)].map(([key]) => key);
    expect(data.sort()).toEqual(['email', 'password']);
  });

  it('keeps an author label', async () => {
    document.body.innerHTML = `<label for="x">Login</label><ui-input label="Email"><input slot="input" id="x" name="e"></ui-input>`;
    await wait();
    expect((document.getElementById('x') as HTMLInputElement).hasAttribute('aria-label')).toBe(false);
  });
});
