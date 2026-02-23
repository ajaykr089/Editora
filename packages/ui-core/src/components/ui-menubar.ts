import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

type MenubarReason = 'click' | 'keyboard' | 'programmatic';
type PanelPlacement = 'top' | 'bottom' | 'left' | 'right';
type MenubarItem = HTMLElement;
type PanelItem = HTMLElement & { disabled?: boolean };

const hostStyle = `
  :host {
    --ui-menubar-gap: 6px;
    --ui-menubar-padding: 6px;
    --ui-menubar-radius: 14px;
    --ui-menubar-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 90%, #e2e8f0 10%);
    --ui-menubar-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 86%, transparent);
    --ui-menubar-shadow:
      0 16px 40px rgba(2, 6, 23, 0.1),
      0 2px 8px rgba(2, 6, 23, 0.06);
    --ui-menubar-item-radius: 10px;
    --ui-menubar-item-padding: 8px 12px;
    --ui-menubar-item-font-size: 13px;
    --ui-menubar-item-weight: 600;
    --ui-menubar-item-color: #334155;
    --ui-menubar-item-hover-bg: rgba(15, 23, 42, 0.08);
    --ui-menubar-item-active-bg: color-mix(in srgb, #2563eb 18%, transparent);
    --ui-menubar-item-active-color: #1d4ed8;
    --ui-menubar-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-menubar-panel-bg: var(--ui-color-surface, #ffffff);
    --ui-menubar-panel-color: var(--ui-color-text, #0f172a);
    --ui-menubar-panel-border-color: color-mix(in srgb, #0f172a 14%, transparent);
    --ui-menubar-panel-border: 1px solid var(--ui-menubar-panel-border-color);
    --ui-menubar-panel-shadow:
      0 26px 58px rgba(2, 6, 23, 0.22),
      0 3px 12px rgba(2, 6, 23, 0.1);
    --ui-menubar-panel-radius: 12px;
    --ui-menubar-panel-padding: 6px;
    --ui-menubar-panel-min-width: 220px;
    --ui-menubar-z: 1570;
    color-scheme: light dark;
    display: inline-block;
    position: relative;
  }

  :host([headless]) .bar {
    display: none !important;
  }

  .bar {
    display: inline-flex;
    align-items: center;
    gap: var(--ui-menubar-gap);
    padding: var(--ui-menubar-padding);
    border-radius: var(--ui-menubar-radius);
    background: var(--ui-menubar-bg);
    border: var(--ui-menubar-border);
    box-shadow: var(--ui-menubar-shadow);
    backdrop-filter: saturate(1.08) blur(10px);
    position: relative;
  }

  :host([orientation="vertical"]) .bar {
    display: inline-grid;
    justify-items: stretch;
    min-width: 180px;
  }

  :host([variant="flat"]) .bar,
  :host([variant="line"]) .bar {
    box-shadow: none;
  }

  :host([variant="line"]) .bar {
    border-color: color-mix(in srgb, var(--ui-menubar-item-color, #334155) 26%, transparent);
  }

  :host([variant="glass"]) .bar {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-menubar-bg, #fff) 90%, #ffffff 10%),
        color-mix(in srgb, var(--ui-menubar-bg, #fff) 96%, transparent)
      ),
      var(--ui-menubar-bg, #fff);
    backdrop-filter: blur(14px) saturate(1.08);
  }

  :host([variant="contrast"]) .bar {
    --ui-menubar-bg: #0f172a;
    --ui-menubar-item-color: #e2e8f0;
    --ui-menubar-item-hover-bg: color-mix(in srgb, #ffffff 16%, transparent);
    --ui-menubar-item-active-bg: color-mix(in srgb, #ffffff 20%, transparent);
    --ui-menubar-item-active-color: #ffffff;
    --ui-menubar-ring: #93c5fd;
    border-color: #334155;
  }

  :host([density="compact"]) {
    --ui-menubar-gap: 4px;
    --ui-menubar-padding: 4px;
    --ui-menubar-item-radius: 8px;
    --ui-menubar-item-padding: 6px 9px;
    --ui-menubar-item-font-size: 12px;
    --ui-menubar-panel-padding: 4px;
    --ui-menubar-panel-radius: 10px;
  }

  :host([density="comfortable"]) {
    --ui-menubar-gap: 8px;
    --ui-menubar-padding: 7px;
    --ui-menubar-item-radius: 11px;
    --ui-menubar-item-padding: 9px 14px;
    --ui-menubar-item-font-size: 14px;
    --ui-menubar-panel-padding: 8px;
    --ui-menubar-panel-radius: 14px;
  }

  :host([shape="square"]) {
    --ui-menubar-radius: 4px;
    --ui-menubar-item-radius: 3px;
    --ui-menubar-panel-radius: 4px;
  }

  :host([shape="soft"]) {
    --ui-menubar-radius: 18px;
    --ui-menubar-item-radius: 13px;
    --ui-menubar-panel-radius: 18px;
  }

  :host([elevation="none"]) .bar {
    box-shadow: none;
  }

  :host([elevation="high"]) .bar {
    --ui-menubar-shadow:
      0 24px 56px rgba(2, 6, 23, 0.14),
      0 3px 12px rgba(2, 6, 23, 0.08);
  }

  :host([tone="danger"]) {
    --ui-menubar-ring: #ef4444;
    --ui-menubar-item-active-bg: color-mix(in srgb, #ef4444 18%, transparent);
    --ui-menubar-item-active-color: #b91c1c;
  }

  :host([tone="success"]) {
    --ui-menubar-ring: #16a34a;
    --ui-menubar-item-active-bg: color-mix(in srgb, #16a34a 18%, transparent);
    --ui-menubar-item-active-color: #166534;
  }

  :host([tone="warning"]) {
    --ui-menubar-ring: #d97706;
    --ui-menubar-item-active-bg: color-mix(in srgb, #f59e0b 20%, transparent);
    --ui-menubar-item-active-color: #b45309;
  }

  ::slotted([slot="item"]) {
    appearance: none;
    border: 0;
    background: transparent;
    border-radius: var(--ui-menubar-item-radius);
    padding: var(--ui-menubar-item-padding);
    color: var(--ui-menubar-item-color);
    font-size: var(--ui-menubar-item-font-size);
    font-weight: var(--ui-menubar-item-weight);
    line-height: 1.35;
    letter-spacing: 0.01em;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    outline: none;
    transition: background-color 120ms ease, color 120ms ease, transform 120ms ease;
  }

  ::slotted([slot="item"]:hover),
  ::slotted([slot="item"]:focus-visible) {
    background: var(--ui-menubar-item-hover-bg);
  }

  ::slotted([slot="item"][data-active="true"]) {
    background: var(--ui-menubar-item-active-bg);
    color: var(--ui-menubar-item-active-color);
  }

  ::slotted([slot="item"]:focus-visible) {
    box-shadow: inset 0 0 0 2px var(--ui-menubar-ring);
  }

  .content-slot {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    ::slotted([slot="item"]) {
      transition: none !important;
    }
  }

  @media (forced-colors: active) {
    .bar {
      forced-color-adjust: none;
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }

    ::slotted([slot="item"]) {
      forced-color-adjust: none;
      border: 1px solid transparent;
      background: Canvas;
      color: CanvasText;
    }

    ::slotted([slot="item"]:hover),
    ::slotted([slot="item"]:focus-visible),
    ::slotted([slot="item"][data-active="true"]) {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
    }
  }
`;

const panelStyle = `
  .menu-panel {
    --ui-menubar-panel-item-radius: 8px;
    --ui-menubar-panel-item-gap: 10px;
    --ui-menubar-panel-item-min-height: 36px;
    --ui-menubar-panel-item-pad-y: 8px;
    --ui-menubar-panel-item-pad-x: 11px;
    --ui-menubar-panel-item-font-size: 13px;
    --ui-menubar-panel-item-font-weight: 500;
    --ui-menubar-panel-item-line-height: 1.3;
    --ui-menubar-panel-separator-margin: 6px 10px;
    --ui-menubar-panel-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-menubar-ring, #2563eb) 16%, transparent),
        color-mix(in srgb, var(--ui-menubar-ring, #2563eb) 10%, transparent)
      );
    --ui-menubar-panel-item-active-bg: color-mix(in srgb, var(--ui-menubar-ring, #2563eb) 18%, transparent);
    position: absolute;
    display: grid;
    gap: 1px;
    min-width: var(--ui-menubar-panel-min-width, 220px);
    max-width: min(420px, calc(100vw - 16px));
    max-height: min(440px, calc(100vh - 16px));
    overflow: auto;
    isolation: isolate;
    padding: var(--ui-menubar-panel-padding, 6px);
    box-sizing: border-box;
    border: var(--ui-menubar-panel-border, 1px solid rgba(15, 23, 42, 0.14));
    border-radius: var(--ui-menubar-panel-radius, 12px);
    background: var(--ui-menubar-panel-bg, #fff);
    color: var(--ui-menubar-panel-color, #0f172a);
    box-shadow: var(--ui-menubar-panel-shadow, 0 26px 58px rgba(2, 6, 23, 0.22));
    backdrop-filter: var(--ui-menubar-panel-backdrop, none);
    opacity: 0;
    transform: translateY(5px) scale(0.984);
    transform-origin: top left;
    animation: ui-menubar-panel-enter 160ms cubic-bezier(0.2, 0.9, 0.24, 1) forwards;
    outline: none;
    scrollbar-gutter: stable both-edges;
    will-change: transform, opacity;
    z-index: var(--ui-menubar-z, 1570);
  }

  .menu-panel[data-placement="top"] {
    transform-origin: bottom left;
  }

  .menu-panel[data-placement="left"] {
    transform-origin: center right;
  }

  .menu-panel[data-placement="right"] {
    transform-origin: center left;
  }

  .menu-panel[data-variant="flat"],
  .menu-panel[data-variant="line"] {
    box-shadow: none;
  }

  .menu-panel[data-variant="line"] {
    border-color: color-mix(in srgb, var(--ui-menubar-panel-color, #0f172a) 26%, transparent);
  }

  .menu-panel[data-variant="glass"] {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-menubar-panel-bg, #fff) 88%, #ffffff 12%),
        color-mix(in srgb, var(--ui-menubar-panel-bg, #fff) 92%, transparent)
      ),
      var(--ui-menubar-panel-bg, #fff);
    --ui-menubar-panel-backdrop: blur(14px) saturate(1.08);
  }

  .menu-panel[data-variant="contrast"] {
    --ui-menubar-panel-bg: #0f172a;
    --ui-menubar-panel-color: #f8fafc;
    --ui-menubar-panel-border-color: #334155;
    --ui-menubar-panel-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #ffffff 18%, transparent),
        color-mix(in srgb, #ffffff 10%, transparent)
      );
    --ui-menubar-panel-item-active-bg: color-mix(in srgb, #ffffff 18%, transparent);
  }

  .menu-panel[data-density="compact"] {
    --ui-menubar-panel-padding: 4px;
    --ui-menubar-panel-item-radius: 6px;
    --ui-menubar-panel-item-gap: 8px;
    --ui-menubar-panel-item-min-height: 30px;
    --ui-menubar-panel-item-pad-y: 5px;
    --ui-menubar-panel-item-pad-x: 9px;
    --ui-menubar-panel-item-font-size: 12px;
    --ui-menubar-panel-separator-margin: 4px 8px;
  }

  .menu-panel[data-density="comfortable"] {
    --ui-menubar-panel-padding: 8px;
    --ui-menubar-panel-item-radius: 10px;
    --ui-menubar-panel-item-gap: 12px;
    --ui-menubar-panel-item-min-height: 40px;
    --ui-menubar-panel-item-pad-y: 9px;
    --ui-menubar-panel-item-pad-x: 13px;
    --ui-menubar-panel-item-font-size: 14px;
    --ui-menubar-panel-separator-margin: 7px 11px;
  }

  .menu-panel[data-shape="square"] {
    --ui-menubar-panel-radius: 4px;
    --ui-menubar-panel-item-radius: 3px;
  }

  .menu-panel[data-shape="soft"] {
    --ui-menubar-panel-radius: 18px;
    --ui-menubar-panel-item-radius: 12px;
  }

  .menu-panel[data-elevation="none"] {
    box-shadow: none;
  }

  .menu-panel[data-elevation="low"] {
    --ui-menubar-panel-shadow:
      0 14px 30px rgba(2, 6, 23, 0.17),
      0 2px 7px rgba(2, 6, 23, 0.08);
  }

  .menu-panel[data-elevation="high"] {
    --ui-menubar-panel-shadow:
      0 32px 72px rgba(2, 6, 23, 0.28),
      0 6px 18px rgba(2, 6, 23, 0.14);
  }

  .menu-panel [role="menuitem"],
  .menu-panel [role="menuitemcheckbox"],
  .menu-panel [role="menuitemradio"],
  .menu-panel .item,
  .menu-panel [data-menu-item] {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    column-gap: var(--ui-menubar-panel-item-gap, 10px);
    min-height: var(--ui-menubar-panel-item-min-height, 36px);
    width: 100%;
    min-width: 0;
    max-width: 100%;
    padding: var(--ui-menubar-panel-item-pad-y, 8px) var(--ui-menubar-panel-item-pad-x, 11px);
    box-sizing: border-box;
    border: 0;
    border-radius: var(--ui-menubar-panel-item-radius, 8px);
    background: transparent;
    color: inherit;
    font: var(--ui-menubar-panel-item-font-weight, 500) var(--ui-menubar-panel-item-font-size, 13px)/var(--ui-menubar-panel-item-line-height, 1.3) -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: 0.01em;
    text-align: left;
    cursor: default;
    outline: none;
    user-select: none;
    white-space: nowrap;
    position: relative;
    transition: background-color 130ms ease, color 130ms ease, transform 130ms ease;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  .menu-panel [role="menuitem"]:hover,
  .menu-panel [role="menuitem"]:focus-visible,
  .menu-panel [role="menuitemcheckbox"]:hover,
  .menu-panel [role="menuitemcheckbox"]:focus-visible,
  .menu-panel [role="menuitemradio"]:hover,
  .menu-panel [role="menuitemradio"]:focus-visible,
  .menu-panel .item:hover,
  .menu-panel .item:focus-visible,
  .menu-panel [data-menu-item]:hover,
  .menu-panel [data-menu-item]:focus-visible {
    background: var(--ui-menubar-panel-item-hover-bg);
  }

  .menu-panel [role="menuitem"]:not([aria-disabled="true"]):active,
  .menu-panel [role="menuitemcheckbox"]:not([aria-disabled="true"]):active,
  .menu-panel [role="menuitemradio"]:not([aria-disabled="true"]):active,
  .menu-panel .item:not([aria-disabled="true"]):active,
  .menu-panel [data-menu-item]:not([aria-disabled="true"]):active {
    background: var(--ui-menubar-panel-item-active-bg);
    transform: translateY(1px);
  }

  .menu-panel [role="menuitem"]:focus-visible,
  .menu-panel [role="menuitemcheckbox"]:focus-visible,
  .menu-panel [role="menuitemradio"]:focus-visible,
  .menu-panel .item:focus-visible,
  .menu-panel [data-menu-item]:focus-visible {
    box-shadow: inset 0 0 0 2px var(--ui-menubar-ring, #2563eb);
  }

  .menu-panel [role="menuitemcheckbox"][aria-checked="true"],
  .menu-panel [role="menuitemradio"][aria-checked="true"] {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-menubar-ring, #2563eb) 22%, transparent),
        color-mix(in srgb, var(--ui-menubar-ring, #2563eb) 12%, transparent)
      );
  }

  .menu-panel [aria-disabled="true"],
  .menu-panel [disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  .menu-panel [role="separator"],
  .menu-panel .separator {
    height: 1px;
    margin: var(--ui-menubar-panel-separator-margin, 6px 10px);
    border: 0;
    background: color-mix(in srgb, currentColor 18%, transparent);
  }

  .menu-panel .empty-state {
    padding: 10px 12px;
    font: 500 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: 0.01em;
    opacity: 0.72;
  }

  @keyframes ui-menubar-panel-enter {
    from {
      opacity: 0;
      transform: translateY(5px) scale(0.984);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .menu-panel {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-contrast: more) {
    .menu-panel {
      border-width: 2px;
      box-shadow: none;
    }
  }
`;

function normalizePlacement(value: string | null): PanelPlacement {
  if (value === 'top' || value === 'left' || value === 'right') return value;
  return 'bottom';
}

function toBooleanAttribute(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function clampIndex(index: number, length: number): number {
  if (length <= 0) return -1;
  if (Number.isNaN(index)) return 0;
  if (index < 0) return 0;
  if (index >= length) return length - 1;
  return index;
}

function panelItemSelector(): string {
  return [
    '[role="menuitem"]',
    '[role="menuitemcheckbox"]',
    '[role="menuitemradio"]',
    '.item',
    '[data-menu-item]'
  ].join(', ');
}

function isDisabledPanelItem(item: PanelItem): boolean {
  return item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true' || !!item.disabled;
}

function readVariantValue(host: HTMLElement, name: string): string {
  return host.getAttribute(name) || '';
}

export class UIMenubar extends ElementBase {
  static get observedAttributes() {
    return [
      'selected',
      'open',
      'headless',
      'loop',
      'orientation',
      'variant',
      'density',
      'shape',
      'elevation',
      'tone',
      'placement',
      'close-on-select',
      'typeahead'
    ];
  }

  private _items: MenubarItem[] = [];
  private _contents: HTMLElement[] = [];
  private _itemSlot: HTMLSlotElement | null = null;
  private _contentSlot: HTMLSlotElement | null = null;
  private _uid = Math.random().toString(36).slice(2, 8);
  private _ignoreSelected = false;
  private _open = false;
  private _cleanup: (() => void) | null = null;
  private _portalEl: HTMLElement | null = null;
  private _panelForIndex = -1;
  private _typeaheadBuffer = '';
  private _typeaheadTimer: number | null = null;
  private _globalListenersBound = false;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onDocPointerDown = this._onDocPointerDown.bind(this);
    this._onDocKeyDown = this._onDocKeyDown.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('mousemove', this._onMouseMove as EventListener);
    this._attachSlotListeners();
    this._syncState();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('mousemove', this._onMouseMove as EventListener);
    this._unbindGlobalListeners();
    this._detachSlotListeners();
    this._teardownPanel();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'selected' && this._ignoreSelected) return;
    this._syncBarA11y();
    if (
      this._open &&
      (name === 'placement' ||
        name === 'variant' ||
        name === 'density' ||
        name === 'shape' ||
        name === 'elevation' ||
        name === 'tone')
    ) {
      this._rebuildPanel();
      return;
    }
    this._syncState();
  }

  protected render(): void {
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    this.setContent(`
      <style>${hostStyle}</style>
      <div class="bar" part="bar" role="menubar" aria-orientation="${orientation}">
        <slot name="item"></slot>
      </div>
      <div class="content-slot" aria-hidden="true">
        <slot name="content"></slot>
      </div>
      <slot></slot>
    `);
    this._attachSlotListeners();
    this._syncStructure();
    this._syncBarA11y();
  }

  open(): void {
    if (this.hasAttribute('headless')) return;
    this.setAttribute('open', '');
  }

  close(): void {
    this.removeAttribute('open');
  }

  toggle(): void {
    if (this.hasAttribute('open')) this.close();
    else this.open();
  }

  get closeOnSelect(): boolean {
    return toBooleanAttribute(this.getAttribute('close-on-select'), true);
  }

  set closeOnSelect(value: boolean) {
    this.setAttribute('close-on-select', value ? 'true' : 'false');
  }

  get typeahead(): boolean {
    return toBooleanAttribute(this.getAttribute('typeahead'), true);
  }

  set typeahead(value: boolean) {
    this.setAttribute('typeahead', value ? 'true' : 'false');
  }

  private _attachSlotListeners(): void {
    const itemSlot = this.root.querySelector('slot[name="item"]') as HTMLSlotElement | null;
    const contentSlot = this.root.querySelector('slot[name="content"]') as HTMLSlotElement | null;

    if (this._itemSlot && this._itemSlot !== itemSlot) {
      this._itemSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (this._contentSlot && this._contentSlot !== contentSlot) {
      this._contentSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (itemSlot && this._itemSlot !== itemSlot) {
      itemSlot.addEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (contentSlot && this._contentSlot !== contentSlot) {
      contentSlot.addEventListener('slotchange', this._onSlotChange as EventListener);
    }

    this._itemSlot = itemSlot;
    this._contentSlot = contentSlot;
  }

  private _detachSlotListeners(): void {
    if (this._itemSlot) this._itemSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    if (this._contentSlot) this._contentSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._itemSlot = null;
    this._contentSlot = null;
  }

  private _syncBarA11y(): void {
    const bar = this.root.querySelector('.bar') as HTMLElement | null;
    if (!bar) return;
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    bar.setAttribute('aria-orientation', orientation);
  }

  private _onSlotChange(): void {
    this._syncState();
  }

  private _loopEnabled(): boolean {
    return toBooleanAttribute(this.getAttribute('loop'), true);
  }

  private _isOpenAttribute(): boolean {
    return this.hasAttribute('open') && !this.hasAttribute('headless');
  }

  private _selectedIndex(): number {
    const raw = this.getAttribute('selected');
    if (raw == null || raw === '') return this._items.length > 0 ? 0 : -1;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return this._items.length > 0 ? 0 : -1;
    if (parsed < 0) return -1;
    return clampIndex(parsed, this._items.length);
  }

  private _setSelectedAttribute(index: number): void {
    this._ignoreSelected = true;
    this.setAttribute('selected', String(index));
    this._ignoreSelected = false;
  }

  private _moveIndex(current: number, delta: number): number {
    if (this._items.length === 0) return -1;
    const loop = this._loopEnabled();
    let next = current + delta;
    if (next < 0) next = loop ? this._items.length - 1 : 0;
    if (next >= this._items.length) next = loop ? 0 : this._items.length - 1;
    return next;
  }

  private _syncState(): void {
    this._syncStructure();

    const nextOpen = this._isOpenAttribute() && this._selectedIndex() >= 0 && this._items.length > 0;
    if (nextOpen !== this._open) {
      this._open = nextOpen;
      if (nextOpen) {
        this._bindGlobalListeners();
        this._rebuildPanel();
        this.dispatchEvent(
          new CustomEvent('open', {
            detail: { selected: this._selectedIndex() },
            bubbles: true
          })
        );
      } else {
        this._unbindGlobalListeners();
        const previous = this._panelForIndex >= 0 ? this._panelForIndex : this._selectedIndex();
        this._teardownPanel();
        this.dispatchEvent(new CustomEvent('close', { detail: { previous }, bubbles: true }));
      }
      return;
    }

    if (this._open) {
      this._bindGlobalListeners();
      const selected = this._selectedIndex();
      if (selected !== this._panelForIndex || !this._portalEl) this._rebuildPanel();
    } else {
      this._unbindGlobalListeners();
      this._teardownPanel();
    }
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    document.addEventListener('pointerdown', this._onDocPointerDown as EventListener, true);
    document.addEventListener('keydown', this._onDocKeyDown as EventListener);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    document.removeEventListener('pointerdown', this._onDocPointerDown as EventListener, true);
    document.removeEventListener('keydown', this._onDocKeyDown as EventListener);
    this._globalListenersBound = false;
  }

  private _syncStructure(): void {
    this._items = this._itemSlot ? (this._itemSlot.assignedElements({ flatten: true }) as MenubarItem[]) : [];
    this._contents = this._contentSlot ? (this._contentSlot.assignedElements({ flatten: true }) as HTMLElement[]) : [];

    const selected = this._selectedIndex();
    const isOpen = this._isOpenAttribute();

    this._items.forEach((item, index) => {
      const active = selected === index;
      const itemId = item.id || `ui-menubar-item-${this._uid}-${index}`;
      const panelId = this._contents[index]?.id || `ui-menubar-content-${this._uid}-${index}`;
      item.id = itemId;
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', active ? '0' : '-1');
      item.setAttribute('aria-haspopup', 'menu');
      item.setAttribute('aria-expanded', active && isOpen ? 'true' : 'false');
      item.setAttribute('aria-controls', panelId);
      item.setAttribute('data-active', active ? 'true' : 'false');
    });

    this._contents.forEach((content, index) => {
      const panelId = content.id || `ui-menubar-content-${this._uid}-${index}`;
      content.id = panelId;
      content.setAttribute('role', 'menu');
      content.setAttribute('tabindex', '-1');
      content.setAttribute('aria-hidden', selected === index && isOpen ? 'false' : 'true');
      if (this._items[index]) content.setAttribute('aria-labelledby', this._items[index].id);
      else content.removeAttribute('aria-labelledby');
    });
  }

  private _hydratePanelItems(panel: HTMLElement): void {
    const items = Array.from(panel.querySelectorAll<PanelItem>(panelItemSelector()));
    items.forEach((item, index) => {
      if (!item.getAttribute('role')) item.setAttribute('role', 'menuitem');
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1');
      if (!item.hasAttribute('data-index')) item.setAttribute('data-index', String(index));
      if (!item.classList.contains('item')) item.classList.add('item');
    });
  }

  private _buildPanelContent(selectedIndex: number): HTMLElement {
    const source = this._contents[selectedIndex];
    const panel = document.createElement('div');
    panel.className = 'menu-panel';
    panel.id = source?.id || `ui-menubar-panel-${this._uid}-${selectedIndex}`;
    panel.setAttribute('role', 'menu');
    panel.setAttribute('tabindex', '-1');
    panel.setAttribute('aria-labelledby', this._items[selectedIndex]?.id || '');

    const variant = readVariantValue(this, 'variant');
    const density = readVariantValue(this, 'density');
    const shape = readVariantValue(this, 'shape');
    const elevation = readVariantValue(this, 'elevation');
    const tone = readVariantValue(this, 'tone');
    if (variant && variant !== 'default') panel.setAttribute('data-variant', variant);
    if (density && density !== 'default') panel.setAttribute('data-density', density);
    if (shape && shape !== 'default') panel.setAttribute('data-shape', shape);
    if (elevation && elevation !== 'default') panel.setAttribute('data-elevation', elevation);
    if (tone && tone !== 'default' && tone !== 'brand') panel.setAttribute('data-tone', tone);

    const computed = window.getComputedStyle(this);
    const tokenNames = [
      '--ui-menubar-ring',
      '--ui-menubar-z',
      '--ui-menubar-panel-bg',
      '--ui-menubar-panel-color',
      '--ui-menubar-panel-border-color',
      '--ui-menubar-panel-border',
      '--ui-menubar-panel-shadow',
      '--ui-menubar-panel-radius',
      '--ui-menubar-panel-padding',
      '--ui-menubar-panel-min-width'
    ];
    tokenNames.forEach((token) => {
      const value = computed.getPropertyValue(token).trim();
      if (value) panel.style.setProperty(token, value);
    });

    const styleEl = document.createElement('style');
    styleEl.textContent = panelStyle;
    panel.appendChild(styleEl);

    if (source) {
      const clone = source.cloneNode(true) as HTMLElement;
      clone.removeAttribute('slot');
      panel.appendChild(clone);
    }

    this._hydratePanelItems(panel);
    if (!panel.querySelector(panelItemSelector())) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No items';
      panel.appendChild(empty);
    }

    panel.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const item = target.closest(panelItemSelector()) as PanelItem | null;
      if (!item || isDisabledPanelItem(item)) return;

      this._applyPanelSelectionBehavior(item);

      const itemIndexRaw = item.getAttribute('data-index');
      const itemIndex =
        itemIndexRaw != null && !Number.isNaN(Number(itemIndexRaw)) ? Number(itemIndexRaw) : undefined;
      this.dispatchEvent(
        new CustomEvent('select', {
          detail: {
            selected: selectedIndex,
            index: itemIndex,
            value: item.getAttribute('data-value') || item.getAttribute('value') || undefined,
            label: item.getAttribute('aria-label') || item.textContent?.trim() || undefined,
            checked: item.getAttribute('aria-checked') === 'true',
            item
          },
          bubbles: true
        })
      );

      if (this.closeOnSelect) this.close();
      else this._focusPanelItem(item);
    });

    return panel;
  }

  private _rebuildPanel(): void {
    if (!this._open) return;
    const selected = this._selectedIndex();
    const anchor = this._items[selected];
    if (selected < 0 || !anchor) {
      this._teardownPanel();
      return;
    }

    this._teardownPanel();
    const panel = this._buildPanelContent(selected);
    this._portalEl = panel;
    this._panelForIndex = selected;

    const cleanup = showPortalFor(anchor, panel, {
      placement: normalizePlacement(this.getAttribute('placement')),
      offset: 6,
      flip: true,
      shift: true
    });
    this._cleanup = typeof cleanup === 'function' ? cleanup : null;
  }

  private _teardownPanel(): void {
    if (this._cleanup) {
      try {
        this._cleanup();
      } catch {
        // no-op
      }
      this._cleanup = null;
    }

    if (this._portalEl?.parentElement) {
      try {
        this._portalEl.parentElement.removeChild(this._portalEl);
      } catch {
        // no-op
      }
    }

    this._portalEl = null;
    this._panelForIndex = -1;
    this._resetTypeahead();
  }

  private _selectIndex(index: number, reason: MenubarReason): void {
    const previous = this._selectedIndex();
    const next = clampIndex(index, this._items.length);
    if (next < 0) return;

    this._setSelectedAttribute(next);
    this.setAttribute('open', '');
    this._syncState();

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { selected: next, previous, open: true, reason },
        bubbles: true
      })
    );
  }

  private _focusItem(index: number): void {
    const target = this._items[index];
    if (!target) return;
    this._items.forEach((item, i) => item.setAttribute('tabindex', i === index ? '0' : '-1'));
    try {
      target.focus();
    } catch {
      // no-op
    }
  }

  private _queryPanelItems(): PanelItem[] {
    const panel = this._portalEl;
    if (!panel) return [];
    return Array.from(panel.querySelectorAll<PanelItem>(panelItemSelector())).filter((item) => {
      if (item.getClientRects().length === 0) return false;
      return !isDisabledPanelItem(item);
    });
  }

  private _focusPanelItem(item: PanelItem | null): void {
    if (!item) return;
    if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1');
    try {
      item.focus({ preventScroll: true });
    } catch {
      item.focus();
    }
  }

  private _focusPanelFirst(): void {
    const items = this._queryPanelItems();
    if (items.length === 0) return;
    this._focusPanelItem(items[0]);
  }

  private _focusPanelLast(): void {
    const items = this._queryPanelItems();
    if (items.length === 0) return;
    this._focusPanelItem(items[items.length - 1]);
  }

  private _movePanelFocus(step: 1 | -1): void {
    const items = this._queryPanelItems();
    if (!items.length) return;

    const active = document.activeElement as HTMLElement | null;
    const index = active ? items.indexOf(active as PanelItem) : -1;
    if (index < 0) {
      this._focusPanelFirst();
      return;
    }

    const next = (index + step + items.length) % items.length;
    this._focusPanelItem(items[next]);
  }

  private _resetTypeahead(): void {
    this._typeaheadBuffer = '';
    if (this._typeaheadTimer != null) {
      window.clearTimeout(this._typeaheadTimer);
      this._typeaheadTimer = null;
    }
  }

  private _isTypeaheadKey(event: KeyboardEvent): boolean {
    if (event.ctrlKey || event.metaKey || event.altKey) return false;
    return event.key.length === 1 && /\S/.test(event.key);
  }

  private _typeaheadOnBar(event: KeyboardEvent): boolean {
    if (!this.typeahead) return false;
    if (!this._isTypeaheadKey(event)) return false;

    this._typeaheadBuffer = `${this._typeaheadBuffer}${event.key.toLowerCase()}`.slice(0, 24);
    if (this._typeaheadTimer != null) window.clearTimeout(this._typeaheadTimer);
    this._typeaheadTimer = window.setTimeout(() => this._resetTypeahead(), 420);

    const matchedIndex = this._items.findIndex((item) => {
      const text = (item.getAttribute('aria-label') || item.textContent || '').trim().toLowerCase();
      return text.startsWith(this._typeaheadBuffer);
    });
    if (matchedIndex < 0) return false;

    event.preventDefault();
    this._focusItem(matchedIndex);
    if (this._open) this._selectIndex(matchedIndex, 'keyboard');
    return true;
  }

  private _typeaheadOnPanel(event: KeyboardEvent): boolean {
    if (!this.typeahead) return false;
    if (!this._isTypeaheadKey(event)) return false;

    const items = this._queryPanelItems();
    if (!items.length) return false;

    this._typeaheadBuffer = `${this._typeaheadBuffer}${event.key.toLowerCase()}`.slice(0, 24);
    if (this._typeaheadTimer != null) window.clearTimeout(this._typeaheadTimer);
    this._typeaheadTimer = window.setTimeout(() => this._resetTypeahead(), 420);

    const matched = items.find((item) => {
      const text = (item.getAttribute('aria-label') || item.textContent || '').trim().toLowerCase();
      return text.startsWith(this._typeaheadBuffer);
    });
    if (!matched) return false;

    event.preventDefault();
    this._focusPanelItem(matched);
    return true;
  }

  private _applyPanelSelectionBehavior(item: PanelItem): void {
    const role = item.getAttribute('role');
    if (role === 'menuitemcheckbox') {
      const nextChecked = item.getAttribute('aria-checked') !== 'true';
      item.setAttribute('aria-checked', nextChecked ? 'true' : 'false');
      item.setAttribute('data-state', nextChecked ? 'checked' : 'unchecked');
      return;
    }
    if (role !== 'menuitemradio') return;

    const panel = this._portalEl;
    if (!panel) return;
    const group = item.getAttribute('data-group') || item.getAttribute('name') || '';
    const radios = Array.from(panel.querySelectorAll<PanelItem>('[role="menuitemradio"]'));
    radios.forEach((radio) => {
      if (group) {
        const radioGroup = radio.getAttribute('data-group') || radio.getAttribute('name') || '';
        if (radioGroup !== group) return;
      }
      radio.setAttribute('aria-checked', 'false');
      radio.setAttribute('data-state', 'unchecked');
    });
    item.setAttribute('aria-checked', 'true');
    item.setAttribute('data-state', 'checked');
  }

  private _onClick(event: MouseEvent): void {
    const path = event.composedPath();
    const index = this._items.findIndex((item) => path.includes(item));
    if (index < 0) return;

    this._focusItem(index);
    const selected = this._selectedIndex();
    if (selected === index && this._open) {
      this.close();
      this._syncState();
      return;
    }
    this._selectIndex(index, 'click');
  }

  private _onMouseMove(event: MouseEvent): void {
    if (!this._open) return;
    const path = event.composedPath();
    const index = this._items.findIndex((item) => path.includes(item));
    if (index < 0) return;
    if (index === this._selectedIndex()) return;
    this._selectIndex(index, 'programmatic');
  }

  private _onDocPointerDown(event: PointerEvent): void {
    if (!this._open) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    if (this._portalEl && path.includes(this._portalEl)) return;
    this.close();
    this._syncState();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const focusIndex = this._items.findIndex((item) => item === event.target || item.contains(event.target as Node));
    if (focusIndex < 0) return;

    const dir = getComputedStyle(this).direction === 'rtl' ? 'rtl' : 'ltr';
    let handled = false;
    let next = focusIndex;

    if (event.key === 'ArrowRight') {
      next = this._moveIndex(focusIndex, dir === 'rtl' ? -1 : 1);
      handled = true;
    } else if (event.key === 'ArrowLeft') {
      next = this._moveIndex(focusIndex, dir === 'rtl' ? 1 : -1);
      handled = true;
    } else if (event.key === 'Home') {
      next = this._items.length > 0 ? 0 : -1;
      handled = true;
    } else if (event.key === 'End') {
      next = this._items.length > 0 ? this._items.length - 1 : -1;
      handled = true;
    } else if (event.key === 'Enter' || event.key === ' ') {
      this._selectIndex(focusIndex, 'keyboard');
      handled = true;
    } else if (event.key === 'ArrowDown') {
      this._selectIndex(focusIndex, 'keyboard');
      setTimeout(() => this._focusPanelFirst(), 0);
      handled = true;
    } else if (event.key === 'ArrowUp') {
      this._selectIndex(focusIndex, 'keyboard');
      setTimeout(() => this._focusPanelLast(), 0);
      handled = true;
    } else if (event.key === 'Escape') {
      if (this._open) {
        this.close();
        this._syncState();
      }
      handled = true;
    }

    if (!handled && this._typeaheadOnBar(event)) return;

    if (handled) {
      event.preventDefault();
      if (next >= 0 && next !== focusIndex) {
        this._focusItem(next);
        if (this._open) this._selectIndex(next, 'keyboard');
      }
    }
  }

  private _onDocKeyDown(event: KeyboardEvent): void {
    if (!this._open) return;

    const insidePanel = !!this._portalEl && event.composedPath().includes(this._portalEl);
    if (!insidePanel) {
      if (event.key === 'Escape') {
        this.close();
        this._syncState();
      }
      return;
    }

    if (this._typeaheadOnPanel(event)) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      this._syncState();
      const selected = this._selectedIndex();
      if (selected >= 0) this._focusItem(selected);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._movePanelFocus(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._movePanelFocus(-1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this._focusPanelFirst();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this._focusPanelLast();
      return;
    }

    if (event.key === 'Tab') {
      this.close();
      this._syncState();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      const active = document.activeElement as HTMLElement | null;
      if (!active || !this._portalEl?.contains(active)) return;
      const item = active.closest(panelItemSelector()) as PanelItem | null;
      if (!item || isDisabledPanelItem(item)) return;
      event.preventDefault();
      item.click();
    }
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-menubar')) {
  customElements.define('ui-menubar', UIMenubar);
}
