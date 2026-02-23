import { ElementBase } from '../ElementBase';

type SidebarTone = 'default' | 'brand' | 'success' | 'warning' | 'danger';

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

const style = `
  :host {
    --ui-sidebar-width: 280px;
    --ui-sidebar-collapsed-width: 78px;
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
      0 1px 2px rgba(2, 6, 23, 0.05),
      0 20px 44px rgba(2, 6, 23, 0.12);

    --ui-sidebar-item-radius: 12px;
    --ui-sidebar-item-height: 42px;
    --ui-sidebar-item-padding-x: 12px;
    --ui-sidebar-item-gap: 10px;

    color-scheme: light dark;
    display: block;
    inline-size: var(--ui-sidebar-width);
    min-inline-size: 0;
    box-sizing: border-box;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .shell {
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

  :host([collapsed]),
  :host([rail]) {
    inline-size: var(--ui-sidebar-collapsed-width);
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
  .badge[hidden] {
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

  .source-slot {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .shell,
    .collapse-btn,
    .item {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .shell {
      border-width: 2px;
      box-shadow: none;
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
      'aria-label'
    ];
  }

  private _observer: MutationObserver | null = null;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.root.addEventListener('click', this._onClick as EventListener);
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
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    super.disconnectedCallback();
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

    const detail = { collapsed: next };
    this.dispatchEvent(new CustomEvent('toggle', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('collapse-change', { detail, bubbles: true, composed: true }));
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

  private _onKeyDown(event: KeyboardEvent): void {
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
      </aside>
      <slot class="source-slot" name="item"></slot>
    `);
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-sidebar')) {
  customElements.define('ui-sidebar', UISidebar);
}
