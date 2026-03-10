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
});
