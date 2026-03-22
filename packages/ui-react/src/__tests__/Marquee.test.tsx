import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-marquee';
import { Marquee } from '../components/Marquee';

describe('Marquee wrapper', () => {
  it('forwards marquee attributes to the host element', () => {
    const { container } = render(
      <Marquee
        direction="right"
        speed={80}
        gap={40}
        paused
        pauseOnHover
        pauseOnFocus
        fade
        fadeSize={24}
        variant="soft"
        tone="warning"
        size="lg"
        radius={20}
        elevation="high"
        padding="12px 18px"
      >
        <Marquee.Item>Alpha</Marquee.Item>
        <Marquee.Item>Beta</Marquee.Item>
      </Marquee>
    );

    const el = container.querySelector('ui-marquee') as HTMLElement | null;
    expect(el?.getAttribute('direction')).toBe('right');
    expect(el?.getAttribute('speed')).toBe('80');
    expect(el?.getAttribute('gap')).toBe('40px');
    expect(el?.hasAttribute('paused')).toBe(true);
    expect(el?.hasAttribute('pause-on-hover')).toBe(true);
    expect(el?.hasAttribute('pause-on-focus')).toBe(true);
    expect(el?.hasAttribute('fade')).toBe(true);
    expect(el?.getAttribute('fade-size')).toBe('24px');
    expect(el?.getAttribute('variant')).toBe('soft');
    expect(el?.getAttribute('tone')).toBe('warning');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('20');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('padding')).toBe('12px 18px');
    expect(container.querySelectorAll('[data-ui-marquee-item]').length).toBe(2);
  });

  it('exposes the custom element imperative API through the React ref', () => {
    const ref = React.createRef<HTMLElement & { pause(): void; play(): void }>();
    render(
      <Marquee ref={ref}>
        <Marquee.Item>Alpha</Marquee.Item>
      </Marquee>
    );

    ref.current?.pause();
    expect(ref.current?.hasAttribute('paused')).toBe(true);

    ref.current?.play();
    expect(ref.current?.hasAttribute('paused')).toBe(false);
  });
});
