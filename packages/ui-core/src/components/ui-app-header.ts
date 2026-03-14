import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-app-header-height: var(--base-app-header-height, 64px);
    --ui-app-header-height-dense: var(--base-app-header-height-dense, 52px);
    --ui-app-header-height-large: 76px;
    --ui-app-header-bg-base: var(--base-app-header-bg, var(--color-panel, var(--ui-color-surface, #ffffff)));
    --ui-app-header-bg: var(--ui-app-header-bg-base);
    --ui-app-header-color: var(--ui-color-text, var(--ui-text, #202020));
    --ui-app-header-muted: color-mix(in srgb, var(--ui-app-header-color) 56%, var(--ui-color-muted, var(--ui-muted, #646464)) 44%);
    --ui-app-header-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-app-header-border-color: color-mix(in srgb, var(--ui-color-border, var(--ui-border, rgba(15, 23, 42, 0.14))) 84%, transparent);
    --ui-app-header-border: var(--base-app-header-border, 1px solid var(--ui-app-header-border-color));
    --ui-app-header-control-bg: color-mix(in srgb, var(--ui-app-header-bg-base) 90%, transparent);
    --ui-app-header-control-bg-hover: color-mix(in srgb, var(--ui-app-header-accent) 8%, var(--ui-app-header-bg-base));
    --ui-app-header-control-color: var(--ui-app-header-color);
    --ui-app-header-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-app-header-gap: var(--base-app-header-gap, var(--ui-default-gap, 8px));
    --ui-app-header-padding-x: var(--base-app-header-padding, 16px);
    --ui-app-header-radius: var(--base-app-header-radius, var(--ui-radius, 4px));
    --ui-app-header-z: 60;
    --ui-app-header-shadow: var(--base-app-header-shadow, none);
    --ui-app-header-title-size: var(--ui-default-font-size, 14px);
    --ui-app-header-title-line-height: var(--ui-default-line-height, 20px);
    --ui-app-header-title-weight: 600;
    --ui-app-header-subtitle-size: 12px;
    --ui-app-header-subtitle-line-height: 16px;
    --ui-app-header-subtitle-weight: 500;
    --ui-app-header-control-radius: var(--base-app-header-control-radius, var(--ui-radius, 4px));
    --ui-app-header-duration: var(--ui-motion-base, 170ms);
    --ui-app-header-easing: var(--ui-motion-easing, cubic-bezier(0.2, 0.8, 0.2, 1));
    color-scheme: light dark;
  }

  :host([size='1']),
  :host([size='sm']),
  :host([dense]) {
    --ui-app-header-height: var(--ui-app-header-height-dense);
    --ui-app-header-gap: 10px;
    --ui-app-header-padding-x: 12px;
    --ui-app-header-title-size: 13px;
    --ui-app-header-title-line-height: 18px;
    --ui-app-header-subtitle-size: 11px;
    --ui-app-header-subtitle-line-height: 14px;
  }

  :host([size='2']),
  :host([size='md']) {
    --ui-app-header-height: var(--base-app-header-height, 64px);
  }

  :host([size='3']),
  :host([size='lg']) {
    --ui-app-header-height: var(--ui-app-header-height-large);
    --ui-app-header-gap: 14px;
    --ui-app-header-padding-x: 20px;
    --ui-app-header-title-size: 16px;
    --ui-app-header-title-line-height: 22px;
    --ui-app-header-subtitle-size: 13px;
    --ui-app-header-subtitle-line-height: 18px;
  }

  :host([variant='outline']) {
    --ui-app-header-bg: color-mix(in srgb, var(--ui-app-header-bg-base) 88%, transparent);
    --ui-app-header-shadow: none;
    --ui-app-header-border: 1px solid color-mix(in srgb, var(--ui-app-header-accent) 18%, var(--ui-app-header-border-color));
  }

  :host([variant='soft']) {
    --ui-app-header-bg: color-mix(in srgb, var(--ui-app-header-accent) 8%, var(--ui-app-header-bg-base));
    --ui-app-header-border: 1px solid color-mix(in srgb, var(--ui-app-header-accent) 14%, var(--ui-app-header-border-color));
  }

  :host([variant='solid']) {
    --ui-app-header-bg: var(--ui-app-header-accent);
    --ui-app-header-color: #ffffff;
    --ui-app-header-muted: color-mix(in srgb, #ffffff 76%, transparent);
    --ui-app-header-border: 1px solid color-mix(in srgb, #000000 16%, transparent);
    --ui-app-header-control-bg: color-mix(in srgb, #ffffff 14%, transparent);
    --ui-app-header-control-bg-hover: color-mix(in srgb, #ffffff 24%, transparent);
    --ui-app-header-control-color: #ffffff;
    --ui-app-header-focus-ring: color-mix(in srgb, #ffffff 72%, var(--ui-app-header-accent) 28%);
  }

  :host([elevation='none']) {
    --ui-app-header-shadow: none;
  }

  :host([elevation='low']) {
    --ui-app-header-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 10px 22px rgba(15, 23, 42, 0.09);
  }

  :host([elevation='high']) {
    --ui-app-header-shadow: 0 2px 10px rgba(15, 23, 42, 0.08), 0 18px 36px rgba(15, 23, 42, 0.16);
  }

  :host([tone='info']) {
    --ui-app-header-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
  }

  :host([tone='success']) {
    --ui-app-header-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone='warning']) {
    --ui-app-header-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone='danger']) {
    --ui-app-header-accent: var(--ui-color-danger, #dc2626);
  }

  :host([sticky]) {
    position: sticky;
    top: 0;
    z-index: var(--ui-app-header-z);
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
    border: var(--ui-app-header-border);
    padding: 0 var(--ui-app-header-padding-x);
    box-sizing: border-box;
    border-radius: var(--ui-app-header-radius);
    box-shadow: var(--ui-app-header-shadow);
    backdrop-filter: blur(6px) saturate(1.05);
    transition:
      background var(--ui-app-header-duration) var(--ui-app-header-easing),
      border-color var(--ui-app-header-duration) var(--ui-app-header-easing),
      box-shadow var(--ui-app-header-duration) var(--ui-app-header-easing);
  }

  header::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 72%, transparent);
  }

  :host(:not([bordered])) header {
    border-color: transparent;
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
    gap: 1px;
  }

  .title-slot {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: var(--ui-app-header-title-size);
    line-height: var(--ui-app-header-title-line-height);
    font-weight: var(--ui-app-header-title-weight);
    letter-spacing: var(--ui-default-letter-spacing, 0em);
  }

  .subtitle-slot {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: var(--ui-app-header-subtitle-size);
    line-height: var(--ui-app-header-subtitle-line-height);
    font-weight: var(--ui-app-header-subtitle-weight);
    color: var(--ui-app-header-muted);
  }

  .title-slot:empty {
    display: none;
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
    border-radius: var(--ui-app-header-control-radius);
    border: 1px solid color-mix(in srgb, var(--ui-app-header-border-color) 92%, transparent);
    background: var(--ui-app-header-control-bg);
    color: var(--ui-app-header-control-color);
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    line-height: 1;
    box-sizing: border-box;
    transition:
      background var(--ui-app-header-duration) var(--ui-app-header-easing),
      border-color var(--ui-app-header-duration) var(--ui-app-header-easing),
      transform 120ms ease;
  }

  :host([show-menu-button]) .menu-btn {
    display: inline-flex;
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
      --ui-app-header-control-bg-hover: color-mix(in srgb, var(--ui-app-header-accent) 18%, transparent);
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
      --ui-app-header-control-color: CanvasText;
      --ui-app-header-focus-ring: Highlight;
      --ui-app-header-muted: CanvasText;
    }
  }
`;

export class UIAppHeader extends ElementBase {
  static get observedAttributes() {
    return [
      'sticky',
      'bordered',
      'dense',
      'headless',
      'show-menu-button',
      'variant',
      'tone',
      'size',
      'radius',
      'elevation',
    ];
  }

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
  }

  private _normalizeRadius(value: string | null): string {
    if (value == null) return 'var(--base-app-header-radius, var(--ui-radius, 4px))';
    const normalized = value.trim().toLowerCase();
    if (!normalized) return 'var(--base-app-header-radius, var(--ui-radius, 4px))';
    if (normalized === 'full' || normalized === 'pill') return '999px';
    if (/^-?\d+(\.\d+)?$/.test(normalized)) return `${normalized}px`;
    return value;
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
    this.style.setProperty('--ui-app-header-radius', this._normalizeRadius(this.getAttribute('radius')));
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    super.disconnectedCallback();
  }

  private _onRootClick(event: Event) {
    const target = event.target as HTMLElement | null;
    const menuBtn = target?.closest('.menu-btn');
    if (!menuBtn) return;

    this.dispatchEvent(
      new CustomEvent('menu-trigger', {
        bubbles: true,
      })
    );
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'radius') {
      this.style.setProperty('--ui-app-header-radius', this._normalizeRadius(newValue));
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  protected render() {
    this.setContent(`
      <style>${style}</style>
      <header role="banner">
        <div class="start">
          <button
            type="button"
            class="menu-btn"
            aria-label="Open navigation"
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
              <span class="subtitle-slot"><slot name="subtitle"></slot></span>
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
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return name === 'show-menu-button';
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-app-header')) {
  customElements.define('ui-app-header', UIAppHeader);
}
