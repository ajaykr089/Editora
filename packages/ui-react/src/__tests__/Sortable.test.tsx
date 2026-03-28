import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/Sortable';
import '../../../ui-core/src/components/ui-sortable';

import { Sortable } from '../components/Sortable';

const lists = [
  { id: 'todo', label: 'To do' },
  { id: 'done', label: 'Done' },
];

const items = [
  { id: 'alpha', label: 'Alpha', listId: 'todo' },
  { id: 'beta', label: 'Beta', listId: 'todo' },
];

describe('Sortable wrapper', () => {
  it('forwards item changes and persistence events', async () => {
    let latestItems: typeof items = [];
    let latestOperation = '';

    const { container } = render(
      <Sortable
        lists={lists}
        items={items}
        selection={['alpha']}
        onItemsChange={(next) => {
          latestItems = next;
        }}
        onPersistRequest={(detail) => {
          latestOperation = detail.operation;
        }}
      />
    );

    const el = container.querySelector('ui-sortable') as HTMLElement & {
      moveSelection(options: { targetListId: string }): void;
    };

    await waitFor(() => expect(el.shadowRoot?.querySelector('.handle[data-id="alpha"]')).toBeTruthy());
    el.moveSelection({ targetListId: 'done' });

    await waitFor(() => expect(latestItems.find((item) => item.id === 'alpha')?.listId).toBe('done'));
    expect(latestOperation).toBe('transfer');
  });

  it('syncs sort, filter, persist key, and nesting attributes', async () => {
    const { container } = render(
      <Sortable
        lists={lists}
        items={items}
        sort="label"
        filterQuery="alp"
        persistKey="sortable-wrapper"
        allowFilteredDrag
        allowNesting={false}
      />
    );

    const el = container.querySelector('ui-sortable') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('.list')).toBeTruthy());

    expect(el?.getAttribute('sort')).toBe('label');
    expect(el?.getAttribute('filter-query')).toBe('alp');
    expect(el?.getAttribute('persist-key')).toBe('sortable-wrapper');
    expect(el?.hasAttribute('allow-filtered-drag')).toBe(true);
    expect(el?.getAttribute('allow-nesting')).toBe('false');
  });

  it('renders custom jsx items through renderItem', async () => {
    const { container } = render(
      <Sortable
        lists={lists}
        items={items}
        renderItem={(item, context) => (
          <div data-testid={`custom-${item.id}`}>
            <strong>{item.label}</strong>
            <span>{context.selected ? 'selected' : 'idle'}</span>
          </div>
        )}
        selection={['alpha']}
      />
    );

    const el = container.querySelector('ui-sortable') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('[data-item-content-target="alpha"]')).toBeTruthy());
    await waitFor(() => expect(el?.shadowRoot?.textContent).toContain('selected'));
    expect(el?.shadowRoot?.textContent).toContain('Alpha');
  });

  it('renders custom list headers and empty states', async () => {
    const { container } = render(
      <Sortable
        lists={lists}
        items={[{ id: 'alpha', label: 'Alpha', listId: 'todo' }]}
        renderListHeader={(list, context) => (
          <div data-testid={`header-${list.id}`}>
            {list.label} {context.itemCount}
          </div>
        )}
        renderEmptyState={(list) => (
          <div data-testid={`empty-${list.id}`}>
            Nothing in {list.label}
          </div>
        )}
      />
    );

    const el = container.querySelector('ui-sortable') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.textContent).toContain('To do 1'));
    await waitFor(() => expect(el?.shadowRoot?.textContent).toContain('Nothing in Done'));
  });
});
