import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-form';
import '../components/ui-date-picker';
import '../components/ui-time-picker';
import '../components/ui-date-range-picker';
import '../components/ui-number-field';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => { document.body.innerHTML = ''; });

async function mount(markup: string) {
  document.body.innerHTML = `<ui-form>${markup}</ui-form>`;
  await tick();
  await tick();
  return document.querySelector('ui-form') as HTMLElement & {
    getValues(): Record<string, unknown>;
    validate(): Promise<{ valid: boolean; errors: Record<string, string> }>;
    setErrors(errors: Record<string, string>, options?: { focus?: boolean }): void;
    getErrors(): Record<string, string>;
  };
}

describe('pickers in a ui-form', () => {
  it('are collected, checked when required, and show server errors', async () => {
    const form = await mount(`
      <ui-date-picker name="date" required></ui-date-picker>
      <ui-time-picker name="time" value="09:30"></ui-time-picker>
      <ui-date-range-picker name="period"></ui-date-range-picker>`);
    expect(form.getValues()).toEqual(expect.objectContaining({ date: '', time: '09:30', period: '' }));
    const result = await form.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.date).toBe('Choose a date');

    document.querySelector('ui-date-picker')!.setAttribute('value', '2026-06-01');
    expect((await form.validate()).valid).toBe(true);
    expect(form.getValues().date).toBe('2026-06-01');

    form.setErrors({ date: 'Outside the open accounting period' }, { focus: false });
    const picker = document.querySelector('ui-date-picker')!;
    expect(picker.getAttribute('error')).toBe('Outside the open accounting period');
    picker.dispatchEvent(new Event('change', { bubbles: true }));
    expect(picker.hasAttribute('error')).toBe(false);
  });

  it('registers a picker whose name is set after it connects (as React does)', async () => {
    const form = await mount('<ui-date-picker></ui-date-picker>');
    const picker = document.querySelector('ui-date-picker')!;
    picker.setAttribute('name', 'due');
    picker.setAttribute('value', '2026-07-01');
    expect(form.getValues().due).toBe('2026-07-01');
  });
});

describe('ui-number-field in a ui-form', () => {
  it('commits text typed since the field was last left when the form reads or validates it', async () => {
    const form = await mount('<ui-number-field name="amount" required></ui-number-field>');
    const field = document.querySelector('ui-number-field')!;
    const input = field.shadowRoot!.querySelector('input')!;
    input.focus();
    input.value = '120.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    // Safari and Firefox do not move focus to a clicked Submit button: the field is never left
    expect((await form.validate()).valid).toBe(true);
    expect(form.getValues().amount).toBe('120.5');
  });
});
