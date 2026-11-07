import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-input';
import '../components/ui-password-field';
import '../components/ui-number-field';
import '../components/ui-form';

const wait = (ms = 5) => new Promise((resolve) => setTimeout(resolve, ms));

function innerInput(host: Element): HTMLInputElement {
  return (host as HTMLElement).shadowRoot!.querySelector('input') as HTMLInputElement;
}

function pressEnter(input: HTMLInputElement, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true, cancelable: true, ...init });
  input.dispatchEvent(event);
  return event;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Enter in a shadow-DOM text field submits the surrounding form', () => {
  it('activates the default submit button of a native form', async () => {
    document.body.innerHTML = `
      <form>
        <ui-input name="email" value="a@b.c"></ui-input>
        <button type="submit" name="intent" value="save">Save</button>
      </form>`;
    const form = document.querySelector('form')!;
    const submitters: Array<string | null> = [];
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitters.push(((event as SubmitEvent).submitter as HTMLButtonElement | null)?.value ?? null);
    });
    await wait();

    pressEnter(innerInput(document.querySelector('ui-input')!));
    await wait();
    expect(submitters).toEqual(['save']);
  });

  it('does not submit when a keydown listener cancels Enter, or the default button is disabled', async () => {
    document.body.innerHTML = `
      <form>
        <ui-input name="q"></ui-input>
        <button type="submit">Go</button>
      </form>`;
    const form = document.querySelector('form')!;
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', onSubmit);
    const host = document.querySelector('ui-input')!;
    await wait();

    const cancel = (event: Event) => event.preventDefault();
    host.addEventListener('keydown', cancel);
    pressEnter(innerInput(host));
    await wait();
    expect(onSubmit).not.toHaveBeenCalled();
    host.removeEventListener('keydown', cancel);

    form.querySelector('button')!.disabled = true;
    pressEnter(innerInput(host));
    await wait();
    expect(onSubmit).not.toHaveBeenCalled();

    // An IME composition commit is not a submit.
    form.querySelector('button')!.disabled = false;
    pressEnter(innerInput(host), { isComposing: true });
    await wait();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a form with no button, and works for ui-password-field and ui-number-field', async () => {
    document.body.innerHTML = `
      <form id="a"><ui-input name="q"></ui-input></form>
      <form id="b"><ui-password-field name="password"></ui-password-field><button>Sign in</button></form>
      <form id="c"><ui-number-field name="qty"></ui-number-field></form>`;
    const submitted: string[] = [];
    document.querySelectorAll('form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        submitted.push(form.id);
      });
    });
    await wait();

    pressEnter(innerInput(document.querySelector('ui-input')!));
    pressEnter(innerInput(document.querySelector('ui-password-field')!));
    pressEnter(innerInput(document.querySelector('ui-number-field')!));
    await wait();
    expect(submitted.sort()).toEqual(['a', 'b', 'c']);
  });

  it('submits a ui-form', async () => {
    document.body.innerHTML = `<ui-form><ui-input name="q"></ui-input></ui-form>`;
    const uiForm = document.querySelector('ui-form') as HTMLElement & { requestSubmit: () => unknown };
    const spy = vi.spyOn(uiForm, 'requestSubmit').mockImplementation(() => undefined);
    await wait();
    pressEnter(innerInput(document.querySelector('ui-input')!));
    await wait();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('ui-input is form-associated', () => {
  it('contributes its value to FormData and follows form.reset()', async () => {
    document.body.innerHTML = `<form><ui-input name="email" value="first@example.com"></ui-input></form>`;
    const form = document.querySelector('form')!;
    const host = document.querySelector('ui-input') as HTMLElement & { value: string; form: HTMLFormElement | null };
    await wait();
    const internalsSupported = typeof (host as any).attachInternals === 'function' &&
      typeof (ElementInternals.prototype as any).setFormValue === 'function';
    if (!internalsSupported) return;

    expect(host.form).toBe(form);
    host.value = 'second@example.com';
    expect(new FormData(form).get('email')).toBe('second@example.com');
    form.reset();
    expect(host.value).toBe('first@example.com');
  });
});
