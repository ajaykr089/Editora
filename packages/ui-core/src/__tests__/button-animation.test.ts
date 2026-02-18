import { describe, it, expect } from 'vitest';

describe('UIButton animation CSS', () => {
  it('includes safe hover transform for `scale` animation', () => {
    const el = document.createElement('ui-button') as HTMLElement;
    document.body.appendChild(el);

    const styleEl = el.shadowRoot?.querySelector('style');
    expect(styleEl).toBeTruthy();
    const css = styleEl!.textContent || '';

    expect(css).toContain('transform-origin: center');
    expect(css).toContain('translate3d(0, -2px, 0) scale(1.02)');
    expect(css).toContain('z-index: 1');
  });

  it('does not enable animation by default (opt-in)', () => {
    const el = document.createElement('ui-button') as HTMLElement;
    document.body.appendChild(el);
    expect(el.hasAttribute('data-animation')).toBe(false);
  });

  it('reflects `animation` attribute to `data-animation` when set', () => {
    const el = document.createElement('ui-button') as HTMLElement;
    document.body.appendChild(el);
    el.setAttribute('animation', 'scale');
    // attributeChangedCallback -> render() should set data-animation
    expect(el.getAttribute('data-animation')).toBe('scale');
    el.removeAttribute('animation');
    expect(el.hasAttribute('data-animation')).toBe(false);
  });

  it('scopes hover background to filled variants and avoids a global hover bg', () => {
    const el = document.createElement('ui-button') as HTMLElement;
    document.body.appendChild(el);

    const css = el.shadowRoot?.querySelector('style')!.textContent || '';
    // generic hover rule should no longer include background-color
    expect(css).not.toMatch(/:host\(\[data-animation\]\) button:not\(\[disabled\]\):hover[\s\S]*background-color/);
    // primary-specific hover rule must exist (background is variant-scoped)
    expect(css).toContain(':host([data-animation][variant="primary"]) button:not([disabled]):hover');
  });

  it('exposes CSS variables for sizing and uses them in the button CSS', () => {
    const el = document.createElement('ui-button') as HTMLElement;
    document.body.appendChild(el);
    const css = el.shadowRoot?.querySelector('style')!.textContent || '';
    expect(css).toContain('--ui-min-height');
    expect(css).toContain('min-height: var(--ui-min-height');
    expect(css).toContain('--ui-width');
    expect(css).toContain('width: var(--ui-width');
    // border customization available
    expect(css).toContain('--ui-border');
    expect(css).toContain('border: var(--ui-border');
  });
});