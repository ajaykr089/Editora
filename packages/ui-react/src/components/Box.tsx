import React from 'react';

type BreakpointKey = 'initial' | 'sm' | 'md' | 'lg' | 'xl';
type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;
type CssValue = string | number;

type Props = React.HTMLAttributes<HTMLElement> & {
  p?: Responsive<CssValue>; px?: Responsive<CssValue>; py?: Responsive<CssValue>; pt?: Responsive<CssValue>; pr?: Responsive<CssValue>; pb?: Responsive<CssValue>; pl?: Responsive<CssValue>;
  m?: Responsive<CssValue>; mx?: Responsive<CssValue>; my?: Responsive<CssValue>; mt?: Responsive<CssValue>; mr?: Responsive<CssValue>; mb?: Responsive<CssValue>; ml?: Responsive<CssValue>;
  width?: Responsive<CssValue>; w?: Responsive<CssValue>; minWidth?: Responsive<CssValue>; minW?: Responsive<CssValue>; maxWidth?: Responsive<CssValue>; maxW?: Responsive<CssValue>; height?: Responsive<CssValue>; h?: Responsive<CssValue>; minHeight?: Responsive<CssValue>; minH?: Responsive<CssValue>; maxHeight?: Responsive<CssValue>; maxH?: Responsive<CssValue>;
  display?: Responsive<CssValue>; position?: Responsive<CssValue>; inset?: Responsive<CssValue>; top?: Responsive<CssValue>; right?: Responsive<CssValue>; bottom?: Responsive<CssValue>; left?: Responsive<CssValue>;
  justify?: Responsive<CssValue>; align?: Responsive<CssValue>; alignSelf?: Responsive<CssValue>; alignContent?: Responsive<CssValue>;
  gap?: Responsive<CssValue>; rowGap?: Responsive<CssValue>; columnGap?: Responsive<CssValue>;
  flexBasis?: Responsive<CssValue>; flexGrow?: Responsive<CssValue>; flexShrink?: Responsive<CssValue>;
  gridArea?: Responsive<CssValue>; gridColumn?: Responsive<CssValue>; gridColumnStart?: Responsive<CssValue>; gridColumnEnd?: Responsive<CssValue>; gridRow?: Responsive<CssValue>; gridRowStart?: Responsive<CssValue>; gridRowEnd?: Responsive<CssValue>;
  bg?: Responsive<CssValue>; color?: Responsive<CssValue>; opacity?: Responsive<CssValue>; overflow?: Responsive<CssValue>; overflowX?: Responsive<CssValue>; overflowY?: Responsive<CssValue>; zIndex?: Responsive<CssValue>;
  variant?: 'default' | 'surface' | 'elevated' | 'outline' | 'glass' | 'gradient' | 'soft' | 'contrast';
  tone?: 'default' | 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
  state?: 'idle' | 'loading' | 'error' | 'success';
  elevation?: 'default' | 'none' | 'low' | 'high';
  radius?: 'default' | 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | number | string;
  interactive?: boolean;
  disabled?: boolean;
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

export function Box(props: Props) {
  const {
    children,
    className,
    variant,
    tone,
    state,
    elevation,
    radius,
    interactive,
    disabled,
    headless,
    p, px, py, pt, pr, pb, pl,
    m, mx, my, mt, mr, mb, ml,
    width, w, minWidth, minW, maxWidth, maxW, height, h, minHeight, minH, maxHeight, maxH,
    display, position, inset, top, right, bottom, left,
    justify, alignSelf, alignContent,
    gap, rowGap, columnGap,
    flexBasis, flexGrow, flexShrink,
    gridArea, gridColumn, gridColumnStart, gridColumnEnd, gridRow, gridRowStart, gridRowEnd,
    align,
    bg,
    color,
    opacity,
    overflow,
    overflowX,
    overflowY,
    zIndex,
    ...rest
  } = props;

  const hostProps: Record<string, unknown> = {
    className,
    ...rest,
    p: serializeResponsive(p),
    px: serializeResponsive(px),
    py: serializeResponsive(py),
    pt: serializeResponsive(pt),
    pr: serializeResponsive(pr),
    pb: serializeResponsive(pb),
    pl: serializeResponsive(pl),
    m: serializeResponsive(m),
    mx: serializeResponsive(mx),
    my: serializeResponsive(my),
    mt: serializeResponsive(mt),
    mr: serializeResponsive(mr),
    mb: serializeResponsive(mb),
    ml: serializeResponsive(ml),
    width: serializeResponsive(width),
    w: serializeResponsive(w),
    minwidth: serializeResponsive(minWidth ?? minW),
    maxwidth: serializeResponsive(maxWidth ?? maxW),
    height: serializeResponsive(height),
    h: serializeResponsive(h),
    minheight: serializeResponsive(minHeight ?? minH),
    maxheight: serializeResponsive(maxHeight ?? maxH),
    display: serializeResponsive(display),
    position: serializeResponsive(position),
    inset: serializeResponsive(inset),
    top: serializeResponsive(top),
    right: serializeResponsive(right),
    bottom: serializeResponsive(bottom),
    left: serializeResponsive(left),
    justify: serializeResponsive(justify),
    flexbasis: serializeResponsive(flexBasis),
    flexgrow: serializeResponsive(flexGrow),
    flexshrink: serializeResponsive(flexShrink),
    alignself: serializeResponsive(alignSelf),
    aligncontent: serializeResponsive(alignContent),
    gap: serializeResponsive(gap),
    rowgap: serializeResponsive(rowGap),
    columngap: serializeResponsive(columnGap),
    gridarea: serializeResponsive(gridArea),
    gridcolumn: serializeResponsive(gridColumn),
    gridcolumnstart: serializeResponsive(gridColumnStart),
    gridcolumnend: serializeResponsive(gridColumnEnd),
    gridrow: serializeResponsive(gridRow),
    gridrowstart: serializeResponsive(gridRowStart),
    gridrowend: serializeResponsive(gridRowEnd),
    align: serializeResponsive(align),
    bg: serializeResponsive(bg),
    color: serializeResponsive(color),
    opacity: serializeResponsive(opacity),
    overflow: serializeResponsive(overflow),
    overflowx: serializeResponsive(overflowX),
    overflowy: serializeResponsive(overflowY),
    zindex: serializeResponsive(zIndex),
    variant: variant && variant !== 'default' ? variant : undefined,
    tone: tone && tone !== 'default' ? tone : undefined,
    state: state && state !== 'idle' ? state : undefined,
    elevation: elevation && elevation !== 'default' ? elevation : undefined,
    radius: radius && radius !== 'default' ? radius : undefined,
    interactive: interactive ? '' : undefined,
    disabled: disabled ? '' : undefined,
    headless: headless ? '' : undefined
  };

  return React.createElement('ui-box', hostProps, children);
}

export default Box;
