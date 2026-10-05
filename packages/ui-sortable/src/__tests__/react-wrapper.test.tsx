import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('@editora/ui-sortable/react', () => {
  it('exports the public wrapper and renders a registered ui-sortable element', async () => {
    const mod = await import('@editora/ui-sortable/react');
    const Sortable = mod.Sortable;

    expect(Sortable).toBeDefined();
    expect(mod.default).toBe(Sortable);

    const { container } = render(
      <Sortable
        lists={[
          { id: 'backlog', label: 'Backlog' },
          { id: 'done', label: 'Done', orientation: 'horizontal' }
        ]}
        items={[
          { id: 'story-1', label: 'Audit onboarding', listId: 'backlog' },
          { id: 'story-2', label: 'Ship release notes', listId: 'done' }
        ]}
        selection={['story-1']}
        dropzoneStyle="container"
        dropIndicatorVisibility="always"
        allowNesting={false}
        showSelectionBadge={false}
      />
    );

    const element = container.querySelector('ui-sortable') as HTMLElement | null;

    await waitFor(() => expect(element?.shadowRoot?.querySelector('.list')).toBeTruthy());

    expect(customElements.get('ui-sortable')).toBeDefined();
    expect(element?.getAttribute('dropzone-style')).toBe('container');
    expect(element?.getAttribute('drop-indicator-visibility')).toBe('always');
    expect(element?.getAttribute('allow-nesting')).toBe('false');
    expect(element?.getAttribute('show-selection-badge')).toBe('false');
    expect(element?.getAttribute('selection')).toBe(JSON.stringify(['story-1']));
  });

  it('maps className to the class attribute on the host (React 16-18 would write `classname`)', async () => {
    const { Sortable } = await import('@editora/ui-sortable/react');
    const { container } = render(<Sortable lists={[]} items={[]} className="board board--wide" />);

    const element = container.querySelector('ui-sortable') as HTMLElement;
    expect(element.classList.contains('board')).toBe(true);
    expect(element.classList.contains('board--wide')).toBe(true);
    expect(element.hasAttribute('classname')).toBe(false);
  });

  it('renders an empty board instead of crashing while lists/items are still undefined', async () => {
    const { Sortable } = await import('@editora/ui-sortable/react');
    const props = {} as unknown as React.ComponentProps<typeof Sortable>;

    const { container, rerender } = render(<Sortable {...props} />);
    expect(container.querySelector('ui-sortable')).toBeTruthy();

    rerender(<Sortable {...({ lists: [{ id: 'a', label: 'A' }] } as unknown as React.ComponentProps<typeof Sortable>)} />);
    expect(container.querySelector('ui-sortable')).toBeTruthy();

    rerender(<Sortable lists={[{ id: 'a', label: 'A' }]} items={[{ id: 'x', label: 'X', listId: 'a' }]} />);
    expect(container.querySelector('ui-sortable')?.getAttribute('items')).toContain('"x"');
  });
});
