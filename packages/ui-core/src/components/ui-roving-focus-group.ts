import {
  focusRovingItem,
  getRovingFocusBoundaryIndex,
  moveRovingFocusIndex,
  resolveRovingFocusIndex,
  syncRovingTabStops
} from '../primitives/roving-focus-group';

export interface UIRovingFocusMoveOptions {
  current?: HTMLElement | null;
  wrap?: boolean;
  focus?: boolean;
}

function isVisibleItem(item: HTMLElement): boolean {
  if (!item.isConnected) return false;
  if (item.hidden) return false;
  const style = window.getComputedStyle(item);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  return true;
}

function isDisabledItem(item: HTMLElement): boolean {
  const ariaDisabled = item.getAttribute('aria-disabled');
  return item.hasAttribute('disabled') || ariaDisabled === 'true' || (item as { disabled?: boolean }).disabled === true;
}

export class UIRovingFocusGroup extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['item-selector', 'direct-item-selector', 'active-attribute', 'loop'];
  }

  private _container: ParentNode | null = null;

  get container(): ParentNode | null {
    return this._container;
  }

  set container(value: ParentNode | null) {
    this._container = value;
  }

  get itemSelector(): string {
    return this.getAttribute('item-selector') || '[tabindex], button, [role="tab"], [role="radio"]';
  }

  get directItemSelector(): string {
    return this.getAttribute('direct-item-selector') || '';
  }

  get activeAttribute(): string | null {
    const raw = this.getAttribute('active-attribute');
    return raw === '' ? null : raw || null;
  }

  queryItems(): HTMLElement[] {
    const root = this._container || this;
    const directSelector = this.directItemSelector.trim();
    let items = directSelector ? Array.from(root.querySelectorAll<HTMLElement>(directSelector)) : [];
    if (!items.length) items = Array.from(root.querySelectorAll<HTMLElement>(this.itemSelector));
    return items.filter((item) => isVisibleItem(item));
  }

  queryEnabledItems(): HTMLElement[] {
    return this.queryItems().filter((item) => !isDisabledItem(item));
  }

  getActiveItem(): HTMLElement | null {
    return this.queryItems().find((item) => item.getAttribute('tabindex') === '0') || null;
  }

  setActiveItem(item: HTMLElement | null, options: { focus?: boolean } = {}): HTMLElement | null {
    const items = this.queryItems();
    const next = item && items.includes(item) && !isDisabledItem(item) ? item : null;
    syncRovingTabStops(items, next, { activeAttribute: this.activeAttribute });
    if (next && options.focus) focusRovingItem(next);
    this.dispatchEvent(new CustomEvent('active-item-change', { detail: { item: next }, bubbles: true, composed: true }));
    return next;
  }

  focusBoundary(edge: 'first' | 'last', options: { focus?: boolean } = {}): HTMLElement | null {
    const items = this.queryItems();
    const index = getRovingFocusBoundaryIndex(items, edge, isDisabledItem);
    if (index < 0) return null;
    return this.setActiveItem(items[index], options);
  }

  move(step: 1 | -1, options: UIRovingFocusMoveOptions = {}): HTMLElement | null {
    const items = this.queryItems();
    if (!items.length) return null;
    const current = options.current || this.getActiveItem();
    const currentIndex = current ? items.indexOf(current) : -1;
    const fallbackIndex = resolveRovingFocusIndex(items, {
      activeIndex: currentIndex,
      getDisabled: isDisabledItem
    });
    const nextIndex = moveRovingFocusIndex(items, currentIndex, step, {
      wrap: options.wrap !== false && (this.getAttribute('loop') !== 'false'),
      fallbackIndex,
      getDisabled: isDisabledItem
    });
    if (nextIndex < 0) return null;
    return this.setActiveItem(items[nextIndex], { focus: options.focus });
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-roving-focus-group')) {
  customElements.define('ui-roving-focus-group', UIRovingFocusGroup);
}
