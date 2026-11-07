import React from 'react';
import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DataTable } from '../components/DataTable';
import { NavigationProvider } from '../components/NavigationProvider';

const settle = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 30)); });

afterEach(() => { document.body.innerHTML = ''; });

const Rows = ({ rows }: { rows: string[] }) => (
  <table>
    <thead><tr><th data-key="name">Name</th><th data-key="email">Email</th></tr></thead>
    <tbody>{rows.map((name) => <tr key={name} data-href={`/people/${name}`}><td>{name}</td><td>{name}@x.io</td></tr>)}</tbody>
  </table>
);

describe('DataTable admin props', () => {
  it('server-side paging, hidden columns and row links through NavigationProvider', async () => {
    const navigate = vi.fn();
    const onPageChange = vi.fn();
    const { container } = render(
      <NavigationProvider navigate={navigate}>
        <DataTable serverSide totalRows={40} pageSize={2} page={3} hiddenColumns={['email']} onPageChange={onPageChange}>
          <Rows rows={['ava', 'kim']} />
        </DataTable>
      </NavigationProvider>
    );
    await settle();
    const host = container.querySelector('ui-data-table')!;
    expect(host.getAttribute('server-side')).toBe('');
    expect(host.getAttribute('total-rows')).toBe('40');
    expect(host.shadowRoot!.querySelector('.summary')!.textContent).toBe('Showing 5-6 of 40');
    expect((host.querySelector('td:nth-child(2)') as HTMLElement).hidden).toBe(true);

    act(() => { (host.querySelector('tbody tr td') as HTMLElement).click(); });
    expect(navigate).toHaveBeenCalledWith('/people/ava', expect.objectContaining({ rowId: undefined, row: expect.objectContaining({ name: 'ava' }) }));
  });
});
