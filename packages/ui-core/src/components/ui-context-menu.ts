import { ElementBase } from '../ElementBase';

type Point = { x: number; y: number };

type MenuLikeItem = HTMLElement & {
  disabled?: boolean;
};

const style = `
  :host {
    position: fixed;
    inset: 0;
    display: block;
    pointer-events: none;
    z-index: var(--ui-context-menu-z, 1600);
    color-scheme: light dark;

    --ui-context-menu-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-context-menu-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-context-menu-border-color: var(--ui-color-border, var(--ui-border, rgba(15, 23, 42, 0.14)));
    --ui-context-menu-border: 1px solid var(--ui-context-menu-border-color);
    --ui-context-menu-radius: 13px;
    --ui-context-menu-shadow:
      0 20px 44px rgba(2, 6, 23, 0.2),
      0 2px 10px rgba(2, 6, 23, 0.12);
    --ui-context-menu-min-width: 228px;
    --ui-context-menu-padding: 6px;
    --ui-context-menu-transition: 170ms cubic-bezier(0.2, 0.9, 0.24, 1);
    --ui-context-menu-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-context-menu-submenu-gap: 2px;
    --ui-context-menu-item-radius: 8px;
    --ui-context-menu-item-gap: 11px;
    --ui-context-menu-item-min-height: 36px;
    --ui-context-menu-item-pad-y: 8px;
    --ui-context-menu-item-pad-x: 11px;
    --ui-context-menu-item-font-size: 13px;
    --ui-context-menu-item-font-weight: 500;
    --ui-context-menu-item-line-height: 1.3;
    --ui-context-menu-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 16%, transparent),
        color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 10%, transparent)
      );
    --ui-context-menu-separator-margin: 6px 10px;
    --ui-context-menu-submenu-radius: 11px;
    --ui-context-menu-submenu-padding: 5px;
  }

  .surface {
    position: fixed;
    left: 0;
    top: 0;
    min-width: var(--ui-context-menu-min-width);
    max-width: min(360px, calc(100vw - 16px));
    padding: var(--ui-context-menu-padding);
    border: var(--ui-context-menu-border);
    border-radius: var(--ui-context-menu-radius);
    overflow: visible;
    isolation: isolate;
    background: var(--ui-context-menu-bg);
    color: var(--ui-context-menu-color);
    box-shadow: var(--ui-context-menu-shadow);
    backdrop-filter: none;
    opacity: 0;
    transform: translateY(5px) scale(0.982);
    transform-origin: top left;
    pointer-events: none;
    transition:
      opacity var(--ui-context-menu-transition),
      transform var(--ui-context-menu-transition);
    outline: none;
  }

  .surface::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, #ffffff 56%, transparent);
    opacity: 0.82;
  }

  .surface::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 14px;
    pointer-events: none;
    background: linear-gradient(180deg, color-mix(in srgb, #ffffff 26%, transparent), transparent);
    opacity: 0.55;
  }

  :host([open]) {
    pointer-events: none;
  }

  :host([open]) .surface {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  :host([headless]) .surface {
    display: none;
  }

  :host([shape="square"]) {
    --ui-context-menu-radius: 4px;
    --ui-context-menu-item-radius: 3px;
    --ui-context-menu-submenu-radius: 4px;
  }

  :host([shape="soft"]) {
    --ui-context-menu-radius: 18px;
    --ui-context-menu-item-radius: 12px;
    --ui-context-menu-submenu-radius: 16px;
  }

  :host([density="compact"]) {
    --ui-context-menu-padding: 4px;
    --ui-context-menu-item-min-height: 30px;
    --ui-context-menu-item-pad-y: 5px;
    --ui-context-menu-item-pad-x: 9px;
    --ui-context-menu-item-font-size: 12px;
    --ui-context-menu-item-gap: 8px;
    --ui-context-menu-separator-margin: 4px 8px;
  }

  :host([density="comfortable"]) {
    --ui-context-menu-padding: 7px;
    --ui-context-menu-item-min-height: 40px;
    --ui-context-menu-item-pad-y: 9px;
    --ui-context-menu-item-pad-x: 13px;
    --ui-context-menu-item-font-size: 14px;
    --ui-context-menu-item-gap: 12px;
    --ui-context-menu-separator-margin: 7px 11px;
  }

  :host([elevation="none"]) {
    --ui-context-menu-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-context-menu-shadow:
      0 12px 28px rgba(2, 6, 23, 0.16),
      0 2px 6px rgba(2, 6, 23, 0.08);
  }

  :host([elevation="high"]) {
    --ui-context-menu-shadow:
      0 30px 72px rgba(2, 6, 23, 0.26),
      0 6px 18px rgba(2, 6, 23, 0.14);
  }

  :host([variant="solid"]) .surface {
    background: var(--ui-context-menu-bg);
    backdrop-filter: none;
  }

  :host([variant="flat"]) {
    --ui-context-menu-shadow: none;
  }

  :host([variant="flat"]) .surface::before,
  :host([variant="flat"]) .surface::after {
    display: none;
  }

  :host([variant="contrast"]) {
    --ui-context-menu-bg: #0f172a;
    --ui-context-menu-color: #f8fafc;
    --ui-context-menu-border-color: #334155;
    --ui-context-menu-ring: #93c5fd;
    --ui-context-menu-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #ffffff 18%, transparent),
        color-mix(in srgb, #ffffff 10%, transparent)
      );
  }

  :host([tone="danger"]) {
    --ui-context-menu-ring: #ef4444;
    --ui-context-menu-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #ef4444 18%, transparent),
        color-mix(in srgb, #ef4444 10%, transparent)
      );
  }

  :host([tone="success"]) {
    --ui-context-menu-ring: #16a34a;
    --ui-context-menu-item-hover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #16a34a 18%, transparent),
        color-mix(in srgb, #16a34a 10%, transparent)
      );
  }

  @media (prefers-reduced-motion: reduce) {
    .surface {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-context-menu-border: 2px solid var(--ui-context-menu-border-color);
      --ui-context-menu-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-context-menu-bg: Canvas;
      --ui-context-menu-color: CanvasText;
      --ui-context-menu-border-color: CanvasText;
      --ui-context-menu-shadow: none;
      --ui-context-menu-ring: Highlight;
    }

    .surface::before,
    .surface::after {
      display: none;
    }
  }
`;

const lightDomStyle = `
  ui-context-menu [slot="menu"],
  ui-context-menu [slot="content"] {
    display: grid;
    gap: 0;
    padding: 1px;
    box-sizing: border-box;
  }

  ui-context-menu [slot="menu"] .menuitem,
  ui-context-menu [slot="menu"] [role="menuitem"],
  ui-context-menu [slot="menu"] [role="menuitemcheckbox"],
  ui-context-menu [slot="menu"] [role="menuitemradio"],
  ui-context-menu [slot="content"] .menuitem,
  ui-context-menu [slot="content"] [role="menuitem"],
  ui-context-menu [slot="content"] [role="menuitemcheckbox"],
  ui-context-menu [slot="content"] [role="menuitemradio"] {
    --_menuitem-bg: transparent;
    --_menuitem-bg-hover: var(--ui-context-menu-item-hover-bg);
    --_menuitem-color: inherit;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    column-gap: var(--ui-context-menu-item-gap, 11px);
    min-height: var(--ui-context-menu-item-min-height, 36px);
    width: 100%;
    padding: var(--ui-context-menu-item-pad-y, 8px) var(--ui-context-menu-item-pad-x, 11px);
    border: 0;
    border-radius: var(--ui-context-menu-item-radius, 8px);
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    background: var(--_menuitem-bg);
    color: var(--_menuitem-color);
    font: var(--ui-context-menu-item-font-weight, 500) var(--ui-context-menu-item-font-size, 13px)/var(--ui-context-menu-item-line-height, 1.3) -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: 0.01em;
    text-align: left;
    cursor: default;
    user-select: none;
    white-space: nowrap;
    outline: none;
    position: relative;
    overflow: visible;
    transition: background-color 130ms ease, color 130ms ease, transform 130ms ease;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  ui-context-menu [slot="menu"] .menuitem[data-submenu-open="true"],
  ui-context-menu [slot="menu"] .menuitem:hover,
  ui-context-menu [slot="menu"] .menuitem:focus-within,
  ui-context-menu [slot="menu"] [role="menuitem"][data-submenu-open="true"],
  ui-context-menu [slot="menu"] [role="menuitem"]:hover,
  ui-context-menu [slot="menu"] [role="menuitem"]:focus-within,
  ui-context-menu [slot="content"] .menuitem[data-submenu-open="true"],
  ui-context-menu [slot="content"] .menuitem:hover,
  ui-context-menu [slot="content"] .menuitem:focus-within,
  ui-context-menu [slot="content"] [role="menuitem"][data-submenu-open="true"],
  ui-context-menu [slot="content"] [role="menuitem"]:hover,
  ui-context-menu [slot="content"] [role="menuitem"]:focus-within {
    z-index: 2;
  }

  ui-context-menu [slot="menu"] .menuitem:hover,
  ui-context-menu [slot="menu"] .menuitem:focus-visible,
  ui-context-menu [slot="menu"] [role="menuitem"]:hover,
  ui-context-menu [slot="menu"] [role="menuitem"]:focus-visible,
  ui-context-menu [slot="menu"] [role="menuitemcheckbox"]:hover,
  ui-context-menu [slot="menu"] [role="menuitemcheckbox"]:focus-visible,
  ui-context-menu [slot="menu"] [role="menuitemradio"]:hover,
  ui-context-menu [slot="menu"] [role="menuitemradio"]:focus-visible,
  ui-context-menu [slot="content"] .menuitem:hover,
  ui-context-menu [slot="content"] .menuitem:focus-visible,
  ui-context-menu [slot="content"] [role="menuitem"]:hover,
  ui-context-menu [slot="content"] [role="menuitem"]:focus-visible,
  ui-context-menu [slot="content"] [role="menuitemcheckbox"]:hover,
  ui-context-menu [slot="content"] [role="menuitemcheckbox"]:focus-visible,
  ui-context-menu [slot="content"] [role="menuitemradio"]:hover,
  ui-context-menu [slot="content"] [role="menuitemradio"]:focus-visible {
    background: var(--_menuitem-bg-hover);
  }

  ui-context-menu [slot="menu"] .menuitem:focus-visible,
  ui-context-menu [slot="menu"] [role="menuitem"]:focus-visible,
  ui-context-menu [slot="menu"] [role="menuitemcheckbox"]:focus-visible,
  ui-context-menu [slot="menu"] [role="menuitemradio"]:focus-visible,
  ui-context-menu [slot="content"] .menuitem:focus-visible,
  ui-context-menu [slot="content"] [role="menuitem"]:focus-visible,
  ui-context-menu [slot="content"] [role="menuitemcheckbox"]:focus-visible,
  ui-context-menu [slot="content"] [role="menuitemradio"]:focus-visible {
    box-shadow: inset 0 0 0 2px var(--ui-context-menu-ring, #2563eb);
  }

  ui-context-menu [slot="menu"] [role="menuitemcheckbox"][aria-checked="true"],
  ui-context-menu [slot="menu"] [role="menuitemradio"][aria-checked="true"],
  ui-context-menu [slot="content"] [role="menuitemcheckbox"][aria-checked="true"],
  ui-context-menu [slot="content"] [role="menuitemradio"][aria-checked="true"] {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-context-menu-ring, #2563eb) 22%, transparent),
        color-mix(in srgb, var(--ui-context-menu-ring, #2563eb) 12%, transparent)
      );
  }

  ui-context-menu [slot="menu"] .menuitem[aria-disabled="true"],
  ui-context-menu [slot="menu"] [role="menuitem"][aria-disabled="true"],
  ui-context-menu [slot="menu"] [role="menuitemcheckbox"][aria-disabled="true"],
  ui-context-menu [slot="menu"] [role="menuitemradio"][aria-disabled="true"],
  ui-context-menu [slot="content"] .menuitem[aria-disabled="true"],
  ui-context-menu [slot="content"] [role="menuitem"][aria-disabled="true"],
  ui-context-menu [slot="content"] [role="menuitemcheckbox"][aria-disabled="true"],
  ui-context-menu [slot="content"] [role="menuitemradio"][aria-disabled="true"],
  ui-context-menu [slot="menu"] .menuitem[disabled],
  ui-context-menu [slot="content"] .menuitem[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  ui-context-menu [slot="menu"] .separator,
  ui-context-menu [slot="content"] .separator,
  ui-context-menu [slot="menu"] [role="separator"],
  ui-context-menu [slot="content"] [role="separator"] {
    height: 1px;
    margin: var(--ui-context-menu-separator-margin, 6px 10px);
    border: 0;
    background: color-mix(in srgb, currentColor 18%, transparent);
  }

  ui-context-menu [slot="menu"] .icon,
  ui-context-menu [slot="content"] .icon {
    grid-column: 1;
    width: 1rem;
    min-width: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    font-size: 0.95em;
  }

  ui-context-menu [slot="menu"] .label,
  ui-context-menu [slot="content"] .label {
    grid-column: 2;
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ui-context-menu [slot="menu"] .submenu-arrow,
  ui-context-menu [slot="content"] .submenu-arrow {
    grid-column: 3;
    margin-left: auto;
    font-size: 11px;
    opacity: 0.65;
  }

  ui-context-menu [slot="menu"] .submenu,
  ui-context-menu [slot="content"] .submenu {
    position: absolute;
    top: 0;
    left: calc(100% + var(--ui-context-menu-submenu-gap, 2px));
    min-width: max(200px, 100%);
    max-width: min(320px, calc(100vw - 20px));
    padding: var(--ui-context-menu-submenu-padding, 5px);
    border-radius: var(--ui-context-menu-submenu-radius, 11px);
    border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--ui-context-menu-bg, #ffffff) 98%, #ffffff 2%), color-mix(in srgb, var(--ui-context-menu-bg, #ffffff) 94%, transparent)),
      var(--ui-context-menu-bg, #ffffff);
    box-shadow:
      0 18px 40px rgba(2, 6, 23, 0.18),
      0 2px 8px rgba(2, 6, 23, 0.1);
    backdrop-filter: none;
    display: grid;
    gap: 2px;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateX(-5px) scale(0.985);
    transform-origin: top left;
    transition: opacity 130ms ease, transform 130ms ease, visibility 130ms ease;
    z-index: 30;
  }

  ui-context-menu [slot="menu"] .submenu::before,
  ui-context-menu [slot="content"] .submenu::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--ui-context-menu-submenu-gap, 2px) * -1);
    width: var(--ui-context-menu-submenu-gap, 2px);
    pointer-events: auto;
  }

  ui-context-menu [slot="menu"] .menuitem[data-submenu-side="left"] > .submenu,
  ui-context-menu [slot="menu"] [role="menuitem"][data-submenu-side="left"] > .submenu,
  ui-context-menu [slot="content"] .menuitem[data-submenu-side="left"] > .submenu,
  ui-context-menu [slot="content"] [role="menuitem"][data-submenu-side="left"] > .submenu {
    left: auto;
    right: calc(100% + var(--ui-context-menu-submenu-gap, 2px));
    transform: translateX(6px) scale(0.985);
    transform-origin: top right;
  }

  ui-context-menu [slot="menu"] .menuitem[data-submenu-side="left"] > .submenu::before,
  ui-context-menu [slot="menu"] [role="menuitem"][data-submenu-side="left"] > .submenu::before,
  ui-context-menu [slot="content"] .menuitem[data-submenu-side="left"] > .submenu::before,
  ui-context-menu [slot="content"] [role="menuitem"][data-submenu-side="left"] > .submenu::before {
    left: auto;
    right: calc(var(--ui-context-menu-submenu-gap, 2px) * -1);
  }

  ui-context-menu [slot="menu"] .menuitem[data-submenu-align="up"] > .submenu,
  ui-context-menu [slot="menu"] [role="menuitem"][data-submenu-align="up"] > .submenu,
  ui-context-menu [slot="content"] .menuitem[data-submenu-align="up"] > .submenu,
  ui-context-menu [slot="content"] [role="menuitem"][data-submenu-align="up"] > .submenu {
    top: auto;
    bottom: 0;
  }

  ui-context-menu [slot="menu"] .menuitem[data-submenu-open="true"] > .submenu,
  ui-context-menu [slot="menu"] [role="menuitem"][data-submenu-open="true"] > .submenu,
  ui-context-menu [slot="menu"] .menuitem:hover > .submenu,
  ui-context-menu [slot="menu"] .menuitem:focus-within > .submenu,
  ui-context-menu [slot="menu"] [role="menuitem"]:hover > .submenu,
  ui-context-menu [slot="menu"] [role="menuitem"]:focus-within > .submenu,
  ui-context-menu [slot="content"] .menuitem[data-submenu-open="true"] > .submenu,
  ui-context-menu [slot="content"] [role="menuitem"][data-submenu-open="true"] > .submenu,
  ui-context-menu [slot="content"] .menuitem:hover > .submenu,
  ui-context-menu [slot="content"] .menuitem:focus-within > .submenu,
  ui-context-menu [slot="content"] [role="menuitem"]:hover > .submenu,
  ui-context-menu [slot="content"] [role="menuitem"]:focus-within > .submenu {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(0) scale(1);
  }

  @media (forced-colors: active) {
    ui-context-menu [slot="menu"] .menuitem,
    ui-context-menu [slot="menu"] [role="menuitem"],
    ui-context-menu [slot="menu"] [role="menuitemcheckbox"],
    ui-context-menu [slot="menu"] [role="menuitemradio"],
    ui-context-menu [slot="content"] .menuitem,
    ui-context-menu [slot="content"] [role="menuitem"],
    ui-context-menu [slot="content"] [role="menuitemcheckbox"],
    ui-context-menu [slot="content"] [role="menuitemradio"] {
      forced-color-adjust: none;
      border: 1px solid transparent;
      background: Canvas;
      color: CanvasText;
    }

    ui-context-menu [slot="menu"] .menuitem:hover,
    ui-context-menu [slot="menu"] .menuitem:focus-visible,
    ui-context-menu [slot="menu"] [role="menuitem"]:hover,
    ui-context-menu [slot="menu"] [role="menuitem"]:focus-visible,
    ui-context-menu [slot="content"] .menuitem:hover,
    ui-context-menu [slot="content"] .menuitem:focus-visible,
    ui-context-menu [slot="content"] [role="menuitem"]:hover,
    ui-context-menu [slot="content"] [role="menuitem"]:focus-visible {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
    }

    ui-context-menu [slot="menu"] .submenu,
    ui-context-menu [slot="content"] .submenu {
      forced-color-adjust: none;
      background: Canvas;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

function ensureLightDomStyle(): void {
  if (typeof document === 'undefined') return;
  const styleId = 'ui-context-menu-light-dom-style';
  const existing = document.getElementById(styleId);
  if (existing) {
    if (existing.textContent !== lightDomStyle) {
      existing.textContent = lightDomStyle;
    }
    return;
  }
  const el = document.createElement('style');
  el.id = styleId;
  el.textContent = lightDomStyle;
  document.head.appendChild(el);
}

if (typeof document !== 'undefined') {
  ensureLightDomStyle();
}

function isDisabled(node: MenuLikeItem): boolean {
  return node.hasAttribute('disabled') || node.getAttribute('aria-disabled') === 'true' || !!node.disabled;
}

function isVisible(node: HTMLElement): boolean {
  if (!node.isConnected) return false;
  if (node.getClientRects().length === 0) return false;
  const styles = window.getComputedStyle(node);
  return styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0';
}

function isElementVisibleInDom(node: HTMLElement): boolean {
  if (typeof document === 'undefined') return false;
  if (!document.body.contains(node)) return false;
  if (node.getClientRects().length === 0) return false;
  const styles = window.getComputedStyle(node);
  return styles.display !== 'none' && styles.visibility !== 'hidden' && parseFloat(styles.opacity || '1') > 0;
}

function toPoint(x: number | Point, y?: number): Point {
  if (typeof x === 'number') {
    return { x, y: typeof y === 'number' ? y : 0 };
  }
  return x;
}

export class UIContextMenu extends ElementBase {
  static get observedAttributes() {
    return ['open', 'headless', 'variant', 'density', 'shape', 'elevation', 'tone', 'close-on-select', 'typeahead'];
  }

  private _isOpen = false;
  private _position: Point = { x: 0, y: 0 };
  private _anchorEl: HTMLElement | null = null;
  private _positionRaf: number | null = null;
  private _submenuRaf: number | null = null;
  private _restoreFocusEl: HTMLElement | null = null;
  private _typeaheadBuffer = '';
  private _typeaheadTimer: number | null = null;

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onRootKeyDown = this._onRootKeyDown.bind(this);
    this._onDocumentPointerDown = this._onDocumentPointerDown.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
    this._onViewportChange = this._onViewportChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    ensureLightDomStyle();

    this.root.addEventListener('click', this._onRootClick as EventListener);
    this.root.addEventListener('keydown', this._onRootKeyDown as EventListener);
    this.addEventListener('contextmenu', this._onContextMenu as EventListener);
    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    window.addEventListener('resize', this._onViewportChange);
    window.addEventListener('scroll', this._onViewportChange, true);

    this._syncOpenState();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    this.root.removeEventListener('keydown', this._onRootKeyDown as EventListener);
    this.removeEventListener('contextmenu', this._onContextMenu as EventListener);
    document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    window.removeEventListener('resize', this._onViewportChange);
    window.removeEventListener('scroll', this._onViewportChange, true);

    this._cancelScheduledWork();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'open') {
      this._syncOpenState();
    }
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    if (value) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  get headless(): boolean {
    return this.hasAttribute('headless');
  }

  set headless(value: boolean) {
    if (value) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
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

  openAt(pointOrX: Point | number, y?: number): void {
    const point = toPoint(pointOrX, y);
    this._anchorEl = null;
    this._position = { x: point.x, y: point.y };
    this.open = true;
    this._schedulePosition();
  }

  openForAnchor(anchor: HTMLElement): void {
    this._anchorEl = anchor;
    this.open = true;
    this._schedulePosition();
  }

  openForAnchorId(anchorId: string): void {
    const anchor = typeof document !== 'undefined' ? document.getElementById(anchorId) : null;
    if (!anchor) return;
    this.openForAnchor(anchor);
  }

  showForAnchorId(anchorId: string): void {
    this.openForAnchorId(anchorId);
  }

  // Backward compatibility alias used in legacy examples/tests.
  openFor(anchorOrId: HTMLElement | string): void {
    if (typeof anchorOrId === 'string') {
      this.openForAnchorId(anchorOrId);
      return;
    }
    this.openForAnchor(anchorOrId);
  }

  close(): void {
    this.open = false;
  }

  private _cancelScheduledWork(): void {
    if (this._positionRaf != null) {
      cancelAnimationFrame(this._positionRaf);
      this._positionRaf = null;
    }
    if (this._submenuRaf != null) {
      cancelAnimationFrame(this._submenuRaf);
      this._submenuRaf = null;
    }
    this._resetTypeahead();
  }

  private _resetTypeahead(): void {
    this._typeaheadBuffer = '';
    if (this._typeaheadTimer != null) {
      window.clearTimeout(this._typeaheadTimer);
      this._typeaheadTimer = null;
    }
  }

  private _syncOpenState(): void {
    const nowOpen = this.hasAttribute('open');
    if (nowOpen === this._isOpen) {
      if (nowOpen) {
        this._schedulePosition();
        this._scheduleSubmenuLayout();
      }
      return;
    }

    this._isOpen = nowOpen;

    if (nowOpen) {
      this._restoreFocusEl = document.activeElement as HTMLElement | null;
      this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { open: true } }));
      this._schedulePosition();
      this._scheduleSubmenuLayout();
      requestAnimationFrame(() => {
        this._focusFirstItem();
      });
      return;
    }

    this._clearSubmenuOpenState();
    this._cancelScheduledWork();
    this._anchorEl = null;

    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
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

  private _getSurface(): HTMLElement | null {
    return this.root.querySelector('.surface') as HTMLElement | null;
  }

  private _getMenuHost(): HTMLElement | null {
    const slotMenu = this.querySelector('[slot="menu"]') as HTMLElement | null;
    if (slotMenu) return slotMenu;
    return this.querySelector('[slot="content"]') as HTMLElement | null;
  }

  private _queryMenuItems(container?: HTMLElement | null): MenuLikeItem[] {
    const source = container || this._getMenuHost();
    if (!source) return [];
    const directSelector = [
      ':scope > .menuitem',
      ':scope > [role="menuitem"]',
      ':scope > [role="menuitemcheckbox"]',
      ':scope > [role="menuitemradio"]',
      ':scope > [data-menu-item]'
    ].join(', ');

    const direct = Array.from(source.querySelectorAll<MenuLikeItem>(directSelector));
    if (direct.length > 0) {
      return direct.filter((node) => isVisible(node as HTMLElement));
    }

    const fallback = Array.from(
      source.querySelectorAll<MenuLikeItem>(
        '.menuitem, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [data-menu-item]'
      )
    );

    return fallback.filter((node) => isVisible(node as HTMLElement));
  }

  private _findCurrentItem(event: Event): MenuLikeItem | null {
    const path = event.composedPath();

    for (const part of path) {
      if (!(part instanceof HTMLElement)) continue;
      const isItem = part.matches('.menuitem, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [data-menu-item]');
      if (isItem) return part as MenuLikeItem;
    }

    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      const closest = active.closest('.menuitem, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [data-menu-item]');
      if (closest instanceof HTMLElement) return closest as MenuLikeItem;
    }

    return null;
  }

  private _focusItem(item: MenuLikeItem | null): void {
    if (!item) return;
    if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1');
    try {
      item.focus({ preventScroll: true });
    } catch {
      item.focus();
    }
  }

  private _focusFirstItem(): void {
    const items = this._queryMenuItems();
    const firstEnabled = items.find((item) => !isDisabled(item));
    if (firstEnabled) {
      this._focusItem(firstEnabled);
      return;
    }

    const surface = this._getSurface();
    if (!surface) return;
    if (!surface.hasAttribute('tabindex')) surface.setAttribute('tabindex', '-1');
    surface.focus();
  }

  private _focusInList(current: MenuLikeItem, key: 'next' | 'prev' | 'first' | 'last'): void {
    const submenuContainer = current.closest('.submenu') as HTMLElement | null;
    const contextContainer = submenuContainer || this._getMenuHost();
    if (!contextContainer) return;

    const items = this._queryMenuItems(contextContainer).filter((item) => !isDisabled(item));
    if (!items.length) return;

    if (key === 'first') {
      this._focusItem(items[0]);
      return;
    }
    if (key === 'last') {
      this._focusItem(items[items.length - 1]);
      return;
    }

    const idx = items.indexOf(current);
    if (idx < 0) {
      this._focusItem(items[0]);
      return;
    }

    if (key === 'next') {
      const next = idx + 1 >= items.length ? items[0] : items[idx + 1];
      this._focusItem(next);
      return;
    }

    const prev = idx - 1 < 0 ? items[items.length - 1] : items[idx - 1];
    this._focusItem(prev);
  }

  private _isTypeaheadKey(event: KeyboardEvent): boolean {
    if (event.ctrlKey || event.metaKey || event.altKey) return false;
    return event.key.length === 1 && /\S/.test(event.key);
  }

  private _handleTypeahead(event: KeyboardEvent, current: MenuLikeItem | null): boolean {
    if (!this.typeahead) return false;
    if (!this._isTypeaheadKey(event)) return false;

    const contextContainer = (current?.closest('.submenu') as HTMLElement | null) || this._getMenuHost();
    if (!contextContainer) return false;

    const items = this._queryMenuItems(contextContainer).filter((item) => !isDisabled(item));
    if (!items.length) return false;

    this._typeaheadBuffer = `${this._typeaheadBuffer}${event.key.toLowerCase()}`.slice(0, 24);
    if (this._typeaheadTimer != null) {
      window.clearTimeout(this._typeaheadTimer);
    }
    this._typeaheadTimer = window.setTimeout(() => {
      this._resetTypeahead();
    }, 420);

    const matched = items.find((item) => {
      const text = (item.getAttribute('aria-label') || item.textContent || '').trim().toLowerCase();
      return text.startsWith(this._typeaheadBuffer);
    });
    if (!matched) return false;

    event.preventDefault();
    this._focusItem(matched);
    return true;
  }

  private _clearSubmenuOpenState(): void {
    const menu = this._getMenuHost();
    if (!menu) return;
    const opened = menu.querySelectorAll<HTMLElement>('[data-submenu-open="true"]');
    opened.forEach((item) => item.removeAttribute('data-submenu-open'));
  }

  private _openItemSubmenu(item: MenuLikeItem): boolean {
    const submenu = item.querySelector(':scope > .submenu') as HTMLElement | null;
    if (!submenu) return false;

    this._clearSubmenuOpenState();
    item.setAttribute('data-submenu-open', 'true');

    const submenuItems = this._queryMenuItems(submenu).filter((node) => !isDisabled(node));
    this._focusItem(submenuItems[0] || null);
    return true;
  }

  private _closeParentSubmenu(current: MenuLikeItem): boolean {
    const submenu = current.closest('.submenu') as HTMLElement | null;
    if (!submenu) return false;

    const parentItem = submenu.parentElement;
    if (!(parentItem instanceof HTMLElement)) return false;

    parentItem.removeAttribute('data-submenu-open');
    this._focusItem(parentItem as MenuLikeItem);
    return true;
  }

  private _emitSelect(item: MenuLikeItem): void {
    const menu = this._getMenuHost();
    const allItems = menu
      ? Array.from(menu.querySelectorAll<MenuLikeItem>('.menuitem, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [data-menu-item]'))
      : [];
    const index = allItems.indexOf(item);

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
  }

  private _applySelectionBehavior(item: MenuLikeItem): void {
    const role = item.getAttribute('role');
    if (role === 'menuitemcheckbox') {
      const nextChecked = item.getAttribute('aria-checked') !== 'true';
      item.setAttribute('aria-checked', nextChecked ? 'true' : 'false');
      item.setAttribute('data-state', nextChecked ? 'checked' : 'unchecked');
      return;
    }

    if (role !== 'menuitemradio') return;

    const container = (item.closest('.submenu') as HTMLElement | null) || this._getMenuHost();
    if (!container) return;
    const group = item.getAttribute('data-group') || item.getAttribute('name') || '';
    const radios = Array.from(container.querySelectorAll<MenuLikeItem>('[role="menuitemradio"]'));
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

  private _onRootClick(event: MouseEvent): void {
    if (!this._isOpen) return;

    const current = this._findCurrentItem(event);
    if (!current || isDisabled(current)) return;

    const hasSubmenu = !!current.querySelector(':scope > .submenu');
    if (hasSubmenu) {
      this._openItemSubmenu(current);
      return;
    }

    this._applySelectionBehavior(current);
    this._emitSelect(current);

    if (this.closeOnSelect) {
      this.close();
    } else {
      this._focusItem(current);
    }
  }

  private _onRootKeyDown(event: KeyboardEvent): void {
    if (!this._isOpen) return;

    const current = this._findCurrentItem(event);
    if (this._handleTypeahead(event, current)) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (!current) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this._focusFirstItem();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._focusInList(current, 'next');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._focusInList(current, 'prev');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this._focusInList(current, 'first');
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this._focusInList(current, 'last');
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this._openItemSubmenu(current);
      return;
    }

    if (event.key === 'ArrowLeft') {
      if (this._closeParentSubmenu(current)) {
        event.preventDefault();
      }
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      current.click();
    }
  }

  private _onDocumentPointerDown(event: PointerEvent): void {
    if (!this._isOpen) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    this.close();
  }

  private _onContextMenu(event: MouseEvent): void {
    if (event.defaultPrevented) return;
    if (event.target instanceof HTMLElement && event.target.closest('[slot="menu"], [slot="content"]')) return;

    event.preventDefault();
    this.openAt(event.clientX, event.clientY);
  }

  private _onViewportChange(): void {
    if (!this._isOpen) return;
    this._schedulePosition();
    this._scheduleSubmenuLayout();
  }

  private _schedulePosition(): void {
    if (!this._isOpen) return;
    if (this._positionRaf != null) cancelAnimationFrame(this._positionRaf);
    this._positionRaf = requestAnimationFrame(() => {
      this._positionRaf = null;
      this._positionMenu();
    });
  }

  private _positionMenu(): void {
    const surface = this._getSurface();
    if (!surface) return;

    if (this._anchorEl && !isElementVisibleInDom(this._anchorEl)) {
      this.close();
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 8;

    let x = this._position.x;
    let y = this._position.y;

    if (this._anchorEl) {
      const rect = this._anchorEl.getBoundingClientRect();
      x = rect.left;
      y = rect.bottom + 6;
    }

    const bounds = surface.getBoundingClientRect();
    const width = bounds.width || surface.offsetWidth || 220;
    const height = bounds.height || surface.offsetHeight || 0;

    if (this._anchorEl) {
      const anchorRect = this._anchorEl.getBoundingClientRect();
      if (y + height > viewportHeight - gap) {
        y = Math.max(gap, anchorRect.top - height - 6);
      }
    }

    if (x + width > viewportWidth - gap) {
      x = viewportWidth - width - gap;
    }
    if (y + height > viewportHeight - gap) {
      y = viewportHeight - height - gap;
    }

    x = Math.max(gap, x);
    y = Math.max(gap, y);

    surface.style.left = `${Math.round(x)}px`;
    surface.style.top = `${Math.round(y)}px`;
  }

  private _scheduleSubmenuLayout(): void {
    if (!this._isOpen) return;
    if (this._submenuRaf != null) cancelAnimationFrame(this._submenuRaf);
    this._submenuRaf = requestAnimationFrame(() => {
      this._submenuRaf = null;
      this._layoutSubmenus();
    });
  }

  private _layoutSubmenus(): void {
    const menu = this._getMenuHost();
    if (!menu) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgeGap = 8;
    const computed = window.getComputedStyle(this);
    const submenuGap = Number.parseFloat(computed.getPropertyValue('--ui-context-menu-submenu-gap')) || 2;

    const submenus = Array.from(menu.querySelectorAll<HTMLElement>('.menuitem > .submenu, [role="menuitem"] > .submenu'));

    submenus.forEach((submenu) => {
      const owner = submenu.parentElement;
      if (!(owner instanceof HTMLElement)) return;

      owner.removeAttribute('data-submenu-side');
      owner.removeAttribute('data-submenu-align');

      const prevDisplay = submenu.style.display;
      const prevVisibility = submenu.style.visibility;
      const prevPointerEvents = submenu.style.pointerEvents;
      const prevOpacity = submenu.style.opacity;
      const prevTransform = submenu.style.transform;

      submenu.style.display = 'grid';
      submenu.style.visibility = 'hidden';
      submenu.style.pointerEvents = 'none';
      submenu.style.opacity = '0';
      submenu.style.transform = 'none';

      const ownerRect = owner.getBoundingClientRect();
      const submenuRect = submenu.getBoundingClientRect();

      const spaceRight = viewportWidth - ownerRect.right - edgeGap - submenuGap;
      const spaceLeft = ownerRect.left - edgeGap - submenuGap;
      if (submenuRect.width > spaceRight && spaceLeft > spaceRight) {
        owner.setAttribute('data-submenu-side', 'left');
      }

      const spaceDown = viewportHeight - ownerRect.top - edgeGap;
      const spaceUp = ownerRect.bottom - edgeGap;
      if (submenuRect.height > spaceDown && spaceUp > spaceDown) {
        owner.setAttribute('data-submenu-align', 'up');
      }

      submenu.style.display = prevDisplay;
      submenu.style.visibility = prevVisibility;
      submenu.style.pointerEvents = prevPointerEvents;
      submenu.style.opacity = prevOpacity;
      submenu.style.transform = prevTransform;
    });
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="surface" part="menu" role="menu" aria-hidden="${this._isOpen ? 'false' : 'true'}" tabindex="-1">
        <slot name="menu"></slot>
        <slot name="content"></slot>
      </div>
      <slot></slot>
    `);

    if (this._isOpen) {
      this._schedulePosition();
      this._scheduleSubmenuLayout();
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-context-menu')) {
  customElements.define('ui-context-menu', UIContextMenu);
}
