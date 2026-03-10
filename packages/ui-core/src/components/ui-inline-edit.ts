import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-inline-edit-bg: transparent;
    --ui-inline-edit-border: 1px dashed transparent;
    --ui-inline-edit-radius: 12px;
    --ui-inline-edit-text: var(--ui-color-text, #0f172a);
    --ui-inline-edit-muted: var(--ui-color-muted, #64748b);
    --ui-inline-edit-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-inline-edit-surface: var(--ui-color-surface, #ffffff);
    display: block;
    min-width: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    display: grid;
    gap: 8px;
  }

  .display,
  .editor {
    min-width: 0;
    border-radius: var(--ui-inline-edit-radius);
  }

  .display {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 10px;
    border: var(--ui-inline-edit-border);
    background: var(--ui-inline-edit-bg);
  }

  .display:hover {
    border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    background: color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, transparent);
  }

  .value {
    min-width: 0;
    white-space: pre-wrap;
    color: var(--ui-inline-edit-text);
    font-size: 14px;
    line-height: 1.45;
  }

  .value[data-empty="true"] {
    color: var(--ui-inline-edit-muted);
  }

  .edit-btn,
  .save-btn,
  .cancel-btn {
    appearance: none;
    border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    background: var(--ui-inline-edit-surface);
    color: var(--ui-inline-edit-text);
    border-radius: 10px;
    min-height: 34px;
    padding: 0 12px;
    cursor: pointer;
    font: 600 12px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .edit-btn:disabled,
  .save-btn:disabled,
  .cancel-btn:disabled {
    opacity: 0.56;
    cursor: not-allowed;
  }

  .editor[hidden],
  .display[hidden] {
    display: none !important;
  }

  .field {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    border-radius: 12px;
    background: var(--ui-inline-edit-surface);
    color: var(--ui-inline-edit-text);
    padding: 10px 12px;
    font: 500 14px/1.45 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    outline: none;
  }

  .field:focus-visible {
    border-color: color-mix(in srgb, var(--ui-inline-edit-focus) 62%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-inline-edit-focus) 22%, transparent);
  }

  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
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

export class UIInlineEdit extends ElementBase {
  static get observedAttributes(): string[] {
    return ['value', 'placeholder', 'editing', 'multiline', 'disabled', 'readonly', 'name'];
  }

  private _draft = '';
  private _formUnregister: (() => void) | null = null;
  private _lastFocusTarget: HTMLElement | null = null;

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    if (!next) this.removeAttribute('value');
    else this.setAttribute('value', next);
  }

  startEditing(): void {
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;
    this._lastFocusTarget = (document.activeElement as HTMLElement | null) || this;
    this._draft = this.value;
    this.setAttribute('editing', '');
    queueMicrotask(() => {
      const field = this.root.querySelector('.field') as HTMLInputElement | HTMLTextAreaElement | null;
      field?.focus();
      field?.select?.();
    });
    this.dispatchEvent(new CustomEvent('editing-change', { detail: { editing: true }, bubbles: true, composed: true }));
  }

  cancelEditing(): void {
    this.removeAttribute('editing');
    this._draft = this.value;
    this.dispatchEvent(new CustomEvent('cancel', { detail: { value: this.value }, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('editing-change', { detail: { editing: false }, bubbles: true, composed: true }));
    this._restoreFocus();
  }

  saveEditing(): void {
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;
    if (this.hasAttribute('required') && !this._draft.trim()) {
      this.setAttribute('invalid', '');
      return;
    }
    const previousValue = this.value;
    if (this._draft) this.setAttribute('value', this._draft);
    else this.removeAttribute('value');
    this.removeAttribute('invalid');
    this.removeAttribute('editing');
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value, previousValue, source: 'save' }, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('save', { detail: { value: this.value, previousValue }, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('editing-change', { detail: { editing: false }, bubbles: true, composed: true }));
    this._restoreFocus();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._draft = this.value;
    this._registerWithForm();
  }

  override disconnectedCallback(): void {
    if (this._formUnregister) this._formUnregister();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'name' && this.isConnected) this._registerWithForm();
    if (name === 'value' && !this.hasAttribute('editing')) this._draft = newValue || '';
    if (this.isConnected) this.requestRender();
  }

  protected render(): void {
    const value = this.hasAttribute('editing') ? this._draft : this.value;
    const placeholder = this.getAttribute('placeholder') || 'Add value';
    const multiline = this.hasAttribute('multiline');
    const editing = this.hasAttribute('editing');
    const empty = !this.value;
    const disabled = this.hasAttribute('disabled') || this.hasAttribute('readonly');

    this.setContent(`
      <style>${style}</style>
      <div class="root">
        <div class="display"${editing ? ' hidden' : ''}>
          <div class="value" data-empty="${empty}">${empty ? escapeHtml(placeholder) : escapeHtml(this.value)}</div>
          <button class="edit-btn" type="button"${disabled ? ' disabled' : ''}>Edit</button>
        </div>
        <div class="editor"${editing ? '' : ' hidden'}>
          ${multiline ? `<textarea class="field" rows="4"${disabled ? ' disabled' : ''}>${escapeHtml(value)}</textarea>` : `<input class="field" type="text" value="${escapeHtml(value)}"${disabled ? ' disabled' : ''} />`}
          <div class="actions">
            <button class="cancel-btn" type="button"${disabled ? ' disabled' : ''}>Cancel</button>
            <button class="save-btn" type="button"${disabled ? ' disabled' : ''}>Save</button>
          </div>
        </div>
      </div>
    `);

    const field = this.root.querySelector('.field') as HTMLInputElement | HTMLTextAreaElement | null;
    field?.addEventListener('input', (event) => {
      this._draft = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    });
    field?.addEventListener('keydown', (event: Event) => {
      const keyEvent = event as KeyboardEvent;
      if (keyEvent.key === 'Escape') {
        keyEvent.preventDefault();
        this.cancelEditing();
      }
      if (!multiline && keyEvent.key === 'Enter') {
        keyEvent.preventDefault();
        this.saveEditing();
      }
      if ((keyEvent.metaKey || keyEvent.ctrlKey) && keyEvent.key === 'Enter') {
        keyEvent.preventDefault();
        this.saveEditing();
      }
    });
    this.root.querySelector('.edit-btn')?.addEventListener('click', () => this.startEditing());
    this.root.querySelector('.cancel-btn')?.addEventListener('click', () => this.cancelEditing());
    this.root.querySelector('.save-btn')?.addEventListener('click', () => this.saveEditing());
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
          }
        });
      }
    } catch {}
  }

  private _restoreFocus(): void {
    const target = this._lastFocusTarget && this._lastFocusTarget.isConnected
      ? this._lastFocusTarget
      : (this.root.querySelector('.edit-btn') as HTMLElement | null);
    if (!target) return;
    queueMicrotask(() => {
      try {
        target.focus({ preventScroll: true });
      } catch {
        target.focus();
      }
    });
    this._lastFocusTarget = null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-inline-edit': UIInlineEdit;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-inline-edit')) {
  customElements.define('ui-inline-edit', UIInlineEdit);
}
