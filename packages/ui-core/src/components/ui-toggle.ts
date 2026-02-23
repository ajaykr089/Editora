import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-toggle-radius: 10px;
    --ui-toggle-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-toggle-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-toggle-color: var(--ui-color-text, #0f172a);
    --ui-toggle-active-bg: var(--ui-color-primary, #2563eb);
    --ui-toggle-active-color: var(--ui-color-primary-foreground, #ffffff);
    --ui-toggle-active-border: color-mix(in srgb, var(--ui-toggle-active-bg) 72%, #0f172a 28%);
    --ui-toggle-muted: var(--ui-color-muted, #64748b);
    --ui-toggle-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-toggle-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 8px 20px rgba(15, 23, 42, 0.08);
    --ui-toggle-padding-x: 12px;
    --ui-toggle-padding-y: 8px;
    --ui-toggle-height: 36px;
    --ui-toggle-gap: 8px;

    color-scheme: light dark;
    display: inline-flex;
    min-inline-size: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .control {
    min-inline-size: 0;
    min-block-size: var(--ui-toggle-height);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ui-toggle-gap);
    padding: var(--ui-toggle-padding-y) var(--ui-toggle-padding-x);
    border: 1px solid var(--ui-toggle-border);
    border-radius: var(--ui-toggle-radius);
    background: var(--ui-toggle-bg);
    color: var(--ui-toggle-color);
    box-shadow: var(--ui-toggle-shadow);
    cursor: pointer;
    user-select: none;
    outline: none;
    text-decoration: none;
    font: 600 13px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    transition:
      background-color 150ms ease,
      border-color 150ms ease,
      color 150ms ease,
      transform 150ms ease,
      box-shadow 150ms ease;
  }

  .control:hover {
    background: color-mix(in srgb, var(--ui-toggle-active-bg) 8%, var(--ui-toggle-bg));
    border-color: color-mix(in srgb, var(--ui-toggle-active-bg) 30%, var(--ui-toggle-border));
  }

  .control:active {
    transform: translateY(0.5px);
  }

  .control:focus-visible {
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-toggle-focus) 28%, transparent),
      var(--ui-toggle-shadow);
  }

  :host([pressed]) .control,
  .control[aria-pressed="true"] {
    background: color-mix(in srgb, var(--ui-toggle-active-bg) 88%, #ffffff 12%);
    border-color: var(--ui-toggle-active-border);
    color: var(--ui-toggle-active-color);
  }

  :host([pressed]) .control:hover {
    background: color-mix(in srgb, var(--ui-toggle-active-bg) 82%, #0f172a 18%);
  }

  .icon {
    display: inline-grid;
    place-items: center;
    font-size: 12px;
    line-height: 1;
  }

  .icon-off {
    display: inline-grid;
  }

  .icon-on {
    display: none;
  }

  :host([pressed]) .icon-on {
    display: inline-grid;
  }

  :host([pressed]) .icon-off {
    display: none;
  }

  .label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .description {
    display: none;
  }

  :host([size="sm"]) {
    --ui-toggle-padding-x: 10px;
    --ui-toggle-padding-y: 6px;
    --ui-toggle-height: 32px;
    --ui-toggle-radius: 9px;
  }

  :host([size="lg"]) {
    --ui-toggle-padding-x: 14px;
    --ui-toggle-padding-y: 10px;
    --ui-toggle-height: 40px;
    --ui-toggle-radius: 11px;
  }

  :host([variant="soft"]) {
    --ui-toggle-bg: color-mix(in srgb, var(--ui-toggle-active-bg) 8%, var(--ui-color-surface, #ffffff));
    --ui-toggle-border: color-mix(in srgb, var(--ui-toggle-active-bg) 24%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="outline"]) .control {
    --ui-toggle-bg: transparent;
    box-shadow: none;
  }

  :host([variant="contrast"]) {
    --ui-toggle-bg: #0f172a;
    --ui-toggle-color: #e2e8f0;
    --ui-toggle-border: #334155;
    --ui-toggle-active-bg: #93c5fd;
    --ui-toggle-active-color: #0f172a;
    --ui-toggle-focus: #93c5fd;
    --ui-toggle-shadow:
      0 10px 24px rgba(2, 6, 23, 0.38),
      0 24px 50px rgba(2, 6, 23, 0.34);
  }

  :host([variant="minimal"]) .control {
    box-shadow: none;
    border-color: transparent;
    background: transparent;
  }

  :host([tone="success"]) {
    --ui-toggle-active-bg: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-toggle-active-bg: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-toggle-active-bg: var(--ui-color-danger, #dc2626);
  }

  :host([disabled]) .control,
  :host([loading]) .control {
    opacity: 0.56;
    cursor: not-allowed;
    transform: none;
  }

  :host([loading]) .icon {
    animation: ui-toggle-spin 900ms linear infinite;
  }

  :host([headless]) .control {
    display: none;
  }

  @keyframes ui-toggle-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .icon {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .control {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-toggle-bg: Canvas;
      --ui-toggle-color: CanvasText;
      --ui-toggle-border: CanvasText;
      --ui-toggle-active-bg: Highlight;
      --ui-toggle-active-color: HighlightText;
      --ui-toggle-focus: Highlight;
      --ui-toggle-shadow: none;
    }
  }
`;

function isTruthy(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UIToggle extends ElementBase {
  static get observedAttributes() {
    return [
      'pressed',
      'disabled',
      'loading',
      'headless',
      'size',
      'variant',
      'tone',
      'name',
      'value',
      'required',
      'icon-on',
      'icon-off',
      'aria-label'
    ];
  }

  private _control: HTMLButtonElement | null = null;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this._syncAria();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  get pressed(): boolean {
    return this.hasAttribute('pressed');
  }

  set pressed(next: boolean) {
    if (next) this.setAttribute('pressed', '');
    else this.removeAttribute('pressed');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled') || this.hasAttribute('loading');
  }

  set disabled(next: boolean) {
    if (next) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  toggle(force?: boolean): void {
    if (this.disabled) return;
    const next = typeof force === 'boolean' ? force : !this.pressed;
    this.pressed = next;
    this._syncAria();

    const detail = {
      pressed: next,
      value: this.getAttribute('value') || '',
      name: this.getAttribute('name') || '',
      required: isTruthy(this.getAttribute('required'))
    };

    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _syncAria(): void {
    const pressed = this.pressed;
    const disabled = this.disabled;
    this.setAttribute('role', 'button');
    this.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', disabled ? '-1' : '0');
    } else if (disabled) {
      this.setAttribute('tabindex', '-1');
    } else if (this.getAttribute('tabindex') === '-1') {
      this.setAttribute('tabindex', '0');
    }

    if (this._control) {
      this._control.disabled = disabled;
      this._control.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      this._control.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (!target.closest('.control')) return;
    this.toggle();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }

  protected override render(): void {
    const pressed = this.pressed;
    const disabled = this.disabled;
    const iconOn = this.getAttribute('icon-on') || '●';
    const iconOff = this.getAttribute('icon-off') || '○';
    const ariaLabel = this.getAttribute('aria-label') || 'Toggle';

    this.setContent(`
      <style>${style}</style>
      <button
        type="button"
        class="control"
        part="control"
        aria-label="${escapeHtml(ariaLabel)}"
        aria-pressed="${pressed ? 'true' : 'false'}"
        aria-disabled="${disabled ? 'true' : 'false'}"
        ${disabled ? 'disabled' : ''}
      >
        <span class="icon icon-off" part="icon-off" aria-hidden="true">${escapeHtml(iconOff)}</span>
        <span class="icon icon-on" part="icon-on" aria-hidden="true">${escapeHtml(iconOn)}</span>
        <span class="label" part="label"><slot></slot></span>
      </button>
    `);

    this._control = this.root.querySelector('.control') as HTMLButtonElement | null;
    this._syncAria();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-toggle')) {
  customElements.define('ui-toggle', UIToggle);
}
