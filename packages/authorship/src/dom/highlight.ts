/**
 * Shade text by origin without touching the editor's DOM: CSS Custom
 * Highlights where supported, an overlay of rectangles otherwise. Hovering
 * shaded text shows where it came from.
 */
import type { Origin, OriginKind } from '../core/types.js';
import type { AuthorshipController } from './attach.js';
import { describeOrigin, formatTime, mergeLabels, type AuthorshipLabels } from './labels.js';
import { applyTheme, DEFAULT_HIGHLIGHT_KINDS, ensureStyles, HIGHLIGHT_PREFIX } from './styles.js';
import { rangeFor } from './text.js';

export interface HighlighterOptions {
  /** Kinds to shade (default pasted, AI, collaborator, tool, external). */
  kinds?: OriginKind[];
  /** Show a tooltip over shaded text (default true). */
  tooltip?: boolean;
  labels?: Partial<AuthorshipLabels>;
  /** Force the overlay fallback (for tests and old browsers). */
  overlay?: boolean;
}

export interface Highlighter {
  readonly visible: boolean;
  readonly kinds: OriginKind[];
  show(): void;
  hide(): void;
  setKinds(kinds: OriginKind[]): void;
  refresh(): void;
  destroy(): void;
}

type HighlightRegistry = Map<string, unknown> & { delete(name: string): boolean };

function registry(): HighlightRegistry | null {
  const css = (globalThis as { CSS?: { highlights?: HighlightRegistry } }).CSS;
  return css?.highlights && typeof (globalThis as { Highlight?: unknown }).Highlight === 'function' ? css.highlights : null;
}

// CSS highlights are global to the document: every highlighter's ranges are merged per kind.
const published = new Map<object, Map<OriginKind, Range[]>>();

function publish(highlights: HighlightRegistry): void {
  const HighlightCtor = (globalThis as unknown as { Highlight: new (...ranges: Range[]) => unknown }).Highlight;
  const union = new Map<OriginKind, Range[]>();
  for (const byKind of published.values()) for (const [kind, list] of byKind) union.set(kind, [...(union.get(kind) ?? []), ...list]);
  for (const kind of ['typed', 'pasted', 'ai', 'collaborator', 'tool', 'external', 'existing'] as OriginKind[]) {
    const list = union.get(kind);
    if (list?.length) highlights.set(HIGHLIGHT_PREFIX + kind, new HighlightCtor(...list));
    else highlights.delete(HIGHLIGHT_PREFIX + kind);
  }
}

/** Character offset under a viewport point, or null when the point is not over text. */
function caretAt(doc: Document, x: number, y: number): { node: Node; offset: number } | null {
  const anyDoc = doc as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  if (anyDoc.caretPositionFromPoint) {
    const position = anyDoc.caretPositionFromPoint(x, y);
    return position ? { node: position.offsetNode, offset: position.offset } : null;
  }
  const range = anyDoc.caretRangeFromPoint?.(x, y);
  return range ? { node: range.startContainer, offset: range.startOffset } : null;
}

export function createHighlighter(controller: AuthorshipController, options: HighlighterOptions = {}): Highlighter {
  const root = controller.root;
  const doc = root.ownerDocument;
  const win = doc.defaultView ?? window;
  const labels = mergeLabels(options.labels);
  const highlights = options.overlay ? null : registry();
  let kinds = [...(options.kinds ?? DEFAULT_HIGHLIGHT_KINDS)];
  let visible = false;
  let frame = 0;
  let overlay: HTMLElement | null = null;
  let tooltip: HTMLElement | null = null;
  let ranges: Array<{ range: Range; origin: Origin }> = [];
  const token = {};

  const clear = () => {
    if (highlights && published.delete(token)) publish(highlights);
    overlay?.replaceChildren();
    ranges = [];
  };

  const paint = () => {
    frame = 0;
    clear();
    if (!visible) return;
    const map = controller.getMap();
    const origins = controller.getOrigins();
    const byKind = new Map<OriginKind, Range[]>();
    let pos = 0;
    for (const [length, id] of controller.getRuns()) {
      const origin = origins[id];
      if (origin && kinds.includes(origin.kind)) {
        const range = rangeFor(map, pos, pos + length);
        if (range) {
          ranges.push({ range, origin });
          if (!byKind.has(origin.kind)) byKind.set(origin.kind, []);
          byKind.get(origin.kind)!.push(range);
        }
      }
      pos += length;
    }
    if (highlights) {
      published.set(token, byKind);
      publish(highlights);
      return;
    }
    if (!overlay) {
      overlay = doc.createElement('div');
      overlay.className = 'eda-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      doc.body.appendChild(overlay);
    }
    const bounds = root.getBoundingClientRect();
    for (const { range, origin } of ranges) {
      for (const rect of Array.from(range.getClientRects())) {
        if (rect.bottom < bounds.top || rect.top > bounds.bottom || rect.width === 0) continue;
        const box = doc.createElement('div');
        box.className = `eda-overlay-${origin.kind}`;
        box.style.cssText = `left:${rect.left}px;top:${Math.max(rect.top, bounds.top)}px;width:${rect.width}px;height:${Math.min(rect.bottom, bounds.bottom) - Math.max(rect.top, bounds.top)}px`;
        overlay.appendChild(box);
      }
    }
  };

  const schedule = () => {
    if (!visible || frame) return;
    frame = win.requestAnimationFrame(paint);
  };

  const hideTooltip = () => {
    if (tooltip) tooltip.hidden = true;
  };

  const onMove = (event: MouseEvent) => {
    if (!visible || options.tooltip === false) return;
    const point = caretAt(doc, event.clientX, event.clientY);
    const hit = point
      ? ranges.find(({ range }) => {
          try {
            if (!range.isPointInRange(point.node, point.offset)) return false;
          } catch {
            return false;
          }
          return Array.from(range.getClientRects()).some((rect) => event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom);
        })
      : undefined;
    if (!hit) return hideTooltip();
    if (!tooltip) {
      tooltip = doc.createElement('div');
      tooltip.className = 'eda-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      doc.body.appendChild(tooltip);
    }
    applyTheme(tooltip, root);
    const origin = hit.origin;
    const who = origin.author ? `${origin.author} · ` : '';
    tooltip.innerHTML = '';
    const title = doc.createElement('b');
    title.textContent = describeOrigin(origin, labels);
    const meta = doc.createElement('span');
    meta.textContent = `${who}${formatTime(origin.t)}${origin.kind === 'pasted' && origin.label ? ` · ${origin.label}` : ''}`;
    tooltip.append(title, meta);
    tooltip.hidden = false;
    const width = tooltip.offsetWidth;
    tooltip.style.left = `${Math.min(event.clientX + 12, win.innerWidth - width - 8)}px`;
    tooltip.style.top = `${event.clientY + 16}px`;
  };

  ensureStyles(doc);
  const offChange = controller.on('change', schedule);
  root.addEventListener('mousemove', onMove);
  root.addEventListener('mouseleave', hideTooltip);
  win.addEventListener('resize', schedule);
  win.addEventListener('scroll', schedule, true);

  return {
    get visible() {
      return visible;
    },
    get kinds() {
      return [...kinds];
    },
    show() {
      visible = true;
      paint();
    },
    hide() {
      visible = false;
      hideTooltip();
      clear();
    },
    setKinds(next) {
      kinds = [...next];
      if (visible) paint();
    },
    refresh: () => (visible ? paint() : undefined),
    destroy() {
      visible = false;
      if (frame) win.cancelAnimationFrame(frame);
      clear();
      offChange();
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', hideTooltip);
      win.removeEventListener('resize', schedule);
      win.removeEventListener('scroll', schedule, true);
      overlay?.remove();
      tooltip?.remove();
    },
  };
}
