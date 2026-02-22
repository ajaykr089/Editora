import { ElementBase } from '../ElementBase';

type ResponsiveMap = Partial<Record<'initial' | 'sm' | 'md' | 'lg' | 'xl', string>>;

const BREAKPOINTS: Record<Exclude<keyof ResponsiveMap, 'initial'>, string> = {
  sm: 'var(--ui-breakpoint-sm, 640px)',
  md: 'var(--ui-breakpoint-md, 768px)',
  lg: 'var(--ui-breakpoint-lg, 1024px)',
  xl: 'var(--ui-breakpoint-xl, 1280px)'
};

const STYLE_ATTRS = [
  'p','px','py','pt','pr','pb','pl',
  'm','mx','my','mt','mr','mb','ml',
  'width','w','minwidth','minw','maxwidth','maxw','height','h','minheight','minh','maxheight','maxh',
  'background','bg','color',
  'display','position','inset','top','right','bottom','left','align',
  'flexbasis','flexgrow','flexshrink',
  'gridarea','gridcolumn','gridcolumnstart','gridcolumnend','gridrow','gridrowstart','gridrowend'
] as const;

const SPACE_TOKENS: Record<string, string> = {
  xs: 'var(--ui-space-xs, 4px)',
  sm: 'var(--ui-space-sm, 8px)',
  md: 'var(--ui-space-md, 12px)',
  lg: 'var(--ui-space-lg, 20px)',
  xl: 'var(--ui-space-xl, 28px)'
};

const style = `
  :host {
    --ui-box-bg: transparent;
    --ui-box-color: inherit;
    --ui-box-border-color: transparent;
    --ui-box-border: 1px solid var(--ui-box-border-color);
    --ui-box-shadow: none;
    --ui-box-radius: 12px;
    --ui-box-backdrop: none;
    --ui-box-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-box-outline: color-mix(in srgb, var(--ui-box-accent) 36%, transparent);
    color-scheme: light dark;
    display: block;
    box-sizing: border-box;
    position: relative;
    min-inline-size: 0;
    background: var(--ui-box-bg);
    color: var(--ui-box-color);
    border: var(--ui-box-border);
    border-radius: var(--ui-box-radius);
    box-shadow: var(--ui-box-shadow);
    backdrop-filter: var(--ui-box-backdrop);
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  :host([variant="surface"]) {
    --ui-box-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-box-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-box-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-box-shadow:
      0 1px 3px rgba(2, 6, 23, 0.05),
      0 10px 24px rgba(2, 6, 23, 0.06);
  }

  :host([variant="elevated"]) {
    --ui-box-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-box-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-box-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 64%, transparent);
    --ui-box-shadow:
      0 2px 8px rgba(2, 6, 23, 0.08),
      0 24px 52px rgba(2, 6, 23, 0.14);
  }

  :host([variant="outline"]) {
    --ui-box-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, transparent);
    --ui-box-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-box-border-color: color-mix(in srgb, var(--ui-box-accent) 30%, var(--ui-color-border, #cbd5e1));
    --ui-box-shadow: none;
  }

  :host([variant="glass"]) {
    --ui-box-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 84%, #ffffff 16%),
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 88%, transparent)
      );
    --ui-box-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-box-border-color: color-mix(in srgb, #ffffff 68%, var(--ui-color-border, #cbd5e1));
    --ui-box-shadow:
      0 1px 2px rgba(2, 6, 23, 0.06),
      0 26px 58px rgba(2, 6, 23, 0.14);
    --ui-box-backdrop: blur(12px) saturate(1.08);
  }

  :host([variant="gradient"]) {
    --ui-box-bg:
      linear-gradient(
        140deg,
        color-mix(in srgb, var(--ui-box-accent) 14%, var(--ui-color-surface, #ffffff)),
        color-mix(in srgb, var(--ui-box-accent) 6%, var(--ui-color-surface, #ffffff))
      );
    --ui-box-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-box-border-color: color-mix(in srgb, var(--ui-box-accent) 24%, transparent);
    --ui-box-shadow:
      0 2px 10px rgba(2, 6, 23, 0.08),
      0 16px 36px rgba(2, 6, 23, 0.1);
  }

  :host([variant="contrast"]) {
    --ui-box-bg: #0f172a;
    --ui-box-color: #e2e8f0;
    --ui-box-border-color: #334155;
    --ui-box-shadow:
      0 2px 10px rgba(2, 6, 23, 0.22),
      0 18px 42px rgba(2, 6, 23, 0.34);
  }

  :host([tone="brand"]) { --ui-box-accent: var(--ui-color-primary, var(--ui-primary, #2563eb)); }
  :host([tone="success"]) { --ui-box-accent: #16a34a; }
  :host([tone="warning"]) { --ui-box-accent: #d97706; }
  :host([tone="danger"]) { --ui-box-accent: #dc2626; }

  :host([elevation="none"]) { --ui-box-shadow: none; }
  :host([elevation="low"]) {
    --ui-box-shadow:
      0 1px 3px rgba(2, 6, 23, 0.06),
      0 10px 24px rgba(2, 6, 23, 0.08);
  }
  :host([elevation="high"]) {
    --ui-box-shadow:
      0 2px 12px rgba(2, 6, 23, 0.12),
      0 34px 72px rgba(2, 6, 23, 0.18);
  }

  :host([radius="sm"]) { --ui-box-radius: 8px; }
  :host([radius="lg"]) { --ui-box-radius: 18px; }
  :host([radius="xl"]) { --ui-box-radius: 24px; }

  :host([interactive]) { cursor: pointer; }
  :host([interactive]:hover) {
    transform: translateY(-1px);
    box-shadow:
      0 2px 8px rgba(2, 6, 23, 0.09),
      0 22px 44px rgba(2, 6, 23, 0.14);
  }
  :host([interactive]:active) { transform: translateY(0); }

  :host(:focus-within) {
    box-shadow:
      0 0 0 2px var(--ui-box-outline),
      var(--ui-box-shadow);
  }

  :host([headless]) {
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  @media (prefers-reduced-motion: reduce) {
    :host { transition: none !important; }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-box-border: 2px solid var(--ui-box-border-color);
      --ui-box-shadow: none;
      --ui-box-backdrop: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-box-bg: Canvas;
      --ui-box-color: CanvasText;
      --ui-box-border-color: CanvasText;
      --ui-box-shadow: none;
      --ui-box-backdrop: none;
    }
  }
`;

function parseResponsive(raw: string | null): ResponsiveMap | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value.startsWith('{')) return null;
  try {
    const parsed = JSON.parse(value) as ResponsiveMap;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function normalizeSpace(value: string): string {
  const token = SPACE_TOKENS[value];
  return token || value;
}

function mapAttrToStyles(attr: (typeof STYLE_ATTRS)[number], value: string): Record<string, string> {
  switch (attr) {
    case 'p': return { padding: normalizeSpace(value) };
    case 'px': return { 'padding-left': normalizeSpace(value), 'padding-right': normalizeSpace(value) };
    case 'py': return { 'padding-top': normalizeSpace(value), 'padding-bottom': normalizeSpace(value) };
    case 'pt': return { 'padding-top': normalizeSpace(value) };
    case 'pr': return { 'padding-right': normalizeSpace(value) };
    case 'pb': return { 'padding-bottom': normalizeSpace(value) };
    case 'pl': return { 'padding-left': normalizeSpace(value) };
    case 'm': return { margin: normalizeSpace(value) };
    case 'mx': return { 'margin-left': normalizeSpace(value), 'margin-right': normalizeSpace(value) };
    case 'my': return { 'margin-top': normalizeSpace(value), 'margin-bottom': normalizeSpace(value) };
    case 'mt': return { 'margin-top': normalizeSpace(value) };
    case 'mr': return { 'margin-right': normalizeSpace(value) };
    case 'mb': return { 'margin-bottom': normalizeSpace(value) };
    case 'ml': return { 'margin-left': normalizeSpace(value) };
    case 'background':
    case 'bg':
      return { background: value };
    case 'w':
    case 'width':
      return { width: value };
    case 'h':
    case 'height':
      return { height: value };
    case 'minw':
    case 'minwidth':
      return { 'min-width': value };
    case 'maxw':
    case 'maxwidth':
      return { 'max-width': value };
    case 'minh':
    case 'minheight':
      return { 'min-height': value };
    case 'maxh':
    case 'maxheight':
      return { 'max-height': value };
    case 'align':
      return { 'align-items': value };
    case 'flexbasis':
      return { 'flex-basis': value };
    case 'flexgrow':
      return { 'flex-grow': value };
    case 'flexshrink':
      return { 'flex-shrink': value };
    case 'gridarea':
      return { 'grid-area': value };
    case 'gridcolumn':
      return { 'grid-column': value };
    case 'gridcolumnstart':
      return { 'grid-column-start': value };
    case 'gridcolumnend':
      return { 'grid-column-end': value };
    case 'gridrow':
      return { 'grid-row': value };
    case 'gridrowstart':
      return { 'grid-row-start': value };
    case 'gridrowend':
      return { 'grid-row-end': value };
    default:
      return { [attr]: value };
  }
}

export class UIBox extends ElementBase {
  static get observedAttributes() {
    return ['classname', 'headless', 'variant', 'tone', 'elevation', 'radius', 'interactive', ...STYLE_ATTRS];
  }

  private _lastClassname = '';
  private _appliedInlineProps = new Set<string>();

  private _syncLegacyClassname(): void {
    const next = this.getAttribute('classname') || '';
    if (next === this._lastClassname) return;

    if (this._lastClassname) {
      this._lastClassname.split(/\s+/).forEach((token) => {
        if (token) this.classList.remove(token);
      });
    }

    if (next) {
      next.split(/\s+/).forEach((token) => {
        if (token) this.classList.add(token);
      });
    }

    this._lastClassname = next;
  }

  private _applyInlineStyles(): void {
    this._appliedInlineProps.forEach((prop) => this.style.removeProperty(prop));
    this._appliedInlineProps.clear();

    STYLE_ATTRS.forEach((attr) => {
      const raw = this.getAttribute(attr);
      if (!raw) return;
      if (parseResponsive(raw)) return;

      const mapped = mapAttrToStyles(attr, raw);
      Object.entries(mapped).forEach(([prop, value]) => {
        this.style.setProperty(prop, value);
        this._appliedInlineProps.add(prop);
      });
    });
  }

  private _buildResponsiveCss(): string {
    const initial: Record<string, string> = {};
    const media: Record<Exclude<keyof ResponsiveMap, 'initial'>, Record<string, string>> = {
      sm: {},
      md: {},
      lg: {},
      xl: {}
    };

    STYLE_ATTRS.forEach((attr) => {
      const raw = this.getAttribute(attr);
      const responsive = parseResponsive(raw);
      if (!responsive) return;

      const applyMap = (bucket: Record<string, string>, value: string) => {
        const mapped = mapAttrToStyles(attr, value);
        Object.assign(bucket, mapped);
      };

      if (typeof responsive.initial === 'string') applyMap(initial, responsive.initial);
      if (typeof responsive.sm === 'string') applyMap(media.sm, responsive.sm);
      if (typeof responsive.md === 'string') applyMap(media.md, responsive.md);
      if (typeof responsive.lg === 'string') applyMap(media.lg, responsive.lg);
      if (typeof responsive.xl === 'string') applyMap(media.xl, responsive.xl);
    });

    const ruleFor = (selector: string, values: Record<string, string>): string => {
      const entries = Object.entries(values);
      if (!entries.length) return '';
      return `${selector} { ${entries.map(([k, v]) => `${k}: ${v};`).join(' ')} }`;
    };

    const lines: string[] = [];
    const base = ruleFor(':host', initial);
    if (base) lines.push(base);

    (Object.keys(media) as Array<Exclude<keyof ResponsiveMap, 'initial'>>).forEach((bp) => {
      const body = ruleFor(':host', media[bp]);
      if (body) lines.push(`@media (min-width: ${BREAKPOINTS[bp]}) { ${body} }`);
    });

    return lines.join('\n');
  }

  protected override render(): void {
    this._syncLegacyClassname();
    this._applyInlineStyles();

    const responsiveCss = this._buildResponsiveCss();
    this.setContent(`<style>${style}${responsiveCss ? `\n${responsiveCss}` : ''}</style><slot></slot>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-box')) {
  customElements.define('ui-box', UIBox);
}
