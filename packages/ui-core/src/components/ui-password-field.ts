import { ElementBase } from '../ElementBase';

const CLEAR_ICON = `
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="m6 6 8 8M14 6l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>
`;

const EYE_ICON = `
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="M2.4 10c1.5-3 4.3-5 7.6-5s6.1 2 7.6 5c-1.5 3-4.3 5-7.6 5s-6.1-2-7.6-5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="10" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
  </svg>
`;

const EYE_OFF_ICON = `
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="M3 3l14 14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M6.1 6.1A9.3 9.3 0 0 1 10 5c3.3 0 6.1 2 7.6 5-.5 1-1.2 1.9-2 2.7M8.2 8.2A2.5 2.5 0 0 1 11.8 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.4 7.1C3.6 7.9 3 8.9 2.4 10c1.5 3 4.3 5 7.6 5 1.2 0 2.4-.3 3.4-.7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

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
    --ui-password-field-strength-gap: 8px;
    --ui-password-field-track-bg: color-mix(in srgb, var(--ui-color-text, #0f172a) 10%, transparent);
    --ui-password-field-strength-weak: var(--ui-color-danger, #dc2626);
    --ui-password-field-strength-fair: var(--ui-color-warning, #d97706);
    --ui-password-field-strength-good: var(--ui-color-primary, #2563eb);
    --ui-password-field-strength-strong: var(--ui-color-success, #16a34a);
    --ui-password-field-toggle-bg: transparent;
    --ui-password-field-toggle-hover-bg: color-mix(in srgb, var(--ui-input-color) 10%, transparent);
    --ui-password-field-toggle-active-bg: color-mix(in srgb, var(--ui-input-color) 16%, transparent);
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
  .suffix-slot[hidden],
  .error[hidden],
  .counter[hidden],
  .meta[hidden],
  .footer[hidden],
  .strength[hidden] {
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
  .suffix-slot {
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

  .suffix-slot {
    flex: 0 0 auto;
    min-inline-size: max-content;
  }

  .suffix-slot ::slotted(*) {
    white-space: nowrap;
    flex-shrink: 0;
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

  .actions {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .clear-btn,
  .toggle-btn {
    flex: 0 0 auto;
    border: none;
    outline: none;
    cursor: pointer;
    inline-size: 28px;
    block-size: 28px;
    border-radius: 8px;
    display: inline-grid;
    place-items: center;
    background: transparent;
    color: color-mix(in srgb, var(--ui-input-color) 74%, transparent);
    transition: background-color 140ms ease, color 140ms ease, transform 140ms ease;
    padding: 0;
    line-height: 0;
  }

  .clear-btn svg,
  .toggle-btn svg {
    inline-size: 15px;
    block-size: 15px;
    pointer-events: none;
  }

  .clear-btn:hover,
  .toggle-btn:hover {
    background: color-mix(in srgb, var(--ui-input-color) 14%, transparent);
    color: var(--ui-input-color);
  }

  .toggle-btn {
    background: var(--ui-password-field-toggle-bg);
  }

  .toggle-btn:hover {
    background: var(--ui-password-field-toggle-hover-bg);
  }

  .toggle-btn:active {
    background: var(--ui-password-field-toggle-active-bg);
    transform: translateY(0);
  }

  .toggle-btn:hover {
    transform: translateY(-1px);
  }

  .clear-btn:focus-visible,
  .toggle-btn:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-input-focus-ring) 32%, transparent);
  }

  .clear-btn[hidden],
  .toggle-btn[hidden] {
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

  .strength {
    display: grid;
    gap: var(--ui-password-field-strength-gap);
  }

  .strength-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .strength-label {
    font: 600 11px/1.35 "Inter", "IBM Plex Sans", sans-serif;
    color: var(--ui-color-text, #0f172a);
    letter-spacing: 0.01em;
  }

  .strength-caption {
    color: var(--ui-color-muted, #64748b);
    font-size: 11px;
    line-height: 1.35;
  }

  .strength-track {
    position: relative;
    inline-size: 100%;
    block-size: 6px;
    border-radius: 999px;
    overflow: hidden;
    background: var(--ui-password-field-track-bg);
  }

  .strength-bar {
    block-size: 100%;
    inline-size: 0%;
    border-radius: inherit;
    background: var(--ui-password-field-strength-weak);
    transition: inline-size 170ms ease, background-color 170ms ease;
  }

  .strength[data-score="1"] .strength-bar {
    inline-size: 25%;
    background: var(--ui-password-field-strength-weak);
  }

  .strength[data-score="2"] .strength-bar {
    inline-size: 50%;
    background: var(--ui-password-field-strength-fair);
  }

  .strength[data-score="3"] .strength-bar {
    inline-size: 75%;
    background: var(--ui-password-field-strength-good);
  }

  .strength[data-score="4"] .strength-bar {
    inline-size: 100%;
    background: var(--ui-password-field-strength-strong);
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  :host([disabled]) .shell {
    opacity: 0.64;
    filter: saturate(0.85);
  }

  :host([disabled]) input,
  :host([disabled]) .clear-btn,
  :host([disabled]) .toggle-btn {
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
    --ui-password-field-toggle-hover-bg: color-mix(in srgb, #e2e8f0 12%, transparent);
    --ui-password-field-toggle-active-bg: color-mix(in srgb, #e2e8f0 18%, transparent);
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

  @media (prefers-reduced-motion: reduce) {
    .shell,
    .clear-btn,
    .toggle-btn,
    .floating-label,
    .strength-bar {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-input-border: 2px solid var(--ui-input-border-color);
      --ui-input-shadow: none;
    }

    .shell:focus-within,
    :host([validation="error"]) .shell {
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
    .clear-btn,
    .toggle-btn {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
  }
`;

type StrengthState = {
  score: 1 | 2 | 3 | 4;
  label: string;
  caption: string;
};

export type UIPasswordStrengthState = StrengthState;
export type UIPasswordStrengthEvaluator = (value: string) => StrengthState;

type PasswordFieldForwardedAttr =
  | 'value'
  | 'placeholder'
  | 'disabled'
  | 'clearable'
  | 'debounce'
  | 'validation'
  | 'size'
  | 'minlength'
  | 'maxlength'
  | 'readonly'
  | 'autofocus'
  | 'counter'
  | 'floating-label'
  | 'name'
  | 'required'
  | 'pattern'
  | 'autocomplete'
  | 'spellcheck'
  | 'variant'
  | 'tone'
  | 'density'
  | 'shape'
  | 'color'
  | 'radius'
  | 'label'
  | 'description'
  | 'data-error';

const FORWARDED_ATTRS: PasswordFieldForwardedAttr[] = [
  'value',
  'placeholder',
  'disabled',
  'clearable',
  'debounce',
  'validation',
  'size',
  'minlength',
  'maxlength',
  'readonly',
  'autofocus',
  'counter',
  'floating-label',
  'name',
  'required',
  'pattern',
  'autocomplete',
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

function computeStrength(value: string): StrengthState {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 14) score += 1;

  const normalized = Math.max(1, Math.min(4, score || 1)) as 1 | 2 | 3 | 4;
  switch (normalized) {
    case 1:
      return { score: 1, label: 'Weak', caption: 'Use more characters and mix case, numbers, or symbols.' };
    case 2:
      return { score: 2, label: 'Fair', caption: 'Add numbers or symbols to reduce guessability.' };
    case 3:
      return { score: 3, label: 'Good', caption: 'Solid baseline. Longer passphrases are even better.' };
    default:
      return { score: 4, label: 'Strong', caption: 'Strong password shape for production accounts.' };
  }
}

export class UIPasswordField extends ElementBase {
  static get observedAttributes() {
    return [...FORWARDED_ATTRS, 'show-strength', 'revealable'];
  }

  private _input: HTMLInputElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;
  private _toggleBtn: HTMLButtonElement | null = null;
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _formUnregister: (() => void) | null = null;
  private _uid = Math.random().toString(36).slice(2, 9);
  private _autofocusApplied = false;
  private _revealed = false;
  private _lastStrengthKey = '';
  strengthEvaluator: UIPasswordStrengthEvaluator | null = null;

  constructor() {
    super();
    this._onNativeInput = this._onNativeInput.bind(this);
    this._onNativeChange = this._onNativeChange.bind(this);
    this._onClearClick = this._onClearClick.bind(this);
    this._onToggleClick = this._onToggleClick.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    if (next) this.setAttribute('value', next);
    else this.removeAttribute('value');
  }

  get revealed(): boolean {
    return this._revealed;
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
    if (oldValue === newValue) return;

    if (name === 'name' && this.isConnected) {
      this._registerWithForm();
    }

    if (name === 'autofocus' && !this.hasAttribute('autofocus')) {
      this._autofocusApplied = false;
    }

    if (!this.isConnected || !this._input) return;

    if (name === 'value') {
      this._syncInputValue(this.value);
      this._syncStrengthUi();
      return;
    }

    this._syncUi();

    if (name === 'autofocus' && this.hasAttribute('autofocus') && !this._autofocusApplied) {
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

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
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

  toggleVisibility(force?: boolean): void {
    if (readBooleanHostAttribute(this, 'disabled') || this.hasAttribute('readonly')) return;
    if (this.getAttribute('revealable') === 'false') return;

    const next = typeof force === 'boolean' ? force : !this._revealed;
    if (next === this._revealed) return;

    const selectionStart = this._input?.selectionStart ?? null;
    const selectionEnd = this._input?.selectionEnd ?? null;
    this._revealed = next;
    this._syncToggleUi();

    this.dispatchEvent(
      new CustomEvent('visibility-change', {
        detail: { revealed: this._revealed },
        bubbles: true,
        composed: true
      })
    );

    queueMicrotask(() => {
      const input = this._input;
      if (!input) return;
      try {
        input.focus({ preventScroll: true });
      } catch {
        input.focus();
      }
      if (selectionStart != null && selectionEnd != null && typeof input.setSelectionRange === 'function') {
        try {
          input.setSelectionRange(selectionStart, selectionEnd);
        } catch {
          // ignore selection restore failures
        }
      }
    });
  }

  protected override render(): void {
    const value = this.value;
    const labelAttr = this.getAttribute('label') || '';
    const descriptionAttr = this.getAttribute('description') || '';
    const dataError = this.getAttribute('data-error') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const requiredMarker = this.hasAttribute('required') ? '<span class="required" aria-hidden="true">*</span>' : '';
    const floatingLabel = this.hasAttribute('floating-label');

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

        <div class="shell" part="shell" data-has-value="${value ? 'true' : 'false'}">
          <span class="prefix" part="prefix"><slot name="prefix"></slot></span>

          <div class="control" part="control">
            <input
              part="input"
              type="password"
              value="${escapeHtml(value)}"
              placeholder="${escapeHtml(placeholder)}"
            />
            ${floatingLabel ? `<span class="floating-label" part="floating-label">${escapeHtml(labelAttr || placeholder || 'Password')}</span>` : ''}
          </div>

          <div class="actions" part="actions">
            <button class="clear-btn" part="clear" type="button" aria-label="Clear" hidden>${CLEAR_ICON}</button>
            <span class="suffix-slot" part="suffix"><slot name="suffix"></slot></span>
            <button class="toggle-btn" part="toggle" type="button" aria-label="Show password">${EYE_ICON}</button>
          </div>
        </div>

        <div class="footer" part="footer">
          <p class="error" id="${this._uid}-error" part="error" aria-live="polite">
            <slot name="error">${escapeHtml(dataError)}</slot>
          </p>
          <p class="counter" part="counter"></p>
        </div>

        <div class="strength" part="strength" hidden>
          <div class="strength-header">
            <span class="strength-label" part="strength-label"></span>
            <span class="strength-caption" part="strength-caption"></span>
          </div>
          <div class="strength-track" part="strength-track">
            <div class="strength-bar" part="strength-bar"></div>
          </div>
        </div>
      </div>
    `);

    this._detachListeners();

    this._input = this.root.querySelector('input');
    this._clearBtn = this.root.querySelector('.clear-btn');
    this._toggleBtn = this.root.querySelector('.toggle-btn');

    this._input?.addEventListener('input', this._onNativeInput);
    this._input?.addEventListener('change', this._onNativeChange);
    this._clearBtn?.addEventListener('click', this._onClearClick);
    this._toggleBtn?.addEventListener('click', this._onToggleClick);

    this._syncUi();
  }

  private _detachListeners(): void {
    this._input?.removeEventListener('input', this._onNativeInput);
    this._input?.removeEventListener('change', this._onNativeChange);
    this._clearBtn?.removeEventListener('click', this._onClearClick);
    this._toggleBtn?.removeEventListener('click', this._onToggleClick);
    this._clearBtn = null;
    this._toggleBtn = null;
  }

  private _syncHostTokens(): void {
    const color = this.getAttribute('color');
    if (color) this.style.setProperty('--ui-input-accent', color);
    else this.style.removeProperty('--ui-input-accent');

    const radius = this.getAttribute('radius') || '';
    if (radius && !isKnownRadius(radius)) this.style.setProperty('--ui-input-border-radius', radius);
    else this.style.removeProperty('--ui-input-border-radius');
  }

  private _syncControlAttrs(): void {
    this._syncHostTokens();
    if (!this._input) return;

    const disabled = readBooleanHostAttribute(this, 'disabled');
    const required = this.hasAttribute('required');
    const readOnly = this.hasAttribute('readonly');
    const maxLength = this.getAttribute('maxlength') || '';
    const minLength = this.getAttribute('minlength') || '';
    const pattern = this.getAttribute('pattern') || '';
    const autoComplete = this.getAttribute('autocomplete') || 'current-password';
    const spellcheck = this.getAttribute('spellcheck') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const name = this.getAttribute('name') || '';

    this._input.disabled = disabled;
    this._input.required = required;
    this._input.readOnly = readOnly;
    this._input.placeholder = placeholder;
    this._input.name = name;
    this._input.type = this._revealed ? 'text' : 'password';

    if (autoComplete) this._input.setAttribute('autocomplete', autoComplete);
    else this._input.removeAttribute('autocomplete');

    if (pattern) this._input.setAttribute('pattern', pattern);
    else this._input.removeAttribute('pattern');

    if (spellcheck) this._input.setAttribute('spellcheck', spellcheck);
    else this._input.removeAttribute('spellcheck');

    if (maxLength && Number.isFinite(Number(maxLength))) this._input.setAttribute('maxlength', maxLength);
    else this._input.removeAttribute('maxlength');

    if (minLength && Number.isFinite(Number(minLength))) this._input.setAttribute('minlength', minLength);
    else this._input.removeAttribute('minlength');
  }

  private _syncInputValue(value: string): void {
    if (this._input && this._input.value !== value) {
      this._input.value = value;
    }

    const shell = this.root.querySelector('.shell') as HTMLElement | null;
    if (shell) shell.setAttribute('data-has-value', value ? 'true' : 'false');

    if (this._clearBtn) {
      const canClear =
        readBooleanHostAttribute(this, 'clearable') &&
        value.length > 0 &&
        !readBooleanHostAttribute(this, 'disabled') &&
        !this.hasAttribute('readonly');
      if (canClear) this._clearBtn.removeAttribute('hidden');
      else this._clearBtn.setAttribute('hidden', '');
    }

    const counter = this.root.querySelector('.counter') as HTMLElement | null;
    if (counter && this.hasAttribute('counter')) {
      const maxLength = this.getAttribute('maxlength');
      counter.textContent = maxLength ? `${value.length}/${maxLength}` : String(value.length);
    } else if (counter) {
      counter.textContent = '';
    }
  }

  private _syncToggleUi(): void {
    if (!this._toggleBtn || !this._input) return;
    this._input.type = this._revealed ? 'text' : 'password';

    const revealable = this.getAttribute('revealable') !== 'false';
    const locked = readBooleanHostAttribute(this, 'disabled') || this.hasAttribute('readonly');
    this._toggleBtn.hidden = !revealable;
    this._toggleBtn.disabled = locked;
    this._toggleBtn.setAttribute('aria-pressed', this._revealed ? 'true' : 'false');
    this._toggleBtn.setAttribute('aria-label', this._revealed ? 'Hide password' : 'Show password');
    const iconState = this._revealed ? 'revealed' : 'hidden';
    if (this._toggleBtn.dataset.iconState !== iconState) {
      this._toggleBtn.dataset.iconState = iconState;
      this._toggleBtn.innerHTML = this._revealed ? EYE_OFF_ICON : EYE_ICON;
    }
  }

  private _syncStrengthUi(): void {
    const strengthEl = this.root.querySelector('.strength') as HTMLElement | null;
    const strengthLabelEl = this.root.querySelector('.strength-label') as HTMLElement | null;
    const strengthCaptionEl = this.root.querySelector('.strength-caption') as HTMLElement | null;
    if (!strengthEl || !strengthLabelEl || !strengthCaptionEl) return;

    const value = this.value;
    const showStrength = this.hasAttribute('show-strength') && value.length > 0;
    strengthEl.hidden = !showStrength;

    if (!showStrength) {
      delete strengthEl.dataset.score;
      strengthLabelEl.textContent = '';
      strengthCaptionEl.textContent = '';
      this._lastStrengthKey = '';
      return;
    }

    const strength = (this.strengthEvaluator || computeStrength)(value);
    strengthEl.dataset.score = String(strength.score);
    strengthLabelEl.textContent = strength.label;
    strengthCaptionEl.textContent = strength.caption;

    const strengthKey = `${value}|${strength.score}|${strength.label}|${strength.caption}`;
    if (strengthKey !== this._lastStrengthKey) {
      this._lastStrengthKey = strengthKey;
      this.dispatchEvent(
        new CustomEvent('strength-change', {
          detail: {
            value,
            score: strength.score,
            label: strength.label,
            caption: strength.caption
          },
          bubbles: true,
          composed: true
        })
      );
    }
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
    const suffixEl = this.root.querySelector('.suffix-slot') as HTMLElement | null;
    const metaEl = this.root.querySelector('.meta') as HTMLElement | null;
    const footerEl = this.root.querySelector('.footer') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;
    const counterEl = this.root.querySelector('.counter') as HTMLElement | null;

    if (labelEl) labelEl.toggleAttribute('hidden', !hasLabel);
    if (descEl) descEl.toggleAttribute('hidden', !hasDescription);
    if (prefixEl) prefixEl.toggleAttribute('hidden', !hasPrefix);
    if (suffixEl) suffixEl.toggleAttribute('hidden', !hasSuffix);
    if (metaEl) metaEl.toggleAttribute('hidden', !hasLabel && !hasDescription);

    const showCounter = this.hasAttribute('counter');
    if (counterEl) counterEl.toggleAttribute('hidden', !showCounter);
    if (errorEl) errorEl.toggleAttribute('hidden', !hasError);
    if (footerEl) footerEl.toggleAttribute('hidden', !hasError && !showCounter);

    if (!this._input) return;

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

  private _syncUi(): void {
    this._syncControlAttrs();
    this._syncInputValue(this.value);
    this._syncDerivedState();
    this._syncToggleUi();
    this._syncStrengthUi();

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
            this._syncUi();
          }
        });
      }
    } catch {
      // ignore registration failures outside ui-form
    }
  }

  private _onSlotChange(): void {
    this._syncDerivedState();
  }

  private _onNativeInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (this.getAttribute('value') !== value) {
      if (value) this.setAttribute('value', value);
      else this.removeAttribute('value');
    } else {
      this._syncInputValue(value);
      this._syncStrengthUi();
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
    this._input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this._input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }));

    try {
      this._input.focus({ preventScroll: true });
    } catch {
      this._input.focus();
    }
  }

  private _onToggleClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleVisibility();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-password-field': UIPasswordField;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-password-field')) {
  customElements.define('ui-password-field', UIPasswordField);
}
