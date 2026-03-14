import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
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
});
