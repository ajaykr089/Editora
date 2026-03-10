import { ElementBase } from '../ElementBase';
import { createPortalContainer } from '../portal';
import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { createPositioner, type PositionerHandle } from '../primitives/positioner';
import './ui-listbox';
import type { UIListbox } from './ui-listbox';

const MENU_TRANSITION_MS = 160;

const style = `
  :host {
    --ui-split-button-radius: 12px;
    --ui-split-button-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-split-button-bg: var(--ui-color-primary, #2563eb);
    --ui-split-button-bg-strong: color-mix(in srgb, var(--ui-split-button-bg) 84%, #0f172a 16%);
    --ui-split-button-color: #ffffff;
    --ui-split-button-shadow: 0 1px 2px rgba(2, 6, 23, 0.12), 0 8px 18px color-mix(in srgb, var(--ui-split-button-bg) 20%, transparent);
    --ui-split-button-menu-bg: var(--ui-color-surface, #ffffff);
    --ui-split-button-menu-color: var(--ui-color-text, #0f172a);
    --ui-split-button-menu-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 64%, transparent);
    --ui-split-button-menu-radius: 14px;
    --ui-split-button-menu-shadow: 0 22px 44px rgba(2, 6, 23, 0.16), 0 2px 8px rgba(2, 6, 23, 0.08);
    --ui-split-button-menu-accent: color-mix(in srgb, var(--ui-split-button-bg) 8%, var(--ui-split-button-menu-bg));
    --ui-split-button-menu-accent-strong: color-mix(in srgb, var(--ui-split-button-bg) 14%, var(--ui-split-button-menu-bg));
    --ui-split-button-menu-shortcut: color-mix(in srgb, var(--ui-split-button-menu-color) 60%, transparent);
    --ui-split-button-menu-separator: color-mix(in srgb, var(--ui-split-button-menu-color) 10%, transparent);
    --ui-split-button-menu-muted: color-mix(in srgb, var(--ui-split-button-menu-color) 58%, transparent);
    --ui-split-button-menu-danger: var(--ui-color-danger, #dc2626);
    --ui-split-button-menu-list-gap: 0px;
    --ui-split-button-menu-list-padding-top: 2px;
    --ui-split-button-menu-item-min-height: 42px;
    --ui-split-button-menu-item-radius: 10px;
    --ui-split-button-menu-item-padding: 10px 12px;
    --ui-split-button-focus: var(--ui-color-focus-ring, #2563eb);
    display: inline-flex;
    position: relative;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .group {
    display: inline-grid;
    grid-template-columns: minmax(0, 1fr) auto;
    min-width: 0;
    border: var(--ui-split-button-border);
    border-radius: var(--ui-split-button-radius);
    overflow: hidden;
    background: var(--ui-split-button-bg);
    color: var(--ui-split-button-color);
    box-shadow: var(--ui-split-button-shadow);
  }

  .button,
  .toggle {
    appearance: none;
    border: 0;
    margin: 0;
    background: transparent;
    color: inherit;
    min-height: 40px;
    font: 600 14px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    transition: background-color 140ms ease, color 140ms ease;
  }

  .button {
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 0;
  }

  .toggle {
    inline-size: 42px;
    display: inline-grid;
    place-items: center;
    border-inline-start: 1px solid color-mix(in srgb, #ffffff 20%, transparent);
  }

  .button:hover,
  .toggle:hover,
  .button:focus-visible,
  .toggle:focus-visible,
  :host([open]) .toggle {
    background: var(--ui-split-button-bg-strong);
    outline: none;
  }

  .toggle svg {
    inline-size: 14px;
    block-size: 14px;
  }

  .slot-source {
    display: none !important;
  }

  :host([disabled]) {
    opacity: 0.72;
    pointer-events: none;
  }

  :host([variant="neutral"]) {
    --ui-split-button-bg: #ffffff;
    --ui-split-button-bg-strong: #f8fafc;
    --ui-split-button-color: #0f172a;
    --ui-split-button-border: 1px solid color-mix(in srgb, #0f172a 12%, transparent);
    --ui-split-button-shadow: 0 1px 2px rgba(15, 23, 42, 0.06), 0 10px 24px rgba(15, 23, 42, 0.08);
    --ui-split-button-menu-bg: #ffffff;
    --ui-split-button-menu-color: #0f172a;
  }

  :host([variant="flat"]) {
    --ui-split-button-radius: 10px;
    --ui-split-button-bg: #ffffff;
    --ui-split-button-bg-strong: #f1f5f9;
    --ui-split-button-color: #0f172a;
    --ui-split-button-border: 1px solid #dbe4f0;
    --ui-split-button-shadow: none;
    --ui-split-button-menu-bg: #ffffff;
    --ui-split-button-menu-color: #0f172a;
    --ui-split-button-menu-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
    --ui-split-button-menu-accent: #eef4ff;
    --ui-split-button-menu-accent-strong: #e0ecff;
  }

  :host([variant="contrast"]) {
    --ui-split-button-bg: #111827;
    --ui-split-button-bg-strong: #0b1220;
    --ui-split-button-color: #f8fafc;
    --ui-split-button-shadow: 0 1px 2px rgba(15, 23, 42, 0.2), 0 16px 36px rgba(15, 23, 42, 0.18);
  }

  :host([density="compact"]) {
    --ui-split-button-radius: 10px;
  }

  :host([density="compact"]) .button,
  :host([density="compact"]) .toggle {
    min-height: 36px;
    font-size: 13px;
  }

  :host([density="compact"]) .button {
    padding-inline: 12px;
  }

  :host([density="compact"]) .toggle {
    inline-size: 38px;
  }

  :host([density="comfortable"]) .button,
  :host([density="comfortable"]) .toggle {
    min-height: 44px;
  }

  :host([density="comfortable"]) .button {
    padding-inline: 16px;
  }

  :host([density="comfortable"]) .toggle {
    inline-size: 46px;
  }
`;

const menuStyle = `
  .menu {
    position: absolute;
    display: grid;
    gap: 6px;
    min-width: 220px;
    max-width: min(360px, calc(100vw - 16px));
    max-height: min(420px, calc(100vh - 16px));
    overflow: auto;
    padding: 10px 8px 8px;
    border: var(--ui-split-button-menu-border);
    border-radius: calc(var(--ui-split-button-menu-radius) + 2px);
    background: var(--ui-split-button-menu-bg);
    color: var(--ui-split-button-menu-color);
    box-shadow: var(--ui-split-button-menu-shadow);
    box-sizing: border-box;
    z-index: 1600;
    backdrop-filter: blur(14px) saturate(1.08);
    overflow: hidden auto;
    opacity: 0;
    transform: translateY(-6px) scale(0.985);
    transform-origin: top left;
    transition: opacity ${MENU_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${MENU_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity, transform;
  }

  .menu[data-state="opening"],
  .menu[data-state="closing"] {
    pointer-events: none;
  }

  .menu[data-state="open"] {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .menu[data-state="closing"] {
    opacity: 0;
    transform: translateY(-4px) scale(0.99);
  }

  .menu::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    block-size: 3px;
    background: linear-gradient(90deg, var(--ui-split-button-bg), color-mix(in srgb, var(--ui-split-button-bg) 68%, white));
    opacity: 0.96;
    pointer-events: none;
  }

  .menu ui-listbox {
    display: grid;
    gap: var(--ui-split-button-menu-list-gap);
    padding: var(--ui-split-button-menu-list-padding-top) 0 0;
  }

  .menu-header {
    display: grid;
    gap: 3px;
    padding: 2px 8px 6px;
  }

  .menu-heading {
    margin: 0;
    min-inline-size: 0;
    font: 700 13px/1.25 "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    color: var(--ui-split-button-menu-color);
  }

  .menu-description {
    margin: 0;
    min-inline-size: 0;
    font: 500 12px/1.45 "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    color: var(--ui-split-button-menu-muted);
  }

  .menu [slot="menuitem"],
  .menu [data-menu-item] {
    appearance: none;
    -webkit-appearance: none;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    inline-size: 100%;
    gap: 12px;
    align-items: center;
    position: relative;
    min-height: var(--ui-split-button-menu-item-min-height);
    margin: 0;
    padding: var(--ui-split-button-menu-item-padding);
    border: 0;
    border-radius: var(--ui-split-button-menu-item-radius);
    background: transparent;
    color: inherit;
    box-shadow: none;
    text-align: start;
    text-decoration: none;
    font: 600 14px/1.32 "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    cursor: pointer;
    outline: none;
    transition: background-color 140ms ease, color 140ms ease, transform 140ms ease, box-shadow 140ms ease;
  }

  .menu [slot="menuitem"] + [slot="menuitem"],
  .menu [data-menu-item] + [data-menu-item] {
    box-shadow: inset 0 1px 0 var(--ui-split-button-menu-separator);
  }

  .menu [slot="menuitem"]::before,
  .menu [data-menu-item]::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    inset-block: 8px;
    inline-size: 3px;
    border-radius: 999px;
    background: transparent;
    transition: background-color 140ms ease;
  }

  .menu [slot="menuitem"] > :first-child,
  .menu [data-menu-item] > :first-child,
  .menu [data-menu-label] {
    display: grid;
    gap: 2px;
    min-inline-size: 0;
  }

  .menu [data-menu-label] {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 620;
  }

  .menu [data-menu-description] {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: 500 12px/1.35 "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-split-button-menu-muted);
  }

  .menu [slot="menuitem"] > :last-child,
  .menu [data-menu-item] > :last-child,
  .menu [data-menu-shortcut] {
    justify-self: end;
    font: 600 12px/1 "IBM Plex Mono", "SFMono-Regular", "SF Mono", Consolas, monospace;
    letter-spacing: 0.03em;
    color: var(--ui-split-button-menu-shortcut);
    padding: 5px 7px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--ui-split-button-menu-color) 5%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-split-button-menu-color) 10%, transparent);
  }

  .menu [slot="menuitem"][data-tone="danger"],
  .menu [data-menu-item][data-tone="danger"] {
    color: color-mix(in srgb, var(--ui-split-button-menu-danger) 88%, var(--ui-split-button-menu-color));
  }

  .menu [slot="menuitem"][data-tone="danger"] [data-menu-description],
  .menu [data-menu-item][data-tone="danger"] [data-menu-description] {
    color: color-mix(in srgb, var(--ui-split-button-menu-danger) 68%, transparent);
  }

  .menu [slot="menuitem"][data-active="true"],
  .menu [data-menu-item][data-active="true"],
  .menu [slot="menuitem"]:hover,
  .menu [data-menu-item]:hover,
  .menu [slot="menuitem"]:focus-visible,
  .menu [data-menu-item]:focus-visible {
    background: var(--ui-split-button-menu-accent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-split-button-bg) 16%, transparent);
  }

  .menu [slot="menuitem"][data-active="true"],
  .menu [data-menu-item][data-active="true"] {
    background: var(--ui-split-button-menu-accent-strong);
  }

  .menu [slot="menuitem"][data-active="true"]::before,
  .menu [data-menu-item][data-active="true"]::before,
  .menu [slot="menuitem"]:hover::before,
  .menu [data-menu-item]:hover::before,
  .menu [slot="menuitem"]:focus-visible::before,
  .menu [data-menu-item]:focus-visible::before {
    background: var(--ui-split-button-bg);
  }

  .menu [slot="menuitem"][data-tone="danger"][data-active="true"]::before,
  .menu [data-menu-item][data-tone="danger"][data-active="true"]::before,
  .menu [slot="menuitem"][data-tone="danger"]:hover::before,
  .menu [data-menu-item][data-tone="danger"]:hover::before,
  .menu [slot="menuitem"][data-tone="danger"]:focus-visible::before,
  .menu [data-menu-item][data-tone="danger"]:focus-visible::before {
    background: var(--ui-split-button-menu-danger);
  }

  .menu [slot="menuitem"][disabled],
  .menu [slot="menuitem"][aria-disabled="true"],
  .menu [data-menu-item][disabled],
  .menu [data-menu-item][aria-disabled="true"] {
    opacity: 0.56;
    pointer-events: none;
  }

  :host([menu-density="compact"]) {
    --ui-split-button-menu-list-gap: 0px;
    --ui-split-button-menu-list-padding-top: 2px;
    --ui-split-button-menu-item-min-height: 40px;
    --ui-split-button-menu-item-radius: 8px;
    --ui-split-button-menu-item-padding: 9px 11px;
  }

  :host([menu-density="airy"]) {
    --ui-split-button-menu-list-gap: 6px;
    --ui-split-button-menu-list-padding-top: 6px;
    --ui-split-button-menu-item-min-height: 50px;
    --ui-split-button-menu-item-radius: 14px;
    --ui-split-button-menu-item-padding: 12px 14px;
  }

  :host([menu-shape="flat"]) {
    --ui-split-button-menu-radius: 10px;
    --ui-split-button-menu-item-radius: 8px;
  }

  :host([menu-shape="soft"]) {
    --ui-split-button-menu-radius: 18px;
    --ui-split-button-menu-item-radius: 14px;
  }

  @media (prefers-reduced-motion: reduce) {
    .menu {
      transition: none;
      transform: none;
    }
  }
`;

function cloneMenuItem(node: HTMLElement, index: number): HTMLElement {
  const clone = node.cloneNode(true) as HTMLElement;
  clone.setAttribute('slot', 'menuitem');
  clone.setAttribute('data-menu-item', 'true');
  clone.setAttribute('data-index', String(index));
  clone.setAttribute('tabindex', '-1');
  if (!clone.id) clone.id = `ui-split-button-item-${Math.random().toString(36).slice(2, 9)}`;
  return clone;
}

export class UISplitButton extends ElementBase {
  static get observedAttributes(): string[] {
    return ['label', 'menu-label', 'menu-heading', 'menu-description', 'variant', 'density', 'menu-density', 'menu-shape', 'disabled', 'open'];
  }

  private _portalEl: HTMLElement | null = null;
  private _portalRoot: HTMLElement | null = null;
  private _layer: DismissableLayerHandle | null = null;
  private _positioner: PositionerHandle | null = null;
  private _listbox: UIListbox | null = null;
  private _triggerButton: HTMLButtonElement | null = null;
  private _toggleButton: HTMLButtonElement | null = null;
  private _menuItems: HTMLElement[] = [];
  private _lastFocused: HTMLElement | null = null;
  private _closeTimer: number | null = null;

  constructor() {
    super();
    this._onPrimaryClick = this._onPrimaryClick.bind(this);
    this._onToggleClick = this._onToggleClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  openMenu(): void {
    if (this.hasAttribute('disabled')) return;
    if (this.hasAttribute('open') && this._portalEl?.getAttribute('data-state') !== 'closing') return;
    if (!this._portalEl && this._collectMenuItems().length === 0) return;
    this._lastFocused = (document.activeElement as HTMLElement | null) || this._toggleButton;
    this._clearCloseTimer();
    if (this._portalEl) {
      this._setMenuState('opening');
      this._portalEl.style.pointerEvents = 'auto';
      this._positioner?.update();
      requestAnimationFrame(() => this._setMenuState('open'));
    }
    this.setAttribute('open', '');
    queueMicrotask(() => {
      if (!this._portalEl) this._mountMenu();
      else {
        try {
          this._portalEl.focus({ preventScroll: true });
        } catch {
          this._portalEl.focus();
        }
      }
    });
  }

  closeMenu(): void {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
  }

  toggleMenu(): void {
    if (this.hasAttribute('open')) this.closeMenu();
    else this.openMenu();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.hasAttribute('open')) this.openMenu();
  }

  override disconnectedCallback(): void {
    this._teardownMenu(true);
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'open') {
      if (newValue != null) this.openMenu();
      else this._beginCloseMenu();
      return;
    }
    if (this.isConnected) this.requestRender();
  }

  protected render(): void {
    const label = this.getAttribute('label') || 'Run action';
    const menuLabel = this.getAttribute('menu-label') || 'Open action menu';
    this.setContent(`
      <style>${style}</style>
      <div class="group" part="group">
        <button class="button" part="button" type="button">${label}</button>
        <button class="toggle" part="toggle" type="button" aria-label="${menuLabel}" aria-haspopup="menu" aria-expanded="${this.hasAttribute('open') ? 'true' : 'false'}">
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="slot-source"><slot name="menuitem"></slot></div>
    `);

    this._triggerButton = this.root.querySelector('.button');
    this._toggleButton = this.root.querySelector('.toggle');
    this._syncToggleState();
    this._triggerButton?.addEventListener('click', this._onPrimaryClick);
    this._toggleButton?.addEventListener('click', this._onToggleClick);
    this._toggleButton?.addEventListener('keydown', this._onKeyDown);
  }

  private _onPrimaryClick(event: Event): void {
    if (this.hasAttribute('disabled')) return;
    this.dispatchEvent(new CustomEvent('primary-action', { detail: { originalEvent: event }, bubbles: true, composed: true }));
  }

  private _onToggleClick(): void {
    this.toggleMenu();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openMenu();
    }
  }

  private _mountMenu(): void {
    if (this._portalEl) return;
    const portalRoot = createPortalContainer();
    if (!portalRoot) return;
    this._portalRoot = portalRoot;
    this._portalRoot.classList.add('ui-split-button-portal');
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('data-state', 'opening');
    menu.tabIndex = -1;
    menu.style.pointerEvents = 'auto';
    const styleEl = document.createElement('style');
    styleEl.textContent = menuStyle;
    const menuHeading = this.getAttribute('menu-heading') || '';
    const menuDescription = this.getAttribute('menu-description') || '';
    const header =
      menuHeading || menuDescription
        ? (() => {
            const section = document.createElement('div');
            section.className = 'menu-header';
            if (menuHeading) {
              const heading = document.createElement('p');
              heading.className = 'menu-heading';
              heading.textContent = menuHeading;
              section.appendChild(heading);
            }
            if (menuDescription) {
              const description = document.createElement('p');
              description.className = 'menu-description';
              description.textContent = menuDescription;
              section.appendChild(description);
            }
            return section;
          })()
        : null;
    const listbox = document.createElement('ui-listbox') as UIListbox;
    listbox.setAttribute('item-selector', '[slot="menuitem"]');
    listbox.setAttribute('item-role', 'menuitem');
    listbox.setAttribute('active-attribute', 'data-active');
    this._menuItems = this._collectMenuItems();
    if (this._menuItems.length === 0) {
      this.removeAttribute('open');
      return;
    }
    const groupRect = this.root.querySelector('.group')?.getBoundingClientRect();
    if (groupRect && Number.isFinite(groupRect.width) && groupRect.width > 0) {
      menu.style.minWidth = `${Math.max(236, Math.round(groupRect.width))}px`;
    }
    this._menuItems.forEach((item) => listbox.appendChild(item));
    listbox.refresh();
    menu.append(styleEl);
    if (header) menu.appendChild(header);
    menu.appendChild(listbox);
    this._portalRoot.appendChild(menu);
    this._portalEl = menu;

    this._listbox = listbox;
    this._positioner = createPositioner({
      floating: menu,
      anchor: this._toggleButton || this,
      placement: 'bottom-start',
      offset: 6,
      fitViewport: true
    });
    this._layer = createDismissableLayer({
      node: menu,
      trigger: this._toggleButton,
      closeOnEscape: true,
      closeOnPointerOutside: true,
      onDismiss: () => this.closeMenu()
    });

    listbox.addEventListener('click', (event) => this._onMenuClick(event));
    listbox.addEventListener('keydown', (event) => this._onMenuKeyDown(event as KeyboardEvent));
    const first = this._listbox.focusBoundary('first', { focus: false, scroll: false });
    if (first) this._listbox.setActiveItem(first, { focus: false, scroll: false });
    this._syncToggleState();
    requestAnimationFrame(() => this._setMenuState('open'));
    queueMicrotask(() => {
      try {
        menu.focus({ preventScroll: true });
      } catch {
        menu.focus();
      }
    });
  }

  private _collectMenuItems(): HTMLElement[] {
    const slot = this.root.querySelector('slot[name="menuitem"]') as HTMLSlotElement | null;
    const assigned = slot ? (slot.assignedElements({ flatten: true }) as HTMLElement[]) : [];
    return assigned
      .filter((node) => node.getAttribute('slot') === 'menuitem')
      .map((node, index) => cloneMenuItem(node, index));
  }

  private _onMenuClick(event: Event): void {
    const path = event.composedPath();
    const item = this._menuItems.find((entry) => path.includes(entry));
    if (!item) {
      const clone = (event.target as HTMLElement | null)?.closest?.('[data-menu-item]') as HTMLElement | null;
      if (clone) this._selectMenuItem(clone);
      return;
    }
    this._selectMenuItem(item);
  }

  private _onMenuKeyDown(event: KeyboardEvent): void {
    if (!this._listbox) return;
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      this.closeMenu();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._listbox.move(1, { focus: false, scroll: true });
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._listbox.move(-1, { focus: false, scroll: true });
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      this._listbox.focusBoundary('first', { focus: false, scroll: true });
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      this._listbox.focusBoundary('last', { focus: false, scroll: true });
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const active = this._listbox.getActiveItem();
      if (active) this._selectMenuItem(active);
    }
  }

  private _syncToggleState(): void {
    this._toggleButton?.setAttribute('aria-expanded', this.hasAttribute('open') ? 'true' : 'false');
  }

  private _selectMenuItem(item: HTMLElement): void {
    const index = Number(item.getAttribute('data-index') || -1);
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: {
          index,
          value: item.getAttribute('data-value') || undefined,
          label: item.getAttribute('data-label') || (item.textContent || '').trim()
        },
        bubbles: true,
        composed: true
      })
    );
    this.closeMenu();
  }

  private _beginCloseMenu(): void {
    if (!this._portalEl) return;
    this._clearCloseTimer();
    this._setMenuState('closing');
    this._portalEl.style.pointerEvents = 'none';
    this._closeTimer = window.setTimeout(() => {
      this._closeTimer = null;
      this._teardownMenu(true);
    }, MENU_TRANSITION_MS);
  }

  private _setMenuState(state: 'opening' | 'open' | 'closing'): void {
    this._portalEl?.setAttribute('data-state', state);
  }

  private _clearCloseTimer(): void {
    if (this._closeTimer == null) return;
    window.clearTimeout(this._closeTimer);
    this._closeTimer = null;
  }

  private _teardownMenu(restoreFocus = false): void {
    this._clearCloseTimer();
    this._layer?.destroy();
    this._layer = null;
    this._positioner?.destroy();
    this._positioner = null;
    this._listbox = null;
    if (this._portalEl?.parentElement) this._portalEl.parentElement.removeChild(this._portalEl);
    this._portalEl = null;
    this._portalRoot = null;
    this._syncToggleState();
    if (restoreFocus) {
      const focusTarget = this._toggleButton || this._lastFocused;
      if (focusTarget && focusTarget.isConnected) {
        queueMicrotask(() => {
          try {
            focusTarget.focus({ preventScroll: true });
          } catch {
            focusTarget.focus();
          }
        });
      }
    }
    this._lastFocused = null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-split-button': UISplitButton;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-split-button')) {
  customElements.define('ui-split-button', UISplitButton);
}
