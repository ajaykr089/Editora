import { ElementBase } from '../ElementBase';
import { normalizeCollectionText } from '../primitives/collection';
import './ui-listbox';
import type { UIListbox } from './ui-listbox';

type MultiSelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
};

let multiSelectUid = 0;

const style = `
  :host {
    --ui-multi-select-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-multi-select-border: 1px solid var(--ui-multi-select-border-color);
    --ui-multi-select-radius: var(--ui-radius, 12px);
    --ui-multi-select-bg: var(--ui-color-surface, #ffffff);
    --ui-multi-select-text: var(--ui-color-text, #0f172a);
    --ui-multi-select-muted: var(--ui-color-muted, #64748b);
    --ui-multi-select-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-multi-select-danger: var(--ui-color-danger, #dc2626);
    --ui-multi-select-accent: var(--ui-color-primary, #2563eb);
    --ui-multi-select-chip-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, transparent);
    --ui-multi-select-chip-text: color-mix(in srgb, var(--ui-color-primary, #2563eb) 82%, #0f172a 18%);
    --ui-multi-select-panel-bg: color-mix(in srgb, var(--ui-multi-select-bg) 98%, transparent);
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
    color: var(--ui-multi-select-text);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color-scheme: light dark;
  }

  .root { display: grid; gap: 8px; }
  .meta { display: grid; gap: 4px; }
  .label {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ui-multi-select-muted);
    font: 600 13px/1.35 "IBM Plex Sans", "Inter", sans-serif;
  }
  .required { color: var(--ui-multi-select-danger); font-size: 12px; line-height: 1; }
  .description, .error {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.01em;
  }
  .description { color: var(--ui-multi-select-muted); }
  .error { color: var(--ui-multi-select-danger); }

  .shell {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-block-size: 44px;
    padding: 8px 10px;
    border: var(--ui-multi-select-border);
    border-radius: var(--ui-multi-select-radius);
    background: var(--ui-multi-select-bg);
    box-sizing: border-box;
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }

  .shell[data-open="true"],
  .shell:focus-within {
    border-color: color-mix(in srgb, var(--ui-multi-select-focus) 58%, var(--ui-multi-select-border-color));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-multi-select-focus) 22%, transparent);
  }

  .shell[data-readonly="true"] {
    background: color-mix(in srgb, var(--ui-multi-select-bg) 92%, transparent);
  }

  .shell[data-invalid="true"] {
    border-color: color-mix(in srgb, var(--ui-multi-select-danger) 62%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-multi-select-danger) 18%, transparent);
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px 6px 10px;
    border-radius: 999px;
    background: var(--ui-multi-select-chip-bg);
    color: var(--ui-multi-select-chip-text);
    font: 600 12px/1.2 "Inter", "IBM Plex Sans", sans-serif;
  }

  .chip-remove {
    border: none;
    border-radius: 999px;
    inline-size: 18px;
    block-size: 18px;
    display: inline-grid;
    place-items: center;
    padding: 0;
    background: color-mix(in srgb, currentColor 8%, transparent);
    color: inherit;
    cursor: pointer;
    font: 700 11px/1 "Inter", sans-serif;
  }

  .chip-remove:hover {
    background: color-mix(in srgb, currentColor 14%, transparent);
  }

  .input {
    flex: 1 1 96px;
    min-inline-size: 72px;
    border: none;
    background: transparent;
    color: inherit;
    outline: none;
    font: 500 14px/1.4 "Inter", "IBM Plex Sans", sans-serif;
    padding: 4px 2px;
    margin: 0;
  }

  .input::placeholder {
    color: color-mix(in srgb, var(--ui-multi-select-text) 42%, transparent);
  }

  .toggle {
    margin-inline-start: auto;
    border: none;
    background: transparent;
    color: color-mix(in srgb, var(--ui-multi-select-text) 64%, transparent);
    inline-size: 28px;
    block-size: 28px;
    border-radius: 8px;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    transition: background-color 140ms ease, color 140ms ease, transform 140ms ease;
  }

  .toggle:hover {
    background: color-mix(in srgb, var(--ui-multi-select-text) 8%, transparent);
    color: var(--ui-multi-select-text);
  }

  .clear {
    border: none;
    background: transparent;
    color: color-mix(in srgb, var(--ui-multi-select-text) 64%, transparent);
    inline-size: 28px;
    block-size: 28px;
    border-radius: 8px;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    transition: background-color 140ms ease, color 140ms ease;
  }

  .clear:hover {
    background: color-mix(in srgb, var(--ui-multi-select-text) 8%, transparent);
    color: var(--ui-multi-select-text);
  }

  .clear[hidden] {
    display: none;
  }

  .toggle[data-open="true"] {
    transform: rotate(180deg);
  }

  .panel {
    position: absolute;
    inset-inline: 0;
    top: calc(100% + 8px);
    z-index: 20;
    max-block-size: min(320px, 45vh);
    overflow: auto;
    border: 1px solid color-mix(in srgb, var(--ui-multi-select-border-color) 84%, transparent);
    border-radius: calc(var(--ui-multi-select-radius) + 2px);
    background: var(--ui-multi-select-panel-bg);
    box-shadow: 0 20px 34px rgba(2, 6, 23, 0.16);
    padding: 6px;
    box-sizing: border-box;
  }

  .panel[hidden] { display: none; }

  .option {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 10px;
    align-items: start;
    width: 100%;
    border: none;
    background: transparent;
    border-radius: 10px;
    padding: 10px;
    text-align: left;
    color: inherit;
    cursor: pointer;
  }

  .option:hover {
    background: color-mix(in srgb, var(--ui-multi-select-focus) 9%, transparent);
  }

  .option[data-selected="true"] {
    background: color-mix(in srgb, var(--ui-multi-select-focus) 14%, transparent);
  }

  .option[data-indicator="none"] {
    grid-template-columns: minmax(0, 1fr);
  }

  .option[data-indicator="check"] .check {
    border: none;
    background: transparent;
  }

  .option[data-highlighted="true"] {
    outline: 2px solid color-mix(in srgb, var(--ui-multi-select-focus) 24%, transparent);
    outline-offset: -2px;
  }

  .option[disabled] {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .option-label {
    display: block;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 600;
  }

  .option-description {
    display: block;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--ui-multi-select-muted);
    font-size: 11px;
    line-height: 1.35;
    margin-top: 2px;
  }

  .check {
    inline-size: 16px;
    block-size: 16px;
    border-radius: 5px;
    border: 1px solid color-mix(in srgb, var(--ui-multi-select-border-color) 86%, transparent);
    display: inline-grid;
    place-items: center;
    font-size: 11px;
    line-height: 1;
    margin-top: 2px;
  }

  .status {
    padding: 12px 10px;
    color: var(--ui-multi-select-muted);
    font-size: 12px;
  }

  .group {
    padding: 8px 10px 6px;
    color: var(--ui-multi-select-muted);
    font: 700 10px/1.3 "Inter", "IBM Plex Sans", sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .label[hidden], .description[hidden], .error[hidden], .meta[hidden] {
    display: none;
  }

  :host([disabled]) .shell {
    opacity: 0.68;
  }

  :host([disabled]) .toggle,
  :host([disabled]) .clear,
  :host([readonly]) .toggle,
  :host([readonly]) .clear,
  :host([disabled]) .chip-remove,
  :host([readonly]) .chip-remove {
    pointer-events: none;
  }

  :host([readonly]) .chip-remove {
    opacity: 0.6;
  }

  :host([size="sm"]) {
    --ui-multi-select-radius: 10px;
  }

  :host([size="sm"]) .shell {
    min-block-size: 38px;
    padding: 6px 8px;
  }

  :host([size="sm"]) .input,
  :host([size="sm"]) .option-label {
    font-size: 12px;
  }

  :host([size="lg"]) .shell {
    min-block-size: 48px;
    padding: 10px 12px;
  }

  :host([size="lg"]) .input,
  :host([size="lg"]) .option-label {
    font-size: 15px;
  }

  :host([density="compact"]) .root {
    gap: 6px;
  }

  :host([density="compact"]) .shell {
    gap: 6px;
  }

  :host([density="compact"]) .option {
    padding: 8px;
  }

  :host([density="comfortable"]) .root {
    gap: 10px;
  }

  :host([density="comfortable"]) .shell {
    gap: 10px;
    padding: 10px 12px;
  }

  :host([density="comfortable"]) .option {
    padding: 12px;
  }

  :host([shape="square"]) {
    --ui-multi-select-radius: 6px;
  }

  :host([shape="soft"]) {
    --ui-multi-select-radius: 18px;
  }

  :host([variant="surface"]) {
    --ui-multi-select-bg: var(--ui-color-surface-alt, #f8fafc);
  }

  :host([variant="soft"]) {
    --ui-multi-select-bg: color-mix(in srgb, var(--ui-multi-select-accent) 8%, #ffffff);
    --ui-multi-select-border-color: color-mix(in srgb, var(--ui-multi-select-accent) 26%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="filled"]) {
    --ui-multi-select-bg: color-mix(in srgb, var(--ui-multi-select-text) 6%, #ffffff);
    --ui-multi-select-border-color: transparent;
  }

  :host([variant="contrast"]) {
    --ui-multi-select-bg: #0f172a;
    --ui-multi-select-panel-bg: #0f172a;
    --ui-multi-select-text: #e2e8f0;
    --ui-multi-select-muted: #93a4bd;
    --ui-multi-select-border-color: #334155;
    --ui-multi-select-focus: #93c5fd;
    --ui-multi-select-chip-bg: color-mix(in srgb, #93c5fd 18%, transparent);
    --ui-multi-select-chip-text: #e2e8f0;
  }

  :host([variant="minimal"]) {
    --ui-multi-select-bg: transparent;
    --ui-multi-select-border: 0;
  }

  :host([variant="minimal"]) .shell {
    border-left: none;
    border-right: none;
    border-top: none;
    border-radius: 0;
    padding-inline: 0;
  }

  :host([tone="success"]) {
    --ui-multi-select-accent: var(--ui-color-success, #16a34a);
    --ui-multi-select-focus: var(--ui-color-success, #16a34a);
    --ui-multi-select-chip-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 12%, transparent);
    --ui-multi-select-chip-text: color-mix(in srgb, var(--ui-color-success, #16a34a) 82%, #0f172a 18%);
  }

  :host([tone="warning"]) {
    --ui-multi-select-accent: var(--ui-color-warning, #d97706);
    --ui-multi-select-focus: var(--ui-color-warning, #d97706);
    --ui-multi-select-chip-bg: color-mix(in srgb, var(--ui-color-warning, #d97706) 12%, transparent);
    --ui-multi-select-chip-text: color-mix(in srgb, var(--ui-color-warning, #d97706) 82%, #0f172a 18%);
  }

  :host([tone="danger"]) {
    --ui-multi-select-accent: var(--ui-color-danger, #dc2626);
    --ui-multi-select-focus: var(--ui-color-danger, #dc2626);
    --ui-multi-select-chip-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 12%, transparent);
    --ui-multi-select-chip-text: color-mix(in srgb, var(--ui-color-danger, #dc2626) 82%, #0f172a 18%);
  }
`;

function parseOptions(raw: string | null): MultiSelectOption[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const output: MultiSelectOption[] = [];
    const pushOption = (entry: Record<string, unknown>, group?: string) => {
      const value = String(entry.value ?? '').trim();
      if (!value) return;
      output.push({
        value,
        label: String(entry.label ?? value),
        description: entry.description ? String(entry.description) : undefined,
        disabled: Boolean(entry.disabled),
        group
      });
    };

    parsed.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      const record = entry as Record<string, unknown>;
      if (Array.isArray(record.options)) {
        const groupLabel = String(record.label ?? '').trim();
        record.options.forEach((child) => {
          if (!child || typeof child !== 'object') return;
          pushOption(child as Record<string, unknown>, groupLabel || undefined);
        });
        return;
      }
      pushOption(record);
    });

    return output;
  } catch {
    return [];
  }
}

function parseSelected(raw: string | null): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map((entry) => String(entry)).filter(Boolean);
    } catch {
      // fall through
    }
  }
  return trimmed.split(',').map((entry) => entry.trim()).filter(Boolean);
}

export class UIMultiSelect extends ElementBase {
  static get observedAttributes() {
    return [
      'options',
      'value',
      'placeholder',
      'label',
      'description',
      'data-error',
      'name',
      'required',
      'disabled',
      'readonly',
      'loading',
      'loading-text',
      'clearable',
      'open',
      'max-selections',
      'render-limit',
      'selection-indicator',
      'variant',
      'tone',
      'density',
      'shape',
      'size'
    ];
  }

  private _options: MultiSelectOption[] = [];
  private _selected: string[] = [];
  private _query = '';
  private _inputEl: HTMLInputElement | null = null;
  private _shellEl: HTMLElement | null = null;
  private _panelEl: UIListbox | null = null;
  private _formUnregister: (() => void) | null = null;
  private _outsidePointerDown: ((event: PointerEvent) => void) | null = null;
  private _activeValue: string | null = null;
  private _uid = `ui-multi-select-${++multiSelectUid}`;
  private _isSyncingUi = false;
  private _needsSyncUi = false;

  constructor() {
    super();
    this._onInput = this._onInput.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onToggle = this._onToggle.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
  }

  get value(): string[] {
    return [...this._selected];
  }

  set value(next: string[] | string) {
    const parsed = Array.isArray(next) ? next.map((entry) => String(entry)).filter(Boolean) : parseSelected(String(next ?? ''));
    this._setSelected(parsed, 'api');
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(next: boolean) {
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._registerWithForm();
  }

  override disconnectedCallback(): void {
    this._detachOutsideListener();
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'options') this._options = parseOptions(newValue);
    if (name === 'value') this._selected = parseSelected(newValue);
    if (name === 'name' && this.isConnected) this._registerWithForm();
    if (this._shellEl) this._syncUi();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="root">
        <div class="meta" hidden>
          <div class="label" hidden><span class="label-text"></span><span class="required" hidden>*</span></div>
          <div class="description" hidden></div>
        </div>
        <div class="shell" part="shell" data-open="false" data-invalid="false">
          <div class="chips" part="chips"></div>
          <input class="input" part="input" type="text" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="false" aria-controls="${this._uid}-panel" />
          <button class="clear" part="clear" type="button" aria-label="Clear selection" hidden>×</button>
          <button class="toggle" part="toggle" type="button" aria-label="Toggle options">⌄</button>
          <ui-listbox class="panel" id="${this._uid}-panel" part="panel" role="listbox" aria-multiselectable="true" item-selector=".option" item-role="option" active-attribute="data-highlighted" hidden></ui-listbox>
        </div>
        <div class="error" part="error" hidden></div>
      </div>
    `);

    this._options = parseOptions(this.getAttribute('options'));
    this._selected = parseSelected(this.getAttribute('value'));
    this._shellEl = this.root.querySelector('.shell');
    this._inputEl = this.root.querySelector('.input');
    this._panelEl = this.root.querySelector('.panel') as UIListbox | null;

    this._inputEl?.addEventListener('input', this._onInput);
    this._inputEl?.addEventListener('keydown', this._onKeyDown);
    this.root.querySelector('.toggle')?.addEventListener('click', this._onToggle);
    this.root.querySelector('.clear')?.addEventListener('click', () => this._clearSelection('clear-button'));
    this._shellEl?.addEventListener('focusin', this._onFocusIn);
    this._shellEl?.addEventListener('focusout', this._onFocusOut);

    this._syncUi();
  }

  private _selectionIndicator(): 'checkbox' | 'check' | 'none' {
    const raw = (this.getAttribute('selection-indicator') || 'checkbox').trim().toLowerCase();
    if (raw === 'none' || raw === 'check') return raw;
    return 'checkbox';
  }

  private _isInteractionLocked(): boolean {
    return this.hasAttribute('disabled') || this.hasAttribute('readonly');
  }

  private _attachOutsideListener(): void {
    if (this._outsidePointerDown || typeof document === 'undefined') return;
    this._outsidePointerDown = (event: PointerEvent) => {
      const path = event.composedPath();
      if (path.includes(this) || path.includes(this.root) || (this._panelEl && path.includes(this._panelEl)) || (this._inputEl && path.includes(this._inputEl))) return;
      this.open = false;
      this._syncUi();
    };
    document.addEventListener('pointerdown', this._outsidePointerDown);
  }

  private _detachOutsideListener(): void {
    if (!this._outsidePointerDown || typeof document === 'undefined') return;
    document.removeEventListener('pointerdown', this._outsidePointerDown);
    this._outsidePointerDown = null;
  }

  private _filteredOptions(): MultiSelectOption[] {
    const normalized = normalizeCollectionText(this._query);
    if (!normalized) return this._options;
    return this._options.filter((option) => {
      return normalizeCollectionText(option.label).includes(normalized) || normalizeCollectionText(option.value).includes(normalized);
    });
  }

  private _renderLimit(): number {
    const raw = Number(this.getAttribute('render-limit'));
    if (Number.isFinite(raw) && raw > 0) return raw;
    return 200;
  }

  private _findOptionNode(value: string | null): HTMLElement | null {
    if (!value || !this._panelEl) return null;
    return Array.from(this._panelEl.querySelectorAll('.option')).find((item) => item.getAttribute('data-value') === value) as HTMLElement | null;
  }

  private _selectedOptionRecords(): MultiSelectOption[] {
    return this._selected
      .map((value) => this._options.find((option) => option.value === value))
      .filter(Boolean) as MultiSelectOption[];
  }

  private _emitChange(source: string, previousValue: string[]): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: [...this._selected],
          previousValue,
          selectedItems: this._selectedOptionRecords(),
          source
        },
        bubbles: true,
        composed: true
      })
    );
  }

  private _setSelected(next: string[], source: string): void {
    const maxSelections = Number(this.getAttribute('max-selections'));
    const deduped: string[] = [];
    next.forEach((value) => {
      if (!value) return;
      const existingIndex = deduped.indexOf(value);
      if (existingIndex >= 0) deduped.splice(existingIndex, 1);
      deduped.push(value);
    });
    const limited = Number.isFinite(maxSelections) && maxSelections > 0 ? deduped.slice(-maxSelections) : deduped;
    const previousValue = [...this._selected];
    if (previousValue.length === limited.length && previousValue.every((value, index) => value === limited[index])) {
      this._syncUi();
      return;
    }
    this._selected = limited;
    if (this._selected.length) this.setAttribute('value', JSON.stringify(this._selected));
    else this.removeAttribute('value');
    this._syncUi();
    this._emitChange(source, previousValue);
  }

  private _toggleValue(value: string, source: string): void {
    if (this._isInteractionLocked() || this.hasAttribute('loading')) return;
    const exists = this._selected.includes(value);
    const next = exists ? this._selected.filter((entry) => entry !== value) : [...this._selected, value];
    this._activeValue = value;
    this._setSelected(next, source);
  }

  private _removeChip(value: string): void {
    if (this._isInteractionLocked()) return;
    if (this._activeValue === value) this._activeValue = null;
    this._toggleValue(value, 'remove-chip');
  }

  private _clearSelection(source: string): void {
    if (this._isInteractionLocked() || !this._selected.length) return;
    this._activeValue = null;
    this._setSelected([], source);
    this._query = '';
    if (this._inputEl) this._inputEl.value = '';
    try {
      this._inputEl?.focus({ preventScroll: true });
    } catch {
      this._inputEl?.focus();
    }
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
          getValue: () => [...this._selected],
          setValue: (next: any) => {
            if (Array.isArray(next)) this._setSelected(next.map((entry) => String(entry)), 'form');
            else this._setSelected(parseSelected(String(next ?? '')), 'form');
          },
          validate: async () => {
            if (this.hasAttribute('required') && this._selected.length === 0) {
              return { valid: false, message: 'At least one option is required' };
            }
            return { valid: true };
          },
          setError: (message?: string) => {
            if (message) this.setAttribute('data-error', message);
            else this.removeAttribute('data-error');
            this._syncUi();
          }
        });
      }
    } catch {
      // ignore outside form controller
    }
  }

  private _onInput(event: Event): void {
    if (this._isInteractionLocked()) return;
    this._query = (event.target as HTMLInputElement | null)?.value || '';
    if (!this.open) this.open = true;
    this._syncUi();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (this._isInteractionLocked()) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.open) this.open = true;
      this._syncUi();
      if (this._panelEl?.getActiveItem()) this._panelEl.move(1, { focus: false, owner: this._inputEl, scroll: false });
      else this._panelEl?.focusBoundary('first', { focus: false, owner: this._inputEl, scroll: false });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.open) this.open = true;
      this._syncUi();
      if (this._panelEl?.getActiveItem()) this._panelEl.move(-1, { focus: false, owner: this._inputEl, scroll: false });
      else this._panelEl?.focusBoundary('last', { focus: false, owner: this._inputEl, scroll: false });
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      if (!this.open) this.open = true;
      this._syncUi();
      this._panelEl?.focusBoundary('first', { focus: false, owner: this._inputEl, scroll: false });
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      if (!this.open) this.open = true;
      this._syncUi();
      this._panelEl?.focusBoundary('last', { focus: false, owner: this._inputEl, scroll: false });
      return;
    }

    if (event.key === 'Enter') {
      const active = this._panelEl?.getActiveItem();
      if (active) {
        event.preventDefault();
        const value = active.getAttribute('data-value');
        if (value) {
          this._activeValue = value;
          this._toggleValue(value, 'keyboard');
          this._query = '';
          if (this._inputEl) this._inputEl.value = '';
          this._inputEl?.focus();
        }
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      if (this._query) {
        this._query = '';
        if (this._inputEl) this._inputEl.value = '';
      } else {
        this.open = false;
      }
      this._syncUi();
      return;
    }

    if (event.key === 'Tab') {
      this.open = false;
      this._syncUi();
      return;
    }

    if (event.key === 'Backspace' && !this._query && this._selected.length) {
      this._removeChip(this._selected[this._selected.length - 1]);
    }
  }

  private _onToggle(): void {
    if (this._isInteractionLocked()) return;
    this.open = !this.open;
    this._syncUi();
    if (this.open) this._inputEl?.focus();
  }

  private _onFocusIn(): void {
    if (!this._isInteractionLocked()) this.open = true;
    this._syncUi();
  }

  private _onFocusOut(event: FocusEvent): void {
    if (this._shellEl?.contains(event.relatedTarget as Node | null)) return;
    this.open = false;
    this._syncUi();
  }

  private _syncUi(): void {
    if (this._isSyncingUi) {
      this._needsSyncUi = true;
      return;
    }
    if (!this._shellEl || !this._inputEl || !this._panelEl) return;
    this._isSyncingUi = true;
    try {
      const label = (this.getAttribute('label') || '').trim();
      const description = (this.getAttribute('description') || '').trim();
      const error = (this.getAttribute('data-error') || '').trim();
      const metaEl = this.root.querySelector('.meta') as HTMLElement;
      const labelEl = this.root.querySelector('.label') as HTMLElement;
      const labelText = this.root.querySelector('.label-text') as HTMLElement;
      const requiredEl = this.root.querySelector('.required') as HTMLElement;
      const descriptionEl = this.root.querySelector('.description') as HTMLElement;
      const chipsHost = this.root.querySelector('.chips') as HTMLElement;
      const toggle = this.root.querySelector('.toggle') as HTMLButtonElement;
      const clear = this.root.querySelector('.clear') as HTMLButtonElement;
      const errorEl = this.root.querySelector('.error') as HTMLElement;
      const indicator = this._selectionIndicator();
      const loading = this.hasAttribute('loading');
      const loadingText = (this.getAttribute('loading-text') || 'Loading options...').trim();
      const disabled = this.hasAttribute('disabled');
      const readonly = this.hasAttribute('readonly');
      const clearable = this.hasAttribute('clearable');

      metaEl.hidden = !label && !description;
      labelEl.hidden = !label;
      labelText.textContent = label;
      requiredEl.hidden = !this.hasAttribute('required');
      descriptionEl.hidden = !description;
      descriptionEl.textContent = description;
      errorEl.hidden = !error;
      errorEl.textContent = error;

      this._shellEl.setAttribute('data-open', this.open ? 'true' : 'false');
      this._shellEl.setAttribute('data-invalid', error ? 'true' : 'false');
      this._shellEl.setAttribute('data-readonly', readonly ? 'true' : 'false');
      toggle.setAttribute('data-open', this.open ? 'true' : 'false');
      toggle.disabled = disabled || readonly;
      clear.hidden = !clearable || this._selected.length === 0;
      clear.disabled = disabled || readonly;
      this._inputEl.setAttribute('aria-expanded', this.open ? 'true' : 'false');
      this._inputEl.setAttribute('aria-busy', loading ? 'true' : 'false');
      this._inputEl.placeholder = this._selected.length ? '' : (this.getAttribute('placeholder') || 'Select options');
      this._inputEl.disabled = disabled;
      this._inputEl.readOnly = readonly;
      if (this._inputEl.value !== this._query) this._inputEl.value = this._query;
      if (this.open) this._attachOutsideListener();
      else this._detachOutsideListener();

      chipsHost.replaceChildren(...this._selectedOptionRecords().map((option) => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = option.label;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'chip-remove';
      remove.setAttribute('data-value', option.value);
      remove.setAttribute('aria-label', `Remove ${option.label}`);
      remove.textContent = '×';
      remove.disabled = this.hasAttribute('disabled');
      remove.addEventListener('pointerdown', (event) => {
        event.preventDefault();
      });
      remove.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._removeChip(option.value);
        this._inputEl?.focus();
        });
        chip.append(remove);
        return chip;
      }));

      const filtered = this._filteredOptions();
      const renderLimit = this._renderLimit();
      const visibleOptions = filtered.slice(0, renderLimit);
      const truncated = filtered.length > visibleOptions.length;
      this._panelEl.hidden = !this.open;
      if (loading) {
        const status = document.createElement('div');
        status.className = 'status';
        status.textContent = loadingText;
        this._panelEl.replaceChildren(status);
        this._inputEl.removeAttribute('aria-activedescendant');
        return;
      }
      if (!filtered.length) {
        const empty = document.createElement('div');
        empty.className = 'status';
        empty.textContent = 'No matching options';
        this._panelEl.replaceChildren(empty);
        this._inputEl.removeAttribute('aria-activedescendant');
        return;
      }

      const selectedIds = new Set(this._selected);
      const previousActiveValue = this._panelEl.getActiveItem()?.getAttribute('data-value');
      const children: HTMLElement[] = [];
      let currentGroup: string | null = null;
      visibleOptions.forEach((option, index) => {
        if (option.group && option.group !== currentGroup) {
          const group = document.createElement('div');
          group.className = 'group';
          group.setAttribute('role', 'presentation');
          group.textContent = option.group;
          children.push(group);
          currentGroup = option.group;
        } else if (!option.group) {
          currentGroup = null;
        }

        const selected = selectedIds.has(option.value);
        const button = document.createElement('button');
        button.className = 'option';
        button.type = 'button';
        button.id = `${this._uid}-option-${index}`;
        button.setAttribute('role', 'option');
      button.setAttribute('data-value', option.value);
      button.setAttribute('data-selected', String(selected));
      button.setAttribute('data-indicator', indicator);
      button.setAttribute('aria-selected', selected ? 'true' : 'false');
      if (option.disabled || disabled || readonly) button.disabled = true;
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
      });
      button.addEventListener('click', (event) => {
        event.preventDefault();
        if (option.disabled) return;
          this._activeValue = option.value;
          this._toggleValue(option.value, 'option');
          this._query = '';
          if (this._inputEl) this._inputEl.value = '';
          this._inputEl?.focus();
        });

        const textWrap = document.createElement('div');
        textWrap.className = 'option-text';
        const labelNode = document.createElement('span');
        labelNode.className = 'option-label';
        labelNode.textContent = option.label;
        textWrap.append(labelNode);

        if (option.description) {
          const descriptionNode = document.createElement('span');
          descriptionNode.className = 'option-description';
          descriptionNode.textContent = option.description;
          textWrap.append(descriptionNode);
        }

        if (indicator !== 'none') {
          const check = document.createElement('span');
          check.className = 'check';
          check.textContent = selected ? '✓' : '';
          button.append(check);
        }
        button.append(textWrap);
        children.push(button);
      });

      if (truncated) {
        const status = document.createElement('div');
        status.className = 'status';
        status.textContent = `Showing first ${visibleOptions.length} results. Keep typing to narrow the list.`;
        children.push(status);
      }

      this._panelEl.replaceChildren(...children);
      const restoreValue = previousActiveValue || this._activeValue || this._selected[this._selected.length - 1] || null;
      const restoreItem = this._findOptionNode(restoreValue);
      const active = restoreItem && !restoreItem.hasAttribute('disabled')
        ? this._panelEl.setActiveItem(restoreItem, { focus: false, owner: this._inputEl, scroll: false })
        : (this._panelEl.clearActive(), null);
      this._activeValue = active?.getAttribute('data-value') || null;
      if (active?.id) this._inputEl.setAttribute('aria-activedescendant', active.id);
      else this._inputEl.removeAttribute('aria-activedescendant');
    } finally {
      this._isSyncingUi = false;
      if (this._needsSyncUi) {
        this._needsSyncUi = false;
        this._syncUi();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-multi-select': UIMultiSelect;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-multi-select')) {
  customElements.define('ui-multi-select', UIMultiSelect);
}
