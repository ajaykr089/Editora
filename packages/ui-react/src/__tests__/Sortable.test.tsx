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


  it('forwards labels and hideToolbar to the element, and clears them again', async () => {
    const { container, rerender } = render(
      <Sortable lists={lists} items={items} labels={{ hintHandle: 'Glissez la poignée.' }} hideToolbar />
    );
    const el = container.querySelector('ui-sortable') as HTMLElement;

    await waitFor(() => expect(el.shadowRoot?.querySelector('#ui-sortable-helper')?.textContent).toMatch(/^Glissez la poignée\./));
    expect(JSON.parse(el.getAttribute('labels') || '{}')).toEqual({ hintHandle: 'Glissez la poignée.' });
    expect(el.hasAttribute('hide-toolbar')).toBe(true);

    rerender(<Sortable lists={lists} items={items} labels={{}} />);
    await waitFor(() => expect(el.hasAttribute('labels')).toBe(false));
    expect(el.hasAttribute('hide-toolbar')).toBe(false);
  });

  it('forwards nestTrigger, and leaves the default unset', async () => {
    const { container, rerender } = render(<Sortable lists={lists} items={items} nestTrigger="modifier" />);
    const el = container.querySelector('ui-sortable') as HTMLElement;
    await waitFor(() => expect(el.getAttribute('nest-trigger')).toBe('modifier'));

    rerender(<Sortable lists={lists} items={items} nestTrigger="gutter" />);
    await waitFor(() => expect(el.hasAttribute('nest-trigger')).toBe(false));
  });

  it('types exactly the label keys the element supports', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const source = readFileSync(join(__dirname, '../components/Sortable.tsx'), 'utf8');
    const union = source.split('export type SortableLabelKey =')[1].split(';')[0];
    const typed = [...union.matchAll(/'(\w+)'/g)].map((match) => match[1]).sort();

    const { container } = render(<Sortable lists={lists} items={items} />);
    const el = container.querySelector('ui-sortable') as HTMLElement & { labels: Record<string, string> };
    expect(Object.keys(el.labels).sort()).toEqual(typed);
  });

  it('forwards touchHoldDelay, including 0, and clears it', async () => {
    const { container, rerender } = render(<Sortable lists={lists} items={items} touchHoldDelay={0} />);
    const el = container.querySelector('ui-sortable') as HTMLElement;
    await waitFor(() => expect(el.getAttribute('touch-hold-delay')).toBe('0'));
    rerender(<Sortable lists={lists} items={items} touchHoldDelay={500} />);
    await waitFor(() => expect(el.getAttribute('touch-hold-delay')).toBe('500'));
    rerender(<Sortable lists={lists} items={items} />);
    await waitFor(() => expect(el.hasAttribute('touch-hold-delay')).toBe(false));
  });

  it('lets canDrop refuse a place and onBeforeChange cancel a move', async () => {
    const changes: string[] = [];
    let refuse = true;
    let cancel = false;
    const { container } = render(
      <Sortable
        lists={lists}
        items={items}
        selection={['alpha']}
        canDrop={(info) => !(refuse && info.targetListId === 'done')}
        onBeforeChange={() => (cancel ? false : undefined)}
        onChange={(detail) => changes.push(detail.operation)}
      />
    );
    const el = container.querySelector('ui-sortable') as HTMLElement & { moveSelection(options: { targetListId: string }): boolean };
    await waitFor(() => expect(el.shadowRoot?.querySelector('.handle[data-id="alpha"]')).toBeTruthy());

    // canDrop says no.
    expect(el.moveSelection({ targetListId: 'done' })).toBe(false);
    expect(changes).toEqual([]);

    // canDrop says yes, onBeforeChange returns false.
    refuse = false;
    cancel = true;
    expect(el.moveSelection({ targetListId: 'done' })).toBe(false);
    expect(changes).toEqual([]);

    // Neither objects (returning nothing allows it).
    cancel = false;
    expect(el.moveSelection({ targetListId: 'done' })).toBe(true);
    expect(changes).toEqual(['transfer']);
  });

  it('passes the event to onBeforeChange so it can cancel with preventDefault, and clears canDrop', async () => {
    const { container, rerender } = render(
      <Sortable
        lists={lists}
        items={items}
        selection={['alpha']}
        canDrop={() => false}
        onBeforeChange={(_detail, event) => {
          event.preventDefault();
        }}
      />
    );
    const el = container.querySelector('ui-sortable') as HTMLElement & { moveSelection(options: { targetListId: string }): boolean; canDrop: unknown };
    await waitFor(() => expect(el.shadowRoot?.querySelector('.handle[data-id="alpha"]')).toBeTruthy());
    expect(typeof el.canDrop).toBe('function');

    rerender(<Sortable lists={lists} items={items} selection={['alpha']} onBeforeChange={(_detail, event) => { event.preventDefault(); }} />);
    expect(el.canDrop).toBeNull();
    expect(el.moveSelection({ targetListId: 'done' })).toBe(false);
  });
});
