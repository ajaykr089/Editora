import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-avatar';
import { Avatar } from '../components/Avatar';

describe('Avatar wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <Avatar
        src="https://example.com/avatar.png"
        alt="Asha Patel"
        size="lg"
        radius={16}
        variant="solid"
        tone="success"
        elevation="high"
        status="online"
        badge="3"
        interactive
      />
    );

    const el = container.querySelector('ui-avatar') as HTMLElement | null;
    expect(el?.getAttribute('src')).toBe('https://example.com/avatar.png');
    expect(el?.getAttribute('alt')).toBe('Asha Patel');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('16');
    expect(el?.getAttribute('variant')).toBe('solid');
    expect(el?.getAttribute('tone')).toBe('success');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('status')).toBe('online');
    expect(el?.getAttribute('badge')).toBe('3');
    expect(el?.hasAttribute('interactive')).toBe(true);
  });

  it('keeps surface and low as the implicit defaults', () => {
    const { container } = render(<Avatar initials="AP" variant="surface" elevation="low" />);
    const el = container.querySelector('ui-avatar') as HTMLElement | null;
    expect(el?.hasAttribute('variant')).toBe(false);
    expect(el?.hasAttribute('elevation')).toBe(false);
  });
});
