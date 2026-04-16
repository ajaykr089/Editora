import React from 'react';
import { FiltersBar, type FiltersBarOption, type FiltersBarProps } from './FiltersBar';

export type DataViewToolbarProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & Pick<
  FiltersBarProps,
  | 'search'
  | 'onSearchChange'
  | 'searchPlaceholder'
  | 'searchLabel'
  | 'searchName'
  | 'searchClearable'
  | 'searchDebounce'
  | 'status'
  | 'statusOptions'
  | 'statusLabel'
  | 'statusPlaceholder'
  | 'onStatusChange'
  | 'clearLabel'
  | 'clearDisabled'
  | 'onClear'
  | 'children'
> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  summary?: React.ReactNode;
  selectedCount?: number;
  totalCount?: number;
  itemLabel?: string;
  itemLabelPlural?: string;
  actions?: React.ReactNode;
  filtersExtra?: React.ReactNode;
  footer?: React.ReactNode;
};

function pluralize(count: number, singular: string, plural?: string) {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

function buildSummary(
  selectedCount: number | undefined,
  totalCount: number | undefined,
  itemLabel: string,
  itemLabelPlural?: string
) {
  const parts: string[] = [];

  if (typeof selectedCount === 'number') {
    parts.push(`${selectedCount} selected`);
  }

  if (typeof totalCount === 'number') {
    parts.push(`${totalCount} ${pluralize(totalCount, itemLabel, itemLabelPlural)}`);
  }

  return parts.length > 0 ? parts.join(' • ') : null;
}

export const DataViewToolbar = React.forwardRef<HTMLDivElement, DataViewToolbarProps>(function DataViewToolbar(
  {
    title,
    description,
    summary,
    selectedCount,
    totalCount,
    itemLabel = 'record',
    itemLabelPlural,
    actions,
    filtersExtra,
    footer,
    search,
    onSearchChange,
    searchPlaceholder,
    searchLabel,
    searchName,
    searchClearable,
    searchDebounce,
    status,
    statusOptions,
    statusLabel,
    statusPlaceholder,
    onStatusChange,
    clearLabel,
    clearDisabled,
    onClear,
    children,
    className,
    style,
    ...rest
  },
  forwardedRef
) {
  const computedSummary = summary ?? buildSummary(selectedCount, totalCount, itemLabel, itemLabelPlural);
  const showHeader = !!(title || description || computedSummary || actions);

  return (
    <div
      {...rest}
      ref={forwardedRef}
      className={className}
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%)',
        border: '1px solid rgba(148, 163, 184, 0.28)',
        borderRadius: 18,
        display: 'grid',
        gap: 12,
        minWidth: 0,
        padding: 12,
        ...style,
      }}
    >
      {showHeader ? (
        <div
          style={{
            alignItems: 'flex-start',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
            {title ? (
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                {title}
              </div>
            ) : null}

            {description ? (
              <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 14, lineHeight: 1.45 }}>
                {description}
              </div>
            ) : null}

            {computedSummary ? (
              <div style={{ color: 'var(--ui-color-muted, #475569)', fontSize: 12, fontWeight: 600, letterSpacing: '0.02em' }}>
                {computedSummary}
              </div>
            ) : null}
          </div>

          {actions ? (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'flex-end',
              }}
            >
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      <FiltersBar
        clearDisabled={clearDisabled}
        clearLabel={clearLabel}
        extra={filtersExtra}
        search={search}
        searchClearable={searchClearable}
        searchDebounce={searchDebounce}
        searchLabel={searchLabel}
        searchName={searchName}
        searchPlaceholder={searchPlaceholder}
        status={status}
        statusLabel={statusLabel}
        statusOptions={statusOptions}
        statusPlaceholder={statusPlaceholder}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
        }}
        onClear={onClear}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
      >
        {children}
      </FiltersBar>

      {footer ? <div>{footer}</div> : null}
    </div>
  );
});

DataViewToolbar.displayName = 'DataViewToolbar';

export type { FiltersBarOption };

export default DataViewToolbar;
