import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/Tree';
import '../../../ui-core/src/components/ui-tree';
import '../../../ui-core/src/components/ui-tree-item';

import { Tree, TreeItem } from '../components/Tree';

describe('Tree wrapper', () => {
  it('forwards value and emits select details', async () => {
    let selected: string | null = null;
    const { container } = render(
      <Tree value="guides" onSelect={(detail) => { selected = detail.value; }}>
        <TreeItem value="api" label="API" />
        <TreeItem value="guides" label="Guides" />
      </Tree>
    );

    const el = container.querySelector('ui-tree') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.getAttribute('value')).toBe('guides');

    const guides = el.querySelector('ui-tree-item[value="guides"]');
    await waitFor(() => {
      expect(guides?.shadowRoot?.querySelector('.row')).toBeTruthy();
    });
    const row = guides?.shadowRoot?.querySelector('.row') as HTMLElement | null;
    expect(row).toBeTruthy();

    fireEvent.click(row!);
    await waitFor(() => expect(selected).toBe('guides'));
  });

  it('supports expanded-change for nested items', async () => {
    let expanded = false;
    const { container } = render(
      <Tree onExpandedChange={(detail) => { expanded = detail.expanded; }}>
        <TreeItem value="src" label="src">
          <TreeItem value="components" label="components" />
        </TreeItem>
      </Tree>
    );

    const root = container.querySelector('ui-tree-item[value="src"]');
    await waitFor(() => {
      expect(root?.shadowRoot?.querySelector('.twist')).toBeTruthy();
    });
    const twist = root?.shadowRoot?.querySelector('.twist') as HTMLElement | null;
    expect(twist).toBeTruthy();

    fireEvent.click(twist!);
    await waitFor(() => expect(expanded).toBe(true));
  });
});
