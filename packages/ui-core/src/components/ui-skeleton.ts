import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-skeleton-radius: 10px;
    --ui-skeleton-height: 16px;
    --ui-skeleton-width: 100%;
    --ui-skeleton-gap: 10px;
    --ui-skeleton-base: var(--ui-color-surface-alt, rgba(148, 163, 184, 0.2));
    --ui-skeleton-glow: color-mix(in srgb, var(--ui-color-surface, #ffffff) 72%, transparent);
    --ui-skeleton-bg: linear-gradient(
      110deg,
      var(--ui-skeleton-base) 8%,
      var(--ui-skeleton-glow) 18%,
      var(--ui-skeleton-base) 33%
    );
    --ui-skeleton-bg-size: 200% 100%;
    --ui-skeleton-duration: 1.2s;
    color-scheme: light dark;
  }

  .stack {
    display: grid;
    gap: var(--ui-skeleton-gap);
  }

  .line {
    width: var(--ui-line-width, var(--ui-skeleton-width));
    height: var(--ui-line-height, var(--ui-skeleton-height));
    border-radius: var(--ui-line-radius, var(--ui-skeleton-radius));
    background-image: var(--ui-skeleton-bg);
    background-size: var(--ui-skeleton-bg-size);
    background-position: 100% 50%;
  }

  :host([animated]) .line {
    animation: ui-skeleton-shimmer var(--ui-skeleton-duration) ease-in-out infinite;
  }

  :host([variant="circle"]) .line {
    --ui-line-height: var(--ui-skeleton-height);
    --ui-line-width: var(--ui-skeleton-height);
    --ui-line-radius: 999px;
  }

  :host([variant="text"]) .line {
    --ui-line-height: 12px;
    --ui-line-radius: 999px;
  }

  :host([headless]) .stack {
    display: none;
  }

  @keyframes ui-skeleton-shimmer {
    to {
      background-position: -100% 50%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :host([animated]) .line {
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .line {
      outline: 1px solid color-mix(in srgb, var(--ui-color-border, currentColor) 82%, transparent);
    }
  }

  @media (forced-colors: active) {
    .line {
      forced-color-adjust: none;
      background: CanvasText;
      opacity: 0.25;
      outline: 1px solid CanvasText;
    }
  }
`;

export class UISkeleton extends ElementBase {
  static get observedAttributes() {
    return ['count', 'height', 'width', 'radius', 'gap', 'variant', 'animated', 'headless'];
  }

  private _numAttr(name: string, fallback: number): number {
    const raw = this.getAttribute(name);
    if (!raw) return fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  protected render() {
    const count = Math.max(1, Math.min(20, this._numAttr('count', 1)));
    const height = this.getAttribute('height');
    const width = this.getAttribute('width');
    const radius = this.getAttribute('radius');
    const gap = this.getAttribute('gap');
    const variant = this.getAttribute('variant') || 'rect';

    const lines = Array.from({ length: count }, (_, index) => {
      const textWidth = variant === 'text'
        ? `${90 - (index % 4) * 12}%`
        : (width || '100%');
      return `<div class="line" style="--ui-line-width:${textWidth};"></div>`;
    }).join('');

    this.setContent(`
      <style>${style}</style>
      <div
        class="stack"
        style="
          ${height ? `--ui-skeleton-height:${height};` : ''}
          ${width ? `--ui-skeleton-width:${width};` : ''}
          ${radius ? `--ui-skeleton-radius:${radius};` : ''}
          ${gap ? `--ui-skeleton-gap:${gap};` : ''}
        "
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        ${lines}
      </div>
    `);
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-skeleton')) {
  customElements.define('ui-skeleton', UISkeleton);
}
