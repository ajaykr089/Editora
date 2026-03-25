import React, { useEffect } from 'react';
import { warnIfElementNotRegistered } from './_internals';

type BreakpointKey = 'initial' | 'sm' | 'md' | 'lg' | 'xl';
type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;
type CssValue = string | number;

export type PlacementGridElement = HTMLElement & {
  refresh(): void;
  focusItem(target: number | string): void;
  moveItem(target: number | string, row: number, column: number): void;
};

type PlacementGridProps = React.HTMLAttributes<PlacementGridElement> & {
  columns?: Responsive<CssValue>;
  rows?: Responsive<CssValue>;
  gap?: Responsive<CssValue>;
  rowGap?: Responsive<CssValue>;
  columnGap?: Responsive<CssValue>;
  autoFlow?: Responsive<CssValue>;
  autoRows?: Responsive<CssValue>;
  autoColumns?: Responsive<CssValue>;
  align?: Responsive<CssValue>;
  justify?: Responsive<CssValue>;
  place?: Responsive<CssValue>;
  alignContent?: Responsive<CssValue>;
  justifyContent?: Responsive<CssValue>;
  placeContent?: Responsive<CssValue>;
  display?: Responsive<'grid' | 'inline-grid' | CssValue>;
  interactive?: boolean;
  draggable?: boolean;
  order?: 'dom' | 'row-major';
  headless?: boolean;
};

export type PlacementGridItemProps = React.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  row?: number;
  column?: number;
  rowSpan?: number;
  columnSpan?: number;
  value?: string;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
};

function serializeResponsive(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return undefined;
    }
  }
  return String(value);
}

const PlacementGridRoot = React.forwardRef<PlacementGridElement, PlacementGridProps>(function PlacementGrid(
  props,
  forwardedRef
) {
  const {
    children,
    className,
    columns,
    rows,
    gap,
    rowGap,
    columnGap,
    autoFlow,
    autoRows,
    autoColumns,
    align,
    justify,
    place,
    alignContent,
    justifyContent,
    placeContent,
    display,
    interactive,
    draggable,
    order,
    headless,
    ...rest
  } = props;

  useEffect(() => {
    warnIfElementNotRegistered('ui-placement-grid', 'PlacementGrid');
  }, []);

  const hostProps: Record<string, unknown> = {
    ref: forwardedRef,
    className,
    ...rest,
    columns: serializeResponsive(columns),
    rows: serializeResponsive(rows),
    gap: serializeResponsive(gap),
    rowgap: serializeResponsive(rowGap),
    columngap: serializeResponsive(columnGap),
    autoflow: serializeResponsive(autoFlow),
    autorows: serializeResponsive(autoRows),
    autocolumns: serializeResponsive(autoColumns),
    align: serializeResponsive(align),
    justify: serializeResponsive(justify),
    place: serializeResponsive(place),
    aligncontent: serializeResponsive(alignContent),
    justifycontent: serializeResponsive(justifyContent),
    placecontent: serializeResponsive(placeContent),
    display: serializeResponsive(display),
    interactive: interactive ? '' : undefined,
    draggable: draggable ? '' : undefined,
    order: order && order !== 'dom' ? order : undefined,
    headless: headless ? '' : undefined
  };

  return React.createElement('ui-placement-grid', hostProps, children);
});

PlacementGridRoot.displayName = 'PlacementGrid';

const PlacementGridItem = React.forwardRef<HTMLElement, PlacementGridItemProps>(function PlacementGridItem(
  {
    as,
    row,
    column,
    rowSpan,
    columnSpan,
    value,
    label,
    selected,
    disabled,
    children,
    ...rest
  },
  forwardedRef
) {
  const Tag = (as || 'div') as keyof JSX.IntrinsicElements;

  const props: Record<string, unknown> = {
    ref: forwardedRef,
    'data-ui-placement-item': '',
    ...rest
  };

  if (row != null) props['data-row'] = String(row);
  if (column != null) props['data-column'] = String(column);
  if (rowSpan != null && rowSpan > 1) props['data-row-span'] = String(rowSpan);
  if (columnSpan != null && columnSpan > 1) props['data-column-span'] = String(columnSpan);
  if (value != null && value !== '') props['data-value'] = value;
  if (label && props['aria-label'] == null) props['aria-label'] = label;
  if (label && props['title'] == null) props.title = label;
  if (selected) props['data-selected'] = '';
  if (disabled) props['data-disabled'] = '';

  return React.createElement(Tag, props, children);
});

PlacementGridItem.displayName = 'PlacementGrid.Item';

export const PlacementGrid = Object.assign(PlacementGridRoot, {
  Item: PlacementGridItem
});

export default PlacementGrid;
