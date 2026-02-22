import React from 'react';
import { Badge, Box, DataTable, Flex, Pagination } from '@editora/ui-react';

export type EntityColumn<T> = {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
};

type EntityDataTableProps<T extends { id: string }> = {
  rows: T[];
  columns: EntityColumn<T>[];
  page: number;
  pageSize: number;
  total: number;
  paginationId: string;
  selectable?: boolean;
  onPageChange: (page: number) => void;
  onRowSelectCount?: (count: number) => void;
  actionsLabel?: string;
};

export function toneByStatus(value: string): 'info' | 'warning' | 'success' | 'danger' {
  const normalized = value.toLowerCase();
  if (normalized.includes('paid') || normalized.includes('active') || normalized.includes('completed') || normalized.includes('available')) {
    return 'success';
  }
  if (normalized.includes('partial') || normalized.includes('pending') || normalized.includes('arrived') || normalized.includes('reserved')) {
    return 'warning';
  }
  if (normalized.includes('critical') || normalized.includes('cancel') || normalized.includes('maintenance') || normalized.includes('error')) {
    return 'danger';
  }
  return 'info';
}

export function StatusPill({ value }: { value: string }) {
  return (
    <Badge tone={toneByStatus(value)} variant="soft" size="sm">
      {value}
    </Badge>
  );
}

export function EntityDataTable<T extends { id: string }>({
  rows,
  columns,
  page,
  pageSize,
  total,
  paginationId,
  selectable,
  onPageChange,
  onRowSelectCount,
  actionsLabel
}: EntityDataTableProps<T>) {
  return (
    <Flex style={{ flexDirection: 'column', gap: 8 }}>
      <DataTable
        sortable
        hover
        striped
        hideSummary
        selectable={selectable}
        multiSelect={selectable}
        page={page}
        pageSize={pageSize}
        paginationId={paginationId}
        onPageChange={(detail) => onPageChange(detail.page)}
        onRowSelect={(detail) => onRowSelectCount?.(detail.indices.length)}
        bulkActionsLabel={actionsLabel || 'Bulk actions'}
        stickyHeader
      >
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} data-key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={`${row.id}-${column.key}`}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      <Flex justify="space-between" align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
          Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
        </Box>
        <Pagination {...({ id: paginationId, page: String(page) } as any)} />
      </Flex>
    </Flex>
  );
}

export default EntityDataTable;
