import { ElementBase } from '../ElementBase';

const style = `
  :host {
    position: fixed;
    inset: 0;
    display: block;
    z-index: var(--ui-dialog-backdrop-z);
    pointer-events: none;
    isolation: isolate;
    color-scheme: light dark;
    --ui-dialog-backdrop: rgba(2, 6, 23, 0.56);
    --ui-dialog-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-dialog-color: var(--ui-color-text, #0f172a);
    --ui-dialog-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 68%, transparent);
    --ui-dialog-shadow: 0 30px 80px rgba(2, 6, 23, 0.24);
    --ui-dialog-radius: 16px;
    --ui-dialog-padding: 18px;
    --ui-dialog-width: min(560px, calc(100vw - 24px));
    --ui-dialog-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-dialog-muted: var(--ui-color-muted, #64748b);
    --ui-dialog-danger: var(--ui-color-danger, #dc2626);
    --ui-dialog-z: 1201;
    --ui-dialog-backdrop-z: 1200;
    --ui-dialog-btn-bg: color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 88%, transparent);
    --ui-dialog-btn-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-dialog-btn-hover: color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 76%, var(--ui-color-border, #cbd5e1) 24%);
    --ui-dialog-submit-bg: var(--ui-color-primary, #2563eb);
    --ui-dialog-submit-color: var(--ui-color-primary-contrast, #ffffff);
  }

  :host([size='sm']),
  :host([size='1']) {
    --ui-dialog-width: min(420px, calc(100vw - 24px));
  }

  :host([size='lg']),
  :host([size='3']) {
    --ui-dialog-width: min(760px, calc(100vw - 24px));
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: var(--ui-dialog-backdrop-z);
    display: grid;
    place-items: center;
    pointer-events: auto;
    background: var(--ui-dialog-backdrop);
    backdrop-filter: saturate(1.06) blur(3px);
    opacity: 0;
    transition: opacity 170ms ease;
  }

  .overlay[data-open='true'] {
    opacity: 1;
  }

  .panel {
    position: relative;
    z-index: var(--ui-dialog-z);
    width: var(--ui-dialog-width);
    max-height: min(86vh, 760px);
    overflow: auto;
    box-sizing: border-box;
    border-radius: var(--ui-dialog-radius);
    border: var(--ui-dialog-border);
    background: var(--ui-dialog-bg);
    color: var(--ui-dialog-color);
    box-shadow: var(--ui-dialog-shadow);
    padding: var(--ui-dialog-padding);
    transform: translateY(10px) scale(0.985);
    opacity: 0;
    transition: transform 170ms ease, opacity 170ms ease;
  }

  .overlay[data-open='true'] .panel {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  .panel:focus-visible,
  .close:focus-visible,
  .btn:focus-visible {
    outline: 2px solid var(--ui-dialog-focus);
    outline-offset: 1px;
  }

  .header {
    display: grid;
    gap: 4px;
    margin-bottom: 10px;
    padding-inline-end: 34px;
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
    color: var(--ui-dialog-muted);
    font-size: 13px;
    line-height: 1.45;
  }

  .close {
    position: absolute;
    top: 10px;
    inset-inline-end: 10px;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 8px;
    background: color-mix(in srgb, var(--ui-dialog-color) 10%, transparent);
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 1;
  }

  .close:hover {
    background: color-mix(in srgb, var(--ui-dialog-color) 18%, transparent);
  }

  .body {
    display: grid;
    gap: 10px;
  }

  .footer {
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }

  .btn {
    border: 1px solid var(--ui-dialog-btn-border);
    background: var(--ui-dialog-btn-bg);
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
    background: var(--ui-dialog-btn-hover);
  }

  .btn:active {
    transform: translateY(1px);
  }

  .btn-submit {
    border-color: color-mix(in srgb, var(--ui-dialog-submit-bg) 64%, var(--ui-dialog-btn-border));
    background: var(--ui-dialog-submit-bg);
    color: var(--ui-dialog-submit-color);
  }

  .btn-submit:hover {
    background: color-mix(in srgb, var(--ui-dialog-submit-bg) 88%, #000000 12%);
  }

  .loading {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: color-mix(in srgb, var(--ui-dialog-color) 75%, transparent);
    margin-inline-end: auto;
  }

  .spinner {
    width: 13px;
    height: 13px;
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, var(--ui-dialog-color) 30%, transparent);
    border-top-color: color-mix(in srgb, var(--ui-dialog-color) 80%, transparent);
    animation: ui-dialog-spin 720ms linear infinite;
  }

  .error {
    min-height: 18px;
    margin-top: 10px;
    font-size: 12px;
    line-height: 1.35;
    color: var(--ui-dialog-danger);
  }

  .error[data-empty='true'] {
    visibility: hidden;
  }

  :host([state='loading']) .btn,
  :host([state='loading']) .close {
    opacity: 0.72;
  }

  :host([headless]) .overlay,
  :host([headless]) .panel {
    display: none !important;
  }

  @keyframes ui-dialog-spin {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .overlay,
    .panel,
    .btn,
    .spinner {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .panel {
      border-width: 2px;
      box-shadow: none;
    }

    .btn {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-dialog-backdrop: rgba(0, 0, 0, 0.72);
      --ui-dialog-bg: Canvas;
      --ui-dialog-color: CanvasText;
      --ui-dialog-border: 1px solid CanvasText;
      --ui-dialog-shadow: none;
      --ui-dialog-muted: CanvasText;
      --ui-dialog-focus: Highlight;
      --ui-dialog-btn-bg: ButtonFace;
      --ui-dialog-btn-border: ButtonText;
      --ui-dialog-btn-hover: ButtonFace;
      --ui-dialog-submit-bg: Highlight;
      --ui-dialog-submit-color: HighlightText;
      --ui-dialog-danger: Mark;
    }

    .panel,
    .close,
    .btn {
      forced-color-adjust: none;
      box-shadow: none;
    }
  }
`;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type UIDialogRole = 'dialog' | 'alertdialog';
type UIDialogState = 'idle' | 'loading' | 'error';
type UIDialogAction = 'submit' | 'cancel' | 'dismiss';
type UIDialogDismissSource = 'overlay' | 'esc' | 'close-icon' | 'abort' | 'unmount' | 'replace';

export type UIDialogRequestCloseReason =
  | 'button'
  | 'overlay'
  | 'escape'
  | 'programmatic'
  | 'cancel'
  | 'submit';

export interface UIDialogTemplateOptions {
  id?: string;
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  loadingText?: string;
  errorMessage?: string;
  dismissible?: boolean;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  lockWhileLoading?: boolean;
  role?: UIDialogRole;
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  initialFocus?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  headless?: boolean;
  showCancel?: boolean;
  showClose?: boolean;
}

export type UIDialogOpenDetail = { id: string };
export type UIDialogSubmitDetail = {
  id: string;
  formData?: Record<string, string | string[]>;
};
export type UIDialogCancelDetail = { id: string };
export type UIDialogDismissDetail = {
  id: string;
  source: UIDialogDismissSource;
  reason?: string;
};
export type UIDialogCloseDetail = {
  id: string;
  action: UIDialogAction;
  source?: UIDialogDismissSource;
  reason?: string;
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

export class UIDialog extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'headless',
      'title',
      'description',
      'closable',
      'dismissible',
      'close-on-overlay',
      'close-on-backdrop',
      'close-on-esc',
      'lock-while-loading',
      'size',
      'state',
      'role',
      'initial-focus',
      'submit-text',
      'cancel-text',
      'loading-text',
      'error-message',
      'aria-label',
      'aria-labelledby',
      'aria-describedby'
    ];
  }

  private static _openStack: UIDialog[] = [];

  private _isActive = false;
  private _uid = Math.random().toString(36).slice(2, 10);
  private _dialogId = this._uid;
  private _lastFocused: HTMLElement | null = null;
  private _terminalEmitted = false;
  private _closeMeta: { action: UIDialogAction; source?: UIDialogDismissSource; reason?: string } | null = null;
  private _runtimeError = '';
  private _config: UIDialogTemplateOptions = {};

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this._syncFromAttributes();
    this._syncOpenState();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    if (this._isActive && !this._terminalEmitted) {
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

  get dismissible() {
    return toBool(this.getAttribute('dismissible') ?? this.getAttribute('closable'), true);
  }

  set dismissible(value: boolean) {
    this.setAttribute('dismissible', String(value));
    this.setAttribute('closable', String(value));
  }

  get closeOnOverlay() {
    return toBool(this.getAttribute('close-on-overlay') ?? this.getAttribute('close-on-backdrop'), true);
  }

  set closeOnOverlay(value: boolean) {
    this.setAttribute('close-on-overlay', String(value));
    this.setAttribute('close-on-backdrop', String(value));
  }

  get closeOnEsc() {
    return toBool(this.getAttribute('close-on-esc'), true);
  }

  set closeOnEsc(value: boolean) {
    this.setAttribute('close-on-esc', String(value));
  }

  get lockWhileLoading() {
    return toBool(this.getAttribute('lock-while-loading'), true);
  }

  set lockWhileLoading(value: boolean) {
    this.setAttribute('lock-while-loading', String(value));
  }

  get state(): UIDialogState {
    const raw = this.getAttribute('state');
    if (raw === 'loading' || raw === 'error') return raw;
    return 'idle';
  }

  set state(value: UIDialogState) {
    if (value === 'idle') {
      this.removeAttribute('state');
      return;
    }
    this.setAttribute('state', value);
  }

  get dialogId() {
    return this._dialogId;
  }

  set dialogId(value: string) {
    this._dialogId = value || this._uid;
    this.requestRender();
  }

  get config(): UIDialogTemplateOptions {
    return this._config;
  }

  set config(value: UIDialogTemplateOptions) {
    this._config = value || {};
    if (this._config.id) this._dialogId = this._config.id;
    if (this._config.dismissible != null) this.dismissible = Boolean(this._config.dismissible);
    if (this._config.closeOnOverlay != null) this.closeOnOverlay = Boolean(this._config.closeOnOverlay);
    if (this._config.closeOnEsc != null) this.closeOnEsc = Boolean(this._config.closeOnEsc);
    if (this._config.lockWhileLoading != null) this.lockWhileLoading = Boolean(this._config.lockWhileLoading);
    if (this._config.size) this.setAttribute('size', this._config.size);
    if (this._config.role) this.setAttribute('role', this._config.role);
    if (this._config.initialFocus) this.setAttribute('initial-focus', this._config.initialFocus);
    if (this._config.ariaLabel) this.setAttribute('aria-label', this._config.ariaLabel);
    if (this._config.ariaLabelledby) this.setAttribute('aria-labelledby', this._config.ariaLabelledby);
    if (this._config.ariaDescribedby) this.setAttribute('aria-describedby', this._config.ariaDescribedby);
    if (this._config.errorMessage) this._runtimeError = this._config.errorMessage;
    this.requestRender();
  }

  openDialog() {
    this.setAttribute('open', '');
  }

  closeDialog(reason: UIDialogRequestCloseReason = 'programmatic') {
    if (!this.hasAttribute('open')) return;
    const closeEvent = new CustomEvent('request-close', {
      detail: { reason },
      bubbles: true,
      cancelable: true,
      composed: true
    });
    this.dispatchEvent(closeEvent);

    const uiRequestClose = new CustomEvent('ui-request-close', {
      detail: { id: this.dialogId || this._uid, reason },
      bubbles: true,
      cancelable: true,
      composed: true
    });
    this.dispatchEvent(uiRequestClose);

    if (closeEvent.defaultPrevented || uiRequestClose.defaultPrevented) return;

    if (reason === 'submit') {
      this.close('submit');
      return;
    }

    if (reason === 'cancel') {
      this.close('cancel');
      return;
    }

    if (reason === 'overlay') {
      this.close('dismiss', 'overlay');
      return;
    }

    if (reason === 'escape') {
      this.close('dismiss', 'esc');
      return;
    }

    if (reason === 'button') {
      this.close('dismiss', 'close-icon');
      return;
    }

    this.close('dismiss', 'abort');
  }

  close(action: UIDialogAction = 'dismiss', source?: UIDialogDismissSource, reason?: string) {
    if (this._terminalEmitted) return;
    this._closeMeta = { action, source, reason };
    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
    }
    this._syncOpenState();
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

  private _syncFromAttributes() {
    if (!this.hasAttribute('dismissible') && this.hasAttribute('closable')) {
      this.setAttribute('dismissible', this.getAttribute('closable') || 'true');
    }
    if (!this.hasAttribute('closable') && this.hasAttribute('dismissible')) {
      this.setAttribute('closable', this.getAttribute('dismissible') || 'true');
    }
    if (!this.hasAttribute('close-on-overlay') && this.hasAttribute('close-on-backdrop')) {
      this.setAttribute('close-on-overlay', this.getAttribute('close-on-backdrop') || 'true');
    }
    if (!this.hasAttribute('close-on-backdrop') && this.hasAttribute('close-on-overlay')) {
      this.setAttribute('close-on-backdrop', this.getAttribute('close-on-overlay') || 'true');
    }
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'dialog');
    }
  }

  private _syncOpenState() {
    const shouldBeOpen = this.hasAttribute('open');
    if (shouldBeOpen && !this._isActive) {
      this._activate();
      return;
    }
    if (!shouldBeOpen && this._isActive) {
      this._deactivate();
    }
  }

  private _activate() {
    this._isActive = true;
    this._terminalEmitted = false;
    this._closeMeta = null;

    if (!UIDialog._openStack.includes(this)) {
      UIDialog._openStack.push(this);
    }

    this._lastFocused = (document.activeElement as HTMLElement) || null;
    acquireScrollLock();

    if (isBrowser()) {
      document.addEventListener('focusin', this._onFocusIn as EventListener, true);
    }

    const id = this.dialogId || this._uid;
    this._dispatchWithLegacy<UIDialogOpenDetail>('ui-open', 'open', { id });
    this.dispatchEvent(new CustomEvent('show', { bubbles: true, composed: true }));

    setTimeout(() => this._focusInitial(), 0);
    this.requestRender();
  }

  private _deactivate() {
    if (!this._isActive) return;
    this._isActive = false;

    const index = UIDialog._openStack.lastIndexOf(this);
    if (index >= 0) UIDialog._openStack.splice(index, 1);

    if (isBrowser()) {
      document.removeEventListener('focusin', this._onFocusIn as EventListener, true);
    }

    releaseScrollLock();

    if (!this._terminalEmitted) {
      const meta = this._closeMeta || { action: 'dismiss' as UIDialogAction, source: 'abort' as UIDialogDismissSource };
      const id = this.dialogId || this._uid;

      if (meta.action === 'cancel') {
        this._dispatchWithLegacy<UIDialogCancelDetail>('ui-cancel', 'cancel', { id });
      } else {
        this._dispatchWithLegacy<UIDialogDismissDetail>('ui-dismiss', 'dismiss', {
          id,
          source: meta.source || 'abort',
          reason: meta.reason
        });
      }

      this._dispatchWithLegacy<UIDialogCloseDetail>('ui-close', 'close', {
        id,
        action: meta.action,
        source: meta.source,
        reason: meta.reason
      });

      this.dispatchEvent(new CustomEvent('hide', { bubbles: true, composed: true }));
      this._terminalEmitted = true;
      this._closeMeta = null;
    }

    const returnFocus = this._lastFocused;
    this._lastFocused = null;
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
    if (!this._isActive) return false;
    const stack = UIDialog._openStack;
    return stack.length > 0 && stack[stack.length - 1] === this;
  }

  private _queryPanel(): HTMLElement | null {
    return this.root.querySelector('.panel') as HTMLElement | null;
  }

  private _collectFocusable(panel: HTMLElement): HTMLElement[] {
    return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((node) => {
      const disabled = (node as HTMLButtonElement).disabled;
      if (disabled) return false;
      if (node.getAttribute('aria-hidden') === 'true') return false;
      const computed = isBrowser() ? window.getComputedStyle(node) : null;
      if (computed && (computed.display === 'none' || computed.visibility === 'hidden')) return false;
      return true;
    });
  }

  private _focusInitial() {
    if (!this.open) return;
    const panel = this._queryPanel();
    if (!panel) return;

    const selector = this.getAttribute('initial-focus') || this._config.initialFocus || '';
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
    if (!target.hasAttribute('tabindex') && target === panel) target.setAttribute('tabindex', '-1');

    try {
      target.focus();
    } catch {
      // noop
    }
  }

  private _onFocusIn(event: FocusEvent) {
    if (!this.open || !this._isTopMost()) return;
    const panel = this._queryPanel();
    if (!panel) return;

    const target = event.target as Node | null;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    const inside = path.includes(panel) || (target ? panel.contains(target) : false);
    if (inside) return;

    this._focusInitial();
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

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = (this.root.activeElement as HTMLElement | null) || (document.activeElement as HTMLElement | null);

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

  private _collectFormData(): Record<string, string | string[]> | undefined {
    const panel = this._queryPanel();
    if (!panel) return undefined;

    const form = panel.querySelector('form');
    if (!form || typeof FormData === 'undefined') return undefined;

    const entries = new FormData(form);
    const record: Record<string, string | string[]> = {};

    for (const [key, raw] of entries.entries()) {
      const value = String(raw);
      if (record[key] == null) {
        record[key] = value;
        continue;
      }

      const previous = record[key];
      if (Array.isArray(previous)) {
        previous.push(value);
      } else {
        record[key] = [previous, value];
      }
    }

    return Object.keys(record).length ? record : undefined;
  }

  private _isInteractionLocked() {
    return this.state === 'loading' && this.lockWhileLoading;
  }

  private _requestDismiss(source: UIDialogDismissSource, reason?: string) {
    if (this._isInteractionLocked()) return;
    if (source === 'overlay') {
      this.closeDialog('overlay');
      return;
    }
    if (source === 'esc') {
      this.closeDialog('escape');
      return;
    }
    if (source === 'close-icon') {
      this.closeDialog('button');
      return;
    }
    this.close('dismiss', source, reason);
  }

  private _handleSubmit() {
    if (this._isInteractionLocked()) return;

    const detail: UIDialogSubmitDetail = {
      id: this.dialogId || this._uid,
      formData: this._collectFormData()
    };
    const submitEvent = this._dispatchWithLegacy<UIDialogSubmitDetail>('ui-submit', 'submit', detail, true);
    if (submitEvent.defaultPrevented) return;

    this.closeDialog('submit');
  }

  private _handleCancel() {
    if (this._isInteractionLocked()) return;
    this.closeDialog('cancel');
  }

  private _onClick(event: Event) {
    if (!this.open || !this._isTopMost()) return;
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.classList.contains('overlay') && this.closeOnOverlay) {
      this._requestDismiss('overlay');
      return;
    }

    if (target.classList.contains('close')) {
      this._requestDismiss('close-icon');
      return;
    }

    if (target.classList.contains('btn-submit')) {
      this._handleSubmit();
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

    const title = this._config.title ?? this.getAttribute('title') ?? '';
    const description = this._config.description ?? this.getAttribute('description') ?? '';
    const submitText = this._config.submitText ?? this.getAttribute('submit-text') ?? 'Submit';
    const cancelText = this._config.cancelText ?? this.getAttribute('cancel-text') ?? 'Cancel';
    const loadingText = this._config.loadingText ?? this.getAttribute('loading-text') ?? 'Working...';

    const hasTitle = Boolean(title || this.querySelector('[slot="title"]'));
    const hasDescription = Boolean(description || this.querySelector('[slot="description"]'));
    const hasContentSlot = Boolean(this.querySelector('[slot="content"]'));
    const hasFooterSlot = Boolean(this.querySelector('[slot="footer"]'));

    const showCancel = this._config.showCancel ?? true;
    const showClose = this._config.showClose ?? this.dismissible;

    const error = this._runtimeError || this._config.errorMessage || this.getAttribute('error-message') || '';
    const isLoading = this.state === 'loading';

    const titleId = `ui-dialog-title-${this._uid}`;
    const descId = `ui-dialog-description-${this._uid}`;
    const errorId = `ui-dialog-error-${this._uid}`;

    const ariaLabel = this.getAttribute('aria-label') || '';
    const explicitLabelledBy = this.getAttribute('aria-labelledby') || '';
    const explicitDescribedBy = this.getAttribute('aria-describedby') || '';

    const labelledBy = explicitLabelledBy || (hasTitle ? titleId : '');

    const describedByIds: string[] = [];
    if (explicitDescribedBy) {
      describedByIds.push(explicitDescribedBy);
    } else {
      if (hasDescription) describedByIds.push(descId);
      if (error) describedByIds.push(errorId);
    }

    this.setContent(`
      ${this.hasAttribute('headless') ? '' : `<style>${style}</style>`}
      <div class="overlay" part="overlay" aria-hidden="true" data-open="${String(this.open)}">
        <section
          class="panel"
          part="panel"
          role="${escapeHtml(this.getAttribute('role') || 'dialog')}"
          aria-modal="true"
          ${ariaLabel ? `aria-label="${escapeHtml(ariaLabel)}"` : ''}
          ${labelledBy ? `aria-labelledby="${escapeHtml(labelledBy)}"` : ''}
          ${describedByIds.length ? `aria-describedby="${escapeHtml(describedByIds.join(' '))}"` : ''}
          tabindex="-1"
        >
          ${showClose ? '<button class="close" part="close" aria-label="Close dialog">✕</button>' : ''}
          ${hasTitle || hasDescription ? `
            <header class="header" part="header">
              <h2 id="${titleId}" class="title" part="title"><slot name="title">${escapeHtml(title)}</slot></h2>
              <p id="${descId}" class="description" part="description"><slot name="description">${escapeHtml(description)}</slot></p>
            </header>
          ` : ''}
          <div class="body" part="body">
            ${hasContentSlot ? '<slot name="content"></slot>' : '<slot></slot>'}
          </div>

          <div class="error" id="${errorId}" part="error" aria-live="polite" data-empty="${String(!error)}">${escapeHtml(error)}</div>

          <footer class="footer" part="footer">
            ${isLoading
              ? `<span class="loading" part="loading"><span class="spinner" aria-hidden="true"></span><span>${escapeHtml(loadingText)}</span></span>`
              : '<span aria-hidden="true"></span>'}

            ${hasFooterSlot
              ? '<slot name="footer"></slot>'
              : `${showCancel ? `<button class="btn btn-cancel" part="cancel" type="button" ${isLoading ? 'disabled' : ''}>${escapeHtml(cancelText)}</button>` : ''}
                 <button class="btn btn-submit" part="submit" type="button" ${isLoading ? 'disabled' : ''}>${escapeHtml(submitText)}</button>`}
          </footer>
        </section>
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-dialog')) {
  customElements.define('ui-dialog', UIDialog);
}
