import React, { useEffect } from 'react';
import { warnIfElementNotRegistered } from './_internals';

type BreakpointKey = 'initial' | 'sm' | 'md' | 'lg' | 'xl';
type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;
type CssValue = string | number;

type Props = React.HTMLAttributes<HTMLElement> & {
  columns?: Responsive<CssValue>;
  columnWidth?: Responsive<CssValue>;
  gap?: Responsive<CssValue>;
  columnGap?: Responsive<CssValue>;
  itemGap?: Responsive<CssValue>;
  fill?: Responsive<'auto' | 'balance' | 'balance-all' | CssValue>;
  display?: Responsive<'block' | 'inline-block' | CssValue>;
  headless?: boolean;
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

export const MasonryGrid = React.forwardRef<HTMLElement, Props>(function MasonryGrid(props, forwardedRef) {
  const {
    children,
    className,
    columns,
    columnWidth,
    gap,
    columnGap,
    itemGap,
    fill,
    display,
    headless,
    ...rest
  } = props;

  useEffect(() => {
    warnIfElementNotRegistered('ui-masonry-grid', 'MasonryGrid');
  }, []);

  const hostProps: Record<string, unknown> = {
    ref: forwardedRef,
    className,
    ...rest,
    columns: serializeResponsive(columns),
    columnwidth: serializeResponsive(columnWidth),
    gap: serializeResponsive(gap),
    columngap: serializeResponsive(columnGap),
    itemgap: serializeResponsive(itemGap),
    fill: serializeResponsive(fill),
    display: serializeResponsive(display),
    headless: headless ? '' : undefined
  };

  return React.createElement('ui-masonry-grid', hostProps, children);
});

MasonryGrid.displayName = 'MasonryGrid';

export default MasonryGrid;
