import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-toolbar-gap: 8px;
    --ui-toolbar-padding: 8px;
    --ui-toolbar-radius: 12px;
    --ui-toolbar-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-toolbar-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-toolbar-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 12px 26px rgba(15, 23, 42, 0.08);

    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
    box-sizing: border-box;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .toolbar {
    min-inline-size: 0;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: var(--ui-toolbar-gap);
    padding: var(--ui-toolbar-padding);
    border: 1px solid var(--ui-toolbar-border);
    border-radius: var(--ui-toolbar-radius);
    background: var(--ui-toolbar-bg);
    box-shadow: var(--ui-toolbar-shadow);
  }

  :host([orientation="vertical"]) .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  :host([wrap]) .toolbar {
    flex-wrap: wrap;
  }

  .toolbar ::slotted([data-separator]),
  .toolbar ::slotted(hr) {
    border: 0;
    inline-size: 1px;
    block-size: 20px;
    background: color-mix(in srgb, var(--ui-toolbar-border) 82%, transparent);
    margin: 0 2px;
  }

  :host([orientation="vertical"]) .toolbar ::slotted([data-separator]),
  :host([orientation="vertical"]) .toolbar ::slotted(hr) {
    inline-size: 100%;
    block-size: 1px;
  }

  :host([variant="soft"]) {
    --ui-toolbar-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 8%, var(--ui-color-surface, #ffffff));
    --ui-toolbar-border: color-mix(in srgb, var(--ui-color-primary, #2563eb) 24%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="contrast"]) {
    --ui-toolbar-bg: #0f172a;
    --ui-toolbar-border: #334155;
    --ui-toolbar-shadow:
      0 10px 24px rgba(2, 6, 23, 0.42),
      0 24px 50px rgba(2, 6, 23, 0.38);
  }

  :host([variant="minimal"]) .toolbar {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    padding-inline: 0;
  }

  :host([size="sm"]) {
    --ui-toolbar-gap: 6px;
    --ui-toolbar-padding: 6px;
    --ui-toolbar-radius: 10px;
  }

  :host([size="lg"]) {
    --ui-toolbar-gap: 10px;
    --ui-toolbar-padding: 10px;
    --ui-toolbar-radius: 14px;
  }

  :host([density="compact"]) {
    --ui-toolbar-gap: 5px;
    --ui-toolbar-padding: 5px;
  }

  :host([density="comfortable"]) {
    --ui-toolbar-gap: 11px;
    --ui-toolbar-padding: 11px;
  }

  :host([headless]) .toolbar {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .toolbar {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .toolbar {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-toolbar-bg: Canvas;
      --ui-toolbar-border: CanvasText;
      --ui-toolbar-shadow: none;
    }
  }
`;

function isFocusable(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return false;
  const tabIndex = el.getAttribute('tabindex');
  if (tabIndex === '-1') return false;

  const tag = el.tagName.toLowerCase();
  if (['button', 'input', 'select', 'textarea', 'a'].includes(tag)) return true;
  if (el.hasAttribute('tabindex')) return true;
  if (tag.startsWith('ui-')) return true;
  return false;
}

export class UIToolbar extends ElementBase {
  static get observedAttributes() {
    return [
      'orientation',
      'headless',
      'variant',
      'size',
      'density',
      'wrap',
      'loop',
      'aria-label'
    ];
  }

  constructor() {
    super();
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  private _focusables(): HTMLElement[] {
    const slot = this.root.querySelector('slot') as HTMLSlotElement | null;
    if (!slot) return [];

    const assigned = slot.assignedElements({ flatten: true });
    const focusables: HTMLElement[] = [];

    const pushIfFocusable = (element: Element) => {
      if (isFocusable(element)) focusables.push(element);
    };

    assigned.forEach((node) => {
      pushIfFocusable(node);
      node
        .querySelectorAll('button, [tabindex], a[href], input:not([type="hidden"]), select, textarea, ui-button, ui-toggle, ui-input, ui-select')
        .forEach(pushIfFocusable);
    });

    const seen = new Set<HTMLElement>();
    return focusables.filter((item) => {
      if (seen.has(item)) return false;
      seen.add(item);
      return true;
    });
  }

  private _moveFocus(current: HTMLElement, direction: 1 | -1): void {
    const items = this._focusables();
    if (items.length < 2) return;

    const index = items.indexOf(current);
    if (index < 0) return;

    const loop = this.hasAttribute('loop') || !this.hasAttribute('no-loop');
    let next = index + direction;

    if (loop) {
      next = (next + items.length) % items.length;
    } else {
      if (next < 0 || next >= items.length) return;
    }

    const target = items[next];
    items.forEach((item) => item.setAttribute('tabindex', item === target ? '0' : '-1'));
    target.focus();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';

    if ((orientation === 'horizontal' && event.key === 'ArrowRight') || (orientation === 'vertical' && event.key === 'ArrowDown')) {
      event.preventDefault();
      this._moveFocus(target, 1);
      return;
    }

    if ((orientation === 'horizontal' && event.key === 'ArrowLeft') || (orientation === 'vertical' && event.key === 'ArrowUp')) {
      event.preventDefault();
      this._moveFocus(target, -1);
      return;
    }

    if (event.key === 'Home') {
      const items = this._focusables();
      if (!items.length) return;
      event.preventDefault();
      items.forEach((item, index) => item.setAttribute('tabindex', index === 0 ? '0' : '-1'));
      items[0].focus();
      return;
    }

    if (event.key === 'End') {
      const items = this._focusables();
      if (!items.length) return;
      event.preventDefault();
      const last = items.length - 1;
      items.forEach((item, index) => item.setAttribute('tabindex', index === last ? '0' : '-1'));
      items[last].focus();
    }
  }

  protected override render(): void {
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    const ariaLabel = this.getAttribute('aria-label') || 'Toolbar';

    this.setContent(`
      <style>${style}</style>
      <div class="toolbar" part="toolbar" role="toolbar" aria-label="${ariaLabel}" aria-orientation="${orientation}">
        <slot></slot>
      </div>
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-toolbar')) {
  customElements.define('ui-toolbar', UIToolbar);
}
