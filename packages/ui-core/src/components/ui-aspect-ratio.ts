import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    width: 100%;
    --ui-aspect-radius: 18px;
    --ui-aspect-border: 1px solid var(--ui-color-border, rgba(15, 23, 42, 0.14));
    --ui-aspect-bg: linear-gradient(160deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 8%, #ffffff), var(--ui-color-surface-alt, #f8fafc));
    --ui-aspect-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
    --ui-aspect-fit: cover;
    --ui-aspect-transition: 170ms cubic-bezier(0.2, 0.8, 0.2, 1);
    --ui-aspect-highlight: color-mix(in srgb, var(--ui-color-primary, #2563eb) 28%, transparent);
    color-scheme: light dark;
  }

  .frame {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: var(--ui-aspect-padding, 56.25%);
    border-radius: var(--ui-aspect-radius);
    border: var(--ui-aspect-border);
    background: var(--ui-aspect-bg);
    box-shadow: var(--ui-aspect-shadow);
    overflow: hidden;
    transition: padding-bottom var(--ui-aspect-transition), border-color var(--ui-aspect-transition), box-shadow var(--ui-aspect-transition);
  }

  .frame::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, var(--ui-aspect-highlight) 70%, transparent), transparent 55%);
    opacity: 0.9;
  }

  .frame::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 70%, transparent);
  }

  .content {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }

  ::slotted(img),
  ::slotted(video),
  ::slotted(iframe),
  ::slotted(canvas),
  ::slotted(svg) {
    width: 100%;
    height: 100%;
    object-fit: var(--ui-aspect-fit);
    display: block;
  }

  :host([headless]) .frame {
    display: none;
  }

  :host(:hover) .frame {
    box-shadow: 0 20px 44px rgba(15, 23, 42, 0.16);
  }

  @media (prefers-reduced-motion: reduce) {
    .frame {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-aspect-border: 2px solid var(--ui-color-border, currentColor);
      --ui-aspect-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-aspect-bg: Canvas;
      --ui-aspect-border: 1px solid CanvasText;
    }
  }
`;

type RatioInfo = {
  width: number;
  height: number;
  ratio: number;
  padding: number;
  text: string;
};

function parseRatio(raw: string | null): RatioInfo {
  const fallback = { width: 16, height: 9, ratio: 16 / 9, padding: 56.25, text: '16/9' };
  if (!raw) return fallback;

  const source = raw.trim();
  if (!source) return fallback;

  const parts = source.includes('/') ? source.split('/') : source.includes(':') ? source.split(':') : [];
  if (parts.length === 2) {
    const width = Number(parts[0]);
    const height = Number(parts[1]);
    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      return {
        width,
        height,
        ratio: width / height,
        padding: (height / width) * 100,
        text: `${width}/${height}`,
      };
    }
    return fallback;
  }

  const numeric = Number(source);
  if (!Number.isFinite(numeric) || numeric <= 0) return fallback;
  return {
    width: numeric,
    height: 1,
    ratio: numeric,
    padding: (1 / numeric) * 100,
    text: `${numeric}/1`,
  };
}

function normalizeFit(raw: string | null): string {
  const value = (raw || '').trim().toLowerCase();
  if (value === 'contain') return 'contain';
  if (value === 'fill') return 'fill';
  if (value === 'none') return 'none';
  if (value === 'scale-down') return 'scale-down';
  return 'cover';
}

export class UIAspectRatio extends ElementBase {
  static get observedAttributes() {
    return ['ratio', 'fit', 'headless'];
  }

  private _resizeObserver: ResizeObserver | null = null;
  private _lastSignature = '';

  constructor() {
    super();
    this._onResize = this._onResize.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._observeResize();
  }

  disconnectedCallback() {
    this._unobserveResize();
    super.disconnectedCallback();
  }

  get headless() {
    return this.hasAttribute('headless');
  }

  set headless(value: boolean) {
    if (value === this.headless) return;
    if (value) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  private _observeResize() {
    if (this._resizeObserver || !window.ResizeObserver) return;
    this._resizeObserver = new ResizeObserver(this._onResize);
    this._resizeObserver.observe(this);
  }

  private _unobserveResize() {
    if (!this._resizeObserver) return;
    this._resizeObserver.disconnect();
    this._resizeObserver = null;
  }

  private _onResize() {
    const rect = this.getBoundingClientRect();
    this.dispatchEvent(
      new CustomEvent('resize', {
        detail: { width: rect.width, height: rect.height },
        bubbles: true,
      })
    );
  }

  protected render() {
    const ratio = parseRatio(this.getAttribute('ratio'));
    const fit = normalizeFit(this.getAttribute('fit'));

    this.setContent(`
      <style>${style}</style>
      <div class="frame" part="frame" style="--ui-aspect-padding:${ratio.padding}%;--ui-aspect-fit:${fit};">
        <div class="content" part="content">
          <slot></slot>
        </div>
      </div>
    `);

    const signature = `${ratio.text}|${fit}`;
    if (signature === this._lastSignature) return;
    this._lastSignature = signature;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          ratio: ratio.ratio,
          ratioText: ratio.text,
          width: ratio.width,
          height: ratio.height,
          padding: ratio.padding,
          fit,
        },
        bubbles: true,
      })
    );
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-aspect-ratio')) {
  customElements.define('ui-aspect-ratio', UIAspectRatio);
}
