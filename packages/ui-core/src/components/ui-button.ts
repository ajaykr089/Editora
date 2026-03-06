import { ElementBase } from '../ElementBase';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonAnimation = 'scale' | 'pulse' | 'none';
type ButtonTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type ButtonState = 'idle' | 'loading' | 'error' | 'success';
type ButtonType = 'button' | 'submit' | 'reset';

const style = `
  :host {
    --ui-btn-radius: 10px;
    --ui-btn-min-height: 40px;
    --ui-btn-padding-inline: 14px;
    --ui-btn-gap: 8px;
    --ui-btn-font-size: 14px;
    --ui-btn-font-weight: 600;
    --ui-btn-letter-spacing: -0.01em;
    --ui-btn-duration: 160ms;
    --ui-btn-easing: cubic-bezier(0.2, 0.8, 0.2, 1);

    --ui-btn-accent: var(--ui-color-primary, #2563eb);
    --ui-btn-accent-strong: color-mix(in srgb, var(--ui-btn-accent) 82%, #0f172a 18%);
    --ui-btn-accent-soft: color-mix(in srgb, var(--ui-btn-accent) 10%, var(--ui-color-surface, #ffffff));

    --ui-btn-surface: var(--ui-color-surface, #ffffff);
    --ui-btn-surface-alt: var(--ui-color-surface-alt, #f8fafc);
    --ui-btn-text: var(--ui-color-text, #0f172a);
    --ui-btn-muted: var(--ui-color-muted, #64748b);
    --ui-btn-ring: var(--ui-color-focus-ring, #2563eb);

    display: inline-flex;
    vertical-align: middle;
    box-sizing: border-box;
    color-scheme: light dark;
  }

  :host([block]) {
    display: flex;
    inline-size: 100%;
  }

  :host([tone="neutral"]) {
    --ui-btn-accent: color-mix(in srgb, var(--ui-color-muted, #64748b) 74%, var(--ui-color-text, #0f172a) 26%);
  }

  :host([tone="info"]) {
    --ui-btn-accent: var(--ui-color-primary, #2563eb);
  }

  :host([tone="success"]) {
    --ui-btn-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-btn-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-btn-accent: var(--ui-color-danger, #dc2626);
  }

  :host([state="error"]) {
    --ui-btn-accent: var(--ui-color-danger, #dc2626);
  }

  :host([state="success"]) {
    --ui-btn-accent: var(--ui-color-success, #16a34a);
  }

  :host([theme="dark"]) {
    --ui-btn-surface: color-mix(in srgb, var(--ui-color-surface, #0f172a) 88%, #020617 12%);
    --ui-btn-surface-alt: color-mix(in srgb, var(--ui-btn-surface) 86%, #111827 14%);
    --ui-btn-text: var(--ui-color-text, #e2e8f0);
    --ui-btn-muted: var(--ui-color-muted, #94a3b8);
  }

  :host([theme="brand"]) {
    --ui-btn-accent: color-mix(in srgb, var(--ui-color-primary, #2563eb) 78%, #0ea5e9 22%);
  }

  .btn {
    position: relative;
    isolation: isolate;
    box-sizing: border-box;
    inline-size: auto;
    min-block-size: var(--ui-btn-min-height);
    padding-inline: var(--ui-btn-padding-inline);
    border-radius: var(--ui-btn-radius);
    border: 1px solid transparent;
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
    font: inherit;
    font-size: var(--ui-btn-font-size);
    font-weight: var(--ui-btn-font-weight);
    letter-spacing: var(--ui-btn-letter-spacing);
    line-height: 1.2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ui-btn-gap);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition:
      transform var(--ui-btn-duration) var(--ui-btn-easing),
      box-shadow var(--ui-btn-duration) var(--ui-btn-easing),
      background-color var(--ui-btn-duration) var(--ui-btn-easing),
      color var(--ui-btn-duration) var(--ui-btn-easing),
      border-color var(--ui-btn-duration) var(--ui-btn-easing),
      opacity var(--ui-btn-duration) var(--ui-btn-easing);
  }

  :host([block]) .btn {
    inline-size: 100%;
  }

  .btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-btn-ring) 70%, transparent);
    outline-offset: 2px;
  }

  .btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
    transition: opacity 140ms var(--ui-btn-easing);
  }

  .btn:active::after {
    opacity: 0.08;
  }

  .btn--primary {
    background: var(--ui-btn-accent);
    color: #ffffff;
    border-color: color-mix(in srgb, var(--ui-btn-accent) 74%, #0f172a 26%);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.12), 0 8px 18px color-mix(in srgb, var(--ui-btn-accent) 22%, transparent);
  }

  .btn--primary:hover:not([disabled]) {
    background: var(--ui-btn-accent-strong);
  }

  .btn--secondary {
    background: var(--ui-btn-surface);
    color: color-mix(in srgb, var(--ui-btn-accent) 78%, var(--ui-btn-text) 22%);
    border-color: color-mix(in srgb, var(--ui-btn-accent) 22%, var(--ui-btn-muted));
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.06);
  }

  .btn--secondary:hover:not([disabled]) {
    background: color-mix(in srgb, var(--ui-btn-accent) 8%, var(--ui-btn-surface-alt));
  }

  .btn--ghost {
    background: transparent;
    color: color-mix(in srgb, var(--ui-btn-accent) 80%, var(--ui-btn-text) 20%);
    border-color: transparent;
    box-shadow: none;
  }

  .btn--ghost:hover:not([disabled]) {
    background: var(--ui-btn-accent-soft);
  }

  .btn--danger {
    background: var(--ui-color-danger, #dc2626);
    color: #ffffff;
    border-color: color-mix(in srgb, var(--ui-color-danger, #dc2626) 72%, #0f172a 28%);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.12), 0 8px 18px color-mix(in srgb, var(--ui-color-danger, #dc2626) 22%, transparent);
  }

  .btn--danger:hover:not([disabled]) {
    background: color-mix(in srgb, var(--ui-color-danger, #dc2626) 86%, #0f172a 14%);
  }

  .btn--success {
    background: var(--ui-color-success, #16a34a);
    color: #ffffff;
    border-color: color-mix(in srgb, var(--ui-color-success, #16a34a) 70%, #0f172a 30%);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.12), 0 8px 18px color-mix(in srgb, var(--ui-color-success, #16a34a) 20%, transparent);
  }

  .btn--success:hover:not([disabled]) {
    background: color-mix(in srgb, var(--ui-color-success, #16a34a) 86%, #0f172a 14%);
  }

  .btn--warning {
    background: var(--ui-color-warning, #d97706);
    color: #ffffff;
    border-color: color-mix(in srgb, var(--ui-color-warning, #d97706) 70%, #0f172a 30%);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.12), 0 8px 18px color-mix(in srgb, var(--ui-color-warning, #d97706) 18%, transparent);
  }

  .btn--warning:hover:not([disabled]) {
    background: color-mix(in srgb, var(--ui-color-warning, #d97706) 86%, #0f172a 14%);
  }

  :host([size="sm"]) {
    --ui-btn-font-size: 12px;
    --ui-btn-min-height: 32px;
    --ui-btn-padding-inline: 10px;
    --ui-btn-gap: 6px;
    --ui-btn-radius: 8px;
  }

  :host([size="lg"]) {
    --ui-btn-font-size: 16px;
    --ui-btn-min-height: 46px;
    --ui-btn-padding-inline: 18px;
    --ui-btn-gap: 10px;
    --ui-btn-radius: 12px;
  }

  :host([state="loading"]) .btn,
  :host([loading]) .btn,
  :host([aria-busy="true"]) .btn {
    cursor: progress;
  }

  :host([state="error"]) .btn:not([disabled]) {
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--ui-color-danger, #dc2626) 38%, transparent), 0 8px 18px rgba(127, 29, 29, 0.14);
  }

  :host([state="success"]) .btn:not([disabled]) {
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--ui-color-success, #16a34a) 30%, transparent), 0 8px 18px rgba(22, 163, 74, 0.14);
  }

  :host([data-animation]) .btn:not([disabled]):hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
  }

  :host([data-animation]) .btn:not([disabled]):active {
    transform: translateY(0) scale(0.99);
  }

  :host([data-animation="scale"]) .btn:not([disabled]):hover {
    transform-origin: center;
    transform: translate3d(0, -2px, 0) scale(1.02);
    z-index: 1;
    backface-visibility: hidden;
  }

  :host([data-animation="pulse"]) .btn:not([disabled]):hover {
    animation: ui-btn-pulse 900ms ease-in-out infinite;
  }

  :host([data-animation="none"]) .btn:not([disabled]) {
    transition: none;
    animation: none;
  }

  :host([headless]) .btn {
    all: unset;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ui-btn-gap);
    cursor: pointer;
    border-radius: inherit;
    color: inherit;
    font: inherit;
    line-height: inherit;
    padding: inherit;
    border: inherit;
    background: inherit;
  }

  :host([headless][block]) .btn {
    inline-size: 100%;
  }

  .slot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 0;
    max-inline-size: 100%;
  }

  .slot--label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon {
    width: 16px;
    min-width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .spinner {
    width: 14px;
    min-width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, currentColor 22%, transparent);
    border-top-color: currentColor;
    animation: ui-btn-spin 700ms linear infinite;
  }

  .sr-only {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }

  .btn[disabled] {
    opacity: 0.56;
    cursor: not-allowed;
    box-shadow: none;
    transform: none !important;
  }

  @keyframes ui-btn-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ui-btn-pulse {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-2px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .btn,
    .btn::after,
    .spinner {
      animation: none !important;
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .btn {
      border-width: 2px;
      border-color: currentColor;
      box-shadow: none !important;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-btn-accent: Highlight;
      --ui-btn-surface: Canvas;
      --ui-btn-text: CanvasText;
      --ui-btn-ring: Highlight;
    }

    .btn {
      forced-color-adjust: auto;
      border-color: ButtonText;
      color: ButtonText;
      background: ButtonFace;
    }

    .btn--primary,
    .btn--danger,
    .btn--success,
    .btn--warning {
      background: Highlight;
      color: HighlightText;
    }
  }
`;

function isTruthyAttr(value: string | null): boolean {
  return value !== null && value.toLowerCase() !== 'false' && value !== '0';
}

function toVariant(value: string | null): ButtonVariant {
  if (value === 'secondary' || value === 'ghost' || value === 'danger' || value === 'success' || value === 'warning') {
    return value;
  }
  return 'primary';
}

function toSize(value: string | null): ButtonSize {
  if (value === 'sm' || value === 'lg') return value;
  return 'md';
}

function toAnimation(value: string | null): ButtonAnimation | null {
  if (value === 'scale' || value === 'pulse' || value === 'none') return value;
  return null;
}

function toTone(value: string | null): ButtonTone | null {
  if (value === 'neutral' || value === 'info' || value === 'success' || value === 'warning' || value === 'danger') {
    return value;
  }
  return null;
}

function toState(value: string | null): ButtonState {
  if (value === 'loading' || value === 'error' || value === 'success') return value;
  return 'idle';
}

function toButtonType(value: string | null): ButtonType {
  if (value === 'submit' || value === 'reset') return value;
  return 'button';
}

function readHostString(el: HTMLElement, name: string): string | null {
  const attr = el.getAttribute(name);
  if (attr != null) return attr;
  const prop = (el as unknown as Record<string, unknown>)[name];
  if (typeof prop === 'string' && prop.length > 0) return prop;
  return null;
}

function readHostBoolean(el: HTMLElement, name: string): boolean {
  const attr = el.getAttribute(name);
  if (attr != null) return isTruthyAttr(attr);
  const prop = (el as unknown as Record<string, unknown>)[name];
  if (typeof prop === 'boolean') return prop;
  if (typeof prop === 'string') return isTruthyAttr(prop);
  return false;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function hasNamedSlot(host: HTMLElement, slotName: string): boolean {
  return !!host.querySelector(`[slot="${slotName}"]`);
}

function runFormAction(host: HTMLElement, type: ButtonType) {
  if (type === 'button') return;

  const form = host.closest('form') as HTMLFormElement | null;
  if (!form) return;

  if (type === 'reset') {
    form.reset();
    return;
  }

  if (typeof form.requestSubmit === 'function') {
    form.requestSubmit();
    return;
  }

  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(submitEvent);
}

export class UIButton extends ElementBase {
  static get observedAttributes() {
    return [
      'disabled',
      'variant',
      'size',
      'headless',
      'loading',
      'icon',
      'block',
      'animation',
      'theme',
      'tone',
      'state',
      'type',
      'loading-label',
      'aria-label',
    ];
  }

  private _slots: HTMLSlotElement[] = [];

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    this._detachSlotListeners();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'animation') {
      const animation = toAnimation(newValue);
      if (animation) this.setAttribute('data-animation', animation);
      else this.removeAttribute('data-animation');
    }

    if (this.isConnected) this.requestRender();
  }

  private _onRootClick(event: Event) {
    const target = event.target as HTMLElement | null;
    const button = target?.closest('button[data-ui-button="true"]') as HTMLButtonElement | null;
    if (!button || button.disabled) return;

    const buttonType = toButtonType(button.getAttribute('data-request-type'));
    queueMicrotask(() => {
      if ((event as MouseEvent).defaultPrevented) return;
      runFormAction(this, buttonType);
    });
  }

  private _attachSlotListeners() {
    this._detachSlotListeners();
    this._slots = Array.from(this.root.querySelectorAll('slot'));
    this._slots.forEach((slot) => slot.addEventListener('slotchange', this._onSlotChange as EventListener));
  }

  private _detachSlotListeners() {
    this._slots.forEach((slot) => slot.removeEventListener('slotchange', this._onSlotChange as EventListener));
    this._slots = [];
  }

  private _onSlotChange() {
    this.requestRender();
  }

  protected render() {
    const disabled = readHostBoolean(this, 'disabled');
    const legacyLoading = readHostBoolean(this, 'loading');
    const rawState = readHostString(this, 'state');
    const state = toState(rawState);
    const loading = legacyLoading || state === 'loading';
    const icon = readHostString(this, 'icon');
    const variant = toVariant(readHostString(this, 'variant'));
    const rawSize = readHostString(this, 'size');
    const size = toSize(rawSize);
    const animation = toAnimation(readHostString(this, 'animation'));
    const rawTheme = readHostString(this, 'theme');
    const theme = rawTheme === 'dark' || rawTheme === 'brand' ? rawTheme : null;
    const rawTone = readHostString(this, 'tone');
    const tone = toTone(rawTone);
    const block = readHostBoolean(this, 'block');
    const headless = readHostBoolean(this, 'headless');
    const buttonType = toButtonType(readHostString(this, 'type'));
    const buttonLabel = readHostString(this, 'aria-label');
    const loadingLabel = readHostString(this, 'loading-label') || 'Loading';

    if (animation) this.setAttribute('data-animation', animation);
    else this.removeAttribute('data-animation');

    if (block) this.setAttribute('block', '');
    else this.removeAttribute('block');

    if (headless) this.setAttribute('headless', '');
    else this.removeAttribute('headless');

    if (rawTone != null) {
      if (tone) this.setAttribute('tone', tone);
      else this.removeAttribute('tone');
    }

    if (rawSize != null) {
      if (size === 'md') this.removeAttribute('size');
      else this.setAttribute('size', size);
    }

    if (rawTheme != null) {
      if (theme) this.setAttribute('theme', theme);
      else this.removeAttribute('theme');
    }

    if (rawState != null) {
      if (state === 'idle') this.removeAttribute('state');
      else this.setAttribute('state', state);
    }

    const buttonDisabled = disabled || loading;
    if (buttonDisabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');

    if (loading) this.setAttribute('aria-busy', 'true');
    else this.removeAttribute('aria-busy');

    const hasPrefix = hasNamedSlot(this, 'prefix');
    const hasSuffix = hasNamedSlot(this, 'suffix');
    const iconMarkup = !loading && icon
      ? `<ui-icon class="icon" name="${escapeAttr(icon)}" aria-hidden="true"></ui-icon>`
      : '';
    const spinnerMarkup = loading ? `<span class="spinner" aria-hidden="true" part="spinner"></span>` : '';

    const prefixMarkup = spinnerMarkup || iconMarkup || hasPrefix
      ? `<span class="slot slot--prefix" part="prefix">${spinnerMarkup}${iconMarkup}${loading ? '' : '<slot name="prefix"></slot>'}</span>`
      : '';

    const suffixMarkup = hasSuffix
      ? `<span class="slot slot--suffix" part="suffix"><slot name="suffix"></slot></span>`
      : '';

    this.setContent(`
      <style>${style}</style>
      <button
        class="btn btn--${variant}"
        part="button"
        type="button"
        data-ui-button="true"
        data-request-type="${buttonType}"
        aria-busy="${loading ? 'true' : 'false'}"
        ${buttonLabel ? `aria-label="${escapeAttr(buttonLabel)}"` : ''}
        ${buttonDisabled ? 'disabled' : ''}
      >
        ${prefixMarkup}
        <span class="slot slot--label" part="label"><slot></slot></span>
        ${suffixMarkup}
        ${loading ? `<span class="sr-only">${escapeAttr(loadingLabel)}</span>` : ''}
      </button>
    `);

    this._attachSlotListeners();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-button')) {
  customElements.define('ui-button', UIButton);
}
