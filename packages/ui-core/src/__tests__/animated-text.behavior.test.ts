import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-animated-text';

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 24));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-animated-text', () => {
  it('renders segmented text and exposes the accessible label', async () => {
    const el = document.createElement('ui-animated-text');
    el.textContent = 'Deploy faster together';
    document.body.appendChild(el);
    await flush();

    const content = el.shadowRoot?.querySelector('.content') as HTMLElement | null;
    const segments = Array.from(el.shadowRoot?.querySelectorAll('.segment') || []) as HTMLElement[];

    expect(el.getAttribute('role')).toBe('text');
    expect(el.getAttribute('aria-label')).toBe('Deploy faster together');
    expect(content?.getAttribute('data-split')).toBe('words');
    expect(content?.getAttribute('data-animate')).toBe('true');
    expect(segments.some((segment) => segment.textContent === 'Deploy')).toBe(true);
    expect(segments.some((segment) => segment.textContent === 'faster')).toBe(true);
    expect(el.getAttribute('data-state')).toBe('running');
  });

  it('supports manual playback controls and replays the animation run', async () => {
    const el = document.createElement('ui-animated-text') as HTMLElement & {
      play(): void;
      pause(): void;
      replay(): void;
    };
    el.setAttribute('trigger', 'manual');
    el.textContent = 'System status nominal';
    document.body.appendChild(el);
    await flush();

    const contentBefore = el.shadowRoot?.querySelector('.content') as HTMLElement | null;
    expect(contentBefore?.getAttribute('data-hidden')).toBe('true');
    expect(el.getAttribute('data-state')).toBe('idle');

    el.play();
    await flush();

    const contentAfterPlay = el.shadowRoot?.querySelector('.content') as HTMLElement | null;
    const runAfterPlay = contentAfterPlay?.getAttribute('data-run');
    expect(contentAfterPlay?.getAttribute('data-hidden')).toBe('false');
    expect(el.getAttribute('data-state')).toBe('running');

    el.pause();
    await flush();
    expect(el.hasAttribute('paused')).toBe(true);
    expect(el.getAttribute('data-state')).toBe('paused');

    el.removeAttribute('paused');
    el.replay();
    await flush();

    const contentAfterReplay = el.shadowRoot?.querySelector('.content') as HTMLElement | null;
    expect(Number(contentAfterReplay?.getAttribute('data-run'))).toBeGreaterThan(Number(runAfterPlay));
    expect(el.getAttribute('data-state')).toBe('running');
  });

  it('applies token overrides and typewriter-specific split behavior', async () => {
    const el = document.createElement('ui-animated-text');
    el.setAttribute('text', 'Launch with confidence');
    el.setAttribute('effect', 'typewriter');
    el.setAttribute('radius', '24');
    el.setAttribute('padding', '12 18');
    el.setAttribute('duration', '900');
    el.setAttribute('stagger', '70');
    el.setAttribute('variant', 'gradient');
    el.setAttribute('tone', 'success');
    el.setAttribute('size', 'xl');
    document.body.appendChild(el);
    await flush();

    const content = el.shadowRoot?.querySelector('.content') as HTMLElement | null;
    const caret = el.shadowRoot?.querySelector('.caret') as HTMLElement | null;
    const segments = Array.from(el.shadowRoot?.querySelectorAll('.segment[data-space="false"]') || []);

    expect(el.style.getPropertyValue('--ui-animated-text-radius')).toBe('24px');
    expect(el.style.getPropertyValue('--ui-animated-text-padding')).toBe('12px 18px');
    expect(el.style.getPropertyValue('--ui-animated-text-duration')).toBe('900ms');
    expect(el.style.getPropertyValue('--ui-animated-text-stagger')).toBe('70ms');
    expect(content?.getAttribute('data-effect')).toBe('typewriter');
    expect(content?.getAttribute('data-split')).toBe('chars');
    expect(content?.getAttribute('data-variant')).toBe('gradient');
    expect(caret).not.toBeNull();
    expect(segments.length).toBeGreaterThan('Launch with confidence'.split(' ').join('').length - 2);
  });

  it('accepts custom keyframe effects and effect animation overrides', async () => {
    const el = document.createElement('ui-animated-text');
    el.setAttribute('text', 'Custom effect ready');
    el.setAttribute('effect', 'brand-sweep');
    el.setAttribute('effect-timing', 'linear');
    el.setAttribute('effect-direction', 'alternate');
    el.setAttribute('effect-iteration-count', 'infinite');
    el.setAttribute('effect-fill-mode', 'forwards');
    document.body.appendChild(el);
    await flush();

    const content = el.shadowRoot?.querySelector('.content') as HTMLElement | null;
    expect(content?.getAttribute('data-effect')).toBe('custom');
    expect(content?.getAttribute('data-effect-name')).toBe('brand-sweep');
    expect(el.style.getPropertyValue('--ui-animated-text-custom-animation-name')).toBe('brand-sweep');
    expect(el.style.getPropertyValue('--ui-animated-text-animation-timing')).toBe('linear');
    expect(el.style.getPropertyValue('--ui-animated-text-animation-direction')).toBe('alternate');
    expect(el.style.getPropertyValue('--ui-animated-text-animation-iteration-count')).toBe('infinite');
    expect(el.style.getPropertyValue('--ui-animated-text-animation-fill-mode')).toBe('forwards');
  });
});
