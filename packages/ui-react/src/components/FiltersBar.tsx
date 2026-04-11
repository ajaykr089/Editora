import React from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

export type FiltersBarOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type FiltersBarProps = React.HTMLAttributes<HTMLDivElement> & {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  searchName?: string;
  searchClearable?: boolean;
  searchDebounce?: number;
  status?: string;
  statusOptions?: readonly FiltersBarOption[];
  statusLabel?: string;
  statusPlaceholder?: string;
  onStatusChange?: (value: string) => void;
  extra?: React.ReactNode;
  clearLabel?: string;
  clearDisabled?: boolean;
  onClear?: () => void;
  children?: React.ReactNode;
};

export const FiltersBar = React.forwardRef<HTMLDivElement, FiltersBarProps>(function FiltersBar(
  {
    search,
    onSearchChange,
    searchPlaceholder,
    searchLabel,
    searchName,
    searchClearable = true,
    searchDebounce,
    status,
    statusOptions,
    statusLabel,
    statusPlaceholder,
    onStatusChange,
    extra,
    clearLabel = 'Clear filters',
    clearDisabled,
    onClear,
    children,
    className,
    style,
    ...rest
  },
  forwardedRef
) {
  const showStatus = !!(statusOptions?.length && onStatusChange);

  return (
    <div
      {...rest}
      ref={forwardedRef}
      className={className}
      style={{
        alignItems: 'center',
        background: 'var(--ui-color-surface, #ffffff)',
        border: '1px solid var(--ui-color-border, #cbd5e1)',
        borderRadius: 'var(--ui-radius, 12px)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        padding: 10,
        ...style,
      }}
    >
      <Input
        clearable={searchClearable}
        debounce={searchDebounce}
        label={searchLabel}
        name={searchName}
        onChange={onSearchChange}
        placeholder={searchPlaceholder || 'Search...'}
        style={{ flex: '1 1 240px', minInlineSize: 220 }}
        value={search ?? ''}
      />

      {showStatus ? (
        <Select
          label={statusLabel}
          onChange={onStatusChange}
          style={{ minInlineSize: 170 }}
          value={status ?? ''}
        >
          {statusPlaceholder ? (
            <option value="">
              {statusPlaceholder}
            </option>
          ) : null}
          {statusOptions?.map((option) => (
            <option key={option.value} disabled={option.disabled} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}

      {extra ? <div>{extra}</div> : null}
      {children}

      {onClear ? (
        <Button disabled={clearDisabled} onClick={onClear} size="sm" variant="ghost">
          {clearLabel}
        </Button>
      ) : null}
    </div>
  );
});

FiltersBar.displayName = 'FiltersBar';

export default FiltersBar;
