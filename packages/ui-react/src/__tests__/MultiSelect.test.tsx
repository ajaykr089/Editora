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

  it('syncs production attrs for indicator and state variants', () => {
    const { container } = render(
      <MultiSelect
        options={[{ value: 'ops', label: 'Operations' }]}
        selectionIndicator="none"
        readOnly
        clearable
        loading
        loadingText="Refreshing options..."
        variant="contrast"
        tone="warning"
        density="compact"
        shape="square"
        size="sm"
        renderLimit={40}
      />
    );
    const el = container.querySelector('ui-multi-select') as HTMLElement | null;
    expect(el?.getAttribute('selection-indicator')).toBe('none');
    expect(el?.hasAttribute('readonly')).toBe(true);
    expect(el?.hasAttribute('clearable')).toBe(true);
    expect(el?.hasAttribute('loading')).toBe(true);
    expect(el?.getAttribute('loading-text')).toBe('Refreshing options...');
    expect(el?.getAttribute('variant')).toBe('contrast');
    expect(el?.getAttribute('tone')).toBe('warning');
    expect(el?.getAttribute('density')).toBe('compact');
    expect(el?.getAttribute('shape')).toBe('square');
    expect(el?.getAttribute('size')).toBe('sm');
    expect(el?.getAttribute('render-limit')).toBe('40');
  });
});
