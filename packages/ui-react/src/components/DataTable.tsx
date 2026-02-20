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
  columnOrder?: string;
  draggableColumns?: boolean;
  resizableColumns?: boolean;
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
    columnOrder,
    draggableColumns,
    resizableColumns,
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

    el.addEventListener('sort-change', onSortHandler as EventListener);
    el.addEventListener('row-select', onRowHandler as EventListener);
    el.addEventListener('page-change', onPageHandler as EventListener);
    el.addEventListener('filter-change', onFilterHandler as EventListener);
    el.addEventListener('column-resize', onColumnResizeHandler as EventListener);
    el.addEventListener('virtual-range-change', onVirtualRangeHandler as EventListener);
    el.addEventListener('column-order-change', onColumnOrderHandler as EventListener);
    return () => {
      el.removeEventListener('sort-change', onSortHandler as EventListener);
      el.removeEventListener('row-select', onRowHandler as EventListener);
      el.removeEventListener('page-change', onPageHandler as EventListener);
      el.removeEventListener('filter-change', onFilterHandler as EventListener);
      el.removeEventListener('column-resize', onColumnResizeHandler as EventListener);
      el.removeEventListener('virtual-range-change', onVirtualRangeHandler as EventListener);
      el.removeEventListener('column-order-change', onColumnOrderHandler as EventListener);
    };
  }, [
    onSortChange,
    onRowSelect,
    onPageChange,
    onFilterChange,
    onColumnResize,
    onVirtualRangeChange,
    onColumnOrderChange
  ]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (sortable) el.setAttribute('sortable', '');
    else el.removeAttribute('sortable');

    if (selectable) el.setAttribute('selectable', '');
    else el.removeAttribute('selectable');

    if (multiSelect) el.setAttribute('multi-select', '');
    else el.removeAttribute('multi-select');

    if (striped) el.setAttribute('striped', '');
    else el.removeAttribute('striped');

    if (hover) el.setAttribute('hover', '');
    else el.removeAttribute('hover');

    if (compact) el.setAttribute('compact', '');
    else el.removeAttribute('compact');

    if (bordered) el.setAttribute('bordered', '');
    else el.removeAttribute('bordered');

    if (stickyHeader) el.setAttribute('sticky-header', '');
    else el.removeAttribute('sticky-header');

    if (loading) el.setAttribute('loading', '');
    else el.removeAttribute('loading');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (emptyText) el.setAttribute('empty-text', emptyText);
    else el.removeAttribute('empty-text');

    if (typeof page === 'number' && Number.isFinite(page)) el.setAttribute('page', String(page));
    else el.removeAttribute('page');

    if (typeof pageSize === 'number' && Number.isFinite(pageSize)) el.setAttribute('page-size', String(pageSize));
    else el.removeAttribute('page-size');

    if (paginationId) el.setAttribute('pagination-id', paginationId);
    else el.removeAttribute('pagination-id');

    if (typeof filterQuery === 'string') el.setAttribute('filter-query', filterQuery);
    else el.removeAttribute('filter-query');

    if (typeof filterColumn === 'number' && Number.isFinite(filterColumn)) {
      el.setAttribute('filter-column', String(filterColumn));
    } else if (typeof filterColumn === 'string' && filterColumn.trim()) {
      el.setAttribute('filter-column', filterColumn);
    } else {
      el.removeAttribute('filter-column');
    }

    if (columnOrder) el.setAttribute('column-order', columnOrder);
    else el.removeAttribute('column-order');

    if (draggableColumns) el.setAttribute('draggable-columns', '');
    else el.removeAttribute('draggable-columns');

    if (resizableColumns) el.setAttribute('resizable-columns', '');
    else el.removeAttribute('resizable-columns');

    if (virtualize) el.setAttribute('virtualize', '');
    else el.removeAttribute('virtualize');

    if (typeof rowHeight === 'number' && Number.isFinite(rowHeight)) el.setAttribute('row-height', String(rowHeight));
    else el.removeAttribute('row-height');

    if (typeof overscan === 'number' && Number.isFinite(overscan)) el.setAttribute('overscan', String(overscan));
    else el.removeAttribute('overscan');
  }, [
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
    columnOrder,
    draggableColumns,
    resizableColumns,
    virtualize,
    rowHeight,
    overscan
  ]);

  return React.createElement('ui-data-table', { ref, ...rest }, children);
}

export default DataTable;
