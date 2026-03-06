import { describe, it, expect } from 'vitest';
import '../components/ui-button';

function settle() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe('UIButton animation CSS', () => {
  it('includes safe hover transform for `scale` animation', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    document.body.appendChild(el);
    await settle();

    const styleEl = el.shadowRoot?.querySelector('style');
    expect(styleEl).toBeTruthy();
    const css = styleEl!.textContent || '';

    expect(css).toContain('transform-origin: center');
    expect(css).toContain('translate3d(0, -2px, 0) scale(1.02)');
    expect(css).toContain('z-index: 1');
  });

  it('does not enable animation by default (opt-in)', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    document.body.appendChild(el);
    await settle();
    expect(el.hasAttribute('data-animation')).toBe(false);
  });

  it('reflects `animation` attribute to `data-animation` when set', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    document.body.appendChild(el);
    await settle();
    el.setAttribute('animation', 'scale');
    // attributeChangedCallback -> render() should set data-animation
    await settle();
    expect(el.getAttribute('data-animation')).toBe('scale');
    el.removeAttribute('animation');
    await settle();
    expect(el.hasAttribute('data-animation')).toBe(false);
  });

  it('scopes hover background to filled variants and avoids a global hover bg', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    document.body.appendChild(el);
    await settle();

    const css = el.shadowRoot?.querySelector('style')!.textContent || '';
    // generic hover rule should no longer include background-color
    expect(css).not.toMatch(/:host\(\[data-animation\]\)\s+\.btn:not\(\[disabled\]\):hover[\s\S]*background-color/);
    // variant-specific hover rule must exist (background is variant-scoped)
    expect(css).toContain('.btn--primary:hover:not([disabled])');
  });

  it('exposes CSS variables for sizing and uses them in the button CSS', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    document.body.appendChild(el);
    await settle();
    const css = el.shadowRoot?.querySelector('style')!.textContent || '';
    expect(css).toContain('--ui-btn-min-height');
    expect(css).toContain('min-block-size: var(--ui-btn-min-height)');
    expect(css).toContain('--ui-btn-padding-inline');
    expect(css).toContain('padding-inline: var(--ui-btn-padding-inline)');
    expect(css).toContain(':host([block]) .btn');
    expect(css).toContain('inline-size: 100%');
  });
});
