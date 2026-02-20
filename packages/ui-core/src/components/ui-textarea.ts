import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-block;
    width: auto;
    font-family: inherit;

    --ui-textarea-padding: var(--ui-padding, 10px 12px);
    --ui-textarea-border-color: var(--ui-color-border, var(--ui-border, rgba(15, 23, 42, 0.14)));
    --ui-textarea-border: 1px solid var(--ui-textarea-border-color);
    --ui-textarea-radius: var(--ui-radius, 8px);
    --ui-textarea-width: var(--ui-width, auto);
    --ui-textarea-min-height: var(--ui-min-height, 96px);
    --ui-textarea-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-textarea-color: var(--ui-color-text, var(--ui-text, inherit));
    --ui-textarea-label: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-textarea-description: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-textarea-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-textarea-error: var(--ui-color-danger, var(--ui-error, #dc2626));
    --ui-textarea-success: var(--ui-color-success, var(--ui-success, #16a34a));
    color-scheme: light dark;
  }

  .label-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 6px;
  }
  .label {
    font-size: 13px;
    color: var(--ui-textarea-label);
  }
  .description {
    font-size: 12px;
    color: var(--ui-textarea-description);
  }

  .root {
    display: inline-flex;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
  }
  .wrap {
    position: relative;
    width: 100%;
    display: inline-flex;
  }

  textarea {
    box-sizing: border-box;
    width: var(--ui-textarea-width);
    min-height: var(--ui-textarea-min-height);
    padding: var(--ui-textarea-padding);
    border: var(--ui-textarea-border);
    border-radius: var(--ui-textarea-radius);
    background: var(--ui-textarea-bg);
    color: var(--ui-textarea-color);
    resize: vertical;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.45;
    outline: none;
    transition: border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
  }
  textarea:focus-visible {
    border-color: var(--ui-textarea-focus-ring);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-textarea-focus-ring) 22%, transparent);
  }

  :host([size="sm"]) textarea,
  :host([size="1"]) textarea {
    font-size: 12px;
    min-height: 72px;
    padding: 8px 10px;
  }
  :host([size="lg"]) textarea,
  :host([size="3"]) textarea {
    font-size: 16px;
    min-height: 128px;
    padding: 12px 14px;
  }

  :host([variant="surface"]) textarea {
    background: var(--ui-color-surface-alt, var(--ui-surface-alt, #f8fafc));
  }
  :host([variant="soft"]) textarea {
    background: color-mix(in srgb, var(--ui-textarea-color) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--ui-textarea-border-color) 70%, transparent);
  }

  :host([radius="none"]) textarea { border-radius: 0; }
  :host([radius="large"]) textarea { border-radius: 14px; }
  :host([radius="full"]) textarea { border-radius: 18px; }

  :host([validation="error"]) textarea {
    border-color: var(--ui-textarea-error);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--ui-textarea-error) 18%, transparent);
  }
  :host([validation="success"]) textarea {
    border-color: var(--ui-textarea-success);
  }

  textarea[disabled] {
    opacity: 0.6;
    pointer-events: none;
  }

  .clear-btn {
    position: absolute;
    right: 8px;
    top: 8px;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    border-radius: 6px;
  }
  .clear-btn:hover {
    background: color-mix(in srgb, var(--ui-textarea-color) 9%, transparent);
  }
  .clear-btn[hidden] {
    display: none;
  }

  .error {
    margin-top: 6px;
    color: var(--ui-textarea-error);
    font-size: 12px;
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-textarea-border: 2px solid var(--ui-textarea-border-color);
    }
    textarea:focus-visible {
      box-shadow: none;
      outline: 2px solid var(--ui-textarea-focus-ring);
      outline-offset: 1px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-textarea-bg: Canvas;
      --ui-textarea-color: CanvasText;
      --ui-textarea-border-color: CanvasText;
      --ui-textarea-label: CanvasText;
      --ui-textarea-description: CanvasText;
      --ui-textarea-focus-ring: Highlight;
      --ui-textarea-error: CanvasText;
      --ui-textarea-success: CanvasText;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
      'description'
    ];
  }

  private _textarea: HTMLTextAreaElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _uid = Math.random().toString(36).slice(2, 8);
  private _formUnregister: (() => void) | null = null;

  constructor() {
    super();
    this._onNativeInput = this._onNativeInput.bind(this);
    this._onNativeChange = this._onNativeChange.bind(this);
    this._onClearClick = this._onClearClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    try {
      const formEl = (this.getRootNode() as any).host
        ? (this.getRootNode() as any).host.closest?.('ui-form')
        : this.closest?.('ui-form');
      const parentForm = formEl || this.closest('ui-form');
      const name = this.getAttribute('name');

      if (parentForm && typeof (parentForm as any).registerField === 'function' && name) {
        this._formUnregister = (parentForm as any).registerField(name, {
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
      }
    } catch {}
  }

  disconnectedCallback() {
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

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'value') {
      if (this._textarea) {
        const next = newValue || '';
        if (this._textarea.value !== next) this._textarea.value = next;
        if (this._clearBtn) {
          if (next) this._clearBtn.removeAttribute('hidden');
          else this._clearBtn.setAttribute('hidden', '');
        }
      }
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    this.setAttribute('value', next || '');
  }

  protected render() {
    const headless = this.hasAttribute('headless');
    const value = this.getAttribute('value') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const disabledRaw = this.getAttribute('disabled');
    const disabled = disabledRaw !== null && String(disabledRaw).toLowerCase() !== 'false' && String(disabledRaw) !== '0';
    const clearable = this.hasAttribute('clearable');
    const rows = Number(this.getAttribute('rows') || 4);
    const maxLength = this.getAttribute('maxlength');
    const minLength = this.getAttribute('minlength');
    const readOnly = this.hasAttribute('readonly');
    const required = this.hasAttribute('required');
    const resize = this.getAttribute('resize') || 'vertical';
    const name = this.getAttribute('name') || '';

    const labelAttr = this.getAttribute('label') || '';
    const descriptionAttr = this.getAttribute('description') || '';

    const clearBtnHtml = clearable ? `<button part="clear" class="clear-btn" aria-label="Clear" ${value ? '' : 'hidden'}>✕</button>` : '';

    this.setContent(`
      ${headless ? '' : `<style>${style}</style>`}

      ${labelAttr || descriptionAttr || this.querySelector('[slot="label"]') || this.querySelector('[slot="description"]')
        ? `<div class="label-row">
            <label class="label" part="label" id="${this._uid}-label"><slot name="label">${escapeHtml(labelAttr)}</slot></label>
            <div class="description" part="description" id="${this._uid}-description"><slot name="description">${escapeHtml(descriptionAttr)}</slot></div>
          </div>`
        : ''}

      <div class="root" part="root">
        <div class="wrap">
          <textarea
            part="textarea"
            name="${escapeHtml(name)}"
            rows="${Number.isFinite(rows) && rows > 0 ? rows : 4}"
            placeholder="${escapeHtml(placeholder)}"
            ${maxLength ? `maxlength="${escapeHtml(maxLength)}"` : ''}
            ${minLength ? `minlength="${escapeHtml(minLength)}"` : ''}
            ${disabled ? 'disabled' : ''}
            ${readOnly ? 'readonly' : ''}
            ${required ? 'required' : ''}
            style="resize: ${escapeHtml(resize)}"
          >${escapeHtml(value)}</textarea>
          ${clearBtnHtml}
        </div>
      </div>

      <div class="error">${this.getAttribute('data-error') ? escapeHtml(this.getAttribute('data-error') || '') : '<slot name="error"></slot>'}</div>
    `);

    this._detachListeners();

    this._textarea = this.root.querySelector('textarea');
    this._clearBtn = this.root.querySelector('.clear-btn') as HTMLButtonElement | null;

    const validation = this.getAttribute('validation');
    if (this._textarea) {
      if (validation === 'error') this._textarea.setAttribute('aria-invalid', 'true');
      else this._textarea.removeAttribute('aria-invalid');

      const labelEl = this.root.getElementById(`${this._uid}-label`);
      const descEl = this.root.getElementById(`${this._uid}-description`);
      if (labelEl) this._textarea.setAttribute('aria-labelledby', `${this._uid}-label`);
      if (descEl) this._textarea.setAttribute('aria-describedby', `${this._uid}-description`);

      if (this.hasAttribute('autofocus')) {
        setTimeout(() => {
          try {
            this._textarea?.focus();
          } catch {}
        }, 0);
      }

      this._textarea.addEventListener('input', this._onNativeInput);
      this._textarea.addEventListener('change', this._onNativeChange);
      this._clearBtn?.addEventListener('click', this._onClearClick);
    }
  }

  private _detachListeners() {
    if (this._textarea) {
      this._textarea.removeEventListener('input', this._onNativeInput);
      this._textarea.removeEventListener('change', this._onNativeChange);
    }
    if (this._clearBtn) {
      this._clearBtn.removeEventListener('click', this._onClearClick);
    }
    this._clearBtn = null;
  }

  private _onNativeInput(event: Event) {
    const next = (event.target as HTMLTextAreaElement).value;
    const debounceMs = Number(this.getAttribute('debounce') || 0);
    const clearable = this.hasAttribute('clearable');

    this.setAttribute('value', next);
    this.dispatchEvent(new CustomEvent('input', { detail: { value: next }, bubbles: true }));

    if (debounceMs > 0) {
      if (this._debounceTimer) clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => {
        this.dispatchEvent(new CustomEvent('debounced-input', { detail: { value: next }, bubbles: true }));
        this._debounceTimer = null;
      }, debounceMs);
    } else {
      this.dispatchEvent(new CustomEvent('debounced-input', { detail: { value: next }, bubbles: true }));
    }

    if (clearable && this._clearBtn) {
      if (next) this._clearBtn.removeAttribute('hidden');
      else this._clearBtn.setAttribute('hidden', '');
    }
  }

  private _onNativeChange(event: Event) {
    const next = (event.target as HTMLTextAreaElement).value;
    this.dispatchEvent(new CustomEvent('change', { detail: { value: next }, bubbles: true }));
  }

  private _onClearClick(event: Event) {
    event.preventDefault();
    this.setAttribute('value', '');
    if (this._textarea) {
      this._textarea.value = '';
      this._textarea.dispatchEvent(new Event('input', { bubbles: true }));
      this._textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (this._clearBtn) this._clearBtn.setAttribute('hidden', '');
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-textarea')) {
  customElements.define('ui-textarea', UITextarea);
}
