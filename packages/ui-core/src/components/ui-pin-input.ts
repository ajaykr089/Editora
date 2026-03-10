import { ElementBase } from '../ElementBase';

type PinInputSource = 'input' | 'paste' | 'keyboard' | 'api' | 'clear';

const style = `
  :host {
    --ui-pin-gap: 10px;
    --ui-pin-slot-width: 48px;
    --ui-pin-slot-height: 56px;
    --ui-pin-radius: 14px;
    --ui-pin-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-pin-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-pin-muted: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-pin-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-pin-error: var(--ui-color-danger, var(--ui-error, #dc2626));
    --ui-pin-focus: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-pin-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    color-scheme: light dark;
    display: block;
    min-width: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    min-width: 0;
    display: grid;
    gap: 8px;
    color: var(--ui-pin-color);
  }

  .meta,
  .footer {
    min-width: 0;
    display: grid;
    gap: 4px;
  }

  .label {
    margin: 0;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: 600 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
  }

  .required {
    color: var(--ui-pin-error);
    font-size: 12px;
    line-height: 1;
  }

  .description,
  .error {
    margin: 0;
    min-width: 0;
    font-size: 12px;
    line-height: 1.45;
    letter-spacing: 0.01em;
  }

  .description {
    color: var(--ui-pin-muted);
  }

  .error {
    color: var(--ui-pin-error);
    font-weight: 600;
  }

  .meta[hidden],
  .label[hidden],
  .description[hidden],
  .error[hidden] {
    display: none !important;
  }

  .group {
    min-width: 0;
    display: flex;
    flex-wrap: nowrap;
    gap: var(--ui-pin-gap);
    align-items: center;
  }

  .slot {
    inline-size: var(--ui-pin-slot-width);
    min-inline-size: var(--ui-pin-slot-width);
    block-size: var(--ui-pin-slot-height);
    box-sizing: border-box;
    border: 1px solid var(--ui-pin-border-color);
    border-radius: var(--ui-pin-radius);
    background: var(--ui-pin-bg);
    color: var(--ui-pin-color);
    text-align: center;
    font: 650 24px/1 "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.04em;
    outline: none;
    transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease, color 140ms ease;
  }

  .slot::placeholder {
    color: color-mix(in srgb, var(--ui-pin-color) 26%, transparent);
    letter-spacing: 0;
  }

  .slot:focus-visible {
    border-color: color-mix(in srgb, var(--ui-pin-focus) 64%, var(--ui-pin-border-color));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-pin-focus) 24%, transparent);
  }

  .slot[data-filled="true"] {
    border-color: color-mix(in srgb, var(--ui-pin-accent) 34%, var(--ui-pin-border-color));
    background: color-mix(in srgb, var(--ui-pin-accent) 5%, var(--ui-pin-bg));
  }

  :host([invalid]) .slot,
  :host([data-invalid]) .slot {
    border-color: color-mix(in srgb, var(--ui-pin-error) 44%, transparent);
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-pin-gap: 8px;
    --ui-pin-slot-width: 42px;
    --ui-pin-slot-height: 50px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-pin-gap: 12px;
    --ui-pin-slot-width: 54px;
    --ui-pin-slot-height: 62px;
  }

  :host([density="compact"]) {
    --ui-pin-gap: 8px;
  }

  :host([density="comfortable"]) {
    --ui-pin-gap: 12px;
  }

  :host([shape="square"]) {
    --ui-pin-radius: 6px;
  }

  :host([shape="soft"]) {
    --ui-pin-radius: 20px;
  }

  :host([disabled]) .slot,
  :host([readonly]) .slot {
    cursor: not-allowed;
    opacity: 0.72;
  }

  @media (forced-colors: active) {
    :host {
      --ui-pin-bg: Canvas;
      --ui-pin-color: CanvasText;
      --ui-pin-muted: CanvasText;
      --ui-pin-border-color: CanvasText;
      --ui-pin-error: CanvasText;
      --ui-pin-focus: Highlight;
    }

    .slot {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

function clampLength(value: number): number {
  if (!Number.isFinite(value)) return 6;
  return Math.max(1, Math.min(12, Math.floor(value)));
}

function readLength(host: HTMLElement): number {
  return clampLength(Number(host.getAttribute('length') || 6));
}

function ensureId(el: HTMLElement, prefix: string): string {
  if (!el.id) el.id = `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  return el.id;
}

function sanitizeCharacter(char: string, mode: string): string {
  const value = char.trim();
  if (!value) return '';
  const normalized = value.slice(-1);
  if (mode === 'numeric') return /^[0-9]$/.test(normalized) ? normalized : '';
  if (mode === 'alpha') return /^[a-z]$/i.test(normalized) ? normalized.toUpperCase() : '';
  return /^[a-z0-9]$/i.test(normalized) ? normalized.toUpperCase() : '';
}

function sanitizeSequence(value: string, mode: string): string[] {
  return Array.from(value)
    .map((entry) => sanitizeCharacter(entry, mode))
    .filter(Boolean);
}

export type UIPinInputCompleteDetail = {
  value: string;
  length: number;
  source: PinInputSource;
};

export class UIPinInput extends ElementBase {
  static get observedAttributes(): string[] {
    return [
      'value',
      'length',
      'name',
      'label',
      'description',
      'error',
      'disabled',
      'readonly',
      'required',
      'mask',
      'placeholder-char',
      'mode',
      'size',
      'density',
      'shape',
      'invalid'
    ];
  }

  private _value = '';
  private _suppressValueAttr = false;
  private _formUnregister: (() => void) | null = null;
  private _rootEl: HTMLElement | null = null;
  private _metaEl: HTMLElement | null = null;
  private _labelEl: HTMLElement | null = null;
  private _descriptionEl: HTMLElement | null = null;
  private _groupEl: HTMLElement | null = null;
  private _errorEl: HTMLElement | null = null;
  private _inputs: HTMLInputElement[] = [];

  get value(): string {
    return this._value;
  }

  set value(next: string) {
    this._applyValue(String(next ?? ''), 'api', false);
  }

  clear(): void {
    this._applyValue('', 'clear', true);
    this.focusIndex(0);
  }

  focusIndex(index = 0): void {
    const input = this._inputs[Math.max(0, Math.min(index, this._inputs.length - 1))];
    if (!input) return;
    try {
      input.focus({ preventScroll: true });
      input.select();
    } catch {
      input.focus();
      input.select();
    }
  }

  focusFirst(): void {
    this.focusIndex(0);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._registerWithForm();
  }

  override disconnectedCallback(): void {
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'name' && this.isConnected) this._registerWithForm();
    if (name === 'value' && !this._suppressValueAttr) {
      this._value = this._sanitizeValue(newValue || '');
    }
    if (name === 'length' && this.isConnected) {
      this.invalidateContentCache();
      this.requestRender();
      return;
    }
    if (this._rootEl) this._syncUi();
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    return name === 'length';
  }

  protected override render(): void {
    const length = readLength(this);
    const slots = Array.from({ length }, (_, index) => {
      const type = this.hasAttribute('mask') ? 'password' : 'text';
      const autocomplete = index === 0 ? 'one-time-code' : 'off';
      const inputMode = this._mode() === 'numeric' ? 'numeric' : 'text';
      return `<input class="slot" part="slot" data-index="${index}" type="${type}" inputmode="${inputMode}" autocomplete="${autocomplete}" maxlength="1" />`;
    }).join('');

    this.setContent(`
      <style>${style}</style>
      <div class="root">
        <div class="meta" hidden>
          <div class="label" hidden><span class="label-text"></span><span class="required" hidden>*</span></div>
          <div class="description" hidden></div>
        </div>
        <div class="group" part="group" role="group">${slots}</div>
        <div class="footer">
          <div class="error" hidden></div>
        </div>
      </div>
    `);

    this._rootEl = this.root.querySelector('.root');
    this._metaEl = this.root.querySelector('.meta');
    this._labelEl = this.root.querySelector('.label');
    this._descriptionEl = this.root.querySelector('.description');
    this._groupEl = this.root.querySelector('.group');
    this._errorEl = this.root.querySelector('.error');
    this._inputs = Array.from(this.root.querySelectorAll('.slot'));

    this._inputs.forEach((input) => {
      input.addEventListener('input', this._onInput);
      input.addEventListener('keydown', this._onKeyDown);
      input.addEventListener('paste', this._onPaste);
      input.addEventListener('focus', this._onFocus);
    });

    this._value = this._sanitizeValue(this.getAttribute('value') || this._value);
    this._syncUi();
  }

  private _mode(): 'numeric' | 'alpha' | 'alphanumeric' {
    const raw = (this.getAttribute('mode') || 'numeric').toLowerCase();
    if (raw === 'alpha') return 'alpha';
    if (raw === 'alphanumeric') return 'alphanumeric';
    return 'numeric';
  }

  private _disabled(): boolean {
    return this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false';
  }

  private _readOnly(): boolean {
    return this.hasAttribute('readonly');
  }

  private _placeholderChar(): string {
    const raw = this.getAttribute('placeholder-char');
    return raw && raw.length ? raw[0] : '';
  }

  private _sanitizeValue(value: string): string {
    const length = readLength(this);
    return sanitizeSequence(value, this._mode()).join('').slice(0, length);
  }

  private _setValueAttr(value: string): void {
    this._suppressValueAttr = true;
    try {
      if (!value) this.removeAttribute('value');
      else if (this.getAttribute('value') !== value) this.setAttribute('value', value);
    } finally {
      this._suppressValueAttr = false;
    }
  }

  private _emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private _applyValue(raw: string, source: PinInputSource, emitChange: boolean): void {
    const next = this._sanitizeValue(raw);
    const previousValue = this._value;
    if (next === previousValue) {
      this._syncUi();
      return;
    }

    this._value = next;
    this._setValueAttr(next);
    this._syncUi();

    if (emitChange) {
      this._emit('input', { value: next, previousValue, source });
      this._emit('change', { value: next, previousValue, source });
      if (next.length === readLength(this)) {
        this._emit('complete', { value: next, length: next.length, source } satisfies UIPinInputCompleteDetail);
      }
    }
  }

  private _fillFromIndex(index: number, incoming: string, source: PinInputSource): void {
    const chars = sanitizeSequence(incoming, this._mode());
    if (!chars.length) {
      this._syncUi();
      return;
    }
    const slots = Array.from({ length: readLength(this) }, (_, current) => this._value[current] || '');
    let writeIndex = Math.max(0, Math.min(index, slots.length - 1));
    chars.forEach((char) => {
      if (writeIndex >= slots.length) return;
      slots[writeIndex] = char;
      writeIndex += 1;
    });
    this._applyValue(slots.join(''), source, true);
    this.focusIndex(Math.min(writeIndex, slots.length - 1));
  }

  private _syncUi(): void {
    if (!this._groupEl || !this._labelEl || !this._descriptionEl || !this._errorEl || !this._metaEl) return;
    const chars = Array.from({ length: readLength(this) }, (_, index) => this._value[index] || '');
    const placeholder = this._placeholderChar();
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const error = this.getAttribute('error') || '';
    const required = this.hasAttribute('required');

    const labelText = this._labelEl.querySelector('.label-text') as HTMLElement | null;
    const requiredEl = this._labelEl.querySelector('.required') as HTMLElement | null;
    if (labelText) labelText.textContent = label;
    if (requiredEl) requiredEl.toggleAttribute('hidden', !required);
    this._labelEl.toggleAttribute('hidden', !label);
    this._descriptionEl.textContent = description;
    this._descriptionEl.toggleAttribute('hidden', !description);
    this._errorEl.textContent = error;
    this._errorEl.toggleAttribute('hidden', !error);
    this._metaEl.toggleAttribute('hidden', !label && !description);

    const labelId = label ? ensureId(this._labelEl, 'ui-pin-label') : '';
    const descId = description ? ensureId(this._descriptionEl, 'ui-pin-description') : '';
    const errorId = error ? ensureId(this._errorEl, 'ui-pin-error') : '';
    const describedBy = [descId, errorId].filter(Boolean).join(' ');

    this._inputs.forEach((input, index) => {
      const value = chars[index] || '';
      input.value = value;
      input.setAttribute('data-filled', value ? 'true' : 'false');
      input.placeholder = placeholder;
      input.disabled = this._disabled();
      input.readOnly = this._readOnly();
      input.setAttribute('aria-label', `Digit ${index + 1} of ${chars.length}`);
      if (labelId) input.setAttribute('aria-labelledby', labelId);
      else input.removeAttribute('aria-labelledby');
      if (describedBy) input.setAttribute('aria-describedby', describedBy);
      else input.removeAttribute('aria-describedby');
      if (error || this.hasAttribute('invalid')) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      input.inputMode = this._mode() === 'numeric' ? 'numeric' : 'text';
      input.pattern = this._mode() === 'numeric' ? '[0-9]*' : this._mode() === 'alpha' ? '[A-Za-z]*' : '[A-Za-z0-9]*';
    });
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
            if (this.hasAttribute('required') && this.value.length < readLength(this)) {
              return { valid: false, message: 'Enter the full verification code.' };
            }
            return { valid: true, message: undefined };
          },
          setError: (message?: string) => {
            if (message) {
              this.setAttribute('error', message);
              this.toggleAttribute('invalid', true);
            } else {
              this.removeAttribute('error');
              this.removeAttribute('invalid');
            }
            this._syncUi();
          }
        });
      }
    } catch {
      // ignore outside ui-form
    }
  }

  private _onFocus = (event: Event): void => {
    const input = event.currentTarget as HTMLInputElement;
    try {
      input.select();
    } catch {
      // ignore
    }
  };

  private _onInput = (event: Event): void => {
    if (this._disabled() || this._readOnly()) return;
    const input = event.currentTarget as HTMLInputElement;
    const index = Number(input.getAttribute('data-index') || 0);
    this._fillFromIndex(index, input.value, 'input');
  };

  private _onPaste = (event: ClipboardEvent): void => {
    if (this._disabled() || this._readOnly()) return;
    const input = event.currentTarget as HTMLInputElement;
    const index = Number(input.getAttribute('data-index') || 0);
    const text = event.clipboardData?.getData('text') || '';
    if (!text) return;
    event.preventDefault();
    this._fillFromIndex(index, text, 'paste');
  };

  private _onKeyDown = (event: KeyboardEvent): void => {
    const input = event.currentTarget as HTMLInputElement;
    const index = Number(input.getAttribute('data-index') || 0);
    const chars = Array.from({ length: readLength(this) }, (_, current) => this._value[current] || '');

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusIndex(index - 1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusIndex(index + 1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      this.focusIndex(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      this.focusIndex(this._inputs.length - 1);
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (chars[index]) {
        chars[index] = '';
        this._applyValue(chars.join(''), 'keyboard', true);
        this.focusIndex(index);
        return;
      }
      if (index > 0) {
        chars[index - 1] = '';
        this._applyValue(chars.join(''), 'keyboard', true);
        this.focusIndex(index - 1);
      }
      return;
    }
    if (event.key === 'Delete') {
      event.preventDefault();
      chars[index] = '';
      this._applyValue(chars.join(''), 'keyboard', true);
      this.focusIndex(index);
      return;
    }
  };
}

export class UIOtpInput extends UIPinInput {}

declare global {
  interface HTMLElementTagNameMap {
    'ui-pin-input': UIPinInput;
    'ui-otp-input': UIOtpInput;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-pin-input')) {
  customElements.define('ui-pin-input', UIPinInput);
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-otp-input')) {
  customElements.define('ui-otp-input', UIOtpInput);
}
