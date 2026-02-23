import { ElementBase } from '../ElementBase';

type ResponsiveMap = Partial<Record<'initial' | 'sm' | 'md' | 'lg' | 'xl', string>>;

const BREAKPOINTS: Record<Exclude<keyof ResponsiveMap, 'initial'>, string> = {
  sm: 'var(--ui-breakpoint-sm, 640px)',
  md: 'var(--ui-breakpoint-md, 768px)',
  lg: 'var(--ui-breakpoint-lg, 1024px)',
  xl: 'var(--ui-breakpoint-xl, 1280px)'
};

const FLEX_ATTRS = ['display', 'direction', 'align', 'justify', 'wrap', 'gap', 'rowgap', 'columngap'] as const;

const SPACE_TOKENS: Record<string, string> = {
  xs: 'var(--ui-space-xs, 4px)',
  sm: 'var(--ui-space-sm, 8px)',
  md: 'var(--ui-space-md, 12px)',
  lg: 'var(--ui-space-lg, 20px)',
  xl: 'var(--ui-space-xl, 28px)'
};

const style = `
  :host {
    --ui-flex-display: flex;
    --ui-flex-direction: row;
    --ui-flex-align: stretch;
    --ui-flex-justify: flex-start;
    --ui-flex-wrap: nowrap;
    --ui-flex-gap: 0px;
    --ui-flex-row-gap: var(--ui-flex-gap);
    --ui-flex-column-gap: var(--ui-flex-gap);
    --ui-flex-color: var(--ui-color-text, inherit);
    color-scheme: light dark;
    display: var(--ui-flex-display);
    color: var(--ui-flex-color);
    box-sizing: border-box;
    min-inline-size: 0;
    flex-direction: var(--ui-flex-direction);
    align-items: var(--ui-flex-align);
    justify-content: var(--ui-flex-justify);
    flex-wrap: var(--ui-flex-wrap);
    gap: var(--ui-flex-gap);
    row-gap: var(--ui-flex-row-gap);
    column-gap: var(--ui-flex-column-gap);
  }

  slot {
    display: contents;
  }

  :host([headless]) {
    display: block;
    gap: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      scroll-behavior: auto;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-flex-color: var(--ui-color-text, inherit);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-flex-color: CanvasText;
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

function toCssVariable(attr: (typeof FLEX_ATTRS)[number], value: string): Record<string, string> {
  switch (attr) {
    case 'display': return { '--ui-flex-display': value };
    case 'direction': return { '--ui-flex-direction': value };
    case 'align': return { '--ui-flex-align': value };
    case 'justify': return { '--ui-flex-justify': value };
    case 'wrap': return { '--ui-flex-wrap': value };
    case 'gap': return { '--ui-flex-gap': normalizeSpace(value) };
    case 'rowgap': return { '--ui-flex-row-gap': normalizeSpace(value) };
    case 'columngap': return { '--ui-flex-column-gap': normalizeSpace(value) };
    default: return {};
  }
}

export class UIFlex extends ElementBase {
  static get observedAttributes() {
    return ['classname', 'headless', ...FLEX_ATTRS];
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

    FLEX_ATTRS.forEach((attr) => {
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

    FLEX_ATTRS.forEach((attr) => {
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
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-flex')) {
  customElements.define('ui-flex', UIFlex);
}
