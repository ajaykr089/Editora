import React from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

export type FiltersBarOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

/** A date range as ISO dates (`YYYY-MM-DD`), both ends included. */
export type FiltersBarDateRange = { start: string; end: string };

export type FiltersBarDateRangePreset = {
  label: string;
  /** The range, or a function that computes it when clicked (so "Last 7 days" stays current). */
  range: FiltersBarDateRange | (() => FiltersBarDateRange);
};

// The picker is large (about 27 KB gzipped) and most filter bars have no date range: load it only
// when one is shown.
const DateRangePicker = React.lazy(() => import('./DateRangePicker').then((module) => ({ default: module.DateRangePicker })));

const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/** Ready-made presets in the user's local time: last 7 and 30 days, this and last month, this year. */
export const commonDateRangePresets: FiltersBarDateRangePreset[] = [
  { label: 'Last 7 days', range: () => ({ start: isoDate(daysAgo(6)), end: isoDate(new Date()) }) },
  { label: 'Last 30 days', range: () => ({ start: isoDate(daysAgo(29)), end: isoDate(new Date()) }) },
  {
    label: 'This month',
    range: () => {
      const now = new Date();
      return { start: isoDate(new Date(now.getFullYear(), now.getMonth(), 1)), end: isoDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)) };
    },
  },
  {
    label: 'Last month',
    range: () => {
      const now = new Date();
      return { start: isoDate(new Date(now.getFullYear(), now.getMonth() - 1, 1)), end: isoDate(new Date(now.getFullYear(), now.getMonth(), 0)) };
    },
  },
  {
    label: 'This year',
    range: () => {
      const now = new Date();
      return { start: `${now.getFullYear()}-01-01`, end: `${now.getFullYear()}-12-31` };
    },
  },
];

const resolvePreset = (preset: FiltersBarDateRangePreset) => (typeof preset.range === 'function' ? preset.range() : preset.range);

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
  /** The selected date range; shown when `onDateRangeChange` is passed. */
  dateRange?: FiltersBarDateRange | null;
  onDateRangeChange?: (range: FiltersBarDateRange | null) => void;
  dateRangeLabel?: string;
  /** One-click ranges shown next to the picker, e.g. `commonDateRangePresets`. */
  dateRangePresets?: readonly FiltersBarDateRangePreset[];
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
    dateRange,
    onDateRangeChange,
    dateRangeLabel,
    dateRangePresets,
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
  const showDateRange = !!onDateRangeChange;
  const presetRanges = (dateRangePresets || []).map((preset) => ({ preset, range: resolvePreset(preset) }));

  return (
    <div
      {...rest}
      ref={forwardedRef}
      className={className}
      style={{
        alignItems: 'center',
        background: 'var(--ui-color-surface, #ffffff)',
        border: '1px solid var(--ui-color-border, #cbd5e1)',
        // The same radius as the cards around it (Card, DataTable).
        borderRadius: 'var(--base-card-radius, calc(var(--ui-radius, 6px) + 2px))',
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
        value={search}
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

      {showDateRange ? (
        <React.Suspense fallback={<span aria-hidden="true" style={{ display: 'inline-block', minInlineSize: 240 }} />}>
        <DateRangePicker
          label={dateRangeLabel}
          clearable
          value={dateRange ? JSON.stringify(dateRange) : ''}
          onChange={(detail) => onDateRangeChange?.(detail.value ? { start: detail.value.start, end: detail.value.end } : null)}
          style={{ minInlineSize: 240 }}
        />
        </React.Suspense>
      ) : null}

      {showDateRange && presetRanges.length ? (
        <div role="group" aria-label={dateRangeLabel ? `${dateRangeLabel} presets` : 'Date range presets'} style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {presetRanges.map(({ preset, range }) => {
            const active = !!dateRange && dateRange.start === range.start && dateRange.end === range.end;
            return (
              <Button
                key={preset.label}
                size="sm"
                variant={active ? 'secondary' : 'ghost'}
                // React 19 writes `true` on a custom element as an empty attribute.
                aria-pressed={active ? 'true' : 'false'}
                onClick={() => onDateRangeChange?.(resolvePreset(preset))}
              >
                {preset.label}
              </Button>
            );
          })}
        </div>
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
