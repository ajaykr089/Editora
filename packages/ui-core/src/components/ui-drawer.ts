import { ElementBase } from '../ElementBase';
import OverlayManager from '../overlayManager';

type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
type LogicalDrawerSide = DrawerSide | 'start' | 'end';
type UIDrawerState = 'idle' | 'loading' | 'error' | 'success';

export type UIDrawerRequestCloseReason = 'overlay' | 'escape' | 'button' | 'programmatic';

export type UIDrawerChangeDetail = {
  open: boolean;
  reason: UIDrawerRequestCloseReason;
};

export type UIDrawerRequestCloseDetail = {
  reason: UIDrawerRequestCloseReason;
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const style = `
  :host {
    position: fixed;
    inset: 0;
    display: block;
    pointer-events: none;
    isolation: isolate;
    z-index: 1200;
    color-scheme: light dark;

    --ui-drawer-overlay: color-mix(in srgb, #020617 56%, transparent);
    --ui-drawer-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent) 0%,
      color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 20%, var(--ui-color-surface, #ffffff)) 100%
    );
    --ui-drawer-color: var(--ui-color-text, #0f172a);
    --ui-drawer-muted: var(--ui-color-muted, #64748b);
    --ui-drawer-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-drawer-border: 1px solid var(--ui-drawer-border-color);
    --ui-drawer-shadow: none;
    --ui-drawer-focus-ring: var(--ui-color-focus-ring, #2563eb);
    --ui-drawer-control-bg: color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 90%, transparent);
    --ui-drawer-control-bg-hover: color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, var(--ui-drawer-control-bg));
    --ui-drawer-panel-backdrop: none;
    --ui-drawer-inset: 0px;
    --ui-drawer-width: min(420px, 94vw);
    --ui-drawer-height: min(520px, 80vh);
    --ui-drawer-radius: 16px;
    --ui-drawer-transition: 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
    --ui-drawer-header-padding: 16px 20px;
    --ui-drawer-body-padding: 20px;
    --ui-drawer-footer-padding: 14px 20px;
    --ui-drawer-close-size: 32px;
  }

  :host([open]) {
    pointer-events: auto;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: var(--ui-drawer-overlay);
    backdrop-filter: blur(4px) saturate(1.06);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--ui-drawer-transition);
  }

  :host([open]) .overlay {
    opacity: 1;
    pointer-events: auto;
  }

  .panel {
    position: absolute;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    overflow: hidden;
    background: var(--ui-drawer-bg);
    backdrop-filter: var(--ui-drawer-panel-backdrop);
    color: var(--ui-drawer-color);
    border: var(--ui-drawer-border);
    box-shadow: var(--ui-drawer-shadow);
    outline: none;
    opacity: 0;
    transition:
      transform var(--ui-drawer-transition),
      opacity var(--ui-drawer-transition),
      border-color var(--ui-drawer-transition),
      box-shadow var(--ui-drawer-transition);
  }

  .panel::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, #ffffff 44%, transparent);
    opacity: 0.72;
  }

  :host([open]) .panel {
    opacity: 1;
  }

  .panel:focus-visible,
  .close-btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-drawer-focus-ring) 66%, transparent);
    outline-offset: 2px;
  }

  .panel.side-left {
    left: 0;
    top: 0;
    bottom: 0;
    width: min(var(--ui-drawer-width), calc(100vw - (var(--ui-drawer-inset) * 2)));
    border-left: none;
    border-radius: 0 var(--ui-drawer-radius) var(--ui-drawer-radius) 0;
    transform: translateX(-102%);
  }

  :host([open]) .panel.side-left {
    transform: translateX(0);
  }

  .panel.side-right {
    right: 0;
    top: 0;
    bottom: 0;
    width: min(var(--ui-drawer-width), calc(100vw - (var(--ui-drawer-inset) * 2)));
    border-right: none;
    border-radius: var(--ui-drawer-radius) 0 0 var(--ui-drawer-radius);
    transform: translateX(102%);
  }

  :host([open]) .panel.side-right {
    transform: translateX(0);
  }

  .panel.side-top {
    left: 0;
    right: 0;
    top: 0;
    height: min(var(--ui-drawer-height), calc(100vh - (var(--ui-drawer-inset) * 2)));
    border-top: none;
    border-radius: 0 0 var(--ui-drawer-radius) var(--ui-drawer-radius);
    transform: translateY(-102%);
  }

  :host([open]) .panel.side-top {
    transform: translateY(0);
  }

  .panel.side-bottom {
    left: 0;
    right: 0;
    bottom: 0;
    height: min(var(--ui-drawer-height), calc(100vh - (var(--ui-drawer-inset) * 2)));
    border-bottom: none;
    border-radius: var(--ui-drawer-radius) var(--ui-drawer-radius) 0 0;
    transform: translateY(102%);
  }

  :host([open]) .panel.side-bottom {
    transform: translateY(0);
  }

  .header,
  .footer {
    min-height: 56px;
    display: grid;
    align-items: center;
    box-sizing: border-box;
  }

  .header {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    padding: var(--ui-drawer-header-padding);
    border-bottom: 1px solid color-mix(in srgb, var(--ui-drawer-border-color) 84%, transparent);
    background: color-mix(in srgb, var(--ui-drawer-bg) 95%, #ffffff 5%);
  }

  .header.empty,
  .footer.empty {
    display: none;
  }

  .header-main {
    min-width: 0;
    display: grid;
    gap: 6px;
  }

  .title {
    margin: 0;
    font-size: 18px;
    line-height: 1.35;
    font-weight: 680;
    letter-spacing: -0.01em;
    color: color-mix(in srgb, var(--ui-drawer-color) 96%, transparent);
  }

  .subtitle {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: var(--ui-drawer-muted);
  }

  .footer {
    padding: var(--ui-drawer-footer-padding);
    border-top: 1px solid color-mix(in srgb, var(--ui-drawer-border-color) 84%, transparent);
    background: color-mix(in srgb, var(--ui-drawer-bg) 96%, #ffffff 4%);
  }

  .body {
    min-height: 0;
    overflow: auto;
    padding: var(--ui-drawer-body-padding);
    box-sizing: border-box;
    background: color-mix(in srgb, var(--ui-drawer-bg) 99%, transparent);
  }

  .close-btn {
    width: var(--ui-drawer-close-size);
    height: var(--ui-drawer-close-size);
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--ui-drawer-border-color) 86%, transparent);
    background: var(--ui-drawer-control-bg);
    color: inherit;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    transition:
      background-color 130ms ease,
      transform 120ms ease,
      border-color 130ms ease,
      opacity 130ms ease;
  }

  .close-btn:hover {
    background: var(--ui-drawer-control-bg-hover);
    border-color: color-mix(in srgb, var(--ui-drawer-focus-ring) 32%, var(--ui-drawer-border-color));
  }

  .close-btn:active {
    transform: translateY(1px);
  }

  .close-btn[hidden] {
    display: none;
  }

  .close-btn:disabled {
    cursor: not-allowed;
    opacity: 0.56;
    transform: none;
  }

  .close-icon {
    width: 16px;
    height: 16px;
    pointer-events: none;
  }

  ::slotted([slot='header']) {
    font: 650 15px/1.3 Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    letter-spacing: -0.01em;
    color: color-mix(in srgb, var(--ui-drawer-color) 95%, transparent);
  }

  ::slotted([slot='footer']) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  :host([headless]) .overlay,
  :host([headless]) .panel {
    display: none;
  }

  :host([shape='square']) {
    --ui-drawer-radius: 4px;
  }

  :host([shape='soft']) {
    --ui-drawer-radius: 24px;
  }

  :host([density='compact']) {
    --ui-drawer-header-padding: 12px 14px;
    --ui-drawer-body-padding: 14px;
    --ui-drawer-footer-padding: 12px 14px;
    --ui-drawer-close-size: 30px;
  }

  :host([density='comfortable']) {
    --ui-drawer-header-padding: 20px 22px;
    --ui-drawer-body-padding: 22px;
    --ui-drawer-footer-padding: 18px 22px;
    --ui-drawer-close-size: 34px;
  }

  :host([size='sm']) {
    --ui-drawer-width: min(340px, 92vw);
    --ui-drawer-height: min(420px, 70vh);
  }

  :host([size='lg']) {
    --ui-drawer-width: min(560px, 98vw);
    --ui-drawer-height: min(640px, 90vh);
  }

  :host([elevation='none']) {
    --ui-drawer-shadow: none;
  }

  :host([elevation='low']) {
    --ui-drawer-shadow: 0 1px 2px rgba(2, 6, 23, 0.06), 0 16px 36px rgba(2, 6, 23, 0.18);
  }

  :host([elevation='high']) {
    --ui-drawer-shadow: 0 2px 4px rgba(2, 6, 23, 0.1), 0 42px 96px rgba(2, 6, 23, 0.34);
  }

  :host([variant='solid']) .panel {
    background: color-mix(in srgb, var(--ui-color-surface, #ffffff) 100%, transparent);
    --ui-drawer-panel-backdrop: none;
  }

  :host([variant='solid']) .panel::before,
  :host([variant='flat']) .panel::before,
  :host([variant='line']) .panel::before {
    display: none;
  }

  :host([variant='flat']) {
    --ui-drawer-shadow: none;
  }

  :host([variant='line']) {
    --ui-drawer-shadow: none;
    --ui-drawer-border-color: color-mix(in srgb, var(--ui-drawer-color, #0f172a) 34%, transparent);
  }

  :host([variant='line']) .header,
  :host([variant='line']) .footer,
  :host([variant='line']) .body {
    background: transparent;
  }

  :host([variant='glass']) {
    --ui-drawer-panel-backdrop: blur(16px) saturate(1.1);
  }

  :host([variant='glass']) .panel {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 86%, #ffffff 14%),
        color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 88%, transparent)
      ),
      var(--ui-color-surface, #ffffff);
  }

  :host([variant='glass']) .overlay {
    backdrop-filter: blur(8px) saturate(1.12);
  }

  :host([variant='contrast']) {
    --ui-drawer-bg: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    --ui-drawer-color: #e2e8f0;
    --ui-drawer-muted: #94a3b8;
    --ui-drawer-border-color: #334155;
    --ui-drawer-overlay: rgba(2, 6, 23, 0.78);
    --ui-drawer-focus-ring: #93c5fd;
    --ui-drawer-control-bg: #111827;
    --ui-drawer-control-bg-hover: color-mix(in srgb, #ffffff 14%, transparent);
  }

  :host([tone='danger']) {
    --ui-drawer-focus-ring: var(--ui-color-danger, #dc2626);
    --ui-drawer-control-bg-hover: color-mix(in srgb, var(--ui-color-danger, #dc2626) 12%, transparent);
  }

  :host([tone='success']) {
    --ui-drawer-focus-ring: var(--ui-color-success, #16a34a);
    --ui-drawer-control-bg-hover: color-mix(in srgb, var(--ui-color-success, #16a34a) 12%, transparent);
  }

  :host([tone='warning']) {
    --ui-drawer-focus-ring: var(--ui-color-warning, #d97706);
    --ui-drawer-control-bg-hover: color-mix(in srgb, var(--ui-color-warning, #d97706) 16%, transparent);
  }

  :host([state='error']) .panel {
    border-color: color-mix(in srgb, var(--ui-color-danger, #dc2626) 40%, var(--ui-drawer-border-color));
  }

  :host([state='success']) .panel {
    border-color: color-mix(in srgb, var(--ui-color-success, #16a34a) 40%, var(--ui-drawer-border-color));
  }

  :host([state='loading']) .body {
    cursor: progress;
  }

  :host([inset]) {
    --ui-drawer-inset: clamp(8px, 2vw, 22px);
  }

  :host([inset]) .panel.side-left,
  :host([inset]) .panel.side-right,
  :host([inset]) .panel.side-top,
  :host([inset]) .panel.side-bottom {
    border: var(--ui-drawer-border);
    border-radius: var(--ui-drawer-radius);
  }

  :host([inset]) .panel.side-left {
    left: var(--ui-drawer-inset);
    top: var(--ui-drawer-inset);
    bottom: var(--ui-drawer-inset);
  }

  :host([inset]) .panel.side-right {
    right: var(--ui-drawer-inset);
    top: var(--ui-drawer-inset);
    bottom: var(--ui-drawer-inset);
  }

  :host([inset]) .panel.side-top {
    left: var(--ui-drawer-inset);
    right: var(--ui-drawer-inset);
    top: var(--ui-drawer-inset);
  }

  :host([inset]) .panel.side-bottom {
    left: var(--ui-drawer-inset);
    right: var(--ui-drawer-inset);
    bottom: var(--ui-drawer-inset);
  }

  @media (max-width: 768px) {
    :host {
      --ui-drawer-width: min(100vw, var(--ui-drawer-width));
      --ui-drawer-height: min(88vh, var(--ui-drawer-height));
      --ui-drawer-header-padding: 14px 16px;
      --ui-drawer-body-padding: 16px;
      --ui-drawer-footer-padding: 12px 16px;
    }

    .panel.side-left,
    .panel.side-right {
      width: min(100vw, var(--ui-drawer-width));
      border-radius: 0;
    }

    :host([inset]) .panel.side-left,
    :host([inset]) .panel.side-right {
      border-radius: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .overlay,
    .panel,
    .close-btn {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-drawer-border: 2px solid var(--ui-drawer-border-color);
      --ui-drawer-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-drawer-overlay: color-mix(in srgb, CanvasText 44%, transparent);
      --ui-drawer-bg: Canvas;
      --ui-drawer-color: CanvasText;
      --ui-drawer-muted: CanvasText;
      --ui-drawer-border-color: CanvasText;
      --ui-drawer-shadow: none;
      --ui-drawer-control-bg: ButtonFace;
      --ui-drawer-control-bg-hover: Highlight;
      --ui-drawer-focus-ring: Highlight;
    }

    .panel,
    .close-btn {
      forced-color-adjust: none;
      box-shadow: none;
    }

    .close-btn {
      color: CanvasText;
      border-color: CanvasText;
    }

    .close-btn:hover,
    .close-btn:focus-visible {
      color: HighlightText;
      background: Highlight;
      border-color: Highlight;
    }

    .panel::before {
      display: none;
    }
  }
`;

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

function normalizeSide(side: string | null, dir: 'ltr' | 'rtl'): DrawerSide {
  if (side === 'top' || side === 'bottom' || side === 'left' || side === 'right') return side;
  if (side === 'start') return dir === 'rtl' ? 'right' : 'left';
  if (side === 'end') return dir === 'rtl' ? 'left' : 'right';
  return 'left';
}

function hasSlotContent(host: HTMLElement, slotName: string): boolean {
  const node = host.querySelector(`[slot="${slotName}"]`);
  if (!node) return false;
  return node.textContent?.trim().length !== 0 || node.children.length > 0;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export class UIDrawer extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'side',
      'dismissible',
      'headless',
      'variant',
      'density',
      'shape',
      'elevation',
      'tone',
      'size',
      'inset',
      'close-on-overlay',
      'close-on-esc',
      'lock-while-loading',
      'show-close',
      'state',
      'title',
      'description',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
      'initial-focus'
    ];
  }

  private _uid = Math.random().toString(36).slice(2, 10);
  private _isOpen = false;
  private _restoreFocusEl: HTMLElement | null = null;
  private _globalListenersBound = false;
  private _closeReason: UIDrawerRequestCloseReason = 'programmatic';

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onDocumentFocusIn = this._onDocumentFocusIn.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
    this._syncOpenState();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    this._unbindGlobalListeners();
    this._releaseOpenResources();
    this._restoreFocusEl = null;
    this._isOpen = false;
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'open') {
      this._syncOpenState();
      return;
    }

    if (this.isConnected) this.requestRender();

    if (this._isOpen && (name === 'initial-focus' || name === 'dismissible' || name === 'show-close')) {
      queueMicrotask(() => this._ensureFocusTrap());
    }
  }

  open(): void {
    this.setAttribute('open', '');
  }

  close(reason: UIDrawerRequestCloseReason = 'programmatic'): void {
    this._closeReason = reason;
    this.removeAttribute('open');
  }

  closeDrawer(reason: UIDrawerRequestCloseReason = 'programmatic'): void {
    if (!this.hasAttribute('open')) return;
    if (reason === 'programmatic') {
      this.close('programmatic');
      return;
    }
    this._requestClose(reason);
  }

  toggle(): void {
    if (this.hasAttribute('open')) this.close('programmatic');
    else this.open();
  }

  get dismissible(): boolean {
    const raw = this.getAttribute('dismissible');
    if (raw == null) return false;
    return toBool(raw, true);
  }

  set dismissible(value: boolean) {
    if (value) this.setAttribute('dismissible', '');
    else this.removeAttribute('dismissible');
  }

  get closeOnOverlay(): boolean {
    return toBool(this.getAttribute('close-on-overlay'), true);
  }

  set closeOnOverlay(value: boolean) {
    this.setAttribute('close-on-overlay', String(value));
  }

  get closeOnEsc(): boolean {
    return toBool(this.getAttribute('close-on-esc'), true);
  }

  set closeOnEsc(value: boolean) {
    this.setAttribute('close-on-esc', String(value));
  }

  get lockWhileLoading(): boolean {
    return toBool(this.getAttribute('lock-while-loading'), true);
  }

  set lockWhileLoading(value: boolean) {
    this.setAttribute('lock-while-loading', String(value));
  }

  get showClose(): boolean {
    if (this.hasAttribute('show-close')) {
      return toBool(this.getAttribute('show-close'), true);
    }
    return this.dismissible;
  }

  set showClose(value: boolean) {
    this.setAttribute('show-close', String(value));
  }

  get state(): UIDrawerState {
    const raw = this.getAttribute('state');
    if (raw === 'loading' || raw === 'error' || raw === 'success') return raw;
    return 'idle';
  }

  set state(value: UIDrawerState) {
    if (value === 'idle') {
      this.removeAttribute('state');
      return;
    }
    this.setAttribute('state', value);
  }

  get inset(): boolean {
    return this.hasAttribute('inset');
  }

  set inset(value: boolean) {
    if (value) this.setAttribute('inset', '');
    else this.removeAttribute('inset');
  }

  private _getPanel(): HTMLElement | null {
    return this.root.querySelector('.panel') as HTMLElement | null;
  }

  private _isTopMost(): boolean {
    const topOverlay = OverlayManager.top();
    if (!topOverlay) return true;
    return topOverlay === (this as unknown as HTMLElement);
  }

  private _isInteractionLocked(): boolean {
    return this.state === 'loading' && this.lockWhileLoading;
  }

  private _isNodeInsideDrawer(node: Node | null): boolean {
    if (!node) return false;
    const panel = this._getPanel();
    if (panel && panel.contains(node)) return true;
    return this.contains(node);
  }

  private _isFocusable(node: HTMLElement): boolean {
    if (!node || !node.isConnected) return false;
    if ((node as HTMLButtonElement).disabled) return false;
    if (node.matches('[inert], [aria-hidden="true"]')) return false;
    if (node.closest('[inert], [aria-hidden="true"]')) return false;
    if (!isBrowser()) return true;

    const computed = window.getComputedStyle(node);
    return computed.display !== 'none' && computed.visibility !== 'hidden';
  }

  private _collectFocusable(): HTMLElement[] {
    const panel = this._getPanel();
    const result: HTMLElement[] = [];

    const add = (node: HTMLElement) => {
      if (!this._isFocusable(node)) return;
      if (!result.includes(node)) result.push(node);
    };

    if (panel) {
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR).forEach(add);
    }

    this.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR).forEach(add);

    return result;
  }

  private _focusInitial(): void {
    if (!this._isOpen) return;
    const panel = this._getPanel();
    if (!panel) return;

    const selector = this.getAttribute('initial-focus') || '';
    if (selector) {
      const explicit = this.querySelector<HTMLElement>(selector) || panel.querySelector<HTMLElement>(selector);
      if (explicit && this._isFocusable(explicit)) {
        try {
          explicit.focus();
          return;
        } catch {
          // no-op
        }
      }
    }

    const focusable = this._collectFocusable();
    const auto = focusable.find((node) => node.hasAttribute('autofocus'));
    const target = auto || focusable[0] || panel;

    if (target === panel && !target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }

    try {
      target.focus();
    } catch {
      // no-op
    }
  }

  private _ensureFocusTrap(): void {
    if (!this._isOpen || !this._isTopMost()) return;

    const active = document.activeElement as Node | null;
    if (!this._isNodeInsideDrawer(active)) {
      this._focusInitial();
    }
  }

  private _releaseOpenResources(): void {
    try {
      OverlayManager.unregister(this as unknown as HTMLElement);
      OverlayManager.releaseLock();
    } catch {
      // no-op
    }
  }

  private _canRestoreFocus(node: HTMLElement): boolean {
    if (!node || !node.isConnected) return false;
    if ((node as HTMLButtonElement).disabled) return false;
    if (!isBrowser()) return true;
    const computed = window.getComputedStyle(node);
    return computed.display !== 'none' && computed.visibility !== 'hidden';
  }

  private _syncOpenState(): void {
    const nowOpen = this.hasAttribute('open');

    if (nowOpen === this._isOpen) {
      if (nowOpen) {
        this._bindGlobalListeners();
        queueMicrotask(() => this._ensureFocusTrap());
      } else {
        this._unbindGlobalListeners();
      }
      return;
    }

    this._isOpen = nowOpen;

    if (nowOpen) {
      this._bindGlobalListeners();
      this._restoreFocusEl = (document.activeElement as HTMLElement) || null;
      this._closeReason = 'programmatic';

      try {
        OverlayManager.register(this as unknown as HTMLElement);
        OverlayManager.acquireLock();
      } catch {
        // no-op
      }

      queueMicrotask(() => this._focusInitial());

      this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
      this.dispatchEvent(new CustomEvent('show', { bubbles: true, composed: true }));
      this.dispatchEvent(
        new CustomEvent<UIDrawerChangeDetail>('change', {
          bubbles: true,
          composed: true,
          detail: { open: true, reason: 'programmatic' }
        })
      );
      return;
    }

    this._unbindGlobalListeners();
    this._releaseOpenResources();

    const reason = this._closeReason;

    this.dispatchEvent(
      new CustomEvent<{ reason: UIDrawerRequestCloseReason }>('close', {
        bubbles: true,
        composed: true,
        detail: { reason }
      })
    );
    this.dispatchEvent(
      new CustomEvent<{ reason: UIDrawerRequestCloseReason }>('hide', {
        bubbles: true,
        composed: true,
        detail: { reason }
      })
    );
    this.dispatchEvent(
      new CustomEvent<UIDrawerChangeDetail>('change', {
        bubbles: true,
        composed: true,
        detail: { open: false, reason }
      })
    );

    const restoreTarget = this._restoreFocusEl;
    this._restoreFocusEl = null;
    this._closeReason = 'programmatic';

    if (restoreTarget && this._canRestoreFocus(restoreTarget)) {
      setTimeout(() => {
        try {
          if (this._canRestoreFocus(restoreTarget)) restoreTarget.focus();
        } catch {
          // no-op
        }
      }, 0);
    }
  }

  private _requestClose(reason: UIDrawerRequestCloseReason): void {
    if (!this._isOpen) return;
    if (this._isInteractionLocked()) return;

    const requestClose = new CustomEvent<UIDrawerRequestCloseDetail>('request-close', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.dispatchEvent(requestClose);

    const uiRequestClose = new CustomEvent<UIDrawerRequestCloseDetail>('ui-request-close', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.dispatchEvent(uiRequestClose);

    if (requestClose.defaultPrevented || uiRequestClose.defaultPrevented) return;

    this.close(reason);
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target || !this._isOpen) return;

    if (target.closest('.close-btn')) {
      this._requestClose('button');
      return;
    }

    const isOverlay = !!target.closest('.overlay');
    if (!isOverlay) return;
    if (!this.dismissible || !this.closeOnOverlay) return;
    if (!this._isTopMost()) return;

    this._requestClose('overlay');
  }

  private _handleTab(event: KeyboardEvent): void {
    const panel = this._getPanel();
    if (!panel) return;

    const focusable = this._collectFocusable();
    if (!focusable.length) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const activeInside = !!active && this._isNodeInsideDrawer(active);

    if (event.shiftKey) {
      if (!activeInside || active === first) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (!activeInside || active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (!this._isOpen || !this._isTopMost()) return;

    if (event.key === 'Escape') {
      if (!this.dismissible || !this.closeOnEsc || this._isInteractionLocked()) return;
      event.preventDefault();
      event.stopPropagation();
      this._requestClose('escape');
      return;
    }

    if (event.key === 'Tab') {
      this._handleTab(event);
    }
  }

  private _onDocumentFocusIn(event: FocusEvent): void {
    if (!this._isOpen || !this._isTopMost()) return;

    const target = event.target as Node | null;
    const panel = this._getPanel();
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];

    const inside =
      (target && this._isNodeInsideDrawer(target)) ||
      path.includes(this) ||
      (panel ? path.includes(panel) : false);

    if (inside) return;

    this._focusInitial();
  }

  protected render(): void {
    const dirAttr = this.getAttribute('dir') || document.documentElement.getAttribute('dir') || 'ltr';
    const side = normalizeSide(this.getAttribute('side') as LogicalDrawerSide | null, dirAttr === 'rtl' ? 'rtl' : 'ltr');

    const showClose = this.showClose;
    const hasHeaderSlot = hasSlotContent(this, 'header');
    const hasFooter = hasSlotContent(this, 'footer');

    const title = (this.getAttribute('title') || '').trim();
    const description = (this.getAttribute('description') || '').trim();
    const hasHeader = showClose || hasHeaderSlot || Boolean(title) || Boolean(description);

    const titleId = `ui-drawer-title-${this._uid}`;
    const descId = `ui-drawer-description-${this._uid}`;
    const bodyId = `ui-drawer-body-${this._uid}`;

    const ariaLabel = this.getAttribute('aria-label') || '';
    const explicitLabelledBy = this.getAttribute('aria-labelledby') || '';
    const explicitDescribedBy = this.getAttribute('aria-describedby') || '';

    const labelledBy = explicitLabelledBy || (!ariaLabel && (hasHeaderSlot || Boolean(title)) ? titleId : '');

    const describedByIds: string[] = [];
    if (explicitDescribedBy) {
      describedByIds.push(explicitDescribedBy);
    } else {
      if (Boolean(description)) describedByIds.push(descId);
      describedByIds.push(bodyId);
    }

    const fallbackLabel = ariaLabel || (!labelledBy ? 'Drawer' : '');
    const isLoading = this.state === 'loading';

    this.setContent(`
      <style>${style}</style>
      <div class="overlay" part="overlay" aria-hidden="true"></div>
      <aside
        class="panel side-${side}"
        part="panel"
        role="dialog"
        aria-modal="true"
        ${fallbackLabel ? `aria-label="${escapeHtml(fallbackLabel)}"` : ''}
        ${labelledBy ? `aria-labelledby="${escapeHtml(labelledBy)}"` : ''}
        ${describedByIds.length ? `aria-describedby="${escapeHtml(describedByIds.join(' '))}"` : ''}
        ${isLoading ? 'aria-busy="true"' : ''}
        tabindex="-1"
      >
        <header class="header ${hasHeader ? '' : 'empty'}" part="header">
          <div class="header-main">
            ${hasHeaderSlot ? `<slot name="header" id="${titleId}"></slot>` : ''}
            ${!hasHeaderSlot && title ? `<h2 class="title" id="${titleId}">${escapeHtml(title)}</h2>` : ''}
            ${description ? `<p class="subtitle" id="${descId}">${escapeHtml(description)}</p>` : ''}
          </div>
          <button
            type="button"
            class="close-btn"
            part="close"
            aria-label="Close drawer"
            ${showClose ? '' : 'hidden'}
            ${isLoading && this.lockWhileLoading ? 'disabled' : ''}
          >
            <svg class="close-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
              <path d="M3.5 3.5L12.5 12.5"></path>
              <path d="M12.5 3.5L3.5 12.5"></path>
            </svg>
          </button>
        </header>
        <div class="body" part="body" id="${bodyId}"><slot></slot></div>
        <footer class="footer ${hasFooter ? '' : 'empty'}" part="footer"><slot name="footer"></slot></footer>
      </aside>
    `);

    if (this._isOpen) {
      queueMicrotask(() => this._ensureFocusTrap());
    }
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    document.addEventListener('keydown', this._onDocumentKeyDown, true);
    document.addEventListener('focusin', this._onDocumentFocusIn, true);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    document.removeEventListener('keydown', this._onDocumentKeyDown, true);
    document.removeEventListener('focusin', this._onDocumentFocusIn, true);
    this._globalListenersBound = false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-drawer')) {
  customElements.define('ui-drawer', UIDrawer);
}
