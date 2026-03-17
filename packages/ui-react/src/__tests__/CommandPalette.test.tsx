import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/CommandPalette';
import '../../../ui-core/src/components/ui-command-palette';
import '../../../ui-core/src/components/ui-command';

import { CommandPalette, type CommandPaletteElement } from '../components/CommandPalette';

describe('CommandPalette wrapper', () => {
  it('syncs query/placeholder props and forwards select/query events', async () => {
    let latestQuery = '';
    let latestValue = '';

    const { container } = render(
      <CommandPalette
        open
        query="ren"
        placeholder="Search workflows"
        emptyText="Nothing found"
        onQueryChange={(detail) => {
          latestQuery = detail.value;
        }}
        onSelect={(detail) => {
          latestValue = detail.value || '';
        }}
      >
        <CommandPalette.Item value="open" label="Open project">
          Open project
        </CommandPalette.Item>
        <CommandPalette.Item value="rename" label="Rename item">
          Rename item
        </CommandPalette.Item>
      </CommandPalette>
    );

    const el = container.querySelector('ui-command-palette') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('ui-command')).toBeTruthy());

    const command = el?.shadowRoot?.querySelector('ui-command') as HTMLElement | null;
    const input = command?.shadowRoot?.querySelector('.search') as HTMLInputElement | null;

    await waitFor(() => {
      expect(input?.value).toBe('ren');
      expect(input?.getAttribute('placeholder')).toBe('Search workflows');
    });

    fireEvent.input(input!, { target: { value: 'rename' } });
    await waitFor(() => expect(latestQuery).toBe('rename'));

    fireEvent.keyDown(input!, { key: 'ArrowDown' });
    fireEvent.keyDown(input!, { key: 'Enter' });
    await waitFor(() => expect(latestValue).toBe('rename'));
  });

  it('exposes imperative palette methods through the React ref', async () => {
    const ref = React.createRef<CommandPaletteElement>();

    render(
      <CommandPalette ref={ref}>
        <CommandPalette.Item value="open" label="Open project">
          Open project
        </CommandPalette.Item>
      </CommandPalette>
    );

    ref.current?.openPalette();
    await waitFor(() => expect((ref.current as unknown as HTMLElement)?.hasAttribute('open')).toBe(true));

    ref.current?.clearQuery();
    expect(ref.current?.query).toBe('');
  });
});
