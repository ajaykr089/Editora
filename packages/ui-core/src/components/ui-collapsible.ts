import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-collapsible-radius: 12px;
    --ui-collapsible-border: 1px solid var(--ui-color-border, rgba(15, 23, 42, 0.14));
    --ui-collapsible-bg: var(--ui-color-surface, #ffffff);
    --ui-collapsible-header-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--ui-color-surface, #ffffff));
    --ui-collapsible-header-hover: color-mix(in srgb, var(--ui-color-primary, #2563eb) 8%, var(--ui-color-surface-alt, #f8fafc));
    --ui-collapsible-text: var(--ui-color-text, #0f172a);
    --ui-collapsible-muted: var(--ui-color-muted, #64748b);
    --ui-collapsible-focus-ring: var(--ui-color-focus-ring, #2563eb);
    --ui-collapsible-padding-x: 14px;
    --ui-collapsible-padding-y: 12px;
    --ui-collapsible-duration: 210ms;
    --ui-collapsible-easing: cubic-bezier(0.2, 0.8, 0.2, 1);

    display: block;
    color-scheme: light dark;
  }

  .shell {
    border: var(--ui-collapsible-border);
    border-radius: var(--ui-collapsible-radius);
    background: var(--ui-collapsible-bg);
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.06), 0 8px 18px rgba(2, 6, 23, 0.06);
  }

  .trigger {
    margin: 0;
    width: 100%;
    border: 0;
    background: var(--ui-collapsible-header-bg);
    color: var(--ui-collapsible-text);
    cursor: pointer;
    text-align: left;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.35;
    padding: var(--ui-collapsible-padding-y) var(--ui-collapsible-padding-x);
    transition:
      background var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      color var(--ui-collapsible-duration) var(--ui-collapsible-easing);
  }

  .trigger:hover {
    background: var(--ui-collapsible-header-hover);
  }

  .trigger:focus-visible {
    outline: 2px solid var(--ui-collapsible-focus-ring);
    outline-offset: -2px;
    position: relative;
    z-index: 1;
  }

  .header-content {
    min-width: 0;
  }

  .chevron {
    width: 16px;
    min-width: 16px;
    height: 16px;
    color: var(--ui-collapsible-muted);
    transition:
      transform var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      color var(--ui-collapsible-duration) var(--ui-collapsible-easing);
  }

  :host([open]) .chevron {
    transform: rotate(180deg);
    color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 80%, var(--ui-collapsible-text) 20%);
  }

  .panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--ui-collapsible-duration) var(--ui-collapsible-easing);
  }

  :host([open]) .panel {
    grid-template-rows: 1fr;
  }

  .panel-inner {
    min-height: 0;
    overflow: hidden;
    color: color-mix(in srgb, var(--ui-collapsible-text) 88%, var(--ui-collapsible-muted) 12%);
    font-size: 14px;
    line-height: 1.55;
    padding: 0 var(--ui-collapsible-padding-x);
    border-top: 1px solid transparent;
    opacity: 0;
    transform: translateY(-4px);
    transition:
      opacity var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      transform var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      padding var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      border-color var(--ui-collapsible-duration) var(--ui-collapsible-easing);
  }

  :host([open]) .panel-inner {
    opacity: 1;
    transform: translateY(0);
    padding: 0 var(--ui-collapsible-padding-x) 14px;
    border-top-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 20%, transparent);
  }

  :host([headless]) .shell {
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }

  :host([headless]) .trigger {
    padding: 0;
    background: transparent;
  }

  :host([headless]) .trigger:hover {
    background: transparent;
  }

  :host([headless]) .panel-inner {
    padding-inline: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .trigger,
    .panel,
    .panel-inner,
    .chevron {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-collapsible-border: 2px solid currentColor;
      --ui-collapsible-focus-ring: currentColor;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-collapsible-bg: Canvas;
      --ui-collapsible-border: 1px solid CanvasText;
      --ui-collapsible-header-bg: Canvas;
      --ui-collapsible-header-hover: Canvas;
      --ui-collapsible-text: CanvasText;
      --ui-collapsible-muted: CanvasText;
      --ui-collapsible-focus-ring: Highlight;
    }
  }
`;

function isTruthyAttr(value: string | null): boolean {
  return value !== null && value.toLowerCase() !== 'false' && value !== '0';
}

export class UICollapsible extends ElementBase {
  static get observedAttributes() {
    return ['open', 'headless'];
  }

  private _uid = `ui-collapsible-${Math.random().toString(36).slice(2, 9)}`;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this._applyOpenState();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'open') {
      const applied = this._applyOpenState();
      if (applied) return;
    }
    this.requestRender();
  }

  get open() {
    return isTruthyAttr(this.getAttribute('open'));
  }

  set open(value: boolean) {
    const next = Boolean(value);
    if (next === this.open) return;
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  get headless() {
    return this.hasAttribute('headless');
  }

  set headless(value: boolean) {
    if (value === this.headless) return;
    if (value) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  private _setOpenFromUser(nextOpen: boolean) {
    const previous = this.open;
    this.open = nextOpen;
    if (previous === this.open) return;
    const detail = { open: this.open };
    this.dispatchEvent(new CustomEvent('toggle', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const trigger = target?.closest('.trigger');
    if (!trigger) return;
    this._setOpenFromUser(!this.open);
  }

  private _applyOpenState(): boolean {
    const trigger = this.root.querySelector('.trigger') as HTMLButtonElement | null;
    const panel = this.root.querySelector('.panel') as HTMLElement | null;
    if (!trigger || !panel) return false;

    const open = this.open;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    return true;
  }

  protected render() {
    const open = this.open;
    const triggerId = `${this._uid}-trigger`;
    const panelId = `${this._uid}-panel`;

    this.setContent(`
      <style>${style}</style>
      <section class="shell" part="base">
        <button
          id="${triggerId}"
          class="trigger"
          part="header"
          type="button"
          aria-controls="${panelId}"
          aria-expanded="${open ? 'true' : 'false'}"
        >
          <span class="header-content"><slot name="header">Details</slot></span>
          <span class="chevron" part="icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 7.5 10 12.5 15 7.5"></path>
            </svg>
          </span>
        </button>
        <div
          id="${panelId}"
          class="panel"
          part="content"
          role="region"
          aria-labelledby="${triggerId}"
          aria-hidden="${open ? 'false' : 'true'}"
        >
          <div class="panel-inner" part="content-inner"><slot></slot></div>
        </div>
      </section>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-collapsible')) {
  customElements.define('ui-collapsible', UICollapsible);
}
