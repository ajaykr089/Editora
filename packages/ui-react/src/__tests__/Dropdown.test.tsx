import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-dropdown';
import { Dropdown } from '../components/Dropdown';

describe('Dropdown wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <Dropdown variant="glass" size="lg" radius={18} tone="warning" elevation="high" shape="pill">
        <button slot="trigger">Open</button>
        <div slot="content">
          <button role="menuitem">Export</button>
        </div>
      </Dropdown>
    );

    const el = container.querySelector('ui-dropdown') as HTMLElement | null;
    expect(el?.getAttribute('variant')).toBe('glass');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('18');
    expect(el?.getAttribute('tone')).toBe('warning');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('shape')).toBe('pill');
  });

  it('keeps surface and md as the implicit defaults', () => {
    const { container } = render(
      <Dropdown variant="surface" size="md" shape="rounded">
        <button slot="trigger">Open</button>
        <div slot="content">
          <button role="menuitem">Export</button>
        </div>
      </Dropdown>
    );

    const el = container.querySelector('ui-dropdown') as HTMLElement | null;
    expect(el?.hasAttribute('variant')).toBe(false);
    expect(el?.hasAttribute('size')).toBe(false);
    expect(el?.hasAttribute('shape')).toBe(false);
  });

  it('bridges change, request-close, and select detail events', () => {
    const onChange = vi.fn();
    const onChangeDetail = vi.fn();
    const onRequestClose = vi.fn();
    const onSelect = vi.fn();
    const { container } = render(
      <Dropdown onChange={onChange} onChangeDetail={onChangeDetail} onRequestClose={onRequestClose} onSelect={onSelect}>
        <button slot="trigger">Open</button>
        <div slot="content">
          <button role="menuitem">Export</button>
        </div>
      </Dropdown>
    );

    const el = container.querySelector('ui-dropdown') as HTMLElement | null;
    fireEvent(
      el as HTMLElement,
      new CustomEvent('change', {
        detail: { open: true, reason: 'trigger' },
        bubbles: true
      })
    );
    fireEvent(
      el as HTMLElement,
      new CustomEvent('request-close', {
        detail: { reason: 'escape' },
        bubbles: true
      })
    );
    fireEvent(
      el as HTMLElement,
      new CustomEvent('select', {
        detail: { value: 'duplicate', label: 'Duplicate' },
        bubbles: true
      })
    );

    expect(onChange).toHaveBeenCalledWith(true);
    expect(onChangeDetail).toHaveBeenCalledWith({ open: true, reason: 'trigger' });
    expect(onRequestClose).toHaveBeenCalledWith({ reason: 'escape' });
    expect(onSelect).toHaveBeenCalledWith({ value: 'duplicate', label: 'Duplicate' });
  });

  it('exposes one set of menu items: the copy in the open menu, not the hidden originals', async () => {
    const { container } = render(
      <Dropdown>
        <button slot="trigger">Open</button>
        <div slot="content">
          <button role="menuitem">Export</button>
          <button role="menuitem">Archive</button>
        </div>
      </Dropdown>
    );
    const el = container.querySelector('ui-dropdown') as HTMLElement & { open?: boolean };
    const source = el.querySelector('[slot="content"]') as HTMLElement;
    expect(source.getAttribute('aria-hidden')).toBe('true');

    el.setAttribute('open', '');
    await new Promise((resolve) => setTimeout(resolve, 20));
    const copies = Array.from(el.shadowRoot?.querySelectorAll('[role="menuitem"]') || []);
    expect(copies.map((item) => item.textContent)).toEqual(['Export', 'Archive']);
    expect(copies.some((item) => item.closest('[aria-hidden="true"]'))).toBe(false);
  });
});
