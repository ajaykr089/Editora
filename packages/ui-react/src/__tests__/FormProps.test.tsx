import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../components/Checkbox';
import { DatePicker } from '../components/DatePicker';
import { TimePicker } from '../components/TimePicker';

describe('Checkbox form props', () => {
  it('defaultChecked starts checked and then leaves the state to the user', () => {
    const { container, rerender } = render(<Checkbox name="remember" defaultChecked>Keep me signed in</Checkbox>);
    const el = container.querySelector('ui-checkbox')!;
    expect(el.hasAttribute('checked')).toBe(true);
    expect(el.getAttribute('name')).toBe('remember');
    expect(el.hasAttribute('defaultchecked')).toBe(false);
    el.removeAttribute('checked'); // the user unticks it
    rerender(<Checkbox name="remember" defaultChecked>Keep me signed in</Checkbox>);
    expect(el.hasAttribute('checked')).toBe(false);
  });

  it('passes required and value through', () => {
    const { container } = render(<Checkbox name="terms" value="yes" required>I agree</Checkbox>);
    const el = container.querySelector('ui-checkbox')!;
    expect(el.hasAttribute('required')).toBe(true);
    expect(el.getAttribute('value')).toBe('yes');
  });
});

describe('picker description', () => {
  it('is the same as hint, so fields read alike', () => {
    const { container } = render(<><DatePicker label="Date" description="Leave empty for today." /><TimePicker label="Time" hint="Optional" /></>);
    expect(container.querySelector('ui-date-picker')!.getAttribute('hint')).toBe('Leave empty for today.');
    expect(container.querySelector('ui-time-picker')!.getAttribute('hint')).toBe('Optional');
  });
});
