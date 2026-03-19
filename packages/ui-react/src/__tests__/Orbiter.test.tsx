import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-orbiter';
import { Orbiter } from '../components/Orbiter';

describe('Orbiter wrapper', () => {
  it('forwards orbiting-circle attributes to the host element', () => {
    const { container } = render(
      <Orbiter
        duration={14}
        delay={6}
        speed={1.5}
        reverse
        radius={96}
        path={false}
        iconSize={46}
        centerSize={118}
        ringGap={26}
        rings={2}
        startAngle={-60}
        direction="alternate"
        animation="bouncy"
        variant="glass"
        tone="info"
        size="lg"
        surfaceRadius={30}
        elevation="high"
        padding="24px"
        pauseOnHover
        pauseOnItemHover
        pauseOnFocus
        paused
      >
        <Orbiter.Center>Center</Orbiter.Center>
        <Orbiter.Item clickable>One</Orbiter.Item>
        <Orbiter.Item>Two</Orbiter.Item>
      </Orbiter>
    );

    const el = container.querySelector('ui-orbiter') as HTMLElement | null;
    expect(el?.getAttribute('duration')).toBe('14s');
    expect(el?.getAttribute('delay')).toBe('6s');
    expect(el?.getAttribute('speed')).toBe('1.5');
    expect(el?.hasAttribute('reverse')).toBe(true);
    expect(el?.getAttribute('radius')).toBe('96px');
    expect(el?.getAttribute('path')).toBe('false');
    expect(el?.getAttribute('icon-size')).toBe('46px');
    expect(el?.getAttribute('center-size')).toBe('118px');
    expect(el?.getAttribute('ring-gap')).toBe('26px');
    expect(el?.getAttribute('rings')).toBe('2');
    expect(el?.getAttribute('start-angle')).toBe('-60');
    expect(el?.getAttribute('direction')).toBe('alternate');
    expect(el?.getAttribute('animation')).toBe('bouncy');
    expect(el?.getAttribute('variant')).toBe('glass');
    expect(el?.getAttribute('tone')).toBe('info');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('surface-radius')).toBe('30');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('padding')).toBe('24px');
    expect(el?.hasAttribute('pause-on-hover')).toBe(true);
    expect(el?.hasAttribute('pause-on-item-hover')).toBe(true);
    expect(el?.hasAttribute('pause-on-focus')).toBe(true);
    expect(el?.hasAttribute('paused')).toBe(true);
    expect(container.querySelector('[slot="center"]')?.hasAttribute('data-ui-orbiter-center')).toBe(true);
    expect(container.querySelectorAll('[data-ui-orbiter-item]').length).toBe(2);
    expect(container.querySelector('[data-ui-orbiter-clickable]')?.tagName).toBe('BUTTON');
  });

  it('exposes the imperative API through the React ref', () => {
    const ref = React.createRef<HTMLElement & { play(): void; pause(): void; refresh(): void }>();
    render(
      <Orbiter ref={ref}>
        <Orbiter.Item>One</Orbiter.Item>
      </Orbiter>
    );

    ref.current?.pause();
    expect(ref.current?.hasAttribute('paused')).toBe(true);

    ref.current?.play();
    expect(ref.current?.hasAttribute('paused')).toBe(false);

    ref.current?.refresh();
    expect(ref.current).not.toBeNull();
  });

  it('renders clickable items as interactive elements when requested', () => {
    const { container } = render(
      <Orbiter>
        <Orbiter.Item clickable aria-label="Open search">
          Search
        </Orbiter.Item>
      </Orbiter>
    );

    const button = container.querySelector('button[data-ui-orbiter-clickable]');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('aria-label')).toBe('Open search');
  });
});
