import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

type DropdownPlacement = 'top' | 'bottom' | 'left' | 'right';
type DropdownCloseReason = 'outside' | 'escape' | 'select' | 'trigger' | 'tab' | 'programmatic' | 'disabled';

type DropdownItem = HTMLElement & { disabled?: boolean };

export type UIDropdownChangeDetail = {
  open: boolean;
  reason?: DropdownCloseReason;
};

export type UIDropdownSelectDetail = {
  value?: string;
  label?: string;
  checked?: boolean;
  item?: HTMLElement;
};

export type UIDropdownRequestCloseDetail = {
  reason: DropdownCloseReason;
};

const style = `
  :host {
    --ui-dropdown-menu-bg: var(--ui-color-surface, #ffffff);
    --ui-dropdown-menu-color: var(--ui-color-text, #0f172a);
    --ui-dropdown-menu-muted: var(--ui-color-muted, #64748b);
    --ui-dropdown-menu-min-width: 208px;
    --ui-dropdown-menu-ring: var(--ui-color-focus-ring, #2563eb);
    --ui-dropdown-menu-backdrop: none;
    --ui-dropdown-item-bg: transparent;
    --ui-dropdown-item-active-bg: color-mix(in srgb, var(--ui-dropdown-menu-ring, #2563eb) 19%, transparent);
    --ui-dropdown-item-hover-bg: color-mix(in srgb, var(--ui-dropdown-menu-ring, #2563eb) 11%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, var(--ui-dropdown-menu-ring, #2563eb) 16%, transparent);
    --ui-dropdown-duration: 170ms;
    --ui-dropdown-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
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
    --ui-dropdown-item-radius: 10px;
    --ui-dropdown-item-gap: 11px;
    --ui-dropdown-item-min-height: 38px;
    --ui-dropdown-item-pad-y: 8px;
    --ui-dropdown-item-pad-x: 12px;
    --ui-dropdown-item-font-size: 13px;
    --ui-dropdown-item-font-weight: 550;
    --ui-dropdown-item-line-height: 1.3;
    --ui-dropdown-separator-margin: 6px 10px;
    --ui-dropdown-menu-arrow-size: 0px;

    position: absolute;
    display: grid;
    gap: 1px;
    min-width: var(--ui-dropdown-menu-min-width, 208px);
    max-width: min(380px, calc(100vw - 16px));
    max-height: min(440px, calc(100vh - 16px));
    padding: var(--ui-dropdown-menu-padding, 0px);
    border: var(--ui-dropdown-menu-border, 0);
    border-radius: var(--ui-dropdown-menu-radius, 0px);
    box-sizing: border-box;
    overflow: auto;
    isolation: isolate;
    background: var(--ui-dropdown-menu-bg, #fff);
    color: var(--ui-dropdown-menu-color, #0f172a);
    box-shadow: var(--ui-dropdown-menu-shadow, none);
    backdrop-filter: var(--ui-dropdown-menu-backdrop, none);
    pointer-events: auto;
    outline: none;
    scrollbar-gutter: stable both-edges;
    transform-origin: top center;
    will-change: transform, opacity;
    z-index: var(--ui-dropdown-z, 1550);
    animation: ui-dropdown-enter var(--ui-dropdown-duration, 170ms) var(--ui-dropdown-easing, cubic-bezier(0.2, 0.8, 0.2, 1)) both;
  }

  .menu[data-state='closing'] {
    pointer-events: none;
    animation: ui-dropdown-exit calc(var(--ui-dropdown-duration, 170ms) - 30ms) cubic-bezier(0.4, 0.12, 1, 1) both;
  }

  .menu[data-shape='square'] {
    --ui-dropdown-menu-radius: 5px;
    --ui-dropdown-item-radius: 4px;
  }

  .menu[data-shape='soft'] {
    --ui-dropdown-menu-radius: 18px;
    --ui-dropdown-item-radius: 12px;
  }

  .menu[data-density='compact'] {
    --ui-dropdown-menu-padding: 4px;
    --ui-dropdown-item-min-height: 31px;
    --ui-dropdown-item-pad-y: 5px;
    --ui-dropdown-item-pad-x: 9px;
    --ui-dropdown-item-font-size: 12px;
    --ui-dropdown-item-gap: 8px;
    --ui-dropdown-separator-margin: 4px 8px;
  }

  .menu[data-density='comfortable'] {
    --ui-dropdown-menu-padding: 7px;
    --ui-dropdown-item-min-height: 40px;
    --ui-dropdown-item-pad-y: 9px;
    --ui-dropdown-item-pad-x: 13px;
    --ui-dropdown-item-font-size: 14px;
    --ui-dropdown-item-gap: 12px;
    --ui-dropdown-separator-margin: 7px 11px;
  }

  .menu[data-elevation='none'] {
    --ui-dropdown-menu-shadow: none;
  }

  .menu[data-elevation='low'] {
    --ui-dropdown-menu-shadow:
      0 1px 2px rgba(2, 6, 23, 0.06),
      0 12px 28px rgba(2, 6, 23, 0.16);
  }

  .menu[data-elevation='high'] {
    --ui-dropdown-menu-shadow:
      0 2px 4px rgba(2, 6, 23, 0.1),
      0 30px 72px rgba(2, 6, 23, 0.26);
  }

  .menu[data-variant='solid'] {
    background: var(--ui-dropdown-menu-bg, #fff);
    --ui-dropdown-menu-backdrop: none;
  }

  .menu[data-variant='glass'] {
    background: color-mix(in srgb, var(--ui-dropdown-menu-bg, #fff) 88%, #ffffff 12%);
    --ui-dropdown-menu-backdrop: blur(14px) saturate(1.08);
  }

  .menu[data-variant='flat'] {
    --ui-dropdown-menu-shadow: none;
    background: var(--ui-dropdown-menu-bg, #fff);
  }

  .menu[data-variant='line'] {
    --ui-dropdown-menu-shadow: none;
    --ui-dropdown-menu-radius: 9px;
    border-color: var(--ui-dropdown-menu-border-color, currentColor);
    background: color-mix(in srgb, var(--ui-dropdown-menu-bg, #fff) 98%, transparent);
  }

  .menu[data-variant='contrast'] {
    --ui-dropdown-menu-bg: #0f172a;
    --ui-dropdown-menu-color: #f8fafc;
    --ui-dropdown-menu-muted: #94a3b8;
    --ui-dropdown-menu-border-color: #334155;
    --ui-dropdown-menu-ring: #93c5fd;
    --ui-dropdown-item-hover-bg: color-mix(in srgb, #ffffff 12%, transparent);
    --ui-dropdown-item-active-bg: color-mix(in srgb, #ffffff 18%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, #ffffff 16%, transparent);
  }

  .menu[data-tone='danger'] {
    --ui-dropdown-menu-ring: var(--ui-color-danger, #dc2626);
    --ui-dropdown-item-hover-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 12%, transparent);
    --ui-dropdown-item-active-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 18%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 16%, transparent);
  }

  .menu[data-tone='success'] {
    --ui-dropdown-menu-ring: var(--ui-color-success, #16a34a);
    --ui-dropdown-item-hover-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 12%, transparent);
    --ui-dropdown-item-active-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 18%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 16%, transparent);
  }

  .menu[data-tone='warning'] {
    --ui-dropdown-menu-ring: var(--ui-color-warning, #d97706);
    --ui-dropdown-item-hover-bg: color-mix(in srgb, var(--ui-color-warning, #d97706) 15%, transparent);
    --ui-dropdown-item-active-bg: color-mix(in srgb, var(--ui-color-warning, #d97706) 20%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, var(--ui-color-warning, #d97706) 17%, transparent);
  }

  .menu[data-variant='flat']::before,
  .menu[data-variant='flat']::after,
  .menu[data-variant='line']::before,
  .menu[data-variant='line']::after {
    display: none;
  }

  .menu::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 52%, transparent);
    opacity: 0.46;
  }

  .menu::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 0;
    pointer-events: none;
    background: transparent;
    opacity: 0;
  }

  .menu[data-placement='top'] {
    transform-origin: bottom center;
  }

  .menu[data-placement='left'] {
    transform-origin: center right;
  }

  .menu[data-placement='right'] {
    transform-origin: center left;
  }

  .menu [role='menuitem'],
  .menu [role='menuitemcheckbox'],
  .menu [role='menuitemradio'],
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
    border: 1px solid transparent;
    border-radius: var(--ui-dropdown-item-radius, 8px);
    background: var(--ui-dropdown-item-bg, transparent);
    color: inherit;
    font: var(--ui-dropdown-item-font-weight, 560) var(--ui-dropdown-item-font-size, 13px)/var(--ui-dropdown-item-line-height, 1.3)
      Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    letter-spacing: -0.005em;
    text-align: left;
    cursor: default;
    outline: none;
    user-select: none;
    white-space: nowrap;
    position: relative;
    transition:
      background-color 130ms ease,
      color 130ms ease,
      border-color 130ms ease,
      box-shadow 130ms ease,
      transform 130ms ease;
  }

  .menu [role='menuitem']:hover,
  .menu [role='menuitem']:focus-visible,
  .menu [role='menuitemcheckbox']:hover,
  .menu [role='menuitemcheckbox']:focus-visible,
  .menu [role='menuitemradio']:hover,
  .menu [role='menuitemradio']:focus-visible,
  .menu .item:hover,
  .menu .item:focus-visible,
  .menu [data-menu-item]:hover,
  .menu [data-menu-item]:focus-visible,
  .menu [data-active='true'] {
    background: var(--ui-dropdown-item-hover-bg);
    border-color: color-mix(in srgb, var(--ui-dropdown-menu-ring, #2563eb) 24%, transparent);
  }

  .menu [role='menuitem']:not([aria-disabled='true']):active,
  .menu [role='menuitemcheckbox']:not([aria-disabled='true']):active,
  .menu [role='menuitemradio']:not([aria-disabled='true']):active,
  .menu .item:not([aria-disabled='true']):active,
  .menu [data-menu-item]:not([aria-disabled='true']):active {
    background: var(--ui-dropdown-item-active-bg);
    transform: translateY(1px);
  }

  .menu [role='menuitem']:focus-visible,
  .menu [role='menuitemcheckbox']:focus-visible,
  .menu [role='menuitemradio']:focus-visible,
  .menu .item:focus-visible,
  .menu [data-menu-item]:focus-visible {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-dropdown-menu-ring, #2563eb) 58%, transparent);
    border-color: color-mix(in srgb, var(--ui-dropdown-menu-ring, #2563eb) 42%, transparent);
  }

  .menu [role='menuitemcheckbox'][aria-checked='true'],
  .menu [role='menuitemradio'][aria-checked='true'] {
    background: var(--ui-dropdown-item-checked-bg);
    border-color: color-mix(in srgb, var(--ui-dropdown-menu-ring, #2563eb) 28%, transparent);
  }

  .menu [aria-disabled='true'],
  .menu [disabled] {
    opacity: 0.52;
    pointer-events: none;
  }

  .menu [role='separator'],
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

  .menu .description {
    display: block;
    grid-column: 2;
    margin-top: 2px;
    font-size: 11px;
    line-height: 1.35;
    color: var(--ui-dropdown-menu-muted, #64748b);
    white-space: normal;
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
    font: 500 12px/1.45 Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    letter-spacing: 0.01em;
    color: var(--ui-dropdown-menu-muted, #64748b);
  }

  @keyframes ui-dropdown-enter {
    from {
      opacity: 0;
      transform: translateY(5px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes ui-dropdown-exit {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(5px) scale(0.985);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .menu {
      animation: none !important;
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

    .menu [role='menuitem'],
    .menu [role='menuitemcheckbox'],
    .menu [role='menuitemradio'],
    .menu .item,
    .menu [data-menu-item],
    .menu .empty-state {
      border: 1px solid transparent;
      background: Canvas;
      color: CanvasText;
    }

    .menu [role='menuitem']:hover,
    .menu [role='menuitem']:focus-visible,
    .menu [role='menuitemcheckbox']:hover,
    .menu [role='menuitemcheckbox']:focus-visible,
    .menu [role='menuitemradio']:hover,
    .menu [role='menuitemradio']:focus-visible,
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

function toBool(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = raw.trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

const DROPDOWN_VISUAL_ATTRS = new Set(['variant', 'density', 'shape', 'elevation', 'tone']);
const DROPDOWN_A11Y_ATTRS = new Set(['aria-label', 'aria-labelledby', 'aria-describedby']);
const DROPDOWN_TOKEN_NAMES = [
  '--ui-dropdown-menu-bg',
  '--ui-dropdown-menu-color',
  '--ui-dropdown-menu-muted',
  '--ui-dropdown-menu-border-color',
  '--ui-dropdown-menu-border',
  '--ui-dropdown-menu-shadow',
  '--ui-dropdown-menu-radius',
  '--ui-dropdown-menu-padding',
  '--ui-dropdown-menu-min-width',
  '--ui-dropdown-menu-ring',
  '--ui-dropdown-menu-backdrop',
  '--ui-dropdown-item-hover-bg',
  '--ui-dropdown-item-active-bg',
  '--ui-dropdown-duration',
  '--ui-dropdown-easing'
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
      'typeahead',
      'aria-label',
      'aria-labelledby',
      'aria-describedby'
    ];
  }

  private static _openStack: UIDropdown[] = [];

  private _isOpen = false;
  private _cleanup: (() => void) | null = null;
  private _portalEl: HTMLElement | null = null;
  private _menuId: string;
  private _triggerId: string;
  private _restoreFocusEl: HTMLElement | null = null;
  private _typeaheadBuffer = '';
  private _typeaheadTimer: number | null = null;
  private _globalListenersBound = false;
  private _closeReason: DropdownCloseReason = 'programmatic';

  constructor() {
    super();
    this._menuId = `ui-dropdown-menu-${Math.random().toString(36).slice(2, 10)}`;
    this._triggerId = `ui-dropdown-trigger-${Math.random().toString(36).slice(2, 10)}`;
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
    this._removeFromStack();
    this._teardownPortal(false);
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'open') {
      this._syncOpenState();
      return;
    }

    if (name === 'close-on-select' || name === 'typeahead') return;

    if (name === 'disabled') {
      if (this.hasAttribute('disabled') && this._isOpen) this.close('disabled');
      this._syncTriggerA11y();
      return;
    }

    if (name === 'placement' && this._isOpen) {
      this._rebuildPortal(false);
      return;
    }

    if (this._isOpen && DROPDOWN_VISUAL_ATTRS.has(name)) {
      this._syncPortalVisualState();
      return;
    }

    if (this._isOpen && DROPDOWN_A11Y_ATTRS.has(name)) {
      this._syncPortalA11y();
    }
  }

  open(): void {
    if (this.hasAttribute('disabled')) return;
    this.setAttribute('open', '');
  }

  close(reason: DropdownCloseReason = 'programmatic'): void {
    if (!this.hasAttribute('open')) return;
    this._closeReason = reason;
    this.removeAttribute('open');
  }

  closeDropdown(reason: DropdownCloseReason = 'programmatic'): void {
    if (!this.hasAttribute('open')) return;
    if (reason === 'programmatic') {
      this.close('programmatic');
      return;
    }
    this._requestClose(reason);
  }

  toggle(): void {
    if (this.hasAttribute('open')) {
      this._requestClose('trigger');
      return;
    }
    this.open();
  }

  get closeOnSelect(): boolean {
    return toBool(this.getAttribute('close-on-select'), true);
  }

  set closeOnSelect(value: boolean) {
    this.setAttribute('close-on-select', value ? 'true' : 'false');
  }

  get typeahead(): boolean {
    return toBool(this.getAttribute('typeahead'), true);
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

  private _isFocusable(node: HTMLElement): boolean {
    if (!node || !node.isConnected) return false;
    if ((node as HTMLButtonElement).disabled) return false;
    if (node.getAttribute('aria-hidden') === 'true') return false;
    if (!isBrowser()) return true;
    const style = window.getComputedStyle(node);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  private _isTopMost(): boolean {
    const stack = UIDropdown._openStack;
    return stack.length > 0 && stack[stack.length - 1] === this;
  }

  private _pushToStack(): void {
    const stack = UIDropdown._openStack;
    const index = stack.indexOf(this);
    if (index >= 0) stack.splice(index, 1);
    stack.push(this);
  }

  private _removeFromStack(): void {
    const stack = UIDropdown._openStack;
    const index = stack.indexOf(this);
    if (index >= 0) stack.splice(index, 1);
  }

  private _syncTriggerA11y(): void {
    const trigger = this._getTrigger();
    if (!trigger) return;

    if (!trigger.id) trigger.id = this._triggerId;

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

  private _requestClose(reason: DropdownCloseReason): void {
    if (!this._isOpen) return;

    const requestClose = new CustomEvent<UIDropdownRequestCloseDetail>('request-close', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.dispatchEvent(requestClose);

    const uiRequestClose = new CustomEvent<UIDropdownRequestCloseDetail>('ui-request-close', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.dispatchEvent(uiRequestClose);

    if (requestClose.defaultPrevented || uiRequestClose.defaultPrevented) return;

    this.close(reason);
  }

  private _syncOpenState(): void {
    const nowOpen = this.hasAttribute('open') && !this.hasAttribute('disabled');

    if (nowOpen === this._isOpen) {
      if (nowOpen) {
        this._pushToStack();
        this._bindGlobalListeners();
        if (!this._portalEl) this._rebuildPortal(false);
      } else {
        this._unbindGlobalListeners();
      }
      this._syncTriggerA11y();
      return;
    }

    this._isOpen = nowOpen;
    this._syncTriggerA11y();

    if (nowOpen) {
      this._pushToStack();
      this._bindGlobalListeners();
      this._restoreFocusEl = (document.activeElement as HTMLElement) || null;
      this._closeReason = 'programmatic';
      this._rebuildPortal(false);

      this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
      this.dispatchEvent(
        new CustomEvent<UIDropdownChangeDetail>('change', {
          bubbles: true,
          composed: true,
          detail: { open: true }
        })
      );

      requestAnimationFrame(() => this._focusFirstItem());
      return;
    }

    this._removeFromStack();
    this._unbindGlobalListeners();

    const reason = this._closeReason;
    const shouldRestoreFocus = reason !== 'tab';
    this._teardownPortal(true);

    this.dispatchEvent(
      new CustomEvent<UIDropdownChangeDetail>('change', {
        bubbles: true,
        composed: true,
        detail: { open: false, reason }
      })
    );
    this.dispatchEvent(
      new CustomEvent<{ reason: DropdownCloseReason }>('close', {
        bubbles: true,
        composed: true,
        detail: { reason }
      })
    );

    if (shouldRestoreFocus) {
      const trigger = this._getTrigger();
      if (trigger && this._isFocusable(trigger)) {
        try {
          trigger.focus();
        } catch {
          // no-op
        }
      } else if (this._restoreFocusEl && this._isFocusable(this._restoreFocusEl)) {
        try {
          this._restoreFocusEl.focus();
        } catch {
          // no-op
        }
      }
    }

    this._restoreFocusEl = null;
    this._closeReason = 'programmatic';
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.addEventListener('keydown', this._onDocumentKeyDown, true);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.removeEventListener('keydown', this._onDocumentKeyDown, true);
    this._globalListenersBound = false;
  }

  private _syncMenuItemSemantics(menu: HTMLElement): void {
    const items = Array.from(menu.querySelectorAll<DropdownItem>(menuItemSelector()));
    items.forEach((item) => {
      if (!item.getAttribute('role')) item.setAttribute('role', 'menuitem');
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1');
      if (item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true') {
        item.setAttribute('aria-disabled', 'true');
      }
      if ((item.getAttribute('role') === 'menuitemcheckbox' || item.getAttribute('role') === 'menuitemradio') && !item.hasAttribute('aria-checked')) {
        item.setAttribute('aria-checked', 'false');
      }
    });
  }

  private _buildPortalContent(): HTMLElement {
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = this._menuId;
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-orientation', 'vertical');
    menu.setAttribute('tabindex', '-1');
    menu.setAttribute('data-state', 'open');

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

    this._syncMenuItemSemantics(menu);
    this._syncPortalA11y(menu);

    menu.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const item = target.closest(menuItemSelector()) as DropdownItem | null;
      if (!item || isDisabledItem(item)) return;

      this._applySelectionBehavior(item);
      this._focusItem(item);

      const detail: UIDropdownSelectDetail = {
        value: item.getAttribute('data-value') || item.getAttribute('value') || undefined,
        label: item.getAttribute('aria-label') || item.textContent?.trim() || undefined,
        checked: item.getAttribute('aria-checked') === 'true',
        item
      };

      this.dispatchEvent(
        new CustomEvent<UIDropdownSelectDetail>('select', {
          bubbles: true,
          composed: true,
          detail
        })
      );

      if (this.closeOnSelect) {
        this._requestClose('select');
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

  private _syncPortalA11y(menuEl?: HTMLElement): void {
    const menu = menuEl || this._portalEl;
    if (!menu) return;

    const trigger = this._getTrigger();
    const ariaLabel = this.getAttribute('aria-label') || '';
    const explicitLabelledBy = this.getAttribute('aria-labelledby') || '';
    const explicitDescribedBy = this.getAttribute('aria-describedby') || '';

    const labelledBy = explicitLabelledBy || (!ariaLabel && trigger?.id ? trigger.id : '');

    if (ariaLabel) menu.setAttribute('aria-label', ariaLabel);
    else menu.removeAttribute('aria-label');

    if (labelledBy) menu.setAttribute('aria-labelledby', labelledBy);
    else menu.removeAttribute('aria-labelledby');

    if (explicitDescribedBy) menu.setAttribute('aria-describedby', explicitDescribedBy);
    else menu.removeAttribute('aria-describedby');
  }

  private _syncPortalVisualState(): void {
    const menu = this._portalEl;
    if (!menu) return;
    this._applyPortalVariantData(menu);
    this._applyPortalTokens(menu);
  }

  private _rebuildPortal(animateClose = false): void {
    if (!this._isOpen) return;
    const trigger = this._getTrigger();
    if (!trigger) return;

    this._teardownPortal(animateClose);

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

  private _canAnimateClose(): boolean {
    if (!isBrowser()) return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private _teardownPortal(animateClose: boolean): void {
    const menu = this._portalEl;
    const cleanup = this._cleanup;

    this._portalEl = null;
    this._cleanup = null;

    const finalize = () => {
      if (cleanup) {
        try {
          cleanup();
        } catch {
          // no-op
        }
      } else if (menu && menu.parentElement) {
        try {
          menu.parentElement.removeChild(menu);
        } catch {
          // no-op
        }
      }
      this._resetTypeahead();
    };

    if (!menu) {
      finalize();
      return;
    }

    if (!animateClose || !this._canAnimateClose()) {
      finalize();
      return;
    }

    menu.setAttribute('data-state', 'closing');

    let done = false;
    const complete = () => {
      if (done) return;
      done = true;
      finalize();
    };

    menu.addEventListener('animationend', complete, { once: true });
    window.setTimeout(complete, 220);
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
    const items = this._queryItems();
    items.forEach((node) => {
      node.setAttribute('tabindex', node === item ? '0' : '-1');
      if (node === item) node.setAttribute('data-active', 'true');
      else node.removeAttribute('data-active');
    });

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

    this._focusItem(items[0]);
  }

  private _focusLastItem(): void {
    const items = this._queryItems();
    if (items.length === 0) {
      this._focusMenu();
      return;
    }

    this._focusItem(items[items.length - 1]);
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
    this._focusItem(items[next]);
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

    const key = event.key.toLowerCase();
    this._typeaheadBuffer = `${this._typeaheadBuffer}${key}`.slice(0, 24);
    if (this._typeaheadTimer != null) {
      window.clearTimeout(this._typeaheadTimer);
    }
    this._typeaheadTimer = window.setTimeout(() => this._resetTypeahead(), 460);

    const active = document.activeElement as HTMLElement | null;
    const activeIndex = active ? items.indexOf(active as DropdownItem) : -1;

    const findFrom = (start: number): DropdownItem | undefined => {
      for (let offset = 1; offset <= items.length; offset += 1) {
        const index = (start + offset + items.length) % items.length;
        const candidate = items[index];
        const text = (candidate.getAttribute('aria-label') || candidate.textContent || '').trim().toLowerCase();
        if (text.startsWith(this._typeaheadBuffer)) return candidate;
      }
      return undefined;
    };

    const matched = findFrom(activeIndex);
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
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    return path.includes(trigger);
  }

  private _onHostClick(event: Event): void {
    if (this.hasAttribute('disabled')) return;
    if (!this._isEventInsideTrigger(event)) return;

    event.preventDefault();
    if (this._isOpen) {
      this._requestClose('trigger');
      return;
    }

    this.open();
  }

  private _onDocumentPointerDown(event: PointerEvent): void {
    if (!this._isOpen || !this._isTopMost()) return;

    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    if (path.includes(this)) return;
    if (this._portalEl && path.includes(this._portalEl)) return;

    this._requestClose('outside');
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (!this._isOpen) {
      if (!this._isEventInsideTrigger(event)) return;
      if (!['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) return;

      event.preventDefault();
      this.open();
      requestAnimationFrame(() => {
        if (event.key === 'ArrowUp') this._focusLastItem();
        else this._focusFirstItem();
      });
      return;
    }

    if (!this._isTopMost()) return;
    if (this._handleTypeahead(event)) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this._requestClose('escape');
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
      this._requestClose('tab');
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
    if (this._isOpen && !this._portalEl) {
      this._rebuildPortal(false);
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
