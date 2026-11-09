import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DatePicker } from '../components/DatePicker';
import { DateRangePicker } from '../components/DateRangePicker';
import { DateTimePicker } from '../components/DateTimePicker';
import { DateRangeTimePicker } from '../components/DateRangeTimePicker';
import { TimePicker } from '../components/TimePicker';

// These elements treat a missing `clearable` (and `allow-input`, `allow-partial`, ...) as on, so
// `false` has to reach them as "false": removing the attribute used to turn the feature back on.
describe('default-on picker attributes', () => {
  it('writes false as "false", true as present, and leaves undefined to the element', () => {
    const { container, rerender } = render(<DatePicker clearable={false} allowInput={false} closeOnSelect={false} />);
    const host = container.querySelector('ui-date-picker')!;
    expect(host.getAttribute('clearable')).toBe('false');
    expect(host.getAttribute('allow-input')).toBe('false');
    expect(host.getAttribute('close-on-select')).toBe('false');

    rerender(<DatePicker clearable allowInput={false} />);
    expect(host.getAttribute('clearable')).toBe('');
    expect(host.hasAttribute('close-on-select')).toBe(false);

    rerender(<DatePicker />);
    expect(host.hasAttribute('clearable')).toBe(false);
    expect(host.hasAttribute('allow-input')).toBe(false);
  });

  it('covers the other pickers', () => {
    const { container } = render(
      <>
        <DateRangePicker clearable={false} allowPartial={false} allowSameDay={false} />
        <DateTimePicker clearable={false} allowInput={false} />
        <DateRangeTimePicker clearable={false} autoNormalize={false} allowPartial={false} />
        <TimePicker clearable={false} allowInput={false} />
      </>
    );
    const expectFalse = (tag: string, names: string[]) => {
      const host = container.querySelector(tag)!;
      names.forEach((name) => expect(host.getAttribute(name), `${tag} ${name}`).toBe('false'));
    };
    expectFalse('ui-date-range-picker', ['clearable', 'allow-partial', 'allow-same-day']);
    expectFalse('ui-date-time-picker', ['clearable', 'allow-input']);
    expectFalse('ui-date-range-time-picker', ['clearable', 'auto-normalize', 'allow-partial']);
    expectFalse('ui-time-picker', ['clearable', 'allow-input']);
  });
});

describe('uncontrolled pickers', () => {
  it('keep the picked value when another prop changes', () => {
    const { container, rerender } = render(<DatePicker label="From" />);
    const host = container.querySelector('ui-date-picker')!;
    host.setAttribute('value', '2026-11-12'); // what the element does when a day is picked
    rerender(<DatePicker label="From" error="Pick a later date" />);
    expect(host.getAttribute('value')).toBe('2026-11-12');
    rerender(<DatePicker label="From" value="" />);
    expect(host.hasAttribute('value')).toBe(false);
  });
});

describe('more wrappers that wiped an uncontrolled value', () => {
  it('ColorPicker, Calendar, DateField and Stepper keep the value the element set', async () => {
    const { ColorPicker } = await import('../components/ColorPicker');
    const { Calendar } = await import('../components/Calendar');
    const { DateField } = await import('../components/DateField');
    const { Stepper } = await import('../components/Stepper');
    const steps = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
    const cases: Array<[string, (label: string) => React.ReactElement, string]> = [
      ['ui-color-picker', (label) => <ColorPicker aria-label={label} />, '#ff0000'],
      ['ui-calendar', (label) => <Calendar aria-label={label} />, '2026-11-12'],
      ['ui-date-field', (label) => <DateField label={label} />, '2026-11-12'],
      ['ui-stepper', (label) => <Stepper aria-label={label} steps={steps} />, 'b']
    ];
    for (const [tag, make, picked] of cases) {
      const { container, rerender, unmount } = render(make('one'));
      const host = container.querySelector(tag)!;
      host.setAttribute('value', picked);
      rerender(make('two'));
      expect(host.getAttribute('value'), tag).toBe(picked);
      unmount();
    }
  });

  it('ColorPicker recent={false} turns recent colours off', async () => {
    const { ColorPicker } = await import('../components/ColorPicker');
    const { container } = render(<ColorPicker recent={false} />);
    expect(container.querySelector('ui-color-picker')!.getAttribute('recent')).toBe('false');
  });
});

describe('picker defaultOpen', () => {
  it('opens the picker and leaves it open when another prop changes', async () => {
    const { container, rerender } = render(<DatePicker defaultOpen label="From" />);
    await new Promise((resolve) => setTimeout(resolve, 20));
    const host = container.querySelector('ui-date-picker')!;
    expect(host.hasAttribute('open')).toBe(true);
    rerender(<DatePicker defaultOpen label="Start" />);
    expect(host.hasAttribute('open')).toBe(true);
    rerender(<DatePicker defaultOpen label="Start" open={false} />);
    expect(host.hasAttribute('open')).toBe(false);
  });
});
