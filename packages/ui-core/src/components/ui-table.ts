import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    color-scheme: light dark;
    --ui-table-radius: 14px;
    --ui-table-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-table-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent);
    --ui-table-text: var(--ui-color-text, #0f172a);
    --ui-table-muted: var(--ui-color-muted, #64748b);
    --ui-table-accent: var(--ui-color-primary, #2563eb);
    --ui-table-shadow: 0 14px 40px rgba(15, 23, 42, 0.09);
    --ui-table-empty-color: var(--ui-table-muted);
  }

  .frame {
    position: relative;
    overflow: auto;
    border: var(--ui-table-border);
    border-radius: var(--ui-table-radius);
    background: var(--ui-table-bg);
    box-shadow: var(--ui-table-shadow);
    backdrop-filter: saturate(1.1) blur(8px);
  }

  :host([headless]) .frame {
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  .empty {
    padding: 24px 16px;
    text-align: center;
    font-size: 13px;
    color: var(--ui-table-empty-color);
  }

  @media (prefers-reduced-motion: reduce) {
    .frame {
      scroll-behavior: auto;
    }
  }

  @media (prefers-contrast: more) {
    .frame {
      border-width: 2px;
      box-shadow: none;
      backdrop-filter: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-table-border: 1px solid CanvasText;
      --ui-table-bg: Canvas;
      --ui-table-text: CanvasText;
      --ui-table-muted: CanvasText;
      --ui-table-accent: Highlight;
      --ui-table-shadow: none;
    }

    .frame {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
      backdrop-filter: none;
    }
  }
`;

const lightDomStyle = `
  ui-table:not([headless]) > table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 13px;
    color: var(--ui-table-text, var(--ui-color-text, #0f172a));
    min-width: 560px;
  }

  ui-table:not([headless]) > table thead th {
    text-align: left;
    padding: 12px 14px;
    color: var(--ui-table-muted, var(--ui-color-muted, #64748b));
    font-weight: 600;
    letter-spacing: 0.01em;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 92%, transparent),
      color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 82%, transparent)
    );
    border-bottom: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    white-space: nowrap;
  }

  ui-table:not([headless]) > table tbody td {
    padding: 11px 14px;
    border-bottom: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 62%, transparent);
    vertical-align: middle;
    color: var(--ui-table-text, var(--ui-color-text, #0f172a));
  }

  ui-table:not([headless]) > table tbody tr:last-child td {
    border-bottom: none;
  }

  ui-table[compact]:not([headless]) > table thead th,
  ui-table[compact]:not([headless]) > table tbody td {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  ui-table[striped]:not([headless]) > table tbody tr:nth-child(even) td {
    background: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 24%, transparent);
  }

  ui-table[hover]:not([headless]) > table tbody tr:hover td {
    background: color-mix(in srgb, var(--ui-table-accent, var(--ui-color-primary, #2563eb)) 12%, transparent);
  }

  ui-table[bordered]:not([headless]) > table thead th,
  ui-table[bordered]:not([headless]) > table tbody td {
    border-right: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 62%, transparent);
  }

  ui-table[bordered]:not([headless]) > table thead th:last-child,
  ui-table[bordered]:not([headless]) > table tbody td:last-child {
    border-right: none;
  }

  ui-table[sticky-header]:not([headless]) > table thead th {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  ui-table[sortable]:not([headless]) > table thead th[data-sortable="true"] {
    cursor: pointer;
    user-select: none;
    position: relative;
    padding-right: 24px;
  }

  ui-table[sortable]:not([headless]) > table thead th[data-sortable="true"]::after {
    content: "v^";
    position: absolute;
    right: 9px;
    top: 50%;
    margin-top: -6px;
    font-size: 10px;
    color: color-mix(in srgb, var(--ui-table-muted, var(--ui-color-muted, #64748b)) 76%, transparent);
    letter-spacing: -1px;
  }

  ui-table[sortable]:not([headless]) > table thead th[aria-sort="ascending"]::after {
    content: "^";
    letter-spacing: 0;
    color: var(--ui-table-accent, var(--ui-color-primary, #2563eb));
  }

  ui-table[sortable]:not([headless]) > table thead th[aria-sort="descending"]::after {
    content: "v";
    letter-spacing: 0;
    color: var(--ui-table-accent, var(--ui-color-primary, #2563eb));
  }

  ui-table[selectable]:not([headless]) > table tbody tr {
    cursor: pointer;
  }

  ui-table[selectable]:not([headless]) > table tbody tr[data-selected="true"] td {
    background: color-mix(in srgb, var(--ui-table-accent, var(--ui-color-primary, #2563eb)) 16%, transparent);
  }

  ui-table[loading]:not([headless]) > table tbody {
    opacity: 0.55;
    pointer-events: none;
  }

  @media (prefers-contrast: more) {
    ui-table:not([headless]) > table thead th,
    ui-table:not([headless]) > table tbody td {
      border-bottom-width: 2px;
    }
  }

  @media (forced-colors: active) {
    ui-table:not([headless]) > table,
    ui-table:not([headless]) > table thead th,
    ui-table:not([headless]) > table tbody td {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }

    ui-table[hover]:not([headless]) > table tbody tr:hover td,
    ui-table[selectable]:not([headless]) > table tbody tr[data-selected="true"] td {
      border-color: Highlight;
    }
  }
`;

function ensureTableLightDomStyle() {
  if (typeof document === 'undefined') return;
  const styleId = 'ui-table-light-dom-style';
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
  ensureTableLightDomStyle();
}

function getCellText(cell: HTMLTableCellElement | undefined): string {
  if (!cell) return '';
  return (cell.textContent || '').replace(/\s+/g, ' ').trim();
}

function normalizeSortValue(value: string): string | number {
  const compact = value.replace(/,/g, '');
  if (/^-?\d+(\.\d+)?$/.test(compact)) return Number(compact);
  const parsedDate = Date.parse(value);
  if (!Number.isNaN(parsedDate) && /[-/]/.test(value)) return parsedDate;
  return value.toLowerCase();
}

type SortDirection = 'asc' | 'desc';

export class UITable extends ElementBase {
  static get observedAttributes() {
    return ['headless', 'empty-text', 'sortable', 'selectable', 'multi-select'];
  }

  private _table: HTMLTableElement | null = null;
  private _observer: MutationObserver | null = null;
  private _sortColumnIndex = -1;
  private _sortDirection: SortDirection = 'asc';
  private _selectedRows = new Set<HTMLTableRowElement>();
  private _isSyncing = false;
  private _syncRaf = 0;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    ensureTableLightDomStyle();

    this.addEventListener('click', this._onClick as EventListener);
    this.addEventListener('keydown', this._onKeyDown as EventListener);

    this._observer = new MutationObserver(() => {
      if (this._isSyncing) return;
      this._queueSyncStructure();
    });
    // Avoid observing subtree attribute mutations because table sync updates
    // header/row attributes itself and can otherwise trigger feedback loops.
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick as EventListener);
    this.removeEventListener('keydown', this._onKeyDown as EventListener);
    if (this._syncRaf) {
      cancelAnimationFrame(this._syncRaf);
      this._syncRaf = 0;
    }
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'headless') {
      this.requestRender();
      return;
    }
    if (name === 'empty-text') {
      this._syncEmptyText();
      return;
    }
    if (!this.isConnected) return;
    this._queueSyncStructure();
  }

  protected render() {
    if (this.hasAttribute('headless')) {
      this.setContent('<slot></slot>');
      this._syncStructure();
      return;
    }

    const emptyText = this.getAttribute('empty-text') || 'No table data available.';
    this.setContent(`
      <style>${style}</style>
      <div class="frame" part="frame">
        <slot></slot>
        <div class="empty" part="empty" hidden>${emptyText}</div>
      </div>
    `);
    this._syncStructure();
  }

  private _findTable(): HTMLTableElement | null {
    return this.querySelector('table');
  }

  private _queueSyncStructure() {
    if (!this.isConnected) return;
    if (this._syncRaf) return;
    this._syncRaf = requestAnimationFrame(() => {
      this._syncRaf = 0;
      this._syncStructure();
    });
  }

  private _syncStructure() {
    if (this._isSyncing) return;
    this._isSyncing = true;
    try {
      this._table = this._findTable();
      const emptyEl = this.root.querySelector('.empty') as HTMLElement | null;
      this._syncEmptyText();

      if (!this._table) {
        if (emptyEl) emptyEl.removeAttribute('hidden');
        this._selectedRows.clear();
        return;
      }

      if (emptyEl) emptyEl.setAttribute('hidden', '');

      if (!this._table.hasAttribute('data-ui-table')) {
        this._table.setAttribute('data-ui-table', 'true');
      }
      if (!this._table.hasAttribute('role')) {
        this._table.setAttribute('role', 'table');
      }

      this._syncHeaderState();
      this._syncRowSelectionState();
    } finally {
      this._isSyncing = false;
    }
  }

  private _syncEmptyText() {
    const emptyEl = this.root.querySelector('.empty') as HTMLElement | null;
    if (!emptyEl) return;
    emptyEl.textContent = this.getAttribute('empty-text') || 'No table data available.';
  }

  private _headerCells(): HTMLTableCellElement[] {
    if (!this._table) return [];
    const firstHeaderRow = this._table.tHead?.rows[0];
    if (firstHeaderRow) {
      return Array.from(firstHeaderRow.cells).filter((cell) => cell.tagName.toLowerCase() === 'th') as HTMLTableCellElement[];
    }
    const fallback = this._table.querySelectorAll('th');
    return Array.from(fallback) as HTMLTableCellElement[];
  }

  private _syncHeaderState() {
    const sortable = this.hasAttribute('sortable');
    const headers = this._headerCells();
    headers.forEach((th, index) => {
      if (sortable) {
        th.setAttribute('data-sortable', 'true');
        if (!th.hasAttribute('tabindex')) th.setAttribute('tabindex', '0');
      } else {
        th.removeAttribute('data-sortable');
        if (th.getAttribute('tabindex') === '0') th.removeAttribute('tabindex');
      }

      if (index === this._sortColumnIndex && sortable) {
        th.setAttribute('aria-sort', this._sortDirection === 'asc' ? 'ascending' : 'descending');
      } else if (sortable) {
        th.setAttribute('aria-sort', 'none');
      } else {
        th.removeAttribute('aria-sort');
      }
    });
  }

  private _syncRowSelectionState() {
    const selectable = this.hasAttribute('selectable');
    const rows = this._bodyRows();

    for (const row of Array.from(this._selectedRows)) {
      if (!rows.includes(row)) this._selectedRows.delete(row);
    }

    rows.forEach((row) => {
      if (selectable) {
        row.setAttribute('aria-selected', this._selectedRows.has(row) ? 'true' : 'false');
        if (!row.hasAttribute('tabindex')) row.setAttribute('tabindex', '0');
        if (this._selectedRows.has(row)) row.setAttribute('data-selected', 'true');
        else row.removeAttribute('data-selected');
      } else {
        row.removeAttribute('aria-selected');
        row.removeAttribute('data-selected');
        if (row.getAttribute('tabindex') === '0') row.removeAttribute('tabindex');
      }
    });
  }

  private _bodyRows(): HTMLTableRowElement[] {
    if (!this._table) return [];
    const tbody = this._table.tBodies[0];
    if (!tbody) return [];
    return Array.from(tbody.rows);
  }

  private _sortByColumn(columnIndex: number, header: HTMLTableCellElement) {
    if (!this._table) return;
    const tbody = this._table.tBodies[0];
    if (!tbody) return;

    if (this._sortColumnIndex === columnIndex) {
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortColumnIndex = columnIndex;
      this._sortDirection = 'asc';
    }

    const rows = Array.from(tbody.rows);
    const sorted = rows
      .map((row, rowIndex) => ({
        row,
        rowIndex,
        value: normalizeSortValue(getCellText(row.cells[columnIndex]))
      }))
      .sort((a, b) => {
        const av = a.value;
        const bv = b.value;
        let result = 0;
        if (typeof av === 'number' && typeof bv === 'number') result = av - bv;
        else result = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });

        if (result === 0) result = a.rowIndex - b.rowIndex;
        return this._sortDirection === 'asc' ? result : -result;
      })
      .map((x) => x.row);

    sorted.forEach((row) => tbody.appendChild(row));

    this._syncHeaderState();
    this._syncRowSelectionState();

    const key = header.getAttribute('data-key') || getCellText(header) || `column-${columnIndex + 1}`;
    this.dispatchEvent(
      new CustomEvent('sort-change', {
        detail: {
          columnIndex,
          key,
          direction: this._sortDirection
        },
        bubbles: true
      })
    );
  }

  private _rowValues(row: HTMLTableRowElement): Record<string, string> {
    const headers = this._headerCells();
    const cells = Array.from(row.cells);
    const result: Record<string, string> = {};
    cells.forEach((cell, index) => {
      const header = headers[index];
      const key = (header?.getAttribute('data-key') || getCellText(header || undefined) || `col_${index + 1}`)
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, '_')
        .replace(/^_+|_+$/g, '');
      result[key || `col_${index + 1}`] = getCellText(cell);
    });
    return result;
  }

  private _toggleRowSelection(row: HTMLTableRowElement) {
    const multiSelect = this.hasAttribute('multi-select');
    const wasSelected = this._selectedRows.has(row);

    if (!multiSelect) {
      this._selectedRows.clear();
    }

    if (wasSelected && multiSelect) this._selectedRows.delete(row);
    else this._selectedRows.add(row);

    this._syncRowSelectionState();

    const rows = this._bodyRows();
    const selectedIndices = rows.flatMap((r, index) => (this._selectedRows.has(r) ? [index] : []));
    const selectedRows = rows.filter((r) => this._selectedRows.has(r)).map((r) => this._rowValues(r));

    this.dispatchEvent(
      new CustomEvent('row-select', {
        detail: {
          index: rows.indexOf(row),
          selected: this._selectedRows.has(row),
          indices: selectedIndices,
          rows: selectedRows
        },
        bubbles: true
      })
    );
  }

  private _onClick(event: MouseEvent) {
    if (!this._table) return;
    const target = event.target as HTMLElement;

    if (this.hasAttribute('sortable')) {
      const th = target.closest('th');
      if (th && this._table.contains(th)) {
        const headers = this._headerCells();
        const columnIndex = headers.indexOf(th as HTMLTableCellElement);
        if (columnIndex >= 0) {
          this._sortByColumn(columnIndex, th as HTMLTableCellElement);
          return;
        }
      }
    }

    if (this.hasAttribute('selectable')) {
      const row = target.closest('tbody tr') as HTMLTableRowElement | null;
      if (row && this._table.contains(row)) {
        this._toggleRowSelection(row);
      }
    }
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (!this._table) return;
    const key = event.key;
    if (key !== 'Enter' && key !== ' ') return;
    const target = event.target as HTMLElement;

    if (this.hasAttribute('sortable')) {
      const th = target.closest('th') as HTMLTableCellElement | null;
      if (th && this._table.contains(th)) {
        const headers = this._headerCells();
        const columnIndex = headers.indexOf(th);
        if (columnIndex >= 0) {
          event.preventDefault();
          this._sortByColumn(columnIndex, th);
          return;
        }
      }
    }

    if (this.hasAttribute('selectable')) {
      const row = target.closest('tbody tr') as HTMLTableRowElement | null;
      if (row && this._table.contains(row)) {
        event.preventDefault();
        this._toggleRowSelection(row);
      }
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-table')) {
  customElements.define('ui-table', UITable);
}
