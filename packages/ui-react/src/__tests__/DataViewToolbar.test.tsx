import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DataViewToolbar } from '../components/DataViewToolbar';

describe('DataViewToolbar', () => {
  it('renders summary metadata, actions, and filters in one surface', () => {
    render(
      <DataViewToolbar
        actions={<button type="button">Export</button>}
        description="Patient intake and follow-up queue"
        itemLabel="patient"
        onStatusChange={() => {}}
        selectedCount={2}
        status="active"
        statusOptions={[
          { value: 'all', label: 'All patients' },
          { value: 'active', label: 'Active' },
        ]}
        title="Patients"
        totalCount={8}
      />
    );

    expect(screen.getByText('Patients')).toBeTruthy();
    expect(screen.getByText('Patient intake and follow-up queue')).toBeTruthy();
    expect(screen.getByText('2 selected • 8 patients')).toBeTruthy();
    expect(screen.getByText('Export')).toBeTruthy();
    expect(document.querySelector('ui-select')?.getAttribute('value')).toBe('active');
  });

  it('bridges nested filter interactions and clear actions', () => {
    const onSearchChange = vi.fn();
    const onStatusChange = vi.fn();
    const onClear = vi.fn();

    render(
      <DataViewToolbar
        clearLabel="Reset"
        onClear={onClear}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        statusOptions={[
          { value: 'all', label: 'All' },
          { value: 'trial', label: 'Trial' },
        ]}
      />
    );

    const input = document.querySelector('ui-input') as HTMLElement | null;
    const select = document.querySelector('ui-select') as HTMLElement | null;
    const clear = screen.getByText('Reset').closest('ui-button') as HTMLElement | null;

    input?.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: 'Ava' } }));
    select?.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: 'trial' } }));
    fireEvent.click(clear as HTMLElement);

    expect(onSearchChange).toHaveBeenCalledWith('Ava');
    expect(onStatusChange).toHaveBeenCalledWith('trial');
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
