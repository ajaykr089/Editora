import { ElementBase } from '../ElementBase';

type ResponsiveMap = Partial<Record<'initial' | 'sm' | 'md' | 'lg' | 'xl', string>>;

const BREAKPOINTS: Record<Exclude<keyof ResponsiveMap, 'initial'>, string> = {
  sm: 'var(--ui-breakpoint-sm, 640px)',
  md: 'var(--ui-breakpoint-md, 768px)',
  lg: 'var(--ui-breakpoint-lg, 1024px)',
  xl: 'var(--ui-breakpoint-xl, 1280px)'
};

const GRID_ATTRS = [
  'display',
  'columns',
  'rows',
  'gap',
  'rowgap',
  'columngap',
  'autoflow',
  'autorows',
  'autocolumns',
  'align',
  'justify',
  'place',
  'aligncontent',
  'justifycontent',
  'placecontent'
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
    --ui-grid-display: grid;
    --ui-grid-columns: 1fr;
    --ui-grid-rows: none;
    --ui-grid-gap: 0px;
    --ui-grid-row-gap: var(--ui-grid-gap);
    --ui-grid-column-gap: var(--ui-grid-gap);
    --ui-grid-auto-flow: row;
    --ui-grid-auto-rows: auto;
    --ui-grid-auto-columns: auto;
    --ui-grid-align-items: stretch;
    --ui-grid-justify-items: stretch;
    --ui-grid-place-items: initial;
    --ui-grid-align-content: normal;
    --ui-grid-justify-content: normal;
    --ui-grid-place-content: initial;
    --ui-grid-color: var(--ui-color-text, inherit);
    color-scheme: light dark;
    display: var(--ui-grid-display);
    color: var(--ui-grid-color);
    box-sizing: border-box;
    min-inline-size: 0;
    grid-template-columns: var(--ui-grid-columns);
    grid-template-rows: var(--ui-grid-rows);
    gap: var(--ui-grid-gap);
    row-gap: var(--ui-grid-row-gap);
    column-gap: var(--ui-grid-column-gap);
    grid-auto-flow: var(--ui-grid-auto-flow);
    grid-auto-rows: var(--ui-grid-auto-rows);
    grid-auto-columns: var(--ui-grid-auto-columns);
    align-items: var(--ui-grid-align-items);
    justify-items: var(--ui-grid-justify-items);
    place-items: var(--ui-grid-place-items);
    align-content: var(--ui-grid-align-content);
    justify-content: var(--ui-grid-justify-content);
    place-content: var(--ui-grid-place-content);
  }

  slot {
    display: contents;
  }

  :host([headless]) {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      scroll-behavior: auto;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-grid-color: var(--ui-color-text, inherit);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-grid-color: CanvasText;
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

function toCssVariable(attr: (typeof GRID_ATTRS)[number], value: string): Record<string, string> {
  switch (attr) {
    case 'display': return { '--ui-grid-display': value };
    case 'columns': return { '--ui-grid-columns': value };
    case 'rows': return { '--ui-grid-rows': value };
    case 'gap': return { '--ui-grid-gap': normalizeSpace(value) };
    case 'rowgap': return { '--ui-grid-row-gap': normalizeSpace(value) };
    case 'columngap': return { '--ui-grid-column-gap': normalizeSpace(value) };
    case 'autoflow': return { '--ui-grid-auto-flow': value };
    case 'autorows': return { '--ui-grid-auto-rows': value };
    case 'autocolumns': return { '--ui-grid-auto-columns': value };
    case 'align': return { '--ui-grid-align-items': value };
    case 'justify': return { '--ui-grid-justify-items': value };
    case 'place': return { '--ui-grid-place-items': value };
    case 'aligncontent': return { '--ui-grid-align-content': value };
    case 'justifycontent': return { '--ui-grid-justify-content': value };
    case 'placecontent': return { '--ui-grid-place-content': value };
    default: return {};
  }
}

export class UIGrid extends ElementBase {
  static get observedAttributes() {
    return ['classname', 'headless', ...GRID_ATTRS];
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

    GRID_ATTRS.forEach((attr) => {
      const raw = this.getAttribute(attr);
      if (!raw) return;
      if (parseResponsive(raw)) return;

      const mapped = toCssVariable(attr, raw);
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

    GRID_ATTRS.forEach((attr) => {
      const raw = this.getAttribute(attr);
      const responsive = parseResponsive(raw);
      if (!responsive) return;

      const applyMap = (bucket: Record<string, string>, value: string) => {
        Object.assign(bucket, toCssVariable(attr, value));
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

    this.dispatchEvent(new CustomEvent('layoutchange', { bubbles: true, composed: true }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-grid')) {
  customElements.define('ui-grid', UIGrid);
}
