import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageHeader } from '../components/PageHeader';
import { FiltersBar } from '../components/FiltersBar';

describe('page structure', () => {
  it('PageHeader titles the page with a heading, level 1 unless told otherwise', () => {
    const { getByRole, rerender } = render(<PageHeader title="Expenses" />);
    expect(getByRole('heading', { level: 1, name: 'Expenses' })).toBeTruthy();
    rerender(<PageHeader title="Expenses" headingLevel={2} />);
    expect(getByRole('heading', { level: 2, name: 'Expenses' })).toBeTruthy();
  });

  it('FiltersBar names its status select even without a visible label', () => {
    const { container } = render(<FiltersBar statusOptions={[{ value: 'a', label: 'A' }]} onStatusChange={() => {}} />);
    expect(container.querySelector('ui-select')!.getAttribute('aria-label')).toBe('Status');
  });
});
