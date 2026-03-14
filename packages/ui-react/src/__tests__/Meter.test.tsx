import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/Meter';
import '../../../ui-core/src/components/ui-meter';

import { Meter } from '../components/Meter';

describe('Meter wrapper', () => {
  it('syncs attributes and forwards change detail', async () => {
    let lastState = '';
    const { container } = render(
      <Meter
        value={82}
        min={0}
        max={100}
        low={30}
        high={70}
        label="Reliability"
        showLabel
        format="percent"
        onValueChange={(detail) => {
          lastState = detail.state;
        }}
      />
    );

    const el = container.querySelector('ui-meter') as HTMLElement | null;
    expect(el?.getAttribute('value')).toBe('82');
    expect(el?.getAttribute('label')).toBe('Reliability');

    await waitFor(() => {
      expect(lastState).toBe('high');
      expect(el?.getAttribute('data-meter-state')).toBe('high');
    });
  });
});
