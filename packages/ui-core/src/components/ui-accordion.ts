import { ElementBase } from '../ElementBase';

type SourceItem = {
  index: number;
  itemNode: HTMLElement;
  trigger: HTMLButtonElement | null;
  panel: HTMLElement | null;
  disabled: boolean;
  description: string;
  badge: string;
};

const LIGHT_DOM_STYLE = `
  ui-accordion[data-ui-accordion-root="true"] {
    display: block;
    overflow-anchor: none;
    --ui-accordion-radius: var(--base-card-radius, var(--ui-radius, 4px));
    --ui-accordion-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-accordion-border-color: color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 82%, transparent);
    --ui-accordion-border: 1px solid var(--ui-accordion-border-color);
    --ui-accordion-divider: color-mix(in srgb, var(--ui-accordion-border-color) 78%, transparent);
    --ui-accordion-surface-base: var(--base-card-bg, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-accordion-surface-alt-base: var(--color-surface, var(--ui-color-surface-alt, #f8fafc));
    --ui-accordion-surface: var(--ui-accordion-surface-base);
    --ui-accordion-surface-alt: var(--ui-accordion-surface-alt-base);
    --ui-accordion-hover-surface: color-mix(in srgb, var(--ui-accordion-accent) 6%, var(--ui-accordion-surface-alt));
    --ui-accordion-open-surface: color-mix(in srgb, var(--ui-accordion-accent) 5%, var(--ui-accordion-surface));
    --ui-accordion-text: var(--ui-color-text, var(--ui-text, #202020));
    --ui-accordion-muted: var(--ui-color-muted, var(--ui-muted, #646464));
    --ui-accordion-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-accordion-shadow: var(--base-card-shadow, var(--shadow-2, none));
    --ui-accordion-duration: 190ms;
    --ui-accordion-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
    --ui-accordion-padding-x: 16px;
    --ui-accordion-padding-y: 14px;
    --ui-accordion-gap: var(--ui-default-gap, 8px);
    --ui-accordion-title-size: var(--ui-default-font-size, 14px);
    --ui-accordion-title-line-height: var(--ui-default-line-height, 20px);
    --ui-accordion-title-weight: 600;
    --ui-accordion-description-size: 12px;
    --ui-accordion-description-line-height: 16px;
    --ui-accordion-panel-size: 14px;
    --ui-accordion-panel-line-height: 20px;
    --ui-accordion-badge-radius: 999px;
    --ui-accordion-indicator-size: 3px;
    color-scheme: light dark;
  }

  ui-accordion[data-ui-accordion-root="true"][size="sm"],
  ui-accordion[data-ui-accordion-root="true"][size="1"] {
    --ui-accordion-padding-x: 12px;
    --ui-accordion-padding-y: 10px;
    --ui-accordion-gap: 6px;
    --ui-accordion-title-size: 13px;
    --ui-accordion-title-line-height: 18px;
    --ui-accordion-description-size: 11px;
    --ui-accordion-description-line-height: 14px;
    --ui-accordion-panel-size: 13px;
    --ui-accordion-panel-line-height: 18px;
  }

  ui-accordion[data-ui-accordion-root="true"][size="lg"],
  ui-accordion[data-ui-accordion-root="true"][size="3"] {
    --ui-accordion-padding-x: 20px;
    --ui-accordion-padding-y: 18px;
    --ui-accordion-gap: 10px;
    --ui-accordion-title-size: 16px;
    --ui-accordion-title-line-height: 24px;
    --ui-accordion-description-size: 13px;
    --ui-accordion-description-line-height: 18px;
    --ui-accordion-panel-size: 15px;
    --ui-accordion-panel-line-height: 24px;
  }

  ui-accordion[data-ui-accordion-root="true"][tone="success"] {
    --ui-accordion-accent: var(--ui-color-success, #16a34a);
  }

  ui-accordion[data-ui-accordion-root="true"][tone="warning"] {
    --ui-accordion-accent: var(--ui-color-warning, #d97706);
  }

  ui-accordion[data-ui-accordion-root="true"][tone="danger"] {
    --ui-accordion-accent: var(--ui-color-danger, #dc2626);
  }

  ui-accordion[data-ui-accordion-root="true"][variant="outline"] {
    --ui-accordion-shadow: none;
    --ui-accordion-border-color: color-mix(in srgb, var(--ui-accordion-accent) 18%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-accordion-open-surface: color-mix(in srgb, var(--ui-accordion-accent) 4%, var(--ui-accordion-surface));
    --ui-accordion-hover-surface: color-mix(in srgb, var(--ui-accordion-accent) 8%, var(--ui-accordion-surface-alt));
  }

  ui-accordion[data-ui-accordion-root="true"][variant="soft"] {
    --ui-accordion-shadow: none;
    --ui-accordion-surface: color-mix(in srgb, var(--ui-accordion-accent) 4%, var(--ui-accordion-surface-base));
    --ui-accordion-open-surface: color-mix(in srgb, var(--ui-accordion-accent) 8%, var(--ui-accordion-surface-base));
    --ui-accordion-hover-surface: color-mix(in srgb, var(--ui-accordion-accent) 10%, var(--ui-accordion-surface-alt-base));
    --ui-accordion-border-color: color-mix(in srgb, var(--ui-accordion-accent) 12%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
  }

  ui-accordion[data-ui-accordion-root="true"][variant="solid"] {
    --ui-accordion-surface: color-mix(in srgb, var(--ui-accordion-accent) 10%, var(--ui-accordion-surface-base));
    --ui-accordion-open-surface: color-mix(in srgb, var(--ui-accordion-accent) 16%, var(--ui-accordion-surface-base));
    --ui-accordion-hover-surface: color-mix(in srgb, var(--ui-accordion-accent) 13%, var(--ui-accordion-surface-alt-base));
    --ui-accordion-border-color: color-mix(in srgb, var(--ui-accordion-accent) 22%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-accordion-shadow: 0 1px 3px rgba(15, 23, 42, 0.05), 0 18px 36px color-mix(in srgb, var(--ui-accordion-accent) 10%, rgba(15, 23, 42, 0.08));
  }

  ui-accordion[data-ui-accordion-root="true"][variant="ghost"] {
    --ui-accordion-surface: transparent;
    --ui-accordion-surface-alt: transparent;
    --ui-accordion-open-surface: color-mix(in srgb, var(--ui-accordion-accent) 8%, transparent);
    --ui-accordion-hover-surface: color-mix(in srgb, var(--ui-accordion-accent) 10%, transparent);
    --ui-accordion-shadow: none;
    --ui-accordion-border-color: color-mix(in srgb, var(--ui-accordion-accent) 12%, transparent);
  }

  ui-accordion[data-ui-accordion-root="true"][variant="glass"] {
    --ui-accordion-surface: linear-gradient(180deg, color-mix(in srgb, var(--color-panel-solid, var(--ui-color-surface, #ffffff)) 88%, #ffffff 12%), color-mix(in srgb, var(--color-panel-solid, var(--ui-color-surface, #ffffff)) 94%, transparent));
    --ui-accordion-shadow: var(--base-panel-shadow, var(--shadow-4, none));
  }

  ui-accordion[data-ui-accordion-root="true"][elevation="none"] {
    --ui-accordion-shadow: none;
  }

  ui-accordion[data-ui-accordion-root="true"][elevation="low"] {
    --ui-accordion-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 10px 22px rgba(15, 23, 42, 0.09);
  }

  ui-accordion[data-ui-accordion-root="true"][elevation="high"] {
    --ui-accordion-shadow: 0 2px 10px rgba(15, 23, 42, 0.08), 0 30px 58px rgba(15, 23, 42, 0.16);
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item] {
    margin: 0;
    position: relative;
    background: var(--ui-accordion-surface);
    color: var(--ui-accordion-text);
    border-inline: var(--ui-accordion-border);
    overflow: clip;
    transition: background var(--ui-accordion-duration) var(--ui-accordion-easing);
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item]:first-of-type {
    border-block-start: var(--ui-accordion-border);
    border-start-start-radius: var(--ui-accordion-radius);
    border-start-end-radius: var(--ui-accordion-radius);
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item]:last-of-type {
    border-block-end: var(--ui-accordion-border);
    border-end-start-radius: var(--ui-accordion-radius);
    border-end-end-radius: var(--ui-accordion-radius);
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item] + [data-ui-accordion-item] {
    border-block-start: 1px solid var(--ui-accordion-divider);
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item]::before {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    inline-size: 0;
    background: linear-gradient(180deg, var(--ui-accordion-accent) 0%, color-mix(in srgb, var(--ui-accordion-accent) 70%, #0f172a 30%) 100%);
    transition: inline-size var(--ui-accordion-duration) var(--ui-accordion-easing);
    pointer-events: none;
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item][open] {
    background: var(--ui-accordion-open-surface);
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item][open]::before {
    inline-size: var(--ui-accordion-indicator-size);
  }

  ui-accordion[data-ui-accordion-root="true"][indicator="none"] > [data-ui-accordion-item]::before {
    display: none;
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item][data-disabled="true"] {
    opacity: 0.62;
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-trigger] {
    inline-size: 100%;
    border: none;
    background: transparent;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ui-accordion-gap);
    font: inherit;
    font-size: var(--ui-accordion-title-size);
    font-weight: var(--ui-accordion-title-weight);
    letter-spacing: var(--ui-default-letter-spacing, 0em);
    line-height: var(--ui-accordion-title-line-height);
    padding: var(--ui-accordion-padding-y) var(--ui-accordion-padding-x);
    cursor: pointer;
    text-align: left;
    transition: background var(--ui-accordion-duration) var(--ui-accordion-easing), color var(--ui-accordion-duration) var(--ui-accordion-easing);
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-trigger]:not([disabled]):hover {
    background: var(--ui-accordion-hover-surface);
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item][open] [data-ui-accordion-trigger] {
    color: color-mix(in srgb, var(--ui-accordion-text) 82%, var(--ui-accordion-accent) 18%);
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-trigger]:focus-visible {
    outline: 2px solid var(--ui-accordion-focus-ring);
    outline-offset: -2px;
    position: relative;
    z-index: 1;
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-trigger][disabled] {
    opacity: 0.56;
    cursor: not-allowed;
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-item-body] {
    flex: 1;
    min-inline-size: 0;
    display: grid;
    gap: 2px;
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-trailing] {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex: 0 0 auto;
    min-inline-size: 0;
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-generated-badge] {
    border-radius: var(--ui-accordion-badge-radius);
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    line-height: 1.2;
    background: color-mix(in srgb, var(--ui-accordion-accent) 14%, transparent);
    color: color-mix(in srgb, var(--ui-accordion-accent) 84%, var(--ui-accordion-text) 16%);
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-chevron] {
    inline-size: 18px;
    block-size: 18px;
    min-inline-size: 18px;
    color: var(--ui-accordion-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    transition: transform var(--ui-accordion-duration) var(--ui-accordion-easing), color var(--ui-accordion-duration) var(--ui-accordion-easing);
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item][open] [data-ui-accordion-chevron] {
    transform: rotate(180deg);
    color: var(--ui-accordion-accent);
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-generated-description] {
    display: block;
    padding: 0 var(--ui-accordion-padding-x) 10px;
    font-size: var(--ui-accordion-description-size);
    line-height: var(--ui-accordion-description-line-height);
    color: color-mix(in srgb, var(--ui-accordion-text) 62%, var(--ui-accordion-muted) 38%);
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-generated-description][hidden] {
    display: none;
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-panel] {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    font-size: var(--ui-accordion-panel-size);
    line-height: var(--ui-accordion-panel-line-height);
    color: color-mix(in srgb, var(--ui-accordion-text) 88%, var(--ui-accordion-muted) 12%);
    padding: 0 var(--ui-accordion-padding-x);
    border-top: 1px solid transparent;
    transform: translateY(-4px);
    transition:
      max-height var(--ui-accordion-duration) var(--ui-accordion-easing),
      opacity var(--ui-accordion-duration) var(--ui-accordion-easing),
      transform var(--ui-accordion-duration) var(--ui-accordion-easing),
      padding var(--ui-accordion-duration) var(--ui-accordion-easing),
      border-color var(--ui-accordion-duration) var(--ui-accordion-easing);
    will-change: max-height;
  }

  ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item][open] [data-ui-accordion-panel] {
    max-height: var(--ui-accordion-panel-height, 0px);
    opacity: 1;
    transform: translateY(0);
    padding: 0 var(--ui-accordion-padding-x) 14px;
    border-top-color: color-mix(in srgb, var(--ui-accordion-accent) 24%, transparent);
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-panel] > :first-child {
    margin-top: 12px;
  }

  ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-panel] > :last-child {
    margin-bottom: 0;
  }

  @media (max-width: 720px) {
    ui-accordion[data-ui-accordion-root="true"] {
      --ui-accordion-padding-x: 12px;
      --ui-accordion-padding-y: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item],
    ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-trigger],
    ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-chevron],
    ui-accordion[data-ui-accordion-root="true"] [data-ui-accordion-panel] {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    ui-accordion[data-ui-accordion-root="true"] {
      --ui-accordion-border: 2px solid var(--ui-color-border, currentColor);
      --ui-accordion-divider: currentColor;
      --ui-accordion-focus-ring: currentColor;
      --ui-accordion-shadow: none;
    }
  }

  @media (forced-colors: active) {
    ui-accordion[data-ui-accordion-root="true"] {
      --ui-accordion-surface: Canvas;
      --ui-accordion-surface-alt: Canvas;
      --ui-accordion-text: CanvasText;
      --ui-accordion-muted: CanvasText;
      --ui-accordion-accent: Highlight;
      --ui-accordion-border: 1px solid CanvasText;
      --ui-accordion-divider: CanvasText;
      --ui-accordion-focus-ring: Highlight;
      --ui-accordion-shadow: none;
    }

    ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item][open] [data-ui-accordion-trigger] {
      background: Highlight;
      color: HighlightText;
    }

    ui-accordion[data-ui-accordion-root="true"] > [data-ui-accordion-item][open] [data-ui-accordion-chevron] {
      color: HighlightText;
    }
  }
`;

function normalizeIndex(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return -1;
  const rounded = Math.trunc(parsed);
  return rounded >= 0 ? rounded : -1;
}

function toBoolean(value: string | null, fallback: boolean): boolean {
  if (value == null) return fallback;
  const normalized = value.toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'no';
}

function parseOpen(value: string | null, multiple: boolean): number[] {
  if (!value) return [];
  if (!multiple) {
    const index = normalizeIndex(value);
    return index >= 0 ? [index] : [];
  }
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(normalizeIndex).filter((index) => index >= 0);
  } catch {}
  const index = normalizeIndex(value);
  return index >= 0 ? [index] : [];
}

function serializeOpen(value: number[], multiple: boolean): string {
  return multiple ? JSON.stringify(value) : String(value[0] ?? -1);
}

function normalizeRadius(value: string | null, fallback = 'var(--base-card-radius, var(--ui-radius, 4px))'): string {
  if (!value || !value.trim()) return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'full' || normalized === 'pill') return '999px';
  if (normalized === 'square' || normalized === 'none') return '0px';
  if (/^-?\d+(\.\d+)?$/.test(normalized)) return `${normalized}px`;
  return value.trim();
}

function isAccordionItemNode(node: Element): node is HTMLElement {
  return node instanceof HTMLElement && node.hasAttribute('data-ui-accordion-item');
}

export class UIAccordion extends ElementBase {
  static get observedAttributes() {
    return ['open', 'multiple', 'collapsible', 'headless', 'shape', 'elevation', 'variant', 'size', 'tone', 'radius', 'indicator'];
  }

  private _uid = `ui-accordion-${Math.random().toString(36).slice(2, 8)}`;
  private _observer: MutationObserver | null = null;
  private _panelResizeObserver: ResizeObserver | null = null;
  private _heightSyncRaf = 0;
  private _syncingOpenAttr = false;
  private _syncingDom = false;
  private _syncingDomResetTimer: number | null = null;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onMutations = this._onMutations.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('data-ui-accordion-root', 'true');
    this._syncHostStyles();
    this.addEventListener('click', this._onClick as EventListener);
    this.addEventListener('keydown', this._onKeyDown as EventListener);

    this._observer = new MutationObserver(this._onMutations);
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    if (typeof ResizeObserver !== 'undefined') {
      this._panelResizeObserver = new ResizeObserver(() => {
        this._syncPanelHeights();
      });
    }
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick as EventListener);
    this.removeEventListener('keydown', this._onKeyDown as EventListener);
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._panelResizeObserver) {
      this._panelResizeObserver.disconnect();
      this._panelResizeObserver = null;
    }
    if (this._heightSyncRaf) {
      cancelAnimationFrame(this._heightSyncRaf);
      this._heightSyncRaf = 0;
    }
    if (this._syncingDomResetTimer != null) {
      clearTimeout(this._syncingDomResetTimer);
      this._syncingDomResetTimer = null;
    }
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'radius' || name === 'shape') {
      this._syncHostStyles();
      return;
    }
    if (!this.isConnected) return;
    if (name === 'open') {
      this._applyOpenState();
      return;
    }
    this.requestRender();
  }

  get multiple() {
    return this.hasAttribute('multiple');
  }

  set multiple(value: boolean) {
    if (value === this.multiple) return;
    if (value) this.setAttribute('multiple', '');
    else this.removeAttribute('multiple');
  }

  get collapsible() {
    return toBoolean(this.getAttribute('collapsible'), true);
  }

  set collapsible(value: boolean) {
    this.setAttribute('collapsible', String(Boolean(value)));
  }

  get open(): number | number[] {
    const normalized = this._normalizeOpen(this._sourceItems());
    return this.multiple ? normalized : (normalized[0] ?? -1);
  }

  set open(value: number | number[]) {
    const next = Array.isArray(value) ? value : [value];
    this._commitOpen(next.map(normalizeIndex).filter((index) => index >= 0), false);
  }

  private _sourceItems(): SourceItem[] {
    const nodes = Array.from(this.children).filter(isAccordionItemNode);
    return nodes.map((itemNode, index) => {
      const directChildren = Array.from(itemNode.children) as HTMLElement[];
      const trigger =
        (directChildren.find((child) => child.hasAttribute('data-ui-accordion-trigger')) as HTMLButtonElement | undefined) ||
        null;
      const panel =
        (directChildren.find((child) => child.hasAttribute('data-ui-accordion-panel')) as HTMLElement | undefined) ||
        null;
      return {
        index,
        itemNode,
        trigger,
        panel,
        disabled: itemNode.hasAttribute('disabled') || trigger?.hasAttribute('disabled') || false,
        description: itemNode.getAttribute('description') || itemNode.getAttribute('data-description') || '',
        badge: itemNode.getAttribute('badge') || itemNode.getAttribute('data-badge') || '',
      };
    });
  }

  private _normalizeOpen(items: SourceItem[]): number[] {
    const parsed = parseOpen(this.getAttribute('open'), this.multiple);
    const valid = Array.from(
      new Set(parsed.map(normalizeIndex).filter((index) => index >= 0 && index < items.length && !items[index]?.disabled))
    ).sort((a, b) => a - b);
    const fallback = items.findIndex((item) => !item.disabled);

    if (this.multiple) {
      if (this.collapsible || items.length === 0 || valid.length > 0) return valid;
      return fallback >= 0 ? [fallback] : [];
    }

    if (valid.length > 0) return [valid[0]];
    if (this.collapsible || items.length === 0) return [];
    return fallback >= 0 ? [fallback] : [];
  }

  private _normalizeNext(next: number[], items: SourceItem[]): number[] {
    const valid = Array.from(
      new Set(next.map(normalizeIndex).filter((index) => index >= 0 && index < items.length && !items[index]?.disabled))
    ).sort((a, b) => a - b);
    const fallback = items.findIndex((item) => !item.disabled);

    if (this.multiple) {
      if (this.collapsible || items.length === 0 || valid.length > 0) return valid;
      return fallback >= 0 ? [fallback] : [];
    }

    if (valid.length > 0) return [valid[0]];
    if (this.collapsible || items.length === 0) return [];
    return fallback >= 0 ? [fallback] : [];
  }

  private _commitOpen(next: number[], emit: boolean) {
    const items = this._sourceItems();
    const normalized = this._normalizeNext(next, items);
    const serialized = serializeOpen(normalized, this.multiple);
    const previous = this.getAttribute('open') ?? (this.multiple ? '[]' : '-1');

    if (serialized !== previous) {
      this._syncingOpenAttr = true;
      this.setAttribute('open', serialized);
      this._syncingOpenAttr = false;
      this._applyOpenState();
    }

    if (!emit) return;
    const detailOpen: number | number[] = this.multiple ? normalized : (normalized[0] ?? -1);
    this.dispatchEvent(new CustomEvent('toggle', { detail: { open: detailOpen }, bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { detail: { open: detailOpen }, bubbles: true }));
  }

  private _ensureStyleNode() {
    let styleNode = this.querySelector(':scope > style[data-ui-accordion-style]') as HTMLStyleElement | null;
    if (!styleNode) {
      styleNode = document.createElement('style');
      styleNode.setAttribute('data-ui-accordion-style', '');
      styleNode.textContent = LIGHT_DOM_STYLE;
      this.prepend(styleNode);
      return;
    }
    if (styleNode.textContent !== LIGHT_DOM_STYLE) styleNode.textContent = LIGHT_DOM_STYLE;
  }

  private _markSyncingDom() {
    this._syncingDom = true;
    if (this._syncingDomResetTimer != null) clearTimeout(this._syncingDomResetTimer);
    this._syncingDomResetTimer = window.setTimeout(() => {
      this._syncingDom = false;
      this._syncingDomResetTimer = null;
    }, 0);
  }

  private _syncHostStyles() {
    const radius = this.getAttribute('radius');
    const shape = this.getAttribute('shape');
    if (radius && radius.trim()) {
      this.style.setProperty('--ui-accordion-radius', normalizeRadius(radius));
      return;
    }
    if (shape === 'square') {
      this.style.setProperty('--ui-accordion-radius', '4px');
      return;
    }
    if (shape === 'pill') {
      this.style.setProperty('--ui-accordion-radius', '999px');
      return;
    }
    this.style.removeProperty('--ui-accordion-radius');
  }

  private _ensureGeneratedNodes(item: SourceItem) {
    const { trigger, itemNode, description, badge } = item;
    if (!trigger) return;

    let trailing = trigger.querySelector('[data-ui-accordion-trailing]') as HTMLElement | null;
    if (!trailing) {
      trailing = document.createElement('span');
      trailing.setAttribute('data-ui-accordion-trailing', '');
      trigger.appendChild(trailing);
    }

    let badgeNode = trailing.querySelector('[data-ui-accordion-generated-badge]') as HTMLElement | null;
    if (badge) {
      if (!badgeNode) {
        badgeNode = document.createElement('span');
        badgeNode.setAttribute('data-ui-accordion-generated-badge', '');
        trailing.appendChild(badgeNode);
      }
      badgeNode.textContent = badge;
    } else if (badgeNode) {
      badgeNode.remove();
    }

    let chevron = trailing.querySelector('[data-ui-accordion-chevron]') as HTMLElement | null;
    if (!chevron) {
      chevron = document.createElement('span');
      chevron.setAttribute('data-ui-accordion-chevron', '');
      chevron.setAttribute('aria-hidden', 'true');
      chevron.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 7.5 10 12.5 15 7.5"></path>
        </svg>
      `;
      trailing.appendChild(chevron);
    }

    let descriptionNode = itemNode.querySelector(':scope > [data-ui-accordion-generated-description]') as HTMLElement | null;
    if (description) {
      if (!descriptionNode) {
        descriptionNode = document.createElement('div');
        descriptionNode.setAttribute('data-ui-accordion-generated-description', '');
        const panel = item.panel;
        if (panel) itemNode.insertBefore(descriptionNode, panel);
        else itemNode.appendChild(descriptionNode);
      }
      descriptionNode.textContent = description;
      descriptionNode.hidden = false;
    } else if (descriptionNode) {
      descriptionNode.hidden = true;
    }
  }

  private _applyOpenState() {
    this._markSyncingDom();
    const items = this._sourceItems();
    const normalized = this._normalizeOpen(items);
    const serialized = serializeOpen(normalized, this.multiple);
    const current = this.getAttribute('open') ?? (this.multiple ? '[]' : '-1');
    if (serialized !== current && !this._syncingOpenAttr) {
      this._syncingOpenAttr = true;
      this.setAttribute('open', serialized);
      this._syncingOpenAttr = false;
    }

    const openSet = new Set(normalized);
    items.forEach((item) => {
      const { itemNode, trigger, panel } = item;
      const isOpen = openSet.has(item.index);
      itemNode.setAttribute('data-disabled', item.disabled ? 'true' : 'false');
      if (isOpen) itemNode.setAttribute('open', '');
      else itemNode.removeAttribute('open');

      if (trigger) {
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        trigger.disabled = item.disabled;
      }

      if (panel) {
        const extraHeight = isOpen ? 32 : 0;
        panel.style.setProperty('--ui-accordion-panel-height', `${panel.scrollHeight + extraHeight}px`);
        panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      }
    });

    this._queuePanelHeightSync();
  }

  private _observePanels(items: SourceItem[]) {
    if (!this._panelResizeObserver) return;
    this._panelResizeObserver.disconnect();
    items.forEach((item) => {
      if (item.panel) this._panelResizeObserver?.observe(item.panel);
    });
  }

  private _syncPanelHeights() {
    this._sourceItems().forEach((item) => {
      if (!item.panel) return;
      const isOpen = item.itemNode.hasAttribute('open');
      const extraHeight = isOpen ? 32 : 0;
      item.panel.style.setProperty('--ui-accordion-panel-height', `${item.panel.scrollHeight + extraHeight}px`);
    });
  }

  private _queuePanelHeightSync() {
    if (this._heightSyncRaf) cancelAnimationFrame(this._heightSyncRaf);
    this._heightSyncRaf = requestAnimationFrame(() => {
      this._syncPanelHeights();
      this._heightSyncRaf = requestAnimationFrame(() => {
        this._syncPanelHeights();
        this._heightSyncRaf = 0;
      });
    });
  }

  private _syncLightDom() {
    if (this.hasAttribute('headless')) return;
    const items = this._sourceItems();
    this._markSyncingDom();
    this.setAttribute('data-ui-accordion-root', 'true');
    this._syncHostStyles();
    this._ensureStyleNode();

    items.forEach((item) => {
      const { itemNode, trigger, panel, index, disabled } = item;
      itemNode.setAttribute('data-disabled', disabled ? 'true' : 'false');
      if (trigger) {
        const triggerId = `${this._uid}-trigger-${index}`;
        const panelId = `${this._uid}-panel-${index}`;
        if (!trigger.id) trigger.id = triggerId;
        trigger.setAttribute('type', 'button');
        trigger.setAttribute('aria-controls', panelId);
        trigger.setAttribute('data-index', String(index));
        if (disabled) trigger.setAttribute('disabled', '');
        else trigger.removeAttribute('disabled');
        this._ensureGeneratedNodes(item);
      }
      if (panel) {
        const panelId = `${this._uid}-panel-${index}`;
        panel.id = panelId;
        panel.setAttribute('role', 'region');
        if (trigger) panel.setAttribute('aria-labelledby', trigger.id);
      }
    });
    this._observePanels(items);
    this._applyOpenState();
  }

  private _onMutations(records: MutationRecord[]) {
    if (this._syncingDom) return;
    const shouldRender = records.some((record) => {
      if (record.target === this && record.type === 'attributes') {
        const name = record.attributeName || '';
        return !['open', 'multiple', 'collapsible', 'headless', 'shape', 'elevation', 'variant', 'size', 'tone', 'radius', 'indicator', 'data-ui-accordion-root', 'style'].includes(name);
      }
      if (record.target instanceof HTMLStyleElement && record.target.hasAttribute('data-ui-accordion-style')) return false;
      return true;
    });
    if (!shouldRender) return;
    this.requestRender();
  }

  private _toggleIndex(index: number) {
    const items = this._sourceItems();
    if (index < 0 || index >= items.length || items[index].disabled) return;

    const current = this._normalizeOpen(items);
    const isOpen = current.includes(index);
    let next = [...current];

    if (this.multiple) {
      if (isOpen) next = current.filter((value) => value !== index);
      else next.push(index);
    } else {
      next = isOpen ? [] : [index];
    }

    this._commitOpen(next, true);
  }

  private _onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[data-ui-accordion-trigger]') as HTMLButtonElement | null;
    if (!trigger || trigger.disabled || !this.contains(trigger)) return;
    const index = normalizeIndex(trigger.getAttribute('data-index'));
    this._toggleIndex(index);
  }

  private _onKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[data-ui-accordion-trigger]') as HTMLButtonElement | null;
    if (!trigger || !this.contains(trigger)) return;

    const enabled = this._sourceItems()
      .map((item) => item.trigger)
      .filter((item): item is HTMLButtonElement => !!item && !item.disabled);
    const currentIndex = enabled.indexOf(trigger);
    if (currentIndex < 0) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const index = normalizeIndex(trigger.getAttribute('data-index'));
      this._toggleIndex(index);
      return;
    }

    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % enabled.length;
    if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = enabled.length - 1;

    event.preventDefault();
    enabled[nextIndex]?.focus({ preventScroll: true });
  }

  protected render() {
    this.setContent('<slot></slot>');
    if (!this.hasAttribute('headless')) this._syncLightDom();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-accordion')) {
  customElements.define('ui-accordion', UIAccordion);
}
