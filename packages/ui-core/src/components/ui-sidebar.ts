import { ElementBase } from '../ElementBase';

type SidebarTone = 'default' | 'brand' | 'success' | 'warning' | 'danger';
type ResizeSource = 'pointer' | 'keyboard' | 'api' | 'attribute';

type SidebarItemInput = {
  value?: string;
  label?: string;
  icon?: string;
  badge?: string;
  description?: string;
  section?: string;
  disabled?: boolean;
  active?: boolean;
  tone?: SidebarTone;
};

type SidebarItem = {
  index: number;
  value: string;
  label: string;
  icon: string;
  badge: string;
  description: string;
  section: string;
  disabled: boolean;
  active: boolean;
  tone: SidebarTone;
};

type DragState = {
  pointerId: number;
  startX: number;
  startWidth: number;
};

const SIZE_WIDTHS: Record<string, { expanded: number; collapsed: number }> = {
  sm: { expanded: 244, collapsed: 68 },
  md: { expanded: 280, collapsed: 78 },
  lg: { expanded: 304, collapsed: 84 }
};

const style = `
  :host {
    --ui-sidebar-width: 280px;
    --ui-sidebar-collapsed-width: 78px;
    --ui-sidebar-current-width: var(--ui-sidebar-width);
    --ui-sidebar-padding: 12px;
    --ui-sidebar-gap: 10px;
    --ui-sidebar-radius: 16px;
    --ui-sidebar-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-sidebar-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-sidebar-text: var(--ui-color-text, #0f172a);
    --ui-sidebar-muted: var(--ui-color-muted, #64748b);
    --ui-sidebar-accent: var(--ui-color-primary, #2563eb);
    --ui-sidebar-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-sidebar-shadow:
      none;
    --ui-sidebar-resize-hit-area: 12px;

    --ui-sidebar-item-radius: 12px;
    --ui-sidebar-item-height: 42px;
    --ui-sidebar-item-padding-x: 12px;
    --ui-sidebar-item-gap: 10px;

    color-scheme: light dark;
    display: block;
    inline-size: var(--ui-sidebar-current-width);
    max-inline-size: 100%;
    min-inline-size: 0;
    box-sizing: border-box;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .shell {
    position: relative;
    min-inline-size: 0;
    min-block-size: 100%;
    display: grid;
    grid-template-rows: auto auto auto minmax(0, 1fr) auto;
    gap: var(--ui-sidebar-gap);
    padding: var(--ui-sidebar-padding);
    border: 1px solid var(--ui-sidebar-border);
    border-radius: var(--ui-sidebar-radius);
    background: var(--ui-sidebar-bg);
    color: var(--ui-sidebar-text);
    box-shadow: var(--ui-sidebar-shadow);
    box-sizing: border-box;
    transition:
      inline-size 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease,
      box-shadow 180ms ease;
  }

  :host([position="right"]) .shell {
    direction: rtl;
  }

  :host([position="right"]) .header,
  :host([position="right"]) .controls,
  :host([position="right"]) .search,
  :host([position="right"]) .menu,
  :host([position="right"]) .footer {
    direction: ltr;
  }

  .header,
  .footer {
    min-inline-size: 0;
  }

  .header {
    padding: 2px 4px;
  }

  .footer {
    font-size: 12px;
    color: var(--ui-sidebar-muted);
    padding: 4px;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-block-size: 30px;
  }

  .controls[hidden] {
    display: none;
  }

  .collapse-btn {
    inline-size: 30px;
    block-size: 30px;
    border-radius: 9px;
    border: 1px solid color-mix(in srgb, var(--ui-sidebar-border) 75%, #94a3b8 25%);
    background: color-mix(in srgb, var(--ui-sidebar-bg) 82%, transparent);
    color: inherit;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    transition: background-color 140ms ease, border-color 140ms ease;
  }

  .collapse-btn:hover {
    background: color-mix(in srgb, var(--ui-sidebar-accent) 12%, transparent);
    border-color: color-mix(in srgb, var(--ui-sidebar-accent) 34%, var(--ui-sidebar-border));
  }

  .collapse-btn:focus-visible {
    outline: 2px solid var(--ui-sidebar-focus);
    outline-offset: 1px;
  }

  .search {
    min-inline-size: 0;
    display: none;
  }

  .search[data-has="true"] {
    display: block;
  }

  .menu {
    min-inline-size: 0;
    min-block-size: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    gap: 9px;
    padding-inline-end: 2px;
  }

  .menu-empty {
    font-size: 12px;
    color: var(--ui-sidebar-muted);
    border: 1px dashed color-mix(in srgb, var(--ui-sidebar-border) 74%, transparent);
    border-radius: 10px;
    padding: 10px;
  }

  .group {
    min-inline-size: 0;
    display: grid;
    gap: 4px;
  }

  .group-label {
    margin: 0;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ui-sidebar-muted);
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 4px;
  }

  .item {
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: var(--ui-sidebar-item-height);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--ui-sidebar-item-gap);
    border: 1px solid transparent;
    border-radius: var(--ui-sidebar-item-radius);
    background: transparent;
    color: inherit;
    padding: 8px var(--ui-sidebar-item-padding-x);
    text-align: left;
    cursor: pointer;
    font: 500 13px/1.3 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    transition:
      background-color 140ms ease,
      border-color 140ms ease,
      color 140ms ease,
      transform 140ms ease;
  }

  .item:hover {
    background: color-mix(in srgb, var(--ui-sidebar-accent) 9%, transparent);
  }

  .item[data-active="true"] {
    background: color-mix(in srgb, var(--ui-sidebar-accent) 16%, transparent);
    border-color: color-mix(in srgb, var(--ui-sidebar-accent) 38%, transparent);
    color: color-mix(in srgb, var(--ui-sidebar-accent) 86%, #0f172a 14%);
    font-weight: 600;
  }

  .item:focus-visible {
    outline: 2px solid var(--ui-sidebar-focus);
    outline-offset: 1px;
  }

  .item:active {
    transform: translateY(0.5px);
  }

  .item[disabled] {
    opacity: 0.46;
    cursor: not-allowed;
    transform: none;
  }

  .item[data-tone="success"][data-active="true"] {
    --ui-sidebar-accent: var(--ui-color-success, #16a34a);
  }

  .item[data-tone="warning"][data-active="true"] {
    --ui-sidebar-accent: var(--ui-color-warning, #d97706);
  }

  .item[data-tone="danger"][data-active="true"] {
    --ui-sidebar-accent: var(--ui-color-danger, #dc2626);
  }

  .icon {
    inline-size: 18px;
    block-size: 18px;
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
  }

  .icon ui-icon {
    --ui-icon-size: 16px;
    inline-size: 18px;
    block-size: 18px;
    pointer-events: none;
  }

  .meta {
    min-inline-size: 0;
    display: grid;
    gap: 2px;
  }

  .label,
  .description {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .description {
    font-size: 11px;
    color: color-mix(in srgb, currentColor 62%, transparent);
  }

  .badge {
    border: 1px solid color-mix(in srgb, currentColor 24%, transparent);
    border-radius: 999px;
    padding: 1px 7px;
    font-size: 11px;
    line-height: 1.25;
    background: color-mix(in srgb, currentColor 10%, transparent);
    white-space: nowrap;
  }

  .icon[hidden],
  .meta[hidden],
  .badge[hidden],
  .resize-handle[hidden] {
    display: none;
  }

  :host([collapsed]) .group-label,
  :host([rail]) .group-label,
  :host([collapsed]) .meta,
  :host([rail]) .meta,
  :host([collapsed]) .badge,
  :host([rail]) .badge {
    display: none;
  }

  :host([collapsed]) .item,
  :host([rail]) .item {
    grid-template-columns: 1fr;
    justify-items: center;
    padding-inline: 8px;
  }

  :host([show-icons="false"]) .icon {
    display: none;
  }

  :host([show-badges="false"]) .badge {
    display: none;
  }

  :host([density="compact"]) {
    --ui-sidebar-padding: 10px;
    --ui-sidebar-gap: 8px;
    --ui-sidebar-item-height: 36px;
    --ui-sidebar-item-padding-x: 10px;
    --ui-sidebar-item-gap: 8px;
  }

  :host([density="comfortable"]) {
    --ui-sidebar-padding: 14px;
    --ui-sidebar-gap: 12px;
    --ui-sidebar-item-height: 46px;
    --ui-sidebar-item-padding-x: 13px;
    --ui-sidebar-item-gap: 11px;
  }

  :host([size="sm"]) {
    --ui-sidebar-width: 244px;
    --ui-sidebar-collapsed-width: 68px;
  }

  :host([size="lg"]) {
    --ui-sidebar-width: 304px;
    --ui-sidebar-collapsed-width: 84px;
  }

  :host([variant="soft"]) {
    --ui-sidebar-bg: color-mix(in srgb, var(--ui-sidebar-accent) 8%, var(--ui-color-surface, #ffffff));
    --ui-sidebar-border: color-mix(in srgb, var(--ui-sidebar-accent) 28%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="floating"]) {
    --ui-sidebar-shadow:
      0 10px 22px rgba(2, 6, 23, 0.16),
      0 34px 64px rgba(2, 6, 23, 0.2);
  }

  :host([variant="minimal"]) {
    --ui-sidebar-bg: transparent;
    --ui-sidebar-border: transparent;
    --ui-sidebar-shadow: none;
  }

  :host([variant="contrast"]) {
    --ui-sidebar-bg: #0f172a;
    --ui-sidebar-border: #334155;
    --ui-sidebar-text: #e2e8f0;
    --ui-sidebar-muted: #93a4bd;
    --ui-sidebar-accent: #93c5fd;
    --ui-sidebar-focus: #93c5fd;
    --ui-sidebar-shadow:
      0 12px 34px rgba(2, 6, 23, 0.44),
      0 32px 64px rgba(2, 6, 23, 0.4);
  }

  :host([variant="split"]) {
    --ui-sidebar-radius: 0;
    --ui-sidebar-shadow: none;
  }

  :host([tone="success"]) {
    --ui-sidebar-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-sidebar-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-sidebar-accent: var(--ui-color-danger, #dc2626);
  }

  :host([headless]) .shell {
    display: none;
  }

  .resize-handle {
    position: absolute;
    inset-block: 10px;
    inset-inline-end: calc(var(--ui-sidebar-resize-hit-area) * -0.5);
    inline-size: var(--ui-sidebar-resize-hit-area);
    border: none;
    background: transparent;
    color: inherit;
    cursor: col-resize;
    touch-action: none;
    padding: 0;
    z-index: 2;
    outline: none;
  }

  :host([position="right"]) .resize-handle {
    inset-inline-start: calc(var(--ui-sidebar-resize-hit-area) * -0.5);
    inset-inline-end: auto;
  }

  .resize-handle::before {
    content: "";
    position: absolute;
    inset-block: 8px;
    inset-inline-start: 50%;
    inline-size: 2px;
    transform: translateX(-50%);
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-sidebar-border) 84%, transparent);
    transition: background-color 140ms ease, transform 140ms ease;
  }

  .resize-handle:hover::before,
  .resize-handle:focus-visible::before,
  :host([data-resizing]) .resize-handle::before {
    background: color-mix(in srgb, var(--ui-sidebar-accent) 78%, #ffffff 22%);
    transform: translateX(-50%) scaleX(1.2);
  }

  :host([data-resizing]) .shell {
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-sidebar-focus) 16%, transparent),
      var(--ui-sidebar-shadow);
  }

  .source-slot {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .shell,
    .collapse-btn,
    .item,
    .resize-handle::before {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .shell {
      border-width: 2px;
      box-shadow: none;
    }

    .resize-handle::before {
      inline-size: 3px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-sidebar-bg: Canvas;
      --ui-sidebar-border: CanvasText;
      --ui-sidebar-text: CanvasText;
      --ui-sidebar-muted: CanvasText;
      --ui-sidebar-accent: Highlight;
      --ui-sidebar-focus: Highlight;
      --ui-sidebar-shadow: none;
    }

    .item[data-active="true"] {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
    }

    .resize-handle::before {
      background: CanvasText;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isTruthy(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function parseItems(raw: string | null): SidebarItemInput[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry && typeof entry === 'object') as SidebarItemInput[];
  } catch {
    return [];
  }
}

function normalizeTone(raw: string | null | undefined): SidebarTone {
  if (raw === 'brand' || raw === 'success' || raw === 'warning' || raw === 'danger') return raw;
  return 'default';
}

function pxValue(raw: string | null, fallback: number, context: HTMLElement): number {
  if (!raw) return fallback;
  const value = raw.trim();
  if (!value) return fallback;
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  if (value.endsWith('px')) {
    const parsed = Number(value.slice(0, -2));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  if (value.endsWith('rem')) {
    const parsed = Number(value.slice(0, -3));
    const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
    return Number.isFinite(parsed) ? parsed * rootSize : fallback;
  }
  if (value.endsWith('em')) {
    const parsed = Number(value.slice(0, -2));
    const currentSize = Number.parseFloat(getComputedStyle(context).fontSize || '16');
    return Number.isFinite(parsed) ? parsed * currentSize : fallback;
  }
  return fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export class UISidebar extends ElementBase {
  static get observedAttributes() {
    return [
      'collapsed',
      'collapsible',
      'position',
      'value',
      'headless',
      'variant',
      'size',
      'density',
      'tone',
      'items',
      'rail',
      'show-icons',
      'show-badges',
      'aria-label',
      'resizable',
      'width',
      'min-width',
      'max-width',
      'collapsed-width',
      'storage-key',
      'auto-save'
    ];
  }

  private _observer: MutationObserver | null = null;
  private _dragState: DragState | null = null;
  private _expandedWidthPx: number | null = null;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
  }

  override connectedCallback(): void {
    if (!this.hasAttribute('width')) {
      const persisted = this._loadPersistedWidth();
      if (persisted != null) this._expandedWidthPx = persisted;
    }
    super.connectedCallback();

    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('pointerdown', this._onPointerDown as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);

    this._observer = new MutationObserver(() => {
      if (this.hasAttribute('items')) return;
      this.requestRender();
    });

    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        'slot',
        'data-value',
        'value',
        'data-label',
        'data-icon',
        'data-badge',
        'data-description',
        'data-section',
        'data-disabled',
        'disabled',
        'data-active',
        'data-tone'
      ]
    });

    queueMicrotask(() => this._syncWidthState({ persist: false, emit: false, source: 'api' }));
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('pointerdown', this._onPointerDown as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    this._teardownResize();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (
      name === 'width' ||
      name === 'min-width' ||
      name === 'max-width' ||
      name === 'collapsed-width' ||
      name === 'size' ||
      name === 'storage-key' ||
      name === 'auto-save'
    ) {
      if (name === 'width') {
        const width = this._clampedExpandedWidth();
        if (width != null) this._expandedWidthPx = width;
      }
      this._syncWidthState({ persist: false, emit: false, source: 'attribute' });
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'collapsed' || name === 'rail' || name === 'resizable' || name === 'position') {
      queueMicrotask(() => this._syncWidthState({ persist: false, emit: false, source: 'attribute' }));
    }
  }

  get collapsed(): boolean {
    return this.hasAttribute('collapsed');
  }

  set collapsed(next: boolean) {
    if (next) this.setAttribute('collapsed', '');
    else this.removeAttribute('collapsed');
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    const normalized = String(next || '');
    if (!normalized) this.removeAttribute('value');
    else this.setAttribute('value', normalized);
  }

  collapse(): void {
    if (!this.collapsed) this.toggle(true);
  }

  expand(): void {
    if (this.collapsed) this.toggle(false);
  }

  toggle(force?: boolean): void {
    const next = typeof force === 'boolean' ? force : !this.collapsed;
    this.collapsed = next;
    this._syncWidthState({ persist: false, emit: false, source: 'api' });

    const detail = { collapsed: next };
    this.dispatchEvent(new CustomEvent('toggle', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('collapse-change', { detail, bubbles: true, composed: true }));
  }

  private _persistedKey(): string | null {
    const key = this.getAttribute('storage-key');
    return key ? `ui-sidebar:${key}` : null;
  }

  private _loadPersistedWidth(): number | null {
    const key = this._persistedKey();
    if (!key) return null;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return typeof parsed?.expandedWidth === 'number' && Number.isFinite(parsed.expandedWidth)
        ? parsed.expandedWidth
        : null;
    } catch {
      return null;
    }
  }

  private _persistWidth(): void {
    if (!isTruthy(this.getAttribute('auto-save'))) return;
    const key = this._persistedKey();
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify({ expandedWidth: this._resolvedExpandedWidthPx() }));
    } catch {
      // ignore persistence failures
    }
  }

  private _sizePreset(): { expanded: number; collapsed: number } {
    return SIZE_WIDTHS[this.getAttribute('size') || 'md'] || SIZE_WIDTHS.md;
  }

  private _collapsedWidthPx(): number {
    const preset = this._sizePreset().collapsed;
    return Math.max(48, pxValue(this.getAttribute('collapsed-width'), preset, this));
  }

  private _minWidthPx(): number {
    const preset = Math.max(this._collapsedWidthPx() + 36, 180);
    return Math.max(this._collapsedWidthPx(), pxValue(this.getAttribute('min-width'), preset, this));
  }

  private _maxWidthPx(): number {
    const preset = 420;
    return Math.max(this._minWidthPx(), pxValue(this.getAttribute('max-width'), preset, this));
  }

  private _clampedExpandedWidth(): number | null {
    const raw = this.getAttribute('width');
    if (!raw) return null;
    return clamp(pxValue(raw, this._sizePreset().expanded, this), this._minWidthPx(), this._maxWidthPx());
  }

  private _resolvedExpandedWidthPx(): number {
    const explicit = this._clampedExpandedWidth();
    if (explicit != null) return explicit;
    const fallback = this._expandedWidthPx ?? this._sizePreset().expanded;
    return clamp(fallback, this._minWidthPx(), this._maxWidthPx());
  }

  private _currentWidthPx(): number {
    if (this.hasAttribute('collapsed') || this.hasAttribute('rail')) return this._collapsedWidthPx();
    return this._resolvedExpandedWidthPx();
  }

  private _syncWidthState(options: { persist: boolean; emit: boolean; source: ResizeSource }): void {
    const expanded = this._resolvedExpandedWidthPx();
    const collapsed = this._collapsedWidthPx();
    const current = this._currentWidthPx();

    this._expandedWidthPx = expanded;
    this.style.setProperty('--ui-sidebar-width', `${expanded}px`);
    this.style.setProperty('--ui-sidebar-collapsed-width', `${collapsed}px`);
    this.style.setProperty('--ui-sidebar-current-width', `${current}px`);

    const handle = this.root.querySelector('.resize-handle') as HTMLElement | null;
    if (handle) {
      const hidden = !this.hasAttribute('resizable') || this.hasAttribute('rail');
      handle.toggleAttribute('hidden', hidden);
      handle.setAttribute('aria-valuemin', String(Math.round(this._minWidthPx())));
      handle.setAttribute('aria-valuemax', String(Math.round(this._maxWidthPx())));
      handle.setAttribute('aria-valuenow', String(Math.round(expanded)));
      handle.setAttribute('aria-orientation', 'vertical');
      handle.setAttribute('aria-label', this.getAttribute('position') === 'right' ? 'Resize right sidebar' : 'Resize sidebar');
    }

    if (options.persist) this._persistWidth();
    if (options.emit) {
      this.dispatchEvent(
        new CustomEvent('width-change', {
          detail: {
            width: expanded,
            collapsedWidth: collapsed,
            minWidth: this._minWidthPx(),
            maxWidth: this._maxWidthPx(),
            source: options.source
          },
          bubbles: true,
          composed: true
        })
      );
    }
  }

  private _sourceItems(): HTMLElement[] {
    return Array.from(this.querySelectorAll('[slot="item"]')) as HTMLElement[];
  }

  private _itemsFromSlots(): SidebarItem[] {
    return this._sourceItems().map((node, index) => ({
      index,
      value: node.getAttribute('data-value') || node.getAttribute('value') || String(index),
      label: node.getAttribute('data-label') || node.textContent?.trim() || `Item ${index + 1}`,
      icon: node.getAttribute('data-icon') || '',
      badge: node.getAttribute('data-badge') || '',
      description: node.getAttribute('data-description') || '',
      section: node.getAttribute('data-section') || '',
      disabled: node.hasAttribute('disabled') || isTruthy(node.getAttribute('data-disabled')),
      active: node.hasAttribute('data-active'),
      tone: normalizeTone(node.getAttribute('data-tone'))
    }));
  }

  private _itemsFromAttr(): SidebarItem[] {
    return parseItems(this.getAttribute('items')).map((item, index) => ({
      index,
      value: item.value != null ? String(item.value) : String(index),
      label: item.label != null ? String(item.label) : `Item ${index + 1}`,
      icon: item.icon != null ? String(item.icon) : '',
      badge: item.badge != null ? String(item.badge) : '',
      description: item.description != null ? String(item.description) : '',
      section: item.section != null ? String(item.section) : '',
      disabled: !!item.disabled,
      active: !!item.active,
      tone: normalizeTone(item.tone)
    }));
  }

  private _resolvedItems(): SidebarItem[] {
    const fromAttr = this._itemsFromAttr();
    const raw = fromAttr.length ? fromAttr : this._itemsFromSlots();
    if (!raw.length) return [];

    let selected = this.value;
    if (!selected) {
      const activeItem = raw.find((item) => item.active && !item.disabled);
      selected = activeItem?.value || raw.find((item) => !item.disabled)?.value || raw[0].value;
      if (selected) this.setAttribute('value', selected);
    }

    return raw.map((item) => ({ ...item, active: item.value === selected }));
  }

  private _grouped(items: SidebarItem[]): Array<{ section: string; items: SidebarItem[] }> {
    const order: string[] = [];
    const map = new Map<string, SidebarItem[]>();

    items.forEach((item) => {
      const key = item.section || '';
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key)!.push(item);
    });

    return order.map((section) => ({ section, items: map.get(section) || [] }));
  }

  private _emitSelection(item: SidebarItem): void {
    const detail = {
      index: item.index,
      value: item.value,
      label: item.label,
      item: {
        value: item.value,
        label: item.label,
        icon: item.icon,
        badge: item.badge,
        description: item.description,
        section: item.section,
        tone: item.tone
      }
    };

    this.dispatchEvent(new CustomEvent('select', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _selectByIndex(index: number): void {
    const items = this._resolvedItems();
    const item = items.find((entry) => entry.index === index);
    if (!item || item.disabled) return;

    this.value = item.value;
    this._emitSelection(item);
  }

  private _focusRelative(current: HTMLElement, offset: number): void {
    const enabled = Array.from(this.root.querySelectorAll<HTMLButtonElement>('.item:not([disabled])'));
    if (!enabled.length) return;

    const currentIndex = enabled.indexOf(current as HTMLButtonElement);
    if (currentIndex < 0) return;

    const next = (currentIndex + offset + enabled.length) % enabled.length;
    enabled[next].focus();
  }

  private _startResize(pointerId: number, clientX: number): void {
    if (!this.hasAttribute('resizable') || this.hasAttribute('rail') || this.collapsed) return;
    this._dragState = {
      pointerId,
      startX: clientX,
      startWidth: this._resolvedExpandedWidthPx()
    };
    this.setAttribute('data-resizing', '');
    window.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('pointerup', this._onPointerUp);
    this.dispatchEvent(new CustomEvent('resize-start', { detail: { width: this._resolvedExpandedWidthPx() }, bubbles: true, composed: true }));
  }

  private _teardownResize(): void {
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    this.removeAttribute('data-resizing');
    this._dragState = null;
  }

  private _applyExpandedWidth(width: number, source: ResizeSource, persist: boolean): void {
    const next = clamp(width, this._minWidthPx(), this._maxWidthPx());
    this._expandedWidthPx = next;
    const reflected = `${Math.round(next)}px`;
    if (this.getAttribute('width') !== reflected) this.setAttribute('width', reflected);
    this.style.setProperty('--ui-sidebar-width', `${next}px`);
    this.style.setProperty('--ui-sidebar-current-width', `${this._currentWidthPx()}px`);
    this._syncWidthState({ persist, emit: true, source });
  }

  private _onPointerMove(event: PointerEvent): void {
    if (!this._dragState || event.pointerId !== this._dragState.pointerId) return;
    const direction = this.getAttribute('position') === 'right' ? -1 : 1;
    const delta = (event.clientX - this._dragState.startX) * direction;
    this._applyExpandedWidth(this._dragState.startWidth + delta, 'pointer', false);
    this.dispatchEvent(new CustomEvent('resize', { detail: { width: this._resolvedExpandedWidthPx() }, bubbles: true, composed: true }));
  }

  private _onPointerUp(event: PointerEvent): void {
    if (!this._dragState || event.pointerId !== this._dragState.pointerId) return;
    this._persistWidth();
    this.dispatchEvent(new CustomEvent('resize-end', { detail: { width: this._resolvedExpandedWidthPx() }, bubbles: true, composed: true }));
    this._teardownResize();
  }

  private _onClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const collapse = target.closest('.collapse-btn');
    if (collapse) {
      this.toggle();
      return;
    }

    const item = target.closest('.item') as HTMLButtonElement | null;
    if (!item || item.hasAttribute('disabled')) return;

    const index = Number(item.getAttribute('data-index'));
    if (!Number.isFinite(index)) return;
    this._selectByIndex(index);
  }

  private _onPointerDown(event: PointerEvent): void {
    const target = event.target as HTMLElement | null;
    const resize = target?.closest('.resize-handle');
    if (!resize) return;
    event.preventDefault();
    this._startResize(event.pointerId, event.clientX);
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const resizeHandle = (event.target as HTMLElement | null)?.closest('.resize-handle') as HTMLElement | null;
    if (resizeHandle) {
      const right = this.getAttribute('position') === 'right';
      const step = event.shiftKey ? 40 : 16;
      let delta = 0;
      if ((!right && event.key === 'ArrowRight') || (right && event.key === 'ArrowLeft')) delta = step;
      if ((!right && event.key === 'ArrowLeft') || (right && event.key === 'ArrowRight')) delta = -step;
      if (event.key === 'Home') delta = this._minWidthPx() - this._resolvedExpandedWidthPx();
      if (event.key === 'End') delta = this._maxWidthPx() - this._resolvedExpandedWidthPx();
      if (!delta) return;
      event.preventDefault();
      this._applyExpandedWidth(this._resolvedExpandedWidthPx() + delta, 'keyboard', true);
      return;
    }

    const target = event.target as HTMLElement | null;
    const item = target?.closest('.item') as HTMLButtonElement | null;
    if (!item) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const index = Number(item.getAttribute('data-index'));
      if (Number.isFinite(index)) this._selectByIndex(index);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._focusRelative(item, 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._focusRelative(item, -1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      const first = this.root.querySelector('.item:not([disabled])') as HTMLButtonElement | null;
      first?.focus();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      const enabled = Array.from(this.root.querySelectorAll<HTMLButtonElement>('.item:not([disabled])'));
      enabled[enabled.length - 1]?.focus();
      return;
    }

    if (this.hasAttribute('collapsible') && !this.hasAttribute('rail')) {
      const right = this.getAttribute('position') === 'right';
      if (((!right && event.key === 'ArrowLeft') || (right && event.key === 'ArrowRight')) && !this.collapsed) {
        event.preventDefault();
        this.collapse();
        return;
      }

      if (((!right && event.key === 'ArrowRight') || (right && event.key === 'ArrowLeft')) && this.collapsed) {
        event.preventDefault();
        this.expand();
      }
    }
  }

  private _hasSlot(name: string): boolean {
    return !!this.querySelector(`[slot="${name}"]`);
  }

  protected override render(): void {
    const items = this._resolvedItems();
    const groups = this._grouped(items);

    const collapsed = this.collapsed || this.hasAttribute('rail');
    const collapsible = this.hasAttribute('collapsible') && !this.hasAttribute('rail');
    const resizable = this.hasAttribute('resizable') && !this.hasAttribute('rail');
    const showSearch = this._hasSlot('search');
    const ariaLabel = this.getAttribute('aria-label') || 'Sidebar navigation';

    const groupsHtml = groups.length
      ? groups
          .map((group, groupIndex) => {
            const heading = group.section ? `<p class="group-label" part="group-label">${escapeHtml(group.section)}</p>` : '';

            const listHtml = group.items
              .map((item) => {
                const iconName = item.icon ? escapeHtml(item.icon) : 'dot';
                return `
                  <li>
                    <button
                      type="button"
                      class="item"
                      part="item"
                      data-index="${item.index}"
                      data-active="${item.active ? 'true' : 'false'}"
                      data-tone="${item.tone}"
                      aria-current="${item.active ? 'page' : 'false'}"
                      aria-label="${escapeHtml(item.label)}"
                      title="${collapsed ? escapeHtml(item.label) : ''}"
                      tabindex="${item.active ? '0' : '-1'}"
                      ${item.disabled ? 'disabled' : ''}
                    >
                      <span class="icon" part="item-icon"><ui-icon name="${iconName}" size="sm" decorative></ui-icon></span>
                      <span class="meta" part="item-meta" ${collapsed ? 'hidden' : ''}>
                        <span class="label" part="item-label">${escapeHtml(item.label)}</span>
                        <span class="description" part="item-description" ${item.description ? '' : 'hidden'}>${escapeHtml(item.description)}</span>
                      </span>
                      <span class="badge" part="item-badge" ${item.badge && !collapsed ? '' : 'hidden'}>${escapeHtml(item.badge)}</span>
                    </button>
                  </li>
                `;
              })
              .join('');

            return `
              <section class="group" part="group" data-group-index="${groupIndex}">
                ${heading}
                <ul class="list" role="list">
                  ${listHtml}
                </ul>
              </section>
            `;
          })
          .join('')
      : '<div class="menu-empty" part="menu-empty">No navigation items available.</div>';

    this.setContent(`
      <style>${style}</style>
      <aside class="shell" part="shell" role="navigation" aria-label="${escapeHtml(ariaLabel)}">
        <header class="header" part="header"><slot name="header"></slot></header>

        <div class="controls" part="controls" ${collapsible ? '' : 'hidden'}>
          <button type="button" class="collapse-btn" part="collapse-button" aria-label="${collapsed ? 'Expand sidebar' : 'Collapse sidebar'}">
            ${collapsed ? '»' : '«'}
          </button>
        </div>

        <div class="search" part="search" data-has="${showSearch ? 'true' : 'false'}">
          <slot name="search"></slot>
        </div>

        <div class="menu" part="menu">
          ${groupsHtml}
        </div>

        <footer class="footer" part="footer"><slot name="footer"></slot></footer>
        <button type="button" class="resize-handle" part="resize-handle" ${resizable ? '' : 'hidden'}></button>
      </aside>
      <slot class="source-slot" name="item"></slot>
    `);

    this._syncWidthState({ persist: false, emit: false, source: 'api' });
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return !(
      name === 'width' ||
      name === 'min-width' ||
      name === 'max-width' ||
      name === 'collapsed-width' ||
      name === 'storage-key' ||
      name === 'auto-save'
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-sidebar': UISidebar;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-sidebar')) {
  customElements.define('ui-sidebar', UISidebar);
}
