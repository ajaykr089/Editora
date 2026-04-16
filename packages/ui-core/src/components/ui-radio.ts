import { ElementBase } from '../ElementBase';

type RadioTone = 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

type RadioChangeDetail = {
  checked: boolean;
  value?: string;
  name?: string;
  reason?: 'click' | 'keyboard';
};

const style = `
  :host {
    --ui-radio-size: 18px;
    --ui-radio-hit-area: 24px;
    --ui-radio-dot-size: 8px;
    --ui-radio-border: 1.5px solid color-mix(in srgb, var(--ui-radio-accent, var(--ui-primary, var(--ui-color-primary, #2563eb))) 44%, var(--ui-color-border, #cbd5e1) 56%);
    --ui-radio-background: var(--ui-bg, var(--ui-color-surface, #ffffff));
    --ui-radio-accent: var(--ui-primary, var(--ui-color-primary, #2563eb));
    --ui-radio-dot-color: var(--ui-radio-accent);
    --ui-radio-focus: 0 0 0 4px color-mix(in srgb, var(--ui-radio-accent) 24%, transparent);
    --ui-radio-invalid: var(--ui-color-danger, #dc2626);
    --ui-radio-invalid-focus: 0 0 0 4px color-mix(in srgb, var(--ui-radio-invalid) 24%, transparent);
    --ui-radio-disabled-bg: color-mix(in srgb, var(--ui-color-surface-alt, #f1f5f9) 88%, #ffffff 12%);
    --ui-radio-disabled-border: 1.5px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-radio-label-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-radio-muted: var(--ui-color-muted, #64748b);
    --ui-radio-duration: 170ms;
    --ui-radio-easing: cubic-bezier(0.2, 0.8, 0.2, 1);

    display: inline-flex;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    color-scheme: light dark;
  }

  :host([density="compact"]) {
    --ui-radio-size: 16px;
    --ui-radio-hit-area: 20px;
    --ui-radio-dot-size: 7px;
    --ui-radio-duration: 140ms;
  }

  :host([density="compact"]) .label {
    font-size: 13px;
    line-height: 1.35;
  }

  :host([density="comfortable"]) {
    --ui-radio-size: 20px;
    --ui-radio-hit-area: 28px;
    --ui-radio-dot-size: 9px;
  }

  :host([density="comfortable"]) .label {
    font-size: 15px;
  }

  :host([tone="neutral"]) { --ui-radio-accent: #64748b; }
  :host([tone="success"]) { --ui-radio-accent: #16a34a; }
  :host([tone="warning"]) { --ui-radio-accent: #d97706; }
  :host([tone="danger"]) { --ui-radio-accent: #dc2626; }
  :host([tone="info"]) { --ui-radio-accent: #0ea5e9; }

  :host([disabled]),
  :host([loading]) {
    cursor: not-allowed;
  }

  .row {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: var(--ui-radio-hit-area);
  }

  .control-wrap {
    width: var(--ui-radio-hit-area);
    min-width: var(--ui-radio-hit-area);
    height: var(--ui-radio-hit-area);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .control {
    width: var(--ui-radio-size);
    min-width: var(--ui-radio-size);
    height: var(--ui-radio-size);
    border-radius: 999px;
    border: var(--ui-radio-border);
    background: var(--ui-radio-background);
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    transition:
      border-color var(--ui-radio-duration) var(--ui-radio-easing),
      background-color var(--ui-radio-duration) var(--ui-radio-easing),
      box-shadow var(--ui-radio-duration) var(--ui-radio-easing),
      transform var(--ui-radio-duration) var(--ui-radio-easing);
  }

  .control::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(180deg, color-mix(in srgb, #ffffff 26%, transparent), transparent 56%);
    opacity: 0.18;
    pointer-events: none;
    transition: opacity var(--ui-radio-duration) var(--ui-radio-easing);
  }

  .dot {
    width: var(--ui-radio-dot-size);
    height: var(--ui-radio-dot-size);
    border-radius: 999px;
    background: var(--ui-radio-dot-color);
    opacity: 0;
    transform: scale(0.2);
    transition:
      opacity var(--ui-radio-duration) var(--ui-radio-easing),
      transform var(--ui-radio-duration) var(--ui-radio-easing);
  }

  .spinner {
    position: absolute;
    width: calc(var(--ui-radio-size) - 5px);
    height: calc(var(--ui-radio-size) - 5px);
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, currentColor 25%, transparent);
    border-top-color: currentColor;
    opacity: 0;
    animation: ui-radio-spin 700ms linear infinite;
    pointer-events: none;
  }

  :host([checked]) .control {
    border-color: var(--ui-radio-accent);
    background: color-mix(in srgb, var(--ui-radio-accent) 8%, var(--ui-radio-background));
  }

  :host([checked]) .control::before {
    opacity: 0.28;
  }

  :host([checked]) .dot {
    opacity: 1;
    transform: scale(1);
  }

  :host(:focus-visible) .control {
    box-shadow: var(--ui-radio-focus);
  }

  :host(:not([disabled]):not([loading]):hover) .control {
    transform: translateY(-0.5px);
    border-color: color-mix(in srgb, var(--ui-radio-accent) 80%, #0f172a 20%);
  }

  :host(:not([disabled]):not([loading]):active) .control {
    transform: scale(0.96);
  }

  :host([invalid]) .control {
    border-color: var(--ui-radio-invalid);
  }

  :host([invalid]:focus-visible) .control {
    box-shadow: var(--ui-radio-invalid-focus);
  }

  :host([disabled]) .control,
  :host([loading]) .control {
    background: var(--ui-radio-disabled-bg);
    border: var(--ui-radio-disabled-border);
    box-shadow: none;
    transform: none;
  }

  :host([loading]) .spinner {
    opacity: 1;
  }

  .label {
    color: var(--ui-radio-label-color);
    font-size: 14px;
    line-height: 1.4;
    letter-spacing: -0.005em;
  }

  .label:empty {
    display: none;
  }

  :host([disabled]) .label,
  :host([loading]) .label {
    color: color-mix(in srgb, var(--ui-radio-label-color) 55%, var(--ui-radio-muted) 45%);
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

  @keyframes ui-radio-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .dot,
    .spinner {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-radio-border: 2px solid currentColor;
      --ui-radio-disabled-border: 2px solid currentColor;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-radio-background: Canvas;
      --ui-radio-border: 1px solid CanvasText;
      --ui-radio-accent: Highlight;
      --ui-radio-invalid: Highlight;
      --ui-radio-disabled-bg: Canvas;
      --ui-radio-disabled-border: 1px solid GrayText;
      --ui-radio-focus: 0 0 0 2px Highlight;
      --ui-radio-invalid-focus: 0 0 0 2px Highlight;
      --ui-radio-label-color: CanvasText;
    }
  }
`;

function isTruthyAttr(value: string | null): boolean {
  return value !== null && value.toLowerCase() !== 'false' && value !== '0';
}

function isInteractive(node: EventTarget): boolean {
  if (!(node instanceof HTMLElement)) return false;
  return Boolean(node.closest('a, button, input, select, textarea, [contenteditable="true"], [data-ui-radio-no-toggle]'));
}

export class UIRadio extends ElementBase {
  private _uid = `ui-radio-${Math.random().toString(36).slice(2, 9)}`;

  static get observedAttributes() {
    return [
      'checked',
      'disabled',
      'loading',
      'invalid',
      'required',
      'headless',
      'name',
      'value',
      'tabindex'
    ];
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
    if (this.checked) this._uncheckSiblings();
    this._syncA11yState();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick as EventListener);
    this.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if ((name === 'checked' || name === 'name') && this.checked) {
      this._uncheckSiblings();
    }
    this._syncA11yState();
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

  get invalid() {
    return isTruthyAttr(this.getAttribute('invalid'));
  }

  set invalid(value: boolean) {
    const next = Boolean(value);
    if (next === this.invalid) return;
    if (next) this.setAttribute('invalid', '');
    else this.removeAttribute('invalid');
  }

  get required() {
    return isTruthyAttr(this.getAttribute('required'));
  }

  set required(value: boolean) {
    const next = Boolean(value);
    if (next === this.required) return;
    if (next) this.setAttribute('required', '');
    else this.removeAttribute('required');
  }

  get headless() {
    return this.hasAttribute('headless');
  }

  set headless(value: boolean) {
    if (value === this.headless) return;
    if (value) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(value: string) {
    const next = String(value || '').trim();
    if (!next) {
      this.removeAttribute('name');
      return;
    }
    this.setAttribute('name', next);
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    const normalized = String(next || '');
    if (!normalized) {
      this.removeAttribute('value');
      return;
    }
    this.setAttribute('value', normalized);
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

  get tone(): RadioTone {
    const tone = this.getAttribute('tone');
    if (tone === 'neutral' || tone === 'success' || tone === 'warning' || tone === 'danger' || tone === 'info') {
      return tone;
    }
    return 'brand';
  }

  set tone(value: RadioTone) {
    const normalized = (value || '').trim().toLowerCase();
    if (!normalized || normalized === 'brand') {
      this.removeAttribute('tone');
      return;
    }
    this.setAttribute('tone', normalized);
  }

  private _syncA11yState() {
    const disabled = this.disabled || this.loading;
    const tabIndex = disabled ? '-1' : this.getAttribute('tabindex') || '0';
    const labelId = `${this._uid}-label`;

    this.setAttribute('role', 'radio');
    this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.setAttribute('aria-busy', this.loading ? 'true' : 'false');
    this.setAttribute('aria-required', this.required ? 'true' : 'false');
    if (this.invalid) this.setAttribute('aria-invalid', 'true');
    else this.removeAttribute('aria-invalid');
    this.setAttribute('aria-labelledby', labelId);
    this.setAttribute('tabindex', tabIndex);
  }

  private _resolveQueryScope(): ParentNode | null {
    const formOwner = this.closest('form, ui-form');
    if (formOwner) return formOwner;

    const rootNode = this.getRootNode();
    if (rootNode instanceof Document || rootNode instanceof ShadowRoot) return rootNode;
    if (rootNode instanceof Element) return rootNode;

    return null;
  }

  private _getGroupMembers(): UIRadio[] {
    const name = this.name.trim();
    if (!name) return [this];

    const scope = this._resolveQueryScope();
    if (!scope || !('querySelectorAll' in scope)) return [this];

    return Array.from(scope.querySelectorAll('ui-radio')).filter(
      (node): node is UIRadio => node instanceof UIRadio && node.name === name
    );
  }

  private _uncheckSiblings() {
    const group = this._getGroupMembers();
    group.forEach((radio) => {
      if (radio === this) return;
      if (radio.checked) radio.checked = false;
    });
  }

  private _focusSelf() {
    try {
      this.focus({ preventScroll: true });
    } catch {
      this.focus();
    }
  }

  private _checkFromUser(reason: 'click' | 'keyboard') {
    if (this.disabled || this.loading || this.checked) return;

    this.checked = true;

    const detail: RadioChangeDetail = {
      checked: true,
      value: this.value || undefined,
      name: this.name || undefined,
      reason
    };

    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _moveGroupSelection(step: 1 | -1) {
    const enabledGroup = this._getGroupMembers().filter((radio) => !radio.disabled && !radio.loading);
    if (enabledGroup.length <= 1) return;

    const currentIndex = Math.max(enabledGroup.indexOf(this), 0);
    const nextIndex = (currentIndex + step + enabledGroup.length) % enabledGroup.length;
    const nextRadio = enabledGroup[nextIndex];
    if (!nextRadio || nextRadio === this) return;

    nextRadio._checkFromUser('keyboard');
    nextRadio._focusSelf();
  }

  private _onClick(event: MouseEvent) {
    if (this.disabled || this.loading) return;

    const path = event.composedPath();
    if (path.some((node) => isInteractive(node))) return;
    this._checkFromUser('click');
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (this.disabled || this.loading) return;

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this._checkFromUser('keyboard');
      return;
    }

    if (!this.name) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      this._moveGroupSelection(1);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      this._moveGroupSelection(-1);
    }
  }

  protected render() {
    this._syncA11yState();

    this.setContent(`
      <style>${style}</style>
      <span class="row" part="root">
        <span class="control-wrap" part="hit-area" aria-hidden="true">
          <span class="control" part="control">
            <span class="dot" part="dot"></span>
            <span class="spinner" part="spinner"></span>
          </span>
        </span>
        <span class="label" id="${this._uid}-label" part="label"><slot></slot></span>
      </span>
    `);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-radio': UIRadio;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-radio')) {
  customElements.define('ui-radio', UIRadio);
}
