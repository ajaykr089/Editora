import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecordHeader } from '../components/RecordHeader';

describe('RecordHeader', () => {
  it('renders page header content with detail metadata', () => {
    render(
      <RecordHeader
        details={[
          { label: 'MRN', value: 'PT-1042' },
          { label: 'Updated', value: 'Apr 9, 2026' },
        ]}
        statusChip={{ label: 'active', tone: 'success' }}
        subtitle="Clinical profile"
        title="Ava Stone"
      />
    );

    expect(screen.getByText('Ava Stone')).toBeTruthy();
    expect(screen.getByText('Clinical profile')).toBeTruthy();
    expect(screen.getByText('active')).toBeTruthy();
    expect(screen.getByText('MRN')).toBeTruthy();
    expect(screen.getByText('PT-1042')).toBeTruthy();
  });

  it('forwards action clicks and renders footer content', () => {
    const onRefresh = vi.fn();

    render(
      <RecordHeader
        actions={[{ label: 'Refresh', onClick: onRefresh }]}
        footer={<div>Audit trail ready</div>}
        title="Record"
      />
    );

    fireEvent.click(screen.getByText('Refresh').closest('ui-button') as HTMLElement);

    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Audit trail ready')).toBeTruthy();
  });
});
