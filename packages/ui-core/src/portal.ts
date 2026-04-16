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

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export type ComputeOptions = {
  placement?: Placement;
  offset?: number; // px gap between anchor and floating
  flip?: boolean; // allow flip when out of viewport
  shift?: boolean; // allow shifting along cross-axis to avoid overflow
  // optional arrow element inside floating content to be positioned by the caller
  arrow?: HTMLElement | null;
};

export type VirtualElement = { getBoundingClientRect: () => DOMRect };

export function computePosition(anchor: HTMLElement | VirtualElement, content: HTMLElement, placementOrOptions: Placement | ComputeOptions = 'top') {
  const opts: ComputeOptions = typeof placementOrOptions === 'string' ? { placement: placementOrOptions } : placementOrOptions;
  const placement = opts.placement || 'top';
  const offset = typeof opts.offset === 'number' ? opts.offset : 8;
  const doShift = !!opts.shift;

  // accept either a DOM element or a virtual element (useful for mouse coordinates)
  const a = (anchor as any).getBoundingClientRect();
  const c = content.getBoundingClientRect();
  let top = 0, left = 0;

  // center by default (will be clamped/shifted later if needed)
  // Coordinates are viewport-relative because portal root is fixed to viewport.
  if (placement === 'top') {
    top = a.top - c.height - offset;
    left = a.left + (a.width - c.width) / 2;
  } else if (placement === 'bottom') {
    top = a.bottom + offset;
    left = a.left + (a.width - c.width) / 2;
  } else if (placement === 'left') {
    top = a.top + (a.height - c.height) / 2;
    left = a.left - c.width - offset;
  } else {
    top = a.top + (a.height - c.height) / 2;
    left = a.right + offset;
  }

  // compute cross-axis offsets useful for arrow positioning
  const anchorCenterX = a.left + a.width / 2;
  const anchorCenterY = a.top + a.height / 2;
  const x = Math.round(anchorCenterX - left); // horizontal distance from content left -> anchor center
  const y = Math.round(anchorCenterY - top);  // vertical distance from content top -> anchor center

  // apply simple "shift" behavior: nudge the floating element along cross-axis so the anchor stays visible
  if (doShift) {
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // shift horizontally for top/bottom placements
    if (placement === 'top' || placement === 'bottom') {
      const minLeft = 4;
      const maxLeft = vw - c.width - 4;
      if (left < minLeft) left = Math.min(maxLeft, left + (minLeft - left));
      if (left > maxLeft) left = Math.max(minLeft, left - (left - maxLeft));
    } else {
      // shift vertically for left/right placements
      const minTop = 4;
      const maxTop = vh - c.height - 4;
      if (top < minTop) top = Math.min(maxTop, top + (minTop - top));
      if (top > maxTop) top = Math.max(minTop, top - (top - maxTop));
    }
  }

  return { top, left, placement, x, y };
}

export function autoUpdatePosition(anchor: HTMLElement, contentEl: HTMLElement, onChange: () => void) {
  // keep positioning responsive: observe size/position changes and window events
  let ro1: ResizeObserver | null = null;
  let ro2: ResizeObserver | null = null;
  let mo: MutationObserver | null = null;
  let raf = 0;
  const handlers: Array<() => void> = [];

  const schedule = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      onChange();
    });
  };
  const onScrollOrResize = () => schedule();

  if (typeof ResizeObserver !== 'undefined') {
    ro1 = new ResizeObserver(schedule);
    ro2 = new ResizeObserver(schedule);
    try { ro1.observe(anchor); } catch (e) {}
    try { ro2.observe(contentEl); } catch (e) {}
  }

  if (typeof MutationObserver !== 'undefined') {
    mo = new MutationObserver(schedule);
    // ResizeObserver already tracks geometry changes. Restrict mutation observation to
    // top-level anchor attribute mutations to avoid high-frequency subtree churn.
    try { mo.observe(anchor, { attributes: true, childList: false, subtree: false }); } catch (e) {}
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true, capture: true });
  window.addEventListener('resize', onScrollOrResize);

  handlers.push(() => window.removeEventListener('scroll', onScrollOrResize, true));
  handlers.push(() => window.removeEventListener('resize', onScrollOrResize));
  handlers.push(() => { ro1 && ro1.disconnect(); ro1 = null; });
  handlers.push(() => { ro2 && ro2.disconnect(); ro2 = null; });
  handlers.push(() => { mo && mo.disconnect(); mo = null; });
  handlers.push(() => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });

  return () => handlers.forEach(h => { try { h(); } catch (e) {} });
}

export type ShowPortalOptions = {
  placement?: Placement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
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
    const arrowEl = contentEl.querySelector('.arrow') as HTMLElement | null;
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
    const pos = computePosition(anchor, contentEl, { placement, offset, shift: doShift });

    // auto-flip if out of viewport vertically when allowed
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    let final = pos;
    if (doFlip && ((pos.top < 0 && placement === 'top') || (pos.top + contentEl.offsetHeight > vh && placement === 'bottom'))) {
      const altPlacement = placement === 'top' ? 'bottom' : 'top';
      final = computePosition(anchor, contentEl, { placement: altPlacement, offset, shift: doShift });
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
  cleanupObservers = autoUpdatePosition(anchor as HTMLElement, contentEl, reposition);

  return () => {
    try { if (contentEl.parentElement) contentEl.parentElement.removeChild(contentEl); } catch (e) {}
    cleanupObservers();
  };
}
