import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-menu';
import { Menu, MenuItem, MenuSeparator, MenuSectionLabel } from '../components/Menu';

describe('Menu wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <Menu variant="solid" size="lg" radius={12} tone="success" elevation="high">
        <button slot="trigger">Open</button>
        <div slot="content">
          <button role="menuitem">Export</button>
        </div>
      </Menu>
    );

    const el = container.querySelector('ui-menu') as HTMLElement | null;
    expect(el?.getAttribute('variant')).toBe('solid');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('12');
    expect(el?.getAttribute('tone')).toBe('success');
    expect(el?.getAttribute('elevation')).toBe('high');
  });

  it('keeps surface and md as the implicit defaults', () => {
    const { container } = render(
      <Menu variant="surface" size="md">
        <button slot="trigger">Open</button>
        <div slot="content">
          <button role="menuitem">Export</button>
        </div>
      </Menu>
    );

    const el = container.querySelector('ui-menu') as HTMLElement | null;
    expect(el?.hasAttribute('variant')).toBe(false);
    expect(el?.hasAttribute('size')).toBe(false);
  });

  it('bridges the select detail to onSelect and onSelectDetail', () => {
    const onSelect = vi.fn();
    const onSelectDetail = vi.fn();
    const { container } = render(
      <Menu onSelect={onSelect} onSelectDetail={onSelectDetail}>
        <button slot="trigger">Open</button>
        <div slot="content">
          <button role="menuitem">Export</button>
        </div>
      </Menu>
    );

    const el = container.querySelector('ui-menu') as HTMLElement | null;
    fireEvent(
      el as HTMLElement,
      new CustomEvent('select', {
        detail: { index: 1, label: 'Duplicate', value: 'duplicate' },
        bubbles: true,
      })
    );

    expect(onSelectDetail).toHaveBeenCalledWith({ index: 1, label: 'Duplicate', value: 'duplicate' });
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('renders the helper menu item structure', () => {
    const { container } = render(
      <div>
        <MenuSectionLabel>Organize</MenuSectionLabel>
        <MenuItem icon="✏" shortcut="R" caption="Fast rename">
          Rename
        </MenuItem>
        <MenuSeparator />
      </div>
    );

    expect(container.querySelector('.section-label')?.textContent).toContain('Organize');
    expect(container.querySelector('.item .text')?.textContent).toBe('Rename');
    expect(container.querySelector('.item .caption')?.textContent).toBe('Fast rename');
    expect(container.querySelector('.item .shortcut')?.textContent).toBe('R');
    expect(container.querySelector('.separator')).not.toBeNull();
  });
});
