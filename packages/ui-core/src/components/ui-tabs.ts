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
    --ui-tabs-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-tabs-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-tabs-text: var(--ui-color-text, #0f172a);
    --ui-tabs-muted: var(--ui-color-muted, #64748b);
    --ui-tabs-accent: var(--ui-tabs-active-bg, var(--ui-color-primary, #2563eb));
    --ui-tabs-active-color: color-mix(in srgb, var(--ui-tabs-accent) 84%, #0f172a 16%);
    --ui-tabs-radius: 14px;
    --ui-tabs-tab-radius: 10px;
    --ui-tabs-gap: 8px;
    --ui-tabs-padding: 8px;
    --ui-tabs-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-tabs-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 14px 34px rgba(15, 23, 42, 0.08);

    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .shell {
    min-inline-size: 0;
    display: grid;
    gap: 10px;
    color: var(--ui-tabs-text);
  }

  .nav {
    min-inline-size: 0;
    display: flex;
    flex-wrap: nowrap;
    gap: var(--ui-tabs-gap);
    padding: var(--ui-tabs-padding);
    border: 1px solid var(--ui-tabs-border);
    border-radius: var(--ui-tabs-radius);
    background: var(--ui-tabs-bg);
    box-shadow: var(--ui-tabs-shadow);
    overflow-x: auto;
  }

  :host([orientation="vertical"]) .shell {
    grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
    align-items: start;
  }

  :host([orientation="vertical"]) .nav {
    flex-direction: column;
    overflow-x: visible;
  }

  .tab {
    border: 1px solid transparent;
    background: transparent;
    color: var(--ui-tabs-muted);
    border-radius: var(--ui-tabs-tab-radius);
    min-block-size: 36px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font: 600 13px/1.25 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    white-space: nowrap;
    transition:
      background-color 170ms ease,
      border-color 170ms ease,
      color 170ms ease,
      box-shadow 170ms ease,
      transform 170ms ease;
  }

  .tab[aria-selected="true"] {
    background: color-mix(in srgb, var(--ui-tabs-accent) 14%, transparent);
    color: var(--ui-tabs-active-color);
    border-color: color-mix(in srgb, var(--ui-tabs-accent) 36%, transparent);
  }

  .tab:hover {
    background: color-mix(in srgb, var(--ui-tabs-accent) 10%, transparent);
    color: color-mix(in srgb, var(--ui-tabs-accent) 78%, #0f172a 22%);
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
  }

  .tab-icon {
    font-size: 13px;
    line-height: 1;
  }

  .panel-wrap {
    min-inline-size: 0;
    border: 1px solid var(--ui-tabs-border);
    border-radius: var(--ui-tabs-radius);
    background: var(--ui-tabs-bg);
    box-shadow: var(--ui-tabs-shadow);
    padding: 12px;
  }

  .source-tabs {
    display: none;
  }

  :host([stretched]) .tab {
    flex: 1;
  }

  :host([size="sm"]) {
    --ui-tabs-padding: 6px;
    --ui-tabs-gap: 6px;
    --ui-tabs-tab-radius: 8px;
  }

  :host([size="sm"]) .tab {
    min-block-size: 32px;
    padding-inline: 10px;
    font-size: 12px;
  }

  :host([size="lg"]) {
    --ui-tabs-padding: 10px;
    --ui-tabs-gap: 10px;
    --ui-tabs-tab-radius: 11px;
  }

  :host([size="lg"]) .tab {
    min-block-size: 40px;
    padding-inline: 14px;
    font-size: 14px;
  }

  :host([variant="soft"]) {
    --ui-tabs-bg: color-mix(in srgb, var(--ui-tabs-accent) 8%, var(--ui-color-surface, #ffffff));
  }

  :host([variant="contrast"]) {
    --ui-tabs-bg: #0f172a;
    --ui-tabs-border: #334155;
    --ui-tabs-text: #e2e8f0;
    --ui-tabs-muted: #93a4bd;
    --ui-tabs-accent: var(--ui-tabs-active-bg, #93c5fd);
    --ui-tabs-active-color: #dbeafe;
    --ui-tabs-focus: #93c5fd;
    --ui-tabs-shadow:
      0 16px 34px rgba(2, 6, 23, 0.42),
      0 32px 54px rgba(2, 6, 23, 0.4);
  }

  :host([variant="minimal"]) .nav,
  :host([variant="minimal"]) .panel-wrap {
    border-color: transparent;
    box-shadow: none;
    background: transparent;
    padding-inline: 0;
  }

  :host([variant="underline"]) .tab {
    border-radius: 0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 2px solid transparent;
  }

  :host([variant="underline"]) .tab[aria-selected="true"] {
    background: transparent;
    border-bottom-color: var(--ui-tabs-accent);
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
    .tab {
      transition: none !important;
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
      --ui-tabs-bg: Canvas;
      --ui-tabs-border: CanvasText;
      --ui-tabs-text: CanvasText;
      --ui-tabs-muted: CanvasText;
      --ui-tabs-accent: Highlight;
      --ui-tabs-focus: Highlight;
      --ui-tabs-shadow: none;
    }

    .tab[aria-selected="true"] {
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
      'tone',
      'stretched'
    ];
  }

  private _uid = `ui-tabs-${Math.random().toString(36).slice(2, 9)}`;
  private _observer: MutationObserver | null = null;
  private _isSyncing = false;
  private _isSyncingSelectionAttributes = false;

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

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'selected' || name === 'value') {
      if (!this._isSyncingSelectionAttributes) {
        this._syncSelectionUi();
      }
      return;
    }

    if (this.isConnected) this.requestRender();
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
      index = model.findIndex((item, i) => {
        const source = this._sourceTabs()[i];
        return !!source?.hasAttribute('data-active') && !item.disabled;
      });
    }

    if (index < 0 || !model[index] || model[index].disabled) {
      index = model.findIndex((item) => !item.disabled);
    }

    return Math.max(0, index);
  }

  private _syncSelectedAttributes(model: TabModel[], selectedIndex: number): void {
    const selected = model[selectedIndex];
    if (!selected) return;

    this._isSyncingSelectionAttributes = true;
    try {
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
    if (currentIndex === nextIndex && !emitChange) return;

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
    const selected = model[selectedIndex];
    this._syncSelectedAttributes(model, selectedIndex);

    const buttons = Array.from(this.root.querySelectorAll<HTMLButtonElement>('.tab'));
    buttons.forEach((button, index) => {
      const tab = model[index];
      if (!tab) return;
      const selectedState = index === selectedIndex;
      button.setAttribute('aria-selected', selectedState ? 'true' : 'false');
      button.setAttribute('tabindex', selectedState && !tab.disabled ? '0' : '-1');
      button.setAttribute('aria-controls', tab.panelId);
      if (tab.disabled) button.setAttribute('disabled', '');
      else button.removeAttribute('disabled');
    });

    if (selected) {
      this.setAttribute('aria-activedescendant', selected.tabId);
      this.setAttribute('aria-controls', selected.panelId);
    } else {
      this.removeAttribute('aria-activedescendant');
      this.removeAttribute('aria-controls');
    }

    this._syncPanels(model, selectedIndex);
  }

  private _syncPanels(model: TabModel[], selectedIndex: number): void {
    const panels = this._sourcePanels();

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

  private _focusTab(index: number): void {
    const node = this.root.querySelector(`.tab[data-index="${index}"]`) as HTMLButtonElement | null;
    node?.focus();
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    const button = target?.closest('.tab') as HTMLButtonElement | null;
    if (!button) return;

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
    const enabled = this._enabledIndices(model);
    if (!enabled.length) return;

    const currentIndex = Number(button.getAttribute('data-index'));
    if (!Number.isFinite(currentIndex)) return;

    const enabledPosition = enabled.indexOf(currentIndex);
    const moveFocus = (nextEnabledPosition: number) => {
      const resolved = enabled[(nextEnabledPosition + enabled.length) % enabled.length];
      this._focusTab(resolved);
      if (activation === 'auto') {
        this._setSelectedByIndex(model, resolved, true);
      } else {
        this._emit('focus', model, resolved);
      }
    };

    if ((orientation === 'horizontal' && event.key === 'ArrowRight') || (orientation === 'vertical' && event.key === 'ArrowDown')) {
      event.preventDefault();
      moveFocus(enabledPosition + 1);
      return;
    }

    if ((orientation === 'horizontal' && event.key === 'ArrowLeft') || (orientation === 'vertical' && event.key === 'ArrowUp')) {
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

    const selected = model[selectedIndex];
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
        <div class="nav" role="tablist" aria-orientation="${this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal'}" part="nav">
          ${nav}
        </div>
        <div class="panel-wrap" part="panel-wrap" aria-live="polite">
          <slot name="panel"></slot>
        </div>
      </section>
      <slot class="source-tabs" name="tab"></slot>
    `);

    if (selected) {
      this.setAttribute('aria-activedescendant', selected.tabId);
      this.setAttribute('aria-controls', selected.panelId);
    }

    this._syncPanels(model, selectedIndex);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-tabs')) {
  customElements.define('ui-tabs', UITabs);
}
