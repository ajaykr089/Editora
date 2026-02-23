import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-layout-bg: var(--ui-color-background, #f8fafc);
    --ui-layout-surface: var(--ui-color-surface, #ffffff);
    --ui-layout-color: var(--ui-color-text, #0f172a);
    --ui-layout-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 80%, transparent);
    --ui-layout-shadow:
      0 26px 62px rgba(2, 6, 23, 0.12),
      0 3px 12px rgba(2, 6, 23, 0.08);
    --ui-layout-radius: 18px;
    --ui-layout-gap: 14px;
    --ui-layout-padding: 14px;
    --ui-layout-header-padding: 12px 14px;
    --ui-layout-footer-padding: 12px 14px;
    --ui-layout-content-padding: 14px;
    --ui-layout-sidebar-width: 248px;
    --ui-layout-aside-width: 300px;
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
  .sidebar,
  .aside,
  .content {
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
    display: grid;
    grid-template-columns: var(--ui-layout-sidebar-width) minmax(0, 1fr) var(--ui-layout-aside-width);
    gap: var(--ui-layout-gap);
    align-items: stretch;
    min-height: var(--ui-layout-min-height, 380px);
  }

  :host([mode="split"]) .body {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  :host([mode="stack"]) .body {
    grid-template-columns: 1fr;
  }

  .content {
    padding: var(--ui-layout-content-padding);
    min-height: 120px;
  }

  .sidebar,
  .aside {
    padding: var(--ui-layout-content-padding);
  }

  :host([sidebar-side="end"]) .sidebar {
    order: 3;
  }

  :host([sidebar-side="end"]) .content {
    order: 1;
  }

  :host([sidebar-side="end"]) .aside {
    order: 2;
  }

  :host([collapsed]) .sidebar {
    display: none;
  }

  :host([collapsed]) .body {
    grid-template-columns: minmax(0, 1fr) var(--ui-layout-aside-width);
  }

  :host([collapsed][mode="split"]) .body,
  :host([collapsed][mode="stack"]) .body {
    grid-template-columns: 1fr;
  }

  .header[hidden],
  .footer[hidden],
  .sidebar[hidden],
  .aside[hidden] {
    display: none;
  }

  :host([headless]) .layout {
    display: none !important;
  }

  @media (max-width: 980px) {
    .body {
      grid-template-columns: minmax(0, 1fr);
    }

    .sidebar,
    .aside {
      order: 2;
    }

    .content {
      order: 1;
    }
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
    .sidebar,
    .aside,
    .content {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .layout,
    .header,
    .footer,
    .sidebar,
    .aside,
    .content {
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

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._attachSlotHandlers();
    this._syncSlotVisibility();
  }

  override disconnectedCallback(): void {
    this._detachSlotHandlers();
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

  private _onSlotChange(): void {
    this._syncSlotVisibility();
    this.dispatchEvent(new CustomEvent('layoutchange', { bubbles: true }));
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

    if (header && this._headerSlot !== header) header.addEventListener('slotchange', this._onSlotChange as EventListener);
    if (sidebar && this._sidebarSlot !== sidebar) sidebar.addEventListener('slotchange', this._onSlotChange as EventListener);
    if (aside && this._asideSlot !== aside) aside.addEventListener('slotchange', this._onSlotChange as EventListener);
    if (footer && this._footerSlot !== footer) footer.addEventListener('slotchange', this._onSlotChange as EventListener);

    this._headerSlot = header;
    this._sidebarSlot = sidebar;
    this._asideSlot = aside;
    this._footerSlot = footer;
  }

  private _detachSlotHandlers(): void {
    if (this._headerSlot) this._headerSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    if (this._sidebarSlot) this._sidebarSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    if (this._asideSlot) this._asideSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    if (this._footerSlot) this._footerSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._headerSlot = null;
    this._sidebarSlot = null;
    this._asideSlot = null;
    this._footerSlot = null;
  }

  private _slotHasContent(slot: HTMLSlotElement | null): boolean {
    if (!slot) return false;
    return slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
      return false;
    });
  }

  private _syncSlotVisibility(): void {
    const headerEl = this.root.querySelector('.header') as HTMLElement | null;
    const sidebarEl = this.root.querySelector('.sidebar') as HTMLElement | null;
    const asideEl = this.root.querySelector('.aside') as HTMLElement | null;
    const footerEl = this.root.querySelector('.footer') as HTMLElement | null;

    if (headerEl) headerEl.hidden = !this._slotHasContent(this._headerSlot);
    if (sidebarEl) sidebarEl.hidden = !this._slotHasContent(this._sidebarSlot);
    if (asideEl) asideEl.hidden = !this._slotHasContent(this._asideSlot);
    if (footerEl) footerEl.hidden = !this._slotHasContent(this._footerSlot);
  }

  protected render(): void {
    const sidebarWidth = this.getAttribute('sidebar-width');
    const asideWidth = this.getAttribute('aside-width');
    if (sidebarWidth) this.style.setProperty('--ui-layout-sidebar-width', sidebarWidth);
    else this.style.removeProperty('--ui-layout-sidebar-width');
    if (asideWidth) this.style.setProperty('--ui-layout-aside-width', asideWidth);
    else this.style.removeProperty('--ui-layout-aside-width');

    this.setContent(`
      <style>${style}</style>
      <div class="layout" part="layout">
        <header class="header" part="header">
          <slot name="header"></slot>
        </header>
        <div class="body" part="body">
          <aside class="sidebar" part="sidebar">
            <slot name="sidebar"></slot>
          </aside>
          <main class="content" part="content">
            <slot name="content"></slot>
            <slot></slot>
          </main>
          <aside class="aside" part="aside">
            <slot name="aside"></slot>
          </aside>
        </div>
        <footer class="footer" part="footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    `);

    this._attachSlotHandlers();
    this._syncSlotVisibility();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-layout')) {
  customElements.define('ui-layout', UILayout);
}
