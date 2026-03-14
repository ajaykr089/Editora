import { ElementBase } from '../ElementBase';

type TransferOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

const style = `
  :host {
    --ui-transfer-gap: 14px;
    --ui-transfer-panel-bg: var(--ui-color-surface, #ffffff);
    --ui-transfer-panel-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 68%, transparent);
    --ui-transfer-panel-radius: 16px;
    --ui-transfer-panel-shadow: none;
    --ui-transfer-item-hover: color-mix(in srgb, var(--ui-color-primary, #2563eb) 11%, transparent);
    --ui-transfer-item-active: color-mix(in srgb, var(--ui-color-primary, #2563eb) 16%, transparent);
    --ui-transfer-muted: var(--ui-color-muted, #64748b);
    display: block;
    min-width: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    display: grid;
    gap: 8px;
  }

  .label,
  .description,
  .error {
    margin: 0;
  }

  .label {
    font: 600 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .description,
  .error {
    font-size: 12px;
    line-height: 1.45;
    color: var(--ui-transfer-muted);
  }

  .error {
    color: var(--ui-color-danger, #dc2626);
    font-weight: 600;
  }

  .shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: var(--ui-transfer-gap);
    align-items: stretch;
  }

  .panel {
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 8px;
    min-height: 280px;
    padding: 10px;
    border: var(--ui-transfer-panel-border);
    border-radius: var(--ui-transfer-panel-radius);
    background: var(--ui-transfer-panel-bg);
    box-shadow: var(--ui-transfer-panel-shadow);
  }

  .panel-title {
    font: 600 12px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-transfer-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .list {
    display: grid;
    gap: 4px;
    overflow: auto;
    min-height: 0;
  }

  .item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 10px;
    align-items: start;
    padding: 8px 10px;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
  }

  .item:hover {
    background: var(--ui-transfer-item-hover);
  }

  .item[data-selected="true"] {
    background: var(--ui-transfer-item-active);
  }

  .item[aria-disabled="true"] {
    opacity: 0.56;
    pointer-events: none;
  }

  .item-title {
    display: block;
    font-size: 13px;
    line-height: 1.35;
  }

  .item-description {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    line-height: 1.4;
    color: var(--ui-transfer-muted);
  }

  .actions {
    display: grid;
    align-content: center;
    gap: 8px;
  }

  .move-btn {
    appearance: none;
    border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    background: var(--ui-color-surface, #ffffff);
    color: var(--ui-color-text, #0f172a);
    border-radius: 12px;
    min-height: 38px;
    padding: 0 12px;
    cursor: pointer;
    font: 600 13px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .move-btn:disabled {
    opacity: 0.48;
    cursor: not-allowed;
  }

  :host([disabled]) .item,
  :host([disabled]) .move-btn {
    pointer-events: none;
  }

  .summary {
    font-size: 11px;
    color: var(--ui-transfer-muted);
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

function parseOptions(value: string | null): TransferOption[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    const output: TransferOption[] = [];
    parsed.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      const next: TransferOption = {
        value: String((entry as any).value ?? ''),
        label: String((entry as any).label ?? (entry as any).value ?? ''),
        disabled: !!(entry as any).disabled
      };
      if ((entry as any).description) next.description = String((entry as any).description);
      if (!next.value) return;
      output.push(next);
    });
    return output;
  } catch {
    return [];
  }
}

function parseValues(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((entry) => String(entry)) : [];
  } catch {
    return [];
  }
}

export class UITransferList extends ElementBase {
  static get observedAttributes(): string[] {
    return ['options', 'value', 'label', 'description', 'error', 'name', 'disabled'];
  }

  private _options: TransferOption[] = [];
  private _value: string[] = [];
  private _selectedAvailable = new Set<string>();
  private _selectedChosen = new Set<string>();
  private _formUnregister: (() => void) | null = null;
  private _suppressValueAttr = false;

  get value(): string[] {
    return [...this._value];
  }

  set value(next: string[]) {
    this._applyValue(next, 'api');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._registerWithForm();
  }

  override disconnectedCallback(): void {
    if (this._formUnregister) this._formUnregister();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'options') this._options = parseOptions(newValue);
    if (name === 'value' && !this._suppressValueAttr) this._value = parseValues(newValue);
    if (name === 'name' && this.isConnected) this._registerWithForm();
    if (name === 'disabled') {
      this._selectedAvailable.clear();
      this._selectedChosen.clear();
    }
    if (this.isConnected) this.requestRender();
  }

  protected render(): void {
    if (!this._options.length) this._options = parseOptions(this.getAttribute('options'));
    if (!this._value.length && this.getAttribute('value')) this._value = parseValues(this.getAttribute('value'));
    const chosen = new Set(this._value);
    const available = this._options.filter((option) => !chosen.has(option.value));
    const selected = this._options.filter((option) => chosen.has(option.value));
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const error = this.getAttribute('error') || '';

    const availableItems = available
      .map(
        (option) => `<div class="item" data-side="available" data-value="${option.value}" data-selected="${this._selectedAvailable.has(option.value)}" aria-disabled="${option.disabled ? 'true' : 'false'}" tabindex="${option.disabled ? '-1' : '0'}">
          <input type="checkbox" tabindex="-1" ${this._selectedAvailable.has(option.value) ? 'checked' : ''} ${option.disabled ? 'disabled' : ''}/>
          <div><span class="item-title">${escapeHtml(option.label)}</span>${option.description ? `<span class="item-description">${escapeHtml(option.description)}</span>` : ''}</div>
        </div>`
      )
      .join('');
    const selectedItems = selected
      .map(
        (option) => `<div class="item" data-side="chosen" data-value="${option.value}" data-selected="${this._selectedChosen.has(option.value)}" aria-disabled="${option.disabled ? 'true' : 'false'}" tabindex="${option.disabled ? '-1' : '0'}">
          <input type="checkbox" tabindex="-1" ${this._selectedChosen.has(option.value) ? 'checked' : ''} ${option.disabled ? 'disabled' : ''}/>
          <div><span class="item-title">${escapeHtml(option.label)}</span>${option.description ? `<span class="item-description">${escapeHtml(option.description)}</span>` : ''}</div>
        </div>`
      )
      .join('');

    this.setContent(`
      <style>${style}</style>
      <div class="root">
        ${label ? `<p class="label">${label}</p>` : ''}
        ${description ? `<p class="description">${description}</p>` : ''}
        <div class="shell">
          <section class="panel">
            <div class="panel-title">Available</div>
            <div class="list" data-list="available">${availableItems}</div>
            <div class="summary">${available.length} available</div>
          </section>
          <div class="actions">
            <button class="move-btn" data-action="add" type="button"${this._selectedAvailable.size ? '' : ' disabled'}>&gt;</button>
            <button class="move-btn" data-action="remove" type="button"${this._selectedChosen.size ? '' : ' disabled'}>&lt;</button>
          </div>
          <section class="panel">
            <div class="panel-title">Selected</div>
            <div class="list" data-list="chosen">${selectedItems}</div>
            <div class="summary">${selected.length} selected</div>
          </section>
        </div>
        ${error ? `<p class="error">${error}</p>` : ''}
      </div>
    `);

    this.root.querySelectorAll('.item').forEach((item) => item.addEventListener('click', (event) => this._toggleItem(event)));
    this.root.querySelectorAll('.item').forEach((item) => item.addEventListener('keydown', (event) => this._onItemKeyDown(event as KeyboardEvent)));
    this.root.querySelectorAll('.move-btn').forEach((button) => button.addEventListener('click', (event) => this._move(event)));
  }

  private _toggleItem(event: Event): void {
    if (this.hasAttribute('disabled')) return;
    const item = event.currentTarget as HTMLElement;
    const side = item.getAttribute('data-side');
    const value = item.getAttribute('data-value') || '';
    if (!value) return;
    const targetSet = side === 'chosen' ? this._selectedChosen : this._selectedAvailable;
    if (targetSet.has(value)) targetSet.delete(value);
    else targetSet.add(value);
    const current = event.currentTarget as HTMLElement;
    current.setAttribute('data-selected', targetSet.has(value) ? 'true' : 'false');
    const checkbox = current.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
    if (checkbox) checkbox.checked = targetSet.has(value);
    this._syncActionButtons();
  }

  private _onItemKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._toggleItem(event);
  }

  private _move(event: Event): void {
    if (this.hasAttribute('disabled')) return;
    const action = (event.currentTarget as HTMLElement).getAttribute('data-action');
    if (action === 'add') {
      const next = [...this._value, ...Array.from(this._selectedAvailable).filter((value) => !this._value.includes(value))];
      this._selectedAvailable.clear();
      this._applyValue(next, 'transfer-right');
      return;
    }
    if (action === 'remove') {
      const remove = new Set(this._selectedChosen);
      const next = this._value.filter((value) => !remove.has(value));
      this._selectedChosen.clear();
      this._applyValue(next, 'transfer-left');
    }
  }

  private _applyValue(next: string[], source: string): void {
    const deduped = Array.from(new Set(next.filter(Boolean)));
    const previousValue = [...this._value];
    this._value = deduped;
    this._suppressValueAttr = true;
    try {
      if (deduped.length) this.setAttribute('value', JSON.stringify(deduped));
      else this.removeAttribute('value');
    } finally {
      this._suppressValueAttr = false;
    }
    if (deduped.length > 0) this.removeAttribute('invalid');
    this.requestRender();
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: [...this._value],
          previousValue,
          selectedItems: this._options.filter((option) => this._value.includes(option.value)),
          source
        },
        bubbles: true,
        composed: true
      })
    );
  }

  private _syncActionButtons(): void {
    const add = this.root.querySelector('[data-action="add"]') as HTMLButtonElement | null;
    const remove = this.root.querySelector('[data-action="remove"]') as HTMLButtonElement | null;
    if (add) add.disabled = this._selectedAvailable.size === 0;
    if (remove) remove.disabled = this._selectedChosen.size === 0;
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
          getValue: () => [...this._value],
          setValue: (next: any) => {
            const values = Array.isArray(next) ? next.map((entry) => String(entry)) : [];
            this._applyValue(values, 'api');
          },
          validate: async () => ({ valid: !this.hasAttribute('required') || this._value.length > 0, message: 'Select at least one item.' }),
          setError: (message?: string) => {
            if (message) {
              this.setAttribute('error', message);
              this.setAttribute('invalid', '');
            } else {
              this.removeAttribute('error');
              this.removeAttribute('invalid');
            }
            this.requestRender();
          }
        });
      }
    } catch {}
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-transfer-list': UITransferList;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-transfer-list')) {
  customElements.define('ui-transfer-list', UITransferList);
}
