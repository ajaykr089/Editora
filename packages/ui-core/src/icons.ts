import type { IconDefinition, IconRenderOptions, IconVariant } from '@editora/icons';

// The built-in icon set (@editora/icons) is about 135 KB minified, and icons are looked up by name,
// so a bundler cannot drop the ones an app does not use. A static import put the whole set into
// every component that can show an icon (a Button entry was 55 KB gzipped, 80% of it icons). It is
// loaded on first use instead: bundlers split it into its own chunk, components that never render a
// built-in icon never load it, and icons render once it arrives. Custom icons (registerIcon) and
// apps that call loadIcons() up front are unaffected. Apps that want no icon chunk at all import
// the icons they use from `@editora/icons/glyphs` and pass them to addIcons() (add-icons.ts, kept
// apart so the renderer it needs only ships to apps that use it): those render at once and never
// trigger the load.
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
const definitionRegistry = new Map<string, IconDefinition>();

type DefinitionRenderer = (definition: IconDefinition, options: IconRenderOptions) => string;
let definitionRenderer: DefinitionRenderer | null = null;

/** Internal: used by addIcons() in add-icons.ts. */
export function registerIconDefinitions(definitions: IconDefinition[], renderer: DefinitionRenderer): void {
  definitionRenderer = renderer;
  for (const definition of definitions) {
    for (const name of [definition.name, ...(definition.aliases || [])]) {
      const normalized = normalizeName(name);
      if (normalized) definitionRegistry.set(normalized, definition);
    }
  }
  coreCache.clear();
}
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
  if (customRegistry.has(normalized) || definitionRegistry.has(normalized)) return true;
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
  const definition = definitionRegistry.get(normalized);
  if (!definition && !hasCoreIcon(normalized)) return '';

  const key = cacheKey(normalized, options);
  const cached = coreCache.get(key);
  if (cached) return cached;

  if (!definition && !core) return '';
  const renderOptions: IconRenderOptions = {
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
  };
  const svg = definition && definitionRenderer ? definitionRenderer(definition, renderOptions) : core!.renderIconSvg(normalized, renderOptions);

  if (svg) coreCache.set(key, svg);
  return svg;
}
