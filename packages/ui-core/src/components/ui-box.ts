import { ElementBase } from '../ElementBase';

type ResponsiveMap = Partial<Record<'initial' | 'sm' | 'md' | 'lg' | 'xl', string>>;

const BREAKPOINTS: Record<Exclude<keyof ResponsiveMap, 'initial'>, string> = {
  sm: 'var(--ui-breakpoint-sm, 640px)',
  md: 'var(--ui-breakpoint-md, 768px)',
  lg: 'var(--ui-breakpoint-lg, 1024px)',
  xl: 'var(--ui-breakpoint-xl, 1280px)',
};

const STYLE_ATTRS = [
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  'width', 'w', 'minwidth', 'minw', 'maxwidth', 'maxw', 'height', 'h', 'minheight', 'minh', 'maxheight', 'maxh',
  'background', 'bg', 'color', 'opacity', 'overflow', 'overflowx', 'overflowy', 'zindex',
  'display', 'position', 'inset', 'top', 'right', 'bottom', 'left', 'justify', 'align', 'alignself', 'aligncontent',
  'flexbasis', 'flexgrow', 'flexshrink', 'gap', 'rowgap', 'columngap',
  'gridarea', 'gridcolumn', 'gridcolumnstart', 'gridcolumnend', 'gridrow', 'gridrowstart', 'gridrowend',
] as const;

type StyleAttr = (typeof STYLE_ATTRS)[number];

const SPACE_TOKENS: Record<string, string> = {
  none: '0',
  xxs: 'var(--ui-space-2xs, 2px)',
  xs: 'var(--ui-space-xs, 4px)',
  sm: 'var(--ui-space-sm, 8px)',
  md: 'var(--ui-space-md, 12px)',
  lg: 'var(--ui-space-lg, 20px)',
  xl: 'var(--ui-space-xl, 28px)',
  '2xl': 'var(--ui-space-2xl, 40px)',
};

const style = `
  :host {
    --ui-box-bg: transparent;
    --ui-box-color: inherit;
    --ui-box-border: none;
    --ui-box-border-color: transparent;
    --ui-box-border-width: 1px;
    --ui-box-border-style: solid;
    --ui-box-shadow: none;
    --ui-box-radius: var(--base-box-radius, var(--ui-radius, 4px));
    --ui-box-backdrop: none;
    --ui-box-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-box-outline: color-mix(in srgb, var(--ui-box-accent) 30%, transparent);
    --ui-box-duration: 180ms;
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
    transition: none;
    font-family: var(--ui-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
  }

  :host([data-ui-ready]) {
    transition:
      background-color var(--ui-box-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      border-color var(--ui-box-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      box-shadow var(--ui-box-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      transform var(--ui-box-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity var(--ui-box-duration) cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  :host([variant]),
  :host([state="error"]),
  :host([state="success"]) {
    --ui-box-border: var(--ui-box-border-width) var(--ui-box-border-style) var(--ui-box-border-color);
  }

  :host([variant="surface"]) {
    --ui-box-bg: var(--base-box-bg, var(--ui-color-surface, var(--ui-surface, #ffffff)));
    --ui-box-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-box-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 80%, transparent);
    --ui-box-shadow: var(--base-box-shadow, 0 1px 3px rgba(2, 6, 23, 0.05), 0 10px 24px rgba(2, 6, 23, 0.06));
  }

  :host([variant="elevated"]) {
    --ui-box-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-box-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-box-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-box-shadow: 0 2px 8px rgba(2, 6, 23, 0.08), 0 24px 52px rgba(2, 6, 23, 0.14);
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
    --ui-box-shadow: 0 1px 2px rgba(2, 6, 23, 0.06), 0 26px 58px rgba(2, 6, 23, 0.14);
    --ui-box-backdrop: var(--base-box-backdrop, blur(12px) saturate(1.08));
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
    --ui-box-shadow: 0 2px 10px rgba(2, 6, 23, 0.08), 0 16px 36px rgba(2, 6, 23, 0.1);
  }

  :host([variant="soft"]) {
    --ui-box-bg: color-mix(in srgb, var(--ui-box-accent) 7%, var(--ui-color-surface, #ffffff));
    --ui-box-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-box-border-color: color-mix(in srgb, var(--ui-box-accent) 18%, var(--ui-color-border, #cbd5e1));
    --ui-box-shadow: 0 1px 2px rgba(2, 6, 23, 0.04), 0 8px 18px rgba(2, 6, 23, 0.08);
  }

  :host([variant="contrast"]) {
    --ui-box-bg: #0f172a;
    --ui-box-color: #e2e8f0;
    --ui-box-border-color: #334155;
    --ui-box-shadow: 0 2px 10px rgba(2, 6, 23, 0.22), 0 18px 42px rgba(2, 6, 23, 0.34);
  }

  :host([tone="neutral"]) { --ui-box-accent: color-mix(in srgb, var(--ui-color-muted, #64748b) 72%, var(--ui-color-text, #0f172a) 28%); }
  :host([tone="brand"]) { --ui-box-accent: var(--ui-color-primary, var(--ui-primary, #2563eb)); }
  :host([tone="info"]) { --ui-box-accent: var(--ui-color-primary, #2563eb); }
  :host([tone="success"]) { --ui-box-accent: #16a34a; }
  :host([tone="warning"]) { --ui-box-accent: #d97706; }
  :host([tone="danger"]) { --ui-box-accent: #dc2626; }

  :host([elevation="none"]) { --ui-box-shadow: none; }
  :host([elevation="low"]) { --ui-box-shadow: 0 1px 3px rgba(2, 6, 23, 0.06), 0 10px 24px rgba(2, 6, 23, 0.08); }
  :host([elevation="high"]) { --ui-box-shadow: 0 2px 12px rgba(2, 6, 23, 0.12), 0 34px 72px rgba(2, 6, 23, 0.18); }

  :host([radius="none"]) { --ui-box-radius: 0; }
  :host([radius="sm"]) { --ui-box-radius: 8px; }
  :host([radius="md"]) { --ui-box-radius: 12px; }
  :host([radius="lg"]) { --ui-box-radius: 18px; }
  :host([radius="xl"]) { --ui-box-radius: 24px; }
  :host([radius="full"]) { --ui-box-radius: 9999px; }

  :host([interactive]) {
    cursor: pointer;
  }

  :host([interactive]:not([disabled])):hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(2, 6, 23, 0.09), 0 22px 44px rgba(2, 6, 23, 0.14);
  }

  :host([interactive]:not([disabled])):active {
    transform: translateY(0) scale(0.995);
  }

  :host([interactive]):focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--ui-box-outline), var(--ui-box-shadow);
  }

  :host(:focus-within) {
    box-shadow: 0 0 0 2px var(--ui-box-outline), var(--ui-box-shadow);
  }

  :host([state="loading"]) {
    cursor: progress;
  }

  :host([state="loading"])::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background:
      linear-gradient(
        100deg,
        color-mix(in srgb, transparent 100%, #ffffff) 0%,
        color-mix(in srgb, var(--ui-box-accent) 14%, transparent) 40%,
        color-mix(in srgb, transparent 100%, #ffffff) 78%
      );
    background-size: 220% 100%;
    animation: ui-box-shimmer 1.3s linear infinite;
    opacity: 0.58;
  }

  :host([state="error"]) {
    --ui-box-accent: var(--ui-color-danger, #dc2626);
    --ui-box-border-color: color-mix(in srgb, var(--ui-box-accent) 42%, var(--ui-color-border, #cbd5e1));
    --ui-box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-box-accent) 16%, transparent), var(--ui-box-shadow);
  }

  :host([state="success"]) {
    --ui-box-accent: var(--ui-color-success, #16a34a);
    --ui-box-border-color: color-mix(in srgb, var(--ui-box-accent) 42%, var(--ui-color-border, #cbd5e1));
    --ui-box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-box-accent) 16%, transparent), var(--ui-box-shadow);
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.58;
    filter: saturate(0.76);
    transform: none !important;
  }

  :host([headless]) {
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  @keyframes ui-box-shimmer {
    from { background-position: 120% 0; }
    to { background-position: -120% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    :host,
    :host::after {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-box-border-width: 2px;
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
    const parsed = JSON.parse(value) as Partial<Record<'initial' | 'sm' | 'md' | 'lg' | 'xl', string | number>>;
    if (!parsed || typeof parsed !== 'object') return null;

    const normalized: ResponsiveMap = {};
    (Object.keys(parsed) as Array<keyof typeof parsed>).forEach((key) => {
      const v = parsed[key];
      if (typeof v === 'string' || typeof v === 'number') {
        normalized[key as keyof ResponsiveMap] = String(v);
      }
    });
    return normalized;
  } catch {
    return null;
  }
}

function sanitizeCssValue(raw: string): string {
  const value = raw.trim();
  if (!value) return '';
  if (/[;{}<>]/.test(value)) return '';
  return value;
}

function normalizeSpace(value: string): string {
  const token = SPACE_TOKENS[value];
  return token || value;
}

function normalizeRadius(raw: string | null): string {
  if (!raw) return '';
  const value = raw.trim().toLowerCase();
  if (!value) return '';
  if (value === 'none') return '0px';
  if (value === 'sm') return '8px';
  if (value === 'md') return '12px';
  if (value === 'lg') return '18px';
  if (value === 'xl') return '24px';
  if (value === 'full') return '9999px';
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
  return raw;
}

function isResponsiveStyleAttr(attr: StyleAttr, value: string | null): boolean {
  if (!value) return false;
  return parseResponsive(value) !== null;
}

function mapAttrToStyles(attr: (typeof STYLE_ATTRS)[number], value: string): Record<string, string> {
  const safe = sanitizeCssValue(value);
  if (!safe) return {};
  switch (attr) {
    case 'p': return { padding: normalizeSpace(safe) };
    case 'px': return { 'padding-left': normalizeSpace(safe), 'padding-right': normalizeSpace(safe) };
    case 'py': return { 'padding-top': normalizeSpace(safe), 'padding-bottom': normalizeSpace(safe) };
    case 'pt': return { 'padding-top': normalizeSpace(safe) };
    case 'pr': return { 'padding-right': normalizeSpace(safe) };
    case 'pb': return { 'padding-bottom': normalizeSpace(safe) };
    case 'pl': return { 'padding-left': normalizeSpace(safe) };
    case 'm': return { margin: normalizeSpace(safe) };
    case 'mx': return { 'margin-left': normalizeSpace(safe), 'margin-right': normalizeSpace(safe) };
    case 'my': return { 'margin-top': normalizeSpace(safe), 'margin-bottom': normalizeSpace(safe) };
    case 'mt': return { 'margin-top': normalizeSpace(safe) };
    case 'mr': return { 'margin-right': normalizeSpace(safe) };
    case 'mb': return { 'margin-bottom': normalizeSpace(safe) };
    case 'ml': return { 'margin-left': normalizeSpace(safe) };
    case 'background':
    case 'bg':
      return { background: safe };
    case 'w':
    case 'width':
      return { width: safe };
    case 'h':
    case 'height':
      return { height: safe };
    case 'minw':
    case 'minwidth':
      return { 'min-width': safe };
    case 'maxw':
    case 'maxwidth':
      return { 'max-width': safe };
    case 'minh':
    case 'minheight':
      return { 'min-height': safe };
    case 'maxh':
    case 'maxheight':
      return { 'max-height': safe };
    case 'align':
      return { 'align-items': safe };
    case 'alignself':
      return { 'align-self': safe };
    case 'aligncontent':
      return { 'align-content': safe };
    case 'justify':
      return { 'justify-content': safe };
    case 'flexbasis':
      return { 'flex-basis': safe };
    case 'flexgrow':
      return { 'flex-grow': safe };
    case 'flexshrink':
      return { 'flex-shrink': safe };
    case 'gridarea':
      return { 'grid-area': safe };
    case 'gridcolumn':
      return { 'grid-column': safe };
    case 'gridcolumnstart':
      return { 'grid-column-start': safe };
    case 'gridcolumnend':
      return { 'grid-column-end': safe };
    case 'gridrow':
      return { 'grid-row': safe };
    case 'gridrowstart':
      return { 'grid-row-start': safe };
    case 'gridrowend':
      return { 'grid-row-end': safe };
    case 'rowgap':
      return { 'row-gap': safe };
    case 'columngap':
      return { 'column-gap': safe };
    case 'overflowx':
      return { 'overflow-x': safe };
    case 'overflowy':
      return { 'overflow-y': safe };
    case 'zindex':
      return { 'z-index': safe };
    default:
      return { [attr]: safe };
  }
}

export class UIBox extends ElementBase {
  static get observedAttributes() {
    return [
      'classname',
      'headless',
      'variant',
      'tone',
      'elevation',
      'radius',
      'interactive',
      'disabled',
      'state',
      ...STYLE_ATTRS,
    ];
  }

  private _lastClassname = '';
  private _appliedInlineProps = new Set<string>();
  private _managedRole = false;
  private _managedTabIndex = false;
  private _managedAriaDisabled = false;
  private _managedAriaBusy = false;
  private _readyFrame: number | null = null;

  constructor() {
    super();
    this._onInteractiveKeyDown = this._onInteractiveKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this._onInteractiveKeyDown);
    this._syncInteractiveA11y();
    this._syncBusyState();
    const normalizedRadius = normalizeRadius(this.getAttribute('radius'));
    if (normalizedRadius) this.style.setProperty('--ui-box-radius', normalizedRadius);
    if (!this.hasAttribute('data-ui-ready')) {
      if (typeof requestAnimationFrame === 'function') {
        this._readyFrame = requestAnimationFrame(() => {
          this._readyFrame = null;
          this.setAttribute('data-ui-ready', '');
        });
      } else {
        this._readyFrame = window.setTimeout(() => {
          this._readyFrame = null;
          this.setAttribute('data-ui-ready', '');
        }, 16) as unknown as number;
      }
    }
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this._onInteractiveKeyDown);
    if (this._readyFrame != null) {
      if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(this._readyFrame);
      clearTimeout(this._readyFrame);
      this._readyFrame = null;
    }
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'interactive' || name === 'disabled') this._syncInteractiveA11y();
    if (name === 'state') this._syncBusyState();
    if (name === 'radius') {
      const normalizedRadius = normalizeRadius(newValue);
      if (normalizedRadius) this.style.setProperty('--ui-box-radius', normalizedRadius);
      else this.style.removeProperty('--ui-box-radius');
    }
    if (!this.isConnected) return;

    if (name === 'classname') {
      this._syncLegacyClassname();
      return;
    }

    if ((STYLE_ATTRS as readonly string[]).includes(name) && !isResponsiveStyleAttr(name as StyleAttr, newValue) && !isResponsiveStyleAttr(name as StyleAttr, oldValue)) {
      this._applyInlineStyles();
      return;
    }

    if (this.shouldRenderOnAttributeChange(name, oldValue, newValue)) this.requestRender();
  }

  private _syncInteractiveA11y() {
    const interactive = this.hasAttribute('interactive');
    const disabled = this.hasAttribute('disabled');

    if (interactive) {
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'button');
        this._managedRole = true;
      }
      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', disabled ? '-1' : '0');
        this._managedTabIndex = true;
      } else if (this._managedTabIndex) {
        this.setAttribute('tabindex', disabled ? '-1' : '0');
      }
      if (!this.hasAttribute('aria-disabled') || this._managedAriaDisabled) {
        this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
        this._managedAriaDisabled = true;
      }
      return;
    }

    if (this._managedRole) {
      this.removeAttribute('role');
      this._managedRole = false;
    }
    if (this._managedTabIndex) {
      this.removeAttribute('tabindex');
      this._managedTabIndex = false;
    }
    if (this._managedAriaDisabled) {
      this.removeAttribute('aria-disabled');
      this._managedAriaDisabled = false;
    }
  }

  private _syncBusyState() {
    const busy = this.getAttribute('state') === 'loading';
    if (busy) {
      if (!this.hasAttribute('aria-busy') || this._managedAriaBusy) {
        this.setAttribute('aria-busy', 'true');
        this._managedAriaBusy = true;
      }
      return;
    }
    if (this._managedAriaBusy) {
      this.removeAttribute('aria-busy');
      this._managedAriaBusy = false;
    }
  }

  private _onInteractiveKeyDown(event: KeyboardEvent) {
    if (!this.hasAttribute('interactive') || this.hasAttribute('disabled')) return;
    if (event.target !== this) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.click();
  }

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
        if (!value) return;
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
      xl: {},
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
      const entries = Object.entries(values).filter(([, value]) => Boolean(value));
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
    this._syncInteractiveA11y();
    this._syncBusyState();
    this._applyInlineStyles();

    const responsiveCss = this._buildResponsiveCss();
    this.setContent(`<style>${style}${responsiveCss ? `\n${responsiveCss}` : ''}</style><slot></slot>`);
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): boolean {
    if (oldValue === newValue) return false;
    if (['variant', 'tone', 'elevation', 'radius', 'interactive', 'disabled', 'state', 'headless'].includes(name)) {
      return false;
    }
    if ((STYLE_ATTRS as readonly string[]).includes(name)) {
      return isResponsiveStyleAttr(name as StyleAttr, oldValue) || isResponsiveStyleAttr(name as StyleAttr, newValue);
    }
    return name === 'classname';
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-box')) {
  customElements.define('ui-box', UIBox);
}
