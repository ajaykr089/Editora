import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PageToolbar } from '../components/PageToolbar';

describe('PageToolbar', () => {
  it('renders page content together with toolbar and footer rows', () => {
    render(
      <PageToolbar
        footer={<div>Last synced 5 minutes ago</div>}
        subtitle="Operational reporting"
        title="Reports"
        toolbar={<div>Date and department filters</div>}
      />
    );

    expect(screen.getByText('Reports')).toBeTruthy();
    expect(screen.getByText('Operational reporting')).toBeTruthy();
    expect(screen.getByText('Date and department filters')).toBeTruthy();
    expect(screen.getByText('Last synced 5 minutes ago')).toBeTruthy();
  });

  it('keeps page header actions interactive', () => {
    const onExport = vi.fn();

    render(
      <PageToolbar
        actions={[{ label: 'Export', onClick: onExport }]}
        title="Billing"
      />
    );

    fireEvent.click(screen.getByText('Export').closest('ui-button') as HTMLElement);

    expect(onExport).toHaveBeenCalledTimes(1);
  });
});
