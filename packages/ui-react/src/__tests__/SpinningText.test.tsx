import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-spinning-text';
import { SpinningText, type SpinningTextElement } from '../components/SpinningText';

describe('SpinningText wrapper', () => {
  it('forwards spinning-text attributes to the host element', () => {
    const { container } = render(
      <SpinningText
        text="Design systems in motion"
        repeat={3}
        separator=" / "
        speed={6}
        duration={12}
        direction="counterclockwise"
        variant="glass"
        tone="info"
        size="xl"
        radius={96}
        padding="20 24"
        fontSize={18}
        fontWeight={800}
        letterSpacing={2}
        color="#112233"
        accent="#ff3366"
        orbitColor="#22c55e"
        easing="ease-in-out"
        elevation="high"
        paused
        pauseOnHover
        pauseOnFocus
      >
        <SpinningText.Center aria-label="Center emblem">ET</SpinningText.Center>
      </SpinningText>
    );

    const el = container.querySelector('ui-spinning-text') as HTMLElement | null;
    expect(el?.getAttribute('text')).toBe('Design systems in motion');
    expect(el?.getAttribute('repeat')).toBe('3');
    expect(el?.getAttribute('separator')).toBe(' / ');
    expect(el?.getAttribute('speed')).toBe('6');
    expect(el?.getAttribute('duration')).toBe('12s');
    expect(el?.getAttribute('direction')).toBe('counterclockwise');
    expect(el?.getAttribute('variant')).toBe('glass');
    expect(el?.getAttribute('tone')).toBe('info');
    expect(el?.getAttribute('size')).toBe('xl');
    expect(el?.getAttribute('radius')).toBe('96px');
    expect(el?.getAttribute('padding')).toBe('20px 24px');
    expect(el?.getAttribute('font-size')).toBe('18px');
    expect(el?.getAttribute('font-weight')).toBe('800');
    expect(el?.getAttribute('letter-spacing')).toBe('2px');
    expect(el?.getAttribute('color')).toBe('#112233');
    expect(el?.getAttribute('accent')).toBe('#ff3366');
    expect(el?.getAttribute('orbit-color')).toBe('#22c55e');
    expect(el?.getAttribute('easing')).toBe('ease-in-out');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.hasAttribute('paused')).toBe(true);
    expect(el?.hasAttribute('pause-on-hover')).toBe(true);
    expect(el?.hasAttribute('pause-on-focus')).toBe(true);
    expect(container.querySelector('[slot="center"]')?.hasAttribute('data-ui-spinning-text-center')).toBe(true);
  });

  it('exposes the imperative API through the React ref', () => {
    const ref = React.createRef<SpinningTextElement>();
    render(<SpinningText ref={ref} text="Signal" />);

    ref.current?.pause();
    expect(ref.current?.hasAttribute('paused')).toBe(true);

    ref.current?.play();
    expect(ref.current?.hasAttribute('paused')).toBe(false);

    ref.current?.refresh();
    expect(ref.current).not.toBeNull();
  });

  it('passes children through when text is omitted', () => {
    const { container } = render(
      <SpinningText>
        Editorial motion
        <SpinningText.Center>Core</SpinningText.Center>
      </SpinningText>
    );

    const el = container.querySelector('ui-spinning-text') as HTMLElement | null;
    expect(el?.getAttribute('text')).toBeNull();
    expect(el?.textContent).toContain('Editorial motion');
    expect(container.querySelector('[slot="center"]')?.textContent).toBe('Core');
  });
});
