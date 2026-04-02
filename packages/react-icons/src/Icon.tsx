import React from 'react';
import { resolveIcon } from '@editora/icons';
import type { IconNode } from '@editora/icons';
import type { IconWeight } from '@editora/icons';
import { useIconContext } from './IconContext';
import type { IconProps } from './types';

const DEFAULT_SIZE = 15;
const DEFAULT_STROKE_WIDTH = 1.5;
const STROKE_WIDTH_BY_WEIGHT: Record<IconWeight, number> = {
  thin: 1.25,
  regular: DEFAULT_STROKE_WIDTH,
  bold: 1.75,
};

function normalizeSize(size: string | number | undefined): string | number {
  if (size == null || size === '') return DEFAULT_SIZE;
  return size;
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

function resolveStrokeWidth(
  options: {
    strokeWidth?: number;
    defaultStrokeWidth?: number;
    iconWeight?: IconWeight;
    absoluteStrokeWidth?: boolean;
    size?: number | string;
  },
  viewBox: string
): number {
  const raw =
    options.strokeWidth ??
    (options.iconWeight ? STROKE_WIDTH_BY_WEIGHT[options.iconWeight] : undefined) ??
    options.defaultStrokeWidth ??
    DEFAULT_STROKE_WIDTH;
  if (!options.absoluteStrokeWidth) return raw;

  const pixelSize = Number(options.size ?? DEFAULT_SIZE);
  if (!Number.isFinite(pixelSize) || pixelSize <= 0) return raw;

  const { width } = parseViewBoxSize(viewBox);
  if (!Number.isFinite(width) || width <= 0) return raw;

  return (raw * width) / pixelSize;
}

function computeTransform(options: { rotate?: number; flip?: 'horizontal' | 'vertical' | 'both'; rtl?: boolean }, viewBox: string): string | undefined {
  const { width, height } = parseViewBoxSize(viewBox);
  const transforms: string[] = [];

  if (options.flip === 'horizontal' || options.rtl) transforms.push(`translate(${width} 0) scale(-1 1)`);
  if (options.flip === 'vertical') transforms.push(`translate(0 ${height}) scale(1 -1)`);
  if (options.flip === 'both') transforms.push(`translate(${width} ${height}) scale(-1 -1)`);

  if (typeof options.rotate === 'number' && Number.isFinite(options.rotate) && options.rotate !== 0) {
    transforms.push(`rotate(${options.rotate} ${width / 2} ${height / 2})`);
  }

  if (!transforms.length) return undefined;
  return transforms.join(' ');
}

function toReactAttrName(key: string): string {
  if (key === 'class') return 'className';
  return key.replace(/-([a-z])/g, (_, part: string) => part.toUpperCase());
}

function mergeClassName(a?: string, b?: string): string | undefined {
  if (a && b) return `${a} ${b}`;
  return a || b;
}

type NodeRenderOptions = {
  secondaryColor: string;
  strokeWidth: number;
  strokeLinecap: 'butt' | 'round' | 'square';
  strokeLinejoin: 'miter' | 'round' | 'bevel';
};

function normalizeNodeAttrs(node: IconNode, options: NodeRenderOptions): Record<string, unknown> {
  const attrs = { ...(node.attrs || {}) } as Record<string, unknown>;

  const tone = String(attrs.tone || '');
  delete attrs.tone;

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

  return attrs;
}

function renderNode(node: IconNode, index: number, options: NodeRenderOptions): React.ReactElement {
  const attrs = normalizeNodeAttrs(node, options);

  const props: Record<string, unknown> = { key: `${node.tag}-${index}` };
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    props[toReactAttrName(key)] = value;
  }

  const children = (node.children || []).map((child, childIndex) => renderNode(child, childIndex, options));
  return React.createElement(node.tag, props, children.length ? children : undefined);
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
  {
    name,
    variant,
    size,
    iconWeight,
    color,
    secondaryColor,
    strokeWidth,
    absoluteStrokeWidth,
    strokeLinecap,
    strokeLinejoin,
    decorative,
    title,
    ariaLabel,
    rotate,
    flip,
    rtl,
    className,
    children,
    ...rest
  },
  ref
) {
  const defaults = useIconContext();

  const finalVariant = variant ?? defaults.variant ?? 'outline';
  const finalIconWeight = iconWeight ?? defaults.iconWeight ?? 'regular';
  const resolved = resolveIcon(name, finalVariant);
  if (!resolved) return null;

  const finalSize = normalizeSize(size ?? defaults.size);
  const finalColor = color ?? defaults.color ?? 'currentColor';
  const finalSecondaryColor = secondaryColor ?? defaults.secondaryColor ?? finalColor;
  const finalStrokeLinecap = strokeLinecap ?? defaults.strokeLinecap ?? 'round';
  const finalStrokeLinejoin = strokeLinejoin ?? defaults.strokeLinejoin ?? 'round';
  const finalStrokeWidth = resolveStrokeWidth(
    {
      strokeWidth,
      defaultStrokeWidth: defaults.strokeWidth,
      iconWeight: finalIconWeight,
      absoluteStrokeWidth: absoluteStrokeWidth ?? defaults.absoluteStrokeWidth,
      size: finalSize
    },
    resolved.viewBox
  );

  const explicitAriaLabel =
    ariaLabel || (typeof rest['aria-label'] === 'string' ? (rest['aria-label'] as string) : undefined);
  const finalDecorative = decorative ?? defaults.decorative ?? (!title && !explicitAriaLabel);
  const mergedClassName = mergeClassName(defaults.className, className);

  const transform = computeTransform(
    {
      rotate,
      flip,
      rtl: (rtl ?? defaults.rtl) && resolved.definition.rtlMirror
    },
    resolved.viewBox
  );

  const nodeOptions: NodeRenderOptions = {
    secondaryColor: finalSecondaryColor,
    strokeWidth: finalStrokeWidth,
    strokeLinecap: finalStrokeLinecap,
    strokeLinejoin: finalStrokeLinejoin
  };

  const content = resolved.glyph.nodes.map((node, index) => renderNode(node, index, nodeOptions));

  const role = rest.role || (finalDecorative ? 'presentation' : 'img');
  const ariaHidden = finalDecorative ? true : undefined;
  const computedAriaLabel = finalDecorative ? undefined : explicitAriaLabel || title || name;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={finalSize}
      height={finalSize}
      viewBox={resolved.viewBox}
      fill="none"
      color={finalColor}
      overflow="visible"
      shapeRendering="geometricPrecision"
      className={mergedClassName}
      role={role}
      aria-hidden={ariaHidden}
      aria-label={computedAriaLabel}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {transform ? <g transform={transform}>{content}</g> : content}
      {children}
    </svg>
  );
});

Icon.displayName = 'Icon';

export default Icon;
