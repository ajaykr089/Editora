import { ElementBase } from '../ElementBase';

type ComboboxOption = {
  value: string;
  label: string;
  disabled: boolean;
  sourceIndex: number;
};

const style = `
  :host {
    display: inline-block;
    width: auto;
    font-family: inherit;

    --ui-combobox-width: var(--ui-width, 100%);
    --ui-combobox-min-width: 220px;
    --ui-combobox-height: 40px;
    --ui-combobox-padding-x: 12px;
    --ui-combobox-radius: var(--ui-radius, 12px);
    --ui-combobox-border-color: var(--ui-color-border, var(--ui-border, rgba(15, 23, 42, 0.14)));
    --ui-combobox-border: 1px solid var(--ui-combobox-border-color);
    --ui-combobox-bg: color-mix(in srgb, var(--ui-color-surface, var(--ui-surface, #ffffff)) 94%, transparent);
    --ui-combobox-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-combobox-shadow: var(--ui-shadow-sm, 0 10px 32px rgba(2, 6, 23, 0.08));
    --ui-combobox-focus: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-combobox-panel-bg: color-mix(in srgb, var(--ui-color-surface, var(--ui-surface, #ffffff)) 98%, transparent);
    --ui-combobox-panel-border: 1px solid color-mix(in srgb, var(--ui-combobox-border-color) 72%, transparent);
    --ui-combobox-panel-shadow: var(--ui-shadow-md, 0 22px 48px rgba(2, 6, 23, 0.16));
    --ui-combobox-muted: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-combobox-option-hover: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 10%, transparent);
    --ui-combobox-option-active: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 16%, transparent);
    --ui-combobox-error: var(--ui-color-danger, var(--ui-error, #dc2626));
    --ui-combobox-success: var(--ui-color-success, var(--ui-success, #16a34a));
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
    color: var(--ui-combobox-color);
    opacity: 0.85;
  }
  .description {
    font-size: 12px;
    color: var(--ui-combobox-muted);
  }

  .root {
    position: relative;
    width: var(--ui-combobox-width);
    min-width: var(--ui-combobox-min-width);
  }

  .control {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: var(--ui-combobox-height);
    border: var(--ui-combobox-border);
    border-radius: var(--ui-combobox-radius);
    background: var(--ui-combobox-bg);
    box-shadow: var(--ui-combobox-shadow);
    transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
    overflow: hidden;
    backdrop-filter: saturate(1.15) blur(10px);
  }

  input {
    flex: 1 1 auto;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ui-combobox-color);
    padding: 9px calc(var(--ui-combobox-padding-x) + 36px) 9px var(--ui-combobox-padding-x);
    font-size: 14px;
    line-height: 1.4;
    min-height: var(--ui-combobox-height);
    font-family: inherit;
  }
  input::placeholder {
    color: var(--ui-combobox-muted);
  }

  .control[data-focused="true"] {
    border-color: color-mix(in srgb, var(--ui-combobox-focus) 68%, var(--ui-combobox-border-color));
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--ui-combobox-focus) 15%, transparent), var(--ui-combobox-shadow);
  }

  .icon-btn {
    position: absolute;
    top: 50%;
    border: none;
    background: transparent;
    color: var(--ui-combobox-muted);
    width: 26px;
    height: 26px;
    margin-top: -13px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 120ms ease, color 120ms ease;
  }
  .icon-btn:hover {
    background: color-mix(in srgb, var(--ui-combobox-color) 10%, transparent);
    color: var(--ui-combobox-color);
  }
  .icon-btn[hidden] {
    display: none;
  }
  .clear-btn {
    right: 32px;
    font-size: 12px;
  }
  .toggle-btn {
    right: 6px;
    font-size: 11px;
  }
  .toggle-btn[data-open="true"] {
    transform: rotate(180deg);
  }

  .panel {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    border: var(--ui-combobox-panel-border);
    border-radius: calc(var(--ui-combobox-radius) + 2px);
    background: var(--ui-combobox-panel-bg);
    box-shadow: var(--ui-combobox-panel-shadow);
    max-height: min(320px, 46vh);
    overflow: auto;
    padding: 6px;
    z-index: 90;
    display: none;
    opacity: 0;
    transform: translateY(-4px) scale(0.985);
    transition: opacity 130ms ease, transform 130ms ease;
    backdrop-filter: saturate(1.15) blur(10px);
  }
  .panel[data-open="true"] {
    display: block;
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .option {
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 10px;
    padding: 9px 10px;
    cursor: pointer;
    color: var(--ui-combobox-color);
    font-size: 13px;
    line-height: 1.35;
  }
  .option:hover {
    background: var(--ui-combobox-option-hover);
  }
  .option[data-highlighted="true"] {
    background: var(--ui-combobox-option-active);
  }
  .option[data-selected="true"]::before {
    content: '✓';
    font-size: 12px;
    opacity: 0.9;
  }
  .option[data-selected="false"]::before {
    content: '';
    width: 10px;
  }
  .option[disabled] {
    opacity: 0.48;
    cursor: not-allowed;
  }

  .empty {
    padding: 12px 10px;
    color: var(--ui-combobox-muted);
    font-size: 12px;
    text-align: center;
  }

  .error {
    margin-top: 6px;
    color: var(--ui-combobox-error);
    font-size: 12px;
  }

  :host([disabled]) .control {
    opacity: 0.62;
    pointer-events: none;
    background: color-mix(in srgb, var(--ui-combobox-muted) 20%, transparent);
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-combobox-height: 34px;
    --ui-combobox-padding-x: 10px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-combobox-height: 46px;
    --ui-combobox-padding-x: 13px;
  }

  :host([variant="surface"]) .control {
    background: var(--ui-color-surface-alt, var(--ui-surface-alt, #f8fafc));
  }
  :host([variant="soft"]) .control {
    background: color-mix(in srgb, var(--ui-combobox-color) 5%, transparent);
    border-color: color-mix(in srgb, var(--ui-combobox-border-color) 70%, transparent);
  }

  :host([radius="none"]) {
    --ui-combobox-radius: 0;
  }
  :host([radius="large"]) {
    --ui-combobox-radius: 16px;
  }
  :host([radius="full"]) {
    --ui-combobox-radius: 9999px;
  }

  :host([validation="error"]) .control {
    border-color: var(--ui-combobox-error);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--ui-combobox-error) 20%, transparent), var(--ui-combobox-shadow);
  }
  :host([validation="success"]) .control {
    border-color: var(--ui-combobox-success);
  }

  :host([headless]) .control,
  :host([headless]) .panel,
  :host([headless]) .label-row,
  :host([headless]) .error {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .panel,
    .icon-btn {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-combobox-border: 2px solid var(--ui-combobox-border-color);
      --ui-combobox-panel-border: 2px solid var(--ui-combobox-border-color);
      --ui-combobox-shadow: none;
      --ui-combobox-panel-shadow: none;
      --ui-combobox-option-hover: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 24%, transparent);
      --ui-combobox-option-active: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 32%, transparent);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-combobox-bg: Canvas;
      --ui-combobox-color: CanvasText;
      --ui-combobox-border-color: CanvasText;
      --ui-combobox-panel-bg: Canvas;
      --ui-combobox-panel-border: 1px solid CanvasText;
      --ui-combobox-shadow: none;
      --ui-combobox-panel-shadow: none;
      --ui-combobox-muted: GrayText;
      --ui-combobox-focus: Highlight;
      --ui-combobox-option-hover: Highlight;
      --ui-combobox-option-active: Highlight;
    }

    .option[data-highlighted="true"],
    .option:hover {
      color: HighlightText;
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

function isTruthyDisabledValue(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

export class UICombobox extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'placeholder',
      'disabled',
      'clearable',
      'debounce',
      'maxlength',
      'readonly',
      'autofocus',
      'name',
      'required',
      'validation',
      'size',
      'variant',
      'radius',
      'label',
      'description',
      'open',
      'headless',
      'empty-text',
      'no-filter',
      'allow-custom'
    ];
  }

  private _input: HTMLInputElement | null = null;
  private _control: HTMLElement | null = null;
  private _panel: HTMLElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;
  private _toggleBtn: HTMLButtonElement | null = null;
  private _options: ComboboxOption[] = [];
  private _filtered: ComboboxOption[] = [];
  private _highlightedIndex = -1;
  private _query = '';
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _observer: MutationObserver | null = null;
  private _uid = Math.random().toString(36).slice(2, 8);
  private _formUnregister: (() => void) | null = null;
  private _isFocused = false;
  private _suppressValueSync = false;
  private _globalListenersBound = false;

  constructor() {
    super();
    this._onDocumentMouseDown = this._onDocumentMouseDown.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onNativeChange = this._onNativeChange.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClearClick = this._onClearClick.bind(this);
    this._onToggleClick = this._onToggleClick.bind(this);
    this._onPanelClick = this._onPanelClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this._observer = new MutationObserver(() => {
      this._options = this._readOptions();
      this._rebuildFiltered({ preserveHighlight: false });
      this._renderList();
      this._syncInputFromValue();
    });
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['value', 'label', 'disabled', 'data-combobox-option']
    });

    this._attachFormRegistration();
  }

  disconnectedCallback() {
    this._unbindGlobalListeners();
    this._detachDomListeners();

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

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

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    if (name === 'value') {
      if (!this._suppressValueSync) this._syncInputFromValue();
      this._updateClearButton();
      this._renderList();
      return;
    }

    if (name === 'open') {
      this._applyOpenState();
      if (oldVal !== newVal) {
        this.dispatchEvent(new CustomEvent(newVal != null ? 'open' : 'close', { bubbles: true }));
      }
      return;
    }

    if (this.isConnected) this.requestRender();
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    const normalized = next || '';
    if (normalized === this.value) return;
    this.setAttribute('value', normalized);
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(next: boolean) {
    if (next === this.open) return;
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  private _isDisabled(): boolean {
    return isTruthyDisabledValue(this.getAttribute('disabled'));
  }

  private _attachFormRegistration() {
    try {
      const rootNode = this.getRootNode() as ShadowRoot | Document;
      const host = (rootNode as ShadowRoot).host as HTMLElement | undefined;
      const formFromHost = host?.closest?.('ui-form') || null;
      const parentForm = formFromHost || this.closest('ui-form');
      const name = this.getAttribute('name');

      if (parentForm && typeof (parentForm as any).registerField === 'function' && name) {
        this._formUnregister = (parentForm as any).registerField(name, {
          name,
          getValue: () => this.value,
          setValue: (next: string) => {
            this.value = next;
          },
          validate: async () => {
            const valid = this._isCurrentValueValid();
            return {
              valid,
              message: valid ? undefined : 'Please select a value from the list.'
            };
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

  private _isCurrentValueValid(): boolean {
    const required = this.hasAttribute('required');
    const value = this.value;
    if (!required && !value) return true;
    if (required && !value) return false;
    if (this.hasAttribute('allow-custom')) return true;
    return this._options.some((option) => option.value === value);
  }

  private _normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private _readOptions(): ComboboxOption[] {
    const optionElements = Array.from(
      this.querySelectorAll('option,[data-combobox-option]')
    ) as HTMLElement[];

    return optionElements.map((node, index) => {
      const isNativeOption = node.tagName.toLowerCase() === 'option';
      const native = node as HTMLOptionElement;

      const value = isNativeOption
        ? native.value || native.textContent || ''
        : node.getAttribute('value') || node.getAttribute('data-value') || node.textContent || '';
      const label = isNativeOption
        ? (native.label || native.textContent || native.value || '').trim()
        : (node.getAttribute('label') || node.textContent || value).trim();
      const disabled = isNativeOption ? native.disabled : isTruthyDisabledValue(node.getAttribute('disabled'));

      return {
        value: value.trim(),
        label,
        disabled,
        sourceIndex: index
      };
    });
  }

  private _findOptionByValue(value: string): ComboboxOption | null {
    return this._options.find((option) => option.value === value) || null;
  }

  private _rebuildFiltered(config?: { preserveHighlight?: boolean }) {
    const query = this._normalize(this._query);
    const noFilter = this.hasAttribute('no-filter');
    const previous = this._filtered[this._highlightedIndex];

    this._filtered = this._options.filter((option) => {
      if (noFilter || !query) return true;
      return (
        this._normalize(option.label).includes(query) ||
        this._normalize(option.value).includes(query)
      );
    });

    if (config?.preserveHighlight && previous) {
      const keepIndex = this._filtered.findIndex((option) => option.sourceIndex === previous.sourceIndex);
      this._highlightedIndex = keepIndex;
      return;
    }

    const selected = this._findOptionByValue(this.value);
    if (selected) {
      const selectedIndex = this._filtered.findIndex((option) => option.sourceIndex === selected.sourceIndex);
      if (selectedIndex >= 0 && !this._filtered[selectedIndex].disabled) {
        this._highlightedIndex = selectedIndex;
        return;
      }
    }

    this._highlightedIndex = this._filtered.findIndex((option) => !option.disabled);
  }

  private _renderList() {
    if (!this._panel) return;

    const emptyText = this.getAttribute('empty-text') || 'No matches found';
    if (this._filtered.length === 0) {
      this._panel.innerHTML = `<div class="empty" part="empty">${escapeHtml(emptyText)}</div>`;
      this._syncActiveDescendant();
      return;
    }

    const currentValue = this.value;
    this._panel.innerHTML = this._filtered
      .map((option, filteredIndex) => {
        const selected = option.value === currentValue;
        const highlighted = filteredIndex === this._highlightedIndex;
        const disabled = option.disabled;
        const optionId = `${this._uid}-option-${option.sourceIndex}`;

        return `
          <button
            type="button"
            id="${optionId}"
            class="option"
            role="option"
            aria-selected="${selected ? 'true' : 'false'}"
            aria-disabled="${disabled ? 'true' : 'false'}"
            data-option-index="${filteredIndex}"
            data-highlighted="${highlighted ? 'true' : 'false'}"
            data-selected="${selected ? 'true' : 'false'}"
            ${disabled ? 'disabled' : ''}>
            <span class="option-label">${escapeHtml(option.label)}</span>
          </button>
        `;
      })
      .join('');

    this._syncActiveDescendant();
    this._scrollHighlightedIntoView();
  }

  private _syncInputFromValue() {
    if (!this._input) return;
    if (this._isFocused && this.open) return;

    const selected = this._findOptionByValue(this.value);
    if (selected) {
      this._query = selected.label;
      this._input.value = selected.label;
    } else {
      this._query = this.value;
      this._input.value = this.value;
    }

    this._rebuildFiltered({ preserveHighlight: false });
    this._renderList();
  }

  private _syncActiveDescendant() {
    if (!this._input) return;
    const highlighted = this._filtered[this._highlightedIndex];
    if (!highlighted) {
      this._input.removeAttribute('aria-activedescendant');
      return;
    }
    this._input.setAttribute('aria-activedescendant', `${this._uid}-option-${highlighted.sourceIndex}`);
  }

  private _scrollHighlightedIntoView() {
    if (!this._panel) return;
    if (this._highlightedIndex < 0) return;
    const node = this._panel.querySelector(
      `[data-option-index="${this._highlightedIndex}"]`
    ) as HTMLElement | null;
    if (!node) return;
    node.scrollIntoView({ block: 'nearest' });
  }

  private _updateClearButton() {
    if (!this._clearBtn) return;
    const show = this.hasAttribute('clearable') && (this._query.length > 0 || this.value.length > 0);
    if (show) this._clearBtn.removeAttribute('hidden');
    else this._clearBtn.setAttribute('hidden', '');
  }

  private _applyOpenState() {
    if (!this._panel || !this._input || !this._toggleBtn) return;
    const open = this.open;
    if (open) {
      this._bindGlobalListeners();
      this._panel.setAttribute('data-open', 'true');
      this._panel.removeAttribute('hidden');
      this._input.setAttribute('aria-expanded', 'true');
      this._toggleBtn.setAttribute('data-open', 'true');
      this._rebuildFiltered({ preserveHighlight: true });
      this._renderList();
    } else {
      this._unbindGlobalListeners();
      this._panel.setAttribute('hidden', '');
      this._panel.removeAttribute('data-open');
      this._input.setAttribute('aria-expanded', 'false');
      this._toggleBtn.setAttribute('data-open', 'false');
    }
  }

  private _bindGlobalListeners() {
    if (this._globalListenersBound) return;
    document.addEventListener('mousedown', this._onDocumentMouseDown as EventListener);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners() {
    if (!this._globalListenersBound) return;
    document.removeEventListener('mousedown', this._onDocumentMouseDown as EventListener);
    this._globalListenersBound = false;
  }

  private _openPanel() {
    if (this._isDisabled()) return;
    if (this.open) return;
    this.open = true;
  }

  private _closePanel() {
    if (!this.open) return;
    this.open = false;
  }

  private _commitSelection(option: ComboboxOption) {
    if (option.disabled) return;
    const previous = this.value;

    this._suppressValueSync = true;
    this.value = option.value;
    this._suppressValueSync = false;

    if (this._input) this._input.value = option.label;
    this._query = option.label;
    this._rebuildFiltered({ preserveHighlight: false });
    this._renderList();
    this._updateClearButton();
    this._closePanel();

    if (previous !== option.value) {
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: option.value, label: option.label },
          bubbles: true
        })
      );
    }

    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { value: option.value, label: option.label },
        bubbles: true
      })
    );
  }

  private _commitCustomValue() {
    if (!this.hasAttribute('allow-custom')) return;

    const next = this._query.trim();
    const previous = this.value;
    this._suppressValueSync = true;
    this.value = next;
    this._suppressValueSync = false;
    this._updateClearButton();

    if (previous !== next) {
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: next, label: next, custom: true },
          bubbles: true
        })
      );
    }
  }

  private _moveHighlight(delta: number) {
    if (this._filtered.length === 0) return;

    let next = this._highlightedIndex;
    const maxAttempts = this._filtered.length;
    let attempts = 0;
    do {
      next = next + delta;
      if (next < 0) next = this._filtered.length - 1;
      if (next >= this._filtered.length) next = 0;
      attempts += 1;
    } while (this._filtered[next]?.disabled && attempts < maxAttempts);

    if (this._filtered[next]?.disabled) return;
    this._highlightedIndex = next;
    this._renderList();
  }

  protected render() {
    const headless = this.hasAttribute('headless');
    const disabledRaw = this.getAttribute('disabled');
    const disabled = isTruthyDisabledValue(disabledRaw);
    const readOnly = this.hasAttribute('readonly');
    const placeholder = this.getAttribute('placeholder') || 'Search...';
    const maxLength = this.getAttribute('maxlength');
    const required = this.hasAttribute('required');
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const currentError = this.getAttribute('data-error') || '';
    const hasLabel = Boolean(label || this.querySelector('[slot="label"]'));
    const hasDescription = Boolean(description || this.querySelector('[slot="description"]'));

    this._options = this._readOptions();
    if (!this._query) {
      const selected = this._findOptionByValue(this.value);
      this._query = selected ? selected.label : this.value;
    }
    this._rebuildFiltered({ preserveHighlight: false });

    this.setContent(`
      ${headless ? '' : `<style>${style}</style>`}
      ${hasLabel || hasDescription ? `
        <div class="label-row">
          <label class="label" part="label" id="${this._uid}-label"><slot name="label">${escapeHtml(label)}</slot></label>
          <div class="description" part="description" id="${this._uid}-description"><slot name="description">${escapeHtml(description)}</slot></div>
        </div>
      ` : ''}

      <div class="root" part="root">
        <div class="control" part="control" data-focused="${this._isFocused ? 'true' : 'false'}">
          <input
            id="${this._uid}-input"
            part="input"
            role="combobox"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-expanded="${this.open ? 'true' : 'false'}"
            aria-controls="${this._uid}-listbox"
            ${hasLabel ? `aria-labelledby="${this._uid}-label"` : ''}
            ${hasDescription ? `aria-describedby="${this._uid}-description"` : ''}
            ${this.getAttribute('validation') === 'error' ? 'aria-invalid="true"' : ''}
            value="${escapeHtml(this._query)}"
            placeholder="${escapeHtml(placeholder)}"
            ${disabled ? 'disabled' : ''}
            ${readOnly ? 'readonly' : ''}
            ${required ? 'required' : ''}
            ${maxLength ? `maxlength="${escapeHtml(maxLength)}"` : ''}
          />
          <button type="button" part="clear" class="icon-btn clear-btn" aria-label="Clear value" hidden>✕</button>
          <button type="button" part="toggle" class="icon-btn toggle-btn" data-open="${this.open ? 'true' : 'false'}" aria-label="Toggle options">▾</button>
        </div>
        <div class="panel" id="${this._uid}-listbox" part="panel" role="listbox" ${this.open ? 'data-open="true"' : 'hidden'}></div>
      </div>
      <slot hidden></slot>
      <div class="error" part="error">${escapeHtml(currentError)}</div>
    `);

    this._detachDomListeners();

    this._input = this.root.querySelector('input');
    this._control = this.root.querySelector('.control');
    this._panel = this.root.querySelector('.panel');
    this._clearBtn = this.root.querySelector('.clear-btn');
    this._toggleBtn = this.root.querySelector('.toggle-btn');

    this._renderList();
    this._updateClearButton();
    this._applyOpenState();

    if (this._input) {
      this._input.addEventListener('input', this._onInput);
      this._input.addEventListener('change', this._onNativeChange);
      this._input.addEventListener('focus', this._onFocusIn);
      this._input.addEventListener('blur', this._onFocusOut);
      this._input.addEventListener('keydown', this._onKeyDown);
      if (this.hasAttribute('autofocus')) {
        setTimeout(() => {
          try {
            this._input?.focus();
          } catch {}
        }, 0);
      }
    }

    if (this._clearBtn) this._clearBtn.addEventListener('click', this._onClearClick);
    if (this._toggleBtn) this._toggleBtn.addEventListener('click', this._onToggleClick);
    if (this._panel) this._panel.addEventListener('click', this._onPanelClick);
  }

  private _detachDomListeners() {
    if (this._input) {
      this._input.removeEventListener('input', this._onInput);
      this._input.removeEventListener('change', this._onNativeChange);
      this._input.removeEventListener('focus', this._onFocusIn);
      this._input.removeEventListener('blur', this._onFocusOut);
      this._input.removeEventListener('keydown', this._onKeyDown);
    }

    if (this._clearBtn) this._clearBtn.removeEventListener('click', this._onClearClick);
    if (this._toggleBtn) this._toggleBtn.removeEventListener('click', this._onToggleClick);
    if (this._panel) this._panel.removeEventListener('click', this._onPanelClick);
  }

  private _onInput(event: Event) {
    if (!this._input || this._isDisabled() || this.hasAttribute('readonly')) return;

    const nextQuery = (event.target as HTMLInputElement).value;
    this._query = nextQuery;
    this._openPanel();
    this._rebuildFiltered({ preserveHighlight: false });
    this._renderList();
    this._updateClearButton();

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { query: nextQuery, value: this.value },
        bubbles: true
      })
    );

    const debounceMs = Number(this.getAttribute('debounce') || 0);
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }

    if (debounceMs > 0) {
      this._debounceTimer = setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent('debounced-input', {
            detail: { query: nextQuery, value: this.value },
            bubbles: true
          })
        );
      }, debounceMs);
    } else {
      this.dispatchEvent(
        new CustomEvent('debounced-input', {
          detail: { query: nextQuery, value: this.value },
          bubbles: true
        })
      );
    }
  }

  private _onNativeChange() {
    if (this.hasAttribute('allow-custom')) {
      this._commitCustomValue();
    }
  }

  private _onFocusIn() {
    this._isFocused = true;
    if (this._control) this._control.setAttribute('data-focused', 'true');
    if (!this.hasAttribute('readonly')) this._openPanel();
  }

  private _onFocusOut() {
    this._isFocused = false;
    if (this._control) this._control.setAttribute('data-focused', 'false');
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (this._isDisabled()) return;
    if (!this._input) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._openPanel();
      this._moveHighlight(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._openPanel();
      this._moveHighlight(-1);
      return;
    }

    if (event.key === 'Enter') {
      if (this.open && this._highlightedIndex >= 0) {
        event.preventDefault();
        const highlighted = this._filtered[this._highlightedIndex];
        if (highlighted) this._commitSelection(highlighted);
      } else if (this.hasAttribute('allow-custom')) {
        this._commitCustomValue();
        this._closePanel();
      }
      return;
    }

    if (event.key === 'Escape') {
      if (this.open) {
        event.preventDefault();
        if (!this.hasAttribute('allow-custom')) this._syncInputFromValue();
        this._closePanel();
      }
      return;
    }

    if (event.key === 'Tab') {
      if (this.hasAttribute('allow-custom')) this._commitCustomValue();
      else this._syncInputFromValue();
      this._closePanel();
    }
  }

  private _onClearClick(event: Event) {
    event.preventDefault();
    if (!this._input) return;

    this._query = '';
    this._input.value = '';
    this._suppressValueSync = true;
    this.value = '';
    this._suppressValueSync = false;

    this._rebuildFiltered({ preserveHighlight: false });
    this._renderList();
    this._updateClearButton();
    this._openPanel();

    this.dispatchEvent(new CustomEvent('clear', { bubbles: true }));
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { query: '', value: '' },
        bubbles: true
      })
    );
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: '', label: '' },
        bubbles: true
      })
    );
  }

  private _onToggleClick(event: Event) {
    event.preventDefault();
    if (this._isDisabled()) return;
    if (this.open) this._closePanel();
    else this._openPanel();
    this._input?.focus();
  }

  private _onPanelClick(event: Event) {
    const target = event.target as HTMLElement;
    const button = target.closest('[data-option-index]') as HTMLElement | null;
    if (!button) return;

    const indexRaw = button.getAttribute('data-option-index');
    const index = indexRaw == null ? -1 : Number(indexRaw);
    if (!Number.isFinite(index) || index < 0) return;

    const option = this._filtered[index];
    if (!option || option.disabled) return;
    this._commitSelection(option);
  }

  private _onDocumentMouseDown(event: MouseEvent) {
    if (!this.open) return;
    const path = event.composedPath();
    if (path.includes(this)) return;

    if (this.hasAttribute('allow-custom')) {
      this._commitCustomValue();
    } else {
      this._syncInputFromValue();
    }
    this._closePanel();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-combobox')) {
  customElements.define('ui-combobox', UICombobox);
}
