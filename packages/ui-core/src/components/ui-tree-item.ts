import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-tree-indent: 16px;
    --ui-tree-level: 1;
    display: block;
    min-inline-size: 0;
    color: inherit;
  }

  :host([hidden]) {
    display: none !important;
  }

  .row {
    min-inline-size: 0;
    min-block-size: 34px;
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    padding: 6px 10px 6px calc(10px + (var(--ui-tree-level) - 1) * var(--ui-tree-indent));
    border-radius: 10px;
    cursor: default;
    outline: none;
    user-select: none;
    color: inherit;
    transition: background-color 140ms ease, color 140ms ease;
  }

  .row:hover {
    background: color-mix(in srgb, var(--ui-color-primary, #2563eb) 8%, transparent);
  }

  .row:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-color-focus-ring, #2563eb) 28%, transparent);
  }

  :host([selected]) .row {
    background: color-mix(in srgb, var(--ui-color-primary, #2563eb) 14%, transparent);
    color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 82%, #0f172a 18%);
    font-weight: 600;
  }

  :host([disabled]) .row {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .twist {
    inline-size: 18px;
    block-size: 18px;
    display: inline-grid;
    place-items: center;
    border-radius: 6px;
    color: color-mix(in srgb, currentColor 66%, transparent);
    transition: transform 140ms ease, background-color 140ms ease;
  }

  .twist[data-has-children="false"] {
    visibility: hidden;
  }

  :host([expanded]) .twist {
    transform: rotate(90deg);
  }

  .prefix,
  .suffix {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 0;
  }

  .label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .children[hidden] {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .row,
    .twist {
      transition: none !important;
    }
  }
`;

export class UITreeItem extends ElementBase {
  static get observedAttributes() {
    return ['expanded', 'selected', 'disabled', 'hidden'];
  }

  private _row: HTMLElement | null = null;
  private _children: HTMLElement | null = null;
  private _twist: HTMLElement | null = null;

  get value(): string {
    return this.getAttribute('value') || this.id || '';
  }

  get label(): string {
    return this.getAttribute('label') || this.textContent?.trim() || '';
  }

  get childItems(): UITreeItem[] {
    return Array.from(this.children).filter((child): child is UITreeItem => child instanceof UITreeItem);
  }

  focusRow(options?: FocusOptions): void {
    if (!this._row) return;
    try {
      this._row.focus(options);
    } catch {
      this._row.focus();
    }
  }

  applyTreeState(options: {
    level: number;
    hasChildren: boolean;
    expanded: boolean;
    selected: boolean;
    active: boolean;
    hidden: boolean;
  }): void {
    this.hidden = options.hidden;
    this.style.setProperty('--ui-tree-level', String(options.level));
    this.toggleAttribute('expanded', options.expanded);
    this.toggleAttribute('selected', options.selected);

    if (!this._row || !this._children || !this._twist) return;

    this._row.tabIndex = options.active ? 0 : -1;
    this._row.setAttribute('aria-level', String(options.level));
    this._row.setAttribute('aria-selected', options.selected ? 'true' : 'false');
    this._row.setAttribute('aria-expanded', options.hasChildren ? String(options.expanded) : 'false');
    this._twist.setAttribute('data-has-children', options.hasChildren ? 'true' : 'false');
    this._children.hidden = !options.hasChildren || !options.expanded;
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="row" part="row" role="treeitem" tabindex="-1">
        <span class="twist" part="twist" data-action="toggle">▸</span>
        <span class="prefix" part="prefix"><slot name="prefix"></slot></span>
        <span class="label" part="label"><slot name="label">${this.label}</slot></span>
        <span class="suffix" part="suffix"><slot name="suffix"></slot></span>
      </div>
      <div class="children" part="children" role="group">
        <slot></slot>
      </div>
    `);
    this._row = this.root.querySelector('.row');
    this._children = this.root.querySelector('.children');
    this._twist = this.root.querySelector('.twist');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tree-item': UITreeItem;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-tree-item')) {
  customElements.define('ui-tree-item', UITreeItem);
}
