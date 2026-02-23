import { ElementBase } from '../ElementBase';
import { getIcon } from '../icons';

const style = `
  :host {
    --ui-icon-size: 1em;
    --ui-icon-color: currentColor;
    --ui-icon-radius: 8px;
    --ui-icon-bg: transparent;
    --ui-icon-border: 1px solid transparent;
    --ui-icon-shadow: none;
    --ui-icon-pad: 0;
    --ui-icon-rotate-duration: 0.9s;
    --ui-icon-pulse-duration: 1.35s;
    color-scheme: light dark;
    display: inline-grid;
    place-items: center;
    inline-size: calc(var(--ui-icon-size) + (var(--ui-icon-pad) * 2));
    block-size: calc(var(--ui-icon-size) + (var(--ui-icon-pad) * 2));
    color: var(--ui-icon-color);
    vertical-align: middle;
  }

  .icon {
    position: relative;
    display: grid;
    place-items: center;
    inline-size: 100%;
    block-size: 100%;
    border-radius: var(--ui-icon-radius);
    border: var(--ui-icon-border);
    background: var(--ui-icon-bg);
    box-shadow: var(--ui-icon-shadow);
    transition: transform 170ms ease, box-shadow 170ms ease, background-color 170ms ease, border-color 170ms ease;
    overflow: hidden;
    isolation: isolate;
  }

  .glyph {
    inline-size: var(--ui-icon-size);
    block-size: var(--ui-icon-size);
    display: grid;
    place-items: center;
    line-height: 0;
    color: currentColor;
  }

  .glyph > svg {
    inline-size: 100%;
    block-size: 100%;
    display: block;
    fill: currentColor;
    stroke-width: var(--ui-icon-stroke-width, 1.5);
    shape-rendering: geometricPrecision;
  }

  .fallback {
    display: inline-grid;
    place-items: center;
    inline-size: 100%;
    block-size: 100%;
    border-radius: max(4px, calc(var(--ui-icon-radius) - 3px));
    font: 700 11px/1 "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.02em;
    color: color-mix(in srgb, currentColor 74%, transparent);
    background: color-mix(in srgb, currentColor 10%, transparent);
  }

  .badge {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(36%, -36%);
    min-inline-size: 8px;
    block-size: 8px;
    border-radius: 999px;
    background: var(--ui-icon-badge-bg, #ef4444);
    border: 2px solid var(--ui-icon-bg, transparent);
    box-sizing: border-box;
  }

  :host([size="xs"]) { --ui-icon-size: 12px; }
  :host([size="sm"]) { --ui-icon-size: 14px; }
  :host([size="md"]) { --ui-icon-size: 18px; }
  :host([size="lg"]) { --ui-icon-size: 22px; }
  :host([size="xl"]) { --ui-icon-size: 28px; }

  :host([variant="surface"]) {
    --ui-icon-pad: 6px;
    --ui-icon-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-icon-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-icon-shadow: 0 1px 3px rgba(2, 6, 23, 0.08);
  }

  :host([variant="soft"]) {
    --ui-icon-pad: 6px;
    --ui-icon-bg: color-mix(in srgb, currentColor 8%, transparent);
    --ui-icon-border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  }

  :host([variant="contrast"]) {
    --ui-icon-pad: 6px;
    --ui-icon-bg: #0f172a;
    --ui-icon-color: #e2e8f0;
    --ui-icon-border: 1px solid #334155;
    --ui-icon-shadow: 0 2px 8px rgba(2, 6, 23, 0.28);
  }

  :host([variant="minimal"]) {
    --ui-icon-pad: 0;
    --ui-icon-bg: transparent;
    --ui-icon-border: 0;
    --ui-icon-shadow: none;
  }

  :host([variant="elevated"]) {
    --ui-icon-pad: 6px;
    --ui-icon-bg: linear-gradient(
      165deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, #ffffff 8%),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent)
    );
    --ui-icon-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 68%, transparent);
    --ui-icon-shadow:
      0 1px 4px rgba(2, 6, 23, 0.08),
      0 10px 20px rgba(2, 6, 23, 0.12);
  }

  :host([tone="brand"]) { --ui-icon-color: var(--ui-color-primary, var(--ui-primary, #2563eb)); }
  :host([tone="success"]) { --ui-icon-color: var(--ui-color-success, var(--ui-success, #16a34a)); }
  :host([tone="warning"]) { --ui-icon-color: var(--ui-color-warning, var(--ui-warning, #d97706)); }
  :host([tone="danger"]) { --ui-icon-color: var(--ui-color-danger, var(--ui-error, #dc2626)); }

  :host([shape="square"]) { --ui-icon-radius: 4px; }
  :host([shape="soft"]) { --ui-icon-radius: 13px; }

  :host([spin]) .glyph {
    animation: spin var(--ui-icon-rotate-duration) linear infinite;
  }

  :host([pulse]) .icon {
    animation: pulse var(--ui-icon-pulse-duration) ease-in-out infinite;
  }

  :host(:not([headless])) .icon:hover {
    transform: translateY(-0.5px);
    box-shadow: 0 3px 12px rgba(2, 6, 23, 0.14);
  }

  :host([headless]) .icon {
    display: none;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
  }

  @media (prefers-reduced-motion: reduce) {
    .icon,
    .glyph {
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-icon-border: 2px solid color-mix(in srgb, currentColor 48%, transparent);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-icon-color: CanvasText;
      --ui-icon-bg: Canvas;
      --ui-icon-border: 1px solid CanvasText;
      --ui-icon-shadow: none;
    }

    .icon,
    .fallback {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }

    .badge {
      background: Highlight;
      border-color: Canvas;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeSize(size: string | null): string | null {
  if (!size) return null;
  const value = size.trim();
  if (!value) return null;
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
  return value;
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export class UIIcon extends ElementBase {
  static get observedAttributes() {
    return [
      'name',
      'size',
      'color',
      'variant',
      'icon-variant',
      'secondary-color',
      'tone',
      'shape',
      'spin',
      'pulse',
      'badge',
      'label',
      'decorative',
      'stroke-width',
      'absolute-stroke-width',
      'stroke-linecap',
      'stroke-linejoin',
      'rotate',
      'flip',
      'rtl',
      'headless'
    ];
  }

  private _lastName = '';

  constructor() {
    super();
  }

  private _syncDynamicVars(): void {
    const size = normalizeSize(this.getAttribute('size'));
    if (size) this.style.setProperty('--ui-icon-size', size);
    else this.style.removeProperty('--ui-icon-size');

    const color = this.getAttribute('color');
    if (color) this.style.setProperty('--ui-icon-color', color);
    else this.style.removeProperty('--ui-icon-color');

    const strokeWidth = this.getAttribute('stroke-width');
    if (strokeWidth) this.style.setProperty('--ui-icon-stroke-width', strokeWidth);
    else this.style.removeProperty('--ui-icon-stroke-width');
  }

  protected override render(): void {
    this._syncDynamicVars();

    if (this.hasAttribute('headless')) {
      this.setContent('<style></style><slot></slot>');
      return;
    }

    const name = this.getAttribute('name') || '';
    const customLabel = this.getAttribute('label') || '';
    const decorative = this.hasAttribute('decorative');
    const iconMarkup = name
      ? getIcon(name, {
          variant: (this.getAttribute('icon-variant') as 'outline' | 'solid' | 'duotone' | null) || undefined,
          secondaryColor: this.getAttribute('secondary-color') || undefined,
          strokeWidth: parseNumber(this.getAttribute('stroke-width')),
          absoluteStrokeWidth: this.hasAttribute('absolute-stroke-width'),
          strokeLinecap: (this.getAttribute('stroke-linecap') as 'butt' | 'round' | 'square' | null) || undefined,
          strokeLinejoin: (this.getAttribute('stroke-linejoin') as 'miter' | 'round' | 'bevel' | null) || undefined,
          rotate: parseNumber(this.getAttribute('rotate')),
          flip: (this.getAttribute('flip') as 'horizontal' | 'vertical' | 'both' | null) || undefined,
          rtl: this.hasAttribute('rtl')
        })
      : '';
    const hasIcon = !!iconMarkup;

    const ariaAttrs = decorative
      ? 'aria-hidden="true" role="presentation"'
      : `role="img" aria-label="${escapeHtml(customLabel || name || 'icon')}"`;

    this.setContent(`
      <style>${style}</style>
      <span class="icon" part="icon" ${ariaAttrs}>
        <span class="glyph" part="glyph">
          ${hasIcon ? iconMarkup : `<span class="fallback" part="fallback">${escapeHtml((name || '?').slice(0, 1).toUpperCase())}</span>`}
          ${!hasIcon ? '<slot></slot>' : ''}
        </span>
        ${this.hasAttribute('badge') ? '<span class="badge" part="badge" aria-hidden="true"></span>' : ''}
      </span>
    `);

    if (name !== this._lastName) {
      this.dispatchEvent(
        new CustomEvent('iconchange', {
          detail: { name, found: hasIcon },
          bubbles: true
        })
      );
      this._lastName = name;
    }
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-icon')) {
  customElements.define('ui-icon', UIIcon);
}
