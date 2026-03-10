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
        <button slot="command" data-value="open">Open file</button>
        <button slot="command" data-value="rename">Rename symbol</button>
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
