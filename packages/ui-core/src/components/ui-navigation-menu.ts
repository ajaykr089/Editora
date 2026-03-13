import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    position: relative;
    z-index: var(--ui-nav-z-index, 20);
    color-scheme: light dark;

    --ui-nav-gap: var(--base-navigation-menu-gap, 6px);
    --ui-nav-padding: var(--base-navigation-menu-padding, 6px);
    --ui-nav-radius: var(--base-navigation-menu-radius, var(--ui-radius, 4px));
    --ui-nav-bg: var(--base-navigation-menu-bg, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-nav-border: var(--base-navigation-menu-border, 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent));
    --ui-nav-shadow: var(--base-navigation-menu-shadow, var(--shadow-2, none));
    --ui-nav-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-nav-item-radius: var(--base-navigation-menu-item-radius, var(--radius-2, 4px));
    --ui-nav-item-min-height: var(--base-navigation-menu-item-height, 44px);
    --ui-nav-item-pad-x: var(--base-navigation-menu-item-padding-x, 12px);
    --ui-nav-item-pad-y: var(--base-navigation-menu-item-padding-y, 8px);
    --ui-nav-item-font-size: var(--base-navigation-menu-item-font-size, 14px);
    --ui-nav-item-font-weight: var(--base-navigation-menu-item-font-weight, 600);
    --ui-nav-item-line-height: var(--base-navigation-menu-item-line-height, 20px);
    --ui-nav-item-color: var(--ui-color-muted, var(--ui-muted, #475569));
    --ui-nav-item-hover-bg: color-mix(in srgb, var(--ui-nav-ring) 10%, transparent);
    --ui-nav-item-active-bg: color-mix(in srgb, var(--ui-nav-ring) 18%, transparent);
    --ui-nav-item-active-color: var(--accent-12, var(--ui-color-text, #0f172a));
    --ui-nav-panel-bg: var(--base-navigation-menu-panel-bg, var(--color-panel-solid, #ffffff));
    --ui-nav-panel-border: var(--base-navigation-menu-panel-border, 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent));
    --ui-nav-panel-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-nav-panel-radius: var(--base-navigation-menu-panel-radius, var(--ui-nav-radius));
    --ui-nav-panel-shadow: var(--base-navigation-menu-panel-shadow, var(--shadow-3, none));
    --ui-nav-panel-padding: var(--base-navigation-menu-panel-padding, 16px);
    --ui-nav-panel-min-width: min(100%, 720px);
    --ui-nav-panel-max-width: min(100%, 960px);
    --ui-nav-viewport-offset: 8px;
  }

  :host([data-open="true"]) {
    z-index: var(--ui-nav-z-index-open, 80);
  }

  .root {
    position: relative;
    display: grid;
    justify-items: center;
    align-content: start;
    gap: 0;
    isolation: isolate;
  }

  .bar {
    position: relative;
    display: grid;
    justify-items: center;
    width: 100%;
    z-index: 20;
  }

  .list {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--ui-nav-gap);
    width: max-content;
    max-width: 100%;
    padding: var(--ui-nav-padding);
    border: var(--ui-nav-border);
    border-radius: var(--ui-nav-radius);
    background: var(--ui-nav-bg);
    box-shadow: var(--ui-nav-shadow);
    box-sizing: border-box;
  }

  .indicator {
    position: absolute;
    left: 0;
    top: calc(100% + 1px);
    width: 100%;
    height: 14px;
    display: flex;
    justify-content: flex-start;
    pointer-events: none;
    overflow: visible;
    z-index: 40;
  }

  .indicator[hidden] {
    display: none;
  }

  .indicator-thumb {
    width: 12px;
    height: 12px;
    margin-left: var(--ui-nav-indicator-offset, 0px);
    background: var(--ui-nav-panel-bg);
    border: 1px solid var(--ui-nav-panel-border-color);
    border-radius: 3px;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(2, 6, 23, 0.08);
    transform: translateY(2px) rotate(45deg);
    transition: margin-left 200ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  :host([data-side="top"]) .indicator {
    top: auto;
    bottom: calc(100% + 1px);
  }

  :host([data-side="top"]) .indicator-thumb {
    transform: translateY(-2px) rotate(225deg);
  }

  .viewport-shell {
    position: absolute;
    top: calc(100% + var(--ui-nav-viewport-offset));
    left: 50%;
    width: min(var(--ui-nav-panel-max-width), 100%);
    min-width: min(100%, var(--ui-nav-panel-min-width));
    transform: translateX(-50%);
    z-index: 30;
  }

  :host([data-side="top"]) .viewport-shell {
    top: auto;
    bottom: calc(100% + var(--ui-nav-viewport-offset));
  }

  .viewport-shell[hidden] {
    display: none;
  }

  .viewport {
    position: relative;
    z-index: 30;
    min-width: 0;
    border: var(--ui-nav-panel-border);
    border-radius: var(--ui-nav-panel-radius);
    background: var(--ui-nav-panel-bg);
    box-shadow: var(--ui-nav-panel-shadow);
    padding: var(--ui-nav-panel-padding);
    box-sizing: border-box;
    overflow: visible;
  }

  ::slotted([slot="item"]) {
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: var(--ui-nav-item-min-height);
    padding: var(--ui-nav-item-pad-y) var(--ui-nav-item-pad-x);
    border: 1px solid transparent;
    border-radius: var(--ui-nav-item-radius);
    background: transparent;
    color: var(--ui-nav-item-color);
    font: var(--ui-nav-item-font-weight) var(--ui-nav-item-font-size)/var(--ui-nav-item-line-height) Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    letter-spacing: var(--ui-default-letter-spacing, 0em);
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    box-sizing: border-box;
    transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease, box-shadow 140ms ease;
  }

  ::slotted([slot="item"]:hover),
  ::slotted([slot="item"]:focus-visible) {
    background: var(--ui-nav-item-hover-bg);
  }

  ::slotted([slot="item"]:focus-visible) {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-nav-ring) 34%, transparent);
  }

  ::slotted([slot="item"][data-active="true"]) {
    background: var(--ui-nav-item-active-bg);
    color: var(--ui-nav-item-active-color);
    border-color: color-mix(in srgb, var(--ui-nav-ring) 28%, transparent);
  }

  ::slotted([slot="panel"]) {
    display: none;
    position: relative;
    z-index: 1;
    width: 100%;
    box-sizing: border-box;
  }

  ::slotted([slot="panel"][data-active="true"]) {
    display: block;
  }

  :host([orientation="vertical"]) .root {
    justify-items: stretch;
  }

  :host([orientation="vertical"]) .bar {
    justify-items: stretch;
  }

  :host([orientation="vertical"]) .list {
    display: grid;
    width: 100%;
  }

  :host([orientation="vertical"]) .viewport-shell {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    transform: none;
    margin-top: 10px;
  }

  :host([orientation="vertical"]) .indicator {
    display: none;
  }

  :host([variant="soft"]) {
    --ui-nav-bg: color-mix(in srgb, var(--base-navigation-menu-bg, var(--color-panel-solid, #ffffff)) 95%, var(--accent-surface, transparent));
    --ui-nav-panel-bg: color-mix(in srgb, var(--base-navigation-menu-panel-bg, var(--color-panel-solid, #ffffff)) 96%, var(--accent-surface, transparent));
  }

  :host([variant="solid"]) {
    --ui-nav-item-hover-bg: color-mix(in srgb, var(--ui-nav-ring) 14%, transparent);
    --ui-nav-item-active-bg: color-mix(in srgb, var(--ui-nav-ring) 24%, transparent);
  }

  :host([variant="outline"]) {
    --ui-nav-shadow: none;
    --ui-nav-panel-shadow: none;
  }

  :host([variant="flat"]) {
    --ui-nav-bg: transparent;
    --ui-nav-border: 1px solid transparent;
    --ui-nav-shadow: none;
    --ui-nav-panel-shadow: none;
  }

  :host([variant="contrast"]) {
    --ui-nav-bg: #0f172a;
    --ui-nav-border: 1px solid #334155;
    --ui-nav-shadow: none;
    --ui-nav-item-color: #cbd5e1;
    --ui-nav-item-hover-bg: color-mix(in srgb, #ffffff 14%, transparent);
    --ui-nav-item-active-bg: color-mix(in srgb, #ffffff 18%, transparent);
    --ui-nav-item-active-color: #ffffff;
    --ui-nav-panel-bg: #0f172a;
    --ui-nav-panel-border: 1px solid #334155;
    --ui-nav-panel-shadow: none;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-nav-gap: 4px;
    --ui-nav-padding: 4px;
    --ui-nav-item-radius: 6px;
    --ui-nav-item-min-height: 36px;
    --ui-nav-item-pad-x: 10px;
    --ui-nav-item-pad-y: 6px;
    --ui-nav-item-font-size: 13px;
    --ui-nav-item-line-height: 18px;
    --ui-nav-panel-padding: 12px;
    --ui-nav-panel-min-width: min(100%, 620px);
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-nav-gap: 8px;
    --ui-nav-padding: 8px;
    --ui-nav-item-radius: 10px;
    --ui-nav-item-min-height: 52px;
    --ui-nav-item-pad-x: 16px;
    --ui-nav-item-pad-y: 10px;
    --ui-nav-item-font-size: 15px;
    --ui-nav-item-line-height: 22px;
    --ui-nav-panel-padding: 18px;
    --ui-nav-panel-min-width: min(100%, 780px);
  }

  :host([elevation="none"]) {
    --ui-nav-shadow: none;
    --ui-nav-panel-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-nav-shadow: 0 14px 30px rgba(2, 6, 23, 0.08), 0 2px 8px rgba(2, 6, 23, 0.05);
    --ui-nav-panel-shadow: 0 20px 40px rgba(2, 6, 23, 0.12), 0 4px 12px rgba(2, 6, 23, 0.06);
  }

  :host([elevation="high"]) {
    --ui-nav-shadow: 0 24px 52px rgba(2, 6, 23, 0.18), 0 8px 18px rgba(2, 6, 23, 0.08);
    --ui-nav-panel-shadow: 0 28px 64px rgba(2, 6, 23, 0.24), 0 10px 24px rgba(2, 6, 23, 0.12);
  }

  :host([tone="neutral"]) {
    --ui-nav-ring: color-mix(in srgb, var(--ui-color-muted, #64748b) 60%, var(--ui-color-text, #0f172a));
  }

  :host([tone="info"]) {
    --ui-nav-ring: var(--ui-color-primary, var(--ui-primary, #2563eb));
  }

  :host([tone="success"]) {
    --ui-nav-ring: #16a34a;
    --ui-nav-item-active-color: #166534;
  }

  :host([tone="warning"]) {
    --ui-nav-ring: #d97706;
    --ui-nav-item-active-color: #92400e;
  }

  :host([tone="danger"]) {
    --ui-nav-ring: #ef4444;
    --ui-nav-item-active-color: #b91c1c;
  }

  :host([headless]) .list,
  :host([headless]) .indicator,
  :host([headless]) .viewport-shell {
    display: none !important;
  }

  @media (prefers-contrast: more) {
    .list,
    .viewport {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-nav-bg: Canvas;
      --ui-nav-border: 1px solid CanvasText;
      --ui-nav-shadow: none;
      --ui-nav-item-color: CanvasText;
      --ui-nav-item-hover-bg: Highlight;
      --ui-nav-item-active-bg: Highlight;
      --ui-nav-item-active-color: HighlightText;
      --ui-nav-panel-bg: Canvas;
      --ui-nav-panel-border: 1px solid CanvasText;
      --ui-nav-panel-shadow: none;
    }

    .list,
    .viewport {
      forced-color-adjust: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ::slotted([slot="item"]) {
      transition: none !important;
    }

    .indicator-thumb {
      transition: none !important;
    }
  }
`;

function clampIndex(value: number, length: number): number {
  if (length <= 0) return -1;
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value >= length) return length - 1;
  return value;
}

function normalizeRadius(value: string | null): string | null {
  if (!value || value === 'default') return null;
  if (value === 'none' || value === 'square') return '0px';
  if (value === 'sm') return '8px';
  if (value === 'md' || value === 'soft') return '12px';
  if (value === 'lg') return '16px';
  if (value === 'full') return '999px';
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) return value;
  return null;
}

export class UINavigationMenu extends ElementBase {
  private static readonly OPEN_EVENT = 'ui-navigation-menu:open';

  static get observedAttributes() {
    return ['selected', 'orientation', 'activation', 'headless', 'collapsible', 'loop', 'variant', 'size', 'radius', 'elevation', 'tone'];
  }

  private _items: HTMLElement[] = [];
  private _panels: HTMLElement[] = [];
  private _itemPanels: Array<HTMLElement | null> = [];
  private _ignoreSelectedAttribute = false;
  private _itemSlot: HTMLSlotElement | null = null;
  private _panelSlot: HTMLSlotElement | null = null;
  private _uid = Math.random().toString(36).slice(2, 8);
  private _closeTimer: number | null = null;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onPointerOver = this._onPointerOver.bind(this);
    this._onPointerEnter = this._onPointerEnter.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onDocumentPointerDown = this._onDocumentPointerDown.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onViewportEnvironmentChange = this._onViewportEnvironmentChange.bind(this);
    this._onPeerMenuOpen = this._onPeerMenuOpen.bind(this);
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'navigation');
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('pointerover', this._onPointerOver as EventListener);
    this.root.addEventListener('pointerenter', this._onPointerEnter as EventListener);
    this.root.addEventListener('pointerleave', this._onPointerLeave as EventListener);
    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.addEventListener('keydown', this._onDocumentKeyDown, true);
    document.addEventListener(UINavigationMenu.OPEN_EVENT, this._onPeerMenuOpen as EventListener);
    window.addEventListener('resize', this._onViewportEnvironmentChange, { passive: true });
    window.addEventListener('scroll', this._onViewportEnvironmentChange, { passive: true, capture: true });
    this._attachSlotHandlers();
    this._syncStructure();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('pointerover', this._onPointerOver as EventListener);
    this.root.removeEventListener('pointerenter', this._onPointerEnter as EventListener);
    this.root.removeEventListener('pointerleave', this._onPointerLeave as EventListener);
    document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.removeEventListener('keydown', this._onDocumentKeyDown, true);
    document.removeEventListener(UINavigationMenu.OPEN_EVENT, this._onPeerMenuOpen as EventListener);
    window.removeEventListener('resize', this._onViewportEnvironmentChange);
    window.removeEventListener('scroll', this._onViewportEnvironmentChange, true);
    this._detachSlotHandlers();
    this._clearCloseTimer();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'selected' && this._ignoreSelectedAttribute) return;
    if (oldValue === newValue) return;
    if (!this.isConnected) return;
    if (name === 'radius') {
      this._syncVisualState();
      return;
    }
    if (name === 'variant' || name === 'size' || name === 'elevation' || name === 'tone' || name === 'orientation') {
      if (name === 'orientation') this.requestRender();
      else this._syncVisualState();
      this._syncStructure();
      return;
    }
    this._syncStructure();
  }

  protected render() {
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="bar" part="bar">
          <div class="list" part="list" role="menubar" aria-orientation="${orientation}">
            <slot name="item"></slot>
          </div>
          <div class="indicator" part="indicator" hidden>
            <div class="indicator-thumb"></div>
          </div>
        </div>
        <div class="viewport-shell" part="viewport-shell" hidden>
          <div class="viewport" part="viewport">
            <slot name="panel"></slot>
          </div>
        </div>
      </div>
    `);
    this._syncVisualState();
    this._attachSlotHandlers();
    this._syncStructure();
  }

  private _syncVisualState() {
    const normalizedRadius = normalizeRadius(this.getAttribute('radius'));
    if (normalizedRadius) {
      this.style.setProperty('--ui-nav-radius', normalizedRadius);
      this.style.setProperty('--ui-nav-item-radius', normalizedRadius === '999px' ? '999px' : `max(0px, calc(${normalizedRadius} - 2px))`);
      this.style.setProperty('--ui-nav-panel-radius', normalizedRadius);
    } else {
      this.style.removeProperty('--ui-nav-radius');
      this.style.removeProperty('--ui-nav-item-radius');
      this.style.removeProperty('--ui-nav-panel-radius');
    }
  }

  private _attachSlotHandlers() {
    const itemSlot = this.root.querySelector('slot[name="item"]') as HTMLSlotElement | null;
    const panelSlot = this.root.querySelector('slot[name="panel"]') as HTMLSlotElement | null;

    if (this._itemSlot && this._itemSlot !== itemSlot) {
      this._itemSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (this._panelSlot && this._panelSlot !== panelSlot) {
      this._panelSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }

    if (itemSlot && this._itemSlot !== itemSlot) {
      itemSlot.addEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (panelSlot && this._panelSlot !== panelSlot) {
      panelSlot.addEventListener('slotchange', this._onSlotChange as EventListener);
    }

    this._itemSlot = itemSlot;
    this._panelSlot = panelSlot;
  }

  private _detachSlotHandlers() {
    if (this._itemSlot) this._itemSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    if (this._panelSlot) this._panelSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._itemSlot = null;
    this._panelSlot = null;
  }

  private _onSlotChange() {
    this._syncStructure();
  }

  private _onViewportEnvironmentChange() {
    this._syncViewportSide(this._getSelectedFromAttribute());
  }

  private _onPeerMenuOpen(event: Event) {
    const detail = (event as CustomEvent<{ uid: string }>).detail;
    if (!detail || detail.uid === this._uid) return;
    if (this._getSelectedFromAttribute() >= 0) {
      this._selectIndex(-1, 'programmatic');
    }
  }

  private _getSelectedFromAttribute(): number {
    const raw = this.getAttribute('selected');
    if (raw == null || raw === '') return -1;
    const next = Number(raw);
    if (Number.isNaN(next)) return -1;
    if (next < 0) return -1;
    return clampIndex(next, this._items.length);
  }

  private _setSelectedAttribute(index: number) {
    this._ignoreSelectedAttribute = true;
    if (index < 0) this.setAttribute('selected', '-1');
    else this.setAttribute('selected', String(index));
    this._ignoreSelectedAttribute = false;
  }

  private _activationMode(): 'automatic' | 'manual' {
    return this.getAttribute('activation') === 'manual' ? 'manual' : 'automatic';
  }

  private _loopEnabled(): boolean {
    const raw = this.getAttribute('loop');
    if (raw == null) return true;
    const normalized = String(raw).toLowerCase();
    return normalized !== 'false' && normalized !== '0';
  }

  private _syncStructure() {
    const itemSlot = this.root.querySelector('slot[name="item"]') as HTMLSlotElement | null;
    const panelSlot = this.root.querySelector('slot[name="panel"]') as HTMLSlotElement | null;
    this._items = itemSlot ? (itemSlot.assignedElements({ flatten: true }) as HTMLElement[]) : [];
    this._panels = panelSlot ? (panelSlot.assignedElements({ flatten: true }) as HTMLElement[]) : [];

    const panelsByKey = new Map<string, HTMLElement>();
    this._panels.forEach((panel, index) => {
      const key = panel.getAttribute('data-nav-panel-for') || panel.getAttribute('data-nav-key') || String(index);
      panelsByKey.set(key, panel);
    });

    this._itemPanels = this._items.map((item, index) => {
      const key = item.getAttribute('data-nav-key') || String(index);
      return panelsByKey.get(key) ?? this._panels[index] ?? null;
    });

    const selectedIndex = this._getSelectedFromAttribute();
    const currentTabIndex = selectedIndex >= 0 ? selectedIndex : (this._items.length > 0 ? 0 : -1);
    const viewportShell = this.root.querySelector('.viewport-shell') as HTMLElement | null;

    this._items.forEach((item, index) => {
      const panel = this._itemPanels[index];
      const active = selectedIndex === index;
      const itemId = item.id || `ui-navigation-menu-item-${this._uid}-${index}`;
      const panelId = panel ? panel.id || `ui-navigation-menu-panel-${this._uid}-${index}` : '';

      item.id = itemId;
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', index === currentTabIndex ? '0' : '-1');
      item.setAttribute('data-active', active ? 'true' : 'false');
      if (panelId) {
        item.setAttribute('aria-haspopup', 'dialog');
        item.setAttribute('aria-controls', panelId);
        item.setAttribute('aria-expanded', active ? 'true' : 'false');
      } else {
        item.removeAttribute('aria-haspopup');
        item.removeAttribute('aria-controls');
        item.removeAttribute('aria-expanded');
      }
    });

    this._panels.forEach((panel, index) => {
      const matchedIndex = this._itemPanels.findIndex((entry) => entry === panel);
      const active = matchedIndex >= 0 && selectedIndex === matchedIndex;
      const item = matchedIndex >= 0 ? this._items[matchedIndex] : null;
      const panelId = panel.id || `ui-navigation-menu-panel-${this._uid}-${index}`;

      panel.id = panelId;
      panel.setAttribute('role', 'group');
      if (item?.id) panel.setAttribute('aria-labelledby', item.id);
      else panel.removeAttribute('aria-labelledby');
      panel.setAttribute('aria-hidden', active ? 'false' : 'true');
      panel.setAttribute('data-active', active ? 'true' : 'false');
      if (active) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });

    if (viewportShell) {
      const hasActivePanel = selectedIndex >= 0 && !!this._itemPanels[selectedIndex];
      if (hasActivePanel) viewportShell.removeAttribute('hidden');
      else viewportShell.setAttribute('hidden', '');
      if (hasActivePanel) this.setAttribute('data-open', 'true');
      else this.removeAttribute('data-open');
    } else {
      this.removeAttribute('data-open');
    }

    this._syncIndicator(selectedIndex);
    this._syncViewportSide(selectedIndex);
  }

  private _syncIndicator(selectedIndex: number) {
    const indicator = this.root.querySelector('.indicator') as HTMLElement | null;
    const list = this.root.querySelector('.list') as HTMLElement | null;
    const bar = this.root.querySelector('.bar') as HTMLElement | null;
    if (!indicator || !list || !bar) return;

    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    if (orientation === 'vertical' || selectedIndex < 0 || !this._itemPanels[selectedIndex] || !this._items[selectedIndex]) {
      indicator.setAttribute('hidden', '');
      this.style.removeProperty('--ui-nav-indicator-offset');
      return;
    }

    indicator.removeAttribute('hidden');
    const activeItem = this._items[selectedIndex];
    queueMicrotask(() => {
      const barRect = bar.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const offset = listRect.left - barRect.left + (itemRect.left - listRect.left) + itemRect.width / 2 - 6;
      this.style.setProperty('--ui-nav-indicator-offset', `${Math.max(0, offset)}px`);
    });
  }

  private _syncViewportSide(selectedIndex: number) {
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    if (orientation === 'vertical') {
      this.removeAttribute('data-side');
      return;
    }

    const viewportShell = this.root.querySelector('.viewport-shell') as HTMLElement | null;
    const viewport = this.root.querySelector('.viewport') as HTMLElement | null;
    const bar = this.root.querySelector('.bar') as HTMLElement | null;
    if (!viewportShell || !viewport || !bar) return;

    const hasActivePanel = selectedIndex >= 0 && !!this._itemPanels[selectedIndex];
    if (!hasActivePanel || viewportShell.hasAttribute('hidden')) {
      this.removeAttribute('data-side');
      return;
    }

    queueMicrotask(() => {
      if (!this.isConnected) return;
      const offset = parseFloat(getComputedStyle(this).getPropertyValue('--ui-nav-viewport-offset')) || 8;
      const safeMargin = 12;
      const barRect = bar.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const panelHeight = Math.max(viewportRect.height, viewport.scrollHeight);
      const availableBelow = window.innerHeight - barRect.bottom - offset - safeMargin;
      const availableAbove = barRect.top - offset - safeMargin;
      const openTop = panelHeight > availableBelow && availableAbove > availableBelow;
      this.setAttribute('data-side', openTop ? 'top' : 'bottom');
    });
  }

  private _selectIndex(index: number, reason: 'click' | 'keyboard' | 'programmatic') {
    const previous = this._getSelectedFromAttribute();
    const next = index < 0 ? -1 : clampIndex(index, this._items.length);
    if (next === previous) return;
    const hasPanel = next >= 0 && !!this._itemPanels[next];
    this._setSelectedAttribute(next);
    this._syncStructure();
    if (hasPanel) {
      document.dispatchEvent(
        new CustomEvent(UINavigationMenu.OPEN_EVENT, {
          detail: { uid: this._uid }
        })
      );
    }
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { selected: next, previous, reason },
        bubbles: true
      })
    );
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { selected: next, previous, reason },
        bubbles: true
      })
    );
  }

  private _focusItem(index: number) {
    const item = this._items[index];
    if (!item) return;
    try {
      item.focus();
    } catch {}
  }

  private _clearCloseTimer() {
    if (this._closeTimer != null) {
      window.clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  private _scheduleClose() {
    this._clearCloseTimer();
    this._closeTimer = window.setTimeout(() => {
      this._selectIndex(-1, 'programmatic');
      this._closeTimer = null;
    }, 120);
  }

  private _onPointerEnter() {
    this._clearCloseTimer();
  }

  private _onPointerLeave() {
    if (this._activationMode() === 'automatic') this._scheduleClose();
  }

  private _onDocumentPointerDown(event: PointerEvent) {
    if (!this.isConnected) return;
    if (!this.shadowRoot) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    if (this._getSelectedFromAttribute() >= 0) this._selectIndex(-1, 'programmatic');
  }

  private _onDocumentKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    const selectedIndex = this._getSelectedFromAttribute();
    if (selectedIndex < 0) return;
    this._selectIndex(-1, 'keyboard');
    this._focusItem(selectedIndex);
  }

  private _onClick(event: MouseEvent) {
    const path = event.composedPath();
    const itemIndex = this._items.findIndex((item) => path.includes(item));
    if (itemIndex < 0) return;

    const hasPanel = !!this._itemPanels[itemIndex];
    const selectedIndex = this._getSelectedFromAttribute();
    const collapsible = this.hasAttribute('collapsible');

    if (hasPanel) {
      if (collapsible && selectedIndex === itemIndex) this._selectIndex(-1, 'click');
      else this._selectIndex(itemIndex, 'click');
      return;
    }

    this._selectIndex(itemIndex, 'click');
  }

  private _onPointerOver(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    if (this._activationMode() !== 'automatic') return;
    const path = event.composedPath();
    const itemIndex = this._items.findIndex((item) => path.includes(item));
    if (itemIndex < 0) return;
    if (this._getSelectedFromAttribute() === itemIndex) return;
    this._selectIndex(itemIndex, 'programmatic');
  }

  private _moveFocus(current: number, delta: number): number {
    if (this._items.length === 0) return -1;
    const loop = this._loopEnabled();
    let next = current + delta;
    if (next < 0) next = loop ? this._items.length - 1 : 0;
    if (next >= this._items.length) next = loop ? 0 : this._items.length - 1;
    return next;
  }

  private _onKeyDown(event: KeyboardEvent) {
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    const focusIndex = this._items.findIndex((item) => item === (event.target as Node) || item.contains(event.target as Node));
    if (focusIndex < 0) return;

    const activation = this._activationMode();
    let handled = false;
    let nextFocus = focusIndex;

    if (orientation === 'horizontal') {
      if (event.key === 'ArrowRight') {
        nextFocus = this._moveFocus(focusIndex, 1);
        handled = true;
      } else if (event.key === 'ArrowLeft') {
        nextFocus = this._moveFocus(focusIndex, -1);
        handled = true;
      } else if (event.key === 'ArrowDown' && this._itemPanels[focusIndex]) {
        this._selectIndex(focusIndex, 'keyboard');
        handled = true;
      }
    } else {
      if (event.key === 'ArrowDown') {
        nextFocus = this._moveFocus(focusIndex, 1);
        handled = true;
      } else if (event.key === 'ArrowUp') {
        nextFocus = this._moveFocus(focusIndex, -1);
        handled = true;
      } else if (event.key === 'ArrowRight' && this._itemPanels[focusIndex]) {
        this._selectIndex(focusIndex, 'keyboard');
        handled = true;
      }
    }

    if (event.key === 'Home') {
      nextFocus = this._items.length > 0 ? 0 : -1;
      handled = true;
    }

    if (event.key === 'End') {
      nextFocus = this._items.length > 0 ? this._items.length - 1 : -1;
      handled = true;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      this._selectIndex(focusIndex, 'keyboard');
      handled = true;
    }

    if (event.key === 'Escape') {
      this._selectIndex(-1, 'keyboard');
      handled = true;
    }

    if (!handled) return;

    event.preventDefault();
    if (nextFocus >= 0 && nextFocus !== focusIndex) {
      this._focusItem(nextFocus);
      if (activation === 'automatic') this._selectIndex(nextFocus, 'keyboard');
      else {
        this._items.forEach((item, index) => {
          item.setAttribute('tabindex', index === nextFocus ? '0' : '-1');
        });
      }
    } else if (nextFocus === focusIndex && activation === 'manual') {
      this._items.forEach((item, index) => {
        item.setAttribute('tabindex', index === focusIndex ? '0' : '-1');
      });
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-navigation-menu')) {
  customElements.define('ui-navigation-menu', UINavigationMenu);
}
