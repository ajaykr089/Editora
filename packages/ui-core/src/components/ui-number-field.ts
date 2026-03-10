import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-number-field-padding: var(--ui-padding, 10px 12px);
    --ui-number-field-border-color: var(--ui-color-border, var(--ui-border-color, #cbd5e1));
    --ui-number-field-border-width: 1px;
    --ui-number-field-border-style: solid;
    --ui-number-field-border:
      var(--ui-number-field-border-width) var(--ui-number-field-border-style) var(--ui-number-field-border-color);
    --ui-number-field-radius: var(--ui-radius, 10px);
    --ui-number-field-min-height: var(--ui-min-height, 40px);
    --ui-number-field-width: 100%;
    --ui-number-field-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-number-field-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-number-field-muted: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-number-field-focus: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-number-field-danger: var(--ui-color-danger, var(--ui-error, #dc2626));
    --ui-number-field-shadow: none;
    --ui-number-field-gap: 8px;
    --ui-number-field-shell-gap: 8px;
    --ui-number-field-meta-gap: 4px;
    --ui-number-field-placeholder: color-mix(in srgb, var(--ui-number-field-color) 40%, transparent);
    color-scheme: light dark;
    display: block;
    inline-size: var(--ui-number-field-width);
    max-inline-size: 100%;
    min-inline-size: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    inline-size: 100%;
    min-inline-size: 0;
    display: grid;
    gap: var(--ui-number-field-gap);
    color: var(--ui-number-field-color);
  }

  .meta {
    min-inline-size: 0;
    display: grid;
    gap: var(--ui-number-field-meta-gap);
  }

  .label {
    margin: 0;
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ui-number-field-muted);
    font: 600 13px/1.35 "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
  }

  .required {
    color: var(--ui-number-field-danger);
    font-size: 12px;
    line-height: 1;
  }

  .description,
  .error {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.01em;
  }

  .description {
    color: var(--ui-number-field-muted);
  }

  .error {
    color: var(--ui-number-field-danger);
  }

  .meta[hidden],
  .label[hidden],
  .description[hidden],
  .prefix[hidden],
  .suffix[hidden],
  .footer[hidden],
  .error[hidden],
  .steppers[hidden] {
    display: none;
  }

  .shell {
    position: relative;
    inline-size: 100%;
    min-inline-size: 0;
    display: flex;
    align-items: center;
    gap: var(--ui-number-field-shell-gap);
    box-sizing: border-box;
    min-block-size: var(--ui-number-field-min-height);
    padding-inline: 10px;
    border: var(--ui-number-field-border);
    border-radius: var(--ui-number-field-radius);
    background: var(--ui-number-field-bg);
    box-shadow: var(--ui-number-field-shadow);
    transition: border-color 170ms ease, box-shadow 170ms ease, background-color 170ms ease;
  }

  .shell[data-show-steppers="true"] {
    padding-inline-end: 4px;
  }

  .shell:focus-within {
    border-color: color-mix(in srgb, var(--ui-number-field-focus) 56%, var(--ui-number-field-border-color));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-number-field-focus) 24%, transparent);
  }

  .prefix,
  .suffix {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: color-mix(in srgb, var(--ui-number-field-color) 62%, transparent);
    white-space: nowrap;
    line-height: 1;
  }

  .control {
    flex: 1 1 auto;
    min-inline-size: 0;
    display: grid;
    align-items: center;
  }

  input {
    inline-size: 100%;
    min-inline-size: 0;
    box-sizing: border-box;
    border: none;
    background: transparent;
    color: inherit;
    font: 500 14px/1.4 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: var(--ui-number-field-padding);
    min-block-size: calc(var(--ui-number-field-min-height) - 2px);
    margin: 0;
    outline: none;
    text-align: var(--ui-number-field-align, right);
  }

  input::placeholder {
    color: var(--ui-number-field-placeholder);
  }

  .steppers {
    flex: 0 0 auto;
    display: grid;
    grid-template-rows: 1fr 1fr;
    align-self: stretch;
    align-items: stretch;
    inline-size: 28px;
    min-block-size: calc(var(--ui-number-field-min-height) - 6px);
    margin-inline-start: auto;
    border-inline-start: 1px solid color-mix(in srgb, var(--ui-number-field-border-color) 82%, transparent);
    padding-inline-start: 4px;
  }

  .stepper-slot {
    display: block;
    min-block-size: 0;
  }

  .stepper-btn,
  .steppers ::slotted([slot="increment-trigger"]),
  .steppers ::slotted([slot="decrement-trigger"]) {
    inline-size: 100%;
    min-inline-size: 0;
    block-size: 100%;
    min-block-size: 0;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: color-mix(in srgb, var(--ui-number-field-color) 62%, transparent);
    display: grid;
    place-items: center;
    cursor: pointer;
    padding: 0;
    font: 700 10px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height: 1;
    transition: background-color 140ms ease, color 140ms ease, transform 140ms ease;
  }

  .stepper-btn:hover,
  .steppers ::slotted([slot="increment-trigger"]:hover),
  .steppers ::slotted([slot="decrement-trigger"]:hover) {
    background: color-mix(in srgb, var(--ui-number-field-color) 8%, transparent);
    color: var(--ui-number-field-color);
  }

  .stepper-btn:active,
  .steppers ::slotted([slot="increment-trigger"]:active),
  .steppers ::slotted([slot="decrement-trigger"]:active) {
    background: color-mix(in srgb, var(--ui-number-field-color) 12%, transparent);
    transform: scale(0.97);
  }

  .stepper-btn:focus-visible,
  .steppers ::slotted([slot="increment-trigger"]:focus-visible),
  .steppers ::slotted([slot="decrement-trigger"]:focus-visible) {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-number-field-focus) 28%, transparent);
    outline: none;
  }

  .stepper-icon {
    display: block;
    font-size: 16px;
    line-height: 1;
    letter-spacing: -0.04em;
    transform: translateY(-0.5px);
    user-select: none;
    pointer-events: none;
  }

  .stepper-slot:last-child .stepper-icon {
    transform: translateY(0.5px);
  }

  .footer {
    min-inline-size: 0;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  :host([disabled]) .shell {
    opacity: 0.64;
    filter: saturate(0.85);
  }

  :host([disabled]) input,
  :host([disabled]) .stepper-btn {
    pointer-events: none;
  }

  :host([invalid]),
  :host([data-internal-invalid]) {
    --ui-number-field-border-color: color-mix(in srgb, var(--ui-number-field-danger) 62%, transparent);
  }

  :host([invalid]) .shell,
  :host([data-internal-invalid]) .shell {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-number-field-danger) 20%, transparent);
  }

  :host([size="sm"]) {
    --ui-number-field-min-height: 34px;
    --ui-number-field-padding: 7px 8px;
    --ui-number-field-shell-gap: 6px;
  }

  :host([size="sm"]) .steppers {
    inline-size: 24px;
  }

  :host([size="sm"]) .stepper-icon {
    font-size: 10px;
  }

  :host([size="lg"]) {
    --ui-number-field-min-height: 46px;
    --ui-number-field-padding: 11px 14px;
    --ui-number-field-shell-gap: 10px;
  }

  :host([size="lg"]) .steppers {
    inline-size: 32px;
  }

  :host([size="lg"]) .stepper-icon {
    font-size: 12px;
  }

  :host([variant="surface"]) {
    --ui-number-field-bg: var(--ui-color-surface-alt, var(--ui-surface-alt, #f8fafc));
  }

  :host([variant="soft"]) {
    --ui-number-field-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 8%, var(--ui-color-surface, #ffffff));
    --ui-number-field-border-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 28%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="contrast"]) {
    --ui-number-field-bg: #0f172a;
    --ui-number-field-color: #e2e8f0;
    --ui-number-field-muted: #94a3b8;
    --ui-number-field-border-color: #334155;
    --ui-number-field-focus: #93c5fd;
    --ui-number-field-placeholder: color-mix(in srgb, #e2e8f0 46%, transparent);
    --ui-number-field-shadow: 0 2px 8px rgba(2, 6, 23, 0.24);
  }

  @media (prefers-reduced-motion: reduce) {
    .shell,
    .stepper-btn {
      transition: none !important;
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
    if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
    return node.nodeType === Node.ELEMENT_NODE;
  });
}

function readBooleanHostAttribute(el: HTMLElement, name: string): boolean {
  const raw = el.getAttribute(name);
  if (raw == null) return false;
  const normalized = String(raw).trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function parseNumberAttribute(value: string | null): number | null {
  if (value == null || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function countFractionDigits(value: number): number {
  const normalized = String(value);
  const exponentMatch = normalized.match(/e-(\d+)$/i);
  if (exponentMatch) return Number(exponentMatch[1]);
  const fraction = normalized.split('.')[1];
  return fraction ? fraction.length : 0;
}

function roundToPrecision(value: number, precision: number | null): number {
  if (precision == null || precision < 0) return value;
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function clamp(value: number, min: number | null, max: number | null): number {
  if (min != null && value < min) return min;
  if (max != null && value > max) return max;
  return value;
}

function getStepBase(min: number | null): number {
  return min ?? 0;
}

function isStepAligned(value: number, step: number | null, base: number, precision: number | null): boolean {
  if (step == null || step <= 0) return true;
  const normalized = roundToPrecision((value - base) / step, precision != null ? precision + 2 : 8);
  return Math.abs(normalized - Math.round(normalized)) < 1e-7;
}

function getLocaleSeparators(locale: string): { group: string; decimal: string } {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  return {
    group: parts.find((part) => part.type === 'group')?.value || ',',
    decimal: parts.find((part) => part.type === 'decimal')?.value || '.'
  };
}

function parseLocalizedNumber(raw: string, locale: string): number | null {
  const input = raw.trim();
  if (!input) return null;
  const { group, decimal } = getLocaleSeparators(locale);
  let normalized = input.replace(/[\s\u00a0\u202f]/g, '');
  if (group) normalized = normalized.split(group).join('');
  if (decimal && decimal !== '.') normalized = normalized.split(decimal).join('.');
  normalized = normalized.replace(/[−–]/g, '-');
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function canonicalizeNumber(value: number, precision: number | null): string {
  if (precision != null && precision >= 0) return value.toFixed(precision);
  return String(value);
}

type NumberFieldSource = 'blur' | 'step' | 'wheel' | 'keyboard' | 'programmatic' | 'input';
type InvalidReason = 'min' | 'max' | 'step' | 'parse';

export class UINumberField extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'min',
      'max',
      'step',
      'precision',
      'locale',
      'format',
      'name',
      'placeholder',
      'disabled',
      'readonly',
      'required',
      'invalid',
      'allow-wheel',
      'show-steppers',
      'clamp-on-blur',
      'autocomplete',
      'inputmode',
      'label',
      'description',
      'data-error',
      'size',
      'variant'
    ];
  }

  private _input: HTMLInputElement | null = null;
  private _formUnregister: (() => void) | null = null;
  private _uid = Math.random().toString(36).slice(2, 9);
  private _rawValue = '';
  private _isEditing = false;
  private _internalInvalidReason: InvalidReason | null = null;

  constructor() {
    super();
    this._onInput = this._onInput.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onClick = this._onClick.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);
    this.addEventListener('click', this._onClick);
    this._registerWithForm();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this.removeEventListener('click', this._onClick);
    this._detachListeners();
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    return name === 'label' || name === 'description' || name === 'data-error';
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'value') {
      this._rawValue = newValue || '';
      this._clearInternalInvalid();
      this._syncDisplayValue();
      this._syncAria();
      return;
    }

    if (name === 'name') this._registerWithForm();

    if (
      name === 'min' ||
      name === 'max' ||
      name === 'step' ||
      name === 'precision' ||
      name === 'locale' ||
      name === 'format' ||
      name === 'placeholder' ||
      name === 'disabled' ||
      name === 'readonly' ||
      name === 'required' ||
      name === 'allow-wheel' ||
      name === 'show-steppers' ||
      name === 'clamp-on-blur' ||
      name === 'autocomplete' ||
      name === 'inputmode' ||
      name === 'size' ||
      name === 'variant' ||
      name === 'invalid'
    ) {
      this._syncControlAttrs();
      this._syncDisplayValue();
      this._syncDerivedState();
      this._syncAria();
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    if (!next) this.removeAttribute('value');
    else this.setAttribute('value', next);
  }

  get valueAsNumber(): number | null {
    return parseNumberAttribute(this.getAttribute('value'));
  }

  get rawValue(): string {
    return this._rawValue;
  }

  set rawValue(next: string) {
    this._rawValue = String(next ?? '');
    if (this._input) this._input.value = this._rawValue;
    this._syncAria();
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

  stepUp(count = 1): void {
    this._stepBy(Math.max(1, Number(count) || 1), 'step');
  }

  stepDown(count = 1): void {
    this._stepBy(-Math.max(1, Number(count) || 1), 'step');
  }

  private _locale(): string {
    return this.getAttribute('locale') || Intl.NumberFormat().resolvedOptions().locale || 'en-US';
  }

  private _precision(): number | null {
    const attr = this.getAttribute('precision');
    if (attr == null || attr.trim() === '') return null;
    const parsed = Number(attr);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
  }

  private _step(): number | null {
    const raw = this.getAttribute('step');
    if (raw == null || raw === '' || raw === 'any') return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  private _effectivePrecision(): number | null {
    const precision = this._precision();
    if (precision != null) return precision;
    const step = this._step();
    return step != null ? countFractionDigits(step) : null;
  }

  private _min(): number | null {
    return parseNumberAttribute(this.getAttribute('min'));
  }

  private _max(): number | null {
    return parseNumberAttribute(this.getAttribute('max'));
  }

  private _formatNumber(value: number): string {
    const precision = this._effectivePrecision();
    const useGrouping = this.getAttribute('format') !== 'plain';
    return new Intl.NumberFormat(this._locale(), {
      useGrouping,
      minimumFractionDigits: precision ?? 0,
      maximumFractionDigits: precision ?? 20
    }).format(value);
  }

  private _displayStringForValue(): string {
    if (this._isEditing) return this._rawValue;
    const value = this.valueAsNumber;
    if (value == null) return this._rawValue;
    return this._formatNumber(value);
  }

  private _syncDisplayValue(): void {
    if (!this._input) return;
    const next = this._displayStringForValue();
    if (this._input.value !== next) this._input.value = next;
    const shell = this.root.querySelector('.shell') as HTMLElement | null;
    if (shell) shell.setAttribute('data-has-value', next ? 'true' : 'false');
  }

  private _syncControlAttrs(): void {
    if (!this._input) return;
    this._input.placeholder = this.getAttribute('placeholder') || '';
    this._input.disabled = readBooleanHostAttribute(this, 'disabled');
    this._input.readOnly = this.hasAttribute('readonly');
    this._input.required = this.hasAttribute('required');
    this._input.name = this.getAttribute('name') || '';
    this._input.setAttribute('inputmode', this.getAttribute('inputmode') || 'decimal');

    const autoComplete = this.getAttribute('autocomplete');
    if (autoComplete) this._input.setAttribute('autocomplete', autoComplete);
    else this._input.removeAttribute('autocomplete');
  }

  private _syncAria(): void {
    if (!this._input) return;

    const value = this.valueAsNumber;
    this._input.setAttribute('role', 'spinbutton');
    this._input.setAttribute('aria-valuetext', this._input.value || '');

    const min = this._min();
    const max = this._max();
    if (min != null) this._input.setAttribute('aria-valuemin', String(min));
    else this._input.removeAttribute('aria-valuemin');
    if (max != null) this._input.setAttribute('aria-valuemax', String(max));
    else this._input.removeAttribute('aria-valuemax');
    if (value != null) this._input.setAttribute('aria-valuenow', String(value));
    else this._input.removeAttribute('aria-valuenow');

    const labelSlot = this.root.querySelector('slot[name="label"]') as HTMLSlotElement | null;
    const descriptionSlot = this.root.querySelector('slot[name="description"]') as HTMLSlotElement | null;
    const errorSlot = this.root.querySelector('slot[name="error"]') as HTMLSlotElement | null;
    const hasLabel = Boolean((this.getAttribute('label') || '').trim()) || hasMeaningfulNodes(labelSlot);
    const hasDescription = Boolean((this.getAttribute('description') || '').trim()) || hasMeaningfulNodes(descriptionSlot);
    const hasError = Boolean((this.getAttribute('data-error') || '').trim()) || hasMeaningfulNodes(errorSlot);

    if (hasLabel) this._input.setAttribute('aria-labelledby', `${this._uid}-label`);
    else this._input.removeAttribute('aria-labelledby');

    const describedBy: string[] = [];
    if (hasDescription) describedBy.push(`${this._uid}-description`);
    if (hasError) describedBy.push(`${this._uid}-error`);
    if (describedBy.length) this._input.setAttribute('aria-describedby', describedBy.join(' '));
    else this._input.removeAttribute('aria-describedby');

    if (this.hasAttribute('required')) this._input.setAttribute('aria-required', 'true');
    else this._input.removeAttribute('aria-required');

    const invalid = this.hasAttribute('invalid') || this._internalInvalidReason != null || hasError;
    if (invalid) this._input.setAttribute('aria-invalid', 'true');
    else this._input.removeAttribute('aria-invalid');
  }

  private _syncDerivedState(): void {
    const labelSlot = this.root.querySelector('slot[name="label"]') as HTMLSlotElement | null;
    const descriptionSlot = this.root.querySelector('slot[name="description"]') as HTMLSlotElement | null;
    const errorSlot = this.root.querySelector('slot[name="error"]') as HTMLSlotElement | null;
    const prefixSlot = this.root.querySelector('slot[name="prefix"]') as HTMLSlotElement | null;
    const suffixSlot = this.root.querySelector('slot[name="suffix"]') as HTMLSlotElement | null;
    const incSlot = this.root.querySelector('slot[name="increment-trigger"]') as HTMLSlotElement | null;
    const decSlot = this.root.querySelector('slot[name="decrement-trigger"]') as HTMLSlotElement | null;

    const hasLabel = Boolean((this.getAttribute('label') || '').trim()) || hasMeaningfulNodes(labelSlot);
    const hasDescription = Boolean((this.getAttribute('description') || '').trim()) || hasMeaningfulNodes(descriptionSlot);
    const hasError = Boolean((this.getAttribute('data-error') || '').trim()) || hasMeaningfulNodes(errorSlot);
    const hasPrefix = hasMeaningfulNodes(prefixSlot);
    const hasSuffix = hasMeaningfulNodes(suffixSlot);
    const hasCustomInc = hasMeaningfulNodes(incSlot);
    const hasCustomDec = hasMeaningfulNodes(decSlot);
    const showSteppers = readBooleanHostAttribute(this, 'show-steppers') || hasCustomInc || hasCustomDec;

    const toggleHidden = (selector: string, visible: boolean) => {
      const node = this.root.querySelector(selector) as HTMLElement | null;
      if (!node) return;
      if (visible) node.removeAttribute('hidden');
      else node.setAttribute('hidden', '');
    };

    toggleHidden('.meta', hasLabel || hasDescription);
    toggleHidden('.label', hasLabel);
    toggleHidden('.description', hasDescription);
    toggleHidden('.prefix', hasPrefix);
    toggleHidden('.suffix', hasSuffix);
    toggleHidden('.footer', hasError);
    toggleHidden('.error', hasError);
    toggleHidden('.steppers', showSteppers);

    const shell = this.root.querySelector('.shell') as HTMLElement | null;
    if (shell) shell.setAttribute('data-show-steppers', showSteppers ? 'true' : 'false');
  }

  private _emitValueEvent(name: string, value: number | null, previousValue: number | null, source: NumberFieldSource): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { value, previousValue, source },
        bubbles: true,
        composed: true
      })
    );
  }

  private _emitInvalid(reason: InvalidReason): void {
    this._internalInvalidReason = reason;
    this.setAttribute('data-internal-invalid', reason);
    this._syncAria();
    this.dispatchEvent(
      new CustomEvent('invalid', {
        detail: { reason },
        bubbles: true,
        composed: true
      })
    );
  }

  private _clearInternalInvalid(): void {
    this._internalInvalidReason = null;
    this.removeAttribute('data-internal-invalid');
    this._syncAria();
  }

  private _commitValue(nextValue: number | null, source: NumberFieldSource): void {
    const previousValue = this.valueAsNumber;
    if (nextValue == null) {
      if (previousValue == null && !this.value) {
        this._rawValue = '';
        this._syncDisplayValue();
        return;
      }
      this._emitValueEvent('before-value-change', null, previousValue, source);
      this.removeAttribute('value');
      this._rawValue = '';
      this._clearInternalInvalid();
      this._syncDisplayValue();
      this._syncAria();
      this._emitValueEvent('value-change', null, previousValue, source);
      return;
    }

    const precision = this._effectivePrecision();
    const canonical = canonicalizeNumber(roundToPrecision(nextValue, precision), precision);
    const committed = Number(canonical);

    if (previousValue != null && committed === previousValue && this.value === canonical) {
      this._rawValue = canonical;
      this._clearInternalInvalid();
      this._syncDisplayValue();
      return;
    }

    this._emitValueEvent('before-value-change', committed, previousValue, source);
    this.setAttribute('value', canonical);
    this._rawValue = canonical;
    this._clearInternalInvalid();
    this._syncDisplayValue();
    this._syncAria();
    this._emitValueEvent('value-change', committed, previousValue, source);
  }

  private _commitRaw(source: NumberFieldSource): void {
    const trimmed = this._rawValue.trim();
    if (!trimmed) {
      this._commitValue(null, source);
      return;
    }

    const parsed = parseLocalizedNumber(trimmed, this._locale());
    if (parsed == null) {
      this._emitInvalid('parse');
      this._syncDisplayValue();
      return;
    }

    const min = this._min();
    const max = this._max();
    const precision = this._effectivePrecision();
    const rounded = roundToPrecision(parsed, precision);
    const shouldClamp = readBooleanHostAttribute(this, 'clamp-on-blur');
    const clamped = shouldClamp ? clamp(rounded, min, max) : rounded;

    if (!shouldClamp && min != null && clamped < min) {
      this._emitInvalid('min');
      this._syncDisplayValue();
      return;
    }

    if (!shouldClamp && max != null && clamped > max) {
      this._emitInvalid('max');
      this._syncDisplayValue();
      return;
    }

    const step = this._step();
    if (!isStepAligned(clamped, step, getStepBase(min), precision)) {
      this._emitInvalid('step');
      this._syncDisplayValue();
      return;
    }

    this._commitValue(clamped, source);
  }

  private _stepBy(deltaCount: number, source: NumberFieldSource): void {
    if (readBooleanHostAttribute(this, 'disabled') || this.hasAttribute('readonly')) return;
    const step = this._step() ?? 1;
    const precision = this._effectivePrecision();
    const min = this._min();
    const max = this._max();
    const current = this._isEditing ? parseLocalizedNumber(this._rawValue, this._locale()) : this.valueAsNumber;
    const baseValue = current ?? min ?? 0;
    const nextValue = clamp(roundToPrecision(baseValue + step * deltaCount, precision), min, max);
    this._commitValue(nextValue, source);
    if (this._isEditing && this._input) this._input.value = this._rawValue;
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
            if (next == null || next === '') this.removeAttribute('value');
            else this.setAttribute('value', String(next));
          },
          validate: async () => {
            const value = this.valueAsNumber;
            const min = this._min();
            const max = this._max();
            if (this.hasAttribute('required') && value == null) {
              return { valid: false, message: 'A value is required.' };
            }
            if (value != null && min != null && value < min) {
              return { valid: false, message: `Value must be at least ${min}.` };
            }
            if (value != null && max != null && value > max) {
              return { valid: false, message: `Value must be at most ${max}.` };
            }
            return { valid: this._internalInvalidReason == null, message: undefined };
          },
          setError: (message?: string) => {
            if (message) {
              this.setAttribute('data-error', message);
              this.toggleAttribute('invalid', true);
            } else {
              this.removeAttribute('data-error');
              if (this._internalInvalidReason == null) this.removeAttribute('invalid');
            }
            this._syncDerivedState();
            this._syncAria();
          }
        });
      }
    } catch {
      // ignore registration failures outside ui-form
    }
  }

  private _detachListeners(): void {
    if (!this._input) return;
    this._input.removeEventListener('input', this._onInput);
    this._input.removeEventListener('focus', this._onFocus);
    this._input.removeEventListener('blur', this._onBlur);
    this._input.removeEventListener('keydown', this._onKeyDown);
    this._input.removeEventListener('wheel', this._onWheel);
  }

  private _bindInput(): void {
    if (!this._input) return;
    this._detachListeners();
    this._input.addEventListener('input', this._onInput);
    this._input.addEventListener('focus', this._onFocus);
    this._input.addEventListener('blur', this._onBlur);
    this._input.addEventListener('keydown', this._onKeyDown);
    this._input.addEventListener('wheel', this._onWheel, { passive: false });
  }

  private _onInput(event: Event): void {
    this._rawValue = (event.target as HTMLInputElement).value;
    this._syncDisplayValue();
    this._syncAria();
    const parsed = parseLocalizedNumber(this._rawValue, this._locale());
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { rawValue: this._rawValue, value: parsed, source: 'input' },
        bubbles: true,
        composed: true
      })
    );
  }

  private _onFocus(): void {
    this._isEditing = true;
    this._rawValue = this.value || this._rawValue;
    this._syncDisplayValue();
    this._syncAria();
  }

  private _onBlur(): void {
    this._isEditing = false;
    this._commitRaw('blur');
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._stepBy(1, 'keyboard');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._stepBy(-1, 'keyboard');
      return;
    }

    if (event.key === 'PageUp') {
      event.preventDefault();
      this._stepBy(10, 'keyboard');
      return;
    }

    if (event.key === 'PageDown') {
      event.preventDefault();
      this._stepBy(-10, 'keyboard');
      return;
    }

    if (event.key === 'Home') {
      const min = this._min();
      if (min == null) return;
      event.preventDefault();
      this._commitValue(min, 'keyboard');
      return;
    }

    if (event.key === 'End') {
      const max = this._max();
      if (max == null) return;
      event.preventDefault();
      this._commitValue(max, 'keyboard');
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this._isEditing = false;
      this._commitRaw('keyboard');
      return;
    }

    if (event.key === 'Escape') {
      this._isEditing = false;
      this._rawValue = this.value;
      this._clearInternalInvalid();
      this._syncDisplayValue();
    }
  }

  private _onWheel(event: WheelEvent): void {
    if (!readBooleanHostAttribute(this, 'allow-wheel')) return;
    if (!this._input || this.root.activeElement !== this._input) return;
    event.preventDefault();
    this._stepBy(event.deltaY < 0 ? 1 : -1, 'wheel');
  }

  private _onClick(event: Event): void {
    const path = event.composedPath();
    const actionNode = path.find((node) => {
      if (!(node instanceof HTMLElement)) return false;
      return node.dataset.stepAction === 'up' ||
        node.dataset.stepAction === 'down' ||
        node.getAttribute('slot') === 'increment-trigger' ||
        node.getAttribute('slot') === 'decrement-trigger';
    }) as HTMLElement | undefined;

    if (!actionNode) return;
    if (actionNode.dataset.stepAction === 'up' || actionNode.getAttribute('slot') === 'increment-trigger') {
      event.preventDefault();
      this._stepBy(1, 'step');
      return;
    }
    if (actionNode.dataset.stepAction === 'down' || actionNode.getAttribute('slot') === 'decrement-trigger') {
      event.preventDefault();
      this._stepBy(-1, 'step');
    }
  }

  private _onSlotChange(): void {
    this._syncDerivedState();
    this._syncAria();
  }

  protected override render(): void {
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const error = this.getAttribute('data-error') || '';

    this.setContent(`
      <style>${style}</style>
      <div class="root">
        <div class="meta">
          <label class="label" id="${this._uid}-label">
            <slot name="label">${escapeHtml(label)}</slot>
            <span class="required" ${this.hasAttribute('required') ? '' : 'hidden'}>*</span>
          </label>
          <p class="description" id="${this._uid}-description">
            <slot name="description">${escapeHtml(description)}</slot>
          </p>
        </div>
        <div class="shell">
          <span class="prefix" hidden><slot name="prefix"></slot></span>
          <div class="control">
            <input type="text" spellcheck="false" />
          </div>
          <span class="suffix" hidden><slot name="suffix"></slot></span>
          <div class="steppers">
            <span class="stepper-slot">
              <slot name="decrement-trigger">
                <button class="stepper-btn" type="button" data-step-action="down" aria-label="Decrease value"><span class="stepper-icon" aria-hidden="true">▾</span></button>
              </slot>
            </span>
            <span class="stepper-slot">
              <slot name="increment-trigger">
                <button class="stepper-btn" type="button" data-step-action="up" aria-label="Increase value"><span class="stepper-icon" aria-hidden="true">▴</span></button>
              </slot>
            </span>
          </div>
        </div>
        <div class="footer">
          <p class="error" id="${this._uid}-error">
            <slot name="error">${escapeHtml(error)}</slot>
          </p>
        </div>
      </div>
    `);

    this._input = this.root.querySelector('input');
    this._rawValue = this.value || this._rawValue;
    this._bindInput();
    this._syncControlAttrs();
    this._syncDerivedState();
    this._syncDisplayValue();
    this._syncAria();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-number-field': UINumberField;
  }
}

if (!customElements.get('ui-number-field')) {
  customElements.define('ui-number-field', UINumberField);
}
