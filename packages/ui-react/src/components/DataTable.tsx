import React, { useEffect, useRef } from 'react';

export type DataTableSortDirection = 'asc' | 'desc';

export type DataTableSortChangeDetail = {
  columnIndex: number;
  key: string;
  direction: DataTableSortDirection;
  page: number;
};

export type DataTableRowSelectDetail = {
  index: number;
  selected: boolean;
  indices: number[];
  rows: Record<string, string>[];
  page: number;
};

export type DataTablePageChangeDetail = {
  page: number;
  count: number;
  pageSize: number;
  total: number;
  start: number;
  end: number;
};

export type DataTableFilterChangeDetail = {
  query: string;
  filters: string;
  total: number;
  filtered: number;
  page: number;
  count: number;
};

export type DataTableColumnResizeDetail = {
  columnIndex: number;
  key: string;
  width: number;
};

export type DataTableVirtualRangeChangeDetail = {
  start: number;
  end: number;
  visible: number;
  total: number;
};

export type DataTableColumnOrderChangeDetail = {
  sourceIndex: number;
  targetIndex: number;
  order: string;
  keys: string[];
};

export type DataTableFilterRule = {
  column: string | number;
  op?:
    | 'contains'
    | 'equals'
    | 'neq'
    | 'startsWith'
    | 'endsWith'
    | 'in'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'between'
    | 'empty'
    | 'notEmpty';
  value?: string | number | Array<string | number>;
};

export type DataTableBulkClearDetail = {
  count: number;
  page: number;
};

export type DataTableProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  sortable?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  loading?: boolean;
  headless?: boolean;
  emptyText?: string;
  page?: number;
  pageSize?: number;
  paginationId?: string;
  filterQuery?: string;
  filterColumn?: string | number;
  filterRules?: DataTableFilterRule[];
  columnOrder?: string;
  pinColumns?: string | { left?: Array<string | number>; right?: Array<string | number> };
  draggableColumns?: boolean;
  resizableColumns?: boolean;
  bulkActionsLabel?: string;
  bulkClearLabel?: string;
  virtualize?: boolean;
  rowHeight?: number;
  overscan?: number;
  onSortChange?: (detail: DataTableSortChangeDetail) => void;
  onRowSelect?: (detail: DataTableRowSelectDetail) => void;
  onPageChange?: (detail: DataTablePageChangeDetail) => void;
  onFilterChange?: (detail: DataTableFilterChangeDetail) => void;
  onColumnResize?: (detail: DataTableColumnResizeDetail) => void;
  onVirtualRangeChange?: (detail: DataTableVirtualRangeChangeDetail) => void;
  onColumnOrderChange?: (detail: DataTableColumnOrderChangeDetail) => void;
  onBulkClear?: (detail: DataTableBulkClearDetail) => void;
};

export function DataTable(props: DataTableProps) {
  const {
    sortable,
    selectable,
    multiSelect,
    striped,
    hover,
    compact,
    bordered,
    stickyHeader,
    loading,
    headless,
    emptyText,
    page,
    pageSize,
    paginationId,
    filterQuery,
    filterColumn,
    filterRules,
    columnOrder,
    pinColumns,
    draggableColumns,
    resizableColumns,
    bulkActionsLabel,
    bulkClearLabel,
    virtualize,
    rowHeight,
    overscan,
    onSortChange,
    onRowSelect,
    onPageChange,
    onFilterChange,
    onColumnResize,
    onVirtualRangeChange,
    onColumnOrderChange,
    onBulkClear,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onSortHandler = (event: Event) => {
      const detail = (event as CustomEvent<DataTableSortChangeDetail>).detail;
      if (detail) onSortChange?.(detail);
    };

    const onRowHandler = (event: Event) => {
      const detail = (event as CustomEvent<DataTableRowSelectDetail>).detail;
      if (detail) onRowSelect?.(detail);
    };

    const onPageHandler = (event: Event) => {
      const detail = (event as CustomEvent<DataTablePageChangeDetail>).detail;
      if (detail) onPageChange?.(detail);
    };

    const onFilterHandler = (event: Event) => {
      const detail = (event as CustomEvent<DataTableFilterChangeDetail>).detail;
      if (detail) onFilterChange?.(detail);
    };

    const onColumnResizeHandler = (event: Event) => {
      const detail = (event as CustomEvent<DataTableColumnResizeDetail>).detail;
      if (detail) onColumnResize?.(detail);
    };

    const onVirtualRangeHandler = (event: Event) => {
      const detail = (event as CustomEvent<DataTableVirtualRangeChangeDetail>).detail;
      if (detail) onVirtualRangeChange?.(detail);
    };

    const onColumnOrderHandler = (event: Event) => {
      const detail = (event as CustomEvent<DataTableColumnOrderChangeDetail>).detail;
      if (detail) onColumnOrderChange?.(detail);
    };

    const onBulkClearHandler = (event: Event) => {
      const detail = (event as CustomEvent<DataTableBulkClearDetail>).detail;
      if (detail) onBulkClear?.(detail);
    };

    el.addEventListener('sort-change', onSortHandler as EventListener);
    el.addEventListener('row-select', onRowHandler as EventListener);
    el.addEventListener('page-change', onPageHandler as EventListener);
    el.addEventListener('filter-change', onFilterHandler as EventListener);
    el.addEventListener('column-resize', onColumnResizeHandler as EventListener);
    el.addEventListener('virtual-range-change', onVirtualRangeHandler as EventListener);
    el.addEventListener('column-order-change', onColumnOrderHandler as EventListener);
    el.addEventListener('bulk-clear', onBulkClearHandler as EventListener);
    return () => {
      el.removeEventListener('sort-change', onSortHandler as EventListener);
      el.removeEventListener('row-select', onRowHandler as EventListener);
      el.removeEventListener('page-change', onPageHandler as EventListener);
      el.removeEventListener('filter-change', onFilterHandler as EventListener);
      el.removeEventListener('column-resize', onColumnResizeHandler as EventListener);
      el.removeEventListener('virtual-range-change', onVirtualRangeHandler as EventListener);
      el.removeEventListener('column-order-change', onColumnOrderHandler as EventListener);
      el.removeEventListener('bulk-clear', onBulkClearHandler as EventListener);
    };
  }, [
    onSortChange,
    onRowSelect,
    onPageChange,
    onFilterChange,
    onColumnResize,
    onVirtualRangeChange,
    onColumnOrderChange,
    onBulkClear
  ]);

  const filtersAttr =
    filterRules && filterRules.length
      ? (() => {
          try {
            return JSON.stringify(filterRules);
          } catch {
            return undefined;
          }
        })()
      : undefined;

  const pinColumnsAttr =
    typeof pinColumns === 'string'
      ? pinColumns.trim() || undefined
      : pinColumns && typeof pinColumns === 'object'
        ? (() => {
            try {
              return JSON.stringify(pinColumns);
            } catch {
              return undefined;
            }
          })()
        : undefined;

  return React.createElement(
    'ui-data-table',
    {
      ref,
      ...rest,
      ...(sortable ? { sortable: '' } : {}),
      ...(selectable ? { selectable: '' } : {}),
      ...(multiSelect ? { 'multi-select': '' } : {}),
      ...(striped ? { striped: '' } : {}),
      ...(hover ? { hover: '' } : {}),
      ...(compact ? { compact: '' } : {}),
      ...(bordered ? { bordered: '' } : {}),
      ...(stickyHeader ? { 'sticky-header': '' } : {}),
      ...(loading ? { loading: '' } : {}),
      ...(headless ? { headless: '' } : {}),
      ...(emptyText ? { 'empty-text': emptyText } : {}),
      ...(typeof page === 'number' && Number.isFinite(page) ? { page: String(page) } : {}),
      ...(typeof pageSize === 'number' && Number.isFinite(pageSize) ? { 'page-size': String(pageSize) } : {}),
      ...(paginationId ? { 'pagination-id': paginationId } : {}),
      ...(typeof filterQuery === 'string' ? { 'filter-query': filterQuery } : {}),
      ...(typeof filterColumn === 'number' && Number.isFinite(filterColumn)
        ? { 'filter-column': String(filterColumn) }
        : typeof filterColumn === 'string' && filterColumn.trim()
          ? { 'filter-column': filterColumn }
          : {}),
      ...(filtersAttr ? { filters: filtersAttr } : {}),
      ...(columnOrder ? { 'column-order': columnOrder } : {}),
      ...(pinColumnsAttr ? { 'pin-columns': pinColumnsAttr } : {}),
      ...(draggableColumns ? { 'draggable-columns': '' } : {}),
      ...(resizableColumns ? { 'resizable-columns': '' } : {}),
      ...(bulkActionsLabel ? { 'bulk-actions-label': bulkActionsLabel } : {}),
      ...(bulkClearLabel ? { 'bulk-clear-label': bulkClearLabel } : {}),
      ...(virtualize ? { virtualize: '' } : {}),
      ...(typeof rowHeight === 'number' && Number.isFinite(rowHeight) ? { 'row-height': String(rowHeight) } : {}),
      ...(typeof overscan === 'number' && Number.isFinite(overscan) ? { overscan: String(overscan) } : {})
    },
    children
  );
}

export default DataTable;
