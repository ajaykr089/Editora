import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/InlineEdit';
import '../../../ui-core/src/components/ui-inline-edit';

import { InlineEdit } from '../components/InlineEdit';

describe('InlineEdit wrapper', () => {
  it('forwards save and change events', async () => {
    let latest = '';
    let saved = '';
    const { container } = render(
      <InlineEdit
        value="Draft"
        onValueChange={(value) => {
          latest = value;
        }}
        onSave={(detail) => {
          saved = detail.value;
        }}
      />
    );
    const el = container.querySelector('ui-inline-edit') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('.edit-btn')).toBeTruthy());
    (el!.shadowRoot!.querySelector('.edit-btn') as HTMLButtonElement).click();
    const input = el!.shadowRoot!.querySelector('.field') as HTMLInputElement;
    input.value = 'Approved';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    (el!.shadowRoot!.querySelector('.save-btn') as HTMLButtonElement).click();
    await waitFor(() => {
      expect(latest).toBe('Approved');
      expect(saved).toBe('Approved');
    });
  });
});
