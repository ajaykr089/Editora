import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-spinning-text';

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 24));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-spinning-text', () => {
  it('renders circular glyphs and exposes an accessible label', async () => {
    const el = document.createElement('ui-spinning-text');
    el.setAttribute('text', 'Editora Launch');
    el.setAttribute('repeat', '2');
    el.setAttribute('separator', ' • ');
    document.body.appendChild(el);
    await flush();

    const ring = el.shadowRoot?.querySelector('.ring') as HTMLElement | null;
    const glyphs = Array.from(el.shadowRoot?.querySelectorAll('.glyph') || []);

    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Editora Launch');
    expect(el.getAttribute('data-state')).toBe('running');
    expect(ring?.getAttribute('data-glyph-count')).toBe(String(glyphs.length));
    expect(glyphs.length).toBeGreaterThan('Editora Launch'.length);
    expect(glyphs.some((glyph) => glyph.textContent?.includes('•'))).toBe(true);
  });

  it('applies token overrides and supports play pause refresh controls', async () => {
    const el = document.createElement('ui-spinning-text') as HTMLElement & {
      play(): void;
      pause(): void;
      refresh(): void;
    };
    el.setAttribute('text', 'Orbit ready');
    el.setAttribute('duration', '18');
    el.setAttribute('radius', '72');
    el.setAttribute('font-size', '18');
    el.setAttribute('letter-spacing', '2');
    el.setAttribute('font-weight', '820');
    el.setAttribute('color', '#112233');
    el.setAttribute('accent', '#ff3366');
    el.setAttribute('orbit-color', '#22c55e');
    el.setAttribute('easing', 'ease-in-out');
    el.setAttribute('paused', '');
    document.body.appendChild(el);
    await flush();

    const minRadius = Number.parseFloat(el.style.getPropertyValue('--ui-spinning-text-min-radius') || '0');
    expect(el.style.getPropertyValue('--ui-spinning-text-duration')).toBe('18s');
    expect(el.style.getPropertyValue('--ui-spinning-text-radius')).toBe('72px');
    expect(el.style.getPropertyValue('--ui-spinning-text-font-size')).toBe('18px');
    expect(el.style.getPropertyValue('--ui-spinning-text-letter-spacing')).toBe('2px');
    expect(el.style.getPropertyValue('--ui-spinning-text-font-weight')).toBe('820');
    expect(el.style.getPropertyValue('--ui-spinning-text-color')).toBe('#112233');
    expect(el.style.getPropertyValue('--ui-spinning-text-accent')).toBe('#ff3366');
    expect(el.style.getPropertyValue('--ui-spinning-text-orbit-color')).toBe('#22c55e');
    expect(el.style.getPropertyValue('--ui-spinning-text-easing')).toBe('ease-in-out');
    expect(minRadius).toBeGreaterThan(0);
    expect(el.getAttribute('data-state')).toBe('paused');

    el.play();
    expect(el.hasAttribute('paused')).toBe(false);
    expect(el.getAttribute('data-state')).toBe('running');

    el.pause();
    expect(el.hasAttribute('paused')).toBe(true);
    expect(el.getAttribute('data-state')).toBe('paused');

    el.refresh();
    await flush();
    expect(el.shadowRoot?.querySelectorAll('.glyph').length).toBeGreaterThan(0);
  });

  it('ignores center slot text when resolving the accessible label', async () => {
    const el = document.createElement('ui-spinning-text');
    el.textContent = 'Trusted Systems';

    const center = document.createElement('div');
    center.slot = 'center';
    center.textContent = 'Center badge';
    el.appendChild(center);

    document.body.appendChild(el);
    await flush();

    expect(el.getAttribute('aria-label')).toBe('Trusted Systems');
    expect(el.shadowRoot?.querySelector('.center-shell--empty')).toBeNull();
  });
});
