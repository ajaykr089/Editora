/**
 * The maths of keeping the source and the preview scrolled to the same place.
 *
 * Scrolling by proportion drifts as soon as the two panes are not the same shape: a code block or a table
 * is taller than its source, a long paragraph wraps to more rows. Instead each top-level block of the
 * preview is an anchor (the line of the markdown it starts on, and where it is in the preview), and
 * positions between two anchors are interpolated. Everything here is plain numbers, so it is tested without
 * a layout engine.
 */

export interface Anchor {
  /** 0-based line of the markdown the block starts on. */
  line: number;
  /** Where the block starts, in the preview's scroll coordinates (pixels from the top of its content). */
  top: number;
}

/** The anchors with the ends of the document added, so every position lies between two of them. */
function withEnds(anchors: Anchor[], totalLines: number, contentHeight: number): Anchor[] {
  const points = anchors.slice();
  if (points.length === 0 || points[0].line > 0 || points[0].top > 0) points.unshift({ line: 0, top: 0 });
  const last = points[points.length - 1];
  if (last.line < totalLines || last.top < contentHeight) {
    points.push({ line: Math.max(totalLines, last.line), top: Math.max(contentHeight, last.top) });
  }
  return points;
}

function interpolate(points: Anchor[], key: 'line' | 'top', value: number): number {
  const other = key === 'line' ? 'top' : 'line';
  if (value <= points[0][key]) return points[0][other];
  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1];
    const to = points[i];
    if (value <= to[key]) {
      const span = to[key] - from[key];
      return span <= 0 ? from[other] : from[other] + ((value - from[key]) / span) * (to[other] - from[other]);
    }
  }
  return points[points.length - 1][other];
}

/** Where in the preview a (possibly fractional) line of the source is. */
export function previewTopForLine(anchors: Anchor[], line: number, totalLines: number, contentHeight: number): number {
  return interpolate(withEnds(anchors, totalLines, contentHeight), 'line', line);
}

/** The (possibly fractional) line of the source that is at a position in the preview. */
export function lineForPreviewTop(anchors: Anchor[], top: number, totalLines: number, contentHeight: number): number {
  return interpolate(withEnds(anchors, totalLines, contentHeight), 'top', top);
}
