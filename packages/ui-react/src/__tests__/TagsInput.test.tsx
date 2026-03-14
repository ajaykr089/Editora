import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/TagsInput';
import '../../../ui-core/src/components/ui-tags-input';

import { TagsInput } from '../components/TagsInput';

describe('TagsInput wrapper', () => {
  it('syncs array values and forwards change events', async () => {
    let latest: string[] = [];
    const { container } = render(
      <TagsInput value={['alpha']} onChange={(value) => { latest = value; }} />
    );

    const el = container.querySelector('ui-tags-input') as HTMLElement | null;
    expect(el?.getAttribute('value')).toBe('["alpha"]');

    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.input')).toBeTruthy();
    });
    const input = el?.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    input!.value = 'beta';
    fireEvent.input(input!);
    fireEvent.keyDown(input!, { key: 'Enter' });

    await waitFor(() => {
      expect(latest).toEqual(['alpha', 'beta']);
    });
  });
});
