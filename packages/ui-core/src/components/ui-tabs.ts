import { ElementBase } from '../ElementBase';

type TabModel = {
  index: number;
  value: string;
  label: string;
  icon: string;
  disabled: boolean;
  tabId: string;
  panelId: string;
};

const style = `
  :host {
    --ui-tabs-nav-bg: var(--ui-color-surface, #ffffff);
    --ui-tabs-panel-bg: var(--ui-color-surface, #ffffff);
    --ui-tabs-border: var(--ui-color-border, #cbd5e1);
    --ui-tabs-text: var(--ui-color-text, #0f172a);
    --ui-tabs-muted: var(--ui-color-muted, #64748b);
    --ui-tabs-accent: var(--ui-tabs-active-bg, var(--ui-color-primary, #2563eb));
    --ui-tabs-active-text: color-mix(in srgb, var(--ui-tabs-accent) 82%, #0f172a 18%);
    --ui-tabs-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-tabs-indicator-bg: color-mix(in srgb, var(--ui-tabs-accent) 16%, transparent);
    --ui-tabs-indicator-border: color-mix(in srgb, var(--ui-tabs-accent) 32%, transparent);
    --ui-tabs-indicator-shadow: none;
    --ui-tabs-indicator-transition: 220ms cubic-bezier(0.2, 0.9, 0.2, 1);

    --ui-tabs-shell-gap: 12px;
    --ui-tabs-nav-padding: 8px;
    --ui-tabs-nav-gap: 8px;
    --ui-tabs-tab-radius: 10px;
    --ui-tabs-tab-min-h: 38px;
    --ui-tabs-tab-pad-x: 14px;
    --ui-tabs-tab-font-size: 13px;
    --ui-tabs-radius: 12px;
    --ui-tabs-panel-padding: 14px;

    --ui-tabs-shadow: none;
    --ui-tabs-elevation: none;
    --ui-tabs-transition: 170ms cubic-bezier(0.22, 0.8, 0.2, 1);

    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .shell {
    min-inline-size: 0;
    display: grid;
    gap: var(--ui-tabs-shell-gap);
    color: var(--ui-tabs-text);
  }

  .nav {
    min-inline-size: 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--ui-tabs-nav-gap);
    padding: var(--ui-tabs-nav-padding);
    border: 1px solid var(--ui-tabs-border);
    border-radius: var(--ui-tabs-radius);
    background: var(--ui-tabs-nav-bg);
    box-shadow: var(--ui-tabs-elevation);
    position: relative;
    isolation: isolate;
    overflow-x: auto;
    scrollbar-width: thin;
    overscroll-behavior-x: contain;
  }

  .nav::-webkit-scrollbar {
    block-size: 6px;
  }

  .nav::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--ui-tabs-border) 70%, transparent);
    border-radius: 999px;
  }

  .tab {
    border: 1px solid transparent;
    background: transparent;
    color: var(--ui-tabs-muted);
    border-radius: var(--ui-tabs-tab-radius);
    min-block-size: var(--ui-tabs-tab-min-h);
    padding-inline: var(--ui-tabs-tab-pad-x);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font: 600 var(--ui-tabs-tab-font-size)/1.25 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.005em;
    cursor: pointer;
    white-space: nowrap;
    flex: 0 0 auto;
    position: relative;
    z-index: 1;
    transition:
      background-color var(--ui-tabs-transition),
      border-color var(--ui-tabs-transition),
      color var(--ui-tabs-transition),
      box-shadow var(--ui-tabs-transition),
      transform var(--ui-tabs-transition);
  }

  .tab:hover {
    background: color-mix(in srgb, var(--ui-tabs-accent) 10%, transparent);
    color: color-mix(in srgb, var(--ui-tabs-accent) 82%, #0f172a 18%);
  }

  .tab[aria-selected="true"] {
    color: var(--ui-tabs-active-text);
    background: color-mix(in srgb, var(--ui-tabs-accent) 14%, transparent);
    border-color: color-mix(in srgb, var(--ui-tabs-accent) 34%, transparent);
  }

  .tab:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-tabs-focus) 28%, transparent);
  }

  .tab:active {
    transform: translateY(0.5px);
  }

  .tab[disabled] {
    opacity: 0.48;
    cursor: not-allowed;
    transform: none;
  }

  .tab[disabled]:hover {
    background: transparent;
    color: var(--ui-tabs-muted);
  }

  .tab-icon {
    font-size: 13px;
    line-height: 1;
  }

  .indicator {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    inline-size: var(--ui-tabs-indicator-w, 0px);
    block-size: var(--ui-tabs-indicator-h, 0px);
    transform: translate(var(--ui-tabs-indicator-x, 0px), var(--ui-tabs-indicator-y, 0px));
    border-radius: max(4px, calc(var(--ui-tabs-tab-radius) - 2px));
    background: var(--ui-tabs-indicator-bg);
    border: 1px solid var(--ui-tabs-indicator-border);
    box-shadow: var(--ui-tabs-indicator-shadow);
    opacity: 0;
    pointer-events: none;
    z-index: 0;
    transition:
      transform var(--ui-tabs-indicator-transition),
      inline-size var(--ui-tabs-indicator-transition),
      block-size var(--ui-tabs-indicator-transition),
      opacity 120ms ease;
  }

  :host([variant="indicator"]) .tab[aria-selected="true"],
  :host([variant="indicator-line"]) .tab[aria-selected="true"] {
    background: transparent;
    border-color: transparent;
    color: var(--ui-tabs-active-text);
  }

  :host([variant="indicator"]) .tab:hover,
  :host([variant="indicator-line"]) .tab:hover {
    background: transparent;
  }

  :host([variant="indicator"]) .nav[data-indicator-ready="true"] .indicator,
  :host([variant="indicator-line"]) .nav[data-indicator-ready="true"] .indicator {
    opacity: 1;
  }

  :host([variant="indicator-line"]) .indicator {
    background: var(--ui-tabs-accent);
    border: none;
    box-shadow: none;
    border-radius: 999px;
  }

  .panel-wrap {
    min-inline-size: 0;
    border: 1px solid var(--ui-tabs-border);
    border-radius: var(--ui-tabs-radius);
    background: var(--ui-tabs-panel-bg);
    box-shadow: var(--ui-tabs-elevation);
    padding: var(--ui-tabs-panel-padding);
  }

  .panel-wrap[hidden] {
    display: none;
  }

  .source-tabs {
    display: none;
  }

  :host([orientation="vertical"]) .shell {
    grid-template-columns: minmax(200px, 280px) minmax(0, 1fr);
    align-items: start;
  }

  :host([orientation="vertical"]) .nav {
    flex-direction: column;
    overflow-x: visible;
    overflow-y: auto;
    max-block-size: min(70vh, 520px);
  }

  :host([orientation="vertical"][stretched]) .tab {
    inline-size: 100%;
    justify-content: flex-start;
  }

  :host([stretched]:not([orientation="vertical"])) .tab {
    flex: 1;
  }

  :host([size="sm"]) {
    --ui-tabs-nav-padding: 6px;
    --ui-tabs-nav-gap: 6px;
    --ui-tabs-tab-min-h: 32px;
    --ui-tabs-tab-pad-x: 11px;
    --ui-tabs-tab-font-size: 12px;
    --ui-tabs-tab-radius: 8px;
    --ui-tabs-radius: 10px;
    --ui-tabs-panel-padding: 10px;
  }

  :host([size="lg"]) {
    --ui-tabs-nav-padding: 10px;
    --ui-tabs-nav-gap: 10px;
    --ui-tabs-tab-min-h: 42px;
    --ui-tabs-tab-pad-x: 16px;
    --ui-tabs-tab-font-size: 14px;
    --ui-tabs-tab-radius: 12px;
    --ui-tabs-radius: 14px;
    --ui-tabs-panel-padding: 16px;
  }

  :host([density="compact"]) {
    --ui-tabs-shell-gap: 8px;
    --ui-tabs-nav-padding: 4px;
    --ui-tabs-nav-gap: 4px;
    --ui-tabs-tab-min-h: 30px;
    --ui-tabs-tab-pad-x: 10px;
    --ui-tabs-tab-font-size: 12px;
    --ui-tabs-panel-padding: 10px;
  }

  :host([density="comfortable"]) {
    --ui-tabs-shell-gap: 14px;
    --ui-tabs-nav-padding: 10px;
    --ui-tabs-nav-gap: 10px;
    --ui-tabs-tab-min-h: 42px;
    --ui-tabs-tab-pad-x: 16px;
    --ui-tabs-tab-font-size: 14px;
    --ui-tabs-panel-padding: 16px;
  }

  :host([shape="square"]) {
    --ui-tabs-tab-radius: 6px;
    --ui-tabs-radius: 8px;
  }

  :host([shape="rounded"]) {
    --ui-tabs-tab-radius: 8px;
    --ui-tabs-radius: 10px;
  }

  :host([shape="pill"]) {
    --ui-tabs-tab-radius: 999px;
  }

  :host([elevation="none"]) {
    --ui-tabs-elevation: none;
  }

  :host([elevation="high"]) {
    --ui-tabs-elevation: 0 2px 4px rgba(15, 23, 42, 0.1), 0 18px 36px rgba(15, 23, 42, 0.14);
  }

  :host([variant="soft"]) {
    --ui-tabs-nav-bg: color-mix(in srgb, var(--ui-tabs-accent) 8%, var(--ui-color-surface, #ffffff));
    --ui-tabs-panel-bg: color-mix(in srgb, var(--ui-tabs-accent) 4%, var(--ui-color-surface, #ffffff));
    --ui-tabs-border: color-mix(in srgb, var(--ui-tabs-accent) 22%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="outline"]) {
    --ui-tabs-nav-bg: transparent;
    --ui-tabs-panel-bg: var(--ui-color-surface, #ffffff);
    --ui-tabs-border: color-mix(in srgb, var(--ui-tabs-accent) 42%, var(--ui-color-border, #cbd5e1));
    --ui-tabs-elevation: none;
  }

  :host([variant="outline"]) .tab[aria-selected="true"] {
    background: color-mix(in srgb, var(--ui-tabs-accent) 12%, transparent);
    border-color: color-mix(in srgb, var(--ui-tabs-accent) 56%, var(--ui-tabs-border));
  }

  :host([variant="solid"]) {
    --ui-tabs-nav-bg: var(--ui-tabs-accent);
    --ui-tabs-panel-bg: var(--ui-color-surface, #ffffff);
    --ui-tabs-border: color-mix(in srgb, var(--ui-tabs-accent) 76%, #0f172a 24%);
    --ui-tabs-muted: color-mix(in srgb, var(--ui-color-primary-foreground, #ffffff) 80%, transparent);
    --ui-tabs-active-text: color-mix(in srgb, var(--ui-tabs-accent) 78%, #0f172a 22%);
    --ui-tabs-focus: color-mix(in srgb, var(--ui-color-primary-foreground, #ffffff) 72%, var(--ui-tabs-accent));
  }

  :host([variant="solid"]) .tab:hover {
    background: color-mix(in srgb, var(--ui-color-primary-foreground, #ffffff) 14%, transparent);
    color: var(--ui-color-primary-foreground, #ffffff);
  }

  :host([variant="solid"]) .tab[aria-selected="true"] {
    background: var(--ui-color-primary-foreground, #ffffff);
    border-color: color-mix(in srgb, var(--ui-tabs-accent) 44%, var(--ui-tabs-border));
    color: var(--ui-tabs-active-text);
  }

  :host([variant="ghost"]) .nav,
  :host([variant="ghost"]) .panel-wrap {
    border-color: transparent;
    box-shadow: none;
    background: transparent;
  }

  :host([variant="ghost"]) .nav {
    padding-inline: 0;
  }

  :host([variant="ghost"]) .tab {
    border-color: transparent;
  }

  :host([variant="ghost"]) .tab[aria-selected="true"] {
    background: color-mix(in srgb, var(--ui-tabs-accent) 14%, transparent);
    border-color: transparent;
  }

  :host([variant="glass"]) .nav,
  :host([variant="glass"]) .panel-wrap {
    background: color-mix(in srgb, var(--ui-color-surface, #ffffff) 72%, transparent);
    border-color: color-mix(in srgb, var(--ui-tabs-border) 70%, transparent);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  :host([variant="underline"]) .nav,
  :host([variant="line"]) .nav {
    border-radius: 0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    box-shadow: none;
    padding-inline: 0;
    background: transparent;
  }

  :host([variant="underline"]) .tab,
  :host([variant="line"]) .tab {
    border-radius: 0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 2px solid transparent;
  }

  :host([variant="underline"]) .tab[aria-selected="true"],
  :host([variant="line"]) .tab[aria-selected="true"] {
    background: transparent;
    border-bottom-color: var(--ui-tabs-accent);
  }

  :host([variant="segmented"]) .nav {
    background: color-mix(in srgb, var(--ui-color-surface-alt, #e2e8f0) 72%, var(--ui-color-surface, #ffffff));
    border-color: transparent;
    box-shadow: none;
  }

  :host([variant="segmented"]) .tab[aria-selected="true"] {
    background: var(--ui-color-surface, #ffffff);
    border-color: color-mix(in srgb, var(--ui-tabs-accent) 28%, var(--ui-color-border, #cbd5e1));
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  }

  :host([variant="cards"]) .nav,
  :host([variant="cards"]) .panel-wrap {
    border: none;
    box-shadow: none;
    background: transparent;
    padding: 0;
  }

  :host([variant="cards"]) .nav {
    gap: 10px;
  }

  :host([variant="cards"]) .tab {
    border-color: color-mix(in srgb, var(--ui-tabs-border) 80%, transparent);
    background: var(--ui-tabs-nav-bg);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
  }

  :host([variant="cards"]) .tab[aria-selected="true"] {
    border-color: color-mix(in srgb, var(--ui-tabs-accent) 38%, var(--ui-tabs-border));
    box-shadow: 0 10px 24px color-mix(in srgb, var(--ui-tabs-accent) 18%, transparent);
  }

  :host([variant="minimal"]) .nav,
  :host([variant="minimal"]) .panel-wrap,
  :host([bare]) .nav,
  :host([bare]) .panel-wrap {
    border-color: transparent;
    box-shadow: none;
    background: transparent;
  }

  :host([bare]) .nav,
  :host([variant="minimal"]) .nav {
    padding-inline: 0;
  }

  :host([variant="contrast"]) {
    --ui-tabs-nav-bg: #111827;
    --ui-tabs-panel-bg: #0f172a;
    --ui-tabs-border: #334155;
    --ui-tabs-text: #e2e8f0;
    --ui-tabs-muted: #94a3b8;
    --ui-tabs-accent: var(--ui-tabs-active-bg, #93c5fd);
    --ui-tabs-active-text: #dbeafe;
    --ui-tabs-focus: #93c5fd;
    --ui-tabs-indicator-bg: color-mix(in srgb, #93c5fd 24%, transparent);
    --ui-tabs-indicator-border: color-mix(in srgb, #93c5fd 46%, transparent);
    --ui-tabs-indicator-shadow: 0 0 0 1px rgba(147, 197, 253, 0.24);
    --ui-tabs-shadow: 0 16px 34px rgba(2, 6, 23, 0.42), 0 32px 54px rgba(2, 6, 23, 0.4);
  }

  :host([tone="success"]) {
    --ui-tabs-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-tabs-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-tabs-accent: var(--ui-color-danger, #dc2626);
  }

  :host([headless]) .nav,
  :host([headless]) .panel-wrap {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .tab,
    .nav {
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }

  @media (prefers-contrast: more) {
    .nav,
    .panel-wrap {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-tabs-nav-bg: Canvas;
      --ui-tabs-panel-bg: Canvas;
      --ui-tabs-border: CanvasText;
      --ui-tabs-text: CanvasText;
      --ui-tabs-muted: CanvasText;
      --ui-tabs-accent: Highlight;
      --ui-tabs-focus: Highlight;
      --ui-tabs-elevation: none;
    }

    .tab[aria-selected="true"] {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
    }
  }
`;

function escapeHtml(value: string): string {
  return String(value)
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

const RENDER_ATTRS = new Set([
  'orientation',
  'activation',
  'headless',
  'variant',
  'size',
  'density',
  'tone',
  'stretched',
  'shape',
  'elevation',
  'bare'
]);

export class UITabs extends ElementBase {
  static get observedAttributes() {
    return [
      'selected',
      'value',
      'orientation',
      'activation',
      'headless',
      'variant',
      'size',
      'density',
      'tone',
      'stretched',
      'shape',
      'elevation',
      'loop',
      'bare'
    ];
  }

  private _uid = `ui-tabs-${Math.random().toString(36).slice(2, 9)}`;
  private _observer: MutationObserver | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _isSyncing = false;
  private _isSyncingSelectionAttributes = false;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onWindowResize = this._onWindowResize.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);

    this._observer = new MutationObserver(() => {
      if (this._isSyncing) return;
      this.requestRender();
    });

    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['slot', 'data-label', 'data-value', 'data-icon', 'data-disabled', 'disabled', 'data-active']
    });

    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => this._syncSelectionUi());
      this._resizeObserver.observe(this);
    } else {
      window.addEventListener('resize', this._onWindowResize);
    }

    this._syncSelectionUi();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    } else {
      window.removeEventListener('resize', this._onWindowResize);
    }

    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'selected' || name === 'value') {
      if (!this._isSyncingSelectionAttributes) {
        this._syncSelectionUi();
      }
      return;
    }

    if (RENDER_ATTRS.has(name) && this.isConnected) {
      this.requestRender();
    }
  }

  get selected(): string {
    return this.getAttribute('selected') || '0';
  }

  set selected(next: string | number) {
    const normalized = String(next);
    if (!normalized) this.removeAttribute('selected');
    else this.setAttribute('selected', normalized);
  }

  private _sourceTabs(): HTMLElement[] {
    return Array.from(this.querySelectorAll('[slot="tab"]')) as HTMLElement[];
  }

  private _sourcePanels(): HTMLElement[] {
    return Array.from(this.querySelectorAll('[slot="panel"]')) as HTMLElement[];
  }

  private _tabsModel(): TabModel[] {
    return this._sourceTabs().map((source, index) => {
      const value = source.getAttribute('data-value') || source.getAttribute('value') || String(index);
      const label = source.getAttribute('data-label') || source.textContent?.trim() || `Tab ${index + 1}`;
      const icon = source.getAttribute('data-icon') || '';
      const disabled = source.hasAttribute('disabled') || isTruthy(source.getAttribute('data-disabled'));
      const tabId = `${this._uid}-tab-${index}`;
      const panelId = `${this._uid}-panel-${index}`;
      return { index, value, label, icon, disabled, tabId, panelId };
    });
  }

  private _resolveSelectedIndex(model: TabModel[]): number {
    if (!model.length) return -1;

    const selectedRaw = this.getAttribute('selected');
    const valueRaw = this.getAttribute('value');
    const sourceTabs = this._sourceTabs();

    let index = -1;

    if (selectedRaw != null && selectedRaw !== '') {
      const numeric = Number(selectedRaw);
      if (Number.isFinite(numeric)) index = Math.trunc(numeric);
      else index = model.findIndex((item) => item.value === selectedRaw);
    }

    if (index < 0 && valueRaw) {
      index = model.findIndex((item) => item.value === valueRaw);
    }

    if (index < 0) {
      index = model.findIndex((item, i) => !!sourceTabs[i]?.hasAttribute('data-active') && !item.disabled);
    }

    if (index < 0 || !model[index] || model[index].disabled) {
      index = model.findIndex((item) => !item.disabled);
    }

    return index;
  }

  private _syncSelectedAttributes(model: TabModel[], selectedIndex: number): void {
    const selected = model[selectedIndex];

    this._isSyncingSelectionAttributes = true;
    try {
      if (!selected) {
        this.removeAttribute('selected');
        this.removeAttribute('value');
        return;
      }

      if (this.getAttribute('selected') !== String(selectedIndex)) {
        this.setAttribute('selected', String(selectedIndex));
      }

      if (this.getAttribute('value') !== selected.value) {
        this.setAttribute('value', selected.value);
      }
    } finally {
      this._isSyncingSelectionAttributes = false;
    }
  }

  private _emit(name: string, model: TabModel[], selectedIndex: number): void {
    const tab = model[selectedIndex];
    if (!tab) return;

    const detail = {
      selected: selectedIndex,
      index: selectedIndex,
      value: tab.value,
      label: tab.label,
      tabId: tab.tabId,
      panelId: tab.panelId
    };

    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private _setSelectedByIndex(model: TabModel[], nextIndex: number, emitChange: boolean): void {
    const next = model[nextIndex];
    if (!next || next.disabled) return;

    const currentIndex = this._resolveSelectedIndex(model);
    if (currentIndex === nextIndex) {
      this._focusTab(nextIndex);
      return;
    }

    this.setAttribute('selected', String(nextIndex));
    this.setAttribute('value', next.value);

    if (emitChange) {
      this._emit('change', model, nextIndex);
      this._emit('select', model, nextIndex);
    }
  }

  private _syncSelectionUi(): void {
    if (!this.isConnected) return;
    if (!this.root.querySelector('.nav')) {
      this.requestRender();
      return;
    }

    const model = this._tabsModel();
    if (!model.length) return;

    const selectedIndex = this._resolveSelectedIndex(model);
    this._syncSelectedAttributes(model, selectedIndex);

    const buttons = Array.from(this.root.querySelectorAll<HTMLButtonElement>('.tab'));
    buttons.forEach((button, index) => {
      const tab = model[index];
      if (!tab) return;

      const selectedState = index === selectedIndex;
      button.setAttribute('aria-selected', selectedState ? 'true' : 'false');
      button.setAttribute('tabindex', selectedState && !tab.disabled ? '0' : '-1');
      button.setAttribute('aria-controls', tab.panelId);
      button.setAttribute('aria-disabled', tab.disabled ? 'true' : 'false');

      if (tab.disabled) button.setAttribute('disabled', '');
      else button.removeAttribute('disabled');
    });

    const selected = model[selectedIndex];
    this._syncIndicator(selectedIndex);
    if (selected) {
      this.setAttribute('aria-activedescendant', selected.tabId);
      this.setAttribute('aria-controls', selected.panelId);
      this._scrollSelectedTabIntoView(selectedIndex);
    } else {
      this.removeAttribute('aria-activedescendant');
      this.removeAttribute('aria-controls');
    }

    this._syncPanels(model, selectedIndex);
  }

  private _syncIndicator(selectedIndex: number): void {
    const nav = this.root.querySelector('.nav') as HTMLElement | null;
    if (!nav) return;

    const variant = this.getAttribute('variant') || 'default';
    const usePillIndicator = variant === 'indicator';
    const useLineIndicator = variant === 'indicator-line';

    if (!usePillIndicator && !useLineIndicator) {
      nav.removeAttribute('data-indicator-ready');
      nav.style.removeProperty('--ui-tabs-indicator-x');
      nav.style.removeProperty('--ui-tabs-indicator-y');
      nav.style.removeProperty('--ui-tabs-indicator-w');
      nav.style.removeProperty('--ui-tabs-indicator-h');
      return;
    }

    const selectedTab = this.root.querySelector(`.tab[data-index="${selectedIndex}"]`) as HTMLElement | null;
    if (!selectedTab) {
      nav.removeAttribute('data-indicator-ready');
      return;
    }

    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    const rtl = getComputedStyle(this).direction === 'rtl';

    let x = selectedTab.offsetLeft;
    let y = selectedTab.offsetTop;
    let w = selectedTab.offsetWidth;
    let h = selectedTab.offsetHeight;

    if (usePillIndicator) {
      const inset = 2;
      x += inset;
      y += inset;
      w = Math.max(0, w - inset * 2);
      h = Math.max(0, h - inset * 2);
    } else if (orientation === 'vertical') {
      const thickness = 3;
      const inset = 5;
      y += inset;
      h = Math.max(8, h - inset * 2);
      w = thickness;
      x += rtl ? selectedTab.offsetWidth - thickness - 2 : 2;
    } else {
      const thickness = 2;
      const inset = 8;
      x += inset;
      w = Math.max(12, w - inset * 2);
      h = thickness;
      y += selectedTab.offsetHeight - thickness - 2;
    }

    nav.style.setProperty('--ui-tabs-indicator-x', `${x}px`);
    nav.style.setProperty('--ui-tabs-indicator-y', `${y}px`);
    nav.style.setProperty('--ui-tabs-indicator-w', `${w}px`);
    nav.style.setProperty('--ui-tabs-indicator-h', `${h}px`);
    nav.setAttribute('data-indicator-ready', 'true');
  }

  private _syncPanels(model: TabModel[], selectedIndex: number): void {
    const panels = this._sourcePanels();
    const panelWrap = this.root.querySelector('.panel-wrap') as HTMLElement | null;

    if (panelWrap) {
      if (!panels.length) panelWrap.setAttribute('hidden', '');
      else panelWrap.removeAttribute('hidden');
    }

    this._isSyncing = true;
    try {
      panels.forEach((panel, index) => {
        const tab = model[index];
        const active = index === selectedIndex;

        panel.id = tab?.panelId || `${this._uid}-panel-${index}`;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('tabindex', active ? '0' : '-1');
        panel.setAttribute('aria-hidden', active ? 'false' : 'true');

        if (tab) {
          panel.setAttribute('aria-labelledby', tab.tabId);
        }

        if (active) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      });
    } finally {
      this._isSyncing = false;
    }
  }

  private _enabledIndices(model: TabModel[]): number[] {
    return model.filter((tab) => !tab.disabled).map((tab) => tab.index);
  }

  private _onWindowResize(): void {
    this._syncSelectionUi();
  }

  private _focusTab(index: number): void {
    const node = this.root.querySelector(`.tab[data-index="${index}"]`) as HTMLButtonElement | null;
    node?.focus();
  }

  private _scrollSelectedTabIntoView(index: number): void {
    const nav = this.root.querySelector('.nav') as HTMLElement | null;
    const button = this.root.querySelector(`.tab[data-index="${index}"]`) as HTMLElement | null;
    if (!nav || !button) return;

    const shouldCenter = this.getAttribute('orientation') !== 'vertical';
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    button.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: shouldCenter ? 'center' : 'nearest'
    });
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    const button = target?.closest('.tab') as HTMLButtonElement | null;
    if (!button || button.disabled) return;

    const index = Number(button.getAttribute('data-index'));
    if (!Number.isFinite(index)) return;

    const model = this._tabsModel();
    this._setSelectedByIndex(model, index, true);
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const button = target?.closest('.tab') as HTMLButtonElement | null;
    if (!button) return;

    const model = this._tabsModel();
    if (!model.length) return;

    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    const activation = this.getAttribute('activation') === 'manual' ? 'manual' : 'auto';
    const shouldLoop = !this.hasAttribute('loop') || isTruthy(this.getAttribute('loop'));
    const rtl = getComputedStyle(this).direction === 'rtl';

    const enabled = this._enabledIndices(model);
    if (!enabled.length) return;

    const currentIndex = Number(button.getAttribute('data-index'));
    if (!Number.isFinite(currentIndex)) return;

    const enabledPosition = enabled.indexOf(currentIndex);
    if (enabledPosition < 0) return;

    const moveFocus = (nextEnabledPosition: number) => {
      if (!shouldLoop && (nextEnabledPosition < 0 || nextEnabledPosition >= enabled.length)) {
        return;
      }

      const resolved = shouldLoop
        ? enabled[(nextEnabledPosition + enabled.length) % enabled.length]
        : enabled[nextEnabledPosition];

      if (resolved == null) return;

      this._focusTab(resolved);
      if (activation === 'auto') {
        this._setSelectedByIndex(model, resolved, true);
      } else {
        this._emit('focus', model, resolved);
      }
    };

    if (
      (orientation === 'horizontal' && ((event.key === 'ArrowRight' && !rtl) || (event.key === 'ArrowLeft' && rtl))) ||
      (orientation === 'vertical' && event.key === 'ArrowDown')
    ) {
      event.preventDefault();
      moveFocus(enabledPosition + 1);
      return;
    }

    if (
      (orientation === 'horizontal' && ((event.key === 'ArrowLeft' && !rtl) || (event.key === 'ArrowRight' && rtl))) ||
      (orientation === 'vertical' && event.key === 'ArrowUp')
    ) {
      event.preventDefault();
      moveFocus(enabledPosition - 1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      moveFocus(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      moveFocus(enabled.length - 1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._setSelectedByIndex(model, currentIndex, true);
    }
  }

  protected override render(): void {
    const model = this._tabsModel();
    const selectedIndex = this._resolveSelectedIndex(model);

    this._syncSelectedAttributes(model, selectedIndex);

    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    const nav = model
      .map((tab) => {
        const selectedState = tab.index === selectedIndex;
        const icon = tab.icon ? `<span class="tab-icon" aria-hidden="true">${escapeHtml(tab.icon)}</span>` : '';
        return `
          <button
            type="button"
            class="tab"
            part="tab"
            id="${tab.tabId}"
            role="tab"
            data-index="${tab.index}"
            aria-selected="${selectedState ? 'true' : 'false'}"
            aria-controls="${tab.panelId}"
            aria-disabled="${tab.disabled ? 'true' : 'false'}"
            tabindex="${selectedState && !tab.disabled ? '0' : '-1'}"
            ${tab.disabled ? 'disabled' : ''}
          >
            ${icon}
            <span class="tab-label">${escapeHtml(tab.label)}</span>
          </button>
        `;
      })
      .join('');

    this.setContent(`
      <style>${style}</style>
      <section class="shell" part="shell">
        <div class="nav" role="tablist" aria-orientation="${orientation}" part="nav">
          <span class="indicator" part="indicator" aria-hidden="true"></span>
          ${nav}
        </div>
        <div class="panel-wrap" part="panel-wrap" aria-live="polite">
          <slot name="panel"></slot>
        </div>
      </section>
      <slot class="source-tabs" name="tab"></slot>
    `);

    const selected = model[selectedIndex];
    if (selected) {
      this.setAttribute('aria-activedescendant', selected.tabId);
      this.setAttribute('aria-controls', selected.panelId);
    } else {
      this.removeAttribute('aria-activedescendant');
      this.removeAttribute('aria-controls');
    }

    this._syncIndicator(selectedIndex);
    this._syncPanels(model, selectedIndex);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-tabs')) {
  customElements.define('ui-tabs', UITabs);
}
