import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type PositionerStateDetail = {
  placement: string;
  strategy: string;
  x: number;
  y: number;
  width?: number;
  maxWidth?: number;
  maxHeight?: number;
  availableWidth?: number;
  availableHeight?: number;
};

export type PositionerProps = React.HTMLAttributes<HTMLElement> & {
  open?: boolean;
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
  strategy?: 'fixed' | 'absolute';
  offset?: number;
  crossOffset?: number;
  flip?: boolean;
  shift?: boolean;
  matchWidth?: boolean;
  fitViewport?: boolean;
  anchor?: string;
  headless?: boolean;
  onPositionChange?: (detail: PositionerStateDetail) => void;
};

export const Positioner = React.forwardRef<HTMLElement, PositionerProps>(function Positioner(
  {
    children,
    open,
    placement,
    strategy,
    offset,
    crossOffset,
    flip,
    shift,
    matchWidth,
    fitViewport,
    anchor,
    headless,
    onPositionChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handlePositionChange = (event: Event) => onPositionChange?.((event as CustomEvent<PositionerStateDetail>).detail);
    el.addEventListener('position-change', handlePositionChange as EventListener);
    return () => {
      el.removeEventListener('position-change', handlePositionChange as EventListener);
    };
  }, [onPositionChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) el.setAttribute('open', '');
    else el.removeAttribute('open');
    if (placement) el.setAttribute('placement', placement);
    else el.removeAttribute('placement');
    if (strategy && strategy !== 'fixed') el.setAttribute('strategy', strategy);
    else el.removeAttribute('strategy');
    if (offset != null) el.setAttribute('offset', String(offset));
    else el.removeAttribute('offset');
    if (crossOffset != null) el.setAttribute('cross-offset', String(crossOffset));
    else el.removeAttribute('cross-offset');
    if (flip === false) el.setAttribute('flip', 'false');
    else if (flip) el.setAttribute('flip', '');
    else el.removeAttribute('flip');
    if (shift === false) el.setAttribute('shift', 'false');
    else if (shift) el.setAttribute('shift', '');
    else el.removeAttribute('shift');
    if (matchWidth) el.setAttribute('match-width', '');
    else el.removeAttribute('match-width');
    if (fitViewport) el.setAttribute('fit-viewport', '');
    else el.removeAttribute('fit-viewport');
    if (anchor) el.setAttribute('anchor', anchor);
    else el.removeAttribute('anchor');
    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [anchor, crossOffset, fitViewport, flip, headless, matchWidth, offset, open, placement, shift, strategy]);

  return React.createElement('ui-positioner', { ref, ...rest }, children);
});

Positioner.displayName = 'Positioner';

export default Positioner;
