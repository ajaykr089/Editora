import type { IconRenderOptions, IconVariant } from '@editora/icons';

// The built-in icon set (@editora/icons) is about 135 KB minified, and icons are looked up by name,
// so a bundler cannot drop the ones an app does not use. A static import put the whole set into
// every component that can show an icon (a Button entry was 55 KB gzipped, 80% of it icons). It is
// loaded on first use instead: bundlers split it into its own chunk, components that never render a
// built-in icon never load it, and icons render once it arrives. Custom icons (registerIcon) and
// apps that call loadIcons() up front are unaffected.
type CoreIcons = typeof import('@editora/icons');
let core: CoreIcons | null = null;
let loading: Promise<CoreIcons> | null = null;
const loadListeners = new Set<() => void>();

/** Loads the built-in icon set; resolves when every built-in icon can render synchronously. */
export function loadIcons(): Promise<void> {
  if (core) return Promise.resolve();
  if (!loading) {
    loading = import('@editora/icons').then((mod) => {
      core = mod;
      coreCache.clear();
      const listeners = Array.from(loadListeners);
      loadListeners.clear();
      listeners.forEach((listener) => {
        try { listener(); } catch { /* a listener's failure must not block the others */ }
      });
      return mod;
    });
    loading.catch(() => { loading = null; });
  }
  return loading.then(() => undefined);
}

/** True once the built-in icon set is available. */
export function iconsLoaded(): boolean {
  return !!core;
}

/** Runs `listener` once when the built-in icon set has loaded (immediately start loading it). */
export function whenIconsLoaded(listener: () => void): () => void {
  if (core) {
    listener();
    return () => {};
  }
  loadListeners.add(listener);
  void loadIcons();
  return () => loadListeners.delete(listener);
}

function hasCoreIcon(name: string): boolean {
  if (!core) {
    void loadIcons();
    return false;
  }
  return core.hasIcon(name);
}

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

  if (!core) return '';
  const svg = core.renderIconSvg(normalized, {
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
