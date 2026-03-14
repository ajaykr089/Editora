import { ElementBase } from '../ElementBase';
import { normalizeCollectionText } from '../primitives/collection';
import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { resolveListboxActiveIndex } from '../primitives/listbox';
import './ui-listbox';
import type { UIListbox } from './ui-listbox';

type ComboboxOption = {
  value: string;
  label: string;
  description: string;
  disabled: boolean;
  sourceIndex: number;
};

type ComboboxState = 'idle' | 'loading' | 'error' | 'success';
type ComboboxOpenSource = 'api' | 'toggle' | 'keyboard' | 'outside' | 'selection' | 'clear' | 'attribute';

type ComboboxOpenDetail = {
  open: boolean;
  previousOpen: boolean;
  source: ComboboxOpenSource;
};

const CLEAR_ICON = `
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="m6 6 8 8M14 6l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>
`;

const CHEVRON_ICON = `
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="m5.6 7.6 4.4 4.6 4.4-4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const style = `
  :host {
    --ui-combobox-width: var(--ui-width, 100%);
    --ui-combobox-min-width: 248px;
    --ui-combobox-height: 42px;
    --ui-combobox-padding-x: 12px;
    --ui-combobox-radius: var(--ui-radius, 12px);
    --ui-combobox-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-combobox-text: var(--ui-color-text, #0f172a);
    --ui-combobox-muted: var(--ui-color-muted, #64748b);
    --ui-combobox-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-combobox-border: 1px solid var(--ui-combobox-border-color);
    --ui-combobox-shadow: none;
    --ui-combobox-shadow-hover: none;
    --ui-combobox-shadow-focus: none;
    --ui-combobox-focus: var(--ui-color-primary, #2563eb);
    --ui-combobox-panel-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent);
    --ui-combobox-panel-border: 1px solid color-mix(in srgb, var(--ui-combobox-border-color) 80%, transparent);
    --ui-combobox-panel-shadow: none;
    --ui-combobox-panel-z: 1600;
    --ui-combobox-option-hover: color-mix(in srgb, var(--ui-color-primary, #2563eb) 11%, transparent);
    --ui-combobox-option-active: color-mix(in srgb, var(--ui-color-primary, #2563eb) 18%, transparent);
    --ui-combobox-error: var(--ui-color-danger, #dc2626);
    --ui-combobox-success: var(--ui-color-success, #16a34a);
    --ui-combobox-warning: var(--ui-color-warning, #d97706);
    --ui-combobox-duration: 150ms;
    --ui-combobox-ease: cubic-bezier(0.2, 0.8, 0.2, 1);

    display: inline-block;
    width: auto;
    min-inline-size: min(100%, var(--ui-combobox-min-width));
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ui-combobox-text);
    color-scheme: light dark;
  }

  .label-row {
    display: grid;
    gap: 6px;
    margin-bottom: 8px;
  }

  .label {
    color: var(--ui-combobox-text);
    font-size: 13px;
    line-height: 1.3;
    font-weight: 650;
    letter-spacing: 0.01em;
  }

  .description {
    color: var(--ui-combobox-muted);
    font-size: 12px;
    line-height: 1.4;
  }

  .root {
    position: relative;
    width: var(--ui-combobox-width);
    min-width: var(--ui-combobox-min-width);
    max-width: 100%;
  }

  .control {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    width: 100%;
    min-height: var(--ui-combobox-height);
    border: var(--ui-combobox-border);
    border-radius: var(--ui-combobox-radius);
    background: linear-gradient(
      170deg,
      color-mix(in srgb, var(--ui-combobox-bg) 90%, #ffffff 10%),
      var(--ui-combobox-bg)
    );
    box-shadow: var(--ui-combobox-shadow);
    transition:
      border-color var(--ui-combobox-duration) var(--ui-combobox-ease),
      box-shadow var(--ui-combobox-duration) var(--ui-combobox-ease),
      background-color var(--ui-combobox-duration) var(--ui-combobox-ease),
      transform var(--ui-combobox-duration) var(--ui-combobox-ease);
    overflow: hidden;
    backdrop-filter: saturate(1.08) blur(8px);
  }

  .control:hover {
    border-color: color-mix(in srgb, var(--ui-combobox-focus) 34%, var(--ui-combobox-border-color));
    box-shadow: var(--ui-combobox-shadow-hover);
  }

  input {
    grid-column: 1 / 2;
    min-width: 0;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ui-combobox-text);
    padding: 9px var(--ui-combobox-padding-x);
    font-size: 14px;
    line-height: 1.4;
    font-family: inherit;
    min-height: var(--ui-combobox-height);
  }

  input::placeholder {
    color: var(--ui-combobox-muted);
  }

  .control[data-focused="true"] {
    border-color: color-mix(in srgb, var(--ui-combobox-focus) 72%, var(--ui-combobox-border-color));
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--ui-combobox-focus) 16%, transparent),
      var(--ui-combobox-shadow-focus);
    transform: translateY(-1px);
  }

  .icon-btn {
    align-self: center;
    border: none;
    background: transparent;
    color: var(--ui-combobox-muted);
    inline-size: 28px;
    block-size: 28px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-inline-end: 2px;
    transition:
      background-color var(--ui-combobox-duration) var(--ui-combobox-ease),
      color var(--ui-combobox-duration) var(--ui-combobox-ease),
      transform var(--ui-combobox-duration) var(--ui-combobox-ease);
  }

  .icon-btn svg {
    inline-size: 14px;
    block-size: 14px;
    pointer-events: none;
  }

  .icon-btn:hover {
    background: color-mix(in srgb, var(--ui-combobox-text) 8%, transparent);
    color: var(--ui-combobox-text);
  }

  .icon-btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-combobox-focus) 70%, transparent);
    outline-offset: 1px;
  }

  .icon-btn[hidden] {
    display: none !important;
  }

  .icon-btn[disabled] {
    opacity: 0.45;
    cursor: not-allowed;
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
    max-height: min(360px, 52vh);
    overflow: auto;
    padding: 6px 6px 8px;
    z-index: var(--ui-combobox-panel-z, 1600);
    display: none;
    opacity: 0;
    transform: translateY(-4px) scale(0.985);
    transition:
      opacity var(--ui-combobox-duration) var(--ui-combobox-ease),
      transform var(--ui-combobox-duration) var(--ui-combobox-ease);
    backdrop-filter: saturate(1.08) blur(8px);
  }

  .panel[data-open="true"] {
    display: block;
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .status-row {
    position: sticky;
    top: 0;
    z-index: 1;
    margin: 0 0 6px;
    padding: 6px 8px;
    border-radius: 9px;
    border: 1px solid color-mix(in srgb, var(--ui-combobox-border-color) 82%, transparent);
    background: color-mix(in srgb, var(--ui-combobox-bg) 95%, transparent);
    color: var(--ui-combobox-muted);
    font-size: 11px;
    line-height: 1.35;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .status-row[data-state="loading"] {
    border-color: color-mix(in srgb, var(--ui-combobox-warning) 40%, var(--ui-combobox-border-color));
    color: var(--ui-combobox-warning);
    background: color-mix(in srgb, var(--ui-combobox-warning) 12%, transparent);
  }

  .status-row[data-state="error"] {
    border-color: color-mix(in srgb, var(--ui-combobox-error) 46%, var(--ui-combobox-border-color));
    color: var(--ui-combobox-error);
    background: color-mix(in srgb, var(--ui-combobox-error) 11%, transparent);
  }

  .status-row[data-state="success"] {
    border-color: color-mix(in srgb, var(--ui-combobox-success) 46%, var(--ui-combobox-border-color));
    color: var(--ui-combobox-success);
    background: color-mix(in srgb, var(--ui-combobox-success) 12%, transparent);
  }

  .status-row[data-state="idle"] {
    display: none;
  }

  .option {
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 10px;
    padding: 10px 10px;
    cursor: pointer;
    color: var(--ui-combobox-text);
    font-size: 13px;
    line-height: 1.35;
    transition:
      background-color var(--ui-combobox-duration) var(--ui-combobox-ease),
      color var(--ui-combobox-duration) var(--ui-combobox-ease),
      transform var(--ui-combobox-duration) var(--ui-combobox-ease);
  }

  .option:hover {
    background: var(--ui-combobox-option-hover);
  }

  .option[data-highlighted="true"] {
    background: var(--ui-combobox-option-active);
    transform: translateX(1px);
  }

  .option-text {
    min-inline-size: 0;
    display: grid;
    gap: 2px;
    flex: 1 1 auto;
  }

  .option-label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    line-height: 1.35;
    font-weight: 560;
  }

  .option-description {
    color: var(--ui-combobox-muted);
    font-size: 11px;
    line-height: 1.35;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .option-check {
    inline-size: 14px;
    text-align: center;
    font-size: 12px;
    opacity: 0;
    color: color-mix(in srgb, var(--ui-combobox-focus) 80%, var(--ui-combobox-text));
  }

  .option[data-selected="true"] .option-check {
    opacity: 1;
  }

  .option[disabled] {
    opacity: 0.46;
    cursor: not-allowed;
    transform: none;
  }

  .empty {
    padding: 14px 10px;
    color: var(--ui-combobox-muted);
    font-size: 12px;
    line-height: 1.45;
    text-align: center;
  }

  .error {
    margin-top: 8px;
    color: var(--ui-combobox-error);
    font-size: 12px;
    line-height: 1.35;
    min-block-size: 16px;
  }

  :host([state="loading"]) .control {
    border-color: color-mix(in srgb, var(--ui-combobox-warning) 52%, var(--ui-combobox-border-color));
  }

  :host([state="error"]) .control {
    border-color: var(--ui-combobox-error);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--ui-combobox-error) 19%, transparent), var(--ui-combobox-shadow);
  }

  :host([state="success"]) .control {
    border-color: color-mix(in srgb, var(--ui-combobox-success) 72%, var(--ui-combobox-border-color));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-combobox-success) 13%, transparent), var(--ui-combobox-shadow);
  }

  :host([disabled]) .control {
    opacity: 0.62;
    pointer-events: none;
    background: color-mix(in srgb, var(--ui-combobox-muted) 20%, transparent);
  }

  :host([readonly]) .control {
    background: color-mix(in srgb, var(--ui-combobox-bg) 88%, var(--ui-combobox-muted) 12%);
  }

  :host([readonly]) .clear-btn {
    display: none !important;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-combobox-height: 36px;
    --ui-combobox-padding-x: 10px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-combobox-height: 48px;
    --ui-combobox-padding-x: 13px;
  }

  :host([variant="surface"]) .control {
    background: var(--ui-color-surface-alt, #f8fafc);
  }

  :host([variant="soft"]) .control {
    background: color-mix(in srgb, var(--ui-combobox-text) 4%, transparent);
    border-color: color-mix(in srgb, var(--ui-combobox-border-color) 70%, transparent);
  }

  :host([variant="classic"]) .control {
    border-radius: 10px;
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
    .icon-btn,
    .option {
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

  @media (max-width: 640px) {
    :host {
      --ui-combobox-min-width: 100%;
    }

    .panel {
      max-height: min(50vh, 360px);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-combobox-bg: Canvas;
      --ui-combobox-text: CanvasText;
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

    .status-row {
      border-color: CanvasText;
      color: CanvasText;
      background: Canvas;
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
      'state',
      'state-text',
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
  private _panel: UIListbox | null = null;
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
  private _dismissableLayer: DismissableLayerHandle | null = null;
  private _nextOpenSource: ComboboxOpenSource = 'attribute';
  private _optionsRefreshScheduled = false;
  private _panelPointerDown = false;

  constructor() {
    super();
    this._onInput = this._onInput.bind(this);
    this._onNativeChange = this._onNativeChange.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClearClick = this._onClearClick.bind(this);
    this._onToggleClick = this._onToggleClick.bind(this);
    this._onPanelPointerDown = this._onPanelPointerDown.bind(this);
    this._onPanelClick = this._onPanelClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this._observer = new MutationObserver(() => {
      this._scheduleOptionsRefresh();
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
    this._dismissableLayer?.destroy();
    this._dismissableLayer = null;

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
    this._optionsRefreshScheduled = false;

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
        this._emitOpenState(newVal != null, oldVal != null, this._nextOpenSource);
      }
      this._nextOpenSource = 'attribute';
      return;
    }

    if (name === 'disabled') {
      if (this._isDisabled() && this.open) this._setOpen(false, 'attribute');
      if (this.isConnected) this.requestRender();
      return;
    }

    if (name === 'state') {
      if (this.isConnected) this.requestRender();
      return;
    }

    if (name === 'state-text') {
      this._renderList();
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
    this._setOpen(next, 'api');
  }

  private _isDisabled(): boolean {
    return isTruthyDisabledValue(this.getAttribute('disabled'));
  }

  private _isReadonly(): boolean {
    return this.hasAttribute('readonly');
  }

  private _state(): ComboboxState {
    const raw = (this.getAttribute('state') || 'idle').trim().toLowerCase();
    if (raw === 'loading' || raw === 'error' || raw === 'success') return raw;
    return 'idle';
  }

  private _isLoading(): boolean {
    return this._state() === 'loading';
  }

  private _stateText(): string {
    const custom = this.getAttribute('state-text');
    if (custom) return custom;
    const state = this._state();
    if (state === 'loading') return 'Syncing results';
    if (state === 'error') return 'Unable to load results';
    if (state === 'success') return 'Results up to date';
    return '';
  }

  private _emitOpenState(open: boolean, previousOpen: boolean, source: ComboboxOpenSource) {
    const detail: ComboboxOpenDetail = { open, previousOpen, source };
    this.dispatchEvent(
      new CustomEvent(open ? 'open' : 'close', {
        detail,
        bubbles: true,
        composed: true
      })
    );
    this.dispatchEvent(
      new CustomEvent(open ? 'ui-open' : 'ui-close', {
        detail,
        bubbles: true,
        composed: true
      })
    );
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

  private _readOptions(): ComboboxOption[] {
    const optionElements = Array.from(
      this.querySelectorAll('option,[data-combobox-option]')
    ) as HTMLElement[];
    const seen = new Set<string>();

    return optionElements
      .map((node, index) => {
      const isNativeOption = node.tagName.toLowerCase() === 'option';
      const native = node as HTMLOptionElement;

      const value = isNativeOption
        ? native.value || native.textContent || ''
        : node.getAttribute('value') || node.getAttribute('data-value') || node.textContent || '';
      const label = isNativeOption
        ? (native.label || native.textContent || native.value || '').trim()
        : (node.getAttribute('label') || node.textContent || value).trim();
      const description = (node.getAttribute('description') || node.getAttribute('data-description') || '').trim();
      const disabled = isNativeOption ? native.disabled : isTruthyDisabledValue(node.getAttribute('disabled'));
      const normalizedValue = value.trim();

      if (!normalizedValue && !label) return null;
      const dedupeKey = `${normalizedValue}::${label}`;
      if (seen.has(dedupeKey)) return null;
      seen.add(dedupeKey);

      return {
        value: normalizedValue,
        label,
        description,
        disabled,
        sourceIndex: index
      };
    })
      .filter((option): option is ComboboxOption => Boolean(option));
  }

  private _findOptionByValue(value: string): ComboboxOption | null {
    return this._options.find((option) => option.value === value) || null;
  }

  private _findExactOptionByQuery(query: string): ComboboxOption | null {
    const normalized = normalizeCollectionText(query);
    if (!normalized) return null;
    return (
      this._options.find(
        (option) =>
          !option.disabled &&
          (normalizeCollectionText(option.label) === normalized || normalizeCollectionText(option.value) === normalized)
      ) || null
    );
  }

  private _rebuildFiltered(config?: { preserveHighlight?: boolean }) {
    const query = normalizeCollectionText(this._query);
    const noFilter = this.hasAttribute('no-filter');
    const previous = this._filtered[this._highlightedIndex];

    this._filtered = this._options.filter((option) => {
      if (noFilter || !query) return true;
      return (
        normalizeCollectionText(option.label).includes(query) ||
        normalizeCollectionText(option.value).includes(query)
      );
    });

    if (config?.preserveHighlight && previous) {
      const keepIndex = this._filtered.findIndex((option) => option.sourceIndex === previous.sourceIndex);
      if (keepIndex >= 0 && !this._filtered[keepIndex].disabled) {
        this._highlightedIndex = keepIndex;
        return;
      }
    }

    const selected = this._findOptionByValue(this.value);
    if (selected) {
      const selectedIndex = this._filtered.findIndex((option) => option.sourceIndex === selected.sourceIndex);
      if (selectedIndex >= 0 && !this._filtered[selectedIndex].disabled) {
        this._highlightedIndex = selectedIndex;
        return;
      }
    }

    this._highlightedIndex = resolveListboxActiveIndex(this._filtered, {
      getDisabled: (option) => option.disabled
    });
  }

  private _renderList() {
    if (!this._panel) return;

    const stateRow = this._renderStateRow();
    const emptyText = this.getAttribute('empty-text') || 'No matches found';
    if (this._filtered.length === 0) {
      this._panel.innerHTML = `${stateRow}<div class="empty" part="empty">${escapeHtml(emptyText)}</div>`;
      this._panel.refresh();
      this._panel.clearActive();
      this._syncActiveDescendant();
      return;
    }

    const currentValue = this.value;
    const optionsMarkup = this._filtered
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
            <span class="option-text">
              <span class="option-label">${escapeHtml(option.label)}</span>
              ${option.description ? `<span class="option-description">${escapeHtml(option.description)}</span>` : ''}
            </span>
            <span class="option-check" aria-hidden="true">✓</span>
          </button>
        `;
      })
      .join('');

    this._panel.innerHTML = `${stateRow}${optionsMarkup}`;
    this._panel.refresh();

    this._syncActiveDescendant();
    this._scrollHighlightedIntoView();
  }

  private _renderStateRow(): string {
    const state = this._state();
    const text = this._stateText();
    if (!text) return '';
    return `<div class="status-row" part="status" data-state="${escapeHtml(state)}" aria-live="polite">${escapeHtml(text)}</div>`;
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
    const node = this._panel?.querySelector(`[data-option-index="${this._highlightedIndex}"]`) as HTMLElement | null;
    if (node && this._panel) {
      this._panel.setActiveItem(node, {
        focus: false,
        owner: this._input,
        scroll: false
      });
      return;
    }
    this._panel?.clearActive();
    this._input.removeAttribute('aria-activedescendant');
  }

  private _scrollHighlightedIntoView() {
    if (!this._panel) return;
    if (this._highlightedIndex < 0) return;
    const node = this._panel.querySelector(`[data-option-index="${this._highlightedIndex}"]`) as HTMLElement | null;
    this._panel.setActiveItem(node, {
      focus: false,
      owner: this._input,
      scroll: true
    });
  }

  private _updateClearButton() {
    if (!this._clearBtn) return;
    const show =
      this.hasAttribute('clearable') &&
      !this._isDisabled() &&
      !this._isReadonly() &&
      !this._isLoading() &&
      (this._query.length > 0 || this.value.length > 0);
    if (show) this._clearBtn.removeAttribute('hidden');
    else this._clearBtn.setAttribute('hidden', '');
  }

  private _applyOpenState() {
    if (!this._panel || !this._input || !this._toggleBtn) return;
    const open = this.open;
    const loading = this._isLoading();
    if (open) {
      this._bindGlobalListeners();
      this._panel.setAttribute('data-open', 'true');
      this._panel.removeAttribute('hidden');
      this._panel.setAttribute('aria-hidden', 'false');
      this._input.setAttribute('aria-expanded', 'true');
      this._toggleBtn.setAttribute('data-open', 'true');
      this._rebuildFiltered({ preserveHighlight: true });
      this._renderList();
      this._syncDismissableLayer();
    } else {
      this._unbindGlobalListeners();
      this._dismissableLayer?.destroy();
      this._dismissableLayer = null;
      this._panel.setAttribute('hidden', '');
      this._panel.removeAttribute('data-open');
      this._panel.setAttribute('aria-hidden', 'true');
      this._input.setAttribute('aria-expanded', 'false');
      this._toggleBtn.setAttribute('data-open', 'false');
    }

    this._toggleBtn.disabled = this._isDisabled();
    if (this._clearBtn) this._clearBtn.disabled = this._isDisabled() || this._isReadonly();
    this._input.setAttribute('aria-busy', loading ? 'true' : 'false');
    this._panel.setAttribute('aria-busy', loading ? 'true' : 'false');
  }

  private _bindGlobalListeners() {
    if (this._globalListenersBound) return;
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners() {
    if (!this._globalListenersBound) return;
    this._globalListenersBound = false;
  }

  private _syncDismissableLayer() {
    if (!this.open || !this._panel) return;
    this._dismissableLayer?.destroy();
    this._dismissableLayer = createDismissableLayer({
      node: this._panel,
      trigger: this._control,
      closeOnEscape: false,
      closeOnPointerOutside: true,
      onDismiss: (reason) => {
        if (reason !== 'outside-pointer') return;
        if (this.hasAttribute('allow-custom')) {
          this._commitCustomValue();
        } else {
          this._syncInputFromValue();
        }
        this._closePanel('outside');
      }
    });
  }

  private _setOpen(next: boolean, source: ComboboxOpenSource = 'api') {
    if (next === this.open) return;
    if (next && this._isDisabled()) return;
    this._nextOpenSource = source;
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  private _openPanel(source: ComboboxOpenSource = 'api') {
    this._setOpen(true, source);
  }

  private _closePanel(source: ComboboxOpenSource = 'api') {
    this._setOpen(false, source);
  }

  private _commitSelection(option: ComboboxOption) {
    if (this._isDisabled() || this._isReadonly()) return;
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
    this._closePanel('selection');

    if (previous !== option.value) {
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: option.value, label: option.label },
          bubbles: true,
          composed: true
        })
      );
    }

    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { value: option.value, label: option.label },
        bubbles: true,
        composed: true
      })
    );
  }

  private _commitCustomValue() {
    if (this._isDisabled() || this._isReadonly()) return;
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
          bubbles: true,
          composed: true
        })
      );
    }
  }

  private _moveHighlight(delta: number) {
    if (this._filtered.length === 0) return;
    const current = this._panel?.querySelector(`[data-option-index="${this._highlightedIndex}"]`) as HTMLElement | null;
    const moved = this._panel?.move(delta > 0 ? 1 : -1, {
      current,
      focus: false,
      owner: this._input,
      scroll: true
    }) || null;
    if (!moved) return;
    const next = Number(moved.getAttribute('data-option-index') || '-1');
    if (next < 0) return;
    this._highlightedIndex = next;
    this._renderList();
  }

  protected render() {
    const headless = this.hasAttribute('headless');
    const disabledRaw = this.getAttribute('disabled');
    const disabled = isTruthyDisabledValue(disabledRaw);
    const readOnly = this._isReadonly();
    const state = this._state();
    const loading = state === 'loading';
    const placeholder = this.getAttribute('placeholder') || 'Search...';
    const maxLength = this.getAttribute('maxlength');
    const required = this.hasAttribute('required');
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const currentError = this.getAttribute('data-error') || '';
    const errorText = currentError || (state === 'error' ? this._stateText() || 'Unable to load options.' : '');
    const hasValidationError = this.getAttribute('validation') === 'error' || state === 'error' || Boolean(errorText);
    const hasLabel = Boolean(label || this.querySelector('[slot="label"]'));
    const hasDescription = Boolean(description || this.querySelector('[slot="description"]'));
    const errorId = `${this._uid}-error`;
    const describedBy = [hasDescription ? `${this._uid}-description` : '', hasValidationError ? errorId : '']
      .filter(Boolean)
      .join(' ');

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
        <div class="control" part="control" data-focused="${this._isFocused ? 'true' : 'false'}" data-state="${escapeHtml(state)}">
          <input
            id="${this._uid}-input"
            part="input"
            role="combobox"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-expanded="${this.open ? 'true' : 'false'}"
            aria-controls="${this._uid}-listbox"
            ${hasLabel ? `aria-labelledby="${this._uid}-label"` : ''}
            ${describedBy ? `aria-describedby="${describedBy}"` : ''}
            ${hasValidationError ? 'aria-invalid="true"' : ''}
            aria-busy="${loading ? 'true' : 'false'}"
            value="${escapeHtml(this._query)}"
            placeholder="${escapeHtml(placeholder)}"
            ${disabled ? 'disabled' : ''}
            ${readOnly ? 'readonly' : ''}
            ${required ? 'required' : ''}
            ${maxLength ? `maxlength="${escapeHtml(maxLength)}"` : ''}
          />
          <button type="button" part="clear" class="icon-btn clear-btn" aria-label="Clear value" hidden ${readOnly ? 'disabled' : ''}>${CLEAR_ICON}</button>
          <button type="button" part="toggle" class="icon-btn toggle-btn" data-open="${this.open ? 'true' : 'false'}" aria-label="Toggle options">${CHEVRON_ICON}</button>
        </div>
        <ui-listbox class="panel" id="${this._uid}-listbox" part="panel" role="listbox" item-selector=".option[data-option-index]" item-role="option" active-attribute="data-highlighted" aria-busy="${loading ? 'true' : 'false'}" data-state="${escapeHtml(state)}" ${this.open ? 'data-open="true" aria-hidden="false"' : 'hidden aria-hidden="true"'}></ui-listbox>
      </div>
      <slot hidden></slot>
      <div class="error" part="error" id="${errorId}" ${hasValidationError ? '' : 'hidden'}>${escapeHtml(errorText)}</div>
    `);

    this._detachDomListeners();

    this._input = this.root.querySelector('input');
    this._control = this.root.querySelector('.control');
    this._panel = this.root.querySelector('ui-listbox.panel');
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
    if (this._panel) {
      this._panel.addEventListener('pointerdown', this._onPanelPointerDown);
      this._panel.addEventListener('click', this._onPanelClick);
    }
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
    if (this._panel) {
      this._panel.removeEventListener('pointerdown', this._onPanelPointerDown);
      this._panel.removeEventListener('click', this._onPanelClick);
    }
  }

  private _onInput(event: Event) {
    if (!this._input || this._isDisabled() || this._isReadonly()) return;

    const nextQuery = (event.target as HTMLInputElement).value;
    this._query = nextQuery;
    this._openPanel('keyboard');
    this._rebuildFiltered({ preserveHighlight: false });
    this._renderList();
    this._updateClearButton();

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { query: nextQuery, value: this.value },
        bubbles: true,
        composed: true
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
            bubbles: true,
            composed: true
          })
        );
      }, debounceMs);
    } else {
      this.dispatchEvent(
        new CustomEvent('debounced-input', {
          detail: { query: nextQuery, value: this.value },
          bubbles: true,
          composed: true
        })
      );
    }
  }

  private _onNativeChange() {
    if (this._isDisabled() || this._isReadonly()) return;
    if (this.hasAttribute('allow-custom')) {
      this._commitCustomValue();
    }
  }

  private _onFocusIn() {
    this._isFocused = true;
    if (this._control) this._control.setAttribute('data-focused', 'true');
    if (!this._isReadonly()) this._openPanel('keyboard');
  }

  private _onFocusOut() {
    this._isFocused = false;
    if (this._control) this._control.setAttribute('data-focused', 'false');
    queueMicrotask(() => {
      if (this._panelPointerDown) {
        this._panelPointerDown = false;
        return;
      }
      const rootActive = (this.root as ShadowRoot).activeElement as Element | null;
      if (rootActive) return;
      if (!this.open) return;
      if (this.hasAttribute('allow-custom')) this._commitCustomValue();
      else this._syncInputFromValue();
      this._closePanel('outside');
      });
  }

  private _refreshOptionsFromDom(): void {
    this._options = this._readOptions();
    this._rebuildFiltered({ preserveHighlight: false });
    this._renderList();
    this._syncInputFromValue();
  }

  private _scheduleOptionsRefresh(): void {
    if (this._optionsRefreshScheduled) return;
    this._optionsRefreshScheduled = true;
    queueMicrotask(() => {
      this._optionsRefreshScheduled = false;
      if (!this.isConnected) return;
      this._refreshOptionsFromDom();
    });
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (this._isDisabled()) return;
    if (!this._input) return;

    if (event.key === 'Home' && this.open) {
      event.preventDefault();
      const first = this._panel?.focusBoundary('first', { focus: false, owner: this._input, scroll: true }) || null;
      this._highlightedIndex = Number(first?.getAttribute('data-option-index') || '-1');
      this._renderList();
      return;
    }

    if (event.key === 'End' && this.open) {
      event.preventDefault();
      const last = this._panel?.focusBoundary('last', { focus: false, owner: this._input, scroll: true }) || null;
      this._highlightedIndex = Number(last?.getAttribute('data-option-index') || '-1');
      this._renderList();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._openPanel('keyboard');
      this._moveHighlight(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._openPanel('keyboard');
      this._moveHighlight(-1);
      return;
    }

    if (event.key === 'Enter') {
      if (this.open && this._highlightedIndex >= 0) {
        event.preventDefault();
        const highlighted = this._filtered[this._highlightedIndex];
        if (highlighted) this._commitSelection(highlighted);
      } else if (this.hasAttribute('allow-custom')) {
        event.preventDefault();
        this._commitCustomValue();
        this._closePanel('keyboard');
      } else if (this.open) {
        event.preventDefault();
        this._syncInputFromValue();
        this._closePanel('keyboard');
      } else {
        const exact = this._findExactOptionByQuery(this._query);
        if (exact) {
          event.preventDefault();
          this._commitSelection(exact);
        }
      }
      return;
    }

    if (event.key === 'Escape') {
      if (this.open) {
        event.preventDefault();
        if (!this.hasAttribute('allow-custom')) this._syncInputFromValue();
        this._closePanel('keyboard');
      }
      return;
    }

    if (event.key === 'Tab') {
      if (this.hasAttribute('allow-custom')) this._commitCustomValue();
      else this._syncInputFromValue();
      this._closePanel('keyboard');
    }
  }

  private _onClearClick(event: Event) {
    event.preventDefault();
    if (!this._input) return;
    if (this._isDisabled() || this._isReadonly()) return;

    this._query = '';
    this._input.value = '';
    this._suppressValueSync = true;
    this.value = '';
    this._suppressValueSync = false;

    this._rebuildFiltered({ preserveHighlight: false });
    this._renderList();
    this._updateClearButton();
    this._openPanel('clear');

    this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }));
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { query: '', value: '' },
        bubbles: true,
        composed: true
      })
    );
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: '', label: '' },
        bubbles: true,
        composed: true
      })
    );
  }

  private _onToggleClick(event: Event) {
    event.preventDefault();
    if (this._isDisabled()) return;
    if (this.open) this._closePanel('toggle');
    else this._openPanel('toggle');
    this._input?.focus();
  }

  private _onPanelPointerDown(event: PointerEvent) {
    if (this._isReadonly()) return;
    const target = event.target as HTMLElement | null;
    const option = target?.closest('[data-option-index]') as HTMLElement | null;
    if (!option) return;
    this._panelPointerDown = true;
    event.preventDefault();
  }

  private _onPanelClick(event: Event) {
    if (this._isReadonly()) return;
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
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-combobox')) {
  customElements.define('ui-combobox', UICombobox);
}
