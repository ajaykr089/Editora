import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/PluginPanel';
import '../../../ui-core/src/components/ui-plugin-panel';

import { PluginPanel } from '../components/PluginPanel';

describe('PluginPanel wrapper', () => {
  it('syncs richer panel props to the host element', async () => {
    const { container } = render(
      <PluginPanel
        open
        position="left"
        size="lg"
        title="Inspector"
        description="Review plugin output"
        dismissible
      >
        <div>Panel body</div>
      </PluginPanel>
    );

    const el = container.querySelector('ui-plugin-panel') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.getAttribute('position')).toBe('left');
      expect(el?.getAttribute('size')).toBe('lg');
      expect(el?.getAttribute('title')).toBe('Inspector');
      expect(el?.getAttribute('description')).toBe('Review plugin output');
      expect(el?.hasAttribute('dismissible')).toBe(true);
    });
  });

  it('forwards open-state changes from dismiss actions', async () => {
    const events: string[] = [];
    const { container } = render(
      <PluginPanel
        open
        dismissible
        onClose={() => events.push('close')}
        onOpenChange={(detail) => events.push(detail.open ? 'open' : 'closed')}
      >
        <div>Panel body</div>
      </PluginPanel>
    );

    const el = container.querySelector('ui-plugin-panel') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('.dismiss')).toBeTruthy());
    (el?.shadowRoot?.querySelector('.dismiss') as HTMLButtonElement | null)?.click();

    await waitFor(() => {
      expect(events).toContain('close');
      expect(events).toContain('closed');
    });
  });
});
