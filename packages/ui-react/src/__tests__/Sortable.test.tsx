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
  it('renders an empty board instead of crashing while lists/items are still undefined', () => {
    // Data usually arrives asynchronously, so the first render often has neither.
    const props = {} as unknown as React.ComponentProps<typeof Sortable>;
    const { container, rerender } = render(<Sortable {...props} />);
    expect(container.querySelector('ui-sortable')).toBeTruthy();

    rerender(<Sortable {...({ lists } as unknown as React.ComponentProps<typeof Sortable>)} />);
    expect(container.querySelector('ui-sortable')).toBeTruthy();

    rerender(<Sortable lists={lists} items={items} />);
    expect(container.querySelector('ui-sortable')?.getAttribute('items')).toContain('alpha');
  });

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

  it('takes a custom drag handle out of the tab order but keeps a focus stop an author set', async () => {
    const { container } = render(
      <Sortable
        lists={lists}
        items={items}
        dragHandleSelector="[data-grip]"
        renderItem={(item) => (
          <div>
            <button type="button" data-grip="" data-testid={`grip-${item.id}`}>::</button>
            <button type="button" data-grip="" tabIndex={0} data-testid={`pinned-${item.id}`}>::</button>
          </div>
        )}
      />
    );

    const el = container.querySelector('ui-sortable') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('[data-sortable-custom-handle]')).toBeTruthy());
    const root = el!.shadowRoot!;

    // The item is the keyboard stop; a focusable child inside an option is invalid ARIA.
    const grip = root.querySelector('[data-testid="grip-alpha"]')!;
    expect(grip.getAttribute('tabindex')).toBe('-1');
    expect(grip.getAttribute('data-drag-trigger')).toBe('custom');
    expect(root.querySelector('[data-testid="pinned-alpha"]')!.getAttribute('tabindex')).toBe('0');
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
