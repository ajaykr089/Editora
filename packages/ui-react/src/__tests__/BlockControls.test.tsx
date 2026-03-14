import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-block-controls';
import { BlockControls } from '../components/BlockControls';

describe('BlockControls wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <BlockControls variant="solid" tone="success" size="lg" radius={16} elevation="high" state="success" wrap>
        <button>Bold</button>
      </BlockControls>
    );

    const el = container.querySelector('ui-block-controls') as HTMLElement | null;
    expect(el?.getAttribute('variant')).toBe('solid');
    expect(el?.getAttribute('tone')).toBe('success');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('16');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('state')).toBe('success');
    expect(el?.hasAttribute('wrap')).toBe(true);
  });

  it('keeps surface and low as the implicit defaults', () => {
    const { container } = render(
      <BlockControls variant="surface" elevation="low">
        <button>Bold</button>
      </BlockControls>
    );

    const el = container.querySelector('ui-block-controls') as HTMLElement | null;
    expect(el?.hasAttribute('variant')).toBe(false);
    expect(el?.hasAttribute('elevation')).toBe(false);
  });

  it('bridges navigate events to onNavigate', () => {
    const onNavigate = vi.fn();
    const { container } = render(
      <BlockControls onNavigate={onNavigate}>
        <button>Bold</button>
      </BlockControls>
    );

    const el = container.querySelector('ui-block-controls') as HTMLElement | null;
    fireEvent(
      el as HTMLElement,
      new CustomEvent('ui-navigate', {
        detail: { fromIndex: 0, toIndex: 1, total: 3, key: 'ArrowRight', orientation: 'horizontal' },
        bubbles: true,
      })
    );

    expect(onNavigate).toHaveBeenCalledWith({
      fromIndex: 0,
      toIndex: 1,
      total: 3,
      key: 'ArrowRight',
      orientation: 'horizontal',
    });
  });
});
