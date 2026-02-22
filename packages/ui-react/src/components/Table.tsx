import React, { useEffect, useRef } from 'react';

export type TableSortDirection = 'asc' | 'desc';

export type TableSortChangeDetail = {
  columnIndex: number;
  key: string;
  direction: TableSortDirection;
};

export type TableRowSelectDetail = {
  index: number;
  selected: boolean;
  indices: number[];
  rows: Record<string, string>[];
};

export type TableProps = React.HTMLAttributes<HTMLElement> & {
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
  onSortChange?: (detail: TableSortChangeDetail) => void;
  onRowSelect?: (detail: TableRowSelectDetail) => void;
};

export function Table(props: TableProps) {
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
    onSortChange,
    onRowSelect,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onSortHandler = (event: Event) => {
      const detail = (event as CustomEvent<TableSortChangeDetail>).detail;
      if (detail) onSortChange?.(detail);
    };

    const onRowHandler = (event: Event) => {
      const detail = (event as CustomEvent<TableRowSelectDetail>).detail;
      if (detail) onRowSelect?.(detail);
    };

    el.addEventListener('sort-change', onSortHandler as EventListener);
    el.addEventListener('row-select', onRowHandler as EventListener);
    return () => {
      el.removeEventListener('sort-change', onSortHandler as EventListener);
      el.removeEventListener('row-select', onRowHandler as EventListener);
    };
  }, [onSortChange, onRowSelect]);

  return React.createElement(
    'ui-table',
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
      ...(emptyText ? { 'empty-text': emptyText } : {})
    },
    children
  );
}

export default Table;
