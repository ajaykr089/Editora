import { resolveIcon } from './registry';
import type { IconAttrValue, IconNode, IconRenderOptions, IconWeight } from './types';

const DEFAULT_SIZE = 15;
const DEFAULT_STROKE_WIDTH = 1.5;
const STROKE_WIDTH_BY_WEIGHT: Record<IconWeight, number> = {
  thin: 1.25,
  regular: DEFAULT_STROKE_WIDTH,
  bold: 1.75,
};

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseViewBoxSize(viewBox: string): { width: number; height: number } {
  const parts = viewBox
    .trim()
    .split(/\s+/)
    .map((part) => Number(part));
  if (parts.length === 4 && Number.isFinite(parts[2]) && Number.isFinite(parts[3])) {
    return { width: parts[2], height: parts[3] };
  }
  return { width: 24, height: 24 };
}

function normalizeSize(size: IconRenderOptions['size']): string {
  if (size == null || size === '') return String(DEFAULT_SIZE);
  if (typeof size === 'number') return String(size);
  const trimmed = size.trim();
  if (!trimmed) return String(DEFAULT_SIZE);
  if (/^\d+(\.\d+)?$/.test(trimmed)) return trimmed;
  return trimmed;
}

function resolveStrokeWidth(options: IconRenderOptions, viewBox: string): number {
  const raw =
    options.strokeWidth ??
    (options.iconWeight ? STROKE_WIDTH_BY_WEIGHT[options.iconWeight] : DEFAULT_STROKE_WIDTH);
  if (!options.absoluteStrokeWidth) return raw;

  const size = Number(options.size ?? DEFAULT_SIZE);
  if (!Number.isFinite(size) || size <= 0) return raw;
  const { width } = parseViewBoxSize(viewBox);
  if (!Number.isFinite(width) || width <= 0) return raw;
  return (raw * width) / size;
}

function computeTransform(options: IconRenderOptions, viewBox: string): string | undefined {
  const { width, height } = parseViewBoxSize(viewBox);
  const transforms: string[] = [];

  const flip = options.flip;
  const shouldMirror = options.rtl;

  if (flip === 'horizontal' || shouldMirror) transforms.push(`translate(${width} 0) scale(-1 1)`);
  if (flip === 'vertical') transforms.push(`translate(0 ${height}) scale(1 -1)`);
  if (flip === 'both') transforms.push(`translate(${width} ${height}) scale(-1 -1)`);

  if (typeof options.rotate === 'number' && Number.isFinite(options.rotate) && options.rotate !== 0) {
    transforms.push(`rotate(${options.rotate} ${width / 2} ${height / 2})`);
  }

  if (!transforms.length) return undefined;
  return transforms.join(' ');
}

function attrToString(key: string, value: IconAttrValue): string {
  if (value == null) return '';
  if (typeof value === 'boolean') return value ? ` ${toKebabCase(key)}` : '';
  return ` ${toKebabCase(key)}="${escapeText(String(value))}"`;
}

function renderNode(
  node: IconNode,
  options: { color: string; secondaryColor: string; strokeWidth: number; strokeLinecap: string; strokeLinejoin: string }
): string {
  const attrs = { ...(node.attrs || {}) };

  const tone = String((attrs as Record<string, unknown>).tone || '');
  delete (attrs as Record<string, unknown>).tone;

  if (tone === 'secondary') {
    if (attrs.fill === 'currentColor') attrs.fill = options.secondaryColor;
    if (attrs.stroke === 'currentColor') attrs.stroke = options.secondaryColor;
  }

  const hasNoVisibleFill = attrs.fill == null || attrs.fill === 'none' || attrs.fill === 'transparent';
  if (attrs.stroke == null && hasNoVisibleFill && node.tag !== 'g') {
    attrs.stroke = 'currentColor';
    attrs.fill = 'none';
  }

  if (attrs.stroke != null && attrs.strokeWidth == null) {
    attrs.strokeWidth = options.strokeWidth;
  }

  if (attrs.stroke != null && attrs.vectorEffect == null) {
    attrs.vectorEffect = 'non-scaling-stroke';
  }

  if (attrs.stroke != null && attrs.strokeLinecap == null) {
    attrs.strokeLinecap = options.strokeLinecap;
  }

  if (attrs.stroke != null && attrs.strokeLinejoin == null) {
    attrs.strokeLinejoin = options.strokeLinejoin;
  }

  let attrText = '';
  for (const [key, value] of Object.entries(attrs)) {
    attrText += attrToString(key, value);
  }

  const children = node.children || [];
  const childText = children.map((child) => renderNode(child, options)).join('');
  return `<${node.tag}${attrText}>${childText}</${node.tag}>`;
}

export function renderIconSvg(name: string, options: IconRenderOptions = {}): string {
  const variant = options.variant || 'outline';
  const resolved = resolveIcon(name, variant);
  if (!resolved) return '';

  const decorative = options.decorative ?? (!options.title && !options.ariaLabel);
  const title = options.title ? `<title>${escapeText(options.title)}</title>` : '';
  const ariaLabel = options.ariaLabel || options.title || resolved.definition.name;

  const size = normalizeSize(options.size);
  const color = options.color || 'currentColor';
  const secondaryColor = options.secondaryColor || color;
  const strokeWidth = resolveStrokeWidth(options, resolved.viewBox);
  const strokeLinecap = options.strokeLinecap || 'round';
  const strokeLinejoin = options.strokeLinejoin || 'round';

  const transform = computeTransform({ ...options, rtl: options.rtl && resolved.definition.rtlMirror }, resolved.viewBox);
  const nodes = resolved.glyph.nodes.map((node) => renderNode(node, { color, secondaryColor, strokeWidth, strokeLinecap, strokeLinejoin })).join('');
  const body = transform ? `<g transform="${escapeText(transform)}">${nodes}</g>` : nodes;

  let extraAttrs = '';
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      extraAttrs += attrToString(key, value);
    }
  }

  const classAttr = options.className ? ` class="${escapeText(options.className)}"` : '';
  const styleAttr = options.style ? ` style="${escapeText(options.style)}"` : '';
  const a11yAttrs = decorative
    ? ' aria-hidden="true" role="presentation"'
    : ` role="img" aria-label="${escapeText(ariaLabel)}"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${escapeText(size)}" height="${escapeText(size)}" viewBox="${escapeText(resolved.viewBox)}" fill="none" color="${escapeText(color)}" overflow="visible" shape-rendering="geometricPrecision"${classAttr}${styleAttr}${a11yAttrs}${extraAttrs}>${title}${body}</svg>`;
}

export function iconToDataUri(name: string, options: IconRenderOptions = {}): string {
  const svg = renderIconSvg(name, options);
  if (!svg) return '';
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
