import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-aspect-ratio';
import { AspectRatio } from '../components/AspectRatio';

describe('AspectRatio wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <AspectRatio
        ratio="4/3"
        fit="contain"
        variant="soft"
        tone="warning"
        size="lg"
        radius={16}
        elevation="high"
        interactive
        showRatioBadge
      >
        <img alt="Preview" src="https://picsum.photos/800/600" />
      </AspectRatio>
    );

    const el = container.querySelector('ui-aspect-ratio') as HTMLElement | null;
    expect(el?.getAttribute('ratio')).toBe('4/3');
    expect(el?.getAttribute('fit')).toBe('contain');
    expect(el?.getAttribute('variant')).toBe('soft');
    expect(el?.getAttribute('tone')).toBe('warning');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('16');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.hasAttribute('interactive')).toBe(true);
    expect(el?.hasAttribute('show-ratio-badge')).toBe(true);
  });

  it('normalizes numeric ratio inputs to string values', () => {
    const { container } = render(<AspectRatio ratio={1} />);
    const el = container.querySelector('ui-aspect-ratio') as HTMLElement | null;
    expect(el?.getAttribute('ratio')).toBe('1/1');
  });
});
