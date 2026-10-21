import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-toggle-radius: var(--ui-control-radius-2, var(--ui-radius, 6px));
    --ui-toggle-border: var(--ui-color-line, color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent));
    --ui-toggle-bg: transparent;
    --ui-toggle-color: var(--ui-color-text-strong, var(--ui-color-text, #0f172a));
    --ui-toggle-active-bg: var(--ui-color-primary, #2563eb);
    --ui-toggle-pressed-bg: var(--ui-color-accent-fill, color-mix(in srgb, var(--ui-toggle-active-bg) 16%, transparent));
    --ui-toggle-active-color: var(--ui-color-text-strong, var(--ui-color-text, #0f172a));
    --ui-toggle-active-border: var(--ui-color-accent-line, color-mix(in srgb, var(--ui-toggle-active-bg) 40%, transparent));
    --ui-toggle-muted: var(--ui-color-muted, #526175);
    --ui-toggle-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-toggle-shadow:
      none;
    --ui-toggle-padding-x: calc(var(--ui-control-padding-inline-2, 12px) - 1px);
    --ui-toggle-padding-y: 0px;
    --ui-toggle-height: var(--ui-control-height-2, 32px);
    --ui-toggle-font-size: var(--ui-control-font-size-2, 14px);
    --ui-toggle-gap: 8px;

    color-scheme: light dark;
    display: inline-flex;
    min-inline-size: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .control {
    box-sizing: border-box;
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
    font: 600 var(--ui-toggle-font-size)/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    transition:
      background-color 150ms ease,
      border-color 150ms ease,
      color 150ms ease,
      transform 150ms ease,
      box-shadow 150ms ease;
  }

  .control:hover {
    background: var(--ui-color-fill, color-mix(in srgb, var(--ui-toggle-active-bg) 8%, var(--ui-toggle-bg)));
  }

  :host(:focus-visible) .control {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-toggle-focus));
    outline-offset: var(--ui-ring-offset, 2px);
  }

  :host([pressed]) .control,
  .control[aria-pressed="true"] {
    background: var(--ui-toggle-pressed-bg);
    border-color: var(--ui-toggle-active-border);
    color: var(--ui-toggle-active-color);
  }

  :host([pressed]) .control:hover {
    background: var(--ui-color-accent-fill-hover, var(--ui-toggle-pressed-bg));
  }

  .icon:empty {
    display: none !important;
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

  :host([size="sm"]) {
    --ui-toggle-padding-x: calc(var(--ui-control-padding-inline-1, 8px) - 1px);
    --ui-toggle-height: var(--ui-control-height-1, 24px);
    --ui-toggle-font-size: var(--ui-control-font-size-1, 12px);
    --ui-toggle-radius: var(--ui-control-radius-1, var(--ui-radius, 6px));
  }

  :host([size="lg"]) {
    --ui-toggle-padding-x: calc(var(--ui-control-padding-inline-3, 16px) - 1px);
    --ui-toggle-height: var(--ui-control-height-3, 40px);
    --ui-toggle-font-size: var(--ui-control-font-size-3, 16px);
    --ui-toggle-radius: var(--ui-control-radius-3, var(--ui-radius, 6px));
  }

  :host([shape="square"]) {
    --ui-toggle-radius: 4px;
  }

  :host([shape="pill"]) {
    --ui-toggle-radius: 999px;
  }

  :host([elevation="none"]) {
    --ui-toggle-shadow: none;
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
    --ui-toggle-active-bg: var(--ui-color-success, #15803d);
  }

  :host([tone="warning"]) {
    --ui-toggle-active-bg: var(--ui-color-warning, #b45309);
  }

  :host([tone="danger"]) {
    --ui-toggle-active-bg: var(--ui-color-danger, #dc2626);
  }

  /* The contrast variant draws dark text on its pressed fill, so the tones need light fills there. */
  :host([variant="contrast"][tone="success"]) { --ui-toggle-active-bg: #86efac; }
  :host([variant="contrast"][tone="warning"]) { --ui-toggle-active-bg: #fcd34d; }
  :host([variant="contrast"][tone="danger"]) { --ui-toggle-active-bg: #fca5a5; }

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

const CONTENT_ATTRS = new Set(['icon-on', 'icon-off', 'aria-label']);

function isTruthy(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function escapeHtml(value: string): string {
  return String(value)
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
      'shape',
      'elevation',
      'name',
      'value',
      'required',
      'icon-on',
      'icon-off',
      'aria-label',
      'tabindex'
    ];
  }

  private _control: HTMLElement | null = null;

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

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (CONTENT_ATTRS.has(name)) {
      super.attributeChangedCallback(name, oldValue, newValue);
      return;
    }

    this._syncAria();
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
    if (next === this.pressed) {
      this._syncAria();
      return;
    }

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
    const loading = this.hasAttribute('loading');
    const inGroup = this.hasAttribute('data-group-item');

    if (!inGroup) {
      this.setAttribute('role', 'button');
      this.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    } else if (this.hasAttribute('aria-pressed')) {
      this.removeAttribute('aria-pressed');
    }
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.setAttribute('aria-busy', loading ? 'true' : 'false');

    const currentTabIndex = this.getAttribute('tabindex');
    if (disabled) {
      if (!this.hasAttribute('data-ui-prev-tabindex')) {
        this.setAttribute('data-ui-prev-tabindex', currentTabIndex ?? '');
      }
      if (currentTabIndex !== '-1') this.setAttribute('tabindex', '-1');
    } else {
      const previousTabIndex = this.getAttribute('data-ui-prev-tabindex');
      if (previousTabIndex != null) {
        if (previousTabIndex) this.setAttribute('tabindex', previousTabIndex);
        else this.removeAttribute('tabindex');
        this.removeAttribute('data-ui-prev-tabindex');
      } else if (currentTabIndex == null) {
        this.setAttribute('tabindex', '0');
      }
    }

    // The host carries the role and state; the inner element is only the visual control.
    if (this._control) this._control.toggleAttribute('data-disabled', disabled);
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
    // No default glyph: a pressed toggle is shown by its fill. Pass icon-on / icon-off for one.
    const iconOn = this.getAttribute('icon-on') || '';
    const iconOff = this.getAttribute('icon-off') || '';
    const ariaLabel = this.getAttribute('aria-label') || 'Toggle';

    this.setContent(`
      <style>${style}</style>
      <span
        class="control"
        part="control"
        ${disabled ? 'data-disabled' : ''}
      >
        <span class="icon icon-off" part="icon-off" aria-hidden="true">${escapeHtml(iconOff)}</span>
        <span class="icon icon-on" part="icon-on" aria-hidden="true">${escapeHtml(iconOn)}</span>
        <span class="label" part="label"><slot></slot></span>
      </span>
    `);

    this._control = this.root.querySelector('.control') as HTMLElement | null;
    this._syncAria();
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return CONTENT_ATTRS.has(name);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-toggle')) {
  customElements.define('ui-toggle', UIToggle);
}
