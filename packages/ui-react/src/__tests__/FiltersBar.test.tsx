import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FiltersBar } from '../components/FiltersBar';

describe('FiltersBar', () => {
  it('renders search and status filters with the expected options', () => {
    render(
      <FiltersBar
        onSearchChange={() => {}}
        onStatusChange={() => {}}
        search="Ava"
        status="active"
        statusOptions={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
        ]}
      />
    );

    const input = document.querySelector('ui-input') as HTMLElement | null;
    const select = document.querySelector('ui-select') as HTMLElement | null;

    expect(input?.getAttribute('value')).toBe('Ava');
    expect(select?.getAttribute('value')).toBe('active');
    expect(screen.getByText('All')).toBeTruthy();
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('bridges search, status, and clear interactions', () => {
    const onSearchChange = vi.fn();
    const onStatusChange = vi.fn();
    const onClear = vi.fn();

    render(
      <FiltersBar
        clearLabel="Reset"
        onClear={onClear}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        statusOptions={[
          { value: 'all', label: 'All' },
          { value: 'archived', label: 'Archived' },
        ]}
      />
    );

    const input = document.querySelector('ui-input') as HTMLElement | null;
    const select = document.querySelector('ui-select') as HTMLElement | null;
    const clear = screen.getByText('Reset').closest('ui-button') as HTMLElement | null;

    input?.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: 'Grace' } }));
    select?.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: 'archived' } }));
    fireEvent.click(clear as HTMLElement);

    expect(onSearchChange).toHaveBeenCalledWith('Grace');
    expect(onStatusChange).toHaveBeenCalledWith('archived');
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
