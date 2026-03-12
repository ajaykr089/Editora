import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-breadcrumb';
import { Breadcrumb } from '../components/Breadcrumb';

describe('Breadcrumb wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <Breadcrumb variant="solid" tone="success" size="lg" radius={12} elevation="high">
        <span slot="item">Workspace</span>
        <span slot="item">Audit logs</span>
      </Breadcrumb>
    );

    const el = container.querySelector('ui-breadcrumb') as HTMLElement | null;
    expect(el?.getAttribute('variant')).toBe('solid');
    expect(el?.getAttribute('tone')).toBe('success');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('12');
    expect(el?.getAttribute('elevation')).toBe('high');
  });

  it('keeps surface, md, and none as the implicit defaults', () => {
    const { container } = render(
      <Breadcrumb variant="surface" size="md" radius="md" elevation="none">
        <span slot="item">Workspace</span>
        <span slot="item">Audit logs</span>
      </Breadcrumb>
    );

    const el = container.querySelector('ui-breadcrumb') as HTMLElement | null;
    expect(el?.hasAttribute('variant')).toBe(false);
    expect(el?.hasAttribute('size')).toBe(false);
    expect(el?.hasAttribute('radius')).toBe(false);
    expect(el?.hasAttribute('elevation')).toBe(false);
  });

  it('bridges the ui-select event detail to onSelect', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <Breadcrumb onSelect={onSelect}>
        <span slot="item">Workspace</span>
        <span slot="item">Audit logs</span>
      </Breadcrumb>
    );

    const el = container.querySelector('ui-breadcrumb') as HTMLElement | null;
    fireEvent(
      el as HTMLElement,
      new CustomEvent('ui-select', {
        detail: { index: 1, label: 'Audit logs', source: 'click' },
        bubbles: true,
      })
    );

    expect(onSelect).toHaveBeenCalledWith({ index: 1, label: 'Audit logs', source: 'click' });
  });
});
