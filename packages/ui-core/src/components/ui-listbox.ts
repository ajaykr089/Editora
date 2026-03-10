import {
  getListboxBoundaryIndex,
  moveListboxActiveIndex,
  resolveListboxActiveIndex,
  scrollListboxItemIntoView,
  syncActiveDescendant
} from '../primitives/listbox';
import { UICollection, type UICollectionQueryOptions } from './ui-collection';

export interface UIListboxSetActiveOptions extends UICollectionQueryOptions {
  focus?: boolean;
  scroll?: boolean;
  owner?: HTMLElement | null;
  current?: HTMLElement | null;
}

export interface UIListboxMoveOptions extends UIListboxSetActiveOptions {
  wrap?: boolean;
}

const LISTBOX_BASE_STYLE_ATTR = 'data-ui-listbox-base-style';
const LISTBOX_BASE_STYLE = `
  ui-listbox {
    display: block;
    min-inline-size: 0;
  }

  ui-listbox .option-text,
  ui-listbox [data-option-text] {
    min-inline-size: 0;
    display: grid;
    gap: 2px;
    flex: 1 1 auto;
  }

  ui-listbox .option-label,
  ui-listbox [data-option-label] {
    display: block;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ui-listbox .option-description,
  ui-listbox [data-option-description] {
    display: block;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

function isFocusable(item: HTMLElement): boolean {
  const tabindex = item.getAttribute('tabindex');
  if (tabindex != null) return tabindex !== '-1' || item.matches(':focus');
  return typeof (item as { focus?: unknown }).focus === 'function';
}

export class UIListbox extends UICollection {
  connectedCallback(): void {
    this._ensureBaseStyle();
    super.connectedCallback();
  }

  static get observedAttributes(): string[] {
    return [...UICollection.observedAttributes, 'active-attribute'];
  }

  get activeAttribute(): string {
    return this.getAttribute('active-attribute') || 'data-active';
  }

  set activeAttribute(value: string) {
    if (value) this.setAttribute('active-attribute', value);
    else this.removeAttribute('active-attribute');
  }

  getActiveItem(options: UICollectionQueryOptions = {}): HTMLElement | null {
    const attr = this.activeAttribute;
    return this.queryItems(options).find((item) => item.getAttribute(attr) === 'true') || null;
  }

  clearActive(options: UICollectionQueryOptions = {}): void {
    const attr = this.activeAttribute;
    this.queryItems(options).forEach((item) => {
      item.removeAttribute(attr);
      if (!item.hasAttribute('disabled')) item.setAttribute('tabindex', '-1');
    });
  }

  setActiveItem(item: HTMLElement | null, options: UIListboxSetActiveOptions = {}): HTMLElement | null {
    const items = this.queryItems(options);
    const attr = this.activeAttribute;
    const next = item && items.includes(item) ? item : null;

    items.forEach((entry) => {
      if (entry === next) {
        entry.setAttribute(attr, 'true');
        if (isFocusable(entry)) entry.setAttribute('tabindex', '0');
      } else {
        entry.removeAttribute(attr);
        if (!entry.hasAttribute('disabled')) entry.setAttribute('tabindex', '-1');
      }
    });

    syncActiveDescendant(options.owner || null, next?.id || null);

    if (!next) return null;
    if (options.scroll !== false) {
      scrollListboxItemIntoView(next, { block: 'nearest', inline: 'nearest' });
    }
    if (options.focus) {
      try {
        next.focus({ preventScroll: options.scroll === false });
      } catch {
        next.focus();
      }
    }
    return next;
  }

  focusBoundary(edge: 'first' | 'last', options: UIListboxSetActiveOptions = {}): HTMLElement | null {
    const items = this.queryItems(options);
    const index = getListboxBoundaryIndex(items, edge, (item) => this.isItemDisabled(item));
    if (index < 0) return null;
    return this.setActiveItem(items[index], options);
  }

  move(step: 1 | -1, options: UIListboxMoveOptions = {}): HTMLElement | null {
    const items = this.queryItems(options);
    if (!items.length) return null;

    const current = options.current || this.getActiveItem(options);
    const currentIndex = current ? items.indexOf(current) : -1;
    const selectedIndex = currentIndex;
    const fallbackIndex = resolveListboxActiveIndex(items, {
      activeIndex: currentIndex,
      selectedIndex,
      getDisabled: (item) => this.isItemDisabled(item)
    });

    const nextIndex = moveListboxActiveIndex(items, currentIndex, step, {
      wrap: options.wrap !== false,
      fallbackIndex,
      getDisabled: (item) => this.isItemDisabled(item)
    });

    if (nextIndex < 0) return null;
    return this.setActiveItem(items[nextIndex], options);
  }

  typeahead(query: string, options: UIListboxMoveOptions = {}): HTMLElement | null {
    const current = options.current || this.getActiveItem(options);
    const items = this.queryEnabledItems(options);
    const startIndex = current ? items.indexOf(current) : -1;
    const match = this.findTypeaheadMatch(query, { container: options.container, startIndex });
    if (!match) return null;
    return this.setActiveItem(match, options);
  }

  private _ensureBaseStyle(): void {
    const root = this.getRootNode();
    if (root instanceof ShadowRoot) {
      if (root.querySelector(`style[${LISTBOX_BASE_STYLE_ATTR}]`)) return;
      const style = document.createElement('style');
      style.setAttribute(LISTBOX_BASE_STYLE_ATTR, '');
      style.textContent = LISTBOX_BASE_STYLE;
      root.append(style);
      return;
    }

    if (typeof document === 'undefined') return;
    if (document.head.querySelector(`style[${LISTBOX_BASE_STYLE_ATTR}]`)) return;
    const style = document.createElement('style');
    style.setAttribute(LISTBOX_BASE_STYLE_ATTR, '');
    style.textContent = LISTBOX_BASE_STYLE;
    document.head.append(style);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-listbox')) {
  customElements.define('ui-listbox', UIListbox);
}
