import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-sidebar-width: 260px;
    --ui-sidebar-collapsed-width: 72px;
    --ui-sidebar-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-sidebar-color: var(--ui-color-text, var(--ui-text, #1e293b));
    --ui-sidebar-border-color: var(--ui-color-border, var(--ui-border, rgba(15, 23, 42, 0.14)));
    --ui-sidebar-border: 1px solid var(--ui-sidebar-border-color);
    --ui-sidebar-hover-bg: var(--ui-color-surface-alt, var(--ui-surface-alt, #f8fafc));
    --ui-sidebar-accent-bg: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 16%, transparent);
    --ui-sidebar-accent-color: var(--ui-color-primary, var(--ui-primary, #1d4ed8));
    --ui-sidebar-control-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-sidebar-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-sidebar-item-radius: 10px;
    --ui-sidebar-item-padding: 10px 12px;
    --ui-sidebar-gap: 6px;
    --ui-sidebar-transition: width 0.2s ease, background 0.2s ease;
    color-scheme: light dark;
  }
  .shell {
    width: var(--ui-sidebar-width);
    min-height: 100%;
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    gap: 10px;
    padding: 12px;
    border-right: var(--ui-sidebar-border);
    background: var(--ui-sidebar-bg);
    color: var(--ui-sidebar-color);
    box-sizing: border-box;
    transition: var(--ui-sidebar-transition);
  }
  :host([position="right"]) .shell {
    border-right: none;
    border-left: var(--ui-sidebar-border);
  }
  :host([collapsed]) .shell {
    width: var(--ui-sidebar-collapsed-width);
  }
  .header,
  .footer {
    min-height: 28px;
  }
  .collapse-row {
    display: flex;
    justify-content: flex-end;
  }
  .collapse-btn {
    border: var(--ui-sidebar-border);
    background: var(--ui-sidebar-control-bg);
    color: var(--ui-sidebar-color);
    border-radius: 8px;
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
  }
  .collapse-btn:focus-visible {
    outline: 2px solid var(--ui-sidebar-focus-ring);
    outline-offset: 1px;
  }
  nav {
    min-height: 0;
  }
  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--ui-sidebar-gap);
  }
  .nav-item {
    width: 100%;
    border: none;
    background: transparent;
    color: inherit;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border-radius: var(--ui-sidebar-item-radius);
    padding: var(--ui-sidebar-item-padding);
    cursor: pointer;
    font: inherit;
    text-align: left;
  }
  .nav-item:hover {
    background: var(--ui-sidebar-hover-bg);
  }
  .nav-item[aria-current="page"] {
    background: var(--ui-sidebar-accent-bg);
    color: var(--ui-sidebar-accent-color);
    font-weight: 600;
  }
  .nav-item:focus-visible {
    outline: 2px solid var(--ui-sidebar-focus-ring);
    outline-offset: -1px;
  }
  .nav-item[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .icon {
    width: 20px;
    min-width: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :host([collapsed]) .label {
    display: none;
  }
  .source-items {
    display: none;
  }
  :host([headless]) .shell {
    display: none;
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-sidebar-border: 2px solid var(--ui-sidebar-border-color);
      --ui-sidebar-hover-bg: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 20%, transparent);
      --ui-sidebar-accent-bg: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 30%, transparent);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-sidebar-bg: Canvas;
      --ui-sidebar-color: CanvasText;
      --ui-sidebar-border-color: CanvasText;
      --ui-sidebar-hover-bg: Highlight;
      --ui-sidebar-accent-bg: Highlight;
      --ui-sidebar-accent-color: HighlightText;
      --ui-sidebar-control-bg: Canvas;
      --ui-sidebar-focus-ring: Highlight;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type SidebarItem = {
  value: string;
  label: string;
  icon: string;
  disabled: boolean;
  active: boolean;
};

export class UISidebar extends ElementBase {
  static get observedAttributes() {
    return ['collapsed', 'position', 'headless', 'collapsible', 'value'];
  }

  private _observer: MutationObserver | null;

  constructor() {
    super();
    this._observer = null;
    this._onRootClick = this._onRootClick.bind(this);
    this._onRootKeyDown = this._onRootKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
    this.root.addEventListener('keydown', this._onRootKeyDown as EventListener);

    this._observer = new MutationObserver(() => this.render());
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['slot', 'data-value', 'value', 'data-label', 'data-icon', 'data-disabled', 'data-active'],
    });
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    this.root.removeEventListener('keydown', this._onRootKeyDown as EventListener);

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    super.disconnectedCallback();
  }

  get collapsed() {
    return this.hasAttribute('collapsed');
  }

  set collapsed(value: boolean) {
    if (value === this.collapsed) return;
    if (value) this.setAttribute('collapsed', '');
    else this.removeAttribute('collapsed');
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    if ((next || '') === this.value) return;
    if (!next) this.removeAttribute('value');
    else this.setAttribute('value', next);
  }

  toggle() {
    this.collapsed = !this.collapsed;
    this.dispatchEvent(new CustomEvent('toggle', { detail: { collapsed: this.collapsed }, bubbles: true }));
  }

  private _sourceItems(): HTMLElement[] {
    const items = Array.from(this.querySelectorAll('[slot="item"]')) as HTMLElement[];
    if (items.length > 0) return items;
    return Array.from(this.children).filter((node) => node instanceof HTMLElement) as HTMLElement[];
  }

  private _items(): SidebarItem[] {
    const source = this._sourceItems();
    const selectedValue = this.value;

    return source.map((item, index) => {
      const value =
        item.getAttribute('data-value') ||
        item.getAttribute('value') ||
        String(index);

      const label =
        item.getAttribute('data-label') ||
        (item.textContent || '').trim() ||
        `Item ${index + 1}`;

      const icon = item.getAttribute('data-icon') || '';
      const disabled = item.hasAttribute('data-disabled') || item.hasAttribute('disabled');
      const active = selectedValue
        ? selectedValue === value
        : item.hasAttribute('data-active') || index === 0;

      return { value, label, icon, disabled, active };
    });
  }

  private _selectIndex(index: number) {
    const items = this._items();
    const entry = items[index];
    if (!entry || entry.disabled) return;

    this.value = entry.value;

    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { index, value: entry.value, label: entry.label },
        bubbles: true,
      })
    );

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { index, value: entry.value, label: entry.label },
        bubbles: true,
      })
    );
  }

  private _onRootClick(event: Event) {
    const target = event.target as HTMLElement;

    const collapseButton = target.closest('.collapse-btn');
    if (collapseButton) {
      this.toggle();
      return;
    }

    const navItem = target.closest('.nav-item') as HTMLElement | null;
    if (!navItem || navItem.hasAttribute('disabled')) return;

    const index = Number(navItem.getAttribute('data-index'));
    if (Number.isNaN(index)) return;

    this._selectIndex(index);
  }

  private _onRootKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const navItem = target.closest('.nav-item') as HTMLElement | null;
    if (!navItem) return;

    const items = Array.from(this.root.querySelectorAll('.nav-item:not([disabled])')) as HTMLElement[];
    const currentIndex = items.indexOf(navItem);
    if (currentIndex < 0) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const sourceIndex = Number(navItem.getAttribute('data-index'));
      if (!Number.isNaN(sourceIndex)) this._selectIndex(sourceIndex);
      return;
    }

    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

    let next = currentIndex;
    if (event.key === 'ArrowDown') next = (currentIndex + 1) % items.length;
    if (event.key === 'ArrowUp') next = (currentIndex - 1 + items.length) % items.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = items.length - 1;

    (items[next] as HTMLElement).focus();
    event.preventDefault();
  }

  protected render() {
    const items = this._items();
    const collapsible = this.hasAttribute('collapsible');
    const position = this.getAttribute('position') === 'right' ? 'right' : 'left';

    const renderedItems = items
      .map((item, index) => {
        const icon = item.icon
          ? `<span class="icon" aria-hidden="true">${escapeHtml(item.icon)}</span>`
          : '<span class="icon" aria-hidden="true">•</span>';
        const current = item.active ? 'page' : 'false';
        const tabIndex = item.active ? '0' : '-1';
        const disabled = item.disabled ? 'disabled' : '';

        return `
          <li>
            <button
              type="button"
              class="nav-item"
              data-index="${index}"
              data-value="${escapeHtml(item.value)}"
              aria-current="${current}"
              tabindex="${tabIndex}"
              ${disabled}
            >
              ${icon}
              <span class="label">${escapeHtml(item.label)}</span>
            </button>
          </li>
        `;
      })
      .join('');

    this.setContent(`
      <style>${style}</style>
      <aside class="shell" role="complementary" aria-label="${position === 'right' ? 'Right Sidebar Navigation' : 'Sidebar Navigation'}">
        <div class="header"><slot name="header"></slot></div>
        ${collapsible
          ? `<div class="collapse-row"><button type="button" class="collapse-btn" aria-label="Toggle sidebar">${this.collapsed ? '»' : '«'}</button></div>`
          : '<div class="collapse-row"></div>'}
        <nav role="navigation">
          <ul class="list">
            ${renderedItems}
          </ul>
        </nav>
        <div class="footer"><slot name="footer"></slot></div>
      </aside>
      <div class="source-items" aria-hidden="true"><slot name="item"></slot></div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-sidebar')) {
  customElements.define('ui-sidebar', UISidebar);
}
