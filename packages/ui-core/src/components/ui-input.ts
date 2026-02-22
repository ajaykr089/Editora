import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-input-padding: var(--ui-padding, 10px 12px);
    --ui-input-border-color: var(--ui-color-border, var(--ui-border-color, #cbd5e1));
    --ui-input-border-width: 1px;
    --ui-input-border-style: solid;
    --ui-input-border: var(--ui-input-border-width) var(--ui-input-border-style) var(--ui-input-border-color);
    --ui-input-border-radius: var(--ui-radius, 10px);
    --ui-input-min-height: var(--ui-min-height, 40px);
    --ui-input-width: 100%;
    --ui-input-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-input-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-label-color: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-description-color: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-input-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-input-error: var(--ui-color-danger, var(--ui-error, #dc2626));
    --ui-input-success: var(--ui-color-success, var(--ui-success, #16a34a));
    --ui-input-warning: var(--ui-color-warning, var(--ui-warning, #d97706));
    --ui-input-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-input-shadow: none;
    --ui-input-gap: 8px;
    --ui-input-meta-gap: 4px;
    --ui-input-shell-gap: 8px;
    --ui-input-placeholder: color-mix(in srgb, var(--ui-input-color) 40%, transparent);
    color-scheme: light dark;
    display: block;
    inline-size: var(--ui-input-width);
    max-inline-size: 100%;
    min-inline-size: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    inline-size: 100%;
    min-inline-size: 0;
    display: grid;
    gap: var(--ui-input-gap);
    color: var(--ui-input-color);
  }

  .meta {
    min-inline-size: 0;
    display: grid;
    gap: var(--ui-input-meta-gap);
  }

  .label {
    margin: 0;
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ui-label-color);
    font: 600 13px/1.35 "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
  }

  .required {
    color: var(--ui-input-error);
    font-size: 12px;
    line-height: 1;
    transform: translateY(-0.5px);
  }

  .description {
    margin: 0;
    color: var(--ui-description-color);
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.01em;
  }

  .description[hidden],
  .label[hidden],
  .prefix[hidden],
  .suffix[hidden],
  .error[hidden],
  .counter[hidden],
  .meta[hidden],
  .footer[hidden] {
    display: none;
  }

  .shell {
    position: relative;
    inline-size: 100%;
    min-inline-size: 0;
    display: flex;
    align-items: center;
    gap: var(--ui-input-shell-gap);
    box-sizing: border-box;
    min-block-size: var(--ui-input-min-height);
    padding-inline: 10px;
    border: var(--ui-input-border);
    border-radius: var(--ui-input-border-radius);
    background: var(--ui-input-bg);
    box-shadow: var(--ui-input-shadow);
    transition: border-color 170ms ease, box-shadow 170ms ease, background-color 170ms ease;
  }

  .shell:focus-within {
    border-color: color-mix(in srgb, var(--ui-input-focus-ring) 56%, var(--ui-input-border-color));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-input-focus-ring) 24%, transparent);
  }

  .prefix,
  .suffix {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: color-mix(in srgb, var(--ui-input-color) 62%, transparent);
    white-space: nowrap;
    line-height: 1;
  }

  .prefix {
    flex: 0 0 auto;
  }

  .suffix {
    flex: 0 0 auto;
    min-inline-size: max-content;
  }

  .suffix ::slotted(*) {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .suffix ::slotted(button) {
    display: inline-flex;
    inline-size: auto;
    max-inline-size: max-content;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  .control {
    flex: 1 1 auto;
    inline-size: 100%;
    min-inline-size: 0;
    position: relative;
    display: grid;
    align-items: center;
  }

  .floating-label {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: color-mix(in srgb, var(--ui-input-color) 44%, transparent);
    font-size: 13px;
    transition: transform 150ms ease, font-size 150ms ease, color 150ms ease, top 150ms ease;
    white-space: nowrap;
  }

  .shell[data-has-value="true"] .floating-label,
  .shell:focus-within .floating-label {
    top: -1px;
    transform: translateY(calc(-100% - 4px));
    font-size: 11px;
    color: var(--ui-label-color);
  }

  input {
    inline-size: 100%;
    min-inline-size: 0;
    box-sizing: border-box;
    border: none;
    background: transparent;
    color: inherit;
    font: 500 14px/1.4 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: var(--ui-input-padding);
    min-block-size: calc(var(--ui-input-min-height) - 2px);
    margin: 0;
    outline: none;
  }

  input::placeholder {
    color: var(--ui-input-placeholder);
  }

  input::-webkit-search-cancel-button {
    display: none;
  }

  .clear-btn {
    flex: 0 0 auto;
    border: none;
    outline: none;
    cursor: pointer;
    inline-size: 22px;
    block-size: 22px;
    border-radius: 7px;
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--ui-input-color) 8%, transparent);
    color: color-mix(in srgb, var(--ui-input-color) 74%, transparent);
    transition: background-color 140ms ease, color 140ms ease;
    padding: 0;
    font-size: 13px;
    line-height: 1;
  }

  .clear-btn:hover {
    background: color-mix(in srgb, var(--ui-input-color) 14%, transparent);
    color: var(--ui-input-color);
  }

  .clear-btn:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-input-focus-ring) 32%, transparent);
  }

  .clear-btn[hidden] {
    display: none;
  }

  .footer {
    min-inline-size: 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
  }

  .error {
    margin: 0;
    min-inline-size: 0;
    color: var(--ui-input-error);
    font-size: 12px;
    line-height: 1.35;
    letter-spacing: 0.01em;
  }

  .counter {
    margin: 0;
    color: var(--ui-description-color);
    font-size: 11px;
    line-height: 1.35;
    white-space: nowrap;
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  :host([disabled]) .shell {
    opacity: 0.64;
    filter: saturate(0.85);
  }

  :host([disabled]) input,
  :host([disabled]) .clear-btn {
    pointer-events: none;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-input-min-height: 34px;
    --ui-input-padding: 7px 8px;
    --ui-input-shell-gap: 6px;
  }

  :host([size="sm"]) input,
  :host([size="1"]) input {
    font-size: 12px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-input-min-height: 46px;
    --ui-input-padding: 11px 14px;
    --ui-input-shell-gap: 10px;
  }

  :host([size="lg"]) input,
  :host([size="3"]) input {
    font-size: 16px;
  }

  :host([variant="classic"]),
  :host([variant="outlined"]) {
    --ui-input-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
  }

  :host([variant="surface"]) {
    --ui-input-bg: var(--ui-color-surface-alt, var(--ui-surface-alt, #f8fafc));
    --ui-input-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 56%, transparent);
  }

  :host([variant="soft"]) {
    --ui-input-bg: color-mix(in srgb, var(--ui-input-accent) 8%, var(--ui-color-surface, #ffffff));
    --ui-input-border-color: color-mix(in srgb, var(--ui-input-accent) 28%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="filled"]) {
    --ui-input-bg: color-mix(in srgb, var(--ui-input-color) 6%, var(--ui-color-surface, #ffffff));
    --ui-input-border-color: transparent;
    --ui-input-border: 1px solid transparent;
  }

  :host([variant="flushed"]) {
    --ui-input-bg: transparent;
    --ui-input-border: 0;
    --ui-input-shadow: none;
  }

  :host([variant="flushed"]) .shell {
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 1px solid color-mix(in srgb, var(--ui-input-border-color) 92%, transparent);
    border-radius: 0;
    padding-inline: 0;
  }

  :host([variant="minimal"]) {
    --ui-input-bg: transparent;
    --ui-input-border: 0;
    --ui-input-shadow: none;
  }

  :host([variant="minimal"]) .shell {
    border-left: none;
    border-right: none;
    border-top: none;
    border-radius: 0;
    padding-inline: 0;
  }

  :host([variant="contrast"]) {
    --ui-input-bg: #0f172a;
    --ui-input-color: #e2e8f0;
    --ui-label-color: #cbd5e1;
    --ui-description-color: #93a4bd;
    --ui-input-border-color: #334155;
    --ui-input-focus-ring: #93c5fd;
    --ui-input-placeholder: color-mix(in srgb, #e2e8f0 46%, transparent);
    --ui-input-shadow: 0 2px 8px rgba(2, 6, 23, 0.24);
  }

  :host([variant="elevated"]) {
    --ui-input-bg: linear-gradient(
      165deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, #ffffff 8%),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 99%, transparent)
    );
    --ui-input-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 62%, transparent);
    --ui-input-shadow:
      0 1px 4px rgba(2, 6, 23, 0.08),
      0 12px 24px rgba(2, 6, 23, 0.12);
  }

  :host([tone="brand"]) {
    --ui-input-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
  }

  :host([tone="success"]) {
    --ui-input-accent: var(--ui-color-success, var(--ui-success, #16a34a));
  }

  :host([tone="warning"]) {
    --ui-input-accent: var(--ui-input-warning);
  }

  :host([tone="danger"]) {
    --ui-input-accent: var(--ui-input-error);
  }

  :host([validation="success"]) {
    --ui-input-border-color: color-mix(in srgb, var(--ui-input-success) 58%, transparent);
  }

  :host([validation="error"]) {
    --ui-input-border-color: color-mix(in srgb, var(--ui-input-error) 62%, transparent);
    --ui-label-color: var(--ui-input-error);
  }

  :host([validation="error"]) .shell {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-input-error) 20%, transparent);
  }

  :host([radius="none"]) {
    --ui-input-border-radius: 0px;
  }

  :host([radius="large"]) {
    --ui-input-border-radius: 14px;
  }

  :host([radius="full"]) {
    --ui-input-border-radius: 999px;
  }

  :host([shape="square"]) {
    --ui-input-border-radius: 4px;
  }

  :host([shape="soft"]) {
    --ui-input-border-radius: 16px;
  }

  :host([density="compact"]) {
    --ui-input-gap: 6px;
    --ui-input-meta-gap: 2px;
    --ui-input-shell-gap: 6px;
  }

  :host([density="comfortable"]) {
    --ui-input-gap: 10px;
    --ui-input-meta-gap: 6px;
    --ui-input-shell-gap: 10px;
  }

  :host([headless]) {
    --ui-input-border: 0;
    --ui-input-shadow: none;
    --ui-input-bg: transparent;
  }

  :host([headless]) .shell {
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding-inline: 0;
    background: transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    .shell,
    .clear-btn,
    .floating-label {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-input-border: 2px solid var(--ui-input-border-color);
    }

    .shell:focus-within {
      box-shadow: none;
      outline: 2px solid var(--ui-input-focus-ring);
      outline-offset: 1px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-input-bg: Canvas;
      --ui-input-color: CanvasText;
      --ui-input-border-color: CanvasText;
      --ui-label-color: CanvasText;
      --ui-description-color: CanvasText;
      --ui-input-focus-ring: Highlight;
      --ui-input-error: CanvasText;
      --ui-input-success: CanvasText;
      --ui-input-shadow: none;
    }

    .shell,
    .clear-btn {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hasMeaningfulNodes(slot: HTMLSlotElement | null): boolean {
  if (!slot) return false;
  const nodes = slot.assignedNodes({ flatten: true });
  if (!nodes.length) return false;

  return nodes.some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
    return node.nodeType === Node.ELEMENT_NODE;
  });
}

function readBooleanHostAttribute(el: HTMLElement, name: string): boolean {
  const raw = el.getAttribute(name);
  if (raw == null) return false;
  const normalized = String(raw).trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function isKnownRadius(radius: string): boolean {
  return radius === 'none' || radius === 'large' || radius === 'full';
}

export class UIInput extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'placeholder',
      'disabled',
      'clearable',
      'size',
      'validation',
      'debounce',
      'maxlength',
      'minlength',
      'readonly',
      'autofocus',
      'counter',
      'floating-label',
      'headless',
      'type',
      'name',
      'required',
      'pattern',
      'inputmode',
      'autocomplete',
      'min',
      'max',
      'step',
      'spellcheck',
      'variant',
      'tone',
      'density',
      'shape',
      'color',
      'radius',
      'label',
      'description',
      'data-error'
    ];
  }

  private _input: HTMLInputElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _formUnregister: (() => void) | null = null;
  private _uid = Math.random().toString(36).slice(2, 9);
  private _autofocusApplied = false;

  constructor() {
    super();
    this._onNativeInput = this._onNativeInput.bind(this);
    this._onNativeChange = this._onNativeChange.bind(this);
    this._onClearClick = this._onClearClick.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);
    this._registerWithForm();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._detachListeners();

    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }

    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }

    this._autofocusApplied = false;
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'value') {
      this._syncInputValue(newValue || '');
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'name') {
      this._registerWithForm();
    }

    if (name === 'autofocus' && !this.hasAttribute('autofocus')) {
      this._autofocusApplied = false;
    }
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    this.setAttribute('value', next || '');
  }

  override focus(options?: FocusOptions): void {
    if (this._input) {
      this._input.focus(options);
      return;
    }
    super.focus(options);
  }

  override blur(): void {
    this._input?.blur();
  }

  select(): void {
    this._input?.select();
  }

  private _emitValueEvent(name: string, value: string): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { value },
        bubbles: true,
        composed: true
      })
    );
  }

  private _registerWithForm(): void {
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }

    try {
      const rootNode = this.getRootNode() as Document | ShadowRoot;
      const host = (rootNode as ShadowRoot).host as HTMLElement | undefined;
      const formFromHost = host?.closest?.('ui-form') || null;
      const parentForm = formFromHost || this.closest('ui-form');
      const name = this.getAttribute('name');

      if (parentForm && typeof (parentForm as any).registerField === 'function' && name) {
        this._formUnregister = (parentForm as any).registerField(name, {
          name,
          getValue: () => this.value,
          setValue: (next: any) => {
            this.value = String(next ?? '');
          },
          validate: async () => {
            if (!this._input) return { valid: true };
            const valid = this._input.checkValidity();
            return { valid, message: this._input.validationMessage || undefined };
          },
          setError: (message?: string) => {
            if (message) {
              this.setAttribute('validation', 'error');
              this.setAttribute('data-error', message);
            } else {
              this.removeAttribute('validation');
              this.removeAttribute('data-error');
            }
          }
        });
      }
    } catch {
      // ignore registration failures to keep component resilient outside form controller context
    }
  }

  private _detachListeners(): void {
    if (this._input) {
      this._input.removeEventListener('input', this._onNativeInput);
      this._input.removeEventListener('change', this._onNativeChange);
    }
    if (this._clearBtn) {
      this._clearBtn.removeEventListener('click', this._onClearClick);
    }
    this._clearBtn = null;
  }

  private _syncInputValue(value: string): void {
    if (this._input && this._input.value !== value) {
      this._input.value = value;
    }

    if (this._clearBtn) {
      const canClear = readBooleanHostAttribute(this, 'clearable') && value.length > 0 && !readBooleanHostAttribute(this, 'disabled') && !this.hasAttribute('readonly');
      if (canClear) this._clearBtn.removeAttribute('hidden');
      else this._clearBtn.setAttribute('hidden', '');
    }

    const counter = this.root.querySelector('.counter') as HTMLElement | null;
    if (counter && this.hasAttribute('counter')) {
      const maxLength = this.getAttribute('maxlength');
      const text = maxLength ? `${value.length}/${maxLength}` : String(value.length);
      counter.textContent = text;
    }

    const shell = this.root.querySelector('.shell') as HTMLElement | null;
    if (shell) {
      shell.setAttribute('data-has-value', value ? 'true' : 'false');
    }
  }

  private _onSlotChange(): void {
    this._syncDerivedState();
  }

  private _syncDerivedState(): void {
    const labelSlot = this.root.querySelector('slot[name="label"]') as HTMLSlotElement | null;
    const descriptionSlot = this.root.querySelector('slot[name="description"]') as HTMLSlotElement | null;
    const errorSlot = this.root.querySelector('slot[name="error"]') as HTMLSlotElement | null;
    const prefixSlot = this.root.querySelector('slot[name="prefix"]') as HTMLSlotElement | null;
    const suffixSlot = this.root.querySelector('slot[name="suffix"]') as HTMLSlotElement | null;

    const labelAttr = (this.getAttribute('label') || '').trim();
    const descAttr = (this.getAttribute('description') || '').trim();
    const errorAttr = (this.getAttribute('data-error') || '').trim();

    const hasLabel = !!labelAttr || hasMeaningfulNodes(labelSlot);
    const hasDescription = !!descAttr || hasMeaningfulNodes(descriptionSlot);
    const hasError = !!errorAttr || hasMeaningfulNodes(errorSlot);
    const hasPrefix = hasMeaningfulNodes(prefixSlot);
    const hasSuffix = hasMeaningfulNodes(suffixSlot);

    const labelEl = this.root.querySelector('.label') as HTMLElement | null;
    const descEl = this.root.querySelector('.description') as HTMLElement | null;
    const prefixEl = this.root.querySelector('.prefix') as HTMLElement | null;
    const suffixEl = this.root.querySelector('.suffix') as HTMLElement | null;
    const metaEl = this.root.querySelector('.meta') as HTMLElement | null;
    const footerEl = this.root.querySelector('.footer') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;
    const counterEl = this.root.querySelector('.counter') as HTMLElement | null;

    if (labelEl) {
      if (hasLabel) labelEl.removeAttribute('hidden');
      else labelEl.setAttribute('hidden', '');
    }

    if (descEl) {
      if (hasDescription) descEl.removeAttribute('hidden');
      else descEl.setAttribute('hidden', '');
    }

    if (prefixEl) {
      if (hasPrefix) prefixEl.removeAttribute('hidden');
      else prefixEl.setAttribute('hidden', '');
    }

    if (suffixEl) {
      if (hasSuffix) suffixEl.removeAttribute('hidden');
      else suffixEl.setAttribute('hidden', '');
    }

    if (metaEl) {
      if (hasLabel || hasDescription) metaEl.removeAttribute('hidden');
      else metaEl.setAttribute('hidden', '');
    }

    const showCounter = this.hasAttribute('counter');
    if (counterEl) {
      if (showCounter) counterEl.removeAttribute('hidden');
      else counterEl.setAttribute('hidden', '');
    }

    if (errorEl) {
      if (hasError) errorEl.removeAttribute('hidden');
      else errorEl.setAttribute('hidden', '');
    }

    if (footerEl) {
      if (hasError || showCounter) footerEl.removeAttribute('hidden');
      else footerEl.setAttribute('hidden', '');
    }

    if (this._input) {
      if (hasLabel) this._input.setAttribute('aria-labelledby', `${this._uid}-label`);
      else this._input.removeAttribute('aria-labelledby');

      const describedBy: string[] = [];
      if (hasDescription) describedBy.push(`${this._uid}-description`);
      if (hasError) describedBy.push(`${this._uid}-error`);

      if (describedBy.length) this._input.setAttribute('aria-describedby', describedBy.join(' '));
      else this._input.removeAttribute('aria-describedby');

      const invalid = this.getAttribute('validation') === 'error' || !!errorAttr;
      if (invalid) this._input.setAttribute('aria-invalid', 'true');
      else this._input.removeAttribute('aria-invalid');

      if (this.hasAttribute('required')) this._input.setAttribute('aria-required', 'true');
      else this._input.removeAttribute('aria-required');
    }
  }

  private _onNativeInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (this.getAttribute('value') !== value) {
      this.setAttribute('value', value);
    } else {
      this._syncInputValue(value);
    }

    this._emitValueEvent('input', value);

    const debounceMs = Number(this.getAttribute('debounce') || 0);
    if (debounceMs > 0) {
      if (this._debounceTimer) clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => {
        this._emitValueEvent('debounced-input', value);
        this._debounceTimer = null;
      }, debounceMs);
    } else {
      this._emitValueEvent('debounced-input', value);
    }
  }

  private _onNativeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._emitValueEvent('change', value);
  }

  private _onClearClick(event: Event): void {
    event.preventDefault();

    if (readBooleanHostAttribute(this, 'disabled') || this.hasAttribute('readonly')) return;

    if (!this._input) return;

    this.value = '';
    this._input.value = '';
    this._input.dispatchEvent(new Event('input', { bubbles: true }));
    this._input.dispatchEvent(new Event('change', { bubbles: true }));

    this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }));

    try {
      this._input.focus({ preventScroll: true });
    } catch {
      this._input.focus();
    }
  }

  protected override render(): void {
    const value = this.getAttribute('value') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const disabled = readBooleanHostAttribute(this, 'disabled');
    const clearable = readBooleanHostAttribute(this, 'clearable');

    const type = this.getAttribute('type') || 'text';
    const name = this.getAttribute('name') || '';
    const required = this.hasAttribute('required');
    const pattern = this.getAttribute('pattern') || '';
    const inputMode = this.getAttribute('inputmode') || '';
    const autoComplete = this.getAttribute('autocomplete') || '';
    const min = this.getAttribute('min') || '';
    const max = this.getAttribute('max') || '';
    const step = this.getAttribute('step') || '';
    const spellcheck = this.getAttribute('spellcheck') || '';
    const maxLength = this.getAttribute('maxlength') || '';
    const minLength = this.getAttribute('minlength') || '';
    const readOnly = this.hasAttribute('readonly');

    const labelAttr = this.getAttribute('label') || '';
    const descriptionAttr = this.getAttribute('description') || '';
    const dataError = this.getAttribute('data-error') || '';
    const validation = this.getAttribute('validation') || '';

    const floatingLabel = this.hasAttribute('floating-label');
    const requiredMarker = required ? '<span class="required" aria-hidden="true">*</span>' : '';

    const color = this.getAttribute('color');
    if (color) this.style.setProperty('--ui-input-accent', color);
    else this.style.removeProperty('--ui-input-accent');

    const radius = this.getAttribute('radius') || '';
    if (radius && !isKnownRadius(radius)) this.style.setProperty('--ui-input-border-radius', radius);
    else this.style.removeProperty('--ui-input-border-radius');

    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="meta" part="meta">
          <label class="label" id="${this._uid}-label" part="label">
            <slot name="label">${escapeHtml(labelAttr)}</slot>
            ${requiredMarker}
          </label>
          <p class="description" id="${this._uid}-description" part="description">
            <slot name="description">${escapeHtml(descriptionAttr)}</slot>
          </p>
        </div>

        <div class="shell" part="shell" data-validation="${escapeHtml(validation || 'none')}" data-has-value="${value ? 'true' : 'false'}">
          <span class="prefix" part="prefix"><slot name="prefix"></slot></span>

          <div class="control" part="control">
            <input
              part="input"
              type="${escapeHtml(type)}"
              name="${escapeHtml(name)}"
              value="${escapeHtml(value)}"
              placeholder="${escapeHtml(placeholder)}"
              ${required ? 'required' : ''}
              ${pattern ? `pattern="${escapeHtml(pattern)}"` : ''}
              ${inputMode ? `inputmode="${escapeHtml(inputMode)}"` : ''}
              ${autoComplete ? `autocomplete="${escapeHtml(autoComplete)}"` : ''}
              ${min ? `min="${escapeHtml(min)}"` : ''}
              ${max ? `max="${escapeHtml(max)}"` : ''}
              ${step ? `step="${escapeHtml(step)}"` : ''}
              ${spellcheck ? `spellcheck="${escapeHtml(spellcheck)}"` : ''}
              ${maxLength ? `maxlength="${escapeHtml(maxLength)}"` : ''}
              ${minLength ? `minlength="${escapeHtml(minLength)}"` : ''}
              ${disabled ? 'disabled' : ''}
              ${readOnly ? 'readonly' : ''}
            />
            ${floatingLabel ? `<span class="floating-label" part="floating-label">${escapeHtml(labelAttr || placeholder || name || 'Input')}</span>` : ''}
          </div>

          <button class="clear-btn" part="clear" aria-label="Clear" ${clearable && value && !disabled && !readOnly ? '' : 'hidden'}>✕</button>

          <span class="suffix" part="suffix"><slot name="suffix"></slot></span>
        </div>

        <div class="footer" part="footer">
          <p class="error" id="${this._uid}-error" part="error" aria-live="polite">
            ${dataError ? escapeHtml(dataError) : '<slot name="error"></slot>'}
          </p>
          <p class="counter" part="counter"></p>
        </div>
      </div>
    `);

    this._detachListeners();

    this._input = this.root.querySelector('input');
    this._clearBtn = this.root.querySelector('button.clear-btn') as HTMLButtonElement | null;

    if (this._input) {
      this._input.addEventListener('input', this._onNativeInput);
      this._input.addEventListener('change', this._onNativeChange);
    }

    this._clearBtn?.addEventListener('click', this._onClearClick);

    this._syncInputValue(value);
    this._syncDerivedState();

    if (this.hasAttribute('autofocus') && !this._autofocusApplied) {
      this._autofocusApplied = true;
      queueMicrotask(() => {
        if (!this.isConnected) return;
        try {
          this._input?.focus({ preventScroll: true });
        } catch {
          this._input?.focus();
        }
      });
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-input')) {
  customElements.define('ui-input', UIInput);
}
