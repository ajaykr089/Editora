import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-form';
import '../components/ui-input';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

async function mount(markup: string) {
  const form = document.createElement('ui-form') as any;
  form.innerHTML = markup;
  document.body.appendChild(form);
  await tick();
  await tick();
  return form;
}

afterEach(() => { document.body.innerHTML = ''; });

describe('ui-form setErrors: errors from a server response', () => {
  it('shows each message on its field, Editora or native, and focuses the first one in the form', async () => {
    const form = await mount(`
      <ui-input name="email" label="Email" value="ava@example.com"></ui-input>
      <input name="phone" value="123" />
      <input name="untouched" />`);
    const email = form.querySelector('ui-input');
    const phone = form.querySelector('input[name="phone"]') as HTMLInputElement;

    // keys in the opposite order to the layout: focus still goes to the first field on the page
    form.setErrors({ phone: 'Not a valid phone number', email: 'Already registered', untouched: null });

    expect(email.getAttribute('data-error')).toBe('Already registered');
    expect(email.getAttribute('validation')).toBe('error');
    expect(phone.validationMessage).toBe('Not a valid phone number');
    expect(phone.getAttribute('aria-invalid')).toBe('true');
    expect(form.getErrors()).toEqual({ phone: 'Not a valid phone number', email: 'Already registered' });
    expect(document.activeElement).toBe(email);
  });

  it('can leave focus alone', async () => {
    const form = await mount('<input name="phone" />');
    const before = document.activeElement;
    form.setErrors({ phone: 'Wrong' }, { focus: false });
    expect(document.activeElement).toBe(before);
  });

  it("clears a field's error when that field is edited, and keeps the others", async () => {
    const form = await mount('<input name="phone" /><input name="city" />');
    const phone = form.querySelector('input[name="phone"]') as HTMLInputElement;
    const city = form.querySelector('input[name="city"]') as HTMLInputElement;
    form.setErrors({ phone: 'Wrong', city: 'Unknown' }, { focus: false });

    phone.value = '555';
    phone.dispatchEvent(new Event('input', { bubbles: true }));

    expect(phone.validity.valid).toBe(true);
    expect(phone.hasAttribute('aria-invalid')).toBe(false);
    expect(city.validationMessage).toBe('Unknown');
    expect(form.getErrors()).toEqual({ city: 'Unknown' });
  });

  it('clears them all on the next submit, so they do not block it', async () => {
    const form = await mount('<input name="phone" value="1" /><ui-input name="email" value="a@b.co"></ui-input>');
    form.setErrors({ phone: 'Wrong', email: 'Taken' }, { focus: false });
    const submitted = vi.fn();
    form.addEventListener('submit', submitted);

    expect(await form.submit()).toBe(true);
    expect(submitted).toHaveBeenCalledTimes(1);
    expect(form.getErrors()).toEqual({});
    expect(form.querySelector('ui-input').hasAttribute('data-error')).toBe(false);
  });

  it('clearErrors() clears the named fields or all of them', async () => {
    const form = await mount('<input name="a" /><input name="b" />');
    form.setErrors({ a: 'A', b: 'B' }, { focus: false });
    form.clearErrors(['a']);
    expect(form.getErrors()).toEqual({ b: 'B' });
    form.clearErrors();
    expect(form.getErrors()).toEqual({});
    expect((form.querySelector('input[name="b"]') as HTMLInputElement).validity.valid).toBe(true);
  });
});
