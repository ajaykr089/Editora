import { ElementBase } from '../ElementBase';
import { findTreeRecordIndexById, findParentTreeRecordIndex, findTreeTypeaheadMatch, flattenVisibleTree } from '../primitives/tree';
import './ui-tree-item';
import { UITreeItem } from './ui-tree-item';

const style = `
  :host {
    --ui-tree-indent: 16px;
    --ui-tree-radius: 14px;
    --ui-tree-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent);
    --ui-tree-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-tree-text: var(--ui-color-text, #0f172a);
    --ui-tree-muted: var(--ui-color-muted, #64748b);
    display: block;
    min-inline-size: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .tree {
    min-inline-size: 0;
    display: grid;
    gap: 4px;
    padding: 10px;
    border: 1px solid var(--ui-tree-border);
    border-radius: var(--ui-tree-radius);
    background: var(--ui-tree-bg);
    color: var(--ui-tree-text);
  }

  @media (forced-colors: active) {
    .tree {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }
  }
`;

type TreeDomRecord = {
  item: UITreeItem;
  id: string;
  label: string;
  level: number;
  parentId: string | null;
  disabled: boolean;
  expanded: boolean;
  hasChildren: boolean;
};

export class UITree extends ElementBase {
  static get observedAttributes() {
    return ['value', 'indent-size'];
  }

  private _observer: MutationObserver | null = null;
  private _focusedValue: string | null = null;
  private _typeaheadBuffer = '';
  private _typeaheadTimer: number | null = null;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onMutation = this._onMutation.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeyDown);
    this._observer = new MutationObserver(this._onMutation);
    this._observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['expanded', 'selected', 'disabled', 'label', 'value'] });
    queueMicrotask(() => this._syncTree());
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeyDown);
    this._observer?.disconnect();
    this._observer = null;
    if (this._typeaheadTimer != null) window.clearTimeout(this._typeaheadTimer);
    super.disconnectedCallback();
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    if (!next) this.removeAttribute('value');
    else this.setAttribute('value', next);
  }

  expand(value: string): void {
    const item = this._findByValue(value);
    if (!item || item.childItems.length === 0) return;
    item.setAttribute('expanded', '');
    this._emitToggle(item, true);
    this._syncTree();
  }

  collapse(value: string): void {
    const item = this._findByValue(value);
    if (!item || item.childItems.length === 0) return;
    item.removeAttribute('expanded');
    this._emitToggle(item, false);
    this._syncTree();
  }

  toggle(value: string): void {
    const item = this._findByValue(value);
    if (!item || item.childItems.length === 0) return;
    const expanded = !item.hasAttribute('expanded');
    item.toggleAttribute('expanded', expanded);
    this._emitToggle(item, expanded);
    this._syncTree();
  }

  select(value: string): void {
    const item = this._findByValue(value);
    if (!item || item.hasAttribute('disabled')) return;
    this.value = value;
    this._focusedValue = value;
    this._emitSelect(item);
    this._syncTree();
  }

  focusValue(value: string): void {
    const item = this._findByValue(value);
    if (!item) return;
    this._focusedValue = value;
    this._syncTree();
    item.focusRow({ preventScroll: true });
  }

  private _onMutation(): void {
    this._syncTree();
  }

  private _allItems(): UITreeItem[] {
    return Array.from(this.querySelectorAll('ui-tree-item')).filter((item): item is UITreeItem => item instanceof UITreeItem && item.closest('ui-tree') === this);
  }

  private _rootItems(): UITreeItem[] {
    return Array.from(this.children).filter((child): child is UITreeItem => child instanceof UITreeItem);
  }

  private _visibleRecords(): TreeDomRecord[] {
    const roots = this._rootItems();
    return flattenVisibleTree(roots, {
      getId: (item) => item.value,
      getLabel: (item) => item.label,
      getChildren: (item) => item.childItems,
      getExpanded: (item) => item.hasAttribute('expanded'),
      getDisabled: (item) => item.hasAttribute('disabled')
    }).map((record) => ({
      ...record,
      item: record.item as UITreeItem
    }));
  }

  private _findByValue(value: string): UITreeItem | null {
    return this._allItems().find((item) => item.value === value) || null;
  }

  private _syncTree(): void {
    const allItems = this._allItems();
    const visible = this._visibleRecords();
    const selectedValue = this.value || visible.find((record) => !record.disabled)?.id || '';
    const focusValue = this._focusedValue && visible.some((record) => record.id === this._focusedValue)
      ? this._focusedValue
      : selectedValue;
    this._focusedValue = focusValue || null;

    const visibleIds = new Set(visible.map((record) => record.id));
    const visibleById = new Map(visible.map((record) => [record.id, record]));

    allItems.forEach((item) => {
      const record = visibleById.get(item.value);
      item.style.setProperty('--ui-tree-indent', this.getAttribute('indent-size') || '16px');
      item.applyTreeState({
        level: record?.level || 1,
        hasChildren: item.childItems.length > 0,
        expanded: item.hasAttribute('expanded'),
        selected: item.value === selectedValue,
        active: item.value === focusValue,
        hidden: !visibleIds.has(item.value)
      });
    });
  }

  private _moveFocus(step: 1 | -1): void {
    const visible = this._visibleRecords();
    if (!visible.length) return;
    const currentIndex = findTreeRecordIndexById(visible, this._focusedValue || this.value || '');
    const start = currentIndex >= 0 ? currentIndex : -1;

    for (let offset = 1; offset <= visible.length; offset += 1) {
      const index = (start + step * offset + visible.length) % visible.length;
      const record = visible[index];
      if (record.disabled) continue;
      this.focusValue(record.id);
      return;
    }
  }

  private _emitSelect(item: UITreeItem): void {
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { value: item.value, label: item.label },
        bubbles: true,
        composed: true
      })
    );
  }

  private _emitToggle(item: UITreeItem, expanded: boolean): void {
    this.dispatchEvent(
      new CustomEvent('expanded-change', {
        detail: { value: item.value, expanded },
        bubbles: true,
        composed: true
      })
    );
  }

  private _onClick(event: Event): void {
    const path = event.composedPath();
    const item = path.find((node): node is UITreeItem => node instanceof UITreeItem);
    if (!item || item.hasAttribute('disabled')) return;

    const toggleHit = path.find((node) => node instanceof HTMLElement && node.getAttribute('data-action') === 'toggle');
    this._focusedValue = item.value;

    if (toggleHit && item.childItems.length > 0) {
      this.toggle(item.value);
      return;
    }

    this.select(item.value);
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const visible = this._visibleRecords();
    if (!visible.length) return;

    const currentIndex = findTreeRecordIndexById(visible, this._focusedValue || this.value || '');
    const current = currentIndex >= 0 ? visible[currentIndex] : visible[0];
    if (!current) return;

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
      this.focusValue(visible[0].id);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.focusValue(visible[visible.length - 1].id);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (current.hasChildren && !current.expanded) {
        this.expand(current.id);
        return;
      }
      if (current.hasChildren && current.expanded) {
        const next = visible[currentIndex + 1];
        if (next?.parentId === current.id) this.focusValue(next.id);
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (current.hasChildren && current.expanded) {
        this.collapse(current.id);
        return;
      }
      const parentIndex = findParentTreeRecordIndex(visible, currentIndex);
      if (parentIndex >= 0) this.focusValue(visible[parentIndex].id);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(current.id);
      return;
    }

    if (event.key.length === 1 && /\S/.test(event.key)) {
      this._typeaheadBuffer = `${this._typeaheadBuffer}${event.key.toLowerCase()}`.slice(0, 24);
      if (this._typeaheadTimer != null) window.clearTimeout(this._typeaheadTimer);
      this._typeaheadTimer = window.setTimeout(() => {
        this._typeaheadBuffer = '';
        this._typeaheadTimer = null;
      }, 420);
      const match = findTreeTypeaheadMatch(visible, this._typeaheadBuffer, currentIndex);
      if (match >= 0) {
        event.preventDefault();
        this.focusValue(visible[match].id);
      }
    }
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    return name === 'indent-size';
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="tree" part="tree" role="tree">
        <slot></slot>
      </div>
    `);
    queueMicrotask(() => this._syncTree());
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tree': UITree;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-tree')) {
  customElements.define('ui-tree', UITree);
}
