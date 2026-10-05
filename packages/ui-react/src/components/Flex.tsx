import React from 'react';

import '@editora/ui-core/flex';
import { createUIElement } from './_internals';

type BreakpointKey = 'initial' | 'sm' | 'md' | 'lg' | 'xl';
type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;
type CssValue = string | number;

type Props = React.HTMLAttributes<HTMLElement> & {
  direction?: Responsive<'row' | 'column' | 'row-reverse' | 'column-reverse'>;
  align?: Responsive<CssValue>;
  justify?: Responsive<CssValue>;
  wrap?: Responsive<CssValue>;
  gap?: Responsive<CssValue>;
  rowGap?: Responsive<CssValue>;
  columnGap?: Responsive<CssValue>;
  display?: Responsive<'flex' | 'inline-flex' | CssValue>;
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

export const Flex = React.forwardRef<HTMLElement, Props>(function Flex(props, forwardedRef) {
  const {
    children,
    className,
    direction,
    align,
    justify,
    wrap,
    gap,
    rowGap,
    columnGap,
    display,
    headless,
    ...rest
  } = props;

  const hostProps: Record<string, unknown> = {
    ref: forwardedRef,
    className,
    ...rest,
    direction: serializeResponsive(direction),
    align: serializeResponsive(align),
    justify: serializeResponsive(justify),
    wrap: serializeResponsive(wrap),
    gap: serializeResponsive(gap),
    rowgap: serializeResponsive(rowGap),
    columngap: serializeResponsive(columnGap),
    display: serializeResponsive(display),
    headless: headless ? '' : undefined
  };

  return createUIElement('ui-flex', hostProps, children);
});

Flex.displayName = 'Flex';

export default Flex;
