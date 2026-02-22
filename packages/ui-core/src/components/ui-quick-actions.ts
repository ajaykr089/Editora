import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-quick-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent);
    --ui-quick-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-quick-text: var(--ui-color-text, #0f172a);
    --ui-quick-muted: var(--ui-color-muted, #64748b);
    --ui-quick-accent: var(--ui-color-primary, #2563eb);
    --ui-quick-focus: var(--ui-color-focus-ring, #2563eb);

    display: block;
    min-inline-size: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--ui-quick-border);
    border-radius: 999px;
    background: var(--ui-quick-bg);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
    padding: 8px;
    color: var(--ui-quick-text);
  }

  :host([orientation="vertical"]) .root {
    flex-direction: column;
    border-radius: 16px;
    align-items: stretch;
  }

  :host([mode="fab"]) .root {
    padding: 6px;
    border-radius: 14px;
    display: inline-grid;
    gap: 8px;
  }

  .toggle {
    inline-size: 36px;
    block-size: 36px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--ui-quick-border) 82%, transparent);
    background: color-mix(in srgb, var(--ui-quick-accent) 14%, transparent);
    color: color-mix(in srgb, var(--ui-quick-accent) 88%, #0f172a 12%);
    font-size: 17px;
    line-height: 1;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    transition: border-color 120ms ease, background-color 120ms ease;
  }

  .toggle:hover {
    border-color: color-mix(in srgb, var(--ui-quick-accent) 42%, var(--ui-quick-border));
  }

  .toggle:focus-visible {
    outline: 2px solid var(--ui-quick-focus);
    outline-offset: 1px;
  }

  .actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-inline-size: 0;
  }

  :host([orientation="vertical"]) .actions,
  :host([mode="fab"]) .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions[hidden] {
    display: none;
  }

  ::slotted([slot="action"]) {
    border: 1px solid color-mix(in srgb, var(--ui-quick-border) 84%, transparent);
    border-radius: 10px;
    background: color-mix(in srgb, var(--ui-quick-bg) 98%, transparent);
    color: inherit;
    font: 600 12px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    padding: 8px 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }

  ::slotted([slot="action"]:focus-visible) {
    outline: 2px solid var(--ui-quick-focus);
    outline-offset: 1px;
  }

  :host([variant="soft"]) {
    --ui-quick-bg: color-mix(in srgb, var(--ui-quick-accent) 9%, var(--ui-color-surface, #ffffff));
    --ui-quick-border: color-mix(in srgb, var(--ui-quick-accent) 26%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="contrast"]) {
    --ui-quick-bg: #0f172a;
    --ui-quick-border: #334155;
    --ui-quick-text: #e2e8f0;
    --ui-quick-muted: #93a4bd;
    --ui-quick-accent: #93c5fd;
    --ui-quick-focus: #93c5fd;
  }

  :host([variant="minimal"]) .root {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }

  :host([floating]) {
    position: fixed;
    z-index: 1250;
  }

  :host([floating][placement="bottom-right"]) {
    right: 16px;
    bottom: 16px;
  }

  :host([floating][placement="bottom-left"]) {
    left: 16px;
    bottom: 16px;
  }

  :host([floating][placement="top-right"]) {
    right: 16px;
    top: 16px;
  }

  :host([floating][placement="top-left"]) {
    left: 16px;
    top: 16px;
  }

  :host([headless]) .root {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .root,
    .toggle,
    ::slotted([slot="action"]) {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .root,
    .toggle,
    ::slotted([slot="action"]) {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-quick-bg: Canvas;
      --ui-quick-border: CanvasText;
      --ui-quick-text: CanvasText;
      --ui-quick-muted: CanvasText;
      --ui-quick-accent: Highlight;
      --ui-quick-focus: Highlight;
    }

    .root,
    .toggle,
    ::slotted([slot="action"]) {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }

    .toggle {
      border-color: Highlight;
    }
  }
`;

let quickActionsInstanceId = 0;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UIQuickActions extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'mode',
      'orientation',
      'variant',
      'floating',
      'placement',
      'collapsible',
      'label',
      'headless'
    ];
  }

  private readonly _instanceId = ++quickActionsInstanceId;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);

    if (this.getAttribute('mode') !== 'fab' && !this.hasAttribute('collapsible') && !this.hasAttribute('open')) {
      this.setAttribute('open', '');
    }
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(next: boolean) {
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  show(): void {
    this.toggle(true);
  }

  hide(): void {
    this.toggle(false);
  }

  toggle(force?: boolean): void {
    const next = typeof force === 'boolean' ? force : !this.open;
    this.open = next;

    const detail = { open: next };
    this.dispatchEvent(new CustomEvent(next ? 'open' : 'close', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('toggle', { detail, bubbles: true, composed: true }));
  }

  private _actions(): HTMLElement[] {
    const slot = this.root.querySelector('slot[name="action"]') as HTMLSlotElement | null;
    if (!slot) return [];
    return slot.assignedElements({ flatten: true }).filter((node): node is HTMLElement => node instanceof HTMLElement);
  }

  private _actionsId(): string {
    return `ui-quick-actions-${this._instanceId}-actions`;
  }

  private _syncActionAccessibility(showActions: boolean): void {
    const actions = this._actions();
    actions.forEach((action, index) => {
      if (!action.id) action.id = `ui-quick-actions-${this._instanceId}-action-${index + 1}`;
      if (!action.hasAttribute('role')) action.setAttribute('role', 'button');

      if (!action.hasAttribute('aria-label')) {
        const label = action.textContent?.trim();
        if (label) action.setAttribute('aria-label', label);
      }

      if (showActions) {
        const previousTabIndex = action.getAttribute('data-ui-quick-tabindex');
        if (previousTabIndex != null) {
          if (previousTabIndex === '__none__') action.removeAttribute('tabindex');
          else action.setAttribute('tabindex', previousTabIndex);
          action.removeAttribute('data-ui-quick-tabindex');
        } else if (!action.hasAttribute('tabindex')) {
          action.setAttribute('tabindex', '0');
        }
        action.setAttribute('aria-hidden', 'false');
        return;
      }

      if (!action.hasAttribute('data-ui-quick-tabindex')) {
        action.setAttribute('data-ui-quick-tabindex', action.getAttribute('tabindex') ?? '__none__');
      }
      action.setAttribute('tabindex', '-1');
      action.setAttribute('aria-hidden', 'true');
    });
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const toggle = target.closest('.toggle');
    if (toggle) {
      this.toggle();
      return;
    }

    const path = event.composedPath();
    const actions = this._actions();
    const action = actions.find((entry) => path.includes(entry));
    if (!action) return;

    const index = actions.indexOf(action);
    const detail = {
      index,
      id: action.id || action.getAttribute('data-id') || String(index + 1),
      label: action.getAttribute('aria-label') || action.textContent?.trim() || `Action ${index + 1}`
    };

    this.dispatchEvent(new CustomEvent('select', { detail, bubbles: true, composed: true }));

    if (this.getAttribute('mode') === 'fab') {
      this.hide();
    }
  }

  private _moveFocus(current: HTMLElement, delta: number): void {
    const actions = this._actions();
    if (!actions.length) return;
    const index = actions.indexOf(current);
    if (index < 0) return;
    const next = (index + delta + actions.length) % actions.length;
    actions[next].focus();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open && this.getAttribute('mode') === 'fab') {
      event.preventDefault();
      this.hide();
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target) return;
    const actions = this._actions();
    const activeAction = actions.find((entry) => entry === target || entry.contains(target));
    if (!activeAction) return;

    const vertical = this.getAttribute('orientation') === 'vertical' || this.getAttribute('mode') === 'fab';
    const rtl = !vertical && getComputedStyle(this).direction === 'rtl';
    const nextKey = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === nextKey) {
      event.preventDefault();
      this._moveFocus(activeAction, 1);
      return;
    }

    if (event.key === prevKey) {
      event.preventDefault();
      this._moveFocus(activeAction, -1);
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const enabled = this._actions();
      if (!enabled.length) return;
      (event.key === 'Home' ? enabled[0] : enabled[enabled.length - 1]).focus();
    }
  }

  protected override render(): void {
    const mode = this.getAttribute('mode') === 'fab' ? 'fab' : 'bar';
    const collapsible = this.hasAttribute('collapsible') || mode === 'fab';
    const showActions = this.open || (!collapsible && mode === 'bar');
    const label = this.getAttribute('label') || 'Quick actions';

    const actionsId = this._actionsId();
    const orientation = this.getAttribute('orientation') === 'vertical' || mode === 'fab' ? 'vertical' : 'horizontal';
    this.setContent(`
      <style>${style}</style>
      <section class="root" part="root" role="toolbar" aria-label="${escapeHtml(label)}" aria-orientation="${orientation}">
        ${collapsible ? `<button type="button" class="toggle" part="toggle" aria-label="${escapeHtml(label)}" aria-controls="${actionsId}" aria-haspopup="true" aria-expanded="${showActions ? 'true' : 'false'}">${showActions ? '−' : '+'}</button>` : ''}
        <div id="${actionsId}" class="actions" part="actions" role="group" aria-label="${escapeHtml(label)} list" ${showActions ? '' : 'hidden'}>
          <slot name="action"></slot>
        </div>
      </section>
    `);
    this._syncActionAccessibility(showActions);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-quick-actions')) {
  customElements.define('ui-quick-actions', UIQuickActions);
}
