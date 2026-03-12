import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-badge';
import { Badge } from '../components/Badge';

describe('Badge wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <Badge tone="success" variant="solid" size="lg" radius={12} elevation="high" state="success" dot interactive>
        Healthy
      </Badge>
    );

    const el = container.querySelector('ui-badge') as HTMLElement | null;
    expect(el?.getAttribute('tone')).toBe('success');
    expect(el?.getAttribute('variant')).toBe('solid');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('12');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('state')).toBe('success');
    expect(el?.hasAttribute('dot')).toBe(true);
    expect(el?.hasAttribute('interactive')).toBe(true);
  });

  it('keeps surface and none as the implicit defaults', () => {
    const { container } = render(
      <Badge variant="surface" elevation="none">
        Neutral
      </Badge>
    );

    const el = container.querySelector('ui-badge') as HTMLElement | null;
    expect(el?.hasAttribute('variant')).toBe(false);
    expect(el?.hasAttribute('elevation')).toBe(false);
  });

  it('bridges the remove event detail to onRemove', () => {
    const onRemove = vi.fn();
    const { container } = render(
      <Badge removable onRemove={onRemove}>
        Monitoring
      </Badge>
    );

    const el = container.querySelector('ui-badge') as HTMLElement | null;
    fireEvent(
      el as HTMLElement,
      new CustomEvent('remove', {
        detail: { text: 'Monitoring', source: 'button' },
        bubbles: true,
      })
    );

    expect(onRemove).toHaveBeenCalledWith({ text: 'Monitoring', source: 'button' });
  });
});
