import {
  autoUpdatePositioner,
  computePositionState,
  type PositionerAnchor,
  type PositionerAutoUpdateOptions,
  type PositionerPlacement
} from './primitives/positioner';

export function createPortalContainer(id = 'ui-portal-root') {
  if (typeof document === 'undefined') return null;
  let el = document.getElementById(id) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.width = '100%';
    el.style.height = '0';
    el.style.pointerEvents = 'none';
    el.style.zIndex = 'var(--ui-portal-z, 1600)';
    document.body.appendChild(el);
  }
  if (!el.style.zIndex) el.style.zIndex = 'var(--ui-portal-z, 1600)';
  return el;
}

export type Placement = PositionerPlacement;

export type ComputeOptions = {
  placement?: Placement;
  offset?: number; // px gap between anchor and floating
  flip?: boolean; // allow flip when out of viewport
  shift?: boolean; // allow shifting along cross-axis to avoid overflow
  strategy?: 'absolute' | 'fixed';
  boundary?: HTMLElement | null;
  boundaryPadding?: number;
  dir?: 'ltr' | 'rtl';
  autoPlacement?: boolean;
  allowedPlacements?: Placement[];
  fallbackPlacements?: Placement[];
  inline?: boolean;
  hideWhenDetached?: boolean;
  // optional arrow element inside floating content to be positioned by the caller
  arrow?: HTMLElement | null;
};

export type VirtualElement = { getBoundingClientRect: () => DOMRect };

export function computePosition(anchor: HTMLElement | VirtualElement, content: HTMLElement, placementOrOptions: Placement | ComputeOptions = 'top') {
  const opts: ComputeOptions = typeof placementOrOptions === 'string' ? { placement: placementOrOptions } : placementOrOptions;
  const floating = content instanceof HTMLElement
    ? content
    : typeof (content as unknown as { getBoundingClientRect?: () => DOMRect }).getBoundingClientRect === 'function'
      ? (content as unknown as { getBoundingClientRect: () => DOMRect }).getBoundingClientRect()
      : content;
  const state = computePositionState(anchor as PositionerAnchor, floating as HTMLElement, {
    placement: opts.placement || 'top',
    strategy: opts.strategy || 'fixed',
    offset: typeof opts.offset === 'number' ? opts.offset : 8,
    flip: opts.flip,
    shift: opts.shift,
    arrow: opts.arrow ?? null,
    boundary: opts.boundary ?? null,
    boundaryPadding: opts.boundaryPadding,
    dir: opts.dir,
    autoPlacement: opts.autoPlacement,
    allowedPlacements: opts.allowedPlacements,
    fallbackPlacements: opts.fallbackPlacements,
    inline: opts.inline,
    hideWhenDetached: opts.hideWhenDetached
  });
  const anchorRect = (anchor as any).getBoundingClientRect();
  const x = state.middlewareData?.arrow?.x ?? Math.round(anchorRect.left + anchorRect.width / 2 - state.x);
  const y = state.middlewareData?.arrow?.y ?? Math.round(anchorRect.top + anchorRect.height / 2 - state.y);

  return {
    top: state.y,
    left: state.x,
    placement: state.placement,
    x,
    y,
    strategy: state.strategy,
    availableWidth: state.availableWidth,
    availableHeight: state.availableHeight,
    middlewareData: state.middlewareData,
    referenceHidden: state.referenceHidden,
    escaped: state.escaped
  };
}

export function autoUpdatePosition(
  anchor: HTMLElement | VirtualElement,
  contentEl: HTMLElement,
  onChange: () => void,
  options: PositionerAutoUpdateOptions = {}
) {
  return autoUpdatePositioner(anchor as PositionerAnchor, contentEl, onChange, options);
}

export type ShowPortalOptions = {
  placement?: Placement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  strategy?: 'absolute' | 'fixed';
  boundary?: HTMLElement | null;
  boundaryPadding?: number;
  dir?: 'ltr' | 'rtl';
  autoPlacement?: boolean;
  allowedPlacements?: Placement[];
  fallbackPlacements?: Placement[];
  inline?: boolean;
  hideWhenDetached?: boolean;
  arrow?: HTMLElement | null;
};

export function showPortalFor(anchor: HTMLElement | VirtualElement, contentEl: HTMLElement, placementOrOptions: Placement | ShowPortalOptions = 'top') {
  const opts: ShowPortalOptions = typeof placementOrOptions === 'string' ? { placement: placementOrOptions } : placementOrOptions;
  const placement = opts.placement || 'top';
  const offset = typeof opts.offset === 'number' ? opts.offset : 8;
  const doFlip = opts.flip !== false;
  const doShift = !!opts.shift;

  const root = createPortalContainer();
  if (!root) return;
  contentEl.style.position = 'absolute';
  contentEl.style.pointerEvents = 'auto';
  root.appendChild(contentEl);
  let cleanupObservers: () => void = () => {};

  function positionArrow(finalTop: number, finalLeft: number, finalPlacement: Placement) {
    // find an arrow element inside the portal content (common pattern: .arrow)
    const arrowEl = opts.arrow || contentEl.querySelector('.arrow') as HTMLElement | null;
    if (!arrowEl) return;

    const anchorRect = (anchor as any).getBoundingClientRect();
    const anchorCenterX = anchorRect.left + anchorRect.width / 2;
    const anchorCenterY = anchorRect.top + anchorRect.height / 2;

    if (finalPlacement === 'top' || finalPlacement === 'bottom') {
      const arrowX = anchorCenterX - finalLeft; // px from content left
      const min = 8; // padding from edges
      const max = contentEl.offsetWidth - 8;
      const clamped = Math.max(min, Math.min(max, arrowX));
      arrowEl.style.left = `${Math.round(clamped)}px`;
      arrowEl.style.top = '';
    } else {
      const arrowY = anchorCenterY - finalTop; // px from content top
      const min = 8;
      const max = contentEl.offsetHeight - 8;
      const clamped = Math.max(min, Math.min(max, arrowY));
      arrowEl.style.top = `${Math.round(clamped)}px`;
      arrowEl.style.left = '';
    }
  }

  function reposition() {
    // auto-cleanup: if anchor is an HTMLElement and has been removed from DOM or is not visible, teardown
    if (anchor && typeof (anchor as any).getBoundingClientRect === 'function' && anchor instanceof HTMLElement) {
      const el = anchor as HTMLElement;
      const rootNode = el.getRootNode?.();
      const shadowHost = rootNode instanceof ShadowRoot ? rootNode.host : null;
      const inDOM = el.isConnected || document.body.contains(el) || (shadowHost ? document.body.contains(shadowHost) : false);
      const style = window.getComputedStyle(el);
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity || '1') > 0;

      if (!inDOM || !isVisible) {
        try { if (contentEl.parentElement) contentEl.parentElement.removeChild(contentEl); } catch (e) {}
        cleanupObservers();
        return;
      }
    }

    // compute initial position (supports virtual anchor)
    const pos = computePosition(anchor, contentEl, {
      placement,
      offset,
      flip: doFlip,
      shift: doShift,
      strategy: opts.strategy || 'fixed',
      boundary: opts.boundary ?? null,
      boundaryPadding: opts.boundaryPadding,
      dir: opts.dir,
      autoPlacement: opts.autoPlacement,
      allowedPlacements: opts.allowedPlacements,
      fallbackPlacements: opts.fallbackPlacements,
      inline: opts.inline,
      hideWhenDetached: opts.hideWhenDetached,
      arrow: opts.arrow ?? null
    });

    // auto-flip if out of viewport vertically when allowed
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    let final = pos;
    if (doFlip && ((pos.top < 0 && placement === 'top') || (pos.top + contentEl.offsetHeight > vh && placement === 'bottom'))) {
      const altPlacement = placement === 'top' ? 'bottom' : 'top';
      final = computePosition(anchor, contentEl, {
        placement: altPlacement,
        offset,
        flip: doFlip,
        shift: doShift,
        strategy: opts.strategy || 'fixed',
        boundary: opts.boundary ?? null,
        boundaryPadding: opts.boundaryPadding,
        dir: opts.dir,
        autoPlacement: opts.autoPlacement,
        allowedPlacements: opts.allowedPlacements,
        fallbackPlacements: opts.fallbackPlacements,
        inline: opts.inline,
        hideWhenDetached: opts.hideWhenDetached,
        arrow: opts.arrow ?? null
      });
    }

    // clamp horizontally and vertically (keep it on-screen)
    if (final.left < 4) final.left = 4;
    if (final.left + contentEl.offsetWidth > vw - 4) final.left = vw - contentEl.offsetWidth - 4;
    if (final.top < 4) final.top = 4;
    if (final.top + contentEl.offsetHeight > vh - 4) final.top = vh - contentEl.offsetHeight - 4;

    contentEl.style.top = `${Math.round(final.top)}px`;
    contentEl.style.left = `${Math.round(final.left)}px`;

    // position arrow (if present)
    positionArrow(final.top, final.left, final.placement);

    // add data-placement attribute for CSS hooks
    contentEl.setAttribute('data-placement', final.placement);
  }

  reposition();
  cleanupObservers = autoUpdatePosition(anchor, contentEl, reposition);

  return () => {
    try { if (contentEl.parentElement) contentEl.parentElement.removeChild(contentEl); } catch (e) {}
    cleanupObservers();
  };
}
