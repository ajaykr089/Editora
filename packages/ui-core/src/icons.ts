import { hasIcon as hasCoreIcon, renderIconSvg, type IconRenderOptions, type IconVariant } from '@editora/icons';

const customRegistry = new Map<string, string>();
const coreCache = new Map<string, string>();

function normalizeName(name: string): string {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-');
}

function cacheKey(name: string, options?: UIIconRenderOptions): string {
  if (!options) return `${name}::default`;
  const variant = options.variant || 'outline';
  const iconWeight = options.iconWeight || '';
  const secondaryColor = options.secondaryColor || '';
  const strokeWidth = options.strokeWidth == null ? '' : String(options.strokeWidth);
  const absoluteStrokeWidth = options.absoluteStrokeWidth ? '1' : '0';
  const strokeLinecap = options.strokeLinecap || '';
  const strokeLinejoin = options.strokeLinejoin || '';
  const rotate = options.rotate == null ? '' : String(options.rotate);
  const flip = options.flip || '';
  const rtl = options.rtl ? '1' : '0';
  return [
    name,
    variant,
    iconWeight,
    secondaryColor,
    strokeWidth,
    absoluteStrokeWidth,
    strokeLinecap,
    strokeLinejoin,
    rotate,
    flip,
    rtl
  ].join('::');
}

export type UIIconRenderOptions = Pick<
  IconRenderOptions,
  | 'variant'
  | 'iconWeight'
  | 'secondaryColor'
  | 'strokeWidth'
  | 'absoluteStrokeWidth'
  | 'strokeLinecap'
  | 'strokeLinejoin'
  | 'rotate'
  | 'flip'
  | 'rtl'
>;

export function registerIcon(name: string, svg: string): void {
  const normalized = normalizeName(name);
  if (!normalized) return;
  customRegistry.set(normalized, svg);
}

export function unregisterIcon(name: string): void {
  const normalized = normalizeName(name);
  if (!normalized) return;
  customRegistry.delete(normalized);
}

export function clearCustomIcons(): void {
  customRegistry.clear();
}

export function hasIcon(name: string): boolean {
  const normalized = normalizeName(name);
  if (!normalized) return false;
  if (customRegistry.has(normalized)) return true;
  return hasCoreIcon(normalized);
}

export function getIconVariant(name: string, variant: IconVariant): string {
  return getIcon(name, { variant });
}

export function getIcon(name: string, options?: UIIconRenderOptions): string {
  const normalized = normalizeName(name);
  if (!normalized) return '';

  const custom = customRegistry.get(normalized);
  if (custom) return custom;
  if (!hasCoreIcon(normalized)) return '';

  const key = cacheKey(normalized, options);
  const cached = coreCache.get(key);
  if (cached) return cached;

  const svg = renderIconSvg(normalized, {
    variant: options?.variant || 'outline',
    iconWeight: options?.iconWeight,
    secondaryColor: options?.secondaryColor,
    strokeWidth: options?.strokeWidth,
    absoluteStrokeWidth: options?.absoluteStrokeWidth,
    strokeLinecap: options?.strokeLinecap,
    strokeLinejoin: options?.strokeLinejoin,
    rotate: options?.rotate,
    flip: options?.flip,
    rtl: options?.rtl,
    color: 'currentColor',
    decorative: true
  });

  if (svg) coreCache.set(key, svg);
  return svg;
}
