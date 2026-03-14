import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-menubar';
import { Menubar } from '../components/Menubar';

describe('Menubar wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <Menubar variant="solid" size="lg" radius={12} tone="warning" elevation="high">
        <button slot="item">File</button>
        <div slot="content">
          <div role="menuitem">Export</div>
        </div>
      </Menubar>
    );

    const el = container.querySelector('ui-menubar') as HTMLElement | null;
    expect(el?.getAttribute('variant')).toBe('solid');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('12');
    expect(el?.getAttribute('tone')).toBe('warning');
    expect(el?.getAttribute('elevation')).toBe('high');
  });

  it('keeps surface and md as the implicit defaults', () => {
    const { container } = render(
      <Menubar variant="surface" size="md">
        <button slot="item">File</button>
        <div slot="content">
          <div role="menuitem">Export</div>
        </div>
      </Menubar>
    );

    const el = container.querySelector('ui-menubar') as HTMLElement | null;
    expect(el?.hasAttribute('variant')).toBe(false);
    expect(el?.hasAttribute('size')).toBe(false);
  });

  it('forwards numeric size aliases for compact and large menubars', () => {
    const { container, rerender } = render(
      <Menubar size="1">
        <button slot="item">File</button>
        <div slot="content">
          <div role="menuitem">Export</div>
        </div>
      </Menubar>
    );

    const el = container.querySelector('ui-menubar') as HTMLElement | null;
    expect(el?.getAttribute('size')).toBe('1');

    rerender(
      <Menubar size="3">
        <button slot="item">File</button>
        <div slot="content">
          <div role="menuitem">Export</div>
        </div>
      </Menubar>
    );

    expect(el?.getAttribute('size')).toBe('3');
  });
});
