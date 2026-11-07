import React from 'react';
import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Form } from '../components/Form';
import { Input } from '../components/Input';

const settle = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 10)); });

afterEach(() => { document.body.innerHTML = ''; });

describe('Form errors prop', () => {
  it('shows a new errors object on the fields, once', async () => {
    const { container, rerender } = render(
      <Form><Input name="email" label="Email" /><input name="phone" /></Form>
    );
    await settle();
    const email = container.querySelector('ui-input')!;
    const phone = container.querySelector('input[name="phone"]') as HTMLInputElement;

    const serverErrors = { email: 'Already registered', phone: 'Wrong' };
    rerender(<Form errors={serverErrors}><Input name="email" label="Email" /><input name="phone" /></Form>);
    await settle();
    expect(email.getAttribute('data-error')).toBe('Already registered');
    expect(phone.validationMessage).toBe('Wrong');

    // the user fixes the phone; re-rendering with the same object must not bring its error back
    phone.value = '555';
    act(() => { phone.dispatchEvent(new Event('input', { bubbles: true })); });
    rerender(<Form errors={serverErrors}><Input name="email" label="Email" /><input name="phone" /></Form>);
    await settle();
    expect(phone.validity.valid).toBe(true);
    expect((container.querySelector('ui-form') as any).getErrors()).toEqual({ email: 'Already registered' });
  });
});
