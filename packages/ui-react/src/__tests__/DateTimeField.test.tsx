import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/DateField';
import '../../../ui-core/src/components/ui-date-field';
import '../../../ui-core/src/components/ui-time-field';

import { DateField, TimeField } from '../components/DateField';

describe('Date/time field wrappers', () => {
  it('forwards date field change details', async () => {
    let latest: string | null = null;
    const { container } = render(<DateField value="2026-03-09" onValueChange={(value) => { latest = value; }} />);

    const el = container.querySelector('ui-date-field') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('[data-segment="day"]')).toBeTruthy();
    });

    const day = el?.shadowRoot?.querySelector('[data-segment="day"]') as HTMLElement | null;
    fireEvent.keyDown(day!, { key: 'ArrowUp' });

    await waitFor(() => {
      expect(latest).toBe('2026-03-10');
    });
  });

  it('forwards time field change details', async () => {
    let latest: string | null = null;
    const { container } = render(<TimeField value="09:00" onValueChange={(value) => { latest = value; }} />);

    const el = container.querySelector('ui-time-field') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('[data-segment="minute"]')).toBeTruthy();
    });

    const minute = el?.shadowRoot?.querySelector('[data-segment="minute"]') as HTMLElement | null;
    fireEvent.keyDown(minute!, { key: 'ArrowUp' });

    await waitFor(() => {
      expect(latest).toBe('09:01');
    });
  });
});
