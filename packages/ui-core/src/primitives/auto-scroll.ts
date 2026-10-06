// Edge auto-scroll for drag and drop: while a dragged item is held near the top or bottom of the
// scrollable area, the area should scroll so that off-screen lists and positions can be reached.

/**
 * Per-frame scroll step for a pointer at `position` inside the span [start, end]: negative near
 * the start, positive near the end, 0 elsewhere. The step grows linearly from 0 at the edge of the
 * `zone` to `maxStep` at the very edge, and the zone never exceeds half the span.
 */
export function edgeScrollDelta(position: number, start: number, end: number, zone = 56, maxStep = 18): number {
  if (!Number.isFinite(position) || !(end > start)) return 0;
  const size = Math.min(zone, (end - start) / 2);
  if (size <= 0) return 0;
  if (position < start + size) return -Math.ceil(maxStep * Math.min(1, (start + size - position) / size));
  if (position > end - size) return Math.ceil(maxStep * Math.min(1, (position - (end - size)) / size));
  return 0;
}

const SCROLLABLE_OVERFLOW = new Set(['auto', 'scroll', 'overlay']);

/** The nearest ancestor (crossing shadow roots) that scrolls vertically, or null for the page. */
export function findScrollParent(element: Element | null): HTMLElement | null {
  let node: Node | null = element;
  while (node) {
    node = node.parentNode instanceof ShadowRoot ? node.parentNode.host : node.parentNode;
    if (!(node instanceof HTMLElement)) continue;
    if (node === node.ownerDocument.body || node === node.ownerDocument.documentElement) return null;
    const { overflowY } = node.ownerDocument.defaultView?.getComputedStyle(node) ?? { overflowY: '' };
    if (SCROLLABLE_OVERFLOW.has(overflowY) && node.scrollHeight > node.clientHeight) return node;
  }
  return null;
}
