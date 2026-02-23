import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    color-scheme: light dark;
    --ui-alert-radius: 14px;
    --ui-alert-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-alert-text: var(--ui-color-text, #0f172a);
    --ui-alert-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-alert-shadow: 0 26px 72px rgba(2, 6, 23, 0.24);
    --ui-alert-padding: 22px;
    --ui-alert-min-width: 360px;
    --ui-alert-max-width: min(90vw, 560px);
    --ui-alert-z: 1001;
    --ui-alert-backdrop-z: 1000;
    --ui-alert-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-alert-muted: var(--ui-color-muted, #64748b);
    --ui-alert-danger: var(--ui-color-danger, #dc2626);
    --ui-alert-backdrop: rgba(2, 6, 23, 0.56);
    --ui-alert-btn-bg: color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 86%, transparent);
    --ui-alert-btn-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-alert-btn-hover: color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 74%, var(--ui-color-border, #cbd5e1) 26%);
    --ui-alert-confirm-bg: var(--ui-color-primary, #2563eb);
    --ui-alert-confirm-color: var(--ui-color-primary-contrast, #ffffff);
  }

  :host([size='sm']) {
    --ui-alert-padding: 18px;
    --ui-alert-min-width: 300px;
    --ui-alert-max-width: min(88vw, 440px);
  }

  :host([size='lg']) {
    --ui-alert-padding: 26px;
    --ui-alert-min-width: 420px;
    --ui-alert-max-width: min(92vw, 680px);
  }

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--ui-alert-backdrop-z);
    display: grid;
    place-items: center;
    background: var(--ui-alert-backdrop);
    backdrop-filter: saturate(1.06) blur(2px);
    opacity: 0;
    transition: opacity 170ms ease;
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
    opacity: 0;
    transform: translateY(10px) scale(0.985);
    transition: border-color 140ms ease, box-shadow 140ms ease, transform 170ms ease, opacity 170ms ease;
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
    gap: 8px;
    padding-inline-end: 40px;
    margin-bottom: 12px;
  }

  .title {
    margin: 0;
    font-size: 18px;
    line-height: 1.3;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .description {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--ui-alert-muted);
  }

  .close {
    position: absolute;
    top: 10px;
    inset-inline-end: 10px;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: color-mix(in srgb, var(--ui-alert-text) 12%, transparent);
    color: inherit;
    display: inline-grid;
    place-items: center;
    font-size: 14px;
    line-height: 1;
  }

  .close:hover {
    background: color-mix(in srgb, var(--ui-alert-text) 20%, transparent);
  }

  .close:focus-visible,
  .btn:focus-visible,
  .input:focus-visible {
    outline: 2px solid var(--ui-alert-focus);
    outline-offset: 1px;
  }

  .content {
    display: grid;
    gap: 12px;
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
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--ui-alert-border) 88%, transparent);
    background: color-mix(in srgb, var(--ui-alert-bg) 96%, #ffffff 4%);
    color: inherit;
    box-sizing: border-box;
    min-height: 38px;
    padding: 8px 11px;
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
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }

  .btn {
    border: 1px solid var(--ui-alert-btn-border);
    background: var(--ui-alert-btn-bg);
    color: inherit;
    border-radius: 10px;
    min-height: 36px;
    padding: 0 14px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 120ms ease, border-color 120ms ease, transform 120ms ease;
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

  :host([headless]) .backdrop,
  :host([headless]) .dialog {
    display: none;
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
    .close,
    .input {
      forced-color-adjust: none;
      box-shadow: none;
    }
  }
`;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type UIAlertDialogRole = 'alertdialog' | 'dialog';
type UIAlertDialogSize = 'sm' | 'md' | 'lg';
type UIAlertDialogState = 'idle' | 'loading' | 'error';
type UIAlertDialogAction = 'confirm' | 'cancel' | 'dismiss';
type UIAlertDialogDismissSource = 'esc' | 'backdrop' | 'close-icon' | 'abort' | 'unmount';

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
  size?: UIAlertDialogSize;
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

type ScrollLockState = {
  count: number;
  bodyOverflow: string;
  htmlOverflow: string;
  bodyPaddingRight: string;
};

const scrollLock: ScrollLockState = {
  count: 0,
  bodyOverflow: '',
  htmlOverflow: '',
  bodyPaddingRight: ''
};

function toBool(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = raw.trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getDocumentActiveElement(): HTMLElement | null {
  if (!isBrowser()) return null;
  const active = document.activeElement;
  return active instanceof HTMLElement ? active : null;
}

function acquireScrollLock() {
  if (!isBrowser()) return;
  scrollLock.count += 1;
  if (scrollLock.count > 1) return;

  const body = document.body;
  const html = document.documentElement;
  scrollLock.bodyOverflow = body.style.overflow;
  scrollLock.htmlOverflow = html.style.overflow;
  scrollLock.bodyPaddingRight = body.style.paddingRight;

  const scrollBarWidth = Math.max(0, window.innerWidth - html.clientWidth);
  if (scrollBarWidth > 0) {
    const currentPadding = parseFloat(window.getComputedStyle(body).paddingRight || '0') || 0;
    body.style.paddingRight = `${currentPadding + scrollBarWidth}px`;
  }

  body.style.overflow = 'hidden';
  html.style.overflow = 'hidden';
}

function releaseScrollLock() {
  if (!isBrowser()) return;
  if (scrollLock.count <= 0) return;
  scrollLock.count -= 1;
  if (scrollLock.count > 0) return;

  const body = document.body;
  const html = document.documentElement;
  body.style.overflow = scrollLock.bodyOverflow;
  html.style.overflow = scrollLock.htmlOverflow;
  body.style.paddingRight = scrollLock.bodyPaddingRight;
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
      'size',
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
    else this.close('dismiss', 'abort');
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

  get size(): UIAlertDialogSize {
    const raw = this.getAttribute('size');
    if (raw === 'sm' || raw === 'lg') return raw;
    return 'md';
  }

  set size(value: UIAlertDialogSize) {
    if (value === 'md') {
      this.removeAttribute('size');
      return;
    }
    this.setAttribute('size', value);
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
    if (this._config.size) this.size = this._config.size;
    if (this._config.ariaLabel) this.setAttribute('aria-label', this._config.ariaLabel);
    if (this._config.ariaLabelledby) this.setAttribute('aria-labelledby', this._config.ariaLabelledby);
    if (this._config.ariaDescribedby) this.setAttribute('aria-describedby', this._config.ariaDescribedby);
    if (this._config.initialFocus) this.initialFocus = this._config.initialFocus;
    if (this._config.headless != null) this.headless = Boolean(this._config.headless);

    this._inputValue = this._config.input?.value ?? this._inputValue;
    this._checked = this._config.checkbox?.checked ?? this._checked;
    this._runtimeError = this._config.errorMessage || '';

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
    this._terminalEmitted = false;
    this._closeMeta = null;

    if (!UIAlertDialog._openStack.includes(this)) {
      UIAlertDialog._openStack.push(this);
    }

    this._lastActive = getDocumentActiveElement();
    acquireScrollLock();

    if (isBrowser()) {
      document.addEventListener('focusin', this._onFocusIn as EventListener, true);
    }

    const id = this.dialogId || this._uid;
    this._dispatchWithLegacy<UIAlertDialogOpenDetail>('ui-open', 'open', { id });

    setTimeout(() => {
      this._focusInitial();
    }, 0);

    this.requestRender();
  }

  private _deactivate() {
    if (!this._active) return;
    this._active = false;

    const index = UIAlertDialog._openStack.lastIndexOf(this);
    if (index >= 0) UIAlertDialog._openStack.splice(index, 1);

    if (isBrowser()) {
      document.removeEventListener('focusin', this._onFocusIn as EventListener, true);
    }

    releaseScrollLock();

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
    if (returnFocus) {
      setTimeout(() => {
        try {
          returnFocus.focus();
        } catch {
          // noop
        }
      }, 0);
    }

    this.requestRender();
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

    if (target.classList.contains('close')) {
      this._requestDismiss('close-icon');
      return;
    }

    if (target.classList.contains('btn-confirm')) {
      this._handleConfirm();
      return;
    }

    if (target.classList.contains('btn-cancel')) {
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
    const hasFooterSlot = Boolean(this.querySelector('[slot="footer"]'));
    const hasContentSlot = Boolean(this.querySelector('[slot="content"]'));

    const hasTitle = hasTitleSlot || Boolean(titleFallback);
    const hasDescription = hasDescriptionSlot || Boolean(descriptionFallback);
    const showCancel = this._config.showCancel ?? this.dismissible;
    const showClose = this._config.showClose ?? this.dismissible;

    const ariaLabel = this.getAttribute('aria-label') || '';
    const explicitLabelledBy = this.getAttribute('aria-labelledby') || '';
    const explicitDescribedBy = this.getAttribute('aria-describedby') || '';

    const labelledBy = explicitLabelledBy || (hasTitle ? titleId : '');

    const describedByIds: string[] = [];
    if (explicitDescribedBy) {
      describedByIds.push(explicitDescribedBy);
    } else {
      if (hasDescription) describedByIds.push(descId);
      if (errorText) describedByIds.push(errorId);
    }

    const isLoading = state === 'loading';

    this.setContent(`
      ${this.headless ? '' : `<style>${style}</style>`}
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
          ${showClose ? '<button class="close" part="close" aria-label="Close dialog">✕</button>' : ''}

          ${(hasTitle || hasDescription)
            ? `<header class="header">
                <h2 id="${titleId}" class="title" part="title"><slot name="title">${escapeHtml(titleFallback)}</slot></h2>
                <p id="${descId}" class="description" part="description"><slot name="description">${escapeHtml(descriptionFallback)}</slot></p>
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
