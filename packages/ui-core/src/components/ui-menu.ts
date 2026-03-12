import { ElementBase } from '../ElementBase';
import { createPortalContainer } from '../portal';
import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { createPositioner, type PositionerHandle } from '../primitives/positioner';
import { createSharedMenuItemCss } from './menu-item-styles';

type MenuPlacement = 'top' | 'bottom' | 'left' | 'right';
type MenuItem = HTMLElement & { disabled?: boolean };

function normalizePlacement(value: string | null): MenuPlacement {
  if (value === 'top' || value === 'left' || value === 'right') return value;
  return 'bottom';
}

function normalizeMenuSize(value: string | null): 'sm' | 'md' | 'lg' {
  if (value === 'sm' || value === '1' || value === 'compact') return 'sm';
  if (value === 'lg' || value === '3' || value === 'comfortable') return 'lg';
  return 'md';
}

function normalizeMenuRadius(value: string | null): string | null {
  if (!value || value === 'default') return null;
  if (value === 'none') return '0px';
  if (value === 'sm') return '8px';
  if (value === 'md') return '12px';
  if (value === 'lg') return '16px';
  if (value === 'full') return '999px';
  if (value === 'square') return '6px';
  if (value === 'soft') return '14px';
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) return value;
  return null;
}

function readVariantValue(host: HTMLElement, name: string): string {
  return host.getAttribute(name) || '';
}

function booleanAttr(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function itemSelector(): string {
  return [
    '[role="menuitem"]',
    '[role="menuitemcheckbox"]',
    '[role="menuitemradio"]',
    '.item',
    '[data-menu-item]'
  ].join(', ');
}

function isDisabledItem(item: MenuItem): boolean {
  return item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true' || !!item.disabled;
}

function firstMatchingItemFromEvent(event: Event): MenuItem | null {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
  for (const entry of path) {
    if (!(entry instanceof HTMLElement)) continue;
    if (entry.matches(itemSelector())) return entry as MenuItem;
  }
  const target = event.target;
  if (target instanceof HTMLElement) return target.closest(itemSelector()) as MenuItem | null;
  return null;
}

const MENU_VISUAL_ATTRS = new Set(['variant', 'density', 'shape', 'elevation', 'tone', 'size', 'radius']);
const MENU_TOKEN_NAMES = [
  '--ui-menu-bg',
  '--ui-menu-color',
  '--ui-menu-border-color',
  '--ui-menu-border',
  '--ui-menu-shadow',
  '--ui-menu-radius',
  '--ui-menu-padding',
  '--ui-menu-min-width',
  '--ui-menu-ring',
  '--ui-menu-backdrop',
  '--ui-menu-z',
  '--ui-menu-item-radius',
  '--ui-menu-item-gap',
  '--ui-menu-item-min-height',
  '--ui-menu-item-pad-y',
  '--ui-menu-item-pad-x',
  '--ui-menu-item-font-size',
  '--ui-menu-item-line-height',
  '--ui-menu-separator-margin',
  '--ui-menu-item-hover-bg',
  '--ui-menu-item-active-color'
] as const;

const hostStyle = `
  :host {
    --ui-menu-bg: var(--base-menu-bg, var(--color-panel-solid, var(--ui-color-surface, var(--ui-surface, #ffffff))));
    --ui-menu-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-menu-border-color: color-mix(in srgb, var(--ui-color-border, var(--ui-border, rgba(15, 23, 42, 0.14))) 86%, transparent);
    --ui-menu-border: var(--base-menu-border, 1px solid var(--ui-menu-border-color));
    --ui-menu-shadow: var(--base-menu-shadow, var(--shadow-5, none));
    --ui-menu-radius: var(--base-menu-radius, var(--ui-radius, 4px));
    --ui-menu-padding: var(--base-menu-content-padding, 8px);
    --ui-menu-min-width: var(--base-menu-min-width, 232px);
    --ui-menu-ring: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-menu-backdrop: none;
    --ui-menu-z: 1560;
    --ui-menu-item-radius: var(--base-menu-item-radius, calc(var(--ui-menu-radius) - 2px));
    --ui-menu-item-gap: var(--base-menu-item-gap, 10px);
    --ui-menu-item-min-height: var(--base-menu-item-height, 36px);
    --ui-menu-item-pad-y: var(--base-menu-item-padding-y, 8px);
    --ui-menu-item-pad-x: var(--base-menu-item-padding-x, 12px);
    --ui-menu-item-font-size: var(--base-menu-item-font-size, var(--ui-default-font-size, 14px));
    --ui-menu-item-font-weight: 400;
    --ui-menu-item-line-height: var(--base-menu-item-line-height, var(--ui-default-line-height, 20px));
    --ui-menu-separator-margin: var(--base-menu-separator-margin, 6px 10px);
    --ui-menu-item-hover-bg: color-mix(in srgb, var(--ui-menu-ring) 12%, transparent);
    --ui-menu-item-active-color: inherit;
    color-scheme: light dark;
    display: inline-block;
    position: relative;
  }

  .trigger {
    display: inline-flex;
    width: fit-content;
  }

  .source-slot {
    display: none !important;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.62;
  }
`;

const menuStyle = `
  .menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: var(--ui-menu-min-width, 232px);
    max-width: min(360px, calc(100vw - 16px));
    max-height: min(440px, calc(100vh - 16px));
    overflow: auto;
    isolation: isolate;
    padding: var(--ui-menu-padding, 8px);
    box-sizing: border-box;
    border: var(--ui-menu-border);
    border-radius: var(--ui-menu-radius, 4px);
    background: var(--ui-menu-bg, #fff);
    color: var(--ui-menu-color, #0f172a);
    box-shadow: var(--ui-menu-shadow);
    opacity: 0;
    transform: translateY(4px) scale(0.985);
    transform-origin: top center;
    animation: ui-menu-enter 150ms cubic-bezier(0.2, 0.9, 0.24, 1) forwards;
    outline: none;
    will-change: transform, opacity;
    z-index: var(--ui-menu-z, 1560);
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

  .menu[data-variant="flat"] {
    box-shadow: none;
  }

  .menu[data-variant="soft"] {
    --ui-menu-bg: color-mix(in srgb, var(--base-menu-bg, var(--color-panel-solid, #ffffff)) 94%, var(--accent-surface, transparent));
  }

  .menu[data-variant="solid"] {
    --ui-menu-item-hover-bg: color-mix(in srgb, var(--ui-menu-ring) 12%, transparent);
    --ui-menu-item-active-color: var(--accent-12, var(--ui-menu-color, #0f172a));
  }

  .menu[data-variant="outline"] {
    box-shadow: none;
    --ui-menu-bg: var(--base-menu-bg, var(--color-panel-solid, #ffffff));
    --ui-menu-item-hover-bg: color-mix(in srgb, var(--ui-menu-ring) 8%, transparent);
  }

  .menu[data-variant="contrast"] {
    --ui-menu-bg: #0f172a;
    --ui-menu-color: #f8fafc;
    --ui-menu-border-color: #334155;
    --ui-menu-ring: #93c5fd;
    --ui-menu-item-hover-bg: color-mix(in srgb, #ffffff 12%, transparent);
  }

  .menu[data-size="sm"],
  .menu[data-density="compact"] {
    --ui-menu-padding: 4px;
    --ui-menu-item-radius: 6px;
    --ui-menu-item-gap: 8px;
    --ui-menu-item-min-height: 32px;
    --ui-menu-item-pad-y: 6px;
    --ui-menu-item-pad-x: 8px;
    --ui-menu-item-font-size: 13px;
    --ui-menu-item-line-height: 18px;
    --ui-menu-separator-margin: 4px 8px;
  }

  .menu[data-size="lg"],
  .menu[data-density="comfortable"] {
    --ui-menu-padding: 8px;
    --ui-menu-item-radius: 10px;
    --ui-menu-item-gap: 12px;
    --ui-menu-item-min-height: 40px;
    --ui-menu-item-pad-y: 9px;
    --ui-menu-item-pad-x: 12px;
    --ui-menu-item-font-size: 15px;
    --ui-menu-item-line-height: 22px;
    --ui-menu-separator-margin: 8px 12px;
  }

  .menu[data-elevation="none"] {
    box-shadow: none;
  }

  .menu[data-elevation="low"] {
    --ui-menu-shadow:
      0 14px 30px rgba(2, 6, 23, 0.17),
      0 2px 7px rgba(2, 6, 23, 0.08);
  }

  .menu[data-elevation="high"] {
    --ui-menu-shadow:
      0 32px 72px rgba(2, 6, 23, 0.28),
      0 6px 18px rgba(2, 6, 23, 0.14);
  }

  .menu[data-tone="danger"] {
    --ui-menu-ring: #ef4444;
    --ui-menu-item-hover-bg: color-mix(in srgb, #ef4444 12%, transparent);
    --ui-menu-item-active-color: inherit;
  }

  .menu[data-tone="success"] {
    --ui-menu-ring: #16a34a;
    --ui-menu-item-hover-bg: color-mix(in srgb, #16a34a 12%, transparent);
    --ui-menu-item-active-color: inherit;
  }

  .menu[data-tone="warning"] {
    --ui-menu-ring: #d97706;
    --ui-menu-item-hover-bg: color-mix(in srgb, #d97706 12%, transparent);
    --ui-menu-item-active-color: inherit;
  }

  .menu[data-tone="info"] {
    --ui-menu-ring: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-menu-item-hover-bg: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 12%, transparent);
    --ui-menu-item-active-color: inherit;
  }

  .menu[data-tone="neutral"] {
    --ui-menu-ring: color-mix(in srgb, var(--ui-color-muted, #64748b) 60%, var(--ui-color-text, #0f172a));
    --ui-menu-item-hover-bg: color-mix(in srgb, var(--ui-color-muted, #64748b) 12%, transparent);
    --ui-menu-item-active-color: inherit;
  }

  ${createSharedMenuItemCss({
    scopes: ['.menu'],
    prefix: '--ui-menu',
    shortcutSelectors: ['.shortcut', '.meta'],
    activeStateSelectors: [
      '.item[data-active="true"]',
      '[role="menuitem"][data-active="true"]',
      '[role="menuitemcheckbox"][data-active="true"]',
      '[role="menuitemradio"][data-active="true"]',
      '[data-menu-item][data-active="true"]'
    ]
  })}

  .menu[data-variant="solid"] [role="menuitem"]:hover,
  .menu[data-variant="solid"] [role="menuitem"]:focus-visible,
  .menu[data-variant="solid"] [role="menuitemcheckbox"]:hover,
  .menu[data-variant="solid"] [role="menuitemcheckbox"]:focus-visible,
  .menu[data-variant="solid"] [role="menuitemradio"]:hover,
  .menu[data-variant="solid"] [role="menuitemradio"]:focus-visible,
  .menu[data-variant="solid"] .item:hover,
  .menu[data-variant="solid"] .item:focus-visible,
  .menu[data-variant="solid"] [data-menu-item]:hover,
  .menu[data-variant="solid"] [data-menu-item]:focus-visible,
  .menu[data-variant="solid"] [role="menuitem"][data-active="true"],
  .menu[data-variant="solid"] [role="menuitemcheckbox"][data-active="true"],
  .menu[data-variant="solid"] [role="menuitemradio"][data-active="true"],
  .menu[data-variant="solid"] .item[data-active="true"],
  .menu[data-variant="solid"] [data-menu-item][data-active="true"] {
    background: color-mix(in srgb, var(--ui-menu-ring) 12%, transparent);
    color: var(--accent-12, var(--ui-menu-color, #0f172a));
  }

  .menu .empty-state {
    padding: 10px 12px;
    font: 500 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: 0.01em;
    opacity: 0.72;
  }

  @keyframes ui-menu-enter {
    from { opacity: 0; transform: translateY(4px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
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
      box-shadow: none;
    }
  }
`;

export class UIMenu extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'disabled',
      'placement',
      'variant',
      'size',
      'density',
      'radius',
      'shape',
      'elevation',
      'tone',
      'close-on-select',
      'close-on-scroll',
      'typeahead'
    ];
  }

  private _isOpen = false;
  private _portalEl: HTMLElement | null = null;
  private _positioner: PositionerHandle | null = null;
  private _dismissableLayer: DismissableLayerHandle | null = null;
  private _menuId: string;
  private _restoreFocusEl: HTMLElement | null = null;
  private _typeaheadBuffer = '';
  private _typeaheadTimer: number | null = null;
  private _globalListenersBound = false;
  private _menuClickHandler: ((event: MouseEvent) => void) | null = null;

  constructor() {
    super();
    this._menuId = `ui-menu-${Math.random().toString(36).slice(2, 10)}`;
    this._onHostClick = this._onHostClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onDocumentScroll = this._onDocumentScroll.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._onHostClick);
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);
    this._syncOpenState();
    this._syncTriggerA11y();
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this._onHostClick);
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
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
    if (name === 'close-on-select' || name === 'close-on-scroll' || name === 'typeahead') return;
    if (name === 'disabled') {
      if (this.hasAttribute('disabled')) this.close();
      this._syncTriggerA11y();
      return;
    }
    if (name === 'placement' && this._isOpen) {
      this._rebuildPositioner();
      return;
    }
    if (MENU_VISUAL_ATTRS.has(name) && this._isOpen) {
      this._syncPortalVisualState();
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
    return booleanAttr(this.getAttribute('close-on-select'), true);
  }

  set closeOnSelect(value: boolean) {
    this.setAttribute('close-on-select', value ? 'true' : 'false');
  }

  get closeOnScroll(): boolean {
    return booleanAttr(this.getAttribute('close-on-scroll'), true);
  }

  set closeOnScroll(value: boolean) {
    this.setAttribute('close-on-scroll', value ? 'true' : 'false');
  }

  get typeahead(): boolean {
    return booleanAttr(this.getAttribute('typeahead'), true);
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

  private _getItemSources(): HTMLElement[] {
    return Array.from(this.querySelectorAll('[slot="item"]')) as HTMLElement[];
  }

  private _onSlotChange(): void {
    if (!this._isOpen) return;
    this._rebuildPortalContent();
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
    if (trigger.getAttribute('aria-disabled') === 'true') trigger.removeAttribute('aria-disabled');
    if (trigger.getAttribute('tabindex') === '-1') trigger.removeAttribute('tabindex');
  }

  private _syncOpenState(): void {
    const nextOpen = this.hasAttribute('open') && !this.hasAttribute('disabled');
    if (nextOpen === this._isOpen) {
      this._syncTriggerA11y();
      if (nextOpen && !this._portalEl) this._mountPortal();
      else if (nextOpen) this._positioner?.update();
      return;
    }

    this._isOpen = nextOpen;
    this._syncTriggerA11y();

    if (nextOpen) {
      this._bindGlobalListeners();
      this._restoreFocusEl = document.activeElement as HTMLElement | null;
      this._mountPortal();
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
        trigger.focus({ preventScroll: true });
      } catch {
        trigger.focus();
      }
    }
    this._restoreFocusEl = null;
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    document.addEventListener('keydown', this._onDocumentKeyDown);
    document.addEventListener('scroll', this._onDocumentScroll, true);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    document.removeEventListener('scroll', this._onDocumentScroll, true);
    this._globalListenersBound = false;
  }

  private _clearActiveState(): void {
    if (!this._portalEl) return;
    this._portalEl.querySelectorAll<HTMLElement>(itemSelector()).forEach((item) => item.removeAttribute('data-active'));
  }

  private _queryItems(): MenuItem[] {
    if (!this._portalEl) return [];
    return Array.from(this._portalEl.querySelectorAll<MenuItem>(itemSelector())).filter((item) => !isDisabledItem(item));
  }

  private _focusItem(item: MenuItem | null): void {
    if (!item) return;
    this._clearActiveState();
    item.setAttribute('data-active', 'true');
    try {
      item.focus({ preventScroll: true });
    } catch {
      item.focus();
    }
    if (typeof item.scrollIntoView === 'function') {
      item.scrollIntoView({ block: 'nearest' });
    }
  }

  private _focusFirstItem(): void {
    this._focusItem(this._queryItems()[0] || null);
  }

  private _focusLastItem(): void {
    const items = this._queryItems();
    this._focusItem(items[items.length - 1] || null);
  }

  private _moveFocus(step: 1 | -1): void {
    const items = this._queryItems();
    if (!items.length) return;
    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? items.findIndex((item) => item === active || item.contains(active)) : -1;
    const nextIndex = currentIndex === -1 ? 0 : Math.max(0, Math.min(items.length - 1, currentIndex + step));
    this._focusItem(items[nextIndex] || null);
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
    if (!this.typeahead || !this._isTypeaheadKey(event)) return false;
    this._typeaheadBuffer = `${this._typeaheadBuffer}${event.key.toLowerCase()}`.slice(0, 24);
    if (this._typeaheadTimer != null) window.clearTimeout(this._typeaheadTimer);
    this._typeaheadTimer = window.setTimeout(() => this._resetTypeahead(), 420);
    const active = document.activeElement as HTMLElement | null;
    const items = this._queryItems();
    if (!items.length) return false;
    const currentIndex = active ? items.findIndex((item) => item === active || item.contains(active)) : -1;
    const ordered = currentIndex >= 0 ? [...items.slice(currentIndex + 1), ...items.slice(0, currentIndex + 1)] : items;
    const match = ordered.find((item) => (item.textContent || '').trim().toLowerCase().startsWith(this._typeaheadBuffer));
    if (!match) return false;
    event.preventDefault();
    this._focusItem(match);
    return true;
  }

  private _applySelectionBehavior(item: MenuItem): void {
    const role = item.getAttribute('role');
    if (role === 'menuitemcheckbox') {
      const checked = item.getAttribute('aria-checked') === 'true';
      item.setAttribute('aria-checked', checked ? 'false' : 'true');
      item.setAttribute('data-state', checked ? 'unchecked' : 'checked');
      return;
    }
    if (role !== 'menuitemradio' || !this._portalEl) return;
    const group = item.getAttribute('data-group') || item.getAttribute('name') || '';
    this._portalEl.querySelectorAll<MenuItem>('[role="menuitemradio"]').forEach((radio) => {
      const radioGroup = radio.getAttribute('data-group') || radio.getAttribute('name') || '';
      if (group && radioGroup !== group) return;
      radio.setAttribute('aria-checked', radio === item ? 'true' : 'false');
      radio.setAttribute('data-state', radio === item ? 'checked' : 'unchecked');
    });
  }

  private _handleItemSelect(item: MenuItem): void {
    this._applySelectionBehavior(item);
    const rawIndex = item.getAttribute('data-index');
    const index = rawIndex != null && !Number.isNaN(Number(rawIndex)) ? Number(rawIndex) : undefined;
    this.dispatchEvent(
      new CustomEvent('select', {
        bubbles: true,
        detail: {
          index,
          value: item.getAttribute('data-value') || item.getAttribute('value') || undefined,
          label: item.getAttribute('aria-label') || item.textContent?.trim() || undefined,
          checked: item.getAttribute('aria-checked') === 'true',
          item
        }
      })
    );
    if (this.closeOnSelect) this.close();
    else this._focusItem(item);
  }

  private _buildLegacyItems(container: HTMLElement): number {
    const items = this._getItemSources();
    items.forEach((source, index) => {
      const clone = source.cloneNode(true) as HTMLElement;
      clone.removeAttribute('slot');
       if (!clone.getAttribute('role')) clone.setAttribute('role', 'menuitem');
       if (!clone.classList.contains('item')) clone.classList.add('item');
       if (!clone.hasAttribute('tabindex')) clone.setAttribute('tabindex', '-1');
       if (!clone.hasAttribute('data-index')) clone.setAttribute('data-index', String(index));
      container.appendChild(clone);
    });
    return items.length;
  }

  private _hydrateMenuItems(container: HTMLElement): number {
    const items = Array.from(container.querySelectorAll<MenuItem>(itemSelector()));
    items.forEach((item, index) => {
      if (!item.getAttribute('role')) item.setAttribute('role', 'menuitem');
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1');
      if (!item.classList.contains('item')) item.classList.add('item');
      if (!item.hasAttribute('data-index')) item.setAttribute('data-index', String(index));
    });
    return items.length;
  }

  private _applyPortalTokens(menu: HTMLElement): void {
    const computed = window.getComputedStyle(this);
    MENU_TOKEN_NAMES.forEach((name) => {
      const value = computed.getPropertyValue(name).trim();
      if (value) menu.style.setProperty(name, value);
      else menu.style.removeProperty(name);
    });
  }

  private _applyPortalVariantData(menu: HTMLElement): void {
    const variant = readVariantValue(this, 'variant');
    const size = normalizeMenuSize(this.getAttribute('size') || this.getAttribute('density'));
    const density = readVariantValue(this, 'density');
    const radius = this.getAttribute('radius');
    const shape = readVariantValue(this, 'shape');
    const elevation = readVariantValue(this, 'elevation');
    const tone = readVariantValue(this, 'tone');

    const normalizedVariant =
      variant === 'default' || variant === '' ? '' :
      variant === 'line' ? 'outline' :
      variant === 'glass' ? 'soft' :
      variant;

    if (normalizedVariant) menu.setAttribute('data-variant', normalizedVariant);
    else menu.removeAttribute('data-variant');
    if (size !== 'md') menu.setAttribute('data-size', size);
    else menu.removeAttribute('data-size');
    if (density && density !== 'default') menu.setAttribute('data-density', density);
    else menu.removeAttribute('data-density');
    if (elevation && elevation !== 'default') menu.setAttribute('data-elevation', elevation);
    else menu.removeAttribute('data-elevation');
    const normalizedTone = tone === 'default' || tone === 'brand' || tone === '' ? '' : tone;
    if (normalizedTone) menu.setAttribute('data-tone', normalizedTone);
    else menu.removeAttribute('data-tone');
    const normalizedRadius = normalizeMenuRadius(radius || shape || null);
    if (normalizedRadius) {
      menu.style.setProperty('--ui-menu-radius', normalizedRadius);
      menu.style.setProperty('--ui-menu-item-radius', normalizedRadius === '999px' ? '999px' : `calc(${normalizedRadius} - 2px)`);
    } else {
      menu.style.removeProperty('--ui-menu-radius');
      menu.style.removeProperty('--ui-menu-item-radius');
    }
  }

  private _syncPortalVisualState(): void {
    if (!this._portalEl) return;
    this._applyPortalTokens(this._portalEl);
    this._applyPortalVariantData(this._portalEl);
    this._portalEl.setAttribute('aria-hidden', 'false');
    this._portalEl.setAttribute('aria-busy', 'false');
    this._portalEl.style.display = 'block';
    this._portalEl.style.visibility = 'visible';
    this._portalEl.style.opacity = '1';
    this._portalEl.style.transform = 'translateY(0px) scale(1)';
    this._portalEl.style.pointerEvents = 'auto';
  }

  private _attachMenuEvents(menu: HTMLElement): void {
    this._menuClickHandler = (event: MouseEvent) => {
      const item = firstMatchingItemFromEvent(event);
      if (!item || isDisabledItem(item)) return;
      this._handleItemSelect(item);
    };
    menu.addEventListener('click', this._menuClickHandler);
    menu.addEventListener('mouseover', (event: MouseEvent) => {
      const item = firstMatchingItemFromEvent(event);
      if (!item || isDisabledItem(item)) return;
      this._focusItem(item);
    });
    menu.addEventListener('focusin', (event: FocusEvent) => {
      const item = firstMatchingItemFromEvent(event);
      if (!item || isDisabledItem(item)) return;
      this._focusItem(item);
    });
    menu.addEventListener('mouseleave', () => this._clearActiveState());
  }

  private _buildPortalElement(): HTMLElement {
    const menu = document.createElement('div');
    menu.className = 'surface menu';
    menu.id = this._menuId;
    menu.setAttribute('part', 'menu');
    menu.setAttribute('role', 'menu');
    menu.setAttribute('tabindex', '-1');
    menu.setAttribute('aria-hidden', 'false');
    menu.setAttribute('aria-busy', 'false');
    menu.setAttribute('data-placement', normalizePlacement(this.getAttribute('placement')));

    const styleEl = document.createElement('style');
    styleEl.textContent = menuStyle;
    menu.appendChild(styleEl);

    const source = this._getContentSource();
    let itemCount = 0;
    if (source) {
      const clone = source.cloneNode(true) as HTMLElement;
      clone.removeAttribute('slot');
      menu.appendChild(clone);
    } else {
      itemCount = this._buildLegacyItems(menu);
    }

    itemCount = this._hydrateMenuItems(menu) || itemCount;
    if (itemCount === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No items';
      menu.appendChild(empty);
    }

    this._applyPortalTokens(menu);
    this._applyPortalVariantData(menu);
    menu.style.display = 'block';
    menu.style.visibility = 'visible';
    menu.style.opacity = '1';
    menu.style.transform = 'translateY(0px) scale(1)';
    menu.style.pointerEvents = 'auto';
    this._attachMenuEvents(menu);
    return menu;
  }

  private _rebuildPortalContent(): void {
    if (!this._portalEl) return;
    const parent = this._portalEl.parentElement;
    if (!parent) return;
    const current = this._portalEl;
    const replacement = this._buildPortalElement();
    parent.replaceChild(replacement, current);
    this._portalEl = replacement;
    this._rebuildPositioner();
  }

  private _rebuildPositioner(): void {
    const trigger = this._getTrigger();
    if (!this._portalEl || !trigger) return;
    this._positioner?.destroy();
    this._positioner = createPositioner({
      anchor: trigger,
      floating: this._portalEl,
      placement: normalizePlacement(this.getAttribute('placement')),
      offset: 6,
      flip: true,
      shift: true,
      fitViewport: true,
      observeScroll: false
    });
  }

  private _mountPortal(): void {
    const trigger = this._getTrigger();
    if (!trigger) return;
    if (!this._portalEl) {
      this._portalEl = this._buildPortalElement();
      const root = createPortalContainer();
      if (!root) {
        this._portalEl = null;
        return;
      }
      root.appendChild(this._portalEl);
    } else {
      this._syncPortalVisualState();
    }
    this._rebuildPositioner();
    this._dismissableLayer?.destroy();
    this._dismissableLayer = createDismissableLayer({
      node: this._portalEl,
      trigger,
      closeOnEscape: true,
      closeOnPointerOutside: true,
      onDismiss: () => this.close()
    });
  }

  private _teardownPortal(): void {
    this._dismissableLayer?.destroy();
    this._dismissableLayer = null;
    this._positioner?.destroy();
    this._positioner = null;
    if (this._portalEl?.parentElement) {
      try {
        this._portalEl.parentElement.removeChild(this._portalEl);
      } catch {
        // no-op
      }
    }
    this._portalEl = null;
    this._menuClickHandler = null;
    this._resetTypeahead();
  }

  private _isEventInsideTrigger(event: Event): boolean {
    const trigger = this._getTrigger();
    return !!trigger && event.composedPath().includes(trigger);
  }

  private _isEventInsideMenu(event: Event): boolean {
    return !!this._portalEl && event.composedPath().includes(this._portalEl);
  }

  private _onHostClick(event: Event): void {
    if (this.hasAttribute('disabled')) return;
    if (!this._isEventInsideTrigger(event)) return;
    event.preventDefault();
    this.toggle();
  }

  private _onDocumentScroll(event: Event): void {
    if (!this._isOpen || !this.closeOnScroll) return;
    const path = typeof (event as any).composedPath === 'function' ? (event as any).composedPath() : [];
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

    if (!this._isEventInsideTrigger(event) && !this._isEventInsideMenu(event)) return;
    if (this._handleTypeahead(event)) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
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
      const item = active.closest(itemSelector()) as MenuItem | null;
      if (!item || isDisabledItem(item)) return;
      event.preventDefault();
      this._handleItemSelect(item);
    }
  }

  protected render(): void {
    this.setContent(`
      <style>${hostStyle}</style>
      <div class="trigger" part="trigger">
        <slot name="trigger"></slot>
      </div>
      <div class="source-slot" aria-hidden="true">
        <slot name="item"></slot>
        <slot name="content"></slot>
      </div>
      <slot></slot>
    `);
    this._syncTriggerA11y();
    if (this._isOpen && !this._portalEl) this._mountPortal();
    else if (this._isOpen) this._positioner?.update();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-menu')) {
  customElements.define('ui-menu', UIMenu);
}
