// Built-in status icons. Outlined, one shape per level, so a toast is never told apart by colour alone.
// They are drawn with currentColor; the stylesheet colours them from the level's accent.

const SVG_NS = 'http://www.w3.org/2000/svg';

type Shape = ReadonlyArray<readonly [tag: 'circle' | 'path', attrs: Record<string, string>]>;

const SHAPES: Record<string, Shape> = {
  success: [
    ['circle', { cx: '10', cy: '10', r: '8' }],
    ['path', { d: 'M6.6 10.3l2.3 2.3 4.5-4.9' }]
  ],
  error: [
    ['circle', { cx: '10', cy: '10', r: '8' }],
    ['path', { d: 'M7.6 7.6l4.8 4.8M12.4 7.6l-4.8 4.8' }]
  ],
  warning: [
    ['path', { d: 'M10 2.9L18 16.4H2L10 2.9z' }],
    ['path', { d: 'M10 8.3v3.4M10 13.9v.1' }]
  ],
  info: [
    ['circle', { cx: '10', cy: '10', r: '8' }],
    ['path', { d: 'M10 9.2v4.4M10 6.5v.1' }]
  ],
  loading: [['path', { d: 'M10 2a8 8 0 1 0 8 8' }]]
};

const LEVEL_SHAPE: Record<string, string> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  loading: 'loading',
  promise: 'loading'
};

function createSvg(shape: Shape, size: number): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.7');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  shape.forEach(([tag, attrs]) => {
    const node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach((name) => node.setAttribute(name, attrs[name]));
    svg.appendChild(node);
  });
  return svg;
}

// The default icon for a level, or null for levels without one (custom, progress).
export function createLevelIcon(level: string | undefined): SVGSVGElement | null {
  const shape = SHAPES[LEVEL_SHAPE[level || 'info'] || ''];
  return shape ? createSvg(shape, 18) : null;
}

export function createCloseIcon(): SVGSVGElement {
  const svg = createSvg([['path', { d: 'M5.5 5.5l9 9M14.5 5.5l-9 9' }]], 14);
  svg.setAttribute('stroke-width', '1.8');
  return svg;
}
