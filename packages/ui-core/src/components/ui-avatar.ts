import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-block;
    --ui-avatar-size: 40px;
    --ui-avatar-radius: 50%;
    --ui-avatar-bg: linear-gradient(
      145deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, var(--ui-color-primary, #2563eb) 8%),
      color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 62%, var(--ui-color-primary, #2563eb) 12%)
    );
    --ui-avatar-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 78%, var(--ui-color-text, #0f172a) 22%);
    --ui-avatar-muted: var(--ui-color-muted, #64748b);
    --ui-avatar-border: 1px solid color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.14)) 82%, transparent);
    --ui-avatar-ring: 0 1px 2px rgba(15, 23, 42, 0.06), 0 12px 24px rgba(15, 23, 42, 0.12);
    --ui-avatar-font-size: 12px;
    --ui-avatar-font-weight: 650;
    --ui-avatar-status-size: 11px;
    --ui-avatar-status-border: 2px solid var(--ui-color-surface, #ffffff);
    --ui-avatar-transition: 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
    --ui-avatar-accent: var(--ui-color-primary, #2563eb);
    --ui-avatar-badge-bg: color-mix(in srgb, var(--ui-avatar-accent) 14%, var(--ui-color-surface, #ffffff));
    --ui-avatar-badge-color: color-mix(in srgb, var(--ui-avatar-accent) 82%, var(--ui-color-text, #0f172a) 18%);
    color-scheme: light dark;
  }

  :host([tone="info"]) {
    --ui-avatar-accent: var(--ui-color-primary, #2563eb);
  }

  :host([tone="success"]) {
    --ui-avatar-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-avatar-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-avatar-accent: var(--ui-color-danger, #dc2626);
  }

  :host([variant="solid"]) {
    --ui-avatar-bg: var(--ui-avatar-accent);
    --ui-avatar-color: #ffffff;
  }

  :host([variant="outline"]) {
    --ui-avatar-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 88%, transparent);
    --ui-avatar-border: 1px solid color-mix(in srgb, var(--ui-avatar-accent) 45%, var(--ui-color-border, rgba(15, 23, 42, 0.14)));
    --ui-avatar-color: color-mix(in srgb, var(--ui-avatar-accent) 82%, var(--ui-color-text, #0f172a) 18%);
    --ui-avatar-ring: none;
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
    overflow: visible;
    user-select: none;
    display: grid;
    place-items: center;
    transition: border-color var(--ui-avatar-transition), box-shadow var(--ui-avatar-transition), transform var(--ui-avatar-transition);
  }

  .avatar::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(95% 70% at 100% 0%, color-mix(in srgb, var(--ui-avatar-accent) 18%, transparent), transparent 58%),
      linear-gradient(180deg, color-mix(in srgb, #ffffff 34%, transparent), transparent 32%);
    border-radius: var(--ui-avatar-radius);
  }

  :host([ring]) .avatar {
    --ui-avatar-ring: 0 0 0 3px color-mix(in srgb, var(--ui-avatar-accent) 24%, transparent), 0 10px 24px color-mix(in srgb, var(--ui-avatar-accent) 20%, rgba(15, 23, 42, 0.2));
  }

  :host([interactive]) .avatar {
    cursor: pointer;
  }

  :host([interactive]):focus-visible {
    outline: none;
  }

  :host([interactive]):focus-visible .avatar {
    border-color: color-mix(in srgb, var(--ui-avatar-accent) 52%, var(--ui-color-border, rgba(15, 23, 42, 0.14)));
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-avatar-accent) 26%, transparent),
      0 10px 26px color-mix(in srgb, var(--ui-avatar-accent) 20%, rgba(15, 23, 42, 0.18));
  }

  :host([interactive]):hover .avatar {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--ui-avatar-accent) 32%, var(--ui-color-border, rgba(15, 23, 42, 0.14)));
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.08), 0 16px 30px rgba(15, 23, 42, 0.16);
  }

  :host([interactive]:active:not([disabled])) .avatar {
    transform: translateY(0) scale(0.985);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08), 0 8px 18px rgba(15, 23, 42, 0.14);
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) .avatar {
    opacity: 0.58;
    filter: saturate(0.78);
    box-shadow: none;
    cursor: not-allowed;
  }

  :host([state="loading"]) .avatar {
    border-color: color-mix(in srgb, var(--ui-avatar-accent) 46%, var(--ui-color-border, rgba(15, 23, 42, 0.14)));
  }

  :host([state="loading"]) .avatar::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: var(--ui-avatar-radius);
    border: 2px solid color-mix(in srgb, var(--ui-avatar-accent) 16%, transparent);
    border-top-color: color-mix(in srgb, var(--ui-avatar-accent) 86%, #0f172a);
    animation: ui-avatar-spin 900ms linear infinite;
    pointer-events: none;
  }

  :host([state="loading"]) img,
  :host([state="loading"]) .fallback,
  :host([state="loading"]) .overlay,
  :host([state="loading"]) .status,
  :host([state="loading"]) .badge {
    opacity: 0.52;
  }

  :host([state="error"]) {
    --ui-avatar-accent: var(--ui-color-danger, #dc2626);
  }

  :host([state="error"]) .avatar {
    border-color: color-mix(in srgb, var(--ui-avatar-accent) 44%, var(--ui-color-border, rgba(15, 23, 42, 0.14)));
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-avatar-accent) 18%, transparent), 0 12px 24px rgba(15, 23, 42, 0.12);
  }

  :host([state="success"]) {
    --ui-avatar-accent: var(--ui-color-success, #16a34a);
  }

  :host([state="success"]) .avatar {
    border-color: color-mix(in srgb, var(--ui-avatar-accent) 46%, var(--ui-color-border, rgba(15, 23, 42, 0.14)));
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-avatar-accent) 20%, transparent), 0 12px 24px rgba(15, 23, 42, 0.12);
  }

  :host([shape="rounded"]) .avatar {
    --ui-avatar-radius: 12px;
  }

  :host([shape="square"]) .avatar {
    --ui-avatar-radius: 10px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: var(--ui-avatar-radius);
  }

  .overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-avatar-accent) 10%, transparent);
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
    border-radius: var(--ui-avatar-radius);
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
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-avatar-status-color, #16a34a) 28%, transparent), 0 0 0 1px color-mix(in srgb, #000000 10%, transparent);
  }

  :host([status="online"]) .status::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--ui-avatar-status-color, #16a34a) 34%, transparent);
    opacity: 0.64;
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

  .badge {
    position: absolute;
    inset-inline-end: -4px;
    inset-block-start: -4px;
    min-width: 16px;
    height: 16px;
    border-radius: 999px;
    padding: 0 4px;
    font-size: 10px;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
    background: var(--ui-avatar-badge-bg);
    color: var(--ui-avatar-badge-color);
    border: 1px solid color-mix(in srgb, var(--ui-avatar-accent) 28%, transparent);
    box-shadow: 0 1px 4px rgba(15, 23, 42, 0.18);
    pointer-events: none;
  }

  .badge[hidden] {
    display: none;
  }

  :host([headless]) .avatar {
    display: none;
  }

  @keyframes ui-avatar-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .avatar,
    .status {
      transition: none !important;
    }
    :host([state="loading"]) .avatar::after {
      animation: none;
    }
    :host([status="online"]) .status::after {
      display: none;
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
    .badge {
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
  }
`;

function escapeHtml(value: string): string {
  return String(value)
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
  if (value === '2xl') return '64px';
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
      'tone',
      'variant',
      'status',
      'badge',
      'ring',
      'interactive',
      'disabled',
      'state',
      'loading',
      'headless',
    ];
  }

  private _img: HTMLImageElement | null = null;
  private _imgLoaded = false;
  private _imgFailed = false;
  private _managedRole = false;
  private _managedTabIndex = false;
  private _managedAriaDisabled = false;
  private _managedAriaBusy = false;

  constructor() {
    super();
    this._onImageLoad = this._onImageLoad.bind(this);
    this._onImageError = this._onImageError.bind(this);
    this._onInteractiveKeyDown = this._onInteractiveKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'img');
      this._managedRole = true;
    }
    this.addEventListener('keydown', this._onInteractiveKeyDown);
    this._syncInteractiveA11y();
    this._syncBusyState();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'src' && oldValue !== newValue) {
      this._imgLoaded = false;
      this._imgFailed = false;
    }
    if (name === 'interactive' || name === 'disabled') {
      this._syncInteractiveA11y();
    }
    if (name === 'state') {
      this._syncBusyState();
    }
    if (this.isConnected) this.requestRender();
  }

  disconnectedCallback() {
    this._detachImageListeners();
    this.removeEventListener('keydown', this._onInteractiveKeyDown);
    super.disconnectedCallback();
  }

  private _syncInteractiveA11y() {
    const interactive = this.hasAttribute('interactive');
    const disabled = this.hasAttribute('disabled');

    if (interactive) {
      if (this._managedRole || this.getAttribute('role') === 'img' || !this.hasAttribute('role')) {
        this.setAttribute('role', 'button');
        this._managedRole = true;
      }
      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', disabled ? '-1' : '0');
        this._managedTabIndex = true;
      } else if (this._managedTabIndex) {
        this.setAttribute('tabindex', disabled ? '-1' : '0');
      }
      if (!this.hasAttribute('aria-disabled') || this._managedAriaDisabled) {
        this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
        this._managedAriaDisabled = true;
      }
      return;
    }

    if (this._managedRole) this.setAttribute('role', 'img');
    if (this._managedTabIndex) {
      this.removeAttribute('tabindex');
      this._managedTabIndex = false;
    }
    if (this._managedAriaDisabled) {
      this.removeAttribute('aria-disabled');
      this._managedAriaDisabled = false;
    }
  }

  private _syncBusyState() {
    const busy = this.getAttribute('state') === 'loading';
    if (busy) {
      if (!this.hasAttribute('aria-busy') || this._managedAriaBusy) {
        this.setAttribute('aria-busy', 'true');
        this._managedAriaBusy = true;
      }
      return;
    }
    if (this._managedAriaBusy) {
      this.removeAttribute('aria-busy');
      this._managedAriaBusy = false;
    }
  }

  private _onInteractiveKeyDown(event: KeyboardEvent) {
    if (!this.hasAttribute('interactive') || this.hasAttribute('disabled')) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.click();
  }

  private _onImageLoad() {
    if (this._imgLoaded && !this._imgFailed) return;
    this._imgLoaded = true;
    this._imgFailed = false;
    this.requestRender();
    const detail = { src: this.getAttribute('src') || '' };
    this.dispatchEvent(new CustomEvent('avatar-load', { detail, bubbles: true }));
    this.dispatchEvent(new CustomEvent('load', { detail, bubbles: true }));
  }

  private _onImageError() {
    if (this._imgFailed) return;
    this._imgLoaded = false;
    this._imgFailed = true;
    this.requestRender();
    const detail = { src: this.getAttribute('src') || '' };
    this.dispatchEvent(new CustomEvent('avatar-error', { detail, bubbles: true }));
    this.dispatchEvent(new CustomEvent('error', { detail, bubbles: true }));
  }

  private _detachImageListeners() {
    if (!this._img) return;
    this._img.removeEventListener('load', this._onImageLoad);
    this._img.removeEventListener('error', this._onImageError);
    this._img = null;
  }

  protected render() {
    this._syncBusyState();

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
    const badgeText = (this.getAttribute('badge') || '').trim();

    this._detachImageListeners();
    this.setContent(`
      <style>${style}</style>
      <div class="avatar" part="base" style="${vars}">
        ${showImage ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="${loading}" />` : ''}
        <span class="overlay" part="overlay" aria-hidden="true"></span>
        <span class="fallback" part="fallback" ${showFallback ? '' : 'hidden'}>
          <slot>${escapeHtml(fallback)}</slot>
        </span>
        ${showStatus ? '<span class="status" part="status" aria-hidden="true"></span>' : ''}
        <span class="badge" part="badge" ${badgeText ? '' : 'hidden'}>${escapeHtml(badgeText)}</span>
      </div>
    `);

    this._img = this.root.querySelector('img');
    if (!this._img) return;
    this._img.addEventListener('load', this._onImageLoad);
    this._img.addEventListener('error', this._onImageError);

    if (this._img.complete) {
      if (this._img.naturalWidth > 0) this._onImageLoad();
      else this._onImageError();
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-avatar')) {
  customElements.define('ui-avatar', UIAvatar);
}
