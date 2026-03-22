import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/TransferList';
import '../../../ui-core/src/components/ui-transfer-list';

import { TransferList } from '../components/TransferList';

describe('TransferList wrapper', () => {
  it('forwards value changes', async () => {
    let latest: string[] = [];
    const { container } = render(
      <TransferList
        options={[
          { value: 'read', label: 'Read' },
          { value: 'write', label: 'Write' }
        ]}
        onValueChange={(value) => {
          latest = value;
        }}
      />
    );
    const el = container.querySelector('ui-transfer-list') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('[data-side="available"]')).toBeTruthy());
    (el!.shadowRoot!.querySelector('[data-side="available"][data-value="read"]') as HTMLElement).click();
    (el!.shadowRoot!.querySelector('[data-action="add"]') as HTMLButtonElement).click();
    await waitFor(() => expect(latest).toEqual(['read']));
  });

  it('syncs design system attributes and panel labels', async () => {
    const { container } = render(
      <TransferList
        options={[{ value: 'read', label: 'Read' }]}
        variant="contrast"
        tone="warning"
        size="lg"
        radius={24}
        elevation="high"
        selectionIndicator="none"
        addActionLabel="Grant"
        removeActionLabel="Revoke"
        showActionLabels={false}
        showActionCounts={false}
        showPanelCounts={false}
        availableLabel="Available roles"
        selectedLabel="Assigned roles"
      />
    );

    const el = container.querySelector('ui-transfer-list') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('.panel-title')).toBeTruthy());

    expect(el?.getAttribute('variant')).toBe('contrast');
    expect(el?.getAttribute('tone')).toBe('warning');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('24');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('selection-indicator')).toBe('none');
    expect(el?.getAttribute('add-action-label')).toBe('Grant');
    expect(el?.getAttribute('remove-action-label')).toBe('Revoke');
    expect(el?.getAttribute('show-action-labels')).toBe('false');
    expect(el?.getAttribute('show-action-counts')).toBe('false');
    expect(el?.getAttribute('show-panel-counts')).toBe('false');
    expect(el?.getAttribute('available-label')).toBe('Available roles');
    expect(el?.getAttribute('selected-label')).toBe('Assigned roles');
  });
});
