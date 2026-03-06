import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    width: 100%;
    --ui-aspect-radius: 16px;
    --ui-aspect-border: 1px solid color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.14)) 84%, transparent);
    --ui-aspect-bg: linear-gradient(
      160deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent) 0%,
      color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 44%, var(--ui-color-surface, #ffffff)) 100%
    );
    --ui-aspect-color: var(--ui-color-text, #0f172a);
    --ui-aspect-muted: var(--ui-color-muted, #64748b);
    --ui-aspect-accent: var(--ui-color-primary, #2563eb);
    --ui-aspect-empty-bg: color-mix(in srgb, var(--ui-aspect-accent) 9%, transparent);
    --ui-aspect-shadow: 0 1px 2px rgba(15, 23, 42, 0.06), 0 18px 34px rgba(15, 23, 42, 0.1);
    --ui-aspect-fit: cover;
    --ui-aspect-transition: 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
    --ui-aspect-highlight: color-mix(in srgb, var(--ui-aspect-accent) 28%, transparent);
    color-scheme: light dark;
  }

  :host([tone='info']) {
    --ui-aspect-accent: var(--ui-color-primary, #2563eb);
  }

  :host([tone='success']) {
    --ui-aspect-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone='warning']) {
    --ui-aspect-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone='danger']) {
    --ui-aspect-accent: var(--ui-color-danger, #dc2626);
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
    transition:
      padding-bottom var(--ui-aspect-transition),
      border-color var(--ui-aspect-transition),
      box-shadow var(--ui-aspect-transition),
      transform var(--ui-aspect-transition);
  }

  .surface {
    position: absolute;
    inset: 0;
  }

  .surface::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, var(--ui-aspect-highlight) 70%, transparent), transparent 58%),
      linear-gradient(180deg, color-mix(in srgb, #ffffff 36%, transparent), transparent 28%);
    opacity: 0.9;
  }

  .surface::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 70%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--ui-aspect-accent) 10%, transparent);
  }

  .content {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }

  .empty {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
    background:
      linear-gradient(145deg, color-mix(in srgb, var(--ui-aspect-empty-bg) 72%, transparent), transparent 58%),
      repeating-linear-gradient(
        45deg,
        color-mix(in srgb, var(--ui-aspect-accent) 6%, transparent) 0px,
        color-mix(in srgb, var(--ui-aspect-accent) 6%, transparent) 8px,
        transparent 8px,
        transparent 16px
      );
  }

  .empty-shell {
    display: grid;
    gap: 8px;
    justify-items: center;
    text-align: center;
    color: var(--ui-aspect-color);
  }

  .empty-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--ui-aspect-accent) 14%, transparent);
    color: color-mix(in srgb, var(--ui-aspect-accent) 80%, var(--ui-aspect-color) 20%);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-aspect-accent) 24%, transparent);
  }

  .empty-icon svg {
    width: 16px;
    height: 16px;
  }

  .empty-title {
    font-size: 13px;
    font-weight: 650;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }

  .empty-subtitle {
    font-size: 12px;
    color: var(--ui-aspect-muted);
    line-height: 1.3;
  }

  .badge {
    position: absolute;
    top: 10px;
    inset-inline-end: 10px;
    border-radius: 999px;
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    line-height: 1.2;
    color: color-mix(in srgb, var(--ui-aspect-accent) 82%, var(--ui-aspect-color) 18%);
    background: color-mix(in srgb, var(--ui-aspect-accent) 14%, var(--ui-color-surface, #ffffff));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-aspect-accent) 24%, transparent);
    pointer-events: none;
  }

  .badge[hidden] {
    display: none;
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

  :host([interactive]) .frame {
    cursor: pointer;
  }

  :host([interactive]):hover .frame {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(15, 23, 42, 0.08), 0 22px 42px rgba(15, 23, 42, 0.14);
    border-color: color-mix(in srgb, var(--ui-aspect-accent) 34%, var(--ui-color-border, rgba(15, 23, 42, 0.14)));
  }

  :host([headless]) .frame {
    display: none;
  }

  @media (max-width: 720px) {
    :host {
      --ui-aspect-radius: 14px;
    }
    .badge {
      top: 8px;
      inset-inline-end: 8px;
    }
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
    .badge {
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
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

function normalizeTone(raw: string | null): string {
  const value = (raw || '').trim().toLowerCase();
  if (value === 'info') return 'info';
  if (value === 'success') return 'success';
  if (value === 'warning') return 'warning';
  if (value === 'danger') return 'danger';
  return 'neutral';
}

export class UIAspectRatio extends ElementBase {
  static get observedAttributes() {
    return ['ratio', 'fit', 'tone', 'interactive', 'show-ratio-badge', 'headless'];
  }

  private _resizeObserver: ResizeObserver | null = null;
  private _contentObserver: MutationObserver | null = null;
  private _lastSignature = '';

  constructor() {
    super();
    this._onResize = this._onResize.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._observeResize();
    this._observeContent();
  }

  disconnectedCallback() {
    this._unobserveResize();
    this._unobserveContent();
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
    if (typeof window === 'undefined') return;
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

  private _observeContent() {
    if (this._contentObserver || typeof MutationObserver === 'undefined') return;
    this._contentObserver = new MutationObserver(() => this.requestRender());
    this._contentObserver.observe(this, {
      childList: true,
      subtree: false,
    });
  }

  private _unobserveContent() {
    if (!this._contentObserver) return;
    this._contentObserver.disconnect();
    this._contentObserver = null;
  }

  protected render() {
    const ratio = parseRatio(this.getAttribute('ratio'));
    const fit = normalizeFit(this.getAttribute('fit'));
    const tone = normalizeTone(this.getAttribute('tone'));
    const showBadge = this.hasAttribute('show-ratio-badge');
    const hasContent = this.children.length > 0;

    this.setContent(`
      <style>${style}</style>
      <div class="frame" part="frame" style="--ui-aspect-padding:${ratio.padding}%;--ui-aspect-fit:${fit};" data-tone="${tone}">
        <div class="surface" part="surface">
          <div class="content" part="content">
            <slot></slot>
          </div>
          ${hasContent
            ? ''
            : `<div class="empty" part="empty" aria-hidden="true">
                <div class="empty-shell">
                  <span class="empty-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3.8" y="5.4" width="12.4" height="9.2" rx="1.8"></rect>
                      <path d="m7.1 11.2 2.2-2.3 3.5 3.8"></path>
                    </svg>
                  </span>
                  <span class="empty-title">Aspect Ratio Surface</span>
                  <span class="empty-subtitle">${ratio.text} / fit: ${fit}</span>
                </div>
              </div>`}
          <span class="badge" part="badge" ${showBadge ? '' : 'hidden'}>${ratio.text}</span>
        </div>
      </div>
    `);

    const signature = `${ratio.text}|${fit}|${tone}|${hasContent ? '1' : '0'}`;
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
          tone,
          hasContent,
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
