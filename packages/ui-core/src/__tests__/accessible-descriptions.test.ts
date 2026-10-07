import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-field';
import '../components/ui-input';
import '../components/ui-textarea';
import '../components/ui-number-field';
import '../components/ui-password-field';
import '../components/ui-tags-input';
import '../components/ui-pin-input';
import '../components/ui-select';
import '../components/ui-combobox';
import '../components/ui-multi-select';
import '../components/ui-date-picker';
import '../components/ui-time-field';
import '../components/ui-date-field';
import '../components/ui-checkbox';

// A description has to reach the control that is announced. An id on the host cannot be followed from
// inside a shadow root, and the description a ui-field draws lives in the field's own shadow root, so
// the text travels as aria-description and each control forwards it to the element inside it.

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const mount = async (html: string) => {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  await flush();
  await flush();
  return host;
};

// The text a control is described by, resolved the way assistive technology does it.
const describedText = (control: Element | null): string => {
  if (!control) return '';
  const root = control.getRootNode() as ShadowRoot | Document;
  return (control.getAttribute('aria-describedby') || '')
    .split(/\s+/)
    .map((id) => root.getElementById?.(id)?.textContent?.trim() || '')
    .filter(Boolean)
    .join(' ');
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-field description and error', () => {
  it('puts both on the control as text, not as ids that cannot resolve', async () => {
    const host = await mount(
      '<ui-field label="Email" description="We never share it" error="Enter a valid address"><input id="plain" /></ui-field>'
    );
    const input = host.querySelector('#plain')!;

    expect(input.getAttribute('aria-description')).toBe('We never share it Enter a valid address');
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('follows the description as it changes and clears it when it goes', async () => {
    const host = await mount('<ui-field label="Email" description="First"><input id="plain" /></ui-field>');
    const field = host.querySelector('ui-field')!;
    const input = host.querySelector('#plain')!;

    field.setAttribute('description', 'Second');
    await flush();
    expect(input.getAttribute('aria-description')).toBe('Second');

    field.removeAttribute('description');
    await flush();
    expect(input.hasAttribute('aria-description')).toBe(false);
  });

  it('leaves a description the author wrote, and ids the author wired up', async () => {
    const host = await mount(
      '<p id="hint">Hint text</p><ui-field label="Email" description="From the field"><input id="plain" aria-description="Mine" aria-describedby="hint" /></ui-field>'
    );
    const input = host.querySelector('#plain')!;

    expect(input.getAttribute('aria-description')).toBe('Mine');
    expect(input.getAttribute('aria-describedby')).toBe('hint');
  });

  it('reads a slotted description and error', async () => {
    const host = await mount(
      '<ui-field label="Email"><span slot="description">Slotted help</span><span slot="error">Slotted error</span><input id="plain" /></ui-field>'
    );

    expect(host.querySelector('#plain')!.getAttribute('aria-description')).toBe('Slotted help Slotted error');
  });
});

describe.each([
  ['ui-input', 'input', 'description'],
  ['ui-textarea', 'textarea', 'description'],
  ['ui-number-field', 'input', 'description'],
  ['ui-password-field', 'input', 'description'],
  ['ui-tags-input', 'input', 'description'],
  ['ui-combobox', 'input', 'description'],
  ['ui-multi-select', 'input', 'description'],
  ['ui-date-picker', 'input', 'hint'],
])('%s inside a ui-field', (tag, selector, ownAttr) => {
  it('describes its inner control with the field description', async () => {
    const host = await mount(`<ui-field label="Field" description="Used for receipts"><${tag}></${tag}></ui-field>`);
    const control = host.querySelector(tag)!.shadowRoot!.querySelector(selector);

    expect(describedText(control)).toContain('Used for receipts');
  });

  it('keeps its own description and adds the field text after it', async () => {
    const host = await mount(
      `<ui-field description="From the field"><${tag} label="Own" ${ownAttr}="Own help"></${tag}></ui-field>`
    );
    const control = host.querySelector(tag)!.shadowRoot!.querySelector(selector);

    expect(describedText(control)).toContain('Own help');
    expect(describedText(control)).toContain('From the field');
  });

  it('drops the forwarded text again when the field stops describing', async () => {
    const host = await mount(`<ui-field description="Temporary"><${tag}></${tag}></ui-field>`);
    const field = host.querySelector('ui-field')!;
    const control = host.querySelector(tag)!.shadowRoot!.querySelector(selector);

    field.removeAttribute('description');
    await flush();
    await flush();
    expect(describedText(control)).not.toContain('Temporary');
  });
});

describe('controls with a different inner element', () => {
  it('ui-select describes its trigger', async () => {
    const host = await mount('<ui-field description="Pick one"><ui-select></ui-select></ui-field>');
    const trigger = host.querySelector('ui-select')!.shadowRoot!.querySelector('.trigger');

    expect(describedText(trigger)).toContain('Pick one');
  });

  it('ui-pin-input describes every digit with one shared element', async () => {
    const host = await mount('<ui-field description="Sent by SMS"><ui-pin-input length="4"></ui-pin-input></ui-field>');
    const root = host.querySelector('ui-pin-input')!.shadowRoot!;
    const digits = Array.from(root.querySelectorAll('input.slot'));

    expect(digits).toHaveLength(4);
    digits.forEach((digit) => expect(describedText(digit)).toContain('Sent by SMS'));
    expect(root.querySelectorAll('[id$="external-description"]')).toHaveLength(1);
  });

  it('ui-time-field and ui-date-field describe their group', async () => {
    const host = await mount(
      '<ui-field description="Local time"><ui-time-field></ui-time-field></ui-field><ui-field description="Birth date"><ui-date-field></ui-date-field></ui-field>'
    );

    expect(describedText(host.querySelector('ui-time-field')!.shadowRoot!.querySelector('[role="group"]'))).toContain('Local time');
    expect(describedText(host.querySelector('ui-date-field')!.shadowRoot!.querySelector('[role="group"]'))).toContain('Birth date');
  });

  it('ui-time-field names its group from the host aria-label when it has no label', async () => {
    const host = await mount('<ui-time-field aria-label="Start time"></ui-time-field>');

    expect(host.querySelector('ui-time-field')!.shadowRoot!.querySelector('[role="group"]')!.getAttribute('aria-label')).toBe('Start time');
  });
});

describe('a control used on its own', () => {
  it('follows an aria-describedby the author put on the host', async () => {
    const host = await mount('<p id="note">Takes a minute</p><ui-input aria-describedby="note"></ui-input>');
    const control = host.querySelector('ui-input')!.shadowRoot!.querySelector('input');

    expect(describedText(control)).toContain('Takes a minute');
  });

  it('describes a role-bearing control directly on its host', async () => {
    const host = await mount('<ui-field description="Required for billing"><ui-checkbox label="Agree"></ui-checkbox></ui-field>');

    expect(host.querySelector('ui-checkbox')!.getAttribute('aria-description')).toBe('Required for billing');
  });
});
