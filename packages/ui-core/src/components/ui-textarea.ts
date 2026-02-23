import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-textarea-bg: var(--ui-color-surface, #ffffff);
    --ui-textarea-text: var(--ui-color-text, #0f172a);
    --ui-textarea-muted: var(--ui-color-muted, #64748b);
    --ui-textarea-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-textarea-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-textarea-accent: var(--ui-color-primary, #2563eb);
    --ui-textarea-danger: var(--ui-color-danger, #dc2626);
    --ui-textarea-success: var(--ui-color-success, #16a34a);
    --ui-textarea-radius: 12px;
    --ui-textarea-padding-x: 12px;
    --ui-textarea-padding-y: 10px;
    --ui-textarea-min-height: 110px;
    --ui-textarea-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 10px 24px rgba(15, 23, 42, 0.08);

    color-scheme: light dark;
    display: inline-grid;
    inline-size: min(100%, 520px);
    min-inline-size: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .shell {
    min-inline-size: 0;
    display: grid;
    gap: 7px;
    color: var(--ui-textarea-text);
  }

  .meta {
    min-inline-size: 0;
    display: grid;
    gap: 3px;
  }

  .meta[hidden] {
    display: none;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.25;
    color: var(--ui-textarea-text);
  }

  .description {
    font-size: 12px;
    line-height: 1.3;
    color: var(--ui-textarea-muted);
  }

  .field {
    min-inline-size: 0;
    position: relative;
    border: 1px solid var(--ui-textarea-border);
    border-radius: var(--ui-textarea-radius);
    background: var(--ui-textarea-bg);
    box-shadow: var(--ui-textarea-shadow);
    transition:
      border-color 160ms ease,
      box-shadow 160ms ease,
      background-color 160ms ease;
  }

  .field:focus-within {
    border-color: color-mix(in srgb, var(--ui-textarea-focus) 72%, transparent);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-textarea-focus) 22%, transparent),
      var(--ui-textarea-shadow);
  }

  textarea {
    box-sizing: border-box;
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: var(--ui-textarea-min-height);
    border: 0;
    background: transparent;
    color: var(--ui-textarea-text);
    resize: vertical;
    outline: none;
    font: 500 14px/1.45 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: var(--ui-textarea-padding-y) var(--ui-textarea-padding-x);
    border-radius: inherit;
  }

  textarea::placeholder {
    color: color-mix(in srgb, var(--ui-textarea-muted) 76%, transparent);
  }

  textarea[readonly] {
    cursor: default;
  }

  textarea[disabled] {
    cursor: not-allowed;
    opacity: 0.66;
  }

  .clear-btn {
    position: absolute;
    inset-inline-end: 8px;
    inset-block-start: 8px;
    inline-size: 26px;
    block-size: 26px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--ui-textarea-muted);
    cursor: pointer;
    display: inline-grid;
    place-items: center;
    transition: background-color 140ms ease, color 140ms ease;
  }

  .clear-btn:hover {
    background: color-mix(in srgb, var(--ui-textarea-text) 10%, transparent);
    color: var(--ui-textarea-text);
  }

  .clear-btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-textarea-focus) 74%, transparent);
    outline-offset: 1px;
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
    font-size: 12px;
  }

  .error {
    color: var(--ui-textarea-danger);
    line-height: 1.35;
  }

  .error:empty {
    display: none;
  }

  .count {
    color: var(--ui-textarea-muted);
    white-space: nowrap;
  }

  .count[hidden] {
    display: none;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-textarea-padding-x: 10px;
    --ui-textarea-padding-y: 8px;
    --ui-textarea-min-height: 84px;
  }

  :host([size="sm"]) textarea,
  :host([size="1"]) textarea {
    font-size: 13px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-textarea-padding-x: 14px;
    --ui-textarea-padding-y: 12px;
    --ui-textarea-min-height: 140px;
  }

  :host([size="lg"]) textarea,
  :host([size="3"]) textarea {
    font-size: 15px;
  }

  :host([density="compact"]) {
    --ui-textarea-padding-y: 7px;
  }

  :host([density="comfortable"]) {
    --ui-textarea-padding-y: 13px;
  }

  :host([variant="surface"]) {
    --ui-textarea-bg: color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 82%, var(--ui-color-surface, #ffffff));
  }

  :host([variant="soft"]) {
    --ui-textarea-bg: color-mix(in srgb, var(--ui-textarea-accent) 8%, var(--ui-color-surface, #ffffff));
    --ui-textarea-border: color-mix(in srgb, var(--ui-textarea-accent) 32%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="filled"]) {
    --ui-textarea-bg: color-mix(in srgb, var(--ui-textarea-text) 6%, var(--ui-color-surface, #ffffff));
  }

  :host([variant="ghost"]) .field {
    box-shadow: none;
    background: transparent;
  }

  :host([variant="contrast"]) {
    --ui-textarea-bg: #0f172a;
    --ui-textarea-text: #e2e8f0;
    --ui-textarea-muted: #93a4bd;
    --ui-textarea-border: #334155;
    --ui-textarea-accent: #93c5fd;
    --ui-textarea-focus: #93c5fd;
    --ui-textarea-shadow:
      0 12px 32px rgba(2, 6, 23, 0.46),
      0 24px 56px rgba(2, 6, 23, 0.42);
  }

  :host([tone="success"]) {
    --ui-textarea-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-textarea-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-textarea-accent: var(--ui-color-danger, #dc2626);
  }

  :host([validation="error"]) .field {
    border-color: color-mix(in srgb, var(--ui-textarea-danger) 74%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-textarea-danger) 22%, transparent);
  }

  :host([validation="success"]) .field {
    border-color: color-mix(in srgb, var(--ui-textarea-success) 66%, transparent);
  }

  :host([radius="none"]) {
    --ui-textarea-radius: 0;
  }

  :host([radius="large"]) {
    --ui-textarea-radius: 16px;
  }

  :host([radius="full"]) {
    --ui-textarea-radius: 24px;
  }

  :host([disabled]) .field,
  :host([readonly]) .field {
    background: color-mix(in srgb, var(--ui-textarea-bg) 78%, #94a3b8 22%);
  }

  :host([headless]) .meta,
  :host([headless]) .footer {
    display: none;
  }

  :host([headless]) .field {
    border: 0;
    box-shadow: none;
    background: transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    .field,
    .clear-btn {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .field {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-textarea-bg: Canvas;
      --ui-textarea-text: CanvasText;
      --ui-textarea-muted: CanvasText;
      --ui-textarea-border: CanvasText;
      --ui-textarea-focus: Highlight;
      --ui-textarea-accent: Highlight;
      --ui-textarea-danger: Highlight;
      --ui-textarea-success: Highlight;
      --ui-textarea-shadow: none;
    }

    .clear-btn {
      color: CanvasText;
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

function parseNumber(raw: string | null, fallback: number): number {
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export class UITextarea extends ElementBase {
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
      'rows',
      'readonly',
      'autofocus',
      'resize',
      'name',
      'required',
      'variant',
      'color',
      'radius',
      'label',
      'description',
      'autosize',
      'max-rows',
      'show-count',
      'density',
      'tone',
      'headless',
      'data-error'
    ];
  }

  private _uid = `ui-textarea-${Math.random().toString(36).slice(2, 9)}`;
  private _textarea: HTMLTextAreaElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;
  private _countEl: HTMLElement | null = null;
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _formUnregister: (() => void) | null = null;

  constructor() {
    super();
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onClear = this._onClear.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._tryRegisterWithForm();
  }

  override disconnectedCallback(): void {
    this._detachListeners();

    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }

    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }

    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'name') {
      this._tryRegisterWithForm();
    }

    if (name === 'value' && this._textarea) {
      const next = newValue || '';
      if (this._textarea.value !== next) {
        this._textarea.value = next;
      }
      this._syncDynamicUi();
      this._applyAutosize();
      return;
    }

    const liveAttrs = new Set([
      'placeholder',
      'disabled',
      'maxlength',
      'minlength',
      'rows',
      'readonly',
      'required',
      'resize',
      'name',
      'validation',
      'show-count',
      'clearable',
      'autosize',
      'max-rows',
      'variant',
      'size',
      'density',
      'tone',
      'headless',
      'color',
      'radius',
      'autofocus'
    ]);

    if (liveAttrs.has(name)) {
      this._syncControlAttrs();
      this._syncDynamicUi();
      this._applyAutosize();

      if (name === 'autofocus' && this.hasAttribute('autofocus')) {
        queueMicrotask(() => {
          this._textarea?.focus();
        });
      }
      return;
    }

    if (this.isConnected) this.requestRender();
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    this.setAttribute('value', next || '');
  }

  private _tryRegisterWithForm(): void {
    try {
      const form = this.closest?.('ui-form') as any;
      const name = this.getAttribute('name');

      if (!form || typeof form.registerField !== 'function' || !name) return;

      this._formUnregister = form.registerField(name, {
        name,
        getValue: () => this.value,
        setValue: (next: string) => {
          this.value = next;
        },
        validate: async () => {
          if (!this._textarea) return { valid: true };
          const valid = this._textarea.checkValidity();
          return { valid, message: this._textarea.validationMessage || undefined };
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
    } catch {
      // no-op
    }
  }

  private _detachListeners(): void {
    if (this._textarea) {
      this._textarea.removeEventListener('input', this._onInput);
      this._textarea.removeEventListener('change', this._onChange);
    }

    if (this._clearBtn) {
      this._clearBtn.removeEventListener('click', this._onClear);
    }

    this._clearBtn = null;
  }

  private _syncControlAttrs(): void {
    if (!this._textarea) return;

    const placeholder = this.getAttribute('placeholder') || '';
    const maxLength = this.getAttribute('maxlength');
    const minLength = this.getAttribute('minlength');
    const rows = parseNumber(this.getAttribute('rows'), 4);
    const disabled = this.hasAttribute('disabled');
    const readOnly = this.hasAttribute('readonly');
    const required = this.hasAttribute('required');
    const name = this.getAttribute('name') || '';
    const resize = this.getAttribute('resize') || 'vertical';
    const validation = this.getAttribute('validation');
    const color = this.getAttribute('color');
    const radius = this.getAttribute('radius');

    this._textarea.placeholder = placeholder;
    this._textarea.disabled = disabled;
    this._textarea.readOnly = readOnly;
    this._textarea.required = required;
    this._textarea.rows = Math.max(1, rows);
    this._textarea.name = name;
    this._textarea.style.resize = resize;

    if (maxLength && Number.isFinite(Number(maxLength))) {
      this._textarea.maxLength = Number(maxLength);
    } else {
      this._textarea.removeAttribute('maxlength');
    }

    if (minLength && Number.isFinite(Number(minLength))) {
      this._textarea.minLength = Number(minLength);
    } else {
      this._textarea.removeAttribute('minlength');
    }

    if (validation === 'error') {
      this._textarea.setAttribute('aria-invalid', 'true');
    } else {
      this._textarea.removeAttribute('aria-invalid');
    }

    if (color) this.style.setProperty('--ui-textarea-accent', color);
    else this.style.removeProperty('--ui-textarea-accent');

    if (radius && radius !== 'none' && radius !== 'large' && radius !== 'full') {
      this.style.setProperty('--ui-textarea-radius', radius);
    } else {
      this.style.removeProperty('--ui-textarea-radius');
    }

    const describedBy: string[] = [];
    const hasDescription = !!(this.getAttribute('description') || this.querySelector('[slot="description"]'));
    const hasError = !!(this.getAttribute('data-error') || this.querySelector('[slot="error"]'));

    if (hasDescription) describedBy.push(`${this._uid}-description`);
    if (hasError) describedBy.push(`${this._uid}-error`);
    if (this.hasAttribute('show-count') || this.hasAttribute('maxlength')) describedBy.push(`${this._uid}-count`);

    const hasLabel = !!(this.getAttribute('label') || this.querySelector('[slot="label"]'));
    if (hasLabel) {
      this._textarea.setAttribute('aria-labelledby', `${this._uid}-label`);
    } else {
      this._textarea.removeAttribute('aria-labelledby');
    }

    if (describedBy.length) {
      this._textarea.setAttribute('aria-describedby', describedBy.join(' '));
    } else {
      this._textarea.removeAttribute('aria-describedby');
    }
  }

  private _syncDynamicUi(): void {
    const value = this._textarea?.value || this.getAttribute('value') || '';
    const maxLength = this.getAttribute('maxlength');
    const clearable = this.hasAttribute('clearable');

    if (this._clearBtn) {
      if (clearable && value && !this.hasAttribute('disabled') && !this.hasAttribute('readonly')) {
        this._clearBtn.removeAttribute('hidden');
      } else {
        this._clearBtn.setAttribute('hidden', '');
      }
    }

    if (this._countEl) {
      const shouldShow = this.hasAttribute('show-count') || !!maxLength;
      if (!shouldShow) {
        this._countEl.setAttribute('hidden', '');
      } else {
        this._countEl.removeAttribute('hidden');
        if (maxLength && Number.isFinite(Number(maxLength))) {
          this._countEl.textContent = `${value.length} / ${Number(maxLength)}`;
        } else {
          this._countEl.textContent = `${value.length}`;
        }
      }
    }
  }

  private _applyAutosize(): void {
    if (!this._textarea) return;
    if (!this.hasAttribute('autosize')) {
      this._textarea.style.height = '';
      this._textarea.style.overflowY = '';
      return;
    }

    this._textarea.style.height = 'auto';
    const nextHeight = this._textarea.scrollHeight;

    const maxRows = parseNumber(this.getAttribute('max-rows'), 0);
    if (maxRows > 0) {
      const computed = getComputedStyle(this._textarea);
      const lineHeight = parseFloat(computed.lineHeight || '20') || 20;
      const borderTop = parseFloat(computed.borderTopWidth || '0') || 0;
      const borderBottom = parseFloat(computed.borderBottomWidth || '0') || 0;
      const paddingTop = parseFloat(computed.paddingTop || '0') || 0;
      const paddingBottom = parseFloat(computed.paddingBottom || '0') || 0;
      const maxHeight = (lineHeight * maxRows) + borderTop + borderBottom + paddingTop + paddingBottom;

      this._textarea.style.height = `${Math.min(nextHeight, maxHeight)}px`;
      this._textarea.style.overflowY = nextHeight > maxHeight ? 'auto' : 'hidden';
      return;
    }

    this._textarea.style.height = `${nextHeight}px`;
    this._textarea.style.overflowY = 'hidden';
  }

  private _emit(name: string, value: string): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          value,
          length: value.length,
          name: this.getAttribute('name') || ''
        },
        bubbles: true,
        composed: true
      })
    );
  }

  private _onInput(event: Event): void {
    const next = (event.target as HTMLTextAreaElement).value;
    if (this.getAttribute('value') !== next) {
      this.setAttribute('value', next);
    }

    this._syncDynamicUi();
    this._applyAutosize();
    this._emit('input', next);

    const debounce = parseNumber(this.getAttribute('debounce'), 0);
    if (debounce > 0) {
      if (this._debounceTimer) clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => {
        this._emit('debounced-input', next);
        this._debounceTimer = null;
      }, debounce);
    } else {
      this._emit('debounced-input', next);
    }
  }

  private _onChange(event: Event): void {
    const next = (event.target as HTMLTextAreaElement).value;
    this._emit('change', next);
  }

  private _onClear(event: Event): void {
    event.preventDefault();
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;

    this.value = '';
    if (this._textarea) {
      this._textarea.value = '';
      this._textarea.focus();
    }

    this._syncDynamicUi();
    this._applyAutosize();
    this._emit('input', '');
    this._emit('change', '');
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }));
  }

  protected override render(): void {
    const value = this.getAttribute('value') || '';
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const errorText = this.getAttribute('data-error') || '';
    const hasMeta = !!(label || description || this.querySelector('[slot="label"]') || this.querySelector('[slot="description"]'));

    const clearable = this.hasAttribute('clearable');
    const clearVisible = clearable && !!value && !this.hasAttribute('disabled') && !this.hasAttribute('readonly');

    this.setContent(`
      <style>${style}</style>
      <div class="shell" part="shell">
        <div class="meta" part="meta" ${hasMeta ? '' : 'hidden'}>
          <label id="${this._uid}-label" class="label" part="label"><slot name="label">${escapeHtml(label)}</slot></label>
          <div id="${this._uid}-description" class="description" part="description"><slot name="description">${escapeHtml(description)}</slot></div>
        </div>

        <div class="field" part="field">
          <textarea part="textarea"></textarea>
          <button type="button" part="clear" class="clear-btn" aria-label="Clear text" ${clearVisible ? '' : 'hidden'}>✕</button>
        </div>

        <div class="footer" part="footer">
          <div id="${this._uid}-error" class="error" part="error"><slot name="error">${escapeHtml(errorText)}</slot></div>
          <div id="${this._uid}-count" class="count" part="count" hidden></div>
        </div>
      </div>
    `);

    this._detachListeners();

    this._textarea = this.root.querySelector('textarea') as HTMLTextAreaElement | null;
    this._clearBtn = this.root.querySelector('.clear-btn') as HTMLButtonElement | null;
    this._countEl = this.root.querySelector('.count') as HTMLElement | null;

    if (!this._textarea) return;

    this._textarea.value = value;
    this._syncControlAttrs();
    this._syncDynamicUi();
    this._applyAutosize();

    this._textarea.addEventListener('input', this._onInput);
    this._textarea.addEventListener('change', this._onChange);
    this._clearBtn?.addEventListener('click', this._onClear);

    if (this.hasAttribute('autofocus')) {
      queueMicrotask(() => {
        this._textarea?.focus();
      });
    }
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return name === 'label' || name === 'description' || name === 'data-error';
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-textarea')) {
  customElements.define('ui-textarea', UITextarea);
}
