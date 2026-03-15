import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/Command';
import '../../../ui-core/src/components/ui-command';

import { Command } from '../components/Command';

describe('Command wrapper', () => {
  it('forwards query and select events', async () => {
    let latestQuery = '';
    let latestValue: string | undefined;

    const { container } = render(
      <Command
        onQueryChange={(value) => {
          latestQuery = value;
        }}
        onSelect={(detail) => {
          latestValue = detail.value;
        }}
      >
        <Command.Item value="open" label="Open file">
          Open file
        </Command.Item>
        <Command.Item value="rename" label="Rename symbol">
          Rename symbol
        </Command.Item>
      </Command>
    );

    const el = container.querySelector('ui-command') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.search')).toBeTruthy();
    });

    const input = el?.shadowRoot?.querySelector('.search') as HTMLInputElement | null;
    fireEvent.input(input!, { target: { value: 'ren' } });

    await waitFor(() => {
      expect(latestQuery).toBe('ren');
    });

    fireEvent.keyDown(input!, { key: 'ArrowDown' });
    fireEvent.keyDown(input!, { key: 'Enter' });

    await waitFor(() => {
      expect(latestValue).toBe('rename');
    });
  });
});
