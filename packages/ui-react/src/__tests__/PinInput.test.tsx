import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/PinInput';
import '../../../ui-core/src/components/ui-pin-input';

import { PinInput } from '../components/PinInput';

describe('PinInput wrapper', () => {
  it('forwards change and complete events', async () => {
    let latest = '';
    let completed = '';
    const { container } = render(
      <PinInput
        length={4}
        onChange={(value) => {
          latest = value;
        }}
        onComplete={(value) => {
          completed = value;
        }}
      />
    );

    const el = container.querySelector('ui-pin-input') as HTMLElement | null;
    expect(el).toBeTruthy();

    await waitFor(() => {
      expect(el?.shadowRoot?.querySelectorAll('.slot').length).toBe(4);
    });

    const inputs = Array.from(el!.shadowRoot!.querySelectorAll('.slot')) as HTMLInputElement[];
    inputs[0].value = '1';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = '2';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[2].value = '3';
    inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[3].value = '4';
    inputs[3].dispatchEvent(new Event('input', { bubbles: true }));

    await waitFor(() => {
      expect(latest).toBe('1234');
      expect(completed).toBe('1234');
    });
  });
});
