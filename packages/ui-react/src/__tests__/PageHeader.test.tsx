import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PageHeader } from '../components/PageHeader';

describe('PageHeader', () => {
  it('renders the title, subtitle, status chip, and action buttons', () => {
    render(
      <PageHeader
        actions={[
          { label: 'Refresh' },
          { label: 'Create patient', variant: 'primary' },
        ]}
        statusChip={{ label: 'Healthy', tone: 'success' }}
        subtitle="Operational dashboard"
        title="Patients"
      />
    );

    expect(screen.getByText('Patients')).toBeTruthy();
    expect(screen.getByText('Operational dashboard')).toBeTruthy();
    expect(screen.getByText('Healthy')).toBeTruthy();
    expect(screen.getByText('Refresh')).toBeTruthy();
    expect(screen.getByText('Create patient')).toBeTruthy();
  });

  it('forwards action clicks and renders custom children below the header row', () => {
    const onRefresh = vi.fn();

    render(
      <PageHeader
        actions={[{ label: 'Refresh', onClick: onRefresh }]}
        title="Billing"
      >
        <div>Revenue summary</div>
      </PageHeader>
    );

    const action = screen.getByText('Refresh').closest('ui-button') as HTMLElement | null;
    fireEvent.click(action as HTMLElement);

    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Revenue summary')).toBeTruthy();
  });
});
