import { findIndexByValue, findTypeaheadMatch, type CollectionTypeaheadOptions } from '../primitives/collection';

export interface UICollectionQueryOptions {
  container?: ParentNode | null;
  includeHidden?: boolean;
}

export interface UICollectionTypeaheadOptions extends CollectionTypeaheadOptions<HTMLElement> {
  container?: ParentNode | null;
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

function getItemLabel(item: HTMLElement): string {
  return item.getAttribute('aria-label') || item.textContent || '';
}

function toArray<T extends Element>(nodes: Iterable<T>): T[] {
  return Array.from(nodes);
}

export class UICollection extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['item-selector', 'direct-item-selector', 'item-role'];
  }

  private _container: ParentNode | null = null;
  private _items: HTMLElement[] | null = null;
  private _observer: MutationObserver | null = null;

  connectedCallback(): void {
    this.refresh();
    this._syncObserver();
  }

  disconnectedCallback(): void {
    this._disconnectObserver();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'item-selector' || name === 'direct-item-selector' || name === 'item-role') {
      this.refresh();
      this._syncObserver();
    }
  }

  get container(): ParentNode | null {
    return this._container;
  }

  set container(value: ParentNode | null) {
    if (this._container === value) return;
    this._container = value;
    this.refresh();
    this._syncObserver();
  }

  get itemSelector(): string {
    return this.getAttribute('item-selector') || '[data-collection-item], .menuitem, [role="option"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';
  }

  set itemSelector(value: string) {
    this.setAttribute('item-selector', value);
  }

  get directItemSelector(): string {
    return this.getAttribute('direct-item-selector') || '';
  }

  set directItemSelector(value: string) {
    if (value) this.setAttribute('direct-item-selector', value);
    else this.removeAttribute('direct-item-selector');
  }

  get itemRole(): string {
    return this.getAttribute('item-role') || '';
  }

  set itemRole(value: string) {
    if (value) this.setAttribute('item-role', value);
    else this.removeAttribute('item-role');
  }

  get items(): HTMLElement[] | null {
    return this._items;
  }

  set items(value: HTMLElement[] | null) {
    this._items = value ? [...value] : null;
    this.refresh();
  }

  refresh(): HTMLElement[] {
    const items = this.queryItems();
    this.syncItemSemantics();
    return items;
  }

  queryItems(options: UICollectionQueryOptions = {}): HTMLElement[] {
    if (this._items) {
      const items = [...this._items];
      if (options.includeHidden) return items;
      return items.filter((item) => isVisibleItem(item));
    }

    const root = this._queryRoot(options.container);
    if (!root) return [];

    const directSelector = this.directItemSelector.trim();
    let items = directSelector ? toArray(root.querySelectorAll<HTMLElement>(directSelector)) : [];
    if (!items.length) {
      items = toArray(root.querySelectorAll<HTMLElement>(this.itemSelector));
    }

    if (options.includeHidden) return items;
    return items.filter((item) => isVisibleItem(item));
  }

  queryEnabledItems(options: UICollectionQueryOptions = {}): HTMLElement[] {
    return this.queryItems(options).filter((item) => !isDisabledItem(item));
  }

  indexOf(item: HTMLElement | null, options: UICollectionQueryOptions = {}): number {
    if (!item) return -1;
    return this.queryItems(options).indexOf(item);
  }

  findByValue(value: string, options: UICollectionQueryOptions = {}): HTMLElement | null {
    const items = this.queryItems(options);
    const index = findIndexByValue(items, value, (item) => item.getAttribute('data-value') || item.getAttribute('value') || '');
    return index >= 0 ? items[index] : null;
  }

  findTypeaheadMatch(query: string, options: UICollectionTypeaheadOptions = {}): HTMLElement | null {
    const items = this.queryEnabledItems({ container: options.container });
    const startIndex = typeof options.startIndex === 'number' ? options.startIndex : -1;
    const index = findTypeaheadMatch(items, query, {
      startIndex,
      getLabel: options.getLabel || getItemLabel,
      getDisabled: options.getDisabled || isDisabledItem
    });
    return index >= 0 ? items[index] : null;
  }

  syncItemSemantics(options: UICollectionQueryOptions = {}): void {
    const role = this.itemRole;
    this.queryItems({ ...options, includeHidden: true }).forEach((item, index) => {
      if (role && !item.getAttribute('role')) item.setAttribute('role', role);
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1');
      item.setAttribute('data-collection-index', String(index));

      const disabled = isDisabledItem(item);
      if (item.getAttribute('aria-disabled') !== (disabled ? 'true' : 'false')) {
        item.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      }

      const itemRole = item.getAttribute('role');
      if ((itemRole === 'menuitemcheckbox' || itemRole === 'menuitemradio') && !item.hasAttribute('aria-checked')) {
        item.setAttribute('aria-checked', 'false');
      }
    });
  }

  protected isItemDisabled(item: HTMLElement): boolean {
    return isDisabledItem(item);
  }

  protected getItemLabel(item: HTMLElement): string {
    return getItemLabel(item);
  }

  private _queryRoot(container?: ParentNode | null): ParentNode | null {
    return container || this._container || this;
  }

  private _disconnectObserver(): void {
    this._observer?.disconnect();
    this._observer = null;
  }

  private _syncObserver(): void {
    const root = this._queryRoot();
    this._disconnectObserver();
    if (!(root instanceof HTMLElement || root instanceof ShadowRoot || root instanceof DocumentFragment)) return;
    this._observer = new MutationObserver(() => {
      this.syncItemSemantics();
      this.dispatchEvent(new CustomEvent('collection-change', { bubbles: true, composed: true }));
    });
    this._observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden', 'disabled', 'aria-disabled', 'role', 'value', 'data-value', 'aria-label']
    });
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-collection')) {
  customElements.define('ui-collection', UICollection);
}
