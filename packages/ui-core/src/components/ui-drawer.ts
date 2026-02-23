import { ElementBase } from '../ElementBase';
import { FocusManager } from '../focusManager';
import OverlayManager from '../overlayManager';

type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

type LogicalDrawerSide = DrawerSide | 'start' | 'end';

const style = `
  :host {
    position: fixed;
    inset: 0;
    display: block;
    pointer-events: none;
    z-index: 1200;
    color-scheme: light dark;

    --ui-drawer-overlay: color-mix(in srgb, var(--ui-color-text, var(--ui-text, #0f172a)) 46%, transparent);
    --ui-drawer-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-drawer-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-drawer-border-color: var(--ui-color-border, var(--ui-border, rgba(15, 23, 42, 0.14)));
    --ui-drawer-border: 1px solid var(--ui-drawer-border-color);
    --ui-drawer-shadow:
      0 28px 72px rgba(2, 6, 23, 0.28),
      0 3px 14px rgba(2, 6, 23, 0.12);
    --ui-drawer-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-drawer-control-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-drawer-control-bg-hover: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 10%, transparent);
    --ui-drawer-panel-backdrop: none;
    --ui-drawer-inset: 0px;
    --ui-drawer-width: min(400px, 92vw);
    --ui-drawer-height: min(500px, 78vh);
    --ui-drawer-radius: 18px;
    --ui-drawer-transition: 260ms cubic-bezier(0.2, 0.9, 0.24, 1);
    --ui-drawer-header-padding: 13px 15px;
    --ui-drawer-body-padding: 15px;
    --ui-drawer-footer-padding: 13px 15px;
    --ui-drawer-close-size: 32px;
  }

  :host([open]) {
    pointer-events: auto;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: var(--ui-drawer-overlay);
    backdrop-filter: blur(3px) saturate(1.04);
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
    backdrop-filter: var(--ui-drawer-panel-backdrop, none);
    color: var(--ui-drawer-color);
    border: var(--ui-drawer-border);
    box-shadow: var(--ui-drawer-shadow);
    outline: none;
    transition: transform var(--ui-drawer-transition);
  }

  .panel::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, #ffffff 48%, transparent);
    opacity: 0.74;
  }

  .panel.side-left {
    left: 0;
    top: 0;
    bottom: 0;
    width: min(var(--ui-drawer-width), calc(100vw - (var(--ui-drawer-inset, 0px) * 2)));
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
    width: min(var(--ui-drawer-width), calc(100vw - (var(--ui-drawer-inset, 0px) * 2)));
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
    height: min(var(--ui-drawer-height), calc(100vh - (var(--ui-drawer-inset, 0px) * 2)));
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
    height: min(var(--ui-drawer-height), calc(100vh - (var(--ui-drawer-inset, 0px) * 2)));
    border-bottom: none;
    border-radius: var(--ui-drawer-radius) var(--ui-drawer-radius) 0 0;
    transform: translateY(102%);
  }

  :host([open]) .panel.side-bottom {
    transform: translateY(0);
  }

  .header,
  .footer {
    min-height: 52px;
    display: grid;
    align-items: center;
    box-sizing: border-box;
  }

  .header {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    padding: var(--ui-drawer-header-padding);
    border-bottom: 1px solid color-mix(in srgb, var(--ui-drawer-border-color) 86%, transparent);
    background: color-mix(in srgb, var(--ui-drawer-bg) 94%, #ffffff 6%);
  }

  .header.empty {
    display: none;
  }

  .footer {
    padding: var(--ui-drawer-footer-padding);
    border-top: 1px solid color-mix(in srgb, var(--ui-drawer-border-color) 86%, transparent);
    background: color-mix(in srgb, var(--ui-drawer-bg) 96%, #ffffff 4%);
  }

  .footer.empty {
    display: none;
  }

  .body {
    min-height: 0;
    overflow: auto;
    padding: var(--ui-drawer-body-padding);
    box-sizing: border-box;
    background: color-mix(in srgb, var(--ui-drawer-bg) 99%, transparent);
  }

  .close-btn {
    width: var(--ui-drawer-close-size, 32px);
    height: var(--ui-drawer-close-size, 32px);
    border-radius: 9px;
    border: var(--ui-drawer-border);
    background: var(--ui-drawer-control-bg);
    color: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    transition: background-color 160ms ease, transform 140ms ease, border-color 160ms ease;
  }

  .close-btn:hover {
    background: var(--ui-drawer-control-bg-hover);
    border-color: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 34%, var(--ui-drawer-border-color));
  }

  .close-btn:active {
    transform: scale(0.98);
  }

  .close-btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-drawer-focus-ring) 88%, white 12%);
    outline-offset: 2px;
  }

  .close-btn[hidden] {
    display: none;
  }

  ::slotted([slot="header"]) {
    font: 600 14px/1.25 "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
  }

  ::slotted([slot="footer"]) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  :host([headless]) .overlay,
  :host([headless]) .panel {
    display: none;
  }

  :host([shape="square"]) {
    --ui-drawer-radius: 2px;
  }

  :host([shape="soft"]) {
    --ui-drawer-radius: 24px;
  }

  :host([density="compact"]) {
    --ui-drawer-header-padding: 10px 12px;
    --ui-drawer-body-padding: 12px;
    --ui-drawer-footer-padding: 10px 12px;
    --ui-drawer-close-size: 28px;
  }

  :host([density="comfortable"]) {
    --ui-drawer-header-padding: 16px 18px;
    --ui-drawer-body-padding: 18px;
    --ui-drawer-footer-padding: 16px 18px;
    --ui-drawer-close-size: 36px;
  }

  :host([size="sm"]) {
    --ui-drawer-width: min(320px, 90vw);
    --ui-drawer-height: min(380px, 64vh);
  }

  :host([size="lg"]) {
    --ui-drawer-width: min(520px, 96vw);
    --ui-drawer-height: min(620px, 88vh);
  }

  :host([elevation="none"]) {
    --ui-drawer-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-drawer-shadow:
      0 14px 36px rgba(2, 6, 23, 0.18),
      0 2px 8px rgba(2, 6, 23, 0.1);
  }

  :host([elevation="high"]) {
    --ui-drawer-shadow:
      0 38px 88px rgba(2, 6, 23, 0.32),
      0 6px 18px rgba(2, 6, 23, 0.16);
  }

  :host([variant="solid"]) .panel {
    background: var(--ui-drawer-bg);
    --ui-drawer-panel-backdrop: none;
  }

  :host([variant="solid"]) .panel::before {
    box-shadow: none;
  }

  :host([variant="flat"]) {
    --ui-drawer-shadow: none;
  }

  :host([variant="flat"]) .panel::before {
    display: none;
  }

  :host([variant="line"]) {
    --ui-drawer-shadow: none;
    --ui-drawer-border-color: color-mix(in srgb, var(--ui-drawer-color, #0f172a) 30%, transparent);
  }

  :host([variant="line"]) .panel::before {
    display: none;
  }

  :host([variant="line"]) .header,
  :host([variant="line"]) .footer,
  :host([variant="line"]) .body {
    background: transparent;
  }

  :host([variant="glass"]) {
    --ui-drawer-panel-backdrop: blur(16px) saturate(1.1);
  }

  :host([variant="glass"]) .panel {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-drawer-bg) 86%, #ffffff 14%),
        color-mix(in srgb, var(--ui-drawer-bg) 90%, transparent)
      ),
      var(--ui-drawer-bg);
  }

  :host([variant="glass"]) .overlay {
    backdrop-filter: blur(8px) saturate(1.12);
  }

  :host([variant="contrast"]) {
    --ui-drawer-bg: #0f172a;
    --ui-drawer-color: #e2e8f0;
    --ui-drawer-border-color: #334155;
    --ui-drawer-overlay: rgba(2, 6, 23, 0.78);
    --ui-drawer-focus-ring: #93c5fd;
    --ui-drawer-control-bg: #111827;
    --ui-drawer-control-bg-hover: color-mix(in srgb, #ffffff 14%, transparent);
  }

  :host([tone="danger"]) {
    --ui-drawer-focus-ring: #ef4444;
    --ui-drawer-control-bg-hover: color-mix(in srgb, #ef4444 14%, transparent);
  }

  :host([tone="success"]) {
    --ui-drawer-focus-ring: #16a34a;
    --ui-drawer-control-bg-hover: color-mix(in srgb, #16a34a 14%, transparent);
  }

  :host([tone="warning"]) {
    --ui-drawer-focus-ring: #d97706;
    --ui-drawer-control-bg-hover: color-mix(in srgb, #f59e0b 18%, transparent);
  }

  :host([inset]) {
    --ui-drawer-inset: clamp(8px, 2vw, 20px);
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
      --ui-drawer-border-color: CanvasText;
      --ui-drawer-shadow: none;
      --ui-drawer-control-bg: Canvas;
      --ui-drawer-control-bg-hover: Highlight;
      --ui-drawer-focus-ring: Highlight;
    }

    .close-btn {
      forced-color-adjust: none;
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
      'inset'
    ];
  }

  private _isOpen = false;
  private _trap: { release: () => void } | null = null;
  private _trapContainer: HTMLElement | null = null;
  private _restoreFocusEl: HTMLElement | null = null;
  private _globalListenersBound = false;

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
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
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (this.isConnected) this.requestRender();
    if (name === 'open') {
      this._syncOpenState();
      return;
    }

    if (this._isOpen) {
      this._ensureFocusTrap();
    }
  }

  open(): void {
    this.setAttribute('open', '');
  }

  close(): void {
    this.removeAttribute('open');
  }

  toggle(): void {
    if (this.hasAttribute('open')) this.close();
    else this.open();
  }

  get dismissible(): boolean {
    return this.hasAttribute('dismissible');
  }

  set dismissible(value: boolean) {
    if (value) this.setAttribute('dismissible', '');
    else this.removeAttribute('dismissible');
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

  private _releaseTrap(): void {
    if (this._trap) {
      try {
        this._trap.release();
      } catch {
        // no-op
      }
    }
    this._trap = null;
    this._trapContainer = null;
  }

  private _ensureFocusTrap(): void {
    if (!this._isOpen) return;
    const panel = this._getPanel();
    if (!panel) return;

    if (this._trapContainer !== panel) {
      this._releaseTrap();
      this._trap = FocusManager.trap(panel);
      this._trapContainer = panel;
    }

    requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      if (active && panel.contains(active)) return;
      try {
        panel.focus({ preventScroll: true });
      } catch {
        panel.focus();
      }
    });
  }

  private _releaseOpenResources(): void {
    this._releaseTrap();

    try {
      OverlayManager.unregister(this as unknown as HTMLElement);
      OverlayManager.releaseLock();
    } catch {
      // no-op
    }
  }

  private _syncOpenState(): void {
    const nowOpen = this.hasAttribute('open');
    if (nowOpen === this._isOpen) {
      if (nowOpen) {
        this._bindGlobalListeners();
        this._ensureFocusTrap();
      } else {
        this._unbindGlobalListeners();
      }
      return;
    }

    this._isOpen = nowOpen;

    if (nowOpen) {
      this._bindGlobalListeners();
      this._restoreFocusEl = document.activeElement as HTMLElement | null;

      try {
        OverlayManager.register(this as unknown as HTMLElement);
        OverlayManager.acquireLock();
      } catch {
        // no-op
      }

      this._ensureFocusTrap();

      this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
      this.dispatchEvent(new CustomEvent('show', { bubbles: true }));
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { open: true } }));
      return;
    }

    this._unbindGlobalListeners();
    this._releaseOpenResources();

    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('hide', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { open: false } }));

    if (this._restoreFocusEl && this._restoreFocusEl.isConnected) {
      try {
        this._restoreFocusEl.focus();
      } catch {
        // no-op
      }
    }
    this._restoreFocusEl = null;
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.closest('.close-btn')) {
      this.close();
      return;
    }

    const isOverlay = !!target.closest('.overlay');
    if (isOverlay && this.dismissible) {
      this.close();
    }
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (!this._isOpen) return;
    if (event.key !== 'Escape') return;
    if (!this.dismissible) return;

    const topOverlay = OverlayManager.top();
    if (topOverlay && topOverlay !== (this as unknown as HTMLElement)) return;

    event.preventDefault();
    this.close();
  }

  protected render(): void {
    const dirAttr = this.getAttribute('dir') || document.documentElement.getAttribute('dir') || 'ltr';
    const side = normalizeSide(this.getAttribute('side') as LogicalDrawerSide | null, dirAttr === 'rtl' ? 'rtl' : 'ltr');
    const dismissible = this.dismissible;
    const hasHeader = dismissible || hasSlotContent(this, 'header');
    const hasFooter = hasSlotContent(this, 'footer');

    this.setContent(`
      <style>${style}</style>
      <div class="overlay" part="overlay" aria-hidden="${this._isOpen ? 'false' : 'true'}"></div>
      <aside
        class="panel side-${side}"
        part="panel"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
      >
        <header class="header ${hasHeader ? '' : 'empty'}" part="header">
          <slot name="header"></slot>
          <button type="button" class="close-btn" aria-label="Close drawer" ${dismissible ? '' : 'hidden'}>×</button>
        </header>
        <div class="body" part="body"><slot></slot></div>
        <footer class="footer ${hasFooter ? '' : 'empty'}" part="footer"><slot name="footer"></slot></footer>
      </aside>
    `);

    if (this._isOpen) {
      this._ensureFocusTrap();
    }
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    document.addEventListener('keydown', this._onDocumentKeyDown);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    this._globalListenersBound = false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-drawer')) {
  customElements.define('ui-drawer', UIDrawer);
}
