import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { Select } from '../components/Select';

describe('Select wrapper', () => {
  it('forwards the standardized visual props to ui-select', () => {
    const { container } = render(
      <Select
        value="review"
        variant="soft"
        tone="success"
        size="3"
        density="comfortable"
        elevation="high"
        radius="12"
        optionBorder
        showCheck
        checkPlacement="start"
      >
        <option value="draft">Draft</option>
        <option value="review">Review</option>
      </Select>
    );

    const el = container.querySelector('ui-select') as HTMLElement | null;
    expect(el?.getAttribute('value')).toBe('review');
    expect(el?.getAttribute('variant')).toBe('soft');
    expect(el?.getAttribute('tone')).toBe('success');
    expect(el?.getAttribute('size')).toBe('3');
    expect(el?.getAttribute('density')).toBe('comfortable');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('radius')).toBe('12');
    expect(el?.hasAttribute('option-border')).toBe(true);
    expect(el?.hasAttribute('show-check')).toBe(true);
    expect(el?.getAttribute('check-placement')).toBe('start');
  });

  it('keeps baseline props unset when the wrapper is using defaults', () => {
    const { container } = render(
      <Select value="draft">
        <option value="draft">Draft</option>
      </Select>
    );

    const el = container.querySelector('ui-select') as HTMLElement | null;
    expect(el?.hasAttribute('variant')).toBe(false);
    expect(el?.hasAttribute('tone')).toBe(false);
    expect(el?.hasAttribute('size')).toBe(false);
    expect(el?.hasAttribute('density')).toBe(false);
    expect(el?.hasAttribute('elevation')).toBe(false);
  });

  it('shows the placeholder for value="" instead of the first option', async () => {
    function Harness({ value }: { value: string }) {
      return (
        <Select value={value} placeholder="Pick one">
          <option value="a">Alpha</option>
          <option value="b">Beta</option>
        </Select>
      );
    }
    const { container, rerender } = render(<Harness value="" />);
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
    const el = container.querySelector('ui-select') as HTMLElement & { value: string };
    const shown = () => el.shadowRoot?.querySelector('.value')?.textContent?.trim();
    expect(el.value).toBe('');
    expect(shown()).toBe('Pick one');

    rerender(<Harness value="b" />);
    expect(shown()).toBe('Beta');
    rerender(<Harness value="" />);
    expect(el.value).toBe('');
    expect(shown()).toBe('Pick one');
  });

  it('keeps the same trigger after mount so a test can find it and open the list', async () => {
    const { container } = render(
      <Select label="Kind" placeholder="Pick one" description="Choose a kind">
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Select>
    );
    const el = container.querySelector('ui-select') as HTMLElement;
    const found = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLElement;
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });

    expect(found.isConnected).toBe(true);
    expect(el.shadowRoot?.querySelector('[role="combobox"]')).toBe(found);
    expect(found.getAttribute('aria-labelledby')).toBeTruthy();
    expect(found.getAttribute('aria-describedby')).toContain('description');

    fireEvent.click(found);
    expect(found.getAttribute('aria-expanded')).toBe('true');
  });
});
