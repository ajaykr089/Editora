import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-checkbox-size: 18px;
    --ui-checkbox-hit-area: 24px;
    --ui-checkbox-radius: 4px;
    --ui-checkbox-border: 1.5px solid color-mix(in srgb, var(--ui-primary, var(--ui-color-primary, #2563eb)) 44%, var(--ui-color-border, #cbd5e1) 56%);
    --ui-checkbox-background: var(--ui-bg, var(--ui-color-surface, #ffffff));
    --ui-checkbox-check-color: #ffffff;
    --ui-checkbox-checked-background: var(--ui-primary, var(--ui-color-primary, #2563eb));
    --ui-checkbox-checked-border: var(--ui-checkbox-border);
    --ui-checkbox-indeterminate-bg: #d97706;
    --ui-checkbox-indeterminate-border: 1.5px solid color-mix(in srgb, #d97706 72%, #78350f 28%);
    --ui-checkbox-invalid-border: 1.5px solid var(--ui-color-danger, #dc2626);
    --ui-checkbox-invalid-focus: 0 0 0 4px color-mix(in srgb, var(--ui-color-danger, #dc2626) 24%, transparent);
    --ui-checkbox-focus: 0 0 0 4px color-mix(in srgb, var(--ui-color-focus-ring, #2563eb) 26%, transparent);
    --ui-checkbox-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 70%, transparent), 0 1px 2px rgba(15, 23, 42, 0.08);
    --ui-checkbox-shadow-checked: inset 0 1px 0 color-mix(in srgb, #ffffff 30%, transparent), 0 6px 14px color-mix(in srgb, var(--ui-primary, var(--ui-color-primary, #2563eb)) 30%, transparent);
    --ui-checkbox-disabled-bg: color-mix(in srgb, var(--ui-color-surface-alt, #f1f5f9) 88%, #ffffff 12%);
    --ui-checkbox-disabled-border: 1.5px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-checkbox-label-color: var(--ui-foreground, var(--ui-color-text, #0f172a));
    --ui-checkbox-muted: var(--ui-color-muted, #64748b);
    --ui-checkbox-duration: 170ms;
    --ui-checkbox-easing: cubic-bezier(0.2, 0.8, 0.2, 1);

    display: inline-flex;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    color-scheme: light dark;
  }

  :host([density="compact"]) {
    --ui-checkbox-size: 16px;
    --ui-checkbox-hit-area: 20px;
    --ui-checkbox-radius: 4px;
    --ui-checkbox-duration: 140ms;
  }

  :host([density="compact"]) .label {
    font-size: 13px;
    line-height: 1.35;
  }

  :host([density="comfortable"]) {
    --ui-checkbox-size: 20px;
    --ui-checkbox-hit-area: 28px;
    --ui-checkbox-radius: 5px;
  }

  :host([density="comfortable"]) .label {
    font-size: 15px;
  }

  :host([preset="admin"]) {
    --ui-checkbox-radius: 4px;
    --ui-checkbox-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, #64748b 30%);
    --ui-checkbox-background: color-mix(in srgb, var(--ui-color-surface, #ffffff) 76%, var(--ui-color-surface-alt, #f8fafc) 24%);
    --ui-checkbox-checked-background: color-mix(in srgb, var(--ui-primary, var(--ui-color-primary, #2563eb)) 88%, #0f172a 12%);
    --ui-checkbox-checked-border: 1px solid color-mix(in srgb, var(--ui-primary, var(--ui-color-primary, #2563eb)) 72%, #0f172a 28%);
    --ui-checkbox-shadow: none;
    --ui-checkbox-shadow-checked: 0 0 0 1px color-mix(in srgb, var(--ui-primary, var(--ui-color-primary, #2563eb)) 28%, transparent);
  }

  :host([preset="admin"][density="compact"]) {
    --ui-checkbox-size: 15px;
    --ui-checkbox-hit-area: 18px;
    --ui-checkbox-radius: 3px;
    --ui-checkbox-duration: 120ms;
  }

  :host([preset="admin"][density="compact"]) .label {
    font-size: 12.5px;
    letter-spacing: 0;
  }

  :host([disabled]),
  :host([loading]) {
    cursor: not-allowed;
  }

  .row {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: var(--ui-checkbox-hit-area);
  }

  .control-wrap {
    width: var(--ui-checkbox-hit-area);
    min-width: var(--ui-checkbox-hit-area);
    height: var(--ui-checkbox-hit-area);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .control {
    width: var(--ui-checkbox-size);
    min-width: var(--ui-checkbox-size);
    height: var(--ui-checkbox-size);
    border-radius: var(--ui-checkbox-radius);
    border: var(--ui-checkbox-border);
    background: var(--ui-checkbox-background);
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    box-shadow: var(--ui-checkbox-shadow);
    transition:
      border-color var(--ui-checkbox-duration) var(--ui-checkbox-easing),
      background-color var(--ui-checkbox-duration) var(--ui-checkbox-easing),
      box-shadow var(--ui-checkbox-duration) var(--ui-checkbox-easing),
      transform var(--ui-checkbox-duration) var(--ui-checkbox-easing);
  }

  .control::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(180deg, color-mix(in srgb, #ffffff 30%, transparent), transparent 52%);
    opacity: 0.22;
    pointer-events: none;
    transition: opacity var(--ui-checkbox-duration) var(--ui-checkbox-easing);
  }

  .check,
  .dash {
    opacity: 0;
    transform: scale(0.86);
    transition:
      opacity var(--ui-checkbox-duration) var(--ui-checkbox-easing),
      transform var(--ui-checkbox-duration) var(--ui-checkbox-easing);
  }

  .check {
    position: absolute;
    inset: 0;
    margin: auto;
    width: calc(var(--ui-checkbox-size) - 4px);
    height: calc(var(--ui-checkbox-size) - 4px);
    color: var(--ui-checkbox-check-color);
    transform-origin: center;
  }

  .check-path {
    stroke-dasharray: 22;
    stroke-dashoffset: 22;
    transition: stroke-dashoffset 210ms var(--ui-checkbox-easing);
  }

  .dash {
    position: absolute;
    inset: 0;
    margin: auto;
    width: calc(var(--ui-checkbox-size) - 6px);
    height: 2.2px;
    border-radius: 99px;
    background: var(--ui-checkbox-check-color);
    transform-origin: center;
  }

  .spinner {
    position: absolute;
    width: calc(var(--ui-checkbox-size) - 5px);
    height: calc(var(--ui-checkbox-size) - 5px);
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, currentColor 25%, transparent);
    border-top-color: currentColor;
    opacity: 0;
    animation: ui-checkbox-spin 700ms linear infinite;
    pointer-events: none;
  }

  :host([checked]:not([indeterminate])) .control {
    background: var(--ui-checkbox-checked-background);
    border: var(--ui-checkbox-checked-border);
    box-shadow: var(--ui-checkbox-shadow-checked);
  }

  :host([checked]:not([indeterminate])) .control::before {
    opacity: 0.32;
  }

  :host([checked]:not([indeterminate])) .check {
    opacity: 1;
    transform: scale(1);
  }

  :host([checked]:not([indeterminate])) .check-path {
    stroke-dashoffset: 0;
  }

  :host([indeterminate]) .control {
    background: var(--ui-checkbox-indeterminate-bg);
    border: var(--ui-checkbox-indeterminate-border);
    box-shadow: var(--ui-checkbox-shadow-checked);
  }

  :host([indeterminate]) .dash {
    opacity: 1;
    transform: scale(1);
  }

  :host(:focus-visible) .control {
    box-shadow: var(--ui-checkbox-focus);
  }

  :host(:not([disabled]):not([loading]):hover) .control {
    transform: translateY(-0.5px);
    border-color: color-mix(in srgb, var(--ui-primary, var(--ui-color-primary, #2563eb)) 80%, #0f172a 20%);
  }

  :host(:not([disabled]):not([loading]):active) .control {
    transform: scale(0.96);
  }

  :host([invalid]) .control {
    border: var(--ui-checkbox-invalid-border);
  }

  :host([invalid]:focus-visible) .control {
    box-shadow: var(--ui-checkbox-invalid-focus);
  }

  :host([disabled]) .control,
  :host([loading]) .control {
    background: var(--ui-checkbox-disabled-bg);
    border: var(--ui-checkbox-disabled-border);
    box-shadow: none;
    transform: none;
  }

  :host([disabled]) .check,
  :host([disabled]) .dash,
  :host([loading]) .check,
  :host([loading]) .dash {
    opacity: 0.72 !important;
  }

  :host([loading]) .spinner {
    opacity: 1;
  }

  .label {
    color: var(--ui-checkbox-label-color);
    font-size: 14px;
    line-height: 1.4;
    letter-spacing: -0.005em;
  }

  .label:empty {
    display: none;
  }

  :host([disabled]) .label,
  :host([loading]) .label {
    color: color-mix(in srgb, var(--ui-checkbox-label-color) 55%, var(--ui-checkbox-muted) 45%);
  }

  :host([headless]) .control {
    display: none;
  }

  :host([headless]) .control-wrap {
    width: 0;
    min-width: 0;
    height: 0;
  }

  :host([headless]) .row {
    gap: 0;
  }

  :host([headless]) .label {
    color: inherit;
    font: inherit;
  }

  @keyframes ui-checkbox-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .check,
    .dash,
    .spinner {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-checkbox-border: 2px solid currentColor;
      --ui-checkbox-checked-border: 2px solid currentColor;
      --ui-checkbox-indeterminate-border: 2px solid currentColor;
      --ui-checkbox-invalid-border: 2px solid currentColor;
      --ui-checkbox-disabled-border: 2px solid currentColor;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-checkbox-background: Canvas;
      --ui-checkbox-border: 1px solid CanvasText;
      --ui-checkbox-checked-background: Highlight;
      --ui-checkbox-checked-border: 1px solid Highlight;
      --ui-checkbox-indeterminate-bg: Highlight;
      --ui-checkbox-indeterminate-border: 1px solid Highlight;
      --ui-checkbox-invalid-border: 1px solid Highlight;
      --ui-checkbox-disabled-bg: Canvas;
      --ui-checkbox-disabled-border: 1px solid GrayText;
      --ui-checkbox-focus: 0 0 0 2px Highlight;
      --ui-checkbox-invalid-focus: 0 0 0 2px Highlight;
      --ui-checkbox-label-color: CanvasText;
    }
  }
`;

function isTruthyAttr(value: string | null): boolean {
  return value !== null && value.toLowerCase() !== 'false' && value !== '0';
}

function isInteractive(node: EventTarget): boolean {
  if (!(node instanceof HTMLElement)) return false;
  return Boolean(node.closest('a, button, input, select, textarea, [contenteditable="true"], [data-ui-checkbox-no-toggle]'));
}

export class UICheckbox extends ElementBase {
  private _uid = `ui-checkbox-${Math.random().toString(36).slice(2, 9)}`;

  static get observedAttributes() {
    return ['checked', 'disabled', 'indeterminate', 'headless', 'loading', 'invalid', 'tabindex'];
  }

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._onClick as EventListener);
    this.addEventListener('keydown', this._onKeyDown as EventListener);
    this._syncA11yState();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick as EventListener);
    this.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'tabindex') {
      this._syncA11yState();
      return;
    }
    this.requestRender();
  }

  get checked() {
    return isTruthyAttr(this.getAttribute('checked'));
  }

  set checked(value: boolean) {
    const next = Boolean(value);
    if (next === this.checked) return;
    if (next) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
  }

  get indeterminate() {
    return isTruthyAttr(this.getAttribute('indeterminate'));
  }

  set indeterminate(value: boolean) {
    const next = Boolean(value);
    if (next === this.indeterminate) return;
    if (next) this.setAttribute('indeterminate', '');
    else this.removeAttribute('indeterminate');
  }

  get disabled() {
    return isTruthyAttr(this.getAttribute('disabled'));
  }

  set disabled(value: boolean) {
    const next = Boolean(value);
    if (next === this.disabled) return;
    if (next) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get loading() {
    return isTruthyAttr(this.getAttribute('loading'));
  }

  set loading(value: boolean) {
    const next = Boolean(value);
    if (next === this.loading) return;
    if (next) this.setAttribute('loading', '');
    else this.removeAttribute('loading');
  }

  get headless() {
    return this.hasAttribute('headless');
  }

  set headless(value: boolean) {
    if (value === this.headless) return;
    if (value) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  get invalid() {
    return isTruthyAttr(this.getAttribute('invalid'));
  }

  set invalid(value: boolean) {
    const next = Boolean(value);
    if (next === this.invalid) return;
    if (next) this.setAttribute('invalid', '');
    else this.removeAttribute('invalid');
  }

  get density() {
    return this.getAttribute('density') || 'default';
  }

  set density(value: string) {
    const normalized = (value || '').trim().toLowerCase();
    if (!normalized || normalized === 'default') {
      this.removeAttribute('density');
      return;
    }
    this.setAttribute('density', normalized);
  }

  get preset() {
    return this.getAttribute('preset') || 'default';
  }

  set preset(value: string) {
    const normalized = (value || '').trim().toLowerCase();
    if (!normalized || normalized === 'default') {
      this.removeAttribute('preset');
      return;
    }
    this.setAttribute('preset', normalized);
  }

  private _syncA11yState() {
    const ariaChecked = this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false';
    const disabled = this.disabled || this.loading;
    const tabIndex = disabled ? '-1' : this.getAttribute('tabindex') || '0';
    const labelId = `${this._uid}-label`;

    this.setAttribute('role', 'checkbox');
    this.setAttribute('aria-checked', ariaChecked);
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.setAttribute('aria-busy', this.loading ? 'true' : 'false');
    if (this.invalid) this.setAttribute('aria-invalid', 'true');
    else this.removeAttribute('aria-invalid');
    this.setAttribute('aria-labelledby', labelId);
    this.setAttribute('tabindex', tabIndex);
  }

  private _toggleFromUser() {
    if (this.disabled || this.loading) return;

    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }

    const detail = { checked: this.checked, indeterminate: this.indeterminate };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _onClick(event: MouseEvent) {
    if (this.disabled || this.loading) return;

    const path = event.composedPath();
    if (path.some((node) => isInteractive(node))) return;
    this._toggleFromUser();
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (this.disabled || this.loading) return;
    if (event.key !== ' ' && event.key !== 'Enter') return;
    event.preventDefault();
    this._toggleFromUser();
  }

  protected render() {
    this._syncA11yState();

    this.setContent(`
      <style>${style}</style>
      <span class="row" part="root">
        <span class="control-wrap" part="hit-area" aria-hidden="true">
          <span class="control" part="control">
            <svg class="check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline class="check-path" points="2.8 8.6 6.7 12.1 13.1 4.9"></polyline>
            </svg>
            <span class="dash"></span>
            <span class="spinner"></span>
          </span>
        </span>
        <span class="label" id="${this._uid}-label" part="label"><slot></slot></span>
      </span>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-checkbox')) {
  customElements.define('ui-checkbox', UICheckbox);
}
