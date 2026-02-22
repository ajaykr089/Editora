import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-data-table-radius: 16px;
    --ui-data-table-border-color: var(--ui-color-border, rgba(15, 23, 42, 0.14));
    --ui-data-table-border: 1px solid var(--ui-data-table-border-color);
    --ui-data-table-bg: var(--ui-color-surface, rgba(255, 255, 255, 0.96));
    --ui-data-table-shadow: var(--ui-shadow-md, 0 16px 42px rgba(15, 23, 42, 0.08));
    --ui-data-table-empty-color: var(--ui-color-muted, #64748b);
    --ui-data-table-summary-color: var(--ui-color-muted, #475569);
    --ui-data-table-text: var(--ui-color-text, #0f172a);
    --ui-data-table-header-text: var(--ui-color-text, #1e293b);
    --ui-data-table-header-bg: var(--ui-color-surface-alt, #f8fafc);
    --ui-data-table-cell-border: color-mix(in srgb, var(--ui-data-table-border-color) 58%, transparent);
    --ui-data-table-striped-bg: color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 82%, transparent);
    --ui-data-table-hover-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent);
    --ui-data-table-selected-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 20%, transparent);
    --ui-data-table-sort-indicator: color-mix(in srgb, var(--ui-color-muted, #94a3b8) 80%, transparent);
    --ui-data-table-sort-active: var(--ui-color-primary, #2563eb);
    --ui-data-table-resize-handle: color-mix(in srgb, var(--ui-color-muted, #94a3b8) 70%, transparent);
    --ui-data-table-resize-handle-active: var(--ui-color-primary, #2563eb);
    color-scheme: light dark;
  }

  .frame {
    position: relative;
    overflow: auto;
    border: var(--ui-data-table-border);
    border-radius: var(--ui-data-table-radius);
    background: var(--ui-data-table-bg);
    box-shadow: var(--ui-data-table-shadow);
  }

  :host([virtualize]) .frame {
    max-height: var(--ui-data-table-virtual-height, 420px);
  }

  .bulk {
    margin-top: 10px;
    border: var(--ui-data-table-border);
    border-radius: 12px;
    background: color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
    padding: 8px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: var(--ui-data-table-summary-color);
  }

  .bulk[hidden] {
    display: none;
  }

  .bulk-count {
    font-weight: 600;
    color: var(--ui-data-table-text);
  }

  .bulk-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .bulk-clear {
    border: 1px solid color-mix(in srgb, var(--ui-data-table-border-color) 76%, transparent);
    background: color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, transparent);
    color: var(--ui-data-table-text);
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 12px;
    line-height: 1.2;
    cursor: pointer;
    transition: border-color 130ms ease, background-color 130ms ease;
  }

  .bulk-clear:hover {
    border-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 38%, var(--ui-data-table-border-color));
    background: color-mix(in srgb, var(--ui-color-primary, #2563eb) 11%, transparent);
  }

  .bulk-clear:focus-visible {
    outline: 2px solid var(--ui-color-focus-ring, #2563eb);
    outline-offset: 1px;
  }

  .empty {
    padding: 24px 16px;
    text-align: center;
    font-size: 13px;
    color: var(--ui-data-table-empty-color);
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
    color: var(--ui-data-table-summary-color);
    font-size: 12px;
    line-height: 1.4;
  }

  .summary {
    min-height: 1.2em;
  }

  :host([headless]) .frame {
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  :host([headless]) .meta {
    display: none;
  }

  :host([headless]) .bulk {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .bulk-clear {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-data-table-border: 2px solid var(--ui-data-table-border-color);
      --ui-data-table-cell-border: var(--ui-data-table-border-color);
      --ui-data-table-hover-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 22%, transparent);
      --ui-data-table-selected-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 28%, transparent);
      --ui-data-table-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-data-table-border: 1px solid CanvasText;
      --ui-data-table-bg: Canvas;
      --ui-data-table-shadow: none;
      --ui-data-table-text: CanvasText;
      --ui-data-table-header-text: CanvasText;
      --ui-data-table-header-bg: Canvas;
      --ui-data-table-cell-border: CanvasText;
      --ui-data-table-hover-bg: Highlight;
      --ui-data-table-selected-bg: Highlight;
      --ui-data-table-sort-indicator: CanvasText;
      --ui-data-table-sort-active: HighlightText;
    }
  }
`;

const lightDomStyle = `
  ui-data-table:not([headless]) > table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 13px;
    color: var(--ui-data-table-text, #0f172a);
    min-width: 680px;
  }

  ui-data-table:not([headless]) > table thead th {
    text-align: left;
    padding: 12px 14px;
    color: var(--ui-data-table-header-text, #334155);
    font-weight: 600;
    letter-spacing: 0.01em;
    background: var(--ui-data-table-header-bg, linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.94)));
    border-bottom: 1px solid var(--ui-data-table-cell-border, rgba(15, 23, 42, 0.1));
    white-space: nowrap;
  }

  ui-data-table:not([headless]) > table tbody td {
    padding: 11px 14px;
    border-bottom: 1px solid var(--ui-data-table-cell-border, rgba(15, 23, 42, 0.08));
    vertical-align: middle;
    color: var(--ui-data-table-text, #0f172a);
  }

  ui-data-table:not([headless]) > table tbody tr:last-child td {
    border-bottom: none;
  }

  ui-data-table[compact]:not([headless]) > table thead th,
  ui-data-table[compact]:not([headless]) > table tbody td {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  ui-data-table[striped]:not([headless]) > table tbody tr:nth-child(even) td {
    background: var(--ui-data-table-striped-bg, rgba(148, 163, 184, 0.08));
  }

  ui-data-table[hover]:not([headless]) > table tbody tr:hover td {
    background: var(--ui-data-table-hover-bg, rgba(37, 99, 235, 0.08));
  }

  ui-data-table[bordered]:not([headless]) > table thead th,
  ui-data-table[bordered]:not([headless]) > table tbody td {
    border-right: 1px solid var(--ui-data-table-cell-border, rgba(15, 23, 42, 0.08));
  }

  ui-data-table[bordered]:not([headless]) > table thead th:last-child,
  ui-data-table[bordered]:not([headless]) > table tbody td:last-child {
    border-right: none;
  }

  ui-data-table[sticky-header]:not([headless]) > table thead th {
    position: sticky;
    top: 0;
    z-index: 2;
  }

  ui-data-table[sortable]:not([headless]) > table thead th[data-sortable="true"] {
    cursor: pointer;
    user-select: none;
    position: relative;
    padding-right: 24px;
  }

  ui-data-table[draggable-columns]:not([headless]) > table thead th[data-draggable="true"] {
    cursor: grab;
  }

  ui-data-table[draggable-columns]:not([headless]) > table thead th[data-dragging="true"] {
    opacity: 0.62;
  }

  ui-data-table[draggable-columns]:not([headless]) > table thead th[data-drag-over="true"] {
    box-shadow: inset 0 -2px 0 rgba(37, 99, 235, 0.82);
  }

  ui-data-table[sortable]:not([headless]) > table thead th[data-sortable="true"]::after {
    content: "v^";
    position: absolute;
    right: 9px;
    top: 50%;
    margin-top: -6px;
    font-size: 10px;
    color: var(--ui-data-table-sort-indicator, #94a3b8);
    letter-spacing: -1px;
  }

  ui-data-table[sortable]:not([headless]) > table thead th[aria-sort="ascending"]::after {
    content: "^";
    letter-spacing: 0;
    color: var(--ui-data-table-sort-active, #2563eb);
  }

  ui-data-table[sortable]:not([headless]) > table thead th[aria-sort="descending"]::after {
    content: "v";
    letter-spacing: 0;
    color: var(--ui-data-table-sort-active, #2563eb);
  }

  ui-data-table[selectable]:not([headless]) > table tbody tr {
    cursor: pointer;
  }

  ui-data-table[selectable]:not([headless]) > table tbody tr[data-selected="true"] td {
    background: var(--ui-data-table-selected-bg, rgba(37, 99, 235, 0.14));
  }

  ui-data-table[loading]:not([headless]) > table tbody {
    opacity: 0.55;
    pointer-events: none;
  }

  ui-data-table[resizable-columns]:not([headless]) > table thead th[data-resizable="true"] {
    position: relative;
  }

  ui-data-table[resizable-columns]:not([headless]) > table thead th .resize-handle {
    position: absolute;
    inset-inline-end: -4px;
    top: 0;
    width: 8px;
    height: 100%;
    cursor: col-resize;
    background: transparent;
    border: none;
    padding: 0;
    z-index: 3;
  }

  ui-data-table[resizable-columns]:not([headless]) > table thead th .resize-handle::before {
    content: "";
    position: absolute;
    inset-inline-start: 3px;
    top: 18%;
    width: 1px;
    height: 64%;
    background: var(--ui-data-table-resize-handle, rgba(148, 163, 184, 0.5));
    transition: background 120ms ease;
  }

  ui-data-table[resizable-columns]:not([headless]) > table thead th .resize-handle:hover::before {
    background: var(--ui-data-table-resize-handle-active, rgba(37, 99, 235, 0.72));
  }

  ui-data-table:not([headless]) > table [data-pinned="left"],
  ui-data-table:not([headless]) > table [data-pinned="right"] {
    position: sticky;
    z-index: 3;
    background: var(--ui-data-table-bg, #fff);
  }

  ui-data-table:not([headless]) > table thead [data-pinned="left"],
  ui-data-table:not([headless]) > table thead [data-pinned="right"] {
    z-index: 4;
    background: var(--ui-data-table-header-bg, #f8fafc);
  }

  ui-data-table:not([headless]) > table [data-pinned="left"][data-pin-edge="true"] {
    box-shadow: 1px 0 0 var(--ui-data-table-cell-border, rgba(15, 23, 42, 0.08)), 8px 0 14px rgba(15, 23, 42, 0.08);
  }

  ui-data-table:not([headless]) > table [data-pinned="right"][data-pin-edge="true"] {
    box-shadow: -1px 0 0 var(--ui-data-table-cell-border, rgba(15, 23, 42, 0.08)), -8px 0 14px rgba(15, 23, 42, 0.08);
  }

  ui-data-table:not([headless]) > table thead th:focus-visible,
  ui-data-table:not([headless]) > table tbody tr[tabindex="0"]:focus-visible {
    outline: 2px solid var(--ui-color-focus-ring, #2563eb);
    outline-offset: -2px;
  }

  @media (prefers-contrast: more) {
    ui-data-table:not([headless]) > table thead th,
    ui-data-table:not([headless]) > table tbody td {
      border-color: var(--ui-data-table-cell-border, currentColor);
    }
  }

  @media (forced-colors: active) {
    ui-data-table:not([headless]) > table thead th,
    ui-data-table:not([headless]) > table tbody td {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }
    ui-data-table[hover]:not([headless]) > table tbody tr:hover td,
    ui-data-table[selectable]:not([headless]) > table tbody tr[data-selected="true"] td {
      background: Highlight;
      color: HighlightText;
    }
  }
`;

function ensureDataTableLightDomStyle() {
  if (typeof document === 'undefined') return;
  const styleId = 'ui-data-table-light-dom-style';
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
  ensureDataTableLightDomStyle();
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

export class UIDataTable extends ElementBase {
  static get observedAttributes() {
    return [
      'headless',
      'empty-text',
      'sortable',
      'selectable',
      'multi-select',
      'sticky-header',
      'striped',
      'hover',
      'compact',
      'bordered',
      'loading',
      'filter-query',
      'filter-column',
      'filters',
      'pin-columns',
      'column-order',
      'draggable-columns',
      'resizable-columns',
      'bulk-actions-label',
      'bulk-clear-label',
      'virtualize',
      'row-height',
      'overscan',
      'page',
      'page-size',
      'pagination-id'
    ];
  }

  private _table: HTMLTableElement | null = null;
  private _observer: MutationObserver | null = null;
  private _sortColumnIndex = -1;
  private _sortDirection: SortDirection = 'asc';
  private _selectedRows = new Set<HTMLTableRowElement>();
  private _isSyncing = false;
  private _isSettingPage = false;
  private _isSettingColumnOrder = false;
  private _page = 1;
  private _pageCount = 1;
  private _pageSize = 10;
  private _totalRows = 0;
  private _filteredRows = 0;
  private _paginationEl: HTMLElement | null = null;
  private _resizeState: { columnIndex: number; startX: number; startWidth: number } | null = null;
  private _columnWidths = new Map<number, number>();
  private _frameEl: HTMLElement | null = null;
  private _virtualRaf = 0;
  private _virtualTopSpacer: HTMLTableRowElement | null = null;
  private _virtualBottomSpacer: HTMLTableRowElement | null = null;
  private _dragColumnIndex = -1;
  private _dragOverColumnIndex = -1;
  private _ignoreHeaderClickUntil = 0;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onPaginationChange = this._onPaginationChange.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onFrameScroll = this._onFrameScroll.bind(this);
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    ensureDataTableLightDomStyle();

    this.addEventListener('click', this._onClick as EventListener);
    this.addEventListener('keydown', this._onKeyDown as EventListener);
    this.addEventListener('pointerdown', this._onPointerDown as EventListener);
    this.addEventListener('dragstart', this._onDragStart as EventListener);
    this.addEventListener('dragover', this._onDragOver as EventListener);
    this.addEventListener('drop', this._onDrop as EventListener);
    this.addEventListener('dragend', this._onDragEnd as EventListener);

    this._observer = new MutationObserver(() => {
      if (this._isSyncing) return;
      this._syncStructure();
    });
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true
    });

    this._syncPaginationBinding();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick as EventListener);
    this.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.removeEventListener('pointerdown', this._onPointerDown as EventListener);
    this.removeEventListener('dragstart', this._onDragStart as EventListener);
    this.removeEventListener('dragover', this._onDragOver as EventListener);
    this.removeEventListener('drop', this._onDrop as EventListener);
    this.removeEventListener('dragend', this._onDragEnd as EventListener);
    window.removeEventListener('pointermove', this._onPointerMove as EventListener);
    window.removeEventListener('pointerup', this._onPointerUp as EventListener);
    this._resizeState = null;
    if (this._frameEl) {
      this._frameEl.removeEventListener('scroll', this._onFrameScroll as EventListener);
      this._frameEl = null;
    }
    if (this._virtualRaf) {
      cancelAnimationFrame(this._virtualRaf);
      this._virtualRaf = 0;
    }
    this._clearVirtualSpacers();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this._detachPaginationListener();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'column-order' && this._isSettingColumnOrder) return;
    if (name === 'pagination-id') {
      this._syncPaginationBinding();
    }
    if (name === 'page' && this._isSettingPage) {
      return;
    }
    this._syncStructure();
    if (name === 'filter-query' || name === 'filter-column' || name === 'filters') {
      this._dispatchFilterChange();
    }
  }

  protected render() {
    if (this.hasAttribute('headless')) {
      this.setContent('<slot></slot>');
      this._syncStructure();
      return;
    }

    const emptyText = this.getAttribute('empty-text') || 'No data available.';
    this.setContent(`
      <style>${style}</style>
      <div class="frame" part="frame">
        <slot></slot>
        <div class="empty" part="empty" role="status" aria-live="polite" hidden>${emptyText}</div>
      </div>
      <div class="meta" part="meta">
        <span class="summary" part="summary" aria-live="polite"></span>
        <slot name="meta"></slot>
      </div>
      <div class="bulk" part="bulk" hidden>
        <span class="bulk-count" part="bulk-count" aria-live="polite"></span>
        <div class="bulk-actions" part="bulk-actions">
          <slot name="bulk-actions"></slot>
          <button type="button" class="bulk-clear" part="bulk-clear"></button>
        </div>
      </div>
    `);

    this._syncStructure();
  }

  private _findTable(): HTMLTableElement | null {
    return this.querySelector('table');
  }

  private _isVirtualSpacerRow(row: HTMLTableRowElement): boolean {
    return row.hasAttribute('data-virtual-spacer');
  }

  private _clearVirtualSpacers() {
    if (this._virtualTopSpacer?.isConnected) this._virtualTopSpacer.remove();
    if (this._virtualBottomSpacer?.isConnected) this._virtualBottomSpacer.remove();
    this._virtualTopSpacer = null;
    this._virtualBottomSpacer = null;
  }

  private _parseRowHeight(): number {
    const raw = Number(this.getAttribute('row-height') || 44);
    if (!Number.isFinite(raw) || raw < 20) return 44;
    return Math.round(raw);
  }

  private _parseOverscan(): number {
    const raw = Number(this.getAttribute('overscan') || 6);
    if (!Number.isFinite(raw) || raw < 0) return 6;
    return Math.max(0, Math.floor(raw));
  }

  private _headerKey(header: HTMLTableCellElement | undefined, fallbackIndex: number): string {
    if (!header) return `column-${fallbackIndex + 1}`;
    const key = (header.getAttribute('data-key') || '').trim();
    if (key) return key;
    const text = getCellText(header);
    if (text) return text.toLowerCase().replace(/\s+/g, '_');
    return `column-${fallbackIndex + 1}`;
  }

  private _currentColumnOrderString() {
    const headers = this._headerCells();
    return headers.map((header, index) => this._headerKey(header, index)).join(',');
  }

  private _setColumnOrderAttribute(order: string) {
    if ((this.getAttribute('column-order') || '') === order) return;
    this._isSettingColumnOrder = true;
    this.setAttribute('column-order', order);
    this._isSettingColumnOrder = false;
  }

  private _isRtl() {
    if (typeof window === 'undefined') return false;
    return getComputedStyle(this).direction === 'rtl';
  }

  private _parsePageSize(): number {
    const raw = Number(this.getAttribute('page-size') || 10);
    if (!Number.isFinite(raw) || raw < 1) return 10;
    return Math.floor(raw);
  }

  private _parsePage(): number {
    const raw = Number(this.getAttribute('page') || 1);
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.floor(raw);
  }

  private _parseFilterQuery(): string {
    return (this.getAttribute('filter-query') || '').trim().toLowerCase();
  }

  private _resolveFilterColumnIndex(headers: HTMLTableCellElement[]): number {
    const raw = (this.getAttribute('filter-column') || '').trim();
    if (!raw) return -1;
    const numeric = Number(raw);
    if (Number.isInteger(numeric) && numeric >= 0 && numeric < headers.length) {
      return numeric;
    }

    const lowered = raw.toLowerCase();
    for (let i = 0; i < headers.length; i += 1) {
      const th = headers[i];
      const key = (th.getAttribute('data-key') || '').toLowerCase();
      const text = getCellText(th).toLowerCase();
      if (key === lowered || text === lowered) return i;
    }
    return -1;
  }

  private _resolveColumnIndex(headers: HTMLTableCellElement[], raw: string | number): number {
    if (typeof raw === 'number' && Number.isInteger(raw) && raw >= 0 && raw < headers.length) return raw;
    const token = String(raw || '').trim();
    if (!token) return -1;
    const numeric = Number(token);
    if (Number.isInteger(numeric) && numeric >= 0 && numeric < headers.length) return numeric;
    const lowered = token.toLowerCase();
    for (let i = 0; i < headers.length; i += 1) {
      const th = headers[i];
      const key = (th.getAttribute('data-key') || '').toLowerCase();
      const text = getCellText(th).toLowerCase();
      if (key === lowered || text === lowered || this._headerKey(th, i) === lowered) return i;
    }
    return -1;
  }

  private _parseFilters(headers: HTMLTableCellElement[]): Array<{ columnIndex: number; op: string; value: any }> {
    const raw = this.getAttribute('filters');
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const normalized: Array<{ columnIndex: number; op: string; value: any }> = [];
      parsed.forEach((entry) => {
        if (!entry || typeof entry !== 'object') return;
        const columnInput = (entry as any).column ?? (entry as any).field ?? (entry as any).key;
        const columnIndex = this._resolveColumnIndex(headers, columnInput);
        if (columnIndex < 0) return;
        const op = String((entry as any).op || (entry as any).operator || 'contains').trim().toLowerCase();
        normalized.push({ columnIndex, op, value: (entry as any).value });
      });
      return normalized;
    } catch {
      return [];
    }
  }

  private _normalizePinTokens(value: unknown): string[] {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (value == null) return [];
    return String(value)
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean);
  }

  private _parsePinColumns(headers: HTMLTableCellElement[]): { left: number[]; right: number[] } {
    const raw = this.getAttribute('pin-columns');
    if (!raw) return { left: [], right: [] };

    const left = new Set<number>();
    const right = new Set<number>();
    const assign = (target: Set<number>, values: string[]) => {
      values.forEach((value) => {
        const index = this._resolveColumnIndex(headers, value);
        if (index >= 0) target.add(index);
      });
    };

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        assign(left, this._normalizePinTokens((parsed as any).left));
        assign(right, this._normalizePinTokens((parsed as any).right));
        const leftArr = Array.from(left).sort((a, b) => a - b);
        const rightArr = Array.from(right).filter((index) => !left.has(index)).sort((a, b) => b - a);
        return { left: leftArr, right: rightArr };
      }
    } catch {
      // fallback to string parser below
    }

    const segments = raw.split(';').map((segment) => segment.trim()).filter(Boolean);
    segments.forEach((segment) => {
      const [sideRaw, valuesRaw] = segment.split(':');
      const side = (sideRaw || '').trim().toLowerCase();
      const values = this._normalizePinTokens(valuesRaw || '');
      if (side === 'left') assign(left, values);
      if (side === 'right') assign(right, values);
    });

    const leftArr = Array.from(left).sort((a, b) => a - b);
    const rightArr = Array.from(right).filter((index) => !left.has(index)).sort((a, b) => b - a);
    return { left: leftArr, right: rightArr };
  }

  private _setPageAttribute(page: number) {
    const normalized = Math.max(1, page);
    const current = this.getAttribute('page');
    if (current === String(normalized)) return;
    this._isSettingPage = true;
    this.setAttribute('page', String(normalized));
    this._isSettingPage = false;
  }

  private _bodyRows(): HTMLTableRowElement[] {
    if (!this._table) return [];
    const tbody = this._table.tBodies[0];
    if (!tbody) return [];
    return Array.from(tbody.rows).filter((row) => !this._isVirtualSpacerRow(row));
  }

  private _headerCells(): HTMLTableCellElement[] {
    if (!this._table) return [];
    const firstHeaderRow = this._table.tHead?.rows[0];
    if (firstHeaderRow) {
      return Array.from(firstHeaderRow.cells).filter((cell) => cell.tagName.toLowerCase() === 'th') as HTMLTableCellElement[];
    }
    return Array.from(this._table.querySelectorAll('th')) as HTMLTableCellElement[];
  }

  private _clearPinnedColumns() {
    if (!this._table) return;
    this._table.querySelectorAll('[data-pinned]').forEach((cell) => {
      const el = cell as HTMLElement;
      el.removeAttribute('data-pinned');
      el.removeAttribute('data-pin-edge');
      el.style.left = '';
      el.style.right = '';
      el.style.zIndex = '';
    });
  }

  private _resolveColumnWidth(columnIndex: number, header: HTMLTableCellElement | undefined): number {
    const cached = this._columnWidths.get(columnIndex);
    if (typeof cached === 'number' && Number.isFinite(cached)) return Math.max(1, cached);
    const width = header?.getBoundingClientRect().width || header?.offsetWidth || 0;
    if (Number.isFinite(width) && width > 0) return width;
    return 120;
  }

  private _pinCell(cell: HTMLTableCellElement | undefined, side: 'left' | 'right', offsetPx: number, edge: boolean, header: boolean) {
    if (!cell) return;
    cell.setAttribute('data-pinned', side);
    if (edge) cell.setAttribute('data-pin-edge', 'true');
    else cell.removeAttribute('data-pin-edge');
    if (side === 'left') {
      cell.style.left = `${Math.max(0, Math.round(offsetPx))}px`;
      cell.style.right = '';
    } else {
      cell.style.right = `${Math.max(0, Math.round(offsetPx))}px`;
      cell.style.left = '';
    }
    cell.style.zIndex = header ? '4' : '3';
  }

  private _applyPinnedColumns() {
    if (!this._table) return;
    this._clearPinnedColumns();

    const headers = this._headerCells();
    if (!headers.length) return;
    const { left, right } = this._parsePinColumns(headers);
    if (!left.length && !right.length) return;

    const allRows = Array.from(this._table.rows).filter((row) => !this._isVirtualSpacerRow(row as HTMLTableRowElement));

    let leftOffset = 0;
    left.forEach((columnIndex, idx) => {
      const width = this._resolveColumnWidth(columnIndex, headers[columnIndex]);
      const edge = idx === left.length - 1;
      allRows.forEach((row, rowIndex) => {
        const cell = row.cells[columnIndex] as HTMLTableCellElement | undefined;
        this._pinCell(cell, 'left', leftOffset, edge, rowIndex === 0);
      });
      leftOffset += width;
    });

    let rightOffset = 0;
    right.forEach((columnIndex, idx) => {
      const width = this._resolveColumnWidth(columnIndex, headers[columnIndex]);
      const edge = idx === right.length - 1;
      allRows.forEach((row, rowIndex) => {
        const cell = row.cells[columnIndex] as HTMLTableCellElement | undefined;
        this._pinCell(cell, 'right', rightOffset, edge, rowIndex === 0);
      });
      rightOffset += width;
    });
  }

  private _applyColumnOrder() {
    if (!this._table) return;
    const order = (this.getAttribute('column-order') || '').trim();
    if (!order) return;

    const theadRow = this._table.tHead?.rows[0];
    const tbody = this._table.tBodies[0];
    if (!theadRow || !tbody) return;

    const headers = Array.from(theadRow.cells) as HTMLTableCellElement[];
    if (!headers.length) return;
    const tokens = order.split(',').map((token) => token.trim()).filter(Boolean);
    if (!tokens.length) return;

    const indices: number[] = [];
    const used = new Set<number>();
    const keyToIndex = new Map<string, number>();
    headers.forEach((header, index) => {
      const key = (header.getAttribute('data-key') || getCellText(header)).toLowerCase().trim();
      if (key) keyToIndex.set(key, index);
    });

    for (const token of tokens) {
      const numeric = Number(token);
      if (Number.isInteger(numeric) && numeric >= 0 && numeric < headers.length) {
        if (!used.has(numeric)) {
          used.add(numeric);
          indices.push(numeric);
        }
        continue;
      }
      const byKey = keyToIndex.get(token.toLowerCase());
      if (typeof byKey === 'number' && !used.has(byKey)) {
        used.add(byKey);
        indices.push(byKey);
      }
    }

    for (let i = 0; i < headers.length; i += 1) {
      if (!used.has(i)) indices.push(i);
    }

    const identity = indices.every((value, index) => value === index);
    if (identity) return;

    const orderedHeaders = indices.map((index) => headers[index]);
    orderedHeaders.forEach((cell) => theadRow.appendChild(cell));

    Array.from(tbody.rows).filter((row) => !this._isVirtualSpacerRow(row)).forEach((row) => {
      const cells = Array.from(row.cells);
      const orderedCells = indices.map((index) => cells[index]).filter(Boolean);
      orderedCells.forEach((cell) => row.appendChild(cell));
    });

    this._columnWidths.clear();
  }

  private _moveColumn(sourceIndex: number, targetIndex: number): boolean {
    if (!this._table) return false;
    const theadRow = this._table.tHead?.rows[0];
    const tbody = this._table.tBodies[0];
    if (!theadRow || !tbody) return false;

    const headers = Array.from(theadRow.cells) as HTMLTableCellElement[];
    const columnCount = headers.length;
    if (!columnCount) return false;
    if (sourceIndex < 0 || sourceIndex >= columnCount) return false;
    if (targetIndex < 0 || targetIndex >= columnCount) return false;
    if (sourceIndex === targetIndex) return false;

    const order = Array.from({ length: columnCount }, (_, index) => index);
    const [moved] = order.splice(sourceIndex, 1);
    order.splice(targetIndex, 0, moved);

    const orderedHeaders = order.map((index) => headers[index]);
    orderedHeaders.forEach((cell) => theadRow.appendChild(cell));

    Array.from(tbody.rows)
      .filter((row) => !this._isVirtualSpacerRow(row))
      .forEach((row) => {
        const cells = Array.from(row.cells);
        const orderedCells = order.map((index) => cells[index]).filter(Boolean);
        orderedCells.forEach((cell) => row.appendChild(cell));
      });

    const nextWidths = new Map<number, number>();
    order.forEach((oldIndex, newIndex) => {
      const width = this._columnWidths.get(oldIndex);
      if (typeof width === 'number') nextWidths.set(newIndex, width);
    });
    this._columnWidths = nextWidths;

    if (this._sortColumnIndex >= 0) {
      this._sortColumnIndex = order.indexOf(this._sortColumnIndex);
    }

    this._syncHeaderState();
    this._applyPinnedColumns();
    this._syncRowSelectionState();

    return true;
  }

  private _clearDragMarkers() {
    const headers = this._headerCells();
    headers.forEach((header) => {
      header.removeAttribute('data-dragging');
      header.removeAttribute('data-drag-over');
    });
    this._dragOverColumnIndex = -1;
  }

  private _emitColumnOrderChange(sourceIndex: number, targetIndex: number) {
    const order = this._currentColumnOrderString();
    this._setColumnOrderAttribute(order);
    this.dispatchEvent(
      new CustomEvent('column-order-change', {
        detail: {
          sourceIndex,
          targetIndex,
          order,
          keys: this._headerCells().map((header, index) => this._headerKey(header, index))
        },
        bubbles: true
      })
    );
  }

  private _focusHeaderAt(index: number) {
    const headers = this._headerCells();
    const next = headers[index];
    if (next) next.focus();
  }

  private _focusSelectableRow(currentRow: HTMLTableRowElement, delta: number) {
    const rows = this._bodyRows().filter((row) => !row.hidden);
    const currentIndex = rows.indexOf(currentRow);
    if (currentIndex < 0) return;
    const nextIndex = Math.min(rows.length - 1, Math.max(0, currentIndex + delta));
    const next = rows[nextIndex];
    if (next) next.focus();
  }

  private _headerKeyboardShortcuts(sortable: boolean, draggable: boolean) {
    const rtl = this._isRtl();
    const left = rtl ? 'ArrowRight' : 'ArrowLeft';
    const right = rtl ? 'ArrowLeft' : 'ArrowRight';
    const shortcuts = [left, right, 'Home', 'End'];
    if (sortable) shortcuts.push('Enter', 'Space');
    if (draggable) shortcuts.push(`Alt+${left}`, `Alt+${right}`);
    return shortcuts.join(' ');
  }

  private _syncStructure() {
    if (this._isSyncing) return;
    this._isSyncing = true;
    try {
      this._table = this._findTable();
      const frameEl = this.root.querySelector('.frame') as HTMLElement | null;
      if (this._frameEl !== frameEl) {
        if (this._frameEl) this._frameEl.removeEventListener('scroll', this._onFrameScroll as EventListener);
        this._frameEl = frameEl;
        if (this._frameEl) this._frameEl.addEventListener('scroll', this._onFrameScroll as EventListener, { passive: true });
      }
      const emptyEl = this.root.querySelector('.empty') as HTMLElement | null;
      const summaryEl = this.root.querySelector('.summary') as HTMLElement | null;

      if (!this._table) {
        if (emptyEl) emptyEl.removeAttribute('hidden');
        if (summaryEl) summaryEl.textContent = '';
        this._selectedRows.clear();
        this._page = 1;
        this._pageCount = 1;
        this._totalRows = 0;
        this._filteredRows = 0;
        this._clearVirtualization(false);
        this._syncPaginationElement();
        return;
      }

      if (emptyEl) emptyEl.setAttribute('hidden', '');

      if (!this._table.hasAttribute('data-ui-data-table')) {
        this._table.setAttribute('data-ui-data-table', 'true');
      }
      if (!this._table.hasAttribute('role')) {
        this._table.setAttribute('role', 'table');
      }

      this._applyColumnOrder();
      this._syncHeaderState();
      this._applyPinnedColumns();
      this._table.setAttribute('aria-colcount', String(this._headerCells().length || 0));
      this._applyPagination(false);
      if (emptyEl) {
        if (this._filteredRows > 0) {
          emptyEl.setAttribute('hidden', '');
        } else {
          const hasFilter = !!this._parseFilterQuery();
          emptyEl.textContent = hasFilter ? 'No matching records.' : (this.getAttribute('empty-text') || 'No data available.');
          emptyEl.removeAttribute('hidden');
        }
      }
      this._applyVirtualization(false);
      this._syncRowSelectionState();
      this._updateBulkActions();
      this._updateSummary();
      this._syncPaginationElement();
    } finally {
      this._isSyncing = false;
    }
  }

  private _syncHeaderState() {
    const sortable = this.hasAttribute('sortable');
    const draggable = this.hasAttribute('draggable-columns');
    const resizable = this.hasAttribute('resizable-columns');
    const headerShortcuts = this._headerKeyboardShortcuts(sortable, draggable);
    const headers = this._headerCells();
    headers.forEach((th, index) => {
      th.setAttribute('data-col-index', String(index));
      th.setAttribute('scope', 'col');
      th.setAttribute('aria-colindex', String(index + 1));
      if (sortable || draggable) th.setAttribute('aria-keyshortcuts', headerShortcuts);
      else th.removeAttribute('aria-keyshortcuts');

      if (sortable) {
        th.setAttribute('data-sortable', 'true');
      } else {
        th.removeAttribute('data-sortable');
      }

      if (sortable || draggable) {
        if (!th.hasAttribute('tabindex')) th.setAttribute('tabindex', '0');
      } else if (th.getAttribute('tabindex') === '0') {
        th.removeAttribute('tabindex');
      }

      if (index === this._sortColumnIndex && sortable) {
        th.setAttribute('aria-sort', this._sortDirection === 'asc' ? 'ascending' : 'descending');
      } else if (sortable) {
        th.setAttribute('aria-sort', 'none');
      } else {
        th.removeAttribute('aria-sort');
      }

      if (draggable) {
        th.setAttribute('data-draggable', 'true');
        th.setAttribute('draggable', 'true');
        th.setAttribute('aria-description', 'Draggable column header');
      } else {
        th.removeAttribute('data-draggable');
        th.removeAttribute('draggable');
        th.removeAttribute('data-dragging');
        th.removeAttribute('data-drag-over');
        th.removeAttribute('aria-description');
      }

      if (resizable) {
        th.setAttribute('data-resizable', 'true');
        let handle = th.querySelector('.resize-handle') as HTMLButtonElement | null;
        if (!handle) {
          handle = document.createElement('button');
          handle.type = 'button';
          handle.className = 'resize-handle';
          handle.setAttribute('aria-hidden', 'true');
          handle.tabIndex = -1;
          th.appendChild(handle);
        }
        handle.setAttribute('data-col-index', String(index));
        const width = this._columnWidths.get(index);
        if (typeof width === 'number') {
          this._setColumnWidth(index, width, false);
        }
      } else {
        th.removeAttribute('data-resizable');
        const handle = th.querySelector('.resize-handle');
        if (handle) handle.remove();
      }
    });
  }

  private _applyPagination(emitChange: boolean) {
    const rows = this._bodyRows();
    this._pageSize = this._parsePageSize();
    this._totalRows = rows.length;

    const query = this._parseFilterQuery();
    const headers = this._headerCells();
    const filterColumnIndex = this._resolveFilterColumnIndex(headers);
    const filterRules = this._parseFilters(headers);
    const filteredRows = rows.filter((row) => this._rowMatchesFilter(row, query, filterColumnIndex, filterRules));
    this._filteredRows = filteredRows.length;
    this._table?.setAttribute('aria-rowcount', String(this._filteredRows));

    const desiredPage = this._parsePage();
    this._pageCount = Math.max(1, Math.ceil(filteredRows.length / this._pageSize));
    this._page = Math.min(this._pageCount, Math.max(1, desiredPage));
    if (this._page !== desiredPage) {
      this._setPageAttribute(this._page);
    }

    const start = (this._page - 1) * this._pageSize;
    const end = start + this._pageSize;
    const filteredSet = new Set(filteredRows);
    rows.forEach((row) => {
      const matched = filteredSet.has(row);
      if (!matched) {
        row.hidden = true;
        row.setAttribute('data-hidden-by-filter', '');
        row.removeAttribute('data-hidden-by-page');
        row.removeAttribute('aria-rowindex');
      } else {
        row.removeAttribute('data-hidden-by-filter');
      }
    });

    filteredRows.forEach((row, index) => {
      const visible = index >= start && index < end;
      row.hidden = !visible;
      if (!visible) row.setAttribute('data-hidden-by-page', '');
      else row.removeAttribute('data-hidden-by-page');
      row.setAttribute('aria-rowindex', String(index + 1));
    });

    if (emitChange) {
      const total = filteredRows.length;
      const startDisplay = total === 0 ? 0 : start + 1;
      const endDisplay = Math.min(end, total);
      this.dispatchEvent(
        new CustomEvent('page-change', {
          detail: {
            page: this._page,
            count: this._pageCount,
            pageSize: this._pageSize,
            total,
            start: startDisplay,
            end: endDisplay
          },
          bubbles: true
        })
      );
    }
  }

  private _clearVirtualization(resetDisplay: boolean) {
    if (this._virtualRaf) {
      cancelAnimationFrame(this._virtualRaf);
      this._virtualRaf = 0;
    }
    this._clearVirtualSpacers();
    if (!resetDisplay) return;
    this._bodyRows().forEach((row) => {
      if (row.style.display === 'none') row.style.display = '';
      row.removeAttribute('data-hidden-by-virtual');
    });
  }

  private _ensureVirtualSpacer(type: 'top' | 'bottom'): HTMLTableRowElement | null {
    if (!this._table) return null;
    const tbody = this._table.tBodies[0];
    if (!tbody) return null;

    const existing = (type === 'top' ? this._virtualTopSpacer : this._virtualBottomSpacer);
    if (existing && existing.isConnected) return existing;

    const spacer = document.createElement('tr');
    spacer.setAttribute('data-virtual-spacer', type);
    spacer.setAttribute('aria-hidden', 'true');
    spacer.setAttribute('role', 'presentation');
    spacer.style.pointerEvents = 'none';

    const td = document.createElement('td');
    td.style.padding = '0';
    td.style.border = '0';
    td.style.height = '0px';
    td.style.lineHeight = '0';
    td.style.fontSize = '0';
    td.innerHTML = '&nbsp;';
    spacer.appendChild(td);

    if (type === 'top') {
      tbody.insertBefore(spacer, tbody.firstChild);
      this._virtualTopSpacer = spacer;
    } else {
      tbody.appendChild(spacer);
      this._virtualBottomSpacer = spacer;
    }

    return spacer;
  }

  private _setVirtualSpacerHeight(spacer: HTMLTableRowElement | null, px: number, columnCount: number) {
    if (!spacer) return;
    const td = spacer.cells[0] || spacer.appendChild(document.createElement('td'));
    if (td.colSpan !== Math.max(1, columnCount)) td.colSpan = Math.max(1, columnCount);
    td.style.padding = '0';
    td.style.border = '0';
    td.style.height = `${Math.max(0, Math.round(px))}px`;
    td.style.lineHeight = '0';
    td.style.fontSize = '0';
  }

  private _applyVirtualization(emitEvent: boolean) {
    const virtualize = this.hasAttribute('virtualize');
    if (!virtualize || !this._frameEl || !this._table) {
      this._clearVirtualization(true);
      return;
    }

    const activeRows = this._bodyRows().filter((row) => !row.hidden);
    if (!activeRows.length) {
      this._clearVirtualization(true);
      return;
    }

    const rowHeight = this._parseRowHeight();
    const overscan = this._parseOverscan();
    const viewport = this._frameEl.clientHeight || rowHeight * 8;
    const scrollTop = this._frameEl.scrollTop;

    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const end = Math.min(activeRows.length, Math.ceil((scrollTop + viewport) / rowHeight) + overscan);
    const topPad = start * rowHeight;
    const bottomPad = Math.max(0, (activeRows.length - end) * rowHeight);

    const columnCount = Math.max(1, this._headerCells().length || activeRows[0]?.cells.length || 1);
    const topSpacer = this._ensureVirtualSpacer('top');
    const bottomSpacer = this._ensureVirtualSpacer('bottom');
    this._setVirtualSpacerHeight(topSpacer, topPad, columnCount);
    this._setVirtualSpacerHeight(bottomSpacer, bottomPad, columnCount);

    activeRows.forEach((row, index) => {
      const visible = index >= start && index < end;
      if (visible) {
        if (row.style.display === 'none') row.style.display = '';
        row.removeAttribute('data-hidden-by-virtual');
      } else {
        row.style.display = 'none';
        row.setAttribute('data-hidden-by-virtual', '');
      }
    });

    if (emitEvent) {
      this.dispatchEvent(
        new CustomEvent('virtual-range-change', {
          detail: {
            start,
            end: Math.max(start, end - 1),
            visible: Math.max(0, end - start),
            total: activeRows.length
          },
          bubbles: true
        })
      );
    }
  }

  private _updateSummary() {
    const summaryEl = this.root.querySelector('.summary') as HTMLElement | null;
    if (!summaryEl) return;
    const total = this._totalRows;
    const filtered = this._filteredRows;
    if (!total || !filtered) {
      summaryEl.textContent = 'No records';
      return;
    }
    const start = (this._page - 1) * this._pageSize + 1;
    const end = Math.min(this._page * this._pageSize, filtered);
    if (filtered === total) {
      summaryEl.textContent = `Showing ${start}-${end} of ${total}`;
      return;
    }
    summaryEl.textContent = `Showing ${start}-${end} of ${filtered} filtered records (${total} total)`;
  }

  private _dispatchFilterChange() {
    this.dispatchEvent(
      new CustomEvent('filter-change', {
        detail: {
          query: this.getAttribute('filter-query') || '',
          filters: this.getAttribute('filters') || '',
          total: this._totalRows,
          filtered: this._filteredRows,
          page: this._page,
          count: this._pageCount
        },
        bubbles: true
      })
    );
  }

  private _parseComparable(value: string): string | number {
    const compact = value.replace(/,/g, '').trim();
    if (/^-?\d+(\.\d+)?$/.test(compact)) return Number(compact);
    return value.toLowerCase();
  }

  private _rulePasses(cellText: string, rule: { op: string; value: any }): boolean {
    const op = rule.op;
    const value = rule.value;
    const normalized = cellText.trim();
    const lower = normalized.toLowerCase();
    if (op === 'empty') return normalized.length === 0;
    if (op === 'notempty' || op === 'not-empty') return normalized.length > 0;

    if (op === 'equals' || op === 'eq') return lower === String(value ?? '').toLowerCase();
    if (op === 'neq' || op === 'not-equals') return lower !== String(value ?? '').toLowerCase();
    if (op === 'startswith' || op === 'starts-with') return lower.startsWith(String(value ?? '').toLowerCase());
    if (op === 'endswith' || op === 'ends-with') return lower.endsWith(String(value ?? '').toLowerCase());
    if (op === 'in') {
      const list = Array.isArray(value)
        ? value.map((item) => String(item).toLowerCase())
        : String(value ?? '')
            .split(',')
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
      return list.includes(lower);
    }

    if (op === 'gt' || op === 'gte' || op === 'lt' || op === 'lte' || op === 'between') {
      const subject = this._parseComparable(normalized);
      if (typeof subject !== 'number') return false;
      if (op === 'between') {
        const range = Array.isArray(value) ? value : String(value ?? '').split(',');
        const min = Number(range[0]);
        const max = Number(range[1]);
        if (!Number.isFinite(min) || !Number.isFinite(max)) return false;
        return subject >= Math.min(min, max) && subject <= Math.max(min, max);
      }
      const target = Number(value);
      if (!Number.isFinite(target)) return false;
      if (op === 'gt') return subject > target;
      if (op === 'gte') return subject >= target;
      if (op === 'lt') return subject < target;
      return subject <= target;
    }

    return lower.includes(String(value ?? '').toLowerCase());
  }

  private _rowMatchesFilter(
    row: HTMLTableRowElement,
    query: string,
    columnIndex: number,
    rules: Array<{ columnIndex: number; op: string; value: any }>
  ): boolean {
    if (query) {
      const haystack = columnIndex >= 0
        ? getCellText(row.cells[columnIndex])
        : Array.from(row.cells).map((cell) => getCellText(cell)).join(' ');
      if (!haystack) return false;

      const value = haystack.toLowerCase();
      const tokens = query.split(/\s+/).filter(Boolean);
      if (tokens.length && !tokens.every((token) => value.includes(token))) return false;
    }

    if (!rules.length) return true;
    return rules.every((rule) => {
      const cell = row.cells[rule.columnIndex];
      return this._rulePasses(getCellText(cell), rule);
    });
  }

  private _setColumnWidth(columnIndex: number, width: number, emitEvent = true) {
    if (!this._table) return;
    const nextWidth = Math.max(72, Math.round(width));
    this._columnWidths.set(columnIndex, nextWidth);

    const rows = Array.from(this._table.rows);
    rows.forEach((row) => {
      const cell = row.cells[columnIndex] as HTMLTableCellElement | undefined;
      if (!cell) return;
      cell.style.width = `${nextWidth}px`;
      cell.style.minWidth = `${nextWidth}px`;
      cell.style.maxWidth = `${nextWidth}px`;
      cell.style.boxSizing = 'border-box';
    });

    if (!emitEvent) return;
    this._applyPinnedColumns();
    const header = this._headerCells()[columnIndex];
    this.dispatchEvent(
      new CustomEvent('column-resize', {
        detail: {
          columnIndex,
          key: header?.getAttribute('data-key') || getCellText(header) || `column-${columnIndex + 1}`,
          width: nextWidth
        },
        bubbles: true
      })
    );
  }

  private _onPointerDown(event: PointerEvent) {
    if (!this.hasAttribute('resizable-columns')) return;
    if (!this._table) return;
    const target = event.target as HTMLElement;
    const handle = target.closest('.resize-handle') as HTMLElement | null;
    if (!handle || !this._table.contains(handle)) return;

    const columnIndex = Number(handle.getAttribute('data-col-index'));
    if (!Number.isInteger(columnIndex) || columnIndex < 0) return;

    const header = this._headerCells()[columnIndex];
    if (!header) return;

    event.preventDefault();
    const startWidth = header.getBoundingClientRect().width;
    this._resizeState = {
      columnIndex,
      startX: event.clientX,
      startWidth
    };

    window.addEventListener('pointermove', this._onPointerMove as EventListener);
    window.addEventListener('pointerup', this._onPointerUp as EventListener);
  }

  private _onPointerMove(event: PointerEvent) {
    if (!this._resizeState) return;
    const delta = event.clientX - this._resizeState.startX;
    const adjustedDelta = this._isRtl() ? -delta : delta;
    this._setColumnWidth(this._resizeState.columnIndex, this._resizeState.startWidth + adjustedDelta, false);
  }

  private _onPointerUp() {
    if (!this._resizeState) return;
    const state = this._resizeState;
    this._resizeState = null;
    window.removeEventListener('pointermove', this._onPointerMove as EventListener);
    window.removeEventListener('pointerup', this._onPointerUp as EventListener);

    const header = this._headerCells()[state.columnIndex];
    if (!header) return;
    const width = header.getBoundingClientRect().width;
    this._setColumnWidth(state.columnIndex, width, true);
  }

  private _onFrameScroll() {
    if (!this.hasAttribute('virtualize')) return;
    if (this._virtualRaf) return;
    this._virtualRaf = requestAnimationFrame(() => {
      this._virtualRaf = 0;
      this._applyVirtualization(true);
    });
  }

  private _onDragStart(event: DragEvent) {
    if (!this.hasAttribute('draggable-columns') || !this._table) return;
    const target = event.target as HTMLElement;
    if (target.closest('.resize-handle')) {
      event.preventDefault();
      return;
    }

    const th = target.closest('th') as HTMLTableCellElement | null;
    if (!th || !this._table.contains(th)) return;
    const headers = this._headerCells();
    const sourceIndex = headers.indexOf(th);
    if (sourceIndex < 0) return;

    this._dragColumnIndex = sourceIndex;
    this._dragOverColumnIndex = sourceIndex;
    this._clearDragMarkers();
    th.setAttribute('data-dragging', 'true');

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(sourceIndex));
    }
  }

  private _onDragOver(event: DragEvent) {
    if (!this.hasAttribute('draggable-columns') || !this._table) return;
    if (this._dragColumnIndex < 0) return;
    const target = event.target as HTMLElement;
    const th = target.closest('th') as HTMLTableCellElement | null;
    if (!th || !this._table.contains(th)) return;
    const headers = this._headerCells();
    const overIndex = headers.indexOf(th);
    if (overIndex < 0) return;

    event.preventDefault();
    if (this._dragOverColumnIndex === overIndex) return;
    this._clearDragMarkers();
    this._dragOverColumnIndex = overIndex;
    th.setAttribute('data-drag-over', 'true');
    const dragging = headers[this._dragColumnIndex];
    if (dragging) dragging.setAttribute('data-dragging', 'true');
  }

  private _onDrop(event: DragEvent) {
    if (!this.hasAttribute('draggable-columns') || !this._table) return;
    if (this._dragColumnIndex < 0) return;
    const target = event.target as HTMLElement;
    const th = target.closest('th') as HTMLTableCellElement | null;
    if (!th || !this._table.contains(th)) return;
    const headers = this._headerCells();
    const targetIndex = headers.indexOf(th);
    if (targetIndex < 0) return;

    event.preventDefault();
    const sourceIndex = this._dragColumnIndex;
    const moved = this._moveColumn(sourceIndex, targetIndex);
    this._clearDragMarkers();
    this._dragColumnIndex = -1;
    this._ignoreHeaderClickUntil = Date.now() + 220;

    if (!moved) return;
    this._applyVirtualization(false);
    this._emitColumnOrderChange(sourceIndex, targetIndex);
  }

  private _onDragEnd() {
    this._clearDragMarkers();
    this._dragColumnIndex = -1;
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

  private _syncRowSelectionState() {
    const selectable = this.hasAttribute('selectable');
    const rows = this._bodyRows();

    for (const row of Array.from(this._selectedRows)) {
      if (!rows.includes(row)) this._selectedRows.delete(row);
    }

    rows.forEach((row) => {
      const visible = !row.hidden;
      if (selectable && visible) {
        row.setAttribute('aria-selected', this._selectedRows.has(row) ? 'true' : 'false');
        row.setAttribute('aria-keyshortcuts', 'ArrowUp ArrowDown Home End Enter Space');
        if (!row.hasAttribute('tabindex')) row.setAttribute('tabindex', '0');
        if (this._selectedRows.has(row)) row.setAttribute('data-selected', 'true');
        else row.removeAttribute('data-selected');
      } else {
        row.removeAttribute('aria-selected');
        row.removeAttribute('aria-keyshortcuts');
        row.removeAttribute('data-selected');
        if (row.getAttribute('tabindex') === '0') row.removeAttribute('tabindex');
      }
    });
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
    this._updateBulkActions();

    const rows = this._bodyRows();
    const selectedIndices = rows.flatMap((r, index) => (this._selectedRows.has(r) ? [index] : []));
    const selectedRows = rows.filter((r) => this._selectedRows.has(r)).map((r) => this._rowValues(r));

    this.dispatchEvent(
      new CustomEvent('row-select', {
        detail: {
          index: rows.indexOf(row),
          selected: this._selectedRows.has(row),
          indices: selectedIndices,
          rows: selectedRows,
          page: this._page
        },
        bubbles: true
      })
    );
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

    const rows = Array.from(tbody.rows).filter((row) => !this._isVirtualSpacerRow(row));
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
    this._applyPagination(false);
    this._syncRowSelectionState();
    this._updateSummary();
    this._syncPaginationElement();

    const key = header.getAttribute('data-key') || getCellText(header) || `column-${columnIndex + 1}`;
    this.dispatchEvent(
      new CustomEvent('sort-change', {
        detail: {
          columnIndex,
          key,
          direction: this._sortDirection,
          page: this._page
        },
        bubbles: true
      })
    );
  }

  private _detachPaginationListener() {
    if (!this._paginationEl) return;
    this._paginationEl.removeEventListener('change', this._onPaginationChange as EventListener);
    this._paginationEl = null;
  }

  private _syncPaginationBinding() {
    this._detachPaginationListener();
    const paginationId = this.getAttribute('pagination-id');
    if (!paginationId) return;
    const element = document.getElementById(paginationId);
    if (!element) return;
    this._paginationEl = element;
    this._paginationEl.addEventListener('change', this._onPaginationChange as EventListener);
    this._syncPaginationElement();
  }

  private _syncPaginationElement() {
    if (!this._paginationEl) return;
    this._paginationEl.setAttribute('count', String(this._pageCount || 1));
    this._paginationEl.setAttribute('page', String(this._page || 1));
  }

  private _onPaginationChange(event: Event) {
    const detail = (event as CustomEvent<{ page?: number }>).detail;
    const nextPage = Number(detail?.page);
    if (!Number.isFinite(nextPage)) return;
    if (nextPage === this._page) return;
    this._setPageAttribute(nextPage);
    this._applyPagination(true);
    this._syncRowSelectionState();
    this._updateSummary();
    this._syncPaginationElement();
  }

  private _onClick(event: MouseEvent) {
    if (!this._table) return;
    const target = event.target as HTMLElement;
    const clearBtn = target.closest('.bulk-clear');
    if (clearBtn) {
      const count = this._selectedRows.size;
      if (count > 0) {
        this._selectedRows.clear();
        this._syncRowSelectionState();
        this._updateBulkActions();
        this.dispatchEvent(new CustomEvent('bulk-clear', { detail: { count, page: this._page }, bubbles: true }));
      }
      return;
    }

    if (target.closest('.resize-handle')) return;
    if (target.closest('th') && Date.now() < this._ignoreHeaderClickUntil) return;

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
      if (row && this._table.contains(row) && !row.hidden && !this._isVirtualSpacerRow(row)) {
        this._toggleRowSelection(row);
      }
    }
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (!this._table) return;
    const key = event.key;
    const target = event.target as HTMLElement;

    if (key === 'Escape' && this._selectedRows.size) {
      const count = this._selectedRows.size;
      this._selectedRows.clear();
      this._syncRowSelectionState();
      this._updateBulkActions();
      this.dispatchEvent(new CustomEvent('bulk-clear', { detail: { count, page: this._page }, bubbles: true }));
      return;
    }

    const th = target.closest('th') as HTMLTableCellElement | null;
    if (th && this._table.contains(th)) {
      const headers = this._headerCells();
      const columnIndex = headers.indexOf(th);
      if (columnIndex >= 0) {
        const rtl = this._isRtl();
        const rightDelta = rtl ? -1 : 1;
        const leftDelta = -rightDelta;

        if (key === 'ArrowRight' || key === 'ArrowLeft') {
          event.preventDefault();
          const delta = key === 'ArrowRight' ? rightDelta : leftDelta;
          const nextIndex = Math.max(0, Math.min(headers.length - 1, columnIndex + delta));

          if (event.altKey && this.hasAttribute('draggable-columns') && nextIndex !== columnIndex) {
            const moved = this._moveColumn(columnIndex, nextIndex);
            if (moved) {
              this._ignoreHeaderClickUntil = Date.now() + 220;
              this._emitColumnOrderChange(columnIndex, nextIndex);
              this._applyVirtualization(false);
              this._focusHeaderAt(nextIndex);
            }
            return;
          }

          this._focusHeaderAt(nextIndex);
          return;
        }

        if (key === 'Home' || key === 'End') {
          event.preventDefault();
          this._focusHeaderAt(key === 'Home' ? 0 : headers.length - 1);
          return;
        }

        if ((key === 'Enter' || key === ' ') && this.hasAttribute('sortable')) {
          event.preventDefault();
          this._sortByColumn(columnIndex, th);
          return;
        }
      }
    }

    if (this.hasAttribute('selectable')) {
      const row = target.closest('tbody tr') as HTMLTableRowElement | null;
      if (row && this._table.contains(row) && !row.hidden && !this._isVirtualSpacerRow(row)) {
        if (key === 'ArrowDown' || key === 'ArrowUp') {
          event.preventDefault();
          this._focusSelectableRow(row, key === 'ArrowDown' ? 1 : -1);
          return;
        }
        if (key === 'Home' || key === 'End') {
          event.preventDefault();
          const rows = this._bodyRows().filter((candidate) => !candidate.hidden);
          const focusRow = key === 'Home' ? rows[0] : rows[rows.length - 1];
          if (focusRow) focusRow.focus();
          return;
        }
        if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          this._toggleRowSelection(row);
        }
      }
    }
  }

  private _updateBulkActions() {
    const bulk = this.root.querySelector('.bulk') as HTMLElement | null;
    if (!bulk) return;

    const selectable = this.hasAttribute('selectable');
    const selectedCount = this._selectedRows.size;
    const shouldShow = selectable && selectedCount > 0;
    if (!shouldShow) {
      bulk.setAttribute('hidden', '');
      return;
    }

    bulk.removeAttribute('hidden');
    const label = this.getAttribute('bulk-actions-label') || '{count} selected';
    const clearLabel = this.getAttribute('bulk-clear-label') || 'Clear selection';

    const countNode = bulk.querySelector('.bulk-count') as HTMLElement | null;
    if (countNode) countNode.textContent = label.replace('{count}', String(selectedCount));

    const clearButton = bulk.querySelector('.bulk-clear') as HTMLButtonElement | null;
    if (clearButton) clearButton.textContent = clearLabel;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-data-table')) {
  customElements.define('ui-data-table', UIDataTable);
}
