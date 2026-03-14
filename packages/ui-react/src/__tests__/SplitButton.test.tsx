import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/SplitButton';
import '../../../ui-core/src/components/ui-split-button';

import { SplitButton } from '../components/SplitButton';

describe('SplitButton wrapper', () => {
  it('forwards primary and select events', async () => {
    let primary = 0;
    let selected = '';
    const { container } = render(
      <SplitButton
        label="Run"
        items={[
          { value: 'rerun', label: 'Rerun step' },
          { value: 'skip', label: 'Skip step' }
        ]}
        onPrimaryAction={() => {
          primary += 1;
        }}
        onSelect={(detail) => {
          selected = detail.value || '';
        }}
      />
    );

    const el = container.querySelector('ui-split-button') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('.toggle')).toBeTruthy());
    (el!.shadowRoot!.querySelector('.button') as HTMLButtonElement).click();
    (el!.shadowRoot!.querySelector('.toggle') as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector('.ui-split-button-portal [data-menu-item]')).toBeTruthy());
    (document.querySelector('.ui-split-button-portal [data-menu-item][data-value="skip"]') as HTMLElement).click();
    expect(primary).toBe(1);
    expect(selected).toBe('skip');
  });

  it('forwards variant and density attributes', async () => {
    const { container } = render(
      <SplitButton label="Run" variant="flat" density="compact" menuDensity="airy" menuShape="flat" />
    );

    const el = container.querySelector('ui-split-button') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.getAttribute('variant')).toBe('flat');
      expect(el?.getAttribute('density')).toBe('compact');
      expect(el?.getAttribute('menu-density')).toBe('airy');
      expect(el?.getAttribute('menu-shape')).toBe('flat');
    });
  });
});
