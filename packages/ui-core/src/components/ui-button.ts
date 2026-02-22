import { ElementBase } from '../ElementBase';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonAnimation = 'scale' | 'pulse' | 'none';

const style = `
  :host {
    --ui-btn-radius: var(--ui-radius, 10px);
    --ui-btn-padding: var(--ui-padding, 10px 14px);
    --ui-btn-min-height: var(--ui-min-height, 38px);
    --ui-btn-width: var(--ui-width, auto);
    --ui-btn-font-size: 14px;
    --ui-btn-font-weight: 600;
    --ui-btn-letter-spacing: -0.01em;
    --ui-btn-border: var(--ui-border, 1px solid transparent);
    --ui-btn-ring: var(--ui-color-focus-ring, #2563eb);
    --ui-btn-duration: 160ms;
    --ui-btn-easing: cubic-bezier(0.2, 0.8, 0.2, 1);

    --ui-btn-primary-bg: var(--ui-primary, var(--ui-color-primary, #2563eb));
    --ui-btn-primary-fg: var(--ui-foreground, #ffffff);
    --ui-btn-primary-hover: color-mix(in srgb, var(--ui-btn-primary-bg) 88%, #0f172a 12%);

    --ui-btn-secondary-bg: var(--ui-color-surface, #ffffff);
    --ui-btn-secondary-fg: color-mix(in srgb, var(--ui-btn-primary-bg) 80%, #0f172a 20%);
    --ui-btn-secondary-border: var(--ui-border, 1px solid color-mix(in srgb, var(--ui-btn-primary-bg) 28%, #cbd5e1));
    --ui-btn-secondary-hover: color-mix(in srgb, var(--ui-btn-primary-bg) 6%, var(--ui-color-surface-alt, #f8fafc));

    --ui-btn-ghost-bg: transparent;
    --ui-btn-ghost-fg: var(--ui-btn-secondary-fg);
    --ui-btn-ghost-hover: color-mix(in srgb, var(--ui-btn-primary-bg) 10%, transparent);

    --ui-btn-danger-bg: var(--ui-color-danger, #dc2626);
    --ui-btn-danger-fg: #ffffff;
    --ui-btn-danger-hover: color-mix(in srgb, var(--ui-btn-danger-bg) 88%, #0f172a 12%);

    display: inline-flex;
    vertical-align: middle;
    box-sizing: border-box;
    color-scheme: light dark;
  }

  :host([block]) {
    display: flex;
    width: 100%;
  }

  button {
    position: relative;
    isolation: isolate;
    box-sizing: border-box;
    width: var(--ui-width, var(--ui-btn-width));
    min-height: var(--ui-min-height, var(--ui-btn-min-height));
    padding: var(--ui-padding, var(--ui-btn-padding));
    border-radius: var(--ui-btn-radius);
    border: var(--ui-border, var(--ui-btn-border));
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
    gap: 8px;
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

  :host([block]) button {
    width: 100%;
  }

  button:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-btn-ring) 70%, transparent);
    outline-offset: 2px;
  }

  button::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
    transition: opacity 140ms var(--ui-btn-easing);
  }

  button:active::after {
    opacity: 0.08;
  }

  .btn--primary {
    background: var(--ui-btn-primary-bg);
    color: var(--ui-btn-primary-fg);
    border-color: color-mix(in srgb, var(--ui-btn-primary-bg) 72%, #0f172a 28%);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.12), 0 6px 16px color-mix(in srgb, var(--ui-btn-primary-bg) 22%, transparent);
  }

  .btn--primary:hover:not([disabled]) {
    background: var(--ui-btn-primary-hover);
  }

  .btn--secondary {
    background: var(--ui-btn-secondary-bg);
    color: var(--ui-btn-secondary-fg);
    border: var(--ui-btn-secondary-border);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.04);
  }

  .btn--secondary:hover:not([disabled]) {
    background: var(--ui-btn-secondary-hover);
  }

  .btn--ghost {
    background: var(--ui-btn-ghost-bg);
    color: var(--ui-btn-ghost-fg);
    border: 1px solid transparent;
    box-shadow: none;
  }

  .btn--ghost:hover:not([disabled]) {
    background: var(--ui-btn-ghost-hover);
  }

  .btn--danger {
    background: var(--ui-btn-danger-bg);
    color: var(--ui-btn-danger-fg);
    border-color: color-mix(in srgb, var(--ui-btn-danger-bg) 70%, #0f172a 30%);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.12), 0 6px 16px color-mix(in srgb, var(--ui-btn-danger-bg) 18%, transparent);
  }

  .btn--danger:hover:not([disabled]) {
    background: var(--ui-btn-danger-hover);
  }

  :host([size="sm"]) button {
    --ui-btn-font-size: 12px;
    --ui-btn-min-height: 30px;
    --ui-btn-padding: 6px 10px;
  }

  :host([size="lg"]) button {
    --ui-btn-font-size: 16px;
    --ui-btn-min-height: 46px;
    --ui-btn-padding: 12px 18px;
  }

  :host([theme="dark"]) {
    --ui-btn-primary-bg: #1d4ed8;
    --ui-btn-primary-hover: #1e40af;
    --ui-btn-secondary-bg: #0f172a;
    --ui-btn-secondary-fg: #e2e8f0;
    --ui-btn-secondary-border: 1px solid rgba(148, 163, 184, 0.45);
    --ui-btn-secondary-hover: #111c30;
    --ui-btn-ghost-fg: #dbeafe;
    --ui-btn-ghost-hover: rgba(148, 163, 184, 0.18);
  }

  :host([theme="brand"]) {
    --ui-btn-primary-bg: #7c3aed;
    --ui-btn-primary-hover: #6d28d9;
    --ui-btn-secondary-fg: #5b21b6;
    --ui-btn-secondary-border: 1px solid rgba(124, 58, 237, 0.35);
    --ui-btn-secondary-hover: rgba(124, 58, 237, 0.08);
    --ui-btn-ghost-fg: #6d28d9;
    --ui-btn-ghost-hover: rgba(124, 58, 237, 0.12);
  }

  :host([data-animation]) button:not([disabled]):hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
  }

  :host([data-animation]) button:not([disabled]):active {
    transform: translateY(0) scale(0.99);
  }

  :host([data-animation][variant="primary"]) button:not([disabled]):hover {
    background-color: var(--ui-btn-primary-hover);
  }

  :host([data-animation][variant="danger"]) button:not([disabled]):hover {
    background-color: var(--ui-btn-danger-hover);
  }

  :host([data-animation="scale"]) button:not([disabled]):hover {
    transform-origin: center;
    transform: translate3d(0, -2px, 0) scale(1.02);
    z-index: 1;
    backface-visibility: hidden;
  }

  :host([data-animation="pulse"]) button:not([disabled]):hover {
    animation: ui-btn-pulse 900ms ease-in-out infinite;
  }

  :host([data-animation="none"]) button:not([disabled]) {
    transition: none;
    animation: none;
  }

  :host([headless]) button {
    all: unset;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    border-radius: inherit;
    color: inherit;
    font: inherit;
    line-height: inherit;
    padding: inherit;
    border: inherit;
    background: inherit;
  }

  :host([headless][block]) button {
    width: 100%;
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

  button[disabled] {
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
    button,
    button::after,
    .spinner {
      animation: none !important;
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-btn-border: 2px solid currentColor;
      --ui-btn-secondary-border: 2px solid currentColor;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-btn-primary-bg: Highlight;
      --ui-btn-primary-fg: HighlightText;
      --ui-btn-secondary-bg: Canvas;
      --ui-btn-secondary-fg: CanvasText;
      --ui-btn-secondary-border: 1px solid CanvasText;
      --ui-btn-danger-bg: Highlight;
      --ui-btn-danger-fg: HighlightText;
      --ui-btn-ring: Highlight;
    }

    button {
      forced-color-adjust: auto;
      border-color: ButtonText;
    }
  }
`;

function isTruthyAttr(value: string | null): boolean {
  return value !== null && value.toLowerCase() !== 'false' && value !== '0';
}

function toVariant(value: string | null): ButtonVariant {
  if (value === 'secondary' || value === 'ghost' || value === 'danger') return value;
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

function reflectAttr(element: HTMLElement, name: string, value: string) {
  if (element.getAttribute(name) === value) return;
  element.setAttribute(name, value);
}

export class UIButton extends ElementBase {
  static get observedAttributes() {
    return ['disabled', 'variant', 'size', 'headless', 'loading', 'icon', 'block', 'animation', 'theme'];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  protected render() {
    const disabled = readHostBoolean(this, 'disabled');
    const loading = readHostBoolean(this, 'loading');
    const icon = readHostString(this, 'icon');
    const variant = toVariant(readHostString(this, 'variant'));
    const size = toSize(readHostString(this, 'size'));
    const animation = toAnimation(readHostString(this, 'animation'));
    const theme = readHostString(this, 'theme');
    const block = readHostBoolean(this, 'block');
    const headless = readHostBoolean(this, 'headless');

    if (animation) this.setAttribute('data-animation', animation);
    else this.removeAttribute('data-animation');

    reflectAttr(this, 'variant', variant);
    reflectAttr(this, 'size', size);
    if (theme === 'dark' || theme === 'brand') reflectAttr(this, 'theme', theme);
    else this.removeAttribute('theme');
    if (block) this.setAttribute('block', '');
    else this.removeAttribute('block');
    if (headless) this.setAttribute('headless', '');
    else this.removeAttribute('headless');

    const buttonDisabled = disabled || loading;
    const iconMarkup = loading
      ? `<span class="spinner" aria-hidden="true"></span>`
      : icon
        ? `<ui-icon class="icon" name="${escapeAttr(icon)}" aria-hidden="true"></ui-icon>`
        : '';

    this.setContent(`
      <style>${style}</style>
      <button
        class="btn--${variant}"
        part="button"
        type="button"
        aria-busy="${loading ? 'true' : 'false'}"
        ${buttonDisabled ? 'disabled' : ''}
      >
        ${iconMarkup}
        <slot></slot>
      </button>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-button')) {
  customElements.define('ui-button', UIButton);
}
