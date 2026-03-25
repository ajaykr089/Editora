import { ElementBase } from '../ElementBase';

type ResponsiveMap = Partial<Record<'initial' | 'sm' | 'md' | 'lg' | 'xl', string>>;
type PlacementOrder = 'dom' | 'row-major';
type MoveReason = 'pointer' | 'keyboard' | 'api';

type PlacementMeta = {
  el: HTMLElement;
  index: number;
  row: number;
  column: number;
  rowSpan: number;
  columnSpan: number;
  value: string;
  disabled: boolean;
  selected: boolean;
};

const BREAKPOINTS: Record<Exclude<keyof ResponsiveMap, 'initial'>, string> = {
  sm: 'var(--ui-breakpoint-sm, 640px)',
  md: 'var(--ui-breakpoint-md, 768px)',
  lg: 'var(--ui-breakpoint-lg, 1024px)',
  xl: 'var(--ui-breakpoint-xl, 1280px)'
};

const GRID_ATTRS = [
  'display',
  'columns',
  'rows',
  'gap',
  'rowgap',
  'columngap',
  'autoflow',
  'autorows',
  'autocolumns',
  'align',
  'justify',
  'place',
  'aligncontent',
  'justifycontent',
  'placecontent'
] as const;

const SPACE_TOKENS: Record<string, string> = {
  xs: 'var(--ui-space-xs, 4px)',
  sm: 'var(--ui-space-sm, 8px)',
  md: 'var(--ui-space-md, 12px)',
  lg: 'var(--ui-space-lg, 20px)',
  xl: 'var(--ui-space-xl, 28px)'
};

const ITEM_ATTRS = [
  'data-row',
  'data-column',
  'data-row-span',
  'data-column-span',
  'data-value',
  'data-selected',
  'data-disabled',
  'hidden'
] as const;

const style = `
  :host {
    --ui-placement-display: grid;
    --ui-placement-columns: 1fr;
    --ui-placement-rows: none;
    --ui-placement-gap: 0px;
    --ui-placement-row-gap: var(--ui-placement-gap);
    --ui-placement-column-gap: var(--ui-placement-gap);
    --ui-placement-auto-flow: row;
    --ui-placement-auto-rows: auto;
    --ui-placement-auto-columns: auto;
    --ui-placement-align-items: stretch;
    --ui-placement-justify-items: stretch;
    --ui-placement-place-items: initial;
    --ui-placement-align-content: normal;
    --ui-placement-justify-content: normal;
    --ui-placement-place-content: initial;
    --ui-placement-color: var(--ui-color-text, inherit);
    --ui-placement-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    color-scheme: light dark;
    display: var(--ui-placement-display);
    color: var(--ui-placement-color);
    box-sizing: border-box;
    min-inline-size: 0;
    grid-template-columns: var(--ui-placement-columns);
    grid-template-rows: var(--ui-placement-rows);
    gap: var(--ui-placement-gap);
    row-gap: var(--ui-placement-row-gap);
    column-gap: var(--ui-placement-column-gap);
    grid-auto-flow: var(--ui-placement-auto-flow);
    grid-auto-rows: var(--ui-placement-auto-rows);
    grid-auto-columns: var(--ui-placement-auto-columns);
    align-items: var(--ui-placement-align-items);
    justify-items: var(--ui-placement-justify-items);
    place-items: var(--ui-placement-place-items);
    align-content: var(--ui-placement-align-content);
    justify-content: var(--ui-placement-justify-content);
    place-content: var(--ui-placement-place-content);
  }

  slot {
    display: contents;
  }

  ::slotted([data-ui-placement-item]) {
    box-sizing: border-box;
    min-inline-size: 0;
  }

  ::slotted([data-ui-placement-item][data-draggable]) {
    cursor: grab;
  }

  ::slotted([data-ui-placement-item][data-dragging]) {
    opacity: 0.68;
    cursor: grabbing;
  }

  ::slotted([data-ui-placement-item][data-drag-over]) {
    outline: 2px solid var(--ui-placement-focus-ring);
    outline-offset: 2px;
  }

  ::slotted([data-ui-placement-item][data-selected]),
  ::slotted([data-ui-placement-item]:focus-visible) {
    outline: 2px solid var(--ui-placement-focus-ring);
    outline-offset: 2px;
  }

  ::slotted([data-ui-placement-item][data-disabled]) {
    opacity: 0.56;
    filter: saturate(0.8);
  }

  :host([headless]) {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      scroll-behavior: auto;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-placement-color: var(--ui-color-text, inherit);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-placement-color: CanvasText;
      --ui-placement-focus-ring: Highlight;
    }
  }
`;

function parseResponsive(raw: string | null): ResponsiveMap | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value.startsWith('{')) return null;
  try {
    const parsed = JSON.parse(value) as ResponsiveMap;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function normalizeSpace(value: string): string {
  const token = SPACE_TOKENS[value];
  return token || value;
}

function parsePositiveInt(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return parsed;
}

function toCssVariable(attr: (typeof GRID_ATTRS)[number], value: string): Record<string, string> {
  switch (attr) {
    case 'display': return { '--ui-placement-display': value };
    case 'columns': return { '--ui-placement-columns': value };
    case 'rows': return { '--ui-placement-rows': value };
    case 'gap': return { '--ui-placement-gap': normalizeSpace(value) };
    case 'rowgap': return { '--ui-placement-row-gap': normalizeSpace(value) };
    case 'columngap': return { '--ui-placement-column-gap': normalizeSpace(value) };
    case 'autoflow': return { '--ui-placement-auto-flow': value };
    case 'autorows': return { '--ui-placement-auto-rows': value };
    case 'autocolumns': return { '--ui-placement-auto-columns': value };
    case 'align': return { '--ui-placement-align-items': value };
    case 'justify': return { '--ui-placement-justify-items': value };
    case 'place': return { '--ui-placement-place-items': value };
    case 'aligncontent': return { '--ui-placement-align-content': value };
    case 'justifycontent': return { '--ui-placement-justify-content': value };
    case 'placecontent': return { '--ui-placement-place-content': value };
    default: return {};
  }
}

export class UIPlacementGrid extends ElementBase {
  static get observedAttributes() {
    return ['classname', 'headless', 'interactive', 'draggable', 'order', ...GRID_ATTRS];
  }

  private _lastClassname = '';
  private _appliedInlineProps = new Set<string>();
  private _mutationObserver: MutationObserver | null = null;
  private _suppressMutations = false;
  private _focusedValue: string | null = null;
  private _dragItem: HTMLElement | null = null;
  private _dragOverItem: HTMLElement | null = null;
  private _onKeyDownBound = (event: KeyboardEvent) => this._onKeyDown(event);
  private _onClickBound = (event: MouseEvent) => this._onClick(event);
  private _onDragStartBound = (event: DragEvent) => this._onDragStart(event);
  private _onDragOverBound = (event: DragEvent) => this._onDragOver(event);
  private _onDropBound = (event: DragEvent) => this._onDrop(event);
  private _onDragEndBound = () => this._clearDragState();

  connectedCallback() {
    super.connectedCallback();
    this._observeMutations();
    this.addEventListener('keydown', this._onKeyDownBound);
    this.addEventListener('click', this._onClickBound);
    this.addEventListener('dragstart', this._onDragStartBound);
    this.addEventListener('dragover', this._onDragOverBound);
    this.addEventListener('drop', this._onDropBound);
    this.addEventListener('dragend', this._onDragEndBound);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this._onKeyDownBound);
    this.removeEventListener('click', this._onClickBound);
    this.removeEventListener('dragstart', this._onDragStartBound);
    this.removeEventListener('dragover', this._onDragOverBound);
    this.removeEventListener('drop', this._onDropBound);
    this.removeEventListener('dragend', this._onDragEndBound);
    this._mutationObserver?.disconnect();
    this._mutationObserver = null;
    this._clearDragState();
    super.disconnectedCallback();
  }

  refresh(): void {
    this.requestRender();
  }

  focusItem(target: number | string): void {
    const item = this._resolveItem(target);
    if (!item) return;
    this._setFocusedItem(item, true);
  }

  moveItem(target: number | string, row: number, column: number): void {
    const item = this._resolveItem(target);
    if (!item) return;
    this._moveItemTo(item, Math.max(1, row), Math.max(1, column), 'api');
  }

  private _observeMutations(): void {
    if (this._mutationObserver) return;
    this._mutationObserver = new MutationObserver(() => {
      if (this._suppressMutations) return;
      this.requestRender();
    });
    this._mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [...ITEM_ATTRS]
    });
  }

  private _syncLegacyClassname(): void {
    const next = this.getAttribute('classname') || '';
    if (next === this._lastClassname) return;

    if (this._lastClassname) {
      this._lastClassname.split(/\s+/).forEach((token) => {
        if (token) this.classList.remove(token);
      });
    }

    if (next) {
      next.split(/\s+/).forEach((token) => {
        if (token) this.classList.add(token);
      });
    }

    this._lastClassname = next;
  }

  private _applyInlineStyles(): void {
    this._appliedInlineProps.forEach((prop) => this.style.removeProperty(prop));
    this._appliedInlineProps.clear();

    GRID_ATTRS.forEach((attr) => {
      const raw = this.getAttribute(attr);
      if (!raw) return;
      if (parseResponsive(raw)) return;

      const mapped = toCssVariable(attr, raw);
      Object.entries(mapped).forEach(([prop, value]) => {
        this.style.setProperty(prop, value);
        this._appliedInlineProps.add(prop);
      });
    });
  }

  private _buildResponsiveCss(): string {
    const initial: Record<string, string> = {};
    const media: Record<Exclude<keyof ResponsiveMap, 'initial'>, Record<string, string>> = {
      sm: {},
      md: {},
      lg: {},
      xl: {}
    };

    GRID_ATTRS.forEach((attr) => {
      const raw = this.getAttribute(attr);
      const responsive = parseResponsive(raw);
      if (!responsive) return;

      const applyMap = (bucket: Record<string, string>, value: string) => {
        Object.assign(bucket, toCssVariable(attr, value));
      };

      if (typeof responsive.initial === 'string') applyMap(initial, responsive.initial);
      if (typeof responsive.sm === 'string') applyMap(media.sm, responsive.sm);
      if (typeof responsive.md === 'string') applyMap(media.md, responsive.md);
      if (typeof responsive.lg === 'string') applyMap(media.lg, responsive.lg);
      if (typeof responsive.xl === 'string') applyMap(media.xl, responsive.xl);
    });

    const ruleFor = (selector: string, values: Record<string, string>): string => {
      const entries = Object.entries(values);
      if (!entries.length) return '';
      return `${selector} { ${entries.map(([k, v]) => `${k}: ${v};`).join(' ')} }`;
    };

    const lines: string[] = [];
    const base = ruleFor(':host', initial);
    if (base) lines.push(base);

    (Object.keys(media) as Array<Exclude<keyof ResponsiveMap, 'initial'>>).forEach((bp) => {
      const body = ruleFor(':host', media[bp]);
      if (body) lines.push(`@media (min-width: ${BREAKPOINTS[bp]}) { ${body} }`);
    });

    return lines.join('\n');
  }

  private _items(): HTMLElement[] {
    return Array.from(this.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node.hasAttribute('data-ui-placement-item')
    );
  }

  private _resolveItem(target: number | string): HTMLElement | null {
    const items = this._items();
    if (typeof target === 'number') return items[target] || null;
    return (
      items.find((item) => (item.getAttribute('data-value') || item.id || '') === target) || null
    );
  }

  private _fallbackColumnCount(): number {
    const columns = parsePositiveInt(this.getAttribute('columns'));
    return columns || 1;
  }

  private _computeItems(): PlacementMeta[] {
    const fallbackColumns = this._fallbackColumnCount();
    let autoIndex = 0;

    return this._items().map((el, index) => {
      let row = parsePositiveInt(el.getAttribute('data-row'));
      let column = parsePositiveInt(el.getAttribute('data-column'));
      const rowSpan = parsePositiveInt(el.getAttribute('data-row-span')) || 1;
      const columnSpan = parsePositiveInt(el.getAttribute('data-column-span')) || 1;

      if (row == null || column == null) {
        const sequentialIndex = autoIndex++;
        const fallbackRow = Math.floor(sequentialIndex / fallbackColumns) + 1;
        const fallbackColumn = (sequentialIndex % fallbackColumns) + 1;
        if (row == null) row = fallbackRow;
        if (column == null) column = fallbackColumn;
      }

      return {
        el,
        index,
        row,
        column,
        rowSpan,
        columnSpan,
        value: el.getAttribute('data-value') || el.id || String(index),
        disabled: el.hasAttribute('disabled') || el.hasAttribute('data-disabled'),
        selected: el.hasAttribute('data-selected')
      };
    });
  }

  private _order(): PlacementOrder {
    return this.getAttribute('order') === 'row-major' ? 'row-major' : 'dom';
  }

  private _isInteractive(): boolean {
    return this.hasAttribute('interactive') || this.hasAttribute('draggable');
  }

  private _isDraggable(): boolean {
    return this.hasAttribute('draggable');
  }

  private _sortMeta(items: PlacementMeta[]): PlacementMeta[] {
    return [...items].sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      if (a.column !== b.column) return a.column - b.column;
      return a.index - b.index;
    });
  }

  private _syncHostSemantics(items: PlacementMeta[]): void {
    if (this._isInteractive()) {
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'grid');
        this.setAttribute('data-ui-placement-role', '');
      }
      this.setAttribute(
        'aria-rowcount',
        String(items.reduce((max, item) => Math.max(max, item.row + item.rowSpan - 1), 0))
      );
      this.setAttribute(
        'aria-colcount',
        String(items.reduce((max, item) => Math.max(max, item.column + item.columnSpan - 1), this._fallbackColumnCount()))
      );
    } else if (this.hasAttribute('data-ui-placement-role')) {
      this.removeAttribute('role');
      this.removeAttribute('data-ui-placement-role');
      this.removeAttribute('aria-rowcount');
      this.removeAttribute('aria-colcount');
    }
  }

  private _setFocusedItem(item: HTMLElement | null, focus = false): void {
    const items = this._items();
    const active = item || items[0] || null;
    this._focusedValue = active ? active.getAttribute('data-value') || active.id || null : null;

    items.forEach((candidate) => {
      if (this._isInteractive()) {
        candidate.tabIndex = candidate === active ? 0 : -1;
      } else {
        candidate.removeAttribute('tabindex');
      }
    });

    if (focus && active) active.focus({ preventScroll: true });
  }

  private _syncItems(): void {
    const computed = this._computeItems();
    const ordered = this._order() === 'row-major' ? this._sortMeta(computed) : computed;

    this._suppressMutations = true;
    try {
      if (this._order() === 'row-major') {
        ordered.forEach((item) => this.appendChild(item.el));
      }

      this._syncHostSemantics(ordered);

      const focused =
        ordered.find((item) => item.value === this._focusedValue)?.el ||
        ordered[0]?.el ||
        null;

      ordered.forEach((item) => {
        item.el.style.gridColumn = `${item.column} / span ${item.columnSpan}`;
        item.el.style.gridRow = `${item.row} / span ${item.rowSpan}`;
        item.el.style.minInlineSize = '0';
        item.el.style.boxSizing = 'border-box';

        if (this._isInteractive()) {
          if (!item.el.hasAttribute('role')) item.el.setAttribute('role', 'gridcell');
          item.el.setAttribute('aria-rowindex', String(item.row));
          item.el.setAttribute('aria-colindex', String(item.column));
          if (item.columnSpan > 1) item.el.setAttribute('aria-colspan', String(item.columnSpan));
          else item.el.removeAttribute('aria-colspan');
          if (item.rowSpan > 1) item.el.setAttribute('aria-rowspan', String(item.rowSpan));
          else item.el.removeAttribute('aria-rowspan');
          if (item.selected) item.el.setAttribute('aria-selected', 'true');
          else item.el.removeAttribute('aria-selected');
          if (item.disabled) item.el.setAttribute('aria-disabled', 'true');
          else item.el.removeAttribute('aria-disabled');
        } else {
          item.el.removeAttribute('aria-rowindex');
          item.el.removeAttribute('aria-colindex');
          item.el.removeAttribute('aria-rowspan');
          item.el.removeAttribute('aria-colspan');
          item.el.removeAttribute('aria-selected');
          item.el.removeAttribute('aria-disabled');
        }

        if (this._isDraggable() && !item.disabled) {
          item.el.setAttribute('data-draggable', '');
          item.el.setAttribute('draggable', 'true');
        } else {
          item.el.removeAttribute('data-draggable');
          item.el.removeAttribute('draggable');
        }
      });

      this._setFocusedItem(focused, false);
    } finally {
      this._suppressMutations = false;
    }
  }

  private _findItemFromTarget(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof Element)) return null;
    const item = target.closest('[data-ui-placement-item]');
    return item instanceof HTMLElement && this.contains(item) ? item : null;
  }

  private _metaForItem(item: HTMLElement): PlacementMeta | null {
    return this._computeItems().find((entry) => entry.el === item) || null;
  }

  private _intervalsOverlap(startA: number, spanA: number, startB: number, spanB: number): boolean {
    const endA = startA + spanA - 1;
    const endB = startB + spanB - 1;
    return startA <= endB && startB <= endA;
  }

  private _findNeighbor(current: PlacementMeta, direction: 'left' | 'right' | 'up' | 'down'): HTMLElement | null {
    const items = this._computeItems().filter((item) => !item.disabled && item.el !== current.el);
    if (!items.length) return null;

    const candidates = items.filter((item) => {
      if (direction === 'left' || direction === 'right') {
        const overlaps = this._intervalsOverlap(current.row, current.rowSpan, item.row, item.rowSpan);
        if (!overlaps) return false;
        return direction === 'left' ? item.column < current.column : item.column > current.column;
      }

      const overlaps = this._intervalsOverlap(current.column, current.columnSpan, item.column, item.columnSpan);
      if (!overlaps) return false;
      return direction === 'up' ? item.row < current.row : item.row > current.row;
    });

    if (!candidates.length) {
      const all = this._order() === 'row-major' ? this._sortMeta(this._computeItems()) : this._computeItems();
      const currentIndex = all.findIndex((item) => item.el === current.el);
      const offset = direction === 'left' || direction === 'up' ? -1 : 1;
      return all[currentIndex + offset]?.el || null;
    }

    const ranked = candidates.sort((a, b) => {
      if (direction === 'left' || direction === 'right') {
        const primaryA = Math.abs(a.column - current.column);
        const primaryB = Math.abs(b.column - current.column);
        if (primaryA !== primaryB) return primaryA - primaryB;
        return Math.abs(a.row - current.row) - Math.abs(b.row - current.row);
      }

      const primaryA = Math.abs(a.row - current.row);
      const primaryB = Math.abs(b.row - current.row);
      if (primaryA !== primaryB) return primaryA - primaryB;
      return Math.abs(a.column - current.column) - Math.abs(b.column - current.column);
    });

    return ranked[0]?.el || null;
  }

  private _moveItemTo(item: HTMLElement, row: number, column: number, reason: MoveReason): void {
    const meta = this._metaForItem(item);
    if (!meta || meta.disabled) return;

    item.setAttribute('data-row', String(row));
    item.setAttribute('data-column', String(column));

    this.dispatchEvent(
      new CustomEvent('itemmove', {
        bubbles: true,
        composed: true,
        detail: {
          value: meta.value,
          reason,
          from: { row: meta.row, column: meta.column },
          to: { row, column }
        }
      })
    );

    this.requestRender();
  }

  private _swapItems(source: HTMLElement, target: HTMLElement, reason: MoveReason): void {
    const sourceMeta = this._metaForItem(source);
    const targetMeta = this._metaForItem(target);
    if (!sourceMeta || !targetMeta) return;

    source.setAttribute('data-row', String(targetMeta.row));
    source.setAttribute('data-column', String(targetMeta.column));
    target.setAttribute('data-row', String(sourceMeta.row));
    target.setAttribute('data-column', String(sourceMeta.column));

    this.dispatchEvent(
      new CustomEvent('itemmove', {
        bubbles: true,
        composed: true,
        detail: {
          value: sourceMeta.value,
          targetValue: targetMeta.value,
          reason,
          from: { row: sourceMeta.row, column: sourceMeta.column },
          to: { row: targetMeta.row, column: targetMeta.column }
        }
      })
    );

    this.requestRender();
  }

  private _onClick(event: MouseEvent): void {
    if (!this._isInteractive()) return;
    const item = this._findItemFromTarget(event.target);
    if (!item) return;
    this._setFocusedItem(item, false);
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (!this._isInteractive()) return;
    const item = this._findItemFromTarget(event.target);
    if (!item) return;

    const meta = this._metaForItem(item);
    if (!meta || meta.disabled) return;

    const key = event.key;
    const isArrow = key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown';

    if (event.altKey && this._isDraggable() && isArrow) {
      event.preventDefault();
      const rowDelta = key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
      const columnDelta = key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : 0;
      this._moveItemTo(item, Math.max(1, meta.row + rowDelta), Math.max(1, meta.column + columnDelta), 'keyboard');
      this._setFocusedItem(item, true);
      return;
    }

    let next: HTMLElement | null = null;
    if (key === 'ArrowLeft') next = this._findNeighbor(meta, 'left');
    else if (key === 'ArrowRight') next = this._findNeighbor(meta, 'right');
    else if (key === 'ArrowUp') next = this._findNeighbor(meta, 'up');
    else if (key === 'ArrowDown') next = this._findNeighbor(meta, 'down');
    else if (key === 'Home') next = (this._order() === 'row-major' ? this._sortMeta(this._computeItems()) : this._computeItems())[0]?.el || null;
    else if (key === 'End') {
      const ordered = this._order() === 'row-major' ? this._sortMeta(this._computeItems()) : this._computeItems();
      next = ordered[ordered.length - 1]?.el || null;
    }

    if (!next) return;
    event.preventDefault();
    this._setFocusedItem(next, true);
  }

  private _onDragStart(event: DragEvent): void {
    if (!this._isDraggable()) return;
    const item = this._findItemFromTarget(event.target);
    if (!item || item.hasAttribute('data-disabled')) return;
    this._dragItem = item;
    item.setAttribute('data-dragging', '');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', item.getAttribute('data-value') || item.id || '');
    }
  }

  private _onDragOver(event: DragEvent): void {
    if (!this._dragItem) return;
    const overItem = this._findItemFromTarget(event.target);
    if (!overItem || overItem === this._dragItem) return;
    event.preventDefault();

    if (this._dragOverItem && this._dragOverItem !== overItem) {
      this._dragOverItem.removeAttribute('data-drag-over');
    }

    this._dragOverItem = overItem;
    overItem.setAttribute('data-drag-over', '');
  }

  private _onDrop(event: DragEvent): void {
    if (!this._dragItem) return;
    const overItem = this._findItemFromTarget(event.target);
    event.preventDefault();

    if (overItem && overItem !== this._dragItem) {
      this._swapItems(this._dragItem, overItem, 'pointer');
      this._setFocusedItem(this._dragItem, false);
    }

    this._clearDragState();
  }

  private _clearDragState(): void {
    if (this._dragItem) this._dragItem.removeAttribute('data-dragging');
    if (this._dragOverItem) this._dragOverItem.removeAttribute('data-drag-over');
    this._dragItem = null;
    this._dragOverItem = null;
  }

  protected override render(): void {
    this._syncLegacyClassname();
    this._applyInlineStyles();
    this._syncItems();

    const responsiveCss = this._buildResponsiveCss();
    this.setContent(`<style>${style}${responsiveCss ? `\n${responsiveCss}` : ''}</style><slot></slot>`);
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-placement-grid')) {
  customElements.define('ui-placement-grid', UIPlacementGrid);
}
