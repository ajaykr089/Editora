import { ElementBase } from '../ElementBase';
import { acquireBodyScrollLock, releaseBodyScrollLock } from '../scroll-lock';

const style = `
  :host {
    display: block;
    color-scheme: light dark;
    --ui-alert-radius: var(--base-alert-dialog-radius, var(--ui-radius, 4px));
    --ui-alert-bg-base: var(--base-alert-dialog-bg, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-alert-bg: var(--ui-alert-bg-base);
    --ui-alert-text: var(--ui-color-text, var(--ui-text, #202020));
    --ui-alert-muted: color-mix(in srgb, var(--ui-alert-text) 62%, var(--ui-color-muted, var(--ui-muted, #646464)) 38%);
    --ui-alert-accent: var(--ui-color-muted, #64748b);
    --ui-alert-border-color: color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 82%, transparent);
    --ui-alert-border: var(--base-alert-dialog-border, 1px solid var(--ui-alert-border-color));
    --ui-alert-shadow: var(--base-alert-dialog-shadow, var(--shadow-4, none));
    --ui-alert-padding: var(--base-alert-dialog-padding, 20px);
    --ui-alert-gap: var(--base-alert-dialog-gap, var(--ui-default-gap, 8px));
    --ui-alert-min-width: var(--base-alert-dialog-min-width, 360px);
    --ui-alert-max-width: var(--base-alert-dialog-max-width, min(90vw, 560px));
    --ui-alert-z: 1301;
    --ui-alert-backdrop-z: 1300;
    --ui-alert-focus: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-alert-danger: var(--ui-color-danger, #dc2626);
    --ui-alert-backdrop: var(--base-alert-dialog-backdrop, var(--color-overlay, rgba(2, 6, 23, 0.52)));
    --ui-alert-btn-bg: color-mix(in srgb, var(--ui-alert-bg-base) 90%, var(--ui-color-background, #ffffff) 10%);
    --ui-alert-btn-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-alert-btn-hover: color-mix(in srgb, var(--ui-alert-btn-bg) 76%, var(--ui-color-border, #cbd5e1) 24%);
    --ui-alert-confirm-bg: var(--ui-alert-accent);
    --ui-alert-confirm-color: var(--ui-color-foreground-on-primary, #ffffff);
    --ui-alert-icon-bg: color-mix(in srgb, var(--ui-alert-accent) 14%, transparent);
    --ui-alert-icon-color: var(--ui-alert-accent);
    --ui-alert-duration: 180ms;
    --ui-alert-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
    --ui-alert-title-size: var(--ui-default-font-size, 14px);
    --ui-alert-title-line-height: var(--ui-default-line-height, 20px);
    --ui-alert-title-weight: 650;
    --ui-alert-description-size: 13px;
    --ui-alert-description-line-height: 20px;
    --ui-alert-icon-size: 28px;
    --ui-alert-button-height: var(--base-button-height-md, 36px);
    --ui-alert-button-radius: var(--ui-radius, 4px);
  }

  :host([tone='info']) {
    --ui-alert-accent: var(--ui-color-primary, #2563eb);
  }

  :host([tone='success']) {
    --ui-alert-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone='warning']) {
    --ui-alert-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone='danger']) {
    --ui-alert-accent: var(--ui-color-danger, #dc2626);
  }

  :host([size='sm']),
  :host([size='1']) {
    --ui-alert-padding: 16px;
    --ui-alert-gap: 10px;
    --ui-alert-min-width: 300px;
    --ui-alert-max-width: min(88vw, 440px);
    --ui-alert-title-size: 13px;
    --ui-alert-title-line-height: 18px;
    --ui-alert-description-size: 12px;
    --ui-alert-description-line-height: 18px;
    --ui-alert-icon-size: 24px;
    --ui-alert-button-height: var(--base-button-height-sm, 32px);
  }

  :host([size='md']),
  :host([size='2']) {
    --ui-alert-padding: var(--base-alert-dialog-padding, 20px);
    --ui-alert-gap: var(--base-alert-dialog-gap, var(--ui-default-gap, 8px));
  }

  :host([size='lg']),
  :host([size='3']) {
    --ui-alert-padding: 24px;
    --ui-alert-gap: 14px;
    --ui-alert-min-width: 420px;
    --ui-alert-max-width: min(92vw, 680px);
    --ui-alert-title-size: 16px;
    --ui-alert-title-line-height: 24px;
    --ui-alert-description-size: 14px;
    --ui-alert-description-line-height: 22px;
    --ui-alert-icon-size: 32px;
    --ui-alert-button-height: var(--base-button-height-lg, 44px);
  }

  :host([variant='outline']) {
    --ui-alert-bg: color-mix(in srgb, var(--ui-alert-bg-base) 86%, transparent);
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-alert-accent) 30%, var(--ui-alert-border-color));
    --ui-alert-shadow: none;
  }

  :host([variant='soft']) {
    --ui-alert-bg: color-mix(in srgb, var(--ui-alert-accent) 8%, var(--ui-alert-bg-base));
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-alert-accent) 16%, var(--ui-alert-border-color));
  }

  :host([variant='solid']) {
    --ui-alert-bg: var(--ui-alert-accent);
    --ui-alert-border: 1px solid color-mix(in srgb, #000000 16%, transparent);
    --ui-alert-text: #ffffff;
    --ui-alert-muted: color-mix(in srgb, #ffffff 78%, transparent);
    --ui-alert-btn-bg: color-mix(in srgb, #ffffff 16%, transparent);
    --ui-alert-btn-border: color-mix(in srgb, #ffffff 22%, transparent);
    --ui-alert-btn-hover: color-mix(in srgb, #ffffff 24%, transparent);
    --ui-alert-confirm-bg: color-mix(in srgb, #000000 22%, transparent);
    --ui-alert-confirm-color: #ffffff;
    --ui-alert-icon-bg: color-mix(in srgb, #ffffff 18%, transparent);
    --ui-alert-icon-color: #ffffff;
  }

  :host([elevation='none']) {
    --ui-alert-shadow: none;
  }

  :host([elevation='low']) {
    --ui-alert-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 10px 22px rgba(15, 23, 42, 0.09);
  }

  :host([elevation='high']) {
    --ui-alert-shadow: 0 2px 10px rgba(15, 23, 42, 0.08), 0 26px 54px rgba(15, 23, 42, 0.16);
  }

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--ui-alert-backdrop-z);
    display: grid;
    place-items: center;
    background: var(--ui-alert-backdrop);
    backdrop-filter: saturate(1.04) blur(3px);
    opacity: 0;
    transition: opacity var(--ui-alert-duration) var(--ui-alert-easing);
  }

  .dialog {
    position: relative;
    z-index: var(--ui-alert-z);
    min-width: var(--ui-alert-min-width);
    max-width: var(--ui-alert-max-width);
    box-sizing: border-box;
    border-radius: var(--ui-alert-radius);
    border: 1px solid var(--ui-alert-border);
    background: var(--ui-alert-bg);
    color: var(--ui-alert-text);
    box-shadow: var(--ui-alert-shadow);
    padding: var(--ui-alert-padding);
    outline: none;
    overflow: clip;
    opacity: 0;
    transform: translateY(12px) scale(0.985);
    transition:
      border-color var(--ui-alert-duration) var(--ui-alert-easing),
      box-shadow var(--ui-alert-duration) var(--ui-alert-easing),
      transform var(--ui-alert-duration) var(--ui-alert-easing),
      opacity var(--ui-alert-duration) var(--ui-alert-easing);
  }

  .dialog::before {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: 3px;
    background: linear-gradient(
      180deg,
      var(--ui-alert-accent) 0%,
      color-mix(in srgb, var(--ui-alert-accent) 74%, #0f172a) 100%
    );
    pointer-events: none;
  }

  :host([indicator='none']) .dialog::before {
    display: none;
  }

  .backdrop[data-open='true'] {
    opacity: 1;
  }

  .backdrop[data-open='true'] .dialog {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .dialog:focus-visible {
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--ui-alert-focus) 22%, transparent),
      var(--ui-alert-shadow);
    border-color: color-mix(in srgb, var(--ui-alert-focus) 45%, var(--ui-alert-border));
  }

  .header {
    display: grid;
    gap: var(--base-alert-dialog-header-gap, 10px);
    padding-inline-end: 40px;
    margin-bottom: 14px;
  }

  .header-main {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
    gap: 10px;
  }

  .icon-wrap {
    width: var(--ui-alert-icon-size);
    min-width: var(--ui-alert-icon-size);
    height: var(--ui-alert-icon-size);
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--ui-alert-icon-bg);
    color: var(--ui-alert-icon-color);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-alert-accent) 28%, transparent);
  }

  .icon {
    width: 16px;
    min-width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .heading {
    min-width: 0;
    display: grid;
    gap: 6px;
  }

  .title {
    margin: 0;
    font-size: var(--ui-alert-title-size);
    line-height: var(--ui-alert-title-line-height);
    font-weight: var(--ui-alert-title-weight);
    letter-spacing: var(--ui-default-letter-spacing, 0em);
  }

  .description {
    margin: 0;
    font-size: var(--ui-alert-description-size);
    line-height: var(--ui-alert-description-line-height);
    color: var(--ui-alert-muted);
  }

  .close {
    position: absolute;
    top: 10px;
    inset-inline-end: 10px;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: color-mix(in srgb, var(--ui-alert-text) 12%, transparent);
    color: inherit;
    display: inline-grid;
    place-items: center;
    transition:
      background var(--ui-alert-duration) var(--ui-alert-easing),
      transform 120ms ease;
    line-height: 1;
  }

  .close:hover {
    background: color-mix(in srgb, var(--ui-alert-text) 20%, transparent);
  }

  .close:active {
    transform: translateY(1px);
  }

  .close:focus-visible,
  .btn:focus-visible,
  .input:focus-visible {
    outline: 2px solid var(--ui-alert-focus);
    outline-offset: 1px;
  }

  .content {
    display: grid;
    gap: max(12px, var(--ui-alert-gap));
  }

  .input-wrap,
  .checkbox {
    display: grid;
    gap: 6px;
  }

  .label {
    font-size: 12px;
    font-weight: 600;
    color: color-mix(in srgb, var(--ui-alert-text) 82%, transparent);
  }

  .input {
    width: 100%;
    border-radius: var(--ui-radius, 4px);
    border: var(--base-input-border, 1px solid color-mix(in srgb, var(--ui-alert-border-color) 88%, transparent));
    background: var(--base-input-bg, color-mix(in srgb, var(--ui-alert-bg-base) 94%, #ffffff 6%));
    color: inherit;
    box-sizing: border-box;
    min-height: var(--base-input-height-md, 36px);
    padding: 9px 12px;
    font: inherit;
    line-height: 1.35;
  }

  .checkbox-line {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: color-mix(in srgb, var(--ui-alert-text) 84%, transparent);
  }

  .error {
    min-height: 18px;
    font-size: 12px;
    line-height: 1.35;
    color: var(--ui-alert-danger);
  }

  .error[data-empty='true'] {
    visibility: hidden;
  }

  .footer {
    margin-top: 18px;
    padding-top: 12px;
    border-top: 1px solid color-mix(in srgb, var(--ui-alert-border) 84%, transparent);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--base-alert-dialog-footer-gap, 10px);
  }

  .btn {
    border: 1px solid var(--ui-alert-btn-border);
    background: var(--ui-alert-btn-bg);
    color: inherit;
    border-radius: var(--ui-alert-button-radius);
    min-height: var(--ui-alert-button-height);
    padding: 0 15px;
    font-size: var(--ui-default-font-size, 14px);
    line-height: var(--ui-default-line-height, 20px);
    font-weight: 500;
    cursor: pointer;
    transition:
      background 120ms ease,
      border-color 120ms ease,
      color 120ms ease,
      transform 120ms ease;
  }

  .btn:hover {
    background: var(--ui-alert-btn-hover);
  }

  .btn:active {
    transform: translateY(1px);
  }

  .btn-confirm {
    border-color: color-mix(in srgb, var(--ui-alert-confirm-bg) 64%, var(--ui-alert-btn-border));
    background: var(--ui-alert-confirm-bg);
    color: var(--ui-alert-confirm-color);
  }

  .btn-confirm:hover {
    background: color-mix(in srgb, var(--ui-alert-confirm-bg) 88%, #000000 12%);
  }

  :host([state='loading']) .btn,
  :host([state='loading']) .input,
  :host([state='loading']) .close {
    opacity: 0.72;
  }

  .loading {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: color-mix(in srgb, var(--ui-alert-text) 75%, transparent);
    margin-inline-end: auto;
  }

  .spinner {
    width: 13px;
    height: 13px;
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, var(--ui-alert-text) 30%, transparent);
    border-top-color: color-mix(in srgb, var(--ui-alert-text) 80%, transparent);
    animation: ui-alert-spin 720ms linear infinite;
  }

  :host([headless]) .backdrop {
    position: static;
    inset: auto;
    z-index: auto;
    display: block;
    background: transparent;
    backdrop-filter: none;
    opacity: 1;
    transition: none;
  }

  :host([headless]) .dialog {
    position: relative;
    z-index: auto;
    min-width: 0;
    max-width: 100%;
    margin: 0;
    opacity: 1;
    transform: none;
    transition: none;
  }

  @media (max-width: 720px) {
    :host {
      --ui-alert-min-width: 0;
      --ui-alert-max-width: calc(100vw - 16px);
      --ui-alert-padding: 16px;
    }

    .header {
      margin-bottom: 12px;
    }
  }

  @keyframes ui-alert-spin {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .backdrop,
    .dialog,
    .btn,
    .spinner {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .dialog {
      border-width: 2px;
      box-shadow: none;
    }

    .btn,
    .input {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-alert-bg: Canvas;
      --ui-alert-text: CanvasText;
      --ui-alert-muted: CanvasText;
      --ui-alert-border: CanvasText;
      --ui-alert-shadow: none;
      --ui-alert-backdrop: rgba(0, 0, 0, 0.72);
      --ui-alert-focus: Highlight;
      --ui-alert-btn-bg: ButtonFace;
      --ui-alert-btn-border: ButtonText;
      --ui-alert-btn-hover: ButtonFace;
      --ui-alert-confirm-bg: Highlight;
      --ui-alert-confirm-color: HighlightText;
      --ui-alert-danger: Mark;
    }

    .dialog,
    .btn,
    .icon-wrap,
    .close,
    .input {
      forced-color-adjust: none;
      box-shadow: none;
    }

    .icon-wrap {
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
    }
  }
`;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type UIAlertDialogRole = 'alertdialog' | 'dialog';
type UIAlertDialogSize = 'sm' | 'md' | 'lg' | '1' | '2' | '3';
type UIAlertDialogState = 'idle' | 'loading' | 'error';
type UIAlertDialogTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type UIAlertDialogVariant = 'surface' | 'soft' | 'outline' | 'solid';
type UIAlertDialogElevation = 'none' | 'low' | 'high';
type UIAlertDialogIndicator = 'line' | 'none';
type UIAlertDialogAction = 'confirm' | 'cancel' | 'dismiss';
type UIAlertDialogDismissSource = 'esc' | 'backdrop' | 'close-icon' | 'abort' | 'unmount' | 'replace' | 'programmatic';

export interface UIAlertDialogTemplateOptions {
  id?: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  errorMessage?: string;
  input?: {
    enabled?: boolean;
    label?: string;
    placeholder?: string;
    value?: string;
    required?: boolean;
  };
  checkbox?: {
    enabled?: boolean;
    label?: string;
    checked?: boolean;
  };
  initialFocus?: string;
  dismissible?: boolean;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  lockWhileLoading?: boolean;
  role?: UIAlertDialogRole;
  tone?: UIAlertDialogTone;
  size?: UIAlertDialogSize;
  variant?: UIAlertDialogVariant;
  elevation?: UIAlertDialogElevation;
  indicator?: UIAlertDialogIndicator;
  radius?: string | number;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  headless?: boolean;
  showCancel?: boolean;
  showClose?: boolean;
}

export type UIAlertDialogOpenDetail = { id: string };
export type UIAlertDialogConfirmDetail = { id: string; inputValue?: string; checked?: boolean };
export type UIAlertDialogCancelDetail = { id: string };
export type UIAlertDialogDismissDetail = {
  id: string;
  source: UIAlertDialogDismissSource;
  reason?: string;
};
export type UIAlertDialogCloseDetail = {
  id: string;
  action: UIAlertDialogAction;
  source?: UIAlertDialogDismissSource;
  reason?: string;
};

function toBool(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = raw.trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeTone(raw: string | null): UIAlertDialogTone {
  if (raw === 'info' || raw === 'success' || raw === 'warning' || raw === 'danger') return raw;
  return 'neutral';
}

function normalizeSize(raw: string | null): UIAlertDialogSize {
  if (raw === 'sm' || raw === '1') return 'sm';
  if (raw === 'lg' || raw === '3') return 'lg';
  return 'md';
}

function normalizeVariant(raw: string | null): UIAlertDialogVariant {
  if (raw === 'soft' || raw === 'outline' || raw === 'solid') return raw;
  return 'surface';
}

function normalizeElevation(raw: string | null): UIAlertDialogElevation {
  if (raw === 'none' || raw === 'high') return raw;
  return 'low';
}

function normalizeIndicator(raw: string | null): UIAlertDialogIndicator {
  return raw === 'none' ? 'none' : 'line';
}

function normalizeRadius(value: string | null, fallback = 'var(--base-alert-dialog-radius, var(--ui-radius, 4px))'): string {
  if (value == null) return fallback;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return fallback;
  if (normalized === 'full' || normalized === 'pill') return '999px';
  if (/^-?\d+(\.\d+)?$/.test(normalized)) return `${normalized}px`;
  return value;
}

const STYLE_ONLY_ATTRIBUTES = new Set(['tone', 'size', 'variant', 'elevation', 'indicator', 'radius']);

function toneIconSvg(tone: UIAlertDialogTone): string {
  if (tone === 'success') {
    return '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10.2 8.3 13.4 15 6.8"></path></svg>';
  }
  if (tone === 'warning') {
    return '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.6 17 16.4H3L10 3.6Z"></path><path d="M10 8v3.4"></path><circle cx="10" cy="14.1" r="0.9" fill="currentColor" stroke="none"></circle></svg>';
  }
  if (tone === 'danger') {
    return '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.1"></circle><path d="m7.5 7.5 5 5M12.5 7.5l-5 5"></path></svg>';
  }
  if (tone === 'info') {
    return '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.1"></circle><path d="M10 13v-3.8"></path><circle cx="10" cy="6.5" r="0.9" fill="currentColor" stroke="none"></circle></svg>';
  }
  return '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10h8"></path><circle cx="10" cy="10" r="7.1"></circle></svg>';
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getDocumentActiveElement(): HTMLElement | null {
  if (!isBrowser()) return null;
  const active = document.activeElement;
  return active instanceof HTMLElement ? active : null;
}

export class UIAlertDialog extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'headless',
      'dismissible',
      'close-on-esc',
      'close-on-backdrop',
      'lock-while-loading',
      'role',
      'tone',
      'size',
      'variant',
      'elevation',
      'indicator',
      'radius',
      'state',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
      'initial-focus',
      'title',
      'description',
      'confirm-text',
      'cancel-text',
      'loading-text',
      'error-message'
    ];
  }

  private static _openStack: UIAlertDialog[] = [];

  private _lastActive: HTMLElement | null = null;
  private _active = false;
  private _terminalEmitted = false;
  private _closeMeta: { action: UIAlertDialogAction; source?: UIAlertDialogDismissSource; reason?: string } | null = null;
  private _uid = Math.random().toString(36).slice(2, 10);
  private _dialogId = '';

  private _config: UIAlertDialogTemplateOptions = {};
  private _inputValue = '';
  private _checked = false;
  private _runtimeError = '';
  private _activeHeadless = false;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onInput = this._onInput.bind(this);
    this._dialogId = this._uid;
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('input', this._onInput as EventListener);
    this._syncFromAttributes();
    this._syncVisualTokens();
    this._syncOpenState();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('input', this._onInput as EventListener);
    if (this._active && !this._terminalEmitted) {
      this.close('dismiss', 'unmount');
    }
    this._deactivate();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (STYLE_ONLY_ATTRIBUTES.has(name)) {
      this._syncVisualTokens();
      return;
    }
    if (name === 'headless') {
      this._syncActiveEnvironment();
      this.requestRender();
      return;
    }
    if (name === 'open') {
      this._syncOpenState();
      return;
    }
    if (name === 'state' && newValue !== 'error') {
      this._runtimeError = '';
    }
    this._syncFromAttributes();
    if (this.isConnected) this.requestRender();
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    if (value) this.setAttribute('open', '');
    else this.close('dismiss', 'programmatic');
  }

  get headless() {
    return this.hasAttribute('headless');
  }

  set headless(value: boolean) {
    if (value) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  get dismissible() {
    return toBool(this.getAttribute('dismissible'), true);
  }

  set dismissible(value: boolean) {
    this.setAttribute('dismissible', String(value));
  }

  get closeOnEsc() {
    return toBool(this.getAttribute('close-on-esc'), this.dismissible);
  }

  set closeOnEsc(value: boolean) {
    this.setAttribute('close-on-esc', String(value));
  }

  get closeOnBackdrop() {
    return toBool(this.getAttribute('close-on-backdrop'), this.dismissible);
  }

  set closeOnBackdrop(value: boolean) {
    this.setAttribute('close-on-backdrop', String(value));
  }

  get lockWhileLoading() {
    return toBool(this.getAttribute('lock-while-loading'), true);
  }

  set lockWhileLoading(value: boolean) {
    this.setAttribute('lock-while-loading', String(value));
  }

  get roleType(): UIAlertDialogRole {
    const raw = this.getAttribute('role');
    return raw === 'dialog' ? 'dialog' : 'alertdialog';
  }

  set roleType(value: UIAlertDialogRole) {
    this.setAttribute('role', value);
  }

  get tone(): UIAlertDialogTone {
    return normalizeTone(this.getAttribute('tone'));
  }

  set tone(value: UIAlertDialogTone) {
    if (value === 'neutral') {
      this.removeAttribute('tone');
      return;
    }
    this.setAttribute('tone', value);
  }

  get size(): UIAlertDialogSize {
    return normalizeSize(this.getAttribute('size'));
  }

  set size(value: UIAlertDialogSize) {
    if (value === 'md') {
      this.removeAttribute('size');
      return;
    }
    this.setAttribute('size', value);
  }

  get variant(): UIAlertDialogVariant {
    return normalizeVariant(this.getAttribute('variant'));
  }

  set variant(value: UIAlertDialogVariant) {
    if (value === 'surface') {
      this.removeAttribute('variant');
      return;
    }
    this.setAttribute('variant', value);
  }

  get elevation(): UIAlertDialogElevation {
    return normalizeElevation(this.getAttribute('elevation'));
  }

  set elevation(value: UIAlertDialogElevation) {
    if (value === 'low') {
      this.removeAttribute('elevation');
      return;
    }
    this.setAttribute('elevation', value);
  }

  get indicator(): UIAlertDialogIndicator {
    return normalizeIndicator(this.getAttribute('indicator'));
  }

  set indicator(value: UIAlertDialogIndicator) {
    if (value === 'line') {
      this.removeAttribute('indicator');
      return;
    }
    this.setAttribute('indicator', value);
  }

  get radius() {
    return this.getAttribute('radius') || '';
  }

  set radius(value: string) {
    if (!value) {
      this.removeAttribute('radius');
      return;
    }
    this.setAttribute('radius', value);
  }

  get state(): UIAlertDialogState {
    const raw = this.getAttribute('state');
    if (raw === 'loading' || raw === 'error') return raw;
    return 'idle';
  }

  set state(value: UIAlertDialogState) {
    if (value === 'idle') {
      this.removeAttribute('state');
      return;
    }
    this.setAttribute('state', value);
  }

  get initialFocus() {
    return this.getAttribute('initial-focus') || this._config.initialFocus || '';
  }

  set initialFocus(value: string) {
    if (!value) {
      this.removeAttribute('initial-focus');
      return;
    }
    this.setAttribute('initial-focus', value);
  }

  get dialogId() {
    return this._dialogId;
  }

  set dialogId(value: string) {
    this._dialogId = value || this._uid;
    this.requestRender();
  }

  get config(): UIAlertDialogTemplateOptions {
    return this._config;
  }

  set config(value: UIAlertDialogTemplateOptions) {
    this._config = value || {};
    if (this._config.id) this._dialogId = this._config.id;
    if (this._config.dismissible != null) this.dismissible = Boolean(this._config.dismissible);
    if (this._config.closeOnEsc != null) this.closeOnEsc = Boolean(this._config.closeOnEsc);
    if (this._config.closeOnBackdrop != null) this.closeOnBackdrop = Boolean(this._config.closeOnBackdrop);
    if (this._config.lockWhileLoading != null) this.lockWhileLoading = Boolean(this._config.lockWhileLoading);
    if (this._config.role) this.roleType = this._config.role;
    if (this._config.tone) this.tone = this._config.tone;
    if (this._config.size) this.size = this._config.size;
    if (this._config.variant) this.variant = this._config.variant;
    if (this._config.elevation) this.elevation = this._config.elevation;
    if (this._config.indicator) this.indicator = this._config.indicator;
    if (this._config.radius != null) this.radius = String(this._config.radius);
    if (this._config.ariaLabel) this.setAttribute('aria-label', this._config.ariaLabel);
    if (this._config.ariaLabelledby) this.setAttribute('aria-labelledby', this._config.ariaLabelledby);
    if (this._config.ariaDescribedby) this.setAttribute('aria-describedby', this._config.ariaDescribedby);
    if (this._config.initialFocus) this.initialFocus = this._config.initialFocus;
    if (this._config.headless != null) this.headless = Boolean(this._config.headless);

    this._inputValue = this._config.input?.value ?? this._inputValue;
    this._checked = this._config.checkbox?.checked ?? this._checked;
    this._runtimeError = this._config.errorMessage || '';

    this._syncVisualTokens();
    this.requestRender();
  }

  getInputValue() {
    const input = this.root.querySelector<HTMLInputElement>('.input');
    return input?.value ?? this._inputValue;
  }

  setInputValue(value: string) {
    this._inputValue = value;
    const input = this.root.querySelector<HTMLInputElement>('.input');
    if (input) input.value = value;
  }

  getChecked() {
    const checkbox = this.root.querySelector<HTMLInputElement>('.checkbox-input');
    return checkbox?.checked ?? this._checked;
  }

  setChecked(checked: boolean) {
    this._checked = checked;
    const checkbox = this.root.querySelector<HTMLInputElement>('.checkbox-input');
    if (checkbox) checkbox.checked = checked;
  }

  setError(message: string) {
    this._runtimeError = message;
    this.state = message ? 'error' : 'idle';
    this.requestRender();
  }

  clearError() {
    this._runtimeError = '';
    if (this.state === 'error') this.state = 'idle';
    this.requestRender();
  }

  close(
    action: UIAlertDialogAction = 'dismiss',
    source?: UIAlertDialogDismissSource,
    reason?: string
  ) {
    if (this._terminalEmitted) return;
    this._closeMeta = { action, source, reason };
    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
    }
    this._syncOpenState();
  }

  private _syncFromAttributes() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'alertdialog');
    }
  }

  private _syncVisualTokens() {
    this.style.setProperty('--ui-alert-radius', normalizeRadius(this.getAttribute('radius')));
  }

  private _syncOpenState() {
    const shouldBeOpen = this.hasAttribute('open');
    if (shouldBeOpen && !this._active) {
      this._activate();
      return;
    }
    if (!shouldBeOpen && this._active) {
      this._deactivate();
    }
  }

  private _activate() {
    this._active = true;
    this._activeHeadless = this.headless;
    this._terminalEmitted = false;
    this._closeMeta = null;

    if (!UIAlertDialog._openStack.includes(this)) {
      UIAlertDialog._openStack.push(this);
    }

    this._lastActive = this.headless ? null : getDocumentActiveElement();
    if (!this.headless) acquireBodyScrollLock();

    if (isBrowser() && !this.headless) {
      document.addEventListener('focusin', this._onFocusIn as EventListener, true);
    }

    const id = this.dialogId || this._uid;
    this._dispatchWithLegacy<UIAlertDialogOpenDetail>('ui-open', 'open', { id });

    if (!this.headless) {
      setTimeout(() => {
        this._focusInitial();
      }, 0);
    }

    this.requestRender();
  }

  private _deactivate() {
    if (!this._active) return;
    this._active = false;

    const index = UIAlertDialog._openStack.lastIndexOf(this);
    if (index >= 0) UIAlertDialog._openStack.splice(index, 1);

    if (isBrowser() && !this._activeHeadless) {
      document.removeEventListener('focusin', this._onFocusIn as EventListener, true);
    }

    if (!this._activeHeadless) releaseBodyScrollLock();

    if (!this._terminalEmitted) {
      const meta = this._closeMeta || { action: 'dismiss' as UIAlertDialogAction, source: 'abort' as UIAlertDialogDismissSource };
      const id = this.dialogId || this._uid;

      if (meta.action === 'cancel') {
        this._dispatchWithLegacy<UIAlertDialogCancelDetail>('ui-cancel', 'cancel', { id });
      } else if (meta.action === 'dismiss') {
        this._dispatchWithLegacy<UIAlertDialogDismissDetail>('ui-dismiss', 'dismiss', {
          id,
          source: meta.source || 'abort',
          reason: meta.reason
        });
      }

      this._dispatchWithLegacy<UIAlertDialogCloseDetail>('ui-close', 'close', {
        id,
        action: meta.action,
        source: meta.source,
        reason: meta.reason
      });

      this._terminalEmitted = true;
      this._closeMeta = null;
    }

    const returnFocus = this._lastActive;
    this._lastActive = null;
    if (returnFocus && !this._activeHeadless) {
      setTimeout(() => {
        try {
          returnFocus.focus();
        } catch {
          // noop
        }
      }, 0);
    }

    this._activeHeadless = false;
    this.requestRender();
  }

  private _syncActiveEnvironment() {
    if (!this._active) return;
    if (this.headless === this._activeHeadless) return;

    if (this.headless) {
      if (isBrowser()) {
        document.removeEventListener('focusin', this._onFocusIn as EventListener, true);
      }
      releaseBodyScrollLock();
      this._lastActive = null;
      this._activeHeadless = true;
      return;
    }

    this._lastActive = getDocumentActiveElement();
    acquireBodyScrollLock();
    if (isBrowser()) {
      document.addEventListener('focusin', this._onFocusIn as EventListener, true);
    }
    this._activeHeadless = false;
    setTimeout(() => {
      this._focusInitial();
    }, 0);
  }

  private _dispatchWithLegacy<T>(name: string, legacyName: string, detail: T, cancelable = false): CustomEvent<T> {
    const event = new CustomEvent<T>(name, {
      detail,
      bubbles: true,
      composed: true,
      cancelable
    });
    this.dispatchEvent(event);

    const legacy = new CustomEvent<T>(legacyName, {
      detail,
      bubbles: true,
      composed: true,
      cancelable
    });
    this.dispatchEvent(legacy);

    return event;
  }

  private _isTopMost() {
    if (!this._active) return false;
    const stack = UIAlertDialog._openStack;
    return stack.length > 0 && stack[stack.length - 1] === this;
  }

  private _queryPanel(): HTMLElement | null {
    return this.root.querySelector('.dialog') as HTMLElement | null;
  }

  private _collectFocusable(panel: HTMLElement): HTMLElement[] {
    return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((node) => {
      const disabled = (node as HTMLButtonElement).disabled;
      if (disabled) return false;
      if (node.getAttribute('aria-hidden') === 'true') return false;
      const style = isBrowser() ? window.getComputedStyle(node) : null;
      if (style && (style.display === 'none' || style.visibility === 'hidden')) return false;
      return true;
    });
  }

  private _focusInitial() {
    if (!this.open) return;
    const panel = this._queryPanel();
    if (!panel) return;

    const selector = this.initialFocus;
    if (selector) {
      const explicit = panel.querySelector<HTMLElement>(selector);
      if (explicit && typeof explicit.focus === 'function') {
        explicit.focus();
        return;
      }
    }

    const focusable = this._collectFocusable(panel);
    const auto = focusable.find((node) => node.hasAttribute('autofocus'));
    const target = auto || focusable[0] || panel;
    if (!target.hasAttribute('tabindex') && target === panel) {
      target.setAttribute('tabindex', '-1');
    }

    try {
      target.focus();
    } catch {
      // noop
    }
  }

  private _handleTab(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    const panel = this._queryPanel();
    if (!panel) return;

    const focusable = this._collectFocusable(panel);
    if (!focusable.length) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const active = (this.root.activeElement as HTMLElement | null) || (document.activeElement as HTMLElement | null);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (active === first || !active || !panel.contains(active)) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private _onFocusIn(event: FocusEvent) {
    if (!this.open || !this._isTopMost()) return;
    const panel = this._queryPanel();
    if (!panel) return;

    const target = event.target as Node | null;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    const insidePanel = path.includes(panel) || (target ? panel.contains(target) : false);
    if (insidePanel) return;

    this._focusInitial();
  }

  private _onInput(event: Event) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.classList.contains('input')) {
      this._inputValue = (target as HTMLInputElement).value;
    }

    if (target.classList.contains('checkbox-input')) {
      this._checked = (target as HTMLInputElement).checked;
    }

    this._dispatchWithLegacy('ui-change', 'change', {
      id: this.dialogId || this._uid,
      inputValue: this._inputValue,
      checked: this._checked
    });
  }

  private _isInteractionLocked() {
    return this.state === 'loading' && this.lockWhileLoading;
  }

  private _requestDismiss(source: UIAlertDialogDismissSource, reason?: string) {
    if (this._isInteractionLocked()) return;
    this.close('dismiss', source, reason);
  }

  private _handleConfirm() {
    const detail: UIAlertDialogConfirmDetail = {
      id: this.dialogId || this._uid,
      inputValue: this.getInputValue(),
      checked: this.getChecked()
    };

    const event = this._dispatchWithLegacy<UIAlertDialogConfirmDetail>('ui-confirm', 'confirm', detail, true);
    if (event.defaultPrevented) return;

    this.close('confirm');
  }

  private _handleCancel() {
    if (this._isInteractionLocked()) return;
    this.close('cancel');
  }

  private _onClick(event: Event) {
    if (!this.open || !this._isTopMost()) return;
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.classList.contains('backdrop') && this.closeOnBackdrop) {
      this._requestDismiss('backdrop');
      return;
    }

    if (target.closest('.close')) {
      this._requestDismiss('close-icon');
      return;
    }

    if (target.closest('.btn-confirm')) {
      this._handleConfirm();
      return;
    }

    if (target.closest('.btn-cancel')) {
      this._handleCancel();
    }
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (!this.open || !this._isTopMost()) return;

    if (event.key === 'Escape') {
      if (!this.closeOnEsc) return;
      event.preventDefault();
      event.stopPropagation();
      this._requestDismiss('esc');
      return;
    }

    this._handleTab(event);
  }

  protected render() {
    if (!this.open) {
      this.setContent('');
      return;
    }

    const titleFallback = this._config.title ?? this.getAttribute('title') ?? '';
    const descriptionFallback = this._config.description ?? this.getAttribute('description') ?? '';
    const confirmText = this._config.confirmText ?? this.getAttribute('confirm-text') ?? 'Confirm';
    const cancelText = this._config.cancelText ?? this.getAttribute('cancel-text') ?? 'Cancel';
    const loadingText = this._config.loadingText ?? this.getAttribute('loading-text') ?? 'Working...';

    const inputEnabled = Boolean(this._config.input?.enabled);
    const inputLabel = this._config.input?.label || 'Value';
    const inputPlaceholder = this._config.input?.placeholder || '';
    const inputRequired = Boolean(this._config.input?.required);

    const checkboxEnabled = Boolean(this._config.checkbox?.enabled);
    const checkboxLabel = this._config.checkbox?.label || 'Remember this choice';

    const state = this.state;
    const errorText = this._runtimeError || this._config.errorMessage || this.getAttribute('error-message') || '';

    const titleId = `ui-alert-title-${this._uid}`;
    const descId = `ui-alert-description-${this._uid}`;
    const errorId = `ui-alert-error-${this._uid}`;

    const hasTitleSlot = Boolean(this.querySelector('[slot="title"]'));
    const hasDescriptionSlot = Boolean(this.querySelector('[slot="description"]'));
    const hasIconSlot = Boolean(this.querySelector('[slot="icon"]'));
    const hasFooterSlot = Boolean(this.querySelector('[slot="footer"]'));
    const hasContentSlot = Boolean(this.querySelector('[slot="content"]'));

    const hasTitle = hasTitleSlot || Boolean(titleFallback);
    const hasDescription = hasDescriptionSlot || Boolean(descriptionFallback);
    const hasHeader = hasIconSlot || hasTitle || hasDescription;
    const showCancel = this._config.showCancel ?? this.dismissible;
    const showClose = this._config.showClose ?? this.dismissible;
    const tone = this.tone;

    const explicitAriaLabel = this.getAttribute('aria-label') || '';
    const explicitLabelledBy = this.getAttribute('aria-labelledby') || '';
    const explicitDescribedBy = this.getAttribute('aria-describedby') || '';

    const labelledBy = explicitLabelledBy || (hasTitle ? titleId : '');
    const ariaLabel = explicitAriaLabel || (!labelledBy ? titleFallback || descriptionFallback || 'Dialog' : '');

    const describedByIds: string[] = [];
    if (explicitDescribedBy) {
      describedByIds.push(explicitDescribedBy);
    } else {
      if (hasDescription) describedByIds.push(descId);
      if (errorText) describedByIds.push(errorId);
    }

    const isLoading = state === 'loading';

    this.setContent(`
      <style>${style}</style>
      <div class="backdrop" part="backdrop" role="presentation" data-open="${String(this.open)}">
        <section
          class="dialog"
          part="dialog"
          role="${escapeHtml(this.roleType)}"
          aria-modal="true"
          ${ariaLabel ? `aria-label="${escapeHtml(ariaLabel)}"` : ''}
          ${labelledBy ? `aria-labelledby="${escapeHtml(labelledBy)}"` : ''}
          ${describedByIds.length ? `aria-describedby="${escapeHtml(describedByIds.join(' '))}"` : ''}
          tabindex="-1"
        >
          ${showClose
            ? `<button class="close" part="close" aria-label="Close dialog">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <path d="m6 6 8 8M14 6l-8 8"></path>
                </svg>
              </button>`
            : ''}

          ${hasHeader
            ? `<header class="header">
                <div class="header-main">
                  <span class="icon-wrap" part="icon-wrap" aria-hidden="true">
                    <span class="icon" part="icon">
                      <slot name="icon">${toneIconSvg(tone)}</slot>
                    </span>
                  </span>
                  <div class="heading">
                    ${hasTitle ? `<h2 id="${titleId}" class="title" part="title"><slot name="title">${escapeHtml(titleFallback)}</slot></h2>` : ''}
                    ${hasDescription ? `<p id="${descId}" class="description" part="description"><slot name="description">${escapeHtml(descriptionFallback)}</slot></p>` : ''}
                  </div>
                </div>
              </header>`
            : ''}

          <div class="content" part="content">
            ${hasContentSlot ? '<slot name="content"></slot>' : '<slot></slot>'}

            ${inputEnabled
              ? `<label class="input-wrap">
                  <span class="label">${escapeHtml(inputLabel)}</span>
                  <input
                    class="input"
                    part="input"
                    type="text"
                    value="${escapeHtml(this.getInputValue())}"
                    placeholder="${escapeHtml(inputPlaceholder)}"
                    ${inputRequired ? 'required' : ''}
                    ${isLoading ? 'disabled' : ''}
                  />
                </label>`
              : ''}

            ${checkboxEnabled
              ? `<label class="checkbox" part="checkbox">
                  <span class="checkbox-line">
                    <input class="checkbox-input" type="checkbox" ${this.getChecked() ? 'checked' : ''} ${isLoading ? 'disabled' : ''} />
                    <span>${escapeHtml(checkboxLabel)}</span>
                  </span>
                </label>`
              : ''}
          </div>

          <div class="error" id="${errorId}" part="error" aria-live="polite" data-empty="${String(!errorText)}">${escapeHtml(errorText)}</div>

          <footer class="footer" part="footer">
            ${isLoading
              ? `<span class="loading"><span class="spinner" aria-hidden="true"></span><span>${escapeHtml(loadingText)}</span></span>`
              : '<span aria-hidden="true"></span>'}

            ${hasFooterSlot
              ? '<slot name="footer"></slot>'
              : `${showCancel
                  ? `<button class="btn btn-cancel" part="cancel" type="button" ${isLoading ? 'disabled' : ''}>${escapeHtml(cancelText)}</button>`
                  : ''}
                 <button class="btn btn-confirm" part="confirm" type="button" ${isLoading ? 'disabled' : ''}>${escapeHtml(confirmText)}</button>`}
          </footer>
        </section>
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-alert-dialog')) {
  customElements.define('ui-alert-dialog', UIAlertDialog);
}
