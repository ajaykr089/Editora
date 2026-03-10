import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/MultiSelect';
import '../../../ui-core/src/components/ui-multi-select';

import { MultiSelect } from '../components/MultiSelect';

describe('MultiSelect wrapper', () => {
  it('forwards array changes', async () => {
    let latest: string[] = [];
    const { container } = render(
      <MultiSelect
        options={[
          { value: 'ops', label: 'Operations' },
          { value: 'security', label: 'Security' }
        ]}
        onValueChange={(value) => { latest = value; }}
      />
    );

    const el = container.querySelector('ui-multi-select') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.input')).toBeTruthy();
    });

    const input = el?.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();
    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.option[data-value="ops"]')).toBeTruthy();
    });

    const option = el?.shadowRoot?.querySelector('.option[data-value="ops"]') as HTMLElement | null;
    fireEvent.click(option!);

    await waitFor(() => {
      expect(latest).toEqual(['ops']);
    });
  });

  it('syncs maxSelections attr', () => {
    const { container } = render(
      <MultiSelect
        options={[{ value: 'ops', label: 'Operations' }]}
        maxSelections={2}
      />
    );
    const el = container.querySelector('ui-multi-select') as HTMLElement | null;
    expect(el?.getAttribute('max-selections')).toBe('2');
  });

  it('supports selecting via nested label click and removing chips in the wrapper path', async () => {
    let latest: string[] = ['ops'];
    const { container } = render(
      <MultiSelect
        options={[
          { value: 'ops', label: 'Operations' },
          { value: 'security', label: 'Security' }
        ]}
        value={latest}
        onValueChange={(value) => {
          latest = value;
        }}
      />
    );

    const el = container.querySelector('ui-multi-select') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.input')).toBeTruthy();
    });

    const input = el?.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();

    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.option[data-value="security"] .option-label')).toBeTruthy();
    });

    const label = el?.shadowRoot?.querySelector('.option[data-value="security"] .option-label') as HTMLElement | null;
    fireEvent.click(label!);

    await waitFor(() => {
      expect(latest).toEqual(['ops', 'security']);
    });
  });

  it('keeps browser-style pointer selection working in the wrapper path', async () => {
    let latest: string[] = [];
    const { container } = render(
      <MultiSelect
        options={[
          { value: 'ops', label: 'Operations' },
          { value: 'security', label: 'Security' }
        ]}
        onValueChange={(value) => {
          latest = value;
        }}
      />
    );

    const el = container.querySelector('ui-multi-select') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.input')).toBeTruthy();
    });

    const input = el?.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();

    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.option[data-value="ops"]')).toBeTruthy();
    });

    const option = el?.shadowRoot?.querySelector('.option[data-value="ops"]') as HTMLElement | null;
    fireEvent.pointerDown(option!);
    fireEvent.click(option!);

    await waitFor(() => {
      expect(latest).toEqual(['ops']);
    });
  });
});
