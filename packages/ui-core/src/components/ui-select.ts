import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-block;
    --ui-select-radius: var(--ui-radius, 10px);
    --ui-select-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-select-border-color: var(--ui-color-border, var(--ui-border, rgba(15, 23, 42, 0.16)));
    --ui-select-border: 1px solid var(--ui-select-border-color);
    --ui-select-color: var(--ui-color-text, var(--ui-text, #111827));
    --ui-select-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-select-padding: 8px 12px;
    --ui-select-font: 14px;
    --ui-select-disabled-bg: var(--ui-color-surface-alt, var(--ui-surface-alt, #f3f4f6));
    --ui-select-disabled-color: color-mix(in srgb, var(--ui-select-color) 48%, transparent);
    color-scheme: light dark;
  }
  select {
    padding: var(--ui-select-padding);
    padding-right: calc(12px + 1.4em);
    border-radius: var(--ui-select-radius);
    border: var(--ui-select-border);
    background: var(--ui-select-bg);
    background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position: calc(100% - 15px) calc(50% - 2px), calc(100% - 10px) calc(50% - 2px);
    background-size: 5px 5px, 5px 5px;
    background-repeat: no-repeat;
    color: var(--ui-select-color);
    font-size: var(--ui-select-font);
    outline: none;
    min-width: 120px;
    transition: border-color 0.16s ease, box-shadow 0.16s ease;
    appearance: none;
    width: 100%;
    box-sizing: border-box;
  }
  select:focus-visible {
    border-color: var(--ui-select-focus-ring);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-select-focus-ring) 24%, transparent);
  }
  select:disabled {
    background: var(--ui-select-disabled-bg);
    background-image: none;
    color: var(--ui-select-disabled-color);
    cursor: not-allowed;
    opacity: 0.7;
  }
  @media (prefers-contrast: more) {
    :host {
      --ui-select-border: 2px solid var(--ui-select-border-color);
    }
    select:focus-visible {
      box-shadow: none;
      outline: 2px solid var(--ui-select-focus-ring);
      outline-offset: 1px;
    }
  }
  @media (forced-colors: active) {
    :host {
      --ui-select-bg: Canvas;
      --ui-select-color: CanvasText;
      --ui-select-border-color: CanvasText;
      --ui-select-focus-ring: Highlight;
      --ui-select-disabled-bg: Canvas;
      --ui-select-disabled-color: GrayText;
    }
    select {
      background-image: none;
    }
  }
  :host([headless]) select { display: none; }
`;


export class UISelect extends ElementBase {
  private _controlled: boolean = false;
  private _select: HTMLSelectElement | null = null;
  static get observedAttributes() {
    return ['disabled', 'value', 'headless', 'tabindex'];
  }

  constructor() {
    super();
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._controlled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('input', this._onInput, true);
    this.root.addEventListener('change', this._onChange, true);
      this.root.addEventListener('focusin', this._onFocus as EventListener);
      this.root.addEventListener('focusout', this._onBlur as EventListener);
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this._controlled = this.hasAttribute('value');
  }

  disconnectedCallback() {
    this.root.removeEventListener('input', this._onInput, true);
    this.root.removeEventListener('change', this._onChange, true);
      this.root.removeEventListener('focusin', this._onFocus as EventListener);
      this.root.removeEventListener('focusout', this._onBlur as EventListener);
    super.disconnectedCallback();
  }

  get value() {
    return this.getAttribute('value') || '';
  }
  set value(val: string) {
    if ((val || '') === this.value) return;
    this.setAttribute('value', val);
    this._controlled = true;
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    if (val === this.disabled) return;
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val === this.headless) return;
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  _onInput(e: Event) {
    if (this.disabled) return;
    const select = this._select || (this.root.querySelector('select') as HTMLSelectElement | null);
    if (!select) return;
    const val = select.value;
    if (!this._controlled) {
      this.setAttribute('value', val);
    }
    this.dispatchEvent(new CustomEvent('input', { detail: { value: val }, bubbles: true }));
  }

  _onChange(e: Event) {
    if (this.disabled) return;
    const select = this._select || (this.root.querySelector('select') as HTMLSelectElement | null);
    if (!select) return;
    const val = select.value;
    if (!this._controlled) {
      this.setAttribute('value', val);
    }
    this.dispatchEvent(new CustomEvent('change', { detail: { value: val }, bubbles: true }));
  }

  _onFocus(e: FocusEvent) {
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true }));
  }

  _onBlur(e: FocusEvent) {
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true }));
  }

  protected render() {
    const disabled = this.disabled;
    const value = this.value;
    this.setContent(`
      <style>${style}</style>
      <select ${disabled ? 'disabled' : ''} aria-disabled="${disabled ? 'true' : 'false'}" aria-label="Select" tabindex="0">
        <slot></slot>
      </select>
    `);
    // Set value after render for controlled/uncontrolled
    const select = this.root.querySelector('select') as HTMLSelectElement | null;
    this._select = select;
    if (select && value) select.value = value;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-select')) {
  customElements.define('ui-select', UISelect);
}
