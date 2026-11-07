import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-layout-bg: var(--ui-color-background, #f8fafc);
    --ui-layout-surface: var(--color-panel-solid, var(--ui-color-surface, #ffffff));
    --ui-layout-color: var(--ui-color-text, #0f172a);
    --ui-layout-border: 1px solid var(--ui-color-line-subtle, color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent));
    --ui-layout-shadow: none;
    --ui-layout-radius: calc(var(--ui-radius, 6px) + 4px);
    --ui-layout-gap: 14px;
    --ui-layout-padding: 14px;
    --ui-layout-header-padding: 12px 14px;
    --ui-layout-footer-padding: 12px 14px;
    --ui-layout-content-padding: 14px;
    --ui-layout-max-width: none;
    --ui-layout-sidebar-track: clamp(220px, 22vw, 320px);
    --ui-layout-aside-track: clamp(240px, 26vw, 360px);
    display: block;
    color: var(--ui-layout-color);
    color-scheme: light dark;
    overflow-anchor: none;
  }

  .layout {
    width: 100%;
    max-width: var(--ui-layout-max-width);
    margin: 0 auto;
    display: grid;
    gap: var(--ui-layout-gap);
    padding: var(--ui-layout-padding);
    box-sizing: border-box;
    border: var(--ui-layout-border);
    border-radius: var(--ui-layout-radius);
    background: var(--ui-layout-bg);
    color: var(--ui-layout-color);
    box-shadow: var(--ui-layout-shadow);
    position: relative;
    isolation: isolate;
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      box-shadow 180ms ease;
  }

  :host([variant="flat"]) .layout {
    box-shadow: none;
  }

  :host([variant="elevated"]) .layout {
    --ui-layout-shadow:
      0 34px 72px rgba(2, 6, 23, 0.18),
      0 6px 16px rgba(2, 6, 23, 0.1);
  }

  :host([variant="glass"]) .layout {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-layout-bg, #f8fafc) 90%, #ffffff 10%),
        color-mix(in srgb, var(--ui-layout-bg, #f8fafc) 95%, transparent)
      ),
      var(--ui-layout-bg);
    backdrop-filter: blur(16px) saturate(1.08);
  }

  :host([variant="contrast"]) .layout {
    --ui-layout-bg: #0f172a;
    --ui-layout-surface: #111827;
    --ui-layout-color: #e2e8f0;
    --ui-layout-border: 1px solid #334155;
  }

  :host([density="compact"]) .layout {
    --ui-layout-gap: 8px;
    --ui-layout-padding: 8px;
    --ui-layout-header-padding: 8px 10px;
    --ui-layout-footer-padding: 8px 10px;
    --ui-layout-content-padding: 10px;
    --ui-layout-radius: 10px;
  }

  :host([density="comfortable"]) .layout {
    --ui-layout-gap: 18px;
    --ui-layout-padding: 18px;
    --ui-layout-header-padding: 14px 18px;
    --ui-layout-footer-padding: 14px 18px;
    --ui-layout-content-padding: 18px;
    --ui-layout-radius: 20px;
  }

  :host([max-width="sm"]) .layout { --ui-layout-max-width: 640px; }
  :host([max-width="md"]) .layout { --ui-layout-max-width: 920px; }
  :host([max-width="lg"]) .layout { --ui-layout-max-width: 1180px; }
  :host([max-width="xl"]) .layout { --ui-layout-max-width: 1400px; }

  .header,
  .footer,
  .panel {
    min-width: 0;
    border-radius: calc(var(--ui-layout-radius) - 4px);
    border: var(--ui-layout-border);
    background: var(--ui-layout-surface);
    box-sizing: border-box;
  }

  .header {
    padding: var(--ui-layout-header-padding);
  }

  .footer {
    padding: var(--ui-layout-footer-padding);
  }

  .body {
    min-height: var(--ui-layout-min-height, 380px);
    display: grid;
    gap: var(--ui-layout-gap);
    align-items: stretch;
  }

  .body[data-layout="dashboard-start"] {
    grid-template-columns:
      var(--ui-layout-sidebar-track, clamp(220px, 22vw, 320px))
      minmax(0, 1fr)
      var(--ui-layout-aside-track, clamp(240px, 26vw, 360px));
  }

  .body[data-layout="dashboard-start-no-aside"] {
    grid-template-columns:
      var(--ui-layout-sidebar-track, clamp(220px, 22vw, 320px))
      minmax(0, 1fr);
  }

  .body[data-layout="dashboard-start-no-sidebar"] {
    grid-template-columns:
      minmax(0, 1fr)
      var(--ui-layout-aside-track, clamp(240px, 26vw, 360px));
  }

  .body[data-layout="dashboard-end"] {
    grid-template-columns:
      minmax(0, 1fr)
      var(--ui-layout-aside-track, clamp(240px, 26vw, 360px))
      var(--ui-layout-sidebar-track, clamp(220px, 22vw, 320px));
  }

  .body[data-layout="dashboard-end-no-aside"] {
    grid-template-columns:
      minmax(0, 1fr)
      var(--ui-layout-sidebar-track, clamp(220px, 22vw, 320px));
  }

  .body[data-layout="dashboard-end-no-sidebar"] {
    grid-template-columns:
      minmax(0, 1fr)
      var(--ui-layout-aside-track, clamp(240px, 26vw, 360px));
  }

  .body[data-layout="split-with-aside"] {
    grid-template-columns:
      minmax(0, 1fr)
      var(--ui-layout-aside-track, clamp(240px, 26vw, 360px));
  }

  .body[data-layout="split-with-sidebar-start"] {
    grid-template-columns:
      var(--ui-layout-sidebar-track, clamp(220px, 22vw, 320px))
      minmax(0, 1fr);
  }

  .body[data-layout="split-with-sidebar-end"] {
    grid-template-columns:
      minmax(0, 1fr)
      var(--ui-layout-sidebar-track, clamp(220px, 22vw, 320px));
  }

  .body[data-layout="content-only"] {
    grid-template-columns: minmax(0, 1fr);
  }

  .panel {
    min-height: 0;
    padding: var(--ui-layout-content-padding);
    overflow: hidden;
  }

  .content-panel {
    min-height: 160px;
  }

  .panel[hidden],
  .header[hidden],
  .footer[hidden],
  .body[hidden] {
    display: none !important;
  }

  .stack {
    display: grid;
    gap: var(--ui-layout-gap);
  }

  .stack .panel {
    min-height: 120px;
  }

  :host([headless]) .layout {
    display: none !important;
  }

  /* App shell: the layout is the page frame itself. No outer box, full viewport height, panels
     unframed so the components in them (AppHeader, Sidebar, Card) bring their own chrome instead
     of sitting in boxes inside boxes; only the content area scrolls. */
  :host([variant="shell"]) .layout {
    height: var(--ui-layout-shell-height, 100dvh);
    max-width: none;
    padding: 0;
    gap: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    grid-template-rows: auto minmax(0, 1fr) auto;
  }

  :host([variant="shell"]) .header,
  :host([variant="shell"]) .footer,
  :host([variant="shell"]) .panel {
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  /* Components in the shell are flush with it: the shell draws one divider per edge, and the
     AppHeader / Sidebar inside it drop their own outer border and radius (they read these
     inherited --base-* tokens). */
  :host([variant="shell"]) .header {
    padding: 0;
    border-block-end: var(--ui-layout-border);
    --base-app-header-radius: 0;
    --base-app-header-border: 0 solid transparent;
  }

  :host([variant="shell"]) .sidebar-panel,
  :host([data-drawer]) .sidebar-panel {
    --base-sidebar-radius: 0;
    --base-sidebar-border: 0 solid transparent;
    --base-sidebar-outline: none;
  }

  :host([variant="shell"]) .sidebar-panel {
    border-inline-end: var(--ui-layout-border);
  }

  :host([variant="shell"][sidebar-side="end"]) .sidebar-panel {
    border-inline-end: 0;
    border-inline-start: var(--ui-layout-border);
  }

  :host([variant="shell"]) .aside-panel {
    border-inline-start: var(--ui-layout-border);
  }

  :host([variant="shell"]) .footer {
    border-block-start: var(--ui-layout-border);
  }

  :host([variant="shell"]) .body {
    min-height: 0;
    gap: 0;
  }

  :host([variant="shell"]) .panel {
    min-height: 0;
    padding: 0;
    overflow: auto;
  }

  :host([variant="shell"]) .content-panel {
    padding: var(--ui-layout-content-padding);
  }

  :host([variant="shell"]) .sidebar-panel ::slotted(*),
  :host([variant="shell"]) .aside-panel ::slotted(*) {
    block-size: 100%;
  }

  /* Off-canvas sidebar on narrow screens (variant="shell", or mobile-sidebar="drawer"). */
  .backdrop {
    display: none;
  }

  :host([data-drawer]) .body {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  :host([data-drawer]) .sidebar-panel {
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    z-index: var(--ui-layout-drawer-z, 1000);
    inline-size: var(--ui-layout-drawer-width, auto);
    max-inline-size: 86vw;
    max-block-size: none;
    min-height: 0;
    padding: 0;
    overflow: auto;
    border: 0;
    border-radius: 0;
    background: var(--ui-layout-surface);
    box-shadow: 0 24px 48px rgba(2, 6, 23, 0.24);
    transform: translateX(-100%);
    visibility: hidden;
    transition: transform 200ms ease, visibility 0s linear 200ms;
  }

  :host([data-drawer][sidebar-side="end"]) .sidebar-panel {
    inset-inline-start: auto;
    inset-inline-end: 0;
    transform: translateX(100%);
  }

  :host([data-drawer][sidebar-open]) .sidebar-panel {
    transform: none;
    visibility: visible;
    transition: transform 200ms ease;
  }

  :host([data-drawer][sidebar-open]) .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: calc(var(--ui-layout-drawer-z, 1000) - 1);
    background: var(--ui-layout-backdrop, rgba(15, 23, 42, 0.45));
  }

  :host([data-drawer]) .sidebar-panel ::slotted(*) {
    block-size: 100%;
  }

  :host([data-drawer]) .sidebar-panel {
    border: 0 !important;
  }

  @media (prefers-reduced-motion: reduce) {
    :host([data-drawer]) .sidebar-panel,
    :host([data-drawer][sidebar-open]) .sidebar-panel {
      transition: none;
    }
  }

  @media (max-width: 980px) {
    .body {
      grid-template-columns: minmax(0, 1fr) !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .layout {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .layout,
    .header,
    .footer,
    .panel {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .layout,
    .header,
    .footer,
    .panel {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

type LayoutMode = 'dashboard' | 'split' | 'stack';
type LayoutShellState = {
  mode: LayoutMode;
  sidebarSide: 'start' | 'end';
  collapsed: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
  hasSidebarContent: boolean;
  hasAsideContent: boolean;
  hasContent: boolean;
  sidebarVisible: boolean;
  asideVisible: boolean;
  bodyVisible: boolean;
  layout: string;
  stack: boolean;
  sidebarTrack: string;
  asideTrack: string;
};

function hasSlotContent(slot: HTMLSlotElement | null): boolean {
  if (!slot) return false;
  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
    return false;
  });
}

function readBoolean(value: string | null): boolean {
  if (value == null) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function normalizeTrackSize(value: string | null, fallback: string): string {
  const raw = value?.trim();
  if (!raw) return fallback;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return `${raw}px`;
  return raw;
}

function deepActiveElement(): HTMLElement | null {
  let active = (typeof document !== 'undefined' ? document.activeElement : null) as HTMLElement | null;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement as HTMLElement;
  return active;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** First focusable element in a slot's content, looking into open shadow roots. */
function firstFocusable(slot: HTMLSlotElement | null): HTMLElement | null {
  const search = (root: ParentNode): HTMLElement | null => {
    for (const el of Array.from(root.querySelectorAll<HTMLElement>('*'))) {
      if (el.matches(FOCUSABLE)) return el;
      if (el.shadowRoot) {
        const inner = search(el.shadowRoot);
        if (inner) return inner;
      }
    }
    return null;
  };
  for (const el of slot?.assignedElements({ flatten: true }) || []) {
    if ((el as HTMLElement).matches(FOCUSABLE)) return el as HTMLElement;
    const found = search(el) || ((el as HTMLElement).shadowRoot ? search((el as HTMLElement).shadowRoot!) : null);
    if (found) return found;
  }
  return null;
}

export class UILayout extends ElementBase {
  static get observedAttributes() {
    return [
      'mode',
      'variant',
      'density',
      'max-width',
      'sidebar-side',
      'collapsed',
      'headless',
      'sidebar-width',
      'aside-width',
      'sidebar-open',
      'mobile-sidebar',
      'drawer-breakpoint'
    ];
  }

  private _layoutNode: HTMLElement | null = null;
  private _headerEl: HTMLElement | null = null;
  private _bodyEl: HTMLElement | null = null;
  private _footerEl: HTMLElement | null = null;
  private _sidebarPanel: HTMLElement | null = null;
  private _contentPanel: HTMLElement | null = null;
  private _asidePanel: HTMLElement | null = null;
  private _headerSlot: HTMLSlotElement | null = null;
  private _sidebarSlot: HTMLSlotElement | null = null;
  private _contentSlot: HTMLSlotElement | null = null;
  private _defaultSlot: HTMLSlotElement | null = null;
  private _asideSlot: HTMLSlotElement | null = null;
  private _footerSlot: HTMLSlotElement | null = null;
  private _lastLayoutSignature = '';
  private _media: MediaQueryList | null = null;
  private _mediaQuery = '';
  private _narrow = false;
  private _restoreFocus: HTMLElement | null = null;
  private _drawerWasOpen = false;

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onMediaChange = this._onMediaChange.bind(this);
    this._onHostKeyDown = this._onHostKeyDown.bind(this);
    this._onMenuTrigger = this._onMenuTrigger.bind(this);
    this._onRootClick = this._onRootClick.bind(this);
    this._onSidebarActivate = this._onSidebarActivate.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._watchViewport();
    this.addEventListener('keydown', this._onHostKeyDown);
    this.addEventListener('menu-trigger', this._onMenuTrigger);
    this.addEventListener('select', this._onSidebarActivate);
    this.addEventListener('click', this._onSidebarActivate);
    this.root.addEventListener('click', this._onRootClick);
    queueMicrotask(() => this._syncShell({ emit: false }));
  }

  override disconnectedCallback(): void {
    this._detachSlotHandlers();
    this._media?.removeEventListener?.('change', this._onMediaChange);
    this._media = null;
    this.removeEventListener('keydown', this._onHostKeyDown);
    this.removeEventListener('menu-trigger', this._onMenuTrigger);
    this.removeEventListener('select', this._onSidebarActivate);
    this.removeEventListener('click', this._onSidebarActivate);
    this.root.removeEventListener('click', this._onRootClick);
    super.disconnectedCallback();
  }

  /** True while the sidebar is an off-canvas drawer (narrow viewport and drawer behaviour on). */
  get drawerActive(): boolean {
    return this.hasAttribute('data-drawer');
  }

  get sidebarOpen(): boolean {
    return this.hasAttribute('sidebar-open');
  }

  set sidebarOpen(value: boolean) {
    this.toggleAttribute('sidebar-open', !!value);
  }

  openSidebar(): void {
    this._setSidebarOpen(true, 'api');
  }

  closeSidebar(): void {
    this._setSidebarOpen(false, 'api');
  }

  private _drawerWanted(): boolean {
    const mobile = this.getAttribute('mobile-sidebar');
    if (mobile === 'drawer') return true;
    if (mobile === 'stack') return false;
    return this.getAttribute('variant') === 'shell';
  }

  private _watchViewport(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const raw = Number(this.getAttribute('drawer-breakpoint'));
    const breakpoint = Number.isFinite(raw) && raw > 0 ? raw : 980;
    const query = `(max-width: ${breakpoint}px)`;
    if (this._media && this._mediaQuery === query) return;
    this._media?.removeEventListener?.('change', this._onMediaChange);
    this._mediaQuery = query;
    this._media = window.matchMedia(query);
    this._media.addEventListener?.('change', this._onMediaChange);
    this._narrow = !!this._media.matches;
  }

  private _onMediaChange(): void {
    this._narrow = !!this._media?.matches;
    this._syncShell({ emit: true });
  }

  private _setSidebarOpen(open: boolean, source: string): void {
    if (this.sidebarOpen === open) return;
    this.toggleAttribute('sidebar-open', open);
    this.dispatchEvent(new CustomEvent('sidebar-open-change', { detail: { open, source }, bubbles: true, composed: true }));
  }

  private _onMenuTrigger(): void {
    if (!this.drawerActive) return;
    this._setSidebarOpen(!this.sidebarOpen, 'menu');
  }

  private _onHostKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.drawerActive || !this.sidebarOpen || event.defaultPrevented) return;
    event.preventDefault();
    this._setSidebarOpen(false, 'escape');
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target?.classList?.contains('backdrop')) this._setSidebarOpen(false, 'backdrop');
  }

  // Picking a link or item in the drawer closes it, as navigation drawers do.
  private _onSidebarActivate(event: Event): void {
    if (!this.drawerActive || !this.sidebarOpen) return;
    const inSidebar = event.composedPath().some((node) => node instanceof HTMLElement && node.getAttribute('slot') === 'sidebar' && node.parentElement === this);
    if (!inSidebar) return;
    if (event.type === 'click') {
      const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement && node.hasAttribute('href'));
      if (!link) return;
    }
    this._setSidebarOpen(false, 'navigate');
  }

  private _syncDrawer(state: LayoutShellState): void {
    const drawer = this._drawerWanted() && this._narrow && state.hasSidebarContent;
    this.toggleAttribute('data-drawer', drawer);
    if (!drawer && this.sidebarOpen) this._setSidebarOpen(false, 'viewport');
    const open = drawer && this.sidebarOpen;
    const panel = this._sidebarPanel;
    if (panel) {
      if (drawer) {
        panel.hidden = false;
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-label', this.getAttribute('sidebar-label') || 'Navigation');
        panel.setAttribute('tabindex', '-1');
        if (!open) panel.setAttribute('inert', '');
        else panel.removeAttribute('inert');
      } else {
        panel.removeAttribute('role');
        panel.removeAttribute('aria-modal');
        panel.removeAttribute('aria-label');
        panel.removeAttribute('tabindex');
        panel.removeAttribute('inert');
      }
    }
    // While the drawer is open the rest of the shell is inert (a modal drawer).
    [this._headerEl, this._contentPanel, this._asidePanel, this._footerEl].forEach((el) => {
      if (!el) return;
      if (open) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });
    // Tell menu buttons in the header whether the drawer is open (aria-expanded).
    (this._headerSlot?.assignedElements({ flatten: true }) || []).forEach((el) => {
      const headers = el.matches('ui-app-header') ? [el] : Array.from(el.querySelectorAll('ui-app-header'));
      headers.forEach((header) => {
        if (drawer) header.setAttribute('menu-expanded', open ? 'true' : 'false');
        else header.removeAttribute('menu-expanded');
      });
    });

    // Focus moves into the drawer when it opens and back to where it was when it closes.
    if (open && !this._drawerWasOpen) {
      const active = deepActiveElement();
      this._restoreFocus = active && active !== document.body ? active : null;
      const target = firstFocusable(this._sidebarSlot) || panel;
      queueMicrotask(() => target?.focus({ preventScroll: true }));
    } else if (!open && this._drawerWasOpen) {
      const back = this._restoreFocus;
      this._restoreFocus = null;
      if (back?.isConnected) back.focus({ preventScroll: true });
    }
    this._drawerWasOpen = open;
  }

  collapse(): void {
    this.setAttribute('collapsed', '');
  }

  expand(): void {
    this.removeAttribute('collapsed');
  }

  toggleSidebar(): void {
    if (this.drawerActive) {
      this._setSidebarOpen(!this.sidebarOpen, 'api');
      return;
    }
    if (this.collapsed) this.expand();
    else this.collapse();
  }

  get collapsed(): boolean {
    return readBoolean(this.getAttribute('collapsed'));
  }

  set collapsed(value: boolean) {
    if (value) this.setAttribute('collapsed', '');
    else this.removeAttribute('collapsed');
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'drawer-breakpoint' && this.isConnected) this._watchViewport();
    if (name === 'variant' || name === 'density' || name === 'max-width' || name === 'headless') {
      super.attributeChangedCallback(name, oldValue, newValue);
      queueMicrotask(() => this._syncShell({ emit: false }));
      return;
    }

    queueMicrotask(() => this._syncShell({ emit: true }));
  }

  private _mode(): LayoutMode {
    const mode = this.getAttribute('mode');
    return mode === 'split' || mode === 'stack' ? mode : 'dashboard';
  }

  private _sidebarSide(): 'start' | 'end' {
    return this.getAttribute('sidebar-side') === 'end' ? 'end' : 'start';
  }

  private _attachSlotHandlers(): void {
    this._detachSlotHandlers();
    this._headerSlot = this.root.querySelector('slot[name="header"]');
    this._sidebarSlot = this.root.querySelector('slot[name="sidebar"]');
    this._contentSlot = this.root.querySelector('slot[name="content"]');
    this._defaultSlot = this.root.querySelector('slot:not([name])');
    this._asideSlot = this.root.querySelector('slot[name="aside"]');
    this._footerSlot = this.root.querySelector('slot[name="footer"]');

    [
      this._headerSlot,
      this._sidebarSlot,
      this._contentSlot,
      this._defaultSlot,
      this._asideSlot,
      this._footerSlot
    ].forEach((slot) => slot?.addEventListener('slotchange', this._onSlotChange as EventListener));
  }

  private _detachSlotHandlers(): void {
    [
      this._headerSlot,
      this._sidebarSlot,
      this._contentSlot,
      this._defaultSlot,
      this._asideSlot,
      this._footerSlot
    ].forEach((slot) => slot?.removeEventListener('slotchange', this._onSlotChange as EventListener));

    this._headerSlot = null;
    this._sidebarSlot = null;
    this._contentSlot = null;
    this._defaultSlot = null;
    this._asideSlot = null;
    this._footerSlot = null;
  }

  private _onSlotChange(): void {
    this._syncShell({ emit: true });
  }

  private _emitLayoutChange(detail: LayoutShellState): void {
    this.dispatchEvent(new CustomEvent('layoutchange', { detail, bubbles: true, composed: true }));
  }

  private _signature(state: LayoutShellState): string {
    return JSON.stringify(state);
  }

  private _computeShellState(): LayoutShellState | null {
    if (!this.isConnected || !this._layoutNode || !this._bodyEl) return null;

    const mode = this._mode();
    const sidebarSide = this._sidebarSide();
    const collapsed = this.collapsed;
    const hasHeader = hasSlotContent(this._headerSlot);
    const hasFooter = hasSlotContent(this._footerSlot);
    const hasSidebarContent = hasSlotContent(this._sidebarSlot);
    const hasAsideContent = hasSlotContent(this._asideSlot);
    const hasContent = hasSlotContent(this._contentSlot) || hasSlotContent(this._defaultSlot);
    const sidebarVisible = hasSidebarContent && (!collapsed || mode === 'stack') && !(mode === 'split' && hasAsideContent);
    const asideVisible = hasAsideContent;
    const bodyVisible = hasContent || sidebarVisible || asideVisible;
    const stack = mode === 'stack';

    let layout = 'content-only';
    if (!stack) {
      if (mode === 'split') {
        if (asideVisible && hasContent) layout = 'split-with-aside';
        else if (sidebarVisible && hasContent) layout = sidebarSide === 'end' ? 'split-with-sidebar-end' : 'split-with-sidebar-start';
      } else if (sidebarVisible && asideVisible) {
        layout = sidebarSide === 'end' ? 'dashboard-end' : 'dashboard-start';
      } else if (sidebarVisible) {
        layout = sidebarSide === 'end' ? 'dashboard-end-no-aside' : 'dashboard-start-no-aside';
      } else if (asideVisible) {
        layout = sidebarSide === 'end' ? 'dashboard-end-no-sidebar' : 'dashboard-start-no-sidebar';
      }
    }

    return {
      mode,
      sidebarSide,
      collapsed,
      hasHeader,
      hasFooter,
      hasSidebarContent,
      hasAsideContent,
      hasContent,
      sidebarVisible,
      asideVisible,
      bodyVisible,
      layout,
      stack,
      // In the shell the column follows the sidebar's own width (no gap before the divider).
      sidebarTrack: sidebarVisible
        ? normalizeTrackSize(this.getAttribute('sidebar-width'), this.getAttribute('variant') === 'shell' ? 'auto' : 'clamp(220px, 22vw, 320px)')
        : '0px',
      asideTrack: asideVisible ? normalizeTrackSize(this.getAttribute('aside-width'), 'clamp(240px, 26vw, 360px)') : '0px'
    };
  }

  private _syncShell(options: { emit: boolean }): void {
    const state = this._computeShellState();
    if (!state || !this._bodyEl) return;

    if (this._headerEl) this._headerEl.hidden = !state.hasHeader;
    if (this._footerEl) this._footerEl.hidden = !state.hasFooter;

    this.style.setProperty('--ui-layout-sidebar-track', state.sidebarTrack);
    this.style.setProperty('--ui-layout-aside-track', state.asideTrack);

    if (this._sidebarPanel) this._sidebarPanel.hidden = !state.sidebarVisible;
    if (this._contentPanel) this._contentPanel.hidden = !state.hasContent;
    if (this._asidePanel) this._asidePanel.hidden = !state.asideVisible;

    this._bodyEl.hidden = !state.bodyVisible;
    this._bodyEl.dataset.layout = state.layout;
    this._bodyEl.dataset.mode = state.mode;
    this._bodyEl.dataset.sidebarSide = state.sidebarSide;

    if (state.stack) {
      this._bodyEl.classList.add('stack');
    } else {
      this._bodyEl.classList.remove('stack');
    }

    this._syncDrawer(state);

    const signature = this._signature(state);
    if (options.emit && signature !== this._lastLayoutSignature) {
      this._emitLayoutChange(state);
    }
    this._lastLayoutSignature = signature;
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="layout" part="layout">
        <header class="header" part="header">
          <slot name="header"></slot>
        </header>
        <div class="body" part="body" data-layout="content-only">
          <section class="panel sidebar-panel" part="sidebar">
            <slot name="sidebar"></slot>
          </section>
          <div class="backdrop" part="backdrop" aria-hidden="true"></div>
          <section class="panel content-panel" part="content">
            <slot name="content"></slot>
            <slot></slot>
          </section>
          <section class="panel aside-panel" part="aside">
            <slot name="aside"></slot>
          </section>
        </div>
        <footer class="footer" part="footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    `);

    this._layoutNode = this.root.querySelector('.layout');
    this._headerEl = this.root.querySelector('.header');
    this._bodyEl = this.root.querySelector('.body');
    this._footerEl = this.root.querySelector('.footer');
    this._sidebarPanel = this.root.querySelector('.sidebar-panel');
    this._contentPanel = this.root.querySelector('.content-panel');
    this._asidePanel = this.root.querySelector('.aside-panel');
    this._attachSlotHandlers();
    queueMicrotask(() => this._syncShell({ emit: false }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-layout': UILayout;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-layout')) {
  customElements.define('ui-layout', UILayout);
}
