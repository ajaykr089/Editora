import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-block;
    --ui-avatar-size: 38px;
    --ui-avatar-radius: 50%;
    --ui-avatar-bg: linear-gradient(145deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 16%, #ffffff), color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, var(--ui-color-surface, #ffffff)));
    --ui-avatar-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 78%, var(--ui-color-text, #0f172a) 22%);
    --ui-avatar-border: 1px solid var(--ui-color-border, rgba(15, 23, 42, 0.14));
    --ui-avatar-ring: 0 0 0 0 transparent, 0 6px 18px rgba(15, 23, 42, 0.14);
    --ui-avatar-font-size: 13px;
    --ui-avatar-font-weight: 650;
    --ui-avatar-status-size: 10px;
    --ui-avatar-status-border: 2px solid var(--ui-color-surface, #ffffff);
    --ui-avatar-transition: 170ms cubic-bezier(0.2, 0.8, 0.2, 1);
    color-scheme: light dark;
  }

  .avatar {
    position: relative;
    box-sizing: border-box;
    width: var(--ui-avatar-size);
    height: var(--ui-avatar-size);
    border-radius: var(--ui-avatar-radius);
    border: var(--ui-avatar-border);
    background: var(--ui-avatar-bg);
    color: var(--ui-avatar-color);
    box-shadow: var(--ui-avatar-ring);
    overflow: hidden;
    user-select: none;
    display: grid;
    place-items: center;
    transition: border-color var(--ui-avatar-transition), box-shadow var(--ui-avatar-transition), transform var(--ui-avatar-transition);
  }

  :host([ring]) .avatar {
    --ui-avatar-ring: 0 0 0 3px color-mix(in srgb, var(--ui-color-primary, #2563eb) 24%, transparent), 0 10px 24px color-mix(in srgb, var(--ui-color-primary, #2563eb) 20%, rgba(15, 23, 42, 0.2));
  }

  .avatar:hover {
    transform: translateY(-1px);
  }

  :host([shape="rounded"]) .avatar {
    --ui-avatar-radius: 14px;
  }

  :host([shape="square"]) .avatar {
    --ui-avatar-radius: 8px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: var(--ui-avatar-radius);
  }

  .fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: var(--ui-avatar-bg);
    color: var(--ui-avatar-color);
    font-size: var(--ui-avatar-font-size);
    font-weight: var(--ui-avatar-font-weight);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .fallback[hidden] {
    display: none;
  }

  .status {
    position: absolute;
    inset-inline-end: 0;
    inset-block-end: 0;
    transform: translate(12%, 12%);
    width: var(--ui-avatar-status-size);
    height: var(--ui-avatar-status-size);
    border-radius: 50%;
    border: var(--ui-avatar-status-border);
    background: var(--ui-avatar-status-color, var(--ui-color-success, #16a34a));
    box-sizing: border-box;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-avatar-status-color, #16a34a) 28%, transparent);
  }

  :host([status="offline"]) .status {
    --ui-avatar-status-color: var(--ui-color-muted, #94a3b8);
  }

  :host([status="busy"]) .status {
    --ui-avatar-status-color: var(--ui-color-danger, #dc2626);
  }

  :host([status="away"]) .status {
    --ui-avatar-status-color: var(--ui-color-warning, #f59e0b);
  }

  :host([headless]) .avatar {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .avatar {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-avatar-border: 2px solid currentColor;
      --ui-avatar-ring: none;
      --ui-avatar-status-border: 2px solid Canvas;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-avatar-bg: Canvas;
      --ui-avatar-color: CanvasText;
      --ui-avatar-border: 1px solid CanvasText;
      --ui-avatar-status-border: 1px solid Canvas;
    }
    .status {
      --ui-avatar-status-color: Highlight;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function deriveInitials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

function normalizeSize(raw: string | null): string {
  if (!raw) return '';
  const value = raw.trim().toLowerCase();
  if (!value) return '';
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
  if (value === 'xs') return '24px';
  if (value === 'sm') return '30px';
  if (value === 'md') return '36px';
  if (value === 'lg') return '44px';
  if (value === 'xl') return '56px';
  return raw;
}

function toLoading(raw: string | null): 'lazy' | 'eager' {
  if (raw === 'eager') return 'eager';
  if (raw === 'lazy') return 'lazy';
  if (!raw) return 'lazy';
  const value = raw.toLowerCase();
  return value === 'true' || value === '1' ? 'eager' : 'lazy';
}

export class UIAvatar extends ElementBase {
  static get observedAttributes() {
    return [
      'src',
      'alt',
      'initials',
      'size',
      'bg',
      'color',
      'radius',
      'fontweight',
      'shape',
      'status',
      'ring',
      'loading',
      'headless',
    ];
  }

  private _img: HTMLImageElement | null = null;
  private _imgLoaded = false;
  private _imgFailed = false;

  constructor() {
    super();
    this._onImageLoad = this._onImageLoad.bind(this);
    this._onImageError = this._onImageError.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'img');
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'src' && oldValue !== newValue) {
      this._imgLoaded = false;
      this._imgFailed = false;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  disconnectedCallback() {
    this._detachImageListeners();
    super.disconnectedCallback();
  }

  private _onImageLoad() {
    this._imgLoaded = true;
    this._imgFailed = false;
    this.requestRender();
    this.dispatchEvent(new CustomEvent('load', { detail: { src: this.getAttribute('src') || '' }, bubbles: true }));
  }

  private _onImageError() {
    this._imgLoaded = false;
    this._imgFailed = true;
    this.requestRender();
    this.dispatchEvent(new CustomEvent('error', { detail: { src: this.getAttribute('src') || '' }, bubbles: true }));
  }

  private _detachImageListeners() {
    if (!this._img) return;
    this._img.removeEventListener('load', this._onImageLoad);
    this._img.removeEventListener('error', this._onImageError);
    this._img = null;
  }

  protected render() {
    const src = this.getAttribute('src') || '';
    const alt = this.getAttribute('alt') || '';
    const initials = this.getAttribute('initials') || '';
    const fallbackSlot = (this.textContent || '').trim();

    const fallback = initials.trim()
      ? initials.trim().slice(0, 2).toUpperCase()
      : alt.trim()
        ? deriveInitials(alt)
        : fallbackSlot
          ? deriveInitials(fallbackSlot)
          : '?';

    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', alt.trim() || fallback);
    }

    let vars = '';
    const normalizedSize = normalizeSize(this.getAttribute('size'));
    if (normalizedSize) vars += `--ui-avatar-size:${normalizedSize};`;
    const bg = this.getAttribute('bg');
    const color = this.getAttribute('color');
    const radius = this.getAttribute('radius');
    const fontWeight = this.getAttribute('fontweight');
    if (bg) vars += `--ui-avatar-bg:${bg};`;
    if (color) vars += `--ui-avatar-color:${color};`;
    if (radius) vars += `--ui-avatar-radius:${radius};`;
    if (fontWeight) vars += `--ui-avatar-font-weight:${fontWeight};`;

    const showImage = Boolean(src) && !this._imgFailed;
    const showFallback = !showImage || !this._imgLoaded;
    const loading = toLoading(this.getAttribute('loading'));
    const showStatus = this.hasAttribute('status');

    this._detachImageListeners();
    this.setContent(`
      <style>${style}</style>
      <div class="avatar" part="base" style="${vars}">
        ${showImage ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="${loading}" />` : ''}
        <span class="fallback" part="fallback" ${showFallback ? '' : 'hidden'}>
          <slot>${escapeHtml(fallback)}</slot>
        </span>
        ${showStatus ? '<span class="status" part="status" aria-hidden="true"></span>' : ''}
      </div>
    `);

    this._img = this.root.querySelector('img');
    if (!this._img) return;
    this._img.addEventListener('load', this._onImageLoad);
    this._img.addEventListener('error', this._onImageError);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-avatar')) {
  customElements.define('ui-avatar', UIAvatar);
}
