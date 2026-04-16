export type PositionerPlacement =
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

export type PositionerStrategy = 'absolute' | 'fixed';
export type PositionerSticky = 'partial' | 'always' | 'never';
export type PositionerAnchor = HTMLElement | DOMRect | { getBoundingClientRect: () => DOMRect };

export interface PositionerState {
  x: number;
  y: number;
  placement: PositionerPlacement;
  availableWidth: number;
  availableHeight: number;
}

export interface PositionerOptions {
  anchor: PositionerAnchor;
  floating: HTMLElement;
  placement?: PositionerPlacement;
  strategy?: PositionerStrategy;
  offset?: number;
  crossOffset?: number;
  flip?: boolean;
  shift?: boolean;
  matchWidth?: boolean;
  fitViewport?: boolean;
  arrow?: HTMLElement | null;
  boundary?: HTMLElement | null;
  sticky?: PositionerSticky;
  observeWindowResize?: boolean;
  observeScroll?: boolean;
  observeAnchorResize?: boolean;
  observeFloatingResize?: boolean;
  onUpdate?: (data: PositionerState) => void;
}

export interface PositionerHandle {
  update(): PositionerState;
  destroy(): void;
}

type ViewportRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

const VIEWPORT_PADDING = 4;

function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function isDOMRectLike(value: unknown): value is DOMRect {
  return !!value && typeof (value as DOMRect).top === 'number' && typeof (value as DOMRect).left === 'number';
}

function getRect(anchor: PositionerAnchor): DOMRect {
  if (isHTMLElement(anchor)) return anchor.getBoundingClientRect();
  if (isDOMRectLike(anchor)) return anchor;
  return anchor.getBoundingClientRect();
}

function getBoundaryRect(boundary?: HTMLElement | null): ViewportRect {
  if (boundary instanceof HTMLElement) {
    const rect = boundary.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }
  const width = window.innerWidth || document.documentElement.clientWidth || 0;
  const height = window.innerHeight || document.documentElement.clientHeight || 0;
  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height
  };
}

function splitPlacement(placement: PositionerPlacement): { side: 'top' | 'right' | 'bottom' | 'left'; align: 'center' | 'start' | 'end' } {
  const [side, align] = placement.split('-') as [PositionerPlacement, 'start' | 'end' | undefined];
  return {
    side: side as 'top' | 'right' | 'bottom' | 'left',
    align: align || 'center'
  };
}

function oppositePlacement(placement: PositionerPlacement): PositionerPlacement {
  const { side, align } = splitPlacement(placement);
  const oppositeSide = side === 'top'
    ? 'bottom'
    : side === 'bottom'
      ? 'top'
      : side === 'left'
        ? 'right'
        : 'left';
  return `${oppositeSide}${align === 'center' ? '' : `-${align}`}` as PositionerPlacement;
}

function placeAlongAxis(
  anchorRect: DOMRect,
  floatingRect: DOMRect,
  placement: PositionerPlacement,
  offset: number,
  crossOffset: number
): { x: number; y: number } {
  const { side, align } = splitPlacement(placement);
  let x = 0;
  let y = 0;

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') x = anchorRect.left;
    else if (align === 'end') x = anchorRect.right - floatingRect.width;
    else x = anchorRect.left + (anchorRect.width - floatingRect.width) / 2;
    y = side === 'top' ? anchorRect.top - floatingRect.height - offset : anchorRect.bottom + offset;
    x += crossOffset;
  } else {
    if (align === 'start') y = anchorRect.top;
    else if (align === 'end') y = anchorRect.bottom - floatingRect.height;
    else y = anchorRect.top + (anchorRect.height - floatingRect.height) / 2;
    x = side === 'left' ? anchorRect.left - floatingRect.width - offset : anchorRect.right + offset;
    y += crossOffset;
  }

  return { x, y };
}

function overflowsMainAxis(
  placement: PositionerPlacement,
  point: { x: number; y: number },
  floatingRect: DOMRect,
  boundary: ViewportRect
): boolean {
  const { side } = splitPlacement(placement);
  if (side === 'top') return point.y < boundary.top + VIEWPORT_PADDING;
  if (side === 'bottom') return point.y + floatingRect.height > boundary.bottom - VIEWPORT_PADDING;
  if (side === 'left') return point.x < boundary.left + VIEWPORT_PADDING;
  return point.x + floatingRect.width > boundary.right - VIEWPORT_PADDING;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function positionArrow(
  arrow: HTMLElement,
  state: PositionerState,
  anchorRect: DOMRect,
  floatingRect: DOMRect
): void {
  const { side } = splitPlacement(state.placement);
  const centerX = anchorRect.left + anchorRect.width / 2;
  const centerY = anchorRect.top + anchorRect.height / 2;

  if (side === 'top' || side === 'bottom') {
    const min = 8;
    const max = Math.max(min, floatingRect.width - 8);
    const left = clamp(centerX - state.x, min, max);
    arrow.style.left = `${Math.round(left)}px`;
    arrow.style.top = '';
  } else {
    const min = 8;
    const max = Math.max(min, floatingRect.height - 8);
    const top = clamp(centerY - state.y, min, max);
    arrow.style.top = `${Math.round(top)}px`;
    arrow.style.left = '';
  }
}

export function computePositionState(
  anchor: PositionerAnchor,
  floating: HTMLElement | DOMRect,
  options: Omit<PositionerOptions, 'anchor' | 'floating' | 'onUpdate'> = {}
): PositionerState {
  const anchorRect = getRect(anchor);
  const floatingRect = isHTMLElement(floating) ? floating.getBoundingClientRect() : floating;
  const boundary = getBoundaryRect(options.boundary ?? null);
  const placement = options.placement || 'bottom';
  const offset = typeof options.offset === 'number' ? options.offset : 8;
  const crossOffset = typeof options.crossOffset === 'number' ? options.crossOffset : 0;

  let resolvedPlacement = placement;
  let point = placeAlongAxis(anchorRect, floatingRect, resolvedPlacement, offset, crossOffset);

  if (options.flip && overflowsMainAxis(resolvedPlacement, point, floatingRect, boundary)) {
    const alternate = oppositePlacement(resolvedPlacement);
    const alternatePoint = placeAlongAxis(anchorRect, floatingRect, alternate, offset, crossOffset);
    if (!overflowsMainAxis(alternate, alternatePoint, floatingRect, boundary)) {
      resolvedPlacement = alternate;
      point = alternatePoint;
    }
  }

  if (options.shift || options.fitViewport) {
    const minX = boundary.left + VIEWPORT_PADDING;
    const minY = boundary.top + VIEWPORT_PADDING;
    const maxX = Math.max(minX, boundary.right - floatingRect.width - VIEWPORT_PADDING);
    const maxY = Math.max(minY, boundary.bottom - floatingRect.height - VIEWPORT_PADDING);
    point.x = clamp(point.x, minX, maxX);
    point.y = clamp(point.y, minY, maxY);
  }

  return {
    x: point.x,
    y: point.y,
    placement: resolvedPlacement,
    availableWidth: Math.max(0, boundary.right - point.x - VIEWPORT_PADDING),
    availableHeight: Math.max(0, boundary.bottom - point.y - VIEWPORT_PADDING)
  };
}

function toOffsetCoordinates(state: PositionerState, strategy: PositionerStrategy): PositionerState {
  if (strategy !== 'absolute') return state;
  return {
    ...state,
    x: state.x + window.scrollX,
    y: state.y + window.scrollY
  };
}

type AutoUpdateOptions = {
  observeWindowResize: boolean;
  observeScroll: boolean;
  observeAnchorResize: boolean;
  observeFloatingResize: boolean;
};

function autoUpdate(anchor: PositionerAnchor, floating: HTMLElement, update: () => void, options: AutoUpdateOptions): () => void {
  let frame = 0;
  let roAnchor: ResizeObserver | null = null;
  let roFloating: ResizeObserver | null = null;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  };

  const onWindowChange = () => schedule();
  if (options.observeWindowResize) {
    window.addEventListener('resize', onWindowChange);
  }
  if (options.observeScroll) {
    window.addEventListener('scroll', onWindowChange, { passive: true, capture: true });
  }

  if (typeof ResizeObserver !== 'undefined') {
    if (options.observeAnchorResize && isHTMLElement(anchor)) {
      roAnchor = new ResizeObserver(schedule);
      roAnchor.observe(anchor);
    }
    if (options.observeFloatingResize) {
      roFloating = new ResizeObserver(schedule);
      roFloating.observe(floating);
    }
  }

  return () => {
    if (options.observeWindowResize) {
      window.removeEventListener('resize', onWindowChange);
    }
    if (options.observeScroll) {
      window.removeEventListener('scroll', onWindowChange, true);
    }
    if (roAnchor) roAnchor.disconnect();
    if (roFloating) roFloating.disconnect();
    if (frame) cancelAnimationFrame(frame);
  };
}

export function createPositioner(options: PositionerOptions): PositionerHandle {
  if (!(options.floating instanceof HTMLElement)) {
    throw new Error('createPositioner requires a valid floating HTMLElement');
  }

  const strategy = options.strategy || 'fixed';
  const floating = options.floating;
  const cleanup = autoUpdate(options.anchor, floating, update, {
    observeWindowResize: options.observeWindowResize ?? true,
    observeScroll: options.observeScroll ?? true,
    observeAnchorResize: options.observeAnchorResize ?? true,
    // When the positioner constrains the floating box, observing that same box
    // can create resize feedback loops in real browsers.
    observeFloatingResize: options.observeFloatingResize ?? !(options.fitViewport || options.matchWidth)
  });

  function update(): PositionerState {
    const next = computePositionState(options.anchor, floating, options);
    const applied = toOffsetCoordinates(next, strategy);

    floating.style.position = strategy;
    floating.style.left = `${Math.round(applied.x)}px`;
    floating.style.top = `${Math.round(applied.y)}px`;
    floating.style.setProperty('--ui-positioner-x', `${Math.round(applied.x)}px`);
    floating.style.setProperty('--ui-positioner-y', `${Math.round(applied.y)}px`);

    if (options.matchWidth) {
      const anchorRect = getRect(options.anchor);
      floating.style.width = `${Math.round(anchorRect.width)}px`;
    }

    if (options.fitViewport) {
      floating.style.maxWidth = `${Math.round(next.availableWidth)}px`;
      floating.style.maxHeight = `${Math.round(next.availableHeight)}px`;
    }

    floating.setAttribute('data-placement', next.placement);
    if (options.arrow instanceof HTMLElement) {
      positionArrow(options.arrow, next, getRect(options.anchor), floating.getBoundingClientRect());
    }

    options.onUpdate?.(next);
    return next;
  }

  update();

  return {
    update,
    destroy() {
      cleanup();
    }
  };
}
