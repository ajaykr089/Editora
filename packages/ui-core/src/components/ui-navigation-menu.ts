import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    color-scheme: light dark;
    --ui-nav-gap: 8px;
    --ui-nav-padding: 6px;
    --ui-nav-radius: 14px;
    --ui-nav-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 86%, transparent);
    --ui-nav-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-nav-shadow: 0 12px 34px rgba(15, 23, 42, 0.09);
    --ui-nav-item-radius: 10px;
    --ui-nav-item-padding: 8px 10px;
    --ui-nav-item-color: var(--ui-color-muted, #334155);
    --ui-nav-item-hover-bg: color-mix(in srgb, var(--ui-color-text, #0f172a) 8%, transparent);
    --ui-nav-item-active-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 14%, transparent);
    --ui-nav-item-active-color: var(--ui-color-primary, #1d4ed8);
    --ui-nav-panel-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 93%, transparent);
    --ui-nav-panel-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 68%, transparent);
    --ui-nav-panel-radius: 12px;
    --ui-nav-panel-shadow: 0 18px 42px rgba(15, 23, 42, 0.1);
  }

  .root {
    display: grid;
    gap: 10px;
  }

  .list {
    display: flex;
    gap: var(--ui-nav-gap);
    padding: var(--ui-nav-padding);
    border-radius: var(--ui-nav-radius);
    border: var(--ui-nav-border);
    background: var(--ui-nav-bg);
    box-shadow: var(--ui-nav-shadow);
    backdrop-filter: saturate(1.1) blur(10px);
  }

  :host([orientation="vertical"]) .list {
    flex-direction: column;
    align-items: stretch;
  }

  ::slotted([slot="item"]) {
    appearance: none;
    border: none;
    background: transparent;
    color: var(--ui-nav-item-color);
    border-radius: var(--ui-nav-item-radius);
    padding: var(--ui-nav-item-padding);
    line-height: 1.35;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    transition: background-color 120ms ease, color 120ms ease, transform 120ms ease;
    outline: none;
  }

  ::slotted([slot="item"]:hover),
  ::slotted([slot="item"]:focus-visible) {
    background: var(--ui-nav-item-hover-bg);
  }

  ::slotted([slot="item"]:focus-visible) {
    outline: 2px solid var(--ui-color-focus-ring, #2563eb);
    outline-offset: 1px;
  }

  ::slotted([slot="item"][data-active="true"]) {
    background: var(--ui-nav-item-active-bg);
    color: var(--ui-nav-item-active-color);
  }

  .viewport {
    border-radius: var(--ui-nav-panel-radius);
    border: var(--ui-nav-panel-border);
    background: var(--ui-nav-panel-bg);
    box-shadow: var(--ui-nav-panel-shadow);
    padding: 10px;
  }

  ::slotted([slot="panel"]) {
    display: none;
  }

  ::slotted([slot="panel"][data-active="true"]) {
    display: block;
  }

  .viewport[hidden] {
    display: none;
  }

  :host([headless]) .list,
  :host([headless]) .viewport {
    display: none !important;
  }

  @media (prefers-contrast: more) {
    .list,
    .viewport {
      border-width: 2px;
      box-shadow: none;
      backdrop-filter: none;
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
      backdrop-filter: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ::slotted([slot="item"]) {
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

export class UINavigationMenu extends ElementBase {
  static get observedAttributes() {
    return ['selected', 'orientation', 'activation', 'headless', 'collapsible', 'loop'];
  }

  private _items: HTMLElement[] = [];
  private _panels: HTMLElement[] = [];
  private _ignoreSelectedAttribute = false;
  private _itemSlot: HTMLSlotElement | null = null;
  private _panelSlot: HTMLSlotElement | null = null;
  private _uid = Math.random().toString(36).slice(2, 8);

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this._attachSlotHandlers();
    this._syncStructure();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this._detachSlotHandlers();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'selected' && this._ignoreSelectedAttribute) return;
    if (oldValue === newValue) return;
    if (name === 'orientation' && this.isConnected) this.requestRender();
    this._attachSlotHandlers();
    this._syncStructure();
  }

  protected render() {
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="list" part="list" role="tablist" aria-orientation="${orientation}">
          <slot name="item"></slot>
        </div>
        <div class="viewport" part="viewport">
          <slot name="panel"></slot>
        </div>
      </div>
    `);
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
    if (this._itemSlot) {
      this._itemSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (this._panelSlot) {
      this._panelSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    this._itemSlot = null;
    this._panelSlot = null;
  }

  private _onSlotChange() {
    this._syncStructure();
  }

  private _getSelectedFromAttribute(): number {
    const raw = this.getAttribute('selected');
    if (raw == null || raw === '') return this._items.length > 0 ? 0 : -1;
    const next = Number(raw);
    if (Number.isNaN(next)) return this._items.length > 0 ? 0 : -1;
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

    const selectedIndex = this._getSelectedFromAttribute();
    const panelViewport = this.root.querySelector('.viewport') as HTMLElement | null;

    this._items.forEach((item, index) => {
      const active = selectedIndex === index;
      const itemId = item.id || `ui-navigation-menu-item-${this._uid}-${index}`;
      const panel = this._panels[index];
      const panelId = panel ? panel.id || `ui-navigation-menu-panel-${this._uid}-${index}` : '';

      item.id = itemId;
      item.setAttribute('role', 'tab');
      item.setAttribute('aria-selected', active ? 'true' : 'false');
      item.setAttribute('tabindex', active ? '0' : '-1');
      item.setAttribute('data-active', active ? 'true' : 'false');
      item.setAttribute('aria-controls', panelId);
    });

    this._panels.forEach((panel, index) => {
      const active = selectedIndex === index;
      const item = this._items[index];
      const panelId = panel.id || `ui-navigation-menu-panel-${this._uid}-${index}`;
      panel.id = panelId;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('tabindex', '0');
      panel.setAttribute('aria-hidden', active ? 'false' : 'true');
      panel.setAttribute('data-active', active ? 'true' : 'false');
      if (item?.id) panel.setAttribute('aria-labelledby', item.id);
      else panel.removeAttribute('aria-labelledby');
      if (active) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });

    if (panelViewport) {
      const hasActivePanel = this._panels.some((_, index) => index === selectedIndex);
      if (hasActivePanel) panelViewport.removeAttribute('hidden');
      else panelViewport.setAttribute('hidden', '');
    }
  }

  private _selectIndex(index: number, reason: 'click' | 'keyboard' | 'programmatic') {
    const previous = this._getSelectedFromAttribute();
    const next = index < 0 ? -1 : clampIndex(index, this._items.length);
    if (next === previous) return;
    this._setSelectedAttribute(next);
    this._syncStructure();
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

  private _onClick(event: MouseEvent) {
    const path = event.composedPath();
    const itemIndex = this._items.findIndex((item) => path.includes(item));
    if (itemIndex < 0) return;

    const collapsible = this.hasAttribute('collapsible');
    const selectedIndex = this._getSelectedFromAttribute();
    if (collapsible && selectedIndex === itemIndex) {
      this._selectIndex(-1, 'click');
      return;
    }

    this._selectIndex(itemIndex, 'click');
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
    const selectedIndex = this._getSelectedFromAttribute();
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
      }
    } else {
      if (event.key === 'ArrowDown') {
        nextFocus = this._moveFocus(focusIndex, 1);
        handled = true;
      } else if (event.key === 'ArrowUp') {
        nextFocus = this._moveFocus(focusIndex, -1);
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

    if (handled) {
      event.preventDefault();
      if (nextFocus >= 0 && nextFocus !== focusIndex) {
        this._focusItem(nextFocus);
        if (activation === 'automatic') {
          this._selectIndex(nextFocus, 'keyboard');
        } else {
          this._items.forEach((item, idx) => {
            item.setAttribute('tabindex', idx === nextFocus ? '0' : '-1');
          });
        }
      } else if (activation === 'manual' && selectedIndex !== this._getSelectedFromAttribute()) {
        this._syncStructure();
      }
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-navigation-menu')) {
  customElements.define('ui-navigation-menu', UINavigationMenu);
}
