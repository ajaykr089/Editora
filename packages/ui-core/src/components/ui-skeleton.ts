import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-skeleton-radius: 10px;
    --ui-skeleton-height: 16px;
    --ui-skeleton-width: 100%;
    --ui-skeleton-gap: 10px;
    --ui-skeleton-duration: 1.2s;

    --ui-skeleton-base: color-mix(in srgb, var(--ui-color-muted, #64748b) 20%, transparent);
    --ui-skeleton-glow: color-mix(in srgb, var(--ui-color-surface, #ffffff) 80%, transparent);
    --ui-skeleton-wave: color-mix(in srgb, var(--ui-color-surface, #ffffff) 68%, transparent);
    --ui-skeleton-bg: linear-gradient(
      110deg,
      var(--ui-skeleton-base) 8%,
      var(--ui-skeleton-glow) 18%,
      var(--ui-skeleton-base) 33%
    );
    --ui-skeleton-bg-size: 200% 100%;

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
    background-color: var(--ui-skeleton-base);
    background-image: var(--ui-skeleton-bg);
    background-size: var(--ui-skeleton-bg-size);
    background-position: 100% 50%;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    will-change: background-position, opacity, transform;
  }

  .stack[data-animation="shimmer"] .line {
    animation: ui-skeleton-shimmer var(--ui-skeleton-duration) ease-in-out infinite;
  }

  .stack[data-animation="pulse"] .line {
    animation: ui-skeleton-pulse var(--ui-skeleton-duration) ease-in-out infinite;
  }

  .stack[data-animation="wave"] .line::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent 0%,
      transparent 20%,
      var(--ui-skeleton-wave) 50%,
      transparent 80%,
      transparent 100%
    );
    animation: ui-skeleton-wave var(--ui-skeleton-duration) linear infinite;
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

  :host([variant="pill"]) .line {
    --ui-line-height: 18px;
    --ui-line-radius: 999px;
  }

  :host([variant="avatar"]) .line {
    --ui-line-height: 44px;
    --ui-line-width: 44px;
    --ui-line-radius: 999px;
  }

  :host([variant="badge"]) .line {
    --ui-line-height: 20px;
    --ui-line-width: 92px;
    --ui-line-radius: 999px;
  }

  :host([variant="button"]) .line {
    --ui-line-height: 36px;
    --ui-line-width: 128px;
    --ui-line-radius: 8px;
  }

  :host([density="compact"]) {
    --ui-skeleton-height: 14px;
    --ui-skeleton-gap: 8px;
  }

  :host([density="comfortable"]) {
    --ui-skeleton-height: 18px;
    --ui-skeleton-gap: 12px;
  }

  :host([tone="brand"]) {
    --ui-skeleton-base: color-mix(in srgb, var(--ui-color-primary, #2563eb) 18%, transparent);
    --ui-skeleton-glow: color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent);
    --ui-skeleton-wave: color-mix(in srgb, var(--ui-color-primary, #2563eb) 36%, transparent);
  }

  :host([tone="success"]) {
    --ui-skeleton-base: color-mix(in srgb, var(--ui-color-success, #16a34a) 18%, transparent);
    --ui-skeleton-glow: color-mix(in srgb, var(--ui-color-success, #16a34a) 30%, transparent);
    --ui-skeleton-wave: color-mix(in srgb, var(--ui-color-success, #16a34a) 36%, transparent);
  }

  :host([tone="warning"]) {
    --ui-skeleton-base: color-mix(in srgb, var(--ui-color-warning, #d97706) 20%, transparent);
    --ui-skeleton-glow: color-mix(in srgb, var(--ui-color-warning, #d97706) 32%, transparent);
    --ui-skeleton-wave: color-mix(in srgb, var(--ui-color-warning, #d97706) 38%, transparent);
  }

  :host([tone="danger"]) {
    --ui-skeleton-base: color-mix(in srgb, var(--ui-color-danger, #dc2626) 18%, transparent);
    --ui-skeleton-glow: color-mix(in srgb, var(--ui-color-danger, #dc2626) 30%, transparent);
    --ui-skeleton-wave: color-mix(in srgb, var(--ui-color-danger, #dc2626) 36%, transparent);
  }

  :host([headless]) .stack {
    display: none;
  }

  @keyframes ui-skeleton-shimmer {
    to {
      background-position: -100% 50%;
    }
  }

  @keyframes ui-skeleton-pulse {
    0%,
    100% {
      opacity: 0.55;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes ui-skeleton-wave {
    to {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .stack .line,
    .stack .line::after {
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

    .line::after {
      display: none !important;
    }
  }
`;

const TEXT_WIDTH_PATTERN = ['96%', '86%', '78%', '92%', '68%', '88%'];

export class UISkeleton extends ElementBase {
  static get observedAttributes() {
    return [
      'count',
      'height',
      'width',
      'radius',
      'gap',
      'variant',
      'animated',
      'animation',
      'density',
      'tone',
      'duration',
      'headless'
    ];
  }

  private _numAttr(name: string, fallback: number): number {
    const raw = this.getAttribute(name);
    if (!raw) return fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  private _animationMode(): 'none' | 'shimmer' | 'pulse' | 'wave' {
    const explicit = (this.getAttribute('animation') || '').trim().toLowerCase();
    if (explicit === 'shimmer' || explicit === 'pulse' || explicit === 'wave' || explicit === 'none') {
      return explicit;
    }
    return this.hasAttribute('animated') ? 'shimmer' : 'none';
  }

  private _lineWidth(index: number, variant: string, explicitWidth: string | null): string {
    if (explicitWidth && explicitWidth.trim()) return explicitWidth;

    if (variant === 'text') {
      return TEXT_WIDTH_PATTERN[index % TEXT_WIDTH_PATTERN.length] || '92%';
    }

    if (variant === 'badge') return '92px';
    if (variant === 'button') return '128px';
    if (variant === 'avatar') return '44px';

    return '100%';
  }

  protected render() {
    const count = Math.max(1, Math.min(40, this._numAttr('count', 1)));
    const height = this.getAttribute('height');
    const width = this.getAttribute('width');
    const radius = this.getAttribute('radius');
    const gap = this.getAttribute('gap');
    const duration = this.getAttribute('duration');
    const variant = (this.getAttribute('variant') || 'rect').trim();
    const animation = this._animationMode();

    const lines = Array.from({ length: count }, (_, index) => {
      const lineWidth = this._lineWidth(index, variant, width);
      return `<div class="line" style="--ui-line-width:${lineWidth};"></div>`;
    }).join('');

    this.setContent(`
      <style>${style}</style>
      <div
        class="stack"
        data-animation="${animation}"
        style="
          ${height ? `--ui-skeleton-height:${height};` : ''}
          ${width ? `--ui-skeleton-width:${width};` : ''}
          ${radius ? `--ui-skeleton-radius:${radius};` : ''}
          ${gap ? `--ui-skeleton-gap:${gap};` : ''}
          ${duration ? `--ui-skeleton-duration:${duration};` : ''}
        "
        role="status"
        aria-live="polite"
        aria-busy="true"
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
