import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-animated-text';
import { AnimatedText } from '../components/AnimatedText';

describe('AnimatedText wrapper', () => {
  it('forwards animated text attributes to the host element', () => {
    const { container } = render(
      <AnimatedText
        text="Editorial automation at speed"
        effect="blur"
        split="chars"
        trigger="manual"
        duration={900}
        stagger={70}
        delay={120}
        loop
        loopDelay={1800}
        paused
        customEffect="editorial-ribbon"
        effectTimingFunction="linear"
        effectDirection="alternate"
        effectIterationCount="infinite"
        effectFillMode="forwards"
        variant="contrast"
        tone="warning"
        size="xl"
        radius={28}
        elevation="high"
        padding="14px 20px"
        align="center"
      />
    );

    const el = container.querySelector('ui-animated-text') as HTMLElement | null;
    expect(el?.getAttribute('text')).toBe('Editorial automation at speed');
    expect(el?.getAttribute('effect')).toBe('blur');
    expect(el?.getAttribute('split')).toBe('chars');
    expect(el?.getAttribute('trigger')).toBe('manual');
    expect(el?.getAttribute('duration')).toBe('900ms');
    expect(el?.getAttribute('stagger')).toBe('70ms');
    expect(el?.getAttribute('delay')).toBe('120ms');
    expect(el?.hasAttribute('loop')).toBe(true);
    expect(el?.getAttribute('loop-delay')).toBe('1800ms');
    expect(el?.hasAttribute('paused')).toBe(true);
    expect(el?.getAttribute('custom-effect')).toBe('editorial-ribbon');
    expect(el?.getAttribute('effect-timing')).toBe('linear');
    expect(el?.getAttribute('effect-direction')).toBe('alternate');
    expect(el?.getAttribute('effect-iteration-count')).toBe('infinite');
    expect(el?.getAttribute('effect-fill-mode')).toBe('forwards');
    expect(el?.getAttribute('variant')).toBe('contrast');
    expect(el?.getAttribute('tone')).toBe('warning');
    expect(el?.getAttribute('size')).toBe('xl');
    expect(el?.getAttribute('radius')).toBe('28');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('padding')).toBe('14px 20px');
    expect(el?.getAttribute('align')).toBe('center');
  });

  it('exposes the custom element imperative API through the React ref', () => {
    const ref = React.createRef<HTMLElement & { play(): void; pause(): void; replay(): void }>();
    render(
      <AnimatedText ref={ref} trigger="manual">
        Motion ready
      </AnimatedText>
    );

    ref.current?.play();
    expect(ref.current?.getAttribute('data-state')).toBe('running');

    ref.current?.pause();
    expect(ref.current?.hasAttribute('paused')).toBe(true);

    ref.current?.replay();
    expect(ref.current?.getAttribute('data-state')).toBe('paused');
  });

  it('supports custom keyframe names through effect and customEffect props', () => {
    const { container } = render(
      <AnimatedText effect="editorial-drift" customEffect="brand-bounce">
        Custom motion
      </AnimatedText>
    );

    const el = container.querySelector('ui-animated-text') as HTMLElement | null;
    expect(el?.getAttribute('effect')).toBe('editorial-drift');
    expect(el?.getAttribute('custom-effect')).toBe('brand-bounce');
  });
});
