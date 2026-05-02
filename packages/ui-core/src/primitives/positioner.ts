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
export type PositionerSide = 'top' | 'right' | 'bottom' | 'left';
export type PositionerAlign = 'center' | 'start' | 'end';

export type PositionerVirtualElement = {
  getBoundingClientRect: () => DOMRect;
  getClientRects?: () => DOMRectList | DOMRect[];
  contextElement?: Element;
};

export type PositionerAnchor =
  | HTMLElement
  | DOMRect
  | PositionerVirtualElement;

export interface PositionerMiddlewareData {
  [key: string]: unknown;
  offset?: {
    x: number;
    y: number;
  };
  flip?: {
    overflows: Array<{ placement: PositionerPlacement; overflow: PositionerOverflow }>;
  };
  autoPlacement?: {
    index: number;
    overflows: Array<{ placement: PositionerPlacement; overflow: PositionerOverflow }>;
  };
  shift?: {
    x: number;
    y: number;
  };
  arrow?: {
    x?: number;
    y?: number;
    centerOffset: number;
  };
  size?: {
    availableWidth: number;
    availableHeight: number;
  };
  hide?: {
    referenceHidden: boolean;
    escaped: boolean;
    referenceHiddenOffsets: PositionerOverflow;
    escapedOffsets: PositionerOverflow;
  };
}

export interface PositionerState {
  x: number;
  y: number;
  placement: PositionerPlacement;
  strategy?: PositionerStrategy;
  availableWidth: number;
  availableHeight: number;
  middlewareData?: PositionerMiddlewareData;
  referenceHidden?: boolean;
  escaped?: boolean;
  rects?: PositionerRects;
}

export type PositionerOverflow = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type PositionerRects = {
  reference: DOMRect;
  floating: DOMRect;
};

export type PositionerBoundaryRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export interface PositionerPlatform {
  getElementRects?: (data: {
    anchor: PositionerAnchor;
    floating: HTMLElement | DOMRect;
    placement: PositionerPlacement;
    inline: boolean;
  }) => PositionerRects;
  getClientRects?: (anchor: PositionerAnchor) => DOMRect[] | DOMRectList;
  getClippingRect?: (data: {
    anchor: PositionerAnchor;
    floating: HTMLElement | DOMRect;
    boundary: HTMLElement | null;
  }) => PositionerBoundaryRect;
}

export interface PositionerMiddlewareState {
  x: number;
  y: number;
  initialPlacement: PositionerPlacement;
  placement: PositionerPlacement;
  strategy: PositionerStrategy;
  rects: PositionerRects;
  elements: {
    anchor: PositionerAnchor;
    floating: HTMLElement | DOMRect;
  };
  boundary: ViewportRect;
  padding: number;
  rtl: boolean;
  middlewareData: PositionerMiddlewareData;
  getRects(placement: PositionerPlacement): PositionerRects;
  getAnchorRect(placement: PositionerPlacement): DOMRect;
  getCoords(placement: PositionerPlacement, referenceRect?: DOMRect): { x: number; y: number };
}

export interface PositionerMiddlewareReturn {
  x?: number;
  y?: number;
  placement?: PositionerPlacement;
  data?: unknown;
  reset?: boolean | { placement?: PositionerPlacement };
}

export interface PositionerMiddleware {
  name: string;
  options?: unknown;
  fn(state: PositionerMiddlewareState): PositionerMiddlewareReturn | void;
}

export interface PositionerOptions {
  anchor: PositionerAnchor;
  floating: HTMLElement;
  placement?: PositionerPlacement;
  strategy?: PositionerStrategy;
  dir?: 'ltr' | 'rtl';
  offset?: number;
  crossOffset?: number;
  flip?: boolean;
  shift?: boolean;
  matchWidth?: boolean;
  fitViewport?: boolean;
  arrow?: HTMLElement | null;
  arrowPadding?: number;
  boundary?: HTMLElement | null;
  boundaryPadding?: number;
  autoPlacement?: boolean;
  allowedPlacements?: PositionerPlacement[];
  fallbackPlacements?: PositionerPlacement[];
  inline?: boolean;
  hideWhenDetached?: boolean;
  platform?: PositionerPlatform;
  middleware?: PositionerMiddleware[];
  sticky?: PositionerSticky;
  observeWindowResize?: boolean;
  observeScroll?: boolean;
  observeAncestorScroll?: boolean;
  observeAncestorResize?: boolean;
  observeLayoutShift?: boolean;
  observeAnchorResize?: boolean;
  observeFloatingResize?: boolean;
  animationFrame?: boolean;
  onUpdate?: (data: PositionerState) => void;
}

export interface PositionerHandle {
  update(): PositionerState;
  destroy(): void;
}

export interface PositionerAutoUpdateOptions {
  observeWindowResize?: boolean;
  observeScroll?: boolean;
  observeAncestorScroll?: boolean;
  observeAncestorResize?: boolean;
  observeLayoutShift?: boolean;
  observeAnchorResize?: boolean;
  observeFloatingResize?: boolean;
  animationFrame?: boolean;
}

type ViewportRect = PositionerBoundaryRect;

type RectLike = {
  x?: number;
  y?: number;
  top: number;
  left: number;
  right?: number;
  bottom?: number;
  width: number;
  height: number;
};

type OffsetMiddlewareOptions = number | {
  mainAxis?: number;
  crossAxis?: number;
};

type ShiftMiddlewareOptions = {
  padding?: number;
  mainAxis?: boolean;
  crossAxis?: boolean;
};

type FlipMiddlewareOptions = {
  padding?: number;
  fallbackPlacements?: PositionerPlacement[];
};

type AutoPlacementMiddlewareOptions = {
  padding?: number;
  allowedPlacements?: PositionerPlacement[];
};

type ArrowMiddlewareOptions = {
  element?: HTMLElement | null;
  padding?: number;
};

type SizeMiddlewareOptions = {
  padding?: number;
  apply?: (data: {
    availableWidth: number;
    availableHeight: number;
    rects: PositionerRects;
    elements: PositionerMiddlewareState['elements'];
  }) => void;
};

type HideMiddlewareOptions = {
  padding?: number;
};

const VIEWPORT_PADDING = 4;
const ALL_PLACEMENTS: PositionerPlacement[] = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end'
];

function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function isDOMRectLike(value: unknown): value is DOMRect {
  return !!value && typeof (value as DOMRect).top === 'number' && typeof (value as DOMRect).left === 'number';
}

function isVirtualElement(value: unknown): value is PositionerVirtualElement {
  return !!value && typeof (value as PositionerVirtualElement).getBoundingClientRect === 'function';
}

function createDOMRect(rect: { x?: number; y?: number; width: number; height: number }): DOMRect {
  const x = rect.x ?? 0;
  const y = rect.y ?? 0;
  if (typeof DOMRect.fromRect === 'function') {
    return DOMRect.fromRect({ x, y, width: rect.width, height: rect.height });
  }
  return new DOMRect(x, y, rect.width, rect.height);
}

function toDOMRect(rect: DOMRect | RectLike): DOMRect {
  if (rect instanceof DOMRect) return rect;
  return createDOMRect({
    x: rect.x ?? rect.left,
    y: rect.y ?? rect.top,
    width: rect.width,
    height: rect.height
  });
}

function getRect(anchor: PositionerAnchor): DOMRect {
  if (isHTMLElement(anchor)) return anchor.getBoundingClientRect();
  if (isDOMRectLike(anchor)) return toDOMRect(anchor);
  return toDOMRect(anchor.getBoundingClientRect());
}

function getClientRects(anchor: PositionerAnchor, platform?: PositionerPlatform): DOMRect[] {
  const platformRects = platform?.getClientRects?.(anchor);
  if (platformRects) {
    return Array.from(platformRects)
      .map((rect) => toDOMRect(rect))
      .filter((rect) => rect.width > 0 || rect.height > 0);
  }

  const source =
    (isHTMLElement(anchor) || isVirtualElement(anchor)) &&
    typeof anchor.getClientRects === 'function'
      ? anchor.getClientRects()
      : null;
  if (!source) return [];
  return Array.from(source)
    .map((rect) => toDOMRect(rect))
    .filter((rect) => rect.width > 0 || rect.height > 0);
}

function getAnchorRect(anchor: PositionerAnchor, placement: PositionerPlacement, useInline: boolean, platform?: PositionerPlatform): DOMRect {
  if (!useInline) return getRect(anchor);

  const rects = getClientRects(anchor, platform);
  if (rects.length === 0) return getRect(anchor);

  const { side } = splitPlacement(placement);
  if (side === 'bottom' || side === 'right') {
    return rects[rects.length - 1] || getRect(anchor);
  }
  return rects[0] || getRect(anchor);
}

function getAnchorElement(anchor: PositionerAnchor): HTMLElement | null {
  if (isHTMLElement(anchor)) return anchor;
  if (isVirtualElement(anchor) && anchor.contextElement instanceof HTMLElement) {
    return anchor.contextElement;
  }
  return null;
}

function getDirection(anchor: PositionerAnchor, floating: HTMLElement | DOMRect, option?: 'ltr' | 'rtl'): 'ltr' | 'rtl' {
  if (option) return option;
  const element = getAnchorElement(anchor) || (floating instanceof HTMLElement ? floating : null);
  if (!element) return 'ltr';
  return window.getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr';
}

export function createVirtualPoint(x: number, y: number, contextElement?: Element): PositionerVirtualElement {
  return {
    getBoundingClientRect: () =>
      createDOMRect({
        x,
        y,
        width: 0,
        height: 0
      }),
    contextElement
  };
}

export function createVirtualRect(rect: DOMRect | { x?: number; y?: number; top: number; left: number; width: number; height: number }, contextElement?: Element): PositionerVirtualElement {
  const normalized = createDOMRect({
    x: rect.x ?? rect.left,
    y: rect.y ?? rect.top,
    width: rect.width,
    height: rect.height
  });
  return {
    getBoundingClientRect: () => normalized,
    contextElement
  };
}

export function createVirtualRange(range: Range, contextElement?: Element): PositionerVirtualElement {
  return {
    getBoundingClientRect: () => toDOMRect(range.getBoundingClientRect()),
    getClientRects: () => range.getClientRects(),
    contextElement
  };
}

function getViewportRect(): ViewportRect {
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

function toViewportRect(rect: DOMRect): ViewportRect {
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height
  };
}

function intersectRects(a: ViewportRect, b: ViewportRect): ViewportRect {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);
  return {
    top,
    left,
    right,
    bottom,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  };
}

function isOverflowElement(element: Element): boolean {
  const style = window.getComputedStyle(element);
  const overflow = `${style.overflow}${style.overflowX}${style.overflowY}`;
  return /(auto|scroll|overlay|hidden|clip)/.test(overflow);
}

function getOverflowAncestors(element: Element | null): Array<Element | Window> {
  const ancestors: Array<Element | Window> = [];
  let parent = element?.parentElement ?? null;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    if (isOverflowElement(parent)) ancestors.push(parent);
    parent = parent.parentElement;
  }
  ancestors.push(window);
  return ancestors;
}

function getClippingRect(anchor: PositionerAnchor, floating: HTMLElement | DOMRect, boundary?: HTMLElement | null): ViewportRect {
  let rect = boundary instanceof HTMLElement
    ? toViewportRect(boundary.getBoundingClientRect())
    : getViewportRect();

  if (boundary instanceof HTMLElement) return rect;

  const clippingElements = new Set<Element>();
  const anchorEl = getAnchorElement(anchor);
  if (anchorEl) {
    getOverflowAncestors(anchorEl).forEach((ancestor) => {
      if (ancestor instanceof Element) clippingElements.add(ancestor);
    });
  }
  if (floating instanceof HTMLElement) {
    getOverflowAncestors(floating).forEach((ancestor) => {
      if (ancestor instanceof Element) clippingElements.add(ancestor);
    });
  }

  clippingElements.forEach((element) => {
    rect = intersectRects(rect, toViewportRect(element.getBoundingClientRect()));
  });

  return rect;
}

function splitPlacement(placement: PositionerPlacement): { side: PositionerSide; align: PositionerAlign } {
  const [side, align] = placement.split('-') as [PositionerSide, 'start' | 'end' | undefined];
  return {
    side,
    align: align || 'center'
  };
}

function oppositeSide(side: PositionerSide): PositionerSide {
  if (side === 'top') return 'bottom';
  if (side === 'bottom') return 'top';
  if (side === 'left') return 'right';
  return 'left';
}

function oppositePlacement(placement: PositionerPlacement): PositionerPlacement {
  const { side, align } = splitPlacement(placement);
  const nextSide = oppositeSide(side);
  return `${nextSide}${align === 'center' ? '' : `-${align}`}` as PositionerPlacement;
}

function withSide(placement: PositionerPlacement, side: PositionerSide): PositionerPlacement {
  const { align } = splitPlacement(placement);
  return `${side}${align === 'center' ? '' : `-${align}`}` as PositionerPlacement;
}

function placeAlongAxis(
  anchorRect: DOMRect,
  floatingRect: DOMRect,
  placement: PositionerPlacement,
  offset = 0,
  crossOffset = 0,
  rtl = false
): { x: number; y: number } {
  const { side, align } = splitPlacement(placement);
  let x = 0;
  let y = 0;

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') x = rtl ? anchorRect.right - floatingRect.width : anchorRect.left;
    else if (align === 'end') x = rtl ? anchorRect.left : anchorRect.right - floatingRect.width;
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function overflowAmount(overflow: PositionerOverflow): number {
  return Math.max(0, overflow.top) +
    Math.max(0, overflow.right) +
    Math.max(0, overflow.bottom) +
    Math.max(0, overflow.left);
}

function mainAxisOverflow(placement: PositionerPlacement, overflow: PositionerOverflow): number {
  const { side } = splitPlacement(placement);
  return Math.max(0, overflow[side]);
}

function crossAxisOverflow(placement: PositionerPlacement, overflow: PositionerOverflow): number {
  const { side } = splitPlacement(placement);
  if (side === 'top' || side === 'bottom') {
    return Math.max(0, overflow.left) + Math.max(0, overflow.right);
  }
  return Math.max(0, overflow.top) + Math.max(0, overflow.bottom);
}

export function detectPositionerOverflow(
  state: Pick<PositionerMiddlewareState, 'x' | 'y' | 'rects' | 'boundary' | 'padding'>,
  options: { elementContext?: 'floating' | 'reference'; padding?: number } = {}
): PositionerOverflow {
  const padding = options.padding ?? state.padding;
  const rect = options.elementContext === 'reference'
    ? {
      x: state.rects.reference.left,
      y: state.rects.reference.top,
      width: state.rects.reference.width,
      height: state.rects.reference.height
    }
    : {
      x: state.x,
      y: state.y,
      width: state.rects.floating.width,
      height: state.rects.floating.height
    };

  return {
    top: state.boundary.top + padding - rect.y,
    right: rect.x + rect.width - (state.boundary.right - padding),
    bottom: rect.y + rect.height - (state.boundary.bottom - padding),
    left: state.boundary.left + padding - rect.x
  };
}

export function offsetMiddleware(options: OffsetMiddlewareOptions = 0): PositionerMiddleware {
  return {
    name: 'offset',
    options,
    fn(state) {
      const normalized = typeof options === 'number'
        ? { mainAxis: options, crossAxis: 0 }
        : { mainAxis: options.mainAxis ?? 0, crossAxis: options.crossAxis ?? 0 };
      const coords = placeAlongAxis(
        state.rects.reference,
        state.rects.floating,
        state.placement,
        normalized.mainAxis,
        normalized.crossAxis,
        state.rtl
      );
      return {
        x: coords.x,
        y: coords.y,
        data: {
          x: coords.x - state.x,
          y: coords.y - state.y
        }
      };
    }
  };
}

export function flipMiddleware(options: FlipMiddlewareOptions = {}): PositionerMiddleware {
  return {
    name: 'flip',
    options,
    fn(state) {
      const fallbackPlacements = options.fallbackPlacements?.length
        ? options.fallbackPlacements
        : [oppositePlacement(state.initialPlacement)];
      const candidates = [state.placement, ...fallbackPlacements];
      const overflows = candidates.map((placement) => {
        const reference = state.getAnchorRect(placement);
        const coords = state.getCoords(placement, reference);
        const overflow = detectPositionerOverflow({
          ...state,
          x: coords.x,
          y: coords.y,
          rects: { ...state.rects, reference }
        }, { padding: options.padding ?? state.padding });
        return { placement, overflow, coords, reference };
      });
      const current = overflows[0];
      if (!current || mainAxisOverflow(state.placement, current.overflow) <= 0) {
        return { data: { overflows: overflows.map(({ placement, overflow }) => ({ placement, overflow })) } };
      }

      const fitting = overflows.find(({ placement, overflow }) => {
        return mainAxisOverflow(placement, overflow) <= 0 && crossAxisOverflow(placement, overflow) <= 0;
      });
      const best = fitting || overflows.reduce((bestCandidate, candidate) => {
        return overflowAmount(candidate.overflow) < overflowAmount(bestCandidate.overflow)
          ? candidate
          : bestCandidate;
      }, current);

      if (best.placement === state.placement) {
        return { data: { overflows: overflows.map(({ placement, overflow }) => ({ placement, overflow })) } };
      }

      return {
        x: best.coords.x,
        y: best.coords.y,
        placement: best.placement,
        data: { overflows: overflows.map(({ placement, overflow }) => ({ placement, overflow })) }
      };
    }
  };
}

export function autoPlacementMiddleware(options: AutoPlacementMiddlewareOptions = {}): PositionerMiddleware {
  return {
    name: 'autoPlacement',
    options,
    fn(state) {
      const allowedPlacements = options.allowedPlacements?.length
        ? options.allowedPlacements
        : ALL_PLACEMENTS;
      const overflows = allowedPlacements.map((placement) => {
        const reference = state.getAnchorRect(placement);
        const coords = state.getCoords(placement, reference);
        const overflow = detectPositionerOverflow({
          ...state,
          x: coords.x,
          y: coords.y,
          rects: { ...state.rects, reference }
        }, { padding: options.padding ?? state.padding });
        return { placement, overflow, coords, reference };
      });
      const best = overflows.reduce((bestCandidate, candidate) => {
        const candidateOverflow = overflowAmount(candidate.overflow);
        const bestOverflow = overflowAmount(bestCandidate.overflow);
        if (candidateOverflow !== bestOverflow) return candidateOverflow < bestOverflow ? candidate : bestCandidate;

        const candidateArea = Math.max(0, state.boundary.right - candidate.coords.x) *
          Math.max(0, state.boundary.bottom - candidate.coords.y);
        const bestArea = Math.max(0, state.boundary.right - bestCandidate.coords.x) *
          Math.max(0, state.boundary.bottom - bestCandidate.coords.y);
        return candidateArea > bestArea ? candidate : bestCandidate;
      }, overflows[0]);

      if (!best) return;
      return {
        x: best.coords.x,
        y: best.coords.y,
        placement: best.placement,
        data: {
          index: allowedPlacements.indexOf(best.placement),
          overflows: overflows.map(({ placement, overflow }) => ({ placement, overflow }))
        }
      };
    }
  };
}

export function shiftMiddleware(options: ShiftMiddlewareOptions = {}): PositionerMiddleware {
  return {
    name: 'shift',
    options,
    fn(state) {
      const mainAxis = options.mainAxis ?? true;
      const crossAxis = options.crossAxis ?? true;
      const { side } = splitPlacement(state.placement);
      const overflow = detectPositionerOverflow(state, { padding: options.padding ?? state.padding });
      let x = state.x;
      let y = state.y;

      if (side === 'top' || side === 'bottom') {
        if (crossAxis) x += Math.max(0, overflow.left) - Math.max(0, overflow.right);
        if (mainAxis) y += side === 'top' ? Math.max(0, overflow.top) : -Math.max(0, overflow.bottom);
      } else {
        if (crossAxis) y += Math.max(0, overflow.top) - Math.max(0, overflow.bottom);
        if (mainAxis) x += side === 'left' ? Math.max(0, overflow.left) : -Math.max(0, overflow.right);
      }

      return {
        x,
        y,
        data: {
          x: x - state.x,
          y: y - state.y
        }
      };
    }
  };
}

export function sizeMiddleware(options: SizeMiddlewareOptions = {}): PositionerMiddleware {
  return {
    name: 'size',
    options,
    fn(state) {
      const padding = options.padding ?? state.padding;
      const availableWidth = Math.max(0, state.boundary.right - state.x - padding);
      const availableHeight = Math.max(0, state.boundary.bottom - state.y - padding);
      options.apply?.({
        availableWidth,
        availableHeight,
        rects: state.rects,
        elements: state.elements
      });
      return {
        data: {
          availableWidth,
          availableHeight
        }
      };
    }
  };
}

export function arrowMiddleware(options: ArrowMiddlewareOptions = {}): PositionerMiddleware {
  return {
    name: 'arrow',
    options,
    fn(state) {
      const { side } = splitPlacement(state.placement);
      const padding = options.padding ?? 8;
      const arrowRect = options.element?.getBoundingClientRect();
      const arrowWidth = arrowRect?.width || options.element?.offsetWidth || 0;
      const arrowHeight = arrowRect?.height || options.element?.offsetHeight || 0;
      const centerX = state.rects.reference.left + state.rects.reference.width / 2;
      const centerY = state.rects.reference.top + state.rects.reference.height / 2;

      if (side === 'top' || side === 'bottom') {
        const half = arrowWidth / 2;
        const min = padding;
        const max = Math.max(min, state.rects.floating.width - padding - arrowWidth);
        const unclamped = centerX - state.x - half;
        const x = clamp(unclamped, min, max);
        return {
          data: {
            x,
            centerOffset: unclamped - x
          }
        };
      }

      const half = arrowHeight / 2;
      const min = padding;
      const max = Math.max(min, state.rects.floating.height - padding - arrowHeight);
      const unclamped = centerY - state.y - half;
      const y = clamp(unclamped, min, max);
      return {
        data: {
          y,
          centerOffset: unclamped - y
        }
      };
    }
  };
}

export function hideMiddleware(options: HideMiddlewareOptions = {}): PositionerMiddleware {
  return {
    name: 'hide',
    options,
    fn(state) {
      const padding = options.padding ?? state.padding;
      const referenceHiddenOffsets = detectPositionerOverflow(state, {
        elementContext: 'reference',
        padding
      });
      const escapedOffsets = detectPositionerOverflow(state, { padding });
      const referenceHidden = Object.values(referenceHiddenOffsets).some((value) => value > 0);
      const escaped = Object.values(escapedOffsets).some((value) => value > 0);
      return {
        data: {
          referenceHidden,
          escaped,
          referenceHiddenOffsets,
          escapedOffsets
        }
      };
    }
  };
}

function buildDefaultMiddleware(options: Omit<PositionerOptions, 'anchor' | 'floating' | 'onUpdate'>): PositionerMiddleware[] {
  const padding = typeof options.boundaryPadding === 'number' ? options.boundaryPadding : VIEWPORT_PADDING;
  const middleware: PositionerMiddleware[] = [];

  if (options.autoPlacement) {
    middleware.push(autoPlacementMiddleware({
      padding,
      allowedPlacements: options.allowedPlacements
    }));
  } else if (options.flip) {
    middleware.push(flipMiddleware({
      padding,
      fallbackPlacements: options.fallbackPlacements
    }));
  }

  middleware.push(offsetMiddleware({
    mainAxis: typeof options.offset === 'number' ? options.offset : 8,
    crossAxis: typeof options.crossOffset === 'number' ? options.crossOffset : 0
  }));

  if (options.shift || options.fitViewport) {
    middleware.push(shiftMiddleware({ padding }));
  }

  if (options.matchWidth || options.fitViewport) {
    middleware.push(sizeMiddleware({ padding }));
  }

  if (options.arrow) {
    middleware.push(arrowMiddleware({
      element: options.arrow,
      padding: options.arrowPadding
    }));
  }

  if (options.hideWhenDetached) {
    middleware.push(hideMiddleware({ padding }));
  }

  if (options.middleware?.length) {
    middleware.push(...options.middleware);
  }

  return middleware;
}

function applyMiddlewareResult(
  state: PositionerMiddlewareState,
  middleware: PositionerMiddleware,
  result: PositionerMiddlewareReturn | void
): void {
  if (!result) return;

  if (typeof result.x === 'number') state.x = result.x;
  if (typeof result.y === 'number') state.y = result.y;

  const resetPlacement = typeof result.reset === 'object' ? result.reset.placement : undefined;
  const nextPlacement = resetPlacement || result.placement;
  if (nextPlacement && nextPlacement !== state.placement) {
    state.placement = nextPlacement;
    state.rects = state.getRects(nextPlacement);
    const coords = state.getCoords(nextPlacement, state.rects.reference);
    state.x = typeof result.x === 'number' ? result.x : coords.x;
    state.y = typeof result.y === 'number' ? result.y : coords.y;
  }

  if (typeof result.x === 'number') state.x = result.x;
  if (typeof result.y === 'number') state.y = result.y;
  if (result.data !== undefined) {
    state.middlewareData[middleware.name] = result.data;
  }
}

export function computePositionState(
  anchor: PositionerAnchor,
  floating: HTMLElement | DOMRect,
  options: Omit<PositionerOptions, 'anchor' | 'floating' | 'onUpdate'> = {}
): PositionerState {
  const fallbackFloatingRect = isHTMLElement(floating) ? floating.getBoundingClientRect() : floating;
  const placement = options.placement || 'bottom';
  const strategy = options.strategy || 'fixed';
  const padding = typeof options.boundaryPadding === 'number' ? options.boundaryPadding : VIEWPORT_PADDING;
  const rtl = getDirection(anchor, floating, options.dir) === 'rtl';
  const getRects = (nextPlacement: PositionerPlacement): PositionerRects =>
    options.platform?.getElementRects?.({
      anchor,
      floating,
      placement: nextPlacement,
      inline: !!options.inline
    }) ?? {
      reference: getAnchorRect(anchor, nextPlacement, !!options.inline, options.platform),
      floating: fallbackFloatingRect
    };
  const getReference = (nextPlacement: PositionerPlacement) => getRects(nextPlacement).reference;
  const initialRects = getRects(placement);
  const initialCoords = placeAlongAxis(initialRects.reference, initialRects.floating, placement, 0, 0, rtl);
  const middlewareData: PositionerMiddlewareData = {};
  const boundary =
    options.platform?.getClippingRect?.({ anchor, floating, boundary: options.boundary ?? null }) ??
    getClippingRect(anchor, floating, options.boundary ?? null);
  const state: PositionerMiddlewareState = {
    x: initialCoords.x,
    y: initialCoords.y,
    initialPlacement: placement,
    placement,
    strategy,
    rects: initialRects,
    elements: {
      anchor,
      floating
    },
    boundary,
    padding,
    rtl,
    middlewareData,
    getRects,
    getAnchorRect: getReference,
    getCoords: (nextPlacement, nextReference = getReference(nextPlacement)) =>
      placeAlongAxis(nextReference, state.rects.floating, nextPlacement, 0, 0, rtl)
  };

  buildDefaultMiddleware(options).forEach((middleware) => {
    applyMiddlewareResult(state, middleware, middleware.fn(state));
  });

  const sizeData = middlewareData.size;
  const hideData = middlewareData.hide;
  const availableWidth = sizeData?.availableWidth ?? Math.max(0, state.boundary.right - state.x - padding);
  const availableHeight = sizeData?.availableHeight ?? Math.max(0, state.boundary.bottom - state.y - padding);

  return {
    x: state.x,
    y: state.y,
    placement: state.placement,
    strategy,
    availableWidth,
    availableHeight,
    middlewareData,
    referenceHidden: hideData?.referenceHidden,
    escaped: hideData?.escaped,
    rects: state.rects
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

type AutoUpdateOptions = Required<PositionerAutoUpdateOptions>;

function observeMove(element: HTMLElement, update: () => void): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => undefined;

  let cleanup: () => void = () => undefined;
  const refresh = () => {
    cleanup();
    const rect = element.getBoundingClientRect();
    const root = document.documentElement;
    const rootMargin = `${-Math.floor(rect.top)}px ${-Math.floor(root.clientWidth - rect.right)}px ${-Math.floor(root.clientHeight - rect.bottom)}px ${-Math.floor(rect.left)}px`;
    const observer = new IntersectionObserver(() => update(), {
      rootMargin,
      threshold: 1
    });
    observer.observe(element);
    cleanup = () => observer.disconnect();
  };

  refresh();
  return () => cleanup();
}

function autoUpdate(anchor: PositionerAnchor, floating: HTMLElement, update: () => void, options: AutoUpdateOptions): () => void {
  let frame = 0;
  let animationFrame = 0;
  let previousAnchorRect: DOMRect | null = null;
  let roAnchor: ResizeObserver | null = null;
  let roFloating: ResizeObserver | null = null;
  const cleanupHandlers: Array<() => void> = [];
  const anchorElement = getAnchorElement(anchor);
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  };

  if (options.observeWindowResize) {
    window.addEventListener('resize', schedule);
    cleanupHandlers.push(() => window.removeEventListener('resize', schedule));
  }

  if (options.observeScroll) {
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    cleanupHandlers.push(() => window.removeEventListener('scroll', schedule, true));
  }

  const ancestors = options.observeAncestorScroll || options.observeAncestorResize
    ? new Set([
      ...(anchorElement ? getOverflowAncestors(anchorElement) : []),
      ...getOverflowAncestors(floating)
    ])
    : new Set<Element | Window>();

  ancestors.forEach((ancestor) => {
    if (ancestor === window) return;
    if (options.observeAncestorScroll) {
      ancestor.addEventListener('scroll', schedule, { passive: true });
      cleanupHandlers.push(() => ancestor.removeEventListener('scroll', schedule));
    }
    if (options.observeAncestorResize) {
      ancestor.addEventListener('resize', schedule);
      cleanupHandlers.push(() => ancestor.removeEventListener('resize', schedule));
    }
  });

  if (anchorElement && options.observeLayoutShift) {
    cleanupHandlers.push(observeMove(anchorElement, schedule));
  }

  if (typeof ResizeObserver !== 'undefined') {
    if (options.observeAnchorResize && anchorElement) {
      roAnchor = new ResizeObserver(schedule);
      roAnchor.observe(anchorElement);
    }
    if (options.observeFloatingResize) {
      roFloating = new ResizeObserver(schedule);
      roFloating.observe(floating);
    }
  }

  if (options.animationFrame) {
    previousAnchorRect = getRect(anchor);
    const loop = () => {
      const nextAnchorRect = getRect(anchor);
      if (
        previousAnchorRect &&
        (
          previousAnchorRect.top !== nextAnchorRect.top ||
          previousAnchorRect.left !== nextAnchorRect.left ||
          previousAnchorRect.width !== nextAnchorRect.width ||
          previousAnchorRect.height !== nextAnchorRect.height
        )
      ) {
        schedule();
      }
      previousAnchorRect = nextAnchorRect;
      animationFrame = requestAnimationFrame(loop);
    };
    animationFrame = requestAnimationFrame(loop);
  }

  return () => {
    cleanupHandlers.forEach((cleanup) => cleanup());
    if (roAnchor) roAnchor.disconnect();
    if (roFloating) roFloating.disconnect();
    if (frame) cancelAnimationFrame(frame);
    if (animationFrame) cancelAnimationFrame(animationFrame);
  };
}

export function autoUpdatePositioner(
  anchor: PositionerAnchor,
  floating: HTMLElement,
  update: () => void,
  options: PositionerAutoUpdateOptions = {}
): () => void {
  return autoUpdate(anchor, floating, update, {
    observeWindowResize: options.observeWindowResize ?? true,
    observeScroll: options.observeScroll ?? true,
    observeAncestorScroll: options.observeAncestorScroll ?? true,
    observeAncestorResize: options.observeAncestorResize ?? true,
    observeLayoutShift: options.observeLayoutShift ?? true,
    observeAnchorResize: options.observeAnchorResize ?? true,
    observeFloatingResize: options.observeFloatingResize ?? true,
    animationFrame: options.animationFrame ?? false
  });
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
  } else {
    const min = 8;
    const max = Math.max(min, floatingRect.height - 8);
    const top = clamp(centerY - state.y, min, max);
    arrow.style.top = `${Math.round(top)}px`;
  }
}

function applyArrowFromMiddleware(arrow: HTMLElement, state: PositionerState): void {
  const arrowData = state.middlewareData?.arrow;
  if (!arrowData) return;
  if (typeof arrowData.x === 'number') {
    arrow.style.left = `${Math.round(arrowData.x)}px`;
  }
  if (typeof arrowData.y === 'number') {
    arrow.style.top = `${Math.round(arrowData.y)}px`;
  }
}

function applyState(
  floating: HTMLElement,
  state: PositionerState,
  strategy: PositionerStrategy,
  options: PositionerOptions
): void {
  floating.style.position = strategy;
  floating.style.left = `${Math.round(state.x)}px`;
  floating.style.top = `${Math.round(state.y)}px`;
  floating.style.setProperty('--ui-positioner-x', `${Math.round(state.x)}px`);
  floating.style.setProperty('--ui-positioner-y', `${Math.round(state.y)}px`);

  if (options.matchWidth) {
    const anchorRect = getRect(options.anchor);
    floating.style.width = `${Math.round(anchorRect.width)}px`;
  }

  if (options.fitViewport) {
    floating.style.maxWidth = `${Math.round(state.availableWidth)}px`;
    floating.style.maxHeight = `${Math.round(state.availableHeight)}px`;
  }

  floating.setAttribute('data-placement', state.placement);
  if (typeof state.referenceHidden === 'boolean' || typeof state.escaped === 'boolean') {
    floating.setAttribute('data-reference-hidden', state.referenceHidden ? 'true' : 'false');
    floating.setAttribute('data-escaped', state.escaped ? 'true' : 'false');
  } else {
    floating.removeAttribute('data-reference-hidden');
    floating.removeAttribute('data-escaped');
  }

  if (options.arrow instanceof HTMLElement) {
    if (state.middlewareData?.arrow) {
      applyArrowFromMiddleware(options.arrow, state);
    } else {
      positionArrow(options.arrow, state, getRect(options.anchor), floating.getBoundingClientRect());
    }
  }
}

export function createPositioner(options: PositionerOptions): PositionerHandle {
  if (!(options.floating instanceof HTMLElement)) {
    throw new Error('createPositioner requires a valid floating HTMLElement');
  }

  const strategy = options.strategy || 'fixed';
  const floating = options.floating;
  let lastState = toOffsetCoordinates(
    computePositionState(options.anchor, floating, options),
    strategy
  );
  const cleanup = autoUpdatePositioner(options.anchor, floating, update, {
    observeWindowResize: options.observeWindowResize ?? true,
    observeScroll: options.observeScroll ?? true,
    observeAncestorScroll: options.observeAncestorScroll ?? true,
    observeAncestorResize: options.observeAncestorResize ?? true,
    observeLayoutShift: options.observeLayoutShift ?? true,
    observeAnchorResize: options.observeAnchorResize ?? true,
    // When the positioner constrains the floating box, observing that same box
    // can create resize feedback loops in real browsers.
    observeFloatingResize: options.observeFloatingResize ?? !(options.fitViewport || options.matchWidth),
    animationFrame: options.animationFrame ?? false
  });

  function update(): PositionerState {
    const next = toOffsetCoordinates(
      computePositionState(options.anchor, floating, options),
      strategy
    );
    lastState = next;
    applyState(floating, next, strategy, options);
    options.onUpdate?.(next);

    return lastState;
  }

  update();

  return {
    update,
    destroy() {
      cleanup();
    }
  };
}
