import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-app-header-height: 64px;
    --ui-app-header-height-dense: 52px;
    --ui-app-header-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-surface, var(--ui-surface, #ffffff)) 98%, transparent) 0%,
      color-mix(in srgb, var(--ui-color-surface-alt, var(--ui-surface-alt, #f8fafc)) 20%, var(--ui-color-surface, var(--ui-surface, #ffffff))) 100%
    );
    --ui-app-header-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-app-header-muted: var(--ui-color-muted, #64748b);
    --ui-app-header-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-app-header-border-color: color-mix(in srgb, var(--ui-color-border, var(--ui-border, rgba(15, 23, 42, 0.14))) 86%, transparent);
    --ui-app-header-border: 1px solid var(--ui-app-header-border-color);
    --ui-app-header-control-bg: color-mix(in srgb, var(--ui-color-surface, var(--ui-surface, #ffffff)) 86%, transparent);
    --ui-app-header-control-bg-hover: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 8%, var(--ui-color-surface-alt, var(--ui-surface-alt, #f8fafc)));
    --ui-app-header-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-app-header-gap: 12px;
    --ui-app-header-padding-x: 16px;
    --ui-app-header-radius: 0px;
    --ui-app-header-z: 60;
    --ui-app-header-shadow: var(--ui-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.06), 0 14px 24px rgba(15, 23, 42, 0.06));
    --ui-app-header-duration: 170ms;
    --ui-app-header-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
    color-scheme: light dark;
  }

  header {
    position: relative;
    min-height: var(--ui-app-header-height);
    display: grid;
    grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto);
    align-items: center;
    gap: var(--ui-app-header-gap);
    background: var(--ui-app-header-bg);
    color: var(--ui-app-header-color);
    border-bottom: 1px solid var(--ui-app-header-border-color);
    padding: 0 var(--ui-app-header-padding-x);
    box-sizing: border-box;
    border-radius: var(--ui-app-header-radius);
    backdrop-filter: blur(3px) saturate(1.04);
    transition:
      border-color var(--ui-app-header-duration) var(--ui-app-header-easing),
      box-shadow var(--ui-app-header-duration) var(--ui-app-header-easing);
  }

  header::before {
    content: '';
    position: absolute;
    inset: 0;
    border-top: 1px solid color-mix(in srgb, #ffffff 72%, transparent);
    pointer-events: none;
  }

  :host([dense]) header {
    min-height: var(--ui-app-header-height-dense);
  }

  :host([bordered]) header {
    border-bottom-color: var(--ui-app-header-border-color);
  }

  :host(:not([bordered])) header {
    border-bottom-color: transparent;
  }

  :host([sticky]) {
    position: sticky;
    top: 0;
    z-index: var(--ui-app-header-z);
    box-shadow: var(--ui-app-header-shadow);
  }

  .start,
  .center,
  .end {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .start {
    justify-content: flex-start;
  }

  .center {
    justify-content: flex-start;
    overflow: hidden;
    gap: 12px;
  }

  .center-left {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    overflow: hidden;
  }

  .title-wrap {
    min-width: 0;
    display: grid;
    gap: 0;
  }

  .title-slot {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.01em;
    line-height: 1.25;
  }

  .subtitle-slot {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: 500;
    color: var(--ui-app-header-muted);
    line-height: 1.3;
  }

  .title-slot:empty + .subtitle-slot,
  .subtitle-slot:empty {
    display: none;
  }

  .end {
    justify-content: flex-end;
    gap: 8px;
  }

  .menu-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: var(--ui-app-header-border);
    background: var(--ui-app-header-control-bg);
    color: var(--ui-app-header-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    line-height: 1;
    transition:
      background var(--ui-app-header-duration) var(--ui-app-header-easing),
      border-color var(--ui-app-header-duration) var(--ui-app-header-easing),
      transform 120ms ease;
  }

  .menu-btn svg {
    width: 16px;
    height: 16px;
    pointer-events: none;
  }

  .menu-btn:hover {
    background: var(--ui-app-header-control-bg-hover);
    border-color: color-mix(in srgb, var(--ui-app-header-accent) 40%, var(--ui-app-header-border-color));
  }

  .menu-btn:active {
    transform: translateY(1px);
  }

  .menu-btn:focus-visible {
    outline: 2px solid var(--ui-app-header-focus-ring);
    outline-offset: 1px;
  }

  .menu-btn[hidden] {
    display: none;
  }

  :host([headless]) header {
    display: none;
  }

  @media (max-width: 900px) {
    :host {
      --ui-app-header-padding-x: 12px;
      --ui-app-header-gap: 10px;
    }
  }

  @media (max-width: 720px) {
    .center {
      gap: 8px;
    }

    .subtitle-slot {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    header,
    .menu-btn {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-app-header-border: 2px solid var(--ui-app-header-border-color);
      --ui-app-header-shadow: none;
      --ui-app-header-control-bg-hover: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 18%, transparent);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-app-header-bg: Canvas;
      --ui-app-header-color: CanvasText;
      --ui-app-header-border-color: CanvasText;
      --ui-app-header-shadow: none;
      --ui-app-header-control-bg: Canvas;
      --ui-app-header-control-bg-hover: Highlight;
      --ui-app-header-focus-ring: Highlight;
      --ui-app-header-muted: CanvasText;
    }
  }
`;

export class UIAppHeader extends ElementBase {
  static get observedAttributes() {
    return ['sticky', 'bordered', 'dense', 'headless', 'show-menu-button'];
  }

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    super.disconnectedCallback();
  }

  private _onRootClick(event: Event) {
    const target = event.target as HTMLElement;
    const menuBtn = target.closest('.menu-btn');
    if (!menuBtn) return;

    this.dispatchEvent(
      new CustomEvent('menu-trigger', {
        bubbles: true,
      })
    );
  }

  protected render() {
    const showMenuButton = this.hasAttribute('show-menu-button');
    const hasSubtitleSlot = Boolean(this.querySelector('[slot="subtitle"]'));

    this.setContent(`
      <style>${style}</style>
      <header role="banner">
        <div class="start">
          <button
            type="button"
            class="menu-btn"
            aria-label="Open navigation"
            ${showMenuButton ? '' : 'hidden'}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M4 5.5h12M4 10h12M4 14.5h12"></path>
            </svg>
          </button>
          <slot name="start"></slot>
        </div>

        <div class="center">
          <div class="center-left">
            <slot name="center"></slot>
            <div class="title-wrap">
              <span class="title-slot"><slot name="title"></slot></span>
              ${hasSubtitleSlot ? '<span class="subtitle-slot"><slot name="subtitle"></slot></span>' : ''}
            </div>
          </div>
        </div>

        <div class="end">
          <slot name="end"></slot>
        </div>
      </header>
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-app-header')) {
  customElements.define('ui-app-header', UIAppHeader);
}
