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
});
