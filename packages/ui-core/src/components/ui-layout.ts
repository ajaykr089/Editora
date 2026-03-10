import { ElementBase } from '../ElementBase';
import './ui-panel-group';
import './ui-panel';
import { UIPanel } from './ui-panel';
import { UIPanelGroup } from './ui-panel-group';

const style = `
  :host {
    --ui-layout-bg: var(--ui-color-background, #f8fafc);
    --ui-layout-surface: var(--ui-color-surface, #ffffff);
    --ui-layout-color: var(--ui-color-text, #0f172a);
    --ui-layout-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 80%, transparent);
    --ui-layout-shadow:
      none;
    --ui-layout-radius: 18px;
    --ui-layout-gap: 14px;
    --ui-layout-padding: 14px;
    --ui-layout-header-padding: 12px 14px;
    --ui-layout-footer-padding: 12px 14px;
    --ui-layout-content-padding: 14px;
    --ui-layout-max-width: none;
    display: block;
    color: var(--ui-layout-color);
    color-scheme: light dark;
  }

  .layout {
    width: 100%;
    max-width: var(--ui-layout-max-width);
    margin: 0 auto;
    display: grid;
    gap: var(--ui-layout-gap);
    padding: var(--ui-layout-padding);
    box-sizing: border-box;
    border: var(--ui-layout-border);
    border-radius: var(--ui-layout-radius);
    background: var(--ui-layout-bg);
    color: var(--ui-layout-color);
    box-shadow: var(--ui-layout-shadow);
    position: relative;
    isolation: isolate;
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      box-shadow 180ms ease;
  }

  :host([variant="flat"]) .layout {
    box-shadow: none;
  }

  :host([variant="elevated"]) .layout {
    --ui-layout-shadow:
      0 34px 72px rgba(2, 6, 23, 0.18),
      0 6px 16px rgba(2, 6, 23, 0.1);
  }

  :host([variant="glass"]) .layout {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-layout-bg, #f8fafc) 90%, #ffffff 10%),
        color-mix(in srgb, var(--ui-layout-bg, #f8fafc) 95%, transparent)
      ),
      var(--ui-layout-bg);
    backdrop-filter: blur(16px) saturate(1.08);
  }

  :host([variant="contrast"]) .layout {
    --ui-layout-bg: #0f172a;
    --ui-layout-surface: #111827;
    --ui-layout-color: #e2e8f0;
    --ui-layout-border: 1px solid #334155;
  }

  :host([density="compact"]) .layout {
    --ui-layout-gap: 8px;
    --ui-layout-padding: 8px;
    --ui-layout-header-padding: 8px 10px;
    --ui-layout-footer-padding: 8px 10px;
    --ui-layout-content-padding: 10px;
    --ui-layout-radius: 10px;
  }

  :host([density="comfortable"]) .layout {
    --ui-layout-gap: 18px;
    --ui-layout-padding: 18px;
    --ui-layout-header-padding: 14px 18px;
    --ui-layout-footer-padding: 14px 18px;
    --ui-layout-content-padding: 18px;
    --ui-layout-radius: 20px;
  }

  :host([max-width="sm"]) .layout { --ui-layout-max-width: 640px; }
  :host([max-width="md"]) .layout { --ui-layout-max-width: 920px; }
  :host([max-width="lg"]) .layout { --ui-layout-max-width: 1180px; }
  :host([max-width="xl"]) .layout { --ui-layout-max-width: 1400px; }

  .header,
  .footer,
  .panel-surface {
    min-width: 0;
    border-radius: calc(var(--ui-layout-radius) - 4px);
    border: var(--ui-layout-border);
    background: var(--ui-layout-surface);
    box-sizing: border-box;
  }

  .header {
    padding: var(--ui-layout-header-padding);
  }

  .footer {
    padding: var(--ui-layout-footer-padding);
  }

  .body {
    min-height: var(--ui-layout-min-height, 380px);
  }

  .body[hidden],
  .header[hidden],
  .footer[hidden] {
    display: none;
  }

  .group {
    min-height: inherit;
  }

  .panel {
    min-width: 0;
    min-height: 0;
  }

  .panel.content-panel {
    padding: var(--ui-layout-content-padding);
    min-height: 120px;
  }

  .panel.sidebar-panel,
  .panel.aside-panel {
    padding: var(--ui-layout-content-padding);
  }

  .stack-body {
    display: grid;
    gap: var(--ui-layout-gap);
    min-height: inherit;
  }

  .stack-body .panel {
    min-height: 120px;
  }

  :host([headless]) .layout {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .layout {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .layout,
    .header,
    .footer,
    .panel-surface {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .layout,
    .header,
    .footer,
    .panel-surface {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

function toBoolean(value: string | null): boolean {
  if (value == null) return false;
  const normalized = String(value).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function hasSlotContent(slot: HTMLSlotElement | null): boolean {
  if (!slot) return false;
  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
    return false;
  });
}

function parseSizePercent(raw: string | null, containerPx: number, fallbackPercent: number): number {
  if (!raw) return fallbackPercent;
  const value = raw.trim();
  if (!value) return fallbackPercent;
  if (value.endsWith('%')) {
    const parsed = Number(value.slice(0, -1));
    return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : fallbackPercent;
  }
  if (value.endsWith('px')) {
    const parsed = Number(value.slice(0, -2));
    return Number.isFinite(parsed) && containerPx > 0 ? Math.min(100, Math.max(0, (parsed / containerPx) * 100)) : fallbackPercent;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallbackPercent;
  return parsed <= 100 ? Math.min(100, Math.max(0, parsed)) : (containerPx > 0 ? Math.min(100, Math.max(0, (parsed / containerPx) * 100)) : fallbackPercent);
}

type LayoutMode = 'dashboard' | 'split' | 'stack';

export class UILayout extends ElementBase {
  static get observedAttributes() {
    return [
      'mode',
      'variant',
      'density',
      'max-width',
      'sidebar-side',
      'collapsed',
      'headless',
      'sidebar-width',
      'aside-width'
    ];
  }

  private _headerSlot: HTMLSlotElement | null = null;
  private _sidebarSlot: HTMLSlotElement | null = null;
  private _asideSlot: HTMLSlotElement | null = null;
  private _footerSlot: HTMLSlotElement | null = null;
  private _panelGroup: UIPanelGroup | null = null;
  private _sidebarPanel: UIPanel | null = null;
  private _contentPanel: UIPanel | null = null;
  private _asidePanel: UIPanel | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _layoutNode: HTMLElement | null = null;

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onPanelLayoutChange = this._onPanelLayoutChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._attachSlotHandlers();
    this._ensureResizeObserver();
    queueMicrotask(() => this._syncStructure());
  }

  override disconnectedCallback(): void {
    this._detachSlotHandlers();
    this._teardownResizeObserver();
    super.disconnectedCallback();
  }

  collapse(): void {
    this.setAttribute('collapsed', '');
  }

  expand(): void {
    this.removeAttribute('collapsed');
  }

  toggleSidebar(): void {
    if (this.hasAttribute('collapsed')) this.expand();
    else this.collapse();
  }

  get collapsed(): boolean {
    return toBoolean(this.getAttribute('collapsed'));
  }

  set collapsed(value: boolean) {
    if (value) this.setAttribute('collapsed', '');
    else this.removeAttribute('collapsed');
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'sidebar-width' || name === 'aside-width' || name === 'collapsed' || name === 'mode' || name === 'sidebar-side') {
      this._syncStructure();
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private _mode(): LayoutMode {
    const mode = this.getAttribute('mode');
    return mode === 'split' || mode === 'stack' ? mode : 'dashboard';
  }

  private _onSlotChange(): void {
    this._syncStructure();
    this.dispatchEvent(new CustomEvent('layoutchange', { bubbles: true, composed: true }));
  }

  private _onPanelLayoutChange(): void {
    this.dispatchEvent(new CustomEvent('layoutchange', { bubbles: true, composed: true }));
  }

  private _attachSlotHandlers(): void {
    const header = this.root.querySelector('slot[name="header"]') as HTMLSlotElement | null;
    const sidebar = this.root.querySelector('slot[name="sidebar"]') as HTMLSlotElement | null;
    const aside = this.root.querySelector('slot[name="aside"]') as HTMLSlotElement | null;
    const footer = this.root.querySelector('slot[name="footer"]') as HTMLSlotElement | null;

    if (this._headerSlot && this._headerSlot !== header) this._headerSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    if (this._sidebarSlot && this._sidebarSlot !== sidebar) this._sidebarSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    if (this._asideSlot && this._asideSlot !== aside) this._asideSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    if (this._footerSlot && this._footerSlot !== footer) this._footerSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);

    header?.addEventListener('slotchange', this._onSlotChange as EventListener);
    sidebar?.addEventListener('slotchange', this._onSlotChange as EventListener);
    aside?.addEventListener('slotchange', this._onSlotChange as EventListener);
    footer?.addEventListener('slotchange', this._onSlotChange as EventListener);

    this._headerSlot = header;
    this._sidebarSlot = sidebar;
    this._asideSlot = aside;
    this._footerSlot = footer;
  }

  private _detachSlotHandlers(): void {
    this._headerSlot?.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._sidebarSlot?.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._asideSlot?.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._footerSlot?.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._headerSlot = null;
    this._sidebarSlot = null;
    this._asideSlot = null;
    this._footerSlot = null;
  }

  private _ensureResizeObserver(): void {
    if (this._resizeObserver || typeof ResizeObserver === 'undefined') return;
    this._resizeObserver = new ResizeObserver(() => this._syncPanelSizes());
    if (this._layoutNode) this._resizeObserver.observe(this._layoutNode);
  }

  private _teardownResizeObserver(): void {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }

  private _syncVisibility(): void {
    const headerEl = this.root.querySelector('.header') as HTMLElement | null;
    const footerEl = this.root.querySelector('.footer') as HTMLElement | null;
    const bodyEl = this.root.querySelector('.body') as HTMLElement | null;

    if (headerEl) headerEl.hidden = !hasSlotContent(this._headerSlot);
    if (footerEl) footerEl.hidden = !hasSlotContent(this._footerSlot);

    if (bodyEl) bodyEl.hidden = false;
  }

  private _syncStructure(): void {
    if (!this.isConnected || !this._panelGroup) return;

    const mode = this._mode();
    const hasSidebar = hasSlotContent(this._sidebarSlot);
    const hasAside = hasSlotContent(this._asideSlot);
    const collapsed = this.collapsed;
    const sidebarSide = this.getAttribute('sidebar-side') === 'end' ? 'end' : 'start';
    const layoutWidth = this._layoutNode?.getBoundingClientRect().width || this.getBoundingClientRect().width || 0;
    const shouldStack = mode === 'stack' || layoutWidth > 0 && layoutWidth < 980;
    const stackBody = this.root.querySelector('.stack-body') as HTMLElement | null;
    const park = (panel: UIPanel | null) => {
      if (!panel || !stackBody) return;
      stackBody.append(panel);
    };

    if (this._sidebarPanel) {
      const shouldShowSidebar = mode === 'dashboard' && hasSidebar;
      this._sidebarPanel.hidden = !shouldShowSidebar;
      this._sidebarPanel.toggleAttribute('collapsed', shouldShowSidebar && collapsed);
      this._sidebarPanel.setAttribute('collapsed-size', shouldShowSidebar ? '0' : '0');
    }

    if (this._asidePanel) {
      const shouldShowAside = mode !== 'stack' && hasAside;
      this._asidePanel.hidden = !shouldShowAside;
    }

    if (this._contentPanel) {
      this._contentPanel.hidden = false;
    }

    if (this._panelGroup) {
      this._panelGroup.hidden = shouldStack;
      this._panelGroup.setAttribute('orientation', 'horizontal');
    }

    if (stackBody) {
      stackBody.hidden = !shouldStack;
    }

    if (this._sidebarPanel && this._contentPanel && this._asidePanel) {
      if (shouldStack && stackBody) {
        stackBody.append(this._contentPanel);
        if (hasSidebar && !collapsed) stackBody.append(this._sidebarPanel);
        else park(this._sidebarPanel);
        if (hasAside) stackBody.append(this._asidePanel);
        else park(this._asidePanel);
      } else {
        const ordered: UIPanel[] = [];
        if (sidebarSide === 'end') {
          ordered.push(this._contentPanel);
          if (hasAside) ordered.push(this._asidePanel);
          if (hasSidebar) ordered.push(this._sidebarPanel);
        } else {
          if (hasSidebar) ordered.push(this._sidebarPanel);
          ordered.push(this._contentPanel);
          if (hasAside) ordered.push(this._asidePanel);
        }
        this._panelGroup?.append(...ordered);
        if (!hasSidebar) park(this._sidebarPanel);
        if (!hasAside) park(this._asidePanel);
      }
    }

    this._syncVisibility();
    if (!shouldStack) this._syncPanelSizes();
  }

  private _syncPanelSizes(): void {
    if (!this._panelGroup || this._panelGroup.hidden) return;

    const mode = this._mode();
    const hasSidebar = this._panelGroup.contains(this._sidebarPanel);
    const hasAside = this._panelGroup.contains(this._asidePanel);
    const visiblePanels = [hasSidebar, true, hasAside].filter(Boolean).length;
    const containerWidth = this._panelGroup.getBoundingClientRect().width || this.getBoundingClientRect().width || 1200;

    const defaultSidebar = visiblePanels === 3 ? 22 : 24;
    const defaultAside = visiblePanels === 3 ? 26 : 28;
    const sidebarSize = hasSidebar ? parseSizePercent(this.getAttribute('sidebar-width'), containerWidth, defaultSidebar) : 0;
    const asideSize = hasAside ? parseSizePercent(this.getAttribute('aside-width'), containerWidth, defaultAside) : 0;
    const contentSize = Math.max(20, 100 - sidebarSize - asideSize);

    if (this._sidebarPanel) {
      this._sidebarPanel.setAttribute('size', String(sidebarSize));
      this._sidebarPanel.setAttribute('min-size', hasSidebar ? '12' : '0');
      this._sidebarPanel.setAttribute('max-size', hasSidebar ? '40' : '0');
      this._sidebarPanel.setAttribute('collapsed-size', '0');
      this._sidebarPanel.toggleAttribute('collapsible', true);
    }

    if (this._contentPanel) {
      this._contentPanel.setAttribute('size', String(contentSize));
      this._contentPanel.setAttribute('min-size', mode === 'split' ? '35' : '30');
      this._contentPanel.setAttribute('max-size', '100');
    }

    if (this._asidePanel) {
      this._asidePanel.setAttribute('size', String(asideSize));
      this._asidePanel.setAttribute('min-size', hasAside ? '16' : '0');
      this._asidePanel.setAttribute('max-size', hasAside ? '45' : '0');
    }

    const layoutByPanel = new Map<UIPanel, number>();
    if (this._sidebarPanel) layoutByPanel.set(this._sidebarPanel, sidebarSize);
    if (this._contentPanel) layoutByPanel.set(this._contentPanel, contentSize);
    if (this._asidePanel) layoutByPanel.set(this._asidePanel, asideSize);
    const layout = Array.from(this._panelGroup.children)
      .filter((child): child is UIPanel => child instanceof UIPanel)
      .map((panel) => layoutByPanel.get(panel) ?? 0);

    if (layout.length > 1) this._panelGroup.setLayout(layout);
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="layout" part="layout">
        <header class="header" part="header">
          <slot name="header"></slot>
        </header>
        <div class="body" part="body">
          <ui-panel-group class="group" part="group">
            <ui-panel class="panel panel-surface sidebar-panel" part="sidebar">
              <slot name="sidebar"></slot>
            </ui-panel>
            <ui-panel class="panel panel-surface content-panel" part="content">
              <slot name="content"></slot>
              <slot></slot>
            </ui-panel>
            <ui-panel class="panel panel-surface aside-panel" part="aside">
              <slot name="aside"></slot>
            </ui-panel>
          </ui-panel-group>
          <div class="stack-body" hidden></div>
        </div>
        <footer class="footer" part="footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    `);

    this._layoutNode = this.root.querySelector('.layout');
    this._panelGroup = this.root.querySelector('ui-panel-group');
    this._sidebarPanel = this.root.querySelector('.sidebar-panel');
    this._contentPanel = this.root.querySelector('.content-panel');
    this._asidePanel = this.root.querySelector('.aside-panel');

    this._panelGroup?.addEventListener('layout-change', this._onPanelLayoutChange as EventListener);
    this._attachSlotHandlers();
    this._ensureResizeObserver();
    if (this._layoutNode && this._resizeObserver) this._resizeObserver.observe(this._layoutNode);
    queueMicrotask(() => this._syncStructure());
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return name === 'variant' || name === 'density' || name === 'max-width' || name === 'headless';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-layout': UILayout;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-layout')) {
  customElements.define('ui-layout', UILayout);
}
