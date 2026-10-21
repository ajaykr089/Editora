/**
 * Open and close motion, state hooks and top-layer promotion for floating surfaces
 * (popovers, menus, dialogs...). The surface carries:
 *
 *   data-ui-overlay             marks it so the shared CSS applies
 *   data-state="open|closed"    what it is doing (also what Radix exposes)
 *   data-side / data-align      set by the positioner, used to slide in from the right edge
 *
 * Opening plays an enter animation. Closing plays an exit animation and only then removes the
 * surface, so it does not vanish with a pop. With reduced motion, or without CSS animation
 * support (jsdom), closing is immediate, so callers can treat `closeOverlay` as synchronous there.
 */

/** Put this in the shadow or portal stylesheet of every surface that uses the helpers below. */
export const OVERLAY_MOTION_CSS = `
  [data-ui-overlay] {
    --ui-overlay-shift: 4px;
    --ui-overlay-from: translate3d(0, 0, 0);
    --ui-overlay-ox: center;
    --ui-overlay-oy: center;
    transform-origin: var(--ui-overlay-ox) var(--ui-overlay-oy);
  }

  [data-ui-overlay][data-side="top"] { --ui-overlay-from: translate3d(0, var(--ui-overlay-shift), 0); --ui-overlay-oy: bottom; }
  [data-ui-overlay][data-side="bottom"] { --ui-overlay-from: translate3d(0, calc(var(--ui-overlay-shift) * -1), 0); --ui-overlay-oy: top; }
  [data-ui-overlay][data-side="left"] { --ui-overlay-from: translate3d(var(--ui-overlay-shift), 0, 0); --ui-overlay-ox: right; }
  [data-ui-overlay][data-side="right"] { --ui-overlay-from: translate3d(calc(var(--ui-overlay-shift) * -1), 0, 0); --ui-overlay-ox: left; }
  [data-ui-overlay][data-align="start"][data-side="top"],
  [data-ui-overlay][data-align="start"][data-side="bottom"] { --ui-overlay-ox: left; }
  [data-ui-overlay][data-align="end"][data-side="top"],
  [data-ui-overlay][data-align="end"][data-side="bottom"] { --ui-overlay-ox: right; }
  [data-ui-overlay][data-align="start"][data-side="left"],
  [data-ui-overlay][data-align="start"][data-side="right"] { --ui-overlay-oy: top; }
  [data-ui-overlay][data-align="end"][data-side="left"],
  [data-ui-overlay][data-align="end"][data-side="right"] { --ui-overlay-oy: bottom; }

  [data-ui-overlay][data-state="open"] {
    animation: ui-overlay-in var(--ui-overlay-in-duration, 150ms) var(--ui-motion-enter-easing, cubic-bezier(0.16, 1, 0.3, 1)) backwards;
  }

  [data-ui-overlay][data-instant][data-state="open"] {
    animation: none;
  }

  [data-ui-overlay][data-state="closed"] {
    animation: ui-overlay-out var(--ui-overlay-out-duration, 100ms) var(--ui-motion-exit-easing, cubic-bezier(0.4, 0, 1, 1)) both;
    pointer-events: none;
  }

  @keyframes ui-overlay-in {
    from { opacity: 0; transform: var(--ui-overlay-from) scale(0.96); }
    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }

  @keyframes ui-overlay-out {
    from { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
    to { opacity: 0; transform: var(--ui-overlay-from) scale(0.96); }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-ui-overlay][data-state] { animation: none !important; }
  }
`;

const supportsPopover = (): boolean =>
  typeof HTMLElement !== 'undefined' && typeof (HTMLElement.prototype as { showPopover?: unknown }).showPopover === 'function';

/**
 * Promote the surface to the browser's top layer, above every z-index on the page. The surface
 * must already be in the document. Browsers without the Popover API keep their z-index stacking.
 * `popover="manual"` adds no light dismiss or Escape handling; the component keeps its own.
 */
export function liftToTopLayer(el: HTMLElement, options: { resetBox?: boolean } = {}): void {
  if (!supportsPopover() || !el.isConnected) return;
  try {
    if (!el.hasAttribute('popover')) el.setAttribute('popover', 'manual');
    // The popover UA style centres and pads the box; the positioner owns left and top. A surface
    // that styles its own box (a dialog overlay) passes resetBox: false and handles this in CSS.
    if (options.resetBox !== false) {
      el.style.setProperty('right', 'auto');
      el.style.setProperty('bottom', 'auto');
      el.style.setProperty('margin', '0');
      el.style.setProperty('border', '0');
      el.style.setProperty('padding', '0');
      el.style.setProperty('overflow', 'visible');
      el.style.setProperty('background', 'transparent');
      el.style.setProperty('color', 'inherit');
    }
    if (!el.matches(':popover-open')) (el as HTMLElement & { showPopover(): void }).showPopover();
  } catch {
    // Not supported for this element (for example an invalid popover state): stay in the z-index stack.
  }
}

export function openOverlay(el: HTMLElement, options: { topLayer?: boolean; animate?: boolean } = {}): void {
  el.setAttribute('data-ui-overlay', '');
  // A surface that is rebuilt while open (its content changed) must not replay the enter animation.
  if (options.animate === false) el.setAttribute('data-instant', '');
  el.setAttribute('data-state', 'open');
  if (options.topLayer !== false) liftToTopLayer(el);
}

function animationTimeMs(el: HTMLElement): number | null {
  if (typeof getComputedStyle !== 'function') return null;
  const cs = getComputedStyle(el);
  const names = (cs.animationName || '').split(',').map((s) => s.trim());
  if (!names.length || names.every((n) => !n || n === 'none')) return null;
  const toMs = (v: string) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? (/ms\s*$/.test(v) ? n : n * 1000) : 0;
  };
  const durations = (cs.animationDuration || '0s').split(',').map(toMs);
  const delays = (cs.animationDelay || '0s').split(',').map(toMs);
  return Math.max(0, ...durations.map((d, i) => d + (delays[i] ?? delays[0] ?? 0)));
}

/**
 * Play the exit, then call `done` once (normally to remove the surface). Returns a function that
 * finishes straight away. Without an exit animation `done` runs before this returns.
 */
export function closeOverlay(el: HTMLElement, done: () => void): () => void {
  el.setAttribute('data-ui-overlay', '');
  el.setAttribute('data-state', 'closed');
  const ms = animationTimeMs(el);
  if (ms === null || ms <= 0) {
    done();
    return () => {};
  }
  let finished = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (timer) clearTimeout(timer);
    el.removeEventListener('animationend', onEnd);
    el.removeEventListener('animationcancel', onEnd);
    done();
  };
  const onEnd = (event: Event) => {
    if (event.target === el) finish();
  };
  el.addEventListener('animationend', onEnd);
  el.addEventListener('animationcancel', onEnd);
  timer = setTimeout(finish, ms + 60);
  return finish;
}

/** Remove a surface now, with no exit animation (for example when its owner is removed). */
export function removeOverlay(el: HTMLElement | null | undefined): void {
  if (!el) return;
  try {
    if (el.parentElement) el.parentElement.removeChild(el);
  } catch {
    // already gone
  }
}

/** Play the exit and remove the surface afterwards. */
export function retireOverlay(el: HTMLElement | null | undefined): void {
  if (!el) return;
  closeOverlay(el, () => removeOverlay(el));
}

/** `bottom-start` -> { side: 'bottom', align: 'start' }. */
export function splitPlacement(placement: string): { side: string; align: string } {
  const [side, align] = placement.split('-');
  return { side: side || 'bottom', align: align || 'center' };
}

const pendingPanelClose = new WeakMap<HTMLElement, () => void>();

/**
 * Show or hide a panel that stays in its owner's shadow tree and is toggled with `hidden`
 * (select, dropdown, combobox...). Safe to call on every render: it only acts on a change.
 * Hiding plays the exit first, so `hidden` becomes true a moment later, or at once without animation.
 */
export function setPanelOpen(panel: HTMLElement, open: boolean, side?: string): void {
  if (side) panel.setAttribute('data-side', side);
  pendingPanelClose.get(panel)?.();
  pendingPanelClose.delete(panel);
  panel.setAttribute('data-ui-overlay', '');
  if (open) {
    const wasHidden = panel.hidden;
    panel.hidden = false;
    if (wasHidden || panel.getAttribute('data-state') !== 'open') panel.setAttribute('data-state', 'open');
    return;
  }
  if (panel.hidden) {
    panel.setAttribute('data-state', 'closed');
    return;
  }
  pendingPanelClose.set(
    panel,
    closeOverlay(panel, () => {
      pendingPanelClose.delete(panel);
      panel.hidden = true;
    })
  );
}
