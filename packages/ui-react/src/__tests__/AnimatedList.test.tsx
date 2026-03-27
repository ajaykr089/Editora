import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-animated-list';
import { AnimatedList } from '../components/AnimatedList';

describe('AnimatedList wrapper', () => {
  it('forwards animated list attributes to the host element', () => {
    const { container } = render(
      <AnimatedList
        effect="blur-in"
        animation="snappy"
        trigger="manual"
        duration={540}
        stagger={80}
        delay={30}
        loop
        loopDelay={1600}
        paused
        threshold={0.4}
        variant="soft"
        tone="success"
        size="lg"
        radius={24}
        elevation="high"
        padding="14px 18px"
        gap={16}
      >
        <AnimatedList.Item>Alpha</AnimatedList.Item>
        <AnimatedList.Item>Beta</AnimatedList.Item>
      </AnimatedList>
    );

    const el = container.querySelector('ui-animated-list') as HTMLElement | null;
    expect(el?.getAttribute('effect')).toBe('blur-in');
    expect(el?.getAttribute('animation')).toBe('snappy');
    expect(el?.getAttribute('trigger')).toBe('manual');
    expect(el?.getAttribute('duration')).toBe('540ms');
    expect(el?.getAttribute('stagger')).toBe('80ms');
    expect(el?.getAttribute('delay')).toBe('30ms');
    expect(el?.hasAttribute('loop')).toBe(true);
    expect(el?.getAttribute('loop-delay')).toBe('1600ms');
    expect(el?.hasAttribute('paused')).toBe(true);
    expect(el?.getAttribute('threshold')).toBe('0.4');
    expect(el?.getAttribute('variant')).toBe('soft');
    expect(el?.getAttribute('tone')).toBe('success');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('24');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('padding')).toBe('14px 18px');
    expect(el?.getAttribute('gap')).toBe('16px');
    expect(container.querySelectorAll('[data-ui-animated-list-item]').length).toBe(2);
  });

  it('exposes the imperative API through the React ref', () => {
    const ref = React.createRef<HTMLElement & { pause(): void; play(): void; replay(): void }>();
    render(
      <AnimatedList ref={ref} trigger="manual">
        <AnimatedList.Item>Alpha</AnimatedList.Item>
      </AnimatedList>
    );

    ref.current?.pause();
    expect(ref.current?.hasAttribute('paused')).toBe(true);

    ref.current?.play();
    expect(ref.current?.hasAttribute('paused')).toBe(false);

    ref.current?.replay();
    expect(ref.current).not.toBeNull();
  });
});
