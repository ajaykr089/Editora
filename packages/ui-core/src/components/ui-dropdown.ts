import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

type DropdownPlacement = 'top' | 'bottom' | 'left' | 'right';

type DropdownItem = HTMLElement & { disabled?: boolean };

const style = `
  :host {
    --ui-dropdown-menu-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-dropdown-menu-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-dropdown-menu-border-color: var(--ui-color-border, var(--ui-border, rgba(15, 23, 42, 0.14)));
    --ui-dropdown-menu-border: 1px solid var(--ui-dropdown-menu-border-color);
    --ui-dropdown-menu-shadow:
      0 20px 44px rgba(2, 6, 23, 0.2),
      0 2px 10px rgba(2, 6, 23, 0.12);
    --ui-dropdown-menu-radius: 13px;
    --ui-dropdown-menu-padding: 6px;
    --ui-dropdown-menu-min-width: 196px;
    --ui-dropdown-menu-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-dropdown-menu-backdrop: none;
    color-scheme: light dark;
    display: inline-block;
    position: relative;
  }

  .trigger {
    display: inline-flex;
    width: fit-content;
  }

  .content-slot {
    display: none !important;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.62;
  }
`;

const menuStyle = `
  .menu {
    --ui-dropdown-item-radius: 8px;
    --ui-dropdown-item-gap: 10px;
    --ui-dropdown-item-min-height: 36px;
    --ui-dropdown-item-pad-y: 8px;
    --ui-dropdown-item-pad-x: 11px;
    --ui-dropdown-item-font-size: 13px;
    --ui-dropdown-item-font-weight: 500;
    --ui-dropdown-item-line-height: 1.3;
    --ui-dropdown-separator-margin: 6px 10px;
    --ui-dropdown-item-active-bg: color-mix(in srgb, #2563eb 18%, transparent);
    --ui-dropdown-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #2563eb 16%, transparent),
        color-mix(in srgb, #2563eb 10%, transparent)
      );
    position: absolute;
    display: grid;
    gap: 1px;
    min-width: var(--ui-dropdown-menu-min-width, 196px);
    max-width: min(360px, calc(100vw - 16px));
    max-height: min(420px, calc(100vh - 16px));
    padding: var(--ui-dropdown-menu-padding, 6px);
    border: var(--ui-dropdown-menu-border, 1px solid rgba(15, 23, 42, 0.14));
    border-radius: var(--ui-dropdown-menu-radius, 13px);
    box-sizing: border-box;
    overflow: auto;
    isolation: isolate;
    background: var(--ui-dropdown-menu-bg, #fff);
    color: var(--ui-dropdown-menu-color, #0f172a);
    box-shadow: var(--ui-dropdown-menu-shadow, 0 18px 48px rgba(2, 6, 23, 0.18));
    backdrop-filter: var(--ui-dropdown-menu-backdrop, none);
    pointer-events: auto;
    opacity: 0;
    transform: translateY(5px) scale(0.982);
    transform-origin: top center;
    animation: ui-dropdown-enter 170ms cubic-bezier(0.2, 0.9, 0.24, 1) forwards;
    outline: none;
    scrollbar-gutter: stable both-edges;
    will-change: transform, opacity;
    z-index: var(--ui-dropdown-z, 1550);
  }

  .menu[data-shape="square"] {
    --ui-dropdown-menu-radius: 4px;
    --ui-dropdown-item-radius: 3px;
  }

  .menu[data-shape="soft"] {
    --ui-dropdown-menu-radius: 18px;
    --ui-dropdown-item-radius: 12px;
  }

  .menu[data-density="compact"] {
    --ui-dropdown-menu-padding: 4px;
    --ui-dropdown-item-min-height: 30px;
    --ui-dropdown-item-pad-y: 5px;
    --ui-dropdown-item-pad-x: 9px;
    --ui-dropdown-item-font-size: 12px;
    --ui-dropdown-item-gap: 8px;
    --ui-dropdown-separator-margin: 4px 8px;
  }

  .menu[data-density="comfortable"] {
    --ui-dropdown-menu-padding: 7px;
    --ui-dropdown-item-min-height: 40px;
    --ui-dropdown-item-pad-y: 9px;
    --ui-dropdown-item-pad-x: 13px;
    --ui-dropdown-item-font-size: 14px;
    --ui-dropdown-item-gap: 12px;
    --ui-dropdown-separator-margin: 7px 11px;
  }

  .menu[data-elevation="none"] {
    --ui-dropdown-menu-shadow: none;
  }

  .menu[data-elevation="low"] {
    --ui-dropdown-menu-shadow:
      0 12px 28px rgba(2, 6, 23, 0.16),
      0 2px 6px rgba(2, 6, 23, 0.08);
  }

  .menu[data-elevation="high"] {
    --ui-dropdown-menu-shadow:
      0 30px 72px rgba(2, 6, 23, 0.26),
      0 6px 18px rgba(2, 6, 23, 0.14);
  }

  .menu[data-variant="solid"] {
    background: var(--ui-dropdown-menu-bg, #fff);
    --ui-dropdown-menu-backdrop: none;
  }

  .menu[data-variant="glass"] {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-dropdown-menu-bg, #fff) 88%, #ffffff 12%),
        color-mix(in srgb, var(--ui-dropdown-menu-bg, #fff) 92%, transparent)
      ),
      var(--ui-dropdown-menu-bg, #fff);
    --ui-dropdown-menu-backdrop: blur(14px) saturate(1.08);
  }

  .menu[data-variant="flat"] {
    --ui-dropdown-menu-shadow: none;
    background: var(--ui-dropdown-menu-bg, #fff);
  }

  .menu[data-variant="line"] {
    --ui-dropdown-menu-shadow: none;
    --ui-dropdown-menu-radius: 8px;
    border-color: color-mix(in srgb, var(--ui-dropdown-menu-color, #0f172a) 26%, transparent);
    background: color-mix(in srgb, var(--ui-dropdown-menu-bg, #fff) 98%, transparent);
  }

  .menu[data-variant="flat"]::before,
  .menu[data-variant="flat"]::after,
  .menu[data-variant="line"]::before,
  .menu[data-variant="line"]::after {
    display: none;
  }

  .menu[data-variant="contrast"] {
    --ui-dropdown-menu-bg: #0f172a;
    --ui-dropdown-menu-color: #f8fafc;
    --ui-dropdown-menu-border-color: #334155;
    --ui-dropdown-menu-ring: #93c5fd;
    --ui-dropdown-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #ffffff 18%, transparent),
        color-mix(in srgb, #ffffff 10%, transparent)
      );
  }

  .menu[data-tone="danger"] {
    --ui-dropdown-menu-ring: #ef4444;
    --ui-dropdown-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #ef4444 18%, transparent),
        color-mix(in srgb, #ef4444 10%, transparent)
      );
  }

  .menu[data-tone="success"] {
    --ui-dropdown-menu-ring: #16a34a;
    --ui-dropdown-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #16a34a 18%, transparent),
        color-mix(in srgb, #16a34a 10%, transparent)
      );
    --ui-dropdown-item-active-bg: color-mix(in srgb, #16a34a 20%, transparent);
  }

  .menu[data-tone="warning"] {
    --ui-dropdown-menu-ring: #d97706;
    --ui-dropdown-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #f59e0b 22%, transparent),
        color-mix(in srgb, #f59e0b 14%, transparent)
      );
    --ui-dropdown-item-active-bg: color-mix(in srgb, #f59e0b 20%, transparent);
  }

  .menu::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 56%, transparent);
    opacity: 0.5;
  }

  .menu::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 14px;
    pointer-events: none;
    background: linear-gradient(180deg, color-mix(in srgb, #ffffff 24%, transparent), transparent);
    opacity: 0.35;
  }

  .menu[data-placement="top"] {
    transform-origin: bottom center;
  }

  .menu[data-placement="left"] {
    transform-origin: center right;
  }

  .menu[data-placement="right"] {
    transform-origin: center left;
  }

  .menu [role="menuitem"],
  .menu [role="menuitemcheckbox"],
  .menu [role="menuitemradio"],
  .menu .item,
  .menu [data-menu-item] {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    column-gap: var(--ui-dropdown-item-gap, 10px);
    min-height: var(--ui-dropdown-item-min-height, 36px);
    width: 100%;
    padding: var(--ui-dropdown-item-pad-y, 8px) var(--ui-dropdown-item-pad-x, 11px);
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    border: 0;
    border-radius: var(--ui-dropdown-item-radius, 8px);
    background: transparent;
    color: inherit;
    font: var(--ui-dropdown-item-font-weight, 500) var(--ui-dropdown-item-font-size, 13px)/var(--ui-dropdown-item-line-height, 1.3) -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
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

  .menu [role="menuitem"]:hover,
  .menu [role="menuitem"]:focus-visible,
  .menu [role="menuitemcheckbox"]:hover,
  .menu [role="menuitemcheckbox"]:focus-visible,
  .menu [role="menuitemradio"]:hover,
  .menu [role="menuitemradio"]:focus-visible,
  .menu .item:hover,
  .menu .item:focus-visible,
  .menu [data-menu-item]:hover,
  .menu [data-menu-item]:focus-visible {
    background: var(--ui-dropdown-item-hover-bg);
  }

  .menu [role="menuitem"]:not([aria-disabled="true"]):active,
  .menu [role="menuitemcheckbox"]:not([aria-disabled="true"]):active,
  .menu [role="menuitemradio"]:not([aria-disabled="true"]):active,
  .menu .item:not([aria-disabled="true"]):active,
  .menu [data-menu-item]:not([aria-disabled="true"]):active {
    background: var(--ui-dropdown-item-active-bg);
    transform: translateY(1px);
  }

  .menu [role="menuitem"]:focus-visible,
  .menu [role="menuitemcheckbox"]:focus-visible,
  .menu [role="menuitemradio"]:focus-visible,
  .menu .item:focus-visible,
  .menu [data-menu-item]:focus-visible {
    box-shadow: inset 0 0 0 2px var(--ui-dropdown-menu-ring, #2563eb);
  }

  .menu [role="menuitemcheckbox"][aria-checked="true"],
  .menu [role="menuitemradio"][aria-checked="true"] {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-dropdown-menu-ring, #2563eb) 22%, transparent),
        color-mix(in srgb, var(--ui-dropdown-menu-ring, #2563eb) 12%, transparent)
      );
  }

  .menu [aria-disabled="true"],
  .menu [disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  .menu [role="separator"],
  .menu .separator {
    height: 1px;
    margin: var(--ui-dropdown-separator-margin, 6px 10px);
    border: 0;
    background: color-mix(in srgb, currentColor 18%, transparent);
  }

  .menu .icon {
    grid-column: 1;
    width: 1rem;
    min-width: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
  }

  .menu .label {
    grid-column: 2;
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .menu .shortcut,
  .menu .meta {
    grid-column: 3;
    margin-left: auto;
    font-size: 11px;
    letter-spacing: 0.02em;
    opacity: 0.66;
    white-space: nowrap;
  }

  .menu .empty-state {
    padding: 10px 12px;
    font: 500 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: 0.01em;
    opacity: 0.72;
  }

  @keyframes ui-dropdown-enter {
    from {
      opacity: 0;
      transform: translateY(5px) scale(0.982);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .menu {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-contrast: more) {
    .menu {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .menu {
      forced-color-adjust: none;
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }

    .menu::before,
    .menu::after {
      display: none;
    }

    .menu [role="menuitem"],
    .menu [role="menuitemcheckbox"],
    .menu [role="menuitemradio"],
    .menu .item,
    .menu [data-menu-item],
    .menu .empty-state {
      border: 1px solid transparent;
      background: Canvas;
      color: CanvasText;
    }

    .menu [role="menuitem"]:hover,
    .menu [role="menuitem"]:focus-visible,
    .menu [role="menuitemcheckbox"]:hover,
    .menu [role="menuitemcheckbox"]:focus-visible,
    .menu [role="menuitemradio"]:hover,
    .menu [role="menuitemradio"]:focus-visible,
    .menu .item:hover,
    .menu .item:focus-visible,
    .menu [data-menu-item]:hover,
    .menu [data-menu-item]:focus-visible {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
    }
  }
`;

function normalizePlacement(value: string | null): DropdownPlacement {
  if (value === 'top' || value === 'left' || value === 'right') return value;
  return 'bottom';
}

function isDisabledItem(item: DropdownItem): boolean {
  return item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true' || !!item.disabled;
}

function menuItemSelector(): string {
  return [
    '[role="menuitem"]',
    '[role="menuitemcheckbox"]',
    '[role="menuitemradio"]',
    '.item',
    '[data-menu-item]'
  ].join(', ');
}

function readVariantValue(host: HTMLElement, name: string): string {
  return host.getAttribute(name) || '';
}

const DROPDOWN_VISUAL_ATTRS = new Set(['variant', 'density', 'shape', 'elevation', 'tone']);
const DROPDOWN_TOKEN_NAMES = [
  '--ui-dropdown-menu-bg',
  '--ui-dropdown-menu-color',
  '--ui-dropdown-menu-border-color',
  '--ui-dropdown-menu-border',
  '--ui-dropdown-menu-shadow',
  '--ui-dropdown-menu-radius',
  '--ui-dropdown-menu-padding',
  '--ui-dropdown-menu-min-width',
  '--ui-dropdown-menu-ring',
  '--ui-dropdown-menu-backdrop'
];

export class UIDropdown extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'disabled',
      'placement',
      'variant',
      'density',
      'shape',
      'elevation',
      'tone',
      'close-on-select',
      'typeahead'
    ];
  }

  private _isOpen = false;
  private _cleanup: (() => void) | null = null;
  private _portalEl: HTMLElement | null = null;
  private _menuId: string;
  private _restoreFocusEl: HTMLElement | null = null;
  private _typeaheadBuffer = '';
  private _typeaheadTimer: number | null = null;
  private _globalListenersBound = false;

  constructor() {
    super();
    this._menuId = `ui-dropdown-menu-${Math.random().toString(36).slice(2, 10)}`;
    this._onHostClick = this._onHostClick.bind(this);
    this._onDocumentPointerDown = this._onDocumentPointerDown.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._onHostClick);
    this._syncOpenState();
    this._syncTriggerA11y();
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this._onHostClick);
    this._unbindGlobalListeners();
    this._teardownPortal();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'open') {
      this._syncOpenState();
      return;
    }

    if (name === 'close-on-select' || name === 'typeahead') return;

    if (name === 'placement' && this._isOpen) {
      this._rebuildPortal();
      return;
    }

    if (DROPDOWN_VISUAL_ATTRS.has(name) && this._isOpen) {
      this._syncPortalVisualState();
      return;
    }

    if (name === 'disabled') {
      if (this.hasAttribute('disabled')) this.close();
      this._syncTriggerA11y();
    }
  }

  open(): void {
    if (this.hasAttribute('disabled')) return;
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
    const raw = this.getAttribute('close-on-select');
    if (raw == null) return true;
    return raw !== 'false' && raw !== '0';
  }

  set closeOnSelect(value: boolean) {
    this.setAttribute('close-on-select', value ? 'true' : 'false');
  }

  get typeahead(): boolean {
    const raw = this.getAttribute('typeahead');
    if (raw == null) return true;
    return raw !== 'false' && raw !== '0';
  }

  set typeahead(value: boolean) {
    this.setAttribute('typeahead', value ? 'true' : 'false');
  }

  private _getTrigger(): HTMLElement | null {
    return this.querySelector('[slot="trigger"]') as HTMLElement | null;
  }

  private _getContentSource(): HTMLElement | null {
    return this.querySelector('[slot="content"]') as HTMLElement | null;
  }

  private _syncTriggerA11y(): void {
    const trigger = this._getTrigger();
    if (!trigger) return;

    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', this._isOpen ? 'true' : 'false');
    trigger.setAttribute('aria-controls', this._menuId);

    if (this.hasAttribute('disabled')) {
      trigger.setAttribute('aria-disabled', 'true');
      trigger.setAttribute('tabindex', '-1');
      return;
    }

    if (trigger.getAttribute('aria-disabled') === 'true') {
      trigger.removeAttribute('aria-disabled');
    }
    if (trigger.getAttribute('tabindex') === '-1') {
      trigger.removeAttribute('tabindex');
    }
  }

  private _syncOpenState(): void {
    const nowOpen = this.hasAttribute('open') && !this.hasAttribute('disabled');
    if (nowOpen === this._isOpen) {
      if (nowOpen) this._bindGlobalListeners();
      else this._unbindGlobalListeners();
      if (nowOpen) this._rebuildPortal();
      this._syncTriggerA11y();
      return;
    }

    this._isOpen = nowOpen;
    this._syncTriggerA11y();

    if (nowOpen) {
      this._bindGlobalListeners();
      this._restoreFocusEl = document.activeElement as HTMLElement | null;
      this._rebuildPortal();
      this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { open: true } }));
      requestAnimationFrame(() => this._focusFirstItem());
      return;
    }

    this._unbindGlobalListeners();
    this._teardownPortal();
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { open: false } }));

    const trigger = this._getTrigger();
    if (trigger) {
      try {
        trigger.focus();
      } catch {
        // no-op
      }
      return;
    }

    if (this._restoreFocusEl && this._restoreFocusEl.isConnected) {
      try {
        this._restoreFocusEl.focus();
      } catch {
        // no-op
      }
    }
    this._restoreFocusEl = null;
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.addEventListener('keydown', this._onDocumentKeyDown);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    this._globalListenersBound = false;
  }

  private _buildPortalContent(): HTMLElement {
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = this._menuId;
    menu.setAttribute('role', 'menu');
    menu.setAttribute('tabindex', '-1');
    this._applyPortalVariantData(menu);
    this._applyPortalTokens(menu);

    const styleEl = document.createElement('style');
    styleEl.textContent = menuStyle;
    menu.appendChild(styleEl);

    const source = this._getContentSource();
    if (source) {
      const clone = source.cloneNode(true) as HTMLElement;
      clone.removeAttribute('slot');
      menu.appendChild(clone);
    }

    if (menu.childNodes.length <= 1) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No items';
      menu.appendChild(empty);
    }

    menu.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const item = target.closest(menuItemSelector()) as DropdownItem | null;
      if (!item || isDisabledItem(item)) return;

      this._applySelectionBehavior(item);
      this.dispatchEvent(
        new CustomEvent('select', {
          bubbles: true,
          detail: {
            value: item.getAttribute('data-value') || item.getAttribute('value') || undefined,
            label: item.getAttribute('aria-label') || item.textContent?.trim() || undefined,
            checked: item.getAttribute('aria-checked') === 'true',
            item
          }
        })
      );

      if (this.closeOnSelect) {
        this.close();
      } else {
        this._focusItem(item);
      }
    });

    return menu;
  }

  private _applyPortalVariantData(menu: HTMLElement): void {
    const variant = readVariantValue(this, 'variant');
    const density = readVariantValue(this, 'density');
    const shape = readVariantValue(this, 'shape');
    const elevation = readVariantValue(this, 'elevation');
    const tone = readVariantValue(this, 'tone');

    if (variant && variant !== 'default') menu.setAttribute('data-variant', variant);
    else menu.removeAttribute('data-variant');

    if (density && density !== 'default') menu.setAttribute('data-density', density);
    else menu.removeAttribute('data-density');

    if (shape && shape !== 'default') menu.setAttribute('data-shape', shape);
    else menu.removeAttribute('data-shape');

    if (elevation && elevation !== 'default') menu.setAttribute('data-elevation', elevation);
    else menu.removeAttribute('data-elevation');

    if (tone && tone !== 'default' && tone !== 'brand') menu.setAttribute('data-tone', tone);
    else menu.removeAttribute('data-tone');
  }

  private _applyPortalTokens(menu: HTMLElement): void {
    const computed = window.getComputedStyle(this);
    DROPDOWN_TOKEN_NAMES.forEach((token) => {
      const value = computed.getPropertyValue(token).trim();
      if (value) menu.style.setProperty(token, value);
      else menu.style.removeProperty(token);
    });
  }

  private _syncPortalVisualState(): void {
    const menu = this._portalEl;
    if (!menu) return;
    this._applyPortalVariantData(menu);
    this._applyPortalTokens(menu);
  }

  private _rebuildPortal(): void {
    if (!this._isOpen) return;
    const trigger = this._getTrigger();
    if (!trigger) return;

    this._teardownPortal();

    const content = this._buildPortalContent();
    this._portalEl = content;

    const cleanup = showPortalFor(trigger, content, {
      placement: normalizePlacement(this.getAttribute('placement')),
      offset: 6,
      flip: true,
      shift: true
    });

    this._cleanup = typeof cleanup === 'function' ? cleanup : null;
  }

  private _teardownPortal(): void {
    if (this._cleanup) {
      try {
        this._cleanup();
      } catch {
        // no-op
      }
      this._cleanup = null;
    }

    if (this._portalEl && this._portalEl.parentElement) {
      try {
        this._portalEl.parentElement.removeChild(this._portalEl);
      } catch {
        // no-op
      }
    }
    this._portalEl = null;
    this._resetTypeahead();
  }

  private _focusMenu(): void {
    const menu = this._portalEl;
    if (!menu) return;
    try {
      menu.focus({ preventScroll: true });
    } catch {
      menu.focus();
    }
  }

  private _queryItems(): DropdownItem[] {
    const menu = this._portalEl;
    if (!menu) return [];
    return Array.from(menu.querySelectorAll<DropdownItem>(menuItemSelector())).filter((item) => {
      if (item.getClientRects().length === 0) return false;
      return !isDisabledItem(item);
    });
  }

  private _focusItem(item: DropdownItem | null): void {
    if (!item) return;
    if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1');
    try {
      item.focus({ preventScroll: true });
    } catch {
      item.focus();
    }
  }

  private _focusFirstItem(): void {
    const items = this._queryItems();
    if (items.length === 0) {
      this._focusMenu();
      return;
    }

    const first = items[0];
    this._focusItem(first);
  }

  private _focusLastItem(): void {
    const items = this._queryItems();
    if (items.length === 0) {
      this._focusMenu();
      return;
    }

    const last = items[items.length - 1];
    this._focusItem(last);
  }

  private _moveFocus(step: 1 | -1): void {
    const items = this._queryItems();
    if (!items.length) return;

    const active = document.activeElement as HTMLElement | null;
    const index = active ? items.indexOf(active as DropdownItem) : -1;
    if (index < 0) {
      this._focusFirstItem();
      return;
    }

    const next = (index + step + items.length) % items.length;
    const target = items[next];
    this._focusItem(target);
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

  private _handleTypeahead(event: KeyboardEvent): boolean {
    if (!this.typeahead) return false;
    if (!this._isTypeaheadKey(event)) return false;

    const items = this._queryItems();
    if (!items.length) return false;

    this._typeaheadBuffer = `${this._typeaheadBuffer}${event.key.toLowerCase()}`.slice(0, 24);
    if (this._typeaheadTimer != null) {
      window.clearTimeout(this._typeaheadTimer);
    }
    this._typeaheadTimer = window.setTimeout(() => this._resetTypeahead(), 420);

    const matched = items.find((item) => {
      const text = (item.getAttribute('aria-label') || item.textContent || '').trim().toLowerCase();
      return text.startsWith(this._typeaheadBuffer);
    });
    if (!matched) return false;

    event.preventDefault();
    this._focusItem(matched);
    return true;
  }

  private _applySelectionBehavior(item: DropdownItem): void {
    const role = item.getAttribute('role');
    if (role === 'menuitemcheckbox') {
      const nextChecked = item.getAttribute('aria-checked') !== 'true';
      item.setAttribute('aria-checked', nextChecked ? 'true' : 'false');
      item.setAttribute('data-state', nextChecked ? 'checked' : 'unchecked');
      return;
    }

    if (role !== 'menuitemradio') return;
    const menu = this._portalEl;
    if (!menu) return;

    const group = item.getAttribute('data-group') || item.getAttribute('name') || '';
    const radios = Array.from(menu.querySelectorAll<DropdownItem>('[role="menuitemradio"]'));
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

  private _isEventInsideTrigger(event: Event): boolean {
    const trigger = this._getTrigger();
    if (!trigger) return false;
    const path = event.composedPath();
    return path.includes(trigger);
  }

  private _onHostClick(event: Event): void {
    if (this.hasAttribute('disabled')) return;
    if (!this._isEventInsideTrigger(event)) return;

    event.preventDefault();
    this.toggle();
  }

  private _onDocumentPointerDown(event: PointerEvent): void {
    if (!this._isOpen) return;

    const path = event.composedPath();
    if (path.includes(this)) return;
    if (this._portalEl && path.includes(this._portalEl)) return;

    this.close();
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (!this._isOpen) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      if (!this._isEventInsideTrigger(event)) return;

      event.preventDefault();
      this.open();
      requestAnimationFrame(() => {
        if (event.key === 'ArrowUp') this._focusLastItem();
        else this._focusFirstItem();
      });
      return;
    }

    if (this._handleTypeahead(event)) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._moveFocus(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._moveFocus(-1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this._focusFirstItem();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this._focusLastItem();
      return;
    }

    if (event.key === 'Tab') {
      this.close();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      const active = document.activeElement as HTMLElement | null;
      if (!active || !this._portalEl?.contains(active)) return;
      const item = active.closest(menuItemSelector()) as DropdownItem | null;
      if (!item || isDisabledItem(item)) return;
      event.preventDefault();
      item.click();
    }
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="trigger" part="trigger">
        <slot name="trigger"></slot>
      </div>
      <div class="content-slot" aria-hidden="true">
        <slot name="content"></slot>
      </div>
      <slot></slot>
    `);

    this._syncTriggerA11y();
    if (this._isOpen) {
      this._rebuildPortal();
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-dropdown')) {
  customElements.define('ui-dropdown', UIDropdown);
}
